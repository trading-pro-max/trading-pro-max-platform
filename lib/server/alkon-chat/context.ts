import fs from "node:fs";
import path from "node:path";
import { getAlkonKernelSnapshot } from "@/lib/server/alkon-kernel";
import { getAlkonOperatingModeSnapshot } from "@/lib/server/alkon-operating-mode";
import { getFounderDeviceReadinessSnapshot } from "@/lib/server/devices";
import type { AlkonChatContext } from "./types";
import { formatAlkonStatusLabel, formatAlkonStatusList } from "./status-language";

function readWakeReportSummary() {
  const reportPath = path.join(process.cwd(), "reports", "alkon-wake-report.md");
  if (!fs.existsSync(reportPath)) {
    return "Wake Report is missing and must be restored before closure.";
  }

  const report = fs.readFileSync(reportPath, "utf8");
  const summaryLines = report
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) =>
      /^(Status|Mission|Done|Not done|Next):/i.test(line)
    )
    .slice(0, 5);

  const summary = summaryLines.length > 0
    ? summaryLines.join(" ")
    : "Wake Report exists; summary fields need review.";

  return summary.replace(/\b[a-z][a-z0-9]+_[a-z0-9_]+\b/g, (token) =>
    formatAlkonStatusLabel(token)
  );
}

export function getAlkonChatContext(
  checkedAt = new Date().toISOString()
): AlkonChatContext {
  const operatingMode = getAlkonOperatingModeSnapshot(checkedAt);
  const kernel = getAlkonKernelSnapshot(checkedAt);
  const devices = getFounderDeviceReadinessSnapshot(checkedAt);
  const localDayOneStatus = "not_started";
  const visualAcceptance = "visual_acceptance_needed";
  const phoneBlocked = [
    "Shell execution",
    "Codex execution",
    "Payment execution",
    "Live execution",
    "Billing activation",
    "Broker/feed activation",
    "Real money",
    "Production secrets",
  ];

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
    noSecrets: true,
    currentStatus: operatingMode.status,
    currentStatusLabel: formatAlkonStatusLabel(operatingMode.status),
    currentHeart:
      "Pro Max Center is the public reality. Pro Max Trading remains the first paper-safe heart. Alkon stays private for Ahmad.",
    blockers: [
      ...kernel.zeroTruth.blockers,
      "Ahmad visual acceptance is not recorded.",
      "Local Day One remains not started.",
    ],
    oneNextAction: {
      action: kernel.oneNextAction.oneNextAction,
      whyNow: kernel.oneNextAction.whyThisNow,
      founderDecisionNeeded: kernel.oneNextAction.founderDecisionNeeded,
    },
    whatNotToDo: [
      ...kernel.oneNextAction.whatNotToDo,
      "Do not expose Alkon, Founder Command, Kernel, Reality Trial, or internal governance publicly.",
      "Do not start Local Day One until Ahmad explicitly accepts the visual reality.",
    ],
    evidenceSummary: `${formatAlkonStatusLabel(
      kernel.evidenceChain.evidenceStatus
    )}: ${kernel.evidenceChain.presentEvidence.length} present, ${kernel.evidenceChain.missingEvidence.length} missing.`,
    localDayOneStatus,
    localDayOneStatusLabel: formatAlkonStatusLabel(localDayOneStatus),
    visualAcceptance,
    visualAcceptanceLabel: formatAlkonStatusLabel(visualAcceptance),
    deviceSummary: {
      windows: devices.officialConstellation.windows,
      iphone: devices.officialConstellation.iphone,
      samsung: devices.officialConstellation.samsung,
      phonesReviewOnly: true,
      blockedOnPhones: phoneBlocked,
    },
    latestWakeReportSummary: readWakeReportSummary(),
    operatingMode: {
      status: operatingMode.status,
      statusLabel: formatAlkonStatusLabel(operatingMode.status),
      activationDecision: operatingMode.activationDecision,
      activationDecisionLabel: formatAlkonStatusLabel(
        operatingMode.activationDecision
      ),
    },
    kernel: {
      status: kernel.status,
      statusLabel: formatAlkonStatusLabel(kernel.status),
      commandCount: kernel.commandStatuses.length,
      zeroTruth: kernel.zeroTruth.zeroTruthStatus,
      zeroTruthLabel: formatAlkonStatusLabel(kernel.zeroTruth.zeroTruthStatus),
      realityTrial: kernel.realityTrial.outcome,
      realityTrialLabel: formatAlkonStatusLabel(kernel.realityTrial.outcome),
      evidence: kernel.evidenceChain.evidenceStatus,
      evidenceLabel: formatAlkonStatusLabel(kernel.evidenceChain.evidenceStatus),
      memory: formatAlkonStatusLabel(kernel.memoryLaw.memoryStatus),
    },
    realityTrial: {
      outcome: kernel.realityTrial.outcome,
      outcomeLabel: formatAlkonStatusLabel(kernel.realityTrial.outcome),
      missing: kernel.realityTrial.missing,
      nextAction: kernel.realityTrial.nextAction,
    },
    memory: {
      memoryStatus: formatAlkonStatusLabel(kernel.memoryLaw.memoryStatus),
      lessons: formatAlkonStatusList(kernel.memoryLaw.lessons),
      persistence: "stateless_read_only",
    },
  };
}
