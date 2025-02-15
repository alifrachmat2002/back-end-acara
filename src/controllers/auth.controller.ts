import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";

type RegisterType = {
    fullName : string,
    username : string, 
    email : string,
    password : string,
    confirmPassword : string
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    password: Yup.string().required().min(8),
    confirmPassword: Yup.string().required().min(8).oneOf([Yup.ref("password"),""],"Password confirmation should match the password field"),
});

const authController = {
    async register(req : Request, res : Response ) {
        const { username, fullName, email, password, confirmPassword } = req.body as unknown as RegisterType;
        
        try {
            await registerValidateSchema.validate({
                username, fullName, email, password, confirmPassword
            });

            const result = await UserModel.create({
                username,
                fullName,
                email,
                password,
            });

            res.status(200).json({
                message : "Registration completed succesfully!",
                data : {
                    username,
                    fullName,
                    email
                }
            })

        }
        catch (error) {
            const err = error as unknown as Error 

            res.status(400).json({
                message : err.message,
                data : null
            })
        }

    },

}
export default authController;