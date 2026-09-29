"""Render the link-preview images (1200 x 630) shown when the site is shared, into site-assets/ at the repository root.

    python social.py                  # both presets: social.png (the model page: the dial in its box) and social-movement.png (the essay: the mechanism)
    python social.py dial             # one preset
    python social.py --out NAME.png --view VIEW [--drive] [--cam YAW PITCH DIST FOV]   # a custom shot, the model alone on the dark background

The presets set the model on a dark background, to the right of a title column in the page's own typefaces (Spectral, Instrument Sans).
VIEW is a view button (box, dial, movement, train, escapement, exploded); --drive shows the moving parts only;
--cam overrides the view's camera (radians, millimetres, degrees). Find camera numbers by orbiting in index.html?qa
and running __camInfo() in the console."""
import argparse,asyncio,html,pathlib
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
OUTDIR=HERE.parents[2]/'site-assets'
PRESETS={
 'dial':dict(out='social.png',view='dial',drive=False,cam=[0.3,1.0,390,32],tod='10:09:36',
   text=dict(kicker='Hamilton Model 21 · 1941',title='The Marine<br>Chronometer, <em>working</em>',
             sub='An interactive 3D model of a two-day fusee chronometer, running in real time in your browser.',
             tags=['Fusee and chain','Detent escapement','From the 1948 Navy manual'])),
 # the moving parts only: fusee, chain, barrel, train and balance, from low on the train side
 'movement':dict(out='social-movement.png',view='movement',drive=True,cam=[-0.5,0.55,182,24],tod=None,
   text=dict(kicker='An interactive essay',title='The Marine<br>Chronometer',
             sub='Longitude, the balance, the fusee and the detent escapement, with live diagrams and a working model.',
             tags=['Longitude','The fusee','The detent'])),
}
BG='radial-gradient(ellipse 58% 85% at 70% 52%,#1f2a35 0%,#121920 48%,#07090c 100%)'
# the stage alone, no labels, hints, cards or buttons, over a dark page; with a title, the stage keeps to the right of the text column
HIDE="header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs,.info,.opm{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
def css(text):
    left='400px' if text else '0'
    return (HIDE+f"html,body{{background:{BG}!important;min-height:100vh}}"
      f".stage{{position:fixed!important;inset:0 0 0 {left}!important;width:auto!important;height:auto!important;border-radius:0!important;background:transparent!important;aspect-ratio:auto!important}}"
      +(".stage{-webkit-mask-image:linear-gradient(90deg,transparent,#000 140px);mask-image:linear-gradient(90deg,transparent,#000 140px)}" if text else '')+
      "#soc{position:fixed;left:0;top:0;bottom:0;width:430px;padding:0 0 0 64px;display:flex;flex-direction:column;justify-content:center;color:#eef1f3;font-family:'Instrument Sans',system-ui,sans-serif}"
      "#soc .k{font-weight:600;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#e0b44f;display:flex;align-items:center;gap:12px}"
      "#soc .k::before{content:'';width:28px;height:1.5px;background:#e0b44f}"
      "#soc h1{font:300 60px/1.02 Spectral,Georgia,serif;letter-spacing:-.015em;margin:22px 0 20px}#soc h1 em{font-style:italic;font-weight:400;color:#e8c77a}"
      "#soc p{margin:0;max-width:330px;font-size:18px;line-height:1.5;color:#9fa9b2}"
      "#soc .t{display:flex;flex-wrap:wrap;gap:8px;margin-top:30px;max-width:340px}"
      "#soc .t span{font-weight:500;font-size:13px;color:#cfd6dc;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.04);border-radius:999px;padding:6px 12px}")
async def shot(b,out,view,drive,cam,text=None,tod=None):
    pg=await b.new_page(viewport={"width":1200,"height":630},device_scale_factor=1,color_scheme='dark')
    errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    # applied before the page's scripts run, so the renderer starts at this size
    await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%css(text))
    await pg.goto(PAGE);await pg.wait_for_timeout(4500)
    await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
    if drive:await pg.evaluate("document.querySelector('#driveOn').click()")
    await pg.evaluate(f"document.querySelector('#views button[data-v=\"{view}\"]').click()");await pg.wait_for_timeout(2500)
    # the hands at ten past ten, as watches are photographed (the model is stopped, so they stay there)
    if tod:await pg.evaluate("t=>{const i=document.querySelector('#tod');i.value=t;i.dispatchEvent(new Event('change'))}",tod)
    if cam:await pg.evaluate(f"window.__cam({cam[0]},{cam[1]},{cam[2]},{cam[3]})");await pg.wait_for_timeout(2500)
    if text:
        h=(f'<div class="k">{html.escape(text["kicker"])}</div><h1>{text["title"]}</h1><p>{html.escape(text["sub"])}</p>'
           '<div class="t">'+''.join(f'<span>{html.escape(t)}</span>' for t in text['tags'])+'</div>')
        await pg.evaluate("h=>{const d=document.createElement('div');d.id='soc';d.innerHTML=h;document.body.appendChild(d);return document.fonts.ready}",h)
        await pg.wait_for_timeout(300)
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
