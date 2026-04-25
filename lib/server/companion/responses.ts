import "server-only";

import type {
  CompanionContextSnapshot,
  CompanionIntentCategory,
} from "./types";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getStateExplanation } from "@/lib/server/state-explanations";

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
  const live = getStateExplanation("live_disabled");
  const realMoney = getStateExplanation("real_money_blocked");
  const billing = getStateExplanation("billing_inactive");
  const vip = getStateExplanation("vip_locked");
  const institutional = getStateExplanation("institutional_future");
  const islamic = getStateExplanation("islamic_review_required");
  const ownerCommand = getStateExplanation("founder_command_private");
  const journalCoach = getJournalCoachSnapshot(context.checkedAt);

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
      body: `Blocked states are intentional safety boundaries, not broken features. ${live.userCopy} ${realMoney.userCopy} ${billing.userCopy}`,
      safeNextStep: "Review the reason and use the paper-safe alternative.",
      state: "blocked",
    },
    {
      intent: "explain_market_context",
      title: "Market context",
      body: `${context.selectedAsset} on ${context.timeframe} is shown for bounded paper decision support only. The Assistant can explain context quality and fallback truth, but it cannot produce guaranteed signals or predictive certainty.`,
      safeNextStep: "Treat market context as education and rehearsal support.",
      state: "fallback",
    },
    {
      intent: "explain_plan_access",
      title: "Plan access",
      body: `${context.planAccess?.activeLayer ?? context.planetAccess.activeLayer}. Free stays familiar, chart-first, paper-safe, and compact. Pro is the planned intelligent professional workspace, VIP is the planned elite premium workspace layer, and Institutional remains future. ${vip.userCopy} ${institutional.userCopy}`,
      safeNextStep: "Use Free paper-safe features and treat Pro/VIP/Institutional capabilities as roadmap truth until entitlement and billing gates exist.",
      state: "planned",
    },
    {
      intent: "explain_account_type",
      title: "Account type",
      body: `Standard account status is active. ${islamic.userCopy}`,
      safeNextStep: islamic.safeNextStep,
      state: "ready",
    },
    {
      intent: "guide_to_settings",
      title: "Go to settings",
      body: "Settings controls theme, language, plan access truth, paper ticket defaults, and journal/coach readiness.",
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
      body: `Before the paper decision, write what condition you are rehearsing, what would make you pause, and what you want to learn. Current journal mode: ${journalCoach.localJournalFoundation.persistence}.`,
      safeNextStep: "Record a learning note, not a profit target or performance promise.",
      state: "ready",
    },
    {
      intent: "session_summary",
      title: "Session summary",
      body:
        "Summarize the paper session by context, preflight state, blocked/allowed state, what you learned, and what you would review next. Deeper Journal/Coach review remains planned for Pro and VIP; do not assume an alternate outcome.",
      safeNextStep: "Use the journal/coach panel for paper-session reflection.",
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
        "Free is active as the familiar paper trading layer. Pro describes an intelligent professional workspace, VIP describes an elite premium workspace layer, and Institutional describes future team support. Billing, checkout, paid entitlements, and VIP activation are inactive.",
      safeNextStep: "Read plan value as roadmap truth, not an upgrade prompt.",
      state: "planned",
    },
    {
      intent: "founder_unavailable_for_user",
      title: "Private command tools are separate",
      body: ownerCommand.userCopy,
      safeNextStep: "Use user-facing settings, diagnostics, feedback, and plan access instead.",
      state: "blocked",
    },
  ];
}
