# Batch 5: the fusee group against its sheets (26 October 2026)

I worked read-only in the `claude/wempe-artifacts` worktree, at HEAD 6072a92e. Nothing in the repository was edited.

**How I measured.**
- **The solids.** I dumped every mesh of `fusee`, `fuseeWheel`, `coverPlate`, `vorreiber` and `dustPlate` from the page (`?snap&qa`) in all five versions, in the movement frame. The scripts are `b5/dump.py`, which writes `dump_<rev>.json`, and `b5/dumpn.py`, which adds the vertex normals.
- **The geometry analysis** (`b5/g5.py`, `b5/nrm.py`):
  - face levels (horizontal faces) with their radius ranges about the fusee's axis F10 (−16.708, −15.292);
  - slices and circle fits;
  - open edges (none anywhere);
  - coincident internal faces;
  - sloped-face angles;
  - each triangle's vertex normals against its face normal.
- **Renders.** These use isolate.py's FREEZE and KEEP (`b5/render.py`, GPU, Edges on).
- **Sheet crops.** Crops of every view are in `b5/crops/`, enlarged 2.5× to 8×. I also took pixel dumps (grey-level and ASCII) of the fusee wheel's and the click wheel's sections, to read lines that lie 1-3 px apart.
- **The groove floor.** I ran `tools/wempe_fusee_profile.py`.

