"""A model's Laid out view against a textbook's developed drawing of a fusee chronometer ("Modern chronometer movement", Figs. 83 (elevation) and 84 (plan),
its letters of reference): every element the drawing letters is in the view, shown, on screen, and opens its own card when clicked (the schematic plates too, which
stand in for the frame laid out); then both views rendered on one sheet with the drawing's letters as callouts and a key, and a third the drawing hasn't: the train
laid out seen isometrically (the line's yaw turned 45°, 35.26° down from the train side, through a 4° lens from far off, near parallel), the schematic plates, bridges,
cocks and pillars hidden (the page's ?qa __devHide; the frame's pieces kept shown laid out, the set-up click and the stop pin, stay).

    python laidout.py [OUTDIR]                  # the Hamilton: r_laidout_sheet.png (the three views and the key) and r_laidout_checks.json in OUTDIR, default the current directory
    python laidout.py --model wempe [OUTDIR]    # the Wempe
    python laidout.py --model wempe --write     # and the sheet into the page: renders/laidout_sheet.webp beside its index.html (shown under Take it apart while Laid out is on),
                                                # with renders/laidout_sheet.json, the sha256 of every file the page loaded and of this tool; only if the checks pass
    python laidout.py --model wempe --check     # no browser, a second: exit 1 if any of those files changed since (the sheet stale); the root build then rewrites it

Where a model is made otherwise than the drawing (FIGS, each model's table): neither has B' (the stud carrying the stop work), their stop-bars sliding in a slot across
the fusee's top or small end; S' (the snail the stopping arm meets) is the stop the bar meets in their frames (the stop work turned round: the arm in the fusee, its stop
in the plate or bridge), the Wempe's stop pin in the top plate, the Hamilton's winding stop in the barrel bridge. The Hamilton's top plate (A') is made as bridges, the
upper train bridge and the barrel bridge. Both stop-bars' springs are enclosed (the Wempe's inside the fusee's small end under its cover plate, the Hamilton's in the recess
round the hub on the fusee's top under its top plate), in the view but out of sight from any side (HIDDEN; their letter in brackets). Each element is clicked where the view shows it (the elevation, else the plan, as the drawing's two figures share their letters),
the page's own pick: a real click, its anchor a pixel where the page's rule (the first part not see-through, else the smallest schematic plate) finds it. Exits 1 if an
element is missing from the view, out of sight in both views (HIDDEN apart), or a click on it opens another part's card. About 1 minute."""
import asyncio,browser,hashlib,json,math,pathlib,sys,urllib.parse,urllib.request
import model
from playwright.async_api import async_playwright
from PIL import Image,ImageChops,ImageDraw,ImageFont
sys.stdout.reconfigure(encoding='utf-8')
PAGE=model.PAGE+'#merge=0'
WRITE,CHECK,PEN='--write' in sys.argv,'--check' in sys.argv,'--pen' in sys.argv
_O={k:sys.argv[sys.argv.index(k)+1] for k in('--glb','--pen-scale') if k in sys.argv};_A=[a for a in sys.argv[1:] if not a.startswith('--') and a not in _O.values()]
OUT=pathlib.Path(_A[0] if _A else '.')
HERE=pathlib.Path(__file__).resolve().parent;GLB=pathlib.Path(_O.get('--glb',HERE/'r_wempe.glb')).resolve();PST=None
ROOT=model.DIR.parents[1];IMG=model.DIR/'renders/laidout_sheet.webp';STAMP=IMG.with_suffix('.json');SELF=pathlib.Path(__file__).resolve()
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
def stale():
    """the files of the stamp that changed since the sheet was written (all of them if it never was)"""
    if not IMG.exists() or not STAMP.exists():return ['(no sheet)']
    F=json.loads(STAMP.read_text(encoding='utf-8'))['files']
    return [k for k,h in F.items() if not (ROOT/k).exists() or sha(ROOT/k)!=h]
_MAIN=__name__=='__main__'   # imported (assembled.py: its pick, leaders, key), nothing runs
if CHECK and _MAIN:
    st=stale();print(('stale: '+', '.join(st)+f' changed; run python laidout.py --model {model.NAME} --write') if st else f'ok: {IMG.relative_to(ROOT).as_posix()} is up to date with the page');sys.exit(1 if st else 0)
CSS=("header,.panel,.hud,.tools,.hint,.labels,.dock,.hist,.split,.loading,#info{display:none!important}.wrap{display:block!important;padding:0!important;margin:0!important;max-width:none!important}"
     ".stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border-radius:0!important;aspect-ratio:auto!important}")
FREEZE="""(()=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}
  const s=ESC.state(0.4),u=(n,w)=>mv.userData._u({E:1000+s.prog,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:w,springOn:true,msOn:false});u(0,true);u(2.5,false);})()"""   # views.py's
