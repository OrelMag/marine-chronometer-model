"""The Wempe dial's printing traced off a photograph of a real dial (no browser but --compare; opencv-python, numpy, scipy).

    python dialtrace.py [--write] [--png]      # trace; --write writes dialface.js (without it, exits 1 if dialface.js is stale)
    python dialtrace.py --geo                  # the geometric printing's measurements, which dial.js draws from
    python dialtrace.py --compare              # the page's own canvas (WDIAL.face(), Playwright) on the rectified photo
    python dialtrace.py --fitonly              # the homography and the circles' fits

The source: References/wempe/photos/dg-chrono-dec/1_Wempe_3955_Z.jpg (Wempe No. 3955's dial, square-on, about 9.2 px/mm; Johannes Altmeppen).
1. Rectify. Along rays from each printed circle's rough centre the dark runs are found (their edges where the profile crosses half way from the
   paper to the ink, interpolated); each line's centre points are fitted with an ellipse (outliers cut), then one homography takes every circle's
   points onto circles in millimetres: the two sub-dials' centres fixed at (0, -23) and (0, 23) (the up-and-down and seconds arbors, 23 ±0.03 from the
   centre on the dial's sheet 05 02 00-4 and in the plates' hole tables: the printing is registered to their holes), every radius and the track's
   centre free. So the dial is in the model's frame (dial.js's P(): mm, 12 up, x right, z down, the centre arbor at 0, 0) and its scale is the
   arbors', not the printing's.
2. Measure the geometric printing on the rectified dial (--geo; radial profiles: each line's edges, and its width as the dip's area over the full
   contrast; angular profiles: each division's angle and width; each white box's corner radius along its diagonals, less a sharp corner's under the
   photo's blur): dial.js draws these from the numbers, the divisions at their measured angles (written into dialface.js).
3. Trace everything else: the photo warped onto the dial at PX px/mm (bicubic), the ink where the grey falls under half way from the local paper
   (a grey closing) to the ink; the known lines masked out (the tracks' bands whole: the seconds track is printed over the 7 and 5; the thin circles
   only where the ink is thin, so the 12 keeps its foot over the up-and-down circle); the hands masked (hands()) and filled in from round them
   (cv2.inpaint), or a glyph taken from another of its series (GLYPH_FROM) or completed from its own outline (ELLFILL); each item's components
   (ITEMS: where each numeral, figure and word lies) with their holes (cv2.RETR_CCOMP), specks and pinholes dropped (SPECK, PIN), each contour
   moved half a pixel out of the ink and simplified to TOL mm.
4. --write: writes marine-chronometer-source/wempe/js/dialface.js (WDIALFACE: each item's paths in integer 0.01 mm, as strings: each contour's
   first point, then its steps; the divisions' angles). --png: r_dial_rect.png (the rectified photo), r_dial_ink.png (the ink, the masks and the
   items' contours over it); --compare: r_dial_side.png and r_dial_diff.png; all in the current directory.
About 7 s (--compare 5 s more). Rerun it after changing ITEMS, the masks or the thresholds, then --compare and isolate.py --model wempe dial."""
import os,sys,json,pathlib,numpy as np,cv2
from scipy.ndimage import map_coordinates
from scipy.optimize import least_squares
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parents[2]
PHOTO=ROOT/'References/wempe/photos/dg-chrono-dec/1_Wempe_3955_Z.jpg'
OUT=ROOT/'marine-chronometer-source/wempe/js/dialface.js'
PX=40;HALF=53.0   # the rectified dial: PX px/mm over ±HALF mm
TOL=0.03;SPECK=0.02;PIN=0.022;PINH=0.1;SPECKH=0.1   # simplification (mm); components and holes under these areas (mm²) dropped (PINH in the hours and the serial, SPECKH the hours' bits: whose
# counters are all over 0.8 mm²: the white flecks in the ink, 0.02-0.07, are where the black has chipped; the smallest counter elsewhere, the 4 of 40's, is 0.027)
a=sys.argv[1:]
im=cv2.imread(str(PHOTO));g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(float)
INK=20.0   # the ink's grey in the photo (the numerals' cores: 4-30)

# ---------------- 1. the circles in the photo ----------------
from scipy.ndimage import spline_filter
_SF={}
def prof(img,c,r,ang):
    """the grey along rays (ang, deg clockwise from up) from c, at radii r (px): an array [ray, r] (cubic spline, prefiltered once per image)"""
    k=id(img)
    if k not in _SF:_SF[k]=spline_filter(img,3)
    t=np.radians(np.asarray(ang,float))[:,None];return map_coordinates(_SF[k],[c[1]-r[None,:]*np.cos(t),c[0]+r[None,:]*np.sin(t)],order=3,prefilter=False)
