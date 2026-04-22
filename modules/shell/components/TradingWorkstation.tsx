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
  SummaryCard,
  TradingTopbar,
} from "./PlatformShellV2";

function permissionLabel(locale: string, anchor: PermissionAnchor) {
  const stateText =
    anchor.state === "enabled"
      ? locale === "ar"
        ? "ظ…ظپط¹ظ„"
        : "Enabled"
      : anchor.state === "read_only"
      ? locale === "ar"
        ? "ظ‚ط±ط§ط،ط© ظپظ‚ط·"
        : "Read-only"
      : locale === "ar"
      ? "ظ…ط­ط¬ظˆط¨"
      : "Blocked";

  const labelMap: Record<PermissionAnchor["key"], string> = {
    profile: locale === "ar" ? "ط§ظ„ظ…ظ„ظپ" : "Profile",
    settings: locale === "ar" ? "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ" : "Settings",
    sign_out: locale === "ar" ? "ط§ظ„ط®ط±ظˆط¬" : "Sign out",
    demo_execution: locale === "ar" ? "طھظ†ظپظٹط° طھط¬ط±ظٹط¨ظٹ" : "Demo execution",
    real_execution: locale === "ar" ? "طھظ†ظپظٹط° ط­ظ‚ظٹظ‚ظٹ" : "Real execution",
    audit_surface: locale === "ar" ? "ط³ط·ط­ ط§ظ„طھط¯ظ‚ظٹظ‚" : "Audit surface",
    jurisdiction_controls: locale === "ar" ? "ط¶ظˆط§ط¨ط· ط§ظ„ظˆظ„ط§ظٹط©" : "Jurisdiction controls",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

function verificationWorkflowLabel(locale: string, anchor: VerificationWorkflowAnchor) {
  const stateText =
    anchor.state === "ready"
      ? locale === "ar"
        ? "ط¬ط§ظ‡ط²"
        : "Ready"
      : anchor.state === "review"
      ? locale === "ar"
        ? "ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©"
        : "Under review"
      : locale === "ar"
      ? "ظ…ط¹ظ„ظ‚"
      : "Pending";

  const labelMap: Record<VerificationWorkflowAnchor["key"], string> = {
    identity_check: locale === "ar" ? "ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظ‡ظˆظٹط©" : "Identity check",
    account_review: locale === "ar" ? "ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط­ط³ط§ط¨" : "Account review",
    disclosure_acceptance: locale === "ar" ? "ظ‚ط¨ظˆظ„ ط§ظ„ط¥ظپطµط§ط­ط§طھ" : "Disclosure acceptance",
    live_activation: locale === "ar" ? "طھظپط¹ظٹظ„ ط§ظ„ط­ظ‚ظٹظ‚ظٹ" : "Live activation",
  };

  return `${labelMap[anchor.key]}: ${stateText}`;
}

function preferenceLabel(locale: string, anchor: AccountPreferenceAnchor) {
  const keyMap: Record<AccountPreferenceAnchor["key"], string> = {
    language: locale === "ar" ? "ط§ظ„ظ„ط؛ط©" : "Language",
    direction: locale === "ar" ? "ط§ظ„ط§طھط¬ط§ظ‡" : "Direction",
    density: locale === "ar" ? "ط§ظ„ظƒط«ط§ظپط©" : "Density",
    chart_layout: locale === "ar" ? "ظ‡ظٹظƒظ„ ط§ظ„ط±ط³ظ…" : "Chart layout",
    risk_confirmation: locale === "ar" ? "طھط£ظƒظٹط¯ ط§ظ„ظ…ط®ط§ط·ط±" : "Risk confirmation",
  };

  const valueMap: Record<string, string> = {
    Arabic: locale === "ar" ? "ط§ظ„ط¹ط±ط¨ظٹط©" : "Arabic",
    English: locale === "ar" ? "ط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط©" : "English",
    RTL: "RTL",
    LTR: "LTR",
    Adaptive: locale === "ar" ? "طھظƒظٹظپظٹط©" : "Adaptive",
    "Primary workspace": locale === "ar" ? "ظ…ط³ط§ط­ط© ط±ط¦ظٹط³ظٹط©" : "Primary workspace",
    Enabled: locale === "ar" ? "ظ…ظپط¹ظ„" : "Enabled",
  };

  return `${keyMap[anchor.key]}: ${valueMap[anchor.value] || anchor.value}`;
}

function onboardingStageLabel(locale: string, stage: string) {
  const stageMap: Record<string, string> = {
    foundation: locale === "ar" ? "ظ…ط±ط­ظ„ط© ط§ظ„ط¥ط¹ط¯ط§ط¯: ط£ط³ط§ط³" : "Onboarding: Foundation",
    identity_ready: locale === "ar" ? "ظ…ط±ط­ظ„ط© ط§ظ„ط¥ط¹ط¯ط§ط¯: ظ‡ظˆظٹط© ط¬ط§ظ‡ط²ط©" : "Onboarding: Identity-ready",
    account_ready: locale === "ar" ? "ظ…ط±ط­ظ„ط© ط§ظ„ط¥ط¹ط¯ط§ط¯: ط­ط³ط§ط¨ ط¬ط§ظ‡ط²" : "Onboarding: Account-ready",
    activation_review: locale === "ar" ? "ظ…ط±ط­ظ„ط© ط§ظ„ط¥ط¹ط¯ط§ط¯: ظ…ط±ط§ط¬ط¹ط© ط§ظ„طھظپط¹ظٹظ„" : "Onboarding: Activation review",
    active: locale === "ar" ? "ظ…ط±ط­ظ„ط© ط§ظ„ط¥ط¹ط¯ط§ط¯: ظ†ط´ط·" : "Onboarding: Active",
  };

  return stageMap[stage] || stage;
}

function executionGuardrailLabel(locale: string, key: ExecutionGuardrailKey) {
  const map: Record<ExecutionGuardrailKey, string> = {
    demo_only: locale === "ar" ? "طھظ†ظپظٹط° ط­ظ‚ظٹظ‚ظٹ ظ…ط­ط¬ظˆط¨" : "Live execution blocked",
    session_locked: locale === "ar" ? "ط§ظ„ط¬ظ„ط³ط© ظ…ظ‚ظپظ„ط©" : "Session locked",
    max_open_trades: locale === "ar" ? "طھظ… ط¨ظ„ظˆط؛ ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰" : "Max open trades reached",
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

  const modeLabel = locale === "ar" ? "ظˆط¶ط¹ ط§ظ„ط­ط³ط§ط¨" : "Account";
  const demoLabel = locale === "ar" ? "طھط¬ط±ظٹط¨ظٹ" : "Demo";
  const realLabel = locale === "ar" ? "ط­ظ‚ظٹظ‚ظٹ" : "Real";
  const analysisTimeframeLabel = locale === "ar" ? "ط¥ط·ط§ط± ط§ظ„طھط­ظ„ظٹظ„" : "Analysis timeframe";
  const durationFieldLabel = locale === "ar" ? "ظ…ط¯ط© ط§ظ„طھظ†ظپظٹط°" : "Execution duration";
  const accountStatusLabel = locale === "ar" ? "ط­ط§ظ„ط© ط§ظ„ط­ط³ط§ط¨" : "Account status";
  const accountStatusValue =
    accountStatus === "active"
      ? locale === "ar"
        ? "ظ†ط´ط·"
        : "Active"
      : locale === "ar"
      ? "ظ‚ط±ط§ط،ط© ظپظ‚ط·"
      : "Read-only";

  const verificationLabel =
    userIdentity.verification === "verified"
      ? locale === "ar"
        ? "ظ…ظˆط«ظ‚"
        : "Verified"
      : userIdentity.verification === "review"
      ? locale === "ar"
        ? "ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©"
        : "Under review"
      : locale === "ar"
      ? "ط؛ظٹط± ظ…ظˆط«ظ‚"
      : "Unverified";

  const userRole = locale === "ar" ? "ط§ظ„ظ…ط§ظ„ظƒ" : "Owner";
  const profileLabel = locale === "ar" ? "ط§ظ„ظ…ظ„ظپ" : "Profile";
  const settingsLabel = locale === "ar" ? "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ" : "Settings";
  const signOutLabel = locale === "ar" ? "ط§ظ„ط®ط±ظˆط¬" : "Sign out";
  const policyPanelLabel = locale === "ar" ? "ط³ظٹط§ط³ط© ط§ظ„ط­ط³ط§ط¨" : "Account policy";

  const jurisdictionChips = [
    locale === "ar" ? "ط§ظ„ظˆظ„ط§ظٹط©: ط¹ط§ظ„ظ…ظٹط©" : "Jurisdiction: Global",
    accountPolicy.jurisdiction.executionPolicy === "demo_only"
      ? locale === "ar"
        ? "ط³ظٹط§ط³ط© ط§ظ„طھظ†ظپظٹط°: طھط¬ط±ظٹط¨ظٹ ظپظ‚ط·"
        : "Execution policy: Demo only"
      : locale === "ar"
      ? "ط³ظٹط§ط³ط© ط§ظ„طھظ†ظپظٹط°: ظ…ظ‚ظٹظ‘ط¯ط©"
      : "Execution policy: Restricted",
    accountPolicy.jurisdiction.disclosureState === "required"
      ? locale === "ar"
        ? "ط§ظ„ط¥ظپطµط§ط­ط§طھ: ظ…ط·ظ„ظˆط¨ط©"
        : "Disclosures: Required"
      : locale === "ar"
      ? "ط§ظ„ط¥ظپطµط§ط­ط§طھ: ط¬ط§ظ‡ط²ط©"
      : "Disclosures: Ready",
    accountPolicy.jurisdiction.activationState === "review"
      ? locale === "ar"
        ? "ط§ظ„طھظپط¹ظٹظ„ ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹ: ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©"
        : "Legal activation: Under review"
      : locale === "ar"
      ? "ط§ظ„طھظپط¹ظٹظ„ ط§ظ„ظ‚ط§ظ†ظˆظ†ظٹ: ظ†ط´ط·"
      : "Legal activation: Active",
    onboardingStageLabel(locale, accountPolicy.onboarding.onboardingStage),
    accountPolicy.onboarding.demoReadiness === "ready"
      ? locale === "ar"
        ? "ط¬ط§ظ‡ط²ظٹط© ط§ظ„ط¯ظٹظ…ظˆ: ط¬ط§ظ‡ط²"
        : "Demo readiness: Ready"
      : locale === "ar"
      ? "ط¬ط§ظ‡ط²ظٹط© ط§ظ„ط¯ظٹظ…ظˆ: ط؛ظٹط± ط¬ط§ظ‡ط²"
      : "Demo readiness: Not ready",
    accountPolicy.onboarding.liveActivation === "blocked"
      ? locale === "ar"
        ? "طھظپط¹ظٹظ„ ط§ظ„ط­ظ‚ظٹظ‚ظٹ: ظ…ط­ط¬ظˆط¨"
        : "Live activation: Blocked"
      : accountPolicy.onboarding.liveActivation === "review"
      ? locale === "ar"
        ? "طھظپط¹ظٹظ„ ط§ظ„ط­ظ‚ظٹظ‚ظٹ: ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©"
        : "Live activation: Under review"
      : locale === "ar"
      ? "طھظپط¹ظٹظ„ ط§ظ„ط­ظ‚ظٹظ‚ظٹ: ظ…ظپط¹ظ„"
      : "Live activation: Enabled",
    ...accountPolicy.verificationWorkflow.map((anchor) =>
      verificationWorkflowLabel(locale, anchor)
    ),
  ];

  const permissionChips = [
    ...accountPolicy.permissionAnchors.map((anchor) => permissionLabel(locale, anchor)),
    ...accountPolicy.preferences.map((anchor) => preferenceLabel(locale, anchor)),
  ];

  const executionFoundationLabel = locale === "ar" ? "ط£ط³ط§ط³ ط§ظ„طھظ†ظپظٹط°" : "Execution foundation";
  const executionRouteLabel = locale === "ar" ? "ظ…ط³ط§ط± ط§ظ„طھظ†ظپظٹط°" : "Execution route";
  const executionRouteValue =
    executionFoundation.route === "demo_router"
      ? locale === "ar"
        ? "ظ…ظˆط¬ظ‡ ط§ظ„ط¯ظٹظ…ظˆ"
        : "Demo router"
      : locale === "ar"
      ? "ط§ظ„ظ…ط³ط§ط± ط§ظ„ط­ظ‚ظٹظ‚ظٹ ظ…ط­ط¬ظˆط¨"
      : "Live route blocked";

  const executionIntentLabel = locale === "ar" ? "ط­ط§ظ„ط© ظ†ظٹط© ط§ظ„طھظ†ظپظٹط°" : "Execution intent";
  const executionIntentValue =
    executionFoundation.intentState === "ready"
      ? locale === "ar"
        ? "ط¬ط§ظ‡ط²"
        : "Ready"
      : executionFoundation.intentState === "standby"
      ? locale === "ar"
        ? "ط§ظ†طھط¸ط§ط±"
        : "Standby"
      : executionFoundation.intentState === "guarded"
      ? locale === "ar"
        ? "ظ…ط­ظƒظˆظ… ط¨ط§ظ„ط­ظˆط§ط¬ط²"
        : "Guarded"
      : locale === "ar"
      ? "ظ…ط­ط¬ظˆط¨"
      : "Blocked";

  const executionGuardrailsLabel = locale === "ar" ? "ط­ظˆط§ط¬ط² ط§ظ„طھظ†ظپظٹط°" : "Execution guardrails";
  const executionGuardrailChips =
    executionFoundation.guardrails.length > 0
      ? executionFoundation.guardrails.map((item) => executionGuardrailLabel(locale, item))
      : [locale === "ar" ? "ظ„ط§ ظٹظˆط¬ط¯ ط­ط¸ط± ظ†ط´ط·" : "No active block"];

  const riskFoundationLabel = locale === "ar" ? "ط£ط³ط§ط³ ط§ظ„ظ…ط®ط§ط·ط± ظˆط§ظ„ط¬ظ„ط³ط©" : "Risk + Session foundation";

  const riskStateText =
    riskFoundation.sessionState === "active"
      ? locale === "ar"
        ? "ظ†ط´ط·ط©"
        : "Active"
      : riskFoundation.sessionState === "guarded"
      ? locale === "ar"
        ? "ظ…ط­ظƒظˆظ…ط©"
        : "Guarded"
      : locale === "ar"
      ? "ظ…ظ‚ظپظ„ط©"
      : "Locked";

  const riskModeText =
    riskFoundation.riskMode === "normal"
      ? locale === "ar"
        ? "ط·ط¨ظٹط¹ظٹ"
        : "Normal"
      : riskFoundation.riskMode === "guarded"
      ? locale === "ar"
        ? "ط­ط°ط±"
        : "Guarded"
      : locale === "ar"
      ? "ظ…ظ‚ظپظ„"
      : "Locked";

  const safeDegradationText =
    riskFoundation.safeDegradation === "none"
      ? locale === "ar"
        ? "ظ„ط§ ظٹظˆط¬ط¯"
        : "None"
      : riskFoundation.safeDegradation === "new_entries_restricted"
      ? locale === "ar"
        ? "طھظ‚ظٹظٹط¯ ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯"
        : "New entries restricted"
      : locale === "ar"
      ? "ط­ط¸ط± ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯"
      : "New entries blocked";

  const lockReasonText =
    riskFoundation.lockReason === "loss_limit"
      ? locale === "ar"
        ? "ط¨ظ„ظˆط؛ ط­ط¯ ط§ظ„ط®ط³ط§ط±ط©"
        : "Loss limit reached"
      : riskFoundation.lockReason === "capacity_limit"
      ? locale === "ar"
        ? "ط¨ظ„ظˆط؛ ط³ط¹ط© ط§ظ„طµظپظ‚ط§طھ"
        : "Trade capacity reached"
      : locale === "ar"
      ? "ظ„ط§ ظٹظˆط¬ط¯"
      : "None";

  const riskFoundationChips = [
    `${locale === "ar" ? "ط­ط§ظ„ط© ط§ظ„ط¬ظ„ط³ط©" : "Session state"}: ${riskStateText}`,
    `${locale === "ar" ? "ظˆط¶ط¹ ط§ظ„ظ…ط®ط§ط·ط±" : "Risk mode"}: ${riskModeText}`,
    `${locale === "ar" ? "ط­ط¯ ط®ط³ط§ط±ط© ط§ظ„ط¬ظ„ط³ط©" : "Session loss limit"}: -$${riskFoundation.sessionLossLimit.toFixed(2)}`,
    `${locale === "ar" ? "ظ†طھظٹط¬ط© ط§ظ„ط¬ظ„ط³ط© ط§ظ„ط­ط§ظ„ظٹط©" : "Current session PnL"}: ${sessionPnLText}`,
    `${locale === "ar" ? "ط§ظ„ط³ط¹ط§طھ ط§ظ„ظ…طھط¨ظ‚ظٹط©" : "Remaining slots"}: ${riskFoundation.remainingTradeSlots}`,
    `${locale === "ar" ? "ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„طµظپظ‚ط§طھ ط§ظ„ظ…ظپطھظˆط­ط©" : "Max open trades"}: ${riskFoundation.maxOpenTrades}`,
    `${locale === "ar" ? "ط§ظ„طµظپظ‚ط§طھ ط§ظ„ط®ط§ط³ط±ط©" : "Losing trades"}: ${riskFoundation.losingTradesCount}`,
    `${locale === "ar" ? "ط§ظ„ط­ظ…ط§ظٹط© ط§ظ„ظ…طھط¯ط±ط¬ط©" : "Safe degradation"}: ${safeDegradationText}`,
    ...(riskFoundation.lockReason !== "none"
      ? [`${locale === "ar" ? "ط³ط¨ط¨ ط§ظ„ظ‚ظپظ„" : "Lock reason"}: ${lockReasonText}`]
      : []),
  ];

  const riskOperatorNote =
    riskFoundation.operatorMessage === "loss_limit_locked"
      ? locale === "ar"
        ? "طھظ… ط¨ظ„ظˆط؛ ط­ط¯ ط®ط³ط§ط±ط© ط§ظ„ط¬ظ„ط³ط©ط› طھظ… ط­ط¸ط± ط§ظ„ط¯ط®ظˆظ„ط§طھ ط§ظ„ط¬ط¯ظٹط¯ط© ط­طھظ‰ طھطھظ… ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¬ظ„ط³ط©."
        : "The session loss limit was reached; new entries are blocked until the session is reviewed."
      : riskFoundation.operatorMessage === "capacity_reached"
      ? locale === "ar"
        ? "طھظ… ط¨ظ„ظˆط؛ ط³ط¹ط© ط§ظ„طµظپظ‚ط§طھ ط§ظ„ظ…ظپطھظˆط­ط©ط› ظ„ط§ ظٹظ…ظƒظ† ظپطھط­ ط¯ط®ظˆظ„ ط¬ط¯ظٹط¯ ط­طھظ‰ ظٹطھظ… ط¥ط؛ظ„ط§ظ‚ طµظپظ‚ط©."
        : "Open-trade capacity was reached; no new entry can open until a trade is closed."
      : riskFoundation.operatorMessage === "session_guarded"
      ? locale === "ar"
        ? "ط§ظ„ط¬ظ„ط³ط© ط§ظ‚طھط±ط¨طھ ظ…ظ† ط­ط¯ظˆط¯ ط§ظ„ظ…ط®ط§ط·ط± ط§ظ„ظ…ط­ط¯ط¯ط©ط› ط§ظ„ط¯ط®ظˆظ„ط§طھ ط§ظ„ط¬ط¯ظٹط¯ط© طھط¨ظ‚ظ‰ ظ…ظ‚ظٹط¯ط© ظˆظ…ط­ظƒظˆظ…ط©."
        : "The session is approaching configured risk boundaries; new entries remain controlled."
      : locale === "ar"
      ? "ط§ظ„ط¬ظ„ط³ط© طھط¹ظ…ظ„ ط¯ط§ط®ظ„ ط­ط¯ظˆط¯ ط§ظ„ظ…ط®ط§ط·ط± ط§ظ„ظ…ط­ط¯ط¯ط©."
      : "The session is operating inside configured risk boundaries.";

  const dataStateFoundationLabel = locale === "ar" ? "ط£ط³ط§ط³ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆط§ظ„ط­ط§ظ„ط©" : "Data + State foundation";

  const feedStateText =
    dataStateFoundation.marketFeedState === "simulated_live"
      ? locale === "ar"
        ? "طھط¯ظپظ‚ ط­ظٹ ظ…ط­ط§ظƒظ‰"
        : "Simulated live feed"
      : locale === "ar"
      ? "ظ…ظ†ظ‚ط·ط¹"
      : "Disconnected";

  const decisionEngineText =
    dataStateFoundation.decisionEngineState === "derived_local"
      ? locale === "ar"
        ? "ظ…ط­ط±ظƒ ظ‚ط±ط§ط± ظ…ط­ظ„ظٹ"
        : "Local derived engine"
      : locale === "ar"
      ? "ظˆط¶ط¹ ط§ظ†طھط¸ط§ط±"
      : "Standby";

  const chartBindingText =
    dataStateFoundation.chartBindingState === "workspace_bound"
      ? locale === "ar"
        ? "ظ…ط±طھط¨ط· ط¨ظ…ط³ط§ط­ط© ط§ظ„ط¹ظ…ظ„"
        : "Workspace-bound"
      : locale === "ar"
      ? "ط؛ظٹط± ظ…ط±طھط¨ط·"
      : "Unbound";

  const storageStateText =
    dataStateFoundation.storagePersistenceState === "persistent_local"
      ? locale === "ar"
        ? "طھط®ط²ظٹظ† ظ…ط­ظ„ظٹ ط¯ط§ط¦ظ…"
        : "Local persistent storage"
      : dataStateFoundation.storagePersistenceState === "booting"
      ? locale === "ar"
        ? "طھظ‡ظٹط¦ط©"
        : "Booting"
      : locale === "ar"
      ? "ط°ط§ظƒط±ط© ظپظ‚ط·"
      : "Memory only";

  const hydrationText =
    dataStateFoundation.hydrationState === "hydrated"
      ? locale === "ar"
        ? "ظ…ط­ظ…ظ„"
        : "Hydrated"
      : locale === "ar"
      ? "ظ‚ظٹط¯ ط§ظ„طھظ‡ظٹط¦ط©"
      : "Booting";

  const scopeText = dataStateFoundation.stateScope === "demo" ? demoLabel : realLabel;
  const localeText = dataStateFoundation.locale === "ar" ? "Arabic / ط§ظ„ط¹ط±ط¨ظٹط©" : "English";
  const directionText = dataStateFoundation.direction === "rtl" ? "RTL" : "LTR";

  const dataStateFoundationChips = [
    `${locale === "ar" ? "طھط؛ط°ظٹط© ط§ظ„ط³ظˆظ‚" : "Market feed"}: ${feedStateText}`,
    `${locale === "ar" ? "ظ…ط­ط±ظƒ ط§ظ„ظ‚ط±ط§ط±" : "Decision engine"}: ${decisionEngineText}`,
    `${locale === "ar" ? "ط±ط¨ط· ط§ظ„ط±ط³ظ…" : "Chart binding"}: ${chartBindingText}`,
    `${locale === "ar" ? "ط§ظ„طھط®ط²ظٹظ†" : "Storage"}: ${storageStateText}`,
    `${locale === "ar" ? "ط§ظ„طھط­ظ…ظٹظ„" : "Hydration"}: ${hydrationText}`,
    `${locale === "ar" ? "ظ‚ظ†ط§ط© ط§ظ„ظ…ط²ط§ظ…ظ†ط©" : "Sync channel"}: Local storage`,
    `${locale === "ar" ? "ظ†ط·ط§ظ‚ ط§ظ„ط­ط§ظ„ط©" : "State scope"}: ${scopeText}`,
    `${locale === "ar" ? "ط§ظ„ظ„ط؛ط©" : "Locale"}: ${localeText}`,
    `${locale === "ar" ? "ط§ظ„ط§طھط¬ط§ظ‡" : "Direction"}: ${directionText}`,
    `${locale === "ar" ? "ط¢ط®ط± طھط­ط¯ظٹط«" : "Last updated"}: ${dataStateFoundation.lastUpdatedAt}`,
  ];

  const dataStateOperatorNote =
    locale === "ar"
      ? "ط§ظ„ط­ط§ظ„ط© ظ…ط±طھط¨ط·ط© ط¨ط§ظ„ط­ط³ط§ط¨ ط§ظ„ظ†ط´ط· ظˆطھظڈط­ظپظژط¸ ظ…ط­ظ„ظٹظ‹ط§ ظ…ط¹ طھط­ظ…ظٹظ„ ط¢ظ…ظ† ظˆط§طھط¬ط§ظ‡ ظˆط§ط¬ظ‡ط© ظ…ط·ط§ط¨ظ‚ ظ„ظ„ط؛ط©."
      : "State is scoped to the active account and persisted locally with safe hydration and locale-aware direction.";

  const realReadinessNote =
    locale === "ar"
      ? "ظˆط¶ط¹ ط§ظ„ط­ط³ط§ط¨ ط§ظ„ط­ظ‚ظٹظ‚ظٹ ظ…ظˆط¬ظˆط¯ ظپظٹ ط§ظ„ط£ط³ط§ط³طŒ ظ„ظƒظ† ط§ظ„طھظˆط¬ظٹظ‡ ظˆط§ظ„طھظ†ظپظٹط° ط§ظ„ط­ظ‚ظٹظ‚ظٹظٹظ† ط؛ظٹط± ظ…ظپط¹ظ‘ظ„ظٹظ† ط¨ط¹ط¯."
      : "Real account mode exists in the foundation, but live routing and real execution are not enabled yet.";

  const auditTitle = locale === "ar" ? "ظ„ظˆط­ط© ط§ظ„طھط¯ظ‚ظٹظ‚ ظˆط§ظ„طھطھط¨ط¹" : "Audit + Traceability";
  const auditSubtitle =
    locale === "ar"
      ? "ط£ط«ط± ط²ظ…ظ†ظٹ ظˆط§ط¶ط­ ظ„ظ„ط£ط­ط¯ط§ط« ط§ظ„ط£ط³ط§ط³ظٹط© ط¯ط§ط®ظ„ ط§ظ„ظ…ظ†طµط©."
      : "A visible event timeline for core platform actions.";

  const auditActorLabel = locale === "ar" ? "ط§ظ„ظپط§ط¹ظ„" : "Actor";
  const auditAccountModeLabel = locale === "ar" ? "ط§ظ„ط­ط³ط§ط¨" : "Account";
  const auditVisibilityLabel = locale === "ar" ? "ط§ظ„ط±ط¤ظٹط©" : "Visibility";
  const auditTraceLabel = locale === "ar" ? "ط­ط§ظ„ط© ط§ظ„ط±ط¨ط·" : "Trace state";
  const auditLastEventLabel = locale === "ar" ? "ط¢ط®ط± ط­ط¯ط«" : "Last event";
  const auditEmptyLabel =
    locale === "ar" ? "ظ„ط§ طھظˆط¬ط¯ ط£ط­ط¯ط§ط« طھط¯ظ‚ظٹظ‚ ط¨ط¹ط¯." : "No audit events yet.";

  const auditAccountModeValue =
    auditTraceFoundation.currentAccountMode === "demo" ? demoLabel : realLabel;

  const auditVisibilityValue =
    auditTraceFoundation.visibilityState === "operator_visible"
      ? locale === "ar"
        ? "ظ…ط±ط¦ظٹ ظ„ظ„ظ…ط´ط؛ظ„"
        : "Operator visible"
      : locale === "ar"
      ? "ظ…ط®ظپظٹ"
      : "Hidden";

  const auditTraceValue =
    auditTraceFoundation.decisionTraceState === "linked" &&
    auditTraceFoundation.executionTraceState === "linked" &&
    auditTraceFoundation.sessionTraceState === "linked"
      ? locale === "ar"
        ? "ظ…ط±طھط¨ط·"
        : "Linked"
      : locale === "ar"
      ? "ط§ظ†طھط¸ط§ط±"
      : "Standby";

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
      </section>
    </main>
  );
}