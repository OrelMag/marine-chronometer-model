"""A part laid on the blue mat, put in millimetres through a camera fitted to its rim (no browser; opencv-python, scipy).

    python rimfit.py SPEC.json [--f 4000,5000,6000,8000] [--draw OUT.png]

For a frame from tools/video.py frame (in $MC_VIDEO/frames) in which a plate or bridge with a round rim of known radius lies on the blue mat: the
part is segmented from the mat, its outer contour's rim fitted (RANSAC, then a least-squares ellipse), and for each focal length a perspective
camera is fitted so a circle of the rim's radius lands on that contour (the silhouette is whichever of the face's and the far face's edges lies
outer). A rim's arc alone leaves the tilt loose, so round features traced on the frame (settings, counterbores: ellipses with their height
above the face) are made to come out circular. Each picked pixel is then put back on the plane at its height above the face, and the points named
after model arbors turn the whole onto the model's plan (a turn and a shift, or with mirror: a reflection too). Prints the points in the model's
frame for each focal length, the rim's and the rings' residuals, and how far the named points land from the model's.

SPEC: {"frame": "f_...png", "rim": radius mm, "thick": the part's thickness (mm, the far face's edge), "box": [x0,y0,x1,y1] (optional: only the
rim contour inside it), "rings": [[u, v, a, b, angle deg, h], ...] (ellipses traced on the frame: centre, semi-axes, the a axis's angle, height mm),
"points": {"NAME": [u, v, h]} (h: mm above the face, toward the camera), "anchors": {"NAME": [x, z]} (model plan positions of named points),
"mirror": false (the face seen is the plan mirrored), "segment": "blue" or "silver", "edges": [h, h] (the rim's two edges' heights; default
[0, -thick]), "centre": [u, v, h] (a point the rim is centred on), "angle_from": NAME (print angles about the centre from that point), "outline": {"NAME": [[u, v], ...], ...} with "outline_h": {"NAME": h}}.
Examples: rimfit_36-01.json, the upper train bridge upturned with the balance lower bridge on it; rimfit_40-08.json, the pillar plate's dial side in its
mounting ring (the ring's bore, r 40.2, about the centre arbor), the angles of the fusee, barrel and indicator about the centre (References/VIDEOS.md, Methods). About 2 s."""
import json,os,sys,numpy as np,cv2
from scipy.optimize import least_squares
HOME=os.environ.get('MC_VIDEO',os.path.expanduser('~/mc-video'))
a=sys.argv[1:]
if not a or a[0].startswith('-'):sys.exit(__doc__)
S=json.load(open(a[0]));fr=S['frame'] if os.path.isabs(S['frame']) else os.path.join(HOME,'frames',S['frame']);im=cv2.imread(fr);H,W=im.shape[:2]
FS=[float(x) for x in a[a.index('--f')+1].split(',')] if '--f' in a else [4000,5000,6000,8000]
RR,TH=S['rim'],S.get('thick',3.1);EH=S.get('edges',[0,-TH])   # the rim's two edges' heights above the face (a bore's: the face and the ring's top)
# the rim: the part's outer contour against the mat, the points on a fitted ellipse
if S.get('segment','blue')=='silver':   # a silver face inside brass (a plate in its mounting ring): low saturation, bright
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV);m=((hsv[:,:,1]<60)&(hsv[:,:,2]>110)).astype(np.uint8)*255;m=cv2.morphologyEx(cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((15,15),np.uint8)),cv2.MORPH_CLOSE,np.ones((41,41),np.uint8))
else:b,g,r=[im[:,:,i].astype(int) for i in range(3)];m=(~((b-r>60)&(b>120))).astype(np.uint8)*255;m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((9,9),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m);m=((lab==1+np.argmax(st[1:,4]))*255).astype(np.uint8)
c=max(cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0],key=len)[:,0,:].astype(float);c=c[(c[:,1]<H-5)&(c[:,0]>5)&(c[:,0]<W-5)]
if 'box' in S:x0,y0,x1,y1=S['box'];c=c[(c[:,0]>x0)&(c[:,0]<x1)&(c[:,1]>y0)&(c[:,1]<y1)]
def off(e,P):
    (cx,cy),(A,B),ang=e;t=np.radians(ang);R=np.array([[np.cos(t),np.sin(t)],[-np.sin(t),np.cos(t)]]);q=(P-[cx,cy])@R.T;return np.abs(np.hypot(q[:,0]/(A/2),q[:,1]/(B/2))-1)*min(A,B)/2
rng=np.random.default_rng(0);best=None
for _ in range(3000):
    try:e=cv2.fitEllipse(c[rng.choice(len(c),6,replace=False)].astype(np.float32))
    except cv2.error:continue
    if min(e[1])<500:continue
    k=(off(e,c)<4).sum()
    if best is None or k>best[0]:best=(k,e)
rim=c[off(best[1],c)<4];e=cv2.fitEllipse(rim.astype(np.float32));rim=rim[off(e,rim)<4][::8]
def Rm(p,q):
    cp,sp,cq,sq=np.cos(p),np.sin(p),np.cos(q),np.sin(q);return np.array([[1,0,0],[0,cp,-sp],[0,sp,cp]])@np.array([[cq,0,sq],[0,1,0],[-sq,0,cq]])
