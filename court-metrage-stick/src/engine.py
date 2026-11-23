"""Moteur 2D : rig stick figure, primitives de dessin, caméra, sous-titres (Skia)."""
import math, random, json
import skia

W, H = 1080, 1920
FONT_DIR = "/usr/share/fonts/opentype/inter/"
_tf = {}
def tf(name):
    if name not in _tf:
        _tf[name] = skia.Typeface.MakeFromFile(FONT_DIR + name + ".otf")
    return _tf[name]
def font(size, w="Bold"):
    f = skia.Font(tf("Inter-" + w), size); f.setSubpixel(True); return f

def col(h, a=255):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(ch*2 for ch in h)
    return skia.Color(int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), a)
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def lerp(a, b, t): return a + (b - a) * t
def smooth(t): t = clamp(t); return t*t*(3-2*t)
def ease_out(t): t = clamp(t); return 1-(1-t)**3
def ease_in(t): t = clamp(t); return t**3
def prog(t, a, b): return clamp((t-a)/(b-a)) if b != a else (1.0 if t >= a else 0.0)

def paint(color=None, w=None, style=None, aa=True, a=None, cap=True, blend=None):
    p = skia.Paint(AntiAlias=aa)
    if color is not None: p.setColor(color)
    if a is not None: p.setAlphaf(a)
    if w is not None:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(w)
        if cap: p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blend: p.setBlendMode(blend)
    return p

def rect(c, x0, y0, x1, y1, color, a=1.0, r=0):
    p = paint(color); p.setAlphaf(a)
    if r: c.drawRoundRect(skia.Rect(x0, y0, x1, y1), r, r, p)
    else: c.drawRect(skia.Rect(x0, y0, x1, y1), p)

def vgrad(c, x0, y0, x1, y1, ctop, cbot):
    p = skia.Paint(Shader=skia.GradientShader.MakeLinear([(0, y0), (0, y1)], [ctop, cbot]))
    c.drawRect(skia.Rect(x0, y0, x1, y1), p)

def glow(c, x, y, r, color, a=0.6, add=True, sy=1.0):
    """Lumière radiale (additive)."""
    r0, g0, b0 = skia.Color4f(color).fR, skia.Color4f(color).fG, skia.Color4f(color).fB
    c0 = skia.Color4f(r0, g0, b0, a); c1 = skia.Color4f(r0, g0, b0, 0)
    sh = skia.GradientShader.MakeRadial((x, y), r, [c0.toColor(), c1.toColor()])
    p = skia.Paint(Shader=sh)
    if add: p.setBlendMode(skia.BlendMode.kPlus)
    c.save()
    if sy != 1.0:
        c.translate(x, y); c.scale(1, sy); c.translate(-x, -y)
    c.drawCircle(x, y, r, p)
    c.restore()

def text(c, s, x, y, size, color, w="Bold", align="l", a=1.0, spacing=0):
    f = font(size, w); p = paint(color); p.setAlphaf(a)
    wd = f.measureText(s)
    if align == "c": x -= wd/2
    elif align == "r": x -= wd
    c.drawString(s, x, y, f, p)
    return wd

def twidth(s, size, w="Bold"): return font(size, w).measureText(s)

def wrap(s, size, maxw, w="Bold"):
    words = s.split(" "); lines = []; cur = ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if twidth(t, size, w) <= maxw: cur = t
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

# ---------------------------------------------------------------- RIG
DEF = dict(lean=0, head=0, shL=4, elL=8, shR=4, elR=8, hipL=0, kneeL=0, hipR=0, kneeR=0,
           fear=0.0, smile=0.0, lookx=0.0, looky=0.0, blink=0.0, bx=0.0, by=0.0, mouth=0.0)
LEN = dict(torso=118, neck=12, head=40, up=68, fore=66, thigh=84, shin=84)

def mk(**k):
    d = dict(DEF); d.update(k); return d

def lerp_pose(a, b, t):
    return {k: lerp(a[k], b[k], t) for k in a}

