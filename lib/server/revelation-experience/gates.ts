import type {
  RevelationCheck,
  RevelationCheckStatus,
  RevelationGate,
  RevelationGateId,
  RevelationGoal,
  RevelationStage,
  RevelationSurface,
} from "./types";

function check(input: {
  id: string;
  stage: RevelationStage;
  surface: RevelationSurface;
  goal: RevelationGoal;
  requirement: string;
  status?: RevelationCheckStatus;
  reason: string;
  requiredFix?: string;
  proof: string;
}): RevelationCheck {
  return {
    checkId: input.id,
    stage: input.stage,
    surface: input.surface,
    goal: input.goal,
    requirement: input.requirement,
    status: input.status ?? "pass",
    reason: input.reason,
    requiredFix: input.requiredFix ?? "None for this pass.",
    proof: input.proof,
  };
}

function summarizeStatus(checks: RevelationCheck[]): RevelationCheckStatus {
  if (checks.some((item) => item.status === "blocked")) return "blocked";
  if (checks.some((item) => item.status === "needs_polish")) return "needs_polish";
  if (checks.some((item) => item.status === "future")) return "future";
  return "pass";
}

function gate(
  gateId: RevelationGateId,
  label: string,
  checks: RevelationCheck[],
  summary: string
): RevelationGate {
  return {
    gateId,
    label,
    status: summarizeStatus(checks),
    checks,
    summary,
  };
}

export function buildRevelationChecks(): RevelationCheck[] {
  return [
    check({
      id: "earth_presence_trust",
      stage: "first_3_seconds",
      surface: "home",
      goal: "trust",
      requirement:
        "Home immediately shows Trading Pro Max, Earth-native atmosphere, calm professional tone, and a short Product Truth line.",
      reason:
        "The first screen should feel stable, real, and paper-safe before it explains deeper systems.",
      proof:
        "Public hero uses LivingEarthBackground, Trading Pro Max identity, Paper-safe/Web current/Live inactive copy, and no raster assets.",
    }),
    check({
      id: "above_fold_clutter_guard",
      stage: "first_3_seconds",
      surface: "home",
      goal: "trust",
      requirement:
        "Above-fold content avoids a card wall, warning spam, casino styling, and too many competing CTAs.",
      reason:
        "The product should feel like a calm trading workspace, not a promotional or game-like landing page.",
      proof:
        "Hero keeps primary entry, Assistant guidance, compact truth chips, and a small signal rail.",
    }),
    check({
      id: "logo_visual_acceptance",
      stage: "first_3_seconds",
      surface: "home",
      goal: "trust",
      requirement:
        "Brand mark remains visible but final logo judgment is reserved for human visual acceptance.",
      status: "needs_polish",
      reason:
        "Logo work has been sensitive and should not be called final without Ahmad's review.",
      requiredFix: "Run human visual acceptance before any final brand approval claim.",
      proof:
        "Hero uses the existing compact brand identity and marks logo_visual_acceptance_needed as a polish item.",
    }),
    check({
      id: "product_definition_clear",
      stage: "first_10_seconds",
      surface: "home",
      goal: "clarity",
      requirement:
        "Users understand that Trading Pro Max is a paper-safe web trading workspace with plans and apps clearly labeled by readiness.",
      reason:
        "Product clarity must arrive before users search through settings or diagnostics.",
      proof:
        "Home points to Trading Workspace, Apps / Platforms, Plans, Academy, Support, and TPM Assistant.",
    }),
    check({
      id: "truth_strip_compact",
      stage: "first_10_seconds",
      surface: "home",
      goal: "clarity",
      requirement:
        "Product Truth stays compact: Paper-safe active, Web current, Desktop/Mobile planned, Live/Broker/Billing inactive.",
      reason:
        "Truth should create trust without flooding the public entry with warnings.",
      proof:
        "Public shell/status and hero reveal use compact readiness chips instead of repeated full disclaimers.",
    }),
    check({
      id: "assistant_intents_visible",
      stage: "first_30_seconds",
      surface: "assistant",
      goal: "guidance",
      requirement:
        "TPM Assistant exposes short intent prompts for Start, Why blocked, Bigger chart, Calmer, Plans, Apps, Support, and Journal.",
      reason:
        "The Assistant should become the natural path for secondary actions without burying essential navigation.",
      proof:
        "Home Assistant guidance and Workspace prompt chips use short public-safe intents.",
    }),
    check({
      id: "assistant_safety_boundaries",
      stage: "first_30_seconds",
      surface: "assistant",
      goal: "guidance",
      requirement:
        "Assistant explains active/planned/inactive/future states, blocks unsafe requests, and avoids trading signals.",
      reason:
        "Guidance must improve understanding without pretending to activate live systems or advise trades.",
      proof:
        "Companion responses route blocked intents to safe alternatives and state no execution authority.",
    }),
    check({
      id: "workspace_terminal_only",
      stage: "first_3_minutes",
      surface: "trading_workspace",
      goal: "usefulness",
      requirement:
        "Trading Workspace has one terminal shell, no public navigation row, one compact brand mark, and chart-first layout.",
      reason:
        "The first three minutes should prove useful without navigation duplication or chart distraction.",
      proof:
        "Workspace renders data-shell-mode='workspace', one terminal topbar, chart card, paper execution rail, and compact Assistant launcher.",
    }),
    check({
      id: "workspace_truth_compact",
      stage: "first_3_minutes",
      surface: "trading_workspace",
      goal: "usefulness",
      requirement:
        "Workspace shows paper-safe truth and fallback/demo state compactly without fake live-feed or broker claims.",
      reason:
        "Users should understand what is safe immediately while staying focused on chart rehearsal.",
      proof:
        "Terminal topbar, ticket preflight, and depth rail label paper-only, fallback, and blocked states.",
    }),
    check({
      id: "workspace_chart_pulse_polish_needed",
      stage: "first_3_minutes",
      surface: "trading_workspace",
      goal: "usefulness",
      requirement:
        "Workspace market pulse can be polished further, but current workspace remains safe and useful.",
      status: "needs_polish",
      reason:
        "The current workspace is chart-safe and functional, but deeper market-pulse polish should remain an explicit future task.",
      requiredFix:
        "Keep the current chart-safe layout and schedule focused market-pulse polish only after visual acceptance.",
      proof:
        "Snapshot marks workspace_chart_pulse_polish_needed without claiming final market-pulse polish.",
    }),
    check({
      id: "journal_coach_first_day",
      stage: "first_day",
      surface: "journal_coach",
      goal: "continuity",
      requirement:
        "First-day loop connects paper practice, Why Blocked, Journal prompts, Coach reflection, Academy, Support, and Personal Reality controls.",
      reason:
        "The product should feel trustworthy over time by helping users remember what they learned.",
      proof:
        "Home and Settings show Journal/Coach readiness; Assistant prompts guide reflective paper-mode notes.",
    }),
    check({
      id: "memory_truth_no_fake_persistence",
      stage: "first_day",
      surface: "journal_coach",
      goal: "continuity",
      requirement:
        "Journal/Coach continuity is truthful about readiness and does not fake durable account persistence.",
      reason:
        "Memory should build trust only when its persistence and safety limits are clear.",
      proof:
        "Diagnostics labels safe note readiness and local/session readiness without fake backend claims.",
    }),
    check({
      id: "product_truth_gate_check",
      stage: "first_10_seconds",
      surface: "diagnostics",
      goal: "trust",
      requirement:
        "Live execution, real money, broker/feed, billing, public launch, fake downloads, and fake claims remain blocked or inactive.",
      reason:
        "The revelation experience cannot trade clarity for hype.",
      proof:
        "Product Truth remains a deterministic snapshot and Diagnostics shows public-safe readiness.",
    }),
    check({
      id: "public_private_boundary_check",
      stage: "first_3_seconds",
      surface: "home",
      goal: "trust",
      requirement:
        "Public users never see private command systems, internal language, or owner-only terms.",
      reason:
        "A clean public product depends on strong private-system boundaries.",
      proof:
        "Public tests scan Home, Workspace, Settings, Diagnostics, and public API payloads for forbidden internal terms.",
    }),
    check({
      id: "accessibility_motion_check",
      stage: "first_day",
      surface: "settings",
      goal: "continuity",
      requirement:
        "Reduced motion, Static Mode, and High Contrast remain available and do not require motion to understand the page.",
      reason:
        "The experience must stay calm, readable, and user-controlled.",
      proof:
        "Settings exposes environment, Personal Reality, Static/Low Motion/High Contrast controls and CSS disables motion under reduced-motion.",
    }),
  ];
}

