import { Router } from "express";
import { DetailController } from '../controllers/Detail.controller.js'


const routeDetail = new Router(); 

const detailController = new DetailController();

routeDetail.post('/create', detailController.createDetail); 
routeDetail.put('/update', detailController.updateDetail); 


return { routeDetail }; 