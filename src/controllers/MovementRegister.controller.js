import { User, sequelize, ModelProduct, Provider, Product } from "../config/db.js";
import { DetailController } from "./Detail.controller.js";
import { MovementRegisterService } from "../services/MovementRegister.service.js"


export class MovementRegisterController {

    createMovement = async (req, res) => {

        const transaction = await sequelize.transaction();
        const { usu_id, prov_id, mv_type, models } = req.body; 

        try {
            const user = await User.findOne({ where: { usu_id: usu_id }, transaction})
            if (!user) { 
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-MR002' })
            }; 

            const types = [1,2,3,4]
            if (!types.includes(mv_type)) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-MR003' })
            };

            if (mv_type === 1) {
                const provider = await Provider.findOne({ where: { prov_id: prov_id }, transaction})
                if (!provider) { 
                    await transaction.rollback();
                    return res.status(400).json({ errCode: 'GS-MR006' })
                };
            }

            const detailController = new DetailController();
            const movementRegisterService = new MovementRegisterService();

            // ----- MOVEMENT: 
            const mv_totalAmount = models.reduce((total, elem) => total + elem.det_amount, 0);
            const movement = await movementRegisterService.createMovement(usu_id, prov_id, mv_type, mv_totalAmount, { transaction });
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

    getMovementsByProdId = async (req, res) => {
        try {
            const { prod_id } = req.params; 
            const product = await Product.findOne({ where: { prod_id: prod_id }})
            if (!product) {
                return res.status(400).json({ errCode: 'GS-MR007' } )
            } 

            const movementRegisterService = new MovementRegisterService();
            const result = await movementRegisterService.getMovementsByProdId(prod_id);
            if (result !== undefined && result.errCode !== undefined) {
                return res.status(400).json({ errCode: result.errCode, err: result.err }); 
            }
            res.status(200).json(result); 
        } catch (err) {
            res.status(500).json({ errCode: 'GS-MR008', err: err }); 
        }
    }; 

    registerMovFromUpd = async (or_id, usu_id, prov_id, or_totalAmount, transaction) => {
        try {
            const movData = await sequelize.query(`
                SELECT 
                    d.mod_id, 
                    d.det_quantity, 
                    d.det_amount
                FROM 
                    details d
                JOIN 
                    orderRegisters o ON d.ref_id = o.or_id
                WHERE 
                    o.or_id = ${or_id};
            `,
            {
                type: sequelize.QueryTypes.SELECT,
                transaction: transaction, 
            })

            const movRegSrv = new MovementRegisterService();
            const detailSrv = new DetailController();

            const mv_id = await movRegSrv.createMovement(usu_id, prov_id, 1, or_totalAmount, transaction);
            if (mv_id !== undefined && mv_id.errCode !== undefined) {
                await transaction.rollback();
                return res.status(400).json({ errCode: mv_id.errCode, err: mv_id.err })
            }; 

            for (const mod of movData) {
                const detail = await detailSrv.createDetail(mv_id, 1, mod.mod_id, mod.det_quantity, mod.det_amount, { transaction });
                if (detail !== undefined && detail.errCode !== undefined) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: detail.errCode, err: detail.err })
                }; 
            }
            
            return true; 
        } catch (err) {
            return { errCode: 'GS-MR009', err: err };
        }
    }; 
}