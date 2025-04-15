import { Request, Response } from "express"
import RegionModel from "../models/region.model"
import response from "../utils/response";

export default {
    async findByCity(req: Request, res: Response) {
        const { name } = req.query;
        try {
            const result = await RegionModel.findByCity(`${name}`);
            response.success(res, result, "Region data fetched successfully!");
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },
    async getAllProvinces(req: Request, res: Response) {
        try {
            const result = await RegionModel.getAllProvinces();
            response.success(res, result, "Region data fetched successfully!");
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },
    async getProvince(req: Request, res: Response) {
        // Get Regency data filtered by Province ID
        try {
            const { id } = req.params;
            const result = await RegionModel.getProvince(Number(id));
            response.success(res, result, "Province data fetched successfully!");
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },
    async getRegency(req: Request, res: Response) {
        // Get District data filtered by Regency ID
        try {
            const { id } = req.params;
            const result = await RegionModel.getRegency(Number(id));
            response.success(res, result, "Regency data fetched successfully!");
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },
    async getDistrict(req: Request, res: Response) {
        // Get Village data filtered by District ID
        try {
            const { id } = req.params;
            const result = await RegionModel.getDistrict(Number(id));
            response.success(
                res,
                result,
                "District data fetched successfully!"
            );
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },
    async getVillage(req: Request, res: Response) {
        // get one village data by village id
        try {
            const { id } = req.params;
            const result = await RegionModel.getVillage(Number(id));
            response.success(res, result, "Village data fetched successfully!");
        } catch (error) {
            response.error(res, error, "Failed to fetch region data.");
        }
    },

};