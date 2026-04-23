import "server-only";
import type {
  DiagnosticsHealthSnapshot,
  DiagnosticsProbeStatus,
} from "@/modules/shell/types/platform-state";

export type LaunchReadinessMode = "verification_gate";
export type LaunchReadinessGateStatus = "pass" | "fail";
export type LaunchReadinessDomainKey =
  | "platform"
  | "integrations"
  | "ops"
  | "trust"
  | "commercial"
  | "desktop"
  | "mobile"
  | "alerts"
  | "intelligence";
export type LaunchReadinessDomainState = "pass" | "warn" | "fail";

export type LaunchReadinessDomain = {
  key: LaunchReadinessDomainKey;
  label: string;
  required: boolean;
  state: LaunchReadinessDomainState;
  evidence: string;
  statuses: DiagnosticsProbeStatus[];
};

export type LaunchReadinessChecklistItem = {
  key: string;
  label: string;
  passed: boolean;
  evidence: string;
};

export type LaunchReadinessGateSnapshot = {
  checkedAt: string;
  gateVersion: "tpm.launch.readiness.v1";
  mode: LaunchReadinessMode;
  overall: {
    status: LaunchReadinessGateStatus;
    score: number;
    evaluatedDomains: number;
    passCount: number;
    warnCount: number;
    failCount: number;
  };
  domains: LaunchReadinessDomain[];
  checklist: {
    requiredCount: number;
    passedCount: number;
    failedCount: number;
    items: LaunchReadinessChecklistItem[];
  };
  evidence: {
    diagnosticsReadiness: DiagnosticsProbeStatus;
    probeCoverage: number;
    routeCoverage: number;
    subsystemCoverage: number;
  };
  truth: {
    launchClaim: "not_launched";
    launchReadinessLanguage: "evidence_based_only";
    publicLaunchClaim: "not_claimed";
    liveExecution: "blocked";
    paperOnly: true;
    brokerRouting: "blocked";
    externalFeed: "fallback_active";
    autoTrading: "blocked";
  };
  limitations: string[];
};

function gateStateFromStatuses(
  statuses: DiagnosticsProbeStatus[]
): LaunchReadinessDomainState {
  if (statuses.some((status) => status === "unavailable")) return "fail";
  if (
    statuses.some(
      (status) =>
        status === "blocked" ||
        status === "degraded" ||
        status === "unconfigured"
    )
  ) {
    return "warn";
  }

  return "pass";
}

function findProbeStatus(
  health: DiagnosticsHealthSnapshot,
  key: string
): DiagnosticsProbeStatus {
  return (
    health.probes.find((probe) => probe.key === key)?.status ?? "unavailable"
  );
}

function findRouteStatus(
  health: DiagnosticsHealthSnapshot,
  path: string
): DiagnosticsProbeStatus {
  return (
    health.routes.find((route) => route.path === path)?.status ?? "unavailable"
  );
}

function buildDomain(
  health: DiagnosticsHealthSnapshot,
  input: {
    key: LaunchReadinessDomainKey;
    label: string;
    required: boolean;
    probeKeys: string[];
    evidence: string;
  }
): LaunchReadinessDomain {
  const statuses = input.probeKeys.map((probeKey) =>
    findProbeStatus(health, probeKey)
  );

  return {
    key: input.key,
    label: input.label,
    required: input.required,
    state: gateStateFromStatuses(statuses),
    evidence: input.evidence,
    statuses,
  };
}

function buildChecklist(health: DiagnosticsHealthSnapshot) {
  const policyTruth = health.policyTruth;
  const readinessStatus = health.readiness.status;
  const marketFeedRouteStatus = findRouteStatus(health, "/api/market/feed-state");
  const preferencesRouteStatus = findRouteStatus(health, "/api/account/preferences");
  const alertsRouteStatus = findRouteStatus(health, "/api/alerts/workflows");
  const aiInsightsRouteStatus = findRouteStatus(health, "/api/intelligence/insights");
  const diagnosticsRouteStatus = findRouteStatus(health, "/api/diagnostics/probes");

  const items: LaunchReadinessChecklistItem[] = [
    {
      key: "health_route_operational",
      label: "Health route reports an operational readiness state",
      passed: readinessStatus === "ready" || readinessStatus === "degraded",
      evidence: `health.readiness.status=${readinessStatus}`,
    },
    {
      key: "paper_only_guard",
      label: "Paper-only guard remains enforced",
      passed:
        policyTruth?.paperOnly === true &&
        policyTruth?.liveExecution === "blocked",
      evidence: `paperOnly=${String(policyTruth?.paperOnly)} liveExecution=${policyTruth?.liveExecution ?? "missing"}`,
    },
    {
      key: "market_fallback_truth",
      label: "Market feed route exposes fallback-first truth",
      passed: marketFeedRouteStatus === "fallback",
      evidence: `/api/market/feed-state=${marketFeedRouteStatus}`,
    },
    {
      key: "preferences_auth_guard",
      label: "Account preference route remains auth-guarded",
      passed: preferencesRouteStatus === "auth_required",
      evidence: `/api/account/preferences=${preferencesRouteStatus}`,
    },
    {
      key: "alerts_surface_truthful",
      label: "Alerts workflow route remains explicitly scoped/auth-guarded",
      passed:
        alertsRouteStatus === "auth_required" ||
        alertsRouteStatus === "unconfigured",
      evidence: `/api/alerts/workflows=${alertsRouteStatus}`,
    },
    {
      key: "ai_surface_truthful",
      label: "AI/IQ route remains bounded and truthful",
      passed:
        aiInsightsRouteStatus === "ready" || aiInsightsRouteStatus === "degraded",
      evidence: `/api/intelligence/insights=${aiInsightsRouteStatus}`,
    },
    {
      key: "diagnostics_route_operational",
      label: "Diagnostics route remains operational",
      passed:
        diagnosticsRouteStatus === "ready" ||
        diagnosticsRouteStatus === "degraded",
      evidence: `/api/diagnostics/probes=${diagnosticsRouteStatus}`,
    },
  ];

  return {
    requiredCount: items.length,
    passedCount: items.filter((item) => item.passed).length,
    failedCount: items.filter((item) => !item.passed).length,
    items,
  };
}

