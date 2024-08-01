import { ModelProduct, sequelize } from "../config/db.js"

export class ModelProductService {

    createModel = async (prod_id, models, transaction) => { 
        try {
            for (const mod of models) {
                const createdModel = await ModelProduct.create({
                    prod_id: prod_id, 
                    mod_name: mod.mod_name,
                    mod_desc: mod.mod_desc,
                    mod_imgPath: mod.mod_imgPath,
                    mod_active: true,
                }, transaction)
            }
            return true; 
        } catch (err) {
            return { errCode: 'GS-MP001', err: err}
        }
    }

    updateModel = async (model) => {
        try {
            const updatedModel = await sequelize.query(
                `UPDATE ModelProducts SET
                    mod_name = :mod_name,
                    mod_desc = :mod_desc,
                    mod_imgPath = COALESCE(:mod_imgPath, mod_imgPath)
                WHERE mod_id = :mod_id
                `, {
                    replacements: {
                        mod_name: model.mod_name,
                        mod_desc: model.mod_desc,
                        mod_imgPath: model.mod_imgPath,
                        mod_id: model.mod_id
                    }
                }
            )
            return updatedModel;
        } catch (err) {
            return { errCode: 'GS-MP003', err: err}
        }
    }

    deleteModel = async (mod_id) => {
        try {
            const result = await ModelProduct.update({ mod_active: false }, { where: { mod_id: mod_id }});
            return true; 
        } catch (err) {
            return { errCode: 'GS-MP006', err: err}
        }
    }

    getModelUnitById = async (mod_id) => {
        try {
            const quantity = await sequelize.query(
                `SELECT 
                    COALESCE(SUM(CASE 
                        WHEN mr.mv_type = 1 THEN d.det_quantity 
                        WHEN mr.mv_type IN (2, 3) THEN -d.det_quantity 
                        ELSE 0 
                    END), 0) AS total_quantity
                FROM 
                    modelProducts mp
                LEFT JOIN 
                    details d ON mp.mod_id = d.mod_id AND d.ref_type = 1
                LEFT JOIN 
                    movementRegisters mr ON d.ref_id = mr.mv_id
                WHERE 
                    mp.mod_id = :mod_id
                GROUP BY 
                    mp.mod_id, mp.mod_desc, mp.mod_imgPath, mp.mod_name
                ORDER BY 
                    mp.mod_id;`, 
                { replacements: { mod_id: mod_id }, type: sequelize.QueryTypes.SELECT });
            return quantity[0]; 
        } catch (err) {
            return { errCode: 'GS-MP008', err: err};
        }

    }; 

    createModelFromWeb = async (cat_id, prod_id, mod_name, mod_desc, mod_imgPath) => {
        try {
            const result = await ModelProduct.create({ cat_id: cat_id, prod_id: prod_id, mod_name: mod_name, mod_desc:mod_desc, mod_imgPath: mod_imgPath, mod_active: true });
            return true; 
        } catch (err) {
            return { errCode: 'GS-MP011', err: err }
        }
    }; 
    
}