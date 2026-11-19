# Mettre le site Chambre 69 en ligne (gratuitement, avec Vercel)

Le site est **entièrement statique** : aucune base de données ni serveur à louer.
Le catalogue est généré à chaque mise en ligne à partir des fiches de `content/produits/`, gérées depuis l'espace d'administration (`/admin`).
Le dossier `backend/` est un reste de l'ancien prototype : il n'est **pas** utilisé.

## 1. Première mise en ligne (une seule fois, ~5 minutes)

1. Créez un compte gratuit sur https://vercel.com avec **« Continue with GitHub »**.
2. Cliquez sur **Add New… → Project**, puis **Import** à côté du dépôt `chambre69`
   (si le dépôt n'apparaît pas : « Adjust GitHub App Permissions » et autorisez-le).
3. Dans l'écran de configuration :
   - **Root Directory** : cliquez sur *Edit* et choisissez **`project_room69`** (important).
   - **Framework Preset** : Vite (détecté automatiquement).
   - Ne touchez à rien d'autre : `vercel.json` fournit déjà les commandes.
4. Cliquez sur **Deploy**. Après 1 à 2 minutes, le site est en ligne à une adresse du type
   `https://chambre69-xxxx.vercel.app`.

Chaque modification poussée ensuite sur la branche `main` est remise en ligne automatiquement.

## 2. Brancher le nom de domaine (quand il sera acheté)

1. Vercel → votre projet → **Settings → Domains** → ajoutez `chambre69.sn` (ou autre).
2. Suivez les indications de Vercel pour les enregistrements DNS chez le registraire.
3. **Settings → Environment Variables** : ajoutez `VITE_SITE_URL` = `https://chambre69.sn`,
   puis **Deployments → Redeploy**. Les liens de partage WhatsApp et Google utiliseront ce domaine.

Sans cette variable, le site utilise automatiquement l'adresse `*.vercel.app` de production.

## 3. Mettre à jour le site (sans développeur)

Produits, photos, boutiques, horaires, contact et témoignages se gèrent depuis
l'**espace d'administration** : `https://VOTRE-SITE/admin`.
Mise en place et mode d'emploi : voir **`ADMINISTRATION.md`**.

Les fiches produits sont dans `content/produits/` et les réglages dans `content/reglages.json`
(modifiables aussi directement sur GitHub). `src/data/site.ts` garde les textes fixes
(zones de livraison, indicatifs, etc.).

## 4. En local (facultatif, pour un développeur)

```
cd project_room69
npm install
npm run dev       # aperçu de développement (prépare aussi le catalogue)
npm run build     # build + pré-rendu des pages + sitemap
npx vite preview  # aperçu sur http://localhost:4173
```

Alternative gratuite à Vercel : Netlify (même réglages : dossier `project_room69`,
commande `npm run build`, dossier publié `dist`).
