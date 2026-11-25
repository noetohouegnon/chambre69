# Catalogue touristique et commercial du Bénin — édition 2026-2027

Date de référence des informations : **25 novembre 2026**.

## Contenu du dossier

| Livrable | Fichier |
|---|---|
| 0 — Catalogue Welcome to Bénin (plateforme et fonctionnalités) | `livrables/0_catalogue_welcome_to_benin_2026-2027.pdf` et `_numerique.pdf` |
| 1 — Catalogue principal (A4, impression) | `livrables/1_catalogue_benin_2026-2027.pdf` |
| 2 — Version numérique (WhatsApp, e-mail, téléphone) | `livrables/2_catalogue_benin_2026-2027_numerique.pdf` |
| 3 — Annuaire des prestataires | `livrables/3_annuaire_prestataires.xlsx` et `.csv` |
| 4 — Bibliothèque photographique + registre des licences + prompts Magnific | `livrables/4_bibliotheque_photographique/` |
| 5 — Sources documentaires | `livrables/5_sources_documentaires.md` |

Le dossier `build/` contient les scripts qui régénèrent l'ensemble (contenus, cartes, sélection photo, PDF).

## Ce qui n'a PAS pu être fait — dépendances humaines et limites

1. **Magnific** : plateforme non accessible depuis l'environnement d'exécution (hôte non autorisé) et soumise à compte/abonnement. Aucune connexion, aucun paiement. Les prompts fournis dans le brief sont classés par rubrique dans `4_bibliotheque_photographique/prompts_magnific.md`. **Aucune image IA n'est utilisée dans le catalogue.**
2. **Unsplash et Pexels** : accès automatisé refusé par les sites (redirection anti-robot, HTTP 403). Aucun contournement. Toutes les photographies proviennent de Wikimedia Commons (licences libres, auteur et licence tracés image par image).
3. **Annuaire de professionnels** : l'annuaire de référence (Welcome to Bénin) ne publie que 1 hébergement, 1 loueur et 2 agences vérifiés, sans restaurant ni guide. Les hôtels de groupe et les restaurants ajoutés proviennent de sources publiques nominatives et portent le statut « Source secondaire — à confirmer ». **Aucun établissement n'a été inventé** ; les champs manquants (téléphone, tarifs, horaires) sont « Non renseigné » ou « À confirmer ».
4. **Sécurité** : la fiche officielle du ministère français des Affaires étrangères classe « formellement déconseillés » les parcs de la Pendjari et du W et leurs abords, et « déconseillé sauf raison impérative » le centre de l'Atacora. Le catalogue présente ces sites à titre culturel et **ne propose aucun circuit ni safari** dans ces zones.
5. **Tarifs de circuits** : aucun tarif complet vérifié → « Sur demande ».
6. **Photographies d'établissements** : aucune image libre vérifiée d'un hôtel ou restaurant précis ; les fiches l'indiquent. Les images d'ambiance sont signalées comme telles.

## Écarts relevés entre sources

Voir `livrables/5_sources_documentaires.md` (Vodun Days 2027 : 2-9 janvier selon le gouvernement vs 9-10 janvier sur l'annuaire de référence ; Tata Somba et Koutammakou ; Pendjari ; fièvre jaune ; numéros d'urgence).

## Régénérer

```bash
cd catalogue_benin/build
python3 select_photos.py select && python3 select_photos.py download && python3 select_photos.py manifest
node maps.mjs maps villes.json routes.json   # cartes SVG
python3 make_depmap.py                       # carte des départements
python3 build_catalogue.py print && node render.mjs "$PWD/catalogue_print.html" ../livrables/1_catalogue_benin_2026-2027.pdf
python3 build_catalogue.py web   && node render.mjs "$PWD/catalogue_web.html"   ../livrables/2_catalogue_benin_2026-2027_numerique.pdf
python3 build_deliverables.py
```

Les chemins de travail (`/tmp/claude-0/work/...`) sont ceux de la session de production ; ils sont à adapter.

## Réserve sur le droit à l'image

Les licences Creative Commons couvrent le droit d'auteur du photographe, **pas** le droit à l'image des personnes reconnaissables. Quelques photographies montrent des personnes (cérémonies, marchés, pirogues). Avant une diffusion commerciale large (affichage, publicité), faire relire ces images ou les remplacer. Les crédits complets figurent dans le catalogue et dans `livrables/4_bibliotheque_photographique/registre_licences.csv`.
