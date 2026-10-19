"""Stress inside every stocky moving part, by finite elements on its own solids at the worst loads the transmission runs find (PLAN-motion-3d.md, phase 4).
numpy, scipy, pyamg; fea.py's brick element; no browser (it reads motion3d.py's dump).

    python motion3d_fe.py --model wempe [--version last|build] [--only part,part] [--n 250000]   # about 10-20 minutes a version

Reads r_motion3d/<model>/: meshes.json and geom.bin (the page's solids, motion3d.py), trace_<version>.js (wempe_transmission_trace.js: every element's load through a
beat, the key let go outright and eased, and the stop), mechanisms_wempe.json (the pawls' contacts). For each part below: its pieces voxelised together on one grid,
each brick its piece's material (from the page's colour: brass, steel, ruby, gold, beryllium copper), held at its pivots on its axis only (so the hold carries no torque)
and where its drive comes in, loaded where its drive goes out with the worst load of the four runs, solved (fea.py's trilinear bricks, pyamg), each brick's von Mises
stress. Writes stress_<version>.json (each part's case, the load and where, its peak stress (99.5th percentile of its bricks: a voxel model's stair corners overstate
the highest few), its material's limit and margin) and stress_<version>.bin (each mesh vertex's stress in MPa, Float32, mesh after mesh in meshes.json's order).
Linear-elastic, small strain: the system's nonlinearity is in the runs that give the loads; the forces are applied quasi-statically (no stress waves)."""
import json,math,pathlib,re,sys,time,base64
import numpy as np,scipy.sparse as sp,pyamg
from scipy.spatial import cKDTree
import model
import fea
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME;VER=arg('--version','last');D=HERE/'r_motion3d'/M;NT=int(arg('--n',250000));ONLY=arg('--only')
# materials by the page's colour (the model's mats: core.js): E (MPa), nu, the limit judged against (MPa: yield for brass and steel, the endurance where it turns many times)
MAT={'brass':(100e3,0.34,(300,450)),'steel':(207e3,0.29,(1200,1800)),'ruby':(380e3,0.27,(1900,2000)),'gold':(98e3,0.40,(500,700)),'becu':(130e3,0.30,(1000,1200))}
COL={'934008':'brass','a76517':'brass','7a470c':'brass','904208':'brass','b0711c':'brass','944315':'becu','b6bcc5':'steel','464c55':'steel','0b1129':'steel','020631':'steel',
     '43547a':'steel','262a31':'steel','424851':'steel','93020b':'ruby','ffffff':'ruby','d5dad1':'steel'}

