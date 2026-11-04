# Batch 09: the fusee (reader)

Sheets: 05 06_1, 05 06_2.2, 05 06_3.1, 05 06_3.2, 05 06_4, 05 06_15, 05 06_16, 05 06_20. Read blind; measured parts are r_wpa/measure/ (fusee, fuseeArbor, clickWheel, stopBar) and r_wpa/page/placements.json. Hand is judged as assembled: the click wheel's box lies in movement y -8.625..-6.675 and the fusee's in y -18.475..-6.125 (local z is movement y, dial side +y), so the click wheel sits in the 26.3 recess of the fusee's large face, which faces the dial; the plan from +Z is the part seen from the dial side, not mirrored.

## 05 06_1 Schnecke kompl. (assembly)

Title block as read: Number 127-556.04 U21 / 05 06. Scale 5:1. Date 15.3.41; revisions b (Form geändert) and a (1941). Material: none given (assembly). Parts list 82-93. Shows the housing (Gehäuse), Unterplatte, Oberplatte, Minutenrad, the Vorreiberstift.

Views: Section through the whole fusee group: arbor with the pivots and the right-hand end towards the housing, body, click wheel, maintaining ratchet and cover. The 19.7 is the arbor sheet's own. The 18.3 -0.1 lines attach to nothing I can fix at this scan size.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-1-1 | arbor: shoulder of 4.38 body to end of 6.1 collar (stack of the arbor) | 19.7 (likely (the arbor sheet prints it)) | fuseeArbor z_levels -0.025..-19.725: 19.700 | 0 | match |
| 09-1-2 | fusee turns with the arbor: Federhaus/fusee overall 18.3 -0.1 (extension lines attach to the fusee face and the cover? unclear) | 18.3 -0.1 (unsure (lines attach to nothing clear)) | fusee/placements (not resolved): - | - | can't tell |
| 09-1-3 | parts shown: body, arbor, click wheel, maintaining ratchet, spring, cover plate, dust plate, Vorreiber, clicks, stop bar, screws (nos. 82-93 listed) | lists 82..93 (likely) | measure/ files exist for each key: all present | - | match |
| 09-1-4 | sheet date | 15.3.41, revised b: "Form geändert" 1941, a: 0,3 ... (likely) | -: - | - | can't tell |

Extras: none found.

## 05 06_2.2 Schneckenkörper 05 06 04-2

Title block as read: Number 05 06 04-2. Scale 5:1. Material: Rundmessing 36, DIN 1758, Ms 58. General tolerance: "nicht eingetr. Toleranz ±0,05". Drawn 22.9.41, revised 27.2.48 (a list of "war" values). Views: Schnitt A-B, Schnitt C-D (groove radii), a small enlargement M 1:1.

