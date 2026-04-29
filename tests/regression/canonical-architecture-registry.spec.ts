import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /Infinity Mode active if conflicts unresolved|public launch active|billing active|real money enabled|broker execution active|FINMA approved|licensed trading platform|legal approval active|public Universe active|public ALKON active/i;

test.describe("Canonical Architecture Registry", () => {
  test("registry reports classify primary, compatibility, protected, cleanup, and Ahmad-decision items", () => {
    const registryReport = fs.readFileSync(
      path.join(process.cwd(), "reports/canonical-architecture-registry.md"),
      "utf8"
    );
    const conflictReport = fs.readFileSync(
      path.join(process.cwd(), "reports/canonical-architecture-conflicts.md"),
      "utf8"
    );
    const nextActionReport = fs.readFileSync(
      path.join(process.cwd(), "reports/canonical-architecture-next-action.md"),
      "utf8"
    );

    expect(registryReport).toContain("Total registry items: 52");
    expect(registryReport).toContain("Primary: 23");
    expect(registryReport).toContain("Compatibility: 6");
    expect(registryReport).toContain("Protected: 10");
    expect(registryReport).toContain("Cleanup candidate: 4");
    expect(registryReport).toContain("Needs Ahmad decision: 9");
    expect(conflictReport).toContain("Unresolved");
    expect(registryReport).toContain("Ultimate Depth safe now: no");
    expect(registryReport).toContain("Infinity Mode safe now: no");
    expect(nextActionReport).toContain("controlled canonical cleanup");
    expect(nextActionReport).toContain("blocked_until_registry_conflicts_resolved");
  });

  test("/founder/universe renders the private canonical registry summary", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("canonical-architecture-registry")).toBeVisible();
    await expect(body).toContainText("Canonical Architecture Registry");
    await expect(body).toContainText("Primary sources are the only future truth");
    await expect(body).toContainText("Compatibility layers must wrap primary logic");
    await expect(body).toContainText("Cleanup candidates require controlled cleanup");
    await expect(body).toContainText("Ahmad decision required for unresolved product meaning");
    await expect(body).toContainText(
      "Infinity Mode remains blocked until registry conflicts are resolved"
    );
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Public launch: blocked/not started");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("registry reports exist and keep Infinity Mode blocked", () => {
    const requiredReports = [
      "reports/canonical-architecture-registry.md",
      "reports/canonical-architecture-conflicts.md",
      "reports/canonical-architecture-cleanup-plan.md",
      "reports/canonical-architecture-next-action.md",
    ];

    for (const report of requiredReports) {
      expect(fs.existsSync(path.join(process.cwd(), report))).toBe(true);
    }

    const nextAction = fs.readFileSync(
      path.join(process.cwd(), "reports/canonical-architecture-next-action.md"),
      "utf8"
    );
    expect(nextAction).toContain("controlled canonical cleanup");
    expect(nextAction).toContain("No.");
    expect(nextAction).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
