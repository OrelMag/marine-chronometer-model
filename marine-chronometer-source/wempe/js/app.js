/* app.js: the Wempe Einheits-Chronometer's page: its parts' cards, views, sections, labels and link state, given to the shared viewer (../shared/viewer.js, VIEWER).
   Part of the Wempe model (three.js r128). P1a (14 October 2026): the frame, from its sheets (js/frame.js, dims.js). */

/* ================= parts registry ================= */
/* Every named part: t name, d what it does (the card), sp drawing numbers and sizes, g its group (PG), c its colour in Colour by part, pri label priority, plate: a plate
   (see-through with See-through), src: where its shape and size come from (SRC), sn: what came from where, figs: the sheets that show it (References/wempe/drawings/,
   by the file's page number). A part's meshes carry its key as userData.partName (movement.js) */
const SRC={drawing:['The drawings','#2e9d5b','Wempe’s works drawings: a figure on the sheet, or the hole tables’ coordinates'],scaled:['Scaled','#c9a227','measured on a drawing at its scale, or on a photograph of a real one, where the sheet gives no figure'],est:['Estimated','#8f969d','no sheet in the set gives it: sized from the coloured section or a photograph of Wempe 3955']};
const PG=['Frame'];
const SH=' The drawings are the sheets as last revised (about 1946-48).';
const PARTS={
  pillarPlate:{t:'Pillar plate (Unterplatte)',g:0,src:'drawing',sn:'Every hole from its table and sections; the notch for the ring’s pin from the ring’s sheet',figs:'05 08_3a, 05 08_3b, 05 08_32.2, 001',c:'#9fb4c8',plate:1,pri:3,
    d:'The lower plate, under the dial: the foundation of the movement. The three pillars stand in seats turned in its inner face, each held by a screw from the dial side; it sits in the movement ring. It carries the train’s lower pivots, the intermediate bridge on its dial side across the opening for the intermediate wheel, and the motion work under the dial. Every hole of its table is cut, for the parts still to come, but the hand-setting work’s, which its sheet strikes through (“only when the hand-setting is fitted”), and the seconds contact’s (“only when needed”).'+SH,
    sp:'Drawing 05 08 02-1 (kompl. 05 08 02) · special α-β brass sheet · Ø 85 h6 × 3.35 · pillar holes Ø 4.50 +0.012 on r 37, seated Ø 8.6 × 0.3 · opening for the intermediate wheel Ø 24.5'},
  topPlate:{t:'Top plate (Oberplatte)',g:0,src:'drawing',sn:'Every hole from its table and sections; the balance opening’s tongue scaled on the sheet',figs:'05 08_1a, 05 08_1b, 05 08_2, 001',c:'#c9d8a8',plate:1,pri:3,
    d:'The upper plate, on the train side, a crescent: it is cut away round the barrel, which the barrel bridge holds. It carries the train’s upper pivots, the fusee’s bush, the two balance cocks (the lower one hangs under it) and the balance holding work in a pocket in its inner face. The three small windows beside the pillars are its auxiliary holes 3, 12 and 40.'+SH,
    sp:'Drawing 05 09 01 (kompl. 05 08 01) · special α-β brass sheet · Ø 85 h6 × 3.35 · barrel cut Ø 42.5 · recess Ø 22 × 0.7 round the fusee · pocket 1.35 deep'},
  pillars:{t:'Pillars (Pfeiler)',g:0,src:'drawing',sn:'Every size from its sheet but its countersinks and relief grooves, scaled on it',figs:'05 08_11, 001',c:'#707a84',pri:2,
    d:'Three turned brass pillars hold the plates 19 mm apart. Each sits by its shoulders in a seat in each plate, its spigots in the plates’ reamed holes, a screw from each plate’s outer face in its tapped ends.',
    sp:'Drawing 05 08 00-1 · Ms 58 · body Ø 8.1, 19.6 between the shoulders, 25.3 overall · spigots Ø 4.5 f7 × 2.8 · tapped M2.6 from both ends'},
  ring:{t:'Movement ring (Werkring)',g:0,src:'drawing',sn:'Its diameters, heights and holes from its sheet; the depths its sheet leaves open fitted from its figures (README)',figs:'05 08_7',c:'#b6bcc2',pri:2,
    d:'The ring the movement hangs in, in the case: the pillar plate sits in its seat on a lip, held by three screws whose heads bear on the plate’s rim, and the dial lies in a recess in its flange. Below the lip the ring opens out at 45° toward the dial.',
    sp:'Drawing 05 08 00-3 (revised 6.12.46) · Ø 105.95 × 10.7 · seat Ø 85 H9 × 3 · dial recess Ø 104.0 +0.1 × 0.7 · three M2.6 on Ø 89'},
  barrelBridge:{t:'Barrel bridge (Federhausbrücke)',g:0,src:'drawing',sn:'Its outline and holes from its sheet; its screws’ and the click screw’s sizes from the coloured section',figs:'05 08_12, 05 08_13, 05 08_14',c:'#d9b36a',pri:2,
    d:'A crescent bridge on the top plate over the barrel, its outer edge turned with the plate’s rim, carrying the barrel arbor’s upper pivot and the click that holds the mainspring’s set-up.',
    sp:'Drawing 05 08 05-1 (kompl. 05 08 05) · Ms 58 sheet · 3.32 thick · chord 73.5, 24 wide'},
  fuseeBush:{t:'Fusee bush (Schneckenfutter)',g:0,src:'drawing',sn:'Every size from its sheet; its screws from the coloured section',figs:'05 08_8, 05 08_2',c:'#e0b45c',pri:1,
    d:'A flanged brass bush pressed into the top plate and screwed to it, in which the fusee arbor’s winding end turns.',
    sp:'Drawing 05 08 01-2 · Ms 58 · Ø 8 T6 into the plate, flange Ø 13.2 × 1.5, 7.1 high, bore 4.1'},
  dustBush:{t:'Dust bush (Staubfutter)',g:0,src:'drawing',sn:'Every size from its sheet; which way its flat faces from the balance cock’s place',figs:'05 08_9, 05 08_2',c:'#c79a4a',pri:1,
    d:'A tall brass bush on the fusee bush round the winding square, up to the case’s winding hole, keeping dust out of the movement. A flat on its collar clears the balance cock.',
    sp:'Drawing 05 08 01-3 · Ms 58 · 18.1 long, Ø 13.1, collar Ø 15.1 with a flat at 14.1, bore Ø 8 H7 at 1:70'},
  upperCock:{t:'Upper balance cock (Unruhkloben oben)',g:0,src:'drawing',sn:'Every size from its sheet; the relief under its arm from it and from 127-556.04 U30',figs:'05 08_5, 05 08_6',c:'#a8c49a',pri:2,
    d:'The cranked cock over the balance, screwed and pinned to the top plate, holding the balance staff’s upper jewel setting over the opening in the plate.',
    sp:'Drawing 05 08 03-1 · Ms 58 profile · 49 long, 15 high, foot 3.2 · setting seat Ø 5.2 H7'},
  lowerCock:{t:'Lower balance cock (Unruhkloben unten)',g:0,src:'drawing',sn:'Every size from its sheet',figs:'05 08_4',c:'#8fb3a8',pri:2,
    d:'A block screwed and pinned under the top plate, inside the frame, whose lug holds the balance staff’s lower jewel setting about 10 mm under the plate: the balance swings above the plate, its escapement under it.',
    sp:'Drawing 05 08 00-2 (revised 2.12.46) · Ms 58 profile · bar 20 × 8 × 10, lug 3.22 thick · setting seat Ø 5.2 H7'},
  intermediateBridge:{t:'Intermediate bridge (Zwischenbrücke)',g:0,src:'scaled',sn:'Its holes’ places from the plate’s table; its outline and thickness scaled on its assembly sheet',figs:'05 08_10, 05 08_32.2',c:'#d6c08a',pri:1,
    d:'A straight bridge on the pillar plate’s dial side, across the opening for the intermediate wheel: it carries that wheel’s lower jewel and the seconds wheel’s lower setting.',
    sp:'Drawing 05 08 04 (the bridge 05 08 04-1 not in the set) · about 45.5 × 10 × 3.8 · screws 34.13 apart'}};