Views: Plan section C-D shows the groove radii as concentric circles with radii listed on the right (9.30, 9.47, 9.71, 10.07, 10.55, 11.24, 12.17, 13.32, 14.75, 17.25); section A-B shows the stepped groove with 2 ±0.02, 0.87 +0.01, 1.2 ±0.01, 0.33, 0.6, 0.55 dia; the bores (7, 15, 26.3) and the screw holes (M1.7, M2). Step 2: the stair in A-B counts nine to ten steps a side and C-D lists nine to ten radii: they agree to scan accuracy. The hook slot and the 0.5 H7 hole are marked in C-D with tolerances I cannot read.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-2-1 | outer diameter of the large flange | 35.6 -0.1 (dia) (sure) | fusee.json cylinders[11].d 35.6: 35.6 | 0 | match |
| 09-2-2 | recess in the large face (dia) | 26.3 +0.2 (sure) | fusee cylinders[0].d 26.3 z -8.625..-7.675: 26.3 | 0 (inside +0.2) | match |
| 09-2-3 | 45 deg chamfer from recess to face; chamfer outer dia | 29.8 +0.2 (dia) at 45 deg (likely) | fusee cones[1].d 26.3..29.4 half-angle 45: 29.4 | -0.4 (below 29.8, tol to 30.0) | mismatch |
| 09-2-4 | recess depth (face to recess floor) | ~2.3 (scaled off 5:1; unsure, not printed) (unsure) | fusee z -6.125 to -8.625: 2.5 | +0.2 within scan accuracy | match |
| 09-2-5 | overall length face to end of 21 dia boss | 12.6 -0.1 (likely) | fusee size[2] 12.35 (box z -18.475..-6.125): 12.35 | -0.25 (limits 12.5-12.6) | mismatch |
| 09-2-6 | end boss dia | 21 -0.05 (sure) | fusee outlines_by_level[-18.475] r 10.5 (splines): 21.0 | 0 | match |
| 09-2-7 | recess dia in the small end | 15 (dia), 1.6 +0.1 deep (sure) | fusee cylinders[1].d 15.0 z -18.475..-16.875: 15.0 x 1.6 | 0 | match |
| 09-2-8 | central bore | 7 H7 (+0.012 / 0) (likely) | fusee cylinders[3].d 7.006: 7.006 | 0 (inside 0..+0.012) | match |
| 09-2-9 | groove width | 0.87 +0.01 (sure) | section_y0 z -17.195 to -16.325: 0.870 | 0 | match |
| 09-2-10 | groove pitch | 1.2 +-0.01 (sure) | section_y0 floors -17.195 / -15.995: 1.200 | 0 | match |
| 09-2-11 | land width between grooves | 0.33 (likely) | section_y0 -16.325 to -15.995: 0.330 | 0 | match |
| 09-2-12 | groove depth (tip above floor), "alle Masse +0.6" | 0.6 (likely) | section_y0 floor 9.71 tip 10.31 etc (7 pairs): 0.600 | 0 | match |
| 09-2-13 | groove floor radii, turn by turn (C-D) | 9.47 9.71 10.07 10.55 11.24 12.17 13.32 14.75 (and 9.30 start, 17.25 outer) (likely (10.07 may read 10.04; see 20)) | section_y0 floors 9.47 9.71 10.0698 10.55 11.24 12.17 13.32 14.75: same eight | 0 to 0.003 | match |
| 09-2-14 | groove floor radius 9.30 (start) and 17.25 (large end) | 9.30; 17.25 (likely) | section_y0 at this angle: no floor at 9.30 or 17.25: not at the cut | - | can't tell |
| 09-2-15 | number of turns of the groove | 8.75 turns implied by 05 06_20 axis 0-9 (unsure) | section_y0 8 floors at one angle: 8 floors | - | can't tell |
| 09-2-16 | 0.55 dia hole at the groove start (chain hook), +0.01 | 0.55 +0.01 dia (likely) | fusee cylinders[8].d 0.555 z -6.685..-6.127; cylinders[9] 0.555: 0.555 | +0.005 | match |
| 09-2-17 | cross hole 0.5 H7 (+0.009), 1.1 deep? "1.1+0.05 tief" | 0.5 H7 +0.009 (unsure) | fusee cylinders[10].d 0.5045 (tangential-ish, dir 0.986,-0.169,0): 0.5045 | 0 (inside +0.009) | can't tell |
| 09-2-18 | three screw holes at 120 deg, r 5.75, M2 (tap drill) | M2, 5.75 r, 120 deg (likely) | fusee cylinders[4..6].d 1.567 at r 5.75, 120 deg apart, z -14.875..-8.625 (6.25 deep): 1.567 x 6.25 | depth +0.25 vs "6 +0.5" | match |
| 09-2-19 | M1.7 hole at r 6, 6 deep | M1.7, 6 (likely) | fusee cylinders[7].d 1.3211 at (6.0,-0.015) z -16.875..-10.875: 1.321 x 6.0 | 0 | match |
| 09-2-20 | angular place of the M1.7 and 0.5 holes about the axis | set by A-B plane through the top (unsure) | at 0 deg (+x) in the part frame: - | - | can't tell |
| 09-2-21 | slot for the chain hook: 13.5 dia cut, depth 0.87 ("11+0.05 tief", "15+0.05 tief" as read) | 13.5 (arc), 29 deg+0.01 angle?  (unsure (marks illegible)) | fusee cylinders[2].d 13.5 at (21.14,-3.63) z -7.555..-6.685: 13.5 | - | can't tell |
| 09-2-22 | end flange beyond the last groove: 0.8 (C) and 0.3 (Gangende Punkt N) | 0.8; 0.3 (unsure) | section_y0: end face -18.475 to first groove edge -17.195: 1.28 | boss thicker than 0.8+0.3? ambiguous | can't tell |
| 09-2-23 | material and general tolerance | Rundmessing 36 Din 1758 Ms 58; "nicht eingetr. Toleranz +-0,05" (sure) | -: - | - | match |

