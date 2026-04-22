import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import {
  DEFAULT_PLATFORM_PREFERENCES,
  sanitizePlatformPreferenceSnapshot,
} from "@/lib/platform/preferences";
import type {
  DiagnosticsProbe,
  PlatformPreferenceSnapshot,
} from "@/modules/shell/types/platform-state";

function parseIndicators(value: string | null | undefined) {
  if (!value) return DEFAULT_PLATFORM_PREFERENCES.activeIndicators;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_PLATFORM_PREFERENCES.activeIndicators;

    const indicators = parsed.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );

    return indicators.length > 0
      ? indicators
      : DEFAULT_PLATFORM_PREFERENCES.activeIndicators;
  } catch {
    return DEFAULT_PLATFORM_PREFERENCES.activeIndicators;
  }
}

function toSnapshot(record: {
  chartType: string;
  activeIndicatorsJson: string;
  drawingTool: string;
  chartZoom: number;
  preferredTimeframe: string;
  preferredDuration: string;
  selectedAssetSymbol: string;
  watchlistVisible: boolean;
  ticketVisible: boolean;
  blotterExpanded: boolean;
}) {
  return sanitizePlatformPreferenceSnapshot({
    chartType: record.chartType as PlatformPreferenceSnapshot["chartType"],
    activeIndicators: parseIndicators(record.activeIndicatorsJson),
    activeDrawingTool: record.drawingTool,
    chartZoom: record.chartZoom,
    timeframe: record.preferredTimeframe,
    duration: record.preferredDuration,
    selectedAssetSymbol: record.selectedAssetSymbol,
    watchlistVisible: record.watchlistVisible,
    ticketVisible: record.ticketVisible,
    blotterExpanded: record.blotterExpanded,
  });
}

async function recordPreferenceAuditEvent(input: {
  userId: string;
  accountId: string;
  snapshot: PlatformPreferenceSnapshot;
}) {
  await prisma.auditEvent.create({
    data: {
      userId: input.userId,
      accountId: input.accountId,
      kind: "preferences_synced",
      scope: "platform",
      actorRole: "owner",
      accountMode: "demo",
      message: "Workspace preferences synchronized to backend.",
      metadataJson: JSON.stringify({
        chartType: input.snapshot.chartType,
        timeframe: input.snapshot.timeframe,
        duration: input.snapshot.duration,
        selectedAssetSymbol: input.snapshot.selectedAssetSymbol,
      }),
    },
  });
}

export async function getWorkspacePreferenceSnapshot(accountId: string) {
  const record = await prisma.workspacePreference.findUnique({
    where: { accountId },
  });

  return record ? toSnapshot(record) : null;
}

export async function getWorkspacePreferenceSnapshotForAuthenticatedSession(
  session: AuthenticatedSession
) {
  return getWorkspacePreferenceSnapshot(session.account.id);
}

export async function upsertWorkspacePreferenceSnapshot(input: {
  userId: string;
  accountId: string;
  preferences: Partial<PlatformPreferenceSnapshot> | null | undefined;
}) {
  const existing = await getWorkspacePreferenceSnapshot(input.accountId);
  const snapshot = sanitizePlatformPreferenceSnapshot(input.preferences, existing ?? undefined);
  const record = await prisma.workspacePreference.upsert({
    where: { accountId: input.accountId },
    create: {
      userId: input.userId,
      accountId: input.accountId,
      chartType: snapshot.chartType,
      activeIndicatorsJson: JSON.stringify(snapshot.activeIndicators),
      drawingTool: snapshot.activeDrawingTool,
      chartZoom: snapshot.chartZoom,
      preferredTimeframe: snapshot.timeframe,
      preferredDuration: snapshot.duration,
      selectedAssetSymbol: snapshot.selectedAssetSymbol,
      watchlistVisible: snapshot.watchlistVisible,
      ticketVisible: snapshot.ticketVisible,
      blotterExpanded: snapshot.blotterExpanded,
    },
    update: {
      chartType: snapshot.chartType,
      activeIndicatorsJson: JSON.stringify(snapshot.activeIndicators),
      drawingTool: snapshot.activeDrawingTool,
      chartZoom: snapshot.chartZoom,
      preferredTimeframe: snapshot.timeframe,
      preferredDuration: snapshot.duration,
      selectedAssetSymbol: snapshot.selectedAssetSymbol,
      watchlistVisible: snapshot.watchlistVisible,
      ticketVisible: snapshot.ticketVisible,
      blotterExpanded: snapshot.blotterExpanded,
    },
  });

  await recordPreferenceAuditEvent({
    userId: input.userId,
    accountId: input.accountId,
    snapshot,
  });

  return {
    preferences: toSnapshot(record),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function probeWorkspacePreferencePersistence(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  try {
    const storedProfiles = await prisma.workspacePreference.count();

    return {
      key: "preferences_persistence",
      label: "Preferences persistence",
      status: "ready",
      summary: "Backend preference store reachable",
      detail: `${storedProfiles} backend preference profile(s) available for workstation persistence.`,
      checkedAt,
    };
  } catch (error) {
    return {
      key: "preferences_persistence",
      label: "Preferences persistence",
      status: "unavailable",
      summary: "Backend preference store unavailable",
      detail:
        error instanceof Error
          ? error.message
          : "Workspace preferences could not be probed.",
      checkedAt,
    };
  }
}
