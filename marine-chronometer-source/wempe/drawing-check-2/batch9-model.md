# Batch 9, the model against the sheets: the top plate (05 09 01, its assembly 05 08 01), the pillar plate (05 08 02-1, its assembly 05 08 02), the pillars (05 08 00-1) and the movement ring (05 08 00-3)

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch9-read.md`, with its Step 3 corrections). Its F9-F23 are settled below, and the ledger's 7-M3, S-6 and N-3 are judged.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit2`, detached at d178fd63 (main, 3.48.00). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b9m\` (written `b9m\` below).
- **Solids.**
  - `b9m\dump.py` (batch 8's, widened to whole parts) loads the page (`?snap&qa`, GPU) and freezes it as holecheck.py does. It writes every visible mesh of the parts topPlate, pillarPlate, pillars and ring, and of the lines that go into them, in all five versions, to `dump.json`. `inv.txt` lists the meshes and their bounds per version.
  - `b9m\plate.py` and `plate2.py` slice a plate by planes y = const, chain each cut into loops and fit circles. Every loop is matched to its nearest `WD.H` hole (read out of dims.js by `H.py`). Each plate is tabled at 8-10 levels: `tp_<version>.txt` and `pp_<version>.txt`, and `diff` between the versions.
  - `b9m\thr.py` measures each tapped hole's least and greatest diameter about its table centre (its thread's minor and major) at 7 levels.
  - The pillars, ring, bushes, pins and settings were sliced the same way (inline scripts on `sl.py`).
- **Tools.** All at d178fd63, `--model wempe`, MC_GL=gpu, one at a time:
  - `seatcheck.py -v` (`b9m\seat.txt`, `seat.json`, about 7 min): 498 pieces over 5 states, 476 seated, 5 expected, 0 failing.
  - `holecheck.py` (`b9m\holecheck.txt`): 1620 holes, 1472 populated, 31 expected empty, 0 failing.
  - `audit.py` (`b9m\audit.txt`): nothing new, with the three "no longer found" ring entries (N-3). Also run with `--eval "__mv.userData.setRev('6mx')"` (`b9m\audit_6mx.txt`, for N-3 only; its 26 new coplanar faces are the 6MX's own and not this batch's).
  - `isolate.py` on topPlate and pillarPlate (from above and below), ring with pillars (four sides), and one pillar end-on (`b9m\iso\r_iso_*.png`).
  - `holes.py` has no `--model`: it opened the Hamilton's page ("topPlate: no mesh with that partName"). The slices replace it, and they read each hole at every level rather than at one face only (M15).
- **Sheets.** The reader's crops in `dc2\b9\` and the composites `comp01.png` (01b with 01a offset 750 px) and `comp03.png` (03b with 03a at (710, −47)). Hole centres on the composites were fitted by `b9m\cfit.py` (edge points along 90 rays, circle fit, about 0.2 px median residual).
- **Overlays.** In `b9m\ov\`, the model's slices drawn on the scan. Red is the "oben" face's slice, blue the other face, green mid-thickness. Each region is registered by a similarity fitted on 5-7 nearby holes, with residuals 0.02-0.12 mm (the 01a strip 0.3-0.9, the scan's join).
  - Top plate: `tpl_last_{23,10,cutN,cutS,east}.png`.
  - Pillar plate: `ppl_last_{30,hs,38,north,rimS}.png`.
  - The whole-sheet homography (`tp_last*.png`) leaves 0.3-1.3 mm across the scan, so the local fits are the ones read.
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00 (27 October): pp. 4-41 rendered with their text to `b9m\book\p*.png`, `*.txt`. These are the pillar plate 4-17, the top plate 18-30, the pillars 31-32 and the ring 33-41.

**Frame.** As batch 8's. The top plate runs from TT = −22.35 (its outer face) to TI = −19.0, the pillar plate from 0 (its inner face) to 3.35 (its dial face). The ring runs from 0.35 (its face beside the plate's inner face) to 11.05 (the dial's recess). Plan x is W and z is S.

**Every hole of both tables is at its table coordinate to 0.000.** The circle fits' centres agree with `WD.H` in every drawn version: 1, 3, 4, 6, 7, 9-13, 22, 23, 26, 35-41, 45, 47, 49, 50 and 53 on the top plate; 1-4, 10-12, 14-19, 23, 26, 29, 30, 35, 38-40, 44, 45 and 49 on the pillar plate. The tapped holes are centred too: their circle fits sit 0.1-0.13 off only because a thread's helix is not a circle, and `thr.py` measured them about their table centres.

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| top plate 05 09 01 (1943, rev. a undated) | its holes, pocket and straight tongue, with 05 08 01's (1946) horns r 1 | same holes, sharp horns | same, sharp horns | Kirov 247's: no 13, 53; detent-block stud hole, two access holes, 39 at 190° | same holes, horns r 0.3 |
| pillar plate 05 08 02-1 (1941/43) | every hole but 56, 57; 30 as G-H; hand-setting cut | same | same | no hand-setting cut, contact screws, 39 at 190° | 30 plain 2.50 (photograph) |
| pillar 05 08 00-1 | one solid | same | same | same, 39 moved | same |
| ring 05 08 00-3 (rev. a 6.12.46) | screws at 340/100/220 | same | same | 342.2/102.2/246.4, gilt | groove for the hand-setting shaft |

The `diff` of the hole tables: the top plate's holes are identical in last, first, 1943 and 3955 (only the horn tips differ). The pillar plate's are identical in last, first and 1943, and in 3955 but for 30.

---

## 05 09 01: the top plate, every row of its table

Diameters from the slices (`tp_last.txt`, `thr.py`). Every row matches its table place to 0.000 (above).

| row | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outline | Ø 85 h6 × 3,35; cut Ø 42,5 about 45 | R 42.4945 (h6's middle), 3.35; the cut r 21.25 about H45 | 0 | match | sure |
| horns | sharp (05 09 01); r ≈ 1 on 05 08 01 (2:1, scaled) | last r 1.0, first/1943 sharp, 3955 r 0.3 | — | recorded (the owner's choice, 26 October 2026); see M3 for "last" | sure |
| 1, 35, 38 | 4.4 punched, 4,59 +0,012 | 4.596 through | 0 (middle) | match | sure |
| 3, 12, 40 | 3,50 +0,012 | 3.506 | 0 | match | sure |
| 4 | drill 0,9 | 0.899-0.900 through; Ø 4.3 oil sink 0.55 + 0.4 in the outer face | sink not on the sheet | recorded (Wempe 3955; frame.js), not in README Estimated (M11) | likely |
| 5 | drill 1,3, M1,7 | tapped, minor 1.319, major 1.700 through | 0 | match | sure |
| 6, 9, 41, 47, 50 | 1,6025; A-B: Ø 2,5 × 1,6 from the inner face | 1.600-1.602 for 1.75 at the outer face; Ø 2.500 × 1.6 from the inner face, 118° floor | 0 | match | sure |
| 7 | 1,6 +0,009 | 1.604 through | 0 (middle) | match | sure |
| 8, 42, 48 | drill 2,1, M2,6 | tapped 2.111/2.600 through | 0 | match | sure |
| 10 | 7.8, 8,0 +0,015 | 8.007 through | 0 | match | sure |
| J-K | Ø 22, 45°, 0,7 (F17) | Ø 21.998 at the inner face, 45° to Ø 20.6 at 0.70 deep | 0 | match (0.7 as the depth, likely) | likely |
| 3 × M1,4 round 10 | r 5,2 ±0,05, 120°, one at N | tapped 1.073/1.400 from the outer face to the recess floor at r 5.200, 0/120/240° | 0 | match | sure |
| 11, 39, 49 | 4,5 +0,012; L-M Ø 8,6 × 0,3 +0,03 in the inner face | 4.506; Ø 8.600 × 0.30 | depth at its least (middle 0.315) | match (M10) | sure |
| 13 | Körner, drill "√1,8" (a tick before it), kalibr. "—" (F22) | 1.80 through | 0 | match; the kalibr. cell reads "—" on the re-crop | likely |
| 22, 37 | 1,6025; C-D Ø 2,5 × 1,6 from the outer face | as 6 but from the outer face | 0 | match | sure |
| 23 | Ø 10 ("5 r"), the tongue 2,5 at "50°" | r 5.0; tongue 2.5, its end r 9.0 (traced on 01b) | 0 | match (overlay to a pixel: `tpl_last_23.png`) | sure |
| 26 | P-Q: 5,2 H7 from the inner face, 0,5 lip, 4,59 H7 (rev. a) | Ø 5.206 from −19.0 to −21.85; lip 4.596 × 0.50 | lip at its least (0,5 +0,05) | match (F12, F13 below; M10) | sure |
| P, Q | M1,2 at 3,5 +0,05 on the O-W line | tapped 0.926/1.200 at 3.525 | 0 (middle) | match | sure |
| 36 | 2,8; G-H Ø 6 H7 × 1,8 from the outer face | 2.800; Ø 6.012 × 1.80 | 0 | match | sure |
| 45 | punch only | the cut's centre | — | match | sure |
| 51, 52 | M2 | tapped 1.565/2.000: 51 from the outer face to the pocket's floor, 52 through | 0 | match on 05 09 01 (F10: M3) | sure |
| 53 | 1,5 H7 | 1.504 | 0 | match on 05 09 01 (not in the 6MX: recorded) | sure |
| pocket N-O | 1,35 −0,05, 23 to 51, r 4 about 51 | 1.325 deep (−20.325 to −19.0), r 4 about 51, edges tangent to r 5 and r 4 | 0 (middle) | match (overlay: the S edge and the r 4 arc on the dashed lines; the N edge where C-D's drawing covers it, F18) | likely |
| not in the table | — | the detent block's two pins Ø 0.925, countersunk Ø 1.4 on the outer face (drilled at assembly; Wempe 3955) | — | recorded (batch 2's) | likely |

**F12 settled.** The tables' "2,5 +0,009" at 26 (top) and "2,50 ±0,009" at 30 (pillar) are the jig-bored pilots. The H7 table on 01b lists the 5.2 that the sections cut on them, and the model follows the sections. Likely.

**F13 settled (drafting).** The 01b plan's two solid circles at 26 coincide with the model's 4.596 and 5.206 (`tpl_last_23.png`). A plan of the outer face should have dashed the 5.2. The same draftsman dashes 30's hidden 5.2 on 03b, so this is a slip in line style; P-Q decides. Possible.

**F16, the "7°/7 r" at 26, settled.** The README (line 795) already reads it: the dashed arc through Q is r 7 about 26, the escape wheel's tip circle (Ø 14) drawn under the plate. The arc in `b_pq.png` runs at about 7 from 26's centre, outside Q. The "50°" runs from the pocket's dashed S edge to the tongue's N side, as frame.js reads it, and the overlay puts both lines on the model's. Both are attached. Likely.

**Hole 7 drawn off its place.** On 01b, hole 7's circle stands about 0.7-1.0 mm from where its table coordinates put it, with its neighbours fitted within 0.05 (`tpl_last_10.png`, `cutN.png`). The table decides, and the model is at the table's place. No finding.

## 05 08 01: the top plate assembled (F10, F11)

- The kompl. (gez. 25.9.41, revision a 8.11.46 or 2.11.46, "zeichnerisch geändert") draws the plate without 26, its P and Q, 51, 52, 53 and the N-O pocket. Ghosts of erased lines remain where 26, 52, 53 and the pocket would be (`s02_lr.png`).
- Its "(a)" sits beside 23's tongue, which it draws curved, bending SE to a round end (`s02_plan.png`). Its horns are rounded about r 1 at 2:1.
- The model's "last" version takes the horn tips from this sheet (r 1.0), but takes 51-53, the pocket and the straight tongue from 05 09 01 (1943). HOLE_EXPECTED's `_HD` says the holding device "isn't built, as it doesn't fit the balance and detent as last revised; the 1943 plate keeps its pocket and holes". The 1946 sheet is the evidence that the plate as last revised has neither the pocket nor the holes.
- 26 erased: the escape wheel needs an upper bearing, and no sheet in the set moves it. The erasure is likely a slip in the redrawing. Keep 26 (the reader's reading).
- Wempe 3955's plate has the pocket (frame.js: `13_…unten`, tapering 9.4 to 7.5: sure), so the 3955 version keeps it. "first" and "1943" stand before the revision and keep 05 09 01's.
- This is a version question for the owner (M3).

## 05 08 02-1 and 05 08 02: the pillar plate, every row of its table

| row | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outline | fertig 85 h6, 3,35 (struck, A-B 3,35) | R 42.4945 × 3.35 | 0 | match (thickness likely, recorded) | likely |
| 1 | 4,59 +0,012 | 4.596 | 0 | match | sure |
| 2, 3, 12, 40, 19 | 3,50 +0,012 | 3.506 | 0 | match | sure |
| 4 | drill 0,9 | 0.896-0.900 | 0 | match | sure |
| 10 | drill 2,5, 2,70 ±0,009 | 2.820 | +0.12 | recorded departure (README Unresolved: the fusee arbor's 2.8 ±0.02 pivot can't run in 2.70) | sure |
| 11, 39, 49 | 4,50 +0,012 (39's +0,1 struck); E-F Ø 8,6 × 0,3 +0,03 in the inner face | 4.506; Ø 8.600 × 0.30 | depth at its least | match | sure |
| 14, 15 | drill 1,45 (no ream; struck) | 1.450 through | 0 | match (cut as Wempe 3955's: recorded) | sure |
| 16, 17 | drill 2,8 (struck) | 2.800 | 0 | match | sure |
| 18 | 3,50 +0,012 (struck) | 3.506 with the bush WN-hs | 0 | match | sure |
| 23 | punched 4,4; drawn Ø ≈ 7 | 7.000 (the scan's circle 6.92 at 9.69 px/mm) | 0 | match (recorded) | likely |
| 26 | drill 2,3, 2,50 ±0,009 | 2.500 through; a Ø 4.6 × 0.25 seat in the dial face | seat not on the sheet | match; the seat is Wempe 3955's (recorded) | sure |
| 26's M1,2 × 2 | 3,5 +0,05 on the line 37° from O-W toward S | tapped 0.926/1.200 at 3.500, on (−cos 37°, sin 37°) | at its least (the top plate's 3.525) | match (M10) | sure |
| 28, 43 | drill 2,1, M2,6 | tapped 2.111/2.600 through | 0 | match | sure |
| 29, 44 | 1,6025; A-B Ø 2,5 × 1,6 from the inner ("oben") face | 1.600; Ø 2.500 × 1.6 from y 0, 118° floor | 0 | match | sure |
| 30 | pilot 2,50; G-H 5,2 H7 / 0,5 / 4,59 H7; the plan's solid 4.6 and dashed 5.2 (F9) | last/first/1943: Ø 5.206 from the inner face (0 to 2.85), lip 4.596 at the dial face; 3955: 2.50 plain | the seat on the wrong face | **wrong (M2)** | likely |
| 30's M1,2 × 2 (G, H) | 3,5 +0,05 on the O-W line | tapped at 3.500 | at its least | match (M10) | sure |
| 35, 38 | punched 6,0; Ø 24,5 milled about 38 | twoCircles r 12.25 about 38 and r 3.0 about 35, through | 0 | match (overlay `ppl_last_38.png`) | sure |
| 45 | drill 2,7, 2,90 ±0,009 | 2.900 | 0 | match | sure |
| 56, 57 | M1,7 "nur bei Bedarf" | not cut (6MX: its contact screws elsewhere) | — | recorded (dims.js, README) | sure |
| hand-setting window | 6,5 square on the dial face, 12 +0,2 on the inner face, Ø 14 end arcs, outer edge 8,3 −0,1 from the rim | 6.5 × 6.503 at the dial face (area 42.27), 6.5 × 12.098 at the inner face (78.64), r 7 arcs in 24 cones, outer edge at R − 8.25 | 0 | match (overlay `ppl_last_hs.png`; F6) | sure |
| hand-setting bore | Ø 2, centre 1,68 from the dial face | Ø 2.0 at y 1.67, from the window out through the rim | 0 | match | sure |
| rim notch at 6 o'clock (32-2 only) | half of the ring's Ø 1 | a half circle r 0.5 at R | 0 | match (assembly-drilled) | likely |
| 32-2: 2's bush and stud | 05 08 02-2 pressed from the inner face; stud "12,3" | bush Ø 3.506 flush both faces; stud Ø 1.5 from y 0 to 12.3 (8.95 out of the dial face) | — | match: the 12.3's right extension line is on the inner face (the drawn stud stands 8.1 out at 12.8 px/mm, not 12.3) | likely |
| 32-2: 19's stud | 6,8 | Ø 1.5 from y 0 to 10.15, 6.80 out of the dial face, in a second 05 08 02-2 | 0 | match | sure |
| 32-2: WN-302 | 0,1 +0,02 below the inner face | its face at y 0.10 | at its least (middle 0.11) | match (M10) | sure |

**F9 settled: likely (M2).**
- On 03b the plan looks at the "oben" (inner) face: the pillar seats and A-B's counterbores at 29 and 44 are drawn solid, and the model cuts them from the inner face.
- The plan draws 30 as a solid circle (Ø 4.69 fitted on the scan) inside a dashed one: the visible circle is the 4.59 lip on the inner face, and the hidden 5.2 is on the dial face.
- 32-2's plan dashes 30's two screws (hidden: on the dial face), and its C-D draws their heads over the setting, on the face where the seat opens. G-H carries no "oben".
- The overlay (`ppl_last_30.png`) shows the sheet's solid circle on the model's red dial-face circle (4.596), not on its inner-face 5.206: the faces are reversed.
- The setting would be put in from the dial side and held by heads on the dial face, as the lower endstone's cap at 26 is (WN-ec).
- 30 is empty in every version (HOLE_EXPECTED), so nothing else moves.

---

## 05 08 00-1: the pillar (every version)

Sliced at 24 heights about pillar 11 (`b9m`, the inline slices).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| body | 8,1∅ −0,2 (the ∅ written high, as on "4,5∅" and "4,3∅" in `pf_top.png`; F20) | Ø 8.000 | 0 (middle) | match | likely |
| between shoulders | 19,6 ±0,04 or ±0,01 (F14) | 19.600 (−19.3 to 0.3) | 0 | match; the tolerance (M8) | sure / possible |
| spigots | 4,5 f7 (−0,010/−0,022) | Ø 4.484 | 0 (middle) | match | sure |
| spigot length | 2,8 −0,1 | 2.75 | 0 (middle) | match | sure |
| lead-in | 4,3∅ −0,2 at the end, 1,1 −0,2 long, 6° | Ø 4.30 at the end, over 1.10: 4.8° | −1.2° | over-determined (M8) | sure |
| overall | 25,3 −0,2 (F15) | 25.10 | at its lower limit | M8 | sure |
| thread | M2,6 tapped from both ends, drilled through | tapped 2.11/2.60 face to face (one helix) | 0 | match | sure |
| countersinks | 90° (drawn about Ø 2.5 at the face) | 90° from Ø 2.6 | 0 | match (scaled, recorded) | likely |
| relief grooves | drawn, not figured (about 0.9 wide × 0.3 deep at 5:1) | half-round from r 2.24 to 3.25, 0.35 deep | — | recorded estimate | likely |
| spigot end against the outer faces | — | 0.30 under each plate's outer face (3.35 − 0.3 − 2.75) | — | the reader's "0.85" is an arithmetic slip (3.35 − 0.3 − 2.8 = 0.25) | sure |

## 05 08 00-3: the movement ring (every version)

Sliced at 17 heights (the inline ring slices above).

| feature | sheet (rev. a 6.12.46) | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside | 105,95 −0,1 (a) | Ø 105.90 | 0 (middle) | match | sure |
| dial recess | 104 +0,1 × 0,7 +0,1 (a) | Ø 104.05 × 0.70 | depth at its least (middle 0.75) | M9 | sure |
| flange | 4,7 | 4.70 (6.35-11.05) | 0 | match | sure |
| band | 96∅ (tolerance erased; "−0,3?") | Ø 96.00 | at its top if −0.3 | M9 | possible |
| seat | 85 H9 +0,035, 3 +0,1 (a) | Ø 85.0175 × 3.00 | depth at its least | M9 | sure |
| lip | 83∅ (tolerance erased) | Ø 83.00, from 3.35 to 5.35 | — | match | likely |
| cone | "45°" (F19); 93∅ +1,3 | 45° from Ø 83 at 5.35 to Ø 93.0 at the recess floor (10.35) | 0 | the code's reading holds: the section's inner slope is drawn plainly, and the arrow at the far left is not on an outside corner | possible |
| 7 −0,1 (a), 10,7 −0,1 (a) | — | 7.00, 10.70 | each at its top | M9: the nominals close the chain (10.7 − 0.7 − 7 = 3), the middles don't (2.95 against 3.05) | sure |
| 3 × M2,6 on Ø 89 | 20°, 140°, 260° from 12 (drawn from the dial side) | at 340°, 100°, 220°, r 44.50; plain 24-gons Ø 2.641-2.663, 0.35-6.35, on into the flange's cone | not tapped | **M4** | sure |
| radial Ø 1,6 at 12, 2,8 under the top | — | Ø 1.6 at y 8.25 (11.05 − 2.8) | 0 | match | sure |
| dial pin Ø 1,1 at 6°, R 50,5 | — | Ø 1.100 at bearing 354° (the sheet's 6° seen from the dial), r 50.50 | 0 | match | sure |
| plate pin Ø 1 at 6 o'clock | "bei Montage der Unterplatte gebohrt" | Ø 1.00 at r 42.49: half in the seat's wall over 0.35-3.35, whole in the lip to 5.35 | 0 | match (its length estimated) | likely |
| dial screws (7-M3) | not on the sheet | 3 × plain Ø 1.040 at r 50.5 (6°, 120°, 240°), 6.35-10.35 | not tapped | **M5** | sure |
| material | "——" | nickel (Wempe 3955) | — | recorded | likely |

---

## Overlay (step 5)

**The scans, region by region (`b9m\ov\`).** Every hole of both plans has its partner on the model within the registration (0.02-0.12 mm). The lines with no partner, and why:

- **Top plate.**
  - The horns are sharp on 05 09 01 and r 1 in "last" (from 05 08 01, M3).
  - The model's hole 4 has a Ø 4.3 sink, and the plate has the detent block's two pins (photograph, recorded).
  - The pocket's N edge runs under section C-D's drawing (F18: not contradicted, likely).
  - Hole 7 is drawn 0.7-1.0 off its table place (the table decides).
  - 26's two solid circles (F13).
  - The tongue, 23, the pocket's S edge and the r 4 about 51, J-K's Ø 22, the M1.4 on r 5.2 and the 42.5 cut all lie on the sheet's lines to a pixel or two (`tpl_last_23.png`, `_10.png`, `_cutN.png`, `_cutS.png`).
- **Pillar plate.**
  - 30's faces are reversed (M2).
  - 56 and 57 are on the sheet only (recorded).
  - 26's Ø 4.6 seat is on the model only (photograph, recorded).
  - The hand-setting window, its bore, the 24.5/6.0 opening, 23's Ø 7 and the rim's arc partner exactly (`ppl_last_*.png`).

**The build book (v3.41.00, pp. 4-41).** Its plans partner the model's solids (p. 19: 25 holes numbered, the tapped ones drawn bold and unnumbered, the pocket dashed, the horns r 1, 26's 5.21 dashed). Against the sheets they lack a great deal (M13):

- **Hole tables.**
  - Every tapped hole is left out: the top plate's 5, 8, 42, 48, 51, 52, the M1.4 × 3 and 26's M1.2 × 2; the pillar plate's 26 and 30 M1.2 × 4, 28 and 43.
  - 22 and 37 are given as "Ø 1.60 (1.49 thick at 0-1.49)" with no sink.
  - The pocket, tongue, J-K recess and hand-setting bore are not in any table.
  - The top plate's levels are only "0.30, 3.35" (the 0.70, 1.325, 1.6, 1.8 and 2.85 are missing).
- **Contour.** The top plate's "Contour in the plan" is degenerate: cut-outs 6-31 are zero-length lines and arcs from a point to itself (p. 21-22).
- **The pillar** (p. 31-32): no M2.6, no countersinks, no Ø 4.3 tip or 6° lead-in, no grooves.
- **The ring** (p. 34-35): no holes and no cone. Its "shoulders from the lower end" (0, 3, 5, 6, 10, 10.7) are measured from the top face, and 5.00 and 6.00 are not faces.
- **Stale.** The book is v3.41.00, three releases behind 3.48.00.

---

## Fit list (step 6)

seatcheck.py `-v` rows ("held n/N by"), and diameters off the solids. bom.py passes a press at ≤ 0.02 and a tap at ≤ 0.1. Each fit is judged against its sheet's own tolerance.

| # | piece | into | seat on the solid | sheet's fit | model's fit | held by | verdict |
|---|---|---|---|---|---|---|---|
| J1 | pillars' spigots (Ø 4.484 × 2.75) | top plate 11, 39, 49 (Ø 4.506) | through 3.05 of the plate | f7/H7: 0.010-0.034 clear | 0.022 | WN-57 | holds |
| J2 | the same | pillar plate 11, 39, 49 | as J1 | as J1 | 0.022 | WN-56 | holds |
| J3 | pillars' shoulders (Ø 8.0) | seats Ø 8.6 × 0.30 in both inner faces | on the floors at −19.3 and 0.3, 0.30 clear round | seat 0,3 +0,03; the plates' inner faces 19.0 apart (001) | 19.6 − 2 × 0.3 = 19.0 | the screws | holds |
| J4 | WN-57 × 3 (M2.6 × 7.7, heads Ø 6.4 × 3.0) | top plate's 4.506 / the pillar's M2.6 | head on the outer face; 7.4 of thread into the pillar, matched | tapped (05 08 00-1) | 69/107 by pillars | thread | holds |
| J5 | WN-56 × 3 (the same, from the dial face) | pillar plate / the pillar | 7.4 of thread | tapped | 68/107 by pillars | thread | holds (the label F21 unsettled: possible) |
| J6 | the pillar plate (Ø 84.989) | the ring's seat Ø 85.0175 × 3.00 on its lip Ø 83 | the dial face on the lip at 3.35; the inner face 0.35 proud of the ring | H9/h6: 0-0.057 clear | 0.0285 | three WN-rs | holds as a fit; the screws M4 |
| J7 | WN-rs × 3 (M2.6, heads Ø 6.2 × 3.05) | the ring's plain Ø 2.64-2.66, 0.35-6.35 | heads 1.1 over the plate's rim; shanks −0.1 to 6.30, in no thread | "M 2,6" (07's plan): tapped | 0.02-0.03 clear on the crests; best 9/12, held 0/94 | nothing; SEAT_EXPECTED excuses it | **fails (M4)** |
| J8 | WN-201 (Ø 0.98 × 5.25) | half in the plate's rim notch, half in the seat wall; whole in the lip's Ø 1.00 | 0.10-5.35 | Ø 1 drilled at assembly; a pin | 0.02 clear | 50/53 by ring and plate | holds as placed; not a press (M7) |
| J9 | the dial (Ø 103.54) | the recess Ø 104.05 × 0.70 | on its floor at 10.35 | — | 0.25 radial | WN-10.d, dialPin | holds (batch 7's sizes) |
| J10 | WN-10.d × 3 (M1) | the ring's plain Ø 1.04 at r 50.5 | 6.35-10.35 | — (estimated) | 16/31 by ring, its helix in nothing | nothing | **fails (M5, 7-M3)** |
| J11 | dialPin (Ø 1.088) | the ring's Ø 1.100 / the dial | 6.65-11.55 | — | 0.012 clear | 49/49 | holds; bom.json `press` (M7) |
| J12 | WN-202 (Ø 1.6 × 9.45) | the radial Ø 1.6, from r 45.3 | line to line, 1.78 out of the flange | press (by its kind) | 0 | 76/94 by ring | holds; no interference (M7) |
| J13 | WN-301, WN-300.t35, WN-300.t38 (OD 4.5957) | top plate 1, 35, 38 (Ø 4.596), flush both faces | line to line | pressed (02) | 0 | 23-34 of 34-45 | holds; no press (M7; 8-M11's) |
| J14 | WN-302 (OD 4.5957) | pillar plate 1, 0.10 below the inner face | line to line | pressed, 0,1 +0,02 | 0.10 (at its least) | 33/33 | holds (M7, M10) |
| J15 | 050802-2 × 2 (OD 3.5058) | pillar plate 2 and 19 (Ø 3.506), flush | line to line | "Futter … eindrücken" | 0 | 33/33 each | holds (M7) |
| J16 | studs 050200-6/-7 (Ø 1.499) | the bushes' 1.4999 bores | line to line | pressed (32-2) | 0 | 117/123, 95/101 (with their wheels) | holds (M7) |
| J17 | WN-hs (OD 3.5058) | pillar plate 18 | line to line | pressed (not named on 32-2) | 0 | 33/33 | holds (M7) |
| J18 | stop pin 050801-5 (Ø 1.5996 × 5.2) | top plate 7 (Ø 1.6045), flush on the outer face, 1.85 out of the inner | 0.005 clear | 1,6 +0,009, "pressed" (02) | clear | 33/52 by topPlate | **M7 (likely)** |
| J19 | the fusee bush and WN-34 | 10, the M1.4 on r 5.2 | as batch 8 J9-J10 | — | — | 54/70, 18/37 | holds (batch 8) |
| J20 | the cocks' and barrel bridge's pins and screws | 6, 9, 50, 22, 37, 41, 47 / 8, 36, 42, 48 | as batch 8 J1-J5, J13-J14 | — | — | 27-28/30; 22-28 | holds |
| J21 | the counter-click's arbor | 4 in both plates (Ø 0.9) | runs | drill 0,9 | — | batch 3 | holds |
| J22 | wireStud (M1.7) | top plate 5 | tapped 1.319/1.700 | M1,7 | matched | 31/57 | holds |
| J23 | detent block's screw WN-gk (M1.7) and pins WN-201.gk (Ø 0.9) | 13 (Ø 1.8), the pins' Ø 0.925 | clear; pins in their holes | drill 1,8; pins not tabled | 0.05 clear / 0.0125 | 25/88; 43-78 | holds (batch 2) |
| J24 | escape upper jewel setting 050406-2.eu (Ø 5.20) | 26's seat Ø 5.206 from the inner face | −20.94 to −19.0 | H7 seat (P-Q) | 0.006 clear | under the endstone setting | holds (batch 2) |
| J25 | escape upper endstone setting 050408-2.eu (Ø 4.590 in the lip, 5.20 below) | 26's lip 4.596 and seat | −22.35 to −21.01, flush with the outer face | lip 4,59 H7 | 0.006 clear | WN-es (M1.2, tapped, 31/37); heads Ø 2.6 at 3.525 reach r 2.225, over the setting's r 2.295 by 0.07 | holds; the heads' bearing is thin (M14) |
| J26 | escape lower jewel bush 050406-2.el (Ø 2.50 × 0.64) | pillar plate 26 (Ø 2.50) | 1.19-1.83 | 2,50 ±0,009 | line to line | 6/6 | holds |
| J27 | lower endstone cap 050408-2.el (Ø 4.60 / 2.50) | the Ø 4.6 × 0.25 seat / 26 | 1.84-3.35 | (photograph) | line to line | WN-ec (M1.2, 22/30) on the 37° line; heads over r 2.3 by 0.10 | holds (M14) |
| J28 | intermediate bridge (pins 29, 44; WN-52 at 28, 43) | the pillar plate's dial face | as batch 8 J17-J18 | — | — | 28/30; 22/66 | holds |
| J29 | lever escape setting (Ankerrad, 30) | — | not fitted | 32-2 C-D draws it with two M1.2 | — | HOLE_EXPECTED | holds as "left empty"; its face M2 |
| J30 | the holding device (51-53) | — | not fitted | 05 09 01 only | — | HOLE_EXPECTED `_HD` | M3 |

## Extra checks

### (a) Slots, notches, pockets and grooves

| feature | views | model | verdict |
|---|---|---|---|
| the N-O pocket | 01b's N-O (1.35 −0.05) and the plan's dashed S edge and r 4 arc; absent from 02 (F10) | built in every drawn version and 3955, 1.325 deep | matches 05 09 01; M3 for "last" |
| the tongue at 23 | 01b straight, 2.5 at "50°"; 02 curved "(a)" | straight, from 01b (and 3955's photograph) | matches 01b; M3 for "last" |
| the 42.5 cut | 01b plan and note; 02 | r 21.25 about 45 | holds |
| J-K's recess | J-K, dashed in plan, 02 A-B with the flange in it | Ø 22 × 0.7, 45° | holds (F17 likely) |
| the hand-setting window and bore | 03b plan, 03a C-D, 32-2 E-F; "nur wenn eingebaut" | built (not in the 6MX) | holds |
| the rim notch at 6 o'clock | 32-2 only | half of the ring's Ø 1 | holds |
| the 24.5 opening with 35's lobe | 03b plan and note; 32-2 | through | holds |
| the pillar's relief grooves | 05 08 00-1's section, both ends | half-round, estimated | holds (recorded) |
| the ring's cone, recess, seat, lip | 07's section | as the code's reading | holds (F19 possible) |
| the 3955 ring's groove and plate notch | on no sheet | photograph, 3955 only | recorded |
| anything else | none drawn or transcribed | none built | right |

### (b) Drawn holes

Every hole the reader lists is in the model at its table place, except the ones left out on purpose:

- 56 and 57: "nur bei Bedarf", recorded.
- 30's faces are reversed (M2).
- In the 6MX: 13 and 53 (Kirov 247, recorded).

The holes built where no sheet draws one:

- the detent block's two pins (assembly, Wempe 3955);
- hole 4's sink;
- 26's lower seat;
- the 6MX's access holes and stud hole;
- the ring's dial screws (estimated, M5).

### (c) Excuses

| entry | re-judged |
|---|---|
| SEAT_EXPECTED `('ring','WN-rs')` "their M2.6 holes … open into the flange's cone … a quarter of each hole's round missing" | **does not hold as written**. Over the shanks' whole length (−0.1 to 6.30) the holes are full circles in the band. The cone begins at 6.35, past the shanks' ends. seatcheck's 9/12 comes from the screws' crests (r 1.29) standing in a plain hole (flats r 1.32, corners 1.331). The reason the screws aren't held is that the holes are not tapped (M4, S-6 confirmed) |
| audit FLOAT, the three drawn ring screws | holds: the heads bear on the plate's rim 0.35 proud of the ring's face |
| audit FLOAT, the three 6MX ring screws (N-3's "no longer found") | **holds; N-3 is not stale**. audit.py runs in "last" only. Run in the 6MX (`audit_6mx.txt`), those three are found and the drawn three are "no longer found" (M6) |
| audit LOOSE `ring:Cylinder` (WN-202's free end) | holds |
| HOLE_EXPECTED `_AUX` (3, 12, 40 in both plates) | holds: "Hilfsloch", nothing goes in them |
| HOLE_EXPECTED `_HS` (14-17), WN-hs's bore (18), the hand-setting bore | holds: struck "nur wenn eingebaut", cut as Wempe 3955's |
| HOLE_EXPECTED 23 in the pillar plate | holds: punched only, nothing stands in it |
| HOLE_EXPECTED `_H30` (30, its lip at y 2.85, its M1.2) | holds as "empty"; the lip's place (y 2.85) and the text "as sheet b's G-H draws it" follow from the reversed seat (M2): after the correction the lip lies at y 0-0.5 |
| HOLE_EXPECTED `_HD` (51-53) | holds for first, 1943 and 3955. For "last", 05 08 01 (1946) has no such holes (M3) |
| HOLE_EXPECTED, the 6MX's two access holes | holds (Kirov 247) |
| bom.json `WN-rs` `in 050800-3 tap` | the hole isn't tapped; it passes on bom.py's 0.35 (M4) |
| bom.json `WN-10.d` `in 050800-3 tap` | the same (M5) |
| bom.json `WN-301`, `WN-300.t35`, `.t38`, `WN-302`, `050802-2`, `WN-hs`, `WN-202`, `WN-201`, `050801-5` `press` | line to line, or 0.005-0.02 clear; they pass only on bom.py's 0.02 (M7) |
| bom.json `050802-2` "the one at 19 drawn dashed on 05 08 02: estimated" | 32-2's A-B hatches a bush under 19's stud as at 2: likely, not only estimated |
| bom.json devs for these lines | none |
| README line 153 "The movement ring's flange is tapped M1 2.5 deep for the dial's three screws"; the same in frame.js's trailing comment at line 259 | stale: plain Ø 1.04 through (M5) |
| README line 375, dims.js `PIL.LT` "19.6 ±0.01: sure" | the glyph's crossbar favours ±0,04 (M8) |
| README Estimated: hole 4's Ø 4.3 oil sink | not listed (only in frame.js line 102 and README line 551's passing mention) (M11) |

---

## Findings

Fifteen findings, M1-M15. By kind:

- **Wrong (geometry):** M2.
- **Version (for the owner):** M3.
- **Joint:** M4, M5, M7, M14.
- **Excuse or tool:** M6, M15.
- **Record:** M8, M9, M10, M11.
- **Text:** M1, M12.
- **Build book:** M13.

Settled with no finding of their own: F12, F13, F16, F17, F18, F19, F20, F22, F23 (dates, no effect). F21 is left possible (the coloured section's leader).

None changes the balance, escapement, fusee or train. Every arbor's hole stands at its table place to 0.000, and the pivot holes are at their fits' middles. The pillars give the plates 19.0 between their inner faces. M8 could widen the endshake's tolerance term.

**M1. Text, sure. The transcription (05-08-frame.md) for 01a, 01b, 02, 03a, 03b, 07, 11, 32-2 (every version).**
- The reader's F1-F8 (M1-M26): in each case the code already reads the sheet as the reader does.
- The omissions: 05 08 01's erasures (26, 51-53, the pocket), 32-2's rim notch, and the "12,3" stud placed (its extension line on the inner face, the stud 12.3 long).
- Correction: the transcription corrected.
- Physics: no.

**M2. Wrong, likely. 05 08 02-1 (03b plan, G-H) with 05 08 02 (32-2 plan, C-D); the pillar plate; last, first, 1943: hole 30's seat is on the wrong face.**
- The sheet:
  - the plan shows the inner face and draws 30's 4.59 solid and its 5.2 dashed;
  - 32-2 dashes the setting's two screws and draws their heads on the seat's face;
  - so the Ø 5.2 H7 seat and the screws are on the dial face.
- The model opens the 5.2 from the inner face (0 to 2.85) and leaves the 4.596 lip at the dial face. The overlay puts the sheet's solid circle on the model's dial-face lip.
- Correction:
  - frame.js line 173: `{p:C(H[30],5.206/2),a:y0+0.5,b:y1}` (the seat from the dial face down to 0.5 above the inner face), the lip Ø 4.596 at y 0-0.5.
  - The comment and README Plates ("Ø 5.2 H7 from the inner face to 0.5 above the dial face") turned round.
  - HOLE_EXPECTED's "30, its lip" place from [-5.03, 2.85, 33.73] to y 0.5, and `_H30`'s wording.
  - 3955's plain 2.50 is unchanged.
- Physics: no.

**M3. Version, likely, for the owner. 05 08 01 (rev. a 1946) against 05 09 01 (1943); the top plate; "last".**
- "As last revised" takes 05 08 01's r 1 horns but 05 09 01's holes 51, 52, 53, the N-O pocket and the straight tongue.
- 05 08 01, as revised, has no 26, 51, 52, 53 and no pocket (erased: ghosts at 26, 52, 53 and the pocket), and draws the tongue curved, marked "(a)". HOLE_EXPECTED's `_HD` already says the device doesn't fit "as last revised".
- Options:
  - (a) in "last", leave out 51, 52, 53 and the pocket, and draw the tongue curved, scaled off 05 08 01 at 2:1 (estimated, no figures). Keep 26 (its erasure taken as a slip in the redrawing: the escape wheel's upper bearing is on no other sheet). first, 1943 and 3955 stay as they are (3955's plate has the pocket).
  - (b) keep "last" as built and record that it mixes the 1943 holes with the 1946 horns.
- Recommended: (a). The tongue's curve stays an estimate.
- Physics: no (the device isn't built, and the tongue only clears the tongs).

**M4. Joint, sure. 05 08 00-3 (every version): the movement ring's three M2.6 holes are plain (S-6 confirmed).**
- The holes are 24-gons Ø 2.641-2.663 through the band (0.35-6.35), with no thread. The screws WN-rs carry an M2.6 thread that engages nothing.
- seatcheck holds them 0/94 (best 9/12, the crests in a plain hole), and SEAT_EXPECTED excuses them with a reason the solid doesn't show: the shanks end at 6.30, before the cone (6.35).
- The sheet: "M 2,6".
- Correction:
  - Tap the band's holes M2.6 (frame.js `RH` through `th`/threadWall, matchThreads on WN-rs). Carry the flange's part on as drawn.
  - Remove SEAT_EXPECTED `('ring','WN-rs')`: seatcheck fails while it is no longer met.
  - Run fine.py for the new thread.
- Physics: no.

**M5. Joint, sure. 05 08 00-3 with 05 02 00-4 (every version): the dial screws' M1 holes are plain (7-M3 confirmed).**
- The holes are Ø 1.040 through the flange (6.35-10.35), with no thread. seatcheck passes the screws (16/31) on the ring round them, but their M1 helix engages nothing. bom.json `tap` passes on 0.35.
- README line 153 and frame.js line 259's trailing comment say "tapped M1 2.5 deep" (stale since 16 October).
- Correction: thread the three M1 holes (estimated, not on the ring's sheet: through the flange) and fix the text.
- Physics: no.

**M6. Excuse, sure. checks.py FLOAT (6MX ring screws) against audit.py: N-3 is not stale.**
- audit.py freezes the model in "last" only. The three entries at (13.6, 0, −42.37), (−43.5, 0, 9.4) and (40.78, 0, 17.82) are the 6MX's screws, found when the audit runs with `setRev('6mx')` (`audit_6mx.txt`). That run shows the drawn three as "no longer found" instead.
- Correction:
  - Keep the entries.
  - Make audit.py run per version, as holecheck.py and seatcheck.py run HOLE_STATES, or tag each entry with its versions.
  - Then add the 6MX's own expected coplanar faces (26 new ones in that run, outside this batch).
- Physics: no.

**M7. Joint, likely (the stop pin) / possible (the rest). The plates' and ring's pressed pieces (every version): line to line or clear.**
- The bushes are line to line:
  - WN-301 and WN-300.t35/.t38 (OD 4.5957 in 4.596), as 8-M11 found on the bridge;
  - WN-302;
  - 050802-2 × 2 and WN-hs (3.5058 in 3.506);
  - the studs 050200-6/-7 in their bushes (1.499 in 1.4999);
  - WN-202 (1.6 in 1.6).
- These are clear:
  - the stop pin 050801-5, "pressed" (02) in 1,6 +0,009, is Ø 1.5996 in 1.6045: 0.005 clear;
  - WN-201 is Ø 0.98 in Ø 1.00: 0.02 clear;
  - dialPin is 0.012 clear.
- Correction:
  - A nominal interference (0.01 on the diameter, estimated, as batch 7's M1 and 8-M11) on the bushes and studs, with fine.py's EXPECTED entries.
  - The stop pin at Ø 1.615 (0.01 over the hole's middle).
  - WN-201 and dialPin either at their holes' size and 0.01, or their `press` changed to `free` and recorded.
- Physics: no.

**M8. Record, possible (sure for the figures). 05 08 00-1 (every version): the pillar.**
- (a) Overall 25.10, at the lower limit of 25,3 −0,2: the spigots are drawn at 2.8 −0,1's middle (2.75). The sheet's overall middle (25.2) wants spigots 2.8.
- (b) The lead-in is 4.8° (Ø 4.3 over 1.1 from the 4.484 spigot) against the drawn 6°. The three figures over-determine; 6° over 1.1 gives a tip Ø 4.25, within 4,3 −0,2.
- (c) F14: "19,6 ±0,04" is more likely than ±0,01 (the last glyph has a crossbar, `pf_196.png`). dims.js `LT 0.01: sure` and README line 375's endshake term overstate it.
- (d) F20: "8,1∅ −0,2", the ∅ written high as on "4,5∅": the model's Ø 8.0 holds.
- Correction:
  - spigots 2.775 (overall 25.15), or record (a);
  - the tip Ø 4.25 for the 6°;
  - LT "±0.01 or ±0.04, possible", and wempe_bench.js's endshake rerun with ±0.04.
- Physics: the endshake band only (bench, Monte Carlo), not the timing.

**M9. Record, sure. 05 08 00-3's revised figures (every version) are drawn at their nominals, not their middles.**
- The seat is 3.00 (3 +0,1), the recess 0.70 (0,7 +0,1), the lip-to-recess 7.00 (7 −0,1), the overall 10.70 (10,7 −0,1), the band 96.00 (its tolerance erased, read −0,3).
- The nominals close the chain (10.7 − 0.7 − 7 = 3), the middles don't (2.95 against 3.05). frame.js's "drawn at the middle of each fit" doesn't hold here.
- The plate stands 0.35 proud (0.30 at the seat's middle).
- F19: the "45°" is taken as the inner cone (possible).
- Correction: record the chain and the cone in Readings corrected. No geometry change needed.
- Physics: no.

**M10. Record, sure (small). Both plates (every version): figures at a tolerance's end.**
- The pillar plate's M1.2 at 26 and 30 are at 3.500 (3,5 +0,05), where the top plate's at 26 are at 3.525.
- The pillar seats are 0.30 deep (0,3 +0,03: middle 0.315).
- 26's lip is 0.50 (0,5 +0,05 or +0,03).
- WN-302 sits 0.10 under the face (0,1 +0,02).
- All are in tolerance; batch 8's M13 found the same.
- Correction: drawn at the middles (3.525, 0.315, 0.515-0.525, 0.11). The pillars' 0.015 deeper seats shorten the plates' gap to 18.97: check the arbors' endshake first.
- Physics: no (endshake only).

**M11. Record, likely. 05 09 01 hole 4 (every drawn version): its Ø 4.3 oil sink (Wempe 3955, frame.js line 102) is in no README Estimated entry.**
- The other photograph-only features of these plates are recorded: 26's lower seat, the detent block's pins, the 6MX's holes, the 3955 groove and notch.
- Correction: add it to Estimated.
- Physics: no.

**M12. Text, likely. The readings settled here, for the transcription and README.**
- F12: the tables' 2.5 at 26 and 30 are the jig-bored pilots.
- F13: the top plate plan's solid 5.2 at 26 is a drafting slip.
- F16: the "7°/7 r" is the escape wheel's r 7 tip arc, as README line 795; the "50°" runs from the pocket's S edge to the tongue's N side.
- F22: row 13's kalibr. reads "—".
- The bush under 19's stud (32-2 A-B hatches it): bom.json 050802-2's "estimated" becomes likely.
- The reader's "0.85" for the spigot's end under the outer face is 0.25 on the sheet's figures (0.30 drawn).
- Correction: the text.
- Physics: no.

**M13. Build book, sure. Pp. 4-41 (v3.41.00): the plates, pillar and ring.**
- (a) Tapped holes are missing from every hole table (the top plate's 11, the pillar plate's 6).
- (b) Counterbores, the pocket, the tongue, the J-K recess and the hand-setting bore are missing from the tables. 22 and 37 have no sink, and the levels are only 0.30 and 3.35.
- (c) The top plate's contour cut-outs are zero-length elements.
- (d) The pillar's sheet lacks its thread, countersinks, lead-in and grooves.
- (e) The ring's sheet lacks its holes and cone, and its shoulders are from the wrong end.
- (f) The book is three releases stale, and M2 will change p. 7's hole 22 (30).
- Correction: drawbook.py (as batch 7's M8 and batch 8's M12), then the redraw at the end.
- Physics: no.

**M14. Joint, possible (batch 2's settings, these plates' screws). The escape settings' screws bear on the settings' edges by 0.07 (upper) and 0.10 (lower).**
- WN-es heads (Ø 2.6 at 3.525) reach r 2.225 over the upper endstone setting's r 2.295 (4.590). WN-ec (Ø 2.6 at 3.5 on the 37° line) reach r 2.2 over the cap's r 2.3.
- Both are held (31/37, 22/30), but on a sliver of the head. No sheet sizes these heads or settings.
- Correction: none required. Record in Estimated, or seat the screws at the holes' middle with the heads' size from the coloured section.
- Physics: no.

**M15. Tool, sure. holes.py ignores `--model`.**
- It always opens the Hamilton's page ("topPlate: no mesh with that partName"), though CLAUDE.md lists it among the measuring tools for both models' plates.
- Correction: take `--model` through model.py's PAGE as isolate.py does.
- Physics: no.
