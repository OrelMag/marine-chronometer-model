"""hamilton_parts.py: the Hamilton Model 21's parts as Hamilton Watch Co. drew them (recipes/hamilton.py, from js/hdims.js's HD), built apart from the model
and shown in a page of their own, marine-chronometer-source/hamilton-parts/index.html (open the file). Not in the model yet: the page and its data are all
they reach (PLAN-hamilton-drawings.md).

    python hamilton_parts.py [--only a,b] [--check]      (about 1 s a part)

It runs hdraw.py's checks on HD's outlines first, then builds each recipe as an exact solid (build123d) and checks it: one closed, valid solid of positive
volume; every drilled hole there, a cylindrical face of its radius on its axis; a toothed part's tips at the drawn diameter (within its tolerance, the form's
reach printed). It writes hamilton-parts/js/hparts.js (HPARTS: each part's triangles and its B-rep edges, its sizes, sources, flags, notes and operation
sheet) and hamilton-parts/step/KEY.step (a file whose content is the same but for its header's time is kept). --check writes nothing and exits 1 if a check
fails or a file is stale. No scan or crop of a sheet goes into either: the sheets are the NAWCC's (INVENTORY.md); only their numbers, cited by item."""
import argparse,base64,json,math,pathlib,re,subprocess,sys,tempfile,time
import numpy as np
import build123d as bd
from recipes import Hole,Drill
from recipes.sheet import sheet
from recipes import hamilton as H
HERE=pathlib.Path(__file__).resolve().parent
OUT=HERE.parents[1]/'hamilton-parts'
def norm(b):return re.sub(rb"[-+]?\d\.\d+E-(?:1[3-9]|[2-9]\d)",b"0.",re.sub(rb"'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d'",b"''",b,count=1))   # recipes_site.py's: the header's time and rounding noise
def b64(a,t):return base64.b64encode(np.asarray(a,t).tobytes()).decode()
def q16(P,lo,hi):
    """points (flat xyz) as uint16 steps within the part's box (lo, hi): about 0.0007 mm on the largest part, far below any drawn size"""
    P=np.asarray(P,float).reshape(-1,3);lo=np.asarray(lo);sp=np.maximum(np.asarray(hi)-lo,1e-9)
    return b64(np.round((P-lo)/sp*65535).clip(0,65535),'<u2')

def edges_of(p):
    """the solid's B-rep edges as line segments: a line its two ends, a curve sampled to 0.01 mm of chord height"""
    S=[]
    for e in p.edges():
        if e.geom_type==bd.GeomType.LINE:pts=[e.position_at(0),e.position_at(1)]
        else:
            L=e.length;n=8
            try:
                r=e.radius;n=max(4,min(256,math.ceil(L/max(1e-3,math.sqrt(8*r*0.01)))))   # a chord's height h = c²/8r
            except Exception:n=max(8,min(256,math.ceil(L/0.05)))
            pts=[e.position_at(i/n) for i in range(n+1)]
        for a,b in zip(pts,pts[1:]):S+=[a.X,a.Y,a.Z,b.X,b.Y,b.Z]
    return S

