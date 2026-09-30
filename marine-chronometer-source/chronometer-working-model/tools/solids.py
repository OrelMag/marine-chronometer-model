"""Solid geometry check: every part is a closed solid facing out, as a CAD model's are.

    python solids.py          # the model as loaded, then with Moving parts only and a section on (the mainspring and hairspring are built only when shown)

Each mesh must have no open edge, no edge used twice the same way (a face wound against its neighbours) and a positive signed volume (not inside
out); see solids-check.js. Intentional surfaces are skipped: userData.decal (engravings) and userData.surface (the dial's printed face, the floor's
shadow). Build open shapes through extrude() and closeGeo() in core.js. Exit code 1 on any failure."""
import asyncio,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS=(HERE/'solids-check.js').read_text(encoding='utf-8')
async def main():
    bad=0
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        # as in smoke.py: a fresh headless Chromium loses its first WebGL context, so spend it on a blank page
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800});errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        for tag,h in (('as loaded',''),('moving parts only, section','#drive=1&sec=x:0')):
            await pg.goto(PAGE+h);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(2500)
            rows=await pg.evaluate(JS);bad+=len(rows)
            print(f"{tag}: {len(rows)} not solid")
            for r in rows:print('  FAIL %-14s %-18s open %5d  misfolded %5d  volume %.3f'%tuple(r))
        if errs:print('page errors:',errs);bad+=1
        await b.close()
    sys.exit(1 if bad else 0)
asyncio.run(main())
