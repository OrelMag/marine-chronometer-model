"""Render the link-preview image (1200 x 630) shown when the site is shared: writes site-assets/social.png at the repository root.
Usage: python social.py [view] [yaw pitch dist fov]   (view: box, dial, movement, ...; the camera numbers override the view's camera)"""
import asyncio,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
OUT=HERE.parents[2]/'site-assets/social.png'
VIEW=sys.argv[1] if len(sys.argv)>1 else 'dial'
CAM=[float(x) for x in sys.argv[2:6]] if len(sys.argv)>=6 else None
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        pg=await b.new_page(viewport={"width":1200,"height":630},device_scale_factor=1,color_scheme='light')
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        # the stage alone, filling the window; no labels, hints or buttons. Applied before the page's scripts run, so the renderer starts at this size
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%("header,.panel,.hud,.tools,.hint,.labels,.loading{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}.stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}"))
        await pg.goto(PAGE);await pg.wait_for_timeout(4500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate(f"document.querySelector('#views button[data-v=\"{VIEW}\"]').click()");await pg.wait_for_timeout(2500)
        if CAM:await pg.evaluate(f"window.__cam({CAM[0]},{CAM[1]},{CAM[2]},{CAM[3]})");await pg.wait_for_timeout(2500)
        OUT.parent.mkdir(exist_ok=True)
        await pg.screenshot(path=str(OUT),timeout=180000)
        print('wrote',OUT,'errors:',errs);await b.close()
asyncio.run(main())
