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
  bowl:{t:'Chronometer case',g:0,src:'est',sn:'How it holds the movement is the manual’s (Sec. III), its width from the top-view photographs; the shield plate’s parts, their arrangement (Fig. 107) and its action from the manual; shapes and the other sizes estimated',c:'#c4b27a',pri:5,d:'Brass bowl and bezel with crystal. The movement’s mounting ring sits in a recess round its top edge, on the shoulder at its foot, and the ring’s alignment pin enters a slot in its edge; the bezel screws on outside the rim. The winding-hole shield plate on its bottom is turned clockwise to admit the key and springs back when the key is removed.',sp:'Case No. 42101, bezel 42102, crystal 42103 · case support brackets 42105, their screws 42117 and pivot bushings 42214 · latch keeper 42113, its screw 42116 and separating washer 42128 · shield plate 42104, shoulder screw 42124, stop screw 42125, return spring 42126'},
  key:{t:'Winding key',g:0,src:'est',sn:'The square is 2.4 mm, as the fusee arbor’s, since one key fits both; the rest estimated',figs:'7, 8',c:'#6d7a8a',pri:4,d:'Wind to the left (counterclockwise). Seven half turns restore 24 hours of running; 17½ half turns wind a run-down chronometer fully.',sp:'No. 42044'},
  pillar:{t:'Pillar plate',g:1,src:'photo',sn:'87.57 mm across and 3.86 mm thick, from a new-old-stock plate; the engraving traced on a photograph',figs:'29, 67, 110',c:'#9fb4c8',plate:1,d:'Foundation of the movement. The barrel and train bridges stand off it on four pillars, each screwed on from the dial side. A large hole under the dial reaches one of the balance lower bridge’s screws. On its dial side are the lower train bridge, the escape wheel’s lower endstone cap and the posts the minute and wind indicator wheels turn on. It is laid on the mounting ring, a deep lacquered brass ring that carries the dial and holds the movement in its case; seen from the dial side, the plate lies sunk in it.',sp:'No. 42060 · 87.57 mm diameter, 3.86 mm thick · pillar screws 42055 · mounting ring 42057 with its alignment pin, screws 42055 · centre, barrel and fusee lower bushings 42165, 42164 · escape lower setting 42162, endstone cap 42159, screws 20762 · posts 42084, 42085, screws 35779'},
  ltb:{t:'Lower train bridge',g:1,src:'photo',sn:'A straight steel bar with square ends across an opening in the plate, the settings inboard and a screw toward each end, as Figs. 30 and 31 and a photograph of a Model 21’s dial side show it; its sizes measured on a restoration video: 4.4 mm thick, about 10 wide, its screws’ heads and the settings in counterbores at its top',figs:'29, 30, 31, 67, 110',c:'#b6d7c9',plate:1,d:'A steel bar screwed to the dial side of the pillar plate, under the dial, across an opening round the third arbor; carries the third and fourth wheel lower settings (bar-hole jewels) and two steady pins.',sp:'No. 42063 · screws 42163 · third and fourth lower settings 42161'},
  pillars:{t:'Pillars',g:1,src:'photo',sn:'Heights from a side photograph, places from the top-view photograph',figs:'29, 67, 110',c:'#707a84',plate:1,d:'Four pillars: three for the upper train bridge, one for the barrel bridge. Each is screwed on from the dial side of the pillar plate and tapped at its top for its bridge’s screw.',sp:'Nos. 42059, 42058 · screws 42055'},
  trainBridge:{t:'Upper train bridge',g:1,src:'photo',sn:'Its crescent from Figs. 29, 67 and 110, the notch round the fusee and its horn measured on a restoration video; thickness from a side photograph; the keyhole built round the arbors',figs:'24, 29, 67, 108, 110',c:'#c9d8a8',pri:2,plate:1,d:'Carries the centre and third wheel upper bushings. The balance cock, balance lower bridge and escape upper bridge are mounted to it; the detent support block is fastened to its underside. It leaves the fusee’s top open to the barrel bridge above.',sp:'No. 42062 · screws 42055 · detent support block screw 42056 · centre and third upper bushings 42166, 42167'},
  barrelBridge:{t:'Barrel bridge',g:1,src:'photo',sn:'Outline and the cut round the balance traced on the top-view photograph; thickness from a side photograph',figs:'24, 77, 110',c:'#e3cfa6',pri:2,plate:1,d:'Holds the upper pivots of both the barrel and the fusee. The fusee winding stop is a stud screwed into its underside (left-hand thread); the setup ratchet and the dust seal sit on top.',sp:'No. 42061 · screws 42055 · barrel and fusee upper bushings 42164 · winding stop 42099'},
  escBridge:{t:'Escape upper bridge',g:1,src:'photo',sn:'Its form from a restoration video (a bar across the escape lobe, symmetric about the jewel, a round cap) and Figs. 84, 110; its sizes and direction read off that frame, to about 10 %',figs:'29, 67, 110',c:'#c8b8e3',plate:1,d:'Small bridge holding the escape wheel’s upper setting and jewel, with the endstone cap over them on two screws.',sp:'No. 42064, screws 20762 · setting 42162 · cap 42159, screws 20762'},
  lowerBridge:{t:'Balance lower bridge',g:1,src:'est',sn:'Its outline measured on a restoration video of a 1941 Model 21, the train bridge held underside up with the bridge on it, through the camera the bridge’s rim gives; its lower level a 3 mm plate on a side photograph; changed only round the model’s own arbors, which stand 4–5 mm from the real ones (tools/lower_bridge.py)',figs:'29, 30, 110',c:'#a8d4e0',pri:3,plate:1,d:'Holds the balance staff’s lower setting, with its endstone cap underneath in a round counterbore, and the fourth wheel upper setting. It has two levels. The lower is a slab curved like a lens, its edges chamfered; its concave side follows the round opening in the train bridge, so the escape wheel can be lifted out past it with the bridge in place. The upper is a lug at each end, against the underside of the upper train bridge, held by a screw put in from below and located by a steady pin; between them the escape wheel turns over the slab. Beside the fourth wheel’s setting the train-blocking screw is threaded through the slab, its head in a column that rises to the train bridge; the screw in the lug at the other end can be reached through a hole in the pillar plate.',sp:'No. 42065 · screws 42055 · settings 42162, 42161 · cap 42159, screws 20762'},
  cock:{t:'Balance cock',g:1,src:'photo',sn:'Traced on the top-view photograph and shifted for parallax; the nose widened round the endstone cap',figs:'19, 84, 85',c:'#d8b0c8',pri:5,plate:1,d:'Carries the balance upper setting and its olive-hole jewel, pressed into the nose, the endstone cap over them on two screws, and the hairspring stud underneath on its screw. Its foot stands on the upper train bridge beside the barrel bridge, held by one screw.',sp:'No. 42066 · screw 42192 · upper setting 42162 · endstone cap 42160 with its setting 42155, screws 20762 · hairspring stud screw 27760'},
  dial:{t:'Dial',g:1,src:'photo',sn:'After a photographed U.S. Maritime Commission dial; the sub-dials sit on their arbors, a little nearer the centre',figs:'107',plate:1,d:'Black on silver-white, after a photographed Model 21 dial of the U.S. Maritime Commission contract. Large Arabic hours (the 6 covered by the seconds sub-dial) inside a railroad minute track with triangles at the hours; HAMILTON and LANCASTER, PA., U.S.A. across the centre; UP–DOWN indicator below the 12, numbered 8 to 48, on this movement’s sweep, 314° from UP to DOWN; seconds at 6, numbered 10 to 60, with the serial number and U.S. MARITIME COMMISSION. It lies on the mounting ring’s flange, a little inside its edge, held by four feet in the flange and dial screws from the flange’s train side.',sp:'No. 42030 · screws 35756'},
  barrel:{t:'Mainspring barrel',g:2,src:'est',sn:'Its axis from the photographs and its height (16.5 mm) from the side photograph; its inside estimated',figs:'26, 75, 109',c:'#b86bd1',pri:8,d:'Holds the mainspring and its brace, a strip lining the wall where the spring’s outer end hooks. Turns clockwise while running, drawing the chain from the fusee. The cap on the pillar-plate end is held by five screws.',sp:'No. 42168 · cap 42169, screws 37023 · brace 42037'},
  mainspring:{t:'Mainspring',g:2,src:'est',sn:'Thickness from the parts list (0.0165 in); length (1,064 mm, filling half the room between core and brace) estimated; its lie solved from its natural curve, measured on a restoration video of its spring out of the barrel',figs:'26, 75',c:'#334f8f',d:'Inner end on the hook of the fixed barrel arbor, outer end by its anchor pin at the brace. Each coil lies where the strip, bent from its natural spiral, is in balance with the coils pressing on it: wound, they draw in round the arbor; as it runs down they spread out toward the wall (let right down, out of the movement, most would lie packed against it with loose turns inside). Set up 1.6 turns, so its pull falls over the wind as the fusee is cut for.',sp:'No. 42038 · 0.0165 in. thick'},
  ratchet:{t:'Setup ratchet',g:2,src:'photo',sn:'The cover plate fitted to its edge traced on two photographs; the ratchet’s 42 teeth counted on a restoration video, its size and the click’s pivot measured on the video and both photographs',figs:'17, 24, 80',c:'#a0922f',d:'Setup ratchet wheel on the barrel arbor under the bow-shaped cover plate, with setup pawl (click) and spring. Keeps the arbor from turning in winding and running, so the wheel never moves in use. The arbor turns only in the watchmaker’s hands, with a let-down key on its square: to let the mainspring down before servicing, the pawl held back, and to set it up again at assembly. Inside the barrel the arbor carries the mainspring’s inner end on its hook.',sp:'Wheel 42026 · pawl 42027 on its screw 42036 · spring 42028 · cover plate 42029, screws 42056 · arbor 42170'},
  chain:{t:'Fusee chain',g:2,src:'est',sn:'Figure-eight plates three deep, riveted parallel to the arbor (Fig. 38); hooked to the barrel and pinned to the fusee as the manual has it. Plate sizes, pitch and end fittings estimated',figs:'26, 28, 38, 75',c:'#4a4f57',pri:7.5,d:'Links the barrel to the fusee: hooked to the barrel, pinned to the fusee’s large end. It bends only about its rivets, so it lies on edge in the fusee’s groove. Winding onto the last turn, it bears on the stop-bar’s nose.',sp:'No. 42001'},
  fusee:{t:'Fusee',g:2,src:'est',sn:'Profile and top measured on a side photograph; the stop-bar’s nose, slot and travel estimated',figs:'12, 24, 28, 69–74',c:'#e88a2e',pri:8.5,d:'Shaped so the moment of force on the fusee wheel is always about the same, fully wound or nearly run down. The chain lies in a helical groove between thin flanges. The winding ratchet is screwed to its large end. The winding stop-bar lies in a slot across its top, under the top plate, its nose down in the groove’s top turn: the chain, winding onto that turn, pushes the nose in, the bar’s other end stands out past the rim and catches the winding stop under the barrel bridge, and a spring draws it back when the chain runs off. The end plate and a taper pin hold the fusee wheel and maintaining work on the arbor.',sp:'No. 42021 · arbor 42022 · stop-bar 42024, spring 42025 · top plate 42008, screws 27760 · winding ratchet 42013, screws 42014 · end plate 42019, taper pin 42020'},
  sq:{t:'Fusee arbor square',g:2,src:'est',sn:'Size estimated',figs:'7',c:'#5e6b2a',d:'Turned counterclockwise by the key to wind.',sp:'Arbor 42022'},
  post:{t:'Dust seal',g:2,src:'est',sn:'The seal and three packing rings are the manual’s; their sizes are estimated',figs:'24',c:'#8c6b4a',dh:1,d:'Nickel dust seal on the barrel bridge where the fusee arbor rises through it, capped by three packing rings over a seal ring and helical spring. The key reaches the squared arbor through it.',sp:'Seal 42051, screws 42056 · packing rings 42054 · seal ring 42052 · helical seal spring 42053'},
  gw:{t:'Fusee wheel',g:2,src:'photo',sn:'90 teeth, counted on a restoration video of a 1941 Model 21; the centre pinion’s 14 leaves inferred: the manual’s 17½ half turns of the key then hold its 56 hours',figs:'12, 28',c:'#d9453b',pri:6.4,d:'The first wheel of the train, free on the fusee arbor; it drives the centre wheel pinion. The sustaining spring in its recess drives it: loaded by the sustaining ratchet wheel in running, on its own while the key winds. So it keeps turning forward with the train, once in 6.4 hours, while the fusee under it turns back.',sp:`No. 42015 · ${TRAIN.fu} teeth here`},
  sratchet:{t:'Sustaining ratchet wheel',g:2,src:'est',sn:'Its pawls, springs and screws are the manual’s (Sec. IV, parts list); gilt, its springs’ screws from its underside, as on a restoration video; sizes estimated',figs:'69–74',c:'#2f8fb0',pri:4.6,d:'Free on the fusee arbor. Its two winding pawls, each held in by a flat spring, catch the winding ratchet screwed to the fusee, so in running the mainspring’s pull passes through this wheel and the sustaining spring to the fusee wheel. While the key turns the fusee back the winding ratchet slips under the pawls, and the sustaining pawl holds this wheel.',sp:'No. 42009 · winding pawl springs 42007, screws 42012 · winding ratchet 42013'},
  sspring:{t:'Sustaining spring',g:2,src:'est',sn:'Its band, ends and place measured on a restoration video of a real Model 21; the gap and its travel estimated',figs:'28, 69–74',c:'#6a3fa0',d:'A flat blued band round the fusee wheel’s recess, nearly a full ring: one end pinned to the wheel, the other, across a small gap, pinned to the sustaining ratchet wheel, which pushes it toward the first and closes the ring. Always under load: while the key turns the fusee back it alone drives the train, for 5 to 10 minutes, and the mainspring loads it again when the key lets go.',sp:'No. 42016'},
  spawl:{t:'Sustaining pawl',g:2,src:'photo',sn:'Its place, hub, curved blade and upright spring wire measured on a restoration video; the back of the blade’s root estimated',figs:'12, 28',c:'#1fa05a',pri:4.5,d:'Holds the sustaining ratchet wheel from turning back while the fusee is wound, so the sustaining spring can only release its power forward into the train, enough to run the chronometer 5 to 10 minutes.',sp:'No. 42096'},
  cw:{t:'Centre wheel',g:3,src:'solved',sn:'Its place in the stack (above the third wheel, its pinion above it), its pinion’s side and its five spokes from Figs. 13, 29 and 110; 90 teeth and a third pinion of 12, counted on a restoration video; module from its centre distance',figs:'13, 29, 110',c:'#f2c230',pri:7,d:'Second wheel of the train. Its long arbor passes through the pillar plate and dial and carries the cannon pinion and hour wheel.',sp:'No. 42068 · 1 turn an hour'},
  tw:{t:'Third wheel',g:3,src:'solved',sn:'Lowest in the stack, its pinion above it and five spokes, from Figs. 13, 29 and 110; position solved so every arbor clears every wheel; 80 teeth, counted on a restoration video; module from its centre distance',figs:'13, 29, 110',c:'#7cc242',pri:6.5,d:'Lowest wheel of the train, next to the pillar plate. Its pinion, above it, is driven by the centre wheel; the wheel drives the fourth wheel’s pinion.',sp:'No. 42071'},
  fw:{t:'Fourth wheel',g:3,src:'solved',sn:'Its long pinion under the wheel and its five spokes from Figs. 13, 29 and 110; 75 teeth, counted on a restoration video (so the escape pinion has 10); its height solved for clearance; module from its centre distance; a side photograph shows where it meshes',figs:'13, 29, 110',c:'#2fb3a6',pri:6.8,d:'Its long arbor passes through the dial to carry the second hand. Jewelled at both ends; its upper setting is in the balance lower bridge.',sp:'No. 42073 · 1 turn a minute'},
  tblock:{t:'Train-blocking screw',g:3,src:'est',sn:'Its arrangement is Fig. 110’s section; its size and travel are estimated',figs:'110',c:'#c77d2a',dh:1,d:'Mounted in the balance lower bridge (Sec. II, Fig. 110). Screwed down, its head stops on a seat in the bridge and its dog point stands between the fourth wheel’s spokes, so the train turns only until a spoke meets it: the mainspring keeps its power while the balance and escapement are out for service. Screwed up, the chamfer on its head seats in the countersunk access hole in the upper train bridge, through which it is turned. Fitted from serial 4003. Lower and raise it under Stopping and starting.',sp:'No. 42247'},
  escW:{t:'Escape wheel',g:3,src:'manual',sn:'16 teeth, 13.16 mm, 1.3 mm thick (Hamilton’s specification); tooth form from Fig. 90 and an original wheel, tall teeth on a thin rim as Fig. 14 has them; 9.40 mm from the balance for the manual’s roller shake',figs:'14, 90',c:'#2f7fe0',pri:9.5,d:'Released one tooth per oscillation of the balance, so the second hand advances in half-second steps. Sixteen teeth (most chronometers use 13 or 15), 13.16 mm across, the teeth 1.3 mm thick standing on a thin, narrow rim with four thin crossed spokes. Each tooth is a slender point: a narrow land at the tip, a locking face undercut so the tip leads, and a hollow back. The tip and front face bear on the locking jewel and drive the impulse jewel.',sp:`No. 42076 · ${TRAIN.ew} teeth, 1 turn / ${turnT(ESC_TURN)}`},
  det:{t:'Detent',g:3,src:'manual',sn:'The plan from Fig. 90; thicknesses and heights estimated',figs:'14, 54–60, 90, 110',c:'#e0457b',pri:9,d:'Beryllium-copper spring detent. Its foot is clamped to the support block under the upper train bridge, and the detent-adjusting screw sets it lengthwise. Ahead of the foot: the two-strip detent spring (the point of flexure), the blade, the locking jewel (round, with a flat set at about 10° of draw) and the abutment arm (horn). It rests against the stop button, set by the lock-adjusting screw. The trip (passing) spring, a thin flat strip of Hamilton Elinvar, is screwed to an angle bracket on it and rests on the horn. The locking jewel is held in its hole by a wedge pin.',sp:'Detent 42087 with locking jewel 285 and wedge pin 42089 · trip spring 42088 on bracket 42092, screws 1770 · block 42086, screw 42056 · clamp screw 37024, washer 42251 · adjusting screw 20756 · lock-adjusting and clamp screws 42091'},
  bal:{t:'Balance and hairspring assembly',g:3,src:'photo',sn:'The rim, 29 mm across, measured on the top-view photograph; its 24 holes, the screws in them and the weights where a restoration video of a 1941 Model 21 shows them; the rim’s section and the screws’ heads measured on it; their masses from the parts list; its moment of inertia the manual’s Table II',figs:'3, 4',c:'#8a5cf0',pri:10,d:'Solid, uncut stainless-steel rim silver-soldered to an Invar arm, with 24 tapped holes all round, numbered 1 to 13 round each half from the arm’s end: the timing weights at the arm’s ends, the vernier timing weights inside the rim beside them, and the balance screws in pairs, one in the same hole of each half (four pairs as standard, in holes 3, 5, 9 and 12). Motion 1⅜ to 1½ turns. On the staff, the impulse roller (with three holes, and its jewel flat on the impulse face and curved behind) and below it the unlocking roller, a collar with its jewel in a slot. The arm sits on the hub’s flange, under a cap held by two hold-down screws, so it is clear of the staff (Fig. 4). Rim about 29 mm across, measured on a top-view photograph.',sp:'Wheel 42178 · hub and staff 42186 · cap 42248, screws 42249 · balance screws 42171, 42173, 42174 · timing weights 42176 on screws 42177 · vernier weights 37115 on screws 42197 · impulse roller 42263 and jewel 286 · unlocking roller 42252 and jewel 287 · collet 42190, clamp 42191, wedge pin 42147'},
  lockArm:{t:'Balance wheel locking arm',g:3,src:'est',sn:'Curved, its screw outside the rim and its end at a timing weight, as Fig. 9 draws it and Sec. X describes; its sizes are estimated',figs:'9',c:'#5a7fb0',dh:1,d:'Holds the balance still in transit (Sec. III, Fig. 9): loosen its screw, turn the arm, tighten the screw. Locked, the finger at its end stands beside a timing weight, which the hairspring holds against it, and the vernier weight’s screw stops the balance the other way (“place the locking arm over the timing weight”, Sec. X); unlocked, it rests turned out against its stop pin, clear of the balance. Fitted to chronometers overhauled from 1947; before it, folded wedges went between the rim and the train bridge. Lock and unlock it under Stopping and starting.',sp:'Arm 42299 · screw 37204 · washer 42251 · stop pin 42300'},
  spr:{t:'Hairspring',g:3,src:'est',sn:'5.9 mm tall, to reach the stud; the collet and stud after Figs. 5 and 6',figs:'5, 6, 19, 84, 85',c:'#f25fd0',pri:6,d:'Cylindrical, of Hamilton Elinvar. Each end is held in a clamp by a wedge pin, without bending the spring, so its active length is the same winding and unwinding: the inner end on the tongue of the collet, which is slotted to grip the balance staff and owes its curious shape to counterpoising experiments; the upper end in the stud, a bar held under the balance cock by the stud screw from the cock’s top and a steady pin. There is no regulator: rate is set with the balance screws and weights.',sp:'No. 42188 · collet 42190 · stud 42189 with its clamp 42191, wedge pin 42147 and screw 27760 (Figs. 5, 6)'},
  hands:{t:'Hands',g:4,src:'photo',sn:'After the photographed U.S. Maritime Commission dial; how the hands are fitted after Op. 64',figs:'107',c:'#1b1b1b',pri:6,d:'Blued steel: an hour hand with a bulb and a long spear point, a plain minute hand, a long seconds hand with a spear counterpoise. The minute hand, broached square, sits on the cannon pinion’s square below its bright end and turns with it once an hour; the hour hand is pressed on the hour wheel’s round pipe, which turns once in 12 hours (Op. 64); both are driven from the centre wheel staff. The second hand is on the fourth wheel staff, the wind indicator hand on its own wheel. The hands advance in half-second increments.',sp:'Nos. 42032–42035'},
  motion:{t:'Motion work',g:4,src:'est',sn:'Its counts are chosen but the wind indicator wheel’s 120, counted on a restoration video; with the fusee arbor’s pinion of 12 the hand sweeps 314° in 56 hours, as a photographed dial’s scale; the hand-setting square after Fig. 8; the solid minute and hour wheels and the five-spoked wind indicator wheel as photographs of a Model 21’s dial side show them',figs:'8, 81, 107',c:'#a45a3c',pri:5,d:'Cannon pinion, minute wheel and hour wheel under the dial, the pipes of the cannon pinion and hour wheel rising through it; the minute wheel turns on a post screwed to the pillar plate. The cannon pinion is a friction fit on the centre arbor, so the hands can be set without moving the train, and its pipe ends above the dial in the bright square that takes the winding key, turned by its shank, to set the hour and minute hands, forward only. The cannon pinion and its square turn with the minute hand, once an hour; through the minute wheel (12 into 36, then 10 into 40) they turn the hour wheel at a twelfth of that, so its pipe, turning free round the cannon pinion’s and carrying the hour hand, makes one turn in 12 hours: being round, it seems to stand still. A pinion on the dial end of the fusee arbor drives the wind indicator wheel, which turns on a post of its own and carries the wind indicator hand on its pipe.',sp:'Nos. 42077, 42078, 42080, 42081 · posts 42085, 42084'}
};
/* the pieces of the parts that are several things in one: each part's list in order, k its key (picked, hidden, isolated and linked as part.k: #part=bal.staff), t name, h the
   parts-list lines (bom.json ids) its meshes carry, d what it does, sp Hamilton numbers, and src, sn, figs where they differ from its part's. A mesh is the piece its nearest pc
   tag names (pc() in core.js), else the piece that lists the line it carries (userData.hn, or its nearest tagged ancestor's): the first listed, where two list it (the staff's
   42186, which the hub's tag overrides). A part's pieces cover all its meshes (tools/smoke.py) */
