"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why); the Hamilton's Navy brake isn't fitted
LOOSE=[('topPlate:Cylinder',(-5.68,-17.25,-23.91),0.8,"the fusee's stop pin (05 08 01-5), standing 1.5 out under the top plate's inner face (\"unten vorstehend\") into the stop bar's path: its end is free"),
  ('ring:Cylinder',(0,8.25,-55.25),0.8,"the movement ring's radial pin to the case (WN-202, P1f; Ø 1.6 at 12 o'clock, 05 08 00-3), standing 2.0 out of the flange into the notch in the bezel's recess (case.js): out of the case its end is free")]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Lathe',(15.22,0,-41.82),3.1,_RS),('ring:Lathe',(-43.82,0,7.73),3.1,_RS),('ring:Lathe',(28.6,0,34.09),3.1,_RS)]
# audit.py box (P1f, case.js): the box's screws whose heads bear outside the audit's probes (at 0.6 of the head's radius, which fall in the hole they pass through), in the box's frame (the
# movement's at rest), the lid shut as the movement's views have it
FLOAT_BOX=[('closingPlate:Lathe',(0,-55.15,0),3.6,"the closing plate's screw (WN-71, 05 01 00-2): its head bears on the counterbore's floor round the plate's Ø 5.5 hole, beyond 0.6 of its radius"),
  ('lid:Lathe',(0,18.35,96.5),4.5,"the latch tongue's pivot screw (P. 51 00 02-2): its head bears round the tongue's Ø 6.2 hole, beyond 0.6 of its radius")]
# fine.py: the states checked (balance phase, escape teeth, fusee turns from full wind, winding): the escapement's phases as makeEsc solves them (js/escapement.js's
# ESC.state, at the reference's swing, 207 deg, and drive): the discharge stone meets the gold spring 0.2406 (-12.3 deg), unlocking to the release 0.2482 (-2.4 deg); the
# detent flung off the stone's corner 0.2487 (-1.8 deg), falling back onto the tooth it let go 0.2507 (0.8 deg) and riding it, the escaping tooth's tip passing under the stone,
# to its banking 0.2578 (10.0 deg), the impulse stone in the teeth's path from 0.2518; the wheel's chase from rest to its strike on the impulse stone 0.2606 (13.7 deg), the
# drive to 0.2856 (45.8 deg), the run on to the next lock 0.2883 (49.2 deg); the far turn 0.5; the return swing's pass of the gold spring 0.7546-0.7637 (-5.9 to -17.6 deg);
# then the train at 97 teeth apart (the centre wheel 1.2 teeth on each time, so its meshes are seen at many phases), with the fusee across its wind: fully wound (n 0) running
# and with the key on, the stop bar's travel (the chain coming onto its end about 0.17 turn before full wind), mid-wind running and winding, near and at run down (N_RUN 8.78).
# Until 15 October 2026 the layout's kinematic phases (the tooth on the impulse stone at once)
PH=[0.0,0.2406,0.243,0.246,0.2475,0.2482,0.2485,0.2487,0.249,0.2495,0.25,0.2507,0.251,0.2515,0.2518,0.252,0.253,0.254,0.255,0.256,0.257,0.2578,0.259,0.26,0.2606,0.2608,
  0.261,0.262,0.265,0.27,0.275,0.28,0.284,0.2856,0.2865,0.2875,0.2883,0.29,0.3,0.4,0.5,0.6,0.75,0.7546,0.756,0.758,0.76,0.762,0.7637,0.765,0.9]
STATES=[(ph,0,2.5,False) for ph in PH]+[(0.0,97*k,n,w) for k,(n,w) in enumerate([(2.5,False),(0,False),(0,True),(0.05,False),(0.12,False),(0.17,True),(0.3,False),(1.2,True),(3.1,False),(4.4,True),
  (5.7,False),(7.0,False),(8.2,False),(8.7,False),(8.78,False),(6.3,True),(2.0,False)])]