# (letter, the drawing's name, the model's key; None: no counterpart, with why). A key is a part or part.piece, then a filter: ':gear' or ':arbor' (a piece's toothed
# meshes or its plain ones), ':wheel' or ':pinion' (a toothed mesh of 30 teeth or more, or fewer), ':shaft' (the plain mesh tallest for its width), ':big' (the plain
# mesh widest), and '#NNNNN' the meshes of that parts-list line only
FIGS={'wempe':dict(title='Wempe Einheits-Chronometer',target=-11,hidden={'s':'inside the fusee’s small end, under its cover plate'},fig=[
  ('Framework',[('A','The pillar plate','pillarPlate'),('A′','The top-plate','topPlate'),('B','The pillars','pillars')]),
  ('Driving power',[('C','The mainspring barrel','barrel.drum'),('c','The barrel arbor, squared for setting up','barrelArbor.arbor'),('r','Ratchet (set-up)','setupRatchet'),
    ('r′','Click (set-up)','barrelBridge.click'),('f','The fusee chain','chain')]),
  ('Fusee and maintaining power',[('D','The fusee','fusee.body'),('d','The fusee arbor, squared for the key','fusee.arbor'),('D′','Ratchet wheel of the maintaining power','maintaining.ratchet'),
    ('d′','Click of the maintaining power','maintDetent.click'),('B′','Stud carrying the stop-work',None,'no stud: the bar slides in a slot across the fusee’s small end'),
    ('S','Stopping-arm','stopWork.bar'),('S′','Stopping-snail','topPlate.stopPin','the stop pin the bar meets (the stop work turned round)'),('s','Stopping-arm spring','stopWork.spring')]),
  ('Train',[('D″','The great wheel','fuseeWheel'),('E','The centre wheel','centreWheel.wheel'),('e','The centre wheel arbor','centreWheel.arbor:arbor'),('E′','The centre wheel pinion','centreWheel.arbor:gear'),
    ('G','The third wheel','intermediateWheel.wheel'),('g','The third wheel arbor','intermediateWheel.arbor:arbor'),('G′','The third wheel pinion','intermediateWheel.arbor:gear'),
    ('H','The fourth wheel','secondsWheel.wheel'),('h','The fourth wheel arbor','secondsWheel.arbor:arbor'),('H′','The fourth wheel pinion','secondsWheel.arbor:gear'),
    ('K','The escape wheel','escapeWheel.wheel'),('k','The escape wheel arbor','escapeWheel.pinion:arbor'),('K′','The escape wheel pinion','escapeWheel.pinion:gear')]),
  ('Up-and-down indicator',[('P','Pinion mounted on the fusee arbor','udPinion'),('p','Wheel engaging with P','udWheel.wheel')]),
  ('Motion work and hands',[('V','The cannon pinion','cannon:gear'),('V′','The minute wheel','changeWheel.wheel'),('X','The minute pinion','changeWheel.pinion'),('X′','The hour wheel','hourWheel.wheel'),
    ('Y','The minute hand','hands.minute'),('Z','The hour hand','hands.hour')]),
  ('Drawn, not lettered',[('1','Balance (under the cock Z of Fig. 84)','balance.rim'),('2','Hairspring','hairspring.spring'),('3','Detent','detent.detent'),('4','Upper balance cock','upperCock'),
    ('5','Lower balance cock','lowerCock'),('6','Intermediate bridge','intermediateBridge'),('7','Barrel bridge','barrelBridge.bridge'),('8','Seconds hand','hands.seconds'),('9','Up-and-down hand','hands.ud')])],
  func={'A':'The base of the frame: it carries the arbors’ lower pivots, and the motion work and dial on its other face.',
    'A′':'The frame’s upper plate, held off the pillar plate by the pillars; it carries the arbors’ upper pivots.',
    'B':'Hold the two plates parallel at their fixed distance apart.',
    'C':'Houses the mainspring; turned by the spring as it unwinds, it pulls the chain off its rim.',
    'c':'Holds the mainspring’s inner end; turned by its square to set up the spring’s starting tension.',
    'r':'On the barrel arbor: with its click it keeps the set-up tension.',
    'r′':'Holds the set-up ratchet against the mainspring’s pull.',
    'f':'Carries the mainspring’s pull from the barrel to the fusee.',
    'D':'A spiral cone the chain winds onto: its radius grows as the spring runs down, so the torque reaching the train stays even.',
    'd':'Turned by the key on its square to wind; carries the fusee and, through the maintaining work, the great wheel.',
    'D′':'Held by the maintaining detent while the key winds, so the maintaining spring can keep the great wheel driving.',
    'd′':'Stops the maintaining ratchet turning back when winding takes the drive off.',
    'B′':'In the drawing, carries the stopping-arm.',
    'S':'Pushed out by the chain as it reaches the fusee’s small end at full wind, it meets the stop and ends the winding.',
    'S′':'The stop the stop bar meets at full wind.',
    's':'Holds the stop bar back, out of the stop’s way, until the chain pushes it out.',
    'D″':'On the fusee arbor: takes the fusee’s torque into the train and drives the centre pinion.',
    'E':'Turns once an hour; drives the third wheel’s pinion.',
    'e':'Carries the centre wheel and its pinion; its end, through the cannon pinion, carries the minute hand.',
    'E′':'Driven by the great wheel.',
    'G':'Drives the fourth wheel’s pinion.',
    'g':'Carries the third wheel and its pinion.',
    'G′':'Driven by the centre wheel.',
    'H':'Turns once a minute; drives the escape pinion.',
    'h':'Carries the fourth wheel and its pinion, and the seconds hand at its end.',
    'H′':'Driven by the third wheel.',
    'K':'Held locked by the detent; let go once each oscillation, a tooth gives the balance its impulse.',
    'k':'Carries the escape wheel and its pinion.',
    'K′':'Driven by the fourth wheel.',
    'P':'On the fusee arbor: turns with the fusee as it winds and runs down.',
    'p':'Driven by P; carries the up-and-down hand.',
    'V':'A friction fit on the centre arbor: carries the minute hand and drives the minute wheel, and slips when the hands are set.',
    'V′':'Driven by the cannon pinion: the first step from minutes to hours.',
    'X':'On the minute wheel: drives the hour wheel.',
    'X′':'Turns once in twelve hours; carries the hour hand.',
    'Y':'Shows the minutes.','Z':'Shows the hours.',
    '1':'Swings to and fro in a fixed time, the timekeeper itself; its cut bimetallic rim compensates for temperature.',
    '2':'Its elasticity returns the balance and sets the period of its swing.',
    '3':'Locks the escape wheel; the balance’s discharge stone unlocks it once each oscillation.',
    '4':'Holds the balance’s upper pivot.','5':'Holds the balance’s lower pivot.',
    '6':'Holds the third and fourth arbors’ pivots on the dial side.','7':'Holds the barrel arbor’s upper pivot, and the set-up click.',
    '8':'Shows the seconds, stepping each half second.','9':'Shows how many hours of running the mainspring has left.'},
  insets=[('Mainspring and fusee','The barrel, drawn see-through, holds the mainspring; its chain winds onto the fusee’s cone, whose radius grows as the spring runs down, so the pull reaching the train stays even.',
     ['barrel','barrelArbor','setupRatchet','mainspring','chain','fusee','fuseeWheel','stopWork'],['barrel'],['barrel'],{'edges':False}),   # no Edges: the packed coils' gaps, under a pixel, dotted the strip's edge with depth lines
    ('Maintaining power','Harrison’s maintaining work, under the fusee (left out here): a steel ring spring in the fusee wheel’s recess carries the drive. While the key turns the fusee back to wind it, the maintaining detent holds the ratchet and the spring alone drives the train. The ratchet and wheel are drawn see-through.',
     ['fuseeWheel','maintaining','maintDetent'],['fuseeWheel','maintaining.ratchet'],['maintaining','maintDetent']),
    ('Spring detent escapement','The detent locks the escape wheel. Every other swing the discharge stone on the balance’s roller unlocks it through the gold spring, a tooth pushes the impulse roller, and the balance swings on free.',
     ['escapeWheel','detent','rollers'],[],['escapeWheel','detent']),
    ('Balance and hairspring','The balance and its helical hairspring set the beat: their period is the chronometer’s half second. The cut bimetallic rim and the masses on it compensate for temperature.',
     ['balance','hairspring','stud','rollers'],[],['balance','hairspring'])]),
 'hamilton':dict(title='Hamilton Model 21',target=-15,hidden={'s':'in the recess round the hub on the fusee’s top, under the fusee’s top plate'},fig=[
  ('Framework',[('A','The pillar plate','pillar'),('A′','The top-plate','trainBridge','made as bridges: the upper train bridge, and the barrel bridge (7)'),('B','The pillars','pillars')]),
  ('Driving power',[('C','The mainspring barrel','barrel.drum'),('c','The barrel arbor, squared for setting up','ratchet.arbor'),('r','Ratchet (set-up)','ratchet.wheel'),
    ('r′','Click (set-up)','ratchet.click#42027'),('f','The fusee chain','chain')]),
  ('Fusee and maintaining power',[('D','The fusee','fusee.body'),('d','The fusee arbor, squared for the key','fusee.arbor'),('D′','Ratchet wheel of the maintaining power','sratchet.wheel:wheel'),
    ('d′','Click of the maintaining power','spawl'),('B′','Stud carrying the stop-work',None,'no stud: the stop-bar slides in a slot across the fusee’s top'),
    ('S','Stopping-arm','fusee.stop#42024'),('S′','Stopping-snail','barrelBridge.stop','the winding stop the bar meets (the stop work turned round)'),('s','Stopping-arm spring','fusee.stop#42025')]),
  ('Train',[('D″','The great wheel','gw'),('E','The centre wheel','cw:wheel'),('e','The centre wheel arbor','cw:shaft'),('E′','The centre wheel pinion','cw:pinion'),
    ('G','The third wheel','tw:wheel'),('g','The third wheel arbor','tw:shaft'),('G′','The third wheel pinion','tw:pinion'),
    ('H','The fourth wheel','fw:wheel'),('h','The fourth wheel arbor','fw:shaft'),('H′','The fourth wheel pinion','fw:pinion'),
    ('K','The escape wheel','escW:big'),('k','The escape wheel arbor','escW:shaft'),('K′','The escape wheel pinion','escW:pinion')]),
  ('Up-and-down indicator',[('P','Pinion mounted on the fusee arbor','motion.wind:pinion#42022'),('p','Wheel engaging with P','motion.wind:wheel')]),
  ('Motion work and hands',[('V','The cannon pinion','motion.cannon:pinion'),('V′','The minute wheel','motion.minute:wheel'),('X','The minute pinion','motion.minute:pinion'),('X′','The hour wheel','motion.hour:wheel'),
    ('Y','The minute hand','hands.minute'),('Z','The hour hand','hands.hour')]),
  ('Drawn, not lettered',[('1','Balance (under the cock Z of Fig. 84)','bal.wheel'),('2','Hairspring','spr.spring'),('3','Detent','det.detent'),('4','Balance cock','cock'),
    ('5','Sustaining spring','sspring'),('6','Seconds hand','hands.seconds'),('7','Barrel bridge','barrelBridge.bridge'),('8','Wind indicator hand','hands.wind')])])}
