import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonDefenseUniversePanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const command = snapshot.defenseUniverse;

  return (
    <article className="tpm-founder-subpanel alkon-defense-universe">
      <span>{command.name}</span>
      <h3>{command.symbolicRole}</h3>
      <p>{command.readiness}</p>
      <dl className="alkon-command-facts">
        <div>
          <dt>Risk</dt>
          <dd>{command.riskLevel}</dd>
        </div>
        <div>
          <dt>Founder visible</dt>
          <dd>{String(command.founderVisible)}</dd>
        </div>
      </dl>
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
