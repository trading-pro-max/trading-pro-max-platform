import type { FinalConvergenceSnapshot } from "@/lib/server/final-convergence";

export default function AlkonAutomationGovernorPanel({
  snapshot,
}: {
  snapshot: FinalConvergenceSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-automation-governor">
      <span>Automation Governor</span>
      <h3>Growth without uncontrolled autonomy</h3>
      <p>
        Current automation is limited to detection, drafting, Codex-ready task
        draft preparation, and docs/tests readiness. Level 4 stays disabled and
        Level 5 autopilot is forbidden.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Maximum level</dt>
          <dd>{snapshot.automationGovernor.currentMaximumLevel}</dd>
        </div>
        <div>
          <dt>Level 4 disabled</dt>
          <dd>{String(snapshot.automationGovernor.truth.level4DisabledNow)}</dd>
        </div>
        <div>
          <dt>Level 5 forbidden</dt>
          <dd>{String(snapshot.automationGovernor.truth.level5Forbidden)}</dd>
        </div>
        <div>
          <dt>Shell execution</dt>
          <dd>{String(!snapshot.automationGovernor.truth.noShellExecutionFromWebApp)}</dd>
        </div>
      </div>
      <div className="alkon-command-tags">
        {snapshot.automationGovernor.allowedLevels.map((level) => (
          <span key={level}>{level}</span>
        ))}
      </div>
    </section>
  );
}
