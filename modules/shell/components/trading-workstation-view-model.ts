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
    return arabic ? "ظ†ط´ط·" : "Active";
  }

  return arabic ? "ظ‚ط±ط§ط،ط© ظپظ‚ط·" : "Read-only";
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
        label: arabic ? "ط²ط§ط¦ط±" : "Visitor",
        description: arabic
          ? "ظ„ظ… ظٹط¨ط¯ط£ ظ…ظ„ظپ ط§ظ„ط­ط³ط§ط¨ ط¨ط¹ط¯."
          : "The account profile has not started yet.",
        tone: lifecycleTone(state),
      };
    case "onboarding":
      return {
        label: arabic ? "طھظ‡ظٹط¦ط© ط£ظˆظ„ظٹط©" : "Onboarding",
        description: arabic
          ? "ظٹطھظ… ط¥ط¹ط¯ط§ط¯ ظ…ظ„ظپ ط§ظ„ط­ط³ط§ط¨ ظˆظ…ط§ ط²ط§ظ„طھ ط®ط·ظˆط§طھ ط§ظ„ط§ظ…طھط«ط§ظ„ ط§ظ„ط£ط³ط§ط³ظٹط© ظ…ط·ظ„ظˆط¨ط©."
          : "The account is being set up and still needs core compliance steps.",
        tone: lifecycleTone(state),
      };
    case "disclosures_pending":
      return {
        label: arabic ? "ط¥ظپطµط§ط­ط§طھ ظ…ط¹ظ„ظ‘ظ‚ط©" : "Disclosures pending",
        description: arabic
          ? "ظٹط¬ط¨ ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¥ظپطµط§ط­ط§طھ ط§ظ„ظ…ط·ظ„ظˆط¨ط© ظ‚ط¨ظ„ طھظپط¹ظٹظ„ ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ."
          : "Required disclosures must be accepted before paper execution can be activated.",
        tone: lifecycleTone(state),
      };
    case "kyc_pending":
      return {
        label: arabic ? "طھط­ظ‚ظ‚ ط§ظ„ط­ط³ط§ط¨ ط¬ط§ط±ظچ" : "Verification in progress",
        description: arabic
          ? "ظٹط¬ط±ظٹ ط§ط³طھظƒظ…ط§ظ„ ط§ظ„طھط­ظ‚ظ‚ ط§ظ„ظ…ط­ظ„ظٹ ظˆط¬ط§ظ‡ط²ظٹط© ط§ظ„ط­ط³ط§ط¨ ظ„ظ„ظˆط±ظ‚ظٹ."
          : "Local verification and paper-readiness checks are still in progress.",
        tone: lifecycleTone(state),
      };
    case "review_pending":
      return {
        label: arabic ? "ط¨ط§ظ†طھط¸ط§ط± ط§ظ„ظ…ط±ط§ط¬ط¹ط©" : "Pending review",
        description: arabic
          ? "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ط¬ط§ظ‡ط²ظٹط© ظ„ظ„ظ…ط±ط§ط¬ط¹ط©طŒ ظˆط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ظ…ط§ ط²ط§ظ„ ظ…ظ‚ظٹظ‘ط¯ط§ظ‹."
          : "Readiness has been submitted for review, and paper execution stays gated.",
        tone: lifecycleTone(state),
      };
    case "paper_active":
      return {
        label: arabic ? "ظˆط±ظ‚ظٹ ظ†ط´ط·" : "Paper active",
        description: arabic
          ? "ط§ظ„ط­ط³ط§ط¨ ظ…ط¹طھظ…ط¯ ظ…ط­ظ„ظٹط§ظ‹ ظ„ظ„طھط¯ط§ظˆظ„ ط§ظ„ظˆط±ظ‚ظٹ ظپظ‚ط·طŒ ظ…ط¹ ط¨ظ‚ط§ط، ط§ظ„ظ…ط³ط§ط± ط§ظ„ط­ظٹ ظ…ط­ط¬ظˆط¨ط§ظ‹."
          : "The account is locally approved for paper trading only, while live routing remains blocked.",
        tone: lifecycleTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "ظ…ظ‚ظٹظ‘ط¯" : "Restricted",
        description: arabic
          ? "طھظ… طھظ‚ظٹظٹط¯ ط§ظ„ط­ط³ط§ط¨ ط¨ط§ظ†طھط¸ط§ط± طھط¯ط®ظ„ ط§ظ„ط§ظ…طھط«ط§ظ„."
          : "The account is restricted pending compliance intervention.",
        tone: lifecycleTone(state),
      };
    case "blocked":
      return {
        label: arabic ? "ظ…ط­ط¬ظˆط¨" : "Blocked",
        description: arabic
          ? "طھظ… ط­ط¬ط¨ ط§ظ„ط­ط³ط§ط¨ ط¹ظ† ظپطھط­ ظ…ط±ط§ظƒط² ط¬ط¯ظٹط¯ط©."
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
        label: arabic ? "ظ„ظ… ظٹط¨ط¯ط£" : "Not started",
        description: arabic
          ? "ظ„ظ… طھط¨ط¯ط£ ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¬ط§ظ‡ط²ظٹط© ط¨ط¹ط¯."
          : "The readiness review has not started yet.",
        tone: reviewTone(state),
      };
    case "in_progress":
      return {
        label: arabic ? "ظ‚ظٹط¯ ط§ظ„طھظ†ظپظٹط°" : "In progress",
        description: arabic
          ? "ظٹطھظ… طھط¬ظ‡ظٹط² ظ…ظ„ظپ ط§ظ„ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظˆط±ظ‚ظٹط© ظ…ط­ظ„ظٹط§ظ‹."
          : "The local paper-readiness review file is being prepared.",
        tone: reviewTone(state),
      };
    case "pending_review":
      return {
        label: arabic ? "ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©" : "Pending review",
        description: arabic
          ? "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ظ…ظ„ظپ ظ„ظ„ظ…ط±ط§ط¬ط¹ط© ط§ظ„ظ…ط­ظ„ظٹط© ظˆظٹط¬ط±ظٹ ط§ظ„ط§ظ†طھط¸ط§ط±."
          : "The file has been submitted for local review and is waiting in queue.",
        tone: reviewTone(state),
      };
    case "approved_for_paper":
      return {
        label: arabic ? "ظ…ط¹طھظ…ط¯ ظ„ظ„طھط¬ط±ظٹط¨ظٹ" : "Approved for paper",
        description: arabic
          ? "ط§ظ„ظ…ط±ط§ط¬ط¹ط© طھط³ظ…ط­ ط¨ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ظپظ‚ط·."
          : "The review permits paper execution only.",
        tone: reviewTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "ظ…ظ‚ظٹظ‘ط¯" : "Restricted",
        description: arabic
          ? "طھظ… طھظ‚ظٹظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط© ظˆظ„ط§ ظٹظ…ظƒظ† ط§ظ„طھظ‚ط¯ظ… ط­ط§ظ„ظٹط§ظ‹."
          : "The review is restricted and cannot progress right now.",
        tone: reviewTone(state),
      };
    case "rejected":
      return {
        label: arabic ? "ظ…ط­ط¬ظˆط¨" : "Blocked",
        description: arabic
          ? "طھظ… ط±ظپط¶ ط§ظ„ط¬ط§ظ‡ط²ظٹط© ط§ظ„ظ…ط­ظ„ظٹط© ظ„ظ„ط­ط³ط§ط¨."
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
        label: arabic ? "ظ…ظپط¹ظ‘ظ„" : "Enabled",
        tone: activationTone(state),
      };
    case "gated":
      return {
        label: arabic ? "ظ…ظ‚ظٹظ‘ط¯" : "Gated",
        tone: activationTone(state),
      };
    case "restricted":
      return {
        label: arabic ? "ظ…ظ‚ظٹظ‘ط¯" : "Restricted",
        tone: activationTone(state),
      };
    case "blocked":
      return {
        label: arabic ? "ظ…ط­ط¬ظˆط¨" : "Blocked",
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
        label: arabic ? "ط¬ط§ظ‡ط² ظ„ظ„ظˆط±ظ‚ظٹ" : "Paper-ready",
        description: arabic
          ? "ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ظ…طھط§ط­ ط¯ط§ط®ظ„ ط§ظ„ظ…ط³ط§ط± ط§ظ„ظ…ط­ظ„ظٹ ط§ظ„ط¢ظ…ظ†."
          : "Paper execution is available inside the local-safe route.",
        tone: "approved" as const,
      };
    case "disclosures_required":
      return {
        label: arabic ? "ط§ظ„ط¥ظپطµط§ط­ط§طھ ظ…ط·ظ„ظˆط¨ط©" : "Disclosures required",
        description: arabic
          ? "ظٹط¨ظ‚ظ‰ ط¥ط¯ط®ط§ظ„ ط§ظ„ط£ظˆط§ظ…ط± ظ…ط±ط¦ظٹط§ظ‹ ظ„ظƒظ† ط§ظ„طھظ†ظپظٹط° ظ…ط¹ط·ظ‘ظ„ ط­طھظ‰ ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¥ظپطµط§ط­ط§طھ."
          : "Order entry stays visible, but execution remains disabled until disclosures are accepted.",
        tone: "pending" as const,
      };
    case "kyc_required":
      return {
        label: arabic ? "ط§ظ„طھط­ظ‚ظ‚ ظ…ط·ظ„ظˆط¨" : "Verification required",
        description: arabic
          ? "ظ„ط§ ظٹط²ط§ظ„ ظ…ظ„ظپ ط§ظ„ط¬ط§ظ‡ط²ظٹط© ط¨ط­ط§ط¬ط© ط¥ظ„ظ‰ ط§ط³طھظƒظ…ط§ظ„ ظ‚ط¨ظ„ ط§ظ„ط³ظ…ط§ط­ ط¨ط§ظ„ظˆط±ظ‚ظٹ."
          : "The readiness file still needs verification before paper access can be granted.",
        tone: "pending" as const,
      };
    case "review_pending":
      return {
        label: arabic ? "ط§ظ„ظ…ط±ط§ط¬ط¹ط© ظ…ط¹ظ„ظ‘ظ‚ط©" : "Review pending",
        description: arabic
          ? "طھظ… ط¥ط±ط³ط§ظ„ ط§ظ„ظ…ظ„ظپ ظ„ظ„ظ…ط±ط§ط¬ط¹ط© ظˆظٹط¸ظ„ ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ظ‚ظٹط¯ ط§ظ„ط§ظ†طھط¸ط§ط±."
          : "The file has been submitted for review, and paper execution remains pending.",
        tone: "pending" as const,
      };
    case "paper_only_mode":
      return {
        label: arabic ? "ط­ظ…ط§ظٹط© ظˆط±ظ‚ظٹط© ظپظ‚ط·" : "Paper-only protection",
        description: arabic
          ? "ظ‡ط°ط§ ط§ظ„ظ…ط³ط§ط± ط§ظ„ظ…ط­ظ„ظٹ ظٹظ…ظ†ط¹ ط£ظٹ طھظ†ظپظٹط° ط­ظٹ ط£ظˆ ط£ظ…ظˆط§ظ„ ط­ظ‚ظٹظ‚ظٹط©."
          : "This local-safe environment blocks any live or real-money execution path.",
        tone: "pending" as const,
      };
    case "restricted_account":
      return {
        label: arabic ? "ط§ظ„ط­ط³ط§ط¨ ظ…ظ‚ظٹظ‘ط¯" : "Restricted account",
        description: arabic
          ? "ط§ظ„طھظ†ظپظٹط° ظ…ظ‚ظٹظ‘ط¯ ط¨ظ‚ط±ط§ط± ط§ظ…طھط«ط§ظ„ ظ…ط­ظ„ظٹ."
          : "Execution is restricted by a local compliance decision.",
        tone: "restricted" as const,
      };
    case "blocked_account":
      return {
        label: arabic ? "ط§ظ„ط­ط³ط§ط¨ ظ…ط­ط¬ظˆط¨" : "Blocked account",
        description: arabic
          ? "ط§ظ„طھظ†ظپظٹط° ظ…ط­ط¬ظˆط¨ ط¨ط§ظ„ظƒط§ظ…ظ„ ظ„ظ‡ط°ط§ ط§ظ„ط­ط³ط§ط¨."
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
      return arabic ? "ط¥ظپطµط§ط­ ط§ظ„ظ…ط®ط§ط·ط±" : "Risk disclosure";
    case "paper_trading":
      return arabic ? "ط¥ط´ط¹ط§ط± ط§ظ„طھط¯ط§ظˆظ„ ط§ظ„ظˆط±ظ‚ظٹ" : "Paper-trading notice";
    case "jurisdiction":
      return arabic ? "ط¥ط´ط¹ط§ط± ط§ظ„ظˆظ„ط§ظٹط© ظˆط§ظ„ظˆطµظˆظ„" : "Jurisdiction notice";
    case "terms":
      return arabic ? "ط¥ظ‚ط±ط§ط± ط§ظ„ط´ط±ظˆط·" : "Terms acknowledgment";
  }
}

