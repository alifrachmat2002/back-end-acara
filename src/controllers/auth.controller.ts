import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken, getUserData } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

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

            res.status(200).json({
                message: "Registration completed succesfully!",
                data: {
                    username,
                    fullName,
                    email,
                },
            });
        } catch (error) {
            const err = error as unknown as Error;

            res.status(400).json({
                message: err.message,
                data: null,
            });
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
                return res.status(403).json({
                    message: "The credentials don't match any of our records",
                });
            }

            const passwordIsValid =
                encrypt(password) === userByIdentifier.password;

            if (!passwordIsValid) {
                return res.status(403).json({
                    message: "The credentials don't match any of our records",
                });
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            res.status(200).json({
                message: "Login Successful!",
                data: token,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
            });
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
            const result = await UserModel.find({ _id: req.user?.id });
            res.status(200).json({
                message: `Hello User, here's you`,
                data: result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
            });
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
                return res.status(400).json({
                    messsage: "The User is not found",
                    data: null,
                });
            }
            res.status(200).json({
                message : "User Activated Successfully",
                data : {
                    user
                }
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
            });
        }
    }


}
export default authController;