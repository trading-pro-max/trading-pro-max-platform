import type { AlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import styles from "../al-kawn-desktop.module.css";

export function AlKawnTopSystemBar({ state }: { state: AlKawnDesktopState }) {
  return (
    <header className={styles.topBar} aria-label="Top System Bar">
      <div>
        <strong>الكون</strong>
        <span>private Ahmad-only</span>
      </div>
      <span>Time {state.reality.deviceTime}</span>
      <span>Phase {state.reality.dayNightPhase}</span>
      <span>Product Truth enforced</span>
      <span>Kernel status {state.kernel.status}</span>
      <span>Protection status {state.protection.status}</span>
      <span>Next action: {state.nextSafeAction}</span>
      <span>legal/money gates</span>
    </header>
  );
}
