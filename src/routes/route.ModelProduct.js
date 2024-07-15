import { Router } from "express";
import multer from "multer";
import { ModelProductController } from "../controllers/ModelProduct.controller.js";
import { ModelProductMiddleware } from "../middlewares/ModelProduct.middleware.js";

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
const upload = multer({ storage: storage }).single('file')


// routeModelProduct.post('/create', upload, modelProductController.createModelFromWeb);
routeModelProduct.put('/update', upload, modelProductMiddleware.UpdateValidation, modelProductController.updateModel);
routeModelProduct.delete('/delete/:mod_id', modelProductMiddleware.DeleteValidation,modelProductController.deleteModel);

export { routeModelProduct }
