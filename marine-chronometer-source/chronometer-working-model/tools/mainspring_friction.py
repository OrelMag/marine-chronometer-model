"""The mainspring's coil friction: how much more torque winding takes than running gives (the hysteresis physics.js and benchcheck.py allowed as 5-15 %),
from the model's own solved shapes. No browser; torch (CPU), numpy, scipy.

    python mainspring_friction.py              # about 3 minutes (14 processes); writes mainspring_friction.json here, read by physics.js and benchcheck.py
    python mainspring_friction.py --check      # the same, exit 1 if mainspring_friction.json is not what it finds
    python mainspring_friction.py --variants [--check] [--fz]   # each variant mainspring.py --bound has solved (mainspring_bound.json), about a minute each; --fz adds drive.js's candidates
    python mainspring_friction.py --nivaflex [--check]   # (or MC_MS_T=0.386 MC_MS_E=220) a variant strip (the build's Nivaflex: mainspring.py's variant, mainspring_t0.386.js),
                                               # into mainspring_friction_t0.386.json: the fusee's rule sets it up, its full wind and run down found here

mainspring.py solves the strip's shape at each state of the wind (js/mainspring.js, MSHAPE: a state every quarter turn) as the one of least bending energy with
its coils kept apart, without friction. Each state here is polished from its stored shape by the same solve (warm, so a few rounds), and then:
  - the forces: where the coils press on each other the constraint's multipliers, found from the solved shape by non-negative least squares on the stationarity
    conditions (the bending energy's gradient against the contacts' and the length's), (EI/2) times each the force in N; where a coil lies on the barrel's wall
    or on the arbor's core the force is what the stationarity leaves at that sample; the hook's grip and the brace hold the ends without sliding;
  - the slip: between one state and the next, how far each contact's two surfaces slide on each other (coil on coil: in the arbor's frame, the difference of
    the arc lengths at the contact's angle on the coil and on the one over it; on the wall: in the barrel's frame, which turns with the wind; on the core:
    in the arbor's);
  - the friction: its work, mu times each force times its slip, over the quarter turn, is a torque mu ... / (2 pi dT) the arbor feels against its turn:
    added winding, taken away running (the state's shape taken as friction leaves it: a first-order estimate, good while the friction torque is small
    against the spring's own).
mu: greased steel on steel, 0.08-0.2 lubricated (the CRC Handbook of Chemistry and Physics, 43rd ed., p. 2181, as cited in US 3,939,081; Misumi's table: grease
0.16 static, oil 0.08 kinetic); 0.10 taken, 0.08 and 0.16 tried. Against a measurement: a mainspring unwinds with 10-20 % less torque than it winds (ICMFF9,
gruppofrattura.it). Left out: the strip's edges on the barrel's floor and cap, and the set (the steel's own hysteresis), which add to it.
"""
import base64,json,math,os,pathlib,re,sys
import numpy as np,torch
from scipy.optimize import nnls
torch.set_default_dtype(torch.float64)
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent;sys.path.insert(0,str(HERE))
import mainspring as MS
E_ST=MS.E_GPA*1e3;B=float(MS.B_MM or 13.55);EI=E_ST*B*MS.t**3/12   # N·mm²: carbon steel (physics.js), the strip 13.55 × 0.394; or a variant's (MC_MS_T, MC_MS_E)
MUS=[0.08,0.10,0.16];MU0=0.10
OUT=HERE/('mainspring_friction.json' if not MS.VAR else f'mainspring_friction_{MS.VAR}.json')
# the fusee as the page builds it (movement.js makeFusee: R.fs.MS.Tup and Tdown, the spring's turns fully wound and run down; and at n fusee turns from full wind, the
# barrel's turns Ib(n) and the fusee wheel's torque(n) against fully wound, from the solved spring without friction). tools/invariants.py holds them to the page
TUP,TDOWN=19.1089,14.38764
FUSEE=[[0,0,1],[0.25,0.10444,0.99927],[0.5,0.20993,0.99881],[0.75,0.31649,0.99839],[1,0.42416,0.99819]
  ,[1.25,0.53299,0.99817],[1.5,0.64302,0.99826],[1.75,0.7543,0.99858],[2,0.86686,0.99897],[2.25,0.98078,0.99953]
  ,[2.5,1.0961,1.00016],[2.75,1.21288,1.00103],[3,1.33118,1.002],[3.25,1.45109,1.00309],[3.5,1.57266,1.00429]
  ,[3.75,1.69599,1.00554],[4,1.82116,1.00688],[4.25,1.94826,1.00833],[4.5,2.0774,1.00991],[4.75,2.2087,1.01146]
  ,[5,2.34227,1.01312],[5.25,2.47825,1.0146],[5.5,2.6168,1.01619],[5.75,2.75807,1.01755],[6,2.90226,1.01893]
  ,[6.25,3.04957,1.02005],[6.5,3.20024,1.02092],[6.75,3.35454,1.02167],[7,3.51275,1.0216],[7.25,3.67522,1.02116]
  ,[7.5,3.84236,1.02011],[7.75,4.01462,1.01769],[8,4.19255,1.01427],[8.25,4.3768,1.00952],[8.5,4.56815,1.00227]]
