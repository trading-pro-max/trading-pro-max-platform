import type { AlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";

export default function AlkonOneNextActionPanel({
  snapshot,
}: {
  snapshot: AlkonOperatingModeSnapshot;
}) {
  const action = snapshot.oneNextAction;

  return (
    <section
      className="tpm-founder-panel alkon-one-next-action"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon One Next Action"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>One Next Action</span>
        <h2>{action.actionId}</h2>
        <p>{action.oneNextAction}</p>
      </div>
      <p className="alkon-next-action">{action.whyThisNow}</p>
      <div className="alkon-command-grid">
        <div className="tpm-founder-subpanel">
          <span>Delayed</span>
          <ul className="alkon-physics-block-list">
            {action.delayedActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="tpm-founder-subpanel">
          <span>Blocked</span>
          <ul className="alkon-physics-block-list">
            {action.blockedActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="tpm-founder-subpanel">
          <span>Founder decision</span>
          <strong>{String(action.founderDecisionNeeded)}</strong>
          <p>{action.founderDecisionRequest.requestedDecision}</p>
        </div>
      </div>
    </section>
  );
}
