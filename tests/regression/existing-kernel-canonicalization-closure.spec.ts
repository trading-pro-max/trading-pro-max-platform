import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /duplicate kernel active|public launch active|billing active|receiving money active|real money enabled|broker execution active|legal approval active|FINMA approved|licensed trading platform|Universe public active|الكون public active|ALKON public active|guaranteed profit|risk free|fully autonomous live trading/i;

test.describe("Existing Kernel Canonicalization Closure", () => {
  test("/founder/universe shows the canonical Universe Operating Kernel", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(page.getByTestId("universe-operating-kernel")).toBeVisible();
    await expect(body).toContainText(
      "Existing kernel canonicalized as Universe Operating Kernel"
    );
    await expect(body).toContainText(
      "Universe Operating Kernel is the root private operating brain"
    );
    await expect(body).toContainText("Product Truth overrides every action");
    await expect(body).toContainText(
      "Swiss Local Constitution is above the Global Layer"
    );
    await expect(body).toContainText(
      "Dangerous actions require Ahmad approval or remain blocked"
    );
    await expect(body).toContainText("No duplicate kernel exists");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("kernel adapter docs and closure report exist", () => {
    const requiredFiles = [
      "lib/server/universe/kernel/index.ts",
      "lib/server/universe/kernel/types.ts",
      "docs/product/universe-operating-kernel-standard.md",
      "reports/existing-kernel-canonicalization-closure.md",
    ];

    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }

    const report = fs.readFileSync(
      path.join(process.cwd(), "reports/existing-kernel-canonicalization-closure.md"),
      "utf8"
    );
    expect(report).toContain("Existing kernel canonicalized as Universe Operating Kernel.");
    expect(report).toContain("No duplicate kernel exists.");
    expect(report).toContain("Product Truth overrides every action.");
    expect(report).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
