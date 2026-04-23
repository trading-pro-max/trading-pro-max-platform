import "server-only";
import { prisma } from "@/lib/db/client";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

const ALERT_WORKFLOW_SCHEMA = "tpm.alert.workflow.v1";
const ALERT_WORKFLOW_KIND = "data_state_updated";
const ALERT_WORKFLOW_SCOPE = "platform";
const ALERT_WORKFLOW_MESSAGE = "Alert workflow rules synchronized to backend.";

const ALERT_RULE_METRICS = ["spread", "volatility", "session_drawdown"] as const;
const ALERT_RULE_OPERATORS = ["gt", "lt"] as const;
const ALERT_RULE_ACTIONS = ["desk_note", "review_flag"] as const;
const ALERT_RULE_STATES = ["enabled", "disabled"] as const;

type AlertRuleMetric = (typeof ALERT_RULE_METRICS)[number];
type AlertRuleOperator = (typeof ALERT_RULE_OPERATORS)[number];
type AlertRuleAction = (typeof ALERT_RULE_ACTIONS)[number];
type AlertRuleState = (typeof ALERT_RULE_STATES)[number];

export type AlertWorkflowRule = {
  id: string;
  label: string;
  state: AlertRuleState;
  metric: AlertRuleMetric;
  operator: AlertRuleOperator;
  threshold: number;
  action: AlertRuleAction;
  cooldownSeconds: number;
};

type AlertWorkflowMetadataPayload = {
  schema: typeof ALERT_WORKFLOW_SCHEMA;
  rules: AlertWorkflowRule[];
  updatedAt: string;
};

export type AlertWorkflowSnapshot = {
  checkedAt: string;
  source: "defaults" | "backend_audit";
  updatedAt: string | null;
  runtime: {
    evaluationMode: "deterministic_local_rules";
    automation: "inactive";
    delivery: "unconfigured";
    executionAuthority: "manual_operator";
    liveExecution: "blocked";
  };
  rules: AlertWorkflowRule[];
  summary: string;
  limitations: string[];
};

function isAlertRuleMetric(value: string): value is AlertRuleMetric {
  return ALERT_RULE_METRICS.includes(value as AlertRuleMetric);
}

function isAlertRuleOperator(value: string): value is AlertRuleOperator {
  return ALERT_RULE_OPERATORS.includes(value as AlertRuleOperator);
}

function isAlertRuleAction(value: string): value is AlertRuleAction {
  return ALERT_RULE_ACTIONS.includes(value as AlertRuleAction);
}

function isAlertRuleState(value: string): value is AlertRuleState {
  return ALERT_RULE_STATES.includes(value as AlertRuleState);
}

function normalizeRuleId(value: string, fallbackIndex: number) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

  return normalized || `rule_${fallbackIndex + 1}`;
}

function defaultAlertRules(): AlertWorkflowRule[] {
  return [
    {
      id: "spread-expansion-watch",
      label: "Spread expansion watch",
      state: "enabled",
      metric: "spread",
      operator: "gt",
      threshold: 1.8,
      action: "desk_note",
      cooldownSeconds: 180,
    },
    {
      id: "session-drawdown-guard",
      label: "Session drawdown guard",
      state: "enabled",
      metric: "session_drawdown",
      operator: "lt",
      threshold: -120,
      action: "review_flag",
      cooldownSeconds: 300,
    },
  ];
}

function sanitizeRule(
  value: unknown,
  fallback: AlertWorkflowRule,
  index: number
): AlertWorkflowRule {
  const record = typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
  if (!record) return fallback;

  const rawId = typeof record.id === "string" ? record.id : fallback.id;
  const rawLabel = typeof record.label === "string" ? record.label : fallback.label;
  const metric = typeof record.metric === "string" && isAlertRuleMetric(record.metric)
    ? record.metric
    : fallback.metric;
  const operator =
    typeof record.operator === "string" && isAlertRuleOperator(record.operator)
      ? record.operator
      : fallback.operator;
  const state =
    typeof record.state === "string" && isAlertRuleState(record.state)
      ? record.state
      : fallback.state;
  const action =
    typeof record.action === "string" && isAlertRuleAction(record.action)
      ? record.action
      : fallback.action;
  const thresholdCandidate =
    typeof record.threshold === "number" && Number.isFinite(record.threshold)
      ? record.threshold
      : fallback.threshold;
  const cooldownCandidate =
    typeof record.cooldownSeconds === "number" && Number.isFinite(record.cooldownSeconds)
      ? record.cooldownSeconds
      : fallback.cooldownSeconds;

  return {
    id: normalizeRuleId(rawId, index),
    label: rawLabel.trim().slice(0, 96) || fallback.label,
    state,
    metric,
    operator,
    threshold: Number(thresholdCandidate.toFixed(4)),
    action,
    cooldownSeconds: Math.max(30, Math.min(3600, Math.round(cooldownCandidate))),
  };
}

