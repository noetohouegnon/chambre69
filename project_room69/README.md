# Chambre 69 — site vitrine et boutique en ligne

Lingerie du bonnet A au bonnet O, Dakar. Site statique pré-rendu (React + Vite + Tailwind),
commande finalisée sur WhatsApp, espace d'administration sans serveur.

| Document | Pour qui | Contenu |
|---|---|---|
| [`ADMINISTRATION.md`](ADMINISTRATION.md) | la gérante | ajouter / retirer des pièces et des photos, boutiques, témoignages |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | le responsable du site | mise en ligne sur OVH (robot GitHub), domaine, accès |
| [`LIVRAISON_V2.md`](LIVRAISON_V2.md) | historique | ce qui a été livré en V2 |

## Architecture

```
content/produits/*.json   fiches produits (une par pièce)   ← modifiées depuis /admin
content/reglages.json     boutiques, contact, témoignages   ← modifiés depuis /admin
public/admin/             interface d'administration (Sveltia CMS, connexion par jeton GitHub uniquement)
public/media/             photos (WebP 480/960 px ; ajouts /admin convertis au build)
scripts/prepare-content.mjs  content/ → src/data/catalog.json (généré, non versionné)
scripts/prerender.mjs     pré-rendu HTML de toutes les pages + sitemap + robots
ovh/                      réglages Apache (.htaccess) pour l'hébergement OVH
../.github/workflows/deploy-ovh.yml   robot : build + envoi SFTP sur OVH à chaque modification de main
src/                      application React (pages, composants, données fixes)
```

- **Aucune base de données, aucun serveur** : tout est généré au build et servi en statique.
- **Commande** : le panier rédige le message WhatsApp (pièces, tailles, adresse, options cadeau).
- **Mesure d'audience** : Vercel Web Analytics (sans cookie) ; GA4 / Meta en option
  (`VITE_GA4_ID`, `VITE_META_PIXEL_ID`), chargés uniquement après consentement.
- **Formulaires** : transmis par WhatsApp ; `VITE_FORMS_ENDPOINT` pour un envoi direct (optionnel).

## Commandes

```bash
cd project_room69
npm ci
npm run dev              # développement (http://localhost:5173)
npm run build            # catalogue + build + pré-rendu → dist/
npx vite preview         # aperçu du build (http://localhost:4173)
npm run typecheck        # vérification TypeScript
npm run lint             # vérification du code
npm run import-dossiers  # import en masse depuis les dossiers photos (n'écrase rien)
node scripts/build-brand-assets.mjs   # régénère les images de partage (polices Italiana et Jost requises)
```

## Variables d'environnement (toutes facultatives)

| Variable | Effet |
|---|---|
| `VITE_SITE_URL` | domaine définitif (ex. `https://chambre69.sn`) pour les liens de partage et le sitemap ; sinon l'adresse Vercel |
| `VITE_GA4_ID` | identifiant Google Analytics 4 (`G-…`) |
| `VITE_META_PIXEL_ID` | identifiant du pixel Meta |
| `VITE_FORMS_ENDPOINT` | adresse d'un service d'envoi de formulaires (JSON POST) |

## Charte graphique

Base crème `#F4F2EE`, bordeaux `#5A1725`, or `#E49D27` et noir en accents ; titres en Italiana,
texte en Jost ; logo C69 doré d'origine. Jetons dans `tailwind.config.js`.
