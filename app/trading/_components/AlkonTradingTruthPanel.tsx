import type { ProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import styles from "../trading-premium-realism.module.css";

export default function AlkonTradingTruthPanel({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  return (
    <section
      className={styles.truthPanel}
      data-alkon-truth-panel="true"
      data-private-origin-public-exposure="false"
      aria-label="Premium Intelligence / Truth Panel"
    >
      <span>Private intelligence boundary</span>
      <h2>Read-only product truth</h2>
      <p>
        One next action: open this operating floor and the private universe command
        center, then accept, reject with notes, or correct one narrow issue.
      </p>
      <ul>
        <li>Product Truth summary: private, read-only, demo-safe.</li>
        <li>Boundary protection: no public private-origin exposure.</li>
        <li>Brand Gate: frozen/deferred.</li>
        <li>Local Day One: not started.</li>
        <li>Public launch: not started.</li>
        <li>Swiss legal review: {truth.gates.swissLegalReview}.</li>
        <li>Global legal review: {truth.gates.globalLegalReview}.</li>
      </ul>
    </section>
  );
}
