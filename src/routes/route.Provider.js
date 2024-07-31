
import { Router } from 'express' 
import { ProviderController } from '../controllers/Provider.controller.js';
import { ProviderMiddleware } from '../middlewares/Provider.middleware.js';
import { authJWT } from '../config/utils.js';

const routeProvider = new Router(); 
const providerController = new ProviderController();
const providerMiddleware = new ProviderMiddleware();

routeProvider.post('/create', authJWT, providerMiddleware.CreateValidation, providerController.createProvider);
routeProvider.put('/update',authJWT, providerMiddleware.UpdateValidation, providerController.updateProvider);
routeProvider.delete('/delete/:prov_id',authJWT, providerMiddleware.DeleteValidation, providerController.deleteProvider);
routeProvider.get('/getAll',authJWT, providerController.getAllProviders);

export { routeProvider }; 