# Batch 11: the maintaining ratchet and the fusee band, read blind

Reader: blind reading of eight sheets (05 06_11 to 05 06_14, 05 07_11 to 05 07_14) against `r_wpa/measure/` (maintRatchet, clicks, w21, bandHookRound, bandHookDrum) and `r_wpa/page/` (050602-2, 050602-4, 050703-1, 050704, placements.json). Crops are in `E:/mc-video/wpa-audit/crops/`, outside the repository. Certainty per reading: sure, likely, unsure. Page meshes (spring, band, chain) give no exact solid: their values come from the sections and rays and are marked as such.

**Hand, as assembled.** Ratchet 050602-1 stands with page y = part +Z (dial side), so its +Z plan is seen from the dial side; the part sheets draw it from the hub (recess) side (-Z), so every plan is mirrored against the sheet, as it must be. Two chiral features agree independently (the 42/60 deg radial holes and the tooth form), and the click assembled by placements matches sheet 11. The tooth hand by function (the detent that holds the teeth) is another part: can't tell. The band hooks are not in placements.json: their hand as assembled can't be fixed, but the drum hook's plan is mirrored against its sheet and the round hook's is not (items 11-6-13, 11-7-12).


## Sheet 1: 05 06_11 Gegensperrrad kompl. (05 06 02), assembly

**Title block as read.** Gerhard D. Wempe, Hamburg 11. Drawing no. 05 06 02, 'Gegensperrrad kompl.', scale 5:1, Werkstoff blank (assembly). Drawn/checked dates 1941, N.gepr. 17.4.43 (day and month partly legible). No revision. Called out: 05 06 02-1 ratchet, -2 spring, -3 click, -4 rivet; screw WN-21 in the section. Chronometer not stated.

**Views, and the check between them.** Plan (5:1) seen into the recess from the hub side: the big toothed disc, the 26 hub ring, the spring (-2) lying in the ring with a kink at top and bottom, two clicks (-3) pivoting on screws at 9 and 3 o'clock, four small radial pins (-4) across the ring (two at upper left, two at lower right) and a small hole at 6 o'clock. Dimension 60 deg: from the pivot line (horizontal) to the radial pin line at upper left. Section through the pivot line: flange (thin, outer), web, hub wall rising to the right, the click under the web, screw WN-21 head on the flange side. Plan and section agree with sheet 12 (same hub-side view).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-1-1 | Two clicks on the horizontal diameter, pivot screws on M1.7 holes 19.5 +0.05 apart (sheet 12) | pivots at 3 and 9 o'clock on the horizontal centreline; sure | maintRatchet.cylinders[2],[3] at (-9.7625,0),(9.7625,0), d 1.3211; placements 050602-3 origin = ratchet-local (+9.763, 0.000): 19.525 apart; the placed click sits on the +x pivot | 0.025 | match |
| 11-1-2 | 60 deg between the pivot line and the radial pin line (upper left) | 60 deg; sure | maintRatchet.cylinders[7],[8] axis (-0.5,-0.866) through (6.75,11.69): 60.0 deg from +x | 0 | match |
| 11-1-3 | Radial pins: four ends, two at 42 and 60 deg one side, two diametrally opposite | four small pins across the ring; likely | maintRatchet.cylinders[5..8]: two 0.6 holes along diameters at 42 and 60 deg, both ends cut: four hole ends | 0 | match |
| 11-1-4 | Spring pinned to the ratchet by those pins (its holes sit on the 42 and 60 deg pins) | spring ends carry the pins; likely | page 050602-2 sections_square_to_Y y -7.105: gaps at x 5.74-6.07 and 8.72-8.83; ratchet pin axes at r 11.8: (5.90,-10.2) and (8.77,-7.90) in the page frame (plan y = -page z): gap centres x 5.90 and 8.78, as the ratchet holes | <0.02 | match |
| 11-1-5 | Click orientation as assembled: pointed tip at the wall, concave end to the centre, the two clicks 180 deg to each other | tips at upper left (left click) and lower right (right click); likely | placements 050602-3 axes x (0.690,0,-0.724): click local +x (its pointed tip) in the ratchet plan at 64.3 deg from +x; tip lands at r about 12.9, at the wall: tip at the wall, up-right in a +Z plan = up-left in the hub-side view of the sheet | hand agrees (mirrored view) | match |
| 11-1-6 | Screw WN-21 head on the flange (outer) side of the web | head left of the web in the section; likely | w21.cylinders[0] d 2.6 z -5.055..-4.155 (flange face -5.055); shank 1.6811 through the web to -6.455; pivot 1.19 z -7.755..-6.305: head on the +Z flange face | 0 | match |
| 11-1-7 | Click thickness against the recess depth (flush with the wall end?) | not dimensioned; unsure | clicks.z_levels -8.175..-6.355 against maintRatchet z -8.155 (wall end): click proud of the wall end by 0.02 | n/a | can't tell |

