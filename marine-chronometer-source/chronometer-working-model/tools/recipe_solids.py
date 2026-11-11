"""recipe_solids.py: parts the page draws from their recipes' exact solids (one geometry, 11 November 2026; PLAN-recipes.md). Each part named in the model's
checks.py's SOLIDS is built by its recipe (tools/recipes/: an exact B-rep, every size the page's own), tessellated face by face, put in the page's frame by the recipe's
to_page and written into the model's js/solids.js (WSOLIDS), which the page draws (shared/kit.js's brep; wempe/js/case.js): the page has no mesh of its own for it. So
the part exists once: the STEP file a maker downloads and the mesh on the page are the same solid.

    python recipe_solids.py --model wempe            # writes js/solids.js
    python recipe_solids.py --model wempe --check    # exit 1 if it is stale (a recipe, a size it reads or the list changed)
    python recipe_solids.py --model wempe --fault    # a planted fault: one triangle dropped from the first part, which must fail (an open edge)
    python recipe_solids.py --model wempe --sizes    # the encoding step by step: bytes, bytes in the page (base64), gzip (writes nothing; about a minute)

The tessellation (OpenCascade's BRepMesh): no chord more than LIN mm from its surface or edge (the cap) and its angular deflection ANG degrees, which gives steps of
half that: at ANG 10 a turn has 72 steps, the page's own (the tolerance by feature size: a chord at most 0.095 % of its radius off), and only a radius over 5.25 mm
is stepped finer, by the cap. The pilot's ANG 5 was 144 steps to a turn, twice the page's. The three case parts are small; a large part (the bowl, r 50) would want the
cap to grow with its radius. Each B-rep face
keeps its own corners and every corner carries the exact surface's normal there: a turned face shades smooth, and the Edges pass's creases fall on the solid's own edges.

The encoding (--sizes prints what each step saved, and the steps tried past the last and not taken, each under about 10 %):
  places   whole steps of q mm from a corner of the part's box, three 16-bit numbers a corner; q the finest of 1, 2, 5, 10, 20 µm that fits, so a place is at most
           q/2 off along each axis (a place at a whole step is exact, and a place two faces share stays one place);
  normals  octahedral, two signed bytes a corner (the nearest of the four codes round it; a normal along an axis is exact);
  corners  those of the same place and normal are one (a turned face's seam, faces tangent where they meet), so indices are shared where the faces allow (few do:
           a cylinder's corners are all on its two rims, where it meets other faces at an angle);
  indices  the triangles walked from neighbour to neighbour and the corners numbered as first met, each index as its distance back from the next new corner
           (0: the next new one), in 7-bit groups (nearly always one byte).
Everything is checked on the mesh decoded from what was written, as the page decodes it, not on the tessellation: closed (every edge between two triangles, wound
opposite ways), its volume against the exact solid's (exit 1 past 0.2 %), every triangle's centroid and edge midpoints against the exact solid's surface (the largest
printed and written in the file's header; exit 1 past DEV, 8 µm) and every corner's normal against its triangles' own (exit 1 past NRM: a face in the wrong frame or
wound the wrong way). No browser; a few seconds a part."""
import base64,gzip,hashlib,math,sys
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
LIN=0.005;ANG=10.0;VOL=0.002;NRM=20.0;DEV=0.008   # NRM: a corner's normal against its triangle's own (a wrong frame or a flipped face shows as 40° or 180°; a step of 5° turns it 2.5°, a long thin triangle on a doubly curved face more)
OUT=model.DIR/'js'/'solids.js'

def recipes():
    if model.NAME=='wempe':
        from recipes import wempe;return wempe.RECIPES
    sys.exit('recipe_solids.py: no recipes yet for '+model.NAME)

def tess(sol,ang=ANG,lin=LIN):
    """the solid's faces as (places, normals, triangles), each face's corners its own; the normals the surface's own at each corner, outward"""
    BRepMesh_IncrementalMesh(sol.wrapped,lin,False,math.radians(ang),False)
    P=[];N=[];T=[];n0=0
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
        P.append(p);N.append(nm);T.append(t+n0);n0+=len(p)
    return np.vstack(P),np.vstack(N),np.vstack(T)

