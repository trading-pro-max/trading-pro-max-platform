import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_FAKE_CLAIMS =
  /NASA|official NASA|partnered with NASA|Swiss government approved|Swiss certified|FINMA approved|licensed trading platform|regulated broker|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

async function expectLivingUniverseTruth(page: Page) {
  await expect(page.getByTestId("promax-living-earth").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-globe").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-texture").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-clouds").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-atmosphere").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-night-lights").first()).toBeVisible();
  await expect(page.getByTestId("promax-living-earth-time-phase").first()).toContainText(
    "Device-time simulation only"
  );
  await expect(page.getByTestId("promax-living-earth-season").first()).toContainText(
    "Season:"
  );
  await expect(page.getByTestId("promax-living-earth-reduced-motion-safe").first()).toBeAttached();
  await expect(page.getByTestId("promax-device-time-reality-bar").first()).toBeVisible();
  await expect(page.locator("body")).toContainText("Weather: not connected");
  await expect(page.locator("body")).toContainText("Assets: local/procedural/license-safe");
  await expect(page.locator("body")).toContainText("Product Truth");
  await expect(page.locator("body")).toContainText("Real money: disabled");
  await expect(page.locator("body")).toContainText("Broker execution: disabled/not connected");

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(FORBIDDEN_FAKE_CLAIMS);
}

test.describe("Living Universe With Legal-Safe Assets Closure", () => {
  test("private founder universe renders living Earth, device-time, season, assets, and sound truth", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-founder-universe-command-center='true']")).toBeVisible();
    await expectLivingUniverseTruth(page);
    await expect(page.getByTestId("promax-universe-soundscape")).toBeVisible();
    await expect(page.getByTestId("promax-universe-soundscape")).toContainText("Soundscape Off");
    await expect(page.getByTestId("promax-universe-soundscape")).toHaveAttribute(
      "data-soundscape-off-by-default",
      "true"
    );
    await expect(page.locator("body")).toContainText("ALKON");
    await expect(page.locator("body")).toContainText("Private / read-only");
    await expect(page.locator("body")).toContainText("Brand Gate: ready_with_notes");
    await expect(page.locator("body")).toContainText("Local Day One: not_started");
  });

  test("trading renders living universe without harming Product Truth", async ({ page }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-trading-operating-floor='true']")).toBeVisible();
    await expectLivingUniverseTruth(page);
    await expect(page.locator("[data-product-truth-strip='true']")).toContainText(
      "Device-time simulation only"
    );
    await expect(page.locator("[data-product-truth-strip='true']")).toContainText(
      "Weather not connected"
    );
    await expect(page.locator("[data-product-truth-strip='true']")).toContainText(
      "Assets: local/procedural/license-safe"
    );
    await expect(page.locator("body")).toContainText("Pro Max: working name only");
    await expect(page.locator("body")).toContainText("Brand Gate review: ready with notes");
  });

  test("asset manifest and procedural asset policy exist without external images", () => {
    const manifestPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "promax",
      "asset-manifest.json"
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      assets: Array<{ path: string; source: string; approvedForPrivateInternalUse: boolean }>;
    };

    expect(manifest.assets.length).toBeGreaterThanOrEqual(10);
    expect(manifest.assets.every((asset) => asset.approvedForPrivateInternalUse)).toBe(true);
    expect(JSON.stringify(manifest)).toContain("local_procedural");
    expect(JSON.stringify(manifest)).not.toMatch(/https?:\/\/|NASA|official Swiss|FINMA/i);

    const componentSource = [
      "app/_components/ProMaxLivingEarth.tsx",
      "app/_components/ProMaxLivingEarth.module.css",
      "app/_components/ProMaxLivingUniverseBackground.tsx",
      "app/_components/ProMaxUniverseSoundscape.tsx",
      "lib/client/living-universe/soundscape.ts",
    ]
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(componentSource).toContain("prefers-reduced-motion");
    expect(componentSource).toContain("data-testid=\"promax-living-earth-globe\"");
    expect(componentSource).toContain("data-testid=\"promax-living-earth-texture\"");
    expect(componentSource).toContain("Device-time simulation only");
    expect(componentSource).toContain("Weather not connected");
    expect(componentSource).not.toMatch(/src=["']https?:\/\/|fetch\(["']https?:\/\//i);
    expect(componentSource).not.toMatch(/NASA|official NASA|partnered with NASA/i);
  });
});
