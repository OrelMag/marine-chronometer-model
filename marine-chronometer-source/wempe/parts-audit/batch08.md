# Batch 8: the hairspring (51 03_5, 05 03_6, 05 03_7, 05 03_8, 05 03_9)
Reader: blind reading of the sheets, compared with `r_wpa/measure/hsCollet.json`, `hsStud.json`, `studScrew.json` and `r_wpa/page/050302-1.json`, `050302-4.c.json`, `050302-4.s.json`, `placements.json`. Crops were made in `E:/mc-video/wpa-audit/crops/` (outside the repository). Certainty: sure, likely, unsure. Hand is judged as assembled; the spring is a left-hand helix about the balance axis.

## Sheet 51 03_5 Spiralfeder kompl. (assembly), Zeichnung 127-556.04 U06 / 04 03/10 bis 12

Title block: scale 5:1; Werkstoff blank; dated 29.10.41; items 21 spring (-021), 22 collet (-022), 23 stud (-023), 24 pins (-024); 'Ansteckungspunkt' marked twice; LC.

Views: elevation (spring 12-13 coil sections with the stud on top and the collet at the bottom), plan (spring, stud arm, collet with slit). Dimensions 1.4, 3.15, 13.4, 9.5, 0.75, 5 and a '20' (illegible). Finding: the sheet's own elevation counts about 12-13 coil sections at ~0.71 pitch, while 9.5 = 13.4 - 3.15 - 0.75; this agrees with sheet 6's 0.73 pitch, not with a 0.80 pitch. The sheet is drawn with the stud up; the model has the stud at -y and the collet at +y, so the sheet is the model upside down (same part order: stud arm, then spring, then collet).
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 08-1-1 | overall height, stud arm inner face to collet bottom face (13.4) | 13.4 (no tol; fallback +-0.1); likely | placements 050302-3 box ymin -38.85 (arm outer face) + arm 1.5; 050302-2 box ymax -24.0: 13.35 | -0.05 | match |
| 08-1-2 | stud arm inner face to top of spring (3.15) | 3.15 (extension line at the terminal curve top); likely | hsStud z_levels 1.5 -> y -37.35; page 050302-1 box ymin -34.46: 2.89 | -0.26 | mismatch |
| 08-1-3 | collet face to the spring face nearest it (0.75) | 0.75; likely | placements 050302-2 ymax -24.0; page 050302-1 box ymax -24.49: 0.49 | -0.26 | mismatch |
| 08-1-4 | spring height overall (9.5 = 13.4 - 3.15 - 0.75) | 9.5; likely | page 050302-1 size[1] 9.97: 9.97 | +0.47 | mismatch |
| 08-1-5 | stud: hole axis to square-end face (plan, 5) | 5 by scale (sheet 9 prints 5 +-0.1); likely | hsStud hole x 4.1, end x -0.8968: 4.997 | 0.00 | match |
| 08-1-6 | 1.4 dimension at the stud arm hole (attachment unclear: hole width scaled ~1.5, or the M1.4 screw) | 1.4; unsure | hsStud cylinders[0].d 1.509; studScrew cylinders[1].d 1.3817: hole 1.509 / screw 1.3817 | hole +0.109 / screw -0.018 | can't tell |
| 08-1-7 | stud hole position from the balance axis (scaled 4.1, 4.2 across, 5.87 radial) | (4.1, 4.2) from axis by scale +-0.1; unsure | hsStud cylinders[0].at [4.1,4.2], from_origin 5.8694 (placements do not show that the own origin is on the axis): (4.1,4.2) in own frame | 0.0 in own frame | can't tell |
| 08-1-8 | spring winding hand (left-hand helix; sheet 6 says links) | left; sure | page 050302-1 rays_along_Y y_of_turns: y falls 0.2 per quarter turn from x toward -z, i.e. falls going counter-clockwise seen from +y = left-hand: left-hand | none | match |
| 08-1-9 | pins 24 (two) holding the spring ends: size and shape (no sheet for item 24 in this batch) | thin vertical dashed pair in each hole; unsure | page 050302-4.c size [0.258,3.6128,0.7276]; 050302-4.s size [0.2615,2.6935,0.6757]; section loop elliptical: 0.26 x 0.73 section, 3.6 long (c); 0.26 x 0.68, 2.7 long (s) |  | can't tell |

Extras: none beyond the page pins (08-1-9): their section is elliptical (0.26 x 0.73), not a round pin; no sheet in this batch gives item 24.

