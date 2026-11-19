import { PRODUCTS, CATEGORIES, type Product } from '../data/catalog';

/** Recherche tolérante aux fautes de frappe et aux accents (4.5). */
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = tmp;
      rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

/** Abréviations développées (tous les mots doivent être trouvés). */
const EXPAND: Record<string, string> = {
  'sg': 'soutien gorge', 'soutif': 'soutien gorge', 'bra': 'soutien gorge', 'culote': 'culotte',
  'nuisettes': 'nuisette', 'grande': '', 'taille': '', 'tailles': '',
};
/** Synonymes : le mot est trouvé si l'une des variantes est présente. */
const ALTERNATIVES: Record<string, string[]> = {
  encens: ['encens', 'mamoul', 'mamool', 'oudh', 'agarwood'],
  thiouraye: ['encens', 'mamoul', 'mamool', 'oudh', 'agarwood'],
  parfum: ['parfum', 'huile', 'encens'],
  parfums: ['parfum', 'huile', 'encens'],
  senteur: ['parfum', 'huile', 'encens'],
  senteurs: ['parfum', 'huile', 'encens'],
  bin: ['chaines'], binbin: ['chaines'], perles: ['chaines', 'perles'],
  pyjama: ['pyjama', 'pyjamas'], pyjamas: ['pyjama', 'pyjamas'],
  kimonos: ['kimono'], bodys: ['body'], sextoy: ['bien', 'vibromasseur', 'godemiche', 'satisfyer'], jouet: ['bien', 'vibromasseur', 'godemiche', 'satisfyer'],
  homme: ['homme', 'boxer', 'slip'],
};

const index = new Map<string, string[]>();
function tokensOf(p: Product) {
  let t = index.get(p.slug);
  if (!t) {
    const cat = CATEGORIES.find((c) => c.id === p.category)?.label || '';
    t = norm(`${p.name} ${p.brand} ${cat} ${p.color || ''} ${p.reference} ${p.lines.join(' ')} ${(p.sizes.cups || []).map((c) => `bonnet${c}`).join(' ')} ${(p.sizes.bands || []).map((b) => `dos${b}`).join(' ')} ${(p.sizes.alpha || []).map((a) => `taille${a}`).join(' ')}`).split(' ');
    index.set(p.slug, t);
  }
  return t;
}

export function searchProducts(query: string, pool: Product[] = PRODUCTS): Product[] {
  let q = norm(query);
  if (!q) return pool;
  // « bonnet g » → jeton bonnetg
  q = q.replace(/\bbonnet ([a-o])\b/g, 'bonnet$1');
  // « 95E » ou « 95 e » → tour de dos 95 + bonnet E
  q = q.replace(/\b(6[5-9]|[7-9]\d|1[0-3]\d) ?([a-o])\b/g, 'dos$1 bonnet$2');
  // « taille XL » → jeton tailleXL
  q = q.replace(/\btaille (xs|s|m|l|xl|2xl|3xl|xxl)\b/g, 'taille$1');
  const words = q.split(' ').flatMap((w) => (EXPAND[w] !== undefined ? EXPAND[w].split(' ') : [w])).filter((w) => w.length > 0);
  if (!words.length) return pool;
  const scored: { p: Product; s: number }[] = [];
  for (const p of pool) {
    const toks = tokensOf(p);
    let score = 0;
    let all = true;
    for (const word of words) {
      let best = 0;
      for (const w of ALTERNATIVES[word] || [word]) {
        const exactOnly = /^(dos\d|bonnet[a-o]$|taille)/.test(w); // une taille se cherche exactement
        for (const t of toks) {
          if (t === w) { best = 3; break; }
          if (exactOnly) continue;
          if (w.length >= 2 && t.startsWith(w)) best = Math.max(best, 2);
          else if (w.length >= 4 && lev(w, t.slice(0, w.length + 1), w.length > 6 ? 2 : 1) <= (w.length > 6 ? 2 : 1)) best = Math.max(best, 1);
        }
        if (best === 3) break;
      }
      if (!best) { all = false; break; }
      score += best;
    }
    if (all) scored.push({ p, s: score });
  }
  return scored.sort((a, b) => b.s - a.s).map((x) => x.p);
}
