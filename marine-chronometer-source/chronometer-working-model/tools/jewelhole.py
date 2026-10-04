"""jewelhole.py: a jewel's hole against its stone, on a video frame of the setting held to the light (no browser; numpy, scipy, Pillow).

Lit from behind, the hole shows as a disc of plain light inside the stone: the light through it misses the stone. Along 90 rays from a centre,
the strongest fall in brightness inside [h0, h1] px is the hole's edge and inside [s0, s1] px the stone's; a circle is fitted to each by least
squares (the hole's centre refitted four times) and the ratio of the radii needs no camera. Put it in millimetres by the stone's size or a
scale on the same frame (References/VIDEOS.md, "The escape jewel's hole", "The third's and fourth's lower jewels").

    python jewelhole.py FRAME.png CX CY H0 H1 S0 S1
    python jewelhole.py $MC_VIDEO/frames/f_KLUwI2UUCMQ_15-06.png 1193 1665 40 110 170 260     # the third's lower jewel: hole r 62.6 px, ratio 0.284
"""
import math,sys
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates as mc

ANG=np.linspace(0,2*math.pi,90,endpoint=False)
def edges(L,c,r0,r1):
    out=[]
    for a in ANG:
        r=np.arange(r0,r1,0.5);v=mc(L,[c[1]+r*np.sin(a),c[0]+r*np.cos(a)],order=1);out.append(r[np.argmin(np.gradient(v))])
    return np.array(out)
def circle(re,c):
    x=c[0]+re*np.cos(ANG);y=c[1]+re*np.sin(ANG);s=np.linalg.lstsq(np.c_[2*x,2*y,np.ones_like(x)],x*x+y*y,rcond=None)[0];C=s[:2];R=math.sqrt(s[2]+C@C)
    return C,R,float(np.sqrt(np.mean((np.hypot(x-C[0],y-C[1])-R)**2)))
def fit(path,c,h,s):
    L=np.asarray(Image.open(path).convert('RGB')).astype(float).mean(2);c=np.array(c,float)
    for _ in range(4):c,R,rms=circle(edges(L,c,*h),c)
    _,Rs,rs=circle(edges(L,c,*s),c)
    return c,R,rms,Rs,rs
if __name__=='__main__':
    a=sys.argv[1:]
    if len(a)!=7:sys.exit(__doc__)
    c,R,rms,Rs,rs=fit(a[0],(float(a[1]),float(a[2])),(float(a[3]),float(a[4])),(float(a[5]),float(a[6])))
    print('centre %.1f %.1f  hole r %.1f px (rms %.1f)  stone r %.1f px (rms %.1f)  ratio %.3f'%(c[0],c[1],R,rms,Rs,rs,R/Rs))
