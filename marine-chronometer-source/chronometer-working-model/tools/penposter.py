"""penposter.py: the poster "What makes a marine chronometer precise", the Wempe Einheits-Chronometer drawn in ink and wash (penrender.py) and lettered by hand
(Caveat, vendor/fonts), for print at A2 (the owner's choices, 2 November 2026: the Wempe, print only, committed, Caveat, no ship). In the middle the box open,
the case in its gimbals, the movement raised dial up above its bowl (its dial and pillar plate drawn faded, so what lies under them shows where the leaders end);
round it four callouts, each a heading, a few sentences and a drawing of the parts alone, lettered: the mainspring, chain and fusee; the spring detent
escapement; the balance and hairspring; the box and gimbals (the box rolled one way and the other, the case level, arrows about the case's pivots).

Every drawing is the model's own geometry: each piece is set up on the page (?qa: the view, the parts shown or faded, the movement raised, the box rolled),
its camera read off it and drawn by penrender.py with that camera at the piece's size on the poster, so a label's anchor, found on the page by the page's own
pick (the first part hit that isn't drawn faded must be the one named), falls on its part in the drawing; each drawing's outline is checked against the
page's (their overlap, IoU, at least MINIOU). Every sentence is in TEXT with its sources (the Wempe README, References/wempe/, the essay where it speaks of
the Wempe). Fails (exit 1) if a label's part isn't hit where its leader ends, or a drawing parts from the page's.

    python penposter.py --glb r_wempe.glb --preview            # the page's own renders in place of the drawings: the layout in a few minutes
    python penposter.py --glb r_wempe.glb [--scale 0.5] [OUT]  # the poster: OUT/penposter.png (default r_poster/), A2 at 300 dpi; --scale draws the pieces smaller first
    python penposter.py --recompose [OUT]                      # the last run's drawings laid out again (the text or layout changed), a few seconds

Export the model first (gltf_check.py --model wempe). About 1-2 minutes on the page, then Blender: about an hour at full size."""
import ast,asyncio,json,math,pathlib,subprocess,sys
if '--model' not in sys.argv:sys.argv+=['--model','wempe']
import browser,model
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw,ImageFont
sys.stdout.reconfigure(encoding='utf-8')
HERE=pathlib.Path(__file__).resolve().parent;ROOT=model.DIR.parents[1]
_O={k:sys.argv[sys.argv.index(k)+1] for k in('--glb','--scale','--model') if k in sys.argv};PREVIEW,RECOMP='--preview' in sys.argv,'--recompose' in sys.argv
_A=[a for a in sys.argv[1:] if not a.startswith('--') and a not in _O.values()];OUT=pathlib.Path(_A[0] if _A else HERE/'r_poster').resolve()
GLB=pathlib.Path(_O.get('--glb',HERE/'r_wempe.glb')).resolve();K=float(_O.get('--scale',1))
FONT=ROOT/'vendor/fonts/Caveat-wght.ttf';MINIOU=0.9
# laidout.py's page set-up, taken from its source (importing it would run it): the page's chrome hidden, the rest state of the export, a part set alone
_L={n.targets[0].id:n for n in ast.parse((HERE/'laidout.py').read_text(encoding='utf-8')).body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name)}
_F={n.name:n for n in ast.parse((HERE/'laidout.py').read_text(encoding='utf-8')).body if isinstance(n,ast.FunctionDef)}
_ns={'json':json};exec(compile(ast.Module([_L[k] for k in('CSS','PFREEZE','ISOL')]+[_F['glbstart']],[]),'laidout.py','exec'),_ns)
CSS,PFREEZE,ISOL,glbstart=_ns['CSS'],_ns['PFREEZE'],_ns['ISOL'],_ns['glbstart']

