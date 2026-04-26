import type { SourceLawSnapshot } from "@/lib/server/source-law";

export default function AlkonOneCorrectActionPanel({
  snapshot,
}: {
  snapshot: SourceLawSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-one-correct-action="true">
      <div className="tpm-founder-panel-head">
        <span>One Correct Action</span>
        <h2>{snapshot.oneCorrectAction.oneCorrectAction}</h2>
        <p>{snapshot.oneCorrectAction.whyThisNow}</p>
      </div>
      <div className="tpm-founder-briefing-grid">
        <article>
          <h3>Delayed</h3>
          <ul>
            {snapshot.oneCorrectAction.delayedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Blocked</h3>
          <ul>
            {snapshot.oneCorrectAction.blockedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Founder decision</h3>
          <p>{snapshot.oneCorrectAction.founderDecisionNeeded}</p>
        </article>
      </div>
    </section>
  );
}
