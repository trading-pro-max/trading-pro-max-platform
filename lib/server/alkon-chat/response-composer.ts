import type {
  AlkonChatCommandPassportDraft,
  AlkonChatContext,
  AlkonChatDecision,
  AlkonChatIntent,
  AlkonChatResponseSection,
  AlkonChatSafetyResult,
} from "./types";

function decide(intent: AlkonChatIntent, safety: AlkonChatSafetyResult): AlkonChatDecision {
  if (safety.blocked) return "refuse_unsafe";
  if (intent.type === "prepare_command_passport") return "prepare_passport_preview";
  if (intent.type === "founder_decision_request") return "request_ahmad_decision";
  if (intent.type === "focused_correction_request") return "return_to_heart";
  if (intent.type === "unknown") return "ask_for_focus";
  if (
    intent.type === "ask_local_day_one" ||
    intent.type === "ask_what_not_to_do" ||
    intent.type === "visual_review_guidance"
  ) {
    return "answer_with_warning";
  }

  return "answer";
}

function statusSections(context: AlkonChatContext): AlkonChatResponseSection[] {
  return [
    {
      title: "Operating Mode",
      body: `${context.operatingMode.statusLabel}. Activation decision: ${context.operatingMode.activationDecisionLabel}.`,
      tone: "ready",
    },
    {
      title: "Kernel",
      body: `${context.kernel.statusLabel}. ${context.kernel.commandCount} commands are loaded from Kernel 0-16.`,
      tone: "ready",
    },
    {
      title: "Heart",
      body: context.currentHeart,
    },
    {
      title: "Blocker",
      body: context.blockers[0] ?? "No blocker reported.",
      tone: "warning",
    },
    {
      title: "One Next Action",
      body: context.oneNextAction.action,
      tone: "ready",
    },
    {
      title: "What Not To Do",
      body: context.whatNotToDo[0] ?? "Do not expand scope without evidence.",
      tone: "blocked",
    },
  ];
}

