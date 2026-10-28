"""The Wempe's tables for the tools (../chronometer-working-model/tools/model.py reads them for --model wempe; each name is the tool's own, the Hamilton's
table the default where a name isn't here). P1a (14 October 2026): the frame; nothing moves yet, so most are empty or off; each fills as the movement grows.
Its parts list is bom.json beside this file, its expected coplanar faces audit-expected.json (audit.py --model wempe --update writes it)."""
# audit.py: loose ends expected (part:geometry, place, radius, why); the Hamilton's Navy brake isn't fitted. The fusee's stop pin (05 08 01-5), standing out under the
# top plate into the stop bar's path, its end free, is turned (its domed end) and so isn't among them: wempe_stopwork.py checks it
LOOSE=[('ring:Cylinder',(0,8.25,-55.0),0.8,"the movement ring's radial pin to the case (WN-202, P1f; Ø 1.6 at 12 o'clock, 05 08 00-3), standing 1.78 out of the flange in the bowl's notch, inside the bezel's thread (case.js): its end is free"),
  ('stopWork:Cylinder',(-20.33,-17.98,-10.31),0.25,"the stop bar's spring's pin (05 06 04-4), its inner end standing free 1.3 into the small end's recess through the spring's line (05 06_4's C-D), its outer end in its 0.5 H7 hole through the end (cut 25 October 2026), 0.02 under the hub's face")]
LOOSE_NAVY=[]
# audit.py: screws whose heads bear on a part at their edge only (part:geometry, place in the frozen page's world, head radius, why)
_RS="a movement ring screw (05 08 00-3): its head bears on the pillar plate's rim, which stands 0.35 proud of the ring's face, its middle over the ring (the coloured section)"
FLOAT=[('ring:Buffer',(15.22,0,-41.82),3.1,_RS),('ring:Buffer',(-43.82,0,7.73),3.1,_RS),('ring:Buffer',(28.6,0,34.09),3.1,_RS),
  *[('ring:Buffer',q,3.1,_RS+"; the Soviet 6MX's at Kirov No. 247's 342.2, 102.2 and 246.4 (frame.js)") for q in((13.6,0,-42.37),(-43.5,0,9.4),(40.78,0,17.82))],
  *[('balance:Buffer',q,0.9,"a hub screw (WN-10): its countersunk head lies in the arm's countersink (the coloured section), with no flat face under it (its lathe creased since 26 October 2026: Buffer, its place read off the mesh)") for q in((-8.63,0,14.2),(-9.57,0,10.02))]]