# --pen: the page frozen as the export's rig stands at rest (its start: the hours since full wind and the escape wheel's place, the hands not set on), so the
# pen drawing of each view, posed by the rig, has every part where the page has it and the letters' anchors fall on the same pixels
PFREEZE="""((E0,h0)=>{const mv=window.__mv;if(!mv.userData._u){mv.userData._u=mv.userData.update;mv.userData.update=()=>{};}const w=__W(),HPT=w.hrs/w.n;
  const s=ESC.state(0),u=(n,wd)=>mv.userData._u({E:E0,th:s.th,lift:s.lift,psDef:s.psDef,n,winding:wd,slip:0,springOn:true,msOn:false});u(0,true);u(h0/HPT,false);})"""
def glbstart(f):
    """the export's rest state (its asset extras' start: hours, E) off a .glb's JSON chunk"""
    import struct
    with open(f,'rb') as h:h.read(12);n,_=struct.unpack('<II',h.read(8));J=json.loads(h.read(n))
    return (J['asset'].get('extras') or J['nodes'][0].get('extras'))['start']
FM=FIGS[model.NAME];FIG=FM['fig'];HIDDEN=FM['hidden'];FUNC=FM.get('func',{});INSETS=FM.get('insets',[])   # (title, caption, the parts shown, those of them (or pieces) drawn see-through, those the numbered badge on the isometric view marks[, options: edges False]): close-ups ringed on the isometric view
ITEMS=[(L,n,k,(x[0] if x else '')) for _,g in FIG for (L,n,k,*x) in g]
ISO=['pillarPlate','topPlate','pillars','intermediateBridge','barrelBridge','lowerCock','upperCock','trainBridge','pillar','cock']   # the schematic plates hidden in the isometric view (devOf: each model's own; a name it hasn't is passed over)
JS=r"""((items)=>{const mv=window.__mv,r=window.__r,cv=r.domElement,ci=JSON.parse(__camInfo()),W=cv.clientWidth,H=cv.clientHeight;
  const cam=new THREE.PerspectiveCamera(ci.fov,W/H,1,6000);cam.position.set(...ci.pos);cam.lookAt(new THREE.Vector3(...ci.tgt));cam.updateMatrixWorld();cam.updateProjectionMatrix();
  const sh=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;},M=[];mv.traverse(o=>{if(o.isMesh&&sh(o))M.push(o);});
  const gOf=m=>m.userData.gear||(m.parent&&m.parent.userData&&m.parent.userData.gear)||null,hnOf=o=>{for(;o;o=o.parent){if(o.userData.hn)return o.userData.hn;if(o.userData.partName)break;}return '';};
  const wb=m=>{const b=new THREE.Box3().setFromObject(m);return[Math.max(b.max.x-b.min.x,b.max.z-b.min.z),b.max.y-b.min.y];};
  const sel=key=>{const[k0,hn]=key.split('#'),[k,f]=k0.split(':');let S=M.filter(m=>(m.userData.pk===k||m.userData.part===k)&&(!hn||hnOf(m)===hn));
    if(f==='gear'||f==='arbor')S=S.filter(m=>(f==='gear')===!!gOf(m));
    else if(f==='wheel'||f==='pinion')S=S.filter(m=>gOf(m)&&(gOf(m).z>=30)===(f==='wheel'));
    else if(f==='shaft'||f==='big'){const pl=S.filter(m=>!gOf(m));if(!pl.length)return[];const sc=m=>{const[w,h]=wb(m);return f==='big'?w:h/Math.max(w,1e-6);};S=[pl.reduce((a,b)=>sc(b)>sc(a)?b:a)];}
    return S;};
  const P=window.__parts,title=k=>{const[p,c]=k.split('.');const q=P[p];if(!q)return null;if(!c)return q.t;const pc=(q.pcs||[]).find(x=>x.k===c);return pc?pc.t:null;};
  const v=new THREE.Vector3(),box=S=>{const b=new THREE.Box3();S.forEach(m=>b.expandByObject(m));let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(let i=0;i<8;i++){v.set(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z).project(cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return[x0,y0,x1,y1];};
  /* the page's pick (the viewer's hitAt: shared/viewer.js, the Hamilton's app.js): the first hit not see-through (glass, or a schematic plate, drawn see-through laid out), else the smallest schematic plate hit */
  const thr=m=>{const m0=m.userData.mat0||m.material;return !!m.userData.devPlate||(m0.transparent&&opq(m0)<0.5);};
  const rc=new THREE.Raycaster(),pickAt=(x,y)=>{rc.setFromCamera({x:x/W*2-1,y:-(y/H*2-1)},cam);const hs=rc.intersectObjects(M,false);
    const h=hs.find(h=>!thr(h.object))||hs.filter(h=>h.object.userData.devPlate).sort((a,b)=>a.object.userData.rad-b.object.userData.rad)[0];return h?h.object:null;};
  const out={};
  for(const[L,,key]of items){if(!key)continue;const S=sel(key),set=new Set(S);if(!S.length){out[L]={n:0,hits:0};continue;}
    const[x0,y0,x1,y1]=box(S),hs=[],N=32;
    for(let i=0;i<=N;i++)for(let j=0;j<=N;j++){const x=x0+(x1-x0)*i/N,y=y0+(y1-y0)*j/N;if(x<1||y<1||x>W-1||y>H-1)continue;const o=pickAt(x,y);if(o&&set.has(o))hs.push([x,y,o.userData.pk]);}
    let a=null;if(hs.length){const cx=hs.reduce((s,h)=>s+h[0],0)/hs.length,cy=hs.reduce((s,h)=>s+h[1],0)/hs.length;a=hs.reduce((p,h)=>Math.hypot(h[0]-cx,h[1]-cy)<Math.hypot(p[0]-cx,p[1]-cy)?h:p);}
    const pk=a?a[2]:S[0].userData.pk;out[L]={n:S.length,hits:hs.length,at:a?[a[0],a[1]]:[(x0+x1)/2,(y0+y1)/2],pk,title:title(pk),plate:S.some(m=>m.userData.devPlate)};}
  return {W,H,out};})"""
