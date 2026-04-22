export type AccountMode = "demo" | "real";
export type AccountRuntimeState = "active" | "read_only";
export type VerificationState = "unverified" | "review" | "verified";

export type PermissionState = "enabled" | "read_only" | "blocked";
export type PermissionKey =
  | "profile"
  | "settings"
  | "sign_out"
  | "demo_execution"
  | "real_execution"
  | "audit_surface"
  | "jurisdiction_controls";

export type PermissionAnchor = {
  key: PermissionKey;
  state: PermissionState;
};

export type JurisdictionExecutionPolicy = "demo_only" | "restricted";
export type JurisdictionDisclosureState = "required" | "ready";
export type JurisdictionActivationState = "review" | "active";

export type JurisdictionAnchor = {
  key: "global_foundation";
  executionPolicy: JurisdictionExecutionPolicy;
  disclosureState: JurisdictionDisclosureState;
  activationState: JurisdictionActivationState;
};

export type VerificationWorkflowKey =
  | "identity_check"
  | "account_review"
  | "disclosure_acceptance"
  | "live_activation";

export type VerificationWorkflowState = "pending" | "review" | "ready";

export type VerificationWorkflowAnchor = {
  key: VerificationWorkflowKey;
  state: VerificationWorkflowState;
};

export type OnboardingStage =
  | "foundation"
  | "identity_ready"
  | "account_ready"
  | "activation_review"
  | "active";

export type ActivationAccessState = "blocked" | "review" | "enabled";
export type DemoReadinessState = "ready" | "not_ready";

export type OnboardingActivationSurface = {
  onboardingStage: OnboardingStage;
  demoReadiness: DemoReadinessState;
  liveActivation: ActivationAccessState;
};

export type PreferenceSource = "system" | "account";

export type AccountPreferenceKey =
  | "language"
  | "direction"
  | "density"
  | "chart_layout"
  | "risk_confirmation";

export type AccountPreferenceAnchor = {
  key: AccountPreferenceKey;
  value: string;
  source: PreferenceSource;
};

export type AccountLifecycleState =
  | "visitor"
  | "onboarding"
  | "disclosures_pending"
  | "kyc_pending"
  | "review_pending"
  | "paper_active"
  | "restricted"
  | "blocked";

export type AccountLifecycleSurface = {
  state: AccountLifecycleState;
  updatedAt: string;
};

export type AccountDisclosureKey =
  | "risk"
  | "paper_trading"
  | "jurisdiction"
  | "terms";

export type AccountDisclosureState = "pending" | "accepted";

export type AccountDisclosureAnchor = {
  key: AccountDisclosureKey;
  state: AccountDisclosureState;
  acceptedAt?: string;
  version: string;
};

export type AccountReviewState =
  | "not_started"
  | "in_progress"
  | "pending_review"
  | "approved_for_paper"
  | "restricted"
  | "rejected";

export type AccountReviewSurface = {
  state: AccountReviewState;
  reference: string;
  startedAt: string;
  updatedAt: string;
};

export type AccountActivationState = "enabled" | "gated" | "restricted" | "blocked";

export type AccountActivationReason =
  | "paper_ready"
  | "disclosures_required"
  | "kyc_required"
  | "review_pending"
  | "paper_only_mode"
  | "restricted_account"
  | "blocked_account";

export type AccountActivationNextStep =
  | "accept_disclosures"
  | "complete_verification"
  | "await_review"
  | "paper_ready"
  | "contact_support";

export type AccountActivationSurface = {
  paperState: AccountActivationState;
  liveState: "blocked";
  reason: AccountActivationReason;
  nextStep: AccountActivationNextStep;
  executionEnabled: boolean;
};

export type ExecutionRoute = "demo_router" | "live_blocked";
export type ExecutionIntentState = "ready" | "standby" | "guarded" | "blocked";
export type ExecutionGuardrailKey =
  | "demo_only"
  | "session_locked"
  | "max_open_trades";

export type ExecutionFoundationSurface = {
  route: ExecutionRoute;
  intentState: ExecutionIntentState;
  executionAccess: "demo_only" | "live_blocked";
  guardrails: ExecutionGuardrailKey[];
};

export type SessionLockReason = "none" | "loss_limit" | "capacity_limit";
export type SessionRuntimeState = "active" | "guarded" | "locked";
export type RiskModeState = "normal" | "guarded" | "locked";
export type SafeDegradationState =
  | "none"
  | "new_entries_restricted"
  | "new_entries_blocked";

export type RiskOperatorMessage =
  | "session_active"
  | "session_guarded"
  | "loss_limit_locked"
  | "capacity_reached";

