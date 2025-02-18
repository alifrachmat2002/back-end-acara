import { Types } from "mongoose"
import { User } from "../models/user.model"
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "./env"

export interface IUserToken extends Omit<User, "email" | "password" | "activationCode" | "fullName" | "isActive" | "profilePicture" | "username"> {
    id? : Types.ObjectId

}

export const generateToken = (user : IUserToken) : string => {
    const token = jwt.sign(user, SECRET_KEY,{
        expiresIn : "1h"
    })

    return token;
}
export const getUserData = (token : string) => {
    const user = jwt.verify(token, SECRET_KEY) as User;

    return user;
}

