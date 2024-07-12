import { Router } from "express";
import { routeUser } from "./route.User.js";
import { routeCategory } from "./route.Category.js";
import { routeProduct } from "./route.Product.js";
import { routeModelProduct } from "./route.ModelProduct.js";
import { routeProvider } from "./route.Provider.js";
import { routeMovementRegister } from "./route.MovementRegister.js";

const routeIndex = Router();

routeIndex.use('/user', routeUser);   
routeIndex.use('/category', routeCategory);   
routeIndex.use('/product', routeProduct);
routeIndex.use('/model', routeModelProduct);
routeIndex.use('/provider', routeProvider);
routeIndex.use('/movement', routeMovementRegister)

export { routeIndex }