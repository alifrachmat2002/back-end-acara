import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
    async single(req: IReqUser, res: Response) {
        if (!req.file) {
            return response.error(res, null, "File does not exist!");
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);

            return response.success(res, result, "File uploaded successfully!");
        } catch (error) {
            return response.error(
                res,
                null,
                "File upload failed, please try again"
            );
        }
    },
    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0) {
            return response.error(res, null, "File does not exist!");
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);

            return response.success(res, result, "File uploaded successfully!");
        } catch (error) {
            return response.error(
                res,
                null,
                "File upload failed, please try again"
            );
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string }

            const result = await uploader.remove(fileUrl);
            
            return response.success(res, result, "File removed successfully!");
        } catch (error) {
            return response.error(
                res,
                null,
                "File Removal failed, please try again."
            );
        }
    },
}