import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "../../lib/constants/storage";
import {
  AHMAD_TWIN_FORBIDDEN_MEMORY,
  KERNEL_COMMAND_STATUSES,
  KERNEL_FORBIDDEN_EVOLUTION_WITHOUT_GATES,
  KERNEL_MEMORY_LESSONS,
  buildEvidenceChain,
  getAhmadFounderSource,
  getAhmadSovereignDigitalTwin,
  getAlkonKernelReadiness,
  getAlkonKernelSnapshot,
  getBuilderSelection,
  getCommandPassport,
  getCreatorRuntimeOath,
  getFounderFinalAuthority,
  getKernelOneNextAction,
  getLegalRealityGate,
  getLocalDayOneGate,
  getPublicTrustGate,
  getRealityOwnershipClassification,
  getReturnToHeartDecision,
  getTreasuryDiscipline,
  runRealityTrial,
} from "../../lib/server/alkon-kernel";

const ARTIFACT_DIR = path.join("test-results", "alkon-complete-kernel");
const SECRET_PATTERN =
  /sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|secret token value|password value|4242 4242 4242 4242|4111 1111 1111 1111/i;
const PUBLIC_FORBIDDEN_TERMS =
  /Alkon Kernel|Creator-Runtime|Founder Source|Ahmad Digital Twin|Zero Truth|Reality Trial|Kernel Commands|Internal law|Alkon|ط§ظ„ظƒظˆظ†|Founder Command|Evidence Chain|Memory Law|Station Governance|Treasury internals|Product Memory internals|Codex tasks|Task Passport|Result Tribunal|Risk Belt|Black Hole Zone|internal governance/i;

async function openPublicSafe(page: Page, pathName: string) {
  await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ envKey, themeKey }) => {
      window.localStorage.clear();
      window.localStorage.setItem(themeKey, "dark");
      window.localStorage.setItem(envKey, "adaptive");
    },
    {
      envKey: ENVIRONMENT_MODE_STORAGE_KEY,
      themeKey: THEME_STORAGE_KEY,
    }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("main").first()).toBeVisible();
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(PUBLIC_FORBIDDEN_TERMS);
  await expect(page.locator("img")).toHaveCount(0);
}

function collectFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(root, entry.name);

    if (entry.isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

test.describe("Alkon Complete Sovereign Kernel", () => {
  test.beforeAll(() => {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  });

  test("documents the complete private kernel doctrine", () => {
    const requiredDocs = [
      "docs/product/alkon-complete-sovereign-kernel-core.md",
      "docs/product/alkon-rule-minus-one-founder-source.md",
      "docs/product/alkon-command-0-creator-runtime-oath.md",
      "docs/product/alkon-command-1-zero-truth.md",
      "docs/product/alkon-command-2-reality-ownership.md",
      "docs/product/alkon-command-3-reality-trial.md",
      "docs/product/alkon-command-4-evidence-chain.md",
      "docs/product/alkon-command-5-memory-law.md",
      "docs/product/alkon-command-6-return-to-heart.md",
      "docs/product/alkon-command-7-one-next-action.md",
      "docs/product/alkon-command-8-command-passport.md",
      "docs/product/alkon-command-9-builder-selection.md",
      "docs/product/alkon-command-10-daily-operating-loop.md",
      "docs/product/alkon-command-11-infinite-governed-evolution.md",
      "docs/product/alkon-command-12-founder-final-authority.md",
      "docs/product/alkon-command-13-treasury-discipline.md",
      "docs/product/alkon-command-14-legal-reality-gate.md",
      "docs/product/alkon-command-15-public-trust-gate.md",
      "docs/product/alkon-command-16-local-day-one-gate.md",
      "docs/product/ahmad-sovereign-digital-twin-foundation.md",
      "docs/product/alkon-kernel-index.md",
    ];

    for (const docPath of requiredDocs) {
      expect(fs.existsSync(path.join(process.cwd(), docPath)), docPath).toBe(true);
    }
  });

  test("kernel snapshot is deterministic, private, and complete from Command 0 to 16", () => {
    const checkedAt = "2026-04-27T08:00:00.000Z";
    const first = getAlkonKernelSnapshot(checkedAt);
    const second = getAlkonKernelSnapshot(checkedAt);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      checkedAt,
      mode: "alkon_complete_sovereign_kernel",
      status: "active_with_notes",
      visibility: "private_founder_only",
      founderOnly: true,
      readOnly: true,
      publicExposure: false,
      noExecution: true,
      publicExposureStatus: {
        publicUiVisible: false,
        publicApiRoutesExposed: false,
        publicNavigationVisible: false,
        diagnosticsLeak: false,
        kernelDoctrinePublic: false,
      },
    });
    expect(first.commandStatuses.map((command) => command.commandId)).toEqual([
      "command_0_creator_runtime_oath",
      "command_1_zero_truth",
      "command_2_reality_ownership",
      "command_3_reality_trial",
      "command_4_evidence_chain",
      "command_5_memory_law",
      "command_6_return_to_heart",
      "command_7_one_next_action",
      "command_8_command_passport",
      "command_9_builder_selection",
      "command_10_daily_operating_loop",
      "command_11_infinite_governed_evolution",
      "command_12_founder_final_authority",
      "command_13_treasury_discipline",
      "command_14_legal_reality_gate",
      "command_15_public_trust_gate",
      "command_16_local_day_one_gate",
    ]);
    expect(KERNEL_COMMAND_STATUSES).toHaveLength(17);
  });

  test("Founder Source and digital twin store no raw sensitive data in code", () => {
    const source = getAhmadFounderSource();
    const twin = getAhmadSovereignDigitalTwin();
    const oath = getCreatorRuntimeOath();

    expect(source).toMatchObject({
      name: "Ahmad",
      role: "Founder Source",
      authority: "final_sensitive_authority",
      owns: "Alkon",
      publicExposure: false,
    });
    expect(twin).toMatchObject({
      publicExposure: false,
      sensitiveDataStoredInCode: false,
      rawPersonalDataStored: false,
      founderAuthorityRequiredForSensitiveActions: true,
      futureSensitiveDataRequiresEncryptedVault: true,
    });
    expect(AHMAD_TWIN_FORBIDDEN_MEMORY).toEqual(
      expect.arrayContaining([
        "passport numbers",
        "bank details",
        "card numbers",
        "API keys",
        "tokens",
        "raw biometric data",
        "precise home address",
      ])
    );
    expect(oath).toMatchObject({
      privateOnly: true,
      publicExposureAllowed: false,
      noExecutionByItself: true,
      unsafeActivationBlocked: true,
      sensitiveActionRequiresAhmad: true,
    });
  });

  test("reality ownership, trial, evidence, memory, and heart gates enforce truth", () => {
    const ownership = getRealityOwnershipClassification();
    expect(ownership.layers.map((layer) => layer.layer)).toEqual([
      "public_pro_max_reality",
      "private_alkon_universe",
      "invisible_operating_layer",
    ]);
    expect(ownership.publicReceivesSanitizedTruthOnly).toBe(true);

    const noEvidenceTrial = runRealityTrial({
      productTruth: true,
      safety: true,
      law: true,
      finance: true,
    });
    expect(noEvidenceTrial.outcome).toBe("needs_evidence");

    const unsafeTrial = runRealityTrial({ productTruth: false });
    expect(unsafeTrial.outcome).toBe("blocked");

    const evidence = buildEvidenceChain();
    expect(evidence.evidenceStatus).toBe("needs_proof");
    expect(evidence.closureAllowed).toBe(false);
    expect(evidence.dirtyGitBlocksClosure).toBe(true);

    expect(KERNEL_MEMORY_LESSONS).toEqual(
      expect.arrayContaining([
        "Ahmad is Founder Source",
        "Alkon is private creator-runtime",
        "No raw sensitive data in code",
        "Zero Truth is not deletion",
        "Chart is heart",
        "No public Alkon",
        "No Local Day One without Ahmad visual acceptance",
      ])
    );

    expect(getReturnToHeartDecision({ p0Blocker: true }).decision).toBe("block");
    expect(getReturnToHeartDecision({ futureExpansion: true }).decision).toBe(
      "delay"
    );
  });

  test("one next action, command passport, builder selection, and daily loop stay governed", () => {
    expect(getKernelOneNextAction().oneNextAction).toBe(
      "Ask Ahmad to visually accept or reject the current Pro Max public and Trading Workspace baseline."
    );
    expect(getKernelOneNextAction().founderDecisionNeeded).toBe(true);
    expect(getKernelOneNextAction({ commandRunning: true }).oneNextAction).toBe(
      "Wait for the current command Wake Report."
    );

    const passport = getCommandPassport();
    expect(passport).toMatchObject({
      passportStatus: "preview_ready",
      screenshotsRequired: true,
      noExecution: true,
    });
    expect(passport.validationRequired).toEqual(
      expect.arrayContaining([
        "npx tsc --noEmit",
        "npm run test:regression",
        "git status --short",
      ])
    );
    expect(passport.wakeReportFormat).toEqual(
      expect.arrayContaining(["Status", "Mission", "Commit", "Clean", "Next"])
    );

    const builders = getBuilderSelection({ visual: true });
    expect(builders.recommendedBuilder).toBe("Manual Ahmad Review");
    expect(builders.codexIsBuilderNotLeader).toBe(true);
    expect(builders.builders.find((builder) => builder.builder === "Codex Builder")).toMatchObject({
      leader: false,
      allowed: true,
    });
  });

  test("treasury, legal, public trust, infinite evolution, and Local Day One block unsafe activation", () => {
    const treasury = getTreasuryDiscipline();
    expect(treasury).toMatchObject({
      treasuryStatus: "readiness_only",
      bankCardDataInCode: false,
      paymentExecutionFromApp: false,
      ahmadApprovalRequiredForPayment: true,
    });

    const legal = getLegalRealityGate();
    expect(legal.legalStatus).toBe("needs_review");
    expect(legal.requiredReview).toEqual(
      expect.arrayContaining([
        "legal/accounting/refund/support gates",
        "financial services and FINMA review if applicable",
      ])
    );

    expect(getPublicTrustGate({ fakeClaims: true }).publicTrustStatus).toBe(
      "blocked"
    );
    expect(KERNEL_FORBIDDEN_EVOLUTION_WITHOUT_GATES).toEqual(
      expect.arrayContaining([
        "public launch",
        "billing",
        "broker/feed",
        "live execution",
        "real money",
        "secrets exposure",
        "public Alkon",
      ])
    );
    expect(getFounderFinalAuthority("Local Day One start")).toMatchObject({
      founderDecisionRequired: true,
    });
    expect(getLocalDayOneGate().localDayOneStatus).toBe("not_ready");
    expect(getLocalDayOneGate().startsAutomatically).toBe(false);
  });

  test("Founder Command and Alkon receive kernel snapshot through private read APIs", async ({
    request,
  }) => {
    for (const route of [
      "/api/founder/alkon-kernel/readiness",
      "/api/founder/alkon-kernel/snapshot",
      "/api/founder/alkon-kernel/commands",
      "/api/founder/alkon-kernel/one-next-action",
      "/api/founder/alkon-kernel/local-day-one",
    ]) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const text = await response.text();
      expect(text).toMatch(/founderOnly|readOnly|noExecution/);
      expect(text).not.toMatch(SECRET_PATTERN);
    }

    expect((await request.get("/api/alkon-kernel")).status()).toBe(404);
    expect((await request.get("/api/alkon/kernel")).status()).toBe(404);

    const founder = await (
      await request.get("/api/founder/command/snapshot")
    ).json();
    expect(founder.snapshot.alkonKernel).toMatchObject({
      mode: "alkon_complete_sovereign_kernel",
      publicExposure: false,
      status: "active_with_notes",
    });
    expect(founder.snapshot.apiReadiness).toEqual(
      expect.arrayContaining([
        "/api/founder/alkon-kernel/readiness",
        "/api/founder/alkon-kernel/snapshot",
        "/api/founder/alkon-kernel/commands",
        "/api/founder/alkon-kernel/one-next-action",
        "/api/founder/alkon-kernel/local-day-one",
      ])
    );

    const alkon = await (await request.get("/api/founder/alkon/readiness")).json();
    expect(alkon.snapshot.kernel).toMatchObject({
      mode: "alkon_complete_sovereign_kernel",
      publicExposure: false,
      status: "active_with_notes",
    });
    expect(alkon.snapshot.apiExposure).toMatchObject({
      founderKernelReadinessRoute: "/api/founder/alkon-kernel/readiness",
      founderKernelSnapshotRoute: "/api/founder/alkon-kernel/snapshot",
    });
  });

  test("public UI does not expose kernel, Alkon, Zero Truth, or internal terms", async ({
    page,
  }) => {
    await openPublicSafe(page, "/");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "public-entry-dark.png"),
    });

    await openPublicSafe(page, "/diagnostics");
    await page.screenshot({
      fullPage: true,
      path: path.join(ARTIFACT_DIR, "diagnostics-public-safe.png"),
    });
  });

  test("implementation remains code-only, secret-free, non-executing, and no-raster", () => {
    const readiness = getAlkonKernelReadiness("2026-04-27T08:00:00.000Z");
    expect(readiness).toMatchObject({
      founderOnly: true,
      readOnly: true,
      noExecution: true,
      noShellExecution: true,
      noPayments: true,
      noExternalCalls: true,
      noSecrets: true,
      noPublicApi: true,
    });
    expect(readiness.productTruthStatus).toMatchObject({
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      noShellExecutionFromWebApp: true,
      noSecretsExposed: true,
      noImagesOrRasterAssets: true,
      noPublicAlkonKernelExposure: true,
    });

    const sourceFiles = [
      "lib/server/alkon-kernel/types.ts",
      "lib/server/alkon-kernel/founder-source.ts",
      "lib/server/alkon-kernel/ahmad-digital-twin.ts",
      "lib/server/alkon-kernel/creator-runtime-oath.ts",
      "lib/server/alkon-kernel/zero-truth.ts",
      "lib/server/alkon-kernel/reality-ownership.ts",
      "lib/server/alkon-kernel/reality-trial.ts",
      "lib/server/alkon-kernel/evidence-chain.ts",
      "lib/server/alkon-kernel/memory-law.ts",
      "lib/server/alkon-kernel/return-to-heart.ts",
      "lib/server/alkon-kernel/one-next-action.ts",
      "lib/server/alkon-kernel/command-passport.ts",
      "lib/server/alkon-kernel/builder-selection.ts",
      "lib/server/alkon-kernel/daily-operating-loop.ts",
      "lib/server/alkon-kernel/infinite-governed-evolution.ts",
      "lib/server/alkon-kernel/founder-authority.ts",
      "lib/server/alkon-kernel/treasury-discipline.ts",
      "lib/server/alkon-kernel/legal-reality-gate.ts",
      "lib/server/alkon-kernel/public-trust-gate.ts",
      "lib/server/alkon-kernel/local-day-one-gate.ts",
      "lib/server/alkon-kernel/state.ts",
      "lib/server/alkon-kernel/engine.ts",
      "lib/server/alkon-kernel/index.ts",
      "app/api/founder/alkon-kernel/readiness/route.ts",
      "app/api/founder/alkon-kernel/snapshot/route.ts",
      "app/api/founder/alkon-kernel/commands/route.ts",
      "app/api/founder/alkon-kernel/one-next-action/route.ts",
      "app/api/founder/alkon-kernel/local-day-one/route.ts",
      "modules/founder-command/components/AlkonKernelPanel.tsx",
      "modules/founder-command/components/AlkonFounderSourcePanel.tsx",
      "modules/founder-command/components/AlkonCreatorRuntimePanel.tsx",
      "modules/founder-command/components/AlkonKernelZeroTruthPanel.tsx",
      "modules/founder-command/components/AlkonRealityTrialPanel.tsx",
      "modules/founder-command/components/AlkonKernelCommandsPanel.tsx",
      "modules/founder-command/components/AlkonLocalDayOneGatePanel.tsx",
    ];

    const source = sourceFiles
      .map((filePath) => fs.readFileSync(path.join(process.cwd(), filePath), "utf8"))
      .join("\n");

    expect(source).not.toMatch(SECRET_PATTERN);
    expect(source).not.toMatch(/<img|\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)/i);
    expect(source).not.toMatch(/child_process|execSync|spawnSync|eval\(|new Function/);
    expect(source).not.toMatch(/fetch\(["']https?:\/\//i);
    expect(source).not.toMatch(/liveExecutionActive:\s*true/);
    expect(source).not.toMatch(/billingActivationActive:\s*true/);
    expect(source).not.toMatch(/brokerFeedActivationActive:\s*true/);
    expect(source).not.toMatch(/realMoneyRoutingActive:\s*true/);

    const rasterFiles = ["app", "modules", "lib", "public"]
      .flatMap((sourceDir) => collectFiles(path.join(process.cwd(), sourceDir)))
      .filter((fileName) => /\.(png|jpe?g|webp|gif|avif|mp4|mov|webm)$/i.test(fileName));

    expect(rasterFiles).toEqual([]);
  });
});