# ---- the poster's pieces: each a page set-up (the view; the movement raised, mm; the box rolled, rad; the parts alone and faded), its camera (yaw, pitch
# in the page's world; dist mm, or None to frame the parts alone; target in the movement's frame), its size on the poster (px at 300 dpi), the rig's controls
# (penrender.py) and its labels (text, the part or piece, the side the label goes: l, r, t, b)
RAISE=120;ROLL=0.26   # the movement 120 mm over its seat (clear of the bezel), the box rolled 15° each way (gimbals.js's working seas reach 14°)
PIECES=[
  dict(name='centre',view='case',size=(2900,2700),cam=(0.55,0.6,700,(0,-RAISE*0.5,0)),fov=20,mvup=RAISE,ghost=['dial','pillarPlate','lowerCock','topPlate','ring'],ctl={},alone=False,
       leaders=[('1','fusee'),('2','escapeWheel'),('3','balance'),('4','gimbalRing')]),
  dict(name='fusee',view='movement',size=(1500,980),cam=(0.95,0.42,None,None),fov=20,show=['barrel','barrelArbor','mainspring','chain','fusee','setupRatchet','fuseeWheel'],
       ghost=['barrel'],ctl={'lift':1},alone=True,
       labels=[('barrel','barrel.drum','r'),('mainspring','mainspring','t'),('chain','chain','b'),('fusee','fusee.body','l')]),
  dict(name='escapement',view='movement',size=(1500,980),cam=(2.75,0.55,None,None),fov=20,show=['escapeWheel','detent','rollers'],ghost=[],ctl={'lift':1},alone=True,
       labels=[('escape wheel','escapeWheel.wheel','t'),('detent','detent.detent','b'),('gold spring','detent.gold','r'),('impulse roller','rollers.impulse','l')]),
  dict(name='balance',view='movement',size=(1500,980),cam=(-2.3,0.5,None,None),fov=20,show=['balance','hairspring','stud'],ghost=[],ctl={'lift':1},alone=True,
       labels=[('cut bimetallic rim','balance.rim','l'),('masses','balance.masses','t'),('hairspring','hairspring.spring','r')]),
  dict(name='rollL',view='case',size=(820,900),cam=(0.0,0.85,700,(0,-12,0)),fov=20,roll=ROLL,ghost=[],ctl={'roll':ROLL},alone=False,labels=[]),
  dict(name='rollR',view='case',size=(820,900),cam=(0.0,0.85,700,(0,-12,0)),fov=20,roll=-ROLL,ghost=[],ctl={'roll':-ROLL},alone=False,labels=[('box','box','r'),('gimbal ring','gimbalRing','r'),('case','bowl','r')]),
]
# ---- the text, each with its sources
TITLE='What makes a marine chronometer precise'
SUB='The Wempe Einheits-Chronometer, drawn from its working model: every line is the model’s, built from Wempe’s works drawings'
TEXT={   # number: (heading, sentences, sources)
 '1':('An even pull: the fusee',
      'A mainspring pulls hardest fully wound. A fine steel chain carries its pull to the fusee, a grooved cone: wound up, the chain pulls on the cone’s narrow end, and as the spring weakens it pulls at larger and larger radii, so the force reaching the train stays nearly even. 8¾ turns of the fusee run the Wempe its 56 hours.',
      'essay, "Constant force"; Wempe README (05 06_20: 8.75 turns, the dial\'s 56 h)'),
 '2':('Touching the balance as little as it can',
      'The detent, a slender blade on a thin spring, holds the escape wheel, 15 teeth and 14 mm across. Swinging one way, the balance’s discharge stone lifts it through the gold spring; a tooth then drives the impulse roller, and the detent springs back to lock the next. Swinging back, the gold spring just bends aside: the balance swings almost free.',
      'essay, "The detent" (the Wempe\'s, its drawing 05 04_1)'),
 '3':('Heat and the balance',
      'Warmed, a steel spring weakens and a balance grows, and both slow the clock. The Wempe’s rim is nickel steel and brass, cut through at 90° from the arm: brass expands more, so each quarter’s free end curls inward, drawing mass toward the axis. The brass masses’ place on the rim sets how much.',
      'essay, "Heat"; Wempe README (05 03 01-1: nickel steel and brass, the cuts at 90° from the arm, four brass masses)'),
 '4':('Level on a rolling ship',
      'The case hangs in a ring pivoted in the box, the ring on pivots at right angles to the case’s. Its weight hangs low under the pivots, so it stays level while the box rolls and pitches round it: its own swing takes under a second, a ship’s roll ten or more.',
      'essay, "Level on a moving ship"; Wempe README (massprops: the centre of gravity 7-14 mm under the pivots and the case\'s period 0.665-0.85 s, as the bowl\'s material is read); gimbals.js (merchant ships\' roll 10-30 s)')}
FOOT='Sources: Wempe’s works drawings (dg-chrono.de) and the working model at marinechronometermodel.com, where each part can be turned, taken apart and set running.'

def font(sz,w=400):
    f=ImageFont.truetype(str(FONT),sz);f.set_variation_by_axes([w]);return f

