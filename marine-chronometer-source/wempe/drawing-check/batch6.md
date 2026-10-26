# Batch 6: the maintaining work, the maintaining detent and the stop work, against their sheets (26 October 2026)

I worked read-only in the worktree `claude/wempe-artifacts` at 161c7da7 and edited nothing in the repository.

## How I measured

**The model's solids.** I took the built solids from the page (`?snap&qa`, GPU) in every version: last, first, 3955, 6mx and 1943 (`b6/dump.py`, which writes `b6/dump.json`). For each mesh I measured:
- whether it is closed (0 open edges on every mesh);
- its levels, as face areas by height and facing;
- its sloped faces;
- how far each vertex normal departs from its face, which shows shading faults (`b6/an.py`);
- slices through the solid (`b6/slice.py`);
- the folds in each ribbon's path.

**The sheets.** I measured them in pixels: row and column scans, circle fits, and the model's own outlines (re-run in Python from fusee.js) laid over the sheet (`b6/ovclick.py`, `b6/ovdet.py`, `b6/g10ray.py`).

**Scales used:**

| Sheet | Scale | How fixed |
|---|---|---|
| 05-06_14 | 33.83 px/mm | 10,05 |
| 05-05_12 | 17.39 px/mm | 14,2 |
| 05-06_10 | 17.13 px/mm | ring fitted |
| 05-06_12 | 6.93 px/mm | 37,25 |
| 05-06_11 | 12.1 px/mm | as transcribed |
| 05-06_04 C-D | 12.36 px/mm | hub Ø 21 fitted (rms 0.56 px); 22,5 gives 12.40 |

**The renders.** I used isolate.py's FREEZE and KEEP (`b6/render.py`, and `b6/render2.py`, which aims at a mesh by its hn). Contact sheets are `b6/s_*.png`.

The maintaining work turns with the fusee wheel and the freeze turns the wheel, so the parts were measured in their own frames: polar about the fusee axis (−16.708, −15.292), and the detent about hole 4.

