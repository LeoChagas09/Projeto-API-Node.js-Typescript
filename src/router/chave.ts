import { Router } from 'express';
import ChaveController from '../controller/ChaveController';

const chaveRouter = Router();

chaveRouter.get('/:tamanho', ChaveController.ChaveRandomica);

export default chaveRouter;
