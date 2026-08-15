"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import styles from "./login.module.scss";

type ErroTipo = "credenciais" | "servidor" | null;

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<ErroTipo>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await login(email, senha);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setErro("credenciais");
      } else {
        setErro("servidor");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.backdropImage} aria-hidden="true" />
      <div className={styles.backdropFade} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>I.R.I.S</h1>

          {erro ? (
            <p className={styles.errorMessage} role="alert">
              {erro === "credenciais"
                ? "Email ou senha incorretos. Tente novamente."
                : "Algo deu errado no seu login. Contate o suporte."}
            </p>
          ) : (
            <p className={styles.subtitle}>Boas vindas, agente</p>
          )}
        </div>

        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.tabActive}`}>Login</span>
          <Link href="/register" className={styles.tab}>
            Registro
          </Link>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={carregando}
              className={`${styles.input} ${erro ? styles.inputError : ""}`}
            />
            <input
              type="password"
              required
              placeholder="Senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              disabled={carregando}
              className={`${styles.input} ${erro ? styles.inputError : ""}`}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={carregando}
              aria-label="Entrar"
            >
              {carregando ? (
                <span className={styles.spinner} />
              ) : (
                <span className={styles.arrow}>→</span>
              )}
            </button>
          </div>
        </form>

            {/* Aponta pro primeiro passo do fluxo de recuperação de senha
            (new-password). Mas eu tenho que confirmar com tu Rafa se isso é correto ou se é o 'email-send'. */}
        <Link href="/new-password" className={styles.forgotPassword}>
          Esqueceu sua senha?
        </Link>
      </div>
    </div>
  );
}