# the page's fusee rule (movement.js, below its makeFusee: read off ?qa, 12 October 2026): INT the barrel's turns while the chain leaves the fusee, IN over the
# whole wind, RHO0 the chain's lever fully wound against run down, rc(md(0)) / rc(ME); the set-up is where the spring's pull falls by RHO0 over INT turns
INT,IN,RHO0=4.622065,TUP-TDOWN,0.5264253
shape=lambda f:json.loads(re.search(r'const MSHAPE=(\{.*?\});',f.read_text(encoding='utf-8')).group(1))
MSM=shape(MC/'js'/'mainspring.js');MSD=shape(MS.JS)   # the model's spring (the page's), and the one solved here (the same, or a variant)
def setup(D):
    """movement.js's bisection on the pull table D: the turns fully wound and run down"""
    pl=lambda T:float(np.interp(T,D['T'],D['pull']));ta,tb=D['T0'],D['T'][-1]-IN
    for _ in range(40):
        m=(ta+tb)/2
        if pl(m)/pl(m+INT)<RHO0:ta=m
        else:tb=m
    return ta+INT,ta+INT-IN
WEMPE=(MS.VAR or '').startswith('wempe')   # the Wempe's spring (wempe_mainspring.py --friction): its own fusee, set up 3/4 turn past its slack (05 06_20), its barrel's turns over the wind from the drawn
# fusee and drum (wempe_mainspring.py), the Hamilton's fusee rule and bench band not used
if WEMPE:
    import wempe_mainspring as WM
    TDOWN=round(WM.table(MS.JS)['slack']+0.75,5);TUP=round(TDOWN+float(WM.IB[-1]),5)
elif MS.VAR:   # the variant: the rule (checked on the model's spring) sets it up; the fusee wheel's torque, its pull at the barrel's turns times the chain's lever,
    # the lever the model's (its torque over its pull: the fusee is the same)
    tu,_=setup(MSM);assert abs(tu-TUP)<0.0005,f'the rule gives {tu} fully wound for the model\'s spring, the page {TUP}'
    pm=lambda T:float(np.interp(T,MSM['T'],MSM['pull']));pv=lambda T:float(np.interp(T,MSD['T'],MSD['pull']));TU,TD=setup(MSD)
    FUSEE=[[n,ib,round(pv(TU-ib)/pv(TU)*tq/(pm(TUP-ib)/pm(TUP)),5)] for n,ib,tq in FUSEE];TUP,TDOWN=round(TU,4),round(TD,5)