def load_dump():
    J=json.loads((D/'meshes.json').read_text());G=(D/'geom.bin').read_bytes();out=[]
    for m in J['meshes']:
        lo,hi=np.array(m['box'][0]),np.array(m['box'][1]);q=np.frombuffer(G,'<u2',m['pos'][1]//2,m['pos'][0]).reshape(-1,3).astype(float)
        p=lo+q*np.where(hi-lo>0,(hi-lo)/65535,1);A=np.array(m['mat']).reshape(4,4).T;w=p@A[:3,:3].T+A[:3,3]
        o,n,t=m['idx'];ix=np.frombuffer(G,'<u2' if t=='2' else '<u4',n,o).astype(np.int64).reshape(-1,3)
        out.append({**m,'V':w,'F':ix})
    return J,out

def load_trace(v):
    s=(D/f'trace_{v}.js').read_text(encoding='utf-8');s=s[s.index('{'):s.rstrip().rindex('}')+1];T=json.loads(s)
    dec=lambda b:np.frombuffer(base64.b64decode(b),'<f4')
    return {r['name']:{k:dec(b) for k,b in r['forces'].items()} for r in T['S']},T['meta']

# ---- voxels on one grid for several pieces (fea.py's ray parity, per piece, the grid shared) ----
def grid_of(Vs,h,ratio=0.7):
    allp=np.vstack(Vs);x0,z0=allp[:,0].min()-h,allp[:,2].min()-h;nx=int(math.ceil((allp[:,0].max()+h-x0)/h));nz=int(math.ceil((allp[:,2].max()+h-z0)/h))
    y0,y1=allp[:,1].min()-0.25*h,allp[:,1].max()+0.25*h;ny=max(4,int(round((y1-y0)/(ratio*h))));return dict(x0=x0,z0=z0,y0=y0,h=h,dy=(y1-y0)/ny,nx=nx,ny=ny,nz=nz)
def vox(T,g):
    """fea.voxelize's columns on a given grid: the bricks inside T (n,3,3)"""
    h,x0,z0,y0,dy,nx,ny,nz=g['h'],g['x0'],g['z0'],g['y0'],g['dy'],g['nx'],g['ny'],g['nz']
    cx=x0+(np.arange(nx)+0.5)*h+1.37e-5;cz=z0+(np.arange(nz)+0.5)*h+0.71e-5;ci,cy=[],[]
    for t in T:
        (ax,ay,az),(bx,by,bz),(qx,qy,qz)=t;den=(bz-qz)*(ax-qx)+(qx-bx)*(az-qz)
        if abs(den)<1e-12:continue
        i0,i1=np.searchsorted(cx,min(ax,bx,qx)),np.searchsorted(cx,max(ax,bx,qx));k0,k1=np.searchsorted(cz,min(az,bz,qz)),np.searchsorted(cz,max(az,bz,qz))
        if i0>=i1 or k0>=k1:continue
        X,Z=np.meshgrid(cx[i0:i1],cz[k0:k1],indexing='ij');l1=((bz-qz)*(X-qx)+(qx-bx)*(Z-qz))/den;l2=((qz-az)*(X-qx)+(ax-qx)*(Z-qz))/den;l3=1-l1-l2
        m=(l1>=0)&(l2>=0)&(l3>=0)
        if m.any():I,K=np.nonzero(m);ci.append((I+i0)*nz+K+k0);cy.append((l1*ay+l2*by+l3*qy)[m])
    S=np.zeros((nx,ny,nz),bool)
    if not ci:return S
    ci,cy=np.concatenate(ci),np.concatenate(cy);o=np.lexsort((cy,ci));ci,cy=ci[o],cy[o];yc=y0+(np.arange(ny)+0.5)*dy
    st=np.r_[0,np.nonzero(np.diff(ci))[0]+1,len(ci)]
    for a,b in zip(st[:-1],st[1:]):
        ys=cy[a:b]
        if len(ys)%2:ys=ys[:-1]
        ix,iz=divmod(ci[a],nz);S[ix,:,iz]|=np.searchsorted(ys,yc)%2==1
    return S
def volume(V,F):
    a,b,c=V[F[:,0]],V[F[:,1]],V[F[:,2]];return abs(np.einsum('ij,ij->i',a,np.cross(b,c)).sum()/6)

# ---- the solve: fea.py's brick, a modulus per brick, dofs held one by one ----
def solve(X,conn,h,dy,Ee,nu,fixdof,F,ufix=None):
    n=len(X);ke,B0,D1=fea.brick(h,dy,h,1.0,nu);dof=(conn[:,:,None]*3+np.arange(3)).reshape(-1,24).astype(np.int64);K=None
    for s in range(0,len(dof),20000):
        d=dof[s:s+20000];vals=(ke.ravel()[None,:]*Ee[s:s+20000,None]).ravel()
        Kc=sp.coo_matrix((vals,(np.repeat(d,24,axis=1).ravel(),np.tile(d,24).ravel())),shape=(3*n,3*n)).tocsr();K=Kc if K is None else K+Kc
    fx=fixdof.ravel();fr=~fx;Kff=K[fr][:,fr].tocsr();c=X-X.mean(0)
    RB=np.zeros((3*n,6));RB[0::3,0]=1;RB[1::3,1]=1;RB[2::3,2]=1;RB[1::3,3],RB[2::3,3]=-c[:,2],c[:,1];RB[0::3,4],RB[2::3,4]=c[:,2],-c[:,0];RB[0::3,5],RB[1::3,5]=-c[:,1],c[:,0]
    rhs=F.ravel()[fr]
    if ufix is not None:uc=ufix.ravel()[fx];rhs=rhs-K[fr][:,fx]@uc   # prescribed displacements on the held dofs (a submodel's cut faces)
    ml=pyamg.smoothed_aggregation_solver(Kff,B=RB[fr],max_coarse=500);res=[];uf=ml.solve(rhs,tol=1e-9,accel='cg',maxiter=600,residuals=res)
    u=np.zeros(3*n);u[fr]=uf
    if ufix is not None:u[fx]=uc
    eps=np.einsum('ij,ej->ei',B0,u[dof]);s=(eps@D1.T)*Ee[:,None]
    vm=np.sqrt(0.5*((s[:,0]-s[:,1])**2+(s[:,1]-s[:,2])**2+(s[:,2]-s[:,0])**2)+3*(s[:,3:]**2).sum(1))
    return u.reshape(-1,3),vm,res[-1]/res[0]

def smooth(cent,vm,k=19):
    """each brick's stress averaged with its nearest k (about one brick each way): a voxel model's stair corners concentrate stress the real surface doesn't have"""
    d,ix=cKDTree(cent).query(cent,k=min(k,len(cent)));return vm[ix].mean(1)

class Part:
    """a part's pieces voxelised on one grid; nodes, bricks, each brick's material"""
    def __init__(s,meshes,ntarget=NT,win=None,h=None):
        s.meshes=meshes;vol=sum(volume(m['V'],m['F']) for m in meshes);s.h=h or max(0.02,(vol/(0.7*ntarget))**(1/3))
        s.g=grid_of([m['V'] for m in meshes],s.h);s.win=win
        if win is not None:   # a window (x0, x1, z0, z1): only its columns, the submodel's
            x0,x1,z0,z1=win;s.g.update(x0=x0,z0=z0,nx=int(math.ceil((x1-x0)/s.h)),nz=int(math.ceil((z1-z0)/s.h)))
        S=np.zeros((s.g['nx'],s.g['ny'],s.g['nz']),np.int16)-1;mat=['steel']
        for k,m in enumerate(meshes):
            nm=COL.get(m['mat0'] or '','steel');nm='gold' if (m['pk'] or '').endswith('.gold') else nm
            if nm not in mat:mat.append(nm)
            S[vox(m['V'][m['F']],s.g)&(S<0)]=mat.index(nm)
        s.mats=mat;G=dict(s.g,solid=S>=0);X,conn,e=fea.mesh_of(G);s.X,s.conn=X,conn;s.bm=S[e[:,0],e[:,1],e[:,2]];s.cent=X[conn].mean(1)
        s.E=np.array([MAT[mat[i]][0] for i in s.bm],float);s.nb=len(conn)
        cnt=np.bincount(conn.ravel(),minlength=len(X));s.surf=cnt<8   # a node on the surface belongs to fewer than 8 bricks
    def inside(s,c,m=0.3):
        """whether c lies over this grid's columns (a window's), with a margin: holds and loads outside a window are its cut faces' business"""
        g=s.g;return (g['x0']-m<=c[0]<=g['x0']+g['nx']*g['h']+m) and (g['z0']-m<=c[2]<=g['z0']+g['nz']*g['h']+m)
    def near_axis(s,pt,r):
        d=np.hypot(s.X[:,0]-pt[0],s.X[:,2]-pt[2]);return d<=r
    def patch(s,P,r,yband=None):
        if s.win is not None and not s.inside(P):return np.zeros(len(s.X),bool)
        d=np.hypot(s.X[:,0]-P[0],s.X[:,2]-P[2]);m=(d<=r)&s.surf
        if yband is not None:m&=(s.X[:,1]>=yband[0]-1e-9)&(s.X[:,1]<=yband[1]+1e-9)
        if not m.any():   # the nearest surface nodes
            k=np.argsort(np.where(s.surf,d,1e9))[:8];m=np.zeros(len(s.X),bool);m[k]=True
        return m

def ax_of(m,inp='E'):
    f=(m.get('drv') or {}).get(inp)
    return (np.array(f['pt']),np.sign(f['ax'][1]) or 1.0) if f and f['kind']=='turn' else (None,1.0)

def peak(series,runs):
    """the largest |value| of a channel over the runs: (value, run)"""
    best=(0.0,None)
    for r,ch in runs.items():
        if series in ch:
            a=ch[series];i=int(np.argmax(np.abs(a)))
            if abs(a[i])>abs(best[0]):best=(float(a[i]),r)
    return best

# ---------------------------------------------------------------- the cases (the Wempe)
RHO={'brass':8.45e-9,'steel':7.85e-9,'ruby':3.98e-9,'gold':11.6e-9,'becu':8.25e-9}   # t/mm^3 (N, mm, s)
def main():
    t0=time.time();J,ms=load_dump();runs,meta=load_trace(VER);MJ=json.loads((HERE/'mechanisms_wempe.json').read_text());PW={p['name']:p for p in MJ['pawls']}
    import subprocess
    MESH=json.loads(subprocess.run(['node','-e',"process.argv.push('--model','wempe');const TR=require('./wempe_transmission.js');console.log(JSON.stringify(TR.MESH.map(q=>({nm:q.nm,zA:q.zA,zB:q.zB,m:q.m}))))"],cwd=HERE,capture_output=True,text=True,encoding='utf-8').stdout.strip().split('\n')[-1])
    MK=[k for k in next(iter(runs.values())).keys() if k.startswith('mesh:')]   # the trace's mesh channels, in TR.MESH's order
    for q,k in zip(MESH,MK):q['nm']=k[5:]
    byp=lambda part,pcs=None:[m for m in ms if m['part']==part and (pcs is None or (m['pk'] or part).split('.')[-1] in pcs or (m['pk'] or '')==part and part in pcs)]
    def axis(part,inp='E'):
        for m in byp(part):
            p,sg=ax_of(m,inp)
            if p is not None:return p,sg
        raise SystemExit(f'no axis for {part} ({inp})')
    def yext(mm):a=np.vstack([m['V'] for m in mm]);return a[:,1].min(),a[:,1].max()
    pk=lambda nm:peak(nm,runs)
    res={};sbuf={}
    def run(name,mm,setup,note,lim=None):
        if ONLY and name not in ONLY.split(','):return
        t1=time.time();P=Part(mm);fix=np.zeros((len(P.X),3),bool);F=np.zeros((len(P.X),3));info=setup(P,fix,F)
        if not fix.any():raise SystemExit(f'{name}: nothing held')
        u,vm,rr=solve(P.X,P.conn,P.h,P.g['dy'],P.E,0.3,fix,F)
        vm=smooth(P.cent,vm)
        wins=[];tree0=cKDTree(P.X)
        for wkey in ('out','in'):
            if wkey not in info:continue
            C=np.array(info[wkey]['at']);mod=info[wkey].get('m',0.3);Rw=max(3.2*mod,0.9);hf=max(0.012,mod/9)
            Pf=Part(mm,win=(C[0]-Rw,C[0]+Rw,C[2]-Rw,C[2]+Rw),h=hf)
            if Pf.nb==0:continue
            fixf=np.zeros((len(Pf.X),3),bool);Ff=np.zeros((len(Pf.X),3));setup(Pf,fixf,Ff)
            g=Pf.g;eps=1e-6;bd=(Pf.X[:,0]<=g['x0']+eps)|(Pf.X[:,0]>=g['x0']+g['nx']*g['h']-eps)|(Pf.X[:,2]<=g['z0']+eps)|(Pf.X[:,2]>=g['z0']+g['nz']*g['h']-eps)
            d,ix=tree0.query(Pf.X[bd],k=8);w=1/np.maximum(d,1e-9);uc=np.zeros((len(Pf.X),3));uc[bd]=(u[ix]*w[:,:,None]).sum(1)/w.sum(1)[:,None];fixf[bd]=True
            uf_,vmf,rrf=solve(Pf.X,Pf.conn,Pf.h,Pf.g['dy'],Pf.E,0.3,fixf,Ff,ufix=np.where(fixf,uc,0))
            vmr=vmf;vmf=smooth(Pf.cent,vmf)
            # the root's stress: away from the contact itself (a point load's own singularity, Hertz's not bending's) and from the cut faces
            busy=(np.abs(Ff).sum(1)>0)|(fixf.any(1)&~bd);bn=Pf.X[busy];far=np.ones(Pf.nb,bool)
            if len(bn):dd,_=cKDTree(bn).query(Pf.cent);far&=dd>max(3*hf,0.6*mod)   # the root's bending, clear of the contact (whose own pressure is Hertz's: info['hertz'])
            cx=Pf.cent;far&=(cx[:,0]>g['x0']+2*hf)&(cx[:,0]<g['x0']+g['nx']*hf-2*hf)&(cx[:,2]>g['z0']+2*hf)&(cx[:,2]<g['z0']+g['nz']*hf-2*hf)
            rootpk=float(vmf[far].max()) if far.any() else 0.0;kk=int(np.argmax(np.where(far,vmf,-1)))
            wins.append({'at':C.tolist(),'R':Rw,'h':hf,'bricks':Pf.nb,'peak':rootpk,'raw':float(vmr[far].max()) if far.any() else 0.0,'where':Pf.cent[kk].tolist(),'mat':Pf.mats[Pf.bm[kk]],'contact':float(vmf.max()),'resid':rrf,'P':Pf,'vm':vmf})
        busy0=fix.any(1)|((np.abs(F).sum(1)>0) if not info.get('body') else False);farc=np.ones(P.nb,bool)   # a load through the body (the balance's inertia) isn't a contact's singularity
        if busy0.any():dd0,_=cKDTree(P.X[busy0]).query(P.cent);farc=dd0>2.5*P.h
        vmc=np.where(farc,vm,0);pk995=float(np.percentile(vmc,99.5));mx=float(vmc.max());k=int(np.argmax(vmc));mat=P.mats[P.bm[k]]
        if wins:   # the part's peak: the highest root stress its windows find (the coarse grid's own peak where it is higher, away from the windows)
            wb=max(wins,key=lambda x:x['peak'])
            if wb['peak']>pk995:pk995,mat=wb['peak'],wb['mat'];k=None
        lo,hi=MAT[mat][2]
        res[name]={'note':note,**info,'h':P.h,'bricks':P.nb,'peak':pk995,'max':mx,'at':(P.cent[k].tolist() if k is not None else wb['where']),'windows':[{x:y for x,y in w.items() if x not in('P','vm')} for w in wins],'mat':mat,'limit':[lo,hi],'margin':[lo/pk995,hi/pk995] if pk995>0 else None,'resid':rr,'disp':float(np.abs(u).max())}
        tree=cKDTree(P.cent)
        for m in mm:
            d,ix=tree.query(m['V'],k=4);w=1/np.maximum(d,1e-6);sv=(vm[ix]*w).sum(1)/w.sum(1)
            for W in wins:   # the windows' finer stress where they cover a vertex
                g=W['P'].g;inn=(m['V'][:,0]>g['x0'])&(m['V'][:,0]<g['x0']+g['nx']*g['h'])&(m['V'][:,2]>g['z0'])&(m['V'][:,2]<g['z0']+g['nz']*g['h'])
                if inn.any():d2,i2=cKDTree(W['P'].cent).query(m['V'][inn],k=4);w2=1/np.maximum(d2,1e-6);sv[inn]=(W['vm'][i2]*w2).sum(1)/w2.sum(1)
            sbuf[m['id']]=sv.astype('<f4')
        print(f"  {name:22s} {P.nb:7d} bricks h {P.h:.3f}, windows {[(round(w['h'],3),w['bricks'],round(w['peak'],1),round(w['contact'])) for w in wins]}: peak {pk995:8.1f} MPa in {mat}, margin {lo/max(pk995,1e-9):.1f}-{hi/max(pk995,1e-9):.1f}; {info.get('load','')}; contact {info.get('hertz',0):.0f} MPa (Hertz) ({time.time()-t1:.0f} s, resid {rr:.1e})",flush=True)
    AX={k:axis(p) for k,p in [('fw','fuseeWheel'),('centre','centreWheel'),('inter','intermediateWheel'),('sec','secondsWheel'),('esc','escapeWheel')]}
    def mesh_pt(i):
        q=MESH[i];a,b=[x for x in q['nm'].split(' → ')];kA,kB=[['fw','centre','inter','sec','esc'][j] for j in range(5) if False] or (None,None)
        return q
    TRAIN=[('fw','centre'),('centre','inter'),('inter','sec'),('sec','esc')]
    def hertz(F,rA,rB,b,EA,EB,nu=0.3):
        """the most pressure (MPa) of two cylinders' line contact: F (N) over b (mm), radii rA, rB (mm)"""
        Es=1/((1-nu**2)/EA+(1-nu**2)/EB);R=1/(1/rA+1/rB);return math.sqrt(F*Es/(math.pi*b*R))
    def contact(i):
        a,b=TRAIN[i];cA,_=AX[a];cB,sB=AX[b];u=(cB-cA)/np.linalg.norm(cB-cA);q=MESH[i];rA=q['m']*q['zA']/2;P=cA+rA*u
        lam,rn=pk('mesh:'+q['nm']);rB=P-cB;rB[1]=0;tau=np.array([0,sB*abs(lam)*1e3,0]);FB=np.cross(tau,rB)/(rB@rB)   # N·m to N·mm; the force on the driven pinion's leaf
        return P,FB,lam,rn
    WHEELS={'fw':('fuseeWheel',['fuseeWheel']),'centre':('centreWheel',['arbor','wheel']),'inter':('intermediateWheel',['arbor','wheel']),'sec':('secondsWheel',['arbor','wheel']),'esc':('escapeWheel',['collet','pinion','wheel'])}
    def wheel_y(k):part,_=WHEELS[k];return yext(byp(part,['wheel'] if k!='fw' else ['fuseeWheel']))
    print(f'{M} ({VER}): {len(ms)} meshes; the loads from trace_{VER}.js (runs: {", ".join(runs)})',flush=True)
    for i,k in enumerate(['fw','centre','inter','sec','esc']):
        part,pcs=WHEELS[k];mm=byp(part,pcs);c,_=AX[k]
        def setup(P,fix,F,i=i,k=k,c=c):
            info={}
            ax=P.near_axis(c,0.75*P.h);ys=P.X[:,1];fix[ax,0]=fix[ax,2]=True;yb=ys[ax].min() if ax.any() else ys.min();fix[ax&(ys<=yb+1e-9),1]=True   # the pivots: on the axis only, the lower end axially
            if k!='fw':   # the drive comes in at its pinion's leaf from the wheel before it: held there
                Pin,FB,lam,rn=contact(i-1);yb2=wheel_y(TRAIN[i-1][0]);m=P.patch(Pin,0.6*MESH[i-1]['m'],yb2);fix[m]=True;info['in']={'at':Pin.tolist(),'mesh':MESH[i-1]['nm'],'m':MESH[i-1]['m']}
            else:   # the fusee wheel: its drive comes from the maintaining spring's pins and the ratchet: held at its hub
                m=P.near_axis(c,4.5)&P.surf;fix[m]=True
            if k!='esc':
                Po,FB,lam,rn=contact(i);m=P.patch(Po,0.6*MESH[i]['m'],wheel_y(k));F[m]+=(-FB/m.sum() if m.any() else 0);q=MESH[i];yw=wheel_y(k);info['hertz']=hertz(float(np.linalg.norm(FB)),q['m']*q['zA']/2*0.342,q['m']*q['zB']/2*0.342,yw[1]-yw[0],100e3,207e3);info.update(load=f"{abs(lam):.3g} N·m on the next pinion, {np.linalg.norm(FB):.1f} N at its pitch point ({rn})",out={'at':Po.tolist(),'F':(-FB).tolist(),'run':rn,'m':MESH[i]['m']})
            else:   # the escape wheel: the tooth on the locking stone (the detent's stone: the ruby nearest the wheel's tips), the whole escape torque at the tip
                rub=[m for m in byp('detent') if m['mat0']=='93020b'];cen=[m['V'].mean(0) for m in rub];j=int(np.argmin([abs(np.hypot(*(x-c)[[0,2]])-7.0) for x in cen]));S=cen[j]
                lam,rn=pk('mesh:'+MESH[3]['nm']);r=S-c;r[1]=0;rt=r/np.linalg.norm(r)*7.0;tau=np.array([0,AX['esc'][1]*abs(lam)*1e3,0]);Ft=-np.cross(tau,rt)/(rt@rt)
                m=P.patch(c+rt,0.15,wheel_y('esc'));F[m]+=(Ft/m.sum() if m.any() else 0);info.update(load=f"{abs(lam):.3g} N·m held at a tooth's tip on the locking stone, {np.linalg.norm(Ft):.2f} N ({rn})",out={'at':(c+rt).tolist(),'F':Ft.tolist(),'run':rn,'m':MESH[3]['m']})
            return info
        run(part,mm,setup,'a wheel on its arbor: the pinion driven by the wheel before it, its wheel driving the next pinion, held on its axis at its pivots')
    # ---- the fusee and its click wheel, the clicks, the maintaining ratchet and detent, the barrel and its arbor, the set-up ratchet, the stop, the balance, the rollers ----
    cF,_=axis('fuseeWheel');cBr,_=axis('barrel','ms')
    chainV=np.vstack([m['V'] for m in byp('chain')]);uFB=(cBr-cF)[[0,2]];uFB=uFB/np.linalg.norm(uFB)
    nF=chainV[np.hypot(*(chainV[:,[0,2]]-cF[[0,2]]).T)<18.5];pF=nF[np.argmax((nF[:,[0,2]]-cF[[0,2]])@uFB)]   # where the chain leaves the fusee for the barrel
    nB=chainV[np.hypot(*(chainV[:,[0,2]]-cBr[[0,2]]).T)<22.8];pB=nB[np.argmax(-(nB[:,[0,2]]-cBr[[0,2]])@uFB)]   # and the barrel for the fusee
    dFB=pB-pF;dFB[1]=0;dFB=dFB/np.linalg.norm(dFB);Tch,rch=pk('chain')
    def pawl(name,ch,c0):
        q=PW[name];C=np.array(q['face']['C']);n=np.array(q['face']['n']);arm=abs(C[0]*n[1]-C[1]*n[0]);tq,rn=pk(ch);Fm=abs(tq)*1e3/arm
        return c0+np.array([C[0],0,C[1]]),np.array([n[0],0,n[1]]),Fm,tq,rn,c0+np.array([q['pivot'][0],0,q['pivot'][1]])
    def on_axis(P,fix,c,ylow=True):
        ax=P.near_axis(c,0.75*P.h);fix[ax,0]=fix[ax,2]=True
        if ylow and ax.any():y=P.X[:,1];fix[ax&(y<=y[ax].min()+1e-9),1]=True
    def ball(P,c,r,yb=None,minn=24):
        """the nodes within r of c in plan (within yb); where the point is in a hole (a pivot's screw), the hole's wall: every node within r of the nearest material"""
        if P.win is not None and not P.inside(c):return np.zeros(len(P.X),bool)
        d=np.linalg.norm((P.X-c)[:,[0,2]],axis=1);ok=np.ones(len(P.X),bool)
        if yb is not None:ok&=(P.X[:,1]>=yb[0])&(P.X[:,1]<=yb[1])
        m=ok&(d<=r)
        if m.sum()<minn:d0=d[ok].min() if ok.any() else d.min();m=ok&(d<=d0+max(r,2*P.h))
        return m
    yc=lambda part,pcs:yext(byp(part,pcs))
    def push(P,F,c,f,r,yb=None):
        m=ball(P,c,r,yb)
        if m.any():F[m]+=f/m.sum()
        return m
    P1=pawl('click 1','click1',cF);P2=pawl('click 2','click2',cF);PC=P1 if abs(P1[3])>=abs(P2[3]) else P2   # the click the runs load harder (the fusee holds on one at a time)
    def s_fusee(P,fix,F):
        on_axis(P,fix,cF);m=ball(P,PC[0],0.35,yc('fusee',['clickWheel']));fix[m]=True   # held where the click holds its wheel
        push(P,F,pF,Tch*dFB,0.8,(pF[1]-0.9,pF[1]+0.9))
        return {'load':f"the chain’s pull {abs(Tch):.1f} N where it leaves the fusee ({rch}); held at the click on its click wheel",'out':{'at':PC[0].tolist(),'m':0.3},'in':{'at':pF.tolist(),'m':0.5}}
    run('fusee',byp('fusee'),s_fusee,'the fusee with its click wheel: the chain pulls, the click on the click wheel holds')
    def s_clicks(P,fix,F):
        C,n,Fm,tq,rn,pv=PC;fix[ball(P,pv,1.0)]=True;pv2=cF-(pv-cF);pv2[1]=pv[1];fix[ball(P,pv2,1.0)]=True;push(P,F,C,n*Fm,0.25)
        return {'load':f"{Fm:.1f} N on its nose ({abs(tq):.3g} N·m on the click wheel, {rn})",'out':{'at':C.tolist(),'m':0.3}}
    run('maintaining.clicks',byp('maintaining',['clicks']),s_clicks,'the maintaining clicks (05 06 02-3): the click wheel’s tooth on its nose, held on its screw')
    PD=pawl('maintaining detent','detent',cF)
    def s_ratchet(P,fix,F):
        C,n,Fm,tq,rn,pv=PD;on_axis(P,fix,cF,False)
        for q in byp('maintaining',['clickScrews']):fix[ball(P,q['V'].mean(0),1.3)]=True
        push(P,F,C,-n*Fm,0.25);return {'load':f"{Fm:.1f} N from the maintaining detent ({abs(tq):.3g} N·m, {rn}); held at the clicks’ screws",'out':{'at':C.tolist(),'m':0.2}}
    run('maintaining.ratchet',byp('maintaining',['ratchet']),s_ratchet,'the maintaining ratchet (05 06 02-1): the detent on its tooth, the clicks carrying the drive')
    def s_detent(P,fix,F):
        C,n,Fm,tq,rn,pv=PD;fix[ball(P,pv,0.9)]=True;push(P,F,C,n*Fm,0.25)
        return {'load':f"{Fm:.1f} N on its nose ({rn}); held on its arbor",'out':{'at':C.tolist(),'m':0.2}}
    run('maintDetent',byp('maintDetent'),s_detent,'the maintaining detent (05 05 05-1): the ratchet’s tooth on its nose, held on its arbor')
    def s_barrel(P,fix,F):
        for q in byp('barrel',['hook']):fix[ball(P,q['V'].mean(0),1.6)]=True
        bo=P.near_axis(cBr,2.6)&P.surf;fix[bo,0]=fix[bo,2]=True;push(P,F,pB,-Tch*dFB,0.8,(pB[1]-0.9,pB[1]+0.9))
        return {'load':f"the chain’s pull {abs(Tch):.1f} N on the drum ({rch}); held at the spring’s hook block",'out':{'at':pB.tolist(),'m':0.5}}
    run('barrel',byp('barrel'),s_barrel,'the barrel (drum, lid, Steg, hook block): the chain pulls, the mainspring’s outer end holds')
    Tsp,rsp=pk('spring');hk=np.vstack([q['V'] for q in byp('barrelArbor',['hook'])]).mean(0)
    def s_arbor(P,fix,F):
        on_axis(P,fix,cBr,False);y=P.X[:,1]
        if P.win is None:fix[y<=y.min()+2.0]=True
        r=hk-cBr;r[1]=0;f=np.cross([0,abs(Tsp)*1e3,0],r)/(r@r)
        hv=np.vstack([q['V'] for q in byp('barrelArbor',['hook'])]);lo,hi=hv.min(0)-0.05,hv.max(0)+0.05;m=P.surf&np.all((P.X>=lo)&(P.X<=hi),axis=1)
        if m.sum()<6:m=ball(P,hk,0.6)
        F[m]+=f/m.sum()
        return {'load':f"the mainspring’s {abs(Tsp):.3g} N·m on its hook ({rsp}); held at its square by the set-up ratchet",'out':{'at':hk.tolist(),'m':0.3}}
    run('barrelArbor',byp('barrelArbor'),s_arbor,'the barrel arbor: the mainspring’s inner end on its hook, the set-up ratchet holding its square')
    PS=pawl('set-up click','spring',cBr)
    def s_setup(P,fix,F):
        C,n,Fm,tq,rn,pv=PS;fix[P.near_axis(cBr,2.6)]=True;push(P,F,C,-n*Fm,0.3);return {'load':f"{Fm:.1f} N from the set-up click ({abs(tq):.3g} N·m, {rn})",'out':{'at':C.tolist(),'m':0.4}}
    run('setupRatchet',byp('setupRatchet'),s_setup,'the set-up ratchet (05 07 00-3): the set-up click on its tooth, held on the arbor’s square')
    pin=np.vstack([q['V'] for q in byp('topPlate',['stopPin'])]).mean(0);Tst,rst=pk('stop');rp=pin-cF;rp[1]=0;fst=np.cross([0,abs(Tst)*1e3,0],rp)/(rp@rp)
    def s_bar(P,fix,F):
        for q in byp('stopWork',['barpin']):fix[ball(P,q['V'].mean(0),0.6)]=True
        bar=np.vstack([q['V'] for q in byp('stopWork',['bar'])]);k=np.argmin(np.linalg.norm((bar-pin)[:,[0,2]],axis=1));push(P,F,bar[k],-fst,0.4)
        return {'load':f"{np.linalg.norm(fst):.1f} N from the stop pin ({abs(Tst):.3g} N·m on the fusee, {rst}); held at its pin",'out':{'at':bar[k].tolist(),'m':0.4}}
    run('stopWork.bar',byp('stopWork',['bar','barpin']),s_bar,'the stop bar (05 06 03-1): the stop pin against it at full wind')
    def s_pin(P,fix,F):
        y=P.X[:,1];fix[y<=-19.0]=True;m=y>=y.max()-1.2;F[m]+=fst/m.sum();return {'load':f"{np.linalg.norm(fst):.1f} N from the stop bar ({rst}); held in the top plate",'out':{'at':pin.tolist(),'m':0.4}}
    run('topPlate.stopPin',byp('topPlate',['stopPin']),s_pin,'the stop pin (05 08 01-5): the stop bar against it, standing out of the top plate')
    cBa,_=axis('balance','th');Ab,_=pk('balance');Wb,rb=pk('balanceW');alpha=Wb**2/max(abs(Ab),1e-6);col=yc('hairspring',['collet'])
    def s_bal(P,fix,F):
        m=P.near_axis(cBa,1.0)&(P.X[:,1]>=col[0]-0.5)&(P.X[:,1]<=col[1]+0.5)
        if m.sum()<12:ax=P.near_axis(cBa,1.2);dy=np.abs(P.X[:,1]-(col[0]+col[1])/2);m=ax&(dy<=np.sort(dy[ax])[min(60,ax.sum()-1)])
        fix[m]=True
        rho=np.array([RHO[P.mats[i]] for i in P.bm]);vol=P.h*P.h*P.g['dy'];r=P.cent-cBa;r[:,1]=0
        f=(rho*vol)[:,None]*(alpha*np.cross([0,1,0],r)+Wb**2*r)   # N (t/mm^3 x mm^3 x mm/s^2): the turn's tangential and the spin's radial acceleration at once
        np.add.at(F,P.conn.ravel(),np.repeat(f/8,8,axis=0));return {'body':True,'load':f"swinging to {np.degrees(abs(Ab)):.0f}°: {abs(alpha):.0f} rad/s² at the turn, {abs(Wb):.1f} rad/s at the centre ({rb}); held at the hairspring’s collet"}
    run('balance',byp('balance'),s_bal,'the balance (rim, arm, masses, timing weights, staff): its own inertia, the hairspring holding it')
    Te,re_=pk('mesh:'+MESH[3]['nm']);imp=[q for q in byp('rollers',['impulse']) if q['mat0']=='93020b'][0]['V'].mean(0);ri=imp-cBa;ri[1]=0;fi=np.cross([0,abs(Te)*1e3/7.0*np.linalg.norm(ri),0],ri)/(ri@ri)
    def s_rol(P,fix,F):
        fix[P.near_axis(cBa,0.9)]=True;push(P,F,imp,fi,0.35);return {'load':f"the escape tooth’s {np.linalg.norm(fi):.2f} N on the impulse stone ({re_}); held on the staff",'out':{'at':imp.tolist(),'m':0.2}}
    run('rollers',byp('rollers'),s_rol,'the rollers (impulse and discharge, with their stones): the escape wheel’s tooth on the impulse stone')
    if ONLY and (D/f'stress_{VER}.json').exists():   # a partial run: the other parts' results kept
        old=json.loads((D/f'stress_{VER}.json').read_text());ob=(D/f'stress_{VER}.bin').read_bytes();oi=json.loads((D/f'stress_{VER}.idx.json').read_text())
        res={**{k:v for k,v in old['parts'].items() if k not in res},**res}
        for i,(o_,n_) in oi.items():
            if int(i) not in sbuf:sbuf[int(i)]=np.frombuffer(ob,'<f4',n_,o_).copy()
    out={'model':M,'version':VER,'parts':res,'h':'each part at its own brick size'}
    (D/f'stress_{VER}.json').write_text(json.dumps(out,indent=1))
    order=[m['id'] for m in ms];buf=bytearray();idx={}
    for m in ms:
        if m['id'] in sbuf:idx[m['id']]=[len(buf),len(sbuf[m['id']])];buf+=sbuf[m['id']].tobytes()
    (D/f'stress_{VER}.bin').write_bytes(bytes(buf));(D/f'stress_{VER}.idx.json').write_text(json.dumps(idx))
    print(f'wrote stress_{VER}.json, .bin ({len(buf)/1e6:.1f} MB) in {time.time()-t0:.0f} s')
if __name__=='__main__':main()
