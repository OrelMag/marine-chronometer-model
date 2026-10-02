"""The focal length a frame allows (python fcal.py SPEC.json [--fs 1500,2000,...] [--wc 5] [--noring]): runs rimfit.py's own model of the frame (the rim of known radius,
its centre point, the round settings at their heights) at each focal length f in turn, printing the rim's rms (mm), the centre's miss (mm), the rings' roundness (mm), the
camera's tilt and the total cost, then f left free from the best grid point. With "cut" in the spec (traced points on the face; "cut_h", the heights to try) it also fits
that cut's circle, centre and radius free, at each f.
The video's camera changes its focal length between shots (References/VIDEOS.md, "The camera's focal length"), so a fit made at an assumed f (rimfit.py, framecam.py:
6000) holds only where this profile has a clear minimum near it; otherwise report the result over the range the profile allows, and check it with a ratio that needs no
camera (a part's own proportions seen whole). About 10-30 s a spec."""
import os,sys,json,numpy as np
import pathlib
TOOLS=str(pathlib.Path(__file__).resolve().parent)
argv=sys.argv[1:];spec=argv[0]
if not os.path.exists(spec):spec=os.path.join(TOOLS,spec)
FS=[float(x) for x in argv[argv.index('--fs')+1].split(',')] if '--fs' in argv else [1500,2000,2500,3000,3500,4000,5000,6000,7000,8000,10000,14000]
src=open(os.path.join(TOOLS,'rimfit.py')).read().split('out={}')[0]
sys.argv=['rimfit.py',spec]
exec(src)
FS=[float(x) for x in argv[argv.index('--fs')+1].split(',')] if '--fs' in argv else [1500,2000,2500,3000,3500,4000,5000,6000,7000,8000,10000,14000]
from scipy.optimize import least_squares as LSQ
if S.get('allrim'):rim=np.array(S['rim_pts'],float)
if '--noring' in argv:RINGS=[]
WC=float(argv[argv.index('--wc')+1]) if '--wc' in argv else 5.0
def res2(x,f):
    r=res(x,f)
    if 'centre' in S and WC!=5.0:nr=len(rim);r=r.copy();r[nr:nr+2]*=WC/5.0
    return r
def fit2(f,x0=None):
    best=None
    starts=[x0] if x0 is not None else [[p0,q0,0,10,f*80/W] for p0 in(-0.7,-0.5,-0.3,0.3,0.5,0.7) for q0 in(-0.3,0,0.3)]
    for s0 in starts:
        try:s=LSQ(lambda x:res2(x,f),s0,x_scale=[0.1,0.1,5,5,20])
        except Exception:continue
        if s.x[4]>0 and(best is None or s.cost<best.cost):best=s
    return best
nr=len(rim);nc=2 if 'centre' in S else 0
print(f'{spec}: {nr} rim points, centre {"yes" if nc else "no"}, {len(RINGS)} rings')
rows=[];prev=None
for f in FS:
    s=fit2(f);x=s.x;fu=s.fun;rr=np.sqrt(np.mean(fu[:nr]**2));cm=np.linalg.norm(fu[nr:nr+nc])/WC if nc else 0
    rg=np.sqrt(np.mean(fu[nr+nc:]**2))/3 if RINGS else 0;tilt=np.degrees(np.arccos(abs(Rm(x[0],x[1])[2,2])))
    print(f'f {f:6.0f}: cost {s.cost:8.3f}  rim rms {rr:.3f} mm  centre off {cm:.3f} mm  rings {rg:.3f} mm  tilt {tilt:.1f}  distance {np.linalg.norm(x[2:5]):.0f} mm')
    rows.append((f,s.cost,x))
fb,cb,xb=min(rows,key=lambda r:r[1])
s=LSQ(lambda p:res2(p[1:],p[0]),[fb,*xb],x_scale=[200,0.1,0.1,5,5,20])
J=s.jac;cov=np.linalg.pinv(J.T@J)*(2*s.cost/max(1,len(s.fun)-len(s.x)))
print(f'f free: {s.x[0]:.0f} px (formal sd {np.sqrt(cov[0,0]):.0f}), cost {s.cost:.3f}, tilt {np.degrees(np.arccos(abs(Rm(s.x[1],s.x[2])[2,2]))):.1f}')
if not FS[0]<s.x[0]<FS[-1] or s.x[0]<=FS[0]*1.01:print('  the free fit ran to the edge of the grid: read f from the grid above, where its cost has a clear minimum, or not at all')

# a cut traced on the face: its circle, centre and radius free, at each f (S['cut']: [[u,v],...], S['cut_h']: heights to try)
def circ(Q):
    A_=np.c_[2*Q,np.ones(len(Q))];b=(Q**2).sum(1);s_=np.linalg.lstsq(A_,b,rcond=None)[0];c_=s_[:2];r_=np.sqrt(s_[2]+c_@c_)
    s2=LSQ(lambda p:np.hypot(*(Q-p[:2]).T)-p[2],[*c_,r_]);return s2.x[:2],s2.x[2],np.sqrt(np.mean(s2.fun**2))
if 'cut' in S:
    CUT=np.array(S['cut'],float)
    for f,cst,x in rows:
        out_=[]
        for h in S.get('cut_h',[0,-3.1]):
            Q=unproj(CUT,f,x,h);cc,rc,e=circ(Q);out_.append(f'h {h:+.1f}: r {rc:.2f} (centre {np.hypot(*cc):.2f} from the rim centre, rms {e:.2f})')
        print(f'f {f:6.0f} cost {cst:7.3f}  cut: '+';  '.join(out_))
