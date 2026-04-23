import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import type { LaunchReadinessGateSnapshot } from "./readiness";

const LAUNCH_CONTROL_SCHEMA = "tpm.launch.operations.control.v1";
const LAUNCH_CONTROL_KIND = "launch_ops_state_changed";
const LAUNCH_CONTROL_SCOPE = "platform";
const LAUNCH_CONTROL_MESSAGE = "Launch operations state synchronized.";

export type LaunchOperationsLifecycleStage =
  | "closed_beta_active"
  | "soft_launch_active"
  | "public_launch_gate_active";

export type LaunchOperationsLifecycleMode =
  | "closed_beta_activation"
  | "soft_launch_activation"
  | "public_launch_activation_gate";

type LaunchOpsControlAction =
  | "activate_closed_beta"
  | "activate_soft_launch"
  | "activate_public_launch_gate";

type LaunchOpsControlMetadata = {
  schema: typeof LAUNCH_CONTROL_SCHEMA;
  stage: LaunchOperationsLifecycleStage;
  closedBetaActivatedAt: string | null;
  softLaunchActivatedAt: string | null;
  publicLaunchGateActivatedAt: string | null;
  lastAction: LaunchOpsControlAction;
  note: string | null;
  updatedAt: string;
  updatedByUserId: string | null;
  updatedByAccountId: string | null;
};

export type LaunchOperationsControlStateSnapshot = {
  checkedAt: string;
  stage: LaunchOperationsLifecycleStage;
  mode: LaunchOperationsLifecycleMode;
  transitions: {
    closedBetaActivatedAt: string | null;
    softLaunchActivatedAt: string | null;
    publicLaunchGateActivatedAt: string | null;
  };
  operator: {
    lastAction: LaunchOpsControlAction;
    lastChangedAt: string;
    updatedByUserId: string | null;
    updatedByAccountId: string | null;
    note: string | null;
  };
};

export type ClosedBetaActivationResult = {
  ok: boolean;
  reason:
    | "closed_beta_activated"
    | "launch_readiness_gate_blocked";
  snapshot: LaunchOperationsControlStateSnapshot;
};

export type SoftLaunchActivationResult = {
  ok: boolean;
  reason:
    | "soft_launch_activated"
    | "launch_readiness_gate_blocked"
    | "closed_beta_activation_required"
    | "soft_launch_preparation_blocked";
  snapshot: LaunchOperationsControlStateSnapshot;
};

export type PublicLaunchGateActivationResult = {
  ok: boolean;
  reason:
    | "public_launch_gate_activated"
    | "launch_readiness_gate_blocked"
    | "soft_launch_activation_required"
    | "public_launch_checklist_blocked";
  snapshot: LaunchOperationsControlStateSnapshot;
};

function trimOptionalNote(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed.slice(0, 320) : null;
}

function mapStageToMode(stage: LaunchOperationsLifecycleStage): LaunchOperationsLifecycleMode {
  if (stage === "soft_launch_active") return "soft_launch_activation";
  if (stage === "public_launch_gate_active") return "public_launch_activation_gate";
  return "closed_beta_activation";
}

export function mapLaunchOperationsModeFromLifecycleStage(
  stage: LaunchOperationsLifecycleStage
) {
  return mapStageToMode(stage);
}

function getDefaultMetadata(checkedAt: string): LaunchOpsControlMetadata {
  return {
    schema: LAUNCH_CONTROL_SCHEMA,
    stage: "closed_beta_active",
    closedBetaActivatedAt: checkedAt,
    softLaunchActivatedAt: null,
    publicLaunchGateActivatedAt: null,
    lastAction: "activate_closed_beta",
    note: "Default guarded closed-beta activation baseline.",
    updatedAt: checkedAt,
    updatedByUserId: null,
    updatedByAccountId: null,
  };
}

