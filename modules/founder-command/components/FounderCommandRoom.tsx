import {
  getFounderCommandAppSnapshot,
  getFounderCommandRoomFoundationSnapshot,
} from "@/lib/server/founder-command";
import { getFounderIdeaInboxReadiness } from "@/lib/server/sovereign-autonomy";
import TPMEarthMark from "@/modules/brand/components/TPMEarthMark";
import ProductLogo from "@/modules/brand/components/ProductLogo";
import { PlanetMapPreview } from "@/modules/planet-map/components";
import type { FounderCommandRoomProps } from "../types";
import FounderApprovalQueue from "./FounderApprovalQueue";
import FounderCommandAppShell from "./FounderCommandAppShell";
import FounderIdeaInbox from "./FounderIdeaInbox";
import FounderLocalCommandShell from "./FounderLocalCommandShell";
import FounderMinistryGrid from "./FounderMinistryGrid";
import FounderAutonomyQueuePanel from "./FounderAutonomyQueuePanel";
import FounderNextBuildPanel from "./FounderNextBuildPanel";
import FounderOperatingLoopPanel from "./FounderOperatingLoopPanel";
import FounderPlanetCommandWorld from "./FounderPlanetCommandWorld";
import FounderPlanetMemoryPanel from "./FounderPlanetMemoryPanel";
import FounderPlanetOverview from "./FounderPlanetOverview";
import FounderPlanetStatusMap from "./FounderPlanetStatusMap";
import FounderRiskPanel from "./FounderRiskPanel";
import FounderSovereignAutonomyPanel from "./FounderSovereignAutonomyPanel";

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function FounderCommandRoom({
  snapshot,
  className,
}: FounderCommandRoomProps) {
  const commandSnapshot = snapshot ?? getFounderCommandRoomFoundationSnapshot();
  const appSnapshot = getFounderCommandAppSnapshot(commandSnapshot.checkedAt);
  const ideaInboxReadiness = getFounderIdeaInboxReadiness(commandSnapshot.checkedAt);

  return (
    <main
      className={classNames("tpm-founder-command-room", className)}
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Founder Command Room foundation"
    >
      <header className="tpm-founder-hero">
        <div className="tpm-founder-logo-stack">
          <TPMEarthMark
            animated
            motionIntensity="medium"
            state="local_only"
            surface="founder_command"
            variant="command"
          />
          <ProductLogo
            className="tpm-founder-logo"
            motionIntensity="medium"
            state="local_only"
            surface="founder_command"
            subtitle="Private Founder Command"
            variant="command"
          />
        </div>
        <div>
          <span>TPM Planet Command</span>
          <h1>Founder King Command Room Foundation</h1>
          <p>
            A private, read-only command surface for observing Planet OS
            readiness, ministries, risks, approvals, and product truth. It is
            not a public feature and does not activate any capability.
          </p>
        </div>
        <div className="tpm-founder-access-card">
          <span>Access</span>
          <strong>Owner-only planned</strong>
          <small>{commandSnapshot.access.exposureDecision}</small>
        </div>
      </header>

      <PlanetMapPreview audience="founder" />

      <FounderPlanetCommandWorld checkedAt={commandSnapshot.checkedAt} />

      <FounderPlanetStatusMap checkedAt={commandSnapshot.checkedAt} />

      <FounderCommandAppShell checkedAt={commandSnapshot.checkedAt} />

      <FounderLocalCommandShell checkedAt={commandSnapshot.checkedAt} />

      <FounderOperatingLoopPanel checkedAt={commandSnapshot.checkedAt} />

      <FounderSovereignAutonomyPanel checkedAt={commandSnapshot.checkedAt} />

      <FounderIdeaInbox readiness={ideaInboxReadiness} />

      <FounderAutonomyQueuePanel checkedAt={commandSnapshot.checkedAt} />

      <FounderPlanetMemoryPanel checkedAt={commandSnapshot.checkedAt} />

      <FounderNextBuildPanel checkedAt={commandSnapshot.checkedAt} />

      <section className="tpm-founder-panel">
        <div className="tpm-founder-panel-head">
          <span>Command App Architecture</span>
          <h2>Desktop and mobile foundation</h2>
          <p>
            Owner-only command app readiness. No native app is shipped, no public
            route is exposed, and approval execution remains inactive.
          </p>
        </div>
        <div className="tpm-founder-metrics">
          <div className="tpm-founder-metric">
            <span>Modules</span>
            <strong>{appSnapshot.moduleSummary.total}</strong>
            <small>{appSnapshot.moduleSummary.mobileFriendlyModules} mobile-friendly</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Desktop app</span>
            <strong>{appSnapshot.desktopApp.currentState}</strong>
            <small>{appSnapshot.desktopApp.primaryScreens.slice(0, 3).join(" / ")}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Mobile app</span>
            <strong>{appSnapshot.mobileApp.currentState}</strong>
            <small>{appSnapshot.mobileApp.primaryScreens.slice(0, 3).join(" / ")}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Execution</span>
            <strong>{String(appSnapshot.approvalCenter.executionActive)}</strong>
            <small>Read-only until owner auth and audit gates exist</small>
          </div>
        </div>
      </section>

      <FounderPlanetOverview snapshot={commandSnapshot} />
      <FounderMinistryGrid ministries={commandSnapshot.ministries} />

      <section className="tpm-founder-briefing-panel">
        <div className="tpm-founder-panel-head">
          <span>Daily Briefing</span>
          <h2>Readiness without fake metrics</h2>
          <p>
            The briefing is built from deterministic reporting contracts and
            avoids users, revenue, followers, private data, or secrets.
          </p>
        </div>

        <div className="tpm-founder-briefing-grid">
          <article>
            <h3>Top risks</h3>
            <ul>
              {commandSnapshot.briefing.topRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Blocked / degraded ministries</h3>
            <ul>
              {commandSnapshot.briefing.blockedOrDegraded.map((ministry) => (
                <li key={ministry}>{ministry}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Approvals needed</h3>
            <ul>
              {commandSnapshot.briefing.approvalsNeeded.map((approval) => (
                <li key={approval}>{approval}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Product gaps</h3>
            <ul>
              {commandSnapshot.briefing.productGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Founder Companion</h3>
            <ul>
              {commandSnapshot.founderCompanion.priorityBriefing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Next safe decisions</h3>
            <ul>
              {commandSnapshot.founderCompanion.nextSafeDecisions.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Guardian / Legal warnings</h3>
            <ul>
              {[
                ...commandSnapshot.founderCompanion.guardianSummary,
                ...commandSnapshot.founderCompanion.legalSummary,
              ]
                .slice(0, 5)
                .map((item) => (
                  <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Opportunities</h3>
            <ul>
              {commandSnapshot.founderCompanion.opportunitySummary.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <h3>Attention needed</h3>
            <ul>
              {commandSnapshot.founderCompanion.ministriesNeedingAttention.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <FounderApprovalQueue approvalQueue={commandSnapshot.approvalQueue} />
      <FounderRiskPanel snapshot={commandSnapshot} />
    </main>
  );
}
