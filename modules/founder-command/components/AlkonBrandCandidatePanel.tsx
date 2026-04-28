import type { BrandCandidate } from "@/lib/server/brand-clearance";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function AlkonBrandCandidatePanel({
  candidates,
}: {
  candidates: BrandCandidate[];
}) {
  return (
    <article className="tpm-founder-card alkon-brand-candidate-panel">
      <span>Candidate Names</span>
      <h3>{candidates.length} unchecked candidates prepared</h3>
      <p>
        Names are private review candidates only. No availability, trademark
        clearance, domain ownership, or public adoption is claimed.
      </p>
      <ul>
        {candidates.slice(0, 8).map((candidate) => (
          <li key={candidate.id}>
            <strong>{candidate.name}</strong>
            <small>
              {label(candidate.decision)} / {candidate.clearanceStatus ?? "unchecked"}
            </small>
          </li>
        ))}
      </ul>
    </article>
  );
}
