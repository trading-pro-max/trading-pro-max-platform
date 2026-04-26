import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonContinuityPanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-continuity-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon sovereign creation and continuity readiness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Creation & Continuity</span>
        <h2>Nothing lives without function</h2>
        <p>
          Private lifecycle governance for how ideas, entities, risks, tasks,
          memories, surfaces, and actions are born, identified, law-reviewed,
          integrated, proven, monitored, evolved, deprecated, archived, or
          removed under Founder authority.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Entity count</span>
          <strong>{snapshot.entityCount}</strong>
          <small>bridged from ontology</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Sample reports</span>
          <strong>{snapshot.sampleReports.length}</strong>
          <small>birth to memory chain</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>private command only</small>
        </div>
      </div>
    </section>
  );
}
