export interface CursoInterface {
  id: number;
  curso: string;
  professor: string;
}

export interface InterfaceCursos {
  id: number;
  nome: string;
  professor: string;
}

export interface CursosInterface {
  nome: string;
  professor: string;
}

export interface InterfaceCurso {
  cursos: CursosInterface[];
}
