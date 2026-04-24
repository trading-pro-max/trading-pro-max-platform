export type JournalCoachPlanLevel = "demo_free" | "pro" | "vip";

export type JournalCoachPromptState = "active" | "planned" | "locked";

export type JournalCoachPrompt = {
  id: string;
  title: string;
  prompt: string;
  state: JournalCoachPromptState;
  planLevel: JournalCoachPlanLevel;
  safeReason: string;
};

export type JournalCoachSnapshot = {
  checkedAt: string;
  mode: "journal_coach_foundation";
  currentPlan: "demo_free";
  prompts: JournalCoachPrompt[];
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
