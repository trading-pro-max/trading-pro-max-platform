import type { FinalConvergenceSnapshot } from "@/lib/server/final-convergence";

export default function AlkonNextSafeLayersPanel({
  snapshot,
}: {
  snapshot: FinalConvergenceSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-next-safe-layers">
      <span>Next Safe Layers / Result Tribunal</span>
      <h3>Audit, cleanup, Local Day One, then governed growth</h3>
      <div className="tpm-founder-briefing-grid alkon-decision-grid">
        <article>
          <h4>Next safe actions</h4>
          <ul>
            {snapshot.nextSafeActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Founder review needs</h4>
          <ul>
            {snapshot.founderReviewNeeds.slice(0, 6).map((need) => (
              <li key={need}>{need}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Blocked escalations</h4>
          <ul>
            {snapshot.blockedEscalations.slice(0, 8).map((blocked) => (
              <li key={blocked}>{blocked}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Audit / cleanup / day</h4>
          <ul>
            <li>Reality audit: {snapshot.realityAuditReadiness.status}</li>
            <li>Cleanup active: {String(snapshot.cleanupReadiness.executionActive)}</li>
            <li>Local day: {snapshot.localDayReadiness.status}</li>
            <li>Ready to start: {String(snapshot.localDayReadiness.readyToStart)}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
