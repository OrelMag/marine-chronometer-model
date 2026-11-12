"""One copy of a page against another: another commit, or another three.js (PLAN-three-upgrade.md; written for the Wempe's page on r187 against r128,
11 November 2026). The other copy is a `git archive` of the commit unpacked outside the repository (its marine-chronometer-source/ and vendor/), so both open
from disk side by side. Nothing here judges: each command prints what differs, for a person to read. Not run by ci.py or build.py.

    python pagecmp.py shots PAGE OUTDIR TAG [--shots SPEC.json] [--freeze] [--hash OUT.json] [--q "?snap&qa"] [--eval JS] [--size 1200x800] [--dpr N] [--ui]
        opens PAGE (an index.html) in the tools' Chromium (MC_GL as the other tools), prints three's revision and the console's errors and warnings, and takes
        stills OUTDIR/TAG_NAME.png as SPEC lists them: [{"name", "view": a view button's data-v, "eval": JS, "look": [yaw, pitch, dist, x, y, z], "wait": ms}, ...],
        each entry's view clicked, then its eval run, then its look set (pagecmp/states.json: every display mode, the versions, a lost WebGL context;
        pagecmp/draw.json: the tinted and ink drawing). --freeze stops the model at one moment (the Wempe's update(): 2.5 fusee turns from full wind, the
        escapement at phase 0.4), so two copies draw the same thing; --hash writes every mesh's fingerprint (vertices, triangles, distinct corners, their
        sum, volume, area) for `meshes`; --ui keeps the page's panels in the stills. About a minute a load, a few seconds a still.
    python pagecmp.py pixels DIR A B NAME[,NAME...] [--red]
        DIR/A_NAME.png against DIR/B_NAME.png: pixels past 8, 16, 24 and 48 levels of 255 (views.py counts past 24), the mean difference, the mean colour
        shift over the changed pixels and the box they lie in; --red writes DIR/d_A_B_NAME.png with the pixels past 24 in red.
    python pagecmp.py meshes A.json B.json [N]
        two --hash files, mesh by mesh in the page's own order: the same; the same solid with another triangle or vertex count or a last-digit rounding
        (as many distinct corners, their sum within 0.05, volume and area within 1e-3 and 1e-2); or different, listed (N of each kind, default 40).
    python pagecmp.py essay PAGE OUTDIR TAG
        the essay's page under Playwright's clock, paused before the page loads (Date, performance.now, timers and animation frames all its own), and a
        seeded Math.random, so two copies run the same frames: each figure scrolled into view, the clock run 1.2 s, its box photographed into
        OUTDIR/TAG_NN.png. Some figures still vary between two runs of one copy (what the clock doesn't hold: when an image or an observer answers), so
        photograph each copy two or three times and look for a pair that agrees. About 1-2 minutes.
    python pagecmp.py essaycmp DIR A B
        per figure, the pixels that differ at all and past 8 levels.
    python pagecmp.py fusee OLD.js NEW.js
        two copies of wempe/js/fuseebody.js: corners and triangles as sets, and for the triangles in one only, the planes of constant y they lie in and
        their area there (a flat face split into other triangles covers the same area).
"""
import asyncio,base64,collections,datetime,json,pathlib,re,sys
HERE=pathlib.Path(__file__).resolve().parent
def arg(k,d=None):return sys.argv[sys.argv.index(k)+1] if k in sys.argv else d
CSS=("header,.panel,.hud,.tools,.hint,.labels,.loading{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""
HASH="""(()=>{const out={};let n=0;const add=(root,tag)=>{root.updateMatrixWorld(true);root.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes.position)return;const g=o.geometry,p=g.attributes.position.array,ix=g.index?g.index.array:null,nv=p.length/3;
  const S=new Set();let sx=0,sy=0,sz=0;for(let i=0;i<nv;i++){const k=Math.round(p[i*3]*2e3)+','+Math.round(p[i*3+1]*2e3)+','+Math.round(p[i*3+2]*2e3);if(!S.has(k)){S.add(k);sx+=p[i*3];sy+=p[i*3+1];sz+=p[i*3+2];}}
  let vol=0,area=0;const nt=(ix?ix.length:nv)/3,V=i=>{const j=ix?ix[i]:i;return[p[j*3],p[j*3+1],p[j*3+2]];};
  for(let t=0;t<nt;t++){const a=V(t*3),b=V(t*3+1),c=V(t*3+2),ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],cx=uy*vz-uz*vy,cy=uz*vx-ux*vz,cz=ux*vy-uy*vx;area+=0.5*Math.hypot(cx,cy,cz);vol+=(a[0]*cx+a[1]*cy+a[2]*cz)/6;}
  const u=o.userData,k=tag+'|'+(u.part||u.partName||'')+'|'+(u.hn||'')+'|'+(n++);out[k]=[nv,nt,S.size,+sx.toFixed(2),+sy.toFixed(2),+sz.toFixed(2),+vol.toFixed(4),+area.toFixed(3),o.isInstancedMesh?o.count:0,g.type,!!g.attributes.normal,!!g.attributes.uv];});};
  add(window.__mv,'mv');if(window.__BX&&window.__BX.root)add(window.__BX.root,'bx');return out;})()"""
SEED="(()=>{let s=123456789;Math.random=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};})()"
async def launch(p):
    """the tools' Chromium, a throwaway page first to absorb the first WebGL context (a fresh headless Chromium loses it)"""
    sys.path.insert(0,str(HERE));import browser
    b=await p.chromium.launch(args=browser.ARGS);x=await b.new_page();await x.set_content('<canvas></canvas>');await x.evaluate("document.querySelector('canvas').getContext('webgl')");await x.wait_for_timeout(2000);await x.close();return b
def watch(pg,log):
    pg.on("pageerror",lambda e:log.append('PAGEERROR '+str(e)[:1200]));pg.on("console",lambda m:m.type in('error','warning') and log.append(m.type.upper()+' '+m.text[:1200]))
async def shots():
    from playwright.async_api import async_playwright
    page=pathlib.Path(sys.argv[2]).resolve().as_uri()+arg('--q','?snap&qa');out=pathlib.Path(sys.argv[3]);tag=sys.argv[4];w,h=(int(x) for x in arg('--size','1200x800').split('x'))
    spec=json.loads(pathlib.Path(arg('--shots')).read_text()) if arg('--shots') else []
    async with async_playwright() as p:
        b=await launch(p);pg=await b.new_page(viewport={"width":w,"height":h},device_scale_factor=float(arg('--dpr','1')),color_scheme='light');log=[];watch(pg,log)
        if '--ui' not in sys.argv:await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(page,timeout=180000)   # the Wempe's page takes 10-30 s to load, more beside other checks
        try:await pg.wait_for_function("!document.querySelector('#loading')",timeout=120000)
        except Exception:log.append('TIMEOUT waiting for #loading')
        await pg.wait_for_timeout(2000)
        if '--freeze' in sys.argv:await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE);await pg.wait_for_timeout(600)
        if arg('--eval'):
            try:print('eval:',json.dumps(await pg.evaluate(arg('--eval')))[:6000])
            except Exception as e:log.append('EVAL '+str(e)[:1200])
        if arg('--hash'):pathlib.Path(arg('--hash')).write_text(json.dumps(await pg.evaluate(HASH)))
        for s in spec:
            try:
                if s.get('view'):await pg.evaluate("document.querySelector('#views button[data-v=\"%s\"]').click()"%s['view']);await pg.wait_for_timeout(2200)
                if s.get('eval'):
                    r=await pg.evaluate(s['eval'])
                    if r is not None:print('shot',s['name'],'eval:',json.dumps(r)[:3000])
                if s.get('look'):await pg.evaluate("window.__look(%s)"%','.join(str(v) for v in s['look']))
                await pg.wait_for_timeout(int(s.get('wait',1500)));await pg.screenshot(path=str(out/f"{tag}_{s['name']}.png"),timeout=180000)
            except Exception as e:log.append(f"SHOT {s['name']} "+str(e)[:600])
        print('three r'+str(await pg.evaluate("THREE.REVISION")),'frames drawn',await pg.evaluate("window.__renders?window.__renders():null"))
        for l in dict.fromkeys(log):print(l)
        print(len(log),'console lines');await b.close()
