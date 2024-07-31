import { Router } from "express";
import { MovementRegisterController } from "../controllers/MovementRegister.controller.js";
import { MovementRegisterMiddleware } from "../middlewares/MovementRegister.middleware.js";
import { authJWT } from "../config/utils.js";

const routeMovementRegister = new Router();
const movementRegisterController = new MovementRegisterController();
const movementRegisterMiddleware = new MovementRegisterMiddleware();

routeMovementRegister.post('/create', authJWT, movementRegisterMiddleware.CreateValidation, movementRegisterController.createMovement);
routeMovementRegister.get('/getAllByProd/:prod_id', authJWT, movementRegisterController.getMovementsByProdId);

export { routeMovementRegister };