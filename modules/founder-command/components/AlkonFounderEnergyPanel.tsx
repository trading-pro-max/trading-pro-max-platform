import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonFounderEnergyPanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-founder-energy="true">
      <div className="tpm-founder-panel-head">
        <span>Founder Energy / Worldline Protection</span>
        <h2>One critical decision at a time</h2>
        <p>{snapshot.nextOneCriticalDecision}</p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Founder attention</span>
          <strong>{String(snapshot.founderEnergy.founderAttentionRequired)}</strong>
          <small>{snapshot.founderEnergy.decisionLoad}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Codex draft</span>
          <strong>{String(snapshot.founderEnergy.canDelegateToCodex)}</strong>
          <small>Draft only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Prime protection</span>
          <strong>{snapshot.worldlineProtection.riskToPrimeWorld}</strong>
          <small>{snapshot.worldlineProtection.reason}</small>
        </div>
      </div>
    </section>
  );
}
