import type { FinalConvergenceSnapshot } from "@/lib/server/final-convergence";

export default function AlkonFinalConvergencePanel({
  snapshot,
}: {
  snapshot: FinalConvergenceSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-final-convergence"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon final convergence"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Final Convergence</span>
        <h2>One coherent local operating product</h2>
        <p>
          Public Earth, Private Alkon, the Invisible Operating Layer, Product
          Truth, Plan Realms, Assistant, Environment, Memory, Security,
          Construction, and Launch Readiness now converge into one private
          Founder operating map. This is local readiness only and does not
          activate launch, billing, live execution, real money, or social
          publishing.
        </p>
      </div>

      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>Founder-only convergence map</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Score</span>
          <strong>{snapshot.convergenceScore.score}/10</strong>
          <small>No fake final 10/10</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Layers</span>
          <strong>{snapshot.layers.length}</strong>
          <small>{snapshot.layerRegistryStatus}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>{snapshot.publicPrivateBoundaryStatus}</small>
        </div>
      </div>
    </section>
  );
}
