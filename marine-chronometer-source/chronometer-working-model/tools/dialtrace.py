"""The Wempe dial's printing traced off a photograph of a real dial (no browser but --compare; opencv-python, numpy, scipy): Wempe 3955's, or with --dial lange
Lange 5177's (the page's Variants switch between them).

    python dialtrace.py [--write] [--png]      # trace; --write writes dialface.js (without it, exits 1 if dialface.js is stale)
    python dialtrace.py --geo                  # the geometric printing's measurements, which dial.js draws from
    python dialtrace.py --compare              # the page's own canvas (WDIAL.face(), Playwright) on the rectified photo
    python dialtrace.py --fitonly              # the homography and the circles' fits
    python dialtrace.py --dial lange [...]     # any of these for A. Lange & Soehne No. 5177's dial: dialface_lange.js (WDIALFACE_LANGE), WDIAL.face(K, 'lange')
    python dialtrace.py --dial kirov [...]     # or for Kirov No. 247's (the Soviet 6MX): dialface_kirov.js (WDIALFACE_KIROV), WDIAL.face(K, 'kirov')

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
Lange 5177's (1_Lange_5177_Z.jpg, the same photographer and framing, 8.9 px/mm; its blur sigma 0.024 mm, half Wempe 3955's) differs where marked LG: its own
circles, hands (hands_lg: the brass hands by their colour), items (Ab, Auf, the name on three lines, no anchor) and measure_lg (the up-and-down circle open at the
top, the band's end strokes running on inward); and its rust, which is wear and left out: marked by colour (R-B over what the paper's own ratio gives at that
brightness: RUST blurred over 0.15 mm, for the measurements and the hands; RUSTB on the JPEG's 2 x 2 chroma blocks, finer), the glyphs' ink taken only a quarter of
the way from the ink to the paper inside it (FR), only grey ink in the blurred mark, brown spots as dark as ink dropped (components()); the 16's 1, lost under
rust, from the 10's scaled (SCALED_FROM), the serial's last 7 from its first (RUST_FROM). Its divisions moved by rust (0.6 deg off, or a width out of 0.6-1.5 of
its kind's) are drawn at the nominal, as those under a hand.
Kirov 247's (dg-chrono-6mx/1_Kirow_247_Z.jpg, the Soviet 6MX's, 8.75 px/mm; --dial kirov, KR) is laid out as Lange's (LG with its rust left out): its own circles,
hands (hands_kr: the blued seconds hand's pointer, head and tail, the up-and-down hand, the brass minute and hour hands by colour, their boss and shadows cut from the ink,
NOPR, not filled in), items (СПУСК and ЗАВОД as sectors along the up-and-down circle, 1МЧЗ, ИМЕНИ КИРОВА, the last И of ИМЕНИ from its first under the minute hand)
and its serial, written in red ink: traced from red alone in its box (RED, over the other channels by 25), from the photo filled in under the seconds hand.
About 7 s (--dial lange about 12 s, --dial kirov about 15 s; --compare 5-15 s more). Rerun it after changing ITEMS, the masks or the thresholds, then --compare and isolate.py --model wempe dial."""
import os,sys,json,pathlib,numpy as np,cv2
from scipy.ndimage import map_coordinates
from scipy.optimize import least_squares
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parents[2]
a=sys.argv[1:];DIAL=a[a.index('--dial')+1] if '--dial' in a else 'wempe'   # which dial: wempe (Wempe 3955's, dialface.js), lange (Lange 5177's, dialface_lange.js) or kirov (Kirov 247's, dialface_kirov.js)
if DIAL not in('wempe','lange','kirov'):sys.exit('--dial wempe, lange or kirov')
KR=DIAL=='kirov';LG=DIAL=='lange' or KR   # Kirov 247's printing is laid out as Lange 5177's (thin lines, the up-and-down circle open at the top, the band's end strokes running inward): its own where marked KR
PHOTO=ROOT/('References/wempe/photos/'+('dg-chrono-6mx/1_Kirow_247_Z.jpg' if KR else 'dg-chrono-dec/1_Lange_5177_Z.jpg' if LG else 'dg-chrono-dec/1_Wempe_3955_Z.jpg'))
OUT=ROOT/('marine-chronometer-source/wempe/js/'+('dialface_kirov.js' if KR else 'dialface_lange.js' if LG else 'dialface.js'))
PX=40;HALF=53.0   # the rectified dial: PX px/mm over ±HALF mm
TOL=0.03;SPECK=0.02;PIN=0.022;PINH=0.1;SPECKH=0.1   # simplification (mm); components and holes under these areas (mm²) dropped (PINH in the hours and the serial, SPECKH the hours' bits: whose
# counters are all over 0.8 mm²: the white flecks in the ink, 0.02-0.07, are where the black has chipped; the smallest counter elsewhere, the 4 of 40's, is 0.027)
im=cv2.imread(str(PHOTO));g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY).astype(float)
INK=14.0 if LG else 20.0   # the ink's grey in the photo (the numerals' cores: Wempe 3955's 4-30, Lange 5177's 3-17)
FR=0.25   # Lange 5177's glyphs in its rust (RUSTB): ink under a quarter of the way from the ink to the paper (its photo is sharp, sigma 0.024 mm, so an edge moves 0.016 mm
# for it, under the trace's 0.03), which leaves out the rust, brown and lighter than that, on the glyphs' edges and in their counters; not everywhere: the thin figures' strokes
# (0.1-0.2 mm) don't reach that dark under the blur
CORE=30.0

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
K0,C0=(8.75,(500,512)) if KR else (8.84,(508,513)) if LG else (9.16,(524,491))   # rough scale (px/mm) and centre, refined below
def circ_pts(c_mm,r_mm,dr,n,gap=None):
    c=(C0[0]+c_mm[0]*K0,C0[1]+c_mm[1]*K0);o=runs(g,c,(r_mm-2*dr)*K0,(r_mm+2*dr)*K0,n)
    if gap:o=[q for q in o if not gap[0]<(q[0]+180)%360-180<gap[1]]   # an arc's gap (deg from 12, -180 to 180): its rays left out
    return ellcut(pick(o,c,(r_mm-dr)*K0,(r_mm+dr)*K0,6))
