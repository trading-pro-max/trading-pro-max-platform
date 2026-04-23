import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import { getBrokerIntegrationSnapshot } from "@/lib/server/connectors/broker";
import { getMarketFeedArchitectureSnapshot } from "@/lib/server/market-data/service";
import { getOperatorKeyMode } from "@/lib/server/operator/access";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type RealIntegrationsReadinessStage =
  | "unconfigured"
  | "configured_guarded"
  | "policy_blocked";

export type RealIntegrationsFoundationSnapshot = {
  checkedAt: string;
  readiness: {
    score: number;
    stage: RealIntegrationsReadinessStage;
  };
  broker: {
    state: "unconfigured" | "configured_blocked";
    endpointConfigured: boolean;
    credentialsState: "unconfigured" | "partially_configured" | "configured";
    operatorReviewState: string;
    activationGate: "configuration_required" | "policy_blocked";
    credentialLifecycle: {
      rotationMode: "manual_operator_rotation";
      validation: "guarded_local_probe";
      auditTrail: "local_audit";
    };
  };
  marketFeed: {
    state: "unconfigured" | "configured_inactive" | "configured_blocked";
    endpointConfigured: boolean;
    credentialsState: "unconfigured" | "partially_configured" | "configured";
    activationRequested: boolean;
    credentialLifecycle: {
      rotationMode: "manual_operator_rotation";
      validation: "guarded_local_probe";
      auditTrail: "local_audit";
    };
  };
  policy: {
    paperOnly: true;
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerActivation: "blocked_until_policy_release";
    externalFeedActivation: "blocked_until_policy_release";
    operatorApproval: "required";
  };
  activation: {
    mode: "operator_review_and_policy_guard";
    canActivateNow: false;
    operatorKeyMode: ReturnType<typeof getOperatorKeyMode>;
    sandboxState: "inactive_guarded";
    auditReference: "local_audit_contract";
    checklist: Array<
      | "broker_endpoint"
      | "broker_credentials"
      | "feed_endpoint"
      | "feed_credentials"
      | "operator_review"
      | "policy_release"
    >;
    blockedReasons: string[];
  };
  pilotPath: {
    mode: "sandbox_only";
    scope: "single_broker_single_feed";
    state: "inactive_guarded";
    canEnterPilot: false;
    nextMilestones: string[];
  };
  summary: string;
  detail: string;
};

function dedupe(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function getRealIntegrationsFoundationSnapshot(
  checkedAt = new Date().toISOString()
): RealIntegrationsFoundationSnapshot {
  const broker = getBrokerIntegrationSnapshot(checkedAt);
  const marketFeed = getMarketFeedArchitectureSnapshot(checkedAt);
  const operatorKeyMode = getOperatorKeyMode();
  const blockedReasons = dedupe([
    ...broker.activationPolicy.blockedReasons,
    ...marketFeed.activationPolicy.blockedReasons,
    "paper_only_policy_enforced",
  ]);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "broker_endpoint", ok: broker.provider.configured, weight: 20 },
      {
        key: "broker_credentials",
        ok: broker.credentials.state === "configured",
        weight: 15,
      },
      {
        key: "market_endpoint",
        ok: marketFeed.externalDriver.endpointConfigured,
        weight: 20,
      },
      {
        key: "market_credentials",
        ok: marketFeed.credentials.state === "configured",
        weight: 15,
      },
      {
        key: "operator_review_guard",
        ok: broker.operatorReview.state !== "unconfigured",
        weight: 10,
      },
      { key: "paper_only_policy", ok: true, weight: 20 },
    ],
    stageThresholds: [
      { stage: "unconfigured", minScore: 0 },
      { stage: "configured_guarded", minScore: 55 },
      { stage: "policy_blocked", minScore: 80 },
    ],
  });
  const readinessStage = readiness.stage as RealIntegrationsReadinessStage;

  return {
    checkedAt,
    readiness: {
      score: readiness.score,
      stage: readinessStage,
    },
    broker: {
      state: broker.integration.state,
      endpointConfigured: broker.provider.configured,
      credentialsState: broker.credentials.state,
      operatorReviewState: broker.operatorReview.state,
      activationGate: broker.integration.activationGate,
      credentialLifecycle: {
        rotationMode: "manual_operator_rotation",
        validation: "guarded_local_probe",
        auditTrail: "local_audit",
      },
    },
    marketFeed: {
      state: marketFeed.externalDriver.state,
      endpointConfigured: marketFeed.externalDriver.endpointConfigured,
      credentialsState: marketFeed.credentials.state,
      activationRequested: marketFeed.externalDriver.activationRequested,
      credentialLifecycle: {
        rotationMode: "manual_operator_rotation",
        validation: "guarded_local_probe",
        auditTrail: "local_audit",
      },
    },
    policy: {
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_policy_release",
      externalFeedActivation: "blocked_until_policy_release",
      operatorApproval: "required",
    },
    activation: {
      mode: "operator_review_and_policy_guard",
      canActivateNow: false,
      operatorKeyMode,
      sandboxState: "inactive_guarded",
      auditReference: "local_audit_contract",
      checklist: [
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "operator_review",
        "policy_release",
      ],
      blockedReasons,
    },
    pilotPath: {
      mode: "sandbox_only",
      scope: "single_broker_single_feed",
      state: "inactive_guarded",
      canEnterPilot: false,
      nextMilestones: [
        "configure broker endpoint and credentials",
        "configure external feed endpoint and credentials",
        "complete operator review setup",
        "request explicit policy release for guarded pilot",
      ],
    },
    summary:
      readinessStage === "unconfigured"
        ? "Broker and external feed integrations are unconfigured and safely blocked."
        : "Integration contracts are configured in parts, but activation is safely policy-blocked.",
    detail:
      "Real integration contracts are explicit for broker connectivity and external market feed activation. Live execution stays blocked, real-money routing is disabled, and operator policy remains mandatory before any future activation path.",
  };
}

export function getRealIntegrationsDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getRealIntegrationsFoundationSnapshot(checkedAt);
  const status =
    snapshot.readiness.stage === "unconfigured" ? "unconfigured" : "blocked";

  return {
    key: "real_integrations_foundation",
    label: "Real integrations foundation",
    status,
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
