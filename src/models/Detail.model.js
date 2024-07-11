import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Detail extends Model {}
    Detail.init({
        det_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false, 
        },
        ref_id: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        }, 
        ref_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mod_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        det_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        det_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'detail',
        timestamps: true, 
    });

    return Detail; 
}