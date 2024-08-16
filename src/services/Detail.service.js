
import { Detail } from "../config/db.js";

export class DetailService {

    createDetail = async (ref_id, ref_type, mod_id, det_quantity, det_amount, transaction) => {

        try {
            const result = await Detail.create({
                ref_id: ref_id,
                ref_type: ref_type,
                mod_id: mod_id,
                det_quantity: det_quantity,
                det_amount: det_amount
            }, transaction);
            return true; 
        } catch (err) {
            return { errCode: 'GS-DT001', err: err }
        }
    }; 
}; 