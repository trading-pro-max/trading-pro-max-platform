import { getProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";
import UniverseCommandCenter from "./_components/UniverseCommandCenter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Alkon Universe | Private Command Center",
  description:
    "Private read-only project universe command center for ALKON and Pro Max Trading readiness.",
};

export default function FounderUniversePage() {
  const truth = getProjectUniverseTruthSnapshot();

  return (
    <PrivateFounderShell checkedAt={truth.checkedAt}>
      <UniverseCommandCenter truth={truth} />
    </PrivateFounderShell>
  );
}
