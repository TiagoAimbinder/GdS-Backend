import fs from 'fs'
import { Category } from "../config/db.js"


export class CategoryService {

    createCategory = async (cat_name, cat_imgPath) => {
        try {
            const category = await Category.create({ cat_name: cat_name, cat_imgPath: cat_imgPath})
            return true; 
        } catch (err) {
            return { errCode: 'GS-C003', err: err }
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

    deleteCategory = async (cat) => {
        try {
            const category = await Category.destroy({where: {cat_id: cat.cat_id}})
            fs.unlinkSync(`./uploads/${cat.cat_imgPath}`);
            return true; 
        } catch (err) {    
            return { errCode: 'GS-C008', err: err}
        }
    }
}; 