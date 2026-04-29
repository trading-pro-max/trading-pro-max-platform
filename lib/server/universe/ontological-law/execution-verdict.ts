import "server-only";
import type {
  ExecutionVerdictRule,
  OntologicalActionInput,
  OntologicalExecutionVerdict,
} from "./types";

export function getOntologicalExecutionVerdictRules(): ExecutionVerdictRule[] {
  return [
    {
      verdict: "execute_inside_al_kawn",
      meaning: "Safe internal work may execute directly inside الكون.",
      triggeredBy: ["audit", "report", "roadmap", "safe task", "Product Truth check"],
      enforcement: "Run internally, leave evidence, preserve Product Truth.",
    },
    {
      verdict: "stop_for_legal_ahmad",
      meaning: "Legal, official, regulatory, contract, trademark, ownership, or advice matters stop for Ahmad.",
      triggeredBy: ["FINMA", "license", "regulated", "trademark", "contract", "legal approval"],
      enforcement: "Stop and require Ahmad/legal review.",
    },
    {
      verdict: "stop_for_money_ahmad",
      meaning: "Money, billing, payments, bank, broker, customer funds, and real trading stop for Ahmad.",
      triggeredBy: ["payment", "billing", "receiving money", "broker", "real-money trading"],
      enforcement: "Stop and require Ahmad approval.",
    },
    {
      verdict: "block_product_truth_violation",
      meaning: "Claims contradicting Product Truth are blocked immediately.",
      triggeredBy: ["public الكون", "public ALKON", "billing active", "real money enabled", "broker active"],
      enforcement: "Block, explain Product Truth conflict, and leave trace.",
    },
    {
      verdict: "block_secret_or_public_exposure",
      meaning: "Secrets or private systems moving outward are blocked immediately.",
      triggeredBy: ["secrets in Git", "API keys in code", "private documents in public assets"],
      enforcement: "Block, protect the asset, and require Ahmad approval for any external handling.",
    },
    {
      verdict: "needs_more_evidence",
      meaning: "Unknown or unverified claims require evidence before execution.",
      triggeredBy: ["unknown source", "missing report", "missing test", "future gate"],
      enforcement: "Return pending state and request evidence.",
    },
  ];
}

export function getOntologicalExecutionVerdict(
  action: OntologicalActionInput | string = "safe internal audit"
): OntologicalExecutionVerdict {
  const input =
    typeof action === "string"
      ? { label: action }
      : action;
  const label = input.label.toLowerCase();

  if (input.exposesSecretsOrPrivateSystems || /secret|api key|private document|public الكون|public alkon/.test(label)) {
    return "block_secret_or_public_exposure";
  }

  if (input.violatesProductTruth || /billing active|real money enabled|broker active|public launch active|product truth disabled/.test(label)) {
    return "block_product_truth_violation";
  }

  if (input.touchesLegal || /finma|legal|license|regulated|trademark|contract|investment advice|ownership/.test(label)) {
    return "stop_for_legal_ahmad";
  }

  if (input.touchesMoney || /payment|money|billing|subscription|payout|bank|broker|real order|real trading/.test(label)) {
    return "stop_for_money_ahmad";
  }

  if (input.hasEvidence === false || /unknown|unverified|future/.test(label)) {
    return "needs_more_evidence";
  }

  return "execute_inside_al_kawn";
}
