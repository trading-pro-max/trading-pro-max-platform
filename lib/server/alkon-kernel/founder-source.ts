import type {
  AhmadFounderSource,
  FounderAuthorityRule,
  FounderPresenceRequirement,
  FounderPreference,
  FounderWill,
} from "./types";

export function getAhmadFounderSource(): AhmadFounderSource {
  return {
    name: "Ahmad",
    role: "Founder Source",
    authority: "final_sensitive_authority",
    owns: "Alkon",
    publicExposure: false,
    founderSourceStatus: "active",
    alkonOperatesUnderAhmadAuthority: true,
  };
}

export function getFounderWill(): FounderWill {
  return {
    projectVision:
      "Build Pro Max as a truthful Earth-native financial product while Alkon governs private creation, judgment, evidence, memory, and next action.",
    primeWorld: "Pro Max Trading",
    firstHeart: "Trading Workspace / Chart",
    operatingLaw:
      "Ahmad is the Founder Source; Alkon creates; Reality judges; Evidence proves; Memory preserves; Ahmad decides.",
  };
}

export function getFounderPreferences(): FounderPreference[] {
  return [
    {
      preferenceId: "chart_first_workspace",
      label: "Chart-first workspace",
      value:
        "The Trading Workspace must keep the chart as the financial heart and avoid visual clutter.",
      sensitive: false,
    },
    {
      preferenceId: "public_private_boundary",
      label: "Public/private boundary",
      value:
        "Public Pro Max stays clean; Alkon, kernel doctrine, and Founder Command remain private.",
      sensitive: false,
    },
    {
      preferenceId: "no_images_without_permission",
      label: "No image default",
      value:
        "Use code, SVG, CSS, and approved local assets only when explicitly permitted and licensed.",
      sensitive: false,
    },
    {
      preferenceId: "truth_before_closure",
      label: "Truth before closure",
      value:
        "Do not claim acceptance, launch readiness, billing readiness, or Local Day One without evidence and Ahmad review.",
      sensitive: false,
    },
  ];
}

export function getFounderAuthorityRules(): FounderAuthorityRule[] {
  return [
    {
      ruleId: "visual_acceptance",
      action: "Accept or reject public visual reality",
      founderRequired: true,
      reason: "Visual acceptance is Ahmad's human gate and cannot be automated.",
    },
    {
      ruleId: "sensitive_activation",
      action: "Launch, billing, real money, broker/feed, production, or public claims",
      founderRequired: true,
      reason:
        "Sensitive activation changes real-world risk and must stay blocked until Ahmad and external gates approve it.",
    },
    {
      ruleId: "protected_deletion",
      action: "Delete or reset protected systems",
      founderRequired: true,
      reason:
        "Zero Truth reads current reality; it does not erase the project without explicit Ahmad approval.",
    },
  ];
}

export function getFounderPresenceRequirements(): FounderPresenceRequirement[] {
  return [
    {
      requirementId: "local_day_one_start",
      decision: "Start Local Day One",
      required: true,
      cannotBeAutomated: true,
    },
    {
      requirementId: "public_identity_change",
      decision: "Change public identity, logo, or brand promise",
      required: true,
      cannotBeAutomated: true,
    },
    {
      requirementId: "real_world_activation",
      decision: "Activate any real-world money, legal, launch, or regulated surface",
      required: true,
      cannotBeAutomated: true,
    },
  ];
}
