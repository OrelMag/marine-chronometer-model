"""Model-guided measurement on a photograph or video frame: a pinhole camera fitted to model holes at their real heights, the holes' edges snapped to refine it,
and outlines traced along the real edge, each put back in millimetres at its own height. No browser: the model's places come from JSON (holes.py's tables,
an outline's points), so it runs in a second or two.

    python edgetrace.py SPEC.json [--out DIR]

SPEC (JSON; paths from the SPEC's folder or absolute):
  "frame": the image (a frame from video.py frame in $MC_VIDEO/frames, or any path),
  "holes": {"file": a holes.py table, "y": the face's height in the movement frame (the train bridge's underside -20.66, its top -23.76), "use": [hole names]
            the camera may rest on (places measured elsewhere), "uv": {name: [u, v]} rough picks (at least four, spread; the rest are found through them)},
  "points": {name: {"xyz": [x, y, z], "uv": [u, v]}} more controls at other heights (optional),
  "f": [lo, hi] the focal length's range in pixels (default 1500-12000), "k1": true to fit radial distortion,
  "snap": {"win": px searched either side of each projected hole's edge (default 12), "rounds": 4},
  "outlines": {name: {"mm": [[x, z], ...] the model's outline (closed), or "file": a JSON holding it at "key", "y": its height, "win": px either side
              (default 25), "step": mm between samples (default 0.25), "sign": +1 to want the image brighter outward, -1 darker, 0 either (default 0),
              "smooth": px a sample may move from the last (default 2.5), "keep": [[x0, z0, x1, z1], ...] boxes in mm where the trace counts (the rest is
              hidden or not this edge)}},
  "circles": {name: {"c": [x, y, z], "r": mm, "win": px}} round edges to measure (a screw's head on its face): each's centre and radius found,
  "f_prior": [f0, relative sigma] a soft prior on the focal length (a face seen nearly square-on leaves it loose),
  "face_first": true to fit the face's homography first (picks, then holes snapped through it) and the camera to what snapped,
  "detect": true to register the model's holes on the image's round edges found automatically (detect_ellipses), from the picks' camera.

The camera: x = K [R | t] X, X in the movement frame (mm; dial side +y, 12 o'clock -z, 3 o'clock +x), K with the principal point at the image's centre
(and k1 if asked). Fitted by least squares from a homography on the face's picks (each focal length in the range tried, the best kept), then the holes
snapped: each hole's circle projected, the strongest edge found along the ellipse's normals within "win", the hole's offset and size fitted to those
edges robustly; its centre then counts as a control, a hole that won't snap cleanly (a pin in it, a shadow) left out; the camera refitted on all; repeated.
Each hole's residual is printed in px and mm. An outline is sampled every "step" mm, each sample's normal projected, the image's gradient along it within
"win" scored, and the path through the samples chosen by dynamic programming (each step may move at most "smooth" px along its normal from the last), so
texture and clutter can't drag single points off; the path's pixels go back onto the plane at "y". Writes et_NAME.json (camera, holes, outlines in px and
mm with each sample's offset from the model and its edge strength) and et_NAME_*.png (the frame with the model in magenta, the snapped holes and traced
edges in green; a close-up per outline). Say what each measured line rests on and how sure it is (CLAUDE.md, Build from measured lines).

Snapping keeps the top three edge candidates on each normal and lets a RANSAC over (centre shift, change of radius) choose the ring most normals agree on,
so a countersink and its bore are not mixed; a hole is accepted when most of its normals agree (share), they lie on one ring (rms) and its inside differs
from the face round it (contrast). Proved on KLUwI2UUCMQ 23:30 (19 October 2026: the notch round the fusee traced to -0.03..+0.07 mm median of r 16.72 about
L.Fu, the holes snapped within 0.05-0.35 mm of their places measured on two frames). Limits: a dark stripe across a small hole can pass for it (a snap
confirms a hole, it does not prove one absent); on frames the restoration video crops or zooms (13:49.5, 36:01) a centred principal point does not fit, and
the camera is then loose for anything off the face; "pp": true frees the principal point (with "pp0", "pp_prior" px), "k1": true radial distortion, "points" add controls off the face (a setting on a part standing on it), and "probes": {name: {"uv", "y", "ref"}} read image points back at a height. A frame no single pinhole fits (a stabilised or zoomed shot) shows as controls at different heights that won't agree at any focal length: say so rather than reading through it. About 1-3 s a run."""
import json,os,sys,pathlib
import numpy as np,cv2
from scipy.optimize import least_squares

