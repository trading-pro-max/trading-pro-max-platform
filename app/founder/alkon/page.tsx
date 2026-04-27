import { getAlkonSovereignCommandInterfaceSnapshot } from "@/lib/server/alkon-chat";
import { AlkonSovereignChatInterface } from "@/modules/founder-command/components";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FounderAlkonPage() {
  const snapshot = getAlkonSovereignCommandInterfaceSnapshot();

  return (
    <PrivateFounderShell checkedAt={snapshot.checkedAt}>
      <AlkonSovereignChatInterface snapshot={snapshot} />
    </PrivateFounderShell>
  );
}