# audit.py box (P1f, case.js): the box's screws whose heads bear outside the audit's probes (at 0.6 of the head's radius, which fall in the hole they pass through), in the box's frame (the
# movement's at rest), the lid shut as the movement's views have it
FLOAT_BOX=[('closingPlate:Buffer',(0,-50.45,0),3.6,"the closing plate's screw (WN-71, 05 01 00-2; 4.7 higher with the drawn bowl's casting since 24 October 2026): its head bears on the counterbore's floor round the plate's Ø 5.5 hole, beyond 0.6 of its radius"),
  ('lid:Buffer',(0,24.55,96.5),4.5,"the latch tongue's pivot screw (P. 51 00 02-2): its head bears round the tongue's Ø 6.2 hole, beyond 0.6 of its radius"),
  *[('gimbalRing:Buffer',(75.23,1.05,s*17.75),2.4,"a ring bracket's screw (05 01 00-6, put in along the radius: the probes stand off it in x and z): its head bears on the bracket's outside round its Ø 2.8 hole (cut since 25 October 2026), the middle probe and one along its axis in the hole") for s in(-1,1)],
  *[('gimbalRing:Buffer',(0,1.05,s*74),4.6,"an inner pivot screw (WN-79, put in along the radius: the probes stand off it in x and z): its head bears on the ring's outside round its M5 hole (cut since 25 October 2026), the middle probe and one along its axis in the hole") for s in(-1,1)],
  *[('box:Buffer',(s*92.5,1.05,0),6,"an outer pivot's screw (WN-80, put in along the radius: the probes stand off it in y and z): its head bears on the side wall's outside round its M6 hole (51 00 10's \"Gew. M 6\", cut since 25 October 2026), the middle probe and one along its axis in the hole") for s in(-1,1)]]
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
EXPECTED={('balance:Buffer','balance:Buffer'):("the timing screws' heads (05 03 01-2) bearing on the rim's inner face, their faces following its curve, in each version's group with their weights (since 26 October 2026; the rim in the balance's own): a contact the grid reads in a few states",0.01,0.8),
('pillarPlate:Buffer','secondsWheel:Extrude'):("the Soviet 6MX's contact lever's stone riding a tooth of the contact wheel as the tooth lifts it (train.js: the lever's lift is worked out along the radius; the stone's slight move along the teeth as the lever turns isn't)",0.02,0.8),
  ('detentBlock:Buffer','detentBlock:Buffer'):("the Soviet 6MX's (Kirov No. 247's) screws across its block (threaded shanks, Buffer since 26 October 2026: Lathe until then), drawn without holes across: the foot's stop screw's M1.4 in the base's free side and the banking screw's thread through the upright, which has no slit (escapement.js, blk6)",4.0,1.5),
  ('detent:Buffer','detentBlock:Buffer'):("the detent's foot screw (M1) and its two steady pins, across into the block's end (05 04 01-4, 1436): a block of vertical walls drawn without holes across; in the 6MX, whose block has no Ø 1.3 hole for the screw's end (25 October 2026), 2.16",2.4,1.1),
  ('hairspring:Buffer','hairspring:Buffer'):("the hairspring's inner end in the hole across the collet's end (05 03 02-2), drawn without the hole (a collet of vertical walls)",0.45,0.55),
('dustBush:Buffer','fuseeBush:Buffer'):("the dust bush pressed on the fusee bush's taper above its flange (05 08 01-2: Ø 8 T6, +0.019/+0.028, 1:70; 05 08 01-3: bore 8 H7 +0.015, 1:70; drawn at the fits' middles, 0.008 interference on the radius over the taper's 2.9). Until 15 October 2026 the T6 was read on the spigot, pressed into the top plate's hole 10, now a g6 slide in it",0.8,2.9),
 # the fusee and barrel (P1c): joints in holes a turned or extruded part can't have cut across it, and the parts that touch by design
 ('fusee:Buffer','udPinion:Extrude'):("the up-and-down pinion (05 02 00-5, bore Ø 1.6) pressed on the fusee arbor's stub (05 06 04-1: Ø 1.6 +0.1/+0.05, drawn 1.675): 0.0375 interference on the radius over the pinion's 3 length",0.65,3.0),
 ('barrelArbor:Extrude','mainspring:Buffer'):("the arbor's hook's head (05 07 02-2) in the mainspring's eye: its land, 0.475 at its face, stands 0.1 proud of the eyed coil (0.36) into the next, which rides over it on a real spring; the drawn coils lie at the strip's pitch and don't bend round it (the pin's own ramped end, 'Cylinder', until 27 October 2026)",0.05,2.1),
 ('chain:Extrude','fusee:Cylinder'):("the chain's top hook on the fusee's pin (05 06 00-6), round it",0.1,0.3),
 ('chain:Buffer','chain:Extrude'):("the chain's hooks riveted between its end links' plates (the rivets through them)",0.08,0.3),
 ('band:Buffer','fusee:Lathe'):("the band in the fusee's groove, 0.78 in the 0.87 land, along the turned groove's walls (drawn as slopes over its 0.04 rows)",2.5,0.25),
 ('band:Buffer','fusee:Buffer'):("the band in the top turn's land where it runs through the small end's pieces either side of the stop bar's slot, along the groove's walls (as the turned body's)",0.1,0.1),
 ('barrel:Buffer','chain:Extrude'):("the chain's bottom hook (05 07 04) in the drum's slot, cut for it at the fusee's assembly (0207: 'Schlitz für Kette', 45° to the radius, leaning back toward the chain's run as the barb does; fusee.js, DRUM): kept for the hook laid where the chain's last link comes to it at run down (8.78 turns), 0.06 mm³ into the wall beside the radial slot cut until 25 October 2026; in the leaning slot it meets nothing in fine.py's states",0.1,0.3),
 ('band:Extrude','fusee:Cylinder'):("the band's round hook (05 07 03-2) on the fusee's pin",0.1,0.8)}   # ('band:Buffer','band:Extrude'), the band's end butting on its hooks, gone 28 October 2026: each hook's slot is cut and the band runs up it (drawing check 2, 4-M8)
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
# tools/wempe-inertia.js: brass Ms 58 8.45, steel 7.85, the rim's nickel steel 8.1, the impulse roller's beryllium copper 8.25, the gold spring 11.6 (333-333, likely); the dial
# Messingblech Ms 58 (05 02 00-4) and the hands' Goldin brass, whose materials the page keeps apart from __M; the cork ring 0.24, natural cork's, estimated); the stops exact (a point in an obstacle's bounding box counts
# only inside its solid: the transit lock's lever lies diagonally in its box); extra: the balance's centre in the ring's frame (its parts' bounds) and how far the bowl and
# the ring reach from the gimbal centre; alt: the bowl (R-05 01 00-1) in other materials, g/cm³: Bakelite (phenolic, wood-flour filled, 1.32-1.45), hard rubber of Buna
# (ebonite, 1.15-1.20), cast aluminium (2.7): the sheet's "Gewicht 350 gr." against the drawn brass casting (estimated densities: published typical values)
MASSPROPS={'out':'gimbals_wempe.json','hash':'#view=case','alt':{'bakelite':1.37,'buna':1.18,'aluminium':2.70},
  'pre':"""window.__mpExact=1;(()=>{const K=new Set(Object.values(window.__M)),B={'050301-1':{steel:8.1},'050403-1':{copper:8.25},'050401-2':{gilt:11.6}},R={brass:8.45,caseB:8.45,brass2:8.45,gilt:8.45,plate:8.45,plateSolid:8.45,copper:8.45};
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
VIEWS=['movement','plan','side','dial','escapement','box','case','transport','laidout','exploded']   # views.py: every view button, exploded last as the Hamilton's
ESSAY={'link':'#view=escapement','got':"[ESSAY.on(),document.querySelector('#views button[aria-pressed=\"true\"]').dataset.v]",'want':[False,'escapement'],'sec':'detent','report':True,'key':'drawings'}   # key: its hash, #drawings=section, since 21 October 2026 (its Essay tab the shared essay's page)
# holecheck.py --model wempe: the states the movement is checked in (the sheets as last revised, the page's default, and as first drawn: movement.js's setRev), and the
# holes expected empty: (part, line or '' for any, centre in the movement frame within 0.4 or None for any, a state (or several, space-separated) or None for all, why it is empty on the real clock too)
# HOLE_WALL: a hole is as deep as the metal round its edge (holecheck.js's opt.wall), since the upper cock is one solid 15 deep and its auxiliary hole 20 goes through the arm's 2.4
# over the balance (with the part's whole depth the balance passing under it read as its pin)
HOLE_WALL=True
HOLE_STATES=[('last',"__mv.userData.setRev('last')"),('first',"__mv.userData.setRev('first')"),('3955',"__mv.userData.setRev('3955')"),('6mx',"__mv.userData.setRev('6mx')"),('1943',"__mv.userData.setRev('1943')")]   # and the Soviet 6MX (the Variants' third version)
_HS="a hole of the hand setting (Zeigerstellung 05 33), struck through on 05 08 02-1 with \"nur wenn Zeigerstellung eingebaut wird\": drilled, the work not fitted, as Wempe 3955's plate (3_Wempe_3955_uZ.jpg, 6_Wempe_3955_S.jpg) and Greenwich's wartime Wempe's (rmg_L5393_wempe_wartime_002.jpg) have them empty (README, Superseded)"
_AUX="an auxiliary hole (Hilfsloch, reamed 3.50 +0.012 in both plates' tables, 05 09 01 and 05 08 02-1): nothing goes in it; the three small windows beside the pillars Altmeppen lists among the German features (README, How each frame part was measured); Wempe 3955's dial side shows 12 where the table puts it, 40 not (README, Unresolved)"
_HD="the balance holding device's (Unruhhaltevorrichtung 05 36: 51 Zangenschraube M2, 52 Winkelhebelschr. M2, 53 Stift f. Wendelfeder 1.5 H7, 05 09 01's table): the device isn't built, as it doesn't fit the balance and detent as last revised; the 1943 plate keeps its pocket and holes, so one was fitted, its later form not in the set (README, Unresolved)"
_H30="hole 30 (Ankerrad), in the detent pillar plate's own table (05 08 02-1) and drilled in Wempe 3955's plate: its setting's seat (Ø 5.2 H7, the 4.59 lip) as sheet b's G-H draws it (in Wempe 3955's version the table's plain 2.50, as its plate shows) and its two M1.2, left empty (README, Superseded)"
HOLE_EXPECTED=[('escEndstoneLow','050408-2.el',[-11.78,3.1,21.74],'last',"the escape wheel's lower endstone setting's window Ø 1.9 in the dial face, its stone 1.5 down it (Wempe 3955's dial side shows the ruby in a dark disc): open, as the Hamilton's balance cock's endstone window (since 27 October 2026, the arbor's end 1.55 into the pillar plate)"),('balance','050301-4',{'about':[-9.10,12.11],'r':15.70,'y':-29.41},None,"a compensation mass's tapped hole M1.2 in its top, countersunk (WN-12a's: 05 03_2's plan, the coloured section): empty, as on Wempe's lever 2965 and the earlier 2493 (a poising screw fitted where needed, likely)")]+[('pillarPlate','050802-1',c,None,f"{k}: {_HS}") for k,c in[(14,[-36.41,0,17.23]),(15,[-33.21,0,22.87]),(16,[-30.79,0,21.47]),(17,[-33.99,0,15.93])]]+[('pillarPlate','WN-hs',c,None,"18, its bush's bore: the hand setting's pinion isn't fitted, so its bush stands empty, as Wempe 3955's (3_Wempe_3955_uZ.jpg)") for c in([-22.14,3.35,12.78],[-22.14,0,12.78])]+[   # 18 itself holds the bush (train.js)
  (pl,'050802-1|050901',[x,y,z],None,f"{k}: {_AUX}") for pl,y in(('pillarPlate',0),('topPlate',-22.35)) for k,x,z in((3,0,-37),(12,-35.74,9.58),(40,26.16,26.16))]+[
  ('pillarPlate','050802-1',[-9.1,0,12.11],None,"23 (Unruh) in the pillar plate, punched 4.4 in the table and drawn Ø 7 on the plan: the balance's lower bearing is in the lower cock under the top plate (05 08 00-2), and nothing on the sheets or the coloured section stands in it; its use isn't given"),
  ('pillarPlate','050802-1',[-5.03,0,33.73],None,"30: "+_H30),('pillarPlate','050802-1',[-5.03,2.85,33.73],None,"30, its lip: "+_H30),
  ('pillarPlate','050802-1',[-8.53,0,33.73],None,"30, an M1.2: "+_H30),('pillarPlate','050802-1',[-1.53,0,33.73],None,"30, the other M1.2: "+_H30),
  ('topPlate','050901',[-23.39,-20.35,7.54],None,"51, from the pocket's floor: "+_HD),('topPlate','050901',[-20.84,-22.35,24.09],None,"52: "+_HD),('topPlate','050901',[-15,-22.35,37],None,"53: "+_HD),
  *[('topPlate','050901',c,None,"the Soviet 6MX's access hole over its electrical contact's base screw (Kirov No. 247's top plate shows the screw's slotted head 19 mm down in it; Kirov 1564's, without a contact, open to the pillar plate): nothing goes in it") for c in([-0.61,-22.35,38.6],[23.6,-22.35,29.14])],
  ('upperCock','050803-1',[-6.51,-37.35,2.45],None,"20 (Hilfsloch f. U. Kl. ob., drilled 2.8: 05 08 03-1's table), the upper cock's auxiliary hole through its arm, 10 from the balance: nothing goes in it"),
  ('balance','050301-1',None,'first 3955 6mx 1943',"as first drawn (and in the 6MX and the escapement of 1943, which have the first-drawn staff), the arm's two screw holes (Ø 1 at 2.14 either side of its hole, 05 03 01-1 of 31.7.41): the 1941 staff's brass collar (05 04_5) has no screw holes and the arm is riveted on its neck, so they stand empty (README, As first drawn); the balance turns, so anywhere"),
  ('rollers','050403-1',None,None,"the impulse roller's hole Ø 1.3, 1.9 below its centre and 0.7 to the side (02 04 02, revised 10.9.41: sure), through it beside the staff: open, its use not given; the balance turns, so anywhere"),
  ('balance','050301-4',None,'3955',"Wempe 3955's poising holes, Ø 0.6 in two masses' roller-side faces (escapement.js, PH; 9_Wempe_3955_Hemmung.jpg): drilled to poise the balance, nothing goes in them; the balance turns, so anywhere"),
  ('dial','050200-4',[-5.02,10.35,50.25],None,"the dial's Ø 1 at 185.7° on Ø 101 (05 02 00-4, scaled), opposite its pin's at 6°, under the printed face (no Wempe or 6MX dial photographed shows it): nothing under it in the movement ring (05 08 00-3), its use not given"),
  *[('pillarPlate','050802-1',c,None,"the hand-setting work's bore Ø 2 (05 08 02-1's Schnitt C-D, 1.68 from the dial face) from the cut's window out through the rim (frame.js): "
   "empty on the clock too, the hand setting not fitted (05 33 isn't built: README); Wempe 3955's mouth in its rim's notch") for c in([-29.66,1.66,17.12],[-29.66,1.68,17.12],[-36.53,1.64,21.05])]]   # the ring's M2.6 above their screws in the flange were read at the bore's 5 µm step until 26 October 2026; bored without the step, holecheck finds no face there to read them
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

# fea.py --model wempe: the parts that hold the going train's pivots, solved as fea.py solves the Hamilton's (README, "Building it: the frame under load").
# Each arbor's two bearings, the dial side's first (train.js, fusee.js; the fusee's journal in the fusee bush, the escape arbor's jewels in the plates' settings, the
# intermediate and seconds arbors' dial-side bush and jewel in the intermediate bridge 05 08 04); each part's screws and what they go into (the top plate on the three
# pillars, holes 11, 39, 49; the barrel bridge and the fusee bush onto the top plate; the intermediate bridge onto the pillar plate's dial face); the pillar plate held
# in the movement ring on its rim (05 08 00-3). The cocks carry the balance alone, no load of the train's, and are left out. The pillars Ø 8.1 (05 08 00-1), 19.0 between the
# plates' inner faces (WD.INNER). The chain at each case's turn of the fusee (fusee.js: RFT, ac, from the blank's large end face F0 -5.925, which the groove's places are cut from; the face as re-turned F -6.125): fully wound at 8.75 turns, the floor r 9.355
# plus the chain's pitch line 1.02, 11.735 from the large end; run down at turn 0, r 17.25 + 1.02, in the flange's slot 1.195 from it; the barrel's pitch line r 41.6/2 + 1.02
# (wempe_strength.js's RB). The spring's moment at 05 06_20's level (wempe_physics.js: MupM; run down its solved Mdown at the same level, Kl).
FEA={'parts':['pillarPlate','topPlate','barrelBridge','fuseeBush','intermediateBridge'],'plate':'pillarPlate','field':'topPlate','gearing':'gearing_wempe.json',
  'at':{'Fu':[-16.708,-15.292],'Ba':[24.784,-6.0],'C':[0,0],'T':[9.91,15.17],'S':[0,23],'E':[-11.783,21.743]},
  'arb':{'Fu':['pillarPlate','fuseeBush'],'Ba':['pillarPlate','barrelBridge'],'C':['pillarPlate','topPlate'],'T':['intermediateBridge','topPlate'],'S':['intermediateBridge','topPlate'],'E':['pillarPlate','topPlate']},
  'turn':{'Fu':1,'Ba':1,'C':-1,'T':1,'S':-1,'E':1},
  'stages':[('Fu','C',90,14,'fuseeWheel','centreWheel'),('C','T',90,12,'centreWheel','intermediateWheel'),('T','S',80,10,'intermediateWheel','secondsWheel'),('S','E',80,10,'secondsWheel','escapeWheel')],
  'mods':[0.4356,0.35529,0.28066,0.26332],
  'fix':{'topPlate':[(-36.86,3.22,'pillars'),(6.42,-36.44,'pillars'),(18.5,32.04,'pillars')],'barrelBridge':[(32.04,18.5,'topPlate'),(17.37,-32.67,'topPlate')],
    'fuseeBush':[(-16.71,-20.49,'topPlate'),(-21.21,-12.69,'topPlate'),(-12.2,-12.69,'topPlate')],'intermediateBridge':[(-4.32,26.41,'pillarPlate'),(22.46,5.25,'pillarPlate')]},
  'pillarD':8.1,'pillarL':19.0,'rim':(41.5,42.6),'ringR':6.0,'rB':41.6/2+1.02,
  'chain':[('fully wound','Mup',9.355+1.02,-5.925-11.735),('run down','Mdn',17.25+1.02,-5.925-1.195)],
  'node':"const P=require('./wempe_physics.js');console.log(JSON.stringify({Mup:P.MupM,Mdn:P.FN.Mdown*P.LV.Kl}))"}

# assembly.py --model wempe: the movement taken apart in the order the Soviet Navy's repair book gives for the MX (Эксплуатация и ремонт измерителей времени, 1958,
# pp. 59-60, "Порядок разборки и сборки": References/wempe/documents/Ekspluatatsiya-i-remont-izmeritelei-vremeni-1958/p059.png, p060.png), the Einheits-Chronometer's
# Soviet copy, the same frame: the hands, the dial, the motion work and the up-and-down's pinion from the dial side; then dial down, the balance's (upper) cock with the
# balance, the detent's block ("колодка ходовой пружины": the detent is the "ходовая пружина", p. 60), the barrel arbor's ratchet, the barrel bridge, the fusee arbor's
# cork washer, flange and washer, the top plate on its three screws, and "all the parts". Its assembly is the same backwards (p. 59: the intermediate bridge on the
# pillar plate first, the lower cock on the top plate; the pinions, the fusee, the click, the fusee's ratchet and the escape pinion; the top plate; the barrel and its
# bridge; ...). Estimated where the book is silent: the barrel lifted out after its bridge (the book puts the barrel in after the top plate), and the order of "all the
# parts" as the assembly's reversed (the escape wheel, the maintaining detent, the fusee with its wheel and maintaining work, the seconds, centre and intermediate
# wheels), then the intermediate bridge off the dial side. Each step's parts as the model groups them (a part's own screws go with it).
# The detent's block in the book's place (25 October 2026): p. 59 "Снять колодку ходовой пружины" (take the detent's block off) after the balance and before the
# barrel's ratchet, p. 60 "Установить и привернуть колодку ходовой пружины к платине" (fit the block and screw it to the plate) last, after the balance; the lower cock
# stays on the top plate (p. 59: screwed to it first). The block hangs under the top plate's inner face between the plates, its end at the rim by a pillar, as Kirov
# No. 247's shows it (8_Kirow_247_F.jpg), and Kirov 14100's top plate off carries it on neither face (chasy.ru 9985, 96890BF4 and 9A7ACAC8): its fixing screw out of
# the plate's outer face (step 5), it drops 1.5 off its two steady pins (1.3 into the plate; 2 would meet the lower cock) and slides out under the plate between the
# pillars along -x (any heading from 150 to 180 degrees in plan is clear, 25 October 2026), its detent's stone drawn back out of the escape wheel's teeth (step 6).
# The stop work's bar lies in the fusee's small end under its cover plate, so it comes out with the fusee.
ASSEMBLY={'source':'the 1958 Soviet repair book\'s order for the MX, pp. 59-60','static':['pillarPlate','pillars','ring','escJewelLow','escEndstoneLow'],'split':{'detentBlock':-21},
  'steps':[(1,'the hands',['hands'],'dial'),(2,'the dial',['dial'],'dial'),
    (3,'the motion work, the cannon pinion and the up-and-down work',['hourWheel','changeWheel','cannon','udWheel','udPinion'],'dial'),
    (4,'the balance\'s cock and the balance',['upperCock','balance','hairspring','stud','rollers','balanceJewelsUp'],'train'),
    (5,'the detent\'s block\'s fixing screw, out of the top plate\'s outer face',['detentBlock.screws'],'train'),
    (6,'the detent\'s block with the detent, off its steady pins and out sideways under the top plate between the pillars',['detentBlock','detent'],{'path':[[0,1.5,0],[-45,1.5,0]]}),
    (7,'the barrel arbor\'s ratchet',['setupRatchet'],'train'),
    (8,'the barrel bridge',['barrelBridge'],'train'),(9,'the barrel with its arbor, mainspring and the chain (estimated)',['barrel','barrelArbor','mainspring','chain'],'train'),
    (10,'the fusee arbor\'s cork washer, flange and washer',['corkRing','dustBush','dustPlate'],'train'),
    (11,'the top plate, with its fusee bush, lower cock and jewels',['topPlate','fuseeBush','lowerCock','balanceJewelsLow','escJewelUp','escEndstoneUp'],'train'),
    (12,'the escape wheel',['escapeWheel'],'train'),(13,'the maintaining detent',['maintDetent'],'train'),
    (14,'the fusee with its wheel, maintaining work and stop work',['fusee','fuseeWheel','maintaining','coverPlate','vorreiber','stopWork'],'train'),
    (15,'the seconds wheel',['secondsWheel'],'train'),(16,'the centre wheel',['centreWheel'],'train'),(17,'the intermediate wheel',['intermediateWheel'],'train'),
    (18,'the intermediate bridge, off the dial side',['intermediateBridge'],'dial')],
  'expected':[(6,'detentBlock','lowerCock',"the block's upright hangs under the detent (05 04 01-4 read in first angle) and its end lies over the lower cock's lug, 0.28 above it (x -13.9 to -12.1, z 12.5-15.9, about 21 from the fixing screw at hole 13 and the steady pins beside it): the block is tilted off its pins, its base end dropping the pins' 1.3 while the upright's end drops 0.28, about 3 deg, then drawn out (estimated: the book says only 'remove the detent block'); a path of straight legs can't turn it. Every version but the first drawn has it (until 27 October 2026 only the escapement of 1943 and the 6MX, which the check doesn't run)"),
    (4,'corkRing|dustBush','balance',"a timing screw's head on the balance's rim (about 21 from the staff) lies under the fusee arbor's dust bush and cork washer at the frozen state's swing (x -14, z -8.3): the balance is turned until its screws are clear, as it is free to turn"),
    (4,'corkRing','upperCock',"the cock clears its seat 1.6 up, then the cork washer on the fusee arbor's end lies over its arm (1.6 into it in plan, x -10.3 to -8.7): it is drawn out sideways from under the washer (estimated), or the washer comes off first"),
    (9,'chain','fusee|topPlate|coverPlate|stopWork',"the chain is unhooked from the fusee and unwound off its groove, not lifted (the book lets the spring down first)"),
    (11,'lowerCock|balanceJewelsLow','escapeWheel',"only the escape wheel's teeth overlap them in plan (5.8-6.9 from its arbor: the root circle r 6.05, the tips 7; the 0.2 under the root is the raster's 0.2 mm columns): the lower cock's lug and its jewel's setting pass between two teeth, the wheel turned to a gap, as the book has the escape wheel in before the top plate with the lower cock on it"),
    (11,'topPlate','maintDetent',"the maintaining detent's screw, its head on the top plate's outer face (x -10, z -38.7), is taken out before the plate; the detent comes out at step 13")]}

# dfm.py --model wempe: how a finding on a piece is cut, where its sections mislead (a helix sectioned level by level shows slivers no mill cuts)
DFM={'notes':{'050405-1':"the web's recess, Ø 11.62 and 0.6 deep (05 04_7.2 scales 11.65), lies 0.04 inside the teeth's floor Ø 11.7: in each gap between the teeth a sliver of brass about 0.04 wide stands 0.6 high between the recess and the gap; a maker turns the recess to the floor's Ø 11.7 (the gaps then open into it) or leaves it under Ø 11.3",
  '050604-2':"the chain's groove is cut on a fusee engine (05 06 04-2: a helix of pitch 1.2, square-cut lands 0.87): its sections' thin slivers are the helix, not slots for a mill"}}
