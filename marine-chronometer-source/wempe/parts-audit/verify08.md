# Batch 8 verification: hairspring, collet and stud

Verifier's file. Inputs: the five sheets (05 03_5 to _9) re-read on enlarged crops (`E:/mc-video/wpa-audit/crops/b8_*.png`), the measurement files (`r_wpa/measure/hsCollet.json`, `hsStud.json`, `r_wpa/page/050302-1.json` and PNG, `placements.json`) and `batch08.items.tsv`. Nothing else was read. Scale on all five sheets: the sheet's printed scale at about 3.45 px/mm of scan (so 5:1 is 17 px/mm, 10:1 is 34.5 px/mm); a scaled size is good to about +-0.1 mm.

Agree = my verdict is the reader's. Items in the classes the brief names (every mismatch, not built, hole, spring, angle, escapement/balance size) were re-read enlarged. Simple outline matches marked "accepted, not re-read" were read at normal size only.

## Sheet 05 03_5 (assembly: Spiralfeder kompl.)

How I read the stack (enlarged 4x): 13.4 runs from the underside of the stud arm to the collet's bottom face. 3.15 runs from the arm underside to a dotted level at the top of the upper terminal-curve end. 9.5 runs from that dotted level to a second dotted level at the bottom of the lower end. 0.75 runs from that level to the collet bottom. So 3.15 + 9.5 + 0.75 = 13.4 exactly: 9.5 is the spring's whole height including both terminal ends, not the helix alone. By scale: 3.07, 9.57, 0.73, 13.36.

The sheet shows 12 coil rows on each side between the two ends (counted on the enlarged crop; row spacing 54 px at 69 px/mm = 0.74 mm).

| id | reader | my reading (certainty) | built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 08-1-1 | match | 13.4, arm underside to collet bottom (sure) | arm inner face -37.35, collet face -24.0: 13.35 | match | yes | accepted; the arrow touches the arm's underside |
| 08-1-2 | mismatch | 3.15, arm underside to the top of the upper strip end (likely) | -37.35 to -34.46: 2.89 | mismatch -0.26 | yes | the same dotted level is where 9.5 starts |
| 08-1-3 | mismatch | 0.75, collet bottom to the lowest strip face (likely) | -24.0 to -24.49: 0.49 | mismatch -0.26 | yes | as above |
| 08-1-4 | mismatch | 9.5 is end to end of the strip incl. both terminal ends (likely) | 9.97 | mismatch +0.47 | yes | but see v1: the pitch cause is firm; the reader's derivation 13.4-3.15-0.75 is also exactly what the sheet's three dimensions say |
| 08-1-5 | match | 5, stud hole axis to the leg's far (square-end) face in plan (likely) | 4.997 | match | yes | the 5 arrows end on the hole's axis and the right face of the dashed leg footprint |
| 08-1-6 | can't tell | "1.4 ϕ" with arrow tips just outside the arm's dashed hole lines; hole 1.5 by scale (unsure) | hole 1.509, screw 1.3817 | can't tell (leans: the M1.4 screw) | yes | the arrows span about 1.6-2.0 by scale, the dashed hole 1.5; the figure fits a screw, not the hole (sheet 9 prints 1.5 H7 for the hole) |
| 08-1-7 | can't tell | hole centre 4.2 across, 4.06 along, radial 5.84 from the bore centre by scale (likely, +-0.1) | (4.1, 4.2), radial 5.87 | match (radial) | no, milder | the radial distance agrees within 0.03; the direction depends on how the plan is turned, not fixed by the sheet's view side |
| 08-1-8 | match | "Windungen links" (sheet 6), left (sure) | y_of_turns: -33.52 (0 deg), -33.72 (90), -34.12 (270); y falls as the angle from x toward -z grows, which is negative rotation about +y (page frame is right-handed: phi from z toward x is positive about +y; psi = phi - 90) | match, left-hand | yes | I rechecked the sense from the numbers |
| 08-1-9 | can't tell | two pins "24": upper pin about 2.7 long, 0.6 high, lower pin about 3.5 long (scaled, unsure) | 4.s 2.69 x 0.26 x 0.68; 4.c 3.61 x 0.26 x 0.73 | match, scaled (unsure) | partly | the lengths agree (2.7 vs 2.69; 3.5 vs 3.61) and the heights (0.6 vs 0.68; the pin is a flat section); the pin's own sheet is missing |

## Sheet 05 03_6 (Spiralfeder 05 03 02-1: raw spring)

