"""Every moving body's kinematics for the 3D viewer (PLAN-motion-3d.md, phase 2). numpy; no browser, no Node.

    python motion3d_kin.py --model wempe [--version last|build]   # a second

Reads r_motion3d/<model>/meshes.json (motion3d.py: each part's turn per escape-wheel tooth, measured on the page's own update()) and trace_<version>.js (the transmission
run: each body's angle, the train's rigid motion plus its deviation from it). Writes kin_<version>.json:
  ratios   each part the escape wheel turns: its turn per tooth as the page moves it, against the tooth counts (TR.MESH: 90/14, 90/12, 80/10, 80/10, the motion work)
  runs     for each run (a beat, the key let go outright and eased, the stop) and body: its largest speed and acceleration (the angle differenced on the run's own
           steps) and its largest deviation from the train's rigid motion (the meshes' backlash and give, the clicks' and detents' ride), with when"""
import json,math,pathlib,sys,base64
import numpy as np
import model
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
M=model.NAME;VER=arg('--version','last');D=HERE/'r_motion3d'/M
dec=lambda b:np.frombuffer(base64.b64decode(b),'<f4').astype(float)
J=json.loads((D/'meshes.json').read_text());s=(D/f'trace_{VER}.js').read_text(encoding='utf-8');T=json.loads(s[s.index('{'):s.rstrip().rindex('}')+1])
# the ratios: rad per escape-wheel tooth, the page's against the tooth counts (the escape wheel 15 teeth; each mesh the driver's teeth over the driven's leaves)
TAU=2*math.pi;e=TAU/15;want={'escapeWheel':e,'secondsWheel':e*10/80,'intermediateWheel':e*10/80*10/80,'centreWheel':e*10/80*10/80*12/90,'fuseeWheel':e*10/80*10/80*12/90*14/90,
     'fusee':e*10/80*10/80*12/90*14/90,'changeWheel':e*10/80*10/80*12/90*14/56,'hourWheel':e*10/80*10/80*12/90*14/56*18/54}
rat={}
for m in J['meshes']:
    f=(m.get('drv') or {}).get('E')
    if f and f['kind']=='turn' and m['part'] not in rat:rat[m['part']]={'page':f['rate'],'teeth':want.get(m['part']),'axis':f['pt']}
for k,v in rat.items():v['ok']=None if v['teeth'] is None else abs(v['page']/v['teeth']-1)<1e-3
runs={}
for r in T['S']:
    t=dec(r['t'])+r.get('t0',0);rows={}
    for nm,bd in r['bodies'].items():
        q=bd['q0']+dec(bd['kin'])+dec(bd['dev']);dv=dec(bd['dev'])
        if len(q)<5:continue
        w=np.gradient(q,t);a=np.gradient(w,t);iw,ia,idv=int(np.argmax(np.abs(w))),int(np.argmax(np.abs(a))),int(np.argmax(np.abs(dv)))
        rows[nm]={'w':float(w[iw]),'tw':float(t[iw]),'a':float(a[ia]),'ta':float(t[ia]),'dev':float(dv[idv]),'tdev':float(t[idv]),'turn':float(q[-1]-q[0])}
    F={k:dec(b) for k,b in r['forces'].items()}
    if 'balance' in F:   # the beat: the balance's swing and speed, the detent's lift (makeEsc's escapement in time, driven by the train)
        bw=F['balanceW'];rows['balance']={'amp':float(np.abs(F['balance']).max()),'w':float(bw[np.argmax(np.abs(bw))]),'a':float(np.abs(np.gradient(bw,t)).max()),'note':'the swing (rad), its largest speed and acceleration'}
        rows['detent']={'lift':float(np.abs(F['detentLift']).max()),'w':float(np.abs(np.gradient(F['detentLift'],t)).max()),'note':'its lift (rad) and largest speed'}
    runs[r['name']]={'kind':r['kind'],'span':[float(t[0]),float(t[-1])],'frames':int(r['n']),'bodies':rows}
out={'model':M,'version':VER,'ratios':rat,'runs':runs}
(D/f'kin_{VER}.json').write_text(json.dumps(out,indent=1))
bad=[k for k,v in rat.items() if v['ok'] is False]
print(f"{M} ({VER}): {len(rat)} parts turned by the escape wheel, {sum(1 for v in rat.values() if v['ok'])} against the tooth counts to 0.1 %{', off: '+', '.join(bad) if bad else ''}")
for n_,rr in runs.items():
    b=rr['bodies'];print(f"  {n_}: "+', '.join(f"{k} {abs(v['w']):.3g} rad/s" for k,v in b.items() if 'w' in v and k in('fusee','barrel','centre','esc','balance','detent','key','click 1')))
