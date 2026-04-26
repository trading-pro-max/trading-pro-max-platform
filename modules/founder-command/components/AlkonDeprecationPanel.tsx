import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonDeprecationPanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Deprecation / Removal</span>
        <h2>No removal without proof</h2>
        <p>Cleanup stays review-only until dependencies, rollback, tests, and memory archive exist.</p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Cleanup</span>
          <strong>{snapshot.cleanupCandidates.length}</strong>
          <small>review-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Deprecation</span>
          <strong>{snapshot.deprecationCandidates.length}</strong>
          <small>Founder visible</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Removal-ready</span>
          <strong>{snapshot.removalCandidates.length}</strong>
          <small>no deletion execution</small>
        </div>
      </div>
    </section>
  );
}
