import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [ativos, setAtivos] = useState(0);
  const [inativos, setInativos] = useState(0);
  const [porSensei, setPorSensei] = useState<any[]>([]);
  const [porFaixa, setPorFaixa] = useState<any[]>([]);

  useEffect(() => {
    async function carregarDados() {
      const snap = await getDocs(collection(db, "alunos"));
      const alunos: any[] = snap.docs.map((d) => d.data());

      const ativosArr = alunos.filter((a) => a.ativo !== false);
      const inativosArr = alunos.filter((a) => a.ativo === false);

      setAtivos(ativosArr.length);
      setInativos(inativosArr.length);

      // 📌 Alunos por Sensei (somente ativos)
      const mapaSensei: any = {};
      ativosArr.forEach((a) => {
        const sensei = a.sensei || "Não informado";
        mapaSensei[sensei] = (mapaSensei[sensei] || 0) + 1;
      });

      setPorSensei(
        Object.keys(mapaSensei).map((s) => ({
          sensei: s,
          total: mapaSensei[s],
        }))
      );

      // 📌 Alunos por Faixa (somente ativos)
      const mapaFaixa: any = {};
      ativosArr.forEach((a) => {
        const faixa = a.faixa || "Não informada";
        mapaFaixa[faixa] = (mapaFaixa[faixa] || 0) + 1;
      });

      setPorFaixa(
        Object.keys(mapaFaixa).map((f) => ({
          faixa: f,
          total: mapaFaixa[f],
        }))
      );
    }

    carregarDados();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* RESUMO */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <div style={cardStyle}>
          <h3>Alunos Ativos</h3>
          <strong style={numberStyle}>{ativos}</strong>
        </div>

        <div style={cardStyle}>
          <h3>Alunos Inativos</h3>
          <strong style={numberStyle}>{inativos}</strong>
        </div>
      </div>

      {/* POR SENSEI */}
      <h2>Alunos por Professor</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={porSensei}>
            <XAxis dataKey="sensei" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#111" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul>
        {porSensei.map((s) => (
          <li key={s.sensei}>
            {s.sensei}: <strong>{s.total}</strong>
          </li>
        ))}
      </ul>

      {/* POR FAIXA */}
      <h2 style={{ marginTop: 40 }}>Alunos por Faixa</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={porFaixa}>
            <XAxis dataKey="faixa" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul>
        {porFaixa.map((f) => (
          <li key={f.faixa}>
            {f.faixa}: <strong>{f.total}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  minWidth: 220,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const numberStyle = {
  fontSize: 32,
};
