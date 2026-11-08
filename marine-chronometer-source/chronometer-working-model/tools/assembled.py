"""The Wempe assembled, photographed: a lettered sheet beside the Laid out one (laidout.py), the movement as it stands put together instead of laid out, rendered
photographically in Blender's Cycles (penrender.py --photo: the export's own materials under a studio light), and everything inside it shown by several
assembled views: the train side, the dial side with the dial and hands off, the side between the plates, and three sections cut through the arbors (the
barrel and fusee, the centre and seconds, the balance and escape wheel), each a plane square to the plates through two arbors' centres; then close-ups of
the mechanisms, some cut open. Every element of the textbook's developed drawing ("Modern chronometer movement", Figs. 83 and 84) keeps its letter, as on
the Laid out sheet, and the parts the drawing doesn't letter are numbered on from it; each letter is put on the view that shows most of its part, and the
key says what each does (the textbook's lines as laidout.py's, the rest condensed from the part's own card on the page).

Each letter is placed by the page's own pick on the page's camera, as laidout.py places them: the page frozen as the export's rig stands at rest, so the
Blender still of the same camera has every part where the page has it (laidout.py --pen's method). In a section the page is cut by the same plane
(the renderer's clipping plane) and its pick takes the first surface on the kept side, a cut solid's inside counting as its cut face, as Blender's
exact boolean leaves it. Every lettered element is then clicked on the page in a view that isn't cut (a real click, its card's title against the
element's); one seen only in a section is checked by the pick alone. Exits 1 if an element is out of sight in every view, a click opens another
part's card, or the page has errors.

    python assembled.py [OUTDIR]               # the views and checks, the stills in Blender (about 10-20 min a run at full size on the GPU), the sheet: OUTDIR/r_asm_sheet.png
    python assembled.py --scale 0.5 [OUTDIR]   # the stills at half size, then enlarged (drafts: about a quarter of the time)
    python assembled.py --relayout [OUTDIR]    # the sheet again from the last run's stills and anchors, no browser or Blender
    python assembled.py --write [OUTDIR]       # and into the page: wempe/renders/assembled_sheet.webp with its stamp (assembled_sheet.json), only if the checks pass
    python assembled.py --check                # no browser, a second: exit 1 if a file the page loads changed since the sheet was written (stale; the build reports it, never re-renders it)

The export (gltf_check.py --model wempe's r_wempe.glb) is made first unless --glb FILE names one. Not run by ci.py."""
import asyncio,hashlib,json,math,pathlib,subprocess,sys,urllib.parse,urllib.request
if '--model' not in sys.argv:sys.argv+=['--model','wempe']
import model,browser
import laidout as LO
from playwright.async_api import async_playwright
from PIL import Image,ImageDraw
sys.stdout.reconfigure(encoding='utf-8')
HERE=pathlib.Path(__file__).resolve().parent;SELF=pathlib.Path(__file__).resolve();ROOT=model.DIR.parents[1]
IMG=model.DIR/'renders/assembled_sheet.webp';STAMP=IMG.with_suffix('.json')
WRITE,CHECK,RELAY='--write' in sys.argv,'--check' in sys.argv,'--relayout' in sys.argv
_O={k:sys.argv[sys.argv.index(k)+1] for k in('--glb','--scale','--samples','--only') if k in sys.argv};_A=[a for a in sys.argv[1:] if not a.startswith('--') and a not in _O.values()]
OUT=pathlib.Path(_A[0] if _A else HERE/'r_asm').resolve();GLB=pathlib.Path(_O.get('--glb',OUT/'r_wempe.glb')).resolve()
SCALE=float(_O.get('--scale',1));SAMPLES=int(_O.get('--samples',160))
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
def stale():
    if not IMG.exists() or not STAMP.exists():return ['(no sheet)']
    F=json.loads(STAMP.read_text(encoding='utf-8'))['files'];return [k for k,h in F.items() if not (ROOT/k).exists() or sha(ROOT/k)!=h]
if CHECK:
    st=stale();print(('stale: '+', '.join(st[:8])+(' ...' if len(st)>8 else '')+' changed; run python assembled.py --write (Blender, the GPU)') if st else f'ok: {IMG.relative_to(ROOT).as_posix()} is up to date with the page');sys.exit(1 if st else 0)
if model.NAME!='wempe':sys.exit('assembled.py draws the Wempe only')

