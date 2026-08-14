"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginRequest } from "@/lib/api";

const TOKEN_STORAGE_KEY = "iris:token";

interface UsuarioToken {
  id: string;
  email: string;
  funcao: string;
}

interface AuthContextValue {
  usuario: UsuarioToken | null;
  token: string | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Decodifica o payload de um JWT SEM validar assinatura.
 * Isso é seguro pra uso de UI (ex: mostrar o nome/funcao do usuário),
 * porque quem valida a assinatura de verdade é sempre o backend em
 * cada requisição. Nunca confie nesses dados pra decisões de segurança.
 */
function decodeToken(token: string): UsuarioToken | null {
  try {
    const payload = token.split(".")[1];
    const normalizado = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalizado));
    return {
      id: decoded.sub ?? decoded.id ?? "",
      email: decoded.email ?? "",
      funcao: decoded.funcao ?? "",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioToken | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao carregar a aplicação, recupera o token salvo (se existir).
  // localStorage só existe no cliente, então isso precisa rodar num
  // efeito (não dá pra ler durante o render do servidor).
  useEffect(() => {
    const armazenado = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (armazenado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap único a partir do localStorage no mount, não é sincronização contínua
      setToken(armazenado);
      setUsuario(decodeToken(armazenado));
    }
    setCarregando(false);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const { token: novoToken } = await loginRequest(email, senha);
    localStorage.setItem(TOKEN_STORAGE_KEY, novoToken);
    setToken(novoToken);
    setUsuario(decodeToken(novoToken));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
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
