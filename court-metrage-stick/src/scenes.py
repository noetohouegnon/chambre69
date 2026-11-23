"""Décors, UI téléphone et mise en scène plan par plan."""
import math, json, random
from engine import *

INFO = json.load(open("build/voice/info.json"))
CUE_START = dict(n1=0.3, n2=7.0, n3=12.4, n4=20.0, n5=25.0, tv=30.2, n6=36.2, n7=40.0,
                 d1=48.4, n8=51.4, d2=57.0, n9=66.2, n10=79.4)
ALIGN = json.load(open("build/voice/align.json"))
CHUNKS = build_chunks([[(w, CUE_START[k]+a, CUE_START[k]+b) for w, a, b in ALIGN[k]] for k in CUE_START])
TOTAL = 88.6
END_PICTURE = 87.5     # coupure franche, puis silence

NUM = "+33 6 12 34 56 78"
FLOOR = 1150
COLD = col("#8fb4ff"); WARM = col("#ffb45e"); RED = col("#e03030")

# ---------------------------------------------------------------- UI téléphone
MSGS = [
 (0.3,  "in", "NE SORS PAS DE CHEZ TOI À 23H17. TU VAS MOURIR.", True),
 (18.8, "out", "Qui est-ce ?", False),
 (20.0, "in", "C'est toi. Dans 24 heures.", True),
 (23.8, "in", "Ne prends surtout pas le bus de 23h17.", True),
 (39.2, "in", "Maintenant, écoute-moi. Dans 10 secondes, quelqu'un va frapper à ta porte. N'OUVRE PAS.", True),
 (60.6, "in", "Si tu ouvres cette porte, tu deviendras moi.", True),
]
TYPING = [(19.2, 20.0)]    # points de frappe avant message entrant

def bubble(c, x, y, w, h, side, red):
    p = paint(col("#262b35") if side == "in" else col("#2a4a8a"))
    c.drawRoundRect(skia.Rect(x, y, x+w, y+h), 34, 34, p)
    if red:
        c.drawRoundRect(skia.Rect(x, y, x+w, y+h), 34, 34, paint(col("#e03030", 200), 3))

def draw_phone(c, T, msgs=MSGS, header=("Moi", NUM), compose=None, vib_t=None, lock=None, overlay=None,
               tint=0.0, show_typing=True):
    """compose=(texte, progression) ; lock = 'HH:MM' pour écran verrouillé"""
    ox = oy = 0
    if vib_t is not None and 0 <= T - vib_t < 0.9:
        ox = 7*math.sin((T-vib_t)*160)*(1-(T-vib_t)/0.9); oy = 4*math.cos((T-vib_t)*140)*(1-(T-vib_t)/0.9)
    c.save(); c.translate(ox, oy)
    X0, Y0, X1, Y1 = 150, 110, 930, 1345
    # halo écran
    glow(c, 540, 700, 760, col("#9bb8ff"), 0.20)
    c.drawRoundRect(skia.Rect(X0-10, Y0-10, X1+10, Y1+10), 100, 100, paint(col("#3a4150")))
    c.drawRoundRect(skia.Rect(X0, Y0, X1, Y1), 92, 92, paint(col("#05060a")))
    sx0, sy0, sx1, sy1 = X0+22, Y0+22, X1-22, Y1-22
    c.save(); c.clipRRect(skia.RRect.MakeRectXY(skia.Rect(sx0, sy0, sx1, sy1), 70, 70), doAntiAlias=True)
    vgrad(c, sx0, sy0, sx1, sy1, col("#10141b"), col("#0a0d12"))
    if lock:
        text(c, lock, 540, 560, 230, col("#f1f4fa"), "Light", "c")
        text(c, "mercredi 21 novembre", 540, 640, 46, col("#aab3c4"), "Medium", "c")
        c.restore(); notch(c, X0, X1, Y0); c.restore(); return
    # barre d'état
    text(c, "23:17" if T > 72 else "21:41", sx0+46, sy0+62, 38, col("#d8dde8"), "SemiBold")
    text(c, "5G  ▮▮▮▯", sx1-46, sy0+62, 32, col("#d8dde8"), "SemiBold", "r")
    # en-tête
    rect(c, sx0, sy0+90, sx1, sy0+240, col("#171c25"))
    c.drawCircle(sx0+90, sy0+165, 40, paint(col("#39404d")))
    text(c, header[0][0], sx0+90, sy0+182, 50, col("#f1f4fa"), "Bold", "c")
    text(c, header[0], sx0+150, sy0+158, 46, col("#f1f4fa"), "Bold")
    text(c, header[1], sx0+150, sy0+206, 32, col("#8f9bb0"), "Medium")
    # fil de messages (alignés depuis le bas)
    top = sy0+260; bottom = sy1-170
    items = []
    for (t0, side, txt, red) in msgs:
        if T >= t0:
            appear = ease_out(prog(T, t0, t0+0.25))
            lines = wrap(txt, 54, 540, "SemiBold"); items.append((side, lines, red, appear, t0))
    if show_typing:
        for (a, b) in TYPING:
            if a <= T < b: items.append(("in", None, False, 1.0, a))
    FS = 54; LH = 68
    c.save(); c.clipRect(skia.Rect(sx0, top-6, sx1, bottom+30))
    def hgt(it): return 84 if it[1] is None else 40 + LH*len(it[1])
    total = sum(hgt(it)+26 for it in items)
    y = top + 10 - max(0, total - (bottom-top-10))
    for side, lines, red, appear, t0 in items:
        if lines is None:
            h = 84; w = 150; x = sx0+30
            bubble(c, x, y, w, h, "in", False)
            for i in range(3):
                k = 0.5+0.5*math.sin(T*9 - i*0.9)
                c.drawCircle(x+40+i*35, y+h/2, 10, paint(col("#cfd6e6"), a=0.35+0.65*k))
            y += h+26; continue
        h = hgt((0, lines)); w = max(twidth(l, FS, "SemiBold") for l in lines) + 60
        x = sx0+30 if side == "in" else sx1-30-w
        c.save(); c.translate(0, (1-appear)*40)
        c.saveLayerAlpha(None, int(255*appear))
        bubble(c, x, y, w, h, side, red)
        for i, ln in enumerate(lines):
            colr = col("#ffffff")
            if red and any(k in ln for k in ("MOURIR", "N'OUVRE", "moi.")): colr = col("#ff5a5a")
            text(c, ln, x+30, y+60+i*LH-4, FS, colr, "SemiBold")
        c.restore(); c.restore()
        y += h+26
    c.restore()
    # barre de saisie
    rect(c, sx0+24, sy1-150, sx1-24, sy1-60, col("#1a2029"), 1, 45)
    if compose:
        s, p = compose; n = int(len(s)*p)
        text(c, s[:n] + ("▏" if int(T*3) % 2 == 0 else ""), sx0+60, sy1-90, 40, col("#f1f4fa"), "Medium")
    else:
        text(c, "Message", sx0+60, sy1-90, 40, col("#58627a"), "Medium")
    if overlay: overlay(c, sx0, sy0, sx1, sy1)
    c.restore()
    notch(c, X0, X1, Y0)
    c.restore()

