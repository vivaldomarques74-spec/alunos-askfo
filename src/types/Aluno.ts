export type Aluno = {
  id: number;
  nome: string;
  sensei: string;
  faixa: string;
  ativo: boolean;
};

export const alunosMock: Aluno[] = [
  {
    id: 1,
    nome: "João Silva",
    sensei: "Sensei Carlos",
    faixa: "Branca",
    ativo: true,
  },
  {
    id: 2,
    nome: "Maria Santos",
    sensei: "Sensei Carlos",
    faixa: "Amarela",
    ativo: true,
  },
  {
    id: 3,
    nome: "Pedro Lima",
    sensei: "Sensei Ana",
    faixa: "Branca",
    ativo: false,
  },
];
