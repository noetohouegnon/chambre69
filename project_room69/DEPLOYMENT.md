# Mettre le site Chambre 69 en ligne et le protéger

Le site est **entièrement statique** : aucune base de données, aucun serveur à gérer.
Il est hébergé sur **OVH (hébergement web Perso)** ; toute modification de la branche `main`
(y compris depuis l'administration `/admin`) est remise en ligne automatiquement en 3 à 5 minutes.

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

## 2. Mise en ligne sur l'hébergement web OVH (offre Perso) — solution retenue

Un robot GitHub (« GitHub Actions », gratuit) construit le site et l'envoie sur OVH
**quand vous lancez la mise en ligne** : Actions → *Mise en ligne OVH* → *Run workflow* (2 à 3 minutes).
Pour qu'il se lance **tout seul à chaque modification** de `main` (y compris depuis `/admin`),
une fois le site validé : dans `.github/workflows/deploy-ovh.yml`, sous `on:`, ajoutez
`push:` / `branches: [main]` / `paths: ['project_room69/**']`. Fichiers concernés : `.github/workflows/deploy-ovh.yml` et `project_room69/ovh/`.

### a) Dans l'espace client OVH (https://www.ovh.com/manager/)
1. **Web Cloud** → **Hébergements** → votre hébergement → onglet **FTP - SSH** :
   - notez le **serveur FTP** (ex. `ftp.cluster0XX.hosting.ovh.net`) et l'**identifiant** ;
   - **Changer le mot de passe** si vous ne le connaissez pas, et notez-le.
2. Onglet **Multisite** : vérifiez que `chambre69.sn` (et `www.chambre69.sn`) pointent vers le dossier **`www`**.
   Sinon **Ajouter un domaine ou sous-domaine** → domaine externe → dossier `www`.
3. Toujours dans **Multisite** : activez le **SSL** (certificat gratuit Let's Encrypt) pour les deux lignes,
   puis **Regénérer le certificat SSL** dans l'onglet **Informations générales**.
4. Onglet **Informations générales** : notez l'**adresse IPv4** de l'hébergement (pour les DNS, étape c).

### b) Dans GitHub (une seule fois)
Dépôt → **Settings** → **Secrets and variables** → **Actions** :
- onglet **Secrets** → **New repository secret**, créez :
  | Nom | Valeur |
  |---|---|
  | `OVH_HOST` | le serveur FTP (ex. `ftp.cluster0XX.hosting.ovh.net`) |
  | `OVH_USER` | l'identifiant FTP |
  | `OVH_PASSWORD` | le mot de passe FTP |
- onglet **Variables** → **New repository variable** *(facultatif)* :
  | Nom | Valeur |
  |---|---|
  | `SITE_URL` | `https://chambre69.sn` (par défaut). Pour le site de test : `http://test.chambre69.sn` (non indexé par Google) |
  | `OVH_PROTOCOL` | `auto` (par défaut : essaie la connexion chiffrée FTPS, puis SFTP, puis FTP simple) ; ou `ftps`, `sftp`, `ftp` pour en imposer une |
  | `OVH_FORCE_HTTPS` | `false` tant que le certificat HTTPS n'est pas actif (site de test en http), puis supprimez la variable |
  | `OVH_DIR` | `www` (par défaut) |

Puis onglet **Actions** du dépôt → **Mise en ligne OVH** → **Run workflow**.
Une coche verte = site en ligne. Une croix rouge = cliquez dessus, l'étape en erreur explique le problème
(le plus souvent : identifiant ou mot de passe FTP).

> ℹ️ Par défaut, le robot **n'efface rien** sur OVH : il ajoute ou remplace seulement les fichiers du site
> (l'ancien `index.html` est remplacé). Pour tout nettoyer, créez la variable `OVH_CLEAN` = `true`.

### b bis) En attendant les accès FTP : envoi à la main
Tant que les secrets ne sont pas renseignés, le robot construit quand même le site (coche verte, avec un avertissement).
Dépôt → **Actions** → dernière exécution **Mise en ligne OVH** → en bas, **Artifacts** → téléchargez
**site-chambre69-ovh** (fichier ZIP). Décompressez-le, puis avec **FileZilla** (gratuit) connectez-vous au FTP OVH
et déposez **tout le contenu** dans le dossier `www`, y compris le fichier caché `.htaccess`
(FileZilla : menu *Serveur* → *Forcer l'affichage des fichiers cachés*).

### c) Le nom de domaine `chambre69.sn`
Chez le registraire du domaine (zone DNS) :
- enregistrement **A** de `chambre69.sn` → l'**IPv4 de l'hébergement OVH** (étape a.4) ;
- enregistrement **A** (ou **CNAME** vers `chambre69.sn.`) pour `www.chambre69.sn` ;
- **ne touchez pas** aux enregistrements **MX** (e-mails).
La propagation prend de quelques minutes à quelques heures. Ensuite, retournez à l'étape a.3 pour le SSL.

### d) Vérifications après la première mise en ligne
`https://chambre69.sn` (accueil), une fiche produit, `/mariee`, le panier jusqu'au message WhatsApp,
`/admin` (écran de connexion), `/sitemap.xml`, et une adresse inexistante (page « Cette page n'existe pas »).

### f) Et Vercel ?
Une fois OVH en place, supprimez le projet Vercel (**Settings → General → Delete Project**)
pour éviter deux sites en parallèle. Le fichier `vercel.json` peut rester : il ne gêne pas OVH.

---

## 2 bis. Autre possibilité : Vercel
 (gratuit, ~5 minutes)

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