def runs(img,c,r0,r1,n,st=0.25,ink=INK):
    """dark runs along n rays from c (px): per ray [(r_in, r_out), ...], where the profile crosses half way from its paper (90th percentile) to ink"""
    out=[];r=np.arange(r0,r1,st);V=prof(img,c,r,np.arange(n)*360/n)
    for A,v in zip(np.arange(n)*360/n,V):
        th=(np.percentile(v,90)+ink)/2;d=v<th;e=np.flatnonzero(np.diff(d.astype(int)));f=lambda k:r[k]+(th-v[k])/(v[k+1]-v[k])*st
        out.append((A,[(f(e[i]),f(e[i+1])) for i in range(len(e)-1) if d[e[i]+1]]))
    return out
def pick(o,c,lo,hi,wmax):
    """the centres of the runs no wider than wmax whose middles lie between lo and hi from c"""
    p=[]
    for A,R in o:
        t=np.radians(A)
        for x,y in R:
            m=(x+y)/2
            if lo<m<hi and y-x<wmax:p.append((c[0]+m*np.sin(t),c[1]-m*np.cos(t)))
    return np.array(p)
def ellcut(p):
    """an ellipse through p, the points off it cut (four passes)"""
    for _ in range(4):
        (cx,cy),(A,B),an=cv2.fitEllipse(p.astype(np.float32));T=np.radians(an);q=(p-[cx,cy])@np.array([[np.cos(T),np.sin(T)],[-np.sin(T),np.cos(T)]]).T
        d=np.abs(np.hypot(q[:,0]/(A/2),q[:,1]/(B/2))-1)*(A+B)/4;p=p[d<max(0.6,2.5*np.median(d))]
    return p,cv2.fitEllipse(p.astype(np.float32))
K0=9.16;C0=(524,491)   # rough scale (px/mm) and centre, refined below
def circ_pts(c_mm,r_mm,dr,n):
    c=(C0[0]+c_mm[0]*K0,C0[1]+c_mm[1]*K0);o=runs(g,c,(r_mm-2*dr)*K0,(r_mm+2*dr)*K0,n);return ellcut(pick(o,c,(r_mm-dr)*K0,(r_mm+dr)*K0,6))
# the circles: the minute track's two lines, the up-and-down sub-dial's outer circle, the seconds sub-dial's three (the band's arcs, broken by the hand
# and short, are measured on the rectified dial instead)
CIRC={'track_out':((0,0),45.0,0.9,1440),'track_in':((0,0),42.7,0.9,1440),'ud':((0,-23),13.05,0.6,720),'sec_out':((0,23),18.5,0.6,1440),'sec_in':((0,23),16.5,0.6,1440),'sec_23':((0,23),11.5,0.6,1440)}
PTS={k:circ_pts(*v) for k,v in CIRC.items()}
# one homography from the photo to the dial's mm: each circle's points on a circle; the sub-dials' centres fixed at (0, -23), (0, 23)
def Hof(x):return np.array([[x[0],x[1],x[2]],[x[3],x[4],x[5]],[x[6],x[7],1.0]])
def hmap(H,p):q=np.c_[p,np.ones(len(p))]@H.T;return q[:,:2]/q[:,2:]
NAMES=list(CIRC);FIXC={'ud':(0,-23),'sec_out':(0,23),'sec_in':(0,23),'sec_23':(0,23)}
def unpack(x):
    H=Hof(x[:8]);R=dict(zip(NAMES,x[8:14]));tc=x[14:16];return H,R,tc
def res(x):
    H,R,tc=unpack(x);o=[]
    for k in NAMES:
        q=hmap(H,PTS[k][0]);c=FIXC.get(k,tc);o.append(np.hypot(q[:,0]-c[0],q[:,1]-c[1])-R[k])
    return np.concatenate(o)
s=1/K0;x0=[s,0,-C0[0]*s,0,s,-C0[1]*s,0,0]+[CIRC[k][1] for k in NAMES]+[0,0]
FIT=least_squares(res,x0,x_scale=[1e-3,1e-3,1,1e-3,1e-3,1,1e-7,1e-7]+[1]*6+[0.1,0.1])
HM,RAD,TC=unpack(FIT.x)
RMS={k:float(np.sqrt(np.mean((np.hypot(*(hmap(HM,PTS[k][0])-FIXC.get(k,TC)).T)-RAD[k])**2))) for k in NAMES}

# ---------------- the rectified dial ----------------
N=int(2*HALF*PX);T=np.array([[PX,0,HALF*PX],[0,PX,HALF*PX],[0,0,1]])@HM   # photo px -> rectified px
def mm2r(p):return (np.asarray(p,float)+HALF)*PX
def r2mm(p):return np.asarray(p,float)/PX-HALF
REC=cv2.warpPerspective(im,T,(N,N),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_REPLICATE)
# the paper's grey: a grey closing over 4 mm (wider than any stroke but the hour blocks' 1.5) in the photo, warped with it
bg=cv2.dilate(g.astype(np.uint8),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(37,37)));bg=cv2.medianBlur(bg,21)
BG=cv2.warpPerspective(bg,T,(N,N),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE).astype(float)
GR=cv2.cvtColor(REC,cv2.COLOR_BGR2GRAY).astype(float)

