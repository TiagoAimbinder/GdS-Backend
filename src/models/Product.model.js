import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Product extends Model {}
    Product.init({
        prod_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        cat_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        prod_name: {
            type: DataTypes.STRING,
            allowNull: false, 
        }, 
        prod_imgPath: {
            type: DataTypes.STRING,
            allowNull: true, 
        }, 
        prod_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false, 
        }
    },

    {
        sequelize,
        modelName: 'product',
        timestamps: true, 
    });

    return Product; 
}