import fs from 'fs'
import { Category, ModelProduct, Product } from "../config/db.js"


export class CategoryService {

    createCategory = async (cat_name, cat_imgPath) => {
        try {
            const category = await Category.create({ cat_name: cat_name, cat_imgPath: cat_imgPath, cat_active: true})
            return true; 
        } catch (err) {
            return { errCode: 'GS-C001', err: err }
        }
    } 

    updateCategory = async (updCat, cat_id, imgChange) => {
        try {
            const category = await Category.update(updCat, { where: { cat_id: cat_id } });
            return true; 
        } catch (err) {    
            return { errCode: 'GS-C008', err: err}
        }
    }

    deleteCategory = async (cat_id, prods_id) => {
        try {
            const category = await Category.update({ cat_active: false }, { where: { cat_id: cat_id } });
            const products = await Product.update({ prod_active: false }, { where: { cat_id: cat_id } });
            for (let prod_id of prods_id) {
                const model = await ModelProduct.update({ mod_active: false }, { where: { prod_id: prod_id } });
            };
            return true; 
        } catch (err) {    
            return { errCode: 'GS-C008', err: err}
        }
    }
}; 