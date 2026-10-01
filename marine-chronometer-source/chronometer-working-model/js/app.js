/* app.js: renderer, camera, controls, cross-sections, label placement, part info, walkthrough, animation loop; ?qa hooks for verification
   Part of 'The Marine Chronometer, working' (three.js r128). See README.md. */

/* ================= parts registry ================= */
/* Every named part, in parts-list order: t name, d what it does (the info card), sp Hamilton part numbers and sizes, g its group in the parts list (PG),
   c its colour in Colour by part, pri label priority (higher is placed first; default 1), plate: a plate or bridge (see-through with the plates, hidden
   with Moving parts only), dh: hidden with Moving parts only. src: where the part's shape and size mainly come from (SRC), sn: what came from where, figs: the manual's figures that show it.
   A part's meshes carry its key as userData.partName (movement.js, box.js) */
const SRC={manual:['The manual','#2e9d5b','its figures, parts list or specifications'],photo:['Measured','#2f6fd6','on photographs, or a real part'],solved:['Solved','#d99a1e','placed or sized to fit the rest'],est:['Estimated','#8f969d','the manual shows it, not its size or shape']};
/* a turn time in seconds as the page writes it: 8 s, 1 min, 8 min, 1 h, 6.43 h (per(): '/ h' for one hour); counts and ratios come from TRAIN, MW and UD (movement.js) */
const turnT=s=>{const[v,u]=s<60?[s,'s']:s<3600?[s/60,'min']:[s/3600,'h'],w=Math.floor(v+1e-9),f=v-w;return(Math.abs(f)<1e-6?String(w):Math.abs(f-0.5)<1e-6?(w||'')+'½':String(+v.toFixed(2)))+' '+u;},per=s=>turnT(s).replace(/^1 /,''),
  ESC_TURN=TRAIN.ew/2,GW_TURN=ESC_PER.gw*ESC_TURN;   /* the escape wheel turns once in ew half seconds; the fusee wheel once in 6.43 h */
const PG=['Box and gimbals','Plates and bridges','Power and winding','Train and escapement','Hands'];
const PARTS={
  box:{t:'Mounting box',g:0,src:'est',sn:'Its parts are the manual’s; its size and shape are estimated',figs:'1, 94',c:'#a9745b',d:'Mahogany with brass fittings and two hinged covers: an upper lid, and a second cover with a glass top so the dial can be read while it stays closed. Felt protects the outside bottom.',sp:'No. 42201 · scaled to 7¾ × 7¾ in.'},
  lid:{t:'Upper lid',g:0,src:'est',sn:'Size and shape estimated',figs:'1',c:'#8a5a44',d:'Protects the instrument. Kept closed except when reading, winding or comparing.',sp:''},
  lidGlass:{t:'Glass-top cover',g:0,src:'est',sn:'Size and shape estimated',figs:'1',c:'#c49a7a',d:'The second cover. Usually kept closed; the dial is read through its glass.',sp:''},
  ring:{t:'Gimbal ring',g:0,src:'est',sn:'The arrangement of ring, pivots, lock nuts and straps is the manual’s; its size from the top-view photographs, the rest estimated',figs:'1, 94, 106',c:'#9aa1a8',pri:5,d:'Flat brass ring hung on two pivot screws that come in through the sides of the mounting box, with washers and lock nuts. The case pivots in it on front and rear pivot screws 90° away, each with a knurled lock nut, so the movement tends to stay level whatever the box does. Slotted support straps at 3 and 6 set the level.',sp:'Ring 42106 · straps 42107, 42108, their screws 42116 · pivot screws 42120, 42118, 42119, bushings 42214 · washers 42122 · lock nuts 42121'},
  latch:{t:'Gimbal latch',g:0,src:'est',sn:'Its parts and the slot in the ring are the manual’s; the lever’s pivot, swing and the keeper are estimated',figs:'1, 106',c:'#7d9a4a',d:'Locks the gimbals so the case cannot swing, when the box is carried or the lid must be closed with the instrument out of its box, and before the hands are set. The lever turns on a pin in its bracket, in through a slot in the gimbal ring to the keeper on the case, so ring and case are held at once. Tick Gimbals latched under Display, with Ship motion, to see the case tilt with the box.',sp:'Lever 42111 · handle 42112 · support bracket 42109, its screws 42115 and washers 42123 · clamping bracket 42110 and screw 42114 · take-up spring 42277, its screws 42276'},
  bowl:{t:'Chronometer case',g:0,src:'est',sn:'How it holds the movement is the manual’s (Sec. III), its width from the top-view photographs; the shield plate’s parts and action from the manual; shapes and the other sizes estimated',c:'#c4b27a',pri:5,d:'Brass bowl and bezel with crystal. The movement’s mounting ring sits in a recess round its top edge, on the shoulder at its foot, and the ring’s alignment pin enters a slot in its edge; the bezel screws on outside the rim. The winding-hole shield plate on its bottom is turned clockwise to admit the key and springs back when the key is removed.',sp:'Case No. 42101, bezel 42102, crystal 42103 · case support brackets 42105, their screws 42117 and pivot bushings 42214 · latch keeper 42113, its screw 42116 and separating washer 42128 · shield plate 42104, shoulder screw 42124, stop screw 42125, return spring 42126'},
  key:{t:'Winding key',g:0,src:'est',sn:'The square is 2.4 mm, as the fusee arbor’s, since one key fits both; the rest estimated',figs:'7, 8',c:'#6d7a8a',pri:4,d:'Wind to the left (counterclockwise). Seven half turns restore 24 hours of running; 17½ half turns wind a run-down chronometer fully.',sp:'No. 42044'},
  pillar:{t:'Pillar plate',g:1,src:'photo',sn:'87.57 mm across and 3.86 mm thick, from a new-old-stock plate; the engraving traced on a photograph',figs:'29, 67, 110',c:'#9fb4c8',plate:1,d:'Foundation of the movement. The barrel and train bridges stand off it on four pillars, each screwed on from the dial side. A large hole under the dial reaches one of the balance lower bridge’s screws. On its dial side are the lower train bridge, the escape wheel’s lower endstone cap and the posts the minute and wind indicator wheels turn on. It is laid on the mounting ring, a deep lacquered brass ring that carries the dial and holds the movement in its case; seen from the dial side, the plate lies sunk in it.',sp:'No. 42060 · 87.57 mm diameter, 3.86 mm thick · pillar screws 42055 · mounting ring 42057 with its alignment pin, screws 42055 · centre, barrel and fusee lower bushings 42165, 42164 · escape lower setting 42162, endstone cap 42159, screws 20762 · posts 42084, 42085, screws 35779'},
  ltb:{t:'Lower train bridge',g:1,src:'photo',sn:'A straight steel bar with square ends across an opening in the plate, the settings inboard and a screw toward each end, as Figs. 30 and 31 and a photograph of a Model 21’s dial side show it; its sizes are estimated',figs:'29, 30, 31, 67, 110',c:'#b6d7c9',plate:1,d:'A steel bar screwed to the dial side of the pillar plate, under the dial, across an opening round the third arbor; carries the third and fourth wheel lower settings (bar-hole jewels) and two steady pins.',sp:'No. 42063 · screws 42163 · third and fourth lower settings 42161'},
  pillars:{t:'Pillars',g:1,src:'photo',sn:'Heights from a side photograph, places from the top-view photograph',figs:'29, 67, 110',c:'#707a84',plate:1,d:'Four pillars: three for the upper train bridge, one for the barrel bridge. Each is screwed on from the dial side of the pillar plate and tapped at its top for its bridge’s screw.',sp:'Nos. 42059, 42058 · screws 42055'},
  trainBridge:{t:'Upper train bridge',g:1,src:'manual',sn:'Its crescent traced on Fig. 67; thickness from a side photograph; the keyhole built round the arbors',figs:'24, 29, 67, 108, 110',c:'#c9d8a8',pri:2,plate:1,d:'Carries the centre and third wheel upper bushings. The balance cock, balance lower bridge and escape upper bridge are mounted to it; the detent support block is fastened to its underside. It leaves the fusee’s top open to the barrel bridge above.',sp:'No. 42062 · screws 42055 · centre and third upper bushings 42166, 42167'},
  barrelBridge:{t:'Barrel bridge',g:1,src:'photo',sn:'Outline and the cut round the balance traced on the top-view photograph; thickness from a side photograph',figs:'24, 77, 110',c:'#e3cfa6',pri:2,plate:1,d:'Holds the upper pivots of both the barrel and the fusee. The fusee winding stop is a stud screwed into its underside (left-hand thread); the setup ratchet and the dust seal sit on top.',sp:'No. 42061 · screws 42055 · barrel and fusee upper bushings 42164 · winding stop 42099'},
  escBridge:{t:'Escape upper bridge',g:1,src:'photo',sn:'Its form from a restoration video (a bar across the escape lobe, symmetric about the jewel, a round cap) and Figs. 84, 110; its sizes and direction read off that frame, to about 10 %',figs:'29, 67, 110',c:'#c8b8e3',plate:1,d:'Small bridge holding the escape wheel’s upper setting and jewel, with the endstone cap over them on two screws.',sp:'No. 42064, screws 20762 · setting 42162 · cap 42159, screws 20762'},
  lowerBridge:{t:'Balance lower bridge',g:1,src:'est',sn:'Its form from a restoration video of a 1941 Model 21, the bridge on the upturned train bridge measured through a camera fitted to the bridge’s rim, in the order Fig. 30 draws along it; its lower tier a 3 mm plate on a side photograph; laid round the model’s arbors, which stand farther apart than the video’s (tools/lower_bridge.py)',figs:'29, 30, 110',c:'#a8d4e0',pri:3,plate:1,d:'Holds the balance staff’s lower setting, with its endstone cap underneath in a round counterbore, and the fourth wheel upper setting. Its lower tier is one slab shaped as an L, and the escape arbor passes up through the inside of the L, so the escape wheel can be lifted out from above with the bridge in place. A lug stands at each end, against the underside of the upper train bridge, held by a screw put in from below and located by a steady pin; between them the escape wheel turns over the slab. Beside the fourth wheel’s setting the train-blocking screw is threaded through the slab, its head in a column that rises to the train bridge; the screw in the lug at the other end can be reached through a hole in the pillar plate.',sp:'No. 42065 · screws 42055 · settings 42162, 42161 · cap 42159, screws 20762'},
  cock:{t:'Balance cock',g:1,src:'photo',sn:'Traced on the top-view photograph and shifted for parallax; the nose widened round the endstone cap',figs:'19, 84, 85',c:'#d8b0c8',pri:5,plate:1,d:'Carries the balance upper setting and its olive-hole jewel, pressed into the nose, the endstone cap over them on two screws, and the hairspring stud underneath on its screw. Its foot stands on the upper train bridge beside the barrel bridge, held by one screw.',sp:'No. 42066 · screw 42192 · upper setting 42162 · endstone cap 42160 with its setting 42155, screws 20762 · hairspring stud screw 27760'},
  dial:{t:'Dial',g:1,src:'photo',sn:'After a photographed U.S. Maritime Commission dial; the sub-dials sit on their arbors, a little nearer the centre',figs:'107',plate:1,d:'Black on silver-white, after a photographed Model 21 dial of the U.S. Maritime Commission contract. Large Arabic hours (the 6 covered by the seconds sub-dial) inside a railroad minute track with triangles at the hours; HAMILTON and LANCASTER, PA., U.S.A. across the centre; UP–DOWN indicator below the 12, numbered 8 to 48, on this movement’s sweep, 314° from UP to DOWN; seconds at 6, numbered 10 to 60, with the serial number and U.S. MARITIME COMMISSION. It lies on the mounting ring’s flange, a little inside its edge, held by four feet in the flange and dial screws from the flange’s train side.',sp:'No. 42030 · screws 35756'},
  barrel:{t:'Mainspring barrel',g:2,src:'est',sn:'Its axis from the photographs; its height (13.2 mm) and inside are estimated',figs:'26, 75, 109',c:'#b86bd1',pri:8,d:'Holds the mainspring and its brace, a strip lining the wall where the spring’s outer end hooks. Turns clockwise while running, drawing the chain from the fusee. The cap on the pillar-plate end is held by five screws.',sp:'No. 42168 · cap 42169, screws 37023 · brace 42037'},
  mainspring:{t:'Mainspring',g:2,src:'est',sn:'Thickness from the parts list (0.0165 in); length (600 mm) and lie estimated',figs:'26, 75',c:'#334f8f',d:'Inner end on the hook of the fixed barrel arbor, outer end by its anchor pin at the brace. Coils drawn schematically.',sp:'No. 42038 · 0.0165 in. thick'},
  ratchet:{t:'Setup ratchet',g:2,src:'photo',sn:'The cover plate traced on the top-view photograph, and the ratchet’s size (about 52 teeth) measured there',figs:'17, 24, 80',c:'#a0922f',d:'Setup ratchet wheel on the barrel arbor under the bow-shaped cover plate, with setup pawl (click) and spring. Keeps the arbor from turning in winding and running, so the wheel never moves in use. The arbor turns only in the watchmaker’s hands, with a let-down key on its square: to let the mainspring down before servicing, the pawl held back, and to set it up again at assembly. Inside the barrel the arbor carries the mainspring’s inner end on its hook.',sp:'Wheel 42026 · pawl 42027 on its screw 42036 · spring 42028 · cover plate 42029, screws 42056 · arbor 42170'},
  chain:{t:'Fusee chain',g:2,src:'est',sn:'Figure-eight plates three deep, riveted parallel to the arbor (Fig. 38); hooked to the barrel and pinned to the fusee as the manual has it. Plate sizes, pitch and end fittings estimated',figs:'26, 28, 38, 75',c:'#4a4f57',pri:7.5,d:'Links the barrel to the fusee: hooked to the barrel, pinned to the fusee’s large end. It bends only about its rivets, so it lies on edge in the fusee’s groove. Winding onto the last turn, it bears on the stop-bar’s nose.',sp:'No. 42001'},
  fusee:{t:'Fusee',g:2,src:'est',sn:'Profile and top measured on a side photograph; the stop-bar’s nose, slot and travel estimated',figs:'12, 24, 28, 69–74',c:'#e88a2e',pri:8.5,d:'Shaped so the moment of force on the fusee wheel is always about the same, fully wound or nearly run down. The chain lies in a helical groove between thin flanges. The winding ratchet is screwed to its large end. The winding stop-bar lies in a slot across its top, under the top plate, its nose down in the groove’s top turn: the chain, winding onto that turn, pushes the nose in, the bar’s other end stands out past the rim and catches the winding stop under the barrel bridge, and a spring draws it back when the chain runs off. The end plate and a taper pin hold the fusee wheel and maintaining work on the arbor.',sp:'No. 42021 · arbor 42022 · stop-bar 42024, spring 42025 · top plate 42008, screws 27760 · winding ratchet 42013, screws 42014 · end plate 42019, taper pin 42020'},
  sq:{t:'Fusee arbor square',g:2,src:'est',sn:'Size estimated',figs:'7',c:'#5e6b2a',d:'Turned counterclockwise by the key to wind.',sp:'Arbor 42022'},
  post:{t:'Dust seal',g:2,src:'est',sn:'The seal and three packing rings are the manual’s; their sizes are estimated',figs:'24',c:'#8c6b4a',dh:1,d:'Nickel dust seal on the barrel bridge where the fusee arbor rises through it, capped by three packing rings over a seal ring and helical spring. The key reaches the squared arbor through it.',sp:'Seal 42051, screws 42056 · packing rings 42054 · seal ring 42052 · helical seal spring 42053'},
  gw:{t:'Fusee wheel',g:2,src:'photo',sn:'90 teeth, counted on a restoration video of a 1941 Model 21; the centre pinion’s 14 leaves inferred: the manual’s 17½ half turns of the key then hold its 56 hours',figs:'12, 28',c:'#d9453b',pri:6.4,d:'The first wheel of the train, free on the fusee arbor; it drives the centre wheel pinion. The sustaining spring in its recess drives it: loaded by the sustaining ratchet wheel in running, on its own while the key winds. So it keeps turning forward with the train, once in 6.4 hours, while the fusee under it turns back.',sp:`No. 42015 · ${TRAIN.fu} teeth here`},
  sratchet:{t:'Sustaining ratchet wheel',g:2,src:'est',sn:'Its pawls, springs and screws are the manual’s (Sec. IV, parts list); sizes estimated',figs:'69–74',c:'#2f8fb0',pri:4.6,d:'Free on the fusee arbor. Its two winding pawls, each held in by a flat spring, catch the winding ratchet screwed to the fusee, so in running the mainspring’s pull passes through this wheel and the sustaining spring to the fusee wheel. While the key turns the fusee back the winding ratchet slips under the pawls, and the sustaining pawl holds this wheel.',sp:'No. 42009 · winding pawl springs 42007, screws 42012 · winding ratchet 42013'},
  sspring:{t:'Sustaining spring',g:2,src:'est',sn:'Pinned to the wheel, pushed by a pin (the manual pins both ends); its travel estimated',figs:'69–74',c:'#6a3fa0',d:'A ring-shaped spring in the fusee wheel’s recess, pinned to the wheel at one end, with a pin on the sustaining ratchet wheel bearing on the other. Always under load: while the key turns the fusee back it alone drives the train, for 5 to 10 minutes, and the mainspring loads it again when the key lets go.',sp:'No. 42016'},
  spawl:{t:'Sustaining pawl',g:2,src:'solved',sn:'Placed 21.35 mm from the fusee axis, to reach the ratchet clear of the wheels',figs:'12, 28',c:'#1fa05a',pri:4.5,d:'Holds the sustaining ratchet wheel from turning back while the fusee is wound, so the sustaining spring can only release its power forward into the train, enough to run the chronometer 5 to 10 minutes.',sp:'No. 42096'},
  cw:{t:'Centre wheel',g:3,src:'solved',sn:'Its place in the stack (above the third wheel, its pinion above it), its pinion’s side and its five spokes from Figs. 13, 29 and 110; 90 teeth and a third pinion of 12, counted on a restoration video; module from its centre distance',figs:'13, 29, 110',c:'#f2c230',pri:7,d:'Second wheel of the train. Its long arbor passes through the pillar plate and dial and carries the cannon pinion and hour wheel.',sp:'No. 42068 · 1 turn an hour'},
  tw:{t:'Third wheel',g:3,src:'solved',sn:'Lowest in the stack, its pinion above it and five spokes, from Figs. 13, 29 and 110; position solved so every arbor clears every wheel; 80 teeth, counted on a restoration video; module from its centre distance',figs:'13, 29, 110',c:'#7cc242',pri:6.5,d:'Lowest wheel of the train, next to the pillar plate. Its pinion, above it, is driven by the centre wheel; the wheel drives the fourth wheel’s pinion.',sp:'No. 42071'},
  fw:{t:'Fourth wheel',g:3,src:'solved',sn:'Its long pinion under the wheel and its five spokes from Figs. 13, 29 and 110; 75 teeth, counted on a restoration video (so the escape pinion has 10); its height solved for clearance; module from its centre distance; a side photograph shows where it meshes',figs:'13, 29, 110',c:'#2fb3a6',pri:6.8,d:'Its long arbor passes through the dial to carry the second hand. Jewelled at both ends; its upper setting is in the balance lower bridge.',sp:'No. 42073 · 1 turn a minute'},
  tblock:{t:'Train-blocking screw',g:3,src:'est',sn:'Its arrangement is Fig. 110’s section; its size and travel are estimated',figs:'110',c:'#c77d2a',dh:1,d:'Mounted in the balance lower bridge (Sec. II, Fig. 110). Screwed down, its head stops on a seat in the bridge and its dog point stands between the fourth wheel’s spokes, so the train turns only until a spoke meets it: the mainspring keeps its power while the balance and escapement are out for service. Screwed up, the chamfer on its head seats in the countersunk access hole in the upper train bridge, through which it is turned. Fitted from serial 4003. Lower and raise it under Stopping and starting.',sp:'No. 42247'},
  escW:{t:'Escape wheel',g:3,src:'manual',sn:'16 teeth, 13.16 mm, 1.3 mm thick (Hamilton’s specification); tooth form from Fig. 90 and an original wheel, tall teeth on a thin rim as Fig. 14 has them; 9.40 mm from the balance for the manual’s roller shake',figs:'14, 90',c:'#2f7fe0',pri:9.5,d:'Released one tooth per oscillation of the balance, so the second hand advances in half-second steps. Sixteen teeth (most chronometers use 13 or 15), 13.16 mm across, the teeth 1.3 mm thick standing on a thin, narrow rim with four thin crossed spokes. Each tooth is a slender point: a narrow land at the tip, a locking face undercut so the tip leads, and a hollow back. The tip and front face bear on the locking jewel and drive the impulse jewel.',sp:`No. 42076 · ${TRAIN.ew} teeth, 1 turn / ${turnT(ESC_TURN)}`},
  det:{t:'Detent',g:3,src:'manual',sn:'The plan from Fig. 90; thicknesses and heights estimated',figs:'14, 54–60, 90, 110',c:'#e0457b',pri:9,d:'Beryllium-copper spring detent. Its foot is clamped to the support block under the upper train bridge, and the detent-adjusting screw sets it lengthwise. Ahead of the foot: the two-strip detent spring (the point of flexure), the blade, the locking jewel (round, with a flat set at about 10° of draw) and the abutment arm (horn). It rests against the stop button, set by the lock-adjusting screw. The trip (passing) spring, a thin flat strip of Hamilton Elinvar, is screwed to an angle bracket on it and rests on the horn. The locking jewel is held in its hole by a wedge pin.',sp:'Detent 42087 with locking jewel 285 and wedge pin 42089 · trip spring 42088 on bracket 42092, screws 1770 · block 42086, screw 42056 · clamp screw 37024, washer 42251 · adjusting screw 20756 · lock-adjusting and clamp screws 42091'},
  bal:{t:'Balance and hairspring assembly',g:3,src:'photo',sn:'The rim, 29 mm across, measured on the top-view photograph; its screws and weights from the parts list; its section estimated',figs:'3, 4',c:'#8a5cf0',pri:10,d:'Solid, uncut stainless-steel rim silver-soldered to an Invar arm, with tapped holes all round for balance screws, two timing weights and two vernier timing weights. Motion 1⅜ to 1½ turns. On the staff, the impulse roller (with three holes, and its jewel flat on the impulse face and curved behind) and below it the unlocking roller, a collar with its jewel in a slot. The arm sits on the hub’s flange, under a cap held by two hold-down screws, so it is clear of the staff (Fig. 4). Rim about 29 mm across, measured on a top-view photograph.',sp:'Wheel 42178 · hub and staff 42186 · cap 42248, screws 42249 · balance screws 42171, 42173, 42174 · timing weights 42176 on screws 42177 · vernier weights 37115 on screws 42197 · impulse roller 42263 and jewel 286 · unlocking roller 42252 and jewel 287 · collet 42190, clamp 42191, wedge pin 42147'},
  lockArm:{t:'Balance wheel locking arm',g:3,src:'est',sn:'Curved, its screw outside the rim and its end at a timing weight, as Fig. 9 draws it and Sec. X describes; its sizes are estimated',figs:'9',c:'#5a7fb0',dh:1,d:'Holds the balance still in transit (Sec. III, Fig. 9): loosen its screw, turn the arm, tighten the screw. Locked, the finger at its end stands beside a timing weight, which the hairspring holds against it, and a balance screw stops the balance the other way (“place the locking arm over the timing weight”, Sec. X); unlocked, it rests turned out against its stop pin, clear of the balance. Fitted to chronometers overhauled from 1947; before it, folded wedges went between the rim and the train bridge. Lock and unlock it under Stopping and starting.',sp:'Arm 42299 · screw 37204 · washer 42251 · stop pin 42300'},
  spr:{t:'Hairspring',g:3,src:'est',sn:'5.9 mm tall, to reach the stud; the collet and stud after Figs. 5 and 6',figs:'5, 6, 19, 84, 85',c:'#f25fd0',pri:6,d:'Cylindrical, of Hamilton Elinvar. Each end is held in a clamp by a wedge pin, without bending the spring, so its active length is the same winding and unwinding: the inner end on the tongue of the collet, which is slotted to grip the balance staff and owes its curious shape to counterpoising experiments; the upper end in the stud, a bar held under the balance cock by the stud screw from the cock’s top and a steady pin. There is no regulator: rate is set with the balance screws and weights.',sp:'No. 42188 · collet 42190 · stud 42189 with its clamp 42191, wedge pin 42147 and screw 27760 (Figs. 5, 6)'},
  hands:{t:'Hands',g:4,src:'photo',sn:'After the photographed U.S. Maritime Commission dial; how the hands are fitted after Op. 64',figs:'107',c:'#1b1b1b',pri:6,d:'Blued steel: an hour hand with a bulb and a long spear point, a plain minute hand, a long seconds hand with a spear counterpoise. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff, wind indicator hand on its own wheel. The hands advance in half-second increments. The hour hand is pressed on the hour wheel’s pipe; the minute hand, broached square, sits on the cannon pinion’s square below its bright end (Op. 64).',sp:'Nos. 42032–42035'},
  motion:{t:'Motion work',g:4,src:'est',sn:'Its counts are chosen but the wind indicator wheel’s 120, counted on a restoration video; with the fusee arbor’s pinion of 12 the hand sweeps 314° in 56 hours, as a photographed dial’s scale; the hand-setting square after Fig. 8; the solid minute and hour wheels and the five-spoked wind indicator wheel as photographs of a Model 21’s dial side show them',figs:'8, 81, 107',c:'#a45a3c',pri:5,d:'Cannon pinion, minute wheel and hour wheel under the dial, the pipes of the cannon pinion and hour wheel rising through it; the minute wheel turns on a post screwed to the pillar plate. The cannon pinion is a friction fit on the centre arbor, so the hands can be set without moving the train, and its pipe ends above the dial in the bright square that takes the winding key, turned by its shank, to set the hour and minute hands, forward only. The hour wheel turns free on the cannon pinion’s pipe. A pinion on the dial end of the fusee arbor drives the wind indicator wheel, which turns on a post of its own and carries the wind indicator hand on its pipe.',sp:'Nos. 42077, 42078, 42080, 42081 · posts 42085, 42084'}
};
/* the tables the rest of app.js reads */
const INFO={},PCOL={},PRI={},PGRP=PG.map(g=>[g,[]]);
for(const[k,p]of Object.entries(PARTS)){INFO[k]=[p.t,p.d,p.sp];if(p.c)PCOL[k]=p.c;if(p.pri)PRI[k]=p.pri;PGRP[p.g][1].push(k);}
const PLATES=new Set(Object.keys(PARTS).filter(k=>PARTS[k].plate)),DRIVE_HIDE=new Set(Object.keys(PARTS).filter(k=>PARTS[k].plate||PARTS[k].dh));

