import { Product, Category, sequelize, ModelProduct } from "../config/db.js";
import { ProductService } from "../services/Product.service.js";
import { ModelProductController } from "./ModelProduct.controller.js";
import fs from 'fs'

export class ProductController {

    createProduct = async (req, res) => {
        const transaction = await sequelize.transaction();

        const uploadedFiles = req.files.map(file => file.filename); 
        const product = JSON.parse(req.body.product);
        const models = JSON.parse(req.body.models);

        try {
            const productService = new ProductService();
            const modelProductController = new ModelProductController();

            const cat_id = Number(product.cat_id);
            const category = await Category.findOne({ where: { cat_id: cat_id }, transaction})
            if (!category) {
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                await transaction.rollback(); return res.status(400).json({ errCode: 'GS-C006' });
            }

            // ---- PRODUCT: 
            const productName = await Product.findOne({ where: { prod_name: product.prod_name }, transaction})
            if (productName) { 
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                await transaction.rollback(); 
                return res.status(400).json({ errCode: 'GS-PR002' });
            }

            const createdProduct = await productService.createProduct(product, { transaction });
            if (createdProduct !== undefined && createdProduct.errCode) {
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                await transaction.rollback(); 
                return res.status(400).json({ errCode: createdProduct.errCode, err: createdProduct.err});
            }

            // ---- MODELS: 
            const modelsCreated = await modelProductController.createModel(createdProduct.dataValues.prod_id,models, { transaction });
            if (modelsCreated !== undefined && modelsCreated.errCode) {
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);})
                await transaction.rollback(); 
                return res.status(400).json({ errCode: modelsCreated.errCode, err: modelsCreated.err});
            }

            await transaction.commit();
            res.status(200).json({message: "Producto creado correctamente."});
            
        } catch (err) {
            await transaction.rollback();
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);})
            res.status(500).json({ errCode: 'GS-PR001' });
        }
    };

    updateProduct = async (req, res) => {
        const transaction = await sequelize.transaction();

        const uploadedFiles = req.files ? req.files.map(file => file.filename) : []; 
        const product = req.body.product ? JSON.parse(req.body.product) : null;
        const models = req.body.models ? JSON.parse(req.body.models) : null;

        try {
            const productService = new ProductService();
            const modelProductController = new ModelProductController();

            // Find product: 
            const productDb = await Product.findOne({ where: { prod_id: product.prod_id }, transaction});
            if (!productDb) {
                await transaction.rollback();
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                return res.status(400).json({ errCode: 'GS-PR009'})
            };     

            // Delete previous image
            if (uploadedFiles.length > 0) {
                const prodFile = uploadedFiles.some(elem => elem.includes('prod_'));
                prodFile === true ? fs.unlinkSync(`./uploads/${productDb.dataValues.prod_imgPath}`) : null;
            }

            // Find category:
            const category = await Category.findOne({ where: { cat_id: product.cat_id }, transaction})
            if (!category) { 
                await transaction.rollback();
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                return res.status(400).json({ errCode: 'GS-C006' });
            }

            // Name validation - not repeated: 
            if (product.prod_nameNew !== product.prod_nameOld) {
                const productName = await Product.findOne({ where: { prod_name: product.prod_nameNew, prod_active: true}, transaction})
                if (productName) {
                    await transaction.rollback();
                    uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);});
                    return res.status(400).json({ errCode: 'GS-PR002' });
                }
            }

            // Create models: 
            if (models !== null) {
                const modelsCreated = await modelProductController.createModel(product.prod_id, models, { transaction });
                if (modelsCreated !== undefined && modelsCreated.errCode) {
                    uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);})
                    await transaction.rollback(); 
                    return res.status(400).json({ errCode: modelsCreated.errCode, err: modelsCreated.err});
                }
            } 

            // Update product: 
            const updatedProduct = await productService.updateProduct(product, { transaction });
            if (updatedProduct !== undefined && updatedProduct.errCode !== undefined) {
                uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);})
                await transaction.rollback(); 
                return res.status(400).json({ errCode: updatedProduct.errCode, err: updatedProduct.err });
            } 

            await transaction.commit();
            res.status(200).json({message: 'Producto actualizado correctamente.'});
        } catch (err) { 
            uploadedFiles.forEach(fileName => { fs.unlinkSync(`./uploads/${fileName}`);})
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

    getAllProducts = async (req, res) => {
        try {
            const product = await Product.findAll({where: {prod_active: true}});
            if (!product) {
                return res.status(400).json({ errCode: 'GS-PR011' });
            }; 
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PR012' });            
        }
    }; 

    getProductById = async (req, res) => {
        try {
            const prod_id = req.params.prod_id; 
            const product = await Product.findOne({ where: {prod_id: prod_id, prod_active: true}});
            if (!product) {
                return res.status(400).json({ errCode: 'GS-PR009' });
            }; 
            res.status(200).json([product]);
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PR012' });
        }
    }; 

    productSelected = async (req, res) => {
        try {
            const prod_id = req.params.prod_id; 
            const product = await Product.findOne({ where: {prod_id: prod_id}});
            if (!product) {
                return res.status(400).json({ errCode: 'GS-PR009' });
            }; 

            const productService = new ProductService(); 
            const result = await productService.productSelected(prod_id);

            res.status(200).json(result)
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PR013'});
        }
    };
}; 







