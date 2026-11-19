import { BY_SLUG, PRODUCTS, productUrl, CATEGORIES } from '../data/catalog';
import { SITE_URL } from '../data/site';
import { ARTICLES } from '../data/articles';

export type Meta = { title: string; description: string; image: string; type?: 'website' | 'product' | 'article'; noindex?: boolean };

const og = (name: string) => `${SITE_URL}/og/${name}.jpg`;

/** Titres (55-60 caractères visés) et méta-descriptions (150-160) par page — 1.2 et 1.3. */
export const PAGES: Record<string, Meta> = {
  '/': {
    title: 'Chambre 69 — Lingerie du bonnet A au bonnet O, Dakar',
    description: "Lingerie haut de gamme du bonnet A au bonnet O. Empreinte, Elomi, Louisa Bracq. Boutiques Point E et Corniche Ouest, Dakar. Livraison Afrique de l'Ouest et international.",
    image: og('accueil'),
  },
  '/boutique': {
    title: 'La boutique en ligne, du bonnet A au O — Chambre 69',
    description: 'Soutiens-gorge, culottes, nuisettes et pièces traditionnelles, du bonnet A au bonnet O. Filtrez par bonnet, tour de dos et maison. Conseil gratuit sur WhatsApp.',
    image: og('boutique'),
  },
  '/toutes-les-tailles': {
    title: 'Du bonnet A au bonnet O, vraiment — Chambre 69',
    description: "Grande poitrine, petite poitrine, grossesse, ménopause, sport, après une mastectomie : l'amplitude de tailles la plus large d'Afrique de l'Ouest, en stock à Dakar.",
    image: og('accueil'),
  },
  '/heritage': {
    title: 'Bétio et lingerie traditionnelle moderne — Chambre 69',
    description: "Le bétio (pagne intime traditionnel), le bin-bin et le thiouraye, enfin au niveau qu'ils méritent : soie, finitions de maison. Livraison au Sénégal et en Afrique de l'Ouest.",
    image: og('heritage'),
  },
  '/mariee': {
    title: 'Trousseau de mariée à Dakar et liste partagée — Chambre 69',
    description: "Composez votre trousseau de mariée : maisons européennes, bétio, rendez-vous trousseau en boutique et liste à partager sur WhatsApp à vos proches, d'où qu'elles soient.",
    image: og('mariee'),
  },
  '/mariee/liste': {
    title: 'Créer ma liste de trousseau — Chambre 69',
    description: 'Composez votre liste de trousseau sans créer de compte, partagez-la sur WhatsApp et laissez vos proches choisir. Chaque pièce réservée disparaît de la liste.',
    image: og('mariee'),
  },
  '/apres-mastectomie': {
    title: 'Prothèse mammaire et lingerie après mastectomie, Dakar — Chambre 69',
    description: "Brassières post-opératoires, prothèses mammaires et soutiens-gorge à poche à Dakar. Rendez-vous privé en salon fermé, conseil sur WhatsApp, envoi dans la sous-région.",
    image: og('apres-mastectomie'),
  },
  '/conseils': {
    title: "L'École du bon maintien, nos conseils — Chambre 69",
    description: "Comment savoir si votre soutien-gorge est à votre taille, prendre soin de votre lingerie, se faire mesurer sans gêne : tout ce qu'on ne vous a jamais expliqué.",
    image: og('conseils'),
  },
  '/guide-des-tailles': {
    title: 'Guide des tailles de soutien-gorge — Chambre 69',
    description: 'Trouvez votre taille de soutien-gorge en deux mesures et deux minutes, du bonnet A au bonnet O, sans créer de compte. Une conseillère vérifie avec vous sur WhatsApp.',
    image: og('conseils'),
  },
  '/conseils/glossaire': {
    title: 'Glossaire des coupes et des matières — Chambre 69',
    description: "Tour de dos, bonnet, armature, balconnet, brassière post-opératoire, bétio, bin-bin : le vocabulaire de la lingerie expliqué simplement, sans jargon.",
    image: og('conseils'),
  },
  '/nos-boutiques': {
    title: 'Nos boutiques Point E et Corniche Ouest, Dakar — Chambre 69',
    description: "Deux boutiques de lingerie à Dakar, Point E et Corniche Ouest. Venez sans rendez-vous, faites-vous mesurer en salon fermé, retirez votre commande en ligne sur place.",
    image: og('boutiques'),
  },
  '/notre-histoire': {
    title: 'Pourquoi Chambre 69 existe — Notre histoire',
    description: "Une maison de lingerie née d'une injustice ordinaire : l'absence d'une offre haut de gamme réellement inclusive en Afrique de l'Ouest. L'histoire, le nom, le manifeste.",
    image: og('accueil'),
  },
  '/maisons': {
    title: 'Empreinte, Elomi, Louisa Bracq à Dakar — Chambre 69',
    description: "Les maisons européennes que nous avons choisies : Empreinte, Elomi, Louisa Bracq, Freya, Fantasie, Wacoal… Pièces authentiques importées de France, d'Espagne et d'Angleterre.",
    image: og('boutique'),
  },
  '/commander-depuis-l-etranger': {
    title: "Commander depuis l'étranger, livrer au pays — Chambre 69",
    description: "Vous vivez en France, en Italie ou aux États-Unis : commandez pour vous ou faites livrer votre mère à Dakar. Colis neutre, prix masqué, conseil en français sur WhatsApp.",
    image: og('diaspora'),
  },
  '/livraison-afrique-de-l-ouest': {
    title: "Lingerie livrée en Afrique de l'Ouest — Chambre 69",
    description: "Côte d'Ivoire, Mali, Burkina Faso, Guinée, Mauritanie, Gambie, Bénin, Togo : jusqu'au bonnet O, pièces authentiques et conseil sur WhatsApp avant de commander.",
    image: og('diaspora'),
  },
  '/rendez-vous': {
    title: 'Prendre rendez-vous en boutique — Chambre 69',
    description: 'Prise de mesures gratuite, essayage réservé, rendez-vous trousseau ou rendez-vous privé après mastectomie : choisissez votre boutique et votre créneau à Dakar.',
    image: og('boutiques'),
  },
  '/carte-cadeau': {
    title: 'Offrir une carte cadeau, montant libre — Chambre 69',
    description: "La carte cadeau Chambre 69 règle la question de la taille sans en avoir l'air. Montant libre, à offrir à Dakar ou depuis l'étranger, à utiliser en boutique ou en ligne.",
    image: og('accueil'),
  },
  '/panier': { title: 'Votre panier — Chambre 69', description: 'Votre sélection Chambre 69, finalisée avec une conseillère sur WhatsApp.', image: og('accueil'), noindex: true },
  '/faq': {
    title: 'Questions fréquentes : tailles, livraison, retours — Chambre 69',
    description: "Tailles, livraison au Sénégal et à l'international, règlement, échanges, discrétion de l'emballage, rendez-vous : les réponses à vos questions avant de commander.",
    image: og('accueil'),
  },
  '/livraison-retours': {
    title: 'Livraison, échanges et retours — Chambre 69',
    description: "Zones de livraison, délais, colis neutre, retrait en boutique, échange en boutique et règles d'hygiène : notre politique de livraison et de retour, en toute clarté.",
    image: og('accueil'),
  },
  '/contact': {
    title: 'Nous contacter — Chambre 69',
    description: 'Une conseillère vous répond sur WhatsApp au +221 78 704 05 05, y compris depuis l\'étranger. Formulaire de contact, boutiques de Dakar et délai de réponse annoncé.',
    image: og('accueil'),
  },
  '/inscription': {
    title: 'Recevoir notre guide des tailles — Chambre 69',
    description: 'Recevez notre guide des tailles et nos nouveautés : deux messages par mois, pas davantage. Désinscription en un clic, vos coordonnées ne sont jamais partagées.',
    image: og('conseils'),
  },
  '/presse': { title: 'Espace presse — Chambre 69', description: 'Logo, visuels haute définition et contact presse de Chambre 69, maison de lingerie experte et conseillère à Dakar.', image: og('accueil') },
  '/cgv': { title: 'Conditions générales de vente — Chambre 69', description: "Conditions générales de vente de Chambre 69, y compris pour les ventes à distance vers l'Afrique de l'Ouest et l'international.", image: og('accueil') },
  '/confidentialite': { title: 'Politique de confidentialité — Chambre 69', description: 'Comment Chambre 69 collecte, utilise et protège vos données personnelles, conformément à la loi sénégalaise et au règlement européen.', image: og('accueil') },
  '/cookies': { title: 'Politique de cookies — Chambre 69', description: 'Les cookies et traceurs utilisés sur le site Chambre 69, et comment accepter ou refuser leur dépôt.', image: og('accueil') },
};