EXPECTED={('detent:Lathe','detentBlock:Buffer'):("the detent's foot screw (M1) and its two steady pins, across into the block's end (05 04 01-4, 1436): a block of vertical walls drawn without holes across",1.9,1.1),
  ('hairspring:Buffer','hairspring:Buffer'):("the hairspring's inner end in the hole across the collet's end (05 03 02-2), drawn without the hole (a collet of vertical walls)",0.45,0.55),
('dustBush:Lathe','fuseeBush:Lathe'):("the dust bush pressed on the fusee bush's taper above its flange (05 08 01-2: Ø 8 T6, +0.019/+0.028, 1:70; 05 08 01-3: bore 8 H7 +0.015, 1:70; drawn at the fits' middles, 0.008 interference on the radius over the taper's 2.9). Until 15 October 2026 the T6 was read on the spigot, pressed into the top plate's hole 10, now a g6 slide in it",0.8,2.9),
 # the fusee and barrel (P1c): joints in holes a turned or extruded part can't have cut across it, and the parts that touch by design
 ('fusee:Lathe','udPinion:Extrude'):("the up-and-down pinion (05 02 00-5, bore Ø 1.6) pressed on the fusee arbor's stub (05 06 04-1: Ø 1.6 +0.1/+0.05, drawn 1.675): 0.0375 interference on the radius over the pinion's 3 length",0.65,3.0),
 ('fusee:Buffer','stopWork:Cylinder'):("the stop bar's spring's pin (05 06 03-2) in its hole along the slot, \"0,5 H7\" (05 06 04-2), which isn't cut in the body's small end",0.4,0.55),
 ('coverPlate:Lathe','fusee:Lathe'):("the cover plate's screw (WN-20) in the body's M1.7 hole, 6 deep (05 06 04-2), which isn't cut in the turned body",8.5,3.6),
 ('barrelArbor:Cylinder','mainspring:Buffer'):("the arbor's hook (05 07 02-2) through the mainspring's eye at its inner end, the eye not cut in the drawn strip",0.8,2.05),
 ('chain:Extrude','fusee:Lathe'):("the chain's top hook (05 07_14: 5 to its crown, 3.5 wide) seated on the fusee's pin at run down, its plate's edge on the turned body beside the groove's start: 0.01 deep, the hook's and the lathe's facets meeting (since the hook was drawn to its sheet and full wind taken at the stop, 15 October 2026)",0.005,0.03),
 ('chain:Extrude','fusee:Cylinder'):("the chain's top hook on the fusee's pin (05 06 00-6), round it",0.1,0.3),
 ('chain:Buffer','chain:Extrude'):("the chain's hooks riveted between its end links' plates (the rivets through them)",0.08,0.3),
 ('band:Buffer','fusee:Lathe'):("the band in the fusee's groove, 0.78 in the 0.82 land, along the turned groove's walls (drawn as slopes over its 0.04 rows)",2.5,0.25),
 ('band:Extrude','barrel:Lathe'):("the band's drum hook (05 07 03-3): its barb in the slot in the drum's wall, cut at the fusee's assembly (0207), not in the turned drum",1.2,0.8),
 ('band:Buffer','fusee:Buffer'):("the band in the top turn's land where it runs through the small end's pieces either side of the stop bar's slot, along the groove's walls (as the turned body's)",0.1,0.1),
 ('barrel:Lathe','chain:Extrude'):("the chain's bottom hook (05 07 04): its barb, 1.4 past its shank's edge, in the slot in the drum's wall cut at the fusee's assembly (0207: 'Schlitz für Kette'), not in the turned drum",0.4,0.3),
 ('band:Extrude','fusee:Cylinder'):("the band's round hook (05 07 03-2) on the fusee's pin",0.1,0.8),
 ('band:Buffer','band:Extrude'):("the band's ends brazed to its hooks (05 07 03): the strip's end against its round hook where the pin's hook turns off the groove's start",0.05,0.8),
 ('chain:Buffer','fusee:Buffer'):("the chain's links in the top turn's land where it runs through the small end's pieces either side of the stop bar's slot: 0.80 across in the 0.82 land, the links' and the groove's facets meeting (as the turned body's)",0.04,0.06),
 ('chain:Buffer','fusee:Lathe'):("the chain's links in the fusee's groove: 0.80 across in the 0.82 land (05 07 04, 05 06 04-2), the links' and the turned groove's facets meeting",0.04,0.06)}
