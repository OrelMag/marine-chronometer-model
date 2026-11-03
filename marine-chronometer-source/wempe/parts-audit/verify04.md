# Batch 4 verification (the going train: 05 05_1 to 05 05_7)

Verifier. Inputs: the sheet images, `r_wpa/measure/*.json`, `r_wpa/page/placements.json`, `batch04.items.tsv`. Crops are in `E:/mc-video/wpa-audit/crops/` (outside the repository). Dimensions below were re-read on 2x to 6x enlargements.

## The pivot lengths (the main question)

All four figures were re-read and what their extension lines attach to was checked.

- **05 05_4** (Sekundentrieb, rev. 6.6.46): `9,2` runs from the pivot tip (a pointed cone) to the line through the collar's top face. Sure. The same line starts `9,25-0,1`. The scale is 5:1 at about 34 px/mm on the 2x image. The 9.2 spans 318 px, which is 9.3 mm. The collar is 77 px, which is 2.25 mm. So the dimension is the pivot alone, not a total length. `4,5` runs from the shoulder line (the 30° chamfer's foot) to the tip. 150 px, 4.4 mm. Sure.
- **05 05_2** (assembly, 1943): `7,2` runs from the tip to the same collar-top line. 257 px at the same scale, 7.2 mm. The lower pivot is `3`, 100 px. Sure.
- **05 05_5** (assembly): `3-0,1` for both pivots. Sure.
- **05 05_7** (part, rev. 6.6.46): `4,6-0,2` for the upper pivot, from the tip to the collar-top extension line, and `4,6-0,2` for the lower pivot, from the shoulder line to the tip. Scale is 34 px/mm and the arrows span 150 and 155 px, so about 4.5 mm. Sure.

Which version fits?

- **Layout 05 05_1** (5:1; 7 mm = 350 px on a 4x crop, so 50 px/mm).
  - The seconds arbor's collar top (the end of the 1.55 collar, 150 px) to the tip (520 px) is 370 px, 7.4 mm. This supports 7.2. A 9.2 pivot would be 460 px.
  - The tip is 442 px below the Unterplatte face, 8.84 mm. Built: tip y 12.28 minus plate face 3.35 is 8.93 mm. So the built tip is where the layout puts it.
  - The built collar top is at y 5.07, and the layout shows it about 1.4 mm below the plate face (so about 1.7 mm above in the built frame; same order).
  - The lower pivot end of the seconds arbor and of the intermediate arbor is drawn inside the Oberplatte stone, short of its outer face. Built: tip y -21.98, outer face -22.35, so 0.37 mm inside. With 4.5 or 4.6 the tip would stand 1.1 to 1.2 mm outside the plate.
  - The intermediate arbor's upper end is drawn inside the Zwischenbrücke. Built: 6.98 against the bridge face 7.15 (`050804-1` box y 3.35..7.15). With 4.6 it would stand 1.5 mm outside.
- **placements.json**: the arbor lengths and the plate faces (Oberplatte inner -19, outer -22.35; Unterplatte 0..3.35; Zwischenbrücke 3.35..7.15) are consistent with the built 3.0 and 2.95 lower pivots ending inside the plates.

Conclusion: the assemblies (1943) and the layout fit the built lengths (7.2/3 and 3/3). The part sheets (6.6.46) print longer pivots and a wider intermediate pivot (0.85). Their revision notes do not list the pivot lengths among the changes (05_4 lists 24.1, 1.2 and 1.55). The reader's mismatches 04-4-1, 04-4-15, 04-7-9 and 04-7-10 stand as mismatches against the part sheets, and the sheets contradict each other and the layout. I agree with the reader's reading of the figures. I do not claim to know which pivot the real chronometer had.

