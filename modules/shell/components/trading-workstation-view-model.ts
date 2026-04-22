import { PLATFORM_LIMITS } from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import {
  formatSessionPnl,
  getRiskNote,
  getSessionStateLabel,
  getSignalTone,
} from "../../../lib/utils/workstation-view";
import type {
  AccountPolicySurface,
  AccountRuntimeState,
  AuditTraceFoundationSurface,
  DataStateFoundationSurface,
  Decision,
  ExecutionFoundationSurface,
  RiskFoundationSurface,
  RiskNoteCode,
  SecurityFoundationSurface,
  UserIdentity,
} from "../types/platform-state";
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

export type TradingWorkstationViewModelInput = {
  locale: string;
  dict: Dictionary;
  userIdentity: UserIdentity;
  accountStatus: AccountRuntimeState;
  accountPolicy: AccountPolicySurface;
  executionFoundation: ExecutionFoundationSurface;
  riskFoundation: RiskFoundationSurface;
  dataStateFoundation: DataStateFoundationSurface;
  auditTraceFoundation: AuditTraceFoundationSurface;
  securityFoundation: SecurityFoundationSurface;
  decision: Decision;
  riskNoteCode: RiskNoteCode;
  sessionPnL: number;
  sessionLocked: boolean;
  openTradesCount: number;
};

export type TradingWorkstationViewModel = {
  modeLabel: string;
  demoLabel: string;
  realLabel: string;
  analysisTimeframeLabel: string;
  durationFieldLabel: string;
  accountStatusLabel: string;
  profileLabel: string;
  settingsLabel: string;
  signOutLabel: string;
  policyPanelLabel: string;
  userRole: string;
  signalStyle: ReturnType<typeof getSignalTone>;
  riskNote: string;
  signalLabel: string;
  sessionStateLabel: string;
  sessionPnLText: string;
  accountStatusValue: string;
  verificationLabel: string;
  jurisdictionChips: string[];
  permissionChips: string[];
  openTradesText: string;
  sessionPnLPositive: boolean;
  executionFoundationLabel: string;
  executionRouteLabel: string;
  executionRouteValue: string;
  executionIntentLabel: string;
  executionIntentValue: string;
  executionGuardrailsLabel: string;
  executionGuardrailChips: string[];
  riskFoundationLabel: string;
  riskFoundationChips: string[];
  riskOperatorNote: string;
  dataStateFoundationLabel: string;
  dataStateFoundationChips: string[];
  dataStateOperatorNote: string;
  realReadinessNote: string;
  auditTitle: string;
  auditSubtitle: string;
  auditActorLabel: string;
  auditAccountModeLabel: string;
  auditVisibilityLabel: string;
  auditTraceLabel: string;
  auditLastEventLabel: string;
  auditEmptyLabel: string;
  auditAccountModeValue: string;
  auditVisibilityValue: string;
  auditTraceValue: string;
  securityTitle: string;
  securitySubtitle: string;
  securityRouteLabel: string;
  securityAccessLabel: string;
  securityExecutionLabel: string;
  securityDataLabel: string;
  securitySecretsLabel: string;
  securitySessionLabel: string;
  securityRecoveryLabel: string;
  securityAlertLabel: string;
  securityAccountLabel: string;
  securityReviewedAtLabel: string;
  securityRouteValue: string;
  securityAccessValue: string;
  securityExecutionValue: string;
  securityDataValue: string;
  securitySecretsValue: string;
  securitySessionValue: string;
  securityRecoveryValue: string;
  securityAlertValue: string;
  securityAccountValue: string;
};

function isArabic(locale: string) {
  return locale === "ar";
}

function getAccountStatusValue(
  locale: string,
  accountStatus: AccountRuntimeState
) {
  const arabic = isArabic(locale);

  if (accountStatus === "active") {
    return arabic ? "نشط" : "Active";
  }

  return arabic ? "قراءة فقط" : "Read-only";
}

function getVerificationLabel(
  locale: string,
  verification: UserIdentity["verification"]
) {
  const arabic = isArabic(locale);

  if (verification === "verified") {
    return arabic ? "موثق" : "Verified";
  }

  if (verification === "review") {
    return arabic ? "قيد المراجعة" : "Under review";
  }

  return arabic ? "غير موثق" : "Unverified";
}

