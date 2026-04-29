import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_CLAIMS =
  /real weather active|exact weather|exact sun position|user location active|NASA|NASA partnership|Swiss government approved|Swiss certified|FINMA approved|licensed trading platform|regulated broker|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|risk free/i;

async function expectImmersionMarkers(page: Page) {
  const body = page.locator("body");

  await expect(page.getByTestId("promax-reality-continuity-layer").first()).toBeVisible();
  await expect(page.getByTestId("promax-device-time-reality").first()).toBeVisible();
  await expect(page.getByTestId("promax-season-reality").first()).toBeVisible();
  await expect(page.getByTestId("promax-inside-outside-continuity").first()).toContainText(
    "Inside and outside share the same device-time reality"
  );
  await expect(page.getByTestId("promax-cosmic-identity").first()).toBeVisible();
  await expect(page.getByTestId("promax-realistic-earth-marker").first()).toBeAttached();
  await expect(page.getByTestId("promax-orbiting-moon").first()).toBeVisible();
  await expect(page.getByTestId("promax-swiss-red-mark").first()).toBeVisible();
  await expect(body).toContainText("Real when sourced. Simulated when labeled.");
  await expect(body).toContainText("Product Truth");

  expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
}

test.describe("Hyper-Real Earth Immersion Style Closure", () => {
  test("/founder/universe renders private immersive Earth command continuity", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");

    await expect(page.locator("[data-founder-universe-command-center='true']")).toBeVisible();
    await expectImmersionMarkers(page);
    await expect(body).toContainText("Pro Max Earth is the product planet inside Universe");
    await expect(body).toContainText("Moon orbiting Pro Max Earth");
    await expect(body).toContainText("Device-time reality active");
    await expect(body).toContainText("Swiss-inspired precision mark");
    await expect(body).toContainText("Public Pro Max launch is blocked until all gates close");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Weather is not connected");
  });

  test("/trading renders immersive trading ground without losing chart priority", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");

    await expect(page.locator("[data-trading-operating-floor='true']")).toBeVisible();
    await expectImmersionMarkers(page);
    await expect(body).toContainText("Trading Ground on Pro Max Earth");
    await expect(body).toContainText("Public launch: blocked/not started");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Weather is not connected");
    await expect(page.locator(".tpm-living-chart-surface .tpmv2-chart-surface")).toBeVisible();
  });

  test("Pro Max Center renders the same public-safe Earth immersion language", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");

    await expect(body).toContainText("Pro Max Center");
    await expectImmersionMarkers(page);
    await expect(body).toContainText("Paper-safe");
    await expect(body).toContainText("Live execution inactive");
    await expect(body).toContainText("Broker/feed not configured");
    expect(await body.innerText()).not.toMatch(/Alkon|ALKON|Founder Command|Zero Truth|Reality Trial/i);
  });

  test("hyper-real immersion report and professional standard exist", () => {
    expect(
      fs.existsSync(path.join(process.cwd(), "reports/hyper-real-earth-immersion-style-closure.md"))
    ).toBe(true);
    expect(
      fs
        .readFileSync(
          path.join(process.cwd(), "docs/product/project-universe-professional-standard.md"),
          "utf8"
        )
        .includes("Inside/Outside Earth Reality Continuity Standard")
    ).toBe(true);
  });
});
