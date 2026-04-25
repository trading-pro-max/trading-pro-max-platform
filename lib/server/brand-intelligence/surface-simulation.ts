import "server-only";

import { resolveBrandIdentity } from "./engine";
import type { BrandIntelligenceInput, IdentitySurfaceSimulation } from "./types";

const simulationInputs: BrandIntelligenceInput[] = [
  {
    surface: "public_entry",
    plan: "free",
    state: "paper_safe",
    audience: "public",
    theme: "dark",
  },
  {
    surface: "public_entry",
    plan: "free",
    state: "paper_safe",
    audience: "public",
    theme: "light",
  },
  {
    surface: "workstation",
    plan: "free",
    state: "paper_safe",
    audience: "authenticated_user",
    chartPriority: "high",
  },
  {
    surface: "settings",
    plan: "vip",
    state: "planned",
    audience: "authenticated_user",
  },
  {
    surface: "diagnostics",
    plan: "institutional",
    state: "future",
    audience: "authenticated_user",
  },
  {
    surface: "assistant",
    plan: "free",
    state: "fallback",
    audience: "authenticated_user",
  },
  {
    surface: "journal_coach",
    plan: "free",
    state: "paper_safe",
    audience: "authenticated_user",
  },
  {
    surface: "founder_command",
    plan: "founder",
    state: "ready",
    audience: "founder",
  },
  {
    surface: "mobile_future",
    plan: "institutional",
    state: "future",
    audience: "authenticated_user",
    reducedMotion: true,
  },
];

export function simulateBrandIdentitySurfaces(): IdentitySurfaceSimulation[] {
  return simulationInputs.map((input) => {
    const decision = resolveBrandIdentity(input);
    const risks: string[] = [];
    const safeAdjustments: string[] = [];
    const blockedItems: string[] = [];

    if (decision.input.chartPriority === "high" && decision.motionIntensity !== "low") {
      risks.push("chart distraction risk");
      safeAdjustments.push("force low motion and compact Earth Mark");
    }

    if (decision.input.publicLanguageRequired && decision.planVisualDNA.includes("internal only")) {
      blockedItems.push("internal identity on public surface");
    }

    if (decision.input.reducedMotion && decision.earthMarkAnimated) {
      blockedItems.push("animation under reduced motion");
    }

    if (decision.input.state === "planned" || decision.input.state === "future") {
      safeAdjustments.push("keep planned/future copy explicit");
    }

    return {
      surface: input.surface,
      decision,
      risks,
      safeAdjustments,
      blockedItems,
    };
  });
}

export function getBrandSurfaceSimulationSnapshot() {
  const simulations = simulateBrandIdentitySurfaces();

  return {
    mode: "identity_surface_simulation" as const,
    status: simulations.every((simulation) => simulation.blockedItems.length === 0)
      ? "ready"
      : "review_required",
    simulations,
    truth: {
      publicTerminologyChecked: true,
      chartMotionChecked: true,
      reducedMotionChecked: true,
      noFakeActivation: true,
    },
  };
}
