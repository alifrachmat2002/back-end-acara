import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, { orderDAO, TypeOrder } from "../models/order.model";
import TicketModel from "../models/ticket.model";
import EventModel from "../models/event.model";

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
            
        } catch (error) {
            return response.error(res, error,"Failed")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            
        } catch (error) {
            return response.error(res, error,"Failed")
        }
    },
    
    async completed(req: IReqUser, res: Response) {
        try {
            
        } catch (error) {
            return response.error(res, error,"Failed")
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