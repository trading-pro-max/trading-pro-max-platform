import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonRealityTrialPanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-reality-trial"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Reality Trial"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Commands 3-4</span>
        <h2>{snapshot.realityTrial.outcome}</h2>
        <p>
          Reality Trial admits work only after code, tests, visual acceptance,
          human value, Product Truth, safety, law, finance, evidence, memory,
          and Founder approval.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Missing trial proof</span>
          <strong>{snapshot.realityTrial.missing.length}</strong>
          <small>Reality has veto power</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Evidence</span>
          <strong>{snapshot.evidenceChain.evidenceStatus}</strong>
          <small>{snapshot.evidenceChain.missingEvidence.length} missing</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Closure allowed</span>
          <strong>{String(snapshot.evidenceChain.closureAllowed)}</strong>
          <small>Dirty Git blocks closure</small>
        </div>
      </div>
    </section>
  );
}
