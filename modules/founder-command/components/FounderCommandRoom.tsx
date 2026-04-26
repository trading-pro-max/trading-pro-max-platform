import {
  getFounderCommandAppSnapshot,
  getFounderCommandRoomFoundationSnapshot,
} from "@/lib/server/founder-command";
import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { getFounderIdeaInboxReadiness } from "@/lib/server/sovereign-autonomy";
import TPMEarthMark from "@/modules/brand/components/TPMEarthMark";
import ProductLogo from "@/modules/brand/components/ProductLogo";
import { PlanetMapPreview } from "@/modules/planet-map/components";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";
import type { FounderCommandRoomProps } from "../types";
import AlkonCommandUniverse from "./AlkonCommandUniverse";
import AlkonActionJudgmentPanel from "./AlkonActionJudgmentPanel";
import AlkonAutomationGovernorPanel from "./AlkonAutomationGovernorPanel";
import AlkonConsciousnessPanel from "./AlkonConsciousnessPanel";
import AlkonConvergenceScorePanel from "./AlkonConvergenceScorePanel";
import AlkonContinuityPanel from "./AlkonContinuityPanel";
import AlkonFinalConvergencePanel from "./AlkonFinalConvergencePanel";
import AlkonLayerGrowthPanel from "./AlkonLayerGrowthPanel";
import AlkonGravityRoutePanel from "./AlkonGravityRoutePanel";
import AlkonLegitimacyPanel from "./AlkonLegitimacyPanel";
import AlkonMeaningLawPanel from "./AlkonMeaningLawPanel";
import AlkonMediaRealityPanel from "./AlkonMediaRealityPanel";
import AlkonMemoryEvolutionPanel from "./AlkonMemoryEvolutionPanel";
import AlkonNextSafeLayersPanel from "./AlkonNextSafeLayersPanel";
import AlkonOntologyPanel from "./AlkonOntologyPanel";
import AlkonEntityGraphPanel from "./AlkonEntityGraphPanel";
import AlkonCompletenessPanel from "./AlkonCompletenessPanel";
import AlkonCleanupCandidatesPanel from "./AlkonCleanupCandidatesPanel";
import AlkonRuntimeConsequencesPanel from "./AlkonRuntimeConsequencesPanel";
import AlkonRuntimeFatePanel from "./AlkonRuntimeFatePanel";
import AlkonRuntimeLayersPanel from "./AlkonRuntimeLayersPanel";
import AlkonRuntimeMapPanel from "./AlkonRuntimeMapPanel";
import AlkonRuntimePanel from "./AlkonRuntimePanel";
import AlkonGrowthGatesPanel from "./AlkonGrowthGatesPanel";
import AlkonGrowthPermitPanel from "./AlkonGrowthPermitPanel";
import AlkonInfiniteGrowthPanel from "./AlkonInfiniteGrowthPanel";
import AlkonSwissLawGravityPanel from "./AlkonSwissLawGravityPanel";
import AlkonAbsoluteCompletionPanel from "./AlkonAbsoluteCompletionPanel";
import AlkonDestinyScorePanel from "./AlkonDestinyScorePanel";
import AlkonDriftDetectorPanel from "./AlkonDriftDetectorPanel";
import AlkonFounderEnergyPanel from "./AlkonFounderEnergyPanel";
import AlkonNorthStarPanel from "./AlkonNorthStarPanel";
import AlkonNumberOneDestinyPanel from "./AlkonNumberOneDestinyPanel";
import AlkonGenesisPanel from "./AlkonGenesisPanel";
import AlkonGenesisGatesPanel from "./AlkonGenesisGatesPanel";
import AlkonPrimeWorldPanel from "./AlkonPrimeWorldPanel";
import AlkonWorldBirthPermitPanel from "./AlkonWorldBirthPermitPanel";
import AlkonWorldSeedsPanel from "./AlkonWorldSeedsPanel";
import AlkonCleanupContinuityPanel from "./AlkonCleanupContinuityPanel";
import AlkonDeprecationPanel from "./AlkonDeprecationPanel";
import AlkonEntityBirthPanel from "./AlkonEntityBirthPanel";
import AlkonEvolutionPanel from "./AlkonEvolutionPanel";
import AlkonLifecyclePanel from "./AlkonLifecyclePanel";
import AlkonSignalSensePanel from "./AlkonSignalSensePanel";
import AlkonDecisionPermitPanel from "./AlkonDecisionPermitPanel";
import AlkonTreasuryLifePanel from "./AlkonTreasuryLifePanel";
import AlkonAuthorityFabricPanel from "./AlkonAuthorityFabricPanel";
import AlkonDeviceConstellationPanel from "./AlkonDeviceConstellationPanel";
import AlkonPocketUniversePanel from "./AlkonPocketUniversePanel";
import AlkonDeviceSecurityPanel from "./AlkonDeviceSecurityPanel";
import AlkonDeviceContinuityPanel from "./AlkonDeviceContinuityPanel";
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
  const deviceSnapshot = getFounderDeviceReadinessSnapshot(commandSnapshot.checkedAt);

  return (
    <PrivateFounderShell checkedAt={commandSnapshot.checkedAt}>
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

      <AlkonCommandUniverse checkedAt={commandSnapshot.checkedAt} />

      <AlkonLegitimacyPanel snapshot={appSnapshot.alkonLegitimacy} />

      <div className="alkon-command-grid alkon-legitimacy-grid">
        <AlkonDecisionPermitPanel snapshot={appSnapshot.alkonLegitimacy} />
        <AlkonTreasuryLifePanel snapshot={appSnapshot.treasuryLife} />
        <AlkonAuthorityFabricPanel snapshot={appSnapshot.alkonLegitimacy} />
        <AlkonMediaRealityPanel snapshot={appSnapshot.mediaIntelligence} />
      </div>

      <AlkonContinuityPanel snapshot={appSnapshot.alkonContinuity} />

      <div className="alkon-command-grid alkon-continuity-grid">
        <AlkonEntityBirthPanel snapshot={appSnapshot.alkonContinuity} />
        <AlkonLifecyclePanel snapshot={appSnapshot.alkonContinuity} />
        <AlkonEvolutionPanel snapshot={appSnapshot.alkonContinuity} />
        <AlkonDeprecationPanel snapshot={appSnapshot.alkonContinuity} />
        <AlkonCleanupContinuityPanel snapshot={appSnapshot.alkonContinuity} />
      </div>

      <AlkonRuntimePanel snapshot={appSnapshot.alkonRuntime} />

      <div className="alkon-command-grid alkon-runtime-grid">
        <AlkonRuntimeMapPanel snapshot={appSnapshot.alkonRuntime} />
        <AlkonRuntimeLayersPanel snapshot={appSnapshot.alkonRuntime} />
        <AlkonRuntimeFatePanel snapshot={appSnapshot.alkonRuntime} />
        <AlkonRuntimeConsequencesPanel snapshot={appSnapshot.alkonRuntime} />
      </div>

      <AlkonInfiniteGrowthPanel snapshot={appSnapshot.infiniteGrowth} />

      <div className="alkon-command-grid alkon-infinite-growth-grid">
        <AlkonSwissLawGravityPanel snapshot={appSnapshot.infiniteGrowth} />
        <AlkonGrowthGatesPanel snapshot={appSnapshot.infiniteGrowth} />
        <AlkonGrowthPermitPanel snapshot={appSnapshot.infiniteGrowth} />
      </div>

      <AlkonNumberOneDestinyPanel snapshot={appSnapshot.numberOneDestiny} />

      <div className="alkon-command-grid alkon-number-one-destiny-grid">
        <AlkonNorthStarPanel snapshot={appSnapshot.numberOneDestiny} />
        <AlkonDestinyScorePanel snapshot={appSnapshot.numberOneDestiny} />
        <AlkonDriftDetectorPanel snapshot={appSnapshot.numberOneDestiny} />
        <AlkonAbsoluteCompletionPanel snapshot={appSnapshot.numberOneDestiny} />
        <AlkonFounderEnergyPanel snapshot={appSnapshot.numberOneDestiny} />
      </div>

      <AlkonGenesisPanel snapshot={appSnapshot.alkonGenesis} />

      <div className="alkon-command-grid alkon-genesis-grid">
        <AlkonPrimeWorldPanel snapshot={appSnapshot.alkonGenesis} />
        <AlkonWorldSeedsPanel snapshot={appSnapshot.alkonGenesis} />
        <AlkonGenesisGatesPanel snapshot={appSnapshot.alkonGenesis} />
        <AlkonWorldBirthPermitPanel snapshot={appSnapshot.alkonGenesis} />
      </div>

      <AlkonOntologyPanel snapshot={appSnapshot.alkonOntology} />

      <div className="alkon-command-grid alkon-ontology-grid">
        <AlkonEntityGraphPanel snapshot={appSnapshot.alkonOntology} />
        <AlkonCompletenessPanel snapshot={appSnapshot.alkonOntology} />
        <AlkonCleanupCandidatesPanel snapshot={appSnapshot.alkonOntology} />
      </div>

      <AlkonConsciousnessPanel snapshot={appSnapshot.alkonSovereignConsciousness} />

      <div className="alkon-command-grid alkon-consciousness-grid">
        <AlkonSignalSensePanel snapshot={appSnapshot.alkonSovereignConsciousness} />
        <AlkonMeaningLawPanel snapshot={appSnapshot.alkonSovereignConsciousness} />
        <AlkonGravityRoutePanel snapshot={appSnapshot.alkonSovereignConsciousness} />
        <AlkonActionJudgmentPanel snapshot={appSnapshot.alkonSovereignConsciousness} />
        <AlkonMemoryEvolutionPanel snapshot={appSnapshot.alkonSovereignConsciousness} />
      </div>

      <AlkonFinalConvergencePanel snapshot={appSnapshot.finalConvergence} />

      <div className="alkon-command-grid alkon-final-convergence-grid">
        <AlkonLayerGrowthPanel snapshot={appSnapshot.finalConvergence} />
        <AlkonAutomationGovernorPanel snapshot={appSnapshot.finalConvergence} />
        <AlkonConvergenceScorePanel snapshot={appSnapshot.finalConvergence} />
        <AlkonNextSafeLayersPanel snapshot={appSnapshot.finalConvergence} />
      </div>

      <section className="tpm-founder-panel" data-private-environment-readiness="true">
        <div className="tpm-founder-panel-head">
          <span>TPM Planetary Environment Engine</span>
          <h2>Private environment readiness</h2>
          <p>
            Solar phase, Moon layer, weather readiness, market-session awareness,
            system weather, and surface intensity are read-only atmosphere signals.
            They do not execute trades, connect weather providers, or request
            precise location.
          </p>
        </div>
        <div className="tpm-founder-metrics">
          <div className="tpm-founder-metric">
            <span>Solar phase</span>
            <strong>{appSnapshot.planetaryEnvironment.solarPhase}</strong>
            <small>{appSnapshot.planetaryEnvironment.lunarLayer.readiness}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Weather readiness</span>
            <strong>{appSnapshot.planetaryEnvironment.weatherReadiness}</strong>
            <small>No external weather calls</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Workspace intensity</span>
            <strong>{appSnapshot.planetaryEnvironment.workspaceIntensity}</strong>
            <small>Chart remains first</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Privacy</span>
            <strong>No GPS</strong>
            <small>{appSnapshot.planetaryEnvironment.privacy}</small>
          </div>
        </div>
      </section>

      <section className="tpm-founder-panel" data-private-earth-personal-reality="true">
        <div className="tpm-founder-panel-head">
          <span>Earth Reality Constitution</span>
          <h2>Public Earth and Personal Reality readiness</h2>
          <p>
            Earth remains the public reference reality. Personal Operating
            Reality lets TPM Assistant translate user intent into allowed,
            plan-aware, Product Truth guarded settings without exposing Alkon or
            activating real-world systems.
          </p>
        </div>
        <div className="tpm-founder-metrics">
          <div className="tpm-founder-metric">
            <span>Earth score</span>
            <strong>{appSnapshot.earthReality.score}/10</strong>
            <small>{appSnapshot.earthReality.status}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Earth layers</span>
            <strong>{appSnapshot.earthReality.layerCount}</strong>
            <small>{appSnapshot.earthReality.publicPrivateBoundaryStatus}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Personal profiles</span>
            <strong>{appSnapshot.personalReality.publicProfiles}</strong>
            <small>
              {appSnapshot.personalReality.internalProfilesHidden} internal hidden
            </small>
          </div>
          <div className="tpm-founder-metric">
            <span>Free controls</span>
            <strong>{appSnapshot.personalReality.activeFreeControls.length}</strong>
            <small>Assistant-controlled and plan-aware</small>
          </div>
        </div>
      </section>

      <AlkonDeviceConstellationPanel snapshot={deviceSnapshot} />

      <div className="alkon-command-grid alkon-device-constellation-grid">
        <AlkonPocketUniversePanel snapshot={deviceSnapshot} />
        <AlkonDeviceSecurityPanel snapshot={deviceSnapshot} />
        <AlkonDeviceContinuityPanel snapshot={deviceSnapshot} />
      </div>

      <FounderPlanetStatusMap checkedAt={commandSnapshot.checkedAt} />

      <FounderCommandAppShell checkedAt={commandSnapshot.checkedAt} />

      <FounderLocalCommandShell checkedAt={commandSnapshot.checkedAt} />

      <FounderOperatingLoopPanel checkedAt={commandSnapshot.checkedAt} />

      <FounderSovereignAutonomyPanel checkedAt={commandSnapshot.checkedAt} />

      <FounderIdeaInbox
        readiness={ideaInboxReadiness}
        alkonBridge={appSnapshot.engineeringOpsQuality.sovereignAutonomy.ideaInbox.alkonBridge}
      />

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
    </PrivateFounderShell>
  );
}