WIND_SEQ=False
BARREL=False
REGISTRY=False   # bom.py's registry matches the Hamilton's catalogue numbers on its cards; the Wempe's lines are drawing numbers (their 'no' empty), so a card's figures (120 teeth, 310 °C) aren't part numbers
DIAL=True
# fine.py's dial check for the Wempe: its face (dial.js) lists its own holes (userData.holes: the centre, up-and-down and seconds arbors', the screws' sinks and the pins'),
# its radius userData.R; the rest is the Hamilton's DIALJS: the least height over the printed face of any part above the dial, outside those holes
DIALJS='''(()=>{const mv=window.__mv,T=THREE;let face=null;mv.traverse(o=>{if(o.isMesh&&o.userData.surface)face=o;});mv.updateMatrixWorld(true);
 const inv=new T.Matrix4().copy(mv.matrixWorld).invert(),fy=new T.Vector3().setFromMatrixPosition(face.matrixWorld).applyMatrix4(inv).y,R=face.userData.R,holes=face.userData.holes;
 const pn=o=>{for(let p=o;p;p=p.parent)if(p.userData.partName)return p.userData.partName;return '?';};
 let best=null;const v=new T.Vector3(),m=new T.Matrix4();
 mv.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o===face||pn(o)==='dial'||o.userData.decal||o.userData.surface)return;for(let p=o;p;p=p.parent)if(!p.visible)return;
   const P=o.geometry.attributes&&o.geometry.attributes.position;if(!P)return;m.multiplyMatrices(inv,o.matrixWorld);
   for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(m);if(v.y<fy-0.05||v.y>fy+3||Math.hypot(v.x,v.z)>R||holes.some(([x,z,h])=>Math.hypot(v.x-x,v.z-z)<h))continue;
     const d=v.y-fy;if(!best||d<best.d)best={d:+d.toFixed(3),part:pn(o),type:o.geometry.type.replace('Geometry',''),at:[v.x,v.y,v.z].map(q=>+q.toFixed(2))};}});
 return JSON.stringify({face:+fy.toFixed(3),best});})()'''
