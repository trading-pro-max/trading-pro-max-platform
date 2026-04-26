import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { getEarthIdentity } from "../../lib/brand/earth-identity-engine";
import { getPlanEntitlementSnapshot } from "../../lib/plans/entitlements";
import {
  getPlanRealm,
  getPrivateFounderRealm,
  getPublicPlanRealms,
} from "../../lib/plans/realms";

const ARTIFACT_DIR = path.join(
  "test-results",
  "plan-realm-functional-experience"
);
const THEME_STORAGE_KEY = "tpm-theme-mode-v1";
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon|الكون|Founder Command|Founder King|Owner controls|Planet governance|\bministries\b|\bcouncils\b|presidency|construction queue|Codex tasks|secrets authority|treasury controls|product memory internals|local operations internals/i;

async function openWithTheme(
  page: Page,
  pathName: string,
  themeMode: "dark" | "light" | "system"
) {
  await page.goto(pathName);
  await page.evaluate(
    ({ key, mode }) => window.localStorage.setItem(key, mode),
    { key: THEME_STORAGE_KEY, mode: themeMode }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

async function screenshotLocator(page: Page, selector: string, fileName: string) {
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();
  await target.screenshot({ path: path.join(ARTIFACT_DIR, fileName) });
}

test.describe("plan-realm functional experience system", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("defines public realms and keeps Alkon private", () => {
    const requiredDocs = [
      "docs/product/plan-realm-functional-experience-system.md",
      "docs/product/free-earth-realm.md",
      "docs/product/pro-orbit-realm.md",
      "docs/product/vip-lunar-realm.md",
      "docs/product/institutional-station-realm.md",
      "docs/product/alkon-universe-realm.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }

    const publicRealms = getPublicPlanRealms();
    expect(publicRealms.map((realm) => realm.realmId)).toEqual([
      "free_earth",
      "pro_orbit",
      "vip_lunar",
      "institutional_station",
    ]);
    expect(publicRealms.map((realm) => realm.publicPlanName)).toEqual([
      "Free",
      "Pro",
      "VIP",
      "Institutional",
    ]);
    expect(publicRealms.some((realm) => realm.realmId === "alkon_universe")).toBe(false);

    const free = getPlanRealm("free_earth");
    expect(free.activationState).toBe("active");
    expect(free.allowedFeatures.map((feature) => feature.key)).toEqual(
      expect.arrayContaining([
        "web_workspace",
        "paper_execution",
        "basic_assistant",
        "basic_journal_coach",
      ])
    );
    expect(free.productTruthRequirements.join(" ")).toMatch(/complete, not cheap/i);

    expect(getPlanRealm("pro_orbit")).toMatchObject({
      publicPlanName: "Pro",
      activationState: "planned",
      visibility: "public_user",
    });
    expect(getPlanRealm("pro_orbit").lockedFeatures.map((feature) => feature.key)).toEqual(
      expect.arrayContaining(["professional_workspace", "decision_replay"])
    );
    expect(getPlanRealm("vip_lunar")).toMatchObject({
      publicPlanName: "VIP",
      activationState: "planned",
      visibility: "public_user",
    });
    expect(getPlanRealm("vip_lunar").plannedFeatures.map((feature) => feature.key)).toEqual(
      expect.arrayContaining(["vip_rooms", "priority_support"])
    );
    expect(getPlanRealm("institutional_station")).toMatchObject({
      publicPlanName: "Institutional",
      activationState: "future",
      visibility: "public_user",
    });

    const privateRealm = getPrivateFounderRealm();
    expect(privateRealm).toMatchObject({
      realmId: "alkon_universe",
      visibility: "private_founder",
      activationState: "internal_only",
    });

    const entitlements = getPlanEntitlementSnapshot("demo_free");
    expect(entitlements.currentPlan).toBe("demo_free");
    expect(entitlements.plans.map((plan) => plan.realmId)).toEqual([
      "free_earth",
      "pro_orbit",
      "vip_lunar",
      "institutional_station",
    ]);
    expect(entitlements.truth).toMatchObject({
      billing: "inactive",
      paidAccess: "not_enabled",
      vipActivation: "not_active",
      institutionalActivation: "future_planned",
      founderCommandAccess: "owner_only_never_user_plan",
    });
  });

  test("keeps Earth identity code-only and different by realm", () => {
    const free = getEarthIdentity({ plan: "free", theme: "light" });
    const freeDark = getEarthIdentity({ plan: "free", theme: "dark" });
    const pro = getEarthIdentity({ plan: "pro" });
    const vip = getEarthIdentity({ plan: "vip" });
    const institutional = getEarthIdentity({ plan: "institutional" });

    expect(free.realmId).toBe("free_earth");
    expect(pro.realmId).toBe("pro_orbit");
    expect(vip.realmId).toBe("vip_lunar");
    expect(institutional.realmId).toBe("institutional_station");
    expect(free.layers.realmShape).not.toBe(pro.layers.realmShape);
    expect(pro.layers.realmShape).not.toBe(vip.layers.realmShape);
    expect(vip.layers.realmShape).not.toBe(institutional.layers.realmShape);
    expect(free.cssVariables["--tpm-earth-gold"]).not.toBe(
      vip.cssVariables["--tpm-earth-gold"]
    );
    expect(vip.cssVariables["--tpm-earth-gold"]).toContain("#f1c96b");
    expect(freeDark.theme).toBe("dark");
    expect(free.cssVariables).not.toEqual(freeDark.cssVariables);
    expect(free.truth).toMatchObject({
      rasterAssetsUsed: false,
      externalMapAssetsUsed: false,
      noPreciseLocation: true,
      publicFounderSymbol: false,
    });

    const markSource = fs.readFileSync(
      path.join(process.cwd(), "modules/brand/components/TPMEarthMark.tsx"),
      "utf8"
    );
    const backgroundSource = fs.readFileSync(
      path.join(process.cwd(), "modules/brand/components/LivingEarthBackground.tsx"),
      "utf8"
    );
    expect(markSource).toContain("tpm-earth-realm-pro-grid");
    expect(markSource).toContain("tpm-earth-realm-vip-lunar");
    expect(markSource).toContain("tpm-earth-realm-institutional-station");
    expect(`${markSource}\n${backgroundSource}`).not.toMatch(
      /<img|\.(png|jpe?g|webp|gif|avif)/i
    );
  });

  test("aligns Assistant, Journal/Coach, Diagnostics, and private command APIs", async ({
    request,
  }) => {
    for (const [planTier, realmId, activationState] of [
      ["demo_free", "free_earth", "active"],
      ["pro", "pro_orbit", "planned"],
      ["vip", "vip_lunar", "planned"],
      ["enterprise", "institutional_station", "future"],
    ] as const) {
      const response = await request.get(`/api/companion/context?planTier=${planTier}`);
      expect(response.status()).toBe(200);
      const text = await response.text();
      expect(text).not.toMatch(/Alkon|الكون|Founder Command/);
      const payload = JSON.parse(text);
      expect(payload.snapshot.realm).toMatchObject({
        realmId,
        activationState,
      });
      expect(payload.snapshot.safety).toMatchObject({
        canExecuteTrades: false,
        canActivateLive: false,
        canActivateBilling: false,
        canActivateBrokerFeed: false,
        canPublishSocial: false,
      });
      expect(payload.responses.map((item: { body: string }) => item.body).join(" ")).not.toMatch(
        /paid active|VIP enabled|guaranteed profit|guaranteed signals are active/i
      );
    }

    const journal = await (await request.get("/api/journal-coach/readiness")).json();
    expect(journal.snapshot.currentRealm).toBe("free_earth");
    expect(journal.snapshot.realmAccess).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ realmId: "free_earth", state: "active" }),
        expect.objectContaining({ realmId: "pro_orbit", state: "planned" }),
        expect.objectContaining({ realmId: "vip_lunar", state: "planned" }),
        expect.objectContaining({
          realmId: "institutional_station",
          state: "future",
        }),
      ])
    );
    expect(journal.snapshot.safety).toMatchObject({
      profitGuarantee: "blocked",
      financialAdvice: "blocked",
      tradingSignals: "blocked",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    });

    const diagnostics = await (await request.get("/api/diagnostics/probes")).json();
    expect(diagnostics.health.probes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "plan_realm_functional_experience",
          status: "ready",
        }),
      ])
    );

    const founder = await (await request.get("/api/founder/command/snapshot")).json();
    expect(founder.snapshot.insideOutsidePlanet.privateWorld.alkonUniverse).toMatchObject({
      realmId: "alkon_universe",
      visibility: "private_founder",
      publicPlanAccess: false,
    });
    expect(
      founder.snapshot.insideOutsidePlanet.planRealmFunctionalExperience.publicRealms
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ realmId: "free_earth", activationState: "active" }),
        expect.objectContaining({ realmId: "pro_orbit", activationState: "planned" }),
        expect.objectContaining({ realmId: "vip_lunar", activationState: "planned" }),
        expect.objectContaining({
          realmId: "institutional_station",
          activationState: "future",
        }),
      ])
    );
  });

  test("renders public realm UI without Alkon leakage and captures visual proof", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Pro Max Trading");
    await expect(page.locator("body")).toContainText("Free");
    await expect(page.locator("body")).toContainText("Pro");
    await expect(page.locator("body")).toContainText("VIP");
    await expect(page.locator("body")).toContainText("Institutional");
    expect(await page.locator("body").innerText()).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    await expect(page.locator("img")).toHaveCount(0);

    const realmCards = page.locator(".tpm-product-plan-card[data-plan-realm]");
    await expect(realmCards).toHaveCount(4);
    await expect(page.locator('[data-plan-realm="free_earth"]').first()).toContainText(
      "Start on the web workspace"
    );
    await expect(page.locator('[data-plan-realm="pro_orbit"]').first()).toContainText(
      "Professional workspace tools"
    );
    await expect(page.locator('[data-plan-realm="vip_lunar"]').first()).toContainText(
      "Premium advanced layer"
    );
    await expect(
      page.locator('[data-plan-realm="institutional_station"]').first()
    ).toContainText("Future team/institutional layer");
    await expect(page.locator('[data-plan-realm="alkon_universe"]')).toHaveCount(0);

    await screenshotLocator(page, ".tpm-product-hero", "public-entry-free-earth.png");
    await screenshotLocator(page, "#plans", "plan-surfaces.png");
    await screenshotLocator(
      page,
      '.tpm-product-plan-card[data-plan-realm="free_earth"] .tpm-earth-mark',
      "free-earth-mark.png"
    );
    await screenshotLocator(
      page,
      '.tpm-product-plan-card[data-plan-realm="pro_orbit"]',
      "pro-orbit-preview.png"
    );
    await screenshotLocator(
      page,
      '.tpm-product-plan-card[data-plan-realm="vip_lunar"]',
      "vip-lunar-preview.png"
    );
    await screenshotLocator(
      page,
      '.tpm-product-plan-card[data-plan-realm="institutional_station"]',
      "institutional-station-preview.png"
    );

    await openWithTheme(page, "/en", "dark");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText(PUBLIC_FORBIDDEN_TERMS);
    await screenshotLocator(page, ".tpmv2-desktop-master", "workstation-dark.png");

    await page.goto("/settings");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Free experience");
    await expect(page.locator("body")).toContainText("Pro experience");
    await expect(page.locator("body")).toContainText("VIP experience");
    await expect(page.locator("body")).toContainText("Institutional experience");
    expect(await page.locator("body").innerText()).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    await screenshotLocator(
      page,
      '[data-utility-section="plan-readiness"]',
      "settings-realm.png"
    );

    await page.goto("/diagnostics");
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Experience readiness by plan");
    expect(await page.locator("body").innerText()).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
    await screenshotLocator(
      page,
      '[data-utility-section="plan-readiness"]',
      "diagnostics-realm.png"
    );

    await openWithTheme(page, "/ar", "dark");
    await expect(page.locator(".tpmv2-desktop-master").first()).toBeVisible();
    const documentDirection = await page.locator(".tpm-foundation-frame").getAttribute("dir");
    expect(documentDirection).toBe("rtl");
    await screenshotLocator(
      page,
      ".tpmv2-desktop-master",
      "arabic-rtl-workstation.png"
    );
  });
});
