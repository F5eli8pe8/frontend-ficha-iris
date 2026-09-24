import Link from "next/link";
import type { TabProps } from "./Tab.interface";
import styles from "./Tab.module.scss";

export function Tab({ children, active, className, href, ...props }: TabProps) {
  const classes = `${styles.tab} ${active ? styles.tabActive : ""} ${className ?? ""}`;

  // Aba ativa não é link (já estamos na página dela) — vira um span
  // pra evitar navegação desnecessária pra rota atual.
  if (active || !href) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
