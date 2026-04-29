import "server-only";

import type { AlKawnDesktopReport } from "./types";

export function getAlKawnDesktopReportCenter(): AlKawnDesktopReport[] {
  return [
    {
      id: "latest_wake_report",
      title: "Latest WAKE REPORT",
      path: "Git history / latest pushed closure",
      status: "checked",
      summary: "Latest known chain confirms Al-Kawn Visual Map closed and pushed before desktop environment work.",
    },
    {
      id: "inventory_report",
      title: "Full project inventory",
      path: "reports/full-project-state-inventory.md",
      status: "checked",
      summary: "Immediate audit baseline exists.",
    },
    {
      id: "registry_report",
      title: "Canonical architecture registry",
      path: "reports/canonical-architecture-registry.md",
      status: "checked",
      summary: "Primary, compatibility, protected, cleanup, and Ahmad-decision classifications exist.",
    },
    {
      id: "cleanup_report",
      title: "Controlled canonical cleanup",
      path: "reports/controlled-canonical-cleanup.md",
      status: "checked",
      summary: "Cleanup closure preserved primary/protected systems.",
    },
    {
      id: "kernel_report",
      title: "Existing kernel canonicalization",
      path: "reports/existing-kernel-canonicalization-closure.md",
      status: "checked",
      summary: "Existing ALKON kernel is canonicalized through Universe Operating Kernel adapters.",
    },
    {
      id: "visual_map_report",
      title: "Al-Kawn Visual Map",
      path: "reports/al-kawn-visual-map-closure.md",
      status: "checked",
      summary: "Visual map closure created the founder-facing canonical map.",
    },
    {
      id: "product_truth_reports",
      title: "Product Truth reports",
      path: "reports/*product*truth* / project universe reports",
      status: "protected",
      summary: "Truth boundaries remain visible and protected.",
    },
    {
      id: "next_safe_action",
      title: "Next safe action",
      path: "reports/al-kawn-desktop-operating-environment.md",
      status: "pending",
      summary: "This report will define whether desktop shell finalization or control surfaces come next.",
    },
  ];
}