def anim(t, keys):
    """keys: [(time, pose_dict_partial)] ; interpolation lissée (ease in/out)."""
    ks = [(tt, mk(**p)) for tt, p in keys]
    if t <= ks[0][0]: return ks[0][1]
    if t >= ks[-1][0]: return ks[-1][1]
    for i in range(len(ks)-1):
        t0, p0 = ks[i]; t1, p1 = ks[i+1]
        if t0 <= t <= t1:
            return lerp_pose(p0, p1, smooth((t-t0)/(t1-t0)))

def walk(phase, limp=0.0, tired=0.0, amp=1.0, arms=1.0):
    p = phase
    a = 26*amp
    # limp : la jambe R raccourcit son pas
    ampL = a; ampR = a*(1-0.35*limp)
    sL = math.sin(p); sR = math.sin(p+math.pi)
    kL = -(10 + 34*max(0, math.cos(p)))*amp
    kR = -(10 + 34*max(0, math.cos(p+math.pi)))*amp*(1-0.3*limp)
    return dict(hipL=ampL*sL, hipR=ampR*sR, kneeL=kL if sL < 0.9 else -6, kneeR=kR if sR < 0.9 else -6,
                shL=-24*arms*sL*(1-0.5*tired)+4, shR=-24*arms*sR*(1-0.5*tired)+4,
                elL=14+10*max(0, sL), elR=14+10*max(0, sR),
                by=-5*abs(math.cos(p))*amp + 4*limp*math.sin(p+math.pi/2))

def dirv(deg): r = math.radians(deg); return math.sin(r), math.cos(r)

class Rig:
    pass

def skeleton(px, py, pose, facing, scale=1.0):
    s = scale; f = facing
    lean = pose["lean"]; P = (px + pose["bx"]*s, py + pose["by"]*s)
    def P2(o, v, l):  # o + v*l  (v en coordonnées locales, flip x)
        return (o[0] + v[0]*l*s*f, o[1] + v[1]*l*s)
    tdir = (math.sin(math.radians(lean)), -math.cos(math.radians(lean)))
    N = P2(P, tdir, LEN["torso"])
    ha = lean + pose["head"]
    hd = (math.sin(math.radians(ha)), -math.cos(math.radians(ha)))
    HC = P2(N, hd, LEN["neck"] + LEN["head"])
    J = {"P": P, "N": N, "H": HC}
    for side in ("L", "R"):
        sh = N
        a1 = pose["sh"+side]; a2 = a1 + pose["el"+side]
        E = P2(sh, dirv(a1), LEN["up"]); Hd = P2(E, dirv(a2), LEN["fore"])
        h1 = pose["hip"+side]; h2 = h1 + pose["knee"+side]
        K = P2(P, dirv(h1), LEN["thigh"]); A = P2(K, dirv(h2), LEN["shin"])
        J["E"+side] = E; J["Hd"+side] = Hd; J["K"+side] = K; J["A"+side] = A
        J["foot"+side] = (A[0] + 26*s*f, A[1] + 2*s)
    return J

SKIN = col("#ece7dc"); BLACK = col("#08090c"); HOOD = col("#23262e"); HOOD2 = col("#1a1c22")

def seg(c, a, b, w, color, rim, rimcol):
    if rim:
        c.drawLine(a[0], a[1], b[0], b[1], paint(rimcol, w+rim))
    c.drawLine(a[0], a[1], b[0], b[1], paint(color, w))

