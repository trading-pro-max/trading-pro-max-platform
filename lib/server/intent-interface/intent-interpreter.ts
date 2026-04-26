import { getIntentActionDefinition } from "./action-classifier";
import { getPublicIntentRegistry, getUserIntentRegistry } from "./intent-registry";
import type {
  IntentActionId,
  IntentCategory,
  IntentDefinition,
  IntentInterpretation,
  IntentInterfaceSurface,
  UserIntentId,
} from "./types";

type IntentPattern = {
  intentId: UserIntentId;
  confidence: number;
  phrases: string[];
};

const intentPatterns: IntentPattern[] = [
  {
    intentId: "start_request",
    confidence: 0.94,
    phrases: ["start me", "i want to start", "get started", "أريد أبدأ"],
  },
  {
    intentId: "open_workspace_request",
    confidence: 0.95,
    phrases: ["open the workspace", "open workspace", "open the chart", "افتح الشارت"],
  },
  {
    intentId: "chart_comfort_request",
    confidence: 0.93,
    phrases: ["make the chart bigger", "bigger chart", "larger chart", "كبر الشارت"],
  },
  {
    intentId: "calm_ui_request",
    confidence: 0.92,
    phrases: ["make it calmer", "make the platform calmer", "less noise", "اجعل المنصة أهدأ"],
  },
  {
    intentId: "focus_request",
    confidence: 0.9,
    phrases: ["focus", "focus workspace", "أريد تركيز"],
  },
  {
    intentId: "reduce_motion_request",
    confidence: 0.93,
    phrases: ["reduce motion", "low motion", "قلل الحركة"],
  },
  {
    intentId: "static_mode_request",
    confidence: 0.91,
    phrases: ["static mode", "night mode", "أريد الوضع الثابت"],
  },
  {
    intentId: "high_contrast_request",
    confidence: 0.9,
    phrases: ["high contrast", "more contrast"],
  },
  {
    intentId: "apps_platforms_request",
    confidence: 0.9,
    phrases: ["where is the mobile app", "mobile app", "desktop app", "apps", "platforms", "أين تطبيق الموبايل"],
  },
  {
    intentId: "support_request",
    confidence: 0.9,
    phrases: ["support", "help me", "contact support", "report a problem", "أريد دعم"],
  },
  {
    intentId: "academy_request",
    confidence: 0.88,
    phrases: ["help me learn", "academy", "teach me", "أريد أتعلم"],
  },
  {
    intentId: "journal_request",
    confidence: 0.88,
    phrases: ["open journal", "journal", "افتح journal"],
  },
  {
    intentId: "coach_request",
    confidence: 0.86,
    phrases: ["coach", "open coach"],
  },
  {
    intentId: "plans_request",
    confidence: 0.9,
    phrases: ["plans", "explain plans"],
  },
  {
    intentId: "explain_pro_request",
    confidence: 0.9,
    phrases: ["explain pro", "what is pro", "pro"],
  },
  {
    intentId: "explain_vip_request",
    confidence: 0.9,
    phrases: ["explain vip", "vip theme", "vip"],
  },
  {
    intentId: "explain_institutional_request",
    confidence: 0.9,
    phrases: ["explain institutional", "institutional"],
  },
  {
    intentId: "why_blocked_request",
    confidence: 0.94,
    phrases: ["why blocked", "why locked", "why is this locked", "لماذا هذا مقفل"],
  },
  {
    intentId: "paper_safe_request",
    confidence: 0.92,
    phrases: ["what is paper-safe", "paper safe", "paper mode", "ما معنى paper-safe"],
  },
  {
    intentId: "environment_request",
    confidence: 0.86,
    phrases: ["environment", "solar theme", "weather theme", "adaptive atmosphere"],
  },
  {
    intentId: "reset_experience_request",
    confidence: 0.9,
    phrases: ["reset experience", "restore defaults", "reset interface", "أعد الإعدادات الافتراضية"],
  },
  {
    intentId: "alkon_status_request",
    confidence: 0.96,
    phrases: ["alkon", "الكون", "founder command", "private command"],
  },
  {
    intentId: "codex_draft_request",
    confidence: 0.94,
    phrases: ["codex", "codex draft", "construction queue"],
  },
  {
    intentId: "task_passport_request",
    confidence: 0.94,
    phrases: ["task passport"],
  },
  {
    intentId: "tribunal_request",
    confidence: 0.94,
    phrases: ["result tribunal"],
  },
  {
    intentId: "memory_lesson_request",
    confidence: 0.9,
    phrases: ["product memory internals", "memory lesson"],
  },
];

