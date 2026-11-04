# Batch 11 verification (the maintaining ratchet, click spring and clicks; the band and its hooks; the chain)

Verifier: read only the sheets, `r_wpa/measure/*.json|png`, `r_wpa/page/*.json|png`, `placements.json`, the brief and `batch11.items.tsv`. Crops are in `E:/mc-video/wpa-audit/crops/` (outside the repository).

How I read: every priority item (each mismatch, tooth count and form, angles, the springs, the chain pin, the hand) was re-read on an enlarged crop (4-6x Lanczos) of the sheet; the simple outline sizes of sheet 14 and the hooks were checked at 2x and sampled, the rest are marked "accepted, not re-read". Hand was judged as assembled: the measure frame's +Z is the page's +Y (z_m = y_p, y_m = -z_p, a proper rotation, checked on the radial holes and the spring's two pin gaps), so the +Z plan is the dial-side plan with 12 o'clock up. The sheets 11 and 12 plans are the hub (-Z) side, since sheet 12's section stands above its plan with the wall rising toward the plan (first-angle). The built ratchet is therefore a mirror of the sheet's plan only because the sheet is seen from the other face; no part is built mirrored.

Band and hooks: the version as last revised drives the fusee with the chain, so 050703-1/-2/-3 have no entry in `placements.json`. Their hand is judged against sheet 05 07_11 only, from each hook's own part file, and is "can't tell" as assembled.

## Sheet 05 06_11, Gegensperrrad kompl. (assembly)

| id | reader's verdict | my reading of the sheet (certainty) | the built value | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-1-1 | match | Pivots (screw WN-21 holes) at 3 and 9 o'clock on the horizontal; dimension 19.5 on sheet 12 (sure) | maintRatchet.cylinders[2],[3] at (-9.7625,0),(9.7625,0), placed click origin at ratchet-local (+9.763,0) | match | yes | re-read |
| 11-1-2 | match | 60 deg between the pivot line and the pin line, arrow at upper left (sure) | 60.0 | match | yes | re-read; I measured 59.5 on the enlarged sheet 12 |
| 11-1-3 | match | four pin ends: two at upper left, two diametrally opposite at lower right (sure) | four hole ends | match | yes | the lower-right pair is visible in sheet 11 |
| 11-1-4 | match | spring ends sit on the pins (likely) | gaps at x 5.90, 8.78 on the pins' axes | match | yes | accepted, not re-read |
| 11-1-5 | match | Left click: pointed tip at upper left, broad 85 deg end lower right; right click the 180 deg turn of it (tip lower right) (likely) | click local +x tip at 64.3 deg in the +Z plan, tip at r 12.9 at the wall | match | yes | I re-derived it: the click at +x in the +Z plan is at 9 o'clock in the hub-side view; its tip up-right there is up-left, as the sheet's left click. Pointed end = the R0.2 end (sheet 14), by the 85 deg end opposite |
| 11-1-6 | match | head of WN-21 on the flange (outer) face, left of the web in the section (likely) | head on +Z flange face | match | yes | accepted, not re-read |
| 11-1-7 | can't tell | not dimensioned (unsure) | click proud of the wall end by 0.02 | can't tell | yes | nothing on the sheet fixes it |

## Sheet 05 06_12, Gegensperrrad 05 06 02-1 (title block: Messingblech 3,5 DIN 1751 Ms 58 federhart; 2:1; revision a, 11.3.48; Toleranz not printed in the part's body as legible)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-2-1 | match | 37.25 -0.1 (sure) | 37.2 | match | yes | |
| 11-2-2 | match | Z = 120 (sure) | count 120 | match | yes | re-read enlarged |
| 11-2-3 | match | Zahntiefe 0.7 +0.05 (sure) | 0.725 | match | yes | |
| 11-2-4 | match | Sample of teeth at 12 o'clock: each tooth has its steep face on the left (counter-clockwise side) and the ramp falling to the right; tip above its steep face (sure, enlarged) | steep face CW in the +Z plan = CCW seen from the hub | match | yes | the sheet's plan is the hub-side view (above), so the hand agrees |
| 11-2-5 | can't tell | detent not on this sheet | | can't tell | yes | |
| 11-2-6 | can't tell | The "5 deg" dimension sits at the centre between the vertical axis and a line through the teeth sample: the steep face's lean from radial, the root further CCW than the tip (likely) | tip to root 5.6 deg off radial, lean toward the hub-side CCW as drawn | match (likely) | no, I can attach it | the 5.6 against 5 is within the scan's accuracy (a few tenths of a degree at 2:1 cannot be told); the lean direction agrees |
| 11-2-7 | match | 6.5 H7 +0.015 (sure) | 6.5075 | match | yes | |
| 11-2-8 | match | 24.45 +0.1 (sure) | 24.45 | match | yes | |
| 11-2-9 | match | 26.1 / 26.0 overwritten, -0.2 (unsure which) | 26.0 | match | yes | |
| 11-2-10 | match | 0.3 +0.15 x 45 deg (likely) | 0.3 x 45 | match | yes | |
| 11-2-11 | match | 3.1 -0.2 (sure) | 3.1 | match | yes | |
| 11-2-12 | match | 1.02 -0.02 (sure) | 1.02 | match | yes | |
| 11-2-13 | match | 1.3 (sure) | 1.30 | match | yes | |
| 11-2-14 | match | 2.1 from the flange face to the pin axis (likely) | 2.05 | match | yes | inside the 0.05 general tolerance |
| 11-2-15 | match | 0.6 (likely) | 0.6 | match | yes | |
| 11-2-16 | match | 42 and 60 deg from the horizontal pivot line (sure): on the enlarged crop the holes are at 41.5 and 60.5 deg from the centre, both at the same radius | 42.0, 60.0 | match | yes | |
| 11-2-17 | match | upper left, hub-side view (sure) | upper right in +Z plan | match | yes | |
| 11-2-18 | match | 19.5 +0.05 (sure) | 19.525 | match | yes | |
| 11-2-19 | match | 1.2 H8 +0.014 at R14.2, 6 o'clock (sure) | 1.207 at R14.2 | match | yes | |
| 11-2-20 | match | slits across the wall, both sides (likely) | through both walls | match | yes | |

## Sheet 05 06_13, Sperrfeder 05 06 02-2 (Bronzeband 1,5 x 0,4 federhart; 5:1; Toleranz +-0,1 (read, sure); gestreckt 27,0)

The page file has the spring's mesh only (loops, rays); the plan outline I took from `050602-2.png` and its pixels (axes calibrated on the plot's ticks, 39.8 px/mm).

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-3-1 | match | 0.4 -0.01 (sure) | 0.400 | match | yes | |
| 11-3-2 | match | 1.5 -0.1 (sure) | 1.50 | match | yes | |
| 11-3-3 | match | gestreckt 27.0, general +-0.1 (sure) | 26.98 | match | yes | the long arm's drift (11-3-v1) changes the developed length by well under 0.1 only if it is a bend, not a different radius; I did not recompute it |
| 11-3-4 | match | 0.6 +0.02 holes 18 deg apart (sure) | 17.97 | match | yes | |
| 11-3-5 | match | 0.8 -0.05 (sure) | 0.75 from the edge | match | yes | |
| 11-3-6 | match | 0.6 +0.02 (likely) | about 0.6 | match | yes | |
| 11-3-7 | match | 5 and 3.7 (likely) | 5.0 / 1.3 | match | yes | |
| 11-3-8 | match | R12,0 (likely). The arrow from the centre ends on the strip's inner (lower) face (likely, enlarged) | ray at 45: 11.6175 inner, 12.0174 outer | can't tell which face | partly | If the dimension is to the inner face the built is 0.38 small (past the +-0.1). Against that, the strip lies in the ratchet's recess (R12.225): with the inner face at R12.0 the outer would be 12.4, in the wall. So the outer face is the likelier intent; the arrow's end, however, reads inner. Left open |
| 11-3-9 | can't tell | R10,4 (arrow on the inner face, the same way) | ray at 135: 10.1228 / 10.5232 | can't tell | yes | |
| 11-3-10 | match | 110 deg: from the long arm's end to the 60 deg pin line (likely) | about 111 | match | yes | I measured the long end at 7 deg above the horizontal and the pin line at 120 deg on the sheet: 113 |
| 11-3-11 | match | step 1.6 (unsure) | 1.49 | match | yes | within the +-0.1 only with the scan's accuracy, left as a scaled value |
| 11-3-12 | can't tell | 105 deg, 13.6, 5, the 2.2 circles: the circles are the pins that form the kink; the 105 deg arc stands at the kink, the 13.6 is a dimension along the long arm from the right circle's line to the end (unsure) | the page file has no kink points | can't tell | yes | the kink in the built plan bends the strip by about 71 deg in total (included angle about 109 deg) against 105 on the sheet, a scan reading only |
| 11-3-13 | match | hole arm at upper left in the hub-side view (likely) | hole arm at upper right in the +Y plan | match | yes | |

