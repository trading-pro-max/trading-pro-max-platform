import type {
  AssistantIntentAction,
  BlockedIntent,
  ContextAction,
  CoreAction,
  IntentActionDefinition,
  IntentActionId,
} from "./types";

const allPlans = ["demo_free", "pro", "vip", "enterprise"] as const;
const freePlan = ["demo_free"] as const;

function coreAction(
  actionId: CoreAction,
  label: string,
  surface: IntentActionDefinition["surface"],
  publicCopy: string
): IntentActionDefinition {
  return {
    actionId,
    label,
    type: "core_action",
    surface,
    visibility: "public",
    shouldBeButton: true,
    shouldBeAssistantIntent: false,
    allowedPlans: [...allPlans],
    requiresEntitlement: false,
    requiresConfirmation: false,
    productTruthRequirements: ["paper_safe_only", "no_public_private_leak"],
    safetyBoundaries: ["no_execution", "no_public_alkon"],
    publicCopy,
    blockedCopy: "This core action is unavailable only if the route is unavailable.",
    safeAlternative: "Ask Pro Max Assistant where to go next.",
  };
}

function contextAction(
  actionId: ContextAction,
  label: string,
  surface: IntentActionDefinition["surface"],
  shouldBeButton: boolean,
  publicCopy: string,
  safetyBoundaries: IntentActionDefinition["safetyBoundaries"] = [
    "no_execution",
    "no_live_activation",
    "no_real_money",
  ]
): IntentActionDefinition {
  return {
    actionId,
    label,
    type: "context_action",
    surface,
    visibility: "public",
    shouldBeButton,
    shouldBeAssistantIntent: !shouldBeButton,
    allowedPlans: [...allPlans],
    requiresEntitlement: false,
    requiresConfirmation: actionId === "reset_chart",
    productTruthRequirements: ["paper_safe_only", "live_inactive", "no_real_money"],
    safetyBoundaries,
    publicCopy,
    blockedCopy: "This contextual control cannot bypass Product Truth.",
    safeAlternative: "Ask Pro Max Assistant for an explanation or safer route.",
  };
}

function assistantIntent(
  actionId: AssistantIntentAction,
  label: string,
  surface: IntentActionDefinition["surface"],
  publicCopy: string,
  options: Partial<Pick<
    IntentActionDefinition,
    "allowedPlans" | "requiresEntitlement" | "requiresConfirmation" | "productTruthRequirements"
  >> = {}
): IntentActionDefinition {
  return {
    actionId,
    label,
    type: "assistant_intent",
    surface,
    visibility: "public",
    shouldBeButton: false,
    shouldBeAssistantIntent: true,
    allowedPlans: options.allowedPlans ?? [...allPlans],
    requiresEntitlement: options.requiresEntitlement ?? false,
    requiresConfirmation: options.requiresConfirmation ?? false,
    productTruthRequirements: options.productTruthRequirements ?? [
      "paper_safe_only",
      "no_fake_plan_activation",
      "no_trading_advice",
    ],
    safetyBoundaries: ["no_execution", "no_signals", "no_profit_claims", "no_public_alkon"],
    publicCopy,
    blockedCopy: "Pro Max Assistant can explain this request, but cannot fake activation.",
    safeAlternative: "Use active Free controls or read the truthful planned/future state.",
  };
}

function blockedIntent(
  actionId: BlockedIntent,
  label: string,
  blockedCopy: string,
  safeAlternative: string,
  safetyBoundaries: IntentActionDefinition["safetyBoundaries"]
): IntentActionDefinition {
  return {
    actionId,
    label,
    type: "blocked_intent",
    surface: "assistant",
    visibility: "public",
    shouldBeButton: false,
    shouldBeAssistantIntent: true,
    allowedPlans: [],
    requiresEntitlement: false,
    requiresConfirmation: false,
    productTruthRequirements: [
      "live_inactive",
      "broker_feed_inactive",
      "billing_inactive",
      "no_real_money",
      "no_fake_plan_activation",
      "no_public_private_leak",
      "no_trading_advice",
    ],
    safetyBoundaries,
    publicCopy: blockedCopy,
    blockedCopy,
    safeAlternative,
  };
}

