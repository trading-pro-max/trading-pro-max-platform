import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import { getAccountComplianceSnapshotForAuthenticatedSession } from "@/lib/server/compliance";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import { getBrokerIntegrationSnapshot } from "@/lib/server/connectors/broker";
import { getMarketFeedArchitectureSnapshot } from "@/lib/server/market-data/service";
import { getAlertWorkflowSnapshot } from "@/lib/server/workflows";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type CommercialPlanKey =
  | "evaluation"
  | "team_review"
  | "enterprise_guarded";

export type CommercialPlanCatalogSnapshot = {
  checkedAt: string;
  plans: Array<{
    key: CommercialPlanKey;
    label: string;
    state: "available" | "reserved";
    activation: "manual_review_required";
    billing: "inactive";
    capabilities: {
      workspaceSeats: string;
      automation: "inactive";
      liveExecution: "blocked";
      brokerRouting: "blocked";
    };
  }>;
  truth: {
    billingEngine: "inactive";
    subscriptionEngine: "unconfigured";
    checkoutSurface: "not_enabled";
    paidPlanActivation: "not_enabled";
  };
  summary: string;
};

export type CommercialScalingFoundationSnapshot = {
  checkedAt: string;
  account: {
    id: string;
    mode: "demo";
    lifecycleState: string;
    region: string;
  };
  customerLifecycle: {
    onboarding: string;
    reviewState: string;
    activationState: string;
    nextStep: string;
  };
  plan: {
    key: "evaluation";
    state: "active_evaluation";
    upgradePath: Array<"team_review" | "enterprise_guarded">;
  };
  capabilities: {
    workspaceSeats: {
      current: number;
      limit: number;
      state: "single_operator";
    };
    apiAccess: "contract_ready_guarded";
    automation: "inactive";
    liveExecution: "blocked";
    brokerRouting: "blocked";
    marketData: "fallback_first";
  };
  billing: {
    engine: "inactive";
    subscriptions: "unconfigured";
    invoicing: "not_enabled";
    checkout: "not_enabled";
  };
  supportOps: {
    caseIntake: "manual_operator";
    queueState: "guarded";
    openCases: number;
    workflow: "operator_review_guarded";
  };
  productOps: {
    diagnostics: "active";
    rollout: "manual_controlled";
    changeManagement: "operator_review";
  };
  trust: {
    paperOnly: true;
    liveExecution: "blocked";
    paidPlanActivation: "not_enabled";
    billingClaims: "none";
  };
  readiness: {
    score: number;
    stage: "foundation_ready" | "commercial_contract_ready" | "scaling_guarded";
  };
  summary: string;
  detail: string;
};

export function getCommercialPlanCatalogSnapshot(
  checkedAt = new Date().toISOString()
): CommercialPlanCatalogSnapshot {
  return {
    checkedAt,
    plans: [
      {
        key: "evaluation",
        label: "Evaluation",
        state: "available",
        activation: "manual_review_required",
        billing: "inactive",
        capabilities: {
          workspaceSeats: "single_operator",
          automation: "inactive",
          liveExecution: "blocked",
          brokerRouting: "blocked",
        },
      },
      {
        key: "team_review",
        label: "Team Review",
        state: "reserved",
        activation: "manual_review_required",
        billing: "inactive",
        capabilities: {
          workspaceSeats: "multi_operator_reserved",
          automation: "inactive",
          liveExecution: "blocked",
          brokerRouting: "blocked",
        },
      },
      {
        key: "enterprise_guarded",
        label: "Enterprise Guarded",
        state: "reserved",
        activation: "manual_review_required",
        billing: "inactive",
        capabilities: {
          workspaceSeats: "enterprise_reserved",
          automation: "inactive",
          liveExecution: "blocked",
          brokerRouting: "blocked",
        },
      },
    ],
    truth: {
      billingEngine: "inactive",
      subscriptionEngine: "unconfigured",
      checkoutSurface: "not_enabled",
      paidPlanActivation: "not_enabled",
    },
    summary:
      "Commercial catalog contracts are available with honest inactive billing/subscription semantics.",
  };
}

