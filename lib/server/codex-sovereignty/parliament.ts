import "server-only";

import { evaluateCodexTaskConstitution } from "./constitution";
import type {
  CodexConstructionRequest,
  CodexReviewArea,
  CodexTaskParliamentDecision,
} from "./types";

export const codexSampleConstructionRequests: CodexConstructionRequest[] = [
  {
    requestId: "codex_req_docs_typo",
    title: "Fix typo in docs",
    reason: "Documentation copy has a small wording issue.",
    category: "docs_update",
    affectedSurface: "docs/product",
    userImpact: "none",
    founderImpact: "clearer internal doctrine",
    riskLevel: "low",
    duplicationCheck: "new",
    timing: "now",
    affectedFiles: ["docs/product/**/*.md"],
  },
  {
    requestId: "codex_req_copy_cleanup",
    title: "Clean public copy labels",
    reason: "Public labels need a small cleanup without plan or legal claims.",
    category: "copy_cleanup",
    affectedSurface: "public user world",
    userImpact: "clearer public language",
    founderImpact: "lower confusion risk",
    riskLevel: "low",
    duplicationCheck: "new",
    timing: "next",
    affectedFiles: ["modules/**/*.tsx", "lib/i18n/**/*.ts"],
  },
  {
    requestId: "codex_req_logo_redesign",
    title: "Redesign logo",
    reason: "Logo identity needs visual review before any implementation.",
    category: "logo_identity",
    affectedSurface: "brand identity",
    userImpact: "major public first impression",
    founderImpact: "Founder visual acceptance required",
    riskLevel: "high",
    duplicationCheck: "new",
    timing: "later",
    affectedFiles: ["app/icon.svg", "modules/**/*.tsx", "docs/**/*.md"],
  },
  {
    requestId: "codex_req_visual_css",
    title: "Tighten chart panel CSS polish",
    reason: "Chart presentation needs scoped CSS polish only.",
    category: "visual_polish",
    affectedSurface: "Trading Workspace chart",
    userImpact: "chart-first usability",
    founderImpact: "Ahmad visual review may be needed",
    riskLevel: "medium",
    duplicationCheck: "new",
    timing: "next",
    affectedFiles: ["app/globals.css", "modules/shell/components/**/*.tsx"],
  },
  {
    requestId: "codex_req_delete_tree",
    title: "Delete unused component tree",
    reason: "Large removal request needs ownership and rollback review.",
    category: "public_ui",
    affectedSurface: "public interface components",
    userImpact: "possible regression",
    founderImpact: "needs scope approval",
    riskLevel: "high",
    duplicationCheck: "merge_candidate",
    timing: "later",
    affectedFiles: ["modules/**/*.tsx"],
  },
  {
    requestId: "codex_req_activate_billing",
    title: "Activate billing",
    reason: "Turn on checkout and paid plan activation.",
    category: "billing_blocked",
    affectedSurface: "Plans",
    userImpact: "real payment path",
    founderImpact: "blocked real-world activation",
    riskLevel: "critical",
    duplicationCheck: "new",
    timing: "blocked",
  },
  {
    requestId: "codex_req_expose_founder_to_vip",
    title: "Expose Founder Command to VIP users",
    reason: "Let VIP users see internal construction controls.",
    category: "founder_command",
    affectedSurface: "private command routes",
    userImpact: "would leak internal controls",
    founderImpact: "public/private boundary violation",
    riskLevel: "critical",
    duplicationCheck: "new",
    timing: "blocked",
  },
  {
    requestId: "codex_req_broker_feed",
    title: "Connect broker/feed",
    reason: "Activate broker and external market feed integrations.",
    category: "broker_feed_blocked",
    affectedSurface: "broker/feed",
    userImpact: "real-world data and broker path",
    founderImpact: "blocked activation request",
    riskLevel: "critical",
    duplicationCheck: "new",
    timing: "blocked",
  },
  {
    requestId: "codex_req_live_execution",
    title: "Enable live execution",
    reason: "Route real-money orders from the web app.",
    category: "live_execution_blocked",
    affectedSurface: "execution layer",
    userImpact: "real-money trading risk",
    founderImpact: "hard block",
    riskLevel: "critical",
    duplicationCheck: "new",
    timing: "blocked",
  },
  {
    requestId: "codex_req_public_launch",
    title: "Claim public launch readiness",
    reason: "Publish launch-ready language and activate social channels.",
    category: "launch_blocked",
    affectedSurface: "public launch",
    userImpact: "launch claim",
    founderImpact: "blocked until final review",
    riskLevel: "critical",
    duplicationCheck: "new",
    timing: "blocked",
  },
];

