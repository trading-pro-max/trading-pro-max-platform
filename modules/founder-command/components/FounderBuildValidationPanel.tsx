import type { FounderBuildRoomSnapshot } from "../types";

type FounderBuildValidationPanelProps = {
  snapshot: FounderBuildRoomSnapshot;
};

export default function FounderBuildValidationPanel({
  snapshot,
}: FounderBuildValidationPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Validation</span>
        <h3>Before accepting builds</h3>
      </header>
      <div className="tpm-founder-local-validation-list">
        {snapshot.validationStatus.commands.slice(0, 8).map((item) => (
          <div key={item.command}>
            <span>{item.command}</span>
            <strong>{item.status}</strong>
          </div>
        ))}
      </div>
      <small>
        Policy: {snapshot.validationStatus.policy.replaceAll("_", " ")}. False
        passes are blocked.
      </small>
    </section>
  );
}
