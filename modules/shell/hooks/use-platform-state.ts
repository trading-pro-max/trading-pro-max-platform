"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EXECUTION_DURATIONS,
  PLATFORM_LIMITS,
  TIMEFRAMES,
  type PlatformExecutionDuration,
  type PlatformTimeframe,
} from "../../../lib/constants/platform";
import { PLATFORM_STORAGE_KEY } from "../../../lib/constants/storage";
import { readLocalJson, writeLocalJson } from "../../../lib/storage/local";
import { MARKET_ASSETS } from "../../market/data/assets";
import {
  acceptAllLocalDisclosures,
  canAcceptPendingDisclosures,
  canSubmitComplianceReview,
  createDefaultLocalComplianceState,
  deriveAccountCompliancePolicy,
  sanitizeLocalComplianceState,
  submitLocalComplianceReview,
  type LocalComplianceState,
} from "../components/trading-workstation-compliance";
import type {
  AccountMode,
  AccountPolicySurface,
  AccountRuntimeState,
  Asset,
  AuditEvent,
  AuditTraceFoundationSurface,
  DataStateFoundationSurface,
  Decision,
  ExecutionFoundationSurface,
  PermissionAnchor,
  RiskFoundationSurface,
  RiskNoteCode,
  SecurityFoundationSurface,
  Trade,
  TradeDirection,
  UserIdentity,
  WorkspacePreferences,
} from "../types/platform-state";

type WorkspaceState = {
  selectedAssetIndex: number;
  selectedTimeframe: PlatformTimeframe;
  selectedDuration: PlatformExecutionDuration;
  amount: string;
  openTrades: Trade[];
  history: Trade[];
  balance: string;
};

type StoredPlatformState = {
  accountMode: AccountMode;
  demo: WorkspaceState;
  real: WorkspaceState;
  workspacePreferences?: WorkspacePreferences;
  compliance?: {
    demo?: LocalComplianceState;
    real?: LocalComplianceState;
  };
};

const FOUNDATION_USER_IDENTITY: UserIdentity = {
  id: "primary-user",
  displayName: "Primary User",
  email: "primary@tradingpromax.local",
  region: "Global",
  role: "owner",
  verification: "review",
};

const DEFAULT_DEMO_STATE: WorkspaceState = {
  selectedAssetIndex: 0,
  selectedTimeframe: "1m",
  selectedDuration: "5s",
  amount: "100",
  openTrades: [],
  history: [],
  balance: "10,000.00",
};

const DEFAULT_REAL_STATE: WorkspaceState = {
  selectedAssetIndex: 0,
  selectedTimeframe: "1m",
  selectedDuration: "5s",
  amount: "100",
  openTrades: [],
  history: [],
  balance: "0.00",
};

const DEFAULT_WORKSPACE_PREFERENCES: WorkspacePreferences = {
  chartType: "candlestick",
  activeIndicators: ["EMA 20", "RSI"],
  activeDrawingTool: "Cursor",
  chartZoom: 100,
  watchlistVisible: false,
  ticketVisible: true,
  blotterExpanded: false,
};