GR=cv2.GaussianBlur(GR,(0,0),1.2)   # JPEG noise (its 8 px blocks are 35 px here) smoothed under the trace's tolerance
def at(A,r,c=(0,0)):return (c[0]+r*np.sin(np.radians(A)),c[1]-r*np.cos(np.radians(A)))   # dial angle (deg clockwise from 12) and radius about c -> mm
U=(0.0,-23.0);SD=(0.0,23.0)

# ---------------- 2. the geometric printing, measured ----------------
def edges(c,r0,r1,angs):
    """the median radial profile about c (mm) over the angles angs, r0 to r1 (mm): its runs of ink [(in, out, width)] (mm), the edges at half way from
    paper to ink, the width as the dip's area over the full contrast"""
    r=np.arange(r0,r1,0.005);v=np.median(prof(GR,mm2r(c),r*PX,angs),0);B=prof(BG,mm2r(c),r*PX,angs).mean();th=(B+INK)/2
    d=v<th;e=np.flatnonzero(np.diff(d.astype(int)));f=lambda k:r[k]+(th-v[k])/(v[k+1]-v[k])*0.005;R=[]
    for i in range(len(e)-1):
        if d[e[i]+1]:x,y=f(e[i]),f(e[i+1]);m=(r>x-0.25)&(r<y+0.25);R.append((float(x),float(y),float(np.clip((B-v[m])/(B-INK),0,1).sum()*0.005)))
    return R
def runs_ang(c,r,band=0.0,st=0.01):
    """dark runs round a circle of radius r (mm) about c: [(angle in, angle out)] (deg clockwise from 12), the grey averaged over r ± band"""
    A=np.arange(-30,330,st);rr=np.linspace(r-band,r+band,5) if band else np.array([r]);V=prof(GR,mm2r(c),rr*PX,A).mean(1);B=prof(BG,mm2r(c),rr*PX,A).mean(1)
    d=V<(B+INK)/2;e=np.flatnonzero(np.diff(d.astype(int)));return [(float(A[e[i]+1]),float(A[e[i+1]])) for i in range(len(e)-1) if d[e[i]+1]]
def sigma(c,r,angs):
    """the photo's blur here (mm): an erf fitted to the mean profile across a circle's outer edge (the paper side of a line r about c)"""
    from scipy.special import erf
    x=np.arange(-0.3,0.3,0.005);v=np.median(prof(GR,mm2r(c),(r+x)*PX,angs),0)
    f=least_squares(lambda q:q[0]+q[1]*erf((x-q[2])/(np.sqrt(2)*abs(q[3])))-v,[100,80,0,0.05]);return abs(f.x[3])
def corner(c,r0,r1,a0,a1,sg):
    """a white box's corner radius (mm): along each corner's diagonal, the half way crossing's distance from the sides' crossing, less a sharp corner's
    under the blur (0.77 sigma), over (sqrt 2 - 1); the mean of the four. r0, r1, a0, a1: the box's sides (their half way edges)"""
    out=[]
    for r,sr in((r0,1),(r1,-1)):
        for A,sa in((a0,1),(a1,-1)):
            t=np.radians(A);er=np.array([np.sin(t),-np.cos(t)]);et=np.array([np.cos(t),np.sin(t)]);p=np.array([c[0],c[1]])+r*er;dv=(sr*er+sa*et)/np.sqrt(2)
            s=np.arange(0,0.5,0.002);q=mm2r(p[None,:]+s[:,None]*dv[None,:]);v=map_coordinates(GR,[q[:,1],q[:,0]],order=1);B=map_coordinates(BG,[q[:,1],q[:,0]],order=1)
            k=np.flatnonzero(v>(B+INK)/2)
            if len(k):out.append(s[k[0]])
    return max(0.0,(float(np.mean(out))-0.77*sg)/(np.sqrt(2)-1))
def track(c,r0,r1,n,skip,sg):
    """a railway of n white boxes between two lines about c (the lines' runs between r0 and r1 mm): the lines' edges and widths, each division's angle
    and width (mm, at the boxes' middle radius), and the boxes' corner radius (the median). skip: the divisions' indices a hand or a numeral covers"""
    E=edges(c,r0,r1,[(k+0.5)*360/n for k in range(n) if k not in skip and (k+1)%n not in skip]);li,lo=E[0],E[-1];rm=(li[1]+lo[0])/2
    D={}
    for x,y in runs_ang(c,rm,band=(lo[0]-li[1])/5):
        k=int(round((x+y)/2*n/360))%n
        if k not in skip:D[k]=((x+y)/2,y-x)
    cor=[corner(c,li[1],lo[0],D[k][0]+D[k][1]/2,D[(k+1)%n][0]-D[(k+1)%n][1]/2+(360 if k==n-1 else 0),sg) for k in range(n) if k in D and (k+1)%n in D]
    return dict(li=li,lo=lo,rm=rm,div={k:(a,w*np.pi/180*rm) for k,(a,w) in D.items()},corner=float(np.median(cor)))
