"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Tab } from "@/components/tab/Tab";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { SpinnerIcon } from "@/components/icons/SpinnerIcon";
import styles from "./register.module.scss";

type ErrorType = "duplicate" | "server" | null;

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("duplicate");
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
              {error === "duplicate"
                ? "Esse email já está cadastrado."
                : "Algo deu errado no seu cadastro. Contate o suporte."}
            </p>
          ) : (
            // TODO: texto do subtítulo não confirmado no Figma pra essa tela — usei o mesmo tom do login por enquanto.
            <p className={styles.subtitle}>Identifique-se</p>
          )}
        </div>

        <div className={styles.tabs}>
          <Tab href="/login">Login</Tab>
          <Tab active>Registro</Tab>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Input
              type="text"
              required
              placeholder="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
              hasError={!!error}
            />
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
              minLength={8}
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              hasError={!!error}
            />
            <Button
              type="submit"
              disabled={loading}
              aria-label="Cadastrar"
              className={`${styles.submitButton} ${loading ? `${styles.submitButtonLoading} loading` : ""}`}
            >
              {loading ? <SpinnerIcon /> : <ArrowIcon />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}