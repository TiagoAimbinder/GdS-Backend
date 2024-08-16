import Joi from "joi";



export class MovementRegisterMiddleware {

    // ----------- SCHEMAS:
    CreateSchema = Joi.object({
        usu_id: Joi.number().required(),
        prov_id: Joi.number().allow(null).required(),
        mv_type: Joi.number().valid(1,2,3,4).required(),
        models: Joi.array().items(
            Joi.object({
                mod_id: Joi.number().required(),
                det_quantity: Joi.number().required(),
                det_amount: Joi.number().required(),
            })
        ).required()
    }); 

    ProdIdSchema = Joi.object({
        prod_id: Joi.number().required()
    });



    // ----------- VALIDATIONS:
    CreateValidation = (req, res, next) => {
        const { error } = this.CreateSchema.validate(req.body);
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next();
    }; 

    ProdIdValidation = (req, res, next) => {
        const { error } = this.ProdIdSchema.validate(req.params);
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next(); 
    }; 
}; 