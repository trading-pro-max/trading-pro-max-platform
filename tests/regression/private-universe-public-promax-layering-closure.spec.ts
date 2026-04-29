import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  proMaxPublicFutureReadiness,
  universeDeepModel,
  universeLayerOrder,
  universeManagementReadiness,
} from "../../lib/server/universe-management";

const FORBIDDEN_CLAIMS =
  /global number one already|legal 100% approved|real weather active|exact weather|exact sun position|user location active|FINMA approved|licensed trading platform|regulated broker|Swiss government approved|Swiss certified|NASA|official NASA|NASA partnership|investment advice provided|this is investment advice|real money enabled|live broker active|real execution active|public launch active|billing active|guaranteed profit|guaranteed win|risk free|fully autonomous live trading/i;

test.describe("Private Universe / Public Pro Max Layering Closure", () => {
  test("server model keeps Universe private and Pro Max Earth as future public product", () => {
    expect(universeLayerOrder.map((layer) => layer.label)).toEqual([
      "Ahmad Private Devices",
      "Universe",
      "Pro Max Earth",
      "Living Earth Reality",
      "/trading",
      "Public Pro Max Surfaces",
      "ALKON",
    ]);
    expect(universeDeepModel.universe.privateOnlyOnAhmadDevices).toBe(true);
    expect(universeDeepModel.proMaxEarth.globalApproval).toBe(false);
    expect(universeDeepModel.alkon.mustNeverBeSecondLayer).toBe(true);
    expect(universeManagementReadiness.publicExposureAllowed).toBe(false);
    expect(proMaxPublicFutureReadiness.publicLaunchAllowed).toBe(false);
  });

  test("/founder/universe renders the private-device hierarchy and public-future Pro Max truth", async ({
    page,
  }) => {
    await page.goto("/founder/universe", { waitUntil: "domcontentloaded" });

    const body = page.locator("body");
    await expect(body).toContainText("Universe stays private on Ahmad's devices");
    await expect(body).toContainText("Pro Max is the product that may appear to the world");
    await expect(body).toContainText("Universe privately manages Pro Max");
    await expect(body).toContainText("Pro Max is private until legally ready");
    await expect(body).toContainText("Public Pro Max launch is blocked until all gates close");
    await expect(body).toContainText("ALKON stays private/background");
    await expect(body).toContainText("Goal: world-class legally ready global product");
    await expect(page.getByTestId("private-universe-hierarchy")).toContainText(
      "ALKON — Private Background Guardian"
    );

    const bodyText = await body.innerText();
    expect(bodyText).not.toMatch(FORBIDDEN_CLAIMS);
  });

  test("closure report exists", () => {
    expect(
      fs.existsSync(
        path.join(process.cwd(), "reports", "private-universe-public-promax-layering-closure.md")
      )
    ).toBe(true);
  });
});
