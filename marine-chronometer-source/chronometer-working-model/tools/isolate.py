"""Isolate parts and compare them with a reference: renders only the named parts (userData.partName, as part('...') in movement.js names them),
everything else hidden (the box and gimbals too), from one or more cameras, and optionally lays each render beside a reference image (a photograph
in References/, a video frame from tools/video.py frame, a figure of the manual) in one sheet.

    python isolate.py cock                                            # four views round the part, into r_iso_cock.png
    python isolate.py cock --look 4.0 0.8 80 25 -31 12 --ref f_KLUwI2UUCMQ_41-58.png   # one view beside a reference
    python isolate.py barrelBridge,cock --plan                       # straight down from the bridge side
    python isolate.py cock --ref a.png --ref b.png --look ... --look ...   # each --ref beside the --look of the same order

--look yaw pitch dist x y z (the camera, movement mm, as views.py) can be repeated; without it the camera is aimed at the parts' centre from four
sides (--plan: from above). --crop x0 y0 x1 y1, after a --ref, crops that reference (pixels). The model is frozen as views.py freezes it. The sheet is written to
the current directory (r_iso_NAMES.png); --eval JS runs after the parts are chosen (to hide a piece that covers another, say); say what matches, what differs and how sure each reading is (CLAUDE.md, Source of truth). About 40 s."""
import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw
HERE=pathlib.Path(__file__).resolve().parent
PAGE=(HERE.parent/'index.html').as_uri()+'?snap&qa'
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading,.tabs,.modeTabs{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
KEEP="""(K=>{const mv=window.__mv;for(const c of mv.children)if(c.userData.partName)c.visible=K.includes(c.userData.partName);
  mv.traverse(o=>{if(o.parent!==mv&&o!==mv&&o.userData.partName)o.visible=K.includes(o.userData.partName);});   /* a part inside another's group (the mainspring in the fusee's): */
  const up=new Set();mv.traverse(o=>{if(o.userData.partName&&K.includes(o.userData.partName))for(let p=o.parent;p&&p!==mv;p=p.parent){p.visible=true;up.add(p);}});   /* shown, and the groups it is in, */
  for(const p of up)if(p.userData.partName&&!K.includes(p.userData.partName))for(const c of p.children)if(!up.has(c)&&!K.includes(c.userData.partName))c.visible=false;   /* those only for it (the spring's pin in the barrel's) */
  let sc=mv;while(sc.parent)sc=sc.parent;const ins=o=>{for(let p=o;p;p=p.parent)if(p===mv)return true;return false;};sc.traverse(o=>{if(o.isMesh&&!ins(o))o.visible=false;});
  const b=new THREE.Box3();for(const c of mv.children)if(c.visible&&c.userData.partName)b.expandByObject(c);const m=new THREE.Matrix4().copy(mv.matrixWorld).invert();b.applyMatrix4(m);
  const c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());return [c.x,c.y,c.z,Math.max(s.x,s.y,s.z)];})(%s)"""
def opt(k):
    out=[];a=sys.argv
    for i,x in enumerate(a):
        if x==k:out.append(a[i+1:i+1+(6 if k=='--look' else 4 if k=='--crop' else 1)])
    return out
async def main():
    if len(sys.argv)<2 or sys.argv[1].startswith('-'):sys.exit(__doc__)
    names=sys.argv[1].split(',');looks=opt('--look');refs=[]
    for i,x in enumerate(sys.argv):
        if x=='--ref':refs.append([sys.argv[i+1],None])
        elif x=='--crop' and refs:refs[-1][1]=tuple(int(v) for v in sys.argv[i+1:i+5])
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--enable-unsafe-swiftshader"])
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE);await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE)
        await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(2500)
        cx,cy,cz,sz=await pg.evaluate(KEEP%json.dumps(names))
        if '--eval' in sys.argv:await pg.evaluate(sys.argv[sys.argv.index('--eval')+1]);await pg.wait_for_timeout(300)   # e.g. hide a piece: --eval "window.__mv.getObjectByProperty('name','x').visible=false"
        if not looks:
            d=max(40,sz*2.2);looks=[[0,1.5707,d,cx,cy,cz]] if '--plan' in sys.argv else [[a,0.7,d,cx,cy,cz] for a in (0.8,2.4,3.9,5.5)]
        shots=[]
        for i,l in enumerate(looks):
            await pg.evaluate(f"window.__look({','.join(map(str,l))})");await pg.wait_for_timeout(1500)
            f=f'r_iso_{i}.png';await pg.screenshot(path=f,timeout=180000);shots.append(f)
        await b.close()
    if errs:print('page errors:',errs)
    H=420;fit=lambda im:im.resize((int(im.width*H/im.height),H));rows=[]
    for i,f in enumerate(shots):
        m=Image.open(f).convert('RGB');row=[(fit(m),'MODEL '+' '.join(map(str,looks[i])))]
        if i<len(refs):
            r=Image.open(refs[i][0]).convert('RGB')
            if refs[i][1]:r=r.crop(refs[i][1])
            row.insert(0,(fit(r),'REFERENCE '+pathlib.Path(refs[i][0]).name))
        rows.append(row)
    if not refs:rows=[sum(rows[k:k+2],[]) for k in range(0,len(rows),2)]
    W=max(sum(im.width for im,_ in r) for r in rows);S=Image.new('RGB',(W,len(rows)*(H+24)),'white');D=ImageDraw.Draw(S)
    for k,r in enumerate(rows):
        x=0
        for im,t in r:S.paste(im,(x,k*(H+24)+24));D.text((x+6,k*(H+24)+6),t,fill='black');x+=im.width
    out=f"r_iso_{'_'.join(names)}.png";S.save(out);print('wrote',out)
asyncio.run(main())
