import Joi from "joi";


export class OrderMiddleware { 



    // ----------- SCHEMAS:

  CreateSchema = Joi.object({


        usu_id: Joi.number().required(),
        prov_id: Joi.number().required(),
        or_name: Joi.string().max(30).required(),
        or_totalAmount: Joi.number().min(1).max(999999999).required(),
        or_deliveryDate: Joi.string().isoDate().required(),
        models: Joi.array().items(
            Joi.object({
                mod_id: Joi.number().required(),
                det_quantity: Joi.number().required(),
                det_amount: Joi.number().required(),
            })
        ).required()
    }); 

    OrIdSchema = Joi.object({
        or_id: Joi.number().required()
    });

    OrIdOsIdSchema = Joi.object({
        or_id: Joi.number().required(),
        os_id: Joi.number().required()
    });

    // ----------- VALIDATIONS:
    ValidateCreate = (req, res, next) => {
        const { error } = this.CreateSchema.validate(req.body);
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next();
    }; 

    ValidateOrId = (req, res, next) => {
        const { error } = this.OrIdSchema.validate(req.params);	
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next();
    };

    ValidateOrIdOsId = (req, res, next) => {
        const { error } = this.OrIdOsIdSchema.validate(req.params);	
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next();
    };
}