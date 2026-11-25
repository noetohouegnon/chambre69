# -*- coding: utf-8 -*-
"""Sélection des photographies depuis candidates.json (Wikimedia Commons), téléchargement, redimensionnement,
manifeste (licences) et contact-sheets de contrôle. Usage: python3 select_photos.py select|download|sheets"""
import json, re, sys, os, time, subprocess, html, urllib.parse, zlib
from PIL import Image
WORK = "/tmp/claude-0/work/photos"
ROOT = "/home/user/chambre69/catalogue_benin/photos"
UA = "BeninCatalogueBot/1.0 (editorial research project)"
C = json.load(open(f"{WORK}/candidates.json", encoding="utf-8"))

KW = {
 'ganvie': ['ganvi'], 'cotonou_ville': ['cotonou'], 'cotonou_plage': ['fidjross', 'plage', 'beach', 'route des p', 'atlantic'],
 'cotonou_amazone': ['amazon', 'agodji'], 'cotonou_dantokpa': ['dantokpa'], 'cotonou_cathedrale': ['cathéd', 'cathed', 'miséric'],
 'cotonou_street': ['street', 'graff', 'mur du port', 'mural', 'zémidjan', 'zemidjan', 'taxi-moto', 'moto'], 'cotonou_aeroport': ['aéroport', 'airport', 'pont', 'bridge', 'gantin'],
 'ouidah_porte': ['non-retour', 'non retour', 'no return', 'no-return'], 'ouidah_route': ['route des esclaves', 'slave route', "l'oubli", 'forgetting', 'esclav', 'zomaï', 'zomai', 'zoungbodji'],
 'ouidah_pythons': ['python'], 'ouidah_basilique': ['basilique', 'basilica', 'immacul'], 'ouidah_fort': ['fort', 'portugais', "musée d'histoire", 'history museum'],
 'ouidah_kpasse': ['kpass'], 'ouidah_vodun': ['vodun', 'voodoo', 'vodoun', 'zangbeto', 'egungun', 'ouidah'],
 'abomey_palais': ['palais', 'palace', 'royal'], 'abomey_reliefs': ['bas-relief', 'bas relief', 'relief', 'musée', 'museum', 'tenture', 'appliqu'], 'abomey_behanzin': ['béhanzin', 'behanzin', 'abomey'],
 'portonovo': ['porto'], 'portonovo_musees': ['musée', 'museum', 'honmè', 'honme', 'da silva', 'jardin', 'ethno'], 'adjarra': ['adjarra', 'poter', 'pottery'],
 'grandpopo': ['popo'], 'bouche_roy': ['bouche', 'mono', 'mangrove', 'popo', 'pirogue'],
 'dassa': ['dassa'], 'collines': ['savalou', 'savè', 'save', 'collines'],
 'pendjari_faune': ['pendjari'], 'pendjari_paysage': ['pendjari'], 'tata_somba': ['tata', 'somba', 'tammari', 'tamberma', 'koutammakou', 'boukoumb'],
 'natitingou': ['natitingou', 'atacora', 'atakora', 'tanougou', 'kota', 'cascade', 'waterfall'], 'nikki_gaani': ['nikki', 'gaani', 'gaâni'], 'parakou': ['parakou'],
 'w_park': ['parc w', 'w national', 'w park', 'parc du w'],
 'artisanat_poterie': ['poter', 'pottery', 'potier'], 'artisanat_tissage': ['tiss', 'weav', 'textile', 'indigo', 'teint', 'kanvo', 'pagne'],
 'artisanat_sculpture': ['sculpt', 'carv', 'bronze', 'artisan', 'craft', 'forgeron', 'fondeur'],
 'cuisine': ['cuisine', 'akassa', 'amiwo', 'wagasi', 'poisson', 'pâte', 'pate ', 'fufu', 'food', 'dish', 'plat', 'sauce', 'acarajé', 'sodabi', 'bissap', 'fish', 'cheese'], 'cuisine2': ['cuisine', 'food', 'dish', 'plat', 'sodabi', 'bissap', 'street', 'fish', 'beignet', 'cheese'],
 'festival': ['festival', 'dance', 'danse', 'masque', 'mask', 'gaani', 'fête', 'egungun', 'zangbeto', 'vodun', 'jazz', 'guèlèdè', 'gelede'],
 'pirogue_nautique': ['pirogue', 'lagoon', 'lagune', 'boat', 'ahémé', 'ahem', 'bopa', 'possotom', 'nokou'], 'carte': ['map', 'carte'], 'drapeau': ['flag', 'drapeau', 'coat'],
 'transport': ['taxi', 'zémi', 'zemi', 'bus', 'transport', 'gare', 'train', 'moto'], 'hotel_ambiance': ['hotel', 'hôtel', 'resort', 'lodge', 'piscine', 'pool'],
 'paysages': ['paysage', 'landscape', 'savann', 'sunset', 'palm', 'plage', 'beach', 'lac', 'river', 'fleuve'],
 'peuples': ['femme', 'woman', 'women', 'people', 'portrait', 'children', 'enfant', 'marché', 'market', 'fon', 'ethnic', 'school', 'école'],
 'unesco': ['unesco', 'biosphere', 'koutammakou', 'palais'], 'musee_art': ['zinsou', 'vodun', 'karo', 'fondation'],
}
BAD = ['logo', 'diagram', 'stamp', 'timbre', 'coat of arms', 'flag of', 'seal', 'icon', 'signature', 'screenshot', 'poster', 'afiche', 'banner', 'ballot', 'passport', 'currency', 'coin', 'banknote']
GEO = ['benin', 'bénin', 'cotonou', 'ouidah', 'abomey', 'porto-novo', 'porto novo', 'ganvi', 'popo', 'dassa', 'pendjari', 'natitingou', 'parakou', 'nikki', 'dahomey', 'atacora', 'atakora', 'adjarra', 'savalou', 'savè', 'tanguiéta', 'boukoumb', 'kandi']

