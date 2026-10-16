"""The mechanisms' geometry and inertias off the built model (mechanisms-check.js), for the analyses that run without a browser: ratchets.js (each pawl on its
ratchet), traindyn.js (the arbors' moments of inertia), motionwork.js (the hands), wear.js and montecarlo.js. They read tools/mechanisms.json.

    python mechanisms.py           # prints a summary; exit 1 if tools/mechanisms.json is not what it finds (about 30 s)
    python mechanisms.py --write   # writes tools/mechanisms.json

Lengths in mm, masses in g, moments of inertia in g·mm²."""
import asyncio,browser,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=(HERE/'mechanisms-check.js').read_text(encoding='utf-8')
OUT=HERE/'mechanisms.json'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')&&window.__mv",timeout=120000);await pg.wait_for_timeout(2500)
        r=json.loads(await pg.evaluate(JS));await b.close()
    if errs:print('page errors:',errs);sys.exit(1)
    out={'note':'tools/mechanisms.py: the mechanisms off the built model (mechanisms-check.js); mm, g, g·mm²',**r}
    for q in out['pawls']:
        f=q['face'];print(f"{q['name']:16s} z {q['z']:3d}  pivot {q['pivot']}  {f['kind']}, gap {f['gap']:+.3f} mm, contact r {f['r'][0]:.2f}-{f['r'][1]:.2f}, n {f['n']}, {f['depth']:.3f} deep  pawl {q['mass']*1000:.1f} mg, I {q['I']:.3f} g·mm²")
    for k,a in out['arbors'].items():print(f"{k:13s} {a['m']*1000:8.1f} mg  I {a['I']:9.3f} g·mm²  off-axis {a['off']:.3f} mm"+(f"  missing {a['missing']}" if a['missing'] else ''))
    txt=json.dumps(out,indent=1,ensure_ascii=False)+'\n'
    if '--write' in sys.argv:open(OUT,'w',encoding='utf-8',newline=chr(10)).write(txt);print('wrote tools/mechanisms.json');return
    old=json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else None
    def close(a,b):
        if isinstance(a,dict):return isinstance(b,dict) and a.keys()==b.keys() and all(close(a[k],b[k]) for k in a)
        if isinstance(a,list):return isinstance(b,list) and len(a)==len(b) and all(close(x,y) for x,y in zip(a,b))
        if isinstance(a,(int,float)) and isinstance(b,(int,float)):return abs(a-b)<=1e-3+1e-3*abs(b)
        return a==b
    if old is None or not close(out,old):print('  !!  tools/mechanisms.json is not what this finds: python mechanisms.py --write');sys.exit(1)
    print('  ok  tools/mechanisms.json is up to date')
asyncio.run(main())
