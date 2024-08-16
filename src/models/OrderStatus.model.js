import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class OrderStatus extends Model {}
    OrderStatus.init({
        os_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        os_name: {
            type: DataTypes.STRING,
            allowNull: false, 
        }, 
    },
    {
        sequelize,
        modelName: 'orderStatus',
        timestamps: false, 
    });

    return OrderStatus; 
}