def draw_figure(c, px, py, pose, facing=1, double=False, scale=1.0, rimcol=None, alpha=1.0,
                shadow=True, floor_y=None, jitter=0.0, T=0.0):
    s = scale
    rimcol = rimcol or col("#6f86a8", 150)
    if jitter:
        pose = dict(pose); pose["bx"] += jitter*math.sin(T*47); pose["by"] += jitter*math.cos(T*53)
    J = skeleton(px, py, pose, facing, s)
    c.save()
    if alpha < 1.0:
        c.saveLayerAlpha(None, int(alpha*255))
    if shadow:
        fy = floor_y if floor_y is not None else max(J["footL"][1], J["footR"][1]) + 4
        p = paint(col("#000000", 120)); c.drawOval(skia.Rect(px-70*s, fy-8*s, px+90*s, fy+14*s), p)
    rim = 4*s
    wl = 17*s
    # jambe lointaine, bras lointain
    for side, shade in (("L", True),):
        seg(c, J["P"], J["K"+side], wl, BLACK, rim, rimcol); seg(c, J["K"+side], J["A"+side], wl, BLACK, rim, rimcol)
        seg(c, J["A"+side], J["foot"+side], 13*s, BLACK, rim, rimcol)
    for side in ("L",):
        seg(c, J["N"], J["E"+side], 15*s, HOOD2, rim, rimcol); seg(c, J["E"+side], J["Hd"+side], 14*s, HOOD2, rim, rimcol)
        c.drawCircle(*J["Hd"+side], 8.5*s, paint(SKIN))
    # torse (sweat-shirt)
    seg(c, J["P"], J["N"], 42*s, HOOD, rim, rimcol)
    # bas du sweat + ceinture
    tdir = (J["N"][0]-J["P"][0], J["N"][1]-J["P"][1])
    L = math.hypot(*tdir) or 1; nx, ny = -tdir[1]/L, tdir[0]/L
    q = (J["P"][0] + tdir[0]*0.12, J["P"][1] + tdir[1]*0.12)
    c.drawLine(q[0]-nx*21*s, q[1]-ny*21*s, q[0]+nx*21*s, q[1]+ny*21*s, paint(col("#101216"), 4*s))
    # poche kangourou
    qq = (J["P"][0] + tdir[0]*0.38, J["P"][1] + tdir[1]*0.38)
    c.drawLine(qq[0]-nx*13*s, qq[1]-ny*13*s, qq[0]+nx*13*s, qq[1]+ny*13*s, paint(col("#14161b"), 3*s))
    if double:
        # déchirures
        rnd = random.Random(7)
        for i in range(5):
            u = rnd.uniform(0.15, 0.85); v = rnd.uniform(-14, 14)
            b0 = (J["P"][0]+tdir[0]*u+nx*v*s, J["P"][1]+tdir[1]*u+ny*v*s)
            ang = rnd.uniform(-1, 1)
            c.drawLine(b0[0], b0[1], b0[0]+(10+ang*8)*s, b0[1]+(14+ang*6)*s, paint(col("#c9ccd4", 170), 2.2*s))
        # ourlet déchiqueté
        hem = [(J["P"][0]+nx*k*s, J["P"][1]+ny*k*s) for k in range(-21, 22, 7)]
        pth = skia.Path(); pth.moveTo(*hem[0])
        for i, hp in enumerate(hem[1:]):
            pth.lineTo(hp[0]+(6 if i % 2 else -2)*s, hp[1]+(14 if i % 2 else 5)*s)
        c.drawPath(pth, paint(col("#23262e"), 5*s))
        # taches
        for i in range(3):
            u = 0.2+0.25*i
            c.drawCircle(J["P"][0]+tdir[0]*u+nx*(6-6*i)*s, J["P"][1]+tdir[1]*u+ny*(6-6*i)*s, 6*s, paint(col("#0c0d10", 200)))
    # jambe proche
    seg(c, J["P"], J["KR"], wl, BLACK, rim, rimcol); seg(c, J["KR"], J["AR"], wl, BLACK, rim, rimcol)
    seg(c, J["AR"], J["footR"], 13*s, BLACK, rim, rimcol)
    if double:
        # bas de pantalon déchiré
        for k in (-1, 0, 1):
            a = J["AR"]; c.drawLine(a[0]+k*6*s*facing, a[1]-4*s, a[0]+k*6*s*facing+3*s, a[1]+6*s, paint(col("#c9ccd4", 150), 2*s))
    # bras proche
    seg(c, J["N"], J["ER"], 16*s, HOOD, rim, rimcol); seg(c, J["ER"], J["HdR"], 15*s, HOOD, rim, rimcol)
    if double:
        a = J["HdR"]; c.drawLine(a[0]-6*s, a[1]-10*s, a[0]+5*s, a[1]-2*s, paint(col("#c9ccd4", 170), 2*s))
    c.drawCircle(*J["HdR"], 9.5*s, paint(SKIN))
    # capuche + tête
    H_ = J["H"]; r = LEN["head"]*s
    hood = paint(HOOD); c.drawCircle(H_[0]-6*s*facing, H_[1]+10*s, r*1.12, paint(rimcol, 1)) if False else None
    nk = J["N"]
    c.drawLine(nk[0], nk[1], H_[0], H_[1], paint(HOOD, 24*s))
    c.drawCircle(H_[0]-4*s*facing, H_[1]+9*s, r*0.98, paint(rimcol, 4*s) if False else paint(HOOD))
    c.drawCircle(H_[0], H_[1], r+3*s, paint(rimcol, a=0.6))
    c.drawCircle(H_[0], H_[1], r, paint(SKIN))
    # visage
    f = facing; fear = pose["fear"]; sm = pose["smile"]
    ex = 14*s*f; ey = -4*s
    lx, ly = pose["lookx"]*5*s*f, pose["looky"]*4*s
    eo = 1 - pose["blink"]
    for k, ox in enumerate((6*s, 24*s)):
        ecx = H_[0] + ox*f + 0; ecy = H_[1] + ey
        rr = (5.0 + 3.5*fear)*s
        if eo > 0.15:
            if fear > 0.3:
                c.drawCircle(ecx, ecy, rr+2*s, paint(col("#ffffff")))
                c.drawCircle(ecx, ecy, rr+2*s, paint(col("#222222"), 1.6*s))
                c.drawCircle(ecx+lx*0.8, ecy+ly*0.8, rr*0.45, paint(col("#0a0a0a")))
            else:
                c.drawOval(skia.Rect(ecx-rr*0.9, ecy-rr*eo, ecx+rr*0.9, ecy+rr*eo), paint(col("#0a0a0a")))
                if lx or ly: pass
        else:
            c.drawLine(ecx-rr, ecy, ecx+rr, ecy, paint(col("#0a0a0a"), 2.4*s))
        # sourcil
        ang = (fear*20) - (sm*4) + (-8 if sm < -0.3 else 0)
        by0 = ecy - (13+fear*7)*s
        c.drawLine(ecx-8*s*f, by0 + (ang*0.25 if k == 0 else -ang*0.25)*s, ecx+8*s*f, by0 + (-ang*0.25 if k == 0 else ang*0.25)*s,
                   paint(col("#15151a"), 3*s))
    # bouche
    mx = H_[0] + 17*s*f; my = H_[1] + 20*s
    mo = pose["mouth"]
    if mo > 0.1:
        c.drawOval(skia.Rect(mx-6*s, my-2*s, mx+6*s, my-2*s+16*s*mo), paint(col("#15080a")))
    else:
        pth = skia.Path(); pth.moveTo(mx-10*s, my)
        pth.quadTo(mx, my + sm*12*s - (fear*4 if sm >= 0 else 0)*s, mx+10*s, my - sm*2*s)
        c.drawPath(pth, paint(col("#15151a"), 3*s))
    if double:
        # cernes, éraflure rouge, poussière
        c.drawLine(H_[0]+2*s*f, H_[1]+4*s, H_[0]+16*s*f, H_[1]+7*s, paint(col("#6b6f78", 150), 3*s))
        pth = skia.Path(); pth.moveTo(H_[0]-8*s*f, H_[1]-24*s); pth.lineTo(H_[0]+2*s*f, H_[1]-8*s)
        c.drawPath(pth, paint(col("#a31c1c", 220), 3*s))
        for i in range(5):
            c.drawCircle(H_[0]+(-20+i*9)*s*f, H_[1]+(10+(i%2)*10)*s, 2.2*s, paint(col("#8f8f95", 150)))
    if alpha < 1.0: c.restore()
    c.restore()
    return J