const PIECES={
  bal:[{k:'wheel',t:'Balance wheel',h:'42178',d:'The solid, uncut stainless-steel rim silver-soldered to an Invar arm, with tapped holes all round for the balance screws and the timing weights (Sec. II). About 29 mm across, measured on a top-view photograph.',sp:'No. 42178, complete with spoke',figs:'3, 4'},
    {k:'staff',t:'Balance staff',h:'42186',d:'Turned to its pivots, which run in olive-hole jewels in the balance cock and the balance lower bridge, each end against an endstone. It carries the hub, the impulse and unlocking rollers and the hairspring collet, and turns with the balance.',sp:'No. 42186, the hub complete with staff'},
    {k:'impulse',t:'Impulse roller and jewel',h:'42263 286',d:'On the staff, as thick as the escape wheel. Once each oscillation a tooth of the escape wheel drives its jewel, giving the balance its impulse (Sec. IV). The jewel is flat on its impulse face and curved behind; the roller has three holes, and its diameter (0.249 in.) sets the roller shake (Op. 84).',sp:'Roller 42263 · impulse jewel 286',figs:'14, 61'},
    {k:'unlock',t:'Unlocking roller and jewel',h:'42252 287',d:'A collar on the staff below the impulse roller, its jewel in a slot along it. On one swing the jewel lifts the detent through the trip spring and unlocks the escape wheel; on the return it only pushes the trip spring aside (Sec. IV). Turned on the staff to set the drop (Op. 97).',sp:'Roller 42252 · unlocking jewel 287',figs:'14, 64'},
    {k:'collet',t:'Hairspring collet',h:'42190 42191.col 42147.col',d:'Slotted to grip the balance staff. Its tongue carries the clamp that holds the hairspring’s inner end, locked by a wedge pin so the spring is not bent (Sec. II).',sp:'Collet 42190 · clamp 42191 · wedge pin 42147',figs:'5, 6'},
    {k:'hub',t:'Balance hub, cap and screws',h:'42186 42248 42249',d:'The hub’s flange, on the staff, carries the arm clear of the staff; a cap goes over the arm, and two hold-down screws pass through cap and arm into the flange (Fig. 4).',sp:'Hub 42186 · cap 42248 · hold-down screws 42249',figs:'4'},
    {k:'screws',t:'Balance screws',h:'42171 42172 42173 42174 42271 42181 42182 42183 42184 42185 42256',d:'Ten screws in diametric pairs about the quarters of the rim: six with heads 0.049 in. high, two of 0.080 in. and two of 0.101 in. Changing a pair, or putting timing washers under their heads, sets the rate and the temperature adjustment (Secs. II, IX; Tables II, III).',sp:'Nos. 42171, 42173, 42174 · timing washers 42181–42185, 42256 as required',figs:'3'},
    {k:'weights',t:'Timing weights',h:'42176 42177 37115 42197',d:'Two timing weights and two vernier timing weights beside the arm ends, each a nut on a screw in the rim. A full turn of a pair changes the rate about 40 s a day for the timing weights, 2.8 s for the verniers (p. 70).',sp:'Timing weights 42176 on screws 42177 · vernier weights 37115 on screws 42197',figs:'3'},
    {k:'split',t:'Split bimetallic balance',h:'42186',src:'est',sn:'illustrative, the older kind; not the Model 21’s',figs:'',d:'The older balance, fitted in place of the Model 21’s under Variants: each half of the rim a band of brass outside steel, cut through near the arm, with a compensation weight on each half.',sp:''}],
  spr:[{k:'spring',t:'Hairspring',h:'42188',d:'Cylindrical, of Hamilton Elinvar. Its restoring force and the balance’s moment of inertia set the rate (Sec. II); there is no regulator.',sp:'No. 42188',figs:'5, 6'},
    {k:'stud',t:'Hairspring stud',h:'42189 42191.st 42147.st',d:'A bar under the balance cock, held by the stud screw from the cock’s top and a steady pin. Its clamp holds the spring’s upper end by a wedge pin, without bending it (Figs. 5, 6).',sp:'Stud 42189 · clamp 42191 · wedge pin 42147',figs:'5, 6, 19'}],
  det:[{k:'detent',t:'Detent',h:'42087',d:'Beryllium copper, its foot clamped to the support block: the two-strip spring (the point of flexure), the blade with the locking jewel, and the horn the trip spring rests on. Lifted by the unlocking jewel through the trip spring, it frees one tooth of the escape wheel (Sec. IV).',sp:'No. 42087',figs:'14, 54–60, 90'},
    {k:'jewel',t:'Locking jewel',h:'285 42089',d:'Round, with a flat set at about 10° of draw. Each tooth of the escape wheel locks on it until the detent is lifted; a wedge pin holds it in its hole (Figs. 57–59).',sp:'Jewel 285 · wedge pin 42089',figs:'14, 57–59, 90'},
    {k:'trip',t:'Trip spring and bracket',h:'42088 42092 1770.br 1770.ts',d:'A thin flat strip of Hamilton Elinvar screwed to an angle bracket on the detent, resting on the horn. The unlocking jewel lifts the detent through it on one swing and pushes it aside on the return (Sec. IV).',sp:'Spring 42088 · bracket 42092 · screws 1770',figs:'14, 54'},
    {k:'block',t:'Detent support block',h:'42086',d:'Fixed under the upper train bridge by one screw and two positioning pins. It carries the detent, the stop button the detent rests against, and the adjusting screws (Secs. II, IV).',sp:'No. 42086, complete with button and pins',figs:'14, 110'},
    {k:'screws',t:'Detent clamp and adjusting screws',h:'37024 42251.det 20756 42091.cl 42091.lk',d:'The clamp screw, with its washer and two steady pins, holds the detent’s foot to the block. The adjusting screw sets the detent lengthwise (Ops. 84, 93); the lock-adjusting screw sets the depth of lock through the stop button (Op. 85), and its clamp screw holds it.',sp:'Clamp screw 37024, washer 42251 · adjusting screw 20756 · lock-adjusting and clamp screws 42091',figs:'14, 90, 110'}],
  cock:[{k:'cock',t:'Balance cock',h:'42066 42192',d:'Its foot stands on the upper train bridge beside the barrel bridge, held by one screw. Its nose carries the balance upper jewel and endstone cap over the staff, and the hairspring stud underneath.',sp:'Cock 42066 · screw 42192'},
    {k:'jewel',t:'Balance upper jewel',h:'42162.bu J.bu',d:'An olive-hole jewel in its setting, pressed into the cock’s nose; the balance staff’s upper pivot runs in it.',sp:'Setting 42162 with its jewel'},
    {k:'cap',t:'Balance upper endstone cap',h:'42160 42155 J.bue 20762.ep',d:'The cap jewel in its setting, held over the olive-hole jewel by the cap and two screws. It stops the staff’s upper pivot end: endshake 0.001–0.003 in. (Op. 74).',sp:'Cap 42160 · setting 42155 with its jewel · screws 20762'},
    {k:'stud',t:'Hairspring stud screw',h:'27760.st',d:'Holds the hairspring stud under the cock, put in from the cock’s top (Figs. 19, 84).',sp:'No. 27760',figs:'19, 84'}],
  fusee:[{k:'body',t:'Fusee',h:'42021',d:'Its spiral groove evens the mainspring’s pull on the train (Sec. II): the chain lies in it between thin flanges, on the small end when the spring is fully wound and strongest, on the large end when it is nearly run down.',sp:'No. 42021',figs:'12, 28'},
    {k:'arbor',t:'Fusee arbor',h:'42022',d:'Squared at its top for the winding key. The fusee wheel and the maintaining work turn free on it; the pinion on its dial end drives the wind indicator wheel (Sec. II).',sp:'No. 42022, complete with wind indicator pinion',figs:'7, 12'},
    {k:'wratchet',t:'Winding ratchet',h:'42013 42014',d:'Screwed to the fusee’s large end. In running its teeth drive the winding pawls on the sustaining ratchet wheel; while the key winds they slip under them (Sec. IV).',sp:'Wheel 42013 · screws 42014',figs:'12, 69'},
    {k:'end',t:'Fusee end plate and taper pin',h:'42019 42020',d:'Under the fusee wheel: the end plate, held by a taper pin through the arbor, keeps the fusee wheel and the maintaining work on it (Figs. 28, 70).',sp:'Plate 42019 · taper pin 42020',figs:'28, 70'},
    {k:'top',t:'Fusee top plate',h:'42008 27760.fu',d:'Covers the winding stop-bar and its spring in the fusee’s top, held by two screws.',sp:'Plate 42008 · screws 27760',figs:'73'},
    {k:'stop',t:'Winding stop-bar and spring',h:'42024 42025',d:'The bar lies in a slot across the fusee’s top, its nose down in the groove’s top turn. The chain, winding onto that turn, pushes the nose in; the bar’s other end then stands out past the rim and meets the winding stop under the barrel bridge, and the key can turn no further. Its spring draws it back when the chain runs off.',sp:'Stop-bar 42024 · spring 42025',figs:'12, 73'}],
  barrel:[{k:'drum',t:'Barrel',h:'42168',d:'Holds the mainspring, whose outer end hooks to it by the anchor pin at the brace. Turns clockwise in running, drawing the chain off the fusee (Sec. IV).',sp:'No. 42168'},
    {k:'cap',t:'Barrel cap and screws',h:'42169 37023',d:'Closes the barrel on the pillar-plate end, held by five screws (Figs. 26, 109).',sp:'Cap 42169 · screws 37023',figs:'26, 109'},
    {k:'brace',t:'Mainspring brace',h:'42037',d:'A strip lining the barrel’s wall where the mainspring’s outer end hooks (Fig. 75).',sp:'No. 42037',figs:'75'}],
  ratchet:[{k:'wheel',t:'Setup ratchet wheel',h:'42026',d:'On the barrel arbor above the barrel bridge, held by the click, so the arbor never turns in winding or running (Sec. II).',sp:'No. 42026'},
    {k:'arbor',t:'Barrel arbor',h:'42170',d:'It stands still: the mainspring’s inner end hooks on it inside the barrel, and the setup ratchet and click hold it. It turns only with a let-down key on its square, to let the mainspring down before servicing or set it up again.',sp:'No. 42170',figs:'26, 75'},
    {k:'click',t:'Setup click',h:'42027 42036',d:'The setup pawl: it bears on the ratchet’s steep faces against the mainspring’s pull, turning on its pivot screw through the cover plate (Sec. II).',sp:'Pawl 42027 · pivot screw 42036'},
    {k:'spring',t:'Setup click spring',h:'42028',d:'Holds the click in the setup ratchet’s teeth.',sp:'No. 42028, complete with pins'},
    {k:'cover',t:'Setup cover plate',h:'42029 42056.cv',d:'The bow-shaped plate over the setup ratchet and click, standing on its feet, held to the barrel bridge by two screws. It carries the click’s pivot screw.',sp:'Plate 42029 · screws 42056'}],
  post:[{k:'seal',t:'Dust seal',h:'42051 42056.sl',d:'Nickel, on the barrel bridge where the fusee arbor rises through it, its flange held by two screws. The key reaches the arbor’s square through it.',sp:'Seal 42051 · screws 42056'},
    {k:'packing',t:'Dust seal packing',h:'42052 42053 42054',d:'Three packing rings over a seal ring, which a helical spring presses against its seat round the fusee arbor.',sp:'Packing rings 42054 · seal ring 42052 · spring 42053'}],
  sratchet:[{k:'wheel',t:'Sustaining ratchet wheel',h:'42009',d:'Free on the fusee arbor. In running the mainspring’s pull passes through it and the sustaining spring to the fusee wheel; while the key winds, the sustaining pawl holds it (Sec. IV).',sp:'No. 42009'},
    {k:'pawls',t:'Winding pawls',h:'42009',d:'Two pawls on studs in the sustaining ratchet wheel, their tips on the fusee’s winding ratchet: driven by its steep faces in running, slipping over them while the key winds.',sp:'No. 42009, the wheel complete with pawls'},
    {k:'springs',t:'Winding pawl springs',h:'42007 42012',d:'A long thin spring round the wheel for each pawl, holding it in the winding ratchet’s teeth. Each foot is held by two screws put in from the wheel’s underside.',sp:'Springs 42007 · screws 42012',figs:'28, 69'}],
  pillar:[{k:'plate',t:'Pillar plate',h:'42060',d:'Foundation of the movement, 87.57 mm across and 3.86 mm thick. The barrel and train bridges stand off it on four pillars; on its dial side are the lower train bridge, the escape wheel’s lower endstone cap and the motion work’s posts.',sp:'No. 42060 · 87.57 mm diameter, 3.86 mm thick'},
    {k:'ring',t:'Mounting ring',h:'42057 42055.ring',d:'A deep lacquered brass ring under the plate’s dial side. It carries the dial and holds the movement in its case, its alignment pin in the case’s slot (Sec. III); three screws hold the plate to it from the train side.',sp:'Ring 42057 · screws 42055'},
    {k:'screws',t:'Pillar screws',h:'42055.pil 42055.pilb',d:'Four screws from the dial side of the pillar plate, one into the foot of each pillar.',sp:'Nos. 42055'},
    {k:'bush',t:'Pillar plate bushings',h:'42165 42164.fl 42164.bl',d:'Bearings in the pillar plate for the centre arbor and the lower ends of the fusee and barrel arbors.',sp:'Centre 42165 · fusee and barrel 42164'},
    {k:'escape',t:'Escape lower jewel and endstone',h:'42162.el J.el 42159.el J.ele 20762.elc',d:'The escape arbor’s lower pivot runs in an olive-hole jewel set in the pillar plate. On the dial side an endstone cap, held by two screws, stops its end.',sp:'Setting 42162 with its jewel · cap 42159 with its jewel · screws 20762'},
    {k:'posts',t:'Motion work posts',h:'42084 42085 35779.mw 35779.ud',d:'The minute wheel and the wind indicator wheel turn on posts fixed to the pillar plate’s dial side by screws from its train side (Fig. 110).',sp:'Posts 42085, 42084 · screws 35779'},
    {k:'dial',t:'Dial screws',h:'35756',d:'Four screws from the mounting ring’s flange into the dial’s feet (Fig. 107).',sp:'No. 35756',figs:'107'}],
  ltb:[{k:'bar',t:'Lower train bridge',h:'42063',d:'A straight steel bar screwed to the dial side of the pillar plate, across an opening round the third arbor, located by two steady pins.',sp:'No. 42063, complete with pins'},
    {k:'screws',t:'Lower train bridge screws',h:'42163',d:'Two screws into the pillar plate, their heads flush in counterbores (Ops. 7, 53).',sp:'Nos. 42163'},
    {k:'jewels',t:'Third and fourth lower jewels',h:'42161.tl J.tl 42161.fl J.fl',d:'Bar-hole jewels in their settings, sunk in counterbores in the bar, for the dial-side pivots of the third and fourth arbors.',sp:'Settings 42161 with their jewels'}],
  trainBridge:[{k:'bridge',t:'Upper train bridge',h:'42062',d:'The crescent plate over the train. It carries the centre and third wheel upper bushings; the balance cock, balance lower bridge, escape upper bridge and detent support block are mounted to it.',sp:'No. 42062'},
    {k:'screws',t:'Upper train bridge screws',h:'42055.tb',d:'Three screws, each into its pillar (Op. 14).',sp:'Nos. 42055'},
    {k:'bush',t:'Centre and third upper bushings',h:'42166 42167',d:'Bearings for the upper pivots of the centre and third arbors. They lie in the opening round the balance, so they can be oiled with the barrel bridge on (Op. 46).',sp:'Centre 42166 · third 42167'},
    {k:'blk',t:'Detent support block screw',h:'42056.blk',d:'Holds the detent support block under the train bridge: put in from above, through the bridge into the block, between its two positioning pins.',sp:'No. 42056'}],
  barrelBridge:[{k:'bridge',t:'Barrel bridge',h:'42061',d:'The large upper plate, on the train bridge, cut round the balance. It holds the upper pivots of the barrel and the fusee; the setup ratchet and the dust seal sit on top.',sp:'No. 42061'},
    {k:'screws',t:'Barrel bridge screws',h:'42055.bb 42055.bbp',d:'One screw into the barrel pillar and two into the upper train bridge.',sp:'Nos. 42055'},
    {k:'bush',t:'Barrel and fusee upper bushings',h:'42164.fu 42164.bu',d:'Bearings in the barrel bridge for the upper ends of the barrel and fusee arbors.',sp:'Nos. 42164'},
    {k:'stop',t:'Fusee winding stop',h:'42099',d:'A stud screwed into the barrel bridge’s underside (left-hand thread, Op. 42). The fusee’s stop-bar meets it at full wind.',sp:'No. 42099',figs:'12'}],
  lowerBridge:[{k:'bridge',t:'Balance lower bridge',h:'42065',d:'Two levels: a slab curved like a lens, and a lug at each end against the underside of the upper train bridge. It carries the balance staff’s lower jewel and endstone, the fourth wheel’s upper jewel and the train-blocking screw.',sp:'No. 42065, complete with pins'},
    {k:'screws',t:'Balance lower bridge screws',h:'42055.lb',d:'Two screws, put in from below through the lugs into the upper train bridge (Ops. 12, 50).',sp:'Nos. 42055'},
    {k:'balance',t:'Balance lower jewel and endstone',h:'42162.bl J.bl 42159.bl J.ble 20762.blc',d:'The balance staff’s lower pivot runs in an olive-hole jewel in the bridge; the endstone cap underneath, in a round counterbore, stops its end.',sp:'Setting 42162 with its jewel · cap 42159 with its jewel · screws 20762'},
    {k:'fourth',t:'Fourth wheel upper jewel',h:'42161.fu J.fu',d:'A bar-hole jewel in its setting, for the fourth arbor’s upper pivot.',sp:'Setting 42161 with its jewel'}],
  escBridge:[{k:'bridge',t:'Escape upper bridge',h:'42064',d:'A flat bar across the train bridge’s escape opening, its ends in seats in the bridge, with a round boss under its middle that holds the escape wheel’s upper jewel.',sp:'No. 42064, complete with pins'},
    {k:'screws',t:'Escape upper bridge screws',h:'20762.eb',d:'Two screws into the upper train bridge, their heads flush in the bar’s top (Op. 69).',sp:'Nos. 20762'},
    {k:'jewel',t:'Escape upper jewel and endstone',h:'42162.eu J.eu 42159.eu J.eue 20762.euc',d:'The escape arbor’s upper pivot runs in an olive-hole jewel pressed into the boss. The endstone cap over it, held by two screws, is milled or changed to set the endshake (Op. 69).',sp:'Setting 42162 with its jewel · cap 42159 with its jewel · screws 20762',figs:'86, 110'}],
  hands:[{k:'hour',t:'Hour hand',h:'42032',d:'Pressed on the hour wheel’s pipe (Op. 64); turns once in 12 hours.',sp:'No. 42032'},
    {k:'minute',t:'Minute hand',h:'42033',d:'Broached square, on the cannon pinion’s square below its bright end (Op. 64); turns once an hour.',sp:'No. 42033'},
    {k:'seconds',t:'Seconds hand',h:'42034',d:'On the fourth wheel’s arbor; turns once a minute, in half-second steps.',sp:'No. 42034, complete with pin'},
    {k:'wind',t:'Wind indicator hand',h:'42035',d:'On the wind indicator wheel’s pipe; shows the hours run since winding, from UP to DOWN.',sp:'No. 42035'}],
  motion:[{k:'cannon',t:'Cannon pinion',h:'42077',d:'A friction fit on the centre arbor (Op. 58), slipping when the hands are set. It turns once an hour with the minute hand, and its pipe ends above the dial in the square the key sets the hands by (Fig. 8).',sp:'No. 42077',figs:'8, 107'},
    {k:'minute',t:'Minute wheel',h:'42078',d:'Driven by the cannon pinion; its pinion drives the hour wheel. It turns on its post.',sp:'No. 42078, complete with pinion',figs:'107'},
    {k:'hour',t:'Hour wheel',h:'42080',d:'Turns free on the cannon pinion’s pipe (Op. 59), once in 12 hours, carrying the hour hand on its own pipe.',sp:'No. 42080',figs:'107'},
    {k:'wind',t:'Wind indicator wheel and pinion',h:'42081 42022',d:'The pinion on the dial end of the fusee arbor drives the wheel, which turns on its post and carries the wind indicator hand: 314° in 56 hours.',sp:'Wheel 42081 · pinion on the fusee arbor 42022',figs:'107'},
    {k:'key',t:'Winding key on the hands’ square',h:'42044',d:'Setting the hands while it runs, the winding key goes on the cannon pinion’s square above the dial and is turned by its shank, forward only: the minute hand on its marker half a minute behind the master’s, then on as its second hand passes 60 (Sec. III, “Setting While Running”; Fig. 8). Shown only while the hands are being set.',sp:'No. 42044',figs:'8'}]};
/* the tables the rest of app.js reads: a piece's card, colour and entry under its key (part.k), its part's PHN its lines' pieces. A piece's colour in Colour by part: a shade of its part's,
   lighter and darker in turn and its hue a little round, so the pieces of a part tell apart and still read as one part */
