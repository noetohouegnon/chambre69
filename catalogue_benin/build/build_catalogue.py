# -*- coding: utf-8 -*-
"""Assemble le catalogue HTML (A4) puis, via render.mjs, le PDF. Usage: python3 build_catalogue.py [print|web]"""
import json, sys, os, html, re, base64
sys.path.insert(0, os.path.dirname(__file__))
import content_dest as D, content_misc as M

MODE = sys.argv[1] if len(sys.argv) > 1 else "print"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PH = os.path.join(ROOT, "photos")
MAN = json.load(open(os.path.join(PH, "manifest.json"), encoding="utf-8"))
IMGDIR = os.path.join(PH, "final" if MODE == "print" else "web")
MAPDIR = os.path.join(ROOT, "build", "maps")
FONTS = "/tmp/claude-0/work/npm/node_modules/@fontsource"
esc = lambda s: html.escape(str(s), quote=True)

def slots(topic):
    ids = MAN["slots"].get(topic, [])
    return ids

def used_ids(): return MAN.setdefault("_used", [])

def photo(topic, i=0, fallback=None):
    ids = slots(topic)
    if not ids and fallback: ids = slots(fallback)
    if not ids: return None
    pid = ids[i % len(ids)]
    if pid not in used_ids(): used_ids().append(pid)
    return pid

def img_tag(pid, cls="", pos="center", credit=True, credit_cls=""):
    if not pid: return f'<div class="ph-empty {cls}"><span>Photographie : non disponible</span></div>'
    m = MAN["images"][pid]
    src = "file://" + os.path.join(IMGDIR, pid + ".jpg")
    cap = f'<span class="credit {credit_cls}">© {esc(m["author_short"])} · {esc(m["lic_short"])}</span>' if credit else ""
    return f'<div class="ph {cls}"><img src="{src}" style="object-position:{pos}" alt="{esc(m["alt"])}">{cap}</div>'

def map_inline(name):
    p = os.path.join(MAPDIR, name)
    s = open(p, encoding="utf-8").read()
    return s

def font_face():
    def ff(fam, w, style, path):
        data = base64.b64encode(open(path, "rb").read()).decode()
        return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{style};src:url(data:font/woff2;base64,{data}) format('woff2');}}"
    pf = FONTS + "/playfair-display/files/playfair-display-latin-%s-%s.woff2"
    it = FONTS + "/inter/files/inter-latin-%s-normal.woff2"
    out = [ff("Playfair Display", 400, "normal", pf % (400, "normal")), ff("Playfair Display", 700, "normal", pf % (700, "normal")),
           ff("Playfair Display", 400, "italic", pf % (400, "italic"))]
    for w in (300, 400, 500, 600, 700): out.append(ff("Inter", w, "normal", it % w))
    return "\n".join(out)

CSS = """
@page{size:210mm 297mm;margin:0}
:root{--green:#0F4C3A;--green2:#1B6A52;--ivory:#F7F1E3;--sand:#E4D5B7;--terra:#B5502F;--gold:#B8914A;--ink:#1F2A24;--mute:#5F665F}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#888}
body{font-family:'Inter',sans-serif;color:var(--ink);font-size:9.4pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:var(--ivory);page-break-after:always;break-after:page}
.page.dark{background:var(--green);color:var(--ivory)}
.m{position:absolute;left:16mm;right:16mm;top:16mm;bottom:20mm}
h1,h2,h3,.serif{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:.2px}
h1{font-size:34pt;line-height:1.08}
h2{font-size:21pt;line-height:1.15;color:var(--green)}
h3{font-size:12.5pt;line-height:1.25;color:var(--green)}
.dark h2,.dark h3{color:var(--ivory)}
.eyebrow{font-size:7.5pt;letter-spacing:2.4px;text-transform:uppercase;color:var(--terra);font-weight:600}
.dark .eyebrow{color:var(--gold)}
.rule{width:34mm;height:1.4mm;background:var(--gold);margin:3mm 0 4mm}
p{margin-bottom:2.4mm;text-align:left;hyphens:auto}
.lead{font-size:11pt;line-height:1.55;color:#2b3a33}
.foot{position:absolute;bottom:8mm;left:16mm;right:16mm;display:flex;justify-content:space-between;font-size:7pt;color:var(--mute);letter-spacing:.6px;text-transform:uppercase}
.foot b{color:var(--green);font-weight:600}
.dark .foot,.dark .foot b{color:rgba(247,241,227,.7)}
.ph{position:relative;overflow:hidden;background:#cfc7b3}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.credit{position:absolute;right:2mm;bottom:1.4mm;font-size:5.6pt;color:#fff;background:rgba(0,0,0,.45);padding:.2mm 1.4mm;border-radius:1mm;letter-spacing:.2px;max-width:92%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph-empty{background:var(--sand);display:flex;align-items:center;justify-content:center;color:var(--mute);font-size:7pt}
.full{position:absolute;inset:0}
.overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,76,58,.08) 30%,rgba(10,45,34,.88) 100%)}
.overlay-top{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,45,34,.75) 0%,rgba(10,45,34,.05) 45%,rgba(10,45,34,.78) 100%)}
.txt-over{position:absolute;left:16mm;right:16mm;color:#fff}
.box{background:#fff;border-left:1.6mm solid var(--gold);padding:3.2mm 4mm;border-radius:0 2mm 2mm 0;margin:3mm 0;font-size:8.6pt}
.box.alert{border-left-color:var(--terra);background:#fbece5}
.box b.t{display:block;font-size:7.4pt;letter-spacing:1.6px;text-transform:uppercase;color:var(--terra);margin-bottom:1mm}
.tag{display:inline-block;font-size:6.6pt;letter-spacing:.8px;text-transform:uppercase;padding:.5mm 2.2mm;border-radius:10mm;background:var(--sand);color:var(--green);font-weight:600;margin-right:1.5mm}
.tag.ok{background:#cfe7da;color:#0b5a3a}.tag.sec{background:#f3e3b8;color:#7a5a10}.tag.unk{background:#eee;color:#555}.tag.red{background:#f6d4c8;color:#8a2c10}
table{border-collapse:collapse;width:100%;font-size:8pt}
th{background:var(--green);color:var(--ivory);text-align:left;font-weight:600;padding:2mm 2.4mm;font-size:7.4pt;letter-spacing:.6px;text-transform:uppercase}
td{padding:1.9mm 2.4mm;border-bottom:.3mm solid #d9cfb7;vertical-align:top}
tr:nth-child(even) td{background:rgba(228,213,183,.28)}
.cols2{column-count:2;column-gap:8mm}
.attr{break-inside:avoid;margin-bottom:3mm}
.attr h3{font-size:10pt;margin-bottom:.6mm}
.attr p{font-size:8.5pt;margin:0}
.kv{display:grid;grid-template-columns:34mm 1fr;gap:1.2mm 4mm;font-size:8.6pt}
.kv dt{font-weight:600;color:var(--green)}
.card{background:#fff;border-radius:2.5mm;padding:4mm 5mm;box-shadow:0 .4mm 1.6mm rgba(0,0,0,.12);margin-bottom:5mm}
.pill{display:inline-block;background:var(--green);color:#fff;font-size:7pt;padding:.6mm 2.4mm;border-radius:10mm;margin:0 1mm 1mm 0}
.timeline{border-left:.5mm solid var(--gold);margin-left:2mm;padding-left:5mm}
.timeline div{margin-bottom:3mm;position:relative}
.timeline div:before{content:"";position:absolute;left:-6.6mm;top:1.2mm;width:2.4mm;height:2.4mm;border-radius:50%;background:var(--terra)}
.timeline b{color:var(--green)}
.num{font-family:'Playfair Display',serif;font-size:46pt;color:var(--gold);line-height:1}
.gal{display:grid;gap:3mm}
svg{display:block;width:100%;height:auto}
.small{font-size:7.4pt;color:var(--mute)}
.toc-row{display:flex;align-items:baseline;gap:2mm;padding:1.4mm 0;border-bottom:.25mm dotted #b9ad90}
.toc-row .n{font-family:'Playfair Display',serif;font-size:15pt;color:var(--terra);width:11mm}
.toc-row .t{font-weight:600;font-size:11pt;color:var(--green);flex:1}
.toc-row .p{font-size:9pt;color:var(--mute)}
.toc-sub{font-size:8pt;color:var(--mute);margin:0 0 1mm 13mm}
"""

