# Parts audit, batch 02 (the frame's smaller parts): reader's readings

Reader: blind reading of the sheets, then the measured parts (`TOOLS/r_wpa/measure/KEY.json`, `r_wpa/page/*.json`; field names as in the files). Item ids NN-S-i with NN = 02 and S the sheet's place in the batch. Delta = built minus drawn (mm unless stated). Tolerances: printed where legible, else the sheet's "Toleranz ±0,1" where printed, else the brief's fallback.

## Sheet 05 08_4: Unruhkloben unten, 05 08 00-2 (lower balance cock)

**Title block as read.** Zeichnung Nr 05 08 00-2, Benennung Unruhkloben unten; Werkstoff Profilmessing 20x10x8x3.3 Ms58; Maßstab 5:1 (inset M 1:1); Rohmaß Profil x18; surface mark three triangles; gez 19.4.41, gepr 29.4.41, N.gepr 5.5.41 and 21.7.43; revision (a) 1x "Toleranz war +0,05" 2.12.46 (the (a) is on the 0.5 +0.03 depth). No general tolerance legible: fallback used. Table: 23 Unruh S12,110 O9,10 stanzen 4,4 calibr 4,59 +0,012; 36 Unruhkl. Schr. unten S11,922 W0,502 Körner, bohren 2,1, M 2,6; 22 and 37 Stellstift U.Kl.unt. S6,018 O3,259 and S17,826 W4,263, Körner, bohren 1,45, calibr 1,585 -0,005 (or -0,0005; unsure).

