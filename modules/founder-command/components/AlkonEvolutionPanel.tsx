import type { AlkonContinuitySnapshot } from "@/lib/server/alkon-continuity";

export default function AlkonEvolutionPanel({
  snapshot,
}: {
  snapshot: AlkonContinuitySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Evolution</span>
        <h2>Memory becomes future guard</h2>
        <p>Repeated lessons strengthen future tests and Founder review gates.</p>
      </div>
      <div className="tpm-founder-mini-list">
        {snapshot.evolutionRules.slice(0, 5).map((rule) => (
          <div key={rule.entityId}>
            <span>{rule.requiredTest}</span>
            <strong>{rule.futureGuard}</strong>
            <small>{rule.evolutionRule}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
