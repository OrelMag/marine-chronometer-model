# Batch 16: the winding keys and the box sheets (reader)

Reader: blind reading of the sheets, then the measured parts (`TOOLS/r_wpa/measure/`, `TOOLS/r_wpa/page/`). Scaled readings take their scale from a printed dimension of the same sheet; the accuracy is stated in each sheet's block. Hand: the key's spring, the tube's socket and the small hole in the body are the only asymmetric features; none is judged (listed as can't tell). Crops are in `E:/mc-video/wpa-audit/crops/` (outside the repository). Wood: the sheets give no tolerance; +-0.5 mm is used for wood parts. Items numbered 16-S-i (S the sheet's place in the batch).


## Sheet 1: 51 01_6 Aufzugschlüssel (1940 key)

Title block as read: Aufzugschlüssel, drawing 127-556.02 U 01 / 51 00 11, scale 2:1, Werkstoff blank, no surface or general tolerance legible. Dated gez. 12.12.40 (sure); a later stamp reads 1.6.43 (unsure). Parts list: 1 127-556.02-01 handle (Griff), 2 -02 body, 3 -03 shank (pipe), 4 -04 spring, 5 -05 screw. The Einheits-Chronometer's winding key, 1940 form.
Views: front view (the paddle handle as a bulbous mushroom, the cone body with its flange ring, the square shank) and a half-section beside it (paddle thickness, two slotted screw heads 5, spring 4 in the body bore, the shank 3 with its square socket drawn as crossed diagonals). Only two dimensions are printed: 84 overall and 32 for the shank below the body. Everything else is scaled (6.76 px/mm from the 84; about +-0.3 mm).
Step 2: the 84 and 32 agree with the section. The shank's square across flats is not dimensioned here. The spring is a close-wound coil in the bore.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-1-1 | overall length, paddle top to shank end (dimension 84) | 84 (sure) | key40Pipe z 0..48.7 + key40Cap z 0..35.2; stack derived from the shoulders (pipe step z 41.5 on body bore step z 9.4; cap flange on the body top): 84.1 | +0.1 | match |
| 16-1-2 | shank length below the body (32) | 32 (sure) | key40Pipe.cylinders[0] z[41.5,..] seated on key40Body.cylinders[0] (8.3 bore, z[9.4,19]): 32.1 | +0.1 | match |
| 16-1-3 | shank diameter (scaled) | 6.06 (likely) | key40Pipe.cylinders[1].d: 6.0 | -0.06 | match |
| 16-1-4 | shank end chamfer (scaled; not dimensioned) | about 0.7 x 45 deg (unsure) | key40Pipe.cones[0] d 4.6..6.0, z 0..0.7, 45 deg: 0.7 x 45 deg | - | match |
| 16-1-5 | square socket depth (scaled; X symbol) | about 29 (likely) | key40Pipe.section_y0: square to z 29.21, drill tip z 30.07: 29.21 / 30.07 | +-0.5 | match |
| 16-1-6 | square socket across flats (not dimensioned on this sheet) | not given (n/a) | key40Pipe.outlines_by_level[29.21] lines 3.15: 3.15 AF | - | can't tell |
| 16-1-7 | body cone, big-end diameter under the flange (scaled) | 18.2 (likely) | key40Body.cones[0] d[1] 17.9: 17.9 | -0.3 | match |
| 16-1-8 | body cone, small-end diameter (scaled) | 10.4 (likely) | key40Body.cones[0] d[0] 10.44: 10.44 | 0.0 | match |
| 16-1-9 | body cone height (scaled) | 19.2 (likely) | key40Body.box z 19.0: 19.0 | -0.2 | match |
| 16-1-10 | body cone half angle (scaled) | 11.5-12.3 deg (unsure) | key40Body.cones[0].half_angle_deg 11.1: 11.1 | -0.4 to -1.2 deg | match |
| 16-1-11 | flange ring diameter (scaled) | 20.6 (likely) | key40Cap.cylinders[2].d 20.5, z[2.2,5.2]: 20.5 | -0.1 | match |
| 16-1-12 | flange ring thickness (scaled) | 2.7 (likely) | key40Cap.z_levels 2.2..5.2: 3.0 | +0.3 | match |
| 16-1-13 | paddle thickness, section (scaled) | 3.1 (likely) | key40Cap.outlines_by_level[5.2] lines +-1.6: 3.2 | +0.1 | match |
| 16-1-14 | paddle width at the widest (scaled) | 34.9 (likely) | key40Cap.size[0] 34.78: 34.78 | -0.1 | match |
| 16-1-15 | paddle height above the ring (scaled) | 30.3 (likely) | key40Cap z 5.2..35.2: 30.0 | -0.3 | match |
| 16-1-16 | paddle outline, 13 width stations from the top to the ring (scaled) | 21.4/30.2/33.4/34.9/34.9/33.4/29.9/23.8/20.0/17.6/16.6/16.7/17.9 (likely) | key40Cap.section_y0 (28-point profile) interpolated at the same depths: 21.0/30.1/33.2/34.8/34.6/33.3/29.7/23.4/20.4/17.5/16.6/16.7/18.0: profile | all within 0.5 | match |
| 16-1-17 | two slotted screw heads, places across the paddle (scaled) | +-5.5 from the axis (unsure) | key40Cap.cylinders[0,1] at y -5.7 and +5.85, d 2.2 with 45 deg csk d 4.0; key40Body.cylinders[2,3] d 1.567 at the same places: -5.7 / +5.85 | +0.2 / +0.35 | match |
| 16-1-18 | spring 4 (Wendelfeder, 127-556.02-04) | drawn as a coil in the body bore (sure) | no page file for 127556.02-04: - | - | not in this version |
| 16-1-19 | screw 5 (127-556.02-05) | drawn, two slotted heads (sure) | no page file for 127556.02-05: - | - | not in this version |

## Sheet 2: 05 01_7 Chronometerschlüssel 51 00 11 / 51 01 02 (1943 key)

Title block as read: Chronometerschlüssel, 51 00 11, scale 2:1, Werkstoff blank, no general tolerance legible. gez. 16.7.43, gepr. 19.7.43, N.gepr. 21.7.43 (sure). Parts list: 6 510011-6 Kerbstift K.S. 1 x, 4 510011-4 Wendelfeder, 3 510011-3 Schlüsselrohr, 2 510011-2 Schlüsselmittelteil, 1 510011-1 Schlüsselgriff (the paddle). Note: "Linksaufzug b. Rechtsdrehung entspannt sich die Feder" (left-hand winding; turning right relaxes the spring).
Views: front view with the paddle as a circle, a half-section (paddle through the body slot, the pin across the body, the spring in the bore around the tube, the tube with its square socket drawn as crossed diagonals) and an end view of the tube's square. No dimensions printed; scale 7.17 px/mm from the body width 14.5 (printed on sheet 8). Accuracy about +-0.3 mm across, about +-1 mm along the key.
Step 2: the section shows the socket about 28 mm deep, while sheet 9 prints 19 after its revision (29 changed to 19 in 1947): sheet 7 still shows the old 29. The tube is drawn about 46 mm long from head top to end, while sheet 9 prints 50.1. That is a finding about the sheets.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-2-1 | body width (scaled; sheet 8 prints 14.5) | 14.5 (likely) | keyBody.cylinders[6].d 14.5: 14.5 | 0.0 | match |
| 16-2-2 | body length (scaled; sheet 8 prints 25.1) | 24.1-24.4 (likely) | keyBody.box z 25.1: 25.1 | +0.7 to +1.0 | match |
| 16-2-3 | paddle thickness (section) | 3.07 (likely) | keyPaddle.size[2] 3.0: 3.0 | -0.07 | match |
| 16-2-4 | paddle disc diameter (scaled) | 33.8 (likely) | keyPaddle.cylinders[1].d 34.5: 34.5 | +0.7 | match |
| 16-2-5 | paddle pin hole, distance from the disc centre (scaled) | 12.5 (unsure) | keyPaddle.cylinders[0] d 2.525 at 13.37 from the centre: 13.37 | +0.9 | can't tell |
| 16-2-6 | cross pin below the body top (scaled) | 4.1 (likely) | keyBody.cylinders[3,4] axis at z 21.1 (= 25.1 - 4.0); 510011-6 centre at y 54.1 on the key axis: 4.0 | -0.1 | match |
| 16-2-7 | cross pin length (scaled) | 15.3 (likely) | 510011-6 size 15.3 x 2.5 x 2.5: 15.3 | 0.0 | match |
| 16-2-8 | cross pin diameter (scaled) | about 2.2-2.5 (unsure) | 510011-6 size 2.5: 2.5 | - | match |
| 16-2-9 | tube head top below the body top (scaled) | 8.1 (likely) | 510011-4 / -1 frame: tube head top at tube z 50.1; body z0 at 33.0 above tube z0 -> head top at body z 17.1: 8.0 | -0.1 | match |
| 16-2-10 | tube head diameter in the body bore (scaled) | 7.8-8.0 (likely) | keyTube.cylinders[1].d 8.0: 8.0 | 0.0 | match |
| 16-2-11 | tube shank diameter (scaled) | 5.7 (likely) | keyTube.cylinders[2].d 5.95: 5.95 | +0.25 | match |
| 16-2-12 | tube protruding below the body (scaled) | 30.0 (likely) | tube z0 is 33.0 below body z0 (510011-4 frame; pin at body z 21.1 = root y 54.1): 33.0 | +3.0 | mismatch |
| 16-2-13 | overall length, tube end to paddle top (scaled) | 79.9 (likely) | 510011-1 box top at y 84.72 on the key axis (root frame, tube end 0): 84.7 | +4.8 | mismatch |
| 16-2-14 | square socket depth (scaled; sheet 9 prints 19 after rev a) | about 28 (unsure) | keyTube.section_y0 square to z 19.01, drill tip z 23.0: 19.0 | -9 (the sheet shows the pre-1947 29) | can't tell |
| 16-2-15 | spring length, coils (scaled) | 14.2 (likely) | 510011-4 box y 33.03..47.49: 14.46 | +0.26 | match |
| 16-2-16 | spring mean coil diameter (scaled) | 6.6 (likely) | 510011-4 rays: inner r 3.0..3.05, outer r 3.52..3.56 -> mean 6.5: 6.55 | -0.05 | match |
| 16-2-17 | spring hand (note: a right turn relaxes it) | left-hand winding key (sure for the text) | 510011-4 helix; the page file has sections only, no vertices: - | - | can't tell |
| 16-2-18 | stack: spring between the body shoulder and the tube head underside | shown (sure) | 510011-4 spans tube z 33.0..47.5, between the body shoulder and the head underside (47.5): consistent | - | match |

## Sheet 3: 05 01_8 Schlüsselmittelteil 05 01 02-2 (key body)

Title block as read: Schlüsselmittelteil, 05 01 02-2, scale 2:1 and 1:1, Werkstoff St. Az, Din 668 (sure). Finish: sandeln, phosphatieren, schwarz spritzen (sure). Dates: gez. 16.7.43, gepr. 19.7.43, N.gepr. 21.7.43; revision a (2x) "Bohrung 0.9 war Schlitz 0.9, neu ausgegeben", 10.4.47 and 15.7.48 (likely). No general tolerance legible; printed tolerances used.
Views: half-section of the cone body (bore 8 with the 120 deg step to 6, the slot 3, the cross hole, the 45 deg chamfer), the plan from the top with the small hole 0.9 (a), the side view (35 diameter arc, 6.3 depth) with the 3.8 / 5 deg detail at the small end, and a 1:1 outline. Printed: 8 phi +0.1, 3 H11 +0.060, 25 phi +0.05 (the cross hole, 2.5), 1.5 +0.3, 4 -0.05, 15.1 -0.2, 22 +0.2, 25.1 -0.2, 14.5 -0.2, 6 phi +0.1, 15 deg, 120 deg, 45 deg, 35 phi, 6.3 +0.1, 0.9 +0.1, 3.8 +0.1, 5 deg.
Step 2: plan, section and side agree. The 1.5 +0.3 attaches to the top chamfer (likely, not certain).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-3-1 | overall length 25.1 -0.2 | 25.1 (sure) | keyBody.box z 25.1: 25.1 | 0.0 | match |
| 16-3-2 | outer diameter 14.5 -0.2 (cylinder part) | 14.5 (sure) | keyBody.cylinders[6].d 14.5: 14.5 | 0.0 | match |
| 16-3-3 | big bore 8 phi +0.1 | 8 (sure) -> 8.0..8.1 | keyBody.cylinders[1] d 8.1, z[3.1,25.1]: 8.1 | +0.1 (at the limit) | match |
| 16-3-4 | small bore 6 phi +0.1 | 6 (sure) -> 6.0..6.1 | keyBody.cylinders[2] d 6.1, z[0,2.52]: 6.1 | +0.1 (at the limit) | match |
| 16-3-5 | bore depth 22 +0.2 (top to the 120 deg step) | 22 (sure) -> 22.0..22.2 | 25.1 - 3.1 (cylinders[1].z[0]): 22.0 | 0.0 | match |
| 16-3-6 | taper start 15.1 -0.2 (from the top) | 15.1 (sure) | 25.1 - cones[0].z[1] 10.0: 15.1 | 0.0 | match |
| 16-3-7 | taper half angle 15 deg | 15 (likely) | keyBody.cones[0].half_angle_deg 15.0: 15.0 | 0.0 | match |
| 16-3-8 | 120 deg cone at the bore step | 120 (sure) | keyBody.cones[2nd].half_angle_deg 59.9 (d 6.1..8.1, z 2.52..3.1): 119.8 | -0.2 deg | match |
| 16-3-9 | slot width 3 H11 +0.060 | 3 (sure) -> 3.00..3.06 | outlines_by_level[25.1] lines at y +-1.515: 3.03 | +0.03 | match |
| 16-3-10 | slot floor: concave arc, 35 phi | 35 (sure) | keyBody.cylinders[0].d 35.0, axis along y, at z 34.73: 35.0 | 0.0 | match |
| 16-3-11 | arc depth at the outer wall 6.3 +0.1 | 6.3 (sure) | section_y0 [7.25,18.8] -> 25.1 - 18.8: 6.3 | 0.0 | match |
| 16-3-12 | slot depth at the bore wall (scaled) | 7.4 (likely) | section_y0 [4.05,17.7] -> 25.1 - 17.7: 7.4 | 0.0 | match |
| 16-3-13 | 45 deg chamfer at the top 1.5 +0.3 | 1.5 (likely) | keyBody.cones[3rd] d 11.5..14.5, z 23.6..25.1, 45 deg: 1.5 | 0.0 | match |
| 16-3-14 | cross hole 25 phi +0.05 (2.5 +0.05) | 2.5 (sure) | keyBody.cylinders[3,4] d 2.525 (through both walls): 2.525 | +0.025 (inside the limit) | match |
| 16-3-15 | cross hole position 4 -0.05 from the top | 4 (sure) | axis at z 21.1 = 25.1 - 4.0: 4.0 | 0.0 | match |
| 16-3-16 | small hole 0.9 +0.1 (a) | 0.9 (sure) | keyBody.cylinders[5].d 0.9: 0.9 | 0.0 (at the limit) | match |
| 16-3-17 | small hole distance from the axis 3.8 +0.1 | 3.8 (likely) | cylinders[5] at y -3.84 on the bottom face: 3.84 | +0.04 | match |
| 16-3-18 | small hole inclination 5 deg | 5 (likely) | cylinders[5].axis [0,0.0872,0.9962]: 5.0 | 0.0 | match |
| 16-3-19 | small hole lean direction and angular place ("Lochstellung beliebig") | any place (sure); lean direction (unsure) | cylinders[5] at -y, leaning toward the axis going up: - | - | can't tell |

## Sheet 4: 05 01_9 Schlüsselrohr 05 01 02-3 (key tube)

Title block as read: Schlüsselrohr, 05 01 02-3, scale 2:1 and 1:1, Werkstoff Ms 58 (sure). Surface mark: three triangles. gez. 16.7.43, gepr. 19.7.43, N.gepr. 21.7.43; revision a "Maß 29 geänd. in 19", dated 29.?.47, "neu ausgegeben" 10.4.47 (likely). No general tolerance legible; printed tolerances used.
Views: one half-section of the tube (head left, taper and the square socket right) with the X symbol of the square and the 60 deg mouth countersink, and a 1:1 outline. Printed: 8 phi -0.05, 0.3 r, 5.95 -0.05, 2.6 -0.2, 50.1 -0.2, 19 +2 (+0.2), 23 +2 (+0.2), 2.5 +0.3, 1 +0.2, 60 deg, 3.1 square +0.05.
Step 2: the section's drawn bore is about 2.3 across the drill part (scaled); the square 3.1 is dimensioned only at the mouth.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-4-1 | head diameter 8 phi -0.05 | 8 (sure) -> 7.95..8.0 | keyTube.cylinders[1].d 8.0, z[47.5,50.1]: 8.0 | 0.0 | match |
| 16-4-2 | head length 2.6 -0.2 | 2.6 (sure) -> 2.4..2.6 | z_levels 47.5..50.1: 2.6 | 0.0 | match |
| 16-4-3 | overall length 50.1 -0.2 | 50.1 (sure) | keyTube.box z 50.1: 50.1 | 0.0 | match |
| 16-4-4 | shank diameter 5.95 -0.05 | 5.95 (sure) -> 5.90..5.95 | keyTube.cylinders[2].d 5.95, z[2.5,47.2]: 5.95 | 0.0 (at the limit) | match |
| 16-4-5 | head-to-shank 0.3 r (a radius) | 0.3 r (likely) | keyTube.cones[5th] d 5.95..6.55, z 47.2..47.5, 45 deg: a 0.3 chamfer, not a radius: 0.3 chamfer | form: about 0.09 at most | mismatch |
| 16-4-6 | square 3.1 square +0.05 (across flats) | 3.1 (sure) -> 3.10..3.15 | outlines_by_level[19.01] lines 3.15: 3.15 | +0.05 (at the limit) | match |
| 16-4-7 | square depth 19 +0.2 (rev a) | 19 (likely for the +0.2) | keyTube.section_y0 square to z 19.01: 19.01 | 0.0 | match |
| 16-4-8 | drill depth to the tip 23 +0.2 | 23 (likely) | section_y0 apex [0,23.0]: 23.0 | 0.0 | match |
| 16-4-9 | drill diameter behind the square (not dimensioned; scaled) | about 2.3 (unsure) | keyTube.cylinders[0].d 2.9, z[19.01,22.2]: 2.9 | +0.6 (above the scale tolerance) | mismatch |
| 16-4-10 | mouth countersink 60 deg | 60 (sure) | keyTube.cones[2nd] d 4.42 narrowing to the flats at z 1.1: half angle 30: 60 | 0.0 | match |
| 16-4-11 | countersink depth 1 +0.2 | 1 (sure) -> 1.0..1.2 | that cone z 0..1.1: 1.1 | +0.1 | match |
| 16-4-12 | tip taper length 2.5 +0.3 | 2.5 (sure) -> 2.5..2.8 | keyTube.cones[0] z 0..2.5, d 4.6..5.95 (15.1 deg half angle): 2.5 | 0.0 (at the limit) | match |
| 16-4-13 | tip end diameter (not dimensioned; scaled) | about 4.6-4.9 (unsure) | keyTube.cones[0].d[0] 4.6: 4.6 | -0.3 to 0 | match |

## Sheet 5: 51 00_1 Boden-Chronometer (the box; assembly)

Title block as read: Boden-Chronometer, drawing 127-556.A-1 / 04 52 33 36, scale 1:2, Werkstoff blank. Dated gez. 4.3.42 (from the stamp, likely). Parts list: 1 127-556.01 Überkasten, 2 .02 Holzkasten, 3 .03 Bunagehäuse, 4 .04 Werk, 5 .05 Zeigerstellung, 6 .06 Unruhhaltevorrichtung. No dimensions; no general tolerance legible. Scaled at 1:2 (3.65-3.69 px/mm in the 3x crops, calibrated on the Überkasten's 270 flange): +-2 mm along a wall.
Views: section A-B (the Überkasten with its lid open at the left, the Holzkasten in its gimbals between the pivots, the Bunagehäuse and the movement) and the plan (the Überkasten with strap, the Holzkasten with its square frame, the gimbal ring, the dial, a corner bracket with a disc and two screws at the upper right, hinge leaves and a hook at the top). The sheet is an arrangement drawing; the sizes are those of sheets 2 and 5 where those print them.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-5-1 | Holzkasten outer width (scaled; sheet 2 prints 185 +0.05) | 187 (likely) | Holzkasten.box x 185.0 / z 185.0: 185.0 | -2 (within the scale) | match |
| 16-5-2 | Holzkasten total height with its lid (scaled) | 171 +-6 (likely) | Holzkasten y -92.45..12.55 (105) + Holzkasten.D 75 = 180: 180 | +9 (outside the scale; see 6-12) | can't tell |
| 16-5-3 | Überkasten flange / body (scaled, calibration) | 270 / about 253 (likely) | Ueberkasten.box x 370, z 270; body 250: 270 / 250 | 0 / -3 | match |
| 16-5-4 | Überkasten wall and flange thickness (scaled) | 13.6 / 13.6 (likely) | Ueberkasten.rays 12.5; y_levels -124.95, -112.45: 12.5 | -1.1 | match |
| 16-5-5 | Holzkasten wall thickness (scaled) | 14.9 (unsure) | Holzkasten.rays_from_axis 80.0..92.5: 12.5 | -2.4 | can't tell |
| 16-5-6 | corner bracket (Schlüsselhalter), leg of the triangle (scaled) | about 24 (likely) | Schluesselhalter.box 59.49 x 10 x 59.49 (a corner block with a concave arc): 59.5 | +35 (2.4 times the sheet bracket) | mismatch |
| 16-5-7 | bracket disc diameter (scaled) | about 20 (likely) | Schluesselhalter.F d 19.49 (5 thick): 19.5 | -0.5 | match |
| 16-5-8 | bracket place from the box centre (scaled) | x +63..+66, z -67 (likely) | Schluesselhalter circle centre (66.0, -66.0): (66,-66) | 0..+3 | match |
| 16-5-9 | two small screws on the bracket diagonal, spacing (scaled) | 12.6 (unsure) | circles d 1.2 at (61.05,-61.05) and (70.95,-70.95): 14.0 apart: 14.0 | +1.4 | match |
| 16-5-10 | Deckelglas width (scaled, inner opening) | 156 +-4 (unsure) | Deckelglas.size 151 x 3 x 151: 151 | -5 | can't tell |
| 16-5-11 | Scharnier (hinge) of the Holzkasten, length 148 | no separate hinge shown (the plan shows the Überkasten leaves at /x/ 68..101) | Scharnier.box x +-74, 11.5 deep: 148 | - | can't tell |

## Sheet 6: 51 00_2 Griff f. Chronometerkasten 51 00 10 (handle; change of 510010)

Title block as read: Griff f. Chronometerkasten, "Änderung von 510010", scale 1:1, Werkstoff blank. gez. 14.7.42 (likely). Scale 2.38 px/mm (from the printed 185 +0.05). No general tolerance legible: wood +-0.5, the handle's metal by the fallback (+-0.15 over 30 mm).
Views: plan of the wooden side wall (panel 185 wide, 185 high, 105 up to a split line; a round screw head with "Vorbohren 4.8 für Gew. M6"; the handle as a bar 100 x 18 with two slotted end screws and a 70 x 30 oval aperture), a section (panel thickness hatched, the handle standing out, the M6 screw with its pivot pin) and an end view of the handle. Printed: 185 (+.05), 185, 105, 100, 75, 70, 18, 12, 11.5, 3.5, 5, 10, 10, 30, 3, 6, 10, 12.5, 12.5. The attachments of 12, 11.5, 5, 3.5 (the screw's place) are unclear.
Step 2: the panel's 185 vertical includes the lid part above the split line: 185 - 105 = 80 (by the plan scale about 81).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-6-1 | handle length 100 | 100 (sure) | 510010.size z 100.0: 100.0 | 0.0 | match |
| 16-6-2 | handle width 18 | 18 (sure) | 510010.size y 18.0: 18.0 | 0.0 | match |
| 16-6-3 | handle standing height 12.5 | 12.5 (likely: two 12.5 on the section) | 510010.box x 0..12.5: 12.5 | 0.0 | match |
| 16-6-4 | grip bar thickness 3 | 3 (likely) | 510010.rays 9.5..12.5: 3.0 | 0.0 | match |
| 16-6-5 | end leg thickness 6 | 6 (likely) | 510010 plan: legs x 0..6: 6.0 | 0.0 | match |
| 16-6-6 | end leg length 10 (with the screw) | 10 (likely) | 510010 legs z 40..50: 10.0 | 0.0 | match |
| 16-6-7 | distance between the end legs 80 (scaled 78.8) | 80 (likely) | 510010 legs at z +-40: 80 | 0.0 | match |
| 16-6-8 | handle height above the bottom of the box 75 | 75 (likely; scaled 71) | 510010 origin y -17.45 against the Holzkasten bottom -92.45: 75.0 | 0.0 | match |
| 16-6-9 | handle centred on the panel | centred (sure) | 510010 origin z 0; panel +-92.5: 0 | 0.0 | match |
| 16-6-10 | panel width 185 (+.05) | 185 (sure) | Holzkasten.size x 185.0: 185.0 | 0.0 | match |
| 16-6-11 | panel height to the split line 105 | 105 (sure) | Holzkasten.size y 105.0: 105.0 | 0.0 | match |
| 16-6-12 | panel total height 185 (105 + lid part 80) | 185 (sure) | Holzkasten.size y 105 + Holzkasten.D.size y 75 = 180: 180 | -5 | mismatch |
| 16-6-13 | panel thickness 12.5 | 12.5 (likely) | Holzkasten.rays 80.0..92.5: 12.5 | 0.0 | match |
| 16-6-14 | oval aperture 70 x 30 behind the handle | 70 x 30 (likely) | no aperture found in Holzkasten.sections: - | - | can't tell |
| 16-6-15 | M6 pivot screw head diameter (scaled 11.6) | 12 (likely) | screw80_3 / screw80_9 .cylinders[0].d 12.0: 12.0 | +0.4 | match |
| 16-6-16 | M6 thread (Vorbohren 4.8 für Gew. M6) | M6 (sure) | screw80_3.cylinders[1].d 5.974: 5.974 | -0.03 | match |
| 16-6-17 | M6 screw length, head top to pivot tip (scaled) | 27.9 +-1 (unsure) | screw80_3 size z 24.0 (3 o'clock); screw80_9 26.3 (9 o'clock): 24.0 / 26.3 | -3.9 / -1.6 | mismatch |
| 16-6-18 | M6 screw place: 12 / 11.5 from the edge and the split line (attachment unclear) | 12; 11.5 (unsure) | Holzkasten sections do not locate a screw: - | - | can't tell |

## Sheet 7: 51 00_3 Firmenschild (maker's plate)

Title block as read: Firmenschild, 00 01 01-9 (05 01 02-2 written beneath), scale 2:1, Werkstoff "Alu 10" (sure; the 10 is not clearly a thickness). gez. 22.3.43 (sure); Arbeitspause stamps 28.6.46 and 1. März 1947 (sure). Notes: Schildformat 26 x 52; Oberfläche weiß; Schrift vertieft schwarz; "Nummer fortlaufend" pointing to 3371.
View: the plate in plan with four corner holes, the engraved text, and a dimension for the hole offsets (1.2 and 2). No tolerance legible: fallback +-0.05..0.1.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-7-1 | plate format 26 x 52 | 26 x 52 (sure) | 000101-9.size x 52.0, y 26.0: 52 x 26 | 0.0 | match |
| 16-7-2 | plate thickness | not given (Alu 10?) | 000101-9 section z +-0.5: 1.0 | - | can't tell |
| 16-7-3 | four corner holes, count | 4 (sure) | 000101-9 plan: four holes at (+-24, +-11): 4 | 0 | match |
| 16-7-4 | hole offset from the edges 2 | 2 (sure) | hole centres 26 - 24 = 2 and 13 - 11 = 2: 2.0 | 0.0 | match |
| 16-7-5 | hole diameter 1.2 (read as "12" with the comma lost) | 1.2 (likely) | 000101-9 plan: pins about 1.2 through the holes: 1.2 | 0 | match |
| 16-7-6 | engraved text: Chronometerwerke / Wempe Hamburg / Type 3371 | shown (sure) | the page mesh is a plain plate (no text in the solid): - | - | can't tell |

## Sheet 8: 51 00_4 Zunge P. 51 00 02-2 (tongue)

Title block as read: Zunge, P. 51 0002-2, scale 2:1 and 1:1, Werkstoff Eisen 10 x 4 blank gezogen (sure). Finish: gebondert, schwarz lackiert. "nicht eingetragene Toleranz: 0,1" (sure: general tolerance +-0.1). Dated gez. 18.9.42 (likely); a later stamp 11.1.43 (unsure).
Views: side view (thickness 4 -0.1, the 6.2 phi and M3.5 holes with 0.5 x 45 deg chamfers, the 7 mm step 0.2 deep at the right end), plan (45 long, 39 from the hole centre to the tongue end, 14 hole spacing, 10 wide at the hole end, 8 at the tongue end, 6 at the hole end's radius, a taper note "2 40") and a 1:1 outline. Printed: 4 -0.1, 6.2 phi, M 3.5, 0.5, 45 deg, 7, 0.2, 10, 6, 8, 14, 39, 45, 2 40.
Step 2: the 2 40 attaches near the M3.5 hole's lower edge: it may be an angle (2 deg 40') or a distance; unclear.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-8-1 | overall length 45 | 45 (sure) | P510002-2.size y 45.0: 45.0 | 0.0 | match |
| 16-8-2 | width at the hole end 10 | 10 (sure) | P510002-2.size x 10.0: 10.0 | 0.0 | match |
| 16-8-3 | thickness 4 -0.1 | 4 (sure) -> 3.9..4.0 | P510002-2.size z 4.0: 4.0 | 0.0 | match |
| 16-8-4 | big hole 6.2 phi | 6.2 (sure) | P510002-2 plan circle r 3.1 at y 0 (read off the plan drawing): 6.2 | 0.0 | match |
| 16-8-5 | hole centre to the tongue end 39 | 39 (sure) | P510002-2 box y -39..6, the hole at 0: 39.0 | 0.0 | match |
| 16-8-6 | hole end radius (6) | R6 (likely) | top end arc radius 6.0 about the hole: 6.0 | 0.0 | match |
| 16-8-7 | M3.5 hole | M 3.5 (sure) | P510002-2 plan circle d 3.5: 3.5 | 0.0 | match |
| 16-8-8 | M3.5 hole spacing 14 | 14 (sure) | M3.5 centre at y -14: 14.0 | 0.0 | match |
| 16-8-9 | chamfer 0.5 x 45 deg at the big hole | 0.5 (likely) | plan ring r 3.6 round r 3.1: 0.5 | 0.0 | match |
| 16-8-10 | chamfer 0.5 x 45 deg at the M3.5 hole | 0.5 (likely) | P510002-2 plan: a single circle at the M3.5 hole, no ring: - | -0.5 | not built |
| 16-8-11 | end step 7 long, 0.2 deep | 7 / 0.2 (sure) | y_levels -32.0..-39; section at y -35.5 shows z 3.8: 7 / 0.2 | 0.0 | match |
| 16-8-12 | tongue-end width 8 (arrows at the end corners) | 8 (likely) | section y -35.49 x +-4.08; end-arc corners x +-4.0: 8.0 / 8.16 | +0.16 at the step | match |
| 16-8-13 | taper note 2 40 (angle or distance) | 2 40 (attachment illegible) | side edges taper 5.0 -> 4.1 over 35 mm (1.46 deg each side): 1.46 deg | - | can't tell |
| 16-8-14 | tongue-end outline: convex arc | arc (likely) | P510002-2 plan arc at y -39: arc | - | match |

## Sheet 9: 51 00_5 Überkasten (outer case; assembly)

Title block as read: Überkasten, drawing 127-556.01 / 52 00 16, nr 000403, scale 1:2, Werkstoff gebleichte Birke (sure). gez. 28.2.42 (likely). No general tolerance legible: wood +-0.5 (the brief's fallback for wood). Parts list: 1 127-556.01-01 ... 19 127-556.01-15; screws: 5 4 x 25 DIN 97, 11 3 x 15 DIN 96, 12 2.4 x 13 DIN 97; Haken u. Öse handelsüblich; "gezinkt, geleimt" at the separation line. Handwritten: 240, 250, 310, 260 struck out.
Views: section A-B (the base box with the Polster 20 thick, wall 12.5, the 12.5 flange, the Randleiste 13 high with 225 and 5, the lid 88 high with its 12.5 wall and Polster), the plan (370 over the flange, 270 body, 50 overhang, 25, 13, 5, 30 strap, 100, 32, 25 at the hinge) and a small outline at 1:5 (157, 88, 240 by hand). Scale 2.38 px/mm in the plan, 3.69 px/mm in the 3x section crops. The 60 and 80 (with "Schraube f. Riemenbef.") have attachments I cannot fix.
Step 2: plan and section agree on 270 for the flange depth (260 struck out) and 250 for the body depth.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 16-9-1 | flange length 370 | 370 (sure) | Ueberkasten.size x 370.0: 370.0 | 0.0 | match |
| 16-9-2 | flange depth 270 (the section; 260 struck out) | 270 (sure) | Ueberkasten.size z 270.0: 270.0 | 0.0 | match |
| 16-9-3 | body width 270 (plan) | 270 (sure) | Ueberkasten.D.size x 270.0: 270.0 | 0.0 | match |
| 16-9-4 | body depth 250 (handwritten) | 250 (likely) | Ueberkasten.D.size z 250.0: 250.0 | 0.0 | match |
| 16-9-5 | flange overhang 50 (x) and 10 (z) | 50 / 10 (sure) | 370 - 270 over 2 = 50; 270 - 250 over 2 = 10: 50 / 10 | 0 / 0 | match |
| 16-9-6 | base height 157 | 157 (sure) | Ueberkasten.size y 157.0: 157.0 | 0.0 | match |
| 16-9-7 | lid height 88 | 88 (sure) | Ueberkasten.D.size y 88.0: 88.0 | 0.0 | match |
| 16-9-8 | flange thickness 12.5 | 12.5 (sure) | Ueberkasten.y_levels -124.95..-112.45: 12.5 | 0.0 | match |
| 16-9-9 | wall thickness 12.5 (arrows at the wall) | 12.5 (likely) | Ueberkasten.rays 122.5..135 and 112.5..125: 12.5 | 0.0 | match |
| 16-9-10 | lid wall and top 12.5 | 12.5 (likely) | Ueberkasten.D rays 12.5; top 75.5..88: 12.5 | 0.0 | match |
| 16-9-11 | Polster thickness 20 | 20 (sure) | Polster.S, .E, .B, .D each 20.0: 20 | 0.0 | match |
| 16-9-12 | Randleiste height 13 and length 225 (section dimension) | 13 / 225 (likely) | Randleiste.size y 13.0, z 225.0: 13 / 225 | 0 / 0 | match |
| 16-9-13 | Randleiste end width 5 | 5 (likely) | Randleiste.rays 5.0: 5 | 0.0 | match |
| 16-9-14 | strap width 30 | 30 (sure) | Riemen.size z 30.0: 30 | 0.0 | match |
| 16-9-15 | strap eye diameter (scaled) | 23 (unsure) | Riemenoese.size 23 x 2 x 23: 23 | 0 | match |
| 16-9-16 | hinge length (the 100 and 32 at the top: 200 total?) | 100 + 32 (unsure what they attach to) | Scharnier.U.size x 200.0: 200 | - | can't tell |
| 16-9-17 | screw 5, 4 x 25 DIN 97 (strap screw) | 4 x 25 (sure) | screwUr.cylinders[1].d 3.977, shank z 25.0, head d 7.0 x 2.6 (a cylinder head), total 27.6: 3.977 / 25.0 / 27.6 | -0.02 / 0 / head form not countersunk | can't tell |
| 16-9-18 | screws 11 (3 x 15 DIN 96) and 12 (2.4 x 13 DIN 97), strap eyes | 3 x 15 / 2.4 x 13 (sure) | no solid in this batch: - | - | can't tell |
| 16-9-19 | "60" and "80" with "Schraube f. Riemenbef." | 60; 80 (attachment unclear) | -: - | - | can't tell |

## After the verdicts

Read only after the tables above were written; no verdict is changed.

- 05 01_9, drill Ø 2.9 (16-4-9): `tools/recipes/wempe_rest.py` `keyTube` drills Ø 2.9 with no size on the sheet (its size line has source None), so the figure is an estimate (the round hole must be under the 3.1 square). My scaled reading is about 2.3 (unsure), so the estimate and the drawn bore differ by more than the scale tolerance. The verifier should re-read the bore on an enlarged crop.
- 05 01_9, 0.3 r (16-4-5): the same recipe turns a chamfer under the head (`TurnProfile`, profile point (th, T-hl)), not a radius; the sheet's "0.3 r" is a radius.
- 05 01_7, overall and protrusion (16-2-12, 16-2-13): the sheet 7 tube is drawn shorter and its socket longer than sheet 9; the recipe follows sheet 9 (50.1, 19 after rev a). I take these as sheet-against-sheet findings, not a build error.
- 51 00_4, M3.5 chamfer (16-8-10): the Zunge page mesh draws one circle at the M3.5 hole; I did not read the page's builder.
- The box parts (Holzkasten lid 75 against 80, Schluesselhalter corner block 59.5) are page builders in `wempe/js/`, which I did not open: they stay as findings for the verifier.

## Summary

Counts (137 items): match 109, mismatch 7, not built 1, not in this version 2 (the 1940 spring and screw, no page files), can't tell 18.

Mismatches and not built, one line each:
- 16-2-12 (05 01_7): tube protrudes 33.0 below the body against about 30 scaled (sheet 7 draws the tube 4 mm short of sheet 9's 50.1). Sheet-against-sheet, unsure.
- 16-2-13 (05 01_7): overall key length 84.7 built against about 79.9 scaled; the same cause. Unsure.
- 16-4-5 (05 01_9): head-to-shank 0.3 r drawn, a 0.3 x 45 deg chamfer built (about 0.09 mm of form).
- 16-4-9 (05 01_9): drill bore behind the square built 2.9 against about 2.3 scaled (not dimensioned, unsure).
- 16-5-6 (51 00_1): Schluesselhalter corner block built 59.5 legs against a bracket about 24 mm on the sheet (likely).
- 16-6-12 (51 00_2): panel 185 high (105 + 80) against built 180 (box 105 + lid 75): 5 mm short.
- 16-6-17 (51 00_2): M6 pivot screw about 27.9 long on the sheet against 24.0 (3 o'clock) / 26.3 (9 o'clock) built (scaled, unsure).
- 16-8-10 (51 00_4): the 0.5 x 45 deg chamfer at the M3.5 hole is not built (the big hole's is).

Not in this version: 16-1-18 spring 127556.02-04 and 16-1-19 screw 127556.02-05 of the 1940 key.

Could not read or fix: the 12, 11.5, 5 and 3.5 on 51 00_2 (the screw's place); the 60 and 80 on 51 00_5; the hinge's 100 and 32; the Zunge's "2 40"; the spring's hand (the page file has no vertices); the key body's small-hole lean direction; the 70 x 30 oval aperture (not found in the Holzkasten page file); the Holzkasten's wall and lid heights on the arrangement sheet 51 00_1 (scale 1:2 too coarse); items 11 and 12 (screws) of 51 00_5 (no solid); the plate's thickness (Alu 10). Dates: sheet dates are listed per sheet; 51 01_6's later stamp (1.6.43) and 51 00_4's (11.1.43) are unsure.