def pixels():
    import numpy as np
    from PIL import Image
    d,a,b=sys.argv[2:5]
    for n in sys.argv[5].split(','):
        try:A=np.asarray(Image.open(f'{d}/{a}_{n}.png').convert('RGB'),float);B=np.asarray(Image.open(f'{d}/{b}_{n}.png').convert('RGB'),float)
        except Exception as e:print(n,'missing',e);continue
        D=np.abs(A-B).max(2);m=D>8;ys,xs=np.nonzero(D>24);sh=(B-A)[m].mean(0).round(1) if m.any() else np.zeros(3)
        print(f'{n:14s} >8 {int(m.sum()):7d}  >16 {int((D>16).sum()):7d}  >24 {int((D>24).sum()):7d}  >48 {int((D>48).sum()):6d}  mean {np.abs(A-B).mean():.3f}  shift(R,G,B) {sh}'+(f'  box x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}' if len(xs) else ''))
        if '--red' in sys.argv:o=B.copy();o[D>24]=[255,0,0];Image.fromarray(o.astype('uint8')).save(f'{d}/d_{a}_{b}_{n}.png')
def meshes():
    a=json.load(open(sys.argv[2]));b=json.load(open(sys.argv[3]));N=int(sys.argv[4]) if len(sys.argv)>4 else 40;print(len(a),len(b),'meshes')
    c=collections.Counter();ex=collections.defaultdict(list)
    for x,y in zip(a,b):
        A=a[x];B=b[y]
        if x.rsplit('|',1)[0]!=y.rsplit('|',1)[0]:print('the order differs from',x,y);break
        if A==B:c['same']+=1;continue
        if A[2]==B[2] and all(abs(A[i]-B[i])<0.05 for i in(3,4,5)) and abs(A[6]-B[6])<=1e-3+1e-6*abs(A[6]) and abs(A[7]-B[7])<=1e-2+1e-6*abs(A[7]):
            k='same solid, '+('other triangle count' if A[1]!=B[1] else 'vertex count' if A[0]!=B[0] else 'attributes' if A[10:]!=B[10:] else 'rounding')
        else:k='DIFFERENT '+('vertex set' if A[2]!=B[2] else 'volume/area')
        c[k]+=1;ex[k].append((x,A,B))
    for k,v in c.most_common():print(v,k)
    for k in ex:
        if k.startswith('DIFF') or 'count' in k:
            print('---',k)
            for e in ex[k][:N]:print(' ',e[0],e[1][:9],e[2][:9],e[1][9])
