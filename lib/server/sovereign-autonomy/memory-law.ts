import "server-only";

import type {
  MemoryLesson,
  MemoryLessonType,
  ResultTribunalReport,
  SovereignEvent,
} from "./types";

function lesson(
  type: MemoryLessonType,
  title: string,
  summary: string,
  sourceEventId: string | null,
  createdAt: string
): MemoryLesson {
  return {
    lessonId: `lesson_${type}_${createdAt.replace(/\D/g, "").slice(0, 14)}`,
    type,
    title,
    summary,
    sourceEventId,
    createdAt,
    secretsStored: false,
    privateSensitiveDataStored: false,
  };
}

export function recordMemoryLessonFromEvent(
  event: SovereignEvent,
  checkedAt = new Date().toISOString()
): MemoryLesson {
  if (event.type === "logo_rejection_detected") {
    return lesson(
      "logo_rejection_history",
      "Logo rejection must route to Founder visual review",
      "Logo and identity changes require Visual Identity, Quality, and Founder approval.",
      event.eventId,
      checkedAt
    );
  }

  if (event.type === "chart_quality_low") {
    return lesson(
      "chart_annoyance_history",
      "Chart annoyance requires chart-first repair",
      "Chart feedback should produce screenshot-backed workstation tasks without changing execution truth.",
      event.eventId,
      checkedAt
    );
  }

  if (event.type === "billing_requested" || event.type === "live_execution_requested") {
    return lesson(
      "blocked_category",
      "Activation request remains blocked",
      "Real-world activation requests become blocked readiness records, not implementation tasks.",
      event.eventId,
      checkedAt
    );
  }

  return lesson(
    "future_rule",
    "Founder input becomes governed memory",
    "Store only safe summaries, never secrets, raw private sensitive data, fake users, fake revenue, or fake metrics.",
    event.eventId,
    checkedAt
  );
}

export function recordMemoryLessonFromTribunal(
  report: ResultTribunalReport,
  checkedAt = report.checkedAt
): MemoryLesson {
  if (report.decision === "accepted") {
    return lesson(
      "accepted_pattern",
      "Accepted task pattern",
      "Accepted work must still preserve Product Truth, validation evidence, and public/private separation.",
      null,
      checkedAt
    );
  }

  return lesson(
    "rejected_pattern",
    "Tribunal rejected or delayed work",
    `Result Tribunal decision ${report.decision} requires a narrower follow-up before acceptance.`,
    null,
    checkedAt
  );
}

export function getMemoryLawSamples(
  events: SovereignEvent[],
  reports: ResultTribunalReport[],
  checkedAt = new Date().toISOString()
) {
  const eventLessons = events.slice(0, 4).map((event) =>
    recordMemoryLessonFromEvent(event, checkedAt)
  );
  const tribunalLessons = reports.slice(0, 2).map((report) =>
    recordMemoryLessonFromTribunal(report, checkedAt)
  );

  return [
    ...eventLessons,
    ...tribunalLessons,
    lesson(
      "no_images_rule",
      "No raster/image generation preference",
      "Founder preference: do not generate images or use raster assets for this pass.",
      null,
      checkedAt
    ),
    lesson(
      "home_crowding_history",
      "Home crowding remains a visual memory risk",
      "Public Home should stay simple and must not expose internal operating language.",
      null,
      checkedAt
    ),
  ];
}
