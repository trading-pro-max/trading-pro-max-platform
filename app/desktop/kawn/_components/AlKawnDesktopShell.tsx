import { ProMaxLivingUniverseBackground } from "@/app/_components/ProMaxLivingUniverseBackground";
import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import {
  getAlKawnControlSurfaces,
  getControlSurfaceSummary,
} from "@/lib/server/universe/control-surfaces";
import { getDesktopPackagingGate } from "@/lib/server/universe/desktop-packaging-gate";
import { getLocalPackagedAuthGate } from "@/lib/server/universe/local-packaged-auth-gate";
import { AlKawnAppointmentCenter } from "./AlKawnAppointmentCenter";
import { AlKawnBootSequence } from "./AlKawnBootSequence";
import { AlKawnControlSurfaces } from "./AlKawnControlSurfaces";
import { AlKawnDecisionCenter } from "./AlKawnDecisionCenter";
import { AlKawnGalaxyMap } from "./AlKawnGalaxyMap";
import { AlKawnHumanChat } from "./AlKawnHumanChat";
import { AlKawnKernelPanel } from "./AlKawnKernelPanel";
import { AlKawnLayerNavigator } from "./AlKawnLayerNavigator";
import { AlKawnDesktopShellStatus } from "./AlKawnDesktopShellStatus";
import { AlKawnLocalPackagedAuthGate } from "./AlKawnLocalPackagedAuthGate";
import { AlKawnPrivateDesktopPackagingGate } from "./AlKawnPrivateDesktopPackagingGate";
import { AlKawnProductTruthPanel } from "./AlKawnProductTruthPanel";
import { AlKawnProtectionPanel } from "./AlKawnProtectionPanel";
import { AlKawnRealityDock } from "./AlKawnRealityDock";
import { AlKawnReportCenter } from "./AlKawnReportCenter";
import { AlKawnTaskCenter } from "./AlKawnTaskCenter";
import { AlKawnTopSystemBar } from "./AlKawnTopSystemBar";
import { AlKawnTradingBridge } from "./AlKawnTradingBridge";
import { AlKawnVaultPanel } from "./AlKawnVaultPanel";
import { AlKawnWakeReportPanel } from "./AlKawnWakeReportPanel";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnDesktopShell({ state }: { state: AlKawnDesktopState }) {
  const controlSurfaces = getAlKawnControlSurfaces();
  const controlSurfaceSummary = getControlSurfaceSummary();
  const desktopPackagingGate = getDesktopPackagingGate();
  const localPackagedAuthGate = getLocalPackagedAuthGate();

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
      <AlKawnPrivateDesktopPackagingGate gate={desktopPackagingGate} />
      <AlKawnLocalPackagedAuthGate gate={localPackagedAuthGate} />

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
