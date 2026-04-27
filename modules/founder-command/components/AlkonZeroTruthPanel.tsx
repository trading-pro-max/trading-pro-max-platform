import type { AlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";

export default function AlkonZeroTruthPanel({
  snapshot,
}: {
  snapshot: AlkonOperatingModeSnapshot;
}) {
  const audit = snapshot.zeroTruthAudit;
  const priorityFindings = audit.findings.filter(
    (finding) =>
      finding.classification === "needs_visual_review" ||
      finding.classification === "blocked" ||
      finding.severity === "P1_high"
  );

  return (
    <section
      className="tpm-founder-panel alkon-zero-truth"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Zero Truth audit"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Zero Truth Audit</span>
        <h2>Reality before action</h2>
        <p>
          Zero Truth means audit the current product, not delete it. It records
          accepted, risky, blocked, and Ahmad-gated reality before Alkon chooses
          any next action.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Findings</span>
          <strong>{audit.findings.length}</strong>
          <small>{audit.status}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Blockers</span>
          <strong>{audit.blockers.length}</strong>
          <small>{audit.productTruthStatus.overall}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Deletion</span>
          <strong>{String(audit.deletesProject)}</strong>
          <small>Audit, not reset</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Candidate</span>
          <strong>{audit.localDayOneReadiness.status}</strong>
          <small>{audit.oneNextActionCandidate}</small>
        </div>
      </div>
      <div className="alkon-domain-list">
        {priorityFindings.slice(0, 5).map((finding) => (
          <div key={finding.findingId}>
            <small>{finding.label}</small>
            <strong>{finding.classification}</strong>
            <p>{finding.nextAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
