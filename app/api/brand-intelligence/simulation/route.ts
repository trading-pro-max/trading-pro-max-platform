import { getBrandSurfaceSimulationSnapshot } from "@/lib/server/brand-intelligence";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = getBrandSurfaceSimulationSnapshot();

  return noStoreJson({
    ok: true,
    snapshot: {
      mode: snapshot.mode,
      status: snapshot.status,
      simulations: snapshot.simulations.map((simulation) => ({
        surface:
          simulation.surface === "founder_command" ||
          simulation.surface === "local_command"
            ? "restricted_surface"
            : simulation.surface,
        plan:
          simulation.decision.input.plan === "founder"
            ? "restricted_internal"
            : simulation.decision.input.plan,
        state: simulation.decision.input.state,
        audience:
          simulation.decision.input.audience === "founder" ||
          simulation.decision.input.audience === "internal"
            ? "internal"
            : simulation.decision.input.audience,
        chartPriority: simulation.decision.input.chartPriority,
        earthMarkVariant: simulation.decision.earthMarkVariant,
        earthMarkState: simulation.decision.earthMarkState,
        motionIntensity: simulation.decision.motionIntensity,
        identityIntensity: simulation.decision.identityIntensity,
        occasionSkin: simulation.decision.occasionSkin,
        publicSafe: simulation.decision.publicSafe,
        requiresFounderApproval: simulation.decision.requiresFounderApproval,
        requiresLegalReview: simulation.decision.requiresLegalReview,
        requiresGuardianReview: simulation.decision.requiresGuardianReview,
        risks: simulation.risks,
        safeAdjustments: simulation.safeAdjustments,
        blockedItems: simulation.blockedItems,
      })),
      truth: {
        ...snapshot.truth,
        publicSafeOutput: true,
        restrictedVocabularyRedacted: true,
      },
    },
  });
}
