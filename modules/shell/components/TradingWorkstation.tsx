"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { PLATFORM_LIMITS } from "../../../lib/constants/platform";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import LivingEarthBackground from "../../brand/components/LivingEarthBackground";
import { CompanionLauncher } from "../../companion/components";
import type {
  WorkspaceFocusMode,
  WatchlistDensityMode,
} from "../types/platform-state";
import { usePlatformState } from "../hooks/use-platform-state";
import {
  ActivityHistoryPanel,
  ActivityLogPanel,
  ActivityOpenTradesPanel,
  ChartCard,
  ExecutionCard,
  TradingTopbar,
} from "./PlatformShellV2";
import { ExecutionRail } from "./ExecutionRail";
import { LivingMarketCore } from "./LivingMarketCore";
import { TradingChartCanvas } from "./TradingChartCanvas";
import { TradingChartFooter } from "./TradingChartFooter";
import { TradingChartHeader } from "./TradingChartHeader";
import { TradingChartSurface } from "./TradingChartSurface";
import { WorkspaceAssistantDock } from "./WorkspaceAssistantDock";
import { WorkspaceJournalCoachDock } from "./WorkspaceJournalCoachDock";
import { createTradingWorkstationViewModel } from "./trading-workstation-view-model";

function focusModeLabel(mode: WorkspaceFocusMode) {
  if (mode === "chart_focus") return "Chart focus";
  if (mode === "execution_focus") return "Execution focus";
  return "Balanced";
}

function workspaceFocusClassName(mode: WorkspaceFocusMode) {
  if (mode === "chart_focus") return "tpmv2-desktop-master-focus-chart";
  if (mode === "execution_focus") return "tpmv2-desktop-master-focus-execution";
  return "tpmv2-desktop-master-focus-balanced";
}

function watchlistDensityLabel(mode: WatchlistDensityMode) {
  return mode === "dense" ? "Dense" : "Standard";
}

function humanizeState(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/^\w/, (match) => match.toUpperCase());
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

type WorkflowPreflightState = {
  value: string;
  tone: "approved" | "pending" | "restricted" | "blocked";
  note: string;
};

const AMOUNT_PRESETS = ["50", "100", "250", "500"] as const;

