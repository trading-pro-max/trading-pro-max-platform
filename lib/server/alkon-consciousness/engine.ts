import { prepareAlkonActions } from "./action";
import { evolveAlkonRules } from "./evolve";
import { assignAlkonGravities } from "./gravity";
import { judgeAlkonResult } from "./judge";
import { decideAlkonLaws } from "./law";
import { interpretAlkonMeanings } from "./meaning";
import { getAlkonMemoryLessons } from "./remember";
import { routeAlkonSignals } from "./route";
import { senseAlkonSignals } from "./sense";
import type {
  AlkonConsciousnessReport,
  AlkonGravity,
  AlkonJudgmentInput,
  AlkonRawSignalInput,
} from "./types";

const DEFAULT_SAMPLE_INPUTS: AlkonRawSignalInput[] = [
  {
    inputId: "signal_chart_annoyance",
    text: "الشارت مزعج ويحتاج راحة أكثر",
    source: "founder",
    surface: "Trading Workspace",
  },
  {
    inputId: "signal_shell_duplication",
    text: "Trading Workspace showed duplicate topbars and public nav leaked into chart page",
    source: "founder",
    surface: "Shell / Navigation",
  },
  {
    inputId: "signal_no_images",
    text: "لا أريد صور ولا raster assets",
    source: "founder",
    surface: "Visual Identity",
  },
  {
    inputId: "signal_secret_risk",
    text: "secret risk in a task draft",
    source: "system",
    surface: "Secrets Authority",
  },
  {
    inputId: "signal_live_request",
    text: "enable live execution and real money now",
    source: "public_feedback",
    surface: "Trading Workspace",
  },
  {
    inputId: "signal_support_gap",
    text: "support path missing from public Earth",
    source: "system",
    surface: "Support",
  },
  {
    inputId: "signal_codex_result",
    text: "Codex result needs tribunal review",
    source: "codex",
    surface: "Codex Construction",
  },
];

function buildGravityDistribution(
  gravities: Array<{ priority: AlkonGravity }>
): Record<AlkonGravity, number> {
  return {
    P0_critical: gravities.filter((item) => item.priority === "P0_critical").length,
    P1_high: gravities.filter((item) => item.priority === "P1_high").length,
    P2_standard: gravities.filter((item) => item.priority === "P2_standard").length,
    P3_future: gravities.filter((item) => item.priority === "P3_future").length,
    blocked: gravities.filter((item) => item.priority === "blocked").length,
    black_hole: gravities.filter((item) => item.priority === "black_hole").length,
  };
}

function buildReports({
  laws,
  gravities,
  routes,
  actions,
}: {
  laws: ReturnType<typeof decideAlkonLaws>;
  gravities: ReturnType<typeof assignAlkonGravities>;
  routes: ReturnType<typeof routeAlkonSignals>;
  actions: ReturnType<typeof prepareAlkonActions>;
}): AlkonConsciousnessReport[] {
  return actions.map((action) => {
    const law = laws.find((item) => item.signalId === action.signalId);
    const gravity = gravities.find((item) => item.signalId === action.signalId);
    const route = routes.find((item) => item.signalId === action.signalId);

    if (!law || !gravity || !route) {
      throw new Error(`Missing consciousness report context for ${action.signalId}.`);
    }

    return {
      signalId: action.signalId,
      summary: `${route.ownerSystem} receives ${gravity.priority} with ${law.outcome}.`,
      law: law.outcome,
      gravity: gravity.priority,
      route: route.ownerSystem,
      action: action.actionType,
      nextSafeAction: action.nextSafeAction,
      founderDecisionNeeded: action.founderReviewNeeded,
    };
  });
}

export function runAlkonConsciousness(
  inputs: Array<string | AlkonRawSignalInput> = DEFAULT_SAMPLE_INPUTS,
  checkedAt = new Date().toISOString(),
  judgmentInput: AlkonJudgmentInput = {
    signalId: "signal_codex_result",
    visualProofRequired: true,
    visualProofProvided: true,
  }
) {
  const latestSignals = senseAlkonSignals(inputs, checkedAt);
  const meaningSummary = interpretAlkonMeanings(latestSignals);
  const lawDecisions = decideAlkonLaws(latestSignals, meaningSummary);
  const gravityDecisions = assignAlkonGravities(
    latestSignals,
    meaningSummary,
    lawDecisions
  );
  const activeRoutes = routeAlkonSignals(latestSignals);
  const preparedActions = prepareAlkonActions(
    latestSignals,
    lawDecisions,
    gravityDecisions,
    activeRoutes
  );
  const judgments = [judgeAlkonResult(judgmentInput)];
  const memoryLessons = getAlkonMemoryLessons();
  const evolutionRules = evolveAlkonRules(memoryLessons);
  const reports = buildReports({
    laws: lawDecisions,
    gravities: gravityDecisions,
    routes: activeRoutes,
    actions: preparedActions,
  });

  return {
    latestSignals,
    meaningSummary,
    lawDecisions,
    gravityDecisions,
    gravityDistribution: buildGravityDistribution(gravityDecisions),
    activeRoutes,
    preparedActions,
    judgments,
    memoryLessons,
    evolutionRules,
    reports,
  };
}

export function getAlkonConsciousnessSampleInputs() {
  return DEFAULT_SAMPLE_INPUTS;
}
