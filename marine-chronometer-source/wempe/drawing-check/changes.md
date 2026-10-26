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
- 05-08/Wempe_05-08_11.jpg | open | the pillars' 90° countersinks drawn to the tap drill, 0.25 deep: built 0.03, the thread can't be cut through a countersink here (tried and reverted: fine.py) | 457b4a5e
- 05-08/Wempe_05-08_01a.jpg | open | revision a's "6,15 in 4,59" against P-Q's 4,5 H7 (4.506 kept); J-K's 22 at the floor or the face | ec88cb81
- 05-08/Wempe_05-08_03b.jpg; 05-08/Wempe_05-08_03a.jpg | open | the hidden Ø 5.8 round hole 30; the "9,5" across the hand-setting cut | ec88cb81
- 05-08/Wempe_05-08_07.jpg | kept | the M2.6 carried through the flange into the cone (Wempe 3955's dial side), the coloured section's blind holes not followed | —

## Batch 2: bridges, bushes, cocks, set-up click
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's relief step a 45° cone from r 12 in to r 11.2 (it ran out to 12.8), built as a strip; hole 20 a bay in it | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's boss turned, face Ø 6, a 45° flank to Ø 7.6 (Ø 5.8/7.5, faceted) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_05.jpg; 05-08/Wempe_05-08_06.jpg | corrected | the upper cock's two M1.2 tapped (Ø 0.95 plain), breaking 0.095 into the boss's face; their screws M1.2 (thinned to 0.46 before) | 2303c7d9
- 05-08/Wempe_05-08_14.jpg | corrected | the set-up click's outline walked from its lines and arcs (a distance field's contour: a sliver at the beak) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_14.jpg | corrected | the click's back r 12.5 through the beak's corner and tangent to the nose r 1 (0.18 short: a nick) | 44f47dea (live 3.36.01)
- 05-08/Wempe_05-08_14.jpg | corrected | the click 2.56 thick (2.6 −0.03/−0.05's middle), its screw's shoulder 2.61 | 2303c7d9
- 05-08/Wempe_05-08_14.jpg | open | the sheet's 17,4 overall against 17.53 from its own 9,7, 7,5 and r 1 (the figures drawn) | ec88cb81
- 05-08/Wempe_05-08_09.jpg | corrected | the dust bush's bottom: a 0.3 × 45° corner, a flat ring 0.5 wide, the face dished 5° to the bore (read as a 5° × 0.5 chamfer) | 2303c7d9
- 05-08/Wempe_05-08_02.jpg; 05-08/Wempe_05-08_09.jpg | corrected | the dust bush both ways (the owner's choice): waisted as 05 08 01 (1946) as last revised, straight as 05 08 01-3 (1942) as first drawn and in 1943 | 2c177006
- 05-08/Wempe_05-08_12.jpg; 05-08/Wempe_05-08_10.jpg | corrected | the steady pins WN-203 chamfered at both ends (0.1 × 45°, not figured) | 2303c7d9
- 05-08/Wempe_05-08_10.jpg | corrected | the intermediate bridge's 45° mouth at hole 38 on the bush's own ring (a 0.01 ledge) | 2303c7d9
- 05-08/Wempe_05-08_05.jpg | open | seams where the cock's boss and arm meet face to face (one mesh fused, faces kept) | ec88cb81

## Batch 3: balance, hairspring, stud, rollers
- 05-03/Wempe_05-03_2.jpg | corrected | the timing weights Ø 4.25 as drawn (re-measured: 4.21 and 4.33 at 12.0 px/mm; read 3.5 and 4.3, built 3.8), Wempe 3955's and the 6MX's 3.8 | 935291e6
- 05-03/Wempe_05-03_2.jpg | corrected | the mass screws WN-12 1.85 over the rim's lower face (re-measured 1.83-1.88; read 2.83, built 2.45), Wempe 3955's 2.55; their heads' faces following the mass's round side (two crescents) | 935291e6
- 05-03/Wempe_05-03_4.jpg | corrected | the rim's tapped holes Ø 0.9 at 2.15 for the timing screws, through steel and brass (the screws in the metal); the screws with their weights in each version's group, their heads following the rim's curve | 935291e6; 457b4a5e
- 05-03/Wempe_05-03_4.jpg | corrected | the rim's cuts with parallel walls 1.6 apart (radial) | 935291e6
- 05-03/Wempe_05-03_8.jpg | corrected | the collet's spring hole Ø 0.8 across its narrow end, 3.5 from the bore and 0.75 from its face; the pin through the bar's 2.7 in it | 935291e6
- 05-04/Wempe_05-04_04.jpg | corrected | the staff's arms one taper each, 1:30 above to Ø 1.2 at the step and 1:70 below (a cone and a cylinder; 1:16) | 935291e6
- 05-04/Wempe_05-04_04.jpg | corrected | the hub's neck opened to the collar's Ø 2.14 at its foot, so the two faces aren't in one plane (a serrated band) | 935291e6
- 05-03/Wempe_05-03_8.jpg | open | the collet's bore 1,6 H7 1:70 against the 1946 staff's seat (drawn straight 1.648) | ec88cb81
- 05-03/Wempe_05-03_3-2.jpg | open | the lower pivot 12.83 below the seat against this later staff's 12,6; its cones concave (the "6" unsure) | ec88cb81
- 05-03/Wempe_05-03_9.jpg | open | the stud's round point Ø 0.8 and its pin hole Ø 0.7 across the upright (the bore can't close it) | ec88cb81

## Batch 4: escape wheel, detent, detent block
- 05-04/Wempe_05-04_07-1.jpg; 05-04/Wempe_05-04_07-2.jpg | corrected | the escape wheel's web 0.7 and its recess 0.7 deep (re-measured: "0,8" struck for "0,7", the recess line at mid-thickness; 0.8) | 935291e6
- 05-04/Wempe_05-04_23.jpg | corrected | the crossings' middles 17.7° behind a tooth's tip (6°) | 935291e6
- 05-04/Wempe_05-04_07-2.jpg; 05-04/Wempe_05-04_07-1.jpg | corrected | the arbors' shoulders concave arcs r 3 from the pivot's root to the arbor (straight cones), both versions | 935291e6
- 05-04/Wempe_05-04_07-1.jpg | corrected | the first-drawn collet's cone Ø 3.0 to Ø 2.7 at 1.8 (to Ø 2.2) | 935291e6
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg | corrected | the detent's foot's clearance hole for its screw and its two pins' holes; the square's tapped hole for WN-14 | 935291e6
- 05-04/Wempe_05-04_02.jpg | corrected | the gold spring's head 2 high (1.9) with its hole Ø 0.7 1.2 from its end | 935291e6
- 05-04/Wempe_05-04_03.jpg | corrected | the block's M1 in its end face to the Ø 1.3 and the steady pins' holes, as last revised and in the 6MX (the screw and pins in the metal) | 935291e6
- 05-04/Wempe_05-04_03.jpg | open | the 1943 block's end-face holes (the bore won't close that block); its upright's joint drawn convex about r 2 though figured 3 r (the cove kept) | ec88cb81
- 05-04/Wempe_05-04_10-1_Wempe_Griessbach.jpg | open | the blade flush with one side of its thicker part (re-measured: sure), 0.11 off the spring's plane; which side faces the block not read (it would turn the detent 0.34° about the stone): left centred | ec88cb81
- 05-04/Wempe_05-04_01.jpg | open | the block screw 23,8 from the wheel against hole 13's 23.41 in the plate's table (the table kept) | ec88cb81

