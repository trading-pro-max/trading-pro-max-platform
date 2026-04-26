import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";
import { getLocalLivingDayLoopSnapshot } from "@/lib/server/local-ops";

export default function FounderNextBuildPanel({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const app = getFounderCommandAppSnapshot(checkedAt);
  const loop = getLocalLivingDayLoopSnapshot(checkedAt);
  const buildRoom = app.founderBuildRoom;

  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Next Safe Build</span>
        <h2>Construction readiness without activation</h2>
        <p>
          Next actions are manual-review construction steps only. No shell
          execution, external Codex call, broker/feed, billing, live execution,
          real money, social publishing, or public launch is active.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Build room</span>
          <strong>{buildRoom.readiness}</strong>
          <small>{buildRoom.codexTaskDrafts} draft candidates</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Product gaps</span>
          <strong>{buildRoom.topProductGaps}</strong>
          <small>{buildRoom.topVisualGaps} visual gaps</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Validation</span>
          <strong>{buildRoom.validationCommands}</strong>
          <small>commands required before acceptance</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Founder decision</span>
          <strong>{String(buildRoom.founderDecisionNeeded)}</strong>
          <small>approval execution remains inactive</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h3>Today open gaps</h3>
          <ul>
            {loop.today.openGaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Proposed Codex drafts</h3>
          <ul>
            {loop.today.proposedCodexDrafts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Blocked requests</h3>
          <ul>
            {loop.today.blockedRequests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Next safe action</h3>
          <p>{loop.today.nextSafeAction}</p>
        </article>
      </div>
    </section>
  );
}
