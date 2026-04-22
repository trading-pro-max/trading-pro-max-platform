"use client";

import { useState } from "react";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
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
} from "./PlatformShellV2";
import { createTradingWorkstationViewModel } from "./trading-workstation-view-model";

export default function TradingWorkstation({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const [desktopWatchlistVisible, setDesktopWatchlistVisible] = useState(false);
  const [desktopTicketVisible, setDesktopTicketVisible] = useState(true);
  const [desktopBlotterExpanded, setDesktopBlotterExpanded] = useState(false);
  const platformState = usePlatformState(locale, dict.decision.reasons);
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
    decision: platformState.decision,
    riskNoteCode: platformState.riskNoteCode,
    sessionPnL: platformState.sessionPnL,
    sessionLocked: platformState.sessionLocked,
    openTradesCount: platformState.openTrades.length,
  });

  const executionNote = viewModel.ticketSupportNote;
  const localePrefix = locale ? `/${locale}` : "";
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
        onClick={() => setDesktopWatchlistVisible((current) => !current)}
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
        onClick={() => setDesktopTicketVisible((current) => !current)}
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
        onClick={() => setDesktopBlotterExpanded((current) => !current)}
      >
        {dict.journal.historyTitle}
      </button>
    </div>
  );

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
            selectedAssetIndex={platformState.selectedAssetIndex}
            onSelectAsset={platformState.setSelectedAssetIndex}
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
            diagnosticsHref={`${localePrefix}/diagnostics`}
            diagnosticsLabel={dict.nav.diagnostics}
            settingsHref={`${localePrefix}/settings`}
            settingsLabel={dict.nav.settings}
          />

          <section
            className={
              desktopTicketVisible
                ? "tpmv2-desktop-master"
                : "tpmv2-desktop-master tpmv2-desktop-master-ticket-hidden"
            }
          >
            <section className="tpmv2-primary">
              <ChartCard
                dict={dict}
                selectedAsset={platformState.selectedAsset}
                selectedTimeframe={platformState.selectedTimeframe}
                onSelectTimeframe={platformState.setSelectedTimeframe}
                candles={platformState.candles}
                decision={platformState.decision}
                signalLabel={viewModel.signalLabel}
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
                  note={executionNote}
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
                />
              </aside>
            ) : null}
          </section>

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

              <button
                type="button"
                className={
                  desktopBlotterExpanded
                    ? "tpmv2-blotter-toggle active"
                    : "tpmv2-blotter-toggle"
                }
                aria-expanded={desktopBlotterExpanded}
                onClick={() => setDesktopBlotterExpanded((current) => !current)}
              >
                {dict.journal.historyTitle}
              </button>
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
          diagnosticsHref={`${localePrefix}/diagnostics`}
          diagnosticsLabel={dict.nav.diagnostics}
          settingsHref={`${localePrefix}/settings`}
          settingsLabel={dict.nav.settings}
        />

        <NarrowStrip
          dict={dict}
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
          signalLabel={viewModel.signalLabel}
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
          note={executionNote}
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