function ownerAreaForRequest(request: CodexConstructionRequest) {
  const areas: Record<CodexConstructionRequest["category"], string> = {
    docs_update: "Product Documentation",
    test_update: "Quality",
    copy_cleanup: "Product Truth",
    lint_cleanup: "Engineering Quality",
    type_cleanup: "Engineering Quality",
    visual_polish: "Design",
    css_polish: "Design",
    public_ui: "Product + UX",
    logo_identity: "Visual Identity",
    assistant_behavior: "Assistant + Product Truth",
    journal_coach: "Journal Coach",
    diagnostics: "Diagnostics",
    settings: "Settings",
    founder_command: "Founder Command",
    security: "Security",
    secrets: "Secrets Authority",
    world_interface: "World Interface",
    media_readiness: "Media Office",
    academy_community: "Academy + Community",
    billing_blocked: "Product Truth",
    broker_feed_blocked: "Security",
    live_execution_blocked: "Security",
    launch_blocked: "Product Truth",
  };

  return areas[request.category];
}

function reviewsForRequest(
  request: CodexConstructionRequest,
  constitutionDecision: ReturnType<typeof evaluateCodexTaskConstitution>["decision"]
): CodexReviewArea[] {
  const reviews = new Set<CodexReviewArea>(["Product Truth", "Quality"]);

  if (constitutionDecision === "founder_approval_required") reviews.add("Founder");
  if (request.riskLevel === "high" || request.riskLevel === "critical") {
    reviews.add("Founder");
  }
  if (
    request.category === "security" ||
    request.category === "secrets" ||
    request.category === "broker_feed_blocked" ||
    request.category === "live_execution_blocked" ||
    request.category === "founder_command"
  ) {
    reviews.add("Security");
  }
  if (
    request.category === "billing_blocked" ||
    request.category === "launch_blocked" ||
    request.reason.toLowerCase().includes("legal") ||
    request.reason.toLowerCase().includes("pricing")
  ) {
    reviews.add("Legal");
    reviews.add("Guardian");
  }
  if (request.category === "logo_identity" || request.category === "visual_polish") {
    reviews.add("Design");
  }
  if (request.category === "world_interface") reviews.add("World Interface");
  if (request.category === "secrets") reviews.add("Secrets Authority");
  if (request.category === "copy_cleanup" || request.category === "public_ui") {
    reviews.add("Public Language");
  }

  return [...reviews];
}

