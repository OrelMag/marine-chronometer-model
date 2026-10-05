"""Render a looping animated GIF of the detent escapement at work, one balance oscillation in slow motion (made for Wikipedia's Marine chronometer article).

    python gif.py                          # the preset: site-assets/escapement.gif at the repository root, its frames in r_gif_frames/ here
    python gif.py --still 0.25 0.77        # stills at those balance phases (0..1, 0 at the end of the swing), r_gif_PHASE.png, to frame the shot
    python gif.py --encode                 # the GIF again from the frames already rendered (palette, timing), without the browser
    python gif.py --look YAW PITCH DIST X Y Z --size W H --base 80 --hold 12 --delay 40 --keep bal,spr,escW,det --out NAME.gif

The model is stopped and its loop fed the escapement's own state (ESC.state, shared/escapement.js) through one 0.5 s oscillation, so each frame is the
model at that moment as the running page draws it: the balance and hairspring, the rollers, the detent and its passing spring, the escape wheel. Only
those parts are shown (--keep, isolate.py's names; "all" for the whole model), on a plain background. --under (the preset) turns the movement dial side
up, so the escapement seen from the pillar-plate side, the balance behind it, is lit by the lamp above.

Time: unlocking and impulse take 3 % of an oscillation (15 ms), the passing spring's bend on the return 2 %, so evenly spaced frames would show each in
a frame or two. The frames are spaced evenly in time (--base frames for the oscillation) except round those two moments, which are slowed --hold times
more, easing in and out; the run prints both slow-motion factors, for the file's description. The loop starts at the end of a swing, the balance at
rest, and the escape wheel ends it one tooth on: its 16 teeth repeat, so it loops without a jump (its 10-leaf pinion, behind the wheel, turns back
13.5 degrees of its 36). Frames are drawn at --ss times the size and reduced (antialiasing), then put on one palette made from all of them, without
dithering, so flat areas don't crawl from frame to frame. About 3 minutes."""
import argparse,ast,asyncio,io,json,math,pathlib
from PIL import Image,ImageChops
from playwright.async_api import async_playwright
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
HIDE="header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs,.info,.opm,#essay,.stage>*:not(canvas){display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
def css(bg):
    return (HIDE+f"html,body{{background:{bg}!important;min-height:100vh;margin:0}}"
      ".stage{position:fixed!important;inset:0!important;width:auto!important;height:auto!important;border-radius:0!important;background:transparent!important;aspect-ratio:auto!important;border:0!important;box-shadow:none!important}")
# isolate.py's KEEP: only the named parts shown (the box, gimbals and merged copies hidden), read from its source so the two stay one
KEEP=next(ast.literal_eval(n.value) for n in ast.parse((HERE/'isolate.py').read_text(encoding='utf-8')).body if isinstance(n,ast.Assign) and getattr(n.targets[0],'id','')=='KEEP')
# the escapement from the pillar-plate side, nearly square on, the balance behind it: the detent across to the right, the escape wheel above the rollers
LOOK=[4.6,1.35,90,5.5,-21,13]
FRAMES='r_gif_frames'
OUT=HERE.parents[2]/'site-assets'/'escapement.gif'   # beside the link previews; build.py copies only their .png into site/
def phases(tab,base,hold):
    """Frame phases: evenly spaced, slowed hold+1 times at the middle of each event (impulse, passing spring), a Gaussian as wide as the event round it."""
    M=len(tab);ev=[]
    for key in ('imp','pas'):
        on=[i/M for i,t in enumerate(tab) if t[key]]
        if on:ev.append(((on[0]+on[-1])/2,max(on[-1]-on[0],2/M)*0.45))
    w=[1+sum(hold*math.exp(-0.5*((((i/M-c+0.5)%1)-0.5)/s)**2) for c,s in ev) for i in range(M)]
    cum=[0];[cum.append(cum[-1]+x/M) for x in w];n=round(cum[-1]*base);out=[];j=0
    for k in range(n):
        tg=k/n*cum[-1]
        while cum[j+1]<tg:j+=1
        out.append((j+(tg-cum[j])/(cum[j+1]-cum[j]))/M)
    return out,ev
