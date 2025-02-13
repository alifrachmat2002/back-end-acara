import { Request, Response } from "express"

const dummyController = {
    dummy (req : Request, res : Response) {
        res.status(200).json({
            message : "Welcome to the dummy response",
            data : "OK"
        })
    }
}

export default dummyController;