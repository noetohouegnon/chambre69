/**
 * Mesure d'audience (8.2, 8.3).
 * - Vercel Web Analytics : statistiques de visites SANS cookie ni donnée personnelle,
 *   chargée automatiquement sur Vercel (à activer d'un clic dans le tableau de bord Vercel).
 * - Google Analytics 4 et pixel Meta : chargés UNIQUEMENT si leurs identifiants sont fournis
 *   (variables VITE_GA4_ID, VITE_META_PIXEL_ID) ET après accord explicite de la visiteuse.
 *   Sans identifiant, aucun bandeau de consentement n'est affiché : il n'y a rien à accepter.
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

const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) || '';
const META_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || '';
const ON_VERCEL = Boolean(import.meta.env.VITE_ON_VERCEL);

/** Vrai si au moins un traceur soumis à consentement est configuré. */
export const needsConsent = Boolean(GA4_ID || META_ID);

type Fn = (...args: unknown[]) => void;
declare global {
  interface Window { gtag?: Fn; fbq?: Fn & { queue?: unknown[]; loaded?: boolean; version?: string; push?: Fn; callMethod?: Fn }; _fbq?: unknown; va?: Fn; vaq?: unknown[] }
}

function addScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const el = document.createElement('script');
  el.async = true; el.src = src;
  document.head.appendChild(el);
}

let thirdPartyLoaded = false;
function loadThirdParty() {
  if (thirdPartyLoaded || typeof window === 'undefined' || getConsent() !== 'granted') return;
  thirdPartyLoaded = true;
  if (GA4_ID) {
    window.dataLayer ||= [];
    window.gtag = function gtag() { window.dataLayer!.push(arguments); } as Fn; // eslint-disable-line prefer-rest-params
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, { anonymize_ip: true });
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`);
  }
  if (META_ID) {
    const q: unknown[] = [];
    const fbq = function fbq(...args: unknown[]) { q.push(args); } as NonNullable<Window['fbq']>;
    fbq.queue = q; fbq.loaded = true; fbq.version = '2.0';
    window.fbq = window.fbq || fbq; window._fbq = window.fbq;
    addScript('https://connect.facebook.net/fr_FR/fbevents.js');
    window.fbq('init', META_ID);
    window.fbq('track', 'PageView');
  }
}

/** À appeler une fois au démarrage du site, côté navigateur. */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (ON_VERCEL) {
    window.va = window.va || function va(...args: unknown[]) { (window.vaq = window.vaq || []).push(args); };
    addScript('/_vercel/insights/script.js');
  }
  loadThirdParty();
  window.addEventListener('c69-consent', loadThirdParty);
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (getConsent() !== 'granted') return;
  (window.dataLayer ||= []).push({ event, ...params, page: window.location.pathname });
  if (window.gtag) window.gtag('event', event, params);
  if (window.fbq) window.fbq('trackCustom', event, params);
}
