import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonMemoryEvolutionPanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-consciousness-memory">
      <span>Remember / Evolve</span>
      <h3>Lessons become future guards</h3>
      <p>
        Memory stores safe lessons only. Evolve turns repeated mistakes into
        future guardrails under Founder authority; it never self-executes.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Lessons</dt>
          <dd>{snapshot.memoryLessons.length}</dd>
        </div>
        <div>
          <dt>Evolution rules</dt>
          <dd>{snapshot.evolutionRules.length}</dd>
        </div>
        <div>
          <dt>Uncontrolled autonomy</dt>
          <dd>{String(!snapshot.doctrine.noUncontrolledAutonomy)}</dd>
        </div>
      </div>
      <div className="alkon-command-tags">
        {snapshot.evolutionRules.slice(0, 6).map((rule) => (
          <span key={rule.ruleId}>{rule.futureGuard}</span>
        ))}
      </div>
    </section>
  );
}
