"""Importe les voix ElevenLabs (mp3/wav) et reconstruit le film.
Usage : python3 src/import_voice.py DOSSIER_AUDIO
Fichiers attendus dans DOSSIER_AUDIO : n1 n2 n3 n4 n5 tv n6 n7 d1 n8 d2 n9 n10  (.mp3 .wav .m4a ou .ogg)
Ensuite : python3 src/audio.py && python3 src/render.py && ./src/assemble.sh"""
import sys, os, json, subprocess, glob, wave
INFO = json.load(open("build/voice/info.json"))
# durée max autorisée par réplique (secondes) avant le plan suivant
SLOT = dict(n1=6.5, n2=5.2, n3=6.0, n4=3.4, n5=4.8, tv=5.9, n6=2.9, n7=4.9, d1=2.5, n8=5.4, d2=3.3, n9=4.1, n10=7.9)
src = sys.argv[1]; os.makedirs("build/voice", exist_ok=True)
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
FX = {"narr": "highpass=f=60,acompressor=threshold=-20dB:ratio=2.5,loudnorm=I=-16:TP=-1.5",
      "tv": "highpass=f=300,lowpass=f=4200,acompressor=threshold=-18dB:ratio=3,loudnorm=I=-18:TP=-1.5",
      "double": "highpass=f=70,aecho=0.8:0.5:70:0.18,loudnorm=I=-17:TP=-1.5"}
for k, v in INFO.items():
    cand = [p for p in glob.glob(os.path.join(src, k + ".*")) if p.lower().endswith((".mp3", ".wav", ".m4a", ".ogg", ".flac"))]
    if not cand: print("MANQUANT :", k); continue
    tmp = f"build/voice/{k}_tmp.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", cand[0], "-ar", "44100", "-ac", "1", "-af", TRIM + "," + FX[v["style"]], tmp], check=True)
    w = wave.open(tmp); d = w.getnframes()/w.getframerate(); w.close()
    tempo = 1.0
    if d > SLOT[k]: tempo = min(1.22, d/SLOT[k])
    af = f"atempo={tempo:.4f}," if tempo > 1.001 else ""
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", af + "adelay=60,apad=pad_dur=0.4", f"build/voice/{k}.wav"], check=True)
    w = wave.open(f"build/voice/{k}.wav"); nd = w.getnframes()/w.getframerate() - 0.4; w.close()
    v["dur"] = round(nd, 3)
    flag = "  (!) dépasse encore le créneau : raccourcissez la phrase" if nd > SLOT[k] + 0.05 else ""
    print(f"{k:4s} {d:5.2f}s -> {nd:5.2f}s (créneau {SLOT[k]}s){' accéléré x%.2f' % tempo if tempo > 1.001 else ''}{flag}")
json.dump(INFO, open("build/voice/info.json", "w"), ensure_ascii=False, indent=1)
subprocess.run([sys.executable, "src/align.py"], check=True)
print("OK. Lancez : python3 src/audio.py && python3 src/render.py && bash src/assemble.sh")
