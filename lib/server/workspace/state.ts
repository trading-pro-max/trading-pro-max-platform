import "server-only";
import { prisma } from "@/lib/db/client";
import type {
  DiagnosticsProbe,
  WorkspaceDepthState,
} from "@/modules/shell/types/platform-state";
import {
  DEFAULT_WORKSPACE_DEPTH_STATE,
  buildWorkspaceDepthMetadata,
  normalizeWorkspaceDepthState,
  parseWorkspaceDepthMetadata,
} from "./normalization";

const WORKSPACE_AUDIT_KIND = "workspace_depth_changed";
const WORKSPACE_AUDIT_SCOPE = "platform";

type WorkspaceDepthStateSource = "defaults" | "backend_audit";

export type WorkspaceDepthStateSnapshot = {
  workspaceDepth: WorkspaceDepthState;
  source: WorkspaceDepthStateSource;
  updatedAt: string | null;
};

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
  const metadata = buildWorkspaceDepthMetadata({
    workspaceDepth: nextWorkspaceDepth,
    updatedAt,
  });

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
