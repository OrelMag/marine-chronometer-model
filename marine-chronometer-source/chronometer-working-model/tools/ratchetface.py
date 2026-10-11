"""A ratchet's teeth read off a video frame: their depth and how their locking faces lie against the radius, calibrated on synthetic frames.
No browser; opencv-python, numpy (matplotlib for --fold). Frames from video.py frame, in $MC_VIDEO (never committed).

  python ratchetface.py FRAME --box x0 y0 x1 y1 --c cx cy [--arc a0 a1] [--rc R] [--thr V] [--z 42] [--ro 7.05] [--sigma s ...] [--fold OUT.png]

The wheel must stand dark against a lighter ground over the arc used (image angles a0..a1 in degrees, atan2(y, x) about the guessed centre
cx, cy, y down; default the upper half; a0 > a1 for an arc through 180), as the setup ratchet does held loose over the plate (KLUwI2UUCMQ 38:25.8, 38:26.0). Its outline at
level V (HSV value, default 90) is traced on a 4x upsampled crop of the box (the dark region round the centre, cut off at R px from it, so
dark ground beyond the tips doesn't join it); its tips (the farthest point in each pitch) fitted by an ellipse, dropping those off it by more
than 1 %, and the outline mapped through it onto a circle of radius RO mm (an affine map: perspective across the wheel is left out). Each
gap's depth is its tips' mean radius less its root's; each face (the steeper side of a tooth, found by vote) is fitted as a line between 25
and 75 % of the depth and its angle to the radius taken, + where it leans back (its root farther from its own tooth's back than its tip:
the load then pushes the pawl out), - undercut. The frame's blur is read off the edges (the 10-90 % rise across the backs, upper right).

The readings are biased by that blur, so the same is done on synthetic frames: the wheel drawn with the frame's own ellipse, Z teeth on RO,
each tooth a triangle on the root circle (its back the chord from the root to its tip, at 0.97 of the pitch as gearGeo draws, its
face to the next root, leaning back or undercut by a known angle), at a known depth, blurred by a Gaussian of
each sigma given (default: the frame's, from its edge width, and one either side) with noise. A blurred V-shaped gap reads shallower and
its face leaning back (the root pulled into the gap): at sigma 4 and teeth 0.5 deep, radial reads +1.9 deg and 0.5 reads 0.395. The tool
prints, for each sigma, the depth and lean that read as the frame's; --fold draws the frame's teeth folded onto one tooth against the
synthetic ones (the frame's arc only, teeth near its middle, where the wheel's thickness hides its other face's outline).

Setup ratchet, 11 October 2026 (References/VIDEOS.md, "Setup ratchet's teeth"): 38:26.0 --box 1650 400 2850 1400 --c 2260 960 --rc 430,
38:25.8 the same with --c 2287 912: edges 12.75 px (sigma 4); gaps 0.386 and 0.427 read, 0.49-0.54 mm true (0.53-0.58 at sigma 5); faces
-2.5 and -5.6 deg (median), radial or undercut a few degrees (radial reads +1.9, leaning back 6 deg +7.1). About 2 s a frame, 10 s with the
calibration."""
import sys,math,argparse,numpy as np,cv2

