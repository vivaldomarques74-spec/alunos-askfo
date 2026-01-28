import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { gerarPdfAluno } from "../utils/gerarPdfAluno";
import { SENSEIS } from "../datas/senseis";

const FAIXAS = [
  "Branca",
  "Amarela",
  "Laranja",
  "Verde",
  "Roxa",
  "Marrom",
  "Preta",
];

export default function EditarAluno() {
  const { id } = useParams();
  const [aluno, setAluno] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [dataExame, setDataExame] = useState("");
  const [faixaNova, setFaixaNova] = useState("");

  /* ============================
     🔒 CARREGAR ALUNO
     ============================ */
  useEffect(() => {
    async function carregarAluno() {
      const ref = doc(db, "alunos", id!);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados: any = snap.data();

        let nascimento = "";
        const valor =
          dados.nascimento ??
          dados.dataNascimento ??
          dados.data_nascimento ??
          dados.dtNascimento ??
          null;

        if (valor instanceof Timestamp) {
          nascimento = valor.toDate().toISOString().split("T")[0];
        } else if (typeof valor === "string") {
          nascimento = valor;
        }

        setAluno({
          id: snap.id,
          ...dados,
          nascimento,
          cadastroFbkk: dados.cadastroFbkk || "",
        });
      }

      setLoading(false);
    }

    carregarAluno();
  }, [id]);

  if (loading) return <p>Carregando aluno...</p>;
  if (!aluno) return <p>Aluno não encontrado</p>;

  /* ============================
     💾 SALVAR ALTERAÇÕES
     ============================ */
  async function salvarAlteracoes() {
    await updateDoc(doc(db, "alunos", aluno.id), {
      ...aluno,
      nascimento: aluno.nascimento || null,
    });

    alert("Alterações salvas com sucesso");
  }

  /* ============================
     🥋 EXAME DE FAIXA
     ============================ */
  async function finalizarExameFaixa() {
    if (!dataExame || !faixaNova) {
      alert("Informe a data e a faixa nova");
      return;
    }

    const historico = aluno.historicoFaixas || [];

    if (historico.find((h: any) => h.data === dataExame)) {
      alert("Já existe um exame de faixa nessa data");
      return;
    }

    const novoRegistro = {
      data: dataExame,
      de: aluno.faixa || "-",
      para: faixaNova,
    };

    await updateDoc(doc(db, "alunos", aluno.id), {
      faixa: faixaNova,
      historicoFaixas: [...historico, novoRegistro],
    });

    setAluno({
      ...aluno,
      faixa: faixaNova,
      historicoFaixas: [...historico, novoRegistro],
    });

    setDataExame("");
    setFaixaNova("");
    alert("Exame de faixa registrado com sucesso");
  }

  return (
    <div className="editar-aluno-container">
      <h1>Editar Aluno</h1>

      {/* ============================
         DADOS DO ALUNO
         ============================ */}
      <h3>Dados do Aluno</h3>

      <label>Nome</label>
      <input
        value={aluno.nome || ""}
        onChange={(e) =>
          setAluno({ ...aluno, nome: e.target.value })
        }
      />

      <label>Data de Nascimento</label>
      <input
        type="date"
        value={aluno.nascimento || ""}
        onChange={(e) =>
          setAluno({ ...aluno, nascimento: e.target.value })
        }
      />

      <label>Telefone</label>
      <input
        value={aluno.telefone || ""}
        onChange={(e) =>
          setAluno({ ...aluno, telefone: e.target.value })
        }
      />

      <label>Email</label>
      <input
        value={aluno.email || ""}
        onChange={(e) =>
          setAluno({ ...aluno, email: e.target.value })
        }
      />

      <label>Endereço</label>
      <input
        value={aluno.endereco || ""}
        onChange={(e) =>
          setAluno({ ...aluno, endereco: e.target.value })
        }
      />

      <label>Unidade / Base</label>
      <input
        value={aluno.unidade || ""}
        onChange={(e) =>
          setAluno({ ...aluno, unidade: e.target.value })
        }
      />

      <label>Cadastro FBKK</label>
      <input
        value={aluno.cadastroFbkk || ""}
        onChange={(e) =>
          setAluno({ ...aluno, cadastroFbkk: e.target.value })
        }
        placeholder="Número de matrícula da federação"
      />

      <label>Sensei</label>
      <select
        value={aluno.sensei || ""}
        onChange={(e) =>
          setAluno({ ...aluno, sensei: e.target.value })
        }
      >
        <option value="">Selecione o Sensei</option>
        {SENSEIS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          checked={aluno.ativo}
          onChange={() =>
            setAluno({ ...aluno, ativo: !aluno.ativo })
          }
        />
        Aluno Ativo
      </label>

      {/* ============================
         RESPONSÁVEL
         ============================ */}
      <h3>Dados do Responsável</h3>

      <label>Nome do Responsável</label>
      <input
        value={aluno.responsavelNome || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            responsavelNome: e.target.value,
          })
        }
      />

      <label>Telefone do Responsável</label>
      <input
        value={aluno.responsavelTelefone || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            responsavelTelefone: e.target.value,
          })
        }
      />

      {/* ============================
         SAÚDE
         ============================ */}
      <h3>Informações de Saúde</h3>

      <label>Possui problema de saúde?</label>
      <select
        value={aluno.saude?.possui || "Não"}
        onChange={(e) =>
          setAluno({
            ...aluno,
            saude: {
              ...aluno.saude,
              possui: e.target.value,
            },
          })
        }
      >
        <option>Não</option>
        <option>Sim</option>
      </select>

      <label>Qual problema?</label>
      <input
        value={aluno.saude?.qual || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            saude: {
              ...aluno.saude,
              qual: e.target.value,
            },
          })
        }
      />

      <label>Doença neuropsicológica?</label>
      <input
        value={aluno.saude?.neuro || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            saude: {
              ...aluno.saude,
              neuro: e.target.value,
            },
          })
        }
      />

      <label>Medicação contínua?</label>
      <input
        value={aluno.saude?.medicacao || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            saude: {
              ...aluno.saude,
              medicacao: e.target.value,
            },
          })
        }
      />

      <label>Observações médicas</label>
      <textarea
        value={aluno.saude?.obs || ""}
        onChange={(e) =>
          setAluno({
            ...aluno,
            saude: {
              ...aluno.saude,
              obs: e.target.value,
            },
          })
        }
      />

      {/* ============================
         EXAME DE FAIXA
         ============================ */}
      <h3>Exame de Faixa</h3>

      <label>Data do Exame</label>
      <input
        type="date"
        value={dataExame}
        onChange={(e) => setDataExame(e.target.value)}
      />

      <label>Faixa Nova</label>
      <select
        value={faixaNova}
        onChange={(e) => setFaixaNova(e.target.value)}
      >
        <option value="">Selecione a faixa nova</option>
        {FAIXAS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <button onClick={finalizarExameFaixa}>
        Finalizar Exame de Faixa
      </button>

      <h3>Histórico de Faixas</h3>
      <ul>
        {aluno.historicoFaixas?.map((h: any, i: number) => (
          <li key={i}>
            {h.de} → {h.para} — {h.data}
          </li>
        ))}
      </ul>

      <h3>Histórico de Eventos</h3>
      <ul>
        {aluno.eventos?.map((e: any, i: number) => (
          <li key={i}>
            <strong>{e.nome}</strong> — {e.data}
            <br />
            {e.premiacao
              ? `Kata: ${e.kata || "-"}º | Kumite: ${
                  e.kumite || "-"
                }º`
              : "Participação sem premiação"}
          </li>
        ))}
      </ul>

      {/* ============================
         AÇÕES
         ============================ */}
      <div style={{ marginTop: 20 }}>
        <button onClick={salvarAlteracoes}>
          Salvar Alterações
        </button>
        <button onClick={() => gerarPdfAluno(aluno)}>
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
