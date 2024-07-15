import { Password } from '../config/db.js'
import { PasswordService } from '../services/Password.service.js';
import bcrypt from 'bcryptjs'

export class PasswordController {

    createPassword = async(usu_id, usu_password) => {
        try {
            const saltRounds = 10; 
            const salt = await bcrypt.genSalt(saltRounds);

            const hashPassword = await bcrypt.hash(usu_password, salt);

            const passwordService = new PasswordService();
            const result = await passwordService.createPassword(usu_id, hashPassword);
            return true; 
        } catch (err) {
            return { errCode: 'GS-P001', err: err}
        }
    };

    validatePassword = async(usu_id, usu_password) => {
        try {
            const password = await Password.findOne({ where: { usu_id: usu_id }});
            if (!password) return { errCode: 'GS-P003'};
            
            const passwordService = new PasswordService();
            const matchPass = await passwordService.validatePassword(usu_password, password.dataValues.pass_hash);
            if (matchPass.errCode) return { errCode: 'GS-P004'};

            return matchPass; 
        } catch (err) {
            return { errCode: 'GS-P002', err: err}
        }
    };
};
