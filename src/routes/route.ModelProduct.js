import { Router } from "express";
import multer from "multer";
import { ModelProductController } from "../controllers/ModelProduct.controller.js";

const routeModelProduct = new Router();
const modelProductController = new ModelProductController();


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


// routeModelProduct.post('/create', upload, modelProductController.);
routeModelProduct.put('/update', upload, modelProductController.updateModel);
routeModelProduct.delete('/delete/:mod_id', modelProductController.deleteModel);

export { routeModelProduct }
