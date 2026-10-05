"""Render looping animated GIFs of the chronometer at work (made for Wikipedia's Marine chronometer article), into site-assets/ at the repository root.

    python gif.py                          # the escapement preset: site-assets/escapement.gif, its frames in r_gif_escapement/ here
    python gif.py movement                 # the whole movement, moving parts only, at real speed: site-assets/movement.gif
    python gif.py cycle                    # twelve hours with the hands, then wound back to full: site-assets/cycle.gif
    python gif.py [PRESET] --edges --out NAME.gif   # with the drawing's outlines over the rendering
    python gif.py [PRESET] --still 0.25 0.77       # stills at those beats (0..1 one oscillation, 0 at the end of the swing), r_gif_BEAT.png, to frame the shot
    python gif.py [PRESET] --encode        # the GIF again from the frames already rendered (palette, timing), without the browser
    python gif.py --look YAW PITCH DIST X Y Z --size W H --beats 4 --base 46 --hold 12 --blur 1 --delay 40 --keep bal,spr,escW,det --out NAME.gif

The model is stopped and its loop fed the escapement's own state (ESC.state, shared/escapement.js), so each frame is the model at that moment as the
running page draws it, the train turned by the beats as update() turns it. Only the parts named are shown (--keep, isolate.py's names; "all" for the
whole model; --drive for Moving parts only), on a plain background. --under turns the movement dial side up, so the escapement seen from the
pillar-plate side, the balance behind it, is lit by the lamp above.

escapement: the balance and hairspring, the rollers, the detent and its passing spring, the escape wheel, in slow motion. Unlocking and impulse take
3 % of an oscillation (15 ms), the passing spring's bend on the return 2 %, so evenly spaced frames would show each in a frame or two: the frames are
spaced evenly in time (--base frames an oscillation) except round those two moments, slowed --hold times more, easing in and out; the run prints both
slow-motion factors, for the file's description. The loop is 4 beats: the escape wheel's four spokes come round to where they started (its 10-leaf
pinion, behind it, half a leaf on).
movement: the going train, chain, fusee, barrel and escapement at real speed, 24 beats (12 s): the escape wheel, its pinion, the fourth wheel and the
seconds come round to where they started; the third wheel's spokes are 9 degrees on, the centre wheel's 1.2. Each frame is --blur renders averaged over
--shutter of its interval, as a camera's shutter takes it, so the balance is a blur as it is to the eye, not a strobe.
cycle: the moving parts with the motion work and hands, dial side up, from fully wound: twelve hours in --tl frames (the hands round once, the chain
running off the fusee onto the barrel, the up-and-down hand falling; each frame half a second's exposure, so the balance is a blur), then the key winds
it back at real speed as the page's Wind with the key does (half turns of 0.7 s, a 0.3 s pause between), the sustaining spring driving the train
meanwhile, until the stop-bar meets the winding stop; the key is held a second and let go. Twelve hours bring every wheel and hand back to where it
started and the winding the fusee, chain, barrel and up-and-down hand, so it loops without a jump. The time-lapse's frames are 302 s apart, not 300,
so the seconds hand creeps on 2 s a frame rather than standing still. --still takes seconds into the loop here.

Frames are drawn at --ss times the size and reduced (antialiasing), then put on one palette made from all of them, without dithering, so flat areas
don't crawl from frame to frame. Wikimedia animates a GIF only up to 100 megapixels (width x height x frames): the run refuses more.
On the GPU about 2 minutes for the escapement, 10 for the movement, 15 for the cycle (with --no-gpu, SwiftShader, many hours)."""
import argparse,ast,asyncio,io,json,math,pathlib,sys
import numpy as np
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
OUT=HERE.parents[2]/'site-assets'   # beside the link previews; build.py copies only their .png into site/
PRESETS={
 # the escapement from the pillar-plate side, nearly square on, the balance behind it: the detent across to the right, the escape wheel above the rollers
 'escapement':dict(look=[4.6,1.35,90,5.5,-21,13],under=True,keep='bal,spr,escW,det',drive=False,size=[640,480],beats=4,base=46,hold=12,blur=1),
 # the moving parts from the train's side: fusee and chain to the left, the barrel behind, the balance over the train wheels and the detent
 'movement':dict(look=[2.5,0.6,230,0,-19,2],under=False,keep='all',drive=True,size=[640,480],beats=24,base=12.5,hold=0,blur=8),
 # dial side up, the hands over the motion work and train, the barrel to the left, the fusee wheel to the right with the key below it, the balance at the foot
 'cycle':dict(look=[0.64,0.95,230,0,-19,2],under=True,keep='all',drive=True,mw=True,tod='10:08:00',size=[640,480],beats=0,base=0,hold=0,blur=8,tl=143,tlblur=16)}
