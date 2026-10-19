"""The slender moving parts' stress along their length, and every body's kinematics, for the 3D viewer (PLAN-motion-3d.md, phases 2 and 4). numpy; Node for the model's
numbers; no browser.

    python motion3d_springs.py --model wempe [--version last|build]   # a few seconds

Writes r_motion3d/<model>/springs_<version>.json:
  mainspring    each solved state (the barrel's turns T): the strip's centre line in the barrel's plane at 400 places along it, and its bending stress there,
                sigma = E t / 2 |kappa - kappa0|, kappa its curvature wound, kappa0 its free curvature (mainspring.py's free curve: the Hamilton's measured, scaled
                to the length and set). As drawn: mainspring_wempe.js at 0.37 and 207 GPa, at the level 05 06_20 measures (wempe_physics.js's Kl: the solved shape's
                torque, and so its stress, times Kl); the 1950s build: its Nivaflex strip's own table (WESC.BUILD.strip) at 220 GPa.
  hairspring    a couple along the whole strip (its terminal curves meet Phillips' conditions: wempe_hairspring.js), so its stress 6 k theta / (b h^2) is even along
                it and goes with the balance's angle: MPa per radian.
  maintaining   the ring's peak (wempe_sustaining.js: 825 MPa as drawn at the strongest drive, its elastica) spread round the band as a split ring closed by forces at
                its ends, M (phi) ~ (1 - cos phi) / 2 from the eye (its peak, as the elastica's, half way round).
  detent        the spring (0.07 x 1.9, 5 long) bent evenly by the lift, sigma = E t theta / (2 L); the gold spring a cantilever from its bending point bent at its tip
                as the discharge stone passes on the return (makeEsc's PS), its moment rising to the root: as drawn 0.15 thick, the build's thinned to 0.06 over 3 mm.
  chain         the link plates' and rivets' stress per newton of pull (wempe_strength.js's sections).
  kinematics    every body of the transmission run: its turn per escape-wheel tooth (motion3d.py's measure), and in each run its largest speed and acceleration (the
                run's angles, rigid and deviation, differentiated)."""
import json,math,pathlib,sys,subprocess,base64,re
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME;VER=arg('--version','last');D=HERE/'r_motion3d'/M
node=lambda code,env=None:json.loads(subprocess.run(['node','-e',code],cwd=HERE,capture_output=True,text=True,encoding='utf-8',env={**__import__('os').environ,**(env or {})}).stdout.strip().split('\n')[-1])
env={'MC_WREV':'build'} if VER=='build' else {}
def ms_states(tab,t,E,k_lvl,L,SET):
    """the mainspring's solved states: centre line and stress along the strip, sigma = E t / 2 |kappa - kappa0| (kappa0 mainspring.py's free curve)"""
    src=(HERE/tab).read_text(encoding='utf-8') if (HERE/tab).exists() else (HERE.parent/tab).read_text(encoding='utf-8');d=json.loads(re.search(r'const MSHAPE=(\{.*?\});',src,re.S).group(1))
    u16=lambda s:np.frombuffer(base64.b64decode(s),'<u2').astype(float)
    n=d['n'];s=u16(d['s'])*0.05;RR=u16(d['r']).reshape(-1,n)*0.0005
    FREE_PX=np.array([97,185,250,328,405,502,632,750],float);rk=FREE_PX*L/(2*math.pi*FREE_PX.sum());sk=np.array([2*math.pi*(rk[:i].sum()+rk[i]/2) for i in range(len(rk))])
    S0=np.r_[0,sk,L];RH0=np.r_[rk[0]*0.8,rk,rk[-1]+(rk[-1]-rk[-2])*(L-sk[-1])/(sk[-1]-sk[-2])];k0=lambda x:SET/np.interp(np.clip(x,0,L),S0,RH0)
    out=[]
    for k,T in enumerate(d['T']):
        r=RR[k];th=np.zeros(n)
        for i in range(1,n):ds=s[i]-s[i-1];dr=r[i]-r[i-1];th[i]=th[i-1]+math.sqrt(max(ds*ds-dr*dr,1e-12))/((r[i]+r[i-1])/2)
        th*=2*math.pi*T/th[-1];x,y=r*np.cos(th),r*np.sin(th)
        dx,dy=np.gradient(x,s),np.gradient(y,s);ddx,ddy=np.gradient(dx,s),np.gradient(dy,s);kap=(dx*ddy-dy*ddx)/np.maximum((dx*dx+dy*dy)**1.5,1e-12)
        sig=E*t/2*np.abs(np.abs(kap)-k0(s))*k_lvl;sig=np.convolve(sig,np.ones(5)/5,'same')
        j=np.linspace(0,n-1,400).astype(int);out.append({'T':T,'x':np.round(x[j],4).tolist(),'y':np.round(y[j],4).tolist(),'sig':np.round(sig[j],1).tolist(),'peak':float(np.percentile(sig[3:-3],99.5))})
    return out
