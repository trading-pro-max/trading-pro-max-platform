import type {
  DesktopPackagingPreparation,
  DesktopPackagingPreparationCheck,
} from "@/lib/server/universe/desktop-packaging-preparation";
import styles from "../al-kawn-desktop.module.css";

function PreparationCard({ item }: { item: DesktopPackagingPreparationCheck }) {
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

export function AlKawnPrivateDesktopPackagingPreparation({
  preparation,
}: {
  preparation: DesktopPackagingPreparation;
}) {
  const preparationItems = [
    preparation.previousGates,
    preparation.packagingCapability,
    preparation.nativeShellStatus,
    preparation.packageScriptStatus,
    preparation.authGateStatus,
    preparation.secretSafety,
  ];

  return (
    <section
      className={styles.packagingGate}
      data-testid="private-desktop-packaging-preparation"
      aria-label="Private Desktop Packaging Preparation"
    >
      <div className={styles.sectionTitle}>
        <span>Private Desktop Packaging Preparation</span>
        <h2>Packaging preparation is not public release.</h2>
      </div>
      <p>{preparation.summary}</p>
      <div className={styles.truthChips}>
        <span>Al-Kawn Desktop remains Ahmad-only.</span>
        <span>No secrets are stored in the desktop bundle.</span>
        <span>Signing and public distribution remain blocked.</span>
        <span>Product Truth overrides packaging.</span>
        <span>Public desktop distribution is blocked.</span>
      </div>

      <div className={styles.packagingGrid}>
        {preparationItems.map((item) => (
          <PreparationCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {preparation.productTruth.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Blocked packaging actions</span>
          {preparation.blockedActions.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Next packaging action</span>
          <strong>{preparation.nextAction.next}</strong>
          <small>{preparation.nextAction.reason}</small>
          {preparation.nextAction.blockedUntil.map((item) => (
            <small key={item}>Blocked until: {item}</small>
          ))}
        </article>
      </div>
    </section>
  );
}
