"""The mainspring's shape in its barrel, solved: js/mainspring.js (MSHAPE), which mainspringGeo in core.js draws from. No browser; torch (CPU) and numpy.

    python mainspring.py               # solves the wind's states (about 20 min, 14 processes) into mainspring.json (here), then writes ../js/mainspring.js
    python mainspring.py --write       # ../js/mainspring.js from the mainspring.json already solved (a second)
    python mainspring.py --letdown     # the spring with the arbor out (as C Spinner's 15:54), against the video's count (about 2 min)
    python mainspring.py --plot OUT.png [T,...]   # the solved states drawn straight down the arbor, with the wall and the core

The strip (the parts list's 0.0165 in, 0.419 mm; 1,064 mm long, core.js MSPRING) is a curve r(theta) about the arbor, theta from its inner end. Its natural
curvature k0(s), at s mm from the inner end, is the free spring's (KLUwI2UUCMQ 32:18, the spring out of its barrel on the bench: about 7½ turns, all bent
one way, a spiral set and no reverse curve), its turns' radii read along the line through its centre (px, the coils' edge-on sides left and right) and
scaled so the turns add up to the strip's length. Read on an oblique frame, the radii are good to about 15 %.
Its shape at T turns from the inner end to the outer is the one of least bending energy,  integral (k - k0(s))^2 ds  (EI/2 left out), with:
  - its length L;
  - its coils at least p (t and 0.01 of grease) apart, r(theta + 2 pi) - r(theta) >= p, between the arbor's core (a0, the strip's middle on it) and the brace (R0);
  - its inner end held on the core by the arbor's hook (r = a0 for its first HOLD rad, the eye in it), its outer end lying along the brace (its last two samples at R0).
That is the strip's equilibrium with the coils pressing on each other without friction (each free stretch bent from its natural curve by the moment it carries,
k - k0 = M / EI). Solved by an augmented Lagrangian over L-BFGS, 48 samples a turn; states every STEP turns over the wind, each from an even spiral and then
from its neighbours' solutions, the least energy kept. T0, the turns at which the held spring pulls nothing (the state of least energy, to about 0.1 turn:
the energy is nearly flat just above it and climbs steeply below), is where the set-up counts from.
The page blends the two states either side of its T, each piece of steel (the same s) moving between its places in them, so the shape changes smoothly as
the barrel turns. Checked (5 October 2026): a blend a quarter turn from both its states has the energy of the state solved there to 0.4 % (the energy is nearly
flat, so shapes of about equal energy may lie up to 4 mm apart in places), its coils at least the strip's thickness apart; theta rebuilt from r is good to 0.04 mm
along the coil. Let down with the arbor out (--letdown) it gives the 15:54 frame's 12½ turns, 9½ of them packed on the wall and 2½ loose (r 12, 10, 5), where the
frame shows 12 +- 1 packed and one loose turn of about r 8: the grease's friction, which the solver leaves out, can hold a turn or so more in the pack.
"""
import json,math,sys,base64,pathlib
import numpy as np,torch
torch.set_default_dtype(torch.float64)
HERE=pathlib.Path(__file__).resolve().parent;MC=HERE.parent
t=0.419;gap=0.01;p=t+gap;ra=1.8;Rw=17.6-0.46;L=1064.0;a0=ra+t/2;R0=Rw-t/2   # core.js MSPRING: the barrel r 17.6 less its wall and the brace; the core r 1.8
HOLD=1.0   # rad: the inner end on the core (the eye, 0.6-1.66 mm from the end on r 1.8: MS.ey in movement.js)
M=48;STEP=0.25;TLO=12.5;THI=18.25   # the states (a blend over half a turn misses by 3 mm and lets the coils touch: a quarter)
# the free spring (KLUwI2UUCMQ 32:18): its turns' radii, px along the horizontal through its centre, innermost first
FREE_PX=[97,185,250,328,405,502,632,750]
rk=np.array(FREE_PX,float);rk*=L/(2*math.pi*rk.sum())
sk=np.array([2*math.pi*(rk[:i].sum()+rk[i]/2) for i in range(len(rk))])
S0=np.concatenate([[0],sk,[L]]);RH0=np.concatenate([[rk[0]*0.8],rk,[rk[-1]+(rk[-1]-rk[-2])*(L-sk[-1])/(sk[-1]-sk[-2])]])   # the end of its inner turn curls a little tighter (the frame)
def k0(s):
    s=torch.clamp(s,0,L);S=torch.tensor(S0);RH=torch.tensor(RH0);i=torch.clamp(torch.searchsorted(S,s)-1,0,len(S0)-2);f=(s-S[i])/(S[i+1]-S[i]);return 1/(RH[i]+f*(RH[i+1]-RH[i]))
