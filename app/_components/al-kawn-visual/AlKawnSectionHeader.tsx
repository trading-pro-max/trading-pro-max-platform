import type { ReactNode } from "react";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnSectionHeaderProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export function AlKawnSectionHeader({ eyebrow, title, children }: AlKawnSectionHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
