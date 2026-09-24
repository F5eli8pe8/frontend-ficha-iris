import styles from "./SpinnerIcon.module.scss";

// TODO: cor #D8DDF0 não confirmada especificamente pro spinner — usando a
// mesma do ArrowIcon por consistência visual, já que ambos aparecem no
// mesmo lugar do botão.
export function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={styles.spinner}
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="#D8DDF0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}