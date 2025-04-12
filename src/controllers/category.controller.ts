import { Response } from "express";

import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utils/response";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await categoryDAO.validate(req.body);
            const result = await CategoryModel.create(req.body);
            response.success(res, result, "Category created successfully!");
        } catch (error) {
            response.error(res, error, "Category creation failed.")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        try {
            const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;


            const query = {};

            if (search) {
                Object.assign(query, {
                    $or: [
                        {
                            name: { $regex: search, $options: "i" }
                        },
                        {
                            description: { $regex: search, $options: "i" }
                        },
                    ]
                })
            }

            const result = await CategoryModel.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1})
                .exec();

            const count = await CategoryModel.countDocuments(query);

            response.pagination(res, result, "Category data fetched successfully!",{
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
            });

        } catch (error) {
                response.error(res, error, "Failed fetching category data.")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await CategoryModel.findById(id);
            response.success(
                res,
                result,
                "Category data fetched successfully!"
            );
        } catch (error) {
            response.error(res, error, "Failed fetching category data.")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;
            const result = await CategoryModel.findByIdAndUpdate(id,req.body,{
                new: true
            });
            response.success(
                res,
                result,
                "Category data updated successfully!"
            );
        } catch (error) {
            response.error(res, error, "Failed updating category data.");
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
           const { id } = req.params;
           const result = await CategoryModel.findByIdAndDelete(id);
           response.success(res, result, "Category data deleted successfully!"); 
        } catch (error) {
            response.error(res, error, "Failed removing category data.")
        }
    },
}