# The Wempe Einheits-Chronometer model

An interactive 3D model, in progress, of the German *Deutsches Einheits-Chronometer*: the standard marine chronometer designed by Gerhard D. Wempe's chronometer works in Hamburg in the early 1940s and made by Wempe and A. Lange & Söhne. The model is the spring-detent version (*Feder-Chronometer*, Kaliber 05) as its works drawings draw it, each sheet **as last revised** (about 1946-48). Superseded figures are history: they're noted below, not built. The lever chronometer's sheets (05 04_20-23, 05 08_30-33) are used only to cross-check the holes it shares.

Phase P1a (14 October 2026) built the frame: the two plates with every hole of their tables, the three pillars and their screws, the movement ring, the barrel bridge with its click, the fusee bush and dust bush, the two balance cocks and the intermediate bridge, each with its screws and steady pins. Holes for the parts of later phases (the train's arbors, the detent block's screw, the balance holding work, the escape wheel's settings) are cut now, as the tables give them; the parts themselves come later.

## Files

- `index.html`: the page. It loads three.js and the fonts from `../../vendor/`, the Hamilton's `core.js` (materials, geometry helpers, sections, the ink drawing) and stylesheet by relative path, then `../shared/kit.js`, `../shared/viewer.js` and its own scripts.
- `js/dims.js`: `WD`, the shared dimensions: the plates, the pillars and their screws, and the hole table `WD.H` (every hole by its number on the sheets, in the movement frame). Each number names its sheet and how sure the reading is.
- `js/frame.js`: `WFRAME.build(mv, M, K)`, the frame's parts. Each part's own sizes sit in the comment beside the code that draws them, with the sheet, the figure and how sure.
- `js/movement.js`: `buildWempe(M)`, which calls the groups' builders (the frame so far), and `update()`. Later groups each get a file of their own (`train.js`, `escapement.js`…), loaded before `movement.js`, each declaring one global.
- `js/app.js`: the parts' cards (`PARTS`, `PIECES`), views, sections and labels, given to the shared viewer.
- `../shared/kit.js` (`KIT`): the part and screw makers and the plan helpers copied from the Hamilton's `movement.js`, and, added for this frame, `solidGeo` (a closed solid from plan cells in depth bands, with holes, counterbores, pockets and coned walls) and `bool` (two outlines crossed, sharing their crossing points). `KIT.screw` takes a material.
- `checks.py`, `bom.json`, `audit-expected.json`: the tools' tables for `--model wempe` (`../chronometer-working-model/tools/model.py`).

## Coordinates and units

Millimetres. The movement frame is the Hamilton's: dial side +y, 12 o'clock −z, 3 o'clock +x. The pillar plate's inner face is at y 0 and its dial face at +3.35; the top plate's inner face at −19 and its outer face at −22.35.

The sheets' hole tables give every hole as N/S and O/W (Ost, east, and West) from hole 1, the centre wheel's arbor, which is the plates' centre. Every plan of the frame is drawn with N up and O to the right, seen from above with the movement lying dial down: the top plate from its outer face (its pillar seats, in its inner face, are dashed; its sections mark that face "oben") and the pillar plate from its inner face. N is 12 o'clock: the seconds wheel is at S 23 and the up-and-down at N 23. O is the dial's 9 o'clock: Wempe 3955's dial side (`photos/dg-chrono-dec/3_Wempe_3955_uZ.jpg`) has the Wechselrad (hole 19, O 10.9) left of centre, and the movement ring's sheet, drawn from the dial side, puts its screws 20° clockwise from 12, where Wempe 3955's top plate has them at 339° from N toward O. So x = W and z = S (`WD.NO`).

## Sources

- **The works drawings**, `References/wempe/drawings/` (© Johannes Altmeppen, by courtesy of Gerhard D. Wempe KG, 2017), as transcribed in `References/wempe/transcriptions/05-08-frame.md` and checked on the sheets themselves, cropped and enlarged wherever a number mattered. The frame's sheets are 05 08_1a/1b (Oberplatte, 05 09 01), _2 (Oberplatte kompl., 05 08 01), _3a/3b (Unterplatte, 05 08 02-1), _32.2 (Unterplatte kompl., 05 08 02), _4 (Unruhkloben unten, 05 08 00-2), _5 and _6 (Unruhkloben oben, 05 08 03-1, and the kompl. 127-556.04 U30), _7 (Werkring, 05 08 00-3), _8 (Schneckenfutter, 05 08 01-2), _9 (Staubfutter, 05 08 01-3), _10 (Zwischenbrücke kompl., 05 08 04), _11 (Pfeiler, 05 08 00-1), _12 to _14 (Federhausbrücke kompl., 05 08 05; Federhausbrücke, 05 08 05-1; Sperrkegel, 05 08 05-2), and sheet 001 (the movement in plan at 2:1).
- **The coloured section** (`drawings/Wempe_Einheitschronometer.jpg`): the whole movement in one unrolled section, with the parts' numbers, including the Wempe standard parts (WN) that have no sheet in the set. Measured on it where no sheet gives a size, scaled on the pillar's 8.1 and the 19 between the plates (28.3 px/mm in a 3× crop, the same both ways where it was checked).
- **Photographs of genuine German movements**: Wempe 3955 above all (`photos/dg-chrono-dec/`): `2_Wempe_3955_A.jpg`, the top plate square-on on millimetre paper (8.82 px/mm at the plate, from the pillar screws' 62.41 and 58.7 mm apart); `3_Wempe_3955_uZ.jpg`, the dial side; `12_` and `13_Wempe_3955_obere_Platte_*.jpg`, the top plate off, both faces; the side views `4-7_Wempe_3955_*.jpg`. ALS 5177 and the Kirow movements likewise. The 6MX differs (see `References/wempe/README.md`) and isn't evidence for the frame.

## How each frame part was measured

- **Plates.** Diameter, thickness and every hole from the hole tables (05 09 01, 05 08 02-1) at their drilled, reamed or tapped sizes, drawn at the middle of each fit. The sections give the rest: the pillar seats Ø 8.6 × 0.3 in the inner faces (L-M, E-F); the steady pins' holes reamed 1.6025 from the side their part sits on and opened Ø 2.5 × 1.6 from the other (A-B, C-D); the lower cock's screw sunk Ø 6 H7 × 1.8 (G-H); the escape wheel's setting seats (P-Q, G-H: Ø 5.2 H7 with a 0.5 lip of Ø 4.5 or 4.59 H7, two M1.2 3.5 either side); the recess Ø 22 × 0.7 with its 45° wall round the fusee's hole in the top plate's inner face (J-K); the pocket for the balance holding work in the same face, 8 wide, 1.35 −0.05 deep, from the balance opening to hole 51 and round it at r 4 (N-O, with Wempe 3955's inner face, `13_…unten`, which shows it). The top plate is a crescent: the cut round the barrel milled Ø 42.5 about hole 45 runs out through the rim. The pillar plate's opening for the intermediate wheel is milled Ø 24.5, joined by the seconds arbor's hole (punched 6.0) on its rim. The three small windows beside the pillars (Altmeppen's list of German features) are the auxiliary holes 3, 12 and 40.
- **Pillars.** Every figure of 05 08 00-1. Its countersinks and the half-round relief grooves in the shoulders are drawn without figures and scaled at 5:1.
- **Movement ring.** Its diameters, heights, screw holes and pin holes from 05 08 00-3 as revised 6.12.46. The sheet's heights fix the profile: the pillar plate's seat Ø 85 H9 is 3 +0.1 deep, the dial's recess Ø 104 +0.1 is 0.7 +0.1 deep, 7 −0.1 lies between their floors, 10.7 −0.1 overall; the flange is 4.7 high. The section in the coloured drawing shows the order: the seat at the movement side, a lip Ø 83 under the plate, a 45° cone opening from it to Ø 93 at the recess. Its three M2.6 on Ø 89 at 340°, 100° and 220° from N toward O (the sheet's 20°, 140°, 260° from 12 seen from the dial side; Wempe 3955's three brass heads at 339°, 99°, 218°).
- **Barrel bridge.** 05 08 05-1: every figure fits one chord, 18.5 from the centre and square to hole 45's line (the greatest width 24, hole 45 7 from it, 73.5 from the point to the top corner on the rim, 7.7 from the point to pin 41), the short edge at the top at 150° to it. Its outer edge is the plate's rim.
- **Click.** 05 08 05-2 at 5:1: the hole, length, beak, nose and the hollow r 6 from its figures; its back an arc r 12.5, its centre fitted to 37 points traced along it (0.05 mm rms). Its turn on the bridge traced on Wempe 3955 (its nose's centre lands where the photograph has it).
- **Fusee bush and dust bush.** Every figure of 05 08 01-2 and 05 08 01-3. Which way the dust bush's flat faces follows from the upper cock's place: it passes 7.0 from the fusee's axis, where the collar would otherwise stand 0.55 into the cock's web.
- **Balance cocks.** Every figure and hole of 05 08 03-1 and 05 08 00-2, their places from their own tables (the same as the plate's). The upper cock's arm is relieved 0.8 underneath within r 12 of the setting (05 08 03-1's 0.8, 45° and 12 r; drawn on 127-556.04 U30). The lower cock hangs under the top plate: its holes are all in the top plate's table, its screw comes down from the plate's outer face (G-H), and its lug, at the block's far face, holds the balance's lower setting about 10 under the plate, as the coloured section draws it.
- **Intermediate bridge.** Its holes' places from the pillar plate's table (all six on one line, to 0.001). Its own sheet (05 08 04-1) isn't in the set: its outline and thickness are scaled on the assembly sheet 05 08 04 at 2:1, calibrated on the screws' 34.13 and the pins' 41.13 apart (7.03 px/mm); it lies on the pillar plate's dial side, as 05 08 02 draws it dashed and Wempe 3955's dial side shows it.
- **Screws and steady pins.** Places from the tables; threads from the tables (M2.6, M2, M1.7, M1.4, M1.2). The WN standard parts have no sheets in the set: their heads and lengths are measured on the coloured section and on Wempe 3955's top plate (below). The steady pins are Ø 1.6, pressed into 1.585 −0.005 holes 2.5 deep in their part and a slide fit in the plate's reamed 1.6025, standing 1.3 out (05 08 04, 05 08 05, U30).

## Estimated, not from the drawings

- **The pillar plate's thickness**, 3.35: its sheet's "3,35 ±0,02 stark" is struck through with a replacement that's no longer legible.
- **Screw heads and lengths** (no WN sheets in the set), measured on the coloured section and Wempe 3955: pillar screws WN-56/57 head Ø 6.4 × 3.0, shank 7.7; movement ring screws Ø 6.2 × 2.25, 6.3; barrel bridge screws WN-55 Ø 6.4 × 3.0, 6.2; the click's screw WN-22 head Ø 4.5 × 2.1, shoulder Ø 3.1 × 2.65, thread 3.2; the fusee bush's WN-34 Ø 2.1 × 0.45, 3.6; the upper cock's screw Ø 6.4 × 3.0, 6.2 (blued, as Wempe 3955's); the lower cock's WN-53 Ø 5.8 × 1.7, 5.0; the intermediate bridge's WN-52 Ø 4.2 × 1.9, 4.7. Their WN numbers are the coloured section's labels where they could be read; the ring screws' and the upper cock screw's were not.
- **The movement ring screws' heads bear on the plate's rim**, which stands 0.35 proud of the ring: the coloured section draws them about 1 mm clear of both, which would leave the plate loose in its seat.
- **Steady pins' length**, 3.0 (1.7 in the part, 1.3 out): U30 draws the upper cock's so; the others are taken the same. The cocks' pins carry no WN number on their sheets (taken as WN-203, the bridges').
- **The movement ring**: the lip's depth under the seat (2.0) and so where the cone starts; the M2.6 holes' depth (6.0, to the flange); the plate's pin 5.35 long with its top 0.1 under the plate's face (the coloured section draws it 7.6, which would cross the cone); its material ("——" on the sheet) and finish (nickel, as Wempe 3955's looks).
- **The pillars' countersinks** (Ø 2.7 at the face) and **relief grooves** (out to r 3.25, 0.35 deep, half-round): drawn, not figured.
- **The balance opening's tongue** in the top plate: its root on the opening's edge 50° round from the pocket's line ("50°"), its end 8.6 from the opening's centre toward 112.5°, scaled on 05 08_1b (115°) and Wempe 3955's top face (110°); 2.5 wide (likely).
- **The intermediate bridge's outline**, 45.5 × 10.0 with round ends, 3.8 thick, its screws' sinks Ø 4.4 × 2.0, the jewel's hole Ø 4.3 under a Ø 6.2 × 0.7 sink, the setting's Ø 5.2 under a Ø 6.2 × 1.7 sink, its pins' holes 2.5 deep: scaled on 05 08 04.
- **The click**: its base 2.81 under the hole (scaled), the centre of its back's arc (fitted), its beak's front face, and its turn on the bridge (23.3° from N, ±3°, on Wempe 3955).
- **The upper cock's relief**: the 45° step runs from r 12 (the thin side) to r 12.8 (which side of the step the "12 r" gives is inferred). Its two M1.2 holes are drawn at their tap drill (Ø 0.95) at 3.525: at the thread's size and at 3.5 they would break 0.12 into the setting's Ø 6 sink.
- **The dust bush's flat** faces the upper cock (inferred from the cock's place, above).
- **The fusee bush's fits**: T6 for the body pressed into the plate and g6 for the part above the flange, which the dust bush's H7 bore slides over (the sheet gives both on Ø 8; which is which is inferred).
- **Finishes**: the plates, cocks and bridges gilt as Wempe 3955's (the sheets give the metal, not the finish).
- **Left out, small**: the barrel bridge's pin holes' 0.3 × 90° countersinks, the upper cock's pins' 0.2 × 90° sinks, the 82° of its Schnitt C-D, the dust bush's 5° × 0.5 chamfer.

## Superseded, left out or for later

- Superseded figures (history, not built): the movement ring's revision a (0.7 +0.05, 3 ±0.05, 7 ±0.07, 10.7 −0.05 before 6.12.46); the lower cock's seat tolerance (+0.05 before 2.12.46); the top plate's thickness 3.3 (the lever plate's revision b); the click before 25.5.48.
- Not built, by the sheets: the pillar plate's holes 14-18 and the hand-setting cut (struck through on 05 08 02-1, "nur wenn Zeigerstellung eingebaut wird"; Wempe 3955 has the hand-setting, `6_Wempe_3955_S.jpg`), built with the hand-setting (05 33) if it is modelled; 56, 57 (the seconds contact's screws, "nur bei Bedarf", not in Wempe 3955's plate); the lever's 27, 31-34 and its pocket. Hole 30 (Ankerrad) is built: it is in the detent pillar plate's own table, 05 08 02 draws a setting (WN-302) in it, and Wempe 3955's plate has it drilled.
- For later phases: the jewel settings WN-300, -301, -302 and the jewel at 38 (the train); the upper cock's endstone and its screws (the balance); the stop pin 05 08 01-5 in hole 7 (no sheet); the bush 05 08 02-2 at hole 2 and the two posts 05 08 02 draws standing 12.3 and 6.8 out of the pillar plate (the motion work); 05 08 01-4 on the dust bush (no sheet); the movement ring's radial pin to the case (Ø 1.1 at 2.8 from its dial face, WN-202 in the coloured section; the case, 05 01).

## Readings corrected against the sheets

Checked on the sheets while building (the transcription `References/wempe/transcriptions/05-08-frame.md` is left as written):

- 05 08_1b: the "2,65" by the fusee's M1.4 holes is 22,65, hole 1 to hole 10 (its leader runs to hole 1); the dashed circle round hole 10 is J-K's recess Ø 22 × 0.7 in the inner face (not a 19 mm clearance); Schnitt J-K runs through hole 10, not the plate's edge.
- 05 08_1b: Schnitt N-O is not a lip at the barrel cut: it runs from the balance opening to hole 51 along the balance holding work's pocket, and its "1,35 −0,05" is the pocket's depth. The radius round 51 reads "4ʳ" (r 4: the "7" is its arrowhead), as it scales (4.0) and Wempe 3955's pocket measures (4.0-4.2).
- 05 08_11: the pillar's body is Ø 8.1 −0.2 (the ∅ written high, as on its 4,3∅ and 4,5∅; 8.06 scaled), not 8.14 (P0's).
- 05 08_7: the "104 +0,1" is the dial's recess in the flange's face, 0.7 +0.1 deep, not the ring's seat (85 H9); "4,7" is the flange's height; the plan's 20° is the first screw hole's angle from 12, 6° the dial's pin hole's.
- 05 08_14: the click's back is an arc r 12.5, as figured (fitted 12.4-12.5); the "85" by it isn't its radius.
- P0's `dims.js` said the Unterplatte's plan is drawn from the dial side with O to the left: it is drawn from its inner face with O to the right, as every plan of the group.

## Unresolved

- The pillar plate's thickness (struck, above).
- The click's "85" and "5,7" (an angle and a boss circle, perhaps).
- Whether the movement ring's screws bear on the plate (above).
- Hole 53, O 15.0 on the detent plate (05 08_1a) and O 13.0 on the lever plate (05 08_30): the detent plate's is built.
- The upper cock's "3,2 ±0,02" at its arm's end on 05 08 03-1 against U30's 2.4 at the setting (the relief, built).
