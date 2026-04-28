import type {
  AhmadBrandApproval,
  BrandAdoptionPlan,
  BrandCandidate,
  DomainSearchTask,
  LegalReviewStatus,
  TrademarkSearchTask,
} from "./types";

export function evaluateBrandAdoptionGate({
  candidate,
  trademarkTasks,
  domainTasks,
  legalReviewStatus,
  ahmadApproval,
}: {
  candidate?: BrandCandidate;
  trademarkTasks: TrademarkSearchTask[];
  domainTasks: DomainSearchTask[];
  legalReviewStatus: LegalReviewStatus;
  ahmadApproval: AhmadBrandApproval;
}): BrandAdoptionPlan {
  const blockers: string[] = [];

  if (!candidate) blockers.push("No final candidate selected.");
  if (trademarkTasks.some((task) => task.status !== "completed")) {
    blockers.push("Trademark search tasks are not completed.");
  }
  if (domainTasks.some((task) => task.status !== "available_claimed_by_ahmad")) {
    blockers.push("Domain tasks are not completed or claimed by Ahmad.");
  }
  if (legalReviewStatus !== "cleared_with_notes") {
    blockers.push("Legal review is not complete.");
  }
  if (ahmadApproval.status !== "approved") {
    blockers.push("Ahmad approval is required.");
  }
  if (candidate?.name.match(/pro\s*max|alcon|alkon|apple|dell/i)) {
    blockers.push("Candidate conflicts with blocked or high-risk name families.");
  }

  if (blockers.length > 0) {
    return {
      adoptionStatus:
        legalReviewStatus === "required" || legalReviewStatus === "in_review"
          ? "needs_legal_review"
          : "needs_search",
      blockers,
      nextAction:
        "Complete manual trademark/domain/conflict checks, legal review, and Ahmad approval before adoption.",
      ahmadApproval,
    };
  }

  return {
    adoptionStatus: "ready_for_ahmad_review",
    blockers: [],
    nextAction: "Ahmad may approve private trial or public-use migration plan.",
    ahmadApproval,
  };
}

export function getBlockedBrandAdoptionGate(): BrandAdoptionPlan {
  return evaluateBrandAdoptionGate({
    trademarkTasks: [],
    domainTasks: [],
    legalReviewStatus: "required",
    ahmadApproval: {
      required: true,
      status: "not_requested",
      approvalScope: "candidate_review",
    },
  });
}
