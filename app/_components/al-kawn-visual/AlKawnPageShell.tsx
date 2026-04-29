import type { ReactNode } from "react";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnPageShellProps = {
  children: ReactNode;
  surface: "founder" | "desktop" | "trading" | "center";
};

export function AlKawnPageShell({ children, surface }: AlKawnPageShellProps) {
  return (
    <div
      className={styles.shell}
      data-testid="al-kawn-unified-visual-identity"
      data-al-kawn-visual-system="canonical"
      data-al-kawn-surface={surface}
    >
      {children}
    </div>
  );
}