export function decideCodexTaskRequest(
  request: CodexConstructionRequest
): CodexTaskParliamentDecision {
  const constitutionRule = evaluateCodexTaskConstitution(request);
  const lower = `${request.title} ${request.reason}`.toLowerCase();
  const leaksFounderCommand =
    request.category === "founder_command" &&
    (lower.includes("vip") || lower.includes("public") || lower.includes("users"));
  const deletingMajorTree =
    lower.includes("delete") && (lower.includes("tree") || lower.includes("major"));
  const requiredReviews = reviewsForRequest(request, constitutionRule.decision);

  if (constitutionRule.decision === "block" || leaksFounderCommand) {
    return {
      requestId: request.requestId,
      taskTitle: request.title,
      category: request.category,
      decision: "block",
      constitutionDecision: leaksFounderCommand ? "block" : constitutionRule.decision,
      reason: leaksFounderCommand
        ? "Founder Command cannot be exposed to normal users or plans."
        : constitutionRule.reason,
      ownerArea: ownerAreaForRequest(request),
      priority: "blocked",
      nextAction: leaksFounderCommand
        ? "Keep private command route owner-only and record the blocked boundary request."
        : constitutionRule.safeAlternative,
      founderReviewNeeded: true,
      legalReviewNeeded: requiredReviews.includes("Legal"),
      guardianReviewNeeded: requiredReviews.includes("Guardian"),
      securityReviewNeeded: requiredReviews.includes("Security"),
      requiredReviews,
    };
  }

  if (request.duplicationCheck === "duplicate") {
    return {
      requestId: request.requestId,
      taskTitle: request.title,
      category: request.category,
      decision: "merge_with_existing_task",
      constitutionDecision: constitutionRule.decision,
      reason: "The request duplicates an existing construction item.",
      ownerArea: ownerAreaForRequest(request),
      priority: "low",
      nextAction: "Merge the request into the existing passport before drafting.",
      founderReviewNeeded: requiredReviews.includes("Founder"),
      legalReviewNeeded: requiredReviews.includes("Legal"),
      guardianReviewNeeded: requiredReviews.includes("Guardian"),
      securityReviewNeeded: requiredReviews.includes("Security"),
      requiredReviews,
    };
  }

  if (deletingMajorTree) {
    return {
      requestId: request.requestId,
      taskTitle: request.title,
      category: request.category,
      decision: "review_required",
      constitutionDecision: "review_required",
      reason: "Large deletion requests require explicit scope, rollback, and review.",
      ownerArea: ownerAreaForRequest(request),
      priority: "high",
      nextAction: "Draft a review-only passport before any deletion work.",
      founderReviewNeeded: true,
      legalReviewNeeded: requiredReviews.includes("Legal"),
      guardianReviewNeeded: requiredReviews.includes("Guardian"),
      securityReviewNeeded: requiredReviews.includes("Security"),
      requiredReviews,
    };
  }

  if (constitutionRule.decision === "founder_approval_required") {
    return {
      requestId: request.requestId,
      taskTitle: request.title,
      category: request.category,
      decision: "founder_approval_required",
      constitutionDecision: constitutionRule.decision,
      reason: constitutionRule.reason,
      ownerArea: ownerAreaForRequest(request),
      priority: request.riskLevel === "high" ? "high" : "medium",
      nextAction: constitutionRule.safeAlternative,
      founderReviewNeeded: true,
      legalReviewNeeded: requiredReviews.includes("Legal"),
      guardianReviewNeeded: requiredReviews.includes("Guardian"),
      securityReviewNeeded: requiredReviews.includes("Security"),
      requiredReviews,
    };
  }

  if (constitutionRule.decision === "review_required") {
    return {
      requestId: request.requestId,
      taskTitle: request.title,
      category: request.category,
      decision: "review_required",
      constitutionDecision: constitutionRule.decision,
      reason: constitutionRule.reason,
      ownerArea: ownerAreaForRequest(request),
      priority: "medium",
      nextAction: constitutionRule.safeAlternative,
      founderReviewNeeded: requiredReviews.includes("Founder"),
      legalReviewNeeded: requiredReviews.includes("Legal"),
      guardianReviewNeeded: requiredReviews.includes("Guardian"),
      securityReviewNeeded: requiredReviews.includes("Security"),
      requiredReviews,
    };
  }

  return {
    requestId: request.requestId,
    taskTitle: request.title,
    category: request.category,
    decision: "approve_for_draft",
    constitutionDecision: constitutionRule.decision,
    reason: constitutionRule.reason,
    ownerArea: ownerAreaForRequest(request),
    priority: request.timing === "now" ? "medium" : "low",
    nextAction: "Generate a scoped task passport and Codex-ready prompt.",
    founderReviewNeeded: requiredReviews.includes("Founder"),
    legalReviewNeeded: requiredReviews.includes("Legal"),
    guardianReviewNeeded: requiredReviews.includes("Guardian"),
    securityReviewNeeded: requiredReviews.includes("Security"),
    requiredReviews,
  };
}

export function getCodexTaskParliamentDecisions() {
  return codexSampleConstructionRequests.map(decideCodexTaskRequest);
}
