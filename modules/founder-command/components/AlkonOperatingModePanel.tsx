import type { AlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";

export default function AlkonOperatingModePanel({
  snapshot,
}: {
  snapshot: AlkonOperatingModeSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-operating-mode"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Operating Mode"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Operating Mode</span>
        <h2>Zero Truth to governed evolution</h2>
        <p>
          Private operating mode reads the current Pro Max reality, checks
          Product Truth and public/private boundaries, returns one next action,
          and waits for Ahmad final authority.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>{snapshot.activationDecision}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Zero Truth</span>
          <strong>{snapshot.zeroTruthAudit.status}</strong>
          <small>{snapshot.zeroTruthAudit.blockers.length} blockers</small>
        </div>
        <div className="tpm-founder-metric">
          <span>One next action</span>
          <strong>{snapshot.oneNextAction.actionId}</strong>
          <small>{snapshot.oneNextAction.founderDecisionNeeded ? "Founder decision" : "No decision needed"}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Local Day One</span>
          <strong>{snapshot.localDayOneGate.status}</strong>
          <small>Visual acceptance gate</small>
        </div>
      </div>
    </section>
  );
}
