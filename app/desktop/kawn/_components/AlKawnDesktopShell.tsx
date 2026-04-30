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
import { getAlKawnLivingAutonomousIntelligence } from "@/lib/server/universe/living-autonomous-intelligence";
import { getAlKawnLivingOntology } from "@/lib/server/universe/living-ontology";
import { getLocalDayOneReadiness } from "@/lib/server/universe/local-day-one";
import { getLocalPackagedAuthGate } from "@/lib/server/universe/local-packaged-auth-gate";
import {
  getAlKawnOperatorPreparation,
  getOperatorControlledActivation,
} from "@/lib/server/universe/operator";
import { getAlKawnAutomaticEngineState } from "@/lib/server/universe/automatic-engine";
import { getAlKawnOwnershipRegistry } from "@/lib/server/universe/rights-ownership";
import { getAlKawnTotalExistenceSystem } from "@/lib/server/universe/total-existence";
import { getAlKawnWakeState } from "@/lib/server/universe/wake-state";
import { AlKawnAppointmentCenter } from "./AlKawnAppointmentCenter";
import { AlKawnBootSequence } from "./AlKawnBootSequence";
import { AlKawnControlSurfaces } from "./AlKawnControlSurfaces";
import { AlKawnDecisionCenter } from "./AlKawnDecisionCenter";
import { AlKawnGalaxyMap } from "./AlKawnGalaxyMap";
import { AlKawnHumanChat } from "./AlKawnHumanChat";
import { AlKawnInfinityPreparationPanel } from "./AlKawnInfinityPreparationPanel";
import { AlKawnInternalOperatingSequencePanel } from "./AlKawnInternalOperatingSequencePanel";
import { AlKawnKernelPanel } from "./AlKawnKernelPanel";
import { AlKawnLayerNavigator } from "./AlKawnLayerNavigator";
import { AlKawnLivingAutonomousIntelligencePanel } from "./AlKawnLivingAutonomousIntelligencePanel";
import { AlKawnDesktopShellStatus } from "./AlKawnDesktopShellStatus";
import { AlKawnLocalPackagedAuthGate } from "./AlKawnLocalPackagedAuthGate";
import { AlKawnPrivateDesktopDistributionGate } from "./AlKawnPrivateDesktopDistributionGate";
import { AlKawnPrivateDesktopLocalBuildDryRun } from "./AlKawnPrivateDesktopLocalBuildDryRun";
import { AlKawnPrivateDesktopPackagingGate } from "./AlKawnPrivateDesktopPackagingGate";
import { AlKawnPrivateDesktopPackagingPreparation } from "./AlKawnPrivateDesktopPackagingPreparation";
import { AlKawnProductTruthPanel } from "./AlKawnProductTruthPanel";
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
      <AlKawnTopSystemBar state={state} />

      <section className={styles.hero}>
        <div>
          <span>Al-Kawn Desktop Operating Environment</span>
          <h1>Al-Kawn Desktop is Ahmad&apos;s private operating environment</h1>
          <p>الكون هو نسخة أحمد الإلكترونية الخاصة</p>
          <p>Desktop is the main private command client for الكون</p>
          <p>Pro Max is the future public product, not الكون</p>
          <p>Product Truth overrides every action</p>
          <p>Universe Operating Kernel is the execution judge</p>
          <p>داخل الكون: التنفيذ مباشر</p>
          <p>عند القانون: يتوقف لأحمد</p>
          <p>عند المال: يتوقف لأحمد</p>
        </div>
        <aside className={styles.bootCard}>
          <strong>Booting الكون private operating environment</strong>
          <small>/desktop/kawn is the Al-Kawn private desktop home.</small>
          <small>Private Ahmad-only desktop shell.</small>
          <small>Public desktop distribution is blocked.</small>
          <small>No secrets are stored in the desktop bundle.</small>
          <small>External accounts require Ahmad approval.</small>
          <small>Private until legally ready</small>
          <small>{state.nativeShell.note}</small>
        </aside>
      </section>

      <AlKawnBootSequence steps={state.boot} />

      <section className={styles.operatingGrid} aria-label="Al-Kawn desktop operating layout">
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
          <AlKawnDecisionCenter decisions={state.decisionCenter} />
          <AlKawnTaskCenter tasks={state.tasks} />
          <AlKawnAppointmentCenter appointments={state.appointments} />
        </div>
      </section>

      <AlKawnControlSurfaces surfaces={controlSurfaces} summary={controlSurfaceSummary} />
      <AlKawnTotalExistenceCompletionPanel
        totalExistence={totalExistence}
        capabilities={capabilities}
        glossaryTerms={glossary.terms}
        rightsEntries={rights.entries}
        livingEntities={livingOntology.entities}
        automaticEngine={automaticEngine}
      />
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
      <AlKawnPrivateDesktopPackagingGate gate={desktopPackagingGate} />
      <AlKawnLocalPackagedAuthGate gate={localPackagedAuthGate} />
      <AlKawnPrivateDesktopPackagingPreparation
        preparation={desktopPackagingPreparation}
      />
      <AlKawnPrivateDesktopLocalBuildDryRun dryRun={desktopLocalBuildDryRun} />
      <AlKawnPrivateDesktopDistributionGate gate={desktopDistributionGate} />

      <section className={styles.lowerGrid} aria-label="Al-Kawn desktop control panels">
        <AlKawnReportCenter reports={state.reports} />
        <AlKawnDesktopShellStatus shell={state.shellFinalization} />
        <AlKawnWakeReportPanel reports={state.reports} nextSafeAction={state.nextSafeAction} />
        <AlKawnProductTruthPanel items={state.productTruth} />
        <AlKawnProtectionPanel protection={state.protection} />
        <AlKawnVaultPanel vault={state.vault} />
        <AlKawnKernelPanel kernel={state.kernel} />
      </section>

      <AlKawnRealityDock reality={state.reality} />
    </main>
  );
}
