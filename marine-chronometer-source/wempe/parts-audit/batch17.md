# Batch 17: Federchronometer 05 (the coloured section of the whole movement)

Reader's file. Sheet: `References/wempe/drawings/Wempe_Einheitschronometer.jpg`, read on `Wempe_Einheitschronometer_hires.jpg` (5099 x 2061 px). Crops are kept in `E:/mc-video/wpa-audit/crops/` (outside the repository).

## 1. Federchronometer 05

### Title block as read
- Name: "Federchronometer 05" (large lettering, top right). Credit line: Johannes Altmeppen (by courtesy of Gerhard D. Wempe KG) 2017. A composite of two scanned halves (join at x about 2550 of the hi-res print) with a grey strip pasted in at the join (the centre arbor and cannon tube).
- No scale, material, treatment, surface, general tolerance, date or revision is printed. No dimension (figure with extension lines) is printed anywhere. Which chronometer: the Einheits-Chronometer (parts 05 0x xx-x with WN screw numbers).

### Views
One developed section: the movement is cut through every arbor and laid out in one plane, dial at the bottom, top plate and balance cock at the top, y increasing toward the dial in the model's frame. Left half: barrel, fusee, its dust cover and the winding side, barrel bridge, dial work. Right half: centre, intermediate, seconds, escape arbors, balance staff with hairspring and cock, pillar. It gives heights only, not plan places. Every part is labelled in two columns at the side with its name and number.

### Scale (stated as the brief asks)
There are no printed sizes, so the scale is fixed on the two plates, both cut in section in the right half: top plate top face to pillar plate underside is 586.5 px for 3.35 + 19.0 + 3.35 = 25.70 mm, so 22.82 px/mm; the left half measures 22.8. That fit forces the three plate numbers (items 1, 2-4). The dial is an independent check: its top face reads 10.31 mm below the pillar plate's top against 10.35 built, its thickness 1.3 against 1.2 (items 5-7). With the dial agreeing within 0.05 mm the scale is good to about 0.3 % along y. Sharp edges are read to 2 px (about 0.1 mm); a hatched or dotted edge to about 0.2 mm; where a feature is hidden or ill-defined the certainty says so. Diameters are read along x on the same scale (the print's x and y scales agree: the fusee arbor's Ø 7.04 reads 7.1, its Ø 4.4 reads 4.38). Heights are y in the movement frame, measured from the pillar plate's top face (y 0); for an arbor, y = the placement's origin y + the measure file's local z (checked against `placements.json` boxes). Where a built y is given with only a local z, that conversion was used.

### Findings from step 2 (the views against each other)
- There is one view, so there is no plan to compare; the section agrees with itself on the plates (same thickness at both halves) and on the dial.
- The grey strip at the join (centre arbor with the minute pinion, cannon tube, hands) is a different image pasted in; its scale is not tied to the rest, so its heights are `can't tell`.
- The barrel arbor and the fusee arbor both draw the winding square as a crossed (X) rectangle, tip domed; the X marks a square.
- The left half's barrel bridge (-25.65..-22.35) lies over the barrel; the top plate (-22.35..-19) is cut away there and shows only at the fusee and in the right half.

