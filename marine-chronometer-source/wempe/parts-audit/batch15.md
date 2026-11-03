# Batch 15 (reader): the case, bowl, closing plate and bezel

Blind reading of 05 01_1 to 05 01_5 against r_wpa/measure and r_wpa/page. Crops in E:/mc-video/wpa-audit/crops/.

## 05 01_1: Gehaeuse Kardan 05 01 (assembly)
Title block: 05 01, scale 1:1, drawn 30.10.40, stamp 31 Maerz 1947 (arbeitspause 28.6.46), Z.419, Werkstoff blank. Views: half-section A-B (side), section C-D, plan section A-B (gimbal ring, brackets, wood box). Notes: Lagerstellen a u.b leicht spielend; Holzgehaeuse 185x185x180 mm aussen; Kloben verstellen bis Gleichgewicht erreicht ist. Parts list 1-15. Printed dimensions: 160 dia, 17, 50 deg only; the rest scaled at about 2.44 px/mm (+-0.5 mm). Step 2: plan and sections agree (ring about 145-148, bowl about 106). The list names the bezel 05 01 05-1 but its sheet is 05 01 01 (sheet inconsistency, digits unsure).

| # | item | drawn | built | delta | verdict |
|---|---|---|---|---|---|
| 15-1-1 | Box inner width between wood walls (160 dia mark; extension lines at wood inner faces; attachment likely) | 160 (likely) | placements WN-400.w box x +-80 (nut faces on wood inner side): 160 | 0 | match |
| 15-1-2 | Wooden box outer width (note Holzkasten 185x185x180) | 185 (sure) | page Holzkasten.json size [185,105,185]: 185 | 0 | match |
| 15-1-3 | Wooden box outer height 180 | 180 (sure) | page Holzkasten.json size y 105 (lid separate Holzkasten.D): 105 (lower box only) | n/a | can't tell |
| 15-1-4 | Gimbal ring outer diameter (scaled in section A-B) | ~145 (+-1.5) (unsure) | gimbalRing.cylinders outside d: 148.0 | +3 (scan accuracy) | match |
| 15-1-5 | Gimbal ring height (scaled in side section) | ~24 (+-1) (likely) | gimbalRing.size z: 24.0 | 0 | match |
| 15-1-6 | Bowl outer diameter at bracket seat (scaled, inner ring) | ~106 (+-1.5) (likely) | bowl.cylinders outside d 106: 106 | 0 | match |
| 15-1-7 | Pivot axis to bowl bottom (scaled, top view) | ~54.4 (+-0.7) (likely) | placements: pivot axis y 1.05; 050100-1 box y -53.95: 55.0 | +0.6 | match |
| 15-1-8 | Locking bracket (3 Feststellkloben) angle from vertical 50 deg | 50 deg (sure) | lockBracket.cylinders[0].at [40.2173,-33.7463]: atan(40.22/33.75): 50.0 deg | 0 | match; hand: can't tell |
| 15-1-9 | Dimension 17 at transit lock 15 (attachment unclear: circle centre to a base line) | 17 (unsure) | lockHub / lockKnob / lockLever placements: not identified | n/a | can't tell |
| 15-1-10 | Parts present: 1 bowl, 2 case bracket, 3 locking bracket, 4 gimbal ring, 5 ring bracket, 6 closing plate, 7 screw WN-71, 8 bezel, 10 nut WN-400, 11 WN-80, 12 WN-79, 13 WN-78, 14 closing spring 050100-7, 15 transit lock | all (sure) | measure keys bowl, caseBracket, lockBracket, gimbalRing, ringBracket, closingPlate, screw71, bezel, nutA/nutW, screw80_3/9, screw79, screw78m4/m25, page 050100-7, lock parts: all present | 0 | match |
| 15-1-11 | Ring pivot axes at mid height of the 24 high ring (scaled) | centre of ring height (likely) | gimbalRing.cylinders[1].at z 12.0 of 24: 12.0 | 0 | match |
| 15-1-12 | Pivot hole sizes and places in the ring (not dimensioned) | not dimensioned (unsure) | gimbalRing.cylinders[2..5]: 4.134 d at (0,+-69.5); 3.2 d at (-69.5,0),(72.25,0) | n/a | can't tell |