## Sheet 05 03_6 Spiralfeder 05 03 02-1 (127-556.04-021)

Title block: scale 5:1 and 1:1; Bandstahl 0.52 x 0.285 poliert; Rohmass 0.52 x 0.285 x 603; 'haerten, dunkelblau anlassen'; 26.6.41.

Views: plan (circle 12.8 +-0.05 outer, 12.23 inner, 0.285 radial) and elevation of the free spring (15 turns left, 11.5 high, 0.52 strip, 0.21 gap). Finding: 15 x (0.52+0.21) + 0.52 = 11.47 = 11.5, so the sheet is self-consistent; sheet 7 then shortens the formed curve to 13 turns - 3.5 mm.
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 08-2-1 | strip width (section height) 0.52 | 0.52 (also Rohmass 0.52 x 0.285); sure | page 050302-1 rays_along_Y strip_heights 0.5201: 0.5201 | +0.0001 | match |
| 08-2-2 | strip thickness (radial) 0.285 | 0.285 (leader 0.285); sure | page 050302-1 rays_from_axis strip_thickness 0.2849: 0.2849 | -0.0001 | match |
| 08-2-3 | outer diameter of the spring 12.8 +-0.05 | 12.8 +-0.05; sure | page 050302-1 box x [-6.399,6.3988]: 12.798 | -0.002 | match |
| 08-2-4 | inner diameter of the spring 12.23 | 12.23; sure | page 050302-1 rays_from_axis hits[0] 6.1114..6.1138: 12.223-12.228 | -0.005 | match |
| 08-2-5 | coil pitch (0.52 strip + 0.21 gap) | 0.73 (0.52+0.21; 15 turns in 11.5 high); sure | page 050302-1 rays_along_Y pitch_along_Y 0.8003: 0.8003 (gap 0.280) | +0.070 | mismatch |
| 08-2-6 | turns of the raw spring: 15 left, 11.5 high (before the curve is bent, see sheet 7) | 15 turns, 11.5; sure | page 050302-1 turns_crossed 12 per ray; size[1] 9.97: 12 turns, 9.97 high | not comparable (raw blank) | can't tell |
| 08-2-7 | winding hand: Windungen links | left; sure | as 08-1-8: left-hand | none | match |

Extras: none.

## Sheet 05 03_7 Spiralkurve (So 127-556.04 / 040310)

Title block: scale 10:1; Bandstahl 0.52 x 0.285 poliert; 6.5.41, revised 30.4.43; note: vorm Biegen der Kurve auf 13 Umgaenge - 3.5 mm kuerzen; Rohmasse 12.8 aussen, 0.52 Klingenbreite, 0.285 Klingenstaerke, 15 Windungen links, 11.5 hoch.

View: plan of the curve at 10:1 with radii every ~10 deg, angles marked 0 (bottom), 90 (left), 180 (top), 270 (right), 220 deg Ansteckungspunkt. Radii read: 6.40, 6.35, 6.14 ... 5.65 (90 deg) ... 4.54, 4.31, 4.11, 3.88, 3.69, 3.52, 3.41, 3.37, 3.37, 3.37 (some figures at the edge of legibility). The sheet shows one curve; the page builds two.
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 08-3-1 | outer radius at 0 deg of the curve table (6.40 = 12.8/2) | 6.40; sure | page 050302-1 box max r 6.3988: 6.399 | -0.001 | match |
| 08-3-2 | length: 13 turns less 3.5 mm (vorm Biegen auf 13 Umgaenge - 3.5 mm kuerzen) | 13 x pi x 12.52 - 3.5 = ~508 mm; likely | page 050302-1 volume_mm3 75.1618 / (0.52 x 0.285): 507.2 mm | ~0 | match |
| 08-3-3 | curve radii by angle: 6.40 at 0, 5.65 at 90, ~4.2 at 170, 3.41-3.37 at the pin (Ansteckungspunkt 220 deg) | 26 radii; sheet angle origin vs page's not fixed; unsure | page 050302-1.png plan, read off the plot +-0.2: inner curve r 5.9 right, 5.5-5.8 bottom, 4.2 left, ~3.7 at its pin: same character | ~0.2 (plot) | can't tell |
| 08-3-4 | end of the curve at the pin: r 3.37 inner edge (centre ~3.5) | 3.37 / ~3.5; likely | page 050302-1.png: strip ends at the pin at r ~3.5-4.1 (plot): 3.5-4.1 | unsure | can't tell |
| 08-3-5 | one terminal curve on the sheet | one curve; sure | page 050302-1.png plan: two different inner curves (min r 4.2 and ~5.1): two curves |  | can't tell |

