import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonEarthCommandPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const command = snapshot.earthPublicWorld;

  return (
    <article className="tpm-founder-subpanel alkon-earth-command">
      <span>{command.name}</span>
      <h3>{command.symbolicRole}</h3>
      <p>{command.readiness}</p>
      <dl className="alkon-command-facts">
        <div>
          <dt>Status</dt>
          <dd>{command.status}</dd>
        </div>
        <div>
          <dt>Public visible</dt>
          <dd>{String(command.publicVisible)}</dd>
        </div>
      </dl>
      <ul>
        {command.linkedSystems.map((system) => (
          <li key={system}>{system}</li>
        ))}
      </ul>
      <p className="alkon-next-action">{command.nextAction}</p>
    </article>
  );
}
