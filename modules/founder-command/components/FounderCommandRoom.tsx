import {
  getFounderCommandAppSnapshot,
  getFounderCommandRoomFoundationSnapshot,
} from "@/lib/server/founder-command";
import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import { getExistenceArchitectureSnapshot } from "@/lib/server/existence-architecture";
import { getJarBuildSnapshot } from "@/lib/server/jar-build";
import { getFounderIdeaInboxReadiness } from "@/lib/server/sovereign-autonomy";
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
import AlkonOneCorrectActionPanel from "./AlkonOneCorrectActionPanel";
import AlkonSourceDriftPanel from "./AlkonSourceDriftPanel";
import AlkonSourceLawPanel from "./AlkonSourceLawPanel";
import AlkonVisionCorePanel from "./AlkonVisionCorePanel";
import AlkonOperatingModePanel from "./AlkonOperatingModePanel";
import AlkonZeroTruthPanel from "./AlkonZeroTruthPanel";
import AlkonDailyLoopPanel from "./AlkonDailyLoopPanel";
import AlkonOneNextActionPanel from "./AlkonOneNextActionPanel";
import AlkonActivationGatesPanel from "./AlkonActivationGatesPanel";
import AlkonKernelPanel from "./AlkonKernelPanel";
import AlkonFounderSourcePanel from "./AlkonFounderSourcePanel";
import AlkonCreatorRuntimePanel from "./AlkonCreatorRuntimePanel";
import AlkonKernelZeroTruthPanel from "./AlkonKernelZeroTruthPanel";
import AlkonRealityTrialPanel from "./AlkonRealityTrialPanel";
import AlkonRealityProductionPanel from "./AlkonRealityProductionPanel";
import AlkonSelfCorrectionPanel from "./AlkonSelfCorrectionPanel";
import AlkonLocalBuilderPanel from "./AlkonLocalBuilderPanel";
import AlkonKernelCommandsPanel from "./AlkonKernelCommandsPanel";
import AlkonLocalDayOneGatePanel from "./AlkonLocalDayOneGatePanel";
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
import AlkonJarBuildPanel from "./AlkonJarBuildPanel";
import AlkonExistenceArchitecturePanel from "./AlkonExistenceArchitecturePanel";
import AlkonEntityOwnershipPanel from "./AlkonEntityOwnershipPanel";
import AlkonExistenceGatePanel from "./AlkonExistenceGatePanel";
import AlkonExistenceJarPanel from "./AlkonExistenceJarPanel";
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
  const jarSnapshot = getJarBuildSnapshot(commandSnapshot.checkedAt);
  const existenceSnapshot = getExistenceArchitectureSnapshot(commandSnapshot.checkedAt);

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
          <div className="alkon-private-hero-mark" aria-hidden="true">
            A
          </div>
          <div className="alkon-private-hero-copy">
            <strong>Alkon / الكون</strong>
            <small>Ahmad private operating universe</small>
          </div>
        </div>
        <div>
          <span>Private Alkon Founder Command</span>
          <h1>Alkon Command Room</h1>
          <p>
            A private, read-only Alkon surface for observing Kernel readiness,
            Reality Trial, Evidence Chain, devices, risks, approvals, and
            Product Truth. It is not public Pro Max, not user-facing, and never
            activates unsafe capability.
          </p>
        </div>
        <div className="tpm-founder-access-card">
          <span>Alkon access</span>
          <strong>Ahmad only</strong>
          <small>{commandSnapshot.access.exposureDecision}</small>
        </div>
      </header>

      <PlanetMapPreview audience="founder" />

      <FounderPlanetCommandWorld checkedAt={commandSnapshot.checkedAt} />

      <AlkonCommandUniverse checkedAt={commandSnapshot.checkedAt} />

      <section className="tpm-founder-panel" data-alkon-chat-readiness="true">
        <div className="tpm-founder-panel-head">
          <span>Alkon Chat</span>
          <h2>Private command mind is ready with notes</h2>
          <p>
            Ask Alkon is Founder-only, read-only, and preview-only. It can answer,
            classify, judge, and draft command passports, but cannot execute shell,
            Codex, payments, live trading, billing, broker/feed, real money, launch,
            or external calls.
          </p>
        </div>
        <div className="tpm-founder-metrics">
          <div className="tpm-founder-metric">
            <span>Status</span>
            <strong>{appSnapshot.alkonChat.statusLabel}</strong>
            <small>Founder-only command interface</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Available intents</span>
            <strong>{appSnapshot.alkonChat.availableIntents.length}</strong>
            <small>{appSnapshot.alkonChat.promptChips.slice(0, 3).join(" / ")}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>One Next Action</span>
            <strong>Ahmad review</strong>
            <small>{appSnapshot.alkonChat.currentOneNextAction}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>No execution</span>
            <strong>{appSnapshot.alkonChat.noExecution ? "Blocked" : "Review"}</strong>
            <small>Command Passport drafting is preview-only</small>
          </div>
        </div>
      </section>

      <AlkonJarBuildPanel snapshot={jarSnapshot} />
      <AlkonExistenceArchitecturePanel snapshot={existenceSnapshot} />
      <div className="alkon-command-grid alkon-existence-grid">
        <AlkonEntityOwnershipPanel snapshot={existenceSnapshot} />
        <AlkonExistenceGatePanel snapshot={existenceSnapshot} />
        <AlkonExistenceJarPanel snapshot={existenceSnapshot} />
      </div>

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

      <AlkonSourceLawPanel snapshot={appSnapshot.sourceLaw} />

      <div className="alkon-command-grid alkon-source-law-grid">
        <AlkonVisionCorePanel snapshot={appSnapshot.sourceLaw} />
        <AlkonOneCorrectActionPanel snapshot={appSnapshot.sourceLaw} />
        <AlkonSourceDriftPanel snapshot={appSnapshot.sourceLaw} />
      </div>

      <AlkonOperatingModePanel snapshot={appSnapshot.alkonOperatingMode} />

      <div className="alkon-command-grid alkon-operating-mode-grid">
        <AlkonZeroTruthPanel snapshot={appSnapshot.alkonOperatingMode} />
        <AlkonDailyLoopPanel snapshot={appSnapshot.alkonOperatingMode} />
        <AlkonOneNextActionPanel snapshot={appSnapshot.alkonOperatingMode} />
        <AlkonActivationGatesPanel snapshot={appSnapshot.alkonOperatingMode} />
      </div>

      <AlkonKernelPanel snapshot={appSnapshot.alkonKernel} />

      <div className="alkon-command-grid alkon-kernel-grid">
        <AlkonFounderSourcePanel snapshot={appSnapshot.alkonKernel} />
        <AlkonCreatorRuntimePanel snapshot={appSnapshot.alkonKernel} />
        <AlkonKernelZeroTruthPanel snapshot={appSnapshot.alkonKernel} />
        <AlkonRealityTrialPanel snapshot={appSnapshot.alkonKernel} />
        <AlkonKernelCommandsPanel snapshot={appSnapshot.alkonKernel} />
        <AlkonLocalDayOneGatePanel snapshot={appSnapshot.alkonKernel} />
      </div>

      <AlkonRealityProductionPanel snapshot={appSnapshot.realityProduction} />
      <AlkonSelfCorrectionPanel snapshot={appSnapshot.selfCorrection} />
      <AlkonLocalBuilderPanel snapshot={appSnapshot.localBuilder} />

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
        <div className="tpm-founder-metrics" data-private-hybrid-earth-texture-readiness="true">
          <div className="tpm-founder-metric">
            <span>Hybrid Earth policy</span>
            <strong>{appSnapshot.earthReality.hybridEarthTextureReadiness.status}</strong>
            <small>{appSnapshot.earthReality.hybridEarthTextureReadiness.activeTextureMode}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Approved texture registry</span>
            <strong>{appSnapshot.earthReality.hybridEarthTextureReadiness.approvedTextureCount}</strong>
            <small>
              {appSnapshot.earthReality.hybridEarthTextureReadiness.approvedDisabledCount} approved disabled
            </small>
          </div>
          <div className="tpm-founder-metric">
            <span>Missing / invalid metadata</span>
            <strong>
              {appSnapshot.earthReality.hybridEarthTextureReadiness.missingMetadataCount} /{" "}
              {appSnapshot.earthReality.hybridEarthTextureReadiness.invalidMetadataCount}
            </strong>
            <small>No active texture without complete metadata</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Next safe action</span>
            <strong>License first</strong>
            <small>{appSnapshot.earthReality.hybridEarthTextureReadiness.nextSafeAction}</small>
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
