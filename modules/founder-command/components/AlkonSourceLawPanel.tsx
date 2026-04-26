import type { SourceLawSnapshot } from "@/lib/server/source-law";

export default function AlkonSourceLawPanel({
  snapshot,
}: {
  snapshot: SourceLawSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-source-law-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Sovereign Source Law"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Sovereign Source Law</span>
        <h2>Reason before action</h2>
        <p>
          Private source law that checks Ahmad vision, human value, truth,
          safety, proof, and one correct action before Alkon accepts any
          decision path.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Prime World</span>
          <strong>{snapshot.primeWorld}</strong>
          <small>{snapshot.primeWorldFocusStatus}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>No public doctrine</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Proof</span>
          <strong>{snapshot.proofStatus.proofStatus}</strong>
          <small>{snapshot.proofStatus.canClose ? "can close" : "needs evidence"}</small>
        </div>
      </div>
    </section>
  );
}
