import { expect, test } from "@playwright/test";
import { universeLayerOrder } from "../../lib/server/universe-management";

const FORBIDDEN_CLAIMS =
  /global number one already|legal 100% approved|real weather active|exact weather|exact sun position|user location active|FINMA approved|licensed trading platform|regulated broker|Swiss government approved|Swiss certified|NASA|official NASA|NASA partnership|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Deep Literal Universe Order Closure", () => {
  test("canonical layer order keeps Pro Max Earth before ALKON", () => {
    const proMaxEarth = universeLayerOrder.find((layer) => layer.id === "pro_max_earth");
    const livingReality = universeLayerOrder.find((layer) => layer.id === "living_earth_reality");
    const alkon = universeLayerOrder.find((layer) => layer.id === "alkon_background_guardian");
    expect(proMaxEarth?.layerOrder).toBe(2);
    expect(livingReality?.layerOrder).toBe(3);
    expect(alkon?.layerOrder).toBe(6);
  });

  test("/founder/universe renders the deep hierarchy and ALKON background role", async ({ page }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    await expect(body).toContainText(
      "Universe is a private living operating system and visual simulation"
    );
    await expect(body).toContainText("Pro Max Earth is the product planet inside Universe");
    await expect(body).toContainText(
      "Living Earth Layers use device-time and device-date simulation"
    );
    await expect(body).toContainText("ALKON is background guardian support, not the second layer");
    await expect(body).toContainText("Product Truth");
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("/trading renders as Trading Ground on Pro Max Earth without private naming leak", async ({
    page,
  }) => {
    await page.goto("/trading", { waitUntil: "domcontentloaded" });
    const body = page.locator("body");
    await expect(body).toContainText("Trading Ground on Pro Max Earth");
    await expect(body).toContainText("Product Truth");
    expect(await body.innerText()).not.toMatch(/Alkon|ALKON|Founder Command|Zero Truth|Reality Trial/i);
    expect(await body.innerText()).not.toMatch(FORBIDDEN_CLAIMS);
  });
});
