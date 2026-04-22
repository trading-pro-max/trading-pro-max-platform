import "server-only";
import type {
  AccountActivationNextStep,
  AccountActivationReason,
  AccountActivationState,
  AccountActivationSurface,
  AccountDisclosureAnchor,
  AccountDisclosureKey,
  AccountDisclosureState,
  AccountLifecycleState,
  AccountMode,
  AccountReviewState,
  AccountReviewSurface,
  AuditEventKind,
  AuditScope,
} from "../../../modules/shell/types/platform-state";
import type { AuthenticatedSession } from "../../auth/service";
import { prisma } from "../../db/client";

const DEMO_ACCOUNT_MODE = "demo" satisfies AccountMode;
const DEFAULT_REGION = "Global";
const DEFAULT_DISCLOSURE_VERSION = "2026.04.local";
const DEFAULT_REVIEW_REFERENCE = "demo-paper-review";

export const REQUIRED_DISCLOSURES = [
  { key: "risk", version: DEFAULT_DISCLOSURE_VERSION },
  { key: "paper_trading", version: DEFAULT_DISCLOSURE_VERSION },
  { key: "jurisdiction", version: DEFAULT_DISCLOSURE_VERSION },
  { key: "terms", version: DEFAULT_DISCLOSURE_VERSION },
] as const satisfies readonly {
  key: AccountDisclosureKey;
  version: string;
}[];

const DISCLOSURE_KEYS: readonly AccountDisclosureKey[] = [
  "risk",
  "paper_trading",
  "jurisdiction",
  "terms",
];

const DISCLOSURE_STATES: readonly AccountDisclosureState[] = [
  "pending",
  "accepted",
];

const REVIEW_STATES: readonly AccountReviewState[] = [
  "not_started",
  "in_progress",
  "pending_review",
  "approved_for_paper",
  "restricted",
  "rejected",
];

const ACTIVATION_STATES: readonly AccountActivationState[] = [
  "enabled",
  "gated",
  "restricted",
  "blocked",
];

const ACTIVATION_REASONS: readonly AccountActivationReason[] = [
  "paper_ready",
  "disclosures_required",
  "kyc_required",
  "review_pending",
  "paper_only_mode",
  "restricted_account",
  "blocked_account",
];

const ACTIVATION_NEXT_STEPS: readonly AccountActivationNextStep[] = [
  "accept_disclosures",
  "complete_verification",
  "await_review",
  "paper_ready",
  "contact_support",
];

export type AccountRecord = {
  id: string;
  userId: string;
  mode: AccountMode;
  lifecycleState: AccountLifecycleState;
  lifecycleUpdatedAt: string;
  region: string;
};

export type DisclosureAcceptanceRecord = {
  id: string;
  accountId: string;
  key: AccountDisclosureKey;
  state: Extract<AccountDisclosureState, "accepted">;
  version: string;
  acceptedAt: string;
  acceptedByUserId: string;
};

export type ComplianceReviewRecord = AccountReviewSurface & {
  id: string;
  accountId: string;
  submittedAt: string | null;
  decidedAt: string | null;
  decisionReason: string | null;
};

export type ActivationGateRecord = AccountActivationSurface & {
  id: string;
  accountId: string;
  evaluatedAt: string;
};

export type AccountComplianceSnapshot = {
  account: AccountRecord;
  disclosures: AccountDisclosureAnchor[];
  review: ComplianceReviewRecord;
  activation: ActivationGateRecord;
};

export type CreateAccountInput = {
  userId: string;
  lifecycleState?: AccountLifecycleState;
  region?: string;
};

export type AcceptDisclosureInput = {
  accountId: string;
  acceptedByUserId: string;
  key: AccountDisclosureKey;
  version?: string;
};

export type SetReviewStateInput = {
  accountId: string;
  userId?: string | null;
  state: AccountReviewState;
  reference?: string;
  decisionReason?: string | null;
};

export type UpdateActivationGateInput = {
  accountId: string;
  userId?: string | null;
  paperState: AccountActivationState;
  reason: AccountActivationReason;
  nextStep: AccountActivationNextStep;
  executionEnabled: boolean;
};

type AuditMetadataValue = string | number | boolean | null;
type AuditMetadata = Record<string, AuditMetadataValue>;
type ComplianceAuditAction =
  | "account_initialized"
  | "account_lifecycle_changed"
  | "disclosure_accepted"
  | "review_state_changed"
  | "activation_gate_changed";

