import type { BrandClearanceSnapshot } from "@/lib/server/brand-clearance";
import AlkonBrandClearancePanel from "./AlkonBrandClearancePanel";

export default function AlkonGlobalBrandGatePanel({
  snapshot,
}: {
  snapshot: BrandClearanceSnapshot;
}) {
  return <AlkonBrandClearancePanel snapshot={snapshot} />;
}