def measure():
    """every geometric part of the printing, measured (printed by --geo; dial.js draws them from these numbers)"""
    G={};TCt=tuple(TC);sg=sigma(TCt,RAD['track_out']+0.19,[m*6+3 for m in range(60) if not 38<=m<=43]);G['blur']=sg
    G['track']=track(TCt,41.8,45.8,60,set(range(39,44)),sg)   # the minute hand crosses 39-43
    G['sec']=track(SD,15.8,19.3,60,set(range(17,23))|set(range(33,38))|set(range(52,57))|{28},sg)   # the seconds hand (17-22), the 7 and the 5 (the track printed over them)
    G['sec23']=edges(SD,10.9,12.1,[s*6+3 for s in range(60) if not 17<=s<=22])
    G['secrad']=[(a,w*np.pi/180*13.2) for a,w in [((x+y)/2,y-x) for x,y in runs_ang(SD,13.2,band=0.6)] if min(abs(a-q) for q in range(30,331,60))<1.5]   # the radial lines at 5, 15 ... 55 s
    ua=[22.5+45*k for k in range(8)]
    G['udc']=edges(U,12.5,13.6,[a for a in np.arange(0,360,2) if not 320<a<334])   # the up-and-down sub-dial's circle (its hand at 327)
    E=edges(U,7.0,9.6,[a+22.5 for a in ua[:-1]]);G['udb']=dict(li=E[0],lo=E[-1])
    rm=(E[0][1]+E[-1][0])/2;R=runs_ang(U,rm,band=(E[-1][0]-E[0][1])/5)
    G['udb']['div']=[((x+y)/2,(y-x)*np.pi/180*rm) for x,y in R if min(abs((x+y)/2-q) for q in ua)<2]
    dv=sorted(G['udb']['div']);G['udb']['corner']=float(np.median([corner(U,E[0][1],E[-1][0],a+w*90/np.pi/rm,b-v*90/np.pi/rm,sg) for (a,w),(b,v) in zip(dv,dv[1:]) if not (a<330<b)]))
    # the band's open end: where its lines stop, beyond the end divisions at 0 and 56 (the outer line's end, as the tangent of its rounded corner)
    return G
def geo_print(G):
    f=lambda q:f'{q[0]:.3f}-{q[1]:.3f} (w {q[1]-q[0]:.3f}, area {q[2]:.3f})'
    print(f"blur sigma {G['blur']:.3f} mm")
    for k in('track','sec'):
        T=G[k];d=T['div'];hrs=[w for i,(a,w) in d.items() if i%5==0];mins=[w for i,(a,w) in d.items() if i%5];off=[a-i*6 for i,(a,w) in d.items()];off=[(o+180)%360-180 for o in off]
        print(f"{k}: inner line {f(T['li'])}, outer line {f(T['lo'])}; divisions every 6 deg {np.median(mins):.3f} ({min(mins):.3f}-{max(mins):.3f}), every 30 deg {np.median(hrs):.3f} ({min(hrs):.3f}-{max(hrs):.3f}); their angles off the nominal {np.mean(off):+.3f} deg (sd {np.std(off):.3f}); box corners r {T['corner']:.3f}")
    print('sec Ø23 circle',f(G['sec23'][0]) if G['sec23'] else '-');sr=[w for a,w in G['secrad']];print(f"sec radial lines {np.median(sr):.3f} ({min(sr):.3f}-{max(sr):.3f}), {len(sr)} widths at r 12.6-13.8")
    print('ud circle',f(G['udc'][0]));B=G['udb'];print(f"ud band: inner line {f(B['li'])}, outer line {f(B['lo'])}; divisions",', '.join(f'{a:.2f}:{w:.3f}' for a,w in sorted(B['div'])),f"; box corners r {B['corner']:.3f}")
    print(f"centres: track {TC[0]:+.3f}, {TC[1]:+.3f}; the sub-dials (0, -23), (0, 23) by the fit; circles' rms",', '.join(f'{k} {v*1000:.0f}' for k,v in RMS.items()),'µm')

# ---------------- 3. the ink, traced ----------------
YY,XX=np.mgrid[0:N,0:N];XM,ZM=r2mm(XX+0.0),r2mm(YY+0.0)
def rad(c):return np.hypot(XM-c[0],ZM-c[1])
def angd(c):return np.degrees(np.arctan2(XM-c[0],-(ZM-c[1])))%360
def disk(mm):k=int(round(mm*PX))|1;return cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(k,k))
def hand_line(c,A,r0,r1,da=4):
    """a hand's centre line seen on the dial: at each radius from c (mm) the darkest point within da deg of A, a straight line fitted through them (the hands
    stand 2-3 mm over the dial, so the line misses the arbor's centre a little): (p, unit vector) in mm"""
    P=[]
    for r in np.arange(r0,r1,0.1):
        aa=np.arange(A-da,A+da,0.02);v=prof(GR,mm2r(c),np.array([r*PX]),aa)[:,0];P.append(at(aa[np.argmin(v)],r,c))
    P=np.array(P);k=np.ones(len(P),bool)
    for _ in range(5):   # where it crosses a numeral or a line the darkest point may be the ink's: those off the line cut
        m=P[k].mean(0);u=np.linalg.svd(P[k]-m)[2][0];e=np.abs((P-m)@np.array([-u[1],u[0]]));k=e<max(0.03,2.5*np.median(e[k]))
    return m,u if u@np.array(at(A,1))>0 else -u
