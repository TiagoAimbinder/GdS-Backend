import multer from "multer";
import { Router } from "express";
import { ProductController } from "../controllers/Product.controller.js";
import { ProductMiddleware } from "../middlewares/Product.middleware.js";


const routeProduct = Router();
const productController = new ProductController();
const productMiddleware = new ProductMiddleware();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const path = JSON.parse(req.body.product);
        cb(null, `${path.prod_imgPath}`)
    },

    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
})
const upload = multer({ storage: storage }).single('file')


routeProduct.post('/create', upload, productMiddleware.CreateValidation, productController.createProduct);
routeProduct.put('/update', upload, productMiddleware.UpdateValidation, productController.updateProduct);
routeProduct.delete('/delete/:prod_id', productMiddleware.DeleteValidation, productController.deleteProduct);


export { routeProduct }; 