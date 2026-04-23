import "server-only";
import type {
  DiagnosticsHealthSnapshot,
  DiagnosticsProbe,
  DiagnosticsProbeStatus,
} from "@/modules/shell/types/platform-state";

type FinalMarketParityObjectiveKey =
  | "trading_workflow"
  | "platform_clients"
  | "real_integrations"
  | "trust_safety"
  | "ops_reliability"
  | "commercial_product"
  | "intelligence";

type FinalMarketParityObjectiveState = "closed" | "partially_closed";

type FinalMarketParityGuard = {
  capability:
    | "live_execution"
    | "real_money_routing"
    | "external_feed_live_activation"
    | "broker_live_activation"
    | "billing_checkout"
    | "notification_delivery"
    | "auto_trading";
  state: "blocked" | "inactive" | "unconfigured";
  rationale: string;
};

type FinalMarketParityObjective = {
  key: FinalMarketParityObjectiveKey;
  label: string;
  state: FinalMarketParityObjectiveState;
  score: number;
  evidence: string;
  probeStatuses: DiagnosticsProbeStatus[];
};

type FinalMarketParityLaunchReadiness = {
  status: "pass" | "fail";
  score: number;
};

export type FinalMarketParitySnapshot = {
  checkedAt: string;
  mode: "final_market_parity_closure";
  status: "closed" | "partially_closed";
  score: number;
  objectives: FinalMarketParityObjective[];
  guards: FinalMarketParityGuard[];
  evidence: {
    diagnosticsReadiness: DiagnosticsProbeStatus;
    probeCoverage: number;
    routeCoverage: number;
    subsystemCoverage: number;
    launchReadinessGate: FinalMarketParityLaunchReadiness;
  };
  truth: {
    parityClaim: "market_parity_closed" | "market_parity_partially_closed";
    launchClaim: "not_launched";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    paperOnly: true;
    brokerRouting: "blocked";
    externalFeed: "fallback_active";
    billing: "inactive";
    notifications: "unconfigured";
    predictiveGuarantee: "none";
    winRateClaim: "none";
  };
  limitations: string[];
};

function findProbeStatus(
  health: DiagnosticsHealthSnapshot,
  key: string
): DiagnosticsProbeStatus {
  return health.probes.find((probe) => probe.key === key)?.status ?? "unavailable";
}

function hasStatus(
  status: DiagnosticsProbeStatus,
  allowed: readonly DiagnosticsProbeStatus[]
) {
  return allowed.includes(status);
}

function statusScore(status: DiagnosticsProbeStatus) {
  switch (status) {
    case "ready":
      return 100;
    case "fallback":
      return 90;
    case "blocked":
      return 88;
    case "auth_required":
      return 86;
    case "unconfigured":
      return 82;
    case "degraded":
      return 70;
    case "unavailable":
    default:
      return 25;
  }
}

function averageScore(statuses: DiagnosticsProbeStatus[]) {
  if (statuses.length === 0) return 0;
  const total = statuses.reduce((sum, status) => sum + statusScore(status), 0);
  return Math.round(total / statuses.length);
}

function buildObjective(input: {
  key: FinalMarketParityObjectiveKey;
  label: string;
  statuses: DiagnosticsProbeStatus[];
  passes: boolean;
  evidence: string;
}): FinalMarketParityObjective {
  return {
    key: input.key,
    label: input.label,
    state: input.passes ? "closed" : "partially_closed",
    score: averageScore(input.statuses),
    evidence: input.evidence,
    probeStatuses: input.statuses,
  };
}