export const NOT_FOUND: Meta = { title: 'Page introuvable — Chambre 69', description: "Cette page n'existe pas ou plus. Retrouvez la boutique en ligne ou écrivez à une conseillère sur WhatsApp.", image: og('accueil'), noindex: true };

export function metaFor(pathname: string): Meta {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (PAGES[path]) return PAGES[path];
  const prod = path.match(/^\/boutique\/([^/]+)$/);
  if (prod) {
    const p = BY_SLUG.get(prod[1]);
    if (p) {
      const desc = `${p.name} ${p.brand !== 'Chambre 69' ? `de la maison ${p.brand}` : 'Chambre 69'}. ${p.description ? p.description.slice(0, 80).replace(/\s+\S*$/, '') + '…' : ''} Conseil gratuit sur WhatsApp, emballage neutre, livraison Sénégal et international.`;
      return { title: `${p.name} — ${p.brand === 'Chambre 69' ? 'Chambre 69' : `${p.brand} — Chambre 69`}`, description: desc.replace(/\s+/g, ' ').trim().slice(0, 165), image: `${SITE_URL}/media/${p.slug}/og.jpg`, type: 'product' };
    }
  }
  const art = path.match(/^\/conseils\/([^/]+)$/);
  if (art) {
    const a = ARTICLES.find((x) => x.slug === art[1]);
    if (a) return { title: `${a.title} — Chambre 69`, description: a.metaDescription, image: og('conseils'), type: 'article' };
  }
  const cat = path.match(/^\/boutique\/categorie\/([^/]+)$/);
  if (cat) {
    const c = CATEGORIES.find((x) => x.id === cat[1]);
    if (c) return { ...PAGES['/boutique'], title: `${c.label} — Chambre 69` };
  }
  const store = path.match(/^\/nos-boutiques\/(point-e|corniche-ouest)$/);
  if (store) {
    const name = store[1] === 'point-e' ? 'Point E' : 'Corniche Ouest';
    return { title: `Boutique ${name}, lingerie à Dakar — Chambre 69`, description: `Boutique Chambre 69 ${name}, Dakar : prise de mesures en salon fermé, essayage sans rendez-vous, retrait des commandes en ligne. Itinéraire, horaires, WhatsApp.`, image: og('boutiques') };
  }
  return NOT_FOUND;
}

/** Liste des adresses à pré-rendre et à déclarer dans le plan de site. */
export function allRoutes(): string[] {
  return [
    ...Object.keys(PAGES),
    ...PRODUCTS.map(productUrl),
    ...ARTICLES.map((a) => `/conseils/${a.slug}`),
    '/nos-boutiques/point-e',
    '/nos-boutiques/corniche-ouest',
  ];
}
