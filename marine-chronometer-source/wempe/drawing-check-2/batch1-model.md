# Batch 1, the model against the sheets: the balance (rim and arm, masses and WN-12/12a, timing screws and weights, the staffs, hub and WN-10), the hairspring, collet and pin, the stud, its pin and WN-11, the rollers and stones, the balance jewels

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch1-read.md`, with its Step 3 corrections). Its F1-F28 and the questions the plan hands this step are settled below. The first check failed on this batch (the stud's slot, its pin in no hole). That joint is checked first and holds now (J16).

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit2` (main at 28ab3a44, 3.46.00, with seatcheck.py, the half-round brass collet pin, the straightened inner end and bom.py's press ≤ 0.02 / tap ≤ 0.1). Nothing in it was edited.
- **Scratch.** Every file named below is in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b1m\` (written `b1m\` below).
- **Fit check.** `seatcheck.py --model wempe -v --json` over all five states (`b1m\seat.txt`, `seat.json`): 503 pieces, 481 seated, 11 expected, 0 failing.
- **Solids.**
  - `b1m\dump.py` loads the page (`?snap&qa`, GPU) and freezes it as seatcheck does (phase 0, n 2.5). It writes every visible mesh of `balance`, `hairspring`, `stud`, `rollers`, `balanceJewelsUp`, `balanceJewelsLow`, `upperCock` and `lowerCock` in all five versions to `dump.json`.
  - Measured with `a_bal.py` (rim and arm in the arm's frame), `a_mass.py` (masses, WN-12, timing screws and weights), `a_lathe.py` (r, y rings about the staff), `a_col*.py` (collet), `a_stud.py` and `a_ends.py` (stud, its hole, pin and the spring's ends) and inline scripts. Overlap tests used trimesh's `contains`.
  - The frozen state is the balance at the end of its swing. Plan angles are therefore read in the arm's own frame, and the spring breathes there, so its diameter is read from the code's constants.
- **Sheets.** Measured with `circ.py` (circles fitted on rays), radial profiles and row scans.
  - 05-03_2's masses and rim lines are in the 05 03_2 row below. 05-03_8's sides and spring hole are under F11 / M9.
  - Crops: 05-04_04's hub and its "M1" (`s44_m1.png`), 05-04_05's collar (`s45_z.png`), 05-03_4's hub section and plan (`s4_hubsec.png`, `s4_hubplan.png`), the timing weights (`s2_ttop.png`, `s2_tbot.png`), the masses (`s2_m_*.png`).
  - The coloured section (`Wempe_Einheitschronometer.jpg`) cropped at the hub screws (`col_hub.png`) and at the masses and stud (`col_mass.png`).
- **Overlays.** `b1m\overlay.py` (batch 3's) and `runov.py`, output in `b1m\ov\*.png`: sheet red, book blue, both black.
- **Renders.** `isolate.py --model wempe` of the stud from four sides, the stud and spring in plan, the balance and the rollers with the spring (`b1m\iso\`).
- **Book.** `book/wempe-build-book.pdf` (WBOOK), titled v3.41.00 (27 October 2026, before 3.45.01's stud and 3.46.00's pins):

  | Pages | Part |
  |---|---|
  | 121-136 | balance: rim 122, masses 126, timing 128, staff 131, hub 133, screws 135 |
  | 137-142 | hairspring 138, collet 141 |
  | 143-147 | stud 144, screw 146 |
  | 148-152 | rollers 149, 151 |
  | 181-194 | jewels |

  The pages were rendered with their text (`b1m\book\`).

**Frame of reference.** The movement's y (dial side +y). The top plate's outer face is at −22.35. As last revised, the balance's seat (the hub's flange top, FY) is at −22.8: the arm's top −23.95, the rim −26.6 to −22.8 and the masses to −29.26. The upper cock's top (the stud's seat) is at −37.35, and the stud's bar at −38.95 to −37.35. Balance axis (−9.10, 12.11). As first drawn (and in the 1943 version, the 6MX and Wempe 3955) the balance, arm and spring stand 0.3 higher (SH1); the pivots' ends and jewels don't move.

**Which version carries which sheet.**

| part | last | first | 1943 | 6mx | 3955 |
|---|---|---|---|---|---|
| rim and arm 05 03 01-1 (31.7.41, N.gepr. 27.4.43) | yes | yes | yes | yes | yes |
| masses 05 03 01-4 with the WN-12a tapped hole (05 03_2) | yes | yes | yes | yes | plain tops, two poising holes (photographs) |
| timing weights | Ø 4.25 (05 03_2) | 4.25 | 4.25 | 3.8 (photographs) | 3.8 |
| staff 05 04 02 (1946) with brass hub 05 04 02-2 and WN-10 | yes | — | — | — | — |
| staff 040401-1 (1941) with collar 040401-2 (05 04_5), no screws | — | yes | yes | yes (estimated) | yes (estimated) |
| pivots from 05 03_3.2 (1965) | yes | yes | yes | yes | yes |
| hairspring 05 03_6/_7, collet 05 03 02-2 (24.2.43), stud 05 03 02-3, pins -4 | yes | yes | yes | yes | yes |
| impulse roller 02 04 02 (beryllium copper) | yes | yes | yes | yes | steel (photograph) |
| discharge roller 05 04 04-1 (no sheet), jewels (no sheet) | yes | yes | yes | yes (endstone a ruby, steel screws) | yes |

05 03_3-1 (17 04 01, a 5.73-long staff) is another instrument's and is not built (F26, agreed).

---

## 05-03_4 (05 03 01-1, Unruhreifen, 2:1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outer Ø | 32,32 −0,04 | 32.300 | mid | match | sure |
| joint Ø (steel/brass) | 31,29 −0,04 | 31.270 | mid | match | sure |
| inner Ø | 30,48 +0,04 | 30.500 | mid | match | sure |
| height | 3,8 | 3.800 | 0 | match | sure |
| arm thickness | 1,15 | 1.150 (−23.95 to −22.8, at the rim's lower face) | 0 | match | sure |
| arm width at rim / neck / point | 3,2 / 4 / 6,5 | 3.2 / 4.00 at 6.13 out / 6.50 | 0 | match (overlay `ov\arm.png`: book unmatched 1.4 %) | sure |
| flank r 20, centre marked | 20 r | r 20, centre 7.01 along, 21.98 across | — | match | sure |
| centre hole | 2 H7 +0,009 | Ø 2.009 | top of H7 | within | sure |
| side holes | Ø 1 at 2,14 +0,02 | Ø 1.000 at ±2.140 | lower limit | within | sure |
| the side holes' sink | "1,8 Ø H7" (leader at the hole 2.14 out, Step 3 correction 3); plan rings the left hole only; "0,4" arrow lands 4.4 from the axis (`s4_hubsec.png`) | both countersunk 90° to Ø 1.8, 0.4 deep, on the arm's top | — | form from the coloured section, whose WN-10 heads are conical, flush in the arm (`col_hub.png`: sure). The H7 and the 0.4 don't attach to a countersink (M10) | likely |
| timing screws' holes | Ø 0,9, 0,16 Steigung, 2,15 over the lower face | bore Ø 0.94 (flats 0.47), plain, y −24.95 (2.15) | thread not drawn | M4 | sure |
| cuts | 1,5 +0,2 at 90° to the arm | 1.60 (±2.84° at r 16.15), at 90° | mid | match | sure |
| material | nickel steel inside, brass outside, arm one with the steel | the same, density 8.1 / 8.45 | — | match | sure |
| "8 Körner in 60 Teilung" | 8 punch marks of a 60-division | not built (README "Left out, small") | — | M11 | sure |
| polish ▽▽▽ "poliert" at the outer face | — | — | — | not geometry | — |

## 05-03_2 (05 03 01, Unruh, 5:1, a poor copy) and 05-03_1 (127-556.04 U09, Unruh kompl., 5:1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| masses' Ø | 05-03_1: [6,35] boxed. 05-03_2: the outer ring scales Ø 6.32-6.33, by its rim's inner and joint lines (30.48 and 31.29 at r 186.75 and 191.75 px, 12.25 px/mm; `circ.py`, radial profiles), with an inner ring 0.29 inside it | Ø 6.300 | −0.05 | **M1** | likely |
| masses' height | 05-03_1: [6≈] boxed, "Höhe übereinstimmend mit 2400 Schwingungen"; 05-03_2: 6.40 near pair | 6.46 from the rim's lower face | — | within "≈ 6", set by the rate (recorded, README "Their height") | likely |
| masses' top chamfer | 05-03_2 plan: inner ring 0.29 in; side view about 0.4 | none (README "left out") | — | M11 | likely |
| masses' place | 05-03_2 scales 32.5; Wempe 3955 30 | 30.0° from the cuts' line, centres r 15.70 | — | as recorded (README "Their place") | likely |
| masses straddle the rim | dashed rim lines through each mass (05-03_2) | slot from below to 0.02 over the rim's top, 0.02 clear each side | — | match | sure |
| WN-12 | dashed radially from the mass's outer edge to the rim, its head sunk at the outer face, about 1/3 up (05-03_2 plan; the coloured section shows it end-on as a dashed thread circle) | shank Ø 0.84 from r 16.18 to 18.285, head Ø 1.6 × 0.55 flush in the round side, 1.85 over the lower face | — | form matches; the shank lies in solid brass with no hole, and its tip stands 0.03 off the rim (**M2**, S-1) | sure |
| WN-12a | 05-03_2's leader to a mass's centre; the coloured section draws a cheese-head screw in one mass's top | M1.2 tapped 2.0 deep, sink Ø 1.85 × 0.425, in each top, empty (HOLE_EXPECTED) | — | **M5** | possible |
| timing screws | head inside the rim, the weight outside, the tip past the weight (`s2_ttop.png`, `s2_tbot.png`) | head Ø 1.65 × 1.3 on the rim's inner face, shank Ø 0.9 to r 21.05 | — | match | likely |
| 42,1 | 05-03_2: from the screw's tip to the other's (its lower extension line leaves the tip, `s2_tbot.png`; the reader's "nut to nut" is not this) | tips at r 21.05 each, 42.10 | 0 | match; and 05-03_1's "21,05" radius arc is the same tip circle | sure |
| weights | Ø 4.21-4.33 × 3.3, two saw cuts from either end | Ø 4.25 × 3.30, 0.8 short of the tip, cuts 1.3 and 1.7 deep (first, last, 1943); Ø 3.8 (6MX, 3955) | — | match as recorded | likely |
| arm along 6-12 at rest | note on 05-03_1 | built along 12-6 | — | match | sure |
| 05-03_1: stud's 5 and 1,8 | 5 from screw to square end, 1.8 | 4.995, 1.790 | 0 | match | sure |
| 05-03_1: rim [3,8] boxed | rim height | 3.800 | 0 | match (F3 settled: the rim's, not a "stud carrier") | sure |
| 05-03_1: arm to plate 0,4 | gap | rim's lower face 0.45 over the top plate | +0.05 | within the sheet's drawing; the height follows the spring's stack (README "Heights") | likely |
| 05-03_1: cock 16 over the plate, plate 3,3, rollers 32/35 | the lever chronometer's frame | cock 15.0 (05 08 03-1), plate 3.35, the detent's rollers | — | the sheet's frame is the lever's; its balance group is this one's (F1, F28) | likely |
| 05-03_1: 15°/20° pinning points | 5° apart | the pins about 7-10.8° apart in plan | — | recorded (README Physics 2c) | likely |
| 05-03_1: spring 11 high; 05-03_5: 3,15, 9,5, 13,4 | — | collet's underside 13.35 under the stud bar's underside (−0.05); spring's lower end 0.75 over it; top pin in the stud's hole 3.78 under the bar (curve 3.99) | 13.4: −0.05; 3.15: +0.63; 9.5: −0.68 | recorded: 11.80 turns of helix (the 13 turns less 3.5 mm read as the whole strip) against the drawn 13 pitches (README Physics 2c) | likely |

## 05-04_04 (05 04 02, Unruhwelle kompl., 1946, 5:1); last revised only

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| datum | every length from the hub's top face (F8) | FY = hub top = arm's seat | — | match (F8 settled) | sure |
| upper arm | (1,1) Ø at the point, Kegel 1:30, 1,2 ±0,02 at its foot | 1:30 from Ø 1.049 at 10.63 to Ø 1.200 at 6.10 above FY | 0 | match | sure |
| collet's seat | Kegel 1:70, 1,58, its large end 1,65 s6 (+0,022/+0,015), to the 2 h6 step; 6,1 from the hub top to its small end | Ø 1.580 at 6.10 to Ø 1.645 at 1.10 (5.0 long: 1:77) | large end −0.020 to −0.027 under s6; −0.006 on 1:70's 1.651 | **M7** | sure |
| "1:70 over the 6.1" (F9) | the seat 5.0 (1:70 over 0.07 is 4.9) plus h6 1.1 | 5.0 + 1.1 = 6.1 | — | build matches the sheet; the code's wording loose (F9 settled) | sure |
| arm's seat | 2 h6 −0,007, 1,1 over the hub | Ø 2.000 × 1.10 | top of h6 | within | sure |
| in the hub | Kegel 1:70 | Ø 2.000 → 2.059 over 4.1 (1:70) | 0 | match | sure |
| hub's bore foot | 2,14 +0,01 | opened to Ø 2.14 over 0.04 | — | match as read | likely |
| hub flange | 6,3 −0,1 × 1,8 | Ø 6.25 × 1.80 | mid | match | sure |
| hub neck | 2,63 −0,06 to 4,1 +0,05 | Ø 2.60 to 4.10 | within / lower limit | match | sure |
| hub holes | "M1" with its own arrows across the left hole (`s44_m1.png`: the reader's M8 refuted); threads drawn | two plain Ø 1.04 bores at ±2.14, no thread | +0.04 over M1, untapped | **M3** (S-6) | sure |
| impulse roller's seat | 1,65 s6 (+0,022/+0,015) under the hub | Ø 1.650 straight, 4.1 to 5.6 | −0.015 to −0.022 under s6 | M7 | sure |
| discharge roller's seat | 1,2 r6 (+0,019/+0,012) | Ø 1.200, 5.6 to 7.32 | −0.012 to −0.019 under r6 | M7 | sure |
| lower arm | Kegel 1:70 to (1,1) | 1:70 from Ø 1.200 at 7.32 to Ø 1.159 at 10.19 | 0 | match | sure |
| 14,03 −0,06 | the hub top to the lower centre (blank) | pivot end at 12.59 | — | the blank's (README Readings corrected 217) | sure |
| "gehärtet, anlassen 240°" | — | card | — | match | sure |

## 05-03_3-2 (050401, Unruhwelle kpl., 1965): its pivots, built on the 1946 staff; every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| pivots | Ø 0,21 "in Lagerstein einpassen" × 0,4, cones 2 hollow on R 6 ("6": 0,6 or 6,0, F15/M14) | Ø 0.210 × 0.40, cones 2.0 concave R 6 | 0 | match (R 6 likely, recorded) | likely |
| upper end | 13,0 over the flange top (by 25,6 −0,02 and 12,6 −0,02: 12.98-13.02) | 13.03 | +0.01 over | **M6** | sure |
| lower end | 12,6 −0,02 | 12.59 | mid | match | sure |
| overall | 25,6 −0,02 | 25.62 | +0.02 over the top | **M6** | sure |
| endshake | — | 0.02 off each endstone (0.04) | — | estimate (README) | — |

## 05-04_05 (040401-1, 1941, 5:1): as first drawn, the 1943 version, the 6MX and Wempe 3955

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| collar's neck | 2,1 Ø ±0,03, 1,3 over the flange (`s45_z.png`: its hatched wall in the right half rises with the 1.3, so the 2.1 is the collar's neck, not the staff: the reader's "staff above the hub" is not this) | Ø 2.00 × 1.15, riveted flush in the arm's 2 H7 | −0.1 | estimate recorded (the arm's 2 H7 takes 2.0) | likely |
| flange | 6,3 Ø × 1,8, 0,4 straight then 10° | Ø 6.30, 1.80, 0.4, to Ø 5.806 | 0 | match | sure |
| tube | 2,6 ±0,03 (its extension line from the tube's outline) to [4,7 −0,05] | Ø 2.60 to 4.70 | 0 | match | sure |
| [14 ±0,03] | blank, the lower centre | pivot end at 12.89 under the flange | — | the blank's | sure |
| no holes in the collar | — | none; the arm's two holes empty (HOLE_EXPECTED) | — | holds as a version mix (the arm's sheet is 31.7.41, after the collar's 4.4.41) | likely |

## 05-03_5, 05-03_6, 05-03_7 (the hairspring) and 05-03_8 (the collet, 05 03 02-2, 24.2.43, 10:1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| strip | [0,52] × [0,285], blued | 0.52 × 0.285 | 0 | match | sure |
| coil Ø | [12,8 ±0,05] | middle r 6.2575 ± 0.1425: 12.80 | 0 | match | sure |
| pitch | 0,21 between | 0.73 | 0 | match | sure |
| turns | 15 links as wound; 13 Umgänge −3,5 mm before the curve | 13 × π·12.515 − 3.5 cut, 11.80 turns of helix, left-hand | — | as recorded (README Physics 2c) | likely |
| terminal curves | 05-03_7's bold radii every 10°, pinned at [220°] | TBL identical to the reader's 26 figures; both ends | 0 | match | sure |
| item 24 | the pin at both ends (F5) | 05 03 02-4.c and .s | — | match (F5 settled) | sure |
| collet: length | 9,1 Ø −0,2 (ends arcs about the bore) | arcs r 4.55 | mid | match | sure |
| collet: widths | 3,8 −0,2 / 2,7 −0,2 | 3.80 / 2.70 (drawn on the sheet about 3.46 / 2.63 at 34.5 px/mm: its taper is not drawn to scale) | top | match the figures | sure |
| collet: height | 3,3 | 3.30 (−27.3 to −24.0, 0.05 over the arm) | 0 | match | sure |
| collet: slit / web | 0,2 +0,1 / 0,1 +0,05 | 0.25 / 0.126 | mid | match | sure |
| collet: bore | 1,6 H7 on 1:70, (1,55) | Ø 1.647 at the arm's face to 1.604 on 1:70, the 1946 seat's | — | version mix recorded (README Readings corrected 203) | sure |
| spring hole: place | 3,5 −0,02 from the bore, 0,75 ±0,05 from the arm's face | 3.50, 0.75 | top / 0 | match | sure |
| spring hole: size | Ø 0,8 +0,01 "0,7 bohren", Kegel 1:90 to (0,77) | Ø 0.80 straight | taper (0.03) left out | M11 (the code's "0.004" is wrong, M8) | sure |
| spring hole: direction | "90°" to the tapered upper side; the drawn hole leans 2.0 ±0.7° from square to the bar's centre line, toward the side's 3.6° | square to the bar's centre line | about 2-3.7° | **M9** | possible |
| material | Messingblech Ms 58 | brass | — | match | sure |

## 05-03_9 (05 03 02-3, Klötzchen, 5:1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| bar | 14,6 −0,2 × 3,1 −0,2, 1,6 −0,2 thick | 14.595 × 3.100 × 1.600 | top limits | within | sure |
| square end | 2,5 −0,2; 1,2 −0,1 from the centre line to its lower edge | 2.50, ±1.25 | top | within (no slot: the reader's sure) | sure |
| hole for WN-11 | 1,5 H7 +0,009 (05-03_5's "1,4 Ø" is the screw's M1.4, F22) | Ø 1.509 | top of H7 | within; M1.4 screw | likely |
| hole to square end / to V apex | 5 ±0,1 / 6,6 −0,2 | 4.995 / 6.600 | 0 | match | sure |
| point | 0,8 Ø round | knife edge from two facets (README "Left out, small") | — | recorded, kept | likely |
| facets | V in plan; the section bevels the face opposite the upright | two facets on the screw-head face to a ridge, 3.0 from the V to the point | — | match (the section is drawn upright-up, so its "underside" is the head's face) | likely |
| upright | 1,8 g6 (−0,003/−0,010) × 1,9 −0,2 across, 6,1 −0,2 from the bar's top, 98° | 1.790 × 1.86 × 6.10, leaning 8° toward the axis | at g6's lower limit | within | sure |
| upright's far edge | 1,6 −0,2 from the centre line | 1.57 | — | within | sure |
| hole Ø 0,7 | at the upright's end, along the bar, "bei Montage der Spirale gebohrt" | Ø 0.70 (flats 0.35) along the bar, 0.72 from the end, 0.36 toward the axis from the middle, 3.459 from the staff | — | match (J16) | sure |
| slot | none in any view | none | — | match (the first check's error is gone) | sure |
| material | Flachmessing Ms 58 | brass | — | match | sure |

## 05-04_06 (020402, Heberolle, rev. 10.9.41, 10:1); every version

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| Ø, thickness | 6,78 ±0,01 × 1,6 +0,1 | 6.780 × 1.600 | lower limit (thickness) | within | sure |
| bore | 1,65 −0,03 at its large end, 1,627, "Kegel 1:70 aufreiben" | Ø 1.653 straight | +0.003 over the large end's limit; not tapered | M7 | sure |
| crescent | r 3,5, corners 2 and 1,5 either side of the stone's face | the same (overlay `ov\roller_plan.png`: every line coincides, not mirrored, turned 33°) | 0 | match | sure |
| stone | 0,5 × 1,8 from 1,55, slanted end, 1,7 wide, eingelackt | 0.5, 1.55 to 3.35, end bevelled 45° to 2.85, 1.70 (0.05 proud each side) | 0 | match | sure |
| stone's face on the diameter | 0,005 (two arrows on the centre line) | on the centre line exactly | 0 | satisfies either reading (F12/M13) | sure |
| hole Ø 1,3 | 1,9 below, 0,7 to the stone's side | the same | 0 | match | sure |
| material | Kupfer Beryllium, Saphir | copper (3955: steel) | — | match | sure |

Discharge roller (05 04 04-1, no sheet): 2.77 × 2.15 scaled on 05 04_1, 1.6 thick, stone 1.7 wide reaching r 1.578. These are estimates (README).

## Jewels and endstones (no sheet; coloured section and U30); every version

| feature | source | model | verdict |
|---|---|---|---|
| settings in the cocks' seats | Ø 5,2 H7 (05 08 03-1, 05 08 00-2) | Ø 5.200 in 5.206 | match; held by screws (J23) |
| hole jewels | coloured section Ø 2.9 × 0.8, olive, sink | Ø 2.9, hole Ø 0.23 on the Ø 0.21 pivot (0.02) | estimate recorded |
| endstones | Ø 2.9, upper "Diamantdecke" (05-03_1) | Ø 2.9, the pivot 0.02 off each; upper drawn clear/steel-white (3955), 6MX ruby | estimate recorded |
| upper settings | U30: two settings, 0.1 proud; WN-55 M1.2 | setting tops 0.1 proud; WN-55.ck held by the cock (seatcheck) | match |
| lower settings | in the lug; WN-10 (label 10 or 18) | WN-10.bl M1.2 held by the lower cock (seatcheck) | match as read |

---

## Step 5, overlay

| page (v3.41.00) | sheet | result |
|---|---|---|
| 122 rim plan | 05-03_4 plan (2:1, 7.0 px/mm) | `ov\rim_plan.png` (scale 0.98): all three rim circles coincide. The book draws the balance turned about 20° (the frozen swing), so the arm and cuts sit at another angle; the A-A section line is then not along the arm. Turned −70°, `ov\arm.png` lays the arm on the sheet's flanks, swelling, point and three holes (book unmatched 1.4 %). Unpartnered: the sheet rings the left side hole only, the book both (the model's two countersinks, M10); the sheet's 60-division ticks (M11). |
| 131 staff | 05-04_04 (5:1) | `ov\staff.png` (turned 179°, at its scale bound 1.06): the seats and hub line up. The book has the finished pivots, the sheet the blank's centres (the 14.03 recorded). The book gives no taper (1:30, 1:70) or fit (h6, s6, r6). |
| 141 collet | 05-03_8 (10:1, 34.5 px/mm) | `ov\collet_plan.png` (scale 0.92): the long sides and slit lie on the sheet's. The scale is off because the sheet draws the wide end 3.46 for its written 3.8, not because of the model. Unpartnered: the sheet's hole lines lean about 2° (M9); the book still shows the old Ø 0.22 rod in the hole (v3.41). `ov\collet_sec.png` (score 0.26): the sheet's section is pictorial (README), no reading. |
| 144 stud | 05-03_9 (5:1) | `ov\stud_sec.png` (mirrored, turned 180°): bar, upright, the bevel and the screw's hole coincide. Unpartnered: **the book's slot and the old pin in the upright** (v3.41, before 3.45.01). `ov\stud_plan.png`: the sheet's straight tail and V against the book's tail drawn as bulging arcs (drawbook's arc fit, as batch 6's p. 93). The current stud is in the renders `iso\r_iso_stud.png` (four sides) and `iso\r_iso_stud_hairspring.png` (plan): solid upright, the Ø 0.7 hole along the bar with the spring's end and the half-round pin's two ends standing 0.45 out, facets on the head's face. |
| 149 impulse roller | 05-04_06 (10:1) | `ov\roller_plan.png`: crescent, slot, stone, bore and Ø 1.3 hole all coincide. `ov\roller_side.png`: thickness and stone's 1.7 coincide. The bore is drawn straight in the book and model (M7). |
| 138 hairspring | 05-03_6 | not overlaid. The book draws the spring breathing at the frozen swing, its "12.51" and "12.41" not the boxed Ø 12.8, with no strip, pitch or turns figure (M12). |
| 126 masses, 128 timing, 133 hub, 135 WN-10, 146 WN-11, 151 discharge, 181-193 jewels | 05-03_2 a poor copy; no detail sheets | renders `iso\r_iso_balance.png`, `r_iso_rollers_hairspring.png`: forms as the tables above |

The whole book for these parts gives no fit, taper or thread (H7, h6, g6, s6, r6, 1:30, 1:70, 1:90, M0.9 × 0.16, M1, M1.2, M1.4), no rim inner diameters, no cut width, no arm widths and no timing screws' height (M12).

---

## Step 6, fit list

Seatcheck's rows are from `b1m\seat.txt` (as last revised; the same in the other states where the piece exists).

| J | piece | into / onto | seat (sheet) | held by (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | upper pivot Ø 0.21 | hole jewel, endstone | "in Lagerstein einpassen" | the cock | in Ø 0.23 (0.02), 0.02 off the endstone | holds (estimate) |
| J2 | lower pivot | lower hole jewel, endstone | as J1 | the lower cock | as J1, 0.02 off | holds (estimate) |
| J3 | settings (upper two, lower two) | cocks' Ø 5.2 H7 | 05 08 03-1, 05 08 00-2 | WN-55.ck / WN-10.bl M1.2 over their edges | Ø 5.200 in 5.206; WN-55.ck held 17/34 by upperCock, WN-10.bl 17/34 by lowerCock | holds |
| J4 | stones in their settings | — | burnished (coloured section) | lips | lips drawn; bom has no relation for 050407-1.bu/.bl, 050408-1.bu/.bl | holds (relations missing: M13) |
| J5 | arm (last) | hub flange, staff's 2 h6 | 2 H7 on 2 h6 | WN-10 ×2 into the flange's M1 (05 04 02, coloured section) | hole 2.009 on 2.000 (0.0045); WN-10 held 11/29 by the arm's Ø 1.0 only; the hub's holes plain Ø 1.04, the shanks plain Ø 0.96 | **the screws grip nothing in the hub (M3, S-6)** |
| J6 | staff (last) | hub bore | 1:70, pressed | press | 0.0015 clear radially on 1:70 | holds as the model's convention (bom press ≤ 0.02) |
| J7 | arm (first, 1943, 6MX, 3955) | collar's neck | 2 H7 on the neck (2,1 ±0,03 on 05 04_5) | riveted | neck Ø 2.00 flush in 2.009; the rivet not drawn | holds as recorded (bom dev) |
| J8 | timing screw ×2 | rim's tapped hole | M0.9 × 0.16, 2.15 over the lower face | thread | shank Ø 0.9 plain in plain Ø 0.94; held 42/71 by the weight and rim | holds by fit; thread not drawn (M4) |
| J9 | timing weight ×2 | timing screw | its thread, split by two cuts | friction of the split | bore Ø 0.9 line to line on the plain shank, cuts drawn | holds by fit (M4) |
| J10 | mass ×4 | rim | straddling it | WN-12 radial through the outer jaw onto the rim (05 03_2, coloured section) | slot 0.02 clear each side; WN-12 buried 27/27 steps in the jaw (no hole), its tip 0.03 off the rim | **does not hold on the solid (M2, S-1)** |
| J11 | WN-12a | mass's top | M1.2 tapped (05 03_2's leader; the coloured section's screw in one mass) | its thread | hole empty in all four (HOLE_EXPECTED) | M5 |
| J12 | collet | staff's 1:70 seat | 1,6 H7 on 1:70 (1943 sheet) on 1.58-1.65 s6 (1946) | the slit's grip | bore 1.647 → 1.604 on the seat, 0.0015 clear | holds as recorded (version mix; README) |
| J13 | spring's inner end + pin -4 | collet's Ø 0.8 hole | Kegel 1:90, 3.5 from the bore | taper pin (item 24) | pin held 28/37 by the collet; no spring vertex in the collet or pin (trimesh); the end straightened along the hole | holds (the hole's direction and taper: M9, M11) |
| J14 | stud bar | cock's top | Ø 1.5 H7 hole | WN-11 into the cock (coloured section) | WN-11 M1.4 held 24/62 by the cock (tapped); hole 1.509 | holds |
| J15 | stud upright 1.8 g6 | cock's slot 1.8 H7 (centred on the setting's line: batch 8) | g6/H7 | the fit | 1.790 in 1.800 (0.005 each side); inner face 0.011 off the slot's 82° inner wall | holds |
| J16 | spring's outer end + pin -4 | stud's Ø 0.7 hole | along the bar, drilled at assembly | the pin (item 24) | the strip passes the whole 1.79 of the upright inside the hole (0.33 of its 0.35 radius), its end 0.015 inside the far face; the pin's round 0.349 in the 0.35, its ends 0.45 out; pin held 17/27 by the stud; nothing overlaps | **holds (sure)** (the first check's failure, ledger J1) |
| J17 | impulse roller | staff's 1.65 s6 seat | 1:70 reamed 1.65 −0.03 / 1.627 | press | straight 1.653 on straight 1.650, 0.0015 clear; 0.12 of its bore over the 1.2 step | holds as the convention; fit not drawn (M7) |
| J18 | impulse stone | roller's slot | 0.5 | shellac | slot 0.506 for 0.5 | holds (no bom relation: M13) |
| J19 | discharge roller | staff's 1.2 r6 | — (no sheet) | press | 1.203 on 1.200 | holds as the convention (M7) |
| J20 | discharge stone | roller | — | — | in its slot | estimate |

With bom.py's press tolerance at ≤ 0.02, J6, J12, J17 and J19 pass on their 0.003 gaps, and J10 passes only through its `embed` excuse.

---

## Extra checks

### (a) Slots, notches and grooves

| described | against every view | verdict |
|---|---|---|
| the stud's slot (the first check's error) | 05-03_9's plan, end view and section draw the upright solid; 05-03_5 draws the spring's end into it beside the pin | none built: right. Stale text remains (M8) |
| the cock's slot for the upright | batch 8's sheet (1,8 H7, centred on the setting's line, 82° wall) | built so; the upright fits (J15) |
| the collet's slit | plan and section | built 0.25, web 0.126: right |
| the impulse roller's crescent and the stone's slot | plan; side view | built: right |
| the timing weights' saw cuts | 05-03_2's plan, both weights (`s2_ttop.png`, `s2_tbot.png`): one cut from each end, drawn as lines about 1.1 off the axis | built as two cuts across the diameter at right angles. 05-03_2's off-axis lines read as cuts about 31° either side of the view; the photographs decided (code: likely). No change |
| the masses' slot over the rim | 05-03_2's dashed rim lines | built: right |

### (b) Drawn holes

Every hole the reading lists is in the model:
- the arm's three;
- the timing screws' two;
- the hub's two;
- the collet's bore and spring hole;
- the stud's Ø 1.5 and Ø 0.7;
- the roller's bore and Ø 1.3;
- the masses' WN-12a holes;
- the jewels' and settings' seats.

Two drawn holes don't do their job:
- the hub's M1 are plain (M3);
- the masses have no WN-12 hole (M2: a screw drawn, its hole not).

### (c) Excuses

| entry | re-judged |
|---|---|
| SEAT_EXPECTED stud 050302-3 | holds: a bar on the cock screwed down by WN-11, its upright in the slot (05-03_9, coloured section) |
| SEAT_EXPECTED balance WN-12 "OPEN" | confirmed in all five states (BURIED 27/27 steps). Worse than its text says: the tip is 0.03 off the rim, so nothing holds the mass (M2) |
| HOLE_EXPECTED masses' M1.2 (WN-12a) empty | holds for Wempe 3955's plain tops (not built there). For the drawings' versions the coloured section fits one screw (M5) |
| HOLE_EXPECTED the arm's two holes empty as first drawn | holds (the arm of 31.7.41 drilled for the 1946 hub; the 1941 collar has none) |
| HOLE_EXPECTED the roller's Ø 1.3 | holds (no part goes in it on the sheet) |
| HOLE_EXPECTED 3955's poising holes | holds |
| EXPECTED ('balance:Buffer','balance:Buffer') timing screws' heads on the rim | holds (a contact by design) |
| EXPECTED ('hairspring:Buffer','hairspring:Buffer') "drawn without the hole (a collet of vertical walls)" | stale since 26 October 2026: the hole is cut and no spring vertex lies in the collet or its pin. fine.py will say whether the entry is still met; reword or remove (M8) |
| FLOAT the WN-10 heads in their countersinks | holds |
| bom.json 050301-1 dev (first: riveted on the collar) | holds |
| bom.json WN-12 `in 050301-4 embed`, WN-12a `embed` | WN-12's is the excuse M2 removes. WN-12a's names a screw the model doesn't build |
| bom.json 050302-4.s `on 050302-3` | stale: the pin now goes in the Ø 0.7 hole (`in 050302-3 press`, M13) |
| bom.json stones and spring `rel: []` | relations missing (M13) |
| README 630 (WN-10 "from under the flange"), 99 ("a screw and nut across the rim … 2.45 … the nut sunk"; weights Ø 3.8), 103 ("the spring's end in the upright's slot with its pin"), 633 ("its Ø 0.22 pin") | stale (M8) |
| escapement.js 154-159 ("the stud's slot", "side by side in the slot's 1.2"), 493-494 ("the outer end into the stud's slot, 3.55"), 515-516 hole comment ("the 1:90 taper, 0.004 over its 2.7": 2.7/90 is 0.030 on the diameter) | stale or wrong (M8) |
| app.js cards: stud ("pinned in a slot at its foot"), balance ("staff 25.9 between its pivots"), hairspring ("the outer curve drawn in proportion to end at the stud"), masses ("held by a screw (WN-12) through its outer jaw onto the rim") | stale (M8) |

### (d) The reading's findings and the plan's questions settled against the model

- **05-03_1 is this chronometer's balance** (F1, F28): likely. The rim is cut at 90° to the arm. The masses are boxed 6.35. The stud's 5 and 1,8 match 05-03_9 (4.995, 1.79). The staff's 25,6 matches 05 03_3.2. Its "21,05" radius is the timing screws' tip circle, the model's 21.05 and 05 03_2's 42,1 / 2. Its frame is the lever chronometer's: the cock is 16 over the plate (05 08 03-1: 15 −0.1), the plate is 3,3 and its rollers 32/35 are a lever's. So the balance group is shared and the frame isn't.
- **The masses' boxed 6.35** (F2): adopt (M1). It is an inspected figure, and 05-03_2's outer ring scales 6.32-6.33.
- **The transcription's swapped -2/-3** (F4): sure. The code and the coloured section give -2 the screw and -3 the weight. No model change.
- **Item 24 at both ends** (F5): sure, built as 05 03 02-4.c and .s.
- **05-04_04's hub holes** (F7, the reader's M8): **refuted**. "M1" is written on 05 04 02 with its own arrows across the hub's left hole (`s44_m1.png`, 8×), so the code's "two M1 (05 04 02: sure)" stands. The holes are M1 and the model leaves them plain (M3).
- **05-04_04's datum and "1:70 over the 6.1"** (F8, F9): the model already measures from the hub's top. It builds the seat 5.0 and the h6 1.1 (6.1), and the 6,1 ends at the 1:30/1:70 junction. Only the seat's taper (1:77 as built) and its s6 end differ (M7).
- **05-03_4's 1,8 H7** (F10): the countersink stays. The coloured section draws both WN-10 heads conical and flush in the arm (`col_hub.png`). The H7 and the 0.4 don't attach to the countersink, and the plan rings one hole only. Record (M10).
- **The collet's spring hole** (F11): measured on the sheet. Its dashed lines lean 4 px over 84 (2.7° in the scan), the bar's centre line rises 0.75°, so the hole is about 2.0 ±0.7° off square to the centre line, toward square to the upper side (3.6°). The model is square (M9, possible).
- **The roller's 0,005** (F12): the model puts the face on the centre line exactly, so either reading holds.
- **The stud's Ø 1.4 against 1.5 H7** (F22): 05-03_5 is the assembly and its 1,4 Ø is the screw's M1.4. The hole is 05-03_9's 1.5 H7. Built so. The H7 would suit a locating shoulder on WN-11, but nothing on the sheets draws one (possible, no change).
- **The masses: radial WN-12 or axial WN-12a** (F27): WN-12 clamps, radially. 05-03_2 draws it dashed from the outer face to the rim. The coloured section shows it end-on as a thread at about a third of the mass's height. WN-12a is a cheese-head screw in one mass's top, whose thread stops above the rim. The model has the form right and the joint wrong (M2), and leaves WN-12a out (M5).
- **05-04_05's 2,1 and 2,6**: these are the collar's neck and tube (`s45_z.png`: the hatched walls carry them), as the code reads them. They are not the staff's, as the reading had it.
- **05-03_5's 3,15 and 9,5**: recorded differences, from reading 05 03_7's "13 Umgänge −3,5 mm" as the whole strip (README Physics 2c).
- Unattached figures (F13-F21, F24): none is used by the model except 05-03_4's 0,4 (M10).
- **Stale comments** (F6, the plan's lines 154-159 and 488-489): confirmed at 157-158 and 494 in 3.46.00 (M8).

---

## Findings

Thirteen findings in all:

- **Dimension:** M1, M6, M7.
- **Joint:** M2, M3, M5.
- **Thread:** M4.
- **Possible (sheet):** M9, M10.
- **Features left out:** M11.
- **Text:** M8.
- **Build book:** M12.
- **bom.json:** M13.

**Physics.**
- M1 changes the balance's inertia by +1.1 %. It needs `wempe_inertia.py --write` and the 6MX's table by hand (`wempe_inertia.py --rev 6mx`, which ci.py doesn't check). Then `WESC.SET.I`, `wempe_escapement.js`, `wempe_hairspring.js`, `wempe_thermal.js`, `dynamics.js` and `tripping.js --model wempe`, `wempe_banking.js --write`, the build checks (`wempe_build.js`, `wempe_tolerances.js`, `wempe_bench.js`, `wempe_montecarlo.js` under each `MC_WREV`), `wempe_transmission.js`, `wempe_navigation.js`, `wempe_essaydata.js --write`, `massprops.py --model wempe` and then the Wempe report. The period moves +0.54 %, toward 0.5 s from 0.494.
- M2, M3 and M5 move a few hundredths of a gram on the rim. M5's single screw would also unpoise the balance. Rerun the inertia tables and `wempe_escapement.js`.
- The rest change no physics.
- Every geometry finding needs `solids.py`, `fine.py`, `holecheck.py`, `audit.py`, `exploded.py`, `assembly.py`, `seatcheck.py` and `bom.py` with `--model wempe`.

**M1. Dimension, likely: 05-03_1 and 05-03_2, the masses 05 03 01-4 (every version).**
- The sheets: 05-03_1 boxes the masses' diameter, [6,35], a figure "checked specially at acceptance". 05-03_2 (a poor copy) scales its masses' outer ring Ø 6.32-6.33, by the rim's inner and joint lines at r 186.75 and 191.75 px (30.48 and 31.29: 12.25 px/mm), with a second ring 0.29 inside it.
- The model: Ø 6.300 ("scaled; 05 03_1's Anker balance Ø 6.35 boxed"), where the code's own l. 168 and README Physics 2c take 05 03_1 as this balance.
- How sure: likely. It holds if 05-03_1 is this balance (above), and 05-03_2 agrees within its ±0.05.
- Correction: Ø 6.35 (`mr` 3.175), centres and place kept. The slot over the rim is unchanged. Keep the height at 6.46 (05-03_1's [6≈] is set to the rate).
- Physics: +27.7 g·mm² (four masses 1.494 g each, each ring of 0.025 adding 0.027 g at r 15.7), +1.08 % of `WESC.SET.I` 2575.4. The period moves +0.54 % (−470 s a day before the timing weights re-set it), and the masses' compensating place moves. The tools to rerun are listed above.

**M2. Joint, sure: 05-03_2 and the coloured section, the masses held by WN-12 (every version; S-1).**
- The sheets: WN-12 is dashed radially from the mass's outer face to the rim, its head sunk in the outer face. The coloured section shows its thread end-on at about a third of the mass's height. The mass straddles the rim, and the screw clamps it.
- The model:
  - The shank is Ø 0.84 from r 16.18 to 18.285 and the head Ø 1.6 × 0.55, sunk 0.02 under the round side, 1.85 over the lower face.
  - No hole is cut, so seatcheck finds the shank buried in the outer jaw's brass over all 27 of its steps in all five versions (the SEAT_EXPECTED OPEN entry; bom's `embed`).
  - Its tip stands 0.03 off the rim's outer face (16.15). The mass's slot is 0.02 clear of the rim each side, and WN-12a's hole stops 0.64 over the rim. On the solid nothing holds a mass.
  - The cards and README 630 say WN-12 is "threaded through the outer jaw to the rim".
- How sure: sure.
- Correction:
  - Cut a radial tapped hole through the outer jaw on the screw's axis (its size is estimated: the shank's Ø 0.84 is drawn, say M0.8 at 0.2, or the size the fixer settles), from the slot's outer wall out to the head's seat.
  - Counterbore it Ø 1.62, 0.55 deep from the round side.
  - The fusee.js bore leaves the round side open where the counterbore breaks out. Close that mouth with the head's own curved face (`onMass` already computes it), or cut it with a CSG difference.
  - Bring the tip onto the rim's face, as a fine.py EXPECTED contact ("the mass screw's tip on the rim, clamping it"), or within 0.005.
  - Thread the shank (M4).
  - Then delete SEAT_EXPECTED's OPEN entry and bom's `embed`, and make the relation `in 050301-4 tap`.
- Physics: none to speak of (about 0.003 g less brass per mass); rerun the inertia tables.

**M3. Joint, sure: 05 04 02 (05-04_04), the hub's two M1 and their screws WN-10 (as last revised; S-6).**
- The sheet: "M1" is written with its own arrows across the hub's left hole (`s44_m1.png`), and both holes show thread lines in the section. The coloured section draws the countersunk WN-10 threaded into the flange, ending at its underside.
- The model: the flange's holes are plain Ø 1.04 bores (`C(...,0.52)`), and WN-10's shank is a plain lathe Ø 0.96. Seatcheck holds WN-10 only by the arm's Ø 1.0 clearance hole (11/29 steps), so the screws engage nothing in the hub.
- How sure: sure.
- Correction: tap the flange's two holes M1 × 0.25 through its 1.8 (KIT's `threadWall`, 6H at its minimum). Draw WN-10's shank as `threadGeo(0.5)` (M1, 6g) and match it to the hole (`KIT.matchThreads`). bom `in 050402-2 tap` is then measured on the thread.
- Physics: no.

**M4. Thread, likely: 05 03 01-1 (05-03_4), the timing screws and weights, and the balance's other screws (every version).**
- The sheet: the rim's holes are "0,9" with "0,16 Steigung", a fine thread (ISO's M0.9 coarse is 0.225).
- The model:
  - The timing screws' shanks are plain lathes, Ø 0.9, in plain Ø 0.94 bores. The weights' bores are plain Ø 0.9 on them.
  - WN-12 and WN-10 are plain too (M2, M3).
  - README 577 says the screws in plain-bored holes "are threaded", and that the masses' tapped holes are plain bores "at the thread's size and 0.02". The masses' M1.2 is a Ø 1.0 bore (the tap drill), not 1.22.
- How sure: sure that the threads aren't drawn; likely that the 3.35.00 convention means them to be.
- Correction:
  - The timing screws' shanks `threadGeo(0.45, …, p 0.16)`.
  - The rim's holes tapped at p 0.16 (`threadWall`), or plain at Ø 0.92 as the convention allows.
  - The weights' bores threaded at p 0.16 (the split weight grips the thread).
  - README 577 to name the balance's screws as they are drawn.
- Physics: no.

**M5. Joint, possible: 05-03_2 and the coloured section, WN-12a (the drawings' versions).**
- The sheets: 05-03_2 labels WN-12a with a leader to a mass's centre (its plan draws a small circle there). The coloured section draws a slotted cheese-head screw in the top of the one mass it cuts, its thread about 2 deep. The other mass in the section has a plain top.
- The model: all four tapped holes are empty (HOLE_EXPECTED: "a poising screw fitted where needed, likely"). bom's quantity is [0, 4].
- How sure: possible. The assembly sheets draw one fitted; the Einheits examples photographed (Wempe 3955, the Langes) have no hole at all.
- Correction: the owner's choice.
  - Fit one WN-12a (M1.2, a cheese head of about Ø 1.9 × 0.9 scaled on the coloured section, its thread 2.0) in the drawings' versions, in the mass at the coloured section's place. bom's quantity becomes 1.
  - Or keep all four empty and write in README Estimated that the coloured section draws one fitted.
- Physics: about 0.02 g at r 16: +5 g·mm², and a poise error the model's balance doesn't carry. Rerun the inertia tables.

**M6. Dimension, sure: 05 03_3.2 (1965), the staff's length as built on the 1946 staff (every version).**
- The sheet: 25,6 −0,02 overall and 12,6 −0,02 below the flange's top, so 13,0 above lies within 12.98-13.02.
- The model: 13.03 above and 12.59 below, so 25.62 between the pivots' ends, 0.02 past the overall's upper limit. Each pivot stands 0.02 off its endstone. The balance card says "staff 25.9 between its pivots".
- How sure: sure.
- Correction: the upper end 13.00-13.01 above the seat (25.59-25.60). Lower the upper endstone and its setting by the same 0.02-0.03 (the settings' heights are estimated; U30 puts the setting 0.1 proud), or accept 0.06-0.07 of endshake. The card becomes 25.6.
- Physics: no (the endshake is an estimate).

**M7. Fit, likely: 05 04 02 (05-04_04) and 02 04 02 (05-04_06), the staff's seats and the rollers' bores (as last revised; the impulse roller's bore in every version).**
- The sheets:
  - The collet's seat runs on 1:70 from 1,58 to its large end, 1,65 s6 (1.665-1.672).
  - The impulse roller's seat is 1,65 s6. The roller's bore is reamed 1:70 ("Kegel 1:70 aufreiben"), 1,65 −0,03 at its large end, 1,627 at its small end.
  - The discharge roller's seat is 1,2 r6 (1.212-1.219).
  - Every one is a press fit.
- The model:
  - The collet's seat runs 1.580 → 1.645 over 5.0 (1:77), its large end 0.020-0.027 under s6.
  - The impulse seat is a straight Ø 1.650 (0.015-0.022 under s6), and its roller's bore a straight Ø 1.653: 0.003 over the bore's upper limit, and not tapered.
  - The discharge seat is 1.200 under a 1.203 bore.
  - Each joint is drawn 0.0015 clear radially. They pass bom's press ≤ 0.02 on that gap.
- How sure: sure of the sizes; likely that the model's line-to-line convention is meant (batch 6 recorded the same for the train's n6 seats).
- Correction: take the shafts at their fits and the bores at their sheets'.
  - The collet's seat on 1:70 from 1.58 to 1.651 at 5.0 (or s6's 1.668 with its small end 1.597).
  - The impulse seat at s6's 1.668, and the roller's bore 1:70 from 1.65 to 1.627 (or the bore at the shaft's size, line to line, as batch 6 did).
  - The discharge seat at r6's 1.215.
  - Record the interference in the joints' notes.
- Physics: no.

**M8. Text, sure (every version).**
- escapement.js:
  - 157-158: "the stud's slot", "the spring 3.55 out and its pin side by side in the slot's 1.2 (likely)".
  - 494: "the outer end into the stud's slot, 3.55 from the staff".
  - The collet's hole: "the 1:90 taper, 0.004 over its 2.7" (it is 0.030 on the diameter).
- README:
  - 99: masses "held by a screw and nut across the rim, the screw 2.45 … the nut sunk"; weights "Ø 3.8 × 3.3" (the model has a screw only, at 1.85, and weights Ø 4.25 in the drawings' versions).
  - 103: the stud's "spring's end in the upright's slot with its pin".
  - 630: WN-10 "from under the flange"; WN-12 "threaded through the outer jaw to the rim".
  - 633: "with its Ø 0.22 pin".
- app.js cards:
  - stud: "pinned in a slot at its foot".
  - balance: "staff 25.9 between its pivots".
  - hairspring: "the outer curve drawn in proportion to end at the stud" (the same as the inner since 15 October 2026).
  - masses: "held by a screw (WN-12) through its outer jaw onto the rim" (M2).
- checks.py's EXPECTED ('hairspring:Buffer','hairspring:Buffer'): "drawn without the hole (a collet of vertical walls)", stale since 26 October 2026. No spring vertex lies in the collet or its pin now. Reword it, or remove it if fine.py finds it unused.
- How sure: sure.
- Correction: the lines only.
- Physics: no.

**M9. Possible (sheet): 05 03 02-2 (05-03_8), the collet's spring hole (every version).**
- The sheet: "90°" between the hole and the collet's tapered upper side. The drawn hole leans 2.0 ±0.7° from square to the bar's centre line, toward square to that side (3.6° on the scan).
- The model: square to the bar's centre line.
- How sure: possible.
- Correction: turn the hole's axis about its centre by half the sides' taper, atan(0.55/8.48) = 3.7°, toward the upper side's normal. The spring's straightened end (spPath's HSL frame) and the pin follow. At the hole's ends this moves them ±0.09 along the bar.
- Physics: no.

**M10. Possible, record: 05 03 01-1 (05-03_4), the hub screws' sinks (as last revised; in the other versions the holes are empty).**
- The sheet: "1,8 Ø H7" with its leader at the side hole 2.14 out. The section's "0,4" has its arrow 4.4 from the axis, on no hole. The plan rings the left hole only.
- The model: both holes countersunk 90° to Ø 1.8, 0.4 deep, taking the 0,4 as the sink's depth. The coloured section draws both heads conical and flush, so the countersink's form is sure.
- How sure: possible on what the H7 and 0,4 mean.
- Correction: none to the model. In README Estimated, record that the 0.4 depth is not attached to the hole on the sheet, and that the H7 is read as the sink's mouth.
- Physics: no.

**M11. Features left out, possible (the owner's maker-features rule).**
- The rim's graduation, "8 Körner in 60 Teilung" (05 03 01-1).
- The masses' top chamfer (05-03_2: a ring 0.29 inside the outer in plan, about 0.4 in the side view).
- The collet's 1:90 taper and its "0,7 bohren" pilot (05 03 02-2).
- The model: none built. README "Left out, small" lists the graduation and the chamfer. The stud's Ø 0.8 point stays left out, with its reason.
- How sure: sure that they are drawn; possible that the rule calls for them.
- Correction: eight punch dents (Ø 0.3 cones) on the rim's top at 6° steps, about where the masses are set (place estimated); a 0.3 × 45° chamfer on each mass's top; the collet's hole tapered from 0.80 to 0.77.
- Physics: negligible.

**M12. Build book, pp. 121-151 and 181-193 (v3.41.00).**
- p. 144: the stud with the slot and its old pin (before 3.45.01), and its tail drawn as arcs. p. 141: the collet's old Ø 0.22 rod.
- p. 122: the balance drawn turned 20° (the frozen swing), its A-A off the arm.
- p. 138: the hairspring drawn breathing ("12.51" and "12.41" for the boxed 12.8), with no strip, pitch or turns.
- Every page omits the parts' fits, tapers and threads (above), the rim's inner diameters, the cut, the arm's widths and the timing holes' 2.15. The stud's g6, its Ø 0.7's place and the WN-11 hole's H7 aren't given either.
- How sure: sure.
- Correction: redraw at the release with the model at rest (balance turned 0, the spring unbroken, as each sheet draws its part). Draw tapers as lines (batches 3-6). Give every turned diameter its fit and every thread its size and pitch.
- Physics: no.

**M13. bom.json (every version).**
- No relation: the stones 050407-1.bu/.bl and 050408-1.bu/.bl in their settings; the impulse stone 050403-2 and discharge stone 050404-2 in their rollers; the spring 050302-1's ends in the collet's and stud's holes; the stud's upright in the cock's slot.
- 050302-4.s is still `on 050302-3`, though it now goes in the Ø 0.7 hole.
- WN-12's `embed` is M2. WN-12a's `embed` names a screw not built (M5).
- How sure: sure.
- Correction: `in 050406-2.* press`, `in 050408-2.* press`, `in 050403-1 …` / `in 050404-1 …` (shellac and set), `050302-4.s in 050302-3 press`, a relation for the spring's ends, and `050302-3` `in 050803-1` at the slot (g6/H7).
- Physics: no.
