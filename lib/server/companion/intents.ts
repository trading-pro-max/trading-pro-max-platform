import "server-only";

import type {
  CompanionBlockedIntentAvailability,
  CompanionBlockedIntentCategory,
  CompanionIntentAvailability,
  CompanionIntentCategory,
} from "./types";

const allowedPlanAccess = {
  demoFree: "allowed",
  pro: "planned",
  vip: "planned",
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
      "Pro Max Assistant may explain product truth and safe alternatives, but it cannot execute, activate, bypass, publish, advise, or fake capability state.",
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
    "Use public plan names only and explain Free active, Pro/VIP planned, and Institutional future without paid activation.",
    "truthful realm and entitlement summary",
    ["legacy internal plan label", "paid active", "VIP enabled", "checkout available", "Pro active"]
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
    "open_workspace_request",
    "Open workspace",
    "Route to the Trading Workspace and keep paper-safe truth visible.",
    "short route guidance plus paper-safe reminder",
    ["live workspace", "broker connected", "real-money terminal"]
  ),
  allowedIntent(
    "guide_to_apps_platforms",
    "Guide to apps and platforms",
    "Explain Web current, Desktop planned, Mobile planned, and Tablet future without fake downloads.",
    "truthful availability summary",
    ["download now", "app store active", "APK available", "desktop installer"]
  ),
  allowedIntent(
    "guide_to_support",
    "Guide to support",
    "Route to public-safe support paths without fake ticketing or email sending claims.",
    "help route with readiness truth",
    ["ticket created", "email sent", "guaranteed response"]
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
    "Diagnostics guidance only; no advanced controls or private data.",
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
    "personal_reality_calm",
    "Calm Personal Reality",
    "Preview allowed visual/workspace calm controls only; no paid activation or private systems.",
    "short Assistant-controlled experience explanation",
    ["unlock paid", "activate VIP", "live control"]
  ),
  allowedIntent(
    "personal_reality_focus",
    "Focus Personal Reality",
    "Preview chart-first focus and ask confirmation before significant layout changes.",
    "calm preview plus confirmation",
    ["execution shortcut", "order hotkey"]
  ),
  allowedIntent(
    "personal_reality_chart_comfort",
    "Chart Comfort Personal Reality",
    "Explain chart comfort as layout-only and paper-safe.",
    "chart-first layout guidance",
    ["signal", "trade trigger", "live order"]
  ),
  allowedIntent(
    "personal_reality_low_motion",
    "Low Motion Personal Reality",
    "Respect reduced motion and keep atmosphere subtle.",
    "accessibility-first",
    ["force animation", "ignore reduced motion"]
  ),
  allowedIntent(
    "personal_reality_static",
    "Static Personal Reality",
    "Explain Static Mode as motion-off and product-truth preserving.",
    "accessibility-first",
    ["weather trading", "session signal"]
  ),
  allowedIntent(
    "personal_reality_high_contrast",
    "High Contrast Personal Reality",
    "Prioritize readability over atmosphere.",
    "accessibility-first",
    ["visual clutter", "low contrast"]
  ),
  allowedIntent(
    "personal_reality_learning",
    "Learning Personal Reality",
    "Keep learning guidance paper-safe and no-advice.",
    "simple learning mode",
    ["financial advice", "signals"]
  ),
  allowedIntent(
    "personal_reality_explain_locked",
    "Explain locked Personal Reality",
    "Explain planned/locked profiles without fake entitlement, billing, or urgency pressure.",
    "why-locked plus safe alternative",
    ["activate now", "fake entitlement"]
  ),
  allowedIntent(
    "reset_experience",
    "Reset experience",
    "Explain reset to Clean Earth defaults without changing plans, billing, live execution, broker/feed, or private systems.",
    "safe reset preview",
    ["reset entitlement", "unlock paid", "enable live"]
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
    "Separate access unavailable",
    "That area is separate and never a user-plan feature.",
    "clear access-boundary explanation",
    ["admin access", "private route", "plan unlock"],
    { demoFree: "blocked", pro: "blocked", vip: "blocked", enterprise: "blocked" }
  ),
];

