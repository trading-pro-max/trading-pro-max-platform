import type {
  DesktopDistributionGate,
  DesktopDistributionGateCheck,
} from "@/lib/server/universe/desktop-distribution-gate";
import styles from "../al-kawn-desktop.module.css";

function DistributionCard({ item }: { item: DesktopDistributionGateCheck }) {
  return (
    <article className={styles.packagingCard}>
      <span>{item.state}</span>
      <strong>{item.label}</strong>
      <small>{item.status}</small>
      <ul>
        {item.checks.slice(0, 5).map((check, index) => (
          <li key={`distribution-${item.id}-check-${index}-${check}`}>{check}</li>
        ))}
      </ul>
      <em>{item.nextAction}</em>
    </article>
  );
}

export function AlKawnPrivateDesktopDistributionGate({
  gate,
}: {
  gate: DesktopDistributionGate;
}) {
  const gateItems = [
    gate.previousReports,
    gate.privateDistributionReadiness,
    gate.publicDistributionBlock,
    gate.productionSigningGate,
    gate.artifactPolicy,
    gate.secretSafety,
  ];

  return (
    <section
      className={styles.packagingGate}
      data-testid="private-desktop-distribution-gate"
      aria-label="Private Desktop Distribution Gate"
    >
      <div className={styles.sectionTitle}>
        <span>Private Desktop Distribution Gate</span>
        <h2>Distribution is private Ahmad-only.</h2>
      </div>
      <p>{gate.summary}</p>
      <div className={styles.truthChips}>
        <span>Public desktop distribution is blocked.</span>
        <span>Production signing remains a future gate.</span>
        <span>No installers are uploaded or published.</span>
        <span>Product Truth overrides distribution.</span>
        <span>No secrets are stored in the desktop bundle.</span>
      </div>

      <div className={styles.packagingGrid}>
        {gateItems.map((item) => (
          <DistributionCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {gate.productTruth.map((item, index) => (
            <small key={`distribution-product-truth-${index}-${item}`}>{item}</small>
          ))}
        </article>
        <article>
          <span>Blocked distribution actions</span>
          {gate.blockedActions.map((item, index) => (
            <small key={`distribution-blocked-action-${index}-${item}`}>{item}</small>
          ))}
        </article>
        <article>
          <span>Next distribution action</span>
          <strong>{gate.nextAction.next}</strong>
          <small>{gate.nextAction.reason}</small>
          {gate.nextAction.blockedUntil.map((item, index) => (
            <small key={`distribution-next-blocked-${index}-${item}`}>
              Blocked until: {item}
            </small>
          ))}
        </article>
      </div>
    </section>
  );
}
