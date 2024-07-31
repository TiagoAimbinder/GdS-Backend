import multer from "multer";
import { Router } from "express";
import { ProductController } from "../controllers/Product.controller.js";
import { ProductMiddleware } from "../middlewares/Product.middleware.js";
import { authJWT } from "../config/utils.js";


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

const storageMultiple = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },

    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
})

const uploadMultiple = multer({ storage: storageMultiple, limits: { fileSize: 50 * 1024 * 1024 } }).array('files', 10); 



routeProduct.post('/create',authJWT, uploadMultiple, productMiddleware.CreateValidation, productController.createProduct); //
routeProduct.put('/update', authJWT, upload, productMiddleware.UpdateValidation, productController.updateProduct);
routeProduct.delete('/delete/:prod_id', authJWT, productMiddleware.ProdIdValidation, productController.deleteProduct);
routeProduct.get('/getById/:prod_id', authJWT, productMiddleware.ProdIdValidation, productController.getProductById);
routeProduct.get('/getAll', authJWT, productController.getAllProducts);
routeProduct.get('/productSelected/:prod_id', authJWT, productMiddleware.ProdIdValidation, productController.productSelected);


export { routeProduct }; 