RING=r"""((sets)=>{const mv=window.__mv,ci=JSON.parse(__camInfo()),W=ci.W,H=ci.Hh,cam=new THREE.PerspectiveCamera(ci.fov,W/H,1,6000);cam.position.set(...ci.pos);cam.lookAt(new THREE.Vector3(...ci.tgt));cam.updateMatrixWorld();cam.updateProjectionMatrix();
  const sh=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;},v=new THREE.Vector3();
  /* the parts' own vertices projected (a 3D box's corners overstate a part seen obliquely): the middle of what they draw, where the badge goes */
  return sets.map(S=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;mv.traverse(o=>{if(!(o.isMesh&&sh(o)&&S.includes(o.userData.part)))return;const P=o.geometry.attributes.position,st=Math.max(1,Math.floor(P.count/400));
      for(let i=0;i<P.count;i+=st){v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld).project(cam);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}});
    return[(x0+x1)/2,(y0+y1)/2,(x1-x0)*0.6,(y1-y0)*0.6];});})"""
# an inset's parts alone (their hidden pieces and groups shown: the mainspring in its barrel), those in ghost see-through; null puts the page back. Gives the parts' centre in mv's frame and radius
ISOL=r"""((show,ghost)=>{const mv=window.__mv,L=window.__lo||[];for(const[o,vis,mat,cs,rs]of L){o.visible=vis;if(mat){o.material=mat;o.castShadow=cs;o.receiveShadow=rs;o.renderOrder=0;}}for(const d of window.__lod||[])d.parent.remove(d);window.__lo=[];window.__lod=[];if(!show)return null;const lo=window.__lo,seen=new Set(),keep=o=>{if(!seen.has(o)){seen.add(o);lo.push([o,o.visible,null,o.castShadow,o.receiveShadow]);}};
  /* a piece of another version (under a hidden group with userData.rev: movement.js's setRev) stays hidden; the rest of the parts shown, hidden or not (the mainspring) */
  const offRev=m=>{for(let o=m;o&&o!==mv;o=o.parent)if(o.userData.rev&&!o.visible)return true;return false;};
  const M=[];mv.traverse(o=>{if(o.isMesh)M.push([o,offRev(o)]);});const b=new THREE.Box3();
  for(const[m,off]of M){keep(m);const p=m.userData.part,on=show.includes(p)&&!m.userData.devPlate&&!m.userData.decal&&!off;m.visible=on;if(!on)continue;
    for(let o=m.parent;o&&o!==mv;o=o.parent){keep(o);o.visible=true;}
    /* see-through, its nearest surface only: a depth-only copy drawn first among the transparent (renderOrder 1), its colour after (2), so the parts behind show through it
       but its own faces behind don't (the maintaining ratchet's 120 teeth stacked into a grey mottle: 2 November 2026); out of the shadow pass both ways */
    if(ghost.includes(p)||ghost.includes(m.userData.pk)){lo.find(x=>x[0]===m)[2]=m.material;const g=m.material.clone();g.transparent=true;g.opacity=0.3;g.depthWrite=false;m.material=g;m.castShadow=false;m.receiveShadow=false;m.renderOrder=2;
      const dm=new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({colorWrite:false,transparent:true,depthWrite:true}));dm.renderOrder=1;m.add(dm);window.__lod.push(dm);}else b.expandByObject(m);}
  const c=b.getCenter(new THREE.Vector3()),r=b.getSize(new THREE.Vector3()).length()/2;mv.worldToLocal(c);return{c:c.toArray(),r};})"""
def font(names,size):
    for n in names:
        try:return ImageFont.truetype(n,size)
        except OSError:pass
    return ImageFont.load_default()
def spread(xs,gap,lo,hi):
    """label places as near their anchors' x as a least gap allows, kept in [lo, hi] (forward, then back)"""
    p=list(xs)
    for i in range(1,len(p)):p[i]=max(p[i],p[i-1]+gap)
    if p and p[-1]>hi:p[-1]=hi
    for i in range(len(p)-2,-1,-1):p[i]=min(p[i],p[i+1]-gap)
    if p and p[0]<lo:
        p[0]=lo
        for i in range(1,len(p)):p[i]=max(p[i],p[i-1]+gap)
    return p
def wrap(d,s,f,w):
    o,cur=[],''
    for t in s.split(' '):
        if cur and d.textlength(cur+' '+t,font=f)>w:o.append(cur);cur=t
        else:cur=(cur+' '+t).strip()
    return o+([cur] if cur else [])
FONTS=lambda F:dict(LET=font(['georgiai.ttf','cambriai.ttf'],F(21)),LK=font(['georgiai.ttf','cambriai.ttf'],F(15)),TXT=font(['georgia.ttf','cambria.ttc'],F(14)),
  HD=font(['georgiab.ttf','georgia.ttf'],F(13)),SUB=font(['georgia.ttf'],F(17)),TT=font(['georgia.ttf'],F(24)))
INK,RED,BLUE=(40,40,40),(150,30,30),(60,85,140);BG=(246,241,230) if PEN else (255,255,255)   # --pen: on the drawing paper (penrender.py's PAPER)
def _cross(a,b,c,e):
    """segments ab and ce cross (sharing an end not counted)"""
    o=lambda p,q,r:(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);d1,d2,d3,d4=o(c,e,a),o(c,e,b),o(a,b,c),o(a,b,e);return d1*d2<0 and d3*d4<0
