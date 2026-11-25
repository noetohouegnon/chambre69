# -*- coding: utf-8 -*-
"""Catalogue de la plateforme Welcome to Bénin et de ses fonctionnalités. Usage: python3 build_wtb.py print|web"""
import json, sys, os, html, base64
sys.path.insert(0, os.path.dirname(__file__))
import content_misc as M

MODE = sys.argv[1] if len(sys.argv) > 1 else "print"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PH = os.path.join(ROOT, "photos")
MAN = json.load(open(os.path.join(PH, "manifest.json"), encoding="utf-8"))
IMGDIR = os.path.join(PH, "final" if MODE == "print" else "web")
MAPDIR = os.path.join(ROOT, "build", "maps")
FONTS = "/tmp/claude-0/work/npm/node_modules/@fontsource"
esc = lambda s: html.escape(str(s), quote=True)
USED = []

def photo(topic, i=0, fb=None):
    ids = MAN["slots"].get(topic, []) or (MAN["slots"].get(fb, []) if fb else [])
    if not ids: return None
    pid = ids[i % len(ids)]
    if pid not in USED: USED.append(pid)
    return pid

def img(pid, cls="", pos="center", credit=True):
    if not pid: return '<div class="ph"></div>'
    m = MAN["images"][pid]
    c = f'<span class="credit">© {esc(m["author_short"])} · {esc(m["lic_short"])}</span>' if credit else ""
    return f'<div class="ph {cls}"><img src="file://{os.path.join(IMGDIR, pid + ".jpg")}" style="object-position:{pos}" alt="{esc(m["alt"])}">{c}</div>'

def svg(name): return open(os.path.join(MAPDIR, name), encoding="utf-8").read()

def font_face():
    def ff(fam, w, st, path):
        d = base64.b64encode(open(path, "rb").read()).decode()
        return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(data:font/woff2;base64,{d}) format('woff2');}}"
    o = [ff("Playfair Display", 400, "italic", FONTS + "/playfair-display/files/playfair-display-latin-400-italic.woff2")]
    for w in (500, 600, 700, 800): o.append(ff("Poppins", w, "normal", FONTS + f"/poppins/files/poppins-latin-{w}-normal.woff2"))
    for w in (400, 500, 600): o.append(ff("Inter", w, "normal", FONTS + f"/inter/files/inter-latin-{w}-normal.woff2"))
    return "\n".join(o)

CSS = """
@page{size:210mm 297mm;margin:0}
:root{--g:#0A9B52;--gd:#066B3A;--y:#FFC62B;--r:#E5383B;--b:#0E7C9B;--n:#14213D;--cream:#FFF9EC;--pink:#FFE3DC;--mint:#D8F3E4;--sun:#FFF0BF;--sky:#D6EEF5}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#777}
body{font-family:'Inter',sans-serif;color:var(--n);font-size:9.6pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:var(--cream);break-after:page;page-break-after:always}
h1,h2,h3,h4,.pop{font-family:'Poppins',sans-serif;font-weight:700;line-height:1.1;letter-spacing:-.2px}
h1{font-size:44pt;font-weight:800}h2{font-size:25pt}h3{font-size:12.5pt;line-height:1.2}h4{font-size:10pt}
.it{font-family:'Playfair Display',serif;font-style:italic;font-weight:400}
.m{position:absolute;left:15mm;right:15mm;top:15mm;bottom:17mm}
p{margin-bottom:2.4mm}
.lead{font-size:11.4pt;line-height:1.55}
.k{font-size:7.6pt;letter-spacing:2.4px;text-transform:uppercase;font-weight:700;color:var(--r)}
.foot{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;align-items:center;font-size:7pt;letter-spacing:.8px;text-transform:uppercase;font-weight:600;color:var(--n)}
.foot i{font-style:normal;background:var(--y);color:var(--n);border-radius:10mm;padding:.6mm 3mm;font-family:Poppins;font-weight:700;font-size:8pt}
.foot.w{color:#fff}.foot.w i{background:#fff}
.ph{position:relative;overflow:hidden;background:#d7cdb5;height:100%;min-height:0}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.credit{position:absolute;right:2mm;bottom:1.4mm;font-size:5.4pt;color:#fff;background:rgba(0,0,0,.5);padding:.2mm 1.4mm;border-radius:1mm;max-width:92%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.round{border-radius:5mm}.circle{border-radius:50%}
.full{position:absolute;inset:0}
.tile{border-radius:5mm;padding:5mm 5.5mm;color:#fff;position:relative;overflow:hidden}
.t-g{background:linear-gradient(135deg,#0A9B52,#0C7C60)}.t-y{background:linear-gradient(135deg,#FFC62B,#FF9F1C);color:var(--n)}
.t-r{background:linear-gradient(135deg,#E5383B,#C1121F)}.t-b{background:linear-gradient(135deg,#0E7C9B,#14213D)}.t-n{background:var(--n)}
.t-mint{background:var(--mint);color:var(--n)}.t-sun{background:var(--sun);color:var(--n)}.t-pink{background:var(--pink);color:var(--n)}.t-sky{background:var(--sky);color:var(--n)}.t-w{background:#fff;color:var(--n);box-shadow:0 .5mm 2.2mm rgba(20,33,61,.14)}
.big{font-family:Poppins;font-weight:800;font-size:34pt;line-height:1}
.chip{display:inline-block;font-size:7.4pt;font-weight:600;padding:.8mm 3mm;border-radius:10mm;background:rgba(255,255,255,.22);margin:0 1.2mm 1.2mm 0}
.chip.d{background:var(--n);color:#fff}.chip.g{background:var(--g);color:#fff}.chip.y{background:var(--y);color:var(--n)}.chip.r{background:var(--r);color:#fff}.chip.l{background:#fff;color:var(--n);box-shadow:0 .3mm 1mm rgba(0,0,0,.18)}
.blob{position:absolute;border-radius:50%;opacity:.9}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4.5mm}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}
.n{width:10mm;height:10mm;border-radius:50%;background:var(--y);color:var(--n);font-family:Poppins;font-weight:800;font-size:13pt;display:flex;align-items:center;justify-content:center;flex:none}
.row{display:flex;gap:4mm;align-items:flex-start}
.badge{display:inline-flex;align-items:center;gap:1.2mm;background:var(--g);color:#fff;font-size:7.4pt;font-weight:700;padding:.7mm 3mm;border-radius:10mm}
.btn{display:inline-block;background:#25D366;color:#fff;font-family:Poppins;font-weight:700;font-size:8.6pt;padding:1.6mm 5mm;border-radius:10mm}
.btn.c{background:var(--n)}
ul.c{list-style:none}ul.c li{padding-left:5mm;position:relative;margin-bottom:1.5mm}ul.c li:before{content:"";position:absolute;left:0;top:1.6mm;width:2.4mm;height:2.4mm;border-radius:50%;background:var(--y)}
.ribbon{position:absolute;top:0;left:0;right:0;height:3mm;background:linear-gradient(90deg,var(--g) 0 33.3%,var(--y) 33.3% 66.6%,var(--r) 66.6%)}
svg{display:block;width:100%;height:auto}
.small{font-size:7.4pt;opacity:.8}
"""
pages = []
def page(inner, bg="", foot=True, w=False, section=""):
    n = len(pages) + 1
    f = f'<div class="foot {"w" if w else ""}"><span>Welcome to Bénin · welcometobenin.com{(" · "+esc(section)) if section else ""}</span><i>{n}</i></div>' if foot else ""
    pages.append(f'<section class="page" style="{bg}"><div class="ribbon"></div>{inner}{f}</section>')

