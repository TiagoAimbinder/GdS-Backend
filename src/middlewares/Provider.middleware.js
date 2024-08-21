import Joi from "joi";


export class ProviderMiddleware {

    // ----------- SCHEMAS:
    CreateSchema = Joi.object({
        prov_name: Joi.string().allow(null).required(),
        prov_phone: Joi.string().allow(null).required(),
        prov_email: Joi.string().allow(null).required(),
        prov_cuit: Joi.string().allow(null).required(),
        prov_address: Joi.string().allow(null).required(),
        prov_social: Joi.string().allow(null).required(),
        prov_accountDetails: Joi.string().allow(null).required(),
    })

    UpdateSchema = Joi.object({
        prov_id: Joi.number().required(),
        prov_name: Joi.string().allow(null).required(),
        prov_phone: Joi.string().allow(null).required(),
        prov_email: Joi.string().allow(null).required(),
        prov_cuit: Joi.string().allow(null).required(),
        prov_address: Joi.string().allow(null).required(),
        prov_social: Joi.string().allow(null).required(),
        prov_accountDetails: Joi.string().allow(null).required(),
    })

    DeleteSchema = Joi.object({
        prov_id: Joi.number().required(),
    })

    // ----------- VALIDATIONS:
    CreateValidation = (req, res, next) => {
        const { error } = this.CreateSchema.validate(req.body);
        if (error) return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message })
        next();
    };

    UpdateValidation = (req, res, next) => {
        const { error } = this.UpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message })
        next();
    };

    DeleteValidation = (req, res, next) => { 
        const { error } = this.DeleteSchema.validate(req.params);
        if (error) return res.status(400).json({ errCode: 'GS-M001', errMessage: error.details[0].message })
        next();
    }
}; 