def notch(c, X0, X1, Y0):
    c.drawRoundRect(skia.Rect((X0+X1)/2-70, Y0+26, (X0+X1)/2+70, Y0+62), 18, 18, paint(col("#000000")))

def thumb(c, T, taps, target=(700, 1255)):
    """bras + pouce qui vient taper sur la barre de saisie"""
    k = 0.0
    for a, b in taps:
        k = max(k, smooth(prog(T, a-0.5, a)) * (1 - smooth(prog(T, b, b+0.4))))
    if k <= 0: return
    wob = 4*math.sin(T*18)
    tx, ty = target[0] + wob, target[1] + 6*math.cos(T*14)
    bx, by = 1180, 1800
    hx, hy = lerp(bx, tx+90, k), lerp(by, ty+170, k)
    c.drawLine(bx+200, by+300, hx, hy, paint(HOOD, 84))
    c.drawLine(bx+200, by+300, hx, hy, paint(col("#6f86a8", 90), 128*0+4))
    c.drawCircle(hx, hy, 50, paint(SKIN))
    c.drawLine(hx-6, hy-14, tx, ty, paint(SKIN, 48))
    for a, b in taps:
        if a <= T < b:
            # ondes de tap rythmées
            ph = (T*7) % 1.0
            c.drawCircle(tx, ty, 18+40*ph, paint(col("#ffffff", int(160*(1-ph))), 3))

def blur_bg(c, T, warm=True, dark=0.0):
    vgrad(c, 0, 0, W, H, col("#0b0e14"), col("#06070a"))
    glow(c, 160, 420, 520, WARM if warm else COLD, 0.10)
    glow(c, 900, 1500, 420, col("#335a9a"), 0.10)

# ---------------------------------------------------------------- Visages de face (judas / gros plan)
def front_head(c, cx, cy, s, T, double=False, fear=0.0, mouth=0.0, tilt=0.0, look=(0, 0), breath=0.0, tears=True):
    c.save(); c.translate(cx, cy + breath*6*s); c.rotate(tilt); c.scale(s, s)
    # épaules / sweat
    sh = skia.Path(); sh.moveTo(-340, 1400); sh.lineTo(-330, 520); sh.quadTo(-300, 190, -120, 170); sh.lineTo(120, 170); sh.quadTo(300, 190, 330, 520); sh.lineTo(340, 1400); sh.close()
    c.drawPath(sh, paint(col("#6f86a8", 120), 8)); c.drawPath(sh, paint(HOOD))
    c.drawCircle(0, 100, 150, paint(HOOD))       # capuche
    # cordons
    for dx in (-26, 26): c.drawLine(dx, 250, dx*1.4, 400, paint(col("#cfd3da", 200), 6))
    # tête
    c.drawCircle(0, 0, 158, paint(col("#6f86a8", 130)))
    c.drawCircle(0, 0, 150, paint(SKIN))
    ex = 54; ey = -12
    for sx in (-1, 1):
        rr = 20 + 14*fear
        cxx = sx*ex
        c.drawCircle(cxx, ey, rr+7, paint(col("#ffffff")))
        c.drawCircle(cxx, ey, rr+7, paint(col("#222222"), 4))
        c.drawCircle(cxx+look[0]*10, ey+look[1]*8, rr*0.5, paint(col("#0a0a0a")))
        ang = (-24*fear*sx) if fear > 0 else 0
        by = ey - 46 - fear*24
        if double: ang = (22 + 10*fear)*-sx*-1
        c.drawLine(cxx-30, by + (ang*0.3 if sx > 0 else -ang*0.3), cxx+30, by + (-ang*0.3 if sx > 0 else ang*0.3), paint(col("#15151a"), 9))
    if double:
        for sx in (-1, 1):
            c.drawOval(skia.Rect(sx*ex-30, ey+28, sx*ex+30, ey+52), paint(col("#5b5e68", 110)))
        c.drawLine(-70, -120, -20, -40, paint(col("#a31c1c", 235), 9))
        c.drawLine(-60, -125, -34, -90, paint(col("#a31c1c", 235), 4))
        for i in range(9): c.drawCircle(-90+i*22, 60+(i % 3)*18, 5, paint(col("#8f8f95", 130)))
        if tears:
            for sx, y1 in ((-1, 150), (1, 130)):
                c.drawLine(sx*ex, ey+40, sx*ex-sx*4, ey+40+ (y1-60)*0.6, paint(col("#bfd3ff", 190), 5))
    my = 78
    if mouth > 0.1:
        c.drawOval(skia.Rect(-26, my-8, 26, my-8+44*mouth), paint(col("#1b0a0c")))
    else:
        pth = skia.Path(); pth.moveTo(-34, my); pth.quadTo(0, my - (6 if double else -10 + fear*-6), 34, my)
        c.drawPath(pth, paint(col("#15151a"), 8))
    c.restore()

# ---------------------------------------------------------------- Chambre
CLOCK_POS = (540, 330, 760, 440)
TV_RECT = (730, 560, 1040, 790)

def draw_tv_screen(c, T, on, news_t):
    x0, y0, x1, y1 = TV_RECT
    c.drawRoundRect(skia.Rect(x0-8, y0-8, x1+8, y1+8), 12, 12, paint(col("#05060a")))
    if on <= 0:
        rect(c, x0, y0, x1, y1, col("#0b0f16"));
        glow(c, 850, 640, 160, col("#5b6b85"), 0.07)
        return
    c.save(); c.clipRect(skia.Rect(x0, y0, x1, y1))
    vgrad(c, x0, y0, x1, y1, col("#143a6b"), col("#0b1f3d"))
    # présentatrice (stick figure de face)
    cx = (x0+x1)/2 - 40
    c.drawCircle(cx, y0+75, 24, paint(SKIN)); c.drawLine(cx-10, y0+80, cx+10, y0+80, paint(col("#222"), 2))
    sh = skia.Path(); sh.moveTo(cx-60, y0+170); sh.quadTo(cx-50, y0+104, cx, y0+102); sh.quadTo(cx+50, y0+104, cx+60, y0+170); sh.close()
    c.drawPath(sh, paint(col("#1a1c22")))
    # incrustation incident : bus + gyrophares
    bx = x1-96
    rect(c, bx-50, y0+70, bx+50, y0+130, col("#e9eef6"), 1, 6)
    rect(c, bx-44, y0+78, bx+44, y0+104, col("#20242c"), 1, 3)
    c.drawCircle(bx-28, y0+132, 9, paint(col("#101010"))); c.drawCircle(bx+28, y0+132, 9, paint(col("#101010")))
    fl = int(T*6) % 2
    glow(c, bx-30, y0+66, 60, col("#ff2a2a") if fl else col("#2a6bff"), 0.9)
    glow(c, bx+30, y0+66, 60, col("#2a6bff") if fl else col("#ff2a2a"), 0.9)
    # bandeau
    rect(c, x0, y1-82, x1, y1-42, col("#d01818")); text(c, "FLASH SPÉCIAL", x0+14, y1-52, 26, col("#ffffff"), "ExtraBold")
    rect(c, x0, y1-42, x1, y1, col("#f1f3f7"))
    ttxt = "   ACCIDENT GRAVE · BUS DE 23H17 · LIGNE 17 · SECOURS SUR PLACE · BILAN LOURD   "
    off = (T*120) % (twidth(ttxt, 24, "Bold"))
    text(c, ttxt+ttxt, x0-off, y1-12, 24, col("#111318"), "Bold")
    c.restore()
    # scanlines + lueur
    for yy in range(int(y0), int(y1), 6): c.drawLine(x0, yy, x1, yy, paint(col("#000000", 40), 1))
    glow(c, 885, 675, 520, col("#3f86ff"), 0.22*on)