# 1 COUVERTURE
page(f'''<div class="full">{img(photo("ganvie",0),"full","center 45%",False)}</div>
<div class="full" style="background:linear-gradient(180deg,rgba(20,33,61,.15) 0%,rgba(20,33,61,.0) 35%,rgba(6,107,58,.92) 100%)"></div>
<div class="blob" style="width:90mm;height:90mm;background:var(--y);right:-28mm;top:-28mm;opacity:.95"></div>
<div class="blob" style="width:50mm;height:50mm;background:var(--r);right:30mm;top:44mm;opacity:.9"></div>
<div class="m" style="top:20mm"><span class="chip d">Catalogue 2026-2027</span></div>
<div class="m" style="top:auto;bottom:26mm;color:#fff">
<div class="k" style="color:var(--y);font-size:9pt">Le magazine-pays et l’annuaire du Bénin</div>
<h1 style="margin:3mm 0 4mm">Welcome<br>to Bénin</h1>
<p class="it" style="font-size:19pt;line-height:1.25;max-width:150mm">Raconter le Bénin, révéler ses trésors, connecter ses acteurs.</p>
<p style="margin-top:6mm"><span class="chip">Guide d’attraits</span><span class="chip">Annuaire vérifié</span><span class="chip">Itinéraires</span><span class="chip">Événements</span><span class="chip">WhatsApp direct · 0 % de commission</span></p></div>''', foot=False, w=True)

# 2 MANIFESTE
page(f'''<div class="blob" style="width:110mm;height:110mm;background:var(--sun);right:-40mm;top:-30mm"></div>
<div class="m"><div class="k">Pourquoi cette plateforme</div><h2 style="margin:2mm 0 4mm;max-width:150mm">Le Bénin méritait enfin <span style="color:var(--g)">le portail numérique</span> qu’il inspire.</h2>
<p class="lead" style="max-width:158mm">Réhabilitation des sites de Ouidah, d’Abomey et de Ganvié, essor de la Route des Pêches, reconnaissance du patrimoine vodun, scène créative en effervescence : le pays se transforme. Il manquait un outil unique pour <b>préparer son séjour avec des repères fiables</b> et <b>joindre directement les bonnes adresses</b>.</p>
<div class="grid2" style="margin:6mm 0;height:95mm"><div style="display:grid;grid-template-rows:1fr 1fr;gap:5mm"><div class="tile t-g"><div class="big">100 %</div><h3>indépendant</h3><p class="small" style="color:#fff">Initiative privée, sans influence gouvernementale ni corporative.</p></div><div class="tile t-y"><div class="big">0 %</div><h3>de commission</h3><p class="small">Réservations et prises de contact : tout revient aux professionnels locaux.</p></div></div>
<div style="display:grid;grid-template-rows:1fr 1fr;gap:5mm"><div class="tile t-r"><div class="big">12</div><h3>départements</h3><p class="small" style="color:#fff">Du littoral atlantique aux falaises et aux parcs du Grand Nord.</p></div><div class="tile t-b"><div class="big">Gratuit</div><h3>pour les voyageurs</h3><p class="small" style="color:#fff">Articles, guides pratiques et répertoires en libre accès.</p></div></div></div>
<div class="tile t-n"><p class="it" style="font-size:14.5pt;line-height:1.35;margin:0">« Nous croyons en un tourisme qui ne dénature pas, qui respecte l’histoire et qui enrichit directement les femmes et les hommes qui font vivre le pays chaque jour. »</p><p class="small" style="color:var(--y);margin:2mm 0 0">Manifeste de Welcome to Bénin · initiative privée basée à Cotonou</p></div>
</div>''', section="Manifeste")