pages = []
def page(inner, cls="", foot=True, section=""):
    n = len(pages) + 1
    f = f'<div class="foot"><span>Welcome to Bénin · welcometobenin.com · Catalogue 2026-2027{(" · <b>"+esc(section)+"</b>") if section else ""}</span><span><b>{n}</b></span></div>' if foot else ""
    pages.append(f'<section class="page {cls}" data-n="{n}">{inner}{f}</section>')
    return n

TOC = []   # (num partie, titre, page)

def opener(num, title, sub, pid, intro, pos="center"):
    n = len(pages) + 1
    TOC.append((num, title, n))
    inner = f'<div class="full">{img_tag(pid, "full", pos, credit_cls="")}</div><div class="overlay"></div>' \
            f'<div class="txt-over" style="bottom:26mm"><div class="eyebrow" style="color:#E9CD95">Partie {num}</div><h1 style="margin:2mm 0 2mm">{esc(title)}</h1>' \
            f'<div class="rule"></div><p class="lead" style="color:#f1ecdf;max-width:140mm">{esc(sub)}</p></div>'
    page(inner, "dark", foot=False)
    return n

def tag_status(s):
    c = "ok" if s.startswith("Vérifié") else "sec" if s.startswith("Source sec") else "unk"
    return f'<span class="tag {c}">{esc(s)}</span>'

# ───────────────────────── COUVERTURE ─────────────────────────
cov = photo("ganvie", 0)
page(f'<div class="full">{img_tag(cov, "full", "center 55%")}</div><div class="overlay-top"></div>'
     f'<div class="txt-over" style="top:20mm"><div class="eyebrow" style="color:#E9CD95;letter-spacing:5px">Welcome to Bénin présente · Catalogue touristique & commercial</div></div>'
     f'<div class="txt-over" style="bottom:28mm"><h1 style="font-size:64pt;letter-spacing:6px">BÉNIN</h1><div class="rule"></div>'
     f'<p class="serif" style="font-size:17pt;font-weight:400;font-style:italic;max-width:140mm;line-height:1.3">Voyager, découvrir, séjourner, entreprendre — le guide de référence de la destination.</p>'
     f'<p style="margin-top:8mm;font-size:8pt;letter-spacing:2px;text-transform:uppercase;color:#E9CD95">Édition 2026-2027 · mise à jour {M.DATE_REF}</p></div>', "dark", foot=False)

# ───────────────────────── ÉDITO ─────────────────────────
page(f"""<div class="m">
<div class="eyebrow">Avant-propos</div><h2 style="margin-top:2mm">Bienvenue : un pays à parcourir, une destination à préparer</h2><div class="rule"></div>
<p class="lead">Le Bénin est un pays de mémoire et de mouvement : des royaumes dont les palais se visitent encore, une côte où l'océan rencontre la lagune, des villes qui inventent leur avenir, des cultures vivantes qui ne se laissent pas réduire à des cartes postales.</p>
<p>Édité dans l’esprit de Welcome to Bénin, ce catalogue a été conçu comme un outil de travail autant que comme un livre à feuilleter : il aide un voyageur, une famille, un membre de la diaspora, une agence ou un investisseur à comprendre la destination et à préparer concrètement un séjour.</p>
<h3 style="margin-top:6mm">Notre méthode — et ce qu'elle implique</h3>
<p>Chaque information a été rattachée à une source identifiable. Lorsqu'une donnée n'a pas pu être confirmée (téléphone, tarif, horaires, agrément), elle porte la mention <b>« À confirmer »</b> ou <b>« Non renseigné »</b> : nous préférons une fiche honnête à une fiche remplie.</p>
<div class="box"><b class="t">Statuts de vérification utilisés</b>
<p style="margin:0 0 1.5mm"><span class="tag ok">Vérifié par Welcome to Bénin</span> Fiche contrôlée par la rédaction de Welcome to Bénin (téléphone ou terrain).</p>
<p style="margin:0 0 1.5mm"><span class="tag sec">Source secondaire — à confirmer</span> Information relevée sur un site officiel de groupe, une plateforme de réservation ou un guide : à recouper avant tout paiement.</p>
<p style="margin:0"><span class="tag unk">Non vérifié</span> Pratique courante ou information générale sans source nominative.</p></div>
<div class="box alert"><b class="t">À lire avant de partir</b>
<p style="margin:0">Une partie du Nord du pays — notamment les parcs de la Pendjari et du W, et le centre de l'Atacora — fait l'objet d'avis de sécurité officiels (« formellement déconseillé » ou « déconseillé sauf raison impérative » selon la fiche du ministère français des Affaires étrangères consultée le 25 novembre 2026). Nous les présentons à titre culturel, <b>sans proposer de circuit</b> dans ces zones. Voir page dédiée.</p></div>
<h3 style="margin-top:5mm">Une édition de lancement</h3>
<p>Le catalogue s'appuie sur l’annuaire Welcome to Bénin, en phase de lancement et d’enrichissement, et sur des sources publiques. Il ne remplace ni les sites officiels, ni les conseils de votre ambassade, ni un contact direct avec les prestataires. Les photographies proviennent de Wikimedia Commons sous licences libres ; aucune image ne représente un établissement qu'elle ne montre pas réellement.</p>
</div>""", section="Avant-propos")


page(f"""<div class="m"><div class="eyebrow">Welcome to Bénin</div><h2>Le magazine-pays et l’annuaire qui met le Bénin à portée de main</h2><div class="rule"></div>
<p class="lead">Welcome to Bénin (<a href="https://welcometobenin.com/fr" style="color:var(--green)">welcometobenin.com</a>) est, selon sa présentation, un magazine-pays indépendant et un annuaire marchand : il relie les voyageurs du monde entier, la diaspora et l’hospitalité béninoise. Ce catalogue en est le prolongement en PDF.</p>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;margin:4mm 0">
<div class="card" style="margin:0"><div class="num" style="font-size:30pt">1</div><h3>Le magazine-pays</h3><p style="font-size:8.6pt">Récits, guides et dossiers sur l’histoire, le vodun, les royaumes, l’architecture et les festivals, en français et en anglais.</p></div>
<div class="card" style="margin:0"><div class="num" style="font-size:30pt">2</div><h3>L’annuaire et guide</h3><p style="font-size:8.6pt">Hôtels, restaurants, transport, agences, guides, sport et bien-être, sorties, services aux entreprises. Chaque fiche donne un contact direct par WhatsApp ou téléphone.</p></div>
<div class="card" style="margin:0"><div class="num" style="font-size:30pt">3</div><h3>La passerelle</h3><p style="font-size:8.6pt">Un espace dédié à la diaspora, aux afro-descendants et aux investisseurs : démarches, dossiers, ressources.</p></div></div>
<h3>Ce que le site permet de faire</h3>
<table><tr><th style="width:42mm">Fonction</th><th>Ce que vous trouvez</th></tr>
<tr><td><b>Découvrir</b></td><td>Fiches d’attraits par ville (histoire, conseils de visite, coordonnées GPS), géographie, culture, population, « Bénin aujourd’hui ».</td></tr>
<tr><td><b>Préparer son séjour</b></td><td>Annuaire filtrable par ville et par type de prestataire, avec fiches « Vérifié », tarifs indicatifs, langues parlées, équipements.</td></tr>
<tr><td><b>Construire un itinéraire</b></td><td>Un outil interactif : durée (1 à 14 jours), ville de départ, centres d’intérêt.</td></tr>
<tr><td><b>Suivre les événements</b></td><td>Calendrier de 13 rendez-vous, du plus proche au plus lointain, avec hébergements et agences à proximité.</td></tr>
<tr><td><b>Investir, s’installer</b></td><td>Dossiers thématiques et annuaire de services aux entreprises.</td></tr></table>
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Les engagements affichés par Welcome to Bénin</b><p style="margin:0">Initiative privée, indépendante du gouvernement · accès gratuit pour les voyageurs · <b>0 % de commission</b> : le client contacte directement le prestataire · le badge « Vérifié » ne s’achète pas : il est attribué après un contrôle par la rédaction (téléphone ou terrain).</p></div></div>""", section="Welcome to Bénin")