def geom(r,T):
    N=r.shape[0]-1;th=torch.arange(N+1)*(2*math.pi*T/N);x=r*torch.cos(th);y=r*torch.sin(th);ex=x[1:]-x[:-1];ey=y[1:]-y[:-1];l=torch.sqrt(ex*ex+ey*ey)
    phi=torch.atan2(ex[:-1]*ey[1:]-ey[:-1]*ex[1:],ex[:-1]*ex[1:]+ey[:-1]*ey[1:]);w=(l[:-1]+l[1:])/2;return l,phi/w,w,torch.cat([torch.zeros(1),torch.cumsum(l,0)])
def nest(r,T):   # r(theta + 2 pi) - r(theta), 1e3 where theta + 2 pi is past the outer end
    N=r.shape[0]-1;jj=torch.arange(N+1,dtype=torch.float64)+N/T;ok=jj<=N;jc=torch.clamp(jj,max=float(N));i0=torch.clamp(jc.floor().long(),0,N-1);f=jc-i0
    return torch.where(ok,r[i0]*(1-f)+r[i0+1]*f-r,torch.full_like(r,1e3))
def energy(r,T):
    l,k,w,s=geom(r,T);return ((k-k0(s[1:-1]))**2*w).sum(),l,k,s
def solve(T,init=None,free_inner=False,rounds=6):
    """the least-energy shape at T turns (free_inner: the arbor out, T free); returns r at N+1 = 48 T + 1 even angles, T, its energy"""
    N=int(round(T*M));lo=0.6 if free_inner else a0
    r0=np.interp(np.linspace(0,1,N+1),np.linspace(0,1,len(init)),init) if init is not None else np.linspace(a0,R0,N+1)
    u=torch.logit(torch.tensor((r0-lo)/(R0-lo)).clamp(1e-6,1-1e-6)).requires_grad_(True);Tv=torch.tensor(float(T),requires_grad=free_inner)
    nh=int(HOLD/(2*math.pi*T/N))+1
    def R(u):
        r=(lo+(R0-lo)*torch.sigmoid(u)).clone()
        if not free_inner:r[:nh]=a0
        r[-2:]=R0;return r
    lamL=torch.tensor(0.);lamN=torch.zeros(N+1);muL=10.;muN=1e3;ps=[u]+([Tv] if free_inner else [])
    for _ in range(rounds):
        opt=torch.optim.LBFGS(ps,lr=1,max_iter=3000,tolerance_grad=1e-10,tolerance_change=1e-14,history_size=50,line_search_fn='strong_wolfe')
        def clos():
            opt.zero_grad();r=R(u);E,l,_,_=energy(r,Tv);cL=l.sum()-L;g=p-nest(r,Tv)
            f=E+lamL*cL+muL/2*cL**2+(torch.clamp(lamN+muN*g,min=0)**2-lamN**2).sum()/(2*muN);f.backward();return f
        opt.step(clos)
        with torch.no_grad():r=R(u);E,l,_,_=energy(r,Tv);lamL=lamL+muL*(l.sum()-L);lamN=torch.clamp(lamN+muN*(p-nest(r,Tv)),min=0);muL*=4;muN*=4
    with torch.no_grad():r=R(u);E,l,_,_=energy(r,Tv);viol=float((p-nest(r,Tv)).max());dL=float(l.sum()-L)
    return r.numpy(),float(Tv.detach()),float(E),viol,dL
