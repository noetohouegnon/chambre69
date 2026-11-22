"""Sound design synthétisé + mixage avec ducking de la voix off."""
import numpy as np, json, wave
from scipy import signal
sr = 44100
DUR = 88.6
N = int(DUR*sr)
rng = np.random.default_rng(69)
INFO = json.load(open("build/voice/info.json"))
CUE = dict(n1=0.3, n2=7.0, n3=12.4, n4=20.0, n5=25.0, tv=30.2, n6=36.2, n7=40.0, d1=48.4, n8=51.4, d2=57.0, n9=66.2, n10=79.4)
T = np.arange(N)/sr

def noise(n=N): return rng.standard_normal(n)
def lp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, 'low', fs=sr, output='sos'), x)
def hp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, 'high', fs=sr, output='sos'), x)
def bp(x, a, b, o=2): return signal.sosfilt(signal.butter(o, [a, b], 'band', fs=sr, output='sos'), x)
def ramp(*pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return np.interp(T, xs, ys)
def put(buf, x, t0, gain=1.0):
    i = int(t0*sr); j = min(N, i+len(x))
    if i < N and j > i: buf[i:j] += x[:j-i]*gain
def decay(n, tau): return np.exp(-np.arange(n)/sr/tau)
def tone(f, d, tau, harm=(1,), amps=None):
    n = int(d*sr); t = np.arange(n)/sr; y = np.zeros(n)
    for k, h in enumerate(harm): y += (amps[k] if amps else 1/(k+1))*np.sin(2*np.pi*f*h*t)
    return y*decay(n, tau)

L = np.zeros(N); R = np.zeros(N)           # bus musique/ambiance (ducké)
SF = np.zeros(N)                           # sfx (mono, non ducké fortement)
V = np.zeros(N)                            # voix

# ---------------- VOIX
for k, t0 in CUE.items():
    w = wave.open(f"build/voice/{k}.wav"); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)/32768
    put(V, x, t0, 1.0)
V = V/ max(1e-6, np.abs(V).max()) * 0.9
venv = lp(np.abs(V), 6)
venv = np.clip(venv*6, 0, 1)
duck = 1 - 0.55*venv

# ---------------- AMBIANCES
room = lp(noise(), 400)*0.05 + 0.012*np.sin(2*np.pi*50*T)                 # souffle + hum
vent = bp(noise(), 250, 900)*0.05*(0.7+0.3*np.sin(2*np.pi*T/7))             # ventilation légère
amb = (room + vent)
amb *= ramp((0, 1), (28.4, 1), (29, 0.15), (31.6, 0.15), (32.2, 1), (46.7, 1), (47.2, 0.0), (48.4, 0.0), (48.7, 0.6), (70.8, 0.6), (71.0, 0), (74.2, 0), (74.8, 1), (87.5, 1), (87.55, 0))
a2 = amb*1.0
L += a2; R += np.roll(a2, 300)

# rue : circulation + passages de voitures
street = lp(noise(), 1200)*0.12 + bp(noise(), 90, 400)*0.08
env_s = ramp((28.7, 0), (29.0, 1), (30.35, 1.3), (30.5, 0), (31.0, 0))
for tc in (29.1, 29.7):
    pas = np.exp(-((T-tc)/0.45)**2)
    street += bp(noise(), 300, 1500)*0.22*pas
SF += street*env_s
# bus qui approche : moteur grave croissant, puis impact
eng = (np.sin(2*np.pi*(48+14*np.clip((T-28.8)/1.6, 0, 1))*T) + 0.5*np.sin(2*np.pi*96*T) + 0.4*lp(noise(), 160)*3)
SF += eng*0.12*ramp((28.8, 0), (29.2, 0.5), (30.3, 1), (30.4, 0))
# crash
n_ = int(1.6*sr)
crash = (lp(noise(n_), 3000)*decay(n_, 0.22)*1.0 + hp(noise(n_), 4000)*decay(n_, 0.15)*0.6 + tone(48, 1.6, 0.5, (1, 2))*1.2)
put(SF, crash, 30.35, 1.0)
# sirènes lointaines
sir = np.sin(2*np.pi*(780 + 220*np.sin(2*np.pi*0.9*T))*T)*0.03*ramp((30.5, 0), (31.0, 1), (31.6, 0))
SF += sir

# TV : jingle + souffle
sting = np.concatenate([tone(660, 0.12, 0.2, (1, 2)), tone(880, 0.12, 0.2, (1, 2)), tone(1320, 0.5, 0.3, (1, 2, 3))])
put(SF, sting, 31.2, 0.25)
tvhiss = hp(noise(), 3000)*0.012 + 0.006*np.sin(2*np.pi*15734*T)
SF += tvhiss*ramp((31.1, 0), (31.2, 1), (35.9, 1), (36.0, 0))