page(f"""<div class="m"><div class="eyebrow">Welcome to Bénin · Voyageurs</div><h2>Préparer son séjour en quatre gestes</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm">
<div class="card"><div class="num" style="font-size:30pt">1</div><h3>Choisir sa destination</h3><p>Parcourez les fiches de ce catalogue ou celles du site : Cotonou, Ouidah, Ganvié, Porto-Novo, Grand-Popo, Abomey, Dassa-Zoumè… avec histoire, conseils de visite et coordonnées GPS.</p></div>
<div class="card"><div class="num" style="font-size:30pt">2</div><h3>Construire son itinéraire</h3><p>Utilisez l’outil d’itinéraire du site ou les six circuits de la Partie 10, de 24 heures à 14 jours.</p></div>
<div class="card"><div class="num" style="font-size:30pt">3</div><h3>Contacter directement</h3><p>Chaque fiche « Vérifié » propose un WhatsApp et un appel direct vers l’hôte, le loueur ou l’agence : pas d’intermédiaire, pas de commission prélevée par le site.</p></div>
<div class="card"><div class="num" style="font-size:30pt">4</div><h3>Rester informé</h3><p>Calendrier des festivals, avis pratiques (visa, santé, sécurité) et blog du site, pour partir avec les bonnes informations.</p></div></div>
<h3 style="margin-top:3mm">Pourquoi le contact direct compte</h3>
<p>Selon Welcome to Bénin, les plateformes internationales prélèvent jusqu’à 20 % sur une réservation ; ici, le règlement revient en totalité au professionnel local. Le site précise qu’il ne vend ni billets d’avion ni séjours : il met en relation, par téléphone ou WhatsApp, avec les prestataires.</p>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;height:58mm;margin-top:4mm">{img_tag(photo("ganvie",1))}{img_tag(photo("grandpopo",1))}{img_tag(photo("cuisine",1,"cuisine2"))}</div>
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Où retrouver tout cela</b><p style="margin:0">welcometobenin.com/fr · rubrique « Préparer mon séjour » · WhatsApp rédaction : +229 01 95 36 95 72.</p></div></div>""", section="Welcome to Bénin")

TOC_PLACEHOLDER = len(pages) + 1
page("%%TOC%%", section="Sommaire")

# ───────────────────────── PARTIE 1 ─────────────────────────
opener(1, "Bienvenue au Bénin", "Un pays long et étroit, ouvert sur le golfe de Guinée, où se rencontrent royaumes, rites et modernité.", photo("cotonou_ville", 0, "paysages"), "")

# page 1.1 : le Bénin en quelques mots + carte Afrique de l'Ouest
facts = "".join(f"<dt>{esc(k)}</dt><dd>{esc(v)}</dd>" for k, v in M.FAITS)
page(f"""<div class="m"><div class="eyebrow">Partie 1 · Le pays</div><h2>Le Bénin en quelques mots</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:1fr 78mm;gap:7mm">
<div><p class="lead">Étendu sur une bande étroite d'environ 700 km du nord au sud, le Bénin s'ouvre sur l'Atlantique au sud et touche le Sahel au nord. Sa position, entre le Togo et le Nigeria, en fait un carrefour culturel et commercial de l'Afrique de l'Ouest.</p>
<p>Le pays se découvre par strates : une côte de lagunes et de plages, un Sud densément peuplé et riche en histoire, des collines au centre, puis un Nord de savanes, de montagnes et de grands parcs.</p>
<dl class="kv" style="margin-top:4mm">{facts}</dl></div>
<div>{map_inline("map_westafrica.svg")}<p class="small" style="margin-top:1.5mm">Le Bénin en Afrique de l'Ouest. Fond : Natural Earth (domaine public).</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:6mm;height:78mm">{img_tag(photo("paysages",0,"cotonou_ville"))}{img_tag(photo("pirogue_nautique",0,"ganvie"))}</div>
</div>""", section="Bienvenue")

# page 1.2 : géographie, départements
rows = "".join(f"<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td></tr>" for a, b, c in D.DEPARTEMENTS)
page(f"""<div class="m"><div class="eyebrow">Partie 1 · Géographie</div><h2>Douze départements, trois grandes ambiances</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:82mm 1fr;gap:7mm">
<div><img src="file://{MAPDIR}/map_departements.png" style="width:100%;height:auto;display:block"><p class="small" style="margin-top:1.5mm">Les 12 départements et leurs chefs-lieux. Fond : « Benin departments map in grayscale » (Fawaz.tairou, CC BY-SA 4.0, Wikimedia Commons), recoloré et annoté — œuvre dérivée, même licence.</p></div>
<div><p>Le <b>Sud</b> (Littoral, Atlantique, Ouémé, Mono, Couffo, Plateau, Zou) concentre la population, les ports et les sites historiques. Le <b>Centre</b> (Collines) offre un relief de granit et des étapes culturelles. Le <b>Nord</b> (Atacora, Donga, Borgou, Alibori) combine savanes, montagnes et grands parcs.</p>
<table style="margin-top:3mm"><tr><th>Département</th><th>Chef-lieu</th><th>Zone</th></tr>{rows}</table>
<p class="small" style="margin-top:2mm">Cotonou (département du Littoral) est la capitale économique ; Porto-Novo (Ouémé) la capitale officielle.</p></div></div>
<div class="box" style="margin-top:5mm"><b class="t">Principales villes</b><p style="margin:0"><b>Cotonou</b> (capitale économique, port et aéroport) · <b>Porto-Novo</b> (capitale officielle) · <b>Abomey-Calavi</b> et <b>Ouidah</b> (agglomération de Cotonou et ville historique) · <b>Parakou</b> (carrefour du Nord) · <b>Abomey</b> et <b>Bohicon</b> (ancien royaume du Dahomey) · <b>Djougou</b> et <b>Natitingou</b> (Nord-Ouest).</p></div>
</div>""", section="Bienvenue")

# page 1.3 : histoire et royaumes
tl = "".join(f"<div><b>{esc(a)}</b> — {esc(b)}</div>" for a, b in M.HISTOIRE)
page(f"""<div class="m"><div class="eyebrow">Partie 1 · Histoire</div><h2>Des royaumes à la république</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:1fr 70mm;gap:8mm"><div>
<p class="lead">{esc(M.ROYAUMES)}</p>
<div class="timeline" style="margin-top:5mm">{tl}</div></div>
<div style="display:grid;gap:4mm">{img_tag(photo("abomey_palais",0), "", "center", True)}{img_tag(photo("abomey_reliefs",0,"abomey_palais"), "", "center", True)}</div></div>
<div class="box" style="margin-top:6mm"><b class="t">À savoir</b><p style="margin:0">Les palais royaux d'Abomey ont été inscrits au patrimoine mondial de l'UNESCO en 1985. Le complexe transfrontalier W-Arly-Pendjari, dont fait partie le parc béninois de la Pendjari, l'a été en 2017.</p></div>
</div>""", section="Bienvenue")

# page 1.4 : peuples, cultures, gastronomie, artisanat
page(f"""<div class="m"><div class="eyebrow">Partie 1 · Cultures</div><h2>Peuples, langues et savoir-faire</h2><div class="rule"></div>
<p class="lead">{esc(M.PEUPLES)}</p>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;margin:5mm 0;height:64mm">{img_tag(photo("peuples",0,"festival"))}{img_tag(photo("artisanat_poterie",0,"adjarra"))}{img_tag(photo("cuisine",0,"cuisine2"))}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:7mm">
<div><h3>Gastronomie</h3><p>La cuisine béninoise tourne autour de la pâte (maïs, manioc, igname) et de sauces parfumées, du poisson braisé de la côte et des grillades de brochettes. Chaque région a sa signature : l'amiwo et l'akassa dans le Sud, le fromage peul wagasi dans le Nord. Voir Partie 5.</p>
<h3 style="margin-top:4mm">Artisanat</h3><p>Poterie d'Adjarra, tam-tams, tissus kanvo, tentures appliquées d'Abomey, bronzes à la cire perdue : l'artisanat est ici un patrimoine vivant, que l'on achète directement auprès de ceux qui le fabriquent.</p></div>
<div><h3>Particularités touristiques</h3><p>Un tourisme de mémoire (Ouidah, Abomey), un tourisme d'eau (Ganvié, Mono, Nokoué), un tourisme de rencontre (marchés, ateliers, festivals) et, au Nord, des paysages culturels et naturels remarquables dont l'accès doit faire l'objet de vérifications de sécurité.</p>
<h3 style="margin-top:4mm">Infrastructures et accès</h3><p>L'aéroport international Cardinal Bernardin Gantin (COO), à Cotonou, est la porte d'entrée aérienne ; le port autonome de Cotonou structure le commerce régional. Des routes bitumées relient la côte aux grandes villes du Sud et du Centre, et l'axe Cotonou–Parakou dessert le Nord.</p></div></div>
</div>""", section="Bienvenue")

