# -*- coding: utf-8 -*-
"""Génère : annuaire (CSV + XLSX), registre des licences, dossier photo par catégories, prompts Magnific, sources."""
import csv, json, os, shutil, sys
sys.path.insert(0, os.path.dirname(__file__))
import content_misc as M
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "livrables")
os.makedirs(OUT, exist_ok=True)

# ───────── LIVRABLE 3 : annuaire ─────────
COLS = ["Nom", "Catégorie", "Ville", "Adresse", "Services", "Tarifs", "Téléphone", "WhatsApp", "Site", "Source", "Statut de vérification", "Remarques"]
rows = []
for h in M.HEBERGEMENTS:
    rows.append([h["nom"], "Hébergement — " + h["cat"], h["ville"], h["adresse"], h["equip"], h["tarif"], h["tel"], h["wa"], h["web"], h["src"], h["statut"], h["desc"]])
for r in M.RESTAURANTS:
    rows.append([r["nom"], "Restauration — " + r["type"], r["ville"], r["loc"], r["spec"], r["prix"], r["contact"], "Non renseigné", "Non renseigné", r["src"], r["statut"], "Horaires : " + r["horaires"]])
for t in M.TRANSPORT:
    rows.append([t["nom"], "Transport — " + t["type"], t["ville"], "Non renseigné", t["vehicules"], t["tarifs"], t["contact"], "Non renseigné", "Non renseigné", t["src"], t["statut"], "Zones : " + t["zones"] + " · " + t["conditions"]])
for a in M.AGENCES:
    rows.append([a["nom"], "Agence de voyages", a["ville"], "Non renseigné", a["services"], a["tarifs"], a["contact"], a["resa"], a["site"], a["src"], a["statut"], a["pres"] + " Agrément : " + a["agrement"]])
for s in M.SERVICES:
    rows.append([s["nom"], "Services — " + s["cat"], s["ville"], s["adresse"], s["cat"], "Non renseigné", s["tel"], "Non renseigné", "Non renseigné", s["src"], s["statut"], s["note"]])