# 3 TROIS PILIERS
page(f'''<div class="m"><div class="k">L’architecture de la plateforme</div><h2 style="margin:2mm 0 5mm">Trois piliers, une seule ambition</h2>
<div style="display:grid;gap:5mm">
<div class="tile t-g" style="display:grid;grid-template-columns:1fr 62mm;gap:5mm;padding:0;min-height:72mm"><div style="padding:6mm"><span class="chip">Pilier 1 · Éditorial</span><h3 style="font-size:17pt;margin:2mm 0">Le magazine-pays</h3><p>Reportages, enquêtes et récits sur la culture vodun, l’histoire royale du Danxomè, l’architecture contemporaine et les grands festivals. Aucun contenu automatisé ou superficiel : la rédaction raconte ce qu’elle vit.</p></div>{img(photo("ouidah_vodun",0),"","center",True)}</div>
<div class="tile t-y" style="display:grid;grid-template-columns:62mm 1fr;gap:5mm;padding:0;min-height:72mm">{img(photo("cuisine",0),"","center",True)}<div style="padding:6mm"><span class="chip d">Pilier 2 · Découverte</span><h3 style="font-size:17pt;margin:2mm 0">L’annuaire et le guide marchand</h3><p>Hôtels de charme, écolodges, tables gastronomiques, maquis, loueurs de 4x4, guides certifiés. Chaque fiche ouvre un <b>contact WhatsApp direct</b> pour réserver sans intermédiaire ni surcoût.</p></div></div>
<div class="tile t-b" style="display:grid;grid-template-columns:1fr 62mm;gap:5mm;padding:0;min-height:72mm"><div style="padding:6mm"><span class="chip">Pilier 3 · Passerelle</span><h3 style="font-size:17pt;margin:2mm 0">Diaspora et investissement</h3><p>Une boussole pour les afro-descendants en quête de leurs racines, la diaspora béninoise et les investisseurs : démarches, grands projets structurants, opportunités d’implantation.</p></div>{img(photo("cotonou_ville",0),"","center",True)}</div>
</div></div>''', section="Les 3 piliers")

# 4 PLAN DES FONCTIONNALITÉS
feat = [("Guide des attraits","Plus de 40 fiches de sites, par ville","t-g"),("Découvrir le pays","Histoire, culture, géographie, société","t-y"),("L’annuaire","8 catégories de prestataires","t-r"),("La fiche prestataire","Contact direct, tarif, équipements","t-b"),
        ("Le badge Vérifié","Un contrôle, pas une pub","t-g"),("L’outil d’itinéraire","1 à 14 jours, selon vos envies","t-y"),("Le calendrier","13 événements et festivals","t-r"),("Magazine et infos pratiques","Blog, visa, santé, argent","t-b")]
tiles = "".join(f'<div class="tile {c}" style="min-height:42mm"><div class="n" style="background:#fff;color:var(--n)">{i+1}</div><h3 style="margin-top:3mm">{esc(a)}</h3><p class="small" style="color:inherit;opacity:.92;margin-top:1mm">{esc(b)}</p></div>' for i, (a, b, c) in enumerate(feat))
page(f'''<div class="blob" style="width:70mm;height:70mm;background:var(--y);left:-24mm;bottom:20mm;opacity:.35"></div>
<div class="m"><div class="k">Sommaire</div><h2 style="margin:2mm 0 2mm">Huit fonctionnalités<br>pour préparer son séjour</h2><p class="lead">Voici ce que fait Welcome to Bénin, outil par outil. Les pages suivantes les détaillent avec des exemples concrets.</p>
<div class="grid2" style="margin-top:5mm">{tiles}</div>
<div class="tile t-n" style="margin-top:5mm;display:flex;gap:6mm;align-items:center"><div class="big" style="color:var(--y)">+</div><div><h3>Et aussi</h3><p class="small" style="color:#fff;margin:0">Affaires et investissement · Espace professionnel · Interface bilingue français / anglais · Accès gratuit pour les voyageurs.</p></div></div></div>''', section="Sommaire")

# 5 F1 GUIDE DES ATTRAITS
cities = ["Cotonou", "Ouidah", "Ganvié", "Porto-Novo", "Grand-Popo", "Abomey", "Adjarra", "Dassa-Zoumè", "Natitingou", "Nikki", "Parakou"]
page(f'''<div class="m"><span class="chip g">Fonctionnalité 1</span><h2 style="margin:2mm 0">Le guide des attraits, ville par ville</h2><p class="lead">Plus de 40 fiches de sites et d’expériences, classées par ville et par thématique : chaque page raconte, situe et conseille.</p>
<div style="display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:46mm 46mm;gap:4mm;margin:4mm 0">{img(photo("ouidah_porte",0),"round","center",True).replace('class="ph round"','class="ph round" style="grid-row:span 2"')}{img(photo("ganvie",2),"round")}{img(photo("abomey_palais",0),"round")}</div>
<div class="grid2"><div class="tile t-w"><h3>Une fiche d’attrait, c’est…</h3><ul class="c" style="margin-top:2mm"><li>un récit : histoire et particularités du lieu</li><li>un encadré « À savoir avant de partir »</li><li>un conseil de visite (horaire, tenue, pourboire)</li><li>la localisation et les coordonnées GPS</li><li>un lien d’itinéraire Google Maps</li><li>les « bonnes adresses » de la ville : guide, se déplacer, où manger, où dormir</li></ul></div>
<div class="tile t-sun"><h3>11 villes couvertes</h3><p style="margin:2mm 0">{"".join(f'<span class="chip d">{c}</span>' for c in cities)}</p><h4 style="margin-top:2mm">Exemples de fiches</h4><p class="small" style="opacity:1">Le Temple des Pythons · La Porte du Non-Retour · Les Palais royaux d’Abomey · Le village sur pilotis de Ganvié · La Bouche du Roy · Les 41 collines de Dassa · La Cour impériale de Nikki…</p></div></div></div>''', section="Guide des attraits")

# 6 F2 DÉCOUVRIR
page(f'''<div class="m" style="display:grid;grid-template-columns:1fr 70mm;gap:7mm"><div><span class="chip y">Fonctionnalité 2</span><h2 style="margin:2mm 0">Comprendre le pays avant de partir</h2><p class="lead">La rubrique « Découvrir » rassemble les fondamentaux, rédigés comme des articles de magazine.</p>
<div style="display:grid;gap:3mm;margin-top:3mm">{"".join(f'<div class="tile {c}" style="padding:3.5mm 5mm"><h3>{esc(a)}</h3><p class="small" style="margin:.5mm 0 0;color:inherit">{esc(b)}</p></div>' for a,b,c in [("Histoire","Des royaumes à la république","t-g"),("Culture et patrimoine","Vodun, arts, sites remarquables","t-r"),("Géographie et régions","Du littoral au Grand Nord","t-b"),("Population et société","Peuples, langues, traditions","t-y"),("Bénin aujourd’hui","Un pays en mouvement","t-n")])}</div>
<h3 style="margin-top:5mm">Infos pratiques voyageur</h3><p style="margin:1.5mm 0">{"".join(f'<span class="chip l">{x}</span>' for x in ["Visa et vaccinations","Santé et sécurité","Argent et paiement","FAQ"])}</p><p class="small">Le site rappelle que formalités, prix et recommandations évoluent : toujours vérifier les points sensibles auprès des sources officielles.</p></div>
<div><div class="tile t-mint" style="padding:3mm"><img src="file://{MAPDIR}/map_departements.png" style="width:100%;display:block"></div><p class="small" style="margin-top:1.5mm">12 départements, 12 chefs-lieux. Fond : Fawaz.tairou, CC BY-SA 4.0, recoloré.</p></div></div>''', section="Découvrir")

