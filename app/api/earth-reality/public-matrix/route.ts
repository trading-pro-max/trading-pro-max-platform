import { getPublicWorldMatrix } from "@/lib/server/earth-reality";
import { noStoreJson } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const matrix = getPublicWorldMatrix();

  return noStoreJson({
    ok: true,
    matrix,
    surfaces: matrix.map((page) => page.surface),
    publicCopyOnly: true,
  });
}
