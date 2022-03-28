import { Router } from 'express';
import ApiController from '../controller/ApiController';

const apiRouter = Router();

apiRouter.get(`/:cep`, ApiController.BuscarCep);

export default apiRouter;
