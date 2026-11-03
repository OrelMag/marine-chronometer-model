"""wempe_measure.py: what each of the Wempe's parts measures as built, read off its exact solid alone (the recipe's B-rep, tools/recipes/wempe*.py), never
the recipe's text: for the audit against Wempe's works drawings (WEMPE-PARTS-LEDGER.md), so a check compares the drawing with the part, not with what the
code says it did. `recipes.py --model wempe --check` ties each solid to the page's own mesh (the ledger's head gives its result).

    python wempe_measure.py [--only a,b] [--out DIR]     (a second or a few a part; DIR default tools/r_wpa/measure/, ignored)

For each part, KEY.json and KEY.png, in millimetres in the part's own frame (Z its thickness or its axis): the box and volume; the faces' levels along Z;
every cylindrical face (a hole, bore, boss, pin or turned diameter: its axis, diameter, span, inside or outside, and its centre's distance from the
frame's origin); every cone (a countersink, chamfer: its two diameters and span, its half angle); every torus (a rounded edge: its radii); the outline's
arcs and lines on each level face (centre, radius, ends); a toothed rim's count, tips and roots at every level that has one; the section through the
axis (the XZ plane, x >= 0) as its corners. KEY.png draws the plan and that section on a mm grid, for reading beside the sheet."""
import argparse,json,math,pathlib,sys
import numpy as np
import model
import build123d as bd
HERE=pathlib.Path(__file__).resolve().parent
def r4(x):return round(float(x),4)

def faces_info(p):
    cyl=[];cone=[];tor=[];planes=set()
    for f in p.faces():
        g=f.geom_type
        if g==bd.GeomType.PLANE:
            n=f.normal_at();c=f.center()
            if abs(abs(n.Z)-1)<1e-6:planes.add(round(c.Z,4))
        elif g==bd.GeomType.CYLINDER:
            try:ax=f.axis_of_rotation;r=f.radius
            except Exception:continue
            if r is None or ax is None:continue
            bb=f.bounding_box();d=ax.direction;q=ax.position
            pt=f.position_at(0.5,0.5);w=pt-q;w=w-d*(w.dot(d));out=f.normal_at(pt).dot(w)>0   # the normal away from the axis: an outside face
            axial=abs(abs(d.Z)-1)<1e-6
            if axial:span=[r4(bb.min.Z),r4(bb.max.Z)]
            else:   # an axis across Z: its span along the axis itself
                P=[f.position_at(u,v) for u in (0,0.5,1) for v in (0,0.5,1)];t=[(x-q).dot(d) for x in P];span=[r4(min(t)),r4(max(t))]
            cyl.append({'d':r4(2*r),'kind':'outside' if out else 'inside','axis':[r4(d.X),r4(d.Y),r4(d.Z)],'at':[r4(q.X),r4(q.Y)] if axial else [r4(q.X),r4(q.Y),r4(q.Z)],
                        'from_origin':r4(math.hypot(q.X,q.Y)) if axial else None,'z' if axial else 'along_axis':span,'arc_deg':r4(math.degrees(f.area/(r*max(1e-9,(span[1]-span[0])))) if span[1]>span[0] else None)})
        elif g==bd.GeomType.CONE:
            bb=f.bounding_box();e=[x for x in f.edges() if x.geom_type==bd.GeomType.CIRCLE]
            rs=sorted({round(x.radius,5) for x in e});zs=[bb.min.Z,bb.max.Z]
            cone.append({'d':[r4(2*r) for r in rs],'z':[r4(z) for z in zs],'at':[r4(e[0].arc_center.X),r4(e[0].arc_center.Y)] if e else None,
                         'half_angle_deg':round(math.degrees(math.atan2(abs(rs[-1]-rs[0]),abs(zs[1]-zs[0])+1e-12)),1) if len(rs)==2 else None})
        elif g==bd.GeomType.TORUS:
            bb=f.bounding_box();tor.append({'box':[r4(bb.min.X),r4(bb.min.Y),r4(bb.min.Z),r4(bb.max.X),r4(bb.max.Y),r4(bb.max.Z)]})
    m={}
    for c in cyl:   # OpenCascade splits a full cylinder in halves: one entry
        k=(c['d'],tuple(c['at']),tuple(c['axis']),tuple(c.get('z') or c.get('along_axis')),c['kind'])
        if k in m and m[k]['arc_deg'] and c['arc_deg']:m[k]['arc_deg']=r4(m[k]['arc_deg']+c['arc_deg'])
        else:m.setdefault(k,c)
    for c in m.values():
        if c['arc_deg'] and c['arc_deg']>359:c['arc_deg']=360
    return sorted(m.values(),key=lambda c:(c['kind'],-c['d'])),cone,tor,sorted(planes)

