import { getAlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import { getLocalDesktopAuthPolicy } from "@/lib/server/universe/local-desktop-auth";
import { AlKawnDesktopShell } from "./_components/AlKawnDesktopShell";
import { AlKawnLocalAuthGate } from "./_components/AlKawnLocalAuthGate";

export const dynamic = "force-dynamic";

export default function AlKawnDesktopPage() {
  const desktopState = getAlKawnDesktopState(new Date());
  const localAuthPolicy = getLocalDesktopAuthPolicy();

  return (
    <AlKawnLocalAuthGate policy={localAuthPolicy}>
      <AlKawnDesktopShell state={desktopState} />
    </AlKawnLocalAuthGate>
  );
}
