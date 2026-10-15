"""The Wempe's mainspring (05 07 00-6), solved and checked against its own drawing. No browser; torch, numpy (mainspring.py's). The Wempe model: ../../wempe/.

    python wempe_mainspring.py --solve L [--set S]   # mainspring.py's solve of the Wempe's strip, L mm long (its free curve's turns S times the Hamilton's measured):
                                                     # tools/mainspring_wempe_L<L>[_s<S>].js; about 25 min on 14 processes, run it alone
    python wempe_mainspring.py --final L             # the same into tools/mainspring_wempe.js, the spring the model takes (the fit's length, below)
    python wempe_mainspring.py --friction L [--check]   # mainspring_friction.py on mainspring_wempe.js (L its length): tools/mainspring_friction_wempe.json (about 4 min)
    python wempe_mainspring.py [--check]             # the fit (a second): each solved table against 05 06_20; writes tools/wempe_mainspring.json (--check: exit 1 if stale)

The strip and its barrel, from the sheets: 15 x 0.37 ("Zugfeder 15 x 0,37", 05 06_20; the 7 a little overwritten), in the drum's 38.5 inside (05 06_20, 05 07 01-1: r 19.25,
its outer coil on the wall, the hook block 05 07 01-3 holding its end: no brace), on the arbor's core 13.3 (05 07 02, r 6.65), its inner end on the hook 05 07 02-2 (a pin 0.5
proud). Not on any sheet: its length (fitted here), its free curve (the Hamilton's measured spring, KLUwI2UUCMQ 32:18, scaled to the length: a spring set the usual way;
--set scales its turns), the eye's place on the strip (the Hamilton's 9.4 mm), the modulus (carbon spring steel 207 GPa, 200-210), the film between packed coils (none).

The test (05 06_20, Herb. Mueller 24.7.41): the force on a 262 mm lever on the fusee arbor running down, at 24 places over the fusee's 8.75 working turns, the fusee curve's
radii beside it, the barrel's 5 turns marked against the fusee's and "3/4 Umgang gespannt", the set-up. The solved spring's torque M(T) at the barrel's turns, through the
drawn fusee (the chain's pitch line 1.02 out from the groove's floor, 05 07 04 and fusee.js; the drum's Ø 41.6, 05 07 01-1, the same 1.02 out), set up 3/4 turn past
its slack, gives the fusee arbor's torque at each of the sheet's places; its shape against the measured (each scaled to its mean, the first 0.29 turn left out: there the
chain rises from the flange's slot onto the groove) is the residual, and the length that makes it least is the fit. The level (the measured over the solved frictionless,
the losses on the way: coil friction, the chain, the barrel's and fusee's pivots) is the second check: wempe_physics.js.
"""
import json,math,sys,os,re,base64,subprocess,tempfile,pathlib
import numpy as np
HERE=pathlib.Path(__file__).resolve().parent
T_,RA,RW,B,E,EYE=0.37,6.65,19.25,15.0,207.0,9.4   # the strip, the core, the wall, its width, the modulus (GPa, estimated), the eye (estimated): above
OUT=HERE/'wempe_mainspring.json'
WD=os.path.join(tempfile.gettempdir(),'mc-mainspring')   # the solved states (mainspring.py's json, not committed)
def env(L,S,tag):
    # the states: from half a turn under the strip lying all on the wall to past coil-bound on the core (each estimated as packed turns at the strip's pitch,
    # with the joining turn), a quarter turn apart
    a,R=RA+T_/2,RW-T_/2;ln=lambda ni,no:math.pi*ni*(2*a+T_*ni)+math.pi*no*(2*R-T_*no)+math.pi*(a+T_*ni+R-T_*no)
    def solve(f):
        lo,hi=2.,40.
        for _ in range(60):
            m=(lo+hi)/2
            if f(m)>L:hi=m
            else:lo=m
        return lo
    tw=solve(lambda m:ln(0,m-1));tc=solve(lambda m:ln(m-1,0))
    return dict(os.environ,MC_MS_TAG=tag,MC_MS_T=f'{T_}',MC_MS_L=f'{L}',MC_MS_RA=f'{RA}',MC_MS_RW=f'{RW}',MC_MS_B=f'{B}',MC_MS_E=f'{E}',MC_MS_GAP='0',MC_MS_EYE=f'{EYE}',
                MC_MS_SET=f'{S}',MC_MS_TLO=f'{math.floor((tw-0.5-2*max(0,1-S))*4)/4}',MC_MS_THI=f'{math.ceil((tc+0.6)*4)/4}')
def tag(L,S):return f'wempe_L{L:g}'+('' if S==1 else f'_s{S:g}')
def run(L,S,name,args=()):
    os.makedirs(WD,exist_ok=True);e=env(L,S,name);print(f'{name}: the strip {T_} x {B} x {L} mm, the core r {RA}, the wall r {RW}, set x{S}; states {e["MC_MS_TLO"]} to {e["MC_MS_THI"]}',flush=True)
    sys.exit(subprocess.run([sys.executable,str(HERE/'mainspring.py'),*args],env=e,cwd=WD).returncode)
