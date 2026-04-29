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
    shellFinalization: {
      status: "route_finalized_native_future_gate",
      shellType: "next_route_only",
      privateHomeRoute: "/desktop/kawn",
      defaultHomeStatus: "available_as_private_desktop_home",
      packageScripts: ["desktop:check"],
      publicDistribution: "blocked",
      signingStatus: "future_gate",
      packagingStatus: "future_gate",
      securityRules: [
        "/desktop/kawn is the Al-Kawn private desktop home.",
        "Private Ahmad-only desktop shell.",
        "Desktop shell is private Ahmad-only.",
        "Public desktop distribution is blocked.",
        "No secrets are stored in the desktop bundle.",
        "External accounts require Ahmad approval.",
        "Product Truth overrides every action.",
      ],
      gaps: [
        "Native signing and private distribution remain future gates.",
        "Native desktop packaging is not complete.",
        "Local authentication for a packaged app remains a future gate.",
        "Private Desktop Packaging Gate keeps packaging, signing, and private distribution gated.",
      ],
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
    nextSafeAction: "Local Packaged Auth Gate before private desktop packaging preparation.",
  };
}
