"use client";

import { PLATFORM_LIMITS } from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import { usePlatformState } from "../hooks/use-platform-state";
import {
  formatSessionPnl,
  getRiskNote,
  getSessionStateLabel,
  getSignalTone,
} from "../../../lib/utils/workstation-view";
import {
  ActivityHistoryPanel,
  ActivityOpenTradesPanel,
  AuditTracePanel,
  ChartCard,
  DesktopRail,
  ExecutionCard,
  NarrowStrip,
  RiskCardGrid,
  SecurityFoundationPanel,
  SummaryCard,
  TradingTopbar,
} from "./PlatformShellV2";
import {
  executionGuardrailLabel,
  getAuditPanelCopy,
  getCoreModeCopy,
  getSecurityPanelCopy,
  onboardingStageLabel,
  permissionLabel,
  preferenceLabel,
  securityAccessValue as resolveSecurityAccessValue,
  securityAlertValue as resolveSecurityAlertValue,
  securityDataValue as resolveSecurityDataValue,
  securityExecutionValue as resolveSecurityExecutionValue,
  securityRecoveryValue as resolveSecurityRecoveryValue,
  securityRouteValue as resolveSecurityRouteValue,
  securitySecretsValue as resolveSecuritySecretsValue,
  securitySessionValue as resolveSecuritySessionValue,
  verificationWorkflowLabel,
} from "./trading-workstation-labels";

