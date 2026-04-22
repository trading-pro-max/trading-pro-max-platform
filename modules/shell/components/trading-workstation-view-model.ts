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
} from "../types/platform-state";
import {
  executionGuardrailLabel,
  getAuditPanelCopy,
  getCoreModeCopy,
  getSecurityPanelCopy,
  securityAccessValue as resolveSecurityAccessValue,
  securityAlertValue as resolveSecurityAlertValue,
  securityDataValue as resolveSecurityDataValue,
  securityExecutionValue as resolveSecurityExecutionValue,
  securityRecoveryValue as resolveSecurityRecoveryValue,
  securityRouteValue as resolveSecurityRouteValue,
  securitySecretsValue as resolveSecuritySecretsValue,
  securitySessionValue as resolveSecuritySessionValue,
} from "./trading-workstation-labels";

export type TradingWorkstationViewModelInput = {
  locale: string;
  dict: Dictionary;
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

export type WorkstationStatusTone = "approved" | "pending" | "restricted" | "blocked";

export type ComplianceDisclosureView = {
  label: string;
  status: string;
  meta: string;
  tone: WorkstationStatusTone;
};

export type ComplianceMetaView = {
  label: string;
  value: string;
  tone?: WorkstationStatusTone;
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
  accountLifecycleLabel: string;
  accountLifecycleDescription: string;
  accountLifecycleTone: WorkstationStatusTone;
  reviewStatusLabel: string;
  reviewStatusDescription: string;
  reviewStatusTone: WorkstationStatusTone;
  disclosureSummaryLabel: string;
  disclosureSummaryValue: string;
  paperAccessLabel: string;
  paperAccessValue: string;
  paperAccessTone: WorkstationStatusTone;
  liveAccessLabel: string;
  liveAccessValue: string;
  ticketReadinessLabel: string;
  ticketReadinessValue: string;
  ticketReadinessTone: WorkstationStatusTone;
  ticketGateLabel: string;
  ticketGateValue: string;
  ticketGateTone: WorkstationStatusTone;
  ticketNextStepLabel: string;
  ticketNextStepValue: string;
  ticketOperationalLabel: string;
  ticketOperationalValue: string;
  ticketOperationalTone: WorkstationStatusTone;
  ticketSupportNote: string;
  compliancePanelSubtitle: string;
  compliancePanelBadge: string;
  disclosureRows: ComplianceDisclosureView[];
  activationRows: ComplianceMetaView[];
  acceptDisclosuresLabel: string;
  submitReviewLabel: string;
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

function formatTimestamp(locale: string, value: string, fallback: string) {
  if (!value) return fallback;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(locale);
}

function lifecycleTone(
  state: AccountPolicySurface["lifecycle"]["state"]
): WorkstationStatusTone {
  if (state === "paper_active") return "approved";
  if (state === "restricted") return "restricted";
  if (state === "blocked") return "blocked";
  return "pending";
}

function reviewTone(
  state: AccountPolicySurface["review"]["state"]
): WorkstationStatusTone {
  if (state === "approved_for_paper") return "approved";
  if (state === "restricted") return "restricted";
  if (state === "rejected") return "blocked";
  return "pending";
}

function activationTone(
  state: AccountPolicySurface["activation"]["paperState"]
): WorkstationStatusTone {
  if (state === "enabled") return "approved";
  if (state === "restricted") return "restricted";
  if (state === "blocked") return "blocked";
  return "pending";
}

function getLifecycleCopy(
  locale: string,
  state: AccountPolicySurface["lifecycle"]["state"]
) {
  const arabic = isArabic(locale);

  switch (state) {
    case "visitor":
      return {
        label: arabic ? "زائر" : "Visitor",
        description: arabic
          ? "لم يبدأ ملف الحساب بعد."
          : "The account profile has not started yet.",
        tone: lifecycleTone(state),
      };
    case "onboarding":
      return {
        label: arabic ? "تهيئة أولية" : "Onboarding",
        description: arabic
          ? "يتم إعداد ملف الحساب وما زالت خطوات الامتثال الأساسية مطلوبة."
          : "The account is being set up and still needs core compliance steps.",
        tone: lifecycleTone(state),
      };
    case "disclosures_pending":
      return {
        label: arabic ? "إفصاحات معلّقة" : "Disclosures pending",
        description: arabic
          ? "يجب اعتماد الإفصاحات المطلوبة قبل تفعيل التنفيذ الورقي."
          : "Required disclosures must be accepted before paper execution can be activated.",
        tone: lifecycleTone(state),
      };
    case "kyc_pending":
      return {
        label: arabic ? "تحقق الحساب جارٍ" : "Verification in progress",
        description: arabic
          ? "يجري استكمال التحقق المحلي وجاهزية الحساب للورقي."
          : "Local verification and paper-readiness checks are still in progress.",
        tone: lifecycleTone(state),
      };
    case "review_pending":
      return {
        label: arabic ? "بانتظار المراجعة" : "Pending review",
        description: arabic
          ? "تم إرسال الجاهزية للمراجعة، والتنفيذ الورقي ما زال مقيّداً."
          : "Readiness has been submitted for review, and paper execution stays gated.",
        tone: lifecycleTone(state),
      };
    case "paper_active":
      return {
        label: arabic ? "ورقي نشط" : "Paper active",
        description: arabic
          ? "الحساب معتمد محلياً للتداول الورقي فقط، مع بقاء المسار الحي محجوباً."
          : "The account is locally approved for paper trading only, while live routing remains blocked.",
        tone: lifecycleTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "مقيّد" : "Restricted",
        description: arabic
          ? "تم تقييد الحساب بانتظار تدخل الامتثال."
          : "The account is restricted pending compliance intervention.",
        tone: lifecycleTone(state),
      };
    case "blocked":
      return {
        label: arabic ? "محجوب" : "Blocked",
        description: arabic
          ? "تم حجب الحساب عن فتح مراكز جديدة."
          : "The account is blocked from opening new positions.",
        tone: lifecycleTone(state),
      };
  }
}

function getReviewCopy(
  locale: string,
  state: AccountPolicySurface["review"]["state"]
) {
  const arabic = isArabic(locale);

  switch (state) {
    case "not_started":
      return {
        label: arabic ? "لم يبدأ" : "Not started",
        description: arabic
          ? "لم تبدأ مراجعة الجاهزية بعد."
          : "The readiness review has not started yet.",
        tone: reviewTone(state),
      };
    case "in_progress":
      return {
        label: arabic ? "قيد التنفيذ" : "In progress",
        description: arabic
          ? "يتم تجهيز ملف المراجعة الورقية محلياً."
          : "The local paper-readiness review file is being prepared.",
        tone: reviewTone(state),
      };
    case "pending_review":
      return {
        label: arabic ? "قيد المراجعة" : "Pending review",
        description: arabic
          ? "تم إرسال الملف للمراجعة المحلية ويجري الانتظار."
          : "The file has been submitted for local review and is waiting in queue.",
        tone: reviewTone(state),
      };
    case "approved_for_paper":
      return {
        label: arabic ? "معتمد للتجريبي" : "Approved for paper",
        description: arabic
          ? "المراجعة تسمح بالتنفيذ الورقي فقط."
          : "The review permits paper execution only.",
        tone: reviewTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "مقيّد" : "Restricted",
        description: arabic
          ? "تم تقييد المراجعة ولا يمكن التقدم حالياً."
          : "The review is restricted and cannot progress right now.",
        tone: reviewTone(state),
      };
    case "rejected":
      return {
        label: arabic ? "محجوب" : "Blocked",
        description: arabic
          ? "تم رفض الجاهزية المحلية للحساب."
          : "Local account readiness was rejected.",
        tone: reviewTone(state),
      };
  }
}

function getPaperAccessCopy(
  locale: string,
  state: AccountPolicySurface["activation"]["paperState"]
) {
  const arabic = isArabic(locale);

  switch (state) {
    case "enabled":
      return {
        label: arabic ? "مفعّل" : "Enabled",
        tone: activationTone(state),
      };
    case "gated":
      return {
        label: arabic ? "مقيّد" : "Gated",
        tone: activationTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "مقيّد" : "Restricted",
        tone: activationTone(state),
      };
    case "blocked":
      return {
        label: arabic ? "محجوب" : "Blocked",
        tone: activationTone(state),
      };
  }
}

function getActivationReasonCopy(
  locale: string,
  reason: AccountPolicySurface["activation"]["reason"]
) {
  const arabic = isArabic(locale);

  switch (reason) {
    case "paper_ready":
      return {
        label: arabic ? "جاهز للورقي" : "Paper-ready",
        description: arabic
          ? "التنفيذ الورقي متاح داخل المسار المحلي الآمن."
          : "Paper execution is available inside the local-safe route.",
        tone: "approved" as const,
      };
    case "disclosures_required":
      return {
        label: arabic ? "الإفصاحات مطلوبة" : "Disclosures required",
        description: arabic
          ? "يبقى إدخال الأوامر مرئياً لكن التنفيذ معطّل حتى اعتماد الإفصاحات."
          : "Order entry stays visible, but execution remains disabled until disclosures are accepted.",
        tone: "pending" as const,
      };
    case "kyc_required":
      return {
        label: arabic ? "التحقق مطلوب" : "Verification required",
        description: arabic
          ? "لا يزال ملف الجاهزية بحاجة إلى استكمال قبل السماح بالورقي."
          : "The readiness file still needs verification before paper access can be granted.",
        tone: "pending" as const,
      };
    case "review_pending":
      return {
        label: arabic ? "المراجعة معلّقة" : "Review pending",
        description: arabic
          ? "تم إرسال الملف للمراجعة ويظل التنفيذ الورقي قيد الانتظار."
          : "The file has been submitted for review, and paper execution remains pending.",
        tone: "pending" as const,
      };
    case "paper_only_mode":
      return {
        label: arabic ? "حماية ورقية فقط" : "Paper-only protection",
        description: arabic
          ? "هذا المسار المحلي يمنع أي تنفيذ حي أو أموال حقيقية."
          : "This local-safe environment blocks any live or real-money execution path.",
        tone: "pending" as const,
      };
    case "restricted_account":
      return {
        label: arabic ? "الحساب مقيّد" : "Restricted account",
        description: arabic
          ? "التنفيذ مقيّد بقرار امتثال محلي."
          : "Execution is restricted by a local compliance decision.",
        tone: "restricted" as const,
      };
    case "blocked_account":
      return {
        label: arabic ? "الحساب محجوب" : "Blocked account",
        description: arabic
          ? "التنفيذ محجوب بالكامل لهذا الحساب."
          : "Execution is fully blocked for this account.",
        tone: "blocked" as const,
      };
  }
}

function getDisclosureLabel(
  locale: string,
  key: AccountPolicySurface["disclosures"][number]["key"]
) {
  const arabic = isArabic(locale);

  switch (key) {
    case "risk":
      return arabic ? "إفصاح المخاطر" : "Risk disclosure";
    case "paper_trading":
      return arabic ? "إشعار التداول الورقي" : "Paper-trading notice";
    case "jurisdiction":
      return arabic ? "إشعار الولاية والوصول" : "Jurisdiction notice";
    case "terms":
      return arabic ? "إقرار الشروط" : "Terms acknowledgment";
  }
}

function getNextStepValue(
  locale: string,
  nextStep: AccountPolicySurface["activation"]["nextStep"]
) {
  const arabic = isArabic(locale);

  switch (nextStep) {
    case "accept_disclosures":
      return arabic ? "اعتماد الإفصاحات المطلوبة" : "Accept required disclosures";
    case "complete_verification":
      return arabic ? "استكمال مراجعة الجاهزية" : "Complete readiness review";
    case "await_review":
      return arabic ? "انتظار قرار المراجعة" : "Await review decision";
    case "paper_ready":
      return arabic ? "المسار الورقي جاهز" : "Paper route available";
    case "contact_support":
      return arabic ? "التواصل مع الامتثال" : "Contact compliance support";
  }
}

function getOperationalExecutionCopy(
  locale: string,
  accountPolicy: AccountPolicySurface,
  riskFoundation: RiskFoundationSurface,
  decision: Decision
) {
  const arabic = isArabic(locale);

  if (!accountPolicy.activation.executionEnabled) {
    return {
      value: getActivationReasonCopy(locale, accountPolicy.activation.reason).description,
      tone: getActivationReasonCopy(locale, accountPolicy.activation.reason).tone,
    };
  }

  if (riskFoundation.sessionState === "locked") {
    return {
      value: arabic
        ? "تم قفل الجلسة بسبب حدود الخسارة؛ لا يمكن فتح مراكز جديدة."
        : "The session is locked by loss limits, so no new positions can open.",
      tone: "blocked" as const,
    };
  }

  if (riskFoundation.remainingTradeSlots === 0) {
    return {
      value: arabic
        ? "تم بلوغ الحد الأقصى للصفقات المفتوحة."
        : "The maximum open-trade limit has been reached.",
      tone: "restricted" as const,
    };
  }

  if (decision.signal === "wait") {
    return {
      value: arabic
        ? "التنفيذ بالإشارة في وضع انتظار، بينما يظل التنفيذ الورقي اليدوي متاحاً."
        : "Signal execution is on standby while manual paper entry remains available.",
      tone: "pending" as const,
    };
  }

  return {
    value: arabic
      ? "التنفيذ الورقي المحلي متاح ضمن الحواجز الحالية."
      : "Local paper execution is available inside the current guardrails.",
    tone: "approved" as const,
  };
}

function getComplianceViewModel(
  locale: string,
  accountPolicy: AccountPolicySurface,
  riskFoundation: RiskFoundationSurface,
  decision: Decision,
  riskNote: string
) {
  const arabic = isArabic(locale);
  const lifecycle = getLifecycleCopy(locale, accountPolicy.lifecycle.state);
  const review = getReviewCopy(locale, accountPolicy.review.state);
  const activationReason = getActivationReasonCopy(
    locale,
    accountPolicy.activation.reason
  );
  const paperAccess = getPaperAccessCopy(
    locale,
    accountPolicy.activation.paperState
  );
  const acceptedDisclosures = accountPolicy.disclosures.filter(
    (item) => item.state === "accepted"
  ).length;
  const disclosurePendingFallback = arabic
    ? "مطلوب قبل التفعيل الورقي"
    : "Required before paper activation";
  const disclosureAcceptedFallback = arabic
    ? "معتمد في الملف المحلي"
    : "Accepted in the local paper profile";
  const reviewUpdatedFallback = arabic ? "لم يُحدّث بعد" : "No review update yet";
  const liveAccessValue = arabic ? "محجوب محلياً" : "Blocked locally";
  const operational = getOperationalExecutionCopy(
    locale,
    accountPolicy,
    riskFoundation,
    decision
  );

  return {
    policyPanelLabel: arabic ? "الامتثال + التفعيل" : "Compliance + Activation",
    accountLifecycleLabel: lifecycle.label,
    accountLifecycleDescription: lifecycle.description,
    accountLifecycleTone: lifecycle.tone,
    reviewStatusLabel: review.label,
    reviewStatusDescription: review.description,
    reviewStatusTone: review.tone,
    disclosureSummaryLabel: arabic ? "الإفصاحات" : "Disclosures",
    disclosureSummaryValue: arabic
      ? `${acceptedDisclosures} / ${accountPolicy.disclosures.length} معتمدة`
      : `${acceptedDisclosures} / ${accountPolicy.disclosures.length} accepted`,
    paperAccessLabel: arabic ? "الوصول الورقي" : "Paper access",
    paperAccessValue: paperAccess.label,
    paperAccessTone: paperAccess.tone,
    liveAccessLabel: arabic ? "التنفيذ الحي" : "Live execution",
    liveAccessValue,
    ticketReadinessLabel: arabic ? "الجاهزية الحالية" : "Current readiness",
    ticketReadinessValue: activationReason.label,
    ticketReadinessTone: activationReason.tone,
    ticketGateLabel: arabic ? "حالة التنفيذ" : "Execution gate",
    ticketGateValue: activationReason.label,
    ticketGateTone: activationReason.tone,
    ticketNextStepLabel: arabic ? "الخطوة التالية" : "Next step",
    ticketNextStepValue: getNextStepValue(
      locale,
      accountPolicy.activation.nextStep
    ),
    ticketOperationalLabel: arabic ? "الوضع التشغيلي" : "Operational state",
    ticketOperationalValue: operational.value,
    ticketOperationalTone: operational.tone,
    ticketSupportNote: !accountPolicy.activation.executionEnabled
      ? activationReason.description
      : riskFoundation.sessionState === "locked" ||
        riskFoundation.remainingTradeSlots === 0
      ? riskNote
      : activationReason.description,
    compliancePanelSubtitle: lifecycle.description,
    compliancePanelBadge: paperAccess.label,
    disclosureRows: accountPolicy.disclosures.map((item) => ({
      label: getDisclosureLabel(locale, item.key),
      status: item.state === "accepted" ? (arabic ? "معتمد" : "Accepted") : arabic ? "معلّق" : "Pending",
      meta:
        item.state === "accepted"
          ? formatTimestamp(locale, item.acceptedAt || "", disclosureAcceptedFallback)
          : disclosurePendingFallback,
      tone: item.state === "accepted" ? ("approved" as const) : ("pending" as const),
    })),
    activationRows: [
      {
        label: arabic ? "مرجع المراجعة" : "Review reference",
        value: accountPolicy.review.reference,
      },
      {
        label: arabic ? "آخر تحديث مراجعة" : "Review updated",
        value: formatTimestamp(
          locale,
          accountPolicy.review.updatedAt,
          reviewUpdatedFallback
        ),
      },
      {
        label: arabic ? "الوصول الورقي" : "Paper access",
        value: paperAccess.label,
        tone: paperAccess.tone,
      },
      {
        label: arabic ? "التنفيذ الحي" : "Live execution",
        value: liveAccessValue,
        tone: "blocked" as const,
      },
      {
        label: arabic ? "سبب البوابة" : "Gate reason",
        value: activationReason.label,
        tone: activationReason.tone,
      },
      {
        label: arabic ? "الخطوة التالية" : "Next step",
        value: getNextStepValue(locale, accountPolicy.activation.nextStep),
      },
    ],
    acceptDisclosuresLabel: arabic ? "اعتماد الإفصاحات" : "Accept disclosures",
    submitReviewLabel: arabic ? "إرسال للمراجعة" : "Submit for review",
  };
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
  const riskNote = getRiskNote(riskNoteCode, dict);

  return {
    ...coreCopy,
    signalStyle: getSignalTone(decision.signal),
    riskNote,
    signalLabel: dict.decision.signals[decision.signal],
    sessionStateLabel: getSessionStateLabel(sessionLocked, dict),
    sessionPnLText,
    accountStatusValue: getAccountStatusValue(locale, accountStatus),
    openTradesText: `${openTradesCount} / ${PLATFORM_LIMITS.maxOpenTrades}`,
    sessionPnLPositive: sessionPnL >= 0,
    ...getComplianceViewModel(
      locale,
      accountPolicy,
      riskFoundation,
      decision,
      riskNote
    ),
    ...getExecutionViewModel(locale, executionFoundation),
    ...getRiskViewModel(locale, riskFoundation, sessionPnLText),
    ...getDataStateViewModel(
      locale,
      dataStateFoundation,
      coreCopy.demoLabel,
      coreCopy.realLabel
    ),
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
