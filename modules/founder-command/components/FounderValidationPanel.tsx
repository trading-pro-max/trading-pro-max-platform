import type { FounderLocalCommandSnapshot } from "../types";

type FounderValidationPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderValidationPanel({
  snapshot,
}: FounderValidationPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Validation</span>
        <h3>Summary-only evidence</h3>
      </header>
      <div className="tpm-founder-local-validation-list">
        {snapshot.validation.commandStatuses.slice(0, 8).map((item) => (
          <div key={item.command}>
            <span>{item.command}</span>
            <strong>{item.status}</strong>
          </div>
        ))}
      </div>
      <p>
        Human Ahmad acceptance is required. No false pass, fake 10/10, or raw log
        persistence.
      </p>
    </section>
  );
}
