# Batch 8, the model against the sheets: the balance cocks (05 08 00-2, 05 08 03-1, the lever chronometer's U30), the fusee bush (05 08 01-2), the dust bush (05 08 01-3), the intermediate bridge (05 08 04), the barrel bridge (05 08 05, 05 08 05-1) and its set-up click (05 08 05-2)

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch8-read.md`, with its Step 3 corrections). Its F1-F11 are settled below, and the ledger's F2 question (the stud's screw hole in the cock, beside batch 1's 1-M14) is judged.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit2`, detached at efbf63c5 (main 3.47.00 with the geometry of batches 1, 2 and 6, among them 1-M14's stud hole at 3.15 under the bar). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b8m\` (written `b8m\` below).
- **Solids.**
  - `b8m\dump.py` (batch 7's, its prefixes changed) loads the page (`?snap&qa`, GPU) and freezes it as holecheck.py does. It writes every visible mesh of these lines in all five versions to `dump.json`: 050800-2, 050803-1, 050801-2/-3/-4, 050804-1, 050805-1/-2, WN-22, -53, -55, -34, -52, -ucs, -203, -11, -300, 050302-3/-4, 050406 and 050504. `inv.txt` lists the meshes and their bounds per version.
  - `b8m\sl.py` slices a dumped mesh by a plane y = const, chains the cut into loops and fits each with a circle. `uc.py`, `lc.py`, `bb.py`, `slot.py` and inline scripts put the loops into each part's own frame (the upper cock's u along its axis from 23 toward the foot, v toward O; the lower cock's u from 36 toward 37, w toward 23; the click's frame from its hole, x toward the nose along its base). Every row below is a slice of the solid, not a render.
  - Wempe 3955 (`2_Wempe_3955_A.jpg`) and Kirov 247 (`2_Kirow_247_A.jpg`) read at the cock's end (`b8m\p3955_end.png`, `k247_end.png`): the stud's screw's head centroid against the setting's centre and the two setting screws (9.36 px/mm on the cock's top by the screws' 7.05).
- **Versions.** The cocks, bushes and bridges are one mesh in "last", "first", "1943" and "3955" but for the dust bush (straight as 05 08 01-3 in "first" and "1943", waisted as 05 08 01 of 2.11.46 in "last", Wempe 3955's and Kirov 247's waists in "3955" and "6mx"). The 6MX's upper cock has no hole 20, its lower cock is cut back to 3.3 past the lug (Kirov 247, recorded), and its cork ring is 2.4 thick.
- **Tools.** All at efbf63c5, `--model wempe`, MC_GL=gpu, one at a time:
  - `seatcheck.py -v` (`b8m\seat.txt`, about 6 min): 498 pieces over 5 states, 476 seated, 5 expected, 0 failing. Every pin and screw of these parts is held (rows in the fit list).
  - `audit.py` (`b8m\audit.txt`): nothing new; its three "no longer found" floatScrews are the movement ring's (batch 9's, as batch 7 found).
  - `holecheck.py` (`b8m\holecheck.txt`; the first run hung at 10 min, the retry passed): 1620 holes over 5 states, 1472 populated, 31 expected empty, 0 failing. The upper cock's 20 is its one expected entry here, in the four versions that have it.
  - `isolate.py` on the two cocks with the stud, and on the barrel bridge, fusee bush, dust bush and intermediate bridge, each from four sides (`b8m\iso\r_iso_*.png`). Each shows the shape its sheet draws: the Z cock with the stud's bar over the slot, the lug, the crescent with its click, the waisted dust bush ("last") and the round-ended bridge.
