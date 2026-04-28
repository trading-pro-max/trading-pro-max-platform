import { getAlkonSovereignCommandInterfaceSnapshot } from "@/lib/server/alkon-chat";
import { getJarBuildSnapshot } from "@/lib/server/jar-build";
import { AlkonSovereignChatInterface } from "@/modules/founder-command/components";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FounderAlkonPage() {
  const snapshot = getAlkonSovereignCommandInterfaceSnapshot();
  const jarSnapshot = getJarBuildSnapshot(snapshot.checkedAt);

  return (
    <PrivateFounderShell checkedAt={snapshot.checkedAt}>
      <AlkonSovereignChatInterface jarSnapshot={jarSnapshot} snapshot={snapshot} />
    </PrivateFounderShell>
  );
}