def capsule(p,u,s0,s1,hw):
    """the mask of a strip along p + s u, s0 to s1, half width hw (mm)"""
    d=(XM-p[0])*u[0]+(ZM-p[1])*u[1];e=np.abs(-(XM-p[0])*u[1]+(ZM-p[1])*u[0]);return (d>s0)&(d<s1)&(e<hw)
S_IN=16.35   # the seconds track's inner edge (--geo)
def hands():
    """the hands over the printing (to fill in from round them), and the gold hands (to take out: they cross no figure): the seconds hand (its pointer, blued: its line from 3 to 10.5 mm out, where nothing else is printed on it, to the track's inner edge
    (its tip, 18.9 out, lies over the 5's black); 0.20 wide, its dark edge and shadow 0.6), the up-and-down hand (2.5-7 mm, inside its band, to its tip 10.4 out), the gold minute and hour hands
    (the photo's colour over 45 of 255 apart between channels, closed over 1.2 mm, 0.3 mm round)"""
    m=np.zeros((N,N),bool);L={}
    p,u=hand_line(SD,117.2,3,18.5);L['seconds']=(p,u);m|=capsule(p,u,(np.array(SD)-p)@u,(np.array(at(117.2,S_IN,SD))-p)@u,0.34)
    p,u=hand_line(U,326.8,2.5,7);L['updown']=(p,u);m|=capsule(p,u,(np.array(U)-p)@u,(np.array(at(326.8,10.4,U))-p)@u,0.22)
    sat=(REC.max(2).astype(int)-REC.min(2).astype(int))>20;cor=np.zeros((N,N),bool)
    for A,r0,r1,hw in((248.85,3,47,1.6),(106.9,3,36,3.2)):   # the minute and hour hands' corridors (their lines measured as the others', 5-30 and 5-15 mm out)
        p,u=hand_line((0,0),A,5,30 if r1>40 else 15);L['minute' if r1>40 else 'hour']=(p,u);cor|=capsule(p,u,-4,r1,hw)
    gold=cv2.morphologyEx((sat&cor).astype(np.uint8),cv2.MORPH_CLOSE,disk(1.2));gold=(cv2.dilate(gold,disk(0.35))>0)&cor;return m,gold,L
# where each item lies (mm): a numeral, figure or mark by a circle round its middle (r), a word by its box; every component of the ink whose centre falls in one is its
ITEMS={**{f'h{h}':('c',at(h*30,37.0),6.5) for h in range(1,13) if h!=6},   # the hours, 6 left out (the seconds sub-dial)
       **{f'u{8*k}':('c',at(22.5+45*k,10.9,U),3.4) for k in range(8)},   # the up-and-down figures 0 8 ... 56 (each set off its division toward the gap: the 0 at 11 deg, the 56 at 327)
       **{f's{10*q}':('c',at(60*q,14.0,SD),2.9) for q in range(1,7)},   # the seconds figures 10 ... 60
       'serial':('b',(-4.5,15.3,4.5,19.3)),'anchor':('b',(-3.2,25.5,3.2,33.8)),
       'chrono':('b',(-24,-9.5,24,-3.5)),'wempe':('b',(-28,-3,-14,1.8)),'hamburg':('b',(10,-3,28.5,1.8))}
# a glyph a hand hides, taken from another of the same series at the same size: target item, donor item, the donor's turn onto the target (deg). The seconds
# hand runs through the 0 of 20 (its stroke and counter cut by 0.45 mm): the 0 of 50, set radially at the same angle (both -60 deg), fitted on what shows
GLYPH_FROM=[('s20','s50',0.0)]
# a glyph whose hidden part is completed from its own outline: the minute hand's shadow lies over the 8's top (0.3-0.6 mm of it, from 1.2 left of its middle to 0.4
# right): the upper loop's outer edge, where it shows (above the upper counter's middle), fitted with an ellipse, the hidden pixels inside it ink
ELLFILL=['h8']
def ellfill(C,Au):
    rep=[]
    for k in ELLFILL:
        q=max([q for q in C if q[0]==k],key=lambda q:q[3]);M=q[2].copy();hid=Au[q[1]]
        n,lab,st,cen=cv2.connectedComponentsWithStats((~M).astype(np.uint8),connectivity=4)
        hs=[j for j in range(1,n) if st[j][0]>0 and st[j][1]>0 and st[j][0]+st[j][2]<M.shape[1] and st[j][1]+st[j][3]<M.shape[0]]   # the counters
        yc=cen[min(hs,key=lambda j:cen[j][1])][1];c=max(cv2.findContours(M.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0],key=len)[:,0,:]
        far=cv2.dilate(hid.astype(np.uint8),disk(0.1))==0;c=c[(c[:,1]<yc)&far[c[:,1],c[:,0]]];e=cv2.fitEllipse(c.astype(np.float32))
        E=np.zeros(M.shape,np.uint8);cv2.ellipse(E,e,1,-1);M[hid]=E[hid]>0;q[2]=M
        rep.append(f'{k}: {hid.sum()/PX**2:.2f} mm² under the minute hand filled from an ellipse through its upper loop ({len(c)} edge points; axes {e[1][0]/PX:.2f} x {e[1][1]/PX:.2f} mm)')
    return rep