All files named below are under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b6\`.

---

## maintaining: the ratchet 05 06 02-1 (05-06_12, 2:1, revised 11.3.48) in its assembly 05 06 02 (05-06_11)

| feature | sheet | model (how) | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | Z = 120, Zahntiefe 0,7 +0,05 | 120; tips r 18.600, roots r 17.875 (top-face polar) | depth 0.725 | match | sure |
| tip Ø | 37,25 −0,1 (rev. a; was 37,5) | 37.20 | within | within tol. | sure |
| bore | 6,5 H7 +0,015 | 6.5075 | 0 | match | sure |
| plate at the teeth | 1,02 −0,02 | 1.020 (GT…G) | 0 | match | sure |
| floor inside the cup | 1,3 −0,1 (drawn 1.23 against 0.87 outside, column scans) | 1.300 | 0 | match (recorded reading) | sure |
| overall | 3,1 −0,2 | 3.100 (GC…G) | 0 | match | sure |
| "2,1" | rim over the plate outside the cup (drawn 2.24) | 2.08 | 0 | match (recorded) | likely |
| cup outside Ø | 26,1 −0,2 | 26.00 | within | within tol. | sure |
| cup inside Ø | 24,45 +0,1 | 24.45 | 0 | match | sure |
| chamfer | (a) 0,3 +0,15 × 45°, on the cup's outer top edge | 0.3 × 45° on that edge | 0 | match | sure |
| click screws' holes | M1,7, 19,5 +0,05 apart, at 9 and 3 o'clock | Ø 1.74 plain holes, 19.525 apart | — | place matches; **thread missing** | sure |
| maintaining-spring pin hole | 1,2 H8 at r 14,2, 6 o'clock | Ø 1.207 at r 14.2 | 0 | match | sure |
| **click-spring pin holes** | Ø 0,6 through the cup's wall at 42° and 60° over 9 o'clock (and the pair below 3) | **none**: the cup is a plain LatheGeometry ring (fusee.js:529); the four pins (050602-4, fusee.js:565) run through solid brass | — | **missing** | sure |
| "5°" mark at 12 o'clock | a short radial line marked 5° | not built | — | meaning unknown; leave it | — |
| **internal faces** | — | `fuse()` only merges geometry (core.js:543). The plate's underside at GT (1007.9 mm², facing the cup) and the cup and floor solids' tops at GT (492.8 mm², facing the plate) coincide inside one mesh | — | **artifact** | sure |
| **shading** | — | 1,600 of 5,588 triangles with a vertex normal more than 20° off their face, all on the cup ring (r 12.22–13.0): the raw LatheGeometry `ringT` (fusee.js:103, 529). The square rim, the wall and the chamfer shade round (`r_mwc_5.png`, `r_mwc_2.png`) | — | **artifact A2** | sure |
| first-drawn state | 05-06_12 before revision a: tips **37,5**, no 0,3 chamfer, a "25,4" dimension struck, "D = 37,25 −0,2" struck | the revised ratchet in every version | — | **missing for 'first'** (neither built nor on the cards, README "On the cards only") | sure |

## maintaining: the clicks 05 06 02-3 (05-06_14, 10:1)

Overlay: `crops/ov_click.png` (red = the model's CKL outline).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 1,82 −0,04 | 1.82 | 0 | match (upper limit; the click stands 0.02 past the cup's rim, because the recess is 1.8) | sure |
| overall | 10,05 −0,1 (extension lines 340 px; the pivot 5.09 / 4.97 from the ends) | 9.97 (nose foot −5.00, tail tip 4.97) | −0.08 | within tol. | sure |
| pivot to nose | 5,2 −0,1 | 5.23 to the nose's foot | 0 | match | sure |
| nose | 2 high, face at 85° leaning back | 2, 85° | 0 | match (overlay on the line) | sure |
| back | r 8 from the nose's tip to the boss | r 8 | 0 | match (overlay) | sure |
| hollow | r 3 about (−2,78 −0,001 ; −3,54 −0,01) from the pivot | r 3 there | 0 | match the figures. The drawn line lies up to 0.2 lower mid-hollow (drawing imprecision; the figures decide) | sure |
| base line | tangent to the Ø 3 circle (drawn 1.54 under the pivot) | 1.52 | 0.02 | match | sure |
| boss | thin Ø 3 circle (r 1.5, 51.7 px) tangent to the base line and the top edge; the thick Ø 2.24 circle is the 2,2 opening | r 1.5 arc | 0 | match | sure |
| **top edge to the tail** | one straight line **tangent to the Ø 3 boss**, slope −0.585 (30.3°; scans at x 1.42 / 2.90 / 4.08 give y 0.95 / 0.10 / −0.60), meeting the base line through a **rounded tip** (r ≈ 0.2) at x ≈ 5.03 | leaves the boss at 53°, **kinks at (1.4, 1.0)**, then runs straight at 35.2° to a **sharp** tip at (4.97, −1.52) (fusee.js:542) | up to 0.30 thin at x 4 | **wrong (form)** | sure |
| hole | 1,2 H7; sunk 45° to 1,7 on one face; opened to 2,2 on the other (cone at about 51° off the axis, "3∅") | 1.209; 1.7 × 0.25 on the floor side; 2.2 cone 0.42 deep on the free face | 0 | match (which face: recorded projection reading) | likely |
| render | — | crisp solidGeo, normals fine (`r_mwd_0..2`) | — | clean | sure |

## maintaining: the click screws WN-21 (no sheet; 05-06_11's section, 12.1 px/mm)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| head side | on the plate's outer face, toward the wheel | so | — | match | sure |
| head Ø | drawn 31 px = 2.56 | 2.6 | 0 | match | likely |
| **head height** | drawn 10–12 px = **0.83–0.95** | **0.5** (estimated, fusee.js:552, 554) | 0.35–0.45 | **wrong (scaled)**. With 0.9 it still clears the web by 0.55 | likely |
| **shank end** | domed, ending about 0.25 inside the cup's rim | flat, 0.12 **past** the rim (GP−1.92) | 0.37 | **wrong (minor)** | likely |
| thread | M1,7 into the ratchet's tapped hole | plain cylinder r 0.85 in a plain Ø 1.74 hole | — | **missing** (the 3.35.00 thread pass missed these) | sure |
| **slot** | a cut slot | a dark BoxGeometry 2.4 × 0.25 × 0.3 **standing 0.02 proud** of the head, inside its volume (fusee.js:555) | — | **artifact** (a bar drawn on the head, not a slot) | sure |
| render | — | raw LatheGeometry: 200 of 240 triangles mis-shaded, the flat head looks domed; 20-sided head (`r_mwd_3.png`) | — | **artifact A2** | sure |

## maintaining: the click springs 05 06 02-2 (05-06_13, 5:1) and their pins 05 06 02-4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| strip | Bronzeband 0,4 −0,01 × 1,5 −0,1 | 0.4 × 1.5 | 0 | match | sure |
| hole | Ø 0,6 +0,02, 5 from the end, 0,8 −0,05 from the edge | the pin at mid-height (0.75 from the edge); **no hole in the strip** | — | **missing** (the pin passes through solid bronze) | sure |
| arcs | r 12,0 (end), r 10,4 (long arc), its chord 13,6; tip 110° from the hole | r 12.0, r 10.4, tip 110° | 0 | match | sure |
| hole to the bend | 5 | 5 | 0 | match | sure |
| S-bend | round two Ø 2,2 mandrels ("105°") | a cosine ramp over 8.5°, no mandrel radii | — | differs (form approximate) | likely |
| **developed length** | **gestreckt 27,0** (±0,1 untoleranced) | **26.67** (centreline of the built ribbon) | −0.33 | **wrong (minor)**: out of the ±0.1; most likely the S, which a real bend round two r 1.1 mandrels makes longer | sure (number), likely (cause) |
| pins | Ø 0,6 at 42° and 60°, through the wall | Ø 0.6 × 1.6, radial, r 11.8 → **13.4**: standing **0.4 out of the cup's outer face** (r 13.0), 0.017 clear of the fusee body's mouth cone at that height | — | minor (05-06_04 A-B and 05-06_11 draw the ends about flush with the wall) | likely |
| render | — | `ribbonGeo` (fusee.js:128–137) shares its 4 corner vertices per section and calls computeVertexNormals: 209 of 372 triangles mis-shaded (max 84°). The square strip shades like a tube (`r_mwc_4`, `r_mwd_6`). Pins 12-sided | — | **artifact A2-type** | sure |

## maintaining: the maintaining spring 05 06 01-1 (05-06_10, 5:1), as first drawn 020605 / U18 (05-06_09), its pins 05 06 00-8

05-06_09 (127-556.04-U18 = 020605, 15.4.41) is the older number of the same assembly. Its parts list has 70 (127-556.04-067, the ring) and 71 (-068, the pins).
- It applies to the 'first' version (and to 3955, which shares it in the model).
- Its widths round the ring are the model's `w41`.
- Its other figures:
  - the pins Ø 1,25, standing 1,2 out of opposite faces (2,5 over all);
  - the ring 1,3 thick (pre-turned 1,4 +0,04), Ø 32,3 (pre-turned 32,45 +0,02);
  - 14,2 and 65° to the pin, 15,25 between the holes;
  - a chain 4,5 / 1,7 / 6,2 from the square end to the eye's hole;
  - an eye hole offset written "1,5";
  - illegible handwritten notes (x = 0,27 mm).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside Ø | 32,3 −0,1 | 32.25 | within | within tol. | sure |
| thickness | 1,35 −0,1 (05-06_10); 1,3 (020605) | 1.30 | within | within tol. | sure |
| band | 2 for most of the turn | 2 | 0 | match | sure |
| holes | 1,2 H7, the eye's on the 0° line, the other at r 14,2, 65° | Ø 1.2; eye on the line (EYO 0, recorded); 295° | 0 | match | sure |
| "15,25" | the chord between the two holes (drawn 264 px = 15.4) | 15.26 | 0 | match (the transcription calls it "hole to the square end"; it is hole to hole) | sure |
| eye | r 1,8 (05-06_10); 1,7 (020605's "1,7") | r 1.8 in both versions | 0.1 ('first') | minor for 'first' | likely |
| square end | 4 wide (drawn 3.75), radial at 335.5° (fitted both corners); "6" to the eye's centre (drawn 5.84); 020605: 6,2 | 4 at 336°; 6 | 0 / 0.2 ('first') | match ('last'); minor ('first') | sure |
| **the swell** | the inner edge is **an r 6 arc about a construction point on the 9 o'clock line** (the "6" leader from that small circle, measured 5.94 and 5.97 to the edge), tangent to the band's inner edge at 270° (centre 8.15 from the axis) and running in to **a corner at 292.6°, width 3.57**; beyond it a smooth arc widening to the end's 4 (3.57 / 3.60 / 3.74 / 3.80 at 300 / 305 / 320 / 330°) | `w48` (fusee.js:588): a width table at 4° steps that is that r 6 arc sampled (276: 2.12 against the arc's 2.11, 280: 2.29 against 2.29, 287: 2.85 against 2.85, 292: 3.44 against 3.43), joined by straight lines. Then contoured by `sdfOutline` at a 0.05 grid (fusee.js:611) | ≤ 0.08 | **artifact (kinks)**: visible corners along the swell (`r_ms_6.png`, `r_ms_7.png`, `s_ms.png` panel 2) | sure |
| **the square end's face** | a straight radial cut | **stair-stepped / serrated**: `sdfOutline`'s 0.05 grid steps along the end face, plainly visible (`r_ms_2.png`, `r_ms_3.png`, `r_ms_4.png`) | — | **artifact** | sure |
| **eye to band** | the band's outer edge runs on under the eye into its circle | the band is cut radially at u = 0 through the eye's centre. The eye's circle reaches only r 16.0 against the band's 16.125, leaving **a 0.13 radial step (nick)** on the outer edge (`r_ms_2.png`, lower edge) | — | **artifact (nick)** | sure |
| pins | Ø 1,25 (020605) in 1,2 H7 holes; 1,2 out each face | Ø 1.2 (recorded), 1.2 and 1.18 out | 0 | match (recorded) | sure |
| temper zones | 400° over the ends | colour only | — | n/a | — |
| shading | — | solidGeo, normals fine | — | clean apart from the above | sure |

## maintDetent: the click 05 05 05-1 (05-05_12, 5:1, 19.7.44) on its arbor (assembly 05 05 05, 05-05_11, 2.4.41)

Overlay: `crops/ov_det.png`.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| overall | 14,2 | 14.24 | 0.04 | match (tol. ±0,1) | sure |
| boss | Ø 5 | r 2.5 | 0 | match | sure |
| hole | 2,25 H7, Kegel 1:70 | Ø 2.25 straight | taper 0.03 over 2 | match | sure |
| back | r 18 | r 18 (overlay on the line; the model runs up to 0.2 over the drawn line at the tip's upper corner, because it takes the figure 2,6 where the line scales 2.35, recorded) | — | match (recorded) | sure |
| hollow | r 9 about (6,273 ; −9,645) | so; tangent to the boss (11.505 against 11.5) | 0 | match | sure |
| tip | lower corner on r 12 ±0,1, 2,6 over the boss's tangent, 80° | so | 0 | match (recorded) | sure |
| step | dashed, from 8,6 at the back obliquely to the hollow | 8.6 → 5.6 (green on the overlay) | ≤ 2 px | match | sure |
| thickness, tip | 2; tip 1 −0,03. Assembly 05-05_11: the thin part at the **upper** face (the 6,3 face; section A-B draws it flipped) | 2; tip 1.0 at the upper face | 0 | match | sure |
| place on the arbor | 6,3 ±0,1 upper face to the lower shoulder | 6.2 | −0.1 | within tol. (recorded) | sure |
| "150°" | an angle drawn from a point on the vertical centre line below the boss | — | — | what it spans is not settled; the outline the other figures fix matches the drawn lines | unsure |
| render | — | one mesh (thick and thin merged), normals fine; no seam | — | clean | sure |

## maintDetent: the arbor 05 05 05-2 (no sheet; 05-05_11 at 16.7 px/mm), the wire spring 05 05 06-1 and its stud (no sheet)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| body | Ø ≈ 2.3 scaled, ≈ 19.5 between the shoulders | Ø 2.25, 18.95 | — | estimated (recorded) | — |
| pivots | Ø ≈ 0.9 × 3.1 scaled | Ø 0.88 × 3.1 | — | estimated (recorded) | — |
| **shoulders and ends** | 05-05_11 draws **chamfered shoulders** (body to pivot) and rounded pivot ends | square shoulders, flat ends (fusee.js:650) | — | **missing (minor)** | likely |
| render | — | raw LatheGeometry: 162 of 240 triangles mis-shaded; flat ends look domed (`r_md_1.png`, `r_md_5.png`) | — | **artifact A2** | sure |
| wire stud | M1,7 at hole 5 (05 08_1a: N 38,507 O 10,684, Körner 1,3) | KIT thread, head Ø 3.0 × 1.9, slot 0.45 × 0.7 (estimates, photographs) | — | recorded; renders clean (`r_md_6`, `r_md_7`) | — |
| wire | coloured section #24 (Feder 05 05 06-1): ends 1.8 over the pillar plate, "Drahtfedermitte" beside the arbor on 05-06_04 A-B | Ø 0.25, end at 1.8 | — | recorded estimates | — |

## stopWork: the stop bar 05 06 03-1, its pin 05 06 03-2, its spring 05 06 03-3, the spring's pin 05 06 04-4 (05-06_04 Schnitt C-D, 5:1); the stop pin 05 08 01-5

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bar length | 22,5 | 22.50 (u −11.52 … 10.98) | 0 | match | sure |
| stop pin's circle | R 14 ("Anschlagstift in Oberplatte") | 14.00 (holes 7 and 10) | 0 | match | sure |
| bar across | 02-2: the slot 2 H8, its near edge 4 from the axis. C-D **draws** the bar at 3.70–5.57 | 4.01–5.99 (1.98, g6 estimated) | — | follows 02-2's figure (recorded) | sure |
| **"2" at the upper end** | radial, from R 14 to the bar's upper end: **the end on r 12** (drawn far corner r 12.24) | far corner at **r 12.51** | +0.51 | **conflict, not recorded** | likely |
| **"12" at the lower end** | R 12 to the bar's lower point (drawn r 12.31) | point's extreme **r 12.36** | +0.36 | **conflict, not recorded** | likely |
| **"3,2"** | its two extension lines run to the bar's lower point running (solid) and wound (the dashed rounded end): **the travel**, written 3,2 and drawn 3.58 (44.3 px) | travel **3.6** (SB.tr, the drawn one) | +0.4 | **wrong against the figure**, not recorded (fusee.js:317, 319) | likely |
| "3,3", "17,6" (or 1,76), "1,2" (A-B) | figures at the pin, at the lower end's arc, and at the cup's wall | — | — | not explained in the code or README; unsettled | unsure |
| "1,5" | the spring's pin 1,5 from the line through the axis | 1.5 | 0 | match | sure |
| lower end | oblique, the far side drawn 1.07 shorter (13.3 px), the point rounded | 0.94, r 0.39 | 0.13 | within reading | likely |
| thickness | 1.45, thinned to 1.05 toward the upper end (coloured section) | so | — | recorded | — |
| **bar's pin hole** | dashed hole across the bar (C-D) | no hole: the bar is a 116-triangle extrusion | — | missing (**recorded** in checks.py EXPECTED: "a solid of plan cells can't cut across") | sure |
| **spring's hole for 05 06 04-4** | the pin passes through the spring (the README speaks of "its pin's Ø 0.5 hole through it") | not cut: the pin runs through the ribbon (`r_swp_4.png`) | — | **missing** | sure |
| **the spring's end at the bar's pin** | the strip's end bearing on the pin | its path's first two segments (0.19 and 0.10 long) turn **124.6°**: the ribbon folds back on itself. There are reversed triangles (a 0.003 mm² face pointing down at the top level) and normals up to 174° off their face (`r_swp_0.png`, the crumpled end) | — | **artifact (fold)** | sure |
| spring shading | — | ribbonGeo's shared corner normals: 421 of 820 triangles mis-shaded; the strip shades like a tube (`s_sw.png` panels 3–4) | — | **artifact A2-type** | sure |
| spring length | — | 31.36 (drawn 32.1 / 30.8, recorded) | — | recorded | — |
| stop pin | Ø 1,6 +0,009 at hole 7; length 1.85 off the coloured section | Ø 1.6, 1.6 + 0.25 dome | 0 | match / recorded | sure |
| stop pin render | — | raw lathe (`turned`): 60 of 360 triangles mis-shaded; flat end domed | — | artifact A2 (minor) | sure |

## Versions

- **maintaining**: every mesh is identical in last, 6mx and 1943. 'first' and 3955 change only the maintaining spring (020605's widths).
  - Not drawn: the ratchet as first drawn (37,5 tips, no chamfer).
  - Not drawn: 020605's eye 1,7 and 6,2.
- **maintDetent**: identical in every version. 3955's stud is brass, same geometry. The 1941 assembly 05-05_11 and the 1944 click sheet agree in outline, the step and the 6,3.
- **stopWork**: identical in every version, as is the stop pin.

---

## Ranked findings

1. **ARTIFACT, the maintaining spring's square end is stair-stepped, and the eye meets the band with a 0.13 nick.**
   - Model: `sdfOutline((x,z)=>f(x,-z),…,0.05)` (fusee.js:611) turns the band, built as a minimum of distance fields (fusee.js:608–610), into a 0.05-grid contour.
   - The radial end face comes out serrated (`r_ms_2.png`, `r_ms_3.png`, `r_ms_4.png`).
   - The band is cut radially at u = 0 through the eye's centre while the eye's r 1.8 reaches only r 16.0, so the outer edge has a 0.13 step (`r_ms_2.png`, lower edge).
   - Correction: build the outline exactly, as lines and arcs:
     - the outer circle r 16.125 from the eye to a straight radial end at 336°, 4 wide;
     - the inner circle r 14.125 from the eye to 270°;
     - the swell (item 2);
     - the eye r 1.8 about the hole on the 0° line, the band's outer edge continuing under it to its tangent point, so there is no step.
   - The `bend()` displacement can still act on these points. Sure.
2. **ARTIFACT, the swell's kinks.**
   - Sheet: 05-06_10 constructs the swell as an r 6 arc about a point on the 9 o'clock line, 8.15 from the axis (the "6" leader), tangent to the inner edge at 270°, running to a corner at 292.6° (width 3.57). From there a smooth arc runs to 4 at the end (3.60 at 305°, 3.74 at 320°, 3.80 at 330°).
   - Model: `w48` (fusee.js:588) samples that arc at 4° steps and joins the samples straight, so the edge has visible corners (`r_ms_6.png`, `r_ms_7.png`).
   - Correction: the r 6 arc itself, centre (8.15 from the axis on the 270° line), from 270° to 292.6°, then an arc through widths 3.6 (305°) and 3.8 (330°) to 4 (336°).
   - For 'first' (020605) the widths are given at points (`w41`); join them with a smooth curve, not straight segments. Sure.
3. **ARTIFACT, the stop spring's end folds back on itself.**
   - Model: `spPath` starts at SPE0 (fusee.js:720) and goes straight into `toBar(SPU)`'s first point. The first two segments (0.19 and 0.10) turn 124.6°.
   - Result: the 0.10 ribbon crumples at the bar's pin, with reversed triangles and normals 174° off (`r_swp_0.png`).
   - Correction: drop SPU's first point or the SPE0 lead-in, so the strip leaves the pin tangent to its traced line. Sure.
4. **WRONG (form), the click's top edge to its tail** (05-06_14, `crops/ov_click.png`).
   - Sheet: one straight line tangent to the Ø 3 boss, y = 1.738 − 0.585 x in the click's frame (pivot at 0, base line at −1.52, nose toward −x). It leaves the boss at (0.76, 1.30) and meets the base line through a round of about r 0.2, ending at x ≈ 5.0 (the "5,2" from the pivot).
   - Model: fusee.js:542 leaves the boss at 53°, adds a point (1.4, 1.0) and runs at 35.2° to a sharp tip (4.97, −1.52). It is 0.30 thin at x 4 and has a kink.
   - Correction: replace `arc([0,0],1.5,…,atan2(1.2,0.9),6);o.push([1.4,1.0])` with the boss arc to 59.7°, the tangent line, and an r 0.2 round into the base line (the first point `[√(5.2²−1.52²),CKB]` becomes the round's base-line end, at about x 4.83).
   - CKBK (the spring's bearing, `CKL.slice(17,31)`) indexes the back's points; keep it pointing at the r 8 arc. Sure.
5. **MISSING, the click springs' pin holes Ø 0,6 through the ratchet's cup wall** (05-06_12: at 42° and 60° over 9 o'clock, and the pair under 3) **and through the springs** (05-06_13: Ø 0,6 +0,02, 5 from the end, 0,8 −0,05 from the edge).
   - Model: `ringT` (fusee.js:529) is a plain lathe ring, and `sprGeo` a plain ribbon. The four pins (fusee.js:565) pass through solid brass and bronze.
   - Shorten the pins to the wall's outer face (r 13.0; now 13.4, 0.4 proud, 0.017 off the fusee body's mouth). Sure.
6. **WRONG against the figure, the stop bar's travel "3,2" (05-06_04 C-D) and its ends on r 12** ("2" from the pin's R 14; "12" at the lower point).
   - Model: travel 3.6 (SB.tr, the drawn distance, fusee.js:317–319), the upper far corner at r 12.51, the lower point at r 12.36.
   - The figures 22,5, R 12 at both ends and 02-2's "4" can't all hold for a straight bar (22.5 needs about 0.9 more than two r 12 ends allow at 4–6 off the axis). So the end shapes, or which corner each figure meets, are not settled.
   - Correction:
     - record the conflict in the README (Readings corrected or Unresolved), with the drawn values (3.58, 12.24, 12.31, the bar drawn at 3.70–5.57);
     - if the figure wins, set SB.tr to 3.2 and re-solve the stop's turn (RFS) and the spring's two shapes (the full-wind tests in maintaining.py and wempe_stopwork.py follow).
   - Likely.
7. **WRONG (scaled), the click screws WN-21.**
   - The head: 05-06_11's section draws it 0.83–0.95 high (10–12 px at 12.1 px/mm; Ø 2.56, matching). The model's estimate is 0.5 (fusee.js:552–554).
   - The shank: domed, ending about 0.25 inside the cup's rim, where the model has it flat and 0.12 past the rim.
   - The slot is a BoxGeometry bar 0.02 proud of the head (fusee.js:555), not a cut.
   - The M1,7 has no thread, nor does the ratchet's tapped hole.
   - Correction: head 0.9 (it still clears the wheel's web by 0.55), the end domed at GP−1.55, the slot cut into the head (a solidGeo head with a slot loop, as the wire stud's), and KIT.lathThread on the shank with the plate's hole tapped (matchThreads).
   - Likely for the sizes; sure for the slot and the thread.
8. **ARTIFACT A2, smooth-shaded square edges.** One shading fix covers all of these:
   - raw THREE.LatheGeometry (`turned`, `ringT`, fusee.js:102–103):
     - the ratchet's cup (1,600 bad triangles);
     - the WN-21 screws (200/240);
     - the detent arbor (162/240);
     - the stop pin (60/360);
   - `ribbonGeo` (fusee.js:128–137: four shared corner vertices per section, then computeVertexNormals):
     - the click springs (209/372);
     - the stop spring (421/820).
   
   Fix: split the corner vertices (eight per section in ribbonGeo), and use one lathe helper with creased corners or KIT's turned solid. Sure.
9. **ARTIFACT, coincident internal faces in the ratchet.** `fuse()` (core.js:543) merges three solids without removing shared faces: 492.8 mm² face to face at GT inside one mesh. Build the plate and cup as one solidGeo (cells at GT…G for the teeth outline, GP…GT inside r 13.0, GC…GP for the wall). Sure.
10. **WRONG (minor), the click springs' developed length: 26.67 against "gestreckt 27,0"** (±0,1). The S is a cosine ramp over 8.5° (fusee.js:568), not the drawn bend round two Ø 2,2 mandrels, which takes the extra length. Model the S as two r 1.1 (+ 0.2 strip) bends with a straight between them, keeping the tip at 110°. Likely.
11. **MISSING for 'first', the ratchet as first drawn** (05-06_12 before revision a, 11.3.48: tips Ø 37,5, no 0,3 × 45° chamfer). Build it in the 'first' group (the detent's tip, on r 12 about hole 4, reaches the teeth 0.125 sooner; check maintaining.py), or at least list it in the README's "On the cards only". Sure on the sheet.
12. **MISSING (minor), the detent arbor's chamfered shoulders and rounded pivot ends** (05-05_11; fusee.js:650). Likely.
13. **Minor, as first drawn (020605):** eye r 1,7 and square end 6,2 from the eye's hole (the model uses 05-06_10's 1.8 and 6). Within the drawings' precision; record it.
14. **Nits.**
    - The clicks (1.82, the upper limit) stand 0.02 past the cup's rim (recess 3.1 − 1.3 = 1.8). Both figures are nominal, so it is within tolerance; 1.80 would sit flush.
    - The pins' 12 segments read coarse close up.
    - The transcription calls 05-06_10's "15,25" "hole to the square end"; it is the chord between the two holes.

**Verified correct:**
- the ratchet: teeth, tips, depth, bore, plate and floor thicknesses, cup, chamfer, screw and pin-hole places;
- the clicks: nose, back, hollow, boss, base line, holes and sinks;
- the click springs: section, arcs, hole place, tip angle;
- the maintaining spring: Ø, thickness, band, holes, 65°, 15,25 chord, eye, end, and the swell's widths (to 0.08);
- the detent's outline against 05-05_12 (overlay on the line), its step, thicknesses and heights;
- the stop bar's 22,5, the pin's R 14, the spring pin's 1,5, the stop pin's Ø 1,6.

Every mesh is closed.

## Sheets reviewed

- 05-05/Wempe_05-05_11.jpg — 050505 Gegensperrkegel kompl. — the click's place on the arbor (6,3 ±0,1, 7,5 before staking), which face the thin tip is on (the upper), the arbor's length, pivots, chamfered shoulders and rounded ends (scaled), the 1941 plan of the click
- 05-05/Wempe_05-05_12.jpg — 050505-1 Gegensperrkegel — 14,2, 8,6, Ø 5, 2,6, 80°, r 12 ±0,1, r 18, r 9 at 6,273 / 9,645, 150°, 2 and 1 −0,03, 2,25 H7 1:70; the model's outline overlaid (`crops/ov_det.png`)
- 05-06/Wempe_05-06_04.jpg — 05 06 Schnecke Teilansicht Blatt 2 — A-B: the clicks', springs', pins', detent's and maintaining spring's arrangement, "Stift nach oben", the "1,2", the pins' ends at the wall. C-D: 22,5, 14, 2, 12, 17,6, 3,2, 3,3, 1,5, the bar's two positions (travel drawn 3.58), the bar's place across (3.70–5.57), the lower end's oblique cut, the hub's Ø 21 fitted for scale
- 05-06/Wempe_05-06_09.jpg — 127-556.04-U18 / 020605 Gegenfeder kompl. — how it applies (the first-drawn number of the same spring; parts 70 and 71); widths 1,8 / 1,9 / 2 / 2 / 2,5 / 3,5 at 40–270°; 32,3 / 32,45, 1,3 / 1,4, pins Ø 1,25 × 1,2 (2,5); 14,2, 65°, 15,25; 4,5 / 1,7 / 6,2; the square end radial at 334.4°
- 05-06/Wempe_05-06_10.jpg — 05 06 01-1 Gegenfeder — 32,3 −0,1, 1,35 −0,1, 2, 1,2 H7 ×2, 14,2, 65°, 15,25 (the holes' chord, measured), r 1,8, 0,8, 6, 4, the r 6 swell (its centre and corner measured, the traced widths checked against it), the square end's angle
- 05-06/Wempe_05-06_11.jpg — 05 06 02 Gegensperrrad kompl. — the arrangement (clicks, springs bearing on the clicks' backs, pins, 60°); the section: WN-21's head (Ø 2.56 × 0.83–0.95), its domed end inside the rim, the plate and cup, the springs in the cup
- 05-06/Wempe_05-06_12.jpg — 05 06 02-1 Gegensperrrad — every figure (37,25 −0,1 / was 37,5, 26,1, 24,45, 6,5 H7, 0,3 +0,15 × 45°, 2,1, 1,3, 1,02, 3,1, M1,7, 19,5, 0,6 at 42° / 60°, 1,2 H8 at 14,2, 5°, Z 120, 0,7 +0,05), the revision's struck figures, the section's thicknesses by column scans
- 05-06/Wempe_05-06_13.jpg — 05 06 02-2 Sperrfeder — 0,4 −0,01, 1,5 −0,1, gestreckt 27,0, Ø 0,6 +0,02 at 0,8 −0,05, 5 and 5, r 12,0, r 10,4, Ø 2,2 mandrels, 18°, 105°, 110°, 60°, 13,6
- 05-06/Wempe_05-06_14.jpg — 05 06 02-3 Sperrkegel — 10,05 −0,1, 1,82 −0,04, 2, 85°, 5,2 −0,1, 5,2, Ø 3 boss, r 8, r 3 at 2,78 / 3,54, 1,2 H7, 1,7 × 45°, 2,2, 3∅; the model's outline overlaid (`crops/ov_click.png`); the top edge's tangent line scanned
- Wempe_Einheitschronometer.jpg — coloured section — the fusee column: the ratchet's cup, the clicks and WN-21 (head under the plate), the maintaining spring in the wheel's recess, the detent and its wire (end about 1.8 over the pillar plate), the stop bar under the cover plate; heights as the model takes them, nothing contradicting
- 001-002/Wempe_001.jpg — Federchronometer layout, 10.03.41 (2:1) — opened: the general plan; the maintaining work and stop work aren't legible at its scale, so there was nothing to compare

## Sheets not reviewed

- 05-06/Wempe_05-06_02-2.jpg (05 06 04-2, the slot's 2 H8, its "4", 1,5 / 1,1 depths, the spring pin's 0,5 H7 and "15"), 05-06/Wempe_05-06_01.jpg, 05-06/Wempe_05-06_03-1.jpg, 05-06/Wempe_05-06_03-2.jpg (the fusee and its assemblies), 05-06/Wempe_05-06_07.jpg (the fusee wheel's recess for the spring) and 05-06/Wempe_05-06_16.jpg (the click wheel): batch 5's sheets. I used their figures through the transcription and the code only.
- 05-08/Wempe_05-08_01a.jpg / _01b.jpg (holes 4, 5 and 7 in the top plate's table) and the pillar plate's 05-08_03a/b: batch 1's sheets; read through the transcription's table (hole 4 Körner 0,9; 5 M1,7; 7 Ø 1,6 +0,009).
- References/wempe/drawings/Index.md describes a different stop work (Stellhebel / Stellfeder / Stellkloben under the pillar plate). It is not a sheet: it is labelled "inferred and back-calculated" and contradicts the sheets elsewhere (its cannon pinion), so it was not used. No other image in the drawings folder concerns these parts. The stop bar, its pin and spring, the stop pin and the wire spring have no sheet of their own (Missing_details.md, the coloured section's callouts).
