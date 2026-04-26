import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonDestinyScorePanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-destiny-score="true">
      <div className="tpm-founder-panel-head">
        <span>Destiny Score</span>
        <h2>No fake perfect scores</h2>
        <p>
          Scores are capped by proof, Product Truth, visual acceptance, law,
          safety, and Prime World protection.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.sampleReports.map((report) => (
          <li key={report.reportId}>
            <span>{report.target.title}</span>
            <strong>{report.score.overallScore}/10</strong>
            <small>{report.score.scoreCapReason}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
