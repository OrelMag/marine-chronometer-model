"""drawbook_sheet.py: a part's sheets for drawbook.py, from drawbook_geo.py's views. Sheet 1 is the drawing as the Wempe's works drawings are laid out (DIN 6 first-angle
projection: the front view, the view from the left right of it, the plan below it; a turned part in half section, its axis up; a flat part's front view the section
A-A through its datum; sections hatched at 45 degrees; dimensions with filled arrows; lettering oblique; the title block in the sheet's lower right with the material,
scale, name and drawing number) with the part's render beside the views. Sheet 2 is its tables: the parts-list lines (material, treatment, fit), the holes (from the
datum, with their diameters, depths and sinks, probed on the solid along each hole's axis), the contour (lines and arcs, from the datum), the teeth.

Paper in mm; the part's own frame (drawbook_geo.frame): u right, v up the plan, w up the front view. The sheet's scale is the largest of SCALES at which its views and
their dimensions fit A4 upright, else A3 across."""
import datetime,html,json,math,pathlib
import numpy as np
import shapely
from shapely.geometry import Polygon,MultiPolygon,LineString,Point,box as sbox
from shapely.ops import unary_union
import drawbook_geo as G
import trimesh
SCALES=[50,20,10,5,2,1,0.5,0.25]
LW_VIS,LW_THIN,LW_HID=0.5,0.18,0.3
TXT=2.5;ARR=2.2           # lettering height and arrow length, printed mm
esc=lambda s:html.escape(str(s),quote=True)
f2=lambda v:(lambda t:'0.00' if t=='-0.00' else t)(f'{v:.2f}')
# ---------- the part analysed ----------
def plan_poly(m):
    """the plan: the union of the solid's triangles projected down w (u, v)"""
    V=m.vertices[:,:2];F=m.faces;T=V[F];a=0.5*np.abs((T[:,1,0]-T[:,0,0])*(T[:,2,1]-T[:,0,1])-(T[:,2,0]-T[:,0,0])*(T[:,1,1]-T[:,0,1]))
    T=T[a>1e-9];P=shapely.polygons(np.concatenate([T,T[:,:1]],axis=1))
    return shapely.union_all(P).buffer(0)
def loops2d(loops,ax,ay):
    """a section's loops in the paper's plane, filled even-odd (an inner loop a hole)"""
    acc=None
    for L in loops:
        if len(L)<3:continue
        p=Polygon(L[:,[ax,ay]]).buffer(0)
        if p.is_empty:continue
        acc=p if acc is None else acc.symmetric_difference(p)
    return acc if acc is not None else Polygon()
def intervals(m,u,v,w0,w1):
    """the solid's material along the line (u,v) parallel to w: [(lo,hi)...]"""
    loc,_,_=m.ray.intersects_location([[u,v,w1+1]],[[0,0,-1.]],multiple_hits=True)
    if not len(loc):return []
    z=np.sort(loc[:,2])[::-1];z=z[np.r_[True,np.diff(z)<-1e-6]] if len(z)>1 else z
    out=[(z[i+1],z[i]) for i in range(0,len(z)-1,2)]
    return out
def sub(A,B):
    """intervals A less intervals B"""
    out=[]
    for a0,a1 in A:
        segs=[(a0,a1)]
        for b0,b1 in B:
            nx=[]
            for s0,s1 in segs:
                if b1<=s0 or b0>=s1:nx.append((s0,s1));continue
                if b0>s0:nx.append((s0,b0))
                if b1<s1:nx.append((b1,s1))
            segs=nx
        out+=segs
    return [(a,b) for a,b in out if b-a>1e-3]
def hole_probe(m,cx,cy,radii,w0,w1):
    """a round hole about (cx, cy): each of its diameters with the depth it runs ([(dia, lo, hi)]), probed at four angles just inside and outside each radius"""
    out=[]
    for r in sorted(radii):
        d=min(0.015,0.08*r);walls=None
        for a in (0.37,1.94,3.51,5.08):
            ca,sa=math.cos(a),math.sin(a)
            Ii=intervals(m,cx+(r-d)*ca,cy+(r-d)*sa,w0,w1);Io=intervals(m,cx+(r+d)*ca,cy+(r+d)*sa,w0,w1)
            W=sub(Io,Ii)
            walls=W if walls is None else [(max(a0,b0),min(a1,b1)) for a0,a1 in walls for b0,b1 in W if min(a1,b1)>max(a0,b0)]
        Io=intervals(m,cx+(r+d)*0.8,cy+(r+d)*0.6,w0,w1)
        for lo,hi in walls or []:
            web=next(((a,b2) for a,b2 in Io if a<=lo+0.01 and b2>=hi-0.01),(lo,hi))
            out.append((2*r,lo,hi,web))
    return out
def holes_flat(m,top,w0,w1,plan=None):
    """the round holes seen in the plan: circles of the plan (seen or hidden) grouped about one centre, each group probed; a group whose smallest circle has material
    all through its middle is a boss or pin, not a hole"""
    C=[p for k in ('vis','hid') for p in top[k] if p[0]=='circle' and p[3]<8]
    for g in (getattr(plan,'geoms',[plan]) if plan is not None else []):                 # and the plan's round inner outlines (a hole through, its circle split by the views' runs)
        for ring in g.interiors:
            E=G.prims(np.asarray(ring.coords),0.004)
            if len(E)==1 and E[0][0]=='circle' and E[0][3]<8:C.append(E[0])
    groups=[]
    for _,cx,cy,r in C:
        for g in groups:
            if math.hypot(g[0]-cx,g[1]-cy)<0.02:g[2].add(round(r,3));break
        else:groups.append([cx,cy,{round(r,3)}])
    out=[]
    for cx,cy,R in groups:
        R=sorted(R);mid=intervals(m,cx,cy,w0,w1)
        if sum(b-a for a,b in mid)>0.98*(w1-w0):continue                       # solid along its axis: a boss
        prof=hole_probe(m,cx,cy,R,w0,w1)
        if not prof:continue
        out.append({'x':cx,'y':cy,'prof':prof,'open':[(a,b) for a,b in sub([(w0,w1)],mid)]})
    out.sort(key=lambda h:(round(-h['y'],1),h['x']))
    for i,h in enumerate(out):h['n']=i+1
    return out
