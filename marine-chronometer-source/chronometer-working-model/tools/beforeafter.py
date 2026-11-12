"""beforeafter.py: a changed part before and after, each piece shown alone (by its parts-list line, userData.hn) on two copies of the page,
found where the two differ and enlarged there.

    python beforeafter.py --model wempe --before ../../../../ba-before/marine-chronometer-source/wempe/index.html SPEC.json [--only a,b] [--out DIR]

SPEC.json is a list of {"name", "hn": [lines], "rev" (a version, default last), "i" (which of the line's pieces, default all), "ctx": [lines
shown with it, for context], "view": [yaw, pitch] (one stated direction, from "d" mm, in place of the search), "at": "JS" (a point the change is known to be, [x, y, z] in movement mm, and "d" the distance to see it from: a change too small to find), "wire": true (the triangles drawn over the shading: a change in how finely a surface is cut shows)}. Each piece is rendered by a camera of its own (the page's renderer, its scene, everything else hidden, the box too,
the model frozen as isolate.py freezes it) from eight directions round it on both pages; the direction whose pixels differ most is kept, the
largest patch of difference found and cast back onto the part, and both pages rendered again close up on that point. Each sheet,
r_ba_NAME.png in DIR (default r_ba/), has the whole piece before | after (the patch boxed in red) over the close-up before | after.
The page runs with ?snap&qa#merge=0 (the merged static pieces would hide what is hidden). About 10 s a piece. --still poses both pages by the same
numbers (geomdiff.py's pose: the balance at rest, the escape wheel at a whole tooth) where the escapement's own timing differs between them; --names BEFORE,AFTER the
sheets' labels (a release's numbers)."""
import asyncio,base64,browser,io,json,pathlib,sys
import numpy as np
from PIL import Image,ImageDraw
from scipy import ndimage
from playwright.async_api import async_playwright
import model
HERE=pathlib.Path(__file__).resolve().parent
W,H=900,700
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
if '--still' in sys.argv:sys.argv.remove('--still');FREEZE=FREEZE.replace("s=ESC.state(0.4)","s={prog:0,th:0,lift:0,psDef:0}")
NAMES=['main','branch']
if '--names' in sys.argv:_i=sys.argv.index('--names');NAMES=sys.argv[_i+1].split(',');del sys.argv[_i:_i+2]
JS=r"""(()=>{const mv=window.__mv;let sc=mv;while(sc.parent)sc=sc.parent;
  const shows=o=>{for(let q=o;q;q=q.parent)if(!q.visible)return false;return true;};
  const own=o=>{for(let q=o;q;q=q.parent)if(q.userData.hn)return q.userData.hn;return null;};
  const roots=[];sc.traverse(o=>{if(o.userData.hn&&!o.userData.sub)roots.push(o);});
  if(window.__BX&&window.__BX.showOver)window.__BX.showOver(1);   /* the carrying case too (its eye screws) */
  window.__baPick=(lines,i,ctx)=>{   /* the meshes shown: the lines' (the i-th piece only, if i is given) and the context's, as the page shows them now */
    const keep=new Set(),cx=new Set(),bx=new THREE.Box3(),inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();
    for(const[ls,set,one]of[[lines,keep,i],[ctx||[],cx,null]])for(const hn of ls){const rs=roots.filter(r=>r.userData.hn===hn&&shows(r));
      const pick=one==null?rs:rs.slice(one,one+1),cen=o=>new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
      pick.forEach(r=>r.traverse(o=>{if(o.isMesh&&shows(o)&&own(o)===hn)set.add(o);}));
      const near=pick.map(r=>{const b=new THREE.Box3().setFromObject(r);return[b.getCenter(new THREE.Vector3()),Math.max(1,b.getSize(new THREE.Vector3()).length())*1.2];});   /* a piece's other meshes (sub, often its siblings): those by the pieces chosen */
      sc.traverse(o=>{if(o.isMesh&&o.userData.hn===hn&&o.userData.sub&&shows(o)&&(one==null||near.some(([c,d])=>cen(o).distanceTo(c)<d)))set.add(o);});}
    window.__baShow=new Set([...keep,...cx]);
    for(const o of keep){o.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(o);if(!b.isEmpty())bx.union(b);}
    bx.applyMatrix4(inv);const c=bx.getCenter(new THREE.Vector3()),s=bx.getSize(new THREE.Vector3());return {n:keep.size,c:c.toArray(),s:s.toArray()};};
  window.__baCam=(yaw,pitch,dist,t)=>{const T=new THREE.Vector3(...t),cp=Math.cos(pitch),d=new THREE.Vector3(cp*Math.sin(yaw),Math.sin(pitch),cp*Math.cos(yaw));
    const P=T.clone().addScaledVector(d,dist);mv.localToWorld(P);mv.localToWorld(T);const up=new THREE.Vector3(0,0,-1).transformDirection(mv.matrixWorld);
    const c=new THREE.PerspectiveCamera(20,%W%/%H%,Math.max(0.01,dist/200),dist*20);c.position.copy(P);c.up.copy(Math.abs(Math.sin(pitch))>0.95?up:new THREE.Vector3(0,1,0).transformDirection(mv.matrixWorld));
    c.lookAt(T);c.updateMatrixWorld();c.updateProjectionMatrix();return c;};
  window.__baShot=(yaw,pitch,dist,t,wire)=>{const S=window.__baShow,vis=[];sc.traverse(o=>{if(o.isMesh||o.isLine||o.isLineSegments||o.isPoints||o.isSprite){vis.push([o,o.visible]);
      let k=o.isMesh?S.has(o):(o.parent&&S.has(o.parent));o.visible=k;if(k)for(let q=o.parent;q;q=q.parent)if(!q.visible){vis.push([q,false]);q.visible=true;}}});
    const r=window.__r,sz=r.getSize(new THREE.Vector2()),pr=r.getPixelRatio();r.setPixelRatio(1);r.setSize(%W%,%H%,false);const cc=r.getClearColor(new THREE.Color()),ca=r.getClearAlpha(),bg=sc.background;sc.background=null;r.setClearColor(0xeef0f3,1);const cm=window.__baCam(yaw,pitch,dist,t);r.render(sc,cm);if(wire){const ac=r.autoClear,om=sc.overrideMaterial;r.autoClear=false;sc.overrideMaterial=new THREE.MeshBasicMaterial({wireframe:true,color:0x101010,transparent:true,opacity:0.55,depthFunc:THREE.LessEqualDepth,polygonOffset:true,polygonOffsetFactor:-1});r.render(sc,cm);sc.overrideMaterial=om;r.autoClear=ac;}
    const url=r.domElement.toDataURL('image/png');r.setSize(sz.x,sz.y,false);r.setPixelRatio(pr);r.setClearColor(cc,ca);sc.background=bg;for(const[o,v]of vis)o.visible=v;return url;};
  window.__baHit=(yaw,pitch,dist,t,sx,sy)=>{const c=window.__baCam(yaw,pitch,dist,t),rc=new THREE.Raycaster();rc.layers.enableAll();rc.setFromCamera(new THREE.Vector2(sx/%W%*2-1,-(sy/%H%*2-1)),c);
    const h=rc.intersectObjects([...window.__baShow],false)[0];if(!h)return null;const p=h.point.clone();mv.worldToLocal(p);return p.toArray();};})()""".replace('%W%',str(W)).replace('%H%',str(H))
