import type {
  DesktopLocalBuildDryRun,
  DesktopLocalBuildDryRunCheck,
} from "@/lib/server/universe/desktop-local-build-dry-run";
import styles from "../al-kawn-desktop.module.css";

function DryRunCard({ item }: { item: DesktopLocalBuildDryRunCheck }) {
  return (
    <article className={styles.packagingCard}>
      <span>{item.state}</span>
      <strong>{item.label}</strong>
      <small>{item.status}</small>
      <small>Result: {item.result}</small>
      <ul>
        {item.checks.slice(0, 5).map((check) => (
          <li key={check}>{check}</li>
        ))}
      </ul>
      <em>{item.nextAction}</em>
    </article>
  );
}

export function AlKawnPrivateDesktopLocalBuildDryRun({
  dryRun,
}: {
  dryRun: DesktopLocalBuildDryRun;
}) {
  const dryRunItems = [
    dryRun.previousReports,
    dryRun.capability,
    dryRun.scriptStatus,
    dryRun.nativeShellStatus,
    dryRun.dryRunResult,
    dryRun.artifactSafety,
    dryRun.secretSafety,
  ];

  return (
    <section
      className={styles.packagingGate}
      data-testid="private-desktop-local-build-dry-run"
      aria-label="Private Desktop Local Build Dry Run"
    >
      <div className={styles.sectionTitle}>
        <span>Private Desktop Local Build Dry Run</span>
        <h2>Local build dry run is not public release.</h2>
      </div>
      <p>{dryRun.summary}</p>
      <div className={styles.truthChips}>
        <span>Al-Kawn Desktop remains Ahmad-only.</span>
        <span>No secrets are stored in the desktop bundle.</span>
        <span>Production signing and public distribution remain blocked.</span>
        <span>Product Truth overrides local build.</span>
        <span>Generated artifacts are local-only.</span>
      </div>

      <div className={styles.packagingGrid}>
        {dryRunItems.map((item) => (
          <DryRunCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.packagingTruth}>
        <article>
          <span>Product Truth status</span>
          {dryRun.productTruth.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Blocked local build actions</span>
          {dryRun.blockedActions.map((item) => (
            <small key={item}>{item}</small>
          ))}
        </article>
        <article>
          <span>Next local build action</span>
          <strong>{dryRun.nextAction.next}</strong>
          <small>{dryRun.nextAction.reason}</small>
          {dryRun.nextAction.blockedUntil.map((item) => (
            <small key={item}>Blocked until: {item}</small>
          ))}
        </article>
      </div>
    </section>
  );
}