# ---- the checks, on a mesh as decoded
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
    """the largest distance from the triangles (centroids and edge midpoints, up to cap of them, evenly taken) to the exact solid's surface (P in the solid's frame)"""
    a,b,c=P[T[:,0]],P[T[:,1]],P[T[:,2]];Qs=np.vstack([(a+b+c)/3,(a+b)/2,(b+c)/2,(c+a)/2]);Qs=Qs[::max(1,len(Qs)//cap)]
    sh=bd.Shell(sol.shells()[0].wrapped).wrapped if len(sol.shells())==1 else bd.Compound(sol.shells()).wrapped;mx=0.0
    for q in Qs:
        d=BRepExtrema_DistShapeShape(BRepBuilderAPI_MakeVertex(gp_Pnt(*map(float,q))).Vertex(),sh)
        if d.IsDone():mx=max(mx,d.Value())
    return mx,len(Qs)
def normoff(P,N,T):
    """the largest angle between a corner's normal and its triangle's own, degrees"""
    fn=np.cross(P[T[:,1]]-P[T[:,0]],P[T[:,2]]-P[T[:,0]]);l=np.linalg.norm(fn,axis=1);ok=l>1e-12;fn=fn[ok]/l[ok,None];T=T[ok]
    return max(float(np.degrees(np.arccos(np.clip(np.einsum('ij,ij->i',fn,N[T[:,k]]),-1,1))).max()) for k in range(3)) if len(T) else 0.0

# ---- the encoding
def b64(b):return base64.b64encode(bytes(b)).decode()
def varint(v):
    out=bytearray()
    for x in np.asarray(v).reshape(-1).tolist():
        while x>127:out.append(x&127|128);x>>=7
        out.append(x)
    return bytes(out)
def octdec(o):
    x=np.array(o[:,0],float);y=np.array(o[:,1],float);z=1-np.abs(x)-np.abs(y);t=np.maximum(-z,0);x+=np.where(x>=0,-t,t);y+=np.where(y>=0,-t,t);v=np.stack([x,y,z],1);return v/np.maximum(np.linalg.norm(v,axis=1,keepdims=True),1e-30)
def octenc(N,bits=8):
    """unit normals as octahedral codes, two signed integers of that many bits: of the four codes round each, the one whose normal is nearest"""
    m=(1<<bits-1)-1;n=N/np.maximum(np.abs(N).sum(1,keepdims=True),1e-30);s=lambda v:np.where(v>=0,1.0,-1.0)
    f=np.stack([np.where(n[:,2]>=0,n[:,0],(1-np.abs(n[:,1]))*s(n[:,0])),np.where(n[:,2]>=0,n[:,1],(1-np.abs(n[:,0]))*s(n[:,1]))],1)*m;best=bq=None
    for dx in (0,1):
        for dy in (0,1):
            c=np.clip(np.floor(f+1e-9)+[dx,dy],-m,m);d=np.einsum('ij,ij->i',octdec(c/m),N)
            if best is None:best=c;bq=d
            else:k=d>bq+1e-12;best[k]=c[k];bq[k]=d[k]
    return best.astype(np.int64)
def weld(G,O,T):
    """corners of one place and one normal made one; triangles left with two corners in one place dropped"""
    u,inv=np.unique(np.hstack([G,O]),axis=0,return_inverse=True);T=inv.reshape(-1)[T];g=u[:,:G.shape[1]]
    e=lambda a,b:(g[T[:,a]]==g[T[:,b]]).all(1);T=T[~(e(0,1)|e(1,2)|e(2,0))]
    return g,u[:,G.shape[1]:],T
def order(T):
    """the triangles walked from neighbour to neighbour (depth first over shared edges) and the corners numbered as first met: (the corners' old numbers in their new order, the triangles)"""
    E={}
    for i,t in enumerate(T.tolist()):
        for k in range(3):
            a,b=t[k],t[(k+1)%3];E.setdefault((min(a,b),max(a,b)),[]).append(i)
    seen=np.zeros(len(T),bool);out=[];L=T.tolist()
    for s in range(len(T)):
        if seen[s]:continue
        st=[s]
        while st:
            i=st.pop()
            if seen[i]:continue
            seen[i]=True;out.append(i);t=L[i]
            for k in (2,1,0):
                a,b=t[k],t[(k+1)%3]
                for j in E[(min(a,b),max(a,b))]:
                    if not seen[j]:st.append(j)
    T=T[out];new=-np.ones(int(T.max())+1,np.int64);perm=[]
    for v in T.reshape(-1).tolist():
        if new[v]<0:new[v]=len(perm);perm.append(v)
    return np.array(perm),new[T]
def hwm(T):
    hw=0;c=[]
    for v in T.reshape(-1).tolist():
        if v==hw:c.append(0);hw+=1
        else:c.append(hw-v)
    return varint(c)
def dvar(G):
    d=np.diff(G,axis=0,prepend=np.zeros((1,3),np.int64)).reshape(-1);return varint((d<<1)^(d>>63))
def grid(P):
    """the places as whole steps of q mm from a corner o of the part's box (o in steps), q the finest of 1, 2, 5, 10, 20 µm whose steps along the part fit 16 bits"""
    for q in (0.001,0.002,0.005,0.01,0.02):
        G=np.round(P/q).astype(np.int64);o=G.min(0)
        if (G.max(0)-o).max()<65536:return q,o,G-o
    sys.exit('recipe_solids.py: a part too long for 16-bit steps of 20 µm')
def encode(P,N,T):
    """the part as written: {n corners, t triangles, q the places' step, o their origin in steps, pos, nrm, idx (base64)}"""
    q,o,G=grid(P);G,O,T=weld(G,octenc(N),T);perm,T=order(T)
    return {'n':len(perm),'t':len(T),'q':q,'o':[int(v) for v in o],'pos':b64(G[perm].astype('<u2').tobytes()),'nrm':b64(O[perm].astype(np.int8).tobytes()),'idx':b64(hwm(T))}
def decode(d):
    """the mesh the page makes of it (shared/kit.js's brep, step for step): places as it holds them (32-bit), normals, triangles"""
    by=lambda s:np.frombuffer(base64.b64decode(s),np.uint8)
    P=((by(d['pos']).view('<u2').reshape(-1,3).astype(np.int64)+np.array(d['o']))*d['q']).astype(np.float32).astype(np.float64)
    N=octdec(by(d['nrm']).view(np.int8).reshape(-1,2)/127.0);I=[];hw=0;c=0;s=0
    for b in by(d['idx']).tolist():
        c|=(b&127)<<s;s+=7
        if not b&128:
            if c:I.append(hw-c)
            else:I.append(hw);hw+=1
            c=0;s=0
    if len(P)!=d['n'] or len(I)!=3*d['t'] or len(N)!=d['n'] or hw!=d['n']:sys.exit('recipe_solids.py: the decoded counts are not the written ones')
    return P,N,np.array(I,np.int64).reshape(-1,3)

def part(key,mk,ang=ANG,lin=LIN):
    """the recipe's solid and its tessellation in the page's frame"""
    r=mk();sol=r.build()
    if not hasattr(sol,'faces'):sys.exit(f'recipe_solids.py: {key} builds no solid')
    if getattr(r,'rev','last')!='last':sys.exit(f'recipe_solids.py: {key} is a recipe of another version ({r.rev}); only the versions that share the last revised part are drawn from it')
    P,N,T=tess(sol,ang,lin);M=np.array(r.to_page,float);R=M[:3,:3]
    if abs(R@R.T-np.eye(3)).max()>1e-9 or np.linalg.det(R)<0:sys.exit(f'recipe_solids.py: {key}: to_page is not a turn and a shift')
    return {'key':key,'hn':r.hn,'sol':sol,'M':M,'P':P@R.T+M[:3,3],'N':N@R.T,'T':T,'faces':len(sol.faces())}
def check(q,d,cap=6000):
    """the written part d decoded and checked against the exact solid; (ok, the line printed, the header's line)"""
    P,N,T=decode(d);M=q['M'];vex=q['sol'].volume;bad=closed(P,T);vol=volume(P,T);dv=abs(vol-vex)/vex;dev,ns=deviation(q['sol'],(P-M[:3,3])@M[:3,:3],T,cap);off=normoff(P,N,T)
    ok=bad==0 and dv<VOL and dev<DEV and off<NRM
    return ok,(f"{'  ok ' if ok else '  !! '} {q['key']} ({q['hn']}): {q['faces']} faces, {d['n']} corners, {d['t']} triangles; {'closed' if bad==0 else f'{bad} open or doubled edges'}; volume {vol:.3f} mm³ against the exact {vex:.3f} ({100*dv:.3f} %); "
        f"at most {dev*1000:.2f} µm off the exact surface ({ns} points); the corners' normals within {off:.1f}° of their triangles' (as decoded)"),f"   {q['key']} ({q['hn']}): {q['faces']} faces, {d['n']} corners, {d['t']} triangles, volume {vol:.3f} mm³ (the exact solid {vex:.3f}), at most {dev*1000:.1f} µm off it"

def row(q,d):return f"{q['key']}:{{hn:'{q['hn']}',n:{d['n']},t:{d['t']},q:{d['q']:g},o:[{','.join(map(str,d['o']))}],pos:'{d['pos']}',nrm:'{d['nrm']}',idx:'{d['idx']}'}}"
def js(rows,head):
    h=hashlib.sha256('\n'.join(rows).encode()).hexdigest()[:16]
    return ("/* solids.js: parts drawn from their recipes' exact solids (tools/recipes/), tessellated and encoded by tools/recipe_solids.py; do not edit. Each B-rep face's own\n"
            "   corners, those of one place and normal shared: n corners, t triangles; pos their places in the frame of the page's part, (o + three 16-bit numbers) whole steps\n"
            "   of q mm; nrm the exact surface's normal at each (octahedral, two signed bytes); idx the triangles' corners, each its distance back\n"
            f"   from the next new corner (0: that one; 7-bit groups); all base64. shared/kit.js's brep decodes it. No chord over {LIN*1000:g} µm, {720/ANG:g} steps to a turn. sha {h}\n"
            +'\n'.join(head)+'\n   Declares only WSOLIDS */\n"use strict";\nconst WSOLIDS={'+',\n'.join(rows)+'};\n')

def sizes(keys,R):
    """the encoding step by step, each on the parts together: the bytes, the bytes as written in the page (base64 in solids.js's rows) and those gzipped"""
    def tot(parts):
        raw=sum(len(b) for p in parts for b in p);s=',\n'.join("k:{pos:'%s',nrm:'%s',idx:'%s'}"%tuple(b64(b) for b in p) for p in parts);return raw,len(s),len(gzip.compress(s.encode(),9))
    f4=lambda P:P.astype('<f4').tobytes();n16=lambda N:np.round(N*32767).astype('<i2').tobytes();u16=lambda T:T.astype('<u2').tobytes()
    o8=lambda O:O.astype(np.int8).tobytes();g16=lambda G:G.astype('<u2').tobytes();gr=lambda P:grid(P)[2];cn=lambda L:(sum(len(x[0]) for x in L),sum(len(x[2]) for x in L))
    mesh=lambda a,lin:[(q['P'],q['N'],q['T']) for q in (part(k,R[k],a,lin) for k in keys)];rows=[];last=[None];L0=0.004   # L0, 5°: the pilot's tessellation
    def add(name,parts,W,take=True):
        raw,pg,gz=tot(parts);p=last[0];rows.append((name if take else '  ('+name+': not taken)',*cn(W),raw,pg,gz,'' if p is None else f'{100*(1-pg/p[0]):5.1f} % {100*(1-gz/p[1]):5.1f} %'))
        if take:last[0]=(pg,gz)
    def final(S):
        W=[]
        for P,N,T in S:
            G,O,T=weld(gr(P),octenc(N),T);perm,T=order(T);W.append((G[perm],O[perm],T))
        return W
    S=mesh(5.0,L0)
    add('the pilot: places 3 x 32-bit, normals 3 x 16-bit, indices 16-bit; 144 steps to a turn, 4 µm cap',[(f4(P),n16(N),u16(T)) for P,N,T in S],S)
    add('places 3 x 16-bit, whole steps of 1 or 2 µm in the part\'s box',[(g16(gr(P)),n16(N),u16(T)) for P,N,T in S],S)
    add('normals octahedral, 2 x 8-bit',[(g16(gr(P)),o8(octenc(N)),u16(T)) for P,N,T in S],S)
    W=[weld(gr(P),octenc(N),T) for P,N,T in S];add('corners of one place and normal shared',[(g16(G),o8(O),u16(T)) for G,O,T in W],W)
    for a in (7.5,10.0,15.0,20.0):
        W=[weld(gr(P),octenc(N),T) for P,N,T in mesh(a,L0)];add(f'{720/a:g} steps to a turn',[(g16(G),o8(O),u16(T)) for G,O,T in W],W,a<=ANG)
    for l in (0.005,0.006):
        W=[weld(gr(P),octenc(N),T) for P,N,T in mesh(ANG,l)];add(f'the cap to {l*1000:g} µm',[(g16(G),o8(O),u16(T)) for G,O,T in W],W,l<=LIN)
    S=mesh(ANG,LIN);W=final(S);add('indices as distances back, 7-bit groups (as written)',[(g16(G),o8(O),hwm(T)) for G,O,T in W],W)
    add('places as differences, 7-bit groups',[(dvar(G),o8(O),hwm(T)) for G,O,T in W],W,False)
    add('normals as differences',[(g16(G),o8(np.diff(O,axis=0,prepend=np.zeros((1,2),np.int64))),hwm(T)) for G,O,T in W],W,False)
    print(f"{'step (each with those taken before it)':86s} {'corners':>8s} {'triangles':>9s} {'bytes':>8s} {'in page':>8s} {'gzip':>8s}   saved: in page, gzip")
    for r in rows:print(f'{r[0]:86s} {r[1]:8d} {r[2]:9d} {r[3]:8d} {r[4]:8d} {r[5]:8d}   {r[6]}')

def main():
    keys=model.cfg('SOLIDS',[]);R=recipes();fail=0;rows=[];head=[]
    if not keys:sys.exit('recipe_solids.py: the model\'s checks.py names no SOLIDS')
    for k in keys:
        if k not in R:sys.exit(f'recipe_solids.py: no recipe {k}')
    if '--sizes' in sys.argv:return sizes(keys,R)
    for i,k in enumerate(keys):
        q=part(k,R[k])
        if '--fault' in sys.argv and i==0:q['T']=q['T'][1:]
        d=encode(q['P'],q['N'],q['T']);ok,line,h=check(q,d);print(line);fail|=not ok;rows.append(row(q,d));head.append(h)
    if fail:sys.exit(1)
    s=js(rows,head)
    if '--check' in sys.argv:
        old=OUT.read_text(encoding='utf-8') if OUT.exists() else ''
        if old!=s:print(f'{OUT.name} is stale: run recipe_solids.py --model {model.NAME}');sys.exit(1)
        print(f'{OUT.name} up to date');return
    OUT.write_bytes(s.encode('utf-8'));print('wrote',OUT,f'{len(s)/1e3:.1f} kB, gzip {len(gzip.compress(s.encode(),9))/1e3:.1f} kB')
if __name__=='__main__':main()