const INFO={},PCOL={},PRI={},PCE={},PHN={},PGRP=PG.map(g=>[g,[]]),kp=k=>k.split('.')[0];   /* kp: the part a key is or belongs to */
for(const[k,p]of Object.entries(PARTS)){INFO[k]=[p.t,p.d,p.sp];if(p.c)PCOL[k]=p.c;if(p.pri)PRI[k]=p.pri;PGRP[p.g][1].push(k);}
const shade=(c,i)=>{if(!i)return c;const o=new THREE.Color(c),h={};o.getHSL(h);o.setHSL((h.h+(i%2?1:-1)*0.035*Math.ceil(i/2)+1)%1,h.s,clamp(h.l+[0.17,-0.17,0.3,-0.3,0.09,-0.09,0.24,-0.24,0.37,-0.37][(i-1)%10],0.14,0.88));return '#'+o.getHexString();};
for(const[p,ps]of Object.entries(PIECES)){const q=PARTS[p];q.pcs=ps;PHN[p]={};ps.forEach((c,i)=>{const k=p+'.'+c.k;INFO[k]=[c.t,c.d,c.sp];PCE[k]=c;if(q.c)PCOL[k]=shade(q.c,i);for(const h of c.h.split(' '))PHN[p][h]=PHN[p][h]||c.k;});}
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
  const R=mv.userData.R,P=mv.userData.parts;if(/[?&]qa\b/.test(location.search)){window.__mv=mv;window.__parts=PARTS;window.__r=r;window.__renders=()=>renders;window.__lp=()=>({ph:lpPh,end:lpEnd,cu:cuOn,now:performance.now()});window.__proj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();return pts.map(p=>{const v=new THREE.Vector3(...p);mv.localToWorld(v);v.project(c2);return[(v.x+1)/2*W,(1-v.y)/2*Hh];});};window.__unproj=(pts,yaw,pitch,dist,fov)=>{const c2=new THREE.PerspectiveCamera(fov,W/Hh,1,6000),t=new THREE.Vector3(0,-26,0);mv.localToWorld(t);const cp=Math.cos(pitch);c2.position.set(t.x+dist*cp*Math.sin(yaw),t.y+dist*Math.sin(pitch),t.z+dist*cp*Math.cos(yaw));c2.lookAt(t);c2.updateMatrixWorld();c2.updateProjectionMatrix();
    const inv=new THREE.Matrix4().copy(mv.matrixWorld).invert();return pts.map(([sx,sy,h])=>{const ndc=new THREE.Vector2(sx/W*2-1,-(sy/Hh*2-1));const rc=new THREE.Raycaster();rc.setFromCamera(ndc,c2);
      const o=rc.ray.origin.clone().applyMatrix4(inv),dd=rc.ray.direction.clone().transformDirection(inv);const tt=(h-o.y)/dd.y;return[o.x+dd.x*tt,o.z+dd.z*tt];});};
  window.__camInfo=()=>JSON.stringify({fov:cam.fov,aspect:cam.aspect,pos:cam.position.toArray().map(v=>+v.toFixed(2)),tgt:C.target.toArray().map(v=>+v.toFixed(2)),C:{yaw:C.yaw,pitch:C.pitch,dist:C.dist},W,Hh});
  window.__cam=(yaw,pitch,dist,fov)=>{cam.fov=cur.fov=tgt.fov=fov;cam.updateProjectionMatrix();goCam({yaw,pitch,dist,target:mvL(0,-26,0)});G.dist=dist;C.dist=dist;C.yaw=G.yaw;C.pitch=pitch;camFree=false;};
  window.__look=(yaw,pitch,dist,x,y,z)=>{goCam({yaw,pitch,dist,target:mvL(x,y,z)});};}
  $('#srcKey').innerHTML=Object.values(SRC).map(([t,c,d])=>`<span title="${t}: ${d}"><i style="--ps:${c}"></i>${t}</span>`).join('');
  const partOf=o=>{while(o){if(o.userData&&o.userData.partName)return o.userData.partName;o=o.parent;}return null;};
  /* a mesh's key: its piece (part.k) where its part has pieces: the nearest pc tag up to the part, else the piece listing the nearest parts-list line; its part's otherwise */
  const pkOf=o=>{const p=o.userData.part;if(!PHN[p])return p;let h=null;for(let q=o;q;q=q.parent){const u=q.userData;if(u.pc)return p+'.'+u.pc;if(h==null&&u.hn)h=u.hn;if(u.partName)break;}return PHN[p][h]?p+'.'+PHN[p][h]:p;};
  const shown=o=>{for(;o;o=o.parent)if(!o.visible)return false;return true;};   /* r128's raycaster ignores visibility: a mesh in a hidden group (the hand-setting key, another dial style's hands) must not take a click or hide a label */
  /* a mesh casts a shadow only when its radius spans SHK texels of the shadow map (shThr, set as the shadow camera follows the view): smaller shadows were a
     few texels at most, each an extra draw call. Far views drop the screws and pins (under about 1.5 mm); close-ups keep them. Instanced meshes (the chain) always cast */
  BX.root.updateMatrixWorld(true);const wsc=new THREE.Vector3(),rad=o=>{if(o.isInstancedMesh)return 1e9;const g=o.geometry,b0=g.boundingSphere;g.computeBoundingSphere();const r=g.boundingSphere.radius;g.boundingSphere=b0;if(!(r>0))return 1e9;o.getWorldScale(wsc);return r*Math.max(wsc.x,wsc.y,wsc.z);};   /* three computes its own bounding sphere when it first needs it, as before; geometries rebuilt as they move (hairspring, passing spring) start empty, and always cast */
  const SHK=6;let shThr=SHK*2*scam.right/key.shadow.mapSize.x;const castOn=m=>{m.castShadow=!!m.userData.cs&&m.userData.rad>=shThr;};
  const lpOf=o=>{for(;o&&o!==mv;o=o.parent)if(o.userData.lp)return o.userData.lp;return '';};   /* the load-path tag (movement.js) of a mesh or the nearest group above it */
  const MVM=[];mv.traverse(o=>{if(o.isMesh){o.userData.part=partOf(o);o.userData.pk=pkOf(o);o.userData.lpk=lpOf(o);o.userData.mat0=o.material;o.receiveShadow=true;o.userData.rad=rad(o);MVM.push(o);}});
  BOXM.forEach(o=>{o.userData.part=partOf(o);o.userData.pk=o.userData.part;o.userData.mat0=o.material;o.receiveShadow=true;o.userData.rad=rad(o);o.userData.cs=o.material!==M.glass;castOn(o);});
  /* a frame: rendered, drawn (tinted or in ink), or rendered with Edges (the drawing's lines over it, the movement's only) (makeInk in core.js, set up the first time it is asked for) */
  let ink=null;const INKM=[...MVM,...BOXM];BOXM.forEach(o=>o.userData.inkBox=true);INKM.forEach(inkTag);   /* Edges' ids, up front (inkTag, core.js) */
  const INKH=[sh,...MVM.filter(o=>o.userData.decal)];   /* left out of Edges' ids: the floor shadow, and the engravings, which would outline themselves on their plates */
  /* the static pieces drawn merged (drawMerge, core.js) while Performance mode is on (Display; on by default, merge=0 in the hash when off: every piece then draws
     itself, as before the merge): a merged piece is on layer 2, which the raycasters see too. The world matrices are brought up to date once, before
     the copies are put in place, and not again for each of the frame's passes */
  const DM=drawMerge(scene,INKM);if(/[?&]qa\b/.test(location.search))window.__dm=DM;
  const paint=()=>{scene.updateMatrixWorld();DM.sync(st.merge);const au=scene.autoUpdate;scene.autoUpdate=false;
    if(st.draw)(ink||(ink=makeInk(r))).render(scene,cam,DM.all);else if(st.edges)(ink||(ink=makeInk(r))).lines(scene,cam,DM.all,INKH);else r.render(scene,cam);scene.autoUpdate=au;};
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
  const st={drive:false,mwOn:false,see:false,colr:false,csrc:false,draw:false,edges:true,shadows:false,merge:true,op:{},hid:new Set(),iso:null,focus:null,pick:null,labels:false,rock:false,latch:false,spin:false,lp:true,cu:true,ssx:false,speed:1,sound:true,view:'dial',tour:-1};
  const FOV0=cam.fov,cur={lift:0,flip:0,explode:0,lidM:0,lidT:0,dev:0,fov:FOV0},tgt={...cur};let devShown=false;   /* devShown: the train still out of place (laid out, or on its way back), so the real plates stay hidden */
  /* any input keeps the stage drawing for 0.6 s (the loop otherwise skips frames in which nothing moves) */
  /* a short note in the HUD, for a few seconds */
  let noteT=0,noteTx='';const hudNote=t=>{noteTx=t;noteT=performance.now()+3000;};
  let wakeT=0,hashReady=false,hashT=0,hashSeen='',handsSet=false;const wake=()=>{wakeT=performance.now()+600;writeHash();};   /* any change is also written to the URL (writeHash) */
  /* the time kept: Greenwich (navy chronometers were kept on GMT) or the viewer's local time; tzOff() is its offset from UTC in seconds */
  let tz='gmt';const tzOff=()=>tz==='gmt'?0:-new Date().getTimezoneOffset()*60;
  let hrs=20,winding=false,kw=null,rateK=1,escK=1,rateW=1,rErr=0,tSim=Date.now()/1000+tzOff(),tM=0,slip=0,ks=null,sw=null,units='mm',book=[],pend=new Set(),bookDay=0,wasHeld=false,tVis=0,rockT=0,roll=0,pitch=0,latchK=0,lastE=null;
  /* the master time tM: a perfect clock, the time signal the dial is compared with. It runs at the model's speed, also while the chronometer stands. slip: how far the hour and
     minute hands have been turned on the centre arbor with the key (s; the cannon pinion slips), which leaves the second hand alone. dialRead(): the time the hands show, the
     seconds from the second hand (continuous: as a comparator reads it) and the minutes from the minute hand, taken within 6 h of the master (the dial has 12 hours) */
  tM=tSim;
  const dialRead=()=>{const sT=tSim+(H.bOff+H.eOff)/2,ss=((sT%60)+60)%60,r=Math.round((sT+slip-ss)/60)*60+ss,e=r-tM;return tM+(((e+21600)%43200)+43200)%43200-21600;};
  const fmtErr=e=>{const a=Math.abs(e),h=Math.floor(a/3600),m=Math.floor(a%3600/60),x=Math.round((a%60)*2)/2;return(e<0?'−':'+')+(h?h+' h ':'')+(h||m?m+' min ':'')+(h?'':x+' s');};   /* to the half second, as a navigator records it */
  /* colour mode: one flat CAD-style colour per part, or per source (Colour by source: where its shape and size come from, SRC); the part labels double as the legend */
  const COLM=new Map();
  const colOf=(p,k)=>{if(st.csrc){const s=PCE[k]&&PCE[k].src||PARTS[p]&&PARTS[p].src;return s&&SRC[s][1];}return PCOL[k]||PCOL[p];};   /* k: the mesh's key, its piece's colour or source where it has one */
  function colourOf(m0,p,pk){const col=p&&colOf(p,pk);if(!col||p==='dial'||m0.transparent||!m0.color)return m0;const k=m0.uuid+pk+(st.csrc?':s':'');let c=COLM.get(k);
    if(!c){c=m0.clone();c.userData={};c.map=null;c.normalMap=null;c.color=sc(col);if('metalness'in c){c.metalness=0.1;c.roughness=0.55;}if(c.emissive)c.emissive.setRGB(0,0,0);
      patchSection(c,!!m0.userData.secCap);c.userData.side0=m0.userData.side0??m0.side;c.side=m0.side;c.clippingPlanes=[...(m0.clippingPlanes||[])];COLM.set(k,c);}return c;}
  /* per-part opacity, set from the right-click menu */
  const FADE=new Map();
  function fadeOf(m0,p,op){const k=m0.uuid+p;let f=FADE.get(k);
    if(!f){f=m0.clone();f.userData={inkDecal:m0.userData.inkDecal};f.transparent=true;f.depthWrite=false;patchSection(f,false);f.userData.side0=m0.userData.side0??m0.side;f.side=m0.side;f.clippingPlanes=[...(m0.clippingPlanes||[])];FADE.set(k,f);}
    f.opacity=(m0.opacity??1)*op;return syncMat(f,m0);}
  const opOf=m=>st.op[m.userData.pk]??st.op[m.userData.part];   /* a piece's own opacity, else its part's */
  const base=m=>{const p=m.userData.part,k=m.userData.pk,m0=st.colr||st.csrc?colourOf(m.userData.mat0,p,k):m.userData.mat0,op=opOf(m);return op!=null&&op<1?fadeOf(m0,k,op):m0;};
  const fin=m=>st.draw?drawOf(base(m)):base(m);   /* the drawing (st.draw 'tint' or 'ink'): the wash copy of whatever the part shows; see-through parts stay ghosts, drawn in outline */
  /* the keys in st.pick, st.focus, st.hid, st.iso and st.op are parts or pieces (part.k), a part's covering its pieces. anyOf: the set holds part p or a piece of it; inK: it holds mesh m's part or piece */
  const anyOf=(s,p)=>!!s&&[...s].some(k=>kp(k)===p),inK=(s,m)=>s.has(m.userData.part)||s.has(m.userData.pk);
  const isoOut=(p,k)=>!!st.iso&&!st.iso.has(p)&&!(k?st.iso.has(k):anyOf(st.iso,p))&&!(p==='mainspring'&&anyOf(st.iso,'barrel'));   /* isolated: only the parts and pieces in st.iso are drawn (the mainspring with its barrel); k: a mesh's key, none for a part as a whole (shown while any piece of it is) */
  const isoDrop=p=>{if(st.iso){st.iso.delete(p);if(!st.iso.size)st.iso=null;}};   /* the last isolated part hidden: the rest of the model comes back */
  const opHide=m=>{const u=m.userData;return st.hid.has(u.part)||st.hid.has(u.pk)||opOf(m)===0||isoOut(u.part,u.pk);};
  /* the mainspring is drawn only when the barrel is opened up: drive-train mode, any cross-section, the barrel or spring picked or isolated, or the barrel faded or hidden */
  const msShown=()=>{const foc=st.pick?new Set([st.pick]):st.focus,ob=Object.keys(st.op).some(k=>kp(k)==='barrel'&&st.op[k]<1);return st.drive||secMode!=='off'||anyOf(st.hid,'barrel')||ob||anyOf(foc,'mainspring')||anyOf(foc,'barrel')||anyOf(st.iso,'mainspring')||anyOf(st.iso,'barrel');};
  /* the load path (Load path in colour, Winding): while winding (lpPh 'w') the sustaining spring drives the fusee wheel (rose), pushing off its ratchet, which the sustaining
     pawl holds (teal); for 2 s after the key lets go (lpPh 'r') the drive is the mainspring's again: barrel, chain, fusee, winding pawls, sustaining ratchet, spring, fusee wheel. A tinted copy of what the part shows: its colour drawn
     toward the tint and a little of it lit, so it holds under the drawing (drawOf keeps the colour, not the glow) */
  let lpPh='',lpEnd=0;const LPC={d:sc('#e0306a'),h:sc('#0e9f92')},TINT=new Map();   /* rose and teal: hues no metal in the movement has */
  const lpCol=m=>{const k=m.userData.lpk;if(!st.lp||!lpPh||!k)return null;return lpPh==='w'?(k==='s'?'d':k==='h'||k==='r'?'h':null):(k==='h'?null:'d');};
  function tintOf(m0,c){if(!m0.color)return m0;const k=m0.uuid+c;let t=TINT.get(k);
    if(!t){t=m0.clone();t.userData={inkDecal:m0.userData.inkDecal};patchSection(t,!!m0.userData.secCap);t.userData.side0=m0.userData.side0??m0.side;t.side=m0.side;t.clippingPlanes=[...(m0.clippingPlanes||[])];TINT.set(k,t);}
    if(t.map!==m0.map){t.map=m0.map;t.needsUpdate=true;}t.color.copy(m0.color).lerp(LPC[c],0.8);if(t.emissive){t.emissive.copy(LPC[c]);t.emissiveIntensity=0.25;}if('metalness'in t){t.metalness=Math.min(m0.metalness,0.2);t.roughness=Math.max(m0.roughness,0.5);}t.opacity=m0.opacity??1;return t;}   /* less metal, so the colour shows rather than the room it reflects */
  /* a movement mesh drawn see-through (a ghost): plates with See-through, the laid-out view's schematic plates, the barrel's wall in drive mode, and whatever is outside the focus foc */
  const ghOf=(m,foc)=>{const p=m.userData.part;return !(kw&&m.userData.wstop)&&((st.see&&PLATES.has(p))||m.userData.devPlate||(st.drive&&m.userData.driveGhost)||(foc&&!inK(foc,m)&&!(p==='mainspring'&&anyOf(foc,'barrel'))));};
  function look(){wake();INK.ink.value=st.draw==='ink'?1:0;
    const foc=st.pick?new Set([st.pick]):st.focus,dvOn=(st.tour<0&&st.view==='laidout')||devShown;   /* laid out: the real plates' holes no longer meet the arbors; schematic ones stand in */
    for(const m of MVM){const p=m.userData.part;let vis=true;
      if(((st.drive||dvOn)&&DRIVE_HIDE.has(p))||(st.drive&&!st.mwOn&&(p==='motion'||p==='hands')))vis=false;
      if(m.userData.onlyDrive&&!msShown())vis=false;
      if((st.drive||dvOn)&&m.userData.driveHide)vis=false;if(m.userData.devPlate&&(!dvOn||st.drive))vis=false;
      const gh=ghOf(m,foc);
      if(m.userData.noShadow&&gh)vis=false;
      m.visible=vis&&!opHide(m);const lc=!gh&&lpCol(m);m.material=gh?ghostOf(base(m)):lc?(st.draw?drawOf(tintOf(base(m),lc)):tintOf(base(m),lc)):fin(m);m.userData.cs=!gh&&!m.userData.noShadow;castOn(m);}
    for(const m of BOXM){m.visible=!st.drive&&!dvOn&&!opHide(m)&&!(ks&&m.userData.bezel);const gh=foc&&!inK(foc,m)&&m.userData.mat0!==M.glass;m.material=gh?ghostOf(base(m)):fin(m);m.userData.cs=!gh&&m.userData.mat0!==M.glass;castOn(m);}
    sh.visible=!st.drive&&!dvOn&&!st.draw&&!st.iso;
    /* Shadows (off by default): the key light's shadow map, an extra pass over every caster (about 380 draw calls and all the triangles again) and a costlier shader.
       The floor's shadow (sh) is a texture, always there. Turned off, the map (2048 px, 1024 on phones) is freed (three makes it again when it is next needed) */
    if(key.castShadow!==st.shadows){key.castShadow=st.shadows;if(!st.shadows&&key.shadow.map){key.shadow.map.dispose();key.shadow.map=null;}}
    document.querySelectorAll('#views button').forEach(b=>{b.disabled=st.drive&&(b.dataset.v==='box'||b.dataset.v==='dial');});
    $('#mwWrap').classList.toggle('hidden',!st.drive);
    $('#driveOn').checked=st.drive;
    cv.setAttribute('aria-label',`3D working model of a marine chronometer. ${st.tour>=0?`Walkthrough step ${st.tour+1} of ${TOUR.length}: ${TOUR[st.tour].t}.`:VIEW_DESC[st.view]||''}${st.drive?' Moving parts only.':''} Arrow keys turn it, plus and minus zoom, 0 resets the view.`);   /* for screen readers: what the stage shows */
    $('#ghost').checked=st.see;$('#draw').checked=st.draw==='tint';$('#drawInk').checked=st.draw==='ink';$('#edges').checked=st.edges;$('#edges').disabled=!!st.draw;$('#shadows').checked=st.shadows;$('#merge').checked=st.merge;stage.classList.toggle('colr',st.colr);stage.classList.toggle('csrc',st.csrc);$('#srcKey').classList.toggle('hidden',!st.csrc);$('#colr').checked=st.colr;$('#colrSrc').checked=st.csrc;stage.classList.toggle('draw',!!st.draw);partsSync();
  }

  /* ---------- the sustaining spring close up (Close-up, Winding) ----------
     While winding and for 2 s after (lpPh), the fusee wheel's maintaining work drawn again into the box #cu, on the stage's own canvas (the page keeps to two WebGL contexts):
     only its parts (layer 1: the fusee wheel, the sustaining spring, ratchet and pawl, the fusee's winding ratchet), seen from the train bridge's side in the movement's own frame,
     so it holds whatever the view, the sustaining ratchet see-through so the spring under it shows, tinted as the load path. Under it, how long the spring can still drive the
     train: R.ssD of R.SMAX, the model's 10 minutes (movement.js) */
  const cuEl=$('#cu'),cuG=$('#ssGauge'),cuX=$('#cuX'),cam2=new THREE.PerspectiveCamera(30,1,1,2000),CUP=new Set(['gw','sspring','sratchet','spawl']);
  const CU=MVM.filter(m=>CUP.has(m.userData.part)||m.userData.hn==='42013');CU.forEach(m=>m.layers.enable(1));scene.traverse(o=>{if(o.isLight)o.layers.enable(1);});cam2.layers.set(1);
  const CUG=new Set(CU.filter(m=>m.userData.part==='sratchet'&&m.userData.mat0===M.gilt)),CUGM=new Map();   /* the sustaining ratchet wheel and its web, drawn at 45% */
  const cuGhost=m0=>{let g=CUGM.get(m0);if(!g){g=m0.clone();g.userData={};g.transparent=true;g.opacity=0.45;g.depthWrite=false;patchSection(g,false);g.clippingPlanes=[...(m0.clippingPlanes||[])];CUGM.set(m0,g);}return syncMat(g,m0);};
  let cuOn=false,cuS='';const cuBg=new THREE.Color(),cuCC=new THREE.Color(),cuT=new THREE.Vector3(),cuE=new THREE.Vector3();
  const cuRect=()=>{const b=cuEl.getBoundingClientRect(),s=stage.getBoundingClientRect();return{x0:b.left-s.left,y0:b.top-s.top,x1:b.right-s.left,y1:b.bottom-s.top};};
  function cuShow(){cuOn=st.cu&&!!lpPh;cuEl.classList.toggle('hidden',!cuOn);cuX.textContent=st.ssx?'spring ×20':'';cuS='';}
  function cuDraw(){if(!cuOn)return;const b=cuRect(),gH=cuG.offsetHeight,tH=18,w=b.x1-b.x0-2,h=b.y1-b.y0-2-gH-tH;if(w<20||h<20)return;   /* between the title and the gauge */
    const ul=Math.hypot(L.Fu[0],L.Fu[1]),ux=L.Fu[0]/ul,uz=L.Fu[1]/ul;   /* outward from the movement's centre through the fusee */
    cuT.set(L.Fu[0]+ux*2,-8.6,L.Fu[1]+uz*2);cuE.set(L.Fu[0]+ux*21,-8.6-56,L.Fu[1]+uz*21);mv.localToWorld(cuT);mv.localToWorld(cuE);
    cam2.position.copy(cuE);cam2.up.set(-ux,0,-uz).transformDirection(mv.matrixWorld);cam2.lookAt(cuT);cam2.aspect=w/h;cam2.updateProjectionMatrix();
    const keep=CU.map(m=>m.material);for(const m of CU){const lc=lpCol(m),b0=base(m),t=lc?tintOf(b0,lc):b0;m.material=CUG.has(m)?cuGhost(t):t;}
    const au=r.shadowMap.autoUpdate,ca=r.getClearAlpha();r.getClearColor(cuCC);r.shadowMap.autoUpdate=false;cuBg.set(getComputedStyle(stage).getPropertyValue('--card').trim()||'#ffffff');
    r.setScissorTest(true);r.setViewport(b.x0+1,Hh-b.y1+1+gH,w,h);r.setScissor(b.x0+1,Hh-b.y1+1,w,h+gH+tH);r.setClearColor(cuBg,1);r.clear();r.render(scene,cam2);
    r.setClearColor(cuCC,ca);r.setScissorTest(false);r.setViewport(0,0,W,Hh);r.shadowMap.autoUpdate=au;CU.forEach((m,i)=>m.material=keep[i]);
    const left=10*clamp(1-R.ssD/R.SMAX,0,1),mn=Math.floor(left+1e-9),sc=Math.min(59,Math.floor((left-mn)*60)),run=lpPh!=='w';
    const t=run?'Key let go: the mainspring drives the train again, through the fusee, and loads the sustaining spring<br><em class="d">the mainspring’s drive</em>':`<b>${mn} min ${String(sc).padStart(2,'0')} s</b> of drive left <small>(manual: 5 to 10 min)</small><br><em class="d">spring drives</em> <em class="h">ratchet and pawl hold</em>`;
    const k=t+run;if(k!==cuS){cuS=k;cuG.classList.toggle('run',run);cuG.querySelector('b').style.width=(left*10).toFixed(1)+'%';cuG.querySelector('span').innerHTML=t;}}
  /* ---------- camera ---------- */
  const C={yaw:0.75,pitch:0.42,dist:640,target:new THREE.Vector3(0,-20,0)},G={yaw:C.yaw,pitch:C.pitch,dist:C.dist,target:C.target.clone(),follow:null};
  let W=1,Hh=1;const resize=()=>{W=stage.clientWidth;Hh=stage.clientHeight;r.setSize(W,Hh,false);cam.aspect=W/Hh;cam.updateProjectionMatrix();};new ResizeObserver(resize).observe(stage);resize();
  const mvL=(x,y,z)=>{const v=new THREE.Vector3(x,y,z);return()=>mv.localToWorld(v.clone());};
  const fixed=(x,y,z)=>()=>new THREE.Vector3(x,y,z);
  /* camera targets on the arbors they look at (L, movement.js), so they follow the layout: the escapement views between the balance and the escape arbor */
  const VIEWS={
    box:{lidM:0,lidT:0,lift:0,flip:0,explode:0,yaw:0.72,pitch:0.4,dist:640,target:fixed(0,-22,0)},
    dial:{lidM:1,lidT:1,lift:0,flip:0,explode:0,yaw:0.3,pitch:1.02,dist:330,target:fixed(0,-15,0)},
    movement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:-0.62,pitch:0.64,dist:235,target:mvL(0,-19,2)},
    train:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:0.2,pitch:1.05,dist:210,target:mvL(0,-12,8),see:true},
    escapement:{lidM:1,lidT:1,lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:78,target:mvL((L.B[0]+L.E[0])/2,-18.5,(L.B[1]+L.E[1])/2),see:true},   /* from the pillar-plate side: the balance is then behind the escapement, not in front of it */
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
  /* where the view has been: ↶ (Backspace) and ↷ (Shift-Backspace) step back and forward through the places a view button, Reset, a zoom to a part, a panel's Show button
     or winding left. jump(f) moves the camera with f and keeps the place it left, unless f didn't move it. The walkthrough keeps its own steps; links and the opening view aren't kept */
  const HB=[],HF=[],histEl=$('#hist'),hB=$('#hBack'),hF=$('#hFwd');
  const pose=g=>({view:st.view,see:st.see,yaw:g?G.yaw:C.yaw,pitch:g?G.pitch:C.pitch,dist:g?G.dist:C.dist,follow:G.follow,tgt:G.target.clone(),pan:panO.clone()});
  const same=(a,b)=>!!a&&!!b&&a.view===b.view&&a.follow===b.follow&&Math.abs(a.yaw-b.yaw)<0.02&&Math.abs(a.pitch-b.pitch)<0.02&&Math.abs(a.dist/b.dist-1)<0.02&&a.pan.distanceTo(b.pan)<0.5&&(!!a.follow||a.tgt.distanceTo(b.tgt)<0.5);
  function histSync(){hB.disabled=!HB.length;hF.disabled=!HF.length;const on=(HB.length||HF.length)&&st.tour<0;if(on&&histEl.classList.contains('hidden'))hintOff();histEl.classList.toggle('hidden',!on);}
  function jump(f){const p=pose();f();if(st.tour>=0||!hashReady||same(p,pose(true)))return;if(!same(p,HB[HB.length-1])){HB.push(p);if(HB.length>30)HB.shift();}HF.length=0;histSync();}
  function histGo(from,to){if(st.tour>=0||!from.length)return;to.push(pose());const p=from.pop();st.see=p.see;if(p.view!==st.view)setView(p.view,true);else look();
    G.yaw=C.yaw+((((p.yaw-C.yaw+Math.PI)%TAU)+TAU)%TAU-Math.PI);G.pitch=p.pitch;G.dist=p.dist;G.follow=p.follow;if(!p.follow)G.target.copy(p.tgt);panO.copy(p.pan);camFree=false;histSync();}
  hB.addEventListener('click',()=>histGo(HB,HF));hF.addEventListener('click',()=>histGo(HF,HB));
  /* double-click (double-tap) a part: the camera closes in to fit it (never backing away from a part larger than the view) and turns about it, following it as the movement lifts or spreads; 0 or Reset gives back the view */
  const fb=new THREE.Box3(),fbb=new THREE.Box3();
  function focusPart(p,o){fb.makeEmpty();BX.root.updateMatrixWorld();BX.root.traverse(m=>{if(m.isMesh&&m.userData.part===p&&shown(m)&&m.geometry.attributes.position){if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();fbb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);fb.union(fbb);}});
    if(fb.isEmpty())return;const c=fb.getCenter(new THREE.Vector3()),rad=Math.max(fb.getSize(new THREE.Vector3()).length()/2,1),lc=o.worldToLocal(c.clone()),v=cam.fov*Math.PI/360,hv=Math.atan(Math.tan(v)*cam.aspect);
    jump(()=>{G.follow=()=>o.localToWorld(lc.clone());panO.set(0,0,0);G.yaw=C.yaw;G.pitch=C.pitch;G.dist=clamp(Math.min(rad/Math.tan(Math.min(v,hv))*1.05,C.dist),30,1500);camFree=false;});}
  /* the hint under the stage stays until the model is first tapped, dragged, scrolled or given a key (or a card, help or the walkthrough covers it) */
  const hintOff=()=>{$('#hint').style.opacity=0;};for(const ev of['pointerdown','wheel','keydown'])cv.addEventListener(ev,hintOff,{once:true,passive:true});
  /* pointer: orbit, pinch, tap to pick; on touch, a long press (500 ms, barely moving) opens the fade/hide menu, since iOS fires no contextmenu */
  const ptrs=new Map();let pinch=0,down=null,rMoved=0,lpT=0,lpAt=-1e9,lastTap=null;const lpStop=()=>{clearTimeout(lpT);lpT=0;};
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
    if(wasTap&&e.type==='pointerup'){const t=e.timeStamp;if(lastTap&&t-lastTap.t<400&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){lastTap=null;dblPick(e);}else{lastTap={t,x:e.clientX,y:e.clientY};pick(e);}}   /* a second tap or click within 0.4 s, in the same place: a double (timed by the events, not by when they are handled: opening the first part's card can keep a slow device busy) */
    if(!ptrs.size)down=null;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  $('#info').addEventListener('pointerup',e=>{if(e.button===0&&lastTap&&e.timeStamp-lastTap.t<400&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<24){const t=lastTap;lastTap=null;dblPick({clientX:t.x,clientY:t.y});}});   /* the card the first click opened may lie under the second: still a double on the part */
  cv.addEventListener('wheel',e=>{e.preventDefault();C.dist=G.dist=clamp(C.dist*Math.exp(e.deltaY*0.0012),30,1500);},{passive:false});
  const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();ray.layers.enable(2);   /* layer 2: the pieces drawn merged (drawMerge) */
  /* what a click passes through: what is faded below half, glass, or see-through as it would be with nothing picked; so with a part or piece picked, the ghosted rest still takes a click */
  const through=m=>{const o=opOf(m),m0=m.userData.mat0;if(o!=null&&o<0.5||m0.transparent&&m0.opacity<0.5)return true;return m.userData.inkBox?!!(st.focus&&!inK(st.focus,m)):!!ghOf(m,st.focus);};
  function hitAt(e){const rc=cv.getBoundingClientRect();ndc.set((e.clientX-rc.left)/rc.width*2-1,-(e.clientY-rc.top)/rc.height*2+1);ray.setFromCamera(ndc,cam);
    const hits=ray.intersectObjects([BX.root],true).filter(h=>shown(h.object)&&h.object.userData.part&&!through(h.object));
    return hits.find(h=>INFO[h.object.userData.part])||null;}
  function pick(e){if(help.classList.contains('on')){showHelp(false);return;}const hit=hitAt(e);if(typeof MAKER!=='undefined'&&MAKER.measuring()){MAKER.measureHit(hit);return;}if(!hit){closeInfo();return;}showPart(hit.object.userData.pk);}   /* the piece, where its part has pieces */
  function dblPick(e){if(help.classList.contains('on'))return;const hit=hitAt(e);if(hit){const p=hit.object.userData.pk;if(st.pick!==p)showPart(p);focusPart(hit.object.userData.part,hit.object);}else if(st.tour<0)jump(()=>setView(st.view,true));}
  /* the cards' sizes in millimetres or in inches, the manual's unit (a range converts both ends; areas, volumes and sizes already in inches are left) */
  const U=t=>units==='in'?t.replace(/(\d+(?:\.\d+)?)(?:\s?[–-]\s?(\d+(?:\.\d+)?))?\s?mm(?![²³\w])/g,(m,a,b)=>(a/25.4).toFixed(3)+(b?'–'+(b/25.4).toFixed(3):'')+' in'):t;
  /* a piece's card: its own text, and its source, note and figures where it has them, else its part's; a line up to its part. A part with pieces lists them, each a link to its card */
  function showPart(p){showHelp(false);const pp=kp(p);if(typeof MAKER!=='undefined')setTimeout(()=>MAKER.card(p),0);st.hid.delete(p);st.hid.delete(pp);if(st.iso)st.iso.add(p);st.pick=p;look();let[t,d,sp]=INFO[p];d=U(d);sp=U(sp||'');
    const info=$('#info');info.querySelector('h3').textContent=t;info.querySelector('p').textContent=d;info.querySelector('.spec').textContent=sp||'';const q=PARTS[pp],c=PCE[p]||{},src=c.src||q.src,sn=c.src?c.sn:q.sn,figs=c.figs??q.figs;
    info.querySelector('.src').innerHTML=src?`<i style="--ps:${SRC[src][1]}"></i>${SRC[src][0]}${pp!==p&&!c.src?` (the ${q.t.toLowerCase()} as a whole)`:''}${sn?': '+U(sn):''}${figs?`. Figs. ${figs}`:''}.`:'';   /* a piece without a source of its own: its part's, said so */
    const lk=k=>`<button data-p="${k}">${INFO[k][0]}</button>`;info.querySelector('.of').innerHTML=pp!==p?`Part of: ${lk(pp)}`:q.pcs?'Its pieces: '+q.pcs.map(x=>lk(pp+'.'+x.k)).join(', '):'';info.classList.add('on');hintOff();}
  $('#info .of').addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(b&&Object.prototype.hasOwnProperty.call(INFO,b.dataset.p))showPart(b.dataset.p);});
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
    const hit=hits.find(h=>!(h.object.material.transparent&&h.object.material.opacity<0.5))||hits.find(h=>opOf(h.object)!=null);
    if(!hit&&!st.hid.size&&!st.iso){closeOpm();return;}
    opPart=hit?hit.object.userData.pk:null;opm.classList.add('on');opRender();
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
    if((e.key==='p'||e.key==='P')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)&&!$('#about').open&&panelSide())pnb.click();
    if(e.key==='Backspace'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)&&!$('#about').open){e.preventDefault();if(e.shiftKey)histGo(HF,HB);else histGo(HB,HF);}   /* back and forward through the places the view has been */
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
      else if(e.key==='0'){e.preventDefault();jump(()=>setView(st.view,true));}}});

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
  document.querySelectorAll('#views button').forEach(b=>b.addEventListener('click',()=>{closeInfo();jump(()=>setView(b.dataset.v));}));
  document.querySelectorAll('#speeds button').forEach(b=>b.addEventListener('click',()=>setSpeed(parseFloat(b.dataset.v))));
  $('#driveOn').addEventListener('change',e=>{st.drive=e.target.checked;closeInfo();setView(st.drive?(st.view==='box'||st.view==='dial'?'movement':st.view):'dial');});
  /* about: sources and method in a dialog */
  const about=$('#about'),aboutOpen=()=>{if(about.showModal)about.showModal();else about.setAttribute('open','');};$('#aboutBtn').addEventListener('click',aboutOpen);
  about.addEventListener('click',e=>{if(e.target===about)about.close();});
  $('#mwOn').addEventListener('change',e=>{st.mwOn=e.target.checked;look();});
  /* Remember settings (Display; off by default): only with it on (cm-remember) does this browser keep anything for the next visit. Off, nothing is stored and what was is cleared at load */
  const RK=['cm-set','cm-theme','cm-open','cm-state'];let REM=false;try{REM=localStorage.getItem('cm-remember')==='1';if(!REM)RK.forEach(k=>localStorage.removeItem(k));}catch(_){}
  const lsGet=k=>{if(!REM)return null;try{return localStorage.getItem(k);}catch(_){return null;}},lsSet=(k,v)=>{if(!REM)return;try{localStorage.setItem(k,v);}catch(_){}};
  /* settings remembered, as are the theme and the open sections: plate finish, dial, balance and the last view (applied at load, beside the hash) */
  const SET=(()=>{try{const o=JSON.parse(lsGet('cm-set')||'{}');return o&&typeof o==='object'?o:{};}catch(_){return{};}})(),keep=(k,v)=>{SET[k]=v;lsSet('cm-set',JSON.stringify(SET));};
  units=SET.units==='in'?'in':'mm';
  document.querySelectorAll('#units button').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.v===units?'true':'false');b.addEventListener('click',()=>{units=b.dataset.v;keep('units',units);
    document.querySelectorAll('#units button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));if(st.pick)showPart(st.pick);});});
  document.querySelectorAll('#bal button').forEach(b=>b.addEventListener('click',()=>{mv.userData.balance(b.dataset.v);rateSet();keep('bal',b.dataset.v);document.querySelectorAll('#bal button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  /* the balance stop fitted, the Navy's Y-arm by default (the button pressed in the markup; a kept choice below); Stopping and starting's Locked works either. Both are the part lockArm,
     whose card, name and source follow the stop fitted (the Y-arm's from the README's "Estimated" entry for it, and Review-results.md 13) */
  const STOP_INFO={arm:{t:PARTS.lockArm.t,src:PARTS.lockArm.src,sn:PARTS.lockArm.sn,figs:PARTS.lockArm.figs,d:PARTS.lockArm.d,sp:PARTS.lockArm.sp},
    navy:{t:'Balance brake (Navy Y-arm)',src:'photo',sn:'As on serial 2E11795, Delaney No. 8854 and two other movements photographed with it: the lever’s widths (stem 2.9 mm, bar 2.2), the arch round the cock’s end and the eyes over the rim measured on the photographs taken from above; its heights, thickness and the seal’s inside estimated. The manual doesn’t describe it',figs:'',
      d:'Holds the balance still in transit, in place of the manual’s locking arm (Fig. 9). A second dust seal on the barrel bridge, like the fusee’s, holds a plunger with a hex socket. Screwed down with an Allen key through the bottom of the case, the plunger presses down a spring-steel lever, held at its root on a stud that takes the place of the barrel bridge’s pillar screw; the lever bends until the pins in the eyes of its crossbar bear on the balance rim’s top edge, as the folded wedges did before the locking arm. The crossbar arches round the cock’s end, clear of the hairspring; free, the pins stand 0.5 mm over the rim. How it works is taken from two descriptions of it. Lock and unlock it under Stopping and starting.',
      sp:'Not in the manual’s parts list'}};
  const stopFit=v=>{mv.userData.stop(v);const q=STOP_INFO[v]||STOP_INFO.arm;Object.assign(PARTS.lockArm,q);INFO.lockArm=[q.t,q.d,q.sp];};
  document.querySelectorAll('#stopV button').forEach(b=>b.addEventListener('click',()=>{stopFit(b.dataset.v);keep('stop',b.dataset.v);document.querySelectorAll('#stopV button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));
    const r=PROWS.find(x=>x.p==='lockArm'),q=PARTS.lockArm;if(r){r.b.textContent=q.t;r.ck.setAttribute('aria-label','Show '+q.t);r.row.style.setProperty('--ps',SRC[q.src][1]);r.txt=['lockArm',q.t,q.sp,q.sn].join(' ').toLowerCase();r.figs=new Set(q.figs?q.figs.split(', ').map(Number):[]);}
    if(st.pick==='lockArm')showPart('lockArm');}));stopFit($('#stopV [aria-pressed="true"]').dataset.v);
  $('#ghost').addEventListener('change',e=>{st.see=e.target.checked;look();});$('#colr').addEventListener('change',e=>{st.colr=e.target.checked;if(st.colr)st.csrc=false;look();});$('#colrSrc').addEventListener('change',e=>{st.csrc=e.target.checked;if(st.csrc)st.colr=false;look();});$('#draw').addEventListener('change',e=>{st.draw=e.target.checked?'tint':false;look();});$('#drawInk').addEventListener('change',e=>{st.draw=e.target.checked?'ink':false;look();});$('#edges').addEventListener('change',e=>{st.edges=e.target.checked;look();});$('#shadows').addEventListener('change',e=>{st.shadows=e.target.checked;look();});$('#merge').addEventListener('change',e=>{st.merge=e.target.checked;look();});
  const DIAL_INFO={hamilton:[INFO.dial[1],INFO.hands[1]],roman:['Black on silver-white, in the German style of the A. Lange & Söhne deck chronometers (maker’s name and number left off): Roman hours set radially, with IIII and the VI covered by a large seconds sub-dial; railroad minute and seconds tracks; the wind indicator reads AUF (up) to AB (down). Its scale is drawn on this movement’s 314° sweep.','Gilt leaf hour hand and lance minute hand, gilt wind indicator hand, blued seconds hand. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.'],
    swiss:['Black on white, in the style of the Ulysse Nardin (Le Locle) deck chronometers (maker’s name and number left off): Roman hours set radially, with IIII and the VI covered by a large seconds sub-dial; railroad minute and seconds tracks; the wind indicator reads UP / HAUT to DOWN / BAS. Its scale is drawn on this movement’s 314° sweep.','Blued pear hour and minute hands, blued wind indicator hand, a long blued seconds hand with a spear counterpoise. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.'],
    soviet:['Black on white, in the style of the First Moscow Watch Factory deck chronometers, which copied the Nardin layout (maker’s name and number left off): upright Arabic hours, with the 6 covered by a large seconds sub-dial marked СДЕЛАНО В СССР (made in the USSR); railroad minute and seconds tracks; the wind indicator reads ЗАВОД (wound) to СПУСК (run down). Its scale is drawn on this movement’s 314° sweep.','Aged gilt pear hour and minute hands, blued wind indicator hand, a long blued seconds hand with a spear counterpoise. Hour and minute hands on the centre wheel staff, second hand on the fourth wheel staff. The hands advance in half-second increments.']};
  document.querySelectorAll('#dialSt button').forEach(b=>b.addEventListener('click',()=>{mv.userData.dial(b.dataset.v);keep('dial',b.dataset.v);look();[INFO.dial[1],INFO.hands[1]]=DIAL_INFO[b.dataset.v];document.querySelectorAll('#dialSt button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  document.querySelectorAll('#finish button').forEach(b=>b.addEventListener('click',()=>{M.setPlateFinish(b.dataset.v);keep('finish',b.dataset.v);look();document.querySelectorAll('#finish button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  $('#lbls').addEventListener('change',e=>st.labels=e.target.checked);$('#lpOn').addEventListener('change',e=>{st.lp=e.target.checked;look();});$('#cuOn').addEventListener('change',e=>{st.cu=e.target.checked;cuShow();});$('#ssx').addEventListener('change',e=>{st.ssx=e.target.checked;cuShow();});$('#rock').addEventListener('change',e=>st.rock=e.target.checked);{const r=$('#rollP'),o=()=>{r.nextElementSibling.textContent=(+r.value).toFixed(1)+' s';};r.addEventListener('input',o);o();}$('#latch').addEventListener('change',e=>st.latch=e.target.checked);
  const hIn=$('#hrs'),hOut=hIn.parentElement.querySelector('output');
  const showH=()=>{hOut.textContent=hrs.toFixed(1)+' h';hIn.value=hrs.toFixed(1);};
  hIn.addEventListener('input',()=>{if(kw)kwStop();hrs=parseFloat(hIn.value);winding=false;showH();});showH();
  $('#wind').addEventListener('click',()=>{if(kw)kwStop();winding=true;});
  $('#reset').addEventListener('click',()=>{jump(()=>setView(st.view,true));});
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
    sw=null;ks={ph:1,t:0,latch0:st.latch,fast:(((tM-30-minT())%43200)+43200)%43200>21600};st.latch=true;$('#latch').checked=true;jump(()=>setView('dial'));look();
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
  /* theme: Auto follows the system; a choice is remembered with Remember settings */
  const setTheme=v=>{const de=document.documentElement;if(v==='auto')delete de.dataset.theme;else de.dataset.theme=v;document.querySelectorAll('#theme button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===v?'true':'false'));lsSet('cm-theme',v);};
  document.querySelectorAll('#theme button').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.v)));
  {const v=lsGet('cm-theme');if(v==='light'||v==='dark')setTheme(v);}
  /* save the view as a PNG: render and copy in the same task, while the drawing buffer is still valid, over the page background */
  $('#shot').addEventListener('click',()=>{paint();const c2=document.createElement('canvas');c2.width=cv.width;c2.height=cv.height;const x=c2.getContext('2d');x.fillStyle=getComputedStyle(document.body).backgroundColor;x.fillRect(0,0,c2.width,c2.height);x.drawImage(cv,0,0);
    c2.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='hamilton-model-21.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);});});
  /* Link: the page's address with this state in its hash (not waiting for writeHash); without the clipboard, it is put in the address bar */
  $('#link').addEventListener('click',()=>{const b=$('#link'),h=hashOf(),u=location.href.split('#')[0]+(h?'#'+h:''),say=t=>{b.textContent=t;clearTimeout(b.t);b.t=setTimeout(()=>b.textContent='Link',1500);};
    const bar=()=>{history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);};
    try{navigator.clipboard.writeText(u).then(()=>{bar();say('Copied');},()=>{bar();say('In address bar');});}catch(_){bar();say('In address bar');}});
  /* Reset display: each Display box back to its default (See-through to the view's own; the drawings before Edges, which they disable), faded and hidden parts back. The theme stays */
  $('#dispReset').addEventListener('click',()=>{const D={lbls:false,draw:false,drawInk:false,edges:true,shadows:false,merge:true,ghost:!!VIEWS[st.view].see,colr:false,colrSrc:false,rock:false,latch:false,spin:false};
    for(const k in D){const c=$('#'+k);if(c.checked!==D[k]){c.checked=D[k];c.dispatchEvent(new Event('change'));}}{const r=$('#rollP');r.value=7;r.dispatchEvent(new Event('input'));}st.op={};st.hid.clear();st.iso=null;look();opRender();});
  /* the panel's sections: with Remember settings, each viewer's open and closed ones are remembered (without a record, View, Time, Winding and Display are open) */
  const DET=[...document.querySelectorAll('.ctl>details.grp')],detSave=()=>lsSet('cm-open',JSON.stringify(Object.fromEntries(DET.map(x=>[x.id,x.open]))));
  try{const o=JSON.parse(lsGet('cm-open')||'{}');DET.forEach(d=>{if(typeof o[d.id]==='boolean')d.open=o[d.id];});}catch(_){}
  DET.forEach(d=>d.addEventListener('toggle',detSave));
  /* cm-state: the hash's settings (view, moving parts only, speed, section, drawing, colours, Edges, Shadows, Performance mode, time zone, bench, balance's weights, mainspring's set),
     without what belongs to a moment: a walkthrough step, the part shown, the hands' time, a section opened, the balance held. Written with the hash; at load it stands in for a missing hash */
  const remSave=()=>{if(!REM||ESSAY.on()||st.tour>=0)return;const h=new URLSearchParams(hashOf());for(const k of['tour','part','t','open','arm','block'])h.delete(k);lsSet('cm-state',h.toString());};
  $('#remember').checked=REM;$('#remember').addEventListener('change',e=>{REM=e.target.checked;
    if(REM){try{localStorage.setItem('cm-remember','1');}catch(_){}lsSet('cm-set',JSON.stringify(SET));lsSet('cm-theme',document.documentElement.dataset.theme||'auto');detSave();remSave();}
    else try{['cm-remember',...RK].forEach(k=>localStorage.removeItem(k));}catch(_){}});
  /* parts list: every named part, grouped; under a part with pieces, its pieces, folded until the part or one of them is picked (or the fold opened). A name singles the part or piece
     out as a tap does; the box hides it, as the right-click menu does. A part's box is half ticked while some of its pieces are hidden; ticking a piece of a hidden part shows that piece alone of it */
  const BOXP=new Set(PGRP[0][1]),plist=$('#plist'),PROWS=[],figSet=s=>new Set((s||'').split(', ').filter(Boolean).flatMap(f=>{const[a,z]=f.split('–').map(Number);return z?Array.from({length:z-a+1},(_,i)=>a+i):[a];}));
  const fold=(r,on)=>{r.sub.classList.toggle('open',on);r.pf.setAttribute('aria-expanded',on?'true':'false');};
  function prow(k,box,gh,par){const p=kp(k),c=PCE[k],q=PARTS[p],row=document.createElement('div');row.className=c?'prow sub':'prow';row.innerHTML=`<input type="checkbox" checked aria-label="Show ${INFO[k][0]}"><button class="pn">${INFO[k][0]}</button>`;
    const src=c&&c.src||q.src;if(PCOL[k])row.style.setProperty('--pc',PCOL[k]);if(src)row.style.setProperty('--ps',SRC[src][1]);const ck=row.firstChild,b=row.lastChild;
    ck.addEventListener('change',()=>{if(ck.checked){st.hid.delete(k);if(c&&st.hid.has(p)){st.hid.delete(p);for(const x of q.pcs)if(p+'.'+x.k!==k)st.hid.add(p+'.'+x.k);}if(!c)for(const x of[...st.hid])if(kp(x)===p)st.hid.delete(x);if(st.iso)st.iso.add(k);}
      else{st.hid.add(k);isoDrop(k);if(st.pick&&(st.pick===k||!c&&kp(st.pick)===p))closeInfo();}look();});   /* while isolated, a box ticked adds its part or piece to the isolation */
    b.addEventListener('click',()=>{st.pick===k?closeInfo():showPart(k);});box.appendChild(row);
    const r={p:k,row,ck,b,gh,par,txt:(c?[k,c.t,c.sp,c.h,q.t]:[k,q.t,q.sp,q.sn]).join(' ').toLowerCase(),figs:figSet(c&&c.figs!=null?c.figs:q.figs)};PROWS.push(r);return r;}
  for(const[g,ps]of PGRP){plist.insertAdjacentHTML('beforeend',`<div class="plist-h">${g}</div>`);const gh=plist.lastElementChild;
    for(const p of ps){const r=prow(p,plist,gh);if(!PARTS[p].pcs)continue;
      r.row.insertAdjacentHTML('beforeend',`<button class="pf" aria-expanded="false" aria-label="Pieces of ${PARTS[p].t}" title="Its pieces">›</button>`);r.pf=r.row.lastChild;r.sub=document.createElement('div');r.sub.className='psub';plist.appendChild(r.sub);
      r.pf.addEventListener('click',()=>fold(r,!r.sub.classList.contains('open')));r.kids=PARTS[p].pcs.map(c=>prow(p+'.'+c.k,r.sub,gh,r));}}
  /* search: by name, key, Hamilton part number (42087 finds the detent) or source note, every word; or by figure, fig 90 (the manual's figures that show it, ranges included). A piece found
     shows with its part, its fold opened while the search lasts. A group with nothing found hides its heading */
  const pSearch=$('#pSearch');pSearch.addEventListener('input',()=>{const v=pSearch.value.trim().toLowerCase(),fm=/^figs?\.?\s*(\d+)$/.exec(v),q=v.split(/\s+/).filter(Boolean),hit=new Set();
    for(const r of PROWS)r.on=fm?r.figs.has(+fm[1]):q.every(w=>r.txt.includes(w));for(const r of PROWS)if(r.on&&r.par)r.par.on=true;
    for(const r of PROWS){r.row.classList.toggle('hidden',!r.on);if(r.on)hit.add(r.gh);if(r.kids)r.sub.classList.toggle('found',!!v&&r.kids.some(x=>x.on));}for(const r of PROWS)r.gh.classList.toggle('hidden',!hit.has(r.gh));
    $('#pNone').classList.toggle('hidden',hit.size>0);});
  $('#pShow').addEventListener('click',()=>{st.hid.clear();st.iso=null;look();});
  /* rate: the timing and vernier weight pairs turned in or out in eighth turns, the timing weights up to 2 turns either way and the verniers 3 (R.timing, movement.js, sets the pitch from the
     manual's rate for a turn). The period goes as √I, so the model clock runs √(I0/I) as fast as a perfect one, and the temperature (below) adds what the moved screws
     and the balance's own curvature make of it: rateW. rateK is that times escK, the escapement's share at the balance's swing now and the escape wheel's torque (ESC.rateAt,
     set each frame: 1 at the model's settings and swing); rErr is what the hands have gained since the weights, screws or escapement were changed or the hands set */
  const I0=R.timing(0,0),twR=$('#twR'),vwR=$('#vwR'),tmpR=$('#tmpR'),rateOut=$('#rateOut');let rI=I0,lastRS=0,tE=0;
  const eighths=v=>{if(!v)return'0';const a=Math.abs(v),w=Math.floor(a/8);return(w||'')+['','⅛','¼','⅜','½','⅝','¾','⅞'][a%8]+(v>0?' out':' in');};
  const travel=(v,p)=>v?Math.abs(v/8*p).toFixed(2)+(v>0?' mm out':' mm in'):'at mid-travel';
  const T0=72.5,degF=()=>tmpR.valueAsNumber,tLin=t=>tE*(t-T0)/35,tCurve=t=>tLin(t)+MTE[R.balKind](t),tRate=()=>tCurve(degF());   /* the temperature's share, s a day: tE is the change the moved screws make between 55 and 90 F, linear about their mean; MTE (core.js) the balance's own curvature */
  function rateShow(){const d=86400*(rateK-1),dI=(rI/I0-1)*100,on=Math.abs(d)<0.05,t=twR.valueAsNumber,v=vwR.valueAsNumber;
    rateOut.innerHTML=`<b>${on?'On time':(d>0?'Gains ':'Loses ')+rateTxt(d)+' a day'}</b>${on?'':`<span>Since the last change the hands have ${d<0?'lost':'gained'} ${Math.abs(rErr).toFixed(Math.abs(rErr)<10?2:1)} s.</span>`}`+
      `<span>${!t&&!v?'Both pairs at mid-travel':`Timing weights ${travel(t,R.pitch.t)}, verniers ${travel(v,R.pitch.v)}`}. Moment of inertia ${rI.toFixed(1)} g·mm²${Math.abs(dI)<0.005?'':`, ${dI<0?'−':'+'}${Math.abs(dI).toPrecision(2)}%`}.</span>`+spText()+escText();}
  /* the escapement's share: its impulse and unlocking placed about the dead point otherwise than at the model's settings and swing (Airy), by the adjuster's bench or a smaller or
     larger swing (the drive's torque: winding, run down; Swing and isochronism) */
  function escText(){const e=86400*(escK-1),wt=86400*(rateW-1);if(Math.abs(e)<0.05)return'';const bd=benchDiff().length;
    return`<span>Of that, the escapement ${e>0?'gains':'loses'} ${rateTxt(e)} a day, the balance swinging ${Math.round(H.amp/D2R)}°${bd?' at the adjuster’s bench’s settings':''}: its impulse and unlocking push the balance otherwise about its dead point than at the model's own settings and 255° swing (Airy: a push before it gains, after it loses, a resistance the reverse, and a smaller swing feels both more)${Math.abs(wt)<0.05?'':`; the weights, screws and temperature ${wt>0?'gain':'lose'} ${rateTxt(wt)}`}.${bd?' The bench’s "The model’s settings" takes its share back.':''}</span>`;}
  /* screws and washers (R.screws, movement.js): the pairs, each in a hole (3-12, numbered from the arm's end as the balance block of Fig. 99 numbers them) with its heads and
     the washers under them, as Ops. 3 and 8 change them; a pair can be taken out or another put in an empty hole. SP: the pairs, index i the i-th of R.screwStd (null: taken
     out), added ones after them. Beside the model's rate, what the manual's Table II (screw change equivalents, for pairs), Table III (washers) and Table IV (temperature,
     a pair moved from hole to hole) give for the same changes */
  const spP=$('#spP'),spN=$('#spN'),spH=$('#spH'),spW=$('#spW'),STD=R.screwStd;let SP=STD.map(p=>({...p})),spI=0;
  const T2={'0.100':{'0.080':16,'0.060':34,'0.050':43,'0.040':50},'0.080':{'0.060':16,'0.050':25,'0.040':34},'0.060':{'0.050':6,'0.040':13},'0.050':{'0.040':7}},T3={'0.002':70,'0.003':114,'0.004':198,'0.006':264,'0.008':390,'0.010':510};
  const t2=(a,b)=>a===b?0:T2[a]&&T2[a][b]!=null?T2[a][b]*60:T2[b]&&T2[b][a]!=null?-T2[b][a]*60:null;   /* s a day gained, a pair changed from a to b */
  const spSeg=(el,v)=>{for(const b of el.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.v===String(v)));};
  const spTitle=(p,i)=>`Pair ${i+1}: hole ${p.n}, ${p.h} in heads${p.w?`, ${p.w} in washers`:''}${STD[i]?` (standard: hole ${STD[i].n}, ${STD[i].h} in)`:' (added)'}`;
  function spShow(){if(!SP[spI])spI=Math.max(0,SP.findIndex(Boolean));const p=SP[spI];
    spP.innerHTML=SP.map((q,i)=>q?`<button data-v="${i}" aria-pressed="${i===spI}" title="${spTitle(q,i)}">${i+1}</button>`:'').join('')||'<span class="note">none</span>';
    spSeg(spN,p?p.n:'');spSeg(spH,p?p.h:'');spSeg(spW,p?p.w||0:'');
    const near=(n,i)=>SP.some((q,j)=>q&&j!==i&&q.n===n);   /* a hole another pair holds */
    for(const b of spN.querySelectorAll('button'))b.disabled=!p||near(+b.dataset.v,spI);
    for(const el of[spH,spW])for(const b of el.querySelectorAll('button'))b.disabled=!p;
    $('#spDel').disabled=!p;$('#spAdd').disabled=!R.HOLES.some(n=>!near(n,-1));}
  function spSet(){R.screws(SP);pend.add('screws changed');spShow();rateSet();}
  const spPick=(el,f)=>el.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.disabled&&SP[spI]){f(b.dataset.v);spSet();}});
  spP.addEventListener('click',e=>{const b=e.target.closest('button');if(b){spI=+b.dataset.v;spShow();}});
  spPick(spN,v=>{SP[spI].n=+v;});spPick(spH,v=>{SP[spI].h=v;});spPick(spW,v=>{SP[spI].w=v==='0'?0:v;});
  $('#spAdd').addEventListener('click',()=>{const n=R.HOLES.find(n=>!SP.some(q=>q&&q.n===n));if(n==null)return;SP.push({n,h:'0.050',w:0});spI=SP.length-1;spSet();});
  $('#spDel').addEventListener('click',()=>{if(!SP[spI])return;SP[spI]=null;while(SP.length>STD.length&&!SP[SP.length-1])SP.pop();spSet();});
  /* Table IV for the pairs moved from their standard holes (each with its own head and washer), in s a day between 55 and 90 F; the table has no figure for a pair taken
     out or put in, nor for a change of head or washer where it stands */
  const tempOf=()=>{let s=0;for(let i=0;i<STD.length;i++){const p=SP[i],q=STD[i];if(p&&p.n!==q.n){const hh=parseFloat(p.h)+(p.w?parseFloat(p.w):0);s+=R.T4(hh,p.n)-R.T4(hh,q.n);}}return s;};
  function spText(){const ch=[];let man=0,ok=true;
    for(let i=0;i<Math.max(SP.length,STD.length);i++){const p=SP[i],q=STD[i];
      if(q&&!p){ch.push(`pair ${i+1} taken out`);ok=false;continue;}if(!q&&p){ch.push(`a pair of ${p.h} in put in hole ${p.n}${p.w?` with ${p.w} in washers`:''}`);ok=false;continue;}if(!p)continue;
      const c=[];if(p.n!==q.n)c.push(`hole ${q.n} → ${p.n}`);if(p.h!==q.h){c.push(`${q.h} → ${p.h} in heads`);const g=t2(q.h,p.h);if(g==null)ok=false;else man+=g;}if(p.w){c.push(`${p.w} in washers`);man-=T3[p.w];}
      if(c.length)ch.push(`pair ${i+1} ${c.join(', ')}`);}
    const f=s=>{const m=Math.floor(Math.abs(s)/60),r=Math.round(Math.abs(s)%60);return`${m} min${r?` ${r} s`:''}`;},mv=SP.some((p,i)=>p&&STD[i]&&p.n!==STD[i].n);
    let o=ch.length?`<span>Screws: ${ch.join('; ')}. ${!ok?'The manual’s tables give no figure for that; the rate is the model’s, from the moment of inertia.':man?`The manual’s Tables II and III give about ${f(man)} a day ${man>=0?'gained':'lost'}.`:''}</span>`:'';
    const sp=R.balKind==='split';
    if(mv||degF()!==T0||sp)o+=`<span>Temperature: ${mv?`the moved pairs change the rate at 90 °F against 55 °F by ${tE>=0?'+':'−'}${Math.abs(tE).toFixed(2)} s a day (Table IV; the pre-temperature test, Op. 8, allows +0.5 to −0.8)`:'the standard screws, taken as compensated'}; ${sp?'the split bimetallic balance, compensated near 45 and 90 °F, gains between them, its middle temperature error (illustrative)':'the balance itself gains a little in the middle, 0.07 s a day against 55 and 90 °F, as the factory test card of No. 3390 shows (Sec. IX)'}${degF()!==T0?`; at ${degF()} °F that is ${Math.abs(tRate()).toFixed(2)} s a day ${tRate()>=0?'gained':'lost'}`:''}.${sp&&degF()!==T0?` The rim’s curl is drawn ${R.CURLX} times as far as it goes.`:''}</span>`;
    return o;}
  const rateTxt=d=>{const a=Math.abs(d),m=Math.floor(a/60),r=Math.round(a%60);return a<120?a.toFixed(1)+' s':`${m} min${r?` ${r} s`:''}`;};
  function rateSet(){rI=R.timing(twR.valueAsNumber/8,vwR.valueAsNumber/8);tE=tempOf();rateW=Math.sqrt(I0/rI)*(1+tRate()/86400);rateK=rateW*escK;rErr=0;pend.add('weights moved');R.balCurl(degF()-T0);tempDraw();
    twR.nextElementSibling.textContent=eighths(twR.valueAsNumber);vwR.nextElementSibling.textContent=eighths(vwR.valueAsNumber);tmpR.nextElementSibling.textContent=degF()+' °F';rateShow();wake();}
  twR.addEventListener('input',rateSet);vwR.addEventListener('input',rateSet);tmpR.addEventListener('input',rateSet);rateSet();
  const balZero=()=>{twR.value=0;vwR.value=0;tmpR.value=T0;SP=STD.map(p=>({...p}));spI=0;R.screws(SP);spShow();rateSet();};
  $('#rateZero').addEventListener('click',balZero);spShow();
  /* a small chart (the rate panel's temperature, Swing and isochronism): o.x0..x1, y0..y1, ticks xt, yt with their formats, series [{f or pts, col, w, dash}], marks [{x, y, col}],
     a cursor at x, bands [{x0, x1, y0, y1, col, lab}], texts [{x, y, t, col, al}] in data units */
  function plot(cv,o){const w=cv.clientWidth||280,h=Math.round(w*(o.aspect||0.5)),d=Math.min(devicePixelRatio||1,2);if(cv.width!==Math.round(w*d)||cv.height!==Math.round(h*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.height=h+'px';}
    const x=cv.getContext('2d'),dk=dark(),L0=40,R0=o.r||10,T0p=10,B0=26,pw=w-L0-R0,ph=h-T0p-B0,X=v=>L0+(v-o.x0)/(o.x1-o.x0)*pw,Y=v=>T0p+(1-(v-o.y0)/(o.y1-o.y0))*ph;
    x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);x.font='11px "Instrument Sans",sans-serif';x.lineWidth=1;const grid=dk?'#2a323a':'#dde1e4',txt=dk?'#9aa4ad':'#5b656e',yc=v=>Y(clamp(v,o.y0,o.y1));
    for(const b of o.bands||[]){x.fillStyle=b.col;x.fillRect(X(b.x0),yc(b.y1??o.y1),X(b.x1)-X(b.x0),yc(b.y0??o.y0)-yc(b.y1??o.y1));if(b.lab){x.fillStyle=txt;x.textAlign='center';x.fillText(b.lab,(X(b.x0)+X(b.x1))/2,T0p+11);}}
    x.strokeStyle=grid;x.fillStyle=txt;for(const v of o.xt){x.beginPath();x.moveTo(X(v),T0p);x.lineTo(X(v),T0p+ph);x.stroke();x.textAlign='center';x.fillText(o.xf(v),X(v),h-10);}
    for(const v of o.yt){x.beginPath();x.moveTo(L0,Y(v));x.lineTo(L0+pw,Y(v));x.stroke();x.textAlign='right';x.fillText(o.yf(v),L0-4,Y(v)+4);}
    x.save();x.beginPath();x.rect(L0,T0p-2,pw,ph+4);x.clip();
    for(const sr of o.series){x.strokeStyle=sr.col;x.lineWidth=sr.w||2;x.setLineDash(sr.dash||[]);x.beginPath();let on=false;const pts=sr.pts||Array.from({length:121},(_,i)=>{const v=o.x0+(o.x1-o.x0)*i/120;return[v,sr.f(v)];});
      for(const[a,b]of pts){if(!Number.isFinite(b)){on=false;continue;}on?x.lineTo(X(a),Y(b)):x.moveTo(X(a),Y(b));on=true;}x.stroke();}
    x.setLineDash([]);if(o.cursor!=null){x.strokeStyle=txt;x.lineWidth=1;x.beginPath();x.moveTo(X(o.cursor),T0p);x.lineTo(X(o.cursor),T0p+ph);x.stroke();}
    for(const m of o.marks||[])if(Number.isFinite(m.y)){x.fillStyle=m.col;x.beginPath();x.arc(X(m.x),Y(m.y),m.r||4,0,TAU);x.fill();}x.restore();
    for(const t of o.texts||[]){x.fillStyle=t.col||txt;x.textAlign=t.al||'left';x.fillText(t.t,X(t.x),Y(t.y));}}
  /* rate against temperature, 40 to 100 F: this balance's (the screws' line and its curvature), the other balance's dashed; the test's three temperatures marked, and the Navy test's
     temperature compensation figures (Sec. IX: the differences between the mean rates at 90 and 72½, 72½ and 55, 90 and 55 °F, within 0.75, 0.75 and 1.20 s a day) */
  function tempDraw(){const cv=$('#tempCv');if(!cv||!$('#rateDet').open)return;const dk=dark(),sp=R.balKind==='split',oth=sp?'uncut':'split',f=tCurve,g=t=>tLin(t)+MTE[oth](t);
    let m=1;for(let t=40;t<=100;t+=2)m=Math.max(m,Math.abs(f(t)),Math.abs(g(t)));const y1=m<=1?1:m<=2?2:Math.ceil(m/2)*2,brass=dk?'#e0b44f':'#8a5d10';
    plot(cv,{x0:40,x1:100,y0:-y1,y1,xt:[40,55,72.5,90,100],yt:[-y1,0,y1],xf:v=>v===72.5?'72½':v+'°',yf:v=>(v>0?'+':v<0?'−':'')+Math.abs(v),cursor:degF(),
      series:[{f:g,col:dk?'#4a5560':'#c3c9ce',w:1.4,dash:[4,3]},{f,col:brass,w:2.2}],marks:[55,72.5,90].map(t=>({x:t,y:f(t),col:brass,r:3})).concat([{x:degF(),y:f(degF()),col:dk?'#e4e8eb':'#141a20'}]),
      texts:[{x:41,y:y1*0.72,t:'s a day; dashed: the '+(sp?'Model 21’s':'split')+' balance'}]});
    const r55=f(55),r72=f(72.5),r90=f(90),fig=(a,lim)=>`<b${Math.abs(a)>lim?' class="bad"':''}>${Math.abs(a).toFixed(2)}</b> (${lim.toFixed(2)})`;
    $('#tempOut').innerHTML=`The Navy test’s temperature compensation (Sec. IX), mean rates apart, its limit in brackets: 90 against 72½ °F ${fig(r90-r72,0.75)}, 72½ against 55 ${fig(r72-r55,0.75)}, 90 against 55 ${fig(r90-r55,1.20)} s a day.`;}
  $('#rateDet').addEventListener('toggle',tempDraw);
  /* the weights in a link (hashOf, applyHash): bal=tw:8,vw:-3,T:90,p:3_0.080_0-x-12_0.050_0.002 (the pairs in SP's order, x one taken out), where they differ from the standard */
  const balStr=()=>{const o=[],t=twR.valueAsNumber,v=vwR.valueAsNumber,p=SP.map(q=>q?`${q.n}_${q.h}_${q.w||0}`:'x').join('-');if(t)o.push('tw:'+t);if(v)o.push('vw:'+v);if(degF()!==T0)o.push('T:'+degF());
    if(p!==STD.map(q=>`${q.n}_${q.h}_${q.w||0}`).join('-'))o.push('p:'+p);return o.join(',');};
  const balApply=s=>{if(s===balStr())return;const q={tw:0,vw:0,T:T0,p:null};for(const kv of s.split(',')){const i=kv.indexOf(':'),k=kv.slice(0,i),v=kv.slice(i+1);if(k==='p')q.p=v;else if(k in q&&Number.isFinite(+v))q[k]=+v;}
    twR.value=clamp(Math.round(q.tw),-16,16);vwR.value=clamp(Math.round(q.vw),-24,24);tmpR.value=clamp(Math.round(q.T*2)/2,40,100);
    const sp=q.p==null?STD.map(p=>({...p})):q.p.split('-').slice(0,R.HOLES.length).map(e=>{const[n,h,w]=e.split('_');return R.HOLES.includes(+n)&&Object.prototype.hasOwnProperty.call(R.BSZ,h)?{n:+n,h,w:w&&Object.prototype.hasOwnProperty.call(R.BWA,w)?w:0}:null;});
    const seen=new Set();SP=sp.map(p=>p&&!seen.has(p.n)?(seen.add(p.n),p):null);spI=0;R.screws(SP);spShow();rateSet();};
  /* ---------- the navigator's rate book (Sec. IX, Recording the Rate; Table I): the dial error against the master, to the nearest half second as the hands step, compared at
     noon each day (master time) or on demand; the daily rate is the change in error per day; the mean daily rate and the mean deviation over the comparisons since the last
     break (started, stopped, set, not wound). Then what the error means at sea: 4 s of time is 1' of longitude, cos(latitude) nautical miles ---------- */
  const dayOf=t=>Math.floor((t-43200)/86400),BREAK=['set','started','stopped','not wound'],bookT=$('#bookT'),bookLon=$('#bookLon'),latIn=$('#lat');bookDay=dayOf(tM);let lastBL=0;
  const hm=t=>{const d=new Date(t*1000);return d.getUTCDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');};
  const sgn=(v,n=1)=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n),half=v=>Math.round(v*2)/2;
  function bookStats(){const run=[];for(let i=book.length-1;i>0;i--){if(book[i].rem.some(r=>BREAK.includes(r)))break;if(book[i].rate==null)continue;run.unshift(book[i].rate);if(run.length===10)break;}   /* a comparison too soon after the last for a rate is skipped, not a break */
    const m=run.length?run.reduce((a,b)=>a+b,0)/run.length:null;return{m,dev:m==null?null:run.reduce((a,b)=>a+Math.abs(b-m),0)/run.length,n:run.length};}
  /* the rate is taken against the latest comparison at least half a day back with no break since: over a shorter time, reading to the half second swamps it */
  /* a comparison by the sky (PLAN-self-contained.md, E3): the error as the essay's equal altitudes ashore (to about 0.5 s) or a lunar distance at sea (about
     15 s: a tenth of a minute of distance) would find it, its scatter drawn from a fixed sequence, and so noted under Remarks */
  let skyS=97;const skyN=()=>{skyS=(skyS*16807)%2147483647;const u=skyS/2147483647;skyS=(skyS*16807)%2147483647;return Math.sqrt(-2*Math.log(u+1e-12))*Math.cos(2*Math.PI*skyS/2147483647);};
  function bookAdd(by){const sd=by==='sun'?0.5:by==='moon'?15:0,e=half(dialRead()-tM+sd*skyN()),rem=[...pend,...(by==='sun'?['by equal altitudes']:by==='moon'?['by a lunar distance']:[])];pend.clear();let prev=null;
    if(!rem.some(r=>BREAK.includes(r)))for(let i=book.length-1;i>=0;i--){if(tM-book[i].t>=43200){prev=book[i];break;}if(book[i].rem.some(r=>BREAK.includes(r)))break;}
    const rate=prev?(e-prev.e)/((tM-prev.t)/86400):null;book.push({t:tM,e,rate,rem:book.length?rem:['first comparison',...rem.filter(r=>r!=='weights moved'&&r!=='screws changed'&&r!=='escapement adjusted')]});bookShow();}
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
  $('#bookNow').addEventListener('click',()=>bookAdd());$('#bookSun').addEventListener('click',()=>bookAdd('sun'));$('#bookMoon').addEventListener('click',()=>bookAdd('moon'));$('#bookClr').addEventListener('click',()=>{book=[];bookShow();});bookShow();
  $('#rateLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();jump(()=>setView('balance'));showPart('bal');});
  /* ---------- stopping and starting (Sec. III): a detent chronometer is not self-starting. The balance swings at amplitude H.amp; below ESC.AMIN a swing no longer
     carries the discharge jewel past the trip spring, unlocks the wheel and sees the impulse through, so the train stops at a locked beat and the balance runs down freely
     (TAU_FREE, estimated). The locking arm (Fig. 9) brakes it within a swing or two; the train-blocking screw's dog point stops the fourth wheel at a spoke; at run down
     the train stops. The train runs again when there is power, the arm is off, the screw is up and the balance swings above AMIN: at once if it is still swinging
     (the screw raised in time, or wound before the balance stops), otherwise after a twist of the box, which sets the balance swinging (the manual's way to start it).
     While the train is held tSim and the hands stand, and the balance keeps its own phase in H.bph (oscillations); on restarting, H.bOff (phase) and H.eOff (beats)
     carry both across, so neither the balance nor the hands jump. H.arm and H.blk move on frame time: the arm 0 unlocked to 1 locked, the screw 0 up to 1 down ---------- */
  /* the drive: the escape wheel's torque as a share of the one the escapement is calibrated at (ESC.ampAt, ESC.rateAt). Running, the mainspring through the fusee (R.fs.torque:
     its small residual, the spring being illustrative), 1 at 12 h from full wind, the middle of a day's running; while the key turns, the sustaining spring alone, SUS of it when
     loaded (estimated) and falling to nothing as it relaxes over its 10 minutes (R.ssD of R.SMAX, update()); run down, none. drvB(h): what a going barrel with the same spring
     would give, its pull falling evenly with time, geared to give the same at 28 h (Swing and isochronism) */
  /* MSET: the mainspring's set (Op. 13, "check condition and set of mainspring"): a spring that has taken a set pulls that much less all through, which the fusee can't make up */
  let MSET=0;const SUS=0.8,FT12=R.fs.torque(12*FUSEE_PER_HOUR),drvF=h=>R.fs.torque(h*FUSEE_PER_HOUR)/FT12*(1-MSET),drvB=h=>R.fs.pullB(clamp(h/RUN_H,0,1))/R.fs.pullB(0.5)*drvF(RUN_H/2);
  const driveNow=()=>winding?SUS*clamp(1-R.ssD/R.SMAX,0,1):hrs<RUN_H?drvF(hrs):0;
  const H={amp:ESC.ampAt(drvF(hrs)),held:false,bph:0,bOff:0,eOff:0,Eh:0,arm:0,armT:0,blk:0,blkT:0,kick:0,twT:-1},TAU_FREE=ESC.settings.TF,TAU_ARM=0.2,stopOut=$('#stopOut'),twistB=$('#twist');let lastSO=0;
  if(/[?&]qa\b/.test(location.search))window.__H=()=>({...H,E:lastE,tSim,hrs,tM,slip,rateK,escK,rateW,drive:driveNow()});   /* for the tools: the stop/start state, the master time, the hands' slip, the rate (escK: the escapement's share, rateW the rest) and the drive */
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
     reader keeps it), the 3D parts with escSet; ESC.checks() measures the figures as tools/escapement.js does. The settings also set the running amplitude ESC.A, which
     ampStep brings the balance to, and the escapement's rate ESC.run.rate (s a day against the model's settings), escK in rateK. A setting at which it would not run,
     or at which the balance would swing too little to keep it going, is not applied ---------- */
  const EX0=ESC.EX,BENCH=[['rT','Trip-spring tip',0.24,0.34,0.001,'mm'],['rd','Discharge-jewel reach',0.26,0.35,0.001,'mm'],['dL','Depth of lock',0.005,0.05,0.001,'mm'],
    ['DRAW','Locking-jewel draw',4,16,0.5,'°'],['aD','Discharge-jewel angle',260,275,0.1,'°'],['aI','Impulse-jewel angle',175,188,0.1,'°'],['HS','Hairspring isochronism',-0.3,0.3,0.01,'s']],BDEF=Object.fromEntries(BENCH.map(([k])=>[k,ESC.settings[k]]));   /* the model's settings */
  const bset={...BDEF},bIn={},benchOut=$('#benchOut'),benchT=$('#benchT'),bcv=$('#benchCv');let benchQ=false,benchBad='';
  const bFmt=(k,v)=>{const b=BENCH.find(x=>x[0]===k);return b[5]==='mm'?(v*ES).toFixed(3)+' mm':b[5]==='s'?(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(2)+' s':(+v).toFixed(1)+'°';};   /* HS: s a day for each 10 degrees more swing */
  for(const[k,t,lo,hi,st]of BENCH){$('#benchS').insertAdjacentHTML('beforeend',`<label class="sl rw"><span>${t}</span><input type="range" min="${lo}" max="${hi}" step="${st}" value="${BDEF[k]}" aria-label="${t}"><output></output></label>`);
    const i=$('#benchS').lastElementChild.querySelector('input');bIn[k]=i;i.addEventListener('input',()=>{bset[k]=+i.value;benchQ=true;wake();});}
  function benchShow(){for(const[k]of BENCH){bIn[k].value=bset[k];bIn[k].nextElementSibling.textContent=bFmt(k,bset[k]);}
    benchT.innerHTML='<table class="rt bench"><thead><tr><th>Figure</th><th class="n">Now</th><th>Manual</th></tr></thead><tbody>'+ESC.checks().filter(c=>c.k!=='D').map(c=>`<tr><td>${c.name}</td><td class="n${c.ok?'':' bad'}">${c.ok?'':'✗ '}${c.v}</td><td>${c.want}</td></tr>`).join('')+'</tbody></table>';
    const n=ESC.checks().filter(c=>!c.ok).length;benchOut.innerHTML=(benchBad?`<b>It would not run at that setting</b><span>${benchBad}: it is kept at the last setting that runs.</span>`:`<b>${n?n+' figure'+(n>1?'s':'')+' outside the manual’s':'Every figure within the manual’s'}</b>`)+
      `<span>The balance must swing at least ${Math.round(ESC.AMIN/D2R)}° to unlock the wheel and see the impulse through${H.amp<ESC.AMIN?': it swings less, so the train has stopped (twist to start)':''}.</span>`;}
  function benchApply(){benchQ=false;const E2=makeEsc({EX:EX0,...bset}),m=E2.measure();
    if(!m.runs){benchBad=m.why;for(const k in bset)bset[k]=ESC.settings[k];}else{benchBad='';const was=ESC.run.rate;Object.assign(ESC,E2);mv.userData.escSet();if(ESC.run.rate!==was){rErr=0;pend.add('escapement adjusted');rateShow();}}benchShow();wake();}
  const benchDiff=()=>BENCH.filter(([k])=>Math.abs(bset[k]-BDEF[k])>1e-9);
  $('#benchReset').addEventListener('click',()=>{Object.assign(bset,BDEF);benchApply();});
  $('#benchLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();jump(()=>setView('escapement'));});
  function benchDraw(s,E){if(!$('#benchDet').open)return;const w=bcv.clientWidth||280,h=Math.round(w*0.72),d=Math.min(devicePixelRatio||1,2);
    if(bcv.width!==Math.round(w*d)){bcv.width=Math.round(w*d);bcv.height=Math.round(h*d);bcv.style.height=h+'px';}const x=bcv.getContext('2d');x.setTransform(d,0,0,d,0,0);drawEsc2D(x,w,h,s,E,dark());}
  $('#benchDet').addEventListener('toggle',()=>{if($('#benchDet').open)benchShow();});
  let msgT=0;const stopMsg=t=>{stopOut.innerHTML=t;msgT=performance.now()+4000;};
  function stopShow(now,run){if(now<msgT||now-lastSO<250)return;lastSO=now;const w=stopWhy(run),a=H.amp/D2R;
    stopOut.innerHTML=`<b>${w||'Running'}.</b> <span>The balance ${a<0.5?'is at rest':`swings ${Math.round(a)}° each way`}${a>=0.5&&H.amp<ESC.AMIN?`, under the ${Math.round(ESC.AMIN/D2R)}° it needs to unlock the wheel`:''}.</span>`;}
  /* the arm and screw move on frame time, not model time; the screw can't come down on a spoke, so it waits above the wheel's face until a gap comes round */
  function stopMove(dt){const inst=SNAP||RM.matches,mvTo=(x,t,r)=>inst?t:x+clamp(t-x,-dt/r,dt/r);H.arm=mvTo(H.arm,H.armT,0.8);
    const b=mvTo(H.blk,H.blkT,2.5),vf=R.tbs.userData.vFace;H.blk=(b>vf-0.005&&H.blk<=vf&&!R.blockClear(lastE??0))?Math.min(b,vf-0.005):b;}
  /* the balance's equation of motion, averaged over a swing (makeEsc, ampAt): driven at torque drv, A² relaxes to ESC.ampAt(drv)² as exp(-2t/TF), exactly whatever the step, so the
     time it takes to settle (TF/2, 12.5 s) is the same at every speed; free, the same with no impulse, A falling as exp(-t/TF). The arm brakes it; a twist kicks it up */
  function ampStep(dts,brake,driven,drv){let a=H.amp;if(H.kick>0&&a>=H.kick)H.kick=0;   /* a twist adds swing, never takes it away */
    if(H.kick>0){a+=(H.kick-a)*(1-Math.exp(-dts/0.15));if(H.kick-a<0.2*D2R)H.kick=0;}
    else if(brake)a*=Math.exp(-dts/TAU_ARM);else{const u=driven?ESC.ampAt(drv)**2:0;a=Math.sqrt(u+(a*a-u)*Math.exp(-2*dts/TAU_FREE));}H.amp=a<0.2*D2R&&!driven&&!H.kick?0:a;}
  /* a jolt (2.7 in IDEAS.md, illustrative): a sharp knock turning the box about the balance staff jerks the balance's speed by 0.6 to 1 of its running top speed, either way, at random.
     From where it is in its swing (θ, θ') the balance goes on at A = √(θ² + (θ'/ω)²): checked below AMIN it sets (stops: twist to start); carried past a full turn plus the angle
     where the discharge jewel meets the trip spring (ESC.TRIP) it unlocks the detent a second time in that swing and the wheel trips, escaping an extra tooth, the hands half a
     second on, and the tooth striking the roller as it trips takes the excess (the swing kept under TRIP + 15 degrees); between, the swing is upset and settles again. Only while
     the train is going, at a locked beat; the box and gimbals are knocked too (H.jT) */
  const joltB=$('#jolt');
  function jolt(){if(kw)kwStop();H.jT=performance.now();H.jS=Math.random()<0.5?-1:1;gimKick(H.jS*0.8);wake();
    const sl=st.speed>REAL_X;if(H.held||H.amp<ESC.AMIN||H.arm>0.05){stopMsg('<b>Jolted.</b> <span>The balance isn’t driving the train, so there is nothing to upset.</span>');return;}
    const x=tSim/0.5+H.bOff,ph=x-Math.floor(x),z0=ESC.state(ph,H.amp);if(!sl&&z0.prog>0&&z0.prog<1){stopMsg('<b>Jolted during an impulse.</b> <span>The tooth is on the impulse jewel and rides it out; try again.</span>');return;}
    const w=TAU/0.5,th=-H.amp*Math.cos(TAU*ph),v=H.amp*w*Math.sin(TAU*ph)+H.jS*(0.6+0.4*Math.random())*ESC.A*w,a0=Math.hypot(th,v/w),a=Math.min(a0,ESC.TRIP+15*D2R),before=H.amp;
    H.amp=a;H.kick=0;   /* the swing's new size; its phase is kept (the model's clock), so the train stays on its half second */
    const trip=a0>ESC.TRIP,set=a<ESC.AMIN,d=x=>Math.round(x/D2R)+'°';if(trip){H.eOff+=1;rErr+=0.5;}pend.add('jolted');
    stopMsg(set?`<b>Jolted: it has set.</b> <span>The knock came against the balance’s swing and checked it from ${d(before)} to ${d(a)}, under the ${d(ESC.AMIN)} it needs to unlock the wheel: the chronometer stops. Twist to start.</span>`:
      trip?`<b>Jolted: it tripped.</b> <span>The knock came with the swing and carried the balance past a full turn, so the discharge jewel came round and unlocked the detent a second time: the escape wheel escaped an extra tooth and the hands jumped half a second ahead. The swing settles back to ${d(ESC.ampAt(driveNow()))} in half a minute.</span>`:
      `<b>Jolted.</b> <span>The swing went from ${d(before)} to ${d(a)}; it settles back to ${d(ESC.ampAt(driveNow()))} in half a minute${Math.abs(a-before)>20*D2R?', and the rate wanders meanwhile':''}.</span>`);}
  joltB.addEventListener('click',jolt);
  /* ---------- swing and isochronism: the balance's amplitude over the last minute (frame time), the rate against the swing at a steady torque (ESC.rateAt along ESC.ampAt), and both over
     a wind with the fusee (drvF) and, ticked, a going barrel (drvB); the manual's isochronism check, wound at 0 h: the gain over 12 h less half the gain over 24 ---------- */
  const swCv=$('#swCv'),swOut=$('#swOut'),swDet=$('#swingDet'),swGB=$('#swGB'),swTr=[];let swKind='t',swLast=0,swKey='',swC=null;
  document.querySelectorAll('#swK button').forEach(b=>b.addEventListener('click',()=>{swKind=b.dataset.v;segSet2('#swK',swKind);$('#swGBw').classList.toggle('hidden',swKind!=='w');swLast=0;wake();}));
  const segSet2=(sel,v)=>document.querySelectorAll(sel+' button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v?'true':'false'));$('#swGBw').classList.add('hidden');
  swGB.addEventListener('change',()=>{swLast=0;wake();});swDet.addEventListener('toggle',()=>{swLast=0;wake();});
  function swRec(now,drv){if(swTr.length&&now-swTr[swTr.length-1][0]<100)return;swTr.push([now,H.amp/D2R,drv]);while(swTr.length&&now-swTr[0][0]>61000)swTr.shift();}
  const steady=fn=>{const r=[];for(let h=0;h<=RUN_H;h+=RUN_H/112){const sv=fn(h),a=ESC.ampAt(sv);r.push([h,a/D2R,ESC.rateAt(a,sv)]);}return r;};
  const gain=(fn,h1)=>{let g=0;const n=48;for(let i=0;i<n;i++){const h=h1*(i+0.5)/n,sv=fn(h),a=ESC.ampAt(sv);g+=ESC.rateAt(a,sv)*h1/n/24;}return g;};   /* seconds gained over the first h1 hours from full wind */
  function swCalc(){const k=[ESC.A,ESC.run.rate,ESC.AMIN,ESC.settings.HS,MSET].join();if(k===swKey)return swC;swKey=k;const iso=fn=>gain(fn,12)-gain(fn,24)/2;
    const sp=fn=>{const r=steady(fn).map(q=>q[2]).filter(Number.isFinite);return[Math.min(...r),Math.max(...r)];};
    const cv=[];for(let sv=0.15;sv<=1.8;sv+=0.01){const a=ESC.ampAt(sv);if(a>=ESC.AMIN)cv.push([a/D2R,ESC.rateAt(a,sv)]);}
    return swC={F:steady(drvF),B:steady(drvB),isoF:iso(drvF),isoB:iso(drvB),spF:sp(drvF),spB:sp(drvB),cv,sus:ESC.ampAt(SUS)/D2R};}
  function swDraw(now){if(!swDet.open||now-swLast<(swKind==='t'?100:500))return;swLast=now;const dk=dark(),blue=dk?'#91adf2':'#26479c',red='#c0392b',brass=dk?'#e0b44f':'#8a5d10',band=dk?'rgba(145,173,242,.12)':'rgba(38,71,156,.08)',fz=dk?'#4a5560':'#9aa3ab';
    const C=swCalc(),amin=ESC.AMIN/D2R,A=H.amp/D2R,drv=driveNow(),sg=(v,n=2)=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n),man={x0:247.5,x1:270,col:band,lab:'1⅜–1½ turns'};
    if(swKind==='t'){const pts=swTr.map(q=>[(q[0]-now)/1000,q[1]]);
      plot(swCv,{x0:-60,x1:0,y0:0,y1:360,xt:[-60,-45,-30,-15,0],yt:[0,90,180,270,360],xf:v=>v?v+' s':'now',yf:v=>v+'°',bands:[{x0:-60,x1:0,y0:247.5,y1:270,col:band}],
        series:[{pts:[[-60,amin],[0,amin]],col:red,w:1,dash:[4,3]},{pts,col:blue,w:2}],marks:[{x:0,y:A,col:blue}],texts:[{x:-59,y:amin+8,t:'least that unlocks',col:red},{x:-59,y:283,t:'1⅜–1½ turns'}]});}
    else if(swKind==='a'){const r=C.cv.filter(q=>q[0]>=150);let lo=-4,hi=1.5;
      plot(swCv,{x0:150,x1:320,y0:lo,y1:hi,xt:[150,200,250,300],yt:[-4,-2,0],xf:v=>v+'°',yf:v=>(v>0?'+':v<0?'−':'')+Math.abs(v),bands:[man],
        series:[{pts:r,col:brass,w:2.2}],marks:H.held||H.amp<ESC.AMIN?[]:[{x:A,y:86400*(escK-1),col:dk?'#e4e8eb':'#141a20'}],texts:[{x:152,y:hi-0.55,t:'s a day'}]});}
    else{const B=swGB.checked;
      plot(swCv,{x0:0,x1:56,y0:150,y1:330,xt:[0,14,28,42,56],yt:[180,240,300],xf:v=>v+' h',yf:v=>v+'°',bands:[{x0:0,x1:56,y0:247.5,y1:270,col:band}],cursor:hrs,
        series:(B?[{pts:C.B.map(q=>[q[0],q[1]]),col:fz,w:1.6,dash:[5,4]}]:[]).concat([{pts:C.F.map(q=>[q[0],q[1]]),col:blue,w:2.2}]),
        marks:[{x:hrs,y:ESC.ampAt(drvF(hrs))/D2R,col:blue}].concat(B?[{x:hrs,y:ESC.ampAt(drvB(hrs))/D2R,col:fz,r:3}]:[]),texts:[{x:1,y:318,t:B?'swing: the fusee; dashed, a going barrel':'swing with the fusee'}]});}
    const now2=H.held?'':`<span>Now ${Math.round(A)}° each way, the escape wheel driven at ${Math.round(drv*100)}% of its torque${winding?' by the sustaining spring':''}; the escapement${ESC.settings.HS?' and hairspring':''} ${86400*(escK-1)>=0?'gain':'lose'}${ESC.settings.HS?'':'s'} ${Math.abs(86400*(escK-1)).toFixed(2)} s a day at this swing.</span>`;
    swOut.innerHTML=`<b>Isochronism check ${sg(C.isoF)} s</b>${now2}<span>With the fusee the rate stays within ${sg(C.spF[0])} to ${sg(C.spF[1])} s a day from full wind to run down; a going barrel with the same spring would range ${sg(C.spB[0])} to ${sg(C.spB[1])}, and its isochronism check would read ${sg(C.isoB)} s. While the key turns the sustaining spring alone would swing the balance ${Math.round(C.sus)}°.${MSET?` The mainspring’s set takes ${Math.round(MSET*100)}% off its pull, so the balance swings ${Math.round(ESC.ampAt(drvF(12))/D2R)}° at 12 h, not ${Math.round(ESC.A/D2R)}°.`:''}</span>`;}
  /* the mainspring's set: a slider in Swing and isochronism, kept in the link as mset=15 (per cent) */
  const msR=$('#msetR'),msShow=()=>{msR.nextElementSibling.textContent=MSET?Math.round(MSET*100)+'% weaker':'as new';};
  const msSet=v=>{v=clamp(Math.round(v),0,30)/100;if(v===MSET)return;MSET=v;msR.value=Math.round(v*100);msShow();rErr=0;pend.add('mainspring changed');swLast=0;wake();writeHash();};
  msR.addEventListener('input',()=>msSet(+msR.value));msShow();
  /* ---------- the 30-day performance test (Sec. IX, Performance Testing; the factory test card of No. 3390): six periods of five days, at 90, 72½, 55, 55, 72½ and 90 °F,
     the chronometer wound at each daily comparison and read on the comparator to 0.01 s. Each day's rate is the model's at that temperature: the weights and screws (√(I0/I)),
     the balance's temperature curve (tCurve) and the escapement's and hairspring's rate over the 24 hours after winding (gain, the fusee and the mainspring's set). The model
     has no day-to-day scatter, so its rating and recovery come from the comparator's rounding alone; the rest are the physics'. The isochronism check is Swing and isochronism's.
     The card's figures and the Bureau of Ships' limits beside it ---------- */
  const tsDet=$('#testDet'),tsOut=$('#testOut'),TS=[['I',90],['II',72.5],['III',55],['IV',55],['V',72.5],['VI',90]];let tsKey='',tsLast=0;
  const C3390={reg:0.09,dev:0.03,dif:0.14,t1:0.08,t2:0.06,t3:0.02,rec:0.06,iso:0.00};
  function testCalc(){const wK=Math.sqrt(I0/rI),e24=gain(drvF,24),r=T=>86400*(wK*(1+tCurve(T)/86400)*(1+e24/86400)-1),q=v=>Math.round(v*100)/100;
    let e=q(dialRead()-tM);const P=TS.map(([n,T])=>{const e0=e,rs=[];for(let d=0;d<5;d++){const e1=q(e+r(T));rs.push(q(e1-e));e=e1;}const m=(e-e0)/5,dv=rs.map(x=>Math.abs(x-m));return{n,T,e0,rs,m,dev:dv.reduce((a,b)=>a+b,0)/5,dif:Math.max(...rs)-Math.min(...rs)};});
    const M=k=>(P[k[0]].m+P[k[1]].m)/2,m90=M([0,5]),m72=M([1,4]),m55=M([2,3]),C=swCalc();
    return{P,reg:Math.max(...P.map(p=>Math.abs(p.m))),dev:P.reduce((a,p)=>a+p.dev,0)/6,dif:Math.max(...P.map(p=>p.dif)),t1:Math.abs(m90-m72),t2:Math.abs(m72-m55),t3:Math.abs(m90-m55),
      rec:Math.max(Math.abs(P[0].m-P[5].m),Math.abs(P[1].m-P[4].m),Math.abs(P[2].m-P[3].m)),iso:Math.abs(C.isoF)};}
  function testShow(now){if(!tsDet.open||now-tsLast<500)return;tsLast=now;const k=[rI,tE,R.balKind,ESC.run.rate,ESC.A,ESC.settings.HS,MSET].join();if(k===tsKey)return;tsKey=k;
    const R2=testCalc(),f=(v,n=2)=>(v>0?'+':v<0?'−':'±')+Math.abs(v).toFixed(n),L=[['reg','Regulation',1.55,'the largest mean daily rate of any period'],['dev','Rating',0.50,'the mean deviation of rates'],['dif','Largest difference',0.75,'between any two daily rates in the same period'],
      ['t1','90 / 72½ °F',0.75,'temperature compensation: the mean rates at 90 and 72½ °F apart'],['t2','72½ / 55 °F',0.75,'temperature compensation: the mean rates at 72½ and 55 °F apart'],['t3','90 / 55 °F',1.20,'temperature compensation: the mean rates at 90 and 55 °F apart'],
      ['rec','Recovery',0.70,'the largest difference between the mean rates of periods at the same temperature'],['iso','Isochronism',0.50,'the 12-hour rate against half the 24-hour rate, at 72½ °F']];
    const bad=L.filter(([k,,t])=>R2[k]>t);
    tsOut.innerHTML=`<p class="rate" style="margin:0 0 6px"><b>${bad.length?'Failed':'Passed'}</b><span>${bad.length?'Outside the limit: '+bad.map(x=>x[1].replace(/^[A-Z](?=[a-z])/,c=>c.toLowerCase())).join(', ')+'.':'Every figure within the Bureau of Ships’ limits.'}</span></p>`+
      '<table class="rt book"><thead><tr><th>Period</th><th class="n">°F</th><th>Daily rates</th><th class="n">Mean</th><th class="n">Dev.</th></tr></thead><tbody>'+
      R2.P.map(p=>`<tr><td>${p.n}</td><td class="n">${p.T===72.5?'72½':p.T}</td><td class="rs">${p.rs.map(x=>f(x)).join(' ')}</td><td class="n">${f(p.m)}</td><td class="n">${p.dev.toFixed(2)}</td></tr>`).join('')+'</tbody></table>'+
      '<table class="rt book" style="margin-top:8px"><thead><tr><th>Performance</th><th class="n">Model</th><th class="n" title="The factory test card of Hamilton No. 3390 (Sec. IX)">3390</th><th class="n">Limit</th></tr></thead><tbody>'+
      L.map(([k,n,t,w])=>`<tr><td title="${w}">${n}</td><td class="n${R2[k]>t?' bad':''}">${R2[k].toFixed(2)}</td><td class="n">${C3390[k].toFixed(2)}</td><td class="n">${t.toFixed(2)}</td></tr>`).join('')+'</tbody></table>';}
  tsDet.addEventListener('toggle',()=>{tsKey='';tsLast=0;testShow(performance.now());});
  if(/[?&]qa\b/.test(location.search))window.__test=testCalc;   /* for invariants.py: the test's figures as the card has them */
  $('#stopLook').addEventListener('click',()=>{if(kw)kwStop();if(st.tour>=0)tourEnd();jump(()=>setView('movement'));st.see=true;st.focus=new Set(['lockArm','tblock','bal','fw']);look();goCam({yaw:2.6,pitch:0.62,dist:95,target:mvL((L.B[0]+L.F[0])/2,-20,(L.B[1]+L.F[1])/2)});});
  /* wind with the key, on the wall clock so slow frames don't slow it: half turns of 0.7 s with a 0.3 s pause to change grip, until the chain pushes the stop-bar in the fusee top out against
     the winding stop. Plates see-through, the winding stop kept solid (look), the parts that take part in winding picked out */
  const HT=0.5/FUSEE_PER_HOUR,kwBtn=$('#kwBtn'),kwOut=$('#kwOut'),KWF=['fusee','chain','sq','barrel','mainspring','gw','sratchet','sspring','spawl'];
  const KWV=()=>{const f=1+3.6/Math.hypot(...L.Fu);return{yaw:0.53,pitch:0.32,dist:120,target:mvL(L.Fu[0]*f,-36,L.Fu[1]*f)};};   /* key and fusee, from the winding stop's side */
  const halfs=v=>Math.abs(v*2-Math.round(v*2))<0.02?(Math.floor(v+0.01)||'')+(v%1>0.25?'½':''):v.toFixed(1);
  function kwStart(){if(kw){kwStop();return;}if(st.tour>=0)tourEnd();closeInfo();
    if($('#kwFull').checked||hrs<0.2)hrs=RUN_H;   /* run down: the chain all on the barrel, 17½ half turns to wind */
    kw={t0:performance.now(),t:0,h0:hrs,end:0};winding=true;st.drive=false;jump(()=>setView('movement'));st.see=true;st.focus=new Set(KWF);look();
    goCam(KWV());
    kwBtn.textContent='Stop winding';kwBtn.setAttribute('aria-pressed','true');kwOut.classList.remove('hidden');}
  function kwStop(){if(kw&&kw.zoom)goCam(KWV());kw=null;winding=false;st.focus=null;look();kwBtn.textContent='Wind with the key';kwBtn.setAttribute('aria-pressed','false');}
  function kwStep(now){kw.t=(now-kw.t0)/1000;if(kw.end){if(kw.t>kw.end)kwStop();return;}
    const i=Math.floor(kw.t),tot=kw.h0/HT;hrs=Math.max(0,kw.h0-HT*(i+smooth(Math.min(1,(kw.t-i)/0.7))));showH();
    if(!kw.zoom&&hrs<(R.fs.mF+0.25)/FUSEE_PER_HOUR){kw.zoom=true;goCam({yaw:0.53,pitch:0.6,dist:58,target:mvL(L.Fu[0],-20.5,L.Fu[1])});}   /* close in on the fusee top before the chain reaches the stop-bar's nose, for the catch */
    if(hrs===0){kw.end=kw.t+3;kwOut.innerHTML=`<b>Fully wound after ${halfs(tot)} half turns.</b> The chain has pushed the stop-bar in the fusee top out against the winding stop under the barrel bridge, and the key can turn no further.`;}
    else kwOut.innerHTML=`Half turn <b>${Math.min(Math.ceil(tot),i+1)}</b> of ${halfs(tot)}, counterclockwise. ${(RUN_H-hrs).toFixed(1)} h of running stored. The sustaining spring drives the train meanwhile.`;}
  kwBtn.addEventListener('click',kwStart);
  function partsSync(){for(const q of PROWS){const k=q.p,p=kp(k),h=k!==p?st.hid.has(k)||st.hid.has(p)||isoOut(p,k):st.hid.has(p)||isoOut(p);q.ck.checked=!h;q.row.classList.toggle('off',h);
      if(q.kids){q.ck.indeterminate=!h&&q.kids.some(x=>st.hid.has(x.p)||isoOut(p,x.p));if(st.pick!==q.seen){q.seen=st.pick;if(st.pick&&kp(st.pick)===p)fold(q,true);}}   /* a part or piece of it picked: its fold opens, once */
      q.b.setAttribute('aria-pressed',st.pick===k?'true':'false');q.b.disabled=st.drive&&(BOXP.has(p)||DRIVE_HIDE.has(p));}plist.classList.toggle('colr',st.colr);plist.classList.toggle('csrc',st.csrc);}
  const fsb=$('#fs');if(!(document.fullscreenEnabled||document.webkitFullscreenEnabled))fsb.classList.add('hidden');
  fsb.addEventListener('click',()=>{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}else{(stage.requestFullscreen||stage.webkitRequestFullscreen).call(stage);}});
  /* Hide panel (P, or the tab on the stage's edge): the stage takes the panel's column, remembered here; the walkthrough and a link opening a panel section bring it back. Offered only where the panel sits beside the stage (style.css) */
  const pnb=$('#panelBtn'),panelSide=()=>getComputedStyle(pnb).display!=='none',panelOn=on=>{document.documentElement.classList.toggle('nopanel',!on);pnb.textContent=on?'›':'‹';pnb.setAttribute('aria-label',on?'Hide the panel':'Show the panel');pnb.title=(on?'Hide the panel, for a larger model':'Show the panel')+' (P)';pnb.setAttribute('aria-expanded',on?'true':'false');keep('nopanel',!on);};
  if(SET.nopanel)panelOn(false);pnb.addEventListener('click',()=>panelOn(document.documentElement.classList.contains('nopanel')));
  /* the panel's width (wide windows): drag the line in the gap between the model and the panel, or the arrow keys on it; double-click for the usual 350 px.
     Remembered in cm-set (pw); style.css keeps it between 320 and 640 px and leaves the stage 600 px (--pwc), whatever is kept */
  const spl=$('#split'),PW0=350,pwMax=()=>Math.max(320,Math.min(640,innerWidth-658));let spD=null;
  const pwSet=(w,save)=>{w=Math.round(clamp(w,320,pwMax()));document.documentElement.style.setProperty('--pw',w+'px');spl.setAttribute('aria-valuenow',w);spl.setAttribute('aria-valuemax',pwMax());if(save){keep('pw',w===PW0?undefined:w);if(insetCv)setInset(insetKind);}};
  pwSet(+SET.pw||PW0);
  spl.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();spD={x:e.clientX,w:$('#panel').offsetWidth};try{spl.setPointerCapture(e.pointerId);}catch(_){}spl.classList.add('on');document.documentElement.classList.add('splitting');});
  spl.addEventListener('pointermove',e=>{if(spD)pwSet(spD.w-(e.clientX-spD.x));});
  const spUp=()=>{if(!spD)return;spD=null;spl.classList.remove('on');document.documentElement.classList.remove('splitting');pwSet($('#panel').offsetWidth,true);};spl.addEventListener('pointerup',spUp);spl.addEventListener('pointercancel',spUp);
  spl.addEventListener('dblclick',()=>pwSet(PW0,true));
  spl.addEventListener('keydown',e=>{const d={ArrowLeft:20,ArrowRight:-20}[e.key];if(d){e.preventDefault();pwSet($('#panel').offsetWidth+d,true);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();pwSet(e.key==='Home'?320:pwMax(),true);}});
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
  {let hk=null;mv.traverse(o=>{if(o.userData.hookNose)hk=o;});if(hk)addL('Chain hook','into the barrel’s wall','chain',()=>hk.getWorldPosition(new THREE.Vector3()),'mv');}   /* the chain's barrel end (Figs. 17, 75), named as the barrel turns it into view */
  addL('Fusee wheel',`${TRAIN.fu} teeth, 1 turn / ${turnT(GW_TURN)}`,'gw',pw(P.gw,L.Fu[0]+14,-6.5,L.Fu[1]-11),'mv');addL('Centre wheel',`${TRAIN.cw} teeth, 1 turn / ${per(ESC_PER.cw*ESC_TURN)}`,'cw',pw(P.cw,-8,-5.36,-8),'mv');addL('Third wheel',`${TRAIN.tw} teeth, 1 turn / ${per(ESC_PER.tw*ESC_TURN)}`,'tw',pw(P.tw,L.T[0]-9,-4.535,L.T[1]+5),'mv');
  addL('Fourth wheel',`${TRAIN.fw} teeth, 1 turn / ${per(ESC_PER.fw*ESC_TURN)}`,'fw',pw(P.fw,L.F[0]-7,-7.46,L.F[1]+5),'mv');addL('Upper train bridge','','trainBridge',pw(P.trainBridge,-20,TB_T,24),'mv');addL('Barrel bridge','','barrelBridge',pw(P.barrelBridge,-16,BB_T,-18),'mv');
  addL('Sustaining pawl','','spawl',pw(R.spawl,-2.5,0,0),'mv');addL('Sustaining ratchet','','sratchet',pw(P.sratchet,L.Fu[0]+13,-9.45,L.Fu[1]+9),'mv');addL('Balance lower bridge','','lowerBridge',pw(P.lowerBridge,-1.5,LB_T,15),'mv');
  addL('Up/down indicator','','hands',pwo(P.hands,R.ud,-L.Ud[0],6,-36-L.Ud[1]),'dial');addL('Seconds','','hands',pwo(P.hands,R.sec,-10-L.F[0],6,34-L.F[1]),'dial');addL('Gimbal ring','','ring',pw(BX.ring,BX.RO,8,0),'box');
  addL('Bowl','','bowl',pw(BX.bowl,-BX.CR*0.7,-40,BX.CR*0.7),'box');addL('Winding key','','key',pw(BX.root,76,-5,-76),'box');addL('Gimbal latch','','latch',pw(BX.root,80,-13,76),'box');
  addL('Cannon pinion',`${MW.cp} leaves · minute hand`,'motion',pw(P.motion,0,8.5+DD,0),'motion');addL('Hour wheel',`${MW.hw} teeth · hour hand`,'motion',pw(P.motion,-5.5,2.65,5.5),'motion');addL('Minute wheel',`${MW.mw} / ${MW.mp}`,'motion',pw(P.motion,L.Mw[0]+6,1.2,L.Mw[1]+4),'motion');addL('Up/down wheel',`${UD.wheel} teeth`,'motion',pwo(P.motion,R.udW,11,1.5,0),'motion');

  /* ---------- walkthrough ---------- */
  const inset=$('#tInset');let insetKind=null,insetCv=null,insetCtx=null,trace=[];
  function setInset(kind){insetKind=kind;inset.innerHTML='';insetCv=null;trace=[];
    if(kind==='fusee'||kind==='esc'||kind==='bal'){insetCv=document.createElement('canvas');inset.appendChild(insetCv);
      if(kind==='fusee')inset.insertAdjacentHTML('beforeend','<div class="note" style="display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px"><span><b style="color:#c0392b">―</b> spring pull</span><span><b style="color:#2e6bd8">―</b> chain radius on the fusee</span><span><b style="color:var(--brass)">―</b> torque = pull × radius</span><span><b style="color:var(--muted)">- -</b> a going barrel</span></div>');
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
    {t:'Stored energy: the mainspring',x:'<p>A long, powerful mainspring is coiled in the barrel. The barrel arbor never turns in use: the setup ratchet and pawl on the barrel bridge hold it. The spring’s outer end turns the barrel clockwise, and the barrel draws the chain off the fusee; the chain’s end hooks into a hole in the barrel’s wall, named as the barrel brings it round.</p><p>Wound, the coils draw in round the arbor, leaving a gap at the wall; as it runs down they spread out toward the wall. At 3600× one hour passes each second.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-1.58,pitch:0.62,dist:140,target:mvL(L.Ba[0],-15,L.Ba[1])},speed:3600,focus:['barrel','mainspring','chain','ratchet','fusee'],inset:'power'},
    {t:'Constant force: the fusee',x:`<p>A mainspring exerts more force fully wound than partly run down, so the fusee is shaped to keep the moment on the fusee wheel about the same throughout. The chain pulls on the small end while the spring is strongest and on the large end once it has weakened.</p><p>The balance’s arc, and so its rate, stays practically equal all the time. The profile is the one photographed: the radius grows from ${R.fs.rf(0).toFixed(1)} to ${R.fs.rf(FUSEE_TURNS).toFixed(1)} mm over 8¾ turns, the shape that evens out a pull falling in step with the barrel’s turns. A real spring departs a little from that, so the torque keeps a small residual (the spring drawn is illustrative); the dashed line is what a going barrel with the same spring would deliver.</p>`,
      drive:true,v:{lift:1,flip:1,explode:0,yaw:-0.35,pitch:0.35,dist:150,target:mvL((L.Fu[0]+L.Ba[0])/2,-14,(L.Fu[1]+L.Ba[1])/2)},speed:3600,focus:['fusee','chain','barrel','mainspring','gw'],inset:'fusee'},
    {t:'Winding without stopping',x:'<p>The key turns the fusee arbor counterclockwise. That would cut the power to the train, but the sustaining spring, pinned between the sustaining ratchet wheel and the fusee wheel and always under load, keeps driving the fusee wheel, so the wheel and the train run on while the fusee turns back. The sustaining pawl stops the ratchet wheel from turning back, so the spring can only release forward. It will drive the chronometer for five to ten minutes.</p><p>At full wind the chain presses one end of the winding stop-bar in the fusee top; the other end moves out and catches the winding stop under the barrel bridge. Seven half turns restore a day’s running.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.53,pitch:0.55,dist:125,target:mvL(L.Fu[0],-13,L.Fu[1])},speed:60,focus:['gw','sratchet','sspring','spawl','fusee','sq','chain','cw'],inset:'wind'},
    {t:'The going train',x:'<p>The fusee wheel drives the centre wheel pinion; the centre wheel drives the third wheel pinion; the third drives the fourth wheel pinion; the fourth meshes with the escape pinion. The centre wheel turns once an hour; the fourth once a minute, carrying the second hand.</p><p>Every mesh here is in phase: a tooth of each driver sits in a gap of the pinion it drives.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:0.25,pitch:1.0,dist:200,target:mvL(0,-10,8)},speed:1,focus:['gw','cw','tw','fw','escW','fusee'],inset:'train'},
    {t:'The detent escapement',x:'<p>The escape wheel is held by the locking jewel on the detent. As the balance swings one way, the unlocking jewel meets the trip spring, which bends aside and lets it pass: nothing else moves. Swinging back, the unlocking jewel strikes the trip spring again; now the abutment arm holds it, so the trip spring and detent move aside together and release the wheel.</p><p>A tooth drops into the crescent of the impulse roller, catches up with the impulse jewel and drives the balance; the detent springs back in time to lock the next tooth. One impulse per oscillation, so the hands advance in half-second steps.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:1.9,pitch:-0.75,dist:70,target:mvL((L.B[0]+L.E[0])/2,-18.5,(L.B[1]+L.E[1])/2)},speed:0.05,focus:['escW','det','bal'],inset:'esc'},
    {t:'The balance and hairspring',x:'<p>The balance is a solid, uncut stainless-steel rim silver-soldered to an Invar arm. Invar barely expands, so the rim’s diameter at the arm ends stays fixed while the rest of the rim moves with temperature; screws placed nearer or farther from the arm set the compensation. Free of the centrifugal effects of a split rim, it can swing 1⅜ to 1½ turns.</p><p>The cylindrical hairspring is Hamilton Elinvar, with good thermo-elastic qualities and minimum isochronal error. There is no regulator: rate is set with balance screws, timing weights and vernier weights. The older split bimetallic balance is available under Balance.</p>',
      drive:true,v:{lift:1,flip:1,explode:0,yaw:2.27,pitch:0.35,dist:118,target:mvL(L.B[0],-29,L.B[1])},speed:0.05,focus:['bal','spr','cock'],inset:'bal'},
    {t:'Hands and the wind indicator',x:`<p>The centre wheel staff carries the minute hand and, through the motion work, the hour hand; the fourth wheel staff carries the second hand.</p><p>A pinion on the dial end of the fusee arbor drives the wind indicator wheel. Here an ${UD.pin}-leaf pinion and a ${UD.wheel}-tooth wheel take the hand across the UP–DOWN scale as the fusee makes its ${(56*FUSEE_PER_HOUR).toFixed(1)} turns in 56 hours.</p>`,
      drive:true,mw:true,v:{lift:1,flip:0,explode:0,yaw:0.2,pitch:1.05,dist:170,target:mvL(-3,3,-6)},speed:3600,focus:['motion','hands','cw','fusee','gw'],inset:'motion'}];
  const dots=$('#tDots');dots.innerHTML=TOUR.map(()=>'<i></i>').join('');
  /* the viewer's own settings, kept when the walkthrough starts and given back when it ends */
  let preTour=null;
  function tourGo(i){panelOn(true);if(ks)ksEnd();sw=null;if(st.tour<0)preTour={view:st.view,see:st.see,rock:st.rock,latch:st.latch,speed:st.speed,drive:st.drive,mwOn:st.mwOn};st.tour=i;const s=TOUR[i];closeInfo();showHelp(false);hintOff();
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
    if(insetKind==='power'){const el=$('#pw');if(el){const I=R.fs.Ib(n),pull=R.fs.pull(n);el.innerHTML=`Barrel has turned <b>${I.toFixed(2)}</b> of ${R.fs.IN.toFixed(2)} turns. Spring pull <b>${Math.round(pull*100)}%</b> of full. ${(RUN_H-hrs).toFixed(1)} h of running left.`;}}
    else if(insetKind==='train'){const P2=ESC.P,esc=E*P2,v={ew:esc/TAU,fw:esc/ESC_PER.fw/TAU,tw:esc/ESC_PER.tw/TAU,cw:esc/ESC_PER.cw/TAU,gw:esc/ESC_PER.gw/TAU};inset.querySelectorAll('td[data-k]').forEach(td=>td.textContent=(((v[td.dataset.k]%1)+1)%1*360).toFixed(td.dataset.k==='gw'?2:1)+'°');}
    else if(insetCv){const ctx=insetCtx,w=insetCv._w,h=insetCv._h;
      if(insetKind==='esc'){drawEsc2D(ctx,w,h,s,E,dk);}
      else if(insetKind==='fusee'){ctx.clearRect(0,0,w,h);const L0=34,R0=10,T0=12,B0=28,pw=w-L0-R0,ph=h-T0-B0,X=x=>L0+x/RUN_H*pw,Y=y=>T0+(1-y/1.6)*ph;
        ctx.font='11px "Instrument Sans",sans-serif';ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.lineWidth=1;
        for(const x of[0,14,28,42,56]){ctx.beginPath();ctx.moveTo(X(x),T0);ctx.lineTo(X(x),T0+ph);ctx.stroke();ctx.textAlign='center';ctx.fillText(x+' h',X(x),h-12);}
        for(const y of[0,0.5,1,1.5]){ctx.beginPath();ctx.moveTo(L0,Y(y));ctx.lineTo(L0+pw,Y(y));ctx.stroke();ctx.textAlign='right';ctx.fillText(Math.round(y*100)+'%',L0-4,Y(y)+4);}
        const F=R.fs,nn=q=>q*FUSEE_PER_HOUR,f=[[drvB,dk?'#5b656e':'#9aa3ab','a going barrel',[5,4]],[q=>F.pull(nn(q)),'#c0392b','spring pull'],[q=>F.rf(nn(q))/F.rf(FUSEE_TURNS),'#2e6bd8','radius on the fusee'],[drvF,dk?'#e0b44f':'#8a5d10','torque (pull × radius), 1 at 12 h']];   /* the spring illustrative (makeFusee) */
        f.forEach(([fn,col,nm,ds])=>{ctx.strokeStyle=col;ctx.lineWidth=ds?1.6:2.2;ctx.setLineDash(ds||[]);ctx.beginPath();for(let i=0;i<=100;i++){const q=RUN_H*i/100,yy=fn(q);i?ctx.lineTo(X(q),Y(yy)):ctx.moveTo(X(q),Y(yy));}ctx.stroke();ctx.setLineDash([]);
          ctx.fillStyle=col;ctx.beginPath();ctx.arc(X(hrs),Y(fn(hrs)),ds?3:4,0,TAU);ctx.fill();});
      }
      else if(insetKind==='bal'){const win=0.5*(st.speed<=0.05?1:2);ctx.clearRect(0,0,w,h);const tb=H.held?H.bph*0.5:tSim+H.bOff*0.5,X=t=>8+(1-(tb-t)/win)*(w-16),Y=th=>h/2-th/(270*D2R)*(h/2-16);   /* tb: the balance's own time, which runs on while the train is held */
        ctx.strokeStyle=dk?'#2a323a':'#dde1e4';ctx.beginPath();ctx.moveTo(8,h/2);ctx.lineTo(w-8,h/2);ctx.stroke();
        const N=240,pts=[];for(let i=0;i<=N;i++){const t=tb-win+win*i/N,q=t/0.5-Math.floor(t/0.5),z=ESC.state(q,H.amp);pts.push([t,z.th,!H.held&&z.prog>0&&z.prog<1]);}
        ctx.fillStyle=dk?'rgba(224,180,79,.35)':'rgba(184,134,11,.28)';for(const q of pts)if(q[2])ctx.fillRect(X(q[0])-1,10,2.5,h-26);
        ctx.strokeStyle=dk?'#91adf2':'#26479c';ctx.lineWidth=2;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(X(q[0]),Y(q[1])):ctx.moveTo(X(q[0]),Y(q[1])));ctx.stroke();
        ctx.fillStyle=dk?'#e4e8eb':'#141a20';ctx.beginPath();ctx.arc(X(tb),Y(s.th),4,0,TAU);ctx.fill();
        ctx.fillStyle=dk?'#9aa4ad':'#5b656e';ctx.font='11px "Instrument Sans",sans-serif';ctx.textAlign='left';ctx.fillText('balance angle over the last '+win+' s; shaded = impulse',8,h-6);
        ctx.textAlign='right';ctx.fillText('+'+Math.round(ESC.A/D2R)+'°',w-8,16);}
    }
  }

  /* ---------- label placement ---------- */
  const ray2=new THREE.Raycaster(),tmpV=new THREE.Vector3(),camP=new THREE.Vector3();let lastOcc=0;ray2.layers.enable(2);
  const lsorted=()=>labels.slice().sort((p,q)=>(PRI[q.part]||1)-(PRI[p.part]||1));let LS=null;
  function placeLabels(now){
    if(!LS)LS=lsorted();
    const foc=st.pick?new Set([st.pick]):st.focus,doOcc=now-lastOcc>200;if(doOcc)lastOcc=now;
    const placed=cuOn?[cuRect()]:[],pad=3;   /* the labels keep off the close-up */
    for(const l of LS){
      /* off by default; the walkthrough always names the parts of its step */
      let show=(st.labels||st.tour>=0)&&(l.grp==='mv'?(cur.lift>0.8||st.drive)&&cur.flip>0.8:l.grp==='motion'?st.drive&&st.mwOn&&cur.flip<0.3:l.grp==='dial'?cur.lift<0.1&&cur.lidM>0.9&&!st.drive:cur.lift<0.1&&cur.lidT>0.9&&!st.drive);
      if(show&&foc&&!anyOf(foc,l.part))show=false;
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
     #view=escapement&speed=0.05&part=det, #tour=6 (a walkthrough step), drive=1 (moving parts only), draw=1 or draw=ink (the tinted or ink drawing), edges=0 (Edges off; it is on by default), shadows=1 (Shadows on; off by default), merge=0 (Performance mode off; on by default), sec=x:-3.5 (a section; :f shows the other half),
     tz=local, t=12:00:00 (only once the hands have been set). #essay or #essay=detent: the essay (essay.js), at a section; open=bookDet (in a link only): open that panel section.
     Read at load and when the hash is edited; written 0.3 s after any change, with replaceState, so the back button isn't filled with views */
  function hashOf(){if(ESSAY.on()){const s=ESSAY.section();return s?'essay='+s:'essay';}const h=new URLSearchParams();
    if(st.tour>=0)h.set('tour',st.tour+1);
    else{if(st.view!=='dial')h.set('view',st.view);if(st.drive)h.set('drive',1);if(st.speed!==1)h.set('speed',+st.speed.toPrecision(3));if(secMode!=='off')h.set('sec',secMode+':'+(+secOff.toFixed(2))+(secFlip?':f':''));}
    if(st.pick)h.set('part',st.pick);if(st.draw)h.set('draw',st.draw==='ink'?'ink':1);if(st.colr||st.csrc)h.set('colr',st.csrc?'src':'part');if(!st.edges)h.set('edges',0);if(st.shadows)h.set('shadows',1);if(!st.merge)h.set('merge',0);if(tz!=='gmt')h.set('tz',tz);if(handsSet)h.set('t',todIn.value);if(H.armT)h.set('arm',1);if(H.blkT)h.set('block',1);const bd=benchDiff();if(bd.length)h.set('esc',bd.map(([k])=>k+':'+bset[k]).join(','));const bs=balStr();if(bs)h.set('bal',bs);if(MSET)h.set('mset',Math.round(MSET*100));return h.toString().split('%3A').join(':').split('%2C').join(',');}
  /* hashSeen: the hash as last written or applied here. If it has changed since (edited, or a link followed), the page hasn't applied it yet: leave it for hashchange */
  function writeHash(){if(!hashReady)return;clearTimeout(hashT);hashT=setTimeout(()=>{remSave();if(location.hash.slice(1)!==hashSeen)return;const h=hashOf();if(h!==hashSeen){history.replaceState(null,'',h?'#'+h:location.pathname+location.search);hashSeen=location.hash.slice(1);}},300);}
  /* first: at load, when the opening move to the view is still to come (it goes to the view returned) */
  function applyHash(first){hashSeen=location.hash.slice(1);const h=new URLSearchParams(hashSeen),g=k=>h.get(k),own=(o,k)=>k!=null&&Object.prototype.hasOwnProperty.call(o,k),v=own(VIEWS,g('view'))?g('view'):first&&!g('tour')&&own(VIEWS,SET.view)?SET.view:'dial';   /* own keys only: 'constructor' is no view or part. At load, no view in the hash: the last one seen here */
    if(h.has('essay')){ESSAY.show(true,g('essay'));return v;}ESSAY.show(false);   /* the essay: the model underneath is left as it is */
    if(g('tz')==='gmt'||g('tz')==='local'){if(g('tz')!==tz)setTz(g('tz'));}
    if(g('t'))setTod(g('t'));
    { const a=g('arm')==='1'?1:0,b=g('block')==='1'?1:0;if(a!==H.armT){armSet(a);H.arm=a;if(a)H.amp=0;}if(b!==H.blkT){blkSet(b);H.blk=b&&!R.blockClear(lastE??0)?Math.min(b,R.tbs.userData.vFace-0.005):b;} }   /* locked in a link: the balance is at rest */
    { const q={...BDEF};for(const kv of(g('esc')||'').split(',')){const[k,v]=kv.split(':');if(own(BDEF,k)&&Number.isFinite(+v)){const b=BENCH.find(x=>x[0]===k);q[k]=clamp(+v,b[2],b[3]);}}
      if(BENCH.some(([k])=>q[k]!==bset[k])){Object.assign(bset,q);benchApply();if(first&&!H.armT)H.amp=ESC.ampAt(driveNow());} }   /* esc=rT:0.29,aI:185: the adjuster's bench, where it differs from the model's settings; at load the balance is already swinging as they make it */
    balApply(g('bal')||'');   /* bal=...: the balance's weights and screws (balStr) */
    msSet(+(g('mset')||0)||0);   /* mset=15: the mainspring's set, per cent */
    const ed=g('edges')!=='0',shd=g('shadows')==='1',mg=g('merge')!=='0';   /* Edges and Performance mode are on by default, Shadows off: the hash says edges=0, merge=0 or shadows=1 only against that */
    const dw=g('draw')==='1'?'tint':g('draw')==='ink'?'ink':false;
    if(dw!==st.draw||ed!==st.edges||shd!==st.shadows||mg!==st.merge||(g('colr')==='part')!==st.colr||(g('colr')==='src')!==st.csrc){st.draw=dw;st.edges=ed;st.shadows=shd;st.merge=mg;st.colr=g('colr')==='part';st.csrc=g('colr')==='src';look();}   /* colr=part or colr=src: the colour modes */
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
    const od=DET.find(d=>d.id===g('open'));if(od){panelOn(true);od.open=true;setTimeout(()=>od.scrollIntoView({block:'nearest',behavior:RM.matches?'auto':'smooth'}),first?1200:50);}   /* open=bookDet: a link from the essay to a panel section */
    return v;}
  addEventListener('hashchange',()=>applyHash(false));
  for(const k of['finish','dial','bal','stop']){const b=[...document.querySelectorAll(`#${k==='dial'?'dialSt':k==='stop'?'stopV':k} button`)].find(x=>x.dataset.v===SET[k]);if(b&&b.getAttribute('aria-pressed')!=='true')b.click();}
  {const s=location.hash.slice(1)?'':lsGet('cm-state');if(s)history.replaceState(null,'','#'+s);}   /* no hash: the settings remembered, as if they were one */
  const startView=applyHash(true);

  /* ---------- gimbals with inertia (2.5 in IDEAS.md): the case (with the ring, about the ring's pivots) hangs as a pendulum below each axis, its angle ψ from the vertical:
     ψ'' = -ω0² ψ - 2ζω0 (ψ' - φ'), φ the box's angle, the pivots' friction pulling it after the box. Rolling slowly the case stays level; near its own period (GW0, about 0.7 s:
     the case and movement's weight some 15 mm below the pivots, their radius of gyration about 45 mm, estimated) it can't, and it swings with the box. ζ estimated. The box rolls
     about the pivots, so they don't move; a jolt kicks the case. Latched (fr 0) it goes with the box; ?snap and reduced motion keep it exactly level, as before ---------- */
  const GW0=TAU/0.7,GZ=0.05,GM={p:[0,0],r:[0,0],lp:0,lr:0};
  const gimKick=v=>{GM.r[1]+=v;GM.p[1]+=v*0.3;};
  function gimStep(dt,ph,rl,fr){const inst=SNAP||RM.matches;if(inst||dt<=0){if(inst){GM.p=[0,0];GM.r=[0,0];}GM.lp=ph;GM.lr=rl;return;}
    const n=Math.ceil(dt/0.002),h=dt/n,vp=(ph-GM.lp)/dt,vr=(rl-GM.lr)/dt;
    for(const[q,v,f0]of[[GM.p,vp,GM.lp],[GM.r,vr,GM.lr]]){if(fr<1e-3){q[0]=f0+v*dt;q[1]=v;continue;}for(let i=0;i<n;i++){q[1]+=h*(-GW0*GW0*q[0]-2*GZ*GW0*(q[1]-v));q[0]+=h*q[1];}
      const f=f0+v*dt,lim=25*D2R;if(Math.abs(q[0]-f)>lim){q[0]=f+Math.sign(q[0]-f)*lim;q[1]=v;}}   /* the case stops against the ring 25 degrees off the box */
    GM.lp=ph;GM.lr=rl;}
  /* ---------- loop ---------- */
  const SNAP=/[?&]snap\b/.test(location.search),REAL_X=5,WIND_X=10;   /* REAL_X: the fastest speed at which the balance is drawn swinging as it really does. WIND_X: the fastest model time runs while winding, so a wind
     (17½ half turns of the key in about 17 s, or Wind in 4 s) takes at most 3 min of model time, well inside the 5 to 10 minutes the sustaining spring drives the train (Sec. IV) */
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
    const run=hrs<RUN_H,dtS=dt*(winding?Math.min(st.speed,WIND_X):st.speed);tM+=dtS;
    if(kw)kwStep(now);else if(winding){hrs=Math.max(0,hrs-dt*14);if(hrs===0)winding=false;showH();}
    if(winding)lpEnd=now+2000;{const ph=winding?'w':now<lpEnd?'r':'';if(ph!==lpPh){lpPh=ph;look();cuShow();}}   /* the load path's phase: winding, then 2 s of the mainspring's drive again */
    tVis+=dt;stopMove(dt);
    const brake=H.arm>0.75,drv=driveNow();ampStep(dtS*rateK,brake,run&&!H.held,drv);   /* the arm's finger is beside the timing weight from about three quarters of its turn */
    if(!H.held&&H.amp>=ESC.AMIN){const r=ESC.rateAt(H.amp,drv);if(Number.isFinite(r))escK=1+r/86400;}rateK=rateW*escK;swRec(now,drv);   /* the escapement's share at this swing and torque */
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
    if(H.held){H.bph+=dtS*rateW/0.5;const p=((H.bph%1)+1)%1;s=ESC.state(p,H.amp);s.p=p;E=H.Eh;   /* ESC.state leaves the detent alone in a swing too small to pass the trip spring */
      const lockedP=s.prog<=0||s.prog>=1;
      if(run&&!brake&&H.amp>=ESC.AMIN&&!(blockedNow()&&H.Eh+1>Math.floor(H.Eh+R.blockRoom(H.Eh)+1e-6))&&(lockedP||st.speed>REAL_X)){H.held=false;   /* the train goes again, from where the balance is, unless the dog point leaves it no whole beat (the hold's own test: a fractional beat at speed must not free it) */
        H.bOff=(((H.bph-tSim/0.5)%1)+1)%1;if(st.speed>REAL_X)H.eOff=H.Eh-(tSim/0.5+H.bOff);else{const x=tSim/0.5+H.bOff;H.eOff=H.Eh-(Math.floor(x)+(s.prog>=1?1:0));}}}
    if(st.sound&&st.speed<=1&&lastE!=null&&Math.floor(E-0.5)>Math.floor(lastE-0.5))tick();
    lastE=E;const n=hrs*FUSEE_PER_HOUR;if(benchQ)benchApply();if(ks)ksStep(dt);else if(sw)ssStep(dt);ssLabel();
    if(H.held!==wasHeld){if(loaded)pend.add(H.held?(run?'stopped':'not wound'):'started');wasHeld=H.held;}   /* remarks for the rate book */
    {const d=dayOf(tM);if(d!==bookDay){if(d>bookDay)bookAdd();bookDay=d;}}bookLive(now);   /* after the train has moved, so the hands and the master are of the same moment */
    mv.userData.update({E,th:s.th,lift:s.lift,psDef:s.psDef,n,winding,slip,hkeyOn:!!ks,blk:H.blk,arm:H.arm,keyOn:winding&&(cur.lift>0.8||st.drive),ssX:st.ssx?20:0,dt,springOn:cur.lift>0.3||st.drive||secMode!=='off'||st.hid.size>0||!!st.iso||Object.keys(st.op).length>0,msOn:msShown()});
    {const T=(winding&&(cur.lift>0.8||st.drive))?0:BX.shRest;BX.shield.userData.turn(SNAP?T:lerp(BX.shield.rotation.y,T,1-Math.exp(-dt*(T?12:6))));}   /* the shield plate turns to admit the key; its return spring brings it back */
    BX.mid.rotation.x=-cur.lidM*1.6;BX.top.rotation.x=-Math.max(0,cur.lidT*1.92-cur.lidM*1.6);   /* outer lid angle is relative to the glass lid it is hinged to */
    mv.userData.explode(smooth(cur.explode));mv.userData.develop(smooth(cur.dev));if(cam.fov!==cur.fov){cam.fov=cur.fov;cam.updateProjectionMatrix();}
    if((cur.dev>0.02)!==devShown){devShown=cur.dev>0.02;look();}
    const L1=smooth(cur.lift/0.55),L2=smooth((cur.lift-0.35)/0.65);mv.position.y=L1*130+L2*95;mv.rotation.x=Math.min(smooth(cur.flip),L2)*Math.PI;
    const wR=TAU/(+$('#rollP').value||7);if(st.rock)rockT+=dt*wR;const a=st.rock?14*D2R:0;roll=lerp(roll,a*Math.sin(rockT),st.rock?1:k);pitch=lerp(pitch,a*0.55*Math.sin(rockT*0.7+1.1),st.rock?1:k);   /* pitch at 0.7 the roll's rate */
    const jt=H.jT>0?(now-H.jT)/1000:1;const jk=jt<0.25&&!RM.matches?H.jS*2.5*D2R*Math.sin(Math.PI*jt/0.25)*(1-jt/0.25):0;if(jt>=1)H.jT=0;   /* a jolt knocks the box over and back in a quarter second */
    /* latching: the ring and case are brought level with the box, then the lever swings in; released, the reverse. Latched, they tilt with the box */
    latchK=SNAP||RM.matches?+st.latch:clamp(latchK+(st.latch?1:-1)*dt*1.2,0,1);const fr=1-smooth(Math.min(1,latchK*2));
    const tw=H.twT<0||RM.matches?0:(now-H.twT)/1000;if(tw>0.5)H.twT=-1;   /* the twist that starts it: the box turned sharply and back */
    gimStep(dt,pitch,roll+jk,fr);
    BX.root.rotation.set(pitch,tw>0&&tw<0.5?0.2*Math.sin(Math.PI*tw/0.5)*(1-tw/0.5):0,roll+jk,'ZYX');BX.ring.rotation.x=(GM.p[0]-pitch)*fr;BX.bowl.rotation.z=(GM.r[0]-roll-jk)*fr;BX.latch.rotation.y=lerp(LATCH_OFF,LATCH_ON,smooth(Math.max(0,latchK*2-1)));
    BX.root.updateMatrixWorld(true);if(secMode!=='off')secPlane.copy(secLocal).applyMatrix4(mv.matrixWorld);
    if(G.follow)G.target.copy(G.follow()).add(panO);
    if(st.spin&&!ptrs.size){G.yaw+=dt*0.2;if(camFree)C.yaw+=dt*0.2;}
    C.target.lerp(G.target,Math.min(1,k*1.5));if(!camFree){C.yaw+=(G.yaw-C.yaw)*k;C.pitch+=(G.pitch-C.pitch)*k;}C.dist+=(G.dist-C.dist)*k;
    const cp=Math.cos(C.pitch);cam.position.set(C.target.x+C.dist*cp*Math.sin(C.yaw),C.target.y+C.dist*Math.sin(C.pitch),C.target.z+C.dist*cp*Math.cos(C.yaw));cam.lookAt(C.target);
    key.position.copy(C.target).add(new THREE.Vector3(160,420,240));key.target.position.copy(C.target);
    const sz=clamp(C.dist*0.45,60,260);if(scam.right!==sz){scam.left=-sz;scam.right=sz;scam.top=sz;scam.bottom=-sz;scam.updateProjectionMatrix();shThr=SHK*2*sz/key.shadow.mapSize.x;MVM.forEach(castOn);BOXM.forEach(castOn);}
    const balHid=cur.lift<0.02&&cur.explode<0.01&&cur.dev<0.01&&!st.drive&&secMode==='off'&&!st.see&&!st.iso&&!st.hid.size&&!Object.keys(st.op).length&&!insetKind&&!benchD.open;   /* the balance can't be seen */
    const sig=[slip,+!!ks,cam.position.x,cam.position.y,cam.position.z,C.target.x,C.target.y,C.target.z,cam.fov,W,Hh,E,balHid?0:s.th,balHid?0:s.lift,balHid?0:s.psDef,n,+winding,H.blk,H.arm,H.twT,cur.lift,cur.flip,cur.explode,cur.dev,cur.lidM,cur.lidT,roll,pitch,GM.p[0],GM.r[0],latchK,secPlane.normal.x,secPlane.normal.y,secPlane.normal.z,secPlane.constant,+(secMode!=='off'),lpPh?now:0];   /* winding and the 2 s after it draw every frame: the close-up and the spring's easing */
    const still=!SNAP&&now>wakeT&&(now-lastDraw<10||!!lastSig&&sig.every((v,i)=>Math.abs(v-lastSig[i])<1e-4)&&now-lastDraw<1000);
    if(!ESSAY.on()&&onScreen&&!still){paint();cuDraw();renders++;lastDraw=now;lastSig=sig;
    /* labels: occlusion (5 Hz), then greedy placement by priority with four candidate sides */
    placeLabels(now);}
    if(!still&&!ESSAY.on()){s.held=H.held;drawInset(E,s,n);benchDraw(s,E);}if(!ESSAY.on()){swDraw(now);testShow(now);}
    const dR=dialRead(),dE=dR-tM,tod=((dR%86400)+86400)%86400,hh=Math.floor(tod/3600),mm=Math.floor(tod%3600/60),ss=Math.floor(tod%60);
    const hs=`<b>${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</b> ${tz==='gmt'?'GMT':'local'}${Math.abs(dE)>=0.25?`, dial <b>${fmtErr(dE)}</b>`:''}&ensp;${run?`${(RUN_H-hrs).toFixed(1)} h of power left${H.held?'&ensp;<b>'+stopWhy(run)+'</b>':''}`:`Run down. Wind it, then twist to start.`}${st.speed!==1?`&ensp;<b>${fmtSpd(st.speed)}</b>${st.speed>REAL_X?', balance swing shown slowed':''}`:''}${winding?'&ensp;<b>Winding</b>'+(run?', maintaining power driving the train':'')+(st.speed>WIND_X?', time at '+fmtSpd(WIND_X):''):''}${now<noteT?'&ensp;<b>'+noteTx+'</b>':''}`;
    if(hs!==hudS){hudS=hs;hud.innerHTML=hs;}   /* rewritten only when the text changes */
    if(rateK!==1&&now-lastRS>250&&$('#rateDet').open){lastRS=now;rateShow();}
    if($('#stopDet').open)stopShow(now,run);
    if(ss!==todS&&document.activeElement!==todIn){todS=ss;todIn.value=[hh,mm,ss].map(v=>String(v).padStart(2,'0')).join(':');}
    if(!loaded){loaded=true;pend.clear();$('#loading').style.opacity=0;setTimeout(()=>$('#loading').remove(),900);setTimeout(()=>{if(st.tour<0&&!camFree)setView(startView);hashReady=true;writeHash();},1100);}
    requestAnimationFrame(frame);
  }
  ESSAY.bind({time:()=>dialRead(),hrs:()=>hrs,tz:()=>tz,fs:R.fs,I0,changed:wake,R,mv,M});
  /* Report a bug or inaccuracy (js/report.js): what it is about (the essay's section, the part picked or the view) and what the hash doesn't hold of the model's state */
  REPORT.bind({r,where:()=>{if(ESSAY.on()){const s=ESSAY.section(),h=s&&document.getElementById(s);return'The essay'+(h?', “'+h.textContent.trim()+'”':'');}if(st.pick)return INFO[st.pick][0];const b=$('#views [aria-pressed="true"]');return'The model'+(st.tour>=0?', the walkthrough':b?', '+b.textContent.trim()+' view':'');},
    state:()=>[['Tab',ESSAY.on()?'essay':'model'],['Model',`balance swinging ${Math.round(H.amp/D2R)}°${H.held?', train held':''}${winding?', winding':''}; ${hrs.toFixed(1)} h since winding; speed ${st.speed}×; ${renders} frames drawn`]]});
  /* the export to Blender (blender.js): its own copy of the model, set as the page's is (the dial, balance and stop chosen, the timing weights, screws and temperature) */
  if(typeof BLENDER!=='undefined')BLENDER.bind({M,INFO,DRIVE_HIDE,drvF,SUS,TF:TAU_FREE,TAU_ARM,hrs:()=>hrs,rollP:()=>+$('#rollP').value||7,
    config:m=>{const u=m.userData,on=k=>{const b=document.querySelector(`#${k} button[aria-pressed="true"]`);return b&&b.dataset.v;},d=on('dialSt'),b=on('bal'),sv=on('stopV');
      if(d)u.dial(d);if(b)u.balance(b);if(sv)u.stop(sv);u.R.timing(twR.valueAsNumber/8,vwR.valueAsNumber/8);u.R.screws(SP);u.R.balCurl(degF()-T0);}});
  if(typeof MAKER!=='undefined')MAKER.bind({mv,meshes:MVM,cam,cv,scene,M,PARTS,INFO,PCE,SRC,units:()=>units,wake,R});   /* the maker's sheets, drawings, STL, measuring, the build book (maker.js) */   /* R, mv, M: the maintaining work's parts and materials, for the essay's figure */
  look();
  Object.assign(tgt,{lidM:0,lidT:0});st.view='dial';
  document.querySelectorAll('#views button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='dial'?'true':'false'));
  requestAnimationFrame(frame);
})();
