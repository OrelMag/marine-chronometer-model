// @ts-check
/* dims.js: the Wempe Einheits-Chronometer's dimensions, each from Wempe's works drawings (References/wempe/drawings/), with the sheet and how sure the reading is.
   Part of the Wempe model (three.js r128). Declares only WD. P1a (14 October 2026): the frame's shared numbers, read off the frame's sheets (05 08, References/wempe/
   transcriptions/05-08-frame.md, checked on the sheets); the frame's own sizes (cocks, bridges, ring, bushes) are in js/frame.js beside the parts they make.
   Plan coordinates as the sheets' hole tables give them: N/S along the 12-6 line and O (Ost, east)/W across, from the centre wheel's arbor (hole 1, Minutenrad, N 0 O 0),
   the plates' centre (the 85 rim scales 42.3 from it on 05 08_3b). Every plan of the frame (05 08_1b, _3b, _4, _5, _13, _31, _32) is drawn with N up and O to the right,
   seen from above with the movement lying dial down: the Oberplatte from its outer face (its pillar seats, which are in its inner face, dashed; Schnitte A-B, C-D, G-H mark
   "oben" on that face), the Unterplatte from its inner face (its pillar seats drawn whole). Seconds at 6 (Sekundenrad S 23.0) and the up-and-down at 12 (Auf u. Ab N 23.0)
   put N at 12 o'clock, and seen from above, O is the dial's 9 o'clock: the dial side's photograph of Wempe 3955 (photos/dg-chrono-dec/3_Wempe_3955_uZ.jpg, square-on on
   millimetre paper) has the Wechselrad (hole 19, O 10.9 S 6.3) left of the centre and below it, and the Werkring's sheet (05 08 00-3, drawn from the dial side) puts its three
   screws at 20, 140 and 260 deg from 12 clockwise, where the top plate's photograph (2_Wempe_3955_A.jpg) has them at 339, 99 and 218 deg from N toward O (sure).
   In the movement frame (as the Hamilton's: mm, dial side +y, 12 o'clock -z, 3 o'clock +x): x = W, z = S. */
