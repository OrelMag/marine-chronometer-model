# Batch 14: the motion work's wheels (change wheel, hour wheel, up-and-down wheel)

Reader's report, blind (no earlier reading used). Sheets are read from the scans; built values come from `r_wpa/measure/KEY.json` and `r_wpa/page/placements.json`. Certainty: sure, likely, unsure. Local Z of each part is its turning axis; in `placements.json` it runs along the movement's +y (dial side), checked on each pipe: the foot z=0 sits at the lower y. Every wheel is symmetric about its axis (cycloidal teeth, a plain bore or five symmetric spokes), so hand is not in question; the only handed thing is the side the countersink and flare are on, and it agrees with the sheets (wheel countersunk on its underside, toward the plate, with the pipe's foot flared into it).

## Sheet 05 02_6: Wechselrad kompl. 05 02 02 (assembly)

**Title block as read.** Title block: Benennung Wechselrad kompl.; Zeichnung Nr 05 02 02; Maßstab 5:1; Werkstoff blank; gez. 28.2.41, gepr. 28.3.41, N.gepr. 27.4.43; LC. No general tolerance printed. Parts: 05 02 02-1 wheel, -2 pipe (Wechselbutzen), -3 pinion (Wechseltrieb). Notes: 'aufschlagen zum Festsitz' (pinion knocked on), 'Laufsitz auf Anrichtstift' (wheel runs on its seat), 'vernietet' (wheel riveted by the pipe's foot). Views: a section through the stack, a plan of the wheel (half) and an M 1:1 inset.

**Views and checks between them.** The section and the plan agree (rim, two inner circles for the collar and the pinion's tips and roots). Scale checked on the pipe: 7 mm = 116 px on the scan, 16.6 px/mm. The 0.9 +0.2 is the pipe's stub below the wheel's bottom face (its extension lines are the wheel's lower face and the pipe's end), not a chamfer.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-1-1 | pipe overall length (top to foot) | 7 -0.1 (sure) | changePipe box z 0..6.9; size[2] 6.9 | 0 (in 6.9..7.0) | match |
| 14-1-2 | pipe upper seat Ø, pinion press fit | 3.05 -0.04 (sure) | changePipe cylinders[4].d 3.05, z 2.6..6.9 | 0 (limit 3.01..3.05; at top limit) | match |
| 14-1-3 | pipe top to collar top (pinion underside) | 4.3 +0.1 (sure) | changePipe 6.9 - cylinders[2] z top 2.6 = 4.3 | 0 | match |
| 14-1-4 | wheel thickness | 1 (sure) | changeWheel z_levels [0.0,1.0] | 0 | match |
| 14-1-5 | pipe stub below the wheel (foot to wheel underside) | 0.9 +0.2 (likely; the other limit illegible) | changePipe cylinders[3] z 0..1.0; placements 050202-1 box y 4.35 vs 050202-2 box y 3.35 | +0.1 (in 0.9..1.1) | match |
| 14-1-6 | foot Ø (scaled) | about 3.1 (unsure; pipe 52 px for 3.05 above) | changePipe cylinders[3].d 3.05 | ~0 | match |
| 14-1-7 | collar Ø above the wheel (scaled) | about 5.5, height about 0.6 (likely; scan +-0.2) | changePipe cylinders[1].d 5.5, z 2.0..2.6 | ~0 | match |
| 14-1-8 | seat in the wheel (Ø of the wheel hole, scaled) | about 4.2 (likely) | changePipe cylinders[2].d 4.2, z 1.4..2.0; changeWheel cylinders[0].d 4.2 | ~0 | match |
| 14-1-9 | riveting flare on the foot side, wheel countersunk on the same face (vernietet) | a flare at the wheel underside (likely; size not printed) | changePipe cones[0] d 4.2..4.66 z 1.0..1.4 (30 deg); changeWheel cones[0] z 0..0.4 | form agrees; size can not be read | match |
| 14-1-10 | pipe bore (scaled) | about 1.5 (likely) | changePipe cylinders[0].d 1.52 | ~0 | match |
| 14-1-11 | pinion bore, press fit on the pipe | 3.05 (same as the pipe seat; likely) | changePinion cylinders[0].d 3.05 | 0 | match |
| 14-1-12 | pinion height (scaled) | about 2.6 (likely; 43 px) | changePinion box z 0..2.5 | -0.1 (within the scan) | match |
| 14-1-13 | pinion outside Ø (tips), scaled; no number on this sheet | about 7.2 (outer lines 123 px at 17.05 px/mm; 7.1..7.4 by the pipe or the length; unsure) | changePinion teeth[0].tips_d 6.8997 | about -0.3 (unsure; the pinion count and tooth form are not printed here) | mismatch |
| 14-1-14 | stack: wheel on the pipe at the foot side, pinion on the collar top | wheel 1 above the foot, pinion from the collar top 2.6 up | placements: 050202-2 box y 3.35..10.25; 050202-1 y 4.35..5.35 (pipe z 1.0..2.0); 050202-3 y 5.95..8.45 (pipe z 2.6..5.1) | 0 | match |
| 14-1-15 | small outer chamfer on the pipe top edge | a bevelled top corner, about 0.1 to 0.2 (unsure) | changePipe section_y0 top corner square at (1.525, 6.9) |  | not built |
| 14-1-16 | pinion press fit (aufschlagen zum Festsitz) and wheel running fit | fits, no sizes beyond 3.05 -0.04 | bore equals the pipe seat in both; no interference solid |  | can't tell |

**Extras.** none.

## Sheet 05 02_7: Wechselrad 05 02 02-1 (part)

**Title block as read.** Title block: Benennung Wechselrad; Zeichnung Nr 127-556.04-004 / 040202-1 (the old number; the assembly calls it 05 02 02-1); Maßstab 5:1; Werkstoff Messingblech 1,2 Din 1751 Ms 58 federhart; Arbeitspause Nr 11; Rohmaß 1,2 x 22,5 x 22,5; nicht eingetr. Toleranz +-0,1; gez. 19.8.40, gepr. 18.12.40 (read; the day is unsure), N.gepr. 27.4.43. Views: plan with the bore and a dimension bubble, a side view (hatched, 1,2 ref, fertig 1,0). Cycloidal teeth table: Z=56, D = 21,30 +-0,02 crossed out and 21,05 (+-0,02) written in by hand, a 21,5 gedreht blank, d = 20,16, dg = 19,03, t = 1,131, f = 0,52, Zahnstärke 0,55-0,56 (hand).

**Views and checks between them.** The two long lines down from the bore are the extension lines of the 4.2 +0,0/-0,1 dimension (the oval is its inspection bubble), not a slot; no keyway is drawn. The sheet draws no countersink. The printed D was replaced by hand: 21.30 became 21.05 (the model follows the hand value).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-2-1 | tooth count (Zykloidenverzahnung) | Z = 56 (sure) | changeWheel teeth[0].count 56 | 0 | match |
| 14-2-2 | tip Ø D (hand-corrected; printed 21.30 +-0.02 crossed out) | 21.05 +-0.02 (sure) | changeWheel teeth[0].tips_d 21.0496 | -0.0004 | match |
| 14-2-3 | pitch circle d | 20.16 (sure) | not a field; the tooth thickness below is sampled at r 10.08 |  | can't tell |
| 14-2-4 | root Ø dg | 19.03 (sure) | changeWheel teeth[0].roots_d 19.0291 | -0.0009 | match |
| 14-2-5 | pitch t | 1.131 (sure) | pi x 20.16 / 56 = 1.1310 with 56 teeth (teeth[0].count 56) | 0 | match |
| 14-2-6 | tooth thickness at the pitch circle (Zahnstärke, hand) | 0.55-0.56 (likely) | outlines_by_level[0.0] lines near (10.08, 0.147) and (10.07, -0.429): gap arc 0.576, tooth 1.131 - 0.576 = 0.555 | inside | match |
| 14-2-7 | tooth flank form (cycloidal; f = 0.52) | cycloidal; f = 0.52 (f not explained; unsure) | gap flanks are radial lines 0.565 long below the pitch circle (outlines_by_level[0.0].lines) |  | can't tell |
| 14-2-8 | bore Ø (dimension bubble) | 4.2 +0,0 / -0,1 (sure) | changeWheel cylinders[0].d 4.2, z 0.4..1.0 | 0 (at the upper limit) | match |
| 14-2-9 | thickness | fertig 1.0 (blank 1.2 ref) (sure) | changeWheel z_levels [0.0,1.0] | 0 | match |
| 14-2-10 | countersink at the bore on one face (sheet 06 shows the flare; this sheet none) | not drawn | changeWheel cones[0] d 4.2..4.66, z 0..0.4, 30 deg |  | extra |

**Extras.** 14-2-10 countersink at the bore on one face (sheet 06 shows the flare; this sheet none) (changeWheel cones[0] d 4.2..4.66, z 0..0.4, 30 deg)

## Sheet 05 02_8: Stundenrad kompl. 05 02 03 (assembly)

**Title block as read.** Title block: Benennung Stundenrad kompl.; Zeichnung Nr 05 02 03; Maßstab 5:1; Werkstoff blank; gez. 20.7.40, gepr. 18.12.40, N.gepr. 27.4.43; LC. Parts: 05 02 03-1 wheel, 05 02 03-2 pipe; note 'vernietet'; 'Kegel 1:70' on the pipe's top section. Dimensions: 4,4 (r6, +0,023/+0,015) across the pipe's top section, 8,2 -0,1 overall, 5,2 -0,1 (foot to the collar top), 1 -0,1 (wheel). Views: section, plan (wheel with collar rings), M 1:1 inset.

**Views and checks between them.** Scale checked on the 8.2 overall (136.5 px, 16.65 px/mm); the 5.2 measures 5.1 on the scan, so it is read right. The 4.4 dimension line crosses the bore and meets the pipe's outer walls at the top section: it is the outside Ø of the tube (r6 is a shaft fit), not the bore. Which point of the 1:70 taper it is measured at is not shown (unsure).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-3-1 | pipe overall length (foot to top) | 8.2 -0.1 (sure) | hourPipe box z 0..8.2 | 0 (at the upper limit) | match |
| 14-3-2 | collar top height above the foot (wheel underside) | 5.2 -0.1 (sure; measured 5.1 on the scan) | hourPipe cylinders[1] z 1.0..3.585 (collar top 3.585) | -1.615 (sheet 5.1..5.2 vs 3.585) | mismatch |
| 14-3-3 | wheel thickness | 1 -0.1 (sure) | hourWheel z_levels [0.0,1.0]; placements 050203-1 y 6.615..7.615 | 0 | match |
| 14-3-4 | tube outside Ø, r6, with taper 1:70 | 4.4 r6: 4.415..4.423 (likely: where it is measured on the taper is not marked) | hourPipe cones[1] d 4.419 (top) to 4.4849 (collar), half_angle_deg 0.4 | top end 4.419 inside r6; taper 0.066 over 4.615 = 1:70 | match |
| 14-3-5 | collar Ø (scaled) | about 8.2 on the scan, 8.07 after the 4.4 tube reads 4.56 (likely) | hourPipe cylinders[1].d 8.0 | -0.07 (within the scan) | match |
| 14-3-6 | pipe bore Ø (scaled, no number) | about 3.6 (likely) | hourPipe cylinders[0].d 3.62 | ~0 | match |
| 14-3-7 | spigot through the wheel (wheel hole Ø6.0, from sheet 05 02_9) | through the wheel, flush at the foot (likely) | hourPipe cylinders[2].d 6.0 z 0.4..1.0; placements: pipe y 6.615, wheel y 6.615 | 0 | match |
| 14-3-8 | riveting flare at the foot | vernietet at the foot side (likely; no size) | hourPipe cones[0] d 6.0..6.46 z 0..0.4 with hourWheel cones[0] z 0..0.4 | form agrees | match |
| 14-3-9 | pipe top face | plain, a roughness mark on the top (likely) | hourPipe top z 8.2 square |  | match |

**Extras.** none.

## Sheet 05 02_9: Stundenrad (part; the sheet is numbered 040204-1, the assembly calls it 05 02 03-1)

**Title block as read.** Title block: Benennung Stundenrad (partly cut off at the foot of the scan); Zeichnung Nr 127-556.04-000 / 040204-1 (the old number); Maßstab 5:1; Werkstoff Messingblech 1,2 Din 1751 Ms 59 federhart (sheet 05 02_7 says Ms 58); Arbeitspause Nr 13; Rohmaß 1,2 x 21 x 21; nicht eingetr. Toleranz +-0,1; the dates are illegible. Cycloidal teeth table: Z = 54, D = 20,0 +-0,02 crossed out, 19,7 written by hand, d = 18,90, dg = 17,89, t = 1,099, f = 0,5. Blank 20,1 -0,1 gedreht struck for 20,2 -0,1 (hand). Side view: 1,05 +-0,03 gedreht (hand), fertig 1,0, a 0,4 dimension on the bore side and a 30 degree mark. Bore: a Ø6 dimension bubble ('6 +0.?/-0,1').

**Views and checks between them.** As on sheet 07, the lines below the bore are the extension lines of the 6 dimension and its bubble, not a slot. Hand corrections of D and the blank: the model follows the corrected D 19.7. The thickness is overwritten by hand (1.05 turned, 1.0 finished).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-4-1 | tooth count | Z = 54 (sure) | hourWheel teeth[0].count 54 | 0 | match |
| 14-4-2 | tip Ø D (hand 19.7 over printed 20.0 +-0.02) | 19.7 (sure) | hourWheel teeth[0].tips_d 19.6987 | -0.0013 | match |
| 14-4-3 | root Ø dg | 17.89 (sure) | hourWheel teeth[0].roots_d 17.889 | -0.001 | match |
| 14-4-4 | pitch d and t | d = 18.90, t = 1.099 (sure) | pi x 18.90 / 54 = 1.0995 for 54 teeth; teeth[0].depth 0.9048 = (19.6987-17.889)/2 | 0 | match |
| 14-4-5 | f = 0.5 (tooth form) | f = 0.5, meaning not stated (unsure) | no field |  | can't tell |
| 14-4-6 | bore Ø (dimension bubble) | 6 with a tolerance of the form +0/-0.1 (value likely; the upper figure is blurred) | hourWheel cylinders[0].d 6.0, z 0.4..1.0 | 0 | match |
| 14-4-7 | thickness | fertig 1.0 (turned 1.05 +-0.03) (sure) | hourWheel z_levels [0.0,1.0] | 0 | match |
| 14-4-8 | countersink at the bore on one face | 0.4 deep at 30 degrees (likely; the angle figure is blurred) | hourWheel cones[0] d 6.0..6.46, z 0..0.4, half_angle_deg 30 | 0 | match |
| 14-4-9 | hand of the part | teeth and bore symmetric; no asymmetric feature (likely) | nothing to compare |  | match |

**Extras.** none.

## Sheet 05 02_10: Auf u. Abrad kompl. 05 02 04 (assembly)

**Title block as read.** Title block: Benennung Auf u. Abrad kompl.; Zeichnung Nr 05 02 04; Maßstab 5:1; Werkstoff blank; gez. 27.2.41, gepr. 28.3.41, N.gepr. 27.4.43; LC. Parts: 05 02 04-1 wheel, 05 02 04-2 hub (Auf u. Abbutzen); notes 'Laufsitz auf Anrichtstift', 'vernietet'; nicht eingetr. Toleranz +-0,05. Dimensions: 2,2 Ø r6 (+0,019/+0,012) at the top, 1,4, 0,7, 2,8 (from the wheel top to the hub top), 1 -0,1 (wheel), 5,2 (hub below the wheel). Views: a section and a half plan showing five spokes.

**Views and checks between them.** Section and plan agree (five spokes, hub ring, rim). The 0.7 dimension stands between the top step and the collar's top; it fits the Ø2.8 step (0.7 high on the scan, 0.77 for the collar below it).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-5-1 | top spigot Ø (r6) | 2.2 +0.019/+0.012 = 2.212..2.219 (sure) | udHub cylinders[5].d 2.2155, z 7.6..9.0 | 0 (inside) | match |
| 14-5-2 | top spigot length | 1.4 (sure) | udHub z 7.6..9.0 | 0 | match |
| 14-5-3 | hub top above the wheel top | 2.8 (sure) | udHub 9.0 - wheel top 6.2; placements: 050204-1 y 9.55 and 050204-2 y 12.35 | 0 | match |
| 14-5-4 | step below the spigot (Ø2.8) height | 0.7 (likely) | udHub cylinders[4].d 2.8, z 6.9..7.6 | 0 | match |
| 14-5-5 | collar thickness above the wheel | about 0.77 on the scan (likely; no number) | udHub cylinders[1].d 7.7, z 6.2..6.9 | -0.07 (within the scan) | match |
| 14-5-6 | hub length below the wheel | 5.2 (sure) | udHub cylinders[3] z 0..5.2; placements 050204-2 y 3.35..8.55 under the wheel at y 8.55 | 0 | match |
| 14-5-7 | wheel thickness | 1 -0.1 (sure) | udWheel z_levels [0.0,1.0] | 0 | match |
| 14-5-8 | hub tube Ø below the wheel (scaled) | about 3.47 (likely) | udHub cylinders[3].d 3.4 | -0.07 | match |
| 14-5-9 | collar Ø (scaled) | about 7.5 (likely; scan +-0.2) | udHub cylinders[1].d 7.7 | +0.2 (at the scan limit) | match |
| 14-5-10 | Ø2.8 step (scaled) | about 2.9 (likely) | udHub cylinders[4].d 2.8 | -0.1 | match |
| 14-5-11 | hub bore (scaled, no number) | about 1.5 (likely) | udHub cylinders[0].d 1.52 | ~0 | match |
| 14-5-12 | wheel hole Ø5.2 H7 and the riveted flare at the foot side, wheel countersunk | through the wheel, flared at the wheel underside (likely; sizes from sheet 05 02_11) | udHub cylinders[2] d 5.2 z 5.6..6.2, cones[0] 5.2..5.66 z 5.2..5.6; udWheel cylinders[1].d 5.2, cones[0] z 0..0.4 | form agrees | match |
| 14-5-13 | spokes (plan) | five (sure) | udWheel outlines: five spokes at 72 deg | 0 | match |

**Extras.** none.

## Sheet 05 02_11: Auf u. Abrad 05 02 04-1 (part)

**Title block as read.** Title block: Benennung Auf u. Abrad; Zeichnung Nr 05 02 04-1; Maßstab 5:1; Werkstoff Messing 1,2 Din 1751 Ms 58 federhart; nicht eingetr. Toleranz +-0,03; gez. 26.2.41, gepr. 29.2.41 (read), N.gepr. 27.4.43; Radstärke 1,0. Cycloidal teeth: Z = 120, D = 34,33, d = 33,454, dg = 32,57, t = 0,878, l = 0,40. Plan: five spokes at 72 deg, spoke width 1,7 -0,2, window arc Ø28,2 +0,2, hub Ø10,5 -0,2, a 35,3 -0,2 diameter across the rim, bore 5,2 H7 (+0,012).

**Views and checks between them.** The 35.3 -0.2 runs across the whole wheel to the rim, larger than D = 34.33, so it can only be the turned blank before the teeth are cut (unsure: the line's end attaches to the rim outline). The 28.2 and 10.5 are diameters through the centre (arrows on the window arc and the hub arc). The spoke angle (a spoke straight up here) is a free rotation, as the tooth phase has no datum.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 14-6-1 | tooth count | Z = 120 (sure) | udWheel teeth[0].count 120 | 0 | match |
| 14-6-2 | tip Ø D | 34.33 (sure) | udWheel teeth[0].tips_d 34.3281 | -0.002 | match |
| 14-6-3 | pitch d and t | d = 33.454, t = 0.878 (sure); pi x 33.454 / 120 = 0.8758 | 120 teeth; teeth[0].depth 0.8792 | sheet t differs from pi x d / Z by 0.002 (the sheet) | match |
| 14-6-4 | root Ø dg | 32.57 (sure) | udWheel teeth[0].roots_d 32.5696 | -0.0004 | match |
| 14-6-5 | l = 0.40 | 0.40, meaning not stated (unsure) | no field |  | can't tell |
| 14-6-6 | spokes: number and spacing | five, 72 deg (sure) | udWheel outlines_by_level[0.0]: five spokes, direction steps of 72 deg | 0 | match |
| 14-6-7 | spoke width | 1.7 -0.2 = 1.5..1.7 (sure) | udWheel spoke edge lines at y = +-0.8: width 1.6 | -0.1 (inside) | match |
| 14-6-8 | window outer arc Ø (across the centre) | 28.2 +0.2 = 28.2..28.4 (likely) | udWheel cylinders[0].d 28.3 (arc_deg 327.6) r 14.15 | +0.1 (inside) | match |
| 14-6-9 | hub Ø | 10.5 -0.2 = 10.3..10.5 (likely) | udWheel cylinders[2].d 10.4 (arc_deg 271.5) | -0.1 (inside) | match |
| 14-6-10 | bore Ø H7 | 5.2 H7 = 5.200..5.212 (sure) | udWheel cylinders[1].d 5.2, z 0.4..1.0 | 0 (at the lower limit) | match |
| 14-6-11 | rim diameter across the whole wheel | 35.3 -0.2 (the blank; unsure) | udWheel teeth[0].tips_d 34.3281; no 35.3 feature |  | can't tell |
| 14-6-12 | thickness | Radstärke 1.0 (sure) | udWheel z_levels [0.0,1.0] | 0 | match |
| 14-6-13 | countersink on the bore (shown on sheet 05 02_10) | not drawn on this sheet | udWheel cones[0] d 5.2..5.66 z 0..0.4 |  | extra |

**Extras.** 14-6-13 countersink on the bore (shown on sheet 05 02_10) (udWheel cones[0] d 5.2..5.66 z 0..0.4)

## After the verdicts

Read from `TOOLS/recipes/wempe.py` and `wempe/js/dims.js` after the verdicts were written; no verdict changed.

- hourPipe collar top (14-3-2): `dims.js` sets `HRW.yc = HRW.y0 + (DY0 - 0.3 - CN.y1)`, the collar's top chosen to clear the dial (0.3 under the dial disc), not the sheet's 5.2. The sheet's 5.2 -0.1 is a drawn size; the model's 3.585 comes from the stack above it.
- changePinion tips (14-1-13): the recipe's own note says its 18 leaves, tip Ø 6.9 and root Ø 5.4 are measured on Wempe 3955 (likely) and that the sheet scales 7.3 for its outside, which would touch the hour wheel. So the departure is known; I read about 7.2 (7.1..7.4), the same. The pinion's own sheet (05 02 02-3) is not in this batch.
- Sheets 05 02_7 and 05 02_9 carry older part numbers (040202-1, 040204-1) than the assemblies (05 02 02-1, 05 02 03-1); the model uses the assemblies'. D on each was changed by hand from the printed value to the one the model uses (21.05 and 19.7), and 05 02_9's Werkstoff reads Ms 59 where 05 02_7 and 05 02_11 read Ms 58.
- Dates: the part sheets 05 02_7 and _9 (19.8.40) are older than their assemblies (05 02_6 28.2.41, 05 02_8 20.7.40); the hand corrections of D are undated. 05 02_11 (26.2.41) comes a day before its assembly 05 02_10 (27.2.41). No two sheets give a different size for the same feature, so no choice between sheets arose.

## Summary

Counts by verdict: match 59, mismatch 2, not built 1, can't tell 6, extra 2 (total 70).

**Mismatches and not built:**
- 14-1-13 pinion outside Ø (tips), scaled; no number on this sheet: drawn about 7.2 (outer lines 123 px at 17.05 px/mm; 7.1..7.4 by the pipe or the length; unsure); built changePinion teeth[0].tips_d 6.8997; Δ about -0.3 (unsure; the pinion count and tooth form are not printed here) => mismatch
- 14-1-15 small outer chamfer on the pipe top edge: drawn a bevelled top corner, about 0.1 to 0.2 (unsure); built changePipe section_y0 top corner square at (1.525, 6.9); Δ  => not built
- 14-3-2 collar top height above the foot (wheel underside): drawn 5.2 -0.1 (sure; measured 5.1 on the scan); built hourPipe cylinders[1] z 1.0..3.585 (collar top 3.585); Δ -1.615 (sheet 5.1..5.2 vs 3.585) => mismatch

**Could not read or settle:** the second tolerance limit of 14-4-6 (blurred); the angle figure of 14-4-8 (blurred); what f (0.52, 0.5) and l (0.40) mean in the tooth tables; whether 35.3 on sheet 05 02_11 is the turned blank (it is larger than D); where on the 1:70 taper the 4.4 r6 is measured; the pinion's printed size (not on this batch's sheets); the cycloidal tooth form beyond the tooth thickness at the pitch circle (checked on the change wheel only: 0.555 against 0.55-0.56).
