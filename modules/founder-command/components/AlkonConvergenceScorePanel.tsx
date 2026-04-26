import type { FinalConvergenceSnapshot } from "@/lib/server/final-convergence";

export default function AlkonConvergenceScorePanel({
  snapshot,
}: {
  snapshot: FinalConvergenceSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-convergence-score">
      <span>Convergence Score</span>
      <h3>{snapshot.convergenceScore.status}</h3>
      <p>
        The score is an operating readiness estimate, not a launch claim and
        not a fake 10/10. Ahmad visual acceptance, audit, cleanup, and launch
        gates remain separate.
      </p>
      <div className="alkon-universe-map alkon-score-map">
        {snapshot.convergenceScore.items.map((item) => (
          <article key={item.area} data-status={item.status}>
            <span>{item.area.replaceAll("_", " ")}</span>
            <strong>{item.score}/10</strong>
            <p>{item.evidence}</p>
            <small>{item.nextSafeAction}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
