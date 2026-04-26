import type {
  PersonalRealityIntent,
  PersonalRealityIntentInterpretation,
  PersonalRealityLayer,
} from "./types";

type IntentRule = {
  intent: PersonalRealityIntent;
  layer: PersonalRealityLayer;
  settings: string[];
  phrases: string[];
  requiresPlanCheck?: boolean;
  requiresSafetyCheck?: boolean;
  requiresConfirmation?: boolean;
  hint: string;
};

const rules: IntentRule[] = [
  {
    intent: "blocked_activation_request",
    layer: "safety",
    settings: [],
    phrases: ["activate vip", "unlock vip", "enable billing", "live trading", "real money", "connect broker", "show alkon", "founder command"],
    requiresPlanCheck: true,
    requiresSafetyCheck: true,
    hint: "That request is blocked by Product Truth or public/private boundaries.",
  },
  {
    intent: "calm_request",
    layer: "visual",
    settings: ["calm_workspace", "low_motion"],
    phrases: ["calmer", "make it calmer", "less noise", "هدوء", "أهدأ", "اجعل المنصة أهدأ"],
    hint: "Use Calm Workspace and Low Motion.",
  },
  {
    intent: "focus_request",
    layer: "workspace",
    settings: ["calm_workspace", "chart_comfort"],
    phrases: ["focus", "تركيز", "أريد تركيز", "focus mode", "clean focus"],
    requiresConfirmation: true,
    hint: "Use a focused, chart-first layout.",
  },
  {
    intent: "chart_size_request",
    layer: "workspace",
    settings: ["chart_comfort"],
    phrases: ["bigger chart", "larger chart", "chart bigger", "شارت أكبر", "أريد شارت أكبر", "كبر الشارت"],
    requiresConfirmation: true,
    hint: "Use Chart Comfort for a larger, calmer chart.",
  },
  {
    intent: "reduce_motion_request",
    layer: "accessibility",
    settings: ["low_motion"],
    phrases: ["reduce motion", "low motion", "less motion", "قلل الحركة", "حركة أقل"],
    hint: "Use Low Motion.",
  },
  {
    intent: "static_mode_request",
    layer: "environment",
    settings: ["static_mode"],
    phrases: ["static", "static mode", "night mode", "dark mode", "وضع ليلي", "أريد وضع ليلي"],
    hint: "Use Static Mode or Dark visual preference without changing product state.",
  },
  {
    intent: "high_contrast_request",
    layer: "accessibility",
    settings: ["high_contrast"],
    phrases: ["high contrast", "more contrast", "contrast", "تباين"],
    hint: "Use High Contrast.",
  },
  {
    intent: "professional_theme_request",
    layer: "plan",
    settings: ["professional_orbit", "market_session_focus"],
    phrases: ["professional", "pro theme", "orbit", "واجهة احترافية", "احترافية"],
    requiresPlanCheck: true,
    requiresConfirmation: true,
    hint: "Professional Orbit is planned or entitlement-gated.",
  },
  {
    intent: "premium_theme_request",
    layer: "plan",
    settings: ["lunar_premium", "premium_reports"],
    phrases: ["vip theme", "premium", "gold", "lunar", "vip reality", "vip"],
    requiresPlanCheck: true,
    requiresConfirmation: true,
    hint: "VIP Lunar controls are planned or entitlement-gated.",
  },
  {
    intent: "learning_mode_request",
    layer: "learning",
    settings: ["learning_basics"],
    phrases: ["teach me", "learning", "learn more", "تعليم أكثر", "أريد تعليم أكثر"],
    hint: "Use Learning Basics and paper-safe explanations.",
  },
  {
    intent: "assistant_style_request",
    layer: "assistant",
    settings: ["short_calm_responses"],
    phrases: ["assistant style", "assistant calmer", "short answers", "quiet assistant"],
    hint: "TPM Assistant can keep responses shorter and calmer.",
  },
  {
    intent: "explain_locked_feature",
    layer: "plan",
    settings: [],
    phrases: ["why locked", "why is locked", "why is this locked", "لماذا هذا مقفل", "مقفل"],
    requiresPlanCheck: true,
    hint: "Explain planned/locked truth without activating anything.",
  },
  {
    intent: "reset_experience",
    layer: "visual",
    settings: ["clean_earth"],
    phrases: ["reset", "default", "restore", "أعد الإعدادات الافتراضية"],
    hint: "Return to Clean Earth defaults.",
  },
];

export function interpretPersonalRealityIntent(
  input: string
): PersonalRealityIntentInterpretation {
  const normalized = input.toLowerCase();
  const rule = rules.find((candidate) =>
    candidate.phrases.some((phrase) => normalized.includes(phrase.toLowerCase()))
  );
  const fallback: IntentRule = {
    intent: "calm_request",
    layer: "visual",
    settings: ["calm_workspace"],
    hint: "Use Calm Workspace as the safe default Personal Reality preview.",
    phrases: [],
  };
  const selected = rule ?? fallback;

  return {
    intent: selected.intent,
    confidence: rule ? 0.86 : normalized ? 0.45 : 0.25,
    requestedLayer: selected.layer,
    requestedSettings: selected.settings,
    requiresPlanCheck: selected.requiresPlanCheck ?? true,
    requiresSafetyCheck: selected.requiresSafetyCheck ?? true,
    requiresConfirmation: selected.requiresConfirmation ?? false,
    safeResponseHint: selected.hint,
  };
}
