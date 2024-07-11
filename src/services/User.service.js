import { HistoryLogin, User } from "../config/db.js";
import jwt from "jsonwebtoken";

export class UserService {

    registerUser = async (usu_username, usu_email) => {
        try {
            const createUser = await User.create({ 
                usu_username: usu_username, 
                usu_email: usu_email,
                usu_token: null, 
            });
            return { usu_id: createUser.dataValues.usu_id };
        } catch (err) {
            return { errCode: 'GS-U002', err: err }
        }
    }; 

    loginUser = async (usu_id, usu_email, log_ip, log_nav) => {
        try {
            const token = jwt.sign({ username: usu_email }, process.env.SECRET_KEY, {expiresIn:'4h'});
            await User.update({usu_token: token}, {where: {usu_id: usu_id}});
            await HistoryLogin.create({usu_id: usu_id, log_ip: log_ip, log_nav: log_nav}); 

            return token;
        } catch (err) {
            return { errCode: 'GS-U007', err: err }
        }
    }; 
}; 