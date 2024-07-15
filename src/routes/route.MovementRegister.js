import { Router } from "express";
import { MovementRegisterController } from "../controllers/MovementRegister.controller.js";
import { MovementRegisterMiddleware } from "../middlewares/MovementRegister.middleware.js";

const routeMovementRegister = new Router();
const movementRegisterController = new MovementRegisterController();
const movementRegisterMiddleware = new MovementRegisterMiddleware();

routeMovementRegister.post('/create', movementRegisterMiddleware.CreateValidation, movementRegisterController.createMovement);

export { routeMovementRegister };