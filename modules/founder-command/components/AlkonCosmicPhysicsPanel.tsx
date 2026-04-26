import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonCosmicPhysicsPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const physics = snapshot.cosmicPhysics;

  return (
    <section className="tpm-founder-subpanel alkon-cosmic-physics">
      <span>Cosmic Operating Physics</span>
      <h3>Governed distribution for every private task body</h3>
      <p>
        Source, energy, gravity, orbit, owner, satellite, station, worker,
        passport, Codex License, validation, tribunal, memory, and Founder
        report are all required before work can be accepted.
      </p>

      <div className="alkon-command-facts alkon-physics-facts">
        <div>
          <dt>Visibility</dt>
          <dd>{physics.visibility}</dd>
        </div>
        <div>
          <dt>Public exposure</dt>
          <dd>{String(physics.publicExposure)}</dd>
        </div>
        <div>
          <dt>Task graph</dt>
          <dd>{physics.taskGraphStatus}</dd>
        </div>
        <div>
          <dt>Lifecycle</dt>
          <dd>{physics.lifecycleStatus}</dd>
        </div>
      </div>

      <div className="alkon-command-tags">
        {physics.requiredCoreLaw.map((law) => (
          <span key={law}>{law}</span>
        ))}
      </div>
    </section>
  );
}