BT=0.01   # mm: a sample this close to the core or the wall lies on it (the solve approaches its bounds through a sigmoid)
states=MS.stored   # MSHAPE's states on the solver's grid: r at N+1 = 48 T + 1 angles from the inner end
def polish(T,r0,rounds=4):
    """mainspring.py's solve from a stored shape: the augmented Lagrangian over L-BFGS, warm"""
    N=len(r0)-1;lo=MS.a0;R0=MS.R0;nh=int(MS.HOLD/(2*math.pi*T/N))+1
    u=torch.logit(torch.tensor((r0-lo)/(R0-lo)).clamp(1e-6,1-1e-6)).requires_grad_(True)
    def R(u):
        r=(lo+(R0-lo)*torch.sigmoid(u)).clone();r[:nh]=MS.a0;r[-2:]=R0;return r
    lamL=torch.tensor(0.);lamN=torch.zeros(N+1);muL=10.*4**2;muN=1e3*4**2
    for _ in range(rounds):
        opt=torch.optim.LBFGS([u],lr=1,max_iter=2000,tolerance_grad=1e-11,tolerance_change=1e-15,history_size=50,line_search_fn='strong_wolfe')
        def clos():
            opt.zero_grad();r=R(u);E,l,_,_=MS.energy(r,T);cL=l.sum()-MS.L;g=MS.p-MS.nest(r,T)
            f=E+lamL*cL+muL/2*cL**2+(torch.clamp(lamN+muN*g,min=0)**2-lamN**2).sum()/(2*muN);f.backward();return f
        opt.step(clos)
        with torch.no_grad():r=R(u);E,l,_,_=MS.energy(r,T);lamL=lamL+muL*(l.sum()-MS.L);lamN=torch.clamp(lamN+muN*(MS.p-MS.nest(r,T)),min=0);muL*=4;muN*=4
    with torch.no_grad():r=R(u)
    polish.lam=(lamN.numpy().copy(),float(lamL));return r.numpy(),nh
def coilpress(T,r,nh,tau):
    """the pressure between the coils (N/mm) by the packed spiral's ring equations: each coil a ring of radius r_m bent by M_m = EI mean(k - k0) over it;
    the torque about the arbor's centre the same at every section (frictionless: the contacts' pressure is radial), so the hoop force A_m = (tau - M_m)/r_m;
    a ring's radial balance passes the pressure across it, p (inside it) = p (outside it) + A_m / r_m, from nothing outside a pack's outermost coil (the
    arbor's pack) or inside a pack's innermost (the wall's). Returns per sample the pressure on the interface over it (coil on coil), on the wall, on the core"""
    N=len(r)-1;per=int(round(N/T));rt=torch.tensor(r);l,k,w,s=[x.numpy() for x in MS.geom(rt,T)];s=s*MS.L/s[-1]
    kk=np.concatenate([[k[0]],k,[k[-1]]]);k0=MS.k0(torch.tensor(s)).numpy();Mj=EI*(kk-k0)   # at every sample
    nest=MS.nest(rt,T).numpy();cc=nest<MS.p+0.003;wall=r>=MS.R0-BT;core=(r<=MS.a0+BT)&(np.arange(N+1)>=nh)
    nT=int(np.ceil((N+1)/per));Mc=np.zeros(nT);Rc=np.zeros(nT)
    for m in range(nT):
        a,b=m*per,min(N+1,(m+1)*per);Mc[m]=Mj[a:b].mean();Rc[m]=r[a:b].mean()
    A=(tau-Mc)/Rc;up=np.zeros(N+1);pw=np.zeros(N+1);pk=np.zeros(N+1)
    # the coils whose samples press on the coil over them, turn by turn: runs of turns form packs
    pr=np.array([cc[m*per:min(N+1,(m+1)*per)].mean() for m in range(nT)])>0.5
    m=0
    while m<nT:
        if not pr[m]:m+=1;continue
        a=m
        while m<nT and pr[m]:m+=1
        b=m   # turns a..b-1 press on the turn over them; the pack is turns a..b
        onwall=Rc[min(b,nT-1)]>=MS.R0-2*MS.p or wall[min(N,b*per):min(N+1,(b+1)*per)].any()
        if not onwall:   # on the arbor: nothing outside turn b
            p=0.;P=np.zeros(nT)
            for j in range(b,a,-1):p=p+A[j]/Rc[j];P[j-1]=max(p,0)
            for j in range(a,b):up[j*per:min(N+1,(j+1)*per)]=P[j]
            pc=P[a]+A[a]/Rc[a] if a>0 else P[0]+A[0]/Rc[0];pk[core]=max(pc,0)
        else:      # on the wall: nothing inside turn a
            p=0.;P=np.zeros(nT)
            for j in range(a,b):p=p-A[j]/Rc[j];P[j]=max(p,0)
            for j in range(a,b):up[j*per:min(N+1,(j+1)*per)]=P[j]
            pw[wall]=max(p-A[min(b,nT-1)]/Rc[min(b,nT-1)],0)
    up[~cc]=0
    return up,pw,pk,A,Mc,Rc

