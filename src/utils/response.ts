import { Response } from "express"
import { stat } from "fs";
import * as Yup from "yup"

type Pagination = {
    totalPages: number,
    currentPage: number,
    total: number    
}

export default {
    success(res: Response, data: any, message: string) {
        res.status(200).json({
            meta: {
                status: 200,
                message
            },
            data
        });
    },
    error(res: Response, error: unknown, message: string) {
        if(error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message
                },
                data: error.errors
            })
        }

    },
    unauthorized(res: Response, message: string = "This action is Unauthorized") {
        res.status(403).json({
            meta: {
                status: 403,
                message
            },
            data: null
        })
    },
    pagination(res: Response, data: any[], messsage: string, pagination: Pagination) {
        res.status(200).json({
            meta : {
                status: 200,
                messsage
            },
            data,
            pagination
        })
    }


}