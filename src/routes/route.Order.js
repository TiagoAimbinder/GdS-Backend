import { Router } from "express";
import { OrderController } from "../controllers/Order.controller.js";
import { OrderMiddleware } from "../middlewares/Order.middleware.js";
import { authJWT } from "../config/utils.js";

const routeOrder = Router();
const orderCtr = new OrderController();
const orderMwr = new OrderMiddleware();


routeOrder.post('/create', authJWT, orderMwr.ValidateCreate,orderCtr.createOrder);
routeOrder.get('/getAllOrders', authJWT, orderCtr.getAllOrders);
routeOrder.get('/getOrderById/:or_id', authJWT, orderMwr.ValidateOrId, orderCtr.getOrderById);
routeOrder.put('/updateStatus/:or_id/:os_id', authJWT, orderMwr.ValidateOrIdOsId, orderCtr.updateStatus);

export { routeOrder }

