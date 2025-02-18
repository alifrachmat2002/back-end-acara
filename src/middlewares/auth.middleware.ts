import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model"
import { getUserData, IUserToken } from "../utils/jwt"

export interface IReqUser extends Request {
    user? : IUserToken
}
export default (req : Request, res : Response, next : NextFunction) => {
    const authorization  = req.headers?.authorization;

    if (!authorization) {
        return res.status(403).json({
            message : "This Action is Unauthorized"
        })
    }

    const [ prefix, token ] = authorization.split(" ");

    if (!(prefix === "Bearer" && token)) {
        return res.status(403).json({
            message: "This Action is Unauthorized",
        });
    }

    const user = getUserData(token);

    if (!user) {
        return res.status(403).json({
            message: "This Action is Unauthorized",
        });
    }

    (req as IReqUser).user = user

    next();
}