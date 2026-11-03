# Batch 6 reading: the escapement (blind reader)
Read blind from the sheet images and the measurement files only; the code that builds the parts was not read. Positions of the placed parts come from `r_wpa/page/placements.json`; each part's transform was fitted from its own box (detent, gold spring and block all fit mirrored in x, rotated -25.05 deg in the dial-side plan, part +Z = movement +y; the pipe lands on the origin of 050401-3 at (-14.39, 15.10), which fixes the 180 deg ambiguity). Brackets: where the detent sheet prints a second handwritten value in brackets the built value follows the bracketed one.
Layout hand: the triangle (pipe, escape wheel, balance) has opposite handedness on the sheet and in the dial-side plan, so the layout is seen from the Oberplatte side; sheet 3 and the layout agree. Sheet 5's plan (tail on the left, wide edge on the right, tip up) equals the part plan seen from +Z, the opposite face. So the sheets of one detent do not look from the same side, or the detent's hand differs between them; I could not fix it (certainty unsure; see 06-5-hand item).

## Sheet 05 04_1 layout Hemmung fuer Feder-Chronometer

Title block: Gerhard D. Wempe, Chronometerwerke Hamburg 11; Hemmung fuer Federchronometer, Kaliber 020; scale 10:1; drawn 3.2.40, checked 11.2.41 (illegible initials); no material. Views: plan of balance roller, gold spring, detent, escape wheel and block; elevation above it with Oberplatte. Printed: Gangrad-Unruh 10.00, Gangrad O 14.00, Heberolle O 6.78, Ruhestein O 0.75, 25.68 von Unruhmitte, 23.8 von Gangradmitte, 18.8, 7.6, 0.04, Hebestein/Ausloesestein width 1.7, 1.6, 4.1, 8, 1.4, 1.3, 2.3, 2.8, 6.5 and angles 12, 15, 20, 22 deg 10', 86, 24, 21, 11.5, 2, 1. View side: the plan is seen from the Oberplatte side (first-angle: elevation with the plate on top). Placed against the part frames this is the part plan seen from the face opposite +Z (dial side), a mirror of the dial-side view; the triangle balance-wheel-pipe has the opposite handedness to the dial view and the same as the model seen from the train side. Certainty: likely.
Views against each other: the elevation heights (1.6, 1.7, 1.4, 1.3, 2.3, 2.8) are read once each; the layout draws the block with a 3.8 mm chamfer that sheet 3 (a plain rectangle) lacks, and puts the stud circle 3.8 from the M1.7 hole where sheet 3 gives 4.5 (2.8 against 7.3). The layout's arm 2.8 against sheet 3's 3. The layout and the part sheets disagree with each other here.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-1-1 | balance to escape-wheel centre distance (Gangrad-Unruh) | 10.00 (sure) | placements 050403-1 origin (-9.1,12.11) vs 050405-1 origin (-11.783,21.743): 9.9997 | -0.0003 | match |
| 06-1-2 | escape wheel tip diameter (Gangrad O) | 14.00 (sure) | escapeWheel teeth[0].tips_d: 14.0 | 0 | match |
| 06-1-3 | impulse roller diameter (Heberolle O) | 6.78 (sure) | impulseRoller box size 6.78: 6.78 | 0 | match |
| 06-1-4 | escape wheel bore (circle at the centre, label 1,8) | 1.8 (likely) | escapeWheel cylinders[0].d: 1.808 | +0.008 | match |
| 06-1-5 | locking stone diameter (Ruhestein O) | 0.75 (sure) | detent cylinders[1].d (pipe bore); 050401-3 box width 0.75: 0.754 / 0.75 | +0.004 | match |
| 06-1-6 | balance centre to M1.7 clamp-hole centre (von Unruhmitte) | 25.68 (sure) | detentBlock cylinders[2] at (18.7341,-7.49) placed by its fitted transform; distance to 050403-1 origin: 25.77 | +0.09 | match |
| 06-1-7 | escape wheel centre to M1.7 clamp-hole centre (v. Gangradmitte) | 23.8 (sure) | same hole to 050405-1 origin: 23.41 | -0.39 | mismatch |
| 06-1-8 | pipe axis to M1.7 axis along the detent (18,8) | 18.8 (scaled 18.96 +-0.2) (likely) | detentBlock cylinders[2].at x 18.7341, pipe at detent x 0: 18.73 | -0.07 | match |
| 06-1-9 | M1.7 axis to the detent foot centre line (7,6) | 7.6 (sure) | detentBlock cylinders[2].at y -7.49 to foot middle y 0.11 (detent outlines_by_level 1.35): 7.60 | 0 | match |
| 06-1-10 | pipe axis to escape wheel centre (scaled) | 7.2 (+-0.15) (likely) | 050401-3 / detent origin (-14.393,15.097) to 050405-1 origin: 7.14 | -0.06 | match |
| 06-1-11 | pipe axis to balance centre (scaled) | 5.99 (+-0.1) (likely) | same pipe to 050403-1 origin: 6.08 | +0.09 | match |
| 06-1-12 | escape wheel centre along the detent from the pipe (drawn directly under the pipe) | 0 (+-0.1, scaled) (likely) | pipe-to-wheel vector on the detent axis (placements 050401-1 box fit, theta -25.05 mirrored): +0.447 | +0.45 | mismatch |
| 06-1-13 | angle at the pipe between detent axis and the balance-to-wheel line | 53.6 deg (scaled +-1) (likely) | from the placements: angle of (-2.683,9.633) to (-0.906,0.423): 49.4 deg | -4.2 deg | mismatch |
| 06-1-14 | angle labelled 15 deg near the foot/centre line (what it attaches to is unclear) | 15 deg (unsure) | balance to M1.7 line against the detent axis, from placements: 15.8 deg | +0.8 deg (if so) | can't tell |
| 06-1-15 | gold spring: bend point (Biegungspunkt der Goldfeder), distance from the spring end | about 6.3 (scaled) (unsure) | goldSpring outlines_by_level[2.25] line at x 6.15; end at 10.5841: 4.43 | -1.9 | mismatch |
| 06-1-16 | gold spring clamp screw from the spring end | 1.23 (scaled) (likely) | goldSpring cylinders[0].at x 9.3841, end 10.5841: 1.20 | -0.03 | match |
| 06-1-17 | stud/screw circle (d1.3 hole with cone point) from the M1.7 centre along the block | about 3.8 (scaled +-0.15) (likely) | detentBlock cylinders[1] (18.7341,-2.99) vs [2] (18.7341,-7.49): 4.50 | +0.7 | mismatch |
| 06-1-18 | block 0.9 holes: lateral +-2.0 and 5.0 along from the M1.7 centre | 2.0 / 5.0 (scaled) (likely) | detentBlock cylinders[6],[5]: (16.7341,-2.49),(20.7341,-12.49): +-2.0 / 5.0 | 0 | match |
| 06-1-19 | detent steady pins spacing (two pins either side of the stud) | about 4.0 (scaled +-0.15) (unsure) | detent cylinders[2],[3]: x 16.6341 and 20.8341: 4.20 | +0.2 | can't tell |
| 06-1-20 | block plan: 45 deg chamfer about 3.8 x 3.8 at the corner far from the foot (arm side) | 3.8 x 3.8 (scaled) (likely) | detentBlock outlines_by_level[0.0]: plain rectangle 7.5 x 14.6: none | - | not built |
| 06-1-21 | block width and length in the layout | 7.55 x 14.7 (scaled) (likely) | detentBlock box size 25.0 x 14.6 x 6.5, base 7.5 wide: 7.5 x 14.6 | ~0 | match |
| 06-1-22 | impulse stone width (Hebesteinbreite) | 1.7 (sure) | 050403-2 page box y -18.705..-17.005: 1.70 | 0 | match |
| 06-1-23 | discharge stone width (Ausloesesteinbreite) | 1.7 (sure) | 050404-2 page box y -16.98..-15.28: 1.70 | 0 | match |
| 06-1-24 | roller thickness (1.6) and discharge roller thickness (1.6) in the section | 1.6 each (likely) | impulseRoller z_levels -18.68..-17.03; dischargeRoller -17.03..-15.43: 1.65 / 1.60 | +0.05 / 0 | match |
| 06-1-25 | arm thickness in the layout section (2.8, centre 1.4) | 2.8 (likely) | detentBlock arm outlines 3.5: y -1.59..-4.59: 3.0 | +0.2 | mismatch |
| 06-1-26 | detent banking, locking-stone angle and place, discharge roller jewel place, angles 24, 21, 11.5, 2, 1, 1/2 deg | not legible / not attachable (unsure) | -: - | - | can't tell |
| 06-1-27 | escape wheel tooth count and tooth form | no count printed (24 deg label unclear) (unsure) | escapeWheel teeth[0].count 15: 15 | - | can't tell |
| 06-1-28 | Oberplatte to balance seat 4.1, section heights 1.3, 2.3, 1.4, 0.9, 8 | legible, not mapped (unsure) | placements y levels: - | - | can't tell |

