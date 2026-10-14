/* app.js: the Wempe Einheits-Chronometer's page: its parts' cards, views, sections, labels and link state, given to the shared viewer (../shared/viewer.js, VIEWER).
   Part of the Wempe model (three.js r128). P1a (14 October 2026): the frame, from its sheets (js/frame.js, dims.js); P1d: the balance and escapement (js/escapement.js). */

/* ================= parts registry ================= */
/* Every named part: t name, d what it does (the card), sp drawing numbers and sizes, g its group (PG), c its colour in Colour by part, pri label priority, plate: a plate
   (see-through with See-through), src: where its shape and size come from (SRC), sn: what came from where, figs: the sheets that show it (References/wempe/drawings/,
   by the file's page number). A part's meshes carry its key as userData.partName (movement.js) */
const SRC={drawing:['The drawings','#2e9d5b','Wempe’s works drawings: a figure on the sheet, or the hole tables’ coordinates'],scaled:['Scaled','#c9a227','measured on a drawing at its scale, or on a photograph of a real one, where the sheet gives no figure'],est:['Estimated','#8f969d','no sheet in the set gives it: sized from the coloured section or a photograph of Wempe 3955']};
const PG=['Frame','Balance','Escapement'];
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
    sp:'Drawing 05 08 04 (the bridge 05 08 04-1 not in the set) · about 45.5 × 10 × 3.8 · screws 34.13 apart'},
  balance:{t:'Balance (Unruh)',g:1,src:'drawing',sn:'Its rim, arm, staff and hub from their sheets; the masses, timing weights and screws scaled on 05 03_2 and Wempe 3955',figs:'05 03_2, 05 03_4, 05 04_4',c:'#c7a35a',pri:3,
    d:'The balance: a cut bimetallic rim, nickel steel inside and brass outside, made in one with its straight steel arm, so each quarter of the rim curls in as it warms and carries its mass nearer the staff. Four round brass masses sit across the rim, two timing weights on screws at the arm’s ends. It sits on the brass hub of its staff just above the top plate, its rollers under the plate. It swings about 1¼ turns, twice a second.',
    sp:'Drawings 05 03 01, rim 05 03 01-1 (nickel steel and brass), staff 05 04 02 (29.5.46) · rim Ø 32.32 × 3.8 · arm 1.15 thick · staff 25.9 between its pivots, pivots Ø 0.21'},
  hairspring:{t:'Hairspring (Spiralfeder)',g:1,src:'drawing',sn:'Its strip, coil, turns and terminal curve from its sheets; the outer curve drawn in proportion to end at the stud',figs:'05 03_6, 05 03_7, 05 03_8',c:'#3c4a70',pri:2,
    d:'The helical balance spring: a polished steel strip 0.52 × 0.285 wound in 13 turns, its two ends curved in to the centre on the drawn terminal curve, so the coils open and close concentrically about the staff. Its inner end is pinned in the brass collet on the staff, its outer end in the stud on the cock.',
    sp:'Drawings 05 03 02-1 (Spiralfaden, Bandstahl 0.52 × 0.285), curve 05 03 10 (So. 04 03 10), collet 05 03 02-2 · Ø 12.8 outside · 15 turns left-hand as wound, 13 less 3.5 mm as fitted'},
  stud:{t:'Hairspring stud (Klötzchen)',g:1,src:'drawing',sn:'Its every size from its sheet; its place on the cock from the cock’s slot',figs:'05 03_9, 05 08_5',c:'#d9b36a',pri:1,
    d:'A small brass L screwed on the balance cock: its upright drops through the slot in the cock’s arm and holds the hairspring’s outer end, pinned in a slot at its foot. Slid along the cock’s slot it sets the spring’s pinning point.',
    sp:'Drawing 05 03 02-3 · Flachmessing Ms 58 · bar 14.6 × 3.1, upright 1.8 g6 × 6.1'},
  rollers:{t:'Impulse and discharge rollers (Heberolle, Auslöserolle)',g:2,src:'drawing',sn:'The impulse roller from its sheet; the discharge roller scaled on the escapement’s layout',figs:'05 04_1, 05 04_6',c:'#c98d52',pri:2,
    d:'Two rollers on the balance staff under the top plate. The impulse roller carries the sapphire impulse stone, which a tooth of the escape wheel pushes on every other swing; the hollow in its edge lets the tooth reach the stone. The small discharge roller below it carries the discharge stone, which pushes the gold spring and lifts the detent on that swing, and slips past it on the other.',
    sp:'Drawings 02 04 02 (Heberolle, beryllium copper, Ø 6.78 × 1.6) and 05 04 04-1 (not in the set) · stones 1.7 wide'},
  escapeWheel:{t:'Escape wheel (Gangrad)',g:2,src:'drawing',sn:'Its teeth, rim and crossings from its tooth-form sheet and the layout; its arbor and pinion from theirs',figs:'05 04_1, 05 04_7.1, 05 04_7.2, 05 04_8, 05 04_23',c:'#e0bd74',pri:3,
    d:'The 15-tooth escape wheel, just under the top plate, held by the locking stone between impulses. Released, it gives the balance’s impulse stone a push through about 20 degrees and comes to rest on the next tooth: a tooth every half second, so its pinion turns the seconds wheel once a minute.',
    sp:'Drawings 05 04 05-1 (Gangrad, Ms 63 spring-hard), 05 04 05-2 (pinion z 10, m 0.263), 02 04 08a (tooth form) · tips Ø 14.00, roots Ø 12.1 · 1.4 at the rim · arbor 22.8'},
  detent:{t:'Spring detent (Gangfeder) and gold spring',g:2,src:'drawing',sn:'The detent’s sizes from Grießbach’s sheet 1436 (the bracketed finished sizes) and its lengths scaled on it; the gold spring from its sheet; their places from the layout',figs:'05 04_1, 05 04_2, 05 04_10.1, 05 04_10.2',c:'#9fb4c8',pri:2,
    d:'The detent: a steel blade on a thin spring, clamped by its foot to the block. The locking stone in its pipe holds a tooth of the escape wheel. On one swing the discharge stone pushes the gold spring against the detent’s horn and lifts the detent through a quarter of a millimetre, freeing the wheel; on the other it only bends the gold spring aside.',
    sp:'Drawings 05 04 01-1 (1436, Grießbach, 17.2.43, steel), gold spring 05 04 01-2 (8-carat gold, 0.15 × 15.4), locking stone 05 04 01-3 Ø 0.75'},
  detentBlock:{t:'Detent block (Gangfederkloben)',g:2,src:'drawing',sn:'Every size from its sheet; which face lies on the plate inferred from the detent’s height',figs:'05 04_3, 05 04_1',c:'#d6c08a',pri:1,
    d:'The brass L under the top plate that carries the detent: screwed up from the plate’s outer face through hole 13, placed by two steady pins. The detent’s foot is clamped to the end of its base; a screw crosses the slit end of its upright.',
    sp:'Drawing 05 04 01-4 (8.7.43) · base 14.6 × 7.5 × 6.5, upright 3 × 3, 25 overall · fixing screw M1.7'},
  balanceJewelsUp:{t:'Balance jewels, upper',g:1,src:'est',sn:'The seat from the cock’s sheet; the settings and stones as the coloured section draws them, sized to the seat',figs:'05 08_5, 05 08_6',c:'#c8163c',pri:1,
    d:'The balance staff’s upper bearing in the cock: a hole jewel in its setting, put in from below with its flange in the cock’s sink, and an endstone in its own setting above, held by two screws over its edge.',
    sp:'Settings 05 04 06-2 and 05 04 08-2, stones 05 04 07-1 and 05 04 08-1 (by the coloured section’s labels) · seat Ø 5.2 H7'},
  balanceJewelsLow:{t:'Balance jewels, lower',g:1,src:'est',sn:'The seat from the lower cock’s sheet; the settings and stones as the coloured section draws them',figs:'05 08_4',c:'#c8163c',pri:1,
    d:'The balance staff’s lower bearing in the lug of the lower cock: the hole jewel and the endstone, each in its setting, put in from below and held by two screws.',
    sp:'Settings 05 04 06-2 and 05 04 08-2, stones 05 04 07-1 and 05 04 08-1 · seat Ø 5.2 H7 · screws WN-16'},
  escEndstoneUp:{t:'Escape wheel endstone, upper',g:2,src:'est',sn:'The seat from the top plate’s section P-Q; the setting as the coloured section draws it',figs:'05 08_1b',c:'#c8163c',pri:1,
    d:'The endstone over the escape wheel arbor’s upper pivot, in its setting pressed up into the top plate’s seat.',
    sp:'Setting 05 04 08-2, endstone 05 04 08-1 · seat Ø 5.2 H7'},
  escJewelUp:{t:'Escape wheel jewel, upper',g:2,src:'est',sn:'Its seat and screw holes from the top plate’s section P-Q; the setting as the coloured section draws it',figs:'05 08_1b',c:'#c8163c',pri:1,
    d:'The escape wheel arbor’s upper hole jewel, in its setting flush with the top plate’s inner face, held by two screws whose heads lie over its edge.',
    sp:'Setting 05 04 06-2, jewel 05 04 06-1 (for the Ø 0.24 pivot) · two M1.2'},
  escJewelLow:{t:'Escape wheel jewel, lower',g:2,src:'est',sn:'Its hole from the pillar plate’s table (reamed 2.50); the bush as the coloured section draws it',figs:'05 08_3a, 05 08_3b',c:'#c8163c',pri:1,
    d:'The escape wheel arbor’s lower hole jewel, in a bush pressed into the pillar plate.',
    sp:'Setting 05 04 06-2, jewel 05 04 06-1 · hole Ø 2.50'},
  escEndstoneLow:{t:'Escape wheel endstone, lower',g:2,src:'est',sn:'Its screw holes from the pillar plate’s table; the cap’s outline estimated',figs:'05 08_3b',c:'#c8163c',pri:1,
    d:'The endstone under the escape wheel arbor’s lower pivot, in a cap screwed to the pillar plate’s dial side.',
    sp:'Setting 05 04 08-2, endstone 05 04 08-1 · two M1.2, 3.5 either side of the arbor'}};
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
    {k:'pins',t:'Intermediate bridge steady pins',h:'WN-203.zb',d:PIN+' WN-203.',sp:'Ø 1.6, 1.3 proud',src:'drawing',sn:'Their places from the plate’s table; their protrusion from the bridge’s sheet',figs:'05 08_10'}],
  balance:[{k:'rim',t:'Balance rim and arm',h:'050301-1',d:PARTS.balance.d,sp:'Drawing 05 03 01-1 · Nickelstahl Sonderlegierung u. Messing · Ø 32.32 −0.04, joint Ø 31.29, inside Ø 30.48 · 3.8 high · cut 1.5 at 90° from the arm'},
    {k:'masses',t:'Compensation masses',h:'050301-4 WN-12 WN-12a',d:'Four round brass masses across the rim, each held by a screw and nut through it (WN-12, WN-12a).',sp:'05 03 01-4 · Ø 6.3 × 5.4',src:'scaled',sn:'Scaled on 05 03_2 (a poor copy) and Wempe 3955’s photograph',figs:'05 03_2'},
    {k:'timing',t:'Timing screws and weights',h:'050301-2 050301-3',d:'A timing screw across the rim at each end of the arm, in a tapped hole Ø 0.9 × 0.16, carrying a brass weight: turned in or out, they set the rate.',sp:'05 03 01-2, 05 03 01-3 · 42.1 over both',src:'scaled',sn:'The hole from the rim’s sheet; the weights scaled on 05 03_2 and Wempe 3955',figs:'05 03_2, 05 03_4'},
    {k:'staff',t:'Balance staff',h:'050402-1',d:'The hardened steel staff: its pivots run in the jewels in the two cocks; it carries the collet, the arm on the hub, and the rollers.',sp:'Drawing 05 04 02-1 (in 05 04 02, 29.5.46) · hardened and tempered · seats Ø 1.65 s6, Ø 2 h6, Ø 1.2 r6 · pivots Ø 0.21',src:'drawing',sn:'Its diameters and the lengths from the hub’s flange from 05 04 02; its pivots from 05 03_3.2; its ends fitted to the endstones',figs:'05 04_4, 05 03_3-2'},
    {k:'hub',t:'Balance hub (Unruhbutzen)',h:'050402-2',d:'The brass hub pressed on the staff, its flange carrying the arm.',sp:'05 04 02-2 · Ms · flange Ø 6.3 × 1.8, neck Ø 2.63, 4.1 long, 2 × M1',src:'drawing',sn:'Every size from 05 04 02',figs:'05 04_4'},
    {k:'screws',t:'Hub screws',h:'WN-10',d:'Two screws from under the hub’s flange into the arm.',sp:'WN-10 · M1',src:'est',sn:'Their place from the arm’s holes; drawn as the coloured section draws them',figs:'05 04_4'}],
  hairspring:[{k:'spring',t:'Hairspring',h:'050302-1',d:PARTS.hairspring.d,sp:PARTS.hairspring.sp},
    {k:'collet',t:'Hairspring collet (Spiralrolle)',h:'050302-2 050302-4.c',d:'The split brass collet on the staff, with the hole across its end where the spring’s inner end is pinned (Spiralstift 05 03 02-4).',sp:'05 03 02-2 · Ms 58 · 9.1 × 3.8/2.7 × 3.3, bore 1.6 H7',src:'drawing',sn:'Every size from its sheet',figs:'05 03_8'}],
  stud:[{k:'stud',t:'Stud',h:'050302-3 050302-4.s',d:PARTS.stud.d,sp:PARTS.stud.sp},
    {k:'screw',t:'Stud screw',h:'WN-11',d:'The screw holding the stud to the cock.',sp:'WN-11 · M1.4',src:'est',sn:'The coloured section’s label; its size from the stud’s hole',figs:'05 03_9'}],
  rollers:[{k:'impulse',t:'Impulse roller and stone',h:'050403-1 050403-2',d:'The beryllium-copper impulse roller and its sapphire impulse stone, set in shellac.',sp:'02 04 02 · Ø 6.78 × 1.6 · stone 0.5 × 1.8 × 1.7',src:'drawing',sn:'Every size from its sheet',figs:'05 04_6'},
    {k:'discharge',t:'Discharge roller and stone',h:'050404-1 050404-2',d:'The small collar and its discharge stone that work the gold spring.',sp:'05 04 04-1 (not in the set) · stone 1.7 wide',src:'scaled',sn:'Scaled on the layout 05 04_1',figs:'05 04_1'}],
  escapeWheel:[{k:'wheel',t:'Escape wheel',h:'050405-1',d:PARTS.escapeWheel.d,sp:PARTS.escapeWheel.sp},
    {k:'pinion',t:'Escape pinion and arbor',h:'050405-2',d:'The steel arbor with its pinion of 10 leaves, which the seconds wheel drives.',sp:'05 04 05-2 · Präz. Rundstahl · z 10, m 0.263, tips Ø 2.97 · pivots Ø 0.24',src:'drawing',sn:'From its sheets',figs:'05 04_8, 05 04_7.2'},
    {k:'collet',t:'Escape wheel collet (Gangradbutzen)',h:'050405-3',d:'The brass collet the wheel is pressed on.',sp:'05 04 05-3 (05 04 10) · 4.7 long',src:'drawing',sn:'Its length from 05 04_7.2; its taper scaled',figs:'05 04_7.2'}],
  detent:[{k:'detent',t:'Detent with its locking stone',h:'050401-1 050401-3',d:PARTS.detent.d,sp:'1436 (05 04 01-1) · foot 0.60 × 1.9 × 6.6, spring 0.07, blade 0.50/0.28, pipe Ø 1.15 · stone Ø 0.75'},
    {k:'gold',t:'Gold spring (Goldfeder)',h:'050401-2 WN-14',d:'The gold passing spring, screwed to the detent, resting on its horn.',sp:'05 04 01-2 · 8-carat gold (Goldblech, federhart) · 0.15 thick, 15.4 long',src:'drawing',sn:'From its sheet; its path round the pipe after the layout',figs:'05 04_2, 05 04_1'},
    {k:'foot',t:'Detent foot screw and pins',h:'WN-gf WN-201.d',d:'The screw and two steady pins that hold the detent’s foot to the block.',sp:'M1 · pins Ø 0.45',src:'est',sn:'The screw from the block’s sheet; the pins scaled on 1436',figs:'05 04_3, 05 04_10.1'}],
  detentBlock:[{k:'block',t:'Detent block',h:'050401-4',d:PARTS.detentBlock.d,sp:PARTS.detentBlock.sp},
    {k:'screws',t:'Block screws and pins',h:'WN-gk WN-gkA WN-gkP',d:'The fixing screw from the top plate’s outer face, the screw across the upright’s slit end, and the two steady pins.',sp:'M1.7, M1.2 · pins Ø 0.9',src:'est',sn:'Their threads and places from the block’s sheet; heads estimated',figs:'05 04_3'}],
  balanceJewelsUp:[{k:'jewel',t:'Upper hole jewel',h:'050406-2.bu 050407-1.bu',d:'The hole jewel and its setting.',sp:'05 04 06-2, 05 04 07-1'},{k:'end',t:'Upper endstone',h:'050408-2.bu 050408-1.bu',d:'The endstone and its setting.',sp:'05 04 08-2, 05 04 08-1'},{k:'screws',t:'Setting screws',h:'WN-55.ck',d:'Two screws holding the endstone’s setting.',sp:'M1.2'}],
  balanceJewelsLow:[{k:'jewel',t:'Lower hole jewel',h:'050406-2.bl 050407-1.bl',d:'The hole jewel and its setting.',sp:'05 04 06-2, 05 04 07-1'},{k:'end',t:'Lower endstone',h:'050408-2.bl 050408-1.bl',d:'The endstone and its setting.',sp:'05 04 08-2, 05 04 08-1'},{k:'screws',t:'Setting screws',h:'WN-16',d:'Two screws holding the settings in the lug.',sp:'WN-16 · M1.2'}],
  escJewelUp:[{k:'jewel',t:'Hole jewel and setting',h:'050406-2.eu 050406-1.eu',d:PARTS.escJewelUp.d,sp:PARTS.escJewelUp.sp},{k:'screws',t:'Setting screws',h:'WN-es',d:'Two screws under the plate holding the setting.',sp:'M1.2'}],
  escEndstoneLow:[{k:'cap',t:'Endstone cap',h:'050408-2.el 050408-1.el',d:PARTS.escEndstoneLow.d,sp:PARTS.escEndstoneLow.sp},{k:'screws',t:'Cap screws',h:'WN-ec',d:'Two screws through the cap into the pillar plate.',sp:'M1.2'}]};

