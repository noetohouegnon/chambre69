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
/** Numéro de téléphone : chiffres, espaces, points, tirets, parenthèses ; « +221 » ou « 00221 » acceptés. */
export const isPhone = (v: string) => /^(\+|00)?\d{7,15}$/.test(v.replace(/[\s.()-]/g, ''));

/** Numéro complet pour le message : si la cliente a déjà saisi l'indicatif (+… ou 00…), on ne le double pas. */
export const fullPhone = (dial: string, tel: string) => {
  const t = tel.trim();
  if (/^\+/.test(t)) return t;
  if (/^00/.test(t)) return `+${t.slice(2)}`;
  return `${dial} ${t.replace(/^0(?=\d{8,})/, '')}`;
};
