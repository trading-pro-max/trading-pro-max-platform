import type { AlkonOntologySnapshot } from "@/lib/server/alkon-ontology";

export default function AlkonOntologyPanel({
  snapshot,
}: {
  snapshot: AlkonOntologySnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-ontology-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon ontology existence system"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Ontology & Existence System</span>
        <h2>Every entity has a reason to exist</h2>
        <p>
          The private ontology layer gives pages, APIs, components, features,
          risks, workers, memory, tests, and launch gates meaning, ownership,
          lifecycle, relationships, risk, validation, memory, report target, and
          stay/removal law.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.ontologyStatus}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Entities</span>
          <strong>{snapshot.entityCount}</strong>
          <small>
            {snapshot.publicEntityCount} public / {snapshot.privateEntityCount} private /{" "}
            {snapshot.invisibleEntityCount} invisible
          </small>
        </div>
        <div className="tpm-founder-metric">
          <span>Complete</span>
          <strong>{snapshot.completeEntities}</strong>
          <small>{snapshot.partialEntities} need review</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>Entity graph stays private</small>
        </div>
      </div>
    </section>
  );
}