def arc(T,r):
    N=len(r)-1;th=np.arange(N+1)*2*math.pi*T/N;P=np.stack([r*np.cos(th),r*np.sin(th)],1);s=np.concatenate([[0],np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]);return th,s*MS.L/s[-1]
def job(a):
    torch.set_num_threads(1);T,r0=a;r,nh=polish(T,np.array(r0));return dict(T=T,r=r.tolist(),nh=nh,E=float(MS.energy(torch.tensor(r),T)[0]))
def xy(T,r):N=len(r)-1;th=np.arange(N+1)*2*math.pi*T/N;return np.stack([r*np.cos(th),r*np.sin(th)],1)
def work(A,B_,mu):
    """the friction's work (N·mm) from state A to state B: each side's pressures with the slip between them, averaged. The slip follows the steel: the two
    pieces that touch (on a coil and on the one over it) moved from A to B, the difference of their movements along the strip (the frame's own turn cancels:
    both are at one place); on the wall against the barrel's turn (-2 pi dT in the arbor's frame); on the core against the arbor (still in its frame)"""
    P={k:xy(X['T'],np.array(X['r'])) for k,X in (('A',A),('B',B_))};S={k:arc(X['T'],np.array(X['r'])) for k,X in (('A',A),('B',B_))}
    at=lambda k,q:np.stack([np.interp(q,S[k][1],P[k][:,0]),np.interp(q,S[k][1],P[k][:,1])],1)
    dT=B_['T']-A['T'];c,sn=math.cos(-2*math.pi*dT),math.sin(-2*math.pi*dT);out={'cc':0.,'wall':0.,'core':0.}
    for X,key in ((A,'A'),(B_,'B')):
        th,s=S[key];r=np.array(X['r']);N=len(r)-1;_,_,w,_=MS.geom(torch.tensor(r),X['T']);w=np.concatenate([[w[0].item()],w.numpy(),[w[-1].item()]])
        up,pw,pk=(np.array(X[k]) for k in ('up','pw','pk'))
        i=np.where(up>0)[0]
        if len(i):
            si=s[i];so=np.interp(th[i]+2*math.pi,th,s);dI=at('B',si)-at('A',si);dO=at('B',so)-at('A',so);t=np.stack([-np.sin(th[i]),np.cos(th[i])],1)
            out['cc']+=0.5*mu*(up[i]*w[i]*np.abs(((dO-dI)*t).sum(1))).sum()
        i=np.where(pw>0)[0]
        if len(i):
            pa=at('A',s[i]);wallmove=np.stack([pa[:,0]*c-pa[:,1]*sn,pa[:,0]*sn+pa[:,1]*c],1)-pa;d=at('B',s[i])-pa-wallmove;t=np.stack([-np.sin(th[i]),np.cos(th[i])],1)
            out['wall']+=0.5*mu*(pw[i]*w[i]*np.abs((d*t).sum(1))).sum()
        i=np.where(pk>0)[0]
        if len(i):
            d=at('B',s[i])-at('A',s[i]);t=np.stack([-np.sin(th[i]),np.cos(th[i])],1);out['core']+=0.5*mu*(pk[i]*w[i]*np.abs((d*t).sum(1))).sum()
    return out
