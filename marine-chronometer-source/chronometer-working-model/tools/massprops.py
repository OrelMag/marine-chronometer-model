"""The gimbals' swinging bodies weighed on the model: the bowl (the case with the movement in it) and the gimbal ring, each solid integrated at its material's density
(massprops-check.js), their masses, centres of gravity and inertia tensors about the gimbal centre; and how far each axis swings before the case or the ring meets
the box. gimbals.js reads them (tools/gimbals.json).

    python massprops.py           # prints them; exit 1 if tools/gimbals.json is not what it finds (about 30 s)
    python massprops.py --write   # writes tools/gimbals.json

The mainspring and the hairspring are built only when shown: they are weighed in Moving parts only (#drive=1), in the movement's own frame since the movement
stands lifted out of its case there, and added to the bowl through the movement's place in it as loaded. Masses in g, lengths in mm.

    python massprops.py --model wempe [--write]   # the Wempe's (tools/gimbals_wempe.json): its checks.py's MASSPROPS gives the view, the densities, its extra figures and other bowls
"""
import asyncio,json,pathlib,sys
import model
import numpy as np
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=model.PAGE
JS=(HERE/'massprops-check.js').read_text(encoding='utf-8')
MP=model.cfg('MASSPROPS')   # another model's: {hash, pre (JS: its densities), extra (JS: its figures), alt ({name: the bowl's density})}; None for the Hamilton
OUT=HERE/(MP['out'] if MP else 'gimbals.json')
# the model's clock starts at the time of day (app.js: tSim from Date.now()), and the hands' weight turning with it moved the bowl's centre of gravity up to 0.016 mm
# between runs, past the check's 0.01 (48e82e1 rewrote gimbals.json for one such drift): the page is loaded at one instant, 13 October 2026 06:50 GMT, about when that write was
CLOCK="(()=>{const n=Date.now,t0=n(),T=Date.UTC(2026,9,13,6,50,0);Date.now=()=>T+(n()-t0);})()"
async def load(b,h,mode=None):
    pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.add_init_script(CLOCK);await pg.goto(PAGE+h);await pg.wait_for_function("!document.querySelector('#loading')&&window.__BX",timeout=120000);await pg.wait_for_timeout(2500)
    if mode:await pg.evaluate(f"window.__mpMode='{mode}'")
    if MP:await pg.evaluate(MP['pre'])
    r=json.loads(await pg.evaluate(JS))
    if MP:r['extra']=json.loads(await pg.evaluate(MP['extra']));r['alt']={k:json.loads(await pg.evaluate(f"window.__mpNoStops=1;window.__mpBowl={v};"+JS))['raw']['bowl'] for k,v in MP['alt'].items()}
    await pg.close()
    if errs:print('page errors:',errs);sys.exit(1)
    return r
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        r=await load(b,MP['hash'] if MP else '');sp=await load(b,'#drive=1','springs') if not MP else {'m':0,'s':[0,0,0],'S':[[0]*3]*3,'byPart':{}};await b.close()   # the Wempe builds its springs always
    # the springs' moments (mg, mm, the movement's frame) into the ring's: s' = R s + m t, S' = R S Rᵀ + R s tᵀ + t (R s)ᵀ + m t tᵀ
    T=np.array(r['mvM']).reshape(4,4).T;R_,t=T[:3,:3],T[:3,3];m=sp['m'];s=np.array(sp['s']);S=np.array(sp['S']);Rs=R_@s
    raw=r['raw']['bowl'];mb=raw['m']+m;sb=np.array(raw['s'])+Rs+m*t;Sb=np.array(raw['S'])+R_@S@R_.T+np.outer(Rs,t)+np.outer(t,Rs)+m*np.outer(t,t)
    def fin(m,s,S,extra):
        c=s/m;I=np.trace(S)*np.eye(3)-S;return{'m':round(float(m)/1000,3),'cg':[round(float(x),3) for x in c],'I':[[round(float(x)/1000,1) for x in row] for row in I],**extra}   # g, mm, g·mm²
    q=r['bowl'];bowl=fin(mb,sb,Sb,{'byMat':{k:round(v/1000,2) for k,v in q['byMat'].items()},'byPart':{**{k:round(v/1000,2) for k,v in q['byPart'].items()},**{k:round(v/1000,2) for k,v in sp['byPart'].items()}},'missing':q['missing']})
    rr=r['raw']['ring'];q=r['ring'];ring=fin(rr['m'],np.array(rr['s']),np.array(rr['S']),{'byMat':{k:round(v/1000,2) for k,v in q['byMat'].items()},'byPart':{k:round(v/1000,2) for k,v in q['byPart'].items()},'missing':q['missing']})
    out={'note':"tools/massprops.py: the gimbals' swinging bodies on the model (massprops-check.js): g, mm and g·mm² about the gimbal centre in the ring's frame at rest (y up, the ring's pivots on x, the case's on z); mv: the movement's frame in the ring's (4x4, column-major); read by gimbals.js",
         'bowl':bowl,'ring':ring,'mv':[round(float(x),6) for x in r['mvM']],'stops':r['stops'],'ringY':r['ringY'],'RO':r.get('RO'),'CR':r.get('CR')}
    if MP:out={'model':model.NAME,**out,**r['extra'],'alt':{k:{'rho':MP['alt'][k],**fin(a['m'],np.array(a['s']),np.array(a['S']),{})} for k,a in r['alt'].items()}}
    for k in ('bowl','ring'):
        q=out[k];print(f"{k}: {q['m']:.1f} g, its centre of gravity {q['cg']} mm; I about the centre {[[round(x) for x in row] for row in q['I']]} g·mm²")
        print('   by material:',', '.join(f'{a} {v:.1f}' for a,v in q['byMat'].items()));print('   heaviest parts:',', '.join(f'{a} {v:.1f}' for a,v in sorted(q['byPart'].items(),key=lambda x:-x[1])[:12]))
        if q['missing']:print('   no density for:',q['missing'])
    print('stops:',out['stops'])
    if MP:print('the bowl in other materials:',', '.join(f"{k} ({q['rho']} g/cm³): {q['m']:.1f} g, its centre of gravity {q['cg']}" for k,q in out['alt'].items()))
    txt=json.dumps(out,indent=1,ensure_ascii=False)+'\n'
    if '--write' in sys.argv:OUT.write_text(txt,encoding='utf-8',newline='\n');print('wrote tools/'+OUT.name)
    else:
        # the balance stands at another phase each load, its weight a hair elsewhere: masses and inertias to 0.1 %, centres of gravity to 0.01 mm, the stops exact
        def same(a,b):
            for k in ('bowl','ring'):
                if abs(a[k]['m']/b[k]['m']-1)>1e-3 or any(abs(x-y)>0.01 for x,y in zip(a[k]['cg'],b[k]['cg'])):return False
                if any(abs(a[k]['I'][i][j]-b[k]['I'][i][j])>1e-3*max(abs(a[k]['I'][i][i]),1) for i in range(3) for j in range(3)):return False
            return a['stops']==b['stops'] and all(abs(x-y)<1e-6 for x,y in zip(a['mv'],b['mv']))
        ok=OUT.exists() and same(json.loads(OUT.read_text(encoding='utf-8')),out);print(f'  ok  tools/{OUT.name} is up to date' if ok else f'  !!  tools/{OUT.name} is not what this finds: python massprops.py{" --model "+model.NAME if MP else ""} --write');sys.exit(0 if ok else 1)
asyncio.run(main())