Extras: none found.

## 05 06_3.1 Schnecke (U 17)

Title block as read: Number 127-556.04 U17 / 02 06 13. Scale 5:1. Date 24.7.41 ("Übergangsserie"). Parts 63-68. Handwritten "Presstrecke 5,5-6".

Views: The earlier (1941) assembly of body, arbor and click wheel (parts 63-68), overall 12.4 -0.1.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-3-1 | overall length of assembly body | 12.4 -0.1 (U17, 24.7.41, "Uebergangsserie") (likely) | fusee size[2] 12.35: 12.35 | -0.05 | match |
| 09-3-2 | arbor in the body: press length 5.5-6 (Presstrecke) | 5.5-6 (handwritten) (unsure) | fuseeArbor collar 7.9 long, fusee bore z -16.875..-8.625 (8.25): 8.25 bore | - | can't tell |
| 09-3-3 | body 02-2 shown with 9.9? and screws M1.7/M2 and a pin Gewindestift 0.7 | Gewindestift 0.7 (unsure) | fusee M1.7 hole 1.32; no page line for the pin in this batch: - | - | can't tell |

Extras: none found.

## 05 06_3.2 Schnecke 05 06 04

Title block as read: Number 05 06 04. Scale 5:1. Dated 24.7.41, revised 31 März 1948. Parts 1-5 (05 06 04-2, -1, -3, WN-19, 05 06 04-4). Note "Fläche muß schlagfrei zur Welle laufen".

Views: The 1948 assembly of the same parts, with 12.3 -0.1 in parentheses. Finding: 02-2 (27.2.48) prints 12.6 -0.1 for the body and 3.2 (31.3.48) prints 12.3 -0.1 for what looks like the same span: they disagree by 0.3. I cannot fix to which faces 3.2's 12.3 attaches.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-4-1 | overall length (a), rev. 31.3.1948 | 12.3 -0.1 (parenthesised, control) (likely) | fusee size[2] 12.35: 12.35 | +0.05 over 12.3; 0.25 under 02-2 12.6 | match |
| 09-4-2 | large flange and recess dia (a) | 35.6; 33 +0.1 read here (unsure) | fusee cones[0].d 33..35.6 (85 deg): 33.0..35.6 | - | can't tell |
| 09-4-3 | 13.7 (a) dimension | 13.7 (a) (unsure) | -: - | - | can't tell |
| 09-4-4 | parts: 1 body 05 06 04-2, 2 arbor -1, 3 click wheel -3, 4 WN-19, 5 05 06 04-4 | 5 numbered lines (sure) | fusee, fuseeArbor, clickWheel, w19 present: present | - | match |

Extras: none found.

## 05 06_4 Schnecke Teilansicht

Title block as read: Number 05 06 (Teilansicht Blatt 2). Scale 5:1. Dates 8.4.41, 28.6.46, 31 März 1947. Views: Schnitt A-B (click wheel, two clicks, Gegensperrrad, Drahtfedermitte, Stift nach oben) and Schnitt C-D (stop bar, Stellung im aufgezogenen Zustand, Anschlagstift in Oberplatte, Stegstellung).

