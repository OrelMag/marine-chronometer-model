"""Smoke test: load the model and click through every control, failing on any console error or warning or page error (exit code 1).

    python smoke.py            # the model (../index.html) and the built essay (../../../marine-chronometer.html)
    python smoke.py --model    # the model only

Every view with and without Moving parts only, every walkthrough step, both balances, every dial style and plate finish, every cross-section
(and its other half), GMT / Local, setting the hands with the key and by stopping, the rate book, the adjuster's bench, the Illustration tab, the display switches, Reset display, Link, winding with the key, the keyboard, and a link through the URL
hash. Then the essay, scrolled from top to bottom. SwiftShader's own driver notices ('GL Driver Message', 'GPU stall') are not the page's and are
ignored. Each problem names the page and the last step done before it."""
import asyncio,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
ESSAY=HERE.parents[2]/'marine-chronometer.html'
ARGS=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"]
NOISE=('GL Driver Message','GPU stall')
STEPS=[]
def watch(pg,errs,tag):   # each problem names the page and the last step done before it
    at=lambda:f"{tag}, after '{STEPS[-1] if STEPS else 'load'}'"
    pg.on("pageerror",lambda e:errs.append(f'{at()}: page error: {e}'))
    pg.on("console",lambda m:errs.append(f'{at()}: console {m.type}: {m.text}') if m.type in('error','warning') and not any(n in m.text for n in NOISE) else None)
