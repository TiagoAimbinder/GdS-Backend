import Joi from "joi";
import fs from 'fs'

export class ProductMiddleware {


    // ----------- SCHEMAS:
    CreateSchemaProduct = Joi.object({
        cat_id: Joi.number().required(),
        prod_name: Joi.string().required(),
        prod_imgPath: Joi.string().allow(null).required(),
    }); 

    CreateSchemaModels = Joi.array().items(
        Joi.object({
            mod_name: Joi.string().required(),  
            mod_desc: Joi.string().allow(null).required(),
            mod_imgPath: Joi.string().allow(null).required(),
        })
    );

    UpdateSchemaProduct = Joi.object({
        prod_id: Joi.number().required(),
        cat_id: Joi.number().required() ,
        prod_nameNew: Joi.string().required() ,
        prod_nameOld: Joi.string().required() ,
        prod_imgPath: Joi.string().required(),
    }).allow(null);

    UpdateSchemaModel = Joi.array().items(
        Joi.object({
            mod_name: Joi.string().required(),
            mod_desc: Joi.string().allow(null).required(),
            mod_imgPath: Joi.string().required(),
        })
    ).allow(null);

    DeleteSchema = Joi.object({
        prod_id: Joi.number().required(),
    });


    // ----------- VALIDATIONS:
    CreateValidation = (req, res, next) => {
        const product = JSON.parse(req.body.product);
        const models = JSON.parse(req.body.models);
        const uploadedFiles = req.files.map(file => file.filename); 

        const { error: errorProduct } = this.CreateSchemaProduct.validate(product);
        if (errorProduct) {
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
            return res.status(400).json({ errCode: 'GS-MW001', errMessage: errorProduct.details[0].message });
        }

        const { error: errorModels } = this.CreateSchemaModels.validate(models);
        if (errorModels) {
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
            return res.status(400).json({ errCode: 'GS-MW001', errMessage: errorModels.details[0].message });
        }

        if (!req.files) { 
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
            return res.status(400).json({ errCode: 'GS-MW002' });
        }   

        next();
    }

    UpdateValidation = (req, res, next) => {
        const product = req.body.product ? JSON.parse(req.body.product) : null;
        const models = req.body.models ? JSON.parse(req.body.models) : null;
        const uploadedFiles = req.files ? req.files.map(file => file.filename) : []; 

        const { error: errProduct } = this.UpdateSchemaProduct.validate(product);
        const { error: errModel } = this.UpdateSchemaModel.validate(models);

        console.log('Err Product: ', errProduct);
        console.log('Err Product: ', errModel);

        if (errProduct) {
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
            return res.status(400).json({ errCode: 'GS-MW001', errMessage: errProduct.details[0].message });
        }

        if (errModel) {
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
            return res.status(400).json({ errCode: 'GS-MW001', errMessage: errModel.details[0].message });
        }

        next()
    } 

    ProdIdValidation = (req, res, next) => {
        const { error } = this.DeleteSchema.validate(req.params)
        if (error) return res.status(400).json({ errCode: 'GS-MW001', errMessage: error.details[0].message });
        next();
    };
}; 