import { Router } from "express";
import { ProductController } from "../controllers/Product.controller.js";
import multer from "multer";


const routeProduct = Router();
const productController = new ProductController();

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


routeProduct.post('/create', upload, productController.createProduct);
routeProduct.put('/update', upload, productController.updateProduct);
routeProduct.delete('/delete/:prod_id', upload, productController.deleteProduct);


export { routeProduct }; 