def draw_room(c, T, lamp=1.0, ambient=0.15, tv=0.0, clock="21:41", clock_col=None, win_cold=1.0, red=0.0, hide_clock_glow=False, show_clock=True):
    # murs
    vgrad(c, 0, 0, W, FLOOR, col("#181d27"), col("#11151c"))
    # plafond
    rect(c, 0, 0, W, 120, col("#0e1117"))
    # cadres
    for (x, y, w, h, tone) in ((470, 230, 120, 160, "#222a38"), (620, 250, 100, 110, "#1f2633")):
        rect(c, x, y, x+w, y+h, col("#05070a"), 1, 4); rect(c, x+8, y+8, x+w-8, y+h-8, col(tone), 1, 2)
        c.drawLine(x+22, y+h-34, x+w-22, y+h-60, paint(col("#39465e"), 4))
    # fenêtre + ville
    wx0, wy0, wx1, wy1 = 90, 260, 450, 780
    rect(c, wx0-14, wy0-14, wx1+14, wy1+14, col("#0a0c10"), 1, 6)
    vgrad(c, wx0, wy0, wx1, wy1, col("#0d2147"), col("#2a4a85"))
    rnd = random.Random(3)
    for i in range(34):
        c.drawCircle(wx0+rnd.random()*360, wy0+rnd.random()*250, rnd.random()*1.8+0.6, paint(col("#cfe0ff", 170)))
    c.drawCircle(370, 360, 34, paint(col("#e8eefc"))); c.drawCircle(382, 352, 30, paint(col("#0f2650")))
    bx = wx0
    rnd = random.Random(9)
    while bx < wx1:
        bw = rnd.randint(40, 80); bh = rnd.randint(120, 300)
        rect(c, bx, wy1-bh, min(bx+bw, wx1), wy1, col("#06080e"))
        for yy in range(int(wy1-bh+14), int(wy1-10), 30):
            for xx in range(int(bx+8), int(min(bx+bw, wx1)-12), 20):
                if rnd.random() < 0.38: rect(c, xx, yy, xx+8, yy+12, col("#ffd27a"), 0.9)
        bx += bw+4
    c.drawLine((wx0+wx1)/2, wy0, (wx0+wx1)/2, wy1, paint(col("#0a0c10"), 12)); c.drawLine(wx0, (wy0+wy1)/2-40, wx1, (wy0+wy1)/2-40, paint(col("#0a0c10"), 12))
    glow(c, 270, 600, 420, col("#4b78d8"), 0.10*win_cold)
    # horloge murale numérique
    x0, y0, x1, y1 = CLOCK_POS
    if show_clock:
        rect(c, x0, y0, x1, y1, col("#07090d"), 1, 14)
        text(c, clock, (x0+x1)/2, y1-26, 80, clock_col or col("#ff3b3b"), "Bold", "c")
        glow(c, (x0+x1)/2, (y0+y1)/2, 230, clock_col or col("#ff3b3b"), 0.12 + 0.2*red)
    # TV
    draw_tv_screen(c, T, tv, T)
    # bureau + chaise + ordinateur
    rect(c, 700, 1000, 1070, 1030, col("#1b1f27"), 1, 4); rect(c, 720, 1030, 740, FLOOR, col("#12151b")); rect(c, 1030, 1030, 1050, FLOOR, col("#12151b"))
    rect(c, 790, 950, 940, 1000, col("#0d0f14"), 1, 6); rect(c, 800, 958, 930, 994, col("#1b2230"), 1, 3)
    # table de chevet + lampe
    rect(c, 590, 1010, 690, FLOOR, col("#1a1e26"), 1, 6); rect(c, 598, 1060, 682, 1066, col("#0e1015"))
    c.drawLine(640, 1010, 640, 900, paint(col("#2a2f3a"), 10))
    sh = skia.Path(); sh.moveTo(600, 905); sh.lineTo(680, 905); sh.lineTo(662, 840); sh.lineTo(618, 840); sh.close()
    c.drawPath(sh, paint(col("#e8d9bf") if lamp > 0.3 else col("#2b2e36")))
    # sol
    vgrad(c, 0, FLOOR, W, H, col("#0f1217"), col("#07080b"))
    for i in range(1, 12):
        yy = FLOOR + (i**1.6)*8
        c.drawLine(0, yy, W, yy, paint(col("#000000", 70), 2))
    rect(c, 0, FLOOR-18, W, FLOOR, col("#0b0d12"))
    # lit
    rect(c, 30, 880, 70, FLOOR, col("#12151b"), 1, 6)                  # tête de lit
    rect(c, 40, 1060, 560, 1100, col("#202734"), 1, 14)                # matelas
    rect(c, 36, 1085, 566, FLOOR, col("#15181f"), 1, 6)               # sommier
    rect(c, 70, 1020, 190, 1068, col("#2a3242"), 1, 22)                # oreiller
    rect(c, 190, 1052, 560, 1070, col("#2d3648"), 1, 10)               # couette
    # lumières
    if lamp > 0:
        glow(c, 640, 880, 520, WARM, 0.55*lamp); glow(c, 640, 880, 180, col("#fff0cf"), 0.35*lamp)
        glow(c, 640, FLOOR, 360, WARM, 0.22*lamp, sy=0.28)
    if tv > 0: glow(c, 880, 900, 700, col("#3a7bff"), 0.14*tv)
    if ambient > 0:
        c.drawRect(skia.Rect(0, 0, W, H), paint(col("#02040a"), a=ambient))

