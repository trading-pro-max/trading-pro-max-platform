import { getLocalLivingDayLoopSnapshot } from "@/lib/server/local-ops";

export default function FounderOperatingLoopPanel({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const loop = getLocalLivingDayLoopSnapshot(checkedAt);

  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Local Operations</span>
        <h2>Local Day One living loop</h2>
        <p>
          Start the local day, review public/world readiness, capture Founder
          ideas, draft Codex prompts externally, judge results, learn, and choose
          the next safe action.
        </p>
      </div>

      <div className="tpm-founder-living-loop">
        {loop.loop.map((stage) => (
          <article key={stage.step} data-tone={stage.status}>
            <span>{stage.status}</span>
            <strong>{stage.step}</strong>
            <p>{stage.output}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
