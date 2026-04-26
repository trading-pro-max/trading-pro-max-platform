import type { AlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";

export default function AlkonLegitimacyPanel({
  snapshot,
}: {
  snapshot: AlkonLegitimacySnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-legitimacy-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon sovereign legitimacy readiness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Sovereign Legitimacy</span>
        <h2>Authority must deserve to exist</h2>
        <p>
          Legitimacy checks Founder intent against mission, truth, user benefit,
          safety, law, finance, timing, reputation, rollback, memory, and
          Founder responsibility before a sensitive action can move beyond
          readiness.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Dimensions</span>
          <strong>{Object.keys(snapshot.dimensionsStatus).length}</strong>
          <small>mission, truth, safety, finance, timing, rollback</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Black holes</span>
          <strong>{snapshot.blackHoleCategories.length}</strong>
          <small>No unsafe authority use</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>Private command only</small>
        </div>
      </div>
    </section>
  );
}
