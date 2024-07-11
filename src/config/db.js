import { config } from 'dotenv'; 
import Sequelize from 'sequelize'; 

config();

// Environment vars: 
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env; 


const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mssql',
    dialectOptions: {
    options: {
        encrypt: false,
        // tdsVersion: '8_0', 
    },
    },
    define: {
        timestamps: true 
    },
    logging: false, // Block console msgs from Sequelize
});

// Connection verify 
const connection = async () => {
    try {
        await sequelize.authenticate()
        .then(() => {
        console.log('Conexión a la base de datos establecida correctamente.');})
    }
    catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        console.error('Error details:', err);
        if (err.original) {
        console.error('Original error details:', err.original);
        }
    }
}

// Models import: 
import UserModel from '../models/User.model.js';
const User = UserModel(sequelize);

import CategoryModel from '../models/Category.model.js';
const Category = CategoryModel(sequelize);

import DetailModel from '../models/Detail.model.js';
const Detail = DetailModel(sequelize);

import HistoryLoginModel from '../models/HistoryLogin.model.js';
const HistoryLogin = HistoryLoginModel(sequelize);

import ModelProductModel from '../models/ModelProduct.model.js';
const ModelProduct = ModelProductModel(sequelize);

import MovementRegisterModel from '../models/MovementRegister.model.js';
const MovementRegister = MovementRegisterModel(sequelize);

import PasswordModel from '../models/Password.model.js';
const Password = PasswordModel(sequelize);

import ProductModel from '../models/Product.model.js';
const Product = ProductModel(sequelize);

import ProviderModel from '../models/Provider.model.js'
const Provider = ProviderModel(sequelize);

import OrderRegisterModel from '../models/OrderRegister.model.js';
const OrderRegister = OrderRegisterModel(sequelize);

import StandardErrorModel from '../models/StandardError.model.js';
const StandardError = StandardErrorModel(sequelize);

import ProductXProviderModel from '../models/ProductXProvider.model.js';    
const ProductXProvider = ProductXProviderModel(sequelize);

// Sequelize: 
sequelize.sync({alter : true}) // {alter : true}
    .then(() => {
        console.log('Modelo sincronizado con la base de datos.');
    })
    .catch(err => {
        console.error('Error al sincronizar el modelo con la base de datos:', err);
    });

export {
    User,
    HistoryLogin,
    ModelProduct,
    MovementRegister,
    Password,
    Product,
    Provider,
    Detail,
    Category,
    StandardError,
    OrderRegister,
    ProductXProvider,
    sequelize,
    connection,
}