LOOP=43200   # twelve hours: every wheel and hand of the train comes round, the hour hand once
def cycle(fph,tl,tlblur,blur,delay,hold=1.0):
    """The cycle's frames: (states, ms), a state {x: beats, n: fusee turns from full wind, w: winding, k: the key on}. Run LOOP - W - hold seconds from
    full wind in tl frames, then wind W seconds as app.js's kwStep winds (HT hours a half turn, each over 0.7 s eased by smooth(), 0.3 s between),
    W such that the winding ends at full wind; the key held hold seconds"""
    HT=0.5/fph;sm=lambda t:t*t*(3-2*t)
    def inv(f):   # smooth()'s inverse on 0..1
        lo,hi=0.0,1.0
        for _ in range(60):
            m=(lo+hi)/2
            if sm(m)<f:lo=m
            else:hi=m
        return lo
    W=4.0
    for _ in range(10):
        h0=(LOOP-W-hold)/3600;N=h0/HT;W=math.floor(N)+0.7*inv(N-math.floor(N))
    t1=LOOP-W-hold;dt=t1/tl;dly=delay/1000;fr=[]
    def run(t):return dict(x=t/0.5,n=max(0.0,t/3600)*fph,w=False,k=False)
    def wind(t):
        tw=t-t1;i=math.floor(tw);h=max(0.0,h0-HT*(i+sm(min(1.0,(tw-i)/0.7)))) if tw<W else 0.0
        return dict(x=t/0.5,n=h*fph,w=True,k=True)
    for k in range(tl):fr.append(([run(k*dt+0.5*((j+0.5)/tlblur-0.5)) for j in range(tlblur)],delay))   # half a second's exposure: one oscillation
    nb=round((W+hold)/dly)
    for k in range(nb):t=t1+k*dly;fr.append(([wind(t+dly*0.5*((j+0.5)/blur-0.5)) for j in range(blur)],delay))
    info=f'twelve hours in {tl*delay/1000:g} s ({dt:.1f} s a frame, {dt/dly:.0f}x), then {N:.2f} half turns of winding in {W:.2f} s at real speed and the key held {hold:g} s'
    return fr,info,dict(run=run,wind=wind,t1=t1,W=W)
