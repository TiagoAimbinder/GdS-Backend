import { Router } from "express";
import { UserController } from "../controllers/User.controller.js";


const routeUser = Router();
const userController = new UserController(); 


routeUser.post('/register', userController.registerUser);
routeUser.post('/login', userController.loginUser);

export { routeUser }