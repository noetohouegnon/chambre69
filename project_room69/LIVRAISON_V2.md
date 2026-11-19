# Chambre 69 — Version 2 du site : ce qui a été fait

Réponse au « Retour de validation du prototype » (V2.0, 28 octobre 2026) et intégration du « Livrable rédactionnel ».
Les numéros renvoient à ceux du cahier de Mme Nafi Ba Doré.

## Arbitrage structurant

- **Paiement en ligne (5.2) : volontairement non intégré.** Aucun prestataire de paiement (Wave, Orange Money, carte) n'est ouvert à ce jour. La commande reste finalisée **sur WhatsApp** : le panier rédige automatiquement le message (numéro de commande, pièces, références, tailles, pays, adresse, options cadeau), une conseillère confirme la disponibilité, les frais et le délai, puis convient du règlement. Les textes du livrable qui promettaient « Vous réglez par carte / paiement mobile » ont été reformulés en conséquence, pour ne rien promettre de faux.
- **Charte graphique et photos conservées.** Noir profond et or `#C9A96E`, logo existant, toutes les photos produits du dépôt (408 photos, 236 fiches). Les images externes de l'ancien prototype (sites marchands tiers, banques d'images) ont été retirées, comme l'exige le point 3.3.
- **Plus besoin de base de données pour afficher le site** : le catalogue est généré à partir des fiches de `content/produits/`, modifiables depuis l'espace d'administration `/admin` (import initial depuis les dossiers photos et les fiches `.docx`).

## Statut par exigence

| Réf. | Exigence | Statut |
|---|---|---|
| 1.1 | Balises de partage, image 1200×630 par type de page | ✅ 8 images (accueil, boutique, héritage, mariée, après-mastectomie, conseils, boutiques, diaspora) + vignette par fiche produit |
| 1.2 / 1.3 / 1.4 | Titres français uniques, méta-descriptions, `lang="fr"` | ✅ sur toutes les pages |
| 1.5 | Domaine définitif | ⏳ à acheter (chambre69.sn) — une seule variable `VITE_SITE_URL` à changer |
| 1.6 | Rendu serveur / pré-rendu | ✅ 268 pages pré-rendues au build (HTML complet lisible par Google et WhatsApp) |
| 1.7 | Favicon, icône, manifeste, 404 | ✅ |
| 0 bis / 2.4 / 4.5 | Bonnet A→O partout, filtre bonnet prioritaire, double système de tailles, compteurs, réinitialisation, tri, recherche tolérante aux fautes, résultat vide utile | ✅ |
| 2.1 | Promesse d'accueil (textes exacts du livrable) | ✅ |
| 2.2 | Notre histoire, 9 blocs | ✅ |
| 2.3 / 5 quater | Rubrique Héritage dans le menu, wolof toujours traduit | ✅ |
| 2.5 | L'École du bon maintien, guide des tailles interactif (4 écrans + messages contextuels), 3 articles, glossaire | ✅ |
| 2.6 | Page des maisons + bloc KRIZALID | ✅ (textes par maison en attente de validation) |
| 2.7 / 5.3 | Réassurance : colis neutre, échange, provenance, « WhatsApp uniquement » | ✅ |
| 2.9 | Témoignages | ✅ gabarit prêt — **les faux avis de l'ancien prototype ont été supprimés** |
| 2.10 | Pages boutiques Point E / Corniche Ouest, itinéraire, appel, WhatsApp, carte | ✅ (adresses et horaires en attente) |
| 2.11 | FAQ, CGV, confidentialité, cookies, mentions légales, livraison/retours, contact, presse | ✅ (RCCM, NINEA… en attente) |
| 2.12 | Page après-mastectomie, rendez-vous privé, emplacement du film | ✅ (fichier du film en attente) |
| 4.2 | Menu à 7 entrées | ✅ La boutique en ligne · Héritage · Mariée · Après-mastectomie · Conseils · Nos boutiques · Notre histoire (Nouveautés passe en tri de la boutique, pour respecter le 5 quater) |
| 4.3 | Bouton WhatsApp flottant contextuel (nom + référence + taille) | ✅ |
| 4.4 | Fiche produit complète, 4 actions, zoom, guide en surcouche, partage WhatsApp | ✅ |
| 4.6 | Rendez-vous : mesures, essayage, trousseau, privé | ✅ |
| 4.7 / 5 bis.3 | Tunnel en 3 étapes, pays demandé tôt, commande à offrir, prix masqué, retrait en boutique | ✅ (finalisation WhatsApp) |
| 4.8 | Formulaires : indicatifs internationaux, quartier/repère, erreurs au champ | ✅ |
| 5 bis | Pages « Commander depuis l'étranger » et « Afrique de l'Ouest » | ✅ |
| 5 ter | Section Mariée + **liste de trousseau partageable sans compte** | ✅ (réservation transmise à une conseillère ; le retrait automatique en temps réel demandera un petit serveur) |
| 5.5 | Carte cadeau | ✅ (via WhatsApp) |
| 8.2 / 8.3 | Événements de mesure + bandeau de consentement (refus aussi simple) | ✅ prêts — GA4, Meta, TikTok à brancher avec les comptes de la marque |
| 10.3 | Interface d'administration | ✅ `/admin` : produits, photos, prix, tailles, ruptures, boutiques, horaires, contact, témoignages (voir `ADMINISTRATION.md`) |

## Ce qu'il manque de la part de Chambre 69 (affiché sur le site en blocs « À compléter »)

Adresses et horaires des boutiques · tours de dos réels et stock par taille · prix · délai d'échange · pays desservis, délais et frais · RCCM / NINEA / siège · textes des maisons · verbatims clientes · film « Avec ou sans » · logo vectoriel définitif.

Les tailles affichées sur les fiches sont **l'amplitude habituelle de chaque maison**, signalée comme telle sur le site, à remplacer par le stock réel.

## Pour l'équipe technique

```
npm install
npm run import-dossiers   # import en masse depuis les dossiers photos (optionnel, ne modifie pas les fiches existantes)
npm run build     # build + pré-rendu des 268 pages + sitemap + robots
```
