import { Router } from 'express';
import UsuarioController from '../controller/UsuarioController';

const usuarioRouter = Router();

usuarioRouter.get('/', UsuarioController.ListarUsuariosAtivos);
usuarioRouter.get('/data', UsuarioController.DataNascimento);
usuarioRouter.get('/users', UsuarioController.UsuariosAtivosInativos);
usuarioRouter.get('/login', UsuarioController.LoginSenha);
usuarioRouter.get('/:tipo_usuario', UsuarioController.BuscarTiposUsuarios);
usuarioRouter.post('/', UsuarioController.CriarUsuarios);
usuarioRouter.put('/:cod_usuario', UsuarioController.AtivarDesativarUsuario);
usuarioRouter.put(
  '/atualizar/:cod_usuario',
  UsuarioController.AtualizarUsuarios,
);

export default usuarioRouter;
