import fs from "node:fs";
import path from "node:path";
import { getAlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";
import { getJarInboxItems } from "@/lib/server/jar-build/state";
import { getRealityConversionSnapshot } from "@/lib/server/reality-conversion/state";
import type { AlkonDailyOperationSnapshot } from "./types";

function readReportSummary(fileName: string, prefixes: string[]) {
  const reportPath = path.join(process.cwd(), "reports", fileName);
  if (!fs.existsSync(reportPath)) {
    return `${fileName} missing`;
  }

  const pattern = new RegExp(`^(${prefixes.join("|")}):`, "i");
  const lines = fs
    .readFileSync(reportPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => pattern.test(line))
    .slice(0, 6);

  return lines.length > 0 ? lines.join(" ") : `${fileName} present`;
}

export function getAlkonTodayOperationSnapshot(
  checkedAt = new Date().toISOString()
): AlkonDailyOperationSnapshot {
  const operatingMode = getAlkonOperatingModeSnapshot(checkedAt);
  const jarInbox = getJarInboxItems();
  const realityConversion = getRealityConversionSnapshot(checkedAt);
  const brandGateItem = jarInbox.find((item) => item.id === "jar_item_global_brand_gate_delayed");

  return {
    checkedAt,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noShell: true,
    noCodex: true,
    noPayments: true,
    noExternalCalls: true,
    noPublicExposure: true,
    status: "operating_with_notes",
    currentTruth:
      "ALKON can operate today as a private read-only command mind: read reports, Jar, Reality Conversion, Permission-to-Exist, Pro Max Trading readiness, Product Truth, and public/private boundaries, then return one next action.",
    whatChanged: [
      "Global brand naming moved out of today operating path.",
      "Brand clearance remains important but delayed to Jar 8 Future / Public Trust and Jar 9 Founder Decision.",
      "Daily operation is now the current heart of Alkon -0.",
    ],
    blocked: [
      "Local Day One is not started.",
      "Ahmad visual acceptance is still required.",
      "Public launch remains inactive.",
      "Billing, live trading, real money, broker/feed, and production activation remain blocked.",
    ],
    currentHeart:
      "Pro Max Trading at /trading remains the first living product and the current public heart.",
    oneNextAction: {
      action:
        "Ahmad reviews the current /trading Living Core and returns one focused decision: accept, reject with notes, or request one narrow correction.",
      whyNow:
        "All current operation gates are read-only and safe with notes; the next real operating step is Ahmad visual decision before Local Day One or final closure can move.",
      requiresAhmad: true,
    },
    whatNotToDo: [
      "Do not work on brand naming now.",
      "Do not rename the public brand or codebase.",
      "Do not open public launch.",
      "Do not enable billing, live trading, broker/feed, real money, or production.",
      "Do not expose Alkon, Founder Command, Jar, Kernel, Zero Truth, or internal governance publicly.",
      "Do not run shell or Codex from the web app.",
      "Do not start Local Day One automatically.",
    ],
    needsAhmad: [
      "Visual decision on the current /trading Living Core.",
      "Any future sensitive activation.",
      "Any future global brand adoption.",
    ],
    latestWakeReportSummary: readReportSummary("alkon-wake-report.md", [
      "Status",
      "Mission",
      "Done",
      "Not done",
      "Next",
    ]),
    nextCommandSummary: readReportSummary("alkon-next-command.md", [
      "Status",
      "Mission",
      "Next",
      "Recommended next command",
    ]),
    jar: {
      status: "active_with_notes",
      priority:
        "Jar 1 P0 Reality first; Jar 2 Heart next; Global Brand Gate delayed to Jar 8 Future / Public Trust.",
      brandGateDelayed: true,
      ...(brandGateItem ? { brandGateItem } : {}),
    },
    realityConversion: {
      status: realityConversion.status,
      firstRealityStep: realityConversion.firstRealityStep,
      oneNextRealityAction: realityConversion.oneNextRealityAction,
    },
    permissionToExist: {
      status: operatingMode.status,
      nextStructuralAction:
        "Classify any new file, route, API, component, report, test, tool, or future idea through Permission-to-Exist and Jar before execution.",
    },
    proMaxTrading: {
      status: "ready_with_notes",
      route: "/trading",
      truth:
        "Paper-safe active; live inactive; broker/feed inactive; billing inactive; real money blocked.",
    },
    founderRoutes: {
      alkon: "active_private",
      pocket: "active_private",
    },
    productTruth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      billing: "inactive",
      brokerFeed: "inactive",
      publicLaunch: "inactive",
      noSecretsExposed: true,
      noPublicAlkonExposure: true,
    },
    publicPrivateBoundary: {
      publicSafe: true,
      alkonPrivate: true,
      founderRoutesHiddenFromPublic: true,
    },
    localDayOne: {
      status: "not_started",
      reason: "Ahmad visual acceptance has not been explicitly recorded.",
    },
  };
}
