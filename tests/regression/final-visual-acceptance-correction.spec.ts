import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /global number one already|legal 100% approved|real weather active|exact weather|exact sun position|user location active|FINMA approved|licensed trading platform|regulated broker|Swiss government approved|Swiss certified|official Swiss endorsement|copied agency endorsement|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Final Visual Acceptance Correction", () => {
  test("/founder/universe renders premium private Universe with realistic Pro Max Earth", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");

    await expect(page.getByTestId("promax-living-earth").first()).toBeVisible();
    await expect(page.getByTestId("promax-earth-depth-lighting").first()).toBeVisible();
    await expect(page.getByTestId("private-universe-hierarchy")).toBeVisible();
    await expect(body).toContainText("Universe Command Deck");
    await expect(body).toContainText("Readiness Scores");
    await expect(body).toContainText("Pro Max Earth");
    await expect(body).toContainText("Pro Max Galaxy");
    await expect(body).toContainText("Earth Planet");
    await expect(body).toContainText("Future public product planet");
    await expect(body).toContainText("Reality mode: literal software realism");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public Pro Max launch is blocked until all gates close");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Weather is not connected");
    await expect(body).toContainText("ALKON stays private/background");
    await expect(body).toContainText("ALKON is background guardian support, not the second layer");

    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading renders dense trading ground with calmer command chips and truth intact", async ({
    page,
  }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");

    await expect(page.getByTestId("promax-living-earth").first()).toBeVisible();
    await expect(page.getByTestId("promax-earth-depth-lighting").first()).toBeVisible();
    await expect(body).toContainText("Trading Ground on Pro Max Earth");
    await expect(body).toContainText("Managed by Universe");
    await expect(body).toContainText("Reality mode: literal software realism");
    await expect(body).toContainText("Product Truth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Weather is not connected");
    await expect(page.locator(".tpm-living-chart-surface .tpmv2-chart-surface")).toBeVisible();

    const commandChipCount = await page.locator(".tpm-terminal-topbar [aria-label='Trading operating truth'] span").count();
    expect(commandChipCount).toBeLessThanOrEqual(6);
    expect(await body.innerText()).not.toMatch(/Alkon|ALKON|Founder Command|Zero Truth|Reality Trial/i);
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("visual correction report exists", () => {
    expect(
      fs.existsSync(path.join(process.cwd(), "reports/final-visual-acceptance-correction.md"))
    ).toBe(true);
  });
});
