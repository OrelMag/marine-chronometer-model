# Batch 7 verification: balance staff and balance (05 04_4, 05 04_5, 05 03_3.2, 05 03_1, 05 03_2, 05 03_4)

Verifier's note: read from the reader's items.tsv, the sheets (enlarged crops in E:/mc-video/wpa-audit/crops/) and the measurement files only. Scales checked on the sheets themselves: 5:1 gives about 35 px/mm on the 2x crops of the 745 px scans (6.3 flange = 223 px; 6.1 = 205-220 px); the 05 03_1 / 05 03_2 plans about 24.5 px/mm at 2x (42.1 span = 1037 px). Built values were looked up in measure/*.json and page/placements.json.

## Dates and which sheet the model should follow

| sheet | what the title block says | note |
|---|---|---|
| 05 04_5 | no. 040401-1 "Unruhwelle", gez. 4.4.41, gepr. 11.6.41, N.gepr. 21.7.43; handwritten 05 04 02-1; tolerance +-0.05 | earliest; hub 040401-2 hatched; no revision marks |
| 05 04_4 | no. 05 04 02 "Unruhwelle, kompl.", Bearb. 29.5. (year illegible), 5:1, "gehaertet, anlassen 240 deg", general +-0.05; no revision marks | carries the new 05 04 02 numbering that 4_5 only has handwritten, so later than 4_5; undated |
| 05 03_3.2 | no. 050401 "Unruhwelle Kpl.", gezeichnet 12.3.65, "210 deg anlassen", 5:1 | latest by date (1965); the model's lengths (25.6, 12.6, 6.9, 6.1) follow it |
| 05 03_1 | 127-556.04 U09 0403, gez. 20.5.41, gepr. 26.6.41 (reader says 20.5.41) | assembly, 5:1 |
| 05 03_2 | 05 03 01, gez. 23.6.41, "16 April 194?", N.gepr. 1943 | assembly, 5:1 |
| 05 03_4 | 05 03 01-1 "Unruhreifen", gez. 31.7.41, gepr. 18.8.41, N.gepr. 27.4.43; Nickelstahl Sonderlegierung u. Messing; general tolerance **+-0.03** (reader's tolerance use should have been +-0.03, not the fallback) | |

Result: the staff chain is 4_5 (1941/43), 4_4 (undated, later), 3.2 (1965). The model mixes: lengths from the 1965 sheet, fits (1.65 s6, 2 h6, 1.2 r6) and the vertical flange from 4_4. Where the 1965 sheet differs from the model, 3.2 is the sheet the model should follow.

## Sheet 05 04_4 (items 07-1-*)

| id | reader's verdict | my reading of the sheet (certainty) | built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-1-1 | match | 1.2 phi +-0.02 at the top shoulder, Kegel 1:30 label above (sure) | cones[8].d[1] 1.2 | match | yes | re-read enlarged |
| 07-1-2 | mismatch (1.11 vs 1.05) | **1.11 sits at the top end of the drawn staff, far above the shoulder; the top of the drawing has no end line (the outlines run off, the figure is cut)**. Which place on the pivot it attaches to cannot be fixed (unsure) | the model's 1:30 cone passes 1.11 about 3 mm above the shoulder (1.2 - 3/30 = 1.10) | can't tell | **no** | the reader pinned 1.11 to "where the cone starts". A 1:30 taper from 1.2 gives 1.11 at 2.7 mm from the shoulder; the sheet draws it ~12 mm up on a cut figure. No mismatch can be shown |
| 07-1-3 | match | 1.58 dimension is **1.6 mm below the shoulder** (extension lines at 680 of 2x crop vs shoulder 625), not at the shoulder (likely) | 1.58 at the shoulder; 1.603 at that height | match | yes (place corrected) | still inside +-0.05 |
| 07-1-4 | mismatch (1.6514 vs 1.665..1.672) | "1.65 phi s6 +0.022 / +0.015" with a sloped leader ending at the shaft just above the 2 h6 collar (sure of the figures; likely of the place). ISO s6, 1-3 mm: +0.020/+0.014 gives 1.664..1.670; the sheet's own printed +0.015..+0.022 gives 1.665..1.672 | cones[9].d[1] 1.6514 | mismatch | yes | 1.6514 is 0.013 under the printed lower limit, 0.013 under the ISO one as well. The sheet's own taper also does not reach 1.665: 1.58 + 4.5/70 = 1.64 |
| 07-1-5 | match | 2 h6 -0.007 (1.993..2.000) (sure) | cylinders[0].d 2.0 (upper limit) | match | yes | |
| 07-1-6 | match | 1.1 above the hub, arrows 790 to 830 (likely) | 1.1 | match | yes | |
| 07-1-7 | match | 6.1: shoulder (625) to the hub top line (830) (sure) | -28.9 to -22.8 | match | yes | |
| 07-1-8 | match | 1.8 flange (sure) | 1.8 | match | yes | flange walls are drawn vertical in this sheet |
| 07-1-9 | match | 4.1 +0.05 (sure) | hub z span 4.1 | match | yes | |
| 07-1-10 | match | 5.6 from the hub top line to the line at 1020 (likely) | -22.8 to -17.2 | match | yes | |
| 07-1-11 | match | 1.5 (5.6 - 4.1) (unsure; derived) | 1.5 | match | yes | |
| 07-1-12 | match, attributed to the staff | 2.14 +0.01 sits just under the hub's wall ends; it is most likely the **hub bore's chamfer at the underside** (unsure what it attaches to) | **hub.cones[1].d[1] 2.14** (z -18.74..-18.7); the staff there is 2.0586 (staff cones, taper 1:70) | match (built value found on the hub, not the staff) | yes in value, no in field | the staff's diameter at the hub underside is 2.0586; read as a staff size it would be -0.08 (mismatch). Reader's field cites section_y0 and a staff chamfer that is not in the staff's cone list |
| 07-1-13 | match | 2.63 -0.06; the dimension is drawn 6 mm below the hub top, on sloped extension lines, so it may not be the sleeve (unsure) | hub.cylinders[3].d 2.6 | match, place unsure | partly | the 4_5 sheet prints 2.6 +-0.03 on the sleeve itself, so the sleeve is right |
| 07-1-14 | match | 6.3 phi -0.1 (sure) | 6.25 | match | yes | |
| 07-1-15 | match | M1, two (likely) | 0.7294 core at +-2.15 | match | yes | |
| 07-1-16 | mismatch -1.44 | 14.03 -0.06 (sure): upper arrow on the hub top line (the line running right from the hub top at y 830), lower arrow at the tip (sure); the 5.6 and 14.03 share that same upper line | z -22.8 to -10.21 = 12.59 | mismatch | yes | superseded: 3.2 (1965) says 12.6 -0.02, model follows it. The 1941-era lower end is 1.44 longer |
| 07-1-17 | match | 1:30 on the top pivot (likely) | 1.0 deg | match | yes | |
| 07-1-18 | match | 1:70 on the shaft, the hub bore and the lower pivot (the lower label runs along the lower pivot, which narrows 1.2 to 1.11 in 1:70 over ~6 mm) (likely) | 0.4 deg | match | yes | |
| 07-1-19 | match | 1.2 r6 +0.019/+0.012 (sure) | cylinders[2].d 1.2155 (1.212..1.219) | match | yes | ISO r6 for 1-3 mm: +0.016/+0.010, i.e. 1.210..1.216; also inside |
| 07-1-20 | match | 1.65 s6 lower, +0.022/+0.015 (sure) | 1.6685 (1.665..1.672) | match | yes | |
| 07-1-21 | match at +0.0497 | the 1.11 dimension is at the **foot of the pivot, below the triangle, ~7 mm below the collar**, not at the cone start (unsure) | cone 1.1597 at z -12.61 | can't tell (at the limit either way) | partly | the 1:70 pivot taper runs 1.2 to 1.11 over ~6.3 mm on the sheet; the model has 1.2 at -15.43 and 1.16 at -12.61 (2.8 mm), so it is thicker at the tip end |
| 07-1-22 | mismatch (7.5 scaled vs 6.9) | **no end line is drawn at the top; the outline continues past the 1.11 dimension to a cut**. The staff above the shoulder is drawn about 12 mm and is not a length (sure it is not dimensioned, sure it is cut) | 6.9 | can't tell | **no** | the reader's 7.5 was read from a figure that is cut off. 3.2 gives 6.9 and the model has 6.9 |
| 07-1-23 | can't tell | "gehaertet, anlassen 240" (sure); hub Ms. (sure); general +-0.05 | - | can't tell | yes | |

## Sheet 05 04_5 (items 07-2-*)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-2-1 | match | 6.3 across the flange top (sure) | 6.25 | match (but see 07-2-8) | partly | with a 10 deg wall the flange is 6.3 only at the top |
| 07-2-2 | mismatch | 2.1 +-0.03 (likely; also 2.1 on 3.2 by scale) | 2.0 | mismatch | yes | |
| 07-2-3 | mismatch | 1.3 (arrows 855-905) (likely) | 1.1 | mismatch | yes | |
| 07-2-4 | match | 1.8 (sure) | 1.8 | match | yes | |
| 07-2-5 | mismatch | 4.7 -0.05 framed, flange top to sleeve end (sure) | 4.1 | mismatch | yes | superseded: 4_4 and 3.2 both say 4.1 |
| 07-2-6 | match | 2.6 +-0.03 on the sleeve (sure of figure, likely of place) | 2.6 | match | yes | |
| 07-2-7 | mismatch | 14 +-0.03 framed (sure) | 12.59 | mismatch | yes | superseded by 3.2 (12.6) |
| 07-2-8 | not built | 10 deg: a long thin line runs down from the flange's left lower corner to the "10" label; the flange walls themselves lean about 10 deg (wide at the top, 6.3, narrower at the bottom) (sure) | hub flange wall vertical at r 3.125 | not built | yes | 3.2 (1965) also draws the flange as a trapezoid, so this is not only the 1941 form; 4_4 draws vertical walls |
| 07-2-9 | can't tell | 0.4 at the left of the flange: dimension arrows between the flange top line and a line 0.4 above (a step above the flange?) (unsure) | - | can't tell | yes | |

Missed by the reader: this sheet shows a pointed top (a cone tip over the shaft, ~12 mm of shaft above the flange, 1.6 wide) and a lower tip with a flared point: it is the unmachined pivot-blank form, not the finished staff. Nothing to compare.

## Sheet 05 03_3.2 (items 07-3-*)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-3-1 | mismatch (1.2 vs 1.23..1.25) | 1.25 -0.02, arrows at ~1.9 mm above the shoulder (likely) | 1.2 at shoulder; 1.14 at 1.9 mm up on the 1:30 | mismatch | yes | larger mismatch at that height |
| 07-3-2 | match | 1.65 -0.02 on the 1:70 shaft, arrows 57 % of the way down the 6.1 (likely) | at that height 1.58 + 3.5/70 = 1.630; at the hub end 1.6514 | match (at the lower limit) | yes | |
| 07-3-3 | mismatch | collar measured by scale: 77 px of 36 px/mm = 2.1 (likely); figure reads "2,40 or 2,10" | 2.0 | mismatch | yes | 2.10 -0.02 = 2.08..2.10; -0.08 |
| 07-3-4 | match | 4.1 -0.05 (likely) | 4.1 | match | yes | |
| 07-3-5 | mismatch | 1.6 from the hub's lower end to the collar end (4.1 to 5.7) (likely) | 1.5 | mismatch | yes | 1.6 = 5.7 - 4.1, consistent |
| 07-3-6 | mismatch | 5.7 (likely) | 5.6 | mismatch | yes | |
| 07-3-7 | match | 6.9 (likely) | 6.9 | match | yes | |
| 07-3-8 | match | 6.1 (likely) | 6.1 | match | yes | |
| 07-3-9 | match | 13.0 (likely) | 13.0 | match | yes | |
| 07-3-10 | mismatch (+0.09) | 6.9, collar end to tip (likely) | 6.99 | mismatch | yes | the split is wrong, the sum 12.6 is right |
| 07-3-11 | match | 12.6 -0.02 (likely) | 12.59 | match | yes | |
| 07-3-12 | match | 25.6 -0.02 (sure) | 25.59 | match | yes | |
| 07-3-13 | mismatch | 1.25 -0.02 at the lower pivot shaft (likely) | 1.2155 | mismatch | yes | -0.0145 under 1.23 |
| 07-3-14 | mismatch | 1.65 -0.02 on the lower collar (likely) | 1.6685 | mismatch | yes | +0.0185 over 1.65 |
| 07-3-15 | match | 0.21 phi, "in Lagerstein einpassen" (sure) | 0.21 | match | yes | |
| 07-3-16 | match | 0.4 (likely) | 0.4 | match | yes | accepted, not re-read |
| 07-3-17 | match | 2.4 flare length (likely) | 2.4 | match | yes | accepted, not re-read |
| 07-3-18 | match | 2 x M1 "nach Bohrlehre" (sure) | core 0.7294 | match | yes | |
| 07-3-19 | not built | the flange is a trapezoid, wide at the top (595-820) narrower below (610-790), about 13 deg by scale (likely) | vertical | not built | yes | |
| 07-3-20 | can't tell | 1:70 label straddles the shoulder (unsure) | - | can't tell | yes | |
| 07-3-21 | can't tell | an angle figure beside the lower pivot, "6.4"-like with a degree mark (illegible) | - | can't tell | yes | |

## Sheet 05 03_1 (items 07-4-*)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-4-1 | match | "Laenge der Unruhwelle 25,6" (sure) | 25.59 | match | yes | |
| 07-4-2 | match | 6.35 on the slot-like dimension left of the lower-left mass (likely) | 6.35 | match | yes | |
| 07-4-3 | not built (10 deg at the hub flange) | **the "10" is a linear dimension in the section, arrows perpendicular to the staff axis ending on the top plate's hatched step; it is a length, not an angle (the mark after it is a stray). It is not at the hub flange.** (likely) | - | can't tell (reader's item is wrong) | **no** | withdraw "not built". Whether 10 mm fits the stack: top plate 050302-1 is 9.97 thick in y (-34.46..-24.49), so plausible (unsure which part it spans) |
| 07-4-4 | match | 3.8 circled (framed: checked at inspection) (likely) | 3.8 | match | yes | |
| 07-4-5 | match | 21.05: the top screw tip is 21.0 from the hub centre by scale (770 px of 36.6) (likely); the dimension's arrows are drawn between the dashed arc and the lever strip, so what it attaches to is not certain | 21.05 | match | yes (value) | "42" the reader read is "4,2", the lever strip's width, a different dimension; it does not give 42.1 |
| 07-4-6 | can't tell | 15, 20, 15 deg, 22 deg, 1.8, 5, 4.2, 10 40 (parts 33 and 34) | - | can't tell | yes | |
| 07-4-7 | can't tell | stack 12.4 / 10 / 4.5 / 3.3 / 0.4 / 0.75 / 0.75 / 11 / 12 / 2.4 / 3.5 / 0.8 / 3.8 / 6 approx: the section is drawn with the axis horizontal; "Hoehe uebereinstimmend mit 2400 Schwingungen pro Std" next to "6 approx" | partial: top plate 050302-1 y -34.46..-24.49 (10.0); rim y -26.6..-22.8 (3.8); hub y -22.8..-18.7 | can't tell | yes | no stack dimension can be pinned to two parts with the information given; only 10 and 3.8 are plausible |
| 07-4-8 | can't tell | "Die Zeitschrauben muessen in Ruhestellung die Richtung von 6-12 einnehmen" (sure) | screws on the arm axis | can't tell | yes | the note is about the position of the arm in rest, not a size |

## Sheet 05 03_2 (items 07-5-*)

| id | reader's verdict | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-5-1 | match | 42.1 (sure by figure; tip to tip 1037 px at 24.6 px/mm) | 42.1 | match | yes | |
| 07-5-2 | match | weight in plan 4.1-4.5 (scaled) | 4.25 | match | yes | re-measured |
| 07-5-3 | match | weight height 3.3 (bottom block 985-1065 = 80 px = 3.25) | 3.3 | match | yes | better than the reader's 3.5 |
| 07-5-4 | match | weight 17.1..20.3 | 16.95..20.25 | match | yes | |
| 07-5-5 | match | head 2.2-2.4 wide in plan (57 px) (scaled, unsure) | head d 1.65; shaft 0.88 | can't tell | no | I measure the head 0.6 mm wider than the model's; the scan is too coarse at 5:1 to call it |
| 07-5-6 | match | mass centre (13.5, 7.9) (scaled) | (13.597, 7.85) | match | yes | |
| 07-5-7 | match | mass Ø 6.4 | 6.35 | match | yes | |
| 07-5-8 | match | accepted, not re-read | 6.46 | match | yes | |
| 07-5-9 | match | accepted, not re-read | 1.15 | match | yes | |
| 07-5-10 | match | three holes along the arm: centre bigger, left a ring, right filled (sure) | 3 holes | match | yes | the left hole shows a counterbore ring (see 07-6-10) |
| 07-5-11 | can't tell | 39: the dimension line runs through the hub on a 30 deg radial; its lower arrow is 18.7 mm from the hub, the far end about 19.4; an arc is drawn at the lower left. Most likely a diameter over the masses' outer edges (unsure) | masses' outer edge at 15.70 + 3.175 = 18.875, i.e. diameter 37.75 | can't tell (a possible 1.2 mm mismatch) | partly | an angle is ruled out; as a diameter the sheet and model differ by ~1.2 mm, more than the scale error (1 %) |
| 07-5-12 | can't tell | WN-12 / WN-12a pointed at one mass screw each; no size (sure) | - | can't tell | yes | |

Missed: 05 03_2 shows the arm as drawn with a waist and three holes and **two masses on each side of the arm (four in all)**, as 05 03_1 does, with the two upper masses' side view showing a screw seat in each; the model's `masses` has the four, but only the first quadrant was measured by the reader.

## Sheet 05 03_4 (items 07-6-*)

| id | reader's verdict | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 07-6-1 | match | 32.32 -0.04 (sure) | 32.3 | match | yes | |
| 07-6-2 | not built | 31.29 -0.04 (sure): the Nickelstahl/Messing boundary (the plan shows the wall as three arcs and the section as one hatched strip). **The section's "Messing" leader meets the outer lower corner of the wall, "Nickelstahl" the floor/arm hatch**, so the layers split the wall at 31.29 | one solid, arcs at 16.15 and 15.25 | not built (a material split, not an outline) | yes, with the clarification | the outline does not change: the boundary is two materials in one wall (inside 30.48..31.29, outside 31.29..32.32, 0.405 and 0.515 mm). It is a matter of how the model builds the solid (one mesh or two); geometry-wise the outer and inner sizes are right |
| 07-6-3 | match | 30.48 +0.04 (sure) | 30.5 | match | yes | |
| 07-6-4 | match | 3.8 (sure) | 3.8 | match | yes | |
| 07-6-5 | match | 1.15 (the "11,5" dimension, arrows at 400-415) (likely) | 1.15 | match | yes | |
| 07-6-6 | match | 1.5 +0.2 (sure) | 1.6 | match | yes | |
| 07-6-7 | match | 2 H7 +0.009 (sure) | 2.009 | match | yes | |
| 07-6-8 | match | Ø1 on the right hole (a filled circle) (likely) | 1.0 | match | yes | |
| 07-6-9 | match | 2.14 +0.02 from the centre axis to the right hole's centre (sure) | 2.15 | match | yes | |
| 07-6-10 | can't tell | **1.8 H7 +0.009, 0.4: a cylindrical form** (an H7 is a bore, and the section shows a stepped recess, not a cone) at **one hole only**: the plan shows the double ring round the left hole, the right one is a plain Ø1 (likely) | rim.cones: 45 deg cone 1.0 to 1.8 over 0.4 at **both** holes | mismatch (form and count) | **no** | a countersink is built at both holes; the sheet has a cylindrical 1.8 x 0.4 counterbore at one. Depth and diameter equal; shape wrong. Certainty likely: the cut in the section is hard to separate from the arm hatch |
| 07-6-11 | match | 3.2 arm end (sure) | 3.2 | match | yes | |
| 07-6-12 | match | 4 at the start of the waist (sure) | 4.0 | match | yes | place scaled |
| 07-6-13 | match | 6.5 at the waist peak (sure) | 6.5 | match | yes | |
| 07-6-14 | match | the waist figure is **R20** with its centre marked by a dot below (distance to it from the arm edge point 19 mm by scale): a radius, not a degree (likely) | arcs r 20.0 | match | yes | |
| 07-6-15 | match | 2.15 from the arm's outer face to the radial hole's axis (sure) | z -24.95 from -22.8 | match | yes | |
| 07-6-16 | match | 0.9 Steigung 0.16 (likely) | core 0.7268 | match | yes | |
| 07-6-17 | not built | 8 Koerner in 60 Teilung: the plan shows ticks round the rim in all four quadrants next to the cut (about 8-10 per quadrant), pitch 6 deg (sure); the leader goes to the outer rim (sure) | no mark features | not built | yes | the model has none |
| 07-6-18 | match | cut perpendicular to the arm (sure) | | match | yes | |

## Items the reader missed

| id | sheet | item | drawn | built | verdict |
|---|---|---|---|---|---|
| 07-6-v1 | 05 03_4 | general tolerance +-0.03 ("nicht eingetr. Toleranz +-0.03") | +-0.03 | - | the reader's +-0.05..0.1 tolerances were too loose: 3.2 arm end, 4, 6.5, 1.15, 3.8, 2.15 all still inside +-0.03 (4.0 and 6.5 exact) |
| 07-6-v2 | 05 03_4 | "poliert" on the rim, both outer and inner edges | polished | - | can't tell (surface, not geometry) |
| 07-6-v3 | 05 03_4 | the section's wall: three layers shown (outer brass, inner Nickelstahl, with 31.29 between); the floor/arm is Nickelstahl | | one solid | see 07-6-2 |
| 07-1-v1 | 05 04_4 | "nicht eingetr. Toleranz +-0.05" | | | applies to 07-1-21 etc. |
| 07-1-v2 | 05 04_4 | the sheet's top is cut (no end line) | | | the top pivot length cannot be read here; see 07-1-22 |
| 07-3-v1 | 05 03_3.2 | collar length above the hub: about 0.85 by scale (810-840 of the 2x crop) | 0.85 (unsure) | 1.1 | can't tell (unsure by scale, but 4_4 says 1.1, 4_5 1.3) |
| 07-3-v2 | 05 03_3.2 | "210 deg anlassen" vs 4_4's 240 | | | treatment differs between the two sheets; not geometry |
| 07-4-v1 | 05 03_1 | masses: plan shows four circles of 6.35 at the four corners; the lower left has a slot dimension "6,35" | | masses 6.35 | match |
| 07-4-v2 | 05 03_1 | **lever strip 4.2 wide, 22 deg from the vertical, 15 deg, 20 deg, 5, 1.8** (parts 33/34) | | not in this batch | can't tell |
| 07-5-v1 | 05 03_2 | gepr/N.gepr 1943; the sheet's "16 April 194?" | | | dating only |

## Summary of the disagreements with the reader

1. **07-1-2 and 07-1-22 (the top pivot on 05 04_4)**: the drawing of the staff is cut at the top (no end line); the 1.11 and the "7.5" are not readable as lengths or diameters. Withdraw both mismatches; the model matches 3.2's 6.9.
2. **07-4-3 (10 deg at the hub flange on 05 03_1)**: the "10" is a linear dimension of 10 mm, not an angle at the hub. Withdraw. The 10 deg flange taper is real on 05 04_5 (07-2-8) and as a trapezoid on 3.2 (07-3-19); the model's flange is vertical (not built, both sheets).
3. **07-6-10 (1.8 H7 x 0.4 on the rim)**: not "can't tell": it is a cylindrical counterbore at one hole (plan shows one ring); the model cuts a 45 deg countersink at both. Mismatch in form and in number (likely).
4. **07-1-12**: the 2.14 +0.01 is the hub bore's chamfer (hub.cones[1].d[1] = 2.14), not a staff diameter. The staff there is 2.0586 (that would be -0.08 as a staff size). The value matches, the field was wrong.
5. **07-1-3, 07-1-21, 07-1-13**: the dimension heights are not where the reader said (1.58 is 1.6 mm below the shoulder; the lower 1.11 is at the foot of the pivot; the 2.63 is drawn far below the hub), so those matches are still inside tolerance but their place is "unsure".
6. **07-4-5**: the reader's "42" is "4,2" (the lever strip's width); only 21.05 is read, as the top screw tip (21.0 by scale).
7. **07-5-5**: I read the screw head about 0.6 mm wider than the model's 1.65; too coarse to call, so can't tell rather than match.
8. **07-5-11 (39)**: most probably a diameter along a 30 deg radial through the hub; the masses' outer diameter in the model is 37.75, 1.2 mm short (unsure).
9. **Tolerances on 05 03_4** are +-0.03, tighter than the reader used; the matches still hold.
10. **Date chain for the staff**: 05 04_5 (1941/43) to 05 04_4 (undated, later) to 05 03_3.2 (1965). Against the latest sheet the model is wrong on: pivot Ø 1.25 (model 1.2), shaft/collar 1.65 -0.02 (model s6, 1.6514..1.6685), collar 2.10 (model 2.0), 5.7/1.6 (model 5.6/1.5), flange taper (model vertical). These set the timing journals: worth deciding which sheet the model is to follow.

Agree with the reader on the rest, with the hub-sleeve, 05 03_4 outline and R20 matches re-read enlarged; 07-3-16, 07-3-17, 07-5-8 and 07-5-9 were accepted, not re-read.
