import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonPlanetarySystemsPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const command = snapshot.planetarySystems;

  return (
    <article className="tpm-founder-subpanel alkon-planetary-systems">
      <span>{command.name}</span>
      <h3>{command.symbolicRole}</h3>
      <p>{command.readiness}</p>
      <div className="alkon-command-tags">
        {command.linkedSystems.map((system) => (
          <span key={system}>{system}</span>
        ))}
      </div>
      <p className="alkon-next-action">{command.nextAction}</p>
    </article>
  );
}
