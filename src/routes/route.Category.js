import { Router } from "express";
import multer from "multer";

import { CategoryController } from "../controllers/Category.controller.js";
import { CategoryMiddleware } from "../middlewares/Category.middleware.js";
import { authJWT } from "../config/utils.js";

const routeCategory = new Router();
const categoryController = new CategoryController();
const categoryMiddleware = new CategoryMiddleware();

const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        const path = JSON.parse(req.body.category);
        cb(null, `${path.cat_imgPath}`)
    },

    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
})
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }).single('file')


routeCategory.post('/create', authJWT, upload, categoryMiddleware.CreateValidation, categoryController.createCategory);
routeCategory.put('/update',authJWT, upload, categoryMiddleware.UpdateValidation, categoryController.updateCategory);
routeCategory.get('/getAll',authJWT, categoryController.getAllCategories);
routeCategory.get('/getById',authJWT, categoryMiddleware.GetByIdValidation, categoryController.getCategoryById);
routeCategory.delete('/delete/:cat_id',authJWT, categoryMiddleware.DeleteValidation, categoryController.deleteCategory);

export { routeCategory }