**Views and cross-check.** Views: plan (right, 5:1, A top, B bottom, C-D horizontal through the lobe), section C-D above it, section A-B left of it, position sketch left ("Lage des Klobens nach Koordinaten", 32°30', hole numbers 22, 23, 36, 37), 1:1 inset. Plan, C-D and A-B agree: the plan's pin holes 22/37 and the M1.2 holes are drawn solid (open on the viewed face), the bore shows a solid ring (the 4.59 lip) with a dashed ring behind it (the 5.2 bore). I take the plan's viewed face as the built z=0 face (pins and lip recess), the flush face as z=10; with that the plan maps to the built part by a pure rotation (lobe on the right and on hole 22's end), so no mirror. Coordinates check: 36 to 22 and 36 to 37 are 7.00, 36 to 23 is 9.604 (built from_origin 9.6038). Finding about the sheet: in section C-D the line at the bore's flush face looks continuous across the bore (unsure), which would close it; the plan and the 4.59 lip say it is open.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-1-1 | arm length 20 (plan; arm end to end) | 20; sure | size[0] 20.0 | 0 | match |
| 02-1-2 | arm width 8.0 (section C-D) | 8.0; sure | outlines_by_level[10.0] lines len 8.0 | 0 | match |
| 02-1-3 | arm height 10 -0.1 (section C-D, both ends of the arm) | 10 -0.1 (9.9..10); sure | z_levels 0.0..10.0 | 0 | match |
| 02-1-4 | overall width 17.2 (C-D, arm edge to far side of lobe) | 17.2; sure | size[1] 17.2 (box y -13.2..4.0) | 0 | match |
| 02-1-5 | lobe thickness 3.22 -0.04 (C-D) | 3.22 -0.04; sure | z_levels 6.78..10.0 = 3.22 | 0 | match |
| 02-1-6 | lobe plan: width 10, end radius 5r, straight sides flush with the arm's end | 10 / 5r; sure | cylinders[7] d 10.0 outside arc 180; outlines_by_level[6.78] arc r 5.0 c (-5,-8.2) | 0 | match |
| 02-1-7 | lobe centre: 5 along the arm axis from hole 36, 8.2 across (9.604 from 36 by the table) | 5 / 8.2 / 9.604; sure | cylinders[0].at (-5.0003,-8.1994), from_origin 9.6038 | 0.000 | match |
| 02-1-8 | hole 36: M2.6, drill 2.1, through the arm, on the arm axis | M2.6, bohren 2.1; sure | cylinders[2].d 2.1129 z 0..10 at (0,0) | +0.013 (thread core; polygon) | match |
| 02-1-9 | pin holes 22 and 37: 7 each side of hole 36 on the arm axis | 7 and 7; sure | cylinders[3],[4].at (+-7.0002,0) | 0.000 | match |
| 02-1-10 | pin hole diameter: calibr 1.585 -0.005 (bored 1.45) | 1.585 -0.005; likely (the minus figure may be -0.0005) | cylinders[3].d 1.5825 | -0.0025 (inside -0.005; polygon reads small) | match |
| 02-1-11 | pin hole depth 2.5 (section A-B), drill point at the end | 2.5; sure | cylinders[3].z 0..2.5, cone to 2.9754 (118 deg point) | 0 | match |
| 02-1-12 | pin holes open on the face seen in the plan, same face as the lobe's lip recess | viewed face; likely | pin holes open at z=0, lip recess at z 6.78 (same side) | same side | match |
| 02-1-13 | bore for the setting 5.2 H7 (+0.012), open at the flush face | 5.2 H7 (5.200..5.212); sure | cylinders[0].d 5.206 z 7.28..10 | +0.006 (mid-tolerance) | match |
| 02-1-14 | hole 23 Unruh calibr 4.59 +0.012 (the lip's hole) | 4.59 +0.012; sure | cylinders[1].d 4.596 z 6.78..7.28 | +0.006 (mid-tolerance) | match |
| 02-1-15 | lip thickness 0.5 +0.03 (C-D, marked (a)) | 0.5 +0.03; sure | z 6.78..7.28 = 0.5 | 0 | match |
| 02-1-16 | M1.2 tapped holes (2), 3.5 +0.1 from the bore axis, through the lobe | M1.2, 3.5 +0.1; sure | cylinders[5],[6].d 0.9294 at (-5.0003,-11.7494) and (-5.0003,-4.6494) z 6.78..10 | 3.55 from the bore axis (inside 3.5..3.6); core of M1.2 | match |
| 02-1-17 | M1.2 holes lie on the C-D line through the bore centre, across the arm axis | on C-D; likely | both at x=-5.0003 (the bore's x), y=-8.1994 +-3.55 | 0 | match |
| 02-1-18 | hand: the lobe lies toward the end of pin 22 (the 5 offset is toward 22) | lobe toward 22; likely | lobe x=-5 on the side of the pin at x=-7 | none (no mirror) | match |
| 02-1-19 | seat for settings (050406-2.bl, 050408-2.bl): OD 5.2 in the 5.2 H7 bore | fit; likely | settingBL cylinders[3].d 5.2 outside; settingCL cylinders[2].d 5.2 outside | 0 to 0.012 clearance (setting tolerance not on this sheet) | match |
| 02-1-20 | setting stack height against the bore depth 2.72 (10 - 7.28) | 2.72 by derivation; likely | settingBL z -11.72..-10.19 (1.53) + settingCL -10.19..-9.0 (1.19) = 2.72; placements: stack top y -9.0 = cock flush face | 0.00 (flush) | match |
| 02-1-21 | setting screws (WN-18, two) M1.2; seat 3.55 from the bore centre | M1.2 only; sure that it is M1.2 | settingScrewL cylinders[1].d 1.1823; placements WN-18 origin (-6.1059,-9,10.2027) is 3.550 from the bore (-9.1,12.11) | -0.018 (M1.2 major 1.2; inside 6g) | match |
| 02-1-22 | setting screw length and head size (WN-18: shank 2.0, head 2.5 x 1.4) | not on the sheet | settingScrewL z 0..3.4 | n/a | can't tell |
| 02-1-23 | jewel hole stone 050407-1.bl (2.9 x 0.8) and endstone 050408-1.bl (2.9 x 0.9) | not on the sheet | page json: 050407-1.bl d 2.8956 h 0.797; 050408-1.bl d 2.8974 h 0.9 | n/a | can't tell |
| 02-1-24 | setting inner bores (3.0, 2.906, 2.4, cones) of settingBL and settingCL | not on the sheet | settingBL cylinders[0..2] | n/a | can't tell |

**Extras.** Extras (on the part, not on the sheet): none found. The drill-point cones of the pin holes are drawn on the sheet too.

**After the verdicts.** No mismatch to explain; no recipe read.

## Sheet 05 08_5: Unruhkloben oben, 05 08 03-1 (upper balance cock)

**Title block as read.** Zeichnung Nr 05 08 03-1, Benennung Unruhkloben oben; Werkstoff Profilmessing 50x15x3,3x5,5 Ms58; Maßstab 2:1 (position sketch M 4:1, inset M 1:1); Rohmaß Profil x18; note "nicht eingetr. Toleranz ±0,1" (general tolerance ±0.1 for sizes without a tolerance); gez 18.4.41, gepr 29.4.41, N.gepr 5.5.41 and 30.4.43; no revision. Table: 23 Unruh S12,110 O9,10 calibr 4,59 +0,012; 8 Unruhkl. Schr. ob. N19,765 O0,559 Körner bohren 2,8; 20 Hilfsloch f. U.Kl. ob. S2,451 O6,512 Körner 2,8; 6, 9, 50 Stellstift U.Kl.ob. N27,821 O3,577 / N11,555 O2,760 / N25,233 W6,083, bohren 1,45 2,5 tief, calibr 1,585 -0,0005.

**Views and cross-check.** Views: position sketch (left, 4:1, with 33, 40, 24.5, 10, 15°, 5/5, holes 6, 8, 9, 20, 23, 50), plan (A left foot, B right lobe, C top, D bottom), section A-B above it, section C-D (right, small), 1:1 inset. Plan and A-B agree: the foot (3.2 thick) is at the far left, the wall at 16.5 from A, the lobe 3.2 thick at the right; the plan draws the pins and the r22 and r12 arcs dashed, so the plan is the view from the z=15 face (the lobe's flat top). Built seen from +z and turned 180 deg in the plane gives the sheet (foot left, slit up), no mirror. The reading "22 ±0.1" has lost its decimal comma (scale: 22 mm, the wall's arc about the lobe centre); the "≈5,5" is the wall's width at the arc's ends. Coordinates check: 8 to 23 is 33.00, 20 to 23 is 10.00, 9 to 23 is 24.50, 6 to 23 is 40.31 (built from_origin 40.3111). Finding about the sheet: the "82°" in section C-D attaches to a slanted line at the slit's end wall; the plan gives no second view of it (unsure what it measures).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-2-1 | overall length 49 (A end to the lobe's r6 edge) | 49; sure | size[0] 49.0 (box x -6..43) | 0 | match |
| 02-2-2 | foot length 16.5 (A end to the wall) | 16.5; sure | step plane x=26.5, end x=43 | 0 | match |
| 02-2-3 | wall plane to lobe centre 26.5 | 26.5; sure | outlines_by_level[15.0] line x=26.5 | 0 | match |
| 02-2-4 | foot width at A 17 | 17; sure | outlines_by_level[0.0] line (43,-8.5)-(43,8.5) 17.0 | 0 | match |
| 02-2-5 | lobe end radius 6r, about the bore centre | 6r; sure | cylinders[10].d 12.0 outside; arc r 6.0 at (0,0) | 0 | match |
| 02-2-6 | tapered sides, straight, tangent to r6 and meeting the 17 width | straight taper; likely (not dimensioned; scale read half-width at the wall 7.3..7.4 +-0.2) | outlines_by_level[15.0] lines (43,+-8.5) to (26.5,+-7.5446) to the r6 tangent | built 7.54 at the wall (inside the scan's +-0.2) | match |
| 02-2-7 | total height 15 -0.1 | 15 -0.1; sure | z_levels 0..15.0 | 0 | match |
| 02-2-8 | foot thickness 3.2 | 3.2; sure | z_levels 0..3.2 | 0 | match |
| 02-2-9 | lobe thickness 3.2 ±0.02 | 3.2 ±0.02; sure | z_levels 11.8..15.0 | 0 | match |
| 02-2-10 | wall face: arc radius 22 ±0.1 about the lobe centre | 22 ±0.1 (decimal lost); likely | outlines_by_level[11.8] arc r 22.0 c (0,0) | 0 | match |
| 02-2-11 | wall thickness 4.5 (wall plane to the arc) | 4.5; sure | 26.5 - 22.0 | 0 | match |
| 02-2-12 | wall's width at the arc's ends ≈5.5 | ≈5.5; sure | 26.5 - 20.7838 | +0.22 (approximate dimension) | match |
| 02-2-13 | bore for the settings 5.2 H7 (+0.012) | 5.2 H7; sure | cylinders[0].d 5.206 z 12.3..15 | +0.006 | match |
| 02-2-14 | hole 23 Unruh 4.59 +0.012 (the lip's hole) | 4.59 +0.012; sure | cylinders[1].d 4.596 z 11.8..12.3 | +0.006 | match |
| 02-2-15 | lip thickness 0.5 (its tolerance illegible) | 0.5; likely | z 11.8..12.3 | 0 | match |
| 02-2-16 | boss under the lobe Ø6, standing 0.8 below the recess floor | 6 Ø; sure | outlines_by_level[11.8] arc r 3.0 at (0,0); cones[4] d 6.0..7.6 z 11.8..12.6 | 0 | match |
| 02-2-17 | recess under the arm, radius 12 about the lobe centre, depth 0.8 | 12r, 0.8; likely | outlines_by_level[11.8] arc r 12.0; floor level 12.6 | 0 | match |
| 02-2-18 | 45° chamfer at the recess rim | 45°; likely | cones[0] d 22.4..24.0 z 11.8..12.6 half 45° | 0 | match |
| 02-2-19 | hole 8 Ø2.8 through the foot, 33 from the lobe centre (10 from A) | bohren 2,8; sure | cylinders[2].d 2.8 at (32.9995,0.0001) z 0..3.2 | 0 | match |
| 02-2-20 | hole 20 Hilfsloch Ø2.8, 10 from the lobe centre on the axis, through the arm | bohren 2,8, 10; sure | cylinders[3].d 2.8 at (9.9997,-0.0001) z 12.4..15 (to the chamfer) | 0 | match |
| 02-2-21 | pin holes 6 and 50: 40.31 from the lobe centre, 5 either side of the axis, in the foot | Körner, 1,45, 2,5 tief; sure | cylinders[5],[6].at (40.0,-5.0),(40.0,5.0) from_origin 40.311, z 0.2..2.5 | 0 | match |
| 02-2-22 | pin hole 9 (in the wall), 24.5 from the lobe centre on the axis | 24.5; sure | cylinders[4].at (24.4995,-0.001), z 0.2..2.5 | 0 | match |
| 02-2-23 | pin hole diameter calibr 1.585 -0.0005 | 1.585 -0.0005 (or -0.005); likely | cylinders[4].d 1.5825 | -0.0025 (polygon reads up to 0.1% small) | match |
| 02-2-24 | pin holes: 90° mouth 0.2 deep, 2.5 deep, drill point (A-B) | 0.2, 90°, 2.5; sure | cones[1..3] d 1.5825..1.9825 z 0..0.2; z to 2.5, point to 2.9754 | 0 | match |
| 02-2-25 | slit width 1.8 H7 (+0.009), centred on the axis (0.9 each side) | 1.8 H7, 0.9; likely | outlines_by_level[15.0] slit lines x=+-0.9022, end line y=-3.4 len 1.8045 | +0.0045 (inside H7) | match |
| 02-2-26 | slit end 3.4 from the lobe centre (at the top face) | 3.4; likely | outlines_by_level[15.0] line at y=-3.4 | 0 | match |
| 02-2-27 | the 82° (section C-D) on the slit's end wall | 82°; unsure what it attaches to | slit end is y=-3.4 at z=15 and r3.8 at z=12.6 (outlines_by_level[12.6] arc r 3.8), which implies about 80.5° (no face angle in the file) | not determinable | can't tell |
| 02-2-28 | M1.2 tapped holes (2), 3.5 +0.05 from the lobe centre, M12 marked at the left one | M1.2, 3.5 +0.05; likely | cylinders[8],[9].d 0.9294 at (+-3.525,0) z 11.86..15 | 3.525 (inside 3.5..3.55) | match |
| 02-2-29 | orientation: foot at A, slit toward C (up), seen from the z=15 face | slit up with foot left; likely | slit at y=-3.4..-6 with the foot at +x: sheet = built seen from +z, turned 180° | no mirror | match |
| 02-2-30 | hole 8 clearance for the cock screw (WN-ucs, M2.6) | bohren 2,8; sure | upperCockScrew cylinders[1].d 2.5801 in a 2.8 hole | 0.22 clearance | match |
| 02-2-31 | setting stack against the bore depth 2.7 (3.2 - 0.5) | 2.7 by derivation; likely | settingBU (1.17) + settingCU (1.63) = 2.8; placements: stack y -37.45..-34.65 against the flush face y -37.35 | stack stands 0.10 proud of the face (the settings' own sheets are not in this batch) | can't tell |
| 02-2-32 | setting screws WN-55.ck (M1.2) and cock screw head sizes | not on the sheet | upperCockScrew cylinders[0].d 6.4; settingScrewU cylinders[0].d 2.5 | n/a | can't tell |
| 02-2-33 | jewel hole stone 050407-1.bu and endstone 050408-1.bu | not on the sheet | page json 050407-1.bu, 050408-1.bu | n/a | can't tell |

**Extras.** Extras: a small hole Ø1.075 (cylinders[7], 'inside') at plan (4.1,-4.2) from the lobe centre, z 12.6..15, in the lobe region: not on the sheet (that spot, turned 180 deg, lies under the M12 label and nothing is drawn there). Not built: nothing found.

**After the verdicts.** The extra Ø1.075 hole (item list: extras) has no input in `wempe/js/dims.js` or `TOOLS/recipes/` that I could find by its size; its source was not traced. No mismatch to explain.

## Sheet 05 08_7: Werkring, 05 08 00-3 (movement ring)

**Title block as read.** Zeichnung Nr 05 08 00-3 (Änderung 6.12.46), Benennung Werkring; Werkstoff blank (a line only); Maßstab 1:1; gez 2.7.41, gepr 30.7.41, N.gepr 3.4.43 (the day is hard to read); revision (a) 7x: "war 0,7 +0,05; bildl. berichtigt; 3 ±0,05 gestr.; 7 -0,1 war 7 ±0,07; 0,7 +0,1; Maß 3 +0,1 war 3; 10,7 -0,1 war 10,7 -0,05" 6.12.46, the (a) marks the changed sizes; LC. No general tolerance printed: fallback used.

**Views and cross-check.** Views: section (top, 1:1, a half-profile with dimension arrows but their extension lines are mostly missing or far from the profile) and plan with the angles. Finding about the sheet: the vertical dimensions are laid out away from the profile, so which levels "7 -0,1 (a)", "0,7 +0,1 (a)" and "2,8" span is partly a reading from arrow positions. Plan and section agree on the 1.1 hole at 6° (r 50.5), the Ø1.6 radial hole (dashed across the flange at 12 o'clock) and the Ø1 hole on the bore at 6 o'clock; the section draws the 1.1 hole as dashes at about 5.3 mm from the centre line, which is 50.5 sin 6° (a projection, not a section through it). The plan is the view from the top (dial side, rebate face): the M2.6 holes show as arcs where they cut the cone. Orientation: the three M2.6 holes at 70°, 190° and -50° (measured on the plan 69°, 189°, -50°), the dial hole at 84°, same hand as built seen from +z: no mirror.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-3-1 | flange OD 105.95 -0.1 (a) | 105.95 -0.1; sure | cylinders[12].d 105.9 outside z 6.35..11.05 | -0.05 (inside 105.85..105.95) | match |
| 02-3-2 | body OD 96 (tolerance -0.3?) | 96, tolerance unsure; likely | cylinders[13].d 96.0 outside z 0.35..6.35 | 0 | match |
| 02-3-3 | top rebate Ø104 +0.1 | 104 +0.1; sure | cylinders[0].d 104.05 inside z 10.35..11.05 | +0.05 (mid) | match |
| 02-3-4 | rebate depth 0.7 +0.1 (a) | 0.7 +0.1; likely (attachment read from arrows) | z 10.35..11.05 | 0 | match |
| 02-3-5 | cone mouth Ø93 (tolerance unclear: '+1,3' or '+0,3') | 93; likely | cones[0].d 83..93 at z 10.35 | 0 | match |
| 02-3-6 | cone angle 45° | 45°; likely | cones[0].half_angle_deg 45, 5.0 high for 5.0 radial | 0 | match |
| 02-3-7 | Ø83 +0.1 (the middle bore) | 83 +0.1; sure | cylinders[2].d 83.0 z 3.35..5.35 | 0 (at the low limit) | match |
| 02-3-8 | Ø85 H7 (+0.035) (the lip's bore) | 85 H7 (85..85.035); likely | cylinders[1].d 85.0175 z 0.35..3.35 | +0.0175 (mid) | match |
| 02-3-9 | overall height 10.7 -0.1 (a) | 10.7 -0.1; sure | size[2] 10.7 (z 0.35..11.05) | 0 | match |
| 02-3-10 | flange thickness 4.7 | 4.7; likely | z 6.35..11.05 | 0 | match |
| 02-3-11 | lip height 3 +0.1 (a) (leader to the lower lip) | 3 +0.1; likely | z 0.35..3.35 | 0 | match |
| 02-3-12 | '7 -0,1 (a)' vertical dimension (levels it spans unclear) | 7 -0.1; unsure | candidate: rebate floor 10.35 to lip top 3.35 = 7.0 | not determinable from the sheet | can't tell |
| 02-3-13 | three M2.6 on Ø89 (r 44.5) at 120° | M2.6, 89 Ø, 120°; sure | cylinders[3..5].d 2.1129 at r 44.5 | 0 | match |
| 02-3-14 | angle of the first M2.6 hole: 20° from 12 o'clock (and the 6°/20° at the top) | 20°; likely (measured 20.9° on the scan) | cylinders[5].at (15.2199,41.8163): 70.0° = 20° from vertical | 0 | match |
| 02-3-15 | M2.6 hole depth (not drawn in the section) | not drawn | cylinders[3..5].z 0.35..9.4064 (open into the cone) | n/a | can't tell |
| 02-3-16 | dial hole Ø1.1, drilled when the dial is fitted | 1.1 Ø; sure | cylinders[7].d 1.1 at (5.2787,50.2234) | 0 | match |
| 02-3-17 | dial hole radius 50.5 and angle 6° from 12 o'clock | 50.5, 6°; sure | cylinders[7].from_origin 50.5; atan(5.2787/50.2234) = 6.0° | 0 | match |
| 02-3-18 | radial hole Ø1.6 at 12 o'clock through the flange | 1.6; likely | cylinders[6].d 1.6 at x=0, +y, z 8.25 | 0 | match |
| 02-3-19 | radial hole axis 2.8 below the top face | 2.8; likely | cylinders[6] at z 8.25: 11.05 - 8.25 = 2.80 | 0 | match |
| 02-3-20 | Ø1 hole on the bore at 6 o'clock, drilled with the lower plate | 1; likely | cylinders[8].d 1.0 at (0,-42.4945) arc 250° | 0 | match |
| 02-3-21 | Ø1 hole depth (not drawn) | not drawn | cylinders[8].z 0.35..5.35 | n/a | can't tell |
| 02-3-22 | second '20°' at lower left: from the 190° hole to a line at about 210-215° (ticks across the rim) | 20°; unsure | no feature near 210° in the file | not determinable | can't tell |
| 02-3-23 | 120° spacing of the three M2.6 holes | 120°; sure | cylinders[3..5].at angles 70°, 190°, -50° | 0 | match |
| 02-3-24 | dial pin (dialPin) in the Ø1.1 hole | not on the sheet | dialPin cylinders[0].d 1.11 z 0..3.7, cylinders[1].d 0.98 z 3.7..4.8 | n/a | can't tell |
| 02-3-25 | ring screws WN-56 (M2.6, head 6.2) | not on the sheet except M2.6 | ringScrew cylinders[1].d 2.5801; placement (15.2199,0,-41.8163) on hole cylinders[5] | n/a | can't tell |

**Extras.** Extras: none found (every built hole and level is on the sheet). Tick marks near 210° on the plan (item 22) have no built feature.

**After the verdicts.** No mismatch to explain; no recipe read.

## Sheet 05 08_8: Schneckenfutter, 05 08 01-2 (fusee bush)

**Title block as read.** Zeichnung Nr 05 08 01-2, Benennung Schneckenfutter; Werkstoff Rundmessing 13,5 DIN 1758 Ms 58; Maßstab 5:1 (M 1:1 inset); gez 14.1.41, gepr 15.1.41, N.gepr 30.4.43; no revision; surface mark three triangles. No general tolerance printed: fallback used.

**Views and cross-check.** Views: half-section (top; left half silhouette with a flange lug and its stepped hole, right half hatched) and plan (below, three holes at 120° on a Ø10.4 circle). Section and plan agree. The section's top is chamfered 45° down to the bore; the r6 leader is on the upper cylinder, the g6 dimension on the lower shank. Finding about the sheet: "(7,96)" is a reference size; with the 1:70 taper over 2.9 mm and 8 r6 at the flange end the small end would be 7.98, so (7.96) is a rounded reference.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-4-1 | total height 7.1 -0.2 | 7.1 -0.2; sure | size[2] 7.0 (z 0..7.0) | -0.1 (inside 6.9..7.1) | match |
| 02-4-2 | flange thickness 1.5 -0.1 | 1.5 -0.1; sure | z_levels 2.6..4.1 | 0 | match |
| 02-4-3 | upper part above the flange 2.9 +0.2 | 2.9 +0.2; sure | z_levels 4.1..7.0 | 0 | match |
| 02-4-4 | lower shank length (derived 7.1-2.9-1.5 = 2.7) | 2.7 derived; likely | z_levels 0..2.6 | -0.1 (derived chain, inside +-0.3) | match |
| 02-4-5 | flange OD 13.2 -0.2 | 13.2 -0.2; sure | cylinders[7].d 13.1 outside z 2.6..4.1 | -0.1 (inside 13.0..13.2) | match |
| 02-4-6 | lower shank Ø8 g6 (-0.005/-0.014) | 8 g6; sure | cylinders[8].d 7.9905 z 0..2.6 | -0.0095 (inside 7.986..7.995) | match |
| 02-4-7 | upper cylinder big end Ø8 r6 (+0.028/+0.019) | 8 r6; likely (leader to the upper part) | cones[0].d 8.0235 at the flange (section_y0 r 4.0118) | +0.0235 (inside 8.019..8.028) | match |
| 02-4-8 | taper 1:70 on the upper cylinder | 1:70; sure | cones[0].d 7.9821..8.0235 over 2.9 = 1:70.0, half angle 0.4° | 0 | match |
| 02-4-9 | (7.96) reference small end | (7.96); sure | cones[0].d 7.9821 at z 7.0 | +0.022 (reference size; fallback +-0.1) | match |
| 02-4-10 | bore Ø4.1 +0.2 | 4.1 +0.2 (4.1..4.3); sure (scaled 4.05 on the drawing) | cylinders[0].d 4.52 inside z 0..5.76 | +0.42 (0.22 above the limit) | mismatch |
| 02-4-11 | top chamfer Ø7 ±0.1 at the face | 7 ±0.1; sure | cones[1].d 4.52..7.0 at z 7.0 | 0 | match |
| 02-4-12 | chamfer angle 45° | 45°; sure | cones[1].half_angle_deg 45 | 0 | match |
| 02-4-13 | bolt circle Ø10.4 ±0.05 for the three holes | 10.4 ±0.05; sure | cylinders[1..3].from_origin 5.2 | 0 | match |
| 02-4-14 | three holes at 120° | 120°; sure | cylinders[1..3].at angles 270°, 30°, 150° | 0 (turn about the axis is not datumed on the sheet) | match |
| 02-4-15 | counterbore Ø2.2 H8 (+0.014) | 2.2 H8; sure | cylinders[1..3].d 2.207 z 3.6..4.1 | +0.007 | match |
| 02-4-16 | counterbore depth 0.5 +0.05 | 0.5 +0.05; sure | z 3.6..4.1 | 0 | match |
| 02-4-17 | hole Ø1.5 +0.1 through the rest of the flange | 1.5 +0.1; sure | cylinders[4..6].d 1.55 z 2.6..3.6 | +0.05 | match |
| 02-4-18 | counterbore on the flange's upper face (the face the cone side is on) | upper face; likely | counterbore on the z=4.1 face, the same side as the z 4.1..7 cone | none | match |
| 02-4-19 | small edge breaks at the outer top and bottom corners | drawn, size not printed (about 0.1..0.15); unsure | no edge cone on the outside (cones[0] is the taper) | not determinable | not built |

**Extras.** Extras: none found.

**After the verdicts.** `TOOLS/recipes/wempe.py` fuseeBush: the bore is `2*Q['r']` = 4.52 on purpose, noted in the recipe as "the sheet's 4.1 +0.2 opened to the arbor's 4.5 (README, Unresolved)", so 02-4-10 is a known departure, not a slip. The edge breaks (02-4-19) have no operation in the recipe.

## Sheet 05 08_9: Staubfutter, 05 08 01-3 (dust bush)

**Title block as read.** Zeichnung Nr 05 08 01-3, Benennung Staubfutter; Werkstoff Rundmessing 15 DIN 1758 Ms58; Maßstab 5:1 (M 1:1 inset); gez 2.7.42, gepr 4.?.42 (unclear), N.gepr 30.4.43; no revision; surface mark. No general tolerance printed: fallback used.

**Views and cross-check.** Views: half-section (left half silhouette, right half hatched, centre on the bore's axis) and plan (flange Ø15.1 with one flat at the left, a hidden Ø13.1 body circle and the bore). Section and plan agree: the plan's flat is tangent to the body (6.55 from the axis: width 14.1) and the dashed ring is the body below the flange. In the section the outer silhouette is straight at Ø13.1 from the flange's underside to the foot (11.8 mm, a 5° conical end face and a 0.5 chamfer), no neck. The vertical dimensions: 18.1 and 15.1 on the right are from the foot; 3.1 spans the flange (measured 3.06), 1.8 the 20° entry cone. 13.1 -0.2 with horizontal arrows is the body's diameter. Finding about the sheet: "(7,62)" (the bore at the top of the 20° cone) does not fit 8 H7 with Kegel 1:70 over 16.3 mm (that gives 7.77); the drawn wall lines open by about 0.38, which agrees with (7.62).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-5-1 | total height 18.1 -0.2 | 18.1 -0.2; sure | size[2] 18.1 | 0 | match |
| 02-5-2 | flange's top face 15.1 -0.2 above the foot | 15.1 -0.2; sure | z_levels 15.1 | 0 | match |
| 02-5-3 | top boss height (18.1 - 15.1) | 3.0 derived; likely | z_levels 15.1..18.1 | 0 | match |
| 02-5-4 | flange thickness 3.1 -0.2 (arrows span the flange; measured 3.06) | 3.1 -0.2 (2.9..3.1); sure | cylinders[0].z 13.0..15.1 = 2.1 | -1.0 (0.8 under the lower limit) | mismatch |
| 02-5-5 | top boss Ø9.7 -0.2 | 9.7 -0.2; sure | cylinders[3].d 9.6 outside z 15.1..18.1 | -0.1 (inside 9.5..9.7) | match |
| 02-5-6 | flange Ø15.1 -0.2 | 15.1 -0.2; sure | cylinders[0].d 15.0 outside, arc 300° | -0.1 (inside 14.9..15.1) | match |
| 02-5-7 | flat on the flange, width across 14.1 -0.2 | 14.1 -0.2; sure | outlines_by_level[13.0] line (5.3101,5.2965)-(7.2469,-1.9318): chord 6.5 from the axis, 7.5+6.5 = 14.0 | -0.1 (inside 13.9..14.1) | match |
| 02-5-8 | body Ø13.1 -0.2 (horizontal arrows at the foot) | 13.1 -0.2; sure | cylinders[1].d 13.0 outside z 0.3..5.4 | -0.1 (inside 12.9..13.1) | match |
| 02-5-9 | body straight at Ø13.1 from the flange's underside down to the foot | straight, no neck; sure | cones[0] 45° step Ø13.0 to Ø10.5 at z 5.4..6.7, cylinders[2].d 10.5 neck z 6.7..13.0 | neck Ø10.5 over 6.3 mm (Ø13.0 only to z 5.4) where the sheet is Ø13.1 throughout | mismatch |
| 02-5-10 | bore Ø8 H7 (+0.015) at the foot | 8 H7; sure | cones[2].d 8.0054 at z 0.1484 | +0.0054 (inside) | match |
| 02-5-11 | bore taper Kegel 1:70 | 1:70; sure | cones[2].d 8.0054..7.7746 over 16.15 = 1:70, half angle 0.4° | 0 | match |
| 02-5-12 | (7.62) reference: bore at the top of the 20° cone | (7.62); likely | cones[2].d 7.7746 at z 16.3 | +0.155 (reference; fallback +-0.1; the sheet's own 1:70 gives 7.77) | mismatch |
| 02-5-13 | 20° entry cone at the top | 20°; sure | cones[1].half_angle_deg 20, d 7.7746..9.0849 | 0 | match |
| 02-5-14 | entry cone depth 1.8 +0.2 | 1.8 +0.2; sure | cones[1].z 16.3..18.1 | 0 | match |
| 02-5-15 | foot's end face conical, 5° | 5°; likely | cones[4].half_angle_deg 85 (5° slope) d 8.0054..11.4, 0.1484 high | 0 (extent past Ø11.4 not readable) | match |
| 02-5-16 | outer chamfer at the foot 0.5 | 0.5; likely | cones[3].d 12.4..13.0 z 0..0.3 (0.3 x 45°) | -0.2 | mismatch |
| 02-5-17 | small rounds at the flange's outer edges and the boss's top edge | drawn, not dimensioned (about 0.2); unsure | none in the file | not determinable | not built |

**Extras.** Extras: the Ø10.5 neck and its 45° step (item 9) are not on the sheet.

**After the verdicts.** `wempe.py` dustBush is titled "05 08 01-3 (2.7.42), waisted as the assembly 05 08 01 (2.11.46) draws it": the Ø10.5 neck (`DB.last` = [5.4, 6.7, 5.25, 13.0]) comes from a later assembly sheet, not from this one, which explains 02-5-9 and, with the collar standing on the waist's top at z 13.0, the 2.1 flange of 02-5-4 (this sheet's 3.1 would put it at 12.0). The foot chamfer is `DB.ch` = 0.3, noted "scaled, not figured (estimated)"; I read a printed 0.5 with arrows at the foot (02-5-16), so either the recipe's note or my reading is wrong. The bore's taper is 1:70 on the diameter (`DB.taper` 140 on the radius) from 8.0075 at the foot, which gives 7.7746 at the cone's foot, not (7.62) (02-5-12).

## Sheet 05 08_11: Pfeiler, 05 08 00-1 (pillar)

**Title block as read.** Zeichnung Nr 05 08 00-1, Benennung Pfeiler; Werkstoff Rundmessing 8,5 DIN 1758 Ms 58 (the word "hart" struck out); Maßstab 5:1 (M 1:1 inset); gez 2.6.40, gepr 16.8.40, N.gepr 30.4.43; no revision. Notes: "Gewinde von beiden Seiten einschneiden" (thread cut from both sides), "wie oben" (the lower end as the upper). No general tolerance printed: fallback used.

**Views and cross-check.** One half-section (left silhouette with dashed M2.6 thread lines, right hatched) and an inset. The lower end is "wie oben". The dimension arrows at the upper spigot use the narrow style (arrows outside the extension lines pointing in): "1,4 -0,2" spans from the dotted level at the taper's foot to the shoulder (the cylindrical part, measured 1.24), so the taper is 1.4 (measured 1.54). A small relief groove is drawn in the shoulder face next to the spigot (an oval at about r 2.5..3.5 from the axis, depth about 0.4).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-6-1 | body Ø8.1 -0.2 | 8.1 -0.2; sure | cylinders[1].d 8.0 z 2.8..22.4 | -0.1 (inside 7.9..8.1) | match |
| 02-6-2 | body length 19.6 ±0.04 (between shoulders) | 19.6 ±0.04; sure | z_levels 2.8..22.4 | 0.00 | match |
| 02-6-3 | spigot length 2.8 -0.1 each end | 2.8 -0.1; sure | z_levels 22.4..25.2 and 0..2.8 | 0 | match |
| 02-6-4 | overall length 25.3 -0.2 | 25.3 -0.2; sure | size[2] 25.2 | -0.1 (inside 25.1..25.3) | match |
| 02-6-5 | spigot Ø4.5 f7 (-0.010/-0.022) | 4.5 f7 (4.478..4.490); sure | cylinders[2],[3].d 4.484 | -0.016 from nominal (mid f7) | match |
| 02-6-6 | spigot end Ø4.3 -0.2 | 4.3 -0.2; sure | cones[0].d 4.2528 at z 25.2 | -0.0472 (inside 4.1..4.3) | match |
| 02-6-7 | taper angle 5° | 5°; sure | cones[0],[1].half_angle_deg 6.0 | +1.0° | mismatch |
| 02-6-8 | cylindrical part of the spigot 1.4 -0.2 (the taper is the rest) | 1.4 -0.2; likely (narrow arrows, measured 1.24) | cylinders[2].z 22.4..24.1 = 1.7; cones[0].z 24.1..25.2 = 1.1 | +0.3 (cylinder), -0.3 (taper) | mismatch |
| 02-6-9 | M2.6 thread through the pillar, cut from both ends | M2.6; sure | cylinders[0].d 2.1129 z 0.01..25.19 through | +0.013 (core) | match |
| 02-6-10 | 90° countersink at each end of the hole | 90°; sure | cones[2],[3].half_angle_deg 45 | 0 | match |
| 02-6-11 | countersink width at the face (scaled; not printed) | about Ø2.9; unsure (+-0.15) | cones[2].d 2.6..2.62 at the face | -0.3 (scaled) | mismatch |
| 02-6-12 | relief groove in the shoulder face around the spigot | oval groove r 2.5..3.5, depth about 0.4; unsure | outlines_by_level[22.4] only a vertex at r 3.25 on the shoulder level, no groove in section_y0 | not built (size not printed) | not built |
| 02-6-13 | both ends alike ('wie oben') | alike; sure | symmetric about z=12.6: z_levels 0, 0.01, 2.8, 22.4, 25.19, 25.2 | 0 | match |

**Extras.** Extras: none found.

**After the verdicts.** `dims.js` `PIL` and `wempe.py` pillar: the spigot is Ø4.484, 1.1 long at 6° (`tip`), "the three figures over-determine", the lead read as 1.1 -0.2; my reading is 1.4 -0.2 for the cylinder and 5°, which with Ø4.5 gives the same end Ø4.255, so both triples fit the end diameter and only the angle and split differ (02-6-7, 02-6-8). The countersink is Ø2.6 at the face, "2.59 scaled at 5:1" (my scaling was about Ø2.9; 02-6-11). The relief groove IS in the recipe (`grv` [3.25, 0.35], half-round, "estimated"), but the measured section shows only a vertex at r 3.25: either the exact solid's groove is not in `section_y0`/`outlines_by_level`, or it is missing; I did not settle which (02-6-12 stays as read).

## Sheet 05 08_13: Federhausbrücke, 05 08 05-1 (barrel bridge)

**Title block as read.** Zeichnung Nr 05 08 05-1, Benennung Federhausbrücke; Werkstoff Messing blech 3,5 DIN 1751 Ms 58; Maßstab 2:1 (M 1:1 inset); "nicht eingetr. Toleranz ±0,1"; gez 19.4.41, gepr 29.4.41, N.gepr 5.5.41 and 31.4.43 (as read); no revision; note "mit der Oberplatte überdrehen" (the outer arc is turned with the top plate). Table: 45 Federhaus N6,0 W24,784 stanzen 3,7 calibr 3,9 ±0,01; 46 Sperrkegel N17,046 W29,474 Körner bohren 2,1 M2,6; 42 and 48 Federhausbr. Schr. S18,50 W32,043 / N32,668 W17,370 Körner bohren 2,8; 41 and 47 Stellstift Federh. Br. S24,01 W30,732 / N31,551 W22,924 Körner bohren 1,45 2,5 tief, calibr 1,585.

**Views and cross-check.** Views: position sketch (left, N up, W left, with 62°, 54°, 30°, 38°, 37r, 42.5r, 39r, 12), plan (centre-right, with 5, 7, 7.7, 24, 73.5, 150°), thin side view (3.32 -0.04, with the countersink 0.3 and 90° on the lower pin hole and 2.5 deep) and an inset. They agree. Convention: the side view to the right of the plan, with the pin countersink on its left face, is read as the DIN first-angle view from the left, so the countersink face is the one away from the plan's viewer (the same convention under which sheet 05 08_4's pins fit); built has the chamfers at z=0, the far face from +z, where the sheet's plan is seen from +z (W left, N up with x = E, y = N): matches, but this rests on the projection convention (unsure). The built frame is the sheet's (x = E, y = N); the page's placement of the part is a proper rotation of it (WN-55 at (32.043, 18.5) in the world is hole 42, W32.043 S18.5). The angles are measured at the movement centre.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-7-1 | thickness 3.32 -0.04 | 3.32 -0.04 (3.28..3.32); likely | z_levels 0..3.3 | -0.02 (inside) | match |
| 02-7-2 | hole 45 Federhaus Ø3.9 ±0.01 at N6.0 W24.784 | 3.9 ±0.01; sure | cylinders[0].d 3.9 at (-24.784,6.0) | 0 | match |
| 02-7-3 | hole 46 Sperrkegel M2.6 (drill 2.1) at N17.046 W29.474 | M2.6 / 2.1; sure | cylinders[3].d 2.1129 at (-29.474,17.046) | +0.013 (core) | match |
| 02-7-4 | hole 42 Ø2.8 at S18.50 W32.043 | 2.8; sure | cylinders[1].d 2.8 at (-32.043,-18.5) | 0 | match |
| 02-7-5 | hole 48 Ø2.8 at N32.668 W17.370 | 2.8; sure | cylinders[2].d 2.8 at (-17.37,32.668) | 0 | match |
| 02-7-6 | pin hole 41 Ø1.585 (drill 1.45) at S24.01 W30.732, 2.5 deep | 1.585, 2.5; sure | cylinders[4].d 1.5825 at (-30.732,-24.01) z 0.3..2.5 + point to 2.9754 | -0.0025 (polygon) | match |
| 02-7-7 | pin hole 47 Ø1.585 at N31.551 W22.924, 2.5 deep | 1.585, 2.5; sure | cylinders[5].d 1.5825 at (-22.924,31.551) | -0.0025 (polygon) | match |
| 02-7-8 | countersink 0.3 deep, 90° on the pin holes | 0.3, 90°; likely | cones[0],[1].d 1.5825..2.1825 z 0..0.3, half angle 45 | 0 | match |
| 02-7-9 | pin holes enter from the face away from the plan's viewer (first-angle reading) | left face of the side view; unsure (depends on the projection convention) | chamfers and holes at z=0, plan seen from +z | consistent | match |
| 02-7-10 | outer arc r42.5 about the movement centre | 42.5r; sure | cylinders[6].d 84.989 outside, outlines_by_level[0.0] arc r 42.4945 at (0,0), 119.8° | -0.0055 | match |
| 02-7-11 | screw holes 42 and 48 on a circle r37 | 37r; sure | cylinders[1],[2].from_origin 37.0001 and 36.9989 | 0 | match |
| 02-7-12 | pin holes on r39 | 39r; sure | cylinders[4],[5].from_origin 38.9992, 38.9997 | -0.001 | match |
| 02-7-13 | angles 62° (hole 48), 54° (hole 47), 30° (hole 42), 38° (hole 41) from the W axis | 62, 54, 30, 38; sure | atan2 of the hole centres in cylinders[]: 61.99°, 54.00°, 30.00°, 38.00° | 0 | match |
| 02-7-14 | width 24 (outer arc's farthest point to the straight edge) | 24; sure | 42.4945 - 18.49 = 24.00 (edge distance from the origin by the outline lines) | 0 | match |
| 02-7-15 | hole 45 to the straight edge 7 | 7; sure | 7.00 (cross product with the edge line) | 0 | match |
| 02-7-16 | hole 42 to the straight edge 7.7 | 7.7; sure | 7.70 | 0 | match |
| 02-7-17 | hole 48 to the upper end line 5 | 5; sure | 5.00 | 0 | match |
| 02-7-18 | corner angle 150° (upper end) | 150°; sure | angle between the end line and the straight edge 150.0° | 0 | match |
| 02-7-19 | holes 45 and 46 apart 12 | 12; sure | 12.00 | 0 | match |
| 02-7-20 | straight edge's chord 73.5 (arrows parallel to the edge, from the upper arc corner to the lower tip) | 73.5; sure | projection of (-14.1814,40.0583)-(-27.7282,-32.2014) on the edge = 73.31 (corner to corner 73.52) | -0.19 (limit +-0.1) | mismatch |
| 02-7-21 | bridge screws WN-55 (M2.6) through Ø2.8 holes | not on the sheet | bridgeScrew cylinders[1].d 2.5801; placement (32.043,-25.65,18.5) on hole 42 | n/a | can't tell |

**Extras.** Extras: none found.

**After the verdicts.** The 73.5 (02-7-20) is not an input I found in `dims.js`; the bridge is built from the table's coordinates and the other dimensions, which agree to 0.01.

## Sheet 05 08_14: Sperrkegel, 05 08 05-2 (click)

**Title block as read.** Zeichnung Nr 05 08 05-2, Benennung Sperrkegel; Werkstoff Messingblech 3 DIN 1751 Ms 58 federhart; Maßstab 5:1 (M 1:1 inset); "nicht eingetr. Toleranz ±0,1"; gez 20.9.41, gepr 10.10.41, N.gepr 30.4.43; revision (a) 1x "Änderung vom 25.5.48" (the (a) is on the 3.2 Ø); LC.

**Views and cross-check.** Views: plan (outline with the bore, a thin circle about it) and a side view (2.6 thick, 3.2 Ø). They agree. In the plan the arc of radius 6 about the small centre (5.142 left and 7.212 below the bore) makes a hill that meets the left face at its foot; the left face leans 5° from vertical (the 85° dimension is the angle to the baseline, read from the arc about the corner). A thin circle of about Ø5.7 around the bore is dimensioned (5,7 with a radial arrow) but has no depth view. Finding about the sheet: 17.4 overall is not consistent with its own 9.7, 7.5 and 1r (they give 17.53).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 02-8-1 | thickness 2.6 -0.03/-0.05 | 2.6 -0.03/-0.05 (2.55..2.57); sure | z_levels 0..2.56 | -0.04 (inside) | match |
| 02-8-2 | bore Ø3.2 +0.03 (a) | 3.2 +0.03; sure | cylinders[1].d 3.215 | +0.015 | match |
| 02-8-3 | left face height 3.5 | 3.5; sure | outlines_by_level[0.0] line (-8.9556,0.65)-(-9.2618,-2.85) | 0.00 | match |
| 02-8-4 | left face lean: 85° to the baseline | 85°; likely | atan(3.5/0.3062) = 85.0° from that line | 0 | match |
| 02-8-5 | top arc 12.5r (centre about 1.45 left, 9.35 below the bore) | 12.5r; sure (centre scaled -1.46,-9.46) | cylinders[2].d 25.0 outside, at (-1.4519,-9.3472), 86.2° | 0 (centre inside the scan) | match |
| 02-8-6 | hill arc 6r about a centre 5.142 left and 7.212 below the bore | 6r, 5.142, 7.212; sure | cylinders[0].d 12.0 inside at (-5.142,-7.212) | 0.000 | match |
| 02-8-7 | left bottom corner 9.7 from the bore centre | 9.7; sure | hypot(9.2618,2.85) = 9.69 | -0.01 | match |
| 02-8-8 | nose centre 7.5 from the bore centre | 7.5; sure | hypot(7.2683,1.85) = 7.50 | 0 | match |
| 02-8-9 | nose radius 1r | 1r; sure | cylinders[3].d 2.0 outside at (7.2683,-1.85) | 0 | match |
| 02-8-10 | overall length 17.4 (left corner to nose end) | 17.4; sure | size[0] 17.5301 (box x -9.2618..8.2683) | +0.13 (limit +-0.1; the sheet's 9.7, 7.5, 1r give 17.53) | mismatch |
| 02-8-11 | baseline 2.85 below the bore centre (nose tangent to it) | 2.85 (scaled 2.9); likely | outlines_by_level[0.0] line y=-2.85 from x -1.0222 to 7.2683 | 0 | match |
| 02-8-12 | thin circle about the bore, about Ø5.7 | 5,7 (a thin circle); unsure | no feature (clickScrew head is 4.5, shoulder 3.19) | not determinable | can't tell |
| 02-8-13 | plan hand: nose at right, hill at lower left, baseline down | as sheet; likely | built seen from +z agrees (the click is the same on both faces) | no mirror | match |

**Extras.** Extras: none found.

**After the verdicts.** `wempe.py` click: `CLICK.d` 5.7 puts the baseline 2.85 below the bore, so the thin Ø5.7 circle (02-8-12) is the construction circle tangent to the baseline (a reading I could not make from the sheet alone); the 17.4 is not an input, and the outline closes at 17.53 from 9.7, 7.5 and 1r (02-8-10).

## Summary

Counts: 165 items: 137 match, 10 mismatch, 3 not built, 15 can't tell.

**Mismatches** (drawn against built):
- 02-4-10 fusee bush: bore Ø4.1 +0.2 drawn, 4.52 built (+0.42, 0.22 over the limit).
- 02-5-4 dust bush: flange 3.1 -0.2 thick drawn, 2.1 built (-1.0).
- 02-5-9 dust bush: body drawn straight at Ø13.1 from the flange to the foot; built has a Ø10.5 neck over 6.3 mm and the Ø13 only to z 5.4.
- 02-5-12 dust bush: reference (7.62) at the top of the entry cone; built 7.7746 (+0.155; the sheet's own 1:70 gives 7.77, so the sheet disagrees with itself).
- 02-5-16 dust bush: 0.5 chamfer at the foot drawn, 0.3 x 45° built.
- 02-6-7 pillar: spigot taper 5° drawn, 6.0° built.
- 02-6-8 pillar: cylindrical part of the spigot 1.4 -0.2 drawn (taper 1.4), 1.7 and 1.1 built.
- 02-6-11 pillar: 90° countersink about Ø2.9 at the face (scaled), Ø2.6 built (unsure, scaled).
- 02-7-20 barrel bridge: 73.5 along the straight edge drawn, 73.31 built (-0.19, limit ±0.1; every other dimension on that sheet agrees to 0.01).
- 02-8-10 click: overall length 17.4 drawn, 17.53 built (+0.13; the sheet's own 9.7, 7.5 and 1r give 17.53).

**Not built:** 02-4-19 (fusee bush, small edge breaks, unsure), 02-5-17 (dust bush, small rounds, unsure), 02-6-12 (pillar, relief groove at the shoulder, unsure).

**Extra on the part:** Ø1.075 hole at plan (4.1,-4.2) in the upper cock's lobe (not on sheet 05 08_5).

**Could not read or settle:**
- the "82°" in section C-D of 05 08_5 (what it attaches to; the built slit end wall implies about 80.5°);
- the vertical dimension "7 -0,1 (a)" on the ring's section, the second "20°" at its lower left (ticks near 210°) and the tolerance after "93 Ø";
- the thin Ø5.7 circle on the click;
- the upper setting stack (2.8) is 0.1 proud of the cock's 2.7-deep bore (the settings' own sheets are not in this batch);
- the setting screws, jewels, dial pin and ring screws are not drawn on these sheets;
- whether section C-D of 05 08_4 closes the bore at the flush face (the plan and the lip say open);
- the projection convention behind the pin-hole face of the barrel bridge (item 02-7-9).

The page-line files for 050407-1.bl, 050408-1.bl, 050407-1.bu and 050408-1.bu were present; they are covered by items 02-1-23 and 02-2-33 (not on the sheets).

