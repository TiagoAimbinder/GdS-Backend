import { Provider, sequelize } from "../config/db.js";

export class ProviderService {

    createProvider = async (prov) => {
        try {
            const result = Provider.create({
                prov_name: prov.prov_name, 
                prov_razonSocial: prov.prov_razonSocial, 
                prov_cuit: prov.prov_cuit, 
                prov_email: prov.prov_email, 
                prov_address: prov.prov_address, 
                prov_accountDetails: prov.prov_accountDetails,
                prov_active: true,
            })
            return result; 
        } catch (err) {
            return { errCode: 'GS-PV001', err: err}
        }
    }; 

    updateProvider = async (prov_id, query, updatedFields) => {
        try {
            
            const result = await sequelize.query(
                query, {
                    replacements: {...updatedFields, prov_id: prov_id}
                }
            )

            return result; 
        } catch (err) {
            return { errCode: 'GS-PV001', err: err }
        }
    }; 

    deleteProvider = async (prov_id) => {
        try {
            const result = Provider.update(
                { prov_active: false }, {
                    where: { prov_id: prov_id }
                }
            ); 
            return result;    
        } catch (err) {
            return { errCode: 'GS-PV005', err: err } 
        }
    }; 
}; 