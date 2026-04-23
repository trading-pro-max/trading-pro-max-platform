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

export type MarketFeedState =
  | "booting"
  | "fallback_ready"
  | "external_ready"
  | "degraded"
  | "unavailable"
  | "simulated_live"
  | "disconnected";
export type DecisionEngineState = "derived_market" | "derived_local" | "standby";
export type ChartBindingState = "feed_bound" | "workspace_bound" | "unbound";
export type StoragePersistenceState =
  | "booting"
  | "persistent_backend"
  | "persistent_local"
  | "syncing"
  | "memory_only";
export type StateHydrationState = "booting" | "hydrated" | "degraded";
export type SyncChannelState =
  | "api_preferences"
  | "local_storage"
  | "hybrid"
  | "memory_only";
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
  | "execution_blocked"
  | "execution_signal_ignored"
  | "risk_state_changed"
  | "market_feed_updated"
  | "preferences_synced"
  | "data_state_updated"
  | "workspace_depth_changed"
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

export type AssetClass = "fx" | "crypto" | "commodity";

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  priceDecimals: number;
  status: string;
  price: string;
  change: string;
  sourceLabel?: string;
  lastUpdatedAt?: string;
  bid?: string;
  ask?: string;
  spread?: string;
  freshness?: "Fresh" | "Warm" | "Session Closed" | "Delayed" | "Stale" | "Pending";
};

