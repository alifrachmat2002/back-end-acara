import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { Event, eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
            eventDAO.validate(payload);

            const result = await EventModel.create(payload);

            response.success(res, result, "Event created successfully!");
        } catch (error) {
            return response.error(res, error, "Failed creating event.");
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const {
                limit = 10,
                page = 1,
                search,
            } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<Event> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: {
                        $search: search,
                    },
                });
            }

            const result = await EventModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await EventModel.countDocuments(query);

            return response.pagination(
                res,
                result,
                "Event data fetched successfully!",
                {
                    currentPage: page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }
            );
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await EventModel.findById(id);
            return response.success(res, result, "Event found successfully!");
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await EventModel.findOne({
                slug: slug
            });
            return response.success(res, result, "Event found successfully!");
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await EventModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            return response.success(res, result, "Event updated successfully!");
        } catch (error) {
            return response.error(res, error, "Failed updating event data.");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await EventModel.findByIdAndDelete(id, {
                    new: true
                });

            return response.success(res, result, "Event removed successfully!");
        } catch (error) {
            return response.error(res, error, "Failed removing event data.");
        }
    },
};