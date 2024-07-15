import Joi from "joi";
import fs from 'fs'

export class CategoryMiddleware {

    // ----------- SCHEMAS:
    CreateSchema = Joi.object({
        cat_name: Joi.string().min(3).required(),
        cat_imgPath: Joi.string().required()
    });
    
    GetByIdSchema = Joi.object({
        cat_id: Joi.number().required()
    });

    DeleteSchema = Joi.object({
        cat_id: Joi.number().required()
    });

    UpdateSchema = Joi.object({
        cat_id: Joi.number().required(), 
        cat_name: Joi.string().required(),
        cat_imgPath: Joi.string().allow(null).required(), 
    });


    // ----------- VALIDATIONS:
    GetByIdValidation = (req, res, next) => {
        const { error } = this.GetByIdSchema.validate(req.query);
        if (error) return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message })
        next();
    }

    DeleteValidation = (req, res, next) => {
        const { error } = this.DeleteSchema.validate(req.params);
        if (error) return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message })
        next();
    }

    CreateValidation = (req, res, next) => {
        const category = JSON.parse(req.body.category);
        const { error } = this.CreateSchema.validate(category);
        if (error) {
            category.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${category.cat_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message }); 
        }

        if (!req.file) { 
            category.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${category.cat_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-M002' });
        }

        next();
    }

    UpdateValidation = (req, res, next) => {
        const category = JSON.parse(req.body.category);
        const { error } = this.UpdateSchema.validate(category);
        if (error) {
            category.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${category.cat_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message });
        }        

        if (!req.file) { 
            category.cat_imgPath !== null ? fs.unlinkSync(`./uploads/${category.cat_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            return res.status(400).json({ errCode: 'GS-M002' });
        }

        next();
    }
}