def hole_text(h,w0,w1):
    """a hole's diameters as a maker reads them: the smallest through the web it crosses or to its depth from the face it opens on (named by that face's level
    above the part's bottom), the larger ones as sinks from their face"""
    P=sorted(h['prof'],key=lambda q:(q[0],-q[1]));t=[];eps=0.01
    face=lambda a,b2,web:('the top' if b2>w1-eps else f'the face at {f2(b2-w0)}') if b2>=web[1]-eps else ('the bottom' if a<w0+eps else f'the face at {f2(a-w0)}')
    d,lo,hi,web=P[0]
    if lo<=web[0]+eps and hi>=web[1]-eps:t.append(f'Ø {f2(d)} through'+('' if web[0]<w0+eps and web[1]>w1-eps else f' ({f2(web[1]-web[0])} thick at {f2(web[0]-w0)}-{f2(web[1]-w0)})'))
    else:t.append(f'Ø {f2(d)} × {f2(hi-lo)} deep from {face(lo,hi,web)}')
    for d,lo,hi,web in P[1:]:
        if hi-lo<0.02:t.append(f'countersunk to Ø {f2(d)}');continue
        t.append(f'sink Ø {f2(d)} × {f2(hi-lo)} from {face(lo,hi,web)}')
    return '; '.join(t)
def teeth(ring,cx,cy):
    """a toothed outline about (cx, cy): its tip and root diameters and the number of teeth (the peaks of its radius going round)"""
    P=np.asarray(ring.coords);d=np.hypot(P[:,0]-cx,P[:,1]-cy);a=np.unwrap(np.arctan2(P[:,1]-cy,P[:,0]-cx))
    if d.max()-d.min()<0.04*d.max() or abs(a[-1]-a[0])<6:return None
    o=np.argsort(a);a,d=a[o],d[o];g=np.linspace(a[0],a[0]+2*math.pi,4096,endpoint=False);dd=np.interp(g,a,d,period=2*math.pi)
    hi=d.min()+0.6*(d.max()-d.min());up=(dd>hi).astype(int);rise=np.flatnonzero(np.diff(np.r_[up,up[0]])==1);z=len(rise)
    if z<6 or d.max()-d.min()>0.35*d.max():return None                                  # a wheel's teeth are shallow against its size
    gaps=np.diff(np.r_[rise,rise[0]+len(g)])
    if gaps.std()>0.12*gaps.mean():return None                                         # and evenly spaced
    return {'z':z,'tip':2*d.max(),'root':2*d.min()}
def contour_elems(ring,tol):
    P=np.asarray(ring.coords);return G.prims(P,tol)
def analyse(dirp,k,ymid):
    m,meta=G.load(dirp,k);kind,T,share=G.frame(m,meta,ymid);m.apply_transform(T)
    b=m.bounds;A={'k':k,'meta':meta,'kind':kind,'share':share,'m':m,'T':T,'b':b}
    A['gear']=next((x['gear'] for x in meta['meshes'] if x.get('gear')),None)
    if kind=='turned':
        A['views']=['front']+(['top'] if share<0.985 else [])
        if share<0.985:                                                                 # the end view from the end less turned (a screw's slotted head, not its thread)
            Ps,_=trimesh.sample.sample_surface_even(m,3000,seed=2);L_=b[1,2]-b[0,2]
            Rm=trimesh.transformations.rotation_matrix(2*math.pi/7.3,[0,0,1],[0,0,0]);_,dist,_=trimesh.proximity.closest_point(m,trimesh.transform_points(Ps,Rm))
            off=dist>max(0.004,0.006*m.extents.max());lo=Ps[:,2]<b[0,2]+0.2*L_;hi=Ps[:,2]>b[1,2]-0.2*L_
            if (off[lo].mean() if lo.any() else 0)>(off[hi].mean() if hi.any() else 0):A['views'][1]='bottom'
        A['datum']=(0.0,0.0)
        loops,_=G.section(m,[0,0,0],G.VIEWS['front'][0]);A['sec']=loops2d([L for L in loops],0,2)
        return A
    # a flat part: its plan, its holes, its datum, the section through it
    A['plan']=plan_poly(m)
    A['views']=['front','top']+(['left'] if (b[1,2]-b[0,2])>max(2.0,0.25*min(b[1,0]-b[0,0],b[1,1]-b[0,1])) else [])
    return A
def finish_flat(A,top):
    """what needs the plan's view: the holes (its circles probed), the datum, the section through the datum"""
    m=A['m'];b=A['b'];w0,w1=b[0,2],b[1,2]
    A['holes']=holes_flat(m,top,w0,w1,A['plan'])
    c0=(A['T']@np.array([0,0,0,1.]))[:2]                                         # the movement's centre, in the part's frame
    ins=any(math.hypot(h['x']-c0[0],h['y']-c0[1])<0.05 for h in A['holes'])               # a plate on the centre arbor: the movement's centre; else the part's own
    if ins:A['datum']=tuple(c0);A['dname']="the movement's centre"
    elif A['holes']:
        h=max(A['holes'],key=lambda h:max(q[0] for q in h['prof']));A['datum']=(h['x'],h['y']);A['dname']=f"hole {h['n']}'s centre"
    else:A['datum']=(b[0,0],b[0,1]);A['dname']='the corner of its bounding box'
    dy=A['datum'][1]
    if not A['plan'].intersects(LineString([(b[0,0]-1,dy),(b[1,0]+1,dy)])):dy=(b[0,1]+b[1,1])/2
    A['cut']=dy
    loops,far=G.section(m,[0,dy,0],G.VIEWS['front'][0]);A['sec']=loops2d(loops,0,2);A['far']=far
    # the levels of its faces in the section: where the cut's outline runs across
    lev=set()
    for g in getattr(A['sec'],'geoms',[A['sec']]):
        for ring in [g.exterior,*g.interiors] if not g.is_empty else []:
            P=np.asarray(ring.coords)
            for p,q in zip(P[:-1],P[1:]):
                if abs(p[1]-q[1])<1e-4 and abs(p[0]-q[0])>0.05:lev.add(round(p[1],3))
    A['levels']=sorted(lev)
    # the teeth: the outline's radius going round the datum (a wheel's centre)
    A['teeth']=None
    ex=A['plan'].geoms if isinstance(A['plan'],MultiPolygon) else [A['plan']]
    if A['holes']:
        big=max(ex,key=lambda g:g.area);A['teeth']=teeth(big.exterior,*A['datum'])
