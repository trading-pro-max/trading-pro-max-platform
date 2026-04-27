import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonKernelZeroTruthPanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-kernel-zero-truth"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Kernel Zero Truth"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Command 1</span>
        <h2>Zero Truth audit</h2>
        <p>
          Zero Truth reads current reality and blocks fake acceptance without
          deleting the project or resetting working systems.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.zeroTruth.zeroTruthStatus}</strong>
          <small>{snapshot.zeroTruth.blockers.length} blockers</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Findings</span>
          <strong>{snapshot.zeroTruth.findings.length}</strong>
          <small>No deletion</small>
        </div>
      </div>
      <ul className="alkon-physics-chain">
        {snapshot.zeroTruth.findings.slice(0, 5).map((finding) => (
          <li key={finding.findingId}>{finding.area}: {finding.status}</li>
        ))}
      </ul>
    </section>
  );
}