/* the pieces of the parts that are several things: k its key (part.k), t name, h the parts-list lines (bom.json ids) its meshes carry, d, sp, and src, sn, figs where they differ */
const PIN='A steady pin (Stellstift), Ø 1.6, pressed into the part and standing 1.3 out of it into a reamed hole in the plate, which places the part.';
const PIECES={
  pillarPlate:[{k:'plate',t:'Pillar plate',h:'050802-1',d:PARTS.pillarPlate.d,sp:PARTS.pillarPlate.sp},
    {k:'screws',t:'Pillar screws, dial side',h:'WN-56',d:'Three pillar screws (WN-56) from the dial side into the pillars’ tapped ends, brass as Wempe 3955’s.',sp:'M2.6 · heads Ø 6.4 × 3.0',src:'est',sn:'The thread from the pillar’s sheet; the heads from the coloured section and Wempe 3955’s photograph',figs:'001'}],
  topPlate:[{k:'plate',t:'Top plate',h:'050901',d:PARTS.topPlate.d,sp:PARTS.topPlate.sp},
    {k:'screws',t:'Pillar screws, train side',h:'WN-57',d:'Three pillar screws (WN-57) from the top plate’s outer face into the pillars’ tapped ends, brass as Wempe 3955’s.',sp:'M2.6 · heads Ø 6.4 × 3.0',src:'est',sn:'The thread from the pillar’s sheet; the heads from the coloured section and Wempe 3955’s photograph',figs:'001'}],
  ring:[{k:'ring',t:'Movement ring',h:'050800-3',d:PARTS.ring.d,sp:PARTS.ring.sp},
    {k:'screws',t:'Movement ring screws',h:'WN-rs',d:'Three screws in the ring whose heads bear on the pillar plate’s rim, holding it in its seat (their WN number not read).',sp:'M2.6 on Ø 89 · heads Ø 6.2 × 2.25',src:'est',sn:'The thread and places from the ring’s sheet and Wempe 3955; the heads and length from the coloured section',figs:'05 08_7'},
    {k:'pin',t:'Plate’s pin',h:'WN-201',d:'A pin (WN-201) Ø 1 drilled in across the joint of the plate and the ring at assembly, which sets the movement’s turn in the ring.',sp:'Ø 1',src:'est',sn:'Its place and size from the ring’s sheet; its length from the coloured section, shortened to stay in the ring',figs:'05 08_7'}],
  barrelBridge:[{k:'bridge',t:'Barrel bridge',h:'050805-1',d:PARTS.barrelBridge.d,sp:PARTS.barrelBridge.sp},
    {k:'click',t:'Click (Sperrkegel)',h:'050805-2',d:'The click on the barrel’s ratchet, which holds the mainspring’s set-up. It is cut from spring-hard brass, so it is its own spring: no separate spring is drawn.',sp:'Drawing 05 08 05-2 (revised 25.5.48) · Ms 58 federhart · 17.4 × 2.6',src:'drawing',sn:'Its outline from its sheet; its turn on the bridge traced on Wempe 3955',figs:'05 08_14'},
    {k:'clickScrew',t:'Click screw',h:'WN-22',d:'The shouldered screw the click turns on.',sp:'WN-22 · M2.6, shoulder Ø 3.1',src:'est',sn:'Sized on the coloured section',figs:'05 08_12'},
    {k:'screws',t:'Barrel bridge screws',h:'WN-55',d:'Two screws holding the bridge to the top plate.',sp:'WN-55 · M2.6 · heads Ø 6.4 × 3.0',src:'est',sn:'Sized on the coloured section and Wempe 3955',figs:'05 08_13'},
    {k:'pins',t:'Barrel bridge steady pins',h:'WN-203.bb',d:PIN+' WN-203.',sp:'Ø 1.6, 1.3 proud',src:'drawing',sn:'Their places and protrusion from the bridge’s sheets; their length as the cock’s',figs:'05 08_12, 05 08_13'}],
  fuseeBush:[{k:'bush',t:'Fusee bush',h:'050801-2',d:PARTS.fuseeBush.d,sp:PARTS.fuseeBush.sp},
    {k:'screws',t:'Fusee bush screws',h:'WN-34',d:'Three small screws holding the bush’s flange to the top plate.',sp:'WN-34 · M1.4',src:'est',sn:'Their places from the sheets; their size from the coloured section',figs:'05 08_8, 05 08_2'}],
  upperCock:[{k:'cock',t:'Upper balance cock',h:'050803-1',d:PARTS.upperCock.d,sp:PARTS.upperCock.sp},
    {k:'screw',t:'Upper cock screw',h:'WN-ucs',d:'The blued screw holding the cock to the top plate.',sp:'M2.6 · head Ø 6.4 × 3.0',src:'est',sn:'Sized on the coloured section and Wempe 3955',figs:'05 08_5'},
    {k:'pins',t:'Upper cock steady pins',h:'WN-203.uc',d:PIN,sp:'Ø 1.6, 3 long',src:'drawing',sn:'Their places from the cock’s table; their length from 127-556.04 U30',figs:'05 08_5, 05 08_6'}],
  lowerCock:[{k:'cock',t:'Lower balance cock',h:'050800-2',d:PARTS.lowerCock.d,sp:PARTS.lowerCock.sp},
    {k:'screw',t:'Lower cock screw',h:'WN-53',d:'The screw from the top plate’s outer face, its head sunk in the plate, into the cock.',sp:'WN-53 · M2.6 · head Ø 5.8 × 1.7',src:'est',sn:'Sized on the coloured section',figs:'05 08_1b'},
    {k:'pins',t:'Lower cock steady pins',h:'WN-203.lc',d:PIN,sp:'Ø 1.6, 3 long',src:'drawing',sn:'Their places from the cock’s table; their length as the upper cock’s',figs:'05 08_4'}],
  intermediateBridge:[{k:'bridge',t:'Intermediate bridge',h:'050804-1',d:PARTS.intermediateBridge.d,sp:PARTS.intermediateBridge.sp},
    {k:'screws',t:'Intermediate bridge screws',h:'WN-52',d:'Two screws from the dial side, their heads sunk in the bridge, into the pillar plate.',sp:'WN-52 · M2.6',src:'est',sn:'Sized on the assembly sheet and Wempe 3955',figs:'05 08_10, 05 08_32.2'},
    {k:'pins',t:'Intermediate bridge steady pins',h:'WN-203.zb',d:PIN+' WN-203.',sp:'Ø 1.6, 1.3 proud',src:'drawing',sn:'Their places from the plate’s table; their protrusion from the bridge’s sheet',figs:'05 08_10'}]};

