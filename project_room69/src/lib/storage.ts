/** Accès au stockage local sans jamais faire échouer la page (navigation privée, rendu serveur…). */
export const storage = {
  get(key: string): string | null {
    try { return typeof window === 'undefined' ? null : window.localStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string) {
    try { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); } catch { /* ignoré */ }
  },
  getJSON<T>(key: string, fallback: T): T {
    const v = storage.get(key);
    if (!v) return fallback;
    try { return JSON.parse(v) as T; } catch { return fallback; }
  },
  setJSON(key: string, value: unknown) { storage.set(key, JSON.stringify(value)); },
};
