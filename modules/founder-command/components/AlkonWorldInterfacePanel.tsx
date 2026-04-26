import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonWorldInterfacePanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const command = snapshot.worldInterface;

  return (
    <article className="tpm-founder-subpanel alkon-world-interface">
      <span>{command.name}</span>
      <h3>{command.symbolicRole}</h3>
      <p>{command.readiness}</p>
      <div className="alkon-domain-list">
        {command.domains.map((domain) => (
          <div key={domain.label}>
            <strong>{domain.label}</strong>
            <small>{domain.status}</small>
            <p>{domain.detail}</p>
          </div>
        ))}
      </div>
      <p className="alkon-next-action">{command.nextAction}</p>
    </article>
  );
}
