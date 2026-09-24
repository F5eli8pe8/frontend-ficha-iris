import type { InputProps } from "./Input.interface";
import styles from "./Input.module.scss";

export function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      className={`${styles.input} ${hasError ? styles.inputError : ""} ${className ?? ""}`}
      {...props}
    />
  );
}