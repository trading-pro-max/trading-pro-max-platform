import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonEntityBirthPanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Entity Birth</span>
        <h2>Candidate birth queue</h2>
        <p>Birth is proposal-only: no external action, no Codex call, no shell execution.</p>
      </div>
      <div className="tpm-founder-mini-list">
        {snapshot.sampleReports.slice(0, 5).map((report) => (
          <div key={report.reportId}>
            <span>{report.candidate.world}</span>
            <strong>{report.candidate.proposedName}</strong>
            <small>{report.decision.outcome}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