/* ================= views ================= */
/* the camera's turn (yaw), height (pitch, rad) and distance, aimed at a point in the movement's frame. The movement stands train side up (the scene's group turns it over) */
const VIEWS={
  movement:{yaw:2.5,pitch:0.6,dist:250,target:[0,-11,0]},
  plan:{yaw:Math.PI,pitch:1.52,dist:270,target:[0,-11,0]},   /* straight down on the top plate, 12 o'clock at the top (so 3 o'clock on the left, as the sheets draw the Oberplatte: their O to the right) */
  dial:{yaw:Math.PI,pitch:-1.2,dist:270,target:[0,-11,0]},   /* from below, on the pillar plate's dial side */
  side:{yaw:Math.PI/2,pitch:0.04,dist:300,target:[0,-16,0],fov:20},
  exploded:{yaw:2.2,pitch:0.3,dist:400,target:[0,-34,0],explode:1}};
const VIEW_DESC={movement:'The movement, train side up.',plan:'The top plate from straight above, 12 o’clock at the top.',dial:'The pillar plate’s dial side, from below.',side:'The frame from the side: the plates on their pillars in the movement ring, the cocks and the dust bush over the top plate.',exploded:'Every part lifted apart along the pillars.'};
const SECDEF={x:{n:[-1,0,0],min:-44,max:44,def:-6.425},z:{n:[0,0,1],min:-44,max:44,def:3.225},y:{n:[0,1,0],min:-42,max:12,def:-9.5}};   /* the 12-6 and 3-9 planes through a pillar (nos. 49 and 11), and across the pillars between the plates */

