import "server-only";
import type {
  WorkspaceDepthState,
  WorkspaceFocusMode,
  WorkspaceShortcutLayer,
  WatchlistDensityMode,
} from "@/modules/shell/types/platform-state";

export const WORKSPACE_STATE_METADATA_SCHEMA = "tpm.workspace.state.v1";

export const DEFAULT_WORKSPACE_DEPTH_STATE: WorkspaceDepthState = {
  focusMode: "balanced",
  watchlistDensity: "standard",
  shortcutLayer: "layout_only",
};

type WorkspaceDepthMetadataPayload = {
  schema: typeof WORKSPACE_STATE_METADATA_SCHEMA;
  workspaceDepth: WorkspaceDepthState;
  updatedAt: string;
};

function isFocusMode(value: string): value is WorkspaceFocusMode {
  return value === "balanced" || value === "chart_focus" || value === "execution_focus";
}

function isWatchlistDensity(value: string): value is WatchlistDensityMode {
  return value === "standard" || value === "dense";
}

function isShortcutLayer(value: string): value is WorkspaceShortcutLayer {
  return value === "layout_only";
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeWorkspaceDepthState(
  value: unknown,
  fallback: WorkspaceDepthState = DEFAULT_WORKSPACE_DEPTH_STATE
): WorkspaceDepthState {
  const record = asRecord(value);
  if (!record) return fallback;

  const focusCandidate = normalizeString(record.focusMode || record.focus || record.mode);
  const densityCandidate = normalizeString(
    record.watchlistDensity || record.density || record.compactMode
  );
  const shortcutCandidate = normalizeString(
    record.shortcutLayer || record.shortcuts || record.hotkeys
  );

  return {
    focusMode: isFocusMode(focusCandidate) ? focusCandidate : fallback.focusMode,
    watchlistDensity: isWatchlistDensity(densityCandidate)
      ? densityCandidate
      : fallback.watchlistDensity,
    shortcutLayer: isShortcutLayer(shortcutCandidate)
      ? shortcutCandidate
      : fallback.shortcutLayer,
  };
}

export function parseWorkspaceDepthMetadata(
  metadataJson: string | null | undefined
): WorkspaceDepthMetadataPayload | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    const record = asRecord(parsed);
    if (!record) return null;

    const schema = normalizeString(record.schema);
    if (schema !== WORKSPACE_STATE_METADATA_SCHEMA) return null;
    const updatedAt = normalizeString(record.updatedAt);
    if (!updatedAt) return null;

    return {
      schema: WORKSPACE_STATE_METADATA_SCHEMA,
      workspaceDepth: normalizeWorkspaceDepthState(record.workspaceDepth),
      updatedAt,
    };
  } catch {
    return null;
  }
}

export function buildWorkspaceDepthMetadata(input: {
  workspaceDepth: WorkspaceDepthState;
  updatedAt: string;
}): WorkspaceDepthMetadataPayload {
  return {
    schema: WORKSPACE_STATE_METADATA_SCHEMA,
    workspaceDepth: normalizeWorkspaceDepthState(input.workspaceDepth),
    updatedAt: input.updatedAt,
  };
}
