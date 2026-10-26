# Batch 2: bridges and cocks against their sheets (26 October 2026)

Worktree `claude/wempe-artifacts` as it stood, with the uncommitted rebuild of the upper cock and the click. Read only: nothing in the repository was edited.

**How I measured.** The built solids came from the page (`?snap&qa`): every mesh of each part, its vertices in the movement frame and its triangles (`b2/dump.py`, `b2/lib.py`). I took face levels, the boundary loops of each flat face, circle fits for holes, normals for sloped faces, and open-edge counts (all 0). I also checked every version through `setRev` (`b2/revs.py`). Renders use isolate.py's own FREEZE and KEEP (`b2/render.py`, GPU). Sheet crops are in `b2/*.png`, enlarged 3× to 12×. Sheet-against-render pairs are `b2/cmp_*.png`.

All paths below are under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b2\`.

Coordinates: TT = −22.35 (top plate's outer face), TI = −19.0, PPT = 3.35.

---

## barrelBridge: the barrel bridge, 05 08 05-1 (sheet `05-08/Wempe_05-08_13.jpg`) and its assembly 05 08 05 (`_12.jpg`)

| feature | sheet (text, view) | model (how measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 3,32 −0,04 (side view) | 3.32 (y −25.67…−22.35) | nominal, at the upper limit | within tol. (drawn at nominal, as frame.js does for one-sided sizes) | sure |
| outer edge | turned with the plate, r 42,5 | rim r 42.4945 (outline fit) | 0 | match | sure |
| hole 45 to the chord | 7 (plan; extension lines parallel to the chord) | 7.000 | 0 | match | sure |
| hole 42 to the chord | 7,7 (same) | 7.700 | 0 | match | sure |
| greatest width | 24 | 24.001 | 0 | match | sure |
| short edge to the chord | 150° | 150.000° | 0 | match | sure |
| hole 48 to the short edge | 5 (extension lines parallel to the short edge, through 48 and the rim corner) | 5.000 | 0 | match | likely (reading) |
| chord length | 73,5 (from the point at 6 o'clock to the projection of the outer top corner Tp; the top extension line starts at the rim corner, read at 3×) | 73.31 | −0.19 (tol. ±0,1) | over-determined by the sheet's own figures (7, 7.7, 24, 5, 150°); the code says so (frame.js:266-276), and the 2:1 view scales 73.5 ±0.7 | sure that it conflicts; the departure holds |
| hole 45 | 3,9 ±0,01 | Ø 3.900, at its table place | 0 | match | sure |
| hole 46 | M2,6 (bored 2,1) | threaded, Ø 2.64 (rM26) | — | match | sure |
| holes 42, 48 | 2,8 | Ø 2.800 | 0 | match | sure |
| steady-pin holes 41, 47 | 1,585 −0,005, 2,5 deep, 90° countersink 0,3, from the underside (side view, 12×: sink on the plate side, drill point inward) | Ø 1.5825, 2.5 deep (level −24.85), sink 0.3 × 90° at y1 = TT | flat floor (the sheet draws a drill point) | match (the point is left out, as everywhere in the frame) | sure |
| hole radii 42/48 r 37, 41/47 r 39 | table and position view | r 37.000 / 39.000, at −120°, −28°, −128°, −36° | 0 | match | sure |
| steady pins WN-203 | 1,3 proud (05 08 05) | 1.3 proud, Ø 1.6, flat ends | the ends are drawn chamfered on `_12` | minor: chamfer missing | likely |
| screw heads (WN-55) | not dimensioned | Ø 6.4 × 3.0 from the photograph | — | not on the sheet | — |
| render | — | `r_bb_0..3.png`, `s_bb.png` | — | clean apart from the screw heads (artifact A1) | — |

## The set-up click inside barrelBridge, 05 08 05-2 (`05-08/Wempe_05-08_14.jpg`, 5:1; assembly `_12.jpg`)

Local frame: x from hole 46 toward the nose, y away from the base. Measured on the click's top-face loop (`click_loc.npy`). The handedness was checked: the frame's determinant is +1, and the top view carries the same rotation (no mirror) as `_12`'s assembly plan (`cmp_click_assembly.png`).

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| thickness | 2,6 −0,03/−0,05 | 2.60 (y −28.27…−25.67) | 0.03 over the upper limit (2.57) | **wrong, minor**: draw it at 2.56 | sure |
| hole | 3,2 Ø +0,03 (revision a, 25.5.48) | Ø 3.23 | at the upper limit | within tol. | sure |
| base below the hole | Ø 5,7 thin circle tangent to the base | 2.85 | sheet scales 2.87 | match | sure |
| beak height | 3,5 | 3.50 (tC y 0.65) | 0 | match | sure |
| beak end face | 85° (arc about the beak's foot) | 85.0°, leaning toward the hole as it rises | sheet scales 84.7° | match | sure |
| hollow | 6 r, centre 5,142 back and 7,212 under the hole (the 7,212 runs from the hole's centre line; checked at 3×) | r 6 about (−5.142, −7.212) | 0 | match | sure |
| hole to beak foot | 9,7 | 9.69 | 0.01 | match | sure |
| nose | 1 r, 7,5 from the hole | r 1 at 7.500, tangent to the base | 0 | match | sure |
| back | 12,5 r | r 12.5 about (−1.452, −9.347): through the beak corner and tangent into the nose | centre 0.21 from the traced (−1.545, −9.536; my own r 12.5 fit to 140 sheet pixels, rms 0.03 mm); peak 0.19 higher than drawn | holds: the sheet's figures can't give both a 3.5 beak and a tangent nose on the drawn centre | sure |
| corners | — | beak tip 41.6° knife edge (hollow into face), hollow–base corner 43°; back → nose and nose → base tangent (turn < 3° per step) | — | match the sheet (sharp, no radii drawn) | sure |
| length | 17,4 | 17.53 | +0.13 (tol. ±0,1) | **sheet conflict**: 9.7 (foot) + 7.5 + 1 force 17.53, and the drawn view scales 17.4. Record it in the README; no fix while the 9.7/7.5 figures are kept | sure |
| angle on the bridge | not dimensioned; `_12` (1941 assembly) draws the base line at about 17° from N toward O | 23.3° (Wempe 3955 photograph, ±3°) | 6° | note only: the click rests on the ratchet | likely |
| render | — | `r_click_0..6`, `r_clk_0..7`, `s_click.png`, `s_clk.png`, `cmp_click.png` | — | outline clean: no sliver, no nick, tangent back → nose (rebuild verified) | sure |
| its screw WN-22 | shouldered (05 08 05) | shoulder Ø 3.1 × 2.65, head Ø 4.5 × 2.1 | — | head chamfer faceted (artifact A1), `r_cs_0`, `r_cs_1` | sure |

## fuseeBush: 05 08 01-2 (`05-08/Wempe_05-08_08.jpg`, 5:1)

The axis is at F10 (−16.708, −15.292). Measured from the vertices' (r, y) pairs.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| total height | 7,1 −0,2 | 7.0 (2.9 + 1.5 + 2.6) | −0.1 | within tol. | sure |
| above the flange | 2,9 +0,2, Ø 8 T6 (+0,028/+0,019), Kegel 1:70, (7,96Ø) at the top | 2.9; Ø 8.0235 to 7.982 at the top (y −26.75…−23.85) | ref. 7.96 is from nominal 8.0 | match | sure |
| flange | Ø 13,2 −0,2 × 1,5 −0,1 | Ø 13.2 × 1.5 | nominal | within tol. | sure |
| spigot below the flange | Ø 8 g6 (−0,005/−0,014), 7,1 − 2,9 − 1,5 = 2,7 | Ø 7.9905 × 2.6 | −0.1 on the spigot | recorded departure (endshake of the fusee arbor, frame.js:318-324); holds, and the total stays in tol. | sure |
| bore | 4,1 Ø +0,2 | Ø 4.52 | +0.22 over the limit | recorded departure (arbor journal Ø 4.5, README Unresolved); holds | sure |
| top sink | Ø 7 ±0,1 at 45° | Ø 7.0, 45°, down to r 2.26 at −25.51 | 0 | match | sure |
| flange holes | Ø 1,5 +0,1 through, sunk Ø 2,2 H8 × 0,5 +0,05 from the flange's outer (T6) side, on Ø 10,4 ±0,05, 120° apart | Ø 1.55, sink Ø 2.207 × 0.5 on the outer face, r 5.2 | sink depth 0.5 (middle 0.525) | within tol. | sure |
| one solid | — | three pieces merged by `fuse` (frame.js:329). Coincident internal faces stay at TT (34.0 mm²) and TT−1.5 (34.5 mm²) | — | **artifact A3**: the bore shows a broken seam line at those levels (`r_seamfb_0.png`, `r_seamfb_1.png`) | sure |
| lathe shading | — | THREE.LatheGeometry with shared corner vertices: 2,880 of 12,360 normals oblique | — | **artifact A2**: square edges shade rounded (`r_fbo_*.png`, `r_seamfb_2.png`) | sure |
| screws WN-34 | M1.4 into the plate, heads in the sinks | heads Ø 2.1 × 0.45, seated on the sink floor, 0.05 under the face | — | match (head chamfer faceted, A1, too small to see) | sure |

## dustBush: 05 08 01-3 (`05-08/Wempe_05-08_09.jpg`, 5:1); also the assembly 05 08 01 (`_02.jpg`) and the coloured section

| feature | sheet | model ('last'/'first'/'1943') | diff | verdict | sure |
|---|---|---|---|---|---|
| total length | 18,1 −0,2 | 18.1 (−23.85…−41.95) | nominal | within tol. | sure |
| body | Ø 13,1 −0,2 × 15,1 −0,2 | r 6.55 to −38.95 | nominal | within tol. | sure |
| collar | 3,1 −0,2 at the body's top, Ø 15,1 −0,2 with a flat 14,1 −0,2 (flush with the body) | 3.1 (−35.85…−38.95), r 7.55, flat at 6.55 | 0 | match | sure |
| neck | Ø 9,7 −0,2, 3.0 long | r 4.85, −38.95…−41.95 | 0 | match | sure |
| mouth | 20° (half angle, 21.8° scaled), 1,8 +0,2 deep | 20°, 1.8 deep, Ø 9.08 → 7.775 | 0 | match | sure |
| bore | 8 H7 +0,015 at the bottom, Kegel 1:70, (7,62Ø) at the mouth's foot | Ø 8.0075 → 7.775 at the mouth's foot (1:70 over 16.3) | ref. 7.62 vs 7.775 | the sheet's 7.62 doesn't follow from its own 1:70 (it would need 26.6 mm of taper); its view scales 7.70. The model follows the 1:70: holds | likely |
| **bottom face** | the section (12×, `db_br.png`, `db_bl.png`): outer corner chamfered (about 0.3 × 45°, scaled, not dimensioned), a flat bearing ring **0,5** wide, then the bottom **dished at 5°** up to the bore (the "5°" arrow points at that face; the section's hatched wall shows its floor rising toward the bore; drawn rise about 0.2-0.3) | a 0.5-high chamfer on the outer wall leaning 5° (r 6.55 → 6.506), flat bottom from r 6.506 to the bore (frame.js:341) | — | **WRONG**: the 5° and the 0,5 are misread | likely |
| outer corners of neck and collar | drawn with small radii (not dimensioned) | sharp | — | minor: missing radii (estimate, maybe 0.2) | likely |
| lathe shading | — | 146/438 (body) and 292/438 (neck) normals oblique on faces that are all vertical or horizontal | — | **artifact A2** (`r_dbo_*.png`) | sure |
| **form in the assembly** | 05 08 01 Oberplatte kompl. (`_02.jpg`, 2:1, revision a "zeichnerisch geändert" 2.11.46), Schnitt A-B (`p2_sec.png`): the dust bush drawn **waisted**: full Ø 13.1 for about 5.4 from the flange, a 45° cone, a waist about Ø 10.5-10.9, a collar about 1.75-2.2 thick, a neck about 4.2 carrying the cork ring about 4.2 thick | 'last', 'first' and '1943' straight (05 08 01-3, 2.7.42, and the coloured section, `col_dust.png`, also straight); only '3955' and '6mx' have a waist (photographs) | — | **conflict between sheets** (`cmp_db_assembly.png`): the assembly as revised in 1946 agrees with the photographs, the detail sheet with the coloured section. The owner should decide; at least record it in the README (the code comment says "05 08 01-3 (2.7.42) draws the body straight" and doesn't cite 05 08 01) | sure (that it differs) |

## corkRing: 05 08 01-4 (no sheet)

| feature | source | model | verdict |
|---|---|---|---|
| Ø 16.1, bore the neck's, 3.86 high | coloured section (`col_dust.png`): scaled 3.9 | Ø 16.1, bore r 4.86, 3.70 (squeezed); 6MX 2.4 | estimate as recorded; the assembly `_02` draws it about 4.2 thick and as wide as the collar, so the coloured section's reading stands |
| render | — | pure rectangle section, but 219/365 normals oblique | **artifact A2** (rounded-looking edges, `r_fb_*.png`) |

## upperCock: 05 08 03-1 (`05-08/Wempe_05-08_05.jpg`) and 127-556.04 U30 (`_06.jpg`)

Local frame: u along the axis from 23 toward the foot (bearing 345°), v toward O. Measured on face loops at each level.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| axis | 15° from N toward W (position view) | bearing 345° | 0 | match | sure |
| overall height | 15 −0,1 (A-B) | 15.0 | nominal | within tol. | sure |
| foot | 3,2 thick, 16,5 long, 17 wide at its end | 3.2 (−25.55…−22.35), u 26.5…43, v ±8.5 | 0 | match | sure |
| overall length | 49 | u −6…43 | 0 | match | sure |
| end radius | 6 r | r 6 | 0 | match | sure |
| web | outer face 26,5 from 23; inner face an arc, "(" centred on the seat (checked at 8×, `uc_web.png`), 4,5 on the axis, ≈5,5 at the edge, 22 ±0,1 | arc r 22 about 23, 4.5 on the axis, 5.7-5.8 at the sides | — | match | sure |
| arm | 3,2 at the seat (3,2 ±0,02 to the boss face) | 3.2 (TT−15 to TT−11.8) | 0 | match | sure |
| relief | 0,8 under the arm near the seat; the step a 45° chamfer from the full underside's corner at 12 r (A-B, 8×, `uc_ab_seat.png`: the 45° leg runs from that corner inward; the 0,8 arrows span the two undersides); U30: 2,4 there, the corner at 12 | relieved to 2.4 (TT−12.6) inside r 11.2; a 45° cone r 11.2 → 12; strip-built, normals within 1.4° of the ideal cone | 0 | match (rebuild verified) | sure |
| boss | face Ø 6 at the full-underside level (A-B: the rectangle under the seat; C-D: the boss with 45° flanks); U30: flank 45° from about Ø 7.8 to 5.8 | face Ø 6.0 at TT−11.8, cone to Ø 7.6 at TT−12.6 | — | match; the slot nicks the face to v 2.93 as recorded | sure |
| boss flank shading | — | 508 flank triangles; **18 (0.04 mm²) deviate 3-12.9° from the cone**, all in the non-strip "bite" and "corner" cells beside the M1.2 holes and the slot (frame.js:432-434) | — | **artifact A4, small**: facets near each M1.2 hole and at the slot corners | sure |
| seat | 5,2 H7 2.7 deep from the top, floor 0,5 bored 4,59 (U30: settings from the top) | Ø 5.206 to TT−12.3; floor TT−12.3…−11.8, Ø 4.590 | 0 | match | sure |
| **M1.2 holes** | M1,2, 3,5 +0,05 either side along the axis (tapped) | **untapped Ø 0.95** at 3.525 (frame.js:441). The setting screws WN-55.ck are thinned to thread radius 0.46 to fit (escapement.js:930), whereas the lower cock's same M1.2 are tapped (rM12) and its screws carry rs 0.6 (escapement.js:936) | thread missing; screw 0.28 thin | **WRONG** | sure |
| slot | 1,8 H7, 0,9 either side of the seat's line, to 3,4 from the axis, on the O side; C-D: inner wall at 82°, leaning toward the axis going down | ±0.9, 3.4 on the top, 3.06 under, O side | 0 | match | sure (side: no mirror between position view and plan) |
| hole 20 | Ø 2,8 at 10 from 23 (table) | Ø 2.8 at u 10, cutting the step | 0 | match; the 6MX has none | sure |
| hole 8 | 2,8 through the foot | Ø 2.8 at u 33 | 0 | match | sure |
| pins 6, 9, 50 | 1,585 −0,005, 2,5 deep, 0,2 × 90° sink (A-B) | Ø 1.5825, 2.5 deep, sink to Ø 1.983 | 0 | match (flat floor) | sure |
| stud screw hole | not on 05 08 03-1; **U30** draws a small hole (about Ø 1.4-1.5) **5 back along the axis and 4,2 to the slot side** (`u30_plan.png`) | M1.4 at (4.1, 4.35) (from the stud, escapement.js:135) | 0.9 / 0.15 | note for batch 3 (the stud): U30 is the lever cock, so the model's place isn't wrong on its own sheet | likely |
| one solid | — | arm and boss merged by `fuse` (frame.js:448-449); internal faces at TT−12.6 (21.4 mm²) | — | **artifact A3**: a broken seam line on the seat wall and a dashed line on each M1.2 hole wall at TT−12.6 (`r_seam_1.png`, `r_seam_2.png`, `r_ucz_0.png`) | sure |
| top face | — | one degenerate triangle (area 9e-8) wound +y at u 12, v 0 | — | nit, not visible | sure |
| renders | — | `r_uc_0..7`, `r_ucb_0..7`, `r_ucz_0..5`, `r_uc6_0..2`, `s_uc.png`, `s_ucb.png`, `s_ucz.png`, `cmp_uc_boss.png`, `cmp_uc_u30.png` | — | — | — |

## lowerCock: 05 08 00-2 (`05-08/Wempe_05-08_04.jpg`)

Local frame: u along 22 → 37 from 36, w toward 23.

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bar | 20 × 8,0, 10 −0,1 deep | u ±10, w ±4, TI…TI+10 | nominal | within tol. | sure |
| axis | 32°30' from S toward W | 32.498° | 0 | match | sure |
| holes 22, 36, 37 | 7 apart, on the centre line | ±7.000 | 0 | match | sure |
| 23 | 5 along and 8,2 across from 36 | (−5.000, 8.199) | 0 | match | sure |
| lug | 10 wide, end 5 r, flush with the end at 22, 3,22 −0,04 at the far face (C-D) | u −10…0, r 5, TI+6.78…TI+10 | nominal | within tol. | sure |
| overall | 17,2 | w −4…13.2 | 0 | match | sure |
| seat | 5,2 H7 from the far face, floor 0,5 +0,03 at the plate side, 4,59 +0,012 | Ø 5.206 to TI+7.28, Ø 4.596 through | floor 0.5 (middle 0.515) | within tol. | sure |
| M1.2 | 3,5 +0,1 either side along C-D (tapped) | threaded Ø 1.24 at 3.5 | middle 3.55 | within tol. | sure |
| 36 | M2,6 through (bored 2,1) | threaded Ø 2.64 through | — | match | sure |
| pins 22, 37 | 1,585 −0,005, 2,5 deep (A-B: drill points, no sink) | Ø 1.582, 2.5 | flat floor | match | sure |
| corners | square (no radius) | square | — | match | sure |
| versions | 'first' and '1943' as 'last' (revision a only changed a tolerance) | same | — | match | sure |
| 6MX | photographs | the bar cut back to 3.3 past u 1.5 | — | photograph-based, recorded | — |
| renders | — | `r_lc_0..5`, `s_lc.png`: clean apart from the WN-53 head chamfer (A1) | — | — | — |

## intermediateBridge: 05 08 04 (`05-08/Wempe_05-08_10.jpg`, 2:1; the bridge 05 08 04-1 has no sheet)

| feature | sheet (scaled at 7.045 px/mm on the pins' 41.13) | model | verdict | sure |
|---|---|---|---|---|
| outline | 45,5 × 9,94, round ends | 45.5 × 10, r 5 | match | likely (scaled) |
| thickness | 3,83 scaled | 3.8 | match | likely |
| holes on one line, 34.13 / 41.13 apart | table | 17.065 / 20.565 either side, off-line under 0.0004 | match | sure |
| screw sinks | from the dial side: Ø 4.26, 2.1 deep (left) / 1.5 deep (right), scaled | Ø 4.7 × 2.0 (Wempe 3955 photograph) | photograph recorded; the sheet scales 4.3. Keep it, but note in the README that the sheet scales Ø 4.3 | likely |
| 38 | WN-300 bush 0,7 +0,02 under the plate-side face, a 45° mouth from the face (Ø 5.85 scaled; plan circle 6.2) | Ø 4.3 bore, mouth Ø 5.7 → 4.32 at 0.69 | match. Nit: the mouth ends at r 2.16 against the bore's 2.15, leaving a 0.01 ledge ring (level 4.04, area 0.14 mm²) | sure |
| 35 | setting, jewel 1,7 under the plate-side face | Ø 5.2 through, setting 0.2 under the face | match | likely |
| pins | WN-203 1,3 proud (the section draws them with chamfered ends) | 1.3 proud, flat ends | minor (chamfer) | likely |
| renders | — | `r_zb_0..5`, `s_zb.png`: clean apart from the WN-52 head chamfers (A1) | — | — |

## Versions

`revs.py` compares the visible meshes' boxes per version:

- 'first' and '1943' are identical to 'last' for all seven parts. This is right for most, but see the dust bush's waist above, and the click. The click's only revision (25.5.48) marks the hole's +0,03: the (a) stands by the 3,2Ø, so its outline is the same for every version.
- '3955': the dust bush is waisted (photograph) and has no cork ring.
- '6mx': the dust bush is waisted and its cork is 2.4. The upper cock has no hole 20. The lower cock's bar is cut back to 3.3. The barrel-bridge screws have domed steel heads (3108-vertex heads). The jewel at 38 differs (6MX.ch38l/jw38l).

---

## Ranked findings (wrong / missing / artifact)

1. **A1, artifact, every slotted screw head: faceted 45° chamfer.** `shared/kit.js:345-358` `headGeo`. The rim's ring cells `{loop:[...ARC[i],...ARC[i-1].reverse()], y0:top}` (kit.js:353) have a sloped top given as a function but no `strip:1`. `solidGeo` therefore triangulates them from the outline only, and chords across the 24-segment arcs come out as flat facets. The rewritten normals don't hide this; it shows as a polygon round every head.
   - Seen on WN-22 (the click screw), WN-55 (barrel bridge), WN-ucs (upper cock), WN-53 (lower cock) and WN-52 (intermediate bridge): `r_cs_0.png`, `r_cs_1.png`, `r_cs_2.png`, `r_cs_3.png`, `s_cs.png`, `r_lc_2.png`, `r_zb_0.png`.
   - Fix: add `strip:1` to those ring cells (the loop is already `[...A, ...B reversed]` with paired points). Do the same for the domed heads' rings (`dome>0`, the same line), whose y is the function `yD`.
   - This is the same fault as the upper cock's boss, and it affects every screw in the Wempe model, not only this batch.
2. **The dust bush's bottom is misread (WRONG).** frame.js:341, `lw=[…,V2(6.55,Yb-0.5),V2(6.55-0.5*Math.tan(5*D2R),Yb),…]`. 05 08 01-3's section (`db_br.png`, `db_bl.png`; `cmp_db_bottom.png`) draws:
   - the outer bottom corner chamfered (about 0.3 × 45°, scaled, not dimensioned);
   - a flat bearing ring **0,5** wide;
   - inside it, the bottom face **dished 5°** up to the bore.

   Correction from the sheet's figures, profile r over y (Yb = −23.85, "up" being −y):

   (6.55, Yb−0.3) → (6.25, Yb) → (5.75, Yb) → (rr(Yb−0.153)…, Yb−(5.75−4.004)·tan 5° = Yb−0.153) → up the bore.

   The 0.3 chamfer is scaled, so record it as an estimate. Apply the same to the WB variants (frame.js:351), unless their photographs show otherwise.
3. **The upper cock's M1.2 holes aren't tapped and their screws are thinned (WRONG).**
   - frame.js:441: `T(L(±3.525,0),0.95/2,…)`, an untapped Ø 0.95, with the boss's bite cells (frame.js:427-434, `d=3.525, rh=0.475`) built around that radius.
   - escapement.js:930: the screws carry `rs 0.46`.
   - 05 08 03-1 says M1,2 at 3,5 +0,05, as the lower cock's M1.2 are drawn (tapped `rM12`, screws `rs 0.6`, escapement.js:936).

   Correction: `T(L(±3.525,0),rM12,TT-15,TT-12.6)` (threaded through `th()`), the boss's hole radius rh 0.62 (its inner edge 2.905, so it breaks 0.095 into the Ø 6 face, as the sheet's own figures imply: 3.5 − 0.6 < 3), and the screws `rs 0.6`. Rebuild the bite cells for rh 0.62 (or cut the holes through the boss as features), and drop the "0.05 outside the face" check at frame.js:428.
4. **A2, artifact: lathe parts shade with rounded corners.** frame.js:327, 342, 352, 369, and the click screw's shoulder at 312. Raw `THREE.LatheGeometry` shares each profile corner's vertex between segments, and r128 averages the normals there. The fusee bush has 2,880 of 12,360 normals oblique, the dust bush body 146/438 and neck 292/438, and the cork ring 219/365 although its section is a rectangle. Square edges look pillowed, and the 45° sink rim shows blotchy highlights (`r_seamfb_1.png`, `r_fbo_0..2.png`, `r_dbo_0..2.png`, `r_fb_0..3.png`). Fix: a lathe helper that repeats each corner point (one vertex per adjoining segment), or computes flat normals per profile segment. The same holds wherever the Wempe uses `new THREE.LatheGeometry` (case.js 12, train.js 2, fusee.js 3, dial.js 1, escapement.js 1).
5. **A3, artifact: seams from `fuse` merging pieces with coincident internal faces.**
   - Upper cock: the arm and the boss meet at TT−12.6 (21.4 mm² internal). A broken seam line shows on the seat wall and a dashed line on each M1.2 hole wall (`r_seam_1.png`, `r_seam_2.png`, `r_ucz_0.png`).
   - Fusee bush: the spigot, the flange and the upper lathe meet at TT and TT−1.5 (34 mm² each). A dashed ring shows in the bore (`r_seamfb_0.png`).

   Edges draws the unmatched and creased edges where the hole walls are split with different segmentations. Fix:
   - Fusee bush: build it as one lathe profile (spigot, flange and top in one outline, `bore 2.26` continuous), with the flange's holes as features.
   - Upper cock: carry the seat's and the M1.2 holes' walls through the boss with the same segment count and phase as the arm's (`C(c,5.206/2)` with the arm's n, the same `ring()` call), so the wall vertices match at TT−12.6. Or remove the arm's +y face over the boss footprint.
6. **The dust bush's form, a conflict between sheets (decision).** The assembly 05 08 01 (`_02.jpg`, revised 2.11.46) draws a waisted dust bush (`p2_sec.png`, `cmp_db_assembly.png`): Ø 13.1 for about 5.4 from the flange, a 45° shoulder, a waist about Ø 10.5-10.9, a collar about 1.75-2.2, the neck carrying the cork. The photographs agree (the model's '3955' and '6mx'). 05 08 01-3 and the coloured section are straight; the model's 'last'/'first'/'1943' follow them. The code comment (frame.js:343-348) doesn't cite 05 08 01. At least add that to the comment and the README's Estimated or Unresolved sections.
7. **A4, small artifact: facets left in the boss flank.** frame.js:432-434: the `bite` and `corner` cells aren't strips, and their sloped top is a function. That leaves 18 triangles, 0.04 mm² in all, 3-12.9° off the cone, next to the M1.2 holes and at the slot corners (`r_ucz_0.png`, `r_ucz_2.png`). The fix for finding 3 should rebuild these: build them as strips between paired rails (the hole's arc paired with the R0 arc, at the same angles), or as triangle fans from the R0 arc.
8. **The click is 0.04 too thick.** frame.js:307, `y0=TT-3.32-2.6`. The sheet says 2,6 −0,03/−0,05; draw it at 2.56 (`y0=TT-3.32-2.56`), and the screw's shoulder (frame.js:311, 2.65) at 2.61.
9. **The click's length is a conflict in the sheet: 17.53 against 17,4 ±0,1.** The figures 9,7, 7,5 and 1 r force 17.53. No change; record it in the README.
10. **Minor: missing small features.**
    - The steady pins' chamfered ends (05 08 05 and 05 08 04 draw them; WN-203 is flat, frame.js:289, 453, 474, 496).
    - The dust bush's corner radii at the neck and collar (undimensioned).
    - Drill-point floors in the blind pin holes (all flat).
11. **Nits.**
    - A 0.01 ledge at the bottom of the intermediate bridge's mouth at 38 (frame.js:493: `q:C(H[38],2.16)` against the bore's 2.15; use 2.15).
    - A degenerate triangle on the upper cock's top face at u 12.
    - The stud screw's place: U30 (the lever cock) draws its hole 5 back and 4.2 out, against the model's 4.1 / 4.35. That's for batch 3 to judge against 05 03 02-3.
    - The click's angle (`_12` about 17°, the model 23.3° from the photograph).
    - The intermediate bridge's sinks: the sheet scales Ø 4.3, the model has the photograph's 4.7.

Verified correct after the rebuild, as asked:

- The upper cock's relief step: r 11.2 → 12 at 45°, the 12 at the full underside's corner, built as a strip, normals within 1.4°.
- Its boss: face Ø 6 at 3.2, 45° flank to Ø 7.6, smooth apart from the 18 small facets in A4.
- The click's outline: the beak, the hollow r 6, the back r 12.5 through the corner and tangent to the nose r 1, with no sliver and no nick.

Not this batch, but met: `References/wempe/drawings/Index.md`'s screw table (M2.0, M1.7, M1.4 for these bridges and cocks; pins Ø 1.2/1.0) contradicts the sheets (M2.6 tapped, 2.8 clear, pins 1.585). Treat Index.md as unreliable.

## Sheets reviewed

- 05-08/Wempe_05-08_14.jpg — 05 08 05-2 Sperrkegel — every outline figure (3,5, 85°, 6 r with 5,142/7,212, 9,7, 7,5, 1 r, 12,5 r, Ø 5,7, 17,4), thickness 2,6, hole 3,2; the back arc refitted from the sheet's pixels; against the click's built outline and renders
- 05-08/Wempe_05-08_12.jpg — 05 08 05 Federhausbrücke kompl. — the click's place and handedness on the bridge, pins 1,3 proud with chamfered ends, the side view
- 05-08/Wempe_05-08_13.jpg — 05 08 05-1 Federhausbrücke — outline (7, 7,7, 24, 5, 150°, 73,5), thickness 3,32, the hole table, r 37/39 positions, pin holes 2,5 with 0,3 × 90° sink (side view at 12×)
- 05-08/Wempe_05-08_08.jpg — 05 08 01-2 Schneckenfutter — every dimension (T6/g6 fits, 1:70, 7,96, 2,9, 1,5, 7,1, Ø 13,2, 10,4, 1,5/2,2 sinks, 4,1 bore, Ø 7 at 45°)
- 05-08/Wempe_05-08_09.jpg — 05 08 01-3 Staubfutter — every dimension, the mouth 20°/1,8/(7,62), the bottom's 5°, 0,5 and corner chamfer (12×), the collar with its flat 14,1
- 05-08/Wempe_05-08_02.jpg — 05 08 01 Oberplatte kompl. — Schnitt A-B's fusee bush, dust bush (waisted) and cork ring 05 08 01-4; the WN-34 screws' direction
- 05-08/Wempe_05-08_05.jpg — 05 08 03-1 Unruhkloben oben — position view (15°, holes), plan (17, 49, 16,5, 26,5, ≈5,5, 4,5, 22 ±0,1, slot 1,8/0,9/3,4, M1,2 3,5, 6 r), Schnitt A-B (15, 3,2, 2,5, 0,2 × 90°, 45° step at 12 r, 0,8, seat 5,2/6Ø/3,2 ±0,02), Schnitt C-D (82°, boss flanks)
- 05-08/Wempe_05-08_06.jpg — 127-556.04 U30 Unruhkloben oben kompl. — arm 2,4/0,8, step corner at 12, boss flank 45° (Ø 7.8 → 5.8), settings 0,1/1,4/1,4/0,5, slot 1,8, M1.2 at 3,5, the stud hole (5/4,2), pins 1,3 proud
- 05-08/Wempe_05-08_04.jpg — 05 08 00-2 Unruhkloben unten — every dimension (20 × 8 × 10, lug 10 / 5 r / 3,22, 17,2, seat 5,2 H7 / 0,5 / 4,59, M1,2 3,5 +0,1, 32°30', 7/7/5/8,2, pins 2,5 with drill points)
- 05-08/Wempe_05-08_10.jpg — 05 08 04 Zwischenbrücke kompl. — outline and thickness (scaled), holes, screw sinks, the 0,7 +0,02 mouth at 38, the 1,7 at 35, pins 1,3
- 05-08/Wempe_05-08_33.jpg — 127-556.04 U31 Unruhkloben unten kompl. (lever chronometer) — looked at for the lower cock; a different part (the lever's), nothing applies to the detent model's cock
- Wempe_Einheitschronometer.jpg — coloured section — the dust bush (straight body) and the cork ring's height, Ø and place (`col_dust.png`)

## Sheets not reviewed

- 05-08/Wempe_05-08_01a.jpg and 05-08/Wempe_05-08_01b.jpg — 05 09 01 Oberplatte (hole table, plan) — give the places of holes 6, 8, 9, 20, 41, 42, 45-48, 50 and the fusee bush's M1.4; batch 1's (the top plate). I took the coordinates from WD.H, which they feed.
- 05-08/Wempe_05-08_03a.jpg and 05-08/Wempe_05-08_03b.jpg — 05 08 02-1 Unterplatte — give holes 28, 29, 35, 38, 43, 44 for the intermediate bridge; batch 1's. Checked only through WD.H (holes collinear to 0.0004).
- 05-08/Wempe_05-08_32-2.jpg — 05 08 02 Unterplatte kompl. — may show the intermediate bridge's seat on the plate; batch 1's, not opened.
- 05-08/Wempe_05-08_30.jpg, 05-08/Wempe_05-08_31.jpg and 05-08/Wempe_05-08_32-1.jpg — the lever chronometer's plates — not relevant to these parts.
- References/wempe/drawings/Index.md (read: its screw and pin table contradicts the sheets) and Missing_details.md (read: the list of these sheets) — text, not drawings.