# ---- the letters: the textbook's (laidout.py's table), then the parts it doesn't letter, numbered on from its 9; each (letter, name, key, the key's line) ----
# a key as laidout.py's (part or part.piece[:filter][#line]). The lines are condensed from each part's card on the page (wempe/js/app.js's d), whose sources it gives
MORE=[('Not in the drawing: frame and bearings',[
  ('10','Movement ring','ring.ring','The ring the movement hangs in, in the case: the pillar plate sits on its lip, held by three screws, and the dial lies in its flange.'),
  ('11','Pillar screws, train side','topPlate.screws','Three screws from the top plate’s outer face into the pillars’ tapped ends.'),
  ('12','Fusee bush','fuseeBush.bush','A flanged brass bush screwed into the top plate, in which the fusee arbor’s winding end turns.'),
  ('13','Dust bush','dustBush','A tall brass bush round the winding square, up to the case’s winding hole, keeping dust out of the movement.'),
  ('14','Cork ring','corkRing','On the dust bush’s top: in the case it meets a seat round the winding hole, so dust from the hole goes no further than the winding square.'),
  ('15','Train bushes','topPlate.bushes','Brass bushes in the top plate for the centre, intermediate and seconds arbors’ upper pivots, each with an oil sink.'),
  ('16','Centre arbor’s bush','pillarPlate.bush','A brass bush in the pillar plate in which the centre arbor’s long journal turns.'),
  ('17','Seconds jewel','intermediateBridge.jewel','The seconds arbor’s lower jewel in the intermediate bridge, the train’s only jewel in the German original.'),
  ('18','Intermediate wheel’s lower bush','intermediateBridge.bush','A brass bush in the intermediate bridge for the intermediate arbor’s lower pivot.'),
  ('19','Studs of the motion work','pillarPlate.studs','Two steel studs in the pillar plate: the long one carries the up-and-down wheel, the short one the change wheel.')]),
 ('Not in the drawing: driving and maintaining power',[
  ('20','Mainspring','mainspring','The steel spring that drives the chronometer, 15 mm high and 0.37 thick, coiled in the barrel: wound, its coils draw in round the arbor; run down, they lie out against the wall.'),
  ('21','Barrel lid','barrel.lid','Sprung into the drum on the barrel bridge’s side, its boss bearing on the arbor.'),
  ('22','Spring hook block','barrel.hook','Riveted inside the drum’s wall: it takes the mainspring’s outer end.'),
  ('23','Steg (spring brace)','barrel.steg','A steel bar inside the drum’s wall, 45° back from the hook block: the outer coil is threaded between it and the wall.'),
  ('24','Arbor hook','barrelArbor.hook','The pin in the arbor’s core that takes the mainspring’s inner end.'),
  ('26','Click wheel','fusee.clickWheel','A 35-tooth ratchet screwed to the fusee’s large end: running, it pushes the maintaining clicks forward; winding, they ride over its backs.'),
  ('27','Maintaining clicks','maintaining.clicks','Two blued steel clicks on screws in the maintaining ratchet’s cup, pressed onto the click wheel by their springs.'),
  ('28','Click springs','maintaining.springs','Two bronze strips pinned inside the cup’s wall, each pressing a click onto the click wheel.'),
  ('29','Maintaining spring','maintaining.spring','An open steel ring, its eye pinned to the fusee wheel and its other end to the ratchet: it carries the whole drive, and drives the train alone while the key turns.'),
  ('30','Maintaining detent’s spring','maintDetent.spring','A straight steel wire in a stud in the top plate: bent out by the detent’s back, it presses the detent onto the ratchet’s teeth.'),
  ('31','Cover plate','coverPlate.plate','A steel disc screwed on the fusee’s small end over the stop bar’s slot: it keeps the bar in.'),
  ('32','Vorreiber','vorreiber.collar','A steel collar pinned to the fusee arbor under the fusee wheel: it keeps the wheel and the maintaining work on the arbor.'),
  ('33','Dust plate','dustPlate','A brass disc on the winding square, turning with it inside the dust bush.')]),
 ('Not in the drawing: balance and escapement',[
  ('34','Balance staff','balance.staff','The hardened steel staff: its pivots run in the jewels in the two cocks; it carries the collet, the arm on its hub and the rollers.'),
  ('35','Compensation masses','balance.masses','Four brass masses on the rim, each held by a screw through its jaw: their place on the cut rim sets the temperature compensation.'),
  ('36','Timing screws and weights','balance.timing','A timing screw across the rim at each end of the arm, carrying a brass weight: turned in or out, they set the rate.'),
  ('37','Hairspring collet','hairspring.collet','The split collet on the staff that holds the hairspring’s inner end.'),
  ('38','Hairspring stud','stud.stud','A small brass L on the balance cock that holds the hairspring’s outer end; slid along the cock’s slot it sets the pinning point.'),
  ('39','Impulse roller','rollers.impulse','The impulse roller and its sapphire stone, which the escape wheel’s tooth pushes.'),
  ('40','Discharge roller','rollers.discharge','The small collar and its discharge stone that work the gold spring.'),
  ('41','Gold spring','detent.gold','The gold passing spring on the detent, resting on its horn: the discharge stone lifts the detent through it one way and passes it the other.'),
  ('42','Detent block','detentBlock.block','The brass L under the top plate that carries the detent, its foot clamped to its base.'),
  ('43','Balance jewels, upper','balanceJewelsUp.jewel','The upper hole jewel and its setting, with the endstone over it, in the upper cock.'),
  ('44','Balance jewels, lower','balanceJewelsLow.jewel','The lower hole jewel and its setting, with its endstone, in the lower cock.'),
  ('45','Escape wheel’s upper jewel','escJewelUp','The escape arbor’s upper hole jewel, in its setting flush with the top plate’s inner face.'),
  ('46','Escape wheel’s upper endstone','escEndstoneUp.setting','The endstone over the escape arbor’s upper pivot, in a gilt setting in the top plate.'),
  ('47','Escape wheel collet','escapeWheel.collet','The brass collet the escape wheel is pressed on.')]),
 ('Not in the drawing: motion work',[
  ('48','Change wheel pipe','changeWheel.pipe','The pipe the change wheel and its pinion are fixed on, running on the short stud.'),
  ('49','Hour wheel pipe','hourWheel.pipe','The pipe the hour wheel is riveted on: it runs on the cannon tube and carries the hour hand through the dial.'),
  ('50','Up-and-down wheel pipe','udWheel.pipe','The pipe the up-and-down wheel is riveted on, running on the long stud, the hand’s seat at its top.')])]