if M=='hamilton':   # the Hamilton's (its own sources: js/mainspring.js, physics.js, strength.js, sustaining.js; each figure's source beside it)
    P=json.loads(subprocess.run(['node','-e',"const P=require('./physics.js');console.log(JSON.stringify({Mup:P.Mup,sUp:P.sUp,MS:P.MS,b:P.b,E:P.E,k:P.k,A:P.A}))"],cwd=HERE,capture_output=True,text=True,encoding='utf-8').stdout.strip().split('\n')[-1])
    t=P['MS']['t'];L=P['MS']['len'];E=P['E']/1e6;Tu,Td=18.7492,14.14007   # mainspring_friction.py's TUP, TDOWN: the fusee's working turns
    st=ms_states('js/mainspring.js',t,E,1.0,L,1.0)
    def at(Tq,key):Ts=[x['T'] for x in st];return float(np.interp(Tq,Ts,[np.median(x['sig']) if key=='median' else max(x['sig'][12:]) for x in st]))
    out={'model':M,'version':VER,'mainspring':{'table':'js/mainspring.js','t':t,'E':E,'level':1.0,'L':L,'states':st,'Tup':Tu,'Tdown':Td,'peakFull':at(Tu,'peak'),'medianFull':at(Tu,'median'),'peakDown':at(Td,'peak'),'limit':P['sUp']/1e6*1.0,'nominal':P['sUp']/1e6},
         'hairspring':{'k':P['k'],'b':0.23,'h':0.221,'MPaPerRad':6*P['k']/(0.23e-3*0.221e-3**2)/1e6,'limit':350,'note':'even along the strip (Phillips’ terminal curves, hairspring.js); 217 MPa at 255° (strength.js)'},
         'maintaining':{'peak':685,'banked':True,'law':'(1 - cos phi) / 2 from its end','t':0.28,'note':'the sustaining spring, banked in running (sustaining.js)'},
         'detentSpring':{'t':0.07,'L':5.0,'MPaPerRad':96/0.023,'peak':96,'limit':223,'note':'preloaded 69, lifted 96 MPa (strength.js)'},
         'goldSpring':{'peak':195,'limit':350,'law':'the moment rising from the tip to the root','note':'the trip spring bent 0.50 mm at its tip (strength.js)'},
         'chain':{'plateMPaPerN':508/51.2,'rivetMPaPerN':282/51.2,'limit':1400,'note':'strength.js’s inner link plate across its rivet hole (0.9 x 0.18) and the rivet in double shear'}}
    (D/f'springs_{VER}.json').write_text(json.dumps(out))
    print(f"{M} ({VER}): mainspring {out['mainspring']['peakFull']:.0f} MPa fully wound on its inner coils, {out['mainspring']['medianFull']:.0f} along it ({t} at {E/1e3:.0f} GPa; nominal {P['sUp']/1e6:.0f}); hairspring {out['hairspring']['MPaPerRad']:.1f} MPa a radian; chain {out['chain']['plateMPaPerN']:.2f} MPa a newton")
    sys.exit(0)
W=node("const W=require('./wempe_load.js')(),P=W.WPHYS,E=P.ESC,S=P.SET,B=W.WESC.BUILD;const PH=require('./wempe_physics.js');"
       "console.log(JSON.stringify({Kl:PH.Kl,k:P.HS.k,HB:W.WESC.HSL.HB,HT:W.WESC.HSL.HT,PS:Math.max(...E.PS)*E.ES,tsT:S.tsT,ET:S.ET,strip:(W.WESC.BSEL&&W.WESC.BSEL.strip)||null,bend:W.WESC.GBEND||null,L:"
       "JSON.parse(require('fs').readFileSync('wempe_mainspring.json','utf8')).final.L,set:JSON.parse(require('fs').readFileSync('wempe_mainspring.json','utf8')).final.set}))",env)
out={'model':M,'version':VER}

