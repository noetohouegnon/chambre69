"""Alignement mot-à-mot approché à partir de l'énergie réelle de l'audio :
détecte les groupes voisés séparés par des pauses, les associe aux groupes de ponctuation du texte,
puis répartit les mots par poids syllabique. Fonctionne avec n'importe quelle voix (espeak, ElevenLabs...)."""
import wave, json, re, sys
import numpy as np
V = "aeiouyàâäéèêëîïôöùûüœ"
def syl(w):
    w = re.sub(r"[^\w'’-]", "", w.lower())
    g = len(re.findall(f"[{V}]+", w))
    if w.endswith("e") and g > 1: g -= 0.5
    return max(1.0, g) + 0.08*len(w)
def read(path):
    w = wave.open(path); sr = w.getframerate(); n = w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype=np.int16).astype(float)/32768
    if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    return x, sr
def voiced(x, sr, thr=0.05, gap=0.11):
    win = int(0.01*sr); e = np.convolve(np.abs(x), np.ones(win)/win, 'same')
    on = e > thr*max(e.max(), 1e-9)
    segs = []; i = 0; n = len(on)
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]: j += 1
            segs.append([i/sr, j/sr]); i = j
        else: i += 1
    merged = []
    for s in segs:
        if merged and s[0]-merged[-1][1] < gap: merged[-1][1] = s[1]
        else: merged.append(s)
    return merged
def phrases(words):
    out = []; cur = []
    for w in words:
        cur.append(w)
        if re.search(r"[.,?!…:;]$", w): out.append(cur); cur = []
    if cur: out.append(cur)
    return out
def spread(ws, t0, t1):
    wt = [syl(w) for w in ws]; tot = sum(wt); acc = 0; res = []
    for w, k in zip(ws, wt):
        res.append((w, t0+(t1-t0)*acc/tot, t0+(t1-t0)*(acc+k)/tot)); acc += k
    return res
def align(path, text):
    words = text.replace(" ?", "?").replace(" !", "!").replace(" …", "…").split()
    x, sr = read(path); segs = voiced(x, sr)
    ph = phrases(words)
    if not segs: return spread(words, 0, len(x)/sr)
    while len(segs) > len(ph):          # fusionne les plus petites pauses
        gaps = [segs[i+1][0]-segs[i][1] for i in range(len(segs)-1)]
        k = int(np.argmin(gaps)); segs[k][1] = segs[k+1][1]; del segs[k+1]
    res = []
    if len(segs) == len(ph):
        for p, s in zip(ph, segs): res += spread(p, s[0], s[1])
    else:                                # repli : un bloc voisé, pauses pondérées
        t0, t1 = segs[0][0], segs[-1][1]
        wt = [sum(syl(w) for w in p) + (0.9 if i < len(ph)-1 else 0) for i, p in enumerate(ph)]
        tot = sum(wt); acc = 0
        for p, k in zip(ph, wt):
            a = t0+(t1-t0)*acc/tot; b = t0+(t1-t0)*(acc+k-(0.9 if k != wt[-1] else 0))/tot
            res += spread(p, a, b); acc += k
    return res
if __name__ == "__main__":
    info = json.load(open("build/voice/info.json")); out = {}
    for k, v in info.items():
        out[k] = [(w, round(a, 3), round(b, 3)) for w, a, b in align(f"build/voice/{k}.wav", v["text"])]
    json.dump(out, open("build/voice/align.json", "w"), ensure_ascii=False)
    print("aligné :", len(out), "répliques")
