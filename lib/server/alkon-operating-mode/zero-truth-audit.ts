import type {
  AlkonOperatingModeOptions,
  OperatingRealityFinding,
  ZeroTruthAudit,
  ZeroTruthStatus,
} from "./types";

function option(value: boolean | undefined, fallback: boolean) {
  return value ?? fallback;
}

function finding(input: OperatingRealityFinding): OperatingRealityFinding {
  return input;
}

function blockedFinding(
  findingId: string,
  label: string,
  summary: string,
  evidence: string[],
  nextAction: string
): OperatingRealityFinding {
  return finding({
    findingId,
    area:
      findingId.includes("public_private")
        ? "public_leak_status"
        : findingId.includes("git") || findingId.includes("build")
          ? "tests_build_git"
          : "product_truth",
    label,
    classification: "blocked",
    severity: "P0_critical",
    evidenceStatus: "blocked",
    summary,
    evidence,
    risk: "Blocks Alkon Operating Mode activation until corrected.",
    needsAhmad: false,
    nextAction,
  });
}

function statusFor(findings: OperatingRealityFinding[]): ZeroTruthStatus {
  if (
    findings.some(
      (item) =>
        item.classification === "blocked" ||
        item.severity === "P0_critical" ||
        item.severity === "black_hole"
    )
  ) {
    return "blocked";
  }

  if (
    findings.some(
      (item) =>
        item.classification === "needs_fix" || item.severity === "blocked"
    )
  ) {
    return "has_blockers";
  }

  if (
    findings.some(
      (item) =>
        item.classification === "needs_visual_review" ||
        item.classification === "ready_with_notes"
    )
  ) {
    return "needs_review";
  }

  return "clean";
}

