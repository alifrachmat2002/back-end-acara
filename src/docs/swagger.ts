
import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json"
const endpointsFile = ["../routes/api.ts"]
const doc = {
    info: {
        title: "Dokumentasi API Backend Acara",
        description:
            "This is the backend API for the Event Booking & Management app, built as part of the WPU COURSE. The project follows the MERN stack approach, utilizing Express.js with TypeScript to create a scalable and efficient backend.",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            descripton: "Local Environment",
        },
        {
            url: "https://back-end-acara-wheat-iota.vercel.app/api",
            descripton: "Deployed Server (Vercel)",
        },
    ],
    components : {
        securitySchemes : {
            bearerAuth : {
                type : "http",
                scheme : "bearer"
            }
        },
        schemas : {
            LoginRequest : {
                identifier : "akunvercel",
                password : "password"
            },
            ActivationRequest : {
                code : "abcdef"
            }
        }
    }
};

swaggerAutogen({openapi : "3.0.0"})(outputFile, endpointsFile, doc)