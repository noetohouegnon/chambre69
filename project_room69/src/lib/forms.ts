import { waLink } from './whatsapp';
import { track } from './analytics';

/**
 * Envoi des formulaires. Tant qu'aucun service d'envoi n'est branché
 * (variable VITE_FORMS_ENDPOINT : outil d'e-mailing, CRM ou fonction serveur),
 * la demande est transmise à une conseillère par WhatsApp, déjà rédigée.
 */
const ENDPOINT = import.meta.env.VITE_FORMS_ENDPOINT as string | undefined;

export async function sendForm(kind: string, fields: Record<string, string>, whatsappText: string): Promise<'sent' | 'whatsapp'> {
  track('form_submit', { kind });
  if (ENDPOINT) {
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, ...fields }) });
      if (r.ok) return 'sent';
    } catch { /* repli WhatsApp */ }
  }
  window.open(waLink(whatsappText), '_blank', 'noopener');
  return 'whatsapp';
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/[\s.-]/g, '').replace(/^0+/, '').length >= 7 && /^[0-9\s.-]+$/.test(v.trim());
