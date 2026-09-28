"""Render the link-preview images (1200 x 630) shown when the site is shared, into site-assets/ at the repository root.

    python social.py                  # both presets: social.png (the dial in its box) and social-movement.png (the mechanism)
    python social.py dial             # one preset
    python social.py --out NAME.png --view VIEW [--drive] [--cam YAW PITCH DIST FOV]   # a custom shot

VIEW is a view button (box, dial, movement, train, escapement, exploded); --drive shows the moving parts only;
--cam overrides the view's camera (radians, millimetres, degrees). Find camera numbers by orbiting in index.html?qa
and running __camInfo() in the console."""
import argparse,asyncio,pathlib
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
OUTDIR=HERE.parents[2]/'site-assets'
PRESETS={
 'dial':dict(out='social.png',view='dial',drive=False,cam=None),
 # the moving parts only: fusee, chain, barrel, train and balance, from low on the train side
 'movement':dict(out='social-movement.png',view='movement',drive=True,cam=[-0.5,0.55,182,24]),
}
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
async def shot(b,out,view,drive,cam):
    pg=await b.new_page(viewport={"width":1200,"height":630},device_scale_factor=1,color_scheme='light')
    errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    # the stage alone, filling the window; no labels, hints or buttons. Applied before the page's scripts run, so the renderer starts at this size
    await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
    await pg.goto(PAGE);await pg.wait_for_timeout(4500)
    await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
    if drive:await pg.evaluate("document.querySelector('#driveOn').click()")
    await pg.evaluate(f"document.querySelector('#views button[data-v=\"{view}\"]').click()");await pg.wait_for_timeout(2500)
    if cam:await pg.evaluate(f"window.__cam({cam[0]},{cam[1]},{cam[2]},{cam[3]})");await pg.wait_for_timeout(2500)
    OUTDIR.mkdir(exist_ok=True)
    await pg.screenshot(path=str(OUTDIR/out),timeout=180000)
    print('wrote',OUTDIR/out,'errors:',errs);await pg.close()
async def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('preset',nargs='?',choices=list(PRESETS));ap.add_argument('--out');ap.add_argument('--view',default='movement')
    ap.add_argument('--drive',action='store_true');ap.add_argument('--cam',type=float,nargs=4)
    a=ap.parse_args()
    jobs=[dict(out=a.out,view=a.view,drive=a.drive,cam=a.cam)] if a.out else [PRESETS[a.preset]] if a.preset else list(PRESETS.values())
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        for j in jobs:await shot(b,**j)
        await b.close()
asyncio.run(main())