def load(p,base):
    p=pathlib.Path(p)
    if not p.is_absolute():p=base/p
    return p
def frame_path(f,base):
    p=pathlib.Path(f)
    if p.is_absolute() and p.exists():return p
    if (base/p).exists():return base/p
    v=pathlib.Path(os.environ.get('MC_VIDEO',os.path.expanduser('~/mc-video')))/'frames'/p.name
    return v

class Cam:
    """pinhole: params [rx, ry, rz, tx, ty, tz, f] then [cx, cy] if pp (the principal point, for a frame cropped or zoomed: its centre otherwise) then [k1] if k1"""
    def __init__(s,W,H,k1=False,pp=False):s.W,s.H,s.k1,s.pp=W,H,k1,pp
    def K(s,p):
        f=p[6];cx,cy=(p[7],p[8]) if s.pp else (s.W/2,s.H/2);return np.array([[f,0,cx],[0,f,cy],[0,0,1.0]])
    def dist(s,p):return np.array([p[-1],0,0,0]) if s.k1 else np.zeros(4)
    def proj(s,p,X):
        X=np.atleast_2d(np.asarray(X,float));u,_=cv2.projectPoints(X.reshape(-1,1,3),np.asarray(p[:3],float),np.asarray(p[3:6],float),s.K(p),s.dist(p));return u.reshape(-1,2)
    def ray(s,p,uv):
        uv=np.atleast_2d(np.asarray(uv,float));n=cv2.undistortPoints(uv.reshape(-1,1,2),s.K(p),s.dist(p)).reshape(-1,2);R,_=cv2.Rodrigues(np.asarray(p[:3],float));t=np.asarray(p[3:6],float)
        C=-R.T@t;D=(R.T@np.c_[n,np.ones(len(n))].T).T;return C,D
    def onplane(s,p,uv,y):
        C,D=s.ray(p,uv);lam=(y-C[1])/D[:,1];return C+lam[:,None]*D
    def depth(s,p,X):
        R,_=cv2.Rodrigues(np.asarray(p[:3],float));return (R@np.atleast_2d(X).T).T[:,2]+p[5]

class HCam:
    """the face's homography standing in for a camera (proj and onplane of points on the face; their y is ignored)"""
    def __init__(s,H):s.H=np.asarray(H,float);s.Hi=np.linalg.inv(s.H)
    def proj(s,p,X):X=np.atleast_2d(np.asarray(X,float));return cv2.perspectiveTransform(X[:,[0,2]].reshape(-1,1,2),s.H).reshape(-1,2)
    def onplane(s,p,uv,y):Q=cv2.perspectiveTransform(np.atleast_2d(np.asarray(uv,float)).reshape(-1,1,2),s.Hi).reshape(-1,2);return np.c_[Q[:,0],np.full(len(Q),y),Q[:,1]]

def robust_H(X,U,thr=4.0):
    """a homography on face controls, controls off by more than thr px (and 3x the median) left out one at a time"""
    keep=np.ones(len(X),bool)
    while True:
        H,_=cv2.findHomography(X[keep],U[keep],0);e=np.hypot(*(cv2.perspectiveTransform(X.reshape(-1,1,2),H).reshape(-1,2)-U).T)
        bad=np.where(keep&(e>max(thr,3*np.median(e[keep]))))[0]
        if not len(bad) or keep.sum()<=5:return H,keep,e
        keep[bad[np.argmax(e[bad])]]=False

def fit_cam(cam,X,U,p0,w=None,fix_f=None,fprior=None,ppprior=None):
    """least squares (soft L1) of the reprojection; fprior (f0, relative sigma) and ppprior (sigma px, about the frame's centre) as soft priors"""
    w=np.ones(len(X)) if w is None else np.asarray(w)
    def res(q):
        r=((cam.proj(q,X)-U)*w[:,None]).ravel();ex=[]
        if fprior:ex.append((np.log(abs(q[6])/fprior[0])/fprior[1])*np.sqrt(len(X)))
        if cam.pp and ppprior:ex+=[(q[7]-cam.W/2)/ppprior,(q[8]-cam.H/2)/ppprior]
        return np.r_[r,ex]
    return least_squares(res,np.asarray(p0,float),loss='soft_l1',f_scale=2.0).x