def packs(r,T):
    """coils lying on each other at the wall and on the core (from the outer end and the inner, turns whose spacing is p), and the loose turns' radii"""
    N=len(r)-1;off=N/T;g=nest(torch.tensor(r),T).numpy();c=g<p+0.01;turns=lambda m:m/off
    def run(seq):   # the first unbroken run of contact within a turn of the end, in turns (each sample is a coil and the one over it)
        seq=list(seq);k=0
        while k<len(seq) and k<off and not c[seq[k]]:k+=1
        n=0
        while k<len(seq) and c[seq[k]]:k+=1;n+=1
        return turns(n)+(1 if n else 0)
    return run(range(int(N-off),-1,-1)),run(range(0,int(N-off)+1))
def job(a):
    torch.set_num_threads(1);T,init=a;r,_,E,viol,dL=solve(T,init=None if init is None else np.array(init));return dict(T=T,E=E,r=r.tolist(),viol=viol,dL=dL)
def sweep():
    """each state solved from an even spiral, then again from each neighbour's solution, the least energy kept (one process a solve). Below its slack the
    spring's energy climbs steeply (the coils on the wall can't open, so the inner ones unbend), so a state is never carried up from one below it alone"""
    from multiprocessing import Pool
    Ts=[round(TLO+STEP*i,4) for i in range(int(round((THI-TLO)/STEP))+1)]
    with Pool(14) as P:
        best={x['T']:x for x in P.map(job,[(T,None) for T in Ts])}
        for _ in range(2):
            js=[(T,best[Ts[i+d]]['r']) for i,T in enumerate(Ts) for d in (-1,1) if 0<=i+d<len(Ts)]
            for x in P.map(job,js):
                if x['E']<best[x['T']]['E']-1e-6:best[x['T']]=x
    for T in Ts:x=best[T];print(f"T {T:6.2f}  E {x['E']:.5f}  overlap {max(x['viol'],0):.4f} mm  length {x['dL']:+.5f} mm")
    T0=min(Ts,key=lambda T:best[T]['E']);print('T0',T0,'turns: the held spring is slack there')
    out=dict(T0=T0,M=M,step=STEP,states=[best[T] for T in Ts]);json.dump(out,open('mainspring.json','w'));return out
def write(d):
    """the table: a common grid in s (each piece of steel), dense enough that a sample is at most 7.5 deg round the arbor in every state; each state's r there"""
    st=d['states'];R=[];S=[];TH=[]
    for x in st:
        r=np.array(x['r']);N=len(r)-1;th=np.arange(N+1)*2*math.pi*x['T']/N;P=np.stack([r*np.cos(th),r*np.sin(th)],1);s=np.concatenate([[0],np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]);s*=L/s[-1]
        R.append(r);S.append(s);TH.append(th)
    rmin=lambda q:min(np.interp(q,S[k],R[k]) for k in range(len(st)))
    g=[0.0]
    while g[-1]<L:g.append(min(L,g[-1]+rmin(g[-1])*2*math.pi/M))
    g=np.array(g);rs=np.array([np.interp(g,S[k],R[k]) for k in range(len(st))])
    # theta rebuilt from r alone as the page rebuilds it: its worst miss at the outer end before the page spreads it
    err=max(abs(rebuild(g,rs[k])[-1]-2*math.pi*st[k]['T']) for k in range(len(st)))
    enc=lambda a,u:base64.b64encode(np.round(np.asarray(a)/u).astype('<u2').tobytes()).decode()
    T=[x['T'] for x in st];E=[x['E'] for x in st];tq=np.gradient(E,T)
    js=('/* mainspring.js: the mainspring\'s shape in its barrel over the wind, solved by tools/mainspring.py (its docstring: the strip\'s least bending energy from the\n'
        '   free spring\'s natural curve, measured on C Spinner\'s video 32:18, its coils pressing on each other, the inner end on the arbor\'s hook, the outer along the brace).\n'
        '   Generated: run python tools/mainspring.py, not edited. T: turns from the inner end to the outer, a state every step; s: the grid along the strip (mm, in\n'
        '   0.05s); r: each state\'s radius at those s (mm, in 0.0005s), little-endian uint16, base64; T0: the turns at which the held spring pulls nothing;\n'
        '   pull: its torque at each state against the most (the energy\'s slope) */\n'
        'const MSHAPE='+json.dumps(dict(T0=round(d['T0'],4),T=T,pull=[round(float(x/tq.max()),4) for x in tq],n=len(g),s=enc(g,0.05),r=enc(rs.ravel(),0.0005)),separators=(',',':'))+';\n')
    (MC/'js'/'mainspring.js').write_text(js,encoding='utf-8',newline='\n');print(f'js/mainspring.js: {len(st)} states, {len(g)} points along the strip, {len(js)//1024} KB; theta rebuilt from r misses the end by {err:.4f} rad at most')
