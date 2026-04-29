import { ProMaxLivingEarthStatic } from "@/app/_components/ProMaxLivingEarthStatic";
import type { ProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import Link from "next/link";
import styles from "../trading-premium-realism.module.css";

export default function TradingCommandBar({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  return (
    <header className={`${styles.commandBar} tpm-terminal-topbar`} data-workspace-header="single-terminal-header">
      <Link href="/" className="tpm-foundation-nav-brand tpm-brand-lockup tpm-shell-logo-home-link">
        <ProMaxLivingEarthStatic size="medium" surface="trading" />
        <div>
          <strong>Pro Max Trading</strong>
          <span>Trading Ground on Pro Max Earth</span>
          <small>{truth.identityLine}</small>
        </div>
      </Link>

      <div className={styles.commandBadges} aria-label="Trading operating truth">
        <span>Managed by Universe</span>
        <span>Private mode</span>
        <span>Demo-safe / read-only mode</span>
        <span>System readiness: guarded</span>
        <span>Public launch: not started</span>
        <span>Real money: disabled</span>
      </div>

      <details className="tpm-auth-panel-topbar">
        <summary>Sign in</summary>
        <p>Account surface is calm and inactive for this private review.</p>
      </details>
    </header>
  );
}
