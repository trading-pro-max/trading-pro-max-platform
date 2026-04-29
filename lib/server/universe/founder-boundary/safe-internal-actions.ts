import "server-only";
import type { FounderBoundaryAction } from "./types";

const safeInternalLabels = [
  "read internal project state",
  "audit reports",
  "audit docs",
  "audit tests",
  "detect duplicates",
  "detect conflicts",
  "generate internal roadmap",
  "generate safe tasks",
  "generate Codex mission drafts",
  "update internal snapshots",
  "write non-sensitive reports",
  "write validation plans",
  "run local safe validations if available",
  "organize internal project tasks",
  "summarize WAKE REPORTS",
  "propose next action",
  "create private daily briefing",
  "check Product Truth visibility",
  "detect forbidden claims",
  "recommend cleanup",
] as const;

function toActionId(label: string) {
  return label.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase();
}

export function getSafeInternalActions(): FounderBoundaryAction[] {
  return safeInternalLabels.map((label) => ({
    id: `safe_${toActionId(label)}`,
    label,
    category: "safe_internal_work",
    decision: "safe_internal_execute_alone",
    reason: "Safe private internal work can be executed directly when Product Truth, privacy, no-secrets, and no-public-exposure boundaries remain intact.",
    productTruthImpact: "Preserves Product Truth and avoids money, trading, legal, public, brand, secrets, and irreversible activation.",
  }));
}
