import { Response } from "express"
import { stat } from "fs";
import mongoose from "mongoose";
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

        // Handle validation error
        if(error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message
                },
                data: {
                    [`${error.path}`]:error.errors[0]
                }
            })
        }

        // Handle Mongoose error
        if (error instanceof mongoose.Error) {
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: error.message
                },
                data: error.name
            })
        }

        // Handle MongoDB errors
        if ((error as any)?.code) {
            const _err = error as any;
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: _err.errorResponse.errmsg,
                },
                data: _err,
            });
        }

        // handle other errors
        res.status(500).json({
            meta: {
                status: 500,
                message
            },
            data: error,
        })
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
    notFound(res: Response, message: string = "Not Found.") {
        res.status(404).json({
            meta: {
                status: 404,
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