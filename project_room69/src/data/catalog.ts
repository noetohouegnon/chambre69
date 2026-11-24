import raw from './catalog.json';

export type ProductImage = { src: string; srcSmall: string; ratio: number; width: number };
export type Sizes = { cups?: string[]; bands?: number[]; alpha?: string[] };

export type Product = {
  slug: string;
  name: string;
  brand: string;
  brandKind: 'maison' | 'maison69';
  origin: string;
  category: CategoryId;
  reference: string;
  color: string | null;
  description: string;
  features: string[];
  composition: string[];
  care: string[];
  sizes: Sizes;
  sizesProvisional: boolean;
  price: number | null;
  isNew: boolean;
  images: ProductImage[];
  ogImage?: string;
  unavailable?: string[];
  lastPieces?: boolean;
  stores?: string[];
  fit?: string[];
  hidden?: boolean;
  lines: LineId[];
  occasions: OccasionId[];
  rank: number;
};

export type CategoryId =
  | 'soutiens-gorge' | 'culottes' | 'porte-jarretelles' | 'nuit' | 'basiques'
  | 'heritage' | 'seduction' | 'bien-etre' | 'homme';

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: 'soutiens-gorge', label: 'Soutiens-gorge', short: 'Soutiens-gorge' },
  { id: 'culottes', label: 'Culottes, slips et strings', short: 'Culottes' },
  { id: 'porte-jarretelles', label: 'Porte-jarretelles', short: 'Porte-jarretelles' },
  { id: 'nuit', label: 'Nuisettes, kimonos et pyjamas', short: 'Nuit' },
  { id: 'heritage', label: 'Héritage : tradition modernisée, perles, encens', short: 'Héritage' },
  { id: 'seduction', label: 'Séduction', short: 'Séduction' },
  { id: 'basiques', label: 'Basiques et confort', short: 'Basiques' },
  { id: 'bien-etre', label: 'Bien-être intime', short: 'Bien-être intime' },
  { id: 'homme', label: 'Homme', short: 'Homme' },
];

/** Noms de collections du livrable rédactionnel (2.3). Affectation des pièces : proposition à valider. */
export type LineId = 'sunu-betio' | 'sanse' | 'sutura' | 'drianke' | 'ndeye' | 'entierement' | 'trousseau';
export const LINES: { id: LineId; name: string; gloss: string; universe: string; moment: string }[] = [
  { id: 'sunu-betio', name: 'Sunu Bétio', gloss: 'notre bétio', universe: 'Héritage revisité, soie et satin', moment: 'Mariage, vie conjugale, transmission' },
  { id: 'sanse', name: 'Sañse', gloss: 'se faire belle', universe: 'Ligne quotidienne, confort et maintien', moment: 'Tous les jours, toutes morphologies' },
  { id: 'sutura', name: 'Sutura', gloss: 'ce qui reste à vous', universe: 'Ligne discrète, nudes et tons profonds', moment: 'Celle qui ne veut pas que cela se voie' },
  { id: 'drianke', name: 'Drianké', gloss: 'femme assumée', universe: 'Ligne majestueuse, grands bonnets', moment: '40 ans et plus, fortes poitrines' },
  { id: 'ndeye', name: 'Ndeye', gloss: 'mère', universe: 'Grossesse, naissance, post-partum', moment: 'Maternité et retour à soi' },
  { id: 'entierement', name: 'Entièrement', gloss: '', universe: 'Post-opératoire et prothèses', moment: 'Après une mastectomie' },
  { id: 'trousseau', name: 'Le Trousseau', gloss: '', universe: 'Coffrets, bétio, pièces de mariage', moment: 'Mariée, amies de la mariée, diaspora' },
];

export type OccasionId = 'mariage' | 'quotidien' | 'cadeau' | 'ceremonie' | 'maternite' | 'sport' | 'nuit';
export const OCCASIONS: { id: OccasionId; label: string }[] = [
  { id: 'mariage', label: 'Mariage et trousseau' },
  { id: 'ceremonie', label: 'Cérémonies et fêtes' },
  { id: 'cadeau', label: 'Cadeau entre femmes' },
  { id: 'quotidien', label: 'Tous les jours' },
  { id: 'maternite', label: 'Grossesse et après' },
  { id: 'sport', label: 'Sport et mouvement' },
  { id: 'nuit', label: 'Nuit et intérieur' },
];

const CUPS = 'ABCDEFGHIJKLMNO';

/** Pièces de jeu de rôle : réservées à la catégorie Séduction, jamais proposées dans un trousseau ni comme cadeau entre femmes. */
const ROLEPLAY = /costume|harnais|menottes|masque|cache-tétons|jeu de rôle/i;
/** Encens, parfums et huiles (le thiouraye et les senteurs). */
const SCENT = /encens|parfum|huile|mamoul|mamool|oudh|agarwood/i;
/** Vrai pour l'encens, les parfums et les huiles (le thiouraye et les senteurs). */
export const isScent = (p: Pick<Product, 'name'>) => SCENT.test(p.name);

