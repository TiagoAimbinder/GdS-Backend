import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Provider extends Model {}
    Provider.init({
        prov_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        prov_name: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        prov_cuit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prov_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prov_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prov_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prov_accountDetails: {
            type: DataTypes.TEXT, 
            allowNull: true,
        },
        prov_social: {
            type: DataTypes.STRING,
            allowNull: true,    
        },
        prov_active: {
            type: DataTypes.BOOLEAN, 
            allowNull: false,
        },
    },

    {
        sequelize,
        modelName: 'provider',
        timestamps: true, 
    });

    return Provider; 
}