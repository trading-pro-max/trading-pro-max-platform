import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /public launch active|billing active|real money enabled|broker execution active|live broker active|legal approval active|FINMA approved|licensed trading platform|Universe public active|الكون public active|ALKON public active|Pro Max owns Universe|Pro Max is the whole Universe|ALKON is second layer|Global overrides Swiss|Infinity Mode active if registry still blocks it|guaranteed profit|risk free/i;

test.describe("Controlled Canonical Cleanup", () => {
  test("/founder/universe renders cleanup registry and canonical hierarchy truth", async ({
    page,
  }) => {
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
    await expect(body).toContainText("Cleanup status: controlled canonical cleanup");
    await expect(body).toContainText("Pro Max Galaxy is inside");
    await expect(body).toContainText("Earth Planet is the trading project");
    await expect(body).toContainText("Swiss Local Constitution is above the Global Layer");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Billing: not active");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("ALKON is private/background, not second");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading remains readable and Product Truth remains blocked", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(body).toContainText("Trading Ground on Pro Max Earth");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Billing inactive");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Trading: demo-safe/read-only");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("cleanup report and canonical docs exist", () => {
    const requiredFiles = [
      "reports/controlled-canonical-cleanup.md",
      "docs/product/universe-constitution.md",
      "docs/product/canonical-code-architecture.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const cleanupReport = fs.readFileSync(
      path.join(process.cwd(), "reports/controlled-canonical-cleanup.md"),
      "utf8"
    );
    expect(cleanupReport).toContain("existing kernel canonicalization");
    expect(cleanupReport).toContain("Can Infinity Mode Resume?");
    expect(cleanupReport).toContain("No.");
    expect(cleanupReport).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
