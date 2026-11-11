"""recipe_solids.py: parts the page draws from their recipes' exact solids (the one-geometry pilot, 11 November 2026; PLAN-recipes.md). Each part named in the model's
checks.py's SOLIDS is built by its recipe (tools/recipes/: an exact B-rep, every size the page's own), tessellated face by face, put in the page's frame by the recipe's
to_page and written into the model's js/solids.js (WSOLIDS), which the page draws in place of its own hand-built mesh (shared/kit.js's brep; wempe/js/case.js). So the part
exists once: the STEP file a maker downloads and the mesh on the page are the same solid, and recipes.py --check compares the page with the recipe it came from.

    python recipe_solids.py --model wempe            # writes js/solids.js
    python recipe_solids.py --model wempe --check    # exit 1 if it is stale (a recipe, a size it reads or the list changed)
    python recipe_solids.py --model wempe --fault    # a planted fault: one triangle dropped from the first part, which must fail (an open edge)

The tessellation (OpenCascade's BRepMesh): no chord more than LIN mm from its surface or edge and no step turning more than ANG degrees, the page's own 72 to a turn. It is
then measured, not taken on trust: every triangle's centroid and edge midpoints against the exact solid's surface (the largest printed and written in the file's
header; exit 1 past 2 LIN). Each B-rep face keeps its own corners (the faces' borders share places, not corners) and every corner carries the exact surface's normal there:
a turned face shades smooth, and the Edges pass's creases fall on the solid's own edges, where its faces meet at an angle, not where an angle threshold finds one.
Each part is checked closed (every edge between two triangles, wound opposite ways), its volume against the exact solid's (exit 1 past 0.2 %) and every corner's
normal against its triangles' own (exit 1 past 20°: a face in the wrong frame or wound the wrong way).
Places are rounded to 1e-6 mm and normals to 1/32767 before they are written, so OpenCascade's rounding noise does not make the file stale. No browser; a few seconds a
part."""
import base64,hashlib,math,sys
import numpy as np
import model
import build123d as bd
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.BRep import BRep_Tool
from OCP.TopLoc import TopLoc_Location
from OCP.TopAbs import TopAbs_REVERSED
from OCP.GeomLProp import GeomLProp_SLProps
from OCP.BRepExtrema import BRepExtrema_DistShapeShape
from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeVertex
from OCP.gp import gp_Pnt
LIN=0.004;ANG=5.0;VOL=0.002;NRM=20.0   # NRM: a corner's exact normal against its triangle's own (a wrong frame or a flipped face shows as 40° or 180°; a step of ANG turns it ANG/2, a long thin triangle on a doubly curved face more)
OUT=model.DIR/'js'/'solids.js'

def recipes():
    if model.NAME=='wempe':
        from recipes import wempe;return wempe.RECIPES
    sys.exit('recipe_solids.py: no recipes yet for '+model.NAME)