## Batch 5: fusee group
- 05-06/Wempe_05-06_07.jpg | corrected | the fusee wheel's lip alone at the full 2.62, the rim and teeth 0.2 lower (the other way round) | e96fa808
- 05-06/Wempe_05-06_07.jpg | corrected | the fusee wheel's hub 0.4 under the lip, a 45° flank 1.0 down to Ø 16.6 (as high as the lip, its edge 0.5 × 45°) | e96fa808
- 05-06/Wempe_05-06_16.jpg | corrected | the click wheel's 0.3 × 45° on its face against the body (on the free face) | e96fa808
- 05-06/Wempe_05-06_02-2.jpg; 05-06/Wempe_05-06_03-2.jpg | corrected | the fusee body and every turned part of the fusee group shaded square at their corners (KIT.crease; a dish, a donut, a radial seam) | e96fa808
- 05-06/Wempe_05-06_15.jpg | corrected | the arbor's square shaded flat with its corners (a 4-sided smooth cylinder) | c965d11e
- 05-06/Wempe_05-06_02-2.jpg; 05-06/Wempe_05-06_20.jpg | open | the groove's walls stepped on the lathe's 0.04 rows (a swept profile would be exact) | ec88cb81

## Batch 6: maintaining work, stop work
- 05-06/Wempe_05-06_14.jpg | corrected | the maintaining clicks' top edge one line tangent to the boss, y = 1.738 − 0.585x, rounding r 0.2 into the base (kinked to a sharp tip, up to 0.30 thin) | e96fa808
- 05-06/Wempe_05-06_12.jpg | corrected | the cup's holes Ø 0.6 for the click springs' pins at 42° and 60° (the pins in the metal) | e96fa808
- 05-06/Wempe_05-06_11.jpg | corrected | the click screws WN-21's heads 0.9 high and their ends domed 0.25 inside the cup's rim (0.5, flat, 0.12 past it) | e96fa808
- 05-06/Wempe_05-06_10.jpg | corrected | the maintaining spring's contour on a 0.02 grid (0.05: stair-stepped end) | e96fa808
- 05-06/Wempe_05-06_10.jpg | open | the spring's eye joined to its band (the eye r 1,8 about a hole at r 14,2 stops 0.125 inside the band) and its swell as the r 6 arc | ec88cb81
- 05-06/Wempe_05-06_04.jpg | open | C-D's "3,2" travel and "2"/"12" against the bar drawn 3.6 and r 12.36-12.51; the stop spring's traced end turning back round the pin (shaded inside out there) | ec88cb81
- 05-06/Wempe_05-06_13.jpg; 05-06/Wempe_05-06_12.jpg | open | the click springs' own Ø 0,6 holes; WN-21's M1,7 thread; the ratchet as first drawn (tips Ø 37,5, no chamfer) | ec88cb81

