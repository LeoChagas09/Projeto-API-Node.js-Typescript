/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import oracledb from 'oracledb';
import bcrypt from 'bcryptjs';
import dbconfig from '../db/dbconfig';
import {
  DesativadoUsuario,
  TipoUsuarioInterface,
  AtualizarUsuarioInterface,
  UsuarioLogin,
  UsuarioNovoInterface,
  UsuarioInterface,
} from '../models/UsuarioInterface';
import convertLowerCase from '../convertLowerCase';

export default class UsuarioController {
  static async CriarUsuarios(req: Request, resp: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
      const usuario: UsuarioNovoInterface = req.body;

      if (
        usuario.nome === undefined ||
        usuario.login === undefined ||
        usuario.senha === undefined ||
        usuario.tipo_usuario === undefined ||
        usuario.desativado === undefined ||
        usuario.dataNascimento === undefined
      ) {
        resp.status(400).json('Falta parametros');
      }

      const sqlExiste = `SELECT login FROM teste_ti_cad_usuario WHERE login = :login`;

      const loginExists = await connection.execute<UsuarioLogin>(
        sqlExiste,
        [usuario.login],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );

      if (loginExists.rows !== undefined) {
        const convert = convertLowerCase(loginExists.rows);
        const userExists = convert.some(
          nomeUsuario => nomeUsuario.login === usuario.login,
        );

        // if (loginExists.rows !== undefined) {
        //   const convert = convertLowerCase(loginExists.rows);
        //   convert?.forEach(nomeUsuario => {
        //     if (nomeUsuario.login === login) {
        //       res.status(400).json('Usuário já cadastrado');
        //     }
        //   });
        // }

        if (userExists) {
          resp.status(400).json('Usuário já cadastrado');
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.senha, salt);

          const [dia, mes, ano] = req.body.dataNascimento.split('-');

          const sql =
            'INSERT INTO teste_ti_cad_usuario (nome, apelido, login, senha, tipo_usuario, desativado, dt_nascimento ) VALUES (:nome, :apelido, :login, :senha, :tipo_usuario, :desativado, :dt_nascimento)';

          const result = await connection.execute(
            sql,
            {
              nome: {
                val: String(usuario.nome),
                type: oracledb.STRING,
              },
              apelido: {
                val: String(usuario.apelido),
                type: oracledb.STRING,
              },
              login: {
                val: String(usuario.login),
                type: oracledb.STRING,
              },
              senha: {
                val: String(hash),
                type: oracledb.STRING,
              },
              tipo_usuario: {
                val: String(usuario.tipo_usuario),
                type: oracledb.STRING,
              },
              desativado: {
                val: Number(usuario.desativado),
                type: oracledb.NUMBER,
              },
              dt_nascimento: {
                val: new Date(ano, mes, dia),
                type: oracledb.DATE,
              },
            },
            {},
          );

          await connection.commit();

          resp
            .status(201)
            .json(
              `Usuário cadastrado com sucesso e foi inserido ${result.rowsAffected} linha`,
            );
        }
      }
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async ListarUsuariosAtivos(
    req: Request,
    resp: Response,
  ): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const sql = `SELECT cod_usuario, nome, apelido, login, senha, tipo_usuario, dt_nascimento FROM teste_ti_cad_usuario WHERE desativado = 0  ORDER BY nome`;

