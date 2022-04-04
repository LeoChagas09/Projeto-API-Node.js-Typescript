import { Router } from 'express';
import CursoController from '../controller/CursoController';

const cursoRouter = Router();

cursoRouter.get('/teste', CursoController.InserirItemNoJSON);
cursoRouter.get('/', CursoController.show);
cursoRouter.get('/:id', CursoController.find);
cursoRouter.post('/', CursoController.create);
cursoRouter.post('/lista', CursoController.InserirListaCursos);
cursoRouter.put('/:id', CursoController.update);
cursoRouter.delete('/:id', CursoController.delete);

export default cursoRouter;
