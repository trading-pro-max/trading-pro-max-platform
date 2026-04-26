import type {
  EvaluationTargetType,
  NumberOneEvaluationTarget,
  NumberOneMemoryLesson,
} from "./types";

export const NUMBER_ONE_MEMORY_LESSONS: NumberOneMemoryLesson[] = [
  {
    lessonId: "number_one_internal_not_public",
    lesson: "#1 is an internal standard, not a public claim.",
    appliesTo: ["public_copy", "media_message", "launch_step"],
    futureGuard: "Run public claim firewall on public wording.",
    requiredTest: "public UI has no #1/best/global/regulated claims",
  },
  {
    lessonId: "chart_is_king",
    lesson: "Chart is king.",
    appliesTo: ["workspace", "component", "feature"],
    futureGuard: "Any workspace change must prove chart dominance.",
    requiredTest: "workspace chart-first screenshot proof",
  },
  {
    lessonId: "assistant_intent_interface",
    lesson: "Assistant is the intent interface.",
    appliesTo: ["assistant_behavior", "feature"],
    futureGuard: "Secondary actions should route through safe assistant intent.",
    requiredTest: "assistant intent and blocked-intent regression",
  },
  {
    lessonId: "earth_product_reality",
    lesson: "Earth is product reality.",
    appliesTo: ["page", "visual_identity", "public_copy"],
    futureGuard: "Public surfaces must be calm, clear, and Earth-native.",
    requiredTest: "public Home proof",
  },
  {
    lessonId: "alkon_private",
    lesson: "Alkon is private.",
    appliesTo: ["future_world", "codex_task", "legal_gate"],
    futureGuard: "Never expose internal governance to public users.",
    requiredTest: "public no-leak regression",
  },
  {
    lessonId: "no_fake_claims",
    lesson: "No fake claims.",
    appliesTo: ["public_copy", "media_message", "launch_step"],
    futureGuard: "Block fake activation, app availability, users, revenue, legal status, and certification.",
    requiredTest: "Product Truth and claim firewall regression",
  },
  {
    lessonId: "no_images_unless_explicit",
    lesson: "No images unless explicit.",
    appliesTo: ["visual_identity", "component", "page"],
    futureGuard: "Keep implementation code/SVG/CSS-only unless Ahmad explicitly asks for images.",
    requiredTest: "no raster asset scan",
  },
  {
    lessonId: "no_future_world_before_prime_world",
    lesson: "No future world before Prime World closure.",
    appliesTo: ["future_world", "idea"],
    futureGuard: "World Seeds stay private readiness until Station 1 closure.",
    requiredTest: "worldline protection regression",
  },
  {
    lessonId: "no_billing_live_broker_before_gates",
    lesson: "No billing, live execution, broker/feed, or real money before gates.",
    appliesTo: ["treasury_action", "launch_step", "feature"],
    futureGuard: "Route dangerous activation to blocked/black-hole decisions.",
    requiredTest: "Product Truth blocked activation regression",
  },
  {
    lessonId: "no_task_without_proof",
    lesson: "No task without proof.",
    appliesTo: ["codex_task", "cleanup_candidate", "feature"],
    futureGuard: "Require functional proof, tests, and memory before closure.",
    requiredTest: "absolute completion regression",
  },
];

export function selectNumberOneMemoryLesson(
  target: NumberOneEvaluationTarget
): NumberOneMemoryLesson {
  const match = NUMBER_ONE_MEMORY_LESSONS.find((lesson) =>
    lesson.appliesTo.includes(target.type as EvaluationTargetType)
  );

  return match ?? NUMBER_ONE_MEMORY_LESSONS[0];
}
