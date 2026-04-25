import "server-only";

import { getDecisionReplayFoundation } from "@/lib/server/journal-coach";
import { createProductMemoryDraft } from "./store";
import type { ProductMemoryItem } from "./types";

export function getDecisionReplayMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  const replay = getDecisionReplayFoundation();
  const result = createProductMemoryDraft(
    {
      domain: "decision_replay_note",
      title: "Paper decision replay memory foundation",
      summary:
        `${replay.selectedSymbol} ${replay.timeframe} replay stores product truth, fallback/paper state, bounded Assistant guidance, and learning prompts only.`,
      status: "future",
      tags: ["decision-replay", "paper", "learning"],
      source: "journal-coach",
      relatedArea: "Journal / Coach",
      sensitivity: "internal",
      visibility: "internal_readiness",
      productTruthImpact: "preserves_truth",
      founderDecisionImpact: "review_later",
    },
    checkedAt
  );

  return result.ok ? [result.item] : [];
}

export function getDecisionReplayMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const replay = getDecisionReplayFoundation();
  const items = getDecisionReplayMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "decision_replay_memory_readiness" as const,
    replay,
    items,
    allowedStorage: [
      "symbol/timeframe label",
      "product truth state",
      "feed and paper/live state",
      "blocked/allowed status",
      "Assistant guidance label",
      "note summary",
      "lesson learned",
    ],
    forbiddenStorage: [
      "real broker credentials",
      "real-money order credentials",
      "sensitive private user details",
      "fake market outcomes",
      "profit guarantees",
    ],
    truth: {
      realMoneyRecordsStored: false,
      brokerCredentialsStored: false,
      fakeOutcomesStored: false,
      profitGuaranteesStored: false,
    },
  };
}
