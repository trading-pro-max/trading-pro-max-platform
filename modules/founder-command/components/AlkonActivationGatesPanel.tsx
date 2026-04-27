import type { AlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";

export default function AlkonActivationGatesPanel({
  snapshot,
}: {
  snapshot: AlkonOperatingModeSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-activation-gates"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Activation Gates"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Activation Gates</span>
        <h2>{snapshot.activationDecision}</h2>
        <p>
          Operating Mode can activate with notes while Local Day One remains
          gated by Ahmad visual acceptance. P0 Product Truth, public leak,
          validation, security, and Git failures block activation.
        </p>
      </div>
      <div className="alkon-domain-list">
        {snapshot.activationGates.map((gate) => (
          <div key={gate.gateId} data-tone={gate.outcome}>
            <small>{gate.label}</small>
            <strong>{gate.outcome}</strong>
            <p>{gate.nextAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
