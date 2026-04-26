import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";

export default function AlkonRuntimePanel({
  snapshot,
}: {
  snapshot: AlkonRuntimeSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-runtime-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Digital Universe Runtime readiness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Digital Universe Runtime</span>
        <h2>Every input receives place, law, proof, memory, and fate</h2>
        <p>
          Private runtime for ideas, risks, invoices, media messages, features,
          bugs, decisions, laws, and results. It prepares readiness reports only:
          no payment, deletion, shell, Codex, publishing, launch, billing,
          broker/feed, live execution, or real-money activation.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Runtime reports</span>
          <strong>{snapshot.sampleReports.length}</strong>
          <small>birth to next fate</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Black holes</span>
          <strong>{snapshot.blackHoleCategories.length}</strong>
          <small>forbidden categories</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>Founder/private only</small>
        </div>
      </div>
    </section>
  );
}