def tess(sol):
    """the solid's faces as (places, normals, triangles), each face's corners its own; the normals the surface's own at each corner, outward"""
    BRepMesh_IncrementalMesh(sol.wrapped,LIN,False,math.radians(ANG),False)
    P=[];N=[];T=[];n0=0;off=[0.0]
    for f in sol.faces():
        loc=TopLoc_Location();tr=BRep_Tool.Triangulation_s(f.wrapped,loc)
        if tr is None:sys.exit('recipe_solids.py: a face has no triangulation')
        trsf=loc.Transformation();rev=f.wrapped.Orientation()==TopAbs_REVERSED;surf=BRep_Tool.Surface_s(f.wrapped);nn=tr.NbNodes()   # Surface_s(face): the surface where the face stands (its location applied), so its normals need no turning; the nodes are in the face's own frame
        p=np.empty((nn,3));nm=np.zeros((nn,3));bad=[]
        for i in range(1,nn+1):
            q=tr.Node(i).Transformed(trsf);p[i-1]=(q.X(),q.Y(),q.Z())
            ok=False
            if tr.HasUVNodes():
                uv=tr.UVNode(i);pr=GeomLProp_SLProps(surf,uv.X(),uv.Y(),1,1e-9)
                if pr.IsNormalDefined():
                    d=pr.Normal();nm[i-1]=(d.X(),d.Y(),d.Z());ok=True
            if not ok:bad.append(i-1)
        if rev:nm=-nm
        t=np.array([[tr.Triangle(i).Value(k) for k in (1,2,3)] for i in range(1,tr.NbTriangles()+1)],np.int64)-1
        if rev:t=t[:,[0,2,1]]
        # triangles of no area (a face's pole) dropped
        a=np.linalg.norm(np.cross(p[t[:,1]]-p[t[:,0]],p[t[:,2]]-p[t[:,0]]),axis=1);t=t[a>1e-12]
        # a corner where the surface has no normal (a cone's point, a sphere's pole): a corner of its own for each triangle there, its normal the mean of the triangle's other two
        if bad:
            B=set(bad);p=list(p);nm=list(nm)
            for ti in range(len(t)):
                for k in range(3):
                    if int(t[ti,k]) in B:
                        o=[nm[int(t[ti,j])] for j in range(3) if j!=k and int(t[ti,j]) not in B];s=np.sum(o,axis=0) if o else np.cross(p[t[ti,1]]-p[t[ti,0]],p[t[ti,2]]-p[t[ti,0]])
                        p.append(p[int(t[ti,k])]);nm.append(s/(np.linalg.norm(s) or 1));t[ti,k]=len(p)-1
            p=np.array(p);nm=np.array(nm)
        # each corner's normal against its triangles' own: within the step's turn on a curved face, the same on a flat one
        fn=np.cross(p[t[:,1]]-p[t[:,0]],p[t[:,2]]-p[t[:,0]]);fn/=np.linalg.norm(fn,axis=1,keepdims=True)
        for k in range(3):
            if len(t):off[0]=max(off[0],float(np.degrees(np.arccos(np.clip(np.einsum('ij,ij->i',fn,nm[t[:,k]]),-1,1))).max()))
        P.append(p);N.append(nm);T.append(t+n0);n0+=len(p)
    return np.vstack(P),np.vstack(N),np.vstack(T),off[0]

def closed(P,T):
    """every edge between two triangles, wound opposite ways (corners welded by place at 1e-6 mm, as the page's checks weld them)"""
    key=np.round(P*1e6).astype(np.int64);u,inv=np.unique(key,axis=0,return_inverse=True);W=inv.reshape(-1)[T]
    W=W[(W[:,0]!=W[:,1])&(W[:,1]!=W[:,2])&(W[:,2]!=W[:,0])]
    E=np.vstack([W[:,[0,1]],W[:,[1,2]],W[:,[2,0]]]);fw={}
    for a,b in E:fw[(a,b)]=fw.get((a,b),0)+1
    bad=sum(1 for (a,b),c in fw.items() if c!=1 or fw.get((b,a),0)!=1)
    return bad
