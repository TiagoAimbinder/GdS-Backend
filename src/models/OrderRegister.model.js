import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class OrderRegister extends Model {}
    OrderRegister.init({
        od_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        usu_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        od_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        od_totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        od_dateCreated: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
        od_deliveryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        or_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
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