def outline(V,box,c,arc,thr,rc,U=4):
    """the dark wheel's outline (px, frame), over the arc, ordered by angle about c"""
    x0,y0,x1,y1=box;cx,cy=c;Vc=V[y0:y1,x0:x1].astype(np.float32)
    dark=(cv2.resize(Vc,None,fx=U,fy=U,interpolation=cv2.INTER_CUBIC)<thr).astype(np.uint8)
    dark=cv2.morphologyEx(dark,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    yy,xx=np.mgrid[0:dark.shape[0],0:dark.shape[1]];dark[np.hypot(xx/U+x0-cx,yy/U+y0-cy)>rc]=0
    _,lab=cv2.connectedComponents(dark)
    ring=[lab[int((cy+0.7*rc*math.sin(q)-y0)*U),int((cx+0.7*rc*math.cos(q)-x0)*U)] for q in np.linspace(0,2*math.pi,180)];ring=[v for v in ring if v>0]
    w=cv2.morphologyEx((lab==max(set(ring),key=ring.count)).astype(np.uint8),cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
    cs,_=cv2.findContours(w,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE);C=max(cs,key=len)[:,0,:].astype(float)/U+[x0,y0]+(0.5/U-0.5)
    th=np.degrees(np.arctan2(C[:,1]-cy,C[:,0]-cx))
    if arc[0]>arc[1]:th=np.where(th<arc[0],th+360,th);arc=(arc[0],arc[1]+360)   # an arc through 180 deg (a0 > a1): angles past it carried on
    k=(th>arc[0])&(th<arc[1]);C,th=C[k],th[k];o=np.argsort(th);return C[o],th[o]

def analyse(C,th,c,z,ro_mm):
    cx,cy=c;r=np.hypot(C[:,0]-cx,C[:,1]-cy);pd=360/z;tips=[]
    for i in range(len(C)):
        if r[i]>=r[abs(th-th[i])<pd/2].max() and (not tips or th[i]-th[tips[-1]]>pd/2):tips.append(i)
    T=C[tips].astype(np.float32);keep=np.ones(len(T),bool)
    for _ in range(5):
        (ex,ey),(A,B),ephi=cv2.fitEllipse(T[keep]);ea,eb=A/2,B/2;ph=math.radians(ephi);Rm=np.array([[math.cos(ph),math.sin(ph)],[-math.sin(ph),math.cos(ph)]])
        rn=np.array([np.hypot(*((Rm@np.array([x-ex,y-ey]))/np.array([ea,eb]))) for x,y in T]);keep=abs(rn-1)<0.01
    Q=np.array([(Rm@np.array([x-ex,y-ey]))/np.array([ea,eb])*ro_mm for x,y in C]);rr=np.hypot(Q[:,0],Q[:,1]);ff=np.unwrap(np.arctan2(Q[:,1],Q[:,0]))
    if ff[-1]<ff[0]:ff=-ff
    p=2*math.pi/z;tips=[t for t,kp in zip(tips,keep) if kp]
    gaps=[(tips[j],tips[j+1],tips[j]+int(np.argmin(rr[tips[j]:tips[j+1]]))) for j in range(len(tips)-1) if ff[tips[j+1]]-ff[tips[j]]<1.5*p]
    ro=np.median(rr[tips]);ri=np.median([rr[g[2]] for g in gaps]);res=[]
    for i0,i1,ir in gaps:
        sd={}
        for s,(a,b) in (('A',(i0,ir)),('B',(ir,i1))):   # A: from a tip down to the root; B: from the root up to the next tip
            idx=np.arange(a,b+1);idx=idx[(rr[idx]>ri+0.25*(ro-ri))&(rr[idx]<ri+0.75*(ro-ri))]
            if len(idx)<4:continue
            X=Q[idx];m=X.mean(0);_,S,Vt=np.linalg.svd(X-m);d=Vt[0];d=d if d@m>0 else -d;sd[s]=(m,d,i0 if s=='A' else i1)
        res.append(sd)
    rad=lambda m,d:math.degrees(math.atan2(abs(m[0]*d[1]-m[1]*d[0]),m@d))
    face='B' if sum(1 if rad(*s['B'][:2])<rad(*s['A'][:2]) else -1 for s in res if len(s)==2)>0 else 'A';back='A' if face=='B' else 'B'
    leans=[]
    for s in res:
        if len(s)<2:continue
        m,d,it=s[face];tip=Q[it];u=m/np.linalg.norm(m);t=np.array([-u[1],u[0]])
        t=-t if (s[back][0]-tip)@t>0 else t   # s[back]: the back across the gap, on the face's root side; t points the other way, to the tooth's own back
        leans.append((math.degrees(math.atan2(C[it,1]-cy,C[it,0]-cx)),math.degrees(math.atan2(d@t,d@u))))
    deps=[(math.degrees(math.atan2(C[ir,1]-cy,C[ir,0]-cx)),(rr[i0]+rr[i1])/2-rr[ir]) for i0,i1,ir in gaps]
    return dict(ell=(ex,ey,ea,eb,ephi),kept=int(keep.sum()),ntips=len(T),rms=float(np.std(rn[keep]-1)*ro_mm),Q=Q,rr=rr,ff=ff,tips=tips,p=p,deps=deps,leans=leans,
                depth=float(np.median([d for _,d in deps])),lean=float(np.median([l for _,l in leans if abs(l)<30])) if leans else float('nan'))

def edgewidth(V,c,arc,r0):
    """the 10-90 % rise across the outline along rays (px, median): the frame's blur"""
    cx,cy=c;V=V.astype(np.float32);W=[]
    for a in np.radians(np.arange(*arc,0.5)):
        rs=np.arange(r0-40,r0+40,0.25);v=cv2.remap(V,(cx+rs*math.cos(a)).astype(np.float32)[None],(cy+rs*math.sin(a)).astype(np.float32)[None],cv2.INTER_LINEAR)[0]
        lo,hi=np.percentile(v,5),np.percentile(v,95)
        if hi-lo<100:continue
        n=(v-lo)/(hi-lo);i=int(np.argmax(n>0.5));j=np.where(n[:i]<0.1)[0]
        if len(j):W.append((i+int(np.argmax(n[i:]>0.9))-j[-1])*0.25)
    return float(np.median(W)) if W else float('nan')

def synth(shape,box,ell,z,ro,lean,depth,sigma,S=4):
    """a frame of the ratchet drawn through the ellipse ell: faces leaning back lean deg, depth mm, Gaussian blur sigma px, noise"""
    ex,ey,ea,eb,ephi=ell;ph=math.radians(ephi);Rm=np.array([[math.cos(ph),math.sin(ph)],[-math.sin(ph),math.cos(ph)]]);x0,y0,x1,y1=box
    ys,xs=np.mgrid[y0*S:y1*S,x0*S:x1*S].astype(np.float32)/S+(0.5/S-0.5);pl=np.einsum('ij,jhw->ihw',Rm,np.stack([xs-ex,ys-ey]))
    px,pz=pl[0]/ea*ro,pl[1]/eb*ro;r=np.hypot(px,pz);p=2*math.pi/z;ri=ro-depth;ta=0.97*p-math.tan(math.radians(lean))*depth/ro
    # each tooth the triangle root (ri, 0), tip (ro, ta), face's root (ri, 0.97 p) on the disc r < ri: an undercut tip (ta past 0.97 p) overhangs its root,
    # so a point is tested in its own pitch and the one before
    A,B,Cc=[(q*math.cos(w),q*math.sin(w)) for q,w in ((ri,0),(ro,ta),(ri,0.97*p))];inside=r<ri
    for k in (0,1):
        t=np.mod(np.arctan2(pz,px),p)+k*p;X,Z=r*np.cos(t),r*np.sin(t)
        cr=lambda P,Q:(Q[0]-P[0])*(Z-P[1])-(Q[1]-P[1])*(X-P[0]);s1,s2,s3=cr(A,B),cr(B,Cc),cr(Cc,A)
        inside|=((s1>=0)&(s2>=0)&(s3>=0))|((s1<=0)&(s2<=0)&(s3<=0))
    img=cv2.resize(np.where(inside,25.0,200.0).astype(np.float32),(x1-x0,y1-y0),interpolation=cv2.INTER_AREA)
    if sigma>0:img=cv2.GaussianBlur(img,(0,0),sigma)
    img+=np.random.default_rng(1).normal(0,4,img.shape).astype(np.float32);V=np.full(shape,200,np.float32);V[y0:y1,x0:x1]=img;return np.clip(V,0,255)

def main():
    ap=argparse.ArgumentParser(description=__doc__.split('\n')[0]);ap.add_argument('frame');ap.add_argument('--box',type=int,nargs=4,required=True);ap.add_argument('--c',type=float,nargs=2,required=True)
    ap.add_argument('--arc',type=float,nargs=2,default=[-178,-2]);ap.add_argument('--rc',type=float,default=430);ap.add_argument('--thr',type=float,default=90);ap.add_argument('--z',type=int,default=42)
    ap.add_argument('--ro',type=float,default=7.05);ap.add_argument('--sigma',type=float,nargs='*');ap.add_argument('--fold');a=ap.parse_args()
    V=cv2.cvtColor(cv2.imread(a.frame),cv2.COLOR_BGR2HSV)[:,:,2];c=tuple(a.c)
    C,th=outline(V,a.box,c,a.arc,a.thr,a.rc);F=analyse(C,th,c,a.z,a.ro);ex,ey,ea,eb,ephi=F['ell']
    print(f"{a.frame}: {len(C)} outline points; {F['kept']} of {F['ntips']} tips on the ellipse to {F['rms']*1000:.0f} um (c {ex:.1f}, {ey:.1f}; axes {ea:.1f}, {eb:.1f} px at {ephi:.1f} deg)")
    print('  gaps (image angle: depth mm):','  '.join(f"{g:.0f}:{d:.3f}" for g,d in F['deps']))
    print('  faces (image angle: lean deg, + leaning back):','  '.join(f"{g:.0f}:{l:+.1f}" for g,l in F['leans']))
    r0=0.5*(ea+eb);ew=edgewidth(V,c,(-80,-20),r0)
    E=[(q,edgewidth(synth(V.shape,a.box,F['ell'],a.z,a.ro,0,0.5,q),(ex,ey),(-80,-20),r0)) for q in (1,2,3,4,5,6)];s0=round(float(np.interp(ew,[e for _,e in E],[q for q,_ in E])),1)   # the synthetic frames' edges, read the same way
    sg=a.sigma or [round(s0-1,1),s0,round(s0+1,1)]
    print(f"  read: depth {F['depth']:.3f} mm (median), faces {F['lean']:+.2f} deg (median); its edges {ew:.2f} px 10-90 %, as a synthetic frame's blurred by sigma {s0} ({', '.join(f'{q}: {e:.2f}' for q,e in E)})")
    rows={}
    for s in sg:
        dd=[(d,analyse(*outline(synth(V.shape,a.box,F['ell'],a.z,a.ro,0,d,s),a.box,(ex,ey),a.arc,a.thr,a.rc),(ex,ey),a.z,a.ro)) for d in (0.35,0.45,0.55,0.65,0.75)]
        D=[x for x,_ in dd];R=[f['depth'] for _,f in dd];true=float(np.interp(F['depth'],R,D))
        ll=[(l,analyse(*outline(synth(V.shape,a.box,F['ell'],a.z,a.ro,l,true,s),a.box,(ex,ey),a.arc,a.thr,a.rc),(ex,ey),a.z,a.ro)['lean']) for l in (-6,-3,0,3,6,9)]
        Lr=[r for _,r in ll];o=np.argsort(Lr);tl=float(np.interp(F['lean'],np.array(Lr)[o],np.array([l for l,_ in ll])[o]))
        rows[s]=(true,ll);print(f"  sigma {s}: true depths {D} read {[round(x,3) for x in R]}: the frame's {F['depth']:.3f} is {true:.2f} mm; at that depth leans {[l for l,_ in ll]} read {[round(x,1) for x in Lr]}: the frame's {F['lean']:+.1f} is {tl:+.1f} deg")
    if a.fold:
        import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
        def folded(F,m=1):
            Cx=np.degrees(np.arctan2(*(np.array([F['Q'][:,1],F['Q'][:,0]]))));mid=np.median(Cx);out=[]
            for t in F['tips']:
                k=(abs(F['ff']-F['ff'][t])<F['p']*0.55)&(abs(Cx-mid)<35);out.append((m*(F['ff'][k]-F['ff'][t])*a.ro,F['rr'][k]))
            return out
        fig,ax=plt.subplots(figsize=(8,5))
        for i,(x,r) in enumerate(folded(F)):ax.plot(x,r,'.',ms=1.2,color='k',label=a.frame.split('/')[-1].split('\\')[-1] if i==0 else None)
        s=sg[len(sg)//2];syn=analyse(*outline(synth(V.shape,a.box,F['ell'],a.z,a.ro,0,rows[s][0],s),a.box,(ex,ey),a.arc,a.thr,a.rc),(ex,ey),a.z,a.ro)
        mir=-1 if np.median([x.mean() for x,_ in folded(F) if len(x)])*np.median([x.mean() for x,_ in folded(syn) if len(x)])<0 else 1   # the frame may see the wheel's other face
        for i,(x,r) in enumerate(folded(syn,mir)):ax.plot(x,r,'.',ms=1.2,color='tab:blue',label=f'synthetic: {rows[s][0]:.2f} deep, radial, sigma {s}' if i==0 else None)
        ax.set_xlabel("along the tip circle from each tooth's tip, mm");ax.set_ylabel('radius, mm');ax.legend(fontsize=7,markerscale=6);ax.grid(alpha=0.3);fig.savefig(a.fold,dpi=130,bbox_inches='tight');print('wrote',a.fold)

if __name__=='__main__':main()
