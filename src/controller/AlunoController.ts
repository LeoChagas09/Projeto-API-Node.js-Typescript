import { Request, Response } from 'express';
import oracledb from 'oracledb';
import dbconfig from '../db/dbconfig';
import { AlunoInterface } from '../models/AlunoInterface';

export default class AlunoController {
  static async show(req: Request, res: Response): Promise<void> {
    let connection;

    try {
      connection = await oracledb.getConnection(dbconfig);
      const sql = `SELECT a.id "id", a.nome "NomeAluno", b.nome "NomeCurso"
        FROM teste_ti_aluno a  join teste_ti_curso b
        on a.id_curso = b.id`;

      const result = await connection.execute<AlunoInterface>(sql, [], {
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

      const idAluno = req.params.id;

      if (idAluno === undefined) {
        res.status(400).json('Codigo invalido');
      }

      const sql = `SELECT a.nome "NomeAluno", b.nome "NomeCurso" FROM teste_ti_aluno a join teste_ti_curso b
        on a.id_curso = b.id
        WHERE a.id = :id`;

      const result = await connection.execute<AlunoInterface>(
        sql,
        {
          id: {
            val: Number(idAluno),
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

      const { nomeAluno, idCurso } = req.body;

      if (nomeAluno === undefined || idCurso === undefined) {
        res.status(400).json('Falta parametros');
      }

      const sql =
        'INSERT INTO teste_ti_aluno (nome, id_curso) VALUES (:nome, :id_curso )';

      const result = await connection.execute(
        sql,
        {
          nome: {
            val: String(nomeAluno),
            type: oracledb.STRING,
            maxSize: 256,
          },
          id_curso: {
            val: Number(idCurso),
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true },
      );

      connection.commit();

      res
        .status(201)
        .json(
          `Aluno cadastrado com sucesso e foi inserido ${result.rowsAffected} linha`,
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

      const idAluno = req.params.id;
      const { nomeAluno, idCurso } = req.body;

      if (nomeAluno === undefined || idCurso === undefined) {
        res.status(400).json('Falta parametros');
      }

      const sql =
        'UPDATE teste_ti_aluno SET nome = :nome, id_curso = :id_curso WHERE id = :id RETURN id INTO :aluno';

      await connection.execute(
        sql,
        {
          nome: {
            val: String(nomeAluno),
            type: oracledb.STRING,
            maxSize: 256,
          },
          id_curso: {
            val: Number(idCurso),
            type: oracledb.NUMBER,
          },
          id: {
            val: Number(idAluno),
            type: oracledb.NUMBER,
          },
          aluno: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
          },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },
      );

      connection.commit();

      res.status(202).json(`Aluno atualizado com sucesso`);
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

      const idAluno = req.params.id;

      if (idAluno === undefined) {
        res.status(400).json('Codigo invalido');
      }

      const sql = `DELETE FROM teste_ti_aluno
         WHERE id = :id`;

      await connection.execute(sql, {
        id: {
          val: Number(idAluno),
          type: oracledb.NUMBER,
        },
      });

      connection.commit();

      res.status(200).json('Aluno deletado com sucesso');
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
