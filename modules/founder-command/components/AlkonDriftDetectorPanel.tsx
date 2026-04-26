import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonDriftDetectorPanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-drift-detector="true">
      <div className="tpm-founder-panel-head">
        <span>Drift Detector</span>
        <h2>Delay what weakens the Prime World</h2>
        <p>
          Drift signals catch public claim risk, chart-not-king work,
          future-world distraction, weak proof, and Founder energy overload.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.topDrifts.slice(0, 5).map((drift, index) => (
          <li key={`${drift.driftType}-${index}`}>
            <span>{drift.driftType}</span>
            <strong>{drift.stopOrContinue}</strong>
            <small>{drift.correction}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
