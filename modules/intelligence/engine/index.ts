import type {
  AccountMode,
  AccountPolicySurface,
  Asset,
  Decision,
  ExecutionFoundationSurface,
  MarketCandle,
  MarketFeedSummary,
  RiskFoundationSurface,
} from "../../shell/types/platform-state";
import type {
  ExecutionContextIntelligence,
  IntelligenceAvailability,
  IntelligenceBias,
  IntelligenceCautionCode,
  IntelligenceConfidenceBand,
  IntelligenceMomentumState,
  IntelligenceOperatorAction,
  IntelligenceRegimeState,
  IntelligenceRiskPosture,
  IntelligenceSessionQuality,
  IntelligenceSetupQuality,
  IntelligenceStructureState,
  IntelligenceTruthSurface,
  IntelligenceVolatilityState,
  MarketContextIntelligence,
  OperatorGuidanceIntelligence,
  TradingIntelligenceSurface,
} from "../types";

export type TradingIntelligenceInput = {
  accountMode: AccountMode;
  accountPolicy: AccountPolicySurface;
  asset: Asset;
  timeframe: string;
  candles: MarketCandle[];
  marketFeed: MarketFeedSummary | null;
  decision: Decision;
  executionFoundation: ExecutionFoundationSurface;
  riskFoundation: RiskFoundationSurface;
  canExecute: boolean;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function uniqueCautions(cautions: IntelligenceCautionCode[]) {
  return [...new Set(cautions)];
}

function resolveAvailability(
  feed: MarketFeedSummary | null,
  candles: MarketCandle[]
): IntelligenceAvailability {
  if (candles.length < 6) return "insufficient_data";
  if (!feed) return "bounded";
  if (feed.state === "external_ready") return "grounded";
  if (feed.state === "fallback_ready" || feed.state === "simulated_live") {
    return "bounded";
  }
  if (
    feed.state === "degraded" ||
    feed.state === "unavailable" ||
    feed.state === "disconnected"
  ) {
    return "degraded";
  }
  return "bounded";
}

function resolveFeedProvenance(
  feed: MarketFeedSummary | null,
  availability: IntelligenceAvailability
): MarketContextIntelligence["feedProvenance"] {
  if (!feed) return availability === "degraded" ? "degraded" : "local";
  if (feed.state === "external_ready") return "external";
  if (feed.state === "degraded" || feed.state === "unavailable") {
    return "degraded";
  }
  if (feed.state === "disconnected") return "degraded";
  return "fallback";
}

function resolveVolatilityState(averageRangePercent: number): IntelligenceVolatilityState {
  if (averageRangePercent < 0.16) return "compressed";
  if (averageRangePercent < 0.45) return "contained";
  if (averageRangePercent < 1.1) return "elevated";
  return "expansive";
}

function resolveRegimeState(
  totalMovePercent: number,
  directionalDominance: number,
  averageRangePercent: number
): IntelligenceRegimeState {
  if (
    Math.abs(totalMovePercent) >= Math.max(averageRangePercent * 0.9, 0.2) &&
    directionalDominance >= 0.25
  ) {
    return "trend";
  }
  if (Math.abs(totalMovePercent) < 0.18 && averageRangePercent < 0.32) {
    return "range";
  }
  return "transition";
}

function resolveMomentumState(
  recentMovePercent: number,
  trendPercent: number
): IntelligenceMomentumState {
  if (recentMovePercent >= 0.08 && trendPercent > 0) return "accelerating_up";
  if (recentMovePercent <= -0.08 && trendPercent < 0) return "accelerating_down";
  if (Math.abs(recentMovePercent) < 0.04 && Math.abs(trendPercent) < 0.03) {
    return "flat";
  }
  return "mixed";
}

function resolveBias(
  momentum: IntelligenceMomentumState,
  totalMovePercent: number
): IntelligenceBias {
  if (momentum === "accelerating_up" || totalMovePercent >= 0.18) {
    return "constructive";
  }
  if (momentum === "accelerating_down" || totalMovePercent <= -0.18) {
    return "defensive";
  }
  return "neutral";
}

function resolveStructure(
  regime: IntelligenceRegimeState,
  momentum: IntelligenceMomentumState,
  recentMovePercent: number,
  averageRangePercent: number
): IntelligenceStructureState {
  if (regime === "range") return "balance";
  if (regime === "trend") {
    if (
      momentum === "accelerating_up" ||
      momentum === "accelerating_down" ||
      Math.abs(recentMovePercent) >= 0.06
    ) {
      return "continuation";
    }
    return "rotation";
  }
  if (averageRangePercent >= 0.85) return "breakout_attempt";
  return "rotation";
}

function resolveConfidenceBand(score: number): IntelligenceConfidenceBand {
  if (score >= 74) return "high";
  if (score >= 62) return "moderate";
  if (score >= 48) return "guarded";
  return "low";
}

function buildMarketContext(
  input: TradingIntelligenceInput,
  availability: IntelligenceAvailability
): MarketContextIntelligence {
  const candles = input.candles.slice(-12);
  const first = candles[0];
  const latest = candles[candles.length - 1];
  const previous = candles[candles.length - 2];

  if (!first || !latest || !previous) {
    return {
      availability,
      confidenceBand: availability === "degraded" ? "low" : "guarded",
      confidenceScore: availability === "degraded" ? 30 : 48,
      bias: "neutral",
      regime: "transition",
      momentum: "flat",
      volatility: "contained",
      structure: "rotation",
      feedProvenance: resolveFeedProvenance(input.marketFeed, availability),
      symbol: input.asset.symbol,
      timeframe: input.timeframe,
      feedLabel: input.marketFeed?.sourceLabel ?? input.asset.sourceLabel ?? "Local market state",
      candleSampleSize: candles.length,
      trendStrength: 0,
      intervalMovePercent: 0,
      averageRangePercent: 0,
      cautionCodes: uniqueCautions([
        ...(availability === "degraded" ? (["degraded_feed"] as const) : []),
        "insufficient_market_structure",
      ]),
    };
  }

  const closeMoves = candles.slice(1).map((candle, index) => {
    const reference = candles[index];
    return reference.close === 0
      ? 0
      : ((candle.close - reference.close) / reference.close) * 100;
  });
  const totalMovePercent =
    first.close === 0 ? 0 : ((latest.close - first.close) / first.close) * 100;
  const recentMovePercent =
    previous.close === 0 ? 0 : ((latest.close - previous.close) / previous.close) * 100;
  const averageRangePercent = average(
    candles.map((candle) =>
      candle.close === 0 ? 0 : ((candle.high - candle.low) / candle.close) * 100
    )
  );
  const fastAverage = average(candles.slice(-4).map((candle) => candle.close));
  const slowAverage = average(candles.map((candle) => candle.close));
  const trendPercent =
    slowAverage === 0 ? 0 : ((fastAverage - slowAverage) / slowAverage) * 100;
  const positiveMoves = closeMoves.filter((move) => move > 0).length;
  const negativeMoves = closeMoves.filter((move) => move < 0).length;
  const directionalDominance =
    closeMoves.length === 0
      ? 0
      : Math.abs(positiveMoves - negativeMoves) / closeMoves.length;

  const volatility = resolveVolatilityState(averageRangePercent);
  const regime = resolveRegimeState(
    totalMovePercent,
    directionalDominance,
    averageRangePercent
  );
  const momentum = resolveMomentumState(recentMovePercent, trendPercent);
  const bias = resolveBias(momentum, totalMovePercent);
  const structure = resolveStructure(
    regime,
    momentum,
    recentMovePercent,
    averageRangePercent
  );

  let confidenceScore = 52;

  confidenceScore += candles.length >= 10 ? 10 : candles.length >= 8 ? 5 : -8;
  confidenceScore +=
    availability === "grounded"
      ? 12
      : availability === "bounded"
      ? 4
      : availability === "degraded"
      ? -18
      : -10;

  if (regime === "trend") confidenceScore += 9;
  if (regime === "transition") confidenceScore -= 8;
  if (momentum === "mixed") confidenceScore -= 7;
  if (structure === "continuation" || structure === "balance") confidenceScore += 6;
  if (volatility === "expansive") confidenceScore -= 10;
  if (volatility === "compressed") confidenceScore -= 2;

  if (
    (input.decision.signal === "buy" && bias === "constructive") ||
    (input.decision.signal === "sell" && bias === "defensive")
  ) {
    confidenceScore += 6;
  } else if (
    input.decision.signal !== "wait" &&
    ((input.decision.signal === "buy" && bias === "defensive") ||
      (input.decision.signal === "sell" && bias === "constructive"))
  ) {
    confidenceScore -= 10;
  }

  const cautionCodes: IntelligenceCautionCode[] = [];

  if (availability === "bounded") cautionCodes.push("fallback_feed");
  if (availability === "degraded") cautionCodes.push("degraded_feed");
  if (availability === "insufficient_data") {
    cautionCodes.push("insufficient_market_structure");
  }
  if (volatility === "expansive") cautionCodes.push("high_volatility");
  if (regime === "range") cautionCodes.push("range_bound");
  if (input.decision.signal === "wait" || bias === "neutral") {
    cautionCodes.push("mixed_signal_alignment");
  }

  const confidenceScoreRounded = clamp(Math.round(confidenceScore), 24, 88);

  return {
    availability,
    confidenceBand: resolveConfidenceBand(confidenceScoreRounded),
    confidenceScore: confidenceScoreRounded,
    bias,
    regime,
    momentum,
    volatility,
    structure,
    feedProvenance: resolveFeedProvenance(input.marketFeed, availability),
    symbol: input.asset.symbol,
    timeframe: input.timeframe,
    feedLabel: input.marketFeed?.sourceLabel ?? input.asset.sourceLabel ?? "Local market state",
    candleSampleSize: candles.length,
    trendStrength: Number(trendPercent.toFixed(3)),
    intervalMovePercent: Number(totalMovePercent.toFixed(3)),
    averageRangePercent: Number(averageRangePercent.toFixed(3)),
    cautionCodes: uniqueCautions(cautionCodes),
  };
}

function resolveSetupQuality(
  input: TradingIntelligenceInput,
  marketContext: MarketContextIntelligence,
  alignmentScore: number
): IntelligenceSetupQuality {
  if (
    input.accountMode === "real" ||
    !input.canExecute ||
    input.riskFoundation.sessionState === "locked" ||
    input.riskFoundation.remainingTradeSlots === 0
  ) {
    return "blocked";
  }
  if (alignmentScore >= 72 && marketContext.confidenceBand !== "low") {
    return "aligned";
  }
  if (alignmentScore >= 52) return "mixed";
  return "weak";
}

function resolveRiskPosture(
  input: TradingIntelligenceInput,
  marketContext: MarketContextIntelligence
): IntelligenceRiskPosture {
  if (
    input.accountMode === "real" ||
    !input.canExecute ||
    input.riskFoundation.sessionState === "locked" ||
    input.riskFoundation.remainingTradeSlots === 0
  ) {
    return "blocked";
  }
  if (
    input.riskFoundation.riskMode === "guarded" ||
    marketContext.availability !== "grounded" ||
    marketContext.volatility === "elevated" ||
    marketContext.volatility === "expansive"
  ) {
    return "reduced";
  }
  return "normal";
}

function resolveSessionQuality(
  riskFoundation: RiskFoundationSurface
): IntelligenceSessionQuality {
  if (riskFoundation.sessionState === "locked") return "locked";
  if (riskFoundation.sessionState === "guarded") return "guarded";
  return "disciplined";
}

function resolveOperatorAction(
  input: TradingIntelligenceInput,
  marketContext: MarketContextIntelligence,
  executionContext: Pick<
    ExecutionContextIntelligence,
    "setupQuality" | "riskPosture" | "readiness"
  >
): IntelligenceOperatorAction {
  if (
    input.accountMode === "real" ||
    executionContext.readiness === "blocked" ||
    executionContext.setupQuality === "blocked"
  ) {
    return "stand_down";
  }
  if (
    input.decision.signal === "wait" ||
    executionContext.setupQuality === "weak"
  ) {
    return "observe_only";
  }
  if (
    executionContext.riskPosture === "reduced" ||
    marketContext.availability !== "grounded" ||
    executionContext.setupQuality === "mixed"
  ) {
    return "reduce_size";
  }
  return "paper_trade_allowed";
}

function buildExecutionContext(
  input: TradingIntelligenceInput,
  marketContext: MarketContextIntelligence
): ExecutionContextIntelligence {
  let alignmentScore = 44;

  if (
    (input.decision.signal === "buy" && marketContext.bias === "constructive") ||
    (input.decision.signal === "sell" && marketContext.bias === "defensive")
  ) {
    alignmentScore += 28;
  } else if (input.decision.signal === "wait" || marketContext.bias === "neutral") {
    alignmentScore += 8;
  } else {
    alignmentScore -= 12;
  }

  if (marketContext.regime === "trend") alignmentScore += 8;
  if (marketContext.structure === "continuation") alignmentScore += 8;
  if (marketContext.regime === "transition") alignmentScore -= 6;
  if (marketContext.volatility === "expansive") alignmentScore -= 12;
  if (marketContext.availability === "bounded") alignmentScore -= 6;
  if (marketContext.availability === "degraded") alignmentScore -= 18;
  if (marketContext.availability === "insufficient_data") alignmentScore -= 16;

  const normalizedAlignmentScore = clamp(Math.round(alignmentScore), 18, 92);
  const setupQuality = resolveSetupQuality(
    input,
    marketContext,
    normalizedAlignmentScore
  );
  const riskPosture = resolveRiskPosture(input, marketContext);
  const sessionQuality = resolveSessionQuality(input.riskFoundation);

  const readiness =
    input.accountMode === "real" ||
    !input.canExecute ||
    input.riskFoundation.sessionState === "locked" ||
    input.riskFoundation.remainingTradeSlots === 0
      ? "blocked"
      : marketContext.availability === "degraded" ||
        marketContext.availability === "insufficient_data" ||
        input.riskFoundation.sessionState === "guarded" ||
        setupQuality !== "aligned"
      ? "guarded"
      : "ready";

  const cautionCodes: IntelligenceCautionCode[] = [...marketContext.cautionCodes];

  if (input.accountMode === "real") cautionCodes.push("real_mode_blocked");
  if (!input.accountPolicy.activation.executionEnabled) {
    cautionCodes.push("paper_gate_closed");
  }
  if (input.accountPolicy.review.state !== "approved_for_paper") {
    cautionCodes.push("manual_review_pending");
  }
  if (input.riskFoundation.sessionState === "guarded") {
    cautionCodes.push("session_guarded");
  }
  if (input.riskFoundation.sessionState === "locked") {
    cautionCodes.push("session_locked");
  }
  if (input.riskFoundation.remainingTradeSlots === 0) {
    cautionCodes.push("capacity_reached");
  }

  const action = resolveOperatorAction(input, marketContext, {
    setupQuality,
    riskPosture,
    readiness,
  });

  return {
    availability: marketContext.availability,
    readiness,
    setupQuality,
    sessionQuality,
    riskPosture,
    action,
    alignmentScore: normalizedAlignmentScore,
    cautionCodes: uniqueCautions(cautionCodes),
  };
}

function buildOperatorGuidance(
  marketContext: MarketContextIntelligence,
  executionContext: ExecutionContextIntelligence
): OperatorGuidanceIntelligence {
  return {
    availability: marketContext.availability,
    primaryAction: executionContext.action,
    secondaryAction:
      executionContext.action === "paper_trade_allowed"
        ? undefined
        : executionContext.readiness === "guarded"
        ? "observe_only"
        : "stand_down",
    cautionCodes: uniqueCautions([
      ...marketContext.cautionCodes,
      ...executionContext.cautionCodes,
    ]),
  };
}

function buildTruthSurface(
  marketContext: MarketContextIntelligence
): IntelligenceTruthSurface {
  return {
    state:
      marketContext.availability === "grounded"
        ? "active"
        : marketContext.availability === "bounded"
        ? "limited"
        : "degraded",
    predictiveScope: "interpretive_only",
    confidenceSemantics: "context_only",
    executionAuthority: "operator_manual",
    liveExecution: "blocked",
    marketDataReliance:
      marketContext.availability === "grounded"
        ? "external_feed"
        : marketContext.availability === "bounded"
        ? "fallback_feed"
        : "degraded_feed",
  };
}

export function deriveTradingIntelligence(
  input: TradingIntelligenceInput
): TradingIntelligenceSurface {
  const availability = resolveAvailability(input.marketFeed, input.candles);
  const marketContext = buildMarketContext(input, availability);
  const executionContext = buildExecutionContext(input, marketContext);
  const operatorGuidance = buildOperatorGuidance(marketContext, executionContext);
  const truth = buildTruthSurface(marketContext);

  return {
    availability,
    marketContext,
    executionContext,
    operatorGuidance,
    truth,
  };
}
