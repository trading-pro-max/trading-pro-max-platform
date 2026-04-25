import type { FounderBuildRoomSnapshot } from "../types";

type FounderBuildGapPanelProps = {
  snapshot: FounderBuildRoomSnapshot;
};

export default function FounderBuildGapPanel({
  snapshot,
}: FounderBuildGapPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Build gaps</span>
        <h3>What needs construction attention</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Product gaps</span>
          <strong>{snapshot.topProductGaps.length}</strong>
        </div>
        <div>
          <span>Visual gaps</span>
          <strong>{snapshot.topVisualGaps.length}</strong>
        </div>
        <div>
          <span>Founder decision</span>
          <strong>{snapshot.founderDecisionNeeded ? "needed" : "not needed"}</strong>
        </div>
      </div>
      <ul>
        {snapshot.topProductGaps.slice(0, 4).map((gap) => (
          <li key={gap.id}>
            {gap.gap} - {gap.status.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
    </section>
  );
}
