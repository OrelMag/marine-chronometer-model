"""Gamma: the contact's four block screws on 14_E-Kontakt1.jpg: each cylindrical head's silhouette edges found row by row over its
side (steepest step outward from a hand-placed centre), the axis the midline, the head's front top rim the strongest step going up
the axis. Model points projected through cam_k1.json (drawn parts only) at their axes, head top y -8.8, front rim r_head toward the
camera; the difference in px and in mm at the screw (px over the local scale). The focal length is loose (cost flat 2500-5000):
each is also given at f 2500 and 5000 refits."""
import cv2,numpy as np,json
from scipy.optimize import least_squares
exec(open('k1cam.py').read().split("# start:")[0])
c=json.load(open('cam_k1.json')); q=np.r_[c['rv'],c['t'],c['f']]
# hand centres (x, row of the side's middle, top row guess) read off the photo
S=[('block 57 screw at 226.0',[30.86,29.8],(120,350,318)),('block 57 screw at 214.6',[24.36,35.31],(330,368,335)),
   ('block 52 screw at 193.3',[10.03,42.12],(697,360,327)),('block 52 screw at 182.9',[2.17,42.85],(904,335,297))]
def meas(xc,ymid,ytop):
    mids=[]
    for y in range(ymid-8,ymid+9,2):
        xs=np.arange(xc-45,xc+45,0.25); v=cv2.remap(g,np.float32(xs[None]),np.float32(np.full((1,len(xs)),y)),cv2.INTER_LINEAR)[0]; d=np.gradient(v)
        L=xs<xc-8; R=xs>xc+8
        iL=np.argmax(np.abs(d)*L); iR=np.argmax(np.abs(d)*R); mids.append(((xs[iL]+xs[iR])/2,xs[iR]-xs[iL]))
    mids=np.array(mids); ax=np.median(mids[:,0]); wd=np.median(mids[:,1])
    ys=np.arange(ytop-15,ytop+15,0.25); v=cv2.remap(g,np.float32(np.full((1,len(ys)),ax)),np.float32(ys[None]),cv2.INTER_LINEAR)[0]; d=np.abs(np.gradient(v)); i=int(np.argmax(d))
    return ax,ys[i],wd
out={}
for ff in (None,2500,5000):
    if ff is None: qq=q
    else:
        s=least_squares(lambda z:res(np.r_[z,ff]),q[:6]); qq=np.r_[s.x,ff]
    C=camc(qq)
    for nm,xz,(xc,ym,yt) in S:
        ax,ytop,wd=meas(xc,ym,yt)
        v=np.array([C[0]-xz[0],C[2]-xz[1]]); v/=np.linalg.norm(v)
        rh=2.8  # head radius guess only for the rim point; the axis x is what's compared
        P=np.array([[xz[0],-8.8,xz[1]],[xz[0]+rh*v[0],-8.8,xz[1]+rh*v[1]],[xz[0]+1,-8.8,xz[1]]])
        pr=proj(P,qq[:3],qq[3:6],qq[6],W,H); k=np.linalg.norm(pr[2]-pr[0])  # px per mm along x at the screw
        dx=ax-pr[0][0]; dy=ytop-pr[1][1]
        out.setdefault(nm,{})[str(ff)]=dict(axis_px=ax,top_px=ytop,width_px=wd,model_px=pr[0].tolist(),dx_px=dx,dy_px=dy,px_per_mm=k)
        print('f %-5s %-24s axis x %.1f (model %.1f): %+.1f px = %+.2f mm sideways; front rim y %.1f (model, head r 2.8: %.1f) %+.1f px; head width %.1f px = %.2f mm'%(ff,nm,ax,pr[0][0],dx,dx/k,ytop,pr[1][1],dy,wd,wd/k))
json.dump(out,open('k1screws.json','w'),indent=1)
