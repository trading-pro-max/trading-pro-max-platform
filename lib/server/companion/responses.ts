import "server-only";

import type {
  CompanionBlockedIntentCategory,
  CompanionContextSnapshot,
  CompanionIntentCategory,
} from "./types";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getStateExplanation } from "@/lib/server/state-explanations";
import { mapInvisibleLayerOutput } from "@/lib/server/surface-boundaries";
import { classifyCompanionIntent, getCompanionBlockedIntent } from "./intents";

export type CompanionResponseTemplate = {
  intent: CompanionIntentCategory;
  title: string;
  body: string;
  safeNextStep: string;
  state: "ready" | "blocked" | "planned" | "fallback";
};

export type CompanionDailyUseResponse = {
  input: string;
  intent: CompanionIntentCategory | CompanionBlockedIntentCategory;
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
  const broker = getStateExplanation("broker_unavailable");
  const feed = getStateExplanation("feed_fallback");
  const billing = getStateExplanation("billing_inactive");
  const pro = getStateExplanation("pro_locked");
  const vip = getStateExplanation("vip_locked");
  const institutional = getStateExplanation("institutional_future");
  const islamic = getStateExplanation("islamic_certification_not_certified");
  const launch = getStateExplanation("launch_not_active");
  const social = getStateExplanation("social_publishing_inactive");
  const journalCoach = getJournalCoachSnapshot(context.checkedAt);
  const realm = context.realm;

  return [
    {
      intent: "explain_platform_state",
      title: "Platform state",
      body: `You are on ${context.route} in the ${realm.publicPlanName} experience. ${realm.workspaceBehavior} Feed state is ${context.marketFeedState}, and live execution, real money, billing, launch, broker/feed activation, and social publishing remain blocked or inactive. ${launch.shortMessage}; ${social.shortMessage}.`,
      safeNextStep: "Use paper mode, diagnostics, and settings for truthful state review.",
      state: "fallback",
    },
    {
      intent: "explain_blocked_state",
      title: "Why blocked",
      body: `Blocked conditions are intentional safety boundaries, not broken features. ${live.userCopy} ${realMoney.userCopy} ${broker.userCopy} ${billing.userCopy}`,
      safeNextStep: "Review the reason and use the paper-safe alternative.",
      state: "blocked",
    },
    {
      intent: "explain_live_disabled",
      title: "Live disabled",
      body: live.userCopy,
      safeNextStep: live.safeNextStep,
      state: "blocked",
    },
    {
      intent: "explain_real_money_blocked",
      title: "Real money blocked",
      body: realMoney.userCopy,
      safeNextStep: realMoney.safeNextStep,
      state: "blocked",
    },
    {
      intent: "explain_paper_mode",
      title: "Paper mode",
      body: `${realm.publicPlanName} uses paper-safe rehearsal. It lets you review the workspace, practice decision notes, and inspect blocked states without live execution or real-money routing. ${realm.journalCoachDepth}`,
      safeNextStep: "Use paper mode for learning, journal notes, and diagnostics review.",
      state: "ready",
    },
    {
      intent: "explain_feed_fallback",
      title: "Feed fallback",
      body: `${feed.userCopy} No external live feed or broker feed is activated.`,
      safeNextStep: "Treat market context as fallback-labeled paper context.",
      state: "fallback",
    },
    {
      intent: "explain_billing_inactive",
      title: "Billing inactive",
      body: billing.userCopy,
      safeNextStep: "Read Pro, VIP, and Institutional as plan truth, not checkout.",
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
      body: `${context.planAccess?.activeLayer ?? context.planetAccess.activeLayer}. Free is the active complete paper-safe web workspace. Pro is the planned professional workspace layer, VIP is the planned premium advanced layer, and Institutional remains future team readiness. Current ${realm.publicPlanName} behavior: ${realm.assistantBehavior} ${pro.userCopy} ${vip.userCopy} ${institutional.userCopy}`,
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
      body: `Settings shows the current ${realm.publicPlanName} experience, what is active, what is planned or future, paper ticket defaults, and Journal/Coach readiness.`,
      safeNextStep: "Open Settings for product configuration that does not activate live systems.",
      state: "ready",
    },
    {
      intent: "guide_to_diagnostics",
      title: "Go to diagnostics",
      body:
        "Diagnostics shows public-safe readiness, blocked conditions, service availability, plan truth, Assistant readiness, Journal/Coach readiness, and Product Truth without raw credentials or private command details.",
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
      body: `Before the paper decision, write what condition you are rehearsing, what would make you pause, and what you want to learn. Current ${realm.publicPlanName} Journal/Coach depth: ${realm.journalCoachDepth} Current journal mode: ${journalCoach.localJournalFoundation.persistence}.`,
      safeNextStep: "Record a learning note, not a profit target or performance promise.",
      state: "ready",
    },
    {
      intent: "coach_prompt",
      title: "Coach prompt",
      body: `Before continuing, name the condition you are rehearsing, the point where you will pause, and one learning question. ${realm.journalCoachDepth} This is coaching for paper-mode discipline, not a trading instruction.`,
      safeNextStep: "Use the Coach panel for a calm pre/during/post-session reflection.",
      state: "ready",
    },
    {
      intent: "session_summary",
      title: "Session summary",
      body: `Summarize the paper session by context, preflight state, blocked/allowed state, what you learned, and what you would review next. ${realm.reportsDepth} Deeper Journal/Coach review remains planned for Pro and VIP; do not assume an alternate outcome.`,
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
      intent: "explain_upgrade_path_without_billing",
      title: "Plan ladder",
      body:
        "Free is active as the complete paper-safe web workspace. Pro describes planned professional workspace tools, VIP describes a planned premium advanced layer, and Institutional describes future team support. Billing, checkout, paid entitlements, and VIP activation are inactive.",
      safeNextStep: "Read plan value as roadmap truth, not an upgrade prompt.",
      state: "planned",
    },
    {
      intent: "explain_plan_upgrade_without_billing",
      title: "Plan ladder",
      body:
        "Free is active as the complete paper-safe web workspace. Pro describes planned professional workspace tools, VIP describes a planned premium advanced layer, and Institutional describes future team support. Billing, checkout, paid entitlements, and VIP activation are inactive.",
      safeNextStep: "Read plan value as roadmap truth, not an upgrade prompt.",
      state: "planned",
    },
    {
      intent: "founder_unavailable_for_user",
      title: "Separate access",
      body: mapInvisibleLayerOutput("founder_command_private"),
      safeNextStep: "Use Settings, Diagnostics, feedback, and plan access instead.",
      state: "blocked",
    },
  ];
}

