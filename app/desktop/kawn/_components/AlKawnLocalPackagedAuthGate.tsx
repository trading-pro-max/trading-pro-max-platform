import type {
  LocalPackagedAuthGate,
  LocalPackagedAuthReadiness,
} from "@/lib/server/universe/local-packaged-auth-gate";
import styles from "../al-kawn-desktop.module.css";

function AuthReadinessCard({ item }: { item: LocalPackagedAuthReadiness }) {
  return (
    <article className={styles.packagingCard}>
      <span>{item.state}</span>
      <strong>{item.label}</strong>
      <small>{item.status}</small>
      <ul>
        {item.checks.slice(0, 5).map((check, index) => (
          <li key={`local-auth-${item.id}-check-${index}-${check}`}>{check}</li>
        ))}
      </ul>
      <em>{item.nextAction}</em>
    </article>
  );
}

export function AlKawnLocalPackagedAuthGate({
  gate,
}: {
  gate: LocalPackagedAuthGate;
}) {
  const readinessItems = [
    gate.privateAccessModel,
    gate.localAuthReadiness,
    gate.packagedAppLockReadiness,
    gate.sessionTimeoutReadiness,
    gate.externalAuthStatus,
    gate.authSecretSafety,
  ];

  return (
    <section
      className={styles.packagingGate}
      data-testid="local-packaged-auth-gate"
      aria-label="Local Packaged Auth Gate"
    >
      <div className={styles.sectionTitle}>
        <span>Local Packaged Auth Gate</span>
        <h2>Al-Kawn Desktop requires Ahmad-only local access.</h2>
      </div>
      <p>{gate.summary}</p>
      <div className={styles.truthChips}>
        <span>Packaged-app authentication is private and local-first.</span>
        <span>No secrets are stored in the app bundle.</span>
        <span>External auth providers require Ahmad approval.</span>
        <span>Production-grade auth is a future gate unless implemented.</span>
        <span>Product Truth overrides local auth claims.</span>
        <span>Public desktop distribution is blocked.</span>
      </div>

      <div className={styles.packagingGrid}>
        {readinessItems.map((item) => (
          <AuthReadinessCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {gate.productTruth.map((item, index) => (
            <small key={`local-auth-product-truth-${index}-${item}`}>{item}</small>
          ))}
        </article>
        <article>
          <span>Blocked local auth claims</span>
          {gate.blockedClaims.map((item, index) => (
            <small key={`local-auth-blocked-claim-${index}-${item}`}>{item}</small>
          ))}
        </article>
        <article>
          <span>Next auth action</span>
          <strong>{gate.nextAction.next}</strong>
          <small>{gate.nextAction.reason}</small>
          {gate.nextAction.blockedUntil.map((item, index) => (
            <small key={`local-auth-next-blocked-${index}-${item}`}>
              Blocked until: {item}
            </small>
          ))}
        </article>
      </div>
    </section>
  );
}
