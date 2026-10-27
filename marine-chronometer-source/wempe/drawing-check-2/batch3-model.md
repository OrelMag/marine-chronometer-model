# Batch 3, the model against the sheets: maintaining work, maintaining detent, stop work

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes are the blind reading's (`batch3-read.md`, with its Step 3 corrections).

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit` (main at 7d9a679c, 3.45.01). Nothing in it was edited.
- **Scratch.** All files named below are in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b3m\` (written `b3m\` below).
- **Solids.** `b3m\dump.py` loads the page (`?snap&qa`, GPU) and freezes it as isolate.py does (n 2.5, running). It then writes every visible mesh of `maintaining`, `maintDetent` and `stopWork` in all five versions (`dump.json`), and the context parts (`fusee`, `fuseeWheel`, `topPlate`, `pillarPlate`, `coverPlate`) in last and first (`ctx.json`).
- **Free spring.** `dump_ms0.py` freezes the page the same way with the drive's lead `ms` = 0, so the maintaining spring is drawn unbent (`ms0.json`).
- **Analysis.** The vertices were measured directly:
  - face levels and face loops, with circles fitted to the loops (`lib.py`, from the first pass);
  - the parts' own frames from each mesh's matrix (`a_click.py`, `a_det*.py`, `a_bar.py`);
  - polar tables about the fusee axis (−16.708, −15.292) (`a_ratchet.py`, `a_r2.py`, `a_ms*.py`);
  - pins tested against what surrounds them (`a_holes.py`, `a_pins.py`, `a_sp*.py`).
- **Overlays.**
  - `b3m\overlay.py` renders a build book page with PyMuPDF at the sheet's px/mm.
  - `b3m\overlay2.py` rasterises the model's own face edges at the sheet's px/mm.
  - Both find the mirror, rotation, scale (±2-4 %) and shift by FFT correlation with the sheet's dark pixels.
  - Output is `b3m\ov\*.png`: sheet red, model blue, both black.
- **Renders.** `isolate.py --model wempe` for the three parts: `b3m\iso\r_iso_maintaining.png`, `r_iso_maintDetent.png`, `r_iso_stopWork.png`, and close-ups and the underside in `r_iso_mw_close.png`.
- **Tools.** `holecheck.py --model wempe` (`b3m\holecheck.txt`: 1560 holes, 0 failing) and `audit.py --model wempe` (`b3m\audit.txt`: nothing new) were run one at a time.
- **Frame.** The drawings of this work are seen from the fusee's small end (the back), so the model is their mirror image. Every overlay registered mirrored, as it should.

**Versions.**

| version | maintaining | maintDetent | stopWork |
|---|---|---|---|
| last | as measured below | as measured below | as measured below |
| 6mx, 1943 | identical to last | identical | identical |
| first, 3955 | differ in two meshes: the ratchet (tips Ø 37.45, 05 06 02-1 before revision a) and the maintaining spring (020605's widths) | identical | identical |

- In maintDetent, 3955's wire stud is brass, with the same geometry.
- 3955 follows 'first' for the ratchet and the spring. No sheet checks that: it is a photograph question.
- The book (`book/wempe-build-book.pdf`) was redrawn at 3.42.00 (16:51, 27 October), after fusee.js's last change (13:24), so it shows this model. Its title blocks say "v3.41.00".

---

## 05-06_12: the maintaining ratchet 05 06 02-1 (2:1, revised 11.3.48)

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | Z = 120 | 120 tip clusters | 0 | match | sure |
| tips Ø | (a) 37,25 −0,1 | 37.200 (last, 6mx, 1943); 37.450 (first, 3955) | −0.05 / −0.05 against "war 37,5" | within tol. | sure |
| tooth depth | 0,7 +0,05 | 0.725 (tips r 18.600, roots 17.875) | +0.025 | match | sure |
| tooth form | not figured; drawn steep face, sloped back | face over 0.23° (0.07 lean), back rising 0.725 over 2.77° (about 40°); handedness the sheet's (`ov\a11_teeth.png`) | — | match | sure |
| bore | Ø 6,5 H7 +0,015 | Ø 6.5075 | mid | match | sure |
| cup outside | Ø 26,1 −0,2 | Ø 26.000 | −0.1 | within tol. | sure |
| cup inside | Ø 24,45 +0,1 | Ø 24.450 | 0 | match | sure |
| overall | 3,1 −0,2 | 3.100 (y −8.155…−5.055) | 0 | match | sure |
| rim at teeth | 1,02 −0,02 | 1.020 | 0 | match | sure |
| floor in cup | 1,3 (−0,02 or −0,1, smudged) | 1.300 | 0 | match | sure |
| chamfer | (a) 0,3 +0,15 × 45°, outer top edge of the wall | 0.3 × 45° from r 12.7 to 13.0 at the wall's free end | 0 | match | sure |
| radial holes' height | 2,1 from the bottom face to their centre (reader's M13) | centre 2.05 over the plate's outer face (SPY) | −0.05 | within (untoleranced ±0,1) | likely |
| M 1,7 ×2 | 19,5 +0,05 apart, at 9 and 3 o'clock | 19.525 apart, r 9.7625, tapped (thread wall r 0.66-0.87 through the 1.3) | mid | match | sure |
| radial Ø 0,6 holes | 42° and 60° from 9 o'clock (upper left as drawn) | Ø 0.6 at 42.0° and 60.0° from the nearer screw, the pair on the side away from the Ø 1,2 hole; the second pair 180° round | 0 | match | sure |
| Ø 1,2 H8 hole | r 14,2, 6 o'clock | Ø 1.207 at r 14.200, 90.0° from the screws' line, opposite the pins' pair | 0 | match | sure |
| struck Ø 25,4 | struck | not built | — | n/a | — |
| 5° mark | unattached | not built | — | n/a (meaning unsettled) | — |
| solid | one part | closed, but the plate's underside and the cup's and floor's top faces coincide inside it at GT (492.8 mm² facing up, the plate's full underside facing down) | — | artifact (M13) | sure |

### Step 5, overlay

`ov\r12_plan.png` is book p. 238 on the plan (mirrored, scale 1.00, rot −1°).

- Teeth, bore, the wall's circles, the M 1,7 holes and the Ø 1,2 hole all lie on the sheet's lines.
- The sheet's unmatched lines are dimensions, the 60°/42° construction, the 5° tick and the radial holes' marks on the wall. The book doesn't draw radial holes in plan; its section shows them.
- The book has no lines without a partner.

## 05-06_14: the clicks 05 06 02-3 (10:1)

### Step 4 (the click's own frame: pivot at 0, base line along x, nose to −x)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 1,82 −0,04 | 1.820 | 0 | match (upper limit; stands 0.02 past the cup's 1.80 recess) | sure |
| overall | 10,05 −0,1 | 10.031 | −0.02 | within tol. | sure |
| pivot to beak point (nose foot) | 5,2 −0,1 | **5.224** | **+0.024 over the upper limit** | **wrong (M2)** | likely |
| pivot to tail point | 5,2 | 5.198 (r 0.2 round) | 0 | match | sure |
| nose | 2 high, 85° | 2.00, 85.0° (leaning back, 0.175 over 2) | 0 | match | sure |
| hollow | r 3 about (−2,78; −3,54) | r 3 about (−2.78, −3.54) | 0 | match | sure |
| base line | tangent to the thin Ø 3 (reader: construction), so 1.5 under the pivot | **1.52** under the pivot (code: scaled 1.545) | 0.02 | **wrong (M2)**: with 1.50 the nose foot comes 5.201 from the pivot | likely |
| back | r 8 (centre unattached) | r 8 from the nose tip to the boss | — | match (overlay) | sure |
| boss | Ø 3 in the outline over its top | r 1.5 arc | 0 | match | sure |
| top edge | one line tangent to the boss to the tail | slope −0.585, tangent, r 0.2 round at the tail | — | match | sure |
| hole | Ø 1,2 H7 +0,009 | Ø 1.209 | upper limit | match | sure |
| sink | Ø 1,7 × 45° one face | 1.7 × 0.25 (44.5°) on the cup-floor face | — | match | likely (projection) |
| other face | Ø 2,2, "3 Ø" on the cone | Ø 2.2 cone, 0.42 deep, sides 49.7° off the axis; sheet's cone scaled 0.41 deep, 50.6° (`c14_elev.png`) | 0 | match; the "3 Ø" remains unexplained | likely |

### Step 5

`ov\c14_plan.png` is book p. 248 on the plan (mirrored and turned 179°, scale 1.00).

- The outline lies on the sheet's line everywhere but mid-hollow, where the sheet's line runs up to 0.2 lower. The sheet isn't to scale there; its own figures close on the model's hollow (reader's F9).
- The book's extra lines are only its Ø 1,7/2,2 circles, which the sheet draws as one thick circle.

## 05-06_13: the click springs 05 06 02-2 (5:1) and their pins 05 06 02-4

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| section | 0,4 −0,01 × 1,5 −0,1 | 0.4 × 1.5 | 0 | match | sure |
| holes | Ø 0,6 +0,02 (5 from the end, 0,8 −0,05 from the edge) and Ø 0,6 18° on, near the end | Ø 0.61 on both pins, 0.75 from the edge | 0 / −0.05 | match (lower limit of 0,8) | sure |
| end to 60° hole, hole to S | 5, 5 | 5.0 and 5.0 (arc on r 12) | 0 | match | sure |
| pinned arc | 12,0 r, its arrow on the **inner** edge (`13a.png`) | strip centred on r 12.0 (11.8-12.2), 0.025 off the wall's r 12.225 | 0.2 (if inner) | inconsistent (M5) | possible |
| long arm | 10,4 r | centred on r 10.4 (10.2-10.6) | 0.2 if inner | as above (installed shape bent to the click anyway) | possible |
| S | round two Ø 2,2 formers, 105° | a cosine ramp over 8.5°, no former radii | — | form approximate (recorded: README "S over 8.5°") | likely |
| tip | 110° from the hole | 110° (−167.0° against the pin's −57.0°) | 0 | match | sure |
| gestreckt | 27,0 (±0,1 untoleranced) | **26.63 and 26.67** (centreline from the face loop) | **−0.35** | **wrong (minor) (M7)**; README §P1c records "developed 26.6 against 27,0", not in Estimated | sure |
| pins 05 06 02-4 | through the wall's Ø 0,6 and the spring's holes; the coloured section labels them **"Niet"** | plain Ø 0.6 × 1.6 cylinders, radial (0.07° off), r 11.80-13.40: flush with the spring's inner face, **0.40 proud** of the wall's outer face (r 13.0) | — | joint holds; kind of fastener differs (M6) | likely |

### Step 5

- No book overlay was made. The formed spring (05-06_13) and the installed one differ: the model's free arm is bent onto the click.
- The installed springs are compared on 05-06_11's assembly instead (below).
- The radial scan of the sheet (inner edges at 200.5 and 169 px) can't separate inner from centre radii to better than 3 %, because the construction centre is hard to place exactly.

## 05-06_11: the ratchet assembled 05 06 02 (5:1)

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| clicks | at 9 and 3, beaks toward the click wheel | on the screws at 9 and 3; both 0.02 clear of the click wheel's teeth at the frozen state (seated) | — | match | sure |
| springs | pinned upper left and lower right, each running 110° to the far click's back, S near 11 and 5 o'clock | same | — | match (`ov\a11_plan.png`) | sure |
| 60° | to the outer pin of the upper-left pair | 60.0° | 0 | match | sure |
| WN-21 | head on the outer face, shank through the plate into the click, domed end inside the cup | head Ø 2.6 × 0.9 under the plate, M1.7 threaded through the plate's tapped hole, shoulder Ø 1.19 to a domed end 0.25 inside the rim | — | match (head and shoulder sizes estimated, README) | likely |
| springs in section, mark at the lower one | rivet heads (reader) | no heads | — | M6 | possible |

### Step 5

`ov\a11_plan.png` (`mw_last.npz`: the ratchet, clicks and springs, cup side; mirrored; rot −1.5°).

- The teeth, wall, bore, clicks and springs lie on the sheet's lines.
- The clicks' beaks differ by a few degrees, because they ride.
- The Ø 1,2 hole is drawn about 0.6 off tangentially. The part sheet's own overlay (`r12_plan`) puts it on 6 o'clock, so this is drawing precision.
- The pins are not drawn in the model's edges (cylinders).
- The book's assembly sheet (p. 237) is seen from the spring's side and so isn't overlaid. Its number is wrong (M10).

## 05-06_10: the maintaining spring 05 06 01-1 (5:1), and 05-06_09: 020605 (as first drawn)

### Step 4 (free ring, `ms0.json`; u from the eye the long way to the square end)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside Ø | 32,3 −0,1 | 32.250 | −0.05 | within tol. | sure |
| outside Ø, 020605 | **[32,3 −0,02]** (boxed) | 32.250 ('first') | **−0.03 under the lower limit** | **wrong (version, M12)** | likely |
| thickness | 1,35 −0,1; 020605 1,3 (1,4 +0,04 pre-turned) | 1.300 | 0 | within / match | sure |
| band | 2 (×6 figured) | 2.000 from u 50° to 270° | 0 | match | sure |
| inner edge near the eye | concave fillet into the eye | arc r 10.41: 3.07 wide at 10°, 2.07 at 40° | — | match (overlay) | sure |
| swell | r 6 about a point on the 270° ray (centre unattached), to 4 at the end | r 6 from 270° to the corner at 293.9° (3.68), then r 13.24 to 3.97 at 335.6° | — | match (overlay) | sure |
| end | 4 across | 3.97-3.99 at 334-336° | 0 | match | sure |
| holes | 1,2 H7 ×2: eye on the 0° line, the other r 14,2 at 65° the other way | Ø 1.200 both, r 14.200, 295.0° apart | lower limit | match | sure |
| hole chord | 15,25 | 15.259 | 0 | match | sure |
| eye | 1,8 r about its hole | r 1.80 | 0 | match | sure |
| 0,8 at the eye | to the slanted 400° line (drawn about 2.6; meaning unsettled) | eye hole on 0° (EYO 0) | — | recorded (README Unresolved) | — |
| 020605 widths | 1,8 @40, 1,9 @100, 2 @150/195, 2,5 @240, 3,5 @270 | 1.785, 1.900, 1.999, 2.000, 2.501, 3.500 | ≤ 0.015 | match | sure |
| 020605 eye | "4,5 / 1,7 / 6,2" chain, "1,5" unattached | 05-06_10's eye (r 1.8 round on the hole) | see overlay | **version (M12)** | possible |
| pins 05 06 00-8 | Ø 1,25, 1,2 out each face (020605) | Ø 1.2, 1.18 out (into the ratchet) and 1.20 out (into the wheel) | −0.05 Ø | recorded (README Estimated: 1.2 in 1.2) | sure |
| outline | lines and arcs (r 10.41, r 6, r 13.24, eye r 1.8, radial end) | a 0.02-grid contour (`sdfOutline`): the book lists it as hundreds of 0.01-0.03 segments with ±0.01 jitter (pp. 259-262); the end face renders stepped (`iso\r_iso_mw_close.png` panel 4) | ≤ 0.02 | **artifact (M8)** | sure |
| top face | — | some zero-area slivers at the top level (face loops of 2-3 points), solid closed | — | artifact (minor, inside M8) | sure |

### Step 5

- **05-06_10** (`ov\s10_plan.png`, the free ring, mirrored, scale 1.00): every line has its partner, ring, band, swell, square end, eye and both holes (`ov\s10_plan_eye.png`: the eye's round and fillet on the line).
- **The build book** draws the spring **bent** (p. 257: extents 31.30 × 30.77, the eye nearly closed onto the square end), not as made (M9). So it was not overlaid. The model's free shape was overlaid instead.
- **020605** (`ov\s09_r-19.png`, 16.6 px/mm). The ring, band widths, square end and both holes are on the lines. At the eye (`ov\s09_r-19_eye.png`), 020605 draws a larger round. It reaches about 1.7 further toward the square end than the model's 'first' eye, with the hole toward its right side. The model gives 'first' 05-06_10's eye (M12).

## 05-05_12: the maintaining detent 05 05 05-1 (5:1), and 05-05_11: on its arbor 05 05 05-2

### Step 4 (the sheet's frame: pivot at 0, beak to +x; the model's outline mapped onto it by the lower corner and the hollow's centre, fit 0.05)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 14,2 (±0,1) | 14.243 | +0.04 | within tol. | sure |
| boss | Ø 5 | r 2.500 | 0 | match | sure |
| hole | Ø 2,25 H7 +0,009, Kegel 1:70 | Ø 2.250 straight | taper absent | **not modelled, not recorded (M14)** | sure |
| back | 18 r (centre unattached) | r 18.000 through the boss's top and the end's upper corner | — | match (overlay on the line) | sure |
| hollow | 9 r about (6,273; −9,645) | r 9 about (6.27, −9.65) (fit 0.03) | 0 | match | sure |
| lower corner | on 12 r ±0,1 | r 12.002 | 0 | match | sure |
| end | 2,6 tall at 80° | 2.595, 80.2° (100.16° to +x) | 0 | match | sure |
| step, upper end | 8,6 from the pivot's vertical, on the back | x 8.598, y 1.414 | 0 | match | sure |
| step, angle | 150° = 30° to the A-B horizontal (drawn 30.4-31.3°, `c12_step.png`) | **34.7°**, lower end at x 5.60 on the hollow | **4.7°**; the lower end 0.74 too far from the hub | **wrong (M1)** | likely |
| thickness | 2 | 2.000 | 0 | match | sure |
| tip | 1 −0,03, flush with the face away from the lower shoulder (05-05_11), the step on the other face | 1.000 at y −6.225…−5.225, the step on the +y face | 0 | match | sure |
| place | 6,3 ±0,1 (top face to the lower shoulder) | 6.200 | −0.1 | within tol. (lower limit; README Estimated gives why) | sure |
| arbor body | scaled Ø 2.5, about 19.5 between shoulders | Ø 2.25, 18.95 | — | estimated (README) | — |
| pivots | scaled Ø 1.0 × 3.0 | Ø 0.88 × 3.1 each | — | estimated (README) | — |
| arbor over all | scaled about 26 | 25.15 | −0.85 scaled | estimated | — |
| shoulders and ends | chamfered shoulders, rounded pivot ends (05-05_11) | square shoulders, flat ends | — | **missing (M14)**, first-pass finding 12 not acted on | likely |
| pivot holes | hole 4 drilled 0.9 (tables) | pillar plate Ø 0.90, top plate Ø 0.90 under a Ø 2.4 sink; the pivots end inside both | — | match | sure |
| wire spring | "Drahtfedermitte" about 4.7 from the pivot (reader's M4) | wire root 4.735 from the pivot (hole 5), bearing at the detent's level 4.99 from it on the back (sheet frame 4.24, 2.62), deflected 0.43 | ≈ 0.3 | match within reading | possible |
| step's clearance over the fusee wheel's tips (r 20.285) | — | 0.566 at the frozen state (userData.step 0.589 at rest) | — | — | sure |

### Step 5

`ov\d12_plan.png` is book p. 266 on the plan (mirrored, scale 0.99, rot 1°).

- Back, hollow, boss, hole, end face and tip lie on the sheet's lines.
- The model's step line runs a little steeper than the sheet's dashed line and ends nearer the beak on the hollow (M1).
- All the sheet's unmatched lines are construction and dimension lines.
- The book draws a small break in the back where it meets the boss, at the top of the boss. The back's r 18 through (0, 2.5) meets the boss's circle at 6.7° (no tangency figured). The break is a drawing artifact of the book, not a line missing on the sheet.

The 05-05_11 elevation was not overlaid: the model's arbor is estimated and has no book elevation at the sheet's scale.

## 05-06_04: Blatt 2, Schnitt A-B (the arrangement) and Schnitt C-D (the stop work), 5:1, A3

### Step 4, A-B

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| clicks, springs, pins | as 05-06_11 | as 05-06_11 | match | sure |
| "0,2" between the wall and the spring (reader's M6) | 0,2 | 0.025 | M5 | possible |
| "Stift nach oben" in the kidney | the eye's pin up into the ratchet | eye pin 05 06 00-8 up through the ratchet's Ø 1,2 H8, ending 0.01 past its 1.02 plate; the other pin down 1.20 into the wheel's hole | match | sure |
| detent, "Drahtfedermitte" | detent at the top left, the wire bearing on its arm | so (above) | match | likely |
| dashed small circle at the left (H17) | unidentified | lies at about r 14, 157° round from 12 o'clock as drawn, which is where the maintaining spring's hidden pin into the wheel stands (65° from the eye at 6 o'clock) | identified: the spring's pin into the wheel (H12), present | likely |

### Step 4, C-D (bar frame u along the bar, v across)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bar length | 22,5 or 22,6 (reader undecided) | 22.496 | 0 / −0.1 | match | likely |
| bar width | drawn about 2 (in the slot 2 H8) | 1.98 (v 4.01-5.99, g6 estimated) | — | estimated (code) | — |
| thickness | not on C-D | 1.45, thinned to 1.05 from u 3.4 | — | estimated (README, coloured section) | — |
| travel | 3,2 (reader: travel) | limit 3.6 (drawn); the chain's slide at full wind 3.36 (README) | +0.16 at full wind | **kept**, README "Readings corrected"; holds to the sheet's own 0.1-0.2 | likely |
| "2", "1,2", "1,76" | radial from the hub (reader corrected) | upper far corner r 12.50, lower point r 12.36 running, 9.32 wound | ≤ 0.1 | kept (README) | likely |
| "1,5" | the spring's pin 1,5 off the axis line | 1.5 | 0 | match | sure |
| "14" | the stop pin's R | stop pin at 13.9997 from the fusee axis, Ø 1.6 in hole 7 (Ø 1.6045) | 0 | match | sure |
| bar's pin hole (H14) | drawn dashed across the bar | **no hole**: no bar vertex within 0.4 of the pin's place; the pin (Ø 0.5 × 2.9) passes through solid steel | — | **missing (M3)** | sure |
| spring's pin 05 06 04-4 (H15) | the spring held on it (dashed pin in the recess) | pin in the body's 0.5 H7 hole; **69 surface samples of the spring lie inside the pin** (the ribbon runs through it 0.009 from its axis): no hole in the spring | — | **missing (M4)** | sure |
| spring's end on the bar's pin | the curve ends on the pin in both positions | 0.019 clear of the pin's surface | — | match | sure |

### Step 5, C-D

`ov\cd_plan.png` uses the model's small-end face, the bar and the spring (running), mirrored, scale 1.01.

- The hub Ø 21, the recess, the bar's outline (lower oblique end, rounded upper end) and the spring's running shape all lie on the sheet's solid lines.
- Unmatched on the sheet:
  - the dashed wound positions (the model is frozen running);
  - the bar's pin in both positions;
  - the cover plate screw's double circle (a hole from the recess floor, not on this face: batch 5);
  - the stop pin;
  - the dimensions.
- Unmatched on the model: one line from the hub's rim to the recess near the spring's pin (the body face's edge at the pin's exit).

Book pages 273 (bar), 275 (spring) and 278/280 (pins) were not overlaid separately: the stop work's only sheet is this assembly view.

---

## Step 6, fit list

| # | piece | into/onto | hole or seat (sheet) | holding (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | detent 050505-1 | arbor 050505-2 | H1 Ø 2,25 H7, Kegel 1:70 | taper press: knocked on from 7,5 to 6,3 ±0,1 | Ø 2.250 bore on Ø 2.250 arbor, straight, line to line; at 6.2 | **kept**: the place is recorded; the taper is not modelled and not recorded (M14) |
| J2 | arbor 050505-2 | pillar and top plates, hole 4 | Ø 0.9 drilled (tables) | pivots running | Ø 0.88 in Ø 0.90, both ends inside the plates | holds |
| J3 | detent's beak | ratchet's teeth | the end at r 12, 80° | the wire spring | lower corner 0.49 into the 0.725 teeth, 0.024 clear (last). In 'first' my frozen dump wasn't re-seated after setRev, so it can't be judged here (maintaining.py's job) | holds (last) |
| J4 | wire 050506-1 | stud (hole 5, M1.7) | no sheet | axial hole 1.5 deep (estimated) | wire r 0.125 in a hole r 0.125 (line to line) | kept (no sheet; README Estimated) |
| J5 | click 05 06 02-3 ×2 | WN-21's shoulder | H7 Ø 1,2 H7 | screw from the ratchet's outer face into H3 M 1,7 | shoulder Ø 1.19 in Ø 1.209; M1.7 threaded in a tapped hole | holds |
| J6 | clicks' beaks | click wheel's teeth | r 5,2 −0,1, 85° | the click springs | both 0.020 clear at the frozen state (seated) | holds |
| J7 | click spring ×2 | cup wall | H8, H9 on H4, H5 Ø 0,6 | **rivets** "Niet" 05 06 02-4 | Ø 0.6 cylinders through both holes, no heads, 0.40 proud outside, flush inside | holds as a joint, not as a rivet (M6) |
| J8 | spring's free end | click's back | 110° from its hole | its own set | bears at 110° | holds |
| J9 | ratchet | fusee wheel's tube | H2 Ø 6,5 H7 | turning | Ø 6.5075 | holds (the tube is batch 5's) |
| J10 | maintaining spring | its pins | H10, H11 Ø 1,2 H7 against pins Ø 1,25 | press | Ø 1.2 pins in Ø 1.2 holes, line to line | **kept** (README Estimated "drawn 1.2 in 1.2"); the sheets' interference isn't built (F5) |
| J11 | eye pin | ratchet H6 Ø 1,2 H8 | — | runs | Ø 1.2 in Ø 1.207 | holds; F5's conflict (a 1,25 pin can't enter 1,2 H8) is real on the sheets, kept |
| J12 | other pin | fusee wheel (H12) | — | runs | Ø 1.2 in the wheel's Ø 1.207, 1.20 deep, ends 0.02 inside the wheel | holds |
| J13 | stop bar | slot across the small end | 2 H8 (05 06 04-2) | cover plate, its spring | 1.98 in 2.0 (estimated g6) | holds |
| J14 | bar's pin 05 06 03-2 | bar | H14, drawn dashed | press | **no hole**: pin in solid steel | **no (M3)** |
| J15 | stop spring | small end's recess | its pin 05 06 04-4 (H15) | pin | **no hole in the spring**: pin through the ribbon | **no (M4)** |
| J16 | spring pin 05 06 04-4 | fusee body | 0,5 H7 (05 06 04-2) | press | in its hole, 1.07 standing into the recess | holds |
| J17 | bar's upper end | stop pin, top plate hole 7 | R 14 | contact at full wind | stop pin at R 14.000 | holds (wempe_stopwork.py's) |
| J18 | stop pin 05 08 01-5 | top plate hole 7 | 1,6 +0,009 reamed | press (bom) | Ø 1.600 in Ø 1.6045: 0.0045 **clearance** | kept: the pin has no sheet; a press pin wants about Ø 1.61. Minor |

`SEAT_EXPECTED` (seatcheck.py, batch 0) isn't on main at 7d9a679c, so it couldn't be re-judged.

## Extra checks

### (a) Slots, notches and grooves

| described | against the sheet's views | verdict |
|---|---|---|
| the cup (recess Ø 24,45 × 1,8) | 05-06_12 section and plan, 05-06_11 | holds |
| the detent's step (dashed in plan, the A-B section, 05-05_11's elevation) | consistent in every view; its angle is M1 | holds as a feature; angle wrong |
| the click spring's S | plan (two formers) and edge view (two lines) | holds; form approximate |
| the maintaining spring's gap | plan and edge view | holds |
| the stop bar's slot 2 H8, 1,5/1,1 deep | batch 5's sheet (05 06 04-2); on C-D the bar lies in it, drawn about 2 wide | holds as far as C-D shows |
| the bar thinned to 1.05 toward its upper end | on no sheet (coloured section, scaled) | estimate, recorded (README Estimated) |
| the kidney with "Stift nach oben" | A-B: the maintaining spring's eye (solid) with its pin, partly under the ratchet (dashed) | it is the spring, not a slot cut in a part |

No slot of this batch rests on a lone figure.

### (b) Drawn holes H1-H17

| # | present? | note |
|---|---|---|
| H1 | yes | plain Ø 2.25; taper not modelled (M14) |
| H2 | yes | Ø 6.5075 |
| H3 | yes | M1.7 tapped, 19.525 apart |
| H4, H5 | yes | Ø 0.6 at 42° and 60°, and opposite |
| H6 | yes | Ø 1.207 at r 14.2, 6 o'clock |
| H7 | yes | Ø 1.209 with the 1.7 sink and the 2.2 cone |
| H8, H9 | yes | Ø 0.61 in each spring |
| H10, H11 | yes | Ø 1.2 |
| H12 | yes | fusee wheel, Ø 1.207, with the pin in it |
| H13 | yes | top plate hole 7 Ø 1.6045 (batch 9 for its sheet) |
| H14 | **no** | M3 |
| H15 | yes in the body | the matching hole in the stop spring is missing (M4) |
| H16 | yes | three WN-19 M2 screws in the click wheel (batch 5 to check their sheet) |
| H17 | yes | identified as the maintaining spring's pin into the wheel (= H12) |

### (c) Excuses

| entry | re-judged |
|---|---|
| bom.json `dev` | none on this batch's lines |
| checks.py `EXPECTED` ('stopWork:Buffer','stopWork:Cylinder'): "the stop bar's pin … in its hole …, which a solid of plan cells can't cut across" | **does not hold.** The sheet draws the hole. The model cuts cross holes elsewhere with `bore()` (the ratchet's radial Ø 0.6 holes, fusee.js line 589). The same key also hides the stop spring's pin running through the spring (M4), which the excuse doesn't name. |
| bom.json 050603-2 `in 050603-1 embed` | the same excuse; does not hold (M3) |
| bom.json 050603-3 fn: "its end in that hole (not cut in the bar)", and book p. 276: "its free end in a hole across the bar" | stale: the spring's end bears on the bar's pin since 17 October 2026 (M11) |
| audit.py `LOOSE` stopWork:Cylinder (the spring's pin's free inner end) | holds for the free end (C-D draws it standing into the recess). Its "through the spring's line" should go through a hole (M4). |
| checks.py `HOLE_EXPECTED` | no entries for these parts; holecheck passes all five versions |
| README Estimated: detent at 6.2 | holds (within ±0,1) |
| README Estimated: the maintaining spring's pins Ø 1.2 in 1.2 | holds as a recorded choice; the sheets' 1,25 against 1,2 H7/H8 is unresolved (F5) |
| README Estimated: the S over 8.5°, the click springs' holes at 0.75 | hold |
| README Readings corrected: C-D's 3,2, 2, 1,2, 1,76 kept with the drawn bar | holds: 3.36 at full wind against 3,2 (0.16), the ends within 0.1 |
| README Estimated: the stop bar's thickness and thinning, the stop pin's length, WN-21's sizes, the arbor's sizes, the wire and its stud | hold (no sheet) |

### (d) The blind reading's F1, F2, F3, F5, F6 settled against the model

- **F1** (step 150°): confirmed (M1). The model's step runs at 34.7°; the sheet figures 30° and draws 30.4-31.3°. Built to the sheet from the model's own upper end (8.6, 1.403), the step meets the hollow at x 4.86 (the model's 5.60). The thick part's least clearance over the fusee wheel's tips (r 20.285) rises from 0.566 to 0.682 at the frozen state (0.589 to about 0.705 at rest). No clash either way. `b3m\a_det4.py`.
- **F2** (travel 3,2 against 3.6): recorded in README "Readings corrected" (27 October). The limit 3.6 is the drawn wound position. The slide the chain gives at full wind is 3.36, 0.16 over the figure. Kept; holds within the sheet's own scatter.
- **F3** (click springs' radius): open. The sheet's 12,0 r arrow lands on the inner edge (`13a.png`), which no 0.4 strip can have inside a wall at r 12.225. A-B's 0,2 puts the outer edge at 12.025. The model's centreline 12.0 (outer 12.2) is neither (M5).
- **F5** (pins 1,25 against holes 1,2): recorded (README Estimated). The model has Ø 1.2 everywhere.
- **F6** (Niet): M6.

---

## Findings

**M1. Wrong, 05-05_12, the maintaining detent's step angle.**
- The sheet: "150°" (the step at 30° to A-B; drawn 30.4-31.3°) from the 8,6 point on the back.
- The model: 34.7°, the lower end scaled at x 5.6 (code: "scaled ±0.3").
- How sure: likely.
- Correction: `S2 = tx([4.859, -0.757])`, the r 9 hollow met by the line at 30° from (8.6, 1.403). The thick part shrinks by about 0.5 mm² of 1 mm thickness, and its clearance over the wheel's tips grows by about 0.12.
- Physics: none of note. The detent's inertia drops by a hair, and its seating is unchanged (the thin tip's outline is the same). Rerun `fine.py`, `maintaining.py`, `mechanisms.py` and `wempe_ratchets.js --model wempe` after.

**M2. Wrong, 05-06_14, the clicks' base line.**
- The sheet: the base line is tangent to the thin Ø 3 boss (1,5 under the pivot), and the beak point lies 5,2 −0,1 from the pivot.
- The model: `CKB = −1.52`. The nose foot comes 5.224 from the pivot, 0.024 over the upper limit. The code's own comment says "5.2".
- How sure: likely.
- Correction: `CKB = −1.5`. The nose foot then lands 5.201 from the pivot, the r 3 hollow's chord ends there, and the overall becomes 10.01.
- Physics: the click's seat (`ckAng`, SEAT) is recomputed by the code. Rerun `maintaining.py --model wempe`, `mechanisms.py --model wempe --write`, `wempe_ratchets.js`, `fine.py`, then the transmission tools if their click faces change.

**M3. Missing (joint), 05-06_04 C-D, the stop bar's hole for its pin 05 06 03-2 (H14).**
- The model: the pin lies in solid steel.
- The excuse in `checks.py` EXPECTED ("a solid of plan cells can't cut across") and bom.json's `embed` no longer hold, since `bore()` cuts cross holes (the ratchet's wall).
- How sure: sure.
- Correction: bore Ø 0.5 across the bar at u −6.0, y S+0.5. Remove the EXPECTED entry, and change bom's relation to `in 050603-1 press`.
- Physics: no.

**M4. Missing (joint), the stop spring's hole for its pin 05 06 04-4 (H15's partner).**
- The model: the ribbon runs through the pin (69 samples inside it), with no hole. The same EXPECTED key masks it.
- C-D draws the spring held on the pin, and the code's own comment speaks of "its pin's Ø 0.5 hole through it".
- How sure: sure.
- Correction: cut a Ø 0.5 (+clearance) hole in the ribbon at the pin (`ribbonHoleGeo`, as the click springs have), and narrow the EXPECTED key so a new overlap of either pin fails.
- Physics: no.

**M5. Inconsistent (sheets), 05-06_13 against 05-06_04 A-B, the click springs' radial place (F3).**
- The sheets: 05-06_13's "12,0 r" to the inner edge; A-B's 0,2 from the wall (outer edge 12.025).
- The model: centred on 12.0, outer edge 0.025 off the wall.
- How sure: possible.
- Proposal: record it in README Unresolved. If A-B is taken (the installed state), set the strip's centreline to 11.825 and keep the pins' angles.
- Physics: none (the click springs' force isn't in a tool's tables, as far as fusee.js shows).

**M6. Kind of fastener, coloured section and 05-06_11, the click springs' fixings 05 06 02-4.**
- The sheets: the coloured section labels them "Niet" (rivets), and 05-06_11 draws them with rounded ends both sides of the wall.
- The model: plain Ø 0.6 × 1.6 pins, flush inside, 0.40 proud outside, unheaded.
- How sure: likely.
- Correction: rivet heads both sides (small domes over the holes, inside on the spring and outside on the wall, the outside within the fusee body's mouth clearance, 0.017 now), or record it.
- Physics: no.

**M7. Wrong (minor), 05-06_13, the click springs' developed length.**
- The sheet: gestreckt 27,0 (±0,1).
- The model: 26.63 and 26.67.
- It is recorded in README §P1c, not in Estimated.
- How sure: sure of the number; likely of the cause, the S as a cosine ramp rather than bends round two Ø 2,2 formers.
- Correction: form the S round the two formers (r 1.1 + 0.2) at the sheet's 105°, keeping the tip at 110°. Or move the note into Estimated.
- Physics: no.

**M8. Artifact, 05-06_10, the maintaining spring's outline.**
- The model: built by `sdfOutline` at 0.02. The build book lists it as hundreds of 0.01-0.03 segments with ±0.01 jitter (pp. 259-262). The radial square end renders stepped (`iso\r_iso_mw_close.png`). There are zero-area slivers on its faces.
- The sheet: lines and arcs, which the code itself constructs (`w48`: r 10.41, r 6, r 13.24, the eye r 1.8, the blend r 15.88, the radial end).
- How sure: sure.
- Correction: build the outline from those exact arcs and lines (then bent as now).
- Physics: no (the widths are within 0.02).

**M9. Build book, p. 257, the maintaining spring drawn bent.**
- The book: the running state (extents 31.30 × 30.77, the eye nearly on the square end).
- A maker's sheet draws the free ring Ø 32.25.
- How sure: sure.
- Correction: drawbook's export at `ms = 0` for this part.

**M10. Build book, p. 237, the maintaining assembly's number.**
- The book: "05 06 00-8" (the spring's pin's number).
- It should be 05 06 02 with 05 06 01.
- How sure: sure.
- Correction: the sheet number in drawbook's part metadata.

**M11. Inconsistent text, the stop spring's end.**
- The text: bom.json 050603-3's fn ("its end in that hole (not cut in the bar)") and book p. 276 ("its free end in a hole across the bar").
- The model: the end bears on the bar's pin (17 October 2026).
- How sure: sure.
- Correction: the text only.

**M12. Version, 020605 (05-06_09), the maintaining spring as first drawn.**
- (a) The 'first' ring is Ø 32.25 against the boxed [32,3 −0,02] (32.28-32.30). Sure. Set Ø 32.29 for 'first'.
- (b) 020605 draws the eye as a larger round reaching about 1.7 further toward the square end, with the hole to its right (`ov\s09_r-19_eye.png`; its hand-written chain 4,5 / 1,7 / 6,2 and the unattached 1,5). The model gives 'first' 05-06_10's eye. Possible. Read 020605's eye at full zoom before building it.
- Physics: none for the drawn version's tools, which run 'last'. The 'first' maintaining spring's stiffness changes only if wempe_sustaining is run on it.

**M13. Artifact, 05-06_12, the ratchet's coincident internal faces.**
- The model: `fuse()` merges the plate, the floor solid and the cup ring without removing shared faces. 492.8 mm² faces up at GT inside the part, against the plate's underside. This is first-pass finding 9, not acted on.
- How sure: sure.
- Correction: one solidGeo with cells (the teeth outline GT…G, inside r 13.0 GP…GT, the wall GC…GP) or a boolean union.
- Physics: no (massprops counts the volume once; the faces only).

**M14. Missing (minor), 05-05_11 and 05-05_12, the maintaining detent's arbor and bore.**
- The sheets: the arbor's shoulders chamfered and its pivot ends rounded (first-pass finding 12, still square and flat). The detent's bore and the arbor's seat on Kegel 1:70 (knocked from 7,5 to 6,3).
- The model: neither is modelled, and the taper isn't recorded in README Estimated. The hands' and the collet's 1:70 are.
- How sure: likely (shoulders); sure (taper).
- Correction: chamfer the shoulders, round the ends (scaled on 05-05_11), and taper the seat and bore 1:70 through the detent's 2. Or record both in Estimated.
- Physics: no.

**Nits, not findings.**
- The clicks stand 0.02 past the cup's rim: 1.82 against the 1.80 recess, both nominal and within tolerance.
- The stop pin's Ø 1.6 sits in its Ø 1.6045 hole with 0.0045 clearance where bom calls it a press fit. The pin has no sheet.
- The 05-06_11 assembly draws the Ø 1,2 hole about 0.6 off 6 o'clock. The part sheet decides, and the model follows it.

**Counts.** Step-4 rows: 92 in all.

| result | rows |
|---|---|
| match | 63 |
| within tolerance | 10 |
| estimated, recorded or kept | 15 |
| wrong | 4 (M1, M2, M7, and 'first''s Ø, M12a) |
| missing | 2 (M3, M4) |
| artifact | 2 (M8, M13) |

Joints: 18, of which 12 hold, 4 are kept with reason and 2 don't hold (M3, M4).

Findings by kind:

| kind | findings |
|---|---|
| wrong | 3: M1, M2, M7 |
| missing | 3: M3, M4, M14 |
| inconsistent (sheets) | 1: M5 |
| kind of fastener | 1: M6 |
| artifact | 2: M8, M13 |
| build book | 2: M9, M10 |
| inconsistent text | 1: M11 |
| version | 1: M12 |