# 7 F3 ANNUAIRE
cats = [("Hébergements","Hôtel · Lodge · Chambre d’hôtes · Guesthouse · Auberge · Appartement meublé · Hôtel d’affaires","t-g"),
        ("Location de véhicules","Sans chauffeur · Avec chauffeur / VTC · Transport d’affaires · 4x4 safari · Minibus · Taxi-moto","t-y"),
        ("Restaurants","Maquis · Gastronomique · International","t-r"),
        ("Agences de voyage","Généraliste · Tour-opérateur réceptif · Affaires et événementiel · Billetterie","t-b"),
        ("Guides agréés","National certifié · Local · Safari et parcs · Thématique — 12 langues filtrables","t-n"),
        ("Sorties et vie nocturne","Bar et lounge · Discothèque · Casino · Rooftop","t-pink"),
        ("Sport et bien-être","Fitness · Padel · Spa · Piscine en accès journée","t-mint"),
        ("Services aux entreprises","Coworking et espaces de travail · Hôtels de séminaire","t-sky")]
ct = "".join(f'<div class="tile {c}" style="min-height:42mm"><h3>{esc(a)}</h3><p class="small" style="margin-top:1.5mm;color:inherit;opacity:.95">{esc(b)}</p></div>' for a, b, c in cats)
page(f'''<div class="m"><span class="chip r">Fonctionnalité 3</span><h2 style="margin:2mm 0">L’annuaire : huit catégories, un filtre par ville</h2><p class="lead">Chaque rubrique se filtre par <b>ville</b> (11 villes) et par <b>type</b> de prestation. Les fiches vérifiées sont signalées par un badge.</p>
<div class="grid2" style="margin-top:4mm">{ct}</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;height:50mm;margin-top:5mm">{img(photo("transport",0),"round")}{img(photo("cuisine2",0),"round")}{img(photo("grandpopo",0),"round")}</div></div>''', section="L’annuaire")

# 8 F4 FICHE PRESTATAIRE
page(f'''<div class="m"><span class="chip y">Fonctionnalité 4</span><h2 style="margin:2mm 0">Anatomie d’une fiche prestataire</h2><p class="lead">Une présentation identique pour tous, pour comparer vite et contacter sans détour. Exemple réel : une agence référencée à Ouidah.</p>
<div style="display:grid;grid-template-columns:96mm 1fr;gap:6mm;margin-top:3mm">
<div class="tile t-w" style="padding:5mm"><div style="display:flex;justify-content:space-between"><span class="chip d" style="margin:0">Agence de voyage généraliste</span><span class="badge">✓ Vérifié</span></div>
<h3 style="font-size:15pt;margin:3mm 0 1mm">Wonder Tours And Services</h3><p class="small">Ouidah · Docomey</p>
<p style="margin:2mm 0">Agence généraliste à Ouidah, personnel bilingue français / anglais, adaptée aux familles.</p>
<table style="width:100%;font-size:8.2pt;border-collapse:collapse">{"".join(f'<tr><td style="padding:1.2mm 0;border-bottom:.3mm solid #eee;color:#6a7280;width:30mm">{a}</td><td style="padding:1.2mm 0;border-bottom:.3mm solid #eee;font-weight:600">{b}</td></tr>' for a,b in [("Horaires d’accueil","Ouvert tous les jours"),("Tarif indicatif","À partir de 47 500 F CFA"),("Langues parlées","Français, Fon, Anglais"),("Équipements","Facture normalisée · Mobile Money · Famille · Excursions et circuits")])}</table>
<p style="margin:3mm 0 0"><span class="btn">WhatsApp</span> <span class="btn c">Appeler</span></p><p class="small" style="margin-top:2mm">Contact direct sans commission · Réponse directe du gérant</p></div>
<div style="display:grid;gap:3mm;align-content:start">{"".join(f'<div class="row"><div class="n">{i+1}</div><div><b class="pop">{a}</b><p class="small" style="margin:0;opacity:1">{b}</p></div></div>' for i,(a,b) in enumerate([("Le badge Vérifié","Contrôle de la rédaction"),("Localisation","Quartier et ville"),("Horaires et tarif","Indicatifs, sans surprise"),("Langues","Fon, français, anglais…"),("Équipements","Mobile Money, navette, facture"),("WhatsApp et appel","Direct, sans intermédiaire"),("Avis voyageurs","Ouverts après séjour")]))}</div></div>
<div class="tile t-sun" style="margin-top:5mm"><h4>Pourquoi c’est utile</h4><p style="margin:1mm 0 0">Mêmes champs partout : on compare un hôtel à un autre, un loueur à un autre. Et le contact part directement chez le professionnel.</p></div><div style="height:56mm;margin-top:5mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm">{img(photo('grandpopo',2),'round')}{img(photo('ouidah_pythons',0),'round')}{img(photo('portonovo',0),'round')}</div></div>''', section="La fiche")

