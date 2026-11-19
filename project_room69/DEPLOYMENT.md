# Mettre le site Chambre 69 en ligne et le protéger

Le site est **entièrement statique** : aucune base de données, aucun serveur à louer, hébergement gratuit.
Toute modification poussée sur la branche `main` (y compris depuis l'administration `/admin`)
est remise en ligne automatiquement en une à deux minutes.

---

## 1. Rendre le dépôt privé (à faire en premier, 1 minute)

Le dépôt `noetohouegnon/chambre69` est aujourd'hui **public** : n'importe qui peut le lire.

1. https://github.com/noetohouegnon/chambre69 → **Settings** (onglet en haut à droite).
2. Tout en bas, section **Danger Zone** → **Change repository visibility** → **Make private** → confirmez.
3. **Settings → Collaborators** : vérifiez que la liste ne contient que vous
   (au 19 novembre 2026, vous êtes le seul). Retirez toute personne inconnue.
4. **Settings → Deploy keys** et **Settings → Integrations / GitHub Apps** : retirez ce que vous ne reconnaissez pas
   (gardez Vercel, et Claude si vous continuez à l'utiliser).
5. Facultatif : **Settings → Branches** → protégez `main` contre la suppression.

Ensuite, personne ne voit ni ne modifie les fichiers sans que vous l'ayez invité
(**Settings → Collaborators → Add people**, par exemple pour la gérante : voir `ADMINISTRATION.md`).

> L'ancienne équipe conserve sa propre copie (`Hodavia05/Chambre69`) de l'**ancienne** version :
> vous ne pouvez pas la leur retirer, mais tout le travail actuel (V2, charte, administration, corrections)
> n'existe que dans votre dépôt. Son ancien site Vercel (`chambre69-74u7-one.vercel.app`) est distinct du vôtre.

---

## 2. Première mise en ligne sur Vercel (gratuit, ~5 minutes)

1. Créez un compte sur https://vercel.com avec **« Continue with GitHub »** (offre **Hobby**, gratuite).
2. **Add New… → Project** → à côté de `chambre69`, **Import**.
   Si le dépôt n'apparaît pas (il est privé) : **Adjust GitHub App Permissions** → autorisez `chambre69`.
3. Écran de configuration :
   - **Root Directory** → *Edit* → choisissez **`project_room69`** ← **important** ;
   - le reste est automatique (`vercel.json` fournit les commandes) ;
   - aucune variable d'environnement n'est obligatoire.
4. **Deploy**. Au bout de 2 à 3 minutes, le site est en ligne sur `https://chambre69-xxxx.vercel.app`.
5. **Statistiques de visites** (gratuites, sans cookie) : projet → onglet **Analytics** → **Enable**.

Vérifications rapides après la mise en ligne :
- la page d'accueil, une fiche produit, le panier (jusqu'au message WhatsApp) ;
- `https://…/admin` affiche l'écran de connexion de l'administration ;
- `https://…/sitemap.xml` liste bien les pages.

---

## 3. Brancher le nom de domaine (quand il sera acheté, ex. chambre69.sn)

1. Vercel → projet → **Settings → Domains** → **Add** → `chambre69.sn` (et `www.chambre69.sn`).
2. Vercel indique les enregistrements DNS à créer chez le registraire (A ou CNAME). Le certificat HTTPS est automatique.
3. **Settings → Environment Variables** → `VITE_SITE_URL` = `https://chambre69.sn` → **Deployments → Redeploy**.
   (Les liens de partage WhatsApp, Google et le sitemap utilisent alors ce domaine.)

> Le site actuel `chambre69.sn` (hébergé ailleurs) sera remplacé dès que les DNS pointeront vers Vercel :
> faites la bascule quand la gérante a validé la nouvelle version sur l'adresse `…vercel.app`.

---

## 4. Options (variables d'environnement Vercel, toutes facultatives)

| Variable | Effet |
|---|---|
| `VITE_SITE_URL` | domaine définitif (voir § 3) |
| `VITE_GA4_ID` | Google Analytics 4 (`G-XXXXXXX`) — un bandeau de consentement apparaît alors automatiquement |
| `VITE_META_PIXEL_ID` | pixel Meta (publicités Facebook / Instagram) — idem |
| `VITE_FORMS_ENDPOINT` | service d'envoi des formulaires par e-mail ; sans lui, tout part sur WhatsApp |

Après chaque ajout de variable : **Deployments → … → Redeploy**.

---

## 5. Mettre à jour le site

- **La gérante** : produits, photos, boutiques, horaires, témoignages depuis `/admin` (voir `ADMINISTRATION.md`).
- **Un développeur** : voir `README.md` (commandes, architecture). Tester en local :

```
cd project_room69
npm ci
npm run dev       # aperçu de développement (prépare aussi le catalogue)
npm run build     # build + pré-rendu des pages + sitemap
npx vite preview  # aperçu du build sur http://localhost:4173
```

Alternative gratuite à Vercel : Netlify (dossier `project_room69`, commande `npm run build`, dossier publié `dist`) —
les en-têtes de sécurité de `vercel.json` seraient alors à reporter dans un fichier `netlify.toml`.
