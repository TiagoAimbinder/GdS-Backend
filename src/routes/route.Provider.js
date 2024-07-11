
import { Router } from 'express' 
import { ProviderController } from '../controllers/Provider.controller.js';


const routeProvider = new Router(); 
const providerController = new ProviderController();

routeProvider.post('/create', providerController.createProvider);
routeProvider.put('/update', providerController.updateProvider);
routeProvider.delete('/delete/:prov_id', providerController.deleteProvider);

export { routeProvider }; 