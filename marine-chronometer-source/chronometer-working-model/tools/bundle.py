"""Two-camera fit of the balance, fusee and barrel axes to Fig. 2 and the top-view photograph (README, "How the layout was measured", steps 1-2).

    python bundle.py                     # seed 1, 45 restarts, the model's heights (read from ../js/movement.js)
    python bundle.py --seed 3 --restarts 45 --old-heights

The pixel coordinates are in the photographs' own frames: P3 in an earlier copy of References/photo-top-view.jpg, turned a quarter turn and 1.25x
larger (the committed copy is at (0.8 v + 345, 1549 - 0.8 u)). Only heights relative to the ring's matter (a common offset moves the camera), and
the scale is set afterwards (step 2), so the result is compared with L after fitting it to L by a turn and a scale about the plate's centre."""
import numpy as np,re,sys,pathlib
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation as Rot
# ---- observations (pixel coords, v down) ----
F2={'B':(775,512),'Fu':(1105,695),'Ba':(440,690)}
F2E=[(395,300),(300,345),(200,415),(140,490),(110,560),(100,640),(800,1030),(1000,995),(1100,960),(1200,915)]
P3={'B':(640,830),'Fu':(1240,610),'Ba':(930,1440)}
P3E=[(1220,200),(1345,300),(1450,400),(1530,500),(1590,600),(1630,700),(1655,800),(1675,900),(1683,1000),(1688,1100),(1680,1200),(1640,1300),(1600,1420),(1540,1540),(1470,1630),(1380,1700),(1290,1750),(1200,1790),(1000,110),(1100,140)]
def arg(k,d):return type(d)(sys.argv[sys.argv.index(k)+1]) if k in sys.argv else d
SRC=(pathlib.Path(__file__).resolve().parent.parent/'js'/'movement.js').read_text(encoding='utf-8')
K=lambda n:float(re.search(r'\b'+n+r'=(-?[\d.]+)',SRC).group(1))
LM={k:np.array(v) for k,v in eval(re.sub(r'(\w+):',r'"\1":',re.search(r'const L=(\{[^}]*\})',SRC).group(1))).items()}
# heights: the balance at its rim (BAL_Y), the fusee where it leaves the barrel bridge (BB_T), the barrel's square (4.4 above it, as p3fit.py), the edge at BB_T
H={'B':K('BAL_Y'),'Fu':K('BB_T'),'Ba':K('BB_T')-4.4};YR=K('BB_T')
if '--old-heights' in sys.argv:H={'B':-31.5,'Fu':-33.0,'Ba':-37.4};YR=-33   # the stack before 1340cb6
R0=np.array([[1,0,0],[0,0,-1],[0,1,0]],float)
def proj(cam,P):
    rv,s,tx,ty=cam[:3],cam[3],cam[4],cam[5];Rm=Rot.from_rotvec(rv).as_matrix()@R0
    Q=(Rm@np.array(P).T).T;return np.c_[s*Q[:,0]+tx,s*Q[:,1]+ty]
def unpack(p):
    m=dict(B=p[0:2],Fu=p[2:4],Ba=p[4:6],Rb=37.4);return m,p[6:12],p[12:18]
def resid(p,wE=0.35):
    m,c1,c2=unpack(p);out=[]
    for cam,obs,edge in((c1,F2,F2E),(c2,P3,P3E)):
        pts=[[m[k][0],H[k],m[k][1]] for k in obs];pr=proj(cam,pts)
        out+=list((pr-np.array([obs[k] for k in obs])).ravel())
        ring=proj(cam,[[m['Rb']*np.cos(t),YR,m['Rb']*np.sin(t)] for t in np.linspace(0,2*np.pi,240,endpoint=False)])
        for e in edge: out.append(wE*np.min(np.hypot(*(ring-np.array(e)).T)))
    return np.array(out)
best=None
init_m=[8.0,8.6,11.3,-18.3,-21.8,1.6]
rng=np.random.default_rng(arg('--seed',1))
for trial in range(arg('--restarts',45)):
    c1=list(Rot.from_euler('xyz',[rng.uniform(-1,1),rng.uniform(-3.2,3.2),rng.uniform(-0.4,0.4)]).as_rotvec())+[17,760,629]
    c2=list(Rot.from_euler('xyz',[rng.uniform(-0.7,0.7),rng.uniform(-3.2,3.2),rng.uniform(-0.3,0.3)]).as_rotvec())+[24,900,950]
    p0=np.array(init_m+c1+c2,float)
    try:
        r=least_squares(resid,p0,loss='soft_l1',f_scale=8,max_nfev=250)
    except Exception as ex: continue
    if best is None or r.cost<best.cost: best=r
m,c1,c2=unpack(best.x)
print('cost',round(best.cost,1))
for k in('B','Fu','Ba'):print(k,np.round(m[k],2),'r=%.2f'%np.hypot(*m[k]))
print('scales px/mm',round(c1[3],2),round(c2[3],2),'tilt deg F2 %.1f P3 %.1f'%tuple(np.degrees(np.arccos(abs((Rot.from_rotvec(c[:3]).as_matrix()@R0)[2,1])))for c in(c1,c2)))
res=resid(best.x,1.0);print('point residuals px F2',np.round(np.hypot(res[0:6:2],res[1:6:2]),1),' P3',np.round(np.hypot(res[16:22:2],res[17:22:2]),1))
print('edge residuals px F2',np.round(res[6:16],1)); print('edge residuals px P3',np.round(res[22:],1))
np.save('bundle.npy',best.x)
# fitted to L by a turn and a scale about the centre (no mirror): what is left is how far the photographs put each axis from L
P=np.array([m[k] for k in('B','Fu','Ba')]);Q=np.array([LM[k] for k in('B','Fu','Ba')]);zc=P[:,0]+1j*P[:,1];zl=Q[:,0]+1j*Q[:,1]
w=(np.conj(zc)@zl)/(np.conj(zc)@zc);d=zc*w-zl
print('to L: scale %.4f turn %.1f deg; off L (mm)'%(abs(w),np.degrees(np.angle(w))),' '.join('%s %.2f (%.2f, %.2f)'%(k,abs(e),e.real,e.imag) for k,e in zip(('B','Fu','Ba'),d)))