# ---------------------------------------------------------------- CAMÉRA & EFFETS
def camera_begin(c, cx, cy, zoom, rot=0.0, shake=0.0, T=0.0):
    c.save()
    sx = shake*(math.sin(T*61.3)+0.6*math.sin(T*113.1))*14
    sy = shake*(math.cos(T*57.7)+0.6*math.sin(T*97.3))*14
    c.translate(W/2 + sx, H/2 + sy)
    c.rotate(rot + shake*1.2*math.sin(T*23.0))
    c.scale(zoom, zoom)
    c.translate(-cx, -cy)

def camera_end(c): c.restore()

def vignette(c, strength=0.75, tint=None, a_tint=0.0):
    sh = skia.GradientShader.MakeRadial((W/2, H*0.46), H*0.72,
        [skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, int(255*strength))], [0.45, 1.0])
    c.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh))
    if tint and a_tint > 0:
        sh2 = skia.GradientShader.MakeRadial((W/2, H*0.5), H*0.75,
            [skia.Color(tint[0], tint[1], tint[2], 0), skia.Color(tint[0], tint[1], tint[2], int(255*a_tint))], [0.25, 1.0])
        c.drawRect(skia.Rect(0, 0, W, H), skia.Paint(Shader=sh2))

# ---------------------------------------------------------------- SOUS-TITRES
RED_WORDS = {"mourir", "message", "propre", "numéro", "porte", "futur", "créer", "vérité", "accident",
             "moi", "toi", "frappe", "supplie", "erreur", "vrai", "détruire", "vie", "judas", "terrifiant",
             "blague", "dix", "bus", "n'ouvre", "pas"}
