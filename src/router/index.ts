import { Router } from 'express';
import alunoRouter from './aluno';
import apiRouter from './api';
import cursoRouter from './curso';
import dataRouter from './data';
import usuarioRouter from './usuario';

const routes = Router();

routes.use('/alunos', alunoRouter);
routes.use('/cursos', cursoRouter);
routes.use('/usuarios', usuarioRouter);
routes.use('/api', apiRouter);
routes.use('/data', dataRouter);

export default routes;