def ink(G,H,Au):
    """the ink: under half way from the paper to the ink, the hands filled in from round them (cv2.inpaint), the geometric printing taken out (the tracks'
    bands whole, the thin circles and lines where the ink is thin: the 12's foot stands over the up-and-down circle). Returns the ink and what was taken out"""
    g8=np.clip(GR,0,255).astype(np.uint8);g8=cv2.inpaint(g8,(H|Au).astype(np.uint8),int(0.3*PX),cv2.INPAINT_TELEA)
    I=g8.astype(float)<(BG+INK)/2;thick=cv2.morphologyEx(I.astype(np.uint8),cv2.MORPH_OPEN,disk(0.6))>0;m=0.1
    T,S,B=G['track'],G['sec'],G['udb'];rt,rs,ru=rad(TC),rad(SD),rad(U)
    X=((rt>T['li'][0]-m)&(rt<T['lo'][1]+m))|((rs>S['li'][0])&(rs<S['lo'][1]))|((ru>B['li'][0]-m)&(ru<B['lo'][1]+m))
    X|=(rs>G['sec23'][0][0]-m)&(rs<G['sec23'][0][1]+m)
    for A,w in [(30+60*k,np.median([w for _,w in G['secrad']])) for k in range(6)]:t=np.radians(A);d=(XM-SD[0])*np.sin(t)-(ZM-SD[1])*np.cos(t);e=np.abs((XM-SD[0])*np.cos(t)+(ZM-SD[1])*np.sin(t));X|=(d>11)&(d<17)&(e<w/2+m)
    X|=(ru>G['udc'][0][0]-m)&(ru<G['udc'][0][1]+m)&~thick
    # (the seconds track's band is cut at its edges exactly: it is drawn over the 7 and the 5, which must run up to it)
    X|=rt>T['lo'][1]+m   # nothing is printed outside the minute track
    # the hands' boss stands close under CHRONOMETERWERKE, a thread of shadow joining it to the E: the word's ink ends at its baseline (the letters' lowest row)
    w=(np.abs(XM)>4)&(np.abs(XM)<24)&(ZM>-9)&(ZM<-3.5)&I;BL=ZM[w].max();X|=(np.abs(XM)<4)&(ZM>BL+1/PX)&(ZM<-3)
    I=I&~X;near=(rs>S['li'][0]-0.2)&(rs<S['lo'][1]+0.2);I[near]=(cv2.morphologyEx(I.astype(np.uint8),cv2.MORPH_OPEN,disk(0.12))>0)[near]   # the track's blurred fringe, under 0.12 mm, along its edges
    return I,X
def item_of(cx,cz):
    """the item a component's centre falls in (a box, or the circle it is deepest in)"""
    best=None
    for k,v in ITEMS.items():
        if v[0]=='b' and v[1][0]<cx<v[1][2] and v[1][1]<cz<v[1][3]:return k
        if v[0]=='c':
            d=np.hypot(cx-v[1][0],cz-v[1][1])/v[2]
            if d<1 and (best is None or d<best[0]):best=(d,k)
    return best and best[1]
def components(I):
    """the ink's components (8-connected), each [item, slice, its mask, area mm², centre mm]; those in no item and the specks listed apart"""
    n,lab,st,cen=cv2.connectedComponentsWithStats(I.astype(np.uint8),connectivity=8);out=[];left=[]
    for j in range(1,n):
        x,y,w,h,A=st[j];c=r2mm(cen[j]);A=A/PX**2;k=item_of(*c);sl=(slice(y,y+h),slice(x,x+w));q=[k,sl,lab[sl]==j,A,c]
        (out if k and A>=(SPECKH if k[0]=='h' else SPECK) else left).append(q)
    return out,left
