import type { AlkonMemoryLesson } from "./types";

export const ALKON_MEMORY_LESSONS: AlkonMemoryLesson[] = [
  {
    lessonId: "lesson_no_images_unless_explicit",
    title: "No images unless explicitly requested",
    rule: "Ahmad does not want generated images or raster assets unless he explicitly requests them.",
    appliesTo: ["visual identity", "public UI", "environment", "documentation"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_old_logos_rejected",
    title: "Rejected logo history",
    rule: "Old logos and public logo subtitles were rejected; logo work requires Founder visual acceptance.",
    appliesTo: ["logo", "brand", "public shell"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_chart_is_king",
    title: "Chart is king",
    rule: "Chart annoyance history means workspace work must keep the chart first, calm, and visually proven.",
    appliesTo: ["Trading Workspace", "chart", "terminal shell"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_duplicate_topbar",
    title: "One terminal shell",
    rule: "The workspace must not show duplicate topbars, logos, public navigation, or repeated controls.",
    appliesTo: ["Shell / Navigation", "Trading Workspace"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_free_complete",
    title: "Free must be complete",
    rule: "Free must feel complete and useful, not cheap; Pro and VIP differ by function and behavior, not only color.",
    appliesTo: ["Plan Realms", "Public Earth", "Assistant"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_alkon_private",
    title: "Alkon remains private",
    rule: "Alkon, Founder Command, Codex governance, Result Tribunal, and Product Memory internals must never appear in public UI.",
    appliesTo: ["Public Earth", "Diagnostics", "TPM Assistant", "Plans"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_no_fake_activation",
    title: "No fake activation",
    rule: "No fake users, revenue, metrics, plan activation, downloads, support backend, legal status, Sharia certification, or partnerships.",
    appliesTo: ["Plans", "Apps / Platforms", "Support", "Launch Readiness"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_home_not_overbuilt",
    title: "Home must guide",
    rule: "Home must guide users cleanly and avoid overbuilt, crowded, internal, or repetitive product truth panels.",
    appliesTo: ["Home", "Public Earth"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
  {
    lessonId: "lesson_secrets_never_exposed",
    title: "Secrets never exposed",
    rule: "Secrets Authority reports categories and readiness only; values are never exposed, copied, or sent to Codex.",
    appliesTo: ["Secrets Authority", "Security Sovereignty", "Codex Construction"],
    containsSecrets: false,
    containsPrivateSensitiveData: false,
  },
];

export function getAlkonMemoryLessons() {
  return ALKON_MEMORY_LESSONS;
}
