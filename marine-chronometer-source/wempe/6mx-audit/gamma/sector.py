"""Gamma: a round edge seen over a sector only: edge points along rays from a rough centre within the sector (steepest step of
the given sign), MAD-trimmed, circle fitted."""
import cv2,numpy as np
from zcal import fitc
def sector(g,c0,r0,r1,a0,a1,sign=1,step=2,thr=5):
    gb=cv2.GaussianBlur(g,(3,3),0.7); pts=[]
    for ad in np.arange(a0,a1,step):
        a=np.radians(ad); rr=np.arange(r0,r1,0.2); x=c0[0]+rr*np.cos(a); y=c0[1]+rr*np.sin(a)
        v=cv2.remap(gb,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v)*sign; i=int(np.argmax(d))
        if d[i]<thr or i<2 or i>len(d)-3: continue
        y0,y1,y2=d[i-1],d[i],d[i+1]; o=(y0-y2)/(2*(y0-2*y1+y2)+1e-9); r=rr[i]+o*0.2
        pts.append((c0[0]+r*np.cos(a),c0[1]+r*np.sin(a)))
    p=np.array(pts); q,sd,rms,n=fitc(p); return q,sd,rms,n,p
