import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function Eventos() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [temPremiacao, setTemPremiacao] = useState(false);
  const [participantes, setParticipantes] = useState<any[]>([]);

  // 🔍 NOVO: busca de aluno
  const [buscaAluno, setBuscaAluno] = useState("");

  useEffect(() => {
    async function carregarAlunos() {
      const snap = await getDocs(collection(db, "alunos"));
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setAlunos(lista);
    }
    carregarAlunos();
  }, []);

  function toggleAluno(aluno: any) {
    if (participantes.find((p) => p.alunoId === aluno.id)) {
      setParticipantes(
        participantes.filter((p) => p.alunoId !== aluno.id)
      );
    } else {
      setParticipantes([
        ...participantes,
        {
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          kata: null,
          kumite: null,
        },
      ]);
    }
  }

  function atualizarResultado(
    alunoId: string,
    tipo: "kata" | "kumite",
    valor: number
  ) {
    setParticipantes((prev) =>
      prev.map((p) =>
        p.alunoId === alunoId ? { ...p, [tipo]: valor } : p
      )
    );
  }

  async function salvarEvento() {
    if (!nome || !data) {
      alert("Informe nome e data do evento");
      return;
    }

    const eventoRef = await addDoc(collection(db, "eventos"), {
      nome,
      data,
      descricao,
      premiacao: temPremiacao,
      participantes,
      criadoEm: new Date(),
    });

    for (const p of participantes) {
      const alunoRef = doc(db, "alunos", p.alunoId);

      await updateDoc(alunoRef, {
        eventos: arrayUnion({
          eventoId: eventoRef.id,
          nome,
          data,
          descricao,
          premiacao: temPremiacao,
          kata: temPremiacao ? p.kata : null,
          kumite: temPremiacao ? p.kumite : null,
        }),
      });
    }

    alert("Evento cadastrado com sucesso");

    setNome("");
    setData("");
    setDescricao("");
    setTemPremiacao(false);
    setParticipantes([]);
    setBuscaAluno("");
  }

  // 🔍 NOVO: alunos filtrados pela busca
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome
      ?.toLowerCase()
      .includes(buscaAluno.toLowerCase())
  );

  return (
    <div>
      <h1>Cadastrar Evento</h1>

      <input
        placeholder="Nome do evento"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <textarea
        placeholder="Descrição do evento (opcional)"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={temPremiacao}
          onChange={(e) => setTemPremiacao(e.target.checked)}
        />
        Evento com premiação
      </label>

      <h3>Participantes</h3>

      {/* 🔍 NOVO: campo de pesquisa */}
      <input
        placeholder="Pesquisar aluno pelo nome"
        value={buscaAluno}
        onChange={(e) => setBuscaAluno(e.target.value)}
        style={{ marginBottom: 12 }}
      />

      {alunosFiltrados.map((aluno) => {
        const selecionado = participantes.find(
          (p) => p.alunoId === aluno.id
        );

        return (
          <div
            key={aluno.id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: 8,
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={!!selecionado}
                onChange={() => toggleAluno(aluno)}
              />
              {aluno.nome}
            </label>

            {selecionado && temPremiacao && (
              <div style={{ marginLeft: 20, marginTop: 6 }}>
                <label>
                  Kata:
                  <select
                    onChange={(e) =>
                      atualizarResultado(
                        aluno.id,
                        "kata",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Não participou</option>
                    <option value={0}>0</option>
                    <option value={1}>1º</option>
                    <option value={2}>2º</option>
                    <option value={3}>3º</option>
                    <option value={4}>4º</option>
                  </select>
                </label>

                <label style={{ marginLeft: 10 }}>
                  Kumite:
                  <select
                    onChange={(e) =>
                      atualizarResultado(
                        aluno.id,
                        "kumite",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Não participou</option>
                    <option value={0}>0</option>
                    <option value={1}>1º</option>
                    <option value={2}>2º</option>
                    <option value={3}>3º</option>
                    <option value={4}>4º</option>
                  </select>
                </label>
              </div>
            )}
          </div>
        );
      })}

      {alunosFiltrados.length === 0 && (
        <p>Nenhum aluno encontrado</p>
      )}

      <button onClick={salvarEvento}>
        Salvar Evento
      </button>
    </div>
  );
}
