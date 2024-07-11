import { Product, Category, Provider, sequelize } from "../config/db.js";
import { ProductService } from "../services/Product.service.js";
import { ModelProductController } from "./ModelProduct.controller.js";
import fs from 'fs'

export class ProductController {

    createProduct = async (req, res) => {

        const transaction = await sequelize.transaction();
        const product = JSON.parse(req.body.product);

        try {
            const models = JSON.parse(req.body.models);
            const providers = JSON.parse(req.body.providers); 
            const productService = new ProductService();
            const modelProductController = new ModelProductController();

            const cat_id = Number(product.cat_id);
            const category = await Category.findOne({ where: { cat_id: cat_id }, transaction})
            if (!category) {
                fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
                await transaction.rollback(); return res.status(400).json({ errCode: 'GS-C006' });
            }

            // ---- PRODUCT: 
            const productName = await Product.findOne({ where: { prod_name: product.prod_name }, transaction})
            if (productName) { await transaction.rollback(); return res.status(400).json({ errCode: 'GS-PR002' });}
            const createdProduct = await productService.createProduct(product, { transaction });
            if (createdProduct !== undefined && createdProduct.errCode) {
                fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
                await transaction.rollback(); return res.status(400).json({ errCode: createdProduct.errCode, err: createdProduct.err});
            }

            // ---- PRODUCT X PROVIDERS: 
            if (!Array.isArray(providers) || providers.length === 0) { await transaction.rollback(); return res.status(400).json({ errCode: 'GS-PR003' }); }
            for (const prov of providers) {
                const providerExist = await Provider.findOne({ where: { prov_id: prov.prov_id }}, transaction);
                if (!providerExist) {
                    fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
                    await transaction.rollback(); return res.status(400).json({ errCode: 'GS-PR005', prov_id: prov.prov_id}); 
                }
            }; 
            const createdProdXProv = await productService.createProdXProv(createdProduct.dataValues.prod_id, providers, { transaction });
            if (createdProdXProv !== undefined && createdProdXProv.errCode) { 
                fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
                await transaction.rollback(); return res.status(400).json({ errCode: createdProdXProv.errCode, err: createdProdXProv.err});
            }
            
            // ---- MODELS: 
            const modelsCreated = await modelProductController.createModel(createdProduct.dataValues.prod_id, models, { transaction });
            if (modelsCreated !== undefined && modelsCreated.errCode) {
                fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
                await transaction.rollback(); return res.status(400).json({ errCode: modelsCreated.errCode, err: modelsCreated.err});
            }

            await transaction.commit();
            res.status(200).json({message: "Producto creado correctamente."});
            
        } catch (err) {
            await transaction.rollback();
            fs.unlinkSync(`./uploads/${product.prod_imgPath}`);
            res.status(500).json({ errCode: 'GS-PR001' });
        }
   
    };

    updateProduct = async (req, res) => {
        const product = JSON.parse(req.body.product);
        try {

            const productDb = await Product.findOne({ where: { prod_id: product.prod_id }});
            if (!productDb) {
                product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
                return res.status(400).json({ errCode: 'GS-PR009'})
            };     

            const category = await Category.findOne({ where: { cat_id: product.cat_id }})
            if (!category) { 
                product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
                return res.status(400).json({ errCode: 'GS-C006' });
            }

            const productName = await Product.findOne({ where: { prod_name: product.prod_name }})
            if (productName) {
                product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
                return res.status(400).json({ errCode: 'GS-PR002' });
            }

            const productService = new ProductService();
            const result = await productService.updateProduct(product, prod_imgPath, imgChange);

            if (result !== undefined && result.errCode !== undefined) {
                product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
                res.status(400).json({ errCode: result.errCode, err: result.err });
            } 

            product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            res.status(200).json({message: 'Producto actualizado correctamente.'});
        } catch (err) { 
            product.prod_imgPath !== null ? fs.unlinkSync(`./uploads/${product.prod_imgPath}`) : fs.unlinkSync(`./uploads/null`);
            res.status(500).json({ errCode: 'GS-PR001' });
        }
    };

    deleteProduct = async (req, res) => {
        try {
            const { prod_id } = req.params;
            const product = await Product.findOne({ where: { prod_id: prod_id }})
            if (!product || product.dataValues.prod_active === false) { return res.status(400).json({ errCode: 'GS-PR009'});}

            const productService = new ProductService();
            const result = await productService.deleteProduct(prod_id);
            if (result !== undefined && result.errCode) { return res.status(400).json({ errCode: result.errCode, err: result.err }) };

            res.status(200).json({ message: 'Producto eliminado correctamente.'});
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PR010'});            
        }
    }; 
}; 