type DbAccount = {
  id: string;
  userId: string;
  mode: string;
  lifecycleState: string;
  region: string;
  updatedAt: Date;
};

type DbDisclosureAcceptance = {
  id: string;
  accountId: string;
  key: string;
  state: string;
  version: string;
  acceptedAt: Date;
  acceptedByUserId: string;
};

type DbComplianceReview = {
  id: string;
  accountId: string;
  state: string;
  reference: string;
  startedAt: Date | null;
  submittedAt: Date | null;
  decidedAt: Date | null;
  decisionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DbActivationGate = {
  id: string;
  accountId: string;
  paperState: string;
  liveState: string;
  reason: string;
  nextStep: string;
  executionEnabled: boolean;
  evaluatedAt: Date;
};

function isAccountLifecycleState(value: string): value is AccountLifecycleState {
  return [
    "visitor",
    "onboarding",
    "disclosures_pending",
    "kyc_pending",
    "review_pending",
    "paper_active",
    "restricted",
    "blocked",
  ].includes(value);
}

export function isAccountDisclosureKey(
  value: string
): value is AccountDisclosureKey {
  return DISCLOSURE_KEYS.includes(value as AccountDisclosureKey);
}

function isAccountDisclosureState(
  value: string
): value is AccountDisclosureState {
  return DISCLOSURE_STATES.includes(value as AccountDisclosureState);
}

function isAccountReviewState(value: string): value is AccountReviewState {
  return REVIEW_STATES.includes(value as AccountReviewState);
}

function isActivationState(value: string): value is AccountActivationState {
  return ACTIVATION_STATES.includes(value as AccountActivationState);
}

function isActivationReason(value: string): value is AccountActivationReason {
  return ACTIVATION_REASONS.includes(value as AccountActivationReason);
}

function isActivationNextStep(
  value: string
): value is AccountActivationNextStep {
  return ACTIVATION_NEXT_STEPS.includes(value as AccountActivationNextStep);
}

function toAccountMode(value: string): AccountMode {
  return value === "real" ? "real" : DEMO_ACCOUNT_MODE;
}

function toAccountRecord(account: DbAccount): AccountRecord {
  return {
    id: account.id,
    userId: account.userId,
    mode: toAccountMode(account.mode),
    lifecycleState: isAccountLifecycleState(account.lifecycleState)
      ? account.lifecycleState
      : "onboarding",
    lifecycleUpdatedAt: account.updatedAt.toISOString(),
    region: account.region,
  };
}

function toDisclosureAcceptanceRecord(
  acceptance: DbDisclosureAcceptance
): DisclosureAcceptanceRecord {
  return {
    id: acceptance.id,
    accountId: acceptance.accountId,
    key: isAccountDisclosureKey(acceptance.key) ? acceptance.key : "risk",
    state: isAccountDisclosureState(acceptance.state)
      ? "accepted"
      : "accepted",
    version: acceptance.version,
    acceptedAt: acceptance.acceptedAt.toISOString(),
    acceptedByUserId: acceptance.acceptedByUserId,
  };
}

function toReviewRecord(review: DbComplianceReview): ComplianceReviewRecord {
  const startedAt = review.startedAt ?? review.createdAt;

  return {
    id: review.id,
    accountId: review.accountId,
    state: isAccountReviewState(review.state) ? review.state : "not_started",
    reference: review.reference,
    startedAt: startedAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    submittedAt: review.submittedAt?.toISOString() ?? null,
    decidedAt: review.decidedAt?.toISOString() ?? null,
    decisionReason: review.decisionReason,
  };
}

function toActivationGateRecord(gate: DbActivationGate): ActivationGateRecord {
  return {
    id: gate.id,
    accountId: gate.accountId,
    paperState: isActivationState(gate.paperState) ? gate.paperState : "gated",
    liveState: "blocked",
    reason: isActivationReason(gate.reason)
      ? gate.reason
      : "disclosures_required",
    nextStep: isActivationNextStep(gate.nextStep)
      ? gate.nextStep
      : "accept_disclosures",
    executionEnabled: gate.executionEnabled && gate.paperState === "enabled",
    evaluatedAt: gate.evaluatedAt.toISOString(),
  };
}

function getRequiredDisclosureVersion(key: AccountDisclosureKey) {
  return (
    REQUIRED_DISCLOSURES.find((disclosure) => disclosure.key === key)?.version ??
    DEFAULT_DISCLOSURE_VERSION
  );
}

function allRequiredDisclosuresAccepted(disclosures: AccountDisclosureAnchor[]) {
  return disclosures.every((disclosure) => disclosure.state === "accepted");
}

function deriveActivationSurface(
  disclosures: AccountDisclosureAnchor[],
  reviewState: AccountReviewState
): AccountActivationSurface {
  if (!allRequiredDisclosuresAccepted(disclosures)) {
    return {
      paperState: "gated",
      liveState: "blocked",
      reason: "disclosures_required",
      nextStep: "accept_disclosures",
      executionEnabled: false,
    };
  }

  if (reviewState === "approved_for_paper") {
    return {
      paperState: "enabled",
      liveState: "blocked",
      reason: "paper_ready",
      nextStep: "paper_ready",
      executionEnabled: true,
    };
  }

  if (reviewState === "restricted") {
    return {
      paperState: "restricted",
      liveState: "blocked",
      reason: "restricted_account",
      nextStep: "contact_support",
      executionEnabled: false,
    };
  }

  if (reviewState === "rejected") {
    return {
      paperState: "blocked",
      liveState: "blocked",
      reason: "blocked_account",
      nextStep: "contact_support",
      executionEnabled: false,
    };
  }

  return {
    paperState: "gated",
    liveState: "blocked",
    reason: "review_pending",
    nextStep: "await_review",
    executionEnabled: false,
  };
}

function deriveLifecycleState(
  disclosures: AccountDisclosureAnchor[],
  reviewState: AccountReviewState
): AccountLifecycleState {
  if (!allRequiredDisclosuresAccepted(disclosures)) return "disclosures_pending";
  if (reviewState === "approved_for_paper") return "paper_active";
  if (reviewState === "restricted") return "restricted";
  if (reviewState === "rejected") return "blocked";

  return "review_pending";
}

function activationChanged(
  gate: ActivationGateRecord | null,
  activation: AccountActivationSurface
) {
  return (
    !gate ||
    gate.paperState !== activation.paperState ||
    gate.reason !== activation.reason ||
    gate.nextStep !== activation.nextStep ||
    gate.executionEnabled !== activation.executionEnabled
  );
}

async function recordComplianceAuditEvent(input: {
  action: ComplianceAuditAction;
  kind: AuditEventKind;
  scope: AuditScope;
  message: string;
  userId?: string | null;
  accountId?: string | null;
  metadata?: AuditMetadata;
}) {
  await prisma.auditEvent.create({
    data: {
      userId: input.userId ?? null,
      accountId: input.accountId ?? null,
      kind: input.kind,
      scope: input.scope,
      actorRole: "owner",
      accountMode: DEMO_ACCOUNT_MODE,
      message: input.message,
      metadataJson: JSON.stringify({
        complianceAction: input.action,
        ...(input.metadata ?? {}),
      }),
    },
  });
}

export async function getAccountById(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  return account ? toAccountRecord(account) : null;
}

export async function getDemoAccountForUser(userId: string) {
  const account = await prisma.account.findUnique({
    where: {
      userId_mode: {
        userId,
        mode: DEMO_ACCOUNT_MODE,
      },
    },
  });

  return account ? toAccountRecord(account) : null;
}

export async function createDemoAccount(input: CreateAccountInput) {
  const existing = await getDemoAccountForUser(input.userId);
  if (existing) return existing;

  const account = await prisma.account.create({
    data: {
      userId: input.userId,
      mode: DEMO_ACCOUNT_MODE,
      lifecycleState: input.lifecycleState ?? "disclosures_pending",
      region: input.region ?? DEFAULT_REGION,
    },
  });

  await recordComplianceAuditEvent({
    action: "account_initialized",
    kind: "data_state_updated",
    scope: "account",
    userId: input.userId,
    accountId: account.id,
    message: "Demo account initialized.",
  });

  return toAccountRecord(account);
}

export async function updateAccountLifecycleState(input: {
  accountId: string;
  userId?: string | null;
  lifecycleState: AccountLifecycleState;
}) {
  const account = await prisma.account.update({
    where: { id: input.accountId },
    data: {
      lifecycleState: input.lifecycleState,
    },
  });

  await recordComplianceAuditEvent({
    action: "account_lifecycle_changed",
    kind: "data_state_updated",
    scope: "account",
    userId: input.userId,
    accountId: input.accountId,
    message: "Account lifecycle state changed.",
    metadata: {
      lifecycleState: input.lifecycleState,
    },
  });

  return toAccountRecord(account);
}

export async function getDisclosureAcceptances(accountId: string) {
  const acceptances = await prisma.disclosureAcceptance.findMany({
    where: { accountId },
    orderBy: { acceptedAt: "desc" },
  });

  return acceptances.map(toDisclosureAcceptanceRecord);
}

async function getDisclosureAnchors(accountId: string) {
  const acceptances = await getDisclosureAcceptances(accountId);

  return REQUIRED_DISCLOSURES.map((required) => {
    const acceptance = acceptances.find(
      (item) => item.key === required.key && item.version === required.version
    );

    return {
      key: required.key,
      state: acceptance ? "accepted" : "pending",
      acceptedAt: acceptance?.acceptedAt,
      version: required.version,
    } satisfies AccountDisclosureAnchor;
  });
}

export async function acceptDisclosure(input: AcceptDisclosureInput) {
  const version = input.version ?? getRequiredDisclosureVersion(input.key);
  const acceptance = await prisma.disclosureAcceptance.upsert({
    where: {
      accountId_key_version: {
        accountId: input.accountId,
        key: input.key,
        version,
      },
    },
    create: {
      accountId: input.accountId,
      key: input.key,
      state: "accepted",
      version,
      acceptedByUserId: input.acceptedByUserId,
    },
    update: {
      state: "accepted",
      acceptedAt: new Date(),
      acceptedByUserId: input.acceptedByUserId,
    },
  });

  await recordComplianceAuditEvent({
    action: "disclosure_accepted",
    kind: "disclosures_accepted",
    scope: "compliance",
    userId: input.acceptedByUserId,
    accountId: input.accountId,
    message: "Disclosure accepted.",
    metadata: {
      key: input.key,
      version,
    },
  });

  await syncAccountComplianceState(input.accountId, input.acceptedByUserId);

  return toDisclosureAcceptanceRecord(acceptance);
}

export async function getLatestComplianceReview(accountId: string) {
  const review = await prisma.complianceReview.findFirst({
    where: { accountId },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return review ? toReviewRecord(review) : null;
}

export async function createComplianceReview(input: {
  accountId: string;
  state?: AccountReviewState;
  reference?: string;
}) {
  const now = new Date();
  const state = input.state ?? "not_started";
  const review = await prisma.complianceReview.create({
    data: {
      accountId: input.accountId,
      state,
      reference: input.reference ?? DEFAULT_REVIEW_REFERENCE,
      startedAt: state === "not_started" ? null : now,
      submittedAt: state === "pending_review" ? now : null,
      decidedAt:
        state === "approved_for_paper" ||
        state === "restricted" ||
        state === "rejected"
          ? now
          : null,
    },
  });

  return toReviewRecord(review);
}

async function ensureComplianceReview(accountId: string) {
  const latest = await getLatestComplianceReview(accountId);
  if (latest) return latest;

  return createComplianceReview({ accountId });
}

export async function setComplianceReviewState(input: SetReviewStateInput) {
  const existing = await prisma.complianceReview.findFirst({
    where: {
      accountId: input.accountId,
      reference: input.reference ?? DEFAULT_REVIEW_REFERENCE,
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
  const now = new Date();
  const decisionState =
    input.state === "approved_for_paper" ||
    input.state === "restricted" ||
    input.state === "rejected";

  const review = existing
    ? await prisma.complianceReview.update({
        where: { id: existing.id },
        data: {
          state: input.state,
          startedAt:
            existing.startedAt ??
            (input.state === "not_started" ? null : now),
          submittedAt:
            existing.submittedAt ??
            (input.state === "pending_review" || decisionState ? now : null),
          decidedAt: decisionState ? now : null,
          decisionReason: input.decisionReason ?? existing.decisionReason,
        },
      })
    : await prisma.complianceReview.create({
        data: {
          accountId: input.accountId,
          state: input.state,
          reference: input.reference ?? DEFAULT_REVIEW_REFERENCE,
          startedAt: input.state === "not_started" ? null : now,
          submittedAt:
            input.state === "pending_review" || decisionState ? now : null,
          decidedAt: decisionState ? now : null,
          decisionReason: input.decisionReason ?? null,
        },
      });

  await recordComplianceAuditEvent({
    action: "review_state_changed",
    kind: "review_state_changed",
    scope: "compliance",
    userId: input.userId,
    accountId: input.accountId,
    message: "Compliance review state changed.",
    metadata: {
      state: input.state,
      reference: review.reference,
    },
  });

  await syncAccountComplianceState(input.accountId, input.userId);

  return toReviewRecord(review);
}

export async function getLatestActivationGate(accountId: string) {
  const gate = await prisma.activationGate.findFirst({
    where: { accountId },
    orderBy: [{ evaluatedAt: "desc" }, { createdAt: "desc" }],
  });

  return gate ? toActivationGateRecord(gate) : null;
}

export async function createActivationGate(input: UpdateActivationGateInput) {
  const gate = await prisma.activationGate.create({
    data: {
      accountId: input.accountId,
      paperState: input.paperState,
      liveState: "blocked",
      reason: input.reason,
      nextStep: input.nextStep,
      executionEnabled:
        input.paperState === "enabled" && input.executionEnabled,
    },
  });

  await recordComplianceAuditEvent({
    action: "activation_gate_changed",
    kind: "security_state_updated",
    scope: "compliance",
    userId: input.userId,
    accountId: input.accountId,
    message: "Activation gate changed.",
    metadata: {
      paperState: input.paperState,
      liveState: "blocked",
      reason: input.reason,
      nextStep: input.nextStep,
      executionEnabled:
        input.paperState === "enabled" && input.executionEnabled,
    },
  });

  return toActivationGateRecord(gate);
}

export async function updateLatestActivationGate(
  input: UpdateActivationGateInput
) {
  const latest = await prisma.activationGate.findFirst({
    where: { accountId: input.accountId },
    orderBy: [{ evaluatedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!latest) return createActivationGate(input);

  const gate = await prisma.activationGate.update({
    where: { id: latest.id },
    data: {
      paperState: input.paperState,
      liveState: "blocked",
      reason: input.reason,
      nextStep: input.nextStep,
      executionEnabled:
        input.paperState === "enabled" && input.executionEnabled,
      evaluatedAt: new Date(),
    },
  });

  await recordComplianceAuditEvent({
    action: "activation_gate_changed",
    kind: "security_state_updated",
    scope: "compliance",
    userId: input.userId,
    accountId: input.accountId,
    message: "Activation gate changed.",
    metadata: {
      paperState: input.paperState,
      liveState: "blocked",
      reason: input.reason,
      nextStep: input.nextStep,
      executionEnabled:
        input.paperState === "enabled" && input.executionEnabled,
    },
  });

  return toActivationGateRecord(gate);
}

export async function syncAccountComplianceState(
  accountId: string,
  userId?: string | null
) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) return null;

  const disclosures = await getDisclosureAnchors(accountId);
  const review = await ensureComplianceReview(accountId);
  const activation = deriveActivationSurface(disclosures, review.state);
  const lifecycleState = deriveLifecycleState(disclosures, review.state);

  if (account.lifecycleState !== lifecycleState) {
    await prisma.account.update({
      where: { id: accountId },
      data: { lifecycleState },
    });

    await recordComplianceAuditEvent({
      action: "account_lifecycle_changed",
      kind: "data_state_updated",
      scope: "account",
      userId,
      accountId,
      message: "Account lifecycle state changed.",
      metadata: {
        lifecycleState,
      },
    });
  }

  const latestGate = await getLatestActivationGate(accountId);

  if (activationChanged(latestGate, activation)) {
    await createActivationGate({
      accountId,
      userId,
      paperState: activation.paperState,
      reason: activation.reason,
      nextStep: activation.nextStep,
      executionEnabled: activation.executionEnabled,
    });
  }

  return getAccountComplianceSnapshot(accountId, false);
}

export async function getAccountComplianceSnapshot(
  accountId: string,
  sync = true
): Promise<AccountComplianceSnapshot | null> {
  if (sync) {
    const synced = await syncAccountComplianceState(accountId);
    if (synced) return synced;
  }

  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) return null;

  const review = await ensureComplianceReview(accountId);
  const latestGate =
    (await getLatestActivationGate(accountId)) ??
    (await createActivationGate({
      accountId,
      paperState: "gated",
      reason: "disclosures_required",
      nextStep: "accept_disclosures",
      executionEnabled: false,
    }));

  return {
    account: toAccountRecord(account),
    disclosures: await getDisclosureAnchors(accountId),
    review,
    activation: latestGate,
  };
}

export async function getAccountComplianceSnapshotForAuthenticatedSession(
  session: AuthenticatedSession
) {
  const account =
    (await getDemoAccountForUser(session.user.id)) ??
    (await createDemoAccount({
      userId: session.user.id,
      lifecycleState: "disclosures_pending",
      region: session.account.region,
    }));

  return getAccountComplianceSnapshot(account.id);
}
