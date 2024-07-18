import { Product, sequelize, ProductXProvider } from "../config/db.js";

export class ProductService {

    createProduct = async (product, transaction) => {
        try {
            const result = await Product.create({
                cat_id: product.cat_id,
                prod_name: product.prod_name,
                prod_imgPath: product.prod_imgPath,
                prod_active: true,
            }, transaction);
            return result; 
        } catch (err) {
            return { errCode: 'GS-PR004', err: err}
        }
    }

    createProdXProv = async (prod_id, providers, transaction) => {
        try {
            for (const prov of providers) {
                const pxpCreated = await ProductXProvider.create({ 
                    prod_id: prod_id, 
                    prov_id: prov.prov_id, 
                    pxp_active: true}, transaction); 
            }
        } catch (err) {
            return { errCode: 'GS-PR006', err: err}
        }
    }; 

    updateProduct = async (product, prod_imgPath) => {
        try {
            const result = await Product.update({
                cat_id: product.cat_id,
                prod_name: product.prod_name,
                prod_imgPath: prod_imgPath,
                prod_active: product.prod_active,
            }, { where: { prod_id: product.prod_id }});
            return result;

        } catch (err) {
            return { errCode: 'GS-PR008', err: err}
        }
    };

    deleteProduct = async (prod_id) => {
        try {
            const result = await Product.update({ prod_active: false}, { where: { prod_id: prod_id }});
            return true;
        } catch (err) {
            return { errCode: 'GS-PR011', err: err}
        }
    };

    productSelected = async (prod_id) => {
        try {
            const result = await sequelize.query(`
                SELECT 
                    mp.mod_id,
                    mp.mod_desc,
                    mp.mod_imgPath,
                    mp.mod_name,
                    COALESCE(SUM(CASE WHEN mr.mv_type = 1 THEN d.det_quantity WHEN mr.mv_type IN (2, 3) THEN -d.det_quantity ELSE 0 END), 0) AS total_quantity,
                    (SELECT COALESCE(SUM(d2.det_amount), 0)
                    FROM details d2
                    INNER JOIN movementRegisters mr2 ON d2.ref_id = mr2.mv_id AND d2.ref_type = 1
                    WHERE d2.mod_id = mp.mod_id AND mr2.mv_type = 2) AS total_amount_egresos,
                    (SELECT COALESCE(SUM(d3.det_amount), 0)
                    FROM details d3
                    INNER JOIN movementRegisters mr3 ON d3.ref_id = mr3.mv_id AND d3.ref_type = 1
                    WHERE d3.mod_id = mp.mod_id AND mr3.mv_type = 1) AS total_amount_ingresos
                FROM 
                    modelProducts mp
                LEFT JOIN 
                    details d ON mp.mod_id = d.mod_id AND d.ref_type = 1
                LEFT JOIN 
                    movementRegisters mr ON d.ref_id = mr.mv_id
                WHERE 
                    mp.prod_id = :prod_id
                GROUP BY 
                    mp.mod_id, mp.prod_id, mp.mod_desc, mp.mod_imgPath, mp.mod_name
                ORDER BY 
                    mp.mod_id;
            `, {
                replacements: { prod_id: prod_id },
                type: sequelize.QueryTypes.SELECT
            });
            console.log(result);
            return result
        } catch (err) {
            return { errCode: 'GS-PR013', err: err}
        }
    };
}; 