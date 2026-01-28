import { NavLink } from "react-router-dom";

const menuItemStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#ffffff",
  fontWeight: 500,
};

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#0f0f0f",
        color: "#ffffff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      {/* LOGO */}
      <div style={{ textAlign: "center" }}>
        <img
          src="/askfo-logo.jpg"
          alt="ASKFO"
          style={{
            width: "80%",
            maxWidth: 160,
            marginBottom: 10,
          }}
        />
      </div>

      {/* MENU */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            ...menuItemStyle,
            background: isActive ? "#1f1f1f" : "transparent",
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/alunos/cadastrar"
          style={({ isActive }) => ({
            ...menuItemStyle,
            background: isActive ? "#1f1f1f" : "transparent",
          })}
        >
          Cadastrar Aluno
        </NavLink>

        <NavLink
          to="/alunos"
          style={({ isActive }) => ({
            ...menuItemStyle,
            background: isActive ? "#1f1f1f" : "transparent",
          })}
        >
          Lista de Alunos
        </NavLink>

        <NavLink
          to="/eventos"
          style={({ isActive }) => ({
            ...menuItemStyle,
            background: isActive ? "#1f1f1f" : "transparent",
          })}
        >
          Eventos
        </NavLink>

        <NavLink
          to="/senseis"
          style={({ isActive }) => ({
            ...menuItemStyle,
            background: isActive ? "#1f1f1f" : "transparent",
          })}
        >
          Cadastrar Senseis
        </NavLink>
      </nav>
    </aside>
  );
}
