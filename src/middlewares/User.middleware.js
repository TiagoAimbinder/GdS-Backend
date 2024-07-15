import Joi from "joi";

export class UserMiddleware {


    // ----------- SCHEMAS
    LoginSchema = Joi.object({
        usu_email: Joi.string().email().required(),
        usu_password: Joi.string().required(),
        log_ip: Joi.string().allow(null, '').required(),
        log_nav: Joi.string().allow(null, '').required(),
    });

    RegisterSchema = Joi.object({
        usu_username: Joi.string().min(3).max(30).required(),
        usu_email: Joi.string().email().required(),
        usu_password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required()
    }); 

    // ----------- VALIDATIONS
    LoginValidation = async (req, res, next) => {
        const login = req.body; 
        const { error } = this.LoginSchema.validate(login);
        if (error) { return res.status(400).json({ errCode: 'GS-MW001', err: error})}
        next(); 
    }; 

    RegisterValidation = async (req, res, next) => {
        const register = req.body;
        const { error } = this.RegisterSchema.validate(register);
        if (error) { return res.status(400).json({ errCode: 'GS-MW002', err: error})}
        next();
    };
}; 