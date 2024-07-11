import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Password extends Model {}
    Password.init({
        pass_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        usu_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        pass_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'password',
        timestamps: true, 
    });

    return Password; 
}