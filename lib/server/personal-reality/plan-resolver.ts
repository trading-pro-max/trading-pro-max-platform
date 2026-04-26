import type { PlanId } from "@/lib/plans/types";
import {
  findPersonalRealityProfile,
  findPersonalRealitySetting,
  getPublicPersonalRealityProfiles,
} from "./registry";
import type {
  PersonalRealityIntentInterpretation,
  PersonalRealityProfile,
  PersonalRealitySetting,
} from "./types";

const fallbackProfile =
  findPersonalRealityProfile("clean") ?? getPublicPersonalRealityProfiles()[0];

function desiredProfileForIntent(
  interpretation: PersonalRealityIntentInterpretation
): PersonalRealityProfile {
  if (interpretation.intent === "premium_theme_request") {
    return findPersonalRealityProfile("lunar_premium") ?? fallbackProfile;
  }
  if (interpretation.intent === "professional_theme_request") {
    return findPersonalRealityProfile("professional_orbit") ?? fallbackProfile;
  }
  if (interpretation.intent === "chart_size_request") {
    return findPersonalRealityProfile("chart_first") ?? fallbackProfile;
  }
  if (interpretation.intent === "static_mode_request") {
    return findPersonalRealityProfile("static") ?? fallbackProfile;
  }
  if (interpretation.intent === "high_contrast_request") {
    return findPersonalRealityProfile("high_contrast") ?? fallbackProfile;
  }
  if (interpretation.intent === "focus_request" || interpretation.intent === "calm_request") {
    return findPersonalRealityProfile("calm") ?? fallbackProfile;
  }
  return fallbackProfile;
}

export function resolvePersonalRealityPlanAccess(
  interpretation: PersonalRealityIntentInterpretation,
  currentPlan: PlanId = "demo_free"
) {
  const requestedSettings = interpretation.requestedSettings
    .map((settingId) => findPersonalRealitySetting(settingId))
    .filter((setting): setting is PersonalRealitySetting => Boolean(setting));
  const profile = desiredProfileForIntent(interpretation);
  const allowedSettings = requestedSettings.filter(
    (setting) =>
      setting.publicVisible &&
      setting.availability === "active" &&
      setting.allowedPlans.includes(currentPlan) &&
      !setting.requiresEntitlement
  );
  const blockedSettings = requestedSettings.filter(
    (setting) =>
      !setting.publicVisible ||
      setting.availability !== "active" ||
      setting.requiresEntitlement ||
      setting.blockedPlans.includes(currentPlan)
  );
  const profileAllowed =
    profile.publicVisible &&
    profile.availability === "active" &&
    profile.allowedPlans.includes(currentPlan);

  return {
    profile,
    profileAllowed,
    allowedSettings,
    blockedSettings,
    upgradeExplanation: profile.upgradeExplanation,
  };
}
