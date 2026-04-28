import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function BrandAdoptionGatePanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  return (
    <article className="tpm-founder-card brand-adoption-gate-panel">
      <span>Adoption Gate</span>
      <h3>{label(snapshot.adoptionGate.adoptionStatus)}</h3>
      <p>{snapshot.adoptionGate.nextAction}</p>
      <small>Blockers: {snapshot.adoptionGate.blockers.length}</small>
    </article>
  );
}
