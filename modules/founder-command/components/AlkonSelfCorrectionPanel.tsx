import type { SelfCorrectionSnapshot } from "@/lib/server/self-correction";

export default function AlkonSelfCorrectionPanel({
  snapshot,
}: {
  snapshot: SelfCorrectionSnapshot;
}) {
  const activeSignals = snapshot.signals.filter((signal) => signal.detected);

  return (
    <section
      className="tpm-founder-panel alkon-self-correction-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Self-Correction</span>
        <h2>Detect drift and return to the Pro Max heart</h2>
        <p>{snapshot.returnToHeart}</p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>Private only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Signals</span>
          <strong>{snapshot.signals.length}</strong>
          <small>{activeSignals.length} active notes</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Priority</span>
          <strong>P0 first</strong>
          <small>{snapshot.priorityOrder.slice(0, 3).join(" / ")}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Next</span>
          <strong>Visual</strong>
          <small>{snapshot.nextAction}</small>
        </div>
      </div>
      <ul className="alkon-device-list">
        {activeSignals.map((signal) => (
          <li key={signal.signalId}>
            {signal.type}: {signal.correction}
          </li>
        ))}
      </ul>
    </section>
  );
}