function scoreDomains(domains: LaunchReadinessDomain[]) {
  const passCount = domains.filter((domain) => domain.state === "pass").length;
  const warnCount = domains.filter((domain) => domain.state === "warn").length;
  const failCount = domains.filter((domain) => domain.state === "fail").length;
  const rawScore = domains.reduce((sum, domain) => {
    if (domain.state === "pass") return sum + 100;
    if (domain.state === "warn") return sum + 65;
    return sum + 20;
  }, 0);
  const score = Math.round(rawScore / Math.max(1, domains.length));

  return {
    score,
    passCount,
    warnCount,
    failCount,
  };
}

export function buildLaunchReadinessGateSnapshot(
  health: DiagnosticsHealthSnapshot,
  checkedAt = new Date().toISOString()
): LaunchReadinessGateSnapshot {
  const domains: LaunchReadinessDomain[] = [
    buildDomain(health, {
      key: "platform",
      label: "Platform baseline",
      required: true,
      probeKeys: [
        "server_readiness",
        "runtime_baseline",
        "runtime_ops",
        "product_backend_state",
      ],
      evidence: "Server/runtime/product contracts are healthy and diagnosable.",
    }),
    buildDomain(health, {
      key: "integrations",
      label: "Integration controls",
      required: true,
      probeKeys: [
        "real_integrations_foundation",
        "real_activation_pilot",
        "broker_connector",
        "market_data",
      ],
      evidence:
        "Broker/feed/pilot paths are explicit, guarded, and policy constrained.",
    }),
    buildDomain(health, {
      key: "ops",
      label: "Operational readiness",
      required: true,
      probeKeys: ["enterprise_ops_foundation", "production_ops_activation"],
      evidence:
        "Ops telemetry, runbook, and guarded activation semantics are available.",
    }),
    buildDomain(health, {
      key: "trust",
      label: "Trust and safety semantics",
      required: true,
      probeKeys: ["security_guardrails", "product_backend_state"],
      evidence:
        "Safety and trust semantics remain explicit for blocked/fallback/degraded states.",
    }),
    buildDomain(health, {
      key: "commercial",
      label: "Commercial truth",
      required: true,
      probeKeys: ["commercial_scaling_foundation", "commercial_activation"],
      evidence:
        "Commercial lifecycle contracts are explicit with inactive billing truth.",
    }),
    buildDomain(health, {
      key: "desktop",
      label: "Desktop readiness semantics",
      required: false,
      probeKeys: ["desktop_apps_foundation", "desktop_productization"],
      evidence:
        "Desktop contracts are explicit with guarded packaging/release truth.",
    }),
    buildDomain(health, {
      key: "mobile",
      label: "Mobile readiness semantics",
      required: false,
      probeKeys: ["mobile_apps_foundation", "mobile_productization"],
      evidence:
        "Mobile contracts are explicit with guarded distribution/push truth.",
    }),
    buildDomain(health, {
      key: "alerts",
      label: "Alerts/workflow semantics",
      required: false,
      probeKeys: [
        "alerts_workflow",
        "alerts_automation",
        "alerts_delivery_activation",
      ],
      evidence:
        "Workflow/automation/delivery state is explicit and non-deceptive.",
    }),
    buildDomain(health, {
      key: "intelligence",
      label: "AI / IQ / Brain semantics",
      required: true,
      probeKeys: [
        "intelligence_backend",
        "ai_iq_brain_foundation",
        "ai_iq_brain_deepening",
      ],
      evidence:
        "Intelligence remains bounded, degraded-aware, and non-predictive.",
    }),
  ];
  const checklist = buildChecklist(health);
  const domainScore = scoreDomains(domains);
  const criticalFailure =
    domains.some((domain) => domain.required && domain.state === "fail") ||
    checklist.failedCount > 0;
  const overallStatus: LaunchReadinessGateStatus = criticalFailure
    ? "fail"
    : "pass";
  const overallScore = Math.max(
    0,
    Math.min(100, Math.round((domainScore.score * 0.75 + (checklist.passedCount / Math.max(1, checklist.requiredCount)) * 100 * 0.25)))
  );

  return {
    checkedAt,
    gateVersion: "tpm.launch.readiness.v1",
    mode: "verification_gate",
    overall: {
      status: overallStatus,
      score: overallScore,
      evaluatedDomains: domains.length,
      passCount: domainScore.passCount,
      warnCount: domainScore.warnCount,
      failCount: domainScore.failCount,
    },
    domains,
    checklist,
    evidence: {
      diagnosticsReadiness: health.readiness.status,
      probeCoverage: health.probes.length,
      routeCoverage: health.routes.length,
      subsystemCoverage: health.subsystems?.length ?? 0,
    },
    truth: {
      launchClaim: "not_launched",
      launchReadinessLanguage: "evidence_based_only",
      publicLaunchClaim: "not_claimed",
      liveExecution: "blocked",
      paperOnly: true,
      brokerRouting: "blocked",
      externalFeed: "fallback_active",
      autoTrading: "blocked",
    },
    limitations: [
      "Readiness gate reflects current operational truth and does not imply public launch.",
      "Billing, outbound notification delivery, and live trading remain separate implementation decisions.",
      "Launch readiness can degrade if required probes become unavailable.",
    ],
  };
}
