import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";

export default function FounderAutonomyQueuePanel({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const app = getFounderCommandAppSnapshot(checkedAt);
  const autonomy = app.engineeringOpsQuality.sovereignAutonomy;
  const codex = app.engineeringOpsQuality.codexSovereignty;

  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Sovereign Autonomy</span>
        <h2>Idea, event, passport, and Codex queue</h2>
        <p>
          Construction remains governed by gates, passports, permits, result
          review, Product Truth, and Founder authority.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Idea inbox</span>
          <strong>{String(autonomy.ideaInboxReady)}</strong>
          <small>{autonomy.ideaInbox.pendingIdeaDrafts} pending drafts</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Task passports</span>
          <strong>{autonomy.taskPassportsReady}</strong>
          <small>{autonomy.codexDraftsReady} Codex drafts ready</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Level 3</span>
          <strong>{codex.level3Status.level30DraftOnly ? "draft-only" : "blocked"}</strong>
          <small>Level 3.1 remains readiness-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Tribunal</span>
          <strong>{codex.resultTribunalStatus}</strong>
          <small>{codex.lessonsLearned.length} lessons ready</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h3>Blocked categories</h3>
          <ul>
            {codex.blockedTaskCategories.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Waiting Founder approval</h3>
          <ul>
            {codex.tasksWaitingFounderApproval.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Auto-submit eligible</h3>
          <ul>
            {codex.autoSubmitEligibleCategories.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>What not to automate</h3>
          <ul>
            {autonomy.whatNotToAutomate.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
