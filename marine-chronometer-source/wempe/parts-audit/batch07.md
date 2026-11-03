# Batch 07 reader: the balance staff and the balance

Read blind on 3 November 2026 from the sheet images only, then compared with `r_wpa/measure/*.json` and `r_wpa/page/placements.json`. Scan scale about 12 px/mm at 5:1, so every scaled figure is ±0.2 mm. Tolerances: where printed, used; otherwise the sheet's Toleranz line (05 04_4 and 05 04_5: ±0.05; 05 03_4: ±0.03); otherwise the brief's fallback.

Frame: measure Z is movement y (dial side +y). The staff stands with its long taper (top of every sheet) at built z -35.8 and the hub flange at z -22.8; the rim arm lies on the face at -22.8 and the hub flange sits on it toward +z. Hand was judged as assembled: no asymmetric feature other than the possible ring on one hub hole (05 03_4 item 10) was found; the hub, rim and masses are symmetric about the arm axis.

Date note (both recorded, none decided): 05 04_5 (1941, rechecked 1943) draws the hub flange with a 10 deg taper and the staff 14 / 4.7 / 2.1 / 1.3; 05 04_4 (1946) draws a straight flange, 14.03 / 4.1 / 2.0 / 1.1 and the s6/r6/h6 fits; 05 03_3.2 (1965) draws 12.6 / 25.6 total, 1.25 -0.02 pivots, 1.65 -0.02 and a tapered flange again. The built staff follows the 1946 diameters and the 1965 total length 25.6 (and its 6.9 / 6.1 top lengths); the built hub follows 1946 (straight flange). Each disagreement is recorded as a verdict against that sheet.

## 05 04_4: 05 04 02 Unruhwelle, kompl. (staff 05 04 02-1 with hub 05 04 02-2)

**Title block.** Benennung 'Unruhwelle, kompl.', Nr 05 04 02, scale 5:1, Werkstoff blank (hub marked 'Ms.'), note 'gehaertet, anlassen 240 deg', 'nicht eingetr. Toleranz +-0,05'. Date: Tag column '46', Bearb. '29.5.' (read as 29.5.46; likely). Staff 05 04 02-1, hub 05 04 02-2. No chronometer named.

