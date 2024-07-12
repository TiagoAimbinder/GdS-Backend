import { MovementRegister } from "../config/db.js";

export class MovementRegisterService {
    
    createMovement = async (usu_id, mv_type, mv_totalAmount, transaction) => {
        try {
            const result = await MovementRegister.create({ 
                usu_id: usu_id, 
                mv_type: mv_type, 
                mv_totalAmount: mv_totalAmount 
            }, transaction );
            return result.dataValues.mv_id; 
        } catch (err) {
            return { errCode: 'GS-MR001', err: err } 
        }
    }

    
}