## Sheet 05 06_14, Sperrkegel 05 06 02-3 (Bandstahl 11x2 DIN 1016; 10:1; Toleranz +-0,05; haerten 295 blau anlassen)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-4-1 | match | 10,05 -0,1 (sure) | 10.008 | match | yes | accepted, not re-read (2x) |
| 11-4-2 | match | 1,82 -0,04 (sure) | 1.82 | match | yes | |
| 11-4-3 | match | 2 (sure) | 2.008 | match | yes | |
| 11-4-4 | match | 85 deg (likely) | 85.0 | match | yes | |
| 11-4-5 | match | 5,2 -0,1 (likely) | 5.20 | match | yes | |
| 11-4-6 | match | 5,2 (likely) | 5.19 | match | yes | |
| 11-4-7 | match | 3r with centre 2,78 -0,001 and 3,54 -0,01 (sure, enlarged) | R3.0 at (-2.78, 3.54) | match | yes | |
| 11-4-8 | match | 8r (sure) | R8.0 | match | yes | |
| 11-4-9 | mismatch (boss 3.054) | the outer thin ring round the pivot is "3 diameter" (likely); the heavy ring is the 2.2 | cylinders[3] d 3.0542 is a least-squares fit to a 45 deg arc whose centre floats (-0.009, 0.026) | match | no | The arc's two ends are (-0.4,-1.45) and (0.7532,-1.2972), 1.504 and 1.500 from the pivot (0,0), and its lowest point is y -1.5009: the boss is R1.50 about the pivot, 3.00 across. The 3.054 is the fit's scatter on a 45 deg arc, not a built size |
| 11-4-10 | match | 1,2 H7 +0,009 (sure) | 1.209 | match | yes | |
| 11-4-11 | match | 45 deg countersink to 1,7 (sure) | 1.7 / 44.5 | match | yes | which face (flange or recess side) I did not check on the assembly |
| 11-4-12 | match | countersink to 2,2 (sure) | 2.2 / 49.7 | match | yes | the half angle 49.7 is not printed |
| 11-4-13 | match | as 11-1-5 | | match | yes | |

