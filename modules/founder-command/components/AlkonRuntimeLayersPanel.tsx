import type { AlkonRuntimeSnapshot } from "@/lib/server/alkon-runtime";

export default function AlkonRuntimeLayersPanel({
  snapshot,
}: {
  snapshot: AlkonRuntimeSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-owner-only="true">
      <div className="tpm-founder-panel-head">
        <span>Runtime Layers</span>
        <h2>Layer readiness</h2>
        <p>
          Each runtime layer stays deterministic, private, read-only, and
          Product Truth guarded.
        </p>
      </div>
      <div className="tpm-founder-metrics">
        {Object.entries(snapshot.layerStatuses).map(([layer, status]) => (
          <div className="tpm-founder-metric" key={layer}>
            <span>{layer}</span>
            <strong>{status}</strong>
            <small>runtime layer</small>
          </div>
        ))}
      </div>
    </section>
  );
}
