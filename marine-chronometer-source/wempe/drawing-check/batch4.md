# Batch 4: the escapement against its sheets (26 October 2026)

Worktree `claude/wempe-artifacts` at its committed state (3facd5a0; the coordinator moved the uncommitted frame edits out before I measured). Read only: nothing in the repository was edited.

**How I measured.**
- The built solids came from the page (`?snap&qa`, GPU), in every version: last, first, 3955, 6mx, 1943 (`b4/dump.py`). For each mesh I took the vertices, triangles and normals in the movement frame.
- Every part was put in its own frame: the wheel about W = H[26] (−11.783, 21.743); the detent and block in the detent frame (t, n), which `b4/frame.py` recomputes from escapement.js:39-50 (P = (−14.392, 15.097), ROW 18.690, t = (−0.9036, 0.4285), n = (0.4285, 0.9036)).
- Measurements: profiles of the turned parts, face loops, face areas by orientation, open edges (0 on every mesh), normal-versus-face deviation (shading), and coincident opposite faces (internal seams).
- On the sheets I did pixel measurements: row and column scans, circle fits, and an overlay of the built tooth outline on 05-04_23 (`b4/t23*.py`, `b4/ovtooth.py`, `b4/ovcross.py`, `b4/prof72.py`).
- Renders use isolate.py's FREEZE and KEEP (`b4/render.py`). Sheet-against-render pairs are `b4/cmp_*.png`.

