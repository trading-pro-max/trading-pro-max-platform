import type { RealityProductionSnapshot } from "@/lib/server/reality-production";

export default function AlkonRealityProductionPanel({
  snapshot,
}: {
  snapshot: RealityProductionSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-reality-production-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Reality Production</span>
        <h2>Alkon decides, Reality judges, Evidence closes</h2>
        <p>
          Reality Production keeps Codex as a bounded builder while Alkon decides what
          deserves existence and Ahmad keeps final authority over sensitive gates.
        </p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>{snapshot.nextFate}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Signals</span>
          <strong>{snapshot.signals.length}</strong>
          <small>{snapshot.signals[0]?.title}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Builder</span>
          <strong>{snapshot.selectedBuilder.builderId}</strong>
          <small>Builder, not leader</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Can close</span>
          <strong>{String(snapshot.evidence.canClose)}</strong>
          <small>Visual acceptance still required</small>
        </div>
      </div>
      <ul className="alkon-device-list">
        {snapshot.memory.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

