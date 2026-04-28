import { ProMaxEarthIdentity } from "@/app/_components/ProMaxEarthIdentity";
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
        <ProMaxEarthIdentity size="command" />
        <div>
          <strong>Pro Max Trading</strong>
          <span>Trading Operating Floor</span>
          <small>{truth.identityLine}</small>
        </div>
      </Link>

      <div className={styles.commandBadges} aria-label="Trading operating truth">
        <span>Private mode</span>
        <span>Demo-safe / read-only mode</span>
        <span>System readiness: guarded</span>
        <span>Audit state: evidence-aware</span>
        <span>Private origin boundary: protected</span>
        <span>Session state: rehearsal</span>
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