const blockedIntentPatterns: Array<{
  actionId: IntentActionId;
  category: IntentCategory;
  confidence: number;
  phrases: string[];
  response: string;
}> = [
  {
    actionId: "execute_trade",
    category: "blocked",
    confidence: 0.98,
    phrases: ["execute trade", "place trade", "open order"],
    response: "Pro Max Assistant cannot execute trades. Use paper-safe rehearsal controls only.",
  },
  {
    actionId: "provide_signal",
    category: "blocked",
    confidence: 0.95,
    phrases: ["trading signal", "give me a signal", "what should i buy", "buy or sell"],
    response: "Pro Max Assistant cannot provide trading signals. Ask for education or a Journal prompt.",
  },
  {
    actionId: "enable_live",
    category: "blocked",
    confidence: 0.98,
    phrases: ["enable live", "activate live", "live trading"],
    response: "Live execution remains inactive and cannot be enabled here.",
  },
  {
    actionId: "enable_real_money",
    category: "blocked",
    confidence: 0.98,
    phrases: ["real money", "real funds", "fund account"],
    response: "Real-money routing is blocked. Stay in paper-safe mode.",
  },
  {
    actionId: "activate_broker",
    category: "blocked",
    confidence: 0.96,
    phrases: ["activate broker", "connect broker"],
    response: "Broker activation is inactive and cannot be configured by the Assistant.",
  },
  {
    actionId: "activate_feed",
    category: "blocked",
    confidence: 0.95,
    phrases: ["activate feed", "connect feed", "live feed"],
    response: "External feed activation is inactive. Market context remains fallback-labeled.",
  },
  {
    actionId: "activate_billing",
    category: "blocked",
    confidence: 0.96,
    phrases: ["activate billing", "checkout", "pay now"],
    response: "Billing and checkout are inactive. Plans remain truthful roadmap states.",
  },
  {
    actionId: "reveal_secrets",
    category: "blocked",
    confidence: 0.98,
    phrases: ["show secret", "api key", "password", "credential", "token"],
    response: "Secrets and credentials are never exposed.",
  },
  {
    actionId: "publish_social",
    category: "blocked",
    confidence: 0.95,
    phrases: ["publish social", "post to x", "post to twitter", "post to instagram"],
    response: "Social publishing is inactive.",
  },
  {
    actionId: "bypass_auth",
    category: "blocked",
    confidence: 0.98,
    phrases: ["bypass auth", "skip login", "override auth"],
    response: "Authentication boundaries cannot be bypassed.",
  },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function findIntentDefinition(intentId: UserIntentId): IntentDefinition {
  const definition = getUserIntentRegistry().find(
    (intent) => intent.intentId === intentId
  );

  if (!definition) {
    throw new Error(`Unknown intent definition: ${intentId}`);
  }

  return definition;
}

function surfaceForAction(actionId: IntentActionId): IntentInterfaceSurface {
  return getIntentActionDefinition(actionId)?.surface ?? "assistant";
}

export function interpretUserIntent(input: string): IntentInterpretation {
  const normalized = normalize(input);
  const blockedMatch = blockedIntentPatterns.find((pattern) =>
    pattern.phrases.some((phrase) => normalized.includes(phrase.toLowerCase()))
  );

  if (blockedMatch) {
    return {
      intentId: "blocked_safety_request",
      confidence: blockedMatch.confidence,
      category: blockedMatch.category,
      requestedAction: blockedMatch.actionId,
      requestedSurface: "assistant",
      requiresPlanCheck: false,
      requiresProductTruthCheck: true,
      requiresSafetyCheck: true,
      requiresConfirmation: false,
      suggestedResponse: blockedMatch.response,
      publicVisible: true,
    };
  }

  const patternMatch = intentPatterns.find((pattern) =>
    pattern.phrases.some((phrase) => normalized.includes(phrase.toLowerCase()))
  );

  if (!patternMatch) {
    return {
      intentId: "unknown_request",
      confidence: 0.28,
      category: "discovery",
      requestedAction: "personal_reality_request",
      requestedSurface: "assistant",
      requiresPlanCheck: true,
      requiresProductTruthCheck: true,
      requiresSafetyCheck: true,
      requiresConfirmation: false,
      suggestedResponse:
        "Tell Pro Max Assistant what you want to do, and it will route you to an allowed action, explanation, or safe alternative.",
      publicVisible: true,
    };
  }

  const definition = findIntentDefinition(patternMatch.intentId);
  const action = getIntentActionDefinition(definition.actionId);

  return {
    intentId: definition.intentId,
    confidence: patternMatch.confidence,
    category: definition.category,
    requestedAction: definition.actionId,
    requestedSurface: surfaceForAction(definition.actionId),
    requiresPlanCheck: action?.requiresEntitlement ?? true,
    requiresProductTruthCheck: true,
    requiresSafetyCheck: true,
    requiresConfirmation: action?.requiresConfirmation ?? false,
    suggestedResponse: definition.responseRule,
    publicVisible: definition.publicVisible,
  };
}

export function getPublicIntentExamples() {
  return getPublicIntentRegistry().map((intent) => ({
    intentId: intent.intentId,
    label: intent.label,
    examples: intent.examplePhrases,
  }));
}