export async function getCommercialScalingFoundationForAuthenticatedSession(
  session: AuthenticatedSession
): Promise<CommercialScalingFoundationSnapshot> {
  const checkedAt = new Date().toISOString();
  const [compliance, broker, marketFeed, workflow, openCases] = await Promise.all([
    getAccountComplianceSnapshotForAuthenticatedSession(session),
    Promise.resolve(getBrokerIntegrationSnapshot(checkedAt)),
    Promise.resolve(getMarketFeedArchitectureSnapshot(checkedAt)),
    getAlertWorkflowSnapshot(session.account.id),
    prisma.auditEvent.count({
      where: {
        accountId: session.account.id,
        scope: { in: ["compliance", "platform"] },
        kind: { in: ["review_state_changed", "operator_review_action"] },
      },
    }),
  ]);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "account_lifecycle_contract", ok: true, weight: 20 },
      { key: "plan_catalog_contract", ok: true, weight: 15 },
      { key: "support_ops_contract", ok: true, weight: 15 },
      { key: "billing_truth_guard", ok: true, weight: 15 },
      {
        key: "broker_guard",
        ok: broker.integration.realRouting === "blocked",
        weight: 15,
      },
      {
        key: "market_guard",
        ok: marketFeed.policyMode === "fallback_first",
        weight: 10,
      },
      {
        key: "workflow_contract",
        ok: workflow.runtime.liveExecution === "blocked",
        weight: 10,
      },
    ],
    stageThresholds: [
      { stage: "foundation_ready", minScore: 0 },
      { stage: "commercial_contract_ready", minScore: 70 },
      { stage: "scaling_guarded", minScore: 90 },
    ],
  });
  const lifecycleState =
    compliance?.account.lifecycleState ?? session.account.lifecycleState;
  const region = compliance?.account.region ?? session.account.region;
  const reviewState = compliance?.review.state ?? "not_started";
  const activationState = compliance?.activation.paperState ?? "gated";
  const nextStep = compliance?.activation.nextStep ?? "accept_disclosures";

  return {
    checkedAt,
    account: {
      id: session.account.id,
      mode: "demo",
      lifecycleState,
      region,
    },
    customerLifecycle: {
      onboarding: lifecycleState,
      reviewState,
      activationState,
      nextStep,
    },
    plan: {
      key: "evaluation",
      state: "active_evaluation",
      upgradePath: ["team_review", "enterprise_guarded"],
    },
    capabilities: {
      workspaceSeats: {
        current: 1,
        limit: 1,
        state: "single_operator",
      },
      apiAccess: "contract_ready_guarded",
      automation: "inactive",
      liveExecution: "blocked",
      brokerRouting: "blocked",
      marketData: "fallback_first",
    },
    billing: {
      engine: "inactive",
      subscriptions: "unconfigured",
      invoicing: "not_enabled",
      checkout: "not_enabled",
    },
    supportOps: {
      caseIntake: "manual_operator",
      queueState: "guarded",
      openCases,
      workflow: "operator_review_guarded",
    },
    productOps: {
      diagnostics: "active",
      rollout: "manual_controlled",
      changeManagement: "operator_review",
    },
    trust: {
      paperOnly: true,
      liveExecution: "blocked",
      paidPlanActivation: "not_enabled",
      billingClaims: "none",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as
        | "foundation_ready"
        | "commercial_contract_ready"
        | "scaling_guarded",
    },
    summary:
      "Commercial scaling contracts are active with guarded account lifecycle, support-ops, and capability state foundations.",
    detail:
      "Commercial backend foundations include plan/capability contracts, account lifecycle linkage, and support/product operations state. Billing and subscriptions remain intentionally inactive and no paid activation is implied.",
  };
}

export async function getCommercialScalingDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const [accountCount, reviewCount] = await Promise.all([
      prisma.account.count(),
      prisma.complianceReview.count(),
    ]);

    return {
      key: "commercial_scaling_foundation",
      label: "Commercial scaling foundation",
      status: "ready",
      summary: "Commercial backend contracts are available",
      detail:
        `Account lifecycle and review stores are reachable (${accountCount} account(s), ${reviewCount} review record(s)). Plan/catalog, support-ops, and billing-truth contracts are active with no paid activation path enabled.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "commercial_scaling_foundation",
      label: "Commercial scaling foundation",
      status: "degraded",
      summary: "Commercial backend contracts are degraded",
      detail:
        error instanceof Error
          ? error.message
          : "Commercial scaling probe failed.",
      checkedAt,
    };
  }
}
