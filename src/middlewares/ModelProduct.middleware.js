import Joi from "joi";
import fs from 'fs'

export class ModelProductMiddleware {

    // ----------- SCHEMAS:
    UpdateSchema = Joi.object({
        mod_id: Joi.number().required(),
        mod_name: Joi.string().required(),
        mod_desc: Joi.string().required(),
        mod_imgPath: Joi.string().allow(null).required(),
    }); 

    DeleteSchema = Joi.object({
        mod_id: Joi.number().required(),
    });

    CreateSchema = Joi.object({
        cat_id: Joi.number().required(),
        prod_id: Joi.number().required(),
        mod_name: Joi.string().required(),
        mod_desc: Joi.string().allow(null).required(),
        mod_imgPath: Joi.string().allow(null).required(),
    });

    // ----------- VALIDATIONS:
    UpdateValidation = (req, res, next) => {
        const model = JSON.parse(req.body.model);
        const { error } = this.UpdateSchema.validate(model); 
        if (error) {
            model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${model.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-MP001', err: error.details[0].message })
        };

        if (!req.file) { 
            model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${model.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-M002' });
        }
        next()
    };  

    DeleteValidation = (req, res, next) => {
        const { error } = this.DeleteSchema.validate(req.params);
        if (error) return res.status(400).json({ errCode: 'GS-MP001', err: error.details[0].message });
        next();
    }

    CreateValidation = (req, res, next) => {
        const model = JSON.parse(req.body.model);
        const { error } = this.CreateSchema.validate(model);
        if (error) {
            model.mod_imgPath !== null ? fs.unlinkSync(`./uploads/${model.mod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-MP001', err: error.details[0].message })
        } 
        next();
    }
}; 