def uncross(rows,place,rowy,oy):
    """the letters' rows (above: True, below: False; each in order along it) changed until no two leaders cross, or no change lessens their crossings:
    two letters of a row swapped, or a letter moved to the other row (put in order by its anchor); the change taken that lessens them most (the owner,
    3 November 2026: labels not crossing each other)"""
    def segs(R):
        o=[]
        for up,S in R.items():
            for (L,p,hid),lx in zip(S,place(up,S)):o.append(((lx,rowy(up)),(p[0],p[1]+oy)))
        return o
    def count(R):
        s=segs(R);return sum(_cross(*s[i],*s[j]) for i in range(len(s)) for j in range(i+1,len(s)))
    R={k:list(v) for k,v in rows.items()};c=c0=count(R)
    for _ in range(300):
        if not c:break
        best=(c,None)
        for up in (True,False):
            S=R[up]
            for i in range(len(S)):
                for j in range(i+1,len(S)):   # two of a row swapped
                    T=dict(R);T[up]=S[:i]+[S[j]]+S[i+1:j]+[S[i]]+S[j+1:];n=count(T)
                    if n<best[0]:best=(n,T)
                T=dict(R);a=S[i];T[up]=S[:i]+S[i+1:];T[not up]=sorted(R[not up]+[a],key=lambda q:q[1][0]);n=count(T)   # moved to the other row
                if n<best[0]:best=(n,T)
        if best[1] is None:break
        c,R=best
    print(f'   leaders crossing: {c0} as placed, {c} after');UNC.append(c)
    return R