const FALLBACK_STATE: StoredPlatformState = {
  accountMode: "demo",
  demo: DEFAULT_DEMO_STATE,
  real: DEFAULT_REAL_STATE,
  workspacePreferences: DEFAULT_WORKSPACE_PREFERENCES,
  compliance: {
    demo: createDefaultLocalComplianceState("demo"),
    real: createDefaultLocalComplianceState("real"),
  },
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowText(locale: string) {
  return new Date().toLocaleString(locale);
}

function nowIso() {
  return new Date().toISOString();
}

function buildCandles(assetIndex: number, timeframeIndex: number) {
  return Array.from({ length: 18 }, (_, i) => {
    const seed =
      ((i + 3) * (assetIndex + 2) * 17 + (timeframeIndex + 1) * 13) % 65;
    return 26 + seed;
  });
}

function simulateResult(trade: Trade) {
  const base =
    trade.symbol.length +
    trade.amount.length +
    trade.timeframe.length +
    trade.duration.length +
    trade.direction.length;

  const positive = base % 2 === 0;

  return positive
    ? `+$${Math.max(4, Number(trade.amount || "0") * 0.08).toFixed(2)}`
    : `-$${Math.max(3, Number(trade.amount || "0") * 0.05).toFixed(2)}`;
}

function parseSignedDollar(value?: string) {
  if (!value) return 0;

  const normalized = value.replace("$", "").trim();
  const num = Number(normalized);

  return Number.isFinite(num) ? num : 0;
}

function formatReason(template: string, symbol: string, timeframe: string) {
  return template.replaceAll("{symbol}", symbol).replaceAll("{timeframe}", timeframe);
}

function normalizeTrades(value: unknown, fallbackDuration: string): Trade[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => !!item && typeof item === "object")
    .map((item) => {
      const record = item as Record<string, unknown>;

      return {
        id: typeof record.id === "string" ? record.id : uid(),
        symbol: typeof record.symbol === "string" ? record.symbol : "EURUSD",
        direction: record.direction === "sell" ? "sell" : "buy",
        amount: typeof record.amount === "string" ? record.amount : "100",
        timeframe:
          typeof record.timeframe === "string" ? record.timeframe : "1m",
        duration:
          typeof record.duration === "string" && record.duration
            ? record.duration
            : fallbackDuration,
        openedAt: typeof record.openedAt === "string" ? record.openedAt : "",
        closedAt:
          typeof record.closedAt === "string" ? record.closedAt : undefined,
        status: record.status === "closed" ? "closed" : "open",
        result: typeof record.result === "string" ? record.result : undefined,
      };
    });
}

function sanitizeWorkspaceState(
  value: Partial<WorkspaceState> | undefined,
  fallback: WorkspaceState
): WorkspaceState {
  const timeframe =
    typeof value?.selectedTimeframe === "string" &&
    TIMEFRAMES.includes(value.selectedTimeframe as PlatformTimeframe)
      ? (value.selectedTimeframe as PlatformTimeframe)
      : fallback.selectedTimeframe;

  const duration =
    typeof value?.selectedDuration === "string" &&
    EXECUTION_DURATIONS.includes(value.selectedDuration as PlatformExecutionDuration)
      ? (value.selectedDuration as PlatformExecutionDuration)
      : fallback.selectedDuration;

  return {
    selectedAssetIndex: Number.isInteger(value?.selectedAssetIndex)
      ? Number(value?.selectedAssetIndex)
      : fallback.selectedAssetIndex,
    selectedTimeframe: timeframe,
    selectedDuration: duration,
    amount: typeof value?.amount === "string" ? value.amount : fallback.amount,
    openTrades: normalizeTrades(value?.openTrades, duration),
    history: normalizeTrades(value?.history, duration),
    balance: typeof value?.balance === "string" ? value.balance : fallback.balance,
  };
}

function sanitizeWorkspacePreferences(
  value: Partial<WorkspacePreferences> | undefined
): WorkspacePreferences {
  const chartType =
    value?.chartType === "area" ||
    value?.chartType === "line" ||
    value?.chartType === "bars" ||
    value?.chartType === "candlestick"
      ? value.chartType
      : DEFAULT_WORKSPACE_PREFERENCES.chartType;

  const chartZoom =
    typeof value?.chartZoom === "number" && Number.isFinite(value.chartZoom)
      ? Math.min(130, Math.max(80, value.chartZoom))
      : DEFAULT_WORKSPACE_PREFERENCES.chartZoom;

  const activeIndicators = Array.isArray(value?.activeIndicators)
    ? value.activeIndicators.filter((item): item is string => typeof item === "string")
    : DEFAULT_WORKSPACE_PREFERENCES.activeIndicators;

  return {
    chartType,
    activeIndicators,
    activeDrawingTool:
      typeof value?.activeDrawingTool === "string" && value.activeDrawingTool
        ? value.activeDrawingTool
        : DEFAULT_WORKSPACE_PREFERENCES.activeDrawingTool,
    chartZoom,
    watchlistVisible:
      typeof value?.watchlistVisible === "boolean"
        ? value.watchlistVisible
        : DEFAULT_WORKSPACE_PREFERENCES.watchlistVisible,
    ticketVisible:
      typeof value?.ticketVisible === "boolean"
        ? value.ticketVisible
        : DEFAULT_WORKSPACE_PREFERENCES.ticketVisible,
    blotterExpanded:
      typeof value?.blotterExpanded === "boolean"
        ? value.blotterExpanded
        : DEFAULT_WORKSPACE_PREFERENCES.blotterExpanded,
  };
}

