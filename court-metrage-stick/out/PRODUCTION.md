# IL A REÇU UN MESSAGE DE LUI-MÊME… 24 HEURES DANS LE FUTUR
Court-métrage animé stick figures — 9:16, 1080×1920, 30 fps, 88,6 s, H.264 + AAC.

## Direction artistique
- Palette : noir profond, anthracite, blanc cassé ; bleu froid (nuit, écrans) ; rouge discret qui monte avec le danger (halo de vignette, pulsation cardiaque) ; lumière chaude réservée à la lampe, aux lampadaires et au judas (objets importants).
- Personnage A : silhouette mince, tête ronde blanc cassé, sweat sombre à capuche, pantalon noir, liseré de lumière froide.
- Personnage B (double) : strictement le même rig et les mêmes proportions ; sweat déchiré, ourlet déchiqueté, éraflure rouge au front, cernes, poussière, posture voûtée, démarche boiteuse, respiration ample.
- Twist lisible : au « lendemain », A porte les déchirures de B → il EST devenu le double.

## Découpage (minutage réel)
| Plan | Temps | Contenu | Caméra |
|---|---|---|---|
| 1a | 0,0–2,4 | HOOK : téléphone qui vibre, message « NE SORS PAS… TU VAS MOURIR. » | gros plan, tremblement puis lent zoom |
| 1b | 2,4–12,0 | Chambre, A immobile, halo du téléphone, regard vers la fenêtre | push-in lent |
| 2a | 12,0–20,5 | Numéro expéditeur = son numéro (carte comparative), « Qui est-ce ? » tapé au pouce, réponse « C'est toi. Dans 24 heures. » | gros plan fixe |
| 2b | 20,5–23,5 | A sourit, secoue la tête : « une blague » | plan moyen |
| 3a | 23,5–25,0 | « Ne prends surtout pas le bus de 23h17. » | gros plan, vibration |
| 3b | 25,0–28,8 | Il reste, se détend | plan large, léger push |
| 3c | 28,8–31,2 | Rue nocturne, arrêt de bus, bus 17 · 23:17, impact, flash, sirènes | plan large |
| 3d | 31,2–36,0 | JT « Flash spécial », A se lève, recule, main sur la bouche | gros plan TV → recul |
| 3e | 36,0–39,0 | Visage de face, terreur | gros plan, caméra instable |
| 4a | 39,0–40,6 | « Dans 10 secondes, quelqu'un va frapper… N'OUVRE PAS. » | gros plan |
| 4b | 40,6–48,2 | Chambre sombre éclairée par le téléphone, décompte 10-9-8, TOC TOC TOC, silence | travelling avant, secousses aux coups, plan fixe pendant le silence |
| 4c | 48,2–51,0 | Porte vue du couloir, ombres de pieds sous la porte, « Ouvre-moi… c'est toi. » | zoom progressif |
| 5a | 51,0–55,4 | A traverse le couloir | travelling latéral |
| 5b | 55,4–60,4 | Judas : le double, blessé, souffle, supplie | plan fixe fish-eye |
| 5c | 60,4–62,6 | « Si tu ouvres cette porte, tu deviendras moi. » | gros plan, vibration |
| 5d | 62,6–66,0 | Main qui tremble vers la poignée | caméra instable, rouge |
| 6a | 66,0–71,2 | Il recule, hésite, avance, ouvre : lumière froide → coupure | zoom |
| 6b | 71,2–72,6 | Écran noir, silence total | — |
| 6c | 72,6–74,3 | « LE LENDEMAIN 23H17 » | carton |
| 6d | 74,3–76,0 | A (désormais déchiré, épuisé) assis dans la même chambre | plan large |
| 6e | 76,0–81,8 | Écran : il est l'expéditeur, tape et envoie le message initial | gros plan |
| 6f | 81,8–87,5 | Dernier plan, glitch rouge, coupure franche | dézoom |
| fin | 87,5–88,6 | 1,1 s de noir et de silence | — |

## Sound design (synthétisé)
Ventilation + souffle de nuit ; vibreur en 3 rafales ; notification ; clics de frappe ; circulation, moteur de bus, impact, sirènes ; jingle JT ; décompte (tic) ; battements de cœur accélérés ; 3 coups de porte graves ; silence total 46,95→48,4 avant la voix ; basses profondes et cluster dissonant 49→71 ; craquement de porte ; coupure musicale à 71,0 ; carillon à 72,6 ; musique mystérieuse qui revient ; coupure franche à 87,5. La voix off déclenche un ducking de la musique et des effets.

## Voix
Narrateur : voix masculine (MBROLA fr1), grave, filtrée, légère réverbération. Présentatrice TV : voix filtrée « téléviseur ». Double : même voix abaissée, écho (voix « du futur »).

## Fichiers
- `il_a_recu_un_message_de_lui_meme.mp4` : film final (sous-titres incrustés)
- `sous-titres.srt` : sous-titres séparés
- `../src/` : code source (moteur, scènes, voix, audio, rendu), régénérable : `python3 src/voice.py && python3 src/audio.py && python3 src/render.py`