# ---------- drawing on the paper ----------
class Pen:
    """SVG in printed mm; a view's part coordinates go through at(): X = ox + u sc, Y = oy - v sc"""
    def __init__(s):s.o=[]
    def add(s,x):s.o.append(x)
    def line(s,x0,y0,x1,y1,cls):s.add(f'<line class="{cls}" x1="{x0:.3f}" y1="{y0:.3f}" x2="{x1:.3f}" y2="{y1:.3f}"/>')
    def text(s,x,y,t,size=TXT,anchor='middle',rot=0,cls='t'):
        tr=f' transform="rotate({rot:.1f} {x:.3f} {y:.3f})"' if rot else ''
        s.add(f'<text class="{cls}" x="{x:.3f}" y="{y:.3f}" font-size="{size}" text-anchor="{anchor}"{tr}>{esc(t)}</text>')
    def arrow(s,x,y,dx,dy):
        """a filled arrow with its tip at (x, y) pointing along (dx, dy)"""
        l=math.hypot(dx,dy);dx/=l;dy/=l;w=ARR/6.0;bx,by=x-dx*ARR,y-dy*ARR
        s.add(f'<path class="ar" d="M{x:.3f} {y:.3f}L{bx-dy*w:.3f} {by+dx*w:.3f}L{bx+dy*w:.3f} {by-dx*w:.3f}Z"/>')
def prim_svg(p,X,Y,sc,cls):
    if p[0]=='line':return f'M{X(p[1]):.3f} {Y(p[2]):.3f}L{X(p[3]):.3f} {Y(p[4]):.3f}'
    if p[0]=='circle':
        cx,cy,r=X(p[1]),Y(p[2]),p[3]*sc;return f'M{cx-r:.3f} {cy:.3f}a{r:.3f} {r:.3f} 0 1 0 {2*r:.3f} 0a{r:.3f} {r:.3f} 0 1 0 {-2*r:.3f} 0'
    _,cx,cy,r,x0,y0,x1,y1,sg=p
    a0=math.atan2(y0-cy,x0-cx);a1=math.atan2(y1-cy,x1-cx);sw=(a1-a0)%(2*math.pi) if sg>0 else (a0-a1)%(2*math.pi)
    return f'M{X(x0):.3f} {Y(y0):.3f}A{r*sc:.3f} {r*sc:.3f} 0 {1 if sw>math.pi else 0} {0 if sg>0 else 1} {X(x1):.3f} {Y(y1):.3f}'
def hatch(poly,X,Y,sc,ang=45):
    """the section's area hatched with thin lines at 45 degrees, about 1 mm apart on the paper (closer in a small area); under 0.7 mm thick on the paper, filled"""
    if poly.is_empty:return ''
    P=shapely.affinity.affine_transform(poly,[sc,0,0,-sc,X(0),Y(0)])
    out=[]
    for g in getattr(P,'geoms',[P]):
        if g.is_empty:continue
        thin=g.buffer(-0.35).is_empty
        if thin:
            out.append('<path class="fill" d="'+''.join('M'+'L'.join(f'{x:.3f} {y:.3f}' for x,y in ring.coords)+'Z' for ring in [g.exterior,*g.interiors])+'"/>');continue
        x0,y0,x1,y1=g.bounds;sp=1.0 if max(x1-x0,y1-y0)>12 else 0.7;D=(x1-x0)+(y1-y0);d=''
        for t in np.arange(-D,D,sp):
            L=LineString([(x0+t,y1),(x0+t+D,y1-D)]).intersection(g)
            for s in getattr(L,'geoms',[L]):
                if s.is_empty or s.geom_type!='LineString':continue
                (a,b),(c,e)=s.coords[0],s.coords[-1];d+=f'M{a:.3f} {b:.3f}L{c:.3f} {e:.3f}'
        out.append(f'<path class="h" d="{d}"/>')
        out.append('<path class="v" d="'+''.join('M'+'L'.join(f'{x:.3f} {y:.3f}' for x,y in ring.coords)+'Z' for ring in [g.exterior,*g.interiors])+'"/>')
    return ''.join(out)
def dim_lin(pen,a,b,off,t,ext=True,small_out=True):
    """a linear dimension between paper points a and b, its line off (signed, mm) square to a-b, extension lines from the points, the text over the line
    (reading from the foot or from the right, DIN 406); too short for its arrows inside, they go outside"""
    ax,ay=a;bx,by=b;dx,dy=bx-ax,by-ay;l=math.hypot(dx,dy)
    if l<1e-6:return
    ux,uy=dx/l,dy/l;nx,ny=-uy,ux
    pa=(ax+nx*off,ay+ny*off);pb=(bx+nx*off,by+ny*off);sg=1 if off>=0 else -1
    if ext:
        for p,q in ((a,pa),(b,pb)):pen.line(p[0]+nx*sg*0.8,p[1]+ny*sg*0.8,q[0]+nx*sg*1.5,q[1]+ny*sg*1.5,'d')
    inside=l>2*ARR+1.0
    if inside:
        pen.line(*pa,*pb,'d');pen.arrow(*pa,-ux,-uy);pen.arrow(*pb,ux,uy)
    else:
        pen.line(pa[0]-ux*(ARR+2),pa[1]-uy*(ARR+2),pb[0]+ux*(ARR+2),pb[1]+uy*(ARR+2),'d');pen.arrow(*pa,ux,uy);pen.arrow(*pb,-ux,-uy)
    ang=math.degrees(math.atan2(uy,ux))
    if ang>90.01 or ang<=-90.01:ang+=180
    mx,my=(pa[0]+pb[0])/2,(pa[1]+pb[1])/2;tl=len(t)*TXT*0.55
    # the text above the line (toward the reader's top: -y on the paper for a level line, toward -x for an upright one)
    r=math.radians(ang);tx,ty=math.sin(r)*0.8,-math.cos(r)*0.8
    if not inside or tl>l-2:
        # beside the line, past its far end
        e=pb if (ux>0.5 or uy<-0.5) else pa;fx,fy=(ux,uy) if e is pb else (-ux,-uy)
        mx,my=e[0]+fx*(ARR+2.5+tl/2),e[1]+fy*(ARR+2.5+tl/2)
        pen.line(*e,e[0]+fx*(ARR+2.5+tl+0.5),e[1]+fy*(ARR+2.5+tl+0.5),'d')
    pen.text(mx+tx,my+ty,t,rot=ang)
def leader(pen,p,q,t,anchor='start'):
    pen.line(*p,*q,'d');pen.add(f'<circle class="dot" cx="{p[0]:.3f}" cy="{p[1]:.3f}" r="0.35"/>')
    pen.line(*q,q[0]+(len(t)*TXT*0.55+1)*(1 if anchor=='start' else -1),q[1],'d');pen.text(q[0]+(0.5 if anchor=='start' else -0.5),q[1]-0.7,t,anchor=anchor)
def centre_cross(pen,x,y,r):
    e=r+1.5;pen.line(x-e,y,x+e,y,'c');pen.line(x,y-e,x,y+e,'c')
