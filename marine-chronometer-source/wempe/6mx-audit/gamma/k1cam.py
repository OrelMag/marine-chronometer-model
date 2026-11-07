"""Gamma: 14_E-Kontakt1.jpg (Kirov 247's contact from the front) put through a pinhole camera fitted only on drawn parts that are not
in question: the top plate's inner-face rim (r 42.494 at y -19, 05 09 01 / sheet 001), its lower edge found column by column as the
strongest step near a hand-guided curve; and pillar 39 (body Ø 8.0, the 6MX's place (6.477, 36.733), between y 0 and -19), its two
silhouette edges found row by row and held to the cylinder's projected silhouette (tangent points recomputed from the camera each
step). f free, principal point at the centre."""
import cv2,numpy as np,json
from scipy.optimize import least_squares
from cam import proj
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx-gallery/leben-des-6mx/14_E-Kontakt1.jpg'
im=cv2.imread(IMG); g=cv2.GaussianBlur(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(np.float32),(3,3),0.8); H,W=g.shape
P39=np.array([6.477,36.733]); RP=4.0
# guide for the rim's lower edge: (x, y) read off the zoom: 0->60, 250->80, 512->88, 750->78, 1024->50
gx=np.array([0,250,512,750,1024.]); gy=np.array([60,80,88,78,50.])
rim=[]
for x in range(5,1020,6):
    if 630<x<845: continue
    y0=np.interp(x,gx,gy); ys=np.arange(y0-12,y0+12,0.25); v=cv2.remap(g,np.float32(np.full((1,len(ys)),x)),np.float32(ys[None]),cv2.INTER_LINEAR)[0]
    d=np.abs(np.gradient(v)); i=int(np.argmax(d))
    if d[i]>3 and 2<i<len(d)-3: rim.append((x,ys[i]))
rim=np.array(rim)
pil=[]
for y in range(110,340,4):
    for xg in (650,822):
        xs=np.arange(xg-14,xg+14,0.25); v=cv2.remap(g,np.float32(xs[None]),np.float32(np.full((1,len(xs)),y)),cv2.INTER_LINEAR)[0]
        d=np.abs(np.gradient(v)); i=int(np.argmax(d))
        if d[i]>3 and 2<i<len(d)-3: pil.append((xs[i],y,0 if xg<700 else 1))
pil=np.array(pil)
th=np.radians(np.arange(0,360,0.25)); RIMW=np.c_[42.494*np.sin(th),np.full_like(th,-19.0),-42.494*np.cos(th)]
def camc(q):
    R=cv2.Rodrigues(q[:3])[0]; return -R.T@q[3:6]
def silh(q):
    C=camc(q); v=np.array([C[0]-P39[0],C[2]-P39[1]]); v/=np.linalg.norm(v); n=np.array([-v[1],v[0]])
    ys=np.linspace(-1,-18,30); out=[]
    for s in (-1,1):
        p=P39+s*RP*n; out.append(proj(np.c_[np.full(30,p[0]),ys,np.full(30,p[1])],q[:3],q[3:6],q[6],W,H))
    return out
def ptline(pts,L):
    a=L[0];b=L[-1];d=(b-a)/np.linalg.norm(b-a);nrm=np.array([-d[1],d[0]]); return (pts-a)@nrm
def res(q,mask=None):
    pr=proj(RIMW,q[:3],q[3:6],q[6],W,H)
    vis=pr[(pr[:,0]>-50)&(pr[:,0]<W+50)]
    # near side only: choose the projected points nearer the camera
    C=camc(q); Xw=RIMW; dist=np.hypot(Xw[:,0]-C[0],Xw[:,2]-C[2]); near=dist<np.median(dist); pn=pr[near]
    dr=np.sqrt(((rim[:,None,:]-pn[None])**2).sum(2)).min(1)
    if mask is not None: dr=dr[mask]
    S=silh(q); ds=[]
    for k in (0,1):
        pts=pil[pil[:,2]==k][:,:2]; ds.append(ptline(pts,S[k]))
    return np.r_[dr,np.concatenate(ds)*1.0]
# start: camera in front of the contact at about 205 deg, 140 mm out, at the top plate's inner face level
best=None
for f0 in (1500,2500,4000):
    for D in (100,150,250):
      for el in (-5.0,-17.0,-30.0):
          a=np.radians(205); C=np.array([-D*np.sin(a)*-1,-17.0,-D*np.cos(a)*-1])
          C=np.array([10.0+D*0.15, el, 30+D])
          tgt=np.array([5.0,-10.0,20.0]); z=tgt-C; z/=np.linalg.norm(z); yd=np.array([0,1.0,0]); x=np.cross(yd,z); x/=np.linalg.norm(x); y=np.cross(z,x)
          R=np.array([x,y,z]); rv=cv2.Rodrigues(R)[0].ravel(); t=-R@C
          try: r=least_squares(res,np.r_[rv,t,f0],loss='soft_l1',f_scale=2)
          except Exception as e: continue
          if best is None or r.cost<best.cost: best=r
q=best.x; r0=res(q); m=np.abs(r0[:len(rim)])<3*np.median(np.abs(r0[:len(rim)]))+1
r=least_squares(lambda qq:res(qq,m),q); q=r.x; rr=res(q,m); nr=m.sum()
print('rim pts %d kept %d rms %.2f px; pillar edges %d rms %.2f px'%(len(rim),nr,np.sqrt((rr[:nr]**2).mean()),len(pil),np.sqrt((rr[nr:]**2).mean())))
print('f %.0f, camera at %s, %.0f mm from the pillar'%(q[6],np.round(camc(q),1),np.linalg.norm(camc(q)[[0,2]]-P39)))
for ff in (1200,1800,2500,3500,5000):
    s=least_squares(lambda qq:res(np.r_[qq,ff],m),q[:6]); print('  f %d cost %.1f'%(ff,(s.fun**2).sum()))
json.dump(dict(rv=q[:3].tolist(),t=q[3:6].tolist(),f=q[6],W=W,H=H),open('cam_k1.json','w'))