# 9 F5 BADGE
page(f'''<div class="full" style="background:linear-gradient(160deg,#0A9B52,#066B3A)"></div><div class="blob" style="width:120mm;height:120mm;background:var(--y);right:-50mm;bottom:-40mm;opacity:.9"></div>
<div class="m" style="color:#fff"><span class="chip">Fonctionnalité 5</span><h2 style="margin:2mm 0;color:#fff;font-size:28pt">Le badge « Vérifié » ne s’achète pas</h2><p class="lead">Il est attribué gracieusement par la rédaction, après un contrôle des prestations, de l’accueil et des coordonnées réelles — par téléphone ou sur le terrain.</p>
<div class="grid2" style="margin:6mm 0"><div class="tile t-w"><div class="n" style="background:var(--g);color:#fff">1</div><h3 style="margin-top:3mm">Vous soumettez</h3><p class="small" style="opacity:1">Tout gérant remplit un formulaire en quelques minutes.</p></div><div class="tile t-w"><div class="n" style="background:var(--g);color:#fff">2</div><h3 style="margin-top:3mm">La rédaction valide</h3><p class="small" style="opacity:1">La fiche est examinée avant publication.</p></div><div class="tile t-w"><div class="n" style="background:var(--g);color:#fff">3</div><h3 style="margin-top:3mm">Elle contrôle</h3><p class="small" style="opacity:1">Prestations, accueil, coordonnées.</p></div><div class="tile t-w"><div class="n" style="background:var(--g);color:#fff">4</div><h3 style="margin-top:3mm">Le badge est attribué</h3><p class="small" style="opacity:1">Gratuit. Il ne s’achète à aucun moment.</p></div></div>
<div class="tile t-n"><h3 style="color:var(--y)">La charte de confiance</h3><ul class="c" style="margin-top:2mm"><li>Indépendance éditoriale : critères d’utilité et de vérité pour le visiteur.</li><li>Pas de faux avis ni de contenu sponsorisé opaque (engagement affiché par le site).</li><li>Soutien direct à l’économie locale : l’argent reste au Bénin.</li></ul></div><div style="height:52mm;margin-top:5mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm">{img(photo('tata_somba',0),'round')}{img(photo('abomey_palais',1),'round')}</div></div>''', w=True, section="Badge Vérifié")

# 10 F6 ITINÉRAIRES
page(f'''<div class="m"><span class="chip g">Fonctionnalité 6</span><h2 style="margin:2mm 0">L’outil d’itinéraire : dites-nous, on trace</h2><p class="lead">Indiquez combien de temps vous avez et ce qui vous intéresse : le site construit un itinéraire ville par ville, avec des attraits et des hébergements de l’annuaire.</p>
<div class="grid3" style="margin:4mm 0"><div class="tile t-y"><div class="big">1–14</div><h3>jours de circuit</h3></div><div class="tile t-r"><h3>Ville de départ</h3><p class="small" style="color:#fff;margin:1mm 0 0">Cotonou, Ouidah, Ganvié, Porto-Novo, Grand-Popo, Abomey, Dassa-Zoumè, Parakou…</p></div><div class="tile t-b"><h3>Vos envies</h3><p class="small" style="color:#fff;margin:1mm 0 0">Culture et histoire · Nature et écotourisme · Vodun et spiritualité · Plage · Affaires</p></div></div>
<h3>Exemples d’itinéraires (rédaction du catalogue)</h3>
<div class="grid3" style="margin-top:3mm"><div class="tile t-w" style="padding:3mm">{svg("map_circuit_c3.svg")}<h4 style="margin-top:2mm">Week-end mémoire et lagune</h4><p class="small" style="opacity:1;margin:0">3 jours · Cotonou, Ouidah, Ganvié</p></div><div class="tile t-w" style="padding:3mm">{svg("map_circuit_c5.svg")}<h4 style="margin-top:2mm">Du Sud royal à l’océan</h4><p class="small" style="opacity:1;margin:0">5 jours · Ouidah, Grand-Popo, Abomey, Porto-Novo</p></div><div class="tile t-w" style="padding:3mm">{svg("map_circuit_c7.svg")}<h4 style="margin-top:2mm">Des collines à la côte</h4><p class="small" style="opacity:1;margin:0">7 jours · avec Dassa-Zoumè</p></div></div>
<div class="tile t-sun" style="margin-top:5mm"><p style="margin:0"><b>24 heures, week-end, 10 ou 14 jours :</b> six trames d’itinéraires cohérentes ont été préparées pour ce catalogue ; l’outil du site les généralise selon votre durée et vos centres d’intérêt. Tracés schématiques, hors Nord soumis à avis de sécurité (page « Repères »).</p></div></div>''', section="Itinéraires")

# 11 F7 CALENDRIER
ev = [("1–6 déc. 2026","Cotonou Comedy Festival","Humour · Cotonou","t-r","Dates confirmées"),("26–27 déc. 2026","WeLovEya Festival","Afrobeat · Place de l’Amazone","t-y","Dates annoncées"),("2–9 janv. 2027","Vodun Days","Culture vodun · Ouidah","t-g","Dates annoncées par le gouvernement"),("Début janv.","Quintessence","Cinéma · Ouidah","t-b","À confirmer"),("Vers le 20 fév.","FInAB","Arts · Cotonou","t-r","À confirmer"),("Juillet-août","Festival des Masques","Patrimoine · Porto-Novo","t-g","À confirmer"),("23 août","JISTNA","Mémoire · Ouidah","t-n","Date fixe"),("Fin août","Ouidah Jazz · La Gaani","Jazz · Nikki","t-y","À confirmer")]
evh = "".join(f'<div class="tile {c}" style="padding:3.4mm 4.5mm;display:grid;grid-template-columns:34mm 1fr auto;gap:4mm;align-items:center"><div class="pop" style="font-size:11pt">{d}</div><div><b class="pop" style="font-size:10.5pt">{n}</b><br><span class="small" style="opacity:.95">{s}</span></div><span class="chip {"d" if c in ("t-y","t-mint") else ""}" style="margin:0">{st}</span></div>' for d, n, s, c, st in ev)
page(f'''<div class="m"><span class="chip r">Fonctionnalité 7</span><h2 style="margin:2mm 0">Le calendrier vivant du Bénin</h2><p class="lead">13 rendez-vous classés du plus proche au plus lointain, avec les hébergements et agences à proximité. Quelques repères (état au 25 novembre 2026) :</p>
<div style="display:grid;gap:2mm;margin-top:3mm">{evh}</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;height:30mm;margin-top:3mm">{img(photo("festival",0),"round")}{img(photo("nikki_gaani",0),"round")}{img(photo("ouidah_vodun",0),"round")}</div>
<p class="small" style="margin-top:2mm">Dates vérifiées auprès de la presse officielle béninoise ; le site annonce aussi Chill & Groove, OBIRIN, Kaléta et le Black Travel Summit 2027 (dates non annoncées). Toujours confirmer auprès de l’organisateur.</p></div>''', section="Calendrier")