export function getZeroTruthAudit(
  checkedAt = new Date().toISOString(),
  options: AlkonOperatingModeOptions = {}
): ZeroTruthAudit {
  const visualState = options.visualAcceptance ?? "pending";
  const productTruthSafe = option(options.productTruthSafe, true);
  const publicPrivateBoundarySafe = option(
    options.publicPrivateBoundarySafe,
    true
  );
  const buildValidationPassed = option(options.buildValidationPassed, true);
  const gitClean = option(options.gitClean, true);

  const findings: OperatingRealityFinding[] = [
    finding({
      findingId: "public_pro_max_reality_clean",
      area: "public_pro_max_reality",
      label: "Public Pro Max Reality",
      classification: "accepted",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Public users remain in Pro Max and Pro Max Trading language.",
      evidence: ["Home, Workspace, Markets, Plans, Apps, Support, Settings, and Diagnostics are public-safe surfaces."],
      risk: null,
      needsAhmad: false,
      nextAction: "Keep public copy truth-first and free of internal doctrine.",
    }),
    finding({
      findingId: "private_alkon_universe_ready",
      area: "private_alkon_universe",
      label: "Private Alkon Universe",
      classification: "ready_with_notes",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Private Founder systems exist as read-only readiness surfaces.",
      evidence: ["Founder Command, Source Law, Final Convergence, Infinite Growth, and Alkon subsystems are private snapshot systems."],
      risk: "Private routes still require future owner auth/device trust before any execution.",
      needsAhmad: false,
      nextAction: "Keep Alkon private and read-only.",
    }),
    finding({
      findingId: "invisible_operating_layer_preserved",
      area: "invisible_operating_layer",
      label: "Invisible Operating Layer",
      classification: "accepted",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Internal readiness maps to public-safe labels without exposing private internals.",
      evidence: ["Public Diagnostics uses readiness/Product Truth language."],
      risk: null,
      needsAhmad: false,
      nextAction: "Continue translating internal state into public-safe status.",
    }),
    finding({
      findingId: "prime_world_heart_ready",
      area: "prime_world",
      label: "Pro Max Trading / Prime World",
      classification: option(options.livingMarketCoreAccepted, true)
        ? "accepted"
        : "needs_fix",
      severity: option(options.livingMarketCoreAccepted, true)
        ? "P2_standard"
        : "P1_high",
      evidenceStatus: "present",
      summary: "The Prime World remains Pro Max Trading, with Workspace and chart as the heart.",
      evidence: ["Latest baseline rebuilt the Trading Workspace around chart-first hierarchy."],
      risk: option(options.livingMarketCoreAccepted, true)
        ? null
        : "Prime World heart must be accepted before closure.",
      needsAhmad: !option(options.livingMarketCoreAccepted, true),
      nextAction: option(options.livingMarketCoreAccepted, true)
        ? "Preserve chart-first Trading Workspace."
        : "Fix Living Market Core before closing Station 1.",
    }),
    finding({
      findingId: "trading_workspace_chart_first",
      area: "trading_workspace",
      label: "Trading Workspace / Living Market Core",
      classification: "ready_with_notes",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Workspace is rebuilt visually, but Ahmad's human acceptance remains the final gate.",
      evidence: ["Chart-first hierarchy, integrated paper execution, collapsed Assistant, and secondary Journal/Coach were verified in the prior baseline."],
      risk: "Visual acceptance is human-only and cannot be faked by code.",
      needsAhmad: true,
      nextAction: "Ask Ahmad to accept or reject the latest visual proof.",
    }),
    finding({
      findingId: "assistant_readiness_preserved",
      area: "assistant",
      label: "Pro Max Assistant",
      classification: option(options.assistantReady, true)
        ? "accepted"
        : "needs_fix",
      severity: option(options.assistantReady, true) ? "P2_standard" : "P1_high",
      evidenceStatus: "present",
      summary: "Assistant remains a language/help layer, not a trading signal or execution layer.",
      evidence: ["Assistant prompts and blocked explanations are public-safe."],
      risk: null,
      needsAhmad: false,
      nextAction: "Keep Assistant non-advisory and non-executing.",
    }),
    finding({
      findingId: "product_truth_preserved",
      area: "product_truth",
      label: "Product Truth",
      classification: productTruthSafe ? "accepted" : "blocked",
      severity: productTruthSafe ? "P2_standard" : "P0_critical",
      evidenceStatus: productTruthSafe ? "present" : "blocked",
      summary: "Product Truth summary keeps live execution blocked, real money blocked, billing inactive, public launch inactive, and social publishing inactive.",
      evidence: ["No live execution, real money, broker/feed, billing, or public launch activation is claimed."],
      risk: productTruthSafe ? null : "Product Truth failure blocks activation.",
      needsAhmad: false,
      nextAction: productTruthSafe
        ? "Keep Product Truth visible and compact."
        : "Fix Product Truth failure before any activation.",
    }),
    finding({
      findingId: "visual_acceptance_human_gate",
      area: "visual_acceptance",
      label: "Visual Acceptance",
      classification:
        visualState === "accepted"
          ? "accepted"
          : visualState === "rejected"
            ? "needs_fix"
            : "needs_visual_review",
      severity: visualState === "rejected" ? "P1_high" : "P2_standard",
      evidenceStatus:
        visualState === "accepted" ? "present" : "needs_review",
      summary: "Visual acceptance engine remains partial; final acceptance must be Ahmad's human judgment.",
      evidence: ["Screenshots exist for the latest visual balance pass.", "No fake 10/10 or fake Local Day One acceptance is allowed."],
      risk: "Local Day One cannot start until Ahmad accepts visual review.",
      needsAhmad: visualState !== "accepted",
      nextAction:
        visualState === "accepted"
          ? "Proceed to Final Universal Closure checks."
          : visualState === "rejected"
            ? "Create a focused visual correction command."
            : "Ask Ahmad for visual acceptance or rejection.",
    }),
    finding({
      findingId: "header_logo_earth_identity_ready",
      area: "header_logo_earth_identity",
      label: "Header / Logo / Earth Identity",
      classification: "ready_with_notes",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Public identity is code-only, chart-safe, and aligned with Earth-native Pro Max identity.",
      evidence: ["Header remains orientation-only; Earth identity supports rather than covers the chart."],
      risk: "Future Earth texture activation requires licensed metadata.",
      needsAhmad: false,
      nextAction: "Keep identity subtle in workspace and richer only where appropriate.",
    }),
    finding({
      findingId: "settings_diagnostics_ready",
      area: "settings_diagnostics",
      label: "Settings / Diagnostics",
      classification: option(options.settingsDiagnosticsReady, true)
        ? "accepted"
        : "needs_fix",
      severity: option(options.settingsDiagnosticsReady, true)
        ? "P2_standard"
        : "P1_high",
      evidenceStatus: "present",
      summary: "Settings and Diagnostics remain public-safe control and truth surfaces.",
      evidence: ["Diagnostics avoids private operating-mode language."],
      risk: null,
      needsAhmad: false,
      nextAction: "Keep public readiness calm and compact.",
    }),
    finding({
      findingId: "apps_plans_support_truthful",
      area: "apps_plans_support",
      label: "Apps / Plans / Support",
      classification: "accepted",
      severity: "P2_standard",
      evidenceStatus: "present",
      summary: "Plans, apps, and support stay truthful: Free active, paid tiers planned/future, web current, no fake downloads.",
      evidence: ["Product Truth blocks fake paid activation and fake native app claims."],
      risk: null,
      needsAhmad: false,
      nextAction: "Preserve planned/inactive/future labels.",
    }),
    finding({
      findingId: "tests_build_git_verified_baseline",
      area: "tests_build_git",
      label: "Tests / Build / Git",
      classification:
        buildValidationPassed && gitClean ? "accepted" : "blocked",
      severity: buildValidationPassed && gitClean ? "P2_standard" : "P0_critical",
      evidenceStatus: buildValidationPassed && gitClean ? "present" : "blocked",
      summary: "Latest baseline was clean and validated; the current command must re-run validation before commit.",
      evidence: ["Wake reports record the latest clean baseline.", "This command must produce fresh validation evidence."],
      risk:
        buildValidationPassed && gitClean
          ? "Fresh validation is still required before commit."
          : "Failed validation or dirty Git blocks activation.",
      needsAhmad: false,
      nextAction: "Run the full validation command list before closure.",
    }),
    finding({
      findingId: "wake_report_chain_present",
      area: "reports_wake_report",
      label: "Reports / Wake Report",
      classification: option(options.wakeReportPresent, true)
        ? "accepted"
        : "needs_fix",
      severity: option(options.wakeReportPresent, true)
        ? "P2_standard"
        : "P1_high",
      evidenceStatus: option(options.wakeReportPresent, true)
        ? "present"
        : "missing",
      summary: "Operational reports exist and must be updated after validation.",
      evidence: ["Wake report, last full report, execution history, and next command files are maintained."],
      risk: option(options.wakeReportPresent, true)
        ? null
        : "Missing Wake Report blocks reliable continuity.",
      needsAhmad: false,
      nextAction: "Update reports after validation.",
    }),
    finding({
      findingId: "public_private_boundary_preserved",
      area: "public_leak_status",
      label: "Public Leak Status",
      classification: publicPrivateBoundarySafe ? "accepted" : "blocked",
      severity: publicPrivateBoundarySafe ? "P2_standard" : "P0_critical",
      evidenceStatus: publicPrivateBoundarySafe ? "present" : "blocked",
      summary: "Public users must not see Alkon Operating Mode, Zero Truth, Founder Command, or internal governance language.",
      evidence: ["Public leak tests check Home and Diagnostics."],
      risk: publicPrivateBoundarySafe ? null : "Public private leak blocks activation.",
      needsAhmad: false,
      nextAction: publicPrivateBoundarySafe
        ? "Keep public leak regression active."
        : "Remove public leak before any activation.",
    }),
    finding({
      findingId: "station_1_open_pending_acceptance",
      area: "station_1",
      label: "Station 1",
      classification: visualState === "accepted" ? "ready_with_notes" : "needs_visual_review",
      severity: "P2_standard",
      evidenceStatus: visualState === "accepted" ? "present" : "needs_review",
      summary: "Station 1 can continue toward closure only after visual acceptance and final closure checks.",
      evidence: ["Final Universal Closure remains gated by Product Truth, validation, reports, and Ahmad acceptance."],
      risk: "Future worlds must not expand before Station 1 closes.",
      needsAhmad: visualState !== "accepted",
      nextAction:
        visualState === "accepted"
          ? "Run Final Universal Closure."
          : "Wait for Ahmad visual review.",
    }),
    finding({
      findingId: "local_day_one_human_gate",
      area: "local_day_one",
      label: "Local Day One Readiness",
      classification:
        visualState === "accepted" && option(options.localDayOneStarted, false)
          ? "accepted"
          : "needs_visual_review",
      severity: "P2_standard",
      evidenceStatus:
        visualState === "accepted" ? "present" : "needs_review",
      summary: "Local Day One gate is closed-local review only; Ahmad visual acceptance remains required before start.",
      evidence: ["Local Day One is closed local review, not public launch.", "Human visual review remains required."],
      risk: "Starting Local Day One without Ahmad acceptance would fake readiness.",
      needsAhmad: visualState !== "accepted",
      nextAction:
        visualState === "accepted"
          ? "Start only closed Local Day One review if Final Universal Closure passes."
          : "Do not start Local Day One yet.",
    }),
  ];

  if (!productTruthSafe) {
    findings.push(
      blockedFinding(
        "product_truth_p0_blocker",
        "Product Truth P0",
        "Product Truth failed a hard safety condition.",
        ["Live, real money, billing, broker/feed, launch, or claims truth became unsafe."],
        "Fix Product Truth before any operating-mode activation."
      )
    );
  }

  if (!publicPrivateBoundarySafe) {
    findings.push(
      blockedFinding(
        "public_private_p0_blocker",
        "Public/Private Boundary P0",
        "Private Alkon language leaked into public Pro Max surfaces.",
        ["Public UI leak prevention failed."],
        "Remove public leak before activation."
      )
    );
  }

  if (!buildValidationPassed) {
    findings.push(
      blockedFinding(
        "build_validation_p0_blocker",
        "Build Validation P0",
        "Required validation failed.",
        ["TypeScript, lint, build, Prisma, regression, smoke, or diff validation failed."],
        "Fix validation failure before activation."
      )
    );
  }

  if (!gitClean) {
    findings.push(
      blockedFinding(
        "git_clean_p0_blocker",
        "Git Clean P0",
        "Git is dirty when activation requires clean closure.",
        ["Dirty Git blocks activation until changes are intentionally committed or cleared."],
        "Commit verified changes or resolve dirty state before activation."
      )
    );
  }

  const blockers = findings.filter(
    (item) =>
      item.classification === "blocked" ||
      item.severity === "P0_critical" ||
      item.severity === "black_hole"
  );

  return {
    checkedAt,
    auditId: "alkon_zero_truth_audit",
    status: statusFor(findings),
    doctrine: "reality_audit_not_deletion",
    deletesProject: false,
    resetsCodebase: false,
    rebuildsFromBlank: false,
    findings,
    blockers,
    visualNotes: [
      "Ahmad visual acceptance remains the human gate.",
      "No fake 10/10, fake Local Day One, or fake launch readiness is allowed.",
      "Workspace hierarchy must stay Chart > Execution > Truth > Assistant > Journal/Coach > Atmosphere > Brand.",
    ],
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionActivationBlocked: true,
      socialPublishingInactive: true,
      noFakeClaims: true,
      noSecretsExposed: true,
      noShellExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      overall: productTruthSafe ? "preserved" : "blocked",
    },
    publicPrivateBoundaryStatus: publicPrivateBoundarySafe
      ? "preserved"
      : "blocked",
    productTruthSummary:
      "Live execution, real money, broker/feed, billing, public launch, production, social publishing, fake claims, secrets, shell execution, and raster assets remain blocked or inactive.",
    oneNextActionCandidate:
      blockers.length > 0
        ? "Fix P0 truth/security/build/public leak blocker."
        : visualState === "accepted"
          ? "Run Final Universal Closure before Local Day One."
          : visualState === "rejected"
            ? "Create a focused visual correction command."
            : "Ask Ahmad for visual acceptance or rejection.",
    localDayOneReadiness: {
      readyToStart:
        visualState === "accepted" && option(options.localDayOneStarted, false),
      visualAcceptanceRequired: visualState !== "accepted",
      status:
        blockers.length > 0
          ? "blocked"
          : visualState === "accepted" &&
              option(options.localDayOneStarted, false)
            ? "ready"
            : "waiting_ahmad_visual_acceptance",
    },
  };
}
