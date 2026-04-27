import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = path.join("test-results", "alkon-private-universe-identity");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Alkon Pocket|Kernel|Zero Truth|Reality Trial|Device Constellation|Pocket Universe|Local Builder|internal governance/i;
const UNSAFE_PUBLIC_LINKS = [
  "/founder/alkon",
  "/founder/pocket",
  "/founder/command",
  "/api/founder",
];
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;

async function expectPublicAlkonClean(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);

  for (const href of UNSAFE_PUBLIC_LINKS) {
    await expect(page.locator(`a[href^="${href}"]`), href).toHaveCount(0);
  }
}

test.describe("Alkon Private Universe Identity Correction", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("/founder/alkon renders the private Alkon command interface", async ({ page }) => {
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();

    const body = page.locator("body");
    await expect(body).toContainText("Alkon / الكون");
    await expect(body).toContainText("Private Operating Universe");
    await expect(body).toContainText("Alkon Operating Mode");
    await expect(body).toContainText("Ask Alkon");
    await expect(body).toContainText("Kernel 0-16");
    await expect(body).toContainText("Zero Truth");
    await expect(body).toContainText("One Next Action");
    await expect(body).toContainText("Wake Report");
    await expect(body).toContainText("Reality Trial");
    await expect(body).toContainText("Evidence Chain");
    await expect(body).toContainText("Daily Loop");
    await expect(body).toContainText("Local Day One Gate");
    await expect(body).toContainText("Device Constellation");
    await expect(body).toContainText("What Not To Do");
    await expect(body).toContainText("No unsafe activation");
    await expect(body).toContainText("Command Passport Preview");
    await expect(body).not.toContainText(/Paper-safe AI-Guided Trading Workspace|Pro Max Assistant|Start trading/i);
    await expect(page.locator("button")).toHaveCount(0);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-alkon-universe.png"),
    });
  });

  test("/founder/pocket is Alkon Pocket, not public Pro Max marketing", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();

    const body = page.locator("body");
    await expect(body).toContainText("Alkon Pocket");
    await expect(body).toContainText("Ahmad Pocket Decision");
    await expect(body).toContainText("Private Founder-only");
    await expect(body).toContainText("Wake Report");
    await expect(body).toContainText("One Next Action");
    await expect(body).toContainText("Visual Review");
    await expect(body).toContainText("Local Day One Gate");
    await expect(body).toContainText("What not to do");
    await expect(body).toContainText("Open Ask Alkon");
    await expect(body).not.toContainText(/Paper-safe AI-Guided Trading Workspace|Pro Max Assistant|public Home|Start trading/i);
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator(`a[href="/founder/alkon"]`)).toHaveCount(1);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-pocket-alkon-identity.png"),
    });
  });

  test("Alkon Pocket remains mobile-readable and action-safe", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Alkon Pocket");
    await expect(page.locator("body")).toContainText("Ahmad Pocket Decision");
    await expect(page.locator("body")).toContainText("Ahmad visual acceptance needed");
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Launch now|Pay now|Live trade now|Run shell now|Run Codex now/i);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "pocket-mobile-layout.png"),
    });
  });

  test("public Home and Diagnostics do not link to Alkon or Founder routes", async ({
    page,
  }) => {
    await expectPublicAlkonClean(page, "/");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-no-alkon-link.png"),
    });

    await expectPublicAlkonClean(page, "/diagnostics");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "no-alkon-public-leak.png"),
    });
  });

  test("identity correction preserves safety and tracked source stays raster-free", () => {
    const sourceFiles = [
      "modules/shell/components/PrivateFounderShell.tsx",
      "modules/founder-command/components/FounderCommandRoom.tsx",
      "app/founder/alkon/page.tsx",
      "app/founder/pocket/page.tsx",
      "lib/server/devices/pocket-universe.ts",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<ProductLogo|TPMEarthMark|tpm-public-nav/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/liveExecutionActive:\s*true|billingActivationActive:\s*true|brokerFeedActivationActive:\s*true|realMoneyRoutingActive:\s*true/);
  });
});
