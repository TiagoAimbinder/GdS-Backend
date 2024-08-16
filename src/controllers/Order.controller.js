import { ModelProduct, Provider, sequelize, User, OrderRegister, OrderStatus} from "../config/db.js";
import { OrderService } from "../services/Order.service.js";
import { DetailController } from "./Detail.controller.js";
import { MovementRegisterController } from "./MovementRegister.controller.js";


export class OrderController {

    createOrder = async (req, res) => { 
        const { usu_id, prov_id, or_name, or_totalAmount, or_deliveryDate, models } = req.body; 
        const transaction = await sequelize.transaction()

        const detailCtr = new DetailController();
        const orderSrv = new OrderService();

        try {

            // User validation: 
            const user = await User.findOne({ where: { usu_id: usu_id }, transaction});
            if (!user) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-OR006' });
            }; 
            
            // Provider validation:
            const provider = await Provider.findOne({ where: { prov_id: prov_id, prov_active: true}, transaction});
            if (!provider) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-OR005' });
            };

            // Amount validaiton:
            if (or_totalAmount < 0) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-OR002' });
            }; 

            // Date validation: 
            const deliveryDate = new Date(or_deliveryDate);
            const dateNow = new Date();
            if (deliveryDate < dateNow) {
                await transaction.rollback();
                return res.status(400).json({ errCode: 'GS-OR003' });
            }; 

            // Create order: 
            const order = await orderSrv.createOrder(usu_id, prov_id, or_name, or_totalAmount, or_deliveryDate, { transaction });
            if (order.errCode !== undefined) {
                await transaction.rollback();
                return res.status(400).json({ errCode: order.errCode, err: order.errCode });
            }

            // Create order status history: 
            const orderHistory = await orderSrv.createOrderHistory(order.dataValues.or_id, { transaction });
            if (orderHistory.errCode !== undefined) {
                await transaction.rollback();
                return res.status(400).json({ errCode: orderHistory.errCode, err: orderHistory.errCode });
            }

            // ---- MODELS: 
            for (const mod of models) {
                const model = await ModelProduct.findOne({where: {mod_id: mod.mod_id, mod_active: true}, }, { transaction })
                if (!model) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: 'GS-OR004' });
                }

                // ---- DETAIL: 
                const detail = await detailCtr.createDetail(order.dataValues.or_id, 1, mod.mod_id, mod.det_quantity, mod.det_amount, { transaction });
                if (detail.errCode !== undefined) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: orderHistory.errCode, err: orderHistory.errCode });
                }
            }; 

            await transaction.commit();
            res.status(200).json({ message: 'Pedido registrado correctamente' }); 

        } catch (err) {
            await transaction.rollback();            
            res.status(500).json({ errCode: 'GS-OR001' });
        }
    }; 

    getAllOrders = async (req, res) => {
        try {
            const orderSrv = new OrderService();
            const orders = await orderSrv.getAllOrders();
            if (orders.errCode !== undefined) { return res.status(400).json({ errCode: orders.errCode, err: orders.err }); }

            res.status(200).json(orders)
        } catch (err) {
            res.status(500).json({ errCode: 'GS-OR007' });
        }
    }

    getOrderById = async (req, res) => {
        const { or_id } = req.params; 

        try {
            const order = await OrderRegister.findOne({ where: { or_id: or_id, or_active: true }});
            if (!order) { return res.status(400).json({ errCode: 'GS-OR008' });}

            const orderSrv = new OrderService();
            const result = await orderSrv.getOrderById(or_id);

            if (result.errCode !== undefined) { return res.status(400).json({ errCode: result.errCode, err: result.err });}

            res.status(200).json(result);

        } catch (err) {
            res.status(500).json({errCode: 'GS-OR009', err: err});
        }
    }; 

    updateStatus = async (req, res) => {
        const { or_id, os_id } = req.params; 
        const transaction = await sequelize.transaction();
        try {
            const order = await OrderRegister.findOne({ where: { or_id: or_id, or_active: true }, transaction});
            if (!order) { 
                await transaction.rollback();
                return res.status(404).json({ errCode: 'GS-OR011' });
            }


            const status = await OrderStatus.findOne({ where: { os_id: os_id }, transaction})
            if (!status) { 
                await transaction.rollback();
                return res.status(404).json({ errCode: 'GS-OR012' });
            }

            const orderSrv = new OrderService();
            const result = await orderSrv.updateStatus(or_id, os_id, { transaction }); // Agregar transaction
            if (result.errCode !== undefined) { 
                await transaction.rollback();
                return res.status(400).json({ errCode: result.errCode, err: result.err }); 
            }


            if (Number(os_id) === 4) {

                const movRegCtr = new MovementRegisterController(); 
                const movCreated = await movRegCtr.registerMovFromUpd(or_id, order.dataValues.usu_id, order.dataValues.prov_id, order.dataValues.or_totalAmount,transaction);
    
                if (movCreated.errCode !== undefined) {
                    await transaction.rollback();
                    return res.status(400).json({ errCode: movCreated.errCode, err: movCreated.err });
                }
            }

            await transaction.commit();
            res.status(200).json({ message: 'Estado actualizado correctamente.'});

        } catch (err) {
            await transaction.rollback();
            res.status(500).json({errCode: 'GS-OR010', err: err});
        }
    }; 
};