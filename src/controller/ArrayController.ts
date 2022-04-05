/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';

export default class ArrayController {
  static async ArrayObjetos(req: Request, res: Response): Promise<void> {
    // criar um array de objetos que contenham nome, idade, salario. Adicionar 5 registros(de forma manual, não vai pro banco) e realizar:
    const funcionarios = [
      {
        nome: 'Leonardo',
        idade: 19,
        salario: 1100,
      },
      {
        nome: 'Felipe',
        idade: 20,
        salario: 1500,
      },
      {
        nome: 'Fernanda',
        idade: 28,
        salario: 2400,
      },
      {
        nome: 'Hudyson',
        idade: 20,
        salario: 1500,
      },
      {
        nome: 'Maria',
        idade: 24,
        salario: 2000,
      },
    ];

    // eliminar o objeto da terceira posição.
    funcionarios.splice(2, 1);

    console.log(funcionarios);

    // imprimir o nome da pessoa mais velha e mais nova
    const maisVelho = funcionarios.reduce((funcionario, current) =>
      funcionario.idade > current.idade ? funcionario : current,
    ).nome;

    console.log('Funcionario mais velho', maisVelho);

    // imprimir o nome da pessoa mais velha e mais nova
    const maisNovo = funcionarios.reduce((funcionario, current) =>
      funcionario.idade < current.idade ? funcionario : current,
    ).nome;
    console.log('Funcionario mais novo', maisNovo);

    // imprimir a somatória dos salários
    const somaSalario = funcionarios
      .map(item => item.salario)
      .reduce((salario, current) => salario + current, 0);

    console.log('Soma dos Salarios foi', somaSalario);
  }
}
