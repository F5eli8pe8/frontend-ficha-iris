"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import styles from "./login.module.scss";
import { Tab } from "@/components/Tab/Tab";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";

type ErrorType = "credentials" | "server" | null;



export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError("credentials");
      } else {
        setError("server");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.backdropImage} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>I.R.I.S</h1>

          {error ? (
            <p className={styles.errorMessage} role="alert">
              {error === "credentials"
                ? "Email ou senha incorretos. Tente novamente."
                : "Algo deu errado no seu login. Contate o suporte."}
            </p>
          ) : (
            <p className={styles.subtitle}>Boas Vindas Agente</p>
          )}
        </div>

        <div className={styles.tabs}>
          <Tab active>Login</Tab>
          <Tab href="/register">Registro</Tab>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              hasError={!!error}
            />
            <Input
              type="password"
              required
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              hasError={!!error}
            />
              <Button
              type="submit"
              disabled={loading}
              aria-label="Entrar"
              className={`${styles.submitButton} ${loading ? `${styles.submitButtonLoading} loading` : ""}`}
            >
              {loading ? <SpinnerIcon /> : <ArrowIcon />}
            </Button>
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