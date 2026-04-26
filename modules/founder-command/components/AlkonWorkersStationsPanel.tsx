import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonWorkersStationsPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const physics = snapshot.cosmicPhysics;
  const graph = physics.sampleTaskGraphs[0];

  return (
    <section className="tpm-founder-subpanel alkon-workers-stations">
      <span>Satellites / Stations / Workers</span>
      <h3>Private operating network</h3>
      <div className="alkon-command-facts">
        <div>
          <dt>Satellites</dt>
          <dd>{physics.registrySummary.satellites}</dd>
        </div>
        <div>
          <dt>Stations</dt>
          <dd>{physics.registrySummary.stations}</dd>
        </div>
        <div>
          <dt>Workers</dt>
          <dd>{physics.registrySummary.workers}</dd>
        </div>
        <div>
          <dt>Handoffs</dt>
          <dd>{graph.handoffs.length}</dd>
        </div>
      </div>
      <div className="alkon-command-tags">
        {graph.satelliteMonitors.map((monitor) => (
          <span key={monitor.id}>{monitor.name}</span>
        ))}
      </div>
      <p className="alkon-next-action">
        {graph.worker.name} reports to {graph.worker.reportTarget}; no worker can
        expose secrets, activate billing/live/broker/social, or expose Alkon
        publicly.
      </p>
    </section>
  );
}
