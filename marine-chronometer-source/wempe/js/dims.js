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
    PIL:{r:8.1/2,   // the pillar (05 08 00-1, Pfeiler, Rundmessing 8,5 Ms 58): body Ø 8.1 -0.2 (read "8,1∅", the ∅ written high as on its "4,3∅" and "4,5∅"; 8.06 scaled at 5:1): likely
      L:19.6,LT:0.01,   // shoulder to shoulder 19.6 ±0.01: sure
      sr:mid(PSF)/2,sF:PSF,   // its end spigots Ø 4.5 f7 (-0.010/-0.022, PSF), drawn at the middle of the fit, 4.484: sure
      sL:2.8,   // each 2.8 -0.1 long: sure
      tip:[4.3/2,1.1],   // each spigot's end turned to Ø 4.3 -0.2 over 1.1 -0.2, a 6° lead: sure
      cs:2.7/2,   // the 90° countersink at each end of the thread, Ø 2.7 at the face: scaled at 5:1 (no figure), about the thread's own diameter: estimated
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
    PSCR:{r:6.4/2,   // the pillar screws (WN-57 the top plate's, WN-56 the pillar plate's, by the coloured section's labels): heads Ø 6.4: the coloured section 6.4 and 6.1 (scaled on the
                     // pillar's 8.1 and 19 between the plates, 28.3 px/mm), Wempe 3955's top plate 6.4-6.6 (2_Wempe_3955_A.jpg, 8.82 px/mm by the pillars' 62.41 and 58.7 mm apart), sheet 001 6.6: estimated (±0.2)
      h:3.0,   // head height: the coloured section 3.0 (both screws): estimated (±0.2); their WN sheet isn't in the set
      rs:2.6/2,   // thread M2.6 (05 08 00-1): sure
      len:7.7}   // shank: the coloured section 7.8 and 7.7 from the head's seat to the end: estimated
  };})();