function getJurisdictionChips(
  locale: string,
  accountPolicy: AccountPolicySurface
) {
  const arabic = isArabic(locale);

  return [
    arabic ? "الولاية: عالمية" : "Jurisdiction: Global",
    accountPolicy.jurisdiction.executionPolicy === "demo_only"
      ? arabic
        ? "سياسة التنفيذ: تجريبي فقط"
        : "Execution policy: Demo only"
      : arabic
      ? "سياسة التنفيذ: مقيّدة"
      : "Execution policy: Restricted",
    accountPolicy.jurisdiction.disclosureState === "required"
      ? arabic
        ? "الإفصاحات: مطلوبة"
        : "Disclosures: Required"
      : arabic
      ? "الإفصاحات: جاهزة"
      : "Disclosures: Ready",
    accountPolicy.jurisdiction.activationState === "review"
      ? arabic
        ? "التفعيل القانوني: قيد المراجعة"
        : "Legal activation: Under review"
      : arabic
      ? "التفعيل القانوني: نشط"
      : "Legal activation: Active",
    onboardingStageLabel(locale, accountPolicy.onboarding.onboardingStage),
    accountPolicy.onboarding.demoReadiness === "ready"
      ? arabic
        ? "جاهزية الديمو: جاهز"
        : "Demo readiness: Ready"
      : arabic
      ? "جاهزية الديمو: غير جاهز"
      : "Demo readiness: Not ready",
    accountPolicy.onboarding.liveActivation === "blocked"
      ? arabic
        ? "تفعيل الحقيقي: محجوب"
        : "Live activation: Blocked"
      : accountPolicy.onboarding.liveActivation === "review"
      ? arabic
        ? "تفعيل الحقيقي: قيد المراجعة"
        : "Live activation: Under review"
      : arabic
      ? "تفعيل الحقيقي: مفعل"
      : "Live activation: Enabled",
    ...accountPolicy.verificationWorkflow.map((anchor) =>
      verificationWorkflowLabel(locale, anchor)
    ),
  ];
}

function getPermissionChips(
  locale: string,
  accountPolicy: AccountPolicySurface
) {
  return [
    ...accountPolicy.permissionAnchors.map((anchor) =>
      permissionLabel(locale, anchor)
    ),
    ...accountPolicy.preferences.map((anchor) => preferenceLabel(locale, anchor)),
  ];
}

function getExecutionViewModel(
  locale: string,
  executionFoundation: ExecutionFoundationSurface
) {
  const arabic = isArabic(locale);

  const executionRouteValue =
    executionFoundation.route === "demo_router"
      ? arabic
        ? "موجه الديمو"
        : "Demo router"
      : arabic
      ? "المسار الحقيقي محجوب"
      : "Live route blocked";

  const executionIntentValue =
    executionFoundation.intentState === "ready"
      ? arabic
        ? "جاهز"
        : "Ready"
      : executionFoundation.intentState === "standby"
      ? arabic
        ? "انتظار"
        : "Standby"
      : executionFoundation.intentState === "guarded"
      ? arabic
        ? "محكوم بالحواجز"
        : "Guarded"
      : arabic
      ? "محجوب"
      : "Blocked";

  return {
    executionFoundationLabel: arabic ? "أساس التنفيذ" : "Execution foundation",
    executionRouteLabel: arabic ? "مسار التنفيذ" : "Execution route",
    executionRouteValue,
    executionIntentLabel: arabic ? "حالة نية التنفيذ" : "Execution intent",
    executionIntentValue,
    executionGuardrailsLabel: arabic ? "حواجز التنفيذ" : "Execution guardrails",
    executionGuardrailChips:
      executionFoundation.guardrails.length > 0
        ? executionFoundation.guardrails.map((item) =>
            executionGuardrailLabel(locale, item)
          )
        : [arabic ? "لا يوجد حظر نشط" : "No active block"],
  };
}

