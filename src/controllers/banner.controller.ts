import { Response } from "express";
import response from "../utils/response";
import BannerModel, { Banner, bannerDAO } from "../models/banner.model";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { FilterQuery } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDAO.validate(req.body);
            const result = await BannerModel.create(req.body)
            return response.success(res, result, "Banner created successfully.")
        } catch (error) {
            return response.error(res, error, "Failed creating banner.")           
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const { limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<Banner> = {};

            if (search) {
                Object.assign(query, {
                    ...query,
                    $text: { $search : search }
                });
            }

            const count = await BannerModel.countDocuments(query);

            const result = await BannerModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdBy : -1 })
                .exec();

            return response.pagination(
                res, 
                result,
                "Banner retrieved successfully.",
                {
                    currentPage: page,
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            )
        } catch (error) {
            return response.error(res, error, "Failed retrieving banner data.")           
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findById(id);
            return response.success(
                res,
                result,
                "Banner retrieved successfully."
            );
        } catch (error) {
            return response.error(res, error, "Failed retrieving banner data.");           
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            return response.success(res, result,
                "Banner updated successfully.")
        } catch (error) {
            return response.error(res, error, "Failed updating banner data.")           
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await BannerModel.findByIdAndDelete(id);
            return response.success(
                res,
                result,
                "Banner removed successfully."
            );
        } catch (error) {
            return response.error(res, error, "Failed removing banner data.");           
        }
    },
}