# ---------- the views drawn and dimensioned ----------
def draw_view(pen,V,X,Y,sc):
    for key,cls in (('hid','hid'),('vis','vis')):
        d=''.join(prim_svg(p,X,Y,sc,cls) for p in V[key])
        if d:pen.add(f'<path class="{cls}" d="{d}"/>')
def turned(A,sc):
    """a turned part's front view, the left half as seen, the right half cut through its axis, hatched; its diameters across, its lengths chained up the left"""
    m=A['m'];b=A['b'];R=max(abs(b[0,0]),abs(b[1,0]))
    Vl=G.view(m,'front',sc,keep=lambda P:P[:,0]<=1e-6)
    loops,far=G.section(m,[0,0,0],G.VIEWS['front'][0])
    Vr=G.view(far,'front',sc,keep=lambda P:P[:,0]>=-1e-6) if far is not None and len(far.faces) else {'vis':[],'hid':[]}
    V={'vis':Vl['vis']+Vr['vis'],'hid':Vl['hid']}
    half=A['sec'].intersection(sbox(0,b[0,2]-1,R+1,b[1,2]+1)) if not A['sec'].is_empty else A['sec']
    half=half.simplify(2e-4,preserve_topology=True)                                   # a straight run split at a stray vertex is one run
    # the profile: the cut's outline right of the axis, its upright runs (diameters) and its level runs (shoulders)
    dia={};lev={round(b[0,2],3),round(b[1,2],3)};bores={}
    for g in getattr(half,'geoms',[half]):
        if g.is_empty or g.geom_type!='Polygon':continue
        for ring in [g.exterior,*g.interiors]:
            P=np.asarray(ring.coords)
            for p,q in zip(P[:-1],P[1:]):
                if abs(p[0]-q[0])<1e-4 and abs(p[1]-q[1])>max(0.04,0.01*(b[1,2]-b[0,2])) and p[0]>0.02:
                    mx=(p[0]+0.01,(p[1]+q[1])/2);outer=not g.buffer(1e-9).contains(Point(*mx))
                    D=round(2*p[0],3);(dia if outer else bores).setdefault(D,[]).append((min(p[1],q[1]),max(p[1],q[1])))
                    lev.add(round(p[1],3));lev.add(round(q[1],3))
                if abs(p[1]-q[1])<1e-4 and abs(p[0]-q[0])>0.02:lev.add(round(p[1],3))
    L=[];[L.append(z) for z in sorted(lev) if not L or z-L[-1]>0.03]
    return V,half,dia,bores,L,R
PAPER={'A4':(210,297),'A3':(420,297)};REND=56;GAP=7
def area(paper):
    """the drawing's room on the sheet: inside the frame (a 20 mm filing margin on the left, 10 elsewhere, 5 more inside), above the title block"""
    W,H=PAPER[paper];return (25,15,W-15,H-10-40-5)
def margins(A,sc):
    """the room each view's dimensions take round it, printed mm: (left, right, top, bottom)"""
    if A['kind']=='turned':return {'front':(30,26,5,5),'top':(5,5,7,5)}
    M={'front':(20,4,8,4),'top':(9,15,4,15)}
    if 'left' in A['views']:M['left']=(4,4,8,4)
    return M
def place(A,sc,paper):
    """the views' places in first angle (the front view, the view from the left right of it, the plan under it, the front and plan on one column so their
    projection lines meet) and the render's in the first free corner; None if they don't fit"""
    b=A['b'];ext=b[1]-b[0];x0,y0,x1,y1=area(paper);M=margins(A,sc)
    size={'front':(ext[0]*sc,ext[2]*sc),'top':(ext[0]*sc,ext[1]*sc),'left':(ext[1]*sc,ext[2]*sc)}
    vs=[v for v in ('front','top','left') if v in A['views'] or v=='top' and 'bottom' in A['views']]
    colx=x0+max(M[v][0] for v in vs if v in ('front','top'))
    P={'front':(colx,y0+M['front'][2])}
    if 'top' in vs:P['top']=(colx,P['front'][1]+size['front'][1]+M['front'][3]+GAP+M['top'][2])
    if 'left' in vs:P['left']=(colx+size['front'][0]+M['front'][1]+GAP+M['left'][0],P['front'][1])   # beside the front view (the plan's row is below it)
    blocks=[(P[v][0]-M[v][0],P[v][1]-M[v][2],P[v][0]+size[v][0]+M[v][1],P[v][1]+size[v][1]+M[v][3]) for v in vs]
    if any(r[0]<x0-0.01 or r[1]<y0-0.01 or r[2]>x1+0.01 or r[3]>y1+0.01 for r in blocks):return None
    hit=lambda r:any(r[0]<q[2] and q[0]<r[2] and r[1]<q[3] and q[1]<r[3] for q in blocks)
    cands=[(x1-REND,y0),(x1-REND,y1-REND-5)]
    if 'left' in vs:cands.append((P['left'][0],max(blocks[vs.index('left')][3]+4,y0)))
    cands+=[(max(r[2] for r in blocks)+GAP,y0),(x0,y1-REND-5),(x0,max(r[3] for r in blocks)+4)]
    rend=next(((x,y) for x,y in cands if x>=x0 and y>=y0 and x+REND<=x1 and y+REND+5<=y1 and not hit((x-2,y-2,x+REND+2,y+REND+7))),None)
    if rend is None:return None
    return {'P':P,'size':size,'M':M,'blocks':blocks,'rend':rend}
def choose(A):
    """the largest standard scale on A4; A3 where it gives a larger scale and A4 would print the part's largest view under 100 mm"""
    best={}
    for paper in ('A4','A3'):
        for sc in SCALES:
            L=place(A,sc,paper)
            if L:best[paper]=(sc,L);break
    ext=A['b'][1]-A['b'][0]
    if 'A4' in best and not('A3' in best and best['A3'][0]>best['A4'][0] and max(ext)*best['A4'][0]<100):return ('A4',*best['A4'])
    if 'A3' in best:return ('A3',*best['A3'])
    return 'A3',SCALES[-1],place(A,SCALES[-1],'A3')
