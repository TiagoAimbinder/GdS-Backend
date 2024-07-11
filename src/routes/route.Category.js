import { Router } from "express";
import { CategoryController } from "../controllers/Category.controller.js";
import multer from "multer";

const routeCategory = new Router();
const categoryController = new CategoryController();


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const path = JSON.parse(req.body.category);
        cb(null, `${path.cat_imgPath}`)
    },

    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
})
const upload = multer({ storage: storage }).single('file')


routeCategory.post('/create', upload, categoryController.createCategory);
routeCategory.get('/getAll', categoryController.getAllCategories);
routeCategory.get('/getById', categoryController.getCategoryById);
routeCategory.put('/update', upload, categoryController.updateCategory);
routeCategory.delete('/delete/:cat_id', categoryController.deleteCategory);

export { routeCategory }
