import { useState } from "react";

export default function Senseis() {
  const [nome, setNome] = useState("");

  function salvarSensei() {
    if (!nome.trim()) {
      alert("Informe o nome do sensei");
      return;
    }

    alert(`Sensei "${nome}" cadastrado com sucesso`);
    setNome("");
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Cadastrar Sensei</h1>

      <div
        style={{
          background: "#ffffff",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <input
          placeholder="Nome do sensei *"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <button
          onClick={salvarSensei}
          style={{
            padding: 14,
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Salvar Sensei
        </button>
      </div>
    </div>
  );
}