function parseLaunchControlMetadata(
  metadataJson: string | null | undefined
): LaunchOpsControlMetadata | null {
  if (!metadataJson) return null;

  try {
    const parsed = JSON.parse(metadataJson) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;

    if (record.schema !== LAUNCH_CONTROL_SCHEMA) return null;
    const stage =
      typeof record.stage === "string" ? record.stage : "closed_beta_active";
    if (
      stage !== "closed_beta_active" &&
      stage !== "soft_launch_active" &&
      stage !== "public_launch_gate_active"
    ) {
      return null;
    }
    const lastAction =
      typeof record.lastAction === "string" ? record.lastAction : "activate_closed_beta";
    if (
      lastAction !== "activate_closed_beta" &&
      lastAction !== "activate_soft_launch" &&
      lastAction !== "activate_public_launch_gate"
    ) {
      return null;
    }

    return {
      schema: LAUNCH_CONTROL_SCHEMA,
      stage,
      closedBetaActivatedAt:
        typeof record.closedBetaActivatedAt === "string"
          ? record.closedBetaActivatedAt
          : null,
      softLaunchActivatedAt:
        typeof record.softLaunchActivatedAt === "string"
          ? record.softLaunchActivatedAt
          : null,
      publicLaunchGateActivatedAt:
        typeof record.publicLaunchGateActivatedAt === "string"
          ? record.publicLaunchGateActivatedAt
          : null,
      lastAction,
      note: typeof record.note === "string" ? trimOptionalNote(record.note) : null,
      updatedAt:
        typeof record.updatedAt === "string"
          ? record.updatedAt
          : new Date().toISOString(),
      updatedByUserId:
        typeof record.updatedByUserId === "string"
          ? record.updatedByUserId
          : null,
      updatedByAccountId:
        typeof record.updatedByAccountId === "string"
          ? record.updatedByAccountId
          : null,
    };
  } catch {
    return null;
  }
}

async function getLatestLaunchControlEvent(accountId?: string) {
  return prisma.auditEvent.findFirst({
    where: {
      kind: LAUNCH_CONTROL_KIND,
      scope: LAUNCH_CONTROL_SCOPE,
      message: LAUNCH_CONTROL_MESSAGE,
      ...(accountId ? { accountId } : {}),
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      metadataJson: true,
      createdAt: true,
    },
  });
}

function buildControlSnapshot(input: {
  checkedAt: string;
  metadata: LaunchOpsControlMetadata;
}): LaunchOperationsControlStateSnapshot {
  return {
    checkedAt: input.checkedAt,
    stage: input.metadata.stage,
    mode: mapStageToMode(input.metadata.stage),
    transitions: {
      closedBetaActivatedAt: input.metadata.closedBetaActivatedAt,
      softLaunchActivatedAt: input.metadata.softLaunchActivatedAt,
      publicLaunchGateActivatedAt: input.metadata.publicLaunchGateActivatedAt,
    },
    operator: {
      lastAction: input.metadata.lastAction,
      lastChangedAt: input.metadata.updatedAt,
      updatedByUserId: input.metadata.updatedByUserId,
      updatedByAccountId: input.metadata.updatedByAccountId,
      note: input.metadata.note,
    },
  };
}

async function getControlMetadata(input?: {
  checkedAt?: string;
  accountId?: string;
}) {
  const checkedAt = input?.checkedAt ?? new Date().toISOString();
  const latest = await getLatestLaunchControlEvent(input?.accountId);
  const parsed = parseLaunchControlMetadata(latest?.metadataJson);
  return parsed ?? getDefaultMetadata(checkedAt);
}

export async function getLaunchOperationsControlStateSnapshot(input?: {
  checkedAt?: string;
  accountId?: string;
}): Promise<LaunchOperationsControlStateSnapshot> {
  const checkedAt = input?.checkedAt ?? new Date().toISOString();
  const metadata = await getControlMetadata({
    checkedAt,
    accountId: input?.accountId,
  });

  return buildControlSnapshot({
    checkedAt,
    metadata,
  });
}

export async function activateClosedBetaForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  note?: string | null;
  checkedAt?: string;
}): Promise<ClosedBetaActivationResult> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const currentMetadata = await getControlMetadata({
    checkedAt,
    accountId: input.session.account.id,
  });

  if (input.gate.overall.status !== "pass") {
    return {
      ok: false,
      reason: "launch_readiness_gate_blocked",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  const nextMetadata: LaunchOpsControlMetadata = {
    schema: LAUNCH_CONTROL_SCHEMA,
    stage: "closed_beta_active",
    closedBetaActivatedAt: currentMetadata.closedBetaActivatedAt ?? checkedAt,
    softLaunchActivatedAt: currentMetadata.softLaunchActivatedAt,
    publicLaunchGateActivatedAt: currentMetadata.publicLaunchGateActivatedAt,
    lastAction: "activate_closed_beta",
    note: trimOptionalNote(input.note),
    updatedAt: checkedAt,
    updatedByUserId: input.session.user.id,
    updatedByAccountId: input.session.account.id,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_CONTROL_KIND,
      scope: LAUNCH_CONTROL_SCOPE,
      actorRole: "owner",
      accountMode: input.session.account.mode,
      message: LAUNCH_CONTROL_MESSAGE,
      metadataJson: JSON.stringify(nextMetadata),
    },
  });

  return {
    ok: true,
    reason: "closed_beta_activated",
    snapshot: buildControlSnapshot({
      checkedAt,
      metadata: nextMetadata,
    }),
  };
}

