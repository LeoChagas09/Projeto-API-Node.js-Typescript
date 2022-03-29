import { Router } from 'express';
import MesController from '../controller/DataController';

const dataRouter = Router();

dataRouter.get('/dia', MesController.DiaAtual);
dataRouter.get('/mes', MesController.MesAtual);
dataRouter.get('/ano', MesController.AnoAtual);

export default dataRouter;