**Views and step 2.** One side section of the staff with the hub, both pivots drawn as cones, notes 'Kegel 1:30' (top pivot) and 'Kegel 1:70' (shaft, hub seat, lower pivot). Hub hatched with two M1 holes. Step 2: all lengths start at the hub's top face. The 14,03 and the drawing agree at about 16.9 px/mm (hub top to lower tip), so the lower length is drawn to scale; the top pivot is drawn about 7.5 mm long from the shoulder (scaled, unsure +-0.3), against the 6.9 of the 1965 sheet. Frame: sheet top = built z -35.8 end, flange face at built z -22.8, hub sleeve toward +z; built Z = movement y.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-1-1 | top pivot Ø at the shoulder (1,2 ±0,02, Kegel 1:30) | 1.2 ±0.02 (likely) | staff.cones[8].d [1.05,1.2] at z -28.9 (built 1.2) | 0 | match |
| 07-1-2 | top pivot Ø where the cone starts (1,11 Ø, no tolerance: ±0.05) | 1.11 (sure on the figure; which place it attaches to: unsure) | staff.cones[8].d[0] 1.05 at z -33.4 (built 1.05) | -0.06 | mismatch |
| 07-1-3 | shaft Ø at the top of its 1:70 taper above the hub (1,58) | 1.58 (likely) | staff.cones[9].d[0] 1.58 at z -28.9 (built 1.58) | 0 | match |
| 07-1-4 | shaft Ø at the hub end of the taper (1,65 s6: +0.015..+0.022 -> 1.665..1.672) | 1.65 s6 (sure) | staff.cones[9].d[1] 1.6514 at z -23.9 (built 1.6514) | -0.0136 (below the lower limit) | mismatch |
| 07-1-5 | staff collar above the hub flange (2 h6 -0.007 -> 1.993..2.000) | 2 h6 (sure) | staff.cylinders[0].d 2.0 (built 2.0) | 0 | match |
| 07-1-6 | length of that collar (1,1) | 1.1 (likely) | staff.cylinders[0].z [-23.9,-22.8] (built 1.1) | 0 | match |
| 07-1-7 | 6,1: top shoulder of the shaft to the hub top face | 6.1 (sure) | staff.cones[9].z[0] -28.9 to hub.z_levels[0] -22.8 (built 6.1) | 0 | match |
| 07-1-8 | hub flange thickness (1,8) | 1.8 (sure) | hub.cylinders[2].z [-22.8,-21.0] (built 1.8) | 0 | match |
| 07-1-9 | hub overall thickness (4,1 +0,05) | 4.1 +0.05 (sure) | hub.size z 4.1 (z -22.8..-18.7) (built 4.1) | 0 | match |
| 07-1-10 | 5,6: hub top face to the end of the lower collar | 5.6 (likely) | staff.cylinders[1].z[1] -17.2 against hub top -22.8 (built 5.6) | 0 | match |
| 07-1-11 | length of the lower 1,65 collar (1,5, faint) | 1.5 (unsure) | staff.cylinders[1].z [-18.7,-17.2] (built 1.5) | 0 | match |
| 07-1-12 | staff Ø at the hub underside (2,14 +0,01) | 2.14 (likely) | staff.section_y0 r 1.07 at z -18.7 (cones[10]: 2.058 -> 2.14 chamfer) (built 2.14) | 0 | match |
| 07-1-13 | hub sleeve Ø (2,63 -0,06 -> 2.57..2.63) | 2.63 -0.06 (likely) | hub.cylinders[3].d 2.6 (built 2.6) | -0.03 (inside) | match |
| 07-1-14 | hub flange Ø (6,3 -0,1 -> 6.2..6.3) | 6.3 -0.1 (sure) | hub.cylinders[2].d 6.25 (built 6.25) | -0.05 (inside) | match |
| 07-1-15 | hub's two tapped holes (M1) | M1, two (likely); position not dimensioned here | hub.cylinders[0,1].d 0.7294 at (0,±2.15) (M1 core) (built 0.7294 at ±2.15) | core of M1 | match |
| 07-1-16 | 14,03 -0,06: hub top face to the lower pivot tip | 14.03 -0.06 (sure) | staff z -22.8 to -10.21 (cylinders[4].z[1]) (built 12.59) | -1.44 | mismatch |
| 07-1-17 | taper of the top pivot (Kegel 1:30) | 1:30 (likely) | staff.cones[8].half_angle 1.0 deg (0.15 over 4.5 = 1:30) (built 1:30) | 0 | match |
| 07-1-18 | taper of the shaft, hub seat and lower pivot (Kegel 1:70) | 1:70 (likely) | staff.cones[9,10,11] 0.4 deg (1:71) (built 1:71) | 0 | match |
| 07-1-19 | lower shaft Ø (1,2 r6: +0.012..+0.019 -> 1.212..1.219) | 1.2 r6 (sure) | staff.cylinders[2].d 1.2155 (built 1.2155) | 0 (inside) | match |
| 07-1-20 | lower collar Ø (1,65 s6 -> 1.665..1.672) | 1.65 s6 (sure) | staff.cylinders[1].d 1.6685 (built 1.6685) | 0 (inside) | match |
| 07-1-21 | lower pivot Ø at the cone start (1,11) | 1.11 (sure on figure) | staff.cones[11].d [1.1597,1.2], 1.1597 at z -12.61 (built 1.16) | +0.05 (at the limit of ±0.05) | match |
| 07-1-22 | top pivot length, shoulder to tip (not dimensioned; scaled 7.5 ±0.3) | 7.5 scaled (unsure) | staff z -35.8 to -28.9 (built 6.9) | -0.6 | mismatch |
| 07-1-23 | material / treatment (hub Ms. brass; staff hardened, tempered 240 deg) | as read | not a geometric field (built -) | - | can't tell |

**Extras.** Extra: the staff's 0.21 x 0.4 pivot tip cylinders (cylinders[3,4]) are not dimensioned on this sheet (the pivot is drawn as a plain cone; the 1965 sheet gives them).

