import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class ProductXProvider extends Model {}
    ProductXProvider.init({
        pxp_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        prod_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        prov_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        pxp_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false, 
        }
    },
    {
        sequelize,
        modelName: 'productXProvider',
        timestamps: true, 
    });

    return ProductXProvider; 
}