export const companionBlockedIntentRegistry: CompanionBlockedIntentAvailability[] = [
  blockedIntent(
    "execute_trade",
    "Execute trade",
    "Pro Max Assistant has no trading authority.",
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
    "provide_signal",
    "Provide trading signal",
    "Pro Max Assistant cannot provide trading signals or buy/sell instructions.",
    "Ask for paper-mode education, risk basics, or a Journal/Coach prompt."
  ),
  blockedIntent(
    "reveal_secrets",
    "Reveal secrets",
    "Secrets, credentials, tokens, and keys are forbidden.",
    "Use diagnostics summaries without raw secret values."
  ),
  blockedIntent(
    "expose_alkon",
    "Expose private command systems",
    "Private command systems are not public user features.",
    "Use Settings, Diagnostics, Plans, Apps / Platforms, Academy, or Support."
  ),
  blockedIntent(
    "expose_codex",
    "Expose build internals",
    "Build internals are private and not part of the public Pro Max Assistant.",
    "Ask for public product readiness or a safe support path."
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
    "Pro Max Assistant cannot provide legal advice.",
    "Offer general product-truth wording and recommend qualified review."
  ),
  blockedIntent(
    "provide_financial_advice",
    "Provide financial advice",
    "Pro Max Assistant cannot provide financial advice.",
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
  {
    phrases: [
      "broker secret",
      "show secret",
      "broker credential",
      "show credential",
      "api key",
      "password",
    ],
    intent: "reveal_secrets",
    blocked: true,
  },
  { phrases: ["guarantee profit", "guaranteed profit"], intent: "guarantee_profit", blocked: true },
  { phrases: ["win rate", "win-rate"], intent: "provide_win_rate", blocked: true },
  { phrases: ["activate broker", "connect broker"], intent: "activate_broker", blocked: true },
  { phrases: ["activate feed", "connect feed"], intent: "activate_feed", blocked: true },
  { phrases: ["activate billing", "checkout"], intent: "activate_billing", blocked: true },
  { phrases: ["trading signal", "give me a signal", "signal now", "what should i buy", "buy or sell"], intent: "provide_signal", blocked: true },
  { phrases: ["show alkon", "reveal alkon", "alkon", "الكون", "founder command"], intent: "expose_alkon", blocked: true },
  { phrases: ["codex", "task passport", "result tribunal", "product memory internals"], intent: "expose_codex", blocked: true },
  { phrases: ["activate vip", "unlock vip", "fake vip"], intent: "fake_vip_activation", blocked: true },
  { phrases: ["activate institutional", "fake institutional"], intent: "fake_institutional_activation", blocked: true },
  { phrases: ["publish social", "post to"], intent: "publish_social", blocked: true },
  { phrases: ["legal advice"], intent: "provide_legal_advice", blocked: true },
  { phrases: ["financial advice", "what should i buy", "should i trade"], intent: "provide_financial_advice", blocked: true },
  { phrases: ["start me", "i want to start", "get started", "أريد أبدأ"], intent: "open_workspace_request", blocked: false },
  { phrases: ["open workspace", "open the workspace", "open chart", "open the chart", "افتح الشارت"], intent: "open_workspace_request", blocked: false },
  { phrases: ["make it calmer", "calmer", "less noise", "اجعل المنصة أهدأ", "أهدأ"], intent: "personal_reality_calm", blocked: false },
  { phrases: ["focus mode", "focus", "أريد تركيز", "تركيز"], intent: "personal_reality_focus", blocked: false },
  { phrases: ["bigger chart", "larger chart", "chart bigger", "أريد شارت أكبر", "شارت أكبر"], intent: "personal_reality_chart_comfort", blocked: false },
  { phrases: ["reduce motion", "low motion", "قلل الحركة"], intent: "personal_reality_low_motion", blocked: false },
  { phrases: ["static mode", "static", "dark mode", "night mode", "أريد وضع ليلي"], intent: "personal_reality_static", blocked: false },
  { phrases: ["high contrast", "more contrast"], intent: "personal_reality_high_contrast", blocked: false },
  { phrases: ["reset experience", "restore defaults", "reset interface"], intent: "reset_experience", blocked: false },
  { phrases: ["mobile app", "desktop app", "apps", "platforms", "where is the mobile app"], intent: "guide_to_apps_platforms", blocked: false },
  { phrases: ["support", "contact support", "report a problem"], intent: "guide_to_support", blocked: false },
  { phrases: ["academy", "help me learn", "teach me"], intent: "learning_help", blocked: false },
  { phrases: ["learning mode", "teach me more", "أريد تعليم أكثر"], intent: "personal_reality_learning", blocked: false },
  { phrases: ["why locked", "why is this locked", "لماذا هذا مقفل"], intent: "personal_reality_explain_locked", blocked: false },
  { phrases: ["vip"], intent: "explain_plan_access", blocked: false },
  { phrases: ["pro orbit", "orbit tools", "professional workspace"], intent: "explain_plan_access", blocked: false },
  { phrases: ["lunar", "premium advanced"], intent: "explain_plan_access", blocked: false },
  { phrases: ["billing inactive", "why billing"], intent: "explain_billing_inactive", blocked: false },
  { phrases: ["institutional"], intent: "explain_plan_access", blocked: false },
  { phrases: ["founder command", "restricted controls", "private controls", "private control", "that area separate", "area separate"], intent: "founder_unavailable_for_user", blocked: false },
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
