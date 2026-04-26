import "server-only";

import type {
  OwnerRoute,
  SovereignEvent,
  SovereignOwnerArea,
  SovereignReviewArea,
} from "./types";

function route(
  ownerArea: SovereignOwnerArea,
  supportingAreas: SovereignOwnerArea[],
  requiredReviews: SovereignReviewArea[],
  recommendedQueue: OwnerRoute["recommendedQueue"],
  escalationTarget: OwnerRoute["escalationTarget"],
  publicVisible = false
): OwnerRoute {
  return {
    ownerArea,
    supportingAreas,
    requiredReviews,
    founderVisible: true,
    publicVisible,
    recommendedQueue,
    escalationTarget,
  };
}

export function routeSovereignEvent(event: SovereignEvent): OwnerRoute {
  if (event.type === "visual_gap_detected" || event.type === "chart_quality_low") {
    return route(
      "Design Ministry",
      ["Product", "Quality"],
      ["visual_acceptance", "quality", "product_truth"],
      "design_quality_review",
      "founder_command"
    );
  }

  if (event.type === "logo_rejection_detected") {
    return route(
      "Visual Identity",
      ["Brand", "Quality"],
      ["visual_acceptance", "founder", "quality"],
      "brand_identity_review",
      "founder_command"
    );
  }

  if (event.type === "assistant_behavior_gap") {
    return route(
      "Assistant",
      ["Product Truth", "Guardian", "Legal"],
      ["product_truth", "guardian", "legal"],
      "assistant_truth_review",
      "guardian"
    );
  }

  if (
    event.type === "public_navigation_gap" ||
    event.type === "public_user_confusion"
  ) {
    return route(
      "Product",
      ["UX", "Quality"],
      ["product_truth", "quality"],
      "public_product_gap_review",
      "founder_command"
    );
  }

  if (event.type === "apps_platforms_gap") {
    return route(
      "Product",
      ["Integrations", "Public User World"],
      ["product_truth", "quality"],
      "public_product_gap_review",
      "founder_command"
    );
  }

  if (event.type === "support_gap" || event.type === "world_interface_request") {
    return route(
      "World Interface",
      ["Support", "Guardian", "Legal"],
      ["guardian", "legal", "trust_governor"],
      "world_interface_review",
      "presidency"
    );
  }

  if (event.type === "secrets_risk") {
    return route(
      "Secrets Authority",
      ["Security", "Founder Command"],
      ["secrets", "security", "founder"],
      "security_quarantine",
      "secrets_authority"
    );
  }

  if (event.type === "security_risk") {
    return route(
      "Public Security & Cyber Sovereignty",
      ["Guardian", "Legal", "Founder Command"],
      ["security", "guardian", "legal", "founder"],
      "security_quarantine",
      "security"
    );
  }

  if (
    event.type === "billing_requested" ||
    event.type === "live_execution_requested" ||
    event.type === "broker_feed_requested" ||
    event.type === "real_money_requested" ||
    event.type === "social_publish_requested" ||
    event.type === "launch_requested"
  ) {
    return route(
      "Product Truth",
      ["Security", "Legal", "Guardian", "Treasury"],
      ["product_truth", "security", "legal", "guardian", "founder"],
      "blocked_activation_log",
      "founder_command"
    );
  }

  if (event.type === "codex_task_needed") {
    return route(
      "Codex Sovereign Construction State",
      ["Product Truth", "Quality", "Founder Command"],
      ["product_truth", "engineering", "quality"],
      "codex_construction_draft",
      "founder_command"
    );
  }

  if (event.type === "local_day_report_needed") {
    return route(
      "Local Operations",
      ["Founder Command", "Product Memory"],
      ["product_truth", "quality"],
      "local_day_queue",
      "founder_command"
    );
  }

  if (
    event.type === "safe_docs_update_needed" ||
    event.type === "safe_test_update_needed" ||
    event.type === "safe_copy_cleanup_needed"
  ) {
    return route(
      "Product Memory",
      ["Product", "Quality"],
      ["product_truth", "quality"],
      "product_memory_queue",
      "none"
    );
  }

  return route(
    event.suggestedOwner,
    ["Product", "Quality"],
    event.requiredReviews,
    "product_memory_queue",
    event.riskLevel === "high" || event.riskLevel === "critical"
      ? "founder_command"
      : "none"
  );
}
