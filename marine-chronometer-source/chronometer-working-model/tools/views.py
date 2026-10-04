"""Before/after renders: prove a change touched only what it should.

    python views.py before                   # every view button, with and without "Moving parts only", into r_v_before_*.png
    (make the change)
    python views.py after
    python views.py --diff before after      # changed pixels per view, and r_vd_*.png with the changes in red
    python views.py close --keep tw,fw,escW --look 2.6 0.35 45 7.2 -8 16.1   # a close-up of chosen parts (yaw pitch dist x y z; movement mm)
    python views.py main --page ../../other/index.html   # the same renders from another copy of the page (a worktree of main), as CI does

The model is frozen at one escapement phase and wind state (after a moment of winding, so the fusee's angle doesn't depend on when the page ran), and the page's labels and panels are hidden, so two runs of an unchanged model
give the same pixels (a few anti-aliased edges may differ). --keep shows only the named parts (userData.partName); --look can be repeated;
--n sets the fusee turns from full wind (0 = fully wound). --page renders another copy of index.html with this script, so two commits are
compared by one set of rules (CI's views workflow renders the commit a push is based on and the push, then --diff --md writes the table)."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=pathlib.Path(sys.argv[sys.argv.index('--page')+1] if '--page' in sys.argv else HERE.parent/'index.html').resolve().as_uri()+'?snap&qa'
VIEWS=['box','dial','movement','train','escapement','laidout','fusee','balance','exploded']   # exploded last: the Moving parts only pass starts from it (its Box and Dial buttons are disabled, so their shots keep it)
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{{const mv=window.__mv;if(!mv.userData._u){{mv.userData._u=mv.userData.update;mv.userData.update=()=>{{}};}}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({{E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false}});
  u(0,true);u({n},false);}})()"""   # a moment of winding first: the fusee's ratchet then settles by the train alone, not by the time of day the page ran
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
def diff(a,b,md=False):
    import numpy as np
    from PIL import Image
    if md:print('| View | Changed px | Where (x, y) |');print('|---|---:|---|')
    for f in sorted(pathlib.Path('.').glob(f'r_v_{a}_*.png')):
        g=pathlib.Path(str(f).replace(f'r_v_{a}_',f'r_v_{b}_',1));v=f.name[len(a)+5:-4]
        if not g.exists():print(f'| {v} | no {g.name} | |' if md else f'{f.name}: no {g.name}');continue
        A=np.asarray(Image.open(f).convert('RGB'),int);B=np.asarray(Image.open(g).convert('RGB'),int);d=np.abs(A-B).max(2)>24;ys,xs=np.nonzero(d);n=int(d.sum())
        w=f"{xs.min()}-{xs.max()}, {ys.min()}-{ys.max()}" if n else ''
        print(f'| {v} | {n} | {w} |' if md else f"{v+'.png':28s} {n:7d} px"+(f"  x {xs.min()}-{xs.max()}, y {ys.min()}-{ys.max()}" if n else ''))
        if n:m=B.copy();m[d]=[255,0,0];Image.fromarray(m.astype('uint8')).save(str(f).replace(f'r_v_{a}_','r_vd_',1))
async def main():
    tag=sys.argv[1];keep=arg('--keep');looks=[sys.argv[i+1:i+7] for i,k in enumerate(sys.argv) if k=='--look']
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        # as in smoke.py: a fresh headless Chromium loses its first WebGL context, so spend it on a blank page
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)   # loaded, not a fixed wait
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE.format(n=arg('--n','2.5')))
        if looks or keep:
            await pg.evaluate("document.querySelector('#driveOn').click()");await pg.evaluate("document.querySelector('#views button[data-v=\"train\"]').click()");await pg.wait_for_timeout(2500)
            if keep:await pg.evaluate("(K=>{for(const c of window.__mv.children)if(c.userData.partName)c.visible=K.includes(c.userData.partName);})(%s)"%json.dumps(keep.split(',')))
            for i,l in enumerate(looks or [['0.75','0.42','120','0','-20','0']]):
                await pg.evaluate(f"window.__look({','.join(l)})");await pg.wait_for_timeout(1500);await pg.screenshot(path=f'r_v_{tag}_look{i}.png',timeout=180000)
        else:
            for drive in (False,True):
                if drive:await pg.evaluate("document.querySelector('#driveOn').click()")
                for v in VIEWS:
                    await pg.evaluate(f"document.querySelector('#views button[data-v=\"{v}\"]').click()");await pg.wait_for_timeout(2500)
                    await pg.screenshot(path=f"r_v_{tag}_{v}{'_drive' if drive else ''}.png",timeout=180000)
        print('page errors:',errs);await b.close()
if sys.argv[1:2]==['--diff']:diff(sys.argv[2],sys.argv[3],'--md' in sys.argv)
else:asyncio.run(main())
