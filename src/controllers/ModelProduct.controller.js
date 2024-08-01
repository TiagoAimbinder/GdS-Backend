import { Category, ModelProduct, Product, sequelize } from "../config/db.js";
import { ModelProductService } from "../services/ModelProduct.service.js";
import fs from 'fs'

export class ModelProductController {

    createModel = async (prod_id, models, transaction) => {
        try {            
            const modelProductService = new ModelProductService();
            const result = await modelProductService.createModel(prod_id, models, transaction);
        } catch (err) {
            return { errCode: 'GS-MP001', err: err}
        }
    }; 

    updateModel = async (req, res) => {
        const model = JSON.parse(req.body.model);
        try {    
            const mod = await ModelProduct.findOne({ where: { mod_id: model.mod_id } });
            if (!mod) {
                model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${ model.mod_imgPath }`) : fs.unlinkSync(`./uploads/null`);
                return res.status(404).json({ errCode: 'GS-MP005' });
            }; 

            const modelProductService = new ModelProductService();
            const result = await modelProductService.updateModel(model);
            if (result !== undefined && result.errCode) {
                model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${model.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
                return res.status(400).json({ errCode: result.errCode, err: result.err });
            } 

            model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${mod.dataValues.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            res.status(200).json({ message: 'Modelo actualizado correctamente.' });
        } catch (err) {
            model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${model.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            res.status(500).json({ errCode: 'GS-MP002', err: err});
        }
    };

    deleteModel = async (req, res) => {
        try {
            const { mod_id } = req.params;
            const model = ModelProduct.findOne({ where: { mod_id: mod_id } });
            
            if (!model || model.dataValues.mod_active) { return res.status(404).json({ errCode: 'GS-MP005' }); }; 

            const modelProductService = new ModelProductService();
            const result = await modelProductService.deleteModel(mod_id);
            if (result !== undefined && result.errCode !== undefined) {
                return res.status(400).json({ errCode: result.errCode, err: result.err });
            } 

            res.status(200).json({ message: 'Modelo eliminado correctamente.'});
        } catch (err) {
            res.status(500).json({ errCode: 'GS-MP006', err: err}); 
        }
    }; 

    createModelFromWeb = async (req, res) => {
        const mod = JSON.parse(req.body.model);
        try {
            const category = await Category.findOne({ where: { cat_id: mod.cat_id } });
            if (!category) {
                fs.unlinkSync(`./uploads/${mod.mod_imgPath}`);
                return res.status(404).json({ errCode: 'GS-MP009' });
            };  
            const product = await Product.findOne({where: {cat_id: category.dataValues.cat_id, prod_id: mod.prod_id} })
            if (!product) {
                fs.unlinkSync(`./uploads/${mod.mod_imgPath}`);
                return res.status(404).json({ errCode: 'GS-MP010' });
            }; 

            const model = await ModelProduct.findOne({where: {prod_id: product.dataValues.prod_id, mod_name: mod.mod_name}});
            if (model) {
                fs.unlinkSync(`./uploads/${mod.mod_imgPath}`);
                return res.status(409).json({ errCode: 'GS-MP012' });
            };

            const modelProductService = new ModelProductService();
            const result = await modelProductService.createModelFromWeb(Number(mod.cat_id), Number(mod.prod_id), mod.mod_name, mod.mod_desc, mod.mod_imgPath);
            if (result !== undefined && result.errCode !== undefined) {
                return res.status(400).json({ errCode: result.errCode, err: result.err });
            } 
            
            res.status(200).json({ message: 'Modelo creado correctamente' }); 
        } catch (err) {
            fs.unlinkSync(`./uploads/${mod.mod_imgPath}`);
            res.status(500).json({ errCode: 'GS-MP011', err: err}); 
        }
    };

    getAllModels = async (req, res) => {
        try {
            const models = await sequelize.query(
                'SELECT prod_id, mod_id, mod_desc, mod_imgPath, mod_name FROM ModelProducts WHERE mod_active = 1;', 
                { type: sequelize.QueryTypes.SELECT })

            res.status(200).json(models);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-MP007', err: err});
        }
    }; 

    getModelUnitById = async (req, res) => {
        try {
            const { mod_id } = req.params; 

            const model = await ModelProduct.findOne({ where: { mod_id: mod_id } });
            if (!model) {
                return res.status(404).json({ errCode: 'GS-MP005' });
            }; 

            const modelProductService = new ModelProductService();
            const result = await modelProductService.getModelUnitById(mod_id);

            res.status(200).json(result.total_quantity);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-MP008', err: err});
        }
    }; 

}; 