def chain_v(pen,x,xedge,zs,Y,overall=None):
    """lengths chained up a line at x between the levels zs (part mm), each level's extension line from the part's edge at xedge; a span too short for its text
    has it set level beside the line, moved clear of its neighbours; too short for arrows, oblique ticks (DIN 406); then the whole length outside (overall: its x)"""
    ys=[Y(z) for z in zs]
    pen.line(x,min(ys),x,max(ys),'d')
    for y in ys:pen.line(xedge-1,y,x-1.5,y,'d')
    side=[]
    for (za,ya),(zb,yb) in zip(zip(zs,ys),zip(zs[1:],ys[1:])):
        l=abs(yb-ya);t=f2(abs(zb-za))
        if l>2*ARR+0.6:pen.arrow(x,ya,0,1 if ya>yb else -1);pen.arrow(x,yb,0,1 if yb>ya else -1)
        else:
            for y in (ya,yb):pen.line(x-0.8,y+0.8,x+0.8,y-0.8,'tk')
        if len(t)*TXT*0.55+1<l:pen.text(x-0.8,(ya+yb)/2,t,rot=-90)
        else:side.append([(ya+yb)/2,t])
    side.sort();last=-1e9
    for s in side:
        y=max(s[0],last+TXT+0.6);last=y
        pen.text(x-TXT-1.6,y+TXT*0.35,s[1],anchor='end')
        if abs(y-s[0])>0.3:pen.line(x-TXT-1.4,y,x-0.3,s[0],'d')
    if overall is not None:
        xo=overall;pen.line(xedge-1,ys[0],xo-1.5,ys[0],'d');pen.line(xedge-1,ys[-1],xo-1.5,ys[-1],'d')
        dim_lin(pen,(xo,ys[0]),(xo,ys[-1]),0,f2(abs(zs[-1]-zs[0])),ext=False)
def rising(pen,x,xedge,z0,zs,Y):
    """the levels zs from z0 dimensioned rising (DIN 406-11): one line at x from the origin's small circle, an arrow at each level, its size beside the arrow"""
    if not zs:return
    y0=Y(z0);pen.add(f'<circle class="datum" cx="{x:.3f}" cy="{y0:.3f}" r="0.9"/>');pen.line(xedge-1,y0,x-1.5,y0,'d')
    pen.line(x,y0,x,Y(max(zs)),'d');last=1e9
    for z in sorted(zs):
        y=Y(z);pen.line(xedge-1,y,x-1.5,y,'d');pen.arrow(x,y,0,-1)
        ty=min(y+TXT*0.35,last-TXT-0.4);last=ty;pen.text(x-1.2,ty,f2(z-z0),anchor='end')
def wrap(t,width,size):
    """t broken into lines no wider than width mm at the lettering's size"""
    out=[];cur=''
    for w in str(t).split():
        if cur and len(cur+' '+w)*size*0.5>width:out.append(cur);cur=w
        else:cur=(cur+' '+w).strip()
    if cur:out.append(cur)
    return out
