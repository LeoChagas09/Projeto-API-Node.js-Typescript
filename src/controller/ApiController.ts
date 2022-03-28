import { Request, Response } from 'express';
import api from '../api';

export default class ApiController {
  static async BuscarCep(req: Request, res: Response): Promise<void> {
    try {
      const { cep } = req.params;
      const { data } = await api.get(`/${cep}/json`);
      res.json(data);
    } catch (err) {
      res.status(400).json('Erro');
    }
  }
}
