import { Router } from 'express';
import AlunoController from '../controller/AlunoController';

const alunoRouter = Router();

alunoRouter.get('/', AlunoController.show);
alunoRouter.get('/:id', AlunoController.find);
alunoRouter.post('/', AlunoController.create);
alunoRouter.put('/:id', AlunoController.update);
alunoRouter.delete('/:id', AlunoController.delete);

export default alunoRouter;
