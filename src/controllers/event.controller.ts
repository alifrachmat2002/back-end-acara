import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { Event, eventDAO, TEvent } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

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
            const buildQuery = (filter: any) => {
                let query: FilterQuery<TEvent> = {};

                if (filter.search) query.$text = { $search: filter.search };
                if (filter.category) query.category = filter.category;;
                if (filter.isFeatured) query.isFeatured = filter.isFeatured;
                if (filter.isOnline) query.isOnline = filter.isOnline;
                if (filter.isPublished) query.isPublished = filter.isPublished;

                return query;
            };

            const {
                limit = 10,
                page = 1,
                search,
                category,
                isOnline,
                isFeatured,
                isPublished
                
            } = req.query;

            const query = buildQuery({
                limit,
                page,
                search,
                category,
                isOnline,
                isFeatured,
                isPublished,
            });

            const result = await EventModel.find(query)
                .skip((+page - 1) * +limit)
                .limit(+limit)
                .sort({ createdAt: -1 })
                .exec();

            const count = await EventModel.countDocuments(query);

            return response.pagination(
                res,
                result,
                "Event data fetched successfully!",
                {
                    currentPage: +page,
                    total: count,
                    totalPages: Math.ceil(count / +limit),
                }
            );
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Event not found.")
            }

            const result = await EventModel.findById(id);

            if (!result) {
                return response.notFound(res, "Event not found.");
            }

            return response.success(res, result, "Event found successfully!");
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;

            if (!isValidObjectId(slug)) {
                return response.notFound(res, "Event not found.");
            }

            const result = await EventModel.findOne({
                slug: slug
            });

            if (!result) {
                return response.notFound(res, "Event not found.");
            }

            return response.success(res, result, "Event found successfully!");
        } catch (error) {
            return response.error(res, error, "Failed fetching event data.");
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Event not found.");
            }

            const result = await EventModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!result) {
                return response.notFound(res, "Event not found.");
            }

            return response.success(res, result, "Event updated successfully!");
        } catch (error) {
            return response.error(res, error, "Failed updating event data.");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            if (!isValidObjectId(id)) {
                return response.notFound(res, "Event not found.");
            }

            const result = await EventModel.findByIdAndDelete(id, {
                    new: true
                });
            
            if (!result) {
                return response.notFound(res, "Event not found.");
            }

            return response.success(res, result, "Event removed successfully!");
        } catch (error) {
            return response.error(res, error, "Failed removing event data.");
        }
    },
};