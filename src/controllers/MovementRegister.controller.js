import { User, sequelize, ModelProduct } from "../config/db.js";
import { DetailController } from "./Detail.controller.js";
import { MovementRegisterService } from "../services/MovementRegister.service.js"


export class MovementRegisterController {

    createMovement = async (req, res) => {

        const transaction = await sequelize.transaction();
        const { usu_id, mv_type, models } = req.body; 

        try {
            const user = await User.findOne({ where: { usu_id: usu_id }, transaction})
            if (!user) { 
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-MR002' })
            }; 

            const types = [1,2,3]
            if (!types.includes(mv_type)) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-MR003' })
            };

            const detailController = new DetailController();
            const movementRegisterService = new MovementRegisterService();

            // ----- MOVEMENT: 
            const mv_totalAmount = models.reduce((total, elem) => total + elem.det_amount, 0);
            const movement = await movementRegisterService.createMovement(usu_id, mv_type, mv_totalAmount, { transaction });
                if (movement !== undefined && movement.errCode !== undefined) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: movement.errCode, err: movement.err })
                }; 

            for (const mod of models ) {
                const model = await ModelProduct.findOne({where: {mod_id: mod.mod_id}, transaction})

                if (!model) { 
                    await transaction.rollback();
                    return res.status(400).json({ errCode: 'GS-MR004' })
                };    


                // ------ QUANTITY VERIFICATION :
                if (mv_type !== 1) {
                    const modelNumber = await sequelize.query(`
                        SELECT
                            SUM(CASE WHEN mr.mv_type IN (1) THEN d.det_quantity  
                                    WHEN mr.mv_type IN (2, 3) THEN -d.det_quantity 
                            ELSE 0 END) AS total_items
                        FROM
                            movementRegisters mr
                        JOIN
                            details d ON mr.mv_id = d.ref_id
                        WHERE
                            d.mod_id = ${mod.mod_id}
                        GROUP BY
                            d.mod_id;
                        `,
                        { transaction }
                    );
                    
                    const mod_quantity = modelNumber[0][0].total_items; 

                    if (mod_quantity - mod.det_quantity < 0) {
                        await transaction.rollback();
                        return res.status(400).json({ errCode: 'GS-MR005', mod_name: model.dataValues.mod_name, mod_quantity: mod_quantity })
                    };
                }

                // ----- DETAIL: 
                const detail = await detailController.createDetail(movement, 1, mod.mod_id, mod.det_quantity, mod.det_amount, { transaction });
                if (detail !== undefined && detail.errCode !== undefined) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: detail.errCode, err: detail.err })
                }; 
            }; 

            await transaction.commit();
            res.status(200).json({ message: 'Movimiento registrado' });

        } catch (err) {
            await transaction.rollback();
            res.status(500).json({ errCode: 'GS-MR001', err: err })      
        }
    }; 


}