"""Gamma: the Z view's rim transitions, each found along rays from the arbor centre as the steepest step of the right sign
in a radial window, then a circle fitted with a free centre (MAD-trimmed). Angles with the case's lugs, the brackets and
the hands are left out. Radii in px; mm at the dial plane by zcal's scale (a feature above the dial is nearer the camera,
so its true radius is smaller by (1 - h/D))."""
import cv2,numpy as np,json
from zcal import samp,fitc
im=cv2.imread('E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg').astype(np.float32)
L=im.mean(2)
cal=json.load(open('zcal.json'));U=np.array(cal['updown']['c']);S=np.array(cal['seconds']['c']);O=(U+S)/2;k=np.linalg.norm(S-U)/46
def edge(r0,r1,sign,ch=L,angs=None,skip=()):
    pts=[]
    for ad in angs:
        if any(a0<=ad<=a1 for a0,a1 in skip): continue
        a=np.radians(ad); rr=np.arange(r0,r1,0.25); x=O[0]+rr*np.cos(a); y=O[1]+rr*np.sin(a)
        v=cv2.remap(ch,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]; v=cv2.GaussianBlur(v.reshape(-1,1),(1,5),1).ravel()
        d=np.gradient(v)*sign; i=int(np.argmax(d))
        if d[i]<4 or i<2 or i>len(d)-3: continue
        y0,y1,y2=d[i-1],d[i],d[i+1]; o=(y0-y2)/(2*(y0-2*y1+y2)+1e-9); r=rr[i]+o*0.25
        pts.append((O[0]+r*np.cos(a),O[1]+r*np.sin(a)))
    return np.array(pts)
skip=[(80,100),(260,280),(15,40),(355,360),(0,5),(150,175)]  # image angles: lugs at 90/270, bracket lower right, hand at ~165/10
A=np.arange(0,360,1.0); out={}
for nm,(r0,r1,s) in {'T1 white dial -> gold (sight edge)':(440,460,-1),'T2 bright gold -> dark':(458,478,-1),'T3 dark -> background (silhouette)':(476,500,1)}.items():
    p=edge(r0,r1,s,angs=A,skip=skip); q,sd,rms,n=fitc(p)
    off=(q[:2]-O)/k
    out[nm]=dict(r_px=q[2],sd=sd.tolist(),rms=rms,n=n,c_off_mm=off.tolist(),r_dialscale=q[2]/k)
    print('%-38s r %.2f px (sd %.2f, rms %.2f, n %d) = %.2f mm at dial scale; centre off the arbor %.2f,%.2f mm'%(nm,q[2],sd[2],rms,n,q[2]/k,off[0],off[1]))
json.dump(out,open('zrim.json','w'),indent=1)
