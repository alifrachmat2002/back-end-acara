
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
            url: "http://localhost:8080/api",
            descripton: "Local Environment",
        },
        {
            url: "https://back-end-acara-wheat-iota.vercel.app/api",
            descripton: "Deployed Server (Vercel)",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "akunvercel",
                password: "password",
            },
            RegisterRequest: {
                username: "alipalip",
                fullName: "Alif Rachmat Illahi",
                email: "myguyalip2@yopmail.com",
                password: "P4ssword",
                confirmPassword: "P4ssword",
            },
            ActivationRequest: {
                code: "abcdef",
            },
            CreateCategoryRequest: {
                name: "Training",
                description: "Training events to boost your skills.",
                icon: "Example",
            },
            CreateEventRequest: {
                name: "Event Name",
                description: "event description.",
                banner: "fileUrl",
                startDate: "yyyy-mm-dd hh:mm:ss",
                endDate: "yyyy-mm-dd hh:mm:ss",
                isFeatured: true,
                isOnline: true,
                isPublished: true,
                category: "category ObjectId",
                location: {
                    region: "region id",
                    coordinates: [0, 0],
                    address:
                        "full address e.g Jl. Hatchi Hatchi Banyak Anak Kecil",
                },
            },
            RemoveMediaRequest: {
                fileUrl: "",
            },
            CreateTicketRequest: {
                name: "Ticket Example",
                description: "sample description",
                price: 1000,
                quantity: 1,
                events: "objectID",
            },
            BannerRequest: {
                title: "Banner Title Example",
                image: "https://res.cloudinary.com/drojpl4u8/image/upload/v1744882291/hwgyltw5pjfjw9xnpb0w.png",
                isShown: true
            },
            CreateOrderRequest: {
                events: "event objectId",
                ticket: "ticket objectId",
                quantity: 1
            }
        },
    },
};

swaggerAutogen({openapi : "3.0.0"})(outputFile, endpointsFile, doc)