"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { PLATFORM_LIMITS } from "../../../lib/constants/platform";
import { getDirection } from "../../../lib/i18n/config";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import LivingEarthBackground from "../../brand/components/LivingEarthBackground";
import { CompanionLauncher } from "../../companion/components";
import OperatorIntelligenceDeck from "../../intelligence/components/OperatorIntelligenceDeck";
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
  DesktopRail,
  ExecutionCard,
  NarrowStrip,
  TradingTopbar,
  WorkstationCommandCenter,
} from "./PlatformShellV2";
import { createTradingWorkstationViewModel } from "./trading-workstation-view-model";

function focusModeLabel(mode: WorkspaceFocusMode) {
  if (mode === "chart_focus") return "Chart focus";
  if (mode === "execution_focus") return "Execution focus";
  return "Balanced";
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

function WorkspaceDepthBar({
  focusMode,
  watchlistDensity,
  shortcutHint,
}: {
  focusMode: WorkspaceFocusMode;
  watchlistDensity: WatchlistDensityMode;
  shortcutHint: string;
}) {
  const assistantIntents = [
    "Start",
    "Why blocked?",
    "Bigger chart",
    "Calmer",
    "Plans",
    "Journal",
    "Support",
  ];

  return (
    <section
      className="tpmv2-card tpmv2-workspace-depth-bar tpmv2-workspace-depth-bar-compact tpm-intent-workspace-rail"
      aria-label="Workspace controls"
    >
      <div className="tpmv2-workspace-depth-block">
        <span>Workspace focus</span>
        <strong>{focusModeLabel(focusMode)}</strong>
        <small>Ask Pro Max Assistant for Chart Comfort, a calmer workspace, or Start guidance.</small>
      </div>

      <div className="tpmv2-workspace-depth-block">
        <span>Watchlist</span>
        <strong>{watchlistDensityLabel(watchlistDensity)}</strong>
        <small>Secondary density controls stay in Settings, Journal/Coach, and Assistant guidance.</small>
      </div>

      <div className="tpmv2-workspace-depth-status tpm-intent-assistant-card">
        <span>Paper-safe controls</span>
        <strong>Layout-only</strong>
        <small>{shortcutHint} No order-entry hotkeys are armed.</small>
        <div className="tpm-intent-chip-row" aria-label="Assistant workspace intents">
          {assistantIntents.map((intent) => (
            <span key={intent} className="tpm-intent-chip">
              {intent}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TradingWorkstation({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const platformState = usePlatformState(locale, dict.decision.reasons);
  const {
    watchlistVisible: desktopWatchlistVisible,
    ticketVisible: desktopTicketVisible,
    blotterExpanded: desktopBlotterExpanded,
  } = platformState.workspacePreferences;
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

  const [shortcutHint, setShortcutHint] = useState(
    "Workspace depth layer active."
  );
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
  const marketDepthItems = useMemo(
    () => [
      {
        label: "Asset class",
        value: platformState.selectedAsset.assetClass.toUpperCase(),
      },
      {
        label: "Feed state",
        value: humanizeState(platformState.dataStateFoundation.marketFeedState),
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
      workflowPreflight.note,
      workflowPreflight.tone,
      workflowPreflight.value,
      viewModel.ticketReadinessLabel,
      viewModel.ticketReadinessValue,
      viewModel.sessionPnLText,
      viewModel.sessionStateLabel,
      viewModel.ticketGateTone,
      viewModel.ticketGateValue,
    ]
  );
  const recentActivity =
    platformState.auditTraceFoundation.recentEvents[0]?.message ??
    "Workspace state is standing by for the next operator action.";
  const amountPresets = ["50", "100", "250", "500"] as const;
  const showShortcutHint = (message: string) => {
    setShortcutHint(message);
  };

  useEffect(() => {
    if (!shortcutHint) return undefined;

    const timeout = window.setTimeout(() => {
      setShortcutHint("Workspace depth layer active.");
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

    if (key === "1") {
      event.preventDefault();
      platformState.toggleWorkspacePanel("watchlistVisible");
      showShortcutHint(
        `Watchlist ${desktopWatchlistVisible ? "collapsed" : "opened"} from keyboard.`
      );
      return;
    }

    if (key === "2") {
      event.preventDefault();
      platformState.toggleWorkspacePanel("ticketVisible");
      showShortcutHint(
        `Execution ticket ${desktopTicketVisible ? "collapsed" : "opened"} from keyboard.`
      );
      return;
    }

    if (key === "3") {
      event.preventDefault();
      platformState.toggleWorkspacePanel("blotterExpanded");
      showShortcutHint(
        `Blotter ${desktopBlotterExpanded ? "collapsed" : "expanded"} from keyboard.`
      );
      return;
    }

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
      "7": amountPresets[0],
      "8": amountPresets[1],
      "9": amountPresets[2],
      "0": amountPresets[3],
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

  const workspaceControls = (
    <div className="tpmv2-workspace-controls" role="toolbar" aria-label={dict.chart.title}>
      <button
        type="button"
        className={
          desktopWatchlistVisible
            ? "tpmv2-workspace-toggle active"
            : "tpmv2-workspace-toggle"
        }
        aria-pressed={desktopWatchlistVisible}
        aria-keyshortcuts="Shift+1"
        onClick={() => platformState.toggleWorkspacePanel("watchlistVisible")}
      >
        {dict.market.title}
      </button>

      <button
        type="button"
        className={
          desktopTicketVisible
            ? "tpmv2-workspace-toggle active"
            : "tpmv2-workspace-toggle"
        }
        aria-pressed={desktopTicketVisible}
        aria-keyshortcuts="Shift+2"
        onClick={() => platformState.toggleWorkspacePanel("ticketVisible")}
      >
        {dict.trade.title}
      </button>

      <button
        type="button"
        className={
          desktopBlotterExpanded
            ? "tpmv2-workspace-toggle active"
            : "tpmv2-workspace-toggle"
        }
        aria-pressed={desktopBlotterExpanded}
        aria-keyshortcuts="Shift+3"
        onClick={() => platformState.toggleWorkspacePanel("blotterExpanded")}
      >
        {dict.journal.historyTitle}
      </button>
    </div>
  );
  const desktopMasterClass = [
    "tpmv2-desktop-master",
    !desktopTicketVisible ? "tpmv2-desktop-master-ticket-hidden" : "",
    focusMode === "chart_focus"
      ? "tpmv2-desktop-master-focus-chart"
      : focusMode === "execution_focus"
      ? "tpmv2-desktop-master-focus-execution"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main
      className="tpm-app-shell tpm-workspace-shell tpm-foundation-frame tpmv2-page"
      data-environment-surface="workspace"
      data-living-earth-surface="workstation"
      data-revelation-stage="first_3_minutes"
      data-shell-mode="workspace"
      dir={dir}
      lang={locale}
    >
      <LivingEarthBackground surface="workstation" plan="free" state="paper_safe" />

      <TradingTopbar
        balance={platformState.balance}
        accountMode={platformState.accountMode}
        onModeChange={platformState.switchAccountMode}
        modeLabel={viewModel.modeLabel}
        demoLabel={viewModel.demoLabel}
        realLabel={viewModel.realLabel}
        selectedAssetSymbol={platformState.selectedAsset.symbol}
        selectedAssetPrice={platformState.selectedAsset.price}
        selectedAssetChange={platformState.selectedAsset.change}
        marketStatus={platformState.selectedAsset.status}
        paperAccessLabel={viewModel.paperAccessLabel}
        paperAccessValue={viewModel.paperAccessValue}
        paperAccessTone={viewModel.paperAccessTone}
        diagnosticsHref={diagnosticsHref}
        diagnosticsLabel={dict.nav.diagnostics}
        settingsHref={settingsHref}
        settingsLabel={dict.nav.settings}
        locale={locale}
      />

      <section
        className={
          desktopWatchlistVisible
            ? "tpmv2-shell-desktop"
            : "tpmv2-shell-desktop tpmv2-shell-desktop-watchlist-hidden"
        }
      >
        {desktopWatchlistVisible ? (
          <DesktopRail
            dict={dict}
            assets={platformState.marketAssets}
            selectedAssetIndex={platformState.selectedAssetIndex}
            onSelectAsset={platformState.setSelectedAssetIndex}
            selectedAsset={platformState.selectedAsset}
            watchlistDensity={watchlistDensity}
            focusMode={focusMode}
            feedState={platformState.dataStateFoundation.marketFeedState}
            lastUpdatedAt={platformState.dataStateFoundation.lastUpdatedAt}
          />
        ) : null}

        <section className="tpmv2-main">
          <section className={desktopMasterClass}>
            <section className="tpmv2-primary">
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
                marketDepthNote={`Feed ${humanizeState(
                  platformState.dataStateFoundation.marketFeedState
                )} / ${watchlistDensityLabel(watchlistDensity)} watchlist / ${focusModeLabel(
                  focusMode
                )} composition.`}
                focusMode={focusMode}
                workspaceControls={workspaceControls}
              />
            </section>

            {desktopTicketVisible ? (
              <aside className="tpmv2-side">
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
                  amountPresets={amountPresets}
                  onApplyAmountPreset={platformState.setAmount}
                  recentActivityLabel="Recent desk activity"
                  recentActivityValue={recentActivity}
                  recentActivityNote="Activity reflects workspace controls, paper routing, and guarded execution only."
                />
              </aside>
            ) : null}
          </section>

          <WorkstationCommandCenter
            dict={dict}
            selectedAssetSymbol={platformState.selectedAsset.symbol}
            selectedTimeframe={platformState.selectedTimeframe}
            signalLabel={viewModel.signalLabel}
            decision={platformState.decision}
            openTradesCount={platformState.openTrades.length}
            historyCount={platformState.history.length}
            sessionPnLText={viewModel.sessionPnLText}
            ticketReadinessLabel={viewModel.ticketReadinessLabel}
            ticketReadinessValue={viewModel.ticketReadinessValue}
            ticketReadinessTone={viewModel.ticketReadinessTone}
            paperAccessLabel={viewModel.paperAccessLabel}
            paperAccessValue={viewModel.paperAccessValue}
            paperAccessTone={viewModel.paperAccessTone}
          />

          <WorkspaceDepthBar
            focusMode={focusMode}
            watchlistDensity={watchlistDensity}
            shortcutHint={shortcutHint}
          />

          <section
            className={
              desktopBlotterExpanded
                ? "tpmv2-card tpmv2-blotter expanded"
                : "tpmv2-card tpmv2-blotter collapsed"
            }
          >
            <div className="tpmv2-blotter-bar">
              <div className="tpmv2-blotter-summary">
                <div className="tpmv2-blotter-stat">
                  <span>{dict.journal.openTradesTitle}</span>
                  <strong>{platformState.openTrades.length}</strong>
                </div>

                <div className="tpmv2-blotter-stat">
                  <span>{dict.journal.historyTitle}</span>
                  <strong>{platformState.history.length}</strong>
                </div>

                <div className="tpmv2-blotter-stat">
                  <span>{viewModel.auditTitle}</span>
                  <strong>{platformState.auditTraceFoundation.recentEvents.length}</strong>
                </div>
              </div>

              <div className="tpmv2-blotter-actions">
                <span>{desktopBlotterExpanded ? dict.common.enabled : dict.common.closed}</span>
                <button
                  type="button"
                  className={
                    desktopBlotterExpanded
                      ? "tpmv2-blotter-toggle active"
                      : "tpmv2-blotter-toggle"
                  }
                  aria-expanded={desktopBlotterExpanded}
                  onClick={() => platformState.toggleWorkspacePanel("blotterExpanded")}
                >
                  {dict.journal.historyTitle}
                </button>
              </div>
            </div>

            {desktopBlotterExpanded ? (
              <div className="tpmv2-blotter-grid">
                <ActivityOpenTradesPanel
                  dict={dict}
                  openTrades={platformState.openTrades}
                  closePaperTrade={platformState.closePaperTrade}
                />

                <ActivityHistoryPanel dict={dict} history={platformState.history} />

                <ActivityLogPanel
                  title={viewModel.auditTitle}
                  subtitle={viewModel.auditSubtitle}
                  events={platformState.auditTraceFoundation.recentEvents}
                  emptyLabel={viewModel.auditEmptyLabel}
                />
              </div>
            ) : null}
          </section>

          <OperatorIntelligenceDeck intelligence={viewModel.intelligence} />
        </section>
      </section>

      <section className="tpmv2-shell-narrow">
        <NarrowStrip
          dict={dict}
          assets={platformState.marketAssets}
          selectedAssetIndex={platformState.selectedAssetIndex}
          onSelectAsset={platformState.setSelectedAssetIndex}
        />

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
          marketDepthNote={`Feed ${humanizeState(
            platformState.dataStateFoundation.marketFeedState
          )} / ${watchlistDensityLabel(watchlistDensity)} watchlist / ${focusModeLabel(
            focusMode
          )} composition.`}
          focusMode={focusMode}
        />

        <WorkstationCommandCenter
          dict={dict}
          selectedAssetSymbol={platformState.selectedAsset.symbol}
          selectedTimeframe={platformState.selectedTimeframe}
          signalLabel={viewModel.signalLabel}
          decision={platformState.decision}
          openTradesCount={platformState.openTrades.length}
          historyCount={platformState.history.length}
          sessionPnLText={viewModel.sessionPnLText}
          ticketReadinessLabel={viewModel.ticketReadinessLabel}
          ticketReadinessValue={viewModel.ticketReadinessValue}
          ticketReadinessTone={viewModel.ticketReadinessTone}
          paperAccessLabel={viewModel.paperAccessLabel}
          paperAccessValue={viewModel.paperAccessValue}
          paperAccessTone={viewModel.paperAccessTone}
        />

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
          amountPresets={amountPresets}
          onApplyAmountPreset={platformState.setAmount}
          recentActivityLabel="Recent desk activity"
          recentActivityValue={recentActivity}
          recentActivityNote="Activity reflects workspace controls, paper routing, and guarded execution only."
        />

        <WorkspaceDepthBar
          focusMode={focusMode}
          watchlistDensity={watchlistDensity}
          shortcutHint={shortcutHint}
        />

        <ActivityOpenTradesPanel
          dict={dict}
          openTrades={platformState.openTrades}
          closePaperTrade={platformState.closePaperTrade}
        />

        <ActivityHistoryPanel dict={dict} history={platformState.history} />

        <ActivityLogPanel
          title={viewModel.auditTitle}
          subtitle={viewModel.auditSubtitle}
          events={platformState.auditTraceFoundation.recentEvents}
          emptyLabel={viewModel.auditEmptyLabel}
        />

        <OperatorIntelligenceDeck intelligence={viewModel.intelligence} />
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
