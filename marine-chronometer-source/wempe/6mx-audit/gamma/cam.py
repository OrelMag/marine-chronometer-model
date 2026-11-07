"""Gamma: a pinhole camera fitted to named model points (the movement's drawn screws and pivots, not the audited parts),
principal point at the image centre, f fixed or free; unproject pixels onto a plane y = h of the movement frame
(mm; dial side +y, 12 o'clock -z, 3 o'clock +x). Screw-head picks are refined first: the head's rim found along 72 rays as the
strongest gradient and a circle fitted (centre of the rim circle; head tops are flat, so the bias is small at these tilts)."""
import cv2,numpy as np
from scipy.optimize import least_squares
def load(p): im=cv2.imread(p); return im, cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32)
def refine(g,c0,r0=4,r1=22):
    from zcal import fitc
    gx=cv2.Sobel(cv2.GaussianBlur(g,(3,3),0.8),cv2.CV_32F,1,0); gy=cv2.Sobel(cv2.GaussianBlur(g,(3,3),0.8),cv2.CV_32F,0,1)
    pts=[]
    for a in np.radians(np.arange(0,360,5)):
        rr=np.arange(r0,r1,0.25); x=c0[0]+rr*np.cos(a); y=c0[1]+rr*np.sin(a)
        m=cv2.remap(gx,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]*np.cos(a)+cv2.remap(gy,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]*np.sin(a)
        m=np.abs(m); i=int(np.argmax(m))
        if 1<i<len(m)-2: pts.append((x[i],y[i]))
    q,sd,rms,n=fitc(np.array(pts)); return q,rms,n
def proj(P,rv,t,f,W,H):
    R=cv2.Rodrigues(rv)[0]; X=(R@np.asarray(P,float).T).T+t; return np.c_[f*X[:,0]/X[:,2]+W/2,f*X[:,1]/X[:,2]+H/2]
def fit(P,uv,W,H,f=None,f0=3000):
    P=np.asarray(P,float); uv=np.asarray(uv,float)
    K=np.array([[f or f0,0,W/2],[0,f or f0,H/2],[0,0,1]])
    ok,rv,t=cv2.solvePnP(P,uv,K,None,flags=cv2.SOLVEPNP_ITERATIVE); rv=rv.ravel(); t=t.ravel()
    def res(q):
        ff=f if f else q[6]; return (proj(P,q[:3],q[3:6],ff,W,H)-uv).ravel()
    q0=np.r_[rv,t] if f else np.r_[rv,t,f0]
    r=least_squares(res,q0); q=r.x; ff=f if f else q[6]
    return dict(rv=q[:3],t=q[3:6],f=ff,res=res(q).reshape(-1,2),W=W,H=H)
def unproj(c,uv,h):
    R=cv2.Rodrigues(c['rv'])[0]; d=np.array([(uv[0]-c['W']/2)/c['f'],(uv[1]-c['H']/2)/c['f'],1.0])
    # camera centre in world, ray direction in world
    Cw=-R.T@c['t']; dw=R.T@d; s=(h-Cw[1])/dw[1]; return Cw+s*dw
