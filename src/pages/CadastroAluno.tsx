import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { SENSEIS } from "../datas/senseis";

const FAIXAS = [
  "Branca",
  "Amarela",
  "Vermelha",
  "Laranja",
  "Verde",
  "Roxa",
  "Marrom",
  "Preta",
];

export default function CadastroAluno() {
  const [form, setForm] = useState({
    nome: "",
    nascimento: "",
    cpf: "",
    rg: "",
    email: "",
    telefone: "",
    endereco: "",
    unidade: "",
    sensei: "",
    faixa: "Branca",
    cadastroFbkk: "0000",
    menor: false,
    responsavelNome: "",
    responsavelTelefone: "",
    responsavelEmail: "",
    possuiProblemaSaude: false,
    problemaSaude: "",
    neuro: "",
    medicacao: false,
    observacoesMedicas: "",
  });

  async function salvar() {
    if (!form.nome || !form.sensei) {
      alert("Preencha nome e sensei");
      return;
    }

    await addDoc(collection(db, "alunos"), {
      ...form,
      ativo: true,
      eventos: [],
      historicoFaixa: [
        {
          faixa: form.faixa,
          data: new Date().toISOString().split("T")[0],
        },
      ],
      criadoEm: new Date(),
    });

    alert("Aluno cadastrado com sucesso");
  }

  return (
    <div>
      <h1>Cadastrar Aluno</h1>

      <input placeholder="Nome" onChange={e => setForm({ ...form, nome: e.target.value })} />
      <input type="date" onChange={e => setForm({ ...form, nascimento: e.target.value })} />
      <input placeholder="CPF" onChange={e => setForm({ ...form, cpf: e.target.value })} />
      <input placeholder="RG" onChange={e => setForm({ ...form, rg: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Telefone" onChange={e => setForm({ ...form, telefone: e.target.value })} />
      <input placeholder="Endereço" onChange={e => setForm({ ...form, endereco: e.target.value })} />
      <input placeholder="Unidade" onChange={e => setForm({ ...form, unidade: e.target.value })} />

      <select onChange={e => setForm({ ...form, sensei: e.target.value })}>
        <option value="">Selecione o Sensei</option>
        {SENSEIS.map((s: string) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select onChange={e => setForm({ ...form, faixa: e.target.value })}>
        {FAIXAS.map(f => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <input
        placeholder="Cadastro FBKK"
        value={form.cadastroFbkk}
        onChange={e => setForm({ ...form, cadastroFbkk: e.target.value })}
      />

      <label>
        <input type="checkbox" onChange={e => setForm({ ...form, menor: e.target.checked })} />
        Menor de idade
      </label>

      {form.menor && (
        <>
          <input placeholder="Responsável" onChange={e => setForm({ ...form, responsavelNome: e.target.value })} />
          <input placeholder="Telefone do responsável" onChange={e => setForm({ ...form, responsavelTelefone: e.target.value })} />
          <input placeholder="Email do responsável" onChange={e => setForm({ ...form, responsavelEmail: e.target.value })} />
        </>
      )}

      <label>
        <input type="checkbox" onChange={e => setForm({ ...form, possuiProblemaSaude: e.target.checked })} />
        Possui problema de saúde
      </label>

      {form.possuiProblemaSaude && (
        <>
          <input placeholder="Qual problema?" onChange={e => setForm({ ...form, problemaSaude: e.target.value })} />
          <input placeholder="Doença neuropsicológica" onChange={e => setForm({ ...form, neuro: e.target.value })} />
          <label>
            <input type="checkbox" onChange={e => setForm({ ...form, medicacao: e.target.checked })} />
            Usa medicação contínua
          </label>
          <textarea placeholder="Observações médicas" onChange={e => setForm({ ...form, observacoesMedicas: e.target.value })} />
        </>
      )}

      <button onClick={salvar}>Salvar</button>
    </div>
  );
}
