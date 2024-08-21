import { MovementRegister, sequelize } from "../config/db.js";

export class MovementRegisterService {
    
    createMovement = async (usu_id, prov_id, mv_type, mv_totalAmount, transaction) => {
        try {
            const result = await MovementRegister.create({ 
                usu_id: usu_id,
                prov_id: prov_id, 
                mv_type: mv_type, 
                mv_totalAmount: mv_totalAmount 
            }, transaction );
            return result.dataValues.mv_id; 
        } catch (err) {
            return { errCode: 'GS-MR001', err: err } 
        }
    }

    getMovementsByProdId = async (prod_id) => {
        try {
            const result = await sequelize.query(`
                SELECT 
                    mr.mv_id,
                    mr.mv_type,
                    mr.mv_totalAmount,
                    mr.createdAt AS mv_createdAt,
                    d.det_id,
                    d.ref_id,
                    d.ref_type,
                    mp.mod_id,  
                    mp.mod_name,  
                    d.det_quantity,
                    d.det_amount,
                    p.prov_name,
                    p.prov_social
                FROM 
                    movementRegisters mr
                JOIN 
                    details d ON mr.mv_id = d.ref_id
                JOIN 
                    modelProducts mp ON d.mod_id = mp.mod_id
                JOIN 
                    products pr ON mp.prod_id = pr.prod_id
                LEFT JOIN 
                    providers p ON mr.prov_id = p.prov_id
                WHERE 
                    pr.prod_id = :prod_id;
            `, {
                replacements: { prod_id: prod_id },
                type: sequelize.QueryTypes.SELECT
            });

            const groupedResults = result.reduce((acc, curr) => {
                if (!acc[curr.mv_id]) {
                    acc[curr.mv_id] = [];
                }
                acc[curr.mv_id].push({
                    det_id: curr.det_id,
                    ref_id: curr.ref_id,
                    ref_type: curr.ref_type,
                    mod_name: curr.mod_name,
                    mod_id: curr.mod_id,
                    det_quantity: curr.det_quantity,
                    det_amount: curr.det_amount,
                    mv_type: curr.mv_type,
                    mv_totalAmount: curr.mv_totalAmount,
                    mv_createdAt: curr.mv_createdAt,
                    prov_name: curr.prov_name,
                    prov_social: curr.prov_social,
                });
                return acc;
            }, {});
            return groupedResults;

        } catch (err) {
            return { errCode: 'GS-MR008', err: err }
        }
    }

    registerMovFromUpd = async (movement, transaction) => {
        try {
            
        } catch (err) {
            
        }
    }; 
}
