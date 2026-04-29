import "server-only";

import type { AlKawnDesktopTruthItem } from "./types";

export function getAlKawnDesktopProductTruth(): AlKawnDesktopTruthItem[] {
  return [
    { id: "private_devices", label: "الكون private to Ahmad devices", value: "yes", status: "protected" },
    { id: "electronic_self", label: "الكون is Ahmad’s private electronic self", value: "yes", status: "protected" },
    { id: "pro_max_future", label: "Pro Max is future public product", value: "working_name_only", status: "pending" },
    { id: "brand_gate", label: "Brand Gate", value: "ready_with_notes", status: "pending" },
    { id: "public_launch", label: "public launch", value: "blocked/not started", status: "blocked" },
    { id: "billing", label: "billing", value: "inactive", status: "blocked" },
    { id: "payments", label: "payments", value: "inactive", status: "blocked" },
    { id: "receiving_money", label: "receiving money", value: "inactive", status: "blocked" },
    { id: "real_money", label: "real money", value: "disabled", status: "blocked" },
    { id: "broker", label: "broker execution", value: "disabled/not connected", status: "blocked" },
    { id: "legal", label: "legal review", value: "pending", status: "pending" },
    { id: "swiss_constitution", label: "Swiss Local Constitution", value: "above Global Layer", status: "protected" },
    { id: "alkon", label: "ALKON", value: "private/background", status: "protected" },
    { id: "weather", label: "weather", value: "not connected", status: "inactive" },
    { id: "location", label: "location", value: "not requested", status: "inactive" },
    { id: "enforced", label: "Product Truth", value: "enforced", status: "protected" },
  ];
}