## 05 01_2: Gehaeusetopf R-05 01 00-1
Title block: 1:1, Ms-Sandguss (Kokillenguss), drawn 6.3.42, checked 6.3.42, N.gepr. 1.6.43, weight 350 gr. One half-section; general tolerance not printed (fallback: +-0.1 to 30, +-0.15 over 30). Bore 98 is plain from the top; the 106 arrow marks the lower outer wall.

| # | item | drawn | built | delta | verdict |
|---|---|---|---|---|---|
| 15-2-1 | Outer dia top flange 118 | 118 (sure) | bowl.cylinders[7].d 118.0 z[53,60.3]: 118.0 | 0 | match |
| 15-2-2 | Flange height from top 12: flange z 53 to 65 | 12 (z 53 to 65) (sure) | bowl.cylinders[7].z [53.0,60.3]: 7.3 (z 53-60.3) | -4.7 | mismatch |
| 15-2-3 | Step dia 108 down to 23.5 from top (z 41.5) | 108, 23.5 (sure) | bowl.cylinders[9] d 108.0 z[41.5,53]: 108.0 z 41.5-53 | 0 | match |
| 15-2-4 | Lower outer dia 106 | 106 (sure) | bowl.cylinders[10] d 106.0 z[14.5,41.5]: 106.0 | 0 | match |
| 15-2-5 | Inner bore 98 (arrows at the left wall) | 98 (sure) | bowl.cylinders[1] d 98.0 z[18.3,60.3]: 98.0 (z 18.3-60.3) | 0 (ends at 60.3, not 65) | match |
| 15-2-6 | Depth of bore 53 (top at 65 to floor z 12) | 53 (floor z 12) (sure) | section_y0 floor z 11.3: floor 11.3; depth from 65 = 53.7 | +0.7 (tol +-0.15) | mismatch |
| 15-2-7 | Total height 65 | 65 (sure) | bowl.box z [0,65]: 65.0 | 0 | match |
| 15-2-8 | Floor fillet (R about 7, scaled 6.5-7) | ~7 (likely) | bowl.tori box 49 r, z 11.3-18.3: 7.0 | 0 | match |
| 15-2-9 | Base recess 64 dia, 5.5 deep | 64, 5.5 (sure) | bowl.cylinders[2] d 68.2 z[0,5.5]: 68.2 dia; depth 5.5 | +4.2 dia | mismatch |
| 15-2-10 | Base outer dia 72.5 | 72.5 (sure) | bowl.cones[0] d [72.5,106]: 72.5 | 0 | match |
| 15-2-11 | Base cone 14.5 high, 40 deg | 14.5, 40 deg (sure) | bowl.cones[0] z [0,14.5] half angle 49.1 (40.9 deg from the axis): 14.5, 40.9 deg | +0.9 deg | match |
| 15-2-12 | Top inner recess 106 dia z60.3-65 (not drawn) | not drawn (bore plain 98) (sure) | bowl.cylinders[0] d 106.06 z[60.3,65]: 106.06 recess | extra | extra |
| 15-2-13 | Lip 110.55 dia z60.8-64.5 with 39 deg cones (not drawn) | not drawn (sure) | bowl.cylinders[8] d 110.552; cones[1..3]: present | extra | extra |
| 15-2-14 | Pin holes 1.2 x2, 2.46 centre hole, 8.2 hole at r22.65 in floor (on 05 01_3 only) | not drawn here (sure) | bowl.cylinders[3..6]: present | extra here | extra |
| 15-2-15 | Weight 350 gr | 350 g (sure) | bowl.volume_mm3 131835 (brass about 1100 g): about 1100 g | n/a | can't tell |

