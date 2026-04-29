import type { ReactNode } from "react";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnPanelProps = {
  children: ReactNode;
  label?: string;
};

export function AlKawnPanel({ children, label }: AlKawnPanelProps) {
  return (
    <section className={styles.panel} aria-label={label}>
      {children}
    </section>
  );
}