def txt(c): return (c['title'] + ' ' + c['desc'] + ' ' + c['cats']).lower()
def score(c, topic):
    t = txt(c); s = 0.0
    if not any(g in t for g in GEO): return None
    if topic not in ('carte', 'drapeau') and any(b in t for b in BAD): return None
    if topic not in ('carte', 'drapeau') and re.search(r'\b(map|carte|svg)\b', c['title'].lower()): return None
    kws = KW.get(topic, [])
    hits = sum(1 for k in kws if k in t)
    if kws and hits == 0: return None
    s += min(hits, 3) * 0.4
    s += min(c['w'], 3200) / 3200.0
    if c['w'] < 1400: s -= 0.8
    if c['w'] >= c['h']: s += 0.6
    else: s -= 0.4
    if c['mime'] != 'image/jpeg': s -= 2
    if len(c['topics']) > 1: s -= 0.1
    return s

PREFER = {
 'ganvie': ['The village of Ganvié on Lake Nokoué', 'La cité lacustre de Ganvié', 'Allée ou rue des amoureux'],
 'ouidah_porte': ['La porte du non-retour.jpg', 'Porte du non-retour au Benin', 'Vue de nuit la porte du non retour a Ouidah.jpg', 'Ouidah-Esplanade de la Porte du Non-Retour-Côté océan (2)'],
 'ouidah_route': ['Monument fosse commune de la route des esclaves Ouidah.jpg', 'Les sept piliers', 'Route des esclaves à Ouidah.jpg'],
 'ouidah_basilique': ['Basilique Immaculée conception de Ouidah 01'],
 'ouidah_kpasse': ['Forêt sacrée de Ouidah', 'Cassia de la forêt'],
 'cotonou_ville': ['Cotonouskyline.jpg', "Place de l'Amazone à Cotonou", 'Vue panoramique du quartier à Cadjéhoun à Cotonou au Bénin 01'],
 'cotonou_aeroport': ["Façade principale de l'aéroport international de Cotonou", 'Aeroport International Cardinal Bernardin Gantin, Cotonou'],
 'abomey_palais': ["Palais du roi Guezo abritant le musée historique d'Abomey", "Palais du roi Glele - Site", "Palais du roi Agonglo - Site"],
 'abomey_behanzin': ['Place GOHO 02', 'Place GOHO 03'],
 'portonovo': ['Grande Mosquee Porto-Novo', 'Le pont de Porto Novo 02', 'Porto Novo Cathedral', "Village lacustre a l'entrée de Porto-Novo"],
 'grandpopo': ['Plage de Grand-Popo en fin de journée (1)', 'Plage de Grand-Popo (1)', 'Grand-Popo-17 août 1999', "Plage à l'Auberge de Grand-Popo au sud du Bénin 02"],
 'cuisine': ['Amiwô accompagné de poisson frit', "Plat d'akassa", 'Plat de piron avec bar braisé', 'Amiwô accompagné de la viande de poulet'],
 'cuisine2': ["Un plats d'amiwo au poisson", "Deux boules d'akassa au poisson", 'Plate de Akassa au Bénin'],
 'natitingou': ['Cascades de Tanougou (Bénin).jpg', 'Chutes de Tanongou', 'Chutes de Kota (1)', 'Benin Natitingou.JPG'],
 'pirogue_nautique': ["La Venise de l'Afrique", 'La cité lacustre de Ganvié', 'Pirogues à Hakouè'],
}
EXCLUDE = ['Devanture du Super U', 'Brothers', 'Statue du roi Béhanzin-Musée du Quai Branly', 'Plaque du Parc du W', 'Local Security Officers', 'Jeune Femme dansant', 'Wv Ouidah banner', 'Cotonou skyline banner', 'Tree of Forgetting', 'Benin UNESCO à la Porte du non-retour', 'Tour cycliste', 'Ancien site de construction', 'Atelier Openstreetmap', 'Royal Palaces of Abomey-133465', 'Le mémorial de Zungboji', 'Nouvelle Porte du Non-Retour', 'Petrol station', 'Enfants jouant', 'Parc national de la Pendjari-Piscine', 'Armature urbaine', 'Andira', 'Anisopappus', 'Crotalaria', 'Cyclocarpa', 'Indigofera', 'Sphenostylis', 'COLLECTIE TROPENMUSEUM', 'Dahomey. 20 ', 'Chamaeleo']

