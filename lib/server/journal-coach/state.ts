import "server-only";

import type { DecisionReplayFoundation, JournalCoachPrompt, JournalCoachSnapshot } from "./types";

const prompts: JournalCoachPrompt[] = [
  {
    id: "session-readiness",
    title: "Session readiness",
    prompt: "What market condition are you rehearsing, and what would make you pause?",
    state: "active",
    planLevel: "demo_free",
    safeReason: "Frames paper-mode preparation without providing a trade signal.",
  },
  {
    id: "paper-mode-reminder",
    title: "Paper-mode reminder",
    prompt: "Confirm that this session is paper-only and that live execution remains blocked.",
    state: "active",
    planLevel: "demo_free",
    safeReason: "Keeps execution truth visible before decisions.",
  },
  {
    id: "decision-note",
    title: "Decision note",
    prompt: "Write the reason for the paper action before rehearsing it.",
    state: "active",
    planLevel: "demo_free",
    safeReason: "Encourages discipline and record quality, not prediction.",
  },
  {
    id: "post-session-learning",
    title: "Post-session learning",
    prompt: "What did you learn about timing, patience, or risk from this paper session?",
    state: "active",
    planLevel: "demo_free",
    safeReason: "Keeps coaching educational and non-manipulative.",
  },
  {
    id: "pro-journal-depth",
    title: "Pro journal depth",
    prompt: "Future Pro journal context may summarize repeat behaviors after entitlement support exists.",
    state: "planned",
    planLevel: "pro",
    safeReason: "Planned only; no paid access or premium unlock exists.",
  },
  {
    id: "vip-coach-review",
    title: "VIP coach review",
    prompt: "Future VIP coaching may review strategy notes after entitlement and safety gates exist.",
    state: "locked",
    planLevel: "vip",
    safeReason: "VIP is locked and cannot claim advanced coaching now.",
  },
  {
    id: "enterprise-team-report",
    title: "Enterprise team report",
    prompt: "Future Enterprise reports may summarize team behavior after team/admin support exists.",
    state: "planned",
    planLevel: "enterprise",
    safeReason: "Enterprise is future planned and not available now.",
  },
];

export function getDecisionReplayFoundation(input: {
  selectedSymbol?: string;
  timeframe?: string;
} = {}): DecisionReplayFoundation {
  return {
    mode: "decision_replay_foundation",
    selectedSymbol: input.selectedSymbol ?? "EUR/USD",
    timeframe: input.timeframe ?? "1m",
    contextQuality: "bounded",
    productTruthAtDecisionTime: {
      paperMode: "available",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeed: "fallback_or_unconfigured",
    },
    preflightState: "paper_safe_preflight",
    assistantGuidanceState: "bounded_context_only",
    allowedState: "paper_rehearsal_only",
    learningPrompts: [
      "What did the preflight state allow or block?",
      "Which market condition was rehearsed, and what evidence supported the paper decision?",
      "What would be reviewed differently next time without assuming a better outcome?",
    ],
    noAlternativeOutcomeGuarantee: true,
  };
}

export function getJournalCoachSnapshot(
  checkedAt = new Date().toISOString()
): JournalCoachSnapshot {
  return {
    checkedAt,
    mode: "journal_coach_foundation",
    currentPlan: "demo_free",
    planAccess: {
      demo: "basic_safe_prompts_active",
      pro: "deeper_session_review_planned",
      vip: "advanced_coaching_planned",
      enterprise: "team_reports_future",
    },
    prompts,
    localJournalFoundation: {
      persistence: "local_session_foundation",
      accountSync: "planned",
      privateSensitiveStorage: "not_enabled",
      persistenceGap:
        "Production journal storage is not active; this pass keeps notes local/session-ready until account-safe persistence is explicitly built.",
      entries: [
        {
          type: "session_note",
          label: "Session note",
          placeholder: "What paper-market condition are you rehearsing today?",
          safetyBoundary: "Paper-session context only; not advisory.",
        },
        {
          type: "decision_note",
          label: "Decision note",
          placeholder: "Why did you consider this paper action?",
          safetyBoundary: "Records reasoning without predicting outcome.",
        },
        {
          type: "lesson_learned",
          label: "Lesson learned",
          placeholder: "What did you learn about timing, patience, or risk?",
          safetyBoundary: "Educational reflection only.",
        },
        {
          type: "blocked_state_note",
          label: "Blocked state note",
          placeholder: "Which blocked or fallback state shaped the session?",
          safetyBoundary: "Keeps blocked product truth visible.",
        },
      ],
    },
    phases: [
      {
        phase: "pre_session",
        state: "active",
        guidance: "Check paper mode, fallback context, and personal pause conditions.",
      },
      {
        phase: "during_session",
        state: "active",
        guidance: "Use compact caution prompts without trade signals or pressure.",
      },
      {
        phase: "post_session",
        state: "active",
        guidance: "Reflect on timing, patience, risk adherence, and what was learned.",
      },
      {
        phase: "decision_replay",
        state: "planned",
        guidance: "Replay will capture product truth and context quality without claiming alternate outcomes.",
      },
    ],
    decisionReplay: getDecisionReplayFoundation(),
    planTruth: {
      demo: "basic_prompts_active",
      pro: "journal_depth_planned",
      vip: "advanced_coaching_planned",
    },
    safety: {
      profitGuarantee: "blocked",
      financialAdvice: "blocked",
      tradingSignals: "blocked",
      manipulation: "blocked",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    },
  };
}
