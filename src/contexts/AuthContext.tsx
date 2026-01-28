import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

type UsuarioPerfil = {
  nome: string;
  role: "admin" | "professor";
  unidade: string;
  ativo: boolean;
};

type AuthContextType = {
  user: User | null;
  perfil: UsuarioPerfil | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setPerfil(null);
          return;
        }

        const ref = doc(db, "usuarios", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.warn("Usuário sem perfil no Firestore");
          await signOut(auth);
          setUser(null);
          setPerfil(null);
          return;
        }

        const data = snap.data() as UsuarioPerfil;

        if (!data.ativo) {
          console.warn("Usuário inativo");
          await signOut(auth);
          setUser(null);
          setPerfil(null);
          return;
        }

        setUser(firebaseUser);
        setPerfil(data);
      } catch (error) {
        console.error("Erro ao validar autenticação:", error);
        await signOut(auth);
        setUser(null);
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function logout() {
    await signOut(auth);
    setUser(null);
    setPerfil(null);
  }

  return (
    <AuthContext.Provider value={{ user, perfil, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