## 05 01_3: Verschlussplatte 05 01 00-2
Title block: Ms, 1:1, drawn 6.12.41, N.gepr. 1.6.43, revision a (2x Masse eingetragen) 14.4.4x (year unsure), note nicht eingetr. Toleranz +-0,1. Section on top (drawn flipped against the built Z: recess on top, boss below); plan below.

| # | item | drawn | built | delta | verdict |
|---|---|---|---|---|---|
| 15-3-1 | Plate dia 68 -0.2 | 68 -0.2 (67.8-68) (sure) | closingPlate.cylinders[6] d 67.9: 67.9 | inside | match |
| 15-3-2 | Boss dia 28 -0.2 | 28 -0.2 (27.8-28) (sure) | closingPlate.cylinders[7] d 27.9: 27.9 | inside | match |
| 15-3-3 | Recess dia 26 | 26 (sure) | closingPlate.cylinders[0] d 26.0 z[0,1.5]: 26.0 | 0 | match |
| 15-3-4 | Recess depth 1.5 | 1.5 (sure) | z_levels 1.5: 1.5 | 0 | match |
| 15-3-5 | Centre boss dia 10 | 10 (sure) | closingPlate.cylinders[8] d 10.0 z[0,1.5]: 10.0 | 0 | match |
| 15-3-6 | Hole 5.5 +0.1 | 5.5 +0.1 (sure) | closingPlate.cylinders[3] d 5.55: 5.55 | inside | match |
| 15-3-7 | Hole 7.5 +0.1 | 7.5 +0.1 (sure) | closingPlate.cylinders[2] d 7.55: 7.55 | inside | match |
| 15-3-8 | Step depth 2 -0.05/-0.1 (1.9-1.95) | 2 -0.05 -0.1 (likely) | closingPlate.cylinders[3].z [0,1.925]: 1.925 | inside | match |
| 15-3-9 | Plate thickness 2.3 | 2.3 (sure) | z_levels 2.3: 2.3 | 0 | match |
| 15-3-10 | Total height 5 | 5 (sure) | box z 5.0: 5.0 | 0 | match |
| 15-3-11 | Hole 8 +0.2 at 22.6 from centre | 8 +0.2 at 22.6 (sure) | closingPlate.cylinders[1] d 8.1 at r 22.6: 8.1, r 22.6 | inside | match |
| 15-3-12 | M2.6 hole at 25 from centre | M2.6 at 25 (sure) | closingPlate.cylinders[4] d 2.1129 (M2.6 minor) at r 25.0: 2.11 minor at r 25.0 | 0 | match |
| 15-3-13 | Hole 1.2 at 12.6 from centre, depth 3 +0.2 | 1.2 at 12.6, depth 3 +0.2 (likely) | closingPlate.cylinders[5] d 1.2 at r 12.35 z[1.5,4.49]: 1.2 at r 12.35, depth 2.99 | -0.25 radial (tol +-0.1) | mismatch |
| 15-3-14 | Angle between the 8 hole and the M2.6 hole 90 deg | 90 (sure) | atan2 of cylinders[1] and [4]: 90.0 | 0 | match; hand: can't tell |
| 15-3-15 | 1.2 hole on the ray of the M2.6 hole | same ray (sure) | cylinders[5] angle -47.5 vs [4] -47.5: same | 0 | match |
| 15-3-16 | Fillet at boss root (small R not read) | unreadable (unsure) | closingPlate.tori z[2.3,3.6] r 15.25: R1.3 | n/a | can't tell |
| 15-3-17 | General tolerance +-0.1 (nicht eingetr. Toleranz) | +-0.1 (sure) | used for the items above: n/a | n/a | match |

## 05 01_4: Glasrand kompl. 05 01 01
Title block: 1:1, drawn 27.11.41, checked 30.11.41, N.gepr. 1.6.43. One half-section with call-outs 05 01 01-1 (glass) and 05 01 01-2 (bezel); no dimensions, so all is scaled (about 4.5 px/mm).

