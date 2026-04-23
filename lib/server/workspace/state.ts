import "server-only";
import { prisma } from "@/lib/db/client";
import type {
  DiagnosticsProbe,
  WorkspaceDepthState,
  WorkspaceFocusMode,
  WorkspaceShortcutLayer,
  WatchlistDensityMode,
} from "@/modules/shell/types/platform-state";

const WORKSPACE_STATE_METADATA_SCHEMA = "tpm.workspace.state.v1";
const WORKSPACE_AUDIT_KIND = "workspace_depth_changed";
const WORKSPACE_AUDIT_SCOPE = "platform";

const DEFAULT_WORKSPACE_DEPTH_STATE: WorkspaceDepthState = {
  focusMode: "balanced",
  watchlistDensity: "standard",
  shortcutLayer: "layout_only",
};

type WorkspaceDepthMetadataPayload = {
  schema: typeof WORKSPACE_STATE_METADATA_SCHEMA;
  workspaceDepth: WorkspaceDepthState;
  updatedAt: string;
};

type WorkspaceDepthStateSource = "defaults" | "backend_audit";

export type WorkspaceDepthStateSnapshot = {
  workspaceDepth: WorkspaceDepthState;
  source: WorkspaceDepthStateSource;
  updatedAt: string | null;
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
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function normalizeWorkspaceDepthState(
  value: unknown,
  fallback: WorkspaceDepthState = DEFAULT_WORKSPACE_DEPTH_STATE
): WorkspaceDepthState {
  const record = asRecord(value);

  if (!record) return fallback;

  const focusCandidate =
    typeof record.focusMode === "string"
      ? record.focusMode
      : typeof record.focus === "string"
      ? record.focus
      : null;
  const densityCandidate =
    typeof record.watchlistDensity === "string"
      ? record.watchlistDensity
      : typeof record.density === "string"
      ? record.density
      : null;
  const shortcutCandidate =
    typeof record.shortcutLayer === "string"
      ? record.shortcutLayer
      : typeof record.shortcuts === "string"
      ? record.shortcuts
      : null;

  return {
    focusMode:
      typeof focusCandidate === "string" && isFocusMode(focusCandidate)
        ? focusCandidate
        : fallback.focusMode,
    watchlistDensity:
      typeof densityCandidate === "string" && isWatchlistDensity(densityCandidate)
        ? densityCandidate
        : fallback.watchlistDensity,
    shortcutLayer:
      typeof shortcutCandidate === "string" && isShortcutLayer(shortcutCandidate)
        ? shortcutCandidate
        : fallback.shortcutLayer,
  };
}

function parseWorkspaceDepthMetadata(
  metadataJson: string | null | undefined
): WorkspaceDepthMetadataPayload | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    const record = asRecord(parsed);
    if (!record) return null;
    if (record.schema !== WORKSPACE_STATE_METADATA_SCHEMA) return null;
    if (typeof record.updatedAt !== "string") return null;

    return {
      schema: WORKSPACE_STATE_METADATA_SCHEMA,
      workspaceDepth: normalizeWorkspaceDepthState(record.workspaceDepth),
      updatedAt: record.updatedAt,
    };
  } catch {
    return null;
  }
}

async function getLatestWorkspaceDepthEvent(accountId: string) {
  return prisma.auditEvent.findFirst({
    where: {
      accountId,
      kind: WORKSPACE_AUDIT_KIND,
      scope: WORKSPACE_AUDIT_SCOPE,
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getWorkspaceDepthStateSnapshot(
  accountId: string
): Promise<WorkspaceDepthStateSnapshot> {
  const latestEvent = await getLatestWorkspaceDepthEvent(accountId);
  const metadata = parseWorkspaceDepthMetadata(latestEvent?.metadataJson);

  if (!metadata) {
    return {
      workspaceDepth: DEFAULT_WORKSPACE_DEPTH_STATE,
      source: "defaults",
      updatedAt: null,
    };
  }

  return {
    workspaceDepth: metadata.workspaceDepth,
    source: "backend_audit",
    updatedAt: metadata.updatedAt,
  };
}

export async function upsertWorkspaceDepthState(input: {
  userId: string;
  accountId: string;
  workspaceDepth: Partial<WorkspaceDepthState> | null | undefined;
}) {
  const existing = await getWorkspaceDepthStateSnapshot(input.accountId);
  const nextWorkspaceDepth = normalizeWorkspaceDepthState(
    input.workspaceDepth,
    existing.workspaceDepth
  );
  const updatedAt = new Date().toISOString();
  const metadata: WorkspaceDepthMetadataPayload = {
    schema: WORKSPACE_STATE_METADATA_SCHEMA,
    workspaceDepth: nextWorkspaceDepth,
    updatedAt,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.userId,
      accountId: input.accountId,
      kind: WORKSPACE_AUDIT_KIND,
      scope: WORKSPACE_AUDIT_SCOPE,
      actorRole: "owner",
      accountMode: "demo",
      message: "Workspace depth state synchronized to backend audit store.",
      metadataJson: JSON.stringify(metadata),
    },
  });

  return {
    workspaceDepth: nextWorkspaceDepth,
    updatedAt,
    source: "backend_audit" as const,
  };
}

export async function probeWorkspaceDepthPersistence(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const storedDepthSnapshots = await prisma.auditEvent.count({
      where: {
        kind: WORKSPACE_AUDIT_KIND,
        scope: WORKSPACE_AUDIT_SCOPE,
      },
    });

    return {
      key: "workspace_persistence",
      label: "Workspace persistence depth",
      status: "ready",
      summary: "Workspace depth persistence reachable",
      detail: `${storedDepthSnapshots} workspace depth snapshot event(s) available in backend audit storage.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "workspace_persistence",
      label: "Workspace persistence depth",
      status: "unavailable",
      summary: "Workspace depth persistence unavailable",
      detail:
        error instanceof Error
          ? error.message
          : "Workspace depth persistence probe failed.",
      checkedAt,
    };
  }
}