WE=HERE.parent.parent/'wempe'/'js'
def sheet():
    """05 06_20's force (g on the 262 mm lever, by the fusee's turns from the large end) as escphys.js reads it, and the fusee's groove radii at quarter turns (fusee.js RFT)"""
    kv=re.search(r'const KV=(\[\[.*?\]\]),MF=',(WE/'escphys.js').read_text(encoding='utf-8'),re.S).group(1);rft=re.search(r'const RFT=(\[[\d.,\s]*\]);',(WE/'fusee.js').read_text(encoding='utf-8')).group(1)
    return np.array(json.loads(kv)),np.array(json.loads(rft))
KV,RFT=sheet();OF,RB=1.02,41.6/2+1.02   # the chain's pitch line 1.02 out from the groove's floor and the drum's wall (05 07 04: fusee.js CONN); the drum Ø 41.6 (05 07 01-1)
LEV,G0=262,9.80665e-6   # g on 262 mm in N·m
rf=lambda x:np.interp(np.clip(x,0,9)*4,np.arange(len(RFT)),RFT)
xs=np.linspace(0,8.75,3501);IB=np.concatenate([[0],np.cumsum((rf(xs[1:])+rf(xs[:-1]))/2+OF)*np.diff(xs)/RB])   # the barrel's turns from run down at fusee turn x
ib=lambda x:np.interp(x,xs,IB)
def table(f):
    d=json.loads(re.search(r'const MSHAPE=(\{.*?\});',f.read_text(encoding='utf-8')).group(1));T=np.array(d['T']);P=np.array(d['pull'])
    k=np.where((P[:-1]<=0)&(P[1:]>0))[0];sl=float(T[k[-1]]-P[k[-1]]*(T[k[-1]+1]-T[k[-1]])/(P[k[-1]+1]-P[k[-1]])) if len(k) else float(d['T0'])   # slack: where the pull crosses nothing
    return dict(T=T,P=P,T0=float(d['T0']),slack=sl,M1=d['M1'])
def profile(tb,su=0.75,fr=None):
    """the fusee arbor's torque (N·m, frictionless or less the coils' running loss fr(T)) at fusee turn x: the spring's at the barrel's turns, times the chain's lever on
    the fusee over its lever on the drum"""
    def tq(x):
        T=tb['slack']+su+ib(x);M=np.interp(T,tb['T'],tb['P'])*tb['M1']
        return M*(1-(fr(T) if fr else 0))*(rf(x)+OF)/RB
    return tq
USE=KV[:,0]>=0.29   # the first 0.29 turn left out: the chain rises from the flange's slot onto the groove (05 06_4; fusee.js ac), its lever not the groove's
def score(tb,su=0.75,fr=None):
    q=profile(tb,su,fr);x,g=KV[USE,0],KV[USE,1];m=q(x);r=np.log(g)-np.log(m);c=r.mean();e=np.exp(r-c)-1
    return dict(rms=float(np.sqrt((e**2).mean())),max=float(np.abs(e).max()),eta=float(np.mean(g)*LEV*G0/np.mean(m)),
                fit=[[float(a),float(b),round(float(mm*np.exp(c)),2)] for a,b,mm in zip(x,g,m)])
def frc():
    f=HERE/'mainspring_friction_wempe.json'
    if not f.exists():return None
    R=json.loads(f.read_text(encoding='utf-8'))['rows'];Ts=[r['T'] for r in R];v=[r['dM']['0.1']/r['M0'] if r['M0']>0 else 0 for r in R]
    return lambda T:np.interp(T,Ts,v)
