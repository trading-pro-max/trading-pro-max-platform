import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonUniverseMap({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  return (
    <div className="alkon-universe-map" aria-label="Alkon universe map">
      {snapshot.universeMap.map((system) => (
        <article key={system.id} data-status={system.status}>
          <span>{system.name}</span>
          <strong>{system.status}</strong>
          <p>{system.symbolicRole}</p>
          <small>{system.nextAction}</small>
        </article>
      ))}
    </div>
  );
}
