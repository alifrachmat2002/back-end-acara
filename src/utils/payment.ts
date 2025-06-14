import axios from "axios";
import {MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env"

export type Payment = {
    transaction_details : {
        order_id: string,
        gross_amount: number
    }
}

export type TypeResponseMidtrans = {
    token: string,
    redirect_url: string
}

export default { 
    async createLink(payload: Payment): Promise<TypeResponseMidtrans> {
        const result = await axios.post(
            `${MIDTRANS_TRANSACTION_URL}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}`).toString("base64")}`
                }
            }
        );

        if (result.status !== 201) {
            throw new Error("Payment Failed");
        };

        return result?.data;
    }
}