function sectionsForIntent(
  intent: AlkonChatIntent,
  context: AlkonChatContext,
  safety: AlkonChatSafetyResult,
  passport?: AlkonChatCommandPassportDraft
): AlkonChatResponseSection[] {
  if (safety.blocked) {
    return [
      { title: "Blocked", body: safety.reason, tone: "blocked" },
      {
        title: "Why",
        body: "The request touches execution, money, live systems, public exposure, deletion, or secrets.",
        tone: "warning",
      },
      { title: "Safe Alternative", body: safety.safeAlternative, tone: "ready" },
    ];
  }

  if (passport) {
    return [
      { title: "Mission", body: passport.mission, tone: "ready" },
      { title: "Scope", body: passport.allowedScope.join(" / ") },
      { title: "Forbidden", body: passport.forbiddenScope.slice(0, 3).join(" / "), tone: "blocked" },
      { title: "Validation", body: passport.validation.join(" / ") },
      { title: "Visual Proof", body: passport.visualProof.join(" / ") },
      { title: "Wake Report", body: passport.wakeReportFormat.join(" / ") },
      { title: "Stop Conditions", body: passport.stopConditions.join(" / "), tone: "warning" },
    ];
  }

  switch (intent.type) {
    case "ask_zero_truth":
      return [
        {
          title: "Zero Truth",
          body: `${context.kernel.zeroTruthLabel}. ${context.blockers.length} blocker notes remain.`,
          tone: "warning",
        },
        { title: "One Next Action", body: context.oneNextAction.action, tone: "ready" },
        { title: "What Not To Do", body: context.whatNotToDo[0], tone: "blocked" },
      ];
    case "ask_one_next_action":
      return [
        { title: "One Next Action", body: context.oneNextAction.action, tone: "ready" },
        { title: "Why Now", body: context.oneNextAction.whyNow },
        { title: "Founder Decision", body: context.oneNextAction.founderDecisionNeeded ? "Ahmad decision is needed." : "No sensitive approval requested." },
      ];
    case "ask_wake_report":
      return [
        { title: "Wake Report", body: context.latestWakeReportSummary, tone: "ready" },
        { title: "Next", body: context.oneNextAction.action },
      ];
    case "ask_reality_trial":
      return [
        { title: "Reality Trial", body: `${context.realityTrial.outcomeLabel}. ${context.realityTrial.nextAction}`, tone: "warning" },
        { title: "Missing", body: context.realityTrial.missing.join(" / ") || "No missing item reported." },
      ];
    case "ask_evidence":
      return [
        { title: "Evidence Chain", body: context.evidenceSummary, tone: "warning" },
        { title: "Reality Trial", body: context.realityTrial.nextAction },
      ];
    case "ask_memory":
      return [
        { title: "Memory", body: `${context.memory.memoryStatus}. ${context.memory.lessons.length} lessons preserve continuity.`, tone: "ready" },
        { title: "Persistence", body: "This chat preview is stateless and read-only." },
      ];
    case "ask_device_status":
      return [
        { title: "Windows", body: context.deviceSummary.windows },
        { title: "iPhone", body: context.deviceSummary.iphone },
        { title: "Samsung", body: context.deviceSummary.samsung },
        { title: "Phone Boundary", body: `Phones are review-only. Blocked: ${context.deviceSummary.blockedOnPhones.join(" / ")}`, tone: "blocked" },
      ];
    case "ask_local_day_one":
      return [
        { title: "Local Day One Gate", body: context.localDayOneStatusLabel, tone: "blocked" },
        { title: "Visual Acceptance", body: context.visualAcceptanceLabel, tone: "warning" },
        { title: "Next", body: "Ahmad visual review comes before Local Day One." },
      ];
    case "ask_what_not_to_do":
      return context.whatNotToDo.slice(0, 5).map((item, index) => ({
        title: index === 0 ? "What Not To Do" : `Boundary ${index + 1}`,
        body: item,
        tone: "blocked" as const,
      }));
    case "classify_idea":
      return [
        { title: "Classification", body: "Classify the idea as public, private, or invisible before any build." },
        { title: "Boundary", body: "If it mentions Alkon, Kernel, Reality Trial, or Founder Command, keep it private.", tone: "warning" },
        { title: "One Next Action", body: context.oneNextAction.action },
      ];
    case "visual_review_guidance":
      return [
        { title: "Visual Review", body: context.visualAcceptanceLabel, tone: "warning" },
        { title: "Evidence", body: "Capture the private view, public Home, and public leak proof before acceptance." },
        { title: "What Not To Do", body: "Do not accept visually on Ahmad's behalf.", tone: "blocked" },
      ];
    case "focused_correction_request":
      return [
        { title: "Return To Heart", body: "Keep the correction focused on the current heart and visible blocker.", tone: "ready" },
        { title: "Scope", body: "Fix the smallest UI, route, copy, or proof issue that restores reality." },
        { title: "Boundary", body: "Do not open new products or activate unsafe systems.", tone: "blocked" },
      ];
    default:
      return statusSections(context);
  }
}

export function composeAlkonChatResponse(input: {
  intent: AlkonChatIntent;
  context: AlkonChatContext;
  safety: AlkonChatSafetyResult;
  passport?: AlkonChatCommandPassportDraft;
}) {
  const decision = decide(input.intent, input.safety);
  const sections = sectionsForIntent(
    input.intent,
    input.context,
    input.safety,
    input.passport
  );
  const response =
    decision === "refuse_unsafe"
      ? "Blocked. Alkon will not execute dangerous action. A safe preview path is available."
      : decision === "prepare_passport_preview"
        ? "Command Passport preview prepared. It does not execute."
        : "Alkon answers from private read-only state. Ahmad remains final authority.";

  return {
    decision,
    sections,
    response,
  };
}