def init_cam(cam,Xf,Uf,frange,pp0=None):
    """solvePnP at each focal length (IPPE for points on one plane, SQPnP otherwise; the principal point at pp0 or the centre), the least reprojection error kept"""
    best=None;planar=np.ptp(Xf[:,1])<1e-6
    for f in np.geomspace(frange[0],frange[1],40):
        q=np.r_[np.zeros(6),f,list(pp0 if pp0 is not None else (cam.W/2,cam.H/2)) if cam.pp else [],[0.0] if cam.k1 else []];K=cam.K(q)
        try:ok,rv,tv=cv2.solvePnP(Xf.reshape(-1,1,3),Uf.reshape(-1,1,2),K,np.zeros(4),flags=cv2.SOLVEPNP_IPPE if (planar and len(Xf)>=4) else cv2.SOLVEPNP_SQPNP)
        except cv2.error:continue
        if not ok:continue
        q[:3]=rv.ravel();q[3:6]=tv.ravel();e=np.sqrt(np.mean(np.sum((cam.proj(q,Xf)-Uf)**2,1)))
        if best is None or e<best[0]:best=(e,q)
    return best[1]

def detect_ellipses(img,rmin=6,rmax=90):
    """every closed, round edge in the image: Canny at two scales, contours, an ellipse fitted to each and kept if its points lie on it (median 0.8 px) and it is
    round enough (axes within 3:1); concentric ones (a countersink and its bore) merged by centre. Returns [(cx, cy, a, b, angle, score)]"""
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY);out=[]
    for blur,lo,hi in((1.5,30,90),(2.5,20,60)):
        e=cv2.Canny(cv2.GaussianBlur(g,(0,0),blur),lo,hi);cs,_=cv2.findContours(e,cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
        for c in cs:
            if len(c)<25:continue
            (cx,cy),(A,B),ang=cv2.fitEllipse(c);a_,b_=max(A,B)/2,min(A,B)/2
            if not(rmin<=a_<=rmax) or b_<a_/3:continue
            P=c.reshape(-1,2).astype(float)-[cx,cy];t=np.radians(ang);Rr=np.array([[np.cos(t),np.sin(t)],[-np.sin(t),np.cos(t)]]);Q=P@Rr.T
            d=np.abs(np.hypot(Q[:,0]/(A/2),Q[:,1]/(B/2))-1)*b_
            span=np.ptp(np.unwrap(np.arctan2(Q[:,1]*A,Q[:,0]*B)))
            if np.median(d)>0.8 or span<4.5:continue
            out.append((cx,cy,a_,b_,ang,len(c)/(1+np.median(d))))
    out.sort(key=lambda e:-e[5]);keep=[]
    for e in out:
        if all(np.hypot(e[0]-k[0],e[1]-k[1])>max(3,0.25*min(e[3],k[3])) for k in keep):keep.append(e)
    return keep

def register(cam,p,X,names,D,rads=(60,35,20,12,8,6),fprior=None,extraX=None,extraU=None):
    """the model's holes (X, names) matched to detected ellipses D, the camera refitted on the matches, the match radius shrinking: an ICP on circles"""
    Dc=np.array([[e[0],e[1]] for e in D]);match={}
    for rad in rads:
        U=cam.proj(p,X);match={}
        for i,u in enumerate(U):
            d=np.hypot(*(Dc-u).T);j=d.argmin()
            if d[j]<rad:match[names[i]]=(i,j,d[j])
        if len(match)<5:break
        I=[m[0] for m in match.values()];J=[m[1] for m in match.values()]
        Xm=np.r_[X[I],extraX] if extraX is not None and len(extraX) else X[I];Um=np.r_[Dc[J],extraU] if extraU is not None and len(extraU) else Dc[J]
        p=fit_cam(cam,Xm,Um,p,fprior=fprior);e=np.hypot(*(cam.proj(p,X[I])-Dc[J]).T)
        print(f'  register within {rad} px: {len(match)} holes matched, rms {np.sqrt(np.mean(e**2)):.2f} px, median {np.median(e):.2f}, f {p[6]:.0f}')
    return p,match

def grad_img(img):
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY).astype(np.float32);g=cv2.GaussianBlur(g,(0,0),1.2)
    return g,cv2.Sobel(g,cv2.CV_32F,1,0,ksize=3),cv2.Sobel(g,cv2.CV_32F,0,1,ksize=3)
