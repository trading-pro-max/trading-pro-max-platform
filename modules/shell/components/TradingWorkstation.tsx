"use client";

import { PLATFORM_LIMITS } from "../../../lib/constants/platform";
import type {
  AccountPreferenceAnchor,
  ExecutionGuardrailKey,
  PermissionAnchor,
  VerificationWorkflowAnchor,
} from "../types/platform-state";
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
  ChartCard,
  DesktopRail,
  ExecutionCard,
  NarrowStrip,
  RiskCardGrid,
  SummaryCard,
  TradingTopbar,
} from "./PlatformShellV2";

function permissionLabel(locale: string, anchor: PermissionAnchor) {
  const stateText =
    anchor.state === "enabled"
      ? locale === "ar"
        ? "مفعل"
        : "Enabled"
      : anchor.state === "read_only"
      ? locale === "ar"
        ? "قراءة فقط"
        : "Read-only"
      : locale === "ar"
      ? "محجوب"
      : "Blocked";

  const labelMap: Record<PermissionAnchor["key"], string> = {
    profile: locale === "ar" ? "الملف" : "Profile",
    settings: locale === "ar" ? "الإعدادات" : "Settings",
    sign_out: locale === "ar" ? "الخروج" : "Sign out",
    demo_execution: locale === "ar" ? "تنفيذ تجريبي" : "Demo execution",
    real_execution: locale === "ar" ? "تنفيذ حقيقي" : "Real execution",
    audit_surface: locale === "ar" ? "سطح التدقيق" : "Audit surface",
    jurisdiction_controls: locale === "ar" ? "ضوابط الولاية" : "Jurisdiction controls",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

function verificationWorkflowLabel(locale: string, anchor: VerificationWorkflowAnchor) {
  const stateText =
    anchor.state === "ready"
      ? locale === "ar"
        ? "جاهز"
        : "Ready"
      : anchor.state === "review"
      ? locale === "ar"
        ? "قيد المراجعة"
        : "Under review"
      : locale === "ar"
      ? "معلق"
      : "Pending";

  const labelMap: Record<VerificationWorkflowAnchor["key"], string> = {
    identity_check: locale === "ar" ? "التحقق من الهوية" : "Identity check",
    account_review: locale === "ar" ? "مراجعة الحساب" : "Account review",
    disclosure_acceptance: locale === "ar" ? "قبول الإفصاحات" : "Disclosure acceptance",
    live_activation: locale === "ar" ? "تفعيل الحقيقي" : "Live activation",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

function preferenceLabel(locale: string, anchor: AccountPreferenceAnchor) {
  const keyMap: Record<AccountPreferenceAnchor["key"], string> = {
    language: locale === "ar" ? "اللغة" : "Language",
    direction: locale === "ar" ? "الاتجاه" : "Direction",
    density: locale === "ar" ? "الكثافة" : "Density",
    chart_layout: locale === "ar" ? "هيكل الرسم" : "Chart layout",
    risk_confirmation: locale === "ar" ? "تأكيد المخاطر" : "Risk confirmation",
  };

  const valueMap: Record<string, string> = {
    Arabic: locale === "ar" ? "العربية" : "Arabic",
    English: locale === "ar" ? "الإنجليزية" : "English",
    RTL: "RTL",
    LTR: "LTR",
    Adaptive: locale === "ar" ? "تكيفية" : "Adaptive",
    "Primary workspace": locale === "ar" ? "مساحة رئيسية" : "Primary workspace",
    Enabled: locale === "ar" ? "مفعل" : "Enabled",
  };

  return `${keyMap[anchor.key]}: ${valueMap[anchor.value] || anchor.value}`;
}

function onboardingStageLabel(locale: string, stage: string) {
  const stageMap: Record<string, string> = {
    foundation: locale === "ar" ? "مرحلة الإعداد: أساس" : "Onboarding: Foundation",
    identity_ready: locale === "ar" ? "مرحلة الإعداد: هوية جاهزة" : "Onboarding: Identity-ready",
    account_ready: locale === "ar" ? "مرحلة الإعداد: حساب جاهز" : "Onboarding: Account-ready",
    activation_review: locale === "ar" ? "مرحلة الإعداد: مراجعة التفعيل" : "Onboarding: Activation review",
    active: locale === "ar" ? "مرحلة الإعداد: نشط" : "Onboarding: Active",
  };

  return stageMap[stage] || stage;
}

function executionGuardrailLabel(locale: string, key: ExecutionGuardrailKey) {
  const map: Record<ExecutionGuardrailKey, string> = {
    demo_only: locale === "ar" ? "تنفيذ حقيقي محجوب" : "Live execution blocked",
    session_locked: locale === "ar" ? "الجلسة مقفلة" : "Session locked",
    max_open_trades: locale === "ar" ? "تم بلوغ الحد الأقصى" : "Max open trades reached",
  };

  return map[key];
}

export function TradingWorkstation({
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

  const signalStyle = getSignalTone(decision.signal);
  const riskNote = getRiskNote(riskNoteCode, dict);
  const signalLabel = dict.decision.signals[decision.signal];
  const sessionStateLabel = getSessionStateLabel(sessionLocked, dict);
  const sessionPnLText = formatSessionPnl(sessionPnL);

  const modeLabel = locale === "ar" ? "وضع الحساب" : "Account";
  const demoLabel = locale === "ar" ? "تجريبي" : "Demo";
  const realLabel = locale === "ar" ? "حقيقي" : "Real";
  const analysisTimeframeLabel = locale === "ar" ? "إطار التحليل" : "Analysis timeframe";
  const durationFieldLabel = locale === "ar" ? "مدة التنفيذ" : "Execution duration";
  const accountStatusLabel = locale === "ar" ? "حالة الحساب" : "Account status";
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

  const userRole = locale === "ar" ? "المالك" : "Owner";
  const profileLabel = locale === "ar" ? "الملف" : "Profile";
  const settingsLabel = locale === "ar" ? "الإعدادات" : "Settings";
  const signOutLabel = locale === "ar" ? "الخروج" : "Sign out";
  const policyPanelLabel = locale === "ar" ? "سياسة الحساب" : "Account policy";

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

  const realReadinessNote =
    locale === "ar"
      ? "وضع الحساب الحقيقي موجود في الأساس، لكن التوجيه والتنفيذ الحقيقيين غير مفعّلين بعد."
      : "Real account mode exists in the foundation, but live routing and real execution are not enabled yet.";

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
              />
            </aside>
          </section>

          <section className="tpmv2-activity">
            <ActivityOpenTradesPanel
              dict={dict}
              openTrades={openTrades}
              closePaperTrade={closePaperTrade}
            />

            <ActivityHistoryPanel
              dict={dict}
              history={history}
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
        />

        <ActivityOpenTradesPanel
          dict={dict}
          openTrades={openTrades}
          closePaperTrade={closePaperTrade}
        />

        <ActivityHistoryPanel
          dict={dict}
          history={history}
        />
      </section>
    </main>
  );
}