function getNextStepValue(
  locale: string,
  nextStep: AccountPolicySurface["activation"]["nextStep"]
) {
  const arabic = isArabic(locale);

  switch (nextStep) {
    case "accept_disclosures":
      return arabic ? "ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¥ظپطµط§ط­ط§طھ ط§ظ„ظ…ط·ظ„ظˆط¨ط©" : "Accept required disclosures";
    case "complete_verification":
      return arabic ? "ط§ط³طھظƒظ…ط§ظ„ ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¬ط§ظ‡ط²ظٹط©" : "Complete readiness review";
    case "await_review":
      return arabic ? "ط§ظ†طھط¸ط§ط± ظ‚ط±ط§ط± ط§ظ„ظ…ط±ط§ط¬ط¹ط©" : "Await review decision";
    case "paper_ready":
      return arabic ? "ط§ظ„ظ…ط³ط§ط± ط§ظ„ظˆط±ظ‚ظٹ ط¬ط§ظ‡ط²" : "Paper route available";
    case "contact_support":
      return arabic ? "ط§ظ„طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ط§ظ…طھط«ط§ظ„" : "Contact compliance support";
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
        ? "طھظ… ظ‚ظپظ„ ط§ظ„ط¬ظ„ط³ط© ط¨ط³ط¨ط¨ ط­ط¯ظˆط¯ ط§ظ„ط®ط³ط§ط±ط©ط› ظ„ط§ ظٹظ…ظƒظ† ظپطھط­ ظ…ط±ط§ظƒط² ط¬ط¯ظٹط¯ط©."
        : "The session is locked by loss limits, so no new positions can open.",
      tone: "blocked" as const,
    };
  }

  if (riskFoundation.remainingTradeSlots === 0) {
    return {
      value: arabic
        ? "طھظ… ط¨ظ„ظˆط؛ ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„طµظپظ‚ط§طھ ط§ظ„ظ…ظپطھظˆط­ط©."
        : "The maximum open-trade limit has been reached.",
      tone: "restricted" as const,
    };
  }

  if (decision.signal === "wait") {
    return {
      value: arabic
        ? "ط§ظ„طھظ†ظپظٹط° ط¨ط§ظ„ط¥ط´ط§ط±ط© ظپظٹ ظˆط¶ط¹ ط§ظ†طھط¸ط§ط±طŒ ط¨ظٹظ†ظ…ط§ ظٹط¸ظ„ ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ط§ظ„ظٹط¯ظˆظٹ ظ…طھط§ط­ط§ظ‹."
        : "Signal execution is on standby while manual paper entry remains available.",
      tone: "pending" as const,
    };
  }

  return {
    value: arabic
      ? "ط§ظ„طھظ†ظپظٹط° ط§ظ„ظˆط±ظ‚ظٹ ط§ظ„ظ…ط­ظ„ظٹ ظ…طھط§ط­ ط¶ظ…ظ† ط§ظ„ط­ظˆط§ط¬ط² ط§ظ„ط­ط§ظ„ظٹط©."
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
    ? "ظ…ط·ظ„ظˆط¨ ظ‚ط¨ظ„ ط§ظ„طھظپط¹ظٹظ„ ط§ظ„ظˆط±ظ‚ظٹ"
    : "Required before paper activation";
  const disclosureAcceptedFallback = arabic
    ? "ظ…ط¹طھظ…ط¯ ظپظٹ ط§ظ„ظ…ظ„ظپ ط§ظ„ظ…ط­ظ„ظٹ"
    : "Accepted in the local paper profile";
  const reviewUpdatedFallback = arabic ? "ظ„ظ… ظٹظڈط­ط¯ظ‘ط« ط¨ط¹ط¯" : "No review update yet";
  const liveAccessValue = arabic ? "ظ…ط­ط¬ظˆط¨ ظ…ط­ظ„ظٹط§ظ‹" : "Blocked locally";
  const operational = getOperationalExecutionCopy(
    locale,
    accountPolicy,
    riskFoundation,
    decision
  );

  return {
    policyPanelLabel: arabic ? "ط§ظ„ط§ظ…طھط«ط§ظ„ + ط§ظ„طھظپط¹ظٹظ„" : "Compliance + Activation",
    accountLifecycleLabel: lifecycle.label,
    accountLifecycleDescription: lifecycle.description,
    accountLifecycleTone: lifecycle.tone,
    reviewStatusLabel: review.label,
    reviewStatusDescription: review.description,
    reviewStatusTone: review.tone,
    disclosureSummaryLabel: arabic ? "ط§ظ„ط¥ظپطµط§ط­ط§طھ" : "Disclosures",
    disclosureSummaryValue: arabic
      ? `${acceptedDisclosures} / ${accountPolicy.disclosures.length} ظ…ط¹طھظ…ط¯ط©`
      : `${acceptedDisclosures} / ${accountPolicy.disclosures.length} accepted`,
    paperAccessLabel: arabic ? "ط§ظ„ظˆطµظˆظ„ ط§ظ„ظˆط±ظ‚ظٹ" : "Paper access",
    paperAccessValue: paperAccess.label,
    paperAccessTone: paperAccess.tone,
    liveAccessLabel: arabic ? "ط§ظ„طھظ†ظپظٹط° ط§ظ„ط­ظٹ" : "Live execution",
    liveAccessValue,
    ticketReadinessLabel: arabic ? "ط§ظ„ط¬ط§ظ‡ط²ظٹط© ط§ظ„ط­ط§ظ„ظٹط©" : "Current readiness",
    ticketReadinessValue: activationReason.label,
    ticketReadinessTone: activationReason.tone,
    ticketGateLabel: arabic ? "ط­ط§ظ„ط© ط§ظ„طھظ†ظپظٹط°" : "Execution gate",
    ticketGateValue: activationReason.label,
    ticketGateTone: activationReason.tone,
    ticketNextStepLabel: arabic ? "ط§ظ„ط®ط·ظˆط© ط§ظ„طھط§ظ„ظٹط©" : "Next step",
    ticketNextStepValue: getNextStepValue(
      locale,
      accountPolicy.activation.nextStep
    ),
    ticketOperationalLabel: arabic ? "ط§ظ„ظˆط¶ط¹ ط§ظ„طھط´ط؛ظٹظ„ظٹ" : "Operational state",
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
      status: item.state === "accepted" ? (arabic ? "ظ…ط¹طھظ…ط¯" : "Accepted") : arabic ? "ظ…ط¹ظ„ظ‘ظ‚" : "Pending",
      meta:
        item.state === "accepted"
          ? formatTimestamp(locale, item.acceptedAt || "", disclosureAcceptedFallback)
          : disclosurePendingFallback,
      tone: item.state === "accepted" ? ("approved" as const) : ("pending" as const),
    })),
    activationRows: [
      {
        label: arabic ? "ظ…ط±ط¬ط¹ ط§ظ„ظ…ط±ط§ط¬ط¹ط©" : "Review reference",
        value: accountPolicy.review.reference,
      },
      {
        label: arabic ? "ط¢ط®ط± طھط­ط¯ظٹط« ظ…ط±ط§ط¬ط¹ط©" : "Review updated",
        value: formatTimestamp(
          locale,
          accountPolicy.review.updatedAt,
          reviewUpdatedFallback
        ),
      },
      {
        label: arabic ? "ط§ظ„ظˆطµظˆظ„ ط§ظ„ظˆط±ظ‚ظٹ" : "Paper access",
        value: paperAccess.label,
        tone: paperAccess.tone,
      },
      {
        label: arabic ? "ط§ظ„طھظ†ظپظٹط° ط§ظ„ط­ظٹ" : "Live execution",
        value: liveAccessValue,
        tone: "blocked" as const,
      },
      {
        label: arabic ? "ط³ط¨ط¨ ط§ظ„ط¨ظˆط§ط¨ط©" : "Gate reason",
        value: activationReason.label,
        tone: activationReason.tone,
      },
      {
        label: arabic ? "ط§ظ„ط®ط·ظˆط© ط§ظ„طھط§ظ„ظٹط©" : "Next step",
        value: getNextStepValue(locale, accountPolicy.activation.nextStep),
      },
    ],
    acceptDisclosuresLabel: arabic ? "ط§ط¹طھظ…ط§ط¯ ط§ظ„ط¥ظپطµط§ط­ط§طھ" : "Accept disclosures",
    submitReviewLabel: arabic ? "ط¥ط±ط³ط§ظ„ ظ„ظ„ظ…ط±ط§ط¬ط¹ط©" : "Submit for review",
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
        ? "ظ…ظˆط¬ظ‡ ط§ظ„ط¯ظٹظ…ظˆ"
        : "Demo router"
      : arabic
      ? "ط§ظ„ظ…ط³ط§ط± ط§ظ„ط­ظ‚ظٹظ‚ظٹ ظ…ط­ط¬ظˆط¨"
      : "Live route blocked";

  const executionIntentValue =
    executionFoundation.intentState === "ready"
      ? arabic
        ? "ط¬ط§ظ‡ط²"
        : "Ready"
      : executionFoundation.intentState === "standby"
      ? arabic
        ? "ط§ظ†طھط¸ط§ط±"
        : "Standby"
      : executionFoundation.intentState === "guarded"
      ? arabic
        ? "ظ…ط­ظƒظˆظ… ط¨ط§ظ„ط­ظˆط§ط¬ط²"
        : "Guarded"
      : arabic
      ? "ظ…ط­ط¬ظˆط¨"
      : "Blocked";

  return {
    executionFoundationLabel: arabic ? "ط£ط³ط§ط³ ط§ظ„طھظ†ظپظٹط°" : "Execution foundation",
    executionRouteLabel: arabic ? "ظ…ط³ط§ط± ط§ظ„طھظ†ظپظٹط°" : "Execution route",
    executionRouteValue,
    executionIntentLabel: arabic ? "ط­ط§ظ„ط© ظ†ظٹط© ط§ظ„طھظ†ظپظٹط°" : "Execution intent",
    executionIntentValue,
    executionGuardrailsLabel: arabic ? "ط­ظˆط§ط¬ط² ط§ظ„طھظ†ظپظٹط°" : "Execution guardrails",
    executionGuardrailChips:
      executionFoundation.guardrails.length > 0
        ? executionFoundation.guardrails.map((item) =>
            executionGuardrailLabel(locale, item)
          )
        : [arabic ? "ظ„ط§ ظٹظˆط¬ط¯ ط­ط¸ط± ظ†ط´ط·" : "No active block"],
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
        ? "ظ†ط´ط·ط©"
        : "Active"
      : riskFoundation.sessionState === "guarded"
      ? arabic
        ? "ظ…ط­ظƒظˆظ…ط©"
        : "Guarded"
      : arabic
      ? "ظ…ظ‚ظپظ„ط©"
      : "Locked";

  const riskModeText =
    riskFoundation.riskMode === "normal"
      ? arabic
        ? "ط·ط¨ظٹط¹ظٹ"
        : "Normal"
      : riskFoundation.riskMode === "guarded"
      ? arabic
        ? "ط­ط°ط±"
        : "Guarded"
      : arabic
      ? "ظ…ظ‚ظپظ„"
      : "Locked";

  const safeDegradationText =
    riskFoundation.safeDegradation === "none"
      ? arabic
        ? "ظ„ط§ ظٹظˆط¬ط¯"
        : "None"
      : riskFoundation.safeDegradation === "new_entries_restricted"
      ? arabic
        ? "طھظ‚ظٹظٹط¯ ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯"
        : "New entries restricted"
      : arabic
      ? "ط­ط¸ط± ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯"
      : "New entries blocked";

  const lockReasonText =
    riskFoundation.lockReason === "loss_limit"
      ? arabic
        ? "ط¨ظ„ظˆط؛ ط­ط¯ ط§ظ„ط®ط³ط§ط±ط©"
        : "Loss limit reached"
      : riskFoundation.lockReason === "capacity_limit"
      ? arabic
        ? "ط¨ظ„ظˆط؛ ط³ط¹ط© ط§ظ„طµظپظ‚ط§طھ"
        : "Trade capacity reached"
      : arabic
      ? "ظ„ط§ ظٹظˆط¬ط¯"
      : "None";

  return {
    riskFoundationLabel: arabic
      ? "ط£ط³ط§ط³ ط§ظ„ظ…ط®ط§ط·ط± ظˆط§ظ„ط¬ظ„ط³ط©"
      : "Risk + Session foundation",
    riskFoundationChips: [
      `${arabic ? "ط­ط§ظ„ط© ط§ظ„ط¬ظ„ط³ط©" : "Session state"}: ${riskStateText}`,
      `${arabic ? "ظˆط¶ط¹ ط§ظ„ظ…ط®ط§ط·ط±" : "Risk mode"}: ${riskModeText}`,
      `${arabic ? "ط­ط¯ ط®ط³ط§ط±ط© ط§ظ„ط¬ظ„ط³ط©" : "Session loss limit"}: -$${riskFoundation.sessionLossLimit.toFixed(2)}`,
      `${arabic ? "ظ†طھظٹط¬ط© ط§ظ„ط¬ظ„ط³ط© ط§ظ„ط­ط§ظ„ظٹط©" : "Current session PnL"}: ${sessionPnLText}`,
      `${arabic ? "ط§ظ„ط³ط¹ط§طھ ط§ظ„ظ…طھط¨ظ‚ظٹط©" : "Remaining slots"}: ${riskFoundation.remainingTradeSlots}`,
      `${arabic ? "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„طµظپظ‚ط§طھ ط§ظ„ظ…ظپطھظˆط­ط©" : "Max open trades"}: ${riskFoundation.maxOpenTrades}`,
      `${arabic ? "ط§ظ„طµظپظ‚ط§طھ ط§ظ„ط®ط§ط³ط±ط©" : "Losing trades"}: ${riskFoundation.losingTradesCount}`,
      `${arabic ? "ط§ظ„ط­ظ…ط§ظٹط© ط§ظ„ظ…طھط¯ط±ط¬ط©" : "Safe degradation"}: ${safeDegradationText}`,
      ...(riskFoundation.lockReason !== "none"
        ? [`${arabic ? "ط³ط¨ط¨ ط§ظ„ظ‚ظپظ„" : "Lock reason"}: ${lockReasonText}`]
        : []),
    ],
    riskOperatorNote:
      riskFoundation.operatorMessage === "loss_limit_locked"
        ? arabic
          ? "طھظ… ط¨ظ„ظˆط؛ ط­ط¯ ط®ط³ط§ط±ط© ط§ظ„ط¬ظ„ط³ط©ط› طھظ… ط­ط¸ط± ط§ظ„ط¯ط®ظˆظ„ط§طھ ط§ظ„ط¬ط¯ظٹط¯ط© ط­طھظ‰ طھطھظ… ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¬ظ„ط³ط©."
          : "The session loss limit was reached; new entries are blocked until the session is reviewed."
        : riskFoundation.operatorMessage === "capacity_reached"
        ? arabic
          ? "طھظ… ط¨ظ„ظˆط؛ ط³ط¹ط© ط§ظ„طµظپظ‚ط§طھ ط§ظ„ظ…ظپطھظˆط­ط©ط› ظ„ط§ ظٹظ…ظƒظ† ظپطھط­ ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯ ط­طھظ‰ ظٹطھظ… ط¥ط؛ظ„ط§ظ‚ طµظپظ‚ط©."
          : "Open-trade capacity was reached; no new entry can open until a trade is closed."
        : riskFoundation.operatorMessage === "session_guarded"
        ? arabic
          ? "ط§ظ„ط¬ظ„ط³ط© ط§ظ‚طھط±ط¨طھ ظ…ظ† ط­ط¯ظˆط¯ ط§ظ„ظ…ط®ط§ط·ط± ط§ظ„ظ…ط­ط¯ط¯ط©ط› ط§ظ„ط¯ط®ظˆظ„ط§طھ ط§ظ„ط¬ط¯ظٹط¯ط© طھط¨ظ‚ظ‰ ظ…ظ‚ظٹط¯ط© ظˆظ…ط­ظƒظˆظ…ط©."
          : "The session is approaching configured risk boundaries; new entries remain controlled."
        : arabic
        ? "ط§ظ„ط¬ظ„ط³ط© طھط¹ظ…ظ„ ط¯ط§ط®ظ„ ط­ط¯ظˆط¯ ط§ظ„ظ…ط®ط§ط·ط± ط§ظ„ظ…ط­ط¯ط¯ط©."
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
    dataStateFoundation.marketFeedState === "external_ready"
      ? arabic
        ? "تغذية خارجية جاهزة"
        : "External feed ready"
      : dataStateFoundation.marketFeedState === "fallback_ready" ||
        dataStateFoundation.marketFeedState === "simulated_live"
      ? arabic
        ? "تغذية احتياطية جاهزة"
        : "Fallback feed ready"
      : dataStateFoundation.marketFeedState === "degraded"
      ? arabic
        ? "التغذية الاحتياطية متراجعة"
        : "Fallback degraded"
      : dataStateFoundation.marketFeedState === "booting"
      ? arabic
        ? "جارٍ تهيئة التغذية"
        : "Feed booting"
      : dataStateFoundation.marketFeedState === "unavailable"
      ? arabic
        ? "التغذية غير متاحة"
        : "Feed unavailable"
      : arabic
      ? "منقطع"
      : "Disconnected";

  const decisionEngineText =
    dataStateFoundation.decisionEngineState === "derived_market"
      ? arabic
        ? "محرك مشتق من السوق"
        : "Market-derived engine"
      : dataStateFoundation.decisionEngineState === "derived_local"
      ? arabic
        ? "محرك مشتق محليًا"
        : "Local derived engine"
      : arabic
      ? "وضع انتظار"
      : "Standby";

  const chartBindingText =
    dataStateFoundation.chartBindingState === "feed_bound"
      ? arabic
        ? "مرتبط بالتغذية"
        : "Feed-bound"
      : dataStateFoundation.chartBindingState === "workspace_bound"
      ? arabic
        ? "مرتبط بمساحة العمل"
        : "Workspace-bound"
      : arabic
      ? "غير مرتبط"
      : "Unbound";

  const storageStateText =
    dataStateFoundation.storagePersistenceState === "persistent_backend"
      ? arabic
        ? "تخزين خلفي دائم"
        : "Backend persistent storage"
      : dataStateFoundation.storagePersistenceState === "persistent_local"
      ? arabic
        ? "تخزين محلي دائم"
        : "Local persistent storage"
      : dataStateFoundation.storagePersistenceState === "syncing"
      ? arabic
        ? "جارٍ مزامنة التفضيلات"
        : "Syncing preferences"
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
        ? "محمّل"
        : "Hydrated"
      : dataStateFoundation.hydrationState === "degraded"
      ? arabic
        ? "محمّل جزئيًا"
        : "Hydration degraded"
      : arabic
      ? "قيد التهيئة"
      : "Booting";

  const syncChannelText =
    dataStateFoundation.syncChannel === "api_preferences"
      ? arabic
        ? "واجهة تفضيلات الخلفية"
        : "Backend preferences API"
      : dataStateFoundation.syncChannel === "hybrid"
      ? arabic
        ? "خلفية + تخزين محلي"
        : "Backend + local fallback"
      : dataStateFoundation.syncChannel === "memory_only"
      ? arabic
        ? "ذاكرة فقط"
        : "Memory only"
      : arabic
      ? "تخزين محلي"
      : "Local storage";

  const scopeText =
    dataStateFoundation.stateScope === "demo" ? demoLabel : realLabel;
  const localeText =
    dataStateFoundation.locale === "ar" ? "Arabic / العربية" : "English";
  const directionText = dataStateFoundation.direction === "rtl" ? "RTL" : "LTR";
  const dataStateOperatorNote =
    dataStateFoundation.syncChannel === "hybrid" ||
    dataStateFoundation.syncChannel === "api_preferences"
      ? arabic
        ? "الحالة مرتبطة بالحساب النشط مع مزامنة آمنة لتفضيلات الخلفية واحتياط محلي عند الحاجة."
        : "State is scoped to the active account with safe backend preference sync and local fallback when needed."
      : arabic
      ? "الحالة مرتبطة بالحساب النشط وتبقى محلية مع تهيئة آمنة واتجاه متوافق مع اللغة."
      : "State is scoped to the active account and remains local with safe hydration and locale-aware direction.";

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
      `${arabic ? "قناة المزامنة" : "Sync channel"}: ${syncChannelText}`,
      `${arabic ? "نطاق الحالة" : "State scope"}: ${scopeText}`,
      `${arabic ? "اللغة" : "Locale"}: ${localeText}`,
      `${arabic ? "الاتجاه" : "Direction"}: ${directionText}`,
      `${arabic ? "آخر تحديث" : "Last updated"}: ${dataStateFoundation.lastUpdatedAt}`,
    ],
    dataStateOperatorNote,
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