import "server-only";

import {
  evaluateConstructionSafetyGate,
  type ConstructionAutonomyLevel,
} from "@/lib/server/planet-consciousness";
import {
  classifyPlanetConstructionEvent,
  type PlanetConstructionEvent,
  type PlanetConstructionEventInput,
} from "@/lib/server/planet-events";
import type { CodexConstructionTaskType, CodexTaskDraft } from "./types";

const validationCommands = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run prisma:validate",
  "npm run test:regression",
  "npm run smoke:routes",
  "git diff --check",
  "git status --short",
];

function taskTypeForEvent(event: PlanetConstructionEvent): CodexConstructionTaskType {
  if (event.type === "live_execution_requested") return "blocked_live_request";
  if (event.type === "billing_activation_requested") return "blocked_billing_request";
  if (event.type === "social_publish_requested" || event.type === "partnership_claim_requested") {
    return "media_readiness";
  }
  if (event.type === "visual_gap_detected" || event.type === "chart_quality_low") {
    return "visual_polish";
  }
  if (event.type === "ux_confusion_detected" || event.type === "public_language_leak_detected") {
    return "interface_cleanup";
  }
  if (event.type === "assistant_response_risk" || event.type === "companion_context_missing") {
    return "assistant_behavior";
  }
  if (event.type === "plan_copy_conflict" || event.type === "vip_claim_requested") {
    return "plan_copy";
  }
  if (event.type === "safe_docs_update_needed") return "docs_update";
  if (event.type === "lint_failed" || event.type === "regression_failed") return "test_update";
  if (event.type === "guardian_blocked_action" || event.type === "legal_claim_risk") {
    return "safety_rule_update";
  }
  if (event.type === "founder_approval_required" || event.type === "ministry_report_due") {
    return "founder_command";
  }
  return "diagnostics_readiness";
}

function statusLineForAutonomy(autonomyLevel: ConstructionAutonomyLevel) {
  if (autonomyLevel === "blocked") return "Do not implement; convert to blocked readiness/truth only.";
  if (autonomyLevel === "founder_approval_required") return "Draft only; Founder approval required before execution.";
  if (autonomyLevel === "review_required") return "Draft only; human review required before merge.";
  return "Draft the smallest safe task and validate thoroughly.";
}

export function compileCodexTaskDraft(
  input: PlanetConstructionEventInput | PlanetConstructionEvent,
  checkedAt = new Date().toISOString()
): CodexTaskDraft {
  const event =
    "eventId" in input ? input : classifyPlanetConstructionEvent(input, checkedAt);
  const gate = evaluateConstructionSafetyGate(event, checkedAt);
  const taskType = taskTypeForEvent(event);
  const taskId = `task_${taskType}_${checkedAt.replace(/\D/g, "").slice(0, 14)}`;
  const title = `${event.affectedArea}: ${event.type.replaceAll("_", " ")}`;
  const forbiddenScope = [
    ...event.forbiddenScope,
    "external Codex execution",
    "automatic commit/push without validation",
    "public internal-governance terminology",
  ];
  const scope = [
    "inspect current implementation",
    "preserve existing user work",
    "draft scoped safe implementation steps",
    "attach Product Truth and public language rules",
    "define validation and screenshot requirements",
  ];
  const likelyFiles = event.affectedFiles.length
    ? event.affectedFiles
    : ["app/theme-localization.css", "modules", "lib/server", "tests/regression"];
  const screenshotRequirements =
    taskType === "visual_polish" || taskType === "interface_cleanup"
      ? ["public entry", "workstation", "settings/diagnostics", "dark/light", "RTL where applicable"]
      : [];

  const prompt = [
    `MISSION: ${title}`,
    `OBJECTIVE: ${event.suggestedNextAction}`,
    `AUTONOMY: ${statusLineForAutonomy(gate.autonomyLevel)}`,
    "FORBIDDEN: Do not enable live execution, real money, broker/feed, billing, launch, social publishing, production secrets, fake metrics, fake paid activation, or uncontrolled automation.",
    "PUBLIC LANGUAGE: Free / Pro / VIP / Institutional, TPM Assistant, Trading Workspace, Journal, Coach, Academy, Community, Premium Reports, Settings, Diagnostics, Readiness.",
    `LIKELY FILES: ${likelyFiles.join(", ")}`,
    `VALIDATION: ${validationCommands.join(" | ")}`,
  ].join("\n");

  return {
    taskId,
    title,
    taskType,
    mission: "Draft a safe Codex-ready build task from a classified TPM construction event.",
    objective: event.suggestedNextAction,
    currentBaseline: "latest clean verified baseline; preserve chart, Earth Mark, auth, Product Truth, and public naming.",
    scope,
    likelyFiles,
    forbiddenScope,
    productTruthRequirements: [
      "live execution blocked",
      "real money blocked",
      "broker/feed inactive",
      "billing inactive",
      "public launch inactive",
      "social publishing inactive",
      "Pro/VIP/Institutional not fake active",
    ],
    publicLanguageRules: [
      "Use Free / Pro / VIP / Institutional for public plans.",
      "Use TPM Assistant for user-facing assistant language.",
      "Do not expose Founder Command or internal governance terms to normal users.",
    ],
    safetyRules: [
      "No production secrets.",
      "No external publishing.",
      "No uncontrolled autonomous execution.",
      "No guaranteed profit, win-rate, fake users, fake revenue, or fake metrics.",
    ],
    guardianLegalRequirements: gate.requiredReviews,
    founderApprovalRequired: gate.founderApprovalRequired,
    acceptanceCriteria: [
      "Product Truth remains unchanged and blocked states remain blocked.",
      "Public UI remains professional and free of internal-governance leakage.",
      "Tests or docs cover the changed behavior.",
      "Validation commands pass before commit.",
    ],
    validationCommands,
    screenshotRequirements,
    finalResponseFormat: [
      "Result",
      "Exact changes",
      "Changed files",
      "Verification",
      "Product truth preserved",
      "Git status",
    ],
    rollbackCleanupRule:
      "Do not revert user work. If validation fails, draft a scoped cleanup/repair task and preserve unrelated changes.",
    expectedCommitMessage:
      taskType === "blocked_live_request" || taskType === "blocked_billing_request"
        ? "document blocked activation request"
        : "complete safe tpm construction task",
    autonomyLevel: gate.autonomyLevel,
    requiredReviews: gate.requiredReviews,
    prompt,
    executionTruth: "draft_only_not_sent_not_executed",
  };
}

export function getCodexTaskDraftReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  const visualDraft = compileCodexTaskDraft(
    {
      title: "Public UI needs cleaner chart-first polish",
      affectedArea: "Trading Workspace",
      affectedFiles: ["modules/shell/components/TradingWorkstation.tsx", "app/theme-localization.css"],
    },
    checkedAt
  );
  const blockedDraft = compileCodexTaskDraft(
    {
      title: "Enable live execution and billing",
      affectedArea: "Execution",
    },
    checkedAt
  );

  return {
    checkedAt,
    mode: "codex_task_compiler_readiness" as const,
    drafts: [visualDraft, blockedDraft],
    truth: {
      externalCodexExecution: "not_enabled" as const,
      taskSending: "not_enabled" as const,
      approvalsExecuted: false,
      productionActions: "blocked" as const,
    },
  };
}