Views: A-B: click wheel as a full ring of teeth (hatched section), two clicks, the counter-ratchet and the wire spring. C-D: stop bar with its stud. The dimensions 22.5, 14, 12, 3.2, 3.3, 1.76, 2 are legible only in part.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-5-1 | click wheel tooth count (Schnecken-Sperrrad, section A-B) | full ring of about 35 teeth (likely (count unsure at scan size)) | clickWheel teeth[0].count 35: 35 | 0 | match |
| 09-5-2 | stop bar length (C-D, Stegstellung) | 22.5 (unsure (which bar)) | stopBar size[0] 22.4959: 22.496 | 0 | match |
| 09-5-3 | stop bar width | 2 (unsure) | stopBar size[1] 1.98: 1.98 | -0.02 | match |
| 09-5-4 | stop bar places: stud in Oberplatte, bar position wound / run down | Anschlagstift in Oberplatte; Stellung aufgezogen (unsure) | placements 050603-1 origin (-16.708,0,-15.292) box y -18.475..-17.025: - | - | can't tell |
| 09-5-5 | maintaining parts: Drahtfedermitte, two clicks, Gegensperrrad, Stift nach oben | named (likely) | measure/ clicks, maintRatchet, mspring exist; places not resolved on the scan: - | - | can't tell |
| 09-5-6 | sheet dates | 8.4.41, rev 31 Maerz 1947, 28.6.46 (likely) | -: - | - | match |

Extras: none found.

## 05 06_15 Schneckenwelle 05 06 04-1

Title block as read: Number 05 06 04-1. Scale 2:1. Material: Präz. Rundstahl 7,5 DIN 175. General tolerance: "nicht eingetr. Toleranz ±0,1". Drawn 29.11.40, checked 10.12.40.

Views: One view (2:1) and a 1:1 small figure. The right end past the 4.39 body is drawn with crossed diagonals; I read its 3.17 / 2.92 as a round pivot (see After the verdicts).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-6-1 | overall length | 60.6 -0.2 (likely) | fuseeArbor size[2] 58.125 (z -48.025..10.1): 58.125 | -2.475 (outside tol) | mismatch |
| 09-6-2 | left end: pivot 1.6 dia (+0.1/+0.05) | 1.6 +0.1/+0.05 (sure) | fuseeArbor cones[4].d 1.6509..1.6991: 1.65-1.70 | 0 | match |
| 09-6-3 | left pivot length, tip to the 2.7 shoulder (60.6 - 19.7 - 28.3 - 6.5) | about 6.1 (derived; scaled about 6.6) (likely) | fuseeArbor z 6.475..10.1: 3.625 | -2.5 | mismatch |
| 09-6-4 | 2.7 / 2.8 +-0.02 taper 1:70, 6.5 +0.1 long | 2.7 to 2.8, 6.5 (sure) | fuseeArbor cones[3] d 2.7072..2.8, z -0.025..6.475: 6.5 | 0 | match |
| 09-6-5 | 4.38 to 4.5 +-0.02 body (1:70) beside the cross hole | 4.38 to 4.5 (sure) | fuseeArbor cones[2] d 4.38..4.5 z -8.725..-0.025: 8.7 long | 0 | match |
| 09-6-6 | cross hole 1.1, bored and taper-reamed, 2.0 from the shoulder | 1.1 (likely) | fuseeArbor cylinders[0].d 1.15 at z -2.025: 1.15 | +0.05 (reamed taper) | match |
| 09-6-7 | collar dia and length | 7.04 -0.01; 7.9 (sure) | fuseeArbor cylinders[1] d 7.04 z -16.625..-8.725: 7.04 x 7.9 | 0 | match |
| 09-6-8 | second collar dia and length | 6.1 -0.05; 3.1 (sure) | fuseeArbor cylinders[2] d 6.1 z -19.725..-16.625: 6.1 x 3.1 | 0 | match |
| 09-6-9 | 4.5 +-0.02 to 4.39 body (1:70), 8 long | 4.5/4.39, 8 (sure) | fuseeArbor cones[0] d 4.39..4.5 z -27.725..-19.725: 8.0 | 0 | match |
| 09-6-10 | right pivot section: 3.17 +0.023/+0.015 tapering 1:100 to 2.92 at the tip, 20.3 long | 3.17 to 2.92 (likely) | section_y0 r 2.2062 at -27.725 to r 2.081 at -45.4275 (d 4.41 to 4.16): 4.41..4.16 | +1.24 (both ends) | mismatch |
| 09-6-11 | distance 28.3 from the 4.5 shoulder to the tip | 28.3 (sure) | fuseeArbor z -19.725 to -48.025: 28.3 | 0 | match |
| 09-6-12 | material, tolerance | Praez. Rundstahl 7.5 Din 175; nicht eingetr. Toleranz +-0,1 (sure) | -: - | - | match |