def fit(check=False):
    out=dict(note='tools/wempe_mainspring.py: the Wempe\'s mainspring solved (mainspring.py) at each length tried, its fusee arbor\'s torque against 05 06_20\'s measured force (each scaled to its mean, from turn 0.29): the shape\'s rms and worst, the measured over the solved (eta: the losses on the way), the fitted length; fit: [fusee turn, g measured, g solved and scaled]; tq: [fusee turn, the fusee arbor torque from the solved spring frictionless and less the coil friction at 0.10 (N·m)]',
             strip=dict(t=T_,b=B,ra=RA,Rw=RW,E=E,eye=EYE),setup=0.75,barrelTurns=round(float(IB[-1]),4),marks=[[x,n,round(float(IB[-1]-ib(x)),3)] for x,n in ((0,5),(1.35,4),(2.87,3),(4.62,2),(6.59,1),(8.74,0))],tries=[])
    for f in sorted(HERE.glob('mainspring_wempe_L*.js')):
        m=re.match(r'mainspring_wempe_L([\d.]+)(?:_s([\d.]+))?\.js',f.name);tb=table(f);s=score(tb)
        out['tries'].append(dict(file=f.name,L=float(m.group(1)),set=float(m.group(2) or 1),slack=round(tb['slack'],4),T0=tb['T0'],rms=round(s['rms'],5),max=round(s['max'],5),eta=round(s['eta'],4),
                                 su=[round(score(tb,u)['rms'],5) for u in (0.65,0.85)],top=round(float(tb['T'][-1]),2),full=round(tb['slack']+0.75+float(IB[-1]),3)))
    tr=[t for t in out['tries'] if t['set']==1]
    if len(tr)>=3:   # the length where the shape's rms is least: a parabola through the three lengths about the best tried
        tr.sort(key=lambda t:t['L']);k=min(range(len(tr)),key=lambda i:tr[i]['rms']);k=min(max(k,1),len(tr)-2);L3=[tr[k+j]['L'] for j in (-1,0,1)];r3=[tr[k+j]['rms'] for j in (-1,0,1)]
        c=np.polyfit(L3,r3,2)
        if c[0]>0:out['Lfit']=round(float(-c[1]/(2*c[0])),1);out['rmsFit']=round(float(np.polyval(c,out['Lfit'])),5)
    fm=HERE/'mainspring_wempe.js'
    if fm.exists():
        tb=table(fm);s=score(tb);F=frc();sf=score(tb,0.75,F) if F else None;Td,Tu=tb['slack']+0.75,tb['slack']+0.75+float(IB[-1]);Mt=lambda T:float(np.interp(T,tb['T'],tb['P'])*tb['M1'])
        out['final']=dict(slack=round(tb['slack'],4),T0=tb['T0'],M1=tb['M1'],top=round(float(tb['T'][-1]),2),Tdown=round(Td,4),Tup=round(Tu,4),Mdown=round(Mt(Td),5),Mfull=round(Mt(Tu),5),
            rms=round(s['rms'],5),max=round(s['max'],5),eta=round(s['eta'],4),su=[round(score(tb,u)['rms'],5) for u in (0.65,0.85)],fit=s['fit'],
            tq=[[float(x),round(float(profile(tb)(x)),5),round(float(profile(tb,0.75,F)(x)),5) if F else None] for x in np.arange(0,8.751,0.25)],
            friction=sf and dict(rms=round(sf['rms'],5),max=round(sf['max'],5),eta=round(sf['eta'],4),fit=sf['fit']))
    txt=json.dumps(out,indent=1)+'\n'
    print(f"  the drawn fusee and drum take {IB[-1]:.3f} barrel turns over the fusee's 8.75 (05 06_20 marks 5): its marks at fusee turns 0, 1.35, 2.87, 4.62, 6.59, 8.74 are {', '.join(str(m[2]) for m in out['marks'])} barrel turns from full wind here (the sheet's 5, 4, 3, 2, 1, 0)")
    for t in out['tries']:print(f"  {t['file']}: slack {t['slack']:.2f} turns (the table's least {t['T0']}), fully wound at {t['full']:.2f} (the table ends {t['top']}); against 05 06_20 the shape {100*t['rms']:.2f} % rms, {100*t['max']:.2f} % at worst; set up 0.65 / 0.85 turn: {100*t['su'][0]:.2f} / {100*t['su'][1]:.2f} %; measured over solved {t['eta']:.3f}")
    if out.get('Lfit'):print(f"  the least rms by a parabola: L {out['Lfit']} mm, {100*out['rmsFit']:.2f} %")
    if 'final' in out:
        q=out['final'];print(f"  mainspring_wempe.js: slack {q['slack']:.2f}, run down {q['Tdown']:.2f}, fully wound {q['Tup']:.2f} (the table ends {q['top']}); the spring {1000*q['Mdown']:.0f} to {1000*q['Mfull']:.0f} mN·m; the shape {100*q['rms']:.2f} % rms ({100*q['max']:.2f} % worst), measured over solved {q['eta']:.3f}"+(f"; with the coils' friction {100*q['friction']['rms']:.2f} % ({q['friction']['eta']:.3f})" if q['friction'] else ''))
    if check:
        ok=OUT.exists() and OUT.read_text(encoding='utf-8')==txt;print(f'  ok  {OUT.name} is up to date' if ok else f'  !!  {OUT.name} is not what this finds: python wempe_mainspring.py');sys.exit(0 if ok else 1)
    OUT.write_text(txt,encoding='utf-8',newline='\n');print('wrote tools/'+OUT.name)
if __name__=='__main__':
    a=sys.argv[1:];S=float(a[a.index('--set')+1]) if '--set' in a else 1.0
    if '--solve' in a:L=float(a[a.index('--solve')+1]);run(L,S,tag(L,S))
    if '--final' in a:L=float(a[a.index('--final')+1]);run(L,S,'wempe')
    if '--friction' in a:L=float(a[a.index('--friction')+1]);sys.exit(subprocess.run([sys.executable,str(HERE/'mainspring_friction.py'),*(['--check'] if '--check' in a else [])],env=env(L,S,'wempe'),cwd=HERE).returncode)
    sys.stdout.reconfigure(encoding='utf-8');fit('--check' in a)
