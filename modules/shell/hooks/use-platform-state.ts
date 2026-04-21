"use client";

import { useEffect, useMemo, useState } from "react";
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
import type {
  AccountMode,
  AccountPolicySurface,
  AccountRuntimeState,
  Asset,
  DataStateFoundationSurface,
  Decision,
  ExecutionFoundationSurface,
  PermissionAnchor,
  RiskFoundationSurface,
  RiskNoteCode,
  Trade,
  TradeDirection,
  UserIdentity,
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

const FALLBACK_STATE: StoredPlatformState = {
  accountMode: "demo",
  demo: DEFAULT_DEMO_STATE,
  real: DEFAULT_REAL_STATE,
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowText(locale: string) {
  return new Date().toLocaleString(locale);
}

function buildCandles(assetIndex: number, timeframeIndex: number) {
  return Array.from({ length: 18 }, (_, i) => {
    const seed = ((i + 3) * (assetIndex + 2) * 17 + (timeframeIndex + 1) * 13) % 65;
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
    .map((item: any) => ({
      id: typeof item.id === "string" ? item.id : uid(),
      symbol: typeof item.symbol === "string" ? item.symbol : "EURUSD",
      direction: item.direction === "sell" ? "sell" : "buy",
      amount: typeof item.amount === "string" ? item.amount : "100",
      timeframe: typeof item.timeframe === "string" ? item.timeframe : "1m",
      duration: typeof item.duration === "string" && item.duration ? item.duration : fallbackDuration,
      openedAt: typeof item.openedAt === "string" ? item.openedAt : "",
      closedAt: typeof item.closedAt === "string" ? item.closedAt : undefined,
      status: item.status === "closed" ? "closed" : "open",
      result: typeof item.result === "string" ? item.result : undefined,
    }));
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

function buildPermissionAnchors(accountMode: AccountMode): PermissionAnchor[] {
  return [
    { key: "profile", state: "enabled" },
    { key: "settings", state: "enabled" },
    { key: "sign_out", state: "enabled" },
    { key: "demo_execution", state: accountMode === "demo" ? "enabled" : "read_only" },
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
  verification: UserIdentity["verification"]
): AccountPolicySurface["verificationWorkflow"] {
  const identityState =
    verification === "verified"
      ? "ready"
      : verification === "review"
      ? "review"
      : "pending";

  return [
    { key: "identity_check", state: identityState },
    { key: "account_review", state: "review" },
    { key: "disclosure_acceptance", state: "pending" },
    { key: "live_activation", state: "review" },
  ];
}

function buildOnboardingSurface(accountMode: AccountMode): AccountPolicySurface["onboarding"] {
  if (accountMode === "real") {
    return {
      onboardingStage: "activation_review",
      demoReadiness: "ready",
      liveActivation: "review",
    };
  }

  return {
    onboardingStage: "account_ready",
    demoReadiness: "ready",
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
  const [hydrated, setHydrated] = useState(false);
  const [riskNoteCode, setRiskNoteCode] = useState<RiskNoteCode>("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => nowText(locale));

  useEffect(() => {
    const saved = readLocalJson<StoredPlatformState>(PLATFORM_STORAGE_KEY, FALLBACK_STATE);

    setAccountMode(saved.accountMode === "real" ? "real" : "demo");
    setDemoState(sanitizeWorkspaceState(saved.demo, DEFAULT_DEMO_STATE));
    setRealState(sanitizeWorkspaceState(saved.real, DEFAULT_REAL_STATE));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    writeLocalJson(PLATFORM_STORAGE_KEY, {
      accountMode,
      demo: demoState,
      real: realState,
    } satisfies StoredPlatformState);
  }, [accountMode, demoState, realState, hydrated]);

  const activeState = accountMode === "demo" ? demoState : realState;

  useEffect(() => {
    if (!hydrated) return;

    setLastUpdatedAt(nowText(locale));
  }, [
    hydrated,
    locale,
    accountMode,
    activeState.selectedAssetIndex,
    activeState.selectedTimeframe,
    activeState.selectedDuration,
    activeState.amount,
    activeState.openTrades.length,
    activeState.history.length,
  ]);

  function updateActiveState(updater: (current: WorkspaceState) => WorkspaceState) {
    if (accountMode === "demo") {
      setDemoState((current) => updater(current));
      return;
    }

    setRealState((current) => updater(current));
  }

  function switchAccountMode(nextMode: AccountMode) {
    setAccountMode(nextMode);
    setRiskNoteCode("");
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
  const canExecute = accountMode === "demo";
  const accountStatus: AccountRuntimeState = canExecute ? "active" : "read_only";

  const accountPolicy: AccountPolicySurface = {
    runtimeState: accountStatus,
    executionAccess: canExecute ? "demo_only" : "live_blocked",
    permissionAnchors: buildPermissionAnchors(accountMode),
    jurisdiction: {
      key: "global_foundation",
      executionPolicy: "demo_only",
      disclosureState: "required",
      activationState: "review",
    },
    verificationWorkflow: buildVerificationWorkflow(FOUNDATION_USER_IDENTITY.verification),
    onboarding: buildOnboardingSurface(accountMode),
    preferences: buildAccountPreferences(locale),
  };

  const executionFoundation: ExecutionFoundationSurface = {
    route: canExecute ? "demo_router" : "live_blocked",
    executionAccess: canExecute ? "demo_only" : "live_blocked",
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
    safeDegradation: sessionLocked || !canExecute || !canOpenMore
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
    lastUpdatedAt,
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
    openPaperTrade,
    openTradeBySignal,
    closePaperTrade,
  };
}