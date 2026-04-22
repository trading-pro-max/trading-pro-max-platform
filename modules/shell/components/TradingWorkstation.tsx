"use client";

import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import { usePlatformState } from "../hooks/use-platform-state";
import {
  ActivityHistoryPanel,
  ActivityOpenTradesPanel,
  AuditTracePanel,
  ChartCard,
  DesktopRail,
  ExecutionCard,
  NarrowStrip,
  RiskCardGrid,
  SecondarySurfacePanel,
  SecurityFoundationPanel,
  SummaryCard,
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
  const platformState = usePlatformState(locale, dict.decision.reasons);
  const viewModel = createTradingWorkstationViewModel({
    locale,
    dict,
    userIdentity: platformState.userIdentity,
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

  const executionNote =
    platformState.accountMode === "real"
      ? viewModel.realReadinessNote
      : viewModel.riskNote ||
        viewModel.dataStateOperatorNote ||
        viewModel.riskOperatorNote;

  const complianceChips = [
    ...viewModel.jurisdictionChips,
    ...viewModel.permissionChips,
  ];

  const executionFoundationChips = [
    `${viewModel.executionRouteLabel}: ${viewModel.executionRouteValue}`,
    ...viewModel.executionGuardrailChips,
  ];

  return (
    <main className="tpmv2-page">
      <section className="tpmv2-shell-desktop">
        <DesktopRail
          dict={dict}
          selectedAssetIndex={platformState.selectedAssetIndex}
          onSelectAsset={platformState.setSelectedAssetIndex}
        />

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
            signalLabel={viewModel.signalLabel}
            sessionStateLabel={viewModel.sessionStateLabel}
            accountStatusValue={viewModel.accountStatusValue}
          />

          <section className="tpmv2-desktop-master">
            <section className="tpmv2-primary">
              <SummaryCard
                dict={dict}
                symbol={platformState.selectedAsset.symbol}
                price={platformState.selectedAsset.price}
                change={platformState.selectedAsset.change}
                signalLabel={viewModel.signalLabel}
                signalStyle={viewModel.signalStyle}
                marketStatus={platformState.selectedAsset.status}
                timeframe={platformState.selectedTimeframe}
                confidence={platformState.decision.confidence}
              />

              <ChartCard
                dict={dict}
                selectedAsset={platformState.selectedAsset}
                selectedTimeframe={platformState.selectedTimeframe}
                onSelectTimeframe={platformState.setSelectedTimeframe}
                candles={platformState.candles}
              />

              <RiskCardGrid
                dict={dict}
                openTradesText={viewModel.openTradesText}
                sessionPnLText={viewModel.sessionPnLText}
                sessionPnLPositive={viewModel.sessionPnLPositive}
                lossCount={platformState.lossCount}
                sessionStateLabel={viewModel.sessionStateLabel}
                sessionLocked={platformState.sessionLocked}
              />
            </section>

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
              />
            </aside>
          </section>

          <section className="tpmv2-activity">
            <ActivityOpenTradesPanel
              dict={dict}
              openTrades={platformState.openTrades}
              closePaperTrade={platformState.closePaperTrade}
            />

            <ActivityHistoryPanel dict={dict} history={platformState.history} />

            <SecondarySurfacePanel
              title={viewModel.policyPanelLabel}
              subtitle={`${viewModel.accountStatusLabel}: ${viewModel.accountStatusValue}`}
              badge={viewModel.verificationLabel}
              chips={complianceChips}
            />

            <SecondarySurfacePanel
              title={viewModel.executionFoundationLabel}
              subtitle={`${viewModel.executionIntentLabel}: ${viewModel.executionIntentValue}`}
              chips={executionFoundationChips}
            />

            <SecondarySurfacePanel
              title={viewModel.riskFoundationLabel}
              subtitle={viewModel.riskOperatorNote}
              chips={viewModel.riskFoundationChips}
            />

            <SecondarySurfacePanel
              title={viewModel.dataStateFoundationLabel}
              subtitle={viewModel.dataStateOperatorNote}
              chips={viewModel.dataStateFoundationChips}
            />

            <AuditTracePanel
              title={viewModel.auditTitle}
              subtitle={viewModel.auditSubtitle}
              actorLabel={viewModel.auditActorLabel}
              actorValue={platformState.auditTraceFoundation.currentActor}
              accountModeLabel={viewModel.auditAccountModeLabel}
              accountModeValue={viewModel.auditAccountModeValue}
              visibilityLabel={viewModel.auditVisibilityLabel}
              visibilityValue={viewModel.auditVisibilityValue}
              traceLabel={viewModel.auditTraceLabel}
              traceValue={viewModel.auditTraceValue}
              lastEventLabel={viewModel.auditLastEventLabel}
              lastEventValue={platformState.auditTraceFoundation.lastEventAt}
              events={platformState.auditTraceFoundation.recentEvents}
              emptyLabel={viewModel.auditEmptyLabel}
            />

            <SecurityFoundationPanel
              title={viewModel.securityTitle}
              subtitle={viewModel.securitySubtitle}
              routeLabel={viewModel.securityRouteLabel}
              routeValue={viewModel.securityRouteValue}
              accessLabel={viewModel.securityAccessLabel}
              accessValue={viewModel.securityAccessValue}
              executionLabel={viewModel.securityExecutionLabel}
              executionValue={viewModel.securityExecutionValue}
              dataProtectionLabel={viewModel.securityDataLabel}
              dataProtectionValue={viewModel.securityDataValue}
              secretsLabel={viewModel.securitySecretsLabel}
              secretsValue={viewModel.securitySecretsValue}
              sessionLabel={viewModel.securitySessionLabel}
              sessionValue={viewModel.securitySessionValue}
              recoveryLabel={viewModel.securityRecoveryLabel}
              recoveryValue={viewModel.securityRecoveryValue}
              alertLabel={viewModel.securityAlertLabel}
              alertValue={viewModel.securityAlertValue}
              accountModeLabel={viewModel.securityAccountLabel}
              accountModeValue={viewModel.securityAccountValue}
              reviewedAtLabel={viewModel.securityReviewedAtLabel}
              reviewedAtValue={platformState.securityFoundation.lastReviewedAt}
            />
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
          signalLabel={viewModel.signalLabel}
          sessionStateLabel={viewModel.sessionStateLabel}
          accountStatusValue={viewModel.accountStatusValue}
        />

        <NarrowStrip
          dict={dict}
          selectedAssetIndex={platformState.selectedAssetIndex}
          onSelectAsset={platformState.setSelectedAssetIndex}
        />

        <SummaryCard
          dict={dict}
          symbol={platformState.selectedAsset.symbol}
          price={platformState.selectedAsset.price}
          change={platformState.selectedAsset.change}
          signalLabel={viewModel.signalLabel}
          signalStyle={viewModel.signalStyle}
          marketStatus={platformState.selectedAsset.status}
          timeframe={platformState.selectedTimeframe}
          confidence={platformState.decision.confidence}
        />

        <ChartCard
          dict={dict}
          selectedAsset={platformState.selectedAsset}
          selectedTimeframe={platformState.selectedTimeframe}
          onSelectTimeframe={platformState.setSelectedTimeframe}
          candles={platformState.candles}
        />

        <RiskCardGrid
          dict={dict}
          openTradesText={viewModel.openTradesText}
          sessionPnLText={viewModel.sessionPnLText}
          sessionPnLPositive={viewModel.sessionPnLPositive}
          lossCount={platformState.lossCount}
          sessionStateLabel={viewModel.sessionStateLabel}
          sessionLocked={platformState.sessionLocked}
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
        />

        <ActivityOpenTradesPanel
          dict={dict}
          openTrades={platformState.openTrades}
          closePaperTrade={platformState.closePaperTrade}
        />

        <ActivityHistoryPanel dict={dict} history={platformState.history} />

        <SecondarySurfacePanel
          title={viewModel.policyPanelLabel}
          subtitle={`${viewModel.accountStatusLabel}: ${viewModel.accountStatusValue}`}
          badge={viewModel.verificationLabel}
          chips={complianceChips}
        />

        <SecondarySurfacePanel
          title={viewModel.executionFoundationLabel}
          subtitle={`${viewModel.executionIntentLabel}: ${viewModel.executionIntentValue}`}
          chips={executionFoundationChips}
        />

        <SecondarySurfacePanel
          title={viewModel.riskFoundationLabel}
          subtitle={viewModel.riskOperatorNote}
          chips={viewModel.riskFoundationChips}
        />

        <SecondarySurfacePanel
          title={viewModel.dataStateFoundationLabel}
          subtitle={viewModel.dataStateOperatorNote}
          chips={viewModel.dataStateFoundationChips}
        />

        <AuditTracePanel
          title={viewModel.auditTitle}
          subtitle={viewModel.auditSubtitle}
          actorLabel={viewModel.auditActorLabel}
          actorValue={platformState.auditTraceFoundation.currentActor}
          accountModeLabel={viewModel.auditAccountModeLabel}
          accountModeValue={viewModel.auditAccountModeValue}
          visibilityLabel={viewModel.auditVisibilityLabel}
          visibilityValue={viewModel.auditVisibilityValue}
          traceLabel={viewModel.auditTraceLabel}
          traceValue={viewModel.auditTraceValue}
          lastEventLabel={viewModel.auditLastEventLabel}
          lastEventValue={platformState.auditTraceFoundation.lastEventAt}
          events={platformState.auditTraceFoundation.recentEvents}
          emptyLabel={viewModel.auditEmptyLabel}
        />

        <SecurityFoundationPanel
          title={viewModel.securityTitle}
          subtitle={viewModel.securitySubtitle}
          routeLabel={viewModel.securityRouteLabel}
          routeValue={viewModel.securityRouteValue}
          accessLabel={viewModel.securityAccessLabel}
          accessValue={viewModel.securityAccessValue}
          executionLabel={viewModel.securityExecutionLabel}
          executionValue={viewModel.securityExecutionValue}
          dataProtectionLabel={viewModel.securityDataLabel}
          dataProtectionValue={viewModel.securityDataValue}
          secretsLabel={viewModel.securitySecretsLabel}
          secretsValue={viewModel.securitySecretsValue}
          sessionLabel={viewModel.securitySessionLabel}
          sessionValue={viewModel.securitySessionValue}
          recoveryLabel={viewModel.securityRecoveryLabel}
          recoveryValue={viewModel.securityRecoveryValue}
          alertLabel={viewModel.securityAlertLabel}
          alertValue={viewModel.securityAlertValue}
          accountModeLabel={viewModel.securityAccountLabel}
          accountModeValue={viewModel.securityAccountValue}
          reviewedAtLabel={viewModel.securityReviewedAtLabel}
          reviewedAtValue={platformState.securityFoundation.lastReviewedAt}
        />
      </section>
    </main>
  );
}
