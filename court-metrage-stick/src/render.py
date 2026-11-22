import sys, subprocess, os
sys.path.insert(0,'src')
from multiprocessing import Pool
from scenes import *
FPS=30; NF=int(round(TOTAL*FPS))
def work(args):
    i,a,b=args
    out=f"build/chunk_{i}.mp4"
    p=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","rawvideo","-pix_fmt","bgra","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
        "-c:v","libx264","-preset","medium","-crf","17","-pix_fmt","yuv420p","-g","30",out],stdin=subprocess.PIPE)
    s=skia.Surface(W,H); c=s.getCanvas()
    for f in range(a,b):
        render(c,f/FPS)
        p.stdin.write(s.makeImageSnapshot().tobytes() if False else bytes(s.makeImageSnapshot().toarray().tobytes()))
    p.stdin.close(); p.wait(); return out
if __name__=="__main__":
    n=8; per=(NF+n-1)//n
    jobs=[(i,i*per,min(NF,(i+1)*per)) for i in range(n)]
    with Pool(4) as pool: r=pool.map(work,jobs)
    open("build/list.txt","w").write("".join(f"file 'chunk_{i}.mp4'\n" for i in range(n)))
    print("frames",NF)
