import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const FORBIDDEN_FAKE_CLAIMS =
  /NASA|official NASA|partnered with NASA|Swiss government approved|Swiss certified|FINMA approved|licensed trading platform|regulated broker|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Pro Max Earth Identity Closure", () => {
  test("renders animated Earth identity on /trading without unsafe public claims", async ({
    page,
  }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });

    const earth = page.locator("[data-promax-earth-identity='true']").first();
    await expect(earth).toBeVisible();
    await expect(earth).toHaveAttribute("data-animated-earth-mark", "true");
    await expect(earth).toHaveAttribute("data-swiss-inspired-precision", "true");
    await expect(earth).toHaveAttribute("data-reduced-motion-supported", "true");
    await expect(page.locator("body")).toContainText("Swiss-inspired visual identity only");
    await expect(page.locator("[data-product-truth-strip='true']")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(FORBIDDEN_FAKE_CLAIMS);
  });

  test("renders Earth / universe identity privately on /founder/universe", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-founder-universe-command-center='true']")).toBeVisible();
    await expect(page.locator("[data-promax-earth-identity='true']").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Swiss-inspired visual identity only");
    await expect(page.locator("body")).toContainText("Product Truth");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(FORBIDDEN_FAKE_CLAIMS);
  });

  test("Earth identity is code-only and includes reduced-motion fallback", () => {
    const sourceFiles = [
      "app/_components/ProMaxEarthIdentity.tsx",
      "app/_components/ProMaxEarthIdentity.module.css",
      "app/trading/trading-premium-realism.module.css",
      "app/founder/universe/founder-universe.module.css",
    ]
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(sourceFiles).toContain("prefers-reduced-motion");
    expect(sourceFiles).not.toMatch(/<img|src=["']https?:\/\/|fetch\(["']https?:\/\//i);
    expect(sourceFiles).not.toMatch(/\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(sourceFiles).not.toMatch(/NASA|official NASA|partnered with NASA/i);
  });
});
