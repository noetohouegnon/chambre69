/**
 * IMPORT EN MASSE (facultatif) : crée des fiches produits à partir des dossiers photos du dépôt.
 * Pour un ajout ponctuel, utilisez plutôt l'espace d'administration (/admin).
 *
 *   npm run import-dossiers
 *
 * Seules les fiches qui n'existent pas encore dans content/produits/ sont créées :
 * les fiches existantes (et leurs modifications faites depuis /admin) ne sont jamais écrasées.
 *
 * - Chaque dossier « produit » (avec fiche .docx, ou quelques photos d'une même pièce)
 *   devient UNE fiche produit avec sa galerie.
 * - Les dossiers « en vrac » (photos WhatsApp sans fiche) donnent une fiche par photo.
 * - Les photos sont converties en WebP (480 px et 960 px de large) dans public/media.
 * - Le résultat est écrit dans content/produits/<identifiant>.json.
 *
 * Les tailles sont des AMPLITUDES PROVISOIRES par maison, à corriger depuis /admin.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import mammoth from 'mammoth';

const PROJECT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ROOT = path.resolve(PROJECT, '..');
const OUT_MEDIA = path.join(PROJECT, 'public', 'media');
const WIDTHS = [480, 960];
const IMG_RE = /\.(jpe?g|png|webp|avif)$/i;

const CUPS = 'ABCDEFGHIJKLMNO'.split('');
const cupRange = (from, to) => CUPS.slice(CUPS.indexOf(from), CUPS.indexOf(to) + 1);
const tours = (a, b) => { const r = []; for (let t = a; t <= b; t += 5) r.push(t); return r; };

/** Dossiers racine → maison / rubrique. */
const SOURCES = {
  Empreinte: { brand: 'Empreinte', origin: 'France', kind: 'maison', bra: { cups: cupRange('B', 'H'), bands: tours(80, 110) }, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  Elomi: { brand: 'Elomi', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('D', 'O'), bands: tours(85, 120) }, alpha: ['L', 'XL', '2XL', '3XL'] },
  'Louisa bracq': { brand: 'Louisa Bracq', origin: 'France', kind: 'maison', bra: { cups: cupRange('A', 'E'), bands: tours(75, 95) }, alpha: ['S', 'M', 'L', 'XL'] },
  Freya: { brand: 'Freya', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('C', 'K'), bands: tours(70, 95) }, alpha: ['S', 'M', 'L', 'XL'] },
  Fantasie: { brand: 'Fantasie', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('C', 'K'), bands: tours(75, 100) }, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  'curvy kate': { brand: 'Curvy Kate', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('D', 'K'), bands: tours(70, 95) }, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  'Dita von teese': { brand: 'Dita Von Teese', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('B', 'G'), bands: tours(70, 90) }, alpha: ['S', 'M', 'L', 'XL'] },
  Wacoal: { brand: 'Wacoal', origin: 'Angleterre', kind: 'maison', bra: { cups: cupRange('B', 'H'), bands: tours(75, 100) }, alpha: ['S', 'M', 'L', 'XL'] },
  'Ysabel Mora': { brand: 'Ysabel Mora', origin: 'Espagne', kind: 'maison', bra: { cups: cupRange('A', 'D'), bands: tours(80, 100) }, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  'Linga dore': { brand: 'LingaDore', origin: 'Europe', kind: 'maison', bra: null, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  'Lingerie traditionnelle africaine': { brand: 'Chambre 69', origin: 'Sénégal', kind: 'maison69', category: 'heritage', label: 'Nuisette traditionnelle', bulk: true, alpha: ['S', 'M', 'L', 'XL', '2XL', '3XL'] },
  'Chaines de taille': { brand: 'Chambre 69', origin: 'Sénégal', kind: 'maison69', category: 'heritage', label: 'Chaînes de taille', bulk: true, alpha: [] },
  'Senteurs, Encens et Huiles': { brand: 'Chambre 69', origin: 'Sélection Chambre 69', kind: 'maison69', category: 'heritage', label: 'Senteur et encens', bulk: true, alpha: [] },
  Kimonos: { brand: 'Chambre 69', origin: 'Sélection Chambre 69', kind: 'maison69', category: 'nuit', label: 'Ensemble kimono', bulk: true, alpha: ['S', 'M', 'L', 'XL', '2XL'] },
  'Lingerie Sexy': { brand: 'Chambre 69', origin: 'Sélection Chambre 69', kind: 'maison69', category: 'seduction', label: 'Ensemble séduction', bulk: true, alpha: ['S', 'M', 'L', 'XL'] },
  'Jouets pour adultes': { brand: 'Chambre 69', origin: 'Sélection Chambre 69', kind: 'maison69', category: 'bien-etre', label: 'Accessoire bien-être', bulk: true, alpha: [] },
};

const COLORS = [
  [/caf[eé]-au-lait/i, 'Café au lait'], [/pearl-blush/i, 'Rose nacré'], [/blue-leopard/i, 'Léopard bleu'],
  [/rainbow/i, 'Multicolore'], [/dark-violet/i, 'Violet profond'], [/rose-bud/i, 'Rose'], [/ash-rose|-ASE-/i, 'Rose cendré'],
  [/heather|-HER-/i, 'Bruyère'], [/midnight|-MIH-/i, 'Bleu nuit'], [/sahara|-SAH-/i, 'Sable'], [/antique-gold|-AND-/i, 'Or antique'],
  [/inky-flower|-INR-/i, 'Encre fleurie'], [/naturally-nude|nude/i, 'Nude'], [/ivory/i, 'Ivoire'], [/white/i, 'Blanc'],
  [/\bjet\b|-jet-/i, 'Noir'], [/black|noir|-BLK-|-NOR-|negro/i, 'Noir'],
  [/blanc de lait/i, 'Blanc de lait'], [/couleur blanche/i, 'Blanc'], [/rouge bordeaux/i, 'Rouge bordeaux'], [/\brose\b/i, 'Rose'],
];

const TRANSLATE = [
  [/\bsmoothing moulded strapless\b/gi, 'Smoothing moulé sans bretelles'],
  [/\bsmooth strapless bra\b/gi, 'Smooth sans bretelles'],
  [/\bsmooth moulded bra\b/gi, 'Smooth moulé'],
  [/\bsuperplunge strapless\b/gi, 'Superplunge sans bretelles'],
  [/\bsport everymove wired multiway\b/gi, 'Everymove sport à armatures multipositions'],
  [/\bnaked wired non padded bra\b/gi, 'Naked à armatures, non rembourré'],
  [/\bnaked wired padded bra\b/gi, 'Naked à armatures, rembourré'],
  [/\bnon padded unwired\b/gi, 'sans armatures, non rembourré'],
  [/\bnon wired bra\b|\bnon wired\b/gi, 'sans armatures'],
  [/\bplunge bra\b/gi, 'plongeant'], [/\buw bra\b/gi, 'à armatures'], [/\ballure\b/gi, 'Allure'],
  [/\bhigh leg brief\b/gi, 'échancrée'], [/\bhigh waist brief\b/gi, 'taille haute'], [/\bhigh waist panty\b/gi, 'taille haute'],
  [/\bfull brief\b/gi, 'couvrante'], [/\bthong\b/gi, ''], [/\bbrief\b/gi, ''], [/\bbra\b/gi, ''],
  [/\bfly front fastening\b/gi, 'ouverture braguette'], [/\bfastening boxer brief\b/gi, 'boxer'], [/\bfastening brief\b/gi, ''],
  [/\bbraga alta\b/gi, 'taille haute'], [/\bbraga brasilena\b/gi, 'brésilienne'], [/\bmidi hipster\b/gi, 'midi'],
  [/\bfil d_écosse\b/gi, "fil d'Écosse"], [/\bpinky\b/gi, 'Pinky'], [/\bsensu lace\b/gi, 'Sensu'], [/\bnatsuki lace\b/gi, 'Natsuki'],
  [/\bembrace lace\b/gi, 'Embrace'], [/\bfusion lace\b/gi, 'Fusion dentelle'], [/\bshow off\b/gi, 'Show Off'], [/\btailored\b/gi, 'Tailored'],
  [/\bmaltida\b/gi, 'Matilda'], [/\bcassiope\b/gi, 'Cassiopée'], [/\bcassiopee\b/gi, 'Cassiopée'], [/\btaegan\b/gi, 'Teagan'],
  [/\braffine\b/gi, 'Raffiné'], [/\bfloril[eè]ge\b/gi, 'Florilège'], [/\bbriana\b/gi, 'Brianna'],
];

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/['’]/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const title = (s) => s.replace(/\s+/g, ' ').trim().replace(/(^|\s)([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());

function categorize(rel) {
  const parts = rel.toLowerCase().split('/');
  const leaf = parts[parts.length - 1];
  const all = parts.join(' ');
  if (/homme|boxer/.test(all)) return 'homme';
  if (/jar+et/.test(all)) return 'porte-jarretelles';
  if (/\bbra\b|soutien/.test(leaf)) return 'soutiens-gorge';
  if (/brief|thong|slip|culotte|tanga|string|panty/.test(leaf)) return 'culottes';
  if (/nuisette|pyjama|chemise de nuit|kimono|camisole/.test(all)) return 'nuit';
  if (/chaussette|d[ée]bardeur|t shirt|body|jeune fille/.test(all)) return 'basiques';
  if (/soutien/.test(all)) return 'soutiens-gorge';
  if (/slip|culotte/.test(all)) return 'culottes';
  return 'basiques';
}

function typeLabel(category, leaf) {
  const l = leaf.toLowerCase();
  if (category === 'soutiens-gorge') return 'Soutien-gorge';
  if (category === 'porte-jarretelles') return 'Porte-jarretelles';
  if (category === 'homme') return /d[ée]bardeur/.test(l) ? '' : /boxer|fly front/.test(l) ? 'Boxer homme' : 'Slip homme';
  if (category === 'culottes') {
    if (/tanga/.test(l)) return 'Tanga';
    if (/thong|string/.test(l)) return 'String';
    if (/slip/.test(l) && !/culotte/.test(l)) return 'Slip';
    return 'Culotte';
  }
  return '';
}

function cleanName(leaf, brand, category) {
  let n = leaf.replace(/_/g, ' ');
  for (const [re, rep] of TRANSLATE) n = n.replace(re, rep);
  n = n.replace(/soutiens? ?gorges?|soutien|\bslip\b|\bculottes?\b|\btanga\b|collection|lingadore/gi, ' ');
  n = n.replace(new RegExp(brand.replace(/\s+/g, '\\s*'), 'gi'), ' ');
  n = n.replace(/\s+/g, ' ').trim();
  const t = typeLabel(category, leaf);
  const pretty = n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
  const isProperModel = pretty && /^[A-ZÀ-Ý]/.test(pretty) && !/^(Femme|Homme|Basiques?|Nuisette|Pyjamas?|Chemise|Débardeur|Body|T shirt|Chaussettes|Lingerie|Ensemble|Culotte|High|Taille)/i.test(pretty);
  const tidy = (s) => s
    .replace(/\b(Sans|Bretelles|Armatures|Non|Rembourré|Moulé|Plongeant|Échancrée|Couvrante|Taille|Haute|Sport|Multipositions|Dentelle|À|De|Brésilienne|Ouverture|Braguette)\b/g, (w) => w.toLowerCase())
    .replace(/\b(\p{L}+)( \1\b)+/giu, '$1').replace(/(taille haute)( taille haute)+/gi, '$1').replace(/\s+/g, ' ').trim();
  if (t && pretty) return tidy(`${t} ${isProperModel ? title(pretty) : pretty.toLowerCase()}`);
  if (t) return t;
  return tidy(pretty.replace(/\bt shirt\b/i, 'T-shirt').replace(/^T shirt/i, 'T-shirt').replace(/vetement/i, 'vêtement').replace(/fil d écosse/i, "fil d'Écosse"));
}

function colorFrom(text) {
  for (const [re, c] of COLORS) if (re.test(text)) return c;
  return null;
}

async function docxText(dir) {
  const docs = fs.readdirSync(dir).filter((f) => /\.docx$/i.test(f) && !f.startsWith('~$'));
  const chunks = [];
  for (const d of docs) {
    try {
      const { value } = await mammoth.extractRawText({ path: path.join(dir, d) });
      chunks.push(value);
    } catch { /* fichier illisible : ignoré */ }
  }
  return chunks.join('\n\n');
}

function parseDescription(raw) {
  if (!raw) return {};
  const lines = raw.split(/\n+/).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  let reference = null;
  const composition = [];
  const care = [];
  const features = [];
  const paragraphs = [];
  const sizes = [];
  const colors = [];
  let mode = null;
  for (const line of lines) {
    const ref = line.match(/^(r[ée]f[ée]rence|r[ée]f\.?|code produit)\s*:?\s*(.+)$/i);
    if (ref) { reference = ref[2].replace(/^(marque|style)\s*:\s*/i, '').trim(); continue; }
    if (/^caract[ée]ristiques\s*:?$/i.test(line)) { mode = 'features'; continue; }
    if (/^composition\s*:?$/i.test(line)) { mode = 'composition'; continue; }
    if (/^description\s*:?$/i.test(line)) { mode = 'desc'; continue; }
    if (/^(taille|tailles)\s*:?$/i.test(line) || /^couleurs?\s*:?$/i.test(line)) { mode = 'sizes'; continue; }
    const clean = line.replace(/^[-•·]\s*/, '');
    if (/^(XS|S|M|L|XL|XXL|[2-4]XL)(\s*[-/,]\s*(XS|S|M|L|XL|XXL|[2-4]XL))*$/i.test(clean)) { sizes.push(...clean.toUpperCase().split(/\s*[-/,]\s*/)); continue; }
    if (/^(rose|noir|blanc|beige|nude|chair|bleu|rouge|gris|marine|ivoire)s?$/i.test(clean)) { colors.push(title(clean)); continue; }
    if (/lavage|laver|repassage|s[ée]chage|chlore|nettoyage/i.test(clean)) { care.push(clean); continue; }
    if (mode === 'composition' || /\d+\s*%/.test(clean)) { composition.push(clean); continue; }
    if (clean.length < 90 && mode !== 'desc') { features.push(clean); continue; }
    paragraphs.push(clean);
  }
  return { reference, composition, care, features: features.slice(0, 10), description: paragraphs.join('\n\n'), docSizes: sizes, docColors: colors };
}

async function processImage(src, slug, idx) {
  const dir = path.join(OUT_MEDIA, slug);
  fs.mkdirSync(dir, { recursive: true });
  const meta = await sharp(src, { failOn: 'none' }).rotate().metadata();
  let w = meta.width || 1000, h = meta.height || 1000;
  if (meta.orientation && meta.orientation >= 5) [w, h] = [h, w];
  const out = {};
  for (const width of WIDTHS) {
    const file = path.join(dir, `${idx}-${width}.webp`);
    if (!fs.existsSync(file)) {
      await sharp(src, { failOn: 'none' }).rotate()
        .resize({ width: Math.min(width, w), withoutEnlargement: true })
        .webp({ quality: width > 500 ? 74 : 70, effort: 4 })
        .toFile(file);
    }
    out[width] = `/media/${slug}/${idx}-${width}.webp`;
  }
  // Vignette JPEG pour les aperçus de partage (WhatsApp, Messenger…), plus sûre que le WebP.
  const og = path.join(dir, 'og.jpg');
  if (idx === 0 && !fs.existsSync(og)) {
    await sharp(src, { failOn: 'none' }).rotate().resize(600, 630, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).jpeg({ quality: 72, mozjpeg: true }).toFile(og);
  }
  return { src: out[960], srcSmall: out[480], ratio: +(w / h).toFixed(3), width: w };
}

function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const imgs = entries.filter((e) => e.isFile() && IMG_RE.test(e.name)).map((e) => e.name).sort();
  const hasDoc = entries.some((e) => e.isFile() && /\.docx$/i.test(e.name));
  if (imgs.length) res.push({ dir, imgs, hasDoc });
  for (const e of entries) if (e.isDirectory() && !e.name.startsWith('.')) res.push(...walk(path.join(dir, e.name)));
  return res;
}

async function main() {
  const products = [];
  const usedSlugs = new Set();
  const uniqueSlug = (base) => { let s = base, i = 2; while (usedSlugs.has(s)) s = `${base}-${i++}`; usedSlugs.add(s); return s; };

  for (const [folder, cfg] of Object.entries(SOURCES)) {
    const base = path.join(ROOT, folder);
    if (!fs.existsSync(base)) { console.warn('absent :', folder); continue; }
    const groups = walk(base);
    for (const g of groups) {
      const rel = path.relative(base, g.dir).replace(/\\/g, '/');
      const leaf = path.basename(g.dir);
      // Les vignettes 110x154 sont trop petites : on les écarte si d'autres photos existent.
      let imgs = g.imgs.filter((f) => !/^110x154/.test(f));
      if (!imgs.length) imgs = g.imgs;

      // Regroupement : une fiche par dossier, sauf dossiers « en vrac ».
      let sets;
      const bulk = cfg.bulk && !g.hasDoc && imgs.length > 2;
      if (bulk) sets = imgs.map((f) => [f]);
      else {
        // Préfixe numérique (ex. 10117-7-…, 10157-1-…) : plusieurs modèles dans un même dossier.
        const byPrefix = {};
        for (const f of imgs) { const m = f.match(/^(\d{4,})-\d+-/); const k = m ? m[1] : '_'; (byPrefix[k] ||= []).push(f); }
        sets = Object.values(byPrefix);
      }

      const raw = g.hasDoc ? await docxText(g.dir) : '';
      const parsed = parseDescription(raw);

      for (let si = 0; si < sets.length; si++) {
        const files = sets[si];
        const category = cfg.category || categorize(`${folder}/${rel}`);
        let name;
        const subLabel = rel && rel !== '.' ? leaf : '';
        if (cfg.kind === 'maison69') {
          let label = cfg.label;
          if (/nuisette traditionnelle/i.test(subLabel)) label = 'Nuisette traditionnelle';
          else if (/nuisette/i.test(subLabel)) label = 'Nuisette';
          else if (/dentelle/i.test(subLabel)) label = 'Ensemble deux pièces en dentelle';
          else if (/deux pi[eè]ces/i.test(subLabel)) label = 'Ensemble deux pièces';
          else if (/kimono et robe/i.test(subLabel)) label = 'Ensemble kimono et robe de soie';
          else if (/kimono sexy/i.test(subLabel)) label = 'Ensemble kimono';
          const col = colorFrom(subLabel);
          name = col && folder === 'Kimonos' ? `${label} ${col.toLowerCase()}` : label;
          if (sets.length > 1) name = `${name} — modèle ${String(si + 1).padStart(2, '0')}`;
        } else {
          name = cleanName(leaf === folder ? cfg.brand : leaf, cfg.brand, category);
          if (/^Soutien gorge$/i.test(leaf) && sets.length > 1) name = `Soutien-gorge ${['Naked', 'Carina push-up'][si] || `modèle ${si + 1}`}`;
          if (!name) name = `${cfg.brand} — pièce`;
        }
        const hash = crypto.createHash('md5').update(`${folder}/${rel}/${files.join('|')}`).digest('hex');
        const slug = uniqueSlug(slugify(`${name.replace(/—/g, ' ')} ${cfg.kind === 'maison' ? cfg.brand : ''}`).slice(0, 80));
        const images = [];
        for (let i = 0; i < files.length; i++) {
          try {
            images.push(await processImage(path.join(g.dir, files[i]), slug, i));
          } catch (e) { console.warn('  image ignorée', files[i], e.message); }
        }
        if (!images.length) continue;
        // Photo « détourée » (cut/cutout/primary) en premier pour la vignette catalogue.
        const order = files.map((f, i) => ({ f, i, score: /primary|cutout|cut-/i.test(f) ? 0 : /back|-b[_ -]|_b\d?_/i.test(f) ? 2 : 1 }));
        order.sort((a, b) => a.score - b.score || a.i - b.i);
        const sortedImages = order.map((o) => images[o.i]).filter(Boolean);

        const color = colorFrom(files.join(' ') + ' ' + subLabel) || (parsed.docColors?.[0] ?? null);
        const sizes = {};
        if (category === 'soutiens-gorge' && cfg.bra) { sizes.cups = cfg.bra.cups; sizes.bands = cfg.bra.bands; }
        else if (cfg.alpha?.length && !['heritage'].includes(category) || (category === 'heritage' && cfg.alpha?.length)) sizes.alpha = parsed.docSizes?.length ? [...new Set(parsed.docSizes)] : cfg.alpha;
        if (category === 'soutiens-gorge' && /sport/i.test(leaf)) sizes.cups = cupRange('D', 'K');

        const isNew = files.some((f) => /(AW|SS)2[56]|2026/i.test(f));
        products.push({
          slug,
          name,
          brand: cfg.brand,
          brandKind: cfg.kind,
          origin: cfg.origin,
          category,
          reference: parsed.reference || `C69-${hash.slice(0, 6).toUpperCase()}`,
          color,
          description: parsed.description || '',
          features: parsed.features || [],
          composition: parsed.composition || [],
          care: parsed.care || [],
          sizes,
          sizesProvisional: true,
          price: null,
          isNew,
          images: sortedImages,
          source: `${folder}/${rel === '.' ? '' : rel}`.replace(/\/$/, ''),
        });
        process.stdout.write('.');
      }
    }
  }
  // Noms en double au sein d'une même maison : on distingue par la couleur, sinon par un numéro.
  const seen = {};
  for (const p of products) { const k = `${p.brand}|${p.name}`; (seen[k] ||= []).push(p); }
  for (const list of Object.values(seen)) {
    if (list.length < 2 || /modèle \d/.test(list[0].name)) continue;
    const colors = new Set(list.map((p) => p.color));
    list.forEach((p, i) => { p.name = colors.size === list.length && p.color ? `${p.name} — ${p.color.toLowerCase()}` : `${p.name} — modèle ${i + 1}`; });
  }
  const contentDir = path.join(PROJECT, 'content', 'produits');
  fs.mkdirSync(contentDir, { recursive: true });
  let created = 0;
  for (const p of products) {
    const file = path.join(contentDir, `${p.slug}.json`);
    if (fs.existsSync(file)) continue;
    const { slug, brandKind, source, images, ...rest } = p;
    fs.writeFileSync(file, JSON.stringify({ ...rest, images: images.map((im) => im.src), hidden: false, rank: 0 }, null, 2));
    created++;
  }
  console.log(`\n${products.length} fiches lues dans les dossiers, ${created} nouvelle(s) fiche(s) créée(s) dans content/produits.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