# ---------------------------------------------------------------- Rue
def draw_street(c, T, t0):
    lt = T - t0
    vgrad(c, 0, 0, W, 1000, col("#080d1c"), col("#1b2c55"))
    rnd = random.Random(5)
    for i in range(50): c.drawCircle(rnd.random()*W, rnd.random()*500, rnd.random()*1.6+.5, paint(col("#dfe9ff", 150)))
    # immeubles
    x = -20; rnd = random.Random(12)
    while x < W+60:
        bw = rnd.randint(110, 200); bh = rnd.randint(380, 760)
        rect(c, x, 1010-bh, x+bw, 1010, col("#070a12"))
        for yy in range(int(1010-bh+30), 980, 46):
            for xx in range(int(x+14), int(x+bw-26), 34):
                if rnd.random() < 0.33: rect(c, xx, yy, xx+16, yy+24, col("#ffd27a"), 0.85)
        x += bw+6
    # trottoir + route
    rect(c, 0, 1010, W, 1130, col("#161a22")); rect(c, 0, 1130, W, 1920, col("#0b0d12"))
    for i in range(0, W, 140): rect(c, (i - (lt*260) % 140), 1500, (i - (lt*260) % 140)+80, 1514, col("#8e8a72"), 0.5)
    rect(c, 0, 1126, W, 1136, col("#2a2f3a"))
    # lampadaires
    for lx in (230, 900):
        rect(c, lx-6, 560, lx+6, 1130, col("#0d1017")); c.drawLine(lx, 560, lx+90, 540, paint(col("#0d1017"), 10))
        glow(c, lx+90, 556, 380, WARM, 0.55); c.drawCircle(lx+90, 548, 14, paint(col("#fff1d0")))
        glow(c, lx+90, 1130, 300, WARM, 0.25, sy=0.3)
    # abribus
    c.save(); c.translate(-230, 0)
    rect(c, 360, 700, 740, 1120, col("#bcd3ff", 20)); c.drawRoundRect(skia.Rect(350, 690, 750, 1125), 6, 6, paint(col("#6b7f9f"), 6))
    rect(c, 340, 670, 760, 700, col("#10141c")); c.drawLine(380, 1060, 720, 1060, paint(col("#2b3342"), 14))
    rect(c, 640, 740, 726, 880, col("#10141c")); text(c, "17", 683, 810, 56, col("#ffffff"), "ExtraBold", "c"); text(c, "23:17", 683, 860, 30, col("#ff7b4d"), "Bold", "c")
    # passagers (stick figures silhouettes)
    for i, px in enumerate((430, 520)):
        draw_figure(c, px, 940, mk(lean=3, hipL=2, hipR=-2, shL=6, shR=3, elR=40, looky=0), 1, scale=0.85, rimcol=col("#7d8ca8", 120), floor_y=1118)
    c.restore()
    # bus
    bx = lerp(1700, 790, ease_out(prog(lt, 0.2, 1.8)))
    if lt > 1.85: bx -= (lt-1.85)*40   # glisse
    by = 1170
    rect(c, bx-290, by-210, bx+290, by, col("#d7dde8"), 1, 26)
    for k in range(6):
        rect(c, bx-260+k*85, by-180, bx-190+k*85, by-95, col("#1b2330"), 1, 8)
    rect(c, bx-290, by-60, bx+290, by-34, col("#21499c"))
    c.drawCircle(bx-180, by, 44, paint(col("#0a0a0a"))); c.drawCircle(bx+170, by, 44, paint(col("#0a0a0a")))
    rect(c, bx-250, by-232, bx-60, by-212, col("#0c0d10"), 1, 4); text(c, "17  ·  23:17", bx-155, by-216, 22, col("#ff9a4d"), "Bold", "c")
    glow(c, bx-290, by-70, 460, col("#fff2c8"), 0.55); glow(c, bx-290, by-70, 130, col("#ffffff"), 0.9)
    return lt

# ---------------------------------------------------------------- Couloir
DOOR_X = 1980
def draw_hall(c, T, flick=0.0, red=0.0, door_open=0.0, knock=0.0, handle=0.0):
    WW = 2400
    vgrad(c, 0, 0, WW, FLOOR, col("#1a1c20"), col("#121317"))
    rect(c, 0, 0, WW, 150, col("#0d0e11"))
    # moulures + papier peint
    for x in range(0, WW, 90): c.drawLine(x, 200, x, FLOOR-30, paint(col("#ffffff", 5), 3))
    rect(c, 0, FLOOR-34, WW, FLOOR, col("#0a0b0d"))
    vgrad(c, 0, FLOOR, WW, H, col("#0e0f13"), col("#060608"))
    # tableau, étagère à chaussures, patère
    rect(c, 360, 420, 520, 600, col("#050607"), 1, 4); rect(c, 370, 430, 510, 590, col("#242a34"), 1, 2)
    rect(c, 700, 950, 940, FLOOR-34, col("#17191e"), 1, 6); rect(c, 700, 1030, 940, 1036, col("#0c0d10"))
    c.drawLine(1180, 560, 1180, 640, paint(col("#323640"), 8));
    coat = skia.Path(); coat.moveTo(1150, 640); coat.lineTo(1210, 640); coat.lineTo(1230, 960); coat.lineTo(1130, 960); coat.close(); c.drawPath(coat, paint(col("#0c0d10")))
    # lampe plafond (scintillement)
    fl = 1.0 if flick <= 0 else (0.55 + 0.45*(1 if (int(T*13) % 4) else 0))
    glow(c, 700, 150, 700, WARM, 0.35*fl); glow(c, 1500, 150, 500, WARM, 0.2*fl)
    for lx in (700, 1500): c.drawOval(skia.Rect(lx-60, 140, lx+60, 170), paint(col("#f0dcb0", int(255*(0.4+0.6*fl)))))
    # porte d'entrée
    dx = DOOR_X + 4*knock*math.sin(T*90)
    dw = 280; dtop = 470
    rect(c, DOOR_X-dw/2-24, dtop-24, DOOR_X+dw/2+24, FLOOR-34, col("#08090b"), 1, 4)       # cadre
    # lumière derrière la porte ouverte
    if door_open > 0:
        rect(c, DOOR_X-dw/2, dtop, DOOR_X+dw/2, FLOOR-34, col("#050913"))
        vgrad(c, DOOR_X-dw/2, dtop, DOOR_X+dw/2, FLOOR-34, col("#0a1530"), col("#162a55"))
        glow(c, DOOR_X, 860, 500, col("#5a8dff"), 0.5*door_open)
    wid = dw*(1-0.82*smooth(door_open))
    pth = skia.Path()
    pth.moveTo(dx-dw/2, dtop); pth.lineTo(dx-dw/2+wid, dtop-40*smooth(door_open)); pth.lineTo(dx-dw/2+wid, FLOOR-34+30*smooth(door_open)); pth.lineTo(dx-dw/2, FLOOR-34); pth.close()
    c.drawPath(pth, paint(col("#2b2216")))
    if door_open < 0.2:
        c.drawRoundRect(skia.Rect(dx-dw/2+30, dtop+40, dx+dw/2-30, dtop+250), 8, 8, paint(col("#241b11")))
        c.drawRoundRect(skia.Rect(dx-dw/2+30, dtop+300, dx+dw/2-30, FLOOR-100), 8, 8, paint(col("#241b11")))
        c.drawCircle(dx, 810, 14, paint(col("#c9a45c"))); c.drawCircle(dx, 810, 6, paint(col("#05070a")))  # judas
        c.drawCircle(dx-dw/2+40, 930, 12+handle*0, paint(col("#c9a45c")))                                  # poignée
        c.drawLine(dx-dw/2+40, 930, dx-dw/2+86, 930 - 18*smooth(handle), paint(col("#c9a45c"), 12))
        # lumière sous la porte + ombres de pieds
        rect(c, DOOR_X-dw/2, FLOOR-62, DOOR_X+dw/2, FLOOR-36, col("#3f6bff", 120+int(60*math.sin(T*3))))
        glow(c, DOOR_X, FLOOR-40, 380, col("#3f6bff"), 0.35, sy=0.25)
        for fx in (-70, 70):
            rect(c, DOOR_X+fx-26, FLOOR-62, DOOR_X+fx+26, FLOOR-36, col("#020306"), 0.95)
    # tapis
    rect(c, DOOR_X-320, FLOOR-14, DOOR_X-60, FLOOR+8, col("#1f2733"), 1, 6)
    if red > 0: c.drawRect(skia.Rect(0, 0, 2400, H), paint(col("#a01010"), a=0.12*red))