FM=LO.FIGS['wempe'];FIG=FM['fig']+[(g,[(L,n,k) for L,n,k,_ in its]) for g,its in MORE]
FUNC=dict(FM['func']);FUNC.update({L:t for _,its in MORE for L,_,_,t in its})
ITEMS=[(L,n,k,(x[0] if x else '')) for _,g in FIG for (L,n,k,*x) in g]
LO.FIG,LO.FUNC,LO.HIDDEN,LO.ITEMS=FIG,FUNC,{},ITEMS   # laidout.py's key and leaders read these

# ---- the views: (name, subtitle, the page's camera (yaw, pitch in its world; dist, fov; the target in the movement's frame), parts hidden, the cut) ----
# The movement stands lifted out of its case train side up (the page's Movement view), so the world's y is the frame's -y. A cut is a vertical plane (square
# to the plates) through two arbors' centres (x, z in the frame: dims.js's WD.H, WESC), seen square on from the side cut away (side: +1 or -1)
H=dict(barrel=(24.784,-6),fusee=(-16.708,-15.292),centre=(0,0),seconds=(0,23),escape=(-11.783,21.743),balance=(-9.1,12.11))
VIEWS=[dict(name='train',sub='The train side, the top plate up',cam=(math.pi-0.42,1.02,390,20),tgt=(0,-11,0)),
  dict(name='dial',sub='The dial side, the dial and hands taken off: the motion work and the up-and-down work',cam=(0.42,-1.02,390,20),tgt=(0,4,0),hide=['dial','hands']),
  dict(name='side',sub='From the side, between the plates',cam=(math.pi/2+0.55,0.14,400,20),tgt=(0,-12,0)),
  dict(name='sec_fusee',sub='Cut through the barrel and fusee arbors',cut=('barrel','fusee',1),pitch=0.16,dist=380,y=-11),
  dict(name='sec_centre',sub='Cut through the centre and seconds arbors',cut=('centre','seconds',-1),pitch=0.16,dist=380,y=-8),
  dict(name='sec_balance',sub='Cut through the balance and escape wheel arbors',cut=('balance','escape',-1),pitch=0.16,dist=380,y=-12)]
PREF={}   # a letter's view where more than one shows it and the most-seen isn't the clearest (letter: view)
# ---- the close-ups: (title, caption (from the parts' cards and the Laid out sheet's), the parts shown, those see-through, the camera's yaw and pitch, a cut (two arbors' centres or one and an angle, side)) ----
INSETS=[
 dict(t='The barrel cut open',c='The mainspring coiled in its barrel, its outer end on the hook block behind the Steg, its inner end on the arbor’s hook; the set-up ratchet and its click on the arbor’s square above.',
      show=['barrel','barrelArbor','mainspring','setupRatchet'],ghost=[],yaw=2.2,pitch=0.35,cut=('barrel',0.5,1)),
 dict(t='The fusee cut open',c='The chain on the fusee’s spiral; inside the small end the stop bar in its slot under the cover plate, and below the large end the click wheel, the maintaining ratchet with its clicks and spring, and the fusee wheel, kept on the arbor by the Vorreiber.',
      show=['fusee','fuseeWheel','maintaining','stopWork','coverPlate','vorreiber','chain'],ghost=[],yaw=2.2,pitch=0.3,cut=('fusee',0.5,1)),
 dict(t='Maintaining power',c='Harrison’s maintaining work, under the fusee (left out here): a steel ring spring in the fusee wheel’s recess carries the drive. While the key turns the fusee back to wind it, the maintaining detent holds the ratchet and the spring alone drives the train. The ratchet and wheel are drawn see-through.',
      show=['fuseeWheel','maintaining','maintDetent'],ghost=['fuseeWheel','maintaining.ratchet'],yaw=0.6,pitch=-0.9),
 dict(t='Spring detent escapement',c='The detent locks the escape wheel. Every other swing the discharge stone on the balance’s roller unlocks it through the gold spring, a tooth pushes the impulse roller, and the balance swings on free.',
      show=['escapeWheel','detent','detentBlock','rollers'],ghost=[],yaw=2.8,pitch=0.5),
 dict(t='Balance and hairspring',c='The balance and its helical hairspring set the beat: their period is the chronometer’s half second. The cut bimetallic rim and the masses on it compensate for temperature; the timing weights at the arm’s ends set the rate.',
      show=['balance','hairspring','stud','rollers'],ghost=[],yaw=2.4,pitch=0.45),
 dict(t='The balance in its jewels, cut open',c='The balance staff’s pivots in their hole jewels and endstones, the upper in the upper cock above the top plate, the lower in the lower cock beneath it; the hairspring between its collet and stud.',
      show=['balance','hairspring','stud','rollers','upperCock','lowerCock','balanceJewelsUp','balanceJewelsLow'],ghost=[],yaw=1.2,pitch=0.15,cut=('balance',1.2,1)),
 dict(t='Motion work and up-and-down work',c='Under the dial: the cannon pinion on the centre arbor drives the change wheel and pinion, which turn the hour wheel on the cannon tube; the pinion on the fusee arbor turns the up-and-down wheel on its stud, which shows the hours of running left.',
      show=['cannon','changeWheel','hourWheel','udWheel','udPinion'],ghost=[],yaw=0.5,pitch=-0.75),
 dict(t='The set-up and the stop work',c='On the barrel arbor the set-up ratchet and its click on the barrel bridge hold the mainspring’s starting tension; at full wind the stop bar, pushed out of the fusee’s small end by the chain, meets the stop pin in the top plate.',
      show=['setupRatchet','barrelBridge','barrelArbor','fusee','stopWork','coverPlate','chain'],ghost=['coverPlate'],yaw=2.6,pitch=0.75)]