export const intentActionCatalog: IntentActionDefinition[] = [
  coreAction("home", "Home", "public_shell", "Return to the public entry."),
  coreAction("open_workspace", "Trading Workspace", "public_shell", "Open the paper-safe web workspace."),
  coreAction("open_markets", "Markets", "public_shell", "Review market coverage truth."),
  coreAction("open_plans", "Plans", "public_shell", "Review Free, Pro, VIP, and Institutional truth."),
  coreAction("open_apps_platforms", "Apps / Platforms", "public_shell", "Review Web current and planned device surfaces."),
  coreAction("open_academy", "Academy", "public_shell", "Open paper-safe learning paths."),
  coreAction("open_support", "Support", "public_shell", "Find help, reporting, security, and partnership readiness."),
  coreAction("open_settings", "Settings", "settings", "Open backup manual controls."),
  coreAction("open_diagnostics", "Diagnostics", "diagnostics", "Open public-safe truth and readiness."),
  coreAction("sign_in", "Sign in", "public_shell", "Open protected account access."),

  contextAction("buy_paper", "Open paper buy", "trading_workspace", true, "Paper buy is an immediate rehearsal action.", [
    "no_live_activation",
    "no_real_money",
  ]),
  contextAction("sell_paper", "Open paper sell", "trading_workspace", true, "Paper sell is an immediate rehearsal action.", [
    "no_live_activation",
    "no_real_money",
  ]),
  contextAction("ai_wait", "AI wait", "trading_workspace", true, "Wait is an immediate non-executing safety state."),
  contextAction("why_blocked", "Why blocked?", "assistant", true, "Show the reason and safe next step when a state is blocked."),
  contextAction("save_journal_note", "Save journal note", "journal_coach", true, "Save a paper-session reflection."),
  contextAction("open_coach", "Open Coach", "journal_coach", true, "Open a paper-session coaching prompt."),
  contextAction("reset_chart", "Reset chart", "trading_workspace", true, "Reset chart layout after confirmation."),
  contextAction("open_assistant", "Open Pro Max Assistant", "assistant", true, "Open the human intent interface."),
  contextAction("switch_timeframe", "Switch timeframe", "trading_workspace", true, "Change chart timeframe without implying live feed."),
  contextAction("change_symbol", "Change symbol", "trading_workspace", true, "Change selected symbol in the paper workspace."),

  assistantIntent("make_calmer", "Make it calmer", "assistant", "Pro Max Assistant can preview calmer visual and workspace settings.", {
    allowedPlans: [...freePlan, "pro", "vip", "enterprise"],
  }),
  assistantIntent("bigger_chart", "Bigger chart", "assistant", "Pro Max Assistant can explain Chart Comfort and focus the workspace.", {
    requiresConfirmation: true,
  }),
  assistantIntent("reduce_motion", "Reduce motion", "assistant", "Pro Max Assistant can guide Low Motion accessibility settings."),
  assistantIntent("static_mode", "Static Mode", "assistant", "Pro Max Assistant can guide Static Mode without changing Product Truth."),
  assistantIntent("high_contrast", "High Contrast", "assistant", "Pro Max Assistant can guide High Contrast for readability."),
  assistantIntent("explain_pro", "Explain Pro", "plans", "Explain Pro as planned professional depth unless entitlement exists.", {
    requiresEntitlement: true,
  }),
  assistantIntent("explain_vip", "Explain VIP", "plans", "Explain VIP as planned premium depth without profit promises.", {
    requiresEntitlement: true,
  }),
  assistantIntent("explain_institutional", "Explain Institutional", "plans", "Explain Institutional as future team readiness."),
  assistantIntent("explain_paper_safe", "Explain paper-safe", "assistant", "Explain paper-only rehearsal truth."),
  assistantIntent("explain_billing_inactive", "Explain billing inactive", "assistant", "Explain checkout and paid activation as inactive.", {
    productTruthRequirements: ["billing_inactive", "no_fake_plan_activation"],
  }),
  assistantIntent("explain_live_inactive", "Explain live inactive", "assistant", "Explain live execution as blocked and not user-toggleable.", {
    productTruthRequirements: ["live_inactive", "no_real_money"],
  }),
  assistantIntent("where_mobile_app", "Where is the mobile app?", "apps_platforms", "Explain Mobile App as planned with no store claim."),
  assistantIntent("where_desktop_app", "Where is the desktop app?", "apps_platforms", "Explain Desktop App as planned with no installer claim."),
  assistantIntent("how_to_use_journal", "How to use Journal", "journal_coach", "Guide a paper-session journal note."),
  assistantIntent("how_to_use_coach", "How to use Coach", "journal_coach", "Guide a calm, non-advisory Coach prompt."),
  assistantIntent("how_to_get_support", "How to get support", "support", "Route to Help Center, report problem, security, or partnership contact readiness."),
  assistantIntent("explain_why_locked", "Why locked?", "assistant", "Explain planned, locked, future, or inactive states truthfully."),
  assistantIntent("learning_path", "Learning path", "academy", "Suggest a paper-safe learning path."),
  assistantIntent("reset_experience", "Reset experience", "settings", "Explain reset to Clean Earth defaults."),
  assistantIntent("personal_reality_request", "Personal Reality request", "assistant", "Translate user intent into allowed settings, blocked settings, and safe alternatives.", {
    requiresConfirmation: true,
  }),

  blockedIntent(
    "execute_trade",
    "Execute trade",
    "Pro Max Assistant cannot execute trades or place orders.",
    "Use paper buttons for rehearsal or ask why execution is blocked.",
    ["no_execution", "no_live_activation", "no_real_money"]
  ),
  blockedIntent(
    "provide_signal",
    "Provide signal",
    "Pro Max Assistant cannot provide trading signals.",
    "Ask for educational context or a Journal/Coach prompt.",
    ["no_signals", "no_profit_claims", "no_execution"]
  ),
  blockedIntent(
    "guarantee_profit",
    "Guarantee profit",
    "Profit guarantees are blocked.",
    "Ask for risk basics or paper-mode reflection.",
    ["no_profit_claims", "no_signals"]
  ),
  blockedIntent(
    "provide_win_rate",
    "Provide win rate",
    "Win-rate claims cannot be invented.",
    "Ask for a paper-session review prompt.",
    ["no_profit_claims", "no_signals"]
  ),
  blockedIntent(
    "enable_live",
    "Enable live",
    "Live execution remains inactive and cannot be enabled here.",
    "Use paper-safe mode and diagnostics.",
    ["no_live_activation", "no_execution", "no_real_money"]
  ),
  blockedIntent(
    "enable_real_money",
    "Enable real money",
    "Real-money routing is blocked.",
    "Stay in paper mode.",
    ["no_real_money", "no_live_activation"]
  ),
  blockedIntent(
    "activate_broker",
    "Activate broker",
    "Broker activation is inactive.",
    "Review broker/feed readiness as inactive.",
    ["no_broker_feed_activation", "no_live_activation"]
  ),
  blockedIntent(
    "activate_feed",
    "Activate feed",
    "External feed activation is inactive.",
    "Use fallback-labeled market context.",
    ["no_broker_feed_activation"]
  ),
  blockedIntent(
    "activate_billing",
    "Activate billing",
    "Billing and checkout are inactive.",
    "Read plan value as roadmap truth.",
    ["no_billing_activation", "no_public_alkon"]
  ),
  blockedIntent(
    "reveal_secrets",
    "Reveal secrets",
    "Secrets, credentials, keys, and tokens are never exposed.",
    "Use public-safe diagnostics summaries.",
    ["no_secrets", "no_auth_bypass"]
  ),
  blockedIntent(
    "expose_alkon",
    "Expose private command",
    "Private command systems are not public user features.",
    "Use Settings, Diagnostics, Plans, Apps / Platforms, Academy, or Support.",
    ["no_public_alkon", "no_auth_bypass"]
  ),
  blockedIntent(
    "expose_codex",
    "Expose build internals",
    "Build internals are not part of the public Pro Max Assistant.",
    "Ask for public product readiness instead.",
    ["no_public_alkon", "no_secrets"]
  ),
  blockedIntent(
    "publish_social",
    "Publish social",
    "Social publishing is inactive.",
    "Keep content as an internal draft.",
    ["no_social_publishing", "no_secrets"]
  ),
  blockedIntent(
    "bypass_auth",
    "Bypass auth",
    "Authentication boundaries cannot be bypassed.",
    "Use normal sign-in or public routes.",
    ["no_auth_bypass", "no_secrets"]
  ),
];

export function getIntentActionCatalog() {
  return intentActionCatalog;
}

export function getIntentActionDefinition(actionId: IntentActionId) {
  return intentActionCatalog.find((action) => action.actionId === actionId);
}

export function classifyIntentAction(actionId: IntentActionId) {
  return getIntentActionDefinition(actionId);
}

export function getCoreButtonActions() {
  return intentActionCatalog.filter((action): action is IntentActionDefinition & { actionId: CoreAction } =>
    action.type === "core_action"
  );
}

export function getContextButtonActions() {
  return intentActionCatalog.filter((action): action is IntentActionDefinition & { actionId: ContextAction } =>
    action.type === "context_action"
  );
}

export function getAssistantIntentActions() {
  return intentActionCatalog.filter((action): action is IntentActionDefinition & { actionId: AssistantIntentAction } =>
    action.type === "assistant_intent"
  );
}

export function getBlockedIntentActions() {
  return intentActionCatalog.filter((action): action is IntentActionDefinition & { actionId: BlockedIntent } =>
    action.type === "blocked_intent"
  );
}