export function buildCompanionDailyUseResponse(
  input: string,
  context: CompanionContextSnapshot
): CompanionDailyUseResponse {
  const classification = classifyCompanionIntent(input);
  const templates = buildCompanionResponseTemplates(context);

  if (classification.blocked) {
    const blocked = getCompanionBlockedIntent(
      classification.intent as CompanionBlockedIntentCategory
    );

    return {
      input,
      intent: classification.intent,
      title: blocked?.label ?? "Request blocked",
      body:
        blocked?.blockedReason ??
        "That request is blocked by TPM Assistant safety boundaries.",
      safeNextStep:
        blocked?.safeAlternative ??
        "Ask for a product-truth explanation or paper-safe learning prompt.",
      state: "blocked",
    };
  }

  const template =
    templates.find((item) => item.intent === classification.intent) ??
    templates.find((item) => item.intent === "explain_platform_state") ??
    templates[0];

  return {
    input,
    intent: template.intent,
    title: template.title,
    body: template.body,
    safeNextStep: template.safeNextStep,
    state: template.state,
  };
}

export function buildCompanionDailyUseSamples(
  context: CompanionContextSnapshot
): CompanionDailyUseResponse[] {
  return [
    "activate live trading",
    "use real money",
    "show broker credentials",
    "guarantee profit",
    "what is VIP",
    "why billing inactive",
    "why Institutional future",
    "why is that area separate",
    "help me journal",
    "explain paper mode",
    "draft feedback",
  ].map((input) => buildCompanionDailyUseResponse(input, context));
}