def sample(a,P):
    P=np.asarray(P,np.float32);return cv2.remap(a,P[...,0],P[...,1],cv2.INTER_LINEAR,borderValue=0)

def snap_circle(cam,p,G,c,r,axis_y,win,n=96,sign=0,rng=np.random.default_rng(1)):
    """a round edge of radius r about c (in the plane y = c[1]). Along each projected normal (within win px) the top few edge candidates (local maxima of
    the gradient across it); then a RANSAC over (centre shift, change of radius) picks the one ring most normals agree on, so a countersink and its bore
    (two concentric edges) aren't mixed; least squares on its inliers. Returns (uv of the centre, mm centre on its plane, r found, share of normals on it,
    rms px, contrast of its inside against the face round it, the edge points) or None"""
    g,gx,gy=G;th=np.linspace(0,2*np.pi,n,endpoint=False);d=np.c_[np.cos(th),np.zeros(n),np.sin(th)]
    E=cam.proj(p,c+r*d);E2=cam.proj(p,c+(r+0.05)*d);N=E2-E;N/=np.linalg.norm(N,axis=1)[:,None]
    m=np.linalg.norm(cam.proj(p,c+(r+1.0)*d)-E,axis=1)   # px a mm of radius moves the edge, round it
    ts=np.arange(-win,win+0.5,0.5);P=E[:,None,:]+ts[None,:,None]*N[:,None,:]
    gn=sample(gx,P)*N[:,None,0]+sample(gy,P)*N[:,None,1];sc=gn*sign if sign else np.abs(gn)
    thr=max(4.0,np.percentile(sc,75))
    cand=[]   # per normal: up to 3 local maxima above thr, as offsets (px)
    for i in range(n):
        v=sc[i];k=np.where((v[1:-1]>=v[:-2])&(v[1:-1]>=v[2:])&(v[1:-1]>thr))[0]+1;k=k[np.argsort(-v[k])][:3];cand.append(ts[k])
    have=[i for i in range(n) if len(cand[i])]
    if len(have)<n*0.35:return None
    A=np.c_[N,m];best=None
    def support(sol):
        pred=A@sol;inl=np.zeros(n,bool);off=np.zeros(n)
        for i in have:
            dd=np.abs(cand[i]-pred[i]);j=dd.argmin()
            if dd[j]<1.5:inl[i]=True;off[i]=cand[i][j]
        return inl,off
    for _ in range(300):
        q=rng.choice(have,3,replace=False);o=np.array([rng.choice(cand[i]) for i in q])
        try:sol=np.linalg.solve(A[q],o)
        except np.linalg.LinAlgError:continue
        if abs(sol[2])*m.mean()>win:continue
        inl,off=support(sol);sc_=inl.sum()-0.15*abs(sol[2])*m.mean()   # the ring nearest the expected size wins a tie
        if best is None or sc_>best[0]:best=(sc_,sol,inl,off)
    if best is None:return None
    _,sol,inl,off=best
    for _ in range(3):
        sol,*_=np.linalg.lstsq(A[inl],off[inl],rcond=None);inl,off=support(sol)
        if inl.sum()<6:return None
    res=A[inl]@sol-off[inl]
    uv=cam.proj(p,c)[0]+sol[:2];X=cam.onplane(p,uv,c[1])[0];rr=r+sol[2]
    ci=np.array([X[0],c[1],X[2]]);inn=sample(g,cam.proj(p,ci+0.55*rr*d)[None])[0];ring=sample(g,cam.proj(p,ci+(rr+min(0.6,0.5*rr+0.15))*d)[None])[0]
    contrast=float(abs(np.median(inn)-np.median(ring)))   # a real hole's inside differs from the face round it; a stripe or scratch doesn't, all round
    return dict(uv=uv,mm=[X[0],X[2]],r=rr,share=float(inl.mean()),rms=float(np.sqrt(np.mean(res**2))),contrast=contrast,edge=(E+off[:,None]*N)[inl])

