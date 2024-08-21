import { DetailService } from "../services/Detail.service.js";


export class DetailController {

    createDetail = async (ref_id, ref_type, mod_id, det_quantity, det_amount, transaction) => {
        try {
            const detailService = new DetailService();
            const detail = await detailService.createDetail(ref_id, ref_type, mod_id, det_quantity, det_amount, transaction);
            return detail; 
        } catch (err) {
            return { errCode: 'GS-DT001', err: err }
        }
    };

}; 