function getRiskViewModel(
  locale: string,
  riskFoundation: RiskFoundationSurface,
  sessionPnLText: string
) {
  const arabic = isArabic(locale);

  const riskStateText =
    riskFoundation.sessionState === "active"
      ? arabic
        ? "نشطة"
        : "Active"
      : riskFoundation.sessionState === "guarded"
      ? arabic
        ? "محكومة"
        : "Guarded"
      : arabic
      ? "مقفلة"
      : "Locked";

  const riskModeText =
    riskFoundation.riskMode === "normal"
      ? arabic
        ? "طبيعي"
        : "Normal"
      : riskFoundation.riskMode === "guarded"
      ? arabic
        ? "حذر"
        : "Guarded"
      : arabic
      ? "مقفل"
      : "Locked";

  const safeDegradationText =
    riskFoundation.safeDegradation === "none"
      ? arabic
        ? "لا يوجد"
        : "None"
      : riskFoundation.safeDegradation === "new_entries_restricted"
      ? arabic
        ? "تقييد دخول جديد"
        : "New entries restricted"
      : arabic
      ? "حظر دخول جديد"
      : "New entries blocked";

  const lockReasonText =
    riskFoundation.lockReason === "loss_limit"
      ? arabic
        ? "بلوغ حد الخسارة"
        : "Loss limit reached"
      : riskFoundation.lockReason === "capacity_limit"
      ? arabic
        ? "بلوغ سعة الصفقات"
        : "Trade capacity reached"
      : arabic
      ? "لا يوجد"
      : "None";

  return {
    riskFoundationLabel: arabic
      ? "أساس المخاطر والجلسة"
      : "Risk + Session foundation",
    riskFoundationChips: [
      `${arabic ? "حالة الجلسة" : "Session state"}: ${riskStateText}`,
      `${arabic ? "وضع المخاطر" : "Risk mode"}: ${riskModeText}`,
      `${arabic ? "حد خسارة الجلسة" : "Session loss limit"}: -$${riskFoundation.sessionLossLimit.toFixed(2)}`,
      `${arabic ? "نتيجة الجلسة الحالية" : "Current session PnL"}: ${sessionPnLText}`,
      `${arabic ? "السعات المتبقية" : "Remaining slots"}: ${riskFoundation.remainingTradeSlots}`,
      `${arabic ? "الحد الأقصى للصفقات المفتوحة" : "Max open trades"}: ${riskFoundation.maxOpenTrades}`,
      `${arabic ? "الصفقات الخاسرة" : "Losing trades"}: ${riskFoundation.losingTradesCount}`,
      `${arabic ? "الحماية المتدرجة" : "Safe degradation"}: ${safeDegradationText}`,
      ...(riskFoundation.lockReason !== "none"
        ? [`${arabic ? "سبب القفل" : "Lock reason"}: ${lockReasonText}`]
        : []),
    ],
    riskOperatorNote:
      riskFoundation.operatorMessage === "loss_limit_locked"
        ? arabic
          ? "تم بلوغ حد خسارة الجلسة؛ تم حظر الدخولات الجديدة حتى تتم مراجعة الجلسة."
          : "The session loss limit was reached; new entries are blocked until the session is reviewed."
        : riskFoundation.operatorMessage === "capacity_reached"
        ? arabic
          ? "تم بلوغ سعة الصفقات المفتوحة؛ لا يمكن فتح دخول جديد حتى يتم إغلاق صفقة."
          : "Open-trade capacity was reached; no new entry can open until a trade is closed."
        : riskFoundation.operatorMessage === "session_guarded"
        ? arabic
          ? "الجلسة اقتربت من حدود المخاطر المحددة؛ الدخولات الجديدة تبقى مقيدة ومحكومة."
          : "The session is approaching configured risk boundaries; new entries remain controlled."
        : arabic
        ? "الجلسة تعمل داخل حدود المخاطر المحددة."
        : "The session is operating inside configured risk boundaries.",
  };
}

