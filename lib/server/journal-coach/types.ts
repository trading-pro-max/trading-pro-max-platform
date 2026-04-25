export type JournalCoachPlanLevel = "demo_free" | "pro" | "vip" | "enterprise";

export type JournalCoachPromptState = "active" | "planned" | "locked";

export type JournalCoachPrompt = {
  id: string;
  title: string;
  prompt: string;
  state: JournalCoachPromptState;
  planLevel: JournalCoachPlanLevel;
  safeReason: string;
};

export type JournalCoachPhase =
  | "pre_session"
  | "during_session"
  | "post_session"
  | "decision_replay";

export type JournalEntryType =
  | "session_note"
  | "decision_note"
  | "lesson_learned"
  | "blocked_state_note"
  | "paper_reflection";

export type JournalEntryFoundation = {
  type: JournalEntryType;
  label: string;
  placeholder: string;
  safetyBoundary: string;
};

export type DecisionReplayFoundation = {
  mode: "decision_replay_foundation";
  selectedSymbol: string;
  timeframe: string;
  contextQuality: "bounded";
  productTruthAtDecisionTime: {
    paperMode: "available";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerFeed: "fallback_or_unconfigured";
  };
  preflightState: "paper_safe_preflight";
  assistantGuidanceState: "bounded_context_only";
  allowedState: "paper_rehearsal_only";
  learningPrompts: string[];
  noAlternativeOutcomeGuarantee: true;
};

export type JournalCoachSnapshot = {
  checkedAt: string;
  mode: "journal_coach_foundation";
  currentPlan: "demo_free";
  planAccess: {
    demo: "basic_safe_prompts_active";
    pro: "deeper_session_review_planned";
    vip: "advanced_coaching_planned";
    enterprise: "institutional_team_reports_future";
  };
  prompts: JournalCoachPrompt[];
  localJournalFoundation: {
    persistence: "local_session_foundation";
    accountSync: "planned";
    privateSensitiveStorage: "not_enabled";
    entries: JournalEntryFoundation[];
    persistenceGap: string;
  };
  phases: Array<{
    phase: JournalCoachPhase;
    state: "active" | "planned" | "locked";
    guidance: string;
  }>;
  decisionReplay: DecisionReplayFoundation;
  planTruth: {
    demo: "basic_prompts_active";
    pro: "journal_depth_planned";
    vip: "advanced_coaching_planned";
  };
  safety: {
    profitGuarantee: "blocked";
    financialAdvice: "blocked";
    tradingSignals: "blocked";
    manipulation: "blocked";
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
  };
};
