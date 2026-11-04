# Batch 12: the barrel (reader)

Blind reading. Sheet scans are (c) Altmeppen and not copied; crops are in E:/mc-video/wpa-audit/crops/.

Frames: the drum, lid, ratchet and arbor measure files have Z as the turning axis, Z = world +y (dial side up); the plan from +Z is the dial-side view (x, -z). The drum floor is on the +y side, its open end (lid) on the -y side; the barrel axis is at (24.784, -6) (placements 050701-1). The sheet 05 07_1 draws the ball end at its "Unterplatte" and the square end through the "Federhausbruecke"; in the model the square end passes through the barrel bridge 050805-1 (y -25.65..-22.35) and the ball end through the top plate side, so the two agree on which end is which.

## Sheet 05 07_1: Federhaus kompl. (asm, 127-556.04 U24 / 0207)

**Title block:** date 13.4.41; gez. 13.4.41; Massstab 5:1; no Werkstoff; Arbeitspause 12; LC; list 103 (127-556.04 U23), 104 (U22), 105 (OZ), 106 (127-556.04-097)

**Views:** Section of the barrel between Unterplatte and Federhausbruecke; plan with the lid off. Notes "warm einsprengen", "Lagerstellen Enger Lautsitz", "Schlitz fuer Kette erst bei Schneckenmontage einsetzen". This is the 1941 first design: spring space 15.8 +-0.1, drum 41.5, floor 1.2, lid 1.