## Sheet 05 07_11, Schneckenband 05 07 03 (assembly; 5:1; no material)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-5-1 | match | 730 +-3 (sure). It is dimensioned between the round hook's notch-cap line and the drum hook's cap-axis line, i.e. between the slots' blind ends, with the band's ends about 0.3 short of each line | 731.7 (a length worked out from volume / (0.2208 x 0.78)) | match (likely) | yes | the two lines lie within 0.1 of the slots' blind ends (round 3.50 against cap 3.60; drum 4.95 against 4.82), so the band between the blind ends is the same 730; the built length depends on the width taken (0.78, the mesh's) |
| 11-5-2 | match | not printed; slots 0.22 +0.03 (likely) | 0.221 | match | yes | |
| 11-5-3 | can't tell | not printed (sure) | 0.78 | can't tell | yes | |
| 11-5-4 | can't tell | a loop sketched | | can't tell | yes | |
| 11-5-5 | can't tell | "hart gelötet" at both ends (sure) | | can't tell | yes | |
| 11-5-6 | match | three parts (sure) | | match | yes | |

## Sheet 05 07_12, Schneckenhaken rund 05 07 03-2 (Bandstahl 10x0,8 DIN 1016; 10:1; Toleranz +-0,05; 18.3.43)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-6-1 | match | 0,8 -0,05 (sure) | 0.78 | match | yes | |
| 11-6-2 | match | 0,22 +0,03 (sure) | 0.235 | match | yes | |
| 11-6-3 | match | slot depth scaled 3.35 (likely) | 3.38 | match | yes | |
| 11-6-4 | match | 5 deg: the slot leans 5 deg from the vertical tongue edge (sure, enlarged) | 5.0 | match | yes | |
| 11-6-5 | match | tongue edge 2,5 (sure) | 2.50 | match | yes | |
| 11-6-6 | match | 1,25 across and 0,5 along between the lobe and cap centres (sure, enlarged) | (0.5, 1.25) in the tongue-edge frame | match | yes | |
| 11-6-7 | match | 0,4r, 0,4r (sure) | R0.4 both | match | yes | |
| 11-6-8 | mismatch (flank 31.7) | 30 deg between the flank and the vertical (tongue edge), arc at the foot of the flank (sure) | 31.7 | mismatch (formally 1.7 deg) | yes, with a note | The sheet over-dimensions it: the two R0.4 circles with centres 1.25 across and 0.5 along, joined by an internal tangent, give atan(1.25/0.5) - asin(0.8/1.346) = 68.2 - 36.5 = 31.7 deg. The built obeys the dimensioned centres; the printed 30 is a rounded value that disagrees with them by 1.7 deg |
| 11-6-9 | mismatch (R6 centre 1.7, not 2.8) | R6 with centre 3,55 across and 2,8 along from the cap centre (sure of the figures). On the enlarged sheet the dot is at about 1.7 below the cap axis and 3.42 across when 1.25 is the scale (144 px/mm); the 6r dimension line from the dot to the arc measures 5.7 | R5.93 at (3.47 across, 1.70 along) | mismatch | yes | the figure 2.8 does not match the drawn dot (1.7); the built follows the dot. It is also 0.085 short of 3.55 across and 0.07 short of R6, both past +-0.05 |
| 11-6-10 | match | 3.96 x 5.3 scaled (likely) | 4.02 x 5.33 | match | yes | accepted, not re-read |
| 11-6-11 | match | Kante brechen at the slot mouth (likely) | about 0.12 | match | yes | |
| 11-6-12 | can't tell | 1.7 -0.1 beside the 0.4r, 1, (1.5r), 7r (unsure) | | can't tell | yes | |
| 11-6-13 | can't tell | no mirror in plan; as assembled not in placements | | can't tell | yes | |