def substitute(C,H):
    """GLYPH_FROM: each target's components under a hand replaced by the donor's component (turned) that best matches the target's ink outside the hand"""
    rep=[]
    for tgt,don,turn in GLYPH_FROM:
        for q in [q for q in C if q[0]==tgt and H[q[1]][q[2]].any()]:
            y0,x0=q[1][0].start,q[1][1].start;pad=int(0.6*PX);T=np.zeros((q[2].shape[0]+2*pad,q[2].shape[1]+2*pad),np.uint8);T[pad:-pad,pad:-pad]=q[2]
            vis=(~H[y0-pad:y0-pad+T.shape[0],x0-pad:x0-pad+T.shape[1]]).astype(np.float32);best=None
            for d in [d for d in C if d[0]==don]:
                D=np.zeros((d[2].shape[0]+4*pad,d[2].shape[1]+4*pad),np.uint8);D[2*pad:-2*pad,2*pad:-2*pad]=d[2]
                cy,cx=np.array(D.shape)/2;R=cv2.getRotationMatrix2D((cx,cy),-turn,1);D=cv2.warpAffine(D,R,D.shape[::-1],flags=cv2.INTER_NEAREST)
                if D.shape[0]<T.shape[0] or D.shape[1]<T.shape[1]:continue
                M=cv2.matchTemplate(D.astype(np.float32),T.astype(np.float32),cv2.TM_SQDIFF,mask=vis);v,_,l,_=cv2.minMaxLoc(M);sc=v/max(1,vis.sum())
                if best is None or sc<best[0]:best=(sc,d,D,l)
            sc,d,D,l=best;P=D[l[1]:l[1]+T.shape[0],l[0]:l[0]+T.shape[1]]>0
            sl=(slice(y0-pad,y0-pad+T.shape[0]),slice(x0-pad,x0-pad+T.shape[1]));C.remove(q);C.append([tgt,sl,P,P.sum()/PX**2,q[4]])
            rep.append(f'{tgt}: its component at ({q[4][0]:.2f}, {q[4][1]:.2f}) under the hand taken from {don} (turned {turn:g} deg; {100*sc:.1f} % of the visible pixels differ)')
    return rep
def contours(q):
    """a component's contours (outer and holes, cv2.RETR_CCOMP) in 0.01 mm: each moved half a pixel off the ink (findContours runs on the edge pixels'
    centres), simplified to TOL; pinholes under PIN mm² dropped"""
    sl,m=q[1],q[2];cs,hi=cv2.findContours(m.astype(np.uint8),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE);out=[]
    for c,h in zip(cs,hi[0]):
        if len(c)<3:continue
        hole=h[3]>=0
        if hole and cv2.contourArea(c)/PX**2<(PINH if q[0][0]=='h' or q[0]=='serial' else PIN):continue
        p=c[:,0,:].astype(float);sa=np.sign(np.sum(p[:,0]*np.roll(p[:,1],-1)-np.roll(p[:,0],-1)*p[:,1]))   # the polygon's turn
        t=np.roll(p,-1,0)-np.roll(p,1,0);nrm=np.c_[t[:,1],-t[:,0]]*sa;nrm/=np.maximum(1e-9,np.hypot(*nrm.T))[:,None]   # its outward normal
        p=p+nrm*(-0.5 if hole else 0.5)   # off the ink: an outer contour grows, a hole shrinks
        p=cv2.approxPolyDP(p.astype(np.float32)[:,None,:],TOL*PX,True)[:,0,:]
        if len(p)>=3:out.append(np.round(r2mm(p+[sl[1].start,sl[0].start])*100).astype(int))
    return out
def enc(cs):
    """contours as a string: each contour's first point, then its steps, in 0.01 mm; | between contours"""
    return '|'.join(' '.join(str(v) for v in np.r_[c[0],np.diff(c,axis=0).ravel()]) for c in cs)
def trace():
    G=measure();H,Au,L=hands();I,X=ink(G,H,Au);C,left=components(I);rep=substitute(C,H)+ellfill(C,Au);P={k:[c for q in C if q[0]==k for c in contours(q)] for k in ITEMS}
    return G,H,I,X,C,left,rep,P,L
def js(P,G):
    def ang(T):   # each division's measured angle (0.01 deg); under a hand or a numeral, the nominal one turned by the others' mean offset
        o=np.mean([(a-i*6+180)%360-180 for i,(a,w) in T['div'].items()]);return ' '.join(str(int(round(100*(i*6+((T['div'][i][0]-i*6+180)%360-180) if i in T['div'] else i*6+o)))) for i in range(60))
    h=("/* dialface.js: the Wempe dial's printing, traced off Wempe No. 3955's dial (References/wempe/photos/dg-chrono-dec/1_Wempe_3955_Z.jpg, Johannes Altmeppen 2017)\n"
       "   by marine-chronometer-source/chronometer-working-model/tools/dialtrace.py --write: generated, don't edit (rerun the tool). Part of the Wempe model; declares only\n"
       "   WDIALFACE: for each item (h1 ... h12 the hours, u0 ... u56 the up-and-down figures, s10 ... s60 the seconds figures, serial, anchor, chrono: CHRONOMETERWERKE,\n"
       "   wempe, hamburg) its contours, filled even-odd, on the dial in 0.01 mm (dial.js's P(): x right, z down, the centre arbor at 0, 0): each contour's first point,\n"
       "   then its steps; | between contours. divm, divs: the minute and seconds tracks' 60 divisions' angles as measured (0.01 deg clockwise from 12; those under a\n"
       "   hand or a numeral the nominal turned by the rest's mean offset). The geometric printing (tracks, circles, band, lines) is dial.js's, drawn from the numbers\n"
       "   the tool measures (--geo). */\n")
    return h+'const WDIALFACE={\n'+',\n'.join(f'  {k}:"{enc(v)}"' for k,v in P.items())+f',\n  divm:"{ang(G["track"])}",\n  divs:"{ang(G["sec"])}"'+'};\n'

