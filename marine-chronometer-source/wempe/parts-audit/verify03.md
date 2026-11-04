# Batch 3 verification (frame assembly sheets and layout 001)

Method: each sheet re-read on 2x-10x Lanczos crops (kept in `E:/mc-video/wpa-audit/crops/`, not in the repository). Sizes scaled off the scan were re-calibrated on a different known size from the reader's, and circle centres were found with OpenCV Hough fits (error about 1 px, 0.08-0.2 mm at 5-12 px/mm). Verdicts use the brief's tolerances. Items not listed in a table below were read only from the tsv and are marked "accepted, not re-read" (sampled re-reads: 03-3-1..4, 03-3-14..16, 03-8-1, 03-8-3, 03-5-1, 03-1-1; all agree).

## Sheet 001 Federchronometer

Scale: left plate rim fitted by Hough, centre (257.5, 309.5) px, Ø 417 px, so 4.91 px/mm if 85 mm is exact (the reader's 4.85). Calibration on the printed 85 is circular, so I also checked the sheet against the built arbors themselves (below): the mapping sheet (u right, v down) = movement (x, z) holds for six arbors at once, which makes it self-consistent.

| id | reader's verdict | my reading (certainty) | built value found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 03-1-1 | match | Platten Ø 85 mm printed (sure) | topPlate Ø 84.989 | match | yes | accepted, re-read |
| 03-1-2 | match | 19 mm printed (sure) | gap 19.0 (050901 ymax -19.0, 050802-1 ymin 0.0) | match | yes | |
| 03-1-3 | match | pillar screws at radius about 37 (likely) | topPlate pillar holes radius 37.0 | match | yes | three screws map to the built three by u=x, v=z within 0.5 mm |
| 03-1-4 | can't tell | head Ø not resolvable (unsure) | 6.4 head / 8.6 counterbore | can't tell | yes | |
| 03-1-5 | match | barrel opening: Hough circle at (377.5, 282.5) px, r 100 px, gives Ø about 41 and centre (+24.4, -5.5) mm from the plate centre (likely) | topPlate cylinders[42.5 inside] at plate-frame (-24.784, 6.0), i.e. movement (+24.78, -6.0) | match | yes | centre within 0.5 mm, Ø within 1 mm |
| 03-1-6 | can't tell | 100 mm printed, a case part | not compared | can't tell | yes | |
| 03-1-7 | can't tell | arbor centres: tried on enlarged crops and Hough circles (see below) | placements origins | match to +-0.5 mm for six arbors (likely) | **no** | the reader's "not pickable to 1 mm" is too pessimistic: wheel circles are fitted to 0.2 mm |

Arbor centres on 001 (left plate; px to mm at 4.91 px/mm from the plate centre, then compared with placements.json (x, z)):

| arbor (hn) | placement (x, z) | sheet (Hough circle) | difference |
|---|---|---|---|
| centre wheel (WN-301, 050203) | (0, 0) | circle r 49 px at (256.5, 308.5): (-0.2, -0.2) mm | 0.3 mm |
| fusee (050604) | (-16.7, -15.3) | circle r 101 px at (176.5, 235.5): (-16.5, -15.1) | 0.3 mm |
| escape wheel (050202) | (-10.9, 6.3) | circle r 49 px at (203.5, 341.5): (-11.0, +6.5) | 0.2 mm |
| fourth wheel (050204) | (0, -23) | circle r 84 px at (259.5, 197.5): (+0.4, -22.8) | 0.4 mm |
| barrel (barrelBridge hole) | (+24.78, -6.0) | circle r 101 px at (377.5, 282.5): (+24.4, -5.5) | 0.6 mm |
| third wheel (WN-300.t38) | (9.9, 15.2) | circle r 55 px at (304.5, 386.5): (+9.6, +15.7) | 0.6 mm |

So the arbor centres agree with the sheet to about 0.5 mm (the plate rim centre and the 4.91 scale carry most of that). I did not find a clear balance circle at (-9.1, 12.1); the balance is not confirmed. Sheet 001 is a layout, not a dimensioned drawing, and 0.5 mm is its working accuracy.

Reader's 03-1-3 note "mirror image": the pillar screws map by rotation of 180 degrees in (x, plate-y) or by u=x, v=z in the movement frame, which is the same thing. Not a hand finding.

## Sheet 05 08_2 Oberplatte kompl.

Not re-read except the sample: 03-2-1..03-2-12 are all plain size matches or "can't tell". Accepted, not re-read (agreed on the 2:1 scale, errors of 0.2-0.3 mm are within the scan).

## Sheet 05 08_6 Unruhkloben oben kompl. (5:1)

Scale: R6 end radius 75 px (orig) per 6 mm gives 12.4 px/mm; the printed 12 (axis to the step arc) gives 12.0; the 1.8 slit (22 px) gives 12.2; the 10 mm pin pair spacing (125 px) gives 12.5. So 12.2 +-0.3 px/mm, 2.5 % scatter, which is 0.8 mm over the 33 mm foot span.

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 03-3-1..4 | match | 15, 3.2, 3.2, 11.8 (sure) | 15.0, 3.2, 3.2, 11.8 | match | yes | re-read, all legible |
| 03-3-9 | mismatch (-0.47) | second round hole at (668.5, 453.5) px, axis (784.5, 454.5): 116 px = 9.5 mm at 12.2 px/mm, 9.3-9.7 over the calibrations (likely) | Ø 2.8 at 10.0 along the axis | can't tell | **no** | the foot hole, the pin holes and this hole all read 0.3-0.6 mm short of the built values on the same scale (foot hole 32.6 against 33.0 built, third pin 23.7-24.1 against 24.5). The common offset is calibration, and the scale scatter over 33 mm is 0.8 mm. A 0.5 mm difference at 10 mm is 6 px, but the other holes show the same bias, so it can't be separated from the scale. The sheet gives no dimension for it |
| 03-3-13 | mismatch (4.1 vs 5) | pin hole at (721.5, 400.5), axis x 784.5: 63 px = 5.1 mm from the axis (sure geometry, likely attachment) | pin at 4.1 from the axis | mismatch | yes, but not for the reader's second reading | the extension line does end on the slit's right edge, which would mean 4.1 + 0.9 = 5.0, but the drawn geometry contradicts it: the pin is 5.1 mm from the axis and 5.9 from the slit edge by scale. Either the printed 5 is to the axis or the pin was drawn off. Both give 5.0-5.1 from the axis against built 4.1: delta 0.9-1.0, far above the scan error (0.15). Mismatch stands |
| 03-3-18 | mismatch (1.4/1.4 vs 1.63/1.17) | stack top to split 1.4, split to stack bottom 1.4, both printed with arrows (sure on the figures); the hatch boundary between the two blocks sits at 1.5 +-0.15 from the top by pixel profile (unsure) | settingCU 1.63, settingBU 1.17 | mismatch | yes | the printed figures decide: 1.63 against 1.4 is 0.23, over the +-0.05 fallback. The scan alone could not reject 1.63 (hatch at 1.5 +-0.15), so the verdict rests on the printed 1.4 |
| 03-3-19 | mismatch (sheet proud, built recessed) | the 0.5 is the distance from the setting stack's bottom to the bottom of the Ø 6 collar (dimension arrows from the stack's lower line to the collar's lower line: 37 px at 63 px/mm in the 5x crop) (likely) | the setting's bottom is 0.5 above the cock's collar bottom (cock z 11.8, setting bottom z 12.3, cone d 6.0 to 7.6 z 11.8..12.6) | match | **no** | the reader took the 0.5 as setting standing 0.5 below the arm underside. In the section the collar is a boss under the arm with a 45 degree flare (6 to 7.6 over 0.8), and the setting is recessed 0.5 inside its mouth. This is exactly what is built. Refuted |
| 03-3-20 | not built | Ø 6 is the width of the collar's lower rim: the 6 dimension spans the collar's bottom edge, 250 to 605 px in the 5x crop (355 px = 5.6 mm by the 1.4 scale, 6 within the arrow ends) (likely) | cones[6.0->7.6, z 11.8..12.6] | match | **no** | the collar is built; Ø 6.0 at its bottom matches the printed 6. The reader looked for a flange on the setting |
| 03-3-21 | can't tell | 22 degree dashed arcs, 2.2 mm between (unsure); the arc is drawn as "22 deg" in the plan (not 2.2) | arcs r 11.2 and r 12.0 | can't tell | yes | the dimension "22 deg" is an angle of the dashed pair of arcs, not a gap; it is not measured in the built part |
| 03-3-8, -17, -22 | match | foot hole position, 0.1 proud, overall length | | accepted, not re-read | | |

## Sheet 05 08_10 Zwischenbrücke kompl. (2:1)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 03-4-4 | mismatch (bore step 0.69 vs 0.70) | 0.7 +0.02 with arrows at x 598 (2x crop), not on the bush itself; the bush at x 665-730 is separate; the attachment is unclear (unsure) | bush 0.71 below the face (in 0.70-0.72); bore step 0.69 | can't tell | **no** | the bush sits at 0.71, inside 0.70-0.72. A 0.01 mm difference on a step is not resolvable at 2:1 and the dimension's attachment to the step or the bush is unclear. Not a mismatch I could stand behind |
| 03-4-2, -3 | match | 1.3 and 1.7 printed | 1.30, 1.70 | match | yes | re-read |

Other items on this sheet accepted, not re-read.

## Sheet 05 08_12 Federhausbrücke kompl. (2:1)

Scale: bridge thickness 24 px (orig) for 3.3 gives 7.3 px/mm; the centre-to-centre distance (184 px against built 27.68) gives 6.65; 2:1 on the page scale (3.45 px/mm) gives 6.9. The scale is uncertain by 5 %.

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 03-5-7 | mismatch (sheet larger by 0.6) | Hough circles (orig px): upper end hole Ø 24.8, arbor hole Ø 27.4, lower end hole Ø 24.5. The end holes are 0.90 of the arbor hole (scale-free, +-0.04) (likely) | end holes Ø 2.8, arbor hole Ø 3.9 (ratio 0.72) | mismatch | yes | with the arbor hole at the built 3.9 the end holes are 3.5 (3.3-3.7); by scale (6.65-7.3 px/mm) 3.4-3.7. Either way 0.5-0.9 over the built 2.8, which is beyond the scan error (+-0.2) |
| 03-5-8 | match | centre distances 184 and 169 px, ratio 1.09 against built 27.68/25.55 = 1.083 (likely) | | match | yes | proportion agrees; absolute values depend on the 5 % scale |
| 03-5-1 | match | 1.3 printed | 1.30 | match | yes | |

Other items accepted, not re-read.

## Sheet 05 08_32.1 and 05 08_32.2

Accepted, not re-read except the stud heights (12.3 and 6.8 printed on both sheets, matched by the reader).

## Sheet 05 08_33 Unruhkloben unten kompl. (5:1)

Scale: the 10 printed in Ansicht A is 230 px at 2x, 11.5 px/mm orig; the arm thickness reads 75 px at 2x, 3.26 mm; the foot width 8.3; in the plan the foot's short edge is 93 px orig, 7.8 mm at 11.9 px/mm; the screw head Ø 2.5 reads 30 px, 12.0 px/mm. So 11.9 +-0.4 px/mm.

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 03-8-1 | match | 10 printed (sure) | 10.0 | match | yes | |
| 03-8-2 | mismatch (19.75 vs 17.2 or 20.0) | 19.75 printed with extension lines on the tall block's left face and the arm end (sure). In plan I measured the extent perpendicular to the foot axis: foot corner at 509 to the right-hand lobe edge at 757 (px along the perpendicular v=(0.928, 0.371)): 248 px, 20.3 mm at 11.9 and 19.8 at 12.5 (likely) | extent across the foot's width direction 17.2 (box y -13.2 to 4.0) | mismatch | yes | the printed 19.75 and my plan measurement agree, and 17.2 is 2.5 mm short. The 20.0 foot length is a different direction (my reading of the foot's long axis is 237 px = 19-20 mm, which matches the built 20) |
| 03-8-4 | mismatch (3.22 vs 3.3) | 3.3 printed in the C-D section (the 3.3 spans the arm's thickness in the section, 75 px at 2x = 3.26) and 3.26 in Ansicht A (75 px at 2x) (likely) | z_levels 6.78 to 10.0 = 3.22 | mismatch | yes, marginal | delta 0.08 over the +-0.05 fallback, but the scan alone gives 3.26 +-0.1; the verdict rests on the printed 3.3 |
| 03-8-6 | mismatch (1.4+1.4 vs 1.53+1.19) | 1.4 and 1.4 printed at the top of the C-D section (sure on the figures) | settingBL 1.53, settingCL 1.19 | mismatch | yes | as 03-3-18 |
| 03-8-8 | mismatch (0.1 proud vs flush) | 0.1 is printed at the left of the C-D section, between the setting's end and the arm face (likely, as the upper cock's 0.1 on 05 08_6 is the setting top above the arm) | settingCL top flush with the cock top y -9.0 | mismatch | yes | |
| 03-8-7 | match | 0.5 at the other end (likely) | 0.50 recessed | match | yes | and agrees with the upper cock's collar reading |
| 03-8-11 | can't tell | 28 degree cone at the foot of the section beside the 0.8 (unsure) | no 28 degree cone | can't tell | yes | |

Items the reader missed on this sheet (reading the plan, not dimensioned):

- 03-8-v1: the plan's outline is not the built outline. The sheet shows the arm as a strip about 12 mm wide and about 17 mm long next to the foot, ending in a lobe round a Ø about 2.2-2.4 hole (at plan px (592, 428) orig), with a concave neck (radius about 5 mm) between the foot and the lobe. The built arm is a 10 mm wide strip with an R 5 semicircular end and no hole in it. This is a finding about the part, not only the width. Verdict: mismatch (outline) and not built (the lobe hole). Likely. The size cannot be given more closely than +-0.5 mm.
- 03-8-v2: foot holes. The sheet shows four on the foot: a large Ø about 2.2 near the foot end (at about 1.25 mm from the end along the axis), a small Ø about 1.2 beside it (2.6 mm), the mid hole with the pin and a ring (9.9 mm) and a small one (16.5 mm). Built: three (x = -7, 0, +7: 3, 10, 17 mm from the end, Ø 1.58, 2.11, 1.58). The large hole near the foot end is not built (not built, likely). The positions of the others (3, 10, 17 against 2.6, 9.9, 16.5) agree to 0.5.
- 03-8-v3: the setting screws. The sheet has two dashed circles (Ø about 2.3) at +-3.5 along the strip axis (the 3.5 dimension) and two solid slotted screws (head 2.5) lower in the arm, spaced 7.3 mm. The built part has two small Ø 0.93 holes at +-3.55 along the axis and the screws WN-18 with the 2.5 head over them. The sheet's solid screws are not at the setting axis' +-3.5; they are 6.4-6.8 mm below it in the strip. I could not tell what the lower pair belongs to (Ansicht A shows two screws standing out of the arm). Can't tell.

## Items the reader missed (summary)

- 03-1-v1: the arbors on 001 can be placed (table above); six agree to 0.5 mm.
- 03-3-v1: the 05 08_6 collar under the setting (Ø 6, 0.8 deep, 45 degree flare to 7.6) is built; the printed 0.5 is the setting's recess inside it.
- 03-8-v1, -v2, -v3: the lower cock's plan outline, a large foot hole and the lobe hole (above).

## Summary of the disagreements with the reader

1. 03-3-19 (setting 0.5 recessed, called a mismatch): refuted. The sheet's 0.5 is the stack's bottom above the collar's bottom, which is what is built.
2. 03-3-20 (Ø 6 flange not built): refuted. Ø 6 is the collar's rim, built as cones[6.0->7.6].
3. 03-3-9 (second hole 0.47 short): can't tell. The foot hole, third pin hole and this hole all read 0.3-0.6 mm short on the same scale; it is calibration (2.5 % scatter over 33 mm).
4. 03-4-4 (bore step 0.69): can't tell. The bush sits at 0.71, in tolerance; 0.01 mm is not resolvable and the dimension's attachment is unclear.
5. 03-1-7 (arbor centres can't tell): six arbors agree to 0.5 mm by Hough circles; match (likely).
6. 03-3-13 (pin 5 from the axis or the slit edge): the mismatch stands, but the reader's alternative (4.1 + 0.9 = 5.0 to the slit edge) is contradicted by the drawing's geometry: the pin is 5.1 from the axis and 5.9 from the slit edge.
7. Agreed after re-reading: 03-3-18, 03-8-6 (split 1.4/1.4 on the printed figures), 03-5-7 (end holes about 3.5 against 2.8), 03-8-2 (19.75 against 17.2), 03-8-4 (3.3 against 3.22, marginal), 03-8-8 (0.1 proud).
8. Missed by the reader: the lower cock's plan (a long arm with a lobe, hole at the lobe, concave neck, and a fourth foot hole) differs from the built outline.