# ───────────────────────── PARTIE 2 ─────────────────────────
opener(2, "Destinations et attractions", "Du littoral de Cotonou aux collines du Centre : fiches détaillées par destination, avec durées, périodes et accès.", photo("ouidah_porte", 0, "ouidah_route"), "")

page(f"""<div class="m"><div class="eyebrow">Partie 2 · Vue d'ensemble</div><h2>Carte des destinations</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:104mm 1fr;gap:7mm"><div>{map_inline("map_attractions.svg")}</div>
<div><p class="lead">Dix repères pour comprendre la géographie du voyage.</p>
<table><tr><th>N°</th><th>Destination</th><th>Pour</th></tr>
<tr><td>1</td><td>Cotonou</td><td>Ville, plages, marchés, art</td></tr>
<tr><td>2</td><td>Ouidah</td><td>Mémoire, vodun, patrimoine</td></tr>
<tr><td>3</td><td>Ganvié</td><td>Cité lacustre</td></tr>
<tr><td>4</td><td>Porto-Novo</td><td>Musées, architecture</td></tr>
<tr><td>5</td><td>Grand-Popo</td><td>Plages, mangroves</td></tr>
<tr><td>6</td><td>Abomey</td><td>Palais royaux (UNESCO)</td></tr>
<tr><td>7</td><td>Dassa-Zoumè</td><td>Collines, randonnée</td></tr>
<tr><td>8</td><td>Parakou</td><td>Carrefour du Nord</td></tr>
<tr><td>9</td><td>Nikki</td><td>Cour impériale, Gaani</td></tr>
<tr><td>10</td><td>Natitingou</td><td>Tata Somba — avis de sécurité</td></tr></table>
<p class="small" style="margin-top:3mm">Durées de visite et temps de trajet : estimations éditoriales indicatives, hors imprévus.</p></div></div>
</div>""", section="Destinations")

