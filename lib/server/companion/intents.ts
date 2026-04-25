import "server-only";

import type {
  CompanionBlockedIntentAvailability,
  CompanionBlockedIntentCategory,
  CompanionIntentAvailability,
  CompanionIntentCategory,
} from "./types";

const allowedPlanAccess = {
  demoFree: "allowed",
  pro: "allowed",
  vip: "allowed",
  enterprise: "future",
} as const;

function allowedIntent(
  intent: CompanionIntentCategory,
  label: string,
  safetyBoundary: string,
  responseStyle: string,
  blockedLanguage: string[],
  access: Pick<
    CompanionIntentAvailability,
    "demoFree" | "pro" | "vip" | "enterprise"
  > = allowedPlanAccess
): CompanionIntentAvailability {
  return {
    intent,
    label,
    ...access,
    safetyBoundary,
    responseStyle,
    blockedLanguage,
  };
}

function blockedIntent(
  intent: CompanionBlockedIntentCategory,
  label: string,
  blockedReason: string,
  safeAlternative: string
): CompanionBlockedIntentAvailability {
  return {
    intent,
    label,
    allowedPlans: [],
    responseStyle: "blocked_with_safe_alternative",
    safetyBoundary:
      "TPM Assistant may explain product truth and safe alternatives, but it cannot execute, activate, bypass, publish, advise, or fake capability state.",
    blockedReason,
    safeAlternative,
  };
}

