import "server-only";

import { getBuildDecisionMemoryItems } from "./build-decisions";
import {
  getDecisionReplayMemoryItems,
} from "./decision-replay";
import {
  getFounderAcceptanceMemoryItems,
} from "./founder-acceptance";
import { getLocalDayMemoryItems } from "./local-day";
import { getProductGapMemoryItems } from "./product-gaps";
import {
  createProductMemoryDraft,
  filterSafeProductMemoryItems,
  getForbiddenStorageReminders,
  productMemorySafetyPolicy,
  summarizeProductMemoryItems,
} from "./store";
import {
  getValidationSummaryMemoryItems,
} from "./validation-summary";
import type { ProductMemoryItem, ProductMemoryStoreSnapshot } from "./types";

function getJournalCoachMemoryItems(checkedAt: string): ProductMemoryItem[] {
  return [
    createProductMemoryDraft(
      {
        domain: "journal_note",
        title: "Paper session note memory foundation",
        summary:
          "Journal memory may store local demo notes, decision notes, lessons learned, blocked-state reflections, and paper-mode reflections only.",
        status: "draft",
        tags: ["journal", "paper", "local"],
        source: "journal-coach",
        relatedArea: "Journal / Coach",
        sensitivity: "internal",
        visibility: "user_visible",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "none",
      },
      checkedAt
    ),
    createProductMemoryDraft(
      {
        domain: "coach_note",
        title: "Coach reflection memory foundation",
        summary:
          "Coach memory may store readiness and reflection note summaries, but not advisory recommendations, personal sensitive data, or outcome guarantees.",
        status: "draft",
        tags: ["coach", "reflection", "safe-prompts"],
        source: "journal-coach",
        relatedArea: "Journal / Coach",
        sensitivity: "internal",
        visibility: "user_visible",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "none",
      },
      checkedAt
    ),
  ].flatMap((result) => (result.ok ? [result.item] : []));
}

function getPlanAndAssistantMemoryItems(checkedAt: string): ProductMemoryItem[] {
  return [
    createProductMemoryDraft(
      {
        domain: "plan_readiness_note",
        title: "Public plan naming memory",
        summary:
          "Public plan names remain Free, Pro, VIP, and Institutional; paid activation and billing stay inactive until future explicit approval.",
        status: "accepted",
        tags: ["plans", "public-language"],
        source: "integration-mesh",
        relatedArea: "Plans",
        sensitivity: "internal",
        visibility: "internal_readiness",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "none",
      },
      checkedAt
    ),
    createProductMemoryDraft(
      {
        domain: "assistant_learning_note",
        title: "TPM Assistant safety memory",
        summary:
          "TPM Assistant may explain platform state, blocked reasons, plan access, feedback, journal prompts, and learning help; it cannot execute trades or promise outcomes.",
        status: "accepted",
        tags: ["assistant", "safety"],
        source: "assistant-context",
        relatedArea: "TPM Assistant",
        sensitivity: "internal",
        visibility: "internal_readiness",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "none",
      },
      checkedAt
    ),
  ].flatMap((result) => (result.ok ? [result.item] : []));
}

export function getProductMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  return [
    ...getFounderAcceptanceMemoryItems(checkedAt),
    ...getJournalCoachMemoryItems(checkedAt),
    ...getDecisionReplayMemoryItems(checkedAt),
    ...getBuildDecisionMemoryItems(checkedAt),
    ...getValidationSummaryMemoryItems(checkedAt),
    ...getProductGapMemoryItems(checkedAt),
    ...getLocalDayMemoryItems(checkedAt),
    ...getPlanAndAssistantMemoryItems(checkedAt),
  ];
}

export function getProductMemoryStoreSnapshot(
  checkedAt = new Date().toISOString()
): ProductMemoryStoreSnapshot {
  const items = getProductMemoryItems(checkedAt);
  const safeItems = filterSafeProductMemoryItems(items);
  const secretRejected = createProductMemoryDraft(
    {
      domain: "build_decision",
      title: "Forbidden secret sample",
      summary: "Secret sample intentionally rejected before storage.",
      status: "draft",
      tags: ["rejection-test"],
      source: "memory-safety-policy",
      relatedArea: "memory safety",
      sensitivity: "secret_forbidden",
      visibility: "hidden",
      productTruthImpact: "blocked_if_claimed",
      founderDecisionImpact: "blocked",
    },
    checkedAt
  );

  return {
    checkedAt,
    mode: "persistent_product_memory_foundation",
    storage: {
      persistence: "deterministic_local_readiness_model",
      databaseMigrationCreated: false,
      productionStorageActive: false,
      externalSyncActive: false,
      persistenceGap:
        "This command establishes a deterministic local/readiness memory model. Durable account-safe persistence remains planned and requires explicit future approval.",
    },
    policy: productMemorySafetyPolicy,
    items: safeItems,
    domainSummary: summarizeProductMemoryItems(safeItems),
    rejectedExamples: [
      {
        sensitivity: "secret_forbidden",
        rejected: true,
        reason: secretRejected.ok
          ? "unexpected acceptance"
          : secretRejected.rejectedReason,
      },
    ],
    founderSummary: {
      recentAcceptanceDecisions: safeItems
        .filter((item) => item.domain === "founder_acceptance")
        .slice(0, 4),
      openProductGaps: safeItems
        .filter((item) => item.domain === "product_gap" && item.status !== "resolved")
        .slice(0, 6),
      recentValidationSummaries: safeItems
        .filter((item) => item.domain === "validation_summary")
        .slice(0, 4),
      buildDecisions: safeItems
        .filter((item) => item.domain === "build_decision")
        .slice(0, 4),
      localDayReports: safeItems
        .filter((item) => item.domain === "local_day_report")
        .slice(0, 4),
      journalCoachReadiness:
        "Local/session memory foundation only; account-safe persistence is planned.",
      memorySafetyStatus: "safe_readiness_only",
      forbiddenStorageReminders: getForbiddenStorageReminders(),
    },
    truth: {
      secretsStored: false,
      privateSensitiveDataStored: false,
      rawUserTrackingEnabled: false,
      fakeUsersStored: false,
      fakeRevenueStored: false,
      fakeMetricsStored: false,
      productionStorageActive: false,
      automaticExternalSync: false,
      launchAutomation: false,
    },
  };
}

export function getProductMemorySummarySnapshot(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getProductMemoryStoreSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "product_memory_summary" as const,
    storage: snapshot.storage,
    policy: snapshot.policy,
    domainSummary: snapshot.domainSummary,
    rejectedExamples: snapshot.rejectedExamples,
    founderSummary: snapshot.founderSummary,
    truth: snapshot.truth,
  };
}
