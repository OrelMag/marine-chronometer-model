# Batch 6, the model against the sheets: the going train (centre, intermediate and seconds wheels and their pinion-arbors, the bushes WN-300/301/302, the seconds jewel and its setting, the layout 05 05_01)

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch6-read.md`, with its Step 3 corrections). Its F1-F13 are settled below.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit` (main at b134d60e). Nothing in it was edited.
- **Scratch.** All the files named below are in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b6m\` (written `b6m\` below).
- **Solids.**
  - `b6m\dump.py` loads the page (`?snap&qa`, GPU), freezes it as isolate.py does (n 2.5, running) and writes every visible mesh whose `hn` is a train line (05 05 0x, WN-300/301/302, 05 05 04-1/-2, the 6MX's chatons and contact wheel, the escape pinion, the cannon tube, the dial) in all five versions (`dump.json`). `dump_pl.py` does the same for the plates and the intermediate bridge (`dump_pl.json`).
  - The code has one version group in the train: the top plate's and bridge's bushes (`'last first 1943'`) against the 6MX's chatons, and the 6MX's contact wheel on the seconds arbor. The arbors and wheels are the same mesh in all five versions (checked: same counts and bounds).
- **Analysis.**
  - Turned parts read as (r, y) rings about their arbor (`prof.py`); the wheels' and pinions' tip, root, count, bore, hub and rim radii off their outlines (`gears2.py`); bores, bush lengths and the plates' holes about each arbor (inline scripts on the dumps).
  - The sheets' drawn circles scaled on rows through the wheels' centres (05 05_3 and _6), to settle F10.
- **Overlays.** `overlay.py` (batch 3's) renders a book page at the sheet's px/mm and registers it by FFT over mirror, turn and scale. Output `b6m\ov\*.png`: sheet red, book blue, both black. Wheels: `s03.png`, `p06.png`, `p09.png` (scale 0.98 of 17.5 px/mm); arbors: `a04.png`, `a07.png`, `a10.png` side by side in `ov\arbors.png`.
- **Renders.** `isolate.py --model wempe` on the three arbors from four sides (`b6m\iso\r_iso_centreWheel_intermediateWheel_secondsWheel.png`) and each arbor side on and its hub close up beside its pinion and kompl. sheets (`iso\r_iso_secondsWheel.png`, `r_iso_intermediateWheel.png`, `r_iso_centreWheel.png`).
- **Photograph.** `8_Wempe_3955_Räderwerk_plus.jpg` (the train seen from the top-plate side, top plate off), cropped at the hubs (`b6m\rw_sec.png`, `rw_cent.png`).
- **Tools.**
  - `holecheck.py --model wempe` and `audit.py --model wempe` at the same commit were run for batch 5 (`b5m\holecheck.txt`, `b5m\audit.txt`): 1565 holes over 5 states, 0 failing, every train hole populated; the audit has nothing new, and its coplanar entries for these parts (`centreWheel` at −1.74, `intermediateWheel` at −0.24 and +1.18, `secondsWheel` at −4.12) are the wheels' faces on their pinions' faces and seats, expected.
  - `holes.py` takes no `pillarPlate` (no mesh by that partName); the plates' holes were read off `dump_pl.json` instead.
  - `seatcheck.py` isn't on main at b134d60e: no `SEAT_EXPECTED` to re-judge.
  - `gearing_wempe.json` (as committed) read for the meshes' depthing windows.
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00: centre wheel 92-96, intermediate 97-101, seconds 109-113; the top plate's bushes 28, WN-302 10, the bridge's bush, setting and jewel 86-91.

**Frame of reference.** The movement's y (dial side +y): the top plate's inner face y −19.0, its outer face −22.35; the pillar plate's inner face 0, its dial face 3.35; the intermediate bridge 3.35 to 7.15; the dial 10.35 to 11.65. Arbors at holes 1 (0, 0), 38 (9.910, 15.170) and 35 (0, 23.0). Each arbor's u runs from its train-side shoulder (the centre's at y −18.965, the intermediate's −18.97, the seconds' −18.975).

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| wheels 05 05 01-1, 02-1, 03-1 (1940, the only issue) | yes | yes | yes | yes | yes |
| seconds pinion 05 05 01-2 (1946, rev. 24.3.48) | yes | yes (1940 kompl. 05 05_2 not built) | yes (predates 1946) | yes | yes |
| intermediate pinion 05 05 02-2 (1946) | yes | yes (1940 kompl.'s 0.82 pivots on the card only) | yes | yes | yes |
| centre pinion 05 05 03-2 (1940) with the 1943 kompl. 05 05 03 | yes | yes | yes | yes | yes |
| bushes WN-300 at 35, 38 (top plate) and 38 (bridge) | yes | yes | yes | chatons and jewels | yes |
| WN-301, WN-302, the seconds jewel 05 05 04-1 and setting -2 | yes | yes | yes | yes | yes |

The going train has no version split of its own: every version builds the 1946/48 pinions. That is right for "as last revised" and for the 6MX and Wempe 3955 (both later than 1948 or undated against them); "as first drawn" and "1943" predate the 1946 redraws (M4).

---

## 05 05_1: the layout "Laufwerk" (So 127-556.04, 1940-41, 5:1, not to scale); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| plates | 3,0 each | 3.35 each (the plates' own sheets) | +0.35 | superseded (F13; README 80) | sure |
| plate gap | 19 | 19.000 (y −19.0 to 0) | 0 | match | sure |
| top plate to the centre wheel's top face | 17 | 17.26 (wheel's train-side face at y −1.74) | +0.26 | superseded: 05 05_10's 17,2 +0,05 to the pinion's face, the wheel on it (M12) | likely |
| top plate to the intermediate wheel's top face | 19,2 | 19.23 (y 0.23) | +0.03 | match | sure |
| top plate to the seconds wheel's top face | 13,8 | 13.875 (y −5.125) | +0.075 | match (05 05_2's 14,8 less the 1,0 rim) | sure |
| centre distances | 18,12; 12,63 | 18.120; 12.630 (hole table places) | 0 | match | sure |
| pillar plate opening | 24,5 Ø | r 12.250 about 38 | 0 | match (M2 of the reading) | sure |
| seconds hole in the pillar plate | (05 08_3a: punched 6,0) | r 3.000 at 35 | 0 | match | sure |
| bridge thickness at 38 | 4 | 3.80 (y 3.35-7.15; frame.js) | −0.2 | batch 8's; not this sheet's to set | — |
| bridge face to dial | 7 | 7.00 (dial y 10.35 from 3.35) | 0 | match | sure |
| dial hole | Loch Ø 1,7 | Ø 1.700, all five versions; the post Ø 0.69 in it | 0 | match | sure |
| centre wheel over the pillar plate | "0,5"? (illegible) | 0.49 (rim) / 0.24 (boss) | — | match on the rim, as README 84 | possible |
| bearings | brass bushes in both plates and the bridge at 38; a jewel at 35 in the bridge | WN-301 at 1, WN-300 at 35 and 38 (top plate), WN-302 at 1, WN-300.zb at 38, jewel 05 05 04-1 in setting 05 05 04-2 at 35 | — | match (the reading's M1) | sure |
| top bushes | flush both faces, a spherical oil cup in the outer face, a small chamfer at the inner face (s01w) | flush both faces; the cup from the bush's rim, 1.2 deep on the axis, 1.13 at the bore; no chamfer | — | form match; the cup drawn about 0.8 of 3.0 deep (0.9 on 3.35, schematic) and the chamfer: M12 | possible |
| pivot ends in the top bushes | rounded, standing into the cup about 0.3 under the outer face (s01w) | centre 0.385, intermediate 0.43, seconds 0.375 under the outer face, in the cup | — | match | likely |
| WN-302 | flush with the inner face (a hair under), a cup on the dial side (s01v) | 0.1 under the inner face, cup Ø 3.8 × 0.55 on the dial side | — | match | sure |
| seconds jewel in the bridge | a stone about Ø 3.6 × 1.3 in a setting the bridge's whole thickness, its face about 1.6 in, the setting's bore bevelled both ends (s01h, 61 px/mm by the bridge's 4) | stone Ø 3.6 × 1.1, face 1.75 in; setting from 0.2 under the plate side to the dial face, bore Ø 3.7 above and below the stone | — | stone and face match; the setting's ends are batch 8's (05 08 04) | likely |
| "5,5 Ø" at the seconds' top bush | unattached circle | nothing of Ø 5.5 there; the bush and its cup are Ø 4.596 | — | F6: unattached. Wempe 3955's top plate shows the cups 4.46-4.69 across with no flat or ring round them (README 598), so no 5.5 feature on the made plate. Record in README Unresolved; no change | possible |

## 05 05_2 (Sekundenrad kompl., 1940) and 05 05_4 (Sekundentrieb, 1946, rev. 24.3.48); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| dial-side pivot (post) | _4: Ø 0,76 −0,02 at the base, 0,65 at the end, 9,2 to the tip, Kegel 1:90; _2: 7,2 rounded, Ø 0,73 over 2 "i/Steinlager einpassen" | Ø 0.750 at the shoulder → 0.650 at u 33.15, rounded to u 33.25: 9.2 | 0 against _4 | built to _4's 9.2; but _4's tip is drawn as a 60° centre point (`b6m\ends.png`), like every pivot end on the three pinion sheets (M3) | sure (drawing); likely (meaning) |
| collar | Ø 1,55 −0,1 (a), length scaled 2,24 | Ø 1.500 × 2.20 (u 21.85-24.05) | mid | match | sure / scaled |
| pinion | 7 long, its end 9,25 −0,1 from the shoulder | 7.000 (u 14.85-21.85), 9.200 | mid | match | sure |
| leaves | not on the sheet (F11) | z 10, m 0.2807, tip Ø 3.166, root Ø 1.704 | — | recorded estimate (README Estimated, the escape pinion's proportions) | likely |
| seat | Ø 2,6 n6 +0,013/+0,006 × 1,2 +0,1 (a) | Ø 2.600 × 1.250 (u 13.60-14.85) | −0.0095 on Ø | Ø at the H7 bore's size (below n6), see J1; length mid | sure |
| arbor | Ø 1,55 −0,1 (a) | Ø 1.500 | mid | match | sure |
| between shoulders | 24,1 −0,1 (a; was 24 −0,05) | 24.050 | mid | match | sure |
| train-side shoulder | 30° (chamfer to the pivot) | one 30° cone from the pivot's root to the arbor (r 0.405 → 0.75 over 0.20) | — | match (the code's reading, 26 October 2026) | likely |
| train-side pivot | _4: Ø 0,82 −0,02, 4,5 to a centre point, Kegel 1:90; _2: 3 (rounded), Ø 0,8 −0,02 | Ø 0.810 → 0.777, 3.000, rounded | — | Ø 1946's; length 1940 kompl.'s; the 4,5 a turned length with its centre (M3: holds) | likely |
| 1940 (05 05_2) against 1946/48 (_4) | post 7,2 Ø 0,73; pivot 0,8 −0,02; shoulders 24,0 (9,2 + 14,8); seat 1,3 −0,1 | the 1946/48 sizes in all versions; the card lists 24 −0,05 and the seat 1,3 −0,1 only | — | M4 | sure |
| "0,2" at the wheel's face, "6 Ø" twice | the hub's face 0,2 off the rim's, Ø 6 (s02m) | hub flush with the rim | −0.2 | M1 | likely |

### The wheel, 05 05_3 (05 05 01-1, 1940)

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | z 80, M 0,263 (d 21,066) | 80, d 21.066 | 0 | match | sure |
| tip | D 21,9 (22,5 −0,2 written on the drawn tip circle) | Ø 21.898 | 0 | match; the drawn outer circle scales 21.82 by its rim's 18,3 (17.36 px/mm), so it is D and 22,5 the blank's (F10 settled) | sure |
| root | dg 20,23 | Ø 20.230 | 0 | match | sure |
| tooth on the pitch circle | l 0,38 | 0.38 (gearOutline's `b = l/2/rp`, by construction) | 0 | match | sure |
| rim | 1,0 ±0,03 | 1.000 | 0 | match | sure |
| rim's inside | 18,3 +0,2 | Ø 18.400 | mid | match | sure |
| spokes | 5 × 1,3 −0,2, 72° | 5 × 1.200, straight | mid | match (overlay `s03.png`: black) | sure |
| hub | 6,5 −0,2 | Ø 6.400 | mid | match | sure |
| bore | 2,6 H7 +0,009 | Ø 2.600 | lower limit | within | sure |
| place | 9,2 ±0,05 from the collar's top to the wheel's face | its pinion-side face 9.200 from the shoulder (y −4.125) | 0 | match | sure |

## 05 05_5 (Zwischenrad kompl., 1940), 05 05_6 (the wheel, 1940) and 05 05_7 (Zwischentrieb, 1946); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| pivots | _7: Ø 0,85 −0,05, 4,6 −0,2 to a centre point, both ends; _5: Ø 0,82 −0,02 × 3 −0,1, rounded | Ø 0.825 → 0.792, 2.95, rounded, both | — | Ø 1946's; length 1940 kompl.'s (M3: the 4,6 a turned length) | likely |
| neck (dial side) | Ø 2 −0,1, 23,05 − 19,25 − 1,3 = 2,5 (derived) | Ø 1.950 × 2.85 (u 20.15-23.0) | +0.35 long | follows the short seat (M9) | sure |
| seat | Ø 4,0 n6 +0,016/+0,008 × 1,3 −0,1 | Ø 4.000 × 0.950 | −0.30 | **short (M9)**: cut to the wheel's face "riveted flush", the 0,3 the sheet leaves to rivet not drawn | sure |
| pinion's face to the train shoulder | 19,25 −0,1 | 19.200 | mid | match | sure |
| leaves | 4,6 −0,2 over seat and leaves, 1,3 −0,1 the seat: leaves 3,3 | 3.250 (u 15.95-19.2) | mid | match (the reading's M5) | sure |
| leaf data | none (F11) | z 12, m 0.3553, tip Ø 4.719, root Ø 2.868 | — | recorded estimate | likely |
| arbor | Ø 2 −0,1 | Ø 1.950 | mid | match | sure |
| between shoulders | 23,05 −0,1 | 23.000 | mid | match | sure |
| lower shoulder | 30° | train side one 30° cone; dial side flat with a C30 chamfer 0.15 | — | match | likely |
| wheel: teeth, tip, root, l | z 80, D 23,33, d 22,453, dg 21,57, l 0,40 | 80, Ø 23.329, 22.453, 21.570, 0.40 | 0 | match; the drawn outer circle scales as D (its ratio to the rim's inside 1.204 = 23,33/19,4; 24/19,4 = 1.237): F10 settled | sure |
| wheel: rim, inside, spokes, hub, bore | 1,0 −0,1; 19,3 +0,2; 5 × 1,3 −0,2; 7,5 −0,1; 4 H7 +0,012 | 0.950; Ø 19.400; 5 × 1.200; Ø 7.450; Ø 4.000 | mid / lower limit | match (overlay `p06.png`) | sure |
| wheel's place | 05 05_1's 19,2 | 19.23 from the top plate, in the pillar plate's opening (0.585 clear of r 12.25) | 0.03 | match | sure |
| "0,2" at the wheel's face, "7 Ø vernietet" | the hub's face 0,2 off the rim's on the dial side (s05a) | hub flush with the rim | −0.2 | M1 | likely |

## 05 05_8 (Minutenrad kompl., 1943), 05 05_9 (the wheel, 1940) and 05 05_10 (Minutentrieb, 1940); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| train-side pivot | _8: Ø 1,2 −0,02 × 3; _10: Ø 1,2 ±0,02 (sign unclear, `b6m\z10piv.png`), 5,1 −0,2 to a centre point, "Kegel 1:90" (re-inked, `z10keg.png`) | Ø 1.190 → 1.157, 3.000, rounded, 1:90 | — | match _8 (1943 supersedes the 1940 length) | sure |
| arbor | Ø 2,5 | Ø 2.500 | 0 | match | sure |
| pinion | z 14, M 0,4356, d 6,098, dg 4,24, tip the blank's 6,79 −0,02; 4 −0,1 long; its face 17,2 +0,05 from the shoulder | 14, tip Ø 6.780, root 4.240, 3.950 long, face 17.225 | mid | match | sure |
| seat | Ø 5,4 n6 (framed) × 1,6 −0,1 | Ø 5.400 × 1.550 | mid / H7 size | match (see J3) | sure |
| riveting lip | Ø 3,0 at its foot, 0,2 (19 − 17,2 − 1,6), a groove under it (s10j) | lip to u 19.030, Ø 3.2 at its top; V groove 0.99 deep to Ø 2.44 | — | match (code's reading, likely) | likely |
| collar's top to the shoulder | 19 +0,05 (framed, _10); 19 ±0,05 (_8) | 19.030 | mid | within both (F7) | sure |
| journal C | Ø 2,2 e8 −0,014/−0,028 (_8), Kegel 1:30, to 23 +0,05 | Ø 2.179 at the collar → 2.046 at u 23.03 | mid | match | sure |
| shank | Ø 1,8 g6 (framed), Kegel 1:80, 1,65 near the end | Ø 1.800 at C, 1:80, to u 37.33 | **+0.005 over g6's middle, 0.002 over its top** | M7 | sure |
| shank's length | _8: 14,3 over C, flush with the tube's crowned top; _10: 16,7 −0,2 to a centre point (finished view; the blank "Hz" is a separate view, 44,4 −0,2) | 14.300 over C, crowned r 3.1 | — | match _8; the code's reason "39.65 is the blank's" is wrong (M5) | sure |
| groove under the punch | _8: a trapezoid in the bore under the tube's groove (s08a) | square shoulder 6.07 over C, cone 0.24 deep to 6.73 | — | match (likely) | likely |
| wheel: teeth, tip, root, l | z 90, M 0,355, D 33,10, d 31,976, dg 30,86, l 0,52 | 90, Ø 33.099, 31.976, 30.860, 0.52 | 0 | match (overlay `p09.png`) | sure |
| wheel: rim, inside, spokes, hub, bore | 1,3 −0,1; 28,1 +0,2; 5 × 1,7 −0,2; 10,6 −0,2; 5,4 H7 +0,012 | 1.250; Ø 28.200; 5 × 1.600; Ø 10.500; Ø 5.400 | mid / lower limit | match | sure |
| "0,2" and "10 Ø" | the hub's face 0,2 off the rim's (s08g: 13 px at 65 px/mm), dial side | boss Ø 9.99 standing 0.25 proud on the dial side (y −0.49 to −0.24) | 0.05 | match (the rim's 1.25 middle under the 1.5 stock) | likely |
| chain line over the wheel | ≈ 0.9 over the rim's face by scale (s08g, not to scale) | lip top 0.555 over the rim, 0.305 over the boss | — | unattached figure; no change | possible |

### Its holes and the bearings (H1-H16)

| hole | sheet | model | verdict | sure |
|---|---|---|---|---|
| H1 seconds wheel bore 2,6 H7 | 05 05_3 | Ø 2.600 through 1.0 | match | sure |
| H2 intermediate wheel bore 4 H7 | 05 05_6 | Ø 4.000 | match | sure |
| H3 centre wheel bore 5,4 H7 | 05 05_9 | Ø 5.400 | match | sure |
| H4 spoke windows | the three wheels | five each, straight spokes | match | sure |
| H5 tube's bore on the shank | 05 05_8 (no size) | the shank's radius + 0.01 all along | present; joint M6 | sure |
| H6 top plate bush seats 1, 35, 38 | 4,59 +0,012 | Ø 4.596 each, bush OD 4.596 | match | sure |
| H7 the top bushes' pivot holes | not sized ("Enger Laufsitz") | WN-301 Ø 1.21 (2.15 long), WN-300.t38 0.845, WN-300.t35 0.83 (2.18 long) | match | sure |
| H8 WN-302's seat | 4,59 +0,012 | Ø 4.596 | match | sure |
| H9 WN-302's journal hole | not sized | tapered with the journal, 0.026 over it | match (estimate, README 595) | sure |
| H10 opening Ø 24,5 about 38 | 05 05_1, 05 08_3a | r 12.250 | match | sure |
| H11 hole 35, Ø 6,0 | 05 08_3a | r 3.000; the seconds pinion r 1.58 in it | match | sure |
| H12 bridge bush at 38 | (05 08 04) | WN-300.zb in Ø 4.3, bore **0.86** | M8 | sure |
| H13 seconds setting at 35 | (05 08 04) | 05 05 04-2 in Ø 5.2, jewel 05 05 04-1 olive Ø 0.78, face 1.75 in | match | likely |
| H14, H15 bridge screws and steady pins | 28, 43 (M 2,6); 29, 44 (1,6025) | populated (holecheck) | present; their fits batch 8's | sure |
| H16 dial hole Ø 1,7 | 05 05_1 | Ø 1.700 | match | sure |

### The meshes (gearing_wempe.json, the tooth outlines as built)

| mesh | centre | wheel tip + pinion root (clearance) | pinion tip + wheel root | depthing window | verdict |
|---|---|---|---|---|---|
| centre 90 → intermediate 12 | 18.120 | 16.550 + 1.434 (0.136) | 2.360 + 15.430 (0.330) | −0.136 / +0.355, CNC ±0.05 | holds |
| intermediate 80 → seconds 10 | 12.630 | 11.665 + 0.852 (0.113) | 1.583 + 10.785 (0.262) | −0.112 / +0.281, ±0.031 | holds |
| seconds 80 → escape 10 | 11.850 | 10.949 + 0.800 (0.101) | 1.485 + 10.115 (0.25) | −0.100 / +0.263, ±0.025 | holds (batch 2) |
| ratio | 90/12 × 80/10 = 60 | update(): centre −a/60, intermediate a/8, seconds −a | — | — | holds |

### Endshake (on the solid)

| arbor | train-side gap | dial-side gap | total | source |
|---|---|---|---|---|
| centre | 0.041 (the cone at the bore's edge) | 0.035 (lip at y 0.065, WN-302 at 0.1) | 0.076 (bom: 0.084) | 19 +0,05; WN-302 0,1 +0,02 |
| intermediate | 0.036 | 0.030 (shoulder 4.03, bush 4.06) | 0.066 (bom: 0.074) | 23,05 −0,1; bush 0,7 +0,02 |
| seconds | 0.031 | 0.025 (shoulder 5.075, jewel 5.10) | 0.056 (bom: 0.065) | 24,1 −0,1; jewel 1,7 (no tolerance) |

All within the 1958 Soviet book's band that bom.json's `dev` entries cite; the rest of the endshake budget is batch 9's (the pillars).

---

## Step 5, overlay

- **Wheels** (`ov\s03.png`, `p06.png`, `p09.png`). Spokes, hub, rim's inside and bore lie on the sheets' lines (black) at a scale of 0.98 (17.15 px/mm). The sheets' unpartnered lines: the outer circle (the drawn tip circle the 22,5/24/33,8 are written on; the book's teeth fall a hair inside it at the registration's scale, within the 0.3-0.5 px the scan allows), the pitch and root circles (the book draws teeth, not circles), the 72° arc and the dimensions. The book's unpartnered lines: its 80/90 teeth (the sheets draw nine) and its section A-A. Nothing unexplained.
- **Arbors** (`ov\arbors.png`).
  - Seconds (a04): collar, pinion, seat, arbor and post on the sheet's lines. Unpartnered: the sheet's train-side pivot runs 1.5 further to a centre point (the 4,5); the book's ends at 3.0 rounded (M3).
  - Intermediate (a07): pinion and arbor on the sheet's lines. Unpartnered: the sheet's 1,3 seat over 0.95 in the book (M9); both pivots run on to centre points (4,6), the book's end at 2.95 (M3).
  - Centre (a10): pinion, seat, lip and arbor on the sheet's lines; the 1940 sheet's pivot 5,1 and the shank's 16,7 to a centre point run past the book's 3 and 14.3 (the 1943 kompl.'s, sure). **The book draws the dial end and the train-side pivot as long bulging arcs** (its crown joined to the 1:80 taper, and the pivot's 1:90 taper, fitted as arcs of large radius): M10.
- **Book text and sheets** (pp. 92-113): see M10.

---

## Step 6, fit list

| # | piece | into/onto | hole or seat (sheet) | holding (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | seconds wheel 05 05 01-1 | seconds pinion's seat | 2,6 H7 +0,009 on 2,6 n6 +0,013/+0,006 (−0,003 to +0,013), seat 1,2 +0,1 | press and "vernietet" | Ø 2.600 on Ø 2.600, line to line (inside the band); the seat stands 0.25 past the wheel unspread; the hub flush | holds as a press; the riveting and hub as M1, M9 |
| J2 | intermediate wheel 05 05 02-1 | intermediate pinion's seat | 4 H7 +0,012 on 4,0 n6 +0,016/+0,008 (−0,004 to +0,016), seat 1,3 −0,1 | press and riveting | Ø 4.000 on Ø 4.000, line to line; the seat cut to the wheel's 0.95, nothing to rivet | holds as a press; seat M9 |
| J3 | centre wheel 05 05 03-1 | centre pinion's seat | 5,4 H7 +0,012 on 5,4 n6 framed (−0,004 to +0,016), seat 1,6 −0,1, lip Ø 3,0 | press and riveting | Ø 5.400 on Ø 5.400, line to line; the lip as turned with its groove, 0.05 of seat over the boss | holds |
| J4 | cannon tube 05 05 03-3 | the shank (1,8 g6, Kegel 1:80) | its bore, foot on the journal's end at 23 | friction from the punched groove ("Körner") | bore 0.01 clear of the shank everywhere; the tube's round groove (r 0.4, centre 6.30 over C) over the shank's groove (6.07-6.73), nothing pressed into it; foot on the journal's end (y 4.065) | **no (M6)**: nothing holds the tube on the solid |
| J5 | centre pivot Ø 1,2 −0,02 | WN-301 | hole 1 | running fit ("enger Laufsitz"); shoulder on the bush | Ø 1.19 in Ø 1.21 (0.01 on the radius at the shoulder, 0.026 at the end), the cone on the bush's face | holds |
| J6 | centre journal Ø 2,2 e8 | WN-302 | hole 1 | running fit; the lip against the bush (19 +0,05) | journal 2.179-2.046 in the bore 0.026 over it; lip 0.035 off the bush's face | holds |
| J7 | intermediate pivot Ø 0,85 −0,05 | WN-300.t38 | hole 38 | running fit; shoulder on the bush | Ø 0.825 in Ø 0.845 (0.01) | holds |
| J8 | intermediate dial-side pivot | WN-300.zb | the bridge at 38 | running fit; shoulder on the bush (23,05 −0,1) | Ø 0.825 in Ø **0.86** (0.0175 on the radius) | holds; looser than its fellow (M8) |
| J9 | seconds pivot Ø 0,82 −0,02 | WN-300.t35 | hole 35 | running fit | Ø 0.81 in Ø 0.83 (0.01) | holds |
| J10 | seconds dial-side pivot Ø 0,76 −0,02 | jewel 05 05 04-1 in its setting | the bridge's Ø 5.2 at 35 | running in the stone; shoulder on it (24,1 −0,1) | Ø 0.747 at the jewel's waist in Ø 0.78 (0.0165); shoulder 0.025 off the stone | holds |
| J11 | seconds post | dial | Loch Ø 1,7 | clearance | Ø 0.69 in Ø 1.70 | holds |
| J12 | WN-300 (×2), WN-301 | top plate | 4,59 +0,012 | press (the WN sheets not in the set) | OD 4.596 in Ø 4.596, line to line, flush both faces | holds as recorded (README 598: the bushes' sizes estimated) |
| J13 | WN-302 | pillar plate | 4,59 +0,012 | press | OD 4.596 in Ø 4.596, 0.1 under the inner face | holds as recorded |
| J14 | WN-300.zb | intermediate bridge | Ø 4.3 (05 08 04) | press | OD 4.300 in Ø 4.300 | holds (batch 8's hole) |
| J15 | 05 05 04-2 setting, 05 05 04-1 jewel | bridge; setting | Ø 5.2 (05 08 04); the jewel burnished in | press; burnished | OD 5.2 in 5.2; the stone in its seat Ø 3.6; bom.json has no relation for the jewel in its setting (`050504-1` `rel: []`) | holds (relation missing: M10's note) |
| J16 | intermediate bridge | pillar plate's dial face | 28, 43 (M 2,6), 29, 44 (1,6025) | 2 screws, 2 steady pins | populated (holecheck) | holds as far as this batch; batch 8 |
| J17 | centre wheel's teeth | intermediate pinion | 18,12 | mesh | 18.120, 0.136 under the window's jam limit | holds |
| J18 | intermediate wheel's teeth | seconds pinion | 12,63 | mesh | 12.630, 0.113 | holds |

With bom.py's press tolerance at ≤ 0.02, J1-J3 still pass (0 gap) and J4 passes on its 0.01 gap though nothing presses (M6).

---

## Extra checks

### (a) Slots, notches and grooves

| described | against the sheet's views | verdict |
|---|---|---|
| the tube's round groove "4r" under "Körner" (05 05_8) | the section's outside: a round notch r 0,4 at 6,3 over C | built (y 9.965-10.765, r 1.8 → 1.4, centre 6.30 over C): holds (batch 7's part) |
| the shank's groove under it (train.js) | the trapezoid inside the bore lines at the groove (s08a), one view | built; the reading's "possible" stands as likely: the bore line runs straight past the groove, so the tube's wall isn't drawn pressed in, and the trapezoid is the shank's (F5 settled: both grooves, the punch's dents not drawn on the sheet, M6) |
| the V groove under the centre's lip | 05 05_10 at 6× (s10j) | built; holds (likely) |
| the seconds pivot's "2" | a length along the post, not a groove | not built as a groove: right |
| slots or notches in the wheels or arbors | none drawn | none built: right |

### (b) Drawn holes (the reading's H1-H16)

All sixteen are in the model (table above). H5 is present but holds nothing (M6); H12's bore is 0.015 wider than its fellow (M8).

### (c) Excuses

| entry | re-judged |
|---|---|
| bom.json `050503-2` dev (endshake 0.084, the cone bearing at the hole's edge) | holds (measured 0.076 by the cone at the bore's edge; inside the 1958 book's 0.07-0.10) |
| bom.json `050502-2`, `050501-2` devs (6MX: the cone into the chaton's mouth, 0.103 and 0.093) | hold as recorded (the 6MX's jewels' mouths estimated) |
| bom.json `050501-1/-1/-1 round … press` (three wheels) | hold: line to line, inside each sheet's H7/n6 band |
| bom.json `050503-3 round 050503-2 press` | passes on a 0.01 gap; not a press, nothing holds (M6) |
| bom.json `WN-300.*`, `WN-301`, `WN-302 in … press` | hold as line-to-line presses (the WN sheets not in the set) |
| bom.json `050504-1` (`rel: []`) | the jewel in its setting has no relation; the setting's `in 050804-1 press` holds (M10) |
| checks.py EXPECTED ('pillarPlate:Buffer','secondsWheel:Extrude') | the 6MX contact's stone on its wheel (no drawing; Romanov 1975): holds as an estimate, not a drawing excuse |
| HOLE_EXPECTED, LOOSE, FLOAT | none for these parts |
| README 84, 85 (each hub 0.2 proud; the seconds hub "what lets it clear") | **stale** since 26 October 2026 (M2) |
| README 806 ("6∅, 7∅, 10∅ are the hubs, the 0,2 each hub's standing proud") | right as a reading, built for one wheel of three (M1, M2) |
| README 595 (the centre and intermediate pivots' tapers 1:30, 1:90) | stale: the centre's pivot is 1:90 since 25 October 2026 (M5) |
| README 597 (the 1.6 −0.1 "for seat and collar together … Unresolved") | contradicts README 853 ("Closed": the seat alone) and the build (M5) |
| README 601 ("each seat drawn to the hub's face") | wrong for two of three (M9) |
| README 86 and the code: the pinion sheets' 4.5-5.1 "the turned blanks', each with its 60° centre" | holds for the pivots (every end on 05 05_4, _7 and _10 is drawn as a centre point); the same rule then reaches the seconds post (M3) |
| train.js lines 95, 98-99 | stale (M5) |
| train.js line 308 (WN-300.zb "bore Ø 0.86 as the top plate's") | stale since the top bushes became 0.845/0.83 (M8) |
| "On the cards only" (README 441) for the seconds and intermediate arbors | incomplete (M4) |

### (d) The blind reading's findings settled against the model

- **F1:** confirmed and narrowed (M1). The three kompl. sheets draw the hub's face 0,2 off the rim's at a diameter a little under each hub; each wheel's sheet metal is 0,2 thicker than its rim; and with the hub left at the metal's thickness each seat exceeds its hub by 0-0,1 (seconds 1,2 +0,1 on 1,2; intermediate 1,3 −0,1 on 1,2; centre 1,6 −0,1 on 1,5, then the 0,2 lip), the same small stand for riveting in all three. A flush hub would leave 0,2-0,3. Wempe 3955's seconds wheel (`rw_sec.png`) shows its hub standing proud as a disc about Ø 6.5 with a side wall, on the face away from its pinion (the top plate's), the riveting ring round the arbor in it (likely). The centre wheel's hub shows a brass wall under its pinion (`rw_cent.png`, possible). The model builds the centre's proud and the other two flush.
- **F2:** confirmed (M2), and the cards say the same stale thing.
- **F3:** settled for the train-side pivots: all six pivot ends and both posts on the three pinion sheets end in 60° centre points (`b6m\ends.png`), so their lengths are turned lengths, as the code reads them. The rule then reaches the seconds post's 9,2 too, which the model builds as finished (M3).
- **F4:** holds as a version difference; the versions that predate 1946 don't carry it (M4).
- **F5:** settled: the tube's outside groove and the shank's groove are both built; the punched joint isn't (M6).
- **F6:** unattached; nothing on the made plate; record (05 05_1 row).
- **F7:** within both tolerances (19.03).
- **F8:** confirmed (M5).
- **F9:** batch 7's (the tube); the model takes 05 05_8's 14,3 and 25,4.
- **F10:** settled by scale: the outer drawn circles on 05 05_3 and _6 are the tables' D (21.82 and the ratio 1.204), the 22,5 and 24 written on them are the blanks'. The model builds D. No action.
- **F11:** recorded estimate (README "The train (P1b)"); the cards still give the old tips (M11).
- **F12:** the bearings are as the reading says, and so built: brass bushes WN-300/301/302 and the bridge's WN-300; a jewel only at the seconds' bridge end; the 6MX's chatons at 38 (both) and 35 (top) by Altmeppen (README 458). The transcription's misreads (M1, M2, M4-M7 of the reading) are not in the model.
- **F13:** superseded as recorded (README 80).
- 05 05_10's pivot tolerance reads "1,2 Ø ±0,02" with an uncertain sign (`z10piv.png`); the model's −0,02 follows the 1943 kompl. 05 05_8, which supersedes it. No action.

---

## Findings

Twelve findings in all:

- **Possible/likely (sheet and photograph):** M1, M3.
- **Version:** M4.
- **Joint:** M6.
- **Dimension and fit:** M7, M8, M9.
- **Text or record:** M2, M5, M11, M12.
- **Build book:** M10.

None changes the going train's ratios, centres or tooth outlines, so gearing.js's meshes and the escapement's drive are unchanged. M1, M3 and M9 change the wheels' and arbors' masses by a few milligrams: their inertia at the escape wheel moves under 0.01 % (the seconds hub's 0.2 boss adds about 0.27 g·mm² about its arbor, 0.004 g·mm² at the escape wheel against the train's 6). `wempe_inertia.py --write` (and the 6MX's table, which ci.py doesn't check) would go stale and need rewriting, then `wempe_escapement.js`, `dynamics.js --model wempe` and `wempe_transmission.js` to confirm no change; and `fine.py`, `exploded.py`, `assembly.py`, `bom.py`, `holecheck.py` with `--model wempe` for the heights.

**M1. Likely (sheet and photograph), 05 05_2, _5, _8 with 05 05_3, _6, _9 (every version), the wheels' hubs.**
- The sheets: each kompl. sheet draws the hub's face 0,2 off the rim's, at Ø 6, 7 and 10, beside hubs of 6,5 −0,2, 7,5 −0,1 and 10,6 −0,2. The wheels are cut from 1,2, 1,2 and 1,5 sheet to rims of 1,0, 1,0 −0,1 and 1,3 −0,1. Each pinion's seat is then 0-0,1 longer than its hub at the metal's thickness (1,2 +0,1 on 1,2; 1,3 −0,1 on 1,2; 1,6 −0,1 on 1,5 with the 0,2 lip), the same stand for riveting in all three.
- Wempe 3955: the seconds wheel's hub stands proud as a disc about Ø 6.5 on its top-plate face, its riveting ring round the arbor (likely); the centre wheel's hub shows a brass wall under its pinion (possible).
- The model: the centre wheel's boss Ø 9.99, 0.25 proud on the dial side (rim 1.25, stock 1.5); the intermediate's and seconds' hubs flush with their rims (since 26 October 2026).
- How sure: sure that the three are treated differently; likely that each hub keeps the metal's thickness; possible on the side for the seconds wheel (the sheet's 0,2 at its pinion's face, the photograph's proud face toward the top plate).
- Correction: the same for all three. Leave each hub the metal's thickness (1.2, 1.2, 1.5) out to Ø 6, 7 and 10 (inside the hubs' 6.4, 7.45, 10.5), standing 0.2-0.25 proud of the rim. For the intermediate and centre on the dial side, as their sheets draw it. For the seconds, the owner's choice between the sheet (toward its pinion, the rim then 0.2 further from the pinion's face) and Wempe 3955 (toward the top plate). Check the clearances after: the seconds rim to the intermediate pinion's end is 1.105 now.
- Physics: no measurable change; rewrite the inertia tables and rerun as above.

**M2. Text (README 84, 85, 806; app.js's cards, every version).**
- README 84: "its hub, left 0.2 thicker than the rim … stands proud toward the pinion, which is what lets it clear"; 85: each hub 0.2 proud. The cards: the intermediate wheel "Its hub stands 0.2 proud on the dial side"; the seconds wheel "Its hub stands 0.2 proud toward the pinion" and (PARTS) "so its rim clears the intermediate pinion's end".
- The model: both flush since 26 October 2026; the rim clears the pinion's end by 1.105 since its leaves became 3.25.
- How sure: sure.
- Correction: rewrite them once M1 is settled.
- Physics: no.

**M3. Likely (reading), 05 05_4 (every version), the seconds arbor's post.**
- The sheets: every pivot and post end on 05 05_4, _7 and _10 is drawn as a 60° centre point (the 9,2 post, the 4,5, 4,6 and 5,1 pivots, the centre's dial end at 16,7: `b6m\ends.png`). The kompl. sheets give the finished ends rounded: the train-side pivots 3, the post 7,2 (05 05_2, 1940). Each turned length exceeds its finished one by 1,5-2,1 (4,5/3; 4,6/3; 5,1/3; 9,2/7,2). 05 02_1 and the coloured section draw the seconds hand at the 7,2 post's height (README 147).
- The model: the train-side pivots cut to 3 (the code's rule, which holds), but the post built to the 9,2 with a rounded end, 2.625 over the dial, the hands raised 2 mm to suit (README 147).
- How sure: sure that the post's tip is drawn as a centre and that the model treats it unlike the pivots; likely that the finished post is 7,2.
- Correction: the post 7.2 from its shoulder, rounded, tapering from Ø 0.75 at 1:90 (about Ø 0.67 at its end), standing 0.6 over the dial's face; lower the hands as README 147 raised them (batch 7, dial.js). Or keep 9.2 and record in README Estimated that the 1946 sheet's length is taken as finished against its own drawn centre.
- Physics: no (the post's mass is negligible; the inertia tables and the hands' heights need the reruns above).

**M4. Version, 05 05_2 and _5 (1940) against 05 05_4 and _7 (1946/48): "as first drawn" and "1943".**
- The sheets: 05 05_2 (1940): the post 7,2 long, Ø 0,73 over its first 2 ("i/Steinlager einpassen"), the train-side pivot Ø 0,8 −0,02 × 3, shoulders 24,0 (9,2 ±0,05 + 14,8), seat 1,3 −0,1. 05 05_5 (1940): pivots Ø 0,82 −0,02 × 3 −0,1.
- The model: all five versions build the 1946/48 pinions. The first-drawn cards (app.js REVP) give "24 −0.05 between its shoulders, the wheel's seat 1.3 −0.1" and the intermediate's "pivots Ø 0.82 −0.02", but not the post's 7,2 and Ø 0,73 or the 0,8 pivot. The 1943 version (drawn 1943) shows the 1946 pinions too.
- How sure: sure.
- Correction: if M3 is taken, the post is 7.2 in every version and what remains is diameters (0.73 against 0.75, 0.80 against 0.81) and 24.0 against 24.05: add them to the first-drawn card and give the 1943 version the same card. If M3 isn't taken, build the 7.2 post in "first" and "1943" as a version group (2 mm shows).
- Physics: no.

**M5. Text, train.js and README (every version).**
- train.js lines 98-99: "The sheets' 1.6 −0.1 for the seat and collar together (05 05 03-2) leaves 1.8 between the pinion's end and the framed 19: not settled (README)". The README closed it on 16 October 2026 (line 853), and the code builds the seat alone (1.55) with a 0.255 lip. README 597 still lists it as "Unresolved".
- train.js line 95: "the pinion sheet's 39.65 −0.1 overall is the blank's, with its centre". 05 05_10 has its own blank view (Hz, 44,4 −0,2); 39,65 belongs to the finished view, whose dial end (16,7 −0,2 over the journal's step) ends in a centre. The 1943 kompl. cuts it to 14,3, flush with the tube.
- README 595: "the centre and intermediate pivots' tapers (1:30, 1:90…)". The centre's pivot is 1:90 since 25 October 2026.
- How sure: sure.
- Correction: the comments and README lines only.
- Physics: no.

**M6. Joint, 05 05_8 (every version), the cannon tube on the centre arbor's shank (the tube is batch 7's).**
- The sheet: the shank Ø 1,8 g6 (a clearance shaft), the tube on it held by the "Körner": a punch driven into the tube's round groove, its wall dented into the shank's groove under it.
- The model: the tube's bore is 0.01 clear of the shank all along; both grooves are built, but nothing is pressed into the shank's. On the solid nothing holds the tube, and bom's `050503-3 round 050503-2 press` passes on the gap.
- How sure: sure.
- Correction: three punch dents in the groove's floor (estimated: 120° apart), each the tube's wall pressed about 0.1 into the shank's groove (in the model, three small bosses inside the bore at the groove, clear of the groove's square shoulder, so the slip the hand-setting needs stays a friction slip). bom: `050503-3 round 050503-2 free` with "held by the punched groove" in its fn, or a new `in` relation on the dents. Add a fine.py expected entry if the dents touch the shank.
- Physics: no (the cannon pinion's slip window is wempe_motionwork.js's friction figures, not geometry).

**M7. Dimension, 05 05_10 (every version), the shank's diameter.**
- The sheet: "1,8 Ø g6", framed: 1.792-1.798.
- The model: Ø 1.800 at C, 0.002 over g6's top.
- How sure: sure.
- Correction: 1.795 at C (`rSh`), with the 1:80 kept. The tube's bore follows (`rSh + 0.01`).
- Physics: no.

**M8. Fit and text, train.js line 309 (every version but the 6MX), the bridge's bush WN-300.zb.**
- The source: 05 05_1's "Lagerstellen: Enger Laufsitz" for every bearing; the top plate's WN-300s are bored 0.02 over their pivots (0.845 and 0.83 since 25 October 2026).
- The model: the bridge's WN-300 is still Ø 0.86 on the 0.825 pivot (0.035 over, about the top of a close running fit's 0.006-0.026 for 1-3 mm); its comment says "as the top plate's".
- How sure: sure.
- Correction: Ø 0.845; the comment updated; bom's endshake and the bearing's least gap reread.
- Physics: no.

**M9. Fit (riveting), 05 05_4, _7, _10 (every version), the wheels' seats.**
- The sheets: seats 1,2 +0,1 (seconds), 1,3 −0,1 (intermediate), 1,6 −0,1 with a 0,2 lip (centre). Each is riveted ("vernietet").
- The model: three treatments. The centre's seat is 1.55 with its lip as turned. The intermediate's is cut to its wheel's 0.95, nothing left to rivet, and its neck is 0.35 long to make up. The seconds' is 1.25, standing 0.25 past the flush hub, not spread. README 601 says "each seat drawn to the hub's face".
- How sure: sure.
- Correction: one rule. Each seat its sheet's length (1.25, 1.25, 1.55) and drawn as turned, the rivet's stand left proud, as the centre's is. With M1's hubs at the metal's thickness, each then stands 0-0.05 past its hub. The intermediate's neck goes back to its 2.5. README 601 rewritten.
- Physics: no (masses as M1).

**M10. Build book (pp. 92-113) and bom.json.**
- The pages:
  - pp. 92, 97, 109 (the assemblies): the drawing number is the wheel's (05 05 03-1, 05 05 02-1, 05 05 01-1), not the assembly's (05 05 03, 05 05 02, 05 05 01).
  - p. 93: the centre arbor's dial end and its train-side pivot are drawn as long bulging arcs. The crown (r 3.1) and the 1:80 taper are fitted as one arc, and the pivot's 1:90 taper as another. The journal's Ø 2.2 e8 and 1:30, the shank's Ø 1.8 g6 and 1:80, the pivot's Ø 1.2, the lip's Ø 3.0 and the groove are not dimensioned; only Ø 2.50, 5.40 and 6.78 are.
  - pp. 98, 110: the pivots' diameters (0.85; 0.82, 0.76 to 0.65) and tapers aren't given.
  - p. 111: "largest Ø 3.13" beside "Ø 3.17" in the same text.
  - pp. 95, 100, 112: the wheels' bore, hub, rim's inside, spokes and 72° aren't dimensioned on the plan (only the tip and the thickness).
- bom.json: the jewel 05 05 04-1 has no relation to its setting (`rel: []`).
- How sure: sure.
- Correction: drawbook, as batches 3-5's (tapers as lines, not arcs; every turned diameter and fit from the profile; assemblies numbered as the kompl. sheet). bom: `050504-1 in 050504-2 press`.
- Physics: no.

**M11. Text, app.js's cards (every version).**
- The cards: the intermediate arbor "z 12, tip Ø 5.0, 4.6 long" with `src:'scaled'`, "the tip scaled on its sheet and the root estimated"; the seconds arbor "z 10, tip Ø 3.4".
- The model since 18 October and 26 October 2026: the intermediate's tip 4.72, root 2.87, leaves 3.25 long; the seconds' tip 3.17, root 1.70 (the escape pinion's proportions; the 5.0 and 3.4 are the turned heads).
- How sure: sure.
- Correction: the cards' figures and notes from README "The train (P1b)".
- Physics: no.

**M12. Possible (sheet), 05 05_1 (every version), the layout's lesser figures.**
- The sheet (schematic, not to scale): 17 from the top plate to the centre wheel's top face; the top bushes' oil cup drawn about 0.8 of the plate's 3,0 deep at the bore (0.9 on 3.35); a small chamfer where each bush meets the plate's inner face (s01w).
- The model: 17.26 (05 05_10's 17,2 +0,05 puts it there, sure); the cup 1.13 deep at the bore (estimated 1.2 on the axis, README 598); no chamfer.
- How sure: possible (the sheet isn't to scale and is superseded where the detail sheets speak).
- Correction: none to the model. In README Estimated, add the layout's 17 against 17,2 +0,05 and its cup's depth (about 0.9) beside the estimated 1.2. Leave the chamfer to batch 8 or 9 (the plates' holes).
- Physics: no.