async def page(b,url):
    pg=await b.new_page(viewport={"width":1200,"height":800},device_scale_factor=1,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
    await pg.goto(url,timeout=180000);await pg.wait_for_function("window.__mv&&!document.querySelector('#loading')",timeout=180000);await pg.wait_for_timeout(2000)
    await pg.evaluate("(()=>{const b=document.querySelector('#speeds button[data-v=\"0\"]');if(b)b.click();})()");await pg.evaluate(JS);pg.errs=errs;return pg
def img(u):return np.asarray(Image.open(io.BytesIO(base64.b64decode(u.split(',',1)[1]))).convert('RGB')).astype(np.int16)
async def setup(pg,it):
    await pg.evaluate(f"__mv.userData.setRev({json.dumps(it.get('rev','last'))})");await pg.evaluate(FREEZE);await pg.wait_for_timeout(200)
    return await pg.evaluate("a=>__baPick(a[0],a[1],a[2])",[it['hn'],it.get('i'),it.get('ctx',[])])
def patch(a,b):
    d=(np.abs(a-b).sum(2)>40);d=ndimage.binary_opening(d,iterations=1);d=ndimage.binary_dilation(d,iterations=6);lab,n=ndimage.label(d)
    if not n:return 0,None
    sz=ndimage.sum(d,lab,range(1,n+1));k=int(np.argmax(sz))+1;ys,xs=np.nonzero(lab==k);return int(d.sum()),(xs.min(),ys.min(),xs.max(),ys.max())
async def one(P,Q,it,out):
    pb=await setup(P,it);pa=await setup(Q,it);WF=bool(it.get('wire'))
    if not pa['n']:print(it['name'],': no piece on the after page');return
    c=pa['c'];sz=max(max(pa['s']),0.5);dist=sz*3.2;best=None
    if it.get('at'):c=await Q.evaluate(it['at']);dist=it.get('d',dist)   # a place the change is known to be (a JS expression for [x, y, z], movement mm), seen from d
    if it.get('view'):dist=it.get('d',dist)   # "view": [yaw, pitch], one stated direction (a plan: pitch 1.5) in place of the search, from "d" mm
    for yaw,pitch in ([tuple(it['view'])] if it.get('view') else [(y,q) for y in (0.6,2.2,3.8,5.4) for q in (1.1,-1.1,0.35,-0.35)]):
        if True:
            if best and abs(pitch)==0.35 and best[0]>2000:continue
            ua=img(await Q.evaluate("a=>__baShot(...a)",[yaw,pitch,dist,c,WF]));ub=img(await P.evaluate("a=>__baShot(...a)",[yaw,pitch,dist,c,WF])) if pb['n'] else ua*0+255
            n,bx=patch(ub,ua)
            if best is None or n>best[0]:best=(n,bx,yaw,pitch,ub,ua)
    n,bx,yaw,pitch,ub,ua=best
    async def hit(t,d,b):   # a point on the part under the box: its centre, else the nearest of a grid in it, else the target
        cx,cy=(b[0]+b[2])/2,(b[1]+b[3])/2;pts=[(cx,cy)]+sorted([(b[0]+(b[2]-b[0])*i/6,b[1]+(b[3]-b[1])*j/6) for i in range(7) for j in range(7)],key=lambda q:(q[0]-cx)**2+(q[1]-cy)**2)
        for x,y in pts:
            h=await Q.evaluate("a=>__baHit(...a)",[yaw,pitch,d,t,x,y])
            if h:return h
        return t
    zc,zd,zn,zbx=c,dist,n,bx
    if bx is not None:
        zc=c if it.get('at') else await hit(c,dist,bx);ext=max(bx[2]-bx[0],bx[3]-bx[1])/W;zd=max(dist*min(1,ext*1.6),sz*0.05,0.4)
    if n<1500 and not it.get('at'):   # too small to see whole: search 3 x 3 tiles, each a third the field, twice, for the most changed
        zd=dist
        for lev in range(2):
            T=[]
            for i in range(3):
                for j in range(3):
                    tb=(W*i/3,H*j/3,W*(i+1)/3,H*(j+1)/3);h=await Q.evaluate("a=>__baHit(...a)",[yaw,pitch,zd,zc,(tb[0]+tb[2])/2,(tb[1]+tb[3])/2])
                    if not h:continue
                    a2=img(await Q.evaluate("a=>__baShot(...a)",[yaw,pitch,zd/3,h,WF]));b2=img(await P.evaluate("a=>__baShot(...a)",[yaw,pitch,zd/3,h,WF])) if pb['n'] else a2*0+255
                    m,_=patch(b2,a2);T.append((m,h))
            if not T or max(T)[0]==0:break
            zn,zc=max(T,key=lambda q:q[0]);zd/=3
    zb=img(await P.evaluate("a=>__baShot(...a)",[yaw,pitch,zd,zc,WF])) if pb['n'] else None;za=img(await Q.evaluate("a=>__baShot(...a)",[yaw,pitch,zd,zc,WF]))
    zn,zbx=patch(zb,za) if zb is not None else (0,None)
    im=lambda a:Image.fromarray(a.astype(np.uint8)) if a is not None else Image.new('RGB',(W,H),'white')
    S=Image.new('RGB',(2*W,2*H+60),'white');D=ImageDraw.Draw(S)
    for k,(a,t) in enumerate([(ub if pb['n'] else None,f'BEFORE ({NAMES[0]})'),(ua,f'AFTER ({NAMES[1]})'),(zb,'BEFORE close up'),(za,'AFTER close up')]):
        x,y=(k%2)*W,30+(k//2)*(H+30);S.paste(im(a),(x,y));D.text((x+8,y-22),t,fill='black')
    if bx is not None:D.rectangle([W+bx[0],30+bx[1],W+bx[2],30+bx[3]],outline='red',width=3)
    if zbx is not None:D.rectangle([W+zbx[0],60+H+zbx[1],W+zbx[2],60+H+zbx[3]],outline='red',width=3)
    D.text((8,2*H+40),f"{it['name']}: {', '.join(it['hn'])} ({it.get('rev','last')}); {'wireframe over the shading; ' if WF else ''}{n} px differ whole, {zn} close up; camera yaw {yaw} pitch {pitch}, close up {zd:.2f} mm away at {[round(v,2) for v in zc]}",fill='black')
    f=out/f"r_ba_{it['name']}.png";S.save(f);print(f"{it['name']:<16} {n:>7} px differ  -> {f}"+('' if pb['n'] else '  (not on the before page)'))
async def main():
    a=sys.argv;spec=json.loads(pathlib.Path(a[-1]).read_text(encoding='utf-8'));only=a[a.index('--only')+1].split(',') if '--only' in a else None
    out=pathlib.Path(a[a.index('--out')+1] if '--out' in a else 'r_ba');out.mkdir(exist_ok=True)
    before=pathlib.Path(a[a.index('--before')+1]).resolve().as_uri()+'?snap&qa&start=movement#merge=0';after=model.PAGE.split('#')[0]+'#merge=0'
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(3000);await w.close()   # a fresh headless Chromium loses its first WebGL context
        P=await page(b,before);Q=await page(b,after)
        for it in spec:
            if only and it['name'] not in only:continue
            await one(P,Q,it,out)
        for g,t in ((P,'before'),(Q,'after')):
            if g.errs:print(t,'page errors:',g.errs[:3])
        await b.close()
asyncio.run(main())
