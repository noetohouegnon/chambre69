# -*- coding: utf-8 -*-
"""Carte des 12 départements : recoloration du fond « Benin departments map in grayscale.svg »
(Fawaz.tairou, CC BY-SA 4.0, Wikimedia Commons) — œuvre dérivée, même licence."""
import numpy as np, json, sys
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi
SRC='/tmp/claude-0/work/dep.png'; OUT='/home/user/chambre69/catalogue_benin/build/maps/map_departements.png'
im0=Image.open(SRC).convert('RGBA'); a=np.array(im0)
alpha=a[:,:,3]; rgb=a[:,:,:3].astype(int)
H,W=alpha.shape
dark=(rgb.sum(axis=2)<150)&(alpha>0)
lab,n=ndi.label((~dark)&(alpha>0))
regs=[]
for i in range(1,n+1):
    m=lab==i; ar=int(m.sum())
    if ar<400: continue
    ys,xs=np.where(m); regs.append(dict(id=i,area=ar,cx=xs.mean()/W,cy=ys.mean()/H,col=tuple(rgb[m].mean(axis=0).astype(int))))
sea=[r for r in regs if r['col'][0]>200 and r['col'][2]>240][0]
deps=[r for r in regs if r is not sea]
print([(r['id'],r['area'],round(r['cx'],2),round(r['cy'],2)) for r in deps])
def find(cx,cy):
    return min(deps,key=lambda r:(r['cx']-cx)**2+(r['cy']-cy)**2)
NAMES={'Alibori':(0.67,0.19),'Atacora':(0.26,0.29),'Borgou':(0.63,0.42),'Donga':(0.34,0.50),'Collines':(0.46,0.68),'Plateau':(0.59,0.82),'Zou':(0.44,0.82),'Couffo':(0.34,0.86),'Ouémé':(0.57,0.92),'Atlantique':(0.47,0.92),'Mono':(0.35,0.93)}
COL={'Alibori':'#D9C28F','Atacora':'#9CBFAE','Borgou':'#D4A07F','Donga':'#E6D6B4','Collines':'#B3CDBE','Zou':'#DDB594','Plateau':'#CDB67F','Couffo':'#BFD3C5','Mono':'#EBD0AE','Atlantique':'#A6C4B2','Ouémé':'#DBBE92','Littoral':'#B5502F'}
lit=[r for r in deps if r['area']<1500][0]
hexrgb=lambda h:tuple(int(h[i:i+2],16) for i in (1,3,5))
out=np.zeros((H,W,4),dtype=np.uint8); out[:,:,:3]=hexrgb('#F7F1E3'); out[:,:,3]=0
out[(alpha>0)]= (*hexrgb('#F7F1E3'),255)
reg2name={}
for name,(cx,cy) in NAMES.items():
    r=find(cx,cy); reg2name[r['id']]=name
    out[lab==r['id']]=(*hexrgb(COL[name]),255)
out[lab==lit['id']]=(*hexrgb(COL['Littoral']),255)
out[lab==sea['id']]=(*hexrgb('#DCE8E4'),255)
# bordures : pixels sombres -> ivoire ; contour extérieur -> vert
dk=dark.copy()
out[dk]=(*hexrgb('#FBF8EF'),255)
mask_in=(alpha>0)
er=ndi.binary_erosion(mask_in,iterations=3)
edge=mask_in&~er
out[edge&dark]=(*hexrgb('#0F4C3A'),255)
# Littoral : petite région sombre près de la côte (entre Atlantique et Ouémé)
# repérée comme composante sombre de petite taille proche de (0.52,0.975)
labd,nd=ndi.label(dark)
best=None
for i in range(1,nd+1):
    m=labd==i; ys,xs=np.where(m)
    if len(xs)<30: continue
    cx,cy=xs.mean()/W,ys.mean()/H
img=Image.fromarray(out,'RGBA')
d=ImageDraw.Draw(img)
fb=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf',34)
fr=ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Regular.otf',27)
# calibration équirectangulaire
def px(lat,lon): return ((lon-0.77)*294+25,(12.42-lat)*300+5)
CAP={'Alibori':('Kandi',11.134,2.939),'Atacora':('Natitingou',10.304,1.380),'Atlantique':('Allada',6.665,2.151),'Borgou':('Parakou',9.337,2.630),'Collines':('Dassa-Zoumè',7.750,2.183),'Couffo':('Aplahoué',6.933,1.679),'Donga':('Djougou',9.708,1.666),'Mono':('Lokossa',6.639,1.717),'Ouémé':('Porto-Novo',6.497,2.629),'Plateau':('Pobè',6.981,2.668),'Zou':('Abomey',7.183,1.991)}
OFF={'Alibori':(0,-70),'Atacora':(-40,-90),'Borgou':(0,-120),'Donga':(0,-60),'Collines':(0,-80),'Plateau':(30,-60),'Zou':(-10,-70),'Couffo':(-30,-60),'Ouémé':(125,-30),'Atlantique':(-10,-60),'Mono':(-50,-10)}
for name,(cap,lat,lon) in CAP.items():
    x,y=px(lat,lon)
    dx,dy=OFF[name]
    d.ellipse([x-9,y-9,x+9,y+9],fill='#0F4C3A',outline='#FFFFFF',width=3)
    tx=x+dx; ty=y+dy
    d.text((tx,ty),name.upper(),font=fb,fill='#1F2A24',anchor='mm',stroke_width=5,stroke_fill='#F7F1E3')
    d.text((tx,ty+34),cap,font=fr,fill='#0F4C3A',anchor='mm',stroke_width=4,stroke_fill='#F7F1E3')
# Cotonou (Littoral)
x,y=px(6.365,2.418)
d.ellipse([x-12,y-12,x+12,y+12],fill='#B5502F',outline='#FFFFFF',width=4)
d.text((x-100,y+30),'LITTORAL',font=fb,fill='#B5502F',anchor='mm',stroke_width=5,stroke_fill='#DCE8E4')
d.text((x-100,y+64),'Cotonou',font=fr,fill='#1F2A24',anchor='mm',stroke_width=4,stroke_fill='#DCE8E4')
import os; os.makedirs(os.path.dirname(OUT),exist_ok=True)
img.save(OUT)
print('ok',OUT)
