import { Password } from '../config/db.js'
import bcrypt from 'bcryptjs'

export class PasswordService {

    createPassword = async(usu_id, pass_hash) => {
        try {
            const createPassword = await Password.create({
                usu_id: usu_id,
                pass_hash: pass_hash
            }); 

            return { message: 'Contraseña guardada correctamente'}; 
            
        } catch (err) {
            return { errCode: 'GS-P002', err: err}
        }
    }; 

    validatePassword = async (usu_password, usu_passwordDB) => {
        try {
            const matchPass = await bcrypt.compare(usu_password, usu_passwordDB);
            return matchPass;
        } catch (err) {
            return { errCode: 'GS-P005', err: err}
        }
    }

}