SLOTS_N = {'ganvie': 4, 'cotonou_ville': 3, 'cotonou_plage': 2, 'cotonou_amazone': 1, 'cotonou_dantokpa': 1, 'cotonou_cathedrale': 1, 'cotonou_street': 1, 'cotonou_aeroport': 2, 'ouidah_porte': 3, 'ouidah_route': 2, 'ouidah_pythons': 2, 'ouidah_basilique': 1, 'ouidah_fort': 1, 'ouidah_kpasse': 2, 'ouidah_vodun': 2, 'abomey_palais': 3, 'abomey_reliefs': 1, 'abomey_behanzin': 1, 'portonovo': 3, 'portonovo_musees': 1, 'adjarra': 0, 'grandpopo': 4, 'bouche_roy': 2, 'dassa': 2, 'collines': 1, 'pendjari_faune': 1, 'pendjari_paysage': 1, 'tata_somba': 2, 'natitingou': 3, 'nikki_gaani': 2, 'parakou': 0, 'w_park': 0, 'artisanat_poterie': 2, 'artisanat_tissage': 1, 'artisanat_sculpture': 1, 'cuisine': 4, 'cuisine2': 3, 'festival': 3, 'pirogue_nautique': 3, 'transport': 2, 'hotel_ambiance': 0, 'paysages': 3, 'peuples': 0, 'unesco': 0, 'musee_art': 1}

def clean(s): return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or ''))).strip()
def author_short(a):
    a = clean(a)
    a = re.sub(r'^(Own work by|Self-published work by|Photo by|Photograph by|Photographer:?)\s*', '', a, flags=re.I)
    return (a[:40] + '…') if len(a) > 41 else (a or 'Auteur inconnu')
def lic_short(l): return l.replace('CC BY-SA', 'CC BY-SA').replace('Public domain', 'Domaine public')

def select():
    chosen = {}; used = set(); slots = {}
    for topic, n in SLOTS_N.items():
        if n == 0:
            slots[topic] = []; continue
        cands = [(score(c, topic), c) for c in C.values() if topic in c['topics'] and not any(c['title'][5:].startswith(x) for x in EXCLUDE)]
        cands = [(s, c) for s, c in cands if s is not None]
        cands.sort(key=lambda x: -x[0])
        pref = []
        for pfx in PREFER.get(topic, []):
            m = next((c for c in C.values() if c['title'][5:].startswith(pfx) and not any(c['title'][5:].startswith(x) for x in EXCLUDE)), None)
            if m: pref.append((9.0, m))
        cands = pref + [x for x in cands if x[1]['title'] not in {p[1]['title'] for p in pref}]
        picked = []; authors = {}
        for s, c in cands:
            if c['title'] in used: continue
            a = author_short(c['author'])
            if s != 9.0 and authors.get(a, 0) >= (5 if topic.startswith('cuisine') else 2): continue
            picked.append(c); authors[a] = authors.get(a, 0) + 1; used.add(c['title'])
            if len(picked) >= n: break
        slots[topic] = []
        for c in picked:
            pid = re.sub(r'[^a-z0-9]+', '_', c['title'].lower().replace('file:', ''))[:48].strip('_') + '_' + str(zlib.crc32(c['title'].encode()) % 10000)
            chosen[pid] = c; slots[topic].append(pid)
    json.dump({'chosen': {k: v for k, v in chosen.items()}, 'slots': slots}, open(f"{WORK}/selection.json", 'w'), ensure_ascii=False, indent=1)
    for t, ids in slots.items():
        print(f"## {t} ({len(ids)}/{SLOTS_N[t]})")
        for i in ids:
            c = chosen[i]; print(f"  {i} | {c['title'][5:70]} | {c['w']}x{c['h']} | {c['lic']} | {author_short(c['author'])}")

