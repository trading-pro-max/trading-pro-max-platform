import "server-only";

import { getAlKawnDesktopAppointmentCenter } from "./desktop-appointment-center";
import { getAlKawnDesktopBootState } from "./desktop-boot";
import { getAlKawnDesktopWelcomeMessage } from "./desktop-chat-responses";
import { getAlKawnDesktopQuickActions } from "./desktop-chat-intents";
import { getAlKawnDesktopDecisionCenter } from "./desktop-decision-center";
import { getAlKawnDesktopLayerState } from "./desktop-layer-state";
import { getAlKawnDesktopProductTruth } from "./desktop-product-truth";
import { getAlKawnDesktopRealityCenter } from "./desktop-reality-center";
import { getAlKawnDesktopReportCenter } from "./desktop-report-center";
import { getAlKawnDesktopTaskCenter } from "./desktop-task-center";
import type { AlKawnDesktopState } from "./types";

export function getAlKawnDesktopState(date = new Date()): AlKawnDesktopState {
  return {
    title: "Al-Kawn Desktop Operating Environment",
    role: "Al-Kawn Desktop is Ahmad’s private operating environment and the main private command client for الكون.",
    nativeShell: {
      electron: "not_found",
      tauri: "not_found",
      desktopRoute: "/desktop/kawn",
      nativeShellStatus: "future_gate",
      note: "No app-level Electron/Tauri shell was found; /desktop/kawn is the desktop-first private route and native shell packaging is a future gate.",
    },
    boot: getAlKawnDesktopBootState(),
    welcomeMessage: getAlKawnDesktopWelcomeMessage(),
    quickActions: getAlKawnDesktopQuickActions(),
    decisionCenter: getAlKawnDesktopDecisionCenter(),
    tasks: getAlKawnDesktopTaskCenter(),
    reports: getAlKawnDesktopReportCenter(),
    appointments: getAlKawnDesktopAppointmentCenter(),
    reality: getAlKawnDesktopRealityCenter(date),
    productTruth: getAlKawnDesktopProductTruth(),
    layers: getAlKawnDesktopLayerState(),
    protection: {
      status: "protected",
      rules: [
        "No secrets in Git.",
        "No secrets inside desktop app bundle.",
        "External accounts require Ahmad approval.",
        "Payments require legal/money gate.",
        "Broker requires money gate.",
        "Public launch blocked.",
        "Kill switch status: protected concept; no public activation.",
      ],
    },
    vault: {
      status: "future_gate",
      rules: [
        "Ahmad Digital Vault is local-first.",
        "Encrypted/protected target is planned.",
        "Not active for personal documents unless Ahmad approves.",
        "No private docs in public assets.",
        "No private docs in Git.",
        "Planned / protected concept / not storing sensitive docs yet.",
      ],
    },
    kernel: {
      status: "checked",
      role: "Universe Operating Kernel is the execution judge for Product Truth, gates, permissions, and next safe action.",
      guards: [
        "Product Truth overrides every action.",
        "Universe Operating Kernel is the execution judge.",
        "Dangerous actions require Ahmad approval or remain blocked.",
        "Swiss Local Constitution is above the Global Layer.",
      ],
      gaps: [
        "Native desktop shell packaging is not implemented.",
        "Mobile clients remain future private access layers.",
        "External account connections remain approval-gated.",
      ],
    },
    nextSafeAction: "Desktop shell finalization after Ahmad reviews /desktop/kawn.",
  };
}
