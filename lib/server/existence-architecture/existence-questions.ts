import type { ExistenceEntity, ExistenceQuestionAnswer, ExistenceReview } from "./types";
import { mapExistenceEntityToJar } from "./jar-map";
import { decideExistenceGate } from "./existence-gate";

export const EXISTENCE_QUESTIONS = [
  "Why does it exist?",
  "Who owns it?",
  "Is it public, private, invisible, tool, evidence, report, or asset?",
  "Does it serve the current heart?",
  "Does it create risk?",
  "Does it have evidence?",
  "Is it tested or does it have a documented reason?",
  "What is its lifecycle?",
  "What is its next fate?",
  "Does it require Ahmad?",
] as const;

export function answerExistenceQuestions(
  entity: ExistenceEntity
): ExistenceQuestionAnswer[] {
  return [
    {
      question: EXISTENCE_QUESTIONS[0],
      answer: entity.purpose.summary,
      answered: entity.purpose.summary.length > 0,
    },
    {
      question: EXISTENCE_QUESTIONS[1],
      answer: entity.owner,
      answered: entity.owner !== "unknown_needs_ahmad",
    },
    {
      question: EXISTENCE_QUESTIONS[2],
      answer: entity.visibility,
      answered: entity.visibility !== "unknown",
    },
    {
      question: EXISTENCE_QUESTIONS[3],
      answer: entity.purpose.currentHeartReason,
      answered: entity.purpose.currentHeartReason.length > 0,
    },
    {
      question: EXISTENCE_QUESTIONS[4],
      answer: `${entity.risk.level}: ${entity.risk.summary}`,
      answered: entity.risk.summary.length > 0,
    },
    {
      question: EXISTENCE_QUESTIONS[5],
      answer: entity.evidence.status,
      answered: entity.evidence.status !== "missing",
    },
    {
      question: EXISTENCE_QUESTIONS[6],
      answer:
        entity.evidence.tests.length > 0
          ? entity.evidence.tests.join(", ")
          : entity.evidence.reason ?? "",
      answered: entity.evidence.tests.length > 0 || Boolean(entity.evidence.reason),
    },
    {
      question: EXISTENCE_QUESTIONS[7],
      answer: entity.lifecycle,
      answered: entity.lifecycle !== "blocked",
    },
    {
      question: EXISTENCE_QUESTIONS[8],
      answer: entity.nextFate,
      answered: entity.nextFate !== "block" && entity.nextFate !== "black_hole",
    },
    {
      question: EXISTENCE_QUESTIONS[9],
      answer: entity.requiresAhmad ? "requires Ahmad" : "does not require Ahmad for read-only existence",
      answered: true,
    },
  ];
}

export function reviewExistenceEntity(entity: ExistenceEntity): ExistenceReview {
  const answers = answerExistenceQuestions(entity);
  const missingAnswers = answers
    .filter((answer) => !answer.answered)
    .map((answer) => answer.question);
  const jarId = mapExistenceEntityToJar(entity, missingAnswers);
  const gate = decideExistenceGate(entity, missingAnswers, jarId);

  return {
    entityId: entity.id,
    answers,
    missingAnswers,
    decision: gate.decision,
    jarId,
    reason: gate.reasons[0] ?? "Entity has enough structure to remain classified.",
  };
}