def trace(cam,p,G,poly,y,win=25,step=0.25,sign=0,smooth=2.5,closed=True):
    g,gx,gy=G;P=np.asarray(poly,float)
    Q=np.r_[P,P[:1]] if closed else P;s=np.r_[0,np.cumsum(np.hypot(*np.diff(Q,axis=0).T))];t=np.arange(0,s[-1],step)
    M=np.c_[np.interp(t,s,Q[:,0]),np.interp(t,s,Q[:,1])];T=np.gradient(M,axis=0);T/=np.linalg.norm(T,axis=1)[:,None];Nm=np.c_[T[:,1],-T[:,0]]
    # outward normal: the side the polygon's area isn't on
    area=0.5*np.sum(P[:,0]*np.roll(P[:,1],-1)-np.roll(P[:,0],-1)*P[:,1]);Nm*=(-1 if area>0 else 1) if closed else 1
    X=np.c_[M[:,0],np.full(len(M),y),M[:,1]];X2=np.c_[M[:,0]+0.05*Nm[:,0],np.full(len(M),y),M[:,1]+0.05*Nm[:,1]]
    E=cam.proj(p,X);N=cam.proj(p,X2)-E;N/=np.linalg.norm(N,axis=1)[:,None]
    ts=np.arange(-win,win+0.5,0.5);PP=E[:,None,:]+ts[None,:,None]*N[:,None,:]
    gn=sample(gx,PP)*N[:,None,0]+sample(gy,PP)*N[:,None,1];sc=gn*sign if sign else np.abs(gn)
    sc=np.clip(sc,0,None);sc/=np.percentile(sc,99)+1e-6
    # dynamic programming: maximise the summed edge strength, each step moving at most smooth px along the normal
    n,m=sc.shape;J=int(round(smooth/0.5));cost=sc[0].copy();back=np.zeros((n,m),int)
    for i in range(1,n):
        best=np.full(m,-1e9);arg=np.zeros(m,int)
        for dj in range(-J,J+1):
            sh=np.roll(cost,dj);
            if dj>0:sh[:dj]=-1e9
            elif dj<0:sh[dj:]=-1e9
            pen=sh-0.02*abs(dj);upd=pen>best;best[upd]=pen[upd];arg[upd]=(np.arange(m)-dj)[upd]
        cost=best+sc[i];back[i]=arg
    k=np.zeros(n,int);k[-1]=cost.argmax()
    for i in range(n-1,0,-1):k[i-1]=back[i,k[i]]
    U=E+ts[k][:,None]*N;S=sc[np.arange(n),k];W=cam.onplane(p,U,y)
    return dict(model_mm=M,px=U,mm=np.c_[W[:,0],W[:,2]],off_px=ts[k],off_mm=np.sum((np.c_[W[:,0],W[:,2]]-M)*Nm,1),strength=S,normal_mm=Nm,model_px=E)