## Batch 7: barrel group
- 05-07/Wempe_05-07_04.jpg; 05-07/Wempe_05-07_07.jpg | corrected | the lid flush with the rim (re-measured: on the rim's line, the 0,6 the arbor's shoulder over it; sunk 0.6), its edge one 5° face Ø 39.2 to 39.39, the drum's seat cut to match 1.3 deep | c965d11e
- 05-07/Wempe_05-07_04.jpg; 05-07/Wempe_05-07_08.jpg | corrected | the arbor's core faces Ø 10 with 1.65 × 45° chamfers (Ø 9 and 2.15, the 1941 core's) | c965d11e
- 05-06/Wempe_05-06_20.jpg; 05-07/Wempe_05-07_04.jpg | corrected | the mainspring drawn 15 high in the drum's 15.53 inside (14.8) | c965d11e
- 05-07/Wempe_05-07_06.jpg; 05-07/Wempe_05-07_07.jpg | corrected | the drum, lid and arbor shaded square at their corners (KIT.crease) | e96fa808
- 05-07/Wempe_05-07_06.jpg | open | the drum's seat 1,2 against the lid's 1,3 (cut 1.3) | ec88cb81
- 05-07/Wempe_05-07_08.jpg | open | the 1943 arbor 40.65 against 40,2; the hook's ramp as a radial face 15° off the line | ec88cb81
- 05-07/Wempe_05-07_12.jpg; 05-07/Wempe_05-07_13.jpg | open | the band's hooks still placeholders | ec88cb81

