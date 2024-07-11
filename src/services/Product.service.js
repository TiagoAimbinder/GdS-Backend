import { Product, ProductXProvider } from "../config/db.js";

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

    updateProduct = async (product, prod_imgPath, imgChange) => {
        try {
            const result = await Product.update({
                cat_id: product.cat_id,
                prod_name: product.prod_name,
                prod_imgPath: product.prod_imgPath,
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
}; 