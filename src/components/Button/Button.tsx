import type { ButtonProps } from "./Button.interface";
import styles from "./Button.module.scss";

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}