# Batch 3 reading: the frame's assembly sheets and the layout plan 001

Reader: sheets read blind (BRIEF.md). These sheets print few dimensions; most items are scaled from the scan. The scale of each sheet was calibrated on a known overall size (it differs from the nominal 2:1 on some sheets; noted per sheet). Where a plate is drawn from its outer side the plan is the built plan mirrored in x; the hand of asymmetric parts was checked and agrees (no mirrored part found).

## Sheet 001 Federchronometer (layout plan of both plates, 2:1)

**Title block as read.** Benennung 'Federchronometer', Maßstab 2:1, Werkstoff blank, no tolerance note legible, dated 1941 (day digits unsure). For the spring-detent Wempe. Sure on title and scale.

**Views and cross-check.** Two plan views side by side, no section. Left: a plate with three big slotted pillar screws about 120 degrees apart and the train circles. Right: the other plate inside the dashed 'innerer Gehäuse Ø 100 mm' ring, with the barrel opening, the slanted intermediate bridge, fusee circles and screws. Text: 'Platten Ø 85 mm', 'innerer Plattenabstand 19 mm', 'innerer Gehäuse Ø 100 mm', 'evtl. Einlage gegen magnetische Einflüsse'. The left plate's screws are the mirror image (in x) of the built plan, so the left view is a plate seen from its other face. There is no section, so no cross-check is possible (step 2).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-1-1 | plate diameter (Platten Ø) | 85 mm; sure | topPlate cylinders[outside 84.989].d 84.989; pillarPlate same | -0.011 | match |
| 03-1-2 | inner plate distance (innerer Plattenabstand) | 19 mm; sure | placements 050901 (top plate) box ymax -19.0 and 050802-1 (pillar plate) box ymin 0.0: gap 19.0 | 0.0 | match |
| 03-1-3 | three pillar screws on a circle 120 deg apart (scaled on the left plate, 4.85 px/mm from the 85 mm rim) | radius 36.9-38.1 mm, mirror image of the built plan; likely | topPlate cylinders[8.6 inside]: (-18.5,-32.043),(36.858,-3.225),(-6.425,36.437), radius 37.0 | within 0.4 (scan) | match |
| 03-1-4 | pillar screw head (slotted circle) | about 7.4 mm scaled (head or counterbore); unsure | pillarScrew WN-57 cylinders[6.4 outside].d 6.4; plate cylinders[8.6 inside].d 8.6 | n/a | can't tell |
| 03-1-5 | barrel opening (big circle on the right plate) | about 41-42 mm scaled; unsure | topPlate cylinders[42.5 inside, arc 241] at (-24.784,6.0) | about -1 (scan) | match |
| 03-1-6 | inner case diameter (innerer Gehäuse Ø) | 100 mm; sure (printed) | case parts are in the box frame; not compared | n/a | can't tell |
| 03-1-7 | arbor and wheel centres of the train and escapement in plan | faint circles; centres not pickable to 1 mm at 1024 px | placements.json origins (e.g. 050301-1 at (-9.1,0,12.11)) | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_2 Oberplatte kompl. 05 08 01 (top plate, complete; rev. 8.11.46)

**Title block as read.** Benennung 'Oberplatte kompl.', Zeichnung Nr 05 08 01, Maßstab 2:1, Werkstoff blank (hatch line), gez. 25.9.41, revision a 'zeichnerisch geändert 8.11.46'; no general tolerance legible. Labels: 05 08 01-1 plate, WN-34 screw, 05 08 01-2 fusee bush, -3 and -4 (dust bush and cork ring), 05 08 01-5 'Anschlagstift unten vorstehend' (stop pin standing out below), WN-301 and WN-300 bushes. Sure.

