import manifest from "@/public/assets/textures/earth/earth-textures.manifest.json";
import type {
  ApprovedEarthTexture,
  EarthTextureManifestEntry,
  EarthTextureReadinessEntry,
  EarthTextureRegistryReadiness,
  EarthTextureType,
} from "./earth-texture-types";

const manifestPath = "/assets/textures/earth/earth-textures.manifest.json" as const;
const textureBasePath = "/assets/textures/earth/";
const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp", "avif"]);
const allowedTextureTypes = new Set<EarthTextureType>([
  "day",
  "night",
  "clouds",
  "elevation",
  "composite",
]);

type UnknownManifestEntry = Partial<Record<keyof EarthTextureManifestEntry, unknown>>;

function isRecord(value: unknown): value is UnknownManifestEntry {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: unknown) {
  return value === true;
}

function isRemoteOrUnsafeFileReference(file: string) {
  const normalized = file.trim();

  return (
    normalized.length === 0 ||
    /^([a-z]+:)?\/\//i.test(normalized) ||
    /^[a-z]:/i.test(normalized) ||
    normalized.startsWith("/") ||
    normalized.includes("\\") ||
    normalized.includes("/") ||
    normalized.includes("..") ||
    normalized.toLowerCase().includes("%2e")
  );
}

function hasAllowedExtension(file: string) {
  const extension = file.split(".").pop()?.toLowerCase() ?? "";

  return allowedExtensions.has(extension);
}

function publicPathFor(file: string) {
  if (isRemoteOrUnsafeFileReference(file) || !hasAllowedExtension(file)) {
    return null;
  }

  return `${textureBasePath}${file}`;
}

function metadataComplete(entry: UnknownManifestEntry) {
  return [
    entry.id,
    entry.file,
    entry.source,
    entry.license,
    entry.author,
    entry.usageNotes,
    entry.approvedBy,
    entry.dateAdded,
    entry.checksum,
  ].every((value) => asString(value).length > 0);
}

function normalizeType(type: unknown): EarthTextureType | "unknown" {
  const normalized = asString(type) as EarthTextureType;

  return allowedTextureTypes.has(normalized) ? normalized : "unknown";
}

function readinessForEntry(entry: unknown): EarthTextureReadinessEntry {
  if (!isRecord(entry)) {
    return {
      id: "invalid_manifest_entry",
      type: "unknown",
      status: "invalid_metadata",
      enabled: false,
      filePublicPath: null,
      metadataComplete: false,
      localFileReference: false,
      safeToRender: false,
      reason: "Manifest entry is not an object.",
    };
  }

  const id = asString(entry.id) || "unknown_texture";
  const file = asString(entry.file);
  const status = asString(entry.status);
  const type = normalizeType(entry.type);
  const enabled = asBoolean(entry.enabled);
  const complete = metadataComplete(entry);
  const filePublicPath = publicPathFor(file);
  const localFileReference = Boolean(filePublicPath);

  if (status === "rejected") {
    return {
      id,
      type,
      status: "rejected",
      enabled,
      filePublicPath: null,
      metadataComplete: complete,
      localFileReference,
      safeToRender: false,
      reason: "Texture is rejected.",
    };
  }

  if (status === "missing") {
    return {
      id,
      type,
      status: "missing",
      enabled,
      filePublicPath: null,
      metadataComplete: complete,
      localFileReference,
      safeToRender: false,
      reason: "No approved local texture file is present.",
    };
  }

  if (!complete || !localFileReference || type === "unknown") {
    return {
      id,
      type,
      status: "invalid_metadata",
      enabled,
      filePublicPath: null,
      metadataComplete: complete,
      localFileReference,
      safeToRender: false,
      reason:
        "Texture metadata, type, or local file reference is incomplete or unsafe.",
    };
  }

  if (status === "approved" && enabled) {
    return {
      id,
      type,
      status: "approved_enabled",
      enabled,
      filePublicPath,
      metadataComplete: true,
      localFileReference: true,
      safeToRender: true,
      reason: "Approved local texture is enabled.",
    };
  }

  if (status === "approved" || status === "disabled") {
    return {
      id,
      type,
      status: "approved_disabled",
      enabled,
      filePublicPath,
      metadataComplete: true,
      localFileReference: true,
      safeToRender: false,
      reason: "Texture is approved but disabled.",
    };
  }

  return {
    id,
    type,
    status: enabled ? "invalid_metadata" : "pending_review",
    enabled,
    filePublicPath: null,
    metadataComplete: complete,
    localFileReference,
    safeToRender: false,
    reason: enabled
      ? "Enabled textures must have approved status."
      : "Texture is waiting for review.",
  };
}

export function getEarthTextureReadinessFromManifest(
  entries: unknown = manifest
): EarthTextureRegistryReadiness {
  const manifestEntries = Array.isArray(entries) ? entries : [];
  const readinessEntries = manifestEntries.map(readinessForEntry);
  const activeEntry = readinessEntries.find((entry) => entry.safeToRender);
  const activeTexture: ApprovedEarthTexture | null =
    activeEntry?.filePublicPath && activeEntry.type !== "unknown"
      ? {
          id: activeEntry.id,
          type: activeEntry.type,
          publicPath: activeEntry.filePublicPath,
        }
      : null;
  const invalidMetadataCount = readinessEntries.filter(
    (entry) => entry.status === "invalid_metadata"
  ).length;
  const missingMetadataCount = readinessEntries.filter(
    (entry) => entry.status === "missing" || entry.status === "pending_review"
  ).length;

  return {
    manifestPath,
    renderMode: activeTexture ? "approved_texture" : "procedural_fallback",
    activeTexture,
    activeTextureId: activeTexture?.id ?? null,
    activeTextureCount: activeTexture ? 1 : 0,
    approvedDisabledCount: readinessEntries.filter(
      (entry) => entry.status === "approved_disabled"
    ).length,
    invalidMetadataCount,
    missingMetadataCount,
    rejectedCount: readinessEntries.filter((entry) => entry.status === "rejected")
      .length,
    totalEntries: readinessEntries.length,
    entries: readinessEntries,
    fallbackReason: activeTexture
      ? "Approved local texture is available."
      : "No approved enabled local texture exists; procedural fallback is active.",
    publicSummary: {
      visualMode: activeTexture ? "approved_local_texture" : "procedural_fallback",
      textureActive: Boolean(activeTexture),
      brokenImageRisk: false,
      remoteImageUrlsAllowed: false,
      publicWarningRequired: false,
    },
  };
}

export function getEarthTextureRegistryReadiness() {
  return getEarthTextureReadinessFromManifest(manifest);
}

export function getActiveApprovedEarthTexture() {
  return getEarthTextureRegistryReadiness().activeTexture;
}

export function isRemoteEarthTextureReferenceBlocked(file: string) {
  return isRemoteOrUnsafeFileReference(file) || !hasAllowedExtension(file);
}

