import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonCleanupContinuityPanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Cleanup Continuity</span>
        <h2>Archive memory before anything disappears</h2>
        <p>Core systems are protected and every cleanup candidate reports to Founder Command.</p>
      </div>
      <div className="tpm-founder-mini-list">
        {snapshot.nextSafeActions.slice(0, 4).map((action) => (
          <div key={action}>
            <span>Next safe action</span>
            <strong>{action}</strong>
            <small>Read-only continuity guidance</small>
          </div>
        ))}
      </div>
    </section>
  );
}