def layout_and_draw(A,dirp,date,version):
    """the sheet: views at the chosen scale, arranged in first angle, dimensioned; the render. Returns (pen, paper, sc, notes)"""
    m=A['m'];b=A['b'];kind=A['kind'];k=A['k'];ext=b[1]-b[0]
    if kind=='flat':
        top0=G.view(m,'top',5/max(ext[:2].max(),1));finish_flat(A,top0)                  # the holes and levels first: the margins depend on them
    paper,sc,L=choose(A);W,H=PAPER[paper];pen=Pen();notes=[]
    P=L['P'];fx,fy=P['front']
    FX=lambda u:fx+(u-b[0,0])*sc;FY=lambda w:fy+(b[1,2]-w)*sc
    if kind=='turned':
        V,half,dia,bores,levels,R=turned(A,sc);draw_view(pen,V,FX,FY,sc);pen.add(hatch(half,FX,FY,sc))
        pen.line(FX(0),FY(b[1,2])-3,FX(0),FY(b[0,2])+3,'c')                         # the axis, a chain line past both ends
        # diameters: each once, across the part at the middle of its longest run, the text right of the part, stacked clear of each other
        items=[]
        for D_,runs in sorted(dia.items()):
            lo,hi=max(runs,key=lambda r:r[1]-r[0]);items.append((D_,(lo+hi)/2,'Ø '+f2(D_)))
        for D_,runs in sorted(bores.items()):
            lo,hi=max(runs,key=lambda r:r[1]-r[0]);items.append((D_,(lo+hi)/2,'Ø '+f2(D_)+' bore'))
        items.sort(key=lambda t:-t[1]);last=-1e9;tx=FX(R)+8
        for D_,wm,t in items:
            y=max(FY(wm),last+TXT+1.2);last=y
            pa,pb=(FX(-D_/2),FY(wm)),(FX(D_/2),FY(wm))
            if pb[0]-pa[0]>2*ARR+1:pen.line(*pa,*pb,'d');pen.arrow(*pa,-1,0);pen.arrow(*pb,1,0);pen.line(pb[0],pb[1],tx-1,y,'d')
            else:pen.line(pa[0]-ARR-1.5,pa[1],pb[0]+ARR+1.5,pb[1],'d');pen.arrow(*pa,1,0);pen.arrow(*pb,-1,0);pen.line(pb[0]+ARR+1.5,pb[1],tx-1,y,'d')
            pen.line(tx-1,y,tx+len(t)*TXT*0.55,y,'d');pen.text(tx,y-0.7,t,anchor='start')
        chain_v(pen,FX(-R)-7,FX(-R),levels,FY,overall=FX(-R)-24)
        if len(A['views'])>1:
            ev=A['views'][1];tx0,ty0=P['top'];TY=lambda v:ty0+(b[1,1]-v)*sc
            Vt=G.view(m,ev,sc,hidden=False);draw_view(pen,Vt,FX,TY,sc);centre_cross(pen,FX(0),TY(0),ext[0]*sc/2)
            pen.text(FX(b[0,0]),ty0-2.5,'View from above' if ev=='top' else 'View from below (seen from beneath, x reversed)',size=2.5,anchor='start',cls='t vn')
        A['dims']={'dia':sorted(dia),'bores':sorted(bores),'levels':levels}
    else:
        top=G.view(m,'top',sc);finish_flat(A,top)
        dx,dy=A['datum'];far=A['far']
        Vf=G.view(far,'front',sc) if far is not None and len(far.faces) else {'vis':[],'hid':[]}
        Vf['hid']=[]                                                                    # a section shows what lies beyond the cut, not behind it
        draw_view(pen,Vf,FX,FY,sc);pen.add(hatch(A['sec'],FX,FY,sc))
        pen.text(FX((b[0,0]+b[1,0])/2),fy-3,'A–A',size=3.5,cls='t vn')
        rising(pen,FX(b[0,0])-6,FX(b[0,0]),b[0,2],[z for z in A['levels'] if z>b[0,2]+0.01],FY)   # the levels, from the bottom face
        for h in A['holes']:                                                            # hole axes through the cut
            if abs(h['y']-A['cut'])<0.02:pen.line(FX(h['x']),FY(max(q[3][1] for q in h['prof']))-1.5,FX(h['x']),FY(min(q[3][0] for q in h['prof']))+1.5,'c')
        tx0,ty0=P['top'];TY=lambda v:ty0+(b[1,1]-v)*sc
        hid_len=sum(math.hypot(p[3]-p[1],p[4]-p[2]) for p in top['hid'] if p[0]=='line');vis_len=sum(math.hypot(p[3]-p[1],p[4]-p[2]) for p in top['vis'] if p[0]=='line')
        if hid_len>1.2*vis_len:top={'vis':top['vis'],'hid':[]};notes.append('Hidden lines are left out of the plan (too many to read); the section and the hole table give the depths.')
        draw_view(pen,top,FX,TY,sc)
        for h in A['holes']:
            r=max(q[0] for q in h['prof'])/2*sc;centre_cross(pen,FX(h['x']),TY(h['y']),r)
        # the cut's line A-A: thick at its ends, arrows looking up the plan (the front view's viewer stands at the plan's foot)
        cy=TY(A['cut']);xa,xb=FX(b[0,0])-4,FX(b[1,0])+4
        pen.line(xa,cy,xb,cy,'c');pen.line(xa,cy,xa+5,cy,'cut');pen.line(xb-5,cy,xb,cy,'cut')
        for xx in (xa+1,xb-1):pen.line(xx,cy,xx,cy+4,'d');pen.arrow(xx,cy+0.4,0,-1)
        pen.text(xa-1.5,cy+1,'A',size=3.5,anchor='end',cls='t vn');pen.text(xb+1.5,cy+1,'A',size=3.5,anchor='start',cls='t vn')
        X0,Y0=FX(dx),TY(dy);pen.add(f'<circle class="datum" cx="{X0:.3f}" cy="{Y0:.3f}" r="1.2"/>')   # the datum: its circle and its axes
        pen.line(X0,Y0,X0+7,Y0,'d');pen.arrow(X0+7,Y0,1,0);pen.line(X0,Y0,X0,Y0-7,'d');pen.arrow(X0,Y0-7,0,-1)
        pen.text(X0+7.5,Y0+3.2,'x',size=2.2,anchor='start');pen.text(X0+1,Y0-7.5,'y',size=2.2,anchor='start')
        for h in A['holes']:                                                            # the hole numbers
            r=max(q[0] for q in h['prof'])/2*sc+0.6;pen.text(FX(h['x'])+r*0.75+0.4,TY(h['y'])-r*0.75-0.3,str(h['n']),size=2.2,anchor='start',cls='t hn')
        dim_lin(pen,(FX(b[0,0]),TY(b[0,1])),(FX(b[1,0]),TY(b[0,1])),8,f2(ext[0]))      # overall sizes, outside the plan
        dim_lin(pen,(FX(b[1,0]),TY(b[0,1])),(FX(b[1,0]),TY(b[1,1])),11,f2(ext[1]))
        if A.get('teeth'):
            t=A['teeth'];pen.add(f'<circle class="c" cx="{FX(dx):.3f}" cy="{TY(dy):.3f}" r="{(t["tip"]+t["root"])/4*sc:.3f}" fill="none"/>')
        if 'left' in A['views']:
            lx0,_=P['left'];Vl=G.view(m,'left',sc)
            Vl={k2:[shift_prim(p,b[1,1]) for p in Vl[k2]] for k2 in Vl}                       # the left view's paper x is -v: from the plan's top edge
            draw_view(pen,Vl,lambda x:lx0+x*sc,FY,sc)
            pen.text(lx0+ext[1]*sc/2,fy-3,'View from the left',size=2.5,cls='t vn')
    png=dirp/f'{k}.png'
    if png.exists():
        rx,ry=L['rend']
        pen.add(f'<rect class="rf" x="{rx:.2f}" y="{ry:.2f}" width="{REND}" height="{REND}"/><image href="{png.name}" x="{rx+1:.2f}" y="{ry+1:.2f}" width="{REND-2}" height="{REND-2}" preserveAspectRatio="xMidYMid meet"/>')
        pen.text(rx+REND/2,ry+REND+3.2,'Isometric view, not to scale',size=2.0,cls='t vn')
    return pen,paper,sc,notes
def shift_prim(p,v1):
    """a left view's primitive (its x is -v) moved so the plan's top edge (v1) is at 0"""
    if p[0]=='line':return ('line',p[1]+v1,p[2],p[3]+v1,p[4])
    if p[0]=='circle':return ('circle',p[1]+v1,p[2],p[3])
    return ('arc',p[1]+v1,p[2],p[3],p[4]+v1,p[5],p[6]+v1,p[7],p[8])
def title_block(pen,W,H,A,sc,sheet,sheets,date,version,model_title):
    """the title block in the lower right, 180 by 40 mm, in the ruling of the Wempe's sheets: material and scale on the left, the maker in the middle, the drawing
    number and the name; the firm's name replaced by the model's, since the sheet is the model's and not the firm's"""
    x1,y1=W-10,H-10;x0,y0=x1-180,y1-40
    L=lambda a,b,c,d,cl='tb':pen.line(a,b,c,d,cl)
    pen.add(f'<rect class="tbo" x="{x0}" y="{y0}" width="180" height="40"/>')
    L(x0+50,y0,x0+50,y1);L(x0,y0+15,x0+50,y0+15);L(x0+32,y0,x0+32,y0+15);L(x0,y0+30,x0+50,y0+30)
    L(x0+50,y0+22,x1,y0+22);L(x0+110,y0,x0+110,y0+22);L(x0+110,y0+11,x1,y0+11);L(x0+50,y0+32,x1,y0+32)
    meta=A['meta'];lines=meta.get('lines') or []
    mat=lines[0].get('mat','') if lines else '—';no=lines[0]['no'] if lines else meta['k'];tr=lines[0].get('treat','') if lines else ''
    s=lambda x,y,t,sz=1.8,an='start',cl='t tbl':pen.text(x,y,t,size=sz,anchor=an,cls=cl)
    def cell(x,y,w,t,sz,n):
        ls=wrap(t,w,sz)
        if len(ls)>n:ls=ls[:n];ls[-1]=ls[-1][:max(1,int(w/(sz*0.5))-1)]+'…'
        for i,l in enumerate(ls):s(x,y+i*sz*1.15,l,sz,'start','t')
    s(x0+1.2,y0+2.8,'Werkstoff / Material');cell(x0+1.2,y0+5.8,29.5,mat,1.6,5)
    s(x0+33.2,y0+2.8,'Maßstab / Scale');sct=f'{int(sc)}:1' if sc>=1 else f'1:{int(round(1/sc))}';s(x0+41,y0+11.5,sct,5,'middle','t tbv')
    s(x0+1.2,y0+17.8,'Behandlung / Treatment');cell(x0+1.2,y0+20.8,47.5,tr,1.6,4)
    s(x0+1.2,y0+32.8,'Blatt / Sheet');s(x0+25,y0+38,f'{sheet} / {sheets}',3.0,'middle','t tbv')
    s(x0+52,y0+4.8,model_title,2.6,'start','t tbv');s(x0+52,y0+9.2,'The Marine Chronometer working model',2.0)
    s(x0+52,y0+13.2,'drawn from its solids by tools/drawbook.py',1.7);s(x0+52,y0+18.5,f'Model {version}  ·  {date}',2.0)
    s(x0+111.2,y0+2.8,'Zeichnung Nr. / Drawing no.');s(x1-2,y0+9.3,no,4.0,'end','t tbv')
    s(x0+111.2,y0+13.8,'Teil / Part');s(x1-2,y0+19.8,meta['k'],2.4,'end','t')
    s(x0+51.2,y0+24.8,'Benennung / Name');s(x0+52,y0+29.6,meta['title'][:75],3.0,'start','t tbv')
    s(x0+51.2,y0+35.3,'Sizes in mm. Untoleranced sizes are the model\'s; fits and tolerances on sheet 2.',1.75)
    s(x0+51.2,y0+38.6,'First-angle projection (DIN ISO 5456-2).',1.75)
