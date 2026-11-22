import subprocess, json, wave, os
B='build/voice'; os.makedirs(B,exist_ok=True)
# id, texte, voix mbrola, vitesse, pitch, style
LINES=[
 ("n1","À vingt-trois heures dix-sept, un garçon a reçu un message… qui allait détruire sa vie.","mb-fr1",138,22,"narr"),
 ("n2","Le plus terrifiant ? Il venait de son propre numéro.","mb-fr1",132,18,"narr"),
 ("n3","Il vérifie l'expéditeur. C'est exactement son numéro.","mb-fr1",138,22,"narr"),
 ("n4","Une blague. Forcément une blague.","mb-fr1",135,25,"narr"),
 ("n5","Alors il reste chez lui. Et quelques minutes plus tard…","mb-fr1",138,22,"narr"),
 ("tv","Flash spécial. Un grave accident vient d'impliquer le bus de vingt-trois heures dix-sept.","mb-fr4",150,50,"tv"),
 ("n6","Le message disait vrai.","mb-fr1",118,15,"narr"),
 ("n7","Dix secondes. Dix secondes avant que quelqu'un frappe à sa porte.","mb-fr1",138,20,"narr"),
 ("d1","Ouvre-moi… c'est toi.","mb-fr1",105,8,"double"),
 ("n8","Il s'approche. Il regarde par le judas.","mb-fr1",128,18,"narr"),
 ("d2","Je t'en supplie… ne fais pas la même erreur que moi.","mb-fr1",100,6,"double"),
 ("n9","Il hésite. Il recule. Puis…","mb-fr1",118,16,"narr"),
 ("n10","Et c'est ainsi qu'il comprit… Il n'essayait pas d'échapper au futur. Il était en train de le créer.","mb-fr1",126,14,"narr"),
]
FX={
 "narr":"highpass=f=70,equalizer=f=140:t=q:w=1:g=4,acompressor=threshold=-20dB:ratio=3,aecho=0.8:0.5:60:0.12,volume=1.6",
 "tv":"highpass=f=400,lowpass=f=3800,equalizer=f=1500:t=q:w=1:g=5,acompressor=threshold=-18dB:ratio=4,volume=1.5",
 "double":"asetrate=44100*0.9,aresample=44100,atempo=1.0,highpass=f=90,lowpass=f=3500,aecho=0.8:0.6:90|180:0.35|0.2,volume=1.9",
}
info={}
for i,t,v,s,p,st in LINES:
    raw=f"{B}/{i}_raw.wav"; out=f"{B}/{i}.wav"
    subprocess.run(["espeak-ng","-v",v,"-s",str(s),"-p",str(p),"-g","4",t,"-w",raw],check=True)
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",raw,"-ar","44100","-ac","1","-af",FX[st]+",apad=pad_dur=0.4",out],check=True)
    w=wave.open(out); d=w.getnframes()/w.getframerate()
    info[i]={"text":t,"dur":round(d-0.4,3),"style":st}
    print(i,round(d-0.4,2),t)
json.dump(info,open(f"{B}/info.json","w"),ensure_ascii=False,indent=1)
