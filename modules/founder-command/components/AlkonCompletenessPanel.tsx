import type { AlkonOntologySnapshot } from "@/lib/server/alkon-ontology";

export default function AlkonCompletenessPanel({
  snapshot,
}: {
  snapshot: AlkonOntologySnapshot;
}) {
  const incomplete = snapshot.completeness.filter(
    (entity) => entity.status !== "complete"
  );

  return (
    <section className="tpm-founder-subpanel alkon-ontology-completeness">
      <span>Completeness</span>
      <h3>Owner, validation, memory, report, and lifecycle checks</h3>
      <p>
        Completeness rejects ownerless, unvalidated, memoryless, orphaned, and
        cleanup-needed entities before they are treated as accepted.
      </p>
      <div className="tpm-founder-mini-list">
        {incomplete.slice(0, 5).map((entity) => (
          <div key={entity.entityId}>
            <span>{entity.status}</span>
            <strong>{entity.entityId}</strong>
            <small>{entity.recommendedAction}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
