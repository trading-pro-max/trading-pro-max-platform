import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonCosmicTaskGraphPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const graph = snapshot.cosmicPhysics.sampleTaskGraphs[0];

  return (
    <section className="tpm-founder-subpanel alkon-cosmic-task-graph">
      <span>Task Graph / Result Tribunal</span>
      <h3>{graph.event.title}</h3>
      <p>{graph.event.description}</p>

      <ol className="alkon-physics-chain">
        <li>Energy: {graph.event.energy}</li>
        <li>Gravity: {graph.gravity.priority}</li>
        <li>Orbit Path: {graph.orbit.orbitPath}</li>
        <li>Planet/System Owner: {graph.planetOwner.name}</li>
        <li>Station: {graph.station.name}</li>
        <li>Worker: {graph.worker.name}</li>
        <li>Validation: {graph.validation.status}</li>
        <li>Tribunal: {graph.tribunal.decision}</li>
        <li>Memory: {graph.memoryUpdate.status}</li>
      </ol>

      <p className="alkon-next-action">{graph.founderReport.nextAction}</p>
    </section>
  );
}
