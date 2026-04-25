import "server-only";

import { interpretValidationReport } from "@/lib/server/codex-construction";
import { createProductMemoryDraft } from "./store";
import type { ProductMemoryItem, ValidationMemoryCommandStatus } from "./types";

export const requiredValidationCommands = [
  "npx tsc --noEmit",
  "npx eslint app modules tests --max-warnings=0",
  "npm run build",
  "npm run prisma:validate",
  "npm run test:regression",
  "npm run smoke:routes",
  "git diff --check",
  "git status --short",
];

export function getValidationSummaryMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  const interpretation = interpretValidationReport(
    {
      text: requiredValidationCommands.join(" ") + " pass",
      changedFiles: [],
      pushed: false,
      clean: true,
    },
    checkedAt
  );
  const result = createProductMemoryDraft(
    {
      domain: "validation_summary",
      title: "Validation memory stores summaries only",
      summary:
        `Validation memory captures command pass/fail, changed files, clean status, visual proof presence, and recommended next action; raw logs are not persisted. Sample status: ${interpretation.status}.`,
      status: "draft",
      tags: ["validation", "summary-only"],
      source: "validation-interpreter",
      relatedArea: "build validation",
      sensitivity: "internal",
      visibility: "internal_readiness",
      productTruthImpact: "preserves_truth",
      founderDecisionImpact: "review_later",
    },
    checkedAt
  );

  return result.ok ? [result.item] : [];
}

export function getValidationSummaryMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const commandStatuses: ValidationMemoryCommandStatus[] =
    requiredValidationCommands.map((command) => ({
      command,
      status: "not_run",
    }));
  const items = getValidationSummaryMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "validation_summary_memory_readiness" as const,
    commandStatuses,
    items,
    storagePolicy: "summary_only_no_raw_logs",
    truth: {
      rawLogsStored: false,
      secretsStored: false,
      falsePassAllowed: false,
      visualProofTrackedAsPresenceOnly: true,
    },
  };
}