Extras: the page builds two terminal curves; the sheet gives one.

## Sheet 05 03_8 Spiralrolle 05 03 02-2

Title block: scale 10:1; Messingblech 35, DIN 1751 Ms 58; 24.2.43; general tolerance not legible.

Views: plan (wedge 3.8 wide to 2.7 wide, round bore 1.6, slit 0.2 from the wide end, cross hole 0.8/0.77 dashed) and section (3.3 high, 9.1 long, bore 1.6 H7 / 1.55 taper 1:70, hole 0.75 from a face). Note: the cross-hole dashed pair in the plan is the hole seen along its axis in the section's circle: consistent.
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 08-4-1 | outer diameter 9.1 -0.2 | 8.9..9.1; sure | hsCollet cylinders[0].d 9.0: 9.0 | -0.1 from nominal, inside | match |
| 08-4-2 | height 3.3 | 3.3 (no tol, +-0.05); sure | hsCollet size[2] 3.3: 3.3 | 0.0 | match |
| 08-4-3 | width at the slit (wide) end 3.8 -0.2 | 3.6..3.8; sure | hsCollet outlines_by_level[0.0] line end (-4.1021,+-1.85): 3.70 | -0.10 from nominal, inside | match |
| 08-4-4 | width at the other (narrow) end 2.7 -0.2 | 2.5..2.7; sure | hsCollet lines end (4.3081,+-1.3): 2.60 | -0.10 from nominal, inside | match |
| 08-4-5 | bore 1.6 H7 +0.009 | 1.6..1.609; sure | hsCollet cones[1].d[0] 1.6029 at z=0: 1.6029 | +0.003 | match |
| 08-4-6 | bore taper 1:70 (Kegel 1:70) | 1:70 on the diameter; sure | hsCollet cones[1] d 1.6029 to 1.65 over 3.3, half angle 0.4 deg: 1:70.1 | 0.0 | match |
| 08-4-7 | bore diameter at the other face (1.55), bracketed reference | (1.55): 1.6 H7 at one face, 1.55 at the other (1:70 = 0.047 over 3.3); likely | hsCollet cones[1].d[1] 1.65 (z=3.3); section_y0 r 0.825: 1.65 | +0.10 | mismatch |
| 08-4-8 | slit width 0.2 +0.1 | 0.2..0.3; sure | hsCollet slit lines y +-0.125: 0.25 | +0.05 from nominal, inside | match |
| 08-4-9 | slit end to bore 0.1 +0.05 | 0.10..0.15; likely | hsCollet slit end x -0.9507 less bore r 0.8014 (z=0), 0.825 (z=3.3): 0.149 / 0.126 | inside | match |
| 08-4-10 | cross hole axis from bore axis 3.5 -0.02 (arrow to the hole centre) | 3.48..3.5; likely | hsCollet cones[0].at[0] 3.5781: 3.578 | +0.078 (0.058 over the limit) | mismatch |
| 08-4-11 | cross hole diameter 0.8 +0.01 at the entry, (0.77) at the other, Kegel 1:90, drilled 0.7 | 0.8..0.81 tapering to 0.77; sure | hsCollet cones[0].d [0.805] (one value, no half angle): 0.805 straight | +0.035 at the narrow end; taper not built | mismatch |
| 08-4-12 | cross hole centre height 0.75 +-0.05 from a face | 0.75 +-0.05 (face unknown); likely | hsCollet cones[0].z [2.1475,2.9525], centre 2.55 (0.75 from the z=3.3 face): 0.75 | 0.0 | match |
| 08-4-13 | slit at the wide end, hole at the narrow end | slit left (wide), hole right (narrow); sure | hsCollet slit lines x -4.5..-0.95, hole at x +3.58: as drawn | none | match |
| 08-4-14 | Koerner anbringen (centre-punch mark at the hole) | a punch mark where the hole goes; sure | hsCollet: none: none |  | not built |
| 08-4-15 | plan end profile (arcs of the 9.1 round) | convex arcs at both ends; likely | hsCollet outlines arcs r 4.5 about (0,0): r 4.5 both ends | 0 | match |
| 08-4-16 | which face carries the 1.6 H7 end and the 0.75 face; hand as assembled | sheet view side cannot be fixed; unsure | hsCollet placements 050302-2 axes identity (root frame only):  |  | can't tell |

Extras: none found in the measure file (no chamfers, no countersink).

