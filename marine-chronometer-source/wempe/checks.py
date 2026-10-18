"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why); the Hamilton's Navy brake isn't fitted. The fusee's stop pin (05 08 01-5), standing out under the
# top plate into the stop bar's path, its end free, is turned (its domed end) and so isn't among them: wempe_stopwork.py checks it
LOOSE=[('pillarPlate:Cylinder',(20.49,-6.7,40.55),0.6,"the Soviet 6MX's contact screw (54, train.js): its point bears on the contact disc's face, the contact itself, and leaves it when the contact wheel lifts the lever"),('ring:Cylinder',(0,8.25,-55.25),0.8,"the movement ring's radial pin to the case (WN-202, P1f; Ø 1.6 at 12 o'clock, 05 08 00-3), standing 2.0 out of the flange into the notch in the bezel's recess (case.js): out of the case its end is free")]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Buffer',(15.22,0,-41.82),3.1,_RS),('ring:Buffer',(-43.82,0,7.73),3.1,_RS),('ring:Buffer',(28.6,0,34.09),3.1,_RS),
  *[('ring:Buffer',q,3.1,_RS+"; the Soviet 6MX's at Kirov No. 247's 342.2, 102.2 and 246.4 (frame.js)") for q in((13.6,0,-42.37),(-43.5,0,9.4),(40.78,0,17.82))],
  *[('balance:Lathe',q,0.9,"a hub screw (WN-10): its countersunk head lies in the arm's countersink (the coloured section), with no flat face under it") for q in((-8.49,0,14.16),(-9.71,0,10.06))]]
