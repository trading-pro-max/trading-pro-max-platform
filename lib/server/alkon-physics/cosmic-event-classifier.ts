import "server-only";

import type {
  CosmicEnergy,
  CosmicEvent,
  CosmicEventInput,
  CosmicEventType,
  CosmicRiskLevel,
  CosmicWorkerId,
  GravityPriority,
  OperatingStationId,
  OrbitPath,
  PlanetSystemOwnerId,
  SatelliteMonitorId,
} from "./types";

type ClassifiedEventShape = {
  type: CosmicEventType;
  energy: CosmicEnergy;
  gravityPriority: GravityPriority;
  orbitPath: OrbitPath;
  secondaryOrbitPaths?: OrbitPath[];
  suggestedPlanetOwner: PlanetSystemOwnerId;
  suggestedMonitors: SatelliteMonitorId[];
  suggestedStation: OperatingStationId;
  suggestedWorker: CosmicWorkerId;
  riskLevel: CosmicRiskLevel;
};

function eventId(type: CosmicEventType, title: string): string {
  return [
    "cosmic",
    type,
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 42),
  ].join("-");
}

function includesAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function classifyShape(input: CosmicEventInput): ClassifiedEventShape {
  const haystack = `${input.title} ${input.description ?? ""} ${
    input.requestedAction ?? ""
  }`.toLowerCase();

  if (includesAny(haystack, ["live execution", "live trading", "real money"])) {
    return {
      type: "live_execution_requested",
      energy: "product_truth_conflict",
      gravityPriority: "black_hole_forbidden",
      orbitPath: "launch_forbidden_orbit",
      suggestedPlanetOwner: "defense_universe",
      suggestedMonitors: [
        "product_truth_satellite",
        "security_satellite",
        "public_boundary_satellite",
      ],
      suggestedStation: "security_station",
      suggestedWorker: "security_gate_worker",
      riskLevel: "critical",
    };
  }

  if (includesAny(haystack, ["billing", "stripe", "subscription", "payment"])) {
    return {
      type: "billing_requested",
      energy: "product_truth_conflict",
      gravityPriority: "blocked_gravity",
      orbitPath: "launch_forbidden_orbit",
      suggestedPlanetOwner: "treasury_readiness_planet",
      suggestedMonitors: ["product_truth_satellite", "security_satellite"],
      suggestedStation: "founder_review_station",
      suggestedWorker: "security_gate_worker",
      riskLevel: "critical",
    };
  }

  if (
    includesAny(haystack, [
      "production secret",
      "send secrets",
      "raw secret",
      "api key value",
      "secret token",
    ])
  ) {
    return {
      type: "secret_risk",
      energy: "security_alert",
      gravityPriority: "black_hole_forbidden",
      orbitPath: "secrets_orbit",
      suggestedPlanetOwner: "secrets_authority",
      suggestedMonitors: ["secrets_satellite", "security_satellite"],
      suggestedStation: "secrets_station",
      suggestedWorker: "secrets_safety_worker",
      riskLevel: "critical",
    };
  }

  if (includesAny(haystack, ["secret risk", "secrets", "token risk"])) {
    return {
      type: "secret_risk",
      energy: "security_alert",
      gravityPriority: "P0_critical_gravity",
      orbitPath: "secrets_orbit",
      secondaryOrbitPaths: ["security_orbit"],
      suggestedPlanetOwner: "secrets_authority",
      suggestedMonitors: ["secrets_satellite", "security_satellite"],
      suggestedStation: "secrets_station",
      suggestedWorker: "secrets_safety_worker",
      riskLevel: "critical",
    };
  }

  if (
    includesAny(haystack, [
      "internal term leaked",
      "alkon leaked",
      "founder command visible",
      "governance visible",
      "ministry visible",
      "cosmic term leaked",
    ])
  ) {
    return {
      type: "internal_term_leaked",
      energy: "security_alert",
      gravityPriority: "P0_critical_gravity",
      orbitPath: "public_ui_orbit",
      secondaryOrbitPaths: ["security_orbit"],
      suggestedPlanetOwner: "earth_public_world",
      suggestedMonitors: [
        "public_ui_satellite",
        "public_boundary_satellite",
        "security_satellite",
        "validation_satellite",
      ],
      suggestedStation: "public_ux_station",
      suggestedWorker: "public_copy_worker",
      riskLevel: "critical",
    };
  }

  if (includesAny(haystack, ["chart annoying", "chart blocking", "chart clutter"])) {
    return {
      type: "chart_annoying",
      energy: "founder_feedback",
      gravityPriority: includesAny(haystack, ["blocking", "unusable"])
        ? "P0_critical_gravity"
        : "P1_high_gravity",
      orbitPath: "chart_workspace_orbit",
      suggestedPlanetOwner: "trading_workspace_planet",
      suggestedMonitors: [
        "chart_satellite",
        "workstation_satellite",
        "screenshot_satellite",
      ],
      suggestedStation: "chart_station",
      suggestedWorker: "chart_comfort_worker",
      riskLevel: "high",
    };
  }

  if (includesAny(haystack, ["logo rejected", "logo wrong", "earth mark rejected"])) {
    return {
      type: "logo_rejected",
      energy: "visual_rejection",
      gravityPriority: "P1_high_gravity",
      orbitPath: "visual_identity_orbit",
      suggestedPlanetOwner: "visual_identity_planet",
      suggestedMonitors: [
        "logo_satellite",
        "product_truth_satellite",
        "public_boundary_satellite",
      ],
      suggestedStation: "design_station",
      suggestedWorker: "logo_identity_worker",
      riskLevel: "high",
    };
  }

  if (includesAny(haystack, ["public ui crowded", "crowded home", "navigation gap"])) {
    return {
      type: "public_ui_crowded",
      energy: "user_public_gap",
      gravityPriority: "P1_high_gravity",
      orbitPath: "public_ui_orbit",
      suggestedPlanetOwner: "earth_public_world",
      suggestedMonitors: [
        "public_ui_satellite",
        "public_boundary_satellite",
        "product_truth_satellite",
      ],
      suggestedStation: "public_ux_station",
      suggestedWorker: includesAny(haystack, ["navigation"])
        ? "public_navigation_worker"
        : "public_copy_worker",
      riskLevel: "high",
    };
  }

  if (includesAny(haystack, ["codex task", "codex draft", "task passport"])) {
    return {
      type: "codex_task_needed",
      energy: "founder_vision",
      gravityPriority: "P2_standard_gravity",
      orbitPath: "codex_construction_orbit",
      suggestedPlanetOwner: "construction_universe",
      suggestedMonitors: ["validation_satellite", "memory_satellite"],
      suggestedStation: "codex_station",
      suggestedWorker: "codex_passport_worker",
      riskLevel: "medium",
    };
  }

  if (includesAny(haystack, ["local day", "daily report", "day report"])) {
    return {
      type: "local_day_report_needed",
      energy: "local_day_signal",
      gravityPriority: "P2_standard_gravity",
      orbitPath: "local_day_orbit",
      suggestedPlanetOwner: "moon_cycle_system",
      suggestedMonitors: ["local_day_satellite", "memory_satellite"],
      suggestedStation: "founder_review_station",
      suggestedWorker: "alkon_report_worker",
      riskLevel: "low",
    };
  }

  if (includesAny(haystack, ["support missing", "apps missing", "platforms missing"])) {
    return {
      type: "support_missing",
      energy: "user_public_gap",
      gravityPriority: "P1_high_gravity",
      orbitPath: "apps_support_orbit",
      suggestedPlanetOwner: "apps_support_planet",
      suggestedMonitors: ["public_ui_satellite", "product_truth_satellite"],
      suggestedStation: "support_station",
      suggestedWorker: includesAny(haystack, ["apps", "platforms"])
        ? "apps_platforms_worker"
        : "support_readiness_worker",
      riskLevel: "medium",
    };
  }

  if (
    includesAny(haystack, [
      "world interface",
      "email readiness",
      "social readiness",
      "media channel",
    ])
  ) {
    return {
      type: "world_interface_request",
      energy: "founder_vision",
      gravityPriority: "P3_future_gravity",
      orbitPath: "media_world_interface_orbit",
      suggestedPlanetOwner: "world_interface_planet",
      suggestedMonitors: [
        "world_interface_satellite",
        "security_satellite",
        "product_truth_satellite",
      ],
      suggestedStation: "world_interface_station",
      suggestedWorker: "apps_platforms_worker",
      riskLevel: "medium",
    };
  }

  return {
    type: "generic_founder_idea",
    energy: "founder_vision",
    gravityPriority: "P2_standard_gravity",
    orbitPath: "memory_orbit",
    suggestedPlanetOwner: "memory_universe",
    suggestedMonitors: ["memory_satellite", "validation_satellite"],
    suggestedStation: "memory_station",
    suggestedWorker: "memory_lesson_worker",
    riskLevel: "medium",
  };
}

