import { boundary, entity, evidence, purpose, risk } from "./helpers";
import type { ExistenceEntity } from "./types";

export const OFFICIAL_ALKON_ROOT = "C:\\Users\\ahmad\\Desktop\\ALKON";
export const OFFICIAL_CODE_PATH =
  "C:\\Users\\ahmad\\Desktop\\ALKON\\Pro Max\\Pro Max Trading\\pro-max-trading-platform";

export function getDesktopExistenceEntities(): ExistenceEntity[] {
  return [
    entity({
      id: "desktop_alkon_root",
      name: "ALKON root",
      path: OFFICIAL_ALKON_ROOT,
      type: "desktop_folder",
      owner: "private_alkon_minus_zero",
      purpose: purpose(
        "Root container for Ahmad Source-to-Reality architecture.",
        true,
        "All Pro Max and Alkon reality returns to this root."
      ),
      visibility: "private_founder_only",
      evidence: evidence(
        "present",
        ["tests/regression/alkon-total-root-to-reality-rebirth.spec.ts"],
        ["reports/alkon-root-structure-status.md"],
        []
      ),
      lifecycle: "protected",
      nextFate: "protect",
    }),
    entity({
      id: "desktop_alkon_minus_zero",
      name: "Alkon -0 / Alkon 0 folder",
      path: `${OFFICIAL_ALKON_ROOT}\\Alkon 0`,
      type: "desktop_folder",
      owner: "private_alkon_minus_zero",
      purpose: purpose(
        "Private origin for Kernel, Operating Mode, Memory, Reports, Builder, Vault Placeholder, and Archive.",
        true,
        "Private origin governs what may enter public Pro Max."
      ),
      visibility: "private_founder_only",
      evidence: evidence(
        "present",
        ["tests/regression/alkon-total-root-to-reality-rebirth.spec.ts"],
        ["reports/alkon-root-structure-status.md"],
        []
      ),
      lifecycle: "protected",
      nextFate: "protect",
      notes: ["Actual desktop folder is Alkon 0; operational doctrine names it Alkon -0."],
    }),
    entity({
      id: "desktop_pro_max_world",
      name: "Pro Max",
      path: `${OFFICIAL_ALKON_ROOT}\\Pro Max`,
      type: "desktop_folder",
      owner: "public_pro_max",
      purpose: purpose(
        "Public world container for Pro Max Center and current/future Pro Max products.",
        true,
        "Pro Max Trading lives here as the first living product."
      ),
      visibility: "private_founder_only",
      evidence: evidence(
        "present",
        ["tests/regression/alkon-total-root-to-reality-rebirth.spec.ts"],
        ["reports/pro-max-world-status.md"],
        []
      ),
      lifecycle: "protected",
      nextFate: "protect",
    }),
    entity({
      id: "desktop_pro_max_trading_code",
      name: "Pro Max Trading codebase",
      path: OFFICIAL_CODE_PATH,
      type: "desktop_folder",
      owner: "public_pro_max",
      purpose: purpose(
        "Active official code path for Pro Max Trading and private Alkon systems.",
        true,
        "This is the active build surface for the first living product."
      ),
      visibility: "private_founder_only",
      evidence: evidence(
        "present",
        ["tests/regression/alkon-total-root-to-reality-rebirth.spec.ts"],
        ["reports/source-to-reality-ownership-map.md"],
        []
      ),
      lifecycle: "active",
      nextFate: "keep",
    }),
    entity({
      id: "desktop_assets",
      name: "Assets",
      path: `${OFFICIAL_ALKON_ROOT}\\Assets`,
      type: "desktop_folder",
      owner: "public_assets",
      purpose: purpose(
        "Candidate location for Earth, brand, and licensed texture assets.",
        false,
        "No raster assets are added to the active repo without license and Ahmad approval."
      ),
      visibility: "private_founder_only",
      evidence: evidence(
        "documented_reason",
        [],
        ["reports/alkon-desktop-existence-classification.md"],
        [],
        "Reported as asset candidate storage only."
      ),
      lifecycle: "readiness_only",
      nextFate: "protect",
    }),
    entity({
      id: "desktop_reports",
      name: "Root Reports",
      path: `${OFFICIAL_ALKON_ROOT}\\Reports`,
      type: "desktop_folder",
      owner: "docs_reports",
      purpose: purpose(
        "Root-level evidence memory for wake reports, full reports, and execution history.",
        true,
        "Evidence preserves continuity across code and desktop reality."
      ),
      visibility: "private_founder_only",
      evidence: evidence("documented_reason", [], ["reports/alkon-root-structure-status.md"], []),
      lifecycle: "active_with_notes",
      nextFate: "keep",
    }),
    entity({
      id: "desktop_inbox",
      name: "Inbox",
      path: `${OFFICIAL_ALKON_ROOT}\\Inbox`,
      type: "desktop_folder",
      owner: "inbox_needs_sorting",
      purpose: purpose(
        "Landing zone for unclassified files, ideas, screenshots, rejections, and instructions.",
        false,
        "Unclassified material must enter Jar before code execution."
      ),
      visibility: "private_founder_only",
      risk: risk("medium", "Unknown material may include sensitive or irrelevant files.", [
        "unknown",
        "sensitive review",
      ]),
      evidence: evidence("documented_reason", [], ["reports/alkon-desktop-cleanup-candidates.md"], []),
      lifecycle: "active_with_notes",
      nextFate: "needs_ahmad_decision",
      requiresAhmad: true,
    }),
    entity({
      id: "desktop_archive",
      name: "Archive",
      path: `${OFFICIAL_ALKON_ROOT}\\Archive`,
      type: "desktop_folder",
      owner: "archive_do_not_use",
      purpose: purpose(
        "Do-not-use archive zone; it is not active project truth.",
        false,
        "Archive confusion must never override the active codebase."
      ),
      visibility: "archive_only",
      boundary: boundary({ readOnly: true }),
      evidence: evidence("documented_reason", [], ["reports/alkon-desktop-cleanup-candidates.md"], []),
      lifecycle: "protected",
      nextFate: "protect",
      notes: ["No destructive moves or deletes are allowed without Ahmad."],
    }),
  ];
}

export function classifyDesktopPath(pathName: string): ExistenceEntity {
  const known = getDesktopExistenceEntities().find(
    (item) => item.path.toLowerCase() === pathName.toLowerCase()
  );

  if (known) return known;

  return entity({
    id: "desktop_unknown_needs_ahmad",
    name: "Unknown desktop item",
    path: pathName,
    type: "desktop_folder",
    owner: "unknown_needs_ahmad",
    purpose: purpose(
      "Unknown desktop item requires Ahmad classification before use.",
      false,
      "Unknown desktop items cannot enter active Pro Max work directly."
    ),
    visibility: "unknown",
    risk: risk("medium", "Unknown ownership and sensitivity.", ["unknown", "needs Ahmad"]),
    evidence: evidence("missing", [], ["reports/alkon-desktop-cleanup-candidates.md"], []),
    lifecycle: "cleanup_candidate",
    nextFate: "needs_ahmad_decision",
    requiresAhmad: true,
  });
}
