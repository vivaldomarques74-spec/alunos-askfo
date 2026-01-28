import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import "./Alunos.css";

type Aluno = {
  id: string;
  nome: string;
  unidade?: string;
  sensei?: string;
  faixa?: string;
  ativo: boolean;

  // 🔒 nascimento é o campo oficial
  nascimento?: any;

  // compatibilidade com dados antigos
  dataNascimento?: any;
  data_nascimento?: any;
  dtNascimento?: any;
};

export default function Alunos() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  // 🔒 regra definitiva: nascimento é prioridade
  function obterDataNascimento(aluno: Aluno): any {
    return (
      aluno.nascimento ??
      aluno.dataNascimento ??
      aluno.data_nascimento ??
      aluno.dtNascimento ??
      null
    );
  }

  // 🔒 normalização segura de datas
  function normalizarData(valor: any): Date | null {
    if (!valor) return null;

    if (valor instanceof Timestamp) {
      return valor.toDate();
    }

    if (valor?.seconds) {
      return new Date(valor.seconds * 1000);
    }

    if (valor instanceof Date) {
      return valor;
    }

    if (typeof valor === "string") {
      // YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        const [ano, mes, dia] = valor.split("-").map(Number);
        return new Date(ano, mes - 1, dia);
      }

      // DD/MM/YYYY ou DD-MM-YYYY
      if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(valor)) {
        const [dia, mes, ano] = valor.split(/[\/\-]/).map(Number);
        return new Date(ano, mes - 1, dia);
      }
    }

    return null;
  }

  // 🎯 cálculo final da idade
  function calcularIdade(valor: any): number | null {
    const nascimento = normalizarData(valor);
    if (!nascimento) return null;

    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 0 || idade > 120) return null;

    return idade;
  }

  async function carregarAlunos() {
    try {
      const snapshot = await getDocs(collection(db, "alunos"));
      const lista: Aluno[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Aluno, "id">),
      }));
      setAlunos(lista);
    } catch (error) {
      alert("Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  if (loading) {
    return <p>Carregando alunos...</p>;
  }

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="alunos-container">
      <h1>Lista de Alunos</h1>

      <div className="alunos-box">
        {/* 🔍 PESQUISA */}
        <div className="form-grid">
          <input
            type="text"
            placeholder="Pesquisar aluno pelo nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="lista-alunos" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Unidade</th>
                <th>Sensei</th>
                <th>Faixa</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((aluno) => {
                const idade = calcularIdade(
                  obterDataNascimento(aluno)
                );

                return (
                  <tr key={aluno.id}>
                    <td>
                      {aluno.nome}{" "}
                      <span style={{ color: "#666" }}>
                        ({idade !== null ? `${idade} anos` : "-- anos"})
                      </span>
                    </td>
                    <td>{aluno.unidade || "-"}</td>
                    <td>{aluno.sensei || "-"}</td>
                    <td>{aluno.faixa || "-"}</td>
                    <td>
                      <span
                        className={
                          aluno.ativo ? "badge-ativo" : "badge-inativo"
                        }
                      >
                        {aluno.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="acoes">
                      <button
                        onClick={() =>
                          navigate(`/alunos/editar/${aluno.id}`)
                        }
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {alunosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 16 }}>
                    Nenhum aluno encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
