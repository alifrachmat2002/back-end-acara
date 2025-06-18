import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, { orderDAO, OrderStatus, TypeOrder, TypeVoucher } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import EventModel from "../models/event.model";
import { FilterQuery } from "mongoose";
import { resolveProjectReferencePath } from "typescript";
import { getId } from "../utils/id";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const user = req.user?.id;

            const payload = {
                ...req.body,
                createdBy: user
            } as TypeOrder;

            await orderDAO.validate(payload);
            const ticket = await TicketModel.findById(payload.ticket);

            if (!ticket) return response.notFound(res, "Ticket is not found");
            if (ticket.quantity < payload.quantity) {
                return response.error(res, null, "Ticket is not available or sold out")
            }

            const total: number = +ticket?.price * +payload.quantity;
            
            Object.assign(payload, {
                ...payload,
                total,
            });

            const result = await OrderModel.create(payload);

            return response.success(res, result, "Order created successfully!");
        } catch (error) {
            return response.error(res, error,"Failed creating order.")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {          
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TypeOrder> = {};

                if (filter.search) query.$text = { $search: filter.search };

                return query;
            };

            const {
                limit = 10,
                page = 1,
                search,               
            } = req.query;

            const query = buildQuery({
                limit,
                page,
                search
            });

            const result = await OrderModel.find(query)
                .skip((+page - 1) * +limit)
                .limit(+limit)
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            const count = await OrderModel.countDocuments(query);

            return response.pagination(
                res,
                result,
                "Order data fetched successfully!",
                {
                    currentPage: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                }
            );
        } catch (error) {
            return response.error(res, error, "Failed fetching order data.");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const result = await OrderModel.findOne({
                orderId
            });

            if (!result) {
                return response.notFound(res, "Order is not found.");
            }

            return response.success(res, result, "Order data fetched successfully!");
        } catch (error) {
            return response.error(res, error, "Failed fetching order data.");
        }
    },
    async findAllByMember(req: IReqUser, res: Response) {
        try {
            
        } catch (error) {
            return response.error(res, error,"Failed")
        }
    },
    
    async complete(req: IReqUser, res: Response) {
        try {
            const { orderId } = req.params;
            const user = req.user?.id;

            const order = await OrderModel.findOne({
                orderId,
                createdBy: user,
            });

            if (!order) {
                return response.notFound(res, "Order is not found.");
            }

            if (order.status === OrderStatus.COMPLETED) {
                return response.error(res, null, "Order has been completed.");
            }

            const ticket = await TicketModel.findById(`${order?.ticket}`);

            if (!ticket) {
                return response.notFound(res, "Ticket is not found.");
            }

            const vouchers: TypeVoucher[] = Array.from(
                { length: order.quantity },
                () => {
                    return {
                        isPrinted: false,
                        voucherId: getId(),
                    };
                }
            );

            const result = await OrderModel.findOneAndUpdate(
                {
                    orderId,
                    createdBy: user,
                },
                {
                    status: OrderStatus.COMPLETED,
                    vouchers,
                },
                {
                    new: true,
                }
            );

            await TicketModel.findByIdAndUpdate(ticket.id, {
                quantity: ticket.quantity - order.quantity,
            });

            return response.success(
                res,
                result,
                "Order completed successfully."
            );
        } catch (error) {
            return response.error(res, error,"Failed to complete order.");
        }
    },
    async pending(req: IReqUser, res: Response) {
        try {
            
        } catch (error) {
            return response.error(res, error,"Failed")
        }
    },
    async cancelled(req: IReqUser, res: Response) {
        try {
            
        } catch (error) {
            return response.error(res, error,"Failed")
        }
    },

};