async def essay():
    from playwright.async_api import async_playwright
    page=pathlib.Path(sys.argv[2]).resolve().as_uri();out=pathlib.Path(sys.argv[3]);tag=sys.argv[4];T0=datetime.datetime(2026,11,11,12,0,0,tzinfo=datetime.timezone.utc)
    async with async_playwright() as p:
        b=await launch(p);pg=await b.new_page(viewport={"width":1100,"height":900},device_scale_factor=1,color_scheme='light');log=[];watch(pg,log)
        await pg.add_init_script(SEED);await pg.clock.install(time=T0);await pg.clock.pause_at(T0+datetime.timedelta(seconds=1))
        await pg.goto(page,timeout=180000,wait_until='load');ok=False
        for i in range(200):   # the page's own clock stepped by hand: wait_for_function would wait on its animation frames
            await pg.clock.run_for(100);await asyncio.sleep(0.15)
            if await pg.evaluate("typeof ESSAY!=='undefined'&&ESSAY.on()&&!!ESSAY.model()"):ok=True;break
        print('model built' if ok else 'MODEL NOT BUILT','after',(i+1)*100,'ms of the page\'s clock; three r'+str(await pg.evaluate("THREE.REVISION")))
        await pg.clock.run_for(2000);n=await pg.evaluate("document.querySelectorAll('#essay figure').length");k=0
        for i in range(n):
            await pg.evaluate("i=>document.querySelectorAll('#essay figure')[i].scrollIntoView({block:'center'})",i)
            for _ in range(4):await pg.clock.run_for(300);await asyncio.sleep(0.12)
            try:await pg.locator('#essay figure').nth(i).screenshot(path=str(out/f'{tag}_{i:02d}.png'),animations='disabled',timeout=20000);k+=1
            except Exception as e:print('figure',i,'not photographed:',str(e)[:120])
        print(n,'figures,',k,'photographed');print('3D figures:',await pg.evaluate("[...document.querySelectorAll('#essay .e-st')].map(s=>s.id+':'+(s._fig?(s._fig.fail?'fail':'ok'):'none')).join(' ')"))
        print(len(log),'console lines');[print(l) for l in log[:12]];await b.close()