# bom.py: no balance stop to choose (the Hamilton clicks its locking arm's button), no function checks (bom-fn.js is the Hamilton's); the outer box, shown only in
# its own view, kept shown so its lines are counted (app.js's __BX.showOver, ?qa)
ARM='__BX.showOver(1)'
FN=False
REGISTRY=False   # bom.py's registry matches the Hamilton's catalogue numbers on its cards; the Wempe's lines are drawing numbers (their 'no' empty), so a card's figures (120 teeth, 310 °C) aren't part numbers
JEWELS=12   # the balance's and escape wheel's hole jewels and endstones (8), the impulse, discharge and locking stones, and the seconds arbor's lower jewel (05 05 04-1)
# massprops.py --model wempe (phase 2d): the bowl and the gimbal ring weighed with the movement in the bowl (the Case view: lift 0), at the Wempe's own densities (as
# tools/wempe-inertia.js: brass Ms 58 8.45, steel 7.85, the rim's nickel steel 8.1, the impulse roller's beryllium copper 8.25, the gold spring 11.0 estimated; the dial
# Messingblech Ms 58 (05 02 00-4) and the hands' Goldin brass, whose materials the page keeps apart from __M; the cork ring 0.24, natural cork's, estimated); the stops exact (a point in an obstacle's bounding box counts
# only inside its solid: the transit lock's lever lies diagonally in its box); extra: the balance's centre in the ring's frame (its parts' bounds) and how far the bowl and
# the ring reach from the gimbal centre; alt: the bowl (R-05 01 00-1) in other materials, g/cm³: Bakelite (phenolic, wood-flour filled, 1.32-1.45), hard rubber of Buna
# (ebonite, 1.15-1.20), cast aluminium (2.7): the sheet's "Gewicht 350 gr." against the drawn brass casting (estimated densities: published typical values)
MASSPROPS={'out':'gimbals_wempe.json','hash':'#view=case','alt':{'bakelite':1.37,'buna':1.18,'aluminium':2.70},
  'pre':"""window.__mpExact=1;(()=>{const K=new Set(Object.values(window.__M)),B={'050301-1':{steel:8.1},'050403-1':{copper:8.25},'050401-2':{gilt:11.0}},R={brass:8.45,brass2:8.45,gilt:8.45,plate:8.45,plateSolid:8.45,copper:8.45};
    window.__mpRho=(o,key,mat)=>{let pn='',h='';for(let p=o;p;p=p.parent){if(!pn&&p.userData.partName)pn=p.userData.partName;if(!h&&p.userData.hn)h=String(p.userData.hn).split(' ')[0];}
      if(pn==='bowl'&&window.__mpBowl)return window.__mpBowl;if(pn==='corkRing')return 0.24;if(B[h]&&B[h][key])return B[h][key];if(!K.has(mat))return{dial:8.45,hands:8.45}[pn];return R[key];};})()""",
  'extra':"""(()=>{const BX=window.__BX,ring=BX.ring,bowl=BX.bowl;BX.root.updateMatrixWorld(true);const toR=new THREE.Matrix4().copy(ring.matrixWorld).invert(),v=new THREE.Vector3(),bb=new THREE.Box3();
    const pn=o=>{for(let p=o;p;p=p.parent)if(p.userData.partName)return p.userData.partName;return'';},hn=o=>{for(let p=o;p;p=p.parent)if(p.userData.hn)return String(p.userData.hn).split(' ')[0];return'';},under=(o,a)=>{for(let p=o;p;p=p.parent)if(p===a)return true;return false;};
    let rB=0,rX=0,rIn=1e9;ring.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||o.userData.decal||o.userData.surface)return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position,inB=under(o,bowl),isB=pn(o)==='balance',isR=hn(o)==='050100-5';
      for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);if(isB)bb.expandByPoint(v);if(inB)rB=Math.max(rB,v.length());rX=Math.max(rX,Math.hypot(v.y,v.z));if(isR)rIn=Math.min(rIn,Math.hypot(v.x,v.z));}});
    /* the bowl turned in the ring (about z, the ring held): the least turn that brings a point of the bowl's own parts (not the movement) into the ring's band (its 050100-5 solid's
       radii and heights), each way, to 90 deg; the stops' test (massprops-check.js) meets only the box */
    let r0=1e9,r1=0,y0=1e9,y1=-1e9;ring.traverse(o=>{if(!o.isMesh||hn(o)!=='050100-5')return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position;for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);const r=Math.hypot(v.x,v.z);r0=Math.min(r0,r);r1=Math.max(r1,r);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}});
    const pts=[];bowl.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||under(o,window.__mv))return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position;for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);if(v.length()>r0-0.5)pts.push([v.x,v.y,v.z]);}});
    const inRing=[1,-1].map(s=>{for(let d=0.5;d<=90;d+=0.5){const t=s*d*Math.PI/180,c=Math.cos(t),n=Math.sin(t);for(const[x,y,z]of pts){const X=x*c-y*n,Y=x*n+y*c,r=Math.hypot(X,z);if(r>=r0&&r<=r1&&Y>=y0&&Y<=y1)return d;}}return null;});
    const c=bb.getCenter(new THREE.Vector3());return JSON.stringify({PB:[c.x,c.y,c.z].map(x=>+x.toFixed(3)),reach:{bowl:+rB.toFixed(2),ringIn:+rIn.toFixed(2),aboutX:+rX.toFixed(2),ring:[r0,r1,y0,y1].map(x=>+x.toFixed(2)),bowlInRing:inRing}});})()"""}
# smoke.py's essay steps (the Essay tab, js/essay.js): the link into the model it follows (the escapement view; Back must return to the essay where it was), what that must
# give (the essay hidden, the view's button pressed), the section #essay=… opens, and no report button (the Hamilton's Report a bug isn't on this page)
VIEWS=['movement','plan','side','dial','escapement','box','case','transport','exploded']   # views.py: every view button, exploded last as the Hamilton's
ESSAY={'link':'#view=escapement','got':"[ESSAY.on(),document.querySelector('#views button[aria-pressed=\"true\"]').dataset.v]",'want':[False,'escapement'],'sec':'detent','report':False}