function sanitizeRules(
  value: unknown,
  fallback = defaultAlertRules()
): AlertWorkflowRule[] {
  if (!Array.isArray(value)) return fallback;

  const nextRules = value
    .slice(0, 12)
    .map((rule, index) => sanitizeRule(rule, fallback[index] ?? fallback[0], index));

  return nextRules.length > 0 ? nextRules : fallback;
}

function parseWorkflowMetadata(
  metadataJson: string | null | undefined
): AlertWorkflowMetadataPayload | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    const record = typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
    if (!record || record.schema !== ALERT_WORKFLOW_SCHEMA) return null;
    if (typeof record.updatedAt !== "string") return null;

    return {
      schema: ALERT_WORKFLOW_SCHEMA,
      rules: sanitizeRules(record.rules),
      updatedAt: record.updatedAt,
    };
  } catch {
    return null;
  }
}

async function getLatestAlertWorkflowEvent(accountId: string) {
  return prisma.auditEvent.findFirst({
    where: {
      accountId,
      kind: ALERT_WORKFLOW_KIND,
      scope: ALERT_WORKFLOW_SCOPE,
      message: ALERT_WORKFLOW_MESSAGE,
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

function buildAlertWorkflowSnapshot(input: {
  source: "defaults" | "backend_audit";
  updatedAt: string | null;
  rules: AlertWorkflowRule[];
  checkedAt: string;
}): AlertWorkflowSnapshot {
  const enabledRuleCount = input.rules.filter((rule) => rule.state === "enabled").length;

  return {
    checkedAt: input.checkedAt,
    source: input.source,
    updatedAt: input.updatedAt,
    runtime: {
      evaluationMode: "deterministic_local_rules",
      automation: "inactive",
      delivery: "unconfigured",
      executionAuthority: "manual_operator",
      liveExecution: "blocked",
    },
    rules: input.rules,
    summary:
      enabledRuleCount > 0
        ? `${enabledRuleCount} deterministic local rule(s) active; delivery remains unconfigured.`
        : "No enabled alert rules; delivery remains unconfigured.",
    limitations: [
      "No outbound notification channel is configured.",
      "Rules annotate workflow context only and do not automate execution.",
      "Live execution remains blocked regardless of rule output.",
    ],
  };
}

export async function getAlertWorkflowSnapshot(
  accountId: string
): Promise<AlertWorkflowSnapshot> {
  const checkedAt = new Date().toISOString();
  const latestEvent = await getLatestAlertWorkflowEvent(accountId);
  const metadata = parseWorkflowMetadata(latestEvent?.metadataJson);

  if (!metadata) {
    return buildAlertWorkflowSnapshot({
      source: "defaults",
      updatedAt: null,
      rules: defaultAlertRules(),
      checkedAt,
    });
  }

  return buildAlertWorkflowSnapshot({
    source: "backend_audit",
    updatedAt: metadata.updatedAt,
    rules: metadata.rules,
    checkedAt,
  });
}

export async function upsertAlertWorkflowSnapshot(input: {
  userId: string;
  accountId: string;
  rules: AlertWorkflowRule[] | null | undefined;
}) {
  const existing = await getAlertWorkflowSnapshot(input.accountId);
  const rules = sanitizeRules(input.rules, existing.rules);
  const updatedAt = new Date().toISOString();
  const metadata: AlertWorkflowMetadataPayload = {
    schema: ALERT_WORKFLOW_SCHEMA,
    rules,
    updatedAt,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.userId,
      accountId: input.accountId,
      kind: ALERT_WORKFLOW_KIND,
      scope: ALERT_WORKFLOW_SCOPE,
      actorRole: "owner",
      accountMode: "demo",
      message: ALERT_WORKFLOW_MESSAGE,
      metadataJson: JSON.stringify(metadata),
    },
  });

  return buildAlertWorkflowSnapshot({
    source: "backend_audit",
    updatedAt,
    rules,
    checkedAt: updatedAt,
  });
}

export async function getAlertWorkflowDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const workflowEventCount = await prisma.auditEvent.count({
      where: {
        kind: ALERT_WORKFLOW_KIND,
        scope: ALERT_WORKFLOW_SCOPE,
        message: ALERT_WORKFLOW_MESSAGE,
      },
    });

    return {
      key: "alerts_workflow",
      label: "Alerts/workflow engine",
      status: "unconfigured",
      summary:
        workflowEventCount > 0
          ? "Local workflow rules stored; delivery unconfigured"
          : "Workflow delivery unconfigured",
      detail:
        "Deterministic local workflow contracts are available for rule evaluation, but delivery channels and live automation remain intentionally unconfigured.",
      checkedAt,
    };
  } catch (error) {
    return {
      key: "alerts_workflow",
      label: "Alerts/workflow engine",
      status: "unavailable",
      summary: "Workflow backend unavailable",
      detail:
        error instanceof Error
          ? error.message
          : "Workflow backend probe failed.",
      checkedAt,
    };
  }
}
