import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import {
  getAlKawnControlSurfaces,
  getControlSurfaceSummary,
} from "@/lib/server/universe/control-surfaces";
import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import { getDesktopDistributionGate } from "@/lib/server/universe/desktop-distribution-gate";
import { getPrivateDesktopLocalBuildDryRun } from "@/lib/server/universe/desktop-local-build-dry-run";
import { getDesktopPackagingGate } from "@/lib/server/universe/desktop-packaging-gate";
import { getPrivateDesktopPackagingPreparation } from "@/lib/server/universe/desktop-packaging-preparation";
import { getAlKawnElectronicCapabilities } from "@/lib/server/universe/electronic-capabilities";
import { getAlKawnExecutableGlossary } from "@/lib/server/universe/executable-glossary";
import { getAlKawnHumanSpokenInterfaceState } from "@/lib/server/universe/human-spoken-interface";
import {
  getAlKawnInfinityPreparation,
  getInfinityControlledActivation,
} from "@/lib/server/universe/infinity";
import { getAlKawnDeviceUniverseFabric } from "@/lib/server/universe/device-fabric";
import { getAlKawnLivingAutonomousIntelligence } from "@/lib/server/universe/living-autonomous-intelligence";
import { getAlKawnLivingOntology } from "@/lib/server/universe/living-ontology";
import { getLocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import { getLocalPackagedAuthGate } from "@/lib/server/universe/local-packaged-auth-gate";
import {
  getAlKawnOperatorPreparation,
  getOperatorControlledActivation,
} from "@/lib/server/universe/operator";
import { getAlKawnAutomaticEngineState } from "@/lib/server/universe/automatic-engine";
import { getAlKawnModularWorlds } from "@/lib/server/universe/modular-worlds";
import { getAlKawnOwnershipRegistry } from "@/lib/server/universe/rights-ownership";
import { getAlKawnTotalExistenceSystem } from "@/lib/server/universe/total-existence";
import { getAlKawnWakeState } from "@/lib/server/universe/wake-state";
import { AlKawnAppointmentCenter } from "./AlKawnAppointmentCenter";
import { AlKawnBootSequence } from "./AlKawnBootSequence";
import { AlKawnControlSurfaces } from "./AlKawnControlSurfaces";
import { AlKawnDailyFocusPanel } from "./AlKawnDailyFocusPanel";
import { AlKawnDecisionCenter } from "./AlKawnDecisionCenter";
import { AlKawnDetailGroup } from "./AlKawnDetailGroup";
import { AlKawnGalaxyMap } from "./AlKawnGalaxyMap";
import { AlKawnHumanChat } from "./AlKawnHumanChat";
import { AlKawnInfinityPreparationPanel } from "./AlKawnInfinityPreparationPanel";
import { AlKawnInternalOperatingSequencePanel } from "./AlKawnInternalOperatingSequencePanel";
import { AlKawnKernelPanel } from "./AlKawnKernelPanel";
import { AlKawnLayerNavigator } from "./AlKawnLayerNavigator";
import { AlKawnLivingAutonomousIntelligencePanel } from "./AlKawnLivingAutonomousIntelligencePanel";
import { AlKawnLivingEntryHero } from "./AlKawnLivingEntryHero";
import { AlKawnLivingUniverseExperiencePanel } from "./AlKawnLivingUniverseExperiencePanel";
import { AlKawnDesktopShellStatus } from "./AlKawnDesktopShellStatus";
import { AlKawnLocalPackagedAuthGate } from "./AlKawnLocalPackagedAuthGate";
import { AlKawnPrivateDesktopDistributionGate } from "./AlKawnPrivateDesktopDistributionGate";
import { AlKawnPrivateDesktopLocalBuildDryRun } from "./AlKawnPrivateDesktopLocalBuildDryRun";
import { AlKawnPrivateDesktopPackagingGate } from "./AlKawnPrivateDesktopPackagingGate";
import { AlKawnPrivateDesktopPackagingPreparation } from "./AlKawnPrivateDesktopPackagingPreparation";
import { AlKawnProductTruthPanel } from "./AlKawnProductTruthPanel";
import { AlKawnProjectRootOrderPanel } from "./AlKawnProjectRootOrderPanel";
import { AlKawnProtectionPanel } from "./AlKawnProtectionPanel";
import { AlKawnRealityDock } from "./AlKawnRealityDock";
import { AlKawnReportCenter } from "./AlKawnReportCenter";
import { AlKawnTaskCenter } from "./AlKawnTaskCenter";
import { AlKawnTopSystemBar } from "./AlKawnTopSystemBar";
import { AlKawnTradingBridge } from "./AlKawnTradingBridge";
import { AlKawnTotalExistenceCompletionPanel } from "./AlKawnTotalExistenceCompletionPanel";
import { AlKawnVaultPanel } from "./AlKawnVaultPanel";
import { AlKawnWakeReportPanel } from "./AlKawnWakeReportPanel";
import { AlKawnWakeStatePanel } from "./AlKawnWakeStatePanel";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDesktopShell({ state }: { state: AlKawnDesktopState }) {
  const controlSurfaces = getAlKawnControlSurfaces();
  const controlSurfaceSummary = getControlSurfaceSummary();
  const desktopPackagingGate = getDesktopPackagingGate();
  const localPackagedAuthGate = getLocalPackagedAuthGate();
  const desktopPackagingPreparation = getPrivateDesktopPackagingPreparation();
  const desktopLocalBuildDryRun = getPrivateDesktopLocalBuildDryRun();
  const desktopDistributionGate = getDesktopDistributionGate();
  const wakeState = getAlKawnWakeState();
  const dailyWorkLoop = getAlKawnDailyWorkLoop();
  const spokenInterface = getAlKawnHumanSpokenInterfaceState();
  const infinityPreparation = getAlKawnInfinityPreparation();
  const infinityActivation = getInfinityControlledActivation();
  const operatorPreparation = getAlKawnOperatorPreparation();
  const operatorActivation = getOperatorControlledActivation();
  const localDayOne = getLocalDayOneReadiness();
  const totalExistence = getAlKawnTotalExistenceSystem();
  const capabilities = getAlKawnElectronicCapabilities();
  const glossary = getAlKawnExecutableGlossary();
  const rights = getAlKawnOwnershipRegistry();
  const livingOntology = getAlKawnLivingOntology();
  const automaticEngine = getAlKawnAutomaticEngineState();
  const livingAutonomousIntelligence = getAlKawnLivingAutonomousIntelligence();
  const deviceFabric = getAlKawnDeviceUniverseFabric();
  const modularWorlds = getAlKawnModularWorlds();

  return (
    <main
      className={styles.desktop}
      data-testid="al-kawn-desktop-operating-environment"
      data-al-kawn-visual-system="canonical"
      data-al-kawn-surface="desktop"
      data-private-ahmad-only="true"
      aria-label="Al-Kawn Desktop Operating Environment"
    >
      <ProMaxLivingUniverseBackground surface="founder" />

      <AlKawnLivingEntryHero
        state={state}
        wakeState={wakeState}
        dailyWorkLoop={dailyWorkLoop}
      />

      <section className={styles.desktopDetails} aria-label="Al-Kawn secondary details">
        <AlKawnDetailGroup
          title="Project Root Order"
          description="Personal-only device fabric and modular worlds stay below the living command entry."
        >
          <AlKawnProjectRootOrderPanel
            fabric={deviceFabric}
            modularWorlds={modularWorlds}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="التفاصيل التقنية"
          description="الحالة التقنية محفوظة هنا بعد أن يفهم أحمد معنى الكون. Al-Kawn Desktop is Ahmad's private operating environment. Desktop is the main private command client for الكون. Private until legally ready."
        >
          <AlKawnTopSystemBar state={state} />
          <AlKawnLivingUniverseExperiencePanel
            wakeState={wakeState}
            dailyWorkLoop={dailyWorkLoop}
            infinityPreparation={infinityPreparation}
            infinityActivation={infinityActivation}
            operatorPreparation={operatorPreparation}
            operatorActivation={operatorActivation}
            localDayOne={localDayOne}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="مراجعات مؤجلة"
          description="Daily focus, review queues, and task details stay below the meaning-first entry."
        >
          <AlKawnDailyFocusPanel
            state={state}
            dailyWorkLoop={dailyWorkLoop}
            localDayOne={localDayOne}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Boot Details"
          description="Boot sequence is available, but no longer owns the first screen."
        >
          <AlKawnBootSequence steps={state.boot} />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Product Truth Details"
          description="Truth, protection, vault, and kernel remain below the experience."
        >
          <section className={styles.lowerGrid} aria-label="Al-Kawn truth control panels">
            <AlKawnProductTruthPanel items={state.productTruth} />
            <AlKawnProtectionPanel protection={state.protection} />
            <AlKawnVaultPanel vault={state.vault} />
            <AlKawnKernelPanel kernel={state.kernel} />
          </section>
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Infinity / Operator Details"
          description="Internal controlled modes stay secondary and trigger-safe."
        >
          <AlKawnLivingAutonomousIntelligencePanel
            intelligence={livingAutonomousIntelligence}
          />
          <AlKawnWakeStatePanel
            wakeState={wakeState}
            dailyWorkLoop={dailyWorkLoop}
            spokenInterface={spokenInterface}
          />
          <AlKawnInfinityPreparationPanel preparation={infinityPreparation} />
          <AlKawnInternalOperatingSequencePanel
            infinityPreparation={infinityPreparation}
            infinityActivation={infinityActivation}
            operatorPreparation={operatorPreparation}
            operatorActivation={operatorActivation}
            localDayOne={localDayOne}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Reports"
          description="Reports stay available without becoming the entry experience."
        >
          <section className={styles.lowerGrid} aria-label="Al-Kawn report panels">
            <AlKawnReportCenter reports={state.reports} />
            <AlKawnWakeReportPanel
              reports={state.reports}
              nextSafeAction={state.nextSafeAction}
            />
          </section>
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Control Surfaces"
          description="Control surfaces are preserved as lower-order operational proof."
        >
          <AlKawnControlSurfaces
            surfaces={controlSurfaces}
            summary={controlSurfaceSummary}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Rights / Ownership"
          description="Capability, glossary, rights, and ontology remain below the living entry."
        >
          <AlKawnTotalExistenceCompletionPanel
            totalExistence={totalExistence}
            capabilities={capabilities}
            glossaryTerms={glossary.terms}
            rightsEntries={rights.entries}
            livingEntities={livingOntology.entities}
            automaticEngine={automaticEngine}
          />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Packaging / Auth Gates"
          description="Desktop packaging and auth gates stay gated and lower priority."
        >
          <section className={styles.lowerGrid} aria-label="Al-Kawn packaging and auth gates">
            <AlKawnDesktopShellStatus shell={state.shellFinalization} />
          </section>
          <AlKawnPrivateDesktopPackagingGate gate={desktopPackagingGate} />
          <AlKawnLocalPackagedAuthGate gate={localPackagedAuthGate} />
          <AlKawnPrivateDesktopPackagingPreparation
            preparation={desktopPackagingPreparation}
          />
          <AlKawnPrivateDesktopLocalBuildDryRun dryRun={desktopLocalBuildDryRun} />
          <AlKawnPrivateDesktopDistributionGate gate={desktopDistributionGate} />
        </AlKawnDetailGroup>

        <AlKawnDetailGroup
          title="Pro Max / Trading Layers"
          description="الكون is root; Pro Max and /trading are lower layers inside it."
        >
          <section
            className={styles.technicalSection}
            aria-label="Pro Max demoted under Al-Kawn"
          >
            <div className={styles.sectionTitle}>
              <span>Pro Max demotion</span>
              <h2>الكون هو الأصل.</h2>
              <p>Pro Max Galaxy طبقة مستقبلية داخل الكون.</p>
              <p>/desktop/kawn هو بيت الكون الحي.</p>
            </div>
          </section>
          <section
            className={styles.operatingGrid}
            aria-label="Al-Kawn desktop operating layout"
          >
            <AlKawnLayerNavigator layers={state.layers} />
            <div className={styles.centerStack}>
              <AlKawnHumanChat
                welcomeMessage={state.welcomeMessage}
                quickActions={state.quickActions}
              />
              <AlKawnGalaxyMap />
              <AlKawnTradingBridge />
            </div>
            <div className={styles.rightStack}>
              <details className={styles.queueDisclosure} open>
                <summary>
                  <span>Review queues</span>
                  <strong>Queues are secondary to the one next action.</strong>
                </summary>
                <div className={styles.queueStack}>
                  <AlKawnDecisionCenter decisions={state.decisionCenter} />
                  <AlKawnTaskCenter tasks={state.tasks} />
                  <AlKawnAppointmentCenter appointments={state.appointments} />
                </div>
              </details>
            </div>
          </section>
        </AlKawnDetailGroup>
      </section>

      <AlKawnRealityDock reality={state.reality} />
    </main>
  );
}
