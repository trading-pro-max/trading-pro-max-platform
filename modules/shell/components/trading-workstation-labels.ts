const isArabic = (locale: string) => locale === "ar";

const fallbackLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function onboardingStageLabel(locale: string, stage: string) {
  const valueMap: Record<string, string> = isArabic(locale)
    ? {
        started: "بدأ",
        profile: "الملف",
        verification: "التحقق",
        review: "المراجعة",
        ready: "جاهز",
        live: "مباشر",
      }
    : {
        started: "Started",
        profile: "Profile",
        verification: "Verification",
        review: "Review",
        ready: "Ready",
        live: "Live",
      };

  return valueMap[stage] ?? fallbackLabel(stage);
}

export function executionGuardrailLabel(locale: string, key: string) {
  const valueMap: Record<string, string> = isArabic(locale)
    ? {
        demo_only: "تجريبي فقط",
        verification_required: "التحقق مطلوب",
        permission_required: "الصلاحية مطلوبة",
        jurisdiction_restricted: "مقيد حسب الولاية",
        policy_blocked: "محظور بالسياسة",
        session_locked: "الجلسة مقفلة",
        capacity_limit: "حد السعة",
        cooldown_active: "فترة تهدئة",
      }
    : {
        demo_only: "Demo only",
        verification_required: "Verification required",
        permission_required: "Permission required",
        jurisdiction_restricted: "Jurisdiction restricted",
        policy_blocked: "Policy blocked",
        session_locked: "Session locked",
        capacity_limit: "Capacity limit",
        cooldown_active: "Cooldown active",
      };

  return valueMap[key] ?? fallbackLabel(key);
}

export function permissionLabel(
  locale: string,
  anchor: { key: string; state: string }
) {
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

  const labelMap: Record<string, string> = {
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

  return `${labelMap[anchor.key] ?? fallbackLabel(anchor.key)}: ${stateText}`;
}

export function verificationWorkflowLabel(
  locale: string,
  anchor: { key: string; state: string }
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

  const labelMap: Record<string, string> = {
    identity_check: isArabic(locale) ? "التحقق من الهوية" : "Identity check",
    account_review: isArabic(locale) ? "مراجعة الحساب" : "Account review",
    disclosure_acceptance: isArabic(locale)
      ? "قبول الإفصاحات"
      : "Disclosure acceptance",
    live_activation: isArabic(locale) ? "تفعيل الحقيقي" : "Live activation",
  };

  return `${labelMap[anchor.key] ?? fallbackLabel(anchor.key)}: ${stateText}`;
}

export function preferenceLabel(locale: string, anchor: { key: string }) {
  const keyMap: Record<string, string> = {
    language: isArabic(locale) ? "اللغة" : "Language",
    direction: isArabic(locale) ? "الاتجاه" : "Direction",
    density: isArabic(locale) ? "الكثافة" : "Density",
    chart_layout: isArabic(locale) ? "مخطط الرسم" : "Chart layout",
    risk_confirmations: isArabic(locale) ? "تأكيد المخاطر" : "Risk confirmations",
  };

  return keyMap[anchor.key] ?? fallbackLabel(anchor.key);
}

export function securityRouteValue(locale: string, routeState: string) {
  const valueMap: Record<string, string> = {
    guarded: isArabic(locale) ? "محروس" : "Guarded",
    open: isArabic(locale) ? "مفتوح" : "Open",
    restricted: isArabic(locale) ? "مقيد" : "Restricted",
  };

  return valueMap[routeState] ?? fallbackLabel(routeState);
}

export function securityAccessValue(locale: string, accessState: string) {
  const valueMap: Record<string, string> = {
    least_privilege: isArabic(locale) ? "أقل صلاحية" : "Least privilege",
    role_scoped: isArabic(locale) ? "حسب الدور" : "Role scoped",
    open: isArabic(locale) ? "مفتوح" : "Open",
  };

  return valueMap[accessState] ?? fallbackLabel(accessState);
}

export function securityExecutionValue(
  locale: string,
  executionProtectionState: string
) {
  const valueMap: Record<string, string> = {
    demo_only_enforced: isArabic(locale)
      ? "تجريبي فقط مفروض"
      : "Demo-only enforced",
    guarded: isArabic(locale) ? "محروس" : "Guarded",
    open: isArabic(locale) ? "مفتوح" : "Open",
  };

  return valueMap[executionProtectionState] ?? fallbackLabel(executionProtectionState);
}

export function securityDataValue(locale: string, dataProtectionState: string) {
  const valueMap: Record<string, string> = {
    mode_separated: isArabic(locale) ? "فصل حسب النمط" : "Mode-separated",
    encrypted: isArabic(locale) ? "مشفر" : "Encrypted",
    guarded: isArabic(locale) ? "محروس" : "Guarded",
  };

  return valueMap[dataProtectionState] ?? fallbackLabel(dataProtectionState);
}

export function securitySecretsValue(locale: string, secretState: string) {
  const valueMap: Record<string, string> = {
    local_env_guarded: isArabic(locale)
      ? "بيئة محلية محروسة"
      : "Local env guarded",
    vaulted: isArabic(locale) ? "مؤمّن" : "Vaulted",
    open: isArabic(locale) ? "مفتوح" : "Open",
  };

  return valueMap[secretState] ?? fallbackLabel(secretState);
}

export function securitySessionValue(
  locale: string,
  sessionProtectionState: string
) {
  const valueMap: Record<string, string> = {
    guarded: isArabic(locale) ? "محروسة" : "Guarded",
    linked: isArabic(locale) ? "مرتبطة" : "Linked",
    open: isArabic(locale) ? "مفتوحة" : "Open",
  };

  return valueMap[sessionProtectionState] ?? fallbackLabel(sessionProtectionState);
}

export function securityRecoveryValue(locale: string, recoveryState: string) {
  const valueMap: Record<string, string> = {
    safe_fallback_ready: isArabic(locale)
      ? "بديل آمن جاهز"
      : "Safe fallback ready",
    ready: isArabic(locale) ? "جاهز" : "Ready",
    unavailable: isArabic(locale) ? "غير متاح" : "Unavailable",
  };

  return valueMap[recoveryState] ?? fallbackLabel(recoveryState);
}

export function securityAlertValue(locale: string, alertLevel: string) {
  const valueMap: Record<string, string> = {
    normal: isArabic(locale) ? "طبيعي" : "Normal",
    elevated: isArabic(locale) ? "مرتفع" : "Elevated",
    critical: isArabic(locale) ? "حرج" : "Critical",
  };

  return valueMap[alertLevel] ?? fallbackLabel(alertLevel);
}