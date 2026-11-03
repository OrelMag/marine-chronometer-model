# Batch 16 verifier: the winding keys and the box sheets

Sheets re-read on 2x and 3-5x Lanczos crops (kept in E:/mc-video/wpa-audit/crops/, v16_*). Built values from `TOOLS/r_wpa/measure/` and `page/`. Items marked "accepted, not re-read" are simple outline or scaled matches that I did not re-read (more than four in five of the key sheets' were re-read or sampled; the box sheets less so).

## Reading of the revisions (point 1)

- Sheet 9 (05 01 02-3, tube): rev a, "Maß 29 geänd. in 19 +2", dated 29.?.47 (the day struck over), "neu ausgegeben 10.4.47". The latest word on the square's depth is 19 (the "+2" is +0.2 with the comma lost, likely). The drill's tip is dimensioned 23 +0.2 on the same sheet. Drawn lengths along the axis are not to scale with the diameters in the bore (19 is about 73 px/mm, the 5.95 shank 50 px/mm, in a 5x crop), so the bore is drawn schematically after the change.
- Sheet 8 (05 01 02-2, body): rev a, "Bohrung 0,9 war Schlitz 0,9", date 15.7.4? (the last digit reads 8 or 3; unsure), "neu ausgegeben 10.4.47". No other revision.
- Sheet 7 (assembly 510011): no revision entry; dated 16.7.43. Its tube still shows the socket about 29 deep (my scaled apex 28.9), i.e. before sheet 9's rev a. So sheet 7 is the older state for the socket; sheet 9 is the latest.
- Sheet 6 (1940 key): no revision; drawn 12.12.40, checked 18.12.40, N.gepr. 1.6.43.

## Sheet 51 01_6, the 1940 key

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-1-1 | match | 84 printed, arrows paddle top to shank end (sure) | 84.1 | match | yes | |
| 16-1-2 | match | 32 printed, arrows body bottom to shank end (sure) | 32.1 | match | yes | |
| 16-1-3 | match | shank 79 px at 13.5 px/mm = 5.85 (likely); ±0.2 | 6.0 | match | yes | within the scan; reader's 6.06 and mine 5.85 straddle it |
| 16-1-4, 7-17 | match | not re-read except 16-1-14, 16-1-16 (outline widths, sampled, agree within 0.5) | as listed | accepted, not re-read | yes | |
| 16-1-5 | match | socket drawn about 27-30 (apex about 30.7 at 13.5 px/mm) (unsure) | 29.21 / 30.07 | match | yes | undimensioned; scale only |
| 16-1-6 | can't tell | no size on the sheet (sure) | 3.15 AF | can't tell | yes | the 1943 sheet's 3.1 +0.05 is the only AF print; 3.15 is its upper limit. The fusee arbor's winding square (`fuseeArbor.json`, cones d 4.38-4.5 diagonal, taper 0.4 deg, so about 3.10-3.18 AF) takes a 3.15 socket |
| 16-1-18, 16-1-19 | not in this version | parts 4 and 5 drawn (sure) | no page file | not built | yes | |

## Sheet 05 01_7, the 1943 key (assembly 510011, no dimensions, 2:1)

Scale from the sheet's own body 14.5: 14.2-14.3 px/mm on the 2x image (7.1 px/mm on the scan).

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-2-1, 2-3, 6-8, 15, 16, 18 | match | not re-read except 16-2-3 (paddle section 44 px = 3.07, agrees) | as listed | accepted, not re-read | yes | |
| 16-2-4 | match | disc 478 px = 33.5-33.7 (likely, +-0.4) | 34.5 | mismatch, unsure (+0.8 to +1.0) | **no** | outside the scan's accuracy by about 2 sigma; the paddle's own sheet (510011-1) is not in this batch to settle it |
| 16-2-5 | can't tell | agree, pin hole position not resolvable | 13.37 | can't tell | yes | |
| 16-2-9 | match | head top 57 px below the body top = 8.0 (likely) | 8.0 | match | yes | |
| 16-2-10, 11 | match | 8.0, 5.6-5.7 (likely) | 8.0, 5.95 | match (shank 5.95 printed on sheet 9, so the scale 5.7 is the scan's) | yes | |
| 16-2-12 | mismatch | tube end 215 px below the body bottom = 30.3 (likely, +-0.5) | 33.0 | mismatch to the scaled drawing | yes, with a cause | the sheet's drawn tube is 332 px = 46.8 long against its own 50.1 (sheet 9); the printed chain (50.1 long, head top 8.1 below a 25.1 body) gives 50.1 - (25.1 - 8.1) = 33.1, which the model has. So the model follows the dimensioned sheets; sheet 7 is inconsistent with them by about 3 mm |
| 16-2-13 | mismatch | tube end to paddle top 575 px = 81.0 (likely) | 84.7 | mismatch to the scaled drawing | yes, with the same cause (3 mm of it is the tube) | the rest is the paddle's length, which no sheet in this batch prints |
| 16-2-14 | can't tell | socket drawn about 29 (apex 28.9) = the pre-revision state (likely) | 19.0 / 23.0 | match to the latest (sheet 9 rev a); sheet 7 is unrevised | partly | the reader's -9 is a difference from an old drawing, not from the sheet's latest word. Verdict match to rev a |
| 16-2-17 | can't tell | "Linksaufzug b. Rechtsdrehung entspannt sich die Feder" (sure) | helix not in the page file | can't tell | yes | |

## Sheet 05 01_8, key body (2:1, St. Az DIN 668, general tolerance not printed; fallback used where no tolerance is printed)

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-3-1, 2, 5, 6 | match | 25.1 -0.2, 14.5 -0.2, 22 +0.2, 15.1 -0.2 (sure) | 25.1, 14.5, 22.0, 15.1 | match | yes | each at its nominal, inside the printed band |
| 16-3-3 | match (at the limit) | 8 phi +0.1 (sure): 8.0-8.1 | 8.1 | match | yes | upper limit, inside |
| 16-3-4 | match (at the limit) | 6 phi +0.1 (sure): 6.0-6.1 | 6.1 | match | yes | upper limit, inside |
| 16-3-14, 15 | match | 2.5 +0.05, 4 -0.05 (sure) | 2.525, 4.0 | match | yes | |
| 16-3-16 | match (at the limit) | 0.9 +0.1 (sure), band 0.9-1.0 | 0.9 | match | yes | built is the lower limit; inside |
| 16-3-17, 18 | match | 3.8 +0.1, 5 deg (likely) | 3.84, 5.0 | match | yes | |
| 16-3-19 | can't tell | the hole's axis leans toward the key axis going up (the 5 deg line from the bottom point at x +3.8 slopes inward, 5x crop) (likely); the angular place is "beliebig" (sure) | at -y, axis [0, 0.0872, 0.9962] = toward the axis going up | match for the lean; place free | **no** | the lean is readable and the model has it; only the place is free |
| 16-3-7..13 | match | taper 15 deg (measured 14.4-15.3), 120 deg, slot 3 H11, 35 phi concave floor, 6.3 +0.1, 1.5 +0.3: re-read 16-3-9, 10, 11; the slot runs across the page's depth and the cross hole along its width, which the built `cylinders[3,4]` axis [0,1,0] against slot lines at y +-1.515 reproduces | as listed | match | yes | slot / hole orientation checked |

## Sheet 05 01_9, key tube

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-4-1..4 | match | 8 phi -0.05, 2.6 -0.2, 50.1 -0.2, 5.95 -0.05 (sure) | 8.0, 2.6, 50.1, 5.95 | match | yes | 5.95 is the upper limit of 5.90-5.95: inside |
| 16-4-5 | mismatch (form) | "0,3 r" with the arrow at the head-shank corner (likely) | 0.3 x 45 deg chamfer | mismatch, form only (about 0.09 mm) | yes | trivial; a radius is drawn |
| 16-4-6 | match | 3,1 square +0.05 (across flats, sure): 3.10-3.15 | 3.15 AF | match | yes | upper limit; the arbor's square (3.10-3.18 AF, tapered) enters it |
| 16-4-7 | match | 19 +2 (rev a) read as 19 +0.2 (likely) | 19.01 | match | yes | the +2 is likely +0.2 (comma lost, as on 23 +2) |
| 16-4-8 | match | 23 +2 to the tip (likely) | 23.0 | match | yes | |
| 16-4-9 | mismatch | the drill is drawn the same height as the drawn square section, 115 px at 50.4 px/mm = 2.28 (the sheet's own square is drawn 2.28, not 3.1) (unsure) | 2.9 | can't tell | **no** | the bore is not drawn to the sheet's diameter scale (the square drawn 2.28 against its printed 3.1), so a scaled drill is not a measurement. The drill is drawn no wider than the square, which 2.9 is |
| 16-4-10..13 | match | 60 deg, 1 +0.2, 2.5 +0.3, tip end about 4.5 (re-read 10-12) | as listed | match | yes | 2.5 and 1 sit at their lower limits |

## Sheet 51 00_1, box assembly (1:2, no dimensions)

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-5-1 | match | box width 453 px, section | 185 | match | yes | |
| 16-5-2 | can't tell | section A-B box 439 px high by 453 wide = 0.97 x 185 = 179 (likely, +-3) | 180 | match to the scan | **no** | the assembly supports 180, not 185; the 185 on sheet 51 00_2 is the sheet that disagrees (see 16-6-12) |
| 16-5-3, 4 | match | not re-read | | accepted, not re-read | yes | |
| 16-5-6 | mismatch | bracket triangle in the plan about 75 px at 3.2 px/mm = 23 (likely) | 59.5 | mismatch | yes | |
| 16-5-7..11 | match / can't tell | not re-read, except 16-5-11 below | | accepted, not re-read | yes | |
| 16-5-11 (hinge) | can't tell | see sheet 5: hinge leaves 32 long at 100 from the centre | Scharnier (box side) 148 | can't tell | yes | the box hinge on this sheet is not resolved |

## Sheet 51 00_2, handle and panel

| id | reader | my reading (certainty) | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-6-1..11, 13 | match | not re-read except 185, 105, 12.5 | as listed | accepted, not re-read | yes | |
| 16-6-12 | mismatch | the 185 arrows span the whole panel, 872 px, the same as the 185 across (sure); the 105 is printed, the rest 185-105 = 80 | 105 + 75 = 180 | mismatch | yes | the split line scales at 100.8 (not 105): the sheet's drawing is not exact. Sheet 51 00_1's scale gives 179, so the sheets disagree with each other; the model follows the assembly |
| 16-6-14 | can't tell | the oval 70 x 30 drawn as a hidden outline over the handle (likely) | not found | can't tell | yes | |
| 16-6-15, 16 | match | head drawn 58 px / 4.72 = 12.3 with its "12" outside arrows (the 12 is the head diameter, likely); M6 (sure) | 12.0, 5.974 | match | yes | |
| 16-6-17 | mismatch | head top to the pivot tip 135 px = 28.6 (likely: head 4.9 + panel 13.3 + tip 10.4) | 24.0 / 26.3 | mismatch (both screws) | yes | the two built screws also differ from each other by 2.3 mm; the sheet draws one |
| 16-6-18 | can't tell | the "12" is the head diameter (above); "11,5" and "3,5" attach to the split line and handle, unresolved (unsure) | | can't tell | yes | the reader's reading of 12 as an edge distance is probably wrong |

## Sheet 51 00_3 and 51 00_4

| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-7-* | as read | not re-read | | accepted, not re-read | yes | |
| 16-8-10 | not built | the section shows chamfers at the M3.5 hole's mouths and the plan a double ring at it (outer about 4.1 against 2.8-3.5); the "0,5" leader ends on the face between the two holes, so it may go to either (unsure) | no chamfer ring | not built (likely) | yes | and the big hole's drawn ring is about 0.3, built 0.5 (16-8-9 match to a small tolerance) |
| 16-8-13 | can't tell | "2 deg 40'" with its arrow just under the lower edge; both edges slope in the plan (about 2.1 deg top, 1.6 deg bottom by scan, unsure) | 1.46 deg each side | can't tell | yes | the drawn taper may not be symmetric |
| other 16-8-* | match | not re-read except 45, 10, 8, 14, 39 (agree); general tolerance printed "nicht eingetragene Toleranz 0,1" | | match | yes | |

## Sheet 51 00_5, the outer box

| id | reader | my reading | built | mine | agree | why |
|---|---|---|---|---|---|---|
| 16-9-16 | can't tell | the 100 runs from the hinge leaf's outer end to the centre line A, the 32 is each leaf's length; two leaves at |x| 68-100 (sure) | Scharnier.U sections: x -100..-68 and 68..100 | **match** | **no** | the reader's 200 is the box of both leaves, which is what the sheet shows |
| 16-9-17 | can't tell | "4 x 25 Din 97" (sure); DIN 97 is a countersunk wood screw | head d 7 x 2.6, a cylindrical head with a 45 deg edge chamfer, shank 3.977 x 25.0 | mismatch (head form) | **no** | thread and length match; the head is not a countersunk one. Reader had no ground to judge; the DIN number does |
| 16-9-1..15 | match | not re-read | | accepted, not re-read | yes | |
| 16-9-18, 19 | can't tell | agree | | can't tell | yes | |

## Items the reader missed

| id | item | reading | built | verdict |
|---|---|---|---|---|
| 16-2-v1 | cross pin is a "Kerbstift K.S.:1" (a grooved pin) in the 1943 parts list | likely | 510011-6 a plain 2.5 x 15.3 | form mismatch, unsure whether the page shows its grooves |
| 16-9-v1 | strap eye screws 11 (3 x 15 DIN 96, a round head) | sure | none built in this batch | can't tell |
| 16-3-v1 | body revision a "Bohrung 0,9 war Schlitz 0,9" | sure | round hole, built | match |

## Summary of disagreements

1. 16-2-4 (paddle disc 34.5): I read 33.5-33.7, mismatch, unsure.
2. 16-2-12 and 16-2-13 (tube protrusion, overall length): agree as mismatches to the scaled sheet, but sheet 7's tube is drawn 3 mm shorter than its own 50.1 (sheet 9), so the model, built to the dimensioned chain (33.0 and head top 8.0 below the body top), is not at fault.
3. 16-2-14: the socket 19 deep is the latest (sheet 9 rev a); sheet 7 is the older 29, so this is a match, not a difference of 9.
4. 16-3-19: the 5 deg lean is readable (toward the axis going up) and matches; only the place is free.
5. 16-4-9: the drill is not a measurement; can't tell, not a mismatch.
6. 16-5-2: sheet 51 00_1's scale gives about 179 for the box height, which supports 180; 16-6-12's 185 comes from sheet 2 alone, so the two sheets disagree.
7. 16-6-18: the "12" is the head diameter, not an edge distance.
8. 16-9-16: the hinge leaves match (two leaves 32 long, |x| 68-100).
9. 16-9-17: the DIN 97 screw head is not countersunk in the model: a mismatch the reader could not see.