/* ================= views ================= */
/* the camera's turn (yaw), height (pitch, rad) and distance, aimed at a point in the movement's frame. The movement stands train side up (the scene's group turns it over) */
const VIEWS={
  movement:{yaw:2.5,pitch:0.6,dist:250,target:[0,-11,0]},
  plan:{yaw:Math.PI,pitch:1.52,dist:270,target:[0,-11,0]},   /* straight down on the top plate, 12 o'clock at the top (so 3 o'clock on the left, as the sheets draw the Oberplatte: their O to the right) */
  dial:{yaw:Math.PI,pitch:-1.2,dist:270,target:[0,-11,0]},   /* from below, on the pillar plate's dial side */
  side:{yaw:Math.PI/2,pitch:0.04,dist:300,target:[0,-16,0],fov:20},
  exploded:{yaw:2.2,pitch:0.3,dist:400,target:[0,-34,0],explode:1},
  escapement:{yaw:2.8,pitch:-0.5,dist:110,target:[WESC.W[0]+1,-16,WESC.W[1]-4],see:true}};   /* from under the top plate, through it, on the wheel, detent and rollers */
const VIEW_DESC={movement:'The movement, train side up.',plan:'The top plate from straight above, 12 o’clock at the top.',dial:'The pillar plate’s dial side, from below.',side:'The frame from the side: the plates on their pillars in the movement ring, the cocks and the dust bush over the top plate.',exploded:'Every part lifted apart along the pillars.',escapement:'The escapement under the top plate, seen through it: the escape wheel, the detent and the balance’s rollers.'};
const SECDEF={x:{n:[-1,0,0],min:-44,max:44,def:-6.425},z:{n:[0,0,1],min:-44,max:44,def:3.225},y:{n:[0,1,0],min:-42,max:12,def:-9.5}};   /* the 12-6 and 3-9 planes through a pillar (nos. 49 and 11), and across the pillars between the plates */

