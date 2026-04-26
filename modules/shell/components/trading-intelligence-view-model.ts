import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type {
  ExecutionContextIntelligence,
  IntelligenceAvailability,
  IntelligenceBias,
  IntelligenceCautionCode,
  IntelligenceConfidenceBand,
  IntelligenceOperatorAction,
  MarketContextIntelligence,
  TradingIntelligenceSurface,
} from "../../intelligence/types";

export type IntelligenceTone = "approved" | "pending" | "restricted" | "blocked";

export type IntelligenceMetricView = {
  label: string;
  value: string;
  tone?: IntelligenceTone;
};

export type IntelligencePanelView = {
  title: string;
  badge: string;
  badgeTone: IntelligenceTone;
  headline: string;
  summary: string;
  metrics: IntelligenceMetricView[];
  note?: string;
  chips: string[];
};

export type TradingIntelligenceViewModel = {
  productLabel: string;
  commandKicker: string;
  stateLabel: string;
  stateValue: string;
  stateTone: IntelligenceTone;
  confidenceLabel: string;
  confidenceValue: string;
  confidenceTone: IntelligenceTone;
  marketPanel: IntelligencePanelView;
  executionPanel: IntelligencePanelView;
  guidancePanel: IntelligencePanelView;
  truthPanel: IntelligencePanelView;
  chartKicker: string;
  chartHeadline: string;
  chartSummary: string;
  chartNote: string;
  executionKicker: string;
  executionHeadline: string;
  executionSummary: string;
  executionNote: string;
};

function toneFromAvailability(availability: IntelligenceAvailability): IntelligenceTone {
  if (availability === "grounded") return "approved";
  if (availability === "bounded") return "pending";
  if (availability === "insufficient_data") return "restricted";
  return "blocked";
}

function toneFromConfidence(band: IntelligenceConfidenceBand): IntelligenceTone {
  if (band === "high") return "approved";
  if (band === "moderate") return "pending";
  if (band === "guarded") return "restricted";
  return "blocked";
}

function toneFromExecutionReadiness(
  readiness: ExecutionContextIntelligence["readiness"]
): IntelligenceTone {
  if (readiness === "ready") return "approved";
  if (readiness === "guarded") return "restricted";
  return "blocked";
}

function toneFromAction(action: IntelligenceOperatorAction): IntelligenceTone {
  if (action === "paper_trade_allowed") return "approved";
  if (action === "reduce_size") return "pending";
  if (action === "observe_only") return "restricted";
  return "blocked";
}

function availabilityLabel(availability: IntelligenceAvailability) {
  if (availability === "grounded") return "Grounded";
  if (availability === "bounded") return "Fallback-bound";
  if (availability === "insufficient_data") return "Insufficient data";
  return "Degraded";
}

function confidenceBandLabel(band: IntelligenceConfidenceBand) {
  if (band === "high") return "High";
  if (band === "moderate") return "Measured";
  if (band === "guarded") return "Guarded";
  return "Low";
}

function biasLabel(bias: IntelligenceBias) {
  if (bias === "constructive") return "Constructive";
  if (bias === "defensive") return "Defensive";
  return "Neutral";
}

function regimeLabel(regime: MarketContextIntelligence["regime"]) {
  if (regime === "trend") return "Trend";
  if (regime === "range") return "Range";
  return "Transition";
}

function momentumLabel(momentum: MarketContextIntelligence["momentum"]) {
  switch (momentum) {
    case "accelerating_up":
      return "Accelerating up";
    case "accelerating_down":
      return "Accelerating down";
    case "flat":
      return "Flat";
    default:
      return "Mixed";
  }
}

function volatilityLabel(volatility: MarketContextIntelligence["volatility"]) {
  switch (volatility) {
    case "compressed":
      return "Compressed";
    case "contained":
      return "Contained";
    case "elevated":
      return "Elevated";
    default:
      return "Expansive";
  }
}