# ---- the page's side: the cut plane and a camera square on to it, both from the movement's frame ----
AIM=r"""((p1,p2,side,pitch,y)=>{const mv=window.__mv;mv.updateMatrixWorld(true);const d=new THREE.Vector3(p2[0]-p1[0],0,p2[1]-p1[1]).normalize(),n=new THREE.Vector3(-d.z,0,d.x).multiplyScalar(side);
  const m=new THREE.Vector3((p1[0]+p2[0])/2,y,(p1[1]+p2[1])/2),q=mv.localToWorld(new THREE.Vector3(p1[0],y,p1[1])),nw=n.clone().transformDirection(mv.matrixWorld);
  /* the plane through the arbors, its normal away from the camera (the side kept: three keeps a plane's positive side) */
  window.__cut=new THREE.Plane().setFromNormalAndCoplanarPoint(nw.clone().negate(),q);window.__r.clippingPlanes=[window.__cut];
  const yaw=Math.atan2(nw.x,nw.z),pt=pitch+Math.asin(Math.max(-1,Math.min(1,nw.y)));return{yaw,pitch:pt,tgt:m.toArray(),p:q.toArray(),n:nw.clone().negate().toArray()};})"""
UNCUT="(()=>{window.__cut=null;window.__r.clippingPlanes=[];})()"
# the page's pick, laidout.py's selection and titles, made on the GPU: every mesh shown drawn once in a flat colour of its own (its index), both sides, under the
# view's clipping plane, into a target the canvas's size, and read back. So a pixel names the part drawn there, a cut solid's inside (its cut face, as Blender's
# boolean leaves it) included, and see-through parts (laidout.py's rule) left out. Each element: its pixels (hits) and the one nearest their middle (its anchor)
_J=LO.JS;_s=_J.index('const out={};')
PICK=_J[:_s]+r"""const R0=window.__r,ids=[],keep=[];M.forEach(m=>{if(thr(m)){keep.push([m,m.visible,m.material]);m.visible=false;return;}ids.push(m);const k=ids.length;
    const mt=new THREE.MeshBasicMaterial({color:new THREE.Color(((k>>16)&255)/255,((k>>8)&255)/255,(k&255)/255),side:window.__cut?THREE.DoubleSide:((Array.isArray(m.material)?m.material[0]:m.material).side??THREE.FrontSide),toneMapped:false,fog:false});keep.push([m,m.visible,m.material]);m.material=mt;});
  cam.layers.enableAll();const rt=new THREE.WebGLRenderTarget(W,H),cc=R0.getClearColor(new THREE.Color()),ca=R0.getClearAlpha(),sh0=R0.shadowMap.enabled;
  R0.shadowMap.enabled=false;R0.setRenderTarget(rt);R0.setClearColor(0x000000,1);R0.clear();R0.render(mv,cam);const px=new Uint8Array(W*H*4);R0.readRenderTargetPixels(rt,0,0,W,H,px);
  R0.setRenderTarget(null);R0.setClearColor(cc,ca);R0.shadowMap.enabled=sh0;rt.dispose();for(const[m,vis,mat]of keep){if(m.material!==mat)m.material.dispose();m.material=mat;m.visible=vis;}
  let s='';for(let i=0;i<px.length;i+=32768)s+=String.fromCharCode.apply(null,px.subarray(i,i+32768));
  const mi=new Map(ids.map((m,i)=>[m,i+1])),its={};items.forEach(([L,,key])=>{if(!key)return;its[L]=sel(key).map(m=>mi.get(m)||0);});
  return {W,H,px:btoa(s),meshes:ids.map(m=>[m.userData.pk,title(m.userData.pk)]),items:its};})"""
