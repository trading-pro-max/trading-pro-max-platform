import { AlKawnCosmicIdentity } from "@/app/_components/al-kawn-visual/AlKawnCosmicIdentity";
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
        <AlKawnCosmicIdentity
          variant="tradingCompact"
          showLabels={false}
          includePrivateLabels={false}
        />
        <div>
          <strong>Pro Max Trading</strong>
          <span>Trading Ground on Pro Max Earth</span>
          <small>{truth.identityLine}</small>
        </div>
      </Link>

      <div className={styles.commandBadges} aria-label="Trading operating truth">
        <span>Inside Al-Kawn law / Existence Contract required</span>
        <span>Earth Control: available / Earth Planet trading surface</span>
        <span>Product Truth هو قانون الحقيقة الأعلى</span>
        <span>Demo-safe / read-only mode</span>
        <span>Founder Boundary: active / Money/broker actions approval-gated</span>
      </div>

      <details className="tpm-auth-panel-topbar">
        <summary>Sign in</summary>
        <p>Account surface is calm and inactive for this private review.</p>
      </details>
    </header>
  );
}
