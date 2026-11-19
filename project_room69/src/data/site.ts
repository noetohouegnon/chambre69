/**
 * Données de la maison, à un seul endroit.
 * Les informations courantes (boutiques, horaires, contact, témoignages, chiffres des réseaux)
 * viennent de content/reglages.json, modifiable depuis l'espace d'administration (/admin).
 */
import R from '../../content/reglages.json';

type Reglages = {
  contact?: { whatsapp?: string; email?: string };
  boutiques?: { id: string; quartier?: string; adresse?: string; reperes?: string; horaires?: { jour: string; heures: string }[]; stationnement?: string; recherche_maps?: string }[];
  echange_jours?: number | null;
  temoignages?: { citation: string; auteur: string }[];
  reseaux?: { mis_a_jour?: string; tiktok?: number; instagram?: number; facebook?: number; snapchat?: number; tiktok_url?: string; instagram_url?: string; facebook_url?: string; snapchat_url?: string };
};
const REG = R as Reglages;
const waDigits = (REG.contact?.whatsapp || '+221 78 704 05 05').replace(/\D/g, '');
const shop = (id: string) => REG.boutiques?.find((b) => b.id === id);
const text = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4173';

export const BRAND = {
  name: 'Chambre 69',
  baseline: 'Chambre 69 — Au-delà de la lingerie.',
  founder: 'Nafi Ba Doré',
  whatsappNumber: waDigits,
  whatsappDisplay: REG.contact?.whatsapp || '+221 78 704 05 05',
  phoneHref: `tel:+${waDigits}`,
  email: REG.contact?.email || 'contact@chambre69.sn',
  firstPrice: 33000,
  cups: 'ABCDEFGHIJKLMNO'.split(''),
};

/** Chiffres de communauté : à mettre à jour chaque trimestre (jamais d'estimation arrondie à la hausse). */
export const COMMUNITY = {
  updatedAt: REG.reseaux?.mis_a_jour || 'octobre 2026',
  handle: '@chambre_69',
  /** `url` vaut null tant que l'adresse exacte de la page n'est pas renseignée (le réseau s'affiche alors sans lien). */
  networks: [
    { id: 'tiktok', label: 'TikTok', count: REG.reseaux?.tiktok ?? 41000, url: text(REG.reseaux?.tiktok_url) },
    { id: 'instagram', label: 'Instagram', count: REG.reseaux?.instagram ?? 14000, url: text(REG.reseaux?.instagram_url) },
    { id: 'facebook', label: 'Facebook', count: REG.reseaux?.facebook ?? 12000, url: text(REG.reseaux?.facebook_url) },
    { id: 'snapchat', label: 'Snapchat', count: REG.reseaux?.snapchat ?? 3000, url: text(REG.reseaux?.snapchat_url) },
  ] as { id: string; label: string; count: number; url: string | null }[],

};

export type Store = {
  id: 'point-e' | 'corniche-ouest';
  name: string;
  district: string;
  context: string;
  address: string | null;
  landmarks: string | null;
  hours: { day: string; time: string }[] | null;
  mapsQuery: string;
  parking: string | null;
};

const STORE_BASE: Pick<Store, 'id' | 'name' | 'district' | 'context' | 'mapsQuery'>[] = [
  { id: 'point-e', name: 'Chambre 69 Point E', district: 'Point E', context: 'Point E, quartier résidentiel du centre de Dakar, Sénégal', mapsQuery: 'Chambre 69 lingerie Point E Dakar' },
  { id: 'corniche-ouest', name: 'Chambre 69 Corniche Ouest', district: 'Corniche Ouest', context: 'Corniche Ouest, axe côtier ouest de Dakar, Sénégal', mapsQuery: 'Chambre 69 lingerie Corniche Ouest Dakar' },
];

export const STORES: Store[] = STORE_BASE.map((b) => {
  const r = shop(b.id);
  const hours = (r?.horaires || []).filter((h) => h.jour && h.heures).map((h) => ({ day: h.jour, time: h.heures }));
  return {
    ...b,
    district: text(r?.quartier) || b.district,
    address: text(r?.adresse),
    landmarks: text(r?.reperes),
    hours: hours.length ? hours : null,
    parking: text(r?.stationnement),
    mapsQuery: text(r?.recherche_maps) || text(r?.adresse) || b.mapsQuery,
  };
});

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const directionsUrl = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/** Zones de livraison (5 bis.2). Frais et délais : convenus au cas par cas sur WhatsApp ou par téléphone. */
export type Zone = { id: string; label: string; countries: string[]; notes: string[] };

