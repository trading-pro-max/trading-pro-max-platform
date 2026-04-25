import { getFounderLocalCommandSnapshot } from "@/lib/server/founder-command";
import TPMEarthMark from "@/modules/brand/components/TPMEarthMark";
import FounderConstructionQueuePanel from "./FounderConstructionQueuePanel";
import FounderGapPanel from "./FounderGapPanel";
import FounderLocalBriefingPanel from "./FounderLocalBriefingPanel";
import FounderLocalOperationsPanel from "./FounderLocalOperationsPanel";
import FounderMemoryPanel from "./FounderMemoryPanel";
import FounderNextActionsPanel from "./FounderNextActionsPanel";
import FounderValidationPanel from "./FounderValidationPanel";

type FounderLocalCommandShellProps = {
  checkedAt?: string;
};

export default function FounderLocalCommandShell({
  checkedAt,
}: FounderLocalCommandShellProps) {
  const snapshot = getFounderLocalCommandSnapshot(checkedAt);

  return (
    <section
      className="tpm-founder-local-shell"
      data-owner-only="true"
      data-local-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Founder Command Local App Shell"
    >
      <header className="tpm-founder-local-hero">
        <TPMEarthMark
          className="tpm-founder-local-mark"
          size={72}
          title="Trading Pro Max local command mark"
          variant="command"
        />
        <div>
          <span>Founder Command Local App Shell</span>
          <h1>Local owner command center</h1>
          <p>
            Private read-only local command surface for operating Trading Pro Max before
            any global activation. It reports readiness, queues, gaps, memory, local
            operations, and safe next actions without executing approvals.
          </p>
        </div>
        <aside>
          <span>Access</span>
          <strong>{snapshot.access.currentState.replaceAll("_", " ")}</strong>
          <small>No public nav, no user-plan access.</small>
        </aside>
      </header>

      <section className="tpm-founder-local-status-grid">
        <div>
          <span>Local stages</span>
          <strong>{snapshot.localOperations.dayCycle.totalStages}</strong>
        </div>
        <div>
          <span>Memory domains</span>
          <strong>{snapshot.productMemory.domainSummary.length}</strong>
        </div>
        <div>
          <span>Queue items</span>
          <strong>{snapshot.constructionQueue.summary.total}</strong>
        </div>
        <div>
          <span>Approval execution</span>
          <strong>{snapshot.truth.approvalExecution}</strong>
        </div>
      </section>

      <section className="tpm-founder-local-grid">
        <FounderLocalBriefingPanel snapshot={snapshot} />
        <FounderLocalOperationsPanel snapshot={snapshot} />
        <FounderConstructionQueuePanel snapshot={snapshot} />
        <FounderMemoryPanel snapshot={snapshot} />
        <FounderGapPanel snapshot={snapshot} />
        <FounderValidationPanel snapshot={snapshot} />
        <section className="tpm-founder-local-panel">
          <header>
            <span>Guardian / Legal</span>
            <h3>Warnings and hard blocks</h3>
          </header>
          <ul>
            {snapshot.dailyBriefing.guardianLegal.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="tpm-founder-local-panel">
          <header>
            <span>Treasury / Media</span>
            <h3>Readiness only</h3>
          </header>
          <div className="tpm-founder-local-mini-grid">
            <div>
              <span>Billing</span>
              <strong>
                {snapshot.treasuryMedia.billingInactive ? "inactive" : "review"}
              </strong>
            </div>
            <div>
              <span>Social</span>
              <strong>
                {snapshot.treasuryMedia.socialPublishingInactive ? "inactive" : "review"}
              </strong>
            </div>
            <div>
              <span>Performance fee</span>
              <strong>
                {snapshot.treasuryMedia.performanceFeeHiddenInactive
                  ? "hidden inactive"
                  : "review"}
              </strong>
            </div>
          </div>
        </section>
        <FounderNextActionsPanel snapshot={snapshot} />
      </section>
    </section>
  );
}
