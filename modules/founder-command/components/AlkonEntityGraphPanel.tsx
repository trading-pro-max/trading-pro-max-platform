import type { AlkonOntologySnapshot } from "@/lib/server/alkon-ontology";

export default function AlkonEntityGraphPanel({
  snapshot,
}: {
  snapshot: AlkonOntologySnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-ontology-graph">
      <span>Entity Graph</span>
      <h3>Relationships, dependencies, and boundaries</h3>
      <p>
        The graph tracks dependencies, dependents, owners, reports, validation,
        memory, risk, and public/private boundary status.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Nodes</dt>
          <dd>{snapshot.relationshipGraph.nodes.length}</dd>
        </div>
        <div>
          <dt>Missing deps</dt>
          <dd>{snapshot.relationshipGraph.missingDependencies.length}</dd>
        </div>
        <div>
          <dt>Boundary risks</dt>
          <dd>{snapshot.relationshipGraph.publicPrivateBoundaryRisks.length}</dd>
        </div>
        <div>
          <dt>Orphaned</dt>
          <dd>{snapshot.relationshipGraph.orphanedEntities.length}</dd>
        </div>
      </div>
    </section>
  );
}
