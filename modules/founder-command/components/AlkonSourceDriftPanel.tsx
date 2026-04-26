import type { SourceLawSnapshot } from "@/lib/server/source-law";

export default function AlkonSourceDriftPanel({
  snapshot,
}: {
  snapshot: SourceLawSnapshot;
}) {
  const activeSignals = snapshot.driftSignals.filter((signal) => signal.driftDetected);

  return (
    <section className="tpm-founder-panel" data-private-source-drift="true">
      <div className="tpm-founder-panel-head">
        <span>Source Drift</span>
        <h2>Return to the heart</h2>
        <p>
          Drift is corrected back to Pro Max Trading, Living Market Core,
          Assistant clarity, Reality Audit, Safe Cleanup, and Local Day One.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {activeSignals.slice(0, 5).map((signal) => (
          <li key={`${signal.driftType}-${signal.severity}`}>
            <span>{signal.driftType}</span>
            <strong>{signal.severity}</strong>
            <small>{signal.correction}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
