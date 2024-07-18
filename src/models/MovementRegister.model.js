import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class MovementRegister extends Model {}
    MovementRegister.init({
        mv_id: {
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
        mv_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mv_totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'movementRegister',
        timestamps: true, 
    });

    return MovementRegister; 
}