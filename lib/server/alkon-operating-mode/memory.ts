import type { OperatingMemoryLesson } from "./types";

export const ALKON_OPERATING_MEMORY_LESSONS: OperatingMemoryLesson[] = [
  {
    lessonId: "zero_truth_not_blank_code",
    lesson: "Alkon starts from Zero Truth, not blank code.",
    futureGuard: "Read the current repository, reports, tests, and product state before action.",
    requiredTest: "Operating Mode does not delete or reset the project.",
  },
  {
    lessonId: "no_reset_without_ahmad",
    lesson: "No deletion or rebuild-from-scratch without explicit Ahmad approval.",
    futureGuard: "Treat reset, deletion, and blank rebuild as sensitive actions.",
    requiredTest: "Zero Truth audit declares deletesProject, resetsCodebase, and rebuildsFromBlank false.",
  },
  {
    lessonId: "public_private_ownership",
    lesson: "Pro Max Public Reality is for the world; Alkon Private Universe is for Ahmad.",
    futureGuard: "Public surfaces use Pro Max language only.",
    requiredTest: "Public UI does not expose private operating terms.",
  },
  {
    lessonId: "invisible_layer_bridge",
    lesson: "Invisible Operating Layer bridges public trust and private command without leakage.",
    futureGuard: "Translate private readiness into public-safe labels.",
    requiredTest: "Diagnostics remains public-safe.",
  },
  {
    lessonId: "chart_is_king",
    lesson: "Chart is king.",
    futureGuard: "Keep Trading Workspace hierarchy chart first.",
    requiredTest: "Workspace proof keeps chart dominant.",
  },
  {
    lessonId: "assistant_language_layer",
    lesson: "Assistant is the user comfort and language layer.",
    futureGuard: "Assistant explains, never signals profit or executes trades.",
    requiredTest: "Assistant stays non-executing and public-safe.",
  },
  {
    lessonId: "product_truth_law",
    lesson: "Product Truth is law.",
    futureGuard: "Block fake claims and unsafe activation before any other work.",
    requiredTest: "Product Truth gates block live, money, billing, broker/feed, and launch.",
  },
  {
    lessonId: "no_images_unless_requested",
    lesson: "No images unless explicitly requested.",
    futureGuard: "Use code, SVG, CSS, or approved local licensed assets only.",
    requiredTest: "No raster assets are introduced by Operating Mode.",
  },
  {
    lessonId: "hybrid_earth_license_first",
    lesson: "Hybrid Earth texture requires license and approval.",
    futureGuard: "Texture remains disabled without local approved metadata.",
    requiredTest: "No unapproved texture activation.",
  },
  {
    lessonId: "header_orientation_only",
    lesson: "Header is orientation only.",
    futureGuard: "Keep language, theme, environment, and status clusters out of the public header.",
    requiredTest: "Header regression preserves compact public navigation.",
  },
  {
    lessonId: "no_public_alkon",
    lesson: "No public Alkon.",
    futureGuard: "Private operating language stays Founder-only.",
    requiredTest: "Public leak prevention checks forbidden internal terms.",
  },
  {
    lessonId: "no_fake_claims",
    lesson: "No fake claims.",
    futureGuard: "Do not claim #1, global, regulated, certified, launched, paid, live, or profitable status without proof.",
    requiredTest: "Claims firewall remains active in Product Truth.",
  },
  {
    lessonId: "local_day_one_human_gate",
    lesson: "No Local Day One without Ahmad visual acceptance.",
    futureGuard: "Operating Mode can activate with notes, but Local Day One waits for human visual approval.",
    requiredTest: "Visual acceptance pending blocks Local Day One start.",
  },
];

export function getAlkonOperatingMemoryLessons() {
  return ALKON_OPERATING_MEMORY_LESSONS;
}