def fetch(url, dest, tries=40):
    for t in range(tries):
        r = subprocess.run(['curl', '-s', '-L', '-m', '120', '-A', UA, '-o', dest, '-w', '%{http_code}', url], capture_output=True, text=True).stdout.strip()
        if r == '200' and os.path.getsize(dest) > 2000: return True
        time.sleep(11 if r == '429' else 6)   # respect Retry-After: 10
    return False

def _one(item):
    pid, c = item
    if os.path.exists(f"{ROOT}/final/{pid}.jpg"): return pid, True
    dest = f"{WORK}/original/{pid}.jpg"
    th = (c.get('thumb') or '').split('?')[0].replace('https://thumb.wikimedia.org', 'https://upload.wikimedia.org')
    wd = 1920 if c['w'] > 1920 else 1280 if c['w'] >= 1280 else 960 if c['w'] >= 960 else 0
    url = re.sub(r'/\d+px-', f'/{wd}px-', th, count=1) if (th and wd) else c['url']
    ok = fetch(url, dest)
    if ok:
        try:
            im = Image.open(dest).convert('RGB')
            im.thumbnail((2200, 2200)); im.save(f"{ROOT}/final/{pid}.jpg", quality=86, optimize=True)
            im.thumbnail((1100, 1100)); im.save(f"{ROOT}/web/{pid}.jpg", quality=70, optimize=True)
        except Exception as e:
            print('ERR', pid, e, flush=True); ok = False
    print(pid, 'OK' if ok else 'FAIL', flush=True)
    return pid, ok

def download():
    from concurrent.futures import ThreadPoolExecutor
    os.makedirs(f"{WORK}/original", exist_ok=True)
    sel = json.load(open(f"{WORK}/selection.json"))
    os.makedirs(f"{ROOT}/final", exist_ok=True); os.makedirs(f"{ROOT}/web", exist_ok=True)
    with ThreadPoolExecutor(max_workers=6) as ex:
        res = list(ex.map(_one, sel['chosen'].items()))
    print('done', sum(1 for _, ok in res if ok), '/', len(res))

def manifest():
    sel = json.load(open(f"{WORK}/selection.json"))
    images = {}; slots = {}
    for pid, c in sel['chosen'].items():
        if not os.path.exists(f"{ROOT}/final/{pid}.jpg"): continue
        images[pid] = dict(file=f"{pid}.jpg", title=c['title'][5:], author=clean(c['author']), author_short=author_short(c['author']),
                           lic=c['lic'], lic_short=lic_short(c['lic']), page=c['page'], url=c['url'], desc=clean(c['desc']),
                           alt=(clean(c['desc']) or c['title'][5:])[:140], topics=c['topics'], w=c['w'], h=c['h'], nature='Photographie réelle (Wikimedia Commons)',
                           commercial='Oui (licence libre)', attribution='Oui' )
    for t, ids in sel['slots'].items():
        slots[t] = [i for i in ids if i in images]
    json.dump({'images': images, 'slots': slots}, open(f"{ROOT}/manifest.json", 'w'), ensure_ascii=False, indent=1)
    print('manifest', len(images))

def sheets():
    man = json.load(open(f"{ROOT}/manifest.json"))
    from PIL import ImageDraw
    items = [(t, i) for t, ids in man['slots'].items() for i in ids]
    per = 20; cols = 5; tw, th = 300, 210
    os.makedirs(f"{WORK}/sheets", exist_ok=True)
    for k in range(0, len(items), per):
        chunk = items[k:k+per]; rows = (len(chunk) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * tw, rows * (th + 28)), 'white'); d = ImageDraw.Draw(sheet)
        for j, (t, i) in enumerate(chunk):
            im = Image.open(f"{ROOT}/web/{i}.jpg"); im.thumbnail((tw - 6, th - 4))
            x, y = (j % cols) * tw, (j // cols) * (th + 28)
            sheet.paste(im, (x + 3, y + 2)); d.text((x + 4, y + th + 2), f"{t}", fill='black'); d.text((x + 4, y + th + 14), man['images'][i]['title'][:44], fill='#444')
        sheet.save(f"{WORK}/sheets/sheet_{k//per:02d}.jpg", quality=80)
    print('sheets', (len(items) + per - 1) // per)

if __name__ == '__main__':
    {'select': select, 'download': download, 'manifest': manifest, 'sheets': sheets}[sys.argv[1]]()
