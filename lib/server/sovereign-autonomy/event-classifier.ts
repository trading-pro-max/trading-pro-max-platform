import "server-only";

import { createSovereignEvent } from "./event-state";
import type {
  FounderIdea,
  SovereignAffectedWorld,
  SovereignEvent,
  SovereignEventType,
  SovereignReviewArea,
  SovereignRiskLevel,
} from "./types";

type EventRule = {
  type: SovereignEventType;
  patterns: string[];
  affectedSurface: string;
  affectedWorld: SovereignAffectedWorld;
  riskLevel: SovereignRiskLevel;
  requiredReviews: SovereignReviewArea[];
  suggestedOwner: SovereignEvent["suggestedOwner"];
  productTruthImpact: string;
  publicUserImpact: string;
  founderImpact: string;
  suggestedNextAction: string;
};

const eventRules: EventRule[] = [
  {
    type: "billing_requested",
    patterns: ["billing", "checkout", "subscription", "invoice", "payment", "paid"],
    affectedSurface: "billing_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["product_truth", "security", "legal", "founder"],
    suggestedOwner: "Product Truth",
    productTruthImpact: "Billing must stay inactive and cannot be activated by idea intake.",
    publicUserImpact: "No checkout, paid entitlement, invoice, or subscription claim is exposed.",
    founderImpact: "Founder receives a blocked activation event for review history.",
    suggestedNextAction:
      "Record billing as blocked readiness only and draft future prerequisites without activation.",
  },
  {
    type: "live_execution_requested",
    patterns: ["live execution", "live trading", "execute live", "real trade", "trade live"],
    affectedSurface: "execution_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["product_truth", "guardian", "legal", "security", "founder"],
    suggestedOwner: "Product Truth",
    productTruthImpact: "Live execution remains blocked.",
    publicUserImpact: "Users continue to see paper-safe/inactive execution truth.",
    founderImpact: "Founder sees the blocked request and safe alternative.",
    suggestedNextAction:
      "Keep live execution blocked and produce only a readiness/legal prerequisite note.",
  },
  {
    type: "real_money_requested",
    patterns: ["real money", "cash", "fund account", "deposit", "withdraw", "real-money"],
    affectedSurface: "real_money_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["product_truth", "guardian", "legal", "security", "founder"],
    suggestedOwner: "Product Truth",
    productTruthImpact: "Real-money routing remains blocked.",
    publicUserImpact: "No real-money capability is implied.",
    founderImpact: "Founder receives a hard-blocked activation event.",
    suggestedNextAction:
      "Convert the request to a blocked state report and keep paper mode intact.",
  },
  {
    type: "broker_feed_requested",
    patterns: ["broker", "feed activation", "live feed", "broker/feed", "connect feed"],
    affectedSurface: "broker_feed_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["product_truth", "security", "legal", "founder"],
    suggestedOwner: "Integrations",
    productTruthImpact: "Broker/feed activation remains blocked unless future gates pass.",
    publicUserImpact: "No broker connection or real feed is claimed.",
    founderImpact: "Founder sees integration activation as blocked.",
    suggestedNextAction:
      "Keep broker/feed inactive and draft only sandbox/readiness prerequisites.",
  },
  {
    type: "social_publish_requested",
    patterns: ["publish", "post to", "social", "instagram", "x.com", "twitter", "tiktok"],
    affectedSurface: "social_publishing_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["guardian", "legal", "trust_governor", "founder"],
    suggestedOwner: "World Interface",
    productTruthImpact: "Social publishing remains inactive.",
    publicUserImpact: "No external post or social metric is created.",
    founderImpact: "Founder sees a blocked media/world-interface request.",
    suggestedNextAction:
      "Keep external publishing inactive and prepare review-only draft language.",
  },
  {
    type: "launch_requested",
    patterns: ["launch", "go live", "public launch", "release production"],
    affectedSurface: "public_launch_blocked",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["product_truth", "guardian", "legal", "security", "founder"],
    suggestedOwner: "Product Truth",
    productTruthImpact: "Public launch remains inactive and cannot be faked.",
    publicUserImpact: "No launch claim appears.",
    founderImpact: "Founder sees launch as blocked until real gates pass.",
    suggestedNextAction:
      "Keep launch inactive and route to launch readiness documentation only.",
  },
  {
    type: "secrets_risk",
    patterns: ["secret", "api key", "token", "password", "production env", "credential"],
    affectedSurface: "secrets_authority",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["secrets", "security", "founder"],
    suggestedOwner: "Secrets Authority",
    productTruthImpact: "Secrets must never be collected, displayed, sent to Codex, or stored in memory.",
    publicUserImpact: "No secret material is exposed.",
    founderImpact: "Founder sees the item quarantined.",
    suggestedNextAction:
      "Quarantine the request and return only redacted, presence-only readiness guidance.",
  },
  {
    type: "internal_language_leak",
    patterns: [
      "founder command",
      "founder king",
      "kingdom",
      "ministries",
      "councils",
      "presidency",
      "sovereign autonomy",
      "construction queue",
      "codex task",
      "secrets authority",
    ],
    affectedSurface: "public_private_boundary",
    affectedWorld: "public_user_world",
    riskLevel: "high",
    requiredReviews: ["public_private_boundary", "product_truth", "quality"],
    suggestedOwner: "Product",
    productTruthImpact: "Internal language must not leak to normal users.",
    publicUserImpact: "Public surfaces must stay simple and user-safe.",
    founderImpact: "Founder sees boundary risk requiring cleanup.",
    suggestedNextAction:
      "Replace public copy with normal product language and add leakage regression coverage.",
  },
  {
    type: "logo_rejection_detected",
    patterns: ["logo", "brand mark", "الشعار", "لوغو"],
    affectedSurface: "brand_identity",
    affectedWorld: "public_user_world",
    riskLevel: "medium",
    requiredReviews: ["visual_acceptance", "quality", "founder"],
    suggestedOwner: "Visual Identity",
    productTruthImpact: "Identity can improve without claiming external status.",
    publicUserImpact: "Public brand clarity may improve after Founder acceptance.",
    founderImpact: "Founder visual preference is captured.",
    suggestedNextAction:
      "Create a visual identity task passport with Founder approval before brand changes.",
  },
  {
    type: "chart_quality_low",
    patterns: ["chart", "الشارت", "workstation", "candles", "mزعج", "مزعج"],
    affectedSurface: "workstation",
    affectedWorld: "public_user_world",
    riskLevel: "medium",
    requiredReviews: ["visual_acceptance", "quality", "product"],
    suggestedOwner: "Design Ministry",
    productTruthImpact: "Chart polish must preserve paper-safe execution truth.",
    publicUserImpact: "Workspace readability may improve.",
    founderImpact: "Founder sees a chart-first repair candidate.",
    suggestedNextAction:
      "Draft a chart/workstation quality task with screenshots and regression checks.",
  },
  {
    type: "apps_platforms_gap",
    patterns: ["mobile app", "desktop app", "android", "ios", "platform", "أين تطبيق", "الموبايل"],
    affectedSurface: "apps_platforms",
    affectedWorld: "public_user_world",
    riskLevel: "medium",
    requiredReviews: ["product_truth", "product", "quality"],
    suggestedOwner: "Product",
    productTruthImpact: "Apps/platforms must be shown as planned or inactive unless real.",
    publicUserImpact: "Public users need clear platform readiness language.",
    founderImpact: "Founder sees a product gap routed to apps/platforms.",
    suggestedNextAction:
      "Clarify Apps / Platforms readiness without faking shipped mobile or desktop apps.",
  },
  {
    type: "support_gap",
    patterns: ["support", "help desk", "customer support", "contact us", "ticket"],
    affectedSurface: "support",
    affectedWorld: "public_user_world",
    riskLevel: "medium",
    requiredReviews: ["guardian", "legal", "trust_governor", "quality"],
    suggestedOwner: "World Interface",
    productTruthImpact:
      "Support readiness can improve without connecting external channels or sending messages.",
    publicUserImpact: "Support language may become clearer after review.",
    founderImpact: "Founder sees a support/world-interface readiness candidate.",
    suggestedNextAction:
      "Draft a support readiness task with no email, social, or external sending.",
  },
  {
    type: "security_risk",
    patterns: ["security", "auth", "vulnerability", "exploit", "attack", "hack"],
    affectedSurface: "security",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "critical",
    requiredReviews: ["security", "guardian", "legal", "founder"],
    suggestedOwner: "Public Security & Cyber Sovereignty",
    productTruthImpact:
      "Security requests must route through defensive review without weakening auth.",
    publicUserImpact: "No security controls or private details are exposed to normal users.",
    founderImpact: "Founder sees a quarantined security review event.",
    suggestedNextAction:
      "Route to Security/Founder review and keep implementation blocked until scoped.",
  },
  {
    type: "codex_task_needed",
    patterns: ["codex", "build", "ينفذ", "نفذ", "implement", "fix"],
    affectedSurface: "codex_governance",
    affectedWorld: "private_founder_world",
    riskLevel: "low",
    requiredReviews: ["product_truth", "engineering"],
    suggestedOwner: "Codex Sovereign Construction State",
    productTruthImpact: "Codex may draft only within task passport and license boundaries.",
    publicUserImpact: "No public UI impact unless a later task is implemented.",
    founderImpact: "Founder receives a draft-ready construction event.",
    suggestedNextAction:
      "Generate a Task Passport, Codex License, and manual-only Codex-ready task draft.",
  },
  {
    type: "safe_docs_update_needed",
    patterns: ["docs", "documentation", "constitution", "policy"],
    affectedSurface: "docs",
    affectedWorld: "invisible_operating_layer",
    riskLevel: "low",
    requiredReviews: ["product_truth", "quality"],
    suggestedOwner: "Product",
    productTruthImpact: "Docs can clarify blocked states without activation.",
    publicUserImpact: "No public user complexity is introduced.",
    founderImpact: "Founder gains clearer operating rules.",
    suggestedNextAction: "Draft a docs-only update with validation.",
  },
  {
    type: "visual_gap_detected",
    patterns: ["visual", "looks bad", "ugly", "لا يعجبني", "design"],
    affectedSurface: "visual_quality",
    affectedWorld: "public_user_world",
    riskLevel: "medium",
    requiredReviews: ["visual_acceptance", "quality", "founder"],
    suggestedOwner: "Design Ministry",
    productTruthImpact: "Visual improvement must not fake maturity.",
    publicUserImpact: "Public polish can improve after review.",
    founderImpact: "Founder preference becomes actionable.",
    suggestedNextAction:
      "Route to Design/Quality and create a screenshot-backed task draft.",
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function findRule(idea: FounderIdea): EventRule | undefined {
  const haystack = normalizeText(
    `${idea.title} ${idea.rawIdea} ${idea.summary} ${idea.affectedSurface} ${idea.suspectedCategory}`
  );

  return eventRules.find((rule) =>
    rule.patterns.some((pattern) => haystack.includes(pattern.toLowerCase()))
  );
}

export function classifyFounderIdeaEvent(
  idea: FounderIdea,
  checkedAt = idea.createdAt
): SovereignEvent {
  const rule = findRule(idea);

  if (!rule) {
    return createSovereignEvent({
      type: "founder_idea_received",
      title: idea.title,
      summary: idea.summary,
      source: idea.source,
      affectedWorld: idea.affectedWorld,
      affectedSurface: idea.affectedSurface,
      riskLevel: idea.urgency === "critical" ? "high" : "low",
      productTruthImpact: "Idea must be checked against Product Truth before any task is drafted.",
      publicUserImpact: "No public user impact until reviewed.",
      founderImpact: "Founder idea is captured for routing.",
      requiredReviews: ["product_truth"],
      suggestedOwner: "Founder Command",
      suggestedNextAction:
        "Classify the idea, route it to an owner, and prepare a safe next action.",
      createdAt: checkedAt,
    });
  }

  return createSovereignEvent({
    type: rule.type,
    title: idea.title,
    summary: idea.summary,
    source: idea.source,
    affectedWorld: idea.affectedWorld ?? rule.affectedWorld,
    affectedSurface: idea.affectedSurface || rule.affectedSurface,
    riskLevel: rule.riskLevel,
    productTruthImpact: rule.productTruthImpact,
    publicUserImpact: rule.publicUserImpact,
    founderImpact: rule.founderImpact,
    requiredReviews: rule.requiredReviews,
    suggestedOwner: rule.suggestedOwner,
    suggestedNextAction: rule.suggestedNextAction,
    createdAt: checkedAt,
  });
}