Enlarged: the strip is drawn as 16 rows (15 turns), 11.5 high overall, 0.52 strip, gap 0.21. Row spacing 51 px at 69 px/mm = 0.74 mm, so the picture agrees with the printed gap 0.21 (pitch 0.73): 15 x 0.73 + 0.52 = 11.47. My first guess, 15 pitches of 0.78, came from miscounting rows; the 16-row count is right.

| id | reader | my reading (certainty) | built value | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 08-2-1 | match | 0.52 (sure) | 0.5201 | match | yes | accepted |
| 08-2-2 | match | 0.285 (sure) | 0.2849 | match | yes | accepted |
| 08-2-3 | match | 12.8 +-0.05 (sure) | 12.798 | match | yes | accepted |
| 08-2-4 | match | 12.23 (sure; bracket-less, no tolerance, +-0.1) | 12.223-12.228 | match | yes | accepted |
| 08-2-5 | mismatch | pitch 0.73 = 0.52 + 0.21, confirmed by the 16-row picture (0.74) and by sheet 5's 12 rows (0.74) (sure) | 0.8003 | mismatch +0.07 | yes | three independent readings give 0.73-0.74, none 0.80 |
| 08-2-6 | can't tell | 15 turns, 11.5 (raw) | 12 turns crossed, 9.97 | match on the assembled turn count: sheet 5 draws 12 coil rows, built 12 | no, partly | the raw 15 is the blank (603 mm long), but 13 turns less 3.5 mm (sheet 7) = 12 helix + the curve; built has 12 crossed |
| 08-2-7 | match | left (sure) | left | match | yes | |

