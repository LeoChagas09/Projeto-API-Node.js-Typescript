/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import { Request, Response } from 'express';

export default class ChaveController {
  static async ChaveRandomica(req: Request, resp: Response): Promise<void> {
    const { tamanho } = req.params;
    function geraStringAleatoria(tamanho: number) {
      let stringAleatoria = '';
      const caracteres =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < tamanho; i++) {
        stringAleatoria += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length),
        );
      }
      return stringAleatoria;
    }

    resp.status(200).json(geraStringAleatoria(Number(tamanho)));
  }
}
