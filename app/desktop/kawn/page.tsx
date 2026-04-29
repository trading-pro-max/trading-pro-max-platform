import { getAlKawnDesktopState } from "@/lib/server/universe/desktop-interface";
import { AlKawnDesktopShell } from "./_components/AlKawnDesktopShell";

export const dynamic = "force-dynamic";

export default function AlKawnDesktopPage() {
  const desktopState = getAlKawnDesktopState(new Date());

  return <AlKawnDesktopShell state={desktopState} />;
}
