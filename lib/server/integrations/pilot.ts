import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

const PILOT_SCOPE = "single_broker_single_feed";
const PILOT_ENVIRONMENT = "sandbox_pilot_only";
const PILOT_NAMESPACE = "pilot";
const BROKER_PATH_KEY = "pilot_single_broker_path";
const FEED_PATH_KEY = "pilot_single_feed_path";

type PilotReadinessStage =
  | "unconfigured"
  | "configured_guarded"
  | "pilot_guarded_ready";
type PilotCredentialsState =
  | "unconfigured"
  | "partially_configured"
  | "configured";
type PilotPathState = "unconfigured" | "configured_guarded";
type PilotActivationState =
  | "inactive_unconfigured"
  | "inactive_guarded"
  | "pilot_requested_blocked"
  | "pilot_guarded_ready";

export type RealActivationPilotSnapshot = {
  checkedAt: string;
  truth: {
    environment: typeof PILOT_ENVIRONMENT;
    scope: typeof PILOT_SCOPE;
    claims: "no_live_ready_claims";
  };
  isolation: {
    productionIsolation: true;
    namespace: string;
    dataPlane: "sandbox_only";
  };
  brokerPath: {
    key: typeof BROKER_PATH_KEY;
    provider: "http_connector";
    endpointConfigured: boolean;
    credentialsState: PilotCredentialsState;
    state: PilotPathState;
    credentialLifecycle: {
      rotationMode: "manual_operator_rotation";
      verification: "guarded_probe_only";
      auditTrail: "local_audit";
    };
  };
  feedPath: {
    key: typeof FEED_PATH_KEY;
    provider: "http_connector";
    endpointConfigured: boolean;
    credentialsState: PilotCredentialsState;
    state: PilotPathState;
    credentialLifecycle: {
      rotationMode: "manual_operator_rotation";
      verification: "guarded_probe_only";
      auditTrail: "local_audit";
    };
  };
  activation: {
    requested: boolean;
    explicitPolicyRelease: boolean;
    mode: "sandbox_guarded";
    state: PilotActivationState;
    canEnterPilotSandbox: boolean;
    checklist: Array<
      | "broker_endpoint"
      | "broker_credentials"
      | "feed_endpoint"
      | "feed_credentials"
      | "policy_release"
      | "paper_only_guard"
    >;
    blockedReasons: string[];
  };
  controls: {
    credentialScope: "sandbox_namespace_only";
    dataPlaneIsolation: "sandbox_only";
    releaseMode: "operator_guarded_manual";
    auditReference: "local_audit_contract";
  };
  safety: {
    paperOnlyDefault: true;
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    externalMoneyMovement: "blocked";
  };
  readiness: {
    score: number;
    stage: PilotReadinessStage;
  };
  summary: string;
  detail: string;
};

