import { createLegitimacyReview } from "./dimensions";
import type { AlkonLegitimacyRequest } from "./types";

export function reviewUserLegitimacy(request: AlkonLegitimacyRequest) {
  const text = `${request.title} ${request.description}`;
  const harmsUser =
    /dark pattern|pressure|force upgrade|hide risk|confuse|clutter/i.test(text) ||
    (request.publicVisible && request.actionCategory === "plan_claim_change");
  const helpsUser = /clarity|support|learning|workspace|accessibility|privacy|trust|paper/i.test(text);

  return createLegitimacyReview(
    request,
    "user_legitimacy",
    harmsUser ? "blocked" : helpsUser ? "pass" : "review_required",
    harmsUser
      ? "Action risks user trust, clarity, privacy, accessibility, or upgrade pressure."
      : helpsUser
        ? "Action helps a real public Earth user understand, practice, learn, or get support."
        : "User benefit needs clearer evidence.",
    {
      requiredReview: harmsUser ? ["Guardian review"] : helpsUser ? [] : ["User benefit review"],
      safeAlternative: "Convert the action into a public-safe explanation, support path, or accessibility improvement.",
      memoryLesson: "Public user benefit must be real, not cosmetic pressure.",
    }
  );
}