Extras: none found.

## 05 06_16 Schneckensperrrad 05 06 04-3

Title block as read: Number 05 06 04-3. Scale 5:1. Material: Ms Blech 2 mm DIN 17.51, Ms 58 federhart. Dated 6.8.47. Note: Zulässiger Schlag der 3 Bohrungen 2 Ø zur Verzahnung 0,2 mm. Zähnezahl 35. General tolerance not legible.

Views: Plan with teeth drawn over a sector only (convention), the plain circle for the rest, three holes, a section below. Sheet 4 shows the same wheel with a full ring of teeth.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-7-1 | outer dia of the teeth tips | 16.0 -0.05 (sure) | clickWheel teeth[0].tips_d 15.99: 15.99 | -0.01 | match |
| 09-7-2 | root dia | 14.5 -0.2 (sure) | clickWheel teeth[0].roots_d 14.4: 14.4 | -0.1 within tol | match |
| 09-7-3 | tooth count | 35 (Zaehnezahl) (sure) | clickWheel teeth[0].count 35: 35 | 0 | match |
| 09-7-4 | bore dia and 45 deg chamfer (0.3 +0.2 deep as read) | 7.5 +0.05; 45 deg (likely) | clickWheel cylinders[0].d 7.525 z 0.4..1.95; cones[2] 7.525..8.325 45 deg z 0..0.4: 7.525; chamfer 0.4 | inside | match |
| 09-7-5 | thickness | 2 -0.1 (sure) | clickWheel size[2] 1.95: 1.95 | -0.05 (inside) | match |
| 09-7-6 | three holes 2 dia +0.1, taper 1:8, 120 deg | 2 dia; 120 (likely) | clickWheel cones d 2.0..2.25 at r 5.75 (3 holes), half angle 3.7 deg: 2.0..2.25 | taper 0.25 over 1.95 = 1:7.8 | match |
| 09-7-7 | hole circle dia | 11.5 +-0.05 (sure) | three holes at r 5.75 (e.g. (2.497,5.179)): 11.5 | 0 | match |
| 09-7-8 | hand of the teeth and angular place of the three holes (8 deg, 12.5 and 120 deg dims) | teeth on a sector, 8 deg marked (unsure) | plan from +Z: full ring of 35 teeth, steep face one side: - | - | can't tell |
| 09-7-9 | material | Ms Blech 2 mm DIN 17.51, Ms 58 federhart; sheet 6.8.47 (sure) | -: - | - | match |

Extras: none found.

## 05 06_20 Schneckenkurve / Kraftverlauf

Title block as read: Schneckenkurve von Stahlschnecke / Kraftverlauf. Herb. Müller, 24.7.41. Mittel aus 2 Messungen. Hebellänge 262 mm. A graph, not a part.

