import type { ExistenceSnapshot } from "@/lib/server/existence-architecture";

export default function AlkonExistenceArchitecturePanel({
  snapshot,
}: {
  snapshot: ExistenceSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-existence-architecture-panel"
      data-founder-private="true"
      data-permission-to-exist="true"
      data-no-public-exposure={String(snapshot.noPublicExposure)}
      aria-label="Alkon Permission-to-Exist architecture"
    >
      <div className="tpm-founder-panel-head">
        <span>Permission-to-Exist</span>
        <h2>Structure is permission to exist</h2>
        <p>
          Every folder, file, route, API, component, CSS layer, report, test,
          tool, asset, visual surface, and future idea must prove owner, purpose,
          visibility, boundary, evidence, lifecycle, and next fate before it can grow.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>Active with notes</strong>
          <small>Founder-only, read-only, preview-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Entities reviewed</span>
          <strong>{snapshot.totalEntitiesReviewed}</strong>
          <small>Desktop, codebase, routes, APIs, components, CSS</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Route health</span>
          <strong>{snapshot.routeHealth.replaceAll("_", " ")}</strong>
          <small>/trading canonical, /en compatibility</small>
        </div>
        <div className="tpm-founder-metric">
          <span>API boundary</span>
          <strong>{snapshot.apiBoundaryHealth.replaceAll("_", " ")}</strong>
          <small>No shell, Codex, payments, or secrets</small>
        </div>
      </div>
    </section>
  );
}
