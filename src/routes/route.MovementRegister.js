import { Router } from "express";
import { MovementRegisterController } from "../controllers/MovementRegister.controller.js";
import { MovementRegisterMiddleware } from "../middlewares/MovementRegister.middleware.js";
import { authJWT } from "../config/utils.js";

const routeMovementRegister = new Router();
const movRegCtr = new MovementRegisterController();
const movRegMwr = new MovementRegisterMiddleware();

routeMovementRegister.post('/create', authJWT, movRegMwr.CreateValidation, movRegCtr.createMovement);
routeMovementRegister.get('/getAllByProd/:prod_id', authJWT, movRegMwr.ProdIdValidation, movRegCtr.getMovementsByProdId);

export { routeMovementRegister };