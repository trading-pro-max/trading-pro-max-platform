import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonNextActionsPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-next-actions">
      <span>Result Tribunal / Next Safe Actions</span>
      <h3>What Alkon allows, blocks, and needs from Ahmad</h3>
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
          <h4>Blocked actions</h4>
          <ul>
            {snapshot.blockedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Founder decision needed</h4>
          <ul>
            {snapshot.founderDecisionNeeded.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Product truth</h4>
          <ul>
            <li>Live execution blocked: {String(snapshot.productTruthStatus.liveExecutionBlocked)}</li>
            <li>Real money blocked: {String(snapshot.productTruthStatus.realMoneyBlocked)}</li>
            <li>Billing blocked: {String(snapshot.productTruthStatus.billingActivationBlocked)}</li>
            <li>Public exposure: {String(snapshot.publicExposure)}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
