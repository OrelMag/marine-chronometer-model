"""The Wempe 1950s build's mainspring: every strip solved for it compared (PLAN-motion-3d.md, "The build's mainspring"; 19 October 2026). numpy (wempe_mainspring.py's
tables); no browser, no Node.

    python wempe_build_spring.py [--json OUT]    # a few seconds

Takes every table wempe_mainspring.py --solve L --set S --t T has written (tools/mainspring_wempe_t<T>_L<L>_s<S>.js) and for each, in Nivaflex 45/5 (220 GPa: the shape
doesn't depend on the modulus, so the torque is the solved one's times 220/207), set up 3/4 turn past its slack as the drawn spring is:
  the barrel's torque run down and fully wound;
  the fusee arbor's mean torque over the working turns (the drawn fusee, wempe_mainspring.py's profile) against the drawn spring's (mainspring_wempe.js): the build
    wants 1.256 of it (WESC.BUILD.k 1.26 times 05 06_20's measured drive, which is 0.997 of the drawn spring's solved torque: wempe_physics.js's Kl; 1.122 with the
    drawn spring's free curve set ×0.6, its Kl 0.890, until 26 October 2026);
  its spread over the working turns (the evenness the fusee was cut for: the drawn spring's own is the measure);
  the bending stress on its inner coils fully wound, E t/2 |kappa - kappa0| along the strip (kappa0 its free curve: the Hamilton's measured, FREE_PX, scaled to the
    length and set, as mainspring.py takes it; the eye's first 12 points left out), and its median along the strip, against Nivaflex's 3,000 MPa;
  the room past full wind to the last solved state (coil-bound or the solve's end).
Prints a line each; --json writes them. Reports, never fails."""
import json,math,re,sys,base64,pathlib
import numpy as np
sys.argv,ARGV=['wempe_mainspring.py'],sys.argv;import wempe_mainspring as W;sys.argv=ARGV
HERE=W.HERE;E_N=220e3;K=220/207;LIM=3000;WANT=1.256
xs=np.linspace(0.29,8.75,200);d0=W.table(HERE/'mainspring_wempe.js');f0=np.mean([W.profile(d0,0.75)(x) for x in xs])
FREE_PX=np.array([97,185,250,328,405,502,632,750],float)   # mainspring.py's free curve (the Hamilton's measured spring, KLUwI2UUCMQ 32:18): each turn's radius in px
def free(L,SET):
    rk=FREE_PX*L/(2*math.pi*FREE_PX.sum());sk=np.array([2*math.pi*(rk[:i].sum()+rk[i]/2) for i in range(len(rk))])
    S0=np.r_[0,sk,L];R0=np.r_[rk[0]*0.8,rk,rk[-1]+(rk[-1]-rk[-2])*(L-sk[-1])/(sk[-1]-sk[-2])];return lambda x:SET/np.interp(np.clip(x,0,L),S0,R0)
def one(fn,t,L,SET):
    tb=W.table(fn);Td=tb['slack']+0.75;Tu=Td+float(W.IB[-1]);M=lambda T:float(np.interp(T,tb['T'],tb['P'])*tb['M1'])*K
    fq=np.array([W.profile(tb,0.75)(x) for x in xs])*K;k0=free(L,SET)
    d=json.loads(re.search(r'const MSHAPE=(\{.*?\});',fn.read_text(encoding='utf-8'),re.S).group(1));u16=lambda s:np.frombuffer(base64.b64decode(s),'<u2').astype(float)
    n=d['n'];s=u16(d['s'])*0.05;RR=u16(d['r']).reshape(-1,n)*0.0005;pk=[]
    for j,T in enumerate(d['T']):
        r=RR[j];th=np.zeros(n)
        for i in range(1,n):ds=s[i]-s[i-1];dr=r[i]-r[i-1];th[i]=th[i-1]+math.sqrt(max(ds*ds-dr*dr,1e-12))/((r[i]+r[i-1])/2)
        th*=2*math.pi*T/th[-1];x,y=r*np.cos(th),r*np.sin(th);dx,dy=np.gradient(x,s),np.gradient(y,s);ddx,ddy=np.gradient(dx,s),np.gradient(dy,s)
        kap=(dx*ddy-dy*ddx)/np.maximum((dx*dx+dy*dy)**1.5,1e-12);sg=np.convolve(E_N*t/2*np.abs(np.abs(kap)-k0(s)),np.ones(5)/5,'same');pk.append((T,sg[12:].max(),np.median(sg)))
    Ts=[p[0] for p in pk]
    return dict(file=fn.name,t=t,L=L,set=SET,Mdown=M(Td),Mup=M(Tu),drive=float(fq.mean()/f0),spread=float((fq.max()-fq.min())/fq.mean()),
                peak=float(np.interp(Tu,Ts,[p[1] for p in pk])),median=float(np.interp(Tu,Ts,[p[2] for p in pk])),room=float(tb['T'][-1]-Tu),solvedTo=float(tb['T'][-1]))