# ---------------------------------------------------------------- Mise en scène
def breathe(T, amp=1.0, per=3.4): return amp*math.sin(2*math.pi*T/per)

def fig_pose_room(T):
    """retourne (x, y_bassin, pose, facing, double) pour le personnage dans la chambre"""
    sit_y = 1050; stand_y = FLOOR-172
    base_sit = dict(hipL=90, kneeL=-90, hipR=90, kneeR=-90)
    b = breathe(T)
    if T < 12.2:  # scène 1
        ks = [(0, dict(base_sit, lean=10, head=24, shR=38, elR=72, shL=30, elL=70, fear=0.1)),
              (6.5, dict(base_sit, lean=10, head=24, shR=38, elR=72, shL=30, elL=70, fear=0.15)),
              (8.2, dict(base_sit, lean=7, head=6, shR=38, elR=72, shL=30, elL=70, fear=0.35, lookx=0.8)),
              (10.5, dict(base_sit, lean=6, head=4, shR=38, elR=72, shL=30, elL=70, fear=0.4, blink=0)),
              (12.2, dict(base_sit, lean=6, head=4, shR=38, elR=72, shL=30, elL=70, fear=0.4))]
        p = anim(T, ks); p["lean"] += 0.8*b; p["head"] += 0.5*b
        if 8.9 < T < 9.1: p["blink"] = 1
        return 440, sit_y, p, 1, False
    if T < 25.0:   # scène 2 (plans larges 20.6+)
        ks = [(12.2, dict(base_sit, lean=8, head=18, shR=38, elR=72, shL=30, elL=70, fear=0.3)),
              (20.4, dict(base_sit, lean=8, head=18, shR=38, elR=72, shL=30, elL=70, fear=0.3)),
              (21.0, dict(base_sit, lean=2, head=4, shR=30, elR=60, shL=24, elL=60, smile=1.0, fear=0)),
              (21.6, dict(base_sit, lean=2, head=-10, shR=30, elR=60, shL=24, elL=60, smile=1.0)),
              (22.2, dict(base_sit, lean=2, head=12, shR=30, elR=60, shL=24, elL=60, smile=1.0)),
              (22.9, dict(base_sit, lean=-4, head=0, shR=-20, elR=20, shL=-30, elL=10, smile=0.6)),
              (25.0, dict(base_sit, lean=-4, head=0, shR=-20, elR=20, shL=-30, elL=10, smile=0.3))]
        p = anim(T, ks); p["lean"] += 0.7*b
        return 440, sit_y, p, 1, False
    if T < 30.0:   # scène 3 : il pose le téléphone et reste
        ks = [(25.0, dict(base_sit, lean=-4, head=0, shR=-20, elR=20, shL=-30, elL=10, smile=0.3)),
              (26.2, dict(base_sit, lean=-12, head=-4, shR=-45, elR=6, shL=-48, elL=6, smile=0.4)),
              (28.5, dict(base_sit, lean=-12, head=-4, shR=-45, elR=6, shL=-48, elL=6, smile=0.3)),
              (30.0, dict(base_sit, lean=-12, head=6, shR=-45, elR=6, shL=-48, elL=6, smile=0.0, lookx=1))]
        p = anim(T, ks); p["lean"] += 0.7*b
        return 440, sit_y, p, 1, False
    if T < 36.0:   # TV : il se lève et recule
        ks = [(31.2, dict(base_sit, lean=-12, head=6, shR=-45, elR=6, shL=-48, elL=6, fear=0.2)),
              (33.0, dict(base_sit, lean=-4, head=6, shR=-10, elR=10, shL=-10, elL=10, fear=0.45)),
              (33.9, dict(lean=14, head=4, hipL=28, kneeL=-32, hipR=30, kneeR=-34, shR=20, elR=30, shL=10, elL=30, fear=0.6)),
              (34.7, dict(lean=4, head=-2, hipL=8, kneeL=-6, hipR=6, kneeR=-4, shR=80, elR=108, shL=60, elL=100, fear=1.0, mouth=1.0)),
              (35.6, dict(lean=-8, head=-6, hipL=10, kneeL=-8, hipR=-6, kneeR=-4, shR=78, elR=112, shL=60, elL=100, fear=1.0, mouth=1.0))]
        t = T
        p = anim(t, ks)
        x = 440 + 150*smooth(prog(T, 33.4, 34.9)) - 90*smooth(prog(T, 34.9, 35.9))
        y = lerp(sit_y, stand_y, smooth(prog(T, 33.3, 34.0)))
        if T > 31.2 and T < 33.0: p["lean"] += 0
        if T > 34.9: x += 0
        return x, y, p, 1, False
    return 560, stand_y, mk(fear=1, mouth=1), 1, False

def fig_pose_dark(T):
    """S4 : chambre sombre, il est debout, téléphone à la main."""
    stand_y = FLOOR-172
    ks = [(39.0, dict(lean=-3, head=14, shR=48, elR=78, shL=40, elL=78, fear=0.7, hipL=2, hipR=-2)),
          (44.0, dict(lean=-4, head=2, shR=48, elR=78, shL=40, elL=78, fear=0.8, lookx=1)),
          (45.2, dict(lean=-4, head=2, shR=48, elR=78, shL=40, elL=78, fear=0.8, lookx=1)),
          (45.34, dict(lean=-14, head=-6, hipL=-6, hipR=4, kneeL=-22, kneeR=-16, shR=70, elR=70, shL=60, elL=70, fear=1.0, mouth=0.6)),
          (46.2, dict(lean=-8, head=-2, hipL=-4, hipR=3, kneeL=-14, kneeR=-10, shR=58, elR=76, shL=50, elL=70, fear=1.0, mouth=0.3)),
          (48.4, dict(lean=-8, head=-2, hipL=-4, hipR=3, kneeL=-14, kneeR=-10, shR=58, elR=76, shL=50, elL=70, fear=1.0, mouth=0.3)),
          (49.5, dict(lean=-8, head=-2, hipL=-4, hipR=3, kneeL=-14, kneeR=-10, shR=58, elR=76, shL=50, elL=70, fear=1.0, mouth=0.3))]
    p = anim(T, ks); p["lean"] += 1.1*breathe(T, 1, 1.9); p["head"] += 0.6*breathe(T, 1, 1.9)
    jit = 0.0
    return 330, stand_y, p, 1, jit

# ---------- caméra scène par scène (retourne centre, zoom)
def titlecard(c, T):
    c.drawRect(skia.Rect(0, 0, W, H), paint(col("#000000")))
    a = ease_out(prog(T, 72.6, 73.0)) * (1 - smooth(prog(T, 74.0, 74.3)))
    text(c, "LE LENDEMAIN", 540, 880, 76, col("#e6e9f0"), "ExtraBold", "c", a)
    text(c, "23H17", 540, 1010, 150, col("#ff3b3b"), "Black" if False else "ExtraBold", "c", a)

