
import { Provider, sequelize } from '../config/db.js'
import { ProviderService } from '../services/Provider.service.js';

export class ProviderController { 

    createProvider = async (req, res) => {

        try {
            const { prov_name, prov_phone, prov_cuit, prov_email, prov_address, prov_accountDetails, prov_social } = req.body; 

            const provider = await Provider.findOne({ where: { prov_name: prov_name }})
            if (provider) { return res.status(400).json({errCode: 'GS-PV002'})}


            const prov = {
                prov_name: prov_name,
                prov_phone: prov_phone,
                prov_cuit: prov_cuit,
                prov_email: prov_email,
                prov_address: prov_address,
                prov_accountDetails: prov_accountDetails,
                prov_social: prov_social
            }

            const providerService = new ProviderService();
            const result = await providerService.createProvider(prov);
            if (result !== undefined && result.errCode !== undefined) { return res.status(400).json({errCode: result.errCode, err: result.err})}
            res.status(200).json({ message: 'Proveedor creado correctamente.'})
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PV001'})
        }
    }; 

    updateProvider = async (req, res) => {
        try {
            const { prov_id, prov_name, prov_razonSocial, prov_cuit, prov_email, prov_address, prov_accountDetails, prov_social } = req.body; 
            const provider = Provider.findOne({ where: {prov_id: prov_id}}); 
            if (!provider) { return res.status(400).json({ errCode: 'GS-PV004'})} 

            const provName = await Provider.findOne({ where: {prov_name: prov_name}});
            if (provName) { return res.status(400).json({errCode: 'GS-PV002'}) }          

            const possibleFields = {
                prov_name: prov_name,
                prov_razonSocial: prov_razonSocial,
                prov_cuit: prov_cuit,
                prov_email: prov_email,
                prov_address: prov_address,
                prov_accountDetails: prov_accountDetails,
                prov_social: prov_social,
            };

            const updatedFields = Object.keys(possibleFields)
                .filter(key => possibleFields[key] !== undefined)
                .reduce((obj, key) => {
                    obj[key] = possibleFields[key];
                    return obj;
                }, {}); 
            
            const setString = Object.keys(updatedFields)
                .map(key => `${key}=:${key}`)
                .join(', ');

            const query = `UPDATE Providers SET ${setString} WHERE prov_id = :prov_id`;

            const providerService = new ProviderService();
            const result = await providerService.updateProvider(prov_id, query, updatedFields);
            if (result !== undefined && result.errCode) { return res.status(400).json({errCode: result.errCode, err: result.err })};

            res.status(200).json({message: 'Proveedor actualizado correctamente.'})
        } catch (err) {
            res.status(500).json({errCode: 'GS-PV003', err: err})
        }
    }; 

    deleteProvider = async (req, res) => {
        try {
            const { prov_id } = req.params; 

            const provider = await Provider.findOne({ where: {prov_id: prov_id}});
            if (!provider || provider.dataValues.prov_active === false) { return res.status(400).json({errCode: 'GS-PV004'})}
            
            const providerService = new ProviderService();
            const result = await providerService.deleteProvider(prov_id);

            if ( result !== undefined && result.errCode) { return res.status(400).json({errCode: result.errCode, err: result.err})}
            res.status(200).json({ message: 'Proveedor eliminado correctamente' })
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PV005'})
        }
    }; 

    getAllProviders = async (req, res) => {
        try {
            const providers = await sequelize.query(
                `SELECT prov_id, prov_name, prov_phone, prov_cuit, prov_email, prov_address, prov_accountDetails, prov_social FROM Providers WHERE prov_active = 1`, 
                { type: sequelize.QueryTypes.SELECT }
            )
            return res.status(200).json(providers)
        } catch (err) {
            res.status(500).json({ errCode: 'GS-PV006'} )
        }
    }; 
}