def encode(fr,a,ms,info=''):
    # one palette from every frame (each reduced), so the colours do not change between frames; no dithering, so flat areas stay still.
    # Maximum coverage, not median cut: median cut gives the few pixels of the ruby jewels no colour of their own and draws them brown
    W,H=fr[0].size;n=len(fr);cols=10;rows=(n+cols-1)//cols;sw,sh=W//2,H//2;mos=Image.new('RGB',(sw*cols,sh*rows),a.bg)
    for i,f in enumerate(fr):mos.paste(f.resize((sw,sh),Image.BILINEAR),(i%cols*sw,i//cols*sh))
    pal=mos.quantize(colors=a.colors,method=Image.Quantize.MAXCOVERAGE,dither=Image.Dither.NONE)
    q=[f.quantize(palette=pal,dither=Image.Dither.NONE) for f in fr]
    q[0].save(a.out,save_all=True,append_images=q[1:],duration=ms,loop=0,optimize=True,disposal=1)
    print(f'wrote {a.out}: {W}x{H}, {n} frames at {ms} ms, a {n*ms/1000:g} s loop{info}; {pathlib.Path(a.out).stat().st_size/1024:.0f} KB, {W*H*n/1e6:.1f} Mpx (width x height x frames)')
async def main():
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--view',default='movement',help='the view button the movement is set by (lift, turn)');ap.add_argument('--look',type=float,nargs=6,default=LOOK)
    ap.add_argument('--under',action=argparse.BooleanOptionalAction,default=True,help='the movement turned dial side up, so the pillar-plate side is lit by the lamp above')
    ap.add_argument('--keep',default='bal,spr,escW,det',help='parts shown (isolate.py names); "all" for the whole model')
    ap.add_argument('--edges',action='store_true',help="the drawing's outlines over the rendering");ap.add_argument('--bg',default='#ffffff')
    ap.add_argument('--size',type=int,nargs=2,default=(800,600),help='the GIF');ap.add_argument('--view-size',type=int,nargs=2,default=(1000,750),help='the page, cropped to the parts with --margin round them')
    ap.add_argument('--margin',type=float,default=0.05);ap.add_argument('--ss',type=int,default=2,help='the page drawn at this many pixels a CSS pixel')
    ap.add_argument('--base',type=int,default=80,help='frames for the oscillation, away from its two events');ap.add_argument('--hold',type=float,default=12,help='the events slowed this many times more')
    ap.add_argument('--delay',type=int,default=40,help='ms a frame (a multiple of 10)');ap.add_argument('--colors',type=int,default=256)
    ap.add_argument('--out',default=str(OUT));ap.add_argument('--still',type=float,nargs='+');ap.add_argument('--encode',action='store_true')
    a=ap.parse_args();W,H=a.size;VW,VH=a.view_size;fd=pathlib.Path(FRAMES)
    slow=lambda f:f*a.delay/500   # the slow-motion factor where frames come f to the oscillation
    if a.encode:
        fr=[Image.open(f).convert('RGB') for f in sorted(fd.glob('f*.png'))];encode(fr,a,a.delay);return
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":VW,"height":VH},device_scale_factor=a.ss,color_scheme='light')
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%css(a.bg))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate("(()=>{const e=document.querySelector('#shadows');if(!e.checked)e.click();})()")   # the lamp's shadows (off by default)
        await pg.evaluate("(()=>{const c=document.querySelector('#merge');if(c.checked)c.click();})()")   # every piece drawn itself, not in merged copies kept outside the movement (which the turn below would leave behind)
        await pg.evaluate("e=>{const c=document.querySelector('#edges');if(c.checked!==e)c.click();}",a.edges)
        await pg.evaluate(f"document.querySelector('#views button[data-v=\"{a.view}\"]').click()");await pg.wait_for_timeout(2500)
        if a.keep!='all':await pg.evaluate(KEEP%json.dumps(a.keep.split(',')))
        # the views lift the movement train side up and set its turn every frame; turned back just before each render, the lamp above lights the pillar-plate side
        if a.under:await pg.evaluate("()=>{const r=__r,R=r.render.bind(r);r.render=(s,c)=>{__mv.rotation.x=0;__mv.updateMatrixWorld(true);R(s,c);};}");await pg.wait_for_timeout(500)
        # the camera follows its target through the movement's turn as the loop sets it (half a turn about x): under it, the point that lands where the turned-back one will
        x,y,z=a.look[3:];await pg.evaluate(f"window.__look({a.look[0]},{a.look[1]},{a.look[2]},{x},{-y if a.under else y},{-z if a.under else z})")
        # the loop's update() takes the escapement's state from __gs while it is set; E: the beats so far, whole at the start of the loop; the swing the model runs at
        tab=await pg.evaluate("""()=>{const u=__mv.userData.update;__mv.userData.update=o=>u(window.__gs?{...o,...window.__gs}:o);
          const E0=Math.floor(__H().E??0),amp=__H().amp;window.__gp=p=>{const z=ESC.state(p,amp);window.__gs={E:E0+z.prog,th:z.th,lift:z.lift,psDef:z.psDef};};
          return Array.from({length:20000},(_,i)=>{const z=ESC.state(i/20000,amp);return{imp:z.lift>1e-9||(z.prog>0&&z.prog<1),pas:Math.abs(z.psDef)>1e-9};});}""")
        async def grab(ph):
            await pg.evaluate("p=>{__gp(p);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}",ph)
            return Image.open(io.BytesIO(await pg.screenshot(timeout=180000))).convert('RGB')
        # the crop: every pixel off the background at the four quarters of the swing, with the margin, widened to the GIF's shape
        bgc=Image.new('RGB',(1,1),a.bg).getpixel((0,0));box=None
        for q in (0,0.25,0.5,0.75):
            im=await grab(q);bb=ImageChops.difference(im,Image.new('RGB',im.size,bgc)).convert('L').point(lambda v:255*(v>6)).getbbox()
            box=bb if box is None else (min(box[0],bb[0]),min(box[1],bb[1]),max(box[2],bb[2]),max(box[3],bb[3]))
        cw,ch=(box[2]-box[0])*(1+2*a.margin),(box[3]-box[1])*(1+2*a.margin);cw,ch=max(cw,ch*W/H),max(ch,cw*H/W);cx,cy=(box[0]+box[2])/2,(box[1]+box[3])/2
        crop=(cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2);iw,ih=im.size
        if crop[0]<0 or crop[1]<0 or crop[2]>iw or crop[3]>ih:print(f'warning: the parts reach the edge of the page (crop {tuple(round(v) for v in crop)} in {iw}x{ih}): move or widen the camera')
        print(f'crop {cw:.0f}x{ch:.0f} px of the {iw}x{ih} page, {cw/W:.2f} page pixels a GIF pixel',flush=True)
        pad=math.ceil(max(0,-crop[0],-crop[1],crop[2]-iw,crop[3]-ih));crop=tuple(v+pad for v in crop)   # past the edge: the background round it
        async def frame(q):
            im=await grab(q)
            if pad:c=Image.new('RGB',(iw+2*pad,ih+2*pad),bgc);c.paste(im,(pad,pad));im=c
            return im.resize((W,H),Image.LANCZOS,box=crop)
        if a.still:
            for ph in a.still:(await frame(ph)).save(f'r_gif_{ph:g}.png');print('wrote',f'r_gif_{ph:g}.png')
        else:
            ph,ev=phases(tab,a.base,a.hold);fd.mkdir(exist_ok=True);[f.unlink() for f in fd.glob('f*.png')];fr=[]
            print(f'{len(ph)} frames; events at phase '+', '.join(f'{c:.3f} (sigma {s:.4f})' for c,s in ev),flush=True)
            for i,q in enumerate(ph):
                im=await frame(q);im.save(fd/f'f{i:03d}.png');fr.append(im)
                if i%20==0:print('frame',i,flush=True)
            encode(fr,a,a.delay,f'; {slow(a.base):g}x slower than life through the swing, {slow(a.base*(1+a.hold)):g}x at unlocking and impulse and at the passing spring')
        print('errors:',errs);await b.close()
asyncio.run(main())
