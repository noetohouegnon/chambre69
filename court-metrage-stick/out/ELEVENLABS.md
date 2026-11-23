# Guide ElevenLabs — « Il a reçu un message de lui-même… »

Le script complet fait **695 caractères** (~695 crédits par génération complète). Sur le plan gratuit (10 000 crédits/mois, à vérifier sur votre compte), cela laisse de la marge pour tester plusieurs voix. Astuce : générez d'abord **n1 + n2** pour valider la voix avant le reste.

## 1. Voix du NARRATEUR — Voice Design
Dans ElevenLabs → *Voices* → *Add a new voice* → *Voice Design*. (Si l'option n'est pas offerte sur votre plan, cherchez dans la bibliothèque avec les mots-clés : *french male deep calm storyteller thriller*.)

**Prompt (à coller tel quel, en anglais) :**
```
A French male narrator in his late 30s with a deep, warm baritone and a slight natural gravel. Calm, intimate and mysterious, with the delivery of a gripping suspense storyteller for YouTube and cinema trailers. Native Parisian French accent, impeccable articulation, controlled slow pace, low-key intensity that tightens when tension rises, subtle breathiness on the pauses. Close-microphone studio quality, no background noise.
```
**Texte d'aperçu (100–1000 caractères, à coller dans « Text to preview ») :**
```
À vingt-trois heures dix-sept, un garçon a reçu un message… qui allait détruire sa vie. Le plus terrifiant ? Il venait de son propre numéro. Et c'est ainsi qu'il comprit… Il n'essayait pas d'échapper au futur. Il était en train de le créer.
```
Enregistrez-la sous le nom **Narrateur Chambre**.

## 2. Voix du DOUBLE (lignes d1 et d2)
**Prompt :**
```
A French man in his 30s, the exact same voice as a young adult but ruined by exhaustion and fear: hoarse, raspy, trembling, short of breath, close to breaking, whispering with desperate urgency. Native French accent, intimate close-microphone sound, no background noise.
```
**Texte d'aperçu :**
```
Ouvre-moi… c'est toi. Je t'en supplie… ne fais pas la même erreur que moi. Je sais ce qui va arriver. Écoute-moi, il est encore temps.
```
(Alternative gratuite : réutiliser la voix du narrateur et ajouter les balises/réglages ci-dessous : Stability basse, Style haut.)

## 3. Voix du PRÉSENTATEUR TV (ligne tv)
**Prompt :**
```
A French television news anchor in her 30s, neutral, crisp and authoritative, fast and clean broadcast diction, urgent but controlled, standard Parisian French, studio microphone, no background noise.
```
**Texte d'aperçu :**
```
Flash spécial. Un grave accident vient d'impliquer le bus de vingt-trois heures dix-sept. Les secours sont sur place.
```

## 4. Réglages recommandés
| Voix | Modèle | Stability | Similarity | Style | Speed | Speaker boost |
|---|---|---|---|---|---|---|
| Narrateur | Multilingual v2 (ou v3 si disponible) | 40–50 % | 75 % | 30–40 % | 0,95 | oui |
| Double | idem | 25–35 % | 75 % | 55–65 % | 0,90 | oui |
| Présentateur TV | idem | 55–65 % | 80 % | 15 % | 1,05 | oui |