export function classifyCosmicEvent(
  input: CosmicEventInput,
  createdAt = new Date().toISOString()
): CosmicEvent {
  const shape = classifyShape(input);

  return {
    eventId: eventId(shape.type, input.title),
    source: input.source,
    title: input.title,
    description: input.description ?? input.requestedAction ?? input.title,
    type: shape.type,
    energy: shape.energy,
    gravityPriority: shape.gravityPriority,
    orbitPath: shape.orbitPath,
    secondaryOrbitPaths: shape.secondaryOrbitPaths ?? [],
    suggestedPlanetOwner: shape.suggestedPlanetOwner,
    suggestedMonitors: shape.suggestedMonitors,
    suggestedStation: shape.suggestedStation,
    suggestedWorker: shape.suggestedWorker,
    riskLevel: shape.riskLevel,
    publicVisible: false,
    founderVisible: true,
    createdAt,
  };
}

export function getCosmicEventSamples(
  checkedAt = new Date().toISOString()
): CosmicEvent[] {
  return [
    classifyCosmicEvent(
      {
        source: "founder_feedback",
        title: "logo rejected",
        description: "Founder rejected an Earth identity direction.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "founder_feedback",
        title: "chart annoying",
        description: "Chart comfort and clutter need private review.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "public_surface_review",
        title: "public UI crowded",
        description: "Public entry needs cleaner hierarchy.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "public_boundary_satellite",
        title: "internal term leaked",
        description: "Private command vocabulary appeared in a public surface.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "security_satellite",
        title: "secret risk",
        description: "A request may expose secret presence or values.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "product_truth_conflict",
        title: "billing requested",
        description: "Billing activation requested during local scope.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "product_truth_conflict",
        title: "live execution requested",
        description: "Live execution and real money activation requested.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "founder_vision",
        title: "Codex task needed",
        description: "A governed task passport and draft are needed.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "local_day_signal",
        title: "local day report needed",
        description: "The Moon cycle needs a private daily report.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "public_surface_review",
        title: "support missing",
        description: "Support readiness needs public-safe improvement.",
      },
      checkedAt
    ),
    classifyCosmicEvent(
      {
        source: "founder_vision",
        title: "world interface request",
        description: "Email, social, or partner channels need readiness only.",
      },
      checkedAt
    ),
  ];
}
