import sys; sys.path.insert(0,'src')
from scenes import *
from PIL import Image
ts=[float(x) for x in sys.argv[2:]]
out=[]
for t in ts:
    s=skia.Surface(W,H); render(s.getCanvas(),t)
    im=Image.fromarray(s.makeImageSnapshot().toarray()[:,:,:3][:,:,::-1] if False else s.makeImageSnapshot().convert(skia.kRGB_888x_ColorType, skia.kUnpremul_AlphaType).toarray()[:,:,:3]).resize((360,640))
    out.append(im)
cols=min(len(out),6); rows=(len(out)+cols-1)//cols
sheet=Image.new("RGB",(360*cols,640*rows))
for i,im in enumerate(out): sheet.paste(im,((i%cols)*360,(i//cols)*640))
sheet.save(sys.argv[1])
