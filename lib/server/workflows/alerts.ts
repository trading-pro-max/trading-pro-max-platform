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
const ALERT_RULE_SEVERITIES = ["info", "warning", "critical"] as const;
const ALERT_RULE_DELIVERY_MODES = ["record_only", "operator_queue"] as const;
const ALERT_RULE_SCHEDULES = ["always", "market_hours"] as const;

type AlertRuleMetric = (typeof ALERT_RULE_METRICS)[number];
type AlertRuleOperator = (typeof ALERT_RULE_OPERATORS)[number];
type AlertRuleAction = (typeof ALERT_RULE_ACTIONS)[number];
type AlertRuleState = (typeof ALERT_RULE_STATES)[number];
type AlertRuleSeverity = (typeof ALERT_RULE_SEVERITIES)[number];
type AlertRuleDeliveryMode = (typeof ALERT_RULE_DELIVERY_MODES)[number];
type AlertRuleSchedule = (typeof ALERT_RULE_SCHEDULES)[number];

export type AlertWorkflowRule = {
  id: string;
  label: string;
  state: AlertRuleState;
  severity: AlertRuleSeverity;
  metric: AlertRuleMetric;
  operator: AlertRuleOperator;
  threshold: number;
  action: AlertRuleAction;
  deliveryMode: AlertRuleDeliveryMode;
  schedule: AlertRuleSchedule;
  triggerWindowSeconds: number;
  cooldownSeconds: number;
  requiresOperatorAck: boolean;
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
    queue: "local_buffer_ready";
    scheduler: "inactive";
    notificationChannels: {
      inApp: "local_unconfigured";
      push: "unconfigured";
      email: "unconfigured";
      webhook: "unconfigured";
    };
    executionAuthority: "manual_operator";
    autoTrading: "blocked";
    liveExecution: "blocked";
  };
  rules: AlertWorkflowRule[];
  summary: string;
  limitations: string[];
};