def essaycmp():
    import numpy as np
    from PIL import Image
    d,a,b=sys.argv[2:5];fa=sorted(pathlib.Path(d).glob(a+'_*.png'));tot=[0,0,0];bad=0
    for f in fa:
        g=pathlib.Path(d)/f.name.replace(a+'_',b+'_',1)
        if not g.exists():print(f.name,'missing in',b);bad+=1;continue
        A=np.asarray(Image.open(f).convert('RGB'),int);B=np.asarray(Image.open(g).convert('RGB'),int)
        if A.shape!=B.shape:print(f.name,'sizes',A.shape,B.shape);bad+=1;continue
        D=np.abs(A-B).max(2);n0,n8=int((D>0).sum()),int((D>8).sum());tot=[tot[0]+n0,tot[1]+n8,tot[2]+D.size]
        if n0:print(f'{f.name:28s} differ {n0:7d}  >8 {n8:7d}  of {D.size}  largest {int(D.max())}');bad+=1
    print(f'{len(fa)} figures, {bad} with a difference; pixels differing {tot[0]}, past 8 levels {tot[1]}, of {tot[2]}')
def fusee():
    import numpy as np
    def load(f):
        s=open(f,encoding='utf-8').read();P=np.frombuffer(base64.b64decode(re.search(r"pos:'([^']+)'",s).group(1)),np.float32).reshape(-1,3);b=base64.b64decode(re.search(r"idx:'([^']+)'",s).group(1))
        return P,np.frombuffer(b,np.uint32).reshape(-1,3),s[:300].split('*/')[0][-100:]
    def tris(P,I):
        o=set()
        for t in P[I].tolist():
            t=[tuple(c) for c in t];k=t.index(min(t));o.add(tuple(t[k:]+t[:k]))
        return o
    area=lambda T:0.5*np.linalg.norm(np.cross(T[:,1]-T[:,0],T[:,2]-T[:,0]),axis=1)
    (P,I,h),(Q,J,g)=load(sys.argv[2]),load(sys.argv[3]);print(h.encode('ascii','replace').decode());print(g.encode('ascii','replace').decode())
    cp,cq=set(map(tuple,P.tolist())),set(map(tuple,Q.tolist()));print('corners',len(P),len(Q),'; in the first only',len(cp-cq),', in the second only',len(cq-cp))
    a,b=tris(P,I),tris(Q,J);print('triangles',len(I),len(J),'; common',len(a&b),', in the first only',len(a-b),', in the second only',len(b-a))
    for nm,S in(('first',a-b),('second',b-a)):
        if not S:continue
        T=np.array(list(S),np.float64);flat=np.ptp(T[:,:,1],axis=1)==0;A=area(T);ys=np.unique(T[flat][:,0,1])
        print(f' the {nm}\'s own: {int((~flat).sum())} not in a plane of constant y; in the planes y',{round(float(y),4):(int((T[flat][:,0,1]==y).sum()),round(float(A[flat][T[flat][:,0,1]==y].sum()),6)) for y in ys},'(triangles, mm2)')
if __name__=='__main__':
    c=sys.argv[1] if len(sys.argv)>1 else ''
    if c in('shots','essay'):asyncio.run({'shots':shots,'essay':essay}[c]())
    elif c in('pixels','meshes','essaycmp','fusee'):{'pixels':pixels,'meshes':meshes,'essaycmp':essaycmp,'fusee':fusee}[c]()
    else:print(__doc__)
