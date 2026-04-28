import { getEarthTextureRegistryReadiness } from "@/lib/brand/earth-texture-registry";
import type { LivingEarthAssetStatus } from "./types";

export function getLivingEarthAssetPolicy(): {
  assetStatus: LivingEarthAssetStatus;
  activeTextureId: string | null;
  approvedDisabledCount: number;
  invalidMetadataCount: number;
  missingMetadataCount: number;
  textureActive: boolean;
  renderMode: "procedural_fallback" | "approved_texture";
  publicCopy: string;
  privateCopy: string;
} {
  const registry = getEarthTextureRegistryReadiness();
  const textureActive = Boolean(registry.activeTexture);
  const assetStatus: LivingEarthAssetStatus = textureActive
    ? "approved_texture_active"
    : registry.approvedDisabledCount > 0
      ? "approved_texture_ready"
      : "procedural_fallback_active";

  return {
    assetStatus,
    activeTextureId: registry.activeTextureId,
    approvedDisabledCount: registry.approvedDisabledCount,
    invalidMetadataCount: registry.invalidMetadataCount,
    missingMetadataCount: registry.missingMetadataCount,
    textureActive,
    renderMode: registry.renderMode,
    publicCopy: textureActive
      ? "Living Earth uses an approved local texture layer."
      : "Living Earth uses the code-driven procedural fallback.",
    privateCopy: textureActive
      ? "Approved local texture is active; keep manifest metadata current."
      : "No approved active local texture exists; true photorealism remains texture-gated.",
  };
}
