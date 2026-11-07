"""Gamma: Kirov 247's uZ (dial side, dial and hands off) photograph: a pinhole camera fitted on the drawn movement's points
(k247_uZ.json's model points: arbors, jewels, bridge and pillar screws; the screw heads' picks refined on their rims) together with
the pillar plate's rim (r 42.494 at y 3.35, the drawings'), its edge found along rays and held to the projected circle. f free
(the points span y 3.35-18.25), principal point at the centre."""
import numpy as np,json,cv2
from cam import *; from sector import sector
from scipy.optimize import least_squares
IMG='E:/Marine-Chronometer/References/wempe/photos/dg-chrono-6mx/3_Kirow_247_uZ.jpg'
im,g=load(IMG); H,W=g.shape
spec=json.load(open('E:/Marine-Chronometer/.claude/worktrees/6mx-gamma/marine-chronometer-source/chronometer-working-model/tools/photocompare/k247_uZ.json'))
P=[];UV=[];names=[]
for k,v in spec['points'].items():
    uv=np.array(v['uv'],float)
    if 'screw' in k:
        q,rms,n=refine(g,uv,3,20)
        if rms<1.5 and np.hypot(*(q[:2]-uv))<5: uv=q[:2]
    P.append(v['xyz']); UV.append(uv); names.append(k)
P=np.array(P);UV=np.array(UV)
# rim edge points: strongest step between r 340 and 380 px about the cannon tube
O=UV[0]; rimpts=[]
gb=cv2.GaussianBlur(g,(5,5),1.2)
for ad in np.arange(0,360,3):
    a=np.radians(ad); rr=np.arange(340,385,0.25); x=O[0]+rr*np.cos(a); y=O[1]+rr*np.sin(a)
    v=cv2.remap(gb,np.float32(x[None]),np.float32(y[None]),cv2.INTER_LINEAR)[0]; d=np.abs(np.gradient(v)); i=int(np.argmax(d))
    if d[i]>3 and 2<i<len(d)-3: rimpts.append((x[i],y[i]))
rimpts=np.array(rimpts)
th=np.radians(np.arange(0,360,0.5)); RIM=np.c_[42.494*np.sin(th),np.full_like(th,3.35),-42.494*np.cos(th)]
def res(q,use_rim=True,keep=None):
    rv,t,f=q[:3],q[3:6],q[6]; r1=(proj(P,rv,t,f,W,H)-UV).ravel()
    if not use_rim: return r1
    pr=proj(RIM,rv,t,f,W,H); d=np.sqrt(((rimpts[:,None,:]-pr[None])**2).sum(2)).min(1)
    if keep is not None: d=d[keep]
    return np.r_[r1,0.5*d]
c0=fit(P,UV,W,H,f=2400); q0=np.r_[c0['rv'],c0['t'],2400]
r=least_squares(lambda q:res(q,False),q0); 
r=least_squares(lambda q:res(q),r.x,loss='soft_l1',f_scale=1.5)
pr=proj(RIM,r.x[:3],r.x[3:6],r.x[6],W,H); d=np.sqrt(((rimpts[:,None,:]-pr[None])**2).sum(2)).min(1); keep=d<3*np.median(d)+1
r=least_squares(lambda q:res(q,True,keep),r.x)
q=r.x; c=dict(rv=q[:3],t=q[3:6],f=q[6],W=W,H=H)
pres=np.hypot(*(proj(P,q[:3],q[3:6],q[6],W,H)-UV).T)
for n_,e in zip(names,pres): print('  %-50s %.2f px'%(n_,e))
pr=proj(RIM,q[:3],q[3:6],q[6],W,H); d=np.sqrt(((rimpts[keep][:,None,:]-pr[None])**2).sum(2)).min(1)
print('rim: %d edge points kept of %d, rms %.2f px'%(keep.sum(),len(keep),np.sqrt((d**2).mean())))
R=cv2.Rodrigues(q[:3])[0]; Cw=-R.T@q[3:6]
print('f %.0f px, camera at %s (%.0f mm from the plate centre)'%(q[6],np.round(Cw,1),np.linalg.norm(Cw)))
# f sensitivity: refit with f fixed at several values, report cost
for ff in (1800,2400,3200,4500,6000):
    rr=least_squares(lambda qq:res(np.r_[qq,ff],True,keep),q[:6]); print('  f %5d: cost %.1f'%(ff,(rr.fun**2).sum()))
json.dump(dict(rv=q[:3].tolist(),t=q[3:6].tolist(),f=q[6],W=W,H=H),open('cam_uZ.json','w'))