## Sheet 05 07_13, Bandhaken f. Trommel 05 07 03-3 (Bandstahl 10x0,8 DIN 1016; 10:1; Toleranz +-0,05; 9.6.44 on the list, 18.3.43 on the sheet)

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-7-1 | match | 0,8 -0,05 (sure) | 0.78 | match | yes | |
| 11-7-2 | match | 0,22 +0,03 (sure) | 0.235 | match | yes | |
| 11-7-3 | mismatch (slot 5.3 deg against 10 deg) | the slot leans about 11-12 deg from the vertical (the 10 deg is to the vertical dimension line at the 2.8); the straight wall itself leans about 5 deg from that vertical (sure, enlarged) | 5.3 deg to the built's straight edge | match (likely) | no | The built plan is the sheet's rotated 5 deg. The sheet's cap offsets are 1.0 across and 0.3 along (the "1,0" and "0,3"); the built caps differ by (0.38, 0.97), which rotated by 5 deg are (0.293, 0.999). The tip, 4.485 and -0.366 in the built, rotates to (4.50, 0.03): exactly the sheet's 4.5. The slot at 5.3 + 5 = 10.3 deg to the sheet's vertical is the 10 deg. The straight edge, 5 deg from vertical in the sheet, is the built's x axis |
| 11-7-4 | match | 4,5 from the tip's line to the cap axis (likely) | 4.485 (4.50 in the sheet's frame) | match | yes | |
| 11-7-5 | match | 0,2r tip (sure) | R0.2 | match | yes | |
| 11-7-6 | match | 2,5 (likely) | 2.41 | match | yes | |
| 11-7-7 | match | 8.07 x 3.25 scaled | 8.10 x 3.33 | match | yes | accepted, not re-read |
| 11-7-8 | match | 10r (unsure) | R10.0 | match | yes | |
| 11-7-9 | match | 20r (unsure) | straight, sagitta 0.023 | match | yes | |
| 11-7-10 | match | 4 (likely) | R4.0 | match | yes | |
| 11-7-11 | can't tell | 7r, 2,5, 1,4, 1,0, 0,9, 0,3, 0,35, 1,2, 50 deg (unsure) | | can't tell | partly | 1.0 and 0.3 are the cap offsets used above (match). 0.35 is the dot's drop below the cap axis and 2.8 its distance from the wall (the dot is the R7 corner's centre: 7r with 0.2 at the dot); the 50 deg is the sloped edge to the vertical, built 46.1 deg to its straight edge = 51 deg to the sheet's vertical: match. 1.2, 20r not mapped |
| 11-7-12 | can't tell | mirror in plan between the built and the sheet (likely) | | can't tell | yes | a plan mirror can't be proved from the rotation test above: the cap offsets and tip reproduce with a pure 5 deg rotation, so the built is not a mirror in plan; as assembled not in placements |

