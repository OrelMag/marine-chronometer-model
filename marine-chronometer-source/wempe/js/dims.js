// @ts-check
/* dims.js: the Wempe Einheits-Chronometer's dimensions, each from Wempe's works drawings (References/wempe/drawings/), with the sheet and how sure the reading is.
   Part of the Wempe model (three.js r128). Declares only WD.
   PROVISIONAL (P0, 14 October 2026): the frame's first numbers, read for the plumbing; References/wempe/transcriptions/05-08-frame.md (being written) settles the
   frame's sheets and P1a rebuilds the frame from it.
   Plan coordinates as the sheets' hole tables give them: N/S along the 12-6 line and O (Ost, east)/W across, from the centre wheel's arbor (hole 1, Minutenrad,
   N 0 O 0). Both plates' tables use one frame (05 08 01 and 05 08 02-1 give the pillars and the barrel, fusee and balance the same coordinates); each plate is
   drawn from its outer face: the Oberplatte (05 08_1b) from the train side with O to the right, the Unterplatte (05 08 02-1) from the dial side with O to the
   left (its hole 11, O 36.858, drawn at the sheet's left edge), and sheet 001 shows the two views mirrored the same way (the pillar screws' heads in both).
   Seconds at 6 (Sekundenrad S 23.0) and the up-and-down work at 12 (Auf u. Ab N 23.0, 05 08 02-1) put N at 12 o'clock. Seen from the dial with 12 up, W is
   to the right: W is 3 o'clock, O 9 o'clock (sure). In the movement frame (as the Hamilton's: mm, dial side +y, 12 o'clock -z, 3 o'clock +x): x = W, z = S. */
const WD=(()=>{const NO=(n,o)=>[-o,-n];   /* a hole table's N and O (S and W as negative) to plan [x, z] */
  return{
    PLATE_R:85/2,   // the plates' radius: sheet 001 "Platten∅ 85 mm"; 05 08 01 (Oberplatte) "Fertigmaß 3,35 × 85∅ h6"; 05 08 02-1 (Unterplatte) "fertig 85∅ h6": sure
    TOP_T:3.35,   // the top plate's thickness: 05 08 01 "Fertigmaß 3,35": sure
    PP_T:3.35,   // the pillar plate's: 05 08 02-1 "3,35 ±0,02 stark", struck through on the scan with no new figure legible (its blank turned 3,5 × 90∅): provisional
    INNER:19.0,   // the plates' inner faces apart: sheet 001 "innerer Plattenabstand 19 mm" = the pillar's 19.6 between shoulders less its two 0.3 seats (PIL_SEAT): sure
    PIL_SEAT:[8.6/2,0.3],   // each pillar's seat in each plate's inner face: Ø 8.6, 0.3 +0.03 deep (05 08 01 Schnitt L-M, 05 08 02-1 Schnitt E-F): sure; on the inner face from L-M's lines drawn hidden from the outer face: fairly sure
    PIL:{r:8.14/2,   // the pillar (05 08 00-1, Pfeiler, Ms 58 round brass): body Ø 8.14 -0.2: sure
      L:19.6,   // shoulder to shoulder 19.6 ±0.01: sure
      sr:4.5/2,   // its end spigots Ø 4.5 f7 (-0.010/-0.022): sure
      sL:2.8,   // each 2.8 -0.1 long: sure
      tip:[4.3/2,1.1],   // each spigot's end turned to Ø 4.3 -0.2 over 1.1 -0.2, a 6° lead: sure (read at 5:1)
      cs:3.2/2,   // the 90° countersink at each end, Ø 3.2 at the face: read off the 5:1 drawing, which gives no figure: ±0.2, estimated
      Ltot:25.3},   // overall 25.3 -0.2 (19.6 + 2 × 2.8 = 25.2): sure; tapped M2.6 through from both ends ("Gewinde von beiden Seiten einschneiden"): PSCR.rs
    PIL_HOLE:4.50/2,   // the plates' pillar holes, reamed 4.50 +0.012 (05 08 01 nos. 11, 39, 49; 05 08 02-1 the same): sure
    PILLARS:[NO(-3.225,36.858),NO(-32.043,-18.50),NO(36.437,-6.425)],   // nos. 11 S 3,225 O 36,858; 39 S 32,043 W 18,50; 49 N 36,437 W 6,425 (05 08 01 and 05 08 02-1 alike), each 37.00 from the centre: sure
    PSCR:{r:6.6/2,   // the pillar screws: heads Ø 6.6 measured on sheet 001 (2:1, both views, ±0.4); their WN standard sheet not yet read: estimated
      h:1.8,   // head height: on no sheet read yet; DIN 84's for M2.6: estimated
      rs:2.6/2,   // thread M2.6 (05 08 00-1): sure
      len:6.0}   // shank: through the plate (3.35) and 2.65 into the pillar's thread: estimated
  };})();
