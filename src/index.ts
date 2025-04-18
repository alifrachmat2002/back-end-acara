import express, { Request, Response } from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";
import docs from "./docs/routes";
import cors from "cors";

// Init function to start the server
async function init() {
    try {
        // Connect to the database
        const result = await db();
        console.log(`Database Status : ${result}`);

        // Create an express app
        const app = express();

        // Define the port
        const PORT = 8080;

        // cors initialization
        app.use(cors());    

        // Use the body parser middleware
        app.use(bodyParser.json());
        // Use the router
        app.use("/api", router);
        // Define the default route
        app.get("/", (req: Request, res: Response) => {
            res.status(200).json({
                messsage: "Success",
                data: "Welcome to the dummy app",
            });
        });

        // documentation routes
        docs(app);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

init()
