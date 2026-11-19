import raw from './catalog.json';
import overrides from './overrides.json';

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
  { id: 'ndeye', name: 'Ndeye', gloss: 'mère', universe: 'Grossesse, allaitement, post-partum', moment: 'Maternité et retour à soi' },
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
const ov = overrides as Record<string, Partial<Product>>;

function deriveLines(p: Product): LineId[] {
  const l = new Set<LineId>();
  const txt = `${p.name} ${p.description}`.toLowerCase();
  const maxCup = p.sizes.cups?.length ? CUPS.indexOf(p.sizes.cups[p.sizes.cups.length - 1]) : -1;
  if (/grossesse|allaitement|maternit/.test(txt)) l.add('ndeye');
  if (maxCup >= CUPS.indexOf('K')) l.add('drianke');
  if (p.category === 'heritage' || p.category === 'seduction' || /kimono|nuisette|soie/.test(txt)) l.add('trousseau');
  if (p.category === 'heritage' && /nuisette|tradition/.test(txt)) l.add('sunu-betio');
  if (/nude|chair|smooth|moulé|invisible|sans couture/.test(txt) || p.color === 'Nude') l.add('sutura');
  if (['basiques', 'culottes'].includes(p.category) || /coton|confort|quotidien|sans armatures/.test(txt)) l.add('sanse');
  return [...l];
}

function deriveOccasions(p: Product): OccasionId[] {
  const o = new Set<OccasionId>();
  const txt = `${p.name} ${p.description}`.toLowerCase();
  if (p.category === 'heritage' || p.category === 'seduction' || p.category === 'porte-jarretelles' || /dentelle|soie|satin/.test(txt)) o.add('mariage');
  if (p.category === 'heritage' || /dentelle|brod/.test(txt)) o.add('ceremonie');
  if (['heritage', 'nuit', 'seduction'].includes(p.category)) o.add('cadeau');
  if (['basiques', 'culottes'].includes(p.category) || /quotidien|confort|tous les jours|t-shirt/.test(txt)) o.add('quotidien');
  if (/grossesse|allaitement/.test(txt)) o.add('maternite');
  if (/sport/.test(txt)) o.add('sport');
  if (p.category === 'nuit') o.add('nuit');
  return [...o];
}

const CATEGORY_RANK: Record<CategoryId, number> = {
  'soutiens-gorge': 0, culottes: 1, heritage: 2, nuit: 3, 'porte-jarretelles': 4, basiques: 5, seduction: 6, homme: 7, 'bien-etre': 8,
};

export const PRODUCTS: Product[] = (raw as unknown as Product[])
  .map((p, i) => {
    const merged = { ...p, ...(ov[p.slug] || {}) } as Product;
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

export const formatPrice = (n: number) => `${n.toLocaleString('fr-FR').replace(/ |\s/g, ' ')} FCFA`;

export function related(p: Product, n = 4): Product[] {
  const sameCollection = PRODUCTS.filter((q) => q.slug !== p.slug && q.brand === p.brand && sharedWord(q.name, p.name));
  const sameCat = PRODUCTS.filter((q) => q.slug !== p.slug && q.category === p.category && q.brand === p.brand);
  const others = PRODUCTS.filter((q) => q.slug !== p.slug && q.category === p.category);
  return [...new Set([...sameCollection, ...sameCat, ...others])].slice(0, n);
}

function sharedWord(a: string, b: string) {
  const model = (s: string) => s.split(/\s+/).filter((w) => /^[A-ZÀ-Ý][a-zà-ÿ]{2,}$/.test(w) && !['Soutien-gorge', 'Culotte', 'Slip', 'String', 'Tanga'].includes(w));
  const ma = model(a);
  return model(b).some((w) => ma.includes(w));
}

/** Coordonnés = même nom de modèle dans la même maison (ex. soutien-gorge et culotte Agathe). */
export const coordinated = (p: Product) => PRODUCTS.filter((q) => q.slug !== p.slug && q.brand === p.brand && q.category !== p.category && sharedWord(q.name, p.name));

export const sizeLabelsFor = (p: Product): string[] => {
  if (p.sizes.cups?.length && p.sizes.bands?.length) return p.sizes.bands.flatMap((b) => p.sizes.cups!.map((c) => `${b}${c}`));
  return p.sizes.alpha || [];
};