- **Sheets.** Re-cropped where a reading mattered: `u30_end.png`, `u30_arrow.png` (U30's hole and its "5", 61 px/mm at 5×, 16×), `s13_top.png` (05 08 05-1's "5" and 150°), `s05.png`, `s04.png`, `s13.png`, `s14.png` (the scans whole, for the overlays), `cs_uc_lab.png`, `cs_bb_lab2.png`, `cs_set_lab.png` (the coloured section's screw labels).
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00 (27 October). Pages 42-91 rendered with their text to `b8m\book\p*.png`, `*.txt`: the barrel bridge 42-53, the fusee bush 54-58, the dust bush 59-60, the cork ring 61, the upper cock 63-70, the lower cock 71-78, the intermediate bridge 79-91.
- **Overlays.** `b8m\ov\`: the model's slices drawn on the sheet's scan at the sheet's scale, registered on two holes (no fitted scale): `ucplan.png` (05 08 03-1's 2:1 plan; 4.91 px/mm by 8 to 23), `lcplan.png` (05 08 00-2's 5:1 plan; 12.14 px/mm by 22 to 37), `click.png` (05 08 05-2's 5:1 plan; 17.24 px/mm by its 17.4, on its hole and base line).

**Frame.** The movement's y, dial side +y. The top plate runs from TT = −22.35 (its outer face) to TI = −19.0 (its inner face), the pillar plate from 0 to 3.35. Plan x is W, z is S, as the tables give them (every table row of the five sheets matches `WD.H` to 0.001: 6, 8, 9, 20, 22, 23, 36, 37, 41, 42, 45, 46, 47, 48, 50).

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| upper cock 05 08 03-1 (30.4.43) with the slot, hole 20, M1.2 × 2, the stud's M1.4 | yes | yes | yes | yes, no hole 20 (Kirov 247) | yes |
| lower cock 05 08 00-2 (rev. a 2.12.46) | yes | yes (the card's "as first drawn" tolerance: F4) | yes | cut back to 3.3 past the lug (Kirov 247, estimated) | yes |
| fusee bush 05 08 01-2 | yes | yes | yes | yes | yes |
| dust bush | waisted (05 08 01, 2.11.46) | straight (05 08 01-3, 2.7.42) | straight | Kirov 247's waist | Wempe 3955's waist |
| barrel bridge 05 08 05-1, click 05 08 05-2 (rev. a 25.5.48: the hole's +0,03) | yes | yes (card: the hole without +0,03) | yes | striped finish | yes |
| intermediate bridge 05 08 04 (05 08 04-1 not in the set) | bush WN-300 at 38 | bush (1940 bore) | bush (1940 bore) | a chaton at 38 | bush |

---

## 05 08 03-1: the upper balance cock (every version; U30 for what it adds)

Measured by slices at y −37.34 (the top), −36.0, −35.0 (the thin end's foot), −34.93, −34.55, −34.2 (the boss), −30 (the web), −24 and −22.4 (the foot), in each version.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| height | 15 −0,1 | 15.00 (−37.35 to −22.35) | 0 (top of its tolerance) | match | sure |
| foot | 3,2; 16,5 long; 17 wide at its end | 3.20; u 26.5-43.0; ±8.50 at u 43 | 0 | match | sure |
| arm | 3,2 ±0,02 | 3.20 (−37.35 to −34.15) | 0 | match | sure |
| relief under the arm, its step | "12 r", 45°, the depth 0,8 (illegible here; U30's 2,4 + 0,8) | the full underside's corner r 11.97-12.00, the relieved r 11.22 at 0.8 up, 45° | 0 | match (F7: depth read through U30, recorded in Estimated) | likely |
| boss round the setting | "6 Ø", the arm 3,2 ±0,02 there | face Ø 6.0 at −34.15, flank 45° to Ø 7.6 at −34.95 | 0 | match (U30 and the coloured section for the flank, recorded) | likely |
| length | 49; 26,5 web to 23; 22 ±0,1 its inner arc; 4,5; ≈5,5 | −6.0 to 43.0; Ku at 26.5; arc r 22 (u 22.0 on the axis, 20.7 at the sides) | 0 | match | sure |
| end | 6 r | the outline's arc r 6.000 about 23 | 0 | match | sure |
| the setting's seat | 5,2 Ø H7 +0,012 | Ø 5.206 from the top to −34.65 (2.70 deep) | 0 (middle) | match | sure |
| its lip | 0,5 +0,03; 4,59 +0,012 (table) | 0.50 (−34.65 to −34.15); Ø 4.590 | lip at its least, hole at its least | match; both in tolerance but neither at its middle (0.515, 4.596), where the lower cock and the top plate's 26 draw 4.596 (M13) | sure |
| setting screws' holes | 2 × M1,2 at 3,5 +0,05 along the axis | tapped at u ±3.525, v 0.00 | 0 (middle) | match | sure |
| hole 20 | Ø 2,8 at 10 on the axis | Ø 2.800 at u 10.000 (not in the 6MX) | 0 | match; the 6MX's absence recorded (Kirov 247: sure) | sure |
| hole 8 | Ø 2,8 at 33 | Ø 2.800 at u 33.000 | 0 | match | sure |
| pins 6, 50, 9 | 1,585 −0,005, 2,5 deep, at 40 ±5 and 24,5; the 0,2 × 90° at 9 | Ø 1.5825 (40-gon 1.580 across flats), 2.5 deep, at (40, ±5) and (24.5, 0); 0.2 × 90° sinks on all three | 0 | match (F11: all three sunk, a reasonable reading) | likely |
| slot | 1,8 H7 +0,009, centred on C-D ("0,9"), from the edge to 3,4, through, its end at 82° | 1.800 wide (u ±0.900) in every version; inner wall v 3.399 on the top, 3.070 at the thin end's foot (2.34 down): 8.0°, through the arm and the boss | width at H7's least (middle 1.8045) | match | sure |
| the stud's screw hole (F2) | not drawn on 05 08 03-1; U30: a M1,4-sized hole (drawn Ø 1.43, its inner dashed circle 1.03), 4,2 across, 5 from its centre to the slot's far wall | M1.4 tapped through the thin end at u 4.10, v 4.35, every version | U30's across 4.2 against 4.35 | the model's place holds (below) | likely |

**F1, the slot, settled.** It is in every version. The sheet's 2:1 plan and Schnitt C-D draw it, and the overlay (`ov\ucplan.png`) puts the model's slot on the sheet's walls and end to a pixel (0.2 mm). Neither photograph shows the slot itself, since the stud's bar covers it. Both show what the slot is for: on Wempe 3955 and Kirov 247 the stud is a bar on the cock's top with its square end at the arm's edge over the slot's place, screwed down on the O side of the axis (`p3955_end.png`, `k247_end.png`), as the model has it. The 4:1 coordinate figure and the 1:1 view leave it out because they place holes. Likely real in every version, sure as built.

**F2, the stud's screw hole, judged.**
- U30's figures, re-read at 61 px/mm: the "5"'s right arrowhead sits on the slot's far wall, not on the centre line (`u30_arrow.png`), so the hole is 5 − 0.9 = 4.1 along. Its "4,2" is from the axis. Drawn, the hole scales 5.2 along and 4.18 across, so the drawing isn't to scale along it, and the dimensions decide. Its circle is 1.43 across with a dashed one about 1.03 inside it: an M1.4's major and minor diameters, so it agrees with the model's M1.4.
- The Wempe's own sheets fix the other figure. The stud (05 03 02-3, batch 1) has its Ø 1.5 H7 hole on the bar's middle, 5 ±0.1 from the square end, and its upright 1.9 −0.2 across, centred on the bar. The slot's end is 3.4 from the axis (82°). So the bar's middle, and the screw with it, is 3.40 + 0.93 + 0.01 = 4.35 from the axis. At U30's 4.2 the upright's inner face would stand 0.13 into the slot's end wall (0.05 at its least width, 1.7).
- U30 is the lever chronometer's cock, with its own stud (its slot 1,8 −0,1, not H7).
- Wempe 3955 measures 4.22 along and 4.34 across (each ±0.15, `p3955_end.png`).
- Verdict: the model's 4.10 / 4.35 holds (likely). The code comment ("not on 05 08 03-1 … estimated") should name U30's 4.1 along and M1.4 size, the stud's sheet for the 4.35, and Wempe 3955's reading (M3).
- 1-M14's moved hole (the spring's pin 3.15 under the bar, its centre at y −34.2, 0.05 above the boss's face) leaves the half-round pin clear of the boss's flank: 0.15 at the face, 0.01 at the flank's radius 3.25 (y −34.4), where the pin's points within |u| < 0.9 lie in the slot. That is fine.py's to confirm (not run here: the plan's one browser at a time).

**F7.** The 0.8 depth stands on U30's 2,4 + 0,8 and on this sheet's "3,2 ±0,02" at the boss, which only a boss reconciles (the reader's own Step 3 correction). It is recorded as such in the README's Estimated ("drawn on 127-556.04 U30"). Holds, likely.

**U30's other differences** (the setting's two settings 1,4 each with screws 131 over the upper; the relief 0,8; the pins 3 long, 1,3 out). The model takes the settings' stack, the relief and the pins' length from it, recorded. Nothing else of U30 applies.

## 05 08 00-2: the lower balance cock (every version)

Slices at y −18.99 (the plate-side face), −17.0, −12.3, −12.0, −11.5 and −9.01, "last" and "6mx".

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bar | 20 × 8 × 10 −0,1; axis at 32°30' from S toward W; 22, 36, 37 7 apart | u −10..10, w ±4, y −19.0..−9.0; 32.498°; pins at u ±7.000 | 0 | match | sure |
| lug | 10 wide, r 5 about 23; 17,2 across; 3,22 −0,04 at the far face | u −10..0; to w 13.2 (8.2 + 5); −4 to 13.2 = 17.2; y −12.22..−9.0 (3.22) | 0 (3.22 at the top of −0,04) | match | sure |
| 23 | 5 along from 36, 8,2 across (M1) | u −5.000, w 8.199 | 0 | match | sure |
| seat | 5,2 H7 +0,012 from the far face | Ø 5.206, −9.0 to −11.72 (2.72) | 0 | match | sure |
| lip | 0,5 +0,03 at the plate side, 4,59 +0,012 | 0.50 (−12.22 to −11.72), Ø 4.596 | lip at its least | match | sure |
| M1,2 | 2 at 3,5 +0,1 either side of 23 on C-D (across the bar) | tapped through the lug at w 4.699 and 11.699, u −5.00 | 3.500, at its least (middle 3.55; the upper cock and the plate draw 3.5 +0.05 at its middle) | match (M13) | sure |
| the inner M1,2's wall to the bar's face | (figures give 0,1) | 4.699 − 0.6 − 4.0 = 0.10 | 0 | match (the reader's note: thin, as drawn) | sure |
| 36 | M2,6 through | tapped through the bar's 10 | 0 | match | sure |
| 22, 37 | 1,45 drilled, 1,585 −0,005, blind 2,5 from the top face | Ø 1.5825, −19.0 to −16.5 | 0 | match | sure |
| C-D's hole on "A" (F3) | drawn blind on the axis in the section; no fourth hole in the plan | none: the section's is pin 22's, 2 from the cut, projected | — | F3 settled: nothing to change | likely |
| 6MX | — | the bar cut back from the pillar plate's side to 3.3 deep from u 1.5 (Kirov 247, recorded) | — | recorded | likely |

Overlay `ov\lcplan.png`: the outline, the lug's r 5, the bore and its lip, both M1.2 and 36 lie on the sheet's lines. The pins' drawn circles are 1.35 across against the model's 1.58 (the sheet draws them small; its table decides).

**F4, settled (text).** The "(a)" of 2.12.46 ("Toleranz war +0,05") stands directly over the "+0,1" of the M1.2's "3,5" (`04_cd.png`). It is not over the 0,5 +0,03 beside it, nor near the 52 H7. 05 08 03-1 (not revised) and the top plate's P-Q draw the same holes 3,5 +0,05. So the revision most likely widened this cock's 3,5 from +0,05 to +0,1. The model's card for "as first drawn" (app.js line 415: "the setting's seat +0.05") names the wrong figure (M5). The geometry is unchanged: 3.5 lies in both.

## 05 08 01-2: the fusee bush (every version)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| spigot below the flange | Ø 8 g6, 2,7 (from 7,1 − 1,5 − 2,9) | Ø 7.9905 (g6 middle), 2.60 | −0.10 | recorded departure (the fusee arbor's endshake, README Unresolved, frame.js) | sure |
| flange | Ø 13,2 −0,2 × 1,5 −0,1 | Ø 13.20 × 1.50 | 0 (both at the top of their tolerance) | match | sure |
| above the flange | Ø 8 r6 (+0,028/+0,019), Kegel 1:70, (7,96) at its top, 2,9 +0,2 | Ø 8.0235 at the flange to 7.982 at its top (2.9/70), 2.90 | the reference 7,96 is from 8.000 | match | sure |
| overall | 7,1 −0,2 | 7.00 | middle | match | sure |
| bore | 4,1 +0,2, its top sunk 45° to Ø 7 ±0,1 | 4.52 through, 45° to Ø 7.00 | +0.22 over its top limit | recorded departure (the fusee arbor's journal 4.5 ±0.02, README Unresolved) | sure |
| flange holes | Ø 1,5 +0,1, sunk Ø 2,2 H8 +0,014 × 0,5 +0,05, 3 at 120° on Ø 10,4 ±0,05 | Ø 1.55, Ø 2.207 × 0.50, on r 5.2 at 0/120/240° | sink depth at its least | match | sure |
| the fit's letter (F5) | r6 (`08_r6.png`: a lower-case r, and ISO 286's r6 for 6-10 mm is +0,028/+0,019; there is no shaft fit "T6") | built to r6's figures | — | geometry right; "T6" in frame.js lines 340, 342 and 357, checks.py's EXPECTED text, bom.json 050801-3 (and BOM.md) and app.js's card (M4) | sure |

F5: app.js's card (line 30-31) also says "pressed into the top plate" and "Ø 8 T6 into the plate". The g6 spigot slides in the plate's 8.0 +0.015 and three M1.4 screws hold the flange (bom.json's own `in 050901 free`). Text only (M4).

## 05 08 01-3: the dust bush (each version as listed)

Radii from the fusee's axis (hole 10) at 13 heights per version.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| length | 18,1 −0,2 | 18.10 (−23.85 to −41.95) | 0 | match | sure |
| body | Ø 13,1 −0,2 up to 15,1 −0,2 | Ø 13.10 ("first", "1943"); "last" waisted to Ø 10.5 (05 08 01), "3955" Ø 9.0, "6mx" Ø 9.8 (photographs) | 0 | match; the waists recorded (the owner's choice, 26 October 2026) | sure |
| collar | 3,1 −0,2, Ø 15,1 −0,2, its flat 14,1 | Ø 15.10, flat at 6.55 from the axis toward 255°, 3.1 in "first"/"1943" (thinner in the photographed versions, recorded) | 0 | match | sure |
| neck | Ø 9,7 −0,2, 3,0 | Ø 9.70, 3.0 | 0 | match | sure |
| bore | 8 H7 +0,015, Kegel 1:70 | Ø 8.0075 at the bottom, 1:70 on the diameter | 0 | match | sure |
| bore at the mouth's foot (F8) | (7,62) | 7.775 (1.8 under the top) | +0.155 | F8: the sheet's figure doesn't follow from its own 1:70 (it needs 26.6 of taper in a 16.3 bore); the model follows the 1:70 and the fit. frame.js line 358's "its top Ø 7.62" is wrong about the solid (M6) | sure (model), possible (the sheet's 7,62) |
| mouth | 20°, 1,8 +0,2 | 20° from the 7.775 to Ø 9.085 at the top, 1.80 deep | depth at its least | match | sure |
| bottom | "5°", "0,5" | outer corner 0.3 × 45° (estimated), a flat ring 0.5 wide, the face dished 5° to the bore | — | match (the code's reading; the README's "5° × 0.5 chamfer" is stale: M6) | likely |

## 05 08 05-1 and 05 08 05: the barrel bridge (every version)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 3,32 −0,04 | 3.32 (−25.67 to −22.35) | top of its tolerance | match | sure |
| outer edge | r 42,5, turned with the plate | r 42.495 | 0 | match | sure |
| chord | 7 from 45 and 7,7 from 42, square to it; 24 wide | 7.000, 7.700; 24.001 | 0 | match | sure |
| the short edge | 150° to the chord; "5" from 48 to it (its extension lines through 48 and the corner, parallel to the edge: `s13_top.png`) | 150.000°; 48 5.000 from it; 11.07 long | 0 | match | sure |
| 73,5 | its dimension line parallel to the chord (traced on the scan: slope −0.268 against the chord's −0.281), from the bottom tip to the top tip | 73.31 along the chord (73.52 tip to tip) | −0.19 | the sheet's figures overdetermine; recorded (frame.js, README: "the '5' and the 150° taken"; Wempe 3955: 4.95, 150.2°) | likely |
| 45 | 3,9 ±0,01 | Ø 3.900 | 0 | match | sure |
| 46 | M2,6 | tapped through | 0 | match | sure |
| 42, 48 | Ø 2,8 | Ø 2.800 | 0 | match | sure |
| 41, 47 | 1,585, 2,5 deep, 90° × 0,3 at 41 | Ø 1.5825, 2.5 deep, 0.3 sinks at both | 0 | match (F11) | likely |
| the kompl.'s pins | 1,3 proud | 1.30 (y −22.35 to −21.05) | 0 | match | sure |
| the kompl.'s thin arc (the reader's weak point) | not on 05 08 05-1 | nothing drawn | — | the barrel's edge seen through, on the assembly only: nothing to build | possible |

Overlay: no scan overlay drawn; the figures above are the comparison, and the sheet's own drawn chord (7.10, 7.59, 6.84 from 45, 42, 48 by the code's measurement) agrees within the drawing's accuracy. Re-measured here: the drawn short edge stands about 4.3 from 48 and is about 14.6 long. The figure (5) decides.

## 05 08 05-2: the set-up click (every version; the card for the hole before 1948)

Sliced at its mid-thickness in its own frame.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 2,6 −0,03/−0,05 | 2.56 | middle | match | sure |
| hole | 3,2 +0,03 (a) | Ø 3.229 (3.23 at the polygon's corners) | at its top limit (middle 3.215) | match | sure |
| beak | 3,5 high, 85° | 3.50, 85° | 0 | match | sure |
| hollow | 6 r about 5,142 back, 7,212 under the hole | r 6.000 about (−5.142, −7.212), from x −1.02 to the tip at −9.262 | 0 | match | sure |
| 9,7 | the tip to the hole (a straight line on the sheet) | 9.69 | −0.01 | match | sure |
| base under the hole | (the thin Ø 5,7 tangent to it) | 2.85; the scan draws 2.79 (17.24 px/mm) | — | match (the README's "2.81 (scaled)" is stale: M6) | likely |
| nose | 1 r at 7,5 | r 1 at 7.500 from the hole | 0 | match | sure |
| back | 12,5 r | r 12.5 through the beak's corner, tangent to the nose | 0 | match | sure |
| overall | 17,4 | 17.53 along the base | +0.13, over the ±0,1 | M10: 9,7 with the r 6's figures and 7,5 to the nose's centre give 17.53; the sheet draws 17.44 (its nose end 8.2 from the hole, the r 1's centre 7.4 from it) | possible |
| "8,5" (F10) | — | — | — | F10 settled: on the full scan (`s14.png`) there is one figure there, the "85°" of the beak's face (its arc and degree sign). No separate 8,5 | likely |

Overlay `ov\click.png`: every line of the plan has its partner within 1-2 px (0.1 mm) but the nose's end, which stands 0.1 past the sheet's (M10).

## 05 08 04: the intermediate bridge (every version)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| holes on one line | pins, screws, bush, jewel in that order | 29, 28, 38, 35, 43, 44 on the table's line (to 0.001) | 0 | match | sure |
| outline, thickness | not figured (05 08 04-1 not in the set) | 45.5 × 10 round-ended, 3.8 (scaled; Wempe 3955 45.7 × 9.75) | — | recorded (Estimated) | likely |
| pins | 1,3 proud | 1.30 (2.05-3.35) | 0 | match | sure |
| screws | sunk from the outer face | Ø 2.8 clear, Ø 4.7 × 2.0 sinks from the dial face | — | match (sinks estimated, recorded) | likely |
| "0,7 +0,02" (F9) | at the bush | the bush's face 0.71 in from the plate side (4.06) | 0 | match (train.js: the arbor's endshake closes on it) | likely |
| "1,7" (F9) | at the jewel | the jewel's face 1.75 in (5.10) | +0.05 | recorded departure (train.js: the seconds arbor's 24.1 −0.1 leaves no endshake at 1.70) | likely |
| WN-300 | a pressed brass bush | Ø 4.30 bush in a Ø 4.30 hole (line to line), 45° mouth to Ø 5.7 | — | M11 (a press with no interference) | possible |

## Overlay, the build book (pp. 42-91, v3.41.00)

The book's sheets have a partner for most of the sheets' lines, but not all:
- **Upper cock (p. 64).** The plan partners the sheet's: the outline, slot, r 22 and r 12 arcs, holes 8 and 20, the pins dashed. The one line the sheet lacks is the stud's screw hole (F2). The A-A section shows a level "12.61" beside "12.60", which is the boss's 0.01 overlap into the arm (frame.js `yB`), not a face.
- **Barrel bridge (pp. 42-44).** The plan and contour draw the straight chord as an arc R 73.52, and the short edge as a line 0.8 long. The model's chord is straight and the edge 11.07 long. The hole table leaves out hole 46 (M2.6).
- **Lower cock (pp. 71-73).** The plan is drawn askew to its bar (its A-A runs through the bore and 36). Its only figures are the boxes' 23.35 × 21.17. The hole table has neither 36 (M2.6), the two M1.2, nor the 5.2 seat.
- **Fusee bush (pp. 55-56).** The half section is hatched in wedges. The g6 and r6 diameters and the 1:70 aren't dimensioned. The flange's counterbores aren't in the table.
- **Dust bush (pp. 59-60).** The section is a sliver drawn upside down, and its diameters are 13.35, 10.75, 13.81, 9.95 against the solid's 13.1, 10.5, 15.1, 9.7. Its shoulders' heights are right.
- **Click screw (p. 49).** The Ø 3.1 shoulder is missing from its diameters.
- **Tapped holes in general.** The upper cock's M1.2 × 2 and M1.4 aren't in its hole table either.
- **Click (p. 46).** Its sheet partners the original but for the 17.53 (M10).

All are drawbook.py's, as batch 7's M8 (M12).

---

## Fit list (step 6)

seatcheck.py `-v` rows ("held n/N by"), and the radii measured on the solids. Tolerances are the sheets'. bom.py's press passes ≤ 0.02 and its tap ≤ 0.1.

| # | piece | into | seat on the solid | sheet's fit | model's fit | held by | verdict |
|---|---|---|---|---|---|---|---|
| J1 | lower cock's pins WN-203.lc (Ø 1.600, 3 long) | the cock's 22, 37 / the plate's 1,6025 | Ø 1.5825 × 2.5; plate 1.6025 (sunk Ø 2.5 × 1.6 from the outer face) | press 1,585 −0,005 (0.015-0.020 on a Ø 1.6 pin) / slide | 0.0175 press, 1.7 in; 0.0025 clear, 1.3 in | 28/30 by topPlate, lowerCock | holds |
| J2 | WN-53 (M2.6 × 5.0, head Ø 5.8 × 1.7) | the plate's 36 / the cock's 36 | 2.8 clear, Ø 6.012 × 1.8 sink / M2.6 tapped, the thread matched | clear / tapped | head in the sink, 3.45 into the cock | 28/67 by lowerCock | holds |
| J3 | the lower setting 050406-2.bl (Ø 5.2) | the lug's seat Ø 5.206 on the 0.5 lip | 0.006 clear | an H7 seat; held by screws (U30 by analogy) | two WN-10 M1.2 in the lug's tapped holes (17/34 each) | holds; bom.json calls it `press` (M9) |
| J4 | upper cock's pins WN-203.uc (6, 9, 50) | the cock / the plate | as J1 | as J1 | as J1 | 28/30 each | holds |
| J5 | WN-ucs (M2.6, head Ø 6.4 × 3.0) | the cock's 8 / the plate's M2.6 | 2.8 clear / tapped | clear / tap | 3.0 into the plate | 23/92 by topPlate | holds |
| J6 | the upper settings (050406-2.bu Ø 5.2) | the seat Ø 5.206 on the lip | 0.006 clear | as J3 | two WN-55.ck M1.2 at ±3.525 (17/34 each) | holds; bom.json `press` (M9) |
| J7 | the stud's bar (05 03 02-3) | the cock's top | on the top face, its upright in the 1,8 H7 slot | slot 1,8 H7 (1.800-1.809) on the upright's 1,8 g6 (1.792-1.798): 0.002-0.017 clear | slot 1.800, upright 1.790: 0.010 clear, the upright 0.002 under g6's least (M7) | WN-11 (M1.4) through its Ø 1.509 into the cock's tapped hole (24/61); SEAT_EXPECTED holds | holds |
| J8 | the stud's half-round pin (050302-4.s) | the stud's Ø 0.7 | in its hole | — | 17/27 | — | holds (batch 1's) |
| J9 | fusee bush 050801-2 | the plate's 10, 8.0 +0,015 (Ø 8.0075) | spigot Ø 7.9905, 2.6 in | g6 slide, 0.005-0.029 | 0.017 clear | 54/70 by topPlate, dustBush | holds |
| J10 | WN-34 × 3 (M1.4 × 3.2, heads Ø 2.1 × 0.45) | the flange's Ø 1.55 / the plate's M1.4 | heads 0.05 under the flange's face in the Ø 2.207 × 0.5 sinks; shanks end 0.45 short of the J-K recess's floor | clear / tapped | as built | 18/37 by topPlate | holds |
| J11 | dust bush 050801-3 | the bush's r6 1:70 over 2.9 | bore Ø 8.0075 → 7.966 against 8.0235 → 7.982 | r6/H7 (Ø 8): 0.004-0.028 interference | 0.016 on the diameter all along the taper; its bottom ring on the flange (0 gap) | press (fine.py EXPECTED's entry, 0.8 × 2.9) | holds |
| J12 | cork ring 050801-4 | the dust bush's neck | its bore 0.01 clear of the Ø 9.7 neck, on the collar | no sheet | 0.01 clear | bom `round … press` passes on 0.01 | holds as estimated (no sheet: a cork ring on a neck) |
| J13 | barrel bridge's pins WN-203.bb | 41, 47 / the plate | as J1 | as J1 | as J1 | 27/30 each | holds |
| J14 | WN-55 × 2 (M2.6, heads Ø 6.4 × 3.0) | 42, 48 clear / the plate's M2.6 | 2.8 / tapped | clear / tap | 2.9 into the plate | 22/92 by topPlate | holds |
| J15 | the click 050805-2 | WN-22's shoulder | hole Ø 3.229 on the shoulder Ø 3.10 × 2.61 (the click 2.56: 0.05 endshake) | 3,2 +0,03 (revised to a close tolerance in 1948): a running fit on a ~3.2 shoulder | 0.13 clear | the screw's head over it | M8 (possible) |
| J16 | WN-22 (shouldered, M2.6) | 46, M2.6 through the bridge | tapped, its thread matched | tapped | 3.2 of thread | 25/79 by barrelBridge | holds |
| J17 | intermediate bridge's pins WN-203.zb | the bridge / the pillar plate's 29, 44 | as J1 | as J1 | as J1 | 28/30 each | holds |
| J18 | WN-52 × 2 (M2.6 × 4.7) | 28, 43 clear in the bridge / the pillar plate's M2.6 | Ø 2.8, sinks Ø 4.7 × 2.0 | clear / tap | heads just under the face | 22/66 by pillarPlate | holds |
| J19 | bush WN-300.zb | the bridge's 38 | Ø 4.30 in Ø 4.30 (180-gon), the book's "least gap 0.0029" | pressed (05 08 04 hatches it as a pressed bush; no size) | line to line, no interference | 31/31 by intermediateBridge | M11 (possible) |
| J20 | the seconds jewel's setting 050504-2 | the bridge's 35, Ø 5.2 | Ø 5.20 in Ø 5.20 (the book's "least gap 0.0034") | pressed or burnished (no sheet) | line to line | bom `press` passes | M11 (possible) |

seatcheck.py's SEAT_EXPECTED entry for the stud ("held by its screw, not in a hole") is re-judged and holds (J7: the coloured section's WN-11 and both photographs' screw). No other expected entry concerns these parts.

## Extra checks

### (a) Slots, notches and grooves

| feature | views | model | verdict |
|---|---|---|---|
| the upper cock's slot | 2:1 plan and C-D (both walls, its end, 82°); absent from the 4:1 figure and the 1:1 view (F1) | built in every version, through the arm and the boss | holds |
| U30's slot (1,8 −0,1) | its 5:1 plan | not the Wempe's | — |
| the dust bush's flat | plan and section agree | built, toward 255° (Wempe 3955: 256° ±5) | holds |
| the top plate's tongue at 23 | batch 9's | — | — |
| anything else in these sheets | none drawn or transcribed | none built | right |

### (b) Drawn holes

All present (the reader's table), sizes as above: 23's lip and seat in both cocks; their M1.2 (2 each); 36; 22, 37; 8; 20 (not in the 6MX); 6, 50, 9; the slot; the fusee bush's bore and three flange holes; the dust bush's bore; 45; 46; 42, 48; 41, 47; the click's hole; the intermediate bridge's six. The one hole built where 05 08 03-1 draws none is the stud's M1.4 (F2), drawn on U30.

### (c) Excuses

| entry | re-judged |
|---|---|
| checks.py EXPECTED `('dustBush:Buffer','fuseeBush:Buffer')` | holds (J11). Its text says "Ø 8 T6": r6 (M4) |
| SEAT_EXPECTED, the stud | holds (J7) |
| HOLE_EXPECTED, the upper cock's 20 | holds: drilled 2,8, "Hilfsloch f. U. Kl. ob.", nothing named goes in it. Its states are None, though the 6MX has no 20 (holecheck passes it; harmless) |
| assembly's expected (4) `corkRing|dustBush` / balance, `corkRing` / upperCock, (11) `lowerCock|balanceJewelsLow` / escapeWheel | not re-run here (assembly.py is batch 11's arrangement); their geometry is unchanged by this batch's readings |
| audit LOOSE, FLOAT | none for these parts |
| bom.json `050406-2.bu`, `.bl` `in … press` | the settings sit 0.006 clear in their H7 seats, held by two screws each (U30; the coloured section). They aren't presses, and the relation passes only by bom.py's 0.02 (M9) |
| bom.json `WN-300.zb`, `050504-2` `in 050804-1 press` | line to line (M11) |
| bom.json `050801-3` fn "8 T6" | r6 (M4) |
| bom.json `050805-2` `round WN-22 free` | passes on 0.13 (M8) |
| bom.json devs | none for these lines |
| README Estimated, the upper cock's M1.2 "drawn at their tap drill (Ø 0.95) at 3.525 … would break 0.12 into the setting's Ø 6 sink" | stale: tapped M1.2 since 26 October (frame.js), and the Ø 6 is a boss, not a sink (M6) |
| README Estimated, "the dust bush's 5° × 0.5 chamfer are in" | stale: a 0.5 ring and a 5° dish since 26 October (M6) |
| README Estimated, "The click: its base 2.81 under the hole (scaled)" | stale: 2.85 (the Ø 5.7 tangent) since 16 October (M6) |
| README, Screw heads, "WN-22 … shoulder Ø 3.1 × 2.65" | the solid's shoulder is 2.61 (M6) |
| README, "The cocks' pins carry no WN number on their sheets (taken as WN-203)" | the coloured section labels the upper cock's "Stellstift 4 WN-203" (`cs_uc_lab.png`): no longer only taken (M6) |
| bom.json `WN-ucs` "dwg: WN-55" vs frame.js "its WN number not read" | the coloured section's label at the upper cock reads "Schraube WN-55" (`cs_uc_lab.png`) and the barrel bridge's too (`cs_bb_lab2.png`). The setting screws' label (`cs_set_lab.png`) reads "WN-5?", its last digit nearer 6 than 5 at the scan's resolution, while the model calls them WN-55.ck. One WN number can't be both an M2.6 and an M1.2 screw (M14) |

---

## Findings

Thirteen findings in all, M1 and M3-M14 (M2 isn't used):

- **Joint:** M7, M8, M9, M11.
- **Possible (sheet):** M10.
- **Text or record:** M1, M3, M4, M5, M6, M13, M14.
- **Version or physics:** none.
- **Build book:** M12.
- **Settled with no change** (no finding needed): F1, F3, F7, F9, F11. F2 is settled as M3, F4 as M5, F5 as M4, F8 as M6, F10 by the click's table.

None changes the balance, escapement, fusee or train. The cocks' bores, their lips and the setting screws' holes, which place the balance staff, all match their sheets to 0.001-0.006.

**M1. Text, sure. The transcription (05-08-frame.md) for 05 08 00-2, 03-1, U30, 01-2, 04, 05-1, 05-2 (every version).**
- The reader's M1-M17 (F6): in each case the code already reads the sheet as the reader does.
- M8 (U30's "steady hole") is now settled: an M1.4-sized hole, 4.1 along (its "5" to the slot's far wall) and 4.2 across.
- Correction: the transcription corrected.
- Physics: no.

**M3. Record, likely. 05 08 03-1 with U30 and 05 03 02-3 (every version): the stud's screw hole.**
- The model's M1.4 at 4.10 along and 4.35 across holds:
  - U30 gives the 4.1 (its "5" to the slot's far wall) and the M1.4 size;
  - the stud's own sheet and the slot fix the 4.35, where U30's 4.2 belongs to the lever chronometer's stud;
  - Wempe 3955 reads 4.22/4.34 ±0.15.
- The code comment (frame.js line 481, escapement.js line 149: "not on its sheet … estimated") cites none of this.
- Correction: name U30 and Wempe 3955 in the comments and in the README's Estimated.
- Physics: no.

**M4. Text, sure. 05 08 01-2 (every version): "T6" for r6, and the card's fit.**
- "T6" appears in frame.js (lines 340, 342, 357), checks.py's EXPECTED text, bom.json 050801-3's fn and BOM.md, app.js's card and the transcription. It should read r6.
- The card (app.js lines 30-31) says "pressed into the top plate … Ø 8 T6 into the plate". The spigot is g6, a slide fit, and the r6 taper takes the dust bush.
- Correction: the text.
- Physics: no.

**M5. Text, likely. 05 08 00-2 (every version, "first"'s card): what revision a changed.**
- "(a) Toleranz war +0,05" stands over the M1.2's "3,5 +0,1".
- The cock's siblings (05 08 03-1, the top plate's P-Q) draw the same holes "3,5 +0,05".
- app.js line 415 says "as first drawn … the setting's seat +0.05".
- Correction: "as first drawn: the setting screws' holes 3.5 +0.05". No geometry changes.
- Physics: no.

**M6. Text, sure. README and frame.js comments, stale against the solid (every version):**
- (a) frame.js line 358: the dust bush's "top Ø 7.62". The solid is 7.775, by its 1:70. Add to Readings corrected: the sheet's (7,62) doesn't follow from its 1:70 over a 16.3 bore (F8, possible).
- (b) README Estimated: the upper cock's M1.2 "at their tap drill (Ø 0.95) … the setting's Ø 6 sink". They are tapped M1.2 into a Ø 6 boss.
- (c) README Left out, small: "the dust bush's 5° × 0.5 chamfer". It is a 0.5 ring and a 5° dish.
- (d) README Estimated: the click's "base 2.81 under the hole". It is 2.85.
- (e) README Screw heads: WN-22's "shoulder Ø 3.1 × 2.65". It is 2.61.
- (f) README Steady pins: "no WN number … taken as WN-203". The coloured section names the upper cock's "Stellstift 4 WN-203".
- Correction: the text.
- Physics: no.

**M7. Joint, sure (small). 05 08 03-1 with 05 03 02-3 (every version): the stud's upright and the slot.**
- The slot is 1.800 (H7's least) and the upright 1.790. That is 0.002 under 1,8 g6's least, 1.792.
- The clearance, 0.010, is inside the fit's 0.002-0.017, so the joint holds.
- Correction: the upright at g6's middle (1.795) and the slot at H7's middle (1.8045): 0.0095 clear. The upright's inner face then comes 0.0075 nearer the slot's end; check fine.py.
- Physics: no.

**M8. Joint, possible. 05 08 05-2 with WN-22 (every version): the click's running fit.**
- The click's hole is 3,2 +0,03, revised in 1948 to that close tolerance. The model's shoulder is Ø 3.10 (estimated, no WN sheet), so the click swings on 0.13 of play. That is loose for a hole held to 0.03.
- Correction: the shoulder Ø 3.19 (a close running fit on the hole's middle, 3.215: 0.025 clear), recorded in Estimated. mechanisms.py's set-up click contact is to be rerun.
- Physics: no (the set-up click).

**M9. Excuse, likely. bom.json 050406-2.bu, 050406-2.bl (every version): the balance settings "pressed".**
- They sit 0.006 clear in their 5.2 H7 seats on the 0.5 lips, each held by two M1.2 screws over its edge (U30's 129-131; the coloured section's screws).
- bom.py's `press` passes them only within its 0.02.
- Correction: relations `round`/`on` with the screws as the hold (e.g. `in 050803-1 free`), so a real press isn't claimed.
- Physics: no.

**M10. Possible (sheet). 05 08 05-2 (every version): the click's length.**
- 17.53 against the sheet's 17,4 (+0.13, over ±0,1).
- 9,7 with the r 6's figures and the drawn base (2.79-2.85) fix the beak's tip at 9.26. Then 7,5 to the nose's centre puts the end at 8.27 from the hole. The sheet draws the end 8.2 from it (the nose's centre 7.4) and the whole 17.44.
- Either 7,5 is to some other point or the figures don't close.
- Correction: none needed for function (the nose isn't the working end). Record in Readings corrected; or keep 17,4 by setting the nose's centre 7.14 along the base (7.37 from the hole).
- Physics: no.

**M11. Joint, possible. 05 08 04 (every version): the intermediate bridge's bush and the seconds jewel's setting are line to line.**
- Both are presses on the sheet: the bush is hatched as a pressed brass bush, the setting burnished in. On the solid each sits at its hole's diameter (4.30 in 4.30, 5.20 in 5.20), which the book reads as gaps of 0.003.
- Neither size is on a sheet in the set.
- Correction: a nominal interference, e.g. 0.01 on the diameter (estimated, as the motion work's presses in batch 7's M1), with fine.py entries; or record them as line to line.
- Physics: no.

**M12. Build book, sure. Pp. 42-91 (v3.41.00).**
- (a) The barrel bridge's chord is an arc R 73.52 and its short edge 0.8 long (the contour table), and hole 46 is left out of the table.
- (b) The lower cock is drawn askew, its only figures the boxes' (23.35 × 21.17).
- (c) Tapped holes are missing from the hole tables: the cocks' M1.2, the upper cock's M1.4, the lower cock's 36, the barrel bridge's 46.
- (d) Seats and counterbores are missing: the cocks' 5.2 seats, the fusee bush's Ø 2.2 sinks.
- (e) The fusee bush's section is hatched in wedges, and its g6, r6 and 1:70 aren't given.
- (f) The dust bush's section is a sliver, upside down, with diameters 0.25 off the solid's.
- (g) The click screw's Ø 3.1 shoulder is missing.
- (h) The upper cock's "12.61" is the boss's fuse overlap.
- Correction: drawbook.py (straight lines kept straight; threads and stepped bores read into the hole tables; a part aligned on its own axis; turned parts' sections as batch 7's M8), then the redraw at the end.
- Physics: no.

**M13. Record, sure (small). 05 08 03-1, 05 08 00-2 (every version): figures drawn at a tolerance's end, not its middle.**
- The upper cock's lip hole is 4.590 (4,59 +0,012). The lower cock and the plate's 26 draw 4.596.
- Both lips are 0.50 (0,5 +0,03).
- The lower cock's M1.2 are at 3.500 (3,5 +0,1, its middle 3.55), where the upper cock and the plate use their middle, 3.525.
- The slot is 1.800 (1,8 H7).
- All are in tolerance. The model's convention ("drawn at the middle of each fit") doesn't hold for them.
- Correction: at the middles (4.596, 0.515, 3.55, 1.8045). The pivot hole doesn't move, so the balance is unchanged.
- Physics: no.

**M14. Text, possible. The coloured section's WN labels (every version).**
- The labels at the upper cock's screw and the barrel bridge's screws read "Schraube WN-55" (`cs_uc_lab.png`, `cs_bb_lab2.png`).
- The balance setting screws' label reads "WN-5?" (`cs_set_lab.png`), its last digit nearer 6, yet the model names them WN-55.ck.
- frame.js says of the upper cock's screw "its WN number not read", against bom.json's WN-55.
- An M1.2 and an M2.6 can't share a WN number.
- Correction: the setting screws named by their own label (read again at full resolution), and the cock's screw as WN-55 in frame.js.
- Physics: no.
