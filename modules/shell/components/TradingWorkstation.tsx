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

  const auditTitle = locale === "ar" ? "لوحة التدقيق والتتبع" : "Audit + Traceability";
  const auditSubtitle =
    locale === "ar"
      ? "أثر زمني واضح للأحداث الأساسية داخل المنصة."
      : "A visible event timeline for core platform actions.";

  const auditActorLabel = locale === "ar" ? "الفاعل" : "Actor";
  const auditAccountModeLabel = locale === "ar" ? "الحساب" : "Account";
  const auditVisibilityLabel = locale === "ar" ? "الرؤية" : "Visibility";
  const auditTraceLabel = locale === "ar" ? "حالة الربط" : "Trace state";
  const auditLastEventLabel = locale === "ar" ? "آخر حدث" : "Last event";
  const auditEmptyLabel =
    locale === "ar" ? "لا توجد أحداث تدقيق بعد." : "No audit events yet.";

  const auditAccountModeValue =
    auditTraceFoundation.currentAccountMode === "demo" ? demoLabel : realLabel;

  const auditVisibilityValue =
    auditTraceFoundation.visibilityState === "operator_visible"
      ? locale === "ar"
        ? "مرئي للمشغل"
        : "Operator visible"
      : locale === "ar"
      ? "مخفي"
      : "Hidden";

  const auditTraceValue =
    auditTraceFoundation.decisionTraceState === "linked" &&
    auditTraceFoundation.executionTraceState === "linked" &&
    auditTraceFoundation.sessionTraceState === "linked"
      ? locale === "ar"
        ? "مرتبط"
        : "Linked"
      : locale === "ar"
      ? "انتظار"
      : "Standby";

  const securityTitle = locale === "ar" ? "لوحة الأمان" : "Security Foundation";
  const securitySubtitle =
    locale === "ar"
      ? "حواجز الأمان الأساسية الفعالة داخل المنصة."
      : "Core active security guardrails across the platform.";

  const securityRouteLabel = locale === "ar" ? "المسار" : "Route";
  const securityAccessLabel = locale === "ar" ? "الوصول" : "Access";
  const securityExecutionLabel = locale === "ar" ? "حماية التنفيذ" : "Execution protection";
  const securityDataLabel = locale === "ar" ? "حماية البيانات" : "Data protection";
  const securitySecretsLabel = locale === "ar" ? "الأسرار" : "Secrets";
  const securitySessionLabel = locale === "ar" ? "الجلسة" : "Session";
  const securityRecoveryLabel = locale === "ar" ? "الاستعادة" : "Recovery";
  const securityAlertLabel = locale === "ar" ? "التنبيه" : "Alert";
  const securityAccountLabel = locale === "ar" ? "الحساب" : "Account";
  const securityReviewedAtLabel = locale === "ar" ? "آخر مراجعة" : "Last reviewed";

  const securityRouteValue =
    securityFoundation.routeState === "guarded"
      ? locale === "ar"
        ? "محروس"
        : "Guarded"
      : securityFoundation.routeState;

  const securityAccessValue =
    securityFoundation.accessState === "least_privilege"
      ? locale === "ar"
        ? "أقل صلاحية"
        : "Least privilege"
      : securityFoundation.accessState;

  const securityExecutionValue =
    securityFoundation.executionProtectionState === "demo_only_enforced"
      ? locale === "ar"
        ? "تجريبي فقط مفروض"
        : "Demo-only enforced"
      : securityFoundation.executionProtectionState;

  const securityDataValue =
    securityFoundation.dataProtectionState === "mode_separated"
      ? locale === "ar"
        ? "فصل حسب الوضع"
        : "Mode-separated"
      : securityFoundation.dataProtectionState;

  const securitySecretsValue =
    securityFoundation.secretState === "local_env_guarded"
      ? locale === "ar"
        ? "ملف بيئة محلي محروس"
        : "Local env guarded"
      : securityFoundation.secretState;

  const securitySessionValue =
    securityFoundation.sessionProtectionState === "guarded"
      ? locale === "ar"
        ? "محروسة"
        : "Guarded"
      : securityFoundation.sessionProtectionState;

  const securityRecoveryValue =
    securityFoundation.recoveryState === "safe_fallback_ready"
      ? locale === "ar"
        ? "بديل آمن جاهز"
        : "Safe fallback ready"
      : securityFoundation.recoveryState;

  const securityAlertValue =
    securityFoundation.alertLevel === "elevated"
      ? locale === "ar"
        ? "مرتفع"
        : "Elevated"
      : locale === "ar"
      ? "طبيعي"
      : "Normal";

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