export const companionAllowedIntents: CompanionIntentAvailability[] = [
  allowedIntent(
    "explain_platform_state",
    "Explain platform state",
    "Explain route, paper/live truth, plan state, diagnostics, and readiness only.",
    "calm, compact, platform-aware",
    ["production ready", "live ready", "guaranteed outcome"]
  ),
  allowedIntent(
    "explain_blocked_state",
    "Explain why blocked",
    "Use Why Blocked explanations and safe next steps.",
    "direct reason plus safe alternative",
    ["bypass", "force enable", "unlock now"]
  ),
  allowedIntent(
    "explain_plan_access",
    "Explain plan access",
    "Use public plan names only and do not claim paid activation.",
    "truthful entitlement summary",
    ["legacy internal plan label", "paid active", "VIP enabled", "checkout available"]
  ),
  allowedIntent(
    "explain_account_type",
    "Explain account type",
    "Explain account type status without certification claims.",
    "short legal-safe account wording",
    ["Sharia certified", "guaranteed compliant"]
  ),
  allowedIntent(
    "explain_paper_mode",
    "Explain paper mode",
    "Explain rehearsal mode without implying live execution or cash routing.",
    "paper-safe and learning-oriented",
    ["real funds", "live order", "cash routing"]
  ),
  allowedIntent(
    "explain_feed_fallback",
    "Explain feed fallback",
    "Explain fallback-first market context without pretending a live feed exists.",
    "transparent fallback wording",
    ["real-time feed active", "broker data connected"]
  ),
  allowedIntent(
    "explain_billing_inactive",
    "Explain billing inactive",
    "Explain that checkout and paid access are inactive.",
    "compact product-truth wording",
    ["pay now", "checkout available", "paid upgrade active"]
  ),
  allowedIntent(
    "explain_live_disabled",
    "Explain live disabled",
    "Explain live execution is blocked and not user-toggleable.",
    "firm safety wording",
    ["enable live now", "live trading ready"]
  ),
  allowedIntent(
    "explain_real_money_blocked",
    "Explain real money blocked",
    "Explain real-money routing is blocked and no funding route exists.",
    "firm safety wording",
    ["fund account", "cash trade", "real money route"]
  ),
  allowedIntent(
    "explain_market_context",
    "Explain market context",
    "Decision support only; no prediction certainty or trade signal.",
    "educational, fallback-labeled",
    ["sure signal", "win-rate", "guaranteed profit"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "guide_to_settings",
    "Guide to settings",
    "Navigation guidance only; cannot change secrets or enable live systems.",
    "short navigation hint",
    ["configure broker", "activate billing"]
  ),
  allowedIntent(
    "guide_to_diagnostics",
    "Guide to diagnostics",
    "Diagnostics guidance only; no restricted controls or private data.",
    "compact route and readiness guidance",
    ["secret values", "production keys"]
  ),
  allowedIntent(
    "guide_to_feedback",
    "Guide to feedback",
    "Feedback drafting only; no private sensitive data.",
    "short draft with route/context summary",
    ["password", "token", "broker credentials"]
  ),
  allowedIntent(
    "draft_feedback",
    "Draft feedback",
    "Draft locally and avoid secrets or private data.",
    "structured issue summary",
    ["secret", "token", "password"]
  ),
  allowedIntent(
    "journal_prompt",
    "Journal prompt",
    "Reflection only; no financial advice or performance guarantee.",
    "paper-session reflection",
    ["you should trade", "guaranteed improvement"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "coach_prompt",
    "Coach prompt",
    "Caution and reflection only; no pressure to trade.",
    "calm coaching prompt",
    ["trade now", "must enter", "sure setup"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "session_summary",
    "Session summary",
    "Paper-session summary only; no performance guarantee.",
    "reflective and non-predictive",
    ["you would have won", "guaranteed better result"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "learning_help",
    "Learning help",
    "Education only; no financial advice.",
    "skill-level adaptive",
    ["financial advice", "buy now", "sure trade"]
  ),
  allowedIntent(
    "explain_upgrade_path_without_billing",
    "Explain upgrade path without billing",
    "Explain Pro/VIP/Institutional roadmap truth without checkout, paid activation, or urgency pressure.",
    "truthful plan ladder summary",
    ["pay now", "VIP active", "limited offer", "checkout available"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "explain_plan_upgrade_without_billing",
    "Explain plan upgrade without billing",
    "Compatibility alias for the upgrade path explanation.",
    "truthful plan ladder summary",
    ["pay now", "VIP active", "limited offer", "checkout available"],
    { demoFree: "allowed", pro: "planned", vip: "planned", enterprise: "future" }
  ),
  allowedIntent(
    "founder_unavailable_for_user",
    "Restricted controls unavailable",
    "Restricted controls are separate and never a user-plan feature.",
    "clear restricted-access explanation",
    ["admin access", "private route", "plan unlock"],
    { demoFree: "blocked", pro: "blocked", vip: "blocked", enterprise: "blocked" }
  ),
];

export const companionBlockedIntentRegistry: CompanionBlockedIntentAvailability[] = [
  blockedIntent(
    "execute_trade",
    "Execute trade",
    "TPM Assistant has no trading authority.",
    "Use paper-mode reflection or ask why execution is blocked."
  ),
  blockedIntent(
    "enable_live",
    "Enable live",
    "Live execution is blocked by Product Truth.",
    "Review why live is disabled and continue in paper mode."
  ),
  blockedIntent(
    "enable_real_money",
    "Use real money",
    "Real-money routing is blocked and no funding route exists.",
    "Use paper-only mode and review diagnostics."
  ),
  blockedIntent(
    "activate_broker",
    "Activate broker",
    "Broker activation is not configured or approved.",
    "Review broker readiness as blocked/unconfigured."
  ),
  blockedIntent(
    "activate_feed",
    "Activate feed",
    "External live feed activation is not configured or approved.",
    "Use fallback-labeled market context."
  ),
  blockedIntent(
    "activate_billing",
    "Activate billing",
    "Billing and checkout are inactive.",
    "Explain plan value without paid activation."
  ),
  blockedIntent(
    "reveal_secrets",
    "Reveal secrets",
    "Secrets, credentials, tokens, and keys are forbidden.",
    "Use diagnostics summaries without raw secret values."
  ),
  blockedIntent(
    "bypass_auth",
    "Bypass auth",
    "Authentication and access boundaries cannot be bypassed.",
    "Use normal sign-in or public-safe routes."
  ),
  blockedIntent(
    "guarantee_profit",
    "Guarantee profit",
    "Profit guarantees are unsafe and not allowed.",
    "Ask for educational risk/context framing instead."
  ),
  blockedIntent(
    "provide_win_rate",
    "Provide win rate",
    "Win-rate claims are not supported and must not be invented.",
    "Ask for a journal or paper-session review prompt."
  ),
  blockedIntent(
    "fake_vip_activation",
    "Fake VIP activation",
    "VIP is not active unless real entitlement gates exist.",
    "Explain VIP as planned or locked truth."
  ),
  blockedIntent(
    "fake_institutional_activation",
    "Fake Institutional activation",
    "Institutional remains future planned.",
    "Explain future institutional support without claiming access."
  ),
  blockedIntent(
    "fake_billing",
    "Fake billing",
    "Checkout and paid activation are inactive.",
    "Explain billing inactive truth."
  ),
  blockedIntent(
    "fake_launch",
    "Fake launch",
    "Public launch is inactive and cannot be claimed.",
    "Use local/internal readiness language only."
  ),
  blockedIntent(
    "publish_social",
    "Publish social",
    "Social publishing and accounts are inactive.",
    "Keep content as internal draft/review."
  ),
  blockedIntent(
    "provide_legal_advice",
    "Provide legal advice",
    "TPM Assistant cannot provide legal advice.",
    "Offer general product-truth wording and recommend qualified review."
  ),
  blockedIntent(
    "provide_financial_advice",
    "Provide financial advice",
    "TPM Assistant cannot provide financial advice.",
    "Offer educational paper-mode reflection instead."
  ),
];

type IntentMatch = {
  phrases: string[];
  intent: CompanionIntentCategory | CompanionBlockedIntentCategory;
  blocked: boolean;
};

const intentMatches: IntentMatch[] = [
  { phrases: ["activate live", "enable live", "live trading"], intent: "enable_live", blocked: true },
  { phrases: ["real money", "real funds", "cash"], intent: "enable_real_money", blocked: true },
  { phrases: ["broker secret", "show secret", "api key", "password"], intent: "reveal_secrets", blocked: true },
  { phrases: ["guarantee profit", "guaranteed profit"], intent: "guarantee_profit", blocked: true },
  { phrases: ["win rate", "win-rate"], intent: "provide_win_rate", blocked: true },
  { phrases: ["activate broker", "connect broker"], intent: "activate_broker", blocked: true },
  { phrases: ["activate feed", "connect feed"], intent: "activate_feed", blocked: true },
  { phrases: ["activate billing", "checkout"], intent: "activate_billing", blocked: true },
  { phrases: ["publish social", "post to"], intent: "publish_social", blocked: true },
  { phrases: ["legal advice"], intent: "provide_legal_advice", blocked: true },
  { phrases: ["financial advice", "what should i buy", "should i trade"], intent: "provide_financial_advice", blocked: true },
  { phrases: ["vip"], intent: "explain_plan_access", blocked: false },
  { phrases: ["billing inactive", "why billing"], intent: "explain_billing_inactive", blocked: false },
  { phrases: ["institutional"], intent: "explain_plan_access", blocked: false },
  { phrases: ["founder command", "restricted controls"], intent: "founder_unavailable_for_user", blocked: false },
  { phrases: ["journal", "reflection"], intent: "journal_prompt", blocked: false },
  { phrases: ["coach"], intent: "coach_prompt", blocked: false },
  { phrases: ["paper mode", "paper"], intent: "explain_paper_mode", blocked: false },
  { phrases: ["feedback"], intent: "draft_feedback", blocked: false },
  { phrases: ["diagnostics"], intent: "guide_to_diagnostics", blocked: false },
  { phrases: ["settings"], intent: "guide_to_settings", blocked: false },
  { phrases: ["feed fallback", "fallback"], intent: "explain_feed_fallback", blocked: false },
  { phrases: ["live disabled"], intent: "explain_live_disabled", blocked: false },
  { phrases: ["real money blocked"], intent: "explain_real_money_blocked", blocked: false },
  { phrases: ["session summary", "summarize"], intent: "session_summary", blocked: false },
];

export function classifyCompanionIntent(input: string) {
  const normalized = input.toLowerCase();
  const match = intentMatches.find((item) =>
    item.phrases.some((phrase) => normalized.includes(phrase))
  );

  return match ?? {
    intent: "explain_platform_state" as const,
    blocked: false,
    phrases: [],
  };
}

export function getCompanionBlockedIntent(
  intent: CompanionBlockedIntentCategory
) {
  return companionBlockedIntentRegistry.find((item) => item.intent === intent);
}
