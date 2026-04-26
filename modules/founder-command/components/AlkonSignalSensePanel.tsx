import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonSignalSensePanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-consciousness-sense">
      <span>Sense</span>
      <h3>Latest private signals</h3>
      <p>
        Sense converts Founder feedback, product gaps, validation results, and
        blocked requests into safe secret-free signals.
      </p>
      <div className="tpm-founder-mini-list">
        {snapshot.latestSignals.slice(0, 5).map((signal) => (
          <div key={signal.signalId}>
            <span>{signal.type}</span>
            <strong>{signal.title}</strong>
            <small>
              {signal.surface} / {signal.world}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
