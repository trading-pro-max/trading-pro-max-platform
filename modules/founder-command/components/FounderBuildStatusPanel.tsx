import type { FounderBuildRoomSnapshot } from "../types";

type FounderBuildStatusPanelProps = {
  snapshot: FounderBuildRoomSnapshot;
};

export default function FounderBuildStatusPanel({
  snapshot,
}: FounderBuildStatusPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Build status</span>
        <h3>Local platform construction</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Mode</span>
          <strong>{snapshot.localMode.replaceAll("_", " ")}</strong>
        </div>
        <div>
          <span>Readiness</span>
          <strong>{snapshot.readinessStatus.replaceAll("_", " ")}</strong>
        </div>
        <div>
          <span>Day One</span>
          <strong>{snapshot.localDayReadiness.gateStatus.replaceAll("_", " ")}</strong>
        </div>
      </div>
      <p>
        Build Room is draft-only. It can observe, classify, and prepare tasks;
        it cannot execute approvals or send work externally.
      </p>
    </section>
  );
}