def drive(fn,out):
    """--drive TABLE OUT: the strip's own drive for the build's checks (MC_WSTRIP=OUT, tools/wempe_load.js): at each fusee turn from run down x, its fusee arbor torque
    (Nivaflex) over the drawn spring's solved one at the measured level (wempe_physics.js's Kl, the level BUILD.k's 1.26 was set at: the strip's torque fully wound is
    k Kl times the drawn's solved), the factor on 05 06_20's measured drive the escapement then takes in place of BUILD.k's flat 1.26"""
    m=re.match(r'mainspring_wempe_t([\d.]+)_L([\d.]+)_s([\d.]+)\.js$',pathlib.Path(fn).name);tb=W.table(HERE/pathlib.Path(fn).name)
    import subprocess;eta=float(subprocess.run(['node','-e',"const o=process.stdout.write.bind(process.stdout);process.stdout.write=()=>true;o(' '+require('./wempe_physics.js').LV.Kl+' ')"],cwd=HERE,capture_output=True,text=True).stdout.strip().split()[-1])
    x=np.linspace(0,8.75,71);q=np.array([W.profile(tb,0.75)(v) for v in x])*K;q0=np.array([W.profile(d0,0.75)(v) for v in x])*eta;kb=q/q0
    pathlib.Path(out).parent.mkdir(parents=True,exist_ok=True)
    pathlib.Path(out).write_text(json.dumps(dict(table=pathlib.Path(fn).name,t=float(m[1]),set=float(m[3]),eta=eta,kbn=[[round(float(a),4),round(float(b),5)] for a,b in zip(x,kb)])),encoding='utf-8')
    print(f'{out}: {pathlib.Path(fn).name}, the drive x{kb.min():.3f}-{kb.max():.3f} of the measured (mean {kb.mean():.3f}; the build\'s flat {1.26}), the drawn spring\'s level {eta:.3f}')
def main():
    if '--drive' in ARGV:i=ARGV.index('--drive');return drive(ARGV[i+1],ARGV[i+2])
    R=[]
    for fn in sorted(HERE.glob('mainspring_wempe_t*_L*_s*.js')):
        m=re.match(r'mainspring_wempe_t([\d.]+)_L([\d.]+)_s([\d.]+)\.js$',fn.name)
        if m:R.append(one(fn,float(m[1]),float(m[2]),float(m[3])))
    e0=[np.std([W.profile(d0,0.75)(x) for x in xs])]
    print(f'the build\'s strips in Nivaflex 45/5 (220 GPa), set up 3/4 turn: the drive at the fusee arbor against the drawn spring\'s (the build wants {WANT}), inner coils against {LIM} MPa')
    for r in R:print(f"  {r['t']} mm x {r['L']:.0f}, set x{r['set']:g}: {1000*r['Mdown']:.0f}-{1000*r['Mup']:.0f} mN·m in the barrel; the drive x{r['drive']:.3f}, spread {100*r['spread']:.1f} %; inner coils fully wound {r['peak']:.0f} MPa ({'over' if r['peak']>LIM else 'within'} {LIM}), {r['median']:.0f} along it; room past full wind {r['room']:.2f} turn (solved to {r['solvedTo']})")
    J=ARGV.index('--json') if '--json' in ARGV else 0
    if J:pathlib.Path(ARGV[J+1]).write_text(json.dumps(dict(want=WANT,limit=LIM,strips=R),indent=1),encoding='utf-8')
if __name__=='__main__':main()
