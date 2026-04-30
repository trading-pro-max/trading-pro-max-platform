import type { AlKawnDesktopVaultState } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnVaultPanel({ vault }: { vault: AlKawnDesktopVaultState }) {
  return (
    <section className={styles.panel} aria-label="vault panel">
      <div className={styles.sectionTitle}>
        <span>Ahmad Digital Vault</span>
        <h2>Vault panel</h2>
      </div>
      <strong>Status: {vault.status}</strong>
      <ul>
        {vault.rules.map((rule, index) => (
          <li key={`vault-rule-${index}-${rule}`}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