export function buildFinalMarketParitySnapshot(input: {
  health: DiagnosticsHealthSnapshot;
  launchReadinessGate: FinalMarketParityLaunchReadiness;
  checkedAt?: string;
}): FinalMarketParitySnapshot {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const health = input.health;

  const tradingWorkflowStatuses = [
    findProbeStatus(health, "market_data"),
    findProbeStatus(health, "preferences_persistence"),
    findProbeStatus(health, "workspace_persistence"),
    findProbeStatus(health, "product_backend_state"),
    findProbeStatus(health, "alerts_workflow"),
  ];
  const platformClientStatuses = [
    findProbeStatus(health, "desktop_apps_foundation"),
    findProbeStatus(health, "desktop_productization"),
    findProbeStatus(health, "mobile_apps_foundation"),
    findProbeStatus(health, "mobile_productization"),
  ];
  const integrationStatuses = [
    findProbeStatus(health, "real_integrations_foundation"),
    findProbeStatus(health, "real_activation_pilot"),
    findProbeStatus(health, "broker_connector"),
    findProbeStatus(health, "market_data"),
  ];
  const trustStatuses = [
    findProbeStatus(health, "security_guardrails"),
    findProbeStatus(health, "product_backend_state"),
    findProbeStatus(health, "launch_readiness_gate"),
  ];
  const opsStatuses = [
    findProbeStatus(health, "enterprise_ops_foundation"),
    findProbeStatus(health, "production_ops_activation"),
    findProbeStatus(health, "production_hardening"),
  ];
  const commercialStatuses = [
    findProbeStatus(health, "commercial_scaling_foundation"),
    findProbeStatus(health, "commercial_activation"),
    findProbeStatus(health, "soft_launch_preparation"),
    findProbeStatus(health, "public_launch_preparation"),
  ];
  const intelligenceStatuses = [
    findProbeStatus(health, "intelligence_backend"),
    findProbeStatus(health, "ai_iq_brain_foundation"),
    findProbeStatus(health, "ai_iq_brain_deepening"),
  ];

  const objectives: FinalMarketParityObjective[] = [
    buildObjective({
      key: "trading_workflow",
      label: "Trading workflow parity",
      statuses: tradingWorkflowStatuses,
      passes:
        hasStatus(tradingWorkflowStatuses[0], ["fallback", "ready"]) &&
        hasStatus(tradingWorkflowStatuses[1], ["ready"]) &&
        hasStatus(tradingWorkflowStatuses[2], ["ready"]) &&
        hasStatus(tradingWorkflowStatuses[3], ["ready"]) &&
        hasStatus(tradingWorkflowStatuses[4], ["ready", "unconfigured"]),
      evidence:
        "Market/workspace/preference/product contracts remain operational with explicit fallback and workflow truth semantics.",
    }),
    buildObjective({
      key: "platform_clients",
      label: "Platform parity (web/desktop/mobile)",
      statuses: platformClientStatuses,
      passes:
        hasStatus(platformClientStatuses[0], ["ready"]) &&
        hasStatus(platformClientStatuses[1], ["ready", "unconfigured"]) &&
        hasStatus(platformClientStatuses[2], ["ready"]) &&
        hasStatus(platformClientStatuses[3], ["ready", "unconfigured"]),
      evidence:
        "Cross-client foundations are active and productization readiness remains explicitly guarded where distribution is not released.",
    }),
    buildObjective({
      key: "real_integrations",
      label: "Real integration parity",
      statuses: integrationStatuses,
      passes:
        hasStatus(integrationStatuses[0], ["blocked", "unconfigured", "ready"]) &&
        hasStatus(integrationStatuses[1], ["blocked", "unconfigured", "ready"]) &&
        hasStatus(integrationStatuses[2], ["blocked", "unconfigured"]) &&
        hasStatus(integrationStatuses[3], ["fallback", "ready"]),
      evidence:
        "Broker/feed and pilot layers are explicit, auditable, and safety-gated; inactive/live paths are policy-blocked instead of unfinished.",
    }),
    buildObjective({
      key: "trust_safety",
      label: "Trust and safety parity",
      statuses: trustStatuses,
      passes:
        hasStatus(trustStatuses[0], ["ready"]) &&
        hasStatus(trustStatuses[1], ["ready"]) &&
        hasStatus(trustStatuses[2], ["ready", "degraded"]) &&
        health.policyTruth?.paperOnly === true &&
        health.policyTruth?.liveExecution === "blocked",
      evidence:
        "Safety semantics remain explicit across blocked, fallback, and auth-guarded surfaces with paper-only enforcement intact.",
    }),
    buildObjective({
      key: "ops_reliability",
      label: "Ops and reliability parity",
      statuses: opsStatuses,
      passes:
        hasStatus(opsStatuses[0], ["ready"]) &&
        hasStatus(opsStatuses[1], ["ready", "degraded"]) &&
        hasStatus(opsStatuses[2], ["ready", "degraded"]),
      evidence:
        "Ops telemetry, activation, and hardening probes provide actionable degraded-state and recovery truth.",
    }),
    buildObjective({
      key: "commercial_product",
      label: "Commercial product parity",
      statuses: commercialStatuses,
      passes:
        hasStatus(commercialStatuses[0], ["ready"]) &&
        hasStatus(commercialStatuses[1], ["ready", "degraded"]) &&
        hasStatus(commercialStatuses[2], ["ready", "degraded"]) &&
        hasStatus(commercialStatuses[3], ["ready", "degraded"]),
      evidence:
        "Commercial lifecycle semantics are mature and explicit while billing/checkout remains intentionally inactive.",
    }),
    buildObjective({
      key: "intelligence",
      label: "AI / IQ / Brain parity",
      statuses: intelligenceStatuses,
      passes:
        hasStatus(intelligenceStatuses[0], ["ready"]) &&
        hasStatus(intelligenceStatuses[1], ["ready", "degraded"]) &&
        hasStatus(intelligenceStatuses[2], ["ready", "degraded"]),
      evidence:
        "Intelligence surfaces are bounded, degraded-aware, and non-predictive with no guarantee claims.",
    }),
  ];

  const guards: FinalMarketParityGuard[] = [
    {
      capability: "live_execution",
      state: "blocked",
      rationale:
        "Live execution remains policy-gated and blocked by default for safety.",
    },
    {
      capability: "real_money_routing",
      state: "blocked",
      rationale:
        "Real-money routing remains blocked unless explicit operator and policy release is granted.",
    },
    {
      capability: "external_feed_live_activation",
      state: "blocked",
      rationale:
        "External feed activation remains guarded and cannot auto-activate into live mode.",
    },
    {
      capability: "broker_live_activation",
      state: "blocked",
      rationale:
        "Broker live activation remains blocked pending explicit safe policy release.",
    },
    {
      capability: "billing_checkout",
      state: "inactive",
      rationale:
        "Billing and checkout are intentionally inactive until genuine implementation is shipped.",
    },
    {
      capability: "notification_delivery",
      state: "unconfigured",
      rationale:
        "Outbound notification delivery channels remain explicitly unconfigured unless wired.",
    },
    {
      capability: "auto_trading",
      state: "blocked",
      rationale:
        "Auto-trading remains blocked to preserve operator-manual execution authority.",
    },
  ];

  const closedObjectives = objectives.filter(
    (objective) => objective.state === "closed"
  ).length;
  const objectiveScore = objectives.reduce((sum, objective) => sum + objective.score, 0);
  const score = Math.round(objectiveScore / Math.max(1, objectives.length));
  const status =
    closedObjectives === objectives.length &&
    input.launchReadinessGate.status !== "fail"
      ? "closed"
      : "partially_closed";

  return {
    checkedAt,
    mode: "final_market_parity_closure",
    status,
    score,
    objectives,
    guards,
    evidence: {
      diagnosticsReadiness: health.readiness.status,
      probeCoverage: health.probes.length,
      routeCoverage: health.routes.length,
      subsystemCoverage: health.subsystems?.length ?? 0,
      launchReadinessGate: input.launchReadinessGate,
    },
    truth: {
      parityClaim:
        status === "closed"
          ? "market_parity_closed"
          : "market_parity_partially_closed",
      launchClaim: "not_launched",
      publicLaunchClaim: "not_claimed",
      liveExecution: "blocked",
      paperOnly: true,
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
      billing: "inactive",
      notifications: "unconfigured",
      predictiveGuarantee: "none",
      winRateClaim: "none",
    },
    limitations: [
      "Parity closure indicates market-comparable maturity with explicit safety/commercial gating, not public launch.",
      "Live execution, real-money routing, and billing checkout remain blocked or inactive unless explicitly released.",
      "Notification delivery channels remain non-deceptive and unconfigured until truly wired.",
    ],
  };
}

export function getFinalMarketParityDiagnosticsProbe(
  snapshot: FinalMarketParitySnapshot
): DiagnosticsProbe {
  return {
    key: "market_parity_closure",
    label: "Final market parity closure",
    status: snapshot.status === "closed" ? "ready" : "degraded",
    summary:
      snapshot.status === "closed"
        ? "Final market parity closure is satisfied with explicit guarded capability truth."
        : "Final market parity closure is partially satisfied and requires objective remediation.",
    detail:
      `Parity score ${snapshot.score}/100 with ${snapshot.objectives.filter((objective) => objective.state === "closed").length}/${snapshot.objectives.length} objectives closed. ` +
      `Launch gate=${snapshot.evidence.launchReadinessGate.status} (${snapshot.evidence.launchReadinessGate.score}/100).`,
    checkedAt: snapshot.checkedAt,
  };
}
