import { getFounderBuildRoomSnapshot } from "@/lib/server/founder-command";
import TPMEarthMark from "@/modules/brand/components/TPMEarthMark";
import FounderBuildGapPanel from "./FounderBuildGapPanel";
import FounderBuildNextActionsPanel from "./FounderBuildNextActionsPanel";
import FounderBuildStatusPanel from "./FounderBuildStatusPanel";
import FounderBuildValidationPanel from "./FounderBuildValidationPanel";
import FounderCodexDraftPanel from "./FounderCodexDraftPanel";

type FounderBuildRoomProps = {
  checkedAt?: string;
};

export default function FounderBuildRoom({ checkedAt }: FounderBuildRoomProps) {
  const snapshot = getFounderBuildRoomSnapshot(checkedAt);

  return (
    <section
      className="tpm-founder-local-shell"
      data-owner-only="true"
      data-local-only="true"
      data-public-route-exposed="false"
      data-draft-only="true"
      aria-label="Founder Command Build Room"
    >
      <header className="tpm-founder-local-hero">
        <TPMEarthMark
          animated
          className="tpm-founder-local-mark"
          motionIntensity="medium"
          size={72}
          state="review_required"
          surface="founder_command"
          title="Pro Max Trading build room mark"
          variant="command"
        />
        <div>
          <span>Founder Command Build Room</span>
          <h1>Local platform construction room</h1>
          <p>
            Private local build-command surface for observing readiness,
            finding gaps, preparing Codex-ready tasks, and deciding the next
            safe build step. It is draft-only and cannot execute approvals.
          </p>
        </div>
        <aside>
          <span>Route</span>
          <strong>
            {snapshot.routeExposure.hiddenRouteCreated ? "hidden route" : "API only"}
          </strong>
          <small>No public nav, no user-plan exposure.</small>
        </aside>
      </header>

      <section className="tpm-founder-local-status-grid">
        <div>
          <span>Drafts</span>
          <strong>{snapshot.codexTaskDrafts.length}</strong>
        </div>
        <div>
          <span>Queue</span>
          <strong>{snapshot.constructionQueueStatus.total}</strong>
        </div>
        <div>
          <span>Memory domains</span>
          <strong>{snapshot.memoryStatus.domainCount}</strong>
        </div>
        <div>
          <span>Automation</span>
          <strong>
            {snapshot.truth.noAutomaticCodexSending ? "manual only" : "review"}
          </strong>
        </div>
      </section>

      <section className="tpm-founder-local-grid">
        <FounderBuildStatusPanel snapshot={snapshot} />
        <FounderBuildGapPanel snapshot={snapshot} />
        <section className="tpm-founder-local-panel">
          <header>
            <span>Surface status</span>
            <h3>Where construction starts</h3>
          </header>
          <div className="tpm-founder-local-mini-grid">
            <div>
              <span>Chart</span>
              <strong>{snapshot.chartStatus}</strong>
            </div>
            <div>
              <span>Workspace</span>
              <strong>{snapshot.workstationStatus}</strong>
            </div>
            <div>
              <span>Diagnostics</span>
              <strong>{snapshot.diagnosticsStatus}</strong>
            </div>
          </div>
        </section>
        <section className="tpm-founder-local-panel">
          <header>
            <span>Memory / Queue</span>
            <h3>Local construction memory</h3>
          </header>
          <div className="tpm-founder-local-mini-grid">
            <div>
              <span>Open gaps</span>
              <strong>{snapshot.memoryStatus.openProductGaps}</strong>
            </div>
            <div>
              <span>Blocked queue</span>
              <strong>{snapshot.constructionQueueStatus.blocked}</strong>
            </div>
            <div>
              <span>Secrets</span>
              <strong>{snapshot.memoryStatus.secretsStored ? "review" : "blocked"}</strong>
            </div>
          </div>
        </section>
        <FounderCodexDraftPanel snapshot={snapshot} />
        <FounderBuildValidationPanel snapshot={snapshot} />
        <FounderBuildNextActionsPanel snapshot={snapshot} />
      </section>
    </section>
  );
}
