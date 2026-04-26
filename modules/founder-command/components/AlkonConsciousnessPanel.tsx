import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonConsciousnessPanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-consciousness-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon sovereign operating consciousness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Sovereign Operating Consciousness</span>
        <h2>Sense, law, route, judge, remember, evolve</h2>
        <p>
          Private Founder-only operating intelligence that organizes signals
          into lawful meaning, gravity, routing, safe action preparation,
          tribunal judgment, memory, and future guards. It is not human
          consciousness, not independent AI, and not uncontrolled autonomy.
        </p>
      </div>

      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Flow</span>
          <strong>{snapshot.flow.length}</strong>
          <small>{snapshot.flow.join(" -> ")}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Signals</span>
          <strong>{snapshot.latestSignals.length}</strong>
          <small>{snapshot.preparedActions.length} prepared actions</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>Private command layer only</small>
        </div>
      </div>
    </section>
  );
}