## Batch 8: going train
- 05-05/Wempe_05-05_07.jpg | corrected | the intermediate pinion's leaves 3.25 (re-measured: the 4,6 spans the leaves and the seat, the 1,3 the seat; 4.5), its seat flush with the wheel | 4c1725e6
- 05-05/Wempe_05-05_05.jpg; 05-05/Wempe_05-05_02.jpg | corrected | the intermediate and seconds wheels' hubs flush with their rims (the 0,2 the riveting; a hub 0.2 proud), the seconds wheel's face 9.2 from its shoulder | 4c1725e6
- 05-05/Wempe_05-05_10.jpg; 05-05/Wempe_05-05_07.jpg; 05-05/Wempe_05-05_04.jpg | corrected | the train-side shoulders one 30° cone from the pivot's root to the arbor (flat, chamfered 0.15) | 4c1725e6
- 05-05/Wempe_05-05_01.jpg | corrected | the arbors in 64 segments; the top-plate bushes' cups out to their rims (a 0.023 sliver ring) | 4c1725e6

## Batch 9: motion work, hands, dial
- 05-02/Wempe_05-02_08.jpg; 05-02/Wempe_05-02_10.jpg; 05-02/Wempe_05-02_02.jpg; 05-02/Wempe_05-02_03.jpg; 05-02/Wempe_05-02_04.jpg; 05-02/Wempe_05-02_05.jpg | corrected | every turned piece of the motion work and hands shaded square at its corners (the hour wheel's collar a dome, the bosses donuts) | 2303c7d9

## Batch 9 (open)
- 05-02/Wempe_05-02_13.jpg | open | the Lange dial variant keeps the Wempe disc (1453/A: Ø 103, 1,5 thick, Ø 2,2 seconds hole, no screw holes); the variant swaps only the printing | 5c49513b
- 05-02/Wempe_05-02_09.jpg | open | the hour wheel's 0,4 × 30° riveting sink and the change wheel's rivet relief (05 02 02, unsure) | 5c49513b
- 05-02/Wempe_05-02_06.jpg; 05-02/Wempe_05-02_08.jpg | open | the wheels' bores in 24 flats under their pipes' finer seats (0.02-0.03 into the flats, under fine.py's grid) | 5c49513b

## Batch 10: case, gimbals, boxes, keys
- 05-01/Wempe_05-01_4.jpg | corrected | the bezel's glass a flat disc Ø 111.6 on the ring's seat at 12.3, 3.5 thick, chamfered, 2.4 proud of the ring's lip 13.4 high (re-measured at 6× on the section; the ring read 16 high wrapping a flush glass) | 5c49513b
- 05-01/Wempe_05-01_2.jpg | corrected | the bowl's floor disc on the wall's own 360 corners (a dotted ring where 240 facets crossed them) | 5c49513b
- 51-00/Wempe_51-00_2.jpg | open | the box's handle 13 off the panel with S-bends (built 10, kinked: likely) and the finger recess's "10" deep (R 10.5), terraced | 5c49513b
- 05-01/Wempe_05-01_6.jpg | open | the 1940 key's stem 32 out of its body (31.7, as drawn 31.74) | 5c49513b
- 05-01/Wempe_05-01_1.jpg | open | the bowl's tapped holes for the brackets' five screws; the ring bracket's screws drawn right through the ring (tapped 2.75) | 5c49513b
- 05-01/Wempe_05-01_9.jpg; 51-00/Wempe_51-00_4.jpg | open | the key tube's 60° countersink; the tongue's 0.5 × 45° chamfer and thinned end | 5c49513b
- 05-01/Wempe_05-01_1.jpg; 05-01/Wempe_05-01_7.jpg | corrected | the case's turned pieces (pivots' tips, key, lock) shaded square at their corners | 2303c7d9
