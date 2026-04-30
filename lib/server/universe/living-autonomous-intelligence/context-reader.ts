import "server-only";

import type { ContextSource } from "./types";

export function getAlKawnContextReader(): ContextSource[] {
  return [
    {
      id: "reports",
      label: "reports",
      sourceType: "report",
      status: "available",
      path: "reports/",
    },
    {
      id: "docs",
      label: "docs",
      sourceType: "doc",
      status: "available",
      path: "docs/product/",
    },
    {
      id: "tests",
      label: "tests",
      sourceType: "test",
      status: "available",
      path: "tests/regression/",
    },
    {
      id: "registries",
      label: "registry",
      sourceType: "registry",
      status: "ready",
      path: "lib/server/universe/",
    },
    {
      id: "control_surfaces",
      label: "control surfaces",
      sourceType: "control_surface",
      status: "ready",
      path: "lib/server/universe/control-surfaces/",
    },
    {
      id: "daily_memory",
      label: "daily memory snapshots",
      sourceType: "memory_snapshot",
      status: "available",
      path: "reports/daily/",
    },
    {
      id: "product_truth",
      label: "Product Truth",
      sourceType: "product_truth",
      status: "protected",
      path: "Product Truth panels and registries",
    },
    {
      id: "kernel_state",
      label: "Kernel state",
      sourceType: "kernel",
      status: "protected",
      path: "lib/server/universe/kernel/",
    },
    {
      id: "desktop_state",
      label: "desktop state",
      sourceType: "desktop",
      status: "ready",
      path: "lib/server/universe/desktop-interface/",
    },
    {
      id: "local_auth",
      label: "local auth state",
      sourceType: "local_auth",
      status: "protected",
      path: "lib/server/universe/local-desktop-auth/",
    },
  ];
}
