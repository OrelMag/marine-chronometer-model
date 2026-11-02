"""hamilton_measure.py: what each of the Hamilton's drawn parts (recipes/hamilton.py) measures as built, read off its solid alone, never the recipe's
text: for the audit against Hamilton's sheets (HAMILTON-PARTS-LEDGER.md), so a check compares the drawing with the part, not with what the code says it did.

    python hamilton_measure.py [--only a,b] [--out DIR]     (a few seconds a part; DIR default tools/r_hparts_audit/, ignored)

For each part, KEY.json and KEY.png, in inches (the sheets' unit) with mm beside: the box and volume; the faces' levels along the part's axis (Z); every
cylindrical face (a hole, bore, boss or turned diameter: its axis, diameter, span, inside or outside); every cone (a countersink, chamfer: its two
diameters and span, its half angle); the outline's arcs and lines on the first face (centre, radius, ends, in the sheet's frame about its datum); a
toothed rim's count, tips and roots; a turned part's profile, the section through its axis as (r, z) corners. KEY.png draws the plan and that section in
inches with a grid, for reading beside the sheet."""
import argparse,json,math,pathlib,sys
import numpy as np
import build123d as bd
from recipes import hamilton as H
HERE=pathlib.Path(__file__).resolve().parent
IN=25.4
def i4(x):return round(x/IN,4)

def faces_info(p):
    cyl=[];cone=[];planes=set()
    for f in p.faces():
        g=f.geom_type
        if g==bd.GeomType.PLANE:
            n=f.normal_at();c=f.center()
            if abs(abs(n.Z)-1)<1e-6:planes.add(round(c.Z,5))
        elif g==bd.GeomType.CYLINDER:
            try:ax=f.axis_of_rotation;r=f.radius
            except Exception:continue
            if r is None or ax is None:continue
            bb=f.bounding_box();d=ax.direction;q=ax.position
            pt=f.position_at(0.5,0.5);w=pt-q;w=w-d*(w.dot(d));out=f.normal_at(pt).dot(w)>0   # a point on the surface: its normal away from the axis is an outside face
            cyl.append({'d_in':i4(2*r),'d_mm':round(2*r,4),'axis':[round(d.X,4),round(d.Y,4),round(d.Z,4)],'at_in':[i4(q.X),i4(q.Y)] if abs(abs(d.Z)-1)<1e-6 else [i4(q.X),i4(q.Y),i4(q.Z)],
                        'z_in':[i4(bb.min.Z),i4(bb.max.Z)],'kind':'outside' if out else 'inside','area':round(f.area,4)})
        elif g==bd.GeomType.CONE:
            bb=f.bounding_box();e=[x for x in f.edges() if x.geom_type==bd.GeomType.CIRCLE]
            rs=sorted({round(x.radius,5) for x in e});zs=[bb.min.Z,bb.max.Z]
            cone.append({'d_in':[i4(2*r) for r in rs],'z_in':[i4(z) for z in zs],'at_in':[i4(e[0].arc_center.X),i4(e[0].arc_center.Y)] if e else None,
                         'half_angle_deg':round(math.degrees(math.atan2(abs(rs[-1]-rs[0]),abs(zs[1]-zs[0])+1e-12)),1) if len(rs)==2 else None})
    # merge a cylinder split in two halves by OpenCascade (the same axis, diameter and span)
    m={}
    for c in cyl:
        k=(c['d_in'],tuple(c['at_in']),tuple(c['axis']),tuple(c['z_in']),c['kind']);m.setdefault(k,c)
    return sorted(m.values(),key=lambda c:(-c['d_in'])),cone,sorted(planes)

def outline(p,z0):
    """the edges lying in the plane z0 (the first face): arcs with centre and radius, lines with ends, in inches about the datum"""
    A=[];L=[];full=[]
    for e in p.edges():
        bb=e.bounding_box()
        if abs(bb.min.Z-z0)>1e-6 or abs(bb.max.Z-z0)>1e-6:continue
        if e.geom_type==bd.GeomType.CIRCLE:
            c=e.arc_center;s=e.position_at(0);t=e.position_at(1)
            rec={'r_in':i4(e.radius),'c_in':[i4(c.X),i4(c.Y)],'from_in':[i4(s.X),i4(s.Y)],'to_in':[i4(t.X),i4(t.Y)],'len_in':i4(e.length)}
            (full if e.is_closed else A).append(rec)
        elif e.geom_type==bd.GeomType.LINE:
            s=e.position_at(0);t=e.position_at(1);L.append({'from_in':[i4(s.X),i4(s.Y)],'to_in':[i4(t.X),i4(t.Y)],'len_in':i4(e.length)})
    return A,L,full

def teeth(p,zmid,rmin):
    """a toothed rim's teeth: the outline at zmid sampled round the turn, its radius's crossings of mid-depth counted"""
    sec=p&bd.Face.make_rect(400,400,bd.Plane.XY.offset(zmid))
    P=[]
    for f in [max(sec.faces(),key=lambda f:f.bounding_box().diagonal)]:   # the largest face (the toothed rim), its outer wire's edges chained end to end, each sampled in its own direction (sorting by angle shuffles a radial flank's points)
        E=[(e,e.position_at(0),e.position_at(1)) for e in f.outer_wire().edges()];cur=E.pop(0);seq=[(cur[0],False)];end=cur[2]
        while E:
            k=min(range(len(E)),key=lambda i:min((E[i][1]-end).length,(E[i][2]-end).length));e,a0,a1=E.pop(k);rev=(a1-end).length<(a0-end).length;seq.append((e,rev));end=a0 if rev else a1
        for e,rev in seq:
            n=max(2,int(e.length/0.005));T=[i/n for i in range(n)]
            P+=[(q.X,q.Y) for q in (e.position_at(1-t if rev else t) for t in T)]
    P=np.array(P);R=np.hypot(P[:,0],P[:,1])
    if not len(R) or R.max()<rmin:return None
    ro,ri=R.max(),R.min();lo,hi=ri+0.3*(ro-ri),ri+0.7*(ro-ri);st=None;n=0   # crossings with hysteresis: from under 30 % of the depth to over 70 %
    for x in np.concatenate([R,R]):
        if x<lo:st=0
        elif x>hi and st==0:n+=1;st=1
    n//=2
    return {'count':n,'tips_d_in':i4(2*ro),'roots_d_in':i4(2*ri),'tips_d_mm':round(2*ro,4),'roots_d_mm':round(2*ri,4)}