export type AlertAutomationStateSnapshot = {
  checkedAt: string;
  source: "defaults" | "backend_audit";
  runtime: {
    triggerEngine: "deterministic_local_rules";
    scheduler: "inactive";
    queue: "local_buffer_ready";
    delivery: "unconfigured";
    autoTrading: "blocked";
  };
  queue: {
    pending: number;
    processing: number;
    failed: number;
    lastEvaluatedAt: string | null;
    lastTriggeredAt: string | null;
  };
  triggers: {
    enabledRuleCount: number;
    criticalRuleCount: number;
    operatorAckRequiredCount: number;
    scheduleMode: "deterministic_local";
  };
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

function isAlertRuleSeverity(value: string): value is AlertRuleSeverity {
  return ALERT_RULE_SEVERITIES.includes(value as AlertRuleSeverity);
}

function isAlertRuleDeliveryMode(value: string): value is AlertRuleDeliveryMode {
  return ALERT_RULE_DELIVERY_MODES.includes(value as AlertRuleDeliveryMode);
}

function isAlertRuleSchedule(value: string): value is AlertRuleSchedule {
  return ALERT_RULE_SCHEDULES.includes(value as AlertRuleSchedule);
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
      severity: "warning",
      metric: "spread",
      operator: "gt",
      threshold: 1.8,
      action: "desk_note",
      deliveryMode: "record_only",
      schedule: "always",
      triggerWindowSeconds: 120,
      cooldownSeconds: 180,
      requiresOperatorAck: false,
    },
    {
      id: "session-drawdown-guard",
      label: "Session drawdown guard",
      state: "enabled",
      severity: "critical",
      metric: "session_drawdown",
      operator: "lt",
      threshold: -120,
      action: "review_flag",
      deliveryMode: "operator_queue",
      schedule: "always",
      triggerWindowSeconds: 60,
      cooldownSeconds: 300,
      requiresOperatorAck: true,
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
  const severity =
    typeof record.severity === "string" && isAlertRuleSeverity(record.severity)
      ? record.severity
      : fallback.severity;
  const action =
    typeof record.action === "string" && isAlertRuleAction(record.action)
      ? record.action
      : fallback.action;
  const deliveryMode =
    typeof record.deliveryMode === "string" &&
      isAlertRuleDeliveryMode(record.deliveryMode)
      ? record.deliveryMode
      : fallback.deliveryMode;
  const schedule =
    typeof record.schedule === "string" && isAlertRuleSchedule(record.schedule)
      ? record.schedule
      : fallback.schedule;
  const thresholdCandidate =
    typeof record.threshold === "number" && Number.isFinite(record.threshold)
      ? record.threshold
      : fallback.threshold;
  const triggerWindowCandidate =
    typeof record.triggerWindowSeconds === "number" &&
      Number.isFinite(record.triggerWindowSeconds)
      ? record.triggerWindowSeconds
      : fallback.triggerWindowSeconds;
  const cooldownCandidate =
    typeof record.cooldownSeconds === "number" && Number.isFinite(record.cooldownSeconds)
      ? record.cooldownSeconds
      : fallback.cooldownSeconds;
  const requiresOperatorAck =
    typeof record.requiresOperatorAck === "boolean"
      ? record.requiresOperatorAck
      : fallback.requiresOperatorAck;

  return {
    id: normalizeRuleId(rawId, index),
    label: rawLabel.trim().slice(0, 96) || fallback.label,
    state,
    severity,
    metric,
    operator,
    threshold: Number(thresholdCandidate.toFixed(4)),
    action,
    deliveryMode,
    schedule,
    triggerWindowSeconds: Math.max(
      30,
      Math.min(3600, Math.round(triggerWindowCandidate))
    ),
    cooldownSeconds: Math.max(30, Math.min(3600, Math.round(cooldownCandidate))),
    requiresOperatorAck,
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
  const criticalRuleCount = input.rules.filter(
    (rule) => rule.state === "enabled" && rule.severity === "critical"
  ).length;
  const operatorAckRequiredCount = input.rules.filter(
    (rule) => rule.state === "enabled" && rule.requiresOperatorAck
  ).length;

  return {
    checkedAt: input.checkedAt,
    source: input.source,
    updatedAt: input.updatedAt,
    runtime: {
      evaluationMode: "deterministic_local_rules",
      automation: "inactive",
      delivery: "unconfigured",
      queue: "local_buffer_ready",
      scheduler: "inactive",
      notificationChannels: {
        inApp: "local_unconfigured",
        push: "unconfigured",
        email: "unconfigured",
        webhook: "unconfigured",
      },
      executionAuthority: "manual_operator",
      autoTrading: "blocked",
      liveExecution: "blocked",
    },
    rules: input.rules,
    summary: enabledRuleCount > 0
      ? `${enabledRuleCount} deterministic local rule(s) active (${criticalRuleCount} critical, ${operatorAckRequiredCount} requiring operator acknowledgement); delivery remains unconfigured.`
      : "No enabled alert rules; delivery and automation remain unconfigured/inactive.",
    limitations: [
      "No outbound notification channel is configured.",
      "Rules annotate workflow context only and do not automate execution.",
      "Queue/scheduler contracts are local and guarded; no unattended automation is active.",
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

export async function getAlertAutomationStateSnapshot(
  accountId: string
): Promise<AlertAutomationStateSnapshot> {
  const workflow = await getAlertWorkflowSnapshot(accountId);
  const enabledRules = workflow.rules.filter((rule) => rule.state === "enabled");
  const criticalRuleCount = enabledRules.filter(
    (rule) => rule.severity === "critical"
  ).length;
  const operatorAckRequiredCount = enabledRules.filter(
    (rule) => rule.requiresOperatorAck
  ).length;
  const lastEvaluatedAt = workflow.updatedAt ?? workflow.checkedAt;

  return {
    checkedAt: workflow.checkedAt,
    source: workflow.source,
    runtime: {
      triggerEngine: "deterministic_local_rules",
      scheduler: "inactive",
      queue: "local_buffer_ready",
      delivery: "unconfigured",
      autoTrading: "blocked",
    },
    queue: {
      pending: 0,
      processing: 0,
      failed: 0,
      lastEvaluatedAt,
      lastTriggeredAt: null,
    },
    triggers: {
      enabledRuleCount: enabledRules.length,
      criticalRuleCount,
      operatorAckRequiredCount,
      scheduleMode: "deterministic_local",
    },
    summary:
      enabledRules.length > 0
        ? `${enabledRules.length} rule trigger(s) prepared for manual operator workflows; delivery remains unconfigured and automation inactive.`
        : "No enabled triggers; queue and scheduler contracts remain inactive.",
    limitations: [
      "No outbound notification channel is configured.",
      "Scheduler is intentionally inactive until an operator-controlled delivery channel is configured.",
      "Automation does not execute trades and cannot bypass live-execution blocks.",
    ],
  };
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

export async function getAlertAutomationDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const ruleEventCount = await prisma.auditEvent.count({
      where: {
        kind: ALERT_WORKFLOW_KIND,
        scope: ALERT_WORKFLOW_SCOPE,
        message: ALERT_WORKFLOW_MESSAGE,
      },
    });

    return {
      key: "alerts_automation",
      label: "Alerts automation foundation",
      status: "unconfigured",
      summary:
        ruleEventCount > 0
          ? "Automation trigger/queue contracts ready; delivery unconfigured"
          : "Automation contracts are available but not configured",
      detail:
        "Trigger evaluation, queue state, and scheduler contracts are present for operator workflows. Delivery channels remain unconfigured, scheduler execution is inactive, and auto-trading remains blocked.",
      checkedAt,
    };
  } catch (error) {
    return {
      key: "alerts_automation",
      label: "Alerts automation foundation",
      status: "unavailable",
      summary: "Automation foundation unavailable",
      detail:
        error instanceof Error
          ? error.message
          : "Alerts automation foundation probe failed.",
      checkedAt,
    };
  }
}
