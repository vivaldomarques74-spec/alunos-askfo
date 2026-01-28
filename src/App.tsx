import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CadastroAluno from "./pages/CadastroAluno";
import Alunos from "./pages/Alunos";
import EditarAluno from "./pages/EditarAluno";
import Eventos from "./pages/Eventos";
import Senseis from "./pages/Senseis";
import Login from "./pages/Login";

/**
 * Rota protegida:
 * - só entra se estiver autenticado
 * - e tiver perfil válido no Firestore
 */
function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { user, perfil, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user || !perfil) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* LOGIN (rota pública) */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS */}
          <Route
            path="/"
            element={
              <RotaProtegida>
                <Layout />
              </RotaProtegida>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="alunos">
              <Route index element={<Alunos />} />
              <Route path="cadastrar" element={<CadastroAluno />} />
              <Route path="editar/:id" element={<EditarAluno />} />
            </Route>

            <Route path="eventos" element={<Eventos />} />
            <Route path="senseis" element={<Senseis />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