def dest_pages(d):
    zone = d["zone"]
    ph = []
    for idx in range(4):
        for t in d["photo"]:
            p = photo(t, idx)
            if p and p not in ph: ph.append(p)
        if len(ph) >= 6: break
    hero = ph[0] if ph else None
    n0 = len(pages) + 1
    # page A : hero + intro
    pA = f"""<div style="height:122mm;position:relative">{img_tag(hero, "full", "center", True)}<div class="overlay" style="background:linear-gradient(180deg,rgba(10,45,34,0) 40%,rgba(10,45,34,.85) 100%)"></div>
<div class="txt-over" style="bottom:7mm"><div class="eyebrow" style="color:#E9CD95">{esc(zone)} du Bénin</div><h1 style="font-size:30pt">{esc(d["name"])}</h1><p style="margin:1mm 0 0;font-style:italic;font-size:10.5pt">{esc(d["tagline"])}</p></div></div>
<div class="m" style="top:132mm">
<p class="small" style="margin-bottom:3mm"><b style="color:var(--green)">Localisation —</b> {esc(d["loc"])}</p>
<p class="lead">{esc(d["intro"])}</p>
<h3 style="margin-top:3mm">Histoire</h3><p>{esc(d["histoire"])}</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:3mm;height:{'62mm' if len(ph)>2 else '0mm'}">{img_tag(ph[1] if len(ph)>1 else None)}{img_tag(ph[2] if len(ph)>2 else None)}</div>
</div>"""
    page(pA, section="Destinations")
    attrs = "".join(f'<div class="attr"><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for a, b in d["attractions"])
    act = "".join(f'<span class="pill">{esc(a)}</span>' for a in d["activites"])
    alert = ""
    if d["id"] == "nord":
        alert = '<div class="box alert"><b class="t">Avis de sécurité — à lire avant tout projet de voyage</b><p style="margin:0">Voir la page d\'avertissement qui suit : certaines zones sont <b>formellement déconseillées</b> ou <b>déconseillées sauf raison impérative</b>. Les sites ci-dessous sont présentés pour leur intérêt culturel ; leur accessibilité doit être vérifiée juste avant le départ.</p></div>'
    ph2 = ph[3:5]
    gal = f'<div style="display:grid;grid-template-columns:{"1fr 1fr" if len(ph2)>1 else "1fr"};gap:4mm;height:58mm;margin-top:3mm">{"".join(img_tag(p) for p in ph2)}</div>' if ph2 else ""
    circ = [c for c in M.CIRCUITS if d["name"].split(",")[0] in c["route"] or (d["id"]=="dassa" and "Dassa-Zoumè" in c["route"])]
    circ_html = ('<div class="box" style="margin-top:4mm"><b class="t">Dans nos circuits</b><p style="margin:0">' + " · ".join(f'{esc(c["titre"])} ({esc(c["duree"])})' for c in circ) + ' — voir Partie 10.</p></div>') if circ else ""
    pB = f"""<div class="m"><div class="eyebrow">{esc(d["name"])} · à voir, à faire</div><h2>Attractions & activités</h2><div class="rule"></div>{alert}
<div class="cols2">{attrs}</div><div style="margin:2mm 0 3mm">{act}</div>{gal}
<div class="card" style="margin-top:4mm"><dl class="kv">
<dt>Durée indicative</dt><dd>{esc(d["duree"])}</dd><dt>Meilleure période</dt><dd>{esc(d["periode"])}</dd>
<dt>Accessibilité</dt><dd>{esc(d["acces"])}</dd><dt>Informations pratiques</dt><dd>{esc(d["pratique"])}</dd>
<dt>Vérification</dt><dd>{esc(d["statut"])}</dd></dl></div>{circ_html}</div>"""
    page(pB, section="Destinations")

for d in D.DEST:
    if d["id"] == "nord":
        # Avertissement avant la fiche Nord
        pts = "".join(f"<li style='margin-bottom:2.2mm'>{esc(p)}</li>" for p in M.AVERT_NORD["points"])
        page(f"""<div class="page dark" style="position:absolute;inset:0;background:#fbece5"></div><div class="m" style="color:var(--ink)"><div class="eyebrow">Avertissement important</div><h2 style="color:var(--terra)">Le Nord : avis de sécurité</h2><div class="rule" style="background:var(--terra)"></div>
<p class="lead">Les parcs de la Pendjari et du W, la région de Natitingou et d'autres zones du Nord font l'objet d'avis officiels qui évoluent. Nous les présentons ici pour la connaissance du pays, pas comme des destinations à recommander.</p>
<ul style="margin:5mm 0 4mm 5mm;font-size:9.4pt">{pts}</ul>
<div class="box alert"><b class="t">Sources de l'avertissement</b><p style="margin:0">{esc(M.AVERT_NORD["date"])}. Avant tout départ : fiche « Conseils aux voyageurs » de votre pays, ambassade, assureur.</p></div>
<div class="box"><b class="t">Constat de sources divergentes</b><p style="margin:0">La page opérateur d'African Parks indique une ouverture touristique du parc de la Pendjari, tandis que d'autres sources (guides de voyage, avis diplomatiques) signalent une fermeture ou une zone formellement déconseillée. Nous retenons la position la plus prudente.</p></div>
</div>""", "", section="Destinations")
    dest_pages(d)

# ───────────────────────── PARTIE 3 : EXPÉRIENCES ─────────────────────────
opener(3, "Expériences et activités", "Excursions, culture, gastronomie, nature : ce que l'on peut faire, et auprès de qui le réserver.", photo("pirogue_nautique", 0, "ganvie"), "")
lab = {"C": '<span class="tag ok">Commercialisée</span>', "S": '<span class="tag sec">Suggestion de découverte</span>', "N": '<span class="tag red">Non proposée</span>'}
def exp_row(e):
    n, ville, desc, dur, acc, typ, tar, contact = e
    return f"<tr><td><b>{esc(n)}</b><br><span class='small'>{esc(ville)}</span></td><td>{esc(desc)}</td><td>{esc(dur)}</td><td>{esc(acc)}</td><td>{esc(tar)}</td><td>{esc(contact)}<br>{lab[typ]}</td></tr>"
half = (len(M.EXPERIENCES) + 1) // 2
for part, subset in ((1, M.EXPERIENCES[:half]), (2, M.EXPERIENCES[half:])):
    rows = "".join(exp_row(e) for e in subset)
    extra = '<div class="box"><b class="t">Lire ce tableau</b><p style="margin:0"><span class="tag ok">Commercialisée</span> : un prestataire identifié propose la prestation. <span class="tag sec">Suggestion de découverte</span> : site ou activité intéressant, sans prestataire vérifié à ce jour : renseignez-vous sur place. <span class="tag red">Non proposée</span> : à ne pas entreprendre dans l\'état actuel des avis officiels.</p></div>' if part == 1 else ""
    gal = f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm;height:46mm;margin-top:4mm">{img_tag(photo("pirogue_nautique",part,"ganvie"))}{img_tag(photo("artisanat_poterie",part-1,"adjarra"))}{img_tag(photo("festival",part-1,"ouidah_vodun"))}</div>' if part == 1 else f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:3mm;height:50mm;margin-top:4mm">{img_tag(photo("artisanat_tissage",0,"artisanat_poterie"))}{img_tag(photo("artisanat_sculpture",0,"artisanat_poterie"))}</div>'
    page(f"""<div class="m"><div class="eyebrow">Partie 3 · Catalogue d'expériences ({part}/2)</div><h2>Que faire au Bénin ?</h2><div class="rule"></div>{extra}
<table><tr><th style="width:34mm">Expérience</th><th>Description</th><th style="width:15mm">Durée</th><th style="width:26mm">Accès</th><th style="width:24mm">Tarif</th><th style="width:36mm">Prestataire</th></tr>{rows}</table>{gal}</div>""", section="Expériences")

# ───────────────────────── PARTIE 4 : HÉBERGEMENTS ─────────────────────────
opener(4, "Hébergements", "Hôtels de luxe, hôtels de marque, villas de plage : le répertoire des adresses identifiées — et honnête sur ce qui reste à confirmer.", photo("grandpopo", 0, "cotonou_plage"), "")
def fiche_heb(h):
    return f"""<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="font-size:13pt">{esc(h["nom"])}</h3>{tag_status(h["statut"])}</div>
<p class="small" style="margin:0 0 2mm">{esc(h["ville"])} · {esc(h["adresse"])} · {esc(h["cat"])}</p>
<p>{esc(h["desc"])}</p>
<dl class="kv"><dt>Chambres</dt><dd>{esc(h["chambres"])}</dd><dt>Équipements</dt><dd>{esc(h["equip"])}</dd>
<dt>Tarifs</dt><dd>{esc(h["tarif"])}</dd><dt>Téléphone</dt><dd>{esc(h["tel"])}</dd><dt>WhatsApp</dt><dd>{esc(h["wa"])}</dd>
<dt>Site / réservation</dt><dd>{('<a href="'+esc(h["web"])+'" style="color:var(--green)">'+esc(h["web"])+'</a>') if h["web"].startswith("http") else esc(h["web"])} — {esc(h["resa"])}</dd><dt>Source</dt><dd>{esc(h["src"])}</dd></dl>
<p class="small" style="margin:1.5mm 0 0">Photographie de l'établissement : non disponible (aucune image sous licence libre vérifiée).</p></div>"""
H = M.HEBERGEMENTS
for i in range(0, len(H), 2):
    cards = "".join(fiche_heb(h) for h in H[i:i+2])
    intro = '<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Annuaire en phase de lancement</b><p style="margin:0">Six adresses sont documentées à ce jour : aucun hôtel n’a été ajouté sans source. Hôtels économiques, resorts, lodges, villas et écolodges peuvent se référencer <b>gratuitement</b> pendant la phase de lancement sur welcometobenin.com (voir page « Professionnels »). Le badge « Vérifié » est attribué après contrôle.</p></div>' if i == 0 else ""
    page(f"""<div class="m"><div class="eyebrow">Partie 4 · Répertoire ({i//2+1}/{(len(H)+1)//2})</div><h2>Où dormir</h2><div class="rule"></div>{intro}{cards}</div>""", section="Hébergements")

# ───────────────────────── PARTIE 5 : GASTRONOMIE ─────────────────────────
opener(5, "Restauration et gastronomie", "Pâte, poisson braisé, amiwo, akassa, wagasi : la cuisine béninoise, et les tables où la découvrir.", photo("cuisine", 0, "cuisine2"), "")
plats = "".join(f'<div class="attr"><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for a, b in M.PLATS)
page(f"""<div class="m"><div class="eyebrow">Partie 5 · Gastronomie</div><h2>Les saveurs du Bénin</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm;height:52mm;margin-bottom:5mm">{img_tag(photo("cuisine",0,"cuisine2"))}{img_tag(photo("cuisine",1,"cuisine2"))}{img_tag(photo("cuisine2",0,"cuisine"))}</div>
<div class="cols2">{plats}</div>
<div class="box"><b class="t">Conseil</b><p style="margin:0">Goûtez le poisson braisé dans un maquis de plage de la Route des Pêches, la pâte accompagnée d'une sauce du jour dans un restaurant populaire, et les brochettes de rue en soirée. Demandez le niveau de piment : il peut être élevé.</p></div></div>""", section="Gastronomie")
rr = "".join(f"<tr><td><b>{esc(r['nom'])}</b><br><span class='small'>{esc(r['ville'])} · {esc(r['loc'])}</span></td><td>{esc(r['type'])}</td><td>{esc(r['spec'])}</td><td>{esc(r['horaires'])}</td><td>{esc(r['prix'])}</td><td>{esc(r['contact'])}</td><td>{tag_status(r['statut'])}<br><span class='small'>{esc(r['src'])}</span></td></tr>" for r in M.RESTAURANTS)
page(f"""<div class="m"><div class="eyebrow">Partie 5 · Tables à découvrir</div><h2>Restaurants (Cotonou)</h2><div class="rule"></div>
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Restaurants : rejoignez l’annuaire</b><p style="margin:0">Maquis, tables gastronomiques, restaurants de plage, traiteurs : la rubrique Restaurants de Welcome to Bénin s’ouvre aux partenaires (gratuit en phase de lancement, 0 % de commission).</p></div>
<div class="box alert"><b class="t">Fiches partielles</b><p style="margin:0">Ces adresses sont issues de listes publiques (Petit Futé, Tripadvisor) et n'ont pas été confirmées en direct : horaires, prix et contacts sont donc « Non renseigné ». Vérifiez avant de vous déplacer. Aucun restaurant n'a été ajouté sans source.</p></div>
<table><tr><th>Établissement</th><th>Cuisine</th><th>Spécialités</th><th>Horaires</th><th>Prix</th><th>Contact</th><th>Statut</th></tr>{rr}</table>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;height:36mm;margin-top:4mm">{img_tag(photo("cotonou_plage",0,"cotonou_ville"))}{img_tag(photo("cotonou_ville",1,"cotonou_plage"))}</div>
<p class="small" style="margin-top:1.5mm">Images d'ambiance de Cotonou — elles ne représentent pas les établissements listés.</p></div>""", section="Gastronomie")

# ───────────────────────── PARTIE 6 : TRANSPORT ─────────────────────────
opener(6, "Transport et mobilité", "Aéroport, location de véhicules, navettes, taxis-motos : se déplacer au Bénin.", photo("transport", 0, "cotonou_aeroport"), "")
tr = "".join(f"<tr><td><b>{esc(t['nom'])}</b><br><span class='small'>{esc(t['ville'])}</span></td><td>{esc(t['type'])}</td><td>{esc(t['vehicules'])}<br><span class='small'>Capacité : {esc(t['capacite'])}</span></td><td>{esc(t['tarifs'])}</td><td>{esc(t['conditions'])}</td><td>{esc(t['zones'])}</td><td>{esc(t['contact'])}<br>{tag_status(t['statut'])}</td></tr>" for t in M.TRANSPORT)
page(f"""<div class="m"><div class="eyebrow">Partie 6 · Mobilité</div><h2>Services de transport</h2><div class="rule"></div>
<table><tr><th>Prestataire</th><th>Service</th><th>Véhicules</th><th>Tarifs</th><th>Conditions</th><th>Zones</th><th>Contact / statut</th></tr>{tr}</table>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;height:58mm;margin-top:6mm">{img_tag(photo("transport",0,"cotonou_aeroport"))}{img_tag(photo("cotonou_aeroport",0,"transport"))}</div>
<div class="box" style="margin-top:4mm"><b class="t">Bon à savoir</b><p style="margin:0">Transferts aéroport, minibus touristiques, transports interurbains, transport nautique et conciergerie : aucune offre n'a pu être documentée de manière vérifiable pour cette édition, hormis les prestataires listés ci-dessus. Pour un transfert depuis l'aéroport, demandez à votre hôtel ou à une agence listée en Partie 7.</p></div></div>""", section="Transport")

# ───────────────────────── PARTIE 7 : AGENCES ─────────────────────────
opener(7, "Agences de voyages et guides", "Des professionnels pour organiser circuits sur mesure, excursions et séjours.", photo("ouidah_porte", 1, "ouidah_route"), "")
ag = "".join(f"""<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 style="font-size:13pt">{esc(a['nom'])}</h3>{tag_status(a['statut'])}</div><p class="small" style="margin:0 0 2mm">{esc(a['ville'])}</p>
<p>{esc(a['pres'])}</p><dl class="kv"><dt>Services</dt><dd>{esc(a['services'])}</dd><dt>Circuits</dt><dd>{esc(a['circuits'])}</dd><dt>Tarifs</dt><dd>{esc(a['tarifs'])}</dd>
<dt>Téléphone</dt><dd>{esc(a['contact'])}</dd><dt>Site</dt><dd>{esc(a['site'])}</dd><dt>Réservation</dt><dd>{esc(a['resa'])}</dd><dt>Agrément</dt><dd>{esc(a['agrement'])}</dd><dt>Source</dt><dd>{esc(a['src'])}</dd></dl></div>""" for a in M.AGENCES)
page(f"""<div class="m"><div class="eyebrow">Partie 7 · Professionnels</div><h2>Agences et tour-opérateurs</h2><div class="rule"></div>{ag}
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Guides : une rubrique à construire avec vous</b><p style="margin:0">Welcome to Bénin prépare une rubrique « Guides touristiques agréés » (guide national certifié, de site, safari, thématique ; langues dont français, anglais, fon, yoruba, dendi, bariba). Guides, créez votre fiche gratuitement.</p></div>
<div class="box alert"><b class="t">Guides touristiques agréés</b><p style="margin:0">{esc(M.GUIDES_NOTE)}</p></div>
<div class="box"><b class="t">Vérifier un agrément</b><p style="margin:0">Aucune de ces agences ne publie de numéro d'agrément. Avant tout paiement, demandez la licence délivrée par les autorités du tourisme et une facture normalisée.</p></div></div>""", section="Agences & guides")

# ───────────────────────── PARTIE 8 : SERVICES ─────────────────────────
opener(8, "Services pratiques et professionnels", "Santé, urgences, coworking, assistance : l'essentiel pour séjourner sereinement.", photo("cotonou_ville", 2, "paysages"), "")
sv = "".join(f"<tr><td><b>{esc(s['nom'])}</b><br><span class='small'>{esc(s['cat'])}</span></td><td>{esc(s['ville'])}<br><span class='small'>{esc(s['adresse'])}</span></td><td>{esc(s['tel'])}</td><td>{esc(s['note'])}</td><td>{tag_status(s['statut'])}<br><span class='small'>{esc(s['src'])}</span></td></tr>" for s in M.SERVICES)
page(f"""<div class="m"><div class="eyebrow">Partie 8 · Services</div><h2>Santé, assistance et espaces de travail</h2><div class="rule"></div>
<table><tr><th>Prestataire</th><th>Localisation</th><th>Téléphone</th><th>Remarque</th><th>Statut</th></tr>{sv}</table>
<div class="box alert" style="margin-top:5mm"><b class="t">Numéros d'urgence</b><p style="margin:0">Pompiers : <b>118</b> · SAMU : <b>112</b> · Police républicaine : <b>116 / 117</b> (selon l'ARCEP Bénin ; ces lignes ont connu des perturbations — vérifier). Source : liste officielle de l'ARCEP, relayée par la presse béninoise.</p></div>
<div class="box"><b class="t">Rubriques non documentées</b><p style="margin:0">{esc(M.SERVICES_NOTE)}</p></div></div>""", section="Services")

# ───────────────────────── PARTIE 9 : ÉVÉNEMENTS ─────────────────────────
opener(9, "Festivals et événements", "Dates vérifiées au 25 novembre 2026 : les prochains rendez-vous, et ceux dont la date reste à confirmer.", photo("festival", 0, "ouidah_vodun"), "")
EV = M.EVENEMENTS
EVI = {'WeLovEya':1,'Festival':2,'Ouidah J':2,'Kaléta':0,'Cotonou ':1}
def ev_card(e):
    return f"""<div class="card" style="display:grid;grid-template-columns:40mm 1fr;gap:4mm;padding:3mm 4mm;margin-bottom:3.5mm"><div style="height:34mm">{img_tag(photo(e['photo'],EVI.get(e['nom'][:8],0),'festival'),'', 'center', True)}</div><div>
<div style="display:flex;justify-content:space-between;gap:3mm"><h3 style="font-size:10.4pt">{esc(e['nom'])}</h3></div>
<p style="margin:0 0 .6mm;font-size:8.2pt"><b>{esc(e['periode'])}</b> · {esc(e['lieu'])}</p><p class="small" style="margin:0 0 1.2mm"><span class="tag {'ok' if 'confirmées' in e['statut_date'].lower() and 'non' not in e['statut_date'].lower() else 'sec'}">{esc(e['statut_date'])}</span></p>
<p style="margin:0 0 1mm;font-size:8pt">{esc(e['desc'])}</p><p class="small" style="margin:0">Accès : {esc(e['acces'])} · Organisateur : {esc(e['orga'])} · Contact : {esc(e['contact'])} · Source : {esc(e['src'])}</p></div></div>"""
for i in range(0, len(EV), 4):
    page(f"""<div class="m"><div class="eyebrow">Partie 9 · Calendrier ({i//4+1}/{(len(EV)+3)//4})</div><h2>Rendez-vous culturels</h2><div class="rule"></div>
{'<div class="box"><b class="t">Règle de ce calendrier</b><p style="margin:0">Une date n\'est annoncée comme « confirmée » que si une source officielle ou la presse officielle la publie pour une édition à venir. Sinon, la période habituelle est indiquée avec la mention « à confirmer ».</p></div>' if i==0 else ''}
{''.join(ev_card(e) for e in EV[i:i+4])}</div>""", section="Événements")

# ───────────────────────── PARTIE 10 : CIRCUITS ─────────────────────────
opener(10, "Circuits et séjours organisés", "Six itinéraires de 24 heures à 14 jours, géographiquement cohérents — sans passage par les zones soumises à avis de sécurité.", photo("grandpopo", 1, "bouche_roy"), "")
for c in M.CIRCUITS:
    steps = "".join(f"<div><b>{esc(a)}</b> — {esc(b)}</div>" for a, b in c["jours"])
    note = f'<div class="box alert"><b class="t">Note</b><p style="margin:0">{esc(c["note"])}</p></div>' if c.get("note") else ""
    PMAP = {"c24":"cotonou_ville","c3":"ganvie","c5":"grandpopo","c7":"dassa","c10":"ouidah_porte","c14":"paysages"}
    key = c["id"]
    pid = photo(PMAP.get(key, "cotonou_ville"), 1 if key=="c10" else 0) or photo("cotonou_ville", 0)
    page(f"""<div class="m"><div class="eyebrow">Partie 10 · {esc(c['theme'])}</div><h2>{esc(c['titre'])}</h2><div class="rule"></div>
<div style="display:grid;grid-template-columns:1fr 84mm;gap:7mm"><div>
<p><span class="pill">{esc(c['duree'])}</span> {''.join(f'<span class="tag">{esc(r)}</span>' for r in c['route'])}</p>
<div class="timeline" style="margin-top:3mm">{steps}</div>{note}
<dl class="kv" style="margin-top:3mm"><dt>Trajets (estimés)</dt><dd>{esc(c['trajets'])}</dd><dt>Hébergements</dt><dd>{esc(c['hebergement'])}</dd>
<dt>Inclus</dt><dd>{esc(c['inclus'])}</dd><dt>Non inclus</dt><dd>{esc(c['non_inclus'])}</dd><dt>Tarif</dt><dd>{esc(c['tarif'])}</dd></dl></div>
<div>{map_inline('map_circuit_'+c['id']+'.svg')}</div></div>
<div style="height:{16 if c.get('note') else 44}mm;margin-top:4mm">{img_tag(pid, '', 'center', True)}</div></div>""", section="Circuits")
th = "".join(f'<div class="attr"><h3>{esc(a)}</h3><p>{esc(b)}</p></div>' for a, b in M.CIRCUITS_THEMES)
page(f"""<div class="m"><div class="eyebrow">Partie 10 · Thèmes</div><h2>Choisir son séjour par envie</h2><div class="rule"></div><div class="cols2">{th}</div>
<div class="box"><b class="t">Tarifs</b><p style="margin:0">Aucun tarif de circuit complet n'a pu être vérifié ; les prix sont donc indiqués « Sur demande ». Les prestataires listés en Parties 6 et 7 peuvent établir un devis.</p></div></div>""", section="Circuits")

# ───────────────────────── INFOS PRATIQUES ─────────────────────────
pr = "".join(f"<tr><td><b>{esc(a)}</b></td><td>{esc(b)}</td><td class='small'>{esc(c)}</td></tr>" for a, b, c in M.PRATIQUE)
page(f"""<div class="m"><div class="eyebrow">Infos pratiques</div><h2>Préparer son voyage</h2><div class="rule"></div>
<table><tr><th style="width:26mm">Rubrique</th><th>À savoir</th><th style="width:40mm">Source</th></tr>{pr}</table></div>""", section="Infos pratiques")
cs = "".join(f"<li style='margin-bottom:2mm'>{esc(c)}</li>" for c in M.CONSEILS)
page(f"""<div class="m"><div class="eyebrow">Infos pratiques</div><h2>Conseils aux voyageurs</h2><div class="rule"></div>
<ul style="margin:0 0 5mm 5mm;font-size:9.6pt">{cs}</ul>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;height:70mm">{img_tag(photo("cotonou_street",0,"cotonou_ville"))}{img_tag(photo("festival",1,"ouidah_vodun"))}</div>
<h3 style="margin-top:7mm">Rejoindre le catalogue</h3><p>Vous êtes un professionnel du tourisme au Bénin (hôtel, restaurant, agence, guide, transport, événement) ? Les fiches de ce catalogue sont gratuites à compléter et à corriger. Envoyez vos informations vérifiables (adresse, téléphone, tarifs, photographies dont vous détenez les droits) pour une prochaine édition.</p></div>""", section="Infos pratiques")


page(f"""<div class="m"><div class="eyebrow">Welcome to Bénin · Professionnels</div><h2>Hôtels, restaurants, agences, guides : soyez trouvés</h2><div class="rule"></div>
<p class="lead">« Vos clients vous cherchent déjà. Il est temps qu’ils vous trouvent. » En phase de lancement, le référencement sur Welcome to Bénin est <b>gratuit, sans carte bancaire, sans engagement et sans commission</b>.</p>
<div class="card" style="margin-top:4mm"><h3>Ce que comprend votre fiche</h3>
<dl class="kv" style="grid-template-columns:44mm 1fr"><dt>Une fiche complète</dt><dd>Photos, description, horaires et prix indicatifs.</dd>
<dt>Un contact direct</dt><dd>Vos clients vous écrivent sur WhatsApp ou vous appellent, sans intermédiaire.</dd>
<dt>De la visibilité</dt><dd>Votre établissement apparaît parmi les prestataires recommandés autour des attraits, des villes et des événements.</dd>
<dt>Le badge Vérifié</dt><dd>Attribué gratuitement après un contrôle par la rédaction (téléphone ou terrain) ; il ne s’achète pas.</dd>
<dt>Un guide Google Maps</dt><dd>Pas à pas pour être aussi bien trouvé sur Google Maps.</dd></dl></div>
<h3>Comment être référencé</h3>
<div class="timeline"><div><b>1.</b> Remplissez le formulaire de l’Espace professionnel (quelques minutes).</div><div><b>2.</b> La rédaction valide la fiche avant publication.</div><div><b>3.</b> Votre fiche est contrôlée ; le badge « Vérifié » est attribué si les prestations et coordonnées sont confirmées.</div><div><b>4.</b> Vous recevez les demandes directement, au téléphone ou sur WhatsApp.</div></div>
<div class="box"><b class="t">Partenaires fondateurs</b><p style="margin:0">Selon Welcome to Bénin, les établissements inscrits pendant la phase de lancement bénéficieront de conditions préférentielles sur les futures offres payantes optionnelles. Les fiches restent gratuites. Paiement futur privilégié par Mobile Money (MTN MoMo, Moov Money, Celtiis Cash).</p></div>
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Ce catalogue a besoin de vous</b><p style="margin:0">Ce catalogue manque de restaurants, de lodges, de guides agréés, de loueurs et de services : si vous exercez l’un de ces métiers, référencez-vous sur <b>welcometobenin.com/fr/espace-professionnel</b>.</p></div></div>""", section="Welcome to Bénin")

page(f"""<div class="m"><div class="eyebrow">Welcome to Bénin · Diaspora et investisseurs</div><h2>Au-delà du voyage : s’installer, investir, se reconnecter</h2><div class="rule"></div>
<p class="lead">Le troisième pilier de Welcome to Bénin s’adresse à la diaspora, aux afro-descendants et aux investisseurs, avec des dossiers thématiques et un annuaire de services d’appui.</p>
<table><tr><th style="width:46mm">Dossier</th><th>Ce que le site présente</th></tr>
<tr><td><b>Zone industrielle de Glo-Djigbé</b></td><td>Plateforme industrielle de transformation du coton, de l’anacarde et du soja.</td></tr>
<tr><td><b>Sèmè City</b></td><td>Cité de l’innovation et du savoir : universités, recherche, start-up.</td></tr>
<tr><td><b>Climat des affaires</b></td><td>Cadre juridique, stabilité, notation.</td></tr>
<tr><td><b>Filières stratégiques</b></td><td>Agro-industrie, énergie solaire, logistique, numérique, écotourisme haut de gamme.</td></tr>
<tr><td><b>Démarches</b></td><td>Création d’entreprise en ligne via le guichet monentreprise.bj, visas d’affaires.</td></tr>
<tr><td><b>My Afro Origins</b></td><td>Cadre légal de reconnaissance de la nationalité béninoise pour les afro-descendants (loi de 2024, selon le site).</td></tr></table>
<p class="small" style="margin-top:2mm">Les chiffres économiques avancés par le site (croissance, création d’entreprise en moins de 2 h, etc.) n’ont pas été vérifiés dans le cadre de ce catalogue ; consultez les sources institutionnelles avant toute décision.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm;height:60mm;margin:4mm 0">{img_tag(photo("cotonou_ville",0))}{img_tag(photo("cotonou_street",0,"cotonou_ville"))}</div>
<div class="box" style="border-left-color:var(--green)"><b class="t" style="color:var(--green)">Services d’appui répertoriés</b><p style="margin:0">Coworking et espaces de travail, hôtels d’affaires et séminaires, transport d’affaires avec chauffeur : voir Partie 8 et l’annuaire du site.</p></div></div>""", section="Welcome to Bénin")

page(f"""<div class="dark" style="position:absolute;inset:0;background:var(--green)"></div><div class="m" style="color:var(--ivory)"><div class="eyebrow" style="color:#E9CD95">Contact</div><h1 style="margin-top:3mm;font-size:34pt">Welcome to Bénin</h1><div class="rule"></div>
<p class="lead" style="color:#f1ecdf">Raconter le Bénin, révéler ses trésors, connecter ses acteurs.</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:8mm">
<div style="background:rgba(247,241,227,.08);padding:5mm;border-radius:2mm"><h3 style="color:#E9CD95">Voyageurs</h3><p>Parcourez le guide, construisez votre itinéraire et contactez directement les prestataires.</p><p><b>welcometobenin.com/fr</b></p></div>
<div style="background:rgba(247,241,227,.08);padding:5mm;border-radius:2mm"><h3 style="color:#E9CD95">Professionnels</h3><p>Référencez votre établissement gratuitement pendant la phase de lancement.</p><p><b>welcometobenin.com/fr/espace-professionnel</b></p></div>
<div style="background:rgba(247,241,227,.08);padding:5mm;border-radius:2mm"><h3 style="color:#E9CD95">WhatsApp rédaction et pro</h3><p style="font-size:14pt"><b>+229 01 95 36 95 72</b></p><p class="small" style="color:#d8d2c0">Canal le plus direct avec l’équipe ; réponse annoncée sous 24 h ouvrées.</p></div>
<div style="background:rgba(247,241,227,.08);padding:5mm;border-radius:2mm"><h3 style="color:#E9CD95">Presse et partenariats</h3><p>Demandes d’interviews, de tournages, d’iconographie, partenariats hôteliers et institutionnels : formulaire de contact du site.</p></div></div>
<p style="margin-top:10mm;font-size:8.6pt;color:#d8d2c0">Welcome to Bénin, initiative privée basée à Cotonou, se présente comme indépendante du gouvernement. Les informations de contact ci-dessus sont celles publiées sur son site à la date de consultation (25 novembre 2026).</p></div>""", "dark", section="Contact")

# ───────────────────────── SOURCES & CRÉDITS ─────────────────────────
src = "".join(f"<tr><td>{esc(a)}</td><td class='small'><a href=\"{esc(u)}\" style='color:var(--green)'>{esc(u)}</a></td><td class='small'>{esc(n)}</td></tr>" for a, u, n in M.SOURCES)
_rows = src.split("</tr>")
_rows = [r + "</tr>" for r in _rows if r.strip()]
for _k in range(0, len(_rows), 9):
    page(f"""<div class="m"><div class="eyebrow">Références</div><h2>Bibliographie et sources ({_k//9+1}/{(len(_rows)+8)//9})</h2><div class="rule"></div>
<table><tr><th>Source</th><th>Adresse</th><th>Utilisation</th></tr>{"".join(_rows[_k:_k+9])}</table></div>""", section="Sources")
page(f"""<div class="m"><div class="eyebrow">Références</div><h2>Méthode, limites et écarts entre sources</h2><div class="rule"></div>
<div class="box alert"><b class="t">Écarts relevés entre sources</b><p style="margin:0 0 1.5mm"><b>Vodun Days.</b> L'annuaire de référence indique « 9-10 janvier chaque année » ; les communications gouvernementales relayées par la presse annoncent pour 2027 une édition du 2 au 9 janvier. Nous retenons la dernière, à confirmer.</p>
<p style="margin:0 0 1.5mm"><b>Tata Somba.</b> Certaines sources les rattachent à l'inscription UNESCO « Koutammakou » ; ce paysage classé est situé au Togo voisin. Nous ne présentons pas les Tata Somba béninois comme inscrits.</p>
<p style="margin:0 0 1.5mm"><b>Pendjari.</b> La page de l'opérateur annonce un parc ouvert ; les avis diplomatiques le déconseillent formellement. Nous retenons la position la plus prudente.</p>
<p style="margin:0 0 1.5mm"><b>Fièvre jaune.</b> Les sources divergent sur le contrôle du certificat à l'entrée. Vaccination recommandée ; certificat à emporter.</p>
<p style="margin:0"><b>Numéros d'urgence.</b> Police : 116/117 ou 166/117 selon les sources, lignes parfois indisponibles. Repères les plus constants : pompiers 118, SAMU 112.</p></div>
<div class="box"><b class="t">Limites d'accès documentées</b>
<p style="margin:0 0 1.5mm"><b>Magnific</b> : non accessible depuis l'environnement de production et soumis à compte/abonnement. Aucune connexion ni paiement ; aucun visuel IA dans cette édition (prompts préparés dans la bibliothèque photographique).</p>
<p style="margin:0 0 1.5mm"><b>Unsplash et Pexels</b> : accès automatisé refusé par les sites ; non contourné. Les photographies proviennent de Wikimedia Commons.</p>
<p style="margin:0"><b>Annuaire de référence</b> : rubriques Restaurants, Guides agréés, Sport, Sorties et Services aux entreprises « en cours d'enrichissement » à la date de consultation.</p></div>
<div class="box"><b class="t">Rejoindre la prochaine édition</b><p style="margin:0">Professionnels du tourisme : transmettez vos coordonnées vérifiables et des photographies dont vous détenez les droits pour compléter les fiches « À confirmer ».</p></div></div>""", section="Sources")

# crédits photo : générés après coup (les pages précédentes enregistrent les ids utilisés)
CREDITS_PAGES_AT = len(pages) + 1

def credits_pages():
    ids = [i for i in used_ids()]
    ids.sort()
    per = 15
    chunks = [ids[i:i+per] for i in range(0, len(ids), per)] or [[]]
    for k, ch in enumerate(chunks):
        rows = "".join(f"<tr><td class='small'>{esc(MAN['images'][i]['title'])}</td><td class='small'>{esc(MAN['images'][i]['author_short'])}</td><td class='small'>{esc(MAN['images'][i]['lic_short'])}</td></tr>" for i in ch)
        page(f"""<div class="m"><div class="eyebrow">Références</div><h2>Crédits photographiques ({k+1}/{len(chunks)})</h2><div class="rule"></div>
{'<p class="small">Toutes les images proviennent de Wikimedia Commons (licences Creative Commons ou domaine public ; usage commercial autorisé, attribution et partage dans les mêmes conditions pour les licences BY-SA). Aucune image générée par IA n\'est utilisée dans cette édition. Le registre complet (URL, auteur, licence) accompagne le livrable « bibliothèque photographique ».</p>' if k==0 else ''}
<table><tr><th>Fichier</th><th>Auteur</th><th>Licence</th></tr>{rows}</table></div>""", section="Crédits")

credits_pages()

# fin : sommaire
toc_html = '<div class="m"><div class="eyebrow">Sommaire</div><h2>Dans ce catalogue</h2><div class="rule"></div>' + "".join(f'<div class="toc-row"><span class="n">{n}</span><span class="t">{esc(t)}</span><span class="p">p. {p}</span></div>' for n, t, p in TOC)
toc_html += f'<div class="toc-row"><span class="n"></span><span class="t">Welcome to Bénin : le guide, le réseau, le contact</span><span class="p">p. {TOC_PLACEHOLDER+1} et {next(i+1 for i,x in enumerate(pages) if "Hôtels, restaurants, agences, guides" in x)}-{next(i+1 for i,x in enumerate(pages) if "Raconter le Bénin" in x)}</span></div>'
toc_html += f'<div class="toc-row"><span class="n"></span><span class="t">Infos pratiques · Conseils</span><span class="p">p. {next(i+1 for i,s in enumerate(pages) if "Préparer son voyage" in s)}</span></div>'
toc_html += f'<div class="toc-row"><span class="n"></span><span class="t">Bibliographie, sources et crédits photographiques</span><span class="p">p. {CREDITS_PAGES_AT-1}</span></div></div>'
pages[TOC_PLACEHOLDER - 1] = pages[TOC_PLACEHOLDER - 1].replace("%%TOC%%", toc_html)

doc = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bénin — Catalogue touristique et commercial 2026-2027</title><style>{font_face()}{CSS}</style></head><body>{''.join(pages)}</body></html>"""
out = os.path.join(ROOT, "build", f"catalogue_{MODE}.html")
open(out, "w", encoding="utf-8").write(doc)
print("pages:", len(pages), "->", out, "| images used:", len(used_ids()))