export const ZONES: Zone[] = [
  {
    id: 'dakar',
    label: 'Dakar et périphérie',
    countries: ['Sénégal — Dakar et périphérie'],
    notes: ['Retrait possible dans nos deux boutiques', 'Règlement possible à la livraison, après confirmation par une conseillère'],
  },
  {
    id: 'senegal',
    label: 'Régions du Sénégal',
    countries: ['Sénégal — régions (Thiès, Saint-Louis, Mbour, Touba, Ziguinchor…)'],
    notes: ['Suivi de commande sur WhatsApp'],
  },
  {
    id: 'sous-region',
    label: "Afrique de l'Ouest",
    countries: ["Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Guinée', 'Mauritanie', 'Gambie', 'Bénin', 'Togo'],
    notes: ['Droits et taxes éventuels annoncés avant la commande, jamais après'],
  },
  {
    id: 'international',
    label: 'International',
    countries: ['France', 'Italie', 'Espagne', 'Belgique', 'Royaume-Uni', 'Allemagne', 'États-Unis', 'Canada'],
    notes: ['Mention douanière et droits éventuels annoncés avant la commande', 'Suivi de colis'],
  },
];

export const COUNTRY_OPTIONS = ZONES.flatMap((z) => z.countries.map((c) => ({ zone: z.id, country: c })));

/** Tranches de budget proposées à la fin du guide des tailles (tranches indiquées par Madame, novembre 2026). */
export const BUDGETS = [
  '8 000 à 13 000 FCFA',
  '15 000 à 35 000 FCFA',
  'Plus de 35 000 FCFA',
];

/** Indicatifs proposés dans les formulaires (4.8). */
export const DIAL_CODES = [
  { code: '+221', label: 'Sénégal (+221)' },
  { code: '+225', label: "Côte d'Ivoire (+225)" },
  { code: '+223', label: 'Mali (+223)' },
  { code: '+226', label: 'Burkina Faso (+226)' },
  { code: '+224', label: 'Guinée (+224)' },
  { code: '+222', label: 'Mauritanie (+222)' },
  { code: '+220', label: 'Gambie (+220)' },
  { code: '+229', label: 'Bénin (+229)' },
  { code: '+228', label: 'Togo (+228)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+39', label: 'Italie (+39)' },
  { code: '+34', label: 'Espagne (+34)' },
  { code: '+32', label: 'Belgique (+32)' },
  { code: '+44', label: 'Royaume-Uni (+44)' },
  { code: '+49', label: 'Allemagne (+49)' },
  { code: '+1', label: 'États-Unis / Canada (+1)' },
];

/**
 * Données encore attendues de Chambre 69.
 * Tant qu'une valeur vaut null, le site affiche une formulation neutre (jamais de « [X] » visible).
 * Dès que l'information est connue, il suffit de la renseigner ici.
 */
export const PENDING = {
  /** Délai d'échange en boutique, en jours (ex. 14). */
  exchangeDays: (REG.echange_jours || null) as number | null,
  /** Délai d'expédition hors Sénégal, en jours ouvrés (ex. 3). */
  shipDays: null as number | null,
  /** Bonnet maximum des brassières de sport en stock (ex. 'K'). */
  sportMaxCup: null as string | null,
  /** Amplitude des tours de dos en stock (ex. '75 au 120'). */
  bandRange: null as string | null,
  alphaRange: 'S au 3XL',
};

/** « sous 14 jours » si le délai est connu, sinon une formulation neutre. */
export const exchangeDelayText = () =>
  PENDING.exchangeDays ? `sous ${PENDING.exchangeDays} jours` : 'dans le délai indiqué par votre conseillère lors de la commande';

/**
 * Témoignages de clientes réelles, publiés avec leur accord écrit (2.9).
 * Tant que la liste est vide, l'accueil affiche une simple invitation à témoigner.
 * Ils se saisissent depuis /admin → Réglages du site → Témoignages.
 */
export const TESTIMONIALS: { quote: string; author: string }[] = (REG.temoignages || [])
  .filter((t) => t.citation?.trim())
  .map((t) => ({ quote: t.citation.trim(), author: t.auteur?.trim() || '' }));