/* ================= 2D escapement inset ================= */
/* the walkthrough's inset and the adjuster's bench: the plan (drawEscPlan, ../shared/escplan.js) in the page's colours, three names, the stage written under it */
function drawEsc2D(ctx,w,h,s,Ew,dark){   /* s: the balance's state as the model shows it (s.held: the train stands), Ew: the escape wheel's position in teeth */
  drawEscPlan(ctx,w,h,s,Ew,{labels:'short',cap:true,pal:{ink:dark?'#e4e8eb':'#141a20',muted:dark?'#9aa4ad':'#5b656e',brass:dark?'#d8a94f':'#b58325',steel:dark?'#8e98a3':'#8a939c',copper:dark?'#d49a63':'#b87840',paper:dark?'#1b2127':'#ffffff'}});
}

/* ================= app ================= */
(async function(){
  const stage=$('#stage'),cv=stage.querySelector('canvas');
  if(typeof THREE==='undefined'){$('#loading').textContent='The 3D library didn’t load. Reload the page to try again.';return;}
  /* faces drawn only on canvases (dial, engraving) are not fetched by the page's CSS, so fonts.ready alone doesn't wait for them */
  try{await Promise.race([Promise.all(['600 10px Spectral','400 10px Spectral','400 10px "Instrument Sans"'].map(f=>document.fonts.load(f))).then(()=>document.fonts.ready),new Promise(r=>setTimeout(r,2500))]);}catch(_){}
  const dark=()=>matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light'||document.documentElement.dataset.theme==='dark';
  /* phones (touch, under 600 px on the short side): a lower pixel ratio and shadow map keep the frame rate up */
  const PHONE=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600;
  /* reduced motion (a system setting): camera and state moves are instant, as with ?snap; the walkthrough doesn't start ship motion or scroll smoothly */
  const RM=matchMedia('(prefers-reduced-motion: reduce)');
  let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});}catch(_){$('#loading').textContent='This browser couldn’t start 3D graphics (WebGL). Try another browser, or turn on hardware acceleration.';return;}r.setPixelRatio(Math.min(window.devicePixelRatio||1,PHONE?1.5:2));
  r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;
  r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.environment=envTex(r);
  /* a lost WebGL context (a phone switching apps, a GPU reset) comes back without the generated environment map that lights the metals: rebuild it */
  cv.addEventListener('webglcontextrestored',()=>{scene.environment=envTex(r);});
  scene.add(new THREE.HemisphereLight(0xffffff,0x333333,0.28));
  const key=new THREE.DirectionalLight(0xfff4e6,1.0);key.castShadow=false;   /* casts only with Shadows (Display) on: look() */
  key.shadow.mapSize.set(PHONE?1024:2048,PHONE?1024:2048);key.shadow.bias=-0.0004;key.shadow.normalBias=0.6;
  const scam=key.shadow.camera;scam.left=-170;scam.right=170;scam.top=170;scam.bottom=-170;scam.near=1;scam.far=1200;scene.add(key,key.target);
  const cam=new THREE.PerspectiveCamera(32,1,1,6000);
  const M=mats();const BX=buildBox(M);scene.add(BX.root);
  const BOXM=[];BX.root.traverse(o=>{if(o.isMesh)BOXM.push(o);});
  const mv=buildMovement(M);BX.bowl.add(mv);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(640,640).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadowTex(),transparent:true,depthWrite:false}));sh.position.y=-101;sh.userData.surface=true;scene.add(sh);
  const R=mv.userData.R,P=mv.userData.parts;if(/[?&]qa\b/.test(location.search)){window.__mv=mv;window.__parts=PARTS;window.__r=r;window.__renders=()=>renders;window.__proj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();return pts.map(p=>{const v=new THREE.Vector3(...p);mv.localToWorld(v);v.project(c2);return[(v.x+1)/2*W,(1-v.y)/2*Hh];});};window.__unproj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();
    const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();return pts.map(([sx,sy,h])=>{const ndc=new THREE.Vector2(sx/W*2-1,-(sy/Hh*2-1));const rc=new THREE.Raycaster();rc.setFromCamera(ndc,c2);
      const o=rc.ray.origin.clone().applyMatrix4(inv),dd=rc.ray.direction.clone().transformDirection(inv);const tt=(h-o.y)/dd.y;return[o.x+dd.x*tt,o.z+dd.z*tt];});};
  window.__camInfo=()=>JSON.stringify({fov:cam.fov,aspect:cam.aspect,pos:cam.position.toArray().map(v=>+v.toFixed(2)),tgt:C.target.toArray().map(v=>+v.toFixed(2)),C:{yaw:C.yaw,pitch:C.pitch,dist:C.dist},W,Hh});
  window.__cam=(yaw,pitch,dist,fov)=>{cam.fov=cur.fov=tgt.fov=fov;cam.updateProjectionMatrix();goCam({yaw,pitch,dist,target:mvL(0,-26,0)});G.dist=dist;C.dist=dist;C.yaw=G.yaw;C.pitch=pitch;camFree=false;};
  window.__look=(yaw,pitch,dist,x,y,z)=>{goCam({yaw,pitch,dist,target:mvL(x,y,z)});};}
  $('#srcKey').innerHTML=Object.values(SRC).map(([t,c,d])=>`<span title="${t}: ${d}"><i style="--ps:${c}"></i>${t}</span>`).join('');
  const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return null;};
  const shown=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;};   /* r128's raycaster ignores visibility: a mesh in a hidden group (the hand-setting key, another dial style's hands) must not take a click or hide a label */
  /* a mesh casts a shadow only when its radius spans SHK texels of the shadow map (shThr, set as the shadow camera follows the view): smaller shadows were a
     few texels at most, each an extra draw call. Far views drop the screws and pins (under about 1.5 mm); close-ups keep them. Instanced meshes (the chain) always cast */
  BX.root.updateMatrixWorld(true);const wsc=new THREE.Vector3(),rad=o=>{if(o.isInstancedMesh)return 1e9;const g=o.geometry,b0=g.boundingSphere;g.computeBoundingSphere();const r=g.boundingSphere.radius;g.boundingSphere=b0;if(!(r>0))return 1e9;o.getWorldScale(wsc);return r*Math.max(wsc.x,wsc.y,wsc.z);};   /* three computes its own bounding sphere when it first needs it, as before; geometries rebuilt as they move (hairspring, passing spring) start empty, and always cast */
  const SHK=6;let shThr=SHK*2*scam.right/key.shadow.mapSize.x;const castOn=m=>{m.castShadow=!!m.userData.cs&&m.userData.rad>=shThr;};
  const MVM=[];mv.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);o.userData.mat0=o.material;o.receiveShadow=true;o.userData.rad=rad(o);MVM.push(o);}});
  BOXM.forEach(o=>{o.userData.part=partOf(o);o.userData.mat0=o.material;o.receiveShadow=true;o.userData.rad=rad(o);o.userData.cs=o.material!==M.glass;castOn(o);});
  /* a frame: rendered, drawn (tinted or in ink), or rendered with Edges (the drawing's lines over it, the movement's only) (makeInk in core.js, set up the first time it is asked for) */
  let ink=null;const INKM=[...MVM,...BOXM];BOXM.forEach(o=>o.userData.inkBox=true);
  const INKH=[sh,...MVM.filter(o=>o.userData.decal)];   /* left out of Edges' ids: the floor shadow, and the engravings, which would outline themselves on their plates */
  const paint=()=>{if(st.draw)(ink||(ink=makeInk(r))).render(scene,cam,INKM);else if(st.edges)(ink||(ink=makeInk(r))).lines(scene,cam,INKM,INKH);else r.render(scene,cam);};
  /* ---------- cross-sections ---------- */
  r.localClippingEnabled=true;
  for(const o of[...MVM,...BOXM]){const m=o.userData.mat0;if(m&&m.isMeshStandardMaterial)patchSection(m,m.side!==THREE.DoubleSide&&!m.transparent&&!o.userData.noCap);}
  const secLocal=new THREE.Plane(),secPlane=new THREE.Plane();
  const SECDEF={x:{n:[-1,0,0],min:-55,max:55,def:0},z:{n:[0,0,1],min:-55,max:55,def:-20.75},y:{n:[0,1,0],min:-46,max:6,def:-23.5}};
  let secMode='off',secOff=0,secFlip=false;
  const secIn=$('#secOff'),secOut=secIn.parentElement.querySelector('output');
  function applySec(){$('#secOpts').classList.toggle('hidden',secMode==='off');
    if(secMode==='off'){setSection(false,secPlane);return;}const d=SECDEF[secMode],k=secFlip?-1:1;
    secLocal.set(new THREE.Vector3(...d.n).multiplyScalar(k),-secOff*k);setSection(true,secPlane);secOut.textContent=secOff.toFixed(1)+' mm';}
  document.querySelectorAll('#secs button').forEach(b=>b.addEventListener('click',()=>{secMode=b.dataset.v;
    document.querySelectorAll('#secs button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
    if(secMode!=='off'){const d=SECDEF[secMode];secIn.min=d.min;secIn.max=d.max;secOff=d.def;secIn.value=d.def;}applySec();look();}));
  secIn.addEventListener('input',()=>{secOff=parseFloat(secIn.value);applySec();});
  $('#secFlip').addEventListener('change',e=>{secFlip=e.target.checked;applySec();});

  /* ---------- state ---------- */
  const st={drive:false,mwOn:false,see:false,colr:false,csrc:false,draw:false,edges:true,shadows:false,op:{},hid:new Set(),iso:null,focus:null,pick:null,labels:false,rock:false,latch:false,spin:false,speed:1,sound:true,view:'dial',tour:-1};
  const FOV0=cam.fov,cur={lift:0,flip:0,explode:0,lidM:0,lidT:0,dev:0,fov:FOV0},tgt={...cur};let devShown=false;   /* devShown: the train still out of place (laid out, or on its way back), so the real plates stay hidden */
  /* any input keeps the stage drawing for 0.6 s (the loop otherwise skips frames in which nothing moves) */
  /* a short note in the HUD, for a few seconds */
  let noteT=0,noteTx='';const hudNote=t=>{noteTx=t;noteT=performance.now()+3000;};
  let wakeT=0,hashReady=false,hashT=0,hashSeen='',handsSet=false;const wake=()=>{wakeT=performance.now()+600;writeHash();};   /* any change is also written to the URL (writeHash) */
  /* the time kept: Greenwich (navy chronometers were kept on GMT) or the viewer's local time; tzOff() is its offset from UTC in seconds */
  let tz='gmt';const tzOff=()=>tz==='gmt'?0:-new Date().getTimezoneOffset()*60;
  let hrs=20,winding=false,kw=null,rateK=1,rErr=0,tSim=Date.now()/1000+tzOff(),tM=0,slip=0,ks=null,sw=null,units='mm',book=[],pend=new Set(),bookDay=0,wasHeld=false,tVis=0,rockT=0,roll=0,pitch=0,latchK=0,lastE=null;
  /* the master time tM: a perfect clock, the time signal the dial is compared with. It runs at the model's speed, also while the chronometer stands. slip: how far the hour and
     minute hands have been turned on the centre arbor with the key (s; the cannon pinion slips), which leaves the second hand alone. dialRead(): the time the hands show, the
     seconds from the second hand (continuous: as a comparator reads it) and the minutes from the minute hand, taken within 6 h of the master (the dial has 12 hours) */
  tM=tSim;
  const dialRead=()=>{const sT=tSim+(H.bOff+H.eOff)/2,ss=((sT%60)+60)%60,r=Math.round((sT+slip-ss)/60)*60+ss,e=r-tM;return tM+(((e+21600)%43200)+43200)%43200-21600;};
  const fmtErr=e=>{const a=Math.abs(e),h=Math.floor(a/3600),m=Math.floor(a%3600/60),x=Math.round((a%60)*2)/2;return(e<0?'−':'+')+(h?h+' h ':'')+(h||m?m+' min ':'')+(h?'':x+' s');};   /* to the half second, as a navigator records it */
  /* colour mode: one flat CAD-style colour per part, or per source (Colour by source: where its shape and size come from, SRC); the part labels double as the legend */
  const COLM=new Map();
  const colOf=p=>st.csrc?PARTS[p]&&PARTS[p].src&&SRC[PARTS[p].src][1]:PCOL[p];
  function colourOf(m0,p){const col=p&&colOf(p);if(!col||p==='dial'||m0.transparent||!m0.color)return m0;const k=m0.uuid+p+(st.csrc?':s':'');let c=COLM.get(k);
    if(!c){c=m0.clone();c.userData={};c.map=null;c.normalMap=null;c.color=sc(col);if('metalness'in c){c.metalness=0.1;c.roughness=0.55;}if(c.emissive)c.emissive.setRGB(0,0,0);
      patchSection(c,!!m0.userData.secCap);c.userData.side0=m0.userData.side0??m0.side;c.side=m0.side;c.clippingPlanes=[...(m0.clippingPlanes||[])];COLM.set(k,c);}return c;}
  /* per-part opacity, set from the right-click menu */
  const FADE=new Map();
  function fadeOf(m0,p,op){const k=m0.uuid+p;let f=FADE.get(k);
    if(!f){f=m0.clone();f.userData={inkDecal:m0.userData.inkDecal};f.transparent=true;f.depthWrite=false;patchSection(f,false);f.userData.side0=m0.userData.side0??m0.side;f.side=m0.side;f.clippingPlanes=[...(m0.clippingPlanes||[])];FADE.set(k,f);}
    f.opacity=(m0.opacity??1)*op;return syncMat(f,m0);}
  const base=m=>{const p=m.userData.part,m0=st.colr||st.csrc?colourOf(m.userData.mat0,p):m.userData.mat0,op=st.op[p];return op!=null&&op<1?fadeOf(m0,p,op):m0;};
  const fin=m=>st.draw?drawOf(base(m)):base(m);   /* the drawing (st.draw 'tint' or 'ink'): the wash copy of whatever the part shows; see-through parts stay ghosts, drawn in outline */
  const isoOut=p=>!!st.iso&&!st.iso.has(p)&&!(p==='mainspring'&&st.iso.has('barrel'));   /* isolated: only the parts in st.iso are drawn (the mainspring with its barrel) */
  const isoDrop=p=>{if(st.iso){st.iso.delete(p);if(!st.iso.size)st.iso=null;}};   /* the last isolated part hidden: the rest of the model comes back */
  const opHide=m=>st.hid.has(m.userData.part)||st.op[m.userData.part]===0||isoOut(m.userData.part);
  /* the mainspring is drawn only when the barrel is opened up: drive-train mode, any cross-section, the barrel or spring picked or isolated, or the barrel faded or hidden */
  const msShown=()=>{const foc=st.pick?new Set([st.pick]):st.focus,ob=st.op.barrel;return st.drive||secMode!=='off'||st.hid.has('barrel')||(ob!=null&&ob<1)||!!(foc&&(foc.has('mainspring')||foc.has('barrel')))||!!(st.iso&&(st.iso.has('mainspring')||st.iso.has('barrel')));};
  function look(){wake();INK.ink.value=st.draw==='ink'?1:0;
    const foc=st.pick?new Set([st.pick]):st.focus,dvOn=(st.tour<0&&st.view==='laidout')||devShown;   /* laid out: the real plates' holes no longer meet the arbors; schematic ones stand in */
    for(const m of MVM){const p=m.userData.part;let vis=true;
      if(((st.drive||dvOn)&&DRIVE_HIDE.has(p))||(st.drive&&!st.mwOn&&(p==='motion'||p==='hands')))vis=false;
      if(m.userData.onlyDrive&&!msShown())vis=false;
      if((st.drive||dvOn)&&m.userData.driveHide)vis=false;if(m.userData.devPlate&&(!dvOn||st.drive))vis=false;
      const gh=!(kw&&m.userData.wstop)&&((st.see&&PLATES.has(p))||m.userData.devPlate||(st.drive&&m.userData.driveGhost)||(foc&&!foc.has(p)&&!(p==='mainspring'&&foc.has('barrel'))));
      if(m.userData.noShadow&&gh)vis=false;
      m.visible=vis&&!opHide(m);m.material=gh?ghostOf(base(m)):fin(m);m.userData.cs=!gh&&!m.userData.noShadow;castOn(m);}
    for(const m of BOXM){m.visible=!st.drive&&!dvOn&&!opHide(m)&&!(ks&&m.userData.bezel);const gh=foc&&!foc.has(m.userData.part)&&m.userData.mat0!==M.glass;m.material=gh?ghostOf(base(m)):fin(m);m.userData.cs=!gh&&m.userData.mat0!==M.glass;castOn(m);}
    sh.visible=!st.drive&&!dvOn&&!st.draw&&!st.iso;
    /* Shadows (off by default): the key light's shadow map, an extra pass over every caster (about 380 draw calls and all the triangles again) and a costlier shader.
       The floor's shadow (sh) is a texture, always there. Turned off, the map (2048 px, 1024 on phones) is freed (three makes it again when it is next needed) */
    if(key.castShadow!==st.shadows){key.castShadow=st.shadows;if(!st.shadows&&key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}}
    document.querySelectorAll('#views button').forEach(b=>{b.disabled=st.drive&&(b.dataset.v==='box'||b.dataset.v==='dial');});
    $('#mwWrap').classList.toggle('hidden',!st.drive);
    $('#driveOn').checked=st.drive;
    cv.setAttribute('aria-label',`3D working model of a marine chronometer. ${st.tour>=0?`Walkthrough step ${st.tour+1} of ${TOUR.length}: ${TOUR[st.tour].t}.`:VIEW_DESC[st.view]||''}${st.drive?' Moving parts only.':''} Arrow keys turn it, plus and minus zoom, 0 resets the view.`);   /* for screen readers: what the stage shows */
    $('#ghost').checked=st.see;$('#draw').checked=st.draw==='tint';$('#drawInk').checked=st.draw==='ink';$('#edges').checked=st.edges;$('#edges').disabled=!!st.draw;$('#shadows').checked=st.shadows;stage.classList.toggle('colr',st.colr);stage.classList.toggle('csrc',st.csrc);$('#srcKey').classList.toggle('hidden',!st.csrc);$('#colr').checked=st.colr;$('#colrSrc').checked=st.csrc;stage.classList.toggle('draw',!!st.draw);partsSync();
  }

  /* ---------- camera ---------- */
  const C={yaw:0.75,pitch:0.42,dist:640,target:new THREE.Vector3(0,-20,0)},G={yaw:C.yaw,pitch:C.pitch,dist:C.dist,target:C.target.clone(),follow:null};
  let W=1,Hh=1;const resize=()=>{W=stage.clientWidth;Hh=stage.clientHeight;r.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
  const mvL=(x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>mv.localToWorld(v.clone());};
  const fixed=(x,y,z)=>()=>new THREE.Vector3(x,y,z);
  const VIEWS={
    box:{lidM:0,lidT:0,lift:0,flip:0,explode:0,yaw:0.72,pitch:0.4,dist:640,target:fixed(0,-22,0)},
    dial:{lidM:1,lidT:1,lift:0,flip:0,explode:0,yaw:0.3,pitch:1.02,dist:330,target:fixed(0,-15,0)},
    movement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:-0.62,pitch:0.64,dist:235,target:mvL(0,-19,2)},
    train:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:0.2,pitch:1.05,dist:210,target:mvL(0,-12,8),see:true},
    escapement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:78,target:mvL(8.0,-18.5,12),see:true},   /* from the pillar-plate side: the balance is then behind the escapement, not in front of it */
    exploded:{lidM:1,lidT:1,lift:1,flip:1,explode:1,yaw:0.9,pitch:0.28,dist:520,target:mvL(0,-40,0)},
    /* the train laid out along the barrel-fusee line (movement.js, DEV), seen square from the side through a narrow field, as the textbooks draw it: barrel left, hands below */
    laidout:{lidM:1,lidT:1,lift:1,flip:1,explode:0,dev:1,fov:20,yaw:Math.atan2(mv.userData.DEV.w[1],mv.userData.DEV.w[0]),pitch:0.05,dist:300,target:mvL(mv.userData.DEV.mid[0],-15,mv.userData.DEV.mid[1])},
    /* the barrel, chain and fusee, seen across the line joining them */
    fusee:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:Math.atan2(mv.userData.DEV.w[1],mv.userData.DEV.w[0]),pitch:0.2,dist:105,target:mvL((L.Fu[0]+L.Ba[0])/2,-12,(L.Fu[1]+L.Ba[1])/2),see:true},
    /* the balance close up under its cock, with the timing weights (Rate and timing weights' Show the balance comes here too) */
    balance:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:-0.9,pitch:0.35,dist:65,target:mvL(L.B[0],BAL_Y,L.B[1])}};
  const VIEW_DESC={box:'The chronometer in its mahogany box.',dial:'The dial, read through the glass-top cover.',movement:'The movement lifted out of its case, train side up.',
    train:'The going train from above, plates see-through: fusee wheel, centre, third, fourth and escape wheels.',escapement:'Close up on the detent escapement, from the pillar-plate side: the detent, the escape wheel and the balance’s rollers.',
    exploded:'Every part lifted apart along the arbors.',laidout:'The train laid out in one line and seen from the side: barrel, fusee, centre, third, fourth and escape wheels, and the balance.',
    fusee:'The mainspring barrel, the chain and the fusee, plates see-through.',balance:'Close up on the balance under its cock, with its timing weights and hairspring.'};
  /* keep the same horizontal coverage on narrow screens: distance grows as the aspect ratio falls below 1.5 */
  const aspectK=()=>clamp(1.25/(W/Hh),1,2.2);
  function goCam(v){G.yaw=C.yaw+((((v.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);G.pitch=v.pitch;G.dist=v.dist*aspectK()*(st.drive&&v.lift?0.8:1);G.follow=v.target;panO.set(0,0,0);camFree=false;}
  let camFree=false;const panO=new THREE.Vector3(),pv=new THREE.Vector3();
  function panBy(dx,dy){const k=2*C.dist*Math.tan(cam.fov*Math.PI/360)/cv.clientHeight;pv.setFromMatrixColumn(cam.matrixWorld,0).multiplyScalar(-dx*k);const u=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1).multiplyScalar(dy*k);pv.add(u);panO.add(pv);if(!G.follow)G.target.add(pv);}
  function setView(k,keepSee){const v=VIEWS[k];if(st.drive&&(k==='box'||k==='dial'))k='movement';if(ks&&k!=='dial')ksEnd();   /* the key is on the dial's square: another view puts it down */const vv=VIEWS[k];
    Object.assign(tgt,{lift:st.drive?1:vv.lift,flip:st.drive?1:vv.flip,explode:vv.explode*expV(),dev:(vv.dev||0)*expV(),fov:vv.fov||FOV0,lidM:vv.lidM,lidT:vv.lidT});goCam(vv);st.view=k;$('#expWrap').classList.toggle('hidden',k!=='exploded'&&k!=='laidout');
    expR.setAttribute('aria-label',k==='laidout'?'How far the train is laid out in a line':'How far apart the exploded parts are');
    if(!keepSee){st.see=!!vv.see;}look();if(hashReady)keep('view',k);
    document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===k?'true':'false'));}
  /* the hint under the stage stays until the model is first tapped, dragged, scrolled or given a key (or a card, help or the walkthrough covers it) */
  const hintOff=()=>{$('#hint').style.opacity=0;};for(const ev of['pointerdown','wheel','keydown'])cv.addEventListener(ev,hintOff,{once:true,passive:true});
  /* pointer: orbit, pinch, tap to pick; on touch, a long press (500 ms, barely moving) opens the fade/hide menu, since iOS fires no contextmenu */
  const ptrs=new Map();let pinch=0,down=null,rMoved=0,lpT=0,lpAt=-1e9;const lpStop=()=>{clearTimeout(lpT);lpT=0;};
  cv.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId);}catch(_){}stage.classList.add('grab');down={x:e.clientX,y:e.clientY,t:performance.now(),moved:0,btn:e.button,pan:e.shiftKey||e.button===1};if(e.button===1)e.preventDefault();
    lpStop();if(e.pointerType!=='mouse'&&ptrs.size===1){const x=e.clientX,y=e.clientY;lpT=setTimeout(()=>{lpT=0;if(!down||down.moved>6||ptrs.size!==1)return;down.lp=true;lpAt=performance.now();openOpm(x,y);if(opm.classList.contains('on')&&navigator.vibrate)navigator.vibrate(10);},500);}});
  cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;
    const pdx=e.clientX-p.x,pdy=e.clientY-p.y;
    if(down)down.moved+=Math.abs(e.clientX-p.x)+Math.abs(e.clientY-p.y);if(lpT&&down&&down.moved>6)lpStop();
    if(ptrs.size===1&&down&&down.moved>4&&down.pan)panBy(e.clientX-p.x,e.clientY-p.y);
    else if(ptrs.size===1&&down&&down.moved>4){camFree=true;C.yaw-=(e.clientX-p.x)*0.008;C.pitch=clamp(C.pitch+(e.clientY-p.y)*0.008,-1.52,1.52);G.yaw=C.yaw;G.pitch=C.pitch;}   /* pitch to 87° above or below (1.52 rad): at 90° lookAt has no up and the view spins */
    p.x=e.clientX;p.y=e.clientY;
    if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch)C.dist=G.dist=clamp(C.dist*pinch/d,30,1500);pinch=d;panBy(pdx/2,pdy/2);if(down)down.moved=99;}});
  const up=e=>{lpStop();if(down&&down.btn===2)rMoved=down.moved;const wasTap=down&&down.btn===0&&!down.lp&&down.moved<6&&ptrs.size===1&&performance.now()-down.t<500;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(!ptrs.size){stage.classList.remove('grab');}
    if(wasTap&&e.type==='pointerup')pick(e);if(!ptrs.size)down=null;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();C.dist=G.dist=clamp(C.dist*Math.exp(e.deltaY*0.0012),30,1500);},{passive:false});
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  function pick(e){if(help.classList.contains('on')){showHelp(false);return;}const rc=cv.getBoundingClientRect();ndc.set((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects([BX.root],true).filter(h=>shown(h.object)&&h.object.userData.part&&!(h.object.material.transparent&&h.object.material.opacity<0.5));
    const hit=hits.find(h=>INFO[h.object.userData.part]);
    if(!hit){closeInfo();return;}showPart(hit.object.userData.part);}
  /* the cards' sizes in millimetres or in inches, the manual's unit (a range converts both ends; areas, volumes and sizes already in inches are left) */
  const U=t=>units==='in'?t.replace(/(\d+(?:\.\d+)?)(?:\s?[–-]\s?(\d+(?:\.\d+)?))?\s?mm(?![²³\w])/g,(m,a,b)=>(a/25.4).toFixed(3)+(b?'–'+(b/25.4).toFixed(3):'')+' in'):t;
  function showPart(p){showHelp(false);st.hid.delete(p);if(st.iso)st.iso.add(p);st.pick=p;look();let[t,d,sp]=INFO[p];d=U(d);sp=U(sp||'');
    const info=$('#info');info.querySelector('h3').textContent=t;info.querySelector('p').textContent=d;info.querySelector('.spec').textContent=sp||'';const q=PARTS[p];info.querySelector('.src').innerHTML=q.src?`<i style="--ps:${SRC[q.src][1]}"></i>${SRC[q.src][0]}: ${U(q.sn)}${q.figs?`. Figs. ${q.figs}`:''}.`:'';info.classList.add('on');hintOff();}
  function closeInfo(){if(st.pick){st.pick=null;look();}$('#info').classList.remove('on');}
  $('#info .x').addEventListener('click',closeInfo);
  /* right-click (or long-press) a part: opacity, hide and isolate. Prefers the nearest solid part, so faded parts in front can be looked through.
     Hidden parts can't be clicked, so the menu lists them for unhiding, and offers the way back from isolation; right-click empty space to reach those alone */
  const opm=$('#opm'),opIn=opm.querySelector('input'),opOut=opm.querySelector('output'),opP=$('#opPart'),opH=$('#opHid'),opI=$('#opIso'),chips=opH.querySelector('.chips');let opPart=null;
  const opShow=()=>{const v=Math.round((st.op[opPart]??1)*100);opIn.value=v;opOut.textContent=v+'%';};
  function opList(){chips.innerHTML='';for(const p of st.hid){const b=document.createElement('button');b.textContent=INFO[p][0];b.title='Show '+INFO[p][0];b.addEventListener('click',()=>{st.hid.delete(p);look();opRender();});chips.appendChild(b);}}
  function opRender(){opP.classList.toggle('hidden',!opPart);opH.classList.toggle('hidden',!st.hid.size);opI.classList.toggle('hidden',!st.iso);opList();
    if(st.iso)opI.querySelector('.hl').textContent='Showing only '+[...st.iso].map(p=>INFO[p][0]).join(', ');opm.querySelector('[data-a="iso"]').classList.toggle('hidden',!!(st.iso&&st.iso.size===1&&st.iso.has(opPart)));
    opm.querySelector('h4').textContent=opPart?INFO[opPart][0]:st.hid.size?'Hidden parts':'Isolated';if(opPart)opShow();if(!opPart&&!st.hid.size&&!st.iso)closeOpm();}
  function closeOpm(){opm.classList.remove('on');opPart=null;}
  /* Android fires its own contextmenu on a long press: whichever comes first opens the menu, once, and the press never picks */
  cv.addEventListener('contextmenu',e=>{e.preventDefault();lpStop();if(performance.now()-lpAt<800)return;if((down?down.moved:rMoved)>6)return;if(down)down.lp=true;openOpm(e.clientX,e.clientY);});
  function openOpm(cx,cy){const rc=cv.getBoundingClientRect();ndc.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects([BX.root],true).filter(h=>shown(h.object)&&INFO[h.object.userData.part]);
    const hit=hits.find(h=>!(h.object.material.transparent&&h.object.material.opacity<0.5))||hits.find(h=>st.op[h.object.userData.part]!=null);
    if(!hit&&!st.hid.size&&!st.iso){closeOpm();return;}
    opPart=hit?hit.object.userData.part:null;opm.classList.add('on');opRender();
    const sr=stage.getBoundingClientRect();opm.style.left=clamp(cx-sr.left+8,8,sr.width-opm.offsetWidth-8)+'px';opm.style.top=clamp(cy-sr.top+8,8,sr.height-opm.offsetHeight-8)+'px';}
  opIn.addEventListener('input',()=>{if(!opPart)return;const v=opIn.valueAsNumber/100;if(v>=1)delete st.op[opPart];else st.op[opPart]=v;opOut.textContent=opIn.value+'%';look();});
  opm.querySelectorAll('button[data-a]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.a;
    if(a==='hide'){if(opPart){st.hid.add(opPart);isoDrop(opPart);opPart=null;}}else if(a==='iso'){if(opPart){st.iso=new Set([opPart]);st.hid.delete(opPart);delete st.op[opPart];}}else if(a==='uniso')st.iso=null;
    else if(a==='showall'){st.hid.clear();st.iso=null;}else if(a==='all'){st.op={};st.hid.clear();st.iso=null;}else if(opPart)delete st.op[opPart];
    look();opRender();}));
  cv.addEventListener('pointerdown',e=>{if(e.button!==2)closeOpm();});
  /* how to use it: every control for a mouse and for touch. Stays open while the model is dragged, so the gestures can be tried; a tap, × or Esc closes it */
  const help=$('#help'),helpBtn=$('#helpBtn');
  function showHelp(on){help.classList.toggle('on',on);helpBtn.setAttribute('aria-expanded',on?'true':'false');if(on){closeInfo();closeOpm();hintOff();}}
  helpBtn.addEventListener('click',()=>showHelp(!help.classList.contains('on')));help.querySelector('.x').addEventListener('click',()=>showHelp(false));
  document.addEventListener('keydown',e=>{if(ESSAY.on())return;   /* the essay shows: its keys scroll it, and the tabs take their own (essay.js) */
    if(e.key==='Escape'){closeOpm();showHelp(false);}
    if(e.key==='?'&&!/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)&&!$('#about').open)showHelp(!help.classList.contains('on'));
    /* space bar: stop and restart, unless typing or pressing a button */
    if(e.key===' '&&!/^(INPUT|BUTTON|SELECT|TEXTAREA|SUMMARY)$/.test(document.activeElement.tagName)&&!$('#about').open){e.preventDefault();setSpeed(st.speed?0:(lastSpeed||1));}
    /* 1 to 9: the views, in the order of their buttons. A disabled one (Box and Dial, with Moving parts only) says why, in the HUD, and its button flashes */
    if(/^[1-9]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)&&!$('#about').open){const b=document.querySelectorAll('#views button')[+e.key-1];
      if(!b)return;if(!b.disabled)b.click();else{hudNote(`${b.textContent} view: turn off Moving parts only first`);b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');clearTimeout(b.nopeT);b.nopeT=setTimeout(()=>b.classList.remove('nope'),700);}}
    /* with the model focused (Tab to it, or click it): arrow keys turn the view as a drag does, + and − zoom, 0 resets the view */
    if(document.activeElement===cv&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const a={ArrowLeft:[0.08,0],ArrowRight:[-0.08,0],ArrowUp:[0,-0.06],ArrowDown:[0,0.06]}[e.key];
      if(a){e.preventDefault();camFree=true;C.yaw+=a[0];C.pitch=clamp(C.pitch+a[1],-1.52,1.52);G.yaw=C.yaw;G.pitch=C.pitch;}
      else if(/^[-+=_]$/.test(e.key)){e.preventDefault();C.dist=G.dist=clamp(C.dist*(/^[-_]$/.test(e.key)?1.12:1/1.12),30,1500);}
      else if(e.key==='0'){e.preventDefault();setView(st.view,true);}}});

  /* ---------- controls ---------- */
  /* speed: presets, or any value from 0.01x to 10000x on a log slider or typed in */
  const spdR=$('#spdR'),spdN=$('#spdN'),SMIN=0.01,SMAX=10000;let lastSpeed=1;
  const fmtSpd=v=>v===0?'stopped':(v<1?(1/v===Math.round(1/v)?'1/'+Math.round(1/v):String(+v.toPrecision(2))):v.toLocaleString('en',{maximumFractionDigits:v<10?2:0}))+'×';
  const setSpeed=(v,from)=>{v=v>0?clamp(v,SMIN,SMAX):0;st.speed=v;if(v)lastSpeed=v;
    document.querySelectorAll('#speeds button').forEach(x=>x.setAttribute('aria-pressed',Math.abs(parseFloat(x.dataset.v)-v)<1e-9?'true':'false'));
    if(from!=='r'&&v)spdR.value=Math.round((Math.log10(v)-Math.log10(SMIN))/(Math.log10(SMAX)-Math.log10(SMIN))*1000);
    if(from!=='n')spdN.value=v?+v.toPrecision(3):0;};
  spdR.addEventListener('input',()=>{const t=spdR.valueAsNumber/1000,v=Math.pow(10,Math.log10(SMIN)+t*(Math.log10(SMAX)-Math.log10(SMIN)));
    const snap=[0.05,0.1,0.5,1,2,5,10,60,100,600,1000,3600,10000].find(q=>Math.abs(Math.log10(q/v))<0.03);setSpeed(snap??+v.toPrecision(2),'r');});
  spdN.addEventListener('change',()=>{const v=spdN.valueAsNumber;if(Number.isFinite(v))setSpeed(v,'n');spdN.value=st.speed?+st.speed.toPrecision(3):0;});setSpeed(st.speed);
  document.querySelectorAll('#views button').forEach(b=>b.addEventListener('click',()=>{closeInfo();setView(b.dataset.v);}));
  document.querySelectorAll('#speeds button').forEach(b=>b.addEventListener('click',()=>setSpeed(parseFloat(b.dataset.v))));
  $('#driveOn').addEventListener('change',e=>{st.drive=e.target.checked;closeInfo();setView(st.drive?(st.view==='box'||st.view==='dial'?'movement':st.view):'dial');});
  /* about: sources and method in a dialog */
  const about=$('#about'),aboutOpen=()=>{if(about.showModal)about.showModal();else about.setAttribute('open','');};$('#aboutBtn').addEventListener('click',aboutOpen);
  about.addEventListener('click',e=>{if(e.target===about)about.close();});
  $('#mwOn').addEventListener('change',e=>{st.mwOn=e.target.checked;look();});
  /* settings this browser remembers, as it does the theme and the open sections: plate finish, dial, balance and the last view (applied at load, beside the hash) */
  const SET=(()=>{try{const o=JSON.parse(localStorage.getItem('cm-set')||'{}');return o&&typeof o==='object'?o:{};}catch(_){return{};}})(),keep=(k,v)=>{SET[k]=v;try{localStorage.setItem('cm-set',JSON.stringify(SET));}catch(_){}};
  units=SET.units==='in'?'in':'mm';
  document.querySelectorAll('#units button').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.v===units?'true':'false');b.addEventListener('click',()=>{units=b.dataset.v;keep('units',units);
    document.querySelectorAll('#units button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));if(st.pick)showPart(st.pick);});});
  document.querySelectorAll('#bal button').forEach(b=>b.addEventListener('click',()=>{mv.userData.balance(b.dataset.v);keep('bal',b.dataset.v);document.querySelectorAll('#bal button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  $('#ghost').addEventListener('change',e=>{st.see=e.target.checked;look();});$('#colr').addEventListener('change',e=>{st.colr=e.target.checked;if(st.colr)st.csrc=false;look();});$('#colrSrc').addEventListener('change',e=>{st.csrc=e.target.checked;if(st.csrc)st.colr=false;look();});$('#draw').addEventListener('change',e=>{st.draw=e.target.checked?'tint':false;look();});$('#drawInk').addEventListener('change',e=>{st.draw=e.target.checked?'ink':false;look();});$('#edges').addEventListener('change',e=>{st.edges=e.target.checked;look();});$('#shadows').addEventListener('change',e=>{st.shadows=e.target.checked;look();});
  const DIAL_INFO={hamilton:[INFO.dial[1],INFO.hands[1]],roman:['Black on silver-white, in the German style of the A. Lange & Söhne deck chronometers (maker’s name and number left off): Roman hours set radially, with IIII and the VI covered by a large seconds sub-dial; railroad minute and seconds tracks; the wind indicator reads AUF (up) to AB (down). Its scale is drawn on this movement’s 314° sweep.','Gilt leaf hour hand and lance minute hand, gilt wind indicator hand, blued seconds hand. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.'],
    swiss:['Black on white, in the style of the Ulysse Nardin (Le Locle) deck chronometers (maker’s name and number left off): Roman hours set radially, with IIII and the VI covered by a large seconds sub-dial; railroad minute and seconds tracks; the wind indicator reads UP / HAUT to DOWN / BAS. Its scale is drawn on this movement’s 314° sweep.','Blued pear hour and minute hands, blued wind indicator hand, a long blued seconds hand with a spear counterpoise. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.'],
    soviet:['Black on white, in the style of the First Moscow Watch Factory deck chronometers, which copied the Nardin layout (maker’s name and number left off): upright Arabic hours, with the 6 covered by a large seconds sub-dial marked СДЕЛАНО В СССР (made in the USSR); railroad minute and seconds tracks; the wind indicator reads ЗАВОД (wound) to СПУСК (run down). Its scale is drawn on this movement’s 314° sweep.','Aged gilt pear hour and minute hands, blued wind indicator hand, a long blued seconds hand with a spear counterpoise. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.']};
  document.querySelectorAll('#dialSt button').forEach(b=>b.addEventListener('click',()=>{mv.userData.dial(b.dataset.v);keep('dial',b.dataset.v);look();[INFO.dial[1],INFO.hands[1]]=DIAL_INFO[b.dataset.v];document.querySelectorAll('#dialSt button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  document.querySelectorAll('#finish button').forEach(b=>b.addEventListener('click',()=>{M.setPlateFinish(b.dataset.v);keep('finish',b.dataset.v);look();document.querySelectorAll('#finish button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  $('#lbls').addEventListener('change',e=>st.labels=e.target.checked);$('#rock').addEventListener('change',e=>st.rock=e.target.checked);$('#latch').addEventListener('change',e=>st.latch=e.target.checked);
  const hIn=$('#hrs'),hOut=hIn.parentElement.querySelector('output');
  const showH=()=>{hOut.textContent=hrs.toFixed(1)+' h';hIn.value=hrs.toFixed(1);};
  hIn.addEventListener('input',()=>{if(kw)kwStop();hrs=parseFloat(hIn.value);winding=false;showH();});showH();
  $('#wind').addEventListener('click',()=>{if(kw)kwStop();winding=true;});
  $('#reset').addEventListener('click',()=>{setView(st.view,true);});
  /* exploded view: how far apart the parts spread */
  const expR=$('#expR'),expO=$('#expWrap output');function expV(){return expR.valueAsNumber/100;}
  const showExp=()=>{expO.textContent=expR.value+'%';};showExp();expR.addEventListener('input',()=>{showExp();if(st.tour<0){if(st.view==='exploded')tgt.explode=expV();else if(st.view==='laidout')tgt.dev=expV();}});
  /* set the hands: only the time of day changes (the balance keeps its phase) and no power is used */
  const todIn=$('#tod');let todS=-1;
  const setTod=v=>{const m=/^(\d+):(\d+)(?::(\d+))?/.exec(v);if(!m)return;slip=0;pend.add('set');tSim=Math.floor(tSim/86400)*86400+(+m[1])*3600+(+m[2])*60+(+(m[3]||0))+(tSim%1);lastE=null;todS=-1;rErr=0;handsSet=true;H.eOff=0;if(H.held)H.Eh=Math.floor(tSim/0.5+H.bOff);};
  todIn.addEventListener('change',()=>setTod(todIn.value));
  $('#now').addEventListener('click',()=>{tSim=tM=Date.now()/1000+tzOff();slip=0;pend.add('set');bookDay=dayOf(tM);lastE=null;todS=-1;rErr=0;handsSet=false;H.eOff=0;if(H.held)H.Eh=Math.floor(tSim/0.5+H.bOff);});
  /* GMT or local: the hands move by the difference, as when they are set */
  const setTz=v=>{const o=tzOff();tz=v;tSim+=tzOff()-o;tM+=tzOff()-o;bookDay=dayOf(tM);if(hashReady)pend.add('set');lastE=null;todS=-1;rErr=0;document.querySelectorAll('#tz button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===v?'true':'false'));$('#now').title=v==='gmt'?'Set the hands to Greenwich time':'Set the hands to your clock';};
  document.querySelectorAll('#tz button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.v!==tz)setTz(b.dataset.v);}));
  /* setting the hands while it runs, as the manual does it (Sec. III, Setting While Running): gimbals latched, bezel off, the key on the square at the centre of the dial, turned by its
     shank, forward only. The minute hand goes on its marker half a minute behind the master (as the master's second hand passes 30), then to the next marker as the master's
     passes 60. The second hand is never touched, so the dial can still be up to 30 s out, and it goes into the record. ks.ph: 1 turning forward, 2 waiting for the master's 60, 3 done */
  const setOut=$('#setOut'),ksBtn=$('#ksBtn'),minT=()=>tSim+(H.bOff+H.eOff)/2+slip;
  function ksStart(){if(ks){ksEnd();return;}if(kw)kwStop();if(st.tour>=0)tourEnd();closeInfo();
    sw=null;ks={ph:1,t:0,latch0:st.latch,fast:(((tM-30-minT())%43200)+43200)%43200>21600};st.latch=true;$('#latch').checked=true;setView('dial');look();
    ksBtn.textContent='Stop setting';ksBtn.setAttribute('aria-pressed','true');setOut.classList.remove('hidden');}
  function ksEnd(){if(!ks)return;st.latch=ks.latch0;$('#latch').checked=st.latch;ks=null;look();ksBtn.textContent='With the key';ksBtn.setAttribute('aria-pressed','false');}
  function ksStep(dt){const d=(((tM-30-minT())%43200)+43200)%43200;   /* how far forward the minute hand still has to go */
    if(ks.ph===1){const v=Math.max(300,2*d)*dt;if(d<=v){slip+=d;ks.ph=2;ks.s0=Math.floor(tM/60);}else slip+=v;
      setOut.innerHTML=`Gimbals latched, bezel off, the key on the square. Turning the hour and minute hands forward${ks.fast?': the dial was fast, and they turn forward only, so they go nearly round the dial':''}.`;}
    else if(ks.ph===2){if(Math.floor(tM/60)>ks.s0){const g=(((tM-minT())%43200)+43200)%43200;slip+=g<21600?g:0;pend.add('set');ks.ph=3;ks.t=performance.now();const e=dialRead()-tM;
        setOut.innerHTML=`<b>Set.</b> At the master's 60 the minute hand went to the next marker. The second hand was left alone, so the dial reads ${Math.abs(e)<0.25?'with the master':`<b>${fmtErr(e)}</b> ${e>0?'fast':'slow'}`} (this way it can be up to 30 s out). A navigator records that error rather than setting it out.`;}
      else setOut.innerHTML=`The minute hand is on its marker, half a minute behind the master. At the master's 60 it goes to the next one: <b>${Math.ceil(60-(((tM%60)+60)%60))} s</b>${st.speed?'':' (the model is stopped)'}.`;}
    else if(performance.now()-ks.t>2500)ksEnd();}   /* the key comes off and the bezel goes back */
  ksBtn.addEventListener('click',ksStart);
  $('#spin').addEventListener('change',e=>st.spin=e.target.checked);
  /* theme: Auto follows the system; a choice is remembered in this browser */
  const setTheme=v=>{const de=document.documentElement;if(v==='auto')delete de.dataset.theme;else de.dataset.theme=v;document.querySelectorAll('#theme button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===v?'true':'false'));try{localStorage.setItem('cm-theme',v);}catch(_){}};
  document.querySelectorAll('#theme button').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.v)));
  try{const v=localStorage.getItem('cm-theme');if(v==='light'||v==='dark')setTheme(v);}catch(_){}
  /* save the view as a PNG: render and copy in the same task, while the drawing buffer is still valid, over the page background */
  $('#shot').addEventListener('click',()=>{paint();const c2=document.createElement('canvas');c2.width=cv.width;c2.height=cv.height;const x=c2.getContext('2d');x.fillStyle=getComputedStyle(document.body).backgroundColor;x.fillRect(0,0,c2.width,c2.height);x.drawImage(cv,0,0);
    c2.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hamilton-model-21.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);});});
  /* Link: the page's address with this state in its hash (not waiting for writeHash); without the clipboard, it is put in the address bar */
  $('#link').addEventListener('click',()=>{const b=$('#link'),h=hashOf(),u=location.href.split('#')[0]+(h?'#'+h:''),say=t=>{b.textContent=t;clearTimeout(b.t);b.t=setTimeout(()=>b.textContent='Link',1500);};
    const bar=()=>{history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);};
    try{navigator.clipboard.writeText(u).then(()=>{bar();say('Copied');},()=>{bar();say('In address bar');});}catch(_){bar();say('In address bar');}});
  /* Reset display: each Display box back to its default (See-through to the view's own; the drawings before Edges, which they disable), faded and hidden parts back. The theme stays */
  $('#dispReset').addEventListener('click',()=>{const D={lbls:false,draw:false,drawInk:false,edges:true,shadows:false,ghost:!!VIEWS[st.view].see,colr:false,colrSrc:false,rock:false,latch:false,spin:false};
    for(const k in D){const c=$('#'+k);if(c.checked!==D[k]){c.checked=D[k];c.dispatchEvent(new Event('change'));}}st.op={};st.hid.clear();st.iso=null;look();opRender();});
  /* the panel's sections: each viewer's open and closed ones are remembered (without a record, View, Time, Winding and Display are open) */
  const DET=[...document.querySelectorAll('.ctl>details.grp')];
  try{const o=JSON.parse(localStorage.getItem('cm-open')||'{}');DET.forEach(d=>{if(typeof o[d.id]==='boolean')d.open=o[d.id];});}catch(_){}
  DET.forEach(d=>d.addEventListener('toggle',()=>{try{localStorage.setItem('cm-open',JSON.stringify(Object.fromEntries(DET.map(x=>[x.id,x.open]))));}catch(_){}}));
  /* parts list: every named part, grouped. A name singles the part out as a tap does; the box hides it, as the right-click menu does */
  const BOXP=new Set(PGRP[0][1]),plist=$('#plist'),PROWS=[];
  for(const[g,ps]of PGRP){plist.insertAdjacentHTML('beforeend',`<div class="plist-h">${g}</div>`);const gh=plist.lastElementChild;
    for(const p of ps){const row=document.createElement('div');row.className='prow';row.innerHTML=`<input type="checkbox" checked aria-label="Show ${INFO[p][0]}"><button class="pn">${INFO[p][0]}</button>`;
      if(PCOL[p])row.style.setProperty('--pc',PCOL[p]);if(PARTS[p].src)row.style.setProperty('--ps',SRC[PARTS[p].src][1]);const ck=row.firstChild,b=row.lastChild;
      ck.addEventListener('change',()=>{if(ck.checked){st.hid.delete(p);if(st.iso)st.iso.add(p);}else{st.hid.add(p);isoDrop(p);if(st.pick===p)closeInfo();}look();});   /* while isolated, a box ticked adds its part to the isolation */
      b.addEventListener('click',()=>{st.pick===p?closeInfo():showPart(p);});plist.appendChild(row);PROWS.push({p,row,ck,b,gh,txt:[p,INFO[p][0],PARTS[p].sp,PARTS[p].sn].join(' ').toLowerCase(),figs:new Set((PARTS[p].figs||'').split(', ').flatMap(f=>{const[a,z]=f.split('–').map(Number);return z?Array.from({length:z-a+1},(_,i)=>a+i):[a];}))});}}
  /* search: by name, key, Hamilton part number (42087 finds the detent) or source note, every word; or by figure, fig 90 (the manual's figures that show it, ranges included). A group with nothing found hides its heading */
  const pSearch=$('#pSearch');pSearch.addEventListener('input',()=>{const v=pSearch.value.trim().toLowerCase(),fm=/^figs?\.?\s*(\d+)$/.exec(v),q=v.split(/\s+/).filter(Boolean),hit=new Set();
    for(const r of PROWS){const on=fm?r.figs.has(+fm[1]):q.every(w=>r.txt.includes(w));r.row.classList.toggle('hidden',!on);if(on)hit.add(r.gh);}for(const r of PROWS)r.gh.classList.toggle('hidden',!hit.has(r.gh));
    $('#pNone').classList.toggle('hidden',hit.size>0);});
  $('#pShow').addEventListener('click',()=>{st.hid.clear();st.iso=null;look();});
  /* rate: the timing and vernier weight pairs turned in or out in eighth turns, up to 3 turns either way (R.timing, movement.js, sets the pitch from the
     manual's rate for a turn). The period goes as √I, so the model clock runs √(I0/I) as fast as a perfect one; rErr is what the hands have gained since
     the weights were moved or the hands set */
  const I0=R.timing(0,0),twR=$('#twR'),vwR=$('#vwR'),rateOut=$('#rateOut');let rI=I0,lastRS=0;
  const eighths=v=>{if(!v)return'0';const a=Math.abs(v),w=Math.floor(a/8);return(w||'')+['','⅛','¼','⅜','½','⅝','¾','⅞'][a%8]+(v>0?' out':' in');};
  const travel=(v,p)=>v?Math.abs(v/8*p).toFixed(2)+(v>0?' mm out':' mm in'):'at mid-travel';
  function rateShow(){const d=86400*(rateK-1),dI=(rI/I0-1)*100,on=Math.abs(d)<0.05,t=twR.valueAsNumber,v=vwR.valueAsNumber;
    rateOut.innerHTML=`<b>${on?'On time':(d>0?'Gains ':'Loses ')+Math.abs(d).toFixed(1)+' s a day'}</b>${on?'':`<span>Since the last change the hands have ${d<0?'lost':'gained'} ${Math.abs(rErr).toFixed(Math.abs(rErr)<10?2:1)} s.</span>`}`+
      `<span>${!t&&!v?'Both pairs at mid-travel':`Timing weights ${travel(t,R.pitch.t)}, verniers ${travel(v,R.pitch.v)}`}. Moment of inertia ${rI.toFixed(1)} g·mm²${on?'':`, ${dI<0?'−':'+'}${Math.abs(dI).toPrecision(2)}%`}.</span>`;}
  function rateSet(){rI=R.timing(twR.valueAsNumber/8,vwR.valueAsNumber/8);rateK=Math.sqrt(I0/rI);rErr=0;pend.add('weights moved');
    twR.nextElementSibling.textContent=eighths(twR.valueAsNumber);vwR.nextElementSibling.textContent=eighths(vwR.valueAsNumber);rateShow();}
  twR.addEventListener('input',rateSet);vwR.addEventListener('input',rateSet);rateSet();
  $('#rateZero').addEventListener('click',()=>{twR.value=0;vwR.value=0;rateSet();});
  /* ---------- the navigator's rate book (Sec. IX, Recording the Rate; Table I): the dial error against the master, to the nearest half second as the hands step, compared at
     noon each day (master time) or on demand; the daily rate is the change in error per day; the mean daily rate and the mean deviation over the comparisons since the last
     break (started, stopped, set, not wound). Then what the error means at sea: 4 s of time is 1' of longitude, cos(latitude) nautical miles ---------- */
  const dayOf=t=>Math.floor((t-43200)/86400),BREAK=['set','started','stopped','not wound'],bookT=$('#bookT'),bookLon=$('#bookLon'),latIn=$('#lat');bookDay=dayOf(tM);let lastBL=0;
  const hm=t=>{const d=new Date(t*1000);return d.getUTCDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
  const sgn=(v,n=1)=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n),half=v=>Math.round(v*2)/2;
  function bookStats(){const run=[];for(let i=book.length-1;i>0;i--){if(book[i].rem.some(r=>BREAK.includes(r)))break;if(book[i].rate==null)continue;run.unshift(book[i].rate);if(run.length===10)break;}   /* a comparison too soon after the last for a rate is skipped, not a break */
    const m=run.length?run.reduce((a,b)=>a+b,0)/run.length:null;return{m,dev:m==null?null:run.reduce((a,b)=>a+Math.abs(b-m),0)/run.length,n:run.length};}
  /* the rate is taken against the latest comparison at least half a day back with no break since: over a shorter time, reading to the half second swamps it */
  function bookAdd(){const e=half(dialRead()-tM),rem=[...pend];pend.clear();let prev=null;
    if(!rem.some(r=>BREAK.includes(r)))for(let i=book.length-1;i>=0;i--){if(tM-book[i].t>=43200){prev=book[i];break;}if(book[i].rem.some(r=>BREAK.includes(r)))break;}
    const rate=prev?(e-prev.e)/((tM-prev.t)/86400):null;book.push({t:tM,e,rate,rem:book.length?rem:['first comparison',...rem.filter(r=>r!=='weights moved')]});bookShow();}
  function bookShow(){const S=bookStats();
    bookT.innerHTML=book.length?'<table class="rt book"><thead><tr><th>Master</th><th class="n" title="Dial error, seconds: + fast, − slow">Error</th><th class="n" title="Daily rate, seconds a day: + gaining, − losing">Rate</th><th class="n" title="Deviation from the mean daily rate">Dev.</th><th>Remarks</th></tr></thead><tbody>'+book.slice(-12).map(r=>
      `<tr><td>${hm(r.t)}</td><td class="n">${sgn(r.e)}</td><td class="n">${r.rate==null?'':sgn(r.rate)}</td><td class="n">${r.rate==null||S.m==null?'':(Math.abs(r.rate-S.m)).toFixed(1)}</td><td>${r.rem.join(', ')}</td></tr>`).join('')+'</tbody></table>'+
      (S.m==null?'':`<p class="note" style="margin:6px 0 0">Mean daily rate <b>${sgn(S.m,2)} s</b> (${S.m>=0?'gaining':'losing'}), mean deviation ${S.dev.toFixed(2)} s, over ${S.n} day${S.n>1?'s':''} since the last break.</p>`)
      :'<p class="note" style="margin:0">No comparisons yet. One is made at noon each day, master time (try 3600×), or now.</p>';}
  function bookLive(now){if(now-lastBL<250||!$('#bookDet').open)return;lastBL=now;const e=dialRead()-tM,lat=clamp(+latIn.value||0,-89,89),nm=x=>Math.abs(x)/4*Math.cos(lat*D2R),L=book[book.length-1],S=bookStats();
    let t=`<b>Dial error now ${fmtErr(e)}</b><span>Read uncorrected, it puts the ship ${(Math.abs(e)/4).toFixed(2)}′ of longitude ${e>0?'west':'east'} of where it is: ${nm(e).toFixed(2)} nautical miles at ${Math.abs(lat)}° ${lat<0?'S':'N'}.</span>`;
    if(L&&S.m!=null){const pr=L.e+S.m*(tM-L.t)/86400,r=e-pr;t+=`<span>Corrected as the navigator does, the last comparison's error plus ${((tM-L.t)/86400).toFixed(1)} days at the mean rate (${fmtErr(pr)}), ${Math.abs(r)<0.25?'it is right to the half second':`the error left is ${fmtErr(r)}, ${nm(r).toFixed(2)} nautical miles`}.</span>`;}
    else t+='<span>With two comparisons a day apart and no break between, the book gives a rate to correct it with.</span>';
    bookLon.innerHTML=t;}
  $('#bookNow').addEventListener('click',bookAdd);$('#bookClr').addEventListener('click',()=>{book=[];bookShow();});bookShow();
  $('#rateLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();setView('balance');showPart('bal');});
  /* ---------- stopping and starting (Sec. III): a detent chronometer is not self-starting. The balance swings at amplitude H.amp; below ESC.AMIN a swing no longer
     carries the discharge jewel past the trip spring, unlocks the wheel and sees the impulse through, so the train stops at a locked beat and the balance runs down freely
     (TAU_FREE, estimated). The locking arm (Fig. 9) brakes it within a swing or two; the train-blocking screw's dog point stops the fourth wheel at a spoke; at run down
     the train stops. The train runs again when there is power, the arm is off, the screw is up and the balance swings above AMIN: at once if it is still swinging
     (the screw raised in time, or wound before the balance stops), otherwise after a twist of the box, which sets the balance swinging (the manual's way to start it).
     While the train is held tSim and the hands stand, and the balance keeps its own phase in H.bph (oscillations); on restarting, H.bOff (phase) and H.eOff (beats)
     carry both across, so neither the balance nor the hands jump. H.arm and H.blk move on frame time: the arm 0 unlocked to 1 locked, the screw 0 up to 1 down ---------- */
  const H={amp:ESC.A,held:false,bph:0,bOff:0,eOff:0,Eh:0,arm:0,armT:0,blk:0,blkT:0,kick:0,twT:-1},TAU_FREE=25,TAU_ARM=0.2,TAU_UP=3,stopOut=$('#stopOut'),twistB=$('#twist');let lastSO=0;
  if(/[?&]qa\b/.test(location.search))window.__H=()=>({...H,E:lastE,tSim,hrs,tM,slip});   /* for the tools: the stop/start state, the master time and the hands' slip */
  const segSet=(sel,v)=>document.querySelectorAll(sel+' button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===v?'true':'false'));
  const armSet=v=>{H.armT=v;segSet('#armSeg',v);twistB.disabled=!!v;twistB.title=v?'Unlock the balance first: the locking arm holds its rim':'Give the box a quick twist, which sets the balance swinging: how a stopped chronometer is started';wake();},blkSet=v=>{H.blkT=v;segSet('#blkSeg',v);wake();};
  document.querySelectorAll('#armSeg button').forEach(b=>b.addEventListener('click',()=>armSet(+b.dataset.v)));
  document.querySelectorAll('#blkSeg button').forEach(b=>b.addEventListener('click',()=>blkSet(+b.dataset.v)));
  const blockedNow=()=>H.blk>R.tbs.userData.vFace;
  function stopWhy(run){if(!run)return'Run down';if(!H.held)return'';if(H.arm>0.5)return'Balance locked';if(blockedNow())return'Train blocked';return H.amp>0.5*D2R?'Stopping: the balance swings too little to unlock':'Stopped: twist to start';}
  const twist=()=>{if(H.armT){stopMsg('Unlock the balance first: the arm holds its rim.');return;}
    if(H.amp<0.5*D2R)H.bph=Math.floor(H.bph)+0.75;   /* from rest: the balance at its dead point, on the return swing */
    H.kick=160*D2R;H.twT=performance.now();wake();
    if(hrs>=RUN_H)stopMsg('Twisted, but it is run down: with no power the balance swings down again. Wind it first.');else if(blockedNow())stopMsg('Twisted, but the train is blocked: the balance swings without unlocking the wheel. Raise the screw.');};twistB.addEventListener('click',twist);
  /* setting when stopped (Sec. III, Setting When Stopped): stop the balance (here with the locking arm), wait until the master overtakes a fast dial, or until the second hands
     agree on a slow one, unlock, and start it with a twist at that instant. The escape wheel stands locked, so the second hand is on a half second. sw: the steps under way */
  const ssBtn=$('#ssBtn');
  ssBtn.addEventListener('click',()=>{if(ks)ksEnd();if(!H.armT&&!H.held){sw={t:0};armSet(1);setOut.classList.remove('hidden');}else if(H.armT){sw=sw||{t:0};armSet(0);}else{sw={t:performance.now(),go:!H.armT};twist();}});
  const ssLabel=()=>{const l=H.armT?'Unlock arm':H.held?'Twist to start':'Stop to set';if(ssBtn.textContent!==l)ssBtn.textContent=l;};   /* the button is the next step, whatever stopped it */
  function ssStep(dt){const e=dialRead()-tM,sT=tSim+(H.bOff+H.eOff)/2,w=(((sT-tM)%60)+60)%60;
    if(!H.held&&!H.armT){if(sw.go){const a=(performance.now()-sw.t)/1000;if(a>6)sw=null;else if(a>0.3&&!sw.said){sw.said=1;setOut.innerHTML=`<b>Started.</b> The dial reads ${Math.abs(e)<0.25?'with the master':`<b>${fmtErr(e)}</b> ${e>0?'fast':'slow'}`}: what is left is the moment of the twist.${Math.abs(e)>=30?' Set the minutes with the key.':''}`;}}else if(H.amp>=ESC.AMIN)sw=null;return;}
    if(H.armT&&!H.held){setOut.innerHTML='The locking arm is coming onto the rim: the balance stops within a swing or two.';return;}
    setOut.innerHTML=(H.armT?`Stopped with the locking arm; the second hand stands on a half second. `:'')+(e>0.25?`The dial is <b>${fmtErr(e)}</b> fast: the master overtakes it in <b>${e.toFixed(1)} s</b>. ${H.armT?'Unlock the arm, then twist':'Twist'} to start at that instant.`:
      e<-0.25?`The dial is <b>${fmtErr(e)}</b> slow: start it as the second hands agree, in <b>${(w>59.75?0:w).toFixed(1)} s</b>, then set the minutes forward with the key.`:`The dial agrees with the master: ${H.armT?'unlock, then twist':'twist'} now.`);}
  /* ---------- adjuster's bench (Sec. VIII): the escapement's settings on sliders. ESC is rebuilt with makeEsc and taken over in place (Object.assign, so every
     reader keeps it), the 3D parts with escSet; ESC.checks() measures the figures as tools/escapement.js does. A setting at which it would not run is not applied ---------- */
  const EX0=ESC.EX,BENCH=[['rT','Trip-spring tip',0.24,0.34,0.001,'mm'],['rd','Discharge-jewel reach',0.26,0.35,0.001,'mm'],['dL','Depth of lock',0.005,0.05,0.001,'mm'],
    ['DRAW','Locking-jewel draw',4,16,0.5,'°'],['aD','Discharge-jewel angle',260,275,0.1,'°'],['aI','Impulse-jewel angle',175,188,0.1,'°']],BDEF=Object.fromEntries(BENCH.map(([k])=>[k,ESC.settings[k]]));   /* the model's settings */
  const bset={...BDEF},bIn={},benchOut=$('#benchOut'),benchT=$('#benchT'),bcv=$('#benchCv');let benchQ=false,benchBad='';
  const bFmt=(k,v)=>{const b=BENCH.find(x=>x[0]===k);return b[5]==='mm'?(v*ES).toFixed(3)+' mm':(+v).toFixed(1)+'°';};
  for(const[k,t,lo,hi,st]of BENCH){$('#benchS').insertAdjacentHTML('beforeend',`<label class="sl rw"><span>${t}</span><input type="range" min="${lo}" max="${hi}" step="${st}" value="${BDEF[k]}" aria-label="${t}"><output></output></label>`);
    const i=$('#benchS').lastElementChild.querySelector('input');bIn[k]=i;i.addEventListener('input',()=>{bset[k]=+i.value;benchQ=true;wake();});}
  function benchShow(){for(const[k]of BENCH){bIn[k].value=bset[k];bIn[k].nextElementSibling.textContent=bFmt(k,bset[k]);}
    benchT.innerHTML='<table class="rt bench"><thead><tr><th>Figure</th><th class="n">Now</th><th>Manual</th></tr></thead><tbody>'+ESC.checks().filter(c=>c.k!=='D').map(c=>`<tr><td>${c.name}</td><td class="n${c.ok?'':' bad'}">${c.ok?'':'✗ '}${c.v}</td><td>${c.want}</td></tr>`).join('')+'</tbody></table>';
    const n=ESC.checks().filter(c=>!c.ok).length;benchOut.innerHTML=(benchBad?`<b>It would not run at that setting</b><span>${benchBad}: it is kept at the last setting that runs.</span>`:`<b>${n?n+' figure'+(n>1?'s':'')+' outside the manual’s':'Every figure within the manual’s'}</b>`)+
      `<span>The balance must swing at least ${Math.round(ESC.AMIN/D2R)}° to unlock the wheel and see the impulse through${H.amp<ESC.AMIN?': it swings less, so the train has stopped (twist to start)':''}.</span>`;}
  function benchApply(){benchQ=false;const E2=makeEsc({EX:EX0,...bset}),m=E2.measure();
    if(!m.runs){benchBad=m.why;for(const k in bset)bset[k]=ESC.settings[k];}else{benchBad='';Object.assign(ESC,E2);mv.userData.escSet();}benchShow();wake();}
  const benchDiff=()=>BENCH.filter(([k])=>Math.abs(bset[k]-BDEF[k])>1e-9);
  $('#benchReset').addEventListener('click',()=>{Object.assign(bset,BDEF);benchApply();});
  $('#benchLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();setView('escapement');});
  function benchDraw(s,E){if(!$('#benchDet').open)return;const w=bcv.clientWidth||280,h=Math.round(w*0.72),d=Math.min(devicePixelRatio||1,2);
    if(bcv.width!==Math.round(w*d)){bcv.width=Math.round(w*d);bcv.height=Math.round(h*d);bcv.style.height=h+'px';}const x=bcv.getContext('2d');x.setTransform(d,0,0,d,0,0);drawEsc2D(x,w,h,s,E,dark());}
  $('#benchDet').addEventListener('toggle',()=>{if($('#benchDet').open)benchShow();});
  let msgT=0;const stopMsg=t=>{stopOut.innerHTML=t;msgT=performance.now()+4000;};
  function stopShow(now,run){if(now<msgT||now-lastSO<250)return;lastSO=now;const w=stopWhy(run),a=H.amp/D2R;
    stopOut.innerHTML=`<b>${w||'Running'}.</b> <span>The balance ${a<0.5?'is at rest':`swings ${Math.round(a)}° each way`}${a>=0.5&&H.amp<ESC.AMIN?`, under the ${Math.round(ESC.AMIN/D2R)}° it needs to unlock the wheel`:''}.</span>`;}
  /* the arm and screw move on frame time, not model time; the screw can't come down on a spoke, so it waits above the wheel's face until a gap comes round */
  function stopMove(dt){const inst=SNAP||RM.matches,mvTo=(x,t,r)=>inst?t:x+clamp(t-x,-dt/r,dt/r);H.arm=mvTo(H.arm,H.armT,0.8);
    const b=mvTo(H.blk,H.blkT,2.5),vf=R.tbs.userData.vFace;H.blk=(b>vf-0.005&&H.blk<=vf&&!R.blockClear(lastE??0))?Math.min(b,vf-0.005):b;}
  function ampStep(dts,brake,driven){let a=H.amp;if(H.kick>0&&a>=H.kick)H.kick=0;   /* a twist adds swing, never takes it away */
    if(H.kick>0){a+=(H.kick-a)*(1-Math.exp(-dts/0.15));if(H.kick-a<0.2*D2R)H.kick=0;}
    else if(brake)a*=Math.exp(-dts/TAU_ARM);else if(driven)a+=(ESC.A-a)*(1-Math.exp(-dts/TAU_UP));else a*=Math.exp(-dts/TAU_FREE);H.amp=a<0.2*D2R&&!driven&&!H.kick?0:a;}
  $('#stopLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();setView('movement');st.see=true;st.focus=new Set(['lockArm','tblock','bal','fw']);look();goCam({yaw:2.6,pitch:0.62,dist:95,target:mvL(4,-20,16)});});
  /* wind with the key, on the wall clock so slow frames don't slow it: half turns of 0.7 s with a 0.3 s pause to change grip, until the chain pushes the stop-bar in the fusee top out against
     the winding stop. Plates see-through, the winding stop kept solid (look), the parts that take part in winding picked out */
  const HT=0.5/FUSEE_PER_HOUR,kwBtn=$('#kwBtn'),kwOut=$('#kwOut'),KWF=['fusee','chain','sq','barrel','mainspring','gw','sratchet','sspring','spawl'];
  const KWV=()=>{const f=1+3.6/Math.hypot(...L.Fu);return{yaw:0.53,pitch:0.32,dist:120,target:mvL(L.Fu[0]*f,-36,L.Fu[1]*f)};};   /* key and fusee, from the winding stop's side */
  const halfs=v=>Math.abs(v*2-Math.round(v*2))<0.02?(Math.floor(v+0.01)||'')+(v%1>0.25?'½':''):v.toFixed(1);
  function kwStart(){if(kw){kwStop();return;}if(st.tour>=0)tourEnd();closeInfo();
    if($('#kwFull').checked||hrs<0.2)hrs=RUN_H;   /* run down: the chain all on the barrel, 17½ half turns to wind */
    kw={t0:performance.now(),t:0,h0:hrs,end:0};winding=true;st.drive=false;setView('movement');st.see=true;st.focus=new Set(KWF);look();
    goCam(KWV());
    kwBtn.textContent='Stop winding';kwBtn.setAttribute('aria-pressed','true');kwOut.classList.remove('hidden');}
  function kwStop(){if(kw&&kw.zoom)goCam(KWV());kw=null;winding=false;st.focus=null;look();kwBtn.textContent='Wind with the key';kwBtn.setAttribute('aria-pressed','false');}
  function kwStep(now){kw.t=(now-kw.t0)/1000;if(kw.end){if(kw.t>kw.end)kwStop();return;}
    const i=Math.floor(kw.t),tot=kw.h0/HT;hrs=Math.max(0,kw.h0-HT*(i+smooth(Math.min(1,(kw.t-i)/0.7))));showH();
    if(!kw.zoom&&hrs<(R.fs.mF+0.25)/FUSEE_PER_HOUR){kw.zoom=true;goCam({yaw:0.53,pitch:0.6,dist:58,target:mvL(L.Fu[0],-20.5,L.Fu[1])});}   /* close in on the fusee top before the chain reaches the stop-bar's nose, for the catch */
    if(hrs===0){kw.end=kw.t+3;kwOut.innerHTML=`<b>Fully wound after ${halfs(tot)} half turns.</b> The chain has pushed the stop-bar in the fusee top out against the winding stop under the barrel bridge, and the key can turn no further.`;}
    else kwOut.innerHTML=`Half turn <b>${Math.min(Math.ceil(tot),i+1)}</b> of ${halfs(tot)}, counterclockwise. ${(RUN_H-hrs).toFixed(1)} h of running stored. The sustaining spring drives the train meanwhile.`;}
  kwBtn.addEventListener('click',kwStart);
  function partsSync(){for(const q of PROWS){const h=st.hid.has(q.p)||isoOut(q.p);q.ck.checked=!h;q.row.classList.toggle('off',h);q.b.setAttribute('aria-pressed',st.pick===q.p?'true':'false');q.b.disabled=st.drive&&(BOXP.has(q.p)||DRIVE_HIDE.has(q.p));}plist.classList.toggle('colr',st.colr);plist.classList.toggle('csrc',st.csrc);}
  const fsb=$('#fs');if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled))fsb.classList.add('hidden');
  fsb.addEventListener('click',()=>{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}else{(stage.requestFullscreen||stage.webkitRequestFullscreen).call(stage);}});
  /* tick sound, on by default: browsers start audio only from a user gesture (and warn if a page tries sooner), so the context is made or resumed on the first
     click, tap or key, and the ticks are silent until then */
  let ac=null;const unlock=()=>{if(!st.sound)return;if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(_){}}if(ac&&ac.state==='suspended')ac.resume();};
  for(const t of['pointerdown','keydown','touchend'])addEventListener(t,unlock,{capture:true,passive:true});
  $('#snd').checked=st.sound;$('#snd').addEventListener('change',e=>{st.sound=e.target.checked;unlock();});
  const tick=()=>{if(!ac)return;const n=ac.createBufferSource(),b=ac.createBuffer(1,ac.sampleRate*0.03,ac.sampleRate),d=b.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(ac.sampleRate*0.0018));n.buffer=b;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=3400;f.Q.value=2.2;const gn=ac.createGain();gn.gain.value=0.5;n.connect(f).connect(gn).connect(ac.destination);n.start();};

  /* ---------- labels ---------- */
  const labels=[];const lab=$('.labels');
  const addL=(t,sub,part,fn,grp)=>{const el=document.createElement('div');el.className='lbl';if(PCOL[part])el.style.setProperty('--pc',PCOL[part]);if(PARTS[part]&&PARTS[part].src)el.style.setProperty('--ps',SRC[PARTS[part].src][1]);el.innerHTML='<span>'+t+(sub?'<i>'+sub+'</i>':'')+'</span>';lab.appendChild(el);labels.push({el,sp:el.firstChild,fn,grp,part,w:0,h:0,occ:false});};
  const pw=(g,x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>g.localToWorld(v.clone());};
  /* at an offset from o, a sub-group of g that the laid-out view moves (o turns, so the offset is taken in g's frame) */
  const pwo=(g,o,x,y,z)=>()=>g.localToWorld(new THREE.Vector3(o.position.x+x,y,o.position.z+z));
  const ef=k=>P[k].userData.ef;
  addL('Balance','2 Hz, 1⅜–1½ turns motion','bal',pw(ef('bal'),0,BAL_Y,-(BAL_R+1.6)),'mv');addL('Hairspring','Elinvar, cylindrical','spr',pw(ef('spr'),5.5,BAL_Y-5.6,0),'mv');
  addL('Balance cock','','cock',pw(P.cock,(L.B[0]+COCK_FOOT[0])/2,CK_T,(L.B[1]+COCK_FOOT[1])/2),'mv');
  addL('Escape wheel',`${TRAIN.ew} teeth, 1 turn / ${turnT(ESC_TURN)}`,'escW',pw(ef('escW'),ESC.EX*ES,EY,-7),'mv');addL('Detent','','det',pw(ef('det'),ESC.D(1.1,-0.045).x*ES,EY+1.2,ESC.D(1.1,-0.045).y*ES),'mv');
  addL('Fusee',`1 turn / ${turnT(GW_TURN)}`,'fusee',pw(P.fs,L.Fu[0]+7,-14,L.Fu[1]-3),'mv');addL('Mainspring barrel','','barrel',pw(P.fs,L.Ba[0]-9,-15,L.Ba[1]-6),'mv');addL('Fusee chain','','chain',pw(P.fs,(L.Fu[0]+L.Ba[0])/2-6,-13,(L.Fu[1]+L.Ba[1])/2-10),'mv');
  addL('Fusee wheel',`${TRAIN.fu} teeth, 1 turn / ${turnT(GW_TURN)}`,'gw',pw(P.gw,L.Fu[0]+14,-6.5,L.Fu[1]-11),'mv');addL('Centre wheel',`${TRAIN.cw} teeth, 1 turn / ${per(ESC_PER.cw*ESC_TURN)}`,'cw',pw(P.cw,-8,-5.36,-8),'mv');addL('Third wheel',`${TRAIN.tw} teeth, 1 turn / ${per(ESC_PER.tw*ESC_TURN)}`,'tw',pw(P.tw,L.T[0]-9,-4.535,L.T[1]+5),'mv');
  addL('Fourth wheel',`${TRAIN.fw} teeth, 1 turn / ${per(ESC_PER.fw*ESC_TURN)}`,'fw',pw(P.fw,L.F[0]-7,-7.46,L.F[1]+5),'mv');addL('Upper train bridge','','trainBridge',pw(P.trainBridge,-20,TB_T,24),'mv');addL('Barrel bridge','','barrelBridge',pw(P.barrelBridge,-16,BB_T,-18),'mv');
  addL('Sustaining pawl','','spawl',pw(R.spawl,-2.5,0,0),'mv');addL('Sustaining ratchet','','sratchet',pw(P.sratchet,L.Fu[0]+13,-9.45,L.Fu[1]+9),'mv');addL('Balance lower bridge','','lowerBridge',pw(P.lowerBridge,-1.5,LB_T,15),'mv');
  addL('Up/down indicator','','hands',pwo(P.hands,R.ud,-L.Ud[0],6,-36-L.Ud[1]),'dial');addL('Seconds','','hands',pwo(P.hands,R.sec,-10-L.F[0],6,34-L.F[1]),'dial');addL('Gimbal ring','','ring',pw(BX.ring,BX.RO,8,0),'box');
  addL('Bowl','','bowl',pw(BX.bowl,-BX.CR*0.7,-40,BX.CR*0.7),'box');addL('Winding key','','key',pw(BX.root,76,-5,-76),'box');addL('Gimbal latch','','latch',pw(BX.root,80,-13,76),'box');
  addL('Cannon pinion',`${MW.cp} leaves`,'motion',pw(P.motion,2,1.2,-3),'motion');addL('Minute wheel',`${MW.mw} / ${MW.mp}`,'motion',pw(P.motion,L.Mw[0]+6,1.2,L.Mw[1]+4),'motion');addL('Up/down wheel',`${UD.wheel} teeth`,'motion',pwo(P.motion,R.udW,11,1.5,0),'motion');

  /* ---------- walkthrough ---------- */
  const inset=$('#tInset');let insetKind=null,insetCv=null,insetCtx=null,trace=[];
  function setInset(kind){insetKind=kind;inset.innerHTML='';insetCv=null;trace=[];
    if(kind==='fusee'||kind==='esc'||kind==='bal'){insetCv=document.createElement('canvas');inset.appendChild(insetCv);
      if(kind==='fusee')inset.insertAdjacentHTML('beforeend','<div class="note" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px"><span><b style="color:#c0392b">―</b> spring pull</span><span><b style="color:#2e6bd8">―</b> chain radius on the fusee</span><span><b style="color:var(--brass)">―</b> torque = pull × radius</span></div>');
      const w=inset.clientWidth||300,h=kind==='esc'?Math.round(w*0.72):Math.round(w*0.5),d=Math.min(devicePixelRatio||1,2);insetCv.width=w*d;insetCv.height=h*d;insetCv.style.height=h+'px';insetCtx=insetCv.getContext('2d');insetCtx.setTransform(d,0,0,d,0,0);insetCv._w=w;insetCv._h=h;}
    else if(kind==='train'){const x=v=>'×'+(+v.toFixed(2)),T=TRAIN;inset.innerHTML='<table class="rt"><thead><tr><th>Arbor</th><th>Drives</th><th class="n">Ratio</th><th class="n">One turn</th><th class="n">Angle</th></tr></thead><tbody>'+
      [['Fusee wheel',`${T.fu} → ${T.cp}`,x(T.fu/T.cp),turnT(GW_TURN),'gw'],['Centre',`${T.cw} → ${T.tp}`,x(T.cw/T.tp),turnT(ESC_PER.cw*ESC_TURN),'cw'],['Third',`${T.tw} → ${T.fp}`,x(T.tw/T.fp),turnT(ESC_PER.tw*ESC_TURN),'tw'],['Fourth',`${T.fw} → ${T.ep}`,x(T.fw/T.ep),turnT(ESC_PER.fw*ESC_TURN),'fw'],['Escape',`${T.ew} teeth`,'',turnT(ESC_TURN),'ew']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${r[2]}</td><td class="n">${r[3]}</td><td class="n" data-k="${r[4]}"></td></tr>`).join('')+`</tbody></table><p class="note" style="margin:8px 0 0">Overall ×${ESC_PER.gw.toLocaleString('en',{maximumFractionDigits:0})}. Ideally the escape wheel receives 1/${ESC_PER.gw.toLocaleString('en',{maximumFractionDigits:0})} of the fusee’s torque, less friction at each stage. The ${T.ew}-tooth escape wheel is Hamilton’s; the fusee, centre, third and fourth wheels and the third pinion were counted on a restoration video of a 1941 Model 21; the other pinions follow from the ratios (the centre pinion’s ${T.cp} also from the manual’s 17½ half turns for a full wind, 56 hours).</p>`;}
    else if(kind==='motion'){const d=v=>'÷'+(+v.toFixed(2));inset.innerHTML=`<table class="rt"><thead><tr><th>Stage</th><th class="n">Teeth</th><th class="n">Ratio</th></tr></thead><tbody><tr><td>Cannon pinion → minute wheel</td><td class="n">${MW.cp} → ${MW.mw}</td><td class="n">${d(MW.mw/MW.cp)}</td></tr><tr><td>Minute pinion → hour wheel</td><td class="n">${MW.mp} → ${MW.hw}</td><td class="n">${d(MW.hw/MW.mp)}</td></tr><tr><td>Fusee pinion → wind indicator wheel</td><td class="n">${UD.pin} → ${UD.wheel}</td><td class="n">${d(UD.wheel/UD.pin)}</td></tr></tbody></table>`;}
    else if(kind==='power'){inset.innerHTML='<div class="note" id="pw"></div>';}
    else if(kind==='wind'){inset.innerHTML='<button class="primary" id="tWind">Wind it now</button>';$('#tWind').addEventListener('click',()=>{if(hrs<2)hrs=30;winding=true;});}
  }
  const TOUR=[
    {t:'The box and gimbals',x:'<p>The mounting box is mahogany with two hinged covers: an upper lid, and a second cover with a glass top through which the dial is read.</p><p>The gimbal ring is pivoted to the box at two points 180° apart; the brass case pivots in the ring at two points 90° away. Tilt the box any way and the movement tends to stay level, so the balance swings in the plane it was adjusted in.</p>',
      drive:false,v:{lidM:1,lidT:1,lift:0,flip:0,explode:0,yaw:0.85,pitch:0.45,dist:600,target:fixed(0,-24,0)},rock:true,speed:1,focus:null},
    {t:'Stored energy: the mainspring',x:'<p>A long, powerful mainspring is coiled in the barrel. The barrel arbor never turns in use: the setup ratchet and pawl on the barrel bridge hold it. The spring’s outer end turns the barrel clockwise, and the barrel draws the chain off the fusee.</p><p>Wound, the coils hug the arbor; run down, they lie against the wall. At 3600× one hour passes each second.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-1.58,pitch:0.62,dist:140,target:mvL(-18.6,-15,0.2)},speed:3600,focus:['barrel','mainspring','chain','ratchet','fusee'],inset:'power'},
    {t:'Constant force: the fusee',x:`<p>A mainspring exerts more force fully wound than partly run down, so the fusee is shaped to keep the moment on the fusee wheel about the same throughout. The chain pulls on the small end while the spring is strongest and on the large end once it has weakened.</p><p>The balance’s arc, and so its rate, stays practically equal all the time. The profile is the one photographed: the radius grows from ${R.fs.rf(0).toFixed(1)} to ${R.fs.rf(FUSEE_TURNS).toFixed(1)} mm over 8¾ turns, the shape that evens out a pull falling in step with the barrel’s turns.</p>`,
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-0.35,pitch:0.35,dist:150,target:mvL(-3.5,-14,-9.8)},speed:3600,focus:['fusee','chain','barrel','mainspring','gw'],inset:'fusee'},
    {t:'Winding without stopping',x:'<p>The key turns the fusee arbor counterclockwise. That would cut the power to the train, but the sustaining spring, pinned between the sustaining ratchet wheel and the fusee wheel and always under load, keeps driving the fusee wheel, so the wheel and the train run on while the fusee turns back. The sustaining pawl stops the ratchet wheel from turning back, so the spring can only release forward. It will drive the chronometer for five to ten minutes.</p><p>At full wind the chain presses one end of the winding stop-bar in the fusee top; the other end moves out and catches the winding stop under the barrel bridge. Seven half turns restore a day’s running.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.53,pitch:0.55,dist:125,target:mvL(11.6,-13,-19.8)},speed:60,focus:['gw','sratchet','sspring','spawl','fusee','sq','chain','cw'],inset:'wind'},
    {t:'The going train',x:'<p>The fusee wheel drives the centre wheel pinion; the centre wheel drives the third wheel pinion; the third drives the fourth wheel pinion; the fourth meshes with the escape pinion. The centre wheel turns once an hour; the fourth once a minute, carrying the second hand.</p><p>Every mesh here is in phase: a tooth of each driver sits in a gap of the pinion it drives.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.25,pitch:1.0,dist:200,target:mvL(0,-10,8)},speed:1,focus:['gw','cw','tw','fw','escW','fusee'],inset:'train'},
    {t:'The detent escapement',x:'<p>The escape wheel is held by the locking jewel on the detent. As the balance swings one way, the unlocking jewel meets the trip spring, which bends aside and lets it pass: nothing else moves. Swinging back, the unlocking jewel strikes the trip spring again; now the abutment arm holds it, so the trip spring and detent move aside together and release the wheel.</p><p>A tooth drops into the crescent of the impulse roller, catches up with the impulse jewel and drives the balance; the detent springs back in time to lock the next tooth. One impulse per oscillation, so the hands advance in half-second steps.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:70,target:mvL(8.0,-18.5,12)},speed:0.05,focus:['escW','det','bal'],inset:'esc'},
    {t:'The balance and hairspring',x:'<p>The balance is a solid, uncut stainless-steel rim silver-soldered to an Invar arm. Invar barely expands, so the rim’s diameter at the arm ends stays fixed while the rest of the rim moves with temperature; screws placed nearer or farther from the arm set the compensation. Free of the centrifugal effects of a split rim, it can swing 1⅜ to 1½ turns.</p><p>The cylindrical hairspring is Hamilton Elinvar, with good thermo-elastic qualities and minimum isochronal error. There is no regulator: rate is set with balance screws, timing weights and vernier weights. The older split bimetallic balance is available under Balance.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:2.27,pitch:0.35,dist:118,target:mvL(8.0,-29,6.8)},speed:0.05,focus:['bal','spr','cock'],inset:'bal'},
    {t:'Hands and the wind indicator',x:`<p>The centre wheel staff carries the minute hand and, through the motion work, the hour hand; the fourth wheel staff carries the second hand.</p><p>A pinion on the dial end of the fusee arbor drives the wind indicator wheel. Here an ${UD.pin}-leaf pinion and a ${UD.wheel}-tooth wheel take the hand across the UP–DOWN scale as the fusee makes its ${(56*FUSEE_PER_HOUR).toFixed(1)} turns in 56 hours.</p>`,
      drive:true,mw:true,v:{lift:1,flip:0,explode:0,yaw:0.2,pitch:1.05,dist:170,target:mvL(-3,3,-6)},speed:3600,focus:['motion','hands','cw','fusee','gw'],inset:'motion'}];
  const dots=$('#tDots');dots.innerHTML=TOUR.map(()=>'<i></i>').join('');
  /* the viewer's own settings, kept when the walkthrough starts and given back when it ends */
  let preTour=null;
  function tourGo(i){if(ks)ksEnd();sw=null;if(st.tour<0)preTour={view:st.view,see:st.see,rock:st.rock,latch:st.latch,speed:st.speed,drive:st.drive,mwOn:st.mwOn};st.tour=i;const s=TOUR[i];closeInfo();showHelp(false);hintOff();
    $('#tourIntro').classList.add('hidden');$('#tourBody').classList.remove('hidden');
    $('#tStep').textContent=(i+1)+' / '+TOUR.length;$('#tTitle').textContent=s.t;$('#tText').innerHTML=s.x;
    [...dots.children].forEach((d,k)=>d.classList.toggle('on',k<=i));$('#tPrev').disabled=i===0;$('#tNext').textContent=i===TOUR.length-1?'Finish':'Next';
    st.drive=s.drive;st.mwOn=!!s.mw;$('#mwOn').checked=st.mwOn;st.focus=s.focus?new Set(s.focus):null;st.see=false;
    st.rock=!!s.rock&&!RM.matches;$('#rock').checked=st.rock;if(s.rock){st.latch=false;$('#latch').checked=false;}setSpeed(s.speed);   /* a step showing the gimbals at work releases them */
    Object.assign(tgt,{lift:s.v.lift,flip:s.v.flip,explode:s.v.explode,dev:0,fov:FOV0,lidM:s.v.lidM??1,lidT:s.v.lidT??1});goCam(s.v);look();
    document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed','false'));$('#expWrap').classList.add('hidden');
    setInset(s.inset||null);
    /* bring the card into view: below the stage when the stage sits above the panel (phones in portrait), else beside it (landscape phones) */
    if(innerWidth<960||innerHeight<=560){const card=$('#tourCard'),cr=card.getBoundingClientRect();
      if(cr.left<stage.getBoundingClientRect().right){const y=cr.top+scrollY-stage.offsetHeight-8;if(Math.abs(scrollY-y)>40)scrollTo({top:y,behavior:RM.matches?'auto':'smooth'});}
      else card.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'});}}
  function tourEnd(){const u=preTour||{view:'dial',see:false,rock:false,latch:st.latch,speed:1,drive:false,mwOn:false};preTour=null;
    st.tour=-1;st.focus=null;st.drive=u.drive;st.mwOn=u.mwOn;st.rock=u.rock;st.latch=u.latch;st.see=u.see;for(const k of['driveOn','mwOn','rock','latch'])$('#'+k).checked=st[k==='driveOn'?'drive':k];setSpeed(u.speed);setInset(null);
    $('#tourIntro').classList.remove('hidden');$('#tourBody').classList.add('hidden');setView(u.view,true);}
  $('#tStart').addEventListener('click',()=>tourGo(0));$('#tPrev').addEventListener('click',()=>tourGo(Math.max(0,st.tour-1)));
  $('#tNext').addEventListener('click',()=>st.tour<TOUR.length-1?tourGo(st.tour+1):tourEnd());$('#tExit').addEventListener('click',tourEnd);

  function drawInset(E,s,n){
    if(!insetKind)return;const dk=dark();
    if(insetKind==='power'){const el=$('#pw');if(el){const I=R.fs.Ib(n),pull=R.fs.rf(0)/R.fs.rf(n);el.innerHTML=`Barrel has turned <b>${I.toFixed(2)}</b> of ${R.fs.IN.toFixed(2)} turns. Spring pull <b>${Math.round(pull*100)}%</b> of full. ${(RUN_H-hrs).toFixed(1)} h of running left.`;}}
    else if(insetKind==='train'){const P2=ESC.P,esc=E*P2,v={ew:esc/TAU,fw:esc/ESC_PER.fw/TAU,tw:esc/ESC_PER.tw/TAU,cw:esc/ESC_PER.cw/TAU,gw:esc/ESC_PER.gw/TAU};inset.querySelectorAll('td[data-k]').forEach(td=>td.textContent=(((v[td.dataset.k]%1)+1)%1*360).toFixed(td.dataset.k==='gw'?2:1)+'°');}
    else if(insetCv){const ctx=insetCtx,w=insetCv._w,h=insetCv._h;
      if(insetKind==='esc'){drawEsc2D(ctx,w,h,s,E,dk);}
      else if(insetKind==='fusee'){ctx.clearRect(0,0,w,h);const L0=34,R0=10,T0=12,B0=28,pw=w-L0-R0,ph=h-T0-B0,X=x=>L0+x/RUN_H*pw,Y=y=>T0+(1-y/1.1)*ph;
        ctx.font='11px "Instrument Sans",sans-serif';ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.lineWidth=1;
        for(const x of[0,14,28,42,56]){ctx.beginPath();ctx.moveTo(X(x),T0);ctx.lineTo(X(x),T0+ph);ctx.stroke();ctx.textAlign='center';ctx.fillText(x+' h',X(x),h-12);}
        for(const y of[0,0.5,1]){ctx.beginPath();ctx.moveTo(L0,Y(y));ctx.lineTo(L0+pw,Y(y));ctx.stroke();ctx.textAlign='right';ctx.fillText(Math.round(y*100)+'%',L0-4,Y(y)+4);}
        const F=R.fs,nn=q=>q*FUSEE_PER_HOUR,f=[[q=>F.rf(0)/F.rf(nn(q)),'#c0392b','spring pull'],[q=>F.rf(nn(q))/F.rf(FUSEE_TURNS),'#2e6bd8','radius on the fusee'],[q=>1,dk?'#e0b44f':'#8a5d10','torque (pull × radius)']];
        f.forEach(([fn,col,nm],k)=>{ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();for(let i=0;i<=100;i++){const q=RUN_H*i/100,yy=k===2?1:fn(q);i?ctx.lineTo(X(q),Y(yy)):ctx.moveTo(X(q),Y(yy));}ctx.stroke();
          ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(hrs),Y(k===2?1:fn(hrs)),4,0,TAU);ctx.fill();});
      }
      else if(insetKind==='bal'){const win=0.5*(st.speed<=0.05?1:2);ctx.clearRect(0,0,w,h);const tb=H.held?H.bph*0.5:tSim+H.bOff*0.5,X=t=>8+(1-(tb-t)/win)*(w-16),Y=th=>h/2-th/(270*D2R)*(h/2-16);   /* tb: the balance's own time, which runs on while the train is held */
        ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.beginPath();ctx.moveTo(8,h/2);ctx.lineTo(w-8,h/2);ctx.stroke();
        const N=240,pts=[];for(let i=0;i<=N;i++){const t=tb-win+win*i/N,q=t/0.5-Math.floor(t/0.5),z=ESC.state(q,H.amp);pts.push([t,z.th,!H.held&&z.prog>0&&z.prog<1]);}
        ctx.fillStyle=dk?'rgba(224,180,79,.35)':'rgba(184,134,11,.28)';for(const q of pts)if(q[2])ctx.fillRect(X(q[0])-1,10,2.5,h-26);
        ctx.strokeStyle=dk?'#91adf2':'#26479c';ctx.lineWidth=2;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1])));ctx.stroke();
        ctx.fillStyle=dk?'#e4e8eb':'#141a20';ctx.beginPath();ctx.arc(X(tb),Y(s.th),4,0,TAU);ctx.fill();
        ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='left';ctx.fillText('balance angle over the last '+win+' s; shaded = impulse',8,h-6);
        ctx.textAlign='right';ctx.fillText('+255°',w-8,16);}
    }
  }

  /* ---------- label placement ---------- */
  const ray2=new THREE.Raycaster(),tmpV=new THREE.Vector3(),camP=new THREE.Vector3();let lastOcc=0;
  const lsorted=()=>labels.slice().sort((p,q)=>(PRI[q.part]||1)-(PRI[p.part]||1));let LS=null;
  function placeLabels(now){
    if(!LS)LS=lsorted();
    const foc=st.pick?new Set([st.pick]):st.focus,doOcc=now-lastOcc>200;if(doOcc)lastOcc=now;
    const placed=[],pad=3;
    for(const l of LS){
      /* off by default; the walkthrough always names the parts of its step */
      let show=(st.labels||st.tour>=0)&&(l.grp==='mv'?(cur.lift>0.8||st.drive)&&cur.flip>0.8:l.grp==='motion'?st.drive&&st.mwOn&&cur.flip<0.3:l.grp==='dial'?cur.lift<0.1&&cur.lidM>0.9&&!st.drive:cur.lift<0.1&&cur.lidT>0.9&&!st.drive);
      if(show&&foc&&!foc.has(l.part))show=false;
      if(show&&st.drive&&DRIVE_HIDE.has(l.part))show=false;if(show&&isoOut(l.part))show=false;
      if(!show){l.el.style.opacity=0;continue;}
      const P0=l.fn();
      if(doOcc){camP.copy(cam.position);const d=P0.distanceTo(camP);ray2.set(camP,tmpV.copy(P0).sub(camP).normalize());ray2.far=d-0.8;
        const hits=ray2.intersectObject(BX.root,true);l.occ=hits.some(h=>shown(h.object)&&h.object.userData.part!==l.part&&!(h.object.material.transparent&&h.object.material.opacity<0.5)&&!h.object.userData.decal);}
      if(l.occ){l.el.style.opacity=0;continue;}
      tmpV.copy(P0).project(cam);const px=(tmpV.x+1)/2*W,py=(1-tmpV.y)/2*Hh;
      if(tmpV.z>1||px<4||px>W-4||py<4||py>Hh-40){l.el.style.opacity=0;continue;}
      if(!l.w){l.w=l.sp.offsetWidth;l.h=l.sp.offsetHeight;}
      const w=l.w,h=l.h,C4=[[9,-h/2],[-9-w,-h/2],[-w/2,-h-9],[-w/2,9]];let ok=null;
      for(const[dx,dy]of C4){const r={x0:px+dx-pad,y0:py+dy-pad,x1:px+dx+w+pad,y1:py+dy+h+pad};
        if(r.x0<2||r.x1>W-2||r.y0<2||r.y1>Hh-38)continue;
        if(placed.some(q=>r.x0<q.x1&&q.x0<r.x1&&r.y0<q.y1&&q.y0<r.y1))continue;ok=[dx,dy,r];break;}
      if(!ok){l.el.style.opacity=0;continue;}
      placed.push(ok[2],{x0:px-4,y0:py-4,x1:px+4,y1:py+4});
      l.el.style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;l.sp.style.transform=`translate(${ok[0].toFixed(1)}px,${ok[1].toFixed(1)}px)`;l.el.style.opacity=1;
    }
  }
  new ResizeObserver(()=>{labels.forEach(l=>{l.w=0;});}).observe(stage);

  /* ---------- shareable links: the state in the URL hash ----------
     #view=escapement&speed=0.05&part=det, #tour=6 (a walkthrough step), drive=1 (moving parts only), draw=1 or draw=ink (the tinted or ink drawing), edges=0 (Edges off; it is on by default), shadows=1 (Shadows on; off by default), sec=x:-3.5 (a section; :f shows the other half),
     tz=local, t=12:00:00 (only once the hands have been set). #essay or #essay=detent: the essay (essay.js), at a section; open=bookDet (in a link only): open that panel section.
     Read at load and when the hash is edited; written 0.3 s after any change, with replaceState, so the back button isn't filled with views */
  function hashOf(){if(ESSAY.on()){const s=ESSAY.section();return s?'essay='+s:'essay';}const h=new URLSearchParams();
    if(st.tour>=0)h.set('tour',st.tour+1);
    else{if(st.view!=='dial')h.set('view',st.view);if(st.drive)h.set('drive',1);if(st.speed!==1)h.set('speed',+st.speed.toPrecision(3));if(secMode!=='off')h.set('sec',secMode+':'+(+secOff.toFixed(2))+(secFlip?':f':''));}
    if(st.pick)h.set('part',st.pick);if(st.draw)h.set('draw',st.draw==='ink'?'ink':1);if(st.colr||st.csrc)h.set('colr',st.csrc?'src':'part');if(!st.edges)h.set('edges',0);if(st.shadows)h.set('shadows',1);if(tz!=='gmt')h.set('tz',tz);if(handsSet)h.set('t',todIn.value);if(H.armT)h.set('arm',1);if(H.blkT)h.set('block',1);const bd=benchDiff();if(bd.length)h.set('esc',bd.map(([k])=>k+':'+bset[k]).join(','));return h.toString().split('%3A').join(':').split('%2C').join(',');}
  /* hashSeen: the hash as last written or applied here. If it has changed since (edited, or a link followed), the page hasn't applied it yet: leave it for hashchange */
  function writeHash(){if(!hashReady)return;clearTimeout(hashT);hashT=setTimeout(()=>{if(location.hash.slice(1)!==hashSeen)return;const h=hashOf();if(h!==hashSeen){history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);}},300);}
  /* first: at load, when the opening move to the view is still to come (it goes to the view returned) */
  function applyHash(first){hashSeen=location.hash.slice(1);const h=new URLSearchParams(hashSeen),g=k=>h.get(k),own=(o,k)=>k!=null&&Object.prototype.hasOwnProperty.call(o,k),v=own(VIEWS,g('view'))?g('view'):first&&!g('tour')&&own(VIEWS,SET.view)?SET.view:'dial';   /* own keys only: 'constructor' is no view or part. At load, no view in the hash: the last one seen here */
    if(h.has('essay')){ESSAY.show(true,g('essay'));return v;}ESSAY.show(false);   /* the essay: the model underneath is left as it is */
    if(g('tz')==='gmt'||g('tz')==='local'){if(g('tz')!==tz)setTz(g('tz'));}
    if(g('t'))setTod(g('t'));
    { const a=g('arm')==='1'?1:0,b=g('block')==='1'?1:0;if(a!==H.armT){armSet(a);H.arm=a;if(a)H.amp=0;}if(b!==H.blkT){blkSet(b);H.blk=b&&!R.blockClear(lastE??0)?Math.min(b,R.tbs.userData.vFace-0.005):b;} }   /* locked in a link: the balance is at rest */
    { const q={...BDEF};for(const kv of(g('esc')||'').split(',')){const[k,v]=kv.split(':');if(own(BDEF,k)&&Number.isFinite(+v)){const b=BENCH.find(x=>x[0]===k);q[k]=clamp(+v,b[2],b[3]);}}
      if(BENCH.some(([k])=>q[k]!==bset[k])){Object.assign(bset,q);benchApply();} }   /* esc=rT:0.29,aI:185: the adjuster's bench, where it differs from the model's settings */
    const ed=g('edges')!=='0',shd=g('shadows')==='1';   /* Edges is on by default, Shadows off: the hash says edges=0 or shadows=1 only against that */
    const dw=g('draw')==='1'?'tint':g('draw')==='ink'?'ink':false;
    if(dw!==st.draw||ed!==st.edges||shd!==st.shadows||(g('colr')==='part')!==st.colr||(g('colr')==='src')!==st.csrc){st.draw=dw;st.edges=ed;st.shadows=shd;st.colr=g('colr')==='part';st.csrc=g('colr')==='src';look();}   /* colr=part or colr=src: the colour modes */
    const tr=parseInt(g('tour'));
    if(tr>=1&&tr<=TOUR.length)tourGo(tr-1);
    else{if(st.tour>=0)tourEnd();
      st.drive=g('drive')==='1';$('#driveOn').checked=st.drive;
      const sp=g('speed');setSpeed(sp!=null&&Number.isFinite(+sp)?+sp:1);
      const sc=/^([xyz]):(-?[\d.]+)(:f)?$/.exec(g('sec')||'');
      document.querySelector(`#secs button[data-v="${sc?sc[1]:'off'}"]`).click();
      if(sc){secOff=clamp(+sc[2],+secIn.min,+secIn.max);secIn.value=secOff;secFlip=!!sc[3];$('#secFlip').checked=secFlip;applySec();}
      if(!first)setView(v);}
    const p=g('part');if(own(INFO,p))showPart(p);else closeInfo();
    const od=DET.find(d=>d.id===g('open'));if(od){od.open=true;setTimeout(()=>od.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'}),first?1200:50);}   /* open=bookDet: a link from the essay to a panel section */
    return v;}
  addEventListener('hashchange',()=>applyHash(false));
  for(const k of['finish','dial','bal']){const b=[...document.querySelectorAll(`#${k==='dial'?'dialSt':k} button`)].find(x=>x.dataset.v===SET[k]);if(b&&b.getAttribute('aria-pressed')!=='true')b.click();}
  const startView=applyHash(true);

  /* ---------- loop ---------- */
  const SNAP=/[?&]snap\b/.test(location.search),REAL_X=5;   /* REAL_X: the fastest speed at which the balance is drawn swinging as it really does */
  let last=performance.now(),loaded=false,hudS='';const hud=$('#hud');
  /* idle: when nothing that shows has changed (camera, lids, lift, wheels, balance, wind, ship motion, section), no input came in the last 0.6 s and the
     stage was drawn less than a second ago, the frame skips the render, the labels and the inset (a stopped model with a still camera draws once a second).
     Off-screen stages aren't drawn, nor is the stage while the essay covers it (the model keeps time meanwhile). ?snap draws every frame, for the tools that change the model directly.
     The balance's swing (angle, detent, passing spring) counts only while it can be seen: not with the movement in its case under the dial (the Dial and Box views), unless
     the walkthrough's inset or the adjuster's bench shows the escapement; there the hands' steps alone draw a frame (a few frames a beat, not every frame).
     Without input, a frame comes at most every 10 ms: a 120 or 144 Hz display draws the running model at 60 or 72 Hz, a 60 or 90 Hz one every frame.
     The signature is compared with the last one drawn, so a change in a skipped frame is still drawn */
  let lastSig=null,lastDraw=-1e9,renders=0,onScreen=true;const benchD=$('#benchDet');
  for(const ev of['pointerdown','pointermove','wheel','keydown','input','change','click'])document.addEventListener(ev,wake,{capture:true,passive:true});
  new ResizeObserver(wake).observe(stage);cv.addEventListener('webglcontextrestored',wake);
  new IntersectionObserver(e=>{onScreen=e[e.length-1].isIntersecting;if(onScreen)wake();}).observe(stage);
  function frame(now){
    const dt=clamp((now-last)/1000,0,0.05);last=now;   /* the first frame's time can come before last was set: never a step back */const k=SNAP||RM.matches?1:1-Math.exp(-dt*3.0);
    for(const q of['lift','flip','explode','lidM','lidT','dev','fov'])cur[q]+=(tgt[q]-cur[q])*k;
    if(cur.lift>0.05){cur.lidM=Math.max(cur.lidM,0.97);cur.lidT=Math.max(cur.lidT,0.97);}
    const run=hrs<RUN_H,dtS=dt*st.speed;tM+=dtS;
    if(kw)kwStep(now);else if(winding){hrs=Math.max(0,hrs-dt*14);if(hrs===0)winding=false;showH();}
    tVis+=dt;stopMove(dt);
    const brake=H.arm>0.75;ampStep(dtS*rateK,brake,run&&!H.held);   /* the arm's pad is under the rim from about three quarters of its turn */
    /* the train's state at model time t: beats E (whole beats locked, a fraction during an impulse; continuous above REAL_X) and the balance's state. Up to REAL_X the balance
       swings as it really does (10 Hz at 5x, still a few frames a swing); faster, it would be a blur, so it swings at 0.9 Hz, detent and trip spring still, and the HUD says so */
    const at=t=>{if(st.speed>REAL_X){const p=(tVis*0.9)%1,z=ESC.state(p,H.amp);z.p=p;z.lift=0;z.psDef=0;return{E:t*2+H.bOff+H.eOff,s:z};}
      const x=t/0.5+H.bOff,kk=Math.floor(x),p=x-kk,z=ESC.state(p,H.amp);z.p=p;return{E:kk+z.prog+H.eOff,s:z};};
    let E,s;
    if(!H.held){let q=at(tSim);const Eb=lastE??q.E,locked=q.s.prog<=0||q.s.prog>=1||st.speed>REAL_X,room=blockedNow()?Math.floor(Eb+R.blockRoom(Eb)+1e-6):Infinity;   /* room: the last whole beat before a spoke meets the dog point */
      const hold=()=>{H.held=true;H.bph=tSim/0.5+H.bOff;};
      if(dtS>0&&locked&&(!run||H.amp<ESC.AMIN||brake||Eb+1>room)){hold();H.Eh=Eb;E=Eb;s=q.s;}   /* the train stops at a locked beat */
      else{if(dtS>0){tSim+=dtS*rateK;rErr+=dtS*(rateK-1);if(!winding){hrs=Math.min(RUN_H,hrs+dtS/3600);if(st.speed>1)showH();}q=at(tSim);}
        E=Math.min(q.E,room);s=q.s;if(q.E>room){hold();H.Eh=room;}}}
    if(H.held){H.bph+=dtS*rateK/0.5;const p=((H.bph%1)+1)%1;s=ESC.state(p,H.amp);s.p=p;E=H.Eh;   /* ESC.state leaves the detent alone in a swing too small to pass the trip spring */
      const lockedP=s.prog<=0||s.prog>=1;
      if(run&&!brake&&H.amp>=ESC.AMIN&&!(blockedNow()&&R.blockRoom(H.Eh)<1)&&(lockedP||st.speed>REAL_X)){H.held=false;   /* the train goes again, from where the balance is */
        H.bOff=(((H.bph-tSim/0.5)%1)+1)%1;if(st.speed>REAL_X)H.eOff=H.Eh-(tSim/0.5+H.bOff);else{const x=tSim/0.5+H.bOff;H.eOff=H.Eh-(Math.floor(x)+(s.prog>=1?1:0));}}}
    if(st.sound&&st.speed<=1&&lastE!=null&&Math.floor(E-0.5)>Math.floor(lastE-0.5))tick();
    lastE=E;const n=hrs*FUSEE_PER_HOUR;if(benchQ)benchApply();if(ks)ksStep(dt);else if(sw)ssStep(dt);ssLabel();
    if(H.held!==wasHeld){if(loaded)pend.add(H.held?(run?'stopped':'not wound'):'started');wasHeld=H.held;}   /* remarks for the rate book */
    {const d=dayOf(tM);if(d!==bookDay){if(d>bookDay)bookAdd();bookDay=d;}}bookLive(now);   /* after the train has moved, so the hands and the master are of the same moment */
    mv.userData.update({E,th:s.th,lift:s.lift,psDef:s.psDef,n,winding,slip,hkeyOn:!!ks,blk:H.blk,arm:H.arm,keyOn:winding&&(cur.lift>0.8||st.drive),springOn:cur.lift>0.3||st.drive||secMode!=='off'||st.hid.size>0||!!st.iso||Object.keys(st.op).length>0,msOn:msShown()});
    {const T=(winding&&(cur.lift>0.8||st.drive))?0:BX.shRest;BX.shield.rotation.y=SNAP?T:lerp(BX.shield.rotation.y,T,1-Math.exp(-dt*(T?12:6)));}   /* the shield plate turns to admit the key; its return spring brings it back */
    BX.mid.rotation.x=-cur.lidM*1.6;BX.top.rotation.x=-Math.max(0,cur.lidT*1.92-cur.lidM*1.6);   /* outer lid angle is relative to the glass lid it is hinged to */
    mv.userData.explode(smooth(cur.explode));mv.userData.develop(smooth(cur.dev));if(cam.fov!==cur.fov){cam.fov=cur.fov;cam.updateProjectionMatrix();}
    if((cur.dev>0.02)!==devShown){devShown=cur.dev>0.02;look();}
    const L1=smooth(cur.lift/0.55),L2=smooth((cur.lift-0.35)/0.65);mv.position.y=L1*130+L2*95;mv.rotation.x=Math.min(smooth(cur.flip),L2)*Math.PI;
    if(st.rock)rockT+=dt;const a=st.rock?14*D2R:0;roll=lerp(roll,a*Math.sin(rockT*0.9),st.rock?1:k);pitch=lerp(pitch,a*0.55*Math.sin(rockT*0.63+1.1),st.rock?1:k);
    /* latching: the ring and case are brought level with the box, then the lever swings in; released, the reverse. Latched, they tilt with the box */
    latchK=SNAP||RM.matches?+st.latch:clamp(latchK+(st.latch?1:-1)*dt*1.2,0,1);const fr=1-smooth(Math.min(1,latchK*2));
    const tw=H.twT<0||RM.matches?0:(now-H.twT)/1000;if(tw>0.5)H.twT=-1;   /* the twist that starts it: the box turned sharply and back */
    BX.root.rotation.set(pitch,tw>0&&tw<0.5?0.2*Math.sin(Math.PI*tw/0.5)*(1-tw/0.5):0,roll,'ZYX');BX.ring.rotation.x=-pitch*fr;BX.bowl.rotation.z=-roll*fr;BX.latch.rotation.y=lerp(LATCH_OFF,LATCH_ON,smooth(Math.max(0,latchK*2-1)));
    BX.root.updateMatrixWorld(true);if(secMode!=='off')secPlane.copy(secLocal).applyMatrix4(mv.matrixWorld);
    if(G.follow)G.target.copy(G.follow()).add(panO);
    if(st.spin&&!ptrs.size){G.yaw+=dt*0.2;if(camFree)C.yaw+=dt*0.2;}
    C.target.lerp(G.target,Math.min(1,k*1.5));if(!camFree){C.yaw+=(G.yaw-C.yaw)*k;C.pitch+=(G.pitch-C.pitch)*k;}C.dist+=(G.dist-C.dist)*k;
    const cp=Math.cos(C.pitch);cam.position.set(C.target.x+C.dist*cp*Math.sin(C.yaw),C.target.y+C.dist*Math.sin(C.pitch),C.target.z+C.dist*cp*Math.cos(C.yaw));cam.lookAt(C.target);
    key.position.copy(C.target).add(new THREE.Vector3(160,420,240));key.target.position.copy(C.target);
    const sz=clamp(C.dist*0.45,60,260);if(scam.right!==sz){scam.left=-sz;scam.right=sz;scam.top=sz;scam.bottom=-sz;scam.updateProjectionMatrix();shThr=SHK*2*sz/key.shadow.mapSize.x;MVM.forEach(castOn);BOXM.forEach(castOn);}
    const balHid=cur.lift<0.02&&cur.explode<0.01&&cur.dev<0.01&&!st.drive&&secMode==='off'&&!st.see&&!st.iso&&!st.hid.size&&!Object.keys(st.op).length&&!insetKind&&!benchD.open;   /* the balance can't be seen */
    const sig=[slip,+!!ks,cam.position.x,cam.position.y,cam.position.z,C.target.x,C.target.y,C.target.z,cam.fov,W,Hh,E,balHid?0:s.th,balHid?0:s.lift,balHid?0:s.psDef,n,+winding,H.blk,H.arm,H.twT,cur.lift,cur.flip,cur.explode,cur.dev,cur.lidM,cur.lidT,roll,pitch,latchK,secPlane.normal.x,secPlane.normal.y,secPlane.normal.z,secPlane.constant,+(secMode!=='off')];
    const still=!SNAP&&now>wakeT&&(now-lastDraw<10||!!lastSig&&sig.every((v,i)=>Math.abs(v-lastSig[i])<1e-4)&&now-lastDraw<1000);
    if(!ESSAY.on()&&onScreen&&!still){paint();renders++;lastDraw=now;lastSig=sig;
    /* labels: occlusion (5 Hz), then greedy placement by priority with four candidate sides */
    placeLabels(now);}
    if(!still&&!ESSAY.on()){s.held=H.held;drawInset(E,s,n);benchDraw(s,E);}
    const dR=dialRead(),dE=dR-tM,tod=((dR%86400)+86400)%86400,hh=Math.floor(tod/3600),mm=Math.floor(tod%3600/60),ss=Math.floor(tod%60);
    const hs=`<b>${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</b> ${tz==='gmt'?'GMT':'local'}${Math.abs(dE)>=0.25?`, dial <b>${fmtErr(dE)}</b>`:''}&ensp;${run?`${(RUN_H-hrs).toFixed(1)} h of power left${H.held?'&ensp;<b>'+stopWhy(run)+'</b>':''}`:`Run down. Wind it, then twist to start.`}${st.speed!==1?`&ensp;<b>${fmtSpd(st.speed)}</b>${st.speed>REAL_X?', balance swing shown slowed':''}`:''}${winding?'&ensp;<b>Winding</b>'+(run?', maintaining power driving the train':''):''}${now<noteT?'&ensp;<b>'+noteTx+'</b>':''}`;
    if(hs!==hudS){hudS=hs;hud.innerHTML=hs;}   /* rewritten only when the text changes */
    if(rateK!==1&&now-lastRS>250&&$('#rateDet').open){lastRS=now;rateShow();}
    if($('#stopDet').open)stopShow(now,run);
    if(ss!==todS&&document.activeElement!==todIn){todS=ss;todIn.value=[hh,mm,ss].map(v=>String(v).padStart(2,'0')).join(':');}
    if(!loaded){loaded=true;pend.clear();$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),900);setTimeout(()=>{if(st.tour<0&&!camFree)setView(startView);hashReady=true;writeHash();},1100);}
    requestAnimationFrame(frame);
  }
  ESSAY.bind({time:()=>dialRead(),hrs:()=>hrs,tz:()=>tz,fs:R.fs,I0,changed:wake});
  look();
  Object.assign(tgt,{lidM:0,lidT:0});st.view='dial';
  document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='dial'?'true':'false'));
  requestAnimationFrame(frame);
})();
