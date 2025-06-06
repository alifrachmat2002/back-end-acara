import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken, getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces"; 
import response from "../utils/response";

type RegisterType = {
    fullName : string,
    username : string, 
    email : string,
    password : string,
    confirmPassword : string
};

type LoginType = {
    identifier : string,
    password : string
}

const loginValidateSchema = Yup.object({
    identifier : Yup.string().min(3).required(),
    password : Yup.string().min(8).required()
})

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required().min(3),
    email: Yup.string().email().required(),
    password: Yup.string()
        .required()
        .min(8)
        .test(
            "at-least-one-uppercase-letter",
            "Contains at least one uppercase letter",
            (value) => {
                if (!value) {
                    return false;
                }
                const regex = /^(?=.*[A-Z])/;

                return regex.test(value);
            }
        )
        .test(
            "at-least-one-number",
            "Contains at least one number",
            (value) => {
                if (!value) {
                    return false;
                }
                const regex = /^(?=.*\d)/;

                return regex.test(value);
            }
        ),
    confirmPassword: Yup.string()
        .required()
        .min(8)
        .oneOf(
            [Yup.ref("password"), ""],
            "Password confirmation should match the password field"
        ),
});

const authController = {
    async register(req : Request, res : Response ) {
        /**
            #swagger.tags = ["Auth"]
            #swagger.requestBody = {
                required : true,
                schema : {$ref : '#/components/schemas/RegisterRequest'}
            }
         */
        const { username, fullName, email, password, confirmPassword } =
            req.body as unknown as RegisterType;

        try {
            await registerValidateSchema.validate({
                username,
                fullName,
                email,
                password,
                confirmPassword,
            });

            const result = await UserModel.create({
                username,
                fullName,
                email,
                password,
            });

            response.success(
                res,
                {
                    username,
                    fullName,
                    email,
                },
                "Registration completed succesfully!"
            );

        } catch (error) {
            response.error(res, error, "Registration Failed!");
        }
    },
    async login(req : Request, res : Response) {
        /**
            #swagger.tags = ["Auth"]
            #swagger.requestBody = {
                required : true,
                schema : {$ref : '#/components/schemas/LoginRequest'}
            }
         */

        const { identifier, password } = req.body as unknown as LoginType;

        try {
            await loginValidateSchema.validate({ identifier, password });

            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
                isActive: true,
            });

            if (!userByIdentifier) {
                return response.unauthorized(
                    res,
                    "The credentials don't match any of our records"
                );
            }

            const passwordIsValid =
                encrypt(password) === userByIdentifier.password;

            if (!passwordIsValid) {
                return response.unauthorized(
                    res,
                    "The credentials don't match any of our records"
                );
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            response.success(res, token, "Login Successful!");

        } catch (error) {
            response.error(res, error, "Login Failed");
        }
    },
    async me(req : IReqUser, res : Response) {
        /**
            #swagger.tags = ["Auth"]
            #swagger.security = [{
                "bearerAuth" : []
            }]
         */
        try {
            const result = await UserModel.findOne({ _id: req.user?.id });
            response.success(res, result, "Hello User, here's you");
        } catch (error) {
            response.error(res, error, "Failed to retrieve user profile.")
        }
    },
    async activation(req : Request, res : Response) { 
        /**
         #swagger.tags = ["Auth"]
         #swagger.requestBody = {
            required : true,
            schema : {$ref : '#/components/schemas/ActivationRequest'}
         }
         */
        try {
            const { code } = req.body as { code : string }
            if (!code) {
                return res.status(400).json({
                    messsage : "The Activation Code is invalid",
                    data : null
                })
            }
            const user = await UserModel.findOneAndUpdate({
                    activationCode : code
                },
                {
                    isActive : true
                },
                {
                    new : true
                }
            )
            if (!user) {
                return response.unauthorized(res,"The User is not found");
            }

            response.success(res, user, "User activated successfully!")
        } catch (error) {
            response.error(res, error, "User activation failed.")
        }
    }


}
export default authController;