### Items
| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 17-1-1 | scale: top plate's top face to pillar plate's underside (both plates cut in section, right half) | 586.5 px in the 5099 px print = 25.70 mm gives 22.82 px/mm (the left half checks at 22.8) (sure) | placements 050901 box y -22.35; 050802-1 box y 3.35: 25.70 | 0 (calibration) | match |
| 17-1-2 | top plate 05 08 01-1 thickness (hatched band, right half) | 3.44 (rows 801.5-880; +-0.1) (likely) | measure topPlate size z 3.35: 3.35 | +0.09 | match |
| 17-1-3 | pillar plate (Unterplatte 05 08 02-1) thickness | 3.29 (rows 1313-1388; +-0.1) (likely) | measure pillarPlate size z 3.35: 3.35 | -0.06 | match |
| 17-1-4 | clear gap, top plate's underside to pillar plate's top face | 19.0 (433 px; with the two thicknesses it sets the scale) (sure) | placements 050901 y max -19.0; 050802-1 y min 0: 19.0 | 0 (calibration) | match |
| 17-1-5 | dial (Zifferblatt 05 02 00-4) top face below the pillar plate's top face (independent of the scale fit) | 10.31 (row 1548; +-0.15) (likely) | placements 050200-4 box y 10.35: 10.35 | -0.04 | match |
| 17-1-6 | dial thickness | 1.3 (rows 1548-1578.5; +-0.15) (likely) | measure dial size z 1.2: 1.2 | +0.1 | match |
| 17-1-7 | pillar plate's underside to dial's top face | 7.0 (rows 1388-1548) (likely) | placements 050802-1 y max 3.35; 050200-4 y min 10.35: 7.0 | 0 | match |
| 17-1-8 | barrel bridge (Federhausbruecke 05 08 05-1) y span, left half | -25.66 to -22.5 (3.2 thick; +-0.15) (likely) | placements 050805-1 box y -25.65..-22.35: -25.65..-22.35 | -0.01 / -0.15 | match |
| 17-1-9 | intermediate bridge (Zwischenbruecke 05 08 04-1) y span | 3.34 to 7.3 (+-0.25) (unsure) | placements 050804-1 box y 3.35..7.15: 3.35..7.15 | 0 / +0.15 | match |
| 17-1-10 | upper cock (Unruhkloben oben 05 08 03-1) top face (hatched cut, over the balance) | -37.74 (+-0.2); an unhatched outline beyond the cut reaches -39.0 (a block, not read) (unsure) | placements 050803-1 box y -37.35: -37.35 | -0.39 | mismatch |
| 17-1-11 | upper cock's underside at its left leg | -34.1 (+-0.2) (unsure) | measure upperCock z_levels 3.2 (top -37.35, so y -34.15): -34.15 | +0.05 | match |
| 17-1-12 | upper cock's underside over the balance jewel (right of the leg) | -35.0 (it steps up 0.9 from the leg's face; +-0.2) (unsure) | measure upperCock z_levels [0, 3.2, 11.8, 12.3, 12.6, 15.0]: no face near y -35.0: none | n/a | can't tell |
| 17-1-13 | lower balance cock (Unruhkloben unten 05 08 00-2) y span (hatched block under the top plate) | -19.6 to -8.65 (+-0.25); the top abuts the top plate's underside (unsure) | placements 050800-2 box y -19..-9: -19..-9 | bottom -0.35 (top abuts) | match |
| 17-1-14 | label of the top plate | Oberplatte 05 08 01-1 (sure, hi-res print) (sure) | measure topPlate hn 050901: 050901 | hn differs | mismatch |
| 17-1-15 | labels of the pillar plate, pillar, dial and ring | Unterplatte 05 08 02-1; Pfeiler 05 08 00-1; Zifferblatt 05 02 00-4; Werkring 05 08 00-3 (sure) (sure) | hn 050802-1; 050800-1; 050200-4; 050800-3: same | 0 | match |
| 17-1-16 | labels of the fusee and barrel parts | Schneckenwelle 05 06 04-1; Schneckenkoerper 05 06 04-2; Federkern 05 07 02-1; Federhaustrommel 05 07 01-1; Federhausdeckel 05 07 01-2 (sure) (sure) | hn 050604-1; 050604-2; 050702-1; 050701-1; 050701-2: same | 0 | match |
| 17-1-17 | labels of the train and escapement parts | Minutentrieb 05 05 03-2; Minutenrohr 05 05 03-3; Zwischentrieb 05 05 02-2; Sekundentrieb 05 05 01-2; Gangtrieb 05 04 05-2; Unruhwelle 05 04 02-1; Stundenrad 05 02 03-1 (sure) (sure) | hn 050503-2; 050503-3; 050502-2; 050501-2; 050405-2; 050402-1; 050203-1: same | 0 | match |
| 17-1-18 | label Zugfeder (mainspring) | Zugfeder 05 07 00-2 (sure) (sure) | no 050700-2 line in placements.json or page/; 050700-6 (a 38 mm wide body) may be it: none under that number | absent | not built |
| 17-1-19 | label Bandhaken f. Trommel | 05 07 06-3 (likely) (likely) | no 050706-3 line in placements.json or page/: none under that number | absent | not built |
| 17-1-20 | labels of screws WN-27 (fusee, left), WN-13, WN-15, WN-16 | Schrb. WN-27; Schraube WN-13; Schrb. WN-15; Schrb. WN-16 (sure) (sure) | placements.json has WN-10, 11, 12, 14, 18, 19, 20, 21, 22, 34, 52, 53, 55, 56, 57 but none of 13, 15, 16, 27: none | absent (or carried under another key) | not built |
| 17-1-21 | barrel arbor (Federkern 05 07 02-1): core diameter | 13.5 (617 px at 45.6 px/mm; +-0.15) (unsure) | barrelArbor cylinders[1].d 13.3: 13.3 | +0.2 | match |
| 17-1-22 | barrel arbor: core's cylindrical length, y | -17.70 to -7.76 (+-0.15) (likely) | barrelArbor cylinders[1].z -16.73..-8.45: -16.73..-8.45 | -0.97 / +0.69 | mismatch |
| 17-1-23 | barrel arbor: core's end chamfers | 1.05 axial by about 2.1 radial (to about D 9.3 at the face); outer ends -18.75 and -6.66 (likely) | barrelArbor cones[0..1] d 10->13.3, z -18.38..-16.73 and -8.45..-6.8, half-angle 45: 1.65 x 1.65 | 27 deg against 45 deg; ends -0.37 / -0.14 | mismatch |
| 17-1-24 | barrel arbor: neck above the core (inside the cover's boss) | D 5.13, y -22.2 to -18.75 (+-0.12) (likely) | barrelArbor cylinders[2].d 4.48, z -22.32..-18.38: 4.48 | +0.65 | mismatch |
| 17-1-25 | barrel arbor: neck below the core, down to the pillar plate | D 4.93, y -6.66 to -0.04 (likely) | barrelArbor cylinders[3].d 4.48, z -6.8..-0.03: 4.48 | +0.45 | mismatch |
| 17-1-26 | barrel arbor: journal through the barrel bridge | D 4.0 (+-0.12) (likely) | barrelArbor cylinders[4].d 3.88, z -25.24..-22.32: 3.88 | +0.12 | match |
| 17-1-27 | barrel arbor: dial-side journal in the pillar plate | D 2.98 (likely) | barrelArbor cylinders[5].d 2.88, z -0.03..4.35: 2.88 | +0.10 | match |
| 17-1-28 | barrel arbor: dial-side end (a drawn bullet point) | y +6.3 (dome starts 4.6) (likely) | barrelArbor box z max 4.95 (cones end 4.35..4.95): 4.95 | +1.35 | mismatch |
| 17-1-29 | barrel arbor: top end above the bridge (domed) | y -36.45 (dome from -35.0) (likely) | barrelArbor z_levels -25.25 .. -35.25 (section_y0 [0.3,-35.25]; chamfer to -34.75): -35.25 | -1.2 | mismatch |
| 17-1-30 | barrel arbor: winding square across the flats | 2.76 (63 px at 22.8 px/mm) (likely) | barrelArbor outlines_by_level -25.25 lines len 2.7: 2.7 | +0.06 | match |
| 17-1-31 | barrel arbor: square's lower end | -25.5 (likely) | barrelArbor z_levels -25.25: -25.25 | -0.25 | match |
| 17-1-32 | fusee arbor (Schneckenwelle 05 06 04-1): collar into the body | D 7.1; y -16.55 to -8.6 (36.5 px/mm) (sure) | fuseeArbor cylinders D 7.04, z -16.625..-8.725: 7.04 | +0.06; +0.07 / +0.12 | match |
| 17-1-33 | fusee arbor: step under the cover | D 6.16; y -19.5 to -16.55 (likely) | fuseeArbor cylinders D 6.1, z -19.725..-16.625: 6.1 | +0.06; +0.2 on the top | match |
| 17-1-34 | fusee arbor: upper journal (through the dust cover) | D 4.38 (160 px); to y -19.5 (sure) | fuseeArbor cones d 4.39-4.5, z -27.725..-19.725: 4.39-4.5 | -0.01 | match |
| 17-1-35 | fusee arbor: lower neck (Vorreiber's seat) | D 4.4; y -8.6 to 0.0 (sure) | fuseeArbor cones d 4.38-4.5, z -8.725..-0.025: 4.38-4.5 | 0 | match |
| 17-1-36 | fusee arbor: pivot through the pillar plate | D 2.7 (sure) | fuseeArbor cones d 2.7072-2.8, z -0.025..6.475: 2.71-2.8 | 0 | match |
| 17-1-37 | fusee arbor: winding square, across flats and lower end | 3.18 (+-0.1); lower end y -28.0 (+-0.2) (likely) | fuseeArbor outlines_by_level -27.725 line len 3.0883: 3.09; -27.725 | +0.09; -0.28 | match |
| 17-1-38 | fusee arbor: top end (square then dome) | dome top y -46.45 (dome from -44.76) (likely) | fuseeArbor box z min -48.025 (section_y0 [0,-48.025]): -48.025 | +1.6 (drawn shorter) | mismatch |
| 17-1-39 | fusee arbor: dial-side end | about 9.7, hidden in a hub (unsure) | fuseeArbor z max 10.1: 10.1 | -0.4 | can't tell |
| 17-1-40 | fusee body (Schneckenkoerper 05 06 04-2): small end face | -18.4 (under a thin dust plate); +-0.2 (unsure) | fusee box z min -18.475: -18.475 | +0.07 | match |
| 17-1-41 | fusee body: large end and its flange | the hatched body ends near y -8.4 on a stack of ratchet, cover plate and plates to -5.5; the model's D 35.6 flange (-7.9..-6.1) can't be told apart from the stack (unsure) | fusee cylinders outside D 35.6, z -7.94..-6.24: -6.125 | n/a | can't tell |
| 17-1-42 | barrel drum (Federhaustrommel 05 07 01-1): y span | -21.7 to -3.73 (+-0.15) (likely) | drum cylinders[3] D 41.6 z -21.73..-3.85, cone to -3.65: -21.73..-3.65 | +0.03 / -0.08 | match |
| 17-1-43 | barrel drum: outer diameter (right wall; the left wall reads 43 and carries a boss) | 41.9 (r 20.97) (unsure) | drum cylinders D 41.6: 41.6 | +0.3 | match |
| 17-1-44 | barrel drum: bore | 38.8 (+-0.2) (unsure) | drum cylinders[0].d 38.5: 38.5 | +0.3 | match |
| 17-1-45 | centre arbor (Minutentrieb 05 05 03-2): top pivot tip | -21.2: but the arbor is a grey strip pasted into the drawing, its scale not fixed (unsure) | centreArbor box y -21.96: -21.96 | +0.76 | can't tell |
| 17-1-46 | cannon pinion tube (Minutenrohr 05 05 03-3) y span, same pasted strip | 5.0 to 19.4 (unsure) | placements 050503-3 box y 4.07..18.25: 4.07..18.25 | +0.9 / +1.15 | can't tell |
| 17-1-47 | minute wheel (Minutenrad 05 05 03-1) y span | -1.8 to -0.6 (+-0.2) (unsure) | placements 050503-1 box y -1.74..-0.49: -1.74..-0.49 | -0.06 / -0.11 | match |
| 17-1-48 | intermediate arbor (Zwischentrieb 05 05 02-2): top pivot tip | -21.66 (+-0.2) (unsure) | intermediateArbor box y -21.92: -21.92 | +0.26 | match |
| 17-1-49 | intermediate arbor: shaft diameter | 1.75 (60 px at 34.2 px/mm; +-0.12) (unsure) | intermediateArbor cylinders D 1.95: 1.95 | -0.2 | can't tell |
| 17-1-50 | intermediate arbor: pinion y span (tips D 4.8 drawn) | -2.95 to -0.3 (unsure) | intermediateArbor z_levels 15.95..19.2, origin y -18.97: y -3.02..0.23; teeth tips_d 4.72: -3.02..0.23 | +0.07 / -0.53 | mismatch |
| 17-1-51 | intermediate wheel (Zwischenrad 05 05 02-1) seat, y span | 0.1 to 1.3 (unsure) | intermediateArbor cylinders D 4.0, z 19.2..20.45 (y 0.23..1.48): 0.23..1.48 | -0.13 / -0.18 | match |
| 17-1-52 | intermediate arbor: dial-side pivot tip | 7.4 (unsure) | intermediateArbor box y 6.98: 6.98 | +0.42 | can't tell |
| 17-1-53 | seconds arbor (Sekundentrieb 05 05 01-2): top pivot tip | -21.5 (+-0.2) (unsure) | secondsArbor box y -21.98: -21.98 | +0.48 | mismatch |
| 17-1-54 | seconds arbor: shaft diameter | 1.55 (likely) | secondsArbor cylinders D 1.5: 1.5 | +0.05 | match |
| 17-1-55 | seconds pinion tube: width and y span | D 3.2; y -4.1 to 3.3 (+-0.2) (unsure) | secondsArbor teeth tips_d 3.166; z 14.85..21.85, origin y -18.975: y -4.13..2.88: 3.17; -4.13..2.88 | +0.03; 0 / +0.42 | match |
| 17-1-56 | seconds wheel (Sekundenrad 05 05 01-1) y span | -5.0 to -4.1 (likely) | placements 050501-1 box y -5.12..-4.12: -5.12..-4.12 | +0.12 / +0.02 | match |
| 17-1-57 | seconds arbor: dial-side end (inside the hand's collar) | 13.0 (+-0.25) (unsure) | secondsArbor box y 12.28: 12.28 | +0.7 | mismatch |
| 17-1-58 | escape arbor (Gangtrieb 05 04 05-2): shaft diameter between the wheel's hub and the pinion | 1.38 (63 px at 45.6; +-0.1) (unsure) | escapeArbor cylinders D 1.2 (-17.9..-12.5), 1.07 (-12.5..-7.5): 1.2 / 1.07 | +0.18 / +0.31 | mismatch |
| 17-1-59 | escape pinion y span (tips D 2.85 drawn) | -6.4 to -2.35 (+-0.15) (likely) | escapeArbor teeth z -5.5 centre, tips_d 2.97; cylinder gap -7.5..-3.5: -7.5..-3.5 | +1.1 / +1.15 | mismatch |
| 17-1-60 | escape arbor: top pivot tip, in the jewel | -19.9 (+-0.15) (likely) | escapeArbor box y -20.98: -20.98 | +1.08 | mismatch |
| 17-1-61 | escape arbor: dial-side pivot tip | 2.05 (likely) | escapeArbor box y 1.8: 1.8 | +0.25 | match |
| 17-1-62 | escape wheel's hub (Gangradbutzen 05 04 05-3) y span | -18.0 to -12.1 (unsure) | placements 050405-3 box y -17.9..-12.5: -17.9..-12.5 | -0.1 / +0.4 | match |
| 17-1-63 | escape wheel disc (Gangrad 05 04 05-1) y span | bands at about -18.6 to -18.1 and -16.8 to -16.3 in the section; not resolved (unsure) | placements 050405-1 box y -18.6..-17.2: -18.6..-17.2 | n/a | can't tell |
| 17-1-64 | balance staff (Unruhwelle 05 04 02-1): thin upper section diameter | 1.1 (likely) | staff cones d 1.05-1.2, z -33.4..-28.9: 1.05-1.2 | 0 | match |
| 17-1-65 | balance staff: thick section diameter | 1.64 (likely) | staff cones d 1.58-1.65, z -28.9..-23.9: 1.58-1.65 | 0 | match |
| 17-1-66 | balance staff: where the thin section widens | y -29.9 (+-0.2) (unsure) | staff z_levels -28.9: -28.9 | -1.0 | mismatch |
| 17-1-67 | balance staff: upper pivot tip | -35.4 (unsure) | staff box y -35.8: -35.8 | +0.4 | can't tell |
| 17-1-68 | balance staff: lower pivot tip | -9.75 (unsure) | staff box y -10.21: -10.21 | +0.46 | can't tell |
| 17-1-69 | escape top jewel: hole stone (top plate) | y -19.9 to -18.8, flush with the plate's underside (+-0.15) (likely) | placements 050406-1.eu box y -20.94..-20.14: -20.94..-20.14 | +1.04 / +1.34 | mismatch |
| 17-1-70 | escape top jewel: cap stone (convex) | y -21.27 to -20.15 (likely) | placements 050408-1.eu box y -21.91..-21.01: -21.91..-21.01 | +0.64 / +0.86 | mismatch |
| 17-1-71 | escape lower jewel: hole stone (pillar plate) | y 0.7 to 2.0 (likely) | placements 050406-1.el box y 0.99..1.78: 0.99..1.78 | -0.29 / -0.22 | match |
| 17-1-72 | escape lower jewel: cap stone | y 2.05 to 3.15 (unsure) | placements 050408-1.el box y 1.83..2.58: 1.83..2.58 | +0.22 / +0.57 | mismatch |
| 17-1-73 | hour wheel (Stundenrad 05 02 03-1) y span | 6.9 to 7.8 (unsure) | placements 050203-1 box y 6.62..7.62: 6.62..7.62 | +0.28 / +0.18 | match |

### Extras (the part has it, the section does not show it)
- The model's case, box and gimbal lines (0501xx, 0509xx apart from the plates, Holzkasten, Deckelglas, Scharnier, Schluesselhalter and the rest), which a movement section cannot show. I did not look for every WN screw and pin of the model one by one on the section (not checked).

### What the section shows that the model lacks
- Labels with no line of that number in `placements.json` or `page/`: Zugfeder 05 07 00-2, Bandhaken f. Trommel 05 07 06-3, and screws WN-13, WN-15, WN-16, WN-27 (items 18-20). The mainspring may be carried as 050700-6 (unsure), and the screws may sit under other keys.
- The top plate's number: the sheet calls it Oberplatte 05 08 01-1; the model's hn is 050901 (item 14).
- Everything else labelled in the stack that I looked up (about 70 numbers: 05 06 0x, 05 07 0x, 05 05 0x, 05 04 0x, 05 03 0x, 05 02 0x, 05 08 0x and the WN-10 to WN-57 and 201-205, 300-302 families) has a line in `placements.json`.

### After the verdicts
(Only what the recipes say; no verdict is changed.)
- `tools/recipes/wempe.py` `barrelArbor()` builds the core Ø 13.3 "with its chamfered ends", journals Ø 4.48 and Ø 3.88, the square 2.7 and "the dial end domed", from sheet 05 07 02-1 (020704-1) via `BARprof`/`WD.BAR`. So the model's numbers come from the detail sheet, and the section differs from that sheet in the core's length, the chamfer angle and the neck diameters and the ends (items 22-25, 28, 29). Which of the two is right is for the verifier and the detail sheet's batch.
- `fuseeArbor()` takes its profile from 05 06 04-1 (journal Ø 4.5 to 4.39, step 6.1, collar 7.04, pivot 2.8 to 2.7) and ends in a cone through the square; these agree with the section (items 32-37). The top end differs by 1.6 mm (item 38); the recipe's tip length (`F['len']`, `LS`) comes from the fusee sheet, not from this section.
- `escapeArbor()` is built by `trainArbor` from 05 04_8 (z 10, tips Ø 2.97) and 05 04_7.2 (pivot shoulders concave); it takes the pinion's place from `escapement.js`'s profile, not from this section. I did not trace why the section puts the pinion 1.1 mm lower (items 58, 59, 60).

## Summary

Counts: 73 items: 41 match, 19 mismatch, 3 not built, 10 can't tell.

Mismatches and not built, one line each:
- 17-1-10 (mismatch): upper cock (Unruhkloben oben 05 08 03-1) top face (hatched cut, over the balance); drawn -37.74 (+-0.2); an unhatched outline beyond the cut reaches -39.0 (a block, not read); built -37.35; delta -0.39
- 17-1-14 (mismatch): label of the top plate; drawn Oberplatte 05 08 01-1 (sure, hi-res print); built 050901; delta hn differs
- 17-1-18 (not built): label Zugfeder (mainspring); drawn Zugfeder 05 07 00-2 (sure); built none under that number; delta absent
- 17-1-19 (not built): label Bandhaken f. Trommel; drawn 05 07 06-3 (likely); built none under that number; delta absent
- 17-1-20 (not built): labels of screws WN-27 (fusee, left), WN-13, WN-15, WN-16; drawn Schrb. WN-27; Schraube WN-13; Schrb. WN-15; Schrb. WN-16 (sure); built none; delta absent (or carried under another key)
- 17-1-22 (mismatch): barrel arbor: core's cylindrical length, y; drawn -17.70 to -7.76 (+-0.15); built -16.73..-8.45; delta -0.97 / +0.69
- 17-1-23 (mismatch): barrel arbor: core's end chamfers; drawn 1.05 axial by about 2.1 radial (to about D 9.3 at the face); outer ends -18.75 and -6.66; built 1.65 x 1.65; delta 27 deg against 45 deg; ends -0.37 / -0.14
- 17-1-24 (mismatch): barrel arbor: neck above the core (inside the cover's boss); drawn D 5.13, y -22.2 to -18.75 (+-0.12); built 4.48; delta +0.65
- 17-1-25 (mismatch): barrel arbor: neck below the core, down to the pillar plate; drawn D 4.93, y -6.66 to -0.04; built 4.48; delta +0.45
- 17-1-28 (mismatch): barrel arbor: dial-side end (a drawn bullet point); drawn y +6.3 (dome starts 4.6); built 4.95; delta +1.35
- 17-1-29 (mismatch): barrel arbor: top end above the bridge (domed); drawn y -36.45 (dome from -35.0); built -35.25; delta -1.2
- 17-1-38 (mismatch): fusee arbor: top end (square then dome); drawn dome top y -46.45 (dome from -44.76); built -48.025; delta +1.6 (drawn shorter)
- 17-1-50 (mismatch): intermediate arbor: pinion y span (tips D 4.8 drawn); drawn -2.95 to -0.3; built -3.02..0.23; delta +0.07 / -0.53
- 17-1-53 (mismatch): seconds arbor (Sekundentrieb 05 05 01-2): top pivot tip; drawn -21.5 (+-0.2); built -21.98; delta +0.48
- 17-1-57 (mismatch): seconds arbor: dial-side end (inside the hand's collar); drawn 13.0 (+-0.25); built 12.28; delta +0.7
- 17-1-58 (mismatch): escape arbor (Gangtrieb 05 04 05-2): shaft diameter between the wheel's hub and the pinion; drawn 1.38 (63 px at 45.6; +-0.1); built 1.2 / 1.07; delta +0.18 / +0.31
- 17-1-59 (mismatch): escape pinion y span (tips D 2.85 drawn); drawn -6.4 to -2.35 (+-0.15); built -7.5..-3.5; delta +1.1 / +1.15
- 17-1-60 (mismatch): escape arbor: top pivot tip, in the jewel; drawn -19.9 (+-0.15); built -20.98; delta +1.08
- 17-1-66 (mismatch): balance staff: where the thin section widens; drawn y -29.9 (+-0.2); built -28.9; delta -1.0
- 17-1-69 (mismatch): escape top jewel: hole stone (top plate); drawn y -19.9 to -18.8, flush with the plate's underside (+-0.15); built -20.94..-20.14; delta +1.04 / +1.34
- 17-1-70 (mismatch): escape top jewel: cap stone (convex); drawn y -21.27 to -20.15; built -21.91..-21.01; delta +0.64 / +0.86
- 17-1-72 (mismatch): escape lower jewel: cap stone; drawn y 2.05 to 3.15; built 1.83..2.58; delta +0.22 / +0.57

Could not read or tell:
- The centre arbor, cannon tube and hands: a pasted grey strip with no scale tie (items 45, 46).
- The fusee body's large end and flange, hidden in the stack of ratchet, cover plate and plates (item 41); the fusee arbor's dial-side end (item 39).
- The cock's underside step over the balance jewel, the intermediate arbor's shaft diameter (-0.2, at the scan's limit), the intermediate and balance staff pivot tips, the escape wheel disc's thickness (items 12, 49, 52, 63, 67, 68).
- No hand (mirror) check was possible: the section shows no asymmetric feature that fixes handedness. The fusee's groove steps and the barrel's hook are visible but their count and side were not read.
- Every drawn height carries the scan's limit of about +-0.2 mm; differences under 0.3 mm should not be taken as findings.
