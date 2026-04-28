import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function BrandRiskPanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  return (
    <article className="tpm-founder-card brand-risk-panel">
      <span>Brand Risk</span>
      <h3>{label(snapshot.conflictRisk.level)} conflict risk</h3>
      <p>{snapshot.conflictRisk.reasons[0]}</p>
      <small>
        Review families: {snapshot.conflictRisk.majorConflictFamilies.join(" / ")}
      </small>
    </article>
  );
}