VERIFY=_J[:_s]+r"""const cut=window.__cut,keep=h=>!cut||cut.distanceToPoint(h.point)>=-1e-3,sv=[];
  if(cut)M.forEach(m=>{const ms=Array.isArray(m.material)?m.material:[m.material];for(const q of ms){sv.push([q,q.side]);q.side=THREE.DoubleSide;}});
  const out={};for(const[L,,key,pts]of items){const S=new Set(sel(key));out[L]=null;
    for(let i=0;i<pts.length;i++){const[x,y]=pts[i];rc.setFromCamera({x:x/W*2-1,y:-(y/H*2-1)},cam);const h=rc.intersectObjects(M,false).filter(keep).find(h=>!thr(h.object));if(h&&S.has(h.object)){out[L]=i;break;}}}
  for(const[q,s]of sv)q.side=s;return out;})"""
HIDE=r"""((ks,on)=>{window.__mv.traverse(o=>{if(ks.includes(o.userData.part)||ks.includes(o.userData.partName)||ks.includes(o.userData.pk))o.visible=!on;});})"""
INSET_CUT=r"""((c,a,side)=>{const mv=window.__mv;mv.updateMatrixWorld(true);const n=new THREE.Vector3(-Math.sin(a),0,Math.cos(a)).multiplyScalar(side),q=mv.localToWorld(new THREE.Vector3(c[0],0,c[1]));
  const nw=n.clone().transformDirection(mv.matrixWorld);return{p:q.toArray(),n:nw.clone().negate().toArray(),yaw:Math.atan2(nw.x,nw.z)};})"""