def countdown_overlay(c, T):
    for i, n in enumerate((10, 9, 8)):
        t0 = 42.0 + i
        if t0 <= T < t0+1.0:
            u = T - t0
            sc = 1.5 - 0.5*ease_out(prog(u, 0, 0.22))
            a = 1 - ease_in(prog(u, 0.7, 1.0))
            c.save(); c.translate(540, 560); c.scale(sc, sc)
            text(c, str(n), 0, 90, 360, col("#ff2d2d"), "ExtraBold", "c", a)
            c.restore()
            glow(c, 540, 520, 600, col("#ff2020"), 0.25*a)

def render(c, T):
    """Dessine l'image au temps T (secondes)."""
    c.clear(col("#000000"))
    shake = 0.0; tint = 0.0; vig = 0.78; flash = 0.0; fade = 1.0
    # ============ S1 =====================================================
    if T < 2.4:
        blur_bg(c, T)
        camera_begin(c, 540, 960, 1.0 + 0.03*T/2.4, 0, 0.12 if T < 1.0 else 0.03, T)
        draw_phone(c, T, vib_t=0.0, show_typing=False)
        camera_end(c)
    elif T < 12.0:
        k = (T-2.4)/9.6
        camera_begin(c, lerp(520, 450, k), lerp(900, 930, k), lerp(1.3, 1.65, smooth(k)), 0, 0.0, T)
        draw_room(c, T, lamp=1.0, ambient=0.18)
        x, y, p, f, d = fig_pose_room(T); draw_figure(c, x, y, p, f, d, T=T)
        # lueur du téléphone sur son visage
        glow(c, x+95, y-70, 150, col("#9bb8ff"), 0.45)
        camera_end(c)
    # ============ S2 =====================================================
    elif T < 20.5:
        blur_bg(c, T)
        u = T - 12.0
        cz = 1.0 + 0.04*u/8
        camera_begin(c, 540, 960, cz, 0, 0.02, T)
        def ov(cv, x0, y0, x1, y1):
            # carte de comparaison du numéro
            a = ease_out(prog(T, 13.0, 13.4)) * (1 - smooth(prog(T, 16.6, 17.0)))
            if a > 0:
                cv.save(); cv.saveLayerAlpha(None, int(255*a))
                rect(cv, x0+20, y0+262, x1-20, y0+860, col("#0b0e14"), 1.0, 40)
                cv.drawRoundRect(skia.Rect(x0+20, y0+262, x1-20, y0+860), 40, 40, paint(col("#e03030"), 4))
                text(cv, "EXPÉDITEUR", 540, y0+390, 40, col("#8f9bb0"), "SemiBold", "c")
                text(cv, NUM, 540, y0+455, 54, col("#ffffff"), "ExtraBold", "c")
                text(cv, "=", 540, y0+600, 140, col("#ff3b3b"), "ExtraBold", "c")
                text(cv, "MON NUMÉRO", 540, y0+690, 40, col("#8f9bb0"), "SemiBold", "c")
                text(cv, NUM, 540, y0+755, 54, col("#ffffff"), "ExtraBold", "c")
                cv.restore()
        comp = None
        if 17.0 <= T < 18.8: comp = ("Qui est-ce ?", prog(T, 17.1, 18.6))
        draw_phone(c, T, header=("Moi", NUM + "  ·  Moi"), compose=comp, overlay=ov, vib_t=None)
        thumb(c, T, [(17.0, 18.9)])
        camera_end(c)
    elif T < 23.5:
        k = (T-20.5)/3.0
        camera_begin(c, lerp(470, 500, k), 960, lerp(1.7, 1.4, smooth(k)), 0, 0.0, T)
        draw_room(c, T, lamp=1.0, ambient=0.18)
        x, y, p, f, d = fig_pose_room(T); draw_figure(c, x, y, p, f, d, T=T)
        glow(c, x+95, y-70, 130, col("#9bb8ff"), 0.35)
        camera_end(c)
    # ============ S3 =====================================================
    elif T < 25.0:
        blur_bg(c, T)
        camera_begin(c, 540, 960, 1.04, 0, 0.1 if T < 24.6 else 0.02, T)
        draw_phone(c, T, vib_t=23.8)
        camera_end(c)
    elif T < 28.8:
        camera_begin(c, 480, 960, 1.4 + 0.1*prog(T, 25, 28.8), 0, 0.0, T)
        draw_room(c, T, lamp=1.0, ambient=0.2, clock="22:09")
        x, y, p, f, d = fig_pose_room(T); draw_figure(c, x, y, p, f, d, T=T)
        camera_end(c)
    elif T < 31.2:
        lt = T - 28.8
        sh = 0.0; fl = 0.0
        camera_begin(c, 540, 960, 1.0 + 0.05*lt/2.4, 0, 0.0, T)
        draw_street(c, T, 28.8)
        camera_end(c)
        # impact (bus déséquilibré) → flash + sirènes
        if T >= 30.35:
            u = T - 30.35
            flash = max(0, 1 - u/0.35)
            c.drawRect(skia.Rect(0, 0, W, H), paint(col("#ffffff"), a=0.9*flash))
            sir = int(T*10) % 2
            glow(c, 300, 900, 700, col("#ff2020") if sir else col("#2060ff"), 0.45)
            glow(c, 800, 900, 700, col("#2060ff") if sir else col("#ff2020"), 0.45)
            shake = 0.0
        tint = 0.3 if T > 30.35 else 0.0
    elif T < 36.0:
        tvk = prog(T, 31.2, 31.5)
        if T < 33.5:   # gros plan sur la TV
            k = prog(T, 31.2, 33.5)
            camera_begin(c, 885, 675, lerp(2.6, 2.4, k), 0, 0.01, T)
        else:          # recul : on voit sa réaction
            k = smooth(prog(T, 33.5, 34.6))
            camera_begin(c, lerp(885, 600, k), lerp(675, 930, k), lerp(2.4, 1.25, k), 0, 0.0 + 0.35*prog(T, 34.6, 36), T)
        draw_room(c, T, lamp=0.0, ambient=0.45, tv=1.0, clock="22:31", show_clock=(T >= 34.5))
        if T >= 33.0:
            x, y, p, f, d = fig_pose_room(T); draw_figure(c, x, y, p, f, d, T=T, rimcol=col("#7fb0ff", 190))
        camera_end(c)
        tint = 0.1
    elif T < 39.0:
        # gros plan visage de face, tremblements
        vgrad(c, 0, 0, W, H, col("#080b12"), col("#05060a"))
        glow(c, 540, 700, 800, col("#3a7bff"), 0.18)
        u = T - 36.0
        camera_begin(c, 540, 900, 1.0 + 0.06*u/3, 0, 0.35 + 0.2*u/3, T)
        front_head(c, 540, 640, 1.55, T, False, fear=1.0, mouth=0.9 if (T % 1.6) < 0.8 else 0.2,
                   tilt=2*math.sin(T*2), look=(0.8*math.sin(T*3), 0.3), breath=math.sin(T*7))
        camera_end(c)
        tint = 0.25*u/3
    # ============ S4 =====================================================
    elif T < 40.6:
        blur_bg(c, T, warm=False)
        camera_begin(c, 540, 960, 1.04, 0, 0.12 if T < 39.9 else 0.03, T)
        draw_phone(c, T, vib_t=39.2)
        camera_end(c)
        tint = 0.3
    elif T < 48.2:
        k = prog(T, 40.6, 48.2)
        z = lerp(1.25, 1.85, smooth(k))
        zk = 0.0
        for kt in (45.2, 45.9, 46.6):
            zk += 0.05*max(0, 1-(T-kt)/0.25) if T >= kt else 0.0
        shake = 0.0
        for kt in (45.2, 45.9, 46.6):
            if kt <= T < kt+0.4: shake = max(shake, 1.0*(1-(T-kt)/0.4))
        camera_begin(c, lerp(430, 340, smooth(k)), lerp(900, 985, smooth(k)), z+zk, 0, shake, T)
        draw_room(c, T, lamp=0.0, ambient=0.78, clock="23:16", clock_col=col("#ff2a2a"), red=0.5 + 0.3*prog(T, 42, 45))
        x, y, p, f, d = fig_pose_dark(T)
        draw_figure(c, x, y, p, f, d, T=T, rimcol=col("#9bb8ff", 170))
        glow(c, x+110, y-165, 260, col("#aac4ff"), 0.50)        # éclairage provenant du téléphone
        glow(c, x+110, y-165, 560, col("#4a76d8"), 0.14)
        camera_end(c)
        countdown_overlay(c, T)
        # battement de cœur : pulsation rouge
        hb = max(0, math.sin(T*2*math.pi*1.4*(1+0.4*prog(T, 40.6, 46))))**8
        tint = 0.35 + 0.25*hb
    elif T < 51.0:
        u = T - 48.2
        camera_begin(c, lerp(1960, 1985, u/2.8), 960, lerp(1.45, 1.75, smooth(u/2.8)), 0, 0.02 + (0.2 if T > 50.2 else 0), T)
        draw_hall(c, T, flick=1, red=0.7)
        camera_end(c)
        tint = 0.45
    # ============ S5 =====================================================
    elif T < 55.4:
        k = prog(T, 51.0, 55.4)
        fx = lerp(420, 1640, smooth(k*0.97+0.015))
        camera_begin(c, fx+130, 1000, lerp(1.7, 1.9, k), 0, 0.0, T)
        draw_hall(c, T, flick=1, red=0.5+0.4*k)
        ph = (T-51.0)*5.6
        wp = walk(ph, amp=0.8, tired=0.3)
        pose = mk(lean=6, head=12, fear=0.5, lookx=1, **{k2: v for k2, v in wp.items()})
        pose["shR"] = 8; pose["elR"] = 20
        draw_figure(c, fx, FLOOR-172+wp["by"]*0, pose, 1, False, T=T, rimcol=col("#e07a7a", 150))
        camera_end(c)
        tint = 0.45 + 0.1*k
    elif T < 60.4:
        # JUDAS
        c.drawRect(skia.Rect(0, 0, W, H), paint(col("#020204")))
        u = T - 55.4
        cx, cy, R = 540, 800, 430
        c.save(); c.translate(cx + 2*math.sin(T*8)*0, cy)
        zoom = 1.0 + 0.06*u/5
        clip = skia.Path(); clip.addCircle(0, 0, R); c.clipPath(clip, doAntiAlias=True)
        # couloir extérieur en perspective déformée
        vgrad(c, -R, -R, R, R, col("#0a1224"), col("#05080f"))
        for i in range(8):
            r = R*(0.14*(i+1))
            c.drawCircle(0, 40, r, paint(col("#1a2a4d", 90), 3))
        c.drawLine(-R, -R*0.5, -R*0.2, -R*0.14, paint(col("#223463"), 3)); c.drawLine(R, -R*0.5, R*0.2, -R*0.14, paint(col("#223463"), 3))
        c.drawLine(-R, R*0.7, -R*0.2, R*0.25, paint(col("#223463"), 3)); c.drawLine(R, R*0.7, R*0.2, R*0.25, paint(col("#223463"), 3))
        fl = 0.3 + 0.7*(1 if (int(T*11) % 5) else 0.2)
        glow(c, 0, -R*0.9, R*0.9, col("#6a8dff"), 0.5*fl)
        glow(c, 0, 20, 420, col("#a01818"), 0.28)
        c.save(); c.scale(zoom, zoom)
        front_head(c, 0, 20, 1.18, T, True, fear=0.55 + 0.1*math.sin(T*2), mouth=(0.85 if 57.0 < T < 59.6 and int(T*5) % 2 else 0.25),
                   tilt=6*math.sin(T*1.3) + 5, look=(0.4, 0.5), breath=math.sin(T*2*math.pi/1.5)*1.6)
        # main appuyée contre la porte
        c.drawCircle(300, 300, 46, paint(SKIN)); c.drawLine(300, 300, 420, 520, paint(HOOD, 60))
        c.restore()
        c.restore()
        # reflets & anneau en laiton
        c.save(); c.translate(cx, cy)
        sh = skia.GradientShader.MakeRadial((0, 0), R, [skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, 235)], [0.6, 1.0])
        c.drawCircle(0, 0, R, skia.Paint(Shader=sh))
        c.drawCircle(0, 0, R+10, paint(col("#c9a45c"), 22)); c.drawCircle(0, 0, R+28, paint(col("#5a4524"), 10))
        c.drawArc(skia.Rect(-R+30, -R+30, R-30, R-30), 200, 50, False, paint(col("#ffffff", 70), 14))
        c.restore()
        shake = 0.05 + (0.15 if 59.6 > T > 57 else 0)
        # léger tremblement
        tint = 0.5
    elif T < 62.6:
        blur_bg(c, T, warm=False)
        camera_begin(c, 540, 960, 1.0 + 0.05*prog(T, 60.4, 62.6), 0, 0.18 if T < 61.2 else 0.08, T)
        draw_phone(c, T, vib_t=60.6)
        camera_end(c)
        tint = 0.6
    elif T < 66.0:
        u = T - 62.6
        camera_begin(c, 1820, 960, lerp(1.45, 1.8, smooth(u/3.4)), 0, 0.2 + 0.3*u/3.4, T)
        reach = smooth(prog(T, 63.3, 65.4))
        draw_hall(c, T, flick=1, red=0.9, handle=0)
        pose = anim(T, [(62.6, dict(lean=8, head=6, fear=0.9, lookx=1, shR=40, elR=70, shL=30, elL=60, hipL=6, hipR=-4, kneeL=-8, kneeR=-6)),
                        (65.4, dict(lean=14, head=8, fear=1.0, mouth=0.4, lookx=1, shR=78, elR=14 + 4*math.sin(T*50), shL=20, elL=40, hipL=10, hipR=-6, kneeL=-10, kneeR=-6))])
        pose["elR"] += 5*math.sin(T*45)*reach
        draw_figure(c, 1640, FLOOR-172, pose, 1, False, T=T, rimcol=col("#e07a7a", 170))
        camera_end(c)
        tint = 0.7
    # ============ S6 =====================================================
    elif T < 71.2:
        u = T - 66.0
        o = smooth(prog(T, 70.3, 71.1))
        step = anim(T, [(66.0, dict(lean=14, head=8, fear=1.0, lookx=1, shR=78, elR=14, shL=20, elL=40, hipL=10, hipR=-6, kneeL=-10, kneeR=-6)),
                        (67.0, dict(lean=-8, head=-4, fear=1.0, mouth=0.5, lookx=1, shR=30, elR=60, shL=24, elL=50, hipL=-20, hipR=16, kneeL=-30, kneeR=-10)),
                        (68.4, dict(lean=-10, head=-4, fear=0.9, lookx=1, shR=30, elR=60, shL=24, elL=50, hipL=-4, hipR=4, kneeL=-8, kneeR=-8)),
                        (69.6, dict(lean=4, head=6, fear=0.7, lookx=1, shR=40, elR=60, shL=24, elL=50, hipL=10, hipR=-8, kneeL=-14, kneeR=-8)),
                        (70.3, dict(lean=14, head=8, fear=0.7, lookx=1, shR=80, elR=10, shL=24, elL=50, hipL=10, hipR=-6, kneeL=-10, kneeR=-6))])
        bx = -70*smooth(prog(T, 66.4, 67.1)) + 70*smooth(prog(T, 68.6, 69.8))
        camera_begin(c, 1810, 960, lerp(1.6, 1.5, smooth(prog(T, 66, 68))) + 0.25*o, 0, 0.12*(1-o), T)
        draw_hall(c, T, flick=1, red=0.8, door_open=o, handle=prog(T, 70.0, 70.4))
        draw_figure(c, 1640 + bx*1.0, FLOOR-172, step, 1, False, T=T, rimcol=col("#e07a7a", 170))
        glow(c, DOOR_X, 880, 650, col("#7aa6ff"), 0.9*o)
        camera_end(c)
        tint = 0.6*(1-o)
        flash = 0.0
        if T > 70.9: c.drawRect(skia.Rect(0, 0, W, H), paint(col("#000000"), a=smooth(prog(T, 70.9, 71.2))))
    elif T < 72.6:
        pass   # noir complet
    elif T < 74.3:
        titlecard(c, T)
    elif T < 76.0:
        k = prog(T, 74.3, 76.0)
        camera_begin(c, 470, 940, 1.5 - 0.04*k, 0, 0.0, T)
        draw_room(c, T, lamp=0.0, ambient=0.55, clock="23:17", clock_col=col("#ff3b3b"), win_cold=1.6)
        draw_future_fig(c, T)
        camera_end(c)
        tint = 0.1
    elif T < 81.8:
        blur_bg(c, T, warm=False)
        camera_begin(c, 540, 960, 1.05 + 0.02*prog(T, 76, 81.8), 0, 0.1 if T < 76.9 else 0.015, T)
        mm = [(0, "in", "", False)]
        comp = None
        if T < 77.0:
            draw_phone(c, T, msgs=[], header=("Moi", NUM + "  ·  Moi"), vib_t=75.6, show_typing=False,
                       lock="23:17" if T < 76.4 else None)
        else:
            sent = T >= 81.0
            msg = "NE SORS PAS DE CHEZ TOI À 23H17. TU VAS MOURIR."
            msgs2 = [(81.0, "out", msg, True)] if sent else []
            comp = None if sent else (msg, prog(T, 77.2, 80.6))
            def ov2(cv, x0, y0, x1, y1):
                a = ease_out(prog(T, 76.9, 77.3))
                text(cv, "À :  MOI   " + NUM, x0+40, y0+130+130, 34, col("#ff5a5a", int(255*a)), "SemiBold")
            draw_phone(c, T, msgs=msgs2, header=("Moi", NUM + "  ·  Moi"), compose=comp, show_typing=False,
                       overlay=ov2 if not sent else None)
            thumb(c, T, [(77.1, 80.9)])
            if sent:
                text(c, "Envoyé ✓", 540, 1262, 34, col("#8fb4ff"), "SemiBold", "c", ease_out(prog(T, 81.1, 81.5)))
        camera_end(c)
        tint = 0.35
    elif T < END_PICTURE:
        k = prog(T, 81.8, END_PICTURE)
        camera_begin(c, lerp(470,540,k), lerp(940, 930, k), lerp(1.5, 1.05, smooth(k)), 0, 0.0, T)
        draw_room(c, T, lamp=0.0, ambient=0.6, clock="23:17", clock_col=col("#ff3b3b"), win_cold=1.7)
        draw_future_fig(c, T, final=True)
        camera_end(c)
        tint = 0.2 + 0.25*k
        # micro-glitch avant la coupure
        if T > 86.4 and int(T*20) % 3 == 0:
            c.save(); c.translate(14*math.sin(T*200), 0); c.drawRect(skia.Rect(0, 700, W, 760), paint(col("#ff2020"), a=0.2)); c.restore()
    else:
        pass
    # ------------ post-traitement
    if T < 72.6 or T >= 74.3:
        if T < 71.2 or T >= 74.3:
            vignette(c, vig, (160, 10, 10), tint)
    if T < END_PICTURE and not (71.2 <= T < 74.3):
        draw_sub_band(c)
        draw_subs(c, T, CHUNKS)
    # fondu d'entrée subtil
    if T < 0.15: c.drawRect(skia.Rect(0, 0, W, H), paint(col("#000000"), a=1-T/0.15))

