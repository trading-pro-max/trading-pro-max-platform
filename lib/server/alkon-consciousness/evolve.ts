import type { AlkonEvolutionRule, AlkonMemoryLesson } from "./types";

const EVOLUTION_BY_LESSON: Record<string, Omit<AlkonEvolutionRule, "sourceLessonId">> = {
  lesson_no_images_unless_explicit: {
    ruleId: "evolve_no_images_prompt_guard",
    evolutionRule: "Require a hard no-images prompt guard for future visual or environment tasks.",
    appliesTo: ["visual identity", "environment", "public UI"],
    futureGuard: "Block generated/raster assets unless Ahmad explicitly requests images.",
    requiredTest: "Source scan confirms no PNG/JPG/WebP/GIF/video or generated image artifacts.",
    founderApprovalNeeded: false,
  },
  lesson_old_logos_rejected: {
    ruleId: "evolve_logo_visual_review",
    evolutionRule: "Logo work requires a Founder visual review gate before closure.",
    appliesTo: ["logo", "brand"],
    futureGuard: "Do not claim logo accepted without Ahmad visual acceptance.",
    requiredTest: "Visual proof and public subtitle rejection check exist.",
    founderApprovalNeeded: true,
  },
  lesson_chart_is_king: {
    ruleId: "evolve_chart_screenshot_proof",
    evolutionRule: "Chart and workspace work requires screenshot proof when visual hierarchy changes.",
    appliesTo: ["Trading Workspace", "chart"],
    futureGuard: "Chart remains first; Assistant, Journal, and controls never cover the price action.",
    requiredTest: "Workspace screenshot proves chart-first layout and no public nav leak.",
    founderApprovalNeeded: true,
  },
  lesson_duplicate_topbar: {
    ruleId: "evolve_shell_boundary_regression",
    evolutionRule: "Shell boundary changes require regression guards against duplicate topbars and public nav leaks.",
    appliesTo: ["Shell / Navigation", "Trading Workspace"],
    futureGuard: "Public shell, workspace shell, and private shell cannot be nested accidentally.",
    requiredTest: "Workspace has exactly one terminal topbar and one compact brand mark.",
    founderApprovalNeeded: false,
  },
  lesson_alkon_private: {
    ruleId: "evolve_public_leak_test_required",
    evolutionRule: "Every private Alkon layer requires public leak-prevention tests.",
    appliesTo: ["Public Earth", "Diagnostics", "TPM Assistant"],
    futureGuard: "Public UI must not contain Alkon, Founder, Codex, tribunal, memory, or consciousness terms.",
    requiredTest: "Public Home and Diagnostics text do not match private forbidden terms.",
    founderApprovalNeeded: false,
  },
  lesson_home_not_overbuilt: {
    ruleId: "evolve_home_ia_gate",
    evolutionRule: "Home changes require an information architecture gate before adding more sections.",
    appliesTo: ["Home", "Public Earth"],
    futureGuard: "Home guides rather than overwhelms.",
    requiredTest: "Home keeps core navigation, product truth, and Assistant-first guidance compact.",
    founderApprovalNeeded: true,
  },
};

export function evolveAlkonRules(lessons: AlkonMemoryLesson[]): AlkonEvolutionRule[] {
  return lessons
    .map((lesson) => {
      const template = EVOLUTION_BY_LESSON[lesson.lessonId];

      if (!template) return null;

      return {
        sourceLessonId: lesson.lessonId,
        ...template,
      };
    })
    .filter((rule): rule is AlkonEvolutionRule => Boolean(rule));
}
