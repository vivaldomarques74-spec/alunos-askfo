import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import type { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
