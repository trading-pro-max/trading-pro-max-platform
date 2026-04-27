import { getEarthTextureRegistryReadiness } from "./earth-texture-registry";

export function getPublicHybridEarthPolicy() {
  const registry = getEarthTextureRegistryReadiness();

  return {
    renderer: "Pro Max Hybrid Earth",
    publicVisualMode: registry.publicSummary.visualMode,
    textureActive: registry.publicSummary.textureActive,
    renderMode: registry.renderMode,
    fallbackActive: registry.renderMode === "procedural_fallback",
    noRemoteImageUrls: true,
    noBrokenImageWarningNeeded: true,
    workspaceChartFirst: true,
    publicCopy:
      registry.renderMode === "procedural_fallback"
        ? "Earth visual uses the premium local fallback."
        : "Earth visual uses an approved local texture layer.",
  } as const;
}

export function getFounderHybridEarthTextureReadiness() {
  const registry = getEarthTextureRegistryReadiness();

  return {
    status:
      registry.renderMode === "approved_texture"
        ? "approved_texture_active"
        : "procedural_fallback_active",
    activeTextureMode: registry.renderMode,
    approvedTextureCount: registry.activeTextureCount,
    approvedDisabledCount: registry.approvedDisabledCount,
    invalidMetadataCount: registry.invalidMetadataCount,
    missingMetadataCount: registry.missingMetadataCount,
    rejectedCount: registry.rejectedCount,
    activeTextureId: registry.activeTextureId,
    manifestPath: registry.manifestPath,
    entries: registry.entries,
    nextSafeAction:
      registry.renderMode === "approved_texture"
        ? "Keep approved texture metadata current and preserve procedural fallback."
        : "Add only a legally approved local Earth texture with complete metadata, checksum, and approval.",
    truth: {
      noRandomImages: true,
      noGeneratedImages: true,
      noUnknownLicenseTextures: true,
      noExternalHotlinkedImages: true,
      noTextureActiveByDefault: registry.activeTextureCount === 0,
      proceduralFallbackAvailable: true,
      publicGovernanceLeak: false,
    },
  };
}