# 12 F8 MAGAZINE
page(f'''<div class="m"><span class="chip y">Fonctionnalité 8</span><h2 style="margin:2mm 0">Le magazine : lire le Bénin avant d’y aller</h2><p class="lead">Le blog publie des récits de terrain et des guides pratiques, en français comme en anglais.</p>
<div class="grid3" style="margin:4mm 0">{"".join(f'<div class="tile t-w" style="padding:0">{img(photo(t,i),"","center",True).replace("class=\"ph \"","class=\"ph\" style=\"height:48mm\"")}<div style="padding:4mm"><span class="chip {c}">{k}</span><h3 style="margin-top:2mm">{h}</h3></div></div>' for t,i,c,k,h in [("festival",1,"r","Guide pratique","WeLovEya 2026 : le guide pratique"),("cotonou_plage",0,"g","Saison","Décembre à Cotonou"),("tata_somba",0,"y","Idées","Hors des sentiers battus")])}</div>
<div class="grid2"><div class="tile t-mint"><h3>Bilingue, vivant</h3><p style="margin:1.5mm 0 0">Toute la plateforme est éditée en français et en anglais, pour ouvrir le pays au public international et au voisin nigérian.</p></div><div class="tile t-sky"><h3>Rubriques</h3><p style="margin:1.5mm 0 0">Récits · Guides régionaux · Circuits thématiques · Dossiers diaspora et affaires.</p></div></div><div style="height:62mm;margin-top:5mm">{img(photo('ganvie',3),'round')}</div></div>''', section="Magazine")

# 13 DIASPORA & AFFAIRES
page(f'''<div class="full" style="background:var(--n)"></div><div class="blob" style="width:100mm;height:100mm;background:var(--b);left:-40mm;top:-30mm;opacity:.55"></div>
<div class="m" style="color:#fff"><span class="chip">Pilier 3 · Passerelle</span><h2 style="margin:2mm 0;color:#fff">Se reconnecter, s’installer, investir</h2><p class="lead">Un hub pour la diaspora, les afro-descendants et les investisseurs : six dossiers thématiques et des services d’appui locaux.</p>
<div class="grid2" style="margin:5mm 0">{"".join(f'<div class="tile {c}"><h3>{a}</h3><p class="small" style="margin:1mm 0 0;color:inherit;opacity:.95">{b}</p></div>' for a,b,c in [("Zone industrielle de Glo-Djigbé","Transformation du coton, de l’anacarde et du soja.","t-g"),("Sèmè City","Cité de l’innovation et du savoir.","t-y"),("Climat des affaires","Cadre juridique, stabilité.","t-r"),("Filières stratégiques","Agro, énergie, logistique, numérique, écotourisme.","t-b"),("Démarches","Création d’entreprise en ligne (monentreprise.bj), visas d’affaires.","t-g"),("My Afro Origins","Cadre de reconnaissance de la nationalité pour les afro-descendants (loi de 2024, selon le site).","t-r")])}</div>
<div style="height:60mm">{img(photo("cotonou_street",0),"round")}</div>
<p class="small" style="color:#cfd6e4;margin-top:3mm">Services d’appui annoncés : coworking, hôtels d’affaires et séminaires, transport d’affaires avec chauffeur. Les chiffres économiques avancés par le site n’ont pas été vérifiés ici : consulter les sources institutionnelles.</p></div>''', w=True, section="Diaspora et affaires")

# 14 REPÈRES VOYAGEUR + SÉCURITÉ
page(f'''<div class="m"><div class="k">Repères voyageur</div><h2 style="margin:2mm 0">Ce qu’il faut savoir avant de partir</h2>
<div class="grid2" style="margin:4mm 0">{"".join(f'<div class="tile {c}"><h4>{a}</h4><p class="small" style="margin:1mm 0 0;color:inherit;opacity:.95">{b}</p></div>' for a,b,c in [("Visa","e-Visa via le portail officiel evisa.bj ; vérifier frais et durée avant de payer.","t-g"),("Santé","Fièvre jaune recommandée, certificat à emporter ; prophylaxie du paludisme à voir avec un médecin.","t-y"),("Argent","Franc CFA (XOF), arrimé à l’euro ; mobile money très utilisé (MTN MoMo, Moov, Celtiis).","t-b"),("Urgences","Pompiers 118 · SAMU 112 · Police 116/117 (selon l’ARCEP ; lignes parfois indisponibles).","t-r"),("Climat","Meilleure période : novembre à mars. Harmattan de décembre à février.","t-mint"),("Aéroport","Cardinal Bernardin Gantin (COO), à Cotonou, ~5 km du centre.","t-sky")])}</div>
<div class="tile t-pink" style="border:.6mm solid var(--r)"><span class="chip r">À lire</span><h3 style="margin:1mm 0 2mm">Sécurité : le Nord fait l’objet d’avis officiels</h3><p style="margin:0">D’après la fiche du ministère français des Affaires étrangères (actualisée le 21 avril 2026), les parcs de la Pendjari et du W, leurs abords et les zones frontalières avec le Burkina Faso et le Niger sont « formellement déconseillés » ; le centre de l’Atacora (Natitingou, Boukoumbé, Tanguiéta) est « déconseillé sauf raison impérative ». Consultez la fiche de votre pays avant chaque départ. Ce catalogue ne propose aucun circuit dans ces zones.</p></div>
<div style="height:52mm;margin-top:5mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm">{img(photo("paysages",0),"round")}{img(photo("bouche_roy",0),"round")}</div></div>''', section="Repères")