| # | item | drawn | built | delta | verdict |
|---|---|---|---|---|---|
| 15-4-1 | Glass diameter (not printed) | not given (unsure) | page 050101-1.json sections d 111.59: 111.59 | n/a | can't tell |
| 15-4-2 | Glass thickness (hatched strip scaled about 2.4, +-0.5) | ~2.4 (unsure) | page 050101-1.json y 18.85-22.35: 3.5 | +1.1 | can't tell |
| 15-4-3 | Bezel height in assembly (scaled about 17.8) | ~16-18 (unsure) | bezel.size z 13.4: 13.4 | -2.6 | can't tell |

## 05 01_5: Glasrand R-05 01 01-2
Title block: Ms, 1:1, Kokillenguss, drawn 6.3.42, checked 9.3.42, N.gepr. 1.6.43. One half-section: 125, 116, 106, 92, 16, 11.5, 30 deg. No general tolerance read.

| # | item | drawn | built | delta | verdict |
|---|---|---|---|---|---|
| 15-5-1 | Outer dia top 125 | 125 (sure) | bezel.cylinders[3] d 121.2 (max): 121.2 | -3.8 | mismatch |
| 15-5-2 | Bottom outer dia 116 (after bevel) | 116 (sure) | bezel.cones[2] d [113.2,116.1] z[0,6.07]: 113.2 at z0 (116.1 at z 6.07) | -2.8 at the face | mismatch |
| 15-5-3 | Outer bevel 30 deg (125 to 116) | 30 deg (likely) | bezel.cones[2..4] half angles 13.4, 45.7, 70.6 (curved profile): profile differs | n/a | mismatch |
| 15-5-4 | Bore 92 dia, wall 11.5 high, straight | 92 over 11.5 (sure) | bezel.cylinders[2] d 92.0 only z[5.0,5.08]; cones[7] d [92,110.6] z[5.08,12.3]: 92 at z5 only, then cone to 110.6 | conical vs straight | mismatch |
| 15-5-5 | Glass seat recess dia 106 | 106 (sure) | bezel.cylinders[1] d 109.8 z[0.5,4.5]: 109.8 | +3.8 | mismatch |
| 15-5-6 | Recess depth 4.5 (16-11.5) | 4.5 (sure) | bezel.cylinders[1].z [0.5,4.5] plus cone to 5.0: 5.0 | +0.5 | mismatch |
| 15-5-7 | Total height 16 | 16 (sure) | bezel.size z 13.4: 13.4 | -2.6 | mismatch |
| 15-5-8 | Top: plain flat, no chamfer or lip drawn | plain flat top (likely) | bezel.cones[5..6] d 114.4-120.4, 112.4-114.4 z 9.9-13.4; cylinders[0] 112.4: chamfers and lip to z 13.4 | extra | extra |
| 15-5-9 | Outer cylinder 120.4/121.2 z7.5-9.8 (not drawn) | not drawn (sure) | bezel.cylinders[3..5]: present | extra | extra |

## Extras
Bowl: top recess 106 and lip 110.55 with cones; floor holes not on its sheet. Bezel: outer lip 120.4/121.2, top chamfers. Listed above as extra.

## After the verdicts
The recipes were not opened (time). The bezel and the bowl top look built from another source (bezel seat, curved outer profile); nothing read here explains it.

## Summary
Counts: can't tell 8, extra 5, match 32, mismatch 11

Mismatches:
- 15-2 bowl flange: drawn z53-65 (12), built 53-60.3.
- 15-2 bore depth 53 drawn, 53.7 built (floor 11.3 not 12).
- 15-2 base recess 64 drawn, 68.2 built.
- 15-3 hole 1.2 at 12.6 drawn, 12.35 built.
- 15-5 bezel: 125 vs 121.2, 116 vs 113.2, bore 92 straight vs cone, seat 106 vs 109.8, seat depth 4.5 vs 5, height 16 vs 13.4, bevel 30 deg vs curved profile.

Not built: none.

Could not read: dimension 17 on the transit lock, glass diameter and thickness (scaled only), the date digits on 05 01_1, the revision-a year on 05 01_3, the boss-root fillet on the closing plate, the hand of every asymmetric feature (view side not fixed).
