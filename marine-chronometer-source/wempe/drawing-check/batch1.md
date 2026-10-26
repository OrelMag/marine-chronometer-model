# Batch 1: the frame (topPlate, pillarPlate, pillars, ring) against their sheets

Read-only audit, 26 October 2026, worktree `wempe-artifacts` (frame.js with the other session's uncommitted cock/click edits; my parts' code untouched by them).
Scratch: `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\b1\` (written `b1\` below).

Method: every sheet viewed and cropped (`b1\crops\*.png`); the built solids dumped from the page per version (`b1\dump.py` → `dump_{last,first,1943,6mx,3955}.json`, movement frame), sliced at many heights and every loop circle-fitted (`b1\geo.py`, `holes_at.py`, `tp2.py`, `pp.py`); the plates' outlines overlaid on the sheets' plans through a similarity fitted on 7-11 hole centres (03b: 0.3-1.2 px residual, about 0.1 mm; 01b local fit 0.6-7 px, the scan is warped) (`b1\ov_01b_*.png`, `b1\ov_03b_*.png`); renders by isolate.py (`b1\renders\`).

**Versions:** for all four parts the drawings' three versions (last, first, 1943) are byte-identical solids (hashes equal). 3955 differs in the pillar plate (rim notch) and the ring (groove); 6MX in pillar 39's place, plates' holes and ring screws (photo-based, not on any sheet; not judged here beyond the artifacts).

## topPlate (Oberplatte 05 09 01 = 05-08_01a/01b; kompl. 05 08 01 = 05-08_02)

| feature | sheet (text, where) | model (measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| Ø | 85 h6 (01a note) | rim r 42.4945 → Ø84.989 | h6 middle | match | sure |
| thickness | 3,35 (01a "Fertigmaß") | y −22.35…−19.00 = 3.35 | 0 | match | sure |
| barrel cut | 42,5 Ø about 45 (01b note) | cut r 21.250 about H45 | 0 | match | sure |
| horn tips | 01b: sharp; 05 08 01 (02): both tips rounded r≈0.8-1.0 (crops\02_horn.png, 02_horn2.png); Wempe 3955 r≈0.3 (crops\3955_horns.png) | sharp, but upper tip 0.195 mm short of the true crossing, last chord up to 0.089 outside the cut circle; lower 0.033 off | — | ARTIFACT + rounding missing | sure (geometry), likely (radius) |
| 1, 35, 38 | 4,59 +0,012 | Ø4.596 through | mid | match | sure |
| 3, 12, 40 | 3,50 +0,012 | 3.506 | mid | match | sure |
| 4 | drill 0,9 | 0.900; plus Ø4.3 spherical oil sink on the outer face (2 cones) | sink not on sheet | extra, recorded (3955 photo) – holds | likely |
| 5 | M1,7 | tapped 1.736 major | — | match | sure |
| 6, 9, 41, 47, 50 | 1,6025; A-B: Ø2,5 from the inner face 1,6 deep, floor a drill point | 1.602; Ø2.498 to 1.6 from inner face, FLAT floor | cone missing | MISSING (minor) | likely |
| 22, 37 | 1,6025; C-D: Ø2,5 from the outer ("oben") face 1,6 deep, drill-point floor | 1.602 / 2.5 from outer face to 1.6, flat floor | cone missing | MISSING (minor) | likely |
| 7 | 1,6 +0,009 | 1.609 | upper limit (mid 1.6045) | within tol. | sure |
| 8, 42, 48 | M2,6 | tapped, 2.637 major | — | match | sure |
| 10 | 8,0 +0,015 | 8.007 | mid | match | sure |
| 10's three M1,4 | r 5,2 ±0,05, 120°, first toward N (01b) | at r 5.2, bearings 0/120/240, tapped to the J-K floor | 0 | match | sure |
| J-K recess round 10 | "22 Ø", 0,7, 45° (01a); 01b hidden circle Ø≈21.8-22.3 (fitted, ratio to the 8.0 bore) | floor Ø22.0 at 0.7, wall 45° to Ø23.4 at the face | — | within reading | likely |
| 11, 39, 49 | 4,50 +0,012; L-M Ø8,6 × 0,3 +0,03 in the inner face | 4.506; seat Ø8.600 × 0.30 | depth at lower limit (mid 0.315) | within tol. | sure |
| 13 | drill 1,8 | 1.800 | 0 | match | sure |
| 23 opening | 5 r (= 10,0 punch), tongue 2,5 wide, "50°" | Ø10.000, tongue 2.5, overlay coincides with the drawn outline (ov_01b_tongue.png) | <0.1 | match | sure |
| tongue end | round | r 1.249 polygon of ~18 sides, flat shaded | — | ARTIFACT (banding, renders\tp_5.png, tp_4.png) | sure |
| pocket N-O | 1,35 −0,05 deep in the inner face, to 51 with end "4 r", dashed tangent edges (01b) | 1.35 deep, r 4 about 51, edges overlay the dashed lines (ov_01b_23loc.png) | depth upper limit (mid 1.325) | match/within tol. | sure |
| 26 | table: 2,3 drill, 2,5 +0,009; P-Q: 4,5 H7 from the outer face 0,5 +0,03, 5,2 H7 to the inner face (revision a mark on 4,5) | 4.506 × 0.50, then 5.206 | P-Q followed; 0.5 at lower limit | match (to P-Q) | sure (P-Q), open (revision text) |
| 26's two M1,2 | 3,5 +0,05 on the O-W line | at 3.500 | lower limit (mid 3.525; the upper cock's own M1.2 at 3.525) | within tol. | sure |
| 36 | drill 2,8; G-H Ø6 H7 × 1,8 from the outer face | 2.800; 6.012 × 1.8 | 0 | match | sure |
| 51, 52 | M2 | tapped 2.037 major; 51 runs into the pocket | — | match | sure |
| 53 | 1,5 H7 | 1.5045 | mid | match | sure |
| 45 | 4,4 punch (inside the 42,5 cut) | cut away | — | match | sure |
| detent block pins | not on sheet | Ø0.925 + Ø1.4 countersink | — | extra, recorded (3955 photo) | holds |
| hole centres | table | every plain hole at its table place to 0.0 µm (tapped holes fit 0.10-0.13 off: helix, not a misplacement) | 0 | match | sure |

## pillarPlate (Unterplatte 05 08 02-1 = 05-08_03a/03b; kompl. 05 08 02 = 05-08_32-2)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| Ø, thickness | 85 h6; 3,35 ±0,02 (struck, replacement illegible) | 84.989; 3.35 | — | match / likely | likely |
| 1 | 4,59 +0,012 | 4.596 | mid | match | sure |
| 2, 3, 12, 18, 19, 40 | 3,50 +0,012 | 3.506 | mid | match | sure |
| 4 | 0,9 | 0.900 | 0 | match | sure |
| 10 | 2,70 ±0,009 | 2.820 | +0.12 | WRONG vs sheet, recorded departure (fusee pivot 2.8 at its shoulder on 05 06 04-1; README Unresolved) – holds | sure |
| 11, 39, 49 | 4,50 +0,012; E-F Ø8,6 × 0,3 +0,03 | 4.506; 8.600 × 0.30 | — | match | sure |
| 14, 15 / 16, 17 | drill 1,45 / 2,8 (struck, "nur wenn Zeigerstellung") | 1.450 / 2.800 | — | match (3955 drilled) | sure |
| 23 | punch 4,4; plan "7 Ø" (drawn 7.03 on the fit) | 7.000 | 0 | match (plan) | sure |
| 26 | 2,50 ±0,009; two M1,2 3,5 +0,05 on the 37° line | 2.500; M1.2 at 3.5 on 37° (overlay coincides); + Ø4.6 × 0.25 seat on the dial face | seat not on sheet | extra, recorded (3955) | sure |
| 28, 43 | M2,6 | tapped | — | match | sure |
| 29, 44 | 1,6025; A-B Ø2,5 × 1,6 from the inner face ("oben"), drill-point floor (crops\03b_AB.png) | 1.602; Ø2.5 × 1.6 flat floor | cone missing | MISSING (minor) | likely |
| 30 | table 2,50 ±0,009; G-H Ø5,2 H7 from the inner face to 0,5 above the dial face, Ø4,59 H7 through; plan: a hidden circle Ø≈5.8 round the Ø5.2 (crops\03b_30.png) | 5.206 / 4.596 × 0.5; M1.2 at ±3.5 | hidden Ø5.8 not modelled | open reading | unsure |
| 35 | punch 6,0, joined to 38's opening | Ø6.0 notch on the 24.5 | 0 | match (ov_03b_38.png) | sure |
| 38 opening | "vor dem Kalibrieren auf 24,5 fräsen" | Ø24.500, overlay on the drawn circle | 0 | match | sure |
| 45 | 2,90 ±0,009 | 2.900 | 0 | match | sure |
| hand-setting window | 6,5 × 6,5 (03b), 8,3 −0,1 from rim; C-D 12 +0,2, ends Ø14 arcs, "9,3 −0,1"; bore Ø2 at 1,68 from the dial face to the rim (03a C-D, dashed in plan) | dial face u 27.745-34.245 (6.5), outer edge 8.25 from rim, ±3.25; inner face ±6.05 (12.1); ends 6 chords; **no Ø2 bore** | bore missing | MISSING (bore); ARTIFACT (ends faceted, renders\pp_4.png) | sure |
| "9,5" in 03a's partial plan | 9,5 across the cut (crops\03a_95.png) | not used by the model | — | open reading | unsure |
| WN-302 at 1 | 0,1 +0,02 under the inner face (32-2) | y 0.10 | lower limit | within tol. | sure |
| studs (32-2) | up-and-down 12,3 from the inner face; change-wheel 6,8 beyond the dial face | 050200-6 y 0-12.30; 050200-7 top 10.15 = 3.35 + 6.80 | 0 | match | sure |
| pin notch at 6 | ring sheet "1", drilled at assembly | semicircle r 0.5 on the rim | — | match | sure |

## pillars (Pfeiler 05 08 00-1 = 05-08_11)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| body Ø | 8,1 −0,2 | 8.100 | upper limit (mid 8.0) | within tol. | likely (reading) |
| shoulders apart | 19,6 ±0,01 | 19.600 | 0 | match | sure |
| overall | 25,3 −0,2 | 25.200 | mid | match | sure |
| spigot | 4,5 f7, 2,8 −0,1 | Ø4.484, 2.80 | Ø mid; length upper limit | match / within tol. | sure |
| spigot end | Ø4,3 −0,2, 1,1 −0,2, 6° | Ø4.300 over 1.10 → 4.8° | angle 1.2° under the drawn 6° (the figures at their upper limits) | within tol. | likely |
| thread | M2,6 tapped from both ends | inside thread minor Ø2.11, major 2.60, through | — | match | sure |
| countersink | 90° at each end, from ≈Ø2.6 (scaled 2.59 at 5:1) to the tap drill, ≈0.25 deep (crops\11_top.png) | Ø2.69 at the face → Ø2.64 at 0.03 deep, then the thread's run-out (r 1.30 → 1.055 over 0.05-0.5) | cone 0.03 deep, not 0.25 | WRONG (minor) | likely |
| relief groove | half-round in each shoulder round the spigot root (drawn ≈1.0 wide, ≈0.4 deep at 5:1) | r 2.242-3.25, 0.35 deep | — | match | likely |
| places | 11, 39, 49 on r 37 | (−36.858, 3.225), (18.5, 32.043), (6.425, −36.437) | 0 | match | sure |

## ring (Werkring 05 08 00-3 = 05-08_07, revised 6.12.46)

| feature | sheet | model (slices) | diff | verdict | sure |
|---|---|---|---|---|---|
| outside | 105,95 −0,1 | 105.950 | upper limit (mid 105.90) | within tol. | sure |
| recess | 104 +0,1, 0,7 +0,1 deep | 104.000 × 0.70 | lower limits | within tol. | sure |
| cone | 45°, 93 Ø (+0,3?) at the recess floor | Ø93.0 at 10.35 down to Ø83 at 5.35, one 45° cone | — | match | likely |
| lip | 83 Ø | 83.000, 3.35-5.35 | — | match (2.0 lip height estimated) | likely |
| plate seat | 85 H9 +0,035, 3 +0,1 | 85.017 × 3.00 | depth lower limit | within tol. | sure |
| band | 96 Ø (−0,3?) | 96.000 | — | within reading | unsure (tol.) |
| flange / overall | 4,7; 10,7 −0,1; 7 −0,1 | 4.70; 10.70; 7.00 | upper limits | within tol. | sure |
| M2,6 ×3 | Ø89, 120°, 20° from 12 (seen from the dial) | r 44.5 at 20°, 140°, 260°; through the band, on through the flange into the cone (3955 photo; coloured section draws them blind with a drill point, crops\col_ring.png) | — | match; departure recorded | sure |
| dial pin hole | r 50,5, 6° from 12, Ø1,1, drilled at assembly | Ø1.10 at r 50.50, 6.0°, through the flange | 0 | match | sure |
| plate pin hole | "1" at 6 o'clock across the joint | Ø1 (band hole + plate notch), pin WN-201 | — | match | sure |
| radial pin hole | plan: dashed pair "1,6" at 12; section: ⊙ 2,8 under the top face; coloured section: dashed hole across the flange | pin WN-202 Ø1.6 at y 8.25 (2.8 under 11.05), r 45.3-54.75, **in solid metal, no hole** | hole missing | MISSING | sure |
| outer top corner | square (crops\07_L.png) | square | — | match | likely |

## Ranked findings (WRONG / MISSING / ARTIFACT)

1. **MISSING – ring: the radial hole for the case pin WN-202.** 05 08 00-3 (05-08/Wempe_05-08_07.jpg) plan: a dashed pair across the ring at 12 o'clock figured "1,6"; its section: the hole end-on (⊙) "2,8" under the top face; the coloured section (Wempe_Einheitschronometer.jpg, crops\col_ring.png) draws it dashed right across the flange from the cone to the outside. Model: frame.js:263 places the Ø1.6 pin from r 45.3 to 54.75 at y 8.25 inside solid metal ("its hole across the turned flange not cut (estimated)", frame.js:261-262); render renders\ring3955_0.png shows the pin coming out of an unbroken face. Correction: cut it as FLC cuts the screw holes (frame.js:244): `WFUSEE.capFix(WFUSEE.bore(g,[0,8.25,-45.0],[0,0,-1],0,0.3,…,C-outline Ø1.6),null)` on each version's flange (radially outward at 12 = −z, from inside the cone's face r ≈44.4 at that height to past r 52.975), Ø1.6 (press fit for the Ø1.6 pin; drawn at 1.6 the pin and hole coincide — use 1.6 for the hole and keep the pin r 0.8 as fine.py's expected contact, or the hole 1.61).
2. **MISSING – pillarPlate: the hand-setting bore Ø2.** 05 08 02-1 sheet a (05-08/Wempe_05-08_03a.jpg, crops\03a_CD.png): Schnitt C-D a circle "2" at "1,68" from the dial face; the partial plan dashes it from the window's outer wall to the rim. Model: frame.js:155-156 leaves it out because "solidGeo can't cut across the plate" — no longer true: WFUSEE.bore cuts along any axis (used since 25 October for the ring, frame.js:244). Correction: bore Ø2.0 along `eu` (H[18]'s direction, 30.0° below O toward S) at t 0, y = PPT − 1.68 = 1.67, from u = 34.245 (the window's outer wall at the dial face; at mid-height the wall is the same, the window's outer edge being vertical) to u = 43 (out through the rim), in the versions with the cut (not 6mx); in 3955 it opens into the rim notch (its mouth seen on 8_Wempe_3955_Räderwerk_plus.jpg, as the comment says).
3. **ARTIFACT – topPlate: crescent horn tips.** kit.js:15-26 `subtractCircle` keeps the last 0.25-mm-dense rim point outside the cut and joins it to the cut's arc by a straight chord, never inserting the exact crossing. Measured on the solid: upper horn tip at (41.971, 6.648), 0.195 mm from the true crossing (42.0014, 6.4549), the chord up to 0.089 outside r 21.25 (a flat facet on the tip: renders\tp_7.png); lower tip (34.379, −24.978), 0.033 from (34.3984, −24.9506) (renders\tp_8.png). The sheets: 01b (1943, 4:1) draws sharp points; 05 08 01 (05-08/Wempe_05-08_02.jpg, revised 2.11.46, 2:1) draws both tips rounded r ≈ 0.8-1.0 (scaled, crops\02_horn.png, 02_horn2.png); Wempe 3955 (12_Wempe_3955_obere_Platte_oben.jpg) shows them blunt, r ≈ 0.3 (crops\3955_horns.png). Correction: build the outline from the exact crossings (rim arc the long way from P1 to P2, then the r 21.25 arc about H45 back), and round each tip with a fillet tangent to both circles, r 0.3 (photograph; 05 08 01's ≈1 scaled from a 2:1 assembly: estimated). Fix subtractCircle itself (insert the crossing point by bisection on the dense edge) and recheck its other callers.
4. **ARTIFACT – pillarPlate: the hand-setting window's Ø14 hollow ends** are six nested chords (frame.js:162-165, `K=6`): six flat bands on each end wall (renders\pp_4.png). Correction: K ≥ 24 (chords ≤ 0.15 high), or cut each end as a true r 7 cylinder (a WFUSEE.bore along `eu` with a circle outline r 7 about (t = Ct, y = Cy)).
5. **ARTIFACT – ring (3955 only): the hand-setting groove** (frame.js:209-234): nicks where the round floor meets the straight sides at the lip level (y 3.35), dark specks along the strip seams of the floor and a floor banded in 12 strips a side (renders\ring3955_1.png); kinked lip opening edge (renders\ring3955_2.png). Not on any sheet (3955 photo). Correction: cut the groove as one swept solid (a WFUSEE.bore along `eu` with its profile r 4.565 about y 1.54 plus the straight sides) instead of strip cells, or share the y 3.35 edge points between the band and lip cells and add strips.
6. **ARTIFACT – ring: the M2.6 holes through the flange** (FLC, frame.js:244): 24-flat polygon and the 0.005 oversize step 0.3 up each hole, visible as a dotted seam ring (renders\ring_5.png). Correction: more flats (≥48) for these holes and the band's, and remove the step by fixing the coplanar-wall case in the bore rather than oversizing.
7. **WRONG (minor) – pillars: the 90° countersinks.** 05 08 00-1 (05-08/Wempe_05-08_11.jpg, crops\11_top.png): a 90° countersink at each end, from ≈Ø2.6 at the face down to the tap drill. Model (frame.js:183-185, dims.js `cs:2.7/2`, `rb=S.rs+0.02`): the cone runs from Ø2.70 to Ø2.64, 0.03 deep (sliced: r 1.345 / 1.330 / 1.307 at 0.005 / 0.02 / 0.05), then the thread's run-out (renders\pil_1.png shows a flat ring, no countersink). Correction: end the countersink at the thread's minor radius: profile `V2(1.35,e0)` → `V2(1.055,e0+0.295)` (cd = cs − r_minor), thread from there (and the same at e1).
8. **ARTIFACT – topPlate: the balance opening's tongue end** (r 1.25, about 18 facets, flat-shaded: renders\tp_5.png, tp_4.png; KIT.stadiumPts at frame.js:105). Same flat shading shows on every solidGeo bore wall in close-ups (tp_4.png's opening, ring_7/pp_7 notch r 0.5 of 16 facets, pin WN-202 of 16 sides in ring3955_0.png). Correction: ≥48 points per semicircle for the tongue, the pin notch (frame.js:136, `C(pinAt,0.5,32,0.5)` → 96) and WN-202 (`cylBetween(...,16)` → 48), or smooth normals across small facet angles in solidGeo.
9. **MISSING (minor) – both plates: drill-point floors of the Ø2.5 counterbores** for the steady pins (01b Schnitt A-B for 6, 9, 41, 47, 50 and C-D for 22, 37; 03b Schnitt A-B for 29, 44: all three draw the Ø2.5 ending in a cone into the Ø1.6). Model flat (frame.js:86, 87, 142). Correction: a cone from r 1.25 at 1.6 deep to r 0.80 (118° point: 0.27 long), as hole 4's sink is built with `q`.
10. **Within tolerance but at a limit** (against the file's own rule, "holes are drawn at the middle of their fits", frame.js:8): ring 105.95 (−0.1), 104.00 (+0.1), 0.70 (+0.1), 10.70 (−0.1), 3.00 (+0.1), 7.00 (−0.1); pillar body 8.10 (−0.2), spigot 2.80 (−0.1), end Ø4.30/1.10 (−0.2 each, so its lead 4.8° against the drawn 6°: Ø4.25 at the end for 6° over 1.1); top plate hole 7 1.609 (+0.009), 26's M1.2 at 3.500 (+0.05; the upper cock's at 3.525), the pocket 1.35 (−0.05), pillar seats 0.30 (+0.03), P-Q floor 0.50 (+0.03). Correction if the rule is to hold: their middles (105.90, 104.05, 0.75, 10.65, 3.05, 6.95; 8.0, 2.75, 4.2/1.0; 1.6045, 3.525, 1.325, 0.315, 0.515), checking fine.py for the seat/lip stack.

## Departures recorded in the code, judged

- Pillar plate hole 10 at Ø2.82 against 2,70 ±0,009 (frame.js:131-132): holds (05 06 04-1's pivot is 2.8 at its shoulder; a conflict between sheets, in README Unresolved).
- Top plate hole 4's Ø4.3 oil sink, the detent block pins' countersinks, the pillar plate's Ø4.6 × 0.25 endstone seat at 26, holes 14-18 drilled though struck: from Wempe 3955's photographs; hold.
- Ring M2.6 holes carried through the flange into the cone (3955 dial side) against the coloured section's blind holes with drill points: photograph decides; holds.
- P-Q at 26 (setting seat) used over the table's 2,5 +0,009 pivot hole: holds (the section is the revised state, circled "a").

## Open readings (no change proposed)

- 01a revision a "6,15 in 4,59" (or similar; crops\01a_rev.png) with its circled mark on P-Q's "4,5 Ø H7" (crops\01b_revmark.png): if the revised bore is 4,59 it should be 4.596 like holes 1, 35, 38, not 4.506; and the first-drawn state's old figure is unknown (the 'first' version shows the revised P-Q). 01b's fit table lists 6, 1,5 and 5,2 H7 but no 4,5 H7.
- 03b hole 30: a hidden circle Ø≈5.8 drawn round the Ø5.2 bore (crops\03b_30.png), not in G-H.
- 03a partial plan "9,5" across the hand-setting cut (crops\03a_95.png): not accounted for by the model's window.
- J-K: whether "22 Ø" is the floor or the face (model: floor 22, face 23.4); 01b's single hidden circle fits Ø21.8-22.3.

## Renders and overlays

`b1\renders\`: tp_0-8 (topPlate: plan both faces, obliques, opening both sides, J-K recess, both horns), pp_0-7 (pillarPlate: plan both faces, obliques, window both sides, 38 opening, pin notch), pil_0-4 (pillar end, shoulder), ring_0-7 and ring3955_0-5 (ring: plan, obliques, flange hole in the cone, radial pin, 3955 groove, dial pin hole), r_iso_*.png sheets. `b1\ov_01b_*.png`, `b1\ov_03b_*.png`: the model's outline (red outer/inner face, green the other face or mid-depth) on the sheets.

## Sheets reviewed

- 05-08/Wempe_05-08_01a.jpg — 05 09 01 Oberplatte (sheet a) — hole table row by row against the solid's holes, Schnitt J-K (recess round 10), Schnitt L-M (pillar seats), notes (85 h6, 3,35), revision a text
- 05-08/Wempe_05-08_01b.jpg — 05 09 01 Oberplatte (sheet b) — plan overlaid on the solid (barrel cut, opening 23 and tongue, pocket N-O, every hole), Schnitte A-B, C-D, G-H, N-O, P-Q, fit table, 10's M1,4 pattern
- 05-08/Wempe_05-08_02.jpg — 05 08 01 Oberplatte kompl. — outline and horn tips (rounded), parts on the plate (05 08 01-5 stop pin, WN-300/301)
- 05-08/Wempe_05-08_03a.jpg — 05 08 02-1 Unterplatte (sheet a) — hole table, Schnitt E-F (pillar seats), Schnitt C-D and partial plan (hand-setting cut, Ø2 bore, 12 +0,2, 14 Ø, 9,3, 9,5), struck thickness note
- 05-08/Wempe_05-08_03b.jpg — 05 08 02-1 Unterplatte (sheet b) — plan overlaid on the solid (38/35 opening, 23 Ø7, 26 and 30 with their M1,2, window 6,5/6,5/8,3, 37° line), Schnitte A-B, G-H
- 05-08/Wempe_05-08_07.jpg — 05 08 00-3 Werkring — section (every diameter, height, cone, recess, seat) and plan (M2,6 on 89 at 20°/120°, dial pin hole r 50,5 6° Ø1,1, radial hole 1,6 at 12, plate pin "1")
- 05-08/Wempe_05-08_11.jpg — 05 08 00-1 Pfeiler — body, spigots and their 6° ends, 19,6, 25,3, countersinks, relief grooves, thread
- 05-08/Wempe_05-08_32-2.jpg — 05 08 02 Unterplatte kompl. — Schnitt A-B: studs 12,3 and 6,8, WN-302 0,1 +0,02, bushes 05 08 02-2
- 001-002/Wempe_001.jpg — Federchronometer general arrangement — Platten Ø 85, innerer Plattenabstand 19
- Wempe_Einheitschronometer.jpg — coloured section — ring profile, ring screws' holes (blind, drill point), radial pin WN-202 in its hole, plate in its seat, pillar and its screws

## Sheets not reviewed

- 05-08/Wempe_05-08_30.jpg — 127-556.04-137 Oberplatte (lever chronometer) — same plate and coordinates, but the lever version (not modelled); its coordinates' agreement taken from the transcription's cross-check, not re-read
- 05-08/Wempe_05-08_31.jpg — 127-556.04 U35 Oberplatte kompl. (lever) — lever version, not modelled
- 05-08/Wempe_05-08_32-1.jpg — 127-556.04 U36 Unterplatte kompl. (lever) — lever version, not modelled
- 001-002/Wempe_002.jpg — Ankerchronometer general arrangement — opened; lever chronometer, not compared
- (Index.md and Missing_details.md in drawings/ are back-calculated notes, not sheets; Index.md's "pillar screws M2.5 × Ø5.0" contradicts the M2,6 of 05 08 00-1 and is not a source)
