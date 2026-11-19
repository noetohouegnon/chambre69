/**
 * Génère l'identité technique (1.1, 1.7) : images de partage 1200×630 par type de page,
 * favicon, icônes d'écran d'accueil et manifeste, aux couleurs de la charte graphique (oct. 2026).
 * Usage : node scripts/build-brand-assets.mjs
 * Nécessite les polices Italiana et Jost installées sur la machine (fontconfig) ; les fichiers
 * sont dans node_modules/@fontsource/italiana et node_modules/@fontsource/jost (à copier dans ~/.fonts).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pub = path.join(root, 'public');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalog.json'), 'utf8'));
const img = (slug) => { const p = catalog.find((x) => x.slug === slug); return p ? path.join(pub, p.images[0].src) : null; };
fs.mkdirSync(path.join(pub, 'og'), { recursive: true });
fs.mkdirSync(path.join(pub, 'icons'), { recursive: true });

const BORDEAUX = '#5A1725', CREME = '#F4F2EE', OR = '#E49D27', TEXTE = '#4B3438';
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const OG = [
  { name: 'accueil', title: ['Toutes les tailles.', 'Toutes les morphologies.'], sub: 'Du bonnet A au bonnet O — Dakar', photo: 'soutien-gorge-agathe-empreinte' },
  { name: 'boutique', title: ['La boutique en ligne'], sub: 'Empreinte, Elomi, Louisa Bracq — du A au O', photo: 'soutien-gorge-morgan-elomi' },
  { name: 'heritage', title: ['Notre héritage,', 'au niveau qu’il mérite'], sub: 'Bétio et lingerie traditionnelle', photo: 'nuisette-traditionnelle-modele-03' },
  { name: 'mariee', title: ['Le trousseau', 'de la mariée'], sub: 'Liste de trousseau à partager', photo: 'ensemble-kimono-blanc-de-lait' },
  { name: 'apres-mastectomie', title: ['Avec ou sans.', 'Femme entièrement.'], sub: 'Prothèses et brassières — Dakar', photo: null },
  { name: 'conseils', title: ['L’École du', 'bon maintien'], sub: 'Trouvez votre taille en deux minutes', photo: null },
  { name: 'boutiques', title: ['Point E', 'et Corniche Ouest'], sub: 'Nos deux boutiques à Dakar', photo: 'BOUTIQUE' },
  { name: 'diaspora', title: ['Livrée chez vous,', 'ou chez votre mère'], sub: 'Afrique de l’Ouest et international', photo: 'soutien-gorge-zarla-elomi' },
];

const logo = await sharp(path.join(pub, 'brand/logo-wide.png')).resize({ height: 72 }).png().toBuffer();

for (const o of OG) {
  const hasPhoto = !!o.photo;
  const textW = hasPhoto ? 700 : 1200;
  const lines = o.title.map((t, i) => `<text x="72" y="${290 + i * 72}" font-family="Italiana" font-size="54" fill="${BORDEAUX}">${xml(t)}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="${CREME}"/>
    <rect x="${textW - 2}" y="0" width="2" height="630" fill="${OR}" opacity="${hasPhoto ? 1 : 0}"/>
    ${lines}
    <text x="72" y="${290 + o.title.length * 72 + 26}" font-family="Jost" font-size="30" fill="${TEXTE}">${xml(o.sub)}</text>
    <rect x="72" y="548" width="56" height="2" fill="${OR}"/>
    <text x="72" y="585" font-family="Jost" font-size="22" letter-spacing="4" fill="${BORDEAUX}">AU-DELÀ DE LA LINGERIE</text>
  </svg>`;
  const layers = [{ input: Buffer.from(svg), top: 0, left: 0 }, { input: logo, top: 64, left: 64 }];
  if (hasPhoto) {
    const src = o.photo === 'BOUTIQUE' ? path.join(root, 'src/assets/img_btq.jpeg') : img(o.photo);
    if (src) layers.push({ input: await sharp(src).resize(500, 630, { fit: 'cover', position: 'attention' }).toBuffer(), top: 0, left: 700 });
  }
  const out = path.join(pub, 'og', `${o.name}.jpg`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: CREME } }).composite(layers).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  console.log(o.name, Math.round(fs.statSync(out).size / 1024), 'Ko');
}

// Icônes : logo d'origine (C69 doré), conservées telles quelles dans public/icons et public/favicon.ico.

fs.writeFileSync(path.join(pub, 'manifest.webmanifest'), JSON.stringify({
  name: 'Chambre 69 — Au-delà de la lingerie',
  short_name: 'Chambre 69',
  description: 'Lingerie du bonnet A au bonnet O, Dakar.',
  lang: 'fr',
  start_url: '/',
  display: 'standalone',
  background_color: CREME,
  theme_color: BORDEAUX,
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));
console.log('Icônes et manifeste générés.');