def main():
    from multiprocessing import Pool
    T0,st=states()
    with Pool(int(os.environ.get('MC_MS_PROC',14))) as P:sol=P.map(job,[(T,r.tolist()) for T,r in st])
    sol.sort(key=lambda x:x['T']);n=len(sol)
    for k,X in enumerate(sol):   # each state's torque (the energy's slope, N·mm a radian), then its pressures
        a,b=max(0,k-1),min(n-1,k+1);X['tau']=EI/2*(sol[b]['E']-sol[a]['E'])/(sol[b]['T']-sol[a]['T'])/(2*math.pi)
        up,pw,pk,_,_,_=coilpress(X['T'],np.array(X['r']),X['nh'],X['tau']);X['up'],X['pw'],X['pk']=up.tolist(),pw.tolist(),pk.tolist()
    rows=[]
    for A,B_ in zip(sol[:-1],sol[1:]):
        dT=B_['T']-A['T'];Tm=(A['T']+B_['T'])/2;M0=EI/2*(B_['E']-A['E'])/dT/(2*math.pi)   # N·mm: the energy's slope a radian of the arbor
        w={mu:work(A,B_,mu) for mu in MUS};dM={mu:sum(v.values())/(2*math.pi*dT) for mu,v in w.items()}
        rows.append(dict(T=round(Tm,3),M0=round(M0/1000,5),dM={str(mu):round(dM[mu]/1000,6) for mu in MUS},parts={k:round(v/(2*math.pi*dT)/1000,6) for k,v in w[MU0].items()}))
    # over the fusee's turns: the friction's work against the spring's, running and winding; and the fusee wheel's torque running
    def over(mu):
        Wf=W0=0.
        for r_ in rows:
            a,b=max(TDOWN,r_['T']-0.125),min(TUP,r_['T']+0.125)
            if b>a:Wf+=r_['dM'][str(mu)]*2*math.pi*(b-a);W0+=r_['M0']*2*math.pi*(b-a)
        return Wf/W0
    Ts=np.array([r_['T'] for r_ in rows]);fr=lambda mu,T:float(np.interp(T,Ts,[r_['dM'][str(mu)]/r_['M0'] if r_['M0']>0 else 0 for r_ in rows]))
    if WEMPE:return dict(summary=dict(Tup=TUP,Tdown=TDOWN,t=MS.t,gap=MS.gap,L=MS.L,ra=MS.ra,Rw=MS.Rw,B=B,E=MS.E_GPA,T0=T0,loss={str(mu):round(over(mu),4) for mu in MUS},hyst={str(mu):round(2*over(mu),4) for mu in MUS},
        top={str(mu):round(1-fr(mu,TUP),4) for mu in MUS},down={str(mu):round(1-fr(mu,TDOWN),4) for mu in MUS}),
        note="tools/mainspring_friction.py on the Wempe's spring (mainspring_wempe.js, wempe_mainspring.py): T the turns from the inner end, M0 the frictionless torque (N·m), dM the friction's torque (N·m) at each mu, added winding and taken away running; parts: coil on coil, on the wall, on the core at mu 0.10",T0=T0,EI=EI,mus=MUS,rows=rows)
    run={str(mu):[[n,ib,round(tq*(1-fr(mu,TUP-ib)),5)] for n,ib,tq in FUSEE] for mu in MUS};ev=lambda q:(max(q)-min(q))/np.mean(q)
    # the set-up against the friction: wound d turns less (or more) than the page's rule sets it, the fusee's frictionless torque scales with the solved spring's pull
    # (MSHAPE.pull, mainspring.py's smoothed slope) at the shifted turns, and the friction's share comes off it running; the part of the wind whose torque leaves the
    # bench's band about its mean (bench.json: the escape wheel's torque that keeps the swing 247.5-270 deg), and the shift that keeps the most of it inside
    pl=lambda T:float(np.interp(T,MSD['T'],MSD['pull']))
    band=json.loads((HERE/'bench.json').read_text(encoding='utf-8'))['criteria']['fusee']['band']
    def shifted(d,mu):
        q=[tq*pl(TUP+d-ib)/pl(TUP-ib)*(1-fr(mu,TUP+d-ib)) for n,ib,tq in FUSEE];m=np.mean(q);out=np.mean([not(band[0]<=x/m-1<=band[1]) for x in q]);return q,out,(max(q)-min(q))/m
    SH=[]
    for d in np.arange(-1.0,0.101,0.05):
        if TUP+d>MSD['T'][-1] or TDOWN+d<MSD['T0']:continue
        q,o,e=shifted(d,MU0);SH.append([round(float(d),2),round(float(o),4),round(float(e),4)])
    best=min(SH,key=lambda x:(x[1],x[2]));q0,o0,_=shifted(0,MU0)
    SU=dict(rows=SH,best=best,now=[0,round(float(o0),4)],band=band,hours=round(o0*56,1))
    BD=json.loads((HERE/'mainspring_bound.json').read_text(encoding='utf-8')).get(MS.VAR or 'model') if (HERE/'mainspring_bound.json').exists() else None   # coil-bound (mainspring.py --bound)
    summary=dict(setup=SU,Tup=TUP,Tdown=TDOWN,t=MS.t,gap=MS.gap,L=MS.L,ra=MS.ra,E=MS.E_GPA,T0=T0,bound=BD and BD['bound'],room=BD and round(BD['bound']-TUP,4),loss={str(mu):round(over(mu),4) for mu in MUS},hyst={str(mu):round(2*over(mu),4) for mu in MUS},
      fusee=dict(frictionless=FUSEE,running=run,even0=round(ev([q[2] for q in FUSEE]),4),even={str(mu):round(ev([q[2] for q in run[str(mu)]]),4) for mu in MUS},
        top={str(mu):round(1-fr(mu,TUP),4) for mu in MUS}))
    return dict(summary=summary,note='tools/mainspring_friction.py: the mainspring\'s coil friction from the model\'s solved states (mainspring.js): T the turns from the inner end, M0 the frictionless torque (N·m), dM the friction\'s torque (N·m) at each mu, added winding and taken away running; parts: coil on coil, on the wall, on the core at mu 0.10',
                T0=T0,EI=EI,mus=MUS,rows=rows)
