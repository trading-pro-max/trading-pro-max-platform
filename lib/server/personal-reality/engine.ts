import { interpretPersonalRealityIntent } from "./intent-interpreter";
import { resolvePersonalRealityPlanAccess } from "./plan-resolver";
import { guardPersonalRealityProductTruth } from "./product-truth-guard";
import { getPublicPersonalRealityProfiles } from "./registry";
import type {
  PersonalRealityEngineInput,
  PersonalRealityEngineOutput,
} from "./types";

export function buildPersonalRealityPreview(
  input: PersonalRealityEngineInput,
  checkedAt = new Date().toISOString()
): PersonalRealityEngineOutput {
  const interpretation = interpretPersonalRealityIntent(input.userIntent);
  const currentPlan = input.currentPlan ?? "demo_free";
  const planAccess = resolvePersonalRealityPlanAccess(interpretation, currentPlan);
  const truthGuard = guardPersonalRealityProductTruth(input.userIntent, interpretation);
  const canApply =
    truthGuard.allowed &&
    planAccess.profileAllowed &&
    planAccess.blockedSettings.length === 0 &&
    planAccess.allowedSettings.length > 0;
  const fallbackProfile =
    getPublicPersonalRealityProfiles().find((profile) => profile.profileId === "clean") ??
    getPublicPersonalRealityProfiles()[0];
  const previewProfile =
    truthGuard.allowed && planAccess.profileAllowed
      ? planAccess.profile
      : fallbackProfile;
  const blockedSettings = truthGuard.allowed
    ? planAccess.blockedSettings
    : [...planAccess.blockedSettings, ...planAccess.allowedSettings];
  const explanation = truthGuard.allowed
    ? canApply
      ? `${previewProfile.publicLabel} can be previewed now. TPM Assistant can explain the change and ask confirmation when layout changes are significant.`
      : `${planAccess.profile.publicLabel} is ${planAccess.profile.availability}. ${planAccess.upgradeExplanation}`
    : truthGuard.explanation;

  return {
    checkedAt,
    mode: "personal_operating_reality_engine",
    interpretation,
    allowedSettings: truthGuard.allowed ? planAccess.allowedSettings : [],
    blockedSettings,
    explanation,
    previewProfile,
    applyPlan: {
      canApply,
      appliesNow: canApply
        ? planAccess.allowedSettings.map((setting) => setting.name)
        : [],
      previewOnly: true,
      noBillingActivation: true,
      noLiveExecution: true,
      noPrivateExposure: true,
    },
    requiresConfirmation:
      interpretation.requiresConfirmation ||
      planAccess.allowedSettings.some((setting) => setting.requiresConfirmation),
    upgradeExplanation: planAccess.upgradeExplanation,
    safeAlternative: truthGuard.allowed
      ? "Use active Free controls: Clean Earth, Calm Workspace, Chart Comfort, Static Mode, Low Motion, High Contrast, or Learning Basics."
      : truthGuard.safeAlternative,
    publicCopy: truthGuard.allowed
      ? "Personal Reality changes how the platform feels and behaves visually; it does not unlock paid plans, live execution, billing, broker/feed, or real money."
      : "That request is blocked. I can explain why and offer a safe Personal Reality alternative.",
    diagnosticsSummary: {
      status: canApply ? "ready" : truthGuard.allowed ? "planned" : "blocked",
      profile: previewProfile.publicLabel,
      allowedCount: truthGuard.allowed ? planAccess.allowedSettings.length : 0,
      blockedCount: blockedSettings.length,
      productTruthPreserved: true,
    },
    productTruth: {
      paidPlanActivated: false,
      billingActivated: false,
      liveExecutionActivated: false,
      brokerFeedActivated: false,
      realMoneyActivated: false,
      privateSystemsExposed: false,
      weatherOrSessionAdvice: false,
    },
  };
}