async def model(b,errs,steps):
    pg=await b.new_page(viewport={"width":1100,"height":760});watch(pg,errs,'model')
    await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=60000)
    async def click(sel,label=None,ms=250):
        await pg.evaluate("s=>{const e=document.querySelector(s);if(!e)throw Error('missing '+s);e.click();}",sel);await pg.wait_for_timeout(ms);steps.append(label or sel)
    for drive in(False,True):
        if drive:await click('#driveOn','Moving parts only')
        for v in['box','dial','movement','train','escapement','exploded','laidout','fusee','balance']:await click(f'#views button[data-v="{v}"]',f'view {v}'+(' (moving parts)' if drive else ''))
    await click('#mwOn','motion work and hands');await click('#mwOn');await click('#driveOn','Moving parts off')
    await click('#tStart','walkthrough')
    for i in range(7):await click('#tNext',f'walkthrough step {i+2}',400)
    await click('#tNext','walkthrough finish')
    for grp in['#bal','#dialSt','#finish']:
        for v in await pg.evaluate("g=>[...document.querySelectorAll(g+' button')].map(b=>b.dataset.v)",grp):await click(f'{grp} button[data-v="{v}"]')
        await click(f'{grp} button')   # back to the first (the default)
    await click('#views button[data-v="movement"]')
    for v in['x','z','y']:
        await click(f'#secs button[data-v="{v}"]',f'section {v}');await click('#secFlip',f'section {v}, other half');await click('#secFlip')
    await click('#secs button[data-v="off"]','section off')
    await click('#tz button[data-v="local"]','Local time');await click('#tz button[data-v="gmt"]','GMT');await click('#now','Now')
    await click('#tabFig','Illustration tab');await click('#tabModel','3D model tab')
    for sel in['#colr','#ghost','#edges','#lbls','#rock','#latch','#spin','#snd']:await click(sel,f'{sel} on');await click(sel,f'{sel} off')
    # pen and wash (makeInk, core.js): every view, with see-through plates, colour by part, a section and moving parts only
    await click('#draw','pen and wash on',600)
    for v in['box','dial','movement','train','escapement','exploded','laidout','fusee','balance']:await click(f'#views button[data-v="{v}"]',f'pen and wash, view {v}')
    await click('#colr');await click('#ghost','pen and wash, colour by part, see-through');await click('#colr');await click('#ghost')
    await click('#secs button[data-v="x"]','pen and wash, section');await click('#secs button[data-v="off"]')
    await click('#driveOn','pen and wash, moving parts only');await click('#driveOn');await click('#draw','pen and wash off')
    # edges (makeInk's lines over the normal frame; on by default except on phones): a section, see-through plates, then pen and wash over it (it disables Edges) and off again
    if not await pg.evaluate("document.querySelector('#edges').checked"):errs.append('Edges not on by default')
    await click('#secs button[data-v="x"]','edges, section');await click('#secs button[data-v="off"]');await click('#ghost','edges, see-through');await click('#ghost')
    await click('#draw','edges, pen and wash on');await click('#draw','edges, pen and wash off')
    if not await pg.evaluate("document.querySelector('#edges').checked&&!document.querySelector('#edges').disabled"):errs.append('Edges not restored after pen and wash')
    await click('#edges','edges off',600);await click('#edges','edges on again')
    # Reset display puts the Display boxes back (Edges on, the rest off, in Dial); Link copies the address, or puts it in the address bar
    for sel in['#lbls','#colr','#rock','#spin','#ghost']:await click(sel)
    await click('#edges');await click('#draw');await click('#dispReset','reset display',600)
    bad=await pg.evaluate("['lbls','colr','draw','rock','latch','spin','ghost'].filter(k=>document.querySelector('#'+k).checked).concat(document.querySelector('#edges').checked?[]:['edges'])")
    if bad:errs.append(f'Reset display left {bad}')
    await click('#link','copy link',400)
    await click('#speeds button[data-v="3600"]','3600x',600);await click('#speeds button[data-v="0.05"]','1/20x',600);await click('#speeds button[data-v="1"]','1x')
    await click('#kwBtn','wind with the key',2500);await click('#kwBtn','stop winding')
    await click('#wind','wind');await click('#rateZero','rate reset')
    # stopping and starting: the locking arm stops the balance, a twist restarts it; the train-blocking screw stops the train at a spoke (at 60x, so it reaches one soon)
    hud=lambda:pg.evaluate("document.querySelector('#hud').textContent")
    async def expect(label,want,ok=True,wait=0):   # wait: poll up to this many seconds (the arm and screw move on frame time, slow in a headless browser)
        for _ in range(int(wait*2)+1):
            t=await hud()
            if (want in t)==ok:return
            if wait:await pg.wait_for_timeout(500)
        errs.append(f'{label}: HUD reads "{t}"')
    # model time runs at 60x here: a headless browser draws a few frames a second, and the arm stops the balance in model time
    await pg.evaluate("document.querySelector('#stopDet').open=true");await click('#speeds button[data-v="60"]','60x')
    await click('#armSeg button[data-v="1"]','balance locked',2500);await expect('balance locked','Balance locked')
    await click('#armSeg button[data-v="0"]','balance unlocked',1000);await expect('unlocked, at rest','twist to start')
    await click('#twist','twist to start',2500);await expect('after the twist','Stopped',False)
    await click('#blkSeg button[data-v="1"]','train-blocking screw down');await expect('screw down','Train blocked',wait=45)
    await click('#blkSeg button[data-v="0"]','train-blocking screw raised');await expect('screw raised','Train blocked',False,wait=45)
    await click('#twist','twist again',1500);await expect('screw raised and twisted','Stopped',False)
    # setting the hands (Sec. III): with the key, then stopping, unlocking and twisting; the rate book: comparisons, latitude, clear
    await pg.evaluate("document.querySelector('#bookDet').open=true");await click('#bookNow','rate book comparison')
    await click('#ksBtn','set forward with the key',1500);await click('#ksBtn','setting with the key stopped')
    await click('#ssBtn','stop to set',2500);await click('#ssBtn','stop to set: unlock',1000);await click('#ssBtn','stop to set: twist',1500)
    await pg.evaluate("()=>{const i=document.querySelector('#lat');i.value=-45;i.dispatchEvent(new Event('input'))}");await click('#bookNow','second comparison, 45 S');await click('#bookClr','rate book cleared')
    # the adjuster's bench: each setting to both ends (some won't run, and are refused), then the model's settings again
    await pg.evaluate("document.querySelector('#benchDet').open=true")
    for j in range(6):
        for end in('min','max'):
            await pg.evaluate("([j,e])=>{const i=document.querySelectorAll('#benchS input')[j];i.value=i[e];i.dispatchEvent(new Event('input'))}",[j,end]);await pg.wait_for_timeout(250)
        steps.append(f'bench setting {j+1} to both ends')
    await click('#benchReset',"bench: the model's settings");await click('#benchLook','bench: show the escapement')
    if await pg.evaluate("document.querySelector('#benchOut b').textContent")!='Every figure within the manual’s':errs.append("the model's settings don't pass on the bench")
    await click('#speeds button[data-v="1"]','1x');await click('#stopLook','show the arm and screw')
    await click('#helpBtn','help card');await click('#helpBtn','help card closed')
    await pg.focus('canvas')
    for k in['ArrowLeft','ArrowUp','+','-','0','1','Space']:await pg.keyboard.press(k);await pg.wait_for_timeout(150)
    await pg.keyboard.press('Space');steps.append('keyboard')
    await pg.evaluate("location.hash='#view=escapement&part=det&speed=0.05&draw=1'");await pg.wait_for_timeout(1200)
    st=await pg.evaluate("[document.querySelector('#views button[aria-pressed=\"true\"]')?.dataset.v,document.querySelector('#info').classList.contains('on'),document.querySelector('#spdN').value,document.querySelector('#draw').checked]")
    if st!=['escapement',True,'0.05',True]:errs.append(f'hash link not applied: {st}')
    steps.append('hash link');await pg.close()
async def essay(b,errs,steps):
    if not ESSAY.exists():errs.append(f'no built essay at {ESSAY}: run build.py');return
    pg=await b.new_page(viewport={"width":1100,"height":760});watch(pg,errs,'essay');await pg.goto(ESSAY.as_uri());await pg.wait_for_timeout(2000)
    h=await pg.evaluate("document.body.scrollHeight")
    for y in range(0,h,700):await pg.evaluate(f"scrollTo(0,{y})");await pg.wait_for_timeout(120)
    await pg.wait_for_timeout(1000);steps.append('essay scrolled');await pg.close()
async def main():
    errs,steps=[],STEPS
    async with async_playwright() as p:
        b=await p.chromium.launch(args=ARGS)
        # a fresh headless Chromium on SwiftShader loses its first WebGL context a moment after creating it, whatever the page (the original model too):
        # spend that on a blank page, so the pages under test start with a context that stays
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        await model(b,errs,steps)
        if '--model' not in sys.argv:await essay(b,errs,steps)
        await b.close()
    print(f'{len(steps)} steps');[print(e) for e in errs]
    print('ok' if not errs else f'{len(errs)} problems');sys.exit(1 if errs else 0)
asyncio.run(main())
