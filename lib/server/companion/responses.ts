import "server-only";

import type {
  CompanionContextSnapshot,
  CompanionIntentCategory,
} from "./types";

export type CompanionResponseTemplate = {
  intent: CompanionIntentCategory;
  title: string;
  body: string;
  safeNextStep: string;
  state: "ready" | "blocked" | "planned" | "fallback";
};

export function buildCompanionResponseTemplates(
  context: CompanionContextSnapshot
): CompanionResponseTemplate[] {
  return [
    {
      intent: "explain_platform_state",
      title: "Platform state",
      body: `You are on ${context.route}. The platform is paper-safe, feed state is ${context.marketFeedState}, and live execution, real money, billing, launch, broker/feed activation, and social publishing remain blocked or inactive.`,
      safeNextStep: "Use paper mode, diagnostics, and settings for truthful state review.",
      state: "fallback",
    },
    {
      intent: "explain_blocked_state",
      title: "Why blocked",
      body:
        "Blocked states are intentional safety boundaries, not broken features. They protect live execution, real money, broker/feed, billing, launch, social publishing, secrets, and unsafe claims.",
      safeNextStep: "Review the reason and use the paper-safe alternative.",
      state: "blocked",
    },
    {
      intent: "explain_market_context",
      title: "Market context",
      body: `${context.selectedAsset} on ${context.timeframe} is shown for bounded paper decision support only. The Companion can explain context quality and fallback truth, but it cannot produce guaranteed signals or predictive certainty.`,
      safeNextStep: "Treat market context as education and rehearsal support.",
      state: "fallback",
    },
    {
      intent: "explain_plan_access",
      title: "Plan access",
      body: `${context.planetAccess.activeLayer}. Free / Demo stays familiar, chart-first, paper-safe, and compact. Pro is the planned intelligent professional workspace, VIP is the planned elite living planet layer, and Enterprise remains future.`,
      safeNextStep: "Use Demo / Free paper-safe features and treat Pro/VIP/Enterprise capabilities as roadmap truth until entitlement and billing gates exist.",
      state: "planned",
    },
    {
      intent: "explain_account_type",
      title: "Account type",
      body:
        "Standard account status is active. Islamic account wording remains review-sensitive and is not certified unless a real review/certification process exists.",
      safeNextStep: "Keep account-type copy truthful and avoid certification claims.",
      state: "ready",
    },
    {
      intent: "guide_to_settings",
      title: "Go to settings",
      body: "Settings controls theme, language, plan layer truth, paper ticket defaults, and journal/coach readiness.",
      safeNextStep: "Open Settings for product configuration that does not activate live systems.",
      state: "ready",
    },
    {
      intent: "guide_to_diagnostics",
      title: "Go to diagnostics",
      body:
        "Diagnostics shows readiness, blocked states, engines, economy/media readiness, and connector truth without raw secrets or owner controls.",
      safeNextStep: "Open Diagnostics to verify readiness and fallback state.",
      state: "ready",
    },
    {
      intent: "guide_to_feedback",
      title: "Send feedback",
      body:
        "Feedback should describe what you saw, what felt unclear, route/theme/language context, and expected safe next step. Do not include passwords, tokens, broker credentials, or private sensitive data.",
      safeNextStep: "Draft feedback locally, then submit through the guarded feedback flow.",
      state: "ready",
    },
    {
      intent: "draft_feedback",
      title: "Feedback draft",
      body: `Draft: On ${context.route}, I saw ${context.productTruth.liveExecution} live execution and ${context.marketFeedState} feed state. I expected clearer guidance about the safe paper-mode next step.`,
      safeNextStep: "Review the draft and remove any private data before sending.",
      state: "ready",
    },
    {
      intent: "journal_prompt",
      title: "Journal prompt",
      body:
        "Before the paper decision, write what condition you are rehearsing, what would make you pause, and what you want to learn.",
      safeNextStep: "Record a learning note, not a profit target.",
      state: "ready",
    },
    {
      intent: "session_summary",
      title: "Session summary",
      body:
        "Summarize the paper session by context, preflight state, blocked/allowed state, what you learned, and what you would review next. Do not assume an alternate outcome.",
      safeNextStep: "Use the journal/coach panel for reflection.",
      state: "ready",
    },
    {
      intent: "learning_help",
      title: "Learning help",
      body:
        context.preferences.skillLevel === "beginner"
          ? "I will keep guidance simple, paper-first, and focused on understanding state, risk, and platform truth."
          : "I can keep guidance compact and structured while preserving no-advice and no-prediction boundaries.",
      safeNextStep: "Choose a paper-mode learning question.",
      state: "ready",
    },
    {
      intent: "explain_plan_upgrade_without_billing",
      title: "Plan ladder",
      body:
        "Free / Demo is active as the familiar paper trading layer. Pro describes an intelligent professional workspace, VIP describes an elite living planet layer, and Enterprise describes future team governance. Billing, checkout, paid entitlements, and VIP activation are inactive.",
      safeNextStep: "Read plan value as roadmap truth, not an upgrade prompt.",
      state: "planned",
    },
    {
      intent: "founder_unavailable_for_user",
      title: "Founder Command is private",
      body:
        "Founder Command is owner-only and never a Free, Pro, VIP, or Enterprise user-plan feature.",
      safeNextStep: "Use user-facing settings, diagnostics, feedback, and plan layers instead.",
      state: "blocked",
    },
  ];
}