function envIsTrue(value: string | null | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function isConfigured(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function resolveCredentialState(input: {
  keyConfigured: boolean;
  secretConfigured: boolean;
}): PilotCredentialsState {
  if (input.keyConfigured && input.secretConfigured) return "configured";
  if (input.keyConfigured || input.secretConfigured) return "partially_configured";
  return "unconfigured";
}

function buildBlockedReasons(input: {
  brokerEndpointConfigured: boolean;
  brokerCredentialsState: PilotCredentialsState;
  feedEndpointConfigured: boolean;
  feedCredentialsState: PilotCredentialsState;
  requested: boolean;
  explicitPolicyRelease: boolean;
}) {
  const blockedReasons: string[] = [];

  if (!input.brokerEndpointConfigured) {
    blockedReasons.push("pilot_broker_endpoint_required");
  }

  if (input.brokerCredentialsState !== "configured") {
    blockedReasons.push("pilot_broker_credentials_required");
  }

  if (!input.feedEndpointConfigured) {
    blockedReasons.push("pilot_feed_endpoint_required");
  }

  if (input.feedCredentialsState !== "configured") {
    blockedReasons.push("pilot_feed_credentials_required");
  }

  if (!input.explicitPolicyRelease) {
    blockedReasons.push("pilot_policy_release_required");
  }

  if (input.requested) {
    blockedReasons.push("pilot_request_received_guarded");
  }

  blockedReasons.push("paper_only_default_policy");
  blockedReasons.push("real_money_routing_blocked");

  return blockedReasons;
}

function resolveActivationState(input: {
  requested: boolean;
  canEnterPilotSandbox: boolean;
  configured: boolean;
}): PilotActivationState {
  if (input.canEnterPilotSandbox) return "pilot_guarded_ready";
  if (input.requested) return "pilot_requested_blocked";
  if (input.configured) return "inactive_guarded";
  return "inactive_unconfigured";
}

export function getRealActivationPilotSnapshot(
  checkedAt = new Date().toISOString()
): RealActivationPilotSnapshot {
  const brokerEndpointConfigured = isConfigured(process.env.TPM_PILOT_BROKER_URL);
  const brokerCredentialsState = resolveCredentialState({
    keyConfigured: isConfigured(process.env.TPM_PILOT_BROKER_API_KEY),
    secretConfigured: isConfigured(process.env.TPM_PILOT_BROKER_API_SECRET),
  });
  const feedEndpointConfigured = isConfigured(process.env.TPM_PILOT_FEED_URL);
  const feedCredentialsState = resolveCredentialState({
    keyConfigured: isConfigured(process.env.TPM_PILOT_FEED_API_KEY),
    secretConfigured: isConfigured(process.env.TPM_PILOT_FEED_API_SECRET),
  });
  const requested = envIsTrue(process.env.TPM_PILOT_ACTIVATION_REQUESTED);
  const explicitPolicyRelease = envIsTrue(process.env.TPM_PILOT_POLICY_RELEASE);
  const configured =
    brokerEndpointConfigured &&
    brokerCredentialsState === "configured" &&
    feedEndpointConfigured &&
    feedCredentialsState === "configured";
  const canEnterPilotSandbox = configured && explicitPolicyRelease;
  const activationState = resolveActivationState({
    requested,
    canEnterPilotSandbox,
    configured,
  });
  const blockedReasons = buildBlockedReasons({
    brokerEndpointConfigured,
    brokerCredentialsState,
    feedEndpointConfigured,
    feedCredentialsState,
    requested,
    explicitPolicyRelease,
  });
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "sandbox_isolation", ok: true, weight: 20 },
      { key: "broker_endpoint", ok: brokerEndpointConfigured, weight: 15 },
      { key: "broker_credentials", ok: brokerCredentialsState === "configured", weight: 15 },
      { key: "feed_endpoint", ok: feedEndpointConfigured, weight: 15 },
      { key: "feed_credentials", ok: feedCredentialsState === "configured", weight: 15 },
      { key: "explicit_policy_release", ok: explicitPolicyRelease, weight: 10 },
      { key: "paper_only_default", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "unconfigured", minScore: 0 },
      { stage: "configured_guarded", minScore: 55 },
      { stage: "pilot_guarded_ready", minScore: 90 },
    ],
  });

  return {
    checkedAt,
    truth: {
      environment: PILOT_ENVIRONMENT,
      scope: PILOT_SCOPE,
      claims: "no_live_ready_claims",
    },
    isolation: {
      productionIsolation: true,
      namespace: process.env.TPM_PILOT_NAMESPACE?.trim() || PILOT_NAMESPACE,
      dataPlane: "sandbox_only",
    },
    brokerPath: {
      key: BROKER_PATH_KEY,
      provider: "http_connector",
      endpointConfigured: brokerEndpointConfigured,
      credentialsState: brokerCredentialsState,
      state: brokerEndpointConfigured ? "configured_guarded" : "unconfigured",
      credentialLifecycle: {
        rotationMode: "manual_operator_rotation",
        verification: "guarded_probe_only",
        auditTrail: "local_audit",
      },
    },
    feedPath: {
      key: FEED_PATH_KEY,
      provider: "http_connector",
      endpointConfigured: feedEndpointConfigured,
      credentialsState: feedCredentialsState,
      state: feedEndpointConfigured ? "configured_guarded" : "unconfigured",
      credentialLifecycle: {
        rotationMode: "manual_operator_rotation",
        verification: "guarded_probe_only",
        auditTrail: "local_audit",
      },
    },
    activation: {
      requested,
      explicitPolicyRelease,
      mode: "sandbox_guarded",
      state: activationState,
      canEnterPilotSandbox,
      checklist: [
        "broker_endpoint",
        "broker_credentials",
        "feed_endpoint",
        "feed_credentials",
        "policy_release",
        "paper_only_guard",
      ],
      blockedReasons,
    },
    controls: {
      credentialScope: "sandbox_namespace_only",
      dataPlaneIsolation: "sandbox_only",
      releaseMode: "operator_guarded_manual",
      auditReference: "local_audit_contract",
    },
    safety: {
      paperOnlyDefault: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      externalMoneyMovement: "blocked",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as PilotReadinessStage,
    },
    summary:
      activationState === "pilot_guarded_ready"
        ? "Pilot sandbox path is configured and policy-released for guarded sandbox validation."
        : "Pilot sandbox path is present but remains guarded/unconfigured.",
    detail:
      "A single broker path and single feed path are isolated for sandbox pilot activation only. Credential lifecycle and activation checklist contracts are explicit and audit-linked. Paper-only defaults stay enforced, live execution remains blocked, and real-money routing cannot be enabled through this pilot contract.",
  };
}

export function getRealActivationPilotDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getRealActivationPilotSnapshot(checkedAt);
  const status =
    snapshot.activation.state === "pilot_guarded_ready"
      ? "ready"
      : snapshot.activation.state === "pilot_requested_blocked"
      ? "blocked"
      : "unconfigured";

  return {
    key: "real_activation_pilot",
    label: "Real activation pilot",
    status,
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
