import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class StandardError extends Model {}
    StandardError.init({
        err_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        err_code: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        err_message: {
            type: DataTypes.STRING,
            allowNull: false, 
        } 
    },
    {
        sequelize,
        modelName: 'standardError',
        timestamps: true, 
    });

    return StandardError; 
}