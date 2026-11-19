/**
 * Données de la maison, à un seul endroit.
 * Les valeurs entre crochets [ … ] sont en attente de transmission par Chambre 69
 * (cf. « Ce qu'il reste à nous transmettre » dans le livrable rédactionnel).
 */

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://chambre69-74u7-one.vercel.app';

export const BRAND = {
  name: 'Chambre 69',
  baseline: 'Chambre 69 — Au-delà de la lingerie.',
  founder: 'Nafi Ba Doré',
  whatsappNumber: '221787040505',
  whatsappDisplay: '+221 78 704 05 05',
  phoneHref: 'tel:+221787040505',
  email: 'contact@chambre69.com',
  firstPrice: 33000,
  cups: 'ABCDEFGHIJKLMNO'.split(''),
};

/** Chiffres de communauté : à mettre à jour chaque trimestre (jamais d'estimation arrondie à la hausse). */
export const COMMUNITY = {
  updatedAt: 'octobre 2026',
  handle: '@chambre_69',
  networks: [
    { id: 'tiktok', label: 'TikTok', count: 41000, url: 'https://www.tiktok.com/@chambre__69' },
    { id: 'instagram', label: 'Instagram', count: 14000, url: 'https://www.instagram.com/chambre_69' },
    { id: 'facebook', label: 'Facebook', count: 12000, url: 'https://www.facebook.com/search/top?q=chambre%2069%20dakar' },
    { id: 'snapchat', label: 'Snapchat', count: 3000, url: 'https://www.snapchat.com/add/chambre_69' },
  ],
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

export const STORES: Store[] = [
  {
    id: 'point-e',
    name: 'Chambre 69 Point E',
    district: 'Point E',
    context: 'Point E, quartier résidentiel du centre de Dakar, Sénégal',
    address: null,
    landmarks: null,
    hours: null,
    mapsQuery: 'Chambre 69 lingerie Point E Dakar',
    parking: null,
  },
  {
    id: 'corniche-ouest',
    name: 'Chambre 69 Corniche Ouest',
    district: 'Corniche Ouest',
    context: 'Corniche Ouest, axe côtier ouest de Dakar, Sénégal',
    address: null,
    landmarks: null,
    hours: null,
    mapsQuery: 'Chambre 69 lingerie Corniche Ouest Dakar',
    parking: null,
  },
];

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const directionsUrl = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/** Zones de livraison (5 bis.2). Délais et frais : à arrêter avec Chambre 69. */
export type Zone = { id: string; label: string; countries: string[]; delay: string; fees: string; notes: string[] };

export const ZONES: Zone[] = [
  {
    id: 'dakar',
    label: 'Dakar et périphérie',
    countries: ['Sénégal — Dakar et périphérie'],
    delay: '[délai à confirmer] — livraison express sur créneau',
    fees: '[frais à confirmer]',
    notes: ['Retrait possible dans nos deux boutiques', 'Règlement possible à la livraison, après confirmation par une conseillère'],
  },
  {
    id: 'senegal',
    label: 'Régions du Sénégal',
    countries: ['Sénégal — régions (Thiès, Saint-Louis, Mbour, Touba, Ziguinchor…)'],
    delay: '[délai à confirmer]',
    fees: '[frais à confirmer]',
    notes: ['Suivi de commande sur WhatsApp'],
  },
  {
    id: 'sous-region',
    label: "Afrique de l'Ouest",
    countries: ["Côte d'Ivoire", 'Mali', 'Burkina Faso', 'Guinée', 'Mauritanie', 'Gambie', 'Bénin', 'Togo'],
    delay: '[délai par pays à confirmer]',
    fees: '[frais par pays à confirmer]',
    notes: ['Droits et taxes éventuels annoncés avant la commande, jamais après'],
  },
  {
    id: 'international',
    label: 'International',
    countries: ['France', 'Italie', 'Espagne', 'Belgique', 'Royaume-Uni', 'Allemagne', 'États-Unis', 'Canada'],
    delay: '[délai par zone à confirmer]',
    fees: '[frais par zone à confirmer]',
    notes: ['Mention douanière et droits éventuels annoncés avant la commande', 'Suivi de colis'],
  },
];

export const COUNTRY_OPTIONS = ZONES.flatMap((z) => z.countries.map((c) => ({ zone: z.id, country: c })));

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

/** Données encore attendues — affichées sous forme de bloc d'attente neutre (3.3). */
export const PENDING = {
  exchangeDays: '[X]',
  shipDays: '[X]',
  sportMaxCup: '[X]',
  bandRange: '[XX] au [XX]',
  alphaRange: 'S au 3XL',
  legal: { company: '[raison sociale]', form: '[forme juridique]', rccm: '[RCCM]', ninea: '[NINEA]', hq: '[adresse du siège]', host: 'Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis' },
};
