# Drawing check 2, batch 9: the refuter's report

The top plate (05 09 01, sheets 01a and 01b; 05 08 01 kompl., sheet 02), the pillar plate (05 08 02-1, sheets 03a and 03b; 05 08 02 kompl., sheet 32-2), the pillar (05 08 00-1, sheet 11) and the movement ring (05 08 00-3, sheet 07). The model is main d178fd63, in the read-only worktree `wempe-check2-audit2`.

I wrote every verdict below before I read `batch9-model.md`. I did not read `batch9-read.md`, the transcriptions or the first pass's reports.

**Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b9r\`. Crops were made with PIL from the sheets in `References/wempe/drawings/05-08/`.

The tools:
- `probe.py` loads the Wempe page (`?snap&qa&start=movement`, MC_GL=gpu), freezes the model as holecheck.py does, runs a JS file in each version given and prints the result. `lib.js` holds the shared helpers: meshes, world triangles and a ray-parity inside test, as seatcheck.js has them.
- `c4.js` and `c4b.js` probe the ring's screws: c4b.js is seatcheck.js run with `detail`.
- `c7.js` and `c8.js` probe the fits, the pillar and hole 30.
- `seat.json` is seatcheck.py's output for the last and 6MX versions.
- Each check ran on its own; no other browser tool ran beside it.

## Verdicts

| claim | verdict | evidence | sure |
|---|---|---|---|
| **C2** Hole 30's Ø 5.2 H7 seat belongs on the dial face; the model has it on the inner face in last, first and 1943 | **confirmed** | See C2 below. | likely (sure for the model's side) |
| **C3** The 1946 revision of 05 08 01 erases 51-53, the N-O pocket and 26, and draws the tongue curved; the model's "last" keeps them | **the facts are confirmed; that it is a revision of the part is not** | See C3 below. | sure for the facts and for 26; likely that the 1946 sheet doesn't revise the plate |
| **C4** The ring's three M2.6 holes are plain Ø 2.64-2.66 and untapped; SEAT_EXPECTED's reason is wrong | **confirmed** | See C4 below. | sure |
| **C6** audit.py's three "no longer found" FLOAT entries are the 6MX's ring screws | **confirmed** | See C6 below. | sure |
| **C7** The pressed pieces are drawn line to line or loose; the stop pin is 0.005 loose in its 1.6 +0.009 | **confirmed** | See C7 below. | sure |
| **C8** The pillar is 25.10 overall, its lead-in 4.8° against 6°, its 19.6 more likely ±0.04 | **confirmed on 25.10 and 4.8°; leans to confirm on ±0.04** | See C8 below. | sure for 25.10 and 4.8°; possible to likely for ±0.04 |
| **C10** Figures at a tolerance's end | **confirmed, every one** | See C10 below. | sure |
| **C14** The escape settings' screw heads bear on 0.07 and 0.10 of the settings' rims | **confirmed** | See C14 below. | sure |

### C2: hole 30's seat

- **The plan of 03b shows the inner face.** Its pillar seats at 49 and 39 (Ø 8.6) are drawn as solid circles. E-F puts them 0.3 into a face, and the pillar's 19.6 between shoulders less two 0.3 seats is sheet 001's 19 between the inner faces.
- **The plan's face is A-B's "oben".** 44's Ø 2.5 counterbore is drawn as two solid circles in the plan (`ab.png`, `h30.png`), and A-B labels that face "oben".
- **30's 5.2 is hidden in the plan.** It is drawn solid Ø 4.59 inside a dashed Ø 5.2 (`h30.png`): the 5.2 is not on the viewed face.
- **G-H has no "oben".** It shows the 5.2 from its top and the 0.5 lip at its bottom (`gh.png`). The draughtsman labelled A-B's face because a section's up is arbitrary; without the label, G-H's up doesn't say which face it is.
- **32-2 agrees, on its own.** Its plan (the same inner face: the pillar seats solid) draws 30's setting flange and both M1.2 heads dashed (`322p30.png`). Its C-D draws the heads over the setting, on the face where the flange sits (`322cd.png`). So the setting, its flange and its screws are on the dial face.
- **The model has the seat on the inner face.** Its own face convention (dims.js: the pillar plate's plan is its inner face, y 0) is the one I found. On the built solid, in each of last, first and 1943 (`c7.js`):
  - hole 30 opens r 2.603 (Ø 5.206) at y 0, the inner face;
  - it is r 2.298 (Ø 4.596) at y 3.35, the dial face;
  - the step is at y 2.85.
- So the lip is at the dial face and the seat on the inner face: the reverse of the plan. frame.js builds it as `{p:C(H[30],5.206/2),a:y0,b:y1-0.5}`.
- **Two side findings:**
  - A-B on 32-2 puts the 12.3 stud on the left with its dimension to the right face. The model's stud runs from y 0 to 12.3, out of the dial face. So the left there is the dial side, and the 0.1 recess for WN-302 is on the inner face, as the model has it.
  - By the same logic, 26's M1.2 screws are on the dial side, where Wempe 3955's photograph shows them.

### C3: the 1946 sheet (05 08 01 kompl.)

What the sheet shows:
- The plan has no 26, 51, 52, 53 and no N-O pocket. Every other hole is drawn: 5, 6, 7, 8, 9, 13, 22, 36, 37, 41, 42, 47, 48, 50 (`02all.png`, `02se.png`).
- Erasure smudges cover the area round 26, 52, 53 and the tongue.
- The tongue is curved, with "(a)" beside it.
- The revision line reads "a | zeichnerisch geändert | 2.11.46" (`02tb.png`; the first digit could be 8). The sheet was drawn 25.9.41.

Why it is not a revision of the plate:
- **"Zeichnerisch geändert" is a drafting change**, not a change to the part.
- **The erasure also took out 26.** The escape wheel's upper pivot must run there: P-Q of 05 09 01 seats its jewel there, and Wempe 3955's top plate has the gilt setting with its two screws there (`12_Wempe_3955_obere_Platte_oben.jpg`). So whatever the erasure was, it removed a hole the plate must have. 26's erasure is a slip (sure).
- **The part drawing keeps them.** 05 09 01 (drawn 15.6.43, its own revision a "∅ 4,5 in 4,59" dated 14.7.4x; `01atb.png`) draws 51, 52, 53, the pocket (its dashed outline and N-O's 1.35 −0.05) and a straight tongue, 2.5 wide at 50°.
- **Wempe 3955's plate keeps them.** Its outer face (`12_`) shows 51, 52 and 53 drilled near the table's places and a straight tongue. Its inner face (`13_`) shows the milled pocket running from the tongue to a hole.

The model:
- "last" keeps 51-53 (frame.js: `T(H[51],rM2…)`, `T(H[52],rM2…)`, and 53 in the drawn versions), the pocket, the straight tongue and 26.
- That follows the part drawing and the photographed plate. I don't take the 1946 assembly sheet's omissions as evidence that the plate as last revised lacks them.
- The curved tongue "(a)" is the one change the sheet marks. Even so, the 1943 part drawing and 3955 both have it straight. Undecidable from the set; I would keep the straight one.

### C4: the ring's screw holes

- **The sheet taps them.** 07's plan labels the holes "M 2,6".
- **The model's holes are plain.** frame.js builds them as `RH(p)=C(p, rM26/cos(π/24), 24, 0.5)`, put into the band's features directly. They don't go through `T()`/`th`, so they get no threadWall: a 24-gon with flats r 1.32 and corners r 1.331 (Ø 2.64-2.66).
- **The probe agrees** (`c4.js`, all three screws, last):
  - the ring's vertices round each hole are at r 1.320-1.331 at every level, never at a thread's minor radius (about 1.08);
  - the screws' shank crest is r 1.29;
  - each shank runs from y 0 to 6.30, the head from −3.05 to 0.
- **The holes are full circles all along the shanks.** Probing 24 points at r 1.36, 1.5 and 2.0 round each hole gives 24/24 in the ring's metal from y 0.5 to 6.0 (23/24 at r 2.0 by the plate's seat up to 3). It drops only from y 6.5: 21/24 at r 2.0, then 18, 15, 13, 11 and 9 by 9.0. That is the flange's cone, which starts above the shanks' ends at 6.30. Where a screw is, no quarter of the hole is missing.
- **Why seatcheck gives 9/12.** I ran seatcheck.js with `detail` (`c4b.js`). Its probe points sit 0.04 outside the crest, at r 1.33-1.34, which is inside the hole's own 24-gon between flats and corners. Each step finds 1-9 of its 12 points in metal, best 9, held 0 of 94. The cause is a plain hole only 0.03 over the crests, finer than the probe's 0.04 gap, not the cone.
- **seatcheck.py `--state last,6mx`** passes only because of the entry (`seat.json`).
- So SEAT_EXPECTED's reason, "open into the flange's cone … a quarter of each hole's round missing", is wrong (sure).

### C6: audit.py's FLOAT entries

- `audit.py --model wempe` (the last version) ends "OK: nothing new (3 expected entries no longer found)". Those are floatScrews ring:Buffer r3.1 at (13.6, 0, −42.37), (−43.5, 0, 9.4) and (40.78, 0, 17.82). They are the 6MX's ring screws, at the same places seatcheck gives them in the 6mx state.
- `audit.py --model wempe --eval "__mv.userData.setRev('6mx')"` lists those three among the floating screws. The drawn three, at (15.22, −41.82), (−43.82, 7.73) and (28.6, 34.09), are then "no longer found".
- So the entries are right for the 6MX and only look stale because audit.py runs in one state.

### C7: the pressed pieces

From the code and the solids (`c7.js`):

| piece | the piece | its hole | fit |
|---|---|---|---|
| WN-301, WN-300.t35, WN-300.t38 | bushGeo rJ, Ø 4.596 | Ø 4.596 (r 2.298 at both faces) | line to line |
| WN-302 | rJ | r 2.298 | line to line |
| 050802-2 at 2 and 19, WN-hs | Ø 3.506 | r 1.753 | line to line |
| the studs 050200-6/-7 | r 0.75 | the bushes' bore 0.75 | line to line |
| WN-202 | r 0.8 | the ring's radial bore r 0.8 | line to line |
| WN-201 | r 0.49 | the ring's Ø 1.0 (`C(pinAt,0.5)`) | 0.02 loose |
| dialPin | r 0.545 / 0.49 | the ring's Ø 1.1 and the dial's Ø 1.0 | 0.01 and 0.02 loose |
| WN-203 steady pins | rPin 0.8 | rPinP 0.80125 | 0.0025 loose |
| the stop pin 050801-5 | turned r 0.8 | top plate 7, r 0.802 at both faces (Ø 1.6045) | 0.0045 loose |

- 01a row 7 reads "1,6 +0,009", and 02 calls the stop pin "Anschlagstift unten vorstehend".
- 32-2 says of the Futter, "an dieser Seite eindrücken" (press in from this side).
- No piece is drawn with interference.

### C8: the pillar

- **25.10 overall.** On the solid the pillar at 11 runs from y −22.05 to 3.05: 25.10 (`c8.js`). The sheet gives 25,3 −0,2, so this is the lower limit. It comes from the spigots at 2.75 (2,8 −0,1's middle) and 19.6 between them.
- **The lead-in is 4.8°.** The end is r 2.15 (Ø 4.3) and widens to r 2.242 (Ø 4.484) 1.1 from the end: atan(0.092/1.1) = 4.8°. The sheet gives "6°" (`ptop.png`). At nominal figures (4.5 and 4.3 over 1.1) it is 5.2°.
- **±0.04 more likely than ±0.01.** The glyph after "±0,0" has a crossbar and a stem (`glyphs.png`, at 10× beside the same sheet's "−0,010": that "1" is a plain stroke with no flag or bar). So "4" is more likely than "1". It is not sure: the scan is about 3 px a glyph.

### C10: figures at a tolerance's end

Every figure is in frame.js and escapement.js and on the probed solids:

| figure | the sheet | the model | where in the tolerance |
|---|---|---|---|
| the pillar plate's M1.2 at 26 and at 30 | 3,5 +0,05 (03b) | 3.500 | the lower limit |
| the top plate's M1.2 at 26 | 3,5 +0,05 | 3.525 | the middle: the two plates follow different policies |
| the pillar seats | 0,3 +0,03 (03a E-F) | 0.30 (pillar plate seat floor at y 0.3) | the lower limit; INNER 19.0 depends on it |
| the top plate's lip at 26 | 0,5 +0,05 (P-Q) | 0.50 | the lower limit |
| the pillar plate's lip at 30 | 0,5 ∓0,05 (G-H; the sign unreadable, `gh05.png`) | 0.50 | a limit either way |
| WN-302 | 0,1 +0,02 (32-2) | 0.10 below the inner face | the lower limit |

### C14: the escape settings' screw heads

- Upper: the WN-es heads are r 1.3 at 3.525 from the axis, so they reach r 2.225. The endstone setting's spigot at the outer face is r 2.295. They lap it by 0.07.
- Lower: the WN-ec heads are r 1.3 at 3.5, reaching r 2.2, over the setting's flange r 2.3. They lap it by 0.10.
- These come from the code; the probe's radii agree.
- Wempe 3955's photographed top plate gives heads 2.5 across, 6.94 apart: r 1.25 at 3.47 reaches r 2.22, over a visible setting of Ø 4.5 (r 2.25). That is about 0.03. So a sliver of bearing is what the real one shows too. Record it; it is not a defect.

## Extra checks: hole-table rows and plan figures likely to be misread

| # | the row or figure | what the sheet says | the model | verdict |
|---|---|---|---|---|
| X1 | 03a row 10, Schnecke | drilled 2.5, reamed "2,70 ±0,009" (clear, `e1.png`) | 2.82 | a recorded departure, read right (not 2.80) |
| X2 | 01a row 26, Gangrad (top plate) | drilled 2.3, reamed "2,5 +0,009" (`e2.png`) | P-Q's 5.2 H7 seat and 4.59 lip | the table and the section conflict; the model follows the revised section, as at 30. Consistent |
| X3 | 03b, 1 to 10 | "22,65" (`e3.png`) | the table's N 15.292 O 16.708 gives 22.650 | matches (not 22.85) |
| X4 | 03b's chain figures | 11,85 twice (35-26 and 35-30), 12,63 (38-35), 18,12 (1-38), 10,0 (23-26) | 11.85, 11.85, 12.63, 18.12, 10.00 from the table, which the model uses | matches; the plan confirms the table's places |
| X5 | 03b, hole 23 | "7∅", a diameter with arrowheads at both ends (`e6.png`), not "7 r"; the table punches 4.4 | Ø 7 | matches, read right |
| X6 | 03b, 26's two M1.2 | on the line 37° below O toward S, 3,5 +0,05 either side | u = (−cos 37°, sin 37°), 3.5 | the direction is right; at the lower limit (C10) |
| X7 | 01b, three M1.4 round 10 | on r 5,2 ±0,05 (the figure from the centre, not a Ø 5.2 bore), 120°, one at N (`e8.png`) | brg 0, 120, 240 on r 5.2 | matches |
| X8 | A-B on both plates | Ø 2.5 × "1,6" from "oben", plate 3,35 (`e15.png`, `e15b.png`, upside down on the scan) | pinBore 2.5 × 1.6 from the counterbore face | matches (not 1.0) |
| X9 | 03a E-F | "8,6∅", "0,3 +0,03" | Ø 8.6 × 0.30 | matches; the lower limit (C10) |
| X10 | 07, the ring | see below | | the places match; the holes untapped (C4) |
| X11 | 03a rows 4 and 49, 01a row 53 | 4 at N 36.437 O 6.425 and 49 at N 36.437 W 6.425 (mirror images: easily swapped); 53 at O 15.0, 1,5 H7 | the same; 53 Ø 1.5045 | matches |

X10, the ring (07):
- The sheet: M2.6 on Ø 89 at 20° plus 120° steps, seen from the dial; the radial Ø 1.6 at 12, ⊙ 2.8 under the dial face; the dial's pin hole Ø 1.1 at 6° on 50,5, "wird bei Montage des Zifferblattes gebohrt"; Ø 1 at 6 o'clock, "… der Unterplatte gebohrt".
- Its section (`ringsec.png`): 0,7 +0,1 (a) under 104 +0,1; 3 +0,1 (a); 4,7; 10,7 −0,1 (a); 85 H9 +0,035.
- The model: 89/2 at bearings 340, 100 and 220 seen from above (the mirror); the radial bore at 11.05 − 2.8; the dial pin hole 1.1 at brg(−6), r 50.5; the recess Ø 104.05 × 0.70; the flange 4.70; overall 10.70; the seat 3.00.
- All at nominals; the holes are untapped (C4).

## Disagreements after reading batch9-model.md

I read it after the verdicts above were written. It agrees with me on C2 (its M2), C4 (M4), C6 (M6), C7 (M7), C8 (M8), C10 and C14 (M14): the same figures, often the same probes.

**Where I disagree: M3, recommended (a), to take 51-53 and the pocket out of "last" and curve the tongue.**
- It treats the 1946 kompl. sheet as "the evidence that the plate as last revised has neither the pocket nor the holes". Its argument: the sheet's omissions, its "(a)" at the tongue, and HOLE_EXPECTED's `_HD` saying the device doesn't fit as last revised.
- Having seen that argument, I still disagree:
  1. **The revision is "zeichnerisch geändert", a drafting change only.** It doesn't revise the part.
  2. **The same erasure removed 26,** which M3 itself must keep as a slip. An erasure that takes out a hole the plate certainly has can't be read as deleting the holes beside it.
  3. **The part drawing is the later sheet for the plate.** 05 09 01 was drawn 1943, with its own revision; the kompl. was drawn 1941. It keeps 51-53 and the pocket.
  4. **The photographed plate has them.** Wempe 3955's has 51-53 drilled, the pocket and a straight tongue. Its date isn't known, but it is the only real plate in the set.
  5. **A device not fitting doesn't mean its holes aren't drilled.** The model already keeps 14-18 drilled because 3955's plate is, though the hand setting isn't fitted.
- So I would take M3's (b): keep "last" as built and record the mix. At most, curve the tongue as the one marked change, as an estimate.
- M3's facts I confirm.

**No other disagreement.** Two small points:
- On M7 I confirm the facts. Whether to give press fits a nominal interference is a modelling policy, not something a sheet settles: 07 and 32-2 give no interference figure.
- On M14 the photograph shows the real heads lapping their setting by about 0.03 too, which supports "record, no change".
