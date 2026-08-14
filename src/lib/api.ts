const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface TokenResponse {
  token: string;
  funcao: string;
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
  senha: string
): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError(404, "Email ou senha incorretos.");
    }
    throw new ApiError(response.status, "Algo deu errado no seu login.");
  }

  return response.json();
}