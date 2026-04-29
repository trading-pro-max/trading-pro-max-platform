import "server-only";
import type { RollbackExplanationRule } from "./types";

export function getRollbackExplanationRules(): RollbackExplanationRule[] {
  return [
    {
      id: "what_is_it",
      question: "What is it?",
      answerRequirement: "Name the entity, type, layer, and owner.",
    },
    {
      id: "why_exists",
      question: "Why does it exist?",
      answerRequirement: "State the reason for existence and Product Truth impact.",
    },
    {
      id: "layer_owner",
      question: "Which layer owns it?",
      answerRequirement: "Return parent layer, child layers, and owner layer.",
    },
    {
      id: "truth_source",
      question: "What truth source supports it?",
      answerRequirement: "Use an allowed truth source type and label unknown/pending honestly.",
    },
    {
      id: "protect_or_operate",
      question: "What does it protect or operate?",
      answerRequirement: "State privacy, legal, money, and security touch.",
    },
    {
      id: "execute_stop_block",
      question: "What can it execute, what stops it, and what blocks it?",
      answerRequirement: "Return the ontological execution verdict.",
    },
    {
      id: "evidence",
      question: "What evidence exists?",
      answerRequirement: "Return report and test evidence.",
    },
    {
      id: "return_origin",
      question: "How does it return to origin?",
      answerRequirement: "Explain the rollback path from ∞ to 0 and back to Ahmad.",
    },
  ];
}
