import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";
import BrandAdoptionGatePanel from "./BrandAdoptionGatePanel";
import BrandCandidatePanel from "./BrandCandidatePanel";
import BrandRiskPanel from "./BrandRiskPanel";
import BrandSearchTasksPanel from "./BrandSearchTasksPanel";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function AlkonGlobalBrandGatePanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  const proMax = snapshot.currentNames.find((candidate) => candidate.name === "Pro Max");
  const alkon = snapshot.currentNames.find((candidate) => candidate.name === "Alkon");

  return (
    <section
      className="tpm-founder-panel alkon-global-brand-gate-panel"
      data-founder-private="true"
      data-global-brand-gate="active"
      data-public-route-exposed="false"
      data-no-external-calls={String(snapshot.noExternalCalls)}
      data-no-domain-purchase={String(snapshot.noDomainPurchase)}
      aria-label="Global Exclusive Brand Gate"
    >
      <div className="tpm-founder-panel-head">
        <span>Global Exclusive Brand Gate</span>
        <h2>Public launch waits for brand clearance</h2>
        <p>
          Pro Max remains a working name. Alkon remains private. No final global
          public brand is adopted until trademark, domain, conflict, language,
          legal, and Ahmad approval gates pass.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Pro Max</span>
          <strong>{proMax ? label(proMax.useStatus) : "review required"}</strong>
          <small>{proMax?.riskLabel ?? proMax?.riskLevel ?? "unknown"} risk</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Alkon</span>
          <strong>{alkon ? label(alkon.useStatus) : "private review"}</strong>
          <small>Public use forbidden until cleared</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Search tasks</span>
          <strong>{snapshot.trademarkSearchTasks.length + snapshot.domainSearchTasks.length}</strong>
          <small>Manual only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Next safe action</span>
          <strong>Ahmad review</strong>
          <small>{snapshot.nextSafeBrandAction}</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-global-brand-gate-grid">
        <BrandCandidatePanel candidates={snapshot.candidateShortlist} />
        <BrandRiskPanel snapshot={snapshot} />
        <BrandSearchTasksPanel snapshot={snapshot} />
        <BrandAdoptionGatePanel snapshot={snapshot} />
      </div>
    </section>
  );
}
