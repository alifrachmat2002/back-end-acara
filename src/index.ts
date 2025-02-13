import express, { Request, Response } from "express";
import router from "./routes/api";
const app = express();

const PORT = 3000;

app.use("/api", router);
app.get('/',(req : Request, res: Response) => {
    res.status(200).json({
        messsage : "Success",
        data : "Welcome to the dummy app"
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