function deriveLines(p: Product): LineId[] {
  const l = new Set<LineId>();
  const txt = `${p.name} ${p.description}`.toLowerCase();
  const maxCup = p.sizes.cups?.length ? CUPS.indexOf(p.sizes.cups[p.sizes.cups.length - 1]) : -1;
  const roleplay = ROLEPLAY.test(p.name);
  // Ndeye (mère) : grossesse, naissance et retour à soi — confort, sans armature, tenues pour recevoir, thiouraye pour la chambre.
  if (/grossesse|allaitement|maternit/.test(txt) || (p.category === 'soutiens-gorge' && /sans armatures/i.test(p.name)) || /pyjama|camisole/i.test(p.name) || (p.category === 'nuit' && /kimono blanc/i.test(p.name)) || /thurabi|mamoul en pot/i.test(p.name)) l.add('ndeye');
  if (maxCup >= CUPS.indexOf('K')) l.add('drianke');
  if (!roleplay && (p.category === 'heritage' || p.category === 'seduction' || /kimono|nuisette|soie/.test(txt))) l.add('trousseau');
  if (p.category === 'heritage' && /nuisette traditionnelle|chaînes de taille/i.test(p.name)) l.add('sunu-betio');
  if (/nude|chair|smooth|moulé|invisible|sans couture/.test(txt) || p.color === 'Nude') l.add('sutura');
  if (['basiques', 'culottes'].includes(p.category) || /coton|confort|quotidien|sans armatures/.test(txt)) l.add('sanse');
  return [...l];
}

function deriveOccasions(p: Product): OccasionId[] {
  const o = new Set<OccasionId>();
  const txt = `${p.name} ${p.description}`.toLowerCase();
  const roleplay = ROLEPLAY.test(p.name);
  // Nuit de noces : héritage, nuit, séduction (hors jeu de rôle), dentelle et soie.
  if (!roleplay && (p.category === 'heritage' || p.category === 'seduction' || p.category === 'porte-jarretelles' || p.category === 'nuit' || /dentelle|soie|satin/.test(txt))) o.add('mariage');
  // Sous une tenue de cérémonie : maintien invisible et lissant, qui tient toute la journée.
  if (['soutiens-gorge', 'culottes'].includes(p.category) && /smooth|moulé|sans bretelles|invisible|lissant|sans couture/.test(txt)) o.add('ceremonie');
  if (!roleplay && (['heritage', 'nuit'].includes(p.category) || (p.category === 'seduction' && /dentelle|kimono|nuisette/.test(txt)))) o.add('cadeau');
  if (['basiques', 'culottes'].includes(p.category) || /quotidien|confort|tous les jours|t-shirt/.test(txt)) o.add('quotidien');
  if (/grossesse|allaitement|matern/.test(txt) || (p.category === 'soutiens-gorge' && /sans armatures/i.test(p.name))) o.add('maternite');
  if (/sport/.test(txt)) o.add('sport');
  if (p.category === 'nuit') o.add('nuit');
  if (SCENT.test(p.name)) o.add('cadeau');
  return [...o];
}

const CATEGORY_RANK: Record<CategoryId, number> = {
  'soutiens-gorge': 0, culottes: 1, heritage: 2, nuit: 3, 'porte-jarretelles': 4, basiques: 5, seduction: 6, homme: 7, 'bien-etre': 8,
};

/** Lignes parasites issues de la conversion des fiches .docx (titres de rubrique, tailles, marque). */
const JUNK_FEATURE = /^(descriptif|informations? produits?|détail(s)? produit|caractéristiques|slip|culotte|string|tanga|shorty|soutien-gorge|marque\s*:.*|((XXS|XS|S|M|L|XL|XXL|\d?XL)\s*)+)$/i;

