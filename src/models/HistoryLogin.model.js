import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class HistoryLogin extends Model {}
    HistoryLogin.init({
        log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        usu_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        log_ip: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        log_nav: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'historyLogin',
        timestamps: true, 
    });

    return HistoryLogin; 
}