**After the verdicts.** The staff recipe (tools/recipes/wempe.py, staff()) cites 05 04 02-1 (29.5.46), turns 1:30 above and 1:70 below, and takes its seats from that sheet (Ø 2 h6, 1.6685, 1.2155), which is what the diameters match; it names 05 03_3.2 only for the 25.6 length and the pivot tips 0.21 x 0.4. No verdict changed.

## 05 04_5: 05 04 01-1 (040401-1) Unruhwelle (the 1941 staff 040401-1Hz with hub 040401-2)

**Title block.** Benennung 'Unruhwelle.', Nr 040401-1 (05 04 02-1 written over it), scale 5:1, Werkstoff blank, 'nicht eingetr. Toleranz +-0,05'. Dates: gez. 4.4.41, gepr. 18.6.41, N.gepr. 24.7.43 (likely). Parts 040401-1Hz (staff) and 040401-2 (hub). The earliest staff sheet.

**Views and step 2.** One section: staff with hub whose flange has a 10 deg taper on its outer edge (widest at the top), sleeve below, long upper arm above. Framed dimensions 14 ±0,03 and 4,7 -0,05. Step 2: the 4,7 runs from the flange top to the sleeve end and the 14 from the same face to the lower tip; they agree. Sheet top = built z -35.8 end.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-2-1 | hub flange Ø (6,3 across the flange) | 6.3 (likely) | hub.cylinders[2].d 6.25 (built 6.25) | -0.05 (at the limit) | match |
| 07-2-2 | collar above the flange Ø (2,1 ±0,03 -> 2.07..2.13) | 2.1 ±0.03 (likely) | staff.cylinders[0].d 2.0 (built 2.0) | -0.1 | mismatch |
| 07-2-3 | length of that collar above the flange (1,3) | 1.3 (likely) | staff.cylinders[0].z [-23.9,-22.8] (built 1.1) | -0.2 | mismatch |
| 07-2-4 | flange thickness (1,8) | 1.8 (sure) | hub.cylinders[2].z [-22.8,-21.0] (built 1.8) | 0 | match |
| 07-2-5 | 4,7 -0,05 (framed): flange top to the sleeve end | 4.7 (sure) | hub z_levels -22.8..-18.7 (built 4.1) | -0.6 | mismatch |
| 07-2-6 | sleeve Ø (2,6 ±0,03) | 2.6 ±0.03 (likely) | hub.cylinders[3].d 2.6 (built 2.6) | 0 | match |
| 07-2-7 | 14 ±0,03 (framed): flange top to the lower tip | 14 (sure) | staff z -22.8 to -10.21 (built 12.59) | -1.41 | mismatch |
| 07-2-8 | 10 deg taper on the flange edge | 10 deg (sure) | hub.section_y0: flange wall vertical at r 3.125 from z -22.8 to -21.0; hub.cones has none (built 0 deg) | -10 deg | not built |
| 07-2-9 | 0,4 at the flange (a step or recess; what it attaches to is unclear) | 0.4 (unsure) | - (built -) | - | can't tell |

**Extras.** Extra: the hub's two M1 holes (hub.cylinders[0,1]) are not drawn on this sheet.

**After the verdicts.** Same recipe (cites the 1946 sheet, not this one). No verdict changed.

## 05 03_3.2: 05 04 01 / 050401 Unruhwelle kpl. (staff, later pattern, 12.3.65)

**Title block.** Benennung 'Unruhwelle kpl.', Nr 050401, scale 5:1, Gezeichnet 12.3.65 (likely), notes '210 deg anlassen' and 'Schliebl. 22,?'; no general tolerance legible (fallback used). Dimensions carry -0,02 style tolerances. The latest staff sheet (1965).

