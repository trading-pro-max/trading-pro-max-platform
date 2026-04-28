import { expect, test } from "@playwright/test";

const PUBLIC_FORBIDDEN_PRIVATE_TERMS =
  /Alkon|Alkon -0|Founder Command|Kernel|Zero Truth|Reality Trial|Jar System|Permission-to-Exist|internal governance/i;
const FORBIDDEN_FAKE_CLAIMS =
  /NASA|official NASA|partnered with NASA|Swiss government approved|Swiss certified|FINMA approved|licensed trading platform|regulated broker|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Trading Premium Visual Realism Closure", () => {
  test("/trading renders a complete premium real-Earth operating floor", async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 960 });
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-trading-operating-floor='true']")).toBeVisible();
    await expect(page.locator(".tpm-terminal-topbar")).toBeVisible();
    await expect(page.locator("[data-animated-earth-mark='true']").first()).toBeVisible();
    await expect(page.locator("body")).toContainText(
      "Earth-scale intelligence. Swiss-inspired precision. Private until legally ready."
    );
    await expect(page.locator("[data-market-watch-panel='true']")).toBeVisible();
    await expect(page.locator("[data-instrument-header='true']")).toBeVisible();
    await expect(page.locator("[data-chart-zone='true']")).toBeVisible();
    await expect(page.locator(".tpmv2-chart-surface").first()).toBeVisible();
    await expect(page.locator(".tpmv2-candle").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-price-marker").first()).toBeVisible();
    await expect(page.locator(".tpmv2-chart-volume").first()).toBeVisible();
    await expect(page.locator("[data-execution-risk-panel='true']")).toBeVisible();
    await expect(page.locator("[data-positions-activity-dock='true']")).toBeVisible();
    await expect(page.locator("[data-alkon-truth-panel='true']")).toBeVisible();
    await expect(page.locator("[data-product-truth-strip='true']")).toBeVisible();
  });

  test("/trading shows product truth and blocks unsafe activation", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(body).toContainText("Private: yes");
    await expect(body).toContainText("Read-only: yes");
    await expect(body).toContainText("Demo-safe: yes");
    await expect(body).toContainText("Real money: disabled");
    await expect(body).toContainText("Broker execution: disabled/not connected");
    await expect(body).toContainText("Public launch: not started");
    await expect(body).toContainText("Billing: not active");
    await expect(body).toContainText("Brand Gate: frozen/deferred");
    await expect(body).toContainText("Local Day One: not started");
    await expect(body).toContainText("Swiss legal review: pending");
    await expect(body).toContainText("Global legal review: pending");

    const bodyText = await body.innerText();
    expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_PRIVATE_TERMS);
    expect(bodyText).not.toMatch(FORBIDDEN_FAKE_CLAIMS);
    await expect(page.locator('a[href^="/founder"], a[href^="/api/founder"]')).toHaveCount(0);
  });

  test("chart remains dominant and execution stays attached", async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 960 });
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const chart = page.locator(".tpm-living-chart-surface .tpmv2-chart-surface").first();
    const execution = page.locator(".tpm-living-execution-rail").first();
    const chartBox = await chart.boundingBox();
    const executionBox = await execution.boundingBox();

    expect(chartBox).not.toBeNull();
    expect(executionBox).not.toBeNull();
    expect(chartBox!.width).toBeGreaterThan(executionBox!.width * 1.8);
    expect(chartBox!.height).toBeGreaterThan(620);
    expect(Math.abs(chartBox!.y - executionBox!.y)).toBeLessThan(60);
  });
});