def outline(p,z0):
    """the edges lying in the plane z0: arcs with centre and radius, lines with ends"""
    A=[];L=[];full=[]
    for e in p.edges():
        bb=e.bounding_box()
        if abs(bb.min.Z-z0)>1e-5 or abs(bb.max.Z-z0)>1e-5:continue
        if e.geom_type==bd.GeomType.CIRCLE:
            c=e.arc_center;s=e.position_at(0);t=e.position_at(1)
            rec={'r':r4(e.radius),'c':[r4(c.X),r4(c.Y)],'from':[r4(s.X),r4(s.Y)],'to':[r4(t.X),r4(t.Y)],'len':r4(e.length)}
            (full if e.is_closed else A).append(rec)
        elif e.geom_type==bd.GeomType.LINE:
            s=e.position_at(0);t=e.position_at(1);L.append({'from':[r4(s.X),r4(s.Y)],'to':[r4(t.X),r4(t.Y)],'len':r4(e.length)})
        else:
            s=e.position_at(0);t=e.position_at(1);L.append({'curve':str(e.geom_type).split('.')[-1],'from':[r4(s.X),r4(s.Y)],'to':[r4(t.X),r4(t.Y)],'len':r4(e.length)})
    return {'arcs':A,'lines':L,'circles':full}

def teeth_at(p,z):
    """a toothed rim's teeth in the section at z: the largest face's outer wire sampled in order, its radius about the origin crossing mid-depth counted"""
    try:sec=p&bd.Face.make_rect(400,400,bd.Plane.XY.offset(z))
    except Exception:return None
    if sec is None or not sec.faces():return None
    out=[]
    for f in sorted(sec.faces(),key=lambda f:-f.area)[:2]:
        E=[(e,e.position_at(0),e.position_at(1)) for e in f.outer_wire().edges()]
        if len(E)<18:continue
        cur=E.pop(0);seq=[(cur[0],False)];end=cur[2]
        while E:
            k=min(range(len(E)),key=lambda i:min((E[i][1]-end).length,(E[i][2]-end).length));e,a0,a1=E.pop(k);rev=(a1-end).length<(a0-end).length;seq.append((e,rev));end=a0 if rev else a1
        P=[]
        for e,rev in seq:
            n=max(2,int(e.length/0.005));P+=[(q.X,q.Y) for q in (e.position_at(1-t/n if rev else t/n) for t in range(n))]
        P=np.array(P);c=P.mean(0) if np.hypot(*P.mean(0))>0.5 else np.zeros(2);R=np.hypot(P[:,0]-c[0],P[:,1]-c[1])
        ro,ri=R.max(),R.min()
        if ro-ri<0.05:continue
        lo,hi=ri+0.3*(ro-ri),ri+0.7*(ro-ri);st=None;n=0
        for x in np.concatenate([R,R]):
            if x<lo:st=0
            elif x>hi and st==0:n+=1;st=1
        n//=2
        if n>=6:out.append({'z':r4(z),'count':n,'centre':[r4(c[0]),r4(c[1])],'tips_d':r4(2*ro),'roots_d':r4(2*ri),'depth':r4(ro-ri)})
    return out

def profile(p):
    """the section through the Z axis (the XZ plane, x >= 0): its corners (r, z), in order round each loop"""
    try:s=p&bd.Face.make_rect(400,400,bd.Plane.XZ)
    except Exception:return []
    out=[]
    if s is None:return out
    for fc in s.faces():
        for w in fc.wires():
            pts=[]
            for e in w.edges():
                for t in (0,1):
                    q=e.position_at(t)
                    if q.X>=-1e-6:pts.append((r4(q.X),r4(q.Z)))
            dd=[];[dd.append(x) for x in pts if not dd or x!=dd[-1]];out.append(dd)
    return out

