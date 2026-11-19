/**
 * Couche de mesure (8.2). Aucun script tiers n'est chargé et aucun événement n'est
 * transmis avant le consentement explicite (8.3). Les événements sont poussés dans
 * window.dataLayer, prêt à être branché sur Google Analytics 4, Meta et TikTok.
 */
import { storage } from './storage';

export type Consent = 'granted' | 'denied' | null;
const KEY = 'c69-consent';

export const getConsent = (): Consent => (storage.get(KEY) as Consent) ?? null;
export const setConsent = (v: Exclude<Consent, null>) => {
  storage.set(KEY, v);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('c69-consent', { detail: v }));
};

declare global {
  interface Window { dataLayer?: unknown[] }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || getConsent() !== 'granted') return;
  (window.dataLayer ||= []).push({ event, ...params, page: window.location.pathname });
}
