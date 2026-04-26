import type { AlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";

export default function AlkonDecisionPermitPanel({
  snapshot,
}: {
  snapshot: AlkonLegitimacySnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-decision-permit-panel">
      <span>Decision Permit</span>
      <h3>Permit outcomes stay report, draft, review, delay, block, or black hole</h3>
      <p>
        The permit engine never executes web-app actions, payments, external
        calls, Codex calls, or secret access.
      </p>
      <div className="tpm-founder-mini-list">
        {snapshot.recentSampleDecisions.map((decision) => (
          <div key={decision.permit.permitId}>
            <span>{decision.permit.outcome}</span>
            <strong>{decision.request.actionCategory}</strong>
            <small>{decision.permit.nextSafeAction}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
