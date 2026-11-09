# Blind measurement: gimbal ring, bowl height and foot (6MX)

Blind pass: no model file, README, provenance or photocompare spec was opened. Scripts `rf_*.py` in this folder
(grid crop, polar unwrap, frame/sheet extraction, silhouette widths); frames and crops in `E:\mc-video\oq\6mx-case\rf\`.
Ranking: Kirov 14917 (rAw2zmulpk8), Kirov 14100 photos, DG Kirov 2973 photo first; Poljot 17118 (DIxob2Rl4dc) and
Poljot 09777 (Uy8A88_j-cA) as corroboration only; modern 6MX (moMvyx8eXfo) qualitative only.

## Method
* Scale from the dial, not from the thing measured: the two sub-dial centres are 46 mm apart. The vertical pixel distance
  is divided by the dial's foreshortening (minor/major of the sub-dial ring ellipses, 0.83 +-0.02) to give px/mm in the
  dial plane. A tilt about the pivot axis (horizontal in the frames) does not change horizontal chords, so every width
  is read along the row of the pivot axis, where ring and bowl lie at the same depth.
* Validation of that scale: rAw2 29.25 (bezel off, rim visible), rim chord 595 px at 5.43 px/mm = 109.6 mm against
  the given 110.1 (-0.5 %).
* Heights: weak perspective, read at the left/right silhouette extremes of each circle (their row is the circle's
  centre row, at the scale of its own width), divided by cos(elevation) where the elevation comes from the ellipse
  ratio of a circle in the same view.
* Edges read on gridded crops (`rf_grid.py`, 2-7x), silhouette widths by colour segmentation (`rf_sil.py`).

## Readings

### 1. Gimbal ring
| item | source | scale | reading | sure |
|---|---|---|---|---|
| inside diameter (top-face inner edges, chord at pivot row 590) | rAw2 0:01 (Kirov 14917, bezel on) | 5.58 px/mm from sub-dials; chord 743 px; bezel chord 671 px = 120.3 mm (within the given 117-121) | 133.2 | likely |
| inside diameter by ratio to the rim | rAw2 29.25 (bezel off): ring inner left 637, rim outer left 700 at row 620, gap 63 px at 5.43 px/mm = 11.6 mm each side | rim 110.1 | 110.1 + 2 x 11.6 = 133.3 | likely (right side hidden by thumbs, left side doubled) |
| inside diameter, Poljot corroboration | DIxob 428.0 (bowl turned 90 deg in its ring, box upright): ring vertical inner extent about 335 px, body 248 px (103 mm) | 2.41-2.47 px/mm | 136 +-5 | can't tell better (640x480, hands) |
| radial thickness of the band (top face) | rAw2 0:01, left 541-560 and right 1303-1325 at the pivot row | 5.58 | 3.4-3.9, mean 3.7 | likely |
| band height | rAw2 29.25 and 0:01 front/back inner and outer walls (wall 41-43 px high, ring plane tilted 24-28 deg, so wall = h sin 26 deg), modern ring held up 148.0 (wall 40 px of a 450 px ring, tilt 53 deg) | | 15 (range 8-19; the Kirov frames read 17-19 but the front wall there is the pivot pad) | doubtful |

Ring inside diameter best: **133 mm, +-3** (sure to within 130-137).

### 2. Bowl (threaded rim top to foot)
Silhouette widths of DG Kirov 2973 "E-Kontakt4" (side-on, 6 rows of the table in `rf_sil.py`): flange widest chord 1004 px (row 245) =
110.1 mm so 9.11 px/mm; body 931-946 px = 102.2-103.8 mm (constant over rows 305-500); shoulder at the cone's base 968 px (row 590)
= 106.2 mm, then the cone narrows from row 605.

| item | source | reading | sure |
|---|---|---|---|
| body (cylinder) diameter | 2973, widths 931-960 px | 103.2 +-1 | likely |
| shoulder at the cone's base | 2973 row 590, 968 px | 106 +-1 (a 1.5 mm step over the cylinder) | likely |
| rim top face to the shoulder | 2973, extreme rows 130 +-25 (top of thread) to 588 +-8, /9.11 | 50 +-3.5 | likely |
| shoulder to the foot's bottom face | 14100 56956DF5 (bowl bottom up, elevation 33 deg from the lip ellipse 0.53 and the shoulder's front arc): shoulder extreme row 625 +-15, lip extreme row 500 +-8, 8.47 px/mm from the cylinder (872 px = 103 mm), cos 33 deg | 17.4 +-2.5 | likely |
| bowl total, rim top to foot bottom | sum | **67.5 +-5** | likely |
| bowl total, Poljot corroboration | DIxob 428.0: thread top x 292 to foot x 125 = 167 px at 2.44 px/mm | 68 +-5 | can't tell better (the foot is half hidden by a thumb) |
| foot outer diameter (lip ring's outer edge) | 56956DF5 rows 500: lip 348-995 = 647 px, 8.47 px/mm; the groove inside it (362-980) 618 px = 73 mm | **76 +-3** (outer lip); flat disc inside 73 | likely |
| cone | shoulder 106, foot 76 over 17.4: half-angle about 37 deg from the axis | | likely |
| pivot-axis place | DIxob 428.0: ring centre x 279, top pivot stud x 275, thread x 285-300, bezel x 305-330: the axis sits 4-9 mm below the thread top (the 0-3 mm of the brief is inside the +-3 mm of the read) | | can't tell |

### 3. Does the bowl turn over inside the ring?
* Yes, on the real machines: Poljot 09777 (Uy8A88_j-cA 316-327 s: dial up, 90 deg, then bottom up, all inside the ring, in its
  box), Poljot 17118 (DIxob 425-432 s: the same, filmed down the pivot axis), Kirov 14917 (rAw2 12.75-27 s: rocked 60-70 deg
  both ways in the ring; 12.0 s shows the bottom face but with the ring off to one side, so a full turn of the Kirov in its ring
  is not shown by the video).
* Geometry (derived, not read): turning about the pivot axis, every point of the bowl passes through the ring plane, so the whole
  bowl must lie inside a sphere about the ring centre of the ring's inside radius, point by point (a^2 + rho^2 < R^2, a measured
  along the bowl axis from the pivot axis, rho the radius of the bowl at that a). With R = 66.5 and the pivot axis 1.5 below the rim
  top: foot (a 66, rho 38) 76 > 66.5; shoulder (a 48.5, rho 53) 72 > 66.5; bezel side (a about 10.5, rho 60) 61 < 66.5 (room 5).
  So with my figures the bowl would not pass; the videos show that it does. The figures cannot all be right: the sum
  (bowl length) + (ring inside radius) is out of line by about 10 mm. DIxob 428.0 shows the same thing from the other side: at 90 deg
  the foot (x 125) sits at the ring's own leftmost inner edge (x about 120), with the shoulder corner touching the ring's arc.
  Reading: the room is zero to a few mm and the design is a tight squeeze; the stated numbers are at the edge of what a
  turn allows. Resolve it by the ring (136 rather than 133: DIxob read 136) and the pivot axis lower (the DIxob read 4-9 mm
  below the thread top, which also helps) rather than by making the bowl shorter.

## Tied-down results
* Ring inside Ø **133 +-3** (Kirov, two frames agreeing; Poljot read 136), band thickness **3.7 +-0.5**, band height **about 15, doubtful (8-19)**.
* Bowl total height rim top to foot bottom **67.5 +-5**; foot outer Ø **76 +-3** (flat disc inside it 73); body Ø 103.2, shoulder Ø 106.
* Turn-over: physically shown on Poljot machines; for these numbers the room is 0 to about 3 mm and by the sphere rule the figures
  as read are short by up to 10 mm, so the pivot height and ring inside Ø need to be at the generous end of their ranges.
