export interface Aluno {
  id: number;
  nome: string;
  rg: string;
  unidade: string;
  sensei: string;
  faixa: string;
  ativo: boolean;
}

export const alunos: Aluno[] = [
  {
    id: 1,
    nome: "João Silva",
    rg: "123456",
    unidade: "Matriz",
    sensei: "Sensei Carlos",
    faixa: "Amarela",
    ativo: true,
  },
];
