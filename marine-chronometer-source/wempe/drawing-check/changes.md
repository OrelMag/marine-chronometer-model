# The drawings check: what was changed, sheet by sheet

Read by `tools/drawing_ledger.py`, which puts each line beside its sheets in WEMPE-DRAWING-LEDGER.md. One line a change: `- IMAGES | kind | what | commit`, IMAGES the drawings it rests on (paths under `References/wempe/drawings/`, `;` between), kind `corrected` (the model changed to the sheet), `open` (left, with why: the Wempe README's Unresolved) or `kept` (a recorded departure the check judged still sound). Commits on `claude/wempe-drawing-fixes` unless said.

## Batch 1: plates, pillars, movement ring
- 05-08/Wempe_05-08_07.jpg; Wempe_Einheitschronometer.jpg | corrected | the ring's radial hole Ø 1.6 for the case pin WN-202 at 12 o'clock, 2.8 under the dial's face, cut through the flange (the pin stood in the metal) | 2303c7d9
- 05-08/Wempe_05-08_07.jpg | corrected | the ring's three M2.6 bored through the flange from under it, 24 flats, without the 5 µm step 0.3 up each hole | 2303c7d9
- 05-08/Wempe_05-08_07.jpg | corrected | the ring's outside Ø 105.90 and its recess Ø 104.05, the middles of 105,95 −0,1 and 104 +0,1 | 2303c7d9
- 05-08/Wempe_05-08_03a.jpg | corrected | the pillar plate's hand-setting bore Ø 2 at 1.68 from the dial face, from the window out through the rim (left out: "solidGeo can't cut across") | 2303c7d9
- 05-08/Wempe_05-08_03b.jpg; 05-08/Wempe_05-08_03a.jpg | corrected | the hand-setting window's Ø 14 hollow ends in 24 chords (six flat bands before) | 2303c7d9
- 05-08/Wempe_05-08_01b.jpg; 05-08/Wempe_05-08_03b.jpg | corrected | the steady pins' Ø 2.5 × 1.6 openings ending in a 118° drill point into the reamed hole (flat floors), both plates | 2303c7d9
- 05-08/Wempe_05-08_01b.jpg | corrected | the top plate's horn tips at the exact crossings of the cut and the rim (KIT.subtractCircle: the last chord lay 0.09 outside the cut) | 2303c7d9
- 05-08/Wempe_05-08_01b.jpg; 05-08/Wempe_05-08_02.jpg | corrected | the horn tips a version each (the owner's choice): sharp as 05 09 01 (1943), r 1 as 05 08 01 (1946) as last revised, r 0.3 on Wempe 3955 | 2c177006
- 05-08/Wempe_05-08_01b.jpg | corrected | the balance opening's tongue's round end in 0.05 chords (16 a half round: banded) | 2303c7d9
- 05-08/Wempe_05-08_01a.jpg | corrected | hole 7 Ø 1.6045, 26's M1.2 at 3.525 (the escape setting's screws with them), the pocket 1.325 deep: the middles of their fits | 2303c7d9
- 05-08/Wempe_05-08_11.jpg | corrected | the pillars' body Ø 8.0 and spigots 2.75 long, the middles of 8,1 −0,2 and 2,8 −0,1 | 2303c7d9
- 05-08/Wempe_05-08_11.jpg | corrected | the pillars' 90° countersinks Ø 2.6 to the tap drill, 0.24 deep, the thread cut through them (threadWall th.cs: the wall the wider of thread and cone, no run-out) | a06819b9 (claude/wlo-frame)
- 05-08/Wempe_05-08_01a.jpg | corrected | revision a read "∅ 4,5 in 4,59": P-Q's lip 4.596, the escape setting's spigot 4.59; J-K's 22 at the face, floor 20.6 | a06819b9 (claude/wlo-frame)
- 05-08/Wempe_05-08_03b.jpg; 05-08/Wempe_05-08_03a.jpg | corrected | hole 30: no Ø 5.8 (the plan's circles are G-H's 4.59/5.2); 3955 version the table's plain 2.50 as its plate shows; the "9,5" kept (its far end off both sheets; C-D's 12 +0,2 kept) | a06819b9 (claude/wlo-frame)
- 05-08/Wempe_05-08_07.jpg | kept | the M2.6 carried through the flange into the cone (Wempe 3955's dial side), the coloured section's blind holes not followed | —

## Batch 2: bridges, bushes, cocks, set-up click
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's relief step a 45° cone from r 12 in to r 11.2 (it ran out to 12.8), built as a strip; hole 20 a bay in it | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's boss turned, face Ø 6, a 45° flank to Ø 7.6 (Ø 5.8/7.5, faceted) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's two M1.2 tapped (Ø 0.95 plain), breaking 0.095 into the boss's face; their screws M1.2 (thinned to 0.46 before) | 2303c7d9
- 05-08/Wempe_05-08_14.jpg | corrected | the set-up click's outline walked from its lines and arcs (a distance field's contour: a sliver at the beak) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_14.jpg | corrected | the click's back r 12.5 through the beak's corner and tangent to the nose r 1 (0.18 short: a nick) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_14.jpg | corrected | the click 2.56 thick (2.6 −0.03/−0.05's middle), its screw's shoulder 2.61 | 2303c7d9
- 05-08/Wempe_05-08_14.jpg | kept | 17,4 overall against 17.53 from 9,7, 7,5, r 1, 3,5, 85°: the figures that place the beak and nose kept; the view's own scale runs 15.0-17.9 px/mm and a photograph can't resolve 0.13 | a06819b9 (claude/wlo-frame)
- 05-08/Wempe_05-08_09.jpg | corrected | the dust bush's bottom: a 0.3 × 45° corner, a flat ring 0.5 wide, the face dished 5° to the bore (read as a 5° × 0.5 chamfer) | 2303c7d9
- 05-08/Wempe_05-08_02.jpg; 05-08/Wempe_05-08_09.jpg | corrected | the dust bush both ways (the owner's choice): waisted as 05 08 01 (1946) as last revised, straight as 05 08 01-3 (1942) as first drawn and in 1943 | 2c177006
- 05-08/Wempe_05-08_12.jpg; 05-08/Wempe_05-08_10.jpg | corrected | the steady pins WN-203 chamfered at both ends (0.1 × 45°, not figured) | 2303c7d9
- 05-08/Wempe_05-08_10.jpg | corrected | the intermediate bridge's 45° mouth at hole 38 on the bush's own ring (a 0.01 ledge) | 2303c7d9
- 05-08/Wempe_05-08_05.jpg | corrected | the cock's boss set 0.01 into the arm, so there is no face at the joint; the setting screws' holes still change from thread to plain bore there | a06819b9 (claude/wlo-frame)

## Batch 3: balance, hairspring, stud, rollers
- 05-03/Wempe_05-03_2.jpg | corrected | the timing weights Ø 4.25 as drawn (re-measured: 4.21 and 4.33 at 12.0 px/mm; read 3.5 and 4.3, built 3.8), Wempe 3955's and the 6MX's 3.8 | 935291e6
- 05-03/Wempe_05-03_2.jpg | corrected | the mass screws WN-12 1.85 over the rim's lower face (re-measured 1.83-1.88; read 2.83, built 2.45), Wempe 3955's 2.55; their heads' faces following the mass's round side (two crescents) | 935291e6
- 05-03/Wempe_05-03_4.jpg | corrected | the rim's tapped holes Ø 0.9 at 2.15 for the timing screws, through steel and brass (the screws in the metal); the screws with their weights in each version's group, their heads following the rim's curve | 935291e6; 457b4a5e
- 05-03/Wempe_05-03_4.jpg | corrected | the rim's cuts with parallel walls 1.6 apart (radial) | 935291e6
- 05-03/Wempe_05-03_8.jpg | corrected | the collet's spring hole Ø 0.8 across its narrow end, 3.5 from the bore and 0.75 from its face; the pin through the bar's 2.7 in it | 935291e6
- 05-04/Wempe_05-04_04.jpg | corrected | the staff's arms one taper each, 1:30 above to Ø 1.2 at the step and 1:70 below (a cone and a cylinder; 1:16) | 935291e6
- 05-04/Wempe_05-04_04.jpg | corrected | the hub's neck opened to the collar's Ø 2.14 at its foot, so the two faces aren't in one plane (a serrated band) | 935291e6
- 05-03/Wempe_05-03_8.jpg | corrected | the collet's bore on its sheet's 1:70, opened to the 1946 staff's seat: Ø 1.647 at the arm to 1.604 (the sheet's 1,6 would stand 3.15 over the arm, against 05 03_5's 13,4 and 0,75) | bbaf4a2b (claude/wlo-balance)
- 05-03/Wempe_05-03_3-2.jpg | corrected | the lower pivot 12.59 below the seat (12,6 −0,02; 12.83 before), the lower endstone 1.19 inside the lug (coloured section 1.06 ±0.11); both pivots' cones hollow on R 6 | bbaf4a2b (claude/wlo-balance)
- 05-03/Wempe_05-03_9.jpg | kept | the round point Ø 0.8 the blank's: the facets ground to the knife edge leave no metal for it, Wempe 3955's point under Ø 0.3; the pin hole drilled at assembly ("bei Montage der Spirale gebohrt"): the pin in the slot keeps the spring's place, nothing drilled | bbaf4a2b (claude/wlo-balance)

## Batch 4: escape wheel, detent, detent block
- 05-04/Wempe_05-04_07-1.jpg; 05-04/Wempe_05-04_07-2.jpg | corrected | the escape wheel's web 0.7 and its recess 0.7 deep (re-measured: "0,8" struck for "0,7", the recess line at mid-thickness; 0.8) | 935291e6
- 05-04/Wempe_05-04_23.jpg | corrected | the crossings' middles 17.7° behind a tooth's tip (6°) | 935291e6
- 05-04/Wempe_05-04_07-2.jpg; 05-04/Wempe_05-04_07-1.jpg | corrected | the arbors' shoulders concave arcs r 3 from the pivot's root to the arbor (straight cones), both versions | 935291e6
- 05-04/Wempe_05-04_07-1.jpg | corrected | the first-drawn collet's cone Ø 3.0 to Ø 2.7 at 1.8 (to Ø 2.2) | 935291e6
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg | corrected | the detent's foot's clearance hole for its screw and its two pins' holes; the square's tapped hole for WN-14 | 935291e6
- 05-04/Wempe_05-04_02.jpg | corrected | the gold spring's head 2 high (1.9) with its hole Ø 0.7 1.2 from its end | 935291e6
- 05-04/Wempe_05-04_03.jpg | corrected | the block's M1 in its end face to the Ø 1.3 and the steady pins' holes, as last revised and in the 6MX (the screw and pins in the metal) | 935291e6
- 05-04/Wempe_05-04_03.jpg | corrected | the upright's foot a cove r 3 (traced: r 2.96, centre in the air), not convex: a 0.35 step 2.5 over the base, the cove to 2.0 out and 0.4 over, then straight down; as last revised and in 1943; the 1943 block's end face bored for its M1 and pins | bbaf4a2b (claude/wlo-balance)
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg | corrected | the blade flush toward the block (10-2's "linke Seite", the side its horn bends to: sure): the foot, spring, square and thicker part 0.11 off the blade's line, the block's offset 0.19, the stone 18.77 from the screw's row; the discharge stone's reach takes the tip's slide about the offset flexure (RD 1.578), the detent weighed 8.23 (6MX 8.01), the swing 197.1° at 12 h; two cross-checks widened, the owner's choice | 3bdbefed, be40d005, PENDING (claude/wempe-detent-blade)
- 05-04/Wempe_05-04_01.jpg | kept | the block screw on hole 13 at 23.41 from the wheel: Wempe 3955, carrying the 1941 block, measures 23.36 ±0.15 | bbaf4a2b (claude/wlo-balance)

## Batch 5: fusee group
- 05-06/Wempe_05-06_07.jpg | corrected | the fusee wheel's lip alone at the full 2.62, the rim and teeth 0.2 lower (the other way round) | e96fa808
- 05-06/Wempe_05-06_07.jpg | corrected | the fusee wheel's hub 0.4 under the lip, a 45° flank 1.0 down to Ø 16.6 (as high as the lip, its edge 0.5 × 45°) | e96fa808
- 05-06/Wempe_05-06_16.jpg | corrected | the click wheel's 0.3 × 45° on its face against the body (on the free face) | e96fa808
- 05-06/Wempe_05-06_02-2.jpg; 05-06/Wempe_05-06_03-2.jpg | corrected | the fusee body and every turned part of the fusee group shaded square at their corners (KIT.crease; a dish, a donut, a radial seam) | e96fa808
- 05-06/Wempe_05-06_15.jpg | corrected | the arbor's square shaded flat with its corners (a 4-sided smooth cylinder) | c965d11e
- 05-06/Wempe_05-06_02-2.jpg; 05-06/Wempe_05-06_20.jpg | corrected | the groove swept ray by ray, each wall square at its own depth on the helix (helixSolid), the floor within 0.001 of 05 06_20, pitch 1.2000 (the lathe's 0.04 rows stair-stepped every rib edge) | cb721dee, 40fb0abc (claude/wlo-fusee)

## Batch 6: maintaining work, stop work
- 05-06/Wempe_05-06_14.jpg | corrected | the maintaining clicks' top edge one line tangent to the boss, y = 1.738 − 0.585x, rounding r 0.2 into the base (kinked to a sharp tip, up to 0.30 thin) | e96fa808
- 05-06/Wempe_05-06_12.jpg | corrected | the cup's holes Ø 0.6 for the click springs' pins at 42° and 60° (the pins in the metal) | e96fa808
- 05-06/Wempe_05-06_11.jpg | corrected | the click screws WN-21's heads 0.9 high and their ends domed 0.25 inside the cup's rim (0.5, flat, 0.12 past it) | e96fa808
- 05-06/Wempe_05-06_10.jpg | corrected | the maintaining spring's contour on a 0.02 grid (0.05: stair-stepped end) | e96fa808
- 05-06/Wempe_05-06_10.jpg | corrected | the spring's inner edge three traced arcs: r 10.41 from the eye, tangent to the ring at 50°, widening the band toward the eye (3.16 at 10°); the swell's r 6 about 8.125 on the 270° line; r 13.24 to the end's 4; the outer edge into the eye by an arc tangent to the ring 60° from it (2 wide up to the eye, a 0.125 step, the swell sampled before) | 40fb0abc (claude/wlo-fusee)
- 05-06/Wempe_05-06_04.jpg | kept | C-D's figures read from the hub Ø 21: "2" the upper corner at r 12.5 (model 12.51), "12" is 1,2 (the wound end on the land floor r 9.3, model 9.32), "17,6" is 1,76 (lower point r 12.26, model 12.36, which the 22,5 and the "2" fix together), "3,2" the slide at full wind (model 3.36, drawn 3.6): the sheet's own 0.1, the drawn bar kept | 40fb0abc (claude/wlo-fusee)
- 05-06/Wempe_05-06_04.jpg | corrected | the stop spring's traced end point past the pin dropped, so it comes straight off the pin as the wound shape does (it folded 125° back there); its outer face 0.001 inside the recess wall's facets | 40fb0abc (claude/wlo-fusee)
- 05-06/Wempe_05-06_13.jpg; 05-06/Wempe_05-06_12.jpg | corrected | the click springs' two holes Ø 0.6 +0.02 on both cup pins (the end's "0,6∅" a second hole); WN-21's M1.7 threaded in a tapped plate; the ratchet as first drawn, tips Ø 37.5, in the 'first' version (the struck "25,4∅" the same chamfer's top: "no chamfer" was wrong); the maintaining detent seated on it every 0.01 against the higher ray | 40fb0abc, be633ffb (claude/wlo-fusee)

## Batch 7: barrel group
- 05-07/Wempe_05-07_04.jpg; 05-07/Wempe_05-07_07.jpg | corrected | the lid flush with the rim (re-measured: on the rim's line, the 0,6 the arbor's shoulder over it; sunk 0.6), its edge one 5° face Ø 39.2 to 39.39, the drum's seat cut to match 1.3 deep | c965d11e
- 05-07/Wempe_05-07_04.jpg; 05-07/Wempe_05-07_08.jpg | corrected | the arbor's core faces Ø 10 with 1.65 × 45° chamfers (Ø 9 and 2.15, the 1941 core's) | c965d11e
- 05-06/Wempe_05-06_20.jpg; 05-07/Wempe_05-07_04.jpg | corrected | the mainspring drawn 15 high in the drum's 15.53 inside (14.8) | c965d11e
- 05-07/Wempe_05-07_06.jpg; 05-07/Wempe_05-07_07.jpg | corrected | the drum, lid and arbor shaded square at their corners (KIT.crease) | e96fa808
- 05-07/Wempe_05-07_06.jpg | corrected | the drum's seat 1.2 (its revision a bracketed the 1,2; the 13,8 −0,05 holds only on it), the lid 1.2 (its 1,3 −0,1 at its least) flush with the rim | 0fd2ddad (claude/wlo-barrel)
- 05-07/Wempe_05-07_08.jpg | corrected | the 1943 arbor 40,2 over all (bridge pivot 2.93, the square from 0.42 inside the bridge's hole); the hook a head on the Ø 2 pin, radial face 15° off its line, land falling to flush 5° past it | 0fd2ddad (claude/wlo-barrel)
- 05-07/Wempe_05-07_12.jpg; 05-07/Wempe_05-07_13.jpg | corrected | the band's hooks built from their 10:1 sheets (figures as written, the rest traced into lines and arcs) | 0fd2ddad (claude/wlo-barrel)

## Batch 8: going train
- 05-05/Wempe_05-05_07.jpg | corrected | the intermediate pinion's leaves 3.25 (re-measured: the 4,6 spans the leaves and the seat, the 1,3 the seat; 4.5), its seat flush with the wheel | 4c1725e6
- 05-05/Wempe_05-05_05.jpg; 05-05/Wempe_05-05_02.jpg | corrected | the intermediate and seconds wheels' hubs flush with their rims (the 0,2 the riveting; a hub 0.2 proud), the seconds wheel's face 9.2 from its shoulder | 4c1725e6
- 05-05/Wempe_05-05_10.jpg; 05-05/Wempe_05-05_07.jpg; 05-05/Wempe_05-05_04.jpg | corrected | the train-side shoulders one 30° cone from the pivot's root to the arbor (flat, chamfered 0.15) | 4c1725e6
- 05-05/Wempe_05-05_01.jpg | corrected | the arbors in 64 segments; the top-plate bushes' cups out to their rims (a 0.023 sliver ring) | 4c1725e6

## Batch 9: motion work, hands, dial
- 05-02/Wempe_05-02_08.jpg; 05-02/Wempe_05-02_10.jpg; 05-02/Wempe_05-02_02.jpg; 05-02/Wempe_05-02_03.jpg; 05-02/Wempe_05-02_04.jpg; 05-02/Wempe_05-02_05.jpg | corrected | every turned piece of the motion work and hands shaded square at its corners (the hour wheel's collar a dome, the bosses donuts) | 2303c7d9

## Batch 9 (open)
- 05-02/Wempe_05-02_13.jpg | kept | the Lange variant keeps the Wempe disc, only the printing swapped: 1453/A's Ø 103 × 1,5 (Eisen), Ø 2,2 seconds hole recorded in the README; its extra 0.2 meets the up-and-down hand's flange and the bezel's step, no sheet gives Lange's heights; 5177's screws at the Wempe's 354/120/240°, holes drilled at assembly | eaf9b16c (claude/wlo-motion)
- 05-02/Wempe_05-02_09.jpg | corrected | the hour wheel's riveting sink 0,4 × 30° (to the axis; Ø 6.46 at the face) on its lower face, the pipe's foot flared into it; the change wheel the same (05 02 02's section draws it, unfigured) | eaf9b16c (claude/wlo-motion)
- 05-02/Wempe_05-02_06.jpg; 05-02/Wempe_05-02_08.jpg | corrected | the wheels' bores polygons on their pipes' lathe angles (48, 64 sides: change wheel, hour wheel, change pinion, up-and-down wheel), the pipes on the flats, not 0.02-0.03 into them | eaf9b16c (claude/wlo-motion)

## Batch 10: case, gimbals, boxes, keys
- 05-01/Wempe_05-01_4.jpg | corrected | the bezel's glass a flat disc Ø 111.6 on the ring's seat at 12.3, 3.5 thick, chamfered, 2.4 proud of the ring's lip 13.4 high (re-measured at 6× on the section; the ring read 16 high wrapping a flush glass) | 5c49513b
- 05-01/Wempe_05-01_2.jpg | corrected | the bowl's floor one closed solid: the bottom on the wall's 360 corners at r 34.1, the turned profile ringed at its underside, the two walls face to face dropped after fuse (bowlJoin); no dotted ring (a 0.01 slot between r 34.09 and 34.1 drew it); the 6MX's the same | fa8e9487 (claude/wlo-case)
- 51-00/Wempe_51-00_2.jpg | corrected | the handle's ends 6 off the side and its middle's outside 12.5 (the section's "6", "12,5", the strip "3"; built 3 and 10), S-bends traced on the bottom view (were kinks), screws' heads Ø 6 at ±45, 10.5 into the wood; the finger recess the figure's 10 deep (R 10.5 → 10), its cove in rings of quads, no longer terraced | 76d7cc23 (claude/wlo-case)
- 05-01/Wempe_05-01_6.jpg | corrected | the 1940 key's body from the figured 32 over the stem's end (traced 31.74); the cone's traced line kept, its seat in the holder (KEYREST 33.43) unchanged | 76d7cc23 (claude/wlo-case)
- 05-01/Wempe_05-01_1.jpg | corrected | the ring bracket's screws tapped through the ring to its inside, as Schnitt A-B draws them (2.75 into it before) | 76d7cc23 (claude/wlo-case)
- 05-01/Wempe_05-01_1.jpg | kept | the bowl's tapped holes for the brackets' five screws not cut in the turned bowl (a hole across a turned part); the screws reach r 49.7, 3.3 into the 4 wall (1.3 before), and WN-78's embed relation has bom.py check their threads in the bowl's metal | 76d7cc23 (claude/wlo-case)
- 05-01/Wempe_05-01_9.jpg; 51-00/Wempe_51-00_4.jpg | corrected | the key tube's mouth sunk 60°, 1.1 deep to the square's flats (r 2.21 on the end face); the tongue's Ø 6.2 hole sunk 0.5 × 45° and its last 7 thinned 0.2, both on its outer face | 76d7cc23 (claude/wlo-case)
- 05-01/Wempe_05-01_1.jpg; 05-01/Wempe_05-01_7.jpg | corrected | the case's turned pieces (pivots' tips, key, lock) shaded square at their corners | 2303c7d9
- 05-03/Wempe_05-03_2.jpg; 05-04/Wempe_05-04_07-1.jpg; 05-04/Wempe_05-04_07-2.jpg | corrected | follow-on: the escapement's bodies from the solids after the timing weights and the escape wheel's web (WESC.SET I 2575.4, JW 9.53, ID 8.16; the 6MX's SET6 2521.0, 10.45, 7.94), HS -0.470 for the swing | 0ba0867d, 39116257
- 05-04/Wempe_05-04_07-1.jpg; 05-04/Wempe_05-04_07-2.jpg | corrected | follow-on: with the lighter escape wheel the locking stone lands on the escaping tooth's back with a blow; makeEsc counts it (RWD, the Wempe's), agreeing with dynamics.js within 1.2°; the cliff recorded (README, Unresolved) and the transmission check's bracket reported (the owner's choice) | 4e2c0f9c
- 05-04/Wempe_05-04_07-1.jpg; 05-04/Wempe_05-04_07-2.jpg | corrected | follow-on: the lock's deep tolerance where the swing stays in the guard band (0.244, from 0.2469: past it the escapement collapses in time, as on main); the Monte Carlo's preload and lock surface joint | e598afa8
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg | corrected | follow-on: the bored parts keep their tapped holes' threads (bore and capFix carry userData: the detent block's screw stood crest on crest); the bom relations of the bored holes (tap, press, clear) with their deviations | 0518a42a
- 05-05/Wempe_05-05_10.jpg; 05-05/Wempe_05-05_07.jpg; 05-05/Wempe_05-05_04.jpg | kept | follow-on: the shoulder cones' endshake read where they meet the jewel: the centre arbor 0.084, inside the 1958 book's 0.07-0.10; the 6MX's intermediate 0.103 (0.003 over) and seconds 0.093, recorded as deviations | 0518a42a
