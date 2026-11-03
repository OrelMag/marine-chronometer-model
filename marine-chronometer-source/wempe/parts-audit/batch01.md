# Batch 1 (the frame plates): reader's verdicts

Reader: blind reading of sheets 05 08_1.a, 05 08_1.b, 05 08_3.a, 05 08_3.b against `TOOLS/r_wpa/measure/{topPlate,pillarPlate,...}.json`. Frame: the built plates are in the sheets' plan: built x = East (O), built y = North (N, sheet up), so `at [x,y]` below is [E,N] from hole 1. Both plates are built with z=3.35 as "oben" (the small hole of A-B on top, the 8.6 recesses on the top plate's z=0 face and the pillar plate's z=3.35 face). Hands checked: the crescent cut, hole 23's tab and the 26/30 M1.2 holes sit on the same sides as on the sheets (hole 11 and 12 east, 49 north-west, 39 south-west, 26's M1.2 at -37 deg).


## Sheet 05 08_1.a: Oberplatte 05 09 01 (top plate), sheet a: hole table, notes, sections J-K and L-M

**Title block as read.** Werkstoff "Messingblech 4 / Sonder-Ms 4-..." (rest cut off); scale 4:1; Gerhard D. Wempe, Abt. Chronometerwerke, Hamburg 1 (Steinstrasse 23); Arbeitspause Nr 24; drawing no. 050901, Oberplatte; gez. 15.6.43, gepr. 15.6.43, Nachgepr. 18.6.43; a revision line "a ... 6.15 zu 4.59 ... 12.7." (a hole changed from 6.15 to 4.59, date partly legible); no surface or general-tolerance note legible; notes: "Rondelle 4 mm x 90 phi, abgedreht 3.5 x 90 phi, koernen u. stanzen, fraesen, abdrehen, kalibrieren, Fertigmass 3.35 x 85 phi h6".

**Views, and step 2.** Views: the left strip of the plan (the right part is hidden by the table), section J-K (the 22 dia recess round hole 10, 45 deg wall, depth about 0.7), section L-M (8.6 recess 0.3 +0.03 at hole 11). The table gives, per numbered hole, coordinates N/S and O/W from hole 1 (N = up, O = east = right, as the plan on sheet b), centre-punch or blank size, drill size and calibre. Check of views: hole 11 and 12 are drawn on the plan at left, the table covers the rest; the coordinates of the table put E on the built +x and N on +y (hole 12 S9.576 E35.739 is built at [35.739,-9.576]), so the built plan frame is the sheet's. Sections: the face "oben" is z=3.35 (A-B on sheet b).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 01-1-1 | plate thickness (note Fertigmass; blank 4 turned 3.5x90) | 3.35 (no tolerance printed; fallback +-0.05) (likely) | topPlate size[2]: 3.35 | 0 | match |
| 01-1-2 | plate outside diameter (note "85 phi h6") | 85 h6 = 84.978..85.000 (likely) | topPlate cylinders[52].d: 84.989 | in limits | match |
| 01-1-3 | hole 1 Minutenrad (N0 E0) | 4.59 +0.012, punch 4.4 (sure) | topPlate cylinders[11]: d 4.596 at [0,0] z[0,3.35] | +0.006 (in 4.59..4.602) | match |
| 01-1-4 | hole 3 Hilfsloch (N37.0 E0) | 3.50 +0.012 (sure) | topPlate cylinders[18]: d 3.506 at [0,37.0] | +0.006 | match |
| 01-1-5 | hole 4 Gegensperrkegel (N36.437 E6.425) | 0.9 drilled, centre-punch only (sure) | topPlate cylinders[51]: d 0.9 at [6.425,36.437] z[0,2.4] | 0 | match |
| 01-1-6 | hole 5 Drahtfeder (N38.507 E10.684) | drill 1.3, M1.7 (sure) | topPlate cylinders[43]: d 1.3211 at [10.684,38.507] through (M1.7 minor 1.32) | 0 (thread by tap size) | match |
| 01-1-7 | hole 6 Stellstift Unruhkl. ob. (N27.821 E3.577) | drill 1.45, calibre 1.6025 (read "1,60 25"; +0.025 or dia 1.6025) (likely) | topPlate cylinders[39],[25]: d 1.6025 z[1.87,3.35] at [3.577,27.821]; 2.5 counterbore cylinders[25] z[0,1.6] | 0 | match |
| 01-1-8 | hole 7 Anschlagstift (N23.911 E5.676) | 1.6 +0.009 (read "16 +0.009") (unsure) | topPlate cylinders[32]: d 1.6045 at [5.676,23.911] through | +0.0045 (in 1.6..1.609) | match |
| 01-1-9 | hole 8 Unruhkl. Schr. oben (N19.765 E0.559) | drill 2.1, M2.6 (sure) | topPlate cylinders[29]: d 2.1129 at [0.559,19.765] through (M2.6 minor) | 0 | match |
| 01-1-10 | hole 9 Stellstift Unruhkl. oben (N11.555 E2.760) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[36],[22]: d 1.6025 z[1.87,3.35] at [2.76,11.555]; 2.5 counterbore z[0,1.6] | 0 | match |
| 01-1-11 | hole 10 Schnecke (N15.292 E16.708) | punch 7.8, calibre 8.0 +0.015 (sure) | topPlate cylinders[5]: d 8.0075 at [16.708,15.292] z[0.7,3.35] | +0.0075 (in 8.0..8.015) | match |
| 01-1-12 | hole 11 Pfeiler (S3.225 E36.858) | punch 4.3, calibre 4.5 +0.012 (sure) | topPlate cylinders[14]: d 4.506 at [36.858,-3.225] z[0.3,3.35] | +0.006 | match |
| 01-1-13 | hole 12 Hilfsloch (S9.576 E35.739) | 3.50 +0.012 (sure) | topPlate cylinders[17]: d 3.506 at [35.739,-9.576] | +0.006 | match |
| 01-1-14 | hole 13 Gangfederkl. Schr. (S16.238 E34.536) | drill 1.8, no calibre (likely) | topPlate cylinders[31]: d 1.8 at [34.536,-16.238] through | 0 | match |
| 01-1-15 | hole 22 Stellstift Unruhkl. unten (S6.018 E3.259) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[34],[27]: d 1.6025 z[0,1.48] at [3.259,-6.018]; 2.5 counterbore z[1.75,3.35] | 0 | match |
| 01-1-16 | hole 23 Unruh (S12.110 E9.10) | punch 10.0 (the plan circle, R5) (sure) | topPlate cylinders[1]: d 10.0 at [9.1,-12.11], arc 282 deg (circle plus tab) | 0 | match |
| 01-1-17 | hole 26 Gangrad (S21.743 E11.783), table | drill 2.3, calibre 2.5 +0.009; but section P-Q (sheet b) draws 5.2 H7 / 4.5 H7 here (unsure) | topPlate cylinders[8],[12]: 5.206 z[0,2.85] and 4.596 z[2.85,3.35] at [11.783,-21.743]; no 2.5 hole | 2.5 not built; see 01-2 rows for the 5.2/4.5 steps | can't tell |
| 01-1-18 | hole 35 Sekundenrad (S23.0 W0.0) | punch 4.4, calibre 4.59 +0.012 (sure) | topPlate cylinders[9]: d 4.596 at [0,-23.0] | +0.006 | match |
| 01-1-19 | hole 36 Unruhkl. Schr. unten (S11.922 W0.502) | drill 2.8 (clearance for M2.6) (sure) | topPlate cylinders[19]: d 2.8 z[0,1.55] at [-0.502,-11.922] | 0 | match |
| 01-1-20 | hole 37 Stellstift Unruhkl. unten (S17.826 W4.263) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[33],[26]: d 1.6025 z[0,1.48] at [-4.263,-17.826]; 2.5 counterbore z[1.75,3.35] | 0 | match |
| 01-1-21 | hole 38 Zwischenrad (S15.170 W9.910) | punch 4.4, calibre 4.59 +0.012 (sure) | topPlate cylinders[10]: d 4.596 at [-9.91,-15.17] | +0.006 | match |
| 01-1-22 | hole 39 Pfeiler (S32.043 W18.50) | punch 4.3, calibre 4.50 +0.012 (sure) | topPlate cylinders[13]: d 4.506 at [-18.5,-32.043] z[0.3,3.35] | +0.006 | match |
| 01-1-23 | hole 40 Hilfsloch (S26.163 W26.163) | 3.50 +0.012 (sure) | topPlate cylinders[16]: d 3.506 at [-26.163,-26.163] | +0.006 | match |
| 01-1-24 | hole 41 Stellstift Federhausbr. (S24.01 W30.732) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[35],[20]: d 1.6025 z[1.87,3.35] at [-30.732,-24.01]; 2.5 counterbore z[0,1.6] | 0 | match |
| 01-1-25 | hole 42 Federhausbr. Schr. (S18.50 W32.043) | drill 2.1, M2.6 (sure) | topPlate cylinders[28]: d 2.1129 at [-32.043,-18.5] | 0 | match |
| 01-1-26 | hole 45 Federhaus (N6.0 W24.784) | punch 4.4; plan note: milled to 42.5 before calibrating (likely) | topPlate cylinders[0]: d 42.5 at [-24.784,6.0], arc 241 deg (crescent cut) | 0 | match |
| 01-1-27 | hole 47 Stellstift Federhausbr. (N31.551 W22.924) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[37],[23]: d 1.6025 z[1.87,3.35] at [-22.924,31.551]; 2.5 counterbore z[0,1.6] | 0 | match |
| 01-1-28 | hole 48 Federhausbr. Schr. (N32.668 W17.370) | drill 2.1, M2.6 (sure) | topPlate cylinders[30]: d 2.1129 at [-17.37,32.668] | 0 | match |
| 01-1-29 | hole 49 Pfeiler (N36.437 W6.425) | punch 4.3, calibre 4.5 +0.012 (sure) | topPlate cylinders[15]: d 4.506 at [-6.425,36.437] z[0.3,3.35] | +0.006 | match |
| 01-1-30 | hole 50 Stellstift Unruhkl. oben (N25.233 W6.083) | drill 1.45, calibre 1.6025 (likely) | topPlate cylinders[38],[24]: d 1.6025 z[1.87,3.35] at [-6.083,25.233]; 2.5 counterbore z[0,1.6] | 0 | match |
| 01-1-31 | hole 51 Zangenschraube (S7.537 E23.386) | drill 1.55, M2 (sure) | topPlate cylinders[41]: d 1.567 at [23.386,-7.537] z[1.325,3.35] (M2 minor), 8.0 pocket below | 0 | match |
| 01-1-32 | hole 52 Winkelhebelschr. (S24.094 E20.836) | drill 1.55, M2 (sure) | topPlate cylinders[40]: d 1.567 at [20.836,-24.094] through | 0 | match |
| 01-1-33 | hole 53 Stift f. Wendelfeder (S37.0 E15.0) | 1.5 H7 (+0.009), punch mark only (sure) | topPlate cylinders[42]: d 1.5045 at [15.0,-37.0] through | +0.0045 | match |
| 01-1-34 | section J-K: 22 dia recess round hole 10, 45 deg wall | 22 dia, 45 deg, depth read "0.7" (likely) | topPlate cones[0]; z_levels 0.7: cone d 20.6..22 z[0,0.7] half angle 45, floor at 0.7 | 0 | match |
| 01-1-35 | section L-M: 8.6 dia recess depth 0.3 +0.03 (hole 11) | 8.6; 0.3 +0.03 (likely) | topPlate cylinders[3],[2],[4]: d 8.6 z[0,0.3] at holes 11, 39, 49 | 0 (0.3 in 0.3..0.33) | match |

**Extras (built, not on the sheet).**

None listed on this sheet.

**After the verdicts.** (Reader has not yet read the recipes; see the final section.)


## Sheet 05 08_1.b: Oberplatte 05 09 01 (top plate), sheet b: plan and sections

**Title block as read.** Same title block as sheet a (the second sheet of drawing 050901, not repeated); fit table H7: 6 +0.012, 1.5 +0.009, 5.2 +0.012.

**Views, and step 2.** Views: the plan with the crescent cut (42.5), holes 1-53, dimension lines 18.12, 12.63, 22.65, 23.0, 10.0, 11.85; sections A-B, C-D, G-H, N-O, P-Q. Findings about the sheet itself: (1) the table gives hole 26 (Gangrad) as drill 2.3 / calibre 2.5 +0.009 but section P-Q draws 5.2 H7 and 4.5 H7 steps at 26 and the table has no 4.5/5.2 for it; (2) the "4,5 H7" of P-Q against "4.59 H7" of the Unterplatte's G-H and the 4.59 table entries; (3) section N-O has no "oben" and its dimension 1.35 -0.05 can be read as the pocket depth or as the floor left; (4) the dashed lines from hole 23's tab to 51 are the channel seen through the plate; (5) the "2.65" and "7 deg" figures attach to nothing clear.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 01-2-1 | plan vs table: every numbered hole of the table is drawn | all 31 table holes found on plan or sheet a (sure) | plan: - | - | match |
| 01-2-2 | hole 4 on plan: plain small circle, no countersink drawn | 0.9 only (likely) | topPlate cones[3],[11]: countersink d 0.9..2.4 and 2.4..4.3 at z[2.4,3.35] on hole 4 | extra 4.3 dia countersink | mismatch |
| 01-2-3 | section A-B (holes 6, 9, 41, 47, 50): 2.5 counterbore depth, narrow hole on top ("oben") | 2.5 dia, 1.6 deep, plate 3.35 (likely) | topPlate cylinders[25],[20]: 2.5 counterbore z[0,1.6], 1.6025 hole z[1.87,3.35] (small hole at oben) | 0 | match |
| 01-2-4 | section C-D (holes 22, 37): wide 2.5 counterbore on top, 1.6 deep | 2.5 dia, 1.6 deep (likely) | topPlate cylinders[26],[27]: 2.5 z[1.75,3.35] | 0 | match |
| 01-2-5 | section G-H hole 36: 6 dia counterbore (H7 table: 6 +0.012), 1.8 deep | 6 +0.012; 1.8 (likely) | topPlate cylinders[7]: d 6.012 z[1.55,3.35] | +0.012 (at the limit); depth 1.8 | match |
| 01-2-6 | hole 26 section P-Q: 5.2 H7 bore (+0.012) | 5.2 +0.012 (sure) | topPlate cylinders[8]: d 5.206 z[0,2.85] | +0.006 | match |
| 01-2-7 | hole 26 section P-Q: upper 4.5 H7 step | 4.5 H7 (+0.012); read "4,5" with no 9 (compare 4.59 H7 on sheet 3.b) (likely) | topPlate cylinders[12]: d 4.596 z[2.85,3.35] | +0.09 (4.5..4.512 drawn) | mismatch |
| 01-2-8 | hole 26 section P-Q: land thickness | 0.5 (likely) | topPlate cylinders[12].z: [2.85,3.35] = 0.5 | 0 | match |
| 01-2-9 | hole 26: two M1.2 holes on the horizontal, 3.5 +-0.05 from centre | M1.2; "3.5 +-0.05" (read "35") (likely) | topPlate cylinders[47],[48]: d 0.9294 at [8.258,-21.743] and [15.308,-21.743] through | 3.525 from centre: +0.025 (in tol.) | match |
| 01-2-10 | hole 26: "11.85" and "7 deg" dimensions | 11.85 (35 to 26 = 11.85); 7 deg attaches to nothing clear (unsure) | -: 11.85 agrees with built centres; 7 deg not measurable | - | can't tell |
| 01-2-11 | hole 10: three M1.4 holes on a 5.2 radius at 120 deg, one at 12 o'clock | M1.4; "5.2 +-0.05" (radius, unsure); 120 deg (likely) | topPlate cylinders[44],[45],[46]: d 1.0753 at (12.2047,12.692),(21.2113,12.692),(16.708,20.492): 5.2 from the 8.0 hole, 120 deg apart, z[0.7,3.35] | 0 | match |
| 01-2-12 | hole 10: dimension "2.65" beside an M1.4 hole (reads "82,65") | 2.65 (dia or R? lines attach to the M1.4 hole) (unsure) | -: nothing built at 2.65 | - | can't tell |
| 01-2-13 | hole 23: R5 circle, tab 2.5 wide ("25") with round end, "50 deg" | R5; tab 2.5 wide; 50 deg from a dashed line toward 51 (unsure) | topPlate cylinders[21]; outlines_by_level 3.35: tab end r1.25 (d 2.5 arc 180) at [15.8314,-15.9638]; tab axis -29.8 deg, 47.5 deg to the line 23-51 | -2.5 deg if the reference line is 23-51 | can't tell |
| 01-2-14 | dimensions 18.12 (1 to 38), 12.63 (35 to 38), 22.65 (1 to 10), 23.0 (1 to 35), 10.0 (23 to 26) | 18.12; 12.63; 22.65; 23.0; 10.0 (likely) | topPlate cylinders[10],[9],[5],[1],[8]: distances between built centres: 18.12, 12.63, 22.65, 23.0, 10.0 | 0 | match |
| 01-2-15 | note "vor dem Kalibrieren auf 42.5 fraesen" (crescent cut round 45) | 42.5 (sure) | topPlate cylinders[0].d: 42.5 | 0 | match |
| 01-2-16 | section N-O: channel from the hole 23 tab to hole 51 (dashed = hidden on plan), "1.35 -0.05" | 1.35 -0.05, sense unclear (ledge left or pocket depth); no "oben" (unsure) | topPlate z_levels 1.325; cylinders[6]; outlines_by_level 0.0/1.325: 8 wide channel (r4 round hole 51) open at z=0, ceiling at z=1.325, 2.025 left above | pocket depth 1.325 would be in 1.30..1.35 (match); ledge left 2.025 would be a mismatch | can't tell |
| 01-2-17 | channel width round hole 51 (r4), length to the tab | not dimensioned (scale 4:1 only) (unsure) | topPlate outlines_by_level 0.0: r4 arc at 51; lines 14.97 and 9.41 long | scaled only | can't tell |
| 01-2-18 | wire stud (wireStud) in hole 5: thread M1.7 | M1.7 (hole drill 1.3) (likely) | wireStud cylinders[2]: thread d 1.6623 z[0.25,3.75] (3.5 long) for a 3.35 plate | -0.038 on 1.7 (page thread convention) | match |
| 01-2-19 | detent block screw (blockScrew, WN-gk): thread | sheet gives M2 (holes 51, 52) and M1.7 (hole 5); which hole this screw enters is not on the sheet (unsure) | blockScrew cylinders[1]: thread d 1.6811 (M1.7), head 3.0 | if hole 51: M1.7 in an M2 hole (1.567 minor) | can't tell |
| 01-2-20 | lower cock screw (lowerCockScrew WN-53) in hole 36: clearance 2.8, counterbore 6.0 | 2.8 clearance, 6 H7 counterbore, 1.8 deep (likely) | lowerCockScrew cylinders[0],[1]: head d 5.8; shank 2.5801 (M2.6) | head 0.21 under 6.012; shank 0.22 under 2.8 | match |
| 01-2-21 | escape wheel upper jewel setting (settingEU) outside in hole 26 bore | 5.2 H7 (+0.012) (likely) | settingEU cylinders[2]: outside d 5.2 z -20.94..-19.0 | -0.006 vs bore 5.206 | match |
| 01-2-22 | escape wheel upper endstone setting (settingCEU) flange in the 4.5 H7 step | 4.5 H7 (read; see the P-Q row) (unsure) | settingCEU cylinders[3]: outside d 4.59 over 0.5 (z -22.35..-21.85) | +0.09 over 4.5; fits the built 4.596 bore | mismatch |
| 01-2-23 | settingCEU 5.2 body in the 5.2 H7 bore | 5.2 H7 (likely) | settingCEU cylinders[2]: outside d 5.2, 0.84 long | -0.006 | match |
| 01-2-24 | escape wheel upper endstone screws (escScrewU) in the two M1.2 holes | M1.2 (likely) | escScrewU cylinders[1]: thread d 1.1823, head 2.6 | -0.018 on 1.2 (thread convention) | match |
| 01-2-25 | page lines 050406-1.eu and 050408-1.eu (upper jewel and endstone, 2.9 dia) | no jewel size on sheets a or b (sure) | page 050406-1.eu.json size 2.9; 050408-1.eu.json size 2.9: 2.9 dia | - | can't tell |

**Extras (built, not on the sheet).**

- 01-2-26: EXTRA top plate: 0.9 hole 4 countersink d 4.3 (and the 0.9..2.4 dimple cone); built topPlate cones[3],[11]: d 0.9..2.4 z[2.4,2.8]; 2.4..4.3 z[2.8,3.35] (sure)

- 01-2-27: EXTRA top plate: two blind 0.925 holes with countersinks 0.925..1.4, z[0,3.11]; built topPlate cylinders[49],[50]: at [30.6081,-19.922] and [38.4639,-12.554] (likely)

- 01-2-28: EXTRA top plate: two r1.0 rounds at the crescent tips; built topPlate cylinders[53],[54]: d 2.0 outside arcs at [-40.2797,-9.9671] and [-31.2609,27.2864] (unsure)

**After the verdicts.** (Reader has not yet read the recipes; see the final section.)


## Sheet 05 08_3.a: Unterplatte 05 08 02-1 (pillar plate), sheet a: hole table, notes, sections E-F and C-D

**Title block as read.** Werkstoff Messingblech 4 / Sonder-Ms ...; scale 4:1; Gerhard D. Wempe, Abt. Chronometerwerke, Hamburg 11, Stubbenhuk 25; drawing no. 05 08 02-1, Unterplatte; gez. 23.4.43 and 28.4.43 (gepr.), 30.4.43 (Nachgepr.), illegible names; notes: "Rondelle 4 mm x 90 phi, abgedreht 3.5 x 90 phi, koernen u. stanzen, fraesen, ka[librieren], fertig 85 phi h6 [ka]librieren, 3.35 +-0.02 stark" (part cut off, with a struck-out line "335 ..." and "3.35 +-0.02"); no surface or general tolerance legible.

**Views, and step 2.** Views: left edge of the plan (11, 12, 14-17, 18), section E-F (8.6 recess 0.3 +0.03 on hole 11), section C-D across the channel (14 dia cradle, 2 dia cross bore at 1.68, length "12 +0.02"), the table with struck numbers 14-17 ("nur wenn Zeigerstellung eingebaut wird") and a struck cell on hole 39. The table rows 56 and 57 are "nur bei Bedarf" (only if needed).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 01-3-1 | plate thickness (note "3.35 +-0.02 stark") | 3.35 +-0.02 (read "335 +-0.02"; end of the note unclear) (likely) | pillarPlate size[2]: 3.35 | 0 | match |
| 01-3-2 | plate outside diameter (note "Fertigmass 85 phi h6") | 85 h6 = 84.978..85.000 (likely) | pillarPlate cylinders[41].d: 84.989 | in limits | match |
| 01-3-3 | hole 1 Minutenrad (N0 E0) | 4.59 +0.012 (sure) | pillarPlate cylinders[10]: d 4.596 at [0,0] | +0.006 | match |
| 01-3-4 | hole 2 Auf u. Ab (N23.0 E0) | 3.50 +0.012 (sure) | pillarPlate cylinders[19]: d 3.506 at [0,23.0] | +0.006 | match |
| 01-3-5 | hole 3 Hilfsloch (N37.0 E0) | 3.50 +0.012 (sure) | pillarPlate cylinders[20]: d 3.506 at [0,37.0] | +0.006 | match |
| 01-3-6 | hole 4 Gegensperrkegel (N36.437 E6.425) | drill 0.9 (sure) | pillarPlate cylinders[40]: d 0.9 at [6.425,36.437] through | 0 | match |
| 01-3-7 | hole 10 Schnecke (N15.292 E16.708) | drill 2.5, calibre 2.70 +-0.009 (likely) | pillarPlate cylinders[22]: d 2.82 at [16.708,15.292] through | +0.12 | mismatch |
| 01-3-8 | hole 11 Pfeiler (S3.225 E36.858) | 4.50 +0.012; section E-F 8.6 recess (sure) | pillarPlate cylinders[13],[4]: d 4.506 z[0,3.05]; 8.6 z[3.05,3.35] at [36.858,-3.225] | +0.006 | match |
| 01-3-9 | hole 12 Hilfsloch (S9.576 E35.739) | 3.50 +0.012 (sure) | pillarPlate cylinders[18]: d 3.506 at [35.739,-9.576] | +0.006 | match |
| 01-3-10 | hole 14 Stellstift Zeigerst. Kl. ob. (S17.229 E36.411; number struck, "nur wenn Zeigerstellung eingebaut wird") | drill 1.45 (unsure) | pillarPlate cylinders[34]: d 1.45 at [36.411,-17.229] through | 0 | match |
| 01-3-11 | hole 15 Stellstift Zeigerst. Kl. unt. (S22.871 E33.211; struck) | drill 1.45 (unsure) | pillarPlate cylinders[33]: d 1.45 at [33.211,-22.871] through | 0 | match |
| 01-3-12 | hole 16 Zeigerstellkl. Schr. unt. (S21.471 E30.789; struck) | drill 2.8 (unsure) | pillarPlate cylinders[23]: d 2.8 at [30.789,-21.471] through | 0 | match |
| 01-3-13 | hole 17 Zeigerstellkl. Schr. ob. (S15.929 E33.989; struck) | drill 2.8 (unsure) | pillarPlate cylinders[24]: d 2.8 at [33.989,-15.929] through | 0 | match |
| 01-3-14 | hole 18 Zeigerstelltrieb (S12.780 E22.136) | 3.50 +0.012 (sure) | pillarPlate cylinders[16]: d 3.506 at [22.136,-12.78] | +0.006 | match |
| 01-3-15 | hole 19 Wechselrad (S6.30 E10.912) | 3.50 +0.012 (sure) | pillarPlate cylinders[17]: d 3.506 at [10.912,-6.3] | +0.006 | match |
| 01-3-16 | hole 23 Unruh (S12.110 E9.10): plan circle "7 phi" | 7 dia (table gives only punch 4.4) (likely) | pillarPlate cylinders[6]: d 7.0 at [9.1,-12.11] through | 0 | match |
| 01-3-17 | hole 26 Gangrad (S21.743 E11.783) | drill 2.3, calibre 2.50 +-0.009 (sure) | pillarPlate cylinders[27]: d 2.5 at [11.783,-21.743] z[0.25,3.35] | 0 | match |
| 01-3-18 | hole 28 Zwischenbr. Schr. (S26.410 E4.315) | drill 2.1, M2.6 (sure) | pillarPlate cylinders[28]: d 2.1129 at [4.315,-26.41] | 0 | match |
| 01-3-19 | hole 29 Stellstift f. Zw. Br. (S28.580 E7.062) | drill 1.45, calibre 1.6025 (likely) | pillarPlate cylinders[32],[26]: d 1.6025 z[0,1.48] at [7.062,-28.58]; 2.5 counterbore z[1.75,3.35] | 0 | match |
| 01-3-20 | hole 30 Ankerrad (S33.730 E5.028), table | drill 2.3, calibre 2.50 +-0.009; section G-H (sheet b) draws 5.2 H7 / 4.59 H7 here (unsure) | pillarPlate cylinders[8],[11]: 5.206 z[0,2.85], 4.596 z[2.85,3.35] at [5.028,-33.73]; no 2.5 hole | 2.5 not built; the sheet table and its section disagree | can't tell |
| 01-3-21 | hole 35 Sekundenrad (S23.0 E0.0) | 6.0 (punch), notch into the 24.5 cut (likely) | pillarPlate cylinders[7]: d 6.0 at [0,-23.0], arc 208 deg | 0 | match |
| 01-3-22 | hole 38 Zwischenrad (S15.170 W9.910): cut milled to 24.5 (note on sheet b) | 24.5 (sure) | pillarPlate cylinders[0]: d 24.5 at [-9.91,-15.17], arc 332.5 deg | 0 | match |
| 01-3-23 | hole 39 Pfeiler (S32.043 W18.50); tolerance cell struck through | 4.50 +0.012; 8.6 recess (likely) | pillarPlate cylinders[12],[3]: d 4.506 z[0,3.05]; 8.6 z[3.05,3.35] at [-18.5,-32.043] | +0.006 | match |
| 01-3-24 | hole 40 Hilfsloch (S26.163 W26.163) | 3.50 +0.012 (sure) | pillarPlate cylinders[15]: d 3.506 at [-26.163,-26.163] | +0.006 | match |
| 01-3-25 | hole 43 Zwischenbr. Schr. (S5.251 W22.464) | drill 2.1, M2.6 (sure) | pillarPlate cylinders[29]: d 2.1129 at [-22.464,-5.251] | 0 | match |
| 01-3-26 | hole 44 Stellstift f. Zw. Br. (S3.081 W25.21) | drill 1.45, calibre 1.6025 (likely) | pillarPlate cylinders[31],[25]: d 1.6025 z[0,1.48] at [-25.21,-3.081]; 2.5 counterbore z[1.75,3.35] | 0 | match |
| 01-3-27 | hole 45 Federhaus (N6.0 W24.784) | drill 2.7, calibre 2.90 +-0.009 (sure) | pillarPlate cylinders[21]: d 2.9 at [-24.784,6.0] through | 0 | match |
| 01-3-28 | hole 49 Pfeiler (N36.437 W6.425) | 4.50 +0.012; 8.6 recess (sure) | pillarPlate cylinders[14],[5]: d 4.506 z[0,3.05]; 8.6 z[3.05,3.35] at [-6.425,36.437] | +0.006 | match |
| 01-3-29 | hole 56 Kontakt Schr. r. (S40.190 E5.000), "nur bei Bedarf" | drill 1.3, M1.7 (sure) | -: no hole at [5.0,-40.19] | - | not built |
| 01-3-30 | hole 57 Kontakt Schr. l. (S38.184 W13.500), "nur bei Bedarf" | drill 1.3, M1.7 (sure) | -: no hole at [-13.5,-38.184] | - | not built |
| 01-3-31 | section E-F: 8.6 recess depth 0.3 +0.03 on hole 11 | 0.3 +0.03 (likely) | pillarPlate cylinders[4].z: [3.05,3.35] | 0 | match |
| 01-3-32 | channel C-D: 14 dia cradle | 14 dia (concave cut) (likely) | pillarPlate cylinders[1],[2]: d 14 axis (-0.866,0.5,0), centre z 5.94, arcs 36 deg | - | match |
| 01-3-33 | channel C-D: cross bore 2 dia at height 1.68 | 2; 1.68 (likely) | pillarPlate cylinders[30]: d 2.0, axis (0.866,-0.5,0) at z 1.68, length 8.49 | 0 | match |
| 01-3-34 | channel C-D: length "12 +0.02" (sign and size of the tolerance unclear) | 12 +0.02 (or +0.2) (unsure) | pillarPlate outlines_by_level 3.35 lines: 12.1 long | +0.1 (outside +0.02, inside +0.2) | can't tell |
| 01-3-35 | dimensions "0.5" (left of 17) and "9.3 -0.1" (below 16) | 0.5; 9.3 -0.1; lines attach to nothing clear (unsure) | -: - | - | can't tell |

**Extras (built, not on the sheet).**

None listed on this sheet.

**After the verdicts.** (Reader has not yet read the recipes; see the final section.)


## Sheet 05 08_3.b: Unterplatte 05 08 02-1 (pillar plate), sheet b: plan and sections

**Title block as read.** Second sheet of drawing 05 08 02-1; no separate title block legible.

**Views, and step 2.** Views: the plan (all holes 1-57 except those of sheet a), the 24.5 cut ("vor dem Kalibrieren auf 24.5 fraesen"), the channel at the right with 6.5, 6.5, 8.3 -? dimensions and section mark C, sections A-B (29, 44) and G-H (30). Findings about the sheet itself: the table gives hole 30 (Ankerrad) 2.5 +-0.009 but G-H draws 5.2 H7 / 4.59 H7 there; G-H has no "oben" mark; the dimension "11.85" appears twice (35-26 and 35-30).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 01-4-1 | plan vs table: holes 1,2,3,4,10,18,19,23,26,28,29,30,35,38,39,40,43,44,45,49,56,57 drawn | 22 numbered holes drawn (11,12,14-17 on sheet a only) (sure) | plan: - | - | match |
| 01-4-2 | hole 30 section G-H: 5.2 H7 bore (+0.012) | 5.2 +0.012, wide bore drawn at the top of the section (likely) | pillarPlate cylinders[8]: d 5.206 z[0,2.85] (open to z=0) | +0.006 | match |
| 01-4-3 | hole 30 section G-H: 4.59 H7 step, land 0.5 -0.05, which face | 4.59 H7; land 0.5 -0.05 at the BOTTOM of the section; no "oben" on this section (A-B is oben-up) (unsure) | pillarPlate cylinders[11]: d 4.596 z[2.85,3.35]: land at z=3.35 (oben); wide bore opens at z=0 | diameter 0; land on the opposite face if G-H is oben-up | mismatch |
| 01-4-4 | hole 30: two M1.2 holes on the horizontal, 3.5 +0.05 (read "35 +0.05") from centre | M1.2, 3.5 (likely) | pillarPlate cylinders[36],[37]: d 0.9294 at [1.503,-33.73] and [8.553,-33.73] through | 3.525: +0.025 | match |
| 01-4-5 | hole 26: two M1.2 holes at 37 deg, 3.5 from centre, "11.85" | M1.2; 3.5; 37 deg (likely) | pillarPlate cylinders[38],[39]: d 0.9294 at (8.968,-19.622),(14.598,-23.864): 3.525 from [11.783,-21.743], direction -37.0 deg | +0.025; 0 deg | match |
| 01-4-6 | hole 26: no recess drawn on the plan or in a section | 2.5 only (likely) | pillarPlate cylinders[9]: d 4.6 z[0,0.25] at [11.783,-21.743] | extra 4.6 dia x 0.25 recess | mismatch |
| 01-4-7 | section A-B (holes 29, 44): 2.5 counterbore 1.6 deep, oben, plate 3.35 | 2.5; 1.6; 3.35 (sure) | pillarPlate cylinders[26],[25]: 2.5 z[1.75,3.35] on top; 1.6025 below | 0 | match |
| 01-4-8 | dimensions 23.0 (1 to 2), 18.12, 12.63, 22.65, 11.85 (35 to 26 and 35 to 30), 10.0 (23 to 26) | as listed (likely) | pillarPlate cylinders[19],[0],[7],[22],[27],[8],[6]: from built centres: 23.0, 18.12, 12.63, 22.65, 11.85 (both), 10.0 | 0 | match |
| 01-4-9 | slot beside hole 18: width 6.5 (two "6.5" dims) | 6.5 (likely) | pillarPlate outlines_by_level 0.0 and 3.35 lines: 6.5 across at both levels (6.5 square at z=0, 12.1 x 6.5 at z=3.35) | 0 | match |
| 01-4-10 | slot: "8.3 -0.?" dimension (tolerance cut by the scan edge) | 8.3 -? (unsure) | -: - | - | can't tell |
| 01-4-11 | hole 4 on plan: plain 0.9 circle | 0.9 (likely) | pillarPlate cylinders[40]: d 0.9, no cone | 0 | match |
| 01-4-12 | hole 18 bush (bushHs, WN-hs) in hole 18; the bush is not drawn on this sheet | hole 3.50 +0.012 (likely) | bushHs cylinders[1] (outside): OD 3.516 against hole 3.506; length 3.35 = plate; bore 1.3 | +0.010 interference (press fit) | match |
| 01-4-13 | escape wheel lower jewel bush (settingEL) outside in hole 26 (2.50 +-0.009) | 2.50 +-0.009 (likely) | settingEL cylinders[2]: outside d 2.5 z 0.84..1.83 | 0 | match |
| 01-4-14 | escape wheel lower endstone setting (settingCEL): 2.5 body and 4.6 flange | 2.5 hole; the 4.6 recess for the flange is not drawn (likely) | settingCEL cylinders[2],[3]: body 2.5; flange 4.6 x 0.25 | flange sits in the undrawn 4.6 recess | can't tell |
| 01-4-15 | escape wheel lower endstone screws (escScrewL) in two M1.2 holes of hole 26 | M1.2 (likely) | escScrewL cylinders[1]: thread d 1.1823 | -0.018 (thread convention) | match |
| 01-4-16 | page lines 050406-1.el and 050408-1.el (lower jewel 1.6 dia, endstone 2.2 dia) | no jewel size on sheets 3.a or 3.b (sure) | page 050406-1.el.json size 1.6; 050408-1.el.json size 2.2: 1.6; 2.2 | - | can't tell |

**Extras (built, not on the sheet).**

- 01-4-17: EXTRA pillar plate: 4.6 dia x 0.25 recess at hole 26 (for the endstone setting flange); built pillarPlate cylinders[9]: d 4.6 z[0,0.25] at [11.783,-21.743] (likely)

- 01-4-18: EXTRA pillar plate: 1.0 dia notch (r0.5) at the rim, 6 o'clock; built pillarPlate cylinders[35]: d 1.0 at [0,-42.4945], arc 179 deg, through (likely)

**After the verdicts.** (Reader has not yet read the recipes; see the final section.)


## Summary

Counts by verdict (items incl. extras): can't tell 14, extra 5, match 89, mismatch 6, not built 2.

**Mismatches and not built.**

- 01-2-2 (mismatch): hole 4 on plan: plain small circle, no countersink drawn -- drawn 0.9 only; built topPlate cones[3],[11]: countersink d 0.9..2.4 and 2.4..4.3 at z[2.4,3.35] on hole 4; delta extra 4.3 dia countersink.

- 01-2-7 (mismatch): hole 26 section P-Q: upper 4.5 H7 step -- drawn 4.5 H7 (+0.012); read "4,5" with no 9 (compare 4.59 H7 on sheet 3.b); built topPlate cylinders[12]: d 4.596 z[2.85,3.35]; delta +0.09 (4.5..4.512 drawn).

- 01-2-22 (mismatch): escape wheel upper endstone setting (settingCEU) flange in the 4.5 H7 step -- drawn 4.5 H7 (read; see the P-Q row); built settingCEU cylinders[3]: outside d 4.59 over 0.5 (z -22.35..-21.85); delta +0.09 over 4.5; fits the built 4.596 bore.

- 01-3-7 (mismatch): hole 10 Schnecke (N15.292 E16.708) -- drawn drill 2.5, calibre 2.70 +-0.009; built pillarPlate cylinders[22]: d 2.82 at [16.708,15.292] through; delta +0.12.

- 01-3-29 (not built): hole 56 Kontakt Schr. r. (S40.190 E5.000), "nur bei Bedarf" -- drawn drill 1.3, M1.7; built -: no hole at [5.0,-40.19]; delta -.

- 01-3-30 (not built): hole 57 Kontakt Schr. l. (S38.184 W13.500), "nur bei Bedarf" -- drawn drill 1.3, M1.7; built -: no hole at [-13.5,-38.184]; delta -.

- 01-4-3 (mismatch): hole 30 section G-H: 4.59 H7 step, land 0.5 -0.05, which face -- drawn 4.59 H7; land 0.5 -0.05 at the BOTTOM of the section; no "oben" on this section (A-B is oben-up); built pillarPlate cylinders[11]: d 4.596 z[2.85,3.35]: land at z=3.35 (oben); wide bore opens at z=0; delta diameter 0; land on the opposite face if G-H is oben-up.

- 01-4-6 (mismatch): hole 26: no recess drawn on the plan or in a section -- drawn 2.5 only; built pillarPlate cylinders[9]: d 4.6 z[0,0.25] at [11.783,-21.743]; delta extra 4.6 dia x 0.25 recess.

**Could not read or settle (can't tell).**

- 01-1-17: hole 26 Gangrad (S21.743 E11.783), table

- 01-2-10: hole 26: "11.85" and "7 deg" dimensions

- 01-2-12: hole 10: dimension "2.65" beside an M1.4 hole (reads "82,65")

- 01-2-13: hole 23: R5 circle, tab 2.5 wide ("25") with round end, "50 deg"

- 01-2-16: section N-O: channel from the hole 23 tab to hole 51 (dashed = hidden on plan), "1.35 -0.05"

- 01-2-17: channel width round hole 51 (r4), length to the tab

- 01-2-19: detent block screw (blockScrew, WN-gk): thread

- 01-2-25: page lines 050406-1.eu and 050408-1.eu (upper jewel and endstone, 2.9 dia)

- 01-3-20: hole 30 Ankerrad (S33.730 E5.028), table

- 01-3-34: channel C-D: length "12 +0.02" (sign and size of the tolerance unclear)

- 01-3-35: dimensions "0.5" (left of 17) and "9.3 -0.1" (below 16)

- 01-4-10: slot: "8.3 -0.?" dimension (tolerance cut by the scan edge)

- 01-4-14: escape wheel lower endstone setting (settingCEL): 2.5 body and 4.6 flange

- 01-4-16: page lines 050406-1.el and 050408-1.el (lower jewel 1.6 dia, endstone 2.2 dia)


**Also illegible:** the end of the Werkstoff line (Sonder-Ms ...), the surface and general-tolerance notes (none found), the slot tolerance 8.3 -?, the sign of 12 +0.02/+0.2, 1.6 against 1.5 on hole 7, whether hole 4 of the plate row is "0.9" with a countersink (not drawn).

## After the verdicts

Read afterwards, in `TOOLS/recipes/wempe.py` (no verdict changed; for the verifier).

- 01-2 hole 26 P-Q 4.5 vs built 4.596 (and settingCEU 4.59): the recipe builds hole 26 at 4.596 with the note "H7 (revision a)" and takes `rJ` for the 4.59 settings. The sheet's revision line (a, "6.15 zu 4.59") suggests the 4.59 is the revised size and the P-Q figure "4,5" may be the older dimension left on the section; I could not confirm that from the sheet alone, so the mismatch stands.
- 01-3 hole 10 (pillar plate): the recipe states the table says 2.70 +-0.009 and the plate is "opened to the pivot 2.8 + 0.02 (README, Unresolved)", so the 2.82 is a deliberate departure from the table, as I read it.
- Holes 14-18 and the window are struck on the table; the recipe builds them as on Wempe 3955's plate ("made, as the model has them"). I marked them match (position and size) with certainty unsure.
- Holes 56 and 57 ("nur bei Bedarf"): not built; the recipe has no hole for them.
- Not read: the recipes for the settings, screws and jewels were not opened, so the 4.6 x 0.25 recess, the 1.0 rim notch, the two 0.925 blind holes and the hole-4 countersink are unexplained here.