/* ================= the page ================= */
(function(){let mv=null;
  const V=VIEWER.start({name:'the Wempe Einheits-Chronometer',shot:'wempe-einheitschronometer',store:'we',PARTS,PIECES,SRC,PG,figLabel:'Sheets',VIEWS,VIEW_DESC,startView:'movement',SECDEF,
    build:M=>{const root=new THREE.Group();mv=buildWempe(M);mv.rotation.x=Math.PI;root.add(mv);return{root,mv};},   /* the movement train side up */
    qaTarget:[0,-11,0],   /* between the plates: what __proj, __unproj and __cam aim at */
    /* labels, each in its part's own frame, so they follow the Exploded view */
    labels:(add,pw)=>{const P=mv.userData.parts,c=WD.PILLARS[2];
      add('Pillar plate','Unterplatte, 05 08 02-1','pillarPlate',pw(P.pillarPlate,-30,WD.PP_T,26));
      add('Top plate','Oberplatte, 05 09 01','topPlate',pw(P.topPlate,-28,-WD.INNER-WD.TOP_T,-20));
      add('Pillar','Pfeiler, 05 08 00-1','pillars',pw(P.pillars,c[0]+WD.PIL.r,-WD.INNER/2,c[1]));const H=WD.H,TT=WFRAME.TT,TI=WFRAME.TI;
      add('Movement ring','Werkring, 05 08 00-3','ring',pw(P.ring,0,11.05,50));
      add('Barrel bridge','Federhausbrücke, 05 08 05-1','barrelBridge',pw(P.barrelBridge,32,TT-3.32,4));
      add('Upper balance cock','Unruhkloben oben, 05 08 03-1','upperCock',pw(P.upperCock,H[9][0],TT-15,H[9][1]));
      add('Lower balance cock','Unruhkloben unten, 05 08 00-2','lowerCock',pw(P.lowerCock,H[36][0],TI+10,H[36][1]));
      add('Dust bush','Staubfutter, 05 08 01-3','dustBush',pw(P.dustBush,H[10][0]-6.55,TT-12,H[10][1]));
      add('Intermediate bridge','Zwischenbrücke, 05 08 04','intermediateBridge',pw(P.intermediateBridge,H[38][0],WD.PP_T+3.8,H[38][1]));},
    hud:st=>`The frame, from its drawings${st.speed!==1?`&ensp;<b>${st.speed?st.speed+'×':'stopped'}</b>`:''}`});
  if(V&&/[?&]qa\b/.test(location.search))window.__V=V;   /* the viewer's state, for the tools */
})();
