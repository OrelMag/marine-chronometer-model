# Batch 8: the going train against its sheets (26 October 2026)

I worked read-only in the `claude/wempe-artifacts` worktree at HEAD 6bd32120. Nothing in the repository was edited or committed.

**How I measured.**
- **The solids.** `b8/dump8.py` dumps every mesh of `centreWheel`, `intermediateWheel` and `secondsWheel` in all five versions, each in its own arbor's turning frame (axis at the origin, u up from the train-side shoulder). It also dumps the bearings (WN-301, WN-300.t38/.t35/.zb, WN-302, 050504-1/-2, the 6MX chatons, the stud bushes) in the movement frame. Output: `b8/dump8.json`.
- **The analysis.**
  - `b8/an8.py`: each lathe's profile, (r, y) by level, and the triangles whose vertex normals stand more than 25° off their face.
  - `b8/gear8.py`: tip, root, rim, hub and bore radii and thicknesses off the extrusions.
  - `b8/bear8.py`: the bearings' profiles.
  - `b8/esc.py`: the escape pinion's, bridge's and lower cock's extents, for clearances.
- **Sheet readings.** Crops are in `b8/crops/`, at 2× to 12×. Column and row pixel scans (`b8/cols.py` and inline scans) placed each line on the sheets to ±1 px: 17-17.6 px/mm on the 5:1 sheets, 12.1 px/mm on 04 05.
- **Renders.** `b8/render.py` (isolate.py's FREEZE and KEEP, GPU) wrote `r_side_*`, `r_cwz_*`, `r_twz_*`, `r_swz_*`, `r_zb_*` and `r_tp_*`.

All paths are under `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\1a72bbf4-707d-45cb-a13b-d9a6680ebba7\scratchpad\oq\drawing-check\`. Code references are to `marine-chronometer-source/wempe/js/train.js`.

Frame: dial side +y. The top plate's inner face is at TI = −19; the pillar plate runs from 0 to 3.35; the intermediate bridge runs from 3.35 to 7.15. The arbors' train-side shoulders sit at −18.965 (centre), −18.97 (intermediate) and −18.975 (seconds). The places agree with the sheet: centre to intermediate 18.120, intermediate to seconds 12.630, against 04 05's 18,12 and 12,63.

---

## centreWheel: 05 05 03 (`_08`, 1943), 05 05 03-1 (`_09`), 05 05 03-2 (`_10`, 1940), 04 05 (`_01`)

| feature | sheet | model (how measured) | diff | verdict | sure |
|---|---|---|---|---|---|
| train pivot | Ø 1,2 −0,02, 3 long (05 05 03); 5,1 −0,2 with a centre (the blank, 05 05 03-2) | Ø 1.19 → 1.157 over 2.65, rounded end, 3.0 | 0 | match (taking the kompl.'s 3, as recorded) | sure |
| pivot taper | "Kegel 1:?0", re-inked as 1:90 | 1:90 | — | recorded reading | likely |
| train shoulder | a **30° cone over the whole shoulder**, from the arbor's Ø 2,5 down to the pivot's root (05 05 03-2 at 4×, `s10_bot.png`: about 0.6 radial × 0.32 axial; the 30° drawn from the shoulder line). The 17,2 / 19 / 23 / 51 are measured from the cone's small end | flat shoulder from r 0.595 to 1.10, then a 0.15 × 30° chamfer (train.js:99, `C30` at :45) | form | **WRONG** (W3) | likely |
| arbor | Ø 2,5 | r 1.250 | 0 | match | sure |
| pinion | z 14, m 0,4356, d 6,098, tip 6,79 −0,02, root 4,24, 4 −0,1 long, its end 17,2 +0,05 | 14, tip r 3.390, root r 2.120, 13.275-17.225 (3.95) | 0 | match | sure |
| leaf form | end view: radial flanks, a **semicircular** end (r ≈ 0.25, leaf about 0.51 wide) | gearOutline's leaf (0.457 on the pitch circle), its round end stretched 1.49× radially to the tip: a half-ellipse | form | minor (within drawing accuracy on width; the tip shape differs) | likely |
| seat | Ø 5,4 n6 (framed) | r 2.700 (nominal, as the wheel's bore; n6's middle 5.412) | −0.012 | within tolerance | sure |
| seat + collar | 1,6 −0,1 from the pinion's end to the collar's top (the 1,6's arrows at rows 367 and 332) | 1.805 (17.225 → 19.03) | +0.2 | recorded Unresolved (README:591); the framed 19 wins | sure |
| collar top | 19 +0,05 framed: its arrow tip is at row 332, the collar's top, the same line as the 1,6's upper end (pixel scan on `_10`) | 19.03 | 0 | match | sure |
| V groove and flare | 05 05 03-2 at 8× | groove 0.99 deep to Ø 2.44, wall at 34°, the flare Ø 3.2 at the top | — | match (the earlier measurement stands) | likely |
| wheel | z 90, D 33,10, dg 30,86, d 31,976, l 0,52, M 0,355 | tip r 16.549, root r 15.430, l by construction | 0 | match | sure |
| wheel thickness | 1,3 −0,1 (Messingblech 1,5) | 1.25 | — | within tolerance | sure |
| spokes / hub / rim / hole | 5 × 1,7 −0,2, hub 10,6 −0,2, rim 28,1 +0,2, 5,4 H7 | 1.6, r 5.25, r 14.10, r 2.70; corners sharp as drawn | 0 | match | sure |
| **hub boss** | Column scans of 05 05 03 at 16.9 px/mm: the rim (x 50-90) and the hub (x 240-410) lie between the same rows (415/417 to 436/441). **No raised hub is drawn.** The "0,2" is the riveted lip standing proud of the wheel's dial face (the flared trapezoid over the wheel, `s8_hub.png`). The "10∅"'s extension lines rise from the wheel's **pinion-side** face at r 5.1, the hub's outline (10,6 −0,2) | a Ø 10 ring 0.25 proud of the rim on the dial side (train.js:103 `boss`, :147) | +0.25 | **EXTRA** (W2). The README reading (85) is not borne out | likely |
| lip over the wheel | 0,2 (05 05 03) | 0.555 over the rim face (0.305 over the boss) | +0.35 | follows from the Unresolved chain (17,2 + 1,3 + 0,2 = 18,7 against the framed 19) | sure (sheet) |
| wheel's place | 04 05 (1941): 17 from the top plate to the wheel; 0,5 to the pillar plate | 17.26; 0.49 (0.24 to the boss) | 0 | match | likely |
| journal C | Ø 2,2 e8, Kegel 1:30, to 23 +0,05 | Ø 2.179 at 19.03 → 2.046 at 23.03 | 0 | match | sure |
| Ø 3,0 at the journal's foot | extension lines at the flare's top (3.55 drawn) | the flare's top Ø 3.2 | — | consistent with the recorded reading | likely |
| shank | Ø 1,8 (framed, fit unreadable), Kegel 1:80, 1,65 near its end | Ø 1.80 at 23.03 → 1.623 at 37.22 | 0 | match | sure |
| shank's length | 14,3 over C (05 05 03); 16,7 −0,2 with a centre point (05 05 03-2, the blank) | 14.30, crowned r 3.1 | 0 | match / recorded | sure |
| groove under the Körner | 6,3 from the collar (05 05 03) | its square shoulder 6.07 over C, the cone to 6.73 | — | recorded measurement | likely |
| overall | 39,65 −0,1 to the end, with its centre (1940) | 37.33 | — | recorded departure | sure |
| shading | — | the arbor lathe: 707 of 1,728 triangles (88 of 338 mm²) more than 25° off; the boss 192/384 | — | **ARTIFACT** (A1, A2) | sure |

## intermediateWheel: 05 05 02 (`_05`, 1940), 05 05 02-1 (`_06`), 05 05 02-2 (`_07`, 1946)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| pivots | Ø 0,85 −0,05 (1946; the kompl.'s 0,82 −0,02 superseded), 3 −0,1 (kompl.) | Ø 0.825 → 0.792, 2.95, both ends | 0 | match | sure |
| shoulders apart | 23,05 −0,1 | 23.00 | 0 | match | sure |
| train shoulder | a 30° cone over the whole shoulder, Ø 2 down to the pivot's root (`s7_bot.png`: Ø 2.1 → 0.95 drawn) | flat r 0.4125-0.825, then a 0.15 × 30° chamfer | form | **WRONG** (W3) | likely |
| dial shoulder | flat, its corner barely broken (`s7_top.png`) | a 0.15 × 30° chamfer | small | minor | likely |
| arbor / collar | Ø 2 −0,1 both | 1.95 | 0 | match | sure |
| **pinion's length** | **"4,6 −0,2" spans the seat and the pinion together.** Its arrows are at rows 265 (the seat's top) and 341 (the pinion's bottom); the "1,3 −0,1" spans 265-287 (pixel rows; `s7_fig.png`). So the leaves are 4,6 − 1,3 = **3,3 long**, drawn 54 px = 3.2 at 17 px/mm, to scale. 04 05 draws 2.9 and the coloured section about 3.4 | 4.5 (u 14.70-19.20; train.js:119 `u0:19.2-4.5`, its comment at :107) | +1.2 | **WRONG** (W1). The transcription's "pinion leaf length 4,6" misreads the dimension; that misreading is why the seconds wheel needed a boss to clear it | sure |
| pinion's upper face | 19,25 −0,1 from the train shoulder | 19.20 | 0 | match | sure |
| seat | Ø 4,0 n6, 1,3 −0,1 | r 2.000, 1.25 | 0 | match | sure |
| riveting groove | the seat's end face drawn with a hidden V (a cone in the face, as the centre's) | plain square end at 20.45, 0.1 proud of the boss | form | **MISSING** (M1), minor: assembled, it is riveted (below) | likely |
| leaves | 12 (inferred), tip 4.72 and root 2.87 estimated; the turned head 5.2 scaled | tip r 2.359, root r 1.434 | — | recorded estimate | likely |
| wheel | z 80, D 23,33, dg 21,57, d 22,453, l 0,40 | tip r 11.665, root r 10.785 | 0 | match | sure |
| thickness | 1,0 −0,1 | 0.95 | — | within tolerance | sure |
| spokes / hub / rim / hole | 1,3 −0,2, 7,5 −0,1, 19,3 +0,2, 4 H7 | 1.2, r 3.725, r 9.70, r 2.00 | 0 | match | sure |
| **hub boss** | 05 05 02 at 6× (`s5_hub.png`) and column scans: the rim (x 150-250) and the hub (x 380-420) span the same rows, 224-226 to 241-243. Inside Ø 7, at the riveted face, a band 0.2 deep is drawn: the rivet's metal, flush with the face. The wheel is one thickness | a Ø 7 ring 0.2 proud on the dial side | +0.2 | **EXTRA** (W2) | likely |
| wheel's place | 04 05: 19,2 from the top plate to its upper face | 19.23 | 0 | match | likely |
| shading | — | arbor 576/1,472 triangles (55 mm²); boss 192/384 | — | **ARTIFACT** (A1) | sure |

## secondsWheel: 05 05 01 (`_02`, 1940), 05 05 01-1 (`_03`), 05 05 01-2 (`_04`, 1946, rev. 24.3.48)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| train pivot | Ø 0,82 −0,02, 3 (kompl.), 1:90 | Ø 0.81 → 0.777, 3.0, rounded | 0 | match | sure |
| train shoulder | a 30° cone over the whole shoulder, Ø 1,55 down to the pivot (`s4_bot.png`) | flat r 0.405-0.60, then a 0.15 chamfer | form | **WRONG** (W3) | likely |
| arbor | Ø 1,55 −0,1 (a) | 1.50 | 0 | match | sure |
| seat | Ø 2,6 n6, 1,2 +0,1 (a) | r 1.300, 1.25 (13.60-14.85) | 0 | match | sure |
| riveting cone | the seat's end face: a hidden cone, 0.47 deep from about Ø 2.4 at the face to the arbor's Ø 1.55 (`s4_seat.png` at 12×; the section half shows the same edge) | plain square end, 0.05 proud of the wheel | form | **MISSING** (M1), minor | likely |
| pinion | 7 long, its end 9,25 −0,1 from the dial shoulder | 14.85-21.85, 9.20 | 0 | match | sure |
| leaves | 10 (inferred), tip 3.17 and root 1.70 estimated | tip r 1.583, root r 0.852 | — | recorded | likely |
| collar | Ø 1,55 −0,1, scaled 2.17 long, **both ends rounded** (`s4_pin.png`) | Ø 1.50 × 2.20, square ends | form | **MISSING** (M2), minor | likely |
| dial pivot / post | Ø 0,76 −0,02 at the root, 0,65, Kegel 1:90, 9,2 to a **cone point** (1946, about 0.35 long; 1940 a domed end) | 0.75 → 0.65 over 9.1, then a 0.1 chamfer to a flat Ø 0.45 end | form | **WRONG** (W4), minor | likely |
| shoulders apart | 24,1 −0,1 (a) | 24.05 | 0 | match | sure |
| **wheel's face to the dial shoulder** | **9,2 ±0,05** (05 05 01) from the wheel's pinion-side face. Its arrow sits on the top line (row 361), which runs straight across rim and hub. The 14,8 is measured from the **same** line, so 9,2 + 14,8 = 24,0, the 1940 shoulders. With 9,25 −0,1 (1946) the wheel's face lies against the pinion's end | the rim's face 9.40 from the shoulder (u 14.65), the boss 0.2 between it and the pinion | +0.20 | **WRONG** (W2), outside ±0,05 | likely |
| wheel's place | 04 05: 13,8 from the top plate to the wheel's train face (= 14,8 − 1,0) | 13.675 | −0.125 | follows from W2 | likely |
| hub boss | none drawn: the 0,2 marks the rivet's layer in the Ø 6 hub | Ø 6 × 0.2 toward the pinion | +0.2 | **EXTRA** (W2) | likely |
| wheel | z 80, D 21,9, dg 20,23, d 21,066, l 0,38; 22,5 −0,2 the blank's | tip r 10.949, root r 10.115 | 0 | match | sure |
| thickness | 1,0 ±0,03 | 1.00 | 0 | match | sure |
| spokes / hub / rim / hole | 1,3 −0,2, 6,5 −0,2, 18,3 +0,2, 2,6 H7; one spoke on the centre line, sharp roots | 1.2, r 3.20, r 9.20, r 1.30 | 0 | match | sure |
| teeth | round ogival tips, flat gaps with sharp corners (`s3_teeth.png`) | radial flanks, epicycloid topped at D, flat root of 3 chords (sag 0.0003) | — | match | sure |
| shading | — | arbor 448/1,152 triangles; boss 192/384 | — | **ARTIFACT** (A1, A2) | sure |

## Bearings, against 04 05 and the coloured section (the plates' and bridge's own sheets are batches 1 and 2's)

| feature | sheet | model | verdict | sure |
|---|---|---|---|---|
| WN-301, WN-300 in the top plate | 04 05: flush both faces, a spherical oil cup across the bush's face, the pivot's rounded end standing up into it | Ø 4.596, flush; cup Ø 4.55 to the bore (1.13 deep at 1); pivot ends 0.75 into the cup | match | likely |
| the cup's rim | the photograph's "no flat" (recorded) | a **0.023-wide flat annulus** left between the cup (r 2.275) and the bush's rim (r 2.298) | **ARTIFACT** (A4), a sliver ring (`r_tp_1.png`) | sure |
| bores | close running fit (04 05) | 1.21 for 1.19, 0.845 for 0.825, 0.83 for 0.81 | match (estimated) | — |
| WN-302 | 04 05 (1941): flush, a cup on the dial face | 0.1 under the face (05 08 02), bored 1:30, cup Ø 3.8 × 0.55 | consistent | likely |
| WN-300.zb | 04 05: under a 90° sink in the bridge's plate face, a cup on the dial face | 0.71 in, cup Ø 3.7 × 0.9 | consistent | likely |
| 050504-2 / -1 (seconds jewel) | 04 05 and the coloured section: a setting in the bridge, the jewel part way in, a recess below; no sheet for 05 05 04 in the set | setting Ø 5.2, bore 3.7, jewel Ø 3.6 × 1.1, face 1.75 in | consistent | likely |
| jewel's edge | — | 32 segments on Ø 3.6: a polygon outline close up (`r_zb_2.png`) | **ARTIFACT** (A3) | sure |
| shading | — | WN-301 and WN-300: 384/1,536 triangles each; 050504-2 480/768; 050504-1 256/1,088; the 6MX chatons 384/576 | **ARTIFACT** (A1) | sure |

## Versions

- All three arbors are identical in `last`, `first`, `1943`, `3955` and `6mx` (the dumped vertices compare equal).
- The 6MX adds the contact wheel and its collet on the seconds arbor (`6MX.cw`, the contact's, not on these sheets). It replaces WN-300.t38/.t35/.zb with chatons and olive jewels (6MX.ch38u/35u/38l, jw…), estimated from Kirov 247 and recorded.
- The bearings are the same in every other version.
- No version draws a different train (the 1941 assembly 04 05 is the first design: plates 3,0, the pinions' 1940 lengths).

---

## Ranked findings

1. **WRONG, the intermediate pinion is 4.5 long; the sheet's is 3.3.**
   - Sheet: 05 05 02-2 (`05-05/Wempe_05-05_07.jpg`). "4,6 −0,2" runs from the seat's top (row 265) to the pinion's bottom (row 341), and "1,3 −0,1" from 265 to 287. The leaves are 4,6 − 1,3 = 3,3 (tolerance −0,2/+0,1 by the chain), drawn 3.2 at 17 px/mm. 04 05 draws 2.9 and the coloured section about 3.4.
   - Model: train.js:119 `pin:{…u0:19.2-4.5,u1:19.2}`; comments at :107 and in the README's "Heights". The transcription (05 05 02-2 table, "pinion leaf length 4,6") repeats the misreading.
   - Correction: `u0:19.2-3.25` (15.95; the chain's middle), and correct the comment, the README and the transcription.
   - Effects: the pinion's train end rises from y −4.27 to −3.02, so the seconds wheel has 1.1 of room under it, not 0.055. Rerun gearing.js and wempe_inertia.py (the arbor's inertia changes) and the transmission tools.
   - Render: `r_side_0.png`.
   - Sure.
2. **WRONG/EXTRA, the three wheels' 0.2-proud hub bosses (train.js:103, :120, :137 `boss`; drawn at :147). The seconds wheel's boss puts its face 9.40 from the shoulder, against 9,2 ±0,05.**
   - Column scans of all three kompl. sheets (05 05 01, 02, 03) put the hub and the rim between the same rows (to 1 px, 0.06 mm). None draws a raised hub.
   - The "0,2" is the riveting:
     - 05 05 03: the lip standing 0.2 proud of the dial face, with the framed 19 to its top;
     - 05 05 02 and 05 05 01: a 0.2 band inside Ø 7 / Ø 6 at the hub's face, the rivet's metal, flush.
   - The README's "Wheels" (85) and "Heights" (84) readings therefore don't hold. The reason they were adopted, clearing the intermediate pinion, goes away with finding 1.
   - Correction:
     - drop the boss mesh (:147);
     - seconds wheel `rim:[13.85,14.85]` (its face 9.2 from the dial shoulder, 14.85 from the train shoulder, against the pinion's end). The seat 13.60-14.85 then leaves 0.25 of rivet stock below the wheel: draw it as a riveted lip, flush in a Ø 6 × 0.2 sink in the hub's train face (or flush);
     - intermediate: rim unchanged (19.2-20.15); the seat's end (20.45) riveted flush into a Ø 7 × 0.2 sink in the hub's dial face, not standing 0.3 proud;
     - centre: rim unchanged; no boss; the lip from 18.475 to 19.03 stays (the README's Unresolved chain), but say that the sheet draws it 0.2.
   - Check: the escape pinion still covers the moved seconds wheel (y −6.01..−2.01 and −6.3..−3.3 against −5.125..−4.125: yes). Also check the 6MX contact wheel on the seconds arbor (fine.py --model wempe, every version), exploded.py and wempe_inertia.json.
   - Render: `r_swz_0.png` shows the boss.
   - Likely.
3. **WRONG (form), every arbor's train-side shoulder is a 30° cone on the sheets, not a flat with a 0.15 chamfer.**
   - Sheets: 05 05 03-2, 05 05 02-2, 05 05 01-2 ("30°", the chamfer line running from the arbor's diameter to the pivot's root). Scaled: centre Ø 2.5 → about 1.3, intermediate 2.0 → 0.95, seconds 1.55 → 0.83.
   - Model: train.js:99, :117, :135 (`[r-C30,0],[r,c30]`, C30 = 0.15, :45).
   - Correction: replace the flat-plus-chamfer with `[rp,0]…[ra, (ra-rp)·tan30°]`, keeping u = 0 at the pivot's root, as the sheets measure.
     - centre: rp 0.595, ra 1.25, axial 0.378;
     - intermediate: rp 0.4125, ra 0.975, axial 0.325;
     - seconds: rp 0.405, ra 0.75, axial 0.199.
   - The endshake and the bushes' places don't change. The shoulder then meets the bush at its hole's edge: check bom.py's endshake relation.
   - Render: `r_cwz_2.png`.
   - Likely.
4. **ARTIFACT A1, smooth-shaded square corners on every turned part of the train.**
   - What: raw THREE.LatheGeometry (`turned`, train.js:41; `ringT`, :43; `bushGeo`, :55) with computeVertexNormals.
   - Bad triangles: centre arbor 707/1,728 (88 mm²), intermediate 576/1,472, seconds 448/1,152, each wheel's boss 192/384, the top-plate bushes 384/1,536 each, WN-302 384/1,536, WN-300.zb 384/1,536, 050504-2 480/768, 050504-1 256/1,088, the 6MX chatons 384/576, the stud bushes 195/384, WN-hs 288/480.
   - Results:
     - the arbor's shoulder at the pinion's face and the seat's corners shade as fillets (`r_cw_3.png`: the arbor flares into the pinion's face);
     - the boss's flat face shades as a dome (`r_swz_0.png`);
     - the cup's lip and the bore round off (`r_tp_1.png`).
   - Fix: the same as batches 5 and 6, one creased-normal lathe helper (split vertices at corners over about 30°).
   - Sure.
5. **ARTIFACT A2, a lathe seam.** A dark radial line runs across the boss's face at the lathe's 0/2π seam (`r_swz_0.png`, left). It goes away with finding 2 (the boss removed) and with A1's fix. Sure.
6. **ARTIFACT A3, coarse round edges close up.**
   - The arbors turn at 32 segments (`turned` default): at the 2.5 arbor's silhouette the facets show in `r_cwz_2.png`.
   - The seconds jewel 050504-1 at 32 on Ø 3.6 shows a polygon (`r_zb_2.png`).
   - Use 64 for the arbors' and jewels' lathes (the wheels' bores are at 24-40 curve segments, fine at their size).
   - Sure.
7. **ARTIFACT A4, a 0.023 sliver flat round each top-plate bush's oil cup** (cup r 2.275, bush r 2.298; train.js:163 `rs:4.55/2`). The README records "no flat", and the cup's measured Ø 4.46-4.69 allows 4.596. Set `rs` to `rJ` (the cup to the rim) or record a deliberate land. `r_tp_1.png`. Sure.
8. **MISSING (minor), the riveting cones in the seconds' and intermediate seats' end faces** (05 05 01-2 `s4_seat.png`: 0.47 deep, from about Ø 2.4 to Ø 1.55; 05 05 02-2 `s7_top.png`: the same form). The model's seat ends are plain and stand 0.05 and 0.30 proud of the wheels. Covered by finding 2's riveted lip (assembled state). Likely.
9. **WRONG (form, minor), the seconds post's end.**
   - Sheet: 05 05 01-2 draws a cone point about 0.35 long from Ø 0,65 (05 05 01, 1940: domed).
   - Model: flat Ø 0.45 after a 0.1 chamfer (train.js:135).
   - Correction: end the post in a 90° point, or a dome, at 33.25. Check the seconds hand's seat on it (batch 9).
   - Likely.
10. **MISSING (minor), the seconds collar's rounded ends** (05 05 01-2, `s4_pin.png`: both the shoulder's and the pinion's ends of the Ø 1.55 collar rounded, about r 0.15). The intermediate's dial shoulder is drawn flat, where the model has the 30° chamfer. Likely.
11. **Minor, the leaf form.** 05 05 03-2's end view draws a semicircular leaf end (r ≈ 0.25). teeth() stretches gearOutline's semicircle 1.49× radially (train.js:25) into a half-ellipse. For the escape-pinion-proportioned 10- and 12-leaf pinions the stretch is smaller. Use a true semicircle on a lengthened radial flank. Gearing.js judges the mesh on the drawn outline, so rerun it. Likely.
12. **Nits.**
    - The seats and the wheels' bores are both drawn at nominal (5.4 / 4.0 / 2.6), not the fits' middles (n6 +0.012, H7 +0.006). The coincident cylinders are hidden.
    - The pinion extrusions have no bore round the arbor lathe, so the two solids intersect inside one arbor. This is hidden, but `fuse` or a bore would make each arbor one clean solid.
    - Every mesh is closed (the earlier solids checks pass), and no open seams were seen.

**Verified correct:**
- the places;
- every wheel's z, module, tip, root, tooth thickness, spokes, hub, rim, bore and thickness;
- the centre pinion's z, tip, root, length and place;
- every pivot's diameter, taper and length;
- the arbors' diameters;
- the seats' diameters and lengths;
- the centre's journal C, shank, crown and groove;
- 23,05 and 24,1 between shoulders;
- the seconds pinion's 7 and 9,25;
- the bushes' places, flushness and cups;
- WN-302 and the bridge's bushes against 04 05.

## Sheets reviewed

- 05-05/Wempe_05-05_01.jpg — 04 05 (So 127-556.04) Laufwerk — every height and figure: 3,0 plates, 17, 13,8, 19, 19,2, 18,12, 12,63, 24,5∅, 1,5 and 0,5 at the minute wheel, the 4 / 3,1 / 12,9 / 10,9 / 2, 5,5∅, Loch ∅1,7; the bushes' cups, the bridge's bush and the seconds setting; the intermediate pinion drawn 2.9 long; the pivots' ends in the cups
- 05-05/Wempe_05-05_02.jpg — 05 05 01 Sekundenrad kompl. — 9,2 ±0,05 and 14,8 (both from the wheel's top line, pixel rows), 0,2, 6∅ ×2, vernietet, 7,2 (struck, pencil 8,…), 2, 0,73 i/Steinlager, 0,8 −0,02 × 3, Kegel 1:30; the hub against the rim's thickness by column scans; the pivot ends' domes
- 05-05/Wempe_05-05_03.jpg — 05 05 01-1 Sekundenrad — z 80, D 21,9, d 21,066, dg 20,23, t, l 0,38, M 0,263, 22,5 −0,2, 18,3 +0,2, 6,5 −0,2, 2,6 H7, 1,3 −0,2, 72°, Radstärke 1,0 ±0,03; the teeth's form, the spokes' straight edges and sharp roots
- 05-05/Wempe_05-05_04.jpg — 05 05 01-2 Sekundentrieb — 0,65, 0,76 −0,02, 9,2, Kegel 1:90, 1,55 −0,1 (a) ×2, 9,25 −0,1, 7, 1,2 +0,1 (a), 2,6 n6, 24,1 −0,1 (a), 30°, 0,82 −0,02, 4,5, the change block; the collar's rounded ends, the seat's riveting cone (12×), the point, the shoulder cone
- 05-05/Wempe_05-05_05.jpg — 05 05 02 Zwischenrad kompl. — 0,82 −0,02 × 3 −0,1 both ends, 7∅, 0,2, 23,05 −0,1, vernietet; the hub's thickness against the rim's by column scans (6×)
- 05-05/Wempe_05-05_06.jpg — 05 05 02-1 Zwischenrad — z 80, D 23,33, d 22,453, dg 21,57, l 0,40, M 0,280, 24 −0,2, 19,3 +0,2, 7,5 −0,1, 4 H7, 1,3 −0,2, 72°, 1,0 −0,1
- 05-05/Wempe_05-05_07.jpg — 05 05 02-2 Zwischentrieb — 2 −0,1 ×2, 4,0 n6, 0,85 −0,05 ×2, 4,6 −0,2 ×2 (the pinion's spanning the seat and the pinion, by pixel rows), 1,3 −0,1, 19,25 −0,1, 23,05 −0,1, 30°; the seat's riveting cone, the flat dial shoulder, the lower shoulder's cone
- 05-05/Wempe_05-05_08.jpg — 05 05 03 Minutenrad kompl. — 2,6 □ r6, 4r, 6,3, 10,8 −0,1, 14,3, 2,2 e8, Kegel 1:30, 0,2 (the lip proud), 10∅ (from the pinion-side face), 25,4, 19 ±0,05 (to the lip's top, by pixel rows), 1,2 −0,02 × 3; hub against rim thickness by column scans
- 05-05/Wempe_05-05_09.jpg — 05 05 03-1 Minutenrad — z 90, D 33,10, d 31,976, dg 30,86, l 0,52, M 0,355, 33,8 −0,2, 28,1 +0,2, 10,6 −0,2, 5,4 H7, 1,7 −0,2, 72°, 1,3 −0,1
- 05-05/Wempe_05-05_10.jpg — 05 05 03-2 Minutentrieb — the blank (20,5, 3,8, 5,8, 1,5, 6,79, 6,3, 44,4, 60°), the table (14, 6,098, 4,24, 1,368, 0,4356), the end view's leaves, 1,65, 1,8 (framed), Kegel 1:80, 16,7 −0,2, 2,2 / 3,0, Kegel 1:30, 5,4 n6, 1,6 −0,1 (to the collar's top), 4 −0,1, 2,5, 30° (the whole shoulder), 1,2, 5,1 −0,2, 17,2 +0,05, 19 +0,05 (framed, to the collar's top: pixel scan), 23 +0,05, 39,65 −0,1
- Wempe_Einheitschronometer.jpg — coloured section — the train column: WN-301 / WN-300 / WN-302 / WN-300 names and cups, the intermediate pinion's length (about 3.4), the wheels' hubs flush, the seconds jewel 05 05 04-1 and setting 05 05 04-2, the riveting under the centre wheel
- 001-002/Wempe_001.jpg — Federchronometer layout (10.3.41, 2:1) — the train's circles dashed in plan; places only, nothing contradicting the tables (too coarse for sizes)

## Sheets not reviewed

- 05-05/Wempe_05-05_11.jpg and 05-05/Wempe_05-05_12.jpg (05 05 05 and 05 05 05-1, the maintaining detent): batch 6's, not train parts.
- 05-08/Wempe_05-08_02.jpg (Oberplatte kompl., WN-300/301's places), 05-08/Wempe_05-08_10.jpg (Zwischenbrücke kompl., WN-300 at 38, the seconds jewel's 1,7), 05-08/Wempe_05-08_32-1.jpg and _32-2.jpg (Unterplatte kompl., WN-302 0,1 +0,02, the stud bushes): batches 1 and 2's sheets for the bearings' places. I compared the bearings here against 04 05 and the coloured section only.
- No sheet for 05 05 04 (Lagerstein f. Sek. / Fassung), WN-300, WN-301 or WN-302 is in the drawings folder (transcriptions and Missing_details.md searched). The cannon tube 05 05 03-3 and the dial hole Ø 1,7 are batch 9's.