export async function activateSoftLaunchForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  softLaunchPrepared: boolean;
  note?: string | null;
  checkedAt?: string;
}): Promise<SoftLaunchActivationResult> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const currentMetadata = await getControlMetadata({
    checkedAt,
    accountId: input.session.account.id,
  });

  if (input.gate.overall.status !== "pass") {
    return {
      ok: false,
      reason: "launch_readiness_gate_blocked",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  if (
    currentMetadata.stage !== "closed_beta_active" &&
    currentMetadata.stage !== "soft_launch_active"
  ) {
    return {
      ok: false,
      reason: "closed_beta_activation_required",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  if (!input.softLaunchPrepared) {
    return {
      ok: false,
      reason: "soft_launch_preparation_blocked",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  const nextMetadata: LaunchOpsControlMetadata = {
    schema: LAUNCH_CONTROL_SCHEMA,
    stage: "soft_launch_active",
    closedBetaActivatedAt: currentMetadata.closedBetaActivatedAt ?? checkedAt,
    softLaunchActivatedAt: currentMetadata.softLaunchActivatedAt ?? checkedAt,
    publicLaunchGateActivatedAt: currentMetadata.publicLaunchGateActivatedAt,
    lastAction: "activate_soft_launch",
    note: trimOptionalNote(input.note),
    updatedAt: checkedAt,
    updatedByUserId: input.session.user.id,
    updatedByAccountId: input.session.account.id,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_CONTROL_KIND,
      scope: LAUNCH_CONTROL_SCOPE,
      actorRole: "owner",
      accountMode: input.session.account.mode,
      message: LAUNCH_CONTROL_MESSAGE,
      metadataJson: JSON.stringify(nextMetadata),
    },
  });

  return {
    ok: true,
    reason: "soft_launch_activated",
    snapshot: buildControlSnapshot({
      checkedAt,
      metadata: nextMetadata,
    }),
  };
}

export async function activatePublicLaunchGateForAuthenticatedSession(input: {
  session: AuthenticatedSession;
  gate: LaunchReadinessGateSnapshot;
  publicLaunchChecklistPassed: boolean;
  note?: string | null;
  checkedAt?: string;
}): Promise<PublicLaunchGateActivationResult> {
  const checkedAt = input.checkedAt ?? new Date().toISOString();
  const currentMetadata = await getControlMetadata({
    checkedAt,
    accountId: input.session.account.id,
  });

  if (input.gate.overall.status !== "pass") {
    return {
      ok: false,
      reason: "launch_readiness_gate_blocked",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  if (
    currentMetadata.stage !== "soft_launch_active" &&
    currentMetadata.stage !== "public_launch_gate_active"
  ) {
    return {
      ok: false,
      reason: "soft_launch_activation_required",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  if (!input.publicLaunchChecklistPassed) {
    return {
      ok: false,
      reason: "public_launch_checklist_blocked",
      snapshot: buildControlSnapshot({
        checkedAt,
        metadata: currentMetadata,
      }),
    };
  }

  const nextMetadata: LaunchOpsControlMetadata = {
    schema: LAUNCH_CONTROL_SCHEMA,
    stage: "public_launch_gate_active",
    closedBetaActivatedAt: currentMetadata.closedBetaActivatedAt ?? checkedAt,
    softLaunchActivatedAt: currentMetadata.softLaunchActivatedAt ?? checkedAt,
    publicLaunchGateActivatedAt:
      currentMetadata.publicLaunchGateActivatedAt ?? checkedAt,
    lastAction: "activate_public_launch_gate",
    note: trimOptionalNote(input.note),
    updatedAt: checkedAt,
    updatedByUserId: input.session.user.id,
    updatedByAccountId: input.session.account.id,
  };

  await prisma.auditEvent.create({
    data: {
      userId: input.session.user.id,
      accountId: input.session.account.id,
      kind: LAUNCH_CONTROL_KIND,
      scope: LAUNCH_CONTROL_SCOPE,
      actorRole: "owner",
      accountMode: input.session.account.mode,
      message: LAUNCH_CONTROL_MESSAGE,
      metadataJson: JSON.stringify(nextMetadata),
    },
  });

  return {
    ok: true,
    reason: "public_launch_gate_activated",
    snapshot: buildControlSnapshot({
      checkedAt,
      metadata: nextMetadata,
    }),
  };
}
