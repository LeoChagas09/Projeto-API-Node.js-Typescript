export interface UsuarioNovoInterface {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  tipo_usuario: string;
  desativado: number;
  dataNascimento: Date;
}

export interface AtualizarUsuarioInterface {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  tipo_usuario: string;
  desativado: number;
  dataNascimento: Date;
}

export interface UsuarioInterface {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  tipo_usuario: string;
  dt_nascimento: Date;
}

export interface TipoUsuarioInterface {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  desativado: number;
}

export interface UsuarioLogin {
  login: string;
}

export interface DesativadoUsuario {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  tipo_usuario: string;
  desativado: number;
}

export interface TipoUsuarioDesativadoInterface {
  cod_usuario: number;
  nome: string;
  apelido: string;
  login: string;
  senha: string;
  dt_usuario: string;
}
