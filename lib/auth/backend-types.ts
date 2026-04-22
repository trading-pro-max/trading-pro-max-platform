import type {
  AccountActivationNextStep,
  AccountActivationReason,
  AccountActivationState,
  AccountDisclosureKey,
  AccountDisclosureState,
  AccountLifecycleState,
  AccountMode,
  AccountReviewState,
  AuditActorRole,
  AuditEventKind,
  AuditScope,
} from "../../modules/shell/types/platform-state";

export type BackendUserRole = AuditActorRole;

export type BackendUser = {
  id: string;
  email: string;
  displayName: string;
  role: BackendUserRole;
};

export type BackendSession = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
};

export type BackendAccount = {
  id: string;
  userId: string;
  mode: AccountMode;
  lifecycleState: AccountLifecycleState;
  region: string;
};

export type BackendDisclosureAcceptance = {
  id: string;
  accountId: string;
  key: AccountDisclosureKey;
  state: Extract<AccountDisclosureState, "accepted">;
  version: string;
  acceptedAt: Date;
  acceptedByUserId: string;
};

export type BackendComplianceReview = {
  id: string;
  accountId: string;
  state: AccountReviewState;
  reference: string;
  startedAt: Date | null;
  submittedAt: Date | null;
  decidedAt: Date | null;
  decisionReason: string | null;
};

export type BackendActivationGate = {
  id: string;
  accountId: string;
  paperState: AccountActivationState;
  liveState: "blocked";
  reason: AccountActivationReason;
  nextStep: AccountActivationNextStep;
  executionEnabled: boolean;
  evaluatedAt: Date;
};

export type BackendAuditEvent = {
  id: string;
  userId: string | null;
  accountId: string | null;
  kind: AuditEventKind;
  scope: AuditScope;
  actorRole: BackendUserRole;
  accountMode: AccountMode;
  symbol: string | null;
  message: string;
  metadataJson: string | null;
  createdAt: Date;
};
