import type { InfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";

export default function AlkonInfiniteGrowthPanel({
  snapshot,
}: {
  snapshot: InfiniteGrowthSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-infinite-growth-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Swiss-law infinite growth readiness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Infinite Sovereign Growth</span>
        <h2>Safe creation is open; reality remains gated</h2>
        <p>
          Private constitution for unlimited ideas, planning, design, docs,
          tests, audits, memory, and local build. Users, data, money, claims,
          publishing, launch, production, and regulated financial activity stay
          behind Product Truth, Swiss-law gravity, privacy, accounting,
          security, reputation, rollback, and Founder gates.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Safe creation</span>
          <strong>{snapshot.safeCreationDomains.length}</strong>
          <small>domains open locally</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Reality gated</span>
          <strong>{snapshot.gatedRealityDomains.length}</strong>
          <small>domains require gates</small>
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