/* ================= the page ================= */
(function(){let mv=null,tSim=Date.now()/1000;
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
    /* the escapement's motion (js/escapement.js): the balance's phase over its 0.5 s period, the escape wheel's place in teeth (a tooth each period: E as the Hamilton's,
       a beat behind until the tooth escapes); fast, the balance is drawn at rest and the wheel turns on smoothly */
    tick:(dt,now,st)=>{tSim+=dt*st.speed;const y=tSim/0.5,k=Math.floor(y),p=y-k;let s;
      if(st.speed>4){s={th:0,lift:0,psDef:0,prog:0};mv.userData.update({E:y,th:0,lift:0,psDef:0});}
      else{s=ESC.state(p);mv.userData.update({E:k-1+(p>0?s.prog:0),th:s.th,lift:s.lift,psDef:s.psDef});}
      return[+s.th.toFixed(4),+((st.speed>4?y:k+s.prog)%15).toFixed(4),+s.lift.toFixed(5),+s.psDef.toFixed(5)];},
    hud:st=>`The frame and escapement, from their drawings${st.speed!==1?`&ensp;<b>${st.speed?st.speed+'×':'stopped'}</b>`:''}`});
  if(V&&/[?&]qa\b/.test(location.search))window.__V=V;   /* the viewer's state, for the tools */
})();
