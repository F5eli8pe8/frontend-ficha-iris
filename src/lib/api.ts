const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Formato bruto que o backend retorna (chave "funcao", em português —
// contrato do backend Spring Boot, não renomear aqui). Login e registro
// retornam exatamente o mesmo formato (registro faz login automático).
interface LoginApiResponse {
  token: string;
  funcao: string;
}

export interface TokenResponse {
  token: string;
  role: string;
}

/**
 * Chama POST /api/auth/login.
 *
 * Atenção: o backend responde 404 tanto pra email inexistente quanto
 * pra senha errada (por segurança, não diferencia os dois casos) -
 * então tratamos 404 aqui como "credenciais inválidas", não como
 * "rota não encontrada".
 */
export async function loginRequest(
  email: string,
  password: string
): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, "Email ou senha incorretos.");
    }
    throw new ApiError(response.status, "Algo deu errado no seu login.");
  }

  const data: LoginApiResponse = await response.json();
  return { token: data.token, role: data.funcao };
}

/**
 * Chama POST /api/auth/register.
 *
 * O backend responde 409 quando o email já está cadastrado. A senha
 * mínima (8 caracteres) também é validada no backend, mas o input já
 * tem minLength no HTML pra dar feedback mais cedo.
 */
export async function registerRequest(
  nomeUsuario: string,
  email: string,
  password: string
): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeUsuario, email, senha: password }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new ApiError(409, "Esse email já está cadastrado.");
    }
    throw new ApiError(response.status, "Algo deu errado no seu cadastro.");
  }

  const data: LoginApiResponse = await response.json();
  return { token: data.token, role: data.funcao };
}