def compare():
    """--compare: the page's own canvas (WDIAL.face(), through Playwright and Chromium) on the rectified photo at the same scale: r_dial_side.png (the photo left,
    the canvas right, 10 px/mm), r_dial_diff.png (20 px/mm: the canvas in red, the photo in green and blue: black where both are ink, red where only the photo
    has ink, cyan where only the canvas has)"""
    import asyncio,base64
    from playwright.async_api import async_playwright
    async def grab():
        async with async_playwright() as pw:
            b=await pw.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"]);pg=await b.new_page()
            await pg.goto((ROOT/'marine-chronometer-source/wempe/index.html').as_uri()+'?snap&qa');await pg.wait_for_function("typeof WDIAL!=='undefined'",timeout=120000)
            u=await pg.evaluate("WDIAL.face(1).toDataURL('image/png')");await b.close();return u
    u=asyncio.run(grab());cvs=cv2.imdecode(np.frombuffer(base64.b64decode(u.split(',')[1]),np.uint8),cv2.IMREAD_GRAYSCALE)
    DR=103.55/2;M=np.array([[cvs.shape[1]/(2*DR)/PX,0,0],[0,cvs.shape[0]/(2*DR)/PX,0]]);M[:,2]=cvs.shape[1]/2-M[0,0]*HALF*PX   # rectified px -> canvas px
    C=cv2.warpAffine(cvs,M,(N,N),flags=cv2.INTER_LINEAR|cv2.WARP_INVERSE_MAP,borderValue=242).astype(float)
    ph=np.clip(GR/np.maximum(BG,1)*242,0,255)
    sd=np.hstack([cv2.resize(REC,(1060,1060),interpolation=cv2.INTER_AREA),cv2.cvtColor(cv2.resize(C.astype(np.uint8),(1060,1060),interpolation=cv2.INTER_AREA),cv2.COLOR_GRAY2BGR)])
    cv2.imwrite('r_dial_side.png',sd);d=np.dstack([ph,ph,C]).astype(np.uint8);cv2.imwrite('r_dial_diff.png',cv2.resize(d,(2120,2120),interpolation=cv2.INTER_AREA))
    ip=ph<(242+INK)/2;ic=C<(242+20)/2;inside=rad((0,0))<45.5;print(f'ink in the photo {ip[inside].sum()/PX**2:.1f} mm², in the canvas {ic[inside].sum()/PX**2:.1f} mm²; only in the photo {(ip&~ic)[inside].sum()/PX**2:.1f}, only in the canvas {(ic&~ip)[inside].sum()/PX**2:.1f} (the hands are in the photo only)')

if __name__=='__main__' and '--compare' in a:compare();sys.exit(0)
if __name__=='__main__' and '--fitonly' in a:
    print('homography (photo px -> mm):',np.round(HM,6).tolist())
    for k in NAMES:print(f'{k:10s} r {RAD[k]:.3f} (Ø {2*RAD[k]:.3f})  rms {RMS[k]*1000:.0f} µm  {len(PTS[k][0])} pts')
    print('track centre',np.round(TC,3))
    cv2.imwrite('r_dial_rect.png',REC)
if __name__=='__main__' and '--geo' in a:geo_print(measure())
if __name__=='__main__' and not ('--geo' in a or '--fitonly' in a):
    G,H,I,X,C,left,rep,P,L=trace();out=js(P,G)
    print('items:',', '.join(f'{k} {sum(1 for q in C if q[0]==k)}/{len(P[k])}' for k in ITEMS),'(components/contours)')
    for r in rep:print(r)
    big=[q for q in left if q[3]>0.02];print(f'left out: {len(left)} components ({len(left)-len(big)} specks under 0.02 mm²); the larger:',', '.join(f'({q[4][0]:.1f}, {q[4][1]:.1f}) {q[3]:.2f} mm²' for q in sorted(big,key=lambda q:-q[3])[:30]))
    print(f'dialface.js: {len(out)} bytes')
    if '--png' in a:
        cv2.imwrite('r_dial_rect.png',REC);o=cv2.cvtColor(np.where(I,0,255).astype(np.uint8),cv2.COLOR_GRAY2BGR);o[X&~I]=(200,230,255);o[H]=(o[H]*0.5+[0,0,128]).astype(np.uint8)
        for k,cs in P.items():cv2.polylines(o,[np.round(mm2r(c/100)).astype(np.int32) for c in cs],True,(0,160,0),2)
        cv2.imwrite('r_dial_ink.png',o)
    if '--write' in a:OUT.write_text(out,encoding='utf-8',newline='\n');print('wrote',OUT)
    elif not OUT.exists() or OUT.read_text(encoding='utf-8')!=out:print(OUT.name,'is stale: rerun with --write');sys.exit(1)