Views: Upper graph: groove radius against turn (upper marks 5 to 0, lower axis 0-9). Lower graph: force in g against the same axis; 24 Std marked between 3.75 and 9; a wavy line 31 to 39 g, higher at the start (about 38 g, 0-1 turns) and the end (about 38 g, 8.5-9).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | Δ | verdict |
|---|---|---|---|---|---|
| 09-8-1 | groove curve radii by turn | 17.25(0) 14.75(1.3) 13.32(2.3) 12.17(3.2) 11.24(4.3) 10.55(5.3) 10.04(6.4) 9.71(7.3) 9.47(8.4) 9.30(9) (likely) | section_y0 floors 14.75 13.32 12.17 11.24 10.55 10.07 9.71 9.47: same, 10.07 vs 10.04 | 0.03 (inside scan) | match |
| 09-8-2 | curve radius at turn 0 (17.25) and end (9.30) | 17.25; 9.30 (likely) | no floor at those radii at the y0 cut: - | - | can't tell |
| 09-8-3 | force curve about 30-40 g, lever 262 mm, d 39.202 r 19.6, mean 131.5 x path 13.38 = 1.758, Federhaus 41.5/38.5, spring 15 x 0.37, 3/4 turn, 24 h run | as read (unsure for numerals, sure for shape) | model force not measurable from the files: - | - | can't tell |
| 09-8-4 | sheet date and signer | 24.7.41 Herb. Mueller (sure) | -: - | - | match |

Extras: none found.

## Notes across sheets

- Dates: 05 06_2.2 revised 27.2.48; 05 06_3.2 revised 31.3.48; 05 06_3.1 (1941) the earlier assembly; 05 06_16 revised 6.8.47; 05 06_4 carries 1946 and 1947 dates. The model follows the 1948 body (the 26.3 recess and 29.8 chamfer are 1948 revisions on 02-2).
- Body length: 3.1 prints 12.4 -0.1 (1941), 3.2 prints 12.3 -0.1 (1948), 02-2 prints 12.6 -0.1 (1948). Built 12.35: it agrees with the two assemblies and not with 02-2.
- Force (05 06_20): recorded above. The model's force can't be measured from the files: can't tell, readings recorded (31-39 g on a 262 mm lever; mean 131.5 x 13.38 = 1.758 as read; spring 15 x 0.37 in a barrel 41.5/38.5; 3/4 turn pre-tensioned).
- Groove: floor radii at the eight turns read on 02-2 and 20 are in the section to within 0.03; width 0.87, pitch 1.2, depth 0.6 match.

## After the verdicts

Read from TOOLS/recipes/wempe.py, fuseeArbor() (line 561). The right end past the 4.39 body is a winding square ("Mill the winding square, 1:100", 3.1 across flats at its root, 3.12 in the code, 1:100 to its point). My 09-6-10 reading of 3.17 / 2.92 as a round pivot was therefore probably a misreading (the crossed diagonals are the square): the built corner circle 4.41 to 4.16 equals 3.12-3.17 across flats times the square root of 2. The verdict is left as written for the verifier. The recipe also notes "the sheet's 60.6 counts the centres", so 09-6-1 and 09-6-3 (overall length, left pivot length) may follow from the centre points in the drawn overall; the verifier should check that.

## Summary

Counts: match 43, can't tell 17, mismatch 5, not built 0 (65 items).

Mismatches and not built:

- 09-2-3: chamfer outer dia built 29.4 vs 29.8 +0.2.
- 09-2-5: body length built 12.35 vs 12.6 -0.1 on 02-2 (agrees with 12.3-12.4 on the assemblies).
- 09-6-1: arbor overall 58.125 vs 60.6 -0.2 (may be the centres, see After the verdicts).
- 09-6-3: left pivot length 3.625 vs about 6.1 derived (same).
- 09-6-10: right end 4.41..4.16 vs 3.17..2.92 (a square, probably a misreading).

Could not read: the hook slot and 0.5 H7 dimensions and angles on 02-2 C-D, the 18.3 on 05 06_1, 13.7 and 33 on 3.2, the stop bar and the maintaining parts' dimensions and places on 05 06_4, the hand of the click wheel teeth (sheet 16 shows a sector only, sheet 4 is too small), the force curve's numerals.
