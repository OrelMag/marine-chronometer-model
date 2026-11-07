"""Gamma: a round feature partly hidden (a screw head under a plate's edge): edge points along 180 rays (dark inside to light
outside, the steepest rise), then a RANSAC circle (radius bounded) so the straight edge of the part over it is left out, then a
geometric fit on the inliers."""
import cv2,numpy as np
from zcal import fitc
def arcfit(g,c0,r0,r1,rmin,rmax,sign=1,tol=0.6,seed=0):
    pts=[]
    gb=cv2.GaussianBlur(g,(3,3),0.7)
    for a in np.radians(np.arange(0,360,2)):
        rr=np.arange(r0,r1,0.2); x=c0[0]+rr*np.cos(a); y=c0[1]+rr*np.sin(a)
        v=cv2.remap(gb,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v)*sign; i=int(np.argmax(d))
        if d[i]<5 or i<2 or i>len(d)-3: continue
        y0,y1,y2=d[i-1],d[i],d[i+1]; o=(y0-y2)/(2*(y0-2*y1+y2)+1e-9); r=rr[i]+o*0.2
        pts.append((c0[0]+r*np.cos(a),c0[1]+r*np.sin(a)))
    p=np.array(pts); rng=np.random.default_rng(seed); best=None
    for _ in range(3000):
        s=p[rng.choice(len(p),3,replace=False)]
        A=np.c_[2*s,np.ones(3)]; b=(s**2).sum(1)
        try: q=np.linalg.solve(A,b)
        except np.linalg.LinAlgError: continue
        R=np.sqrt(q[2]+q[0]**2+q[1]**2)
        if not rmin<R<rmax: continue
        inl=np.abs(np.hypot(p[:,0]-q[0],p[:,1]-q[1])-R)<tol
        if best is None or inl.sum()>best.sum(): best=inl
    q,sd,rms,n=fitc(p[best]); ang=np.degrees(np.arctan2(p[best][:,1]-q[1],p[best][:,0]-q[0]))
    return q,sd,rms,n,len(p),p[best]
