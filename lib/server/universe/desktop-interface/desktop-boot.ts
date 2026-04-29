import "server-only";

import type { AlKawnDesktopBootStep } from "./types";

export function getAlKawnDesktopBootState(): AlKawnDesktopBootStep[] {
  return [
    {
      id: "ahmad_private_device_context",
      order: 1,
      label: "Ahmad Private Device context",
      status: "checked",
      detail: "Booting الكون private operating environment on a private Ahmad device context.",
    },
    {
      id: "al_kawn_private_mode",
      order: 2,
      label: "الكون private mode",
      status: "active",
      detail: "الكون هو نسخة أحمد الإلكترونية الخاصة and remains private to Ahmad devices.",
    },
    {
      id: "product_truth_loaded",
      order: 3,
      label: "Product Truth loaded",
      status: "checked",
      detail: "Product Truth loaded; public launch, billing, payments, real money, and broker execution remain blocked.",
    },
    {
      id: "kernel_status_checked",
      order: 4,
      label: "Universe Operating Kernel checked",
      status: "checked",
      detail: "Kernel status checked and mapped to the canonical Universe Operating Kernel.",
    },
    {
      id: "protection_core_checked",
      order: 5,
      label: "Protection Core checked",
      status: "checked",
      detail: "Protection Core checked; secret, public exposure, money, broker, and legal gates are active.",
    },
    {
      id: "digital_vault_policy_checked",
      order: 6,
      label: "Digital Vault policy checked",
      status: "protected",
      detail: "Vault is local-first concept only; no sensitive personal documents are stored in Git or public assets.",
    },
    {
      id: "universe_one_reality_synced",
      order: 7,
      label: "Universe One reality synced",
      status: "active",
      detail: "Universe One reality synced with device time/date simulation and source labels.",
    },
    {
      id: "swiss_constitution_loaded",
      order: 8,
      label: "Swiss Local Constitution loaded",
      status: "checked",
      detail: "Swiss Local Constitution is above the Global Layer.",
    },
    {
      id: "pro_max_galaxy_status_loaded",
      order: 9,
      label: "Pro Max Galaxy status loaded",
      status: "checked",
      detail: "Pro Max is the future public product, not الكون; current state remains private and gated.",
    },
    {
      id: "earth_planet_trading_status_loaded",
      order: 10,
      label: "Earth Planet / Trading status loaded",
      status: "checked",
      detail: "Earth Planet contains the trading project; Trading: demo-safe/read-only.",
    },
    {
      id: "execution_law_stop_gates_loaded",
      order: 11,
      label: "Execution law / stop gates loaded",
      status: "checked",
      detail: "داخل الكون: التنفيذ مباشر; عند القانون: يتوقف لأحمد; عند المال: يتوقف لأحمد.",
    },
    {
      id: "next_safe_action_prepared",
      order: 12,
      label: "Next safe action prepared",
      status: "pending",
      detail: "Private command actions can be organized; native desktop packaging remains a future gate.",
    },
  ];
}
