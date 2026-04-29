import "server-only";

import { createControlAction } from "./control-actions";
import type { AlKawnControlSurface } from "./types";

const direct = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "execute_directly", detail);
const legal = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "stop_for_legal", detail);
const money = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "stop_for_money", detail);
const blockedTruth = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "blocked_product_truth", detail);
const blockedSecurity = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "blocked_security", detail);
const future = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "future_gate", detail);
const evidence = (id: string, label: string, detail: string) =>
  createControlAction(id, label, "needs_more_evidence", detail);

export const alKawnControlSurfaceRegistry: AlKawnControlSurface[] = [
  {
    id: "root_constitution",
    label: "Root / Constitution Control Surface",
    arabicLabel: "سطح تحكم الجذر والدستور",
    ownerLayer: "Ahmad Human -> الكون",
    status: "protected",
    purpose: "Keeps Ahmad as origin, الكون private extension, Product Truth highest law, and root law status visible.",
    visibleState: [
      "Ahmad origin: protected",
      "الكون private extension: active",
      "Product Truth highest law: protected",
      "Root law status: protected",
    ],
    directInternalActions: [
      direct("root-review-law", "Review root law", "Read and summarize root law internally."),
      direct("root-map-origin", "Map origin to layer", "Explain how a layer returns to Ahmad as origin."),
    ],
    legalStopActions: [
      legal("root-official-claim", "Official/legal claim", "Any official legal position stops for Ahmad."),
    ],
    moneyStopActions: [
      money("root-money-state", "Money state change", "Any money/payment state change stops for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("root-public-kawn", "Public الكون exposure", "Public الكون contradicts Product Truth."),
      blockedSecurity("root-secret-release", "Secret release", "Secrets cannot leave Ahmad control."),
    ],
    productTruthImpact: "Product Truth remains the highest law and blocks public/private contradictions.",
    nextSafeAction: "Keep root law visible and use it before any new layer enters الكون.",
    relatedRoute: "/founder/universe",
    relatedReport: "reports/al-kawn-ontological-operating-law.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "kernel",
    label: "Kernel Control Surface",
    arabicLabel: "سطح تحكم النواة",
    ownerLayer: "Universe Operating Kernel",
    status: "active_with_notes",
    purpose: "Shows the execution judge, action verdicts, legal/money gates, and Product Truth enforcement.",
    visibleState: [
      "Universe Operating Kernel: canonicalized",
      "Execution judge: active",
      "Legal/money gates: approval-gated",
      "Product Truth enforcement: active",
    ],
    directInternalActions: [
      direct("kernel-check", "Check kernel state", "Read current kernel readiness and guards."),
      direct("kernel-plan", "Generate safe next action", "Prepare a safe internal next action."),
    ],
    legalStopActions: [
      legal("kernel-legal-verdict", "Legal verdict", "Legal claims require Ahmad and qualified review."),
    ],
    moneyStopActions: [
      money("kernel-money-verdict", "Money verdict", "Money, billing, broker, and receiving funds stop for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("kernel-disable-truth", "Disable Product Truth", "The kernel cannot disable Product Truth."),
      blockedSecurity("kernel-public-execution", "Public execution", "Private kernel execution cannot be public."),
    ],
    productTruthImpact: "Kernel decisions must preserve Product Truth before any execution.",
    nextSafeAction: "Use kernel verdicts to classify every control-surface action.",
    relatedRoute: "/founder/universe",
    relatedReport: "reports/existing-kernel-canonicalization-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "product_truth",
    label: "Product Truth Control Surface",
    arabicLabel: "سطح تحكم Product Truth",
    ownerLayer: "Product Truth",
    status: "protected",
    purpose: "Keeps launch, billing, payments, real money, broker, legal, ALKON, and الكون truth visible.",
    visibleState: [
      "public launch blocked",
      "billing inactive",
      "payments inactive",
      "real money disabled",
      "broker disabled/not connected",
      "legal review pending",
      "ALKON private/background",
      "الكون private",
    ],
    directInternalActions: [
      direct("truth-check", "Check Product Truth visibility", "Verify Product Truth remains visible."),
      direct("truth-detect-forbidden", "Detect forbidden claims", "Scan for unsafe claims internally."),
    ],
    legalStopActions: [
      legal("truth-legal-approved", "Legal approval wording", "Legal approval claims require review and Ahmad."),
    ],
    moneyStopActions: [
      money("truth-billing-active", "Billing/payment activation", "Billing and payments stop for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("truth-public-launch-active", "Public launch active claim", "Blocked because public launch is not started."),
      blockedTruth("truth-real-money-enabled", "Real money enabled claim", "Blocked because real money is disabled."),
    ],
    productTruthImpact: "This surface is the visible control point for truth enforcement.",
    nextSafeAction: "Keep the Product Truth strip visible across private and trading surfaces.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/al-kawn-unified-visual-identity-system.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "visual_map",
    label: "Visual Map Control Surface",
    arabicLabel: "سطح تحكم الخريطة البصرية",
    ownerLayer: "Al-Kawn Visual Map",
    status: "active",
    purpose: "Controls hierarchy map status, layer ownership, canonical tree, and unified visual identity status.",
    visibleState: [
      "hierarchy map status: active",
      "layer ownership: visible",
      "canonical tree: protected",
      "visual identity status: unified",
    ],
    directInternalActions: [
      direct("map-review", "Review layer ownership", "Read layer ownership and boundary explanations."),
      direct("map-explain", "Explain selected node", "Explain a node from origin to product impact."),
    ],
    legalStopActions: [
      legal("map-legal-position", "Legal hierarchy claim", "Legal hierarchy claims stop for Ahmad."),
    ],
    moneyStopActions: [
      money("map-money-layer", "Money layer activation", "Money layer activation stops for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("map-pro-max-owns-kawn", "Pro Max owns الكون", "Blocked because Pro Max Galaxy is inside الكون."),
      blockedTruth("map-alkon-second", "ALKON second layer", "Blocked because ALKON is private/background."),
    ],
    productTruthImpact: "Prevents hierarchy drift that would hide Product Truth.",
    nextSafeAction: "Use the visual map as the layer reference for all control surfaces.",
    relatedRoute: "/founder/universe",
    relatedReport: "reports/al-kawn-visual-map-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "reality_universe_one",
    label: "Reality / Universe One Control Surface",
    arabicLabel: "سطح تحكم Universe One والواقع",
    ownerLayer: "Universe One",
    status: "active_with_notes",
    purpose: "Shows device time, device date, day/night, season, weather, location, and soundscape truth.",
    visibleState: [
      "device time: active source",
      "device date: active source",
      "day/night: device-time simulation",
      "season: device-date simulation",
      "weather not connected",
      "location not requested",
      "soundscape off/user controlled",
    ],
    directInternalActions: [
      direct("reality-read", "Read device-time reality", "Use device clock/date simulation labels."),
      direct("reality-label", "Show source labels", "Keep real/simulated/not-connected labels visible."),
    ],
    legalStopActions: [
      legal("reality-exact-sun", "Exact sun/legal claim", "Exact physical claims require real implementation and review."),
    ],
    moneyStopActions: [
      money("reality-paid-feed", "Paid data/weather feed", "Paid provider activation stops for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("reality-real-weather", "Real weather active claim", "Blocked because weather is not connected."),
      blockedSecurity("reality-location", "User location active", "Blocked because location is not requested."),
    ],
    productTruthImpact: "Reality labels keep simulations honest and prevent fake external claims.",
    nextSafeAction: "Keep Universe One source labels visible in desktop and founder surfaces.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/literal-realism-standard-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "protection_vault",
    label: "Protection / Vault Control Surface",
    arabicLabel: "سطح تحكم الحماية والخزنة",
    ownerLayer: "Protection Core + Ahmad Digital Vault",
    status: "protected",
    purpose: "Controls no-secrets rules, vault concept, Protection Core, sensitive data boundaries, and kill switch concept.",
    visibleState: [
      "no secrets in Git",
      "no secrets in app bundle",
      "vault concept: future protected",
      "Protection Core: protected",
      "sensitive data boundaries: active",
      "kill switch: protected concept",
    ],
    directInternalActions: [
      direct("protection-audit", "Audit protection notes", "Review non-sensitive protection state."),
      direct("vault-policy", "Show vault policy", "Show local-first vault policy without storing documents."),
    ],
    legalStopActions: [
      legal("vault-legal-doc", "Legal document handling", "Legal document processing stops for Ahmad."),
    ],
    moneyStopActions: [
      money("vault-bank-secret", "Bank/payment secrets", "Bank and payment credentials stop for Ahmad."),
    ],
    blockedActions: [
      blockedSecurity("vault-secrets-git", "Secrets in Git", "Secrets in Git are blocked."),
      blockedSecurity("vault-public-docs", "Private documents in public assets", "Private documents cannot be exposed."),
    ],
    productTruthImpact: "Protects private systems from external exposure or secret leakage.",
    nextSafeAction: "Keep vault as planned/protected until Ahmad approves a storage design.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/absolute-founder-boundary-100.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "swiss_local_constitution",
    label: "Swiss Local Constitution Control Surface",
    arabicLabel: "سطح تحكم الدستور المحلي السويسري",
    ownerLayer: "Swiss Local Constitution",
    status: "protected",
    purpose: "Keeps Swiss-first rule, Swiss legal review pending, Global Layer below Swiss, and no FINMA claim visible.",
    visibleState: [
      "Swiss-first rule: protected",
      "Swiss legal review pending",
      "Global Layer below Swiss",
      "no FINMA claim",
      "Swiss-inspired visual identity only",
    ],
    directInternalActions: [
      direct("swiss-review-status", "Review Swiss pending status", "Show pending legal-review state."),
      direct("swiss-visual-label", "Show Swiss-inspired label", "Keep Swiss-inspired visual language honest."),
    ],
    legalStopActions: [
      legal("swiss-finma", "FINMA/licensed claim", "FINMA, licensed, regulated, or certified claims stop for Ahmad."),
      legal("swiss-legal-review", "Swiss legal review", "Swiss legal review requires qualified manual review."),
    ],
    moneyStopActions: [
      money("swiss-money-service", "Swiss money service", "Money services stop for Ahmad and review gates."),
    ],
    blockedActions: [
      blockedTruth("swiss-certified", "Swiss certified claim", "Blocked because no Swiss certification is verified."),
      blockedTruth("swiss-government", "Swiss government endorsement", "Blocked because there is no endorsement."),
    ],
    productTruthImpact: "Prevents official Swiss, FINMA, legal, or regulatory overclaims.",
    nextSafeAction: "Keep Swiss Local Constitution above Global Layer and pending.",
    relatedRoute: "/founder/universe",
    relatedReport: "reports/private-universe-public-promax-layering-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "human_interface",
    label: "Human Interface Control Surface",
    arabicLabel: "سطح تحكم الواجهة الإنسانية",
    ownerLayer: "Human Interface",
    status: "active",
    purpose: "Controls chat interface state, quick actions, decision center, task center, and appointment placeholder.",
    visibleState: [
      "chat interface: local-safe",
      "quick actions: visible",
      "decision center: active",
      "task center: active",
      "appointment placeholder: local-first",
    ],
    directInternalActions: [
      direct("human-chat", "Use private chat surface", "Show local-safe command prompts and blocked explanations."),
      direct("human-task", "Organize internal tasks", "Organize non-sensitive internal tasks."),
    ],
    legalStopActions: [
      legal("human-legal-task", "Legal task decision", "Legal tasks stop for Ahmad."),
    ],
    moneyStopActions: [
      money("human-money-task", "Money task decision", "Money tasks stop for Ahmad."),
    ],
    blockedActions: [
      blockedSecurity("human-calendar-connect", "External calendar connection", "External accounts require Ahmad approval."),
      blockedTruth("human-public-command", "Public command surface", "Public الكون command is blocked."),
    ],
    productTruthImpact: "Keeps Ahmad-facing commands classified before action.",
    nextSafeAction: "Use Human Interface to review safe control actions only.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/al-kawn-desktop-operating-environment.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "pro_max_galaxy",
    label: "Pro Max Galaxy Control Surface",
    arabicLabel: "سطح تحكم Pro Max Galaxy",
    ownerLayer: "Pro Max Galaxy",
    status: "active_with_notes",
    purpose: "Controls Pro Max Galaxy inside الكون, future public product truth, Brand Gate ready_with_notes, and working-name-only status.",
    visibleState: [
      "Pro Max Galaxy inside الكون",
      "future public product: blocked",
      "Brand Gate ready_with_notes",
      "Pro Max working_name_only",
      "global approval false",
    ],
    directInternalActions: [
      direct("galaxy-review", "Review Pro Max Galaxy status", "Show product container and gate state."),
      direct("galaxy-roadmap", "Draft internal roadmap", "Draft safe non-public product tasks."),
    ],
    legalStopActions: [
      legal("galaxy-brand-adoption", "Brand adoption", "Brand adoption, trademark, and ownership claims stop for Ahmad."),
    ],
    moneyStopActions: [
      money("galaxy-billing", "Billing/product money", "Billing and receiving money stop for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("galaxy-public-launch", "Public Pro Max launch active", "Blocked until all gates close."),
      blockedTruth("galaxy-global-approved", "Global approval claim", "Blocked because global approval is false."),
    ],
    productTruthImpact: "Keeps Pro Max future-public truth separate from private الكون.",
    nextSafeAction: "Continue private review without brand adoption or public launch.",
    relatedRoute: "/",
    relatedReport: "reports/final-private-universe-public-promax-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "earth_trading",
    label: "Earth Planet / Trading Control Surface",
    arabicLabel: "سطح تحكم Earth Planet والتداول",
    ownerLayer: "Earth Planet",
    status: "active_with_notes",
    purpose: "Controls Earth Planet trading project, /trading status, demo-safe/read-only mode, real money disabled, and broker disabled.",
    visibleState: [
      "Earth Planet trading project",
      "/trading status: available",
      "Trading: demo-safe/read-only",
      "real money disabled",
      "broker execution disabled/not connected",
    ],
    directInternalActions: [
      direct("earth-review", "Review trading surface", "Review demo-safe /trading UI and Product Truth."),
      direct("earth-paper-plan", "Prepare paper-safe plan", "Prepare non-executing trading review tasks."),
    ],
    legalStopActions: [
      legal("earth-investment-advice", "Investment advice claim", "Investment advice claims stop for Ahmad and review."),
    ],
    moneyStopActions: [
      money("earth-real-trade", "Real-money trading", "Real trading and broker execution stop for Ahmad."),
      money("earth-broker-key", "Broker API key", "Broker key activation stops for Ahmad."),
    ],
    blockedActions: [
      blockedTruth("earth-live-broker", "Live broker active claim", "Blocked because broker execution is disabled/not connected."),
      blockedTruth("earth-guarantee", "Guaranteed profit or risk-free claim", "Blocked by Product Truth."),
    ],
    productTruthImpact: "Keeps trading professional, demo-safe, read-only, and non-advisory.",
    nextSafeAction: "Keep /trading chart-first while exposing compact Earth Control status.",
    relatedRoute: "/trading",
    relatedReport: "reports/trading-premium-visual-realism-closure.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "reports_tasks_decisions",
    label: "Reports / Tasks / Decisions Control Surface",
    arabicLabel: "سطح تحكم التقارير والمهام والقرارات",
    ownerLayer: "Reports, Tasks, Decisions",
    status: "active",
    purpose: "Controls latest WAKE REPORT, reports list, tasks, decisions, and next safe action.",
    visibleState: [
      "latest WAKE REPORT: tracked by reports",
      "reports list: visible",
      "tasks: organized",
      "decisions: classified",
      "next safe action: visible",
    ],
    directInternalActions: [
      direct("reports-list", "List reports", "Show non-sensitive reports and validation status."),
      direct("tasks-generate", "Generate safe tasks", "Create internal task drafts without external execution."),
    ],
    legalStopActions: [
      legal("reports-legal-decision", "Legal decision report", "Legal final decisions stop for Ahmad."),
    ],
    moneyStopActions: [
      money("reports-money-decision", "Money decision report", "Money final decisions stop for Ahmad."),
    ],
    blockedActions: [
      blockedSecurity("reports-sensitive", "Expose sensitive reports", "Sensitive reports cannot be public."),
      blockedTruth("reports-fake-complete", "Fake completion", "Reports cannot fake validation or closure."),
    ],
    productTruthImpact: "Reports and tasks must document truth without claiming future gates are closed.",
    nextSafeAction: "Keep reports factual and route next actions through Ahmad-approved missions.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/al-kawn-desktop-operating-environment.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
  {
    id: "future_automation",
    label: "Future Automation Control Surface",
    arabicLabel: "سطح تحكم الأتمتة المستقبلية",
    ownerLayer: "Infinity / Operator / Self-Building / Local Day One",
    status: "future",
    purpose: "Keeps Infinity Mode future/blocked, Operator Mode future/blocked, Self-Building future-governed, and Local Day One not started.",
    visibleState: [
      "Infinity Mode future/blocked",
      "Operator Mode future/blocked",
      "Self-Building future-governed",
      "Local Day One not started",
      "automation gated by Product Truth",
    ],
    directInternalActions: [
      direct("automation-readiness", "Review future automation readiness", "Read readiness only; do not start modes."),
      evidence("automation-evidence", "Collect more evidence", "Collect evidence before future automation preparation."),
    ],
    legalStopActions: [
      legal("automation-legal", "Legal automation", "Legal automation decisions stop for Ahmad."),
    ],
    moneyStopActions: [
      money("automation-money", "Money automation", "Money automation stops for Ahmad."),
    ],
    blockedActions: [
      future("automation-infinity", "Start Infinity Mode", "Future gate; not active in this mission."),
      future("automation-operator", "Start Operator Mode", "Future gate; not active in this mission."),
      blockedTruth("automation-autonomous-live", "Fully autonomous live trading", "Blocked by Product Truth."),
    ],
    productTruthImpact: "Prevents future automation from starting before control surfaces, gates, and Ahmad approval.",
    nextSafeAction: "Prepare only after Ahmad accepts control surfaces.",
    relatedRoute: "/desktop/kawn",
    relatedReport: "reports/al-kawn-control-surfaces.md",
    relatedTest: "tests/regression/al-kawn-control-surfaces.spec.ts",
  },
];
