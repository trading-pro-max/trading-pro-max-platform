import "server-only";

import type { AlKawnDesktopLayer } from "./types";

export function getAlKawnDesktopLayerState(): AlKawnDesktopLayer[] {
  return [
    { id: "ahmad_human", label: "Ahmad Human", status: "protected", meaning: "Origin and final founder decision authority.", boundary: "Ahmad decides final matters." },
    { id: "ahmad_devices", label: "Ahmad Private Devices", status: "protected", meaning: "Private device context where الكون runs.", boundary: "private_only" },
    { id: "al_kawn", label: "الكون", status: "active", meaning: "Ahmad private electronic self.", boundary: "private_only" },
    { id: "product_truth", label: "Product Truth", status: "protected", meaning: "Highest truth law.", boundary: "truth_guarded" },
    { id: "kernel", label: "Universe Operating Kernel", status: "checked", meaning: "Execution judge.", boundary: "kernel_enforced" },
    { id: "vault", label: "Ahmad Digital Vault", status: "future_gate", meaning: "Private documents, memory, and decision vault concept.", boundary: "secret_guarded" },
    { id: "protection", label: "Protection Core", status: "protected", meaning: "Permissions, audit, kill switch, and secret protection.", boundary: "blocked_if_truth_breaks" },
    { id: "universe_one", label: "Universe One", status: "active", meaning: "Literal living reality system.", boundary: "simulation_labeled" },
    { id: "swiss", label: "Swiss Local Constitution", status: "protected", meaning: "Local order above Global Layer.", boundary: "legal_stop" },
    { id: "human_interface", label: "Human Interface", status: "active", meaning: "Ahmad command/chat surface.", boundary: "private_only" },
    { id: "infinity", label: "Infinity Mode", status: "future_gate", meaning: "Future growth mode.", boundary: "blocked_until_preparation" },
    { id: "operator", label: "Operator Mode", status: "future_gate", meaning: "Future operational mode.", boundary: "blocked_until_preparation" },
    { id: "self_building", label: "Self-Building", status: "future_gate", meaning: "Future-governed internal build capability.", boundary: "kernel_and_ahmad_gated" },
    { id: "pro_max_galaxy", label: "Pro Max Galaxy", status: "active", meaning: "Product galaxy inside الكون.", boundary: "private_now_public_future" },
    { id: "earth_planet", label: "Earth Planet", status: "active", meaning: "First planet and complete trading project.", boundary: "demo_safe" },
    { id: "trading", label: "/trading", status: "protected", meaning: "Trading surface on Earth Planet.", boundary: "read_only_demo_safe" },
    { id: "global_layer", label: "Global Layer", status: "future_gate", meaning: "Future global layer under Swiss Local Constitution.", boundary: "legal_stop" },
    { id: "public_pro_max", label: "Public Pro Max Future", status: "blocked", meaning: "Future public product surface.", boundary: "public_block" },
    { id: "alkon", label: "ALKON Background Guardian", status: "protected", meaning: "Private background guardian only.", boundary: "private_background" },
  ];
}
