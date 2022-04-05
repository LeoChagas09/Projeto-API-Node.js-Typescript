import { Router } from 'express';
import ArrayController from '../controller/ArrayController';

const arrayRouter = Router();

arrayRouter.get('/', ArrayController.ArrayObjetos);

export default arrayRouter;