# ---- the mainspring ----
strip=W['strip'];tab=strip['table'] if strip else 'mainspring_wempe.js';t=strip['t'] if strip else 0.37;E=(strip['E'] if strip else 207)*1e3;k_lvl=1.0 if strip else W['Kl']
src=(HERE/tab).read_text(encoding='utf-8');d=json.loads(re.search(r'const MSHAPE=(\{.*?\});',src,re.S).group(1))
u16=lambda s:np.frombuffer(base64.b64decode(s),'<u2').astype(float)
n=d['n'];s=u16(d['s'])*0.05;RR=u16(d['r']).reshape(-1,n)*0.0005;L=W['L'];SET=W['set']
FREE_PX=np.array([97,185,250,328,405,502,632,750],float);rk=FREE_PX*L/(2*math.pi*FREE_PX.sum());sk=np.array([2*math.pi*(rk[:i].sum()+rk[i]/2) for i in range(len(rk))])
S0=np.r_[0,sk,L];RH0=np.r_[rk[0]*0.8,rk,rk[-1]+(rk[-1]-rk[-2])*(L-sk[-1])/(sk[-1]-sk[-2])];k0=lambda x:SET/np.interp(np.clip(x,0,L),S0,RH0)
states=[]
for k,T in enumerate(d['T']):
    r=RR[k];th=np.zeros(n)
    for i in range(1,n):ds=s[i]-s[i-1];dr=r[i]-r[i-1];th[i]=th[i-1]+math.sqrt(max(ds*ds-dr*dr,1e-12))/((r[i]+r[i-1])/2)
    th*=2*math.pi*T/th[-1];x,y=r*np.cos(th),r*np.sin(th)
    dx,dy=np.gradient(x,s),np.gradient(y,s);ddx,ddy=np.gradient(dx,s),np.gradient(dy,s);kap=(dx*ddy-dy*ddx)/np.maximum((dx*dx+dy*dy)**1.5,1e-12)
    sig=E*t/2*np.abs(np.abs(kap)-k0(s))*k_lvl;sig=np.convolve(sig,np.ones(5)/5,'same')   # the solve's grid steps smoothed over five
    j=np.linspace(0,n-1,400).astype(int);states.append({'T':T,'x':np.round(x[j],4).tolist(),'y':np.round(y[j],4).tolist(),'sig':np.round(sig[j],1).tolist(),'peak':float(np.percentile(sig[3:-3],99.5))})
MJ=json.loads((HERE/'wempe_mainspring.json').read_text());Tu=MJ['final']['Tup'];Td=MJ['final']['Tdown']   # fully wound and run down (the drawn fusee's turns; the build's spring set up and wound as the drawn)
def at(Tq,key):Ts=[st['T'] for st in states];return float(np.interp(Tq,Ts,[np.median(st['sig']) if key=='median' else max(st['sig'][12:]) for st in states]))
out['mainspring']={'table':tab,'t':t,'E':E,'level':k_lvl,'L':L,'states':states,'Tup':Tu,'Tdown':Td,'peakFull':at(Tu,'peak'),'medianFull':at(Tu,'median'),'peakDown':at(Td,'peak')}

# ---- the hairspring, the maintaining spring, the detent and gold springs, the chain ----
b,h=W['HB']*1e-3,W['HT']*1e-3;out['hairspring']={'k':W['k'],'b':W['HB'],'h':W['HT'],'MPaPerRad':6*W['k']/(b*h*h)/1e6,'note':'even along the strip (Phillips’ terminal curves)'}
sus=json.loads(subprocess.run(['node','wempe_sustaining.js','--json','-'],cwd=HERE,capture_output=True,text=True,encoding='utf-8',env={**__import__('os').environ,**env}).stdout or 'null') if False else None
SUS=json.loads((pathlib.Path(__import__('tempfile').gettempdir())/'sus.json').read_text(encoding='utf-8')) if VER=='last' else None
if SUS is None:
    import tempfile,os;p=pathlib.Path(tempfile.gettempdir())/f'sus_{VER}.json';subprocess.run(['node','wempe_sustaining.js','--json',str(p)],cwd=HERE,capture_output=True,env={**os.environ,**env});SUS=json.loads(p.read_text(encoding='utf-8'))
out['maintaining']={'peak':SUS['spring']['sig'],'banked':SUS['spring']['banked'],'law':'(1 - cos phi) / 2 from the eye','t':SUS['spring']['t']}
lift=0.025;out['detentSpring']={'t':0.07,'L':5.0,'MPaPerRad':207e3*0.07/(2*5.0),'note':'bent evenly by the lift'}
Lg=11.41;dl=W['PS'];bend=W['bend'];E_g=W['ET']*1e3
tE=W['tsT'];Ieff=1.0*tE**3/12;F=3*E_g*Ieff*dl/Lg**3   # N: the tip's force to bend the gold spring dl at its tip, the strip's stiffness as makeEsc takes it
t1=bend[1] if bend else 0.15;out['goldSpring']={'L':Lg,'tip':dl,'F':F,'rootT':t1,'thinTo':bend[0] if bend else 0,'peak':6*F*Lg/(1.0*t1*t1),'law':'the moment rising from the tip to the root, M = F (L - s)','note':'the return pass, the discharge stone bending its tip'}
out['chain']={'plateMPaPerN':127/37.8,'rivetMPaPerN':101/47.8,'note':'wempe_strength.js’s inner link plate across its rivet hole and the rivet in double shear'}
(D/f'springs_{VER}.json').write_text(json.dumps(out))
print(f"{M} ({VER}): mainspring {out['mainspring']['peakFull']:.0f} MPa fully wound on its inner coils, {out['mainspring']['medianFull']:.0f} along it, {out['mainspring']['peakDown']:.0f} run down ({tab}, {t} at {E/1e3:.0f} GPa, level x{k_lvl:.3f}); hairspring {out['hairspring']['MPaPerRad']:.1f} MPa a radian; "
      f"maintaining spring {out['maintaining']['peak']:.0f} MPa; gold spring {out['goldSpring']['peak']:.0f} MPa at its root ({t1} thick); chain {out['chain']['plateMPaPerN']:.2f} MPa a newton")