# ---------------- TÉLÉPHONE
def buzz(t0, d=0.9):
    n = int(d*sr); t = np.arange(n)/sr
    pulse = (np.sin(2*np.pi*3.6*t) > -0.2).astype(float)   # 3 rafales
    y = (np.sin(2*np.pi*165*t) + 0.5*np.sin(2*np.pi*330*t) + 0.2*np.sign(np.sin(2*np.pi*165*t)))*pulse
    y += 0.3*lp(noise(n), 600)
    y *= np.minimum(1, t*80)*np.minimum(1, (d-t)*40)
    put(SF, y*0.35, t0)
def ping(t0, f=1046.5, g=0.22):
    put(SF, tone(f, 1.2, 0.25, (1, 2.76, 5.4), (1, 0.3, 0.1)), t0, g)
    put(SF, tone(f*1.5, 1.2, 0.2, (1, 2.76), (1, 0.2)), t0+0.11, g*0.7)
def whoosh(t0, d=0.35, g=0.12):
    n = int(d*sr); t = np.arange(n)/sr
    y = bp(noise(n), 800, 4500)*np.sin(np.pi*t/d)
    put(SF, y, t0, g)
def tap(t0, g=0.12):
    n = int(0.05*sr); put(SF, (bp(noise(n), 1200, 5000)*decay(n, 0.008)), t0, g)
buzz(0.0, 0.9); buzz(23.8); buzz(39.2); buzz(60.6); buzz(75.6, 1.1)
ping(0.3); ping(20.0); ping(23.8, 987.8); ping(39.3, 880); ping(60.7, 783.99, 0.28)
whoosh(18.8); whoosh(81.0)
for t in np.arange(17.1, 18.6, 0.11): tap(t + rng.uniform(0, 0.03))
for t in np.arange(77.2, 80.6, 0.11): tap(t + rng.uniform(0, 0.03))
ping(72.6, 523.25, 0.3); put(SF, tone(261.6, 3.0, 1.0, (1, 2)), 72.6, 0.15)    # carillon du lendemain
tap(12.6, 0.1); tap(13.0, 0.1)

# ---------------- PAS, PORTE
def step(t0, g=0.3, f=70):
    n = int(0.22*sr)
    y = tone(f, 0.22, 0.05)*1.0 + lp(noise(n), 500)*decay(n, 0.03)*0.8
    put(SF, y, t0, g)
for t in np.arange(51.4, 55.2, 0.52): step(t, 0.28)
for t in (66.5, 66.85, 68.9, 69.45, 69.95): step(t, 0.25)
def knock(t0, g=1.0):
    n = int(0.5*sr)
    y = tone(95, 0.5, 0.07, (1, 2.1, 3.3), (1, 0.5, 0.3))*1.1 + bp(noise(n), 300, 1800)*decay(n, 0.035)*1.2
    y += lp(noise(n), 200)*decay(n, 0.09)*0.6
    put(SF, y, t0, g)
for t in (45.2, 45.9, 46.6): knock(t, 0.9)
# craquement de porte + poignée
n = int(0.9*sr); tt = np.arange(n)/sr
creak = bp(noise(n), 400, 1400)*0.15*np.abs(np.sin(2*np.pi*(14+10*tt)*tt))*np.sin(np.pi*tt/0.9)
put(SF, creak, 70.5, 1.0)
put(SF, bp(noise(2000), 2000, 6000)*decay(2000, 0.01)*0.5, 70.35, 0.6)
put(SF, bp(noise(2000), 2000, 6000)*decay(2000, 0.01)*0.4, 70.42, 0.6)

# ---------------- CŒUR
def heart(t0, g):
    put(SF, tone(55, 0.25, 0.06)*1.0, t0, g); put(SF, tone(48, 0.25, 0.07)*0.8, t0+0.2, g*0.8)
t = 40.6; bpm = 62
while t < 46.9:
    heart(t, 0.45); t += 60/bpm; bpm = min(100, bpm+2.4)
t = 49.0
while t < 70.6:
    heart(t, 0.55); t += 60/ min(130, 85 + (t-49)*2.2)
for t in np.arange(0.0, 0.0): pass

# ---------------- MUSIQUE
def pad(freqs, gain_env, detune=0.003, harm=(1, 2, 3)):
    y = np.zeros(N)
    for f in freqs:
        for d in (-detune, 0, detune):
            for h in harm:
                y += np.sin(2*np.pi*f*(1+d)*h*T + rng.uniform(0, 6.28))/h/len(harm)
    return y*gain_env