export default function TradingWorkstation({
  locale,
  dict,
}: {
  locale: string;
  dict: Dictionary;
}) {
  const {
    userIdentity,
    accountMode,
    accountStatus,
    accountPolicy,
    executionFoundation,
    riskFoundation,
    dataStateFoundation,
    auditTraceFoundation,
    securityFoundation,
    switchAccountMode,
    balance,
    availableDurations,
    selectedAssetIndex,
    setSelectedAssetIndex,
    selectedTimeframe,
    setSelectedTimeframe,
    selectedDuration,
    setSelectedDuration,
    amount,
    setAmount,
    openTrades,
    history,
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
  } = usePlatformState(locale, dict.decision.reasons);

  const {
    modeLabel,
    demoLabel,
    realLabel,
    analysisTimeframeLabel,
    durationFieldLabel,
    accountStatusLabel,
    profileLabel,
    settingsLabel,
    signOutLabel,
    policyPanelLabel,
    userRole,
  } = getCoreModeCopy(locale);

  const signalStyle = getSignalTone(decision.signal);
  const riskNote = getRiskNote(riskNoteCode, dict);
  const signalLabel = dict.decision.signals[decision.signal];
  const sessionStateLabel = getSessionStateLabel(sessionLocked, dict);
  const sessionPnLText = formatSessionPnl(sessionPnL);

  const accountStatusValue =
    accountStatus === "active"
      ? locale === "ar"
        ? "نشط"
        : "Active"
      : locale === "ar"
      ? "قراءة فقط"
      : "Read-only";

  const verificationLabel =
    userIdentity.verification === "verified"
      ? locale === "ar"
        ? "موثق"
        : "Verified"
      : userIdentity.verification === "review"
      ? locale === "ar"
        ? "قيد المراجعة"
        : "Under review"
      : locale === "ar"
      ? "غير موثق"
      : "Unverified";

  const jurisdictionChips = [
    locale === "ar" ? "الولاية: عالمية" : "Jurisdiction: Global",
    accountPolicy.jurisdiction.executionPolicy === "demo_only"
      ? locale === "ar"
        ? "سياسة التنفيذ: تجريبي فقط"
        : "Execution policy: Demo only"
      : locale === "ar"
      ? "سياسة التنفيذ: مقيّدة"
      : "Execution policy: Restricted",
    accountPolicy.jurisdiction.disclosureState === "required"
      ? locale === "ar"
        ? "الإفصاحات: مطلوبة"
        : "Disclosures: Required"
      : locale === "ar"
      ? "الإفصاحات: جاهزة"
      : "Disclosures: Ready",
    accountPolicy.jurisdiction.activationState === "review"
      ? locale === "ar"
        ? "التفعيل القانوني: قيد المراجعة"
        : "Legal activation: Under review"
      : locale === "ar"
      ? "التفعيل القانوني: نشط"
      : "Legal activation: Active",
    onboardingStageLabel(locale, accountPolicy.onboarding.onboardingStage),
    accountPolicy.onboarding.demoReadiness === "ready"
      ? locale === "ar"
        ? "جاهزية الديمو: جاهز"
        : "Demo readiness: Ready"
      : locale === "ar"
      ? "جاهزية الديمو: غير جاهز"
      : "Demo readiness: Not ready",
    accountPolicy.onboarding.liveActivation === "blocked"
      ? locale === "ar"
        ? "تفعيل الحقيقي: محجوب"
        : "Live activation: Blocked"
      : accountPolicy.onboarding.liveActivation === "review"
      ? locale === "ar"
        ? "تفعيل الحقيقي: قيد المراجعة"
        : "Live activation: Under review"
      : locale === "ar"
      ? "تفعيل الحقيقي: مفعل"
      : "Live activation: Enabled",
    ...accountPolicy.verificationWorkflow.map((anchor) =>
      verificationWorkflowLabel(locale, anchor)
    ),
  ];

  const permissionChips = [
    ...accountPolicy.permissionAnchors.map((anchor) => permissionLabel(locale, anchor)),
    ...accountPolicy.preferences.map((anchor) => preferenceLabel(locale, anchor)),
  ];

  const executionFoundationLabel = locale === "ar" ? "أساس التنفيذ" : "Execution foundation";
  const executionRouteLabel = locale === "ar" ? "مسار التنفيذ" : "Execution route";
  const executionRouteValue =
    executionFoundation.route === "demo_router"
      ? locale === "ar"
        ? "موجه الديمو"
        : "Demo router"
      : locale === "ar"
      ? "المسار الحقيقي محجوب"
      : "Live route blocked";

  const executionIntentLabel = locale === "ar" ? "حالة نية التنفيذ" : "Execution intent";
  const executionIntentValue =
    executionFoundation.intentState === "ready"
      ? locale === "ar"
        ? "جاهز"
        : "Ready"
      : executionFoundation.intentState === "standby"
      ? locale === "ar"
        ? "انتظار"
        : "Standby"
      : executionFoundation.intentState === "guarded"
      ? locale === "ar"
        ? "محكوم بالحواجز"
        : "Guarded"
      : locale === "ar"
      ? "محجوب"
      : "Blocked";

  const executionGuardrailsLabel = locale === "ar" ? "حواجز التنفيذ" : "Execution guardrails";
  const executionGuardrailChips =
    executionFoundation.guardrails.length > 0
      ? executionFoundation.guardrails.map((item) => executionGuardrailLabel(locale, item))
      : [locale === "ar" ? "لا يوجد حظر نشط" : "No active block"];

  const riskFoundationLabel = locale === "ar" ? "أساس المخاطر والجلسة" : "Risk + Session foundation";

  const riskStateText =
    riskFoundation.sessionState === "active"
      ? locale === "ar"
        ? "نشطة"
        : "Active"
      : riskFoundation.sessionState === "guarded"
      ? locale === "ar"
        ? "محكومة"
        : "Guarded"
      : locale === "ar"
      ? "مقفلة"
      : "Locked";

  const riskModeText =
    riskFoundation.riskMode === "normal"
      ? locale === "ar"
        ? "طبيعي"
        : "Normal"
      : riskFoundation.riskMode === "guarded"
      ? locale === "ar"
        ? "حذر"
        : "Guarded"
      : locale === "ar"
      ? "مقفل"
      : "Locked";

  const safeDegradationText =
    riskFoundation.safeDegradation === "none"
      ? locale === "ar"
        ? "لا يوجد"
        : "None"
      : riskFoundation.safeDegradation === "new_entries_restricted"
      ? locale === "ar"
        ? "تقييد دخول جديد"
        : "New entries restricted"
      : locale === "ar"
      ? "حظر دخول جديد"
      : "New entries blocked";

  const lockReasonText =
    riskFoundation.lockReason === "loss_limit"
      ? locale === "ar"
        ? "بلوغ حد الخسارة"
        : "Loss limit reached"
      : riskFoundation.lockReason === "capacity_limit"
      ? locale === "ar"
        ? "بلوغ سعة الصفقات"
        : "Trade capacity reached"
      : locale === "ar"
      ? "لا يوجد"
      : "None";

  const riskFoundationChips = [
    `${locale === "ar" ? "حالة الجلسة" : "Session state"}: ${riskStateText}`,
    `${locale === "ar" ? "وضع المخاطر" : "Risk mode"}: ${riskModeText}`,
    `${locale === "ar" ? "حد خسارة الجلسة" : "Session loss limit"}: -$${riskFoundation.sessionLossLimit.toFixed(2)}`,
    `${locale === "ar" ? "نتيجة الجلسة الحالية" : "Current session PnL"}: ${sessionPnLText}`,
    `${locale === "ar" ? "السعات المتبقية" : "Remaining slots"}: ${riskFoundation.remainingTradeSlots}`,
    `${locale === "ar" ? "الحد الأقصى للصفقات المفتوحة" : "Max open trades"}: ${riskFoundation.maxOpenTrades}`,
    `${locale === "ar" ? "الصفقات الخاسرة" : "Losing trades"}: ${riskFoundation.losingTradesCount}`,
    `${locale === "ar" ? "الحماية المتدرجة" : "Safe degradation"}: ${safeDegradationText}`,
    ...(riskFoundation.lockReason !== "none"
      ? [`${locale === "ar" ? "سبب القفل" : "Lock reason"}: ${lockReasonText}`]
      : []),
  ];

  const riskOperatorNote =
    riskFoundation.operatorMessage === "loss_limit_locked"
      ? locale === "ar"
        ? "تم بلوغ حد خسارة الجلسة؛ تم حظر الدخولات الجديدة حتى تتم مراجعة الجلسة."
        : "The session loss limit was reached; new entries are blocked until the session is reviewed."
      : riskFoundation.operatorMessage === "capacity_reached"
      ? locale === "ar"
        ? "تم بلوغ سعة الصفقات المفتوحة؛ لا يمكن فتح دخول جديد حتى يتم إغلاق صفقة."
        : "Open-trade capacity was reached; no new entry can open until a trade is closed."
      : riskFoundation.operatorMessage === "session_guarded"
      ? locale === "ar"
        ? "الجلسة اقتربت من حدود المخاطر المحددة؛ الدخولات الجديدة تبقى مقيدة ومحكومة."
        : "The session is approaching configured risk boundaries; new entries remain controlled."
      : locale === "ar"
      ? "الجلسة تعمل داخل حدود المخاطر المحددة."
      : "The session is operating inside configured risk boundaries.";

  const dataStateFoundationLabel = locale === "ar" ? "أساس البيانات والحالة" : "Data + State foundation";

  const feedStateText =
    dataStateFoundation.marketFeedState === "simulated_live"
      ? locale === "ar"
        ? "تدفق حي محاكى"
        : "Simulated live feed"
      : locale === "ar"
      ? "منقطع"
      : "Disconnected";

  const decisionEngineText =
    dataStateFoundation.decisionEngineState === "derived_local"
      ? locale === "ar"
        ? "محرك قرار محلي"
        : "Local derived engine"
      : locale === "ar"
      ? "وضع انتظار"
      : "Standby";

  const chartBindingText =
    dataStateFoundation.chartBindingState === "workspace_bound"
      ? locale === "ar"
        ? "مرتبط بمساحة العمل"
        : "Workspace-bound"
      : locale === "ar"
      ? "غير مرتبط"
      : "Unbound";

  const storageStateText =
    dataStateFoundation.storagePersistenceState === "persistent_local"
      ? locale === "ar"
        ? "تخزين محلي دائم"
        : "Local persistent storage"
      : dataStateFoundation.storagePersistenceState === "booting"
      ? locale === "ar"
        ? "تهيئة"
        : "Booting"
      : locale === "ar"
      ? "ذاكرة فقط"
      : "Memory only";

  const hydrationText =
    dataStateFoundation.hydrationState === "hydrated"
      ? locale === "ar"
        ? "محمل"
        : "Hydrated"
      : locale === "ar"
      ? "قيد التهيئة"
      : "Booting";

  const scopeText = dataStateFoundation.stateScope === "demo" ? demoLabel : realLabel;
  const localeText = dataStateFoundation.locale === "ar" ? "Arabic / العربية" : "English";
  const directionText = dataStateFoundation.direction === "rtl" ? "RTL" : "LTR";

  const dataStateFoundationChips = [
    `${locale === "ar" ? "تغذية السوق" : "Market feed"}: ${feedStateText}`,
    `${locale === "ar" ? "محرك القرار" : "Decision engine"}: ${decisionEngineText}`,
    `${locale === "ar" ? "ربط الرسم" : "Chart binding"}: ${chartBindingText}`,
    `${locale === "ar" ? "التخزين" : "Storage"}: ${storageStateText}`,
    `${locale === "ar" ? "التحميل" : "Hydration"}: ${hydrationText}`,
    `${locale === "ar" ? "قناة المزامنة" : "Sync channel"}: Local storage`,
    `${locale === "ar" ? "نطاق الحالة" : "State scope"}: ${scopeText}`,
    `${locale === "ar" ? "اللغة" : "Locale"}: ${localeText}`,
    `${locale === "ar" ? "الاتجاه" : "Direction"}: ${directionText}`,
    `${locale === "ar" ? "آخر تحديث" : "Last updated"}: ${dataStateFoundation.lastUpdatedAt}`,
  ];

  const dataStateOperatorNote =
    locale === "ar"
      ? "الحالة مرتبطة بالحساب النشط وتُحفَظ محليًا مع تحميل آمن واتجاه واجهة مطابق للغة."
      : "State is scoped to the active account and persisted locally with safe hydration and locale-aware direction.";

  const realReadinessNote =
    locale === "ar"
      ? "وضع الحساب الحقيقي موجود في الأساس، لكن التوجيه والتنفيذ الحقيقيين غير مفعّلين بعد."
      : "Real account mode exists in the foundation, but live routing and real execution are not enabled yet.";

  const auditCopy = getAuditPanelCopy(locale);
  const auditTitle = auditCopy.title;
  const auditSubtitle = auditCopy.subtitle;
  const auditActorLabel = auditCopy.actorLabel;
  const auditAccountModeLabel = auditCopy.accountModeLabel;
  const auditVisibilityLabel = auditCopy.visibilityLabel;
  const auditTraceLabel = auditCopy.traceLabel;
  const auditLastEventLabel = auditCopy.lastEventLabel;
  const auditEmptyLabel = auditCopy.emptyLabel;

  const auditAccountModeValue =
    auditTraceFoundation.currentAccountMode === "demo" ? demoLabel : realLabel;

  const auditVisibilityValue =
    auditTraceFoundation.visibilityState === "operator_visible"
      ? auditCopy.visibleValue
      : auditCopy.hiddenValue;

  const auditTraceValue =
    auditTraceFoundation.decisionTraceState === "linked" &&
    auditTraceFoundation.executionTraceState === "linked" &&
    auditTraceFoundation.sessionTraceState === "linked"
      ? auditCopy.linkedValue
      : auditCopy.standbyValue;

  const securityCopy = getSecurityPanelCopy(locale);
  const securityTitle = securityCopy.title;
  const securitySubtitle = securityCopy.subtitle;
  const securityRouteLabel = securityCopy.routeLabel;
  const securityAccessLabel = securityCopy.accessLabel;
  const securityExecutionLabel = securityCopy.executionLabel;
  const securityDataLabel = securityCopy.dataLabel;
  const securitySecretsLabel = securityCopy.secretsLabel;
  const securitySessionLabel = securityCopy.sessionLabel;
  const securityRecoveryLabel = securityCopy.recoveryLabel;
  const securityAlertLabel = securityCopy.alertLabel;
  const securityAccountLabel = securityCopy.accountLabel;
  const securityReviewedAtLabel = securityCopy.reviewedAtLabel;

  const securityRouteValue = resolveSecurityRouteValue(
    locale,
    securityFoundation.routeState
  );
  const securityAccessValue = resolveSecurityAccessValue(
    locale,
    securityFoundation.accessState
  );
  const securityExecutionValue = resolveSecurityExecutionValue(
    locale,
    securityFoundation.executionProtectionState
  );
  const securityDataValue = resolveSecurityDataValue(
    locale,
    securityFoundation.dataProtectionState
  );
  const securitySecretsValue = resolveSecuritySecretsValue(
    locale,
    securityFoundation.secretState
  );
  const securitySessionValue = resolveSecuritySessionValue(
    locale,
    securityFoundation.sessionProtectionState
  );
  const securityRecoveryValue = resolveSecurityRecoveryValue(
    locale,
    securityFoundation.recoveryState
  );
  const securityAlertValue = resolveSecurityAlertValue(
    locale,
    securityFoundation.alertLevel
  );
  const securityAccountValue =
    securityFoundation.currentAccountMode === "demo" ? demoLabel : realLabel;

  return (
    <main className="tpmv2-page">
      <section className="tpmv2-shell-desktop">
        <DesktopRail
          dict={dict}
          selectedAssetIndex={selectedAssetIndex}
          onSelectAsset={setSelectedAssetIndex}
        />

        <section className="tpmv2-main">
          <TradingTopbar
            dict={dict}
            balance={balance}
            accountMode={accountMode}
            onModeChange={switchAccountMode}
            modeLabel={modeLabel}
            demoLabel={demoLabel}
            realLabel={realLabel}
            userName={userIdentity.displayName}
            userEmail={userIdentity.email}
            userRegion={userIdentity.region}
            userRole={userRole}
            verificationLabel={verificationLabel}
            accountStatusLabel={accountStatusLabel}
            accountStatusValue={accountStatusValue}
            jurisdictionChips={jurisdictionChips}
            permissionChips={permissionChips}
            profileLabel={profileLabel}
            settingsLabel={settingsLabel}
            signOutLabel={signOutLabel}
          />

          <section className="tpmv2-desktop-master">
            <section className="tpmv2-primary">
              <SummaryCard
                dict={dict}
                symbol={selectedAsset.symbol}
                price={selectedAsset.price}
                change={selectedAsset.change}
                signalLabel={signalLabel}
                signalStyle={signalStyle}
                marketStatus={selectedAsset.status}
                timeframe={selectedTimeframe}
                confidence={decision.confidence}
              />

              <RiskCardGrid
                dict={dict}
                openTradesText={`${openTrades.length} / ${PLATFORM_LIMITS.maxOpenTrades}`}
                sessionPnLText={sessionPnLText}
                sessionPnLPositive={sessionPnL >= 0}
                lossCount={lossCount}
                sessionStateLabel={sessionStateLabel}
                sessionLocked={sessionLocked}
              />

              <ChartCard
                dict={dict}
                selectedAsset={selectedAsset}
                selectedTimeframe={selectedTimeframe}
                onSelectTimeframe={setSelectedTimeframe}
                candles={candles}
              />
            </section>

            <aside className="tpmv2-side">
              <ExecutionCard
                dict={dict}
                decision={decision}
                signalLabel={signalLabel}
                selectedAssetSymbol={selectedAsset.symbol}
                selectedTimeframe={selectedTimeframe}
                selectedDuration={selectedDuration}
                durationOptions={availableDurations}
                onSelectDuration={setSelectedDuration}
                analysisTimeframeLabel={analysisTimeframeLabel}
                durationFieldLabel={durationFieldLabel}
                amount={amount}
                setAmount={setAmount}
                sessionLocked={sessionLocked}
                canOpenMore={canOpenMore}
                canExecute={canExecute}
                accountMode={accountMode}
                openTradeBySignal={openTradeBySignal}
                openPaperTrade={openPaperTrade}
                riskNote={riskNote}
                modeFieldLabel={modeLabel}
                demoLabel={demoLabel}
                realLabel={realLabel}
                realReadinessNote={realReadinessNote}
                policyPanelLabel={policyPanelLabel}
                verificationLabel={verificationLabel}
                permissionChips={permissionChips}
                jurisdictionChips={jurisdictionChips}
                executionFoundationLabel={executionFoundationLabel}
                executionRouteLabel={executionRouteLabel}
                executionRouteValue={executionRouteValue}
                executionIntentLabel={executionIntentLabel}
                executionIntentValue={executionIntentValue}
                executionGuardrailsLabel={executionGuardrailsLabel}
                executionGuardrailChips={executionGuardrailChips}
                riskFoundationLabel={riskFoundationLabel}
                riskFoundationChips={riskFoundationChips}
                riskOperatorNote={riskOperatorNote}
                dataStateFoundationLabel={dataStateFoundationLabel}
                dataStateFoundationChips={dataStateFoundationChips}
                dataStateOperatorNote={dataStateOperatorNote}
              />
            </aside>
          </section>

          <section className="tpmv2-activity">
            <ActivityOpenTradesPanel
              dict={dict}
              openTrades={openTrades}
              closePaperTrade={closePaperTrade}
            />

            <ActivityHistoryPanel dict={dict} history={history} />

            <AuditTracePanel
              title={auditTitle}
              subtitle={auditSubtitle}
              actorLabel={auditActorLabel}
              actorValue={auditTraceFoundation.currentActor}
              accountModeLabel={auditAccountModeLabel}
              accountModeValue={auditAccountModeValue}
              visibilityLabel={auditVisibilityLabel}
              visibilityValue={auditVisibilityValue}
              traceLabel={auditTraceLabel}
              traceValue={auditTraceValue}
              lastEventLabel={auditLastEventLabel}
              lastEventValue={auditTraceFoundation.lastEventAt}
              events={auditTraceFoundation.recentEvents}
              emptyLabel={auditEmptyLabel}
            />

            <SecurityFoundationPanel
              title={securityTitle}
              subtitle={securitySubtitle}
              routeLabel={securityRouteLabel}
              routeValue={securityRouteValue}
              accessLabel={securityAccessLabel}
              accessValue={securityAccessValue}
              executionLabel={securityExecutionLabel}
              executionValue={securityExecutionValue}
              dataProtectionLabel={securityDataLabel}
              dataProtectionValue={securityDataValue}
              secretsLabel={securitySecretsLabel}
              secretsValue={securitySecretsValue}
              sessionLabel={securitySessionLabel}
              sessionValue={securitySessionValue}
              recoveryLabel={securityRecoveryLabel}
              recoveryValue={securityRecoveryValue}
              alertLabel={securityAlertLabel}
              alertValue={securityAlertValue}
              accountModeLabel={securityAccountLabel}
              accountModeValue={securityAccountValue}
              reviewedAtLabel={securityReviewedAtLabel}
              reviewedAtValue={securityFoundation.lastReviewedAt}
            />
          </section>
        </section>
      </section>

      <section className="tpmv2-shell-narrow">
        <TradingTopbar
          dict={dict}
          balance={balance}
          accountMode={accountMode}
          onModeChange={switchAccountMode}
          modeLabel={modeLabel}
          demoLabel={demoLabel}
          realLabel={realLabel}
          userName={userIdentity.displayName}
          userEmail={userIdentity.email}
          userRegion={userIdentity.region}
          userRole={userRole}
          verificationLabel={verificationLabel}
          accountStatusLabel={accountStatusLabel}
          accountStatusValue={accountStatusValue}
          jurisdictionChips={jurisdictionChips}
          permissionChips={permissionChips}
          profileLabel={profileLabel}
          settingsLabel={settingsLabel}
          signOutLabel={signOutLabel}
        />

        <NarrowStrip
          dict={dict}
          selectedAssetIndex={selectedAssetIndex}
          onSelectAsset={setSelectedAssetIndex}
        />

        <SummaryCard
          dict={dict}
          symbol={selectedAsset.symbol}
          price={selectedAsset.price}
          change={selectedAsset.change}
          signalLabel={signalLabel}
          signalStyle={signalStyle}
          marketStatus={selectedAsset.status}
          timeframe={selectedTimeframe}
          confidence={decision.confidence}
        />

        <RiskCardGrid
          dict={dict}
          openTradesText={`${openTrades.length} / ${PLATFORM_LIMITS.maxOpenTrades}`}
          sessionPnLText={sessionPnLText}
          sessionPnLPositive={sessionPnL >= 0}
          lossCount={lossCount}
          sessionStateLabel={sessionStateLabel}
          sessionLocked={sessionLocked}
        />

        <ChartCard
          dict={dict}
          selectedAsset={selectedAsset}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={setSelectedTimeframe}
          candles={candles}
        />

        <ExecutionCard
          dict={dict}
          decision={decision}
          signalLabel={signalLabel}
          selectedAssetSymbol={selectedAsset.symbol}
          selectedTimeframe={selectedTimeframe}
          selectedDuration={selectedDuration}
          durationOptions={availableDurations}
          onSelectDuration={setSelectedDuration}
          analysisTimeframeLabel={analysisTimeframeLabel}
          durationFieldLabel={durationFieldLabel}
          amount={amount}
          setAmount={setAmount}
          sessionLocked={sessionLocked}
          canOpenMore={canOpenMore}
          canExecute={canExecute}
          accountMode={accountMode}
          openTradeBySignal={openTradeBySignal}
          openPaperTrade={openPaperTrade}
          riskNote={riskNote}
          modeFieldLabel={modeLabel}
          demoLabel={demoLabel}
          realLabel={realLabel}
          realReadinessNote={realReadinessNote}
          policyPanelLabel={policyPanelLabel}
          verificationLabel={verificationLabel}
          permissionChips={permissionChips}
          jurisdictionChips={jurisdictionChips}
          executionFoundationLabel={executionFoundationLabel}
          executionRouteLabel={executionRouteLabel}
          executionRouteValue={executionRouteValue}
          executionIntentLabel={executionIntentLabel}
          executionIntentValue={executionIntentValue}
          executionGuardrailsLabel={executionGuardrailsLabel}
          executionGuardrailChips={executionGuardrailChips}
          riskFoundationLabel={riskFoundationLabel}
          riskFoundationChips={riskFoundationChips}
          riskOperatorNote={riskOperatorNote}
          dataStateFoundationLabel={dataStateFoundationLabel}
          dataStateFoundationChips={dataStateFoundationChips}
          dataStateOperatorNote={dataStateOperatorNote}
        />

        <ActivityOpenTradesPanel
          dict={dict}
          openTrades={openTrades}
          closePaperTrade={closePaperTrade}
        />

        <ActivityHistoryPanel dict={dict} history={history} />

        <AuditTracePanel
          title={auditTitle}
          subtitle={auditSubtitle}
          actorLabel={auditActorLabel}
          actorValue={auditTraceFoundation.currentActor}
          accountModeLabel={auditAccountModeLabel}
          accountModeValue={auditAccountModeValue}
          visibilityLabel={auditVisibilityLabel}
          visibilityValue={auditVisibilityValue}
          traceLabel={auditTraceLabel}
          traceValue={auditTraceValue}
          lastEventLabel={auditLastEventLabel}
          lastEventValue={auditTraceFoundation.lastEventAt}
          events={auditTraceFoundation.recentEvents}
          emptyLabel={auditEmptyLabel}
        />

        <SecurityFoundationPanel
          title={securityTitle}
          subtitle={securitySubtitle}
          routeLabel={securityRouteLabel}
          routeValue={securityRouteValue}
          accessLabel={securityAccessLabel}
          accessValue={securityAccessValue}
          executionLabel={securityExecutionLabel}
          executionValue={securityExecutionValue}
          dataProtectionLabel={securityDataLabel}
          dataProtectionValue={securityDataValue}
          secretsLabel={securitySecretsLabel}
          secretsValue={securitySecretsValue}
          sessionLabel={securitySessionLabel}
          sessionValue={securitySessionValue}
          recoveryLabel={securityRecoveryLabel}
          recoveryValue={securityRecoveryValue}
          alertLabel={securityAlertLabel}
          alertValue={securityAlertValue}
          accountModeLabel={securityAccountLabel}
          accountModeValue={securityAccountValue}
          reviewedAtLabel={securityReviewedAtLabel}
          reviewedAtValue={securityFoundation.lastReviewedAt}
        />
      </section>
    </main>
  );
}