export default function TradingWorkstation({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const platformState = usePlatformState(locale, dict.decision.reasons);
  const { focusMode, watchlistDensity } = platformState.workspaceDepth;
  const viewModel = createTradingWorkstationViewModel({
    locale,
    dict,
    accountStatus: platformState.accountStatus,
    accountPolicy: platformState.accountPolicy,
    executionFoundation: platformState.executionFoundation,
    riskFoundation: platformState.riskFoundation,
    dataStateFoundation: platformState.dataStateFoundation,
    auditTraceFoundation: platformState.auditTraceFoundation,
    securityFoundation: platformState.securityFoundation,
    intelligence: platformState.intelligence,
    decision: platformState.decision,
    riskNoteCode: platformState.riskNoteCode,
    sessionPnL: platformState.sessionPnL,
    sessionLocked: platformState.sessionLocked,
    openTradesCount: platformState.openTrades.length,
  });

  const [shortcutHint, setShortcutHint] = useState("Balanced workspace focus active.");
  const [workflowPreflight, setWorkflowPreflight] = useState<WorkflowPreflightState>({
    value: "Loading",
    tone: "pending",
    note: "Loading workflow automation truth.",
  });
  const localePrefix = locale ? `/${locale}` : "";
  const dir = getDirection(locale);
  const diagnosticsHref = `${localePrefix}/diagnostics`;
  const settingsHref = `${localePrefix}/settings`;
  const feedbackHref = `${diagnosticsHref}#feedback`;
  const feedStatus = humanizeState(platformState.dataStateFoundation.marketFeedState);
  const fallbackTruth =
    platformState.dataStateFoundation.marketFeedState === "fallback_ready"
      ? "Demo/fallback data"
      : "Market data readiness";

  const marketDepthItems = useMemo(
    () => [
      {
        label: "Asset class",
        value: platformState.selectedAsset.assetClass.toUpperCase(),
      },
      {
        label: "Feed state",
        value: feedStatus,
        tone:
          platformState.dataStateFoundation.marketFeedState === "external_ready"
            ? ("approved" as const)
            : platformState.dataStateFoundation.marketFeedState === "fallback_ready"
            ? ("pending" as const)
            : ("restricted" as const),
      },
      {
        label: "Workspace focus",
        value: focusModeLabel(focusMode),
      },
      {
        label: "Chart binding",
        value: humanizeState(platformState.dataStateFoundation.chartBindingState),
      },
    ],
    [
      feedStatus,
      focusMode,
      platformState.dataStateFoundation.chartBindingState,
      platformState.dataStateFoundation.marketFeedState,
      platformState.selectedAsset.assetClass,
    ]
  );

  const preflightItems = useMemo(
    () => [
      {
        label: "Route",
        value: platformState.accountMode === "demo" ? "Paper-only" : "Live blocked",
        tone: platformState.accountMode === "demo" ? ("approved" as const) : ("blocked" as const),
      },
      {
        label: "Ticket gate",
        value: viewModel.ticketGateValue,
        tone: viewModel.ticketGateTone,
        note: `${viewModel.ticketReadinessLabel}: ${viewModel.ticketReadinessValue}`,
      },
      {
        label: "Workflow",
        value: workflowPreflight.value,
        tone: workflowPreflight.tone,
        note: workflowPreflight.note,
      },
      {
        label: "Session load",
        value: `${platformState.openTrades.length}/${PLATFORM_LIMITS.maxOpenTrades} open`,
        tone: platformState.canOpenMore ? ("approved" as const) : ("blocked" as const),
        note: `${viewModel.sessionStateLabel} / ${viewModel.sessionPnLText} realized.`,
      },
    ],
    [
      platformState.accountMode,
      platformState.canOpenMore,
      platformState.openTrades.length,
      viewModel.sessionPnLText,
      viewModel.sessionStateLabel,
      viewModel.ticketGateTone,
      viewModel.ticketGateValue,
      viewModel.ticketReadinessLabel,
      viewModel.ticketReadinessValue,
      workflowPreflight.note,
      workflowPreflight.tone,
      workflowPreflight.value,
    ]
  );

  const recentActivity =
    platformState.auditTraceFoundation.recentEvents[0]?.message ??
    "Workspace state is standing by for the next operator action.";

  const showShortcutHint = (message: string) => {
    setShortcutHint(message);
  };

  const workspaceFocusControls = (
    <div
      className="tpm-workspace-focus-row tpm-workspace-focus-row-chart"
      role="toolbar"
      aria-label="Workspace focus"
    >
      <span>Workspace focus</span>
      <button
        type="button"
        className={focusMode === "balanced" ? "active" : ""}
        aria-pressed={focusMode === "balanced"}
        onClick={() => {
          platformState.setWorkspaceFocusMode("balanced");
          showShortcutHint("Balanced workspace focus engaged.");
        }}
      >
        Balanced
      </button>
      <button
        type="button"
        className={focusMode === "chart_focus" ? "active" : ""}
        aria-pressed={focusMode === "chart_focus"}
        onClick={() => {
          platformState.setWorkspaceFocusMode("chart_focus");
          showShortcutHint("Chart focus engaged.");
        }}
      >
        Chart focus
      </button>
      <button
        type="button"
        className={focusMode === "execution_focus" ? "active" : ""}
        aria-pressed={focusMode === "execution_focus"}
        onClick={() => {
          platformState.setWorkspaceFocusMode("execution_focus");
          showShortcutHint("Execution focus engaged.");
        }}
      >
        Execution
      </button>
    </div>
  );

  useEffect(() => {
    if (!shortcutHint) return undefined;

    const timeout = window.setTimeout(() => {
      setShortcutHint("Balanced workspace focus active.");
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [shortcutHint]);

  useEffect(() => {
    let active = true;

    async function loadWorkflowPreflight() {
      try {
        const response = await fetch("/api/alerts/automation/state", {
          method: "GET",
          cache: "no-store",
        });

        if (!active) return;

        if (response.status === 401) {
          setWorkflowPreflight({
            value: "Auth required",
            tone: "restricted",
            note: "Sign in to load account workflow/automation preflight truth.",
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`Workflow preflight failed with ${response.status}.`);
        }

        const payload = (await response.json()) as {
          snapshot?: {
            runtime?: {
              scheduler?: string;
              delivery?: string;
              autoTrading?: string;
            };
            triggers?: {
              enabledRuleCount?: number;
              operatorAckRequiredCount?: number;
            };
          };
        };
        const enabledRuleCount = Math.max(
          0,
          Number(payload.snapshot?.triggers?.enabledRuleCount ?? 0)
        );
        const operatorAckRequiredCount = Math.max(
          0,
          Number(payload.snapshot?.triggers?.operatorAckRequiredCount ?? 0)
        );
        const scheduler = payload.snapshot?.runtime?.scheduler ?? "inactive";
        const delivery = payload.snapshot?.runtime?.delivery ?? "unconfigured";
        const autoTrading = payload.snapshot?.runtime?.autoTrading ?? "blocked";

        setWorkflowPreflight({
          value:
            enabledRuleCount > 0
              ? `${enabledRuleCount} rule(s) / ${humanizeState(scheduler)}`
              : "No enabled rules",
          tone:
            enabledRuleCount > 0 && scheduler === "configured_guarded"
              ? "approved"
              : "pending",
          note: `${humanizeState(delivery)} delivery, ${operatorAckRequiredCount} ack-required, auto-trading ${humanizeState(autoTrading)}.`,
        });
      } catch {
        if (!active) return;
        setWorkflowPreflight({
          value: "Unavailable",
          tone: "blocked",
          note: "Workflow preflight route is temporarily unavailable.",
        });
      }
    }

    void loadWorkflowPreflight();
    const interval = window.setInterval(() => {
      void loadWorkflowPreflight();
    }, 45_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.repeat || !event.shiftKey || isTypingTarget(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "4") {
      event.preventDefault();
      platformState.setWorkspaceFocusMode("balanced");
      showShortcutHint("Balanced workspace focus engaged.");
      return;
    }

    if (key === "5") {
      event.preventDefault();
      platformState.setWorkspaceFocusMode("chart_focus");
      showShortcutHint("Chart focus engaged.");
      return;
    }

    if (key === "6") {
      event.preventDefault();
      platformState.setWorkspaceFocusMode("execution_focus");
      showShortcutHint("Execution focus engaged.");
      return;
    }

    const shortcutAmountPresetByKey: Record<string, string> = {
      "7": AMOUNT_PRESETS[0],
      "8": AMOUNT_PRESETS[1],
      "9": AMOUNT_PRESETS[2],
      "0": AMOUNT_PRESETS[3],
    };
    const preset = shortcutAmountPresetByKey[key];

    if (preset) {
      event.preventDefault();
      platformState.setAmount(preset);
      showShortcutHint(`Ticket amount preset applied: $${preset}.`);
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function renderChartCard() {
    return (
      <ChartCard
        dict={dict}
        selectedAsset={platformState.selectedAsset}
        selectedTimeframe={platformState.selectedTimeframe}
        onSelectTimeframe={platformState.setSelectedTimeframe}
        candles={platformState.candles}
        decision={platformState.decision}
        chartType={platformState.workspacePreferences.chartType}
        onSelectChartType={(chartType) =>
          platformState.setWorkspacePreference("chartType", chartType)
        }
        activeIndicators={platformState.workspacePreferences.activeIndicators}
        onToggleIndicator={platformState.toggleWorkspaceIndicator}
        activeDrawingTool={platformState.workspacePreferences.activeDrawingTool}
        onSelectDrawingTool={(tool) =>
          platformState.setWorkspacePreference("activeDrawingTool", tool)
        }
        chartZoom={platformState.workspacePreferences.chartZoom}
        onSetChartZoom={(zoom) =>
          platformState.setWorkspacePreference("chartZoom", zoom)
        }
        onResetChart={platformState.resetChartWorkspace}
        intelligenceKicker={viewModel.intelligence.chartKicker}
        intelligenceHeadline={viewModel.intelligence.chartHeadline}
        intelligenceSummary={viewModel.intelligence.chartSummary}
        intelligenceNote={viewModel.intelligence.chartNote}
        marketDepthItems={marketDepthItems}
        marketDepthNote={`Feed ${feedStatus} / ${watchlistDensityLabel(
          watchlistDensity
        )} watchlist / ${focusModeLabel(focusMode)} composition.`}
        focusMode={focusMode}
        workspaceControls={workspaceFocusControls}
      />
    );
  }

  function renderExecutionCard() {
    return (
      <ExecutionCard
        dict={dict}
        decision={platformState.decision}
        signalLabel={viewModel.signalLabel}
        selectedAssetSymbol={platformState.selectedAsset.symbol}
        selectedTimeframe={platformState.selectedTimeframe}
        selectedDuration={platformState.selectedDuration}
        durationOptions={platformState.availableDurations}
        onSelectDuration={platformState.setSelectedDuration}
        analysisTimeframeLabel={viewModel.analysisTimeframeLabel}
        durationFieldLabel={viewModel.durationFieldLabel}
        amount={platformState.amount}
        setAmount={platformState.setAmount}
        sessionLocked={platformState.sessionLocked}
        canOpenMore={platformState.canOpenMore}
        canExecute={platformState.canExecute}
        accountMode={platformState.accountMode}
        openTradeBySignal={platformState.openTradeBySignal}
        openPaperTrade={platformState.openPaperTrade}
        demoLabel={viewModel.demoLabel}
        realLabel={viewModel.realLabel}
        accountLifecycleLabel={viewModel.accountLifecycleLabel}
        accountLifecycleTone={viewModel.accountLifecycleTone}
        reviewStatusLabel={viewModel.reviewStatusLabel}
        reviewStatusTone={viewModel.reviewStatusTone}
        ticketReadinessLabel={viewModel.ticketReadinessLabel}
        ticketReadinessValue={viewModel.ticketReadinessValue}
        ticketReadinessTone={viewModel.ticketReadinessTone}
        ticketGateLabel={viewModel.ticketGateLabel}
        ticketGateValue={viewModel.ticketGateValue}
        ticketGateTone={viewModel.ticketGateTone}
        ticketNextStepLabel={viewModel.ticketNextStepLabel}
        ticketNextStepValue={viewModel.ticketNextStepValue}
        ticketOperationalLabel={viewModel.ticketOperationalLabel}
        ticketOperationalValue={viewModel.ticketOperationalValue}
        ticketOperationalTone={viewModel.ticketOperationalTone}
        preflightItems={preflightItems}
        amountPresets={AMOUNT_PRESETS}
        onApplyAmountPreset={platformState.setAmount}
        recentActivityLabel="Recent desk activity"
        recentActivityValue={recentActivity}
        recentActivityNote="Activity reflects workspace controls, paper routing, and guarded execution only."
      />
    );
  }

  function renderLivingMarketCore() {
    return (
      <LivingMarketCore
        chartHeader={
          <TradingChartHeader
            assetChange={platformState.selectedAsset.change}
            assetPrice={platformState.selectedAsset.price}
            assetSymbol={platformState.selectedAsset.symbol}
            feedStatus={feedStatus}
            focusModeLabel={focusModeLabel(focusMode)}
            marketStatus={platformState.selectedAsset.status}
            paperAccess={`${viewModel.paperAccessLabel}: ${viewModel.paperAccessValue}`}
            selectedTimeframe={platformState.selectedTimeframe}
          />
        }
        chart={
          <TradingChartSurface>
            <TradingChartCanvas>{renderChartCard()}</TradingChartCanvas>
          </TradingChartSurface>
        }
        chartFooter={
          <TradingChartFooter
            fallbackTruth={fallbackTruth}
            shortcutHint={shortcutHint}
          />
        }
        executionRail={<ExecutionRail>{renderExecutionCard()}</ExecutionRail>}
        assistantDock={
          <WorkspaceAssistantDock
            focusMode={focusMode}
            shortcutHint={shortcutHint}
            watchlistDensity={watchlistDensity}
          />
        }
        journalCoachDock={
          <WorkspaceJournalCoachDock
            auditCount={platformState.auditTraceFoundation.recentEvents.length}
            historyCount={platformState.history.length}
            openTradesCount={platformState.openTrades.length}
            sessionPnLText={viewModel.sessionPnLText}
          />
        }
      />
    );
  }

  const activityShelf = (
    <section
      className="tpm-workspace-activity-shelf"
      aria-label="Workspace activity shelf"
      data-workspace-activity="secondary"
    >
      <details className="tpm-workspace-activity-panel">
        <summary>Open paper positions</summary>
        <ActivityOpenTradesPanel
          dict={dict}
          openTrades={platformState.openTrades}
          closePaperTrade={platformState.closePaperTrade}
        />
      </details>

      <details className="tpm-workspace-activity-panel">
        <summary>History</summary>
        <ActivityHistoryPanel dict={dict} history={platformState.history} />
      </details>

      <details className="tpm-workspace-activity-panel">
        <summary>{viewModel.auditTitle}</summary>
        <ActivityLogPanel
          title={viewModel.auditTitle}
          subtitle={viewModel.auditSubtitle}
          events={platformState.auditTraceFoundation.recentEvents}
          emptyLabel={viewModel.auditEmptyLabel}
        />
      </details>
    </section>
  );

  return (
    <main
      className="tpm-app-shell tpm-workspace-shell tpm-foundation-frame tpmv2-page"
      data-environment-surface="workspace"
      data-living-earth-surface="workstation"
      data-revelation-stage="first_3_minutes"
      data-shell-mode="workspace"
      data-visual-origin="pro-max-earth-financial"
      data-clean-zero-rebuild="true"
      data-workspace-architecture="clean-zero-workspace-header-market-summary-trading-core-docks"
      dir={dir}
      lang={locale}
    >
      <LivingEarthBackground surface="workstation" plan="free" state="paper_safe" />

      <TradingTopbar
        balance={platformState.balance}
        accountMode={platformState.accountMode}
        demoLabel={viewModel.demoLabel}
        diagnosticsHref={diagnosticsHref}
        diagnosticsLabel={dict.nav.diagnostics}
        locale={locale}
        marketStatus={platformState.selectedAsset.status}
        modeLabel={viewModel.modeLabel}
        paperAccessLabel={viewModel.paperAccessLabel}
        paperAccessTone={viewModel.paperAccessTone}
        paperAccessValue={viewModel.paperAccessValue}
        realLabel={viewModel.realLabel}
        selectedAssetChange={platformState.selectedAsset.change}
        selectedAssetPrice={platformState.selectedAsset.price}
        selectedAssetSymbol={platformState.selectedAsset.symbol}
        settingsHref={settingsHref}
        settingsLabel={dict.nav.settings}
      />

      <section className="tpm-workspace-shell-body">
        <section
          className="tpm-workspace-market-summary"
          aria-label="Workspace market summary"
          data-workspace-market-summary="true"
        >
          <div className="tpm-workspace-market-summary-head">
            <div className="tpm-workspace-market-summary-copy">
              <span>Pro Max Trading</span>
              <strong>Trading Workspace</strong>
              <p>
                Clean paper-safe workspace for chart reading, rehearsal, and calm
                review. Live routing, broker/feed activation, billing, and real money
                stay inactive.
              </p>
            </div>

            <div className="tpm-workspace-market-summary-stats">
              <div>
                <span>Symbol</span>
                <strong>{platformState.selectedAsset.symbol}</strong>
                <small>{platformState.selectedTimeframe}</small>
              </div>
              <div>
                <span>Price</span>
                <strong>{platformState.selectedAsset.price}</strong>
                <small className={platformState.selectedAsset.change.startsWith("-") ? "negative" : "positive"}>
                  {platformState.selectedAsset.change}
                </small>
              </div>
              <div>
                <span>Feed</span>
                <strong>{feedStatus}</strong>
                <small>{fallbackTruth}</small>
              </div>
              <div>
                <span>Mode</span>
                <strong>Paper-safe</strong>
                <small>{viewModel.ticketOperationalValue}</small>
              </div>
            </div>
          </div>

          <div className="tpm-workspace-market-summary-actions">
            <div className="tpm-workspace-truth-row" aria-label="Workspace truth">
              <span>Paper-safe active</span>
              <span>Live inactive</span>
              <span>Broker/feed inactive</span>
              <span>Billing inactive</span>
              <span>Real money blocked</span>
            </div>
          </div>

          <div className="tpm-workspace-asset-pills" role="tablist" aria-label="Market watchlist">
            {platformState.marketAssets.map((asset, index) => (
              <button
                key={asset.symbol}
                type="button"
                className={index === platformState.selectedAssetIndex ? "active" : ""}
                aria-pressed={index === platformState.selectedAssetIndex}
                onClick={() => platformState.setSelectedAssetIndex(index)}
              >
                <strong>{asset.symbol}</strong>
                <span>{asset.price}</span>
                <small className={asset.change.startsWith("-") ? "negative" : "positive"}>
                  {asset.change}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="tpmv2-shell-desktop">
          <section className="tpmv2-main tpm-living-workspace-main">
            <section
              className={[
                "tpmv2-desktop-master",
                workspaceFocusClassName(focusMode),
              ].join(" ")}
            >
              <section className="tpmv2-primary tpm-living-primary">
                {renderLivingMarketCore()}
              </section>
            </section>

            {activityShelf}
          </section>
        </section>
      </section>

      <CompanionLauncher
        diagnosticsHref={diagnosticsHref}
        feedbackHref={feedbackHref}
        locale={locale}
        settingsHref={settingsHref}
      />
    </main>
  );
}
