import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface IReqUser extends Request {
    user? : IUserToken
}

export interface IUserToken
    extends Omit<
        User,
        | "email"
        | "password"
        | "activationCode"
        | "fullName"
        | "isActive"
        | "profilePicture"
        | "username"
    > {
    id?: Types.ObjectId;
}