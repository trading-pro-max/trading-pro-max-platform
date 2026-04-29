import type {
  DesktopPackagingGate,
  DesktopPackagingReadiness,
} from "@/lib/server/universe/desktop-packaging-gate";
import styles from "../al-kawn-desktop.module.css";

function ReadinessCard({ item }: { item: DesktopPackagingReadiness }) {
  return (
    <article className={styles.packagingCard}>
      <span>{item.state}</span>
      <strong>{item.label}</strong>
      <small>{item.status}</small>
      <ul>
        {item.checks.slice(0, 5).map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
      <em>{item.nextAction}</em>
    </article>
  );
}

export function AlKawnPrivateDesktopPackagingGate({
  gate,
}: {
  gate: DesktopPackagingGate;
}) {
  const readinessItems = [
    gate.shellReadiness,
    gate.nativeShellReadiness,
    gate.packageReadiness,
    gate.signingReadiness,
    gate.privateDistributionReadiness,
    gate.authReadiness,
    gate.secretSafety,
  ];

  return (
    <section
      className={styles.packagingGate}
      data-testid="private-desktop-packaging-gate"
      aria-label="Private Desktop Packaging Gate"
    >
      <div className={styles.sectionTitle}>
        <span>Private Desktop Packaging Gate</span>
        <h2>Packaging is not public distribution.</h2>
      </div>
      <p>{gate.summary}</p>
      <div className={styles.truthChips}>
        <span>Al-Kawn Desktop remains Ahmad-only.</span>
        <span>No secrets are stored in the desktop bundle.</span>
        <span>Signing, packaging, and private distribution remain gated.</span>
        <span>Product Truth overrides desktop packaging.</span>
        <span>Public desktop distribution is blocked.</span>
      </div>

      <div className={styles.packagingGrid}>
        {readinessItems.map((item) => (
          <ReadinessCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {gate.productTruth.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Blocked actions</span>
          {gate.blockedActions.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Next packaging action</span>
          <strong>{gate.nextAction.next}</strong>
          <small>{gate.nextAction.reason}</small>
          {gate.nextAction.blockedUntil.map((item) => (
            <small key={item}>Blocked until: {item}</small>
          ))}
        </article>
      </div>
    </section>
  );
}