# ---- on the page
POSE="""((o)=>{const B=__BX,mv=__mv;
  if(o.mvup){const p=mv.position,y=p.y+o.mvup;try{delete p.y}catch(e){}p.y=y;Object.defineProperty(p,'y',{get:()=>y,set(){},configurable:true});}   /* the movement raised as it stands (the case views' tick sets its height each frame) */
  if(o.roll!=null){const r=B.root.rotation;r.set(0,0,o.roll,'ZYX');r.set=function(){return this;};B.ring.rotation.x=0;
    const b=B.bowl.rotation;b.z=-o.roll;Object.defineProperty(b,'z',{get(){return this._z},set(){},configurable:true});}   /* the box rolled, the ring with it, the case kept level (rig.py's roll) */
  B.root.updateMatrixWorld(true);})"""
UNPOSE="""(()=>{const B=__BX,mv=__mv,p=mv.position;const y=p.y;delete p.y;p.y=y;const r=B.root.rotation;delete r.set;r.set(0,0,0,'ZYX');const b=B.bowl.rotation;const z=b.z;delete b.z;b.z=0;})()"""
# the parts' anchors: each key's meshes shown, a grid over their box on the screen cast through the page's camera, the first hit not drawn faded (ghost)
# kept if it is one of them; the hit nearest their middle is the anchor
ANCH=r"""((keys,ghost)=>{const mv=__mv,root=__BX.root,ci=JSON.parse(__camInfo()),W=ci.W,H=ci.Hh,cam=new THREE.PerspectiveCamera(ci.fov,W/H,1,9000);
  cam.position.set(...ci.pos);cam.lookAt(new THREE.Vector3(...ci.tgt));cam.updateMatrixWorld();cam.updateProjectionMatrix();
  const sh=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;},M=[];root.traverse(o=>{if(o.isMesh&&sh(o))M.push(o);});
  const pOf=o=>{for(;o;o=o.parent)if(o.userData&&o.userData.partName)return o.userData.partName;return null;},kOf=m=>[m.userData.pk,m.userData.part||pOf(m)];
  const faded=m=>{const[pk,p]=kOf(m);return ghost.includes(p)||ghost.includes(pk)||(m.material.transparent&&m.material.opacity<0.5);};
  const rc=new THREE.Raycaster(),v=new THREE.Vector3(),out={};
  for(const key of keys){const S=M.filter(m=>kOf(m).includes(key)),set=new Set(S);if(!S.length){out[key]={n:0,hits:0};continue;}
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const m of S){const P=m.geometry.attributes.position,st=Math.max(1,Math.floor(P.count/300));
      for(let i=0;i<P.count;i+=st){v.fromBufferAttribute(P,i).applyMatrix4(m.matrixWorld).project(cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
    const hs=[],N=40,blk={};for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const x=x0+(x1-x0)*i/N,y=y0+(y1-y0)*j/N;if(x<1||y<1||x>W-1||y>H-1)continue;
      rc.setFromCamera({x:x/W*2-1,y:-(y/H*2-1)},cam);const h=rc.intersectObjects(M,false).find(h=>!faded(h.object)||set.has(h.object));if(h&&set.has(h.object))hs.push([x,y]);else if(h){const q=kOf(h.object)[1]||'?';blk[q]=(blk[q]||0)+1;}}
    let a=null;if(hs.length){const cx=hs.reduce((s,h)=>s+h[0],0)/hs.length,cy=hs.reduce((s,h)=>s+h[1],0)/hs.length;a=hs.reduce((p,h)=>Math.hypot(h[0]-cx,h[1]-cy)<Math.hypot(p[0]-cx,p[1]-cy)?h:p);}
    out[key]={n:S.length,hits:hs.length,at:a,box:[x0,y0,x1,y1],blocked:Object.entries(blk).sort((a,b)=>b[1]-a[1]).slice(0,4)};}
  return out;})"""
# a point of the box's frame on the screen: the gimbal centre (the bowl's origin, where its pivots' line crosses the ring's) and its pivots' line
GIMC=r"""(()=>{const B=__BX,ci=JSON.parse(__camInfo()),W=ci.W,H=ci.Hh,cam=new THREE.PerspectiveCamera(ci.fov,W/H,1,9000);cam.position.set(...ci.pos);cam.lookAt(new THREE.Vector3(...ci.tgt));cam.updateMatrixWorld();cam.updateProjectionMatrix();
  const p=v=>{v.project(cam);return[(v.x+1)/2*W,(1-v.y)/2*H];};B.root.updateMatrixWorld(true);const c=B.bowl.getWorldPosition(new THREE.Vector3());
  const ax=new THREE.Vector3(0,0,60).applyQuaternion(B.bowl.parent.getWorldQuaternion(new THREE.Quaternion()));const up=B.root.localToWorld(new THREE.Vector3(0,150,0));return{c:p(c.clone()),a:p(c.clone().add(ax)),b:p(c.clone().sub(ax)),tip:p(up),r:B.root.rotation.z};})()"""