function getDataStateViewModel(
  locale: string,
  dataStateFoundation: DataStateFoundationSurface,
  demoLabel: string,
  realLabel: string
) {
  const arabic = isArabic(locale);

  const feedStateText =
    dataStateFoundation.marketFeedState === "simulated_live"
      ? arabic
        ? "تدفق حي محاكى"
        : "Simulated live feed"
      : arabic
      ? "منقطع"
      : "Disconnected";

  const decisionEngineText =
    dataStateFoundation.decisionEngineState === "derived_local"
      ? arabic
        ? "محرك قرار محلي"
        : "Local derived engine"
      : arabic
      ? "وضع انتظار"
      : "Standby";

  const chartBindingText =
    dataStateFoundation.chartBindingState === "workspace_bound"
      ? arabic
        ? "مرتبط بمساحة العمل"
        : "Workspace-bound"
      : arabic
      ? "غير مرتبط"
      : "Unbound";

  const storageStateText =
    dataStateFoundation.storagePersistenceState === "persistent_local"
      ? arabic
        ? "تخزين محلي دائم"
        : "Local persistent storage"
      : dataStateFoundation.storagePersistenceState === "booting"
      ? arabic
        ? "تهيئة"
        : "Booting"
      : arabic
      ? "ذاكرة فقط"
      : "Memory only";

  const hydrationText =
    dataStateFoundation.hydrationState === "hydrated"
      ? arabic
        ? "محمل"
        : "Hydrated"
      : arabic
      ? "قيد التهيئة"
      : "Booting";

  const scopeText =
    dataStateFoundation.stateScope === "demo" ? demoLabel : realLabel;
  const localeText =
    dataStateFoundation.locale === "ar" ? "Arabic / العربية" : "English";
  const directionText = dataStateFoundation.direction === "rtl" ? "RTL" : "LTR";

  return {
    dataStateFoundationLabel: arabic
      ? "أساس البيانات والحالة"
      : "Data + State foundation",
    dataStateFoundationChips: [
      `${arabic ? "تغذية السوق" : "Market feed"}: ${feedStateText}`,
      `${arabic ? "محرك القرار" : "Decision engine"}: ${decisionEngineText}`,
      `${arabic ? "ربط الرسم" : "Chart binding"}: ${chartBindingText}`,
      `${arabic ? "التخزين" : "Storage"}: ${storageStateText}`,
      `${arabic ? "التحميل" : "Hydration"}: ${hydrationText}`,
      `${arabic ? "قناة المزامنة" : "Sync channel"}: Local storage`,
      `${arabic ? "نطاق الحالة" : "State scope"}: ${scopeText}`,
      `${arabic ? "اللغة" : "Locale"}: ${localeText}`,
      `${arabic ? "الاتجاه" : "Direction"}: ${directionText}`,
      `${arabic ? "آخر تحديث" : "Last updated"}: ${dataStateFoundation.lastUpdatedAt}`,
    ],
    dataStateOperatorNote: arabic
      ? "الحالة مرتبطة بالحساب النشط وتُحفَظ محليًا مع تحميل آمن واتجاه واجهة مطابق للغة."
      : "State is scoped to the active account and persisted locally with safe hydration and locale-aware direction.",
  };
}

function getRealReadinessNote(locale: string) {
  return isArabic(locale)
    ? "وضع الحساب الحقيقي موجود في الأساس، لكن التوجيه والتنفيذ الحقيقيين غير مفعّلين بعد."
    : "Real account mode exists in the foundation, but live routing and real execution are not enabled yet.";
}

function getAuditViewModel(
  locale: string,
  auditTraceFoundation: AuditTraceFoundationSurface,
  demoLabel: string,
  realLabel: string
) {
  const auditCopy = getAuditPanelCopy(locale);

  return {
    auditTitle: auditCopy.title,
    auditSubtitle: auditCopy.subtitle,
    auditActorLabel: auditCopy.actorLabel,
    auditAccountModeLabel: auditCopy.accountModeLabel,
    auditVisibilityLabel: auditCopy.visibilityLabel,
    auditTraceLabel: auditCopy.traceLabel,
    auditLastEventLabel: auditCopy.lastEventLabel,
    auditEmptyLabel: auditCopy.emptyLabel,
    auditAccountModeValue:
      auditTraceFoundation.currentAccountMode === "demo" ? demoLabel : realLabel,
    auditVisibilityValue:
      auditTraceFoundation.visibilityState === "operator_visible"
        ? auditCopy.visibleValue
        : auditCopy.hiddenValue,
    auditTraceValue:
      auditTraceFoundation.decisionTraceState === "linked" &&
      auditTraceFoundation.executionTraceState === "linked" &&
      auditTraceFoundation.sessionTraceState === "linked"
        ? auditCopy.linkedValue
        : auditCopy.standbyValue,
  };
}

