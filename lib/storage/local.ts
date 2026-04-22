export function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as unknown;
    return parsed === null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