export type MarketCandle = {
  time: string;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketFeedNoticeSeverity = "info" | "warning";
export type MarketFeedNoticeCode =
  | "symbol_fallback_applied"
  | "timeframe_fallback_applied"
  | "external_feed_reserved"
  | "fallback_adapter_active"
  | "fallback_adapter_degraded";

export type MarketFeedNotice = {
  code: MarketFeedNoticeCode;
  severity: MarketFeedNoticeSeverity;
  message: string;
};

export type MarketRequestResolution = {
  inputSymbol: string | null;
  inputTimeframe: string | null;
  normalizedSymbol: string;
  normalizedTimeframe: string;
  symbolFallbackApplied: boolean;
  timeframeFallbackApplied: boolean;
};

export type MarketFeedSummary = {
  provider: string;
  adapter: "fallback_simulated";
  state: MarketFeedState;
  sourceLabel: string;
  updateCadenceMs: number;
  supportsStreaming: boolean;
  configured: boolean;
  externalFeedConfigured: boolean;
  externalFeedActive: false;
  policyMode?: "fallback_first";
  externalFeedState?:
    | "unconfigured"
    | "configured_inactive"
    | "configured_blocked";
  degradedReason?: string;
  readinessScore?: number;
  freshness?: {
    chart: "Fresh" | "Warm" | "Session Closed" | "Delayed" | "Stale" | "Pending";
    health: "Healthy" | "Stable" | "Delayed" | "Degraded" | "Session Closed";
  };
  notices: MarketFeedNotice[];
  lastUpdatedAt: string;
};

export type MarketDataSnapshot = {
  requestedSymbol: string;
  requestedTimeframe: string;
  request: MarketRequestResolution;
  feed: MarketFeedSummary;
  assets: Asset[];
  candles: MarketCandle[];
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

export type PlatformChartType = "candlestick" | "area" | "line" | "bars";

export type WorkspaceFocusMode = "balanced" | "chart_focus" | "execution_focus";
export type WatchlistDensityMode = "standard" | "dense";
export type WorkspaceShortcutLayer = "layout_only";

export type WorkspaceDepthState = {
  focusMode: WorkspaceFocusMode;
  watchlistDensity: WatchlistDensityMode;
  shortcutLayer: WorkspaceShortcutLayer;
};

export type WorkspacePreferences = {
  chartType: PlatformChartType;
  activeIndicators: string[];
  activeDrawingTool: string;
  chartZoom: number;
  watchlistVisible: boolean;
  ticketVisible: boolean;
  blotterExpanded: boolean;
};

export type PlatformPreferenceSnapshot = WorkspacePreferences & {
  timeframe: string;
  duration: string;
  selectedAssetSymbol: string;
};

export type MarketFeedRoutePayload = {
  ok: true;
  snapshot: MarketDataSnapshot;
};

export type PreferencesRoutePayload = {
  ok: true;
  authenticated: boolean;
  preferences: PlatformPreferenceSnapshot | null;
  updatedAt?: string;
};

export type DiagnosticsProbeStatus =
  | "ready"
  | "fallback"
  | "blocked"
  | "auth_required"
  | "degraded"
  | "unconfigured"
  | "unavailable";

export type DiagnosticsProbe = {
  key: string;
  label: string;
  status: DiagnosticsProbeStatus;
  summary: string;
  detail: string;
  checkedAt: string;
};

export type DiagnosticsRouteProbe = {
  path: string;
  method: "GET" | "POST";
  status: DiagnosticsProbeStatus;
  detail: string;
};

export type ConnectorState = "unconfigured" | "configured_blocked";
export type ConnectorConnectionState =
  | "unconfigured"
  | "configured_not_connected";
export type ConnectorActivationGate =
  | "configuration_required"
  | "policy_blocked";
export type ConnectorCapabilityState = "local_paper_only" | "blocked";
export type ConnectorOperatorKeyMode =
  | "configured"
  | "local_explicit"
  | "unconfigured";
export type ConnectorOperatorReviewState =
  | "unconfigured"
  | "configured_guarded"
  | "local_explicit_guarded";

export type ConnectorSafetySnapshot = {
  key: "broker";
  label: string;
  state: ConnectorState;
  configured: boolean;
  connectionState: ConnectorConnectionState;
  activationGate: ConnectorActivationGate;
  paperCapability: Extract<ConnectorCapabilityState, "local_paper_only">;
  realCapability: Extract<ConnectorCapabilityState, "blocked">;
  liveExecution: "blocked";
  operatorReview: {
    state: ConnectorOperatorReviewState;
    keyMode: ConnectorOperatorKeyMode;
    summary: string;
    detail: string;
  };
  summary: string;
  detail: string;
  checkedAt: string;
};

export type DiagnosticsHealthSnapshot = {
  checkedAt: string;
  readiness: DiagnosticsProbe;
  probes: DiagnosticsProbe[];
  routes: DiagnosticsRouteProbe[];
  connectors: ConnectorSafetySnapshot[];
  subsystems?: Array<{
    key: string;
    label: string;
    status: DiagnosticsProbeStatus;
    summary: string;
    detail: string;
  }>;
  policyTruth?: {
    paperOnly: true;
    liveExecution: "blocked";
    marketData: "fallback_first";
    brokerRouting: "blocked";
    externalFeed: "fallback_active";
  };
  architecture?: {
    broker: {
      policyMode: string;
      provider: string;
      state: string;
      activationGate: string;
      readinessScore?: number;
      readinessStage?: string;
    };
    marketFeed: {
      policyMode: "fallback_first";
      externalState: string;
      externalConfigured: boolean;
      readinessScore?: number;
      readinessStage?: string;
    };
    activationPilot?: {
      mode: "sandbox_guarded";
      state:
        | "inactive_unconfigured"
        | "inactive_guarded"
        | "pilot_requested_blocked"
        | "pilot_guarded_ready";
      canEnterPilotSandbox: boolean;
      readinessScore?: number;
      readinessStage?: string;
    };
  };
  clientExpansion?: {
    checkedAt: string;
    shared: {
      apiContract: "http_json_v1";
      authContract: "session_or_bearer";
      executionSafety: "paper_only_live_blocked";
      workspaceContinuity: "backend_workspace_depth_contract";
      preferenceContinuity: "hybrid_preference_contract";
      sessionContinuity: "guarded_cross_client";
      notificationTruth: "readiness_state_shared";
    };
    web: {
      state: "active";
      routeSurface: "app_router";
    };
    desktop: {
      state: "future_ready";
      shell: "electron_or_tauri";
      localPersistence: "contract_ready";
      notificationDelivery: "unconfigured";
      foundation?: {
        runtimeBridge: "ipc_json_v1";
        targets: Array<"windows" | "macos" | "linux">;
        packaging: "contract_ready";
        distributionState: "contract_only" | "packaging_ready";
        sessionStrategy: "http_session_bridge";
      };
      productization?: {
        stage: "foundation_only" | "pilot_usable" | "distribution_guarded";
        sessionRestore: "disabled" | "guarded_enabled";
        updateState: "unconfigured" | "pilot_update_ready";
        releaseClaims: "no_public_store_release_claim";
      };
      continuity?: {
        workspaceState: "backend_workspace_depth_linked";
        sessionBridge: "guarded_cross_client";
        notificationSemantics: "shared_guarded_readiness";
      };
    };
    mobile: {
      state: "future_ready";
      shell: "react_native_or_native_wrapper";
      authFlow: "session_or_token_bridge";
      notificationDelivery: "unconfigured";
      foundation?: {
        runtimeBridge: "bridge_json_v1";
        targets: Array<"android" | "ios">;
        pushDelivery: "unconfigured";
        distributionState: "contract_only" | "packaging_ready";
        sessionStrategy: "session_or_token_bridge";
      };
      productization?: {
        stage: "foundation_only" | "pilot_usable" | "distribution_guarded";
        sessionRestore: "disabled" | "guarded_enabled";
        distributionState: "unconfigured" | "pilot_distribution_ready";
        releaseClaims: "no_store_release_claim";
      };
      continuity?: {
        workspaceState: "backend_workspace_depth_linked";
        sessionBridge: "guarded_cross_client";
        notificationSemantics: "shared_guarded_readiness";
      };
    };
    summary: string;
  };
  launchReadiness?: {
    checkedAt: string;
    mode: "verification_gate";
    status: "pass" | "fail";
    score: number;
    failedChecklist: number;
    warnedDomains: number;
  };
  launchOperations?: {
    checkedAt: string;
    mode:
      | "closed_beta_preparation"
      | "soft_launch_preparation"
      | "public_launch_preparation";
    status: "in_progress" | "blocked";
    supportRoute: "/api/launch/feedback";
    productionHardening: "ready" | "guarded";
    softLaunch?: "ready" | "guarded";
  };
};

export type DiagnosticsRoutePayload = {
  ok: boolean;
  health: DiagnosticsHealthSnapshot;
};
