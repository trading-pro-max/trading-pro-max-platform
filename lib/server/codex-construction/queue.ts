import "server-only";

import { evaluateConstructionSafetyGate } from "@/lib/server/planet-consciousness";
import { classifyPlanetConstructionEvent } from "@/lib/server/planet-events";
import { compileCodexTaskDraft } from "./task-compiler";
import type {
  ConstructionQueueItem,
  ConstructionQueueSnapshot,
  ConstructionQueueStatus,
} from "./types";

function statusForAutonomy(
  autonomyLevel: ConstructionQueueItem["autonomyLevel"]
): ConstructionQueueStatus {
  if (autonomyLevel === "blocked") return "blocked";
  if (autonomyLevel === "founder_approval_required") return "waiting_founder";
  if (autonomyLevel === "review_required") return "waiting_review";
  return "drafted";
}

function queueItem(input: Parameters<typeof classifyPlanetConstructionEvent>[0], checkedAt: string) {
  const event = classifyPlanetConstructionEvent(input, checkedAt);
  const gate = evaluateConstructionSafetyGate(event, checkedAt);
  const draft = compileCodexTaskDraft(event, checkedAt);

  return {
    taskId: draft.taskId,
    title: draft.title,
    sourceEvent: event,
    ownerMinistry: event.ownerMinistry,
    taskType: draft.taskType,
    riskLevel: event.riskLevel,
    autonomyLevel: gate.autonomyLevel,
    status: statusForAutonomy(gate.autonomyLevel),
    draftPrompt: draft.prompt,
    requiredReviews: gate.requiredReviews,
    founderApprovalRequired: gate.founderApprovalRequired,
    blockedReason: gate.blockedReason,
    validationPlan: gate.validationRequired,
    expectedArtifacts: [
      "changed files list",
      "validation report",
      ...(draft.screenshotRequirements.length ? ["screenshot proof"] : []),
      "Product Truth preservation statement",
    ],
    createdAt: checkedAt,
    updatedAt: checkedAt,
  } satisfies ConstructionQueueItem;
}

export function getConstructionQueueSnapshot(
  checkedAt = new Date().toISOString()
): ConstructionQueueSnapshot {
  const items = [
    queueItem(
      {
        title: "Public language leak detected in user-facing copy",
        affectedArea: "Public UI",
        affectedFiles: ["modules/product/components/PublicProductEntry.tsx"],
      },
      checkedAt
    ),
    queueItem(
      {
        title: "Chart quality low on workstation screenshot",
        affectedArea: "Trading Workspace",
        affectedFiles: ["modules/shell/components/TradingWorkstation.tsx"],
      },
      checkedAt
    ),
    queueItem(
      {
        title: "Enable live execution and billing",
        affectedArea: "Execution",
      },
      checkedAt
    ),
  ];

  return {
    checkedAt,
    mode: "codex_construction_queue_readiness",
    items,
    summary: {
      total: items.length,
      blocked: items.filter((item) => item.status === "blocked").length,
      waitingReview: items.filter((item) => item.status === "waiting_review").length,
      waitingFounder: items.filter((item) => item.status === "waiting_founder").length,
      drafted: items.filter((item) => item.status === "drafted").length,
      externalExecutionActive: false,
    },
    truth: {
      noAutomaticExternalSending: true,
      noUncontrolledExecution: true,
      blockedItemsStayBlocked: true,
    },
  };
}
