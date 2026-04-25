import "server-only";

import { getBrandOccasionTheme } from "@/lib/brand/occasion-themes";
import type { BrandMotionIntensity } from "@/lib/brand/types";
import { getBrandPlanDNA } from "./plan-dna";
import { getBrandStateLanguage } from "./state-language";
import type {
  BrandIdentityDecision,
  BrandIntelligenceInput,
  BrandVoiceRule,
} from "./types";

const publicTerminology = [
  "Trading Pro Max",
  "TPM Assistant",
  "Free",
  "Pro",
  "VIP",
  "Institutional",
  "Trading Workspace",
  "Journal",
  "Coach",
  "Academy",
  "Community",
  "Premium Reports",
  "Settings",
  "Diagnostics",
  "Readiness",
];

const internalTerminology = [
  "TPM Planet OS",
  "Founder Command",
  "internal governance",
  "ministries",
  "councils",
  "states",
  "Founder-only command identity",
];

function defaulted(input: BrandIntelligenceInput): Required<BrandIntelligenceInput> {
  return {
    occasion: "default",
    motionPreference: "system",
    theme: "system",
    founderPreference: "strict_ahmad_preferences",
    publicLanguageRequired:
      input.audience === "public" || input.audience === "authenticated_user",
    legalSafety: "safe",
    guardianSafety: "safe",
    chartPriority: input.surface === "workstation" ? "high" : "medium",
    reducedMotion: input.motionPreference === "reduced",
    ...input,
  };
}

function motionFor(input: Required<BrandIntelligenceInput>): BrandMotionIntensity {
  if (input.reducedMotion || input.motionPreference === "reduced") return "none";
  if (input.surface === "workstation") return "low";
  if (input.surface === "founder_command" || input.surface === "local_command") {
    return input.audience === "founder" || input.audience === "internal" ? "medium" : "low";
  }
  if (input.state === "blocked" || input.state === "inactive" || input.state === "planned") {
    return "none";
  }
  return "low";
}

function intensityFor(input: Required<BrandIntelligenceInput>): BrandMotionIntensity {
  if (input.surface === "workstation") return "low";
  if (input.plan === "vip") return "medium";
  if (input.plan === "founder") return "high";
  return "low";
}

function voiceFor(input: Required<BrandIntelligenceInput>): BrandVoiceRule {
  return {
    tone:
      input.audience === "founder" || input.audience === "internal"
        ? "precise internal command"
        : "calm public trading product",
    copyStyle:
      input.publicLanguageRequired
        ? "short, professional, public-safe, no internal terminology"
        : "direct internal readiness language with explicit activation blocks",
    forbiddenClaims: [
      "guaranteed profit",
      "win-rate",
      "Swiss legal/company status",
      "Islamic/Sharia certification",
      "active paid plan without entitlement",
      "live execution active",
      "real-money routing active",
      "billing active",
      "broker/feed active",
      "public launch active",
    ],
  };
}

export function resolveBrandIdentity(
  rawInput: BrandIntelligenceInput
): BrandIdentityDecision {
  const input = defaulted(rawInput);
  const planDNA = getBrandPlanDNA(input.plan);
  const stateLanguage = getBrandStateLanguage(input.state);
  const occasion = getBrandOccasionTheme(input.occasion);
  const motionIntensity = motionFor(input);
  const internalAudience = input.audience === "founder" || input.audience === "internal";
  const commandSurface = input.surface === "founder_command" || input.surface === "local_command";
  const earthMarkVariant = commandSurface && internalAudience ? "command" : input.surface === "workstation" ? "compact" : "public";
  const requiresLegalReview =
    input.legalSafety !== "safe" || occasion.legalReviewRequired || input.state === "not_certified";
  const requiresGuardianReview =
    input.guardianSafety !== "safe" || occasion.guardianReviewRequired || input.state === "blocked";
  const requiresFounderApproval =
    occasion.founderApprovalRequired || input.plan === "founder" || input.surface === "founder_command";

  return {
    input,
    earthMarkVariant,
    earthMarkState: stateLanguage.markBehavior,
    earthMarkAnimated: motionIntensity !== "none",
    identityIntensity: intensityFor(input),
    motionIntensity,
    accentPalette: planDNA.palette,
    planVisualDNA: planDNA.traits,
    stateVisualLanguage: stateLanguage.userCopyStyle,
    occasionSkin: occasion.key,
    brandVoice: voiceFor(input),
    allowedTerminology: input.publicLanguageRequired ? publicTerminology : [...publicTerminology, ...internalTerminology],
    blockedTerminology: input.publicLanguageRequired
      ? ["restricted internal command terms", "legacy Enterprise public label", "fake activation language"]
      : ["fake activation language", "uncontracted brand/company claims"],
    safeCopyRules: [
      "Use public plan names Free, Pro, VIP, Institutional.",
      "State planned/locked/future truth clearly.",
      "Do not imply live, real-money, billing, broker/feed, public launch, or paid activation.",
      "Avoid financial advice, guaranteed profit, win-rate, and pressure language.",
    ],
    visualGuardrails: [
      "Keep chart-first surfaces low-motion.",
      "Avoid casino/neon chaos.",
      "Avoid childish/fantasy visuals.",
      "Use SVG/code identity only.",
      "Respect reduced motion.",
    ],
    requiresFounderApproval,
    requiresLegalReview,
    requiresGuardianReview,
    publicSafe: input.publicLanguageRequired
      ? !requiresLegalReview && !requiresGuardianReview && !requiresFounderApproval
      : true,
  };
}

export function getBrandIntelligenceSampleDecisions(): BrandIdentityDecision[] {
  return [
    resolveBrandIdentity({
      surface: "public_entry",
      plan: "free",
      state: "paper_safe",
      audience: "public",
      motionPreference: "system",
      theme: "dark",
    }),
    resolveBrandIdentity({
      surface: "settings",
      plan: "vip",
      state: "planned",
      audience: "authenticated_user",
      motionPreference: "system",
      theme: "dark",
    }),
    resolveBrandIdentity({
      surface: "founder_command",
      plan: "founder",
      state: "ready",
      audience: "founder",
      motionPreference: "system",
      theme: "dark",
    }),
    resolveBrandIdentity({
      surface: "workstation",
      plan: "free",
      state: "paper_safe",
      audience: "authenticated_user",
      motionPreference: "system",
      theme: "dark",
      chartPriority: "high",
    }),
    resolveBrandIdentity({
      surface: "public_entry",
      plan: "free",
      state: "paper_safe",
      audience: "public",
      motionPreference: "reduced",
      reducedMotion: true,
      theme: "light",
    }),
  ];
}
