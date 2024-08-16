import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class OrderStatusHistory extends Model {}
    OrderStatusHistory.init({
        osh_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        or_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        os_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        osh_dateCreated: {
            type: DataTypes.DATE,
            allowNull: false, 
        }, 
    },
    {
        sequelize,
        modelName: 'orderStatusHistory',
        timestamps: false, 
    });

    return OrderStatusHistory; 
}