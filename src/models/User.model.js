import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class User extends Model {}
    User.init({
        usu_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        usu_username: {
            type: DataTypes.STRING,
            allowNull: false, 
        }, 
        usu_email: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        usu_token: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'user',
        timestamps: true, 
    });

    return User; 
}