import type { ReactNode } from "react";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnTopBarProps = {
  title: string;
  children?: ReactNode;
};

export function AlKawnTopBar({ title, children }: AlKawnTopBarProps) {
  return (
    <header className={styles.topBar}>
      <strong>{title}</strong>
      {children}
    </header>
  );
}
