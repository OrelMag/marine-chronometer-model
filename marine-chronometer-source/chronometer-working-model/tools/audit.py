"""Geometry audit: screws that overlap or have nothing under their seat, cylinders (arbors, pins) whose ends sit in nothing,
coplanar overlapping faces (possible z-fighting), and parts that touch nothing. Usage: python audit.py [box]"""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
JS='geometry-audit-box.js' if 'box' in sys.argv[1:] else 'geometry-audit.js'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":800,"height":600});pg.on("pageerror",lambda e:print("ERR",e))
        await pg.goto(PAGE);await pg.wait_for_timeout(5000)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        r=json.loads(await pg.evaluate(open(HERE/JS).read()))
        for k,v in r.items():
            print(f'== {k} ({len(v)})')
            for x in v: print('  ',x)
        await b.close()
asyncio.run(main())
