"""Smoke test: load the model and click through every control, failing on any console error or warning or page error (exit code 1).

    python smoke.py            # the model (../index.html), then its Essay tab
    python smoke.py --model    # the model only
    python smoke.py --essay    # the Essay tab only

Every view with and without Moving parts only, every walkthrough step, both balances, every dial style and plate finish, the parts search and sizes in inches, every cross-section
(and its other half), GMT / Local, setting the hands with the key and by stopping, the rate book, the adjuster's bench, the display switches (Shadows off and Edges on by default), Reset display, Link, Version · what's new and About, winding with the key (the sustaining spring's close-up and load path,
shown while winding and gone after), the keyboard, and a link through the URL hash. Then the Essay tab: the model stops drawing under it, it is scrolled from top to bottom, every one of its controls is moved to both ends or pressed, the page has at most
two WebGL contexts, a link into the model opens the walkthrough and Back returns to the essay where it was, and #essay=detent opens it at that section. SwiftShader's own driver notices ('GL Driver Message', 'GPU stall') are not the page's and are
ignored. Each problem names the page and the last step done before it."""
import asyncio,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
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
    await click('#tabEssay','Essay tab',600);await click('#tabModel','3D model tab')
    # the parts list: search (a part number, a figure, nothing), sizes in inches on a card and back
    await pg.evaluate("document.querySelector('#partsDet').open=true")
    for q in['42087','fig 90','zzz','']:await pg.evaluate("q=>{const i=document.querySelector('#pSearch');i.value=q;i.dispatchEvent(new Event('input'))}",q);steps.append(f'parts search {q!r}')
    await click('#units button[data-v="in"]','sizes in inches');await pg.evaluate("location.hash='#part=pillar'");await pg.wait_for_timeout(400)
    if '3.448 in' not in await pg.evaluate("document.querySelector('#info .spec').textContent"):errs.append('the pillar plate card is not in inches')
    await click('#units button[data-v="mm"]','sizes in mm')
    for sel in['#colr','#colrSrc','#ghost','#edges','#shadows','#merge','#lbls','#rock','#latch','#spin','#snd']:await click(sel,f'{sel} on');await click(sel,f'{sel} off')
    # the tinted and ink drawings (makeInk, core.js): every view, with see-through plates, colour by part, a section and moving parts only
    for sel,nm in(('#draw','tinted drawing'),('#drawInk','ink drawing')):
        await click(sel,f'{nm} on',600)
        for v in['box','dial','movement','train','escapement','exploded','laidout','fusee','balance']:await click(f'#views button[data-v="{v}"]',f'{nm}, view {v}')
        await click('#colr');await click('#ghost',f'{nm}, colour by part, see-through');await click('#colr');await click('#ghost')
        await click('#secs button[data-v="x"]',f'{nm}, section');await click('#secs button[data-v="off"]')
        await click('#driveOn',f'{nm}, moving parts only');await click('#driveOn');await click(sel,f'{nm} off')
    # one at a time: ink over tinted takes its place
    await click('#draw');await click('#drawInk','ink drawing over the tinted one')
    if await pg.evaluate("[document.querySelector('#draw').checked,document.querySelector('#drawInk').checked].join()")!='false,true':errs.append('the tinted and ink drawings both ticked')
    await click('#drawInk')
    # edges (makeInk's lines over the normal frame; on by default except on phones): a section, see-through plates, then each drawing over it (it disables Edges) and off again
    if not await pg.evaluate("document.querySelector('#edges').checked"):errs.append('Edges not on by default')
    if await pg.evaluate("document.querySelector('#shadows').checked"):errs.append('Shadows not off by default')
    if not await pg.evaluate("document.querySelector('#merge').checked&&__dm.stats().on>0"):errs.append('Performance mode not on by default, or nothing drawn merged')
    await click('#secs button[data-v="x"]','edges, section');await click('#secs button[data-v="off"]');await click('#ghost','edges, see-through');await click('#ghost')
    for sel in('#draw','#drawInk'):await click(sel,f'edges, {sel[1:]} on');await click(sel,f'edges, {sel[1:]} off')
    if not await pg.evaluate("document.querySelector('#edges').checked&&!document.querySelector('#edges').disabled"):errs.append('Edges not restored after a drawing')
    await click('#edges','edges off',600);await click('#edges','edges on again')
    # Reset display puts the Display boxes back (Edges on, the rest off, in Dial); Link copies the address, or puts it in the address bar
    for sel in['#lbls','#colr','#rock','#spin','#ghost','#shadows','#merge']:await click(sel)
    await click('#edges');await click('#draw');await click('#dispReset','reset display',600)
    bad=await pg.evaluate("['lbls','colr','colrSrc','draw','rock','latch','spin','ghost','shadows'].filter(k=>document.querySelector('#'+k).checked).concat(document.querySelector('#edges').checked?[]:['edges']).concat(document.querySelector('#merge').checked?[]:['merge'])")
    if bad:errs.append(f'Reset display left {bad}')
    await click('#drawInk');await click('#dispReset','reset display from the ink drawing',600)
    if await pg.evaluate("document.querySelector('#drawInk').checked||!document.querySelector('#edges').checked"):errs.append('Reset display left the ink drawing on or Edges off')
    await click('#link','copy link',400)
    await click('#panelBtn','hide the panel',400)
    if await pg.evaluate("getComputedStyle(document.querySelector('#panel')).display!=='none'||document.querySelector('#stage').offsetWidth<1000"):errs.append('Hide panel left the panel or the stage narrow')
    await click('#panelBtn','show the panel',400)
    if await pg.evaluate("getComputedStyle(document.querySelector('#panel')).display==='none'"):errs.append('Show panel left the panel hidden')
    # where the view has been: Back and Forward; a part zoomed by a double-click, and back; the panel's width by keys and a double-click
    pv=lambda:pg.evaluate("document.querySelector('#views button[aria-pressed=\"true\"]')?.dataset.v")
    await click('#views button[data-v="train"]','view train');await click('#views button[data-v="escapement"]','view escapement')
    await click('#hBack','back');b1=await pv();await click('#hFwd','forward');b2=await pv()
    if(b1,b2)!=('train','escapement'):errs.append(f'Back and Forward gave {b1}, {b2}, not train, escapement')
    cc=await pg.evaluate("(()=>{const r=document.querySelector('#stage canvas').getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]})()");d0=await pg.evaluate("JSON.parse(__camInfo()).C.dist")
    await pg.mouse.dblclick(*cc);await pg.wait_for_timeout(800);steps.append('double-click a part');d1=await pg.evaluate("JSON.parse(__camInfo()).C.dist")
    if not await pg.evaluate("document.querySelector('#info').classList.contains('on')") or not d1<d0*0.95:errs.append(f'Double-click on a part: card {await pg.evaluate("document.querySelector(\'#info\').classList.contains(\'on\')")}, distance {d0:.0f} to {d1:.0f}')
    await pg.keyboard.press('Backspace');await pg.wait_for_timeout(800);steps.append('Backspace, back from the zoom')
    if abs(await pg.evaluate("JSON.parse(__camInfo()).C.dist")-d0)>2:errs.append('Backspace did not go back from the zoom')
    await pg.focus('#split');await pg.keyboard.press('ArrowLeft');await pg.wait_for_timeout(200);steps.append('panel wider');w1=await pg.evaluate("document.querySelector('#panel').offsetWidth")
    await pg.dblclick('#split');await pg.wait_for_timeout(200);steps.append('panel width reset');w2=await pg.evaluate("document.querySelector('#panel').offsetWidth")
    if(w1,w2)!=(370,350):errs.append(f'Panel width {w1}, {w2}, not 370, 350')
    await click('#speeds button[data-v="3600"]','3600x',600);await click('#speeds button[data-v="0.05"]','1/20x',600);await click('#speeds button[data-v="1"]','1x')
    # winding with the key, the spring drawn exaggerated: the close-up shows with the sustaining spring relaxed, the load path in colour; it goes 2 s (page time) after the key lets go
    await click('#ssx','exaggerate the spring')
    await click('#kwBtn','wind with the key',2500)
    if not await pg.evaluate("__lp().ph==='w'&&__lp().cu&&!document.querySelector('#cu').classList.contains('hidden')&&__mv.userData.R.ssD>0"):errs.append('winding with the key: no close-up, or the sustaining spring not relaxed')
    await click('#kwBtn','stop winding')
    try:await pg.wait_for_function("__lp().ph===''&&document.querySelector('#cu').classList.contains('hidden')",timeout=20000)
    except Exception:errs.append('the close-up stayed after winding')
    for c in['#lpOn','#cuOn']:await click(c,c+' off')
    await click('#wind','wind',800)
    if not await pg.evaluate("document.querySelector('#cu').classList.contains('hidden')"):errs.append('Close-up unticked, but it showed while winding')
    for c in['#lpOn','#cuOn','#ssx']:await click(c)   # back to the defaults
    await click('#rateZero','rate reset')
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
    for j in range(await pg.evaluate("document.querySelectorAll('#benchS input').length")):
        for end in('min','max'):
            await pg.evaluate("([j,e])=>{const i=document.querySelectorAll('#benchS input')[j];i.value=i[e];i.dispatchEvent(new Event('input'))}",[j,end]);await pg.wait_for_timeout(250)
        steps.append(f'bench setting {j+1} to both ends')
    await click('#benchReset',"bench: the model's settings");await click('#benchLook','bench: show the escapement')
    if await pg.evaluate("document.querySelector('#benchOut b').textContent")!='Every figure within the manual’s':errs.append("the model's settings don't pass on the bench")
    if not await pg.evaluate("ESC.A===255*Math.PI/180&&ESC.run.rate===0&&ESC.rateAt(ESC.A,1)===0&&Math.abs(ESC.ampAt(1)-ESC.A)<1e-9"):errs.append("the bench's reset leaves the amplitude or the escapement's rate off the model's settings")
    # swing and isochronism: each chart, the going barrel, a jolt or two (twisting if it set), the roll period
    await pg.evaluate("document.querySelector('#swingDet').open=true")
    for v in('t','a','w'):await click(f'#swK button[data-v="{v}"]',f'swing chart {v}',400)
    await click('#swGB','without the fusee off');await click('#swGB','without the fusee on')
    for i in range(3):
        await click('#jolt',f'jolt {i+1}',600)
        if await pg.evaluate("window.__H().held"):await click('#twist','twist after a jolt',1500)
    await pg.evaluate("()=>{const r=document.querySelector('#msetR');r.value=20;r.dispatchEvent(new Event('input'))}");steps.append('mainspring set 20%');await pg.wait_for_timeout(400)
    await pg.evaluate("document.querySelector('#testDet').open=true");await pg.wait_for_timeout(800);steps.append('performance test')
    if not await pg.evaluate("document.querySelectorAll('#testOut tr').length>=14"):errs.append('the performance test card is missing')
    await pg.evaluate("()=>{const r=document.querySelector('#msetR');r.value=0;r.dispatchEvent(new Event('input'))}")
    await pg.evaluate("()=>{const r=document.querySelector('#rollP');r.value=0.7;r.dispatchEvent(new Event('input'))}");await click('#rock','ship motion, roll period 0.7 s',1500);await click('#rock','ship motion off')
    await click('#speeds button[data-v="1"]','1x');await click('#stopLook','show the arm and screw')
    await click('#helpBtn','help card');await click('#helpBtn','help card closed')
    await pg.evaluate("document.querySelector('#changesDet').open=true");steps.append("what's new")
    if not await pg.evaluate("document.querySelector('#changesDet summary [data-ver]')&&document.querySelector('#changesDet').open"):errs.append("Version · what's new is missing")
    await pg.evaluate("document.querySelector('#changesDet').open=false")
    await click('#aboutBtn','About');await pg.evaluate("document.querySelector('#about').close()");steps.append('About closed')
    await pg.focus('#stage canvas')
    for k in['ArrowLeft','ArrowUp','+','-','0','1','Space']:await pg.keyboard.press(k);await pg.wait_for_timeout(150)
    await pg.keyboard.press('Space');steps.append('keyboard')
    await pg.evaluate("location.hash='#view=escapement&part=det&speed=0.05&draw=1&shadows=1'");await pg.wait_for_timeout(1200)
    st=await pg.evaluate("[document.querySelector('#views button[aria-pressed=\"true\"]')?.dataset.v,document.querySelector('#info').classList.contains('on'),document.querySelector('#spdN').value,document.querySelector('#draw').checked,document.querySelector('#shadows').checked]")
    if st!=['escapement',True,'0.05',True,True]:errs.append(f'hash link not applied: {st}')
    steps.append('hash link');await pg.close()
