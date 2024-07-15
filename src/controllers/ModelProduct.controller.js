import { ModelProduct } from "../config/db.js";
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

    createModelFromWeb = (req, res) => {
        
    }
}; 