def build_chunks(timed):
    """timed: liste de (mot, t0, t1) en temps absolu, groupés par réplique -> chunks (g0,g1,[(mot,t0,t1)])"""
    import re
    chunks = []
    for words in timed:
        groups = []; cur = []
        for wd in words:
            trial = cur + [wd]
            lines = split_lines([w for w, _, _ in trial])
            if cur and (len(trial) > 7 or lines is None or len(lines) > 2):
                groups.append(cur); cur = [wd]
            else: cur = trial
            if re.search(r"[.?!…]$", wd[0]) and len(cur) >= 3: groups.append(cur); cur = []
        if cur: groups.append(cur)
        for g in groups: chunks.append([g[0][1], g[-1][2] + 0.35, g])
    chunks.sort(key=lambda c: c[0])
    for i in range(len(chunks)-1):
        chunks[i][1] = min(chunks[i][1], chunks[i+1][0] + 0.02)
    return [tuple(c) for c in chunks]

def split_lines(ws, maxc=21):
    s = " ".join(ws)
    if len(s) <= maxc: return [ws]
    best = None
    for i in range(1, len(ws)):
        a = " ".join(ws[:i]); b = " ".join(ws[i:])
        if len(a) <= maxc+4 and len(b) <= maxc+4:
            sc = abs(len(a)-len(b))
            if best is None or sc < best[0]: best = (sc, [ws[:i], ws[i:]])
    return best[1] if best else None

def draw_subs(c, T, chunks, y=1395, size=62):
    for g0, g1, ws in chunks:
        if g0 - 0.05 <= T <= g1:
            lines = split_lines([w for w, _, _ in ws])
            if not lines: continue
            idx = 0; gap = 16; fnt = font(size, "ExtraBold")
            y0 = y - (len(lines)-1)*size*0.62
            for li, ln in enumerate(lines):
                widths = [fnt.measureText(w) for w in ln]
                tw = sum(widths) + gap*(len(ln)-1)
                x = W/2 - tw/2; yy = y0 + li*size*1.25
                for wi, w in enumerate(ln):
                    wd, t0, t1 = ws[idx]; idx += 1
                    k = ease_out(prog(T, t0-0.02, t0+0.10))
                    if k <= 0: x += widths[wi] + gap; continue
                    key = w.lower().strip(".,!?…:;«»\"")
                    red = key in RED_WORDS
                    color = col("#ff3b3b") if red else col("#ffffff")
                    c.save()
                    c.translate(x + widths[wi]/2, yy); c.scale(lerp(0.82, 1, k), lerp(0.82, 1, k)); c.translate(-widths[wi]/2, 0)
                    # contour + ombre pour lisibilité
                    po = paint(col("#000000", int(255*k)), 11); po.setStrokeJoin(skia.Paint.kRound_Join)
                    c.drawString(w, 0, 3, fnt, po)
                    p = paint(color); p.setAlphaf(k)
                    c.drawString(w, 0, 0, fnt, p)
                    c.restore()
                    x += widths[wi] + gap
            break
