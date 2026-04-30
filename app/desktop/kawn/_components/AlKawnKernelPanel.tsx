import type { AlKawnDesktopKernelState } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnKernelPanel({ kernel }: { kernel: AlKawnDesktopKernelState }) {
  return (
    <section className={styles.panel} aria-label="kernel panel">
      <div className={styles.sectionTitle}>
        <span>Universe Operating Kernel</span>
        <h2>Kernel panel</h2>
      </div>
      <strong>{kernel.role}</strong>
      <ul>
        {kernel.guards.map((guard, index) => (
          <li key={`kernel-guard-${index}-${guard}`}>{guard}</li>
        ))}
      </ul>
      <div className={styles.gapList}>
        {kernel.gaps.map((gap, index) => (
          <span key={`kernel-gap-${index}-${gap}`}>{gap}</span>
        ))}
      </div>
    </section>
  );
}
