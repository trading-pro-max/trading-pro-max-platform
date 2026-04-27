export type EarthTextureManifestStatus =
  | "missing"
  | "approved"
  | "disabled"
  | "rejected";

export type EarthTextureType =
  | "day"
  | "night"
  | "clouds"
  | "elevation"
  | "composite";

export type EarthTextureManifestEntry = {
  id: string;
  file: string;
  type: EarthTextureType;
  status: EarthTextureManifestStatus;
  source: string;
  license: string;
  author: string;
  usageNotes: string;
  approvedBy: string;
  dateAdded: string;
  checksum: string;
  enabled: boolean;
};

export type EarthTextureReadinessStatus =
  | "missing"
  | "pending_review"
  | "approved_disabled"
  | "approved_enabled"
  | "rejected"
  | "invalid_metadata";

export type EarthTextureRenderMode =
  | "procedural_fallback"
  | "approved_texture";

export type EarthTextureReadinessEntry = {
  id: string;
  type: EarthTextureType | "unknown";
  status: EarthTextureReadinessStatus;
  enabled: boolean;
  filePublicPath: string | null;
  metadataComplete: boolean;
  localFileReference: boolean;
  safeToRender: boolean;
  reason: string;
};

export type ApprovedEarthTexture = {
  id: string;
  type: EarthTextureType;
  publicPath: string;
};

export type EarthTextureRegistryReadiness = {
  manifestPath: "/assets/textures/earth/earth-textures.manifest.json";
  renderMode: EarthTextureRenderMode;
  activeTexture: ApprovedEarthTexture | null;
  activeTextureId: string | null;
  activeTextureCount: number;
  approvedDisabledCount: number;
  invalidMetadataCount: number;
  missingMetadataCount: number;
  rejectedCount: number;
  totalEntries: number;
  entries: EarthTextureReadinessEntry[];
  fallbackReason: string;
  publicSummary: {
    visualMode: "procedural_fallback" | "approved_local_texture";
    textureActive: boolean;
    brokenImageRisk: false;
    remoteImageUrlsAllowed: false;
    publicWarningRequired: false;
  };
};

export type HybridEarthTextureMode =
  | "auto"
  | "proceduralOnly"
  | "approvedTexture";

