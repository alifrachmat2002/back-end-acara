import { Request, Response } from "express"
import TicketModel, { ticketDAO, TypeTicket } from "../models/ticket.model"
import response from "../utils/response";
import { IPaginationQuery } from "../utils/interfaces";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: Request, res: Response) {
        try {
            await ticketDAO.validate(req.body);
            const result = await TicketModel.create(req.body);

            response.success(res, result, "Ticket created successfully.");
        } catch (error) {
            response.error(res, error, "Failed creating ticket.")
        }
    },
    async findAll(req: Request, res: Response) {
        try {
            const { limit = 10, page = 1, search } =
                req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TypeTicket> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text:{
                        $search: search
                    }
                });
            }

            const result = await TicketModel.find(query)
                .populate("events")
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await TicketModel.countDocuments(query);

            response.pagination(
                res,
                result,
                "Ticket data Fetched Successfully",
                {
                    currentPage: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }
            );
        } catch (error) {
            response.error(res, error, "Failed fetching ticket")
        }
    },
    async findOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findById(id);

            response.success(
                res,
                result,
                "Ticket data fetched successfully."
            )
        } catch (error) {
            response.error(res, error, "Failed fetching ticket data.")
        }
    },
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findByIdAndUpdate(id, req.body,{
                new: true
            });

            response.success(res, result, "Ticket updated successfully!")
        } catch (error) {
            response.error(res, error, "Failed updating ticket.")
        }
    },
    async remove(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await TicketModel.findByIdAndDelete(id,{
                new: true
            })

            response.success(
                res, 
                result, 
                "Ticket deleted successfully."
            )
        } catch (error) {
            response.error(res, error, "Failed removing ticket.")
        }
    },
    async findAllByEvent(req: Request, res: Response) {
        try {
            const { eventId } = req.params;

            if (!isValidObjectId(eventId)) {
                response.error(res, null, "Ticket not found.")
            }

            const result = await TicketModel.find({
                events: eventId
            }).exec();

            response.success(res, result, "Ticket data fetched successfully.")
        } catch (error) {
            response.error(res, error, "Failed fetching ticket data.");
        }
    }
};