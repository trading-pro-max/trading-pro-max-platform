import type { FinalConvergenceSnapshot } from "@/lib/server/final-convergence";

export default function AlkonLayerGrowthPanel({
  snapshot,
}: {
  snapshot: FinalConvergenceSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-layer-growth">
      <span>Infinite Governed Layer Growth</span>
      <h3>Detection, drafting, validation, and memory under Founder authority</h3>
      <p>
        The product may keep discovering gaps and proposing next layers, but
        each proposal needs an owner, risk, validation, memory rule, and
        boundary. Unsafe escalation is blocked.
      </p>
      <div className="alkon-domain-list">
        {snapshot.layerGrowth.proposals.map((proposal) => (
          <div key={proposal.proposalId}>
            <small>{proposal.decision}</small>
            <strong>{proposal.title}</strong>
            <p>{proposal.purpose}</p>
            <p className="alkon-next-action">{proposal.safeNextAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