Extras:
- Built, not on the sheet: the escape wheel's three-armed form and tooth form are drawn on the sheet but not compared (no sizes printed except 14.00, 1.8). The discharge roller (dischargeRoller: Ø2.15 arcs, bore 1.205) has no sheet in this batch; the layout shows it too small to read (can't tell).

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Sheet 05 04_2 Goldfeder 05 04 01-2

Title block: Goldblech 333 federhart; scales 5:1 and 1:1; Gerhard D. Wempe; drawn 16.9.42 (Schoenhardt), checked 16.9.42; 21.7.43 entry; number 05 04 01-2; Goldfeder. One plan view (blank, straight) and a small 1:1 sketch. Tolerance: general not legible; surface marks three triangles. Hole: Ø0.7 +0.05.
Views against each other: one plan view and the 1:1 sketch agree; the straight blank length 15.4 equals the built developed length.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-2-1 | developed length of the blank | 15.4 (sure) | goldSpring outline: 10.8967 + 4.4341 along the strip (bent shape): 15.33 | -0.07 | match |
| 06-2-2 | strip width (z) | 1 (sure) | goldSpring z_levels 2.25..3.25: 1.0 | 0 | match |
| 06-2-3 | thickness | 0.15 (sure) | goldSpring outlines y 0.36..0.51: 0.15 | 0 | match |
| 06-2-4 | end block length | 2.4 (sure) | goldSpring outline 8.1841..10.5841: 2.4 | 0 | match |
| 06-2-5 | end block height | 2 (sure) | goldSpring z_levels 1.25..3.25: 2.0 | 0 | match |
| 06-2-6 | hole diameter | 0.7 +0.05 (sure) | goldSpring cylinders[0].d: 0.7 | 0 (lower limit) | match |
| 06-2-7 | hole from the end | 1.2 (sure) | goldSpring cylinders[0].at x 9.3841 from end 10.5841: 1.2 | 0 | match |
| 06-2-8 | hole across the block (about 1.0 from the strip edge, scaled) | 1.0 (+-0.1) (likely) | goldSpring cylinders[0].at z 2.3 (strip top 3.25): 0.95 | -0.05 | match |
| 06-2-9 | blank drawn straight; the built spring is bent in plan (BSPLINE, sag 0.9) | straight (sure) | goldSpring outlines_by_level[2.25] curve BSPLINE: bent | - | extra |
| 06-2-10 | material gold sheet 333, spring hard | Goldblech 333 federhart (sure) | -: - | - | can't tell |

