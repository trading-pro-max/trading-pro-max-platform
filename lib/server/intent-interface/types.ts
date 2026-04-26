import type { PlanId } from "@/lib/plans/types";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type IntentInterfaceSurface =
  | "public_shell"
  | "public_home"
  | "trading_workspace"
  | "markets"
  | "plans"
  | "apps_platforms"
  | "academy"
  | "community"
  | "support"
  | "settings"
  | "diagnostics"
  | "assistant"
  | "journal_coach"
  | "founder_private";

export type CoreAction =
  | "home"
  | "open_workspace"
  | "open_markets"
  | "open_plans"
  | "open_apps_platforms"
  | "open_academy"
  | "open_support"
  | "open_settings"
  | "open_diagnostics"
  | "sign_in";

export type ContextAction =
  | "buy_paper"
  | "sell_paper"
  | "ai_wait"
  | "why_blocked"
  | "save_journal_note"
  | "open_coach"
  | "reset_chart"
  | "open_assistant"
  | "switch_timeframe"
  | "change_symbol";

export type AssistantIntentAction =
  | "make_calmer"
  | "bigger_chart"
  | "reduce_motion"
  | "static_mode"
  | "high_contrast"
  | "explain_pro"
  | "explain_vip"
  | "explain_institutional"
  | "explain_paper_safe"
  | "explain_billing_inactive"
  | "explain_live_inactive"
  | "where_mobile_app"
  | "where_desktop_app"
  | "how_to_use_journal"
  | "how_to_use_coach"
  | "how_to_get_support"
  | "explain_why_locked"
  | "learning_path"
  | "reset_experience"
  | "personal_reality_request";

export type BlockedIntent =
  | "execute_trade"
  | "provide_signal"
  | "guarantee_profit"
  | "provide_win_rate"
  | "enable_live"
  | "enable_real_money"
  | "activate_broker"
  | "activate_feed"
  | "activate_billing"
  | "reveal_secrets"
  | "expose_alkon"
  | "expose_codex"
  | "publish_social"
  | "bypass_auth";

export type IntentActionId =
  | CoreAction
  | ContextAction
  | AssistantIntentAction
  | BlockedIntent;

export type IntentActionKind =
  | "core_action"
  | "context_action"
  | "assistant_intent"
  | "blocked_intent";

export type IntentVisibility = "public" | "private_founder" | "internal_only";

export type ProductTruthRequirement =
  | "paper_safe_only"
  | "billing_inactive"
  | "live_inactive"
  | "broker_feed_inactive"
  | "no_real_money"
  | "no_fake_plan_activation"
  | "no_public_private_leak"
  | "no_trading_advice";

export type SafetyBoundary =
  | "no_execution"
  | "no_live_activation"
  | "no_billing_activation"
  | "no_broker_feed_activation"
  | "no_real_money"
  | "no_signals"
  | "no_profit_claims"
  | "no_secrets"
  | "no_public_alkon"
  | "no_auth_bypass"
  | "no_social_publishing";

export type IntentActionDefinition = {
  actionId: IntentActionId;
  label: string;
  type: IntentActionKind;
  surface: IntentInterfaceSurface;
  visibility: IntentVisibility;
  shouldBeButton: boolean;
  shouldBeAssistantIntent: boolean;
  allowedPlans: PlanId[];
  requiresEntitlement: boolean;
  requiresConfirmation: boolean;
  productTruthRequirements: ProductTruthRequirement[];
  safetyBoundaries: SafetyBoundary[];
  publicCopy: string;
  blockedCopy: string;
  safeAlternative: string;
};

export type IntentCategory =
  | "discovery"
  | "workspace"
  | "chart"
  | "paper_execution"
  | "learning"
  | "support"
  | "plan"
  | "apps_platforms"
  | "environment"
  | "accessibility"
  | "personal_reality"
  | "safety"
  | "blocked"
  | "founder_private";

export type PublicIntentId =
  | "start_request"
  | "open_workspace_request"
  | "chart_comfort_request"
  | "calm_ui_request"
  | "focus_request"
  | "reduce_motion_request"
  | "static_mode_request"
  | "high_contrast_request"
  | "apps_platforms_request"
  | "support_request"
  | "academy_request"
  | "journal_request"
  | "coach_request"
  | "plans_request"
  | "explain_free_request"
  | "explain_pro_request"
  | "explain_vip_request"
  | "explain_institutional_request"
  | "why_blocked_request"
  | "paper_safe_request"
  | "environment_request"
  | "reset_experience_request"
  | "blocked_safety_request";

export type PrivateIntentId =
  | "alkon_status_request"
  | "codex_draft_request"
  | "task_passport_request"
  | "tribunal_request"
  | "memory_lesson_request";

export type UserIntentId = PublicIntentId | PrivateIntentId;

export type IntentDefinition = {
  intentId: UserIntentId;
  label: string;
  category: IntentCategory;
  actionId: IntentActionId;
  publicVisible: boolean;
  privateOnly: boolean;
  examplePhrases: string[];
  responseRule: string;
};

export type IntentInterpretation = {
  intentId: UserIntentId | "unknown_request";
  confidence: number;
  category: IntentCategory;
  requestedAction: IntentActionId;
  requestedSurface: IntentInterfaceSurface;
  requiresPlanCheck: boolean;
  requiresProductTruthCheck: boolean;
  requiresSafetyCheck: boolean;
  requiresConfirmation: boolean;
  suggestedResponse: string;
  publicVisible: boolean;
};

export type ButtonPolicyDecision =
  | "keep_as_button"
  | "contextual_button_only"
  | "assistant_intent_only"
  | "remove_duplicate"
  | "blocked";

export type ButtonPolicyResult = {
  actionId: IntentActionId;
  decision: ButtonPolicyDecision;
  reason: string;
  buttonAllowed: boolean;
  assistantPreferred: boolean;
};

export type IntentInterfaceReadinessSnapshot = {
  checkedAt: string;
  mode: "human_intent_operating_system";
  status: "ready_with_notes";
  coreButtonsKept: CoreAction[];
  contextualButtons: ContextAction[];
  assistantIntents: AssistantIntentAction[];
  blockedIntents: BlockedIntent[];
  publicIntentCount: number;
  privateIntentCount: number;
  privateIntentsPubliclyAvailable: false;
  duplicateControlPolicy: "remove_duplicate";
  productTruthPreserved: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedBillingInactive: true;
    publicLaunchInactive: true;
    noFakePlanActivation: true;
    alkonHiddenPublicly: true;
  };
  publicCopy: string;
  diagnosticsSummary: {
    label: "Intent interface readiness";
    copy: string;
  };
};

export type IntentInterfaceDiagnosticsProbe = DiagnosticsProbe;