CSS="""
.vis{fill:none;stroke:#000;stroke-width:0.5;stroke-linecap:round;stroke-linejoin:round}
.hid{fill:none;stroke:#000;stroke-width:0.3;stroke-dasharray:1.6 0.7}
.c{stroke:#000;stroke-width:0.18;stroke-dasharray:5 0.8 0.6 0.8;fill:none}
.cut{stroke:#000;stroke-width:0.7}
.d{stroke:#000;stroke-width:0.18}
.h{fill:none;stroke:#000;stroke-width:0.13}
.v{fill:none;stroke:#000;stroke-width:0.5}
.fill{fill:#000;stroke:#000;stroke-width:0.1}
.ar,.dot{fill:#000;stroke:none}
.datum{fill:none;stroke:#000;stroke-width:0.35}
.frame{fill:none;stroke:#000;stroke-width:0.7}
.tbo{fill:none;stroke:#000;stroke-width:0.6}
.tb{stroke:#000;stroke-width:0.3}
.rf{fill:none;stroke:#000;stroke-width:0.18}
.tk{stroke:#000;stroke-width:0.35}
.t{font-family:'Instrument Sans',sans-serif;font-style:oblique 15deg;fill:#000}
.tbl{fill:#333}
.tbv{font-weight:600}
.vn{font-weight:600}
.hn{fill:#000}
"""
def sheet1(A,dirp,date,version,model_title):
    pen,paper,sc,notes=layout_and_draw(A,dirp,date,version)
    W,H=PAPER[paper]
    pen.add(f'<rect class="frame" x="20" y="10" width="{W-30}" height="{H-20}"/>')
    title_block(pen,W,H,A,sc,1,2,date,version,model_title)
    if notes:pen.text(25,H-10-42-3,' '.join(notes),size=2.0,anchor='start')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}mm" height="{H}mm">'+''.join(pen.o)+'</svg>'
    return svg,paper,sc
def sheet2(A,version):
    """the tables, as HTML: the parts-list lines, the holes, the contour, the teeth"""
    meta=A['meta'];o=[]
    L=meta.get('lines') or []
    if L:
        o.append('<h3>Parts list</h3><table><tr><th>Drawing</th><th>Name</th><th>Units</th><th>Material</th><th>Finish, heat treatment</th><th>Fit, as measured on the model</th></tr>'+
          ''.join(f"<tr><td>{esc(l['no'])}</td><td>{esc(l['name'])}</td><td>{esc(l.get('qty',''))}</td><td>{esc(l.get('mat',''))}</td><td>{esc(l.get('treat',''))}</td><td>{esc(l.get('fit',''))}</td></tr>" for l in L)+'</table>')
        for l in L:
            for key,lab in (('tol','Tolerance'),('bench','Test on the bench'),('fn','What it does')):
                if l.get(key):o.append(f'<p><b>{lab} ({esc(l["no"])}).</b> {esc(l[key])}</p>')
    b=A['b']
    if A['kind']=='flat':
        dx,dy=A['datum'];o.append(f'<p>Coordinates from the datum, {esc(A["dname"])} (marked on the plan), x to the right and y up the plan as drawn; depths from the face seen in the plan (the top). Thickness {f2(b[1,2]-b[0,2])}.</p>')
        if A['holes']:
            o.append('<h3>Holes</h3><table><tr><th>Hole</th><th class="n">x</th><th class="n">y</th><th>Size</th></tr>'+
              ''.join(f"<tr><td>{h['n']}</td><td class='n'>{f2(h['x']-dx)}</td><td class='n'>{f2(h['y']-dy)}</td><td>{esc(hole_text(h,b[0,2],b[1,2]))}</td></tr>" for h in A['holes'])+'</table>')
        tol=0.004
        polys=A['plan'].geoms if isinstance(A['plan'],MultiPolygon) else [A['plan']]
        rows=[];n=0
        for g in polys:
            for ri,ring in enumerate([g.exterior,*g.interiors]):
                E=contour_elems(ring,tol)
                if ri>0 and len(E)==1 and E[0][0]=='circle':continue                   # a round hole: in the hole table
                name='Outline' if ri==0 else f'Cut-out {ri}'
                for e in E:
                    n+=1
                    if e[0]=='line':rows.append((name,n,'line',f'{f2(e[1]-dx)}, {f2(e[2]-dy)}',f'{f2(e[3]-dx)}, {f2(e[4]-dy)}','',''))
                    elif e[0]=='arc':rows.append((name,n,'arc '+('anticlockwise' if e[8]>0 else 'clockwise'),f'{f2(e[4]-dx)}, {f2(e[5]-dy)}',f'{f2(e[6]-dx)}, {f2(e[7]-dy)}',f'{f2(e[1]-dx)}, {f2(e[2]-dy)}',f2(e[3])))
                    else:rows.append((name,n,'circle','','',f'{f2(e[1]-dx)}, {f2(e[2]-dy)}',f2(e[3])))
        if rows and len(rows)<=400:
            o.append('<h3>Contour in the plan</h3><p>The outline and cut-outs as a CNC program runs them: each element from its start to its end, an arc with its centre and radius.</p><table><tr><th>Contour</th><th class="n">#</th><th>Element</th><th class="n">From x, y</th><th class="n">To x, y</th><th class="n">Centre x, y</th><th class="n">R</th></tr>'+
              ''.join('<tr>'+''.join(f'<td{" class=n" if i in (1,3,4,5,6) else ""}>{esc(c)}</td>' for i,c in enumerate(r))+'</tr>' for r in rows)+'</table>')
        elif rows:o.append(f'<p>The contour has {len(rows)} elements (its teeth): the drawing and the tooth data define it.</p>')
        lv=A.get('levels') or []
        if lv:o.append('<h3>Levels</h3><p>Faces in section A-A, from the bottom face: '+', '.join(f2(z-b[0,2]) for z in lv if z>b[0,2]+0.005)+'.</p>')
    else:
        d=A.get('dims',{})
        o.append(f"<p>Turned about its axis; length {f2(b[1,2]-b[0,2])}, largest Ø {f2(2*max(abs(b[0,0]),abs(b[1,0])))}. Diameters: {', '.join('Ø '+f2(x) for x in d.get('dia',[]))}"+
                 (f"; bores {', '.join('Ø '+f2(x) for x in d.get('bores',[]))}" if d.get('bores') else '')+
                 f". Shoulders from the lower end: {', '.join(f2(z-b[0,2]) for z in d.get('levels',[]))}.</p>")
    t=A.get('teeth');g=A.get('gear')
    if t or g:
        o.append('<h3>Teeth</h3><table><tr><th>Number</th><th class="n">Module</th><th class="n">Tip Ø</th><th class="n">Root Ø</th></tr>'+
                 f"<tr><td>{(g or {}).get('z',t and t['z'])}</td><td class='n'>{(g or {}).get('m','see the tooth form')}</td><td class='n'>{f2(t['tip']) if t else ''}</td><td class='n'>{f2(t['root']) if t else ''}</td></tr></table>")
    return ''.join(o)
