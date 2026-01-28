import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <nav style={{ padding: 16, background: "#111", color: "#fff" }}>
      <Link to="/dashboard" style={{ marginRight: 16, color: "#fff" }}>
        Dashboard
      </Link>

      <Link to="/cadastro" style={{ marginRight: 16, color: "#fff" }}>
        Cadastrar Aluno
      </Link>

      <Link to="/alunos" style={{ color: "#fff" }}>
        Lista de Alunos
      </Link>
    </nav>
  );
}
