"""The Wempe's escapement's moving bodies weighed on the model (wempe-inertia.js, in the Wempe's page): the balance, its rollers, the hairspring's collet and the spring
itself, each about the staff; the detent's moving part about its flexure; the escape arbor, the seconds arbor and the seconds hand, each about its own axis. Every closed
solid integrated at its material's density. tools/wempe_escapement.js reads them (wempe_inertia.json) and checks the escapement's settings (WESC.SET's I, JW, ID) against them.

    python wempe_inertia.py           # prints them; exit 1 if tools/wempe_inertia.json is not what it finds (about 30 s)
    python wempe_inertia.py --write   # writes tools/wempe_inertia.json
    python wempe_inertia.py --rev 6mx [--write]   # another version's bodies (the page's Variants: first, 6mx), into tools/wempe_inertia_6mx.json (wempe_6mx.js reads it)

Masses in g, moments of inertia in g·mm² about each body's own axis; cg the centre of mass in the body's frame (mm: x, y along the axis, z), which should lie on the axis."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parents[1]/'wempe'/'index.html').as_uri()+'?snap&qa'
JS=(HERE/'wempe-inertia.js').read_text(encoding='utf-8')
REV=sys.argv[sys.argv.index('--rev')+1] if '--rev' in sys.argv else None
OUT=HERE/(f'wempe_inertia_{REV}.json' if REV else 'wempe_inertia.json')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("window.__mv&&window.__mv.userData.R",timeout=120000);await pg.wait_for_timeout(1500)
        if REV:await pg.evaluate("v=>__mv.userData.setRev(v)",REV);await pg.wait_for_timeout(300)
        r=json.loads(await pg.evaluate(JS));await b.close()
    if errs:print('page errors:',errs);sys.exit(1)
    out={'note':"tools/wempe_inertia.py: the Wempe's escapement's moving bodies weighed on the model's solids (wempe-inertia.js): g and g·mm² about each body's own axis; read by wempe_escapement.js"}
    bad=False
    for k,v in r.items():
        q={'m':round(v['m']/1000,4),'I':round(v['I']/1000,2),'cg':[round(x,3) for x in v['cg']],'byHn':{h:{'m':round(e['m']/1000,4),'I':round(e['I']/1000,2)} for h,e in sorted(v['byHn'].items(),key=lambda x:-x[1]['I'])}}
        if v['missing']:q['missing']=v['missing'];bad=True
        out[k]=q;print(f"{k}: {q['m']:.4f} g, I {q['I']:.2f} g·mm² (its centre of mass {q['cg'][0]:+.3f}, {q['cg'][2]:+.3f} off the axis)"+(f"; no density for {v['missing']}" if v['missing'] else ''))
        for h,e in list(q['byHn'].items())[:8]:print(f"     {h:14s} {e['m']:.4f} g  {e['I']:9.2f} g·mm²")
    if bad:print('  !!  a solid without a density');sys.exit(1)
    txt=json.dumps(out,indent=1,ensure_ascii=False)+'\n'
    if '--write' in sys.argv:OUT.write_text(txt,encoding='utf-8',newline='\n');print('wrote tools/'+OUT.name)
    else:
        def same(a,b):return all(k in b and abs(a[k]['m']-b[k]['m'])<=1e-3*max(b[k]['m'],1e-3) and abs(a[k]['I']-b[k]['I'])<=1e-3*max(b[k]['I'],1e-2) for k in a if k!='note')
        ok=OUT.exists() and same(out,json.loads(OUT.read_text(encoding='utf-8')));print('  ok  tools/wempe_inertia.json is up to date' if ok else '  !!  tools/wempe_inertia.json is not what this finds: python wempe_inertia.py --write');sys.exit(0 if ok else 1)
asyncio.run(main())
