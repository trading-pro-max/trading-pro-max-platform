import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonAbsoluteCompletionPanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-absolute-completion="true">
      <div className="tpm-founder-panel-head">
        <span>Absolute Completion Law</span>
        <h2>Complete means proven, not bigger</h2>
        <p>
          Completion requires function, truth, safety, legal, operations,
          memory, cost, stage, and Founder acceptance evidence.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.completionChecks.map((check) => (
          <li key={check.checkId}>
            <span>{check.checkId}</span>
            <strong>{check.outcome}</strong>
            <small>{check.reason}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