const WD=(()=>{const NO=(n,o)=>[-o,-n];   /* a hole table's N and O (S and W as negative) to plan [x, z] */
  /* the hole table: every hole's place, by its number on the sheets (05 09 01 = 05 08_1a for the Oberplatte, 05 08 02-1 = 05 08_3a for the Unterplatte; the cocks' and the
     barrel bridge's own tables, 05 08 00-2, 05 08 03-1, 05 08 05-1, give the same places for the holes they share, to the last figure: sure). Holes 14-18 (the hand-setting
     work's, struck through on 05 08 02-1: "nur wenn Zeigerstellung eingebaut wird") are in: Wempe 3955's plate is drilled for it (3_Wempe_3955_uZ.jpg, fitted on its holes 1,
     12, 26, 30, 40 at 8.52 px/mm, puts 14-18 within 0.15-0.6 mm of the table). 56, 57 (the seconds contact's screws, "nur bei Bedarf") and the lever chronometer's 27, 31-34
     are left out; 30 (Ankerrad) is on the detent chronometer's own Unterplatte (05 08 02-1's table, 05 08 02's assembly with a setting in it, and drilled in Wempe 3955's plate) */
  const H={1:NO(0,0),2:NO(23,0),3:NO(37,0),4:NO(36.437,6.425),5:NO(38.507,10.684),6:NO(27.821,3.577),7:NO(23.911,5.676),8:NO(19.765,0.559),9:NO(11.555,2.760),
    10:NO(15.292,16.708),11:NO(-3.225,36.858),12:NO(-9.576,35.739),13:NO(-16.238,34.536),14:NO(-17.229,36.411),15:NO(-22.871,33.211),16:NO(-21.471,30.789),17:NO(-15.929,33.989),18:NO(-12.780,22.136),
    19:NO(-6.30,10.912),20:NO(-2.451,6.512),22:NO(-6.018,3.259),23:NO(-12.110,9.10),
    26:NO(-21.743,11.783),28:NO(-26.410,4.315),29:NO(-28.580,7.062),30:NO(-33.730,5.028),35:NO(-23.0,0),36:NO(-11.922,-0.502),37:NO(-17.826,-4.263),38:NO(-15.170,-9.910),
    39:NO(-32.043,-18.50),40:NO(-26.163,-26.163),41:NO(-24.01,-30.732),42:NO(-18.50,-32.043),43:NO(-5.251,-22.464),44:NO(-3.081,-25.21),45:NO(6.0,-24.784),
    46:NO(17.046,-29.474),47:NO(31.551,-22.924),48:NO(32.668,-17.370),49:NO(36.437,-6.425),50:NO(25.233,-6.083),51:NO(-7.537,23.386),52:NO(-24.094,20.836),53:NO(-37.0,15.0)};
  /* 53 (Stift f. Wendelfeder) is O 15.0 on the detent plate's table (05 08_1a) and O 13.0 on the lever plate's (05 08_30): the detent plate's, both read clearly */
  /* the pillars' fits as the sheets give them, [nominal, lower, upper limit] (mm): the spigots Ø 4.5 f7 (05 08 00-1: -0.010/-0.022, ISO 286's f7 at 4.5) and the plates' holes reamed
     4.50 +0.012 (05 09 01, 05 08 02-1, nos. 11, 39, 49); the model draws each at the middle of its limits (sr, PIL_HOLE) */
  const PSF=[4.5,-0.022,-0.010],PHF=[4.5,0,0.012],mid=(/** @type {number[]} */f)=>f[0]+(f[1]+f[2])/2;
  return{H,NO,
    PLATE_R:84.989/2,   // the plates' radius: 05 09 01 "Fertigmaß 3,35 × 85∅ h6", 05 08 02-1 "fertig 85∅ h6", sheet 001 "Platten∅ 85 mm", drawn at h6's middle (0/-0.022): sure
    TOP_T:3.35,   // the top plate's thickness: 05 09 01 "Fertigmaß 3,35" (05 08_30, the lever plate: "3,3 in 3,35 geändert"): sure
    PP_T:3.35,   // the pillar plate's: 05 08 02-1 "3,35 ±0,02 stark", struck through with a replacement no longer legible (its blank turned 3,5 × 90∅, as the top plate's); its Schnitt A-B draws 3,35: likely
    INNER:19.0,   // the plates' inner faces apart: sheet 001 "innerer Plattenabstand 19 mm" = the pillar's 19.6 between shoulders less its two 0.3 seats (PIL_SEAT): sure
    PIL_SEAT:[8.6/2,0.3],PIL_SEAT_T:0.03,   // each pillar's seat in each plate's inner face: Ø 8.6, 0.3 +0.03 deep (05 09 01 Schnitt L-M, 05 08 02-1 Schnitt E-F; dashed from the top plate's outer face): sure
    PIL:{r:8.0/2,   // the pillar (05 08 00-1, Pfeiler, Rundmessing 8,5 Ms 58): body Ø 8.1 -0.2 (read "8,1∅", the ∅ written high as on its "4,3∅" and "4,5∅"; 8.06 scaled at 5:1): likely; drawn at the middle, 8.0 (8.1 until 26 October 2026)
      L:19.6,LT:0.04,   // shoulder to shoulder 19.6 ±0.04: likely (the tolerance's last glyph has a crossbar and a stem, beside the same sheet's plain "1": the second drawing check's 9-M8; read ±0.01, sure, until 28 October 2026)
      sr:mid(PSF)/2,sF:PSF,   // its end spigots Ø 4.5 f7 (-0.010/-0.022, PSF), drawn at the middle of the fit, 4.484: sure
      sL:2.8,   // each 2.8 -0.1 long, drawn 2.8 so the overall is 25.3 -0.2's middle, 25.2 (19.6 + 2 × 2.8: the sheet's figures close there, not at both middles; 2.75 from 26 to 28 October 2026, the overall 25.10 at its least: drawing check 2's 9-M8): sure
      tip:[mid(PSF)/2-1.1*Math.tan(6*Math.PI/180),1.1],   // each spigot's end turned at the drawn 6° over 1.1 -0.2, so to Ø 4.25 at the end, inside 4.3 -0.2 (the three figures over-determine: Ø 4.3 over 1.1 gave 4.8°, until 28 October 2026, 9-M8): sure
      cs:2.6/2,   // the 90° countersink at each end of the thread, Ø 2.6 at the face (2.59 scaled at 5:1, no figure: the thread's own diameter), to the tap drill (about 0.25 deep, drawn): likely (2.7 until 27 October 2026)
      grv:[3.25,0.35],   // a relief groove in each shoulder's face round the spigot's root, out to r 3.25 and 0.35 deep, half-round: drawn at 5:1 without figures, scaled: estimated
      Ltot:25.3},   // overall 25.3 -0.2 (19.6 + 2 × 2.8 = 25.2): sure; tapped M2.6 through from both ends ("Gewinde von beiden Seiten einschneiden")
    PIL_HOLE:mid(PHF)/2,PIL_HF:PHF,   // the plates' pillar holes, reamed 4.50 +0.012 (PHF; 05 09 01 nos. 11, 39, 49; 05 08 02-1 the same), drawn at the middle of the fit, 4.506: sure
    PILLARS:[H[11],H[39],H[49]],   // nos. 11 S 3,225 O 36,858; 39 S 32,043 W 18,50; 49 N 36,437 W 6,425, each 37.00 from the centre at 95°, 210°, 350° from N toward O: sure
    /* the Soviet 6MX's pillar 39 (the Variants' third version; Altmeppen's list: pillar 39 in another place): Kirov No. 247's top plate (2_Kirow_247_A.jpg, a similarity on the
       fusee, barrel, balance and escape arbors and pillars 11 and 49, 8.98 px/mm, residuals under 0.55 mm; the screws' centres by circles fitted to their edges) has no pillar at
       210° and its screw at 190.0°, r 36.45, where 11 and 49 read 94.9° and 350.1°, r 36.9 and 36.7; its dial side (3_Kirow_247_uZ.jpg, seven holes, 8.63 px/mm, under 0.42)
       189.6°, r 37.47, 11 and 49 94.8° and 349.9°, r 36.9 and 37.4. So 190° (sure to ±0.5°: 49's 350° mirrored across the O-W line) and r 36.6-37.3 (each reading corrected by
       11's and 49's in its fit). On r 37 the drawn pillar (Ø 8.1) would stand 0.11 into the drawn seconds wheel's tips (Ø 21.9 at hole 35); clear of them from r 37.2: taken at
       r 37.3, 0.2 clear, within the dial side's reading (likely; the 6MX's seconds wheel isn't seen) */
    P39_6MX:[37.3*Math.sin(10*D2R),37.3*Math.cos(10*D2R)],   // plan [x = W, z = S]: 190° from N toward O on r 37.3, S 36.733 W 6.477
    /* the Soviet 6MX's electrical seconds contact (Kirov No. 247's: dg-chrono-6mx-gallery/leben-des-6mx/10_-12_Kirow_247_E-Kontakt_*.jpg, dg-chrono-6mx/6_Kiro_247_S.jpg,
       2_Kirow_247_A.jpg and 3_Kirow_247_uZ.jpg against Kirov 1564's without one; Kirov 009's, 2973's, Poljot 08479's and Kirov-Poljot 24020's the same design; Romanov 1975,
       Proektirovanie priborov vremeni, Figs. 100 and 101 and p. 105's parts 52-69, and p. 209), measured 18 October 2026 (scratchpad: holemap.py --model wempe on both dial
       sides, 8.60-8.98 px/mm, residuals under 0.56; Fig. 100 mapped by an affine on 13 photographed anchors, each part then moved onto its own; heights from Fig. 101 at
       9.68 px/mm, which gives the seconds wheel's height to 0.06 and the 19 between the plates, and the S views at 10.5 and 21 px/mm). Plan [x, z] as H; y from the pillar
       plate's inner face (0) toward the top plate's (−19). js/train.js builds it */
    CONTACT6:{
      base:[[35.47,24.27],[34.71,23.35],[32.79,22.68],[28.85,21.22],[24.91,19.64],[22.33,18.27],[20.41,17.95],[18.45,18.56],[16.92,19.75],[15.15,21.63],[13.6,23.52],[12.16,25.64],[11.3,27.74],[10.95,31.24],[10.75,33.81],[10.46,38.59],[9.79,39.63],[8.84,40.44],[7.71,40.96],[6.48,41.13],[5.25,40.96],[4.11,40.44],[3.17,39.63],[2.49,38.59],[1.58,35.22],[-0.13,35.12],[-1.52,35.84],[-2.25,37.25],[-2.48,40.75],[-2.34,43.31],[-1.58,44.35],[-0.03,45.7],[1.56,45.67],[3.16,45.59],[4.75,45.45],[6.33,45.26],[7.91,45.01],[9.48,44.71],[11.03,44.35],[12.57,43.94],[14.1,43.47],[15.61,42.95],[17.1,42.38],[18.57,41.76],[20.02,41.08],[21.44,40.36],[22.84,39.59],[24.21,38.76],[25.55,37.89],[26.85,36.98],[28.13,36.02],[29.37,35.01],[30.57,33.97],[31.74,32.88],[32.87,31.75],[33.96,30.58],[35.01,29.38],[36.01,28.14],[36.97,26.86],[37.89,25.55]],   // the base 58 (gilt brass, y 0 to −2): its outer edge an arc r 45.7 beyond the plate's rim (A247: likely), cut round pillar 39 (r 4.4), its inner edge traced on Fig. 100 (estimate, ±2); it overhangs the pillar plate's window for the intermediate wheel (Ø 24.5 about hole 38), 0.23 over the wheel, which in the 6MX's Exploded view leaves toward the dial with its bridge
      screws56:[[0,38.2],[24.36,29.03]],access:[[-0.61,38.6],[23.6,29.14]],   // its two screws into the pillar plate, M1.7 through, their ends flush on the dial side (uZ247; open holes on Kirov 1564's: likely); the top plate's Ø 3.5 access holes over them, 179.1° r 38.6 and 219.0° r 37.5 (A247, A1564: likely)
      blkP:[[-1.69,40.37],[-1.87,44.56],[-1.11,45.39],[0.5,45.4],[2.12,45.35],[3.73,45.25],[5.33,45.09],[6.93,44.87],[8.52,44.59],[10.1,44.26],[11.67,43.88],[13.22,43.43],[14.75,42.94],[16.27,42.38],[14.48,37.72],[12.99,38.26],[11.47,38.74],[9.97,39.41],[9.0,40.34],[7.8,40.93],[6.48,41.13],[5.15,40.93],[3.95,40.34],[2.82,40.3],[1.32,40.38],[-0.19,40.4]],   // block 52 (+), y −3.8 to −5.25 on the black fibre 68 (−2 to −3.8): its two screws at 182.9° and 193.3° r 43 (A247: likely), the outline from Fig. 100 moved onto them (estimate)
      blkM:[[19.71,35.27],[22.15,39.63],[23.57,38.8],[24.96,37.92],[26.32,36.99],[27.65,36.01],[28.94,34.98],[30.19,33.91],[31.4,32.79],[32.57,31.63],[33.7,30.43],[34.78,29.18],[34.51,27.94],[31.4,25.43],[30.41,26.6],[29.37,27.74],[28.3,28.84],[27.18,29.89],[26.02,30.9],[24.83,31.87],[23.6,32.79],[22.33,33.67],[21.04,34.49]],   // block 57 (−): its screws at 214.6° and 226.0° r 42.9 (A247 and 009: the two steel heads under the top plate's edge), outline as block 52's
      bsP:[[2.17,42.85],[10.03,42.12]],bsM:[[24.36,35.31],[30.86,29.8]],   // the four block screws (steel cheese heads Ø 3.1 × 2.6 on black bush flanges Ø 4.6, −5.25 to −6.2, A247 and 10_Kirow_247: likely; M1.4 into the base, estimated); 193.3°'s 0.15 out from pillar 39, inside its ±0.8, so its flange clears the pillar
      disc:{th:207.7,r:41.6,y:-8.3,d:11.9,t:1.2},   // the contact disc 55: upright in the radial plane at 207.7° (A247: its edge 3° off the radius), knurled, Ø 11.9 × 1.2 (Fig. 101, 247's and 2973's close-ups: likely), on a bracket on block 57's low end, turnable to renew the contact (the user instruction)
      screw54:{h:[16.14,42.7],tip:[20.27,40.66],y:-5.85,d:1.0},   // the contact screw 54, tangential at r 45.5 on the lever's end, its steel point on the disc's low face (A247 tip and end, 10_Kirow_247's thread: likely), a lock nut at its holder; its axis at -5.85 and Ø 1.0 (10_Kirow_247 through the m6_contact camera, its 0.6 mm residuals, a scale stood at its tip: -5.15 ±0.6, 0.91 across the thread: likely; taken at -5.85, the top of that range, where it passes 0.1 over block 52's top at -5.25 (fine.py); -6.7 and 1.2 until 18 October 2026), held in a block under the lever's end
      staff:[13.67,27.82],staffY:[-2.0,-13.2],   // the lever's staff 69 (206.2°, r 31.8 on Fig. 100 through the mapping, ±1.5: estimate; taken r 31.0, so the spiral's outer coil, Ø 8.9 measured, clears the contact disc by 0.2), jewelled at both ends, the lower capped (10_Kirow_247: the capped setting on the cock)
      stone:[9.83,21.16],   // the lever's corundum stone 61 at the stone arm's end, on the contact wheel 10.0 from the seconds arbor, its acting corner 9.7 (the wheel's tips 10.2, roots 9.3): estimate
      cockFoot:[[30.74,22.7],[21.88,18.28],[17.64,22.18],[26.39,26.61]],cockArm:[[21.88,18.28],[12.74,25.63],[11.5,28.32],[12.55,31.22],[14.8,31.89],[17.76,28.82],[24.17,24.66]],   // the cock: its foot on the base (one screw, two pins), a leg 1.5 × 5, its arm 2.1 thick at −11 to −13.2 over the spiral to the staff (Fig. 100 mapped; 10_Kirow_247 46 px at 22.2 px/mm): estimate
      stud:[[11.55,39.24],[12.42,42.21],[14.25,41.6],[13.52,38.6]],   // the stud 53 on block 52, −5.25 to −9.85, its clamp screw on top (10_Kirow_247: estimate), its outer face at r 44.0 (3.0 deep read: estimated), 0.4 inside the lever's holder as it swings, its outer corner on the lever's side taken in 0.3 so the screw arm clears it at full lift
      wheel:{z:60,tip:20.4,root:18.6,rim:16.8,spokes:8,y:[-6.65,-7.65],collet:2.0,colY:[-6.1,-10.65]}},   // the contact wheel 62 on the seconds arbor under its wheel (Romanov: fixed to it), its collet Ø 2.0 rising 3.0 above it (10_Kirow_247: likely; 3.1 and to -11.2 until 18 October 2026): 60 ratchet teeth, one taken out for the minute (Figs. 100, 101; 6_Kirow_009_S: a sawtooth wheel there): tips likely, depth estimate
    /* the frame's sizes frame.js draws beside its parts, here so the recipes (tools/recipes/wempe.py) read the page's own (29 October 2026; each with its source in frame.js's comments):
       the hole radii (tapped at the thread's size + 0.02, reamed and pressed fits drawn at their middles), the pillar plate's ring-pin notch, hole 10, the intermediate wheel's
       opening and the hand-setting window and bore (05 08 02-1, 05 08_3a/b) */
    FRAME:{rM26:1.32,rM2:1.02,rM17:0.87,rM14:0.72,rM12:0.62,rCl26:2.8/2,rPinP:1.6025/2,rPinQ:1.5825/2,rPin:1.6/2,rJ:4.596/2,rH35:3.506/2,
      ringPin:1.0,pp10:2.82,op38:24.5,op35:6.0,hsOut:8.25,hsW:6.5,hsIn:12.1,hsArc:14,hsBore:2.0,hsBoreY:1.68},
    /* the movement ring (05 08 00-3, revised 6.12.46): y from the pillar plate's inner face (0) toward the dial; its sizes as frame.js's comments read them */
    RING:{y0:0.35,ySeat:3.35,yCone:5.35,yFl:6.35,yRec:10.35,yTop:11.05,bandD:96,flD:105.90,seatD:85.0175,lipD:83,coneD1:85,coneD2:93,recD:104.05,
      screwD:89,screws:[340,100,220],dialR:50.5,dialPin:1.1,dialScrews:[354,120,240],casePin:1.6,casePinZ:2.8,casePinR0:43.5,scr:[3.1,3.05,6.3]},
    /* the cork ring (05 08 01-4, no sheet: scaled on the coloured section): outside and bore radii, its height as drawn (squeezed) and the 6MX's, its seat under the top plate */
    CORK:{ro:8.05,ri:4.86,h:3.70,h6:2.4,below:[1.5,15.1]},
    PSCR:{r:6.4/2,   // the pillar screws (WN-57 the top plate's, WN-56 the pillar plate's, by the coloured section's labels): heads Ø 6.4: the coloured section 6.4 and 6.1 (scaled on the
                     // pillar's 8.1 and 19 between the plates, 28.3 px/mm), Wempe 3955's top plate 6.4-6.6 (2_Wempe_3955_A.jpg, 8.82 px/mm by the pillars' 62.41 and 58.7 mm apart), sheet 001 6.6: estimated (±0.2)
      h:3.0,   // head height: the coloured section 3.0 (both screws): estimated (±0.2); their WN sheet isn't in the set
      rs:2.6/2,   // thread M2.6 (05 08 00-1): sure
      len:7.7}   // shank: the coloured section 7.8 and 7.7 from the head's seat to the end: estimated
  };})();