function buildPermissionAnchors(
  accountMode: AccountMode,
  paperExecutionEnabled: boolean
): PermissionAnchor[] {
  return [
    { key: "profile", state: "enabled" },
    { key: "settings", state: "enabled" },
    { key: "sign_out", state: "enabled" },
    {
      key: "demo_execution",
      state:
        accountMode === "demo"
          ? paperExecutionEnabled
            ? "enabled"
            : "read_only"
          : "read_only",
    },
    { key: "real_execution", state: "blocked" },
    { key: "audit_surface", state: "read_only" },
    { key: "jurisdiction_controls", state: "read_only" },
  ];
}

function buildAccountPreferences(locale: string): AccountPolicySurface["preferences"] {
  const isArabic = locale === "ar";

  return [
    { key: "language", value: isArabic ? "Arabic" : "English", source: "system" },
    { key: "direction", value: isArabic ? "RTL" : "LTR", source: "system" },
    { key: "density", value: "Adaptive", source: "account" },
    { key: "chart_layout", value: "Primary workspace", source: "account" },
    { key: "risk_confirmation", value: "Enabled", source: "account" },
  ];
}

function buildVerificationWorkflow(
  reviewState: AccountPolicySurface["review"]["state"],
  disclosuresAccepted: boolean
): AccountPolicySurface["verificationWorkflow"] {
  const identityState =
    reviewState === "approved_for_paper"
      ? "ready"
      : reviewState === "in_progress" || reviewState === "pending_review"
      ? "review"
      : disclosuresAccepted
      ? "review"
      : "pending";

  const accountReviewState =
    reviewState === "approved_for_paper"
      ? "ready"
      : reviewState === "pending_review" || reviewState === "in_progress"
      ? "review"
      : "pending";

  return [
    { key: "identity_check", state: identityState },
    { key: "account_review", state: accountReviewState },
    {
      key: "disclosure_acceptance",
      state: disclosuresAccepted ? "ready" : "pending",
    },
    { key: "live_activation", state: "pending" },
  ];
}

function buildOnboardingSurface(
  lifecycleState: AccountPolicySurface["lifecycle"]["state"],
  paperExecutionEnabled: boolean
): AccountPolicySurface["onboarding"] {
  return {
    onboardingStage:
      lifecycleState === "paper_active"
        ? "active"
        : lifecycleState === "review_pending"
        ? "activation_review"
        : lifecycleState === "kyc_pending"
        ? "identity_ready"
        : "foundation",
    demoReadiness: paperExecutionEnabled ? "ready" : "not_ready",
    liveActivation: "blocked",
  };
}