async def page(shots):
    """each piece set up on the page, its camera, its render and the page without it (for its outline), its anchors"""
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(2000);await w.close()
        ctx=await b.new_context(viewport={'width':800,'height':800},device_scale_factor=2,color_scheme='light');pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(model.PAGE+'#merge=0',wait_until='domcontentloaded',timeout=180000);await pg.wait_for_function("!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");st=glbstart(GLB);await pg.evaluate(PFREEZE+"(%r,%r)"%(st['E'],st['hours']))
        for S in shots:
            await pg.set_viewport_size({'width':S['size'][0]//2,'height':S['size'][1]//2});await pg.evaluate("document.querySelector('#views button[data-v=\"%s\"]').click()"%S['view']);await pg.wait_for_timeout(3500)
            await pg.evaluate(POSE+"(%s)"%json.dumps({'mvup':S.get('mvup'),'roll':S.get('roll')}));await pg.wait_for_timeout(600)
            yaw,pitch,dist,tgt=S['cam']
            if S.get('show'):
                q=await pg.evaluate(ISOL+"(%s,%s)"%(json.dumps(S['show']),json.dumps(S['ghost'])));dist=q['r']/math.sin(math.radians(S['fov']/2))*1.12;tgt=q['c']
            await pg.evaluate(f"window.__cam({yaw},{pitch},{dist},{S['fov']});window.__look({yaw},{pitch},{dist},{tgt[0]},{tgt[1]},{tgt[2]})");await pg.wait_for_timeout(2500)
            if S.get('ghost') and not S.get('show'):   # faded on the page too (as its see-through views fade parts), so the page's render and pick are the drawing's
                await pg.evaluate("(g=>{__mv.traverse(o=>{if(!o.isMesh)return;let q=o;while(q&&!q.userData.partName)q=q.parent;if(q&&g.includes(q.userData.partName)){o.userData._m=o.material;o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.3;o.material.depthWrite=false;}});})(%s)"%json.dumps(S['ghost']))
                await pg.wait_for_timeout(800)
            S['page']=json.loads(await pg.evaluate("__camInfo()"))
            # the canvas itself (the page keeps its stage within its aspects: the centre's 1450 x 1350 viewport drew 1450 x 960), its size the drawing's
            cr=await pg.evaluate("(()=>{const r=__r.domElement.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()");S['size']=[round(2*cr['width']),round(2*cr['height'])]
            raw=OUT/f"pg_{S['name']}.png";bg=OUT/f"pg_{S['name']}_bg.png";await pg.screenshot(path=str(raw),clip=cr)
            await pg.evaluate("__BX.root.visible=false");await pg.wait_for_timeout(500);await pg.screenshot(path=str(bg),clip=cr);await pg.evaluate("__BX.root.visible=true")
            keys=[k for _,k in S.get('leaders',[])]+[k for _,k,_ in S.get('labels',[])]
            S['anch']=await pg.evaluate(ANCH+"(%s,%s)"%(json.dumps(keys),json.dumps(S.get('ghost',[]))))
            for a in S['anch'].values():   # the page's anchors are in CSS pixels, its screenshots at twice that
                if a.get('at'):a['at']=[2*v for v in a['at']]
                if a.get('box'):a['box']=[2*v for v in a['box']]
            if S.get('roll') is not None:S['gim']={k:([2*v for v in x] if isinstance(x,list) else x) for k,x in (await pg.evaluate(GIMC)).items()}
            if S.get('ghost') and not S.get('show'):await pg.evaluate("__mv.traverse(o=>{if(o.userData._m){o.material=o.userData._m;delete o.userData._m;}})")
            if S.get('show'):await pg.evaluate(ISOL+"(null,null)")
            await pg.evaluate(UNPOSE);S['src']=[str(raw),str(bg)]
        await b.close()
        if errs:sys.exit('page errors: '+'; '.join(errs))

def mask(im,bg,thr=14):
    import numpy as np
    a=np.asarray(im.convert('RGB')).astype(int);b=np.asarray(bg.convert('RGB')).astype(int) if not isinstance(bg,tuple) else np.array(bg)[None,None,:]
    return np.abs(a-b).max(2)>thr

def draw(shots):
    """each piece drawn by penrender.py with its page camera, at its size (--scale smaller, then scaled up)"""
    J=[dict(name=S['name'],page=S['page'],ctl=S['ctl'],alone=S['alone'],size=[round(S['size'][0]*K),round(S['size'][1]*K)],mvup=S.get('mvup'),
            **({'show':{'parts':S['show']}} if S.get('show') else {}),ghost={'parts':S.get('ghost',[])}) for S in shots]
    js=OUT/'penposter_shots.json';js.write_text(json.dumps(J),encoding='utf-8')
    r=subprocess.run([sys.executable,str(HERE/'penrender.py'),'--model','wempe','--glb',str(GLB),'--shots',str(js),'--flat','--size','800x800','--out',str(OUT)])
    if r.returncode:sys.exit('penrender.py failed')
    for S in shots:S['pen']=str(OUT/f"pen_wempe_{S['name']}.png")

def compose(shots,fails):
    import numpy as np
    W,H=7016,4961   # A2 landscape at 300 dpi
    P={S['name']:S for S in shots};face={}
    for S in shots:   # each piece: the drawing (or the page's render), its outline against the page's, cropped to what it draws
        pg=Image.open(S['src'][0]).convert('RGB');bgp=Image.open(S['src'][1]).convert('RGB');mp=mask(pg,bgp)
        if PREVIEW:im=pg;mi=mp
        else:
            im=Image.open(S['pen']).convert('RGB').resize(pg.size,Image.LANCZOS);mi=mask(im,im.getpixel((3,3)))
            # each outline within a pen stroke of the other (the ink's heavy contour, about 0.5 % of the width, widens what it draws): the share of the drawing
            # on the page's render grown by that, and of the page's on the drawing's
            from scipy.ndimage import binary_dilation
            r=max(3,round(0.006*pg.width));st=np.ones((2*r+1,2*r+1),bool);a=(mi&binary_dilation(mp,st)).sum()/max(1,mi.sum());c=(mp&binary_dilation(mi,st)).sum()/max(1,mp.sum())
            iou=min(a,c);S['iou']=float(iou);print(f"  {S['name']:11} the drawing on the page's outline {a:.3f}, the page's on the drawing's {c:.3f} (within {r} px)")
            if iou<MINIOU:fails.append(f"{S['name']}: the drawing parts from the page's render ({iou:.2f} within a stroke)")
        ys,xs=np.nonzero(mp|mi);pad=30;x0,y0,x1,y1=max(0,xs.min()-pad),max(0,ys.min()-pad),min(pg.width,xs.max()+pad),min(pg.height,ys.max()+pad)
        face[S['name']]=(im.crop((x0,y0,x1,y1)),(x0,y0))
    BG=Image.open(shots[0]['pen']).convert('RGB').getpixel((3,3)) if not PREVIEW else (246,241,230)
    C=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(C);INK=(52,38,28);RED=(150,40,30);BL=(40,80,150)
    d.text((W//2,150),TITLE,font=font(230,700),fill=INK,anchor='mt');d.text((W//2,420),SUB,font=font(88,400),fill=INK,anchor='mt')
    # the centre
    cim,(cx0,cy0)=face['centre'];k=min(2900/cim.width,3900/cim.height);cim=cim.resize((round(cim.width*k),round(cim.height*k)),Image.LANCZOS)
    CX,CY=(W-cim.width)//2,640+(H-640-260-cim.height)//2;C.paste(cim,(CX,CY))
    def place(S,key,k,off,org):
        a=S['anch'].get(key,{})
        if not a or not a.get('at'):fails.append(f"{S['name']}: {key} not hit where its label would point");return None
        return (org[0]+(a['at'][0]-off[0])*k,org[1]+(a['at'][1]-off[1])*k)
    # ---- no line crosses another: each callout's labels laid out by trying every side (and order along a side) for each and keeping the layout whose
    # leaders cross no other leader nor run through another label, with the largest drawing and the shortest leaders; the callouts put in the four
    # places in the order whose leaders to the centre cross nowhere (the owner, 3 November 2026: labels and callouts not crossing each other)
    import itertools
    def cross(a,b,c,e):   # segments ab and ce cross (touching at an end not counted)
        o=lambda p,q,r:(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])
        if max(a[0],b[0])<min(c[0],e[0]) or max(c[0],e[0])<min(a[0],b[0]) or max(a[1],b[1])<min(c[1],e[1]) or max(c[1],e[1])<min(a[1],b[1]):return False
        d1,d2,d3,d4=o(c,e,a),o(c,e,b),o(a,b,c),o(a,b,e);return d1*d2<0 and d3*d4<0
    def hitbox(a,b,bb,pad=6):   # segment ab runs through box bb
        x0,y0,x1,y1=bb[0]-pad,bb[1]-pad,bb[2]+pad,bb[3]+pad
        if x0<=a[0]<=x1 and y0<=a[1]<=y1 or x0<=b[0]<=x1 and y0<=b[1]<=y1:return True
        return any(cross(a,b,p,q) for p,q in (((x0,y0),(x1,y0)),((x1,y0),(x1,y1)),((x1,y1),(x0,y1)),((x0,y1),(x0,y0))))
    def solve(S,im,off,f,room,sides='lrtb',gap=84):
        """the drawing's place and scale in room and each label's place: (im2, ox, oy, k, [(text, anchor, text xy, text anchor, leader start, text box)]), or None"""
        meas=lambda t:d.textlength(t,font=f);best=None;Ls=S['labels']
        for asg in itertools.product(*[sides]*len(Ls)):
            wl=lambda s:max([meas(t) for (t,_,_),a in zip(Ls,asg) if a==s]+[0])
            mL=round(wl('l')+90) if 'l' in asg else 0;mR=round(wl('r')+90) if 'r' in asg else 0;mT=100 if 't' in asg else 0;mB=100 if 'b' in asg else 0
            rw,rh=room[2]-room[0]-mL-mR,room[3]-room[1]-mT-mB
            if rw<200 or rh<200:continue
            k=min(rw/im.width,rh/im.height);w2,h2=round(im.width*k),round(im.height*k);ox,oy=room[0]+mL+(rw-w2)//2,room[1]+mT+(rh-h2)//2
            Q=[]
            for (t,key,_),s in zip(Ls,asg):
                a=S['anch'].get(key,{})
                if not a.get('at'):return None
                Q.append((t,s,(ox+(a['at'][0]-off[0])*k,oy+(a['at'][1]-off[1])*k)))
            groups={}
            for q in Q:groups.setdefault(q[1],[]).append(q)
            for orders in itertools.product(*[itertools.permutations(g) for g in groups.values()]):
                P=[];ok=True
                for g in orders:
                    s=g[0][1];hi=room[3]-30 if s in 'lr' else room[2]-20
                    sep=lambda m:gap if s in 'lr' else meas(g[m-1][0])/2+meas(g[m][0])/2+60
                    vs=[];last=-1e9
                    for m,(t,_,q) in enumerate(g):   # along the side in this order, each as near its anchor as the last allows
                        v=q[1] if s in 'lr' else q[0];v=max(v,last+(sep(m) if m else 0));vs.append(v);last=v
                    if vs and vs[-1]>hi:   # pushed back from the far end
                        vs[-1]=hi
                        for m in range(len(vs)-2,-1,-1):vs[m]=min(vs[m],vs[m+1]-sep(m+1))
                    for (t,_,q),v in zip(g,vs):
                        tx,ty,an={'l':(ox-30,v,'rm'),'r':(ox+w2+30,v,'lm'),'t':(v,oy-16,'mb'),'b':(v,oy+h2+16,'mt')}[s]
                        bb=d.textbbox((tx,ty),t,font=f,anchor=an)
                        if bb[0]<room[0]-20 or bb[2]>room[2]+20 or bb[1]<room[1]-10 or bb[3]>room[3]+10:ok=False
                        st={'l':(bb[2]+10,ty),'r':(bb[0]-10,ty),'t':((bb[0]+bb[2])/2,bb[3]+6),'b':((bb[0]+bb[2])/2,bb[1]-6)}[s]
                        P.append((t,q,(tx,ty),an,st,bb))
                if not ok:continue
                R=range(len(P))
                if any(cross(P[m][4],P[m][1],P[n][4],P[n][1]) for m in R for n in R if m<n):continue
                if any(hitbox(P[m][4],P[m][1],P[n][5]) for m in R for n in R if m!=n):continue
                if any(P[m][5][0]<P[n][5][2] and P[n][5][0]<P[m][5][2] and P[m][5][1]<P[n][5][3] and P[n][5][1]<P[m][5][3] for m in R for n in R if m<n):continue
                L=sum(math.dist(p[4],p[1]) for p in P);sc=L/1000-3*(w2*h2)/((room[2]-room[0])*(room[3]-room[1]))
                if best is None or sc<best[0]:best=(sc,(w2,h2,ox,oy,k,P))
        if best is None:return None
        w2,h2,ox,oy,k,P=best[1];return im.resize((w2,h2),Image.LANCZOS),ox,oy,k,P
    def put(name,res,f):
        if res is None:fails.append(f"{name}: no layout of its labels without a crossing");return
        for t,q,(tx,ty),an,st,_ in res[4]:d.line([st,q],fill=RED,width=4);d.ellipse([q[0]-9,q[1]-9,q[0]+9,q[1]+9],fill=RED);d.text((tx,ty),t,font=f,fill=RED,anchor=an)
    BW,BH=1960,2000;SLOT=[(90,640),(W-90-BW,640),(90,640+BH+120),(W-90-BW,640+BH+120)]   # top left, top right, bottom left, bottom right: read in that order
    S=P['centre'];kk=cim.width/face['centre'][0].width;LQ={}
    for n,key in S['leaders']:
        a=S['anch'].get(key,{})
        if not a.get('at'):fails.append(f"centre: {key} not hit where leader {n} ends");continue
        LQ[n]=(CX+(a['at'][0]-cx0)*kk,CY+(a['at'][1]-cy0)*kk)
    def curve(slot,q):   # from the box's inner edge, level with its anchor as far as the box allows, bowed a little
        x,y=SLOT[slot];sx=x+BW if x<W/2 else x;sy=min(max(q[1],y+260),y+BH-260);mx,my=(sx+q[0])/2,(sy+q[1])/2-120
        return [((1-t)**2*sx+2*(1-t)*t*mx+t*t*q[0],(1-t)**2*sy+2*(1-t)*t*my+t*t*q[1]) for t in [i/40 for i in range(41)]]
    best=None
    for perm in itertools.permutations(range(4)):   # perm[i]: the place of callout i+1
        cv={n:curve(perm[int(n)-1],q) for n,q in LQ.items()}
        if any(cross(a,b,c,e) for n1,n2 in itertools.combinations(cv,2) for a,b in zip(cv[n1],cv[n1][1:]) for c,e in zip(cv[n2],cv[n2][1:])):continue
        L=sum(math.dist(a,b) for c in cv.values() for a,b in zip(c,c[1:]))
        if best is None or L<best[0]:best=(L,perm,cv)
    if best is None:fails.append('centre: no order of the callouts whose leaders cross nowhere');perm=(0,1,2,3);cv={n:curve(perm[int(n)-1],q) for n,q in LQ.items()}
    else:_,perm,cv=best
    hf,tf,lf,nf=font(104,700),font(64,400),font(66,600),font(84,700)
    def wrap(s,f,w):
        o,cur=[],''
        for t in s.split(' '):
            if cur and d.textlength(cur+' '+t,font=f)>w:o.append(cur);cur=t
            else:cur=(cur+' '+t).strip()
        return o+([cur] if cur else [])
    DR={'1':'fusee','2':'escapement','3':'balance'}
    for n in '1234':
        sl=perm[int(n)-1];x,y=SLOT[sl];num=str(sl+1)   # numbered in reading order
        hd,txt,_=TEXT[n];d.rounded_rectangle([x,y,x+BW,y+BH],radius=40,outline=INK,width=7)
        d.ellipse([x+40,y+40,x+150,y+150],fill=INK);d.text((x+95,y+97),num,font=nf,fill=BG,anchor='mm');d.text((x+180,y+48),hd,font=hf,fill=INK)
        yy=y+200
        for l in wrap(txt,tf,BW-110):d.text((x+55,yy),l,font=tf,fill=INK);yy+=76
        top=yy+30;room=(x+40,top,x+BW-40,y+BH-40)
        if n in DR:
            S=P[DR[n]];im,off=face[S['name']];res=solve(S,im,off,lf,room)
            if res:C.paste(res[0],(res[1],res[2]))
            put(S['name'],res,lf)
        else:   # the gimbals: the box rolled each way, the case level, an arrow about the case's pivots; the labels on the second, right of it
            gw=(room[2]-room[0]-60-330)//2
            for i,nm in enumerate(('rollL','rollR')):
                S=P[nm];im,off=face[nm];res=None
                if S['labels']:res=solve(S,im,off,font(58,600),(room[0]+i*(gw+60),room[1],room[2],room[3]-80),sides='r',gap=70)
                if res:im2,ox,oy,k=res[:4]
                else:
                    k=min(gw/im.width,(room[3]-room[1]-80)/im.height);im2=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS)
                    ox=room[0]+i*(gw+60)+(gw-im2.width)//2;oy=room[1]+(room[3]-room[1]-80-im2.height)//2
                C.paste(im2,(ox,oy))
                if S['labels']:put(nm,res,font(58,600))
                g=S['gim'];c=(ox+(g['c'][0]-off[0])*k,oy+(g['c'][1]-off[1])*k);R=0.42*im2.width
                s=1 if g['tip'][0]<g['c'][0] else -1   # the way the page drew the box turned: its top to the left of the gimbal centre, counterclockwise (s 1)
                a0,a1=(-90+25*s,-90-25*s);col=BL if i==0 else RED
                d.arc([c[0]-R,c[1]-R,c[0]+R,c[1]+R],min(a0,a1),max(a0,a1),fill=col,width=10)
                e=math.radians(a1);hx,hy=c[0]+R*math.cos(e),c[1]+R*math.sin(e);tg=(math.sin(e)*s,-math.cos(e)*s)   # the arrow's head at the end the box rolls toward
                nx,ny=math.cos(e),math.sin(e);d.polygon([(hx+tg[0]*40,hy+tg[1]*40),(hx-nx*24,hy-ny*24),(hx+nx*24,hy+ny*24)],fill=col)
                d.text((ox+im2.width/2,oy+im2.height+20),('the box rolled one way' if i==0 else 'and the other')+': the case level',font=font(56,500),fill=INK,anchor='mt')
    # the leaders from the callouts to the centre: curved, ending on the part the callout names
    for n,pts in cv.items():
        q=pts[-1];sx,sy=pts[0];d.line(pts,fill=INK,width=6,joint='curve');d.ellipse([q[0]-14,q[1]-14,q[0]+14,q[1]+14],fill=INK);d.ellipse([sx-10,sy-10,sx+10,sy+10],fill=INK)
    d.text((W//2,H-110),FOOT,font=font(60,400),fill=INK,anchor='mb')
    return C

def main():
    OUT.mkdir(parents=True,exist_ok=True);fails=[];shots=[dict(S) for S in PIECES];ST=OUT/'penposter_state.json'
    if RECOMP:   # the last run's pieces again (the page's set-up and the drawings kept), the text and layout laid out anew
        if ST.exists():old={S['name']:S for S in json.loads(ST.read_text(encoding='utf-8'))}
        else:old={S['name']:dict(S,src=[str(OUT/f"pg_{S['name']}.png"),str(OUT/f"pg_{S['name']}_bg.png")],pen=str(OUT/f"pen_wempe_{S['name']}.png"))   # a run before the state was kept: its checks and files
                  for S in json.loads((OUT/'penposter_checks.json').read_text(encoding='utf-8'))}
        for S in shots:S.update({k:old[S['name']][k] for k in('page','anch','gim','src','pen') if k in old[S['name']]})
    else:asyncio.run(page(shots))
    for S in shots:
        for key,a in S['anch'].items():print(f"  {S['name']:11} {key:22} meshes {a['n']:3}  hits {a['hits']:4}"+('' if a.get('at') else '  XX not hit; in front: '+', '.join(f'{p} {n}' for p,n in a.get('blocked',[]))))
    if not PREVIEW and not RECOMP:draw(shots)
    if not PREVIEW:ST.write_text(json.dumps(shots),encoding='utf-8')
    C=compose(shots,fails);f=OUT/('penposter_preview.png' if PREVIEW else 'penposter.png')
    if not PREVIEW:
        sys.path.insert(0,str(HERE));fn=next(n for n in ast.parse((HERE/'penrender.py').read_text(encoding='utf-8')).body if isinstance(n,ast.FunctionDef) and n.name=='paper')
        ns={'pathlib':pathlib};exec(compile(ast.Module([fn],[]),'penrender.py','exec'),ns);C.save(f);ns['paper'](f,f)
    else:C.save(f)
    (OUT/'penposter_checks.json').write_text(json.dumps([{k:S.get(k) for k in('name','anch','iou','gim','page')} for S in shots],indent=1),encoding='utf-8')
    print('wrote',f);print('FAIL: '+'; '.join(fails) if fails else 'ok: every label and leader ends on its part'+('' if PREVIEW else ', every drawing on the page\'s outline'))
    sys.exit(1 if fails else 0)
main()