**Step 2 (views against each other):** The 1941 sheet and the later 06/07 (revised 1947/48) disagree: 41.5 against 41.6 -0.1, 15.8 against 15.65, lid 1 against 1.3, right gap 2.9 against the lid's 3.3 boss. The model follows the 1948 drum and lid.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-1-1 | barrel OD, plan (1941 sheet) | 41.5 dia (06 later: 41.6 -0.1); likely | drum.cylinders[3].d: 41.6 | +0.1 vs 41.5; inside 06 (41.5..41.6) | match |
| 12-1-2 | drum bore (plan) 38.5 | 38.5 dia; sure | drum.cylinders[0].d: 38.5 | 0 | match |
| 12-1-3 | lid seat dia (plan) 39.2 | 39.2 dia; likely | drum.cones[0].d: 39.2 at the rim to 39.39 | 0 | match |
| 12-1-4 | wall radial 1.5 (outer circle to bore) | 1.5; likely | (drum.cylinders[3].d - cylinders[0].d)/2: 1.55 | +0.05 | match |
| 12-1-5 | arbor body dia in plan | 13.3 dia; sure | barrelArbor.cylinders[1].d: 13.3 | 0 | match |
| 12-1-6 | spring space between floor and lid, "Zugfeder 15 / 15,8+-0,1" | 15.8 +-0.1 (1941 sheet); sure | drum.z_levels -4.9 (floor in) to lid.z_levels -20.53 (lid in): 15.63 | -0.17 (0.07 outside 15.7..15.9); later sheets 06/07 give 15.65 | mismatch |
| 12-1-7 | spring width "Zugfeder 15" | 15 (strip width); likely | 050700-6.json size[1]: 15.0 | 0 | match |
| 12-1-8 | strip thickness and coil pitch | not given on this sheet; sure | 050700-6 rays strip_thickness 0.360, coil_pitch 0.37: 0.36 / 0.37 | - | can't tell |
| 12-1-9 | floor wall thickness (left, "1,2") | 1.2 (1941); 06: 1.25 -0.1; likely | drum.z_levels -4.9..-3.65: 1.25 | +0.05 vs 1.2; inside 06 | match |
| 12-1-10 | lid thickness (right, "1") | 1 (1941); 07: 1.3 -0.1; likely | lid.z_levels -21.73..-20.53: 1.2 | +0.2 vs 1; inside 07 (1.2..1.3) | match |
| 12-1-11 | arbor body (with chamfers) length "12" | 12; sure | barrelArbor.z_levels -18.38..-6.8: 11.58 | -0.42 | mismatch |
| 12-1-12 | floor outer face to arbor body "3,1" | 3.1; likely | drum z -3.65 to arbor z -6.8: 3.15 | +0.05 | match |
| 12-1-13 | lid outer face to arbor body "2,9" | 2.9; likely | lid z -21.73 to arbor z -18.38: 3.35 | +0.45 | mismatch |
| 12-1-14 | barrel overall "18" (outer to outer) | 18 (06: 18.1 -0.15); likely | drum.size[2]: 18.08 | +0.08 vs 18; inside 06 | match |
| 12-1-15 | hook hole M2.6 at 45 deg to the chain slot, hand seen from the open end (lid off) | M2.6 at 45 deg CW of the 12 o'clock slot (open-end view); likely | drum.cylinders[2].axis (-0.9033,-0.429) against the slot lines at (-17.6,6.2): 44.8 deg, CW of the slot seen from the open end | 0.2 deg; hand agrees | match |
| 12-1-16 | hook block chord "6" and thickness "0,5" | 6 and 0.5; likely | hookBlock arcs r19.25/18.75, ends (-16.74,-9.50) and (-18.85,-3.91): chord 5.98, 0.5 thick | -0.02 | match |
| 12-1-17 | chain slot at 12 o'clock (2, 2.5, 0.5, 0.4; "Schlitz fuer Kette erst bei Schneckenmontage einsetzen") | 2 wide; 2.5, 0.5, 0.4 (unclear which attach where); unsure | drum outlines_by_level[-4.9] slot 2.025 x 0.8; steg 2.0 x 0.5: 2.025 x 0.8 | - | can't tell |
| 12-1-18 | hook on the arbor (05 07 02-2) at 15 deg to the square's flat normal (end view) | 15 deg; likely | barrelArbor.cylinders[0].axis (1,0,0) against the square's vertices on x (section_y0 / outlines): hole axis along the square diagonal = 45 deg to a flat normal | +30 | mismatch |
| 12-1-19 | stack: ball end beyond the plate "5", square end "10", gap "0,6", gap "0,1" | 5 / 10 / 0.6 / 0.1; unsure | placements: 050702-1 y -35.25..4.95; 050805-1 top y -22.35; 050701-2 face y -21.73; 050802-1 y 0..3.35: lid face to bridge 0.62 (ok); ball end 1.6 beyond 050802-1; floor to 050802-1 3.65 | 0.62 against 0.6 ok; ball 1.6 against 5 and floor gap 3.65 against 0.1 do not read the same (which plate is the sheet's Unterplatte is not clear) | can't tell |
| 12-1-20 | "12" at the right (arbor axis to screw 103) | 12; unsure | not a barrel feature: - | - | can't tell |
| 12-1-21 | 5 deg lead-in at the lid seat and 0.5 | 5 deg, 0.5; unsure | drum.cones[0] half_angle_deg: 4.5 deg | -0.5 deg | match |

**Extras: none against this sheet.**

## Sheet 05 07_3: Sperrrad (050700-3)

**Title block:** rev. 14.11.47 (thickness was 2.63 -0.03; number was 05 05 00-1); Massstab 5:1; Messingblech 3, Din 1751 Ms58; Zaehnezahl 16; gez. 9.4.41

**Views:** Plan (teeth, 16, tips 14.1, root 11.1, R12.5 ramp circle, 1.2 / 10 deg face, 6.4 circle) and section (2.7 H7 square, taper 1:100, 2.65 -0.1).

**Step 2 (views against each other):** Plan and section agree on 2.7 and the thickness; the sheet draws four teeth, the rest as arcs.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-2-1 | tooth count (Zaehnezahl) | 16; sure | setupRatchet.teeth[0].count: 16 | 0 | match |
| 12-2-2 | tip diameter | 14.1 -0.2 (13.9..14.1); sure | teeth[0].tips_d: 14.0 | 0 | match |
| 12-2-3 | root diameter (dashed) | 11.1 -0.2 (10.9..11.1); sure | teeth[0].roots_d: 11.0 | 0 | match |
| 12-2-4 | face: line tangent to a circle of 1.2, lean 10 deg from the radial through the tip | 1.2 and 10 deg; likely | outline: face line x = 1.2 from tip (1.2,6.90) to root (1.2,5.37); lean asin(1.2/7.0): 9.87 deg | -0.13 deg | match |
| 12-2-5 | ramp: arc of the 12.5 circle, centre about 3.5 from the axis | 12.5 dia; likely | outline ramp points fitted to a circle: dia 12.49, centre 3.12 from the axis | 0 | match |
| 12-2-6 | thickness 2.65 -0.1 (rev. 14.11.47; was 2.63 -0.03) | 2.65 -0.1 (2.55..2.65); sure | setupRatchet.size[2]: 2.65 | 0 | match |
| 12-2-7 | square hole 2.7 H7 (+0.009), taper 1:100 | 2.700..2.709, taper 1:100; likely | section: across flats 2.671 (z -28.35) to 2.6975 (z -25.7): 2.6975 at the large end; taper 1:100 | -0.0025 under the lower limit 2.700 | mismatch |
| 12-2-8 | square orientation to the tooth tip: tip on the axis, along a flat normal | 0 deg; likely | tips at 12.63 + 22.5k deg; flat normals at 45 + 90m deg (the square's vertices on the axes): 9.9 or 12.6 deg off a flat normal | +9.9 deg | mismatch |
| 12-2-9 | tooth hand as assembled (teeth face the set-up click) | sheet view side not fixable; its face root is CCW of the tip as drawn; unsure | teeth: the radial wall behind each tip faces CCW; the click 050805-2 solved from its box to pivot (30.46,-15.63), nose (31.92,-8.27) in movement x,z; seen from the dial side (x,-z) the nose rests CCW of a tooth's back wall, pointing CW: the click locks CCW rotation and rides the ramp CW: the teeth face the click | - | can't tell |
| 12-2-10 | 6.4 circle round the square, 12.5 circle | 6.4 (a thin circle round the hub); unsure | section_y0 hub radius 6.23: - | - | can't tell |

**Extras: none.**

## Sheet 05 07_4: Federhaus mit Deckel 05 07 01 (asm)

**Title block:** 2.8.44, rev. 20.4.48 (a: 10x); Massstab 2:1; Ms.; "Deckel eingesprengt"; "vernieten"

**Views:** Section: drum 05 07 01-1, lid 05 07 01-2, hook 05 07 01-3, arbor 05 07 02-1; plan with the lid half broken away; small plan 1:1.

**Step 2 (views against each other):** Plan and section agree on the 18.1 height; "0,6" and "0,05" hard to attach.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-3-1 | overall height of the drum "18,1 -0,15" | 18.1 -0.15 (17.95..18.1); sure | drum.size[2]: 18.08 | 0 | match |
| 12-3-2 | gap arbor body to floor boss "0,05 +0,06" | 0.05 +0.06; likely | drum z -6.75 (boss top) against arbor z -6.8: 0.05 | 0 | match |
| 12-3-3 | gap arbor body to lid boss | 0.05 (+0.06); likely | lid z -18.43 against arbor z -18.38: 0.05 | 0 | match |
| 12-3-4 | hook block height "3,05 -0,1" | 3.05 -0.1; sure | hookBlock.size[2]: 3.05 | 0 | match |
| 12-3-5 | hook block centre above the floor inside "7,85 +-0,05" | 7.85 +-0.05; likely | hookBlock z centre -12.7 against floor in -4.9: 7.8 | -0.05 | match |
| 12-3-6 | hook block width "2,05 -0,1" (a) | 2.05 -0.1; unsure | hookBlock lines 2.0 and 0.5: 2.0 tangential, 0.5 radial | -0.05 | match |
| 12-3-7 | "0,6 -0,1" near the lid face | 0.6 -0.1 (where it attaches is unclear); unsure | lid.z_levels -21.73 = drum rim -21.73: lid face flush with the rim (0) | -0.6 | can't tell |
| 12-3-8 | lid shrunk in ("Deckel eingesprengt"), 5 deg edge | 5 deg; likely | lid.cones[1] half_angle_deg: 4.5 | -0.5 | match |
| 12-3-9 | arbor riveted over ("vernieten") | a note; sure | not geometry: - | - | can't tell |

**Extras: none.**

## Sheet 05 07_5: Federhausrohling R 05 07 01-1 (blank)

**Title block:** 29.8.44, rev. 20.4.48; Massstab 2:1; Ms. 63 3; Toleranz 0.1; "gezogen" (drawn) and "ueberdreht" (turned over)

**Views:** Section of the drawn blank only.

**Step 2 (views against each other):** The blank is not the finished drum: compared for allowance only.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-4-1 | blank OD, turned over | 43.6; sure | drum.cylinders[3].d: 41.6 finished | finished inside the blank (2.0 to turn off) | match |
| 12-4-2 | blank bore | 38.2; sure | drum.cylinders[0].d: 38.5 | bore turned out 0.3 | match |
| 12-4-3 | blank height, drawn | 20.5; sure | drum.size[2]: 18.08 | faced down 2.4 | match |
| 12-4-4 | blank boss 14 dia and 8 dia hole | 14 / 8; likely | drum.cones[2]: finished boss 12 / 8 | turned down | match |
| 12-4-5 | blank floor 3 and boss 3.9 | 3 / 3.9; likely | drum floor 1.25, boss 3.1 out: 1.25 / 3.1 | faced down | match |

**Extras: none.**

## Sheet 05 07_6 (title block reads 51 07_6): Federhaustrommel 05 07 01-1 (drum)

**Title block:** 28.2.41, "neu ausgegeben 8.4." with changes of 20.4.48 (b, 5x) and 11.3.4? (a); Massstab 2:1; Ms.; Hamburg Wellingsbuettel

**Views:** Section (bore, boss, 1.25, 13.8, 18.1) and plan from the open end: slot at 9 o'clock, M2.6 at 45 deg CW.

**Step 2 (views against each other):** Section and plan agree; 2 +0.05 and 0.95 +0.15 only in the plan and the notes.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-5-1 | outer dia | 41.6 -0.1 (41.5..41.6); sure | cylinders[3].d: 41.6 | 0 | match |
| 12-5-2 | lid seat (rim bore) 39.2 s6 | 39.2 s6 (+0.043..+0.059); likely | cones[0].d at the rim: 39.2 | -0.043 | mismatch |
| 12-5-3 | bore | 38.5 +0.1; sure | cylinders[0].d: 38.5 | 0 | match |
| 12-5-4 | overall height | 18.1 -0.15; sure | size[2]: 18.08 | 0 | match |
| 12-5-5 | lid seat depth | 1.2 -0.1 (rev. 20.4.48); sure | z_levels -21.73 and -20.53: 1.20 | 0 | match |
| 12-5-6 | 5 deg lead-in at the seat | 5 deg; likely | cones[0] half_angle_deg: 4.5 deg (39.2 to 39.39) | -0.5 deg | match |
| 12-5-7 | bore depth, seat shoulder to boss top | 13.8 -0.05; likely | z -20.53 to -6.75: 13.78 | -0.02 | match |
| 12-5-8 | boss top above the outer floor | 3.1 -0.1 (new; was 3.1 -0.1 in clamps); sure | z -3.65 to -6.75: 3.10 | 0 | match |
| 12-5-9 | floor thickness | 1.25 -0.1; sure | z -3.65 to -4.9: 1.25 | 0 | match |
| 12-5-10 | boss dia, top / foot | 8 / 12; sure | cones[2].d: 8.0 / 12.0 | 0 | match |
| 12-5-11 | boss slope | 45 deg (as drawn); unsure | cones[2].half_angle_deg: 47.2 deg | +2.2 deg | match |
| 12-5-12 | centre bore | 4.5 +0.1; sure | cylinders[1].d: 4.55 | +0.05 | match |
| 12-5-13 | M2.6 hole height from the outer floor | 9.05 +-0.05 (was 9.1 -0.1); sure | cylinders[2].at z -12.7 less -3.65: 9.05 | 0 | match |
| 12-5-14 | M2.6 hole at 45 deg to the slot, hand | 45 deg, CW of the slot seen from the open end; likely | cylinders[2].axis against the slot: 44.8 deg, CW from the open end | -0.2 deg | match |
| 12-5-15 | M2.6 core dia | M2.6 (core about 2.1); likely | cylinders[2].d: 2.1129 | - | match |
| 12-5-16 | slot width at 9 o'clock | 2 +0.05; sure | outline lines at -4.9: 2.025 | +0.025 | match |
| 12-5-17 | slot radial width "0,8 +0,05" (was 0,5 +0,03) | 0.8 +0.05; likely | outline lines at -4.9: 0.8 | 0 | match |
| 12-5-18 | slot reach "0,95 +0,15" (new; 18.3 struck) | 0.95 +0.15; likely | 19.25 less 18.33 (slot inner edge): 0.92 | -0.03 | mismatch |

**Extras: the model has a hook-block seat (levels -13.14 and -12.29: 0.5 radial, 2.07 long) that no view on this sheet shows.**

## Sheet 05 07_7: Federhausdeckel 05 07 01-2 (lid)

**Title block:** 7.4.41, rev. 20.4.48 (a: 7x); Massstab 2:1; Ms 58 DIN 1751; Rondell 40 x 3.5

**Views:** Plan with two notches (2 +0.05 and 2.7 +0.1; 18.3 +-0.02; 2 +0.2) and section with 39.2 r6, 39.39, boss 8 / 12, 4.5, 3.3, 1.3.

**Step 2 (views against each other):** Notches only in the plan.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-6-1 | lid dia at the face, r6 | 39.2 r6 (+0.034..+0.050); sure | lid.cones[1].d at z -21.73: 39.2 | -0.034 | mismatch |
| 12-6-2 | lid max dia | 39.39; sure | cones[1].d: 39.39 | 0 | match |
| 12-6-3 | blank (Rondell) | 40 x 3.5; sure | lid.size: 39.39 x 3.3 | inside the blank | match |
| 12-6-4 | flange thickness | 1.3 -0.1 (rev. 20.4.48); sure | z -21.73 to -20.53: 1.2 | -0.1 (at the lower limit) | match |
| 12-6-5 | overall thickness with boss | 3.3 -0.1; sure | z -21.73 to -18.43: 3.3 | 0 | match |
| 12-6-6 | bore | 4.5 +0.1; sure | cylinders[0].d: 4.55 | +0.05 | match |
| 12-6-7 | boss dia, top / foot | 8 -0.2 / 12 -0.2; sure | cones[0].d: 8.0 / 12.0 | 0 | match |
| 12-6-8 | boss slope | 45 deg; likely | cones[0].half_angle_deg: 43.6 | -1.4 | match |
| 12-6-9 | 5 deg edge | 5 deg; likely | cones[1] half_angle_deg: 4.5 | -0.5 | match |
| 12-6-10 | narrow notch width | 2 +0.05; sure | outline lines at -21.73: 2.025 | +0.025 | match |
| 12-6-11 | narrow notch bottom from the centre | 18.3 +-0.02; sure | outline lines at -21.73: r 18.328: 18.328 | +0.008 (over 18.32) | mismatch |
| 12-6-12 | wide notch width | 2.7 +0.1; sure | outline lines: 2.75: 2.75 | +0.05 | match |
| 12-6-13 | wide notch depth from the rim | 2 +0.2; unsure | outline lines: bottom r 17.649: 1.951 from r 19.6 (2.045 from 19.695) | -0.05 from 19.6 | mismatch |
| 12-6-14 | notches opposite | 180 deg; likely | narrow at 160.6 deg, wide at -19.6 deg: 180.2 | 0 | match |
| 12-6-15 | "Scharfe Kante leicht brechen" | a note; sure | no break drawn on the model: - | - | can't tell |

**Extras: none.**

## Sheet 05 07_8: Federkern kompl. 05 07 02 (arbor asm)

**Title block:** 28.1.43; Massstab 2:1; no Werkstoff; "Kugel poliert", "poliert"; Toleranz +-0.1

**Views:** Side view with the hook 05 07 02-2 in the body; end view with the 15 deg line and 0.5 -0.05; 40.2 overall, 5 and 10.

**Step 2 (views against each other):** The hook pin shows in both views; its 15 deg is only in the end view.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-7-1 | overall length (finished) | 40.2; sure | barrelArbor.size[2]: 40.2 | 0 | match |
| 12-7-2 | ball end "5" | 5; likely | barrelArbor z -0.03..4.95: 4.98 | -0.02 | match |
| 12-7-3 | square end "10" | 10; likely | solid 2 z -35.25..-25.25: 10.0 | 0 | match |
| 12-7-4 | hook 05 07 02-2 stands out of the body "0,5 -0,05" | 0.5 -0.05 (0.45..0.5); unsure | hook.box z max 6.9008 against body r 6.65: 0.25 | -0.2 | mismatch |
| 12-7-5 | hook at 15 deg to the square flat normal | 15 deg; likely | barrelArbor cross hole along x, square vertices on x: 45 deg | +30 | mismatch |
| 12-7-6 | hook hand as assembled (end view from the square end, first angle: hook CCW of a flat normal) | CCW 15; unsure | hook world box; the arbor's frame against the hook's is not fixable from the files: - | - | can't tell |
| 12-7-7 | hook pin / hole dia, depth | 2 dia, 6 deep (sheet 09); likely | hook.cylinders[4].d 2.0; barrelArbor.cylinders[0] d 2.0 through 13.6: 2.0, hole through | hole through, not 6 deep | mismatch |
| 12-7-8 | cone 1:70 (polished), square taper 1:100 | 1:70 / 1:100; likely | solid 2 radius 1.842 to 1.9092 over 9.5: 1:71 | 0 | match |

**Extras: none.**

## Sheet 05 07_9: Federkern 02 07 04-1 (arbor)

**Title block:** 4.7.41; Massstab 2:1; Praez. Rundstahl 14 Din 175; Rohmass 14 x 45; Toleranz +-0.05; "Kegel 1:70 poliert", "Kegel 1:100"; stamp KOPIE; handwriting at the top right (illegible)

**Views:** Side view with dimensions; end view; M 1:1.

**Step 2 (views against each other):** Dimensions add up: 7 + 6.7 + 12 + 3.5 + 15 = 44.2.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-8-1 | overall length (raw 44.2; finished 40.2 in 08) | 44.2 raw; sure | size[2]: 40.2 | -4.0 vs raw (ends trimmed); 0 vs 08 | match |
| 12-8-2 | body dia | 13.3; sure | cylinders[1].d: 13.3 | 0 | match |
| 12-8-3 | body length incl. chamfers | 12; sure | z -18.38..-6.8: 11.58 | -0.42 | mismatch |
| 12-8-4 | chamfer end dia | 9; sure | cones[0].d 10.0..13.3: 10.0 | +1.0 | mismatch |
| 12-8-5 | chamfer angle and length ("22 1/2 deg", "0,8") | 22.5 deg to the end face, 0.8-0.9 axial; likely | cones[0] half_angle 45, 1.65 axial: 45 deg, 1.65 | +0.8 axial | mismatch |
| 12-8-6 | cross hole 2 dia x 6 deep, centred | 2 x 6 blind, centred; likely | cylinders[0] d 2.0 through 13.6 at z -12.59: through, centred | through instead of 6 deep | mismatch |
| 12-8-7 | neck dia (ball side), 1:70 polished | 5 (tolerance illegible); likely | cylinders[3].d: 4.48 | -0.52 | mismatch |
| 12-8-8 | neck length (ball side) | 6.7 (+-0.05); sure | z -6.8..-0.03: 6.77 | +0.07 (0.02 over) | mismatch |
| 12-8-9 | ball pivot dia | 3 (tolerance illegible); likely | cylinders[5].d: 2.88 | -0.12 | mismatch |
| 12-8-10 | ball pivot length, raw 7 (finished 5) | 7 raw; likely | z -0.03..4.95: 4.98 | -0.02 vs 5 | match |
| 12-8-11 | square-end neck dia and length "3,5" | 5 dia, 3.5 long; likely | cylinders[2].d; z -22.32..-18.38: 4.48, 3.94 | -0.52 dia, +0.44 long | mismatch |
| 12-8-12 | square-end small neck "4" | 4 (tolerance illegible), about 3.1 long scaled; unsure | cylinders[4].d; z -25.24..-22.32: 3.88, 2.92 | -0.12 dia, -0.2 long (scaled) | mismatch |
| 12-8-13 | square across flats, taper 1:100 ("2,7 +-0,002") | 2.7 +-0.002 at the large end; sure | solid 2 section vertex 1.9092 (AF 2.700): 2.700 | 0 | match |
| 12-8-14 | square-end length from the 3.5 shoulder, raw 15 (finished 13) | 15 raw; likely | z -35.25..-22.32: 12.93 | raw 15 less 2 trimmed | match |
| 12-8-15 | body position along the arbor (6.7 / 12 / 18.7 / 15.5 / 22.2) | body starts 13.7 from the ball tip, raw; sure | body centre to the square tip: z -12.59 to -35.25: 22.66 (sheet 24.5 raw, 22.5 finished) | +0.2 vs finished | match |
| 12-8-17 | shoulder to shoulder, the two necks' outer ends ("22,2 +0,1" boxed) | 22.2 +0.1 (22.2..22.3); sure | z -0.03 and -22.32: 22.29 | 0 (inside, 0.01 under the limit) | match |
| 12-8-16 | 10 deg at the body ends (sheet 01) | 10 deg; unsure | cones[0],[1] half_angle 45: 45 | - | can't tell |

**Extras: none.**

## Sheet 05 07_10: Federhausring 02 07 01-3 (ring)

**Title block:** 7.4.41; Massstab 2:1; Messingrohr 42 x 2 Din 1755 Ms58; Rohmass 42 x 2 x 20; Toleranz +-0.1

**Views:** Plan with 38 and 42; section with 19 height, 2 wall, 39.2, 7.5, 5 deg.

**Step 2 (views against each other):** Plan and section agree.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 12-9-1 | ring OD x ID x height (Rohmass 42 x 2 x 20) | 42 x 38 x 19; sure | no part has these sizes (hookBlock: arcs r19.25/18.75, 6 x 3.05): - | - | not built |
| 12-9-2 | counterbore 39.2 | 39.2; unsure | -: - | - | not built |
| 12-9-3 | step 7.5 deep, 5 deg | 7.5; 5 deg; likely | -: - | - | not built |

**Extras: none. The ledger maps this sheet to hookBlock, but the hook block is 0.5 x 6 x 3.05, not this ring: the ring belongs to the 1941 design (ring and floor), superseded by the pulled drum 05 07 01-1 of the 1944/48 sheets.**

## Mainspring (050700-6, page mesh)

Page: strip height 15.0 (box y -20.215..-5.215), thickness 0.360 (rays), coil pitch 0.37, coils from r about 6.8 to 19.1 (barrel bore r 19.25), no hook form visible in the rays. The sheets give only "Zugfeder 15" (width 15, matches) and the 15.8 +-0.1 space (12-1-6). No thickness, length, end shape or hook is drawn on these sheets: can't tell.

## Summary

Counts: can't tell 11, match 69, mismatch 23, not built 3 (total 106).

Mismatches and not built:

- 12-1-6: spring space between floor and lid, "Zugfeder 15 / 15,8+-0,1": drawn 15.8 +-0.1 (1941 sheet), built 15.63, -0.17 (0.07 outside 15.7..15.9); later sheets 06/07 give 15.65
- 12-1-11: arbor body (with chamfers) length "12": drawn 12, built 11.58, -0.42
- 12-1-13: lid outer face to arbor body "2,9": drawn 2.9, built 3.35, +0.45
- 12-1-18: hook on the arbor (05 07 02-2) at 15 deg to the square's flat normal (end view): drawn 15 deg, built hole axis along the square diagonal = 45 deg to a flat normal, +30
- 12-2-7: square hole 2.7 H7 (+0.009), taper 1:100: drawn 2.700..2.709, taper 1:100, built 2.6975 at the large end; taper 1:100, -0.0025 under the lower limit 2.700
- 12-2-8: square orientation to the tooth tip: tip on the axis, along a flat normal: drawn 0 deg, built 9.9 or 12.6 deg off a flat normal, +9.9 deg
- 12-5-2: lid seat (rim bore) 39.2 s6: drawn 39.2 s6 (+0.043..+0.059), built 39.2, -0.043
- 12-5-18: slot reach "0,95 +0,15" (new; 18.3 struck): drawn 0.95 +0.15, built 0.92, -0.03
- 12-6-1: lid dia at the face, r6: drawn 39.2 r6 (+0.034..+0.050), built 39.2, -0.034
- 12-6-11: narrow notch bottom from the centre: drawn 18.3 +-0.02, built 18.328, +0.008 (over 18.32)
- 12-6-13: wide notch depth from the rim: drawn 2 +0.2, built 1.951 from r 19.6 (2.045 from 19.695), -0.05 from 19.6
- 12-7-4: hook 05 07 02-2 stands out of the body "0,5 -0,05": drawn 0.5 -0.05 (0.45..0.5), built 0.25, -0.2
- 12-7-5: hook at 15 deg to the square flat normal: drawn 15 deg, built 45 deg, +30
- 12-7-7: hook pin / hole dia, depth: drawn 2 dia, 6 deep (sheet 09), built 2.0, hole through, hole through, not 6 deep
- 12-8-3: body length incl. chamfers: drawn 12, built 11.58, -0.42
- 12-8-4: chamfer end dia: drawn 9, built 10.0, +1.0
- 12-8-5: chamfer angle and length ("22 1/2 deg", "0,8"): drawn 22.5 deg to the end face, 0.8-0.9 axial, built 45 deg, 1.65, +0.8 axial
- 12-8-6: cross hole 2 dia x 6 deep, centred: drawn 2 x 6 blind, centred, built through, centred, through instead of 6 deep
- 12-8-7: neck dia (ball side), 1:70 polished: drawn 5 (tolerance illegible), built 4.48, -0.52
- 12-8-8: neck length (ball side): drawn 6.7 (+-0.05), built 6.77, +0.07 (0.02 over)
- 12-8-9: ball pivot dia: drawn 3 (tolerance illegible), built 2.88, -0.12
- 12-8-11: square-end neck dia and length "3,5": drawn 5 dia, 3.5 long, built 4.48, 3.94, -0.52 dia, +0.44 long
- 12-8-12: square-end small neck "4": drawn 4 (tolerance illegible), about 3.1 long scaled, built 3.88, 2.92, -0.12 dia, -0.2 long (scaled)
- 12-9-1: ring OD x ID x height (Rohmass 42 x 2 x 20): not built
- 12-9-2: counterbore 39.2: not built
- 12-9-3: step 7.5 deep, 5 deg: not built

Could not read or attach:

- the tolerances on the arbor's necks and pivots (05 07_9, 05 07_8): too small at 1024 px (the digits after the "5" and "3" are not legible);
- on 05 07_1 the "2" at the top right, "0,85" near the foot and the "0,6" and "0,1" gaps: which faces they attach to is not clear;
- on 05 07_4 the "0,6 -0,1": its extension lines attach to nothing clear;
- the viewing side of the ratchet sheet (no section fixes it) and of the arbor's end view (first angle is assumed, so the end view at the left of the side view would be seen from the square end);
- the mainspring's thickness, length and hook: not drawn on these sheets;
- 05 07_6's handwritten date after "8.4." and the stamp "11.3.4?" are only partly legible.

Dates: 05 07_6 28.2.41 (neu ausgegeben 8.4., changes of 11.3.4? and 20.4.48); 05 07_7 7.4.41, rev. 20.4.48; 05 07_5 29.8.44, rev. 20.4.48; 05 07_4 2.8.44, rev. 20.4.48; 05 07_1 13.4.41; 05 07_8 28.1.43; 05 07_9 4.7.41; 05 07_10 7.4.41; 05 07_3 9.4.41, rev. 14.11.47. Where 1941 sheets and the 1948 revisions disagree (41.5 / 41.6, 15.8 / 15.65, lid 1 / 1.3, boss 2.9 / 3.3, the ring-and-floor drum of 05 07_10 against the pulled drum), the model follows the 1948 revisions for the drum and lid, and the 1941 arbor sheet (05 07_9) for the arbor, with its own changes (see below).

## After the verdicts

Read from `tools/recipes/wempe.py` and `wempe/js/dims.js` (BAR) once the verdicts above were fixed; no verdict is changed here.

- The arbor recipe says its source is "05 07 02-1 (020704-1, the first sheet)". Its core ends are placed 0.05 off the drum and lid bosses (`e: 0.05`, `BC0 = BBF - e`, `BC1 = BLF + e`), and its chamfers are 1.65 x 45 deg to Ø 10 (`[5.0,BC1],[6.65,BC1+1.65]`). That explains 12-8-3, 12-8-4 and 12-8-5 (body 11.58 long, Ø 10 chamfer end, 45 deg) as the model fitting the arbor to the 1948 barrel's boss gaps (0.05) rather than the sheet's 12 / Ø 9 / 22.5 deg.
- The journals Ø 4.48 and Ø 3.88 (`[2.24,...]`, `[1.94,...]`) are not the sheet's 5 / 4; the recipe quotes them without a source line. The shoulders 22.29 apart answer the boxed 22.2 +0.1 (12-8-17, match). The ball end Ø 2.88 is likewise not the sheet's 3 (12-8-9).
- The hook hole: the recipe says "05 07 02 dashes it to the far side; 0207's, the 1941 arbor's, 6 deep with its point", so the model took the 05 07 02 reading (through) over this sheet's 6 deep (12-8-6, 12-7-7).
- The square's taper: `sqr {a: 2.7, b: 2.605, L: 9.5, tip: 0.3, tl: 0.5}`: 2.7 at the shoulder tapering 1:100 (my 12-8-13 match).
- The recipe's hook hole angle `BLK` and the cross hole's direction are placed by the page, not by the arbor's square: I did not trace why the hole lies along the square's diagonal (12-1-18, 12-7-5); I could not tell from the files.
- The drum recipe quotes "41.6 -0.1, as drawn", "38.5 +0.1" and "18.1 -0.15, drawn 18.08", so the drum's matches are by design. Its slot reach and the lid's r6 / s6 interference are not modelled (12-5-2, 12-5-18, 12-6-1).