def main(OUT,only):
    """each part's two sheets, as an HTML page per part in OUT/sheets (its render beside it), and the book's index"""
    import subprocess
    L=json.loads((OUT/'list.json').read_text(encoding='utf-8'));ymid=L.get('mid')
    dirp=OUT/'parts';sd=OUT/'sheets';sd.mkdir(exist_ok=True)
    date=datetime.date.today().isoformat()
    try:version=subprocess.run(['git','describe','--tags','--abbrev=0'],capture_output=True,text=True).stdout.strip() or '—'
    except Exception:version='—'
    for e in L['parts']:
        k=e['k']
        if only and k not in only:continue
        if not (dirp/f'{k}.npz').exists():continue
        A=analyse(dirp,k,ymid)
        svg,paper,sc=sheet1(A,dirp,date,version,'Wempe Einheits-Chronometer')
        tab=sheet2(A,version)
        (sd/f'{k}.svg').write_text(svg,encoding='utf-8')
        (sd/f'{k}.html').write_text(page(k,A,svg,paper,tab),encoding='utf-8');(sd/f'{k}.frag.html').write_text(frag(k,A,svg,paper,tab,f'parts/{k}.png'),encoding='utf-8')
        print(k,A['kind'],paper,sc,len(A.get('holes') or []),'holes',flush=True)
def head(title,font_rel):
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{esc(title)}</title><style>
@font-face{{font-family:'Instrument Sans';src:url('{font_rel}') format('woff2');font-style:normal}}
@page a3{{size:420mm 297mm;margin:0}}@page{{size:210mm 297mm;margin:0}}
body{{margin:0;background:#888}}.sh{{background:#fff;margin:8px auto;box-sizing:border-box;overflow:hidden}}.sh.A4{{width:210mm;height:297mm}}.sh.A3{{width:420mm;height:297mm;page:a3}}
.sh svg{{display:block}}
.tab{{width:210mm;min-height:297mm;padding:15mm 12mm 15mm 22mm;font:9pt/1.35 'Instrument Sans',sans-serif;background:#fff;margin:8px auto;box-sizing:border-box}}
table{{border-collapse:collapse;width:100%;margin:2mm 0 4mm}}th,td{{border:0.2mm solid #000;padding:0.8mm 1.4mm;text-align:left;vertical-align:top}}th{{font-weight:600}}.n{{text-align:right;font-variant-numeric:tabular-nums}}
tr{{break-inside:avoid}}h2{{font-size:13pt;margin:0 0 3mm}}h3{{font-size:10pt;margin:4mm 0 1mm;break-after:avoid}}
@media print{{body{{background:none}}.sh,.tab{{margin:0;break-after:page}}}}
{CSS}</style></head><body>"""
def frag(k,A,svg,paper,tab,img):
    """a part's two sheets as a fragment of the book (img: the path its render is found at from the page)"""
    svg=svg.replace(f'href="{k}.png"',f'href="{img}"')
    return f"""<div class="sh {paper}">{svg}</div><div class="tab"><h2>{esc(A['meta']['title'])} — sheet 2</h2><p>{esc(A['meta'].get('desc',''))}</p>{tab}</div>"""
FONT=pathlib.Path(__file__).resolve().parents[3]/'vendor'/'fonts'/'InstrumentSans-normal-400.woff2'
def page(k,A,svg,paper,tab):
    return head(A['meta']['title'],FONT.as_uri())+frag(k,A,svg,paper,tab,f'../parts/{k}.png')+'</body></html>'
def book_html(OUT,title):
    """the drawn parts' sheets in the build book's order, one HTML (its renders and font beside it in OUT)"""
    L=json.loads((OUT/'list.json').read_text(encoding='utf-8'))['parts'];o=[]
    for e in L:
        f=OUT/'sheets'/f"{e['k']}.frag.html"
        if f.exists():o.append(f.read_text(encoding='utf-8'))
    (OUT/'book.html').write_text(head(title,FONT.as_uri())+''.join(o)+'</body></html>',encoding='utf-8');return OUT/'book.html',len(o)
async def pdf(OUT,dest):
    import browser
    from playwright.async_api import async_playwright
    f,n=book_html(OUT,'Build book')
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS);pg=await b.new_page()
        await pg.goto(f.as_uri());await pg.wait_for_timeout(1500)
        await pg.pdf(path=dest,prefer_css_page_size=True,print_background=True);await b.close()
    print(n,'parts into',dest)