export function usePlatformState(
  locale: string,
  decisionReasons: {
    positive: string;
    negative: string;
    neutral: string;
  }
) {
  const [accountMode, setAccountMode] = useState<AccountMode>("demo");
  const [demoState, setDemoState] = useState<WorkspaceState>(DEFAULT_DEMO_STATE);
  const [realState, setRealState] = useState<WorkspaceState>(DEFAULT_REAL_STATE);
  const [workspacePreferences, setWorkspacePreferences] =
    useState<WorkspacePreferences>(DEFAULT_WORKSPACE_PREFERENCES);
  const [demoCompliance, setDemoCompliance] = useState<LocalComplianceState>(
    FALLBACK_STATE.compliance?.demo || createDefaultLocalComplianceState("demo")
  );
  const [realCompliance, setRealCompliance] = useState<LocalComplianceState>(
    FALLBACK_STATE.compliance?.real || createDefaultLocalComplianceState("real")
  );
  const [hydrated, setHydrated] = useState(false);
  const [riskNoteCode, setRiskNoteCode] = useState<RiskNoteCode>("");
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const accountModeRef = useRef<AccountMode>("demo");
  const sessionStateRef = useRef<"active" | "guarded" | "locked">("active");
  const securityAlertRef = useRef("normal:normal");

  const pushAuditEvent = useCallback(function pushAuditEvent(
    partial: Omit<AuditEvent, "id" | "createdAt" | "actorRole">
  ) {
    const event: AuditEvent = {
      id: uid(),
      createdAt: nowText(locale),
      actorRole: "owner",
      ...partial,
    };

    setAuditEvents((current) => [event, ...current].slice(0, 8));
  }, [locale]);

  const hydratePlatformState = useCallback(() => {
    const saved = readLocalJson<StoredPlatformState>(PLATFORM_STORAGE_KEY, FALLBACK_STATE);

    const nextAccountMode = saved.accountMode === "real" ? "real" : "demo";

    setAccountMode(nextAccountMode);
    setDemoState(sanitizeWorkspaceState(saved.demo, DEFAULT_DEMO_STATE));
    setRealState(sanitizeWorkspaceState(saved.real, DEFAULT_REAL_STATE));
    setWorkspacePreferences(
      sanitizeWorkspacePreferences(saved.workspacePreferences)
    );
    setDemoCompliance(
      sanitizeLocalComplianceState(
        saved.compliance?.demo,
        FALLBACK_STATE.compliance?.demo || createDefaultLocalComplianceState("demo")
      )
    );
    setRealCompliance(
      sanitizeLocalComplianceState(
        saved.compliance?.real,
        FALLBACK_STATE.compliance?.real || createDefaultLocalComplianceState("real")
      )
    );
    setHydrated(true);

    accountModeRef.current = nextAccountMode;

    setAuditEvents([
      {
        id: uid(),
        kind: "data_state_updated",
        scope: "platform",
        actorRole: "owner",
        accountMode: nextAccountMode,
        message:
          locale === "ar"
            ? "تم تحميل حالة المنصة محليًا بنجاح."
            : "Platform state was hydrated locally.",
        createdAt: nowText(locale),
      },
    ]);
  }, [locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hydratePlatformState();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hydratePlatformState]);

  useEffect(() => {
    if (!hydrated) return;

    writeLocalJson(PLATFORM_STORAGE_KEY, {
      accountMode,
      demo: demoState,
      real: realState,
      workspacePreferences,
      compliance: {
        demo: demoCompliance,
        real: realCompliance,
      },
    } satisfies StoredPlatformState);
  }, [
    accountMode,
    demoState,
    realState,
    workspacePreferences,
    demoCompliance,
    realCompliance,
    hydrated,
  ]);

  const activeState = accountMode === "demo" ? demoState : realState;
  const activeComplianceState = accountMode === "demo" ? demoCompliance : realCompliance;
  const lastUpdatedSeed = [
    accountMode,
    activeState.selectedAssetIndex,
    activeState.selectedTimeframe,
    activeState.selectedDuration,
    activeState.amount,
    activeState.openTrades.length,
    activeState.history.length,
  ].join(":");
  const lastUpdatedAt = useMemo(() => {
    if (!hydrated) return "—";

    void lastUpdatedSeed;
    return nowText(locale);
  }, [hydrated, locale, lastUpdatedSeed]);

  function updateActiveState(updater: (current: WorkspaceState) => WorkspaceState) {
    if (accountMode === "demo") {
      setDemoState((current) => updater(current));
      return;
    }

    setRealState((current) => updater(current));
  }

  function updateActiveComplianceState(
    updater: (current: LocalComplianceState) => LocalComplianceState
  ) {
    if (accountMode === "demo") {
      setDemoCompliance((current) => updater(current));
      return;
    }

    setRealCompliance((current) => updater(current));
  }

  function updateWorkspacePreferences(
    updater: (current: WorkspacePreferences) => WorkspacePreferences
  ) {
    setWorkspacePreferences((current) => sanitizeWorkspacePreferences(updater(current)));
  }

  function setWorkspacePreference<K extends keyof WorkspacePreferences>(
    key: K,
    value: WorkspacePreferences[K]
  ) {
    updateWorkspacePreferences((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleWorkspaceIndicator(indicator: string) {
    updateWorkspacePreferences((current) => ({
      ...current,
      activeIndicators: current.activeIndicators.includes(indicator)
        ? current.activeIndicators.filter((item) => item !== indicator)
        : [...current.activeIndicators, indicator],
    }));
  }

  function resetChartWorkspace() {
    updateWorkspacePreferences((current) => ({
      ...current,
      chartType: DEFAULT_WORKSPACE_PREFERENCES.chartType,
      activeIndicators: DEFAULT_WORKSPACE_PREFERENCES.activeIndicators,
      activeDrawingTool: DEFAULT_WORKSPACE_PREFERENCES.activeDrawingTool,
      chartZoom: DEFAULT_WORKSPACE_PREFERENCES.chartZoom,
    }));
  }

  function switchAccountMode(nextMode: AccountMode) {
    setAccountMode(nextMode);
    setRiskNoteCode("");

    pushAuditEvent({
      kind: "account_mode_changed",
      scope: "account",
      accountMode: nextMode,
      message:
        locale === "ar"
          ? `تم التبديل إلى حساب ${nextMode === "demo" ? "تجريبي" : "حقيقي"}.`
          : `Switched to ${nextMode === "demo" ? "demo" : "real"} account mode.`,
    });
  }

  function acceptPendingDisclosures() {
    if (!canAcceptPendingDisclosures(activeComplianceState)) return;

    const acceptedAt = nowIso();

    updateActiveComplianceState((current) =>
      acceptAllLocalDisclosures(current, acceptedAt)
    );

    pushAuditEvent({
      kind: "disclosures_accepted",
      scope: "compliance",
      accountMode,
      message:
        locale === "ar"
          ? "تم اعتماد الإفصاحات المطلوبة محلياً للحساب النشط."
          : "Required disclosures were acknowledged locally for the active account.",
    });
  }

  function submitActivationReview() {
    if (!canSubmitComplianceReview(activeComplianceState)) return;

    const submittedAt = nowIso();

    updateActiveComplianceState((current) =>
      submitLocalComplianceReview(current, submittedAt)
    );

    pushAuditEvent({
      kind: "review_state_changed",
      scope: "compliance",
      accountMode,
      message:
        locale === "ar"
          ? "تم إرسال جاهزية الحساب للمراجعة الورقية المحلية."
          : "Account readiness was submitted for local paper review.",
    });
  }

  const selectedAsset: Asset =
    MARKET_ASSETS[activeState.selectedAssetIndex] || MARKET_ASSETS[0];

  const candles = useMemo(() => {
    const timeframeIndex = TIMEFRAMES.indexOf(activeState.selectedTimeframe);
    return buildCandles(activeState.selectedAssetIndex, Math.max(0, timeframeIndex));
  }, [activeState.selectedAssetIndex, activeState.selectedTimeframe]);

  const decision = useMemo<Decision>(() => {
    const timeframeIndex = TIMEFRAMES.indexOf(activeState.selectedTimeframe);
    const raw =
      ((activeState.selectedAssetIndex + 2) * 19 +
        (timeframeIndex + 3) * 11 +
        selectedAsset.symbol.length * 3) %
      100;

    if (raw >= 67) {
      return {
        signal: "buy",
        confidence: `${72 + (raw % 17)}%`,
        state: selectedAsset.status,
        reason: formatReason(
          decisionReasons.positive,
          selectedAsset.symbol,
          activeState.selectedTimeframe
        ),
      };
    }

    if (raw <= 33) {
      return {
        signal: "sell",
        confidence: `${69 + (raw % 19)}%`,
        state: selectedAsset.status,
        reason: formatReason(
          decisionReasons.negative,
          selectedAsset.symbol,
          activeState.selectedTimeframe
        ),
      };
    }

    return {
      signal: "wait",
      confidence: `${58 + (raw % 12)}%`,
      state: selectedAsset.status,
      reason: formatReason(
        decisionReasons.neutral,
        selectedAsset.symbol,
        activeState.selectedTimeframe
      ),
    };
  }, [
    activeState.selectedAssetIndex,
    activeState.selectedTimeframe,
    decisionReasons.negative,
    decisionReasons.neutral,
    decisionReasons.positive,
    selectedAsset,
  ]);

  const sessionPnL = useMemo(() => {
    return activeState.history.reduce(
      (sum, trade) => sum + parseSignedDollar(trade.result),
      0
    );
  }, [activeState.history]);

  const lossCount = useMemo(() => {
    return activeState.history.filter((trade) => (trade.result || "").startsWith("-")).length;
  }, [activeState.history]);

  const sessionLocked = sessionPnL <= PLATFORM_LIMITS.sessionLossLimit;
  const remainingTradeSlots = Math.max(
    0,
    PLATFORM_LIMITS.maxOpenTrades - activeState.openTrades.length
  );
  const canOpenMore = remainingTradeSlots > 0;
  const compliancePolicy = deriveAccountCompliancePolicy(
    accountMode,
    activeComplianceState
  );
  const disclosuresAccepted = compliancePolicy.disclosures.every(
    (item) => item.state === "accepted"
  );
  const canAcknowledgeDisclosures =
    canAcceptPendingDisclosures(activeComplianceState);
  const canSubmitAccountReview =
    canSubmitComplianceReview(activeComplianceState);
  const canExecute =
    accountMode === "demo" && compliancePolicy.activation.executionEnabled;
  const accountStatus: AccountRuntimeState =
    compliancePolicy.activation.executionEnabled ? "active" : "read_only";

  const accountPolicy: AccountPolicySurface = {
    runtimeState: accountStatus,
    executionAccess: accountMode === "demo" ? "demo_only" : "live_blocked",
    permissionAnchors: buildPermissionAnchors(
      accountMode,
      compliancePolicy.activation.executionEnabled
    ),
    jurisdiction: {
      key: "global_foundation",
      executionPolicy: "demo_only",
      disclosureState: disclosuresAccepted ? "ready" : "required",
      activationState: compliancePolicy.activation.executionEnabled
        ? "active"
        : "review",
    },
    verificationWorkflow: buildVerificationWorkflow(
      compliancePolicy.review.state,
      disclosuresAccepted
    ),
    onboarding: buildOnboardingSurface(
      compliancePolicy.lifecycle.state,
      compliancePolicy.activation.executionEnabled
    ),
    preferences: buildAccountPreferences(locale),
    lifecycle: compliancePolicy.lifecycle,
    disclosures: compliancePolicy.disclosures,
    review: compliancePolicy.review,
    activation: compliancePolicy.activation,
  };

  const executionFoundation: ExecutionFoundationSurface = {
    route: accountMode === "demo" ? "demo_router" : "live_blocked",
    executionAccess: accountMode === "demo" ? "demo_only" : "live_blocked",
    intentState:
      !canExecute
        ? "blocked"
        : sessionLocked || !canOpenMore
        ? "guarded"
        : decision.signal === "wait"
        ? "standby"
        : "ready",
    guardrails: [
      ...(accountMode === "real" ? (["demo_only"] as const) : []),
      ...(sessionLocked ? (["session_locked"] as const) : []),
      ...(!canOpenMore ? (["max_open_trades"] as const) : []),
    ],
  };

  const sessionGuardThreshold = PLATFORM_LIMITS.sessionLossLimit * 0.6;

  const riskFoundation: RiskFoundationSurface = {
    sessionState: sessionLocked
      ? "locked"
      : sessionPnL <= sessionGuardThreshold || remainingTradeSlots <= 1
      ? "guarded"
      : "active",
    lockReason: sessionLocked
      ? "loss_limit"
      : !canOpenMore
      ? "capacity_limit"
      : "none",
    sessionLossLimit: Math.abs(PLATFORM_LIMITS.sessionLossLimit),
    currentSessionPnl: sessionPnL,
    maxOpenTrades: PLATFORM_LIMITS.maxOpenTrades,
    remainingTradeSlots,
    losingTradesCount: lossCount,
    riskMode: sessionLocked
      ? "locked"
      : sessionPnL <= sessionGuardThreshold || remainingTradeSlots <= 1
      ? "guarded"
      : "normal",
    safeDegradation:
      sessionLocked || !canExecute || !canOpenMore
        ? "new_entries_blocked"
        : sessionPnL <= sessionGuardThreshold || remainingTradeSlots <= 1
        ? "new_entries_restricted"
        : "none",
    operatorMessage: sessionLocked
      ? "loss_limit_locked"
      : !canOpenMore
      ? "capacity_reached"
      : sessionPnL <= sessionGuardThreshold || remainingTradeSlots <= 1
      ? "session_guarded"
      : "session_active",
  };

  useEffect(() => {
    if (!hydrated) return;

    if (accountModeRef.current !== accountMode) {
      accountModeRef.current = accountMode;
    }
  }, [accountMode, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    if (sessionStateRef.current !== riskFoundation.sessionState) {
      sessionStateRef.current = riskFoundation.sessionState;

      pushAuditEvent({
        kind: "risk_state_changed",
        scope: "risk",
        accountMode,
        message:
          locale === "ar"
            ? `تم تحديث حالة المخاطر إلى ${riskFoundation.sessionState}.`
            : `Risk state changed to ${riskFoundation.sessionState}.`,
      });
    }
  }, [hydrated, accountMode, locale, riskFoundation.sessionState, pushAuditEvent]);

  const dataStateFoundation: DataStateFoundationSurface = {
    marketFeedState: "simulated_live",
    decisionEngineState: decision.signal === "wait" ? "standby" : "derived_local",
    chartBindingState: "workspace_bound",
    storagePersistenceState: hydrated ? "persistent_local" : "booting",
    hydrationState: hydrated ? "hydrated" : "booting",
    syncChannel: "local_storage",
    stateScope: accountMode,
    locale,
    direction: locale === "ar" ? "rtl" : "ltr",
    lastUpdatedAt: hydrated ? lastUpdatedAt : "—",
  };

  const securityAlertReason =
    accountMode === "real"
      ? "real_mode_selected"
      : sessionLocked
      ? "session_locked"
      : !canOpenMore
      ? "capacity_limit"
      : riskFoundation.sessionState === "guarded"
      ? "guarded_session"
      : "normal";

  const securityFoundation: SecurityFoundationSurface = {
    routeState: "guarded",
    accessState: "least_privilege",
    executionProtectionState: "demo_only_enforced",
    dataProtectionState: "mode_separated",
    secretState: "local_env_guarded",
    sessionProtectionState: "guarded",
    recoveryState: "safe_fallback_ready",
    alertLevel: securityAlertReason === "normal" ? "normal" : "elevated",
    currentAccountMode: accountMode,
    lastReviewedAt: accountPolicy.review.updatedAt || (hydrated ? lastUpdatedAt : "—"),
  };

  useEffect(() => {
    if (!hydrated) return;

    const securityAlertSignature =
      `${securityFoundation.alertLevel}:${securityAlertReason}`;

    if (securityAlertRef.current !== securityAlertSignature) {
      securityAlertRef.current = securityAlertSignature;

      const securityAlertReasonLabel =
        locale === "ar"
          ? securityAlertReason === "real_mode_selected"
            ? "اختيار الحساب الحقيقي"
            : securityAlertReason === "session_locked"
            ? "قفل الجلسة"
            : securityAlertReason === "capacity_limit"
            ? "بلوغ سعة الصفقات"
            : securityAlertReason === "guarded_session"
            ? "جلسة محكومة"
            : "طبيعي"
          : securityAlertReason === "real_mode_selected"
          ? "real mode selected"
          : securityAlertReason === "session_locked"
          ? "session locked"
          : securityAlertReason === "capacity_limit"
          ? "trade capacity reached"
          : securityAlertReason === "guarded_session"
          ? "guarded session"
          : "normal";

      pushAuditEvent({
        kind: "security_state_updated",
        scope: "security",
        accountMode,
        message:
          locale === "ar"
            ? `تم تحديث مستوى التنبيه الأمني إلى ${securityFoundation.alertLevel} بسبب ${securityAlertReasonLabel}.`
            : `Security alert level updated to ${securityFoundation.alertLevel} due to ${securityAlertReasonLabel}.`,
      });
    }
  }, [
    hydrated,
    accountMode,
    locale,
    securityAlertReason,
    securityFoundation.alertLevel,
    pushAuditEvent,
  ]);

  const auditTraceFoundation: AuditTraceFoundationSurface = {
    auditState: "active",
    decisionTraceState: "linked",
    executionTraceState: "linked",
    sessionTraceState: "linked",
    visibilityState: "operator_visible",
    currentActor: FOUNDATION_USER_IDENTITY.displayName,
    currentAccountMode: accountMode,
    lastEventAt: auditEvents[0]?.createdAt || "—",
    recentEvents: auditEvents,
  };

  function openPaperTrade(direction: TradeDirection) {
    if (!canExecute) return;

    if (sessionLocked) {
      setRiskNoteCode("session_locked");
      return;
    }

    if (!canOpenMore) {
      setRiskNoteCode("max_open_trades");
      return;
    }

    const trade: Trade = {
      id: uid(),
      symbol: selectedAsset.symbol,
      direction,
      amount: activeState.amount || "100",
      timeframe: activeState.selectedTimeframe,
      duration: activeState.selectedDuration,
      openedAt: nowText(locale),
      status: "open",
    };

    updateActiveState((current) => ({
      ...current,
      openTrades: [trade, ...current.openTrades],
    }));

    setRiskNoteCode("");

    pushAuditEvent({
      kind: "trade_opened",
      scope: "execution",
      accountMode,
      symbol: trade.symbol,
      message:
        locale === "ar"
          ? `تم فتح صفقة ${direction === "buy" ? "شراء" : "بيع"} على ${trade.symbol}.`
          : `Opened ${direction} trade on ${trade.symbol}.`,
    });
  }

  function openTradeBySignal() {
    if (!canExecute) return;

    if (decision.signal === "buy" || decision.signal === "sell") {
      openPaperTrade(decision.signal);
    }
  }

  function closePaperTrade(id: string) {
    if (!canExecute) return;

    updateActiveState((current) => {
      const trade = current.openTrades.find((item) => item.id === id);
      if (!trade) return current;

      const closedTrade: Trade = {
        ...trade,
        status: "closed",
        closedAt: nowText(locale),
        result: simulateResult(trade),
      };

      pushAuditEvent({
        kind: "trade_closed",
        scope: "session",
        accountMode,
        symbol: closedTrade.symbol,
        message:
          locale === "ar"
            ? `تم إغلاق صفقة ${closedTrade.symbol} بنتيجة ${closedTrade.result}.`
            : `Closed ${closedTrade.symbol} trade with result ${closedTrade.result}.`,
      });

      return {
        ...current,
        openTrades: current.openTrades.filter((item) => item.id !== id),
        history: [closedTrade, ...current.history],
      };
    });
  }

  return {
    userIdentity: FOUNDATION_USER_IDENTITY,
    accountMode,
    accountStatus,
    accountPolicy,
    executionFoundation,
    riskFoundation,
    dataStateFoundation,
    auditTraceFoundation,
    securityFoundation,
    workspacePreferences,
    setWorkspacePreference,
    toggleWorkspaceIndicator,
    resetChartWorkspace,
    switchAccountMode,
    balance: activeState.balance,
    availableDurations: EXECUTION_DURATIONS,
    selectedAssetIndex: activeState.selectedAssetIndex,
    setSelectedAssetIndex: (nextIndex: number) =>
      updateActiveState((current) => ({
        ...current,
        selectedAssetIndex: nextIndex,
      })),
    selectedTimeframe: activeState.selectedTimeframe,
    setSelectedTimeframe: (nextTimeframe: PlatformTimeframe) =>
      updateActiveState((current) => ({
        ...current,
        selectedTimeframe: nextTimeframe,
      })),
    selectedDuration: activeState.selectedDuration,
    setSelectedDuration: (nextDuration: PlatformExecutionDuration) =>
      updateActiveState((current) => ({
        ...current,
        selectedDuration: nextDuration,
      })),
    amount: activeState.amount,
    setAmount: (nextAmount: string) =>
      updateActiveState((current) => ({
        ...current,
        amount: nextAmount,
      })),
    openTrades: activeState.openTrades,
    history: activeState.history,
    riskNoteCode,
    selectedAsset,
    candles,
    decision,
    sessionPnL,
    lossCount,
    sessionLocked,
    canOpenMore,
    canExecute,
    canAcknowledgeDisclosures,
    canSubmitAccountReview,
    acceptPendingDisclosures,
    submitActivationReview,
    openPaperTrade,
    openTradeBySignal,
    closePaperTrade,
  };
}