# audit.py box (P1f, case.js): the box's screws whose heads bear outside the audit's probes (at 0.6 of the head's radius, which fall in the hole they pass through), in the box's frame (the
# movement's at rest), the lid shut as the movement's views have it
FLOAT_BOX=[('closingPlate:Buffer',(0,-55.15,0),3.6,"the closing plate's screw (WN-71, 05 01 00-2): its head bears on the counterbore's floor round the plate's Ø 5.5 hole, beyond 0.6 of its radius"),
  ('lid:Buffer',(0,18.35,96.5),4.5,"the latch tongue's pivot screw (P. 51 00 02-2): its head bears round the tongue's Ø 6.2 hole, beyond 0.6 of its radius")]
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
EXPECTED={('pillarPlate:Buffer','secondsWheel:Extrude'):("the Soviet 6MX's contact lever's stone riding a tooth of the contact wheel as the tooth lifts it (train.js: the lever's lift is worked out along the radius; the stone's slight move along the teeth as the lever turns isn't)",0.02,0.8),
  ('detentBlock:Buffer','detentBlock:Lathe'):("the Soviet 6MX's (Kirov No. 247's) screws across its block, drawn without holes across: the foot's stop screw's M1.4 in the base's free side and the banking screw's thread through the upright, which has no slit (escapement.js, blk6)",4.0,1.5),
  ('detent:Lathe','detentBlock:Buffer'):("the detent's foot screw (M1) and its two steady pins, across into the block's end (05 04 01-4, 1436): a block of vertical walls drawn without holes across",1.9,1.1),
  ('hairspring:Buffer','hairspring:Buffer'):("the hairspring's inner end in the hole across the collet's end (05 03 02-2), drawn without the hole (a collet of vertical walls)",0.45,0.55),
('dustBush:Lathe','fuseeBush:Lathe'):("the dust bush pressed on the fusee bush's taper above its flange (05 08 01-2: Ø 8 T6, +0.019/+0.028, 1:70; 05 08 01-3: bore 8 H7 +0.015, 1:70; drawn at the fits' middles, 0.008 interference on the radius over the taper's 2.9). Until 15 October 2026 the T6 was read on the spigot, pressed into the top plate's hole 10, now a g6 slide in it",0.8,2.9),
 # the fusee and barrel (P1c): joints in holes a turned or extruded part can't have cut across it, and the parts that touch by design
 ('fusee:Lathe','udPinion:Extrude'):("the up-and-down pinion (05 02 00-5, bore Ø 1.6) pressed on the fusee arbor's stub (05 06 04-1: Ø 1.6 +0.1/+0.05, drawn 1.675): 0.0375 interference on the radius over the pinion's 3 length",0.65,3.0),
 ('fusee:Buffer','stopWork:Cylinder'):("the stop bar's spring's pin (05 06 04-4) in its hole along the slot, \"0,5 H7\" (05 06 04-2), which isn't cut in the body's small end (its outer part, 2.8 of its 4.1, in the end left uncut past N: 0.56 mm³ of 0.80)",0.7,0.55),
 ('barrelArbor:Cylinder','mainspring:Buffer'):("the arbor's hook (05 07 02-2) in the mainspring's eye: its ramp, 0.475 at its face, stands 0.1 proud of the eyed coil (0.36) into the next, which rides over it on a real spring; the drawn coils lie at the strip's pitch and don't bend round it",0.05,1.6),
 ('coverPlate:Lathe','fusee:Lathe'):("the cover plate's screw (WN-20) in the body's M1.7 hole, 6 deep (05 06 04-2), which isn't cut in the turned body",8.5,3.6),
 ('chain:Extrude','fusee:Cylinder'):("the chain's top hook on the fusee's pin (05 06 00-6), round it",0.1,0.3),
 ('chain:Buffer','chain:Extrude'):("the chain's hooks riveted between its end links' plates (the rivets through them)",0.08,0.3),
 ('band:Buffer','fusee:Lathe'):("the band in the fusee's groove, 0.78 in the 0.87 land, along the turned groove's walls (drawn as slopes over its 0.04 rows)",2.5,0.25),
 ('band:Extrude','barrel:Lathe'):("the band's drum hook (05 07 03-3): its barb in the slot in the drum's wall, cut at the fusee's assembly (0207), not in the turned drum",1.2,0.8),
 ('band:Extrude','barrel:Buffer'):("as revised (the drum notched, a BufferGeometry): the band's drum hook (05 07 03-3): its barb in the slot in the drum's wall, cut at the fusee's assembly (0207), not in the turned drum",1.2,0.8),
 ('band:Buffer','fusee:Buffer'):("the band in the top turn's land where it runs through the small end's pieces either side of the stop bar's slot, along the groove's walls (as the turned body's)",0.1,0.1),
 ('barrel:Lathe','chain:Extrude'):("the chain's bottom hook (05 07 04): its barb, 1.4 past its shank's edge, in the slot in the drum's wall cut at the fusee's assembly (0207: 'Schlitz für Kette'), not in the turned drum",0.4,0.3),
 ('barrel:Buffer','chain:Extrude'):("as revised (the drum notched, a BufferGeometry): the chain's bottom hook (05 07 04): its barb, 1.4 past its shank's edge, in the slot in the drum's wall cut at the fusee's assembly (0207: 'Schlitz für Kette'), not in the turned drum",0.4,0.3),
 ('band:Extrude','fusee:Cylinder'):("the band's round hook (05 07 03-2) on the fusee's pin",0.1,0.8),
 ('band:Buffer','band:Extrude'):("the band's ends brazed to its hooks (05 07 03): the strip's end against its round hook where the pin's hook turns off the groove's start",0.05,0.8)}
