import type { ReactNode } from "react";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnActionCardProps = {
  title: string;
  children: ReactNode;
};

export function AlKawnActionCard({ title, children }: AlKawnActionCardProps) {
  return (
    <article className={styles.actionCard}>
      <strong>{title}</strong>
      {children}
    </article>
  );
}