Extras:
- Bent shape in plan (BSPLINE from x 6.15 to -4.54, sag 0.9); the sheet's blank is straight and the bend is only on the layout (see 06-1-15).

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Sheet 05 04_3 Gangfederkloben 05 04 01-4

Title block: no material; scale 5:1 (1:1 sketch); drawn 8.7.43 (Juenicke), checked 19.7.43, 21.7.43; number 05 04 01-4; Gangfederkloben. Note 'nicht eingetr. Toleranz +-0.1'. Views: plan of base with arm, side view of the arm (3 wide, M1.2 cross hole, 0.3 slit), end view of the base (6.5, 2.3 +0.02, M1), bottom elevation (6.5 x 3, 90 deg +-0.5). Hole numbers not used. The plan is seen from the face opposite +Z of the part (mirror; consistent with the layout), certainty likely.
Views against each other: the plan, side and end views agree on 25, 17.5, 15, 3, 14.6, 6.5, 3; the 6.5 appears twice (the step along the base and the overall thickness).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-3-1 | overall length of the arm and base | 25 (sure) | detentBlock size[0]: 25.0 | 0 | match |
| 06-3-2 | base length | 14.6 (sure) | detentBlock size[1]: 14.6 | 0 | match |
| 06-3-3 | base width (3.75 each side of the hole row) | 7.5 (likely) | detentBlock box x 14.9841..22.4841: 7.5 | 0 | match |
| 06-3-4 | arm width | 3 (sure) | detentBlock outlines 3.5: y -1.59..-4.59: 3.0 | 0 | match |
| 06-3-5 | arm offset from the base edge | 1.4 +0.1 (sure) | y -0.19 to -1.59: 1.40 | 0 | match |
| 06-3-6 | arm length from the base | 17.5 (sure) | x -2.5159..14.9841: 17.5 | 0 | match |
| 06-3-7 | distance to relief start | 15 (sure) | x -2.5159..12.4841: 15.0 | 0 | match |
| 06-3-8 | relief radius | 3 r (likely) | detentBlock cylinders[0].d 6.0 (arc 52.9 deg): r 3.0 | 0 | match |
| 06-3-9 | flat beside the relief | 0.4 (sure) | line (14.5841,-6.59)-(14.9841,-6.59): 0.4 | 0 | match |
| 06-3-10 | slit width and length | 0.3 and 7 (sure) | lines y -3.24/-2.94, x -2.5159..4.4841: 0.3 and 7.0 | 0 | match |
| 06-3-11 | M1.2 cross hole: distance to the hole row | 18.8 +-0.03 (sure) | detentBlock cylinders[3].at x -0.0659 to row 18.7341: 18.800 | 0 | match |
| 06-3-12 | M1.2 cross hole diameter (thread core) | M1.2 (sure) | cylinders[3].d: 0.9294 | core of M1.2 is 0.93 | match |
| 06-3-13 | M1.2 hole across the arm thickness (centred, scaled +-0.06) | centre of the 3 (z 5.0) (unsure) | cylinders[3].at z 5.15: 5.15 | +0.15 | mismatch |
| 06-3-14 | base thickness | 3 (sure) | detentBlock outline level 3.0: 3.0 | 0 | match |
| 06-3-15 | thick part thickness | 6.5 +0.05 (sure) | detentBlock z_levels 6.5: 6.5 | 0 (lower limit) | match |
| 06-3-16 | thick part length from the base edge (step line, scaled 6.44) | 6.5 (likely) | outline 6.5: y -0.19..-6.59: 6.4 | -0.1 | match |
| 06-3-17 | M1.7 hole position along the block | 7.3 +0.04 (sure) | cylinders[2].at y -7.49 from edge -0.19: 7.30 | 0 | match |
| 06-3-18 | M1.7 hole size (thread core) | M1.7 (sure) | cylinders[2].d 1.3211: 1.3211 | core of M1.7 is 1.32 | match |
| 06-3-19 | 1.3 hole position | 2.8 (sure) | cylinders[1].at y -2.99: 2.80 | 0 | match |
| 06-3-20 | 1.3 hole depth | tief 3 (sure) | cylinders[1].z 0..3: 3.0 | 0 | match |
| 06-3-21 | small 0.9 hole (near) position and diameter | 2.3 from the edge, 2 off the row, 0.9 (sure) | cylinders[6]: (16.7341,-2.49) d 0.9, z 0..6.5: 2.3 / 2.0 / 0.9 | 0 | match |
| 06-3-22 | small 0.9 hole (far) position and diameter | 12.3 from the edge, 2 off the row, 0.9 (sure) | cylinders[5]: (20.7341,-12.49) d 0.9, z 0..3: 12.3 / 2.0 / 0.9 | 0 | match |
| 06-3-23 | M1 cross hole height | 2.3 +0.02 (sure) | cylinders[7].at z 2.3: 2.3 | 0 (lower limit) | match |
| 06-3-24 | M1 cross hole size (thread core), open at the foot face | M1 (sure) | cylinders[7].d 0.7294: 0.7294 | core of M1 is 0.73 | match |
| 06-3-25 | angle arm to base | 90 deg +-0.5 (sure) | outline lines axis-parallel: 90 deg | 0 | match |
| 06-3-26 | hand of the 0.9 holes (the near one on one side of the row, the far one on the other) | sheet seen from the face opposite +Z (likely) | cylinders[5],[6] x 20.73 / 16.73: mirrored hand fits the layout | - | match |
| 06-3-27 | tolerance and material notes (not entered: +-0.1) | general +-0.1 (sure) | -: - | - | can't tell |
| 06-3-28 | two d0.45 blind holes 1.6 deep in the foot face at x 16.63 and 20.83 (steady pins) | not on this sheet (sure) | cylinders[8],[9]: present | - | extra |