Every path below is under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b5\`.

**Versions.** The `last`, `first`, `1943` and `6mx` versions are identical for these five parts; the dumps differ only by the train's turn. In `3955` only the arbor's square differs: it is 4.5 shorter, 23.8 against 28.3, a recorded departure from the photograph. The 1941 fusee (02-1, 03-1) is not built as first drawn; the README's "As first drawn" section records this (discussed below).

Coordinates are y up toward the dial. The levels used below:

| name | y | what it is |
|---|---|---|
| W | −2.385 | the fusee wheel's underside |
| F | −6.125 | the body's re-turned large face |
| S | −18.475 | the body's small end |
| yD | −0.025 | the arbor's dial shoulder |
| yT | −19.725 | the arbor's top-plate shoulder |

---

## fuseeWheel: 05 06 00-3 Schneckenrad (`05-06/Wempe_05-06_07.jpg`, 2:1)

| feature | sheet | model (how measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | Z 90, D 40,57, d 39,21, dg 37,84, m 0,4356, l 0,64 | 90 tip clusters at y −3.0, tip r 20.285, root r 18.920 | 0 | match | sure |
| blank Ø | 40,65 −0,05 (hobbed to 40,57) | 40.57 | — | match | sure |
| rim height | 2,62 −0,04 to the top level | the top at 2.620 over W: rim **and teeth** | see next row | — | sure |
| the 0,2 +0,02 step | the pixel profile (`w07_rim2.png`; grey dump at x 437-470, y 219-245): the thick outline is at the 2.62 level only between Ø 32,3 (x 437) and Ø 33,8 (x 442), and at 0.2 lower (row 226.5) from Ø 33,8 out to the tooth tips. The 0,2's lower extension line leaves the **teeth**' outer edge; the 2,62's leaves the **lip** at Ø 33,8. The left half (x 186-215) shows the same | a ledge 0.2 low between r 16.15 and 16.9 (y −4.805); the rim and teeth at the full 2.62 outside r 16.9 | inverted | **WRONG** (W1) | likely to sure |
| recess on the face | Ø 32,3 +0,05 down to the web | r 16.15 | 0 | match | sure |
| web | 1,22 −0,04 | 1.220 (y −3.605) | upper limit | within tol. | sure |
| hub top | "0,4 −0,05": the upper arrow on the 2.62 line, the lower on the hub's face (rows 224.5 and 227.5, 3 px = 0.42), so the hub's face lies 0.4 under the lip, 2.22 over W. The transcription reads it as a counterbore depth; no counterbore is drawn: the bore lines run straight through, Ø 3.9 scaled | hub face at 2.620 (r 3.245-7.8) | +0.40 | **WRONG** (W2) | likely to sure |
| hub flank | 45° from the hub face (r 7.5 scaled, Ø 15.0) down to the web (r 8.2 scaled); Ø 16,6 −0,2 is its foot | 0.5 × 45° (r 7.8 → 8.3 at 2.62 → 2.12), then vertical to the web | the chamfer is about 1.0 deep, not 0.5 | **WRONG** (W2) | likely |
| tube | Ø "6,6" +0,1 (the first digit overwritten; scaled 6.5; "4,6" can't wall a Ø 4 bore) to 5 +0,2 over W; "Kante leicht brechen" leader at the tube's top outer corner | Ø 6.49 (6.5 g6, from 05 06_1's fit table) to 5.000; top corner square | −0.1 on Ø; break missing | recorded departure (README: "overwritten … 1941 fits taken") holds if the ratchet's bore is 6.5 H7 (batch 6); edge break **missing**, minor | likely |
| bore | 4 +0,1 | 4.55 | +0.45 | recorded departure (can't pass the arbor's seat 4.38-4.5); holds | sure |
| underside recess | Ø 14 +0,1 × 1,3 −0,1 | r 7.000, 1.300 deep | 0 | match | sure |
| mouth chamfer | 60° from Ø 17 +0,2 | 60° from the axis, Ø 17.1 to Ø 14 at 0.895 up | 0 | match (the sheet's line scales 63° from the axis) | sure |
| pin hole | 1,2 H8 at 14,2 r −0,02 | Ø 1.204 at r 14.200 | 0 | match | sure |
| one solid | — | 4 pieces merged by `fuse`; internal coaxial pairs at r 8.65, 16.15 and 16.9 (66, 124 and 257 mm²) | — | no Edges seam seen in renders: Edges is screen-space; the pairs are hidden | sure |
| lathe shading | — | `ringT` (THREE.LatheGeometry) for the hub and tube, and the ledge ring: 2,630 triangles (355 mm²) with vertex normals more than 25° off their face | — | **ARTIFACT A2**: the hub face and the recess ceiling shade as domes; the tube's foot and the corners look rounded. A dark radial **lathe seam** runs across the underside recess and the hub (`r_fw_5.png`, `r_fw_1.png`, `r_fw_0.png`, `r_fw_4.png`) | sure |

## fusee body: 05 06 04-2 Schneckenkörper (`_02-2.jpg`, rev. a 27.2.48), with 05 06 04 (`_03-2.jpg`), 05 06_4 (`_04.jpg`) and 05 06_20 (`_20.jpg`)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| flange Ø | 35,6 −0,1 | r 17.800 | 0 (upper limit) | within tol. | sure |
| flange slot floor | 17,25 r | 17.25 | 0 | match | sure |
| ribs and slot | 2 ±0,02 over both; slot 0,87 +0,01; second rib 0,37; first rib 0,8 nominal | 0.76 / 0.87 / 0.37 by the code; on the solid each rib wall sits on the 0.04 row grid, so the first rib's face lies between rows 0.75 and 0.79 | ±0.02 | slot partly outside +0,01 (see A5) | sure |
| groove floor | Grund 14,75 … 9,30 | `wempe_fusee_profile.py`: turns 1-8 within +0.017; rms 0.008 against _20's curve; pitch 1.1994 | ≤ 0.017 | match | sure |
| rib | 0,33 thick, 0,6 over its land ("alle Maße: +0,6") | 0.6 high; top width alternates 0.28-0.32, foot 0.36-0.40, as the helix crosses the 0.04 rows (vertex columns, e.g. θ −0.20/−0.17: rows 3.43-3.71 then 3.47-3.75) | ±0.04 | within ±0,05 general tol.; **ARTIFACT A5** (stair-stepped edges) | sure |
| land | 0,87 (1,2 pitch less 0,33) | 0.84-0.88 by row | ±0.02 | within tol. | sure |
| end point N | 0,3 from the small end | groove cut to turn 8.817, land edge 0.3 from S | 0 | match | sure |
| hub at the small end | Ø 21 −0,05 | r 10.500 | upper limit | within tol. | sure |
| small-end recess | Ø 15 × 1,6 +0,1 | r 7.5 × 1.600 (S+1.6 = −16.875) | 0 | match | sure |
| bore | 7 H7 | Ø 7.006 | 0 | match | sure |
| large recess | Ø 26,3 +0,2, 9,9 −0,1 from the small end | r 13.150; floor −8.625, 9.85 from S | 0 / −0.05 | match | sure |
| chamfer into it | 45° from Ø 29,8 +0,2 | 45°, from r 14.7 at the re-turned face (r 14.9 at the blank's) | consistent with the re-turn | match | sure |
| overall length | 12,6 −0,1 (bracketed (12,3) on 05 06 04) | 12.35 | −0.15 | recorded departure (face re-turned 0.2 to 05 06 04's "13,7 −0,1" taken at 13.6); holds | likely |
| face fall | 33∅ +0,1 and 5° (05 06 04) | flat to r 16.5, 5° outside | 0 | match | likely |
| M2 × 3 | r 5,75, 120°, 6 +0,5 deep | r 5.75, to −14.875 (6.25 from the floor) | 0 | match | sure |
| M1.7 (cover-plate screw) | 6 r, 1 from the slot line; 6 deep from the recess floor | at 6, offset 1; floor −10.875 | 0 | match | sure |
| chain pin hole | 0,55 +0,01 axial through both ribs | Ø 0.555 to F0 − 2.05 | 0 | match | sure |
| cutter flat | 13,5 Ø, 2,9 +0,1 deep, hook pin 1 under the ribs | rCut, R 6.75, 2.9 | 0 | match (as the README reads it: a slitting cutter in the slot) | likely |
| stop-bar slot | 2 H8, near edge 4 from the axis, "1,1 +0,05 tief" and "1,5 +0,05 tief" | v 4-6, 1.5 deep, shallow 1.1 from u 8.0 | 0 | match (the shallow part's start is an estimate, recorded) | likely |
| spring pin hole | 0,5 H7 along the slot, 1,5 from the axis line (C-D's "15" is 1,5) | Ø 0.5045 at 1.5 | 0 | match | sure |
| one solid | — | 6 pieces fused; internal faces at y −8.036 (r 13.15-17.66, 245/253 mm²), −16.976 (r 7.5-10.18) and the cylinder r 7.5 | — | hidden; no seam line seen | sure |
| shading | — | the main body lathe (`lathe()`, fusee.js:368, LatheGeometry with the radius pushed out and `computeVertexNormals`): 22,283 triangles (984 of 5,745 mm²) with normals more than 25° off | — | **ARTIFACT A2/A6**: the flat large face shades as a dish, and the ribs' square corners round. A **radial seam line** shows across the large face (`r_fu_1.png`) and radial streaks across the small-end face (`r_fu_0.png`) | sure |

## arbor: 05 06 04-1 Schneckenwelle (`_15.jpg`, 2:1)

| feature | sheet | model (profile, fusee.js:408) | verdict | sure |
|---|---|---|---|---|
| journal | 4,5 ±0,02 → 4,39, 1:70, 8 long | 4.5 → 4.39 over 8 | match | sure |
| step | 6,1 −0,05 × 3,1 +0,05 | 6.10 × 3.1 | within tol. | sure |
| collar | 7,04 −0,01 × 7,9 | 7.04 × 7.9 | match | sure |
| Vorreiber seat | 4,5 ±0,02 → 4,38 (1:70), 19,7 +0,05 shoulder to shoulder | 4.5 → 4.38 over 8.7; 19.7 | match | sure |
| cross hole | 1,1, 2 from the dial shoulder (19,7 − 17,7 −0,05) | Ø 1.1 at yD − 2 | match | sure |
| pivot | 2,8 ±0,02 → 2,7 (1:70), 6,5 +0,1 | 2.8 → 2.707 over 6.5 | match | sure |
| stub | 1,6 +0,1/+0,05, 1:70, ends in a lathe centre; 60,6 −0,2 overall | Ø 1.675, 3.6 long, a small chamfered flat end | recorded departure (the centre cut off under the dial); holds | likely |
| square | 3,17 r6 at the root, 1:100 to 2,92, 28,3 from the step's end, centre point | 3.17 across flats, 1:100, a cone point of 38.7° half angle | match ('3955': 23.8, recorded from the photograph) | sure |
| a small chamfer at the seat's dial-side shoulder | drawn, not sized | none | **missing**, minor | likely |
| shading | — | the square is `CylinderGeometry(…,4,1)` (fusee.js:415) with smooth radial normals: 217 of 237 mm² more than 25° off | **ARTIFACT A7**: the flats shade as a cylinder, with no corner line (`r_fz_4.png`, `r_fz3955_0.png`). The point's cone, 64 flat fan cells (fusee.js:417), is **faceted** (`r_fz_5.png`). The turned profile's shoulders shade rounded (A2, `r_ar_2.png`) | sure |

## click wheel 05 06 04-3 Schneckensperrrad (`_16.jpg`, 5:1) and its screws WN-19

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| teeth | 35, tips 16,0 −0,05, roots 14,5 −0,2, faces undercut 8° | 35, 15.99 / 14.4, undercut | match | sure |
| bore | 7,5 +0,05 | 7.525 | match | sure |
| thickness | 2 −0,1 | 1.95 | within tol. | sure |
| holes | Ø 2 +0,1 ×3 on 11,5 ±0,05, Kegel 1:8 | r 1.0 → 1.125, on 5.75 | match | sure |
| **which face the holes open toward** | the section's pixel dump (`cw_sec.png`; x 410-480, y 704-738): the hole's left wall runs x 433 → 430 and its right wall x 469.5 → 470.5 from the top face to the bottom, so the holes are **Ø 2 at the top face and open 1:8 (Ø 2.24 scaled) toward the bottom face**. The bore's 0,3 +0,2 × 45° chamfer is on the **top** face | holes open toward the free face (CW1); bore chamfer **also** on the free face (fusee.js:428) | **WRONG** (W3): the chamfer and the holes' wide ends are on opposite faces. The tapered heads go in from the free face, so the chamfer belongs on the face against the body's recess floor | sure (sheet), likely (which face is free) |
| bore chamfer size | 0,3 +0,2 | 0.4 | within tol. | sure |
| the "12,5" | meaning unsure: not a diameter through the centre (its line misses the centre by about 1.5) | — | unresolved, no effect | — |
| WN-19 heads | turned to 1:8 | `turned()` lathe | the flat heads shade domed (A2, `r_fz_2.png`) | sure |

## coverPlate: 05 06 00-4 Deckplatte (`_08.jpg`, 5:1)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| Ø | 21,1 −0,1 | 21.05 | within tol. | sure |
| thickness | 0,8 −0,1 | 0.800 | within tol. | sure |
| centre hole | 6,1 H8 | 6.109 | match | sure |
| its 60° chamfer and land | 60°, land 0,4 −0,1 on the body's face | land 0.4 on the body's face, 60° from the axis to Ø 7.49 at the outer face | match | sure |
| screw hole | 1,85 −0,1 at 6 ±0,05; 90° sink to Ø 3,1 +0,1 on the outer face | Ø 1.80 at 6.000; sink Ø 3.15, 0.7 deep (cone 88°: 0.675 would be exact) | within tol. | sure |
| outer edge | 45° on the outer face, not sized | 0.65 × 45° (scaled) | match | likely |
| all features on one face | the section draws the sink, the 60° and the 45° on one face | the outer face | match | sure |
| render | — | solidGeo, flat-normal faces; clean (`r_dp_*.png`, `r_dps_*.png`) | — | — |

## vorreiber: 05 06 00-2 (`_06.jpg`, 5:1)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| flange Ø | 14 d11 | 13.895 | match | sure |
| hub Ø | 7,6 −0,2 | 7.50 | within tol. | sure |
| overall | 3,1 −0,2 | 2.76 | recorded departure (face a re-turned at assembly to suit the stack); outside the tolerance but explained. The code comment at fusee.js:453-454 still says "2.9, the flange 1.0" against the code's 2.76/0.86: a **stale comment** | sure |
| flange | 1,2 −0,2 | 0.86 | as above | sure |
| recess in face a | 9,9 +0,2 × 0,4 +0,05 | Ø 9.95 × 0.425 | match. If 0.34 is turned off face a at assembly, the recess must be re-cut: worth one line in the comment | sure |
| bore | 4,4 H7 at the flange, (4,36) at the hub, 1:70 | Ø 4.442 → 4.41 (the arbor's taper + 0.01) | recorded ("Loch zur Welle passen") | sure |
| chamfer | 0,3 +0,1 × 45° on the flange's hub-side face | 0.35 × 45°, hub side | match | sure |
| pin hole | 0,8 at 1,1 ±0,1 from the hub face | Ø 0.8 at 1.1 | match | sure |
| shading | — | `ringT` lathe: **8,353 of 11,245 triangles (251 of 397 mm², 63 %)** with normals more than 25° off | **ARTIFACT A2, the worst in the batch**: the flange looks like a cushion or torus, and its square edges and 0.35 chamfer are lost (`r_vr_0..3.png`, `s_vr.png`, `r_arv_*.png`) | sure |

## dustPlate: 05 06 00-1 Staubplatte (`_05.jpg`, 5:1)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| Ø | 7,6 −0,1 | 7.55 | within tol. | sure |
| thickness | 3,1 −0,2 | 3.0 | within tol. | sure |
| recess | Ø 6,2 +0,1, floor 2,1 −0,2 from the other face | Ø 6.25 × 1.0 | match | sure |
| chamfer | 0,5 +0,2 × 45° on the face away from the recess | 0.5, on the face toward the plates | match | sure |
| square hole | 3,1 H7, Kegel 1:100 narrowing toward the recess face | 3.134 across flats, straight | +0.022 over H7 (the 0.01 clearance added); taper not drawn (0.03 over its length) | minor | sure |
| the recess face's outer corner | drawn **rounded** at both ends (`sp_sec.png`), not sized | square | **missing**, minor | likely |
| render | — | solidGeo, flat normals on the 120-segment cylinder | **ARTIFACT A8**: vertical facet bands on the Ø 7.55 wall (`r_sp_2.png`, `r_sp_0.png`) | sure |

## Versions

- **last, first, 1943, 6mx:** identical for these parts.
- **3955:** the square 23.8 (recorded from the photograph).
- **The 1941 fusee, not built.** 02-1 (020613-2, 127-556.04-060) and 03-1 (02 06 13, U17, "Übergangsserie") apply to it. Its features:
  - Ø 36 flange (35,6 struck);
  - 12,6 length;
  - a Kegel 1:70 bore;
  - a large end dished as a cone into the bore, with a separate flange plate (66) on a set screw "Gewindestift 0,7";
  - the small-end piece (67);
  - its own arbor (03-1: a 2,8 pivot, the cross hole 1,2 from the shoulder, a 4,5 shoulder, a 3,1 journal).

  The README records why it isn't built: pieces 65, 66 and 67 and the matching maintaining work have no sheets. That reason holds; the body itself has a sheet, so the note is exact only for those pieces. I compared both sheets' groove radii with the later body's: they are identical.
- **05 06_1 (1941 assembly):** its fits are taken. Its construction differs (a 1,6 pin through the pillar plate at the dial end, 7 ±0,02 and 6,5 +0,1 stand-offs) and belongs to the same unbuilt 1941 state.
- **The coloured section** draws the fusee pictorially: the wheel's hub as a broad cone, the click wheel. It doesn't settle the 0.2 lip or the hub's 0.4, and I take nothing from it.

## Ranked findings

1. **W1, WRONG: the fusee wheel's 0,2 step is inverted.**
   - Sheet (`05-06/Wempe_05-06_07.jpg`, section; `crops/w07_rim2.png`; grey dump x 437-470): the 2,62 −0,04 height is a narrow **lip from Ø 32,3 to Ø 33,8**. The rim and the toothed band outside Ø 33,8 stand **0,2 +0,02 lower** (2.42), and the 0,2's lower extension line comes off the teeth.
   - Model (fusee.js:497-498): the ledge ring r 16.15-16.9 from W to WL (2.42); the teeth slab and the rim from WT to W (2.62).
   - Correction:
     - ring r 16.15-16.9 from W to **WT** (`ringT([[16.15,WT],[16.9,WT],[16.9,W],[16.15,W]])`);
     - the teeth slab, and the rim from r 16.9 out, from **WL** to W (`slab(TW.xy,…,WL,W)`).
   - Effects: the maintaining ratchet (G = WT − 0.05) still rests on the lip, unchanged. The teeth's face (2.42) stays inside the centre pinion's leaves (y −5.69 to −1.74). Rerun bom.py's and invariants' mesh overlap (`gear.box`), `wempe_transmission`'s face width if it reads one, fine.py and mechanisms.
   - Render: `r_fw_6.png` (teeth at the full height, the ledge inside).
2. **W2, WRONG: the fusee wheel's hub.**
   - Sheet (`_07.jpg`, `crops/w07_hub.png`): "0,4 −0,05" puts the hub's face **0.4 under the lip** (2.22 over the underside, at the middle of the tolerance 2.245), with a **45° flank from the hub face down to the web**, Ø 16,6 −0,2 at its foot (about Ø 14.6 at the top: 1.0 × 45°).
   - Model (fusee.js:495): the hub face at 2.62 to r 7.8, a 0.5 × 45° flank, then vertical to the web.
   - Correction: profile `[3.245,W-2.22]` → `[7.3,W-2.22]` → `[8.3,WW]` (r 7.3 = 8.3 − 1.0), the tube from W−2.22 to WTB. The transcription's "counterbore depth 0.4" is a misreading, since no counterbore is drawn; correct the transcription too.
   - Render: `r_fw_0.png`, `r_fw_2.png`.
3. **W3, WRONG: the click wheel's bore chamfer is on the wrong face.**
   - Sheet (`_16.jpg` section, `crops/cw_sec.png`): the Ø 2 holes open 1:8 toward the face **opposite** the 0,3 × 45° bore chamfer.
   - Model (fusee.js:428): both on the free face. The code comment calls it "sure", but the section's walls (x 433 → 430, 469.5 → 470.5) say otherwise.
   - Correction: keep the holes opening to the free face (CW1 − 0.05), where the heads seat, and move the chamfer to CW0: `{p:ring(0,0,7.525/2+0.4,96),q:bo,a:CW0,b:CW0+0.4}`. Check that the body's recess floor and the arbor's collar beside it stay clear.
4. **A2/A6, ARTIFACT: raw LatheGeometry smoothing (fusee.js:102-103 `turned`/`ringT`, 368 `lathe`).** Worst first:
   - Vorreiber: 63 % of its area off by more than 25°; the flange is pillowed (`s_vr.png`).
   - Fusee body: 984 mm²; the large face is dished and has a radial **seam line** (`r_fu_1.png`); the small-end face is streaked (`r_fu_0.png`); the ribs' corners round (`r_fz_0/1.png`).
   - Fusee wheel's hub, tube and recess: domes and a radial **seam** (`r_fw_5.png`).
   - Arbor shoulders, the WN-19 heads (domed, `r_fz_2.png`).
   - Fix: batch 2's (corner points repeated, or normals flat per profile segment). For the body's pushed-out lathe, also average across the 0/2π seam, or build it without the seam (`lathe()` recomputes normals after moving vertices, which loses LatheGeometry's own seam handling).
5. **A5, ARTIFACT and accuracy: the groove's walls are quantised to the 0.04 mm row grid** (fusee.js:363 rows, 368-369 radius pushed per vertex).
   - Every rib wall is a 0.04-wide slope between rows, and as the helix crosses a row (about every 7 of the 216 columns) the rib's edges jump 0.04: stair-stepped rib edges along every turn (`r_fz_0.png`, `r_fz_1.png`, `r_fu_5.png`, `r_fu_7.png`).
   - Rib top width 0.28-0.32 and foot 0.36-0.40 against 0,33; the slot drifts ±0.02 against its +0,01.
   - Fix: sweep the groove's profile along the helix (rows that follow a(θ) = a0 + PAX·θ/2π, so each wall is one exact helical step with split normals), as a thread is built, and keep the flange's ribs on rows at their own faces (0.76, 1.63, 2.0).
6. **A7, ARTIFACT: the winding square shades round** (fusee.js:415, a 4-sided CylinderGeometry with smooth normals; no corner lines, `r_fz_4.png`). Its point cone is faceted, 64 flat fan cells (fusee.js:417, `r_fz_5.png`). Fix: flat normals per side (`toNonIndexed().computeVertexNormals()`, or solidGeo); build the cone as strips or a lathe with smooth normals.
7. **A8, ARTIFACT: solidGeo's flat normals facet the dust plate's cylinder** (120 segments, Ø 7.55: bands in `r_sp_2.png`). The cover plate's 240 segments are hardly visible. Fix: smooth normals on the coaxial walls, or more segments.
8. **Minor, missing:**
   - the tube's top edge break on the fusee wheel ("Kante leicht brechen");
   - the dust plate's rounded recess-face corners;
   - the small chamfer at the arbor seat's dial-side shoulder;
   - the dust plate's 1:100 hole taper (0.03).
9. **Nits:**
   - fusee.js:453-454 comment "2.9, the flange 1.0" against the code's 2.76/0.86;
   - the Vorreiber's face-a recess kept 0.425 deep after the 0.34 re-turn (say it is re-cut);
   - the dust plate's square 3.134 is 0.022 over 3,1 H7;
   - the cover-plate sink cone 88° (0.7 deep against 0.675 for 90°).

Matches confirmed, apart from the findings above:
- the groove floor (within 0.017; pitch 1.1994);
- every hole and depth of the body (the M2s, the M1.7, the chain pin, the spring pin, the slots, the 26,3/29,8/45°, the 15 × 1,6, the 7 H7, the Ø 21);
- the arbor's every diameter and length;
- the click wheel's teeth;
- the cover plate;
- the Vorreiber's diameters, recess, chamfer and pin hole;
- the dust plate's sizes.

## Sheets reviewed
- 05-06/Wempe_05-06_01.jpg — 05 06 (127-556.04 U21) Schnecke kompl., 1941 — the order along the arbor, the fits (4,4/4,45/6,5 H7/g6, 1,6 r6 struck), the 1941 construction against the model's state
- 05-06/Wempe_05-06_02-1.jpg — 127-556.04-060 / 020613-2 Schneckenkörper, 1941 — the 1941 body (Ø 36, Kegel 1:70 bore, dished large end); applies only to the unbuilt 1941 fusee; groove radii identical to 02-2
- 05-06/Wempe_05-06_02-2.jpg — 05 06 04-2 Schneckenkörper, rev. a 27.2.48 — every body feature: flange, ribs, slot, groove radii, recesses, chamfer, bore, holes, stop slot, pin hole (view C-D at 2.5×)
- 05-06/Wempe_05-06_03-1.jpg — 127-556.04 U17 / 02 06 13 Schnecke, 1941 "Übergangsserie" — the 1941 assembly (flange plate 66, set screw, its arbor); applies only to the unbuilt 1941 fusee
- 05-06/Wempe_05-06_03-2.jpg — 05 06 04 Schnecke, rev. a 2.3.48 — the body on its arbor, 13,7 −0,1, (12,3), 33∅ +0,1 and 5°, the click wheel's place, the 0,5 pin
- 05-06/Wempe_05-06_04.jpg — 05 06 Schnecke Teilansicht Blatt 2 — read for the fusee's own features: the click wheel's 35 teeth, the body's three holes, C-D's hub/recess (the stop work is batch 6's)
- 05-06/Wempe_05-06_05.jpg — 05 06 00-1 Staubplatte — every figure, the chamfer's and recess's faces, the hole's taper, the rounded recess corners
- 05-06/Wempe_05-06_06.jpg — 05 06 00-2 Vorreiber — every figure, the chamfer's face (0,3 axial on the hub side), the pin hole, the face-a note
- 05-06/Wempe_05-06_07.jpg — 05 06 00-3 Schneckenrad — tooth table, the section at pixel level (lip and teeth step, hub 0,4, 45° flank, tube, recess, 60° mouth), the plan (pin hole)
- 05-06/Wempe_05-06_08.jpg — 05 06 00-4 Deckplatte — every figure and which face carries the 60°, 45° and sink
- 05-06/Wempe_05-06_15.jpg — 05 06 04-1 Schneckenwelle — every diameter, taper and length, the cross hole, the square and its point, the seat's shoulder chamfer
- 05-06/Wempe_05-06_16.jpg — 05 06 04-3 Schneckensperrrad — teeth, bore, holes and their 1:8 direction at pixel level, the chamfer's face, the 8°, the "12,5"
- 05-06/Wempe_05-06_20.jpg — Schneckenkurve / Kraftverlauf — the radii at whole turns, via `wempe_fusee_profile.py` on the built solid
- Wempe_Einheitschronometer.jpg — coloured section — the fusee region's order and heights; pictorial at the wheel's hub, settles neither W1 nor W2

## Sheets not reviewed
- 05-06/Wempe_05-06_09.jpg to _14.jpg (maintaining spring, ratchet, click spring, clicks): batch 6's parts. Not compared, except that their bores and seats aren't checked here against the fusee wheel's tube (W1 and W2 leave the ratchet's seat unchanged).
- 05-07 (barrel, chain, band): batch 7's.
- No other sheet in References/wempe/drawings concerns these parts. I searched Index.md, Missing_details.md and Wempe_Einheitschronometer.md; Index.md is unreliable (batch 2).
