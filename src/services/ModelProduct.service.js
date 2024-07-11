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
            return { errCode: 'GS-MP002', err: err}
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
}