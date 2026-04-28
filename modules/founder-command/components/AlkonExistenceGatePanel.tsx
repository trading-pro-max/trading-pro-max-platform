import type { ExistenceSnapshot } from "@/lib/server/existence-architecture";

export default function AlkonExistenceGatePanel({
  snapshot,
}: {
  snapshot: ExistenceSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-existence-gate-panel"
      data-founder-private="true"
      data-existence-gate="true"
      aria-label="Alkon existence gate"
    >
      <div className="tpm-founder-panel-head">
        <span>Existence Gate</span>
        <h2>Allowed only after proof</h2>
        <p>
          An entity is allowed only after purpose, owner, visibility, safe boundary,
          evidence or documented reason, lifecycle, and next fate are known.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Unknowns</span>
          <strong>{snapshot.unknownEntities.length}</strong>
          <small>Must enter Jar or Inbox before action</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Blocked patterns</span>
          <strong>{snapshot.blockedEntities.length}</strong>
          <small>Public leaks and unsafe APIs remain blocked</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Cleanup candidates</span>
          <strong>{snapshot.cleanupCandidates.length}</strong>
          <small>Documented before deletion</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Protected</span>
          <strong>{snapshot.protectedEntities.length}</strong>
          <small>Do not move or delete casually</small>
        </div>
      </div>

      <article className="tpm-founder-card">
        <span>One Next Structural Action</span>
        <h3>{snapshot.oneNextStructuralAction}</h3>
        <small>{snapshot.whatNotToDo[0]}</small>
      </article>
    </section>
  );
}