## Sheet 05 07_14, Kette 05 07 04 (Bandstahl 5x0,3, 10x0,9, Praez. Rundstahl 0,6; 5:1; Toleranz +-0,05; haerten, 310 anlassen; beweglich vernieten; leicht polieren)

The page file holds one link (three layers) and the two end hooks, and no more: box -24.55..25.48 x, y -18.06..0.4, z -1.43..16.8 in 9 meshes. The 780 mm and the link count are not in it.

| id | reader's verdict | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 11-8-1 | can't tell | 780 +3 (sure) | no length | can't tell | yes | 780 / 2.05 = 380 pitches; the page has one link |
| 11-8-2 | match | 2,05 (sure) | 2.05 | match | yes | |
| 11-8-3 | match | 4,05 (sure) | 4.05 | match | yes | |
| 11-8-4 | match | 2 -0,03 (sure) | 1.978 | match | yes | |
| 11-8-5 | match | 0,82 +-0,02 (sure) | 0.80 | match | yes | at the lower limit (0.80..0.84) |
| 11-8-6 | match | stock 0,3 polished (likely) | 0.26-0.27 | match | yes | |
| 11-8-7 | mismatch (pin 0.54-0.56 against 0.6) | the pin is dimensioned "0,55" beside the pin's two tangent lines on the enlarged chain (sure); 0.6 is the Rundstahl stock only | circles 0.5411-0.5594, polygon sizes of one 0.55 pin (inscribed 0.541 to 0.551) | match | no | The 0.55 was missed: two horizontal lines tangent to a pin, 46 px apart where the 2.05 pitch is 173 px, i.e. 0.55. The built 0.55 (hook-end pin 0.559) is inside +-0.05 |
| 11-8-8 | can't tell | three layers in the side views (likely) | 3 layers | match (likely) | no | the side view shows three strips and the page three layers (-0.4..-0.14, -0.13..0.13, 0.14..0.4) |
| 11-8-9 | can't tell | top hook 3.5 / 5 / 1.8 / 30 deg / 0.4r (sure) | hook extents only (x 16.99..25.48 etc., in the page frame) | can't tell | yes | |
| 11-8-10 | can't tell | lower hook 7.5, 5, 3.5, 50 deg, 20r, 8r, 0.6r, 1.4 -0.1 | | can't tell | yes | |
| 11-8-11 | can't tell | 4-5 links drawn per half | | can't tell | yes | |

## Items the reader missed

