import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function AlkonBrandRiskPanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  const proMax = snapshot.currentNames.find((candidate) => candidate.name === "Pro Max");

  return (
    <article className="tpm-founder-card alkon-brand-risk-panel">
      <span>Pro Max Risk</span>
      <h3>{proMax ? label(proMax.useStatus) : "working name only"}</h3>
      <p>
        Pro Max is not globally cleared as the final exclusive public brand.
        Global launch stays blocked until clearance closes.
      </p>
      <small>
        Risk: {proMax?.riskLevel ?? "high"} / launch blocked:{" "}
        {String(snapshot.launchBlockedByBrandGate)}
      </small>
    </article>
  );
}
