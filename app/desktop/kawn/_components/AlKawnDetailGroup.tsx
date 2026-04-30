import type { ReactNode } from "react";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDetailGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details className={styles.detailGroup} open>
      <summary>
        <span>{title}</span>
        <strong>{description}</strong>
      </summary>
      <div className={styles.detailGroupBody}>{children}</div>
    </details>
  );
}