/** Texte de présentation par défaut, quand la fiche d'origine n'en contient pas (aucune promesse invérifiable). */
function fallbackDescription(p: Product): string {
  const n = p.name.toLowerCase();
  if (p.brandKind === 'maison') {
    return `Une pièce de la maison ${p.brand} (${p.origin}), importée directement par Chambre 69. Votre conseillère vous détaille sur WhatsApp la matière, la coupe et les tailles disponibles, et vous aide à choisir la vôtre.`;
  }
  if (/encens|mamoul|mamool|oudh|agarwood/.test(n)) return 'Un encens choisi pour parfumer la chambre et le linge, dans la tradition du thiouraye. Se brûle sur un charbon ardent ou dans un brûle-parfum. Votre conseillère vous dit comment le doser et l’associer.';
  if (/huile parfumée/.test(n)) return 'Une huile parfumée qui se pose en quelques gouttes sur la peau ou le linge. Votre conseillère vous décrit ses notes et vous aide à l’associer à un encens.';
  if (/parfum/.test(n)) return 'Un parfum choisi pour la chambre, le linge ou la peau. Votre conseillère vous décrit ses notes sur WhatsApp et vous aide à composer votre ensemble de senteurs.';
  if (/chaînes de taille/.test(n)) return 'Des chaînes de taille à porter à même la peau, seules ou sous un pagne, dans l’esprit du bin-bin (perles de taille). Elles s’offrent volontiers dans un trousseau.';
  if (/nuisette traditionnelle/.test(n)) return 'Une nuisette longue et son kimono assorti, dans l’esprit de nos tenues d’intérieur traditionnelles. Taille ample, tombé fluide : une pièce de trousseau qui se porte longtemps.';
  if (/costume/.test(n)) return 'Un costume de jeu de rôle, pour une soirée à deux qui sort de l’ordinaire. Votre conseillère vous confirme les pièces incluses et les tailles disponibles.';
  if (/pompe d’aspiration/.test(n)) return 'Un appareil d’aspiration pour la poitrine, vendu dans un emballage neutre. Votre conseillère vous explique son utilisation en toute discrétion sur WhatsApp.';
  if (p.category === 'bien-etre') return 'Un accessoire de bien-être intime, vendu neuf dans son emballage d’origine et expédié dans un colis neutre. Votre conseillère répond à vos questions en toute discrétion sur WhatsApp.';
  if (/kimono/.test(n)) return 'Une pièce d’intérieur à superposer, pour le soir ou pour un moment à deux. Votre conseillère vous confirme la matière et les tailles disponibles.';
  if (/bas autofixants/.test(n)) return 'Des bas autofixants à bande de dentelle, qui tiennent seuls ou s’accrochent à un porte-jarretelles. Votre conseillère vous confirme les coloris disponibles.';
  return 'Une pièce de notre sélection séduction, choisie pour un moment à deux. Votre conseillère vous confirme sur WhatsApp la matière, le coloris et les tailles disponibles.';
}

/** Pièces à porter (sert à n'afficher l'essayage et les conseils d'entretien textile que lorsqu'ils ont un sens). */
export const isWearable = (p: Pick<Product, 'name' | 'category'>) =>
  p.category !== 'bien-etre' && !/encens|parfum|huile|chaînes de taille|mamoul|mamool|oudh|agarwood/i.test(p.name);

export const PRODUCTS: Product[] = (raw as unknown as Product[])
  .map((p, i) => {
    const merged = { ...p } as Product;
    merged.features = (merged.features || []).filter((f) => !JUNK_FEATURE.test(f.trim()));
    if (!merged.description?.trim()) merged.description = fallbackDescription(merged);
    merged.lines = deriveLines(merged);
    merged.occasions = deriveOccasions(merged);
    merged.rank = i;
    return merged;
  })
  .filter((p) => !p.hidden)
  .sort((a, b) => CATEGORY_RANK[a.category] - CATEGORY_RANK[b.category] || a.rank - b.rank);

export const BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
export const BRANDS_DISTRIBUTED = [...new Set(PRODUCTS.filter((p) => p.brandKind === 'maison').map((p) => p.brand))];

export const productUrl = (p: Pick<Product, 'slug'>) => `/boutique/${p.slug}`;

export const formatPrice = (n: number) => `${n.toLocaleString('fr-FR').replace(/\u202f|\s/g, '\u00a0')}\u00a0FCFA`;

export function related(p: Product, n = 4): Product[] {
  const sameCollection = PRODUCTS.filter((q) => q.slug !== p.slug && q.brand === p.brand && sharedWord(q.name, p.name));
  const sameCat = PRODUCTS.filter((q) => q.slug !== p.slug && q.category === p.category && q.brand === p.brand);
  const others = PRODUCTS.filter((q) => q.slug !== p.slug && q.category === p.category);
  return [...new Set([...sameCollection, ...sameCat, ...others])].slice(0, n);
}

const GENERIC_WORDS = ['Soutien-gorge', 'Culotte', 'Slip', 'String', 'Tanga', 'Ensemble', 'Body', 'Nuisette', 'Encens', 'Parfum', 'Huile', 'Costume', 'Godemiché', 'Vibromasseur', 'Satisfyer', 'Lovetoy', 'Haramain', 'Pompe', 'Chaînes', 'Guêpière', 'Corset', 'Harnais', 'Bas', 'Robe', 'Kimono', 'Pyjama', 'Boxer', 'Brassière', 'Naked'];

function sharedWord(a: string, b: string) {
  // Seuls les noms de modèle des maisons (Agathe, Cassiopée…) servent à rapprocher deux pièces.
  const model = (s: string) => s.split(/\s+/).filter((w) => /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(w) && !GENERIC_WORDS.includes(w));
  const ma = model(a);
  return model(b).some((w) => ma.includes(w));
}

/** Coordonnés = même nom de modèle dans la même maison (ex. soutien-gorge et culotte Agathe). */
export const coordinated = (p: Product) => PRODUCTS.filter((q) => q.slug !== p.slug && q.brand === p.brand && q.category !== p.category && sharedWord(q.name, p.name));

export const sizeLabelsFor = (p: Product): string[] => {
  if (p.sizes.cups?.length && p.sizes.bands?.length) return p.sizes.bands.flatMap((b) => p.sizes.cups!.map((c) => `${b}${c}`));
  return p.sizes.alpha || [];
};
