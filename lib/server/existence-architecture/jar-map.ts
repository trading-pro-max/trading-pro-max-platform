import type { JarId } from "@/lib/server/jar-build";
import type { ExistenceEntity } from "./types";

export function mapExistenceEntityToJar(
  entity: ExistenceEntity,
  missingAnswers: string[] = []
): JarId {
  const text = `${entity.id} ${entity.name} ${entity.path} ${entity.notes.join(" ")}`.toLowerCase();

  if (
    entity.owner === "sensitive_do_not_commit" ||
    entity.risk.categories.some((category) =>
      /secret|payment|shell|codex|public alkon|bank|card/.test(category.toLowerCase())
    )
  ) {
    return "jar_0_black_hole";
  }

  if (
    entity.risk.level === "p0" ||
    /build break|test break|tests failing|failing test|public leak|product truth|route break/.test(text)
  ) {
    return "jar_1_p0_reality";
  }

  if (/trading|workspace|chart|execution|first living product/.test(text)) {
    return "jar_2_heart";
  }

  if (/assistant|settings|accessibility|comfort|journal|coach/.test(text)) {
    return "jar_3_user_comfort";
  }

  if (/support|plans|apps|academy|trust|public/.test(text)) {
    return "jar_4_public_trust";
  }

  if (entity.requiresAhmad || entity.owner === "unknown_needs_ahmad") {
    return "jar_9_founder_decision";
  }

  if (
    entity.owner === "private_alkon_minus_zero" ||
    /alkon|founder|kernel|pocket|private/.test(text)
  ) {
    return "jar_5_private_alkon";
  }

  if (
    entity.lifecycle === "cleanup_candidate" ||
    /cleanup|duplicate|stale|unknown|css/.test(text)
  ) {
    return "jar_6_cleanup";
  }

  if (missingAnswers.length > 0 || entity.evidence.status === "missing") {
    return "jar_7_evidence";
  }

  if (entity.type === "future_idea" || entity.lifecycle === "future") {
    return "jar_8_future_worlds";
  }

  return "jar_7_evidence";
}
