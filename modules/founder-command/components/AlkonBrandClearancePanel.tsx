import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";
import AlkonBrandCandidatePanel from "./AlkonBrandCandidatePanel";
import AlkonBrandRiskPanel from "./AlkonBrandRiskPanel";
import BrandAdoptionGatePanel from "./BrandAdoptionGatePanel";
import BrandSearchTasksPanel from "./BrandSearchTasksPanel";

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function AlkonBrandClearancePanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  const proMax = snapshot.currentNames.find((candidate) => candidate.name === "Pro Max");

  return (
    <section
      className="tpm-founder-panel alkon-global-brand-gate-panel alkon-brand-clearance-panel"
      data-founder-private="true"
      data-global-brand-gate="active"
      data-final-brand-approved={String(snapshot.finalBrandApproved)}
      data-launch-blocked-by-brand-gate={String(snapshot.launchBlockedByBrandGate)}
      data-public-route-exposed="false"
      data-no-external-calls={String(snapshot.noExternalCalls)}
      data-no-domain-purchase={String(snapshot.noDomainPurchase)}
      aria-label="Global Exclusive Brand Gate"
    >
      <div className="tpm-founder-panel-head">
        <span>Global Exclusive Brand Gate</span>
        <h2>Public launch waits for brand clearance</h2>
        <p>
          Pro Max remains a working name. No final global public brand is adopted
          until trademark, domain, conflict, class, legal, and Ahmad approval gates pass.
          Alkon remains private.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Pro Max</span>
          <strong>{proMax ? label(proMax.useStatus) : "working name only"}</strong>
          <small>{proMax?.riskLevel ?? "high"} risk</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Global brand gate</span>
          <strong>{snapshot.launchBlockedByBrandGate ? "Launch blocked" : "Review required"}</strong>
          <small>Final brand approved: {String(snapshot.finalBrandApproved)}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Candidates</span>
          <strong>{snapshot.candidateShortlist.length}</strong>
          <small>Unchecked; private review only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Next action</span>
          <strong>{snapshot.oneNextAction.owner} review</strong>
          <small>{snapshot.oneNextAction.action}</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-global-brand-gate-grid">
        <AlkonBrandCandidatePanel candidates={snapshot.candidateShortlist} />
        <AlkonBrandRiskPanel snapshot={snapshot} />
        <BrandSearchTasksPanel snapshot={snapshot} />
        <BrandAdoptionGatePanel snapshot={snapshot} />
      </div>
    </section>
  );
}
