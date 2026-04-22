import type {
  AccountPreferenceAnchor,
  ExecutionGuardrailKey,
  PermissionAnchor,
  SecurityFoundationSurface,
  VerificationWorkflowAnchor,
} from "../types/platform-state";

function isArabic(locale: string) {
  return locale === "ar";
}

export function permissionLabel(locale: string, anchor: PermissionAnchor) {
  const stateText =
    anchor.state === "enabled"
      ? isArabic(locale)
        ? "مفعل"
        : "Enabled"
      : anchor.state === "read_only"
      ? isArabic(locale)
        ? "قراءة فقط"
        : "Read-only"
      : isArabic(locale)
      ? "محجوب"
      : "Blocked";

  const labelMap: Record<PermissionAnchor["key"], string> = {
    profile: isArabic(locale) ? "الملف" : "Profile",
    settings: isArabic(locale) ? "الإعدادات" : "Settings",
    sign_out: isArabic(locale) ? "الخروج" : "Sign out",
    demo_execution: isArabic(locale) ? "تنفيذ تجريبي" : "Demo execution",
    real_execution: isArabic(locale) ? "تنفيذ حقيقي" : "Real execution",
    audit_surface: isArabic(locale) ? "سطح التدقيق" : "Audit surface",
    jurisdiction_controls: isArabic(locale)
      ? "ضوابط الولاية"
      : "Jurisdiction controls",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

export function verificationWorkflowLabel(
  locale: string,
  anchor: VerificationWorkflowAnchor
) {
  const stateText =
    anchor.state === "ready"
      ? isArabic(locale)
        ? "جاهز"
        : "Ready"
      : anchor.state === "review"
      ? isArabic(locale)
        ? "قيد المراجعة"
        : "Under review"
      : isArabic(locale)
      ? "معلق"
      : "Pending";

  const labelMap: Record<VerificationWorkflowAnchor["key"], string> = {
    identity_check: isArabic(locale) ? "التحقق من الهوية" : "Identity check",
    account_review: isArabic(locale) ? "مراجعة الحساب" : "Account review",
    disclosure_acceptance: isArabic(locale)
      ? "قبول الإفصاحات"
      : "Disclosure acceptance",
    live_activation: isArabic(locale) ? "تفعيل الحقيقي" : "Live activation",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

export function preferenceLabel(locale: string, anchor: AccountPreferenceAnchor) {
  const keyMap: Record<AccountPreferenceAnchor["key"], string> = {
    language: isArabic(locale) ? "اللغة" : "Language",
    direction: isArabic(locale) ? "الاتجاه" : "Direction",
    density: isArabic(locale) ? "الكثافة" : "Density",
    chart_layout: isArabic(locale) ? "هيكل الرسم" : "Chart layout",
    risk_confirmation: isArabic(locale) ? "تأكيد المخاطر" : "Risk confirmation",
  };

  const valueMap: Record<string, string> = {
    Arabic: isArabic(locale) ? "العربية" : "Arabic",
    English: isArabic(locale) ? "الإنجليزية" : "English",
    RTL: "RTL",
    LTR: "LTR",
    Adaptive: isArabic(locale) ? "تكيفية" : "Adaptive",
    "Primary workspace": isArabic(locale) ? "مساحة رئيسية" : "Primary workspace",
    Enabled: isArabic(locale) ? "مفعل" : "Enabled",
  };

  return `${keyMap[anchor.key]}: ${valueMap[anchor.value] || anchor.value}`;
}

export function onboardingStageLabel(locale: string, stage: string) {
  const stageMap: Record<string, string> = {
    foundation: isArabic(locale)
      ? "مرحلة الإعداد: أساس"
      : "Onboarding: Foundation",
    identity_ready: isArabic(locale)
      ? "مرحلة الإعداد: هوية جاهزة"
      : "Onboarding: Identity-ready",
    account_ready: isArabic(locale)
      ? "مرحلة الإعداد: حساب جاهز"
      : "Onboarding: Account-ready",
    activation_review: isArabic(locale)
      ? "مرحلة الإعداد: مراجعة التفعيل"
      : "Onboarding: Activation review",
    active: isArabic(locale) ? "مرحلة الإعداد: نشط" : "Onboarding: Active",
  };

  return stageMap[stage] || stage;
}

export function executionGuardrailLabel(
  locale: string,
  key: ExecutionGuardrailKey
) {
  const map: Record<ExecutionGuardrailKey, string> = {
    demo_only: isArabic(locale)
      ? "تنفيذ حقيقي محجوب"
      : "Live execution blocked",
    session_locked: isArabic(locale) ? "الجلسة مقفلة" : "Session locked",
    max_open_trades: isArabic(locale)
      ? "تم بلوغ الحد الأقصى"
      : "Max open trades reached",
  };

  return map[key];
}

export function securityRouteValue(
  locale: string,
  routeState: SecurityFoundationSurface["routeState"]
) {
  return routeState === "guarded"
    ? isArabic(locale)
      ? "محروس"
      : "Guarded"
    : routeState;
}

export function securityAccessValue(
  locale: string,
  accessState: SecurityFoundationSurface["accessState"]
) {
  return accessState === "least_privilege"
    ? isArabic(locale)
      ? "أقل صلاحية"
      : "Least privilege"
    : accessState;
}

export function securityExecutionValue(
  locale: string,
  executionProtectionState: SecurityFoundationSurface["executionProtectionState"]
) {
  return executionProtectionState === "demo_only_enforced"
    ? isArabic(locale)
      ? "تجريبي فقط مفروض"
      : "Demo-only enforced"
    : executionProtectionState;
}

export function securityDataValue(
  locale: string,
  dataProtectionState: SecurityFoundationSurface["dataProtectionState"]
) {
  return dataProtectionState === "mode_separated"
    ? isArabic(locale)
      ? "فصل حسب الوضع"
      : "Mode-separated"
    : dataProtectionState;
}

export function securitySecretsValue(
  locale: string,
  secretState: SecurityFoundationSurface["secretState"]
) {
  return secretState === "local_env_guarded"
    ? isArabic(locale)
      ? "ملف بيئة محلي محروس"
      : "Local env guarded"
    : secretState;
}

export function securitySessionValue(
  locale: string,
  sessionProtectionState: SecurityFoundationSurface["sessionProtectionState"]
) {
  return sessionProtectionState === "guarded"
    ? isArabic(locale)
      ? "محروسة"
      : "Guarded"
    : sessionProtectionState;
}

export function securityRecoveryValue(
  locale: string,
  recoveryState: SecurityFoundationSurface["recoveryState"]
) {
  return recoveryState === "safe_fallback_ready"
    ? isArabic(locale)
      ? "بديل آمن جاهز"
      : "Safe fallback ready"
    : recoveryState;
}

export function securityAlertValue(
  locale: string,
  alertLevel: SecurityFoundationSurface["alertLevel"]
) {
  return alertLevel === "elevated"
    ? isArabic(locale)
      ? "مرتفع"
      : "Elevated"
    : isArabic(locale)
    ? "طبيعي"
    : "Normal";
}

export function getCoreModeCopy(locale: string) {
  return {
    modeLabel: isArabic(locale) ? "وضع الحساب" : "Account",
    demoLabel: isArabic(locale) ? "تجريبي" : "Demo",
    realLabel: isArabic(locale) ? "حقيقي" : "Real",
    analysisTimeframeLabel: isArabic(locale)
      ? "إطار التحليل"
      : "Analysis timeframe",
    durationFieldLabel: isArabic(locale)
      ? "مدة التنفيذ"
      : "Execution duration",
    accountStatusLabel: isArabic(locale) ? "حالة الحساب" : "Account status",
    profileLabel: isArabic(locale) ? "الملف" : "Profile",
    settingsLabel: isArabic(locale) ? "الإعدادات" : "Settings",
    signOutLabel: isArabic(locale) ? "الخروج" : "Sign out",
    policyPanelLabel: isArabic(locale) ? "سياسة الحساب" : "Account policy",
    userRole: isArabic(locale) ? "المالك" : "Owner",
  };
}

export function getAuditPanelCopy(locale: string) {
  return {
    title: isArabic(locale) ? "لوحة التدقيق والتتبع" : "Audit + Traceability",
    subtitle: isArabic(locale)
      ? "أثر زمني واضح للأحداث الأساسية داخل المنصة."
      : "A visible event timeline for core platform actions.",
    actorLabel: isArabic(locale) ? "الفاعل" : "Actor",
    accountModeLabel: isArabic(locale) ? "الحساب" : "Account",
    visibilityLabel: isArabic(locale) ? "الرؤية" : "Visibility",
    traceLabel: isArabic(locale) ? "حالة الربط" : "Trace state",
    lastEventLabel: isArabic(locale) ? "آخر حدث" : "Last event",
    emptyLabel: isArabic(locale)
      ? "لا توجد أحداث تدقيق بعد."
      : "No audit events yet.",
    visibleValue: isArabic(locale) ? "مرئي للمشغل" : "Operator visible",
    hiddenValue: isArabic(locale) ? "مخفي" : "Hidden",
    linkedValue: isArabic(locale) ? "مرتبط" : "Linked",
    standbyValue: isArabic(locale) ? "انتظار" : "Standby",
  };
}

export function getSecurityPanelCopy(locale: string) {
  return {
    title: isArabic(locale) ? "لوحة الأمان" : "Security Foundation",
    subtitle: isArabic(locale)
      ? "حواجز الأمان الأساسية الفعالة داخل المنصة."
      : "Core active security guardrails across the platform.",
    routeLabel: isArabic(locale) ? "المسار" : "Route",
    accessLabel: isArabic(locale) ? "الوصول" : "Access",
    executionLabel: isArabic(locale) ? "حماية التنفيذ" : "Execution protection",
    dataLabel: isArabic(locale) ? "حماية البيانات" : "Data protection",
    secretsLabel: isArabic(locale) ? "الأسرار" : "Secrets",
    sessionLabel: isArabic(locale) ? "الجلسة" : "Session",
    recoveryLabel: isArabic(locale) ? "الاستعادة" : "Recovery",
    alertLabel: isArabic(locale) ? "التنبيه" : "Alert",
    accountLabel: isArabic(locale) ? "الحساب" : "Account",
    reviewedAtLabel: isArabic(locale) ? "آخر مراجعة" : "Last reviewed",
  };
}