## Sheet 05 05_1 (layout)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-1-1 | match | 18,12 (sure) | origins (0,0) to (9.91,15.17): 18.1201 | match | yes | |
| 04-1-2 | match | 12,63 (sure) | 12.63 | match | yes | |
| 04-1-3 | mismatch | 17 from the Oberplatte inner face to the top face of the wheel rim (sure; the arrow ends on the rim, not on the hub above it) | box ymin -1.74, plate inner -19: 17.26 | mismatch | yes | scaled: 410 px at 24.1 px/mm = 17.0. 0.26 is over the fallback ±0.1 |
| 04-1-4 | match | 19,2 (sure) | 19.23 | match | yes | |
| 04-1-5 | match | 13,8 (sure) | 13.88 | match | yes | within the scan |
| 04-1-6 | match | 19 to the Unterplatte's inner face (the hatched plate's top face), sure | 19.0 | match | yes | |
| 04-1-7 | mismatch | label 3,0 beside the Oberplatte (sure of the figure). The plate is drawn 85 px = 3.5 mm at the sheet's own scale | z 0..3.35 | mismatch | yes, with a note | the printed 3.0 against 3.35 is a mismatch. The drawn proportions (3.3 to 3.5) fit the built 3.35, so the label and the drawing disagree |
| 04-1-8 | mismatch | label 3,0 on the Unterplatte (likely; the figure is clear, a `4` dimension beside it runs plate face to the nut's bottom face and a `3,1` below it) | 3.35 | mismatch | yes | the plate is drawn about 3.5 mm (700 to 790 px at 24 px/mm). Same note as above |
| 04-1-9 | mismatch | 4 on the Zwischenbrücke (sure; the digit is clear on a 4x crop) | 3.8 | mismatch | yes | the bridge is drawn 190 px at 50 px/mm = 3.8 mm, i.e. the built value. Printed 4 against built 3.8 is -0.2 against ±0.05; the drawing's proportion disagrees with its label |
| 04-1-10 | match | 7 from the Unterplatte face to the dial's inner face (sure) | 7.0 | match | yes | |
| 04-1-11 | match | 24,5 φ, drawn from the cut-out's edge to the intermediate arbor's axis (the line ends on the axis, so a half-width of 12.25 read as a diameter), sure | 24.5 inside | match | yes | the scale agrees: 12.65 mm half-width drawn |
| 04-1-12 | match | Loch φ 1,7 (sure) | 1.7 | match | yes | |
| 04-1-13 | can't tell | 0,5 (likely) from the dial's outer face to the tip; drawn 40 px at 50 px/mm = 0.8 | 0.705 | match within the scan | no (softer) | 0.5 against 0.7 is 0.2, the scan allows 0.3 (one pixel is 0.02 mm at this scale but the stroke is 5 to 8 px wide). The tip's position against the plate is confirmed: 8.84 drawn, 8.93 built |
| 04-1-14 | can't tell | 12,9 and 2 are the plate face to the thread's start and the thread's length; 3,1 and 10,9 belong to the nut and the neck (unsure for those two) | 050503-2 ymax 18.36: 15.0 from the plate face | likely match for the total (12.9 + 2 = 14.9 against 15.0) | partly | the arbor's own sheet is not in this batch. Note the built thread is 7.5 long (`cones[13]` z 29.76..37.22) and the layout's end spigot is drawn 2 long. Can't tell for the others |
| 04-1-15 | can't tell | 5,5 φ, a circle drawn round the Sekundenrad bush, an enlargement mark (likely) | - | can't tell | yes | |

## Sheet 05 05_2 (seconds wheel assembly)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-2-1 | match | 7,2 from the tip to the collar top (sure) | 31.25 - 24.05 = 7.2 | match | yes | the tip is a rounded dome on this sheet; see 04-2-v1 |
| 04-2-2 | match | 9,2 ±0,05 from the collar top to the wheel's top face (sure) | 24.05 - 14.85 = 9.2 | match | yes | |
| 04-2-3 | match | 14,8 (likely; the extension line is at the wheel's top face) | 14.85 | match | yes | general ±0.05, at the limit |
| 04-2-4 | match | 3 (sure) | 3.0 | match | yes | |
| 04-2-5 | mismatch | 0,8 -0,02 (sure) | `cones[6]` 0.7767..0.81 | mismatch | yes | 0.81 is 0.01 over 0.80. The part sheet prints 0.82 -0.02 (0.80..0.82), which includes 0.81, so the sheets disagree with each other |
| 04-2-6 | match | 0,73 φ "i/Steinlager einpassen", 2 above the collar (sure) | 0.728 | match | yes | |
| 04-2-7 | match | Kegel 1:90 on the upper, and `Kegel 1:90` also written on the lower (sure) | upper 1:90, lower 1:83 | mismatch on the lower | no | the lower pivot's taper is `cones[6]` 0.7767..0.81 over 2.77 mm = 1:83. Both pivots carry 1:90 on the assembly (and on 05_4). 1:83 is a 7 % departure; the tolerance on the taper is not printed, so call it a small mismatch |
| 04-2-8 | can't tell | 6 φ twice, each across the hub below and above the wheel's top (likely) | 6.4 | mismatch against this sheet (6 against 6.4), match against the part sheet (6.5 -0.2) | no | the assembly's 6 (general ±0.05) disagrees with its own part sheet's 6.3..6.5. Built follows the part sheet. Not "can't tell": the figure is clear |
| 04-2-9 | match | 0,2 (likely) | 0.25 | match | yes | within ±0.05 |

## Sheet 05 05_3 (seconds wheel)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-3-1 | match | z = 80 (sure) | 80 | match | yes | |
| 04-3-2 | match | D = 21,9 (sure) | 21.898 | match | yes | general ±0.01 (`nicht eingetr. Toleranz ±0,01`) |
| 04-3-3 | match | dg = 20,23 (sure) | 20.2295 | match | yes | |
| 04-3-4 | match | derived (D - dg)/2 = 0.835 | 0.8343 | match | yes | |
| 04-3-5 | can't tell | Zykloidenverzahnung; t 0,827, l 0,38, M 0,263 (sure) | polylines | can't tell | yes | |
| 04-3-6 | can't tell | 22,5 -0,2 (sure) | not on the finished part | can't tell | yes | |
| 04-3-7 | match | 18,3 +0,2 (sure) | 18.4 | match | yes | |
| 04-3-8 | match | 6,5 -0,2 (sure) | 6.4 | match | yes | |
| 04-3-9 | match | 2,6 H7 +0,009 (sure) | 2.6 | match | yes | ISO H7 for 1..3 mm is +0.010; the sheet prints 0.009 |
| 04-3-10 | match | 1,3 -0,2 (sure) | 1.2 | match | yes | |
| 04-3-11 | match | 5 arms, 72° (sure) | 5 | match | yes | |
| 04-3-12 | match | Radstärke 1,0 ±0,03 (sure) | 1.0 | match | yes | |

## Sheet 05 05_4 (Sekundentrieb)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-4-1 | mismatch | 9,2 tip to collar top (sure) | 7.2 | mismatch | yes | assembly and layout say 7.2. See "The pivot lengths" |
| 04-4-2 | match | 0,65 φ at the tip's cone base (likely) | 0.671 at z 31.15 | match | yes | the tip is a pointed cone on this sheet; see 04-4-v1 |
| 04-4-3 | match | 0,76 -0,02 (sure) | 0.75 | match | yes | |
| 04-4-4 | match | 1,55 -0,1 (sure) | 1.5 | match | yes | |
| 04-4-5 | match | derived 2.25 | 2.2 | match | yes | general ±0.1 |
| 04-4-6 | match | 9,25 -0,1 (sure) | 9.2 | match | yes | |
| 04-4-7 | match | 7 (sure) | 7.0 | match | yes | |
| 04-4-8 | can't tell | stock 3,5 (Präz. Rundstahl 3,5 Din 175; drawn 3.44) | tips 3.166 | can't tell | yes | the leaves are shown as an uncut block |
| 04-4-9 | can't tell | no leaf count on the sheet (sure); no table or note anywhere in the batch gives it | 10 | can't tell (sheet). Derived: 10 from the 05_6 wheel's M 0,280: the seconds pinion's pitch circle is 12,63 x 2 - 22,453 = 2.807 mm = 10.02 M | yes | the leaf count is not printed. Derivable from the wheel's d 22,453 (05_6) and the centre distance 12.63 |
| 04-4-10 | mismatch | 2,6 n6 +0,013/+0,006 (sure; read again at 5x) | 2.6 | mismatch | yes | built 6 to 13 µm under the printed limits. ISO 286 n6 for 1..3 mm is +0.010/+0.004, so the printed values are not ISO's; I used the printed ones |
| 04-4-11 | match | 1,2 +0,1 (sure) | 1.25 | match | yes | |
| 04-4-12 | match | 1,55 -0,1 (a) (sure) | 1.5 | match | yes | |
| 04-4-13 | match | 24,1 -0,1 (sure) | 24.05 | match | yes | the revision note: `24,1 -0,1 war 24 -0,05` |
| 04-4-14 | match | 0,82 -0,02 (sure) | 0.81 | match | yes | |
| 04-4-15 | mismatch | 4,5 (sure) | 3.0 | mismatch | yes | assembly and layout say 3. The tip would stand 1.1 mm outside the Oberplatte |
| 04-4-16 | match | 30° chamfer (likely) | 30° | match | yes | |
| 04-4-17 | match | Kegel 1:90 (sure) | upper 1:90 | match for the upper; the lower is 1:83 (see 04-2-7) | partly | the sheet writes Kegel 1:90 along the lower pivot as well |
| 04-4-18 | mismatch | pointed cone (sure on the form) | upper: 45° chamfer to a flat of d 0.47 | mismatch | yes | the lower pivot on the sheet is also a pointed cone (0.82 base, about 0.4 long, 4.4 mm scaled). Built: a rounded dome (`cones[0..5]`). See 04-4-v2 |

## Sheet 05 05_5 (intermediate wheel assembly)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-5-1 | match | 23,05 -0,1 (sure) | 23.0 | match | yes | |
| 04-5-2 | match | 3 -0,1 (sure) | 2.95 | match | yes | |
| 04-5-3 | match | 3 -0,1 (sure) | 2.95 | match | yes | |
| 04-5-4 | mismatch | 0,82 -0,02 (sure) | 0.825 at the shoulder | mismatch | yes | 0.005 over the limit. 05_7 prints 0.85 -0.05 (0.80..0.85), which includes 0.825, so the sheets disagree |
| 04-5-5 | can't tell | 7 φ vernietet; the label points at the riveting; the section drawn is not clearly a 7 mm hub (unsure) | 7.45 | can't tell | yes | the part sheet 05_6 prints 7.5 -0.1 (7.4..7.5), which includes 7.45 |
| 04-5-6 | match | 0,2 (unsure) | 0.30 | match, marginal | yes | 0.1 over a 0.2 that is itself scaled |
| 04-5-7 | can't tell | Kegel figure small (unsure) | 0.3° | can't tell | yes | |

## Sheet 05 05_6 (intermediate wheel)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-6-1 | match | z = 80 (sure) | 80 | match | yes | |
| 04-6-2 | match | D = 23,33 (sure) | 23.329 | match | yes | general ±0.01 |
| 04-6-3 | match | dg = 21,57 (sure) | 21.569 | match | yes | |
| 04-6-4 | match | derived 0.88 | 0.880 | match | yes | |
| 04-6-5 | can't tell | cycloidal t 0,882, l 0,40, M 0,280 (sure) | polylines | can't tell | yes | |
| 04-6-6 | can't tell | 24 -0,2 (sure) | not on the finished part | can't tell | yes | |
| 04-6-7 | match | 19,3 +0,2 (sure) | 19.4 | match | yes | |
| 04-6-8 | match | 7,5 -0,1 (likely; a leader through the centre to the hub's rim, reads 7.6 on the scale) | 7.45 | match | yes | |
| 04-6-9 | match | 4 H7 +0,012 (sure) | 4.0 | match | yes | |
| 04-6-10 | match | 1,3 -0,2 (sure) | 1.2 | match | yes | |
| 04-6-11 | match | 5 arms, 72° (sure) | 5 | match | yes | |
| 04-6-12 | match | Radstärke 1,0 -0,1 (sure) | 0.95 | match | yes | |

## Sheet 05 05_7 (Zwischentrieb)

| id | reader's verdict | my reading of the sheet (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 04-7-1 | match | 2 -0,1 (sure) | 1.95 | match | yes | |
| 04-7-2 | match | 2 -0,1 at the collar (likely) | 1.95 | match | yes | |
| 04-7-3 | mismatch | 4,0 n6 +0,016/+0,008 (sure; read again at 5x) | 4.0 | mismatch | yes | built 8 to 16 µm under. ISO 286 n6 for 3..6 mm is +0.016/+0.008, the same as printed |
| 04-7-4 | match | 1,3 -0,1 (sure) | 1.25 | match | yes | |
| 04-7-5 | match | 4,6 -0,2 across leaf and seat (likely) | 4.5 | match | yes | |
| 04-7-6 | match | 19,25 -0,1 (sure) | 19.2 | match | yes | |
| 04-7-7 | match | 23,05 -0,1 (sure) | 23.0 | match | yes | |
| 04-7-8 | match | 0,85 -0,05 (sure) | 0.825 | match | yes | the assembly (05_5) prints 0.82 -0.02, so see 04-5-4 |
| 04-7-9 | mismatch | 4,6 -0,2 (likely; the extension line is at the collar top) | 2.95 | mismatch | yes | see "The pivot lengths" |
| 04-7-10 | mismatch | 4,6 -0,2 (sure) | 2.95 | mismatch | yes | same |
| 04-7-11 | match | 30° chamfer (likely) | 30° | match | yes | |
| 04-7-12 | can't tell | stock 5,2 (Präz. Rundstahl 5,2 Din 175) | tips 4.719 | can't tell | yes | |
| 04-7-13 | can't tell | no leaf count printed | 12 | can't tell (sheet). The cd of 18.12 and the 90-tooth centre wheel built here (module 0.355) agree with 12 leaves, but nothing printed says so | yes | |

## Items the reader missed

| id | sheet | item | drawn (certainty) | built | verdict |
|---|---|---|---|---|---|
| 04-2-v1 | 05 05_2 | tip forms of the seconds arbor | both ends rounded (a dome), sure | lower: a dome (`cones[0..5]`, flat 0.2 at the end), upper: a 45° chamfer to a flat of d 0.47 (`cones[9]`) | upper mismatch, lower match |
| 04-4-v1 | 05 05_4 | upper tip: a pointed cone, base 0.65, about 0.46 long (scaled, likely) | | flat of 0.47 | mismatch (same as 04-4-18) |
| 04-4-v2 | 05 05_4 | lower tip: a pointed cone, base 0.82, about 0.4 long (likely) | | a rounded dome | mismatch |
| 04-5-v1 | 05 05_5 | tips of both pivots: rounded (sure) | | domes at both ends, `cones[0..5]` and `[10..15]` | match |
| 04-7-v1 | 05 05_7 | both tips pointed cones (sure) | | domes | mismatch |
| 04-3-v1 | 05 05_3 | pitch circle d = 21,066 (sure; t = 0.827 = pi d / 80 checks) | not measured directly; tips and roots agree with it (21.898 + 20.2295 averaged is 21.06) | accepted, derived |
| 04-6-v1 | 05 05_6 | pitch circle d = 22,453 (sure) | same | accepted, derived |
| 04-1-v1 | 05 05_1 | dial thickness: a label that reads 1,5 or 1,2 (unsure) beside the Zifferblatt, drawn 1.0 mm | 1.22 (10.35..11.57) | can't tell |
| 04-4-v3 | 05 05_4 | `nicht eingetr. Toleranz ±0,1`: general tolerance on the 7, the 4,5 and others (sure) | | used above (the 4.5 is a mismatch with it) |
| 04-2-v2 | 05 05_2 | `nicht eingetr. Toleranz ±0,05` (sure) | | used above |
| 04-4-v4 | 05 05_4 | revision note: `Maß 24,1 -0,1 war 24 -0,05`, `Maß 1,2 +0,1 war 1,3 -0,1`, `(a) 4x Maß 1,55 -0,1 war ohne Toleranz`, with a reference `24.3.48` (sure) | | the built values follow the revised figures; the note does not mention the pivots' lengths or the 0.82/0.85 diameters |

## Summary of the disagreements with the reader

- **Pivot lengths**: I read the same figures (9.2/4.5 on 05_4, 4.6/4.6 on 05_7, 7.2/3 on 05_2, 3/3 on 05_5), attached to the pivot alone. The layout 05_1 and the plates' spacing fit 7.2/3 and 3/3. The part sheets' longer pivots would stand 1.1 to 1.5 mm outside the plates and the bridge, and the seconds pivot 2 mm further past the dial. Agree with the reader.
- 04-2-7 (taper): the reader marked match; the lower seconds pivot is 1:83, not 1:90. Small mismatch.
- 04-2-8 (hub 6): the reader had can't tell; the figure is clear and the assembly and part sheets disagree. The built 6.4 follows the part sheet.
- 04-1-13: I call it a match within the scan, not can't tell. The tip's position against the plate matches the layout (8.84 against 8.93).
- 04-4-17: the 1:90 on the sheet is on both pivots; only the upper is built to it.
- 04-1-14: the total length from the plate face reads 14.9 against 15.0 built (likely).
- Missed: the tip forms (pointed cone on both part sheets, a dome on both assemblies; built is a dome, except the seconds' upper flat chamfer). Missed too: 04-1-7, 04-1-8 and 04-1-9 are printed values that the drawing's own proportions contradict (the plates scale 3.3 to 3.5, the bridge 3.8).
- Not re-read: none of the mismatches or can't tells. Outline matches accepted after sampling: 04-3-2..4, 04-6-2..4, 04-5-1..3 and 04-7-1, -2, -4, -6, -7 were re-read, and the rest of the matches, which are derived or equal to a printed figure, were accepted without a separate crop.
