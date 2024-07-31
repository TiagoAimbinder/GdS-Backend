import { Router } from "express";
import { UserController } from "../controllers/User.controller.js";
import { UserMiddleware } from "../middlewares/User.middleware.js";


const routeUser = Router();
const userController = new UserController(); 
const userMiddleware = new UserMiddleware();



// routeUser.post('/register', userMiddleware.RegisterValidation, userController.registerUser);

routeUser.post('/login', userMiddleware.LoginValidation, userController.loginUser);
routeUser.get('/validateToken', userController.validateToken);

export { routeUser }