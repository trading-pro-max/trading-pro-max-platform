import "server-only";
import { createHash } from "node:crypto";
import type {
  AccountMode,
  AuditEventKind,
  AuditScope,
} from "../../modules/shell/types/platform-state";
import { prisma } from "../db/client";

export type AuthAuditAction =
  | "login_success"
  | "login_failure"
  | "logout"
  | "session_invalid"
  | "session_expired"
  | "me_access";

export type AuditMetadataValue = string | number | boolean | null;

export type AuthAuditMetadata = Record<string, AuditMetadataValue>;

export type AuthAuditEventInput = {
  action: AuthAuditAction;
  message: string;
  userId?: string | null;
  accountId?: string | null;
  accountMode?: AccountMode;
  scope?: AuditScope;
  metadata?: AuthAuditMetadata;
};

const SECURITY_AUDIT_KIND = "security_state_updated" satisfies AuditEventKind;
const SECURITY_AUDIT_SCOPE = "security" satisfies AuditScope;
const DEFAULT_ACCOUNT_MODE = "demo" satisfies AccountMode;

export function hashAuditIdentifier(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function recordAuthAuditEvent(input: AuthAuditEventInput) {
  const metadataJson = JSON.stringify({
    authAction: input.action,
    ...(input.metadata ?? {}),
  });

  await prisma.auditEvent.create({
    data: {
      userId: input.userId ?? null,
      accountId: input.accountId ?? null,
      kind: SECURITY_AUDIT_KIND,
      scope: input.scope ?? SECURITY_AUDIT_SCOPE,
      actorRole: "owner",
      accountMode: input.accountMode ?? DEFAULT_ACCOUNT_MODE,
      message: input.message,
      metadataJson,
    },
  });
}
