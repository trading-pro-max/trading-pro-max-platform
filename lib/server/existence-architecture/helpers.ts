import type {
  ExistenceBoundary,
  ExistenceEntity,
  ExistenceEntityType,
  ExistenceEvidence,
  ExistenceLifecycle,
  ExistenceNextFate,
  ExistenceOwnershipLayer,
  ExistencePurpose,
  ExistenceRisk,
  ExistenceVisibility,
} from "./types";

const safeBoundary: ExistenceBoundary = {
  publicExposureAllowed: false,
  founderOnly: false,
  readOnly: true,
  noExecution: true,
  noShell: true,
  noCodex: true,
  noPayments: true,
  noSecrets: true,
};

export function boundary(
  overrides: Partial<ExistenceBoundary> = {}
): ExistenceBoundary {
  return { ...safeBoundary, ...overrides };
}

export function purpose(
  summary: string,
  servesCurrentHeart: boolean,
  currentHeartReason: string
): ExistencePurpose {
  return { summary, servesCurrentHeart, currentHeartReason };
}

export function risk(
  level: ExistenceRisk["level"],
  summary: string,
  categories: string[] = []
): ExistenceRisk {
  return { level, categories, summary };
}

export function evidence(
  status: ExistenceEvidence["status"],
  tests: string[] = [],
  reports: string[] = [],
  visualProof: string[] = [],
  reason?: string
): ExistenceEvidence {
  return { status, tests, reports, visualProof, reason };
}

export function entity(input: {
  id: string;
  name: string;
  path: string;
  type: ExistenceEntityType;
  owner: ExistenceOwnershipLayer;
  purpose: ExistencePurpose;
  visibility: ExistenceVisibility;
  boundary?: ExistenceBoundary;
  risk?: ExistenceRisk;
  evidence?: ExistenceEvidence;
  lifecycle?: ExistenceLifecycle;
  nextFate?: ExistenceNextFate;
  requiresAhmad?: boolean;
  notes?: string[];
}): ExistenceEntity {
  return {
    boundary: boundary(),
    risk: risk("low", "No active unsafe capability identified."),
    evidence: evidence("documented_reason", [], [], [], "Classified by Permission-to-Exist snapshot."),
    lifecycle: "active_with_notes",
    nextFate: "keep",
    requiresAhmad: false,
    notes: [],
    ...input,
  };
}
