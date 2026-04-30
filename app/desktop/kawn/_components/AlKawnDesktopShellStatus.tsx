import type { AlKawnDesktopShellFinalizationState } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDesktopShellStatus({
  shell,
}: {
  shell: AlKawnDesktopShellFinalizationState;
}) {
  return (
    <section
      className={styles.panel}
      data-testid="al-kawn-desktop-shell-status"
      aria-label="desktop shell finalization"
    >
      <div className={styles.sectionTitle}>
        <span>Desktop shell finalization</span>
        <h2>/desktop/kawn is the Al-Kawn private desktop home.</h2>
      </div>
      <strong>Private Ahmad-only desktop shell.</strong>
      <small>Shell type: {shell.shellType}</small>
      <small>Desktop shell is private Ahmad-only.</small>
      <small>Public desktop distribution is blocked.</small>
      <small>No secrets are stored in the desktop bundle.</small>
      <small>External accounts require Ahmad approval.</small>
      <small>Product Truth overrides every action.</small>
      <div className={styles.gapList}>
        <span>Route: {shell.privateHomeRoute}</span>
        <span>Default home: {shell.defaultHomeStatus}</span>
        <span>Signing: {shell.signingStatus}</span>
        <span>Packaging: {shell.packagingStatus}</span>
        <span>Script: {shell.packageScripts.join(", ")}</span>
      </div>
      <ul>
        {shell.gaps.map((gap, index) => (
          <li key={`desktop-shell-gap-${index}-${gap}`}>{gap}</li>
        ))}
      </ul>
    </section>
  );
}
