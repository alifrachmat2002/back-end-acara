import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderHtmlContent, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";

const Schema = mongoose.Schema;

export interface User {
    fullName : string
    username : string
    email : string
    password : string
    role : string
    profilePicture : string
    isActive : boolean
    activationCode : string
    createdAt? : string
}

const UserSchema = new Schema<User>({
    fullName : {
        type : Schema.Types.String,
        required : true,
    },
    username : {
        type : Schema.Types.String,
        required : true,
        min : 3,
        unique : true
    },
    email : {
        type : Schema.Types.String,
        required : true,
        unique : true
    },
    password : {
        type : Schema.Types.String,
        required : true,
        min : 8,    
    },
    role : {
        type : Schema.Types.String,
        enum : [ROLES.ADMIN, ROLES.MEMBER],
        default : ROLES.MEMBER
    },
    profilePicture : {
        type : Schema.Types.String,
        default : "user.jpg"
    },
    isActive : {
        type : Schema.Types.Boolean,
        default : false
    },
    activationCode : {
        type : Schema.Types.String,
        
    }  
    
},
{
    timestamps : true
});

UserSchema.pre("save", function () {
    const user = this;
    user.password = encrypt(user.password);
    user.activationCode = encrypt(user.id);
})

UserSchema.post("save", async function(doc, next) {
    const user = doc;

    console.log(`sending email to : ${user}` )

    try {
        const contentMail = await renderHtmlContent(
            "registration-success.ejs",
            {
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
            }
        );

        const result = await sendMail({
            from: EMAIL_SMTP_USER,
            to: user.email,
            subject: `Account Activation for ${user.fullName}`,
            html: contentMail,
        });

    } catch (error) {
        console.log(error);
    }
    finally {
        next()
    }
})

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;