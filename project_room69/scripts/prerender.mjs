/**
 * Pré-rendu statique (exigence 1.6) : chaque page clé est servie avec son HTML complet,
 * son titre, sa description et ses balises de partage — lisibles par Google et par les
 * robots de WhatsApp, Instagram, Messenger et LinkedIn, qui n'exécutent pas le JavaScript.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const { render, metaFor, allRoutes, SITE_URL } = ssr;
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Chambre 69',
  slogan: 'Au-delà de la lingerie',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icons/icon-512.png`,
  telephone: '+221787040505',
  sameAs: ['https://www.instagram.com/chambre_69', 'https://www.tiktok.com/@chambre__69'],
  address: { '@type': 'PostalAddress', addressLocality: 'Dakar', addressCountry: 'SN' },
};

function page(url, html, meta) {
  const canonical = `${SITE_URL}${url === '/' ? '/' : url}`;
  let out = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(meta.description)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${canonical}"`)
    .replace(/(<meta property="og:type" content=")[^"]*"/, `$1${meta.type === 'product' ? 'product' : meta.type === 'article' ? 'article' : 'website'}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(meta.title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(meta.description)}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${canonical}"`)
    .replace(/(<meta property="og:image" content=")[^"]*"/, `$1${meta.image}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${esc(meta.title)}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${esc(meta.description)}"`)
    .replace(/(<meta name="twitter:image" content=")[^"]*"/, `$1${meta.image}"`)
    .replace('<!--robots-->', meta.noindex ? '<meta name="robots" content="noindex" />' : '')
    .replace('<!--jsonld-->', url === '/' ? `<script type="application/ld+json">${JSON.stringify(ORG)}</script>` : '')
    .replace('<!--app-->', html);
  if (meta.type === 'product') out = out.replace(/(<meta property="og:image:width" content=")[^"]*"/, '$1600');
  return out;
}

const routes = allRoutes();
for (const url of routes) {
  const html = render(url);
  const file = url === '/' ? path.join(dist, 'index.html') : path.join(dist, url.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const out = page(url, html, metaFor(url));
  fs.writeFileSync(file, out);
  // Copie « /page.html » : servie pour « /page » sans barre finale (cleanUrls côté Vercel).
  if (url !== '/') fs.writeFileSync(path.join(dist, `${url.slice(1)}.html`), out);
}
// Page 404 personnalisée (1.7)
fs.writeFileSync(path.join(dist, '404.html'), page('/404', render('/page-introuvable'), metaFor('/page-introuvable')));

// Plan de site et robots (7.2)
const today = new Date().toISOString().slice(0, 10);
const indexable = routes.filter((u) => !metaFor(u).noindex);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /panier\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`Pré-rendu : ${routes.length} pages + 404, sitemap.xml, robots.txt`);