Cause of the height mismatch (a finding the reader's table does not carry): built pitch 0.80 against 0.73-0.74 drawn. At the ends the strip stands 0.24-0.26 beyond the drawn top and bottom each, which is exactly the reader's 3.15/0.75 offsets (-0.26, -0.26). Correcting the pitch to 0.73 gives 9.97 - 0.07 x 11 = 9.2 for the helix part alone, so the terminal ends add 0.3 (the page's lower end is a curve that drops 0.68 under the last coil). Whether the 9.5 is then met depends on the curve's rise at each end; the sheets do not decide it.

## Sheet 05 03_7 (Spiralkurve)

What the sheet is (enlarged read): one curve table, angle labels 0 (bottom), 30, 60, 90 (left), 150, 180 (top), 210, 220 (Ansteckungspunkt, circled), 240, 270 (right): angle runs clockwise as drawn. Black radii along the curve: 6.4, 6.12, 6.07, 6.01, 5.96, 5.90, 5.83, 5.78, 5.74, 5.72, 5.65 (this one at the 90 deg ray), 5.59, 5.49, 5.34, 5.19, 5.01, 4.79, 4.54, 4.31, 4.11, 3.88, 3.69, 3.52, 3.41, 3.37, 3.37, 3.37. Grey faint numbers are a second set outside the curve (station labels, not read). The ray spacing looks like 7.5 deg, so the black labels are not on 5/10 deg steps: the angle of each radius is not printed. The pin (black blob) lies about 225 deg; the curve runs on to about 260 deg.

| id | reader | my reading (certainty) | built value | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 08-3-1 | match | 6.40 at 0 deg = 12.8/2 (sure) | 6.399 | match | yes | |
| 08-3-2 | match | "vorm Biegen der Kurve auf 13 Umgaenge - 3.5 mm kuerzen" (likely) | 507.2 mm from volume/section | match | yes | 13 x pi x 12.515 - 3.5 = 507.6; the built length of the strip is 507.2 (0.1 %) |
| 08-3-3 | can't tell | see "What can be concluded" below | | can't tell | yes | |
| 08-3-4 | can't tell | end radius 3.37 (last three labels equal: the end is a circle arc) | page: inner edge 3.29-3.39, centre about 3.5 at the pin | match on the end radius (likely) | partly | I read the page's ray scan at 15 deg steps from its PNG, see below |
| 08-3-5 | can't tell | one table on the sheet (sure) | page has two curves, one at each end | can't tell | yes | sheet 5's plan shows two Ansteckungspunkte, one at the stud end and one at the collet end, so the page's two curves are one profile used both ways; the page's B curve is the reverse of A (outward ccw from the pin) |

Page's terminal curve, read from `050302-1.png` (plan) by scanning rays every 15 deg from the axis (+-0.05 mm, screen angle ccw from +x with z down): the curve A (stud end, lower strip level, x from -3.67 to 6.10, z from -5.30 to 6.40) has inner-edge radius 5.93 (345 deg), 5.80 (0), 5.74 (15), 5.68 (30), 5.60 (45), 5.42 (60), 5.19 (75), 4.90 (90), 4.55 (105), 4.21 (120), about 3.5-3.78 (135), 3.39 (150), 3.29 (165, at the pin); the strip is 0.285 thick so the centre line is 0.14 outside. Its curve leaves the helix circle between 315 and 345 deg. B (collet end, x from -4.2): inner radius 3.87 (180), 4.12 (195), 4.42 (210), 5.08 (225), 5.09 (240), 5.32 (255), 5.53 (270), 5.64 (285), 5.99 (300), the reverse of A.

What can be concluded (item 4 of the brief):

1. The angle origin cannot be fixed from the sheet. The sheet's 0 deg is the ray where the curve touches the outer circle (6.40), but the helix is a circle, so the point where the page's curve leaves it is not marked on the page beyond +-15 deg (the curve merges with the helix between 315 and 345 deg). The sheet's labels are not on a regular angular step, and the stud's place relative to the angles is not given (the pin sits at 220-225 deg).
2. The end radius agrees: 3.37 (sheet) against 3.3-3.5 (page), the two curves ending at the same r about 3.5 at the pins (the collet's hole centre 3.49 from the bore axis and the stud's leg at about 3.5).
3. The first 90 deg agree if the page's curve starts at about 320 deg: sheet 5.65 against page 5.6-5.7 (inner edge 5.60 at 45 deg after 320; centre 5.74). Later they part: 135-180 deg after the start the page is at 3.5-4.2 where the sheet has 4.5-5.0 (the sheet's 4.54 at about 170 deg). A 15-30 deg shift in the start explains most of this, because the sheet's curve is flat near its end (3.37 three times) and steep before, but the page's curve covers its 6.1 to 3.4 in about 190 deg, the sheet's 6.40 to 3.37 in 225-260 deg. So the page's terminal curve is shorter in angle by about 30-60 deg and falls faster in the middle. I put this as "likely differs", not as a mismatch, since the origin is open to +-15 deg and the page's strip edge versus the sheet's centre or edge radius is not stated.
4. Hand: the sheet's angle runs clockwise as drawn; the page's curve A runs inward counter-clockwise as seen from +y. A is the correct continuation of the page's left-hand helix at the lower end (the strip travels toward y falling, which is ccw). So the sheet is drawn from the other side, or its angles are marked the other way; the sheet's view side is not fixed (hand: can't tell). It does not contradict.
5. A useful next measurement, which needs the page's exact mesh (not in this batch's files): sample A's centre line in polar form and fit against the 27 radii with an unknown origin and step.

## Sheet 05 03_8 (Spiralrolle 05 03 02-2: collet)

Re-read (enlarged 4x of the plan, 4x of the side view):
- Printed: outer 9.1 phi -0.2; height 3.3; widths 3.8 -0.2 (wide, slit end) and 2.7 -0.2; slit 0.2 +0.1 wide, its end 0.1 +0.05 from the bore; bore 1.6 phi H7 +0.009 (top, with the hole's 0.75 +-0.05 from the same face), (1.55 phi) bracketed at the bottom, Kegel 1:70; cross hole 0.8 phi +0.01 at the entry, (0.77 phi) at the other end, Kegel 1:90, "0.7 bohren", "Koerner anbringen"; 3.5 -0.02 from the bore axis to the cross hole; 90 deg between the top edge and the hole's dashed line.
- What 3.5 attaches to: left arrow on the bore's centre line, right extension on the cross hole's centre line (the thin line that runs between its two dashed sides). I measured the circle 1.6 as 225 px in the 4x crop (140 px/mm): centre line to centre line 488 px = 3.47 at the height of the plan's centre line, 3.36-3.4 at the top of the sheet (the centre lines are tilted 3.5 deg, not parallel by the scan).
- The cross hole's axis in the sheet is perpendicular to the tapered side edge (the 90 deg mark), so it is tilted 3.5 deg from the perpendicular to the collet's long axis.
- Direction of the bore taper: the 1.6 phi end is the face which the cross hole is 0.75 from (the top face of the side view; its wide dimension lines 595 and 815, the 1.55's lines 600 and 800).

| id | reader | my reading (certainty) | built value | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 08-4-1 | match | 9.1 -0.2: 8.9-9.1 (sure) | 9.0 | match | yes | |
| 08-4-2 | match | 3.3 (sure) | 3.3 | match | yes | |
| 08-4-3 | match | 3.8 -0.2 (sure) | 3.70 | match | yes | |
| 08-4-4 | match | 2.7 -0.2 (sure) | 2.60 | match | yes | |
| 08-4-5 | match | 1.6 H7 is the end at the cross hole's face (sure, re-read) | at z=0 d 1.6029; at z=3.3 d 1.65. The cross hole is at z=2.55, 0.75 below z=3.3 | mismatch: at the hole's face (z=3.3) built is 1.65, sheet 1.6 H7 (+0.05, 0.04 over the H7 limit) | no | the reader matched 1.6029 at z=0 to 1.6 H7, but z=0 is the face away from the cross hole: that end is the sheet's 1.55 end. The taper runs the right way (large end at the hole's face) but the whole bore is 0.05 too large |
| 08-4-6 | match | 1:70 (sure) | half angle 0.4 deg (1:71.6; the exact bore 1.6029 to 1.65 over 3.3 is 1:70.2) | match | yes | |
| 08-4-7 | mismatch +0.10 | (1.55) at the face away from the hole (likely) | z=0 d 1.6029 | mismatch +0.05, not +0.10 | partly | the reader took 1.65 (z=3.3) against 1.55; the 1.55 is at z=0, where the built bore is 1.6029. Mismatch stands at +0.05 (a bracketed reference size) |
| 08-4-8 | match | 0.2 +0.1 (sure) | 0.25 | match | yes | |
| 08-4-9 | match | 0.1 +0.05 (likely; the sheet's 0.1 is to the bore edge at its 1.6 face) | 0.126 at z=3.3 (the 1.6 face); 0.149 at z=0 | match | yes | inside 0.10-0.15 at both faces |
| 08-4-10 | mismatch (3.578 against 3.5 -0.02) | 3.5 -0.02, centre line to centre line (likely) | the hole's centre at y=0 is at x 3.49: the section through the axis plane (the PNG, right) shows the hole's circle spanning x 3.09-3.88 (centre 3.49, d 0.79); `cones[0].at [3.5781, 1.3477]` is the entry point of the axis on the tapered side edge, not the crossing with the axis (3.49 + 1.3477 x tan 3.5 deg = 3.572, which is the field) | match, 3.49 (inside 3.48-3.50) | no, refuted | the reader used the entry point; the plan in the PNG shows the hole's edge line leaning 3.5 deg, perpendicular to the edge, which also is the sheet's 90 deg |
| 08-4-11 | mismatch (taper not built, 0.805 straight) | 0.8 +0.01 at entry, (0.77) at the other, Kegel 1:90, drilled 0.7 (sure) | `cones[0].d [0.805]` (a single value, no half angle); the section circle 0.79 wide | mismatch: no taper, and 0.805 at both ends against 0.77 at one | yes | the taper over the hole's 2.7-3.1 mm length is 0.03 as drawn (1:90) |
| 08-4-12 | match | 0.75 +-0.05 from the 1.6 face (likely) | centre z=2.55, 0.75 from z=3.3 | match | yes | and it is the face where the bore is the larger, as drawn |
| 08-4-13 | match | slit at the wide end, hole at the narrow end (sure) | as drawn | match | yes | |
| 08-4-14 | not built | Koerner anbringen (centre-punch mark) at the hole's place on the edge (sure) | none | not built | yes | a punch mark; no timing effect |
| 08-4-15 | match | convex arcs at both ends (likely) | r 4.5 about the bore axis | match | yes, accepted not re-read | |
| 08-4-16 | can't tell | view side not fixed (unsure) | | can't tell | yes | the plan shows the 1.6 circle, so the plan is seen from the 1.6 face; the page's collet is at identity orientation in its root frame, so I could not go further without the recipe |

## Sheet 05 03_9 (Kloetzchen 05 03 02-3: stud)

Enlarged reads. Title block: Flachmessing 15 x 7, DIN 1759 Ms 58, 5:1, drawn 6.6.41. Left view: the leg seen from the side, arm face vertical at the left, leg to the right, 98 deg at the arm's face (between the vertical and the leg's top edge, the leg's edge slopes 8 deg), 1.6 -0.2 (arm), 6.1 -0.2 (overall), 1.9 -0.2 (across the leg end), hole 0.7 at the leg's end, "Loch wird bei Montage der Spirale gebohrt". Right view (plan): 3.1 -0.2 (width at the hole), 14.6 -0.2 overall, 6.6 -0.2 apex to hole, 5 +-0.1 hole to square end, 2.5 -0.2 and 1.2 -0.1 and 1.6 -0.2 at the leg end, "0.8 phi" at the tip. Section (bottom): 1.8 g6 (-0.003/-0.010), 1.5 phi H7 +0.009.

| id | reader | my reading (certainty) | built value | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 08-5-1 | match | 14.6 -0.2 (sure) | 14.597 | match | yes | the dimension runs to the round nose's tip: built is a point at 13.7 (see 08-5-15) |
| 08-5-2 | match | 1.5 H7 +0.009 (sure) | 1.509 | match | yes | |
| 08-5-3 | match | 5 +-0.1 (sure) | 4.997 | match | yes | |
| 08-5-4 | match | 6.6 -0.2, from the hole axis to the apex of the V (sure) | 6.6 | match | yes | |
| 08-5-5 | match | 3.1 -0.2 (sure) | 3.10 | match | yes | |
| 08-5-6 | match | 2.5 -0.2 at the square end (likely) | 2.46 | match | yes | |
| 08-5-7 | match | 1.6 -0.2 (sure) | 1.5 | match | yes | |
| 08-5-8 | match | 6.1 -0.2 (sure) | 6.0 | match | yes | |
| 08-5-9 | match | 1.8 g6 (sure) | 1.7936 | match | yes | g6 for 1.8: 1.790-1.797; inside |
| 08-5-10 | match | 98 deg (sure) | 90 + 8.0 deg | match | yes | I also checked the sense: both leg edges shift toward the lower-y edge going away from the arm (built y 3.41-5.16 at z=1.5, 2.78-4.53 at z=6), as in the sheet; the leg's offset in the arm's width, 0.5/0.87 from the two arm edges by scale, is 0.59/0.76 built, flipped |
| 08-5-11 | match | 1.9 -0.2 (likely) | 1.733 | match, near the low limit | yes | |
| 08-5-12 | match | 0.7 (sure; it is the hole's diameter, the 0.7 dimension arrows span the hole's lines) | 0.7 | match | yes | |
| 08-5-13 | mismatch (unsure) | hole centre 0.69 from the leg's end (the circle 0.8 drawn, 95 px at 138 px/mm); the sheet says the hole is drilled at assembly (likely) | hole at z=4.65, leg end z=6.0: 1.35 | mismatch +0.66 | yes | the built hole is where the page's strip passes (the strip's centre at 3.15 from the arm's inner face); the drawn hole is 0.66 nearer the end |
| 08-5-14 | match | hole 0.62 from the low edge (scale, unsure) | 0.515 | match within the scale (0.1) | yes | |
| 08-5-15 | not built | the nose is round: "0.8 phi" with an arrow to the tip, an arc about 0.4 radius (likely; I enlarged the nose) | a sharp point at (13.7, 4.2) | not built (a round nose of 0.8 dia drawn, a point built) | yes | raised to likely: the arc is plain on the crop |
| 08-5-16 | match | V apex 3.0 short of the tip (14.6 - 5 - 6.6) (likely) | 3.0 | match | yes | |
| 08-5-17 | match | bevel on the face away from the leg (likely) | as drawn | match | yes, accepted not re-read | |
| 08-5-18 | can't tell | 1.2 -0.1: from the plan's centre line to the arm's side edge at the leg end; 1.6 -0.2: from the centre line to the lower edge of the tilted leg's footprint (likely; the 12x crop shows arrows to the centre line and to the two lower edges) | arm half widths 1.23 and 1.23; leg footprint reaches 1.42 below the centre line (leg end, z=6) | 1.2 -0.1: built 1.23 is 0.03 over the 1.1-1.2 limit (the sheet's own 2.5 -0.2 gives 2.3-2.5 for the whole width: inconsistent with 2 x 1.2 -0.1 by 0.1); 1.6 -0.2: match (1.42 is inside 1.4-1.6) | no | the dimensions attach to the centre line, so the reader's "attachment unclear" was resolvable |
| 08-5-19 | match | hand consistent (likely) | | match | yes | I compared the leg's offset in the arm's width, see 08-5-10 |
| 08-5-20 | can't tell | 1.4 phi on sheet 5 (unsure) | screw 1.3817 | can't tell | yes | |

## Items the reader missed

| id | sheet | item | my reading | built | verdict |
|---|---|---|---|---|---|
| 08-1-v1 | 05 03_5 | the three heights are one chain: 3.15 + 9.5 + 0.75 = 13.4, and the built chain 2.89 + 9.97 + 0.49 = 13.35 | by the pitch cause: built 0.80 against 0.73-0.74 | the built strip stands 0.24-0.26 past the drawn top and bottom at both ends; fix by pitch, not by moving the spring | mismatch (a combined finding) |
| 08-1-v2 | 05 03_5 | "20 phi" (read as 20 deg, arrow with an arc) in the side view; what it attaches to is not clear | the collet's long axis is tilted about 18-20 deg from the plan's vertical in the plan view (edges 13-22 deg) | not compared | can't tell |
| 08-4-v1 | 05 03_8 | 90 deg between the top edge and the hole's dashed line: the hole's axis is perpendicular to the side edge | the plan PNG shows the hole's edge leaning 3.5 deg, perpendicular to the tapered edge | built 3.5 deg | match |
| 08-4-v2 | 05 03_8 | "0.7 bohren": the hole is drilled 0.7 first, then 0.8 phi +0.01 with the Kegel 1:90 | | built 0.805 only | not built (a manufacturing note; goes with 08-4-11) |
| 08-2-v1 | 05 03_6 | "Rohmass 0.52 x 0.285 x 603": the raw strip is 603 mm long | the built strip is 507.2 mm: the sheet 7's length after the curve is formed | 603 is the blank, 507 the formed length: 603 - 507 = 96 mm lost; not comparable | can't tell |
| 08-5-v1 | 05 03_9 | "Loch wird bei Montage der Spirale gebohrt": the spring hole is a size and place made at assembly, so 08-5-13 is not a defect of the built part against the sheet; it is a place the sheet does not fix | | | note |
| 08-5-v2 | 05 03_9 | 3.1 -0.2 and the V's opening: the notch (V cut) apex also rounds (small radius at the apex) | the V's inner end drawn rounded (enlarged) | the built apex a sharp corner (hsStud outline) | not built (unsure; small, about 0.1 radius) |

## Summary of the disagreements with the reader

1. 08-4-10 (cross hole at 3.5 -0.02): the reader's mismatch is refuted. 3.578 is the entry point on the edge; the axis crosses the centre line at x 3.49, inside 3.48-3.50. Verdict: match.
2. 08-4-5 and 08-4-7 (bore): the reader matched 1.6029 (z=0) to 1.6 H7 and then called 1.65 (z=3.3) +0.10 from 1.55. The 1.6 H7 end is the one at the cross hole's face (z=3.3, built 1.65, +0.05); the 1.55 end is z=0 (built 1.6029, +0.05). The whole bore is 0.05 too large; the taper itself is right (1:70, large end at the hole's face). 08-4-5 changes from match to mismatch; 08-4-7 stays a mismatch, +0.05.
3. 08-5-18 (1.2 -0.1 and 1.6 -0.2 at the leg end): they attach to the plan's centre line, so they can be judged. 1.2 -0.1 is 0.03 over the limit (and the sheet's 2.5 -0.2 contradicts 2 x 1.2 -0.1 by 0.1); 1.6 -0.2 matches (1.42).
4. 08-1-7 (stud hole 4.1, 4.2): a match in radial distance (5.84 scaled against 5.87), not can't-tell.
5. 08-2-6 (turns): the built 12 rows match sheet 5's 12 rows; the raw 15 is the blank.
6. 08-3-3 to 08-3-5 (terminal curve): still can't tell, but the page's curve is shorter in angle than the sheet's by about 30-60 deg and falls faster in the middle, with the end radius agreeing; see "What can be concluded" above.
7. Confirmed, with new support: pitch 0.73-0.74 drawn (16 rows in 11.5, 12 rows on sheet 5) against 0.80 built (08-2-5); height 9.5 against 9.97 (08-1-4); the 3.15 and 0.75 offsets are the same error at each end (08-1-2, 08-1-3, missed 08-1-v1); the spring hole 0.69 against 1.35 from the leg's end (08-5-13, assembly-drilled); the tip round nose (08-5-15); no cross-hole taper (08-4-11); no punch mark (08-4-14).

Things I could not read or check: the sheet 7 grey numbers (the outer set, illegible at this scan); the angle of each black radius; the sheet's view side for the plan of sheets 5, 7, 8 and 9 (so hand as assembled is "can't tell" on the collet and the terminal curves); the "20" in sheet 5 (what it attaches to).
