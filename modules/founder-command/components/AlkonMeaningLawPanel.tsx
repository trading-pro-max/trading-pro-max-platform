import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonMeaningLawPanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  const blocked = snapshot.lawDecisions.filter(
    (decision) =>
      decision.outcome === "black_hole" ||
      decision.outcome === "blocked" ||
      decision.outcome === "quarantined"
  );

  return (
    <section className="tpm-founder-subpanel alkon-consciousness-law">
      <span>Meaning / Law</span>
      <h3>Why it matters and what law applies</h3>
      <p>
        Meaning explains impact. Law applies Product Truth, Security, Legal,
        Guardian, Trust, Founder preferences, no-images, no-fake-claims, and
        public/private boundary rules.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Meaning categories</dt>
          <dd>{snapshot.meaningSummary.length}</dd>
        </div>
        <div>
          <dt>Blocked/quarantined</dt>
          <dd>{blocked.length}</dd>
        </div>
        <div>
          <dt>Secrets exposed</dt>
          <dd>{String(!snapshot.productTruthStatus.noSecretsExposed)}</dd>
        </div>
      </div>
      <ul>
        {snapshot.lawDecisions.slice(0, 4).map((decision) => (
          <li key={decision.signalId}>
            {decision.outcome}: {decision.safeAlternative}
          </li>
        ))}
      </ul>
    </section>
  );
}