## 5. Les 13 répliques à générer (une génération = un fichier)
Nommez chaque fichier **exactement** `n1.mp3`, `n2.mp3`… (identifiant dans la première colonne). La colonne « max » est la durée maximale que la réplique peut avoir dans le film ; l'outil d'import accélère légèrement (jusqu'à ×1,22) si besoin et vous prévient si c'est encore trop long.

### Version A — texte simple (fonctionne avec tous les modèles)
| Fichier | Voix | Max | Texte à coller |
|---|---|---|---|
| `n1` | NARRATEUR | 6.5 s | À vingt-trois heures dix-sept, un garçon a reçu un message… qui allait détruire sa vie. |
| `n2` | NARRATEUR | 5.2 s | Le plus terrifiant ? Il venait de son propre numéro. |
| `n3` | NARRATEUR | 6.0 s | Il vérifie l'expéditeur. C'est exactement son numéro. |
| `n4` | NARRATEUR | 3.4 s | Une blague. Forcément une blague. |
| `n5` | NARRATEUR | 4.8 s | Alors il reste chez lui. Et quelques minutes plus tard… |
| `tv` | PRÉSENTATEUR TV | 5.9 s | Flash spécial. Un grave accident vient d'impliquer le bus de vingt-trois heures dix-sept. |
| `n6` | NARRATEUR | 2.9 s | Le message disait vrai. |
| `n7` | NARRATEUR | 4.9 s | Dix secondes. Dix secondes avant que quelqu'un frappe à sa porte. |
| `d1` | DOUBLE | 2.5 s | Ouvre-moi… c'est toi. |
| `n8` | NARRATEUR | 5.4 s | Il s'approche. Il regarde par le judas. |
| `d2` | DOUBLE | 3.3 s | Je t'en supplie… ne fais pas la même erreur que moi. |
| `n9` | NARRATEUR | 4.1 s | Il hésite. Il recule. Puis… |
| `n10` | NARRATEUR | 7.9 s | Et c'est ainsi qu'il comprit… Il n'essayait pas d'échapper au futur. Il était en train de le créer. |

### Version B — avec balises d'interprétation (Eleven v3, si disponible sur votre plan)
Les balises entre crochets pilotent le ton ; elles ne sont **pas prononcées**. Si votre modèle ne les supporte pas, utilisez la version A.
```
n1:  [calm, low voice] À vingt-trois heures dix-sept, un garçon a reçu un message… [pause] qui allait détruire sa vie.
n2:  [slowly, ominous] Le plus terrifiant ? [pause] Il venait de son propre numéro.
n3:  [curious, quiet] Il vérifie l'expéditeur. [pause] C'est exactement son numéro.
n4:  [dry, slightly ironic] Une blague. [pause] Forcément une blague.
n5:  [calm, then uneasy] Alors il reste chez lui. Et quelques minutes plus tard…
tv:  [professional news anchor, urgent] Flash spécial. Un grave accident vient d'impliquer le bus de vingt-trois heures dix-sept.
n6:  [low, realization] Le message disait vrai.
n7:  [tense, building] Dix secondes. [pause] Dix secondes avant que quelqu'un frappe à sa porte.
d1:  [hoarse, exhausted, muffled through a door] Ouvre-moi… [pause] c'est toi.
n8:  [hushed, tense] Il s'approche. Il regarde par le judas.
d2:  [whispering, trembling, desperate, out of breath] Je t'en supplie… ne fais pas la même erreur que moi.
n9:  [slow, tense] Il hésite. Il recule. Puis…
n10:  [slow, quiet, chilling] Et c'est ainsi qu'il comprit… [long pause] Il n'essayait pas d'échapper au futur. [pause] Il était en train de le créer.
```

## 6. Remettre les voix dans le film
1. Placez les 13 fichiers dans un dossier, par exemple `voix_elevenlabs/`.
2. À la racine du dossier `court-metrage-stick` :
```
python3 src/import_voice.py voix_elevenlabs
python3 src/audio.py
python3 src/render.py
bash src/assemble.sh
```
L'import rogne les silences, normalise le volume, filtre légèrement (voix TV « téléviseur », écho discret sur le double), vérifie les durées et **réaligne automatiquement les sous-titres sur votre audio** (détection des pauses réelles). Le film final est régénéré dans `out/`.

## 7. Conseils d'interprétation
- Narrateur : rester bas et posé ; l'intensité monte à « Dix secondes » (n7), retombe sur « Il hésite » (n9) ; la dernière phrase (n10) doit être presque murmurée, avec une vraie pause après « il comprit… ».
- Double (d1) : voix étouffée derrière une porte ; (d2) : chuchoté, tremblant, au bord des larmes.
- Évitez tout rire ou souffle ajouté ; si la voix invente un mot, régénérez (Stability plus haute).