UNC=[]   # the crossings left in each view, the last run's
def panel(shot,bg,res,sub,dpr,face=None):
    """one view: the render cropped to what the movement draws, its letters in a row above and one below, leaders to their anchors (dashed for HIDDEN)"""
    im=Image.open(shot).convert('RGB');F=lambda s:int(s*dpr);T=FONTS(F)
    bb=ImageChops.difference(im,Image.open(bg).convert('RGB')).convert('L').point(lambda v:255 if v>10 else 0).getbbox()   # what the movement draws: against the same frame without it
    pad=F(16);bx0,by0,bx1,by1=max(0,bb[0]-pad),max(0,bb[1]-pad),min(im.size[0],bb[2]+pad),min(im.size[1],bb[3]+pad)
    if face:im=Image.open(face).convert('RGB').resize(im.size,Image.LANCZOS)   # --pen: the pen drawing of the same camera, cropped as the page's render
    im=im.crop((bx0,by0,bx1,by1));W,H=im.size
    A=[(L,(res[L]['at'][0]*dpr-bx0,res[L]['at'][1]*dpr-by0),res[L]['hits']==0) for L,_,k,_ in ITEMS if k and res.get(L,{}).get('n')]
    A=[a for a in A if not a[2] or a[0] in HIDDEN]   # out of sight in this view: lettered in the other (HIDDEN in both, dashed)
    band=F(62);top=F(34);C=Image.new('RGB',(W,top+band+H+band),BG);oy=top+band;C.paste(im,(0,oy));d=ImageDraw.Draw(C);d.text((F(4),F(4)),sub,font=T['SUB'],fill=INK)
    # the anchors shared between the rows above and below by the line fitted through them (level for the elevation and plan; along the train seen isometrically), so leaders stay short
    n=len(A);mx=sum(a[1][0] for a in A)/n;my=sum(a[1][1] for a in A)/n;sxx=sum((a[1][0]-mx)**2 for a in A) or 1;m=sum((a[1][0]-mx)*(a[1][1]-my) for a in A)/sxx
    m=m if abs(m)>0.15 else 0;r=sorted(a[1][1]-my-m*(a[1][0]-mx) for a in A);mid=r[n//2]
    rows={up:sorted([a for a in A if (a[1][1]-my-m*(a[1][0]-mx)<mid)==up],key=lambda a:a[1][0]) for up in (True,False)}
    rows=uncross(rows,lambda up,S:spread([a[1][0] for a in S],F(30),F(14),W-F(14)),lambda up:oy-band*0.5+F(12) if up else oy+H+band*0.5-F(12),oy)
    for up in (True,False):
        S=rows[up]
        if not S:continue
        xs=spread([a[1][0] for a in S],F(30),F(14),W-F(14));ly=oy-band*0.5 if up else oy+H+band*0.5
        for (L,p,hid),lx in zip(S,xs):
            t=('('+L+')') if hid else L;tw=d.textlength(t,font=T['LET']);px,py=p[0],p[1]+oy;ey=ly+(F(12) if up else -F(12))
            if hid:
                n=int(max(2,((px-lx)**2+(py-ey)**2)**0.5//F(6)))
                for i in range(0,n,2):d.line([(lx+(px-lx)*i/n,ey+(py-ey)*i/n),(lx+(px-lx)*(i+1)/n,ey+(py-ey)*(i+1)/n)],fill=RED,width=max(1,F(1)))
            else:d.line([(lx,ey),(px,py)],fill=RED,width=max(1,F(1)))
            d.ellipse([px-F(2.5),py-F(2.5),px+F(2.5),py+F(2.5)],fill=RED);d.text((lx-tw/2,ly-F(13)),t,font=T['LET'],fill=RED)
    return C,(bx0,by0,oy)
def crop(shot,bg,pad,face=None):
    """a render cropped to what the movement draws (against the same frame without it); face: another image of the same camera to crop so (--pen)"""
    im=Image.open(shot).convert('RGB');bb=ImageChops.difference(im,Image.open(bg).convert('RGB')).convert('L').point(lambda v:255 if v>10 else 0).getbbox()
    if face:im=Image.open(face).convert('RGB').resize(im.size,Image.LANCZOS)
    return im.crop((max(0,bb[0]-pad),max(0,bb[1]-pad),min(im.size[0],bb[2]+pad),min(im.size[1],bb[3]+pad)))
def callouts(P,off,rings,shots,dpr,W):
    """the close-ups' boxes (number, title, caption, the parts alone) in a grid two wide and W across, numbered left to right by where each badge stands on the isometric view;
    gives the grid, each badge's place on the view and each box's badge place in the grid, by number"""
    F=lambda s:int(s*dpr);T=FONTS(F);bx0,by0,oy=off;nc=2;gap=F(18);IW=(W-gap*(nc-1))//nc;pad=F(12);meas=ImageDraw.Draw(Image.new('RGB',(10,10)));B=[]
    for i in sorted(range(len(shots)),key=lambda i:rings[i][0]):
        (tt,cap,*_),im=INSETS[i],shots[i];ln=wrap(meas,cap,T['TXT'],IW-2*pad);iw=IW-2*pad;ih=round(im.size[1]*iw/im.size[0])
        if ih>F(250):iw=round(iw*F(250)/ih);ih=F(250)
        B.append((i,tt,ln,im.resize((iw,ih),Image.LANCZOS),pad+F(24)+len(ln)*F(17)+F(8)+ih+pad))
    rows=[B[k:k+nc] for k in range(0,len(B),nc)];RH=[max(b[4] for b in r) for r in rows]
    G=Image.new('RGB',(W,sum(RH)+gap*(len(rows)-1)),BG);d=ImageDraw.Draw(G);at,bat=[],[];y=0
    for r,rh in zip(rows,RH):
        for c,(i,tt,ln,im,h) in enumerate(r):
            x0=c*(IW+gap);d.rectangle([x0,y,x0+IW,y+rh],outline=(70,70,70),width=F(1.5));d.text((x0+pad+F(30),y+pad),tt.upper(),font=T['HD'],fill=INK);yy=y+pad+F(24)
            for l in ln:d.text((x0+pad,yy),l,font=T['TXT'],fill=INK);yy+=F(17)
            G.paste(im,(int(x0+(IW-im.size[0])/2),int(yy+F(8))))
            at.append((rings[i][0]*dpr-bx0,rings[i][1]*dpr-by0+oy));bat.append((x0+pad+F(11),y+pad+F(8)))
        y+=rh+gap
    return G,at,bat
def badge(d,x,y,n,dpr):
    F=lambda s:int(s*dpr);br=F(11);d.ellipse([x-br,y-br,x+br,y+br],fill=INK,outline='white',width=F(1.5));d.text((x,y),str(n),font=FONTS(F)['HD'],fill='white',anchor='mm')
def key(views,dpr,W):
    """the key: each group of the drawing's letters with its names and, under each, what it does (FUNC; else the model's part, its card's title), in as many columns as fit W,
    balanced, a column breaking between letters"""
    F=lambda s:int(s*dpr);T=FONTS(F);KW=F(470);nc=max(1,W//KW);KW=W//nc;meas=ImageDraw.Draw(Image.new('RGB',(10,10)));items=[]
    for g,its in FIG:
        for j,(L,nm,k,*why) in enumerate(its):
            t=FUNC.get(L) or (next((v[L]['title'] for v in views if v.get(L,{}).get('title')),'') if k else '')
            if why:t=(t+' ' if t else '')+'— '+why[0][0].upper()+why[0][1:]+'.'
            if L in HIDDEN:t+=' ('+HIDDEN[L][0].upper()+HIDDEN[L][1:]+'.)'
            b=([('s','',F(10)),('h',g.upper(),F(20))] if j==0 else [])+[('L',(('('+L+')') if L in HIDDEN else L,nm),F(17))]+[('w',ln,F(17)) for ln in wrap(meas,t,T['TXT'],KW-F(80))]+[('s','',F(4))]
            items.append(b)
    tot=sum(x[2] for b in items for x in b);tgt=tot/nc;cols=[[]];h=0
    for b in items:
        bh=sum(x[2] for x in b)
        if cols[-1] and h+bh/2>tgt and len(cols)<nc:cols.append([]);h=0
        if not cols[-1] and b[0][0]=='s':b=b[1:]
        cols[-1]+=b;h+=sum(x[2] for x in b)
    C=Image.new('RGB',(W,max(sum(x[2] for x in c) for c in cols)),BG);d=ImageDraw.Draw(C)
    for ci,c in enumerate(cols):
        x=ci*KW;y=0
        for kind,v,hh in c:
            if kind=='h':d.text((x,y),v,font=T['HD'],fill=(100,100,100))
            elif kind=='L':d.text((x,y),v[0],font=T['LK'],fill=RED);d.text((x+F(38),y),v[1],font=T['TXT'],fill=INK)
            elif kind=='w':d.text((x+F(52),y),v,font=T['TXT'],fill=BLUE)
            y+=hh
    return C
def sheet(left,iso,views,path,dpr):
    """left, the elevation over the plan; right, the isometric view over its close-ups, each badge on the view numbered as its box (no leaders: they crossed the boxes); the key across the bottom;
    under one title (as the drawing's Figs. 83 and 84 share their letters)"""
    F=lambda s:int(s*dpr);T=FONTS(F);g=F(24);top=F(70);m=F(20);cg=F(50)
    lw=max(p.size[0] for p in left);lh=sum(p.size[1] for p in left)+g*(len(left)-1)
    V,off,rings,shots=iso;rw=V.size[0];G,at,bat=callouts(V,off,rings,shots,dpr,rw) if shots else (Image.new('RGB',(rw,1),BG),[],[])
    rh=V.size[1]+g+G.size[1];up=max(lh,rh);tt=FM['title']+', laid out, against a textbook’s developed drawing (“Modern chronometer movement”, Figs. 83 and 84) and its letters of reference'
    tw=ImageDraw.Draw(Image.new('RGB',(10,10))).textlength(tt,font=T['TT']);W=max(m+lw+cg+rw+m,int(m+tw+m));K=key(views,dpr,W-2*m)
    C=Image.new('RGB',(W,top+up+F(36)+K.size[1]+F(30)),BG);d=ImageDraw.Draw(C);d.text((m,F(18)),tt,font=T['TT'],fill=INK)
    y=top
    for p in left:C.paste(p,(m,y));y+=p.size[1]+g
    rx=m+lw+cg;C.paste(V,(rx,top));gy=top+V.size[1]+g;C.paste(G,(rx,gy))
    for n,((ax,ay),(bx,by)) in enumerate(zip(at,bat),1):badge(d,rx+ax,top+ay,n,dpr);badge(d,rx+bx,gy+by,n,dpr)
    ky=top+up+F(18);d.line([(m,ky),(W-m,ky)],fill=(200,200,200),width=F(1));C.paste(K,(m,ky+F(14)));C.save(path)
def save_parts(left,iso,views):
    """what the sheet is made of, for --relayout"""
    D=OUT/'r_laidout_parts';D.mkdir(exist_ok=True);V,off,rings,shots=iso
    for k,p in enumerate(left):p.save(D/f'left{k}.png')
    V.save(D/'iso.png')
    for k,p in enumerate(shots):p.save(D/f'shot{k}.png')
    (D/'meta.json').write_text(json.dumps({'left':len(left),'shots':len(shots),'off':off,'rings':rings,'views':views},ensure_ascii=False),encoding='utf-8')
if '--relayout' in sys.argv and not PEN and _MAIN:   # the sheet again from the last run's parts, no browser: for its layout and the key's text
    D=OUT/'r_laidout_parts';J=json.loads((D/'meta.json').read_text(encoding='utf-8'))
    sheet([Image.open(D/f'left{k}.png').convert('RGB') for k in range(J['left'])],(Image.open(D/'iso.png').convert('RGB'),J['off'],J['rings'],[Image.open(D/f'shot{k}.png').convert('RGB') for k in range(J['shots'])]),
      list(J['views'].values()),OUT/'r_laidout_sheet.png',2);print('wrote',OUT/'r_laidout_sheet.png')
    if WRITE:   # the page's image, and its stamp over the same files hashed again (the page unchanged since the parts were rendered: --check must pass first, the tool apart)
        st=[k for k in stale() if not k.endswith('/laidout.py')]
        if st:sys.exit('the page changed since the parts were rendered ('+', '.join(st)+'): run --write in full')
        im=Image.open(OUT/'r_laidout_sheet.png').convert('RGB');w=min(im.size[0],3200);im.resize((w,round(im.size[1]*w/im.size[0])),Image.LANCZOS).save(IMG,'WEBP',quality=84,method=6)
        F0=json.loads(STAMP.read_text(encoding='utf-8'))['files'];STAMP.write_text(json.dumps({'sheet':IMG.name,'files':{k:sha(ROOT/k) for k in F0}},indent=1)+'\n',encoding='utf-8',newline='\n')
        print(f'wrote {IMG.relative_to(ROOT).as_posix()} ({IMG.stat().st_size//1024} KB) and its stamp')
    sys.exit(0)
def pensheet(PS,iso,views,dpr,render=True):
    """--pen: each view and close-up drawn by penrender.py with the page's own camera at the canvas's size (or --pen-scale of it, then scaled back), cropped as the
    page's render was, lettered from the same anchors; the sheet on drawing paper, its grain laid over the whole at the end"""
    import subprocess
    sz=Image.open(PS[0]['src'][0]).size;k=float(_O.get('--pen-scale',1));js=OUT/'r_laidout_pen.json';js.write_text(json.dumps(PS),encoding='utf-8')
    if render:
        r=subprocess.run([sys.executable,str(HERE/'penrender.py'),'--model',model.NAME,'--glb',str(GLB),'--shots',str(js),'--flat','--size',f'{round(sz[0]*k)}x{round(sz[1]*k)}','--out',str(OUT)])
        if r.returncode:sys.exit('penrender.py failed')
    face=lambda S:OUT/f"pen_{model.NAME}_{S['name']}.png"
    global BG;BG=Image.open(face(PS[0])).convert('RGB').getpixel((2,2))   # the sheet in the renders' own paper, so no drawing sits on a lighter patch
    left,PV,shots=[],None,[]
    for S in PS:
        a,bg,nm=S['src']
        if isinstance(nm,str):
            pc,off=panel(a,bg,views[nm],{'elevation':'Elevation, from the side (cf. Fig. 83)','plan':'Plan, from the train side (cf. Fig. 84)',
              'iso':'Isometric, from the train side, the plates, bridges, cocks and pillars hidden (not in the drawing), with close-ups'}[nm],dpr,face(S))
            if nm=='iso':PV=(pc,off)
            else:left.append(pc)
        else:shots.append(crop(a,bg,dpr*10,face(S)))
    sheet(left,(PV[0],PV[1],iso[2],shots),list(views.values()),OUT/'r_laidout_sheet_pen.png',dpr)
    import ast   # penrender.py's paper() alone (importing the tool would run it)
    fn=next(n for n in ast.parse((HERE/'penrender.py').read_text(encoding='utf-8')).body if isinstance(n,ast.FunctionDef) and n.name=='paper');ns={'pathlib':pathlib}
    exec(compile(ast.Module([fn],[]),'penrender.py','exec'),ns);paper=ns['paper']
    paper(OUT/'r_laidout_sheet_pen.png',OUT/'r_laidout_sheet_pen.png');print('wrote',OUT/'r_laidout_sheet_pen.png')
async def main():
    global PST
    OUT.mkdir(parents=True,exist_ok=True);dpr=2;fails=[];PS=[]   # PS: the pen's shots (--pen)
    if PEN:PST=glbstart(GLB);print('the export rests at',PST)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=browser.ARGS)
        w=await b.new_page();await w.set_content('<canvas></canvas>');await w.evaluate("document.querySelector('canvas').getContext('webgl')");await w.wait_for_timeout(2000);await w.close()
        pg=await b.new_page(viewport={"width":1800,"height":1000},device_scale_factor=dpr,color_scheme='light');errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        reqs=set();pg.on("request",lambda q:reqs.add(q.url))   # what the page loads: the sheet's stamp
        await pg.add_init_script("document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.id='shotcss';s.textContent=%r;document.head.appendChild(s);});"%CSS)
        await pg.goto(PAGE,wait_until='domcontentloaded',timeout=180000);await pg.wait_for_function("!document.querySelector('#loading')",timeout=300000);await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#speeds button[data-v=\"0\"]').click()");await pg.evaluate(FREEZE) if not PEN else await pg.evaluate(PFREEZE+"(%r,%r)"%(PST['E'],PST['hours']))
        await pg.evaluate("document.querySelector('#views button[data-v=\"laidout\"]').click()");await pg.wait_for_timeout(3000)
        DEV=json.loads(await pg.evaluate("JSON.stringify(window.__mv.userData.DEV)"));yaw=math.atan2(DEV['w'][1],DEV['w'][0])
        views={};clicked={};panels=[];css=lambda a,b2:pg.evaluate("((a,b)=>{const s=document.getElementById('shotcss');s.textContent=s.textContent.replace(a,b);})(%s,%s)"%(json.dumps(a),json.dumps(b2)))
        for name,pitch in (('elevation',0.05),('plan',1.5),('iso',math.atan(1/math.sqrt(2)))):
            if name=='iso':   # near parallel: a 4° lens framing what the 20° lens at 420 mm did; the schematic frame hidden
                d=420*math.tan(math.radians(10))/math.tan(math.radians(2));await pg.evaluate(f"window.__devHide({json.dumps(ISO)});window.__cam({yaw+math.pi/4},{pitch},{d},4,{d-400})")   # its near plane 400 short of the target: z-fighting on the balance's masses and rim at 1
                await pg.evaluate(f"window.__look({yaw+math.pi/4},{pitch},{d},{DEV['mid'][0]},{FM['target']},{DEV['mid'][1]})");await pg.wait_for_timeout(3000)
            else:await pg.evaluate(f"window.__look({yaw},{pitch},420,{DEV['mid'][0]},{FM['target']},{DEV['mid'][1]})");await pg.wait_for_timeout(2500)
            shot=OUT/f'r_laidout_{name}_raw.png';await pg.screenshot(path=str(shot));bg=OUT/f'r_laidout_{name}_bg.png'
            if PEN:PS.append(dict(name='lo_'+name,page=json.loads(await pg.evaluate("__camInfo()")),ctl={'laid_out':1,'lift':1},alone=True,**({'hide':{'devOf':ISO}} if name=='iso' else {})))
            await pg.evaluate("window.__mv.visible=false");await pg.wait_for_timeout(500);await pg.screenshot(path=str(bg));await pg.evaluate("window.__mv.visible=true");await pg.wait_for_timeout(500)
            R=await pg.evaluate(JS+"(%s)"%json.dumps([[L,n,k] for L,n,k,_ in ITEMS]));views[name]=R['out']
            pc,off=panel(shot,bg,R['out'],{'elevation':'Elevation, from the side (cf. Fig. 83)','plan':'Plan, from the train side (cf. Fig. 84)',
              'iso':'Isometric, from the train side, the plates, bridges, cocks and pillars hidden (not in the drawing), with close-ups'}[name],dpr);panels.append(pc)
            if PEN:PS[-1]['src']=[str(shot),str(bg),name]
            else:shot.unlink();bg.unlink()
            if name=='iso':   # every element is clicked in the other two (the plates hidden here would not be); the close-ups, each through a 20° lens on the same line of sight
                if INSETS:
                    rings=await pg.evaluate(RING+"(%s)"%json.dumps([x[4] for x in INSETS]));shots=[]
                    ED="(v=>{const c=document.getElementById('edges');if(c&&c.checked!==v){c.checked=v;c.dispatchEvent(new Event('change'));}})"
                    for j,(tt,cap,show,ghost,_,*o) in enumerate(INSETS):
                        noed=bool(o) and o[0].get('edges') is False
                        if noed:await pg.evaluate(ED+"(false)");await pg.wait_for_timeout(300)   # before the parts are set apart: the switch's look() puts every part back
                        q=await pg.evaluate(ISOL+"(%s,%s)"%(json.dumps(show),json.dumps(ghost)));dd=q['r']/math.sin(math.radians(10))*1.08
                        await pg.evaluate(f"window.__cam({yaw+math.pi/4},{pitch},{dd},20);window.__look({yaw+math.pi/4},{pitch},{dd},{q['c'][0]},{q['c'][1]},{q['c'][2]})");await pg.wait_for_timeout(2500)
                        s1=OUT/f'r_laidout_in{j}_raw.png';s0=OUT/f'r_laidout_in{j}_bg.png';await pg.screenshot(path=str(s1))
                        if PEN:   # the close-up's parts alone, a piece (part.k) by its parts-list lines, as the page shows and fades them
                            hns=await pg.evaluate("""(ks=>{const S=new Set();__mv.traverse(o=>{if(o.isMesh&&ks.includes(o.userData.pk)){let q=o;while(q&&!q.userData.hn&&!q.userData.partName)q=q.parent;if(q&&q.userData.hn)S.add(q.userData.hn);}});return[...S];})"""+"(%s)"%json.dumps([g for g in ghost if '.' in g]))
                            PS.append(dict(name=f'lo_in{j}',page=json.loads(await pg.evaluate("__camInfo()")),ctl={'laid_out':1,'lift':1},alone=True,show={'parts':show},ghost={'parts':[g for g in ghost if '.' not in g],'hns':hns},src=[str(s1),str(s0),j]))
                        await pg.evaluate("window.__mv.visible=false");await pg.wait_for_timeout(400);await pg.screenshot(path=str(s0));await pg.evaluate("window.__mv.visible=true")
                        shots.append(crop(s1,s0,dpr*10))
                        if not PEN:s1.unlink();s0.unlink()
                        if noed:await pg.evaluate(ISOL+"(null,null)");await pg.evaluate(ED+"(true)");await pg.wait_for_timeout(300)
                    await pg.evaluate(ISOL+"(null,null)")
                else:rings,shots=[],[]
                iso=(panels.pop(),off,rings,shots);continue
            # a real click at each element's anchor not clicked yet (pointerdown and up; 0.55 s apart, so no two make a double), its card's title against the element's
            await css(',#info{','{')
            for L,nm,k,_ in ITEMS:
                q=R['out'].get(L)
                if not k or not q or not q.get('hits') or L in clicked:continue
                await pg.mouse.click(*q['at']);await pg.wait_for_timeout(550)
                got=await pg.evaluate("(()=>{const i=document.getElementById('info');return i.classList.contains('on')?i.querySelector('h3').textContent:null})()")
                clicked[L]=(name,got,q['title']);await pg.evaluate("document.querySelector('#info .x').click()");await pg.wait_for_timeout(200)
            await css('.loading{','.loading,#info{')
        save_parts(panels,iso,views);sheet(panels,iso,list(views.values()),OUT/'r_laidout_sheet.png',dpr)
        print('page errors:',errs);await b.close()
    if PEN:pensheet(PS,iso,views,dpr)
    E,Pl=views['elevation'],views['plan']
    for L,nm,k,why in ITEMS:
        if not k:print(f'   {L:3} {nm:42} --  {why}');continue
        e=E.get(L,{});pl=Pl.get(L,{});c=clicked.get(L);seen=e.get('hits',0)+pl.get('hits',0)
        ok=e.get('n',0)>0 and ((c is not None and c[1]==c[2]) or (seen==0 and L in HIDDEN))
        if not ok:fails.append(L)
        print(f"{'  ' if ok else 'XX'} {L:3} {nm:42} {k:30} meshes {e.get('n',0):3}  seen {e.get('hits',0):4} / plan {pl.get('hits',0):4}  "+(f"clicked in the {c[0]}: {c[1]}" if c else 'not clicked: '+HIDDEN.get(L,'out of sight')))
    (OUT/'r_laidout_checks.json').write_text(json.dumps({'views':views,'clicked':clicked},indent=1,ensure_ascii=False),encoding='utf-8')
    if errs:fails.append('page errors')
    if WRITE and not fails:
        im=Image.open(OUT/'r_laidout_sheet.png').convert('RGB');w=min(im.size[0],3200);im=im.resize((w,round(im.size[1]*w/im.size[0])),Image.LANCZOS)
        IMG.parent.mkdir(exist_ok=True);im.save(IMG,'WEBP',quality=84,method=6)
        F=set()
        for u in reqs:
            if u.startswith('file:'):
                f=pathlib.Path(urllib.request.url2pathname(urllib.parse.urlparse(u).path)).resolve()
                if f.is_file() and f!=IMG and f.is_relative_to(ROOT):F.add(f)
        F.add(SELF);F.add(SELF.parent/'model.py')
        STAMP.write_text(json.dumps({'sheet':IMG.name,'files':{f.relative_to(ROOT).as_posix():sha(f) for f in sorted(F)}},indent=1)+'\n',encoding='utf-8',newline='\n')
        print(f'wrote {IMG.relative_to(ROOT).as_posix()} ({IMG.stat().st_size//1024} KB, {w} px) and its stamp ({len(F)} files)')
    elif WRITE:print('the sheet not written: the checks failed')
    print('FAIL: '+', '.join(fails) if fails else f'ok: every lettered element of Figs. 83-84 shown laid out and clickable ({sum(1 for i in ITEMS if i[2])} checked)');sys.exit(1 if fails else 0)
if PEN and '--relayout' in sys.argv and _MAIN:   # the pen sheet again from the last --pen run's drawings and anchors, no browser or Blender: for its layout
    pensheet(json.loads((OUT/'r_laidout_pen.json').read_text(encoding='utf-8')),(None,None,json.loads((OUT/'r_laidout_parts/meta.json').read_text(encoding='utf-8'))['rings'],None),
             json.loads((OUT/'r_laidout_checks.json').read_text(encoding='utf-8'))['views'],2,render=False);sys.exit(0)
if _MAIN:asyncio.run(main())
