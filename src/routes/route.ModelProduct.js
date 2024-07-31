import { Router } from "express";
import multer from "multer";
import { ModelProductController } from "../controllers/ModelProduct.controller.js";
import { ModelProductMiddleware } from "../middlewares/ModelProduct.middleware.js";
import { authJWT } from "../config/utils.js";

const routeModelProduct = new Router();
const modelProductController = new ModelProductController();
const modelProductMiddleware = new ModelProductMiddleware();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const path = JSON.parse(req.body.model);
        cb(null, `${path.mod_imgPath}`)
    },

    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
})
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, 
}).single('file')


routeModelProduct.post('/create', authJWT, upload, modelProductMiddleware.CreateValidation,modelProductController.createModelFromWeb);
routeModelProduct.put('/update',authJWT, upload, modelProductMiddleware.UpdateValidation, modelProductController.updateModel);
routeModelProduct.delete('/delete/:mod_id',authJWT, modelProductMiddleware.DeleteValidation,modelProductController.deleteModel);
routeModelProduct.get('/getAll',authJWT, modelProductController.getAllModels);
routeModelProduct.get('/getQuantity/:mod_id',authJWT, modelProductMiddleware.DeleteValidation, modelProductController.getModelUnitById);

export { routeModelProduct }
