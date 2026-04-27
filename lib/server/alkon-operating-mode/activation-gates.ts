import type {
  ActivationDecision,
  ActivationGate,
  AlkonOperatingModeOptions,
  OperatingModeStatus,
  ZeroTruthAudit,
} from "./types";
import { getZeroTruthAudit } from "./zero-truth-audit";

function option(value: boolean | undefined, fallback: boolean) {
  return value ?? fallback;
}

function gate(input: ActivationGate): ActivationGate {
  return input;
}

export function getAlkonActivationGates(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {},
  audit: ZeroTruthAudit = getZeroTruthAudit(checkedAt, options)
): ActivationGate[] {
  const productTruthSafe = option(options.productTruthSafe, true);
  const publicPrivateBoundarySafe = option(
    options.publicPrivateBoundarySafe,
    true
  );
  const buildValidationPassed = option(options.buildValidationPassed, true);
  const gitClean = option(options.gitClean, true);
  const wakeReportPresent = option(options.wakeReportPresent, true);
  const livingMarketCoreAccepted = option(
    options.livingMarketCoreAccepted,
    true
  );
  const visualState = options.visualAcceptance ?? "pending";
  const assistantReady = option(options.assistantReady, true);
  const settingsDiagnosticsReady = option(
    options.settingsDiagnosticsReady,
    true
  );
  const alkonPrivateReady = option(options.alkonPrivateReady, true);
  const localDayOneStarted = option(options.localDayOneStarted, false);

  return [
    gate({
      gateId: "ProductTruthGate",
      label: "Product Truth Gate",
      outcome: productTruthSafe ? "pass" : "blocked",
      blocksActivation: !productTruthSafe,
      blocksLocalDayOne: !productTruthSafe,
      evidence: audit.productTruthSummary,
      nextAction: productTruthSafe
        ? "Preserve Product Truth."
        : "Fix Product Truth before activation.",
    }),
    gate({
      gateId: "PublicPrivateBoundaryGate",
      label: "Public/Private Boundary Gate",
      outcome: publicPrivateBoundarySafe ? "pass" : "blocked",
      blocksActivation: !publicPrivateBoundarySafe,
      blocksLocalDayOne: !publicPrivateBoundarySafe,
      evidence:
        publicPrivateBoundarySafe
          ? "No public Alkon Operating Mode, Zero Truth, or Founder Command language is allowed."
          : "Public/private boundary failure detected.",
      nextAction: publicPrivateBoundarySafe
        ? "Keep public leak tests active."
        : "Remove public leak.",
    }),
    gate({
      gateId: "BuildValidationGate",
      label: "Build Validation Gate",
      outcome: buildValidationPassed ? "pass_with_notes" : "blocked",
      blocksActivation: !buildValidationPassed,
      blocksLocalDayOne: !buildValidationPassed,
      evidence:
        "Latest clean baseline exists; this command must still finish with fresh validation evidence.",
      nextAction: buildValidationPassed
        ? "Run and record validation."
        : "Fix failed validation.",
    }),
    gate({
      gateId: "GitCleanGate",
      label: "Git Clean Gate",
      outcome: gitClean ? "pass_with_notes" : "blocked",
      blocksActivation: !gitClean,
      blocksLocalDayOne: !gitClean,
      evidence:
        "Activation closure requires intentional commit and clean status after validation.",
      nextAction: gitClean
        ? "Verify clean Git after commit."
        : "Resolve dirty Git before activation.",
    }),
    gate({
      gateId: "WakeReportGate",
      label: "Wake Report Gate",
      outcome: wakeReportPresent ? "pass" : "needs_review",
      blocksActivation: !wakeReportPresent,
      blocksLocalDayOne: !wakeReportPresent,
      evidence:
        "Wake Report, last full report, execution history, and next command maintain continuity.",
      nextAction: wakeReportPresent
        ? "Update reports after validation."
        : "Create or repair Wake Report chain.",
    }),
    gate({
      gateId: "LivingMarketCoreGate",
      label: "Living Market Core Gate",
      outcome: livingMarketCoreAccepted ? "pass" : "needs_review",
      blocksActivation: false,
      blocksLocalDayOne: !livingMarketCoreAccepted,
      evidence:
        "Prime World remains Pro Max Trading; chart-first Workspace is the heart.",
      nextAction: livingMarketCoreAccepted
        ? "Preserve chart-first hierarchy."
        : "Review and fix Living Market Core before Local Day One.",
    }),
    gate({
      gateId: "VisualAcceptanceGate",
      label: "Visual Acceptance Gate",
      outcome:
        visualState === "accepted"
          ? "pass"
          : visualState === "rejected"
            ? "needs_review"
            : "needs_review",
      blocksActivation: false,
      blocksLocalDayOne: visualState !== "accepted",
      evidence:
        "Visual acceptance is Ahmad's human gate; code cannot fake acceptance.",
      nextAction:
        visualState === "accepted"
          ? "Proceed to Final Universal Closure."
          : visualState === "rejected"
            ? "Create focused visual correction."
            : "Ask Ahmad for visual acceptance or rejection.",
    }),
    gate({
      gateId: "AssistantReadinessGate",
      label: "Assistant Readiness Gate",
      outcome: assistantReady ? "pass" : "needs_review",
      blocksActivation: false,
      blocksLocalDayOne: !assistantReady,
      evidence:
        "Assistant is a comfort/language layer and cannot give signals or execute.",
      nextAction: assistantReady
        ? "Keep Assistant non-executing."
        : "Fix Assistant safety and placement.",
    }),
    gate({
      gateId: "SettingsDiagnosticsGate",
      label: "Settings and Diagnostics Gate",
      outcome: settingsDiagnosticsReady ? "pass" : "needs_review",
      blocksActivation: false,
      blocksLocalDayOne: !settingsDiagnosticsReady,
      evidence:
        "Settings and Diagnostics stay public-safe and avoid private operating terms.",
      nextAction: settingsDiagnosticsReady
        ? "Keep public readiness calm."
        : "Fix public-safe Settings/Diagnostics.",
    }),
    gate({
      gateId: "AlkonPrivateReadinessGate",
      label: "Alkon Private Readiness Gate",
      outcome: alkonPrivateReady ? "pass" : "needs_review",
      blocksActivation: !alkonPrivateReady,
      blocksLocalDayOne: !alkonPrivateReady,
      evidence:
        "Alkon Operating Mode is Founder/private, read-only, and no-execution.",
      nextAction: alkonPrivateReady
        ? "Keep private-only readiness."
        : "Repair private readiness before activation.",
    }),
    gate({
      gateId: "LocalDayOneGate",
      label: "Local Day One Gate",
      outcome:
        localDayOneStarted && visualState === "accepted"
          ? "pass"
          : visualState === "accepted"
            ? "future"
            : "needs_review",
      blocksActivation: false,
      blocksLocalDayOne: visualState !== "accepted",
      evidence:
        "Local Day One is closed local review and cannot start without Ahmad visual acceptance.",
      nextAction:
        visualState === "accepted"
          ? "Start Local Day One only after Final Universal Closure passes."
          : "Wait for Ahmad visual acceptance.",
    }),
  ];
}

export function decideAlkonActivation(
  gates: ActivationGate[]
): {
  status: OperatingModeStatus;
  activationDecision: ActivationDecision;
} {
  const activationBlocked = gates.some(
    (item) => item.blocksActivation && item.outcome === "blocked"
  );

  if (activationBlocked) {
    return {
      status: "blocked",
      activationDecision: "blocked",
    };
  }

  const hasNotes = gates.some(
    (item) =>
      item.outcome === "pass_with_notes" ||
      item.outcome === "needs_review" ||
      item.outcome === "future"
  );

  return hasNotes
    ? {
        status: "active_with_notes",
        activationDecision: "activate_with_notes",
      }
    : {
        status: "active",
        activationDecision: "activate",
      };
}
