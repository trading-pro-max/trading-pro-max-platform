export type IntelligenceAvailability =
  | "grounded"
  | "bounded"
  | "degraded"
  | "insufficient_data";

export type IntelligenceConfidenceBand =
  | "high"
  | "moderate"
  | "guarded"
  | "low";

export type IntelligenceBias = "constructive" | "defensive" | "neutral";
export type IntelligenceRegimeState = "trend" | "range" | "transition";
export type IntelligenceMomentumState =
  | "accelerating_up"
  | "accelerating_down"
  | "mixed"
  | "flat";
export type IntelligenceVolatilityState =
  | "compressed"
  | "contained"
  | "elevated"
  | "expansive";
export type IntelligenceStructureState =
  | "continuation"
  | "rotation"
  | "balance"
  | "breakout_attempt";

export type IntelligenceReadinessState = "ready" | "guarded" | "blocked";
export type IntelligenceSetupQuality = "aligned" | "mixed" | "weak" | "blocked";
export type IntelligenceSessionQuality =
  | "disciplined"
  | "guarded"
  | "locked";
export type IntelligenceRiskPosture = "normal" | "reduced" | "blocked";
export type IntelligenceOperatorAction =
  | "paper_trade_allowed"
  | "reduce_size"
  | "observe_only"
  | "stand_down";

export type IntelligenceCautionCode =
  | "fallback_feed"
  | "degraded_feed"
  | "insufficient_market_structure"
  | "high_volatility"
  | "range_bound"
  | "mixed_signal_alignment"
  | "session_guarded"
  | "session_locked"
  | "capacity_reached"
  | "paper_gate_closed"
  | "real_mode_blocked"
  | "manual_review_pending";

export type MarketContextIntelligence = {
  availability: IntelligenceAvailability;
  confidenceBand: IntelligenceConfidenceBand;
  confidenceScore: number;
  bias: IntelligenceBias;
  regime: IntelligenceRegimeState;
  momentum: IntelligenceMomentumState;
  volatility: IntelligenceVolatilityState;
  structure: IntelligenceStructureState;
  feedProvenance: "external" | "fallback" | "degraded" | "local";
  symbol: string;
  timeframe: string;
  feedLabel: string;
  candleSampleSize: number;
  trendStrength: number;
  intervalMovePercent: number;
  averageRangePercent: number;
  cautionCodes: IntelligenceCautionCode[];
};

export type ExecutionContextIntelligence = {
  availability: IntelligenceAvailability;
  readiness: IntelligenceReadinessState;
  setupQuality: IntelligenceSetupQuality;
  sessionQuality: IntelligenceSessionQuality;
  riskPosture: IntelligenceRiskPosture;
  action: IntelligenceOperatorAction;
  alignmentScore: number;
  cautionCodes: IntelligenceCautionCode[];
};

export type OperatorGuidanceIntelligence = {
  availability: IntelligenceAvailability;
  primaryAction: IntelligenceOperatorAction;
  secondaryAction?: IntelligenceOperatorAction;
  cautionCodes: IntelligenceCautionCode[];
};

export type IntelligenceTruthSurface = {
  state: "active" | "limited" | "degraded";
  predictiveScope: "interpretive_only";
  confidenceSemantics: "context_only";
  executionAuthority: "operator_manual";
  liveExecution: "blocked";
  marketDataReliance: "external_feed" | "fallback_feed" | "degraded_feed";
};

export type TradingIntelligenceSurface = {
  availability: IntelligenceAvailability;
  marketContext: MarketContextIntelligence;
  executionContext: ExecutionContextIntelligence;
  operatorGuidance: OperatorGuidanceIntelligence;
  truth: IntelligenceTruthSurface;
};