function structureLabel(structure: MarketContextIntelligence["structure"]) {
  switch (structure) {
    case "continuation":
      return "Continuation";
    case "rotation":
      return "Rotation";
    case "balance":
      return "Balance";
    default:
      return "Breakout attempt";
  }
}

function executionReadinessLabel(
  readiness: ExecutionContextIntelligence["readiness"]
) {
  if (readiness === "ready") return "Paper-ready";
  if (readiness === "guarded") return "Guarded";
  return "Blocked";
}

function setupQualityLabel(
  setupQuality: ExecutionContextIntelligence["setupQuality"]
) {
  if (setupQuality === "aligned") return "Aligned";
  if (setupQuality === "mixed") return "Mixed";
  if (setupQuality === "weak") return "Weak";
  return "Blocked";
}

function sessionQualityLabel(
  sessionQuality: ExecutionContextIntelligence["sessionQuality"]
) {
  if (sessionQuality === "disciplined") return "Disciplined";
  if (sessionQuality === "guarded") return "Guarded";
  return "Locked";
}

function riskPostureLabel(
  riskPosture: ExecutionContextIntelligence["riskPosture"]
) {
  if (riskPosture === "normal") return "Normal";
  if (riskPosture === "reduced") return "Reduced";
  return "Blocked";
}

function actionLabel(action: IntelligenceOperatorAction) {
  if (action === "paper_trade_allowed") return "Paper allowed";
  if (action === "reduce_size") return "Reduce size";
  if (action === "observe_only") return "Observe only";
  return "Stand down";
}