**Extras (the part has it, the sheet does not).**
None found. (The ratchet's full 120-tooth ring is drawn on sheet 12.)

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 2: 05 06_12 Gegensperrrad (05 06 02-1), part

**Title block as read.** Werkstoff: Messingblech 3.5 Din 1751, Ms 58 federhart. Scale 2:1 (1:1 view). Drawn 29.11.40, checked 15.12.40, N.gepr. 20.4.43. Revision 'a' 11.3.48: 4x { Mass 37,25 war 37,5; Mass 25,4 gestr.; 0,3 +0.15 neu; D = 37,25 -0.1 gestr. }. Z = 120, Zahntiefe 0.7 +0.05. No general tolerance printed (fallback used). Roughness VVV.

**Views, and the check between them.** Section (top) and plan (below) at 2:1, with a 1:1 outline of the whole disc at bottom left. Section: flange 1.02 thick, web 1.3, hub wall up to 3.1 total, 0.3 x 45 deg chamfer on the wall's end, radial 0.6 pin hole 2.1 from the flange face. Plan: tooth sample at 12 o'clock (about 4.5 teeth at 3 deg pitch) with a 5 deg wedge, hub rings, bore 6.5 H7, two M1.7 holes 19.5 +0.05 apart on the horizontal, 1.2 H8 hole at R14.2 at 6 o'clock, radial 0.6 holes at 42 and 60 deg (upper left, measured from the left horizontal). Plan and section agree; the plan is the hub (recess) side. The 26.0/26.1 figure is overwritten (illegible which); what the 5 deg spans is unclear; the 1:1 view has no dimensions.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-2-1 | Outer diameter over the teeth 37.25 -0.1 (after rev. a; was 37.5) | 37.15..37.25; sure | maintRatchet.teeth[0].tips_d 37.2; box x +-18.6: 37.2 | -0.05 | match |
| 11-2-2 | Tooth count Z | 120; sure | maintRatchet.teeth[0].count 120: 120 | 0 | match |
| 11-2-3 | Tooth depth (Zahntiefe) 0.7 +0.05 | 0.70..0.75; sure | maintRatchet.teeth[0].depth 0.725; roots_d 35.75: 0.725 | +0.025 | match |
| 11-2-4 | Tooth form and hand: gentle ramp one side, steep near-radial face the other | steep face faces counter-clockwise in the hub-side view; likely | outlines_by_level[-6.075].lines: tip (18.6,0) to root (17.8749,-0.0715) is the steep face (5.6 deg off radial), the ramp rises to the next tip on the +angle side; steep face faces clockwise in the +Z plan: steep face CCW seen from the hub (-Z) side | hand agrees (same side as the radial holes, item 17) | match |
| 11-2-5 | Which detent holds the teeth (hand by function) | not on this sheet; unsure | n/a (the maintaining detent is another part): n/a | n/a | can't tell |
| 11-2-6 | 5 deg wedge at 12 o'clock by the tooth sample | 5 deg, what it spans is unclear; unsure | steep face lean 5.6 deg from radial (tip to root); a guess only: 5.6 deg | n/a | can't tell |
| 11-2-7 | Bore 6.5 H7 +0.015 (centre) | 6.500..6.515; sure | maintRatchet.cylinders[1].d 6.5075 z -6.355..-5.055 (through the web): 6.5075 | +0.0075 | match |
| 11-2-8 | Recess diameter 24.45 +0.1 (inside the hub wall) | 24.45..24.55; sure | maintRatchet.cylinders[0].d 24.45 z -8.155..-6.355: 24.45 | 0 | match |
| 11-2-9 | Hub outer diameter 26.0 or 26.1 (overwritten) -0.2 | 25.8..26.0 or 25.9..26.1; unsure which | maintRatchet.cylinders[9].d 26.0 z -7.855..-6.075: 26.0 | 0 or -0.1 | match |
| 11-2-10 | Hub wall end chamfer 0.3 +0.15 x 45 deg (replaces 25.4) | 0.3 x 45 deg; likely | maintRatchet.cones[0] d 25.4..26.0, z -8.155..-7.855, half angle 45: 0.3 x 45 deg | 0 | match |
| 11-2-11 | Total height 3.1 -0.2 | 2.9..3.1; sure | maintRatchet.size[2] 3.1 (z -8.155..-5.055): 3.1 | 0 | match |
| 11-2-12 | Flange thickness 1.02 -0.02 | 1.00..1.02; sure | maintRatchet.z_levels -6.075..-5.055: 1.02 | 0 | match |
| 11-2-13 | Web thickness 1.3 (tolerance illegible) | 1.3; sure (tolerance unsure) | maintRatchet.z_levels -6.355..-5.055: 1.30 | 0 | match |
| 11-2-14 | Radial pin hole axis 2.1 from the flange face | 2.1; likely | maintRatchet.cylinders[5] axis point z -7.105 (flange face -5.055): 2.05 | -0.05 | match |
| 11-2-15 | Radial pin holes 0.6 dia (tolerance illegible) | 0.6; likely | maintRatchet.cylinders[5..8].d 0.6, arc 358 deg: 0.6 | 0 | match |
| 11-2-16 | Radial pin hole angles 42 and 60 deg from the pivot line | 42, 60; sure | cylinders[5],[6]: through (10.0325,9.0333) (42.0 deg) and (6.75,11.6913) (60.0 deg), counter-clockwise from +x in the +Z plan: 42.0 / 60.0 | 0 | match |
| 11-2-17 | Hand of the radial holes: upper left in the hub-side view | upper left; sure | upper right in the +Z plan, so upper left seen from the hub side (-Z): agrees (mirror view) | 0 | match |
| 11-2-18 | M1.7 tapped holes 19.5 +0.05 apart on the horizontal | 19.50..19.55; sure | maintRatchet.cylinders[2],[3] centres (-9.7625,0),(9.7625,0) d 1.3211 z -6.355..-5.055: 19.525 | +0.025 | match |
| 11-2-19 | Hole 1.2 H8 +0.014 at R14.2, 6 o'clock | 1.200..1.214 at R14.2; sure | maintRatchet.cylinders[4] d 1.207 at (0,-14.2) z -6.075..-5.055: 1.207; R14.200 | +0.007 | match |
| 11-2-20 | The 0.6 holes cut both sides of the wall | drawn as slits across the wall; likely | maintRatchet.cylinders[5..8] along_axis 0.5..1.28 and 25.7..26.5: through both walls | 0 | match |

**Extras (the part has it, the sheet does not).**
None found. The built teeth run all round the 120; the sheet draws a sample only (the note Z = 120 covers it).

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 3: 05 06_13 Sperrfeder (05 06 02-2), part

**Title block as read.** Werkstoff: Bronzeband 1.5 x 0.4 federhart. Scale 5:1 (strip side view 1:1). Drawn 6.5.41, checked 8.5.41, N.gepr. 17.4.43. Toleranz +-0.1 'nicht eingetr.'. Developed length 'gestreckt 27,0'. No revision.

**Views, and the check between them.** Plan: the spring bent from a strip: a long arm of R10.4 (right) and a short arm of R12.0 (left, carrying the two 0.6 holes 18 deg apart), joined by a double kink; dimensions 60 deg (to the hole line), 18 deg, 110 deg, 105 deg, 13.6, two 2.2 circles at the kink, '5' twice. Side view: strip 1.5 -0.1 wide, 0.4 -0.01 thick (printed on the plan), hole 0.6 +0.02 at 0.8 -0.05 from the edge. Plan and side view agree. The 105 deg, 13.6, the second 5 and the 2.2 circles attach to features I could not fix.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-3-1 | Strip thickness 0.4 -0.01 | 0.39..0.40; sure | page 050602-2 rays 45/135 deg strip_thickness 0.3999, 0.4004: 0.400 | 0 | match |
| 11-3-2 | Strip width 1.5 -0.1 | 1.4..1.5; sure | page 050602-2 y_levels -7.855..-6.355; size[1] 1.5: 1.50 | 0 | match |
| 11-3-3 | Developed length 27.0 (gestreckt) | 27.0 +-0.1; sure | page sections y -7.105: loop perimeters 44.19, 7.01, 2.76 give (P/2-0.4) 21.70+3.10+0.98 = 25.78, plus two 0.6 hole gaps = 26.98: 26.98 | -0.02 | match |
| 11-3-4 | Two holes 0.6 +0.02, 18 deg apart | 18 deg; sure | page 050602-2 hole gaps at x 5.90 and 8.78 (3.7 mm of strip at r 11.8 = 17.97 deg): 17.97 deg | -0.03 | match |
| 11-3-5 | Hole across the width 0.8 -0.05 from an edge (centre) | 0.75..0.80; sure | hole axis y -7.105 (edges -7.855 / -6.355): 0.75 from the lower edge | 0 | match |
| 11-3-6 | Hole diameter 0.6 +0.02 | 0.60..0.62; likely | page side view: two hole ellipses about 0.6 (loop gaps give 0.6 along the strip): about 0.6 | n/a (mesh, not a solid) | match |
| 11-3-7 | Free end to the nearer-in hole 5 (end to the 60 deg hole) | 5; likely | page: hole A 22.0 from the long end, 27.0-22.0 = 5.0; hole B 1.3 from the end (sheet 5 - 3.7 = 1.3): 5.0 / 1.3 | 0 | match |
| 11-3-8 | R12.0 on the hole arm (outer face) | 12.0; likely | page 050602-2 ray 45 deg hits 11.6175, 12.0174: 12.017 | +0.017 | match |
| 11-3-9 | R10.4 on the long arm (which face is not clear) | 10.4; unsure (outer or inner) | page 050602-2 ray 135 deg hits 10.1228, 10.5232: 10.12 inner / 10.52 outer | +0.12 outer or -0.28 inner | can't tell |
| 11-3-10 | 110 deg from the long arm's end to the 60 deg hole line | 110; likely | page plan: long end about 170 deg, hole A about 59 deg in the +Y plan: about 111 | +1 | match |
| 11-3-11 | Step between the two arms (R12.0 minus R10.4) | 1.6; unsure | page outer faces 12.017 - 10.523: 1.49 | -0.1 | match |
| 11-3-12 | 105 deg, 13.6 chord, the second 5, the two 2.2 circles | as printed; what they attach to is unclear; unsure | page file has no kink geometry beyond the plan picture: n/a | n/a | can't tell |
| 11-3-13 | Hand: hole arm (R12.0) on the side of the 42/60 deg pins | hole arm at upper left in the hub-side view; likely | page plan from +Y: hole arm at upper right (x > 5, z -7..-10): agrees (mirror view) | 0 | match |

**Extras (the part has it, the sheet does not).**
Spring page mesh has the two hole gaps and nothing else beyond the sheet.

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 4: 05 06_14 Sperrkegel (05 06 02-3), part

**Title block as read.** Werkstoff: Bandstahl 11 x 2 Din 1946; haerten, 295 deg blau anlassen. Scale 10:1. Drawn 10.4.41, checked 15.4.41, N.gepr. 3.4.43. Toleranz +-0.05 'nicht eingetr.'. No revision.

**Views, and the check between them.** Plan (10:1): pivot boss with the bore; flat base line; left end face leaning 5 deg (85 deg) with a concave R3 seat beside it, R8 convex long edge, a pointed tip at the right 5.2 from the pivot. Dimensions 10.05 -0.1 overall, 2 (left end height), 5.2 -0.1 (pivot to the left corner), 5.2 (pivot to the tip), R3 centre 2.78 -0.001 left and 3.54 -0.01 from the pivot level, 3 dia boss, 85 deg, R8. Side view: 1.82 -0.04 thick, bore 1.2 H7 +0.009, 45 deg countersink to 1.7 dia on one face, 2.2 dia on the other. The sheet's plan is flipped about the base line against the built plan (R3 below on the sheet, above in the part); that is the view side, and the assembled orientation matches sheet 11 (11-1-5). The tip dimension's end (apex or corner) is read as the apex.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-4-1 | Overall length 10.05 -0.1 | 9.95..10.05; sure | clicks.size[0] 10.0077 (box x -4.9796..5.028): 10.008 | -0.042 | match |
| 11-4-2 | Thickness 1.82 -0.04 | 1.78..1.82; sure | clicks.size[2] 1.82 (z -8.175..-6.355): 1.82 | 0 | match |
| 11-4-3 | Left end height 2 | 2 +-0.05; sure | outline: left face (-4.9796,1.5)->(-4.8047,-0.5) length 2.008: 2.008 | +0.008 | match |
| 11-4-4 | Left end face angle 85 deg | 85; likely | left face 5.0 deg off the vertical: 85.0 deg | 0 | match |
| 11-4-5 | Pivot to the left corner 5.2 -0.1 | 5.1..5.2; likely | corner (-4.9796,1.5): distance 5.200: 5.20 | 0 | match |
| 11-4-6 | Pivot to the tip 5.2 | 5.2 +-0.05; likely | tip arc R0.2 at (4.828,1.3), apex (5.028,1.3): distance 5.19: 5.19 | -0.01 | match |
| 11-4-7 | R3 concave seat, centre 2.78 -0.001 from the pivot line, 3.54 -0.01 from the pivot level | R3, 2.78, 3.54; sure | clicks.cylinders[0] d 6.0 at (-2.78,3.54): R3.0 at (-2.78,3.54) | 0 | match |
| 11-4-8 | R8 convex long edge | 8; sure | clicks outlines_by_level[-8.175] arc R8.0 centre (-0.9839,6.5287): R8.0 | 0 | match |
| 11-4-9 | Boss round the pivot, dia 3 (the outer thin circle) | 3 +-0.05; likely | clicks.cylinders[3] d 3.0542 (a 44.8 deg arc, centre (-0.009,0.026)): 3.054 | +0.054 | mismatch |
| 11-4-10 | Pivot bore 1.2 H7 +0.009 | 1.200..1.209; sure | clicks.cylinders[1] d 1.209 z -7.755..-6.605: 1.209 | +0.009 | match |
| 11-4-11 | Countersink 45 deg to dia 1.7 (one face) | 1.7, 45 deg; sure | clicks.cones[1] d 1.209..1.7, half angle 44.5, z -6.605..-6.355: 1.7 / 44.5 deg | 0 / -0.5 deg | match |
| 11-4-12 | Countersink to dia 2.2 (other face) | 2.2; sure | clicks.cones[0] d 1.209..2.2, half angle 49.7, z -8.175..-7.755: 2.2 / 49.7 deg | 0 | match |
| 11-4-13 | Hand as assembled (tip toward the wall) | see 11-1-5; likely | placements 050602-3 axes: agrees with sheet 11 | 0 | match |

**Extras (the part has it, the sheet does not).**
Cone half angles 44.5 and 49.7 deg: the sheet prints 45 deg on one only.

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 5: 05 07_11 Schneckenband (05 07 03), assembly

**Title block as read.** Gerhard D. Wempe, Hamburg 11. Drawing no. 05 07 03, 'Schneckenband' (the list says 1.3.43), scale 5:1, Werkstoff blank. Drawn 1.3.43, checked 1.3.43, N.gepr. 2.3.43.

**Views, and the check between them.** The band with its two hooks: 05 07 03-2 (round hook) soldered ('hart gelotet') at the top and 05 07 03-3 (drum hook) at the bottom, the band between them drawn as a loop. One dimension: 730 +-3 between the hooks' end marks (+-3 read on an enlargement; sure). No band width, thickness or turn count is printed; the hooks' slot (0.22 +0.03, sheets 12 and 13) and their 0.8 thickness bound them.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-5-1 | Band length between the hook ends 730 +-3 | 727..733; sure | page 050703-1 volume_mm3 126.018, thickness 0.2208, width 0.78 (y_levels -18.05..-17.27): length = 126.018/(0.2208*0.78): 731.7 (width taken as 0.78) | +1.7 | match |
| 11-5-2 | Band thickness (not printed; the hook slots are 0.22 +0.03) | 0.22..0.25 by the slot; likely | page 050703-1 rays 135 deg strip_thickness 0.2207, 0.2209: 0.221 | +0.001 | match |
| 11-5-3 | Band width (not printed; the hooks are 0.8 -0.05 thick) | not printed; sure | page 050703-1 y_levels span 0.78: 0.78 | n/a | can't tell |
| 11-5-4 | Turns and free form of the band | a loop sketched, no turn count; sure | page 050703-1 is the band laid on the fusee and barrel (ray pitch 22.04 between crossings): n/a | n/a | can't tell |
| 11-5-5 | Hooks soldered to the band ends | hart gelotet; sure | hooks are separate page lines (050703-2, -3); the joint is not in the page file: n/a | n/a | can't tell |
| 11-5-6 | Parts present: round hook (-2), drum hook (-3), band (-1) | 3 parts; sure | measure bandHookRound, bandHookDrum; page 050703-1: all present | 0 | match |

**Extras (the part has it, the sheet does not).**
None found.

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 6: 05 07_12 Schneckenhaken rund (05 07 03-2), part

**Title block as read.** Werkstoff: Bandstahl 10 x 0.8 Din 1016. Scale 10:1. Drawn 18.3.43, checked 18.3.43, N.gepr. 18.3.43. Toleranz +-0.05 'nicht eingetr.'. Kante brechen at the slot mouth. No revision.

**Views, and the check between them.** Plan (10:1) and a side view 0.8 -0.05 thick. The hook: a narrow band slot 0.22 +0.03 wide tilted 5 deg to a straight tongue edge 2.5 long; a notch closing in an R0.4 cap; a left lobe (R0.4 end) 1.25 left and 0.5 below the notch cap; an outer body with R6 (centre 3.55 left, '2.8' below), (1.5r), 7r, 1.7, 1, 0.6, 30 deg. FINDING (sheet): the R6 centre is printed 2.8 below the datum axis, but its dot is drawn 1.7 below it (scaled 1.71 at 10:1) while 3.55 across is drawn true; the sheet disagrees with itself. The hook is a flat piece; the built plan is the sheet's turned 90 deg, no mirror.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-6-1 | Thickness 0.8 -0.05 | 0.75..0.80; sure | bandHookRound.size[2] 0.78: 0.78 | -0.02 | match |
| 11-6-2 | Band slot width 0.22 +0.03 | 0.22..0.25; sure | outline slot walls y = +-0.1175 (lines at y 0.1175 and -0.1175): 0.235 | +0.015 | match |
| 11-6-3 | Slot depth (mouth to the blind end), scaled | 3.35 +-0.1; likely | slot lines x 0.114..3.4966: 3.38 | +0.03 | match |
| 11-6-4 | Slot tilted 5 deg to the tongue edge | 5; sure | tongue edge (1.0749,0.8862)->(3.5654,0.6683) slopes -5.0 deg to the slot (x axis): 5.0 deg | 0 | match |
| 11-6-5 | Straight tongue edge 2.5 | 2.5; sure | same line, length 2.500: 2.50 | 0 | match |
| 11-6-6 | Lobe centre 1.25 and 0.5 from the notch cap centre (in the tongue-edge frame) | 1.25 across, 0.5 along; sure | R0.4 centres (3.6003,1.0668) concave and (3.2111,2.3556) convex: difference (-0.389,1.289) = (0.5, 1.25) turned 5 deg: exact (1.346 apart) | 0 | match |
| 11-6-7 | Notch cap R0.4 (concave) and lobe end R0.4 (convex) | 0.4; sure | bandHookRound.cylinders[0] d 0.8 inside at (3.6003,1.0668); cylinders[4] d 0.8 outside at (3.2111,2.3556): R0.4 both | 0 | match |
| 11-6-8 | Notch flank 30 deg to the tongue edge | 30; sure | flank (3.8395,1.3873)->(2.9718,2.0351): 36.7 deg from the slot, 31.7 deg from the tongue edge: 31.7 deg | +1.7 deg | mismatch |
| 11-6-9 | Body arc R6, centre 3.55 across and 2.8 along (printed) | R6, (3.55, 2.8); sure (figures); the drawn dot is at 1.7 not 2.8 | bandHookRound.cylinders[1] d 11.8607, centre (2.2087,4.6668): 3.465 across, 1.70 along from the notch cap: R5.93, (3.47, 1.70) | R -0.07, across -0.085, along -1.1 (the built follows the drawn dot) | mismatch |
| 11-6-10 | Overall width and length (scaled at 10:1) | about 3.96 x 5.3; likely | bandHookRound.size 4.019 x 5.327: 4.02 x 5.33 | +0.06 / +0.03 | match |
| 11-6-11 | Mouth chamfers (Kante brechen) | present; likely | slot-mouth lines about 0.12 long at both lips: about 0.12 | n/a | match |
| 11-6-12 | 1.7 (tolerance illegible), 1, 0.6, (1.5r), 7r | what each attaches to is unclear; unsure | arcs R2.076 (top), R1.0 (mouth); no 7 or 1.5 radius found: n/a | n/a | can't tell |
| 11-6-13 | Hand: plan and as assembled | no mirror in plan; unsure as assembled | 050703-2 is not in placements.json: n/a | n/a | can't tell |

**Extras (the part has it, the sheet does not).**
Mouth chamfers about 0.12 (sheet: Kante brechen, no size).

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 7: 05 07_13 Bandhaken f. Trommel (05 07 03-3), part

**Title block as read.** Werkstoff: Bandstahl 10 x 0.8 Din 1016. Scale 10:1. Drawn 18.3.43 (the list says 9.6.44), checked 18.3.43, N.gepr. 7.3.43. Toleranz +-0.05 'nicht eingetr.'. Kante brechen at the slot mouth.

**Views, and the check between them.** Plan (10:1): a tall hook with a rounded tip on top (R0.2), a long R10 edge on the right, a wing on the left (R4 convex neck, notch R0.2 cap, lobe R0.2), a straight edge 2.5 long under the notch, the band slot 0.22 +0.03 wide tilted 10 deg to it, 4.5 and 2.5 vertical dimensions, 2.8, 1.4, 1.0, 0.9, 0.3, 0.35, 1.2, 50 deg and 10r/20r. Side view 0.8 -0.05 thick. Not every figure could be attached on the enlargement.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-7-1 | Thickness 0.8 -0.05 | 0.75..0.80; sure | bandHookDrum.size[2] 0.78: 0.78 | -0.02 | match |
| 11-7-2 | Band slot width 0.22 +0.03 | 0.22..0.25; sure | slot lines (4.924,1.0443)->(1.5516,0.7294) and (1.6495,0.5025)->(4.9458,0.8103): 0.235 across: 0.235 | +0.015 | match |
| 11-7-3 | Slot tilt 10 deg to the straight edge | 10 (scaled 10.6-13); likely | slot lines at 5.3 deg to the straight edge (4.8224,0)->(2.412,0): 5.3 deg | -4.7 deg | mismatch |
| 11-7-4 | Tip to the datum axis 4.5 (axis through the notch cap) | 4.5; likely | tip arc centre x 9.3075; axis (notch cap) x 4.8224: 4.485 | -0.015 | match |
| 11-7-5 | Tip radius R0.2 | 0.2; sure | bandHookDrum.cylinders[4] d 0.4 at (9.3075,-0.566): R0.2 | 0 | match |
| 11-7-6 | Straight edge 2.5 under the notch | 2.5; likely | line (4.8224,0)->(2.412,0): 2.41 | -0.09 | match |
| 11-7-7 | Overall length tip to bottom and width (scaled at 10:1) | about 8.07 x 3.25; likely | bandHookDrum.size 8.0955 x 3.333: 8.10 x 3.33 | +0.03 / +0.08 | match |
| 11-7-8 | R10 long edge | 10; unsure (the 10r figure ends on a construction arc) | bandHookDrum.cylinders[1] d 20 centre (2.9781,-8.048): R10.0 | 0 | match |
| 11-7-9 | R20 near the tip (left edge) | 20; unsure | straight line (9.2654,-0.7615)->(7.3767,-0.3544); an R20 over 1.93 has a sagitta 0.023: straight | 0.023, under the +-0.05 | match |
| 11-7-10 | R4 convex neck | 4; likely | bandHookDrum.cylinders[2] d 8 outside at (4.7013,2.6192): R4.0 | 0 | match |
| 11-7-11 | 7r bottom corner, 2.5 lower, 1.4, 1.0, 0.9, 0.3, 0.35, 1.2, 50 deg | attachments unclear on the enlargement; unsure | built has R1.0 (two arcs at the mouth) and R0.2 x4; no R7: n/a | n/a | can't tell |
| 11-7-12 | Hand: built plan is the sheet's mirror seen from +Z (R10 edge at +y where the sheet has it right; wing at -y where the sheet has it left); the round hook is not mirrored | mirror in plan; likely. As assembled unsure | bandHookDrum plan; 050703-3 is not in placements.json: mirror in plan | n/a | can't tell |

**Extras (the part has it, the sheet does not).**
Small R0.2 arcs at the slot top and bottom corner not individually dimensioned.

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Sheet 8: 05 07_14 Kette (05 07 04), part

**Title block as read.** Werkstoff: Bandstahl 5 x 0.3 / 10 x 0.9, Praez. Rundstahl 0.6. Scale 5:1. Drawn 16.7.41, checked 9.9.41, N.gepr. 30.4.43. Toleranz +-0.05 'nicht eingetr.'. Notes: haerten, 310 deg anlassen; beweglich vernietet; leicht polieren. No revision.

**Views, and the check between them.** Plan: the chain from its top hook to its lower hook (broken in the middle), total 780 +3; plates 2 -0.03 wide and 4.05 long on a 2.05 pitch; top hook 3.5 wide, 5 from the hook top to the first pin, 1.8, 30 deg, 0.4r; lower hook 7.5, 5, 3.5, 50 deg, 20r, 8r, 0.6r, 1.4 -0.1. Side views: plate stack 0.82 +-0.02 (boxed), 'beweglich vernietet', 'leicht polieren'. The page's 050704 is a posed chain of 9 meshes; its file gives bodies, levels and sections but no link count or length.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 11-8-1 | Total chain length 780 +3 | 780..783; sure | page 050704: box in the posed pose only; no length field: n/a | n/a | can't tell |
| 11-8-2 | Link pitch (pin centres) 2.05 (boxed) | 2.05; sure | page 050704 sections y -0.27: pin circles at x +-1.025: 2.05 | 0 | match |
| 11-8-3 | Plate length 4.05 (over the pins) | 4.05; sure | section y -0.27: plate x -2.025..2.025: 4.05 | 0 | match |
| 11-8-4 | Plate width 2 -0.03 (boxed) | 1.97..2.00; sure | section y -0.27: z -0.9888..0.9888: 1.978 | -0.022 | match |
| 11-8-5 | Stack thickness 0.82 +-0.02 | 0.80..0.84; sure | page 050704 y_levels -0.4..0.4: 0.80 | -0.02 | match |
| 11-8-6 | Plate stock 0.3 thick (Bandstahl 5 x 0.3), polished | 0.3; likely (stock size) | page y_levels: layers -0.4..-0.14, -0.13..0.13, 0.14..0.4: 0.26-0.27 each | -0.03 | match |
| 11-8-7 | Pin dia (Praez. Rundstahl 0.6; no finished pin size) | 0.6; unsure (stock size) | page 050704 sections: circles d 0.5594 (hook end), 0.5509, 0.5452, 0.5411, 0.5421: 0.54-0.56 | -0.04 to -0.06 | mismatch |
| 11-8-8 | Plates per layer and layer count (riveted loose) | layered stack in the side view; unsure | page sections show 3 layers: 3 layers | n/a | can't tell |
| 11-8-9 | Top hook: 3.5 wide, 5 from the top to the first pin, 1.8, 30 deg, 0.4r | as printed; sure | page 050704 hook extents x 16.99..25.48, z 13.58..16.81 are in the page frame, not along the hook axes: n/a | n/a | can't tell |
| 11-8-10 | Lower hook: 7.5, 5, 3.5, 50 deg, 20r, 8r, 0.6r, 1.4 -0.1 | as printed; sure | as above: n/a | n/a | can't tell |
| 11-8-11 | Link count | about 4-5 links drawn per half, the break hides the rest; sure | page 050704: 9 meshes / 11 bodies; no link count field: n/a | n/a | can't tell |

**Extras (the part has it, the sheet does not).**
Pins of 0.54-0.56 at five stations, hook end pin 0.5594.

**After the verdicts.** I did not open the recipes (`TOOLS/recipes/wempe*.py`): no verdict needed explaining beyond what the fields say. A verifier may read them.


## Summary

Counts: can't tell 17, match 73, mismatch 5 (95 items).

**Mismatches.**

- 11-4-9 Boss round the pivot, dia 3 (the outer thin circle): drawn 3 +-0.05; built 3.054; delta +0.054
- 11-6-8 Notch flank 30 deg to the tongue edge: drawn 30; built 31.7 deg; delta +1.7 deg
- 11-6-9 Body arc R6, centre 3.55 across and 2.8 along (printed): drawn R6, (3.55, 2.8); sure (figures); built R5.93, (3.47, 1.70); delta R -0.07, across -0.085, along -1.1 (the built follows the drawn dot)
- 11-7-3 Slot tilt 10 deg to the straight edge: drawn 10 (scaled 10.6-13); built 5.3 deg; delta -4.7 deg
- 11-8-7 Pin dia (Praez. Rundstahl 0.6; no finished pin size): drawn 0.6; built 0.54-0.56; delta -0.04 to -0.06

**Sheet findings.** 05 07_12: the R6 centre is printed 2.8 below the datum but drawn 1.7 (the sheet disagrees with itself; the built follows the drawing). 05 06_12: the 26.0/26.1 figure is overwritten. Hand: drum hook mirrored in plan against its sheet, the round hook not; as assembled can't be fixed.

**Could not read or fix.**

- 11-1-7 Click thickness against the recess depth (flush with the wall end?)
- 11-2-5 Which detent holds the teeth (hand by function)
- 11-2-6 5 deg wedge at 12 o'clock by the tooth sample
- 11-3-9 R10.4 on the long arm (which face is not clear)
- 11-3-12 105 deg, 13.6 chord, the second 5, the two 2.2 circles
- 11-5-3 Band width (not printed; the hooks are 0.8 -0.05 thick)
- 11-5-4 Turns and free form of the band
- 11-5-5 Hooks soldered to the band ends
- 11-6-12 1.7 (tolerance illegible), 1, 0.6, (1.5r), 7r
- 11-6-13 Hand: plan and as assembled
- 11-7-11 7r bottom corner, 2.5 lower, 1.4, 1.0, 0.9, 0.3, 0.35, 1.2, 50 deg
- 11-7-12 Hand: built plan is the sheet's mirror seen from +Z (R10 edge at +y where the sheet has it right; wing at -y where the sheet has it left); the round hook is not mirrored
- 11-8-1 Total chain length 780 +3
- 11-8-8 Plates per layer and layer count (riveted loose)
- 11-8-9 Top hook: 3.5 wide, 5 from the top to the first pin, 1.8, 30 deg, 0.4r
- 11-8-10 Lower hook: 7.5, 5, 3.5, 50 deg, 20r, 8r, 0.6r, 1.4 -0.1
- 11-8-11 Link count