All files named below are under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b4\`.

---

## escapeWheel: the wheel 05 04 05-1 (05-04_23 tooth form, 25:1; 05-04_07-2, 07-1 elevations; 05-04_01 plan)

Sheet scales: 05-04_23 at 82.78 px/mm, from the rim circles fitted at Ø10.9 and Ø11.7 (ratio 1.0737 against 1.0734), centre (301.2, 702.1). 05-04_07-2 at 17.76 px/mm (from the 22.8). 05-04_07-1 at 17.4 px/mm.

| feature | sheet | model (how) | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | z = 15 (07-1); 24° pitch (05-04_01) | 15 (tip corners in the top loop) | 0 | match | sure |
| tip Ø | 14 +0,03 (05-04_23), 14,00 (05-04_01); 07-1 "D = 15,0" | 14.000 (max r 7.000) | lower limit | within tol. (the 15,0 is a slip, recorded) | sure |
| floor Ø | 11,7 | 11.700 | 0 | match | sure |
| step Ø (back's foot) | 12,1, step to the floor | 12.10, step 0.2 | 0 | match | sure |
| tip flat | 0,1834 / 1½° | 1.5° (0.183) | 0 | match | sure |
| face lean | "25°" (the 15° and 50° are construction angles); fitted face line: 46.84°, the radius through the tip 72.24° → 25.4° | FL 25 | 0.4° | match | sure |
| face root behind the tip | fitted 5.48° | 5.38° | 0.1° | match | sure |
| back | the ∅6 cutter's arc to the step 15° behind the tip (step measured at 87.3° against the tip's 72.24° → 15.0°) | r 3 arc, BK 15 | — | overlay within a line width (`crops/ov_tooth.png`) | sure |
| tooth root width | 1 | ≈0.99 | 0 | match | sure |
| rim inner Ø | 10,9 | 10.900 | 0 | match | sure |
| crossings | three openings, each bounded by one arc 7,9 r | arc r 7.9, centre 9.43; crossing 0.53 wide at 4.5 out | sheet 0.51 at r 4.5 (86.7°–93.2°) | match (overlay `crops/ov_cross2.png`) | sure |
| **crossings' phase to the teeth** | 05-04_23: crossing centre at 89.95° (flanks fitted at r 2.5 and 4.5), the locking tip at 72.24° → **17.7° behind the tip**, just behind the back's step. 05-04_01 (1941): about 1.7° ahead of the locked tip | `g0=tip0-6` (escapement.js:568): **6° behind** a tip | 11.7° against 05-04_23 | **wrong** (the code calls it "estimated"; the wheel's own sheet places it) | sure (05-04_23), likely (05-04_01) |
| thickness | 1,4 (07-1 written; 07-2 drawn 1.46; 05-04_01 elevation 1,4) | 1.40 (−17.11…−15.71) | 0 | match | sure |
| **web / recess depth** | 07-1: "0,8" **struck through, replaced by 0,7** (`crops/e71_08.png`), from the wheel's face to the recess floor. 07-2 draws the dashed recess line 13 px from each face (0.73 / 0.73) | web 0.8, recess 0.6 deep (ew0…ew0+0.6; ewWeb = ew1−0.8, escapement.js:279, 290, 568) | 0.1 | **wrong** (the model uses the cancelled figure) | sure |
| recess side | 07-1 and 07-2: the recess opens to the face toward the arbor's top-plate end (the dashed verticals run down to that face) | on the top-plate side | — | match. The code comment "05 04_7.1 draws its recess on the pinion's side" (escapement.js:557) misreads the sheet; the build is right | sure |
| recess Ø | 07-1: 11,9 → 12,4 (revision a); 07-2 drawn 11.2–11.65 | 11.62 | — | recorded departure (12.4 would cut the 1942 roots); holds | likely |
| bore | 07-2: callout "1,8 H7/h6", fit table "1,7 +0,009 / −0,007"; drawn 1.86–1.97 | Ø1.708 | — | follows the fit table, as recorded; holds | likely |
| material | 05-04_23: Messingblech 1,6 Ms 63 federhart | gilt brass, 1.4 thick | stock 1.6 finished to 1.4 | consistent | likely |
| render | — | `r_ew_0..8`, `s_ew.png`, `s_ew2.png`, `r_ew_4.png` (tooth close-up): crisp edges, no facets | — | clean | sure |

## escapeWheel: the arbor and pinion 05 04 05-2 (05-04_08), the collet 05 04 05-3 (07-2 "05 04 10"); 'last'

| feature | sheet | model (lathe profile) | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 22,8 −0,02 (07-2) | 22.78 (−19.49 … 3.29) | −0.02 | within tol. | sure |
| wheel face to pinion end | 19 | 19.00 (−15.71 → 3.29) | 0 | match | sure |
| pinion face from pinion end | 5,3 | 5.30 (−2.01) | 0 | match | sure |
| pinion | z 10, m 0,263, D 2,97 −0,01, dg 1,6 (05-04_08); length drawn 4.0 on 07-2 (71 px) | 10 leaves, r 1.485 / 0.80, 4.0 long | 0 | match (length recorded as scaled) | sure |
| pivots | 0,24 (boxed) × 0,5 | Ø0.24 × 0.5 both ends | 0 | match | sure |
| top-plate end: end to shoulder | "2" | 2.0 | 0 | match | sure |
| top-plate end: arbor below the wheel | drawn Ø0.96, 0.59 long | Ø1.0, 0.38 | — | match (the wheel's height decides the length) | likely |
| **top-plate end: the pivot's shoulder** | a **concave arc r 3** (the ∅6 circle drawn tangent to it on 07-1 and 07-2; 07-1 at 10×: Ø1.06 → pivot over 1.47) | straight cone r 0.12 → 0.5 over 1.5 | up to 0.1 mm off the arc at mid-length | **wrong (form)** | sure |
| **dial end: the pivot's shoulder** | 07-2 (`crops/e72_top.png`): pivot 0.5, then a concave arc r 3 (the ∅6 circle's centre 3.0 off the axis at the pivot's root) running **1.63 long** to the arbor Ø1.30 | straight cone **0.4 long** (r 0.6 at etL−0.9 → 0.12 at etL−0.5, escapement.js:582) | the shoulder 1.2 too short and straight | **wrong** | sure |
| arbor Ø, dial side of the pinion | 07-2 drawn 1.30 (23 px) | 1.2 | 0.1 | minor (undimensioned) | likely |
| arbor Ø, pinion to collet | 07-1 "1,2"; 07-2 drawn 1.04 | 1.2 | — | follows the figure | likely |
| collet height | 4,7 | 4.70 | 0 | match | sure |
| collet lower part | drawn Ø2.79 × 1.52–1.69 (step and chamfer) | Ø2.8 × 1.6, chamfer 0.15 | — | match | likely |
| collet pipe | drawn Ø1.69 | Ø1.7 | 0 | match | sure |
| **collet spigot's end** | 07-2 (`crops/e72_low.png`, 10×): the spigot is **riveted over in the recess**: a lip about Ø2.25 × 0.15–0.2 under the web | spigot cut flush with the web's underside | — | **missing** (minor) | likely |
| render | — | the collet's spigot end and the pivot corners shade round (`r_ew_5.png`: the spigot end looks like a dome; `r_ew_6.png`) | — | **artifact A2** (raw THREE.LatheGeometry, see the ranked list) | sure |

## escapeWheel as first drawn (05-04_07-1, 4.4.41; versions first, 1943; 6mx and 3955 differ in the collet)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| heights | teeth 0,5 under the plate, 1,4 (05-04_01); pinion face 15,2 / 17,7; 23 −0,2 | ew0 TI+0.5, ew1 TI+1.9; arbor 22.96 | — | match | sure |
| bore | 1,8 (05-04_01) | Ø1.808 | — | match | sure |
| **collet cone** | 07-1 (`crops/e71_wheel.png`, 4×): **Ø3.0 at the wheel ("3,0") to Ø2.67–2.73 at 1,8**, then a step in to the pipe Ø1.72 ("1,8") up to 5 | cone Ø3.0 → **Ø2.2** at 1.8 (escapement.js:599, "2.2 scaled") | 0.5 | **wrong** | sure (pixels: 185 and 207 px at 69.6 px/mm) |
| pinion and neck | 07-1: pinion 3, then a concave neck to 4,2 (the "4,2") into the arbor Ø1.2 | pinion 3, no neck | — | **missing** (minor) | sure |
| dial end | 07-1: Ø1.24 for 2.95 above the pinion, then a cone about 0.8 and a pivot about 1.2 long (undimensioned; the overwritten "2") | 0.5 pivot + 0.4 cone | — | differs (undimensioned) | unsure |
| web / recess | as above: 0,7 replacing 0,8 | 0.8 / 0.6 | 0.1 | **wrong** (same as 'last') | sure |
| 3955 collet | photograph: straight cone Ø2.95 → 1.50 over 4.9 | as photographed | — | recorded (photo) | — |
| 6mx | photograph: collet cone 2.77 → 1.70 × 5.08; pinion 3.9 long, 11.67–15.57 under the wheel | as photographed | — | recorded (photo) | — |

## Layout, 05-04_01 (Hemmung für Federchronometer, 10:1, 24.4–24.47 px/mm)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| wheel to balance | 10,00 | 10.000 (H26–H23) | 0 | match | sure |
| locking stone | Ø0,75; scaled 7.17 from the wheel at 37.0° from the line of centres (pipe (305, 475), wheel (303.5, 650.5), balance (157.5, 453)) | 7.14 at 37.0°, half-round, flat on the wheel's radius | 0.03 | match | sure |
| impulse roller | Ø6,78 | 6.78 (SET.rRoll) | 0 | match (batch 3 checks the roller) | sure |
| block screw from balance | 25,68 | 25.77 (H13–H23) | +0.09 | conflict with the plate table; the table decides | sure |
| **block screw from wheel** | 23,8 (scaled 24.0) | **23.41** | −0.39 | **sheet conflict, not recorded**: hole 13 of 05 09 01 sits 0.4 nearer the wheel than the 1941 layout. With the stone fixed, the detent's line turns: the sheet draws the blade square to the wheel's radius through the stone (the wheel 0.06 along it), the model has the wheel 0.49 along it (blade 3.9° off square; 49.1° against the sheet's 53.5° to the line of centres). Record it in the README's Readings corrected or Unresolved | sure |
| stone to block screw | "188" (18,8), 7,6 | 18.69 along, 7.6 across (ACR 7.3+0.30) | −0.11 | recorded as fitted (escapement.js:42-46) | likely |
| gold spring head | head from the square's start (8.4 from the stone) to 10.8, screw 9.6 (scaled) | head 8.14–10.54, screw 9.34 | 0.26 nearer the stone | minor | likely |
| "Biegungspunkt der Gangfeder" | a label under the spring, no leader | TP at the spring's middle | — | modelling choice; the code's reading of the label as the middle is not on the sheet | likely |
| elevation (first drawn) | detent 1,3 under the plate, foot screw 2,3, arm 2,8 / 6,5, banking 1,4 over the arm's face | 1.3–3.3, 2.3, 3.7–6.5, 5.1 | 0 | match | sure |

## detent: 05 04 01-1 = .1436 Gangfeder (05-04_10-1, 10-2, 5:1, 17.4 px/mm)

Built 'last' (bracketed sizes), detent frame t (from the stone toward the foot) and n (toward the wheel).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| foot | 6,6 × 2 (1,9) × 0,65 (0,60) | 6.6 (t 15.34–21.94) × 1.9 × 0.60 | 0 | match | sure |
| foot pins | scaled 1.3 / 1.15 from its ends, 4.2 apart, Ø≈0.45, ≈3.3 overall | 1.25 / 1.15, 4.2, Ø0.45 × 3.2 | ≤0.05 | match | likely |
| foot screw | between the pins, 2.1 from each | at ROW, 2.1 from each | 0 | match | likely |
| **holes in the foot** | the screw's hole and the two pin holes through the foot (drawn) | the foot is a plain box (72 vertices); the screw and pins pass through solid steel | — | **missing** | sure |
| spring | 0,09 / 0,07 / 0,09, 5 long (scaled), 2 (1,9) wide | tapered 0.09–0.07–0.09, 5.0, 1.9 | 0 | match | sure |
| square | 2 tall, 2 (1,9) wide | 2.0 × 1.9 × 0.50 | 0 | match | sure |
| thicker blade | 0,55 (0,50), drawn 2.8 long | 0.50 × 2.9 | 0.1 | match | likely |
| blade | 0,33 (0,28) × 1 (0,9) | 0.28 × 0.9 | 0 | match | sure |
| **blade's place across** | left view (row scans): the thin blade's edges at 241/246 px, the thick part and square at 240/251, the spring at 245.5, the foot at 239.5/250.5. The blade, thick part and square are **flush on one side** ("linke Seite"); the blade's centre is **0.10 off** the square's, spring's and foot's centre plane ((0.50−0.28)/2 = 0.11 by the figures) | every piece centred on n = 0 (escapement.js:632-638) | 0.11 | **wrong** | sure (drawing); which side faces the block is likely (the horn bends to the same side, as the model's toward the block) |
| pipe | Ø1,15 × 2 (1,9), on the blade's line | Ø1.15 × 1.9, on the blade's line | 0 | match | likely |
| horn | 0,25 (0,22) × 0,8 (0,75); "4,4" to the pipe centre (5,4 (4,9) to the pipe's lower edge, so 4.33 bracketed); bent toward the block | 0.22 × 0.75, 4.4, traced bend | 0.07 | match (recorded) | likely |
| blade flush "oben" in the right view | the narrow blade on the edge the sheet calls "oben" (dial side, as 05-04_01's elevation draws it away from the plate) | flush with the edge away from the plate | — | match | likely |
| render | `r_det_0..9`, `s_det.png`, `s_det2.png` | a line across the spring at TP (the fixed and turning halves) and across the gold spring at its bending point (head and free piece separate); coincident internal faces where the blade and horn meet the pipe's wall, at the square / thick-blade end (0.95 and 0.45 mm²) and at thick / thin (0.45 and 0.25 mm²) (`internal.py`) | — | **artifact A3** (minor) | sure |

## Gold spring 05 04 01-2 (05-04_02, 5:1)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 0,15 | 0.15 | 0 | match | sure |
| arm | 1 wide, flush with one edge of the head | 1.0, flush | 0 | match | sure |
| **head width** | 2 | **1.9** (y 3.25–5.15) | −0.1 | **wrong** (minor: drawn to the square's 1.9) | sure |
| head length | 2,4 | 2.4 | 0 | match | sure |
| **hole** | Ø0,7 +0,05, 1,2 from the head's end, on its centre line | none: the head is a plain box; the screw WN-14 (shank Ø0.66) passes through solid metal; no tapped hole in the square | — | **missing** | sure |
| length | 15,4 | 15.25 (free part's centre line 11.41 + 3.84) | −0.15 | within reading (the tip is placed by the layout, the head by the square) | likely |
| material | Goldblech 333 federhart | gilt, E 98 GPa (333-333) | — | match | likely |
| slivers | — | 4 degenerate triangles (areas 5e-8 and 4e-7 mm², wound backward) at the tip (t −4.5) and at t 5.5–5.8 on the outer rail (`flip.py`) | — | nit (invisible) | sure |
| 1950s build | the gold spring thinned to 0.06 over 3 mm (BUILD, BUILD40) | not on the page | — | the build's departure, not the drawings' version; correctly kept out of the drawn geometry | sure |

## detentBlock 05 04 01-4 (05-04_03, 5:1, 17.2 px/mm), 'last'

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 25 | 25.0 (tU…tF) | 0 | match | sure |
| base | 14,6 long; 7.5 tall (25 − 17,5; drawn 7.36); row 3,75 from the foot | 14.6, 7.5, 3.75 | 0 | match | sure |
| base depth | 6,5 +0,05 over 6.4 from the end (bottom view), 3 beyond | 6.5 / 3, step at 6.4 | 0 | match (recorded) | sure |
| upright | 3 wide, 1,4 +0,1 from the end, 3 thick | 1.4–4.4, 3 thick | 0 | match | sure |
| slot | 0,3 × 7, about centred (drawn 1.53–1.82 in from the upright's edge) | 1.35–1.65, 7 deep | ≤0.15 | match | likely |
| M1,2 cross hole | 18,8 ±0,03 from the hole row (2.45 from the top) | screw at ROW−18.8 | 0 | match | sure |
| **M1,2 tapped hole** | drawn through the upright (dashed) | **no hole**: screw WN-gkA through solid brass (upCell has no feature) | — | **missing** | sure |
| holes | Ø0,9 at 2,3 / +2 and 12,3 / −2; M1,7 at 7,3 +0,04; Ø1,3 deep 3 at 2,8 | all at their places (H13 = D(ROW, nE−7.3)) | 0 | match | sure |
| **M1 in the end face** | side view: M1, 2,3 ±0,02 from the face, meeting the Ø1,3 | **no hole**: the end face at n = −0.30 has its full 48.75 mm² (7.5 × 6.5); the foot's screw WN-gf runs through solid brass | — | **missing** | sure |
| **the joint upright → base** | front view (`crops/b03_dims.png`, `cmp_blk_fillet.png`): the upright's edge runs down to **15** from the top, steps out about 0.2, then a **convex** quarter-round labelled "3 r" (drawn about r 1.9–2.0) to **0,4** above the base's top, then straight down 0.4 to the base at 17,5. The bottom view's rectangle for the upright and this shoulder ends at **6.4** from the end, flush with the thick part's end (`crops/b03_bottom.png`) | a **concave cove r 3** from the upright's edge 3 above the base's top to 7.4 from the end (escapement.js:715) | the shape is reversed; it reaches 1.0 further along the base | **wrong** | likely (the arc fits a convex centre to about 5 px and a concave one doesn't; "3 r" doesn't match the drawn 2) |
| 0,4 step, 90° +0,5° end | drawn | left out (recorded) | — | recorded departure | sure |
| side-view reading | the README Unresolved records the upright's face (first- against third-angle) | built third-angle | — | recorded | — |
| foot pins into the block | 05-04_01 draws the detent's pins entering the block about 1.15 | pins enter 1.6, no holes; 05-04_03 draws no holes for them | — | sheet conflict (minor); add the holes if the pins stay | likely |
| render | `r_blk_0..8`, `s_blk.png` | solidGeo, 0 shading faults, closed | — | clean apart from the above | sure |

## Detent block, other versions

| version | sheet / source | model | verdict |
|---|---|---|---|
| first (05-04_01 plan, `crops/l01_block.png`, 73.2 px/mm at 3×) | the block's far corner (the end away from the detent's foot, on the stone's side) **chamfered about 3.8 × 3.8 at 45°**; the Ø1.3 hole scaled 3.55 from the end; the arm 2.5 wide with a cove r ≈1.9 to the block | plate a plain rectangle (escapement.js:852); Ø1.3 at 2.8 (05 04 01-4, and Wempe 3955's 2.4-2.5); arm cove r 1.82 with a 0.78 ledge | **chamfer missing** (sure on the sheet; check 11_Wempe_3955 before adding it to the 3955 version); Ø1.3's place recorded |
| first: banking screw | 12° tail ("12°"), head on the wheel's side | cone 12°, gilt dome Ø3.3 | match (recorded) |
| 1943 | photographs (DEC 479, 422, Lange 5177) | upright with a concave fillet r 2, slit across, banking screw | estimates recorded; same missing M1 / M1.2 holes |
| 6mx | photographs (Kirov 247, the loose block) | as photographed | recorded; same missing M1 hole |

## Escape jewels and endstones (no sheet of their own; seats 05 09 01 P-Q and 05 08 02-1)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| top-plate seat 26 | Ø5,2 H7, step Ø4,5 H7 × 0,5 +0,03 | setting Ø5.2, spigot Ø4.5 × 0.5 | match (depth at the lower limit, within tol.) | sure |
| M1,2 beside 26 | 3,5 +0,05 | screws 3.50 from W | match (lower limit) | sure |
| pillar-plate 26 | Ø2,50 +0,009; M1,2 at 3,5 +0,05 | bush Ø2.5; screws 3.50 | match | sure |
| hole jewels | — (estimated from the coloured section) | holes Ø0.26 for the Ø0.24 pivots; upper stone 0.4, lower 0.45 | estimates recorded | — |
| endshake | — (1958 book 0.05-0.07) | 0.06 | recorded | — |
| render | `r_jw_0..5` | settings and endstones raw LatheGeometry: 480/576, 768/864 and 582/768 triangles with a vertex normal more than 20° off their face (`nrm.py`); flat faces and square edges look pillowed | **artifact A2** | sure |

---

## Ranked findings

1. **WRONG, the wheel's web 0.8 is the cancelled figure.** 05-04_07-1 strikes "0,8" and writes "0,7" (`crops/e71_08.png`), and 05-04_07-2 draws the recess line at mid-thickness (0.73 / 0.73, column scans).
   - Model: escapement.js:279 `ewWeb:-16.51` (0.8 web, 0.6 recess) and :290 `ewWeb:TI+1.1`; the recess cell at :568 `b:Q.ew0+0.6`.
   - Correction: `ewWeb: ew1−0.7` (−16.41; as first drawn TI+1.2), recess `b: Q.ew0+0.7`. The arbor's step and the collet's spigot follow ewWeb.
   - Renders: `cmp_ew_web.png`. Sure.
2. **WRONG, the escape arbor's dial-end shoulder: 0.4 straight against 07-2's concave r 3 over 1.63** (the ∅6 circle tangent at the pivot's root; `crops/e72_top.png`).
   - Model: escapement.js:582, `[0.6,Y.etL-0.9],[pv,Y.etL-0.5]`.
   - Correction: from (0.12, etL−0.5) along r(h) = 3.12 − √(9 − h²) to r 0.6 at h = 1.63, so the shoulder ends at etL−2.13.
   - Do the same at the top-plate end (r 0.12 → 0.5 over h 1.46: (0.12, etU+0.5) to (0.5, etU+1.96)), drawn there straight from :582 `[pv,Y.etU+0.5],[0.5,Y.etU+2.0]`, and in the first-drawn arbor :591.
   - Renders: `cmp_ew_dialpivot.png`, `r_ew_6.png`. Sure.
3. **WRONG, the crossings' phase.** 05-04_23 puts a crossing's middle 17.7° behind a tip, just behind the back's step (flanks fitted at r 2.5 and 4.5). The model has it 6° behind (escapement.js:568 `g0=tip0-6`).
   - Correction: `g0=tip0-17.7` (05-04_01's 1941 plan draws it about 1.7° ahead of the locked tip, so `tip0+1.7` if the layout is preferred).
   - Overlay `crops/ov_tooth_full.png`: the built teeth match 05-04_23 to a line width, but the openings don't line up until they are turned 11.7° (`crops/ov_cross2.png`). Sure.
4. **WRONG, the first-drawn collet's cone top: Ø2.2 against 07-1's drawn Ø2.67–2.73.** The cone is Ø3.0 → 2.7 over 1.8, then steps in to the Ø1.8 pipe.
   - Model: escapement.js:599 `[1.1,Y1.ew1+1.8]`.
   - Correction: `[1.35,Y1.ew1+1.8],[0.9,Y1.ew1+1.8]`. Applies to 'first' and '1943'.
   - Render: `cmp_ew1_collet.png`. Sure.
5. **WRONG, the detent's blade is centred on the square.** 1436's left view draws the blade, the thick part and the square flush on one side ("linke Seite"), with the spring and foot centred on the square. The blade's line (and the pipe and stone on it) sits 0.10 off their centre plane (row scans; (0.50−0.28)/2 = 0.11 by the figures).
   - Model: escapement.js:632-638, every piece centred on n = 0.
   - Correction: keep the blade, pipe and horn on n = 0, and move the square, the thick blade, the spring and the foot by +0.11 along n (the side away from the block, as the horn bends toward the block, likely). The foot's block-side face then lies 0.19 from the stone's line: ACR = 7.3 + 0.19 = 7.49 (escapement.js:47), which puts the stone 18.73 along the screw's row against the sheet's 18.8. The gold spring's head moves 0.11 toward the wheel with the square's face.
   - Render: `cmp_det_blade.png`. Sure for the drawing; likely for which side.
6. **WRONG (likely), the block's upright-to-base joint.**
   - Sheet: a convex quarter-round (drawn r ≈ 2, labelled "3 r"), from a 0.2 step 15 below the top to 0.4 above the base, then 0.4 straight down to the base at 17.5. Its footprint ends 6.4 from the end, flush with the thick part (bottom view).
   - Model: a concave cove r 3 out to 7.4 (escapement.js:715).
   - Correction from the sheet:
     - the upright's edge runs to 15 from the top (tU+15 = tT−2.5);
     - it steps out 0.2, to n = nUr−0.2;
     - a convex arc of about r 2 follows, its centre near (tT−0.4, nE−4.6), flat where it leaves the step and running straight down at n = nE−6.4, where it ends at tT−0.4;
     - then a straight line runs 0.4 to the base's top at tT.
   - Record "3 r" against the drawn 2 in the README.
   - Render: `cmp_blk_fillet.png`, `r_blk_6.png`.
7. **MISSING, the block's threaded holes.**
   - The end face's M1 (2.3 ±0.02 from the face, meeting the Ø1.3): the face is solid, 48.75 mm². The foot's screw WN-gf (escapement.js:680) runs through brass.
   - The upright's M1.2 cross hole (escapement.js:729: WN-gkA through solid brass).
   - Correction: tapped holes as the kit cuts them (th: rs 0.5 and 0.6); then matchThreads. Same in the 1943 and 6mx blocks (the 1943 upright already carries an r 0.62 hole for its screw). Sure.
8. **MISSING, the gold spring's hole Ø0.7 +0.05**, 1.2 from the head's end on its centre line, and the square's tapped hole for WN-14. The head is a plain box (escapement.js:666-667) and the screw passes through solid metal. Sure.
9. **MISSING, the detent foot's holes.** The screw's clearance hole and the two pin holes; the foot is a 72-vertex box (escapement.js:630). Sure.
10. **WRONG (minor), the gold spring's head is 1.9 wide against 2.** escapement.js:667, `y0F..gy1` (1.9). Correction: 2.0, centred on the screw (yd(d0+1) ± 1.0). Sure.
11. **MISSING (minor), the riveted lip of the collet's spigot** in the recess (07-2: about Ø2.25 × 0.15-0.2 under the web), and as first drawn **the pinion's concave neck** (07-1's 3 → 4.2). Likely.
12. **MISSING (first drawn), the block's chamfered corner** on 05-04_01: about 3.8 × 3.8 at 45° at the far end on the stone's side (`cmp_blk1_chamfer.png`). Check Wempe 3955's 11_ photograph before giving the 3955 version the same. Sure on the sheet.
13. **Not recorded, the sheet conflict at hole 13.** The layout's "23,8 v. Gangradmitte" (scaled 24.0) against the plate table's 23.41 turns the detent 3.9° off square to the wheel's radius through the stone (the sheet draws it square). Add it to the README beside the 18.8 fit. Sure.
14. **ARTIFACT A2, raw THREE.LatheGeometry** (escapement.js:24's `lathe` returns `new THREE.LatheGeometry`). Every turned part here shades its square edges round, and flat ends look domed:
    - the escape arbor: 192/384 triangles with a vertex normal more than 20° off their face;
    - the collet: 563/800 (`r_ew_5.png`, its spigot end looks like a dome);
    - all escape jewel settings and endstones (`r_jw_*`);
    - the screws WN-gf, WN-14 and WN-gkA, and the pins WN-205.d.
    
    The fix is the one batch 2 asked for: one lathe helper with corner vertices split, or KIT's turned solid.
15. **ARTIFACT A3, minor.** Coincident internal faces where the detent's fused pieces meet: the blade and horn on the pipe's wall, square / thick blade 0.95 against 0.45 mm², thick / thin 0.45 against 0.25 mm². Also visible lines at TP and at the gold spring's bending point (the moving halves).
16. **Nits.**
    - 4 degenerate, backward-wound sliver triangles in the gold spring's free part (tip and t 5.5-5.8).
    - 05-04_07-2 draws the dial side of the pinion's arbor Ø1.30 (model 1.2).
    - The gold spring's head sits 0.26 nearer the stone than 05-04_01 scales it.
    - escapement.js:557's comment says 07-1's recess is on the pinion's side; it is on the top-plate side, as built.

Verified correct: tooth count and form (overlay), tip, floor, step, rim, crossing arcs and width, pinion (z 10, m 0.263, tips and roots), the arbor's 22.8 / 19 / 5.3 / 2 / pivots, the collet 4.7, the wheel's heights both states, the stone's place (7.14, 37°), the detent's lengths and bracketed sections, the spring's taper, the pipe, the horn's 4.4, the block's every dimension and hole place, the jewel seats and screws. Closed solids everywhere (0 open edges).

## Sheets reviewed

- 05-04/Wempe_05-04_01.jpg — (no number, Kaliber 020…) Hemmung für Federchronometer — centre distance, stone Ø0,75 and its place (37°, 7.17), block screw 25,68 / 23,8 / 18,8 / 7,6, the wheel's crossings' phase to the locked tooth, the first-drawn block's plan (chamfered corner, holes, arm and cove), the gold spring's head and screw place, bending-point labels, the elevation's heights (0,5, 1,4, 1,3, 2,3, 2,8, 6,5)
- 05-04/Wempe_05-04_02.jpg — 05 04 01-2 Goldfeder — 0,15, 1, 2, 2,4, Ø0,7 +0,05 at 1,2, 15,4, material; against the built head (1.9, no hole) and the measured length
- 05-04/Wempe_05-04_03.jpg — 05 04 01-4 Gangfederkloben — every figure in the front, side and bottom views (25, 17,5, 15, 0,4, 3 r, 14,6, 3,75, 2,3, 2,8, 7,3, 12,3, 0,9, 1,3 tief 3, M1,7, M1,2, 18,8, 7, 0,3, 1,4, 3, 6,5, M1 2,3, 90° +0,5°), the joint's convex arc; against the built block's faces and holes
- 05-04/Wempe_05-04_07-1.jpg — 050408 bis 10 Gangrad — 23, 17,7, 15,2, 13,8, 5,3, 4,2, 3, 1,2, the wheel 1,4 with 0,8 struck and 0,7, recess 11,9 → 12,4 and its side, the collet 1,8 / 3,0 / 5 (cone top measured 2.7), the pivots and the ∅6 shoulder, the neck
- 05-04/Wempe_05-04_07-2.jpg — 050408 bis 10 / 05 04 05-1 Gangrad — 22,8 −0,02, 19, 5,3, 0,5, 2, 4,7, 1,8 H7/h6 against the 1,7 fit table, the wheel's thickness and recess line, the collet's steps and riveted spigot, the r 3 shoulders, arbor diameters by row scans
- 05-04/Wempe_05-04_08.jpg — Hz 05 04 05-2 Gangtrieb — z 10, m 0,263, D 2,97, d 2,633, dg 1,6, the blank 3,13 / 1,6 / 5 / 26,5; against the built pinion
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg — .1436 Gangfeder sheet 1 — every written pair (0,25 (0,22), 0,33 (0,28), 0,55 (0,50), 0,65 (0,60), 0,8 (0,75), 2 (1,9), 1 (0,9), 5,4 (4,9), 4,4, 1,15, 0,09 / 0,07 / 0,09, 6,6, 2), lengths scaled, the blade's flush side by row scans, the foot's pins and screw hole
- 05-04/Wempe_05-04_10-2_Wempe_Griessbach.jpg — .1436 Gangfeder sheet 2 — the names (linke / rechte Seite, oben / unten, Viereck, Federung, Fuß, Spitze, Röhrchen) used to orient the views
- 05-04/Wempe_05-04_23.jpg — 02 04 08 a Gangrad Zahnform — tip 14 +0,03, 12,1, 11,7, 10,9, 0,1834 / 1½°, 15°, 50°, 25°, 1, 7,9 r, 6,0606, ∅6; rim circles fitted, face line fitted (25.4°), the built tooth and openings overlaid, the crossing's phase measured
- 05-04/Wempe_05-04_20.jpg — So 127-556.04 Hemmung für Ankerchronometer — opened: the lever escapement (pallets, lever, club-tooth wheel, 8,50 / 13,50 / 22,0); nothing applies to the spring-detent model
- 05-04/Wempe_05-04_21.jpg — 127-556.04 U10 Anker kompl. — opened: the lever and its pallets; nothing applies
- Wempe_Einheitschronometer.jpg — coloured section — the escapement column (Gangrad, Gangradbutzen, Gangfeder, Goldfeder, Gangfederkloben, banking screw WN-16, the escape jewels and endstones) for heights and the jewels' form the code takes from it; schematic, nothing contradicting the findings

## Sheets not reviewed

- 05-08/Wempe_05-08_01a.jpg, 05-08/Wempe_05-08_01b.jpg (05 09 01 Oberplatte, Schnitt P-Q at hole 26, hole 13) and 05-08/Wempe_05-08_03a.jpg, 05-08/Wempe_05-08_03b.jpg (05 08 02-1 Unterplatte, hole 26 and its M1,2) — batch 1's sheets. I checked the seats and screw places through the transcription's figures (5,2 H7, 4,5 H7 × 0,5 +0,03, 2,50 +0,009, 3,5 +0,05, hole 13 bored 1,8) and WD.H, not on the images.
- 05-04/Wempe_05-04_04.jpg, 05-04/Wempe_05-04_05.jpg, 05-04/Wempe_05-04_06.jpg — the balance staff and the impulse roller: batch 3's.
- Index.md / Missing_details.md — text lists; they name no further sheets for these parts. No sheet of the escape jewels' settings or stones exists in the set.
