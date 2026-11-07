"""Gamma: a dark screw head partly hidden under a light plate edge. The dark region (Otsu threshold in a window) is taken,
its contour refined to sub-pixel along its normals (steepest step), the straight run where the plate's edge cuts it found by
RANSAC on a line and dropped (with 2 px either side), and a circle fitted to the remaining arc."""
import cv2,numpy as np
from zcal import fitc
def darkdisc(im,c0,win=30,dropline=True,seed=1):
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32); x0,y0=int(c0[0])-win,int(c0[1])-win
    w=cv2.GaussianBlur(g[y0:y0+2*win,x0:x0+2*win],(3,3),0.7)
    t,_=cv2.threshold(w.astype(np.uint8),0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    m=(w<t).astype(np.uint8); n,lab,st,cen=cv2.connectedComponentsWithStats(m)
    k=lab[win,win] if lab[win,win] else 1+np.argmax(st[1:,4]); m=(lab==k).astype(np.uint8)
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); cnt=max(cs,key=len)[:,0,:].astype(float)
    cx,cy=cnt.mean(0); pts=[]
    for (px,py) in cnt[::1]:
        a=np.arctan2(py-cy,px-cx); rr=np.arange(-3,3,0.2); xs=px+rr*np.cos(a); ys=py+rr*np.sin(a)
        v=cv2.remap(w,np.float32(xs[None]),np.float32(ys[None]),cv2.INTER_LINEAR)[0]; d=np.gradient(v); i=int(np.argmax(d))
        if 1<i<len(d)-2: pts.append((xs[i],ys[i]))
    p=np.array(pts)
    # drop the hard-image-border points
    p=p[(p[:,0]>1)&(p[:,0]<2*win-2)&(p[:,1]>1)&(p[:,1]<2*win-2)]
    if dropline:
        rng=np.random.default_rng(seed); best=None
        for _ in range(2000):
            a,b=p[rng.choice(len(p),2,replace=False)]; d=b-a; L=np.hypot(*d)
            if L<5: continue
            nrm=np.array([-d[1],d[0]])/L; inl=np.abs((p-a)@nrm)<0.8
            if best is None or inl.sum()>best[0].sum(): best=(inl,a,nrm)
        inl,a,nrm=best; far=np.abs((p-a)@nrm)>2.0; p=p[far]
    q,sd,rms,n=fitc(p); q=q.copy(); q[0]+=x0; q[1]+=y0; p=p+[x0,y0]
    return q,sd,rms,n,p