def phases(tab,base,hold,beats):
    """Frame times in beats over the loop: evenly spaced, slowed hold+1 times at the middle of each event (impulse, passing spring), a Gaussian as wide
    as the event round it; every beat sampled alike."""
    M=len(tab);ev=[]
    for key in ('imp','pas'):
        on=[i/M for i,t in enumerate(tab) if t[key]]
        if on and hold:ev.append(((on[0]+on[-1])/2,max(on[-1]-on[0],2/M)*0.45))
    w=[1+sum(hold*math.exp(-0.5*((((i/M-c+0.5)%1)-0.5)/s)**2) for c,s in ev) for i in range(M)]
    cum=[0];[cum.append(cum[-1]+x/M) for x in w];C=cum[-1];n=round(beats*base*C);out=[]
    for k in range(n):
        tg=k/n*beats*C;b=int(tg//C);tg-=b*C;j=min(int(tg/C*M),M-1)
        while j>0 and cum[j]>tg:j-=1
        while cum[j+1]<tg:j+=1
        out.append(b+(j+(tg-cum[j])/(cum[j+1]-cum[j]))/M)
    return out,ev
def encode(fr,a,ms,info=''):   # ms: one delay, or a list a frame
    # one palette from every frame (each reduced), so the colours do not change between frames; no dithering, so flat areas stay still.
    # Maximum coverage, not median cut: median cut gives the few pixels of the ruby jewels no colour of their own and draws them brown
    W,H=fr[0].size;n=len(fr);cols=10;rows=(n+cols-1)//cols;sw,sh=W//2,H//2;mos=Image.new('RGB',(sw*cols,sh*rows),a.bg)
    for i,f in enumerate(fr):mos.paste(f.resize((sw,sh),Image.BILINEAR),(i%cols*sw,i//cols*sh))
    pal=mos.quantize(colors=a.colors,method=Image.Quantize.MAXCOVERAGE,dither=Image.Dither.NONE)
    q=[f.quantize(palette=pal,dither=Image.Dither.NONE) for f in fr]
    q[0].save(a.out,save_all=True,append_images=q[1:],duration=ms,loop=0,optimize=True,disposal=1)
    tot=sum(ms) if isinstance(ms,list) else n*ms
    print(f'wrote {a.out}: {W}x{H}, {n} frames, a {tot/1000:g} s loop{info}; {pathlib.Path(a.out).stat().st_size/1024:.0f} KB, {W*H*n/1e6:.1f} Mpx (width x height x frames)')
async def main():
    pre=next((x for x in sys.argv[1:] if x in PRESETS),'escapement');P=PRESETS[pre]
    ap=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('preset',nargs='?',choices=list(PRESETS),default='escapement')
    ap.add_argument('--view',default='movement',help='the view button the movement is set by (lift, turn)');ap.add_argument('--look',type=float,nargs=6)
    ap.add_argument('--under',action=argparse.BooleanOptionalAction,help='the movement turned dial side up, so the pillar-plate side is lit by the lamp above')
    ap.add_argument('--keep',help='parts shown (isolate.py names); "all" for the whole model')
    ap.add_argument('--drive',action=argparse.BooleanOptionalAction,help='Moving parts only: the going train, the fusee and barrel, the escapement, plates and bridges hidden')
    ap.add_argument('--mw',action=argparse.BooleanOptionalAction,default=False,help='with Moving parts only, the motion work and hands too');ap.add_argument('--tod',help='the hands set to this time (hh:mm:ss) first')
    ap.add_argument('--tl',type=int,help="cycle: the time-lapse's frames");ap.add_argument('--tlblur',type=int,help="cycle: renders averaged into a time-lapse frame")
    ap.add_argument('--edges',action='store_true',help="the drawing's outlines over the rendering");ap.add_argument('--bg',default='#ffffff')
    ap.add_argument('--size',type=int,nargs=2,help='the GIF');ap.add_argument('--view-size',type=int,nargs=2,default=(1000,750),help='the page, cropped to the parts with --margin round them')
    ap.add_argument('--margin',type=float,default=0.05);ap.add_argument('--ss',type=int,default=2,help='the page drawn at this many pixels a CSS pixel')
    ap.add_argument('--beats',type=int,help='oscillations in the loop');ap.add_argument('--base',type=float,help='frames an oscillation, away from its two events')
    ap.add_argument('--hold',type=float,help='the events slowed this many times more');ap.add_argument('--blur',type=int,help='renders averaged into a frame');ap.add_argument('--shutter',type=float,default=0.5,help="the fraction of a frame's interval they cover")
    ap.add_argument('--delay',type=int,default=40,help='ms a frame (a multiple of 10)');ap.add_argument('--colors',type=int,default=256)
    ap.add_argument('--gpu',action=argparse.BooleanOptionalAction,default=True,help="draw on the machine's GPU (--no-gpu: SwiftShader)");ap.add_argument('--out');ap.add_argument('--still',type=float,nargs='+');ap.add_argument('--encode',action='store_true')
    ap.set_defaults(**P);a=ap.parse_args();W,H=a.size;VW,VH=a.view_size
    a.out=a.out or str(OUT/f'{pre}.gif');fd=pathlib.Path(f'r_gif_{pathlib.Path(a.out).stem}')
    slow=lambda f:f*a.delay/500   # the slow-motion factor where frames come f to the oscillation
    if a.encode:
        fr=[Image.open(f).convert('RGB') for f in sorted(fd.glob('f*.png'))];encode(fr,a,a.delay);return
    async with async_playwright() as p:
        # the machine's GPU as perf.py takes it (many times faster), or SwiftShader, WebGL on the CPU, as the other tools draw (--no-gpu)
        b=await p.chromium.launch(args=(["--use-angle=default","--enable-gpu"] if a.gpu else ["--use-gl=swiftshader","--enable-unsafe-swiftshader"])+["--enable-webgl","--ignore-gpu-blocklist"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":VW,"height":VH},device_scale_factor=a.ss,color_scheme='light')
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        print('renderer:',await pg.evaluate("()=>{const g=document.createElement('canvas').getContext('webgl'),e=g&&g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'?'}"),flush=True)
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%css(a.bg))
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()")
        await pg.evaluate("(()=>{const e=document.querySelector('#shadows');if(!e.checked)e.click();})()")   # the lamp's shadows (off by default)
        await pg.evaluate("(()=>{const c=document.querySelector('#merge');if(c.checked)c.click();})()")   # every piece drawn itself, not in merged copies kept outside the movement (which the turn below would leave behind)
        await pg.evaluate("e=>{const c=document.querySelector('#edges');if(c.checked!==e)c.click();}",a.edges)
        if a.drive:await pg.evaluate("document.querySelector('#driveOn').click()")
        if a.mw:await pg.evaluate("(()=>{const c=document.querySelector('#mwOn');if(!c.checked)c.click();})()")
        if a.tod:await pg.evaluate("t=>{const i=document.querySelector('#tod');i.value=t;i.dispatchEvent(new Event('change'))}",a.tod);await pg.wait_for_timeout(500)
        await pg.evaluate(f"document.querySelector('#views button[data-v=\"{a.view}\"]').click()");await pg.wait_for_timeout(2500)
        if a.keep!='all':await pg.evaluate(KEEP%json.dumps(a.keep.split(',')))
        # the views lift the movement train side up and set its turn every frame; turned back just before each render, the lamp above lights the pillar-plate side
        if a.under:await pg.evaluate("()=>{const r=__r,R=r.render.bind(r);r.render=(s,c)=>{__mv.rotation.x=0;__mv.updateMatrixWorld(true);R(s,c);};}");await pg.wait_for_timeout(500)
        # the camera follows its target through the movement's turn as the loop sets it (half a turn about x): under it, the point that lands where the turned-back one will
        x,y,z=a.look[3:];await pg.evaluate(f"window.__look({a.look[0]},{a.look[1]},{a.look[2]},{x},{-y if a.under else y},{-z if a.under else z})")
        # the loop's update() takes the escapement's state from __gs while it is set; E: the beats so far, whole at the start of the loop; the swing the model runs at
        fph=await pg.evaluate("FUSEE_PER_HOUR")
        if pre=='cycle':cyc,cinfo,C=cycle(fph,a.tl,a.tlblur,a.blur,a.delay)
        tab=await pg.evaluate("""()=>{const u=__mv.userData.update;__mv.userData.update=o=>u(window.__gs?{...o,...window.__gs}:o);
          const E0=Math.floor(__H().E??0),amp=__H().amp;window.__gp=o=>{if(typeof o==='number')o={x:o};const k=Math.floor(o.x),z=ESC.state(o.x-k,amp);window.__gs={E:E0+k+z.prog,th:z.th,lift:z.lift,psDef:z.psDef};
            if(o.n!=null)Object.assign(window.__gs,{n:o.n,winding:o.w,keyOn:o.k});};   /* the cycle sets the wind (fusee turns from full), winding and the key too */
          return Array.from({length:20000},(_,i)=>{const z=ESC.state(i/20000,amp);return{imp:z.lift>1e-9||(z.prog>0&&z.prog<1),pas:Math.abs(z.psDef)>1e-9};});}""")
        async def grab(ph):
            await pg.evaluate("p=>{__gp(p);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}",ph)
            return Image.open(io.BytesIO(await pg.screenshot(timeout=180000))).convert('RGB')
        # the crop: every pixel off the background at the four quarters of the swing, with the margin, widened to the GIF's shape
        bgc=Image.new('RGB',(1,1),a.bg).getpixel((0,0));box=None
        for q in ([C['run'](0),C['run'](LOOP/2),C['wind'](C['t1']+1.2)] if pre=='cycle' else (0,0.25,0.5,0.75)):
            im=await grab(q);bb=ImageChops.difference(im,Image.new('RGB',im.size,bgc)).convert('L').point(lambda v:255*(v>6)).getbbox()
            box=bb if box is None else (min(box[0],bb[0]),min(box[1],bb[1]),max(box[2],bb[2]),max(box[3],bb[3]))
        cw,ch=(box[2]-box[0])*(1+2*a.margin),(box[3]-box[1])*(1+2*a.margin);cw,ch=max(cw,ch*W/H),max(ch,cw*H/W);cx,cy=(box[0]+box[2])/2,(box[1]+box[3])/2
        crop=(cx-cw/2,cy-ch/2,cx+cw/2,cy+ch/2);iw,ih=im.size
        if crop[0]<0 or crop[1]<0 or crop[2]>iw or crop[3]>ih:print(f'warning: the parts reach the edge of the page (crop {tuple(round(v) for v in crop)} in {iw}x{ih}): move or widen the camera')
        print(f'crop {cw:.0f}x{ch:.0f} px of the {iw}x{ih} page, {cw/W:.2f} page pixels a GIF pixel',flush=True)
        pad=math.ceil(max(0,-crop[0],-crop[1],crop[2]-iw,crop[3]-ih));crop=tuple(v+pad for v in crop)   # past the edge: the background round it
        async def frame(*qs):   # the renders at these beats, averaged
            acc=None
            for q in qs:
                im=await grab(q)
                if pad:c=Image.new('RGB',(iw+2*pad,ih+2*pad),bgc);c.paste(im,(pad,pad));im=c
                f=np.asarray(im.resize((W,H),Image.LANCZOS,box=crop),dtype=np.float32);acc=f if acc is None else acc+f
            return Image.fromarray(np.clip(acc/len(qs)+0.5,0,255).astype(np.uint8))
        if a.still:
            for ph in a.still:(await frame(C['run'](ph) if pre=='cycle' and ph<C['t1'] else C['wind'](ph) if pre=='cycle' else ph)).save(f'r_gif_{ph:g}.png');print('wrote',f'r_gif_{ph:g}.png')
        elif pre=='cycle':
            n=len(cyc)
            if W*H*n>1e8:sys.exit(f'{W}x{H} x {n} frames is {W*H*n/1e6:.0f} Mpx, over the 100 Wikimedia animates: fewer --tl or a smaller --size')
            fd.mkdir(exist_ok=True);[f.unlink() for f in fd.glob('f*.png')];fr=[]
            print(f'{n} frames: {cinfo}',flush=True)
            for i,(sts,ms) in enumerate(cyc):
                im=await frame(*sts);im.save(fd/f'f{i:03d}.png');fr.append(im)
                if i%20==0:print('frame',i,flush=True)
            encode(fr,a,[ms for _,ms in cyc],'; '+cinfo)
        else:
            ph,ev=phases(tab,a.base,a.hold,a.beats);n=len(ph)
            if W*H*n>1e8:sys.exit(f'{W}x{H} x {n} frames is {W*H*n/1e6:.0f} Mpx, over the 100 Wikimedia animates: fewer frames (--base) or a smaller --size')
            fd.mkdir(exist_ok=True);[f.unlink() for f in fd.glob('f*.png')];fr=[]
            print(f'{n} frames over {a.beats} beats'+('; events at phase '+', '.join(f'{c:.3f} (sigma {s:.4f})' for c,s in ev) if ev else ''),flush=True)
            for i,q in enumerate(ph):
                d=((ph[i+1] if i+1<n else a.beats+ph[0])-q)*a.shutter   # the shutter's span, centred on the frame's moment
                im=await frame(*[q+d*((j+0.5)/a.blur-0.5) for j in range(a.blur)]);im.save(fd/f'f{i:03d}.png');fr.append(im)
                if i%20==0:print('frame',i,flush=True)
            sp=f'{slow(a.base):g}x slower than life'+(f' through the swing, {slow(a.base*(1+a.hold)):g}x at unlocking and impulse and at the passing spring' if a.hold else '')
            encode(fr,a,a.delay,'; '+(sp if slow(a.base)!=1 else 'real speed'))
        print('errors:',errs);await b.close()
asyncio.run(main())
