import "server-only";
import { getNeverAloneActions } from "./never-alone-actions";
import { getSafeInternalActions } from "./safe-internal-actions";
import type { FounderBoundaryExplanation } from "./types";

function normalizeAction(action: string) {
  return action.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesAction(input: string, candidate: string) {
  const normalizedInput = normalizeAction(input);
  const normalizedCandidate = normalizeAction(candidate);
  return (
    normalizedInput === normalizedCandidate ||
    normalizedInput.includes(normalizedCandidate) ||
    normalizedCandidate.includes(normalizedInput)
  );
}

export function canAlKawnExecuteAlone(action: string) {
  return explainFounderBoundary(action).canExecuteAlone;
}

export function requiresAhmadApproval(action: string) {
  return explainFounderBoundary(action).requiresAhmad;
}

export function explainFounderBoundary(
  action: string
): FounderBoundaryExplanation {
  const neverAlone = getNeverAloneActions().find((candidate) =>
    matchesAction(action, candidate.label)
  );

  if (neverAlone) {
    return {
      action,
      decision: neverAlone.decision,
      matchedAction: neverAlone,
      requiresAhmad: true,
      canExecuteAlone: false,
      explanation: neverAlone.reason,
    };
  }

  const safeInternal = getSafeInternalActions().find((candidate) =>
    matchesAction(action, candidate.label)
  );

  if (safeInternal) {
    return {
      action,
      decision: safeInternal.decision,
      matchedAction: safeInternal,
      requiresAhmad: false,
      canExecuteAlone: true,
      explanation:
        "الكون may execute this alone only as private, non-sensitive, Product Truth preserving internal work.",
    };
  }

  return {
    action,
    decision: "requires_ahmad_approval",
    requiresAhmad: true,
    canExecuteAlone: false,
    explanation:
      "Unknown or ambiguous actions default to Ahmad approval until classified by the Absolute Founder Boundary.",
  };
}