**Views and step 2.** Staff side view with the hub, a detail of the pivot at left (tip Ø 0,21, 0,4, 2,4, 'in Lagerstein einpassen'), notes 'nach Bohrlehre 2 x M 1', 'poliert' on both pivots, '1:70' marked twice. Step 2: 6,9 + 6,1 = 13,0; 5,7 + 6,9 = 12,6; 13,0 + 12,6 = 25,6; 4,1 + 1,6 = 5,7. They agree. Frame: top = built z -35.8.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-3-1 | upper pivot Ø at its shoulder (1,25 -0,02 -> 1.23..1.25) | 1.25 -0.02 (likely) | staff.cones[8].d[1] 1.2 at z -28.9 (built 1.2) | -0.03 (below the lower limit) | mismatch |
| 07-3-2 | upper shaft Ø (1,65 -0,02 -> 1.63..1.65) | 1.65 -0.02 (likely) | staff.cones[9].d[1] 1.6514 (a 72-gon reads up to 0.1 % small) (built 1.6514) | +0.0014 (at the limit) | match |
| 07-3-3 | collar above the hub Ø (2,40 or 2,10, -0,02; digit unsure) | 2.40 or 2.10 (unsure) | staff.cylinders[0].d 2.0 (built 2.0) | -0.1 (if 2.10) or -0.4 | mismatch |
| 07-3-4 | hub thickness (4,1 -0,05) | 4.1 (likely) | hub z_levels -22.8..-18.7 (built 4.1) | 0 | match |
| 07-3-5 | lower 1,65 collar length (1,6) | 1.6 (likely) | staff.cylinders[1].z [-18.7,-17.2] (built 1.5) | -0.1 | mismatch |
| 07-3-6 | 5,7: hub top face to the end of the collar | 5.7 (likely) | staff z -22.8 to -17.2 (built 5.6) | -0.1 | mismatch |
| 07-3-7 | upper pivot length, shoulder to tip (6,9) | 6.9 (likely) | staff z -28.9 to -35.8 (built 6.9) | 0 | match |
| 07-3-8 | 6,1: shoulder to the hub top face | 6.1 (likely) | staff z -28.9 to -22.8 (built 6.1) | 0 | match |
| 07-3-9 | 13,0: top tip to the hub top face | 13.0 (likely) | staff z -35.8 to -22.8 (built 13.0) | 0 | match |
| 07-3-10 | lower pivot length, collar end to tip (6,9) | 6.9 (likely) | staff z -17.2 to -10.21 (built 6.99) | +0.09 | mismatch |
| 07-3-11 | 12,6 -0,02: hub top face to the lower tip | 12.6 (likely) | staff z -22.8 to -10.21 (built 12.59) | -0.01 (inside 12.58..12.6) | match |
| 07-3-12 | 25,6 -0,02: overall length | 25.6 (sure) | staff.size z 25.59 (built 25.59) | -0.01 (inside) | match |
| 07-3-13 | lower pivot shaft Ø (1,25 -0,02) | 1.25 -0.02 (likely) | staff.cylinders[2].d 1.2155 (built 1.2155) | -0.0145 (below 1.23) | mismatch |
| 07-3-14 | lower collar Ø (1,65 -0,02 -> 1.63..1.65) | 1.65 -0.02 (likely) | staff.cylinders[1].d 1.6685 (built 1.6685) | +0.0185 (above 1.65) | mismatch |
| 07-3-15 | pivot tip Ø (0,21, in Lagerstein einpassen) | 0.21 (sure) | staff.cylinders[3,4].d 0.21 (built 0.21) | 0 | match |
| 07-3-16 | pivot tip cylinder length (0,4) | 0.4 (likely) | staff.cylinders[3].z [-35.8,-35.4] (built 0.4) | 0 | match |
| 07-3-17 | pivot flare length (2,4) | 2.4 (likely) | staff.cones chain z -35.4 to -33.4 plus the 0.4 tip cylinder (built 2.4) | 0 | match |
| 07-3-18 | two M1 holes in the hub (nach Bohrlehre) | 2 x M1 (sure) | hub.cylinders[0,1].d 0.7294 at (0,±2.15) (built 2 x 0.7294) | M1 core | match |
| 07-3-19 | 10 deg taper on the hub flange (drawn as a trapezoid, wide at the top) | about 10 deg (likely) | hub.section_y0 wall vertical, no cone (built 0 deg) | -10 deg | not built |
| 07-3-20 | taper '1:70' on the upper pivot region | 1:70 (unsure what it attaches to) | staff.cones[8] 1:30 (built 1:30) | - | can't tell |
| 07-3-21 | cone angle of the pivot (an unreadable figure near 64) | illegible | - (built -) | - | can't tell |

