import { Category, ModelProduct, Product } from "../config/db.js";
import { CategoryService } from "../services/Category.service.js";
import fs from 'fs'

export class CategoryController {

    createCategory = async (req, res) => {
        const cat = JSON.parse(req.body.category); 
        try {
            const category = await Category.findOne({ where: { cat_name: cat.cat_name } });

            if (category) { 
                fs.unlinkSync(`./uploads/${cat.cat_imgPath}`);                
                return res.status(400).json({ errCode: 'GS-C002' })
            }; 

            const categoryService = new CategoryService();
            const result = await categoryService.createCategory(cat.cat_name, cat.cat_imgPath);
            if (result.errCode) { 
                fs.unlinkSync(`./uploads/${cat.cat_imgPath}`);                
                return res.status(500).json({ errCode: result.errCode, err: result.err })
            };

            res.status(200).json({ message: 'Categoría guardada' });
        } catch (err) {
            fs.unlinkSync(`./uploads/${cat.cat_imgPath}`);                
            res.status(500).json({ errCode: 'GS-C001' });
        }
    };

    getAllCategories = async (req, res) => {
        try {
            const result = await Category.findAll({where: {cat_active: true}});
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-C004' });
        }
    }; 

    getCategoryById = async (req, res) => {
        try {
            const { cat_id } = req.query; 
            const result = await Category.findOne({where: {cat_id: cat_id, cat_active: true} });
            if (!result) { return res.status(400).json({ errCode: 'GS-C006' })}
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-C005' });
        }
    }; 

    updateCategory = async (req, res) => {
        const cat = JSON.parse(req.body.category); 
        console.log('CAT: ', cat);

        try {
            const category = await Category.findOne({ where: { cat_id: cat.cat_id } });            
            if (!category) {
                cat.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${cat.cat_imgPath}`) : null;
                return res.status(400).json({ errCode: 'GS-C006' })
            };

            // Name validation
            if (cat.cat_nameOld !== cat.cat_nameNew) {
                const categoryName = await Category.findOne({ where: { cat_name: cat.cat_nameNew, cat_active: true}});
                if (categoryName) { 
                    cat.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${cat.cat_imgPath}`) : null;
                    return res.status(400).json({ errCode: 'GS-C002' })
                }; 
            }

            console.log('WORK');
            return res.status(200).json({ message: 'Categoría actualizada' });

            const updCat = {
                cat_name: cat.cat_name,
                cat_imgPath: cat.cat_imgPath, 
            } 

            const categoryService = new CategoryService();
            const result = await categoryService.updateCategory(updCat, Number(cat.cat_id), imgChange);
            if (result.errCode) { º
                cat.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${cat.cat_imgPath}`) : null;
                return res.status(400).json({ errCode: result.errCode, err: result.err })
            }

            cat.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${cat.cat_imgPath}`) : null;
            res.status(200).json({ message: 'Categoría actualizada' });
        } catch (err) {
            cat.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${cat.cat_imgPath}`) : null;
            res.status(500).json({ errCode: 'GS-C007' });
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const { cat_id } = req.params;
            const category = await Category.findOne({ where: { cat_id: cat_id } });
            if (!category || category.dataValues.cat_active === false) { return res.status(400).json({ errCode: 'GS-C006' })}

            const products = await Product.findAll({ where: { cat_id: cat_id } });
            const prods_id = products.map((prod) => prod.dataValues.prod_id);

            const categoryService = new CategoryService();
            const result = await categoryService.deleteCategory(cat_id, prods_id);
            if (result.errCode) { return res.status(400).json({ errCode: result.errCode, err: result.err })}    

            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        } catch (err) { 
            res.status(500).json({ errCode: 'GS-C009' });
        }
    };
}; 