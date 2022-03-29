import { Request, Response } from 'express';

export default class DataController {
  static async DiaAtual(req: Request, resp: Response): Promise<void> {
    const dataAtual = new Date();
    const dia = dataAtual.toLocaleString('pt-BR', { day: '2-digit' });

    resp.status(200).json(`Hoje é dia ${dia}`);
  }

  static async MesAtual(req: Request, resp: Response): Promise<void> {
    const dataAtual = new Date();
    const mes = dataAtual.toLocaleString('pt-BR', { month: 'long' });

    resp.status(200).json(`O Mês que estamos é de ${mes}`);
  }

  static async AnoAtual(req: Request, resp: Response): Promise<void> {
    const dataAtual = new Date();
    const ano = dataAtual.toLocaleString('pt-BR', { year: 'numeric' });

    resp.status(200).json(`Estamos no ano de ${ano}`);
  }
}
