import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";
import categoryController from "../controllers/category.controller";
import regionController from "../controllers/region.controller";
import eventController from "../controllers/event.controller";
import ticketController from "../controllers/ticket.controller";
import bannerController from "../controllers/banner.controller";
import orderController from "../controllers/order.controller";

const router = express.Router();

router.post('/auth/register',authController.register);
router.post('/auth/login',authController.login);
router.get('/auth/me', authMiddleware, authController.me);
router.post('/auth/activation',authController.activation);

// access control list test route
router.get("/test-acl",[authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], (req : Request, res : Response) => {
    return res.status(200).json({
        data: "success",
        message: "OK"
    })
});

// file upload routes
router.post(
    "/media/upload-single",
    [
        authMiddleware,
        aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
        mediaMiddleware.single("file"),
    ],
    mediaController.single
    /* 
    #swagger.tags = ['Media']
    #swagger.security = [{
        'bearerAuth': {}
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: "object",
                    properties: {
                        file: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
    */
);
router.post(
    "/media/upload-multiple",
    [
        authMiddleware,
        aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
        mediaMiddleware.multiple("files"),
    ],
    mediaController.multiple
    /* 
    #swagger.tags = ['Media']
    #swagger.security = [{
        'bearerAuth': {}
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        files: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "binary"
                            }
                        }
                    }
                }
            }
        }
    }
    */
);
router.delete(
    "/media/remove",
    [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
    mediaController.remove
    /* 
    #swagger.tags = ['Media']
    #swagger.security = [{
        'bearerAuth': {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/RemoveMediaRequest"
        }
    }
    */
);

// category routes
router.post(
    "/category",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.create
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);
router.get(
    "/category",
    categoryController.findAll
    /*
    #swagger.tags = ['Category']    
    */
    
);
router.get(
    "/category/:id",
    categoryController.findOne
    /* 
    #swagger.tags = ['Category']
    */
);
router.put(
    "/category/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.update
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);
router.delete(
    "/category/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.remove
    /* 
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    */
);

// region routes
router.get(
    "/regions",
    regionController.getAllProvinces
    /* 
    #swagger.tags = ["Regions"]
    */
);
router.get(
    "/regions/:id/province",
    regionController.getProvince
    /* 
    #swagger.tags = ["Regions"]
    */
);
router.get(
    "/regions/:id/regency",
    regionController.getRegency
    /* 
    #swagger.tags = ["Regions"]
    */
);
router.get(
    "/regions/:id/district",
    regionController.getDistrict
    /* 
    #swagger.tags = ["Regions"]
    */
);
router.get(
    "/regions/:id/village",
    regionController.getVillage
    /* 
    #swagger.tags = ["Regions"]
    */
);
router.get(
    "/regions-search",
    regionController.findByCity
    /* 
    #swagger.tags = ["Regions"]
    */
);

// event routes
router.post(
    "/events",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.create
    /* 
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateEventRequest"
        }
    }
    */
);
router.get(
    "/events",
    eventController.findAll
    /* 
    #swagger.tags = ["Events"]
    #swagger.parameters['limit'] = {
        in: 'query',
        type: 'number',
        default: 10
    }
    #swagger.parameters['page'] = {
        in: 'query',
        type: 'number',
        default: 1
    }
    #swagger.parameters['category'] = {
        in: 'query',
        type: 'string',
    }
    #swagger.parameters['isOnline'] = {
        in: 'query',
        type: 'boolean',
    }
    #swagger.parameters['isPublished'] = {
        in: 'query',
        type: 'boolean',
    }
    #swagger.parameters['isFeatured'] = {
        in: 'query',
        type: 'boolean',
    }
    */
);
router.get(
    "/events/:id",
    eventController.findOne
    /* 
    #swagger.tags = ["Events"]
    */
);
router.get(
    "/events/:slug/slug",
    eventController.findOneBySlug
    /* 
    #swagger.tags = ["Events"]
    */
);
router.put(
    "/events/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],eventController.update
    /* 
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateEventRequest"
        }
    }
    */
);
router.delete(
    "/events/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],eventController.remove
    /* 
    #swagger.tags = ["Events"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    */
);

// Banner routes
router.post(
    "/banners",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.create
    /* 
        #swagger.tags = ["Banner"]
        #swagger.security = [{
            "bearerAuth" : {}
        }]
        #swagger.requestBody = {
            required: true,
            schema: {
                $ref: "#/components/schemas/BannerRequest"
            }
        }
    */
)
router.get(
    "/banners",
    bannerController.findAll
    /* 
        #swagger.tags = ["Banner"]
    */
);
router.get(
    "/banners/:id",
    bannerController.findOne
    /* 
        #swagger.tags = ["Banner"]
    */
);
router.put(
    "/banners/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.update
    /* 
        #swagger.tags = ["Banner"]
        #swagger.security = [{
            "bearerAuth" : {}
        }]
        #swagger.requestBody = {
            required: true,
            schema: {
                $ref: "#/components/schemas/BannerRequest"
            }
        }
    */
);
router.delete(
    "/banners/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.remove
    /* 
        #swagger.tags = ["Banner"]
        #swagger.security = [{
            "bearerAuth" : {}
        }]
    */
);

// Ticket routes
router.post(
    "/tickets",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.create
    /* 
    #swagger.tags = ["Tickets"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateTicketRequest"
        }
    }
     */
);
router.put(
    "/tickets/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.update
    /* 
    #swagger.tags = ["Tickets"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateTicketRequest"
        }
    }
     */
);
router.get('/tickets', 
    ticketController.findAll
    /* 
        #swagger.tags = ["Tickets"]
    */    
);
router.get(
    "/tickets/:id",
    ticketController.findOne
    /* 
        #swagger.tags = ["Tickets"]
    */
);
router.get(
    "/tickets/:eventId/events",
    ticketController.findAllByEvent
    /* 
        #swagger.tags = ["Tickets"]
    */
);
router.delete(
    "/tickets/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.remove
    /* 
        #swagger.tags = ["Tickets"]
        #swagger.security = [{
            "bearerAuth": {}
        }]
    */
);

router.post(
    "/orders",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.create
    /* 
    #swagger.tags = ["Orders"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
    #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/CreateOrderRequest"
        }
    }
     */
);

router.get(
    "/orders",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    orderController.findAll
    /* 
    #swagger.tags = ["Orders"]
    #swagger.security = [{
        "bearerAuth": {}
    }]
     */
);

router.get(
    "/orders/:orderId",
    [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
    orderController.findOne
    /*
    #swagger.tags = ["Orders"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
     */
);

router.put(
    "/orders/orderId/complete",
    [authMiddleware, aclMiddleware([ROLES.MEMBER])],
    orderController.complete
    /*
    #swagger.tags = ["Orders"]
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    */
)



export default router;