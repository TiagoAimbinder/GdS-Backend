import { Router } from "express";
import { MovementRegisterController } from "../controllers/MovementRegister.controller.js";

const routeMovementRegister = new Router();
const movementRegisterController = new MovementRegisterController()

routeMovementRegister.post('/create', movementRegisterController.createMovement);

export { routeMovementRegister }; 