def check(r,p):
    """the part's own checks; returns (fails, notes)"""
    F=[];N=[]
    if not p.is_valid:F.append('not a valid solid')
    if len(p.solids())!=1:F.append(f'{len(p.solids())} solids, not one')
    if not p.volume>0:F.append(f'volume {p.volume}')
    cyl=[f for f in p.faces() if f.geom_type==bd.GeomType.CYLINDER]
    for o in r.ops():
        if isinstance(o,Hole):   # a cylindrical face of the hole's radius on its axis: along Z through (x, y), or a Drill's own line (o along u)
            q0,u=((o.o,o.u) if isinstance(o,Drill) else ((o.at[0],o.at[1],0),(0,0,1)));ok=False
            for f in cyl:
                try:
                    rad=f.radius;ax=f.axis_of_rotation
                except Exception:continue
                d=ax.direction;q=ax.position;w=(q.X-q0[0],q.Y-q0[1],q.Z-q0[2]);c=(w[1]*u[2]-w[2]*u[1],w[2]*u[0]-w[0]*u[2],w[0]*u[1]-w[1]*u[0])
                if abs(abs(d.X*u[0]+d.Y*u[1]+d.Z*u[2])-1)<1e-6 and abs(rad-o.d/2)<1e-4 and math.sqrt(sum(x*x for x in c))<1e-4:ok=True;break
            (N if ok else F).append(f"hole {o.key or ''} Ø {o.d:.4f} on its axis through ({q0[0]:.3f}, {q0[1]:.3f}, {q0[2]:.3f})"+(' there' if ok else ' missing'))
    od=getattr(r,'od',None)
    if od:   # the tips: the farthest the solid reaches from its axis, against the drawn diameter's tolerance
        v,_=p.tessellate(0.0005,0.05);R=2*max(math.hypot(q.X,q.Y) for q in v);lo,hi=od['d']+od['tol'][0],od['d']+od['tol'][1]
        (N if lo-1e-4<=R<=hi+1e-4 else F).append(f"tips Ø {R:.4f} against the drawn {od['d']:.4f} ({od['tol'][0]:+.4f}/{od['tol'][1]:+.4f})")
    return F,N

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a=argparse.ArgumentParser();a.add_argument('--only');a.add_argument('--check',action='store_true');o=a.parse_args()
    hd=subprocess.run([sys.executable,str(HERE/'hdraw.py')],capture_output=True,text=True)
    print(hd.stdout.strip().splitlines()[-1] if hd.stdout.strip() else hd.stderr)
    if hd.returncode:sys.exit('hamilton_parts.py: hdraw.py failed')
    bad=0;parts=[];stale=[];sd=OUT/'step'
    if not o.check:sd.mkdir(parents=True,exist_ok=True)
    for grp,mk in H.RECIPES:
        r=mk()
        if o.only and r.key not in o.only.split(','):continue
        t=time.time();p=r.build();p.label=f'{r.title} {r.hn}';F,N=check(r,p);bad+=bool(F)
        print(f"{'FAIL' if F else 'ok  '} {r.key} ({r.hn}): {len(r.ops())} operations, volume {p.volume:.4f} mm³, {time.time()-t:.1f} s")
        for s in N:print('       '+s)
        for s in F:print('  !!   '+s)
        v,tri=p.tessellate(0.003,0.2);V=[c for q in v for c in (q.X,q.Y,q.Z)];T=[i for f in tri for i in f]
        bb=p.bounding_box();lo,hi=[round(x,4) for x in (bb.min.X,bb.min.Y,bb.min.Z)],[round(x,4) for x in (bb.max.X,bb.max.Y,bb.max.Z)]   # the box the data carries: the points quantised within it
        parts.append({'key':r.key,'hn':r.hn,'group':grp,'title':r.title,'drawing':r.drawing,'material':r.material,'treatment':r.treatment,'flat':bool(getattr(r,'flat',False)),
          'flags':getattr(r,'flags',[]),'fits':r.fits,'notes':r.notes,'volume':round(p.volume,4),'box':lo+hi,
          'checks':N,'fails':F,'ops':[{'n':i+1,'text':q.text,'sizes':q.sizes} for i,q in enumerate(r.ops())],'sheet':sheet(r),
          'v':q16(V,lo,hi),'i':b64(T,'<u2' if len(v)<65536 else '<u4'),'i32':len(v)>=65536,'e':q16(edges_of(p),lo,hi),'step':f'step/{r.key}.step'})
        with tempfile.TemporaryDirectory() as tmp:
            f=pathlib.Path(tmp)/'x.step';bd.export_step(p,str(f));b=f.read_bytes()
        s=sd/f'{r.key}.step'
        if not(s.exists() and norm(s.read_bytes())==norm(b)):
            stale.append(s.name)
            if not o.check:s.write_bytes(b)
    if o.only:print('--only: hparts.js left as it is');sys.exit(1 if bad else 0)
    txt=('/* hparts.js: the Hamilton Model 21\'s parts as Hamilton drew them (tools/recipes/hamilton.py, from js/hdims.js), for index.html beside it.\n'
         '   Written by tools/hamilton_parts.py; do not edit by hand. Declares only HPARTS. Meshes base64: v uint16 xyz steps within box (lo..hi, mm), i uint16 triangles (uint32 where i32), e uint16 edge segments as v */\n'
         '"use strict";\nconst HPARTS='+json.dumps(parts,separators=(',',':'),ensure_ascii=False)+';\n')
    js=OUT/'js'/'hparts.js'
    if not js.exists() or js.read_bytes()!=txt.encode('utf-8'):
        stale.append(js.name)
        if not o.check:js.parent.mkdir(parents=True,exist_ok=True);js.write_bytes(txt.encode('utf-8'))
    print('\n'.join(('stale: ' if o.check else 'wrote ')+s for s in stale) or 'up to date',f'({js.stat().st_size//1024} KB)' if js.exists() else '')
    sys.exit(1 if bad or (o.check and stale) else 0)
if __name__=='__main__':main()