def draw_sub_band(c):
    sh = skia.GradientShader.MakeLinear([(0, 1260), (0, 1560)], [skia.Color(0, 0, 0, 0), skia.Color(0, 0, 0, 120)])
    c.drawRect(skia.Rect(0, 1260, W, 1560), skia.Paint(Shader=sh))

def draw_future_fig(c, T, final=False):
    """Le personnage du lendemain : même silhouette, mais vêtements déchirés, posture épuisée."""
    b = breathe(T, 1.6, 2.6)
    base = dict(hipL=90, kneeL=-90, hipR=90, kneeR=-90)
    if not final:
        p = mk(**base, lean=22, head=26, shR=34, elR=70, shL=26, elL=66, fear=0.2)
    else:
        k = prog(T, 81.8, 84.5)
        p = anim(T, [(81.8, dict(base, lean=22, head=26, shR=34, elR=70, shL=26, elL=66, fear=0.2)),
                     (83.2, dict(base, lean=18, head=8, shR=10, elR=24, shL=10, elL=20, fear=0.55, lookx=0.6)),
                     (87.5, dict(base, lean=16, head=4, shR=6, elR=20, shL=8, elL=18, fear=0.7, lookx=0.8))])
    p["lean"] += 1.6*b; p["head"] += 1.0*b; p["bx"] += 0.8*math.sin(T*30)*0.5
    draw_figure(c, 440, 1050, p, 1, True, T=T, rimcol=col("#9bb8ff", 170))
    glow(c, 535, 985, 160, col("#9bb8ff"), 0.4 if not final or T < 83 else 0.12)