def rebuild(s,r):
    ds=np.diff(s);dr=np.diff(r);return np.concatenate([[0],np.cumsum(np.sqrt(np.maximum(ds*ds-dr*dr,1e-12))/((r[1:]+r[:-1])/2))])
def plot(d,out,Ts=None):
    from PIL import Image,ImageDraw
    st=[x for x in d['states'] if Ts is None or any(abs(x['T']-T)<1e-6 for T in Ts)];ims=[]
    for x in st:
        r=np.array(x['r']);N=len(r)-1;th=np.arange(N+1)*2*math.pi*x['T']/N;W=440;im=Image.new('RGB',(W,W+24),'white');g=ImageDraw.Draw(im);c=W/2;k=W/2/18*0.98
        for rr,col in ((Rw,(180,150,60)),(ra,(120,120,120))):g.ellipse([c-rr*k,c-rr*k,c+rr*k,c+rr*k],outline=col,width=2)
        g.line([(c+k*r[i]*math.cos(th[i]),c-k*r[i]*math.sin(th[i])) for i in range(N+1)],fill=(30,50,140),width=2)
        w,a=packs(r,x['T']);g.text((6,W+4),f"T {x['T']:.2f} ({x['T']-d['T0']:+.2f} from slack): {w:.1f} turns packed on the wall, {a:.1f} on the core",fill=(0,0,0));ims.append(im)
    s=Image.new('RGB',(sum(i.width for i in ims),ims[0].height),'white');xo=0
    for i in ims:s.paste(i,(xo,0));xo+=i.width
    s.save(out);print('wrote',out)
if __name__=='__main__':
    a=sys.argv[1:]
    if '--letdown' in a:
        r,T,E,viol,dL=solve(12.3,free_inner=True);w,_=packs(r,T);N=len(r)-1;th=np.arange(N+1)*2*math.pi*T/N
        mr=[round(float(np.mean(r[(th>=2*math.pi*j)&(th<2*math.pi*(j+1))])),1) for j in range(3)]
        print(f'let down, the arbor out: {T:.2f} turns, {w:.1f} packed on the wall; the inner turns\' mean radii {mr} mm'
              ' (KLUwI2UUCMQ 15:54: 12 +- 1 coils on the wall, one loose inner turn of about r 8)')
        json.dump(dict(T0=T,states=[dict(T=T,E=E,r=r.tolist())]),open('mainspring_letdown.json','w'))
    elif '--plot' in a:
        i=a.index('--plot');d=json.load(open('mainspring.json'));plot(d,a[i+1],[float(x) for x in a[i+2].split(',')] if len(a)>i+2 else None)
    elif '--write' in a:write(json.load(open('mainspring.json')))
    else:write(sweep())
