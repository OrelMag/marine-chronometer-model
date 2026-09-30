"""Performance: what a frame costs, per view and display setting, and how often the page draws when left alone.

    python perf.py                        # the machine's GPU: Dial, Movement, Escapement and Box views
    python perf.py --views dial,train     # other views (the View buttons' data-v)
    python perf.py --throttle 4           # the CPU slowed 4x (Chrome's throttling): about a phone's
    python perf.py --sw                   # SwiftShader, WebGL on the CPU: a weak GPU (slow: use --secs 3)
    python perf.py --dpr 2 --secs 2       # a pixel ratio of 2; seconds measured per setting (default 2)

Chromium runs with vsync and its frame-rate limit off, so the frame rate is what a frame costs, not the display's rate. Frame cost is taken on ?snap&qa,
which draws every frame: for each view, as the page opens (Edges on, Shadows off), with Shadows, and with neither. Per frame: ms and fps, draw calls and
triangles over every pass (the shadow pass and Edges' passes included; __r.render wrapped, info.autoReset off), render calls, and the JavaScript time
inside them. Then the page as a visitor gets it (?qa, no input for 3 s): frames drawn a second in the Dial and Movement views (the frame skip, README).
First: time to the first frame, programs compiled and the JS heap. Nothing is written; exit code 0."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
SW='--sw' in sys.argv;THR=float(arg('--throttle',1));DPR=float(arg('--dpr',1));SECS=float(arg('--secs',2));VIEWS=arg('--views','dial,movement,escapement,box').split(',')
ARGS=(["--use-gl=swiftshader","--enable-webgl","--enable-unsafe-swiftshader"] if SW else ["--use-angle=default","--enable-gpu"])+["--ignore-gpu-blocklist","--disable-gpu-vsync","--disable-frame-rate-limit"]
INSTR="""()=>{const r=__r;r.info.autoReset=false;const R0=r.render.bind(r);window.__pf={rc:0,cpu:0};r.render=function(s,c){const t=performance.now();R0(s,c);__pf.cpu+=performance.now()-t;__pf.rc++;};
 window.__measure=ms=>new Promise(res=>{let n=0,t0=null,a={calls:0,tris:0,rc:0,cpu:0};const z=()=>{r.info.reset();__pf.rc=0;__pf.cpu=0;};
  const f=t=>{if(t0===null){t0=t;z();requestAnimationFrame(f);return;}n++;a.calls+=r.info.render.calls;a.tris+=r.info.render.triangles;a.rc+=__pf.rc;a.cpu+=__pf.cpu;z();
   if(t-t0<ms)requestAnimationFrame(f);else res({ms:(t-t0)/n,fps:n*1000/(t-t0),calls:a.calls/n,tris:a.tris/n,rc:a.rc/n,cpu:a.cpu/n});};requestAnimationFrame(f);});}"""
CK="s=>{const e=document.querySelector(s.id);if(e.checked!==s.on)e.click();}"
VIEW="v=>document.querySelector(`#views button[data-v=\"${v}\"]`).click()"
async def page(b,q):
    pg=await b.new_page(viewport={"width":1440,"height":900},device_scale_factor=DPR);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    if THR>1:await (await pg.context.new_cdp_session(pg)).send('Emulation.setCPUThrottlingRate',{'rate':THR})
    await pg.goto(PAGE+q);await pg.wait_for_function("document.querySelector('#loading')?.style.opacity==='0'",timeout=180000,polling=5)
    return pg,errs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=ARGS)
        if SW:w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # SwiftShader loses the first context (smoke.py)
        pg,errs=await page(b,'?snap&qa')
        i=await pg.evaluate("()=>{const g=__r.getContext(),e=g.getExtension('WEBGL_debug_renderer_info');return{first:performance.now(),prog:__r.info.programs.length,heap:performance.memory?performance.memory.usedJSHeapSize/1e6:0,gpu:e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'?'}}")
        print(f"{i['gpu']}\n{'SwiftShader, ' if SW else ''}CPU throttle {THR:g}x, pixel ratio {DPR:g}, 1440x900\nfirst frame {i['first']:.0f} ms, {i['prog']} programs, JS heap {i['heap']:.0f} MB\n")
        await pg.wait_for_timeout(2500)   # the opening move to the start view comes 1.1 s after the first frame
        await pg.evaluate(INSTR)
        print(f"{'view':11s} {'setting':15s} {'ms':>7s} {'fps':>7s} {'calls':>6s} {'ktris':>6s} {'renders':>7s} {'JS in render':>12s}")
        for v in VIEWS:
            await pg.evaluate(VIEW,v);await pg.wait_for_timeout(1500)
            for tag,ed,sh in(('as opened',True,False),('+ Shadows',True,True),('no Edges',False,False)):
                await pg.evaluate(CK,{'id':'#edges','on':ed});await pg.evaluate(CK,{'id':'#shadows','on':sh});await pg.wait_for_timeout(400)
                m=await pg.evaluate("ms=>__measure(ms)",SECS*1000)
                print(f"{v:11s} {tag:15s} {m['ms']:7.2f} {m['fps']:7.0f} {m['calls']:6.0f} {m['tris']/1000:6.0f} {m['rc']:7.1f} {m['cpu']:9.2f} ms")
            await pg.evaluate(CK,{'id':'#edges','on':True});await pg.evaluate(CK,{'id':'#shadows','on':False})
        await pg.close()
        pg,e2=await page(b,'?qa');errs+=e2;await pg.wait_for_timeout(2500)
        print('\nleft alone (no ?snap, no input), frames drawn a second (frames offered: the uncapped loop):')
        for v in('dial','movement'):
            await pg.evaluate(VIEW,v);await pg.wait_for_timeout(3000)
            m=await pg.evaluate("async()=>{const r0=__renders(),t0=performance.now();let f=0;await new Promise(res=>{const g=()=>{f++;if(performance.now()-t0<3000)requestAnimationFrame(g);else res();};requestAnimationFrame(g);});const s=(performance.now()-t0)/1000;return[(__renders()-r0)/s,f/s];}")
            print(f"  {v:10s} {m[0]:6.1f} drawn of {m[1]:6.0f}")
        if errs:print('page errors:',errs)
        await b.close()
asyncio.run(main())
