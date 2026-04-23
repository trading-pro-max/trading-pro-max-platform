import "server-only";

export const CONNECTOR_STATE_SET = new Set([
  "not_configured",
  "partially_configured",
  "configured",
  "validating",
  "paper_ready",
  "live_data_ready",
  "broker_ready",
  "alert_ready",
  "blocked",
  "unsupported",
  "error",
] as const);

export type ConnectorReadinessState =
  | "not_configured"
  | "partially_configured"
  | "configured"
  | "validating"
  | "paper_ready"
  | "live_data_ready"
  | "broker_ready"
  | "alert_ready"
  | "blocked"
  | "unsupported"
  | "error";

export function normalizeConnectorReadinessState(
  value: string | null | undefined,
  fallback: ConnectorReadinessState = "not_configured"
): ConnectorReadinessState {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase() as ConnectorReadinessState;
  return CONNECTOR_STATE_SET.has(normalized) ? normalized : fallback;
}

export function summarizeValidationStatus(input: {
  pass: number;
  warn: number;
  fail: number;
  pending?: number;
}) {
  const pending = Math.max(0, input.pending ?? 0);
  const total = Math.max(0, input.pass) + Math.max(0, input.warn) + Math.max(0, input.fail) + pending;

  return {
    total,
    statusLine: `${Math.max(0, input.pass)} pass | ${Math.max(0, input.warn)} warn | ${Math.max(0, input.fail)} fail${
      pending > 0 ? ` | ${pending} pending` : ""
    }`,
  };
}
