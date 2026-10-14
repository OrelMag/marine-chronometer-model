/* app.js: the Wempe Einheits-Chronometer's page: its parts' cards, views, sections, labels and link state, given to the shared viewer (../shared/viewer.js, VIEWER).
   Part of the Wempe model (three.js r128). P0 (14 October 2026): the frame only, its dimensions provisional (dims.js). */

/* ================= parts registry ================= */
/* Every named part: t name, d what it does (the card), sp drawing numbers and sizes, g its group (PG), c its colour in Colour by part, pri label priority, plate: a plate
   (see-through with See-through), src: where its shape and size come from (SRC), sn: what came from where, figs: the sheets that show it (References/wempe/drawings/,
   by the file's page number). A part's meshes carry its key as userData.partName (movement.js) */
const SRC={drawing:['The drawings','#2e9d5b','Wempe’s works drawings, read off the sheet'],est:['Estimated','#8f969d','no sheet read yet gives its size or shape']};
const PG=['Frame'];
const PARTS={
  pillarPlate:{t:'Pillar plate (Unterplatte)',g:0,src:'drawing',sn:'Its diameter and the pillar holes, their places and seats, from the drawings; its thickness provisional (struck through on its sheet)',figs:'05 08_3a, 001',c:'#9fb4c8',plate:1,pri:3,
    d:'The lower plate, under the dial: the foundation of the movement. The three pillars stand on it, their shoulders in seats turned in its inner face, each held by a screw from the dial side. Here only the plate and its pillar holes, provisionally: its other holes, the motion work under the dial and the up-and-down work come with the frame drawings.',
    sp:'Drawing 05 08 02-1 · Ø 85 h6, 3.35 thick (provisional) · pillar holes Ø 4.50 +0.012, 37.00 from the centre, seated Ø 8.6 × 0.3'},
  topPlate:{t:'Top plate (Oberplatte)',g:0,src:'drawing',sn:'Its diameter, thickness and the pillar holes, their places and seats, from the drawings',figs:'05 08_1a, 05 08_1b, 001',c:'#c9d8a8',plate:1,pri:3,
    d:'The upper plate, on the train side. It carries the train’s upper pivots, and the balance cock and the barrel bridge are screwed to it; round the barrel it is cut away (sheet 05 08_1b). Here only the plate and its pillar holes, provisionally: the rest of the plate comes with the frame drawings.',
    sp:'Drawing 05 09 01, as its title block numbers it (the plate of Oberplatte kompl., 05 08 01) · Ø 85 h6, 3.35 thick · pillar holes as the pillar plate’s'},
  pillars:{t:'Pillars (Pfeiler)',g:0,src:'drawing',sn:'Every size from its sheet but its countersinks, read off the drawing',figs:'05 08_11, 001',c:'#707a84',pri:2,
    d:'Three turned brass pillars hold the plates 19 mm apart. Each sits by its shoulders in a seat in each plate, its spigots in the plates’ reamed holes, a screw from each plate’s outer face in its tapped ends.',
    sp:'Drawing 05 08 00-1 · Ms 58 · body Ø 8.14, 19.6 between the shoulders, 25.3 overall · spigots Ø 4.5 f7 × 2.8 · tapped M2.6 from both ends'}};
/* the pieces of the parts that are several things: k its key (part.k), t name, h the parts-list lines (bom.json ids) its meshes carry, d, sp, and src, sn, figs where they differ */
const SCRD='M2.6, from the plate’s outer face into the pillar’s tapped end. The heads, Ø 6.6, are measured on sheet 001; the screws’ own standard sheet (WN) is not read yet, so the heads’ height and the screws’ length are estimated.';
const PIECES={
  pillarPlate:[{k:'plate',t:'Pillar plate',h:'050802-1',d:PARTS.pillarPlate.d,sp:'Drawing 05 08 02-1'},
    {k:'screws',t:'Pillar screws, dial side',h:'WN-pil.d',d:'Three pillar screws from the dial side: '+SCRD,sp:'M2.6 · heads Ø 6.6',src:'est',sn:'The thread from the pillar’s sheet, the heads measured on sheet 001, the rest estimated',figs:'001'}],
  topPlate:[{k:'plate',t:'Top plate',h:'050901',d:PARTS.topPlate.d,sp:'Drawing 05 09 01'},
    {k:'screws',t:'Pillar screws, train side',h:'WN-pil.t',d:'Three pillar screws from the train side: '+SCRD,sp:'M2.6 · heads Ø 6.6',src:'est',sn:'The thread from the pillar’s sheet, the heads measured on sheet 001, the rest estimated',figs:'001'}]};

/* ================= views ================= */
/* the camera's turn (yaw), height (pitch, rad) and distance, aimed at a point in the movement's frame. The movement stands train side up (the scene's group turns it over) */
const VIEWS={
  movement:{yaw:2.5,pitch:0.6,dist:250,target:[0,-11,0]},
  plan:{yaw:Math.PI,pitch:1.52,dist:270,target:[0,-11,0]},   /* straight down on the top plate, 12 o'clock at the top (so 3 o'clock on the left, as the sheets draw the Oberplatte: their O to the right) */
  dial:{yaw:Math.PI,pitch:-1.2,dist:270,target:[0,-11,0]},   /* from below, on the pillar plate's dial side */
  side:{yaw:Math.PI/2,pitch:0.04,dist:260,target:[0,-11,0],fov:20},
  exploded:{yaw:2.2,pitch:0.3,dist:330,target:[0,-31,0],explode:1}};
const VIEW_DESC={movement:'The movement, train side up.',plan:'The top plate from straight above, 12 o’clock at the top.',dial:'The pillar plate’s dial side, from below.',side:'The frame from the side: the plates on their pillars.',exploded:'Every part lifted apart along the pillars.'};
const SECDEF={x:{n:[-1,0,0],min:-44,max:44,def:-6.425},z:{n:[0,0,1],min:-44,max:44,def:3.225},y:{n:[0,1,0],min:-23,max:4,def:-9.5}};   /* the 12-6 and 3-9 planes through a pillar (nos. 49 and 11), and across the pillars between the plates */

/* ================= the page ================= */
(function(){let mv=null;
  const V=VIEWER.start({name:'the Wempe Einheits-Chronometer',shot:'wempe-einheitschronometer',store:'we',PARTS,PIECES,SRC,PG,figLabel:'Sheets',VIEWS,VIEW_DESC,startView:'movement',SECDEF,
    build:M=>{const root=new THREE.Group();mv=buildWempe(M);mv.rotation.x=Math.PI;root.add(mv);return{root,mv};},   /* the movement train side up */
    qaTarget:[0,-11,0],   /* between the plates: what __proj, __unproj and __cam aim at */
    /* labels, each in its part's own frame, so they follow the Exploded view */
    labels:(add,pw)=>{const P=mv.userData.parts,c=WD.PILLARS[2];
      add('Pillar plate','Unterplatte, 05 08 02-1','pillarPlate',pw(P.pillarPlate,-30,WD.PP_T,26));
      add('Top plate','Oberplatte, 05 09 01','topPlate',pw(P.topPlate,-28,-WD.INNER-WD.TOP_T,-20));
      add('Pillar','Pfeiler, 05 08 00-1','pillars',pw(P.pillars,c[0]+WD.PIL.r,-WD.INNER/2,c[1]));},
    hud:st=>`The frame alone, its sizes provisional${st.speed!==1?`&ensp;<b>${st.speed?st.speed+'×':'stopped'}</b>`:''}`});
  if(V&&/[?&]qa\b/.test(location.search))window.__V=V;   /* the viewer's state, for the tools */
})();