# 15 PRESTATAIRES DÉJÀ RÉFÉRENCÉS
cards = [("Hébergement · Guesthouse","Villa St André","Grand-Popo · Hounsoukoé","Villa de 3 chambres près de la plage, salon, cuisine, 4 salles d’eau. Arrivée dès 14 h, départ 11 h.","Tarif sur demande","+229 01 97 26 65 79","t-g"),
         ("Location sans chauffeur","Bio Bangana Marouf","Cotonou · Akpakpa","Locations journalières ou horaires à Cotonou et environs ; déplacements possibles dans toutes les régions.","À partir de 25 000 F CFA","+229 01 97 26 53 92","t-y"),
         ("Agence de voyage","Wonder Tours And Services","Ouidah · Docomey","Excursions et circuits ; bilingue ; facture normalisée ; Mobile Money.","À partir de 47 500 F CFA","+229 01 40 89 54 22","t-r"),
         ("Réceptif · Navette aéroport","Adventure and Safari in Benin","Porto-Novo · Avakpa","Navette aéroport (Cotonou-Cadjehoun), excursions et circuits ; adapté aux familles.","Tarif selon prestation","+229 01 94 69 92 72","t-b")]
ch = "".join(f'<div class="tile {c}" style="min-height:58mm"><span class="chip {"d" if c=="t-y" else ""}">{k}</span><span class="badge" style="background:#fff;color:var(--gd);float:right">✓ Vérifié</span><h3 style="font-size:13.5pt;margin:2.5mm 0 .5mm">{n}</h3><p class="small" style="color:inherit;opacity:.95">{v}</p><p style="font-size:8.6pt;margin:2mm 0">{d}</p><p style="margin:0"><b class="pop">{t}</b><br><span class="small" style="opacity:1">{tel}</span></p></div>' for k, n, v, d, t, tel, c in cards)
page(f'''<div class="m"><span class="chip g">Déjà dans l’annuaire</span><h2 style="margin:2mm 0">Les premiers prestataires vérifiés</h2><p class="lead">À la date de consultation (25 novembre 2026), quatre fiches portent le badge « Vérifié ». La plateforme est en phase de lancement : <b>les autres rubriques attendent leurs premiers partenaires.</b></p>
<div class="grid2" style="margin-top:4mm">{ch}</div>
<div class="tile t-n" style="margin-top:5mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;text-align:center"><div><div class="big" style="color:var(--y)">1</div><p class="small" style="color:#fff;margin:0">hébergement vérifié</p></div><div><div class="big" style="color:var(--y)">3</div><p class="small" style="color:#fff;margin:0">transport et agences vérifiés</p></div><div><div class="big" style="color:var(--y)">0</div><p class="small" style="color:#fff;margin:0">restaurant, guide, spa… : à vous !</p></div></div></div>''', section="Prestataires")

# 16 PROFESSIONNELS
page(f'''<div class="full" style="background:linear-gradient(150deg,#FFC62B,#FF9F1C)"></div><div class="blob" style="width:100mm;height:100mm;background:var(--r);right:-40mm;top:-30mm;opacity:.85"></div>
<div class="m"><span class="chip d">Espace professionnel · Offre de lancement</span><h2 style="margin:2mm 0;font-size:30pt">Vos clients vous cherchent déjà.<br>Qu’ils vous trouvent.</h2><p class="lead">Référencez votre hôtel, restaurant, agence, guide ou service : <b>0 FCFA, sans carte bancaire, sans engagement, sans commission</b> pendant toute la phase de lancement.</p>
<div class="grid2" style="margin:5mm 0">{"".join(f'<div class="tile t-w"><div class="row"><div class="n" style="background:var(--g);color:#fff">✓</div><div><h4>{a}</h4><p class="small" style="margin:.5mm 0 0;opacity:1">{b}</p></div></div></div>' for a,b in [("Une fiche complète","Photos, description, horaires et prix indicatifs."),("Un contact direct","WhatsApp et appel, sans intermédiaire."),("De la visibilité","Parmi les prestataires recommandés autour des attraits, villes et événements."),("Le badge Vérifié","Gratuit, après contrôle par la rédaction."),("Un guide Google Maps","Être aussi trouvé sur Google Maps."),("Statut Partenaire privilégié","Conditions préférentielles sur les futures offres optionnelles.")])}</div>
<div class="tile t-n"><div class="grid3" style="text-align:center"><div><div class="big" style="color:var(--y)">0</div><p class="small" style="color:#fff;margin:0">FCFA pendant le lancement</p></div><div><div class="big" style="color:var(--y)">0 %</div><p class="small" style="color:#fff;margin:0">de commission</p></div><div><div class="big" style="color:var(--y)">24 h</div><p class="small" style="color:#fff;margin:0">délai de réponse annoncé</p></div></div></div>
<div style="height:30mm;margin-top:3mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm">{img(photo('transport',1),'round')}{img(photo('ouidah_kpasse',0),'round')}{img(photo('cuisine2',1),'round')}</div>
<div class="tile t-w" style="margin-top:4mm"><h4>Questions fréquentes</h4><p class="small" style="opacity:1;margin:1mm 0 0"><b>Pourquoi gratuit ?</b> Pour d’abord bâtir un annuaire fiable et attirer de vrais visiteurs. <b>Et après ?</b> Les fiches restent gratuites ; les options payantes seront facultatives, avec paiement Mobile Money privilégié.</p></div></div>''', section="Professionnels")

# 17 POURQUOI DIFFÉRENT
rows = [("Frais pour le client","Jusqu’à 20 % prélevés sur une réservation, selon le site","0 % : contact direct avec le prestataire"),("Contact","Via la plateforme","WhatsApp ou appel directs"),("Avis et labels","Parfois opaques ou sponsorisés","Badge Vérifié non payant, contrôlé"),("Contenu","Fiches génériques","Récits locaux, bilingues, ancrés dans le réel"),("Où va l’argent","Vers de grands groupes","Vers les professionnels béninois")]
rh = "".join(f'<tr><td style="padding:3mm;font-weight:700">{a}</td><td style="padding:3mm;background:#fbeaea">{b}</td><td style="padding:3mm;background:var(--mint);font-weight:600">{c}</td></tr>' for a, b, c in rows)
page(f'''<div class="m"><div class="k">L’idée</div><h2 style="margin:2mm 0 4mm">Ce qui change par rapport aux plateformes classiques</h2>
<table style="width:100%;border-collapse:separate;border-spacing:0 2mm;font-size:9pt"><tr><th></th><th class="pop" style="text-align:left;padding:2mm 3mm;color:var(--r)">Plateformes internationales</th><th class="pop" style="text-align:left;padding:2mm 3mm;color:var(--g)">Welcome to Bénin</th></tr>{rh}</table>
<p class="small">Comparatif tel que présenté par Welcome to Bénin ; non audité de façon indépendante.</p>
<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:5mm;height:62mm;margin-top:4mm">{img(photo("ganvie",0),"round")}<div style="display:grid;grid-template-rows:1fr 1fr;gap:5mm">{img(photo("artisanat_poterie",0),"round")}{img(photo("cuisine",2),"round")}</div></div></div>''', section="Différences")

