import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonCreatorRuntimePanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-creator-runtime"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Creator Runtime Oath"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Command 0</span>
        <h2>Creator-runtime oath</h2>
        <p>{snapshot.creatorRuntimeOath.oath}</p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Oath</span>
          <strong>{snapshot.creatorRuntimeOath.oathStatus}</strong>
          <small>Private only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Execution</span>
          <strong>{String(!snapshot.creatorRuntimeOath.noExecutionByItself)}</strong>
          <small>No action by itself</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Unsafe activation</span>
          <strong>{String(snapshot.creatorRuntimeOath.unsafeActivationBlocked)}</strong>
          <small>Blocked</small>
        </div>
      </div>
    </section>
  );
}
