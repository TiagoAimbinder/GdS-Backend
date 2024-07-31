import { sequelize, User } from '../config/db.js';
import { UserService } from '../services/User.service.js';
import { PasswordController } from './Password.controller.js'; 
import jwt from 'jsonwebtoken';



export class UserController {

    registerUser = async (req, res) => { 
        try {
            const { usu_username, usu_email, usu_password } = req.body; 

            // Data repeated validation: 
            const validateUser = await sequelize.query(
                'SELECT usu_email FROM Users WHERE usu_email = :usu_email',
                {
                    replacements: { usu_username, usu_email },
                    type: sequelize.QueryTypes.SELECT,
            }); 

            if (validateUser.length >= 1) { return res.status(400).json({errCode: "GS-U001"})};

            // Register User
            const userService = new UserService();
            const usu_id = await userService.registerUser(usu_username, usu_email);

            if (usu_id.err) { return res.status(500).json({errCode: usu_id.errCode, err: usu_id.err}); } 

            // Register Password
            const passwordController = new PasswordController();
            const result = await passwordController.createPassword(usu_id.usu_id, usu_password);
            
            if (result.err) { return res.status(500).json({errCode: result.errCode, err: result.err}); } 

            res.status(200).json({ message: 'Usuario registrado correctamente' });
        } catch (err) {
            res.status(500).json({ errCode: 'GS-U003'});
        }
    }

    loginUser = async(req, res) => {
        try {
            const { usu_email, usu_password, log_ip, log_nav} = req.body;  

            const user = await User.findOne({where: { usu_email: usu_email }});
            if (!user) {return res.status(404).json({ errCode: 'GS-U004' })}; 

            const passwordController = new PasswordController();
            const passwordValid = await passwordController.validatePassword(user.dataValues.usu_id, usu_password);

            if (passwordValid.errCode) { return res.status(500).json({ errCode: passwordValid.errCode, err: passwordValid.err })};
            if (passwordValid === false) { return res.status(401).json({ errCode: 'GS-U006' })}

            const userService = new UserService(); 
            const usu_token = await userService.loginUser(user.dataValues.usu_id, user.dataValues.usu_email, log_ip, log_nav); 
            if (usu_token.errCode) { return res.status(500).json({ errCode: usu_token.errCode, err: usu_token.err })};

            res.status(200).json({ loginStatus: passwordValid, token: usu_token, usu_id: user.dataValues.usu_id, usu_username: user.dataValues.usu_username})
        } catch (err) {
            res.status(500).json({ errCode: 'GS-U005'});
        }; 
    }   

    
    validateToken = async (req, res) => {
        const { usu_token, usu_id } = req.query;

        if (!usu_token) {
            return res.status(403).json({ validation: false });
        }
    
        try {
        // Verifica el token
        jwt.verify(usu_token, process.env.SECRET_KEY, async (err, decoded) => { 
            if (err) {
            return res.status(403).json({ validation: false });
            }
    
            // Verifica en la base de datos
            const user = await User.findOne({ where: { usu_id: usu_id } });
            if (!user || user.dataValues.usu_token !== usu_token) {
            return res.status(404).json({ validation: false });
            }
    
            return res.status(200).json({ validation: true });
        });
        } catch (err) {
        return res.status(404).json({ validation: false });
        }
    };
}
