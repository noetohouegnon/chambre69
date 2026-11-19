/**
 * Prépare le catalogue à partir des fiches produits modifiables dans l'espace d'administration.
 *
 *   content/produits/<identifiant>.json   (une fiche par produit, modifiée depuis /admin)
 *        ↓  node scripts/prepare-content.mjs   (lancé automatiquement par npm run dev / build)
 *   src/data/catalog.json                 (fichier généré, ne pas modifier à la main)
 *
 * Les photos ajoutées depuis l'administration (public/media/uploads/…) sont redimensionnées
 * ici en deux tailles WebP (480 et 960 px) dans public/media/generated/, pour un site rapide.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const dir = path.join(root, 'content/produits');
const genDir = path.join(pub, 'media/generated');
fs.mkdirSync(genDir, { recursive: true });

/** Provenance par défaut de chaque maison (quand la fiche ne la précise pas). */
const ORIGIN = {
  Empreinte: 'France', 'Louisa Bracq': 'France', Elomi: 'Angleterre', Freya: 'Angleterre', Fantasie: 'Angleterre',
  'Curvy Kate': 'Angleterre', 'Dita Von Teese': 'Angleterre', Wacoal: 'Angleterre', 'Ysabel Mora': 'Espagne', LingaDore: 'Europe',
  'Chambre 69': 'Sélection Chambre 69', KRIZALID: 'Sénégal',
};
const OWN_BRANDS = ['Chambre 69', 'KRIZALID'];
const CATEGORIES = ['soutiens-gorge', 'culottes', 'porte-jarretelles', 'nuit', 'basiques', 'heritage', 'seduction', 'bien-etre', 'homme'];

const list = (v) => (Array.isArray(v) ? v : typeof v === 'string' && v.trim() ? v.split('\n') : []).map((x) => (typeof x === 'string' ? x.trim() : x)).filter(Boolean);
const ratioCache = new Map();

async function prepareImage(src) {
  if (typeof src !== 'string' || !src.trim()) return null;
  src = src.trim();
  const file = path.join(pub, decodeURIComponent(src).replace(/^\//, ''));
  if (!fs.existsSync(file)) { console.warn(`  ! photo introuvable, ignorée : ${src}`); return null; }

  // Photos déjà optimisées (…-960.webp accompagnée de …-480.webp).
  const small = src.replace(/-960\.webp$/, '-480.webp');
  if (src.endsWith('-960.webp') && fs.existsSync(path.join(pub, small.replace(/^\//, '')))) {
    if (!ratioCache.has(file)) { const m = await sharp(file).metadata(); ratioCache.set(file, { ratio: +(m.width / m.height).toFixed(3), width: m.width }); }
    return { src, srcSmall: small, ...ratioCache.get(file) };
  }

  // Photo ajoutée depuis l'administration : on génère les deux tailles une seule fois.
  const buf = fs.readFileSync(file);
  const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
  const base = path.basename(file).replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const name = `${base}-${hash}`;
  const out960 = path.join(genDir, `${name}-960.webp`), out480 = path.join(genDir, `${name}-480.webp`);
  if (!fs.existsSync(out960)) await sharp(buf).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out960);
  if (!fs.existsSync(out480)) await sharp(buf).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out480);
  const m = await sharp(out960).metadata();
  return { src: `/media/generated/${name}-960.webp`, srcSmall: `/media/generated/${name}-480.webp`, ratio: +(m.width / m.height).toFixed(3), width: m.width };
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
const products = [];
let errors = 0;
for (const f of files) {
  const slug = f.replace(/\.json$/, '');
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { console.warn(`  ! fiche illisible, ignorée : ${f} (${e.message})`); errors++; continue; }
  if (!d.name || !d.brand) { console.warn(`  ! fiche sans nom ou sans maison, ignorée : ${f}`); errors++; continue; }
  const category = CATEGORIES.includes(d.category) ? d.category : 'seduction';
  const images = (await Promise.all(list(d.images).map((x) => prepareImage(typeof x === 'object' && x ? x.src || x.image : x)))).filter(Boolean);
  if (!images.length) { console.warn(`  ! fiche sans photo, ignorée : ${f}`); errors++; continue; }
  const sz = d.sizes || {};
  const sizes = {};
  if (list(sz.cups).length) sizes.cups = list(sz.cups).map(String).sort();
  if (list(sz.bands).length) sizes.bands = list(sz.bands).map(Number).filter(Boolean).sort((a, b) => a - b);
  if (list(sz.alpha).length) sizes.alpha = list(sz.alpha).map(String);
  const own = OWN_BRANDS.includes(d.brand);
  products.push({
    slug,
    name: String(d.name).trim(),
    brand: d.brand,
    brandKind: own ? 'maison69' : 'maison',
    origin: d.origin || ORIGIN[d.brand] || 'Europe',
    category,
    reference: d.reference || `C69-${crypto.createHash('sha1').update(slug).digest('hex').slice(0, 6).toUpperCase()}`,
    color: d.color || null,
    description: d.description || '',
    features: list(d.features),
    composition: list(d.composition),
    care: list(d.care),
    sizes,
    sizesProvisional: d.sizesProvisional !== false,
    price: typeof d.price === 'number' && d.price > 0 ? d.price : null,
    isNew: Boolean(d.isNew),
    images,
    ...(d.hidden ? { hidden: true } : {}),
    ...(d.lastPieces ? { lastPieces: true } : {}),
    ...(list(d.unavailable).length ? { unavailable: list(d.unavailable) } : {}),
    ...(list(d.stores).length ? { stores: list(d.stores) } : {}),
    ...(list(d.fit).length ? { fit: list(d.fit).slice(0, 3) } : {}),
    _rank: typeof d.rank === 'number' ? d.rank : 0,
  });
}
products.sort((a, b) => a._rank - b._rank || a.slug.localeCompare(b.slug));
products.forEach((p) => delete p._rank);
fs.writeFileSync(path.join(root, 'src/data/catalog.json'), JSON.stringify(products));
console.log(`Catalogue : ${products.length} fiches prêtes (${products.filter((p) => p.hidden).length} masquées)${errors ? `, ${errors} ignorée(s)` : ''}.`);
