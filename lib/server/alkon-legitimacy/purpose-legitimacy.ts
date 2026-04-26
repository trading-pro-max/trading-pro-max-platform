import { createLegitimacyReview } from "./dimensions";
import type { AlkonLegitimacyRequest, AlkonPurposeLegitimacyResult } from "./types";

const MISSION_SERVING_CATEGORIES = new Set([
  "public_ui_change",
  "trading_workspace_change",
  "assistant_behavior_change",
  "support_response",
  "codex_task_approval",
  "cleanup_removal",
  "security_setting_change",
  "emergency_lockdown",
]);

export function reviewPurposeLegitimacy(
  request: AlkonLegitimacyRequest
): AlkonPurposeLegitimacyResult {
  const unclear =
    request.description.trim().length < 16 ||
    /vanity|hype|because we can|just make it bigger/i.test(
      `${request.title} ${request.description}`
    );
  const missionServing = MISSION_SERVING_CATEGORIES.has(request.actionCategory);
  const outcome = unclear
    ? "review_required"
    : missionServing
      ? "pass"
      : "review_required";
  const review = createLegitimacyReview(
    request,
    "purpose_legitimacy",
    outcome,
    unclear
      ? "Purpose is unclear or risks vanity/clutter."
      : missionServing
        ? "Action serves product clarity, safety, user value, or internal governance."
        : "Purpose may be valid but needs explicit owner and mission alignment.",
    {
      requiredReview: outcome === "pass" ? [] : ["Founder purpose review"],
      memoryLesson: "Repeated overbuilding requires purpose review before construction.",
    }
  );

  return {
    ...review,
    missionAlignmentScore: outcome === "pass" ? 8 : 5,
    requiredOwner:
      request.affectedWorld === "public_earth"
        ? "Public Earth Owner"
        : "Alkon Founder Command Owner",
    nextSafeAction:
      outcome === "pass"
        ? "Proceed to truth, safety, timing, and rollback gates."
        : "Rewrite the action as a clear user, safety, trust, learning, support, or operations benefit.",
  };
}