| id | sheet | item | my reading | built | verdict |
|---|---|---|---|---|---|
| 11-3-v1 | 05 06_13 | The long arm is one arc about the ratchet axis (the 10,4r, from the kink to its end at 7 deg above the horizontal) | the arm's inner and outer edges are at constant radius to within a pixel over 0 to 70 deg (170.5 and 180.2 px about the centre where the 60 and 110 deg lines meet): concentric (likely) | page 050602-2: the inner radius is 10.02 at 100 deg, 10.18 at 140 deg, 10.54 at 160 deg, 10.82 at 170 deg (outer 10.4 to 11.3): not concentric; the arm runs out 0.8 mm over its last 70 deg. The hole arm is concentric (11.61/12.04 at 30-70 deg) | mismatch (likely); against R10.4 up to about 0.4 mm too large at the free end |
| 11-3-v2 | 05 06_13 | general tolerance +-0.1 (not 0.05) | read (sure) | | note for 11-3-8, -9, -11 |
| 11-5-v1 | 05 07_11 | the 730 is reference to reference at the slots' blind ends | see 11-5-1 | | note |
| 11-6-v1 | 05 07_12 | "1,7 -0,1" by the 0.4r, beside the lobe | I cannot tell which two edges it spans; the nearby edges measure about 1.1 at the sheet's own 144 px/mm | | can't tell |
| 11-7-v1 | 05 07_13 | the cap offsets 1.0 across and 0.3 along, the dot's 0.35, the 2.8 to the dot | as in 11-7-3 | caps reproduce (0.293, 0.999) | match |
| 11-8-v1 | 05 07_14 | the 0.55 | as in 11-8-7 | | match |

## Summary of the disagreements

- 11-4-9 (click boss 3.054): refuted. The arc's ends are 1.500 and 1.504 from the pivot; the boss is R1.50, 3.00 across. The number was a floating-centre fit of a 45 deg arc. Match.
- 11-7-3 (drum hook slot 5.3 against 10 deg): refuted. The built plan is the sheet rotated 5 deg; the cap offsets (1.0, 0.3), the tip's 4.5 and the 10 deg (5.3 + 5) all reproduce through that one rotation. Match, likely.
- 11-8-7 (chain pin 0.54-0.56 against 0.6): refuted. The sheet's pin is dimensioned 0.55; 0.6 is the stock. Match.
- 11-6-8 (round hook flank 31.7 against 30): confirmed as a 1.7 deg difference, but the sheet is over-dimensioned: its own 1.25, 0.5 and 0.4r give 31.7. The built follows the dimensioned centres.
- 11-6-9 (R6 centre 1.7 against 2.8): confirmed; the built follows the drawn dot (1.7, 3.42 across at the sheet's scale). Note also R5.93 against R6 and 3.465 against 3.55 across, both outside +-0.05.
- 11-2-6 (the 5 deg): I attach it to the steep face's lean from radial (built 5.6, same direction); match (likely) rather than can't tell.
- 11-3-8 (R12.0): arrow ends on the inner face; the recess argues for the outer. Left can't tell which face; if inner, built is 0.38 small. 11-3-9 (R10.4) the same.
- 11-8-8 (layers): the three layers match the side view; match (likely).
- Missed, new: 11-3-v1, the click spring's long arm. The sheet has it concentric at R10.4 (inner); the built drifts from 10.0 to 10.8 inner, up to 0.4 mm over the drawn radius at the free end (likely, from the sheet's pixel radii and the page's plot).
- The chain's link count and 780 mm cannot be tried from `050704.json`: it holds one link and the two hooks; the band's 730 is a hook-to-hook reference, same within the tolerance.
- Can't tell, kept: 11-1-7, 11-2-5, 11-3-9, 11-3-12 (105 and 13.6 not decodable; the kink's included angle in the built plan is about 109 deg), 11-5-3 to 11-5-5, 11-6-12, 11-6-13, 11-7-11 (partly resolved), 11-7-12, 11-8-1, 11-8-9 to 11-8-11. The hooks' hand as assembled can't be given: 050703-2 and -3 are not in `placements.json`.
