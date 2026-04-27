import type { AlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";

export default function AlkonDailyLoopPanel({
  snapshot,
}: {
  snapshot: AlkonOperatingModeSnapshot;
}) {
  const dailyLoop = snapshot.dailyOperatingLoop;

  return (
    <section
      className="tpm-founder-panel alkon-daily-loop"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Daily Operating Loop"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Daily Operating Loop</span>
        <h2>Read, decide, wait</h2>
        <p>
          The daily loop checks reports, station, Product Truth, boundary,
          Workspace heart, Assistant, visual acceptance, validation, drift, and
          then returns one next action for Ahmad.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{dailyLoop.dailyLoopStatus}</strong>
          <small>{dailyLoop.todayFocus}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Loop steps</span>
          <strong>{dailyLoop.loop.length}</strong>
          <small>Read-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Drift</span>
          <strong>{String(dailyLoop.driftDetected)}</strong>
          <small>{dailyLoop.driftNotes[0]}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Decision</span>
          <strong>{String(dailyLoop.founderDecisionNeeded)}</strong>
          <small>Founder final authority</small>
        </div>
      </div>
      <ol className="alkon-physics-chain">
        {dailyLoop.loop.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