def variants():
    """--variants: this tool once a variant in mainspring_bound.json (the strips mainspring.py --bound has solved: the build's Nivaflex and the sources'
    proportions), each in its own process with its strip set; exit 1 if any fails. --variants NAME,NAME: only those (ci.py runs each as a step of its own)"""
    import subprocess,os
    D=json.loads((HERE/'mainspring_bound.json').read_text(encoding='utf-8'));rc=0
    i=sys.argv.index('--variants');only=sys.argv[i+1].split(',') if i+1<len(sys.argv) and not sys.argv[i+1].startswith('--') else None
    if only and not set(only)<=set(D)-{'model'}:print('no such variant in',only,'; variants:',', '.join(k for k in sorted(D) if k!='model'));sys.exit(2)
    args=[a for j,a in enumerate(sys.argv[1:],1) if a!='--variants' and not (only and j==i+1)]
    for k,v in sorted(D.items()):
        if k=='model' or only and k not in only or (k.startswith('fz') and '--fz' not in sys.argv):continue   # fz*: drive.js's candidates (PLAN-drive-and-damping.md), with --fz only
        if v['bound']-v['T0']<IN:print(f'== {k}: coil-bound {v["bound"]-v["T0"]:.2f} turns past slack, short of the whole wind, {IN:.2f}: nothing to run');continue
        env=dict(os.environ,MC_MS_TAG=k,MC_MS_T=f"{v['t']}",MC_MS_GAP=f"{v.get('gap',0.01)}",MC_MS_L=f"{v['L']}",MC_MS_RA=f"{v['ra']}",MC_MS_E=f"{v['E']:g}",MC_MS_TILT=f"{v.get('tilt',0)}")
        print(f'== {k}: the strip {v["t"]} x {v["L"]:.0f} mm on r {v["ra"]}',flush=True)
        r=subprocess.run([sys.executable,__file__]+[a for a in args if a!='--fz'],env=env,cwd=HERE,capture_output=True,text=True,encoding='utf-8')
        print('\n'.join(r.stdout.strip().splitlines()[-4:]),flush=True);rc=rc or r.returncode
    sys.exit(rc)