# the circles: the minute track's two lines, the up-and-down sub-dial's outer circle, the seconds sub-dial's three (the band's arcs, broken by the hand
# and short, are measured on the rectified dial instead)
CIRC={'track_out':((0,0),45.0,0.9,1440),'track_in':((0,0),42.7,0.9,1440),'ud':((0,-23),13.05,0.6,720),'sec_out':((0,23),18.5,0.6,1440),'sec_in':((0,23),16.5,0.6,1440),'sec_23':((0,23),11.5,0.6,1440)}
if LG:CIRC={'track_out':((0,0),45.04,0.6,1440),'track_in':((0,0),42.81,0.6,1440),'ud':((0,-23),12.95,0.5,720,(-26,26)),'sec_out':((0,23),18.46,0.5,1440),'sec_in':((0,23),16.5,0.5,1440),'sec_23':((0,23),11.47,0.5,1440)}   # Lange 5177's: thin lines, the up-and-down circle open at the top (+-22.5 deg) where Ab and Auf stand
if KR:CIRC={'track_out':((0,0),45.0,0.6,1440),'track_in':((0,0),42.7,0.6,1440),'ud':((0,-23),13.2,0.6,720,(-30,30)),'sec_out':((0,23),18.5,0.5,1440),'sec_in':((0,23),16.5,0.5,1440),'sec_23':((0,23),11.5,0.5,1440)}   # Kirov 247's: as Lange's, its up-and-down circle open at the top for СПУСК and ЗАВОД
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
RUST=None
if LG and not KR:   # (Kirov 247's dial has no rust: its red is the serial's ink)
    # Lange 5177's rust spots (wear, left out): brown, as red as the paper is but darker, where the ink's mix with the paper loses the paper's red as it darkens. Their
    # mark: R-B over what the paper's own (R-B)/(R+G+B) gives at that brightness, both blurred over 0.15 mm (sigma: wider than the JPEG's chroma blocks, 2 px of
    # the photo, whose chroma spills over the ink's edges), over 14 (the paper's 99th percentile 18 on its own spots, the ink's 95th 13)
    _f=cv2.GaussianBlur(REC.astype(np.float32),(0,0),0.15*PX);_S=_f.sum(2);_RB=_f[...,2]-_f[...,0];_q=_RB/np.maximum(_S,1);_s=0.125
    _pp=(cv2.resize(cv2.cvtColor(REC,cv2.COLOR_BGR2GRAY),None,fx=_s,fy=_s)>150).astype(np.float32);_qs=cv2.resize(_q,None,fx=_s,fy=_s)
    _rp=cv2.resize(cv2.GaussianBlur(_qs*_pp,(0,0),15)/np.maximum(cv2.GaussianBlur(_pp,(0,0),15),1e-3),(N,N));RUST=(_RB-_rp*_S)>14;del _f,_S,_RB,_q
    # and for the glyphs, the same mark worked on the JPEG's own 2 x 2 chroma blocks in the photo (each block's mean colour and mean grey agree, so a block across an ink's
    # edge is a mix of paper and ink, R-B where the paper's ratio puts it, and only rust stands over it), over 12: finer, where a spot fills a counter. It also marks the warmer
    # patches of the paper, where it changes nothing (FR)
    _b=cv2.resize(im.astype(np.float32),(im.shape[1]//2,im.shape[0]//2),interpolation=cv2.INTER_AREA);_S=_b.sum(2);_RB=_b[...,2]-_b[...,0];_pp=(_b.mean(2)>150).astype(np.float32)
    _rp=cv2.GaussianBlur(_RB/np.maximum(_S,1)*_pp,(0,0),20)/np.maximum(cv2.GaussianBlur(_pp,(0,0),20),1e-3)
    RUSTB=cv2.warpPerspective(cv2.resize(((_RB-_rp*_S)>12).astype(np.uint8),(im.shape[1],im.shape[0]),interpolation=cv2.INTER_NEAREST),T,(N,N),flags=cv2.INTER_NEAREST)>0;del _b,_S,_RB,_pp,_rp
    RBF=cv2.GaussianBlur(REC[...,2].astype(np.float32)-REC[...,0],(0,0),1.2)   # R-B at the trace's own blur: the ink is grey, the hands' brass brown (hands_lg)
RED=None;NOPR=None;HCUT=None   # NOPR: where Kirov 247's dial has no printing, only the hands' boss and shadows (hands_kr)
if KR:   # Kirov 247's serial, written in red ink (247): red over the other two channels by 40 (the paper's 0-10, the black ink's under 15, the brass hands' red 25-35
    # with their green close behind), blurred as the grey; ink wherever it is, for the serial's item
    _f=cv2.GaussianBlur(REC.astype(np.float32),(0,0),1.2);RED=(_f[...,2]-np.maximum(_f[...,1],_f[...,0]))>40;del _f
GM=GR if RUST is None else np.where(RUST,BG,GR)   # the grey the geometric printing is measured on: Lange 5177's with its rust taken for paper
def at(A,r,c=(0,0)):return (c[0]+r*np.sin(np.radians(A)),c[1]-r*np.cos(np.radians(A)))   # dial angle (deg clockwise from 12) and radius about c -> mm
U=(0.0,-23.0);SD=(0.0,23.0)

# ---------------- 2. the geometric printing, measured ----------------
def edges(c,r0,r1,angs):
    """the median radial profile about c (mm) over the angles angs, r0 to r1 (mm): its runs of ink [(in, out, width)] (mm), the edges at half way from
    paper to ink, the width as the dip's area over the full contrast"""
    r=np.arange(r0,r1,0.005);v=np.median(prof(GM,mm2r(c),r*PX,angs),0);B=prof(BG,mm2r(c),r*PX,angs).mean();th=(B+INK)/2
    d=v<th;e=np.flatnonzero(np.diff(d.astype(int)));f=lambda k:r[k]+(th-v[k])/(v[k+1]-v[k])*0.005;R=[]
    for i in range(len(e)-1):
        if d[e[i]+1]:x,y=f(e[i]),f(e[i+1]);m=(r>x-0.25)&(r<y+0.25);R.append((float(x),float(y),float(np.clip((B-v[m])/(B-INK),0,1).sum()*0.005)))
    return R
def runs_ang(c,r,band=0.0,st=0.01):
    """dark runs round a circle of radius r (mm) about c: [(angle in, angle out)] (deg clockwise from 12), the grey averaged over r ± band"""
    A=np.arange(-30,330,st);rr=np.linspace(r-band,r+band,5) if band else np.array([r]);V=prof(GM,mm2r(c),rr*PX,A).mean(1);B=prof(BG,mm2r(c),rr*PX,A).mean(1)
    d=V<(B+INK)/2;e=np.flatnonzero(np.diff(d.astype(int)));return [(float(A[e[i]+1]),float(A[e[i+1]])) for i in range(len(e)-1) if d[e[i]+1]]
def sigma(c,r,angs):
    """the photo's blur here (mm): an erf fitted to the mean profile across a circle's outer edge (the paper side of a line r about c)"""
    from scipy.special import erf
    x=np.arange(-0.3,0.3,0.005);v=np.median(prof(GM,mm2r(c),(r+x)*PX,angs),0)
    f=least_squares(lambda q:q[0]+q[1]*erf((x-q[2])/(np.sqrt(2)*abs(q[3])))-v,[100,80,0,0.05]);return abs(f.x[3])
def corner(c,r0,r1,a0,a1,sg):
    """a white box's corner radius (mm): along each corner's diagonal, the half way crossing's distance from the sides' crossing, less a sharp corner's
    under the blur (0.77 sigma), over (sqrt 2 - 1); the mean of the four. r0, r1, a0, a1: the box's sides (their half way edges)"""
    out=[]
    for r,sr in((r0,1),(r1,-1)):
        for A,sa in((a0,1),(a1,-1)):
            t=np.radians(A);er=np.array([np.sin(t),-np.cos(t)]);et=np.array([np.cos(t),np.sin(t)]);p=np.array([c[0],c[1]])+r*er;dv=(sr*er+sa*et)/np.sqrt(2)
            s=np.arange(0,0.5,0.002);q=mm2r(p[None,:]+s[:,None]*dv[None,:]);v=map_coordinates(GM,[q[:,1],q[:,0]],order=1);B=map_coordinates(BG,[q[:,1],q[:,0]],order=1)
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
    if LG:return measure_lg()
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
def measure_lg():
    """Lange 5177's printing, as measure() (its hands elsewhere: the minute hand at 250, the seconds hand's pointer at 270.7 over the track, the up-and-down hand at 300);
    its up-and-down sub-dial differs: the circle open at the top (its ends), the band two thin lines whose end strokes at 0 and 56 run on inward past the inner line"""
    TS,SS,S23,SRA,UHA=(set(range(41,46)),{2,3,4,32,33,34},set(range(1,6))|set(range(31,36)),(30,90,150,210,270,330),344) if KR else (set(range(39,44)),{44,45,46},set(range(43,47)),(30,90,150,210,330),302)   # Kirov 247's hands: the minute hand over 42-44, the seconds hand's pointer at 3 and tail at 33, the up-and-down hand at 344 (in the gap)
    G={};TCt=tuple(TC);sg=sigma(TCt,RAD['track_out']+0.11,[m*6+3 for m in range(60) if m not in TS]);G['blur']=sg
    G['track']=track(TCt,41.8,45.8,60,TS,sg)   # the minute hand crosses 40-43 (Kirov 247's 42-44)
    G['sec']=track(SD,15.8,19.3,60,SS,sg)   # the seconds hand's pointer (45; Kirov 247's pointer and tail)
    for k in('track','sec'):   # a division the rust still moves or widens (its angle 0.6 deg off the rest's median offset, or its width outside 0.6-1.5 of its kind's): as one under a hand
        d=G[k]['div'];o=np.median([(a-i*6+180)%360-180 for i,(a,w) in d.items()]);mw={c:np.median([w for i,(a,w) in d.items() if (i%5==0)==c]) for c in(0,1)}
        G[k]['drop']=sorted(i for i,(a,w) in d.items() if abs((a-i*6+180)%360-180-o)>0.6 or not 0.6<w/mw[i%5==0]<1.5);G[k]['div']={i:v for i,v in d.items() if i not in G[k]['drop']}
    G['sec23']=edges(SD,10.9,12.1,[s*6+3 for s in range(60) if s not in S23])
    G['secrad']=[(a,w*np.pi/180*13.2) for a,w in [((x+y)/2,y-x) for x,y in runs_ang(SD,13.2,band=0.6)] if min(abs(a-q) for q in SRA)<1.5]   # the radial lines at 5, 15 ... 55 s (Lange's 45 under the hand)
    ua=[22.5+45*k for k in range(8)]
    G['udc']=edges(U,12.5,13.6,[a for a in np.arange(0,360,2) if 30<a<330])   # the up-and-down sub-dial's circle, its gap left out
    E=edges(U,7.0,9.6,[a+22.5 for a in ua[:-1]]);G['udb']=dict(li=E[0],lo=E[-1])
    rm=(E[0][1]+E[-1][0])/2;R=runs_ang(U,rm,band=(E[-1][0]-E[0][1])/5)
    G['udb']['div']=[((x+y)/2,(y-x)*np.pi/180*rm) for x,y in R if min(abs((x+y)/2-q) for q in ua)<2]
    dv=sorted(G['udb']['div']);G['udb']['corner']=float(np.median([corner(U,E[0][1],E[-1][0],a+w*90/np.pi/rm,b-v*90/np.pi/rm,sg) for (a,w),(b,v) in zip(dv,dv[1:]) if not (a<UHA<b)]))
    # the end strokes' tails: each stroke's angle and width on a circle between the inner line and where it ends (r 6.9), then its inner end along it: where the darkest
    # point across it (+-0.1 mm, so a stroke a little off the radius is followed) crosses half way from the paper to the ink
    G['udend']=[]
    for A in(22.5,-22.5):
        a,w=min([((x+y)/2,y-x) for x,y in runs_ang(U,6.9,band=0.15)],key=lambda q:abs(q[0]-A));r=np.arange(5.0,7.4,0.005)
        v=np.array([prof(GM,mm2r(U),np.array([q*PX]),a+np.degrees(np.arange(-0.1,0.11,0.02)/q)).min() for q in r]);th=(prof(BG,mm2r(U),r*PX,[a]).mean()+INK)/2
        k=np.flatnonzero(v<th)[0];G['udend'].append((a%360,w*np.pi/180*6.9,float(r[k-1]+(th-v[k-1])/(v[k]-v[k-1])*0.005)))
    # the circle's ends at its gap: along it (its lines' middle, +-0.05), from 60 deg left of 12 to 60 right, the first ink-to-paper and the last paper-to-ink crossing (the 12's
    # legs stand in the gap between them)
    rc=(G['udc'][0][0]+G['udc'][0][1])/2;A=np.arange(-60,60,0.01);rr=np.linspace(rc-0.05,rc+0.05,3);V=prof(GM,mm2r(U),rr*PX,A).mean(1);B=prof(BG,mm2r(U),rr*PX,A).mean(1)
    e=np.flatnonzero(np.diff((V<(B+INK)/2).astype(int)));G['udgap']=(float(A[e[0]]+360),float(A[e[-1]+1]))
    return G
def geo_print(G):
    f=lambda q:f'{q[0]:.3f}-{q[1]:.3f} (w {q[1]-q[0]:.3f}, area {q[2]:.3f})'
    print(f"blur sigma {G['blur']:.3f} mm")
    for k in('track','sec'):
        T=G[k];d=T['div'];hrs=[w for i,(a,w) in d.items() if i%5==0];mins=[w for i,(a,w) in d.items() if i%5];off=[a-i*6 for i,(a,w) in d.items()];off=[(o+180)%360-180 for o in off]
        if 'drop' in T:print(f"{k}: divisions left out (rust): {T['drop']}")
        print(f"{k}: inner line {f(T['li'])}, outer line {f(T['lo'])}; divisions every 6 deg {np.median(mins):.3f} ({min(mins):.3f}-{max(mins):.3f}), every 30 deg {np.median(hrs):.3f} ({min(hrs):.3f}-{max(hrs):.3f}); their angles off the nominal {np.mean(off):+.3f} deg (sd {np.std(off):.3f}); box corners r {T['corner']:.3f}")
    print('sec Ø23 circle',f(G['sec23'][0]) if G['sec23'] else '-');sr=[w for a,w in G['secrad']];print(f"sec radial lines {np.median(sr):.3f} ({min(sr):.3f}-{max(sr):.3f}), {len(sr)} widths at r 12.6-13.8")
    print('ud circle',f(G['udc'][0]));B=G['udb'];print(f"ud band: inner line {f(B['li'])}, outer line {f(B['lo'])}; divisions",', '.join(f'{a:.2f}:{w:.3f}' for a,w in sorted(B['div'])),f"; box corners r {B['corner']:.3f}")
    if 'udend' in G:print('ud band end strokes (angle, width at r 6.9, inner end):',', '.join(f'{a:.2f}:{w:.3f}:{r:.3f}' for a,w,r in G['udend']),f"; the circle's gap from {G['udgap'][0]:.2f} to {G['udgap'][1]:.2f} deg")
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
    if KR:return hands_kr()
    if LG:return hands_lg()
    p,u=hand_line(SD,117.2,3,18.5);L['seconds']=(p,u);m|=capsule(p,u,(np.array(SD)-p)@u,(np.array(at(117.2,S_IN,SD))-p)@u,0.34)
    p,u=hand_line(U,326.8,2.5,7);L['updown']=(p,u);m|=capsule(p,u,(np.array(U)-p)@u,(np.array(at(326.8,10.4,U))-p)@u,0.22)
    sat=(REC.max(2).astype(int)-REC.min(2).astype(int))>20;cor=np.zeros((N,N),bool)
    for A,r0,r1,hw in((248.85,3,47,1.6),(106.9,3,36,3.2)):   # the minute and hour hands' corridors (their lines measured as the others', 5-30 and 5-15 mm out)
        p,u=hand_line((0,0),A,5,30 if r1>40 else 15);L['minute' if r1>40 else 'hour']=(p,u);cor|=capsule(p,u,-4,r1,hw)
    gold=cv2.morphologyEx((sat&cor).astype(np.uint8),cv2.MORPH_CLOSE,disk(1.2));gold=(cv2.dilate(gold,disk(0.35))>0)&cor;return m,gold,L
def hands_lg():
    """Lange 5177's hands, as hands(): the seconds hand's pointer along 270.7 deg (its line from 3 to 18 mm out) to its tip over the track's outer line (19.9 out), 0.34 either side;
    its teardrop counterpoise at 88.3 deg (2-8 mm) to 10.6 out, 1.1 either side (inside the Ø 23 circle: nothing printed there); the up-and-down hand at 300.3 deg (2.5-8 mm) to
    its tip 9.8 out, against the 48's 4, 0.3 either side; the minute and hour hands in their corridors
    (lines at 250.1 and 112.5 deg measured 5-30 and 5-15 mm out): the tarnished brass by its colour, brown where the ink is grey (a darkness alone takes the 8's top
    with the minute hand), closed by a 0.4 mm disk and grown by a 0.2 mm one"""
    m=np.zeros((N,N),bool);L={}
    p,u=hand_line(SD,270.7,3,18);L['seconds']=(p,u);m|=capsule(p,u,(np.array(SD)-p)@u,(np.array(at(270.7,19.9,SD))-p)@u,0.34)
    p,u=hand_line(SD,88.3,2,8,6);L['tail']=(p,u);m|=capsule(p,u,-1,10.6,1.1)
    p,u=hand_line(U,300.3,2.5,8,6);L['updown']=(p,u);m|=capsule(p,u,(np.array(U)-p)@u,(np.array(at(300.3,9.8,U))-p)@u,0.3)
    dark=(GR<(BG+INK)/2)&(RBF>=0.5*GR+8);cor=np.zeros((N,N),bool)   # the hands' brass brown where the ink is grey (as ink())
    for A,r1,hw,nm in((250.06,47,1.15,'minute'),(112.54,26,3.2,'hour')):p,u=hand_line((0,0),A,5,30 if nm=='minute' else 15,4 if nm=='minute' else 6);L[nm]=(p,u);s0=-p@u;cor|=capsule(p,u,s0-4,s0+r1,hw)   # r1 from the centre
    p,u=L['hour'];s0=-p@u;cor|=capsule(p,u,s0+26,s0+35.6,0.45)   # past its spade (Ø 5.2 at 22.5: 05 02 00-2) its blade, 0.6 wide at 30 to 0.5 at 35, its tip over the 4's apex: the corridor narrowed to it
    gold=cv2.morphologyEx((dark&cor).astype(np.uint8),cv2.MORPH_CLOSE,disk(0.4));gold=(cv2.dilate(gold,disk(0.2))>0)&cor;return m,gold,L
def hands_kr():
    """Kirov 247's hands, as hands(): the seconds hand blued, its pointer along 23 deg (its line from 3 to 10 mm out) to its tip short of the track (9.6 out), its tail along
    200 deg (3-15 mm) to 17 out, both 0.3 either side; the up-and-down hand blued at 344 deg (2.5-7 mm) to its tip 8.6 out, 0.3 either side; the minute and hour hands brass,
    by their colour (as Wempe 3955's: the photo's channels over 20 apart) in their corridors (lines at 257 and 110 deg measured 5-30 and 5-15 mm out), closed over 1.2 mm
    and grown 0.35; and their bosses, brass, a disc r 3.4 about the centre (over the logo's foot: the 1 of 1МЧЗ stands clear of it)"""
    m=np.zeros((N,N),bool);L={}
    p,u=hand_line(SD,23.0,3,10,6);L['seconds']=(p,u);m|=capsule(p,u,(np.array(SD)-p)@u,(np.array(at(23.0,9.6,SD))-p)@u,0.3);s1=(np.array(SD)-p)@u
    m|=capsule(p,u,s1+5.8,s1+9.8,0.6)   # its head, a lance about 1 wide from 6 to 9.6 out (over the serial's 4 and 7)
    p,u=hand_line(SD,200.0,3,15,6);L['tail']=(p,u);m|=capsule(p,u,-1,17,0.3)
    p,u=hand_line(U,344.0,2.5,7,6);L['updown']=(p,u);m|=capsule(p,u,(np.array(U)-p)@u,(np.array(at(344.0,8.6,U))-p)@u,0.3)
    m|=rad(SD)<1.3;m|=rad(U)<1.5   # their bosses
    sat=(REC.max(2).astype(int)-REC.min(2).astype(int))>20;sat&=~(RED if RED is not None else False);cor=rad((0,0))<3.4
    for A,r1,hw,nm in((258.0,47,1.6,'minute'),(110.3,36,3.2,'hour')):p,u=hand_line((0,0),A,5,30 if nm=='minute' else 15,6);L[nm]=(p,u);s0=-p@u;cor|=capsule(p,u,s0-4,s0+r1,hw)   # r1 from the centre
    gold=cv2.morphologyEx((sat&cor).astype(np.uint8),cv2.MORPH_CLOSE,disk(1.2));gold=(cv2.dilate(gold,disk(0.35))>0)&cor
    # the hands' boss (brass, its dark rim and nut, r 4.2 and 1 mm off the centre in the photo: it stands over the dial) and their shadows, grey, cast down onto the
    # paper below them, aren't ink: nothing is printed there (NOPR, cut from the ink, not filled in: filled from their dark surroundings they stay dark): about the
    # boss between the words and the mark (|x| < 4.4, z -3.3 to 4.4: ИМЕНИ's last letter and КИРОВА's first stand 4.5 out, 1МЧЗ's foot at -3.4), and the corridors,
    # widened 1 mm for the shadows, below the words' baseline (z 1.6: the words lie from -1.6 to 1.3)
    global NOPR;NOPR=((np.abs(XM)<4.4)&(ZM>-3.3)&(ZM<4.4))|(rad((-0.3,-0.95))<3.35)   # and the boss's own circle (its ring traced: centre -0.3, -0.95, r 3.2), its dark top edge clear of the Ч by 0.06
    for nm,hw in(('minute',2.6),('hour',4.2)):p,u=L[nm];s0=-p@u;NOPR|=capsule(p,u,s0-4,s0+(47 if nm=='minute' else 36),hw)&(ZM>1.6)
    # the minute hand's body and its dark upper edge where it passes under ИМЕНИ's last letter (its lower corner hidden: GLYPH_FROM): its line refitted through its brass
    # (the darkest points, hand_line's, lie on its shadow, 1 mm below it here), 4-12 mm out
    q=gold&(rad((0,0))>4)&(rad((0,0))<12)&(XM<0);P=np.c_[XM[q],ZM[q]];pm=P.mean(0);uu=np.linalg.svd(P-pm,full_matrices=False)[2][0];uu=uu if uu[0]<0 else -uu
    s0=-pm@uu;global HCUT;HCUT=capsule(pm,uu,s0+3.5,s0+12,0.9);m|=HCUT
    return m,gold,L
# where each item lies (mm): a numeral, figure or mark by a circle round its middle (r), a word by its box; every component of the ink whose centre falls in one is its
ITEMS={**{f'h{h}':('c',at(h*30,37.0),6.5) for h in range(1,13) if h!=6},   # the hours, 6 left out (the seconds sub-dial)
       **{f'u{8*k}':('c',at(22.5+45*k,10.9,U),3.4) for k in range(8)},   # the up-and-down figures 0 8 ... 56 (each set off its division toward the gap: the 0 at 11 deg, the 56 at 327)
       **{f's{10*q}':('c',at(60*q,14.0,SD),2.9) for q in range(1,7)},   # the seconds figures 10 ... 60
       'serial':('b',(-4.5,15.3,4.5,19.3)),'anchor':('b',(-3.2,25.5,3.2,33.8)),
       'chrono':('b',(-24,-9.5,24,-3.5)),'wempe':('b',(-28,-3,-14,1.8)),'hamburg':('b',(10,-3,28.5,1.8))}
# a glyph a hand hides, taken from another of the same series at the same size: target item, donor item, the donor's turn onto the target (deg). The seconds
# hand runs through the 0 of 20 (its stroke and counter cut by 0.45 mm): the 0 of 50, set radially at the same angle (both -60 deg), fitted on what shows
GLYPH_FROM=[('s20','s50',0.0)]
if LG:   # Lange 5177's: the hours (6 left out), the up-and-down figures and Ab, Auf over the band's ends, the seconds figures, the serial, the name on three lines
    ITEMS={**{f'h{h}':('c',at(h*30,36.0),6.5) for h in range(1,13) if h!=6},**{f'u{8*k}':('c',at(22.5+45*k,10.7,U),3.0) for k in range(8)},**{f's{10*q}':('c',at(60*q,14.2,SD),2.9) for q in range(1,7)},
           'ab':('b',(-9.6,-38.6,-4.6,-34.2)),'auf':('b',(4.6,-38.6,9.9,-34.2)),'serial':('b',(-6.5,13.3,6.5,18.4)),
           'lange':('b',(-25,-9,26,-3.6)),'glashutte':('b',(-28.5,-3.6,-4.5,2.2)),'dresden':('b',(5,-3.6,29.5,2.2))}
    GLYPH_FROM=[]
# a glyph whose hidden part is completed from its own outline: the minute hand's shadow lies over the 8's top (0.3-0.6 mm of it, from 1.2 left of its middle to 0.4
# right): the upper loop's outer edge, where it shows (above the upper counter's middle), fitted with an ellipse, the hidden pixels inside it ink
if KR:   # Kirov 247's: the hours (6 left out), the up-and-down figures (the 0 and the 56 set toward the gap, at 31 and 328 deg) and СПУСК, ЗАВОД along its circle's top
    # outside it (sectors: centre, radii, angles), the seconds figures, the serial (red), the factory's mark 1МЧЗ and ИМЕНИ КИРОВА
    UA=[31.0,68.0,113.0,152.0,202.0,245.0,291.0,328.0]
    ITEMS={**{f'h{h}':('c',at(h*30,36.3),6.5) for h in range(1,13) if h!=6},**{f'u{8*k}':('c',at(UA[k],10.5,U),2.6) for k in range(8)},**{f's{10*q}':('c',at(60*q,13.9,SD),2.6) for q in range(1,7)},
           'spusk':('s',U,13.5,17.0,290.0,352.0),'zavod':('s',U,13.5,17.0,8.0,70.0),'serial':('b',(-6.0,13.0,6.0,20.2)),
           'mchz':('b',(-7.5,-11.8,7.5,-3.7)),'imeni_i':('b',(-20.5,-2.2,-17.3,2.4)),'imeni':('b',(-17.3,-2.2,-8.2,2.4)),'imeni_i2':('b',(-8.2,-2.2,-4.5,2.4)),'kirova':('b',(4.5,-2.2,26.0,2.4))}
    GLYPH_FROM=[('imeni_i2','imeni_i',0.0)]   # the word's last И (imeni_i2), its lower corner under the minute hand, from its first (imeni_i: the same glyph, the word set straight); imeni the МЕН between
ELLFILL=[] if KR else ['h8']   # Lange 5177's too: its minute hand lies over the 8's upper loop's top left
# Lange 5177's 16, its 1 lost under rust but for a fleck: no up-and-down figure has another 1, so the seconds 10's 1 (the same face, larger), scaled to the up-and-down
# figures' height (each series' median digit height, measured in its own upright frame), turned from the 10's 60 deg to the 16's -67.5 (the figures in a sub-dial's lower
# half stand with their tops inward), and set by the 16's 6 as the 10's 1 stands by its 0
SCALED_FROM=[('u16','s10',60.0,-67.5)] if LG and not KR else []
def scaled(C):
    rep=[];FA={**{f'u{8*k}':22.5+45*k for k in range(8)},**{f's{10*q}':60*q for q in range(1,7)}}
    def hgt(q,A):
        ys,xs=np.nonzero(q[2]);t=np.radians(A);return np.ptp(-(xs/PX)*np.sin(t)+(ys/PX)*np.cos(t))   # extent along the figure's up
    for tgt,don,ad,at_ in SCALED_FROM:
        k=np.median([hgt(q,FA[q[0]]) for q in C if q[0] in FA and q[0][0]=='u' and q[3]>0.5])/np.median([hgt(q,FA[q[0]]) for q in C if q[0] in FA and q[0][0]=='s' and q[3]>0.5])
        T=[q for q in C if q[0]==tgt];six=max(T,key=lambda q:q[3]);D=sorted([q for q in C if q[0]==don],key=lambda q:q[3]);d1,d0=D[0],D[-1]
        for q in T:
            if q is not six:C.remove(q)
        th=np.radians(at_-ad);v=(np.asarray(d1[4])-np.asarray(d0[4]))*k;v=np.array([v[0]*np.cos(th)-v[1]*np.sin(th),v[0]*np.sin(th)+v[1]*np.cos(th)]);c=np.asarray(six[4])+v
        m=d1[2].astype(np.uint8);n=int(max(m.shape)*1.5)+4;Mk=np.zeros((n,n),np.uint8);y0,x0=(n-m.shape[0])//2,(n-m.shape[1])//2;Mk[y0:y0+m.shape[0],x0:x0+m.shape[1]]=m
        cy,cx=np.argwhere(Mk).mean(0);R=cv2.getRotationMatrix2D((cx,cy),-(at_-ad),k);R[:,2]+=[n/2-cx,n/2-cy];Mk=cv2.warpAffine(Mk*255,R,(n,n),flags=cv2.INTER_LINEAR)>127
        q0=mm2r(c);sl=(slice(int(round(q0[1]-n/2)),int(round(q0[1]-n/2))+n),slice(int(round(q0[0]-n/2)),int(round(q0[0]-n/2))+n));C.append([tgt,sl,Mk,Mk.sum()/PX**2,c])
        rep.append(f'{tgt}: its 1 from the 1 of {don}, scaled {k:.3f}, turned {at_-ad:g} deg, at ({c[0]:.2f}, {c[1]:.2f}), {len(T)-1} fragment(s) under the rust dropped')
    return rep
# Lange 5177's serial: the last 7's stem broken by rust: the 7 before it (the same glyph, upright as it), set where it best covers what shows of the last (the pixels
# outside the rust: those inside one and not the other counted, every place within 1 mm tried)
RUST_FROM=[('serial',(2.3,5.5),(0.0,2.3))] if LG and not KR else []
def rust_from(C):
    rep=[]
    for it,(t0,t1),(d0,d1) in RUST_FROM:
        T=[q for q in C if q[0]==it and t0<q[4][0]<t1];d=max([q for q in C if q[0]==it and d0<q[4][0]<d1],key=lambda q:q[3]);D=d[2];pad=int(1.0*PX)
        y0=min(q[1][0].start for q in T)-pad;y1=max(q[1][0].stop for q in T)+pad;x0=min(q[1][1].start for q in T)-pad;x1=max(q[1][1].stop for q in T)+pad
        M=np.zeros((y1-y0,x1-x0),bool);vis=~RUST[y0:y1,x0:x1]
        for q in T:M[q[1][0].start-y0:q[1][0].stop-y0,q[1][1].start-x0:q[1][1].stop-x0]|=q[2]
        best=None
        for oy in range(0,M.shape[0]-D.shape[0]+1):
            for ox in range(0,M.shape[1]-D.shape[1]+1):
                P_=np.zeros_like(M);P_[oy:oy+D.shape[0],ox:ox+D.shape[1]]=D;e=((P_^M)&vis).sum()
                if best is None or e<best[0]:best=(e,P_)
        for q in T:C.remove(q)
        C.append([it,(slice(y0,y1),slice(x0,x1)),best[1],best[1].sum()/PX**2,r2mm(np.argwhere(best[1]).mean(0)[::-1]+[x0,y0])])
        rep.append(f'{it}: its piece(s) at x {t0}-{t1} ({len(T)}, broken by rust) replaced by its glyph at x {d0}-{d1}, fitted on what shows ({100*best[0]/max(1,(M&vis).sum()):.1f} % of the visible ink differs)')
    return rep
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
    g8=np.clip(GR,0,255).astype(np.uint8);g8=cv2.inpaint(g8,((H&~HCUT) if HCUT is not None else H|Au).astype(np.uint8),int(0.3*PX),cv2.INPAINT_TELEA)   # Kirov 247's brass hands cut out below, not filled (filled, their patch takes the letters' black)
    I=g8.astype(float)<(BG+INK)/2
    if RED is not None:   # Kirov 247's serial, in red: in its box the red alone (no grey: the blued seconds hand crosses it, and red leaves it out unfilled), red over the
        # other channels half way from the paper (0-16) to the stroke's own core (80-95; 50-60 in the 2), as the black ink's edges are taken: its strokes 0.40-0.45 wide
        bx=ITEMS['serial'][1];sb=(XM>bx[0])&(XM<bx[2])&(ZM>bx[1])&(ZM<bx[3]);rf=cv2.GaussianBlur(REC.astype(np.float32),(0,0),1.2)
        rd=rf[...,2]-np.maximum(rf[...,1],rf[...,0]);lm=cv2.dilate(rd,disk(0.5))   # each stroke half way to its own core (the 2's pen ran lighter: its cores 50-60), where its core is ink (over 40)
        I[sb]=(cv2.morphologyEx(((rd>0.5*lm)&(lm>40)&(rd>16.5)).astype(np.uint8),cv2.MORPH_CLOSE,disk(0.15))>0)[sb]
        # what the hand hides, drawn as straight pen strokes 0.42 wide on from what shows (estimated): the 4's upright, which shows at x 1.59 from its top (z 16.85, paper
        # above it) to the crossbar (17.95), on down under the hand's stem to the line's foot (z 19.25: the 7's foot, the 2's stroke 19.26); the 7's bar, which shows at
        # z 15.46 from the hand's head (x 3.95) to its corner (5.2), on 0.4 under the head (to 3.55: as little as the strokes allow)
        sk=np.zeros(I.shape,np.uint8);w=int(round(0.42*PX))
        for a,b in(((1.59,16.85),(1.59,19.25)),((3.55,15.46),(4.1,15.46))):cv2.line(sk,tuple(int(round(v)) for v in mm2r(a)),tuple(int(round(v)) for v in mm2r(b)),1,w)
        I|=(sk>0)&sb
    if LG and not KR:   # Lange 5177's rust: in its block mark ink only FR of the way from the ink to the paper; in its blurred mark (which leaves the ink's edges alone) only what is
        # as dark as the ink's cores (CORE) and grey, not brown (R-B under 0.3 of the grey + 4: a spot's dark heart, which fills the counters of the 10 and the 30)
        I[RUSTB]=(g8.astype(float)<INK+FR*(BG-INK))[RUSTB];I&=~RUST|((g8<CORE)&(RBF<0.3*g8+4))
    thick=cv2.morphologyEx(I.astype(np.uint8),cv2.MORPH_OPEN,disk(0.6))>0;m=0.1
    T,S,B=G['track'],G['sec'],G['udb'];rt,rs,ru=rad(TC),rad(SD),rad(U)
    X=((rt>T['li'][0]-m)&(rt<T['lo'][1]+m))|((rs>S['li'][0])&(rs<S['lo'][1]))|((ru>B['li'][0]-m)&(ru<B['lo'][1]+m))
    X|=(rs>G['sec23'][0][0]-m)&(rs<G['sec23'][0][1]+m)
    for A,w in [(30+60*k,np.median([w for _,w in G['secrad']])) for k in range(6)]:t=np.radians(A);d=(XM-SD[0])*np.sin(t)-(ZM-SD[1])*np.cos(t);e=np.abs((XM-SD[0])*np.cos(t)+(ZM-SD[1])*np.sin(t));X|=(d>11)&(d<17)&(e<w/2+m)
    X|=(ru>G['udc'][0][0]-m)&(ru<G['udc'][0][1]+m)&~thick
    # (the seconds track's band is cut at its edges exactly: it is drawn over the 7 and the 5, which must run up to it)
    X|=rt>T['lo'][1]+m   # nothing is printed outside the minute track
    if NOPR is not None:X|=NOPR|Au|HCUT   # Kirov 247's: the hands' boss and shadows, the brass hands, and the minute hand's band under ИМЕНИ's last letter, cut (not filled)
    if LG:   # Lange 5177's band's end strokes, where they run on inward past its inner line
        for A,w,r0 in G['udend']:t=np.radians(A);d=(XM-U[0])*np.sin(t)-(ZM-U[1])*np.cos(t);e=np.abs((XM-U[0])*np.cos(t)+(ZM-U[1])*np.sin(t));X|=(d>r0-m)&(d<B['li'][1])&(e<w/2+m)
    else:   # the hands' boss stands close under CHRONOMETERWERKE, a thread of shadow joining it to the E: the word's ink ends at its baseline (the letters' lowest row)
        w=(np.abs(XM)>4)&(np.abs(XM)<24)&(ZM>-9)&(ZM<-3.5)&I;BL=ZM[w].max();X|=(np.abs(XM)<4)&(ZM>BL+1/PX)&(ZM<-3)
    I=I&~X;near=(rs>S['li'][0]-0.2)&(rs<S['lo'][1]+0.2);I[near]=(cv2.morphologyEx(I.astype(np.uint8),cv2.MORPH_OPEN,disk(0.12))>0)[near]   # the track's blurred fringe, under 0.12 mm, along its edges
    return I,X
def item_of(cx,cz):
    """the item a component's centre falls in (a box, or the circle it is deepest in)"""
    best=None
    for k,v in ITEMS.items():
        if v[0]=='b' and v[1][0]<cx<v[1][2] and v[1][1]<cz<v[1][3]:return k
        if v[0]=='s':   # a sector about v[1]: radii v[2]-v[3], dial angles v[4]-v[5] (deg clockwise from 12)
            r=np.hypot(cx-v[1][0],cz-v[1][1]);A=np.degrees(np.arctan2(cx-v[1][0],-(cz-v[1][1])))%360
            if v[2]<r<v[3] and v[4]<A<v[5]:return k
        if v[0]=='c':
            d=np.hypot(cx-v[1][0],cz-v[1][1])/v[2]
            if d<1 and (best is None or d<best[0]):best=(d,k)
    return best and best[1]
def components(I):
    """the ink's components (8-connected), each [item, slice, its mask, area mm², centre mm]; those in no item and the specks listed apart"""
    n,lab,st,cen=cv2.connectedComponentsWithStats(I.astype(np.uint8),connectivity=8);out=[];left=[]
    for j in range(1,n):
        x,y,w,h,A=st[j];c=r2mm(cen[j]);A=A/PX**2;k=item_of(*c);sl=(slice(y,y+h),slice(x,x+w));q=[k,sl,lab[sl]==j,A,c]
        if RUST is not None and (RUST|RUSTB)[sl][q[2]].mean()>0.5:   # Lange 5177's: over half of it in either rust mark, and its dark (under 60) brown, R-B over 35 on the median:
            d=q[2]&(GR[sl]<60)   # a spot of rust (the streak over the S: 47; the ink under rust, the 5's top in the serial and the Ö's dot, 26 and 15)
            if not d.any() or np.median(RBF[sl][d])>35:k=None
        (out if k and A>=(SPECKH if k[0]=='h' else SPECK) else left).append(q)
    return out,left
def substitute(C,H):
    """GLYPH_FROM: each target's components under a hand replaced by the donor's component (turned) that best matches the target's ink outside the hand"""
    rep=[]
    for tgt,don,turn,*hid in GLYPH_FROM:
        H0=H;H=RUST if hid else H0   # hidden under a hand, or (Lange 5177's) under rust
        HT=H if HCUT is None else cv2.dilate(HCUT.astype(np.uint8),disk(0.1))>0   # Kirov 247's band is cut: a glyph is under it where it borders it
        for q in [q for q in C if q[0]==tgt and HT[q[1]][q[2]].any()]:
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
            rep.append(f'{tgt}: its component at ({q[4][0]:.2f}, {q[4][1]:.2f}) under the {"rust" if hid else "hand"} taken from {don} (turned {turn:g} deg; {100*sc:.1f} % of the visible pixels differ)')
        H=H0
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
    G=measure();H,Au,L=hands();I,X=ink(G,H,Au);C,left=components(I);rep=substitute(C,H)+ellfill(C,Au)+scaled(C)+rust_from(C);P={k:[c for q in C if q[0]==k for c in contours(q)] for k in ITEMS}
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
    if LG:h=("/* dialface_lange.js: the Lange dial's printing, traced off A. Lange & Söhne No. 5177's dial (References/wempe/photos/dg-chrono-dec/1_Lange_5177_Z.jpg, Johannes\n"
       "   Altmeppen 2017) by marine-chronometer-source/chronometer-working-model/tools/dialtrace.py --dial lange --write: generated, don't edit (rerun the tool). Part of the\n"
       "   Wempe model; declares only WDIALFACE_LANGE, as dialface.js's WDIALFACE: for each item (h1 ... h12 the hours, u0 ... u56 the up-and-down figures, ab and auf over\n"
       "   them, s10 ... s60 the seconds figures, serial, lange: A. LANGE & SÖHNE, glashutte, dresden: B/DRESDEN) its contours, filled even-odd, on the dial in 0.01 mm\n"
       "   (dial.js's P(): x right, z down, the centre arbor at 0, 0): each contour's first point, then its steps; | between contours. divm, divs: the minute and seconds\n"
       "   tracks' 60 divisions' angles as measured (0.01 deg clockwise from 12; those under a hand or moved by rust the nominal turned by the rest's mean offset). The\n"
       "   geometric printing is dial.js's, drawn from the numbers the tool measures (--dial lange --geo). The rust spots are wear, left out. */\n")
    if KR:h=("/* dialface_kirov.js: the Soviet 6MX's dial printing, traced off Kirov No. 247's dial (References/wempe/photos/dg-chrono-6mx/1_Kirow_247_Z.jpg, Johannes\n"
       "   Altmeppen 2017) by marine-chronometer-source/chronometer-working-model/tools/dialtrace.py --dial kirov --write: generated, don't edit (rerun the tool). Part of the\n"
       "   Wempe model; declares only WDIALFACE_KIROV, as dialface.js's WDIALFACE: for each item (h1 ... h12 the hours, u0 ... u56 the up-and-down figures, spusk and zavod\n"
       "   over them, s10 ... s60 the seconds figures, serial: 247 in red ink, mchz: the factory's mark, imeni_i, imeni, imeni_i2, kirova: the factory's name) its contours,\n"
       "   filled even-odd, on the dial in 0.01 mm (dial.js's P(): x right, z down, the centre arbor at 0, 0): each contour's first point, then its steps; | between\n"
       "   contours. divm, divs: the minute and seconds tracks' 60 divisions' angles as measured (0.01 deg clockwise from 12; those under a hand the nominal turned by the\n"
       "   rest's mean offset). The geometric printing is dial.js's, drawn from the numbers the tool measures (--dial kirov --geo). */\n")
    return h+('const WDIALFACE_KIROV={\n' if KR else 'const WDIALFACE_LANGE={\n' if LG else 'const WDIALFACE={\n')+',\n'.join(f'  {k}:"{enc(v)}"' for k,v in P.items())+f',\n  divm:"{ang(G["track"])}",\n  divs:"{ang(G["sec"])}"'+'};\n'

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
            u=await pg.evaluate(f"WDIAL.face(1,'{DIAL}').toDataURL('image/png')");await b.close();return u
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
