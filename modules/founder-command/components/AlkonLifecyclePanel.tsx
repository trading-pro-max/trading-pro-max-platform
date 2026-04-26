import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonLifecyclePanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Lifecycle</span>
        <h2>Identity, law, function, integration, proof</h2>
        <p>Accepted entities must stay useful, owned, tested, truthful, and boundary-safe.</p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Review required</span>
          <strong>{snapshot.reviewRequired.length}</strong>
          <small>function / proof / law</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Founder approval</span>
          <strong>{snapshot.founderApprovalRequired.length}</strong>
          <small>sensitive continuity</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Monitored</span>
          <strong>{snapshot.monitoredEntities.length}</strong>
          <small>healthy sample entities</small>
        </div>
      </div>
    </section>
  );
}