GLC="""(()=>{const g=HTMLCanvasElement.prototype.getContext;window.__glc=new Set();HTMLCanvasElement.prototype.getContext=function(t,...a){const c=g.call(this,t,...a);if(c&&/webgl/.test(t))window.__glc.add(this);return c;};})()"""
async def essay(b,errs,steps):
    pg=await b.new_page(viewport={"width":1100,"height":760});watch(pg,errs,'essay');await pg.add_init_script(GLC)
    await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=60000);await pg.wait_for_timeout(1500)
    await pg.evaluate("document.querySelector('#tabEssay').click()");steps.append('Essay tab');await pg.wait_for_timeout(800)
    if not await pg.evaluate("ESSAY.on()&&!document.querySelector('#essay').hidden&&document.querySelector('#tabEssay').getAttribute('aria-selected')==='true'"):errs.append('the Essay tab did not open the essay')
    r0=await pg.evaluate("__renders()");await pg.wait_for_timeout(1500)
    if await pg.evaluate("__renders()")!=r0:errs.append('the model is still drawn under the essay')
    h=await pg.evaluate("document.querySelector('#essay').scrollHeight")
    for y in range(0,h,600):await pg.evaluate(f"document.querySelector('#essay').scrollTop={y}");await pg.wait_for_timeout(250)
    await pg.wait_for_timeout(1500);steps.append('essay scrolled')
    # every control: each slider to both ends, each box and button (links apart) pressed, each figure scrolled into view first so it is built
    n=await pg.evaluate("document.querySelectorAll('#essay figure').length")
    for i in range(n):
        await pg.evaluate("i=>document.querySelectorAll('#essay figure')[i].scrollIntoView({block:'center'})",i);await pg.wait_for_timeout(600)
        await pg.evaluate("""i=>{const f=document.querySelectorAll('#essay figure')[i];
          for(const inp of f.querySelectorAll('input[type=range]'))for(const v of[inp.min,inp.max,inp.defaultValue]){inp.value=v;inp.dispatchEvent(new Event('input'));}
          for(const c of f.querySelectorAll('input[type=checkbox]')){c.click();c.click();}
          for(const bt of f.querySelectorAll('button'))bt.click();}""",i)
        await pg.wait_for_timeout(700);steps.append(f'essay figure {i+1}: every control')
    glc=await pg.evaluate("window.__glc.size")
    if glc>2:errs.append(f'{glc} WebGL contexts (the model and one for the essay expected)')
    if await pg.evaluate("[...document.querySelectorAll('#essay .e-st')].filter(s=>s._fig&&s._fig.fail).map(s=>s.id).join()"):errs.append('essay figures failed: '+await pg.evaluate("[...document.querySelectorAll('#essay .e-st')].filter(s=>s._fig&&s._fig.fail).map(s=>s.id).join()"))
    # a link into the model: the walkthrough's step 3, then Back to the essay where it was
    await pg.evaluate("document.querySelector('#essay a[href=\"#tour=3\"]').scrollIntoView({block:'center'})");await pg.wait_for_timeout(400)
    y=await pg.evaluate("document.querySelector('#essay').scrollTop");await pg.wait_for_timeout(500)
    await pg.evaluate("document.querySelector('#essay a[href=\"#tour=3\"]').click()");await pg.wait_for_timeout(1500);steps.append('essay link to the walkthrough')
    st=await pg.evaluate("[ESSAY.on(),document.querySelector('#tStep').textContent]")
    if st!=[False,'3 / 8']:errs.append(f'the link to #tour=3 gave {st}')
    await pg.go_back();await pg.wait_for_timeout(1500);steps.append('Back to the essay')
    y2=await pg.evaluate("ESSAY.on()?document.querySelector('#essay').scrollTop:-1")
    if abs(y2-y)>80:errs.append(f'Back: the essay at {y2}, not {y}')
    await pg.close()
    # straight to a section
    pg=await b.new_page(viewport={"width":1100,"height":760});watch(pg,errs,'essay, #essay=detent');await pg.goto(PAGE+'#essay=detent');await pg.wait_for_timeout(2500)
    t=await pg.evaluate("ESSAY.on()?Math.round(document.querySelector('#detent').getBoundingClientRect().top):null")
    if t is None or not 0<=t<=140:errs.append(f'#essay=detent: the section heading at {t}')
    await pg.wait_for_function("!document.querySelector('#loading')",timeout=60000);await pg.wait_for_timeout(1500)
    if not await pg.evaluate("ESSAY.on()&&location.hash.startsWith('#essay')"):errs.append('#essay=detent: the essay closed once the model loaded')
    await pg.evaluate("document.querySelector('#tabModel').click()");await pg.wait_for_timeout(2000);steps.append('back to the model tab')
    if await pg.evaluate("ESSAY.on()||location.hash.startsWith('#essay')"):errs.append('the 3D model tab left the essay open or in the address')
    await pg.close()
async def main():
    errs,steps=[],STEPS
    async with async_playwright() as p:
        b=await p.chromium.launch(args=ARGS)
        # a fresh headless Chromium on SwiftShader loses its first WebGL context a moment after creating it, whatever the page (the original model too):
        # spend that on a blank page, so the pages under test start with a context that stays
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        if '--essay' not in sys.argv:await model(b,errs,steps)
        if '--model' not in sys.argv:await essay(b,errs,steps)
        await b.close()
    print(f'{len(steps)} steps');[print(e) for e in errs]
    print('ok' if not errs else f'{len(errs)} problems');sys.exit(1 if errs else 0)
asyncio.run(main())