Extras:
- Two d0.45 blind pin holes 1.6 deep at x 16.63 / 20.83 on the foot face (the detent's steady pins; the layout draws pins, this sheet does not).

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Sheet 51 04_6 Heberolle 02 04 02

Title block: Kupfer-Beryllium, Saphir; scale 10:1 (1:1 sketch); drawn 11.2.41 (hand), checked 10.4.41; number 020402 (the title says Heberolle); change '6 Eintragungen' 10.4.41. Views: plan (roller with cut R3.5, stone slot, main hole, small hole) and side view. Note 'Saphir eingelackt'.
Views against each other: the plan and side view agree (1.6/1.7 widths, taper note on the main hole); the 9,005 near the base is not legible.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-4-1 | roller diameter | 6.78 +-0.01 (sure) | impulseRoller box size 6.78: 6.78 | 0 | match |
| 06-4-2 | thickness | 1.6 +0.1 (sure) | z_levels -18.68..-17.03: 1.65 | 0 (in tolerance) | match |
| 06-4-3 | main hole diameter, taper 1:70 (reamed) | 1.65 -0.03 / 1.627 (likely) | cones[0].d [1.6264,1.65]: 1.6264..1.65 | 0 | match |
| 06-4-4 | small hole diameter | 1.3 (sure) | cylinders[1].d: 1.3 | 0 | match |
| 06-4-5 | small hole position: 0.7 across and 1.9 along | 0.7 / 1.9 (radius 2.02) (sure) | cylinders[1] from_origin 2.0248: 2.025 | 0 | match |
| 06-4-6 | stone slot width | 0.5 (sure) | outline 0.506 end line: 0.506 | +0.006 | match |
| 06-4-7 | stone slot inner end from the centre | 1.55 (sure) | outline lines 1.50..1.58 from origin: 1.5-1.58 | 0 | match |
| 06-4-8 | stone length 1.8 (protrudes past the cut) | 1.8 (likely) | pocket depth 1.0 in the disc; stone is 050403-2: - | - | can't tell |
| 06-4-9 | cut radius | 3.5 r (sure) | impulseRoller arcs r 3.5: 3.5 | 0 | match |
| 06-4-10 | chord of the cut (3,5 at the top) | 3.5 (likely) | tips (-0.8005,-3.2941),(2.549,-2.2348): 3.51 | +0.01 | match |
| 06-4-11 | dimension 2 and the 9,005 at the base | 2 and illegible (unsure) | cut centre at 5.927 from the axis: - | - | can't tell |
| 06-4-12 | hand: stone and small hole turn the same way round as the sheet seen from the other face (151 vs 153 deg) | mirrored (likely) | cylinders[1] angle vs pocket: mirrored | - | match |
| 06-4-13 | jewel thickness (1.7 on the side view) | 1.7 (sure) | 050403-2 box y -18.705..-17.005: 1.70 | 0 | match |
| 06-4-14 | material Kupfer-Beryllium, Saphir | as printed (sure) | -: - | - | can't tell |
| 06-4-15 | cut centre distance 5.927 from the axis (not printed) | not printed (sure) | cylinders[0] from_origin 5.9267: 5.927 | - | extra |

Extras:
- Cut centre 5.927 from the axis (not printed).

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Sheet 05 04_10.1 Gangfeder 1436 sheet 1

Title block: Stahl; scale 5:1; Fabriknorm Berlin-Friedenau form 10513 A4; 'Entworfen 12.2.43 Rud. Griessbach'; number 1436; Gangfeder. Views: plan (tip up, foot down) and side view. Many dimensions carry a second handwritten value in brackets (for example 0.25 (0.22), 1 (0.9)); I read the bracketed values as a later correction (unsure). No tolerances printed; the general tolerance is not legible, fallback used.
Views against each other: plan and side view agree on the thicknesses (1 (0.9), 2 (1.9), 0.8 (0.75)); the overall lengths along the strip are marked but their figures are not legible on the scan.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-5-1 | tip to pipe centre | 4.4 (sure) | detent box x min -4.4, pipe at x 0: 4.4 | 0 | match |
| 06-5-2 | tip to far side of the pipe (5 1/4 first reading, (4.9)) | 4.9 (bracket) (unsure) | 4.4 + 0.575: 4.975 | +0.075 | match |
| 06-5-3 | tail width at the pipe | 0.25 (0.22) (likely) | detent outline 2.5: curves at x -0.5644 y +-0.11: 0.22 | 0 (bracket) | match |
| 06-5-4 | tail width at the tip | 0.25 (0.22) (top callout) (unsure) | detent outline 2.5: x -4.4 y -0.5418..-0.5954: 0.054 | -0.17 | mismatch |
| 06-5-5 | tail bend (Anschraegen): lateral offset of the tip, scaled | 0.54 (+-0.1) (likely) | tip centre y -0.568 to centre 0: 0.57 | +0.03 | match |
| 06-5-6 | arm width below the pipe | 0.33 (0.28) (likely) | detent outline 2.35: y -0.14..0.14: 0.28 | 0 (bracket) | match |
| 06-5-7 | arm wide part width | 0.55 (0.50) (likely) | detent outline 2.35: y -0.14..0.36: 0.50 | 0 (bracket) | match |
| 06-5-8 | spring thickness at the ends | 0.09 (likely) | detent outline 1.35: y 0.065..0.155 at x 10.384, 15.384: 0.09 | 0 | match |
| 06-5-9 | spring thickness in the middle | 0.07 (likely) | y 0.075..0.145 at x 12.884: 0.07 | 0 | match |
| 06-5-10 | spring length (Viereck end to the foot), scaled 4.9-5.0 | 5.0 (likely) | x 10.3841..15.3841: 5.0 | 0 | match |
| 06-5-11 | Viereck length and thickness | 2 and 2 (1.9) (likely) | section_y0 loop x 8.384..10.384, z 1.35..3.25: 2.0 x 1.9 | 0 | match |
| 06-5-12 | foot length | 6.6 (sure) | x 15.3841..21.9841: 6.6 | 0 | match |
| 06-5-13 | foot thickness (z) | 2 (1.9) (sure) | z 1.35..3.25: 1.9 | 0 (bracket) | match |
| 06-5-14 | arm thickness (z) | 1 (0.9) (sure) | section_y0 z 2.35..3.25: 0.9 | 0 (bracket) | match |
| 06-5-15 | tail thickness (z) | 0.8 (0.75) (sure) | detent outline 2.5..3.25: 0.75 | 0 (bracket) | match |
| 06-5-16 | foot width (in plan) | 0.65 (0.60) (sure) | detent outline 1.35: y -0.19..0.41: 0.6 | 0 (bracket) | match |
| 06-5-17 | foot hole diameter (scaled 1.0 +-0.1) at 3.4 from the end | 1.0 (unsure) | detent cylinders[0].d 1.1 at x 18.7341: 1.1 | +0.1 | match |
| 06-5-18 | foot steady pins either side of the hole (scaled 2.0) | 2.0 (+-0.1) (unsure) | detent cylinders[2],[3] x 16.6341, 20.8341: 2.1 | +0.1 | match |
| 06-5-19 | overall length (scaled 26.7 +-0.3) | 26.7 (unsure) | detent size[0]: 26.384 | -0.3 | match |
| 06-5-20 | pipe length along its axis (scaled 1.9) | 1.9 (likely) | detent cylinders[5].z 2.35..4.25: 1.9 | 0 | match |
| 06-5-21 | pipe outside diameter (scaled 1.0) | 1.0 (unsure) | detent cylinders[5].d 1.15: 1.15 | +0.15 | can't tell |
| 06-5-22 | bracketed values: read as the later correction (handwritten); the unbracketed ones are the first draft | - (unsure) | built follows the bracketed: - | - | can't tell |
| 06-5-23 | hand: sheet plan equals the part plan seen from +Z; layout and sheet 3 equal it seen from -Z (tail toward the balance in the layout) | - (unsure) | detent outlines: - | - | can't tell |

Extras:
- Pin holes d0.45 at x 16.63 and 20.83, 0.7 deep, and d1.1 at 18.73: sizes not printed (scaled only).

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Sheet 05 04_10.2 Gangfeder 1436 sheet 2

Same sheet number 1436 with handwritten German labels only (Spitze, Roehrchen oben, Steg, Viereck, Viereckflaeche, Federung, Fuss, Fussstirnseite, linke/rechte Seite, unten/oben); no new sizes.
Views against each other: labels only.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 06-6-1 | names: Spitze, Roehrchen oben, Steg, Viereck, Viereckflaeche, Federung, Fuss, Fussstirnseite exist in the part | labels only (sure) | section_y0 and outlines: all present | - | match |
| 06-6-2 | Roehrchen (pipe) stands out on the side the arm is flush with (oben) | pipe at the arm side (likely) | section_y0: pipe z to 4.25, arm face z 3.25: pipe past the arm side | - | match |
| 06-6-3 | linke/rechte Seite of the arm (which edge is the wide one) | labels (unsure) | outline 2.35 y -0.14 / +0.36: - | - | can't tell |

Extras:
- None.

After the verdicts: not done (the recipes were not read in this pass); the verifier may check the mismatches against them.

## Summary

Counts: match 81, mismatch 8, can't tell 14, not built 1, extra 3 (total 107).

Mismatches and not built:
- 06-1-7 (mismatch): escape wheel centre to M1.7 clamp-hole centre (v. Gangradmitte); drawn 23.8, built 23.41, delta -0.39 (sure).
- 06-1-12 (mismatch): escape wheel centre along the detent from the pipe (drawn directly under the pipe); drawn 0 (+-0.1, scaled), built +0.447, delta +0.45 (likely).
- 06-1-13 (mismatch): angle at the pipe between detent axis and the balance-to-wheel line; drawn 53.6 deg (scaled +-1), built 49.4 deg, delta -4.2 deg (likely).
- 06-1-15 (mismatch): gold spring: bend point (Biegungspunkt der Goldfeder), distance from the spring end; drawn about 6.3 (scaled), built 4.43, delta -1.9 (unsure).
- 06-1-17 (mismatch): stud/screw circle (d1.3 hole with cone point) from the M1.7 centre along the block; drawn about 3.8 (scaled +-0.15), built 4.50, delta +0.7 (likely).
- 06-1-20 (not built): block plan: 45 deg chamfer about 3.8 x 3.8 at the corner far from the foot (arm side); drawn 3.8 x 3.8 (scaled), built none, delta - (likely).
- 06-1-25 (mismatch): arm thickness in the layout section (2.8, centre 1.4); drawn 2.8, built 3.0, delta +0.2 (likely).
- 06-3-13 (mismatch): M1.2 hole across the arm thickness (centred, scaled +-0.06); drawn centre of the 3 (z 5.0), built 5.15, delta +0.15 (unsure).
- 06-5-4 (mismatch): tail width at the tip; drawn 0.25 (0.22) (top callout), built 0.054, delta -0.17 (unsure).

Could not read: the detent sheet's long dimensions between the pipe and the foot (arrows without figures), the '0,18 u.d.f.' note, the layout's 9,005 on sheet 4 and 2, the banking, the locking stone's angle and the discharge jewel on the layout, the locking angles 24/21/11.5/2/1 deg (what they attach to), the discharge roller's outline (no sheet).
