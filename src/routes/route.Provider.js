
import { Router } from 'express' 
import { ProviderController } from '../controllers/Provider.controller.js';
import { ProviderMiddleware } from '../middlewares/Provider.middleware.js';

const routeProvider = new Router(); 
const providerController = new ProviderController();
const providerMiddleware = new ProviderMiddleware();

routeProvider.post('/create', providerMiddleware.CreateValidation, providerController.createProvider);
routeProvider.put('/update', providerMiddleware.UpdateValidation, providerController.updateProvider);
routeProvider.delete('/delete/:prov_id', providerMiddleware.DeleteValidation, providerController.deleteProvider);

export { routeProvider }; 