# 0 → 40 : nappe sombre (la mineur) + cloches rares
m1 = pad([55, 82.41, 110, 130.81], ramp((0, 0.0), (1.5, 0.5), (12, 0.6), (39, 0.9), (40, 1.0), (46.7, 1.2), (47.0, 0), (48.4, 0), (49, 0.9), (70.8, 1.6), (70.95, 0)), 0.004)*0.05
m1 = lp(m1, 1400)
L += m1; R += np.roll(m1, 200)
bells = [(2.0, 440), (5.2, 329.6), (9.0, 392), (13.5, 329.6), (17.5, 261.6), (22, 392), (26, 329.6), (33, 220), (37.5, 233)]
for tb, f in bells:
    b = tone(f, 4, 1.2, (1, 2.01, 3.99), (1, 0.4, 0.15))*0.05
    put(L, b, tb); put(R, b, tb+0.02)
# 40 → 47 : suspense progressif (pulsation basse + riser)
pul = np.sin(2*np.pi*(55)*T)*(0.5+0.5*np.sin(2*np.pi*(1.2+0.15*(T-40))*T))
L += pul*0.12*ramp((40, 0), (44, 1), (46.7, 1.3), (46.9, 0)); R += pul*0.12*ramp((40, 0), (44, 1), (46.7, 1.3), (46.9, 0))
ris = bp(noise(), 400, 6000)*ramp((40, 0), (45.1, 0.18), (45.15, 0))
L += ris*0.4; R += ris*0.4
# 49 → 71 : basses profondes + cordes dissonantes anxiogènes
inten = ramp((49, 0.3), (55, 0.6), (60.5, 0.9), (66, 1.1), (70.8, 1.4), (70.95, 0))
bass = (np.sin(2*np.pi*41.2*T) + 0.5*np.sin(2*np.pi*82.4*T))*(0.7+0.3*np.sin(2*np.pi*0.25*T))
L += bass*0.20*inten; R += bass*0.20*inten
dis = np.zeros(N)
for f in (233.1, 246.9, 349.2, 370.0):                        # sib/si, fa/fa# : clusters
    dis += np.sign(np.sin(2*np.pi*f*T))*0.5*np.sin(2*np.pi*f*T)
dis = lp(dis, 1800)*(0.5+0.5*np.sin(2*np.pi*(0.7+0.05*(T-49))*T))
L += dis*0.045*inten; R += np.roll(dis, 500)*0.045*inten
# tic-tac / horloge pendant le décompte
for tt_ in (42.0, 43.0, 44.0):
    put(SF, tone(1800, 0.2, 0.05, (1, 2))*1.0, tt_, 0.18)
# 74 → 87.5 : retour de la musique mystérieuse
m2 = pad([55, 82.41, 130.81, 164.81], ramp((74.0, 0), (76, 0.5), (80, 0.8), (84, 1.0), (87.4, 1.0), (87.5, 0)), 0.004)*0.05
m2 = lp(m2, 1300)
L += m2; R += np.roll(m2, 200)
for tb, f in [(75, 329.6), (77.5, 392), (80, 329.6), (82.5, 261.6), (85, 233), (86.4, 220)]:
    b = tone(f, 3.5, 1.0, (1, 2.01, 3.99), (1, 0.4, 0.15))*0.07
    put(L, b, tb); put(R, b, tb+0.02)
# glitch final
put(SF, bp(noise(int(0.4*sr)), 200, 5000)*0.08, 86.4, 1.0)

# ---------------- COUPURES & MIX
cut = np.ones(N)
cut[int(71.0*sr):int(72.6*sr)] = 0.0           # silence total après l'ouverture
cut[int(87.5*sr):] = 0.0                       # coupure franche
fade = np.ones(N); fade[:int(0.05*sr)] = np.linspace(0, 1, int(0.05*sr))
vol_voice = 1.0
Lm = (L*duck*1.0 + SF*(1-0.3*venv))*cut
Rm = (R*duck*1.0 + SF*(1-0.3*venv))*cut
# le silence avant la voix du double (46.9 → 48.4) est total ; les coups de porte sont conservés avant
gap = np.ones(N); gap[int(46.95*sr):int(48.4*sr)] = 0
Lm *= gap; Rm *= gap
Vm = V*cut
outL = Lm + Vm; outR = Rm + Vm
# léger souffle de salle sur la voix (réverbération courte)
peak = max(np.abs(outL).max(), np.abs(outR).max())
outL = np.tanh(outL*1.1)/np.tanh(1.1*max(peak, 1)); outR = np.tanh(outR*1.1)/np.tanh(1.1*max(peak, 1))
m = max(np.abs(outL).max(), np.abs(outR).max()); g = 0.89/m
st = np.stack([outL*g, outR*g], 1)
pcm = (st*32767).astype('<i2')
w = wave.open("build/mix.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes()); w.close()
print("ok", N/sr, "peak", m)
