import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";

export default function AlkonRuntimeConsequencesPanel({
  snapshot,
}: {
  snapshot: AlkonRuntimeSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Consequences / Memory</span>
        <h2>Reality contact creates proof and lessons</h2>
        <p>
          Consequences summarize trust, support, cost, rollback, and memory
          before anything can approach public reality.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.sampleReports.slice(0, 4).map((report) => (
          <li key={report.reportId}>
            <strong>{report.consequence.nextFateRecommendation}</strong>
            <span>{report.memory.memoryLesson}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