def main():
    a=sys.argv[1:]
    if not a:sys.exit(__doc__)
    SP=pathlib.Path(a[0]).resolve();base=SP.parent;S=json.loads(SP.read_text(encoding='utf-8'));name=SP.stem
    out=pathlib.Path(a[a.index('--out')+1]) if '--out' in a else pathlib.Path.cwd()
    img=cv2.imread(str(frame_path(S['frame'],base)));assert img is not None,S['frame'];H,W=img.shape[:2];G=grad_img(img)
    cam=Cam(W,H,S.get('k1',False),bool(S.get('pp')));hs=S['holes'];HT=json.load(open(load(hs['file'],base)))['holes'];yF=hs['y'];use=hs.get('use',list(hs.get('uv',{})))
    X3=lambda n:np.array([HT[n][0],yF,HT[n][1]])
    picks={n:np.array(v,float) for n,v in hs.get('uv',{}).items()}
    Xp=np.array([X3(n) for n in picks]).reshape(-1,3);Up=np.array(list(picks.values()),float).reshape(-1,2)
    PP0=S.get('pp0');p=init_cam(cam,Xp,Up,S.get('f',[1500,12000]),PP0) if len(Xp)>=4 else None   # with no picks on the face, the camera starts from the points alone
    extra=S.get('points',{});Xe=np.array([v['xyz'] for v in extra.values()]) if extra else np.zeros((0,3));Ue=np.array([v['uv'] for v in extra.values()]) if extra else np.zeros((0,2))
    FP=tuple(S['f_prior']) if S.get('f_prior') else None;PPP=S.get('pp_prior')
    if len(Xe):p=init_cam(cam,np.r_[Xp,Xe],np.r_[Up,Ue],S.get('f',[1500,12000]),PP0)   # all the controls, at their heights
    assert p is not None,'no camera: give four or more picks or points'
    p=fit_cam(cam,np.r_[Xp,Xe],np.r_[Up,Ue],p,fprior=FP,ppprior=PPP)
    if S.get('face_first'):   # the face's homography first: picks, then holes snapped through it, coarse to fine; the camera is then fitted to all that snapped
        Xf=np.array([[HT[n][0],HT[n][1]] for n in picks]);Hh,kp,e=robust_H(Xf,Up);print('face homography on the picks:',dict(zip(picks,e.round(1))),'left out',[n for n,k in zip(picks,kp) if not k])
        hc=HCam(Hh);sw=S.get('snap',{}).get('win',12)
        for wr in(sw*3,sw*2,sw,sw,sw):
            sn_={}
            for n in HT:
                c=X3(n);u0=hc.proj(None,c)[0]
                if not(0<u0[0]<W and 0<u0[1]<H):continue
                o=snap_circle(hc,None,G,c,HT[n][2],True,wr)
                tr=n in use
                if o and abs(o['r']-HT[n][2])<max(0.3,0.35*HT[n][2]) and o['share']>=(0.5 if tr else 0.75) and o['rms']<=(2.5 if tr else 1.6) and o['contrast']>=(8 if tr else 18):sn_[n]=o
            Cn=[n for n in use if n in sn_]+[n for n in picks if n not in sn_ and n in use]
            Xs=np.array([[HT[n][0],HT[n][1]] for n in Cn]);Us=np.array([sn_[n]['uv'] if n in sn_ else picks[n] for n in Cn])
            Hh,kp,e=robust_H(Xs,Us);hc=HCam(Hh)
            print(f'face, window {wr} px: {len(sn_)} holes snapped, {kp.sum()} of {len(Cn)} trusted controls kept, rms {np.sqrt(np.mean(e[kp]**2)):.2f} px; left out {[n for n,k in zip(Cn,kp) if not k]}')
        picks={n:np.asarray(sn_[n]['uv'] if n in sn_ else picks[n],float) for n,k in zip(Cn,kp) if k}
        Xp=np.array([X3(n) for n in picks]);Up=np.array(list(picks.values()))
        p=init_cam(cam,np.r_[Xp,Xe] if len(Xe) else Xp,np.r_[Up,Ue] if len(Xe) else Up,S.get('f',[1500,12000]),PP0)
        p=fit_cam(cam,np.r_[Xp,Xe],np.r_[Up,Ue],p,fprior=FP,ppprior=PPP)
        e=np.hypot(*(cam.proj(p,Xp)-Up).T);print(f'camera on the face stage controls ({len(Xp)}) controls: rms {np.sqrt(np.mean(e**2)):.2f} px, f {p[6]:.0f}')
    if S.get('detect'):   # automatic registration on the image's round edges (detect_ellipses, register), from the picks' rough camera
        D=detect_ellipses(img);print(f'{len(D)} round edges detected')
        T=[n for n in use];p,M=register(cam,p,np.array([X3(n) for n in T]),T,D,fprior=FP,extraX=Xe,extraU=Ue)
        vd=img.copy()
        for e in D:cv2.ellipse(vd,((e[0],e[1]),(2*e[2],2*e[3]),e[4]),(0,200,255),1)
        for n,(i,j,d) in M.items():cv2.putText(vd,n,(int(D[j][0])+6,int(D[j][1])-6),0,0.7,(0,255,0),2)
        cv2.imwrite(str(out/f'et_{name}_detect.png'),cv2.resize(vd,None,fx=0.5,fy=0.5) if W>2500 else vd)
    sn=S.get('snap',{});win=sn.get('win',12);snapped={}
    NR=sn.get('rounds',4);sched=[win*3,win*2]+[win]*max(1,NR-2)
    for rd in range(len(sched)):   # coarse to fine: wide windows while the camera is rough, then the hole's own
        snapped={};wr=sched[rd]
        for n in HT:
            r=HT[n][2];c=X3(n);u0=cam.proj(p,c)[0]
            if not(0<u0[0]<W and 0<u0[1]<H):continue
            o=snap_circle(cam,p,G,c,r,True,wr)
            tr=n in use;ok=o and abs(o['r']-r)<max(0.3,0.35*r) and (o['share']>=(0.5 if tr else sn.get('share',0.75)) and o['rms']<=(2.5 if tr else sn.get('rms',1.6)) and o['contrast']>=(8 if tr else sn.get('contrast',18)))
            if ok:snapped[n]=o   # a trusted hole (its place measured elsewhere) is accepted on looser terms: it is a control, not a finding
        C=[n for n in use if n in snapped or n in picks]   # a trusted hole that won't snap counts by its pick
        Xc=np.array([X3(n) for n in C]).reshape(-1,3);Uc=np.array([snapped[n]['uv'] if n in snapped else picks[n] for n in C],float).reshape(-1,2)
        print(f'round {rd} (window {wr} px): {sum(n in snapped for n in C)} of {len(C)} trusted holes snapped, {len(snapped)} holes in all')
        keepc=np.ones(len(Xc),bool)
        if not len(Xc):p=fit_cam(cam,Xe,Ue,p,fprior=FP,ppprior=PPP);continue   # no face controls: the points alone
        for _ in range(3):   # controls far off when the rest agree (a rough pick, a hole snapped to the wrong ring) are left out
            p=fit_cam(cam,np.r_[Xc[keepc],Xe],np.r_[Uc[keepc],Ue],p,fprior=FP,ppprior=PPP);e=np.hypot(*(cam.proj(p,Xc)-Uc).T)
            bad=keepc&(e>max(4.0,3*np.median(e[keepc])))
            if not bad.any() or keepc.sum()-bad.sum()<5:break
            keepc&=~bad;print('   left out:',[C[i] for i in np.where(bad)[0]],'off',e[bad].round(1),'px')
        e=e[keepc];print(f'round {rd}: camera on {len(C)} snapped holes, rms {np.sqrt(np.mean(e**2)):.2f} px, f {p[6]:.0f}')
    mmpx=lambda X:1/np.linalg.norm(cam.proj(p,X+[0.5,0,0])-cam.proj(p,X-[0.5,0,0]))
    R={'frame':str(S['frame']),'camera':{'p':[float(v) for v in p],'pp':cam.pp,'k1':cam.k1,'rvec':p[:3].tolist(),'tvec':p[3:6].tolist(),'f':float(p[6]),'W':W,'H':H},'holes':{},'outlines':{},'circles':{}}
    print(f'camera: f {p[6]:.0f} px, distance {np.linalg.norm(-cv2.Rodrigues(p[:3])[0].T@p[3:6]):.0f} mm'+(f', principal point {p[7]-W/2:+.0f}, {p[8]-H/2:+.0f} px from the centre' if cam.pp else ''))
    if len(Xe):
        ee=np.hypot(*(cam.proj(p,Xe)-Ue).T)
        for nm,v in zip(extra,ee):print(f'   point {nm}: {v:.1f} px')
    print('hole   model (x, z)        r    | snapped (x, z)         r     shift mm  edge share  rms px  contrast')
    for n in HT:
        if n not in snapped:continue
        o=snapped[n];x,z,r=HT[n];d=np.hypot(o['mm'][0]-x,o['mm'][1]-z)
        R['holes'][n]={'model':[x,z,r],'mm':[round(o['mm'][0],3),round(o['mm'][1],3)],'r':round(o['r'],3),'shift_mm':round(d,3),'share':round(o['share'],2),'rms_px':round(o['rms'],2),'contrast':round(o['contrast'],1),'uv':o['uv'].round(2).tolist(),'used':n in use}
        print(f'{n:5s} ({x:7.2f},{z:7.2f}) {r:4.2f} | ({o["mm"][0]:7.2f},{o["mm"][1]:7.2f}) {o["r"]:5.2f}  {d:6.2f}    {o["share"]:.2f}      {o["rms"]:.2f}  {o["contrast"]:5.0f}  {"used" if n in use else ""}')
    vis=img.copy()
    for n,(x,z,r) in HT.items():
        th=np.linspace(0,2*np.pi,60);q=cam.proj(p,np.c_[x+r*np.cos(th),np.full(60,yF),z+r*np.sin(th)]);cv2.polylines(vis,[q.astype(np.int32)],True,(255,0,255),1)
        if n in snapped:
            for e in snapped[n]['edge']:cv2.circle(vis,(int(e[0]),int(e[1])),1,(0,255,0),-1)
            cv2.putText(vis,n,tuple(int(v)+8 for v in snapped[n]['uv']),0,0.6,(0,255,255),1)
    for on,ol in S.get('outlines',{}).items():
        if 'mm' in ol:poly=ol['mm']
        elif 'js' in ol:   # an outline constant in movement.js: {"file": path, "const": "LB_UP", "index": 0}
            src=open(load(ol['js']['file'],base),encoding='utf8').read();i=src.index('const '+ol['js']['const']+'=')+len('const '+ol['js']['const']+'=');dep=0
            for j,ch in enumerate(src[i:]):
                dep+=ch=='[';dep-=ch==']'
                if dep==0:break
            poly=json.loads(src[i:i+j+1]);poly=poly[ol['js']['index']] if 'index' in ol['js'] else poly
        else:poly=json.load(open(load(ol['file'],base)))[ol['key']]
        tr=trace(cam,p,G,poly,ol['y'],ol.get('win',25),ol.get('step',0.25),ol.get('sign',0),ol.get('smooth',2.5),ol.get('closed',True))
        keep=np.ones(len(tr['mm']),bool)
        if ol.get('keep'):
            keep[:]=False
            for x0,z0,x1,z1 in ol['keep']:M=tr['model_mm'];keep|=(M[:,0]>=min(x0,x1))&(M[:,0]<=max(x0,x1))&(M[:,1]>=min(z0,z1))&(M[:,1]<=max(z0,z1))
        R['outlines'][on]={'y':ol['y'],'mm':tr['mm'].round(3).tolist(),'model_mm':tr['model_mm'].round(3).tolist(),'off_mm':tr['off_mm'].round(3).tolist(),'strength':tr['strength'].round(3).tolist(),'keep':keep.tolist(),'px':tr['px'].round(1).tolist()}
        k=keep&(tr['strength']>0.15);om=tr['off_mm'][k]
        print(f'outline {on} (y {ol["y"]}): {k.sum()}/{len(k)} samples kept; offset from the model, outward +: median {np.median(om):+.2f} mm, 10-90% {np.percentile(om,10):+.2f}..{np.percentile(om,90):+.2f}')
        cv2.polylines(vis,[tr['model_px'].astype(np.int32)],ol.get('closed',True),(255,0,255),1)
        for q,kk in zip(tr['px'],k):cv2.circle(vis,(int(q[0]),int(q[1])),2,(0,255,0) if kk else (0,140,255),-1)
        x0,y0=tr['px'].min(0).astype(int)-60;x1,y1=tr['px'].max(0).astype(int)+60;cv2.imwrite(str(out/f'et_{name}_{on}.png'),vis[max(0,y0):y1,max(0,x0):x1])
    for cn,cc in S.get('circles',{}).items():
        o=snap_circle(cam,p,G,np.array(cc['c'],float),cc['r'],True,cc.get('win',15))
        if o:R['circles'][cn]={'mm':[round(o['mm'][0],3),round(o['mm'][1],3)],'r':round(o['r'],3),'share':round(o['share'],2),'rms_px':round(o['rms'],2)};print(f'circle {cn}: ({o["mm"][0]:.2f}, {o["mm"][1]:.2f}) r {o["r"]:.2f} (model {cc["c"][0]}, {cc["c"][2]} r {cc["r"]}), {o["share"]:.2f} of its edge, {o["rms"]:.2f} px')
        else:print(f'circle {cn}: no clean edge')
    R['probes']={}
    for pn,pv in S.get('probes',{}).items():   # image points read back at a height: {"uv": [u, v], "y": movement y}, through the final camera and, for comparison, at the focal lengths given
        X=cam.onplane(p,np.array(pv['uv'],float),pv['y'])[0];R['probes'][pn]={'mm':[round(X[0],3),round(X[2],3)]}
        line=f'probe {pn} (y {pv["y"]}): ({X[0]:.2f}, {X[2]:.2f})'
        if 'ref' in pv:line+=f', {np.hypot(X[0]-pv["ref"][0],X[2]-pv["ref"][1]):.2f} from {pv["ref"]}'
        print(line)
    cv2.imwrite(str(out/f'et_{name}.png'),cv2.resize(vis,None,fx=0.5,fy=0.5) if W>2500 else vis)
    json.dump(R,open(out/f'et_{name}.json','w'),indent=1)
if __name__=='__main__':main()
