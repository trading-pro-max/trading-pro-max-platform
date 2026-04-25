import type { FounderLocalCommandSnapshot } from "../types";

type FounderMemoryPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderMemoryPanel({ snapshot }: FounderMemoryPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Product memory</span>
        <h3>Safe local/internal memory</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Domains</span>
          <strong>{snapshot.productMemory.domainSummary.length}</strong>
        </div>
        <div>
          <span>Open gaps</span>
          <strong>{snapshot.productMemory.founderSummary.openProductGaps.length}</strong>
        </div>
        <div>
          <span>Safety</span>
          <strong>{snapshot.productMemory.founderSummary.memorySafetyStatus}</strong>
        </div>
      </div>
      <p>{snapshot.productMemory.storage.persistenceGap}</p>
      <small>
        No secrets, raw private sensitive data, fake users, fake revenue, or fake metrics.
      </small>
    </section>
  );
}