**Extras.** Extra: the 2.0 -> 2.14 hub seat and the 1.58 top of the shaft are not dimensioned on this sheet (they are on 05 04_4).

**After the verdicts.** Same recipe: 1.6685 and 1.2155 are the 1946 fits (s6, r6), not this 1965 sheet's -0,02 figures. No verdict changed.

## 05 03_1: 127-556.04 U09 / 0403 Unruh kompl. (balance assembly)

**Title block.** Benennung 'Unruh kompl.', Nr 127-556.04 U09, 0403, scale 5:1, stamp 'LC'; parts list 31 U08, 32 U07, 33 U05, 34 U06, 35 U03?. Dates gez. 20.5.41 (likely), gepr. 26.?.41, N.gepr. 26.4.43 (unsure). No tolerance legible. Notes: 'Die Zeitschrauben muessen in Ruhestellung die Richtung von 6-12 einnehmen'; 'Hoehe uebereinstimmend mit 2400 Schwingungen pro Std'.

**Views and step 2.** Left: a plan of the balance with a part 33/42 (wedge 15 deg and a lever; not in this batch). Right: a section through staff, hub (flange 10 deg taper), plates and the two cocks, 'Laenge der Unruhwelle 25,6'. Step 2: plan and section both show the masses 6.35 and the rim; the stack numbers (12,4; 10; 4,5; 3,3; 0,4; 0,75; 0,8; 12; 11; 2,4; 3,5; 16) lie between faces of other batches' parts and at this scale I cannot tie each to a face.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-4-1 | Laenge der Unruhwelle 25,6 | 25.6 (sure) | staff.size z 25.59 (built 25.59) | -0.01 | match |
| 07-4-2 | mass Ø (6,35, vertical dimension at the left lower circle) | 6.35 (likely) | masses.cylinders[5].d 6.35 (built 6.35) | 0 | match |
| 07-4-3 | 10 deg taper at the hub flange (section) | 10 deg (likely) | hub.cones: none (straight wall) (built 0 deg) | -10 deg | not built |
| 07-4-4 | 3,8 (circled): rim height | 3.8 (likely) | rim.size z 3.8 (built 3.8) | 0 | match |
| 07-4-5 | 21,05: radius to the timing screws' ends along the arm | 21.05 (likely) | timingScrew.box z 13.95..21.05; placements 050301-2 box span 42.1 (built 21.05) | 0 | match |
| 07-4-6 | angles 15, 20, 15 deg and sizes 22, 5, 1,8, 42 round the lever and wedge (parts 33/34, not in this batch) | as read | - (built -) | - | can't tell |
| 07-4-7 | stack dimensions 12,4 / 10 / 4,5 / 3,3 / 0,4 / 0,75 / 0,8 / 12 / 11 / 2,4 / 3,5 / 16 / 6 | as read | - (built -) | - | can't tell |
| 07-4-8 | note: timing screws point 6-12 at rest | note (sure) | timing screws on the arm axis (placements 050301-2) (built -) | - | can't tell |

**Extras.** Extra: none attributable; the sheet is a general assembly.

**After the verdicts.** Nothing read beyond the measurement files for this sheet; no verdict changed.

## 05 03_2: 05 03 01 Unruh (kompl.) (balance with rim, arm, masses and timing screws)

**Title block.** Benennung 'Unruh ...' (cut off), Nr 05 03 01, scale 5:1, stamp 'LC', Arbeitspause '18 April 194?' (year digit illegible; the ledger lists the sheet as 23.6.41); other date lines illegible. No tolerance. Parts named: 05 03 01-1 (rim), -2 (timing screw), -3 (timing weight), -4 (mass), WN-12 and WN-12a (screws).