with open(os.path.join(OUT, "3_annuaire_prestataires.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f, delimiter=";"); w.writerow(COLS); w.writerows(rows)
wb = Workbook(); ws = wb.active; ws.title = "Annuaire"
ws.append(COLS)
for r in rows: ws.append(r)
for c in ws[1]:
    c.font = Font(bold=True, color="F7F1E3"); c.fill = PatternFill("solid", fgColor="0F4C3A"); c.alignment = Alignment(wrap_text=True, vertical="top")
widths = [34, 30, 18, 34, 36, 28, 26, 18, 38, 34, 28, 60]
for i, wd in enumerate(widths): ws.column_dimensions[chr(65 + i)].width = wd
for row in ws.iter_rows(min_row=2):
    for c in row: c.alignment = Alignment(wrap_text=True, vertical="top")
ws.freeze_panes = "A2"; ws.auto_filter.ref = ws.dimensions
ws2 = wb.create_sheet("Légende")
ws2.append(["Statut", "Signification"])
ws2.append([M.V_OK, "Fiche publiée et contrôlée par un annuaire de référence ou par l'établissement."])
ws2.append([M.V_SEC, "Information relevée sur un site de groupe, une plateforme ou un guide : à recouper avant paiement."])
ws2.append([M.V_UNK, "Pratique courante sans source nominative."])
ws2.append(["Date de référence", M.DATE_REF])
ws2.append(["Règle", "« À confirmer » / « Non renseigné » = donnée non vérifiée ; aucune fiche n'a été complétée artificiellement."])
ws2.column_dimensions["A"].width = 34; ws2.column_dimensions["B"].width = 100
wb.save(os.path.join(OUT, "3_annuaire_prestataires.xlsx"))

# ───────── LIVRABLE 5 : sources ─────────
with open(os.path.join(OUT, "5_sources_documentaires.md"), "w", encoding="utf-8") as f:
    f.write(f"# Sources documentaires — Catalogue du Bénin 2026-2027\n\nDate de référence : {M.DATE_REF}\n\n")
    f.write("| Source | Adresse | Utilisation |\n|---|---|---|\n")
    for a, u, n in M.SOURCES: f.write(f"| {a} | {u} | {n} |\n")
    f.write("""
## Écarts constatés entre sources

1. **Vodun Days** — l'annuaire de référence indique « 9-10 janvier chaque année » ; les communications gouvernementales relayées par la presse béninoise (Benin Web TV) annoncent pour 2027 une édition du 2 au 9 janvier. Retenu : la communication gouvernementale, mention « à confirmer ».
2. **Tata Somba** — certaines sources les rattachent à l'inscription UNESCO « Koutammakou » ; ce paysage classé est situé au Togo voisin. Le catalogue ne présente pas les Tata Somba du Bénin comme inscrits.
3. **Pendjari** — la page opérateur d'African Parks annonce un parc ouvert toute l'année ; d'autres sources et les avis diplomatiques le déconseillent formellement. Retenu : position prudente (aucun circuit).
4. **Fièvre jaune** — certains sites officiels indiquent un certificat exigé à l'entrée, d'autres un contrôle supprimé. Retenu : vaccination recommandée, certificat à emporter.
5. **Numéros d'urgence** — la police est donnée au 116/117 (ARCEP) ou 166/117 selon les sources ; lignes signalées indisponibles en juillet 2025. Retenu : pompiers 118 et SAMU 112 comme repères les plus constants.
6. **Hôtel Sofitel Cotonou Marina** — le téléphone diffère selon les annuaires ; non publié dans le catalogue.

## Limites d'accès documentées

- Unsplash : redirection anti-robot ; Pexels : HTTP 403 pour les clients automatisés ; aucune contournement tenté.
- Magnific : non accessible depuis l'environnement (hôte non autorisé, compte et paiement requis) ; prompts préparés dans la bibliothèque photographique.
- Wikimedia Commons : limitation de débit (HTTP 429) ; collecte ralentie.
- Annuaire de référence : rubriques Restaurants, Guides, Sport, Sorties et Services aux entreprises « en cours d'enrichissement ».
""")

# ───────── LIVRABLE 4 : bibliothèque photographique ─────────
PH = os.path.join(ROOT, "photos")
man = json.load(open(os.path.join(PH, "manifest.json"), encoding="utf-8"))
CAT = {
 "Destinations": ["ganvie", "cotonou_ville", "cotonou_plage", "cotonou_amazone", "cotonou_dantokpa", "cotonou_cathedrale", "cotonou_street", "ouidah_porte", "ouidah_route", "ouidah_pythons", "ouidah_basilique", "ouidah_fort", "ouidah_kpasse", "abomey_palais", "abomey_reliefs", "abomey_behanzin", "portonovo", "portonovo_musees", "grandpopo", "dassa", "collines", "natitingou", "tata_somba", "nikki_gaani", "parakou", "paysages", "unesco"],
 "Hotellerie": ["hotel_ambiance"], "Restauration": ["cuisine", "cuisine2"], "Transport": ["transport", "cotonou_aeroport"],
 "Culture": ["ouidah_vodun", "artisanat_poterie", "artisanat_tissage", "artisanat_sculpture", "peuples", "musee_art", "adjarra"],
 "Nature": ["bouche_roy", "pendjari_faune", "pendjari_paysage", "w_park"], "Experiences": ["pirogue_nautique"], "Evenements": ["festival"],
}
LIB = os.path.join(OUT, "4_bibliotheque_photographique")
shutil.rmtree(LIB, ignore_errors=True)
placed = set()
for cat, topics in CAT.items():
    os.makedirs(os.path.join(LIB, cat), exist_ok=True)
    for t in topics:
        for pid in man["slots"].get(t, []):
            if pid in placed: continue
            src = os.path.join(PH, "final", pid + ".jpg")
            if os.path.exists(src):
                shutil.copy(src, os.path.join(LIB, cat, f"{t}__{pid}.jpg")); placed.add(pid)
os.makedirs(os.path.join(LIB, "Illustrations_IA"), exist_ok=True)
with open(os.path.join(LIB, "registre_licences.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f, delimiter=";")
    w.writerow(["Nom du fichier", "Sujet", "URL d'origine (page Commons)", "URL du fichier", "Auteur", "Plateforme", "Licence", "Usage commercial autorisé", "Attribution requise", "Nature de l'image", "Largeur", "Hauteur", "Rubrique(s)"])
    for pid, m in man["images"].items():
        w.writerow([pid + ".jpg", m["title"], m["page"], m["url"], m["author"], "Wikimedia Commons", m["lic"], m["commercial"], m["attribution"], m["nature"], m["w"], m["h"], ", ".join(m["topics"])])
open(os.path.join(LIB, "Illustrations_IA", "LISEZMOI.txt"), "w", encoding="utf-8").write(
    "Aucune illustration générée par IA dans cette édition : Magnific n'a pas pu être utilisé (accès réseau non autorisé, compte et validation humaine requis).\n"
    "Les prompts prêts à l'emploi sont dans ../prompts_magnific.md. Toute image générée devra porter la mention « Illustration générée par IA » dans le catalogue.\n")

PROMPTS = """# Prompts Magnific — classés par rubrique

> **Statut** : Magnific (https://www.magnific.com/fr) n'a pas pu être utilisé : l'hôte n'est pas autorisé dans l'environnement d'exécution, et l'utilisation requiert un compte, éventuellement un abonnement. Aucun paiement ni connexion n'a été tenté.
> **Règle éditoriale** : toute image générée devra être identifiée « Illustration générée par IA » ; ne jamais présenter une image IA comme la photographie d'un hôtel, restaurant, monument ou lieu précis.

## Couverture
Ultra premium editorial travel photography of Benin West Africa, aerial view of Ganvie stilt village on a calm turquoise lake, traditional wooden boats, warm golden sunrise, lush tropical vegetation, cinematic natural light, realistic photography, luxury travel magazine aesthetic, wide landscape composition, no text, no logo.

## Cotonou
Photorealistic editorial travel photography of Cotonou Benin, Atlantic coastline, Fidjrosse beach, modern urban architecture, tropical atmosphere, warm golden hour sunlight, realistic West African city environment, premium travel magazine photography.

## Ganvié
Photorealistic aerial photography of Ganvie lake village in Benin, authentic wooden stilt houses, traditional boats, reflective water, lush vegetation, morning light, National Geographic travel documentary aesthetic.

## Ouidah
Photorealistic cultural travel photography of Ouidah Benin, Door of No Return, Atlantic coastline, historic heritage architecture, palm trees, golden hour lighting, respectful historical representation.

## Pendjari
Photorealistic wildlife documentary photography of Pendjari National Park Benin, African elephants in natural savanna habitat, green hills, authentic West African ecosystem, golden sunlight.

## Hôtellerie
Premium boutique hotel in coastal Benin, tropical architecture, private swimming pool, elegant rooms, natural materials, sophisticated outdoor lounge, realistic architectural photography.

## Gastronomie
High-end editorial food photography of authentic Beninese cuisine, grilled fish, traditional local dishes, fresh vegetables, elegant wooden table, natural daylight.

## Artisanat
Authentic Beninese artisan workshop, traditional pottery, local craftsmanship, skilled hands shaping clay, traditional tools, warm natural lighting, documentary photography.

## Plages
Photorealistic aerial photography of Grand Popo Benin Atlantic coastline, golden sandy beach, palm trees, ocean waves, luxury travel destination atmosphere.

## Événements
Authentic cultural festival photography in Benin, traditional dance, colorful clothing, vibrant atmosphere, respectful cultural documentary photography.

## Rubriques complémentaires proposées (non fournies dans le brief)
- **Transitions de parties** : « Soft abstract textile pattern inspired by West African kanvo weaving, deep green and terracotta, flat lay, no text. »
- **Hôtellerie – résidence meublée** : « Bright furnished apartment interior in Cotonou, tropical plants, natural wood, daylight, realistic interior photography. » (illustration d'ambiance uniquement)
- **Transport** : « Modern minibus on a coastal road lined with coconut palms in Benin, golden hour, realistic travel photography. »

## Consignes de contrôle qualité (à appliquer à chaque image générée)
1. Vérifier l'absence de texte parasite, de logos et de visages déformés.
2. Respect culturel : pas de mise en scène sensationnaliste des cérémonies vodun ou des sites mémoriels.
3. Résolution ≥ 3000 px sur le grand côté pour l'impression A4 (utiliser l'amélioration de résolution de Magnific si disponible).
4. Ajouter la mention « Illustration générée par IA » en légende et dans le registre des licences (colonne Nature de l'image).
"""
open(os.path.join(LIB, "prompts_magnific.md"), "w", encoding="utf-8").write(PROMPTS)
print("deliverables ok:", len(rows), "annuaire rows;", len(placed), "photos")
