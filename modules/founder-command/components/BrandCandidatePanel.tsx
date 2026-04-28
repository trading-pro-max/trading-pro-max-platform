import type { BrandCandidate } from "@/lib/server/brand-clearance";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function BrandCandidatePanel({
  candidates,
}: {
  candidates: BrandCandidate[];
}) {
  return (
    <article className="tpm-founder-card brand-candidate-panel">
      <span>Candidate Status</span>
      <h3>{candidates.length > 0 ? "Shortlist ready for review" : "No final name adopted"}</h3>
      <p>
        Candidate names can be evaluated, but none becomes the global public brand until
        search, legal review, and Ahmad approval pass.
      </p>
      <small>
        Current candidate count: {candidates.length}. Decision state:{" "}
        {candidates[0] ? label(candidates[0].decision) : "awaiting candidate intake"}.
      </small>
    </article>
  );
}
