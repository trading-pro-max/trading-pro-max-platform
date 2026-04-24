import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";

const CONTROLLED_ACTIVATION_SCHEMA = "tpm.controlled.activation.attempt.v1";

type ActivationAttemptDomain = "broker" | "market_feed" | "pilot";
type ActivationAttemptEnvironment = "sandbox" | "live" | "fallback";
type ActivationAttemptResult =
  | "recorded_guarded"
  | "recorded_blocked"
  | "fallback_authoritative";

export type ControlledActivationAttemptInput = {
  action: string;
  blockedReasons: string[];
  domain: ActivationAttemptDomain;
  environment: ActivationAttemptEnvironment;
  note?: string | null;
  result: ActivationAttemptResult;
  session: AuthenticatedSession;
};

function normalizeNote(value: string | null | undefined) {
  const note = value?.replace(/[\r\n\t]/g, " ").trim() ?? "";
  return note ? note.slice(0, 600) : null;
}

export async function recordControlledActivationAttempt(
  input: ControlledActivationAttemptInput
) {
  const attemptedAt = new Date().toISOString();
  const metadata = {
    schema: CONTROLLED_ACTIVATION_SCHEMA,
    domain: input.domain,
    action: input.action,
    environment: input.environment,
    result: input.result,
    blockedReasons: input.blockedReasons,
    paperOnly: true,
    liveExecution: "blocked",
    realMoneyRouting: "blocked",
    note: normalizeNote(input.note),
    attemptedAt,
  };

  const event = await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: "security_state_updated",
      scope: "platform",
      actorRole: input.session.user.role === "operator" ? "operator" : "owner",
      accountMode: "demo",
      message: "Controlled activation attempt recorded.",
      metadataJson: JSON.stringify(metadata),
    },
  });

  return {
    id: event.id,
    attemptedAt,
    result: input.result,
  };
}
