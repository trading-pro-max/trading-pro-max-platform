export const ALKON_GENESIS_MEMORY_LESSONS = [
  "Pro Max Trading is the Prime World.",
  "No new world before Station 1 closure and Prime World acceptance.",
  "New worlds must not weaken the Prime World.",
  "Future worlds and World Seeds remain private.",
  "No fake market claims.",
  "No legal or financial activity without review.",
  "No spending without Treasury Gate.",
  "No public launch without Launch Gate.",
  "No world birth without Founder approval.",
  "No public Alkon or Genesis exposure.",
];

export function genesisMemoryForSeed(seedId: string): string {
  return `${seedId}: remember Prime World protection before any future world birth.`;
}
