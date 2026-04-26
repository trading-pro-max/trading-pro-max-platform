import type { AlkonOntologySnapshot } from "@/lib/server/alkon-ontology";

export default function AlkonCleanupCandidatesPanel({
  snapshot,
}: {
  snapshot: AlkonOntologySnapshot;
}) {
  const cleanup = [
    ...snapshot.cleanupPriorities.P0.map((entityId) => ({ entityId, priority: "P0" })),
    ...snapshot.cleanupPriorities.P1.map((entityId) => ({ entityId, priority: "P1" })),
    ...snapshot.cleanupPriorities.P2.map((entityId) => ({ entityId, priority: "P2" })),
  ];

  return (
    <section className="tpm-founder-subpanel alkon-ontology-cleanup">
      <span>Cleanup Candidates</span>
      <h3>Improve, deprecate, archive, or keep with reason</h3>
      <p>
        Cleanup is review-only. The web app never deletes entities, weakens
        Product Truth, removes security, or changes public boundaries.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>P0</dt>
          <dd>{snapshot.cleanupPriorities.P0.length}</dd>
        </div>
        <div>
          <dt>P1</dt>
          <dd>{snapshot.cleanupPriorities.P1.length}</dd>
        </div>
        <div>
          <dt>P2</dt>
          <dd>{snapshot.cleanupPriorities.P2.length}</dd>
        </div>
      </div>
      <div className="alkon-command-tags">
        {cleanup.slice(0, 8).map((item) => (
          <span key={`${item.priority}-${item.entityId}`}>
            {item.priority}: {item.entityId}
          </span>
        ))}
      </div>
    </section>
  );
}