def volume(P,T):return float(np.einsum('ij,ij->i',P[T[:,0]],np.cross(P[T[:,1]],P[T[:,2]])).sum()/6)
def deviation(sol,P,T,cap=6000):
    """the largest distance from the triangles (centroids and edge midpoints, up to cap of them, evenly taken) to the exact solid's surface"""
    a,b,c=P[T[:,0]],P[T[:,1]],P[T[:,2]];Q=np.vstack([(a+b+c)/3,(a+b)/2,(b+c)/2,(c+a)/2]);Q=Q[::max(1,len(Q)//cap)]
    sh=bd.Shell(sol.shells()[0].wrapped).wrapped if len(sol.shells())==1 else bd.Compound(sol.shells()).wrapped;mx=0.0
    for q in Q:
        d=BRepExtrema_DistShapeShape(BRepBuilderAPI_MakeVertex(gp_Pnt(*map(float,q))).Vertex(),sh)
        if d.IsDone():mx=max(mx,d.Value())
    return mx,len(Q)

def part(key,mk):
    r=mk();sol=r.build()
    if not hasattr(sol,'faces'):sys.exit(f'recipe_solids.py: {key} builds no solid')
    if getattr(r,'rev','last')!='last':sys.exit(f'recipe_solids.py: {key} is a recipe of another version ({r.rev}); only the versions that share the last revised part are drawn from it')
    P,N,T,off=tess(sol);vex=sol.volume
    dev,ns=deviation(sol,P,T)
    M=np.array(r.to_page,float);P=P@M[:3,:3].T+M[:3,3];N=N@M[:3,:3].T
    P=np.round(P,6)+0.0;N=N/np.maximum(np.linalg.norm(N,axis=1,keepdims=True),1e-30)
    return {'key':key,'hn':r.hn,'P':P.astype(np.float32),'N':np.round(N*32767).astype(np.int16),'T':T,'vex':vex,'vol':volume(P,T),'dev':dev,'ns':ns,'faces':len(sol.faces()),'off':off}

def js(parts):
    b=lambda a:base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
    rows=[];head=[]
    for q in parts:
        nv=len(q['P']);T=q['T'].astype(np.uint16 if nv<65536 else np.uint32)
        rows.append(f"{q['key']}:{{hn:'{q['hn']}',n:{nv},pos:'{b(q['P'].reshape(-1))}',nrm:'{b(q['N'].reshape(-1))}',idx:'{b(T.reshape(-1))}'}}")
        head.append(f"   {q['key']} ({q['hn']}): {q['faces']} faces, {nv} corners, {len(q['T'])} triangles, volume {q['vol']:.3f} mm³ (the exact solid {q['vex']:.3f}), at most {q['dev']*1000:.1f} µm off it")
    h=hashlib.sha256('\n'.join(rows).encode()).hexdigest()[:16]
    return ("/* solids.js: parts drawn from their recipes' exact solids (tools/recipes/), tessellated by tools/recipe_solids.py; do not edit. Each B-rep face's own corners (pos, mm,\n"
            f"   in the frame of the page's mesh), the exact surface's normal at each (nrm, /32767) and its triangles (idx). No chord over {LIN*1000:g} µm, no step over {ANG:g}°. sha {h}\n"
            +'\n'.join(head)+'\n   Declares only WSOLIDS */\n"use strict";\nconst WSOLIDS={'+',\n'.join(rows)+'};\n')

def main():
    keys=model.cfg('SOLIDS',[]);R=recipes();fail=0;parts=[]
    if not keys:sys.exit('recipe_solids.py: the model\'s checks.py names no SOLIDS')
    for k in keys:
        if k not in R:sys.exit(f'recipe_solids.py: no recipe {k}')
        q=part(k,R[k])
        if '--fault' in sys.argv and not parts:q['T']=q['T'][1:]
        bad=closed(q['P'].astype(np.float64),q['T']);dv=abs(q['vol']-q['vex'])/q['vex']
        ok=bad==0 and dv<VOL and q['dev']<2*LIN and q['off']<NRM
        print(f"{'  ok ' if ok else '  !! '} {k} ({q['hn']}): {q['faces']} faces, {len(q['P'])} corners, {len(q['T'])} triangles; {'closed' if bad==0 else f'{bad} open or doubled edges'}; volume {q['vol']:.3f} mm³ against the exact {q['vex']:.3f} ({100*dv:.3f} %); at most {q['dev']*1000:.2f} µm off the exact surface ({q['ns']} points); the corners' normals within {q['off']:.1f}° of their triangles'")
        fail|=not ok;parts.append(q)
    if fail:sys.exit(1)
    s=js(parts)
    if '--check' in sys.argv:
        old=OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        if old!=s:print(f'{OUT.name} is stale: run recipe_solids.py --model {model.NAME}');sys.exit(1)
        print(f'{OUT.name} up to date');return
    OUT.write_bytes(s.encode('utf-8'));print('wrote',OUT,f'{len(s)/1e3:.1f} kB')
if __name__=='__main__':main()
