"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginRequest, registerRequest } from "@/lib/api";
import type { User, AuthContextValue } from "./AuthContext.interface";

const TOKEN_STORAGE_KEY = "iris:token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Decodifica o payload de um JWT SEM validar assinatura.
 * Isso é seguro pra uso de UI (ex: mostrar o nome/role do usuário),
 * porque quem valida a assinatura de verdade é sempre o backend em
 * cada requisição. Nunca confie nesses dados pra decisões de segurança.
 */
function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return {
      id: decoded.sub ?? decoded.id ?? "",
      email: decoded.email ?? "",
      role: decoded.funcao ?? "",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap único a partir do localStorage no mount, não é sincronização contínua
      setToken(stored);
      setUser(decodeToken(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await loginRequest(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  }, []);

  // Registro faz login automático (o backend já retorna token no cadastro).
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { token: newToken } = await registerRequest(name, email, password);
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setToken(newToken);
      setUser(decodeToken(newToken));
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>");
  }
  return context;
}