WIND_SEQ=False
# contacts.py: the Contacts view's data (its expected overlaps, EXPECTED's, and its sweep's states, STATES), written beside index.html as the global named (--write)
CONTACTDATA=('js/contactdata.js','WCONTACT')
BARREL=False
REGISTRY=False   # bom.py's registry matches the Hamilton's catalogue numbers on its cards; the Wempe's lines are drawing numbers (their 'no' empty), so a card's figures (120 teeth, 310 °C) aren't part numbers
DIAL=True
# fine.py's dial check for the Wempe: its face (dial.js) lists its own holes (userData.holes: the centre, up-and-down and seconds arbors', the screws' sinks and the pins'),
# its radius userData.R; the rest is the Hamilton's DIALJS: the least height over the printed face of any part above the dial, outside those holes
DIALJS='''(()=>{const mv=window.__mv,T=THREE;let face=null;mv.traverse(o=>{let v=true;for(let q=o;q;q=q.parent)if(!q.visible)v=false;if(o.isMesh&&o.userData.surface&&v)face=o;});mv.updateMatrixWorld(true);
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
JEWELS={'last':12,'first':12,'3955':12,'6mx':20,'1943':12}   # the 6MX (the TU: 15 jewels, 20 with the contact) adds the intermediate arbor's two and the seconds arbor's upper, in chatons, and its electrical contact's five, the lever staff's hole and end jewels at each end and the lever's stone (bom.json's lines with 'rev'). The drawings': the balance's and escape wheel's hole jewels and endstones (8), the impulse, discharge and locking stones, and the seconds arbor's lower jewel (05 05 04-1)
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
    let rB=0,rX=0,rIn=1e9;const offRev=o=>{for(let p=o;p;p=p.parent)if(p.userData&&p.userData.rev&&!p.visible)return true;return false;};   /* another version's pieces (hidden) reach nothing */
    ring.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||o.userData.decal||o.userData.surface||offRev(o))return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position,inB=under(o,bowl),isB=pn(o)==='balance',isR=hn(o)==='050100-5';
      for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);if(isB)bb.expandByPoint(v);if(inB)rB=Math.max(rB,v.length());rX=Math.max(rX,Math.hypot(v.y,v.z));if(isR)rIn=Math.min(rIn,Math.hypot(v.x,v.z));}});
    /* the bowl turned in the ring (about z, the ring held): the least turn that brings a point of the bowl's own parts (not the movement) into the ring's band (its 050100-5 solid's
       radii and heights), each way, to 90 deg; the stops' test (massprops-check.js) meets only the box */
    let r0=1e9,r1=0,y0=1e9,y1=-1e9;ring.traverse(o=>{if(!o.isMesh||hn(o)!=='050100-5'||offRev(o))return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position;for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);const r=Math.hypot(v.x,v.z);r0=Math.min(r0,r);r1=Math.max(r1,r);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y);}});
    const pts=[];bowl.traverse(o=>{if(!o.isMesh||!o.geometry.attributes.position||under(o,window.__mv)||offRev(o))return;const T=toR.clone().multiply(o.matrixWorld),P=o.geometry.attributes.position;for(let i=0;i<P.count;i++){v.fromBufferAttribute(P,i).applyMatrix4(T);if(v.length()>r0-0.5)pts.push([v.x,v.y,v.z]);}});
    const inRing=[1,-1].map(s=>{for(let d=0.5;d<=90;d+=0.5){const t=s*d*Math.PI/180,c=Math.cos(t),n=Math.sin(t);for(const[x,y,z]of pts){const X=x*c-y*n,Y=x*n+y*c,r=Math.hypot(X,z);if(r>=r0&&r<=r1&&Y>=y0&&Y<=y1)return d;}}return null;});
    const c=bb.getCenter(new THREE.Vector3());return JSON.stringify({PB:[c.x,c.y,c.z].map(x=>+x.toFixed(3)),reach:{bowl:+rB.toFixed(2),ringIn:+rIn.toFixed(2),aboutX:+rX.toFixed(2),ring:[r0,r1,y0,y1].map(x=>+x.toFixed(2)),bowlInRing:inRing}});})()"""}
# smoke.py's essay steps (the Essay tab, js/essay.js): the link into the model it follows (the escapement view; Back must return to the essay where it was), what that must
# give (the essay hidden, the view's button pressed), the section #essay=… opens, and its report button (Report a bug, since 3.00.00)
VIEWS=['movement','plan','side','dial','escapement','box','case','transport','exploded']   # views.py: every view button, exploded last as the Hamilton's
ESSAY={'link':'#view=escapement','got':"[ESSAY.on(),document.querySelector('#views button[aria-pressed=\"true\"]').dataset.v]",'want':[False,'escapement'],'sec':'detent','report':True}
# holecheck.py --model wempe: the states the movement is checked in (the sheets as last revised, the page's default, and as first drawn: movement.js's setRev), and the
# holes expected empty: (part, line or '' for any, centre in the movement frame within 0.4 or None for any, a state (or several, space-separated) or None for all, why it is empty on the real clock too)
# HOLE_WALL: a hole is as deep as the metal round its edge (holecheck.js's opt.wall), since the upper cock is one solid 15 deep and its auxiliary hole 20 goes through the arm's 2.4
# over the balance (with the part's whole depth the balance passing under it read as its pin)
HOLE_WALL=True
HOLE_STATES=[('last',"__mv.userData.setRev('last')"),('first',"__mv.userData.setRev('first')"),('3955',"__mv.userData.setRev('3955')"),('6mx',"__mv.userData.setRev('6mx')"),('1943',"__mv.userData.setRev('1943')")]   # and the Soviet 6MX (the Variants' third version)
_HS="a hole of the hand setting (Zeigerstellung 05 33), struck through on 05 08 02-1 with \"nur wenn Zeigerstellung eingebaut wird\": drilled, the work not fitted, as Wempe 3955's plate (3_Wempe_3955_uZ.jpg, 6_Wempe_3955_S.jpg) and Greenwich's wartime Wempe's (rmg_L5393_wempe_wartime_002.jpg) have them empty (README, Superseded)"
_AUX="an auxiliary hole (Hilfsloch, reamed 3.50 +0.012 in both plates' tables, 05 09 01 and 05 08 02-1): nothing goes in it; the three small windows beside the pillars Altmeppen lists among the German features (README, How each frame part was measured); Wempe 3955's dial side shows 12 where the table puts it, 40 not (README, Unresolved)"
_HD="the balance holding device's (Unruhhaltevorrichtung 05 36: 51 Zangenschraube M2, 52 Winkelhebelschr. M2, 53 Stift f. Wendelfeder 1.5 H7, 05 09 01's table): the device isn't built, as it doesn't fit the balance and detent as last revised; the 1943 plate keeps its pocket and holes, so one was fitted, its later form not in the set (README, Unresolved)"
_H30="hole 30 (Ankerrad), in the detent pillar plate's own table (05 08 02-1) and drilled in Wempe 3955's plate: its setting's seat (Ø 5.2 H7, the 4.59 lip) and its two M1.2 built as the table gives them, and left empty (README, Superseded)"
HOLE_EXPECTED=[('pillarPlate','050802-1',c,None,f"{k}: {_HS}") for k,c in[(14,[-36.41,0,17.23]),(15,[-33.21,0,22.87]),(16,[-30.79,0,21.47]),(17,[-33.99,0,15.93])]]+[('pillarPlate','WN-hs',c,None,"18, its bush's bore: the hand setting's pinion isn't fitted, so its bush stands empty, as Wempe 3955's (3_Wempe_3955_uZ.jpg)") for c in([-22.14,3.35,12.78],[-22.14,0,12.78])]+[   # 18 itself holds the bush (train.js)
  (pl,'050802-1|050901',[x,y,z],None,f"{k}: {_AUX}") for pl,y in(('pillarPlate',0),('topPlate',-22.35)) for k,x,z in((3,0,-37),(12,-35.74,9.58),(40,26.16,26.16))]+[
  ('pillarPlate','050802-1',[-9.1,0,12.11],None,"23 (Unruh) in the pillar plate, punched 4.4 in the table and drawn Ø 7 on the plan: the balance's lower bearing is in the lower cock under the top plate (05 08 00-2), and nothing on the sheets or the coloured section stands in it; its use isn't given"),
  ('pillarPlate','050802-1',[-5.03,0,33.73],None,"30: "+_H30),('pillarPlate','050802-1',[-5.03,2.85,33.73],None,"30, its lip: "+_H30),
  ('pillarPlate','050802-1',[-8.53,0,33.73],None,"30, an M1.2: "+_H30),('pillarPlate','050802-1',[-1.53,0,33.73],None,"30, the other M1.2: "+_H30),
  ('topPlate','050901',[-23.39,-20.35,7.54],None,"51, from the pocket's floor: "+_HD),('topPlate','050901',[-20.84,-22.35,24.09],None,"52: "+_HD),('topPlate','050901',[-15,-22.35,37],None,"53: "+_HD),
  *[('topPlate','050901',c,None,"the Soviet 6MX's access hole over its electrical contact's base screw (Kirov No. 247's top plate shows the screw's slotted head 19 mm down in it; Kirov 1564's, without a contact, open to the pillar plate): nothing goes in it") for c in([-0.61,-22.35,38.6],[23.6,-22.35,29.14])],
  ('upperCock','050803-1',[-6.51,-37.35,2.45],None,"20 (Hilfsloch f. U. Kl. ob., drilled 2.8: 05 08 03-1's table), the upper cock's auxiliary hole through its arm, 10 from the balance: nothing goes in it"),
  ('balance','050301-1',None,'first 3955 6mx 1943',"as first drawn (and in the 6MX and the escapement of 1943, which have the first-drawn staff), the arm's two screw holes (Ø 1 at 2.14 either side of its hole, 05 03 01-1 of 31.7.41): the 1941 staff's brass collar (05 04_5) has no screw holes and the arm is riveted on its neck, so they stand empty (README, As first drawn); the balance turns, so anywhere"),
  ('rollers','050403-1',None,None,"the impulse roller's hole Ø 1.3, 1.9 below its centre and 0.7 to the side (02 04 02, revised 10.9.41: sure), through it beside the staff: open, its use not given; the balance turns, so anywhere"),
  ('dial','050200-4',[-5.02,10.35,50.25],None,"the dial's Ø 1 at 185.7° on Ø 101 (05 02 00-4, scaled), opposite its pin's at 6°: nothing under it in the movement ring (05 08 00-3), its use not given")]
# gltf_check.py and blender_check.py (the export to Blender, js/blender.js): its clips (the Hamilton's but Laid out, Stop and start and Latch, which the Wempe has no
# counterpart for; Lids is its one Lid) and the parts each a node "... (key)"; the file it writes. blender_check.py: the parts it looks for, the controls set to 1 against
# their clip's end, and the parts that follow the wind against the Winding clip (each with the bounds the rig was found to leave: it has no clicks' catch, the
# maintaining spring's travel or the up-and-down wheel's backlash)
GLTF={'glb':'r_wempe.glb','stl':['fusee','balance','topPlate','escapeWheel','chain','bowl'],
  'clips':['Running','Beat (slow motion)','Run down','Winding','Setting the hands','Exploded','Lift out','Lid','At sea','Rig · beat','Rig · ratchet','Rig · explode','Rig · lift','Rig · lids'],
  'parts':['escapeWheel','fuseeWheel','centreWheel','intermediateWheel','secondsWheel','balance','hairspring','detent','fusee','barrel','chain','maintaining','hands','cannon',
           'pillarPlate','topPlate','pillars','barrelBridge','upperCock','dial','bowl','gimbalRing','box','lid','key']}
BLENDER={'prefix':'r_blender_wempe_','windRel':True,'parts':['escapeWheel','balance','detent','fusee','centreWheel','hands','topPlate'],
  'rigs':[['Rig · explode','explode'],['Rig · lift','lift'],['Rig · lids','lids']],
  # the rig has no catch of the fusee on its click wheel's teeth (running, the clicks carry it forward up to a tooth, 360/35 = 10.3 deg; winding, the key turns it
  # directly), so the fusee stands up to a tooth off the clip, and the chain and barrel by as much through it (16 October 2026, exported at 20.0 h: fusee 3.2 deg,
  # barrel 1.6 deg and 0.008 mm, chain 1.03 mm, the up-and-down hand 0.014 mm); the bounds the tooth's whole: the fusee 10.3 deg, the barrel and chain in proportion
  'wind':{'the fusee':[['(fusee)'],0.05,10.3],'the barrel':[['(barrel)'],0.05,5.5],'the chain':[['(chain)','chain link'],3.5,10.3],'the up-and-down wheel and hand':[['ud','uh'],0.05,1.0]}}