**Views and cross-check.** Plan (left, seen from the bush side, so mirrored in x against the built plan, 12 o'clock up) and section A-B (right). The sheet prints NO dimensions: every number is scaled (4.88 px/mm in the scan, plate Ø 85 = 415 px; crop 3x = 14.6 px/mm), good to about 0.3 mm at best. Step 2: the section's thin recess on the inner face and the plan's dashed circle round the fusee bush agree. The section's right is the outer face (built y -22.35 side).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-2-1 | plate thickness (section A-B) | 3.4 mm scaled; likely | topPlate size[2] 3.35 | +0.05 | match |
| 03-2-2 | stand of the bush stack beyond the outer face | 19.4 mm scaled; likely | placements 050801-3 ymin -41.95 against 050901 ymin -22.35: 19.6 | +0.2 | match |
| 03-2-3 | recess on the inner face round the fusee bush | Ø 21.9, about 0.7-0.8 deep scaled; likely | topPlate cones[0] d 20.6->22.0, z 0..0.7 at (16.708,15.292) (a 45-degree countersink) | Ø 22.0 vs 21.9; the cone is a chamfer where the sheet strip looks square | match |
| 03-2-4 | fusee bush 05 08 01-2: flange on the outer face, spigot in the plate | heights not readable better than 0.5 mm; unsure | fuseeBush zl [0,2.6,3.6,4.1,7.0]: spigot Ø 7.9905 z0..2.6, flange Ø 13.1 z2.6..4.1; plate bore cylinders[8.0075 inside] z0.7..3.35 | n/a | can't tell |
| 03-2-5 | dust bush 05 08 01-3 flange diameter | 15.4 mm scaled; unsure | dustBush cylinders[15.0 outside z13..15.1].d 15.0 | +0.4 (scan error 0.3) | match |
| 03-2-6 | cork ring 05 08 01-4 diameter and thickness | 15.8 x 3.6 mm scaled; unsure | corkRing cylinders[16.1 outside].d 16.1, size z 3.7 | -0.3 / -0.1 | match |
| 03-2-7 | WN-301 bush (centre wheel) at the plate centre | at (381,308 px); sure | placements WN-301 origin (0,0,0); bush301 cylinders[4.606 outside] z -22.35..-19 | 0 | match |
| 03-2-8 | WN-300 bush (third arbor) 22.7 mm below the centre | 22.7 mm scaled; likely | placements WN-300.t35 origin (0,0,23), plan (0,-23) | +0.3 | match |
| 03-2-9 | fusee bush centre in plan (mirrored view) | (17.2, 16.0) mm from the centre; likely | placements 050801-2 origin (-16.71,0,-15.29): plan (-16.71,15.29) mirrored | (+0.5,+0.7) | match |
| 03-2-10 | stop pin 05 08 01-5 standing out below (inner face) | label line ends at (405,188 px) = (5.7, 24.5); unsure on the stand | page 050801-5 box y -22.35..-17.15: 1.85 proud of the inner face y -19; placement (-5.68,0,-23.91): plan (-5.68,23.91) | (0.0,+0.6) | match |
| 03-2-11 | stop pin diameter | not readable | page 050801-5 size 1.615 | n/a | can't tell |
| 03-2-12 | screw WN-34 holding the fusee bush (length against thread) | too small to read | fuseeBushScrew WN-34 cylinders[1.3817 outside] z0.16..3.2; bush cylinders[1.55 inside] z2.6..3.6 | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_6 Unruhkloben oben kompl. (U 30) (upper balance cock, complete)

**Title block as read.** Benennung 'Unruhkloben oben kompl.', Zeichnung Nr 127-556.04 U 30, Maßstab 5:1 (1:1 inset), Arbeitspause Nr 10, gez. 1941 (date digits illegible). Werkstoff blank. Parts list: 127 (-118), 128 (-119 pins), 129 (U 27), 130 (U 28), 131 (-120). No general tolerance legible. Sure on title, unsure on the parts-list numbers.

**Views and cross-check.** Section (top, 5:1, 12.2 px/mm, crop 4x = 48.8) and plan (below, crop 2x = 24.4 px/mm). Section: foot 3.2 thick with two pins pointing down, an arm rising to 15 and running right with the jewel setting 129 and cap jewel 130 and two screws 131. Plan: tapered arm, foot holes at left, two dashed pin circles, double dashed arc, a pin hole, the round end R6 with a slit and two setting screws. Plan and section agree on the setting centre and the screw spacing. Orientation: the sheet plan is the built plan turned 180 degrees in the plane (foot at left, slit at top); the hand of the slit and the pin hole agree with that, so no mirroring. Step 2: the '6' on the setting's lower part and '2.2 deg' attach to nothing clear.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-3-1 | total height of the cock (section, 15) | 15; sure | upperCock size z 15.0 | 0 | match |
| 03-3-2 | arm thickness (3.2 at the top) | 3.2; sure | z_levels 11.8 -> 15.0 = 3.2 | 0 | match |
| 03-3-3 | foot thickness (3.2 at the left) | 3.2; sure | z_levels 0 -> 3.2 | 0 | match |
| 03-3-4 | arm underside above the foot underside (11.8) | 11.8; sure | z_levels 11.8 | 0 | match |
| 03-3-5 | top above the chamfer (2.4); chamfer 0.8 | 2.4 and 0.8; likely | z 12.6 -> 15 = 2.4; cones[22.4->24.0, z 11.8..12.6, 45 deg] 0.8 | 0 | match |
| 03-3-6 | steady pins 128 in the foot: 1.3 standing, 1.7 in, 3 total | 1.3 / 1.7 / 3; sure | placements WN-203.uc y -24.05..-21.05 (3.0) against the foot face y -22.35: 1.3 proud, 1.7 in; cylinders[1.5825 inside] z0.2..2.5 (hole deeper than the pin) | 0 | match |
| 03-3-7 | pin holes in the foot (40 from the axis, +-5; third at 24.5) | x=40.2, +-5.0 and x=24.3; likely | cylinders[1.5825]: (39.9998,-5.0001),(40.0002,5.0006),(24.4995,-0.001) | +0.2 / -0.2 | match |
| 03-3-8 | foot hole (large circle at left) | Ø 2.9 at 33.07 mm; likely | cylinders[2.8 inside] at (32.9995,0.0001), z 0..3.2 | +0.1 Ø, 0.07 position | match |
| 03-3-9 | second round hole between foot and setting | Ø 2.7 at 9.53 mm from the axis; likely | cylinders[2.8 inside] at (9.9997,-0.0001), z 12.4..15, arc 335.7 | -0.47 position | mismatch |
| 03-3-10 | slit width at the arm end (1.8) | 1.8 (tolerance mark illegible); sure on the figure | outlines 15.0: lines x +-0.9022 -> 1.8045 | +0.0045 | match |
| 03-3-11 | slit depth from the setting axis (3.4) | 3.4; sure | outlines 15.0 line at y -3.4 | 0 | match |
| 03-3-12 | pin hole above the axis (4.2) | 4.2; sure | outlines 15.0 circles r 0.5376 at (4.1,-4.2): offset 4.2 (hand matches with the 180-degree turn) | 0 | match |
| 03-3-13 | pin hole along the arm from the axis (5) | 5 printed; scaled 5.08; likely (if the right arrow is the slit edge at 0.9, then 4.1+0.9 = 5.0) | circles r 0.5376 at (4.1,-4.2): x 4.1 | -0.9 (to the axis); 0 (to the slit edge) | mismatch |
| 03-3-14 | setting screws 131: 3.5 each side of the axis | 3.5; sure (scaled 3.4) | cylinders[0.9294 inside] at (+-3.525,0), z 11.86..15 | +0.025 | match |
| 03-3-15 | end radius R6 | 6; likely | cylinders[12.0 outside, arc 168] R 6.0; outlines r 6.0 | 0 | match |
| 03-3-16 | radius of the thickened step under the arm (12, to the dashed line) | 12; likely | outlines 11.8: arc r 12.0 at (0,0) | 0 | match |
| 03-3-17 | setting top proud of the arm top by 0.1 | 0.1; likely | placements 050408-2.bu ymin -37.45 against cock ymin -37.35: 0.10 proud | 0 | match |
| 03-3-18 | jewel stack: two halves 1.4 + 1.4 (hatched blocks, split at 1.4 from the top) | 1.4 / 1.4; likely | settingCU size z 1.63, settingBU 1.17: split at 1.63 from the top | +0.23 / -0.23 | mismatch |
| 03-3-19 | 0.5 at the arm underside (the setting body stands 0.5 below the arm; the lower rim is wider) | 0.5 below the arm; unsure | placements 050406-2.bu ymax -34.65 against the arm underside y -34.15: setting is 0.50 INSIDE the arm; cock bore cylinders[4.596 inside] z 11.8..12.3 under it | sign opposite (sheet proud, built recessed) | mismatch |
| 03-3-20 | setting lower rim Ø 6 (the 6; its extension lines on the setting's lower flange) | 6; unsure what it attaches to | settingBU/CU cylinders[5.2 outside]: no Ø 6 flange; cock cones[6.0->7.6 at z 11.8..12.6] is a countersink | not built | not built |
| 03-3-21 | dashed double arc (2.2 deg between) | 2.2 deg; unsure | outlines 12.6: arcs r 11.2 and 12.0; angle not measured | n/a | can't tell |
| 03-3-22 | cock overall length (not dimensioned) | 49 mm scaled; likely | upperCock size 49.0 x 17.0 | about 0 | match |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_10 Zwischenbrücke kompl. 05 08 04 (intermediate bridge, complete)

**Title block as read.** Benennung 'Zwischenbrücke kompl.', Zeichnung Nr 05 08 04, Maßstab 2:1, Werkstoff blank, gez. 21.7.41, gepr. 15.8.41, N gepr. 3.4.43 (day digits unsure). Labels WN-203 (steady pin), WN-300 (bush), 05 08 04-1 (bridge). General tolerance not legible. Sure.

**Views and cross-check.** Section (top) and plan (below), 2:1 at 7.08 px/mm (the bridge's 45.5 mm length = 322 px; crop 4x = 28.3). Section: bridge 3.87 thick, a pin at each end proud of the top face by 1.3, left a counterbore from the bottom and a screw hole, then a hatched bush set 0.7 below the top face with a chamfer, then a lens-shaped jewel setting and another counterbore. Plan: slot-shaped bridge with six holes in a line; plan and section agree on their order (pin, screw hole, bush, setting, screw hole, pin). Step 2: '1.7' has an arrow from below to a ledge line and its other end attaches to nothing clear.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-4-1 | bridge thickness (section) | 3.87 scaled; likely | intermediateBridge size z 3.8 | -0.07 | match |
| 03-4-2 | pin WN-203 proud of the top face (1.3) | 1.3; sure | placements WN-203.zb ymin 2.05 against bridge ymin 3.35: 1.30 | 0 | match |
| 03-4-3 | pin embedded depth (1.7) | 1.7 (attachment unclear); unsure | WN-203.zb ymax 5.05: 1.70 into the bridge | 0 | match |
| 03-4-4 | bush WN-300 seat 0.7 +0.02 below the top face | 0.7 +0.02; likely | placements WN-300.zb ymin 4.06 against bridge ymin 3.35: 0.71 (in tolerance); bridge cylinders[4.3 inside] z 0.69..3.8, cone 4.3->5.7 z 0..0.69 | bush 0.71 in; the bore step 0.69 is 0.01 under 0.70 | mismatch |
| 03-4-5 | centre distance of the two screw holes (plan) | 33.8 scaled; likely | cylinders[2.8 inside] (22.464,-5.251),(-4.315,-26.41): 34.13 | -0.3 | match |
| 03-4-6 | centre distance of the two pins | 40.9 scaled; likely | cylinders[1.5825] (-7.062,-28.58),(25.21,-3.081): 41.13 | -0.2 | match |
| 03-4-7 | centre distance of bush and setting holes | 12.4 scaled; likely | cylinders[4.3] (9.91,-15.17), [5.2] (0,-23): 12.63 | -0.2 | match |
| 03-4-8 | screw hole diameter | 2.5 scaled; unsure | cylinders[2.8 inside] z 0..1.8 | -0.3 | match |
| 03-4-9 | counterbore for the screw head from the bottom | Ø 4.2 x 2.2 deep scaled; unsure | cylinders[4.7 inside] z 1.8..3.8 (2.0 deep) | +0.5 Ø / -0.2 | can't tell |
| 03-4-10 | right-hand jewel setting 05 04: depth in the bridge | 0.2 recess not resolvable | setting35 050504-2 z 3.55..7.15, bridge cylinders[5.2 inside] | n/a | can't tell |
| 03-4-11 | bush bore | not readable | bush300zb cylinders[0.845 inside] | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_12 Federhausbrücke kompl. 05 08 05 (barrel bridge, complete)

**Title block as read.** Benennung 'Federhausbrücke kompl.', Zeichnung Nr 05 08 05, Maßstab 2:1, gez. 21.7.41, gepr. 15.8.41, N gepr. 3.4.43; Werkstoff blank. Labels WN-203 (steady pin), 05 08 05-1 (bridge), WN-22 (click screw), 05 08 05-2 (click). The only printed dimension: 1.3. Sure.

**Views and cross-check.** Plan (left: crescent bridge, three holes, the click with its screw, two dashed pin circles) and the side view (right: a thin bar with the click and screw on its right, pins on its left top and bottom). Calibrated on the bridge's height in plan (489 px = 72.26 mm, 6.77 px/mm; nominal 2:1 would be 7.1); the side view crop 3x = 20.3 px/mm. Pins and click lie on opposite faces. No contradiction between the views.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-5-1 | steady pin standing out (1.3) | 1.3; sure | placements WN-203.bb ymax -21.05 against bridge face y -22.35: 1.30 | 0 | match |
| 03-5-2 | bridge thickness | 3.35 scaled; likely | barrelBridge size z 3.3 | -0.05 | match |
| 03-5-3 | click 05 08 05-2 thickness | 2.7 scaled; unsure | click size z 2.56 | -0.14 | match |
| 03-5-4 | click on the face opposite the pins | yes; sure | pins on the y>-22.35 side, click 050805-2 y -28.21..-25.65 on the other face | 0 | match |
| 03-5-5 | click screw head diameter and height | Ø 4.4-4.7, height 2.1; unsure | clickScrew cylinders[4.5 outside] z 5.81..7.595, total 7.91 | about 0 | match |
| 03-5-6 | barrel arbor hole | Ø 4.2 scaled; unsure | barrelBridge cylinders[3.9 inside] | +0.3 | match |
| 03-5-7 | screw holes at the bridge ends (top and bottom) | Ø 3.4-3.5 scaled (about as big as 0.8 of the barrel hole); likely | barrelBridge cylinders[2.8 inside] at (-17.37,32.668),(-32.043,-18.5) | sheet larger by 0.6 | mismatch |
| 03-5-8 | centre distances: screw hole to barrel hole (upper, lower) | 27.2 and 26.0 mm scaled; likely | (-17.37,32.668)-(-24.784,6.0): 27.68; (-24.784,6.0)-(-32.043,-18.5): 25.55 | -0.5 / +0.45 | match |
| 03-5-9 | click pivot (its screw hole) relative to the barrel hole | (-5.0, 10.9) scaled; likely | cylinders[2.1129 inside] (-29.474,17.046) minus (-24.784,6.0) = (-4.69,11.05) | (-0.3,-0.15) | match |
| 03-5-10 | steady pin places relative to the barrel hole | (+1.5,+25.7) and (-7.5,-30.6) scaled; likely | pin holes (-22.924,31.551),(-30.732,-24.01): (1.86,25.55) and (-5.95,-30.0) | up to 1.5 (scan) | match |
| 03-5-11 | click outline length (curved) | about 19 mm along its axis scaled; unsure | click size 17.53 x 6.0 | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_32.1 Unterplatte kompl. (U 36, 23.10.41) (pillar plate, complete; earlier state of the sheet)

**Title block as read.** Benennung 'Unterplatte kompl.', Zeichnung Nr 127-556.04 U 36, Maßstab 2:1, Arbeitspause Nr 24, gez. 23.10.41; parts list 170-178 (127-556.04-142, -148, -149, -150, -151, U 33, U 25, U 26); Werkstoff blank. A faint copy: tolerances and notes mostly illegible. Legible dimensions: 12.3 and 6.8 only.

**Views and cross-check.** The same drawing as 32.2 in a fainter state: plan of the pillar plate with studs 177, the dashed intermediate bridge 178, section A-B, section C-D (bush at the bottom) and section E-F of a slanted pad. The A-B section shows the long stud (12.3), the short stud (6.8) and the intermediate bridge's stack on the near face. The figures agree with 32.2; the detailed items are on 32.2.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-6-1 | long stud 177 length 12.3 (tip to the far plate face) | 12.3; sure | studLong 050200-6 size z 12.3; placements y 0..12.3 against plate y 0..3.35 (flush at y=0) | 0 | match |
| 03-6-2 | short stud: 6.8 proud of the near face | 6.8; likely | studShort 050200-7 size z 10.15; 10.15 - 3.35 = 6.8 | 0 | match |
| 03-6-3 | plate diameter (rim scaled) | 85 (415 px at 4.88 px/mm); likely | pillarPlate size 84.989 | 0 | match |
| 03-6-4 | intermediate bridge lying directly on the near face | yes; likely | placements 050804-1 ymin 3.35 = plate ymax 3.35 | 0 | match |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_32.2 Unterplatte kompl. 05 08 02 (pillar plate, complete; 23.10.41)

**Title block as read.** Benennung 'Unterplatte kompl.', Zeichnung Nr 05 08 02, Maßstab 2:1, gez. 23.10.41, N gepr. 30.4.43 (unsure); Werkstoff blank. Labels: 05 08 02-1 plate, 05 08 02-2 bush ('Futter an dieser Seite eindrücken': press the bush in from this side), WN-302 bush, WN-52. Dimensions: 12.3, 6.8, 0.1 +0.02. Sure.

**Views and cross-check.** Plan (left, mirrored in x against the built plan, 12 o'clock up; Ø 85 = 415 px, 4.88 px/mm; crop of the section 3x = 14.6), section A-B (right), section C-D (bottom left), section E-F. Section A-B: plate 3.4 thick, the bush 05 08 02-2 pressed in at the upper stud which carries the long stud to the left (12.3), the WN-302 bush with a 0.1 recess, a short stud (6.8), the intermediate bridge stack on the left face at the bottom. Plan and section agree on stud places. Step 2: the '0.1' dimension's two arrows are tiny; which face it measures from I read as the right (pressed-in) face, unsure.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-7-1 | long stud: 12.3 from the tip to the far plate face | 12.3; sure | studLong 050200-6 size z 12.3, flush at the y=0 face | 0 | match |
| 03-7-2 | short stud: 6.8 proud | 6.8; sure | studShort 050200-7 total 10.15, plate 3.35: 6.8 | 0 | match |
| 03-7-3 | stud bush 05 08 02-2 full thickness, flush both faces | likely | studBush size z 3.35; placements 050802-2 y 0..3.35 | 0 | match |
| 03-7-4 | bush WN-302 recess 0.1 +0.02 from the plate face | 0.1 +0.02; likely (face unsure) | bush302 box y 0.11..3.35: 0.11 recessed from y=0 | within 0.10..0.12 | match |
| 03-7-5 | plate thickness | 3.4 scaled; likely | pillarPlate size z 3.35 | -0.05 | match |
| 03-7-6 | long stud position in plan (23 above the centre) | (0,+23.2) from (406,162 px); sure | placements 050200-6 origin (0,0,-23): plan (0,+23) | +0.2 | match |
| 03-7-7 | short stud position in plan (mirrored) | (+10.9,-6.1) from (459,305 px); likely | placements 050200-7 origin (-10.91,0,6.3): plan (-10.91,-6.3) mirrored | (0,+0.2) | match |
| 03-7-8 | intermediate bridge stack thickness at the bottom of A-B | 4.1 scaled; likely | intermediateBridge size z 3.8 | +0.3 | match |
| 03-7-9 | plate hole table (holes, sizes) | the sheet gives no hole numbers or sizes | pillarPlate has 40 cylinders (3.506 pillar holes, 4.506/8.6 counterbores) | n/a | can't tell |
| 03-7-10 | section C-D bush stack at the bottom (bushHs etc.) | too small to read heights | bushHs WN-hs cylinders[1.3 inside], 3.35 high | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Sheet 05 08_33 Unruhkloben unten kompl. (U 31) (lower balance cock, complete)

**Title block as read.** Benennung 'Unruhkloben unten kompl.', Zeichnung Nr 127-556.04 U31, Maßstab 5:1 (1:1 inset), Arbeitspause Nr 6, gez. 1941; parts list 133-139 (127-556.04-119, -122, -120, -123, -124; U 26, U 27). Stamp 'KOPIE'. Werkstoff blank; tolerances not legible. Sure on the title.

**Views and cross-check.** Three views: plan (slanted, cut line C-D, view arrow A), Ansicht A (10 high, 19.75 wide: a tall block at left, a thin arm at right carrying two screws, two heads below) and Schnitt C-D (arm with the jewel stack, a screw 139, a cone with 28 deg). Dimensions: 10, 19.75, 1.3 / 1.7 / 3 (pin), 3.3, 1.4, 1.4, 0.5, 0.1, 0.8, 28 deg, 3.5, 2.5, 0.5. Calibrated on 10 mm = 117 px (11.7 px/mm; crop 4x = 47). Step 2: the plan is turned about 22 degrees from the view, so the plan and Ansicht A widths cannot be compared directly.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 03-8-1 | total height (Ansicht A, 10) | 10; sure | lowerCock size z 10.0 | 0 | match |
| 03-8-2 | width in Ansicht A (19.75, from the tall block's left face to the arm end) | 19.75; sure (extension lines clear) | lowerCock size 20.0 x 17.2: foot 20.0 x 8.0, arm out to y -13.2 (17.2 across) | 20.0 -> +0.25; 17.2 -> -2.55; neither within 0.15 | mismatch |
| 03-8-3 | tall block width in the view | 8.0 mm scaled; likely | box y -4..4 = 8.0 (foot) | 0 | match |
| 03-8-4 | arm thickness (3.3 printed in C-D; scaled 3.17) | 3.3; likely | z_levels 6.78 -> 10.0 = 3.22 | -0.08 (fallback +-0.05) | mismatch |
| 03-8-5 | pin in the foot: 1.3 standing, 1.7 in, 3 total | 1.3 / 1.7 / 3; likely | placements WN-203.lc y -20.3..-17.3 (3.0); foot face y -19 -> 1.3 proud; hole cylinders[2.1129 inside] | 0 | match |
| 03-8-6 | jewel halves 1.4 + 1.4 (2.8 stack) | 1.4 / 1.4; likely | settingBL size z 1.53, settingCL 1.19 (2.72 together) | +0.13 / -0.21 | mismatch |
| 03-8-7 | stack 0.5 short of the arm face at one end | 0.5; likely | placements 050406-2.bl ymin -11.72 against arm face y -12.22: 0.50 recessed | 0 | match |
| 03-8-8 | 0.1 stack proud of the arm face at the other end | 0.1; unsure which face | placements 050408-2.bl ymax -9.0 = cock top y -9.0: flush | -0.1 | mismatch |
| 03-8-9 | setting screws: 3.5 spacing, head 2.5 | 2.5 head, 3.5; likely | settingScrewL WN-18 head Ø 2.5; lowerCock cylinders[0.9294] (-5.0003,-11.7494),(-5.0003,-4.6494): +-3.55 | +0.05 | match |
| 03-8-10 | jewel bore through the arm | not dimensioned | lowerCock cylinders[5.206 inside] z 7.28..10, [4.596] z 6.78..7.28 | n/a | can't tell |
| 03-8-11 | cone 28 deg beside the 0.8 | 28 deg, 0.8; unsure what it attaches to | settingBL cones[45 deg 2.4->3.0]; no 28-degree cone found | n/a | can't tell |

**Extras (on the part, not on the sheet).** none named at this reading (the sheets print too little to say).

**After the verdicts.** Not read for this batch: the recipes and the page code were left unread; every verdict stands on the sheet and the measure files. The mismatches are for the verifier to re-test first.

## Summary

Counts: can't tell 15, match 62, mismatch 10, not built 1

Mismatches and not built (one line each):
- 03-3-9 [mismatch]: second round hole between foot and setting; delta -0.47 position
- 03-3-13 [mismatch]: pin hole along the arm from the axis (5); delta -0.9 (to the axis); 0 (to the slit edge)
- 03-3-18 [mismatch]: jewel stack: two halves 1.4 + 1.4 (hatched blocks, split at 1.4 from the top); delta +0.23 / -0.23
- 03-3-19 [mismatch]: 0.5 at the arm underside (the setting body stands 0.5 below the arm; the lower rim is wider); delta sign opposite (sheet proud, built recessed)
- 03-3-20 [not built]: setting lower rim Ø 6 (the 6; its extension lines on the setting's lower flange); delta not built
- 03-4-4 [mismatch]: bush WN-300 seat 0.7 +0.02 below the top face; delta bush 0.71 in; the bore step 0.69 is 0.01 under 0.70
- 03-5-7 [mismatch]: screw holes at the bridge ends (top and bottom); delta sheet larger by 0.6
- 03-8-2 [mismatch]: width in Ansicht A (19.75, from the tall block's left face to the arm end); delta 20.0 -> +0.25; 17.2 -> -2.55; neither within 0.15
- 03-8-4 [mismatch]: arm thickness (3.3 printed in C-D; scaled 3.17); delta -0.08 (fallback +-0.05)
- 03-8-6 [mismatch]: jewel halves 1.4 + 1.4 (2.8 stack); delta +0.13 / -0.21
- 03-8-8 [mismatch]: 0.1 stack proud of the arm face at the other end; delta -0.1

Could not read / can't tell:
- 03-1-4: pillar screw head (slotted circle)
- 03-1-6: inner case diameter (innerer Gehäuse Ø)
- 03-1-7: arbor and wheel centres of the train and escapement in plan
- 03-2-4: fusee bush 05 08 01-2: flange on the outer face, spigot in the plate
- 03-2-11: stop pin diameter
- 03-2-12: screw WN-34 holding the fusee bush (length against thread)
- 03-3-21: dashed double arc (2.2 deg between)
- 03-4-9: counterbore for the screw head from the bottom
- 03-4-10: right-hand jewel setting 05 04: depth in the bridge
- 03-4-11: bush bore
- 03-5-11: click outline length (curved)
- 03-7-9: plate hole table (holes, sizes)
- 03-7-10: section C-D bush stack at the bottom (bushHs etc.)
- 03-8-10: jewel bore through the arm
- 03-8-11: cone 28 deg beside the 0.8

General: sheet 001 was compared only at the plate and pillar-screw level (the arbor circles are too faint at 1024 px); the plate sheets 05 08_2 and 05 08_32 print no hole tables, so their holes are not itemised; 05 08_2 and 05 08_32 have no printed lengths, so those items are scaled to about +-0.3 mm. Items 3-19/3-20 and 8-6..8-8 (the jewel stack of both cocks) rest on small, partly illegible dimension arrows: unsure.