function getSecurityViewModel(
  locale: string,
  securityFoundation: SecurityFoundationSurface,
  demoLabel: string,
  realLabel: string
) {
  const securityCopy = getSecurityPanelCopy(locale);

  return {
    securityTitle: securityCopy.title,
    securitySubtitle: securityCopy.subtitle,
    securityRouteLabel: securityCopy.routeLabel,
    securityAccessLabel: securityCopy.accessLabel,
    securityExecutionLabel: securityCopy.executionLabel,
    securityDataLabel: securityCopy.dataLabel,
    securitySecretsLabel: securityCopy.secretsLabel,
    securitySessionLabel: securityCopy.sessionLabel,
    securityRecoveryLabel: securityCopy.recoveryLabel,
    securityAlertLabel: securityCopy.alertLabel,
    securityAccountLabel: securityCopy.accountLabel,
    securityReviewedAtLabel: securityCopy.reviewedAtLabel,
    securityRouteValue: resolveSecurityRouteValue(
      locale,
      securityFoundation.routeState
    ),
    securityAccessValue: resolveSecurityAccessValue(
      locale,
      securityFoundation.accessState
    ),
    securityExecutionValue: resolveSecurityExecutionValue(
      locale,
      securityFoundation.executionProtectionState
    ),
    securityDataValue: resolveSecurityDataValue(
      locale,
      securityFoundation.dataProtectionState
    ),
    securitySecretsValue: resolveSecuritySecretsValue(
      locale,
      securityFoundation.secretState
    ),
    securitySessionValue: resolveSecuritySessionValue(
      locale,
      securityFoundation.sessionProtectionState
    ),
    securityRecoveryValue: resolveSecurityRecoveryValue(
      locale,
      securityFoundation.recoveryState
    ),
    securityAlertValue: resolveSecurityAlertValue(
      locale,
      securityFoundation.alertLevel
    ),
    securityAccountValue:
      securityFoundation.currentAccountMode === "demo" ? demoLabel : realLabel,
  };
}

export function createTradingWorkstationViewModel({
  locale,
  dict,
  userIdentity,
  accountStatus,
  accountPolicy,
  executionFoundation,
  riskFoundation,
  dataStateFoundation,
  auditTraceFoundation,
  securityFoundation,
  decision,
  riskNoteCode,
  sessionPnL,
  sessionLocked,
  openTradesCount,
}: TradingWorkstationViewModelInput): TradingWorkstationViewModel {
  const coreCopy = getCoreModeCopy(locale);
  const sessionPnLText = formatSessionPnl(sessionPnL);

  return {
    ...coreCopy,
    signalStyle: getSignalTone(decision.signal),
    riskNote: getRiskNote(riskNoteCode, dict),
    signalLabel: dict.decision.signals[decision.signal],
    sessionStateLabel: getSessionStateLabel(sessionLocked, dict),
    sessionPnLText,
    accountStatusValue: getAccountStatusValue(locale, accountStatus),
    verificationLabel: getVerificationLabel(locale, userIdentity.verification),
    jurisdictionChips: getJurisdictionChips(locale, accountPolicy),
    permissionChips: getPermissionChips(locale, accountPolicy),
    openTradesText: `${openTradesCount} / ${PLATFORM_LIMITS.maxOpenTrades}`,
    sessionPnLPositive: sessionPnL >= 0,
    ...getExecutionViewModel(locale, executionFoundation),
    ...getRiskViewModel(locale, riskFoundation, sessionPnLText),
    ...getDataStateViewModel(
      locale,
      dataStateFoundation,
      coreCopy.demoLabel,
      coreCopy.realLabel
    ),
    realReadinessNote: getRealReadinessNote(locale),
    ...getAuditViewModel(
      locale,
      auditTraceFoundation,
      coreCopy.demoLabel,
      coreCopy.realLabel
    ),
    ...getSecurityViewModel(
      locale,
      securityFoundation,
      coreCopy.demoLabel,
      coreCopy.realLabel
    ),
  };
}