function cautionLabel(code: IntelligenceCautionCode) {
  switch (code) {
    case "fallback_feed":
      return "Fallback feed";
    case "degraded_feed":
      return "Degraded feed";
    case "insufficient_market_structure":
      return "Insufficient structure";
    case "high_volatility":
      return "High volatility";
    case "range_bound":
      return "Range-bound";
    case "mixed_signal_alignment":
      return "Mixed alignment";
    case "session_guarded":
      return "Guarded session";
    case "session_locked":
      return "Session locked";
    case "capacity_reached":
      return "Capacity reached";
    case "paper_gate_closed":
      return "Paper gate closed";
    case "real_mode_blocked":
      return "Real mode blocked";
    case "manual_review_pending":
      return "Review pending";
  }
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function buildMarketSummary(marketContext: MarketContextIntelligence) {
  const basis = `${marketContext.symbol} ${marketContext.timeframe}`;

  if (marketContext.availability === "degraded") {
    return `${basis} context is degraded, so the read is limited to fallback-safe structure cues.`;
  }

  if (marketContext.availability === "insufficient_data") {
    return `${basis} does not yet have enough clean market structure for a strong contextual read.`;
  }

  if (marketContext.availability === "bounded") {
    return `${basis} context is derived from ${marketContext.feedLabel} and should be read as bounded interpretation, not prediction.`;
  }

  return `${basis} is reading as ${biasLabel(marketContext.bias).toLowerCase()} with ${structureLabel(
    marketContext.structure
  ).toLowerCase()} structure and ${volatilityLabel(
    marketContext.volatility
  ).toLowerCase()} volatility.`;
}

function buildExecutionSummary(
  intelligence: TradingIntelligenceSurface,
  dict: Dictionary
) {
  const executionContext = intelligence.executionContext;

  if (executionContext.readiness === "blocked") {
    if (executionContext.cautionCodes.includes("real_mode_blocked")) {
      return "The ticket remains visible for review, but real-money execution stays blocked.";
    }
    if (executionContext.cautionCodes.includes("session_locked")) {
      return "The session is locked, so no new paper entries should be opened.";
    }
    return "The paper route is currently gated by readiness or risk conditions.";
  }

  if (executionContext.readiness === "guarded") {
    return `Paper execution is still ${dict.common.paper.toLowerCase()}-only, but the current context should be handled with caution.`;
  }

  return "Paper execution is available inside the current local-safe guardrails.";
}

function buildGuidanceSummary(action: IntelligenceOperatorAction) {
  if (action === "paper_trade_allowed") {
    return "Use the paper ticket only if the operator still agrees with the current context and guardrails.";
  }
  if (action === "reduce_size") {
    return "The read is usable, but it should be treated as smaller-size or slower execution context.";
  }
  if (action === "observe_only") {
    return "Treat the layer as observation support until structure and setup quality improve.";
  }
  return "Stand down and preserve session discipline until the blocked condition is cleared.";
}

export function createTradingIntelligenceViewModel(
  dict: Dictionary,
  intelligence: TradingIntelligenceSurface
): TradingIntelligenceViewModel {
  const marketContext = intelligence.marketContext;
  const executionContext = intelligence.executionContext;
  const guidance = intelligence.operatorGuidance;
  const truth = intelligence.truth;

  const stateValue = availabilityLabel(intelligence.availability);
  const confidenceValue = `${confidenceBandLabel(
    marketContext.confidenceBand
  )} ${marketContext.confidenceScore}/100`;
  const cautionChips = guidance.cautionCodes
    .slice(0, 4)
    .map((code) => cautionLabel(code));
  const marketHeadline = `${biasLabel(marketContext.bias)} ${regimeLabel(
    marketContext.regime
  )} / ${volatilityLabel(marketContext.volatility)}`;
  const executionHeadline = `${executionReadinessLabel(
    executionContext.readiness
  )} / ${setupQualityLabel(executionContext.setupQuality)}`;
  const guidanceHeadline = `${actionLabel(guidance.primaryAction)} / ${sessionQualityLabel(
    executionContext.sessionQuality
  )}`;
  const truthHeadline =
    truth.marketDataReliance === "external_feed"
      ? "Context engine grounded in current feed state"
      : truth.marketDataReliance === "fallback_feed"
      ? "Context engine bounded by fallback market data"
      : "Context engine operating in degraded mode";

  return {
    productLabel: "Pro Max Assistant",
    commandKicker: "Assistant Context",
    stateLabel: "Assistant state",
    stateValue,
    stateTone: toneFromAvailability(intelligence.availability),
    confidenceLabel: "Context confidence",
    confidenceValue,
    confidenceTone: toneFromConfidence(marketContext.confidenceBand),
    marketPanel: {
      title: "Market context",
      badge: stateValue,
      badgeTone: toneFromAvailability(marketContext.availability),
      headline: marketHeadline,
      summary: buildMarketSummary(marketContext),
      metrics: [
        { label: "Regime", value: regimeLabel(marketContext.regime) },
        { label: "Momentum", value: momentumLabel(marketContext.momentum) },
        { label: "Volatility", value: volatilityLabel(marketContext.volatility) },
        { label: "Structure", value: structureLabel(marketContext.structure) },
      ],
      note:
        marketContext.availability === "grounded"
          ? `${marketContext.candleSampleSize} candles sampled from ${marketContext.feedLabel}.`
          : `Sampled from ${marketContext.feedLabel} with bounded confidence semantics.`,
      chips: [
        `${marketContext.symbol} ${marketContext.timeframe}`,
        `Move ${formatSignedPercent(marketContext.intervalMovePercent)}`,
        `Range ${marketContext.averageRangePercent.toFixed(2)}%`,
      ],
    },
    executionPanel: {
      title: "Execution context",
      badge: executionReadinessLabel(executionContext.readiness),
      badgeTone: toneFromExecutionReadiness(executionContext.readiness),
      headline: executionHeadline,
      summary: buildExecutionSummary(intelligence, dict),
      metrics: [
        {
          label: "Setup quality",
          value: setupQualityLabel(executionContext.setupQuality),
          tone:
            executionContext.setupQuality === "aligned"
              ? "approved"
              : executionContext.setupQuality === "mixed"
              ? "pending"
              : executionContext.setupQuality === "weak"
              ? "restricted"
              : "blocked",
        },
        {
          label: "Session quality",
          value: sessionQualityLabel(executionContext.sessionQuality),
          tone:
            executionContext.sessionQuality === "disciplined"
              ? "approved"
              : executionContext.sessionQuality === "guarded"
              ? "restricted"
              : "blocked",
        },
        {
          label: "Risk posture",
          value: riskPostureLabel(executionContext.riskPosture),
          tone:
            executionContext.riskPosture === "normal"
              ? "approved"
              : executionContext.riskPosture === "reduced"
              ? "pending"
              : "blocked",
        },
        {
          label: "Alignment",
          value: `${executionContext.alignmentScore}/100`,
          tone:
            executionContext.alignmentScore >= 72
              ? "approved"
              : executionContext.alignmentScore >= 52
              ? "pending"
              : "restricted",
        },
      ],
      note:
        truth.executionAuthority === "operator_manual"
          ? "Operator review remains the final authority for any paper entry."
          : undefined,
      chips: [
        actionLabel(executionContext.action),
        riskPostureLabel(executionContext.riskPosture),
        dict.common.paper,
      ],
    },
    guidancePanel: {
      title: "Operator guidance",
      badge: actionLabel(guidance.primaryAction),
      badgeTone: toneFromAction(guidance.primaryAction),
      headline: guidanceHeadline,
      summary: buildGuidanceSummary(guidance.primaryAction),
      metrics: [
        {
          label: "Primary action",
          value: actionLabel(guidance.primaryAction),
          tone: toneFromAction(guidance.primaryAction),
        },
        ...(guidance.secondaryAction
          ? [
              {
                label: "Secondary action",
                value: actionLabel(guidance.secondaryAction),
                tone: toneFromAction(guidance.secondaryAction),
              } satisfies IntelligenceMetricView,
            ]
          : []),
        {
          label: "Live authority",
          value: "Blocked",
          tone: "blocked" as const,
        },
      ],
      note:
        cautionChips.length > 0
          ? "The guidance surface reacts to current data quality, session posture, and execution truth."
          : "No active caution overrides are present right now.",
      chips: cautionChips.length > 0 ? cautionChips : ["Manual review", "Paper-only"],
    },
    truthPanel: {
      title: "Truth layer",
      badge: "Interpretive only",
      badgeTone: truth.state === "active" ? "approved" : truth.state === "limited" ? "pending" : "restricted",
      headline: truthHeadline,
      summary:
        "Confidence describes context quality and data trust, not guaranteed outcome or automated profit expectation.",
      metrics: [
        { label: "Predictive scope", value: "Interpretive only" },
        { label: "Execution authority", value: "Operator manual", tone: "restricted" },
        { label: "Live execution", value: "Blocked", tone: "blocked" },
        {
          label: "Feed reliance",
          value:
            truth.marketDataReliance === "external_feed"
              ? "External feed"
              : truth.marketDataReliance === "fallback_feed"
              ? "Fallback feed"
              : "Degraded feed",
          tone:
            truth.marketDataReliance === "external_feed"
              ? "approved"
              : truth.marketDataReliance === "fallback_feed"
              ? "pending"
              : "restricted",
        },
      ],
      note:
        "Pro Max Assistant never overrides blocked live routes, broker unavailability, or session guardrails.",
      chips: ["Operator manual", "Paper-only", "Live blocked"],
    },
    chartKicker: "Assistant Context",
    chartHeadline: marketHeadline,
    chartSummary: buildMarketSummary(marketContext),
    chartNote:
      marketContext.availability === "grounded"
        ? `${confidenceValue} on ${marketContext.candleSampleSize} sampled candles.`
        : `${stateValue}: confidence is bounded by ${marketContext.feedLabel}.`,
    executionKicker: "Assistant Guidance",
    executionHeadline: executionHeadline,
    executionSummary: buildExecutionSummary(intelligence, dict),
    executionNote: buildGuidanceSummary(guidance.primaryAction),
  };
}
