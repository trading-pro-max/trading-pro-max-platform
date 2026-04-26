import type { EnvironmentSurface, SurfaceIntensity } from "./types";

export function resolveSurfaceIntensity(
  surface: EnvironmentSurface = "public_entry"
): SurfaceIntensity {
  if (surface === "public_entry") return "expressive";
  if (surface === "workspace" || surface === "settings" || surface === "diagnostics") {
    return "subtle";
  }
  if (surface === "chart") return "none";
  if (surface === "founder_alkon") return "command_private";

  return "subtle";
}