      const result = await connection.execute<UsuarioInterface>(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      resp.status(200).json(result.rows);
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async BuscarTiposUsuarios(
    req: Request,
    resp: Response,
  ): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const tipoUsuario = req.params.tipo_usuario;

      if (tipoUsuario === undefined) {
        resp.status(400).json('Tipo de Usuário invalido');
      }

      const sql = `SELECT cod_usuario, nome, apelido, login, senha, desativado, dt_nascimento FROM teste_ti_cad_usuario WHERE tipo_usuario = :tipo_usuario`;

      const result = await connection.execute<TipoUsuarioInterface>(
        sql,
        {
          tipo_usuario: {
            val: String(tipoUsuario),
            type: oracledb.STRING,
          },
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );
      resp.status(200).json(result.rows);
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async AtivarDesativarUsuario(
    req: Request,
    resp: Response,
  ): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const codUsuario = req.params.cod_usuario;
      const { desativado } = req.body;

      if (desativado === undefined) {
        resp.status(404).json('Falta parametros');
      }

      const sql =
        'UPDATE teste_ti_cad_usuario SET desativado = :desativado WHERE cod_usuario = :cod_usuario RETURN cod_usuario INTO :usuario';

      await connection.execute(
        sql,
        {
          desativado: {
            val: Number(desativado),
            type: oracledb.NUMBER,
          },
          cod_usuario: {
            val: Number(codUsuario),
            type: oracledb.NUMBER,
          },
          usuario: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_OUT,
          },
        },
        {},
      );

      connection.commit();

      resp.status(202).json(`Usuário atualizado com sucesso`);
    } catch (err) {
      await connection?.rollback();
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async LoginSenha(req: Request, resp: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const { login, senha } = req.body;

      if (login === undefined || senha === undefined) {
        resp.status(400).json('Usuário não encontrado');
      }

      const hash = bcrypt.hashSync(senha);

      bcrypt.compareSync(senha, hash);

      const sql = `SELECT login, senha FROM teste_ti_cad_usuario WHERE login = :login and senha = :senha `;

      await connection.execute(sql, {
        login: {
          val: String(login),
          type: oracledb.STRING,
        },
        senha: {
          val: String(senha),
          type: oracledb.STRING,
        },
      });
      resp.status(200).json('Usuário encontrado');
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async AtualizarUsuarios(req: Request, resp: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const codUsuario = req.params.cod_usuario;
      const usuario: AtualizarUsuarioInterface = req.body;

      if (
        usuario.nome === undefined ||
        usuario.login === undefined ||
        usuario.senha === undefined ||
        usuario.tipo_usuario === undefined ||
        usuario.desativado === undefined ||
        usuario.dataNascimento === undefined
      ) {
        resp.status(400).json('Falta parametros');
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(usuario.senha, salt);

      const [dia, mes, ano] = req.body.dataNascimento.split('-');

      const sql =
        'UPDATE teste_ti_cad_usuario SET nome = :nome, apelido = :apelido,login = :login, senha = :senha, tipo_usuario = :tipo_usuario, desativado = :desativado, dt_nascimento = : dt_nascimento WHERE cod_usuario = :cod_usuario RETURN cod_usuario INTO :usuario';

      const binds: oracledb.BindParameters = {
        nome: {
          val: String(usuario.nome),
          type: oracledb.STRING,
        },
        apelido: {
          val: String(usuario.apelido),
          type: oracledb.STRING,
        },
        login: {
          val: String(usuario.login),
          type: oracledb.STRING,
        },
        senha: {
          val: String(hash),
          type: oracledb.STRING,
        },
        tipo_usuario: {
          val: String(usuario.tipo_usuario),
          type: oracledb.STRING,
        },
        desativado: {
          val: Number(usuario.desativado),
          type: oracledb.NUMBER,
        },
        cod_usuario: {
          val: Number(codUsuario),
          type: oracledb.NUMBER,
        },
        dt_nascimento: {
          val: new Date(ano, mes, dia),
          type: oracledb.DATE,
        },
        usuario: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_OUT,
        },
      };

      await connection.execute(sql, binds, {});

      connection.commit();

      resp.status(202).json(`Usuário atualizado com sucesso`);
    } catch (err) {
      await connection?.rollback();
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async UsuariosAtivosInativos(
    req: Request,
    resp: Response,
  ): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const sql = `select cod_usuario, nome, apelido, login, senha, tipo_usuario, desativado, dt_nascimento from teste_ti_cad_usuario`;

      const result = await connection.execute<DesativadoUsuario>(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      if (result.rows !== undefined) {
        const convert = convertLowerCase(result.rows);
        let ativos = 0;
        let inativos = 0;

        convert.forEach(user => {
          if (user.desativado === 0) {
            ativos++;
          } else {
            inativos++;
          }
        });

        resp
          .status(200)
          .json(
            `O numero de usuáros ativos é de ${ativos} e o de usuários inativos é de ${inativos}`,
          );
      }
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async DataNascimento(req: Request, resp: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

      const sql = `SELECT cod_usuario, nome, apelido, login, senha, desativado, dt_nascimento FROM teste_ti_cad_usuario WHERE TO_CHAR(dt_nascimento, 'mm')`;

      const result = await connection.execute<UsuarioInterface>(
        sql,
        {
          dt_nascimento: {
            val: String(currentMonth),
            type: oracledb.STRING,
          },
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );

      resp.status(200).json(result.rows);
    } catch (err) {
      resp.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          resp.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }
}
