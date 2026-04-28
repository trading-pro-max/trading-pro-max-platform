import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  getAlkonChatContext,
  interpretAlkonChatIntent,
  runAlkonChatMessage,
} from "../../lib/server/alkon-chat";

const ARTIFACT_DIR = path.join("test-results", "alkon-sovereign-command-interface");
const CHAT_ARTIFACT_DIR = path.join("test-results", "alkon-sovereign-chat-interface");
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon Chat|Alkon Sovereign Command Interface|Founder Command|Kernel|Zero Truth|Reality Trial|internal chat|command passport|Alkon|الكون/i;
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;

async function expectPublicClean(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator(`a[href="/founder/alkon"]`)).toHaveCount(0);
  await expect(page.locator(`a[href="/founder/pocket"]`)).toHaveCount(0);
  await expect(page.locator(`a[href^="/api/founder/alkon-chat"]`)).toHaveCount(0);
}

test.describe("Alkon Sovereign Command Interface", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    fs.mkdirSync(CHAT_ARTIFACT_DIR, { recursive: true });
  });

  test("read-only command mind interprets Arabic, drafts passports, and blocks unsafe requests", () => {
    expect(interpretAlkonChatIntent("ما حالة الكون؟").type).toBe("ask_status");
    expect(interpretAlkonChatIntent("ما القرار التالي؟").type).toBe("ask_one_next_action");
    expect(interpretAlkonChatIntent("جهز أمر Codex").type).toBe("prepare_command_passport");

    const status = runAlkonChatMessage("ما حالة الكون؟", "2026-04-27T10:00:00.000Z");
    expect(status.intent.type).toBe("ask_status");
    expect(status.safety.allowed).toBe(true);
    expect(status.response).toContain("Alkon answers");
    expect(status.sections.map((section) => section.title)).toEqual(
      expect.arrayContaining(["Operating Mode", "Kernel", "One Next Action"])
    );

    const next = runAlkonChatMessage("ما القرار التالي؟", "2026-04-27T10:00:00.000Z");
    expect(next.intent.type).toBe("ask_one_next_action");
    expect(next.oneNextAction?.action).toMatch(/visual|Ahmad|review/i);

    const passport = runAlkonChatMessage("جهز أمر Codex", "2026-04-27T10:00:00.000Z");
    expect(passport.decision).toBe("prepare_passport_preview");
    expect(passport.commandPassportDraft).toMatchObject({
      previewOnly: true,
      noExecution: true,
    });
    expect(passport.commandPassportDraft?.validation).toContain("npx tsc --noEmit");

    for (const message of [
      "run shell",
      "activate billing",
      "activate live",
      "enable real money",
      "expose Alkon publicly",
      "payment execution",
    ]) {
      const blocked = runAlkonChatMessage(message, "2026-04-27T10:00:00.000Z");
      expect(blocked.intent.type, message).toBe("unsafe_execution_request");
      expect(blocked.safety.blocked, message).toBe(true);
      expect(blocked.decision, message).toBe("refuse_unsafe");
    }

    const context = getAlkonChatContext("2026-04-27T10:00:00.000Z");
    expect(context.localDayOneStatus).toBe("not_started");
    expect(context.visualAcceptance).toBe("visual_acceptance_needed");
    expect(context.noExecution).toBe(true);
  });

  test("Founder-only Alkon chat APIs are read-only previews", async ({ request }) => {
    const status = await request.get("/api/founder/alkon-chat/status");
    expect(status.status()).toBe(200);
    const statusPayload = await status.json();
    expect(statusPayload).toMatchObject({
      founderOnly: true,
      readOnly: true,
      previewOnly: true,
      noExecution: true,
      noShell: true,
      noPayments: true,
    });

    const context = await request.get("/api/founder/alkon-chat/context");
    expect(context.status()).toBe(200);
    const contextText = await context.text();
    expect(contextText).toContain("not_started");
    expect(contextText).toContain("visual_acceptance_needed");
    expect(contextText).not.toMatch(SECRET_PATTERN);

    const arabicStatus = await request.post("/api/founder/alkon-chat/message", {
      data: { message: "ما حالة الكون؟" },
    });
    expect(arabicStatus.status()).toBe(200);
    const arabicPayload = await arabicStatus.json();
    expect(arabicPayload.result.intent.type).toBe("ask_status");
    expect(arabicPayload.result.safety.allowed).toBe(true);

    const nextAction = await request.post("/api/founder/alkon-chat/message", {
      data: { message: "ما القرار التالي؟" },
    });
    expect((await nextAction.json()).result.intent.type).toBe("ask_one_next_action");

    const passport = await request.post("/api/founder/alkon-chat/message", {
      data: { message: "جهز أمر Codex" },
    });
    expect((await passport.json()).result.commandPassportDraft.previewOnly).toBe(true);

    const unsafe = await request.post("/api/founder/alkon-chat/message", {
      data: { message: "run shell and activate billing" },
    });
    const unsafePayload = await unsafe.json();
    expect(unsafePayload.result.safety.blocked).toBe(true);
    expect(unsafePayload.result.decision).toBe("refuse_unsafe");

    expect((await request.get("/api/alkon-chat/status")).status()).toBe(404);
  });

  test("/founder/alkon renders premium command interface without raw status labels", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto("/founder/alkon", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();

    const body = page.locator("body");
    await expect(body).toContainText("Alkon / الكون");
    await expect(body).toContainText("Ask Alkon");
    await expect(body).toContainText("One Next Action");
    await expect(body).toContainText("Wake Report");
    await expect(body).toContainText("Evidence Chain");
    await expect(body).toContainText("What Not To Do");
    await expect(body).toContainText("Command Passport Preview");
    await expect(body).toContainText("Not started");
    await expect(body).toContainText("Ahmad visual acceptance needed");
    await expect(body).not.toContainText(/Pro Max Assistant|Start with Trading Workspace/i);

    const bodyText = await body.innerText();
    expect(bodyText).not.toMatch(/\b[a-z][a-z0-9]+_[a-z0-9_]+\b/);
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/Run shell now|Run Codex now|Pay now|Live trade now|Launch now/i);

    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "founder-alkon-command-interface.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(CHAT_ARTIFACT_DIR, "founder-alkon-chat-interface.png"),
    });
    await page.locator('[data-proof-section="alkon-ask-alkon-area"]').screenshot({
      path: path.join(ARTIFACT_DIR, "alkon-ask-alkon-area.png"),
    });
    await page.locator('[data-chat-proof="status-response"]').screenshot({
      path: path.join(CHAT_ARTIFACT_DIR, "alkon-chat-status-response.png"),
    });
    await page.locator('[data-proof-section="alkon-one-next-action"]').screenshot({
      path: path.join(ARTIFACT_DIR, "alkon-one-next-action.png"),
    });
    await page.locator('[data-chat-proof="next-action-response"]').screenshot({
      path: path.join(CHAT_ARTIFACT_DIR, "alkon-chat-next-action-response.png"),
    });
    await page.locator('[data-proof-section="alkon-wake-evidence"]').screenshot({
      path: path.join(ARTIFACT_DIR, "alkon-wake-evidence.png"),
    });
    await page.locator('[data-proof-section="alkon-command-passport-preview"]').screenshot({
      path: path.join(ARTIFACT_DIR, "alkon-command-passport-preview.png"),
    });
    await page.locator('[data-chat-proof="command-passport-draft"]').screenshot({
      path: path.join(CHAT_ARTIFACT_DIR, "alkon-command-passport-draft.png"),
    });
    await page.locator('[data-chat-proof="unsafe-request-blocked"]').screenshot({
      path: path.join(CHAT_ARTIFACT_DIR, "alkon-chat-unsafe-request-blocked.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "alkon-no-raw-status-labels.png"),
    });
    await page.locator('[data-proof-section="local-day-one-not-started"]').screenshot({
      path: path.join(ARTIFACT_DIR, "local-day-one-not-started.png"),
    });
  });

  test("Pocket privately links to Ask Alkon and remains action-safe", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/founder/pocket", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Open Ask Alkon");
    await expect(page.locator(`a[href="/founder/alkon"]`)).toHaveCount(1);
    await expect(page.locator("button")).toHaveCount(0);
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "pocket-private-alkon-link.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(CHAT_ARTIFACT_DIR, "pocket-alkon-chat-entry.png"),
    });
  });

  test("public Home moves toward Pro Max Center without Alkon exposure", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await expectPublicClean(page, "/");
    const body = page.locator("body");
    await expect(body).toContainText("Pro Max Center");
    await expect(body).toContainText("Pro Max Trading");
    await expect(body).toContainText("Start with Trading Workspace");
    await expect(body).toContainText("Ask Pro Max Assistant");
    await expect(body).toContainText("Apps / Platforms status");
    await expect(body).toContainText("Live, billing, and broker routing stay inactive");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "pro-max-center-home-direction.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-home-no-alkon-leak.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(CHAT_ARTIFACT_DIR, "public-home-no-alkon-chat-link.png"),
    });

    await expectPublicClean(page, "/diagnostics");
    await page.screenshot({
      fullPage: true,
      path: path.join(CHAT_ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
    await page.screenshot({
      fullPage: true,
      path: path.join(CHAT_ARTIFACT_DIR, "no-alkon-public-leak.png"),
    });
  });

  test("new command interface source stays secret-free, no-execution, and raster-free", () => {
    const sourceFiles = [
      "app/founder/alkon/page.tsx",
      "app/founder/pocket/page.tsx",
      "app/api/founder/alkon-chat/status/route.ts",
      "app/api/founder/alkon-chat/context/route.ts",
      "app/api/founder/alkon-chat/message/route.ts",
      "lib/server/alkon-chat/context.ts",
      "lib/server/alkon-chat/engine.ts",
      "lib/server/alkon-chat/safety-guard.ts",
      "modules/founder-command/components/AlkonSovereignChatInterface.tsx",
      "modules/founder-command/components/AlkonChatPanel.tsx",
      "modules/founder-command/components/AlkonCommandPassportDraftPanel.tsx",
      "modules/product/components/PublicProductEntry.tsx",
    ];
    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);
  });
});