if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    if '--variants' in sys.argv:variants()
    d=main()
    for r_ in d['rows']:
        h={mu:2*r_['dM'][str(mu)]/r_['M0'] if r_['M0']>0 else float('nan') for mu in MUS}
        print(f"T {r_['T']:6.3f}  M0 {r_['M0']*1000:7.1f} mN·m  friction {r_['dM']['0.1']*1000:6.2f} mN·m at 0.10 (coil {r_['parts']['cc']*1000:5.2f}, wall {r_['parts']['wall']*1000:5.2f}, core {r_['parts']['core']*1000:5.2f})  winding against running {100*h[0.1]:5.1f} % ({100*h[0.08]:.1f}-{100*h[0.16]:.1f})")
    S_=d['summary'];print(f"over the fusee's turns ({S_['Tdown']:.2f} to {S_['Tup']:.2f}): the friction takes {100*S_['loss']['0.1']:.1f} % of the spring's work running at 0.10 ({100*S_['loss']['0.08']:.1f}-{100*S_['loss']['0.16']:.1f}); winding against running {100*S_['hyst']['0.1']:.1f} % ({100*S_['hyst']['0.08']:.1f}-{100*S_['hyst']['0.16']:.1f})")
    if WEMPE:print(f"the Wempe's spring {S_['t']} x {S_['B']} x {S_['L']:.0f} mm: run down at {S_['Tdown']:.2f} turns, fully wound at {S_['Tup']:.2f}; running it gives {100*S_['down']['0.1']:.1f} % of its frictionless torque run down and {100*S_['top']['0.1']:.1f} % fully wound at 0.10")
    else:
     print(f"the fusee wheel's torque running: even to {100*S_['fusee']['even0']:.1f} % without friction, {100*S_['fusee']['even']['0.1']:.1f} % with it at 0.10 ({100*S_['fusee']['even']['0.08']:.1f}-{100*S_['fusee']['even']['0.16']:.1f}); fully wound it gives {100*S_['fusee']['top']['0.1']:.1f} % of its frictionless torque")
     print(f"the strip {S_['t']} mm (E {S_['E']:.0f} GPa): slack at {S_['T0']} turns, fully wound at {S_['Tup']:.2f}, coil-bound past "+(f"{S_['bound']:.2f}: {S_['room']:.2f} turn of room" if S_['bound'] else 'an unknown turn (mainspring.py --bound)'))
     U=S_['setup'];print(f"set up as the page sets it, {100*U['now'][1]:.0f} % of the wind (about {U['hours']} of its 56 hours) drives outside the bench's band; set up {U['best'][0]:+.2f} turns, {100*U['best'][1]:.0f} % (even to {100*U['best'][2]:.1f} %)")
    txt=json.dumps(d,indent=1)+'\n'
    if '--check' in sys.argv:
        ok=OUT.exists() and OUT.read_text(encoding='utf-8')==txt;print(f'  ok  {OUT.name} is up to date' if ok else f'  !!  {OUT.name} is not what this finds: python mainspring_friction.py');sys.exit(0 if ok else 1)
    OUT.write_text(txt,encoding='utf-8',newline='\n');print('wrote tools/'+OUT.name)
