/**
 * Données de la maison, à un seul endroit.
 * Les valeurs à null (adresses, horaires, délais, mentions légales…) sont en attente de Chambre 69 :
 * le site affiche alors une formulation neutre, et l'information réelle dès qu'elle est renseignée.
 */

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4173';

export const BRAND = {
  name: 'Chambre 69',
  baseline: 'Chambre 69 — Au-delà de la lingerie.',
  founder: 'Nafi Ba Doré',
  whatsappNumber: '221787040505',
  whatsappDisplay: '+221 78 704 05 05',
  phoneHref: 'tel:+221787040505',
  email: 'contact@chambre69.sn',
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
    address: 'Angle rue PE 23 et boulevard de Saint-Louis, Point E, Dakar',
    landmarks: null,
    // Horaires relevés sur chambre69.sn (novembre 2026) : à confirmer par la boutique.
    hours: [
      { day: 'Lundi', time: '10 h – 20 h' },
      { day: 'Du mardi au samedi', time: '8 h – 20 h' },
      { day: 'Dimanche', time: 'Sur rendez-vous' },
    ],
    mapsQuery: 'Chambre 69, Angle Rue PE23 Boulevard de Saint-Louis, Point E, Dakar',
    parking: null,
  },
  {
    id: 'corniche-ouest',
    name: 'Chambre 69 Corniche Ouest',
    district: 'Corniche Ouest',
    context: 'Corniche Ouest, axe côtier ouest de Dakar, Sénégal',
    address: 'Route de la Corniche Ouest, Soumbédioune, au niveau de la RFM, Dakar',
    landmarks: 'Sur la Corniche Ouest, à Soumbédioune, à hauteur des locaux de la radio RFM.',
    hours: [
      { day: 'Lundi', time: '10 h – 20 h' },
      { day: 'Du mardi au samedi', time: '8 h – 20 h' },
      { day: 'Dimanche', time: 'Sur rendez-vous' },
    ],
    mapsQuery: 'Chambre 69, Route de la Corniche Ouest, Soumbédioune, Dakar',
    parking: null,
  },
];

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
  exchangeDays: null as number | null,
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
 * Exemple d'entrée : { quote: 'Texte exact de la cliente', author: 'Aïssatou, Dakar — bonnet G' }
 */
export const TESTIMONIALS: { quote: string; author: string }[] = [];