**Views and step 2.** Plan (arm vertical, a timing screw with weight at each arm end, four masses on the rim) and a side view with the arm in section. '42,1' (vertical; centre line to the lower block's end is about 21 mm on the plan, so it is the length across both screws) and '39' (angle or length, unclear). The scan is about 12.2 px/mm, so the other sizes below are scaled, ±0.2 mm.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-5-1 | 42,1: end to end of the two timing screws | 42.1 (likely) | placements 050301-2 box z -8.94..33.16 (built 42.1) | 0 | match |
| 07-5-2 | timing weight Ø (scaled 4.3) | 4.3 ±0.2 (scaled) | timingWeight.cylinders[1].d 4.25 (built 4.25) | 0 | match |
| 07-5-3 | timing weight height (scaled 3.5) | 3.5 ±0.2 (scaled) | timingWeight.size z 3.3 (built 3.3) | -0.2 (at the scan accuracy) | match |
| 07-5-4 | weight radial place, inner to outer (scaled 16.8..20.3) | 16.8..20.3 (scaled) | timingWeight.z_levels 16.95..20.25 (built 16.95..20.25) | within 0.15 | match |
| 07-5-5 | timing screw head Ø (scaled 1.6) and its place (r 13.7) | 1.6 at r 13.7 (scaled) | timingScrew.cylinders[1].d 1.65, z 13.95..15.25 (built 1.65 at 13.95) | within 0.25 | match |
| 07-5-6 | mass centres (scaled 13.5 and 7.9 from the centre; about 32 deg from the cut axis) | 13.5, 7.9 ±0.3 (scaled) | masses.cylinders[5].at (13.5966, 7.85) (built 13.5966, 7.85) | within 0.1 | match |
| 07-5-7 | mass circle Ø (scaled 6.2) | 6.2 ±0.2 (scaled) | masses.cylinders[5].d 6.35 (built 6.35) | +0.15 (at accuracy) | match |
| 07-5-8 | mass height beyond the arm face (side view, scaled 6.35) | 6.35 ±0.2 (scaled) | masses.size z 6.46 (built 6.46) | +0.11 | match |
| 07-5-9 | arm thickness (side view, scaled about 1.0) | 1.0 ±0.2 (scaled) | rim.z_levels -23.95..-22.8 (built 1.15) | +0.15 | match |
| 07-5-10 | three holes along the arm axis at the hub (one central, one each side, about 2 apart) | 3 holes (sure); spacing about 2 (scaled) | rim.cylinders[5,6,7]: 2.009, 1.0 at ±2.15 (built 3 holes) | - | match |
| 07-5-11 | 39 (unclear: angle or length) | 39 (sure on the figure) | - (built -) | - | can't tell |
| 07-5-12 | screws WN-12 / WN-12a in the masses (no size printed) | no size | massScrew.cylinders[3].d 0.7823, length 2.0, head 1.6 (built -) | - | can't tell |

**Extras.** Extra: the masses' notch round the rim section (r 15.23..16.17, 3.8 high) is drawn only as the ring passing through the circles; no sizes given.

**After the verdicts.** Nothing read beyond the measurement files for this sheet; no verdict changed.

## 05 03_4: 05 03 01-1 Unruhreifen (balance rim)

**Title block.** Benennung 'Unruhreifen.', Nr 05 03 01-1, scale 2:1 (1:1 for the small view), Werkstoff 'Nickelstahl Sonderlegierung u. Messing', surface 'poliert', stamp 'LC', 'nicht eingetr. Toleranz +-0,03'. Dates gez. 31.7.41, gepr. 15.8.4?, N.gepr. 27.4.43 (likely).

**Views and step 2.** Side section (Ø 32,32 / 31,29 / 30,48; 3,8 height; hatched Nickelstahl and Messing layers), plan (rim with the 1,5 cut, arm with waist, three holes), a small 1:1 view. Step 2: the section shows the arm as a 1,15 strip along the bottom, the ring wall rising 3,8 at the ends; the layers meet at Ø 31,29. The radial hole through the ring (2,15 from the arm face) is dimensioned only in the section. The built arm lies along y with the cut across it at ±0.8 (a plan turned a quarter against the sheet; same relation).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 07-6-1 | outer Ø (32,32 -0,04 -> 32.28..32.32) | 32.32 -0.04 (sure) | rim.cylinders[10].d 32.3 (built 32.3) | -0.02 (inside) | match |
| 07-6-2 | layer boundary Ø (31,29 -0,04): nickel steel against brass | 31.29 -0.04 (sure) | rim.outlines_by_level: only arcs r 16.15 and r 15.25; one solid, no boundary (built -) | - | not built |
| 07-6-3 | inner Ø (30,48 +0,04 -> 30.48..30.52) | 30.48 +0.04 (sure) | rim.cylinders[4].d 30.5 (built 30.5) | +0.02 (inside) | match |
| 07-6-4 | rim total height (3,8) | 3.8 (sure) | rim.size z 3.8 (z -26.6..-22.8) (built 3.8) | 0 | match |
| 07-6-5 | arm thickness (1,15) | 1.15 (likely) | rim.z_levels -23.95..-22.8 (built 1.15) | 0 | match |
| 07-6-6 | cut width (1,5 +0,2 -> 1.5..1.7) | 1.5 +0.2 (sure) | rim.outlines_by_level[-26.6] slit ends y ±0.8 (built 1.6) | +0.1 (inside) | match |
| 07-6-7 | centre hole (2 H7 +0,009) | 2 H7 (sure) | rim.cylinders[5].d 2.009 (built 2.009) | 0 | match |
| 07-6-8 | the two hub screw holes (Ø 1) | 1 (likely) | rim.cylinders[6,7].d 1.0 (built 1.0) | 0 | match |
| 07-6-9 | screw holes' distance from the centre (2,14 +0,02 -> 2.14..2.16) | 2.14 +0.02 (likely) | rim.cylinders[6,7].at (0,∓2.15) (built 2.15) | +0.01 (inside) | match |
| 07-6-10 | 1,8 H7 +0,009 and 0,4: the hole's top form (countersink or counterbore; which hole is unsure; the plan shows a ring round the left hole only) | 1.8 H7, 0.4 deep (unsure) | rim.cones d 1.0 -> 1.8, z -23.95..-23.55, 45 deg, both holes (built 1.8 x 0.4, countersink) | form unknown | can't tell |
| 07-6-11 | arm width at the ends (3,2) | 3.2 (sure) | rim.outlines[-23.95] lines x ±1.6 at y 15.17 (built 3.2) | 0 | match |
| 07-6-12 | arm width at the start of the waist (4; scaled 6.7 from the centre) | 4 (sure) at 6.7 (scaled) | rim.outlines[-23.95] lines reach x ±2.0 at y 6.13 (built 4.0 at 6.13) | width 0; place -0.57 (scale accuracy ±0.4) | match |
| 07-6-13 | arm waist width (6,5) | 6.5 (sure) | rim.outlines[-23.95] arcs reach x ±3.25 at y 0 (built 6.5) | 0 | match |
| 07-6-14 | waist arc radius (a figure read as 20 with a degree-like mark; R20 likely) | R20 (unsure) | rim.outlines[-23.95] arcs r 20.0 (built 20) | 0 | match |
| 07-6-15 | radial hole axis, from the arm face (2,15) | 2.15 (sure) | rim.cylinders[8,9] z -24.95 (from -22.8) (built 2.15) | 0 | match |
| 07-6-16 | radial hole size (0,9, Steigung 0,16: M0.9 x 0.16) | 0.9 x 0.16 (likely) | rim.cylinders[8,9].d 0.7268 (0.9 - 1.0825 x 0.16 = 0.7268) (built 0.7268) | core of M0.9 x 0.16 | match |
| 07-6-17 | 8 Koerner in 60 Teilung (eight punch marks, 60 divisions) | 8 marks (sure) | rim: no mark features in cylinders or outlines (built 0) | - | not built |
| 07-6-18 | cut position: across the arm | perpendicular (sure) | rim: slit at y ±0.8, x ±16; arm along y (built perpendicular) | 0 | match |

**Extras.** Extra: the radial tapped holes at (0, ±15.05) appear on the sheet only as the dashed hole in the section (item 16). Hand: every asymmetric feature is symmetric about the arm axis except the ring on the left hole in the plan (item 10, unsure).

**After the verdicts.** Nothing read beyond the measurement files for this sheet; no verdict changed.

## Summary

Counts: match 61, mismatch 15, can't tell 10, not built 5

Mismatches and not built:
- 07-1-2 (05 04_4) mismatch: top pivot Ø where the cone starts (1,11 Ø, no tolerance: ±0.05); drawn 1.11 (sure on the figure; which place it attaches to: unsure); built 1.05; Δ -0.06
- 07-1-4 (05 04_4) mismatch: shaft Ø at the hub end of the taper (1,65 s6: +0.015..+0.022 -> 1.665..1.672); drawn 1.65 s6 (sure); built 1.6514; Δ -0.0136 (below the lower limit)
- 07-1-16 (05 04_4) mismatch: 14,03 -0,06: hub top face to the lower pivot tip; drawn 14.03 -0.06 (sure); built 12.59; Δ -1.44
- 07-1-22 (05 04_4) mismatch: top pivot length, shoulder to tip (not dimensioned; scaled 7.5 ±0.3); drawn 7.5 scaled (unsure); built 6.9; Δ -0.6
- 07-2-2 (05 04_5) mismatch: collar above the flange Ø (2,1 ±0,03 -> 2.07..2.13); drawn 2.1 ±0.03 (likely); built 2.0; Δ -0.1
- 07-2-3 (05 04_5) mismatch: length of that collar above the flange (1,3); drawn 1.3 (likely); built 1.1; Δ -0.2
- 07-2-5 (05 04_5) mismatch: 4,7 -0,05 (framed): flange top to the sleeve end; drawn 4.7 (sure); built 4.1; Δ -0.6
- 07-2-7 (05 04_5) mismatch: 14 ±0,03 (framed): flange top to the lower tip; drawn 14 (sure); built 12.59; Δ -1.41
- 07-2-8 (05 04_5) not built: 10 deg taper on the flange edge; drawn 10 deg (sure); built 0 deg; Δ -10 deg
- 07-3-1 (05 03_3.2) mismatch: upper pivot Ø at its shoulder (1,25 -0,02 -> 1.23..1.25); drawn 1.25 -0.02 (likely); built 1.2; Δ -0.03 (below the lower limit)
- 07-3-3 (05 03_3.2) mismatch: collar above the hub Ø (2,40 or 2,10, -0,02; digit unsure); drawn 2.40 or 2.10 (unsure); built 2.0; Δ -0.1 (if 2.10) or -0.4
- 07-3-5 (05 03_3.2) mismatch: lower 1,65 collar length (1,6); drawn 1.6 (likely); built 1.5; Δ -0.1
- 07-3-6 (05 03_3.2) mismatch: 5,7: hub top face to the end of the collar; drawn 5.7 (likely); built 5.6; Δ -0.1
- 07-3-10 (05 03_3.2) mismatch: lower pivot length, collar end to tip (6,9); drawn 6.9 (likely); built 6.99; Δ +0.09
- 07-3-13 (05 03_3.2) mismatch: lower pivot shaft Ø (1,25 -0,02); drawn 1.25 -0.02 (likely); built 1.2155; Δ -0.0145 (below 1.23)
- 07-3-14 (05 03_3.2) mismatch: lower collar Ø (1,65 -0,02 -> 1.63..1.65); drawn 1.65 -0.02 (likely); built 1.6685; Δ +0.0185 (above 1.65)
- 07-3-19 (05 03_3.2) not built: 10 deg taper on the hub flange (drawn as a trapezoid, wide at the top); drawn about 10 deg (likely); built 0 deg; Δ -10 deg
- 07-4-3 (05 03_1) not built: 10 deg taper at the hub flange (section); drawn 10 deg (likely); built 0 deg; Δ -10 deg
- 07-6-2 (05 03_4) not built: layer boundary Ø (31,29 -0,04): nickel steel against brass; drawn 31.29 -0.04 (sure); built -; Δ -
- 07-6-17 (05 03_4) not built: 8 Koerner in 60 Teilung (eight punch marks, 60 divisions); drawn 8 marks (sure); built 0; Δ -

Could not read: the collar figure above the hub on 05 03_3.2 (2,40 or 2,10); the 1:70 note on the upper pivot and the pivot-cone figure beside the detail on 05 03_3.2; the 0,4 at the flange on 05 04_5; every stack dimension on 05 03_1 (not tied to a face at this scan size); the "39" on 05 03_2; the year of 05 03_2 and several gepr. lines; the form of the "1,8 H7" and which hole carries it on 05 03_4. The sheets give no size for the mass screws WN-12 or the arm screws WN-10, so those parts have no verdict beyond the hub's M1 holes.
