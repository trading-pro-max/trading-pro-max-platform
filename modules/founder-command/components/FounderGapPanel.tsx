import type { FounderLocalCommandSnapshot } from "../types";

type FounderGapPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderGapPanel({ snapshot }: FounderGapPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Product gaps</span>
        <h3>Known issues to avoid repeating</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Total</span>
          <strong>{snapshot.productGaps.summary.total}</strong>
        </div>
        <div>
          <span>Open</span>
          <strong>{snapshot.productGaps.summary.open}</strong>
        </div>
        <div>
          <span>High</span>
          <strong>{snapshot.productGaps.summary.high}</strong>
        </div>
      </div>
      <ul>
        {snapshot.productGaps.gaps.slice(0, 5).map((gap) => (
          <li key={gap.id}>
            {gap.gap} - {gap.status.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
    </section>
  );
}
