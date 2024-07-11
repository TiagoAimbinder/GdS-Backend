import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class ModelProduct extends Model {}
    ModelProduct.init({
        mod_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        prod_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        mod_name: {
            type: DataTypes.STRING,
            allowNull: false, 
        }, 
        mod_desc: {
            type: DataTypes.TEXT,
            allowNull: true, 
        }, 
        mod_imgPath: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        mod_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false, 
        }
    },

    {
        sequelize,
        modelName: 'modelProduct',
        timestamps: true, 
    });

    return ModelProduct; 
}