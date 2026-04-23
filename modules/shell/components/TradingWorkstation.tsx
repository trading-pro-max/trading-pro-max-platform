"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
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

function WorkspaceDepthBar({
  focusMode,
  onSelectFocusMode,
  watchlistDensity,
  onSelectWatchlistDensity,
  shortcutHint,
}: {
  focusMode: WorkspaceFocusMode;
  onSelectFocusMode: (mode: WorkspaceFocusMode) => void;
  watchlistDensity: WatchlistDensityMode;
  onSelectWatchlistDensity: (density: WatchlistDensityMode) => void;
  shortcutHint: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-workspace-depth-bar" aria-label="Workspace depth">
      <div className="tpmv2-workspace-depth-block">
        <span>Workspace depth</span>
        <div className="tpmv2-workspace-depth-buttons" role="toolbar" aria-label="Workstation focus">
          {(["balanced", "chart_focus", "execution_focus"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={focusMode === mode ? "active" : ""}
              aria-pressed={focusMode === mode}
              onClick={() => onSelectFocusMode(mode)}
            >
              {focusModeLabel(mode)}
            </button>
          ))}
        </div>
      </div>

      <div className="tpmv2-workspace-depth-block">
        <span>Market surface</span>
        <div className="tpmv2-workspace-depth-buttons" role="toolbar" aria-label="Watchlist density">
          {(["standard", "dense"] as const).map((density) => (
            <button
              key={density}
              type="button"
              className={watchlistDensity === density ? "active" : ""}
              aria-pressed={watchlistDensity === density}
              onClick={() => onSelectWatchlistDensity(density)}
            >
              {watchlistDensityLabel(density)}
            </button>
          ))}
        </div>
      </div>

      <div className="tpmv2-workspace-depth-status">
        <span>Shortcut layer</span>
        <strong>Layout-only</strong>
        <small>Shift+1 watchlist, Shift+2 ticket, Shift+3 blotter, Shift+4/5/6 focus.</small>
      </div>

      <div className="tpmv2-workspace-depth-status tpmv2-workspace-depth-status-live">
        <span>Operator feedback</span>
        <strong>{shortcutHint}</strong>
        <small>No order-entry hotkeys are armed.</small>
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
  const localePrefix = locale ? `/${locale}` : "";
  const diagnosticsHref = `${localePrefix}/diagnostics`;
  const settingsHref = `${localePrefix}/settings`;
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
        label: "Session",
        value: viewModel.sessionStateLabel,
        tone: platformState.sessionLocked ? ("blocked" as const) : viewModel.ticketReadinessTone,
      },
      {
        label: "Ticket gate",
        value: viewModel.ticketGateValue,
        tone: viewModel.ticketGateTone,
      },
      {
        label: "Shortcut truth",
        value: "Layout-only",
        note: "Execution stays click-confirmed.",
      },
    ],
    [
      platformState.accountMode,
      platformState.sessionLocked,
      viewModel.sessionStateLabel,
      viewModel.ticketGateTone,
      viewModel.ticketGateValue,
      viewModel.ticketReadinessTone,
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
    <main className="tpmv2-page">
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
          <TradingTopbar
            dict={dict}
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

          <OperatorIntelligenceDeck intelligence={viewModel.intelligence} />

          <WorkspaceDepthBar
            focusMode={focusMode}
            onSelectFocusMode={(nextMode) => {
              platformState.setWorkspaceFocusMode(nextMode);
              showShortcutHint(`${focusModeLabel(nextMode)} workspace focus engaged.`);
            }}
            watchlistDensity={watchlistDensity}
            onSelectWatchlistDensity={(nextDensity) => {
              platformState.setWatchlistDensity(nextDensity);
              showShortcutHint(`${watchlistDensityLabel(nextDensity)} watchlist density engaged.`);
            }}
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
        </section>
      </section>

      <section className="tpmv2-shell-narrow">
        <TradingTopbar
          dict={dict}
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
        />

        <NarrowStrip
          dict={dict}
          assets={platformState.marketAssets}
          selectedAssetIndex={platformState.selectedAssetIndex}
          onSelectAsset={platformState.setSelectedAssetIndex}
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

        <OperatorIntelligenceDeck intelligence={viewModel.intelligence} />

        <WorkspaceDepthBar
          focusMode={focusMode}
          onSelectFocusMode={(nextMode) => {
            platformState.setWorkspaceFocusMode(nextMode);
            showShortcutHint(`${focusModeLabel(nextMode)} workspace focus engaged.`);
          }}
          watchlistDensity={watchlistDensity}
          onSelectWatchlistDensity={(nextDensity) => {
            platformState.setWatchlistDensity(nextDensity);
            showShortcutHint(`${watchlistDensityLabel(nextDensity)} watchlist density engaged.`);
          }}
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
      </section>
    </main>
  );
}
