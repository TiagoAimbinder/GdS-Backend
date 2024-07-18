import Joi from "joi";



export class MovementRegisterMiddleware {

    // ----------- SCHEMAS:
    CreateSchema = Joi.object({
        usu_id: Joi.number().required(),
        prov_id: Joi.number().required(),
        mv_type: Joi.number().valid(1,2,3).required(),
        models: Joi.array().items(
            Joi.object({
                mod_id: Joi.number().required(),
                det_quantity: Joi.number().required(),
                det_amount: Joi.number().required(),
            })
        ).required()
    }); 


    // ----------- VALIDATIONS:
    CreateValidation = (req, res, next) => {
        const { error } = this.CreateSchema.validate(req.body);
        if (error) return res.status(400).json({ errCode: 'GS-MR001', errMessage: error.details[0].message })
        next();
    }; 
}; 