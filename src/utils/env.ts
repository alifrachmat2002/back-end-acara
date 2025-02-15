import dotenv from "dotenv";

dotenv.config()

export const DATABASE_URL = process.env.DATABASE_URL || "";
export const SECRET_KEY = process.env.SECRET_KEY || "";