# 18 CONTACT
page(f'''<div class="full">{img(photo("grandpopo",0),"full","center",False)}</div><div class="full" style="background:linear-gradient(180deg,rgba(6,107,58,.88),rgba(20,33,61,.92))"></div>
<div class="blob" style="width:80mm;height:80mm;background:var(--y);left:-30mm;bottom:-30mm"></div><div class="blob" style="width:44mm;height:44mm;background:var(--r);right:-10mm;top:70mm"></div>
<div class="m" style="color:#fff"><span class="chip">Rejoignez le mouvement</span><h1 style="margin:3mm 0 3mm;font-size:40pt">Welcome<br>to Bénin</h1><p class="it" style="font-size:16pt">Raconter le Bénin, révéler ses trésors, connecter ses acteurs.</p>
<div class="grid2" style="margin-top:9mm"><div class="tile" style="background:rgba(255,255,255,.14)"><h3 style="color:var(--y)">Voyageurs</h3><p>Parcourez le guide, construisez votre itinéraire, contactez directement les prestataires.</p><p class="pop"><b>welcometobenin.com/fr</b></p></div>
<div class="tile" style="background:rgba(255,255,255,.14)"><h3 style="color:var(--y)">Professionnels</h3><p>Référencez gratuitement votre établissement pendant la phase de lancement.</p><p class="pop"><b>welcometobenin.com/fr/espace-professionnel</b></p></div>
<div class="tile" style="background:var(--y);color:var(--n)"><h3>WhatsApp rédaction et pro</h3><p class="pop" style="font-size:16pt;margin:1mm 0">+229 01 95 36 95 72</p><p class="small">Réponse annoncée sous 24 h ouvrées.</p></div>
<div class="tile" style="background:rgba(255,255,255,.14)"><h3 style="color:var(--y)">Presse et partenariats</h3><p>Interviews, tournages, iconographie, partenariats hôteliers : formulaire de contact du site.</p></div></div>
<p class="small" style="margin-top:8mm;color:#e4e9f2">Initiative privée basée à Cotonou, se présentant comme indépendante du gouvernement. Coordonnées publiées sur le site à la date du 25 novembre 2026.</p></div>''', w=True, foot=True, section="Contact")

# 19 CRÉDITS
def credits():
    ids = sorted(USED)
    rows = "".join(f"<tr><td>{esc(MAN['images'][i]['title'])}</td><td>{esc(MAN['images'][i]['author_short'])}</td><td>{esc(MAN['images'][i]['lic_short'])}</td></tr>" for i in ids)
    half = (len(ids) + 1) // 2
    r1 = "".join(f"<tr><td>{esc(MAN['images'][i]['title'][:52])}</td><td>{esc(MAN['images'][i]['author_short'][:28])}</td><td>{esc(MAN['images'][i]['lic_short'])}</td></tr>" for i in ids[:half])
    r2 = "".join(f"<tr><td>{esc(MAN['images'][i]['title'][:52])}</td><td>{esc(MAN['images'][i]['author_short'][:28])}</td><td>{esc(MAN['images'][i]['lic_short'])}</td></tr>" for i in ids[half:])
    t = lambda r: f'<table style="width:100%;font-size:6.2pt;border-collapse:collapse"><tr style="background:var(--g);color:#fff"><th style="text-align:left;padding:1mm">Fichier</th><th style="text-align:left">Auteur</th><th style="text-align:left">Licence</th></tr>{r}</table>'
    page(f'''<div class="m"><div class="k">Références</div><h2 style="margin:2mm 0">Sources, crédits et mentions</h2>
<div class="grid2" style="margin:3mm 0"><div class="tile t-w"><h4>Sources</h4><p class="small" style="opacity:1;margin:1mm 0 0">Welcome to Bénin (welcometobenin.com, consulté le 25/11/2026) pour les fonctionnalités, rubriques et fiches ; gouv.bj et Benin Web TV pour les dates d’événements ; diplomatie.gouv.fr pour la sécurité ; evisa.bj pour le visa ; ARCEP Bénin pour les urgences ; Wikimedia Commons pour les photographies.</p></div>
<div class="tile t-w"><h4>Mentions</h4><p class="small" style="opacity:1;margin:1mm 0 0">Catalogue indépendant, rédigé à partir d’informations publiques. Les affirmations sur la plateforme reprennent ses propres déclarations. Aucune image générée par IA. Les licences Creative Commons ne couvrent pas le droit à l’image des personnes : revue conseillée avant une diffusion publicitaire. Carte des départements : œuvre dérivée, CC BY-SA 4.0.</p></div></div>
<h4 style="margin-bottom:2mm">Crédits photographiques (Wikimedia Commons)</h4><div class="grid2" style="gap:4mm">{t(r1)}{t(r2)}</div></div>''', section="Crédits")
credits()

import re as _re
def _scale(m):
    v = float(m.group(1))
    return m.group(0) if (v <= 7.2 or v >= 26) else f"font-size:{v*1.3:.1f}pt"
_body = "".join(pages)
_body = _re.sub(r"font-size:(\d+(?:\.\d+)?)pt", _scale, _body)
_css = _re.sub(r"font-size:(\d+(?:\.\d+)?)pt", _scale, CSS)
doc = f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Welcome to Bénin — le catalogue</title><style>{font_face()}{_css}</style></head><body>{_body}</body></html>'
out = os.path.join(ROOT, "build", f"wtb_{MODE}.html")
open(out, "w", encoding="utf-8").write(doc)
print("pages", len(pages), "images", len(USED), out)
