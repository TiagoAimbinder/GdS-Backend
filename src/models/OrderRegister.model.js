import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class OrderRegister extends Model {}
    OrderRegister.init({
        or_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        usu_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        prov_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        or_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        or_totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        or_deliveryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        or_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'orderRegister',
        timestamps: true, 
    });

    return OrderRegister; 
}