## Sheet 05 03_9 Kloetzchen 05 03 02-3

Title block: scale 5:1; Flachmessing 15 x 7, DIN 1759 Ms 58; 6.6.41, checked 27.4.43; hole 'wird bei Montage der Spirale gebohrt'.

Views: plan (rhombic arm, hole 1.5 H7, V from the point, dashed leg at the square end), side view (arm 1.6 thick, leg at 98 deg, 6.1 high, hole 0.7) and section (L, leg 1.8 g6, hole 1.5 H7, bevel at the tip). Plan and section agree (14.6, 5, 6.6 + 3.0 bevel run).
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 08-5-1 | overall length, square end to point 14.6 -0.2 | 14.4..14.6; sure | hsStud box x -0.8968..13.7: 14.597 | -0.003 | match |
| 08-5-2 | screw hole 1.5 H7 +0.009 | 1.5..1.509; sure | hsStud cylinders[0].d 1.509: 1.509 | +0.009 | match |
| 08-5-3 | hole axis to the square end 5 +-0.1 | 4.9..5.1; sure | hsStud hole x 4.1 less end -0.8968: 4.997 | -0.003 | match |
| 08-5-4 | hole axis to the V apex 6.6 -0.2 | 6.4..6.6; sure | hsStud outlines_by_level[0.0] apex (10.7,4.2) less hole x 4.1: 6.6 | 0.0 | match |
| 08-5-5 | width at the hole 3.1 -0.2 | 2.9..3.1; sure | hsStud lines (4.1,2.65)-(4.1,5.75): 3.10 | 0.0 | match |
| 08-5-6 | width at the square end 2.5 -0.2 | 2.3..2.5; likely | hsStud lines (-0.8968,2.94)-(-0.8968,5.4): 2.46 | -0.04 | match |
| 08-5-7 | arm thickness 1.6 -0.2 | 1.4..1.6; sure | hsStud z_levels [0,1.5]: 1.5 | -0.1 from nominal, inside | match |
| 08-5-8 | total height, arm outer face to leg end 6.1 -0.2 | 5.9..6.1; sure | hsStud z_levels 6.0: 6.0 | -0.1 from nominal, inside | match |
| 08-5-9 | leg width along the arm 1.8 g6 (-0.003/-0.010) | 1.790..1.797; sure | hsStud lines at z=6: x +-0.8968: 1.7936 | inside | match |
| 08-5-10 | leg angle to the arm 98 deg | 98 deg; sure | hsStud level 1.5 y 3.41..5.16, level 6.0 y 2.7776..4.5276: shift 0.6324 over 4.5: 90 + 8.0 deg | 0.0 | match |
| 08-5-11 | leg thickness 1.9 -0.2 (across the leg, side view) | 1.7..1.9; likely | hsStud level 1.5 y 3.41..5.16 = 1.75, x cos 8 deg: 1.733 | inside, near the low limit | match |
| 08-5-12 | spring hole diameter 0.7 through the leg | 0.7; sure | hsStud cylinders[1].d 0.7: 0.7 | 0.0 | match |
| 08-5-13 | spring hole distance from the leg end (scaled off the side view, no printed dimension; hole drilled at assembly) | about 0.68 centre to end; unsure | hsStud cylinders[1].at z 4.65 (leg end z 6.0): 1.35 | +0.67 | mismatch |
| 08-5-14 | spring hole across the leg (scaled): 0.56 from the lower edge | 0.56 from the low edge; unsure | hsStud cylinders[1].at y 3.4823 vs leg low edge 2.967 at that height: 0.515 | -0.05 | match |
| 08-5-15 | point rounded (a 0.8 mark at the tip; Phi or R illegible) | small rounding at the tip; unsure | hsStud level 1.5: two lines meet in a point at (13.7,4.2): sharp point |  | not built |
| 08-5-16 | bevel under the point: V apex to point (14.6-5-6.6 = 3.0) | 3.0; likely | hsStud level 0 apex x 10.7, level 1.5 point x 13.7: 3.0 | 0.0 | match |
| 08-5-17 | bevel on the face away from the leg (section: face with the leg runs to the tip) | long face with the leg; likely | hsStud z=1.5 outline to 13.7, z=0 to 10.7: as drawn |  | match |
| 08-5-18 | plan end dims 1.2 -0.1 and 1.6 -0.2 (attachment unclear) | 1.2 -0.1; 1.6 -0.2; unsure | hsStud end half widths 1.2 / 1.26:  |  | can't tell |
| 08-5-19 | hand: sheet plan seen from the arm outer face = built plan seen from -Z (tip left, leg right); leg tilt and hole offset agree | consistent; likely | hsStud leg y falls with z; hole nearer the low edge: consistent |  | match |
| 08-5-20 | stud screw (not drawn on sheet 9; sheet 5 has 1.4) | 1.4, maybe M1.4; unsure | studScrew cylinders[1].d 1.3817, head d 2.3, length 6.1: 1.3817 | -0.018 vs 1.4 | can't tell |

Extras: the stud screw (head 2.3, shank 1.3817, 6.1 long, slotted head) is not drawn on sheet 9 (sheet 5 gives 1.4 only).

## After the verdicts

Read from `TOOLS/recipes/wempe_esc.py` (collet, stud) only after the verdicts above were written.

- Collet: the bore is "1,6 H7 at the face toward the arm, (1,55) at the other, opened to the 1946 staff's seat". That is why the built other end is 1.65 (08-4-7): a deliberate choice, a departure from the sheet's (1.55) reference. The cross hole sits at `COL.HX` from the bore, taken from the plan of 05 03_5 traced at 34.5 px/mm (08-4-10, 3.578 against the printed 3.5 -0.02), and is made 1:90 from 0.805 where it enters (08-4-11: the recipe has the taper; the page's mesh, read by the measurement as one value 0.805, may not show it).
- Stud: the spring hole's height comes from sheet 5's 3.15 (`SYH - ck`), the origin of 08-5-13: the hole is placed from 05 03_5, not from sheet 9's side view, where I scaled it nearer the leg end. The sheet 9 hole is 'drilled at assembly', so its place is nominal.
- Pitch and height (08-1-4, 08-2-5): not in these recipes; the helix is built in the page's escapement code, which I did not read.
- I made no change to any verdict.

## Summary

Every row is in batch08.items.tsv.
Verdict counts: match 37, mismatch 8, can't tell 10, not built 2 (of 57).

Mismatches and not built, one line each:

- 08-1-2 (mismatch): stud arm inner face to top of spring (3.15); drawn 3.15 (extension line at the terminal curve top), built 2.89, delta -0.26.
- 08-1-3 (mismatch): collet face to the spring face nearest it (0.75); drawn 0.75, built 0.49, delta -0.26.
- 08-1-4 (mismatch): spring height overall (9.5 = 13.4 - 3.15 - 0.75); drawn 9.5, built 9.97, delta +0.47.
- 08-2-5 (mismatch): coil pitch (0.52 strip + 0.21 gap); drawn 0.73 (0.52+0.21; 15 turns in 11.5 high), built 0.8003 (gap 0.280), delta +0.070.
- 08-4-7 (mismatch): bore diameter at the other face (1.55), bracketed reference; drawn (1.55): 1.6 H7 at one face, 1.55 at the other (1:70 = 0.047 over 3.3), built 1.65, delta +0.10.
- 08-4-10 (mismatch): cross hole axis from bore axis 3.5 -0.02 (arrow to the hole centre); drawn 3.48..3.5, built 3.578, delta +0.078 (0.058 over the limit).
- 08-4-11 (mismatch): cross hole diameter 0.8 +0.01 at the entry, (0.77) at the other, Kegel 1:90, drilled 0.7; drawn 0.8..0.81 tapering to 0.77, built 0.805 straight, delta +0.035 at the narrow end; taper not built.
- 08-4-14 (not built): Koerner anbringen (centre-punch mark at the hole); drawn a punch mark where the hole goes, built none, delta .
- 08-5-13 (mismatch): spring hole distance from the leg end (scaled off the side view, no printed dimension; hole drilled at assembly); drawn about 0.68 centre to end, built 1.35, delta +0.67.
- 08-5-15 (not built): point rounded (a 0.8 mark at the tip; Phi or R illegible); drawn small rounding at the tip, built sharp point, delta .

Could not read or fix: the sheet 5 '20' dimension (illegible); what sheet 5's 9.5, 1.4 attach to (9.5 inferred from 13.4 - 3.15 - 0.75); sheet 9's 1.2 -0.1 and 1.6 -0.2 and the tip's 0.8 mark; sheet 7's angle origin against the page's, so the terminal curve is not compared by radius at an angle (the page's curve could only be read off a plot to +-0.2); which collet face carries the 1.6 H7 end; the pins (item 24 has no sheet here, and their built section is elliptical); the page's actual terminal-curve ends at the pins; placement of the stud's own origin against the balance axis.