def draw(key,title,p,png):
    import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
    fig,ax=plt.subplots(1,2,figsize=(18,8.5))
    for e in p.edges():
        n=max(24,int(e.length/0.05)) if e.geom_type!=bd.GeomType.LINE else 1;P=[e.position_at(i/n) for i in range(n+1)];ax[0].plot([q.X for q in P],[q.Y for q in P],'k-',lw=0.45)
    ax[0].plot([0],[0],'r+',ms=12);ax[0].set_title(f'{key} ({title}): plan seen along Z from +Z, mm (the part\'s frame; red + its origin)',fontsize=9)
    try:s=p&bd.Face.make_rect(400,400,bd.Plane.XZ)
    except Exception:s=None
    for e in (s.edges() if s is not None else []):
        n=24 if e.geom_type!=bd.GeomType.LINE else 1;P=[e.position_at(i/n) for i in range(n+1)];ax[1].plot([q.X for q in P],[q.Z for q in P],'k-',lw=0.8)
    for fc in (s.faces() if s is not None else []):
        v,t=fc.tessellate(0.002);V=np.array([[q.X,q.Z] for q in v])
        if len(t):ax[1].tripcolor(V[:,0],V[:,1],np.array(t),np.zeros(len(t)),cmap='Greys',vmin=-1,vmax=3,alpha=0.5)
    ax[1].set_title('section on the plane y = 0 (x right, z up; mm)',fontsize=9)
    for a in ax:a.set_aspect('equal');a.grid(True,lw=0.3);a.minorticks_on();a.grid(True,which='minor',lw=0.1,color='#ccc')
    fig.tight_layout();fig.savefig(png,dpi=110);plt.close(fig)

def measure(r,p):
    bb=p.bounding_box();cyl,cone,tor,planes=faces_info(p)
    J={'key':r.key,'hn':r.hn,'title':r.title,'units':'mm','frame':'the part\'s own frame: Z its thickness or turning axis, the plan seen from +Z',
       'box':[r4(bb.min.X),r4(bb.min.Y),r4(bb.min.Z),r4(bb.max.X),r4(bb.max.Y),r4(bb.max.Z)],'size':[r4(bb.size.X),r4(bb.size.Y),r4(bb.size.Z)],
       'volume_mm3':r4(p.volume),'solids':len(p.solids()),'z_levels':planes,'cylinders':cyl,'cones':cone,'tori':tor}
    J['outlines_by_level']={str(z):outline(p,z) for z in planes}
    J['section_y0']=profile(p)
    T=[];zs=sorted(set(planes)|{bb.min.Z,bb.max.Z})
    for a,b in zip(zs,zs[1:]):
        if b-a>0.02:
            t=teeth_at(p,(a+b)/2)
            if t:T+=t
    J['teeth']=T
    return J

def one(k,out):
    from recipes import wempe as W
    mk=W.RECIPES[k];r=mk() if callable(mk) else mk
    if not hasattr(r,'build'):return k,None   # a bought line: no solid
    try:p=r.build();J=measure(r,p)
    except Exception as e:return k,f'FAILED {type(e).__name__}: {e}'
    (out/f'{k}.json').write_text(json.dumps(J,indent=1,ensure_ascii=False),encoding='utf-8');draw(k,r.title,p,out/f'{k}.png')
    t=J['teeth'];return k,f"size {J['size']} mm, {len(J['cylinders'])} cylinders, {len(J['cones'])} cones"+(''.join(f", teeth {x['count']} at z {x['z']} tips {x['tips_d']} roots {x['roots_d']}" for x in t[:3]))

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--out',default=str(HERE/'r_wpa'/'measure'));a.add_argument('--model',default='wempe');a.add_argument('--jobs',type=int,default=1);o=a.parse_args()
    from recipes import wempe as W
    out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True);keys=[k for k in W.RECIPES if not o.only or k in o.only.split(',')];bad=[]
    if o.jobs>1:
        from concurrent.futures import ProcessPoolExecutor
        with ProcessPoolExecutor(o.jobs) as ex:res=ex.map(one,keys,[out]*len(keys))
    else:res=(one(k,out) for k in keys)
    for k,msg in res:
        if msg is None:continue
        if msg.startswith('FAILED'):bad.append(k)
        print(f'{k:22s} {msg}',flush=True)
    if bad:print('failed:',','.join(bad));sys.exit(1)
if __name__=='__main__':main()
