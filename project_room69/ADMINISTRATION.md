# Gérer le site Chambre 69 soi-même

L'espace d'administration permet, sans développeur :

- d'**ajouter une pièce** (photos, nom, maison, catégorie, prix, tailles…) ;
- de **retirer une pièce** du site (temporairement ou définitivement) ;
- d'**ajouter, retirer ou réordonner des photos** d'une pièce ;
- de modifier les **boutiques** (adresse, horaires), le **contact**, les **témoignages** et les chiffres des réseaux.

Chaque enregistrement met le site à jour **automatiquement, en une à deux minutes**.

Adresse : **https://VOTRE-SITE/admin** (par exemple `https://chambre69.sn/admin` une fois le domaine branché).

---

## 1. Mise en place (une seule fois, environ 10 minutes)

### a) Pour Noé (propriétaire du dépôt GitHub)
1. Sur https://github.com/noetohouegnon/chambre69 → **Settings** → **Collaborators** → **Add people**.
2. Saisissez le nom d'utilisateur GitHub ou l'e-mail de la gérante, puis **Add**.

### b) Pour Noé : activer le bouton « Se connecter avec GitHub » (une seule fois, 5 minutes)
1. Sur GitHub : photo de profil → **Settings** → **Developer settings** (tout en bas à gauche)
   → **OAuth Apps** → **New OAuth App** :
   - **Application name** : `Chambre 69 — Administration`
   - **Homepage URL** : `https://chambre69-sknk.vercel.app`
   - **Authorization callback URL** : `https://chambre69-sknk.vercel.app/api/callback`
   - **Register application**.
2. Sur la page qui s'ouvre : copiez le **Client ID**, puis **Generate a new client secret** et copiez le secret
   (il ne sera plus affiché).
3. Sur Vercel : projet → **Settings** → **Environment Variables**, ajoutez :
   - `GITHUB_OAUTH_ID` = le Client ID
   - `GITHUB_OAUTH_SECRET` = le secret
   puis **Deployments** → **⋯** du dernier déploiement → **Redeploy**.
4. **Le jour où le nom de domaine change** (ex. `chambre69.sn`) : dans l'OAuth App, remplacez les deux adresses
   par `https://chambre69.sn` et `https://chambre69.sn/api/callback`.

> Seules les personnes que vous avez invitées sur le dépôt peuvent enregistrer des modifications :
> GitHub refuse l'écriture à toute autre personne, même si elle se connecte.

### c) Pour la gérante
1. Créez un compte gratuit sur https://github.com (si ce n'est pas déjà fait).
2. Acceptez l'invitation reçue par e-mail (bouton **Accept invitation**).
3. Ouvrez **https://VOTRE-SITE/admin** → **« Se connecter avec GitHub »** → **Authorize**.
   L'ordinateur ou le téléphone s'en souvient ensuite.

*Solution de secours, sans le bouton GitHub* : créez une clé sur https://github.com/settings/tokens/new
(cochez **`repo`**, expiration au choix, **Generate token**, copiez la clé `ghp_…`), puis sur `/admin`
choisissez **« Se connecter avec un jeton d'accès »** et collez-la. Ne la partagez pas.

---

## 2. Au quotidien

### Ajouter une pièce
1. **Produits** → **Nouveau**.
2. **Photos** → **Ajouter** → choisissez une ou plusieurs photos (directement depuis le téléphone,
   y compris les photos d'iPhone). Elles sont allégées automatiquement.
   La **première photo** est celle qui s'affiche dans la boutique : glissez-déposez pour changer l'ordre.
3. Remplissez au minimum : **Nom de la pièce**, **Maison**, **Catégorie**.
4. Facultatif : prix, description, tailles, couleur…
   (sans prix, le site affiche « Prix communiqué par votre conseillère » ;
   sans description, un texte adapté à la catégorie est affiché).
5. **Enregistrer**. La pièce apparaît sur le site une à deux minutes plus tard.

### Retirer une pièce
- **Temporairement** (rupture, fin de saison) : ouvrez la pièce, cochez **« Masquer du site »**, enregistrez.
  Pour la remettre, décochez.
- **Définitivement** : ouvrez la pièce → menu **⋮** → **Supprimer**.

### Ajouter ou retirer une photo d'une pièce existante
Ouvrez la pièce → **Photos** :
- **Ajouter** pour une nouvelle photo ;
- l'icône **corbeille** à côté d'une photo pour la retirer ;
- glissez-déposez pour changer l'ordre.
Puis **Enregistrer**.

### Une taille en rupture
Ouvrez la pièce → **Tailles en rupture** → ajoutez la taille (ex. `95G` ou `L`) → **Enregistrer**.
Elle apparaît barrée sur la fiche, avec un bouton « Prévenez-moi de son retour ».

### Boutiques, horaires, contact, témoignages
**Réglages du site** → **Boutiques, contact, témoignages**.
- Les **témoignages** ne s'affichent sur l'accueil que s'il y en a au moins un :
  uniquement des clientes réelles, avec leur accord.

### Trouver une pièce
Utilisez la recherche en haut de la liste, ou les filtres (catégorie, masqués, nouveautés)
et le regroupement par maison.

---

## 3. Bon à savoir
- **Rien n'est perdu** : chaque modification est enregistrée dans l'historique GitHub et peut être annulée
  (demandez à Noé ou à un développeur).
- Si une modification n'apparaît pas après 5 minutes, rafraîchissez la page du site
  (ou videz le cache du navigateur).
- **Photos** : privilégiez des photos nettes, en lumière naturelle, sur fond calme
  (voir la charte graphique, page « Direction photo »). Format portrait idéal.
- Pour ajouter une **nouvelle maison** (marque) à la liste, demandez à un développeur :
  c'est une ligne à ajouter dans `public/admin/config.yml`.

## 4. Pour un développeur
- Fiches produits : `content/produits/*.json` (une par pièce) ; réglages : `content/reglages.json`.
- `scripts/prepare-content.mjs` (lancé par `npm run dev` et `npm run build`) génère
  `src/data/catalog.json` et les tailles 480/960 px des photos ajoutées (`public/media/generated/`).
- Interface : Sveltia CMS (`public/admin/`). Le bouton « Se connecter avec GitHub » passe par deux fonctions
  Vercel du projet (`api/auth.js`, `api/callback.js`, variables `GITHUB_OAUTH_ID` / `GITHUB_OAUTH_SECRET`) ;
  `public/admin/index.html` pointe l'administration vers l'adresse du site elle-même.
