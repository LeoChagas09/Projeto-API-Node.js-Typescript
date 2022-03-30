/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import oracledb from 'oracledb';
import dbconfig from '../db/dbconfig';
import { CursoInterface } from '../models/CursoInterface';

export default class CursoController {
  static async show(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
      const sql = `SELECT id, nome, professor
        FROM teste_ti_curso `;

      const result = await connection.execute<CursoInterface>(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      res.status(200).json(result.rows);
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async find(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const idCurso = req.params.id;

      if (idCurso === undefined) {
        res.status(400).json('Codigo invalido');
      }

      const sql = `SELECT nome, professor FROM teste_ti_curso WHERE id = :id`;

      const result = await connection.execute<CursoInterface>(
        sql,
        {
          id: {
            val: Number(idCurso),
            type: oracledb.NUMBER,
          },
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        },
      );
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const { nomeCurso, professor } = req.body;

      if (nomeCurso === undefined || professor === undefined) {
        res.status(404).json('Falta parametros');
      }

      const sql =
        'INSERT INTO teste_ti_curso (nome, professor) VALUES (:nome, :professor )';

      const result = await connection.execute(
        sql,
        {
          nome: {
            val: String(nomeCurso),
            type: oracledb.STRING,
          },
          professor: {
            val: String(professor),
            type: oracledb.STRING,
          },
        },
        { autoCommit: true },
      );

      connection.commit();

      res
        .status(201)
        .json(
          `Curso cadastrado com sucesso e foi inserido ${result.rowsAffected} linha`,
        );
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const idCurso = req.params.id;
      const { nomeCurso, professor } = req.body;

      if (nomeCurso === undefined || professor === undefined) {
        res.status(404).json('Falta parametros');
      }

      const sql =
        'UPDATE teste_ti_curso SET nome = :nome, professor = :professor WHERE id = :id RETURN id INTO :curso';

      await connection.execute(
        sql,
        {
          nome: {
            val: String(nomeCurso),
            type: oracledb.STRING,
          },
          professor: {
            val: String(professor),
            type: oracledb.STRING,
          },
          id: {
            val: Number(idCurso),
            type: oracledb.NUMBER,
          },
          curso: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
          },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },
      );

      connection.commit();

      res.status(202).json(`Curso atualizado com sucesso`);
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const idCurso = req.params.id;

      if (idCurso === undefined) {
        res.status(400).json('Codigo invalido');
      }

      const sql = `DELETE FROM teste_ti_curso
         WHERE id = :id`;

      await connection.execute(sql, {
        id: {
          val: Number(idCurso),
          type: oracledb.NUMBER,
        },
      });

      connection.commit();

      res.status(200).json('Curso deletado com sucesso');
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }

  static async InserirListaCursos(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);

      const { cursos } = req.body;

      cursos.forEach(cursos);

      if (cursos.nomeCurso === undefined || cursos.professor === undefined) {
        res.status(404).json('Falta parametros');
      }

      const sql =
        'INSERT INTO teste_ti_curso (nome, professor) VALUES (:nome, :professor )';

      const result = await connection.execute(
        sql,
        {
          nome: {
            val: String(cursos.nomeCurso),
            type: oracledb.STRING,
          },
          professor: {
            val: String(cursos.professor),
            type: oracledb.STRING,
          },
        },
        {},
      );

      connection.commit();

      res
        .status(201)
        .json(
          `Cursos cadastrados com sucesso e foi inserido ${result.rowsAffected} linhas`,
        );
    } catch (err) {
      res.status(400).json('Erro de Conexão');
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.status(400).json('Erro ao fechar a Conexão');
        }
      }
    }
  }
}