def anchors(R):
    """each element's pixels in a view's image of indices (the page's GPU pick), and its anchor: the pixel deepest inside them (the distance transform's peak), in css px"""
    import base64,numpy as np
    from scipy.ndimage import distance_transform_edt
    W,Hh=R['W'],R['H'];a=np.frombuffer(base64.b64decode(R['px']),np.uint8).reshape(Hh,W,4)[::-1];idx=(a[...,0].astype(np.int32)<<16)|(a[...,1].astype(np.int32)<<8)|a[...,2]
    out={}
    for L,ks in R['items'].items():
        ks=[k for k in ks if k]
        if not R['items'][L]:out[L]={'n':0,'hits':0};continue
        m=np.isin(idx,ks) if ks else np.zeros(idx.shape,bool);n=int(m.sum())
        if not n:out[L]={'n':len(R['items'][L]),'hits':0,'at':None};continue
        ys,xs=np.nonzero(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1;d=distance_transform_edt(np.pad(m[y0:y1,x0:x1],1))[1:-1,1:-1]
        cy,cx=ys.mean()-y0,xs.mean()-x0;Y,X=np.mgrid[0:y1-y0,0:x1-x0];sc=d-1e-3*np.hypot(Y-cy,X-cx);C=[]   # the deepest, the one nearest the middle among equals
        for _ in range(12):
            y,x=np.unravel_index(np.argmax(sc),sc.shape)
            if sc[y,x]<=0:break
            pk,t=R['meshes'][idx[y0+y,x0+x]-1];C.append({'at':[float(x0+x+0.5),float(y0+y+0.5)],'depth':float(d[y,x]),'pk':pk,'title':t});sc[np.hypot(Y-y,X-x)<6]=-1
        out[L]=dict(n=len(R['items'][L]),hits=n,cands=C,**C[0])
    return out

def flat(src,dst,size,bg):
    """a Blender still on its transparent film laid on the sheet's ground, at the page's screenshot size"""
    im=Image.open(src).convert('RGBA')
    if im.size!=size:im=im.resize(size,Image.LANCZOS)
    g=Image.new('RGBA',size,bg+(255,));Image.alpha_composite(g,im).convert('RGB').save(dst)

def render(PS,size):
    """the stills, all in one Blender run (penrender.py --photo)"""
    js=OUT/'r_asm_shots.json';js.write_text(json.dumps(PS),encoding='utf-8');W,Hh=(round(x*SCALE) for x in size)
    r=subprocess.run([sys.executable,str(HERE/'penrender.py'),'--model','wempe','--glb',str(GLB),'--shots',str(js),'--photo','--samples',str(SAMPLES),'--size',f'{W}x{Hh}','--out',str(OUT)])
    if r.returncode:sys.exit('penrender.py failed')

def compose(J,dpr=2):
    """the sheet from the stills and the anchors: two columns of lettered views, the close-ups four across, the key; under one title"""
    BG=(255,255,255);LO.BG=BG;F=lambda s:int(s*dpr);T=LO.FONTS(F);views=J['views'];size=tuple(J['size'])
    for V in VIEWS+[dict(name=f'in{j}') for j in range(len(INSETS))]:
        flat(OUT/f"pen_wempe_{V['name']}.png",OUT/f"r_asm_{V['name']}_flat.png",size,BG)
    Image.new('RGB',size,BG).save(OUT/'r_asm_blank.png')
    panels=[]
    for V in VIEWS:
        mine={L:views[V['name']][L] for L in J['assign'] if J['assign'][L]==V['name']}
        pc,_=LO.panel(OUT/f"r_asm_{V['name']}_flat.png",OUT/'r_asm_blank.png',mine,V['sub'],dpr);panels.append(pc)
    m=F(20);g=F(24);cg=F(40);cw=max(p.size[0] for p in panels);cols=[[],[]];hs=[0,0]
    for p in panels:i=0 if hs[0]<=hs[1] else 1;cols[i].append(p);hs[i]+=p.size[1]+g
    W=m+2*cw+cg+m;nc=4;IW=(W-2*m-F(18)*(nc-1))//nc;pad=F(12);meas=ImageDraw.Draw(Image.new('RGB',(10,10)));B=[]
    for j,I in enumerate(INSETS):
        im=LO.crop(OUT/f"r_asm_in{j}_flat.png",OUT/'r_asm_blank.png',F(10));ln=LO.wrap(meas,I['c'],T['TXT'],IW-2*pad);iw=IW-2*pad;ih=round(im.size[1]*iw/im.size[0])
        if ih>F(300):iw=round(iw*F(300)/ih);ih=F(300)
        B.append((j,I['t'],ln,im.resize((iw,ih),Image.LANCZOS)))
    rows=[B[k:k+nc] for k in range(0,len(B),nc)];RH=[max(pad+F(24)+len(b[2])*F(17)+F(8)+b[3].size[1]+pad for b in r) for r in rows]
    G=Image.new('RGB',(W-2*m,sum(RH)+F(18)*(len(rows)-1)),BG);d=ImageDraw.Draw(G);y=0
    for r,rh in zip(rows,RH):
        for c,(j,tt,ln,im) in enumerate(r):
            x0=c*(IW+F(18));d.rectangle([x0,y,x0+IW,y+rh],outline=(70,70,70),width=F(1.5));LO.badge(d,x0+pad+F(11),y+pad+F(8),j+1,dpr);d.text((x0+pad+F(30),y+pad),tt.upper(),font=T['HD'],fill=LO.INK);yy=y+pad+F(24)
            for l in ln:d.text((x0+pad,yy),l,font=T['TXT'],fill=LO.INK);yy+=F(17)
            G.paste(im,(int(x0+(IW-im.size[0])/2),int(yy+F(8))))
        y+=rh+F(18)
    K=LO.key([views[v['name']] for v in VIEWS],dpr,W-2*m);top=F(70);up=max(hs)-g
    tt=FM['title']+', assembled, photographed: every part of the textbook’s developed drawing (“Modern chronometer movement”, Figs. 83 and 84) in its letter, and more, numbered on'
    C=Image.new('RGB',(W,top+up+F(30)+G.size[1]+F(36)+K.size[1]+F(30)),BG);d=ImageDraw.Draw(C);d.text((m,F(18)),tt,font=T['TT'],fill=LO.INK)
    for i,col in enumerate(cols):
        y=top
        for p in col:C.paste(p,(m+i*(cw+cg)+(cw-p.size[0])//2,y));y+=p.size[1]+g
    gy=top+up+F(30);C.paste(G,(m,gy));ky=gy+G.size[1]+F(18);d.line([(m,ky),(W-m,ky)],fill=(200,200,200),width=F(1));C.paste(K,(m,ky+F(14)))
    C.save(OUT/'r_asm_sheet.png');print('wrote',OUT/'r_asm_sheet.png',C.size)

async def main():
    OUT.mkdir(parents=True,exist_ok=True);dpr=2;PST=LO.glbstart(GLB);print('the export rests at',PST)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(2000);await w.close()
        pg=await b.new_page(viewport={"width":1800,"height":1000},device_scale_factor=dpr,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        reqs=set();pg.on("request",lambda q:reqs.add(q.url))
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.id='shotcss';s.textContent=%r;document.head.appendChild(s);});"%LO.CSS)
        await pg.goto(LO.PAGE,wait_until='domcontentloaded',timeout=180000);await pg.wait_for_function("!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(LO.PFREEZE+"(%r,%r)"%(PST['E'],PST['hours']))
        await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(3000)
        await pg.evaluate("document.querySelector('#views button[data-v=\"movement\"]').click()");await pg.wait_for_timeout(2000)
        PS=[];views={};size=None;items=[[L,n,k] for L,n,k,_ in ITEMS]
        css=lambda a,b2:pg.evaluate("((a,b)=>{const s=document.getElementById('shotcss');s.textContent=s.textContent.replace(a,b);})(%s,%s)"%(json.dumps(a),json.dumps(b2)))
        for V in VIEWS:
            cut=None
            if V.get('hide'):await pg.evaluate(HIDE+"(%s,true)"%json.dumps(V['hide']))
            if V.get('cut'):
                a,c,s=V['cut'];q=await pg.evaluate(AIM+"(%s,%s,%d,%r,%r)"%(json.dumps(H[a]),json.dumps(H[c]),s,V['pitch'],V['y']))
                await pg.evaluate(f"window.__cam({q['yaw']},{q['pitch']},{V['dist']},20)");await pg.evaluate(f"window.__look({q['yaw']},{q['pitch']},{V['dist']},{q['tgt'][0]},{q['tgt'][1]},{q['tgt'][2]})")
                cut={'p':q['p'],'n':q['n']}
            else:
                yw,pt,dd,fov=V['cam'];await pg.evaluate(f"window.__cam({yw},{pt},{dd},{fov})");await pg.evaluate(f"window.__look({yw},{pt},{dd},{V['tgt'][0]},{V['tgt'][1]},{V['tgt'][2]})")
            await pg.wait_for_timeout(2500);shot=OUT/f"r_asm_{V['name']}_page.png";await pg.screenshot(path=str(shot));size=Image.open(shot).size
            vw=anchors(await pg.evaluate(PICK+"(%s)"%json.dumps(items)));vw={L:q for L,q in vw.items() if q.get('hits')} | {L:{'n':q.get('n',0),'hits':0} for L,q in vw.items() if not q.get('hits')}
            ok=await pg.evaluate(VERIFY+"(%s)"%json.dumps([[L,'',next(k for l,_,k,_ in ITEMS if l==L),[c['at'] for c in q['cands']]] for L,q in vw.items() if q.get('hits')]))
            for L,i in ok.items():
                q=vw[L]
                if i is None:vw[L]={'n':q['n'],'hits':0,'raw':q['hits']}   # drawn there, but nowhere the page's own ray names it: not lettered in this view
                else:q.update({k:v for k,v in q['cands'][i].items()});q.pop('cands')
            views[V['name']]=vw
            PS.append(dict(name=V['name'],page=json.loads(await pg.evaluate("__camInfo()")),ctl={'lift':1},alone=True,**({'hide':{'parts':V['hide']}} if V.get('hide') else {}),**({'cut':cut} if cut else {})))
            if cut:await pg.evaluate(UNCUT)
            if V.get('hide'):await pg.evaluate(HIDE+"(%s,false)"%json.dumps(V['hide']))
            print(f"   {V['name']:12} {sum(1 for x in views[V['name']].values() if x.get('hits'))} of {len(items)} elements seen")
        # each letter on the view that shows most of it (PREF first); then a real click on it in a view not cut, its card's title against the element's
        assign={}
        for L,nm,k,_ in ITEMS:
            if not k:continue
            seen={v:views[v].get(L,{}).get('hits',0) for v in views}
            if PREF.get(L) and seen.get(PREF[L]):assign[L]=PREF[L]
            elif max(seen.values())>0:assign[L]=max(seen,key=lambda v:seen[v]*(0.6 if v.startswith('sec') else 1))
        # a real click on each element in the views not cut, the one showing most of it first (its anchor at least 2 px inside it), until its card is its own
        clicked={};tried={};await css(',#info{','{');plain=[V for V in VIEWS if not V.get('cut')]
        cand={L:sorted([V['name'] for V in plain if views[V['name']].get(L,{}).get('depth',0)>=2],key=lambda v:-views[v][L]['hits']) for L,_,k,_ in ITEMS if k}
        for rnd in range(len(plain)):
            for V in plain:
                todo=[L for L,c in cand.items() if L not in clicked and len(c)>rnd and c[rnd]==V['name']]
                if not todo:continue
                if V.get('hide'):await pg.evaluate(HIDE+"(%s,true)"%json.dumps(V['hide']))
                yw,pt,dd,fov=V['cam'];await pg.evaluate(f"window.__cam({yw},{pt},{dd},{fov})");await pg.evaluate(f"window.__look({yw},{pt},{dd},{V['tgt'][0]},{V['tgt'][1]},{V['tgt'][2]})");await pg.wait_for_timeout(2500)
                for L in todo:
                    q=views[V['name']][L];await pg.mouse.click(*q['at']);await pg.wait_for_timeout(550)
                    got=await pg.evaluate("(()=>{const i=document.getElementById('info');return i.classList.contains('on')?i.querySelector('h3').textContent:null})()")
                    await pg.evaluate("(()=>{const x=document.querySelector('#info .x');if(x)x.click();})()");await pg.wait_for_timeout(200)
                    if got==q['title']:clicked[L]=(V['name'],got,q['title'])
                    else:tried.setdefault(L,[]).append((V['name'],got,q['title']))
                if V.get('hide'):await pg.evaluate(HIDE+"(%s,false)"%json.dumps(V['hide']))
        for L,t in tried.items():
            if L not in clicked:clicked[L]=t[-1]
        await css('.loading{','.loading,#info{')
        # the close-ups: the parts alone (laidout.py's ISOL), seen through a 20° lens, cut by a plane through the arbor where asked
        for j,I in enumerate(INSETS):
            q=await pg.evaluate(LO.ISOL+"(%s,%s)"%(json.dumps(I['show']),json.dumps(I['ghost'])));dd=q['r']/math.sin(math.radians(10))*1.08;yw,pt=I['yaw'],I['pitch'];cut=None
            if I.get('cut'):
                a,ang,s=I['cut'];c=await pg.evaluate(INSET_CUT+"(%s,%r,%d)"%(json.dumps(H[a]),ang,s));yw=c['yaw'];cut={'p':c['p'],'n':c['n']}
            await pg.evaluate(f"window.__cam({yw},{pt},{dd},20);window.__look({yw},{pt},{dd},{q['c'][0]},{q['c'][1]},{q['c'][2]})");await pg.wait_for_timeout(2500)
            hns=await pg.evaluate("""(ks=>{const S=new Set();__mv.traverse(o=>{if(o.isMesh&&ks.includes(o.userData.pk)){let q=o;while(q&&!q.userData.hn&&!q.userData.partName)q=q.parent;if(q&&q.userData.hn)S.add(q.userData.hn);}});return[...S];})"""+"(%s)"%json.dumps([g for g in I['ghost'] if '.' in g]))
            PS.append(dict(name=f'in{j}',page=json.loads(await pg.evaluate("__camInfo()")),ctl={'lift':1},alone=True,show={'parts':I['show']},ghost={'parts':[g for g in I['ghost'] if '.' not in g],'hns':hns},**({'cut':cut} if cut else {})))
        await pg.evaluate(LO.ISOL+"(null,null)")
        print('page errors:',errs);await b.close()
    # the checks
    fails=[]
    for L,nm,k,why in ITEMS:
        if not k:print(f'   {L:3} {nm:42} --  {why}');continue
        v=assign.get(L);c=clicked.get(L);hits={x:views[x].get(L,{}).get('hits',0) for x in views}
        ok=v is not None and (c is None or c[1]==c[2])
        if not ok:fails.append(L)
        print(f"{'  ' if ok else 'XX'} {L:3} {nm:40} {k:28} on {v or '-':12} seen "+' '.join(f'{h:4}' for h in hits.values())+'  '+(f"clicked in {c[0]}: {c[1]}" if c else 'by the pick alone (seen only in a section)' if v else 'out of sight'))
    if errs:fails.append('page errors')
    J={'views':views,'assign':assign,'clicked':clicked,'size':size,'reqs':sorted(reqs)}
    (OUT/'r_asm_checks.json').write_text(json.dumps(J,indent=1,ensure_ascii=False),encoding='utf-8')
    if fails:print('FAIL: '+', '.join(fails));sys.exit(1)
    if '--only-checks' in sys.argv:print('ok: the checks (no stills)');sys.exit(0)
    render(PS,size);compose(J);return J

def write(J):
    im=Image.open(OUT/'r_asm_sheet.png').convert('RGB');w=min(im.size[0],3600);im=im.resize((w,round(im.size[1]*w/im.size[0])),Image.LANCZOS);IMG.parent.mkdir(exist_ok=True);im.save(IMG,'WEBP',quality=86,method=6)
    F=set()
    for u in J['reqs']:
        if u.startswith('file:'):
            f=pathlib.Path(urllib.request.url2pathname(urllib.parse.urlparse(u).path)).resolve()
            if f.is_file() and f!=IMG and f.is_relative_to(ROOT):F.add(f)
    F|={SELF,SELF.parent/'model.py',SELF.parent/'laidout.py',SELF.parent/'penrender.py'}
    STAMP.write_text(json.dumps({'sheet':IMG.name,'files':{f.relative_to(ROOT).as_posix():sha(f) for f in sorted(F)}},indent=1)+'\n',encoding='utf-8',newline='\n')
    print(f'wrote {IMG.relative_to(ROOT).as_posix()} ({IMG.stat().st_size//1024} KB, {w} px) and its stamp ({len(F)} files)')

if __name__=='__main__':
    if RELAY:J=json.loads((OUT/'r_asm_checks.json').read_text(encoding='utf-8'));compose(J)
    else:
        if not GLB.exists():
            print('exporting',GLB.name,'(gltf_check.py --model wempe)',flush=True);OUT.mkdir(parents=True,exist_ok=True)
            if subprocess.run([sys.executable,str(HERE/'gltf_check.py'),'--model','wempe'],cwd=OUT).returncode or not GLB.exists():sys.exit('the export failed')
        J=asyncio.run(main())
    if WRITE:
        st=[k for k in stale() if not k.endswith(('assembled.py','laidout.py','penrender.py'))] if RELAY and STAMP.exists() else []
        if st:sys.exit('the page changed since the stills were rendered: run --write in full')
        write(J)
