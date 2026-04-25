import "server-only";

import { getConstructionQueueSnapshot } from "@/lib/server/codex-construction";
import { createProductMemoryDraft } from "./store";
import type { ProductMemoryItem } from "./types";

export function getBuildDecisionMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  const queue = getConstructionQueueSnapshot(checkedAt);

  return queue.items
    .slice(0, 3)
    .map((item) =>
      createProductMemoryDraft(
        {
          domain: item.status === "passed" ? "codex_task_outcome" : "build_decision",
          title: item.title,
          summary:
            `${item.taskType} owned by ${item.ownerMinistry}; autonomy ${item.autonomyLevel}; validation requires ${item.validationPlan.join(", ")}.`,
          status:
            item.status === "blocked"
              ? "blocked_by_design"
              : item.status === "waiting_founder"
              ? "needs_polish"
              : "draft",
          tags: ["construction", item.taskType, item.riskLevel],
          source: item.taskId,
          relatedArea: item.sourceEvent.affectedArea,
          sensitivity: "internal",
          visibility: "founder_only",
          productTruthImpact:
            item.autonomyLevel === "blocked" ? "blocked_if_claimed" : "requires_review",
          founderDecisionImpact:
            item.founderApprovalRequired ? "decision_needed" : "review_later",
        },
        checkedAt
      )
    )
    .flatMap((result) => (result.ok ? [result.item] : []));
}

export function getBuildDecisionMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const queue = getConstructionQueueSnapshot(checkedAt);
  const items = getBuildDecisionMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "build_decision_memory_readiness" as const,
    items,
    summary: {
      queueItems: queue.summary.total,
      blocked: queue.summary.blocked,
      waitingReview: queue.summary.waitingReview,
      waitingFounder: queue.summary.waitingFounder,
      rememberedDecisions: items.length,
      externalCodexCalls: false,
    },
    truth: {
      codeExecutionTriggered: false,
      externalCodexCalls: false,
      productionActionsStored: false,
      secretsStored: false,
    },
  };
}