export function buildRevelationGates(): RevelationGate[] {
  const checks = buildRevelationChecks();
  const byId = (ids: string[]) => checks.filter((item) => ids.includes(item.checkId));

  return [
    gate(
      "earth_presence_gate",
      "Earth Presence Gate",
      byId(["earth_presence_trust", "above_fold_clutter_guard", "logo_visual_acceptance"]),
      "First sight is calm, Earth-native, professional, trading-related, and not final-brand-claimed."
    ),
    gate(
      "product_clarity_gate",
      "Product Clarity Gate",
      byId(["product_definition_clear", "truth_strip_compact"]),
      "Users can understand what is active now, where to start, and what is planned or inactive."
    ),
    gate(
      "assistant_awakening_gate",
      "Assistant Awakening Gate",
      byId(["assistant_intents_visible", "assistant_safety_boundaries"]),
      "TPM Assistant is visible as the path for secondary intent while staying bounded."
    ),
    gate(
      "workspace_usefulness_gate",
      "Workspace Usefulness Gate",
      byId([
        "workspace_terminal_only",
        "workspace_truth_compact",
        "workspace_chart_pulse_polish_needed",
      ]),
      "Workspace is terminal-only, chart-first, paper-safe, and useful without claiming final market-pulse polish."
    ),
    gate(
      "first_day_continuity_gate",
      "First-Day Continuity Gate",
      byId(["journal_coach_first_day", "memory_truth_no_fake_persistence"]),
      "Journal, Coach, Academy, Support, and safe memory readiness give the first-day loop continuity."
    ),
    gate(
      "product_truth_gate",
      "Product Truth Gate",
      byId(["product_truth_gate_check"]),
      "Truth remains calm and compact without fake activation."
    ),
    gate(
      "public_private_boundary_gate",
      "Public/Private Boundary Gate",
      byId(["public_private_boundary_check"]),
      "Public surfaces remain free of private command language."
    ),
    gate(
      "accessibility_gate",
      "Accessibility Gate",
      byId(["accessibility_motion_check"]),
      "Reduced motion, Static Mode, and High Contrast stay available."
    ),
    gate(
      "visual_acceptance_gate",
      "Visual Acceptance Gate",
      byId(["logo_visual_acceptance", "workspace_chart_pulse_polish_needed"]),
      "Human visual acceptance remains required for brand and deeper market-pulse polish."
    ),
  ];
}