def profile(p):
    """the section through the axis (the XZ plane, x >= 0): its corners (r, z) in inches, in order round each loop"""
    f=bd.Face.make_rect(400,400,bd.Plane.XZ);s=p&f;out=[]
    if s is None:return out   # a part off the XZ plane (a placeholder in the detent's frame)
    for fc in s.faces():
        for w in fc.wires():
            pts=[]
            for e in w.edges():
                for t in (0,1):
                    q=e.position_at(t)
                    if q.X>=-1e-6:pts.append((i4(q.X),i4(q.Z)))
            dd=[];[dd.append(x) for x in pts if not dd or x!=dd[-1]];out.append(dd)
    return out

def draw(key,p,info,png):
    import matplotlib;matplotlib.use('Agg');import matplotlib.pyplot as plt
    fig,ax=plt.subplots(1,2,figsize=(16,8))
    for e in p.edges():   # plan: every edge seen along Z
        n=max(24,int(e.length/0.05)) if e.geom_type!=bd.GeomType.LINE else 1;P=[e.position_at(i/n) for i in range(n+1)];ax[0].plot([q.X/IN for q in P],[q.Y/IN for q in P],'k-',lw=0.5)
    ax[0].set_title(f'{key}: plan (inches, the part\'s frame)');ax[0].set_aspect('equal');ax[0].grid(True,lw=0.3);ax[0].minorticks_on();ax[0].grid(True,which='minor',lw=0.1)
    f=bd.Face.make_rect(400,400,bd.Plane.XZ);s=p&f
    for e in (s.edges() if s is not None else []):
        n=24 if e.geom_type!=bd.GeomType.LINE else 1;P=[e.position_at(i/n) for i in range(n+1)];ax[1].plot([q.X/IN for q in P],[q.Z/IN for q in P],'k-',lw=0.8)
    for fc in (s.faces() if s is not None else []):
        v,t=fc.tessellate(0.002);V=np.array([[q.X/IN,q.Z/IN] for q in v])
        if len(t):ax[1].tripcolor(V[:,0],V[:,1],np.array(t),np.zeros(len(t)),cmap='Greys',vmin=-1,vmax=3,alpha=0.5)
    ax[1].set_title('section through the axis, the XZ plane (x right, z up; inches)');ax[1].set_aspect('equal');ax[1].grid(True,lw=0.3);ax[1].minorticks_on();ax[1].grid(True,which='minor',lw=0.1)
    fig.tight_layout();fig.savefig(png,dpi=110);plt.close(fig)

def measure(r,p):
    bb=p.bounding_box();cyl,cone,planes=faces_info(p)
    J={'key':r.key,'hn':r.hn,'title':r.title,'drawing':r.drawing,'material':r.material,'treatment':r.treatment,
       'box_in':[i4(bb.min.X),i4(bb.min.Y),i4(bb.min.Z),i4(bb.max.X),i4(bb.max.Y),i4(bb.max.Z)],'size_in':[i4(bb.size.X),i4(bb.size.Y),i4(bb.size.Z)],
       'volume_mm3':round(p.volume,4),'z_levels_in':[i4(z) for z in planes],'cylinders':cyl,'cones':cone}
    if getattr(r,'flat',False):
        A,L,full=outline(p,bb.min.Z);J['outline_first_face']={'arcs':A,'lines':L,'circles':full}
    else:J['section_corners_in']=profile(p)
    od=getattr(r,'od',None)
    if od:
        zs=sorted(planes);J['teeth']=teeth(p,(bb.min.Z+bb.max.Z)/2 if getattr(r,'flat',False) else None or (bb.min.Z+bb.max.Z)/2,od['d']/2*0.8)
    return J

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--out',default=str(HERE/'r_hparts_audit'));o=a.parse_args()
    out=pathlib.Path(o.out);out.mkdir(parents=True,exist_ok=True)
    for grp,mk in H.RECIPES:
        r=mk()
        if o.only and r.key not in o.only.split(','):continue
        p=r.build();J=measure(r,p)
        if r.key=='fourthPinion':   # the leaves: at their middle height
            T=HD=H.HD()['p4']['st'];J['teeth']=teeth(p,(T['collarEnd']+T['leavesEnd'])/2,0.5)
        if r.key=='fuseeWheel':J['teeth']=teeth(p,0.05,15)
        (out/f'{r.key}.json').write_text(json.dumps(J,indent=1,ensure_ascii=False),encoding='utf-8');draw(r.key,p,J,out/f'{r.key}.png')
        t=J.get('teeth');print(f"{r.key:18s} box {J['size_in']} in, {len(J['cylinders'])} cylinders, {len(J['cones'])} cones"+(f", teeth {t['count']} tips {t['tips_d_in']} roots {t['roots_d_in']}" if t else ''))
if __name__=='__main__':main()