export type RiskFoundationSurface = {
  sessionState: SessionRuntimeState;
  lockReason: SessionLockReason;
  sessionLossLimit: number;
  currentSessionPnl: number;
  maxOpenTrades: number;
  remainingTradeSlots: number;
  losingTradesCount: number;
  riskMode: RiskModeState;
  safeDegradation: SafeDegradationState;
  operatorMessage: RiskOperatorMessage;
};

export type MarketFeedState = "simulated_live" | "disconnected";
export type DecisionEngineState = "derived_local" | "standby";
export type ChartBindingState = "workspace_bound" | "unbound";
export type StoragePersistenceState =
  | "booting"
  | "persistent_local"
  | "memory_only";
export type StateHydrationState = "booting" | "hydrated";
export type SyncChannelState = "local_storage";
export type LocaleDirectionState = "rtl" | "ltr";

export type DataStateFoundationSurface = {
  marketFeedState: MarketFeedState;
  decisionEngineState: DecisionEngineState;
  chartBindingState: ChartBindingState;
  storagePersistenceState: StoragePersistenceState;
  hydrationState: StateHydrationState;
  syncChannel: SyncChannelState;
  stateScope: AccountMode;
  locale: string;
  direction: LocaleDirectionState;
  lastUpdatedAt: string;
};

export type AuditScope =
  | "platform"
  | "account"
  | "compliance"
  | "execution"
  | "risk"
  | "session"
  | "security";

export type AuditEventKind =
  | "account_mode_changed"
  | "disclosures_accepted"
  | "review_state_changed"
  | "trade_opened"
  | "trade_closed"
  | "risk_state_changed"
  | "data_state_updated"
  | "security_state_updated";

export type AuditActorRole = "owner";
export type AuditTraceState = "linked" | "standby";
export type AuditVisibilityState = "operator_visible" | "hidden";

export type AuditEvent = {
  id: string;
  kind: AuditEventKind;
  scope: AuditScope;
  actorRole: AuditActorRole;
  accountMode: AccountMode;
  symbol?: string;
  message: string;
  createdAt: string;
};

export type AuditTraceFoundationSurface = {
  auditState: "active";
  decisionTraceState: AuditTraceState;
  executionTraceState: AuditTraceState;
  sessionTraceState: AuditTraceState;
  visibilityState: AuditVisibilityState;
  currentActor: string;
  currentAccountMode: AccountMode;
  lastEventAt: string;
  recentEvents: AuditEvent[];
};

export type SecurityRouteState = "guarded";
export type SecurityAccessState = "least_privilege";
export type SecurityExecutionProtectionState = "demo_only_enforced";
export type SecurityDataProtectionState = "mode_separated";
export type SecuritySecretState = "local_env_guarded";
export type SecuritySessionProtectionState = "guarded";
export type SecurityRecoveryState = "safe_fallback_ready";
export type SecurityAlertLevel = "normal" | "elevated";

export type SecurityFoundationSurface = {
  routeState: SecurityRouteState;
  accessState: SecurityAccessState;
  executionProtectionState: SecurityExecutionProtectionState;
  dataProtectionState: SecurityDataProtectionState;
  secretState: SecuritySecretState;
  sessionProtectionState: SecuritySessionProtectionState;
  recoveryState: SecurityRecoveryState;
  alertLevel: SecurityAlertLevel;
  currentAccountMode: AccountMode;
  lastReviewedAt: string;
};

export type AccountPolicySurface = {
  runtimeState: AccountRuntimeState;
  executionAccess: "demo_only" | "live_blocked";
  permissionAnchors: PermissionAnchor[];
  jurisdiction: JurisdictionAnchor;
  verificationWorkflow: VerificationWorkflowAnchor[];
  onboarding: OnboardingActivationSurface;
  preferences: AccountPreferenceAnchor[];
  lifecycle: AccountLifecycleSurface;
  disclosures: AccountDisclosureAnchor[];
  review: AccountReviewSurface;
  activation: AccountActivationSurface;
};

export type UserIdentity = {
  id: string;
  displayName: string;
  email: string;
  region: string;
  role: "owner";
  verification: VerificationState;
};

export type Asset = {
  symbol: string;
  status: string;
  price: string;
  change: string;
};

export type TradeDirection = "buy" | "sell";
export type TradeStatus = "open" | "closed";

export type Trade = {
  id: string;
  symbol: string;
  direction: TradeDirection;
  amount: string;
  timeframe: string;
  duration: string;
  openedAt: string;
  closedAt?: string;
  status: TradeStatus;
  result?: string;
};

export type DecisionSignal = "buy" | "sell" | "wait";

export type Decision = {
  signal: DecisionSignal;
  confidence: string;
  state: string;
  reason: string;
};

export type RiskNoteCode = "" | "session_locked" | "max_open_trades";
