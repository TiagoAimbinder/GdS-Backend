
import { OrderRegister, OrderStatusHistory, sequelize } from '../config/db.js'

export class OrderService {

    createOrder = async (usu_id, prov_id, or_name, or_totalAmount, or_deliveryDate, transaction) => {
        try {
            const order = await OrderRegister.create({
                usu_id: usu_id,
                prov_id: prov_id,
                or_name: or_name,
                or_totalAmount: or_totalAmount,
                or_deliveryDate: or_deliveryDate,
                or_active: true,
            }, transaction); 

            return order;
        } catch (err) {
            return { errCode: 'GS-OR001', err: err }
        }
    }; 

    createOrderHistory = async (or_id, transaction) => {
        try {   
        const orderHistory = await OrderStatusHistory.create({
                or_id: or_id, 
                os_id: 1,
                osh_dateCreated: new Date(),
            }, transaction);
            return orderHistory; 
        } catch (err) {
            return { errCode: 'GS-OR002', err: err }
        }
    } ; 

    getAllOrders = async () => {
        try {
            const orders = await sequelize.query(`
                WITH LatestOrderStatus AS (
                    SELECT
                        osh.or_id,
                        MAX(s.os_id) AS max_os_id
                    FROM
                        orderStatusHistories osh
                    INNER JOIN orderStatuses s ON osh.os_id = s.os_id
                    GROUP BY
                        osh.or_id
                )
                SELECT
                    o.or_id,
                    o.or_name,
                    o.or_totalAmount,
                    o.or_deliveryDate,
                    o.or_active,
                    s.os_name,
                    s.os_id,
                    u.usu_username,
                    u.usu_id,
                    p.prov_name,
                    (
                        SELECT 
                            mp.mod_name,
                            prod.prod_name,
                            d.det_quantity,
                            d.det_amount
                        FROM 
                            details d
                            INNER JOIN modelProducts mp ON d.mod_id = mp.mod_id
                            LEFT JOIN products prod ON mp.prod_id = prod.prod_id
                        WHERE 
                            d.ref_id = o.or_id
                        FOR JSON PATH
                    ) AS details
                FROM
                    orderRegisters o
                    INNER JOIN LatestOrderStatus los ON o.or_id = los.or_id
                    INNER JOIN orderStatuses s ON los.max_os_id = s.os_id
                    INNER JOIN users u ON o.usu_id = u.usu_id
                    INNER JOIN providers p ON o.prov_id = p.prov_id
                WHERE
                    o.or_active = 1;

                `, 
                // AND s.os_id IN (1, 2, 3)
                {
                    type: sequelize.QueryTypes.SELECT
                })
            return orders;
        } catch (err) {
            return { errCode: 'GS-OR007', err: err }
        }
    };

    getOrderById = async (or_id) => {
        try {
            const result = await sequelize.query(`
                SELECT
                    o.or_name,
                    o.or_id,
                    o.or_totalAmount,
                    o.or_deliveryDate,
                    p.prov_name,
                    u.usu_username,
                    (
                        SELECT 
                            mp.mod_name,
                            prod.prod_name,
                            d.det_quantity,
                            d.det_amount
                        FROM 
                            details d
                            INNER JOIN modelProducts mp ON d.mod_id = mp.mod_id
                            LEFT JOIN products prod ON mp.prod_id = prod.prod_id
                        WHERE 
                            d.ref_id = o.or_id
                        FOR JSON PATH
                    ) AS details,
                    (
                        SELECT
                            osh.os_id,
                            osh.osh_dateCreated,
                            os.os_name
                        FROM 
                            orderStatusHistories osh
                            INNER JOIN orderStatuses os ON osh.os_id = os.os_id
                        WHERE
                            osh.or_id = o.or_id
                        FOR JSON PATH
                    ) AS order_status
                FROM
                    orderRegisters o
                    JOIN providers p ON o.prov_id = p.prov_id
                    JOIN users u ON o.usu_id = u.usu_id
                WHERE
                    o.or_id = :or_id;
                `,{
                    replacements: { or_id: or_id },
                    type: sequelize.QueryTypes.SELECT
            });

            return result[0]; 
        } catch (err) {
            return { errCode: 'GS-OR009', err: err }
        }
    }; 

    updateStatus = async (or_id, os_id, transaction) => {
        try {
            const order = await OrderStatusHistory.create({
                or_id: or_id,
                os_id: os_id,
                osh_dateCreated: new Date(),
            }, transaction)
            return order; 
        } catch (err) {
            return { errCode: 'GS-OR010', err: err }
        }

    };
}; 