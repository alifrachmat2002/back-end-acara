import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model"
import { getUserData } from "../utils/jwt"
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";


export default (req : Request, res : Response, next : NextFunction) => {
    const authorization  = req.headers?.authorization;

    if (!authorization) {
        return response.unauthorized(res);
    }

    const [ prefix, token ] = authorization.split(" ");

    if (!(prefix === "Bearer" && token)) {
        return res.status(403).json({
            message: "This Action is Unauthorized",
        });
    }

    const user = getUserData(token);

    if (!user) {
        return response.unauthorized(res);
    }

    (req as IReqUser).user = user

    next();
}