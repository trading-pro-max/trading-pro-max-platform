import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";

export default function FounderPlanetMemoryPanel({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const app = getFounderCommandAppSnapshot(checkedAt);
  const memory = app.persistentProductMemory;

  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Product Memory</span>
        <h2>Lessons, gaps, and safe local memory</h2>
        <p>
          Memory keeps accepted patterns, rejected patterns, Founder preferences,
          validation summaries, and gaps without secrets or raw private sensitive
          data.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Readiness</span>
          <strong>{memory.readiness}</strong>
          <small>{memory.memorySafetyStatus}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Domains</span>
          <strong>{memory.domainSummary.length}</strong>
          <small>{memory.openProductGaps} open gaps</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Validation</span>
          <strong>{memory.recentValidationSummaries}</strong>
          <small>{memory.dailySummary.validationCommands} commands tracked</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Build decisions</span>
          <strong>{memory.buildDecisions}</strong>
          <small>{memory.localDayReports} local day reports</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h3>Suggested next task</h3>
          <p>{memory.dailySummary.suggestedNextTask}</p>
        </article>
        <article>
          <h3>Forbidden storage</h3>
          <ul>
            {memory.forbiddenStorageReminders.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
