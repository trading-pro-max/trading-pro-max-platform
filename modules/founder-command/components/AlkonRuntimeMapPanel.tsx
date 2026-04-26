import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";

export default function AlkonRuntimeMapPanel({
  snapshot,
}: {
  snapshot: AlkonRuntimeSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Runtime Map</span>
        <h2>Space, gravity, and orbit routing</h2>
        <p>
          Inputs are assigned to private runtime spaces and routed to safe
          orbits with proof, report targets, and memory rules.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.sampleReports.slice(0, 5).map((report) => (
          <li key={report.reportId}>
            <strong>{report.birth.name}</strong>
            <span>
              {report.space.assignedSpace} / {report.gravity.gravity} /{" "}
              {report.orbit.orbit}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
