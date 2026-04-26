import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonGravityRoutePanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-consciousness-route">
      <span>Gravity / Route</span>
      <h3>Priority and owner routing</h3>
      <p>
        Gravity assigns P0, P1, P2, P3, blocked, or black-hole priority. Route
        sends work to the correct public, private, or invisible owner system.
      </p>
      <div className="alkon-command-facts">
        {Object.entries(snapshot.gravityDistribution).map(([priority, count]) => (
          <div key={priority}>
            <dt>{priority}</dt>
            <dd>{count}</dd>
          </div>
        ))}
      </div>
      <div className="tpm-founder-mini-list">
        {snapshot.activeRoutes.slice(0, 4).map((route) => (
          <div key={route.signalId}>
            <span>{route.ownerSystem}</span>
            <strong>{route.responsibleWorker}</strong>
            <small>{route.requiredMonitors.join(" / ")}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