def unproj(P,f,x,h):   # pixels -> the plane h mm above the face (toward the camera), in the face's own axes
    R=Rm(x[0],x[1]);t=np.array(x[2:5]);nrm=R[:,2];o=t-nrm*h;P=np.atleast_2d(P);d=np.c_[(P[:,0]-W/2)/f,(P[:,1]-H/2)/f,np.ones(len(P))]
    X=d*((o@nrm)/(d@nrm))[:,None]-o;return np.c_[X@R[:,0],X@R[:,1]]
def ellpts(cx,cy,ea,eb,ang):
    t=np.linspace(0,2*np.pi,24,endpoint=False);A=np.radians(ang);return np.c_[cx+ea*np.cos(t)*np.cos(A)-eb*np.sin(t)*np.sin(A),cy+ea*np.cos(t)*np.sin(A)+eb*np.sin(t)*np.cos(A)]
RINGS=[(ellpts(*q[:5]),q[5]) for q in S.get('rings',[])]
def res(x,f):
    out=[np.minimum(np.hypot(*unproj(rim,f,x,EH[0]).T),np.hypot(*unproj(rim,f,x,EH[1]).T))-RR]
    if 'centre' in S:out.append(5*unproj([S['centre'][:2]],f,x,S['centre'][2])[0])   # the rim about the centre arbor
    for P,h in RINGS:Q=unproj(P,f,x,h);rr=np.hypot(*(Q-Q.mean(0)).T);out.append(3*(rr-rr.mean()))
    return np.concatenate(out)
def fit(f):
    best=None
    for p0 in(-0.5,-0.3,0.3,0.5):
        for q0 in(-0.2,0,0.2):
            try:s=least_squares(lambda x:res(x,f),[p0,q0,0,10,f*80/W],x_scale=[0.1,0.1,5,5,20])
            except Exception:continue
            if s.x[4]>0 and(best is None or s.cost<best.cost):best=s
    return best
def turn(A,B,mirror):   # the turn (and reflection) and shift taking A onto B, least squares
    A=A*[1,-1] if mirror else A;ca,cb=A.mean(0),B.mean(0);U,_,Vt=np.linalg.svd((A-ca).T@(B-cb));R=(U@Vt).T
    if np.linalg.det(R)<0:R=(U@np.diag([1,-1])@Vt).T
    return lambda P:((np.atleast_2d(P)*([1,-1] if mirror else [1,1]))-ca)@R.T+cb
out={}
for f in FS:
    s=fit(f);x=s.x;nr=len(rim);rr=np.sqrt(np.mean(s.fun[:nr]**2));rg=np.sqrt(np.mean(s.fun[nr+(2 if 'centre' in S else 0):]**2))/3 if RINGS else 0
    pts={k:unproj([v[:2]],f,x,v[2])[0] for k,v in S.get('points',{}).items()};anc={k:np.array(v) for k,v in S.get('anchors',{}).items() if k in pts}
    T=turn(np.array([pts[k] for k in anc]),np.array(list(anc.values())),S.get('mirror',False)) if len(anc)>=2 else (lambda P:np.atleast_2d(P))
    tilt=np.degrees(np.arccos(abs(Rm(x[0],x[1])[2,2])))
    print(f'f {f:.0f} px: rim rms {rr:.2f} mm over {nr} points, rings {rg:.2f} mm, tilt {tilt:.1f} deg, camera {np.linalg.norm(x[2:5]):.0f} mm')
    a0=np.degrees(np.arctan2(*T(pts[S['angle_from']])[0][::-1])) if S.get('angle_from') in pts else None
    for k,v in pts.items():
        p=T(v)[0];print((f'   angle {((np.degrees(np.arctan2(p[1],p[0]))-a0+180)%360)-180:7.1f} from {S["angle_from"]}' if a0 is not None else '')+f'   {k:10s} ({p[0]:7.2f},{p[1]:7.2f})  r {np.hypot(*p):5.1f}'+(f'   model ({anc[k][0]:.2f},{anc[k][1]:.2f}), off {np.linalg.norm(p-anc[k]):.2f}' if k in anc else ''))
    out[f]={k:np.round(T(unproj(np.array(P,float),f,x,S.get('outline_h',{}).get(k,0))),2).tolist() for k,P in S.get('outline',{}).items()}
    for k,v in out[f].items():print(f'   outline {k}: {json.dumps(v)}')
if '--draw' in a:
    o=im.copy();cv2.ellipse(o,e,(0,0,255),4)
    for q in rim:cv2.circle(o,tuple(int(v) for v in q),6,(0,255,0),-1)
    for P,_ in RINGS:cv2.polylines(o,[P.astype(np.int32)],True,(0,255,255),3)
    for k,v in S.get('points',{}).items():cv2.circle(o,(int(v[0]),int(v[1])),12,(255,0,255),3);cv2.putText(o,k,(int(v[0])+14,int(v[1])),0,1.4,(255,0,255),3)
    for k,P in S.get('outline',{}).items():cv2.polylines(o,[np.array(P,np.int32)],True,(255,255,0),3)
    cv2.imwrite(a[a.index('--draw')+1],o);print('wrote',a[a.index('--draw')+1])
