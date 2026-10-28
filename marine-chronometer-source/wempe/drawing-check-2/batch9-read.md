# Batch 9, blind reading: the top plate (05 09 01 / 05 08 01), the pillar plate (05 08 02-1 / 05 08 02), the pillar (05 08 00-1) and the movement ring (05 08 00-3)

Read 28 October 2026 from the sheet images alone (`References/wempe/drawings/05-08/Wempe_05-08_{01a,01b,02,03a,03b,07,11,32-2}.jpg`), with the coloured section (`Wempe_Einheitschronometer.jpg`) and 001 only for how these parts join. Steps 1 and 2 were written for every sheet before any transcription, README or code was opened. Crops are in the session's scratchpad, `dc2/b9/` (names given in brackets).

The scans are about 10 px per mm of the part (the plates at 4:1 come out 1024 px tall), so superscript tolerances are often only just legible. Where a figure is not legible I say so; where I had to choose between two glyphs I give both.

Conventions on the plate sheets: a coordinate table (Nr., Benennung, Koordinaten N/S and O/W from the centre hole 1, "Körner od. stanzen" (centre-punch, or the punched size), "bohren" (drill), "kalibr." (reamed or tapped size)) lists each hole. The two plates share one numbering: a number means the same arbor or part on both. A ditto mark (») repeats the letter (N/S, O/W) of the row above, not its number. The coordinates check against the plan: 1-10 is 22.65 (written along that line), 1-38 is 18.12, 38-35 is 12.63, 35-26 is 11.85 and 23-26 is 10.0, all of which the table's coordinates give exactly (for example √(9.633² + 2.683²) = 10.00 for 23-26). So the plan's "11,85" and "10,0" are centre distances, not hole sizes.

Which face is which: sections A-B and C-D on both plates mark "oben". Every feature drawn in plan as a solid circle sits on the "oben" face in its section, and every feature drawn dashed sits on the other face, so both plans look at the "oben" face. On the top plate "oben" is the outer face (the bridges and cocks above it are pinned from it); on the pillar plate "oben" is the inner face (the pillar recesses, which face the other plate, are drawn solid). The reasons are under each sheet.

## 05-08_01a and 05-08_01b: 05 09 01, "Oberplatte" (top plate)

The sheet is scanned in two halves: 01b the left (west) part of the plan with sections A-B, N-O, C-D, G-H, P-Q and an H7 table; 01a the east rim of the plan, sections J-K and L-M, the coordinate table, notes and title block. Overlaid at 750 px offset (`comp01.png`) the halves join at about O 30 without overlap or gap that hides a hole.

### Step 1, inventory

Title block (`v01a_tb`): drawing number **050901** (written without spaces; every other plate sheet is "05 08 …", see Step 2), "Oberplatte", Werkstoff "Messingblech 4 / Sonder Ms 4-AGef." (the last word only half legible; the pillar plate's reads "Sonder Ms α-β Gef."), Maßstab 4:1, Arbeitspause Nr 24, firm's address "Hamburg 1, Steinstrasse 23" (all the others: Hamburg 11, Stubbenhuk 25), gez. 15.6.43, gepr. 15.6.43, N.gepr. 18.6.43. Revision a (`v01a_rev2`): "Buchstabe kommt vor 1x" (?), text "∅ 4,5 … 4,59" with the middle word illegible (most likely "∅ 4,5 in 4,59 geändert"), dated 12.7. or 14.7. (year not legible), initials. Surface mark ▽▽▽ top left of 01b.

Notes beside the title block: "Rondelle 4mm x 90∅ / abgedreht 3,5×90∅ / körnen u. stanzen, fräsen / abdrehen, kalibrieren / Fertigmaß 3,35 × 85∅ h6". So the plate is finished 3.35 thick and Ø 85 h6.

Plan (01b + 01a): a disc of Ø 85 with a large round cutout on its west side, so that the plate is a crescent with two horns (upper horn tip near N 25 W 35, lower horn tip near S 5 W 40). The cutout's leader: "vor dem Kalibrieren auf 42,5∅ fräsen" (mill to Ø 42.5 before reaming); its centre is the punch mark 45 (Federhaus, N 6.0 W 24.784; no hole is left there, the barrel turns in the cutout). The cutout's arc runs out through the rim, so its horns are sharp points; there is no dimensioned radius at the horn tips.

Coordinate table, every row (`t01a_1`…`t01a_4`, `t01a_r1013`):

| Nr | Benennung | N/S | O/W | Körner/stanzen | bohren | kalibr. |
|---|---|---|---|---|---|---|
| 1 | Minutenrad | N 0.0 | O 0.0 | 4.4 | — | 4.59 +0.012 |
| 3 | Hilfsloch | N 37.0 | O 0.0 | 3.3 | — | 3.50 +0.012 |
| 4 | Gegensperrkegel | N 36.437 | O 6.425 | Körner | 0.9 | — |
| 5 | Drahtfeder | N 38.507 | O 10.684 | Körner | 1.3 | M 1.7 |
| 6 | Stellstift Unruh Kl. ob. | N 27.821 | O 3.577 | Körner | 1.45 | 1.6025 |
| 7 | Anschlagstift | N 23.911 | O 5.676 | » (Körner) | 1.45 | 1.6 +0.009 (written "16", comma lost) |
| 8 | Unruhkl. Schr. oben | N 19.765 | O 0.559 | » | 2.1 | M 2.6 |
| 9 | Stellstift Unruhkl. oben | N 11.555 | O 2.760 | » | 1.45 | 1.6025 |
| 10 | Schnecke | N 15.292 | O 16.708 | 7.8 | — | 8.0 +0.015 |
| 11 | Pfeiler | S 3.225 | O 36.858 | 4.3 | — | 4.5 +0.012 (superscript half legible) |
| 12 | Hilfsloch | S 9.576 | O 35.739 | 3.3 | — | 3.50 +0.012 |
| 13 | Gangfederkl. Schr. | S 16.238 +0.01 | O 34.536 +0.01 | Körner | 1.8 (a tick or "√" before it) | not legible (a dash or a thread) |
| 22 | Stellstift Unruhkl. unten | S 6.018 | O 3.259 | Körner | 1.45 | 1.6025 |
| 23 | Unruh | S 12.110 | O 9.10 | 10.0 | — | — |
| 26 | Gangrad | S 21.743 | O 11.783 | Körner | 2.3 | 2.5 +0.009 |
| 35 | Sekundenrad | S 23.0 | W 0.0 | 4.4 | — | 4.59 +0.012 |
| 36 | Unruhkl. Schr. unten | S 11.922 | W 0.502 | Körner | 2.8 | — |
| 37 | Stellstift Unruhkl. unten | S 17.826 | W 4.263 | Körner | 1.45 | 1.6025 |
| 38 | Zwischenrad | S 15.170 | W 9.910 | 4.4 | — | 4.59 +0.012 |
| 39 | Pfeiler | S 32.043 | W 18.50 | 4.3 | — | 4.50 +0.012 |
| 40 | Hilfsloch | S 26.163 | W 26.163 | 3.3 | — | 3.50 +0.012 |
| 41 | Stellstift Federhausbr. | S 24.01 | W 30.732 | Körner | 1.45 | 1.6025 |
| 42 | Federhausbr. Schr. | S 18.50 | W 32.043 | » | 2.1 | M 2.6 |
| 45 | Federhaus | N 6.0 | W 24.784 | 4.4 | — | — |
| 47 | Stellstift Federhausbr. | N 31.551 | W 22.924 | Körner | 1.45 | 1.6025 |
| 48 | Federhausbr. Schr. | N 32.668 | W 17.370 | » | 2.1 | M 2.6 |
| 49 | Pfeiler | N 36.437 | W 6.425 | 4.3 | — | 4.5 +0.012 |
| 50 | Stellstift Unruhkl. oben | N 25.233 | W 6.083 | Körner | 1.45 | 1.6025 |
| 51 | Zangenschraube | S 7.537 | O 23.386 | Körner | 1.55 | M 2 |
| 52 | Winkelhebelschr. | S 24.094 | O 20.836 | » | 1.55 | M 2 |
| 53 | Stift f. Wendelfeder | S 37.0 | O 15.0 | » (a dot) | 1.5 H7 | — |

31 rows. Numbers 2, 14-21, 24, 25, 27-34, 43, 44, 46 are not on this plate (2, 14-19, 28-30, 43, 44 are the pillar plate's). The pillar 49 and the counter-click 4 are mirror images about the N-S axis (both N 36.437, 6.425 east or west).

H7 table (01b bottom, `b_h7`): H7 6∅ +0.012; H7 1.5∅ +0.009; H7 5.2 +0.012.

Plan holes, as drawn (`b_ul`, `b_top`, `b_10`, `b_mid`, `b_cd`, `b_e23`, `b_pq`, `b_ll`, `v01a_mid`, `a_e`):

- 1: plain circle (≈ Ø 4.6), the centre; the line 1-10 carries "22,65", the line 1-38 "18,12".
- 3: plain circle, on the N-S axis (≈ Ø 3.5).
- 4: small plain circle (Ø 0.9).
- 5: small circle with a dashed outer ring (a tapped hole drawn with its thread's major diameter dashed): M 1.7.
- 6, 9, 47, 50, 41: small solid circle with a dashed outer ring, each with a cutting line "A … B": the steady-pin holes of section A-B, their counterbore on the hidden face.
- 7: plain small circle (Ø 1.6), no section.
- 8, 42, 48: circle with dashed outer ring: M 2.6.
- 10: circle Ø 8 (radius dimension "5,2 +0,05" is not its own, see below); a dashed circle about Ø 22 round it (hidden: the recess of section J-K); three small tapped holes "M 1,4" with dashed outer rings at 120° ("120°" with arrows), one at 12 o'clock, on a circle whose radius is dimensioned "5,2 +0,05" (the dimension line runs from 10's centre to the arc through the screw holes, arrowhead on the arc). The cutting line J-K runs west-east through 10's centre (J at the left, K on 01a).
- 11, 39, 49: circle Ø 4.5 with a dashed circle ≈ Ø 8.6 round it (hidden: section L-M's recess). L-M cuts 11 west-east.
- 12: plain circle Ø 3.5. 13: plain circle about Ø 2 (smaller than 12, larger than 4).
- 22, 37: small circle with a solid outer ring, cutting lines "C … D": section C-D's counterbore on the visible face.
- 23: circle Ø 10.0 ("5r" radius arrow, "10,0" along the line to 26) with a lobe on its south-east side: two parallel lines "2,5" apart (the figure is written "25" with the comma lost, the same habit as "16" for 1.6) leaving the circle at "50°" (the angle's arc runs between the lobe's axis and a line through 23's centre; its exact reference line is not legible) and ending in a round end. Overall the lobe reaches about 2.5 mm past the circle.
- From the lobe's end a dashed line runs north-east to a dashed arc round 51 (radius written "4 r", or "4,7", not certain), which turns north and disappears under section C-D (drawn on top of the plan there). On 01a a dashed curve continues near "O". This is a hidden pocket on the far face; its other side is not drawn anywhere I can see (hidden under C-D or never drawn). Its depth is section N-O's 1.35.
- 26: two nearly equal concentric solid circles (≈ Ø 5.2 and 4.5), with M 1.2 tapped holes "P" and "Q" either side on a line tilted "7°" to the west-east axis, at "3,5 +0,05" from 26's centre; "11,85" next to P (the 35-26 centre distance, see above).
- 35: plain circle, on the axis below 1 ("23,0" on the axis between 1 and 35).
- 36: circle Ø 2.8 inside a solid circle Ø 6 (section G-H; G-H's cutting line runs west-east through 36).
- 38: plain circle Ø 4.6, "18,12" and "12,63" lines to it.
- 40: plain circle Ø 3.5.
- 45: a centre mark only, in the cutout.
- 51, 52: tapped M 2, dashed outer ring; 52 with "M2" extension lines.
- 53: plain circle "1,5 H7".
- N-O: N on 23's south-west edge; the line runs through 23's centre and 51's centre to O, on 01a just west of 11's recess. (I checked the alignment: the line from N through 23's centre passes within 4 px of 51.)

Sections:

- A-B (`b_ab`): the plate 3.35 thick ("3,35", top face marked "oben"); a counterbore Ø 2.5 from the lower face, 1.6 deep (the "1,6" dimension's arrows sit on the counterbore's floor and the lower face), the small reamed hole above it to the "oben" face. So a steady pin is reamed through 1.75 at the "oben" side only.
- C-D (`b_cd`): the same, upside down: counterbore Ø 2.5 from the "oben" face, 1.6 deep, the reamed hole below it.
- G-H (`b_gh`): through 36: a counterbore "6∅ H7" (the H7 table's 6 +0.012) from the top face, "1,8" deep (arrow on the top face and on the counterbore's floor), the Ø 2.8 hole below through to the lower face. No "oben" mark, but the plan draws the Ø 6 solid, so it is on the "oben" face.
- P-Q (`b_pq`): through 26 and both M 1.2 holes: a bore "5,2 H7" from the lower face, stopping "0,5 +0,05" short of the upper face, where a lip leaves an opening "4,5∅ H7"; the M 1.2 holes' thread lines (dashed) run the full thickness either side. A circled symbol (a roughness or a reference mark, not legible) has a leader to the 4.5 opening. The plan's two circles at 26 are both solid, though the 5.2 is on the lower face in the section: see Step 2.
- N-O (`b_no`): from 23 (left, unhatched: the hole's far wall seen, full thickness) through the plate; the lower face is stepped up over most of the length (a pocket on the lower face) and returns to full thickness near the right-hand end, which ends in a curved break line. A tapped hole (dashed thread lines) in the pocketed part is 51. "1,35 −0,05" is dimensioned at the right-hand end between the pocket's floor and the full lower face: the pocket is 1.35 −0.05 deep, leaving about 2.0.
- J-K (`v01b_jk`, `v01a_jk`): the plate cut through 10: the lower face recessed over a width "22∅" (centred on 10) with the recess's wall at 45° ("45°" with an arrow at the wall) and "0,7" at the recess. Two readings: (i) the recess is 0.7 deep with a 45° wall; (ii) the recess's edge has a 0.7 × 45° chamfer, its depth given nowhere. The arrows of "0,7" sit across the recess's depth on 01a's crop, which favours (i); the scan's line widths do not settle it. Measured on the crop, the step is about 0.55-0.7 mm, which fits (i).
- L-M (`v01a_top`): through 11: a recess "8,6∅" on the lower face, "0,3 +0,03" deep, the Ø 4.5 hole through.

### Interpretation

The top plate is a 3.35 mm brass disc, Ø 85 h6, with the barrel's side cut away to Ø 42.5 so it is a crescent. It is held on three pillars (11, 39, 49), whose spigots fit Ø 4.5 H7 holes from the inside, their shoulders seated in Ø 8.6 × 0.3 recesses in its inner face. On its outer face sit the upper balance cock (screw 8 M 2.6, steady pins 6, 9 and 50, the last a later addition by its place at the table's end), the barrel bridge (screws 42, 48, M 2.6; steady pins 41, 47), the fusee bush's flange (three M 1.4 at r 5.2 round 10) and the stop pin 7; under its inner face sit the lower balance cock (pins 22, 37 counterbored from outside so their reamed length is on the inside; its screw 36 comes in from outside, head sunk in the Ø 6 H7 counterbore), the counter-click (Gegensperrkegel) pivot 4 and its wire spring's screw 5 (M 1.7). The train's upper pivots run in holes reamed 4.59 (1, 35, 38: bushes pressed in, see 05 08 01), 8.0 (the fusee bush, 10) and the escape wheel's setting at 26 (a Ø 5.2 H7 seat against a 0.5 lip, held by two M 1.2 screws). 51, 52 and 53 with the pocket N-O carry a balance-holding device (Zange = tongs, Winkelhebel = bell crank, Wendelfeder = coil spring); the lobe on the balance hole 23 lets its tongs reach the balance.

### Step 2, views against each other

- Table against plan: every one of the 31 rows has its circle (49, 3, 4, 5, 6, 7, 8, 9, 10, 1, 22, 23, 26, 35, 36, 37, 38, 39, 40, 41, 42, 45 (centre mark), 47, 48, 50, 51, 52, 53 on 01b; 11, 12, 13 on 01a). Placed by their coordinates at about 10.4 px/mm, each lies within 1.5 mm of its circle (the scan's scale varies a little across the sheet).
- Plan holes without a row: the three M 1.4 round 10 (dimensioned in plan, not tabled) and the two M 1.2 at 26 (P, Q; dimensioned in plan and P-Q). Not unattached: each has its own dimensions.
- **Inconsistent, table against section, 26**: the table says punch, drill 2.3, ream 2.5 +0.009; plan and P-Q draw Ø 5.2 H7 / 4.5 H7. Two readings: (i) the table's 2.5 is the jig-bored pilot every hole gets at its coordinate, and the 5.2/4.5 seat is opened on it afterwards (the H7 table lists 5.2, the sections give the finished seat); (ii) the table was left from an earlier plain-hole design. The same pattern is on the pillar plate's 30 (below), which favours (i).
- **Inconsistent, plan against section, 26**: P-Q puts the 5.2 bore on the lower face and the 4.5 lip on the upper, so a plan of the "oben" face should show the 4.5 solid and the 5.2 dashed; the plan draws two solid circles. Either P-Q is drawn upside down (it carries no "oben") or the plan's line style is wrong. Possible; the scan's two circles are only 0.35 mm apart and their line style is hard to judge.
- Section J-K's recess (Ø 22) is drawn dashed in plan round 10: consistent with a recess on the lower face. Its depth: two readings, above.
- **Unattached**: "50°" at 23's lobe (which line it is measured from is not legible); "4 r" (or 4,7) at 51's dashed arc; the hidden pocket's other edge (not drawn, or hidden under section C-D); "1,35 −0,05" is attached (pocket floor to lower face) but the pocket has no plan dimensions besides that arc.
- "Fertigmaß 3,35" against sections A-B and C-D "3,35": consistent.
- Row 7 "16 +0,009": the H7 table lists 1.5 +0.009, not 1.6. Reading: 1.6 with the H7 tolerance of its range (1.5 and 1.6 both take +0.009 in H7); the steady pins' 1.6025 is a different fit. Possible ambiguity between 1.5 and 1.6: the glyph is "16".
- Row 13's last two cells are not legible; its coordinates carry +0.01 tolerances (the only ones in the table).
- 51-53 and the N-O pocket appear only here, not on the top plate's assembly (05 08 01, below).

## 05-08_02: 05 08 01, "Oberplatte kompl." (top plate, assembled)

### Step 1, inventory

Title block (`s02_tb`): 05 08 01, "Oberplatte kompl.", Werkstoff "—", Maßstab 2:1, Hamburg 11 Stubbenhuk 25, gez. 25.9.41, gepr. 15.8.41 (sic, before gez.; or 25.8.41), N.gepr. 30.4.43. Revision a: "zeichnerisch geändert" 8.11.46, initials.

Plan (`s02_plan`, `s02_lr`, `s02_c`): the crescent plate seen from the same side as 01b, at 2:1. A stepped cutting line A-B: from A (top, through 3) down, offset east through 10, back west to 1, down through 36 and 35 to B. Drawn: 49 (dashed recess), 3, 4, 5 (tapped), 48 (tapped) and 47 at the upper horn, 50, 6, 7 (the leader "05 08 01-5, Anschlagstift unten vorstehend": the stop pin, protruding below), 8 (tapped), 9; 10 with the bush: a dashed circle ≈ Ø 22, a solid circle ≈ Ø 16 (the bush's end ring, 05 08 01-3/-4, seen from above), the bore circles, and three screw heads at 120° (one at 12 o'clock); 1 with a ring and a dot, leader "WN-301"; 22; 36 as a ring Ø 6 with a dark centre (a screw head in its counterbore); 37; 38 and 35 as rings, leaders "WN-300" (two leaders); 23 with its lobe, here a curved tail bending south-east and marked "(a)"; 11 (dashed recess), 12, 13; 42 (tapped), 41, 40, 39 (dashed recess); 45 a centre cross.

Not drawn: 26 (the escape wheel's setting), 51, 52, 53, and the N-O pocket. Where 26, 52 and 53 would be, the paper shows the ghost of erased lines (`s02_lr`). Where 51 would be, nothing.

Section A-B (`s02_sec`): the plate (hatched) vertical; from the top: 3 open; at 10 the fusee bush 05 08 01-2 with its flange on the left face (in the Ø 22 recess), held by screws WN-34 put in from the left, its body standing out to the right with the rings 05 08 01-4 and 05 08 01-3 at its end (05 08 01-1 is the plate's leader); at 1 a bush (WN-301) in the plate; at 36 a screw whose head sits in the counterbore on the right face, its shank through to the left; at 35 a bush (WN-300) with a hole shaped like an oil sink.

### Interpretation

The plate as assembled: the bushes WN-300 (35, 38) and WN-301 (1) pressed into their 4.59 holes, the fusee bush screwed to the inner face by three WN-34 with its body through the 8.0 hole and out of the outer face (the face where the winding square is reached), the stop pin 05 08 01-5 pressed in at 7 and standing out of the inner face. The 1946 revision redrew the balance hole's lobe and, with the eraser, removed 26 and the balance-holding device's holes.

### Step 2, views against each other

- The right side of A-B is the "oben" face of 01: the screw head at 36 sits in the Ø 6 counterbore on that side, which 01's plan draws solid. The fusee bush therefore stands out of the outer face and its flange is on the inner face in the Ø 22 recess; the plan's dashed Ø 22 agrees (hidden). Consistent.
- **Inconsistent with 01**: 26, 51, 52, 53 and the pocket are on 05 09 01 (1943) but not on 05 08 01 (1941, revised 1946), where 26 and the holding device's holes are erased. Two readings: (i) the 1946 revision dropped the balance-holding device (51-53, the pocket) and, by mistake or by intent, 26; (ii) 26 was erased only because the area was redrawn and was meant to stay. The escape wheel needs an upper bearing and nothing else on this sheet carries it, so (ii) is likely for 26 and (i) for 51-53. Which version the model draws is for Step 3.
- **Inconsistent with 01**: the balance hole's lobe is straight, 2.5 wide at 50° on 01, curved on 02 "(a)" (1946). Version difference, recorded with its date.
- 7's stop pin "unten vorstehend" means out of the inner face: consistent with 01's plain Ø 1.6 hole (no counterbore).
- 02's plate has no hole the 01 table lacks.

## 05-08_03a and 05-08_03b: 05 08 02-1, "Unterplatte" (pillar plate)

The sheet is scanned in two halves: 03b the plan's west and middle with sections A-B and G-H; 03a the east rim, sections E-F and C-D, the table, notes and title block. Overlaid at (710, −47) px (`comp03.png`) they join near O 30.

### Step 1, inventory

Title block (`t03_tb`): 05 08 02-1, "Unterplatte", Werkstoff "Messingblech 4 / Sonder Ms α-β Gef.", Maßstab 4:1, Hamburg 11 Stubbenhuk 25, gez. 23.4.41, gepr. 24.4.41, N.gepr. 5.5.41 and a second line 30.4.43. No revision letter.

Notes (`t03_note`): "Rondelle 4 mm × 90∅ / abgedreht 3,5 × 90∅ / körnen u. stanzen, fräsen, kalibrieren / fertig 85∅ h6 / ~~3,35 ±0,02~~ stark" (the thickness struck through; a faint replacement written below it is not legible). Sections A-B mark "3,35".

Coordinate table, every row (`t03_1`…`t03_4`, `t03_10k`, `t03_39k`):

| Nr | Benennung | N/S | O/W | Körner/stanzen | bohren | kalibr. |
|---|---|---|---|---|---|---|
| 1 | Minutenrad | N 0.0 | O 0.0 | 4.4 | — | 4.59 +0.012 |
| 2 | Auf u. Ab | N 23.0 | O 0.0 | 3.3 | — | 3.50 +0.012 |
| 3 | Hilfsloch | N 37.0 | O 0.0 | 3.3 | — | 3.50 +0.012 |
| 4 | Gegensperrkegel | N 36.437 | O 6.425 | Körner | 0.9 | — |
| 10 | Schnecke | N 15.292 | O 16.708 | Körner | 2.5 | 2.70 ±0.009 (the sign between is a "±" or "+", blurred) |
| 11 | Pfeiler | S 3.225 | O 36.858 | 4.3 | — | 4.50 +0.012 |
| 12 | Hilfsloch | S 9.576 | O 35.739 | 3.3 | — | 3.50 +0.012 |
| ~~14~~ | Stellstift f. Zeigerst. Kl. ob. | S 17.229 | O 36.411 | Körner | 1.45 | (brace) |
| ~~15~~ | Stellstift f. Zeigerst. Kl. unt. | S 22.871 | O 33.211 | Körner | 1.45 | (brace) |
| ~~16~~ | Zeigerstellkl. Schr. unt. | S 21.471 | O 30.789 | Körner | 2.8 | (brace) |
| ~~17~~ | Zeigerstellkl. Schr. ob. | S 15.929 | O 33.989 | Körner | 2.8 | (brace) |
| ~~18~~ | Zeigerstelltrieb | S 12.780 | O 22.136 | 3.3 | — | 3.50 +0.012 |
| 19 | Wechselrad | S 6.30 | O 10.912 | 3.3 | — | 3.50 +0.012 |
| 23 | Unruh | S 12.110 | O 9.10 | 4.4 | — | — |
| 26 | Gangrad | S 21.743 | O 11.783 | Körner | 2.3 | 2.50 ±0.009 |
| 28 | Zwischenbr. Schr. | S 26.410 | O 4.315 | Körner | 2.1 | M 2.6 |
| 29 | Stellstift f. Zw. Br. | S 28.580 | O 7.062 | Körner | 1.45 | 1.6025 |
| 30 | Ankerrad | S 33.730 | O 5.028 | Körner | 2.3 | 2.50 ±0.009 |
| 35 | Sekundenrad | S 23.0 | O 0.0 | 6.0 | — | — |
| 38 | Zwischenrad | S 15.170 | W 9.910 | 4.4 | — | — |
| 39 | Pfeiler | S 32.043 | W 18.50 | 4.3 | — | 4.50 +0.012 (a "+0,1" struck through with one stroke, "+0,012" written after) |
| 40 | Hilfsloch | S 26.163 | W 26.163 | 3.3 | — | 3.50 +0.012 |
| 43 | Zwischenbr. Schr. | S 5.251 | W 22.464 | Körner | 2.1 | M 2.6 |
| 44 | Stellstift f. Zw. Br. | S 3.081 | W 25.21 | Körner | 1.45 | 1.6025 |
| 45 | Federhaus | N 6.0 | W 24.784 | Körner | 2.7 | 2.90 ±0.009 |
| 49 | Pfeiler | N 36.437 | W 6.425 | 4.3 | — | 4.50 +0.012 |
| 56 | Kontakt Schr. r. | S 40.190 | O 5.000 | "nur bei Bedarf" | 1.3 | M 1.7 |
| 57 | Kontakt Schr. l. | S 38.184 | W 13.500 | (the same) | 1.3 | M 1.7 |

Rows 14-17 are bracketed "nur wenn Zeigerstellung eingebaut wird" (only if the hand setting is fitted), with no reamed size (the steady pins 14, 15 are drilled 1.45 and their ream not written; the screws 16, 17 drilled 2.8, a clearance size, no thread). The numbers 14, 15, 16, 17 and 18 each have a pencil stroke through them; 18 lies outside the bracket but is struck too. 29 rows (24 without the struck five).

Plan (03b, 03a; `b3_top`, `b3_38`, `b3_ab`, `b3_30`, `b3_23`, `b3_r`, `a3_ef`, `a3_cd`, `comp03_e`): a full disc Ø 85, no cutout at the barrel. Holes:

- 1, 2, 3 on the N-S axis ("23,0" between 1 and 2; "23,0" between 1 and 35); 4 small; 49, 11, 39 each a circle Ø 4.5 inside a solid circle ≈ Ø 8.6 (section E-F through 11: the recess on the visible face).
- 10 a circle ≈ Ø 2.7, "22,65" to 1. 45 ≈ Ø 2.9. 40, 12 Ø 3.5. 19 Ø 3.5. 18 Ø 3.5.
- 23: a circle with a radius arrow, the figure before "r" not legible (a "2", "3" or "7"); measured on the scan the circle is about Ø 7 (radius ≈ 3.5). "10,0" along the line to 26.
- 26: a circle ≈ Ø 2.5; two M 1.2 tapped holes either side on the line 23-26-…: one at "3,5 +0,05" (dimensioned, with "M1,2"), the other drawn dashed (a tapped hole, not dimensioned); the line from that M 1.2 continues south-east at "37°" to the horizontal and carries "6,5" and "8,3 −0,1" to the hand-setting pocket (below).
- 28 Ø 2.6 (tapped M 2.6, drawn as a plain circle); 29 with a solid outer ring, "A … B" (section A-B); 43 plain; 44 with a solid outer ring, "A … B".
- 30: a circle ≈ Ø 4.6 with a dashed outer circle ≈ Ø 5.2, and M 1.2 tapped holes "G" and "H" either side on its west-east line at "3,5 +0,05"; "11,85" near it (the 35-26 line passes close by).
- 35: a circle Ø 6.0 joined to the large cutout round 38 (below) as a lobe.
- 38: a large round cutout centred on 38 with the leader "vor dem kalibrieren auf 24,5 fräsen" (mill to Ø 24.5 before reaming); 35's circle cuts into its rim, so the outline is the Ø 24.5 circle with a round bulge at 35.
- 56, 57: tapped holes (dashed outer ring), each near the south rim.
- The hand setting (`a3_cd`, `comp03_e`): a rectangle about 6.5 wide and 12 long, its long axis pointing north-north-east (cutting line "C … D" along it), with two cross-lines 6.5 apart in its middle ("6,5"); its north-west long side is located "6,5" and "8,3 −0,1" along the 37° line from 26's M 1.2 hole, and on 03a by "9,3 −0,1" and "0,5" (or "9,5"; the figure is cut by the scan's crease) from the rim. From the rectangle's south-east side two dashed lines (a hidden bore, parallel to the plate's face) run east-south-east between 17/14 and 16/15 to the rim. 14 and 15 (small, Ø 1.45-1.6), 16 and 17 (Ø 2.8) flank the bore.
- Section C-D (`a3_cd`): the plate cut along the rectangle's axis: a pocket whose ends are arcs of a "14∅" cutter, "12 +0,2" long, and a circle (the bore, seen end on) with "1,2" (between arrows) and "1,68" (from a face to the circle's centre, or to its edge) and "2" (from the face). Readings: a pocket 12 +0.2 long cut by a Ø 14 side mill, and a bore Ø 1.2 lying along the plate, its axis 1.68 from the face (or 2 deep to its far edge). The figures are only just legible.

Sections:

- A-B (`b3_ab`): "oben" face at top; plate "3,35"; counterbore "2,5∅" from the "oben" face, "1,6" deep, the reamed pin hole below it. For 29 and 44.
- E-F (`a3_ef`): through 11: the recess "8,6∅", "0,3 +0,03" deep, on the face at the top (the face the plan shows solid), Ø 4.5 through.
- G-H (`b3_gh`): through 30 and both M 1.2: a bore "5,2∅ H7 +0,012" from the face at the top, stopping "0,5" (tolerance "−0,03" or "+0,03", blurred) short of the lower face, where the opening is "4,59∅ H7 +0,012"; the M 1.2 threads (dashed) through. No "oben".

### Interpretation

The pillar plate is the full Ø 85 h6 disc, 3.35 thick (struck and replaced by a figure I cannot read), with its pillar recesses (Ø 8.6 × 0.3) on its inner face, the face the plan shows. It carries the lower pivots of the train and barrel: the fusee (10, 2.70), the barrel arbor (45, 2.90), the centre (1, 4.59, a bush), the up-and-down work (2), the balance's lower setting (23, a plain opening about Ø 7; the lower balance jewel is in the lower cock, 05 08 00-2, below the top plate), the escape wheel (26, 2.50 with two M 1.2 for an endstone cap), the counter-click (4); the seconds wheel's arbor passes through the Ø 6 hole 35 and the third (intermediate) wheel turns in the Ø 24.5 cutout at 38. On its outer (dial) face the intermediate bridge (Zwischenbrücke) is held by 28 and 43 (M 2.6) on steady pins 29 and 44, whose counterbores open on the inner face so the pins are reamed in the dial-side 1.75. The motion work's change wheel stud sits in 19. A lever chronometer's escape wheel ("Ankerrad", 30, a 5.2/4.59 H7 setting with two M 1.2), electrical contact screws (56, 57, "nur bei Bedarf") and a hand-setting mechanism (14-18, the pocket and the radial bore, "nur wenn eingebaut") are options this one plate serves.

### Step 2, views against each other

- Table against plan: all 29 rows have their circles (14-18 included); each lies within about 1.5 mm of its table place at 9.75 px/mm.
- Plan holes without a row: the two M 1.2 at 26 and the two at 30 (G, H). Each is dimensioned in plan ("3,5 +0,05").
- **Inconsistent, table against section, 30**: table drill 2.3, ream 2.50 ±0.009; plan and G-H a 5.2 H7 / 4.59 H7 seat. Same pattern as the top plate's 26; reading (i) (the table's ream is the jig-bored pilot) the likelier.
- **Inconsistent, plan against section, 30**: G-H puts the 5.2 bore on the face drawn at the top; the plan shows the 5.2 dashed, so the 5.2 is on the hidden (dial) face and G-H is drawn with the dial face up. G-H has no "oben", so this is not a contradiction, but G-H's figure-up face is the opposite of A-B's. Likely.
- 23: the table's "4,4" punch has no reamed size; the plan draws about Ø 7 with a radius figure I cannot read. Unattached size.
- 35: table 6.0 punched, no ream; the plan draws it as a lobe of the Ø 24.5 cutout. Consistent (the lobe is the 6.0 hole).
- 38: table 4.4 punched, no ream; the cutout (Ø 24.5 milled before reaming) removes it. Consistent.
- Row 39's tolerance was corrected from +0.1 to +0.012; 11 and 49 read +0.012. Consistent after the correction.
- The thickness note is struck and the replacement illegible; A-B still says 3.35. Unresolved figure: possible.
- The hand-setting pocket: its 37° line starts at 26's M 1.2 hole, an odd datum but drawn so. "9,3 −0,1" and "0,5"/"9,5" on 03a: the extension lines run from the rim, but which edge of the rectangle each reaches is not legible. Unattached in part.
- 14 and 15 have no reamed size (a steady pin needs one); the bracket covers them. Unattached sizes.
- 56/57 are written "nur bei Bedarf" in the punch column.

## 05-08_32-2: 05 08 02, "Unterplatte kompl." (pillar plate, assembled)

### Step 1, inventory

Title block (`p_tb`): 05 08 02, "Unterplatte kompl.", Werkstoff "—", Maßstab 2:1, Hamburg 11 Stubbenhuk 25, gez. 23.10.41, gepr. blank, N.gepr. 30.4.43. No revision.

Plan (`p_plan`): the pillar plate from the same side as 03b, at 2:1, with a straight cutting line A-B on the N-S axis (A at the top, B at the bottom, arrows pointing east). Drawn: 49, 11, 39 (with the solid recess ring), 3, 4, 2 (a ring: a bush), 10, 45, 1 (a ring and a dot: a bush), 19 (a ring), 23 (plain), 26 with two dashed screw holes, 28 (a slotted screw head), 29, 30 with a ring and two dashed screw heads (C, D: section C-D), 35 (three concentric rings: a setting), 38's cutout with 35's lobe, 40, 43 (a screw, leader "WN-52"), 44, 56, 57 (each a circle with a cross: screws), 12, the hand-setting rectangle with 18 (a ring) and 14, 15, 16, 17 (each a circle with a cross). A long round-ended outline, dashed where the plate hides it and solid across the open cutout, runs from 44/43 (north-west end) to beyond 29/28 (south-east end): the intermediate bridge (05 08 04) lying on the far face. At the rim on the B line (6 o'clock) a small round notch, about 0.5 mm deep (`p_notch`), which 03b does not draw (`b3_bot`).

Section A-B (`p_sec`): the plate vertical, the right face its inner ("oben") face. From the top: 3 open; at 2 a bush "05 08 02-2", with the note "Futter an dieser Seite eindrücken" (press the bush in from this side, arrow at the right face), and a pin standing "12,3" out of the left face; 05 08 02-1 the plate; at 1 a bush "WN-302", set "0,1 +0,02" below the right face (the arrows sit on the right face and the bush's end); a pin standing "6,8" out of the left face at the height of 19 (S 6.3, which is not on the A-B line: the section shows features at their N-S place whatever their O-W one); at 35 a jewel setting with its hole (the hourglass of a jewel) in a ring on the left face; at about 30's height a slotted screw head on the left face.

Section C-D (`p_cd`): through 30: a setting flush in the plate with two slotted screws whose heads lie over its rim on the face drawn at the top.

Section E-F (`p_ef`): through the hand-setting pocket across its width: the plate cut at an angle; a pocket whose ends are arcs; a small circle (the bore end on).

### Interpretation

As assembled the pillar plate carries the up-and-down work's stud (a pin 12.3 long in the bush 05 08 02-2, pressed in from the inner face) and the change wheel's stud (6.8, at 19) on its dial face, the centre bush WN-302 0.1 below its inner face, the seconds wheel's jewel setting at 35 and, held by WN-52 at 43 and a screw at 28, the intermediate bridge on its dial face. The setting at 30 with its two screws and the hand-setting parts (18's ring, the screws 14-17) are drawn fitted.

### Step 2, views against each other

- Plan against 03: no hole on 32-2 that 03 lacks, except the rim notch at 6 o'clock. **Inconsistent**: the notch is on the assembly only. Reading: the movement ring's "wird bei Montage der Unterplatte gebohrt" Ø 1 hole at 6 o'clock (05 08 00-3, below), drilled at assembly on the joint between ring and plate, half in each: the assembly drawing shows the half in the plate, the part drawing (made before assembly) doesn't. Likely.
- 30 in C-D shows screw heads on the top face; the plan draws 30's screws dashed (hidden). As on 03's G-H, the section is drawn dial face up. Consistent once that is allowed.
- A-B's straight line meets 2, 1 and 35, but the section also shows 19's stud and a screw at 30's height, neither on the line. Inconsistent with the cutting line as drawn; reading: the section is in effect developed or stepped without being marked. Possible.
- WN-52 points at 43 (a Zwischenbr. Schr.). 28's screw has no label.

## 05-08_11: 05 08 00-1, "Pfeiler" (pillar)

### Step 1, inventory

Title block (`pf_tb`): 05 08 00-1, "Pfeiler", Werkstoff "Rundmessing 8,5 DIN 1758, Ms 58 ~~hart~~" (hart struck), Maßstab 5:1 (and 1:1 for the small view), Hamburg 11 Stubbenhuk 25, gez. 2.6.40, gepr. 16.8.40, N.gepr. 30.4.43. No revisions. Surface mark ▽▽▽.

One view at 5:1, half in section (right half hatched), axis vertical, and a small outside view "M 1:1".

Dimensions (`pf_top`, `pf_mid`, `pf_28`, `pf_814`, `pf_bot`):

- "4,5∅ f7 −0,010/−0,022": the spigot's diameter, extension lines on its two cylindrical sides.
- "4,3∅ −0,2": the spigot's end diameter (the start of its lead-in).
- "6°": the lead-in's taper, angle between the cylindrical side and the tapered side near the end.
- "1,1 −0,2": the tapered lead-in's length (from the end face down to where the taper meets the cylinder).
- "2,8 −0,1": the spigot's whole length, end face to the shoulder.
- "90°": the countersink at the threaded hole's mouth in the end face.
- "8,14 −0,2" (the "4" is cramped against the line; "8,1 −0,2" is the other reading): the body's diameter.
- "M 2,6": the threaded hole on the axis; a dashed (drilled) hole the full length; "Gewinde von beiden Seiten einschneiden" (tap from both ends).
- "19,6 ±0,04": between the two shoulders.
- "25,3 −0,2": overall, end face to end face. A pencil figure beside it ("25,3" or "25,4") is faint.
- "wie oben": the lower end is as the upper.
- At each shoulder a small relief groove is cut into the body's end face at the spigot's root (the semicircular notch in the section, `pf_bot`), not dimensioned.

### Interpretation

A brass pillar Ø 8.14 (from 8.5 bar), 19.6 between shoulders, with a spigot 4.5 f7 × 2.8 at each end (lead-in 1.1 at 6°, end Ø 4.3) and an M 2.6 thread from each end through a drilled hole, the mouths countersunk 90°. Its spigots fit the plates' 4.5 H7 holes (11, 39, 49), its shoulders sit in their Ø 8.6 × 0.3 recesses, so the plates' inner faces are 19.6 − 0.6 = 19.0 apart (001: "innerer Plattenabstand 19 mm"). The spigot ends stand 3.35 + 0.3 − 2.8 = 0.85 below each plate's outer face, so a screw (WN-57 above, WN-56 below in the coloured section) clamps each plate to its pillar with its head on the plate.

### Step 2, views against each other

- **Inconsistent (small)**: 19.6 + 2 × 2.8 = 25.2, but the overall length is 25.3 −0.2 (25.1-25.3). The limits overlap, the nominal figures differ by 0.1. Sure (the figures are legible); which one governs is the maker's: the 2.8 −0.1 spigots and 19.6 ±0.04 between shoulders fix 25.0-25.28.
- The small 1:1 view agrees in proportions.
- The relief grooves are drawn but not dimensioned. Unattached.

## 05-08_07: 05 08 00-3, "Werkring" (movement ring)

### Step 1, inventory

Title block (`r_rev`): 05 08 00-3, "Werkring", Werkstoff "—" (none given), Maßstab 1:1, Hamburg 11 Stubbenhuk 25, gez. 2.7.41, gepr. 30.7.41, N.gepr. 3.4.43 (?). Revision a, "7×" (seven places), 6.12.46: "Maß 3 +0,1 war 3; 10,7 −0,1 war 10,7 −0,05; 3 ±0,05 gestr.; 7 −0,1 war 7 ±0,07 (or ±0,05); 0,7 +0,1 war 0,7 +0,05; bildl. berichtigt" (pictorially corrected). Surface mark ▽▽▽.

Section (`r_sec`), the ring cut on a diameter, both walls hatched: the outer face of an L-shaped wall with a 45° chamfer at the top outside; inside, the bore steps.

- "105,95∅ −0,1 (a)": the outside diameter.
- "104∅ +0,1": a diameter near the top (the step at the top outside, under the 45° chamfer, or a recess in the top face: the arrows are off the drawn section).
- "93∅ +1,3" (legible as written; a tolerance of +1.3 is odd, "+0,3" would be the other reading): the inner top edge.
- "45°": the chamfer at the top outside (arrow at the top left).
- "2,8": from the top face down to a small circle on the far wall (a radial hole seen end on).
- "1,1∅": two dashed vertical lines the full height near the middle (a hidden axial hole Ø 1.1 in the far wall).
- "0,7 +0,1 (a)": a step at the top (arrows at the top face and a line 0.7 below).
- "7 −0,1 (a)": a height from the top face (to the seat's floor, by the arrows' places).
- "3 +0,1 (a)": a height at the bottom of the bore (the lower lip), leader to the lower inner step.
- "4,7": a height on the right, between two arrows (the outer wall's lower part).
- "10,7 −0,1 (a)": the overall height.
- "83∅" (a tolerance erased, "+0,1"?): the smallest bore (the lower lip).
- "85∅ H9 +0,035": the seat for the plate (the plates are 85 h6).
- "96∅" (a tolerance erased): the lower outer step.
- "(a)" also beside "4,7"'s place.

Plan (`r_top`, `r_bot`): concentric circles (outside, steps, bore) with two dashed circles (hidden steps); a chain circle "89∅" through three tapped holes "M 2,6" at 120° ("120°" twice): one at 20° clockwise from 12 o'clock (a circle with a thread hatch), one at 140° (lower right, "M 2,6" with extension lines), one at 260° (left). At the left a further "20°" (between the left hole's radius and a line about 20° below it; which line is the datum is not legible). At 12 o'clock two dashed lines "1,6" apart run across the wall: a hidden radial hole Ø 1.6. At "6°" a small hole on a radius dimensioned "50,5" (R 50.5, near the outside), leader "wird bei Montage des Zifferblattes gebohrt" (drilled when the dial is fitted). At 6 o'clock a small dark circle on the Ø 85 seat circle, "1" (Ø 1), leader "wird bei Montage der Unterplatte gebohrt" (drilled when the pillar plate is fitted). "(a)" at the lower left.

### Interpretation

A ring (material not given), Ø 105.95 × 10.7, into whose Ø 85 H9 seat the pillar plate drops (85 h6) to rest on a lip (bore Ø 83). Three screws on the Ø 89 circle hold the plate: their heads overlap the plate's rim (the coloured section shows a large slotted head over the plate's edge, its shank in the ring alone), so the plate has no holes for them. A Ø 1 pin drilled at assembly across the joint at 6 o'clock fixes the plate's angle (half in the ring, half in the plate's rim: the notch on 32-2). The dial is fixed to the ring's lower face by a screw in a hole drilled when the dial is fitted (6°, R 50.5, the Ø 1.1 axial hole; the coloured section's "Schraube WN-10" from below through the dial). A radial pin ("Stellstift 3 WN-202" in the coloured section, standing out of the ring's outside) in the Ø 1.6 radial hole at 12 o'clock, 2.8 below the top face, locates the movement in its case.

### Step 2, views against each other

- The radial Ø 1.6 at 12 o'clock (plan) and the small circle at 2.8 in the section: consistent if the section is cut through 12 o'clock and shows the far wall's hole end on. The section's circle looks smaller than 1.6, but at this scale (1:1, about 3.4 px/mm) that is not measurable. Likely.
- The axial "1,1∅" in the section and the dial hole at 6° in plan: consistent (the section's dashed pair sits about 5 mm from the radial hole's circle, as R 50.5 × sin 6° = 5.3 gives). Likely.
- **Unattached**: "104∅ +0,1" (its arrows don't reach a drawn edge in the section); "4,7" (which two edges); the left "20°" (its datum line); "93∅ +1,3" (an implausible tolerance, the figure is legible).
- The three M 2.6 have no depth; the section shows none of them.
- The ring's material is not given.

## How these parts join, from the assembly sheets (02, 32-2, the coloured section, 001)

- The pillars stand between the plates, spigots in the plates' 4.5 H7 holes, shoulders in the 8.6 × 0.3 recesses; a screw at each end into the pillar's M 2.6 (coloured section: WN-57 into the top end through the top plate, WN-56 or an unlabelled screw into the lower end through the pillar plate; WN-56's leader ends between that screw and the ring screw, and I cannot tell which it names). 001: "Platten∅ 85 mm, innerer Plattenabstand 19 mm".
- The pillar plate sits in the movement ring's 85 H9 seat on its Ø 83 lip, clamped by three screws in the ring whose heads overlap the plate's rim; pinned at 6 o'clock by a Ø 1 pin drilled at assembly across the joint.
- The dial (05 02 00-4) under the ring, screwed to it (WN-10) through a hole drilled at assembly.
- The radial pin WN-202 ("Stellstift 3") in the ring.
- On the top plate: the fusee bush 05 08 01-2 by three WN-34 (M 1.4) to the inner face, through 10; bushes WN-300 (35, 38) and WN-301 (1) pressed in; the stop pin 05 08 01-5 pressed in at 7, standing out of the inner face; the upper cock (screw 8, pins 6, 9, 50), the lower cock (screw 36 from outside, pins 22, 37), the barrel bridge (screws 42, 48, pins 41, 47), the counter-click (pivot 4) and its wire spring (screw 5), the escape setting (26, two M 1.2), the holding device (51-53, 1943 sheet only).
- On the pillar plate: the up-and-down stud in the bush 05 08 02-2 (pressed from the inner face) at 2; the change-wheel stud at 19; the centre bush WN-302 at 1, 0.1 below the inner face; the intermediate bridge on the dial face (screws 43 WN-52, 28; pins 29, 44); the seconds wheel's jewel setting at 35 on the dial face (A-B shows it in the bridge or on the plate: the hatched ring stands on the left face, so in the intermediate bridge, likely); the escape wheel's endstone cap (two M 1.2 at 26); options 30, 56, 57, 14-18.

## Step 3, blind reading against the transcriptions and the code

Opened after everything above was written: `References/wempe/transcriptions/05-08-frame.md` (its sections for 01a, 01b, 02, 03a, 03b, 07, 11, 32-2, and its cross-check), and the comments in `marine-chronometer-source/wempe/js/frame.js` (top plate, pillar plate, pillars, movement ring), `dims.js` (hole table, plates, pillars), `escapement.js` (the escape settings), `dial.js` and `case.js` (the ring), `app.js` (the parts' cards).

### My own steps 1-2 corrected on re-reading

Each re-checked on the crop after the transcription or the code disagreed; my Step 1 text is left as written.

1. **Top plate 26, P and Q**: they lie on the west-east line through 26 (both at the same height on `b_pq`), not on a line tilted 7°. The "7°" (or "7 r") beside Q is unattached; the code puts them on the O-W line.
2. **Top plate 26, the lip**: "4,5∅ H7" carries the circled revision mark; revision a reads "∅ 4,5 in 4,59", so the lip is 4.59 H7 as revised. My "∅ 4,5 … 4,59" was the same text; the circled symbol I couldn't read is that "a".
3. **Top plate, the M1.4 circle round 10**: "5,2 ±0,05" (the sign is a ±, written small), not "+0,05".
4. **Pillar plate 26's M1.2**: both lie on a line at 37° to the west-east axis through 26 (the "37°" dimension is that line's), not on the line 23-26. The line carries on south-east to the hand-setting window's "6,5" and "8,3 −0,1".
5. **Pillar plate "11,85" near 30** is 35-30 (√(5.028² + 10.73²) = 11.85), not 35-26 passing by.
6. **The hand-setting rectangle** is a window through the plate, not a pocket: C-D (03a) and E-F (32-2) leave the middle unhatched over the full thickness between the two end arcs (`a3_cdz`, `p_ef`). The two cross-lines 6.5 apart are where the Ø 14 cutter's arcs reach the other face. The circle in C-D lies between two extension lines "2" apart: a bore Ø 2, its centre "1,68" from the face; the small figure above it (I read "1,2") is unattached.

### Differences (misread)

| # | sheet | item | transcription | code | my reading | which is right, and why |
|---|---|---|---|---|---|---|
| M1 | 01a | Schnitt L-M, the pillar seat's face | "on the face shown" | inner face, "dashed from the top plate's outer face" | inner face (dashed in plan, `a_e`) | mine and the code: 01b/01a draw 11, 39, 49's Ø 8.6 dashed; the seats face the other plate (001: inner distance 19.0 = 19.6 − 2 × 0.3) |
| M2 | 01a | revision a | "6,15 in 4,59" (unsure) | "∅ 4,5 in 4,59" | "∅ 4,5 … 4,59" (`v01a_rev2`) | the code and mine: P-Q's "4,5∅ H7" carries the circled "a"; nothing on the sheet is 6.15 |
| M3 | 01a | row 13, kalibr. | "—" | (drilled 1.8 through) | not legible (`t01a_r1013`) | open; the cell is greyed by the scan. The code's clearance hole for the detent block's screw is consistent with "—" |
| M4 | 01b | Schnitt N-O | "the barrel cut-out's edge: lip 1,35, the plate cut back to 1,35 there" | the holding work's pocket from 23 to 51 in the inner face, 1.35 −0.05 deep | the same as the code (`b_N`, `b_no`, `b_e23`) | mine and the code: N's leader touches 23's edge, the line runs through 23's and 51's centres; the section's left end is 23's far wall, its tapped hole 51. The section is only drawn on the paper inside the cut-out |
| M5 | 01b | "2,65" at the lower M1.4 | "2,65", meaning unclear | "the 22,65 from hole 1" | "22,65" along the 1-10 line (`b_2265`) | the code and mine: the figure sits on the 1-10 chain line, and the coordinates give 22.65 |
| M6 | 01b | "7 r" at 26 | an arc mark "7 r" | (ignored) | "7°" (`b_e23`), unattached | open: the glyph after 7 is small; nothing at 26 is r 7 or tilted 7°. Unattached either way |
| M7 | 01b | dashed arc at 51 | "4,7 r, spot face for the screw's head" | "4ʳ", the pocket's end about 51 | "4 r" or "4,7", the pocket's hidden edge | the code and mine: the arc is dashed (far face) and joins the dashed line from 23's tongue; a spot face for 51's head would be on the outer face, drawn solid |
| M8 | 01b | dashed circle round 10 | "about 19 mm, a recess or clearance (not stated)" | J-K's recess Ø 22 × 0.7 | J-K's recess Ø 22 | the code and mine: J-K draws "22∅" across it |
| M9 | 01b | "10,0" in 23 | "the diameter again (inferred)" | (23 Ø 10) | 23-26 centre distance | mine: the coordinates give 10.00 and 03b writes the same figure on the same line outside 23 (the transcription says so for 03b). 23 is Ø 10 all the same (5 r) |
| M10 | 01b | P-Q lip | "0,5 +0,03" | 0.5 | "0,5 +0,05" | open: the scan's superscript allows both |
| M11 | 02 | revision a date | 2.11.46 (likely) | 2.11.46 | 8.11.46 | open: the first digit is a looped 2 or 8 (`s02_tb`) |
| M12 | 02 | holes on the assembly | not mentioned | not mentioned | 26, 51, 52, 53 and the pocket not drawn; erased lines visible at 26, 52, 53 (`s02_lr`) | mine: an omission in both (see F10) |
| M13 | 03a | gepr. date | 29.4.41 | — | 24.4.41 | open (`t03_tb`) |
| M14 | 03a | hand-setting "9,5" | the rectangle's width 9,5 | the window 6.5 (square on the dial face) | "9,5" or "0,5", a location from the rim, unattached; the width is 03b's "6,5" | the code and mine: 03b dimensions the width "6,5" between the long sides |
| M15 | 03a | C-D figures | "step 2", "1,68 and 0,2?" | bore Ø 2, 1.68 from the dial face | bore Ø 2, centre 1.68 from a face (corrected, above) | the code and mine: the "2" spans the circle between tangent extension lines (`a3_cdz`) |
| M16 | 03a | row 39 tolerance | "+0,1" or "+0,012", unsure | +0.012 | "+0,1" struck, "+0,012" written after | mine and the code: the stroke crosses "+0,1" only (`t03_39k`) |
| M17 | 03a | row 30 struck? | "possibly struck" | (kept) | a short dash after "30" only | open: unlike 14-18, the stroke doesn't cross the number |
| M18 | 03b | 38 | "a large round recess" | "the opening for the intermediate wheel" | a through opening | mine and the code: 32-2 draws the intermediate bridge (on the dial face) solid across it, seen through the plate |
| M19 | 07 | "1,6" | the dial hole Ø 1,6 (likely) | the radial hole at 12 (sure) | the radial hole at 12 o'clock | mine and the code: the 1.6's lines run radially across the wall at 12, the dial hole is a circle on the 6° line, Ø 1.1 in the section |
| M20 | 07 | 96 tolerance | "−0,3?" faint | −0.3 | erased, not legible | open |
| M21 | 07 | "45°" | the chamfer outside | a 45° cone inside, from the lip Ø 83 to Ø 93 | the chamfer at the top outside | open: the inner slope is drawn plainly; the "45°" arrow is far left. The code's reading fits the section's lines better: possibly my misread |
| M22 | 11 | body diameter | "8,1" (alt. "8,14") | 8.1 −0.2, drawn 8.0 | "8,14" (alt. "8,1") | open: the glyph after "8,1" is cramped; the code's 8.0 sits inside both readings' limits (7.94-8.14 or 7.9-8.1) |
| M23 | 11 | 19.6 tolerance | ±0,01 (or ±0,02) | ±0.01, sure | ±0,04 or ±0,01 (`pf_196`) | open: the last digit is a 1 with a flag or a 4 |
| M24 | 11 | "1,1 −0,2" | the countersink's depth or the top step | the lead-in's length | the lead-in's length | the code and mine: its lower extension line is the taper's junction, not the countersink's bottom |
| M25 | 32-2 | the rim's notch at 6 o'clock | not recorded | the ring's pin across the joint | the same | the code and mine; an omission in the transcription |
| M26 | 32-2 | the 6.8 pin | "lower pin" | (the change wheel's stud) | at 19 (S 6.3), shown in A-B though off its line | mine; the transcription doesn't place it |

### Agreements, per sheet

- 01a: 30 of 31 table rows agree cell for cell (row 13's kalibr. open, M3); the title block but the revision text (M2); the notes; J-K's 22∅ and 45°.
- 01b: the 42.5 cut and its note; the A-B, C-D and G-H sections (their holes, Ø 2.5 × 1.6 and Ø 6 H7 × 1.8, the plate 3.35); the tongue 2.5 wide and "50°"; P-Q's 5.2 H7 and 3.5 +0.05 M1.2; 51, 52 M2, 53 1.5 H7; the three M1.4 on r 5.2 at 120°; 23's 5 r; 18,12, 12,63, 11,85, 23,0: 14 items.
- 02: the title block but the date (M11); every named part and leader (05 08 01-1 to -5, WN-34, WN-300, WN-301); the stepped A-B; the bush standing out of the outer face: 6 items.
- 03a: 28 of 29 table rows (row 39's tolerance resolved, M16); the bracket and strikes on 14-18; the notes and struck thickness; E-F's 8.6 × 0.3; C-D's 14∅ and 12 +0.2: 33 items.
- 03b: 1-2 and 1-35's 23,0; 18,12; 12,63; 22,65; 10,0; 11,85 (twice, after my correction); 23 Ø 7; the M1.2 pairs at 26 and 30 at 3.5 +0.05; 37°, 6,5, 6,5, 8,3 −0,1; A-B; G-H's 5.2 and 4.59 H7; the 24.5 note: 18 items.
- 07: every figure but those in M19-M21 (105.95, 104 +0.1, 93 +1.3, 83, 85 H9, 89, 2.8, 1.1, 0.7, 7, 3, 4.7, 10.7, 6°, 20°, 50.5, 120°, M2.6, 1), both "gebohrt" notes, the revision: 22 items.
- 11: 4.5 f7, 4.3 −0.2, 6°, 90°, 2.8 −0.1, 25.3 −0.2, M2.6, both notes, the material: 10 items.
- 32-2: the title block; 05 08 02-2 with its note, 12.3; WN-302 0.1 +0.02; 6.8; WN-52; C-D at 30: 7 items.

### Against the code, beyond the misreads

- **Pillar plate 30's seat (05 08 02-1 G-H, 05 08 02 C-D) is on the wrong face in the code's drawn versions.** The code: "Ø 5.2 H7 from the inner face to 0.5 above the dial face". The plan looks at the inner face (its pillar seats and A-B's "oben" counterbores are drawn solid), and draws 30's Ø 5.2 dashed, and 32-2 draws its two screws dashed, so the 5.2 seat and the setting's screws are on the dial face; 32-2's C-D shows the screws' heads over the setting on the same face as the seat's mouth. The code's own fit of the plan's circles (solid 4.78, dashed 5.35) is the same as mine. Likely (F9). The photographed version (Wempe 3955, a plain hole) is not affected.
- **05 08 01 (revision a, 1946) erases 26, 51, 52, 53**; the code's every drawn version keeps 51, 52 (and 53 where drawn), the N-O pocket and the tongue as 05 09 01 (1943) draws them (F10).
- **05 08 01's tongue on 23 is curved (a)**; the code's tongue is straight, fitted to 05 09 01 and Wempe 3955's plate (F11).
- **The top plate's 26**: the code (Ø 5.2 from the inner face to 0.5 under the outer, 4.59 through) agrees with P-Q; the plan's two solid circles disagree with both (F13, a drafting slip, possible).
- **The pocket's second edge**: the code traced two dashed edges converging 4-5°; I could follow only the south edge and the arc round 51, the north edge being under section C-D's drawing on my crops (F18).
- **The pillar**: the code notes 19.6 + 2 × 2.8 = 25.2 against 25.3 and draws the spigots 2.75 (the middle of 2.8 −0.1); agrees with F15.
- **The movement ring**: the code's reading (seat Ø 85 H9 × 3 +0.1 on the lip Ø 83; the dial's recess Ø 104 +0.1 × 0.7 in the flange's face; the flange 4.7; the band Ø 96 −0.3; 7 −0.1 from the recess's floor to the seat's; three M2.6 on Ø 89 at 20° from 12 on the sheet, which it reads as drawn from the dial side; the dial pin Ø 1.1 at 6°, r 50.5; the radial pin hole Ø 1.6 at 12, 2.8 under the flange's top; the plate's pin Ø 1 at 6 o'clock across the joint) attaches the figures I left unattached and agrees with every one I attached. The dial's three M1 screws at r 50.5 are not on the ring's sheet (the code says so: estimated).
- **Pillar plate 10** is reamed 2.70 ±0.009 in the table and drawn 2.82 in the code (opened to the fusee arbor's pivot; the code says so and keeps it in README Unresolved). A known deviation, not a misread.

### Slots, notches, grooves and pockets (the extra check)

| feature | where described | the views | verdict |
|---|---|---|---|
| the top plate's barrel cut, Ø 42.5 about 45, leaving a crescent with sharp horns | 01b note, transcription, code | 01b plan (solid, through the rim), 02 plan (horns rounded, scaled r ≈ 1), the coloured section | supported; horn tips differ by version (the code keeps both, the owner's choice) |
| the tongue on 23, 2.5 wide | 01b, transcription, code | 01b straight at "50°"; 02 curved "(a)"; no section | supported; its shape on 02 not modelled (F11) |
| the pocket N-O, inner face, 1.35 −0.05, from 23 to 51 with r 4 about 51 | 01b (N-O), code (the transcription misreads it, M4) | N-O section; dashed in plan (one edge and the arc visible to me); not on 02 | supported on 05 09 01; erased with 51-53 on 05 08 01 (F10) |
| J-K's recess Ø 22 × 0.7 round 10, inner face, 45° wall | 01a/01b, transcription (as a step), code | J-K section; dashed circle in plan; 02's A-B shows the bush's flange in it | supported; 0.7 as the depth likely (F17) |
| the pillar seats Ø 8.6 × 0.3, inner faces | 01a L-M, 03a E-F, code | dashed on the top plate's plan, solid on the pillar plate's | supported |
| the counterbores Ø 2.5 × 1.6 (A-B, C-D) and Ø 6 H7 × 1.8 (G-H) | 01b, 03b, code | sections; plan line styles agree for each hole | supported |
| the escape settings' seats (26 top, 30 pillar) Ø 5.2 H7 with a 0.5 lip | 01b P-Q, 03b G-H, code | sections; plan line styles agree for 30, not for the top plate's 26 | supported; 30's face reversed in the code (F9) |
| the pillar plate's opening Ø 24.5 about 38 with 35's Ø 6 as a lobe | 03b note, transcription ("recess", M18), code | plan; 32-2 shows the bridge through it | supported, through |
| the hand-setting window (6.5 × 12 +0.2, Ø 14 cutter's end arcs) and its bore Ø 2 to the rim, 1.68 from a face | 03a C-D, 03b, 32-2 E-F, transcription (width misread, M14), code | plan rectangle and dashed bore; two sections | supported; a "nur wenn eingebaut" option |
| the pillar plate's rim notch at 6 o'clock (half of the ring's Ø 1 pin hole) | 32-2 only, code | 32-2 plan; the ring's "wird bei Montage der Unterplatte gebohrt" | supported (on the assembly only, as an assembly-drilled hole should be) |
| the pillar's relief grooves at each shoulder | 11, code (estimated r 3.25 × 0.35) | the section, both ends ("wie oben") | drawn, not dimensioned |
| the ring's steps (seat, lip, recess, flange) | 07, code | the section | supported; several figures unattached on my reading |
| the rim notch and the ring's groove for the hand-setting shaft (Wempe 3955 only) | code (photographs) | on no sheet | photograph only; outside this check |
| the lower endstone's seat Ø 4.6 × 0.25 at the pillar plate's 26 | code (photograph) | on no sheet | photograph only |

## Drawn holes

Every hole the sheets draw, with what goes in it (from the sheets' names; "pilot" where the table's ream is opened to a section's seat).

Top plate (05 09 01; 05 08 01 where noted):

| hole | size | what goes in it |
|---|---|---|
| 1 | 4.59 +0.012 | bush WN-301 (the centre wheel's upper pivot) |
| 3, 12, 40 | 3.50 +0.012 | Hilfslöcher (auxiliary; nothing named) |
| 4 | drill 0.9 | the counter-click's (maintaining detent's) upper pivot |
| 5 | M1.7 | the counter-click's wire spring's screw |
| 6, 9, 50 | 1.6025, opened Ø 2.5 × 1.6 from the inner face | the upper balance cock's steady pins |
| 7 | 1.6 +0.009 | the stop pin 05 08 01-5, standing out of the inner face |
| 8 | M2.6 | the upper balance cock's screw |
| 10 | 8.0 +0.015, recess Ø 22 × 0.7 on the inner face | the fusee bush 05 08 01-2 |
| 3 round 10 | M1.4 on r 5.2 ±0.05, 120° apart | WN-34, the fusee bush's flange screws |
| 11, 39, 49 | 4.5 +0.012, seat Ø 8.6 × 0.3 in the inner face | the pillars' spigots; screws WN-57 into the pillars |
| 13 | drill 1.8 (ream not legible) | the detent block's screw ("Gangfederkl. Schr.") |
| 22, 37 | 1.6025, opened Ø 2.5 × 1.6 from the outer face | the lower balance cock's steady pins |
| 23 | Ø 10 with the tongue 2.5 | the balance staff's passage (no bearing) |
| 26 | pilot 2.5 +0.009; seat Ø 5.2 H7 from the inner face, lip 4.59 H7 (rev. a) 0.5 | the escape wheel's upper jewel setting |
| P, Q at 26 | M1.2 at 3.5 +0.05 on the O-W line | the setting's screws (erased on 05 08 01) |
| 35, 38 | 4.59 +0.012 | bushes WN-300 (the seconds and intermediate wheels' upper pivots) |
| 36 | 2.8 clear, Ø 6 H7 × 1.8 from the outer face | the lower balance cock's screw, its head sunk |
| 41, 47 | 1.6025, opened from the inner face | the barrel bridge's steady pins |
| 42, 48 | M2.6 | the barrel bridge's screws |
| 45 | punch 4.4 only (in the cut) | the centre of the 42.5 cut |
| 51, 52 | M2 | the balance-holding work's tongs screw and bell-crank screw (not on 05 08 01) |
| 53 | 1.5 H7 | the holding work's coil spring's pin (not on 05 08 01) |

Pillar plate (05 08 02-1; 05 08 02):

| hole | size | what goes in it |
|---|---|---|
| 1 | 4.59 +0.012 | bush WN-302, 0.1 +0.02 below the inner face |
| 2 | 3.50 +0.012 | bush 05 08 02-2 (pressed from the inner face) with the up-and-down stud, 12.3 out of the dial face |
| 3, 12, 40 | 3.50 +0.012 | Hilfslöcher |
| 4 | drill 0.9 | the counter-click's lower pivot |
| 10 | 2.70 ±0.009 | the fusee arbor's lower pivot (the code opens it to 2.82) |
| 11, 39, 49 | 4.50 +0.012, seat Ø 8.6 × 0.3 in the inner face | the pillars' spigots; screws (WN-56) from the dial side |
| 14, 15 | drill 1.45 (ream not given) | the hand-setting cock's steady pins (option, struck) |
| 16, 17 | drill 2.8 | the hand-setting cock's screws (option, struck) |
| 18 | 3.50 +0.012 | the hand-setting pinion (option, struck; drawn with a ring on 32-2) |
| 19 | 3.50 +0.012 | the change wheel's (Wechselrad) stud, 6.8 out of the dial face |
| 23 | punched 4.4, drawn Ø 7 | the passage for the balance staff's lower end (its jewel is in the lower cock under the top plate) |
| 26 | 2.50 ±0.009 | the escape wheel's lower pivot (jewel) |
| 2 at 26 | M1.2 at 3.5 +0.05 on the 37° line | the lower endstone's cap screws |
| 28, 43 | M2.6 | the intermediate bridge's screws (43: WN-52) |
| 29, 44 | 1.6025, opened Ø 2.5 × 1.6 from the inner face | the intermediate bridge's steady pins |
| 30 | pilot 2.50 ±0.009; seat Ø 5.2 H7 from the dial face, lip 4.59 H7 0.5 | the lever escape wheel's setting (Ankerrad), fitted on 32-2 |
| G, H at 30 | M1.2 at 3.5 +0.05 on the O-W line | the setting's screws, from the dial face |
| 35 | punched 6.0, joined to 38's opening | the seconds arbor's passage (its jewel setting in the intermediate bridge, 32-2 A-B) |
| 38 | punched 4.4, inside the Ø 24.5 opening | the intermediate wheel's room |
| 45 | 2.90 ±0.009 | the barrel arbor's lower pivot |
| 56, 57 | M1.7 ("nur bei Bedarf") | contact screws (option) |
| the hand-setting bore | Ø 2, 1.68 from a face, window to rim | the hand-setting shaft (option) |
| the rim notch at 6 o'clock | half of Ø 1 | the ring's pin |

Pillar (05 08 00-1): M2.6 through, tapped from both ends, 90° countersinks: the pillar screws.

Movement ring (05 08 00-3): 3 × M2.6 on Ø 89 at 120° (the plate's clamp screws, heads over the plate's rim); radial Ø 1.6 at 12 o'clock, 2.8 under the top face (Stellstift 3, WN-202, to the case); axial Ø 1.1 at 6°, r 50.5, drilled with the dial (the dial's pin; the coloured section's WN-10 is a screw there); Ø 1 at 6 o'clock across the seat's wall, drilled with the pillar plate (a pin, half in each).

## Joints

| piece | into/onto | hole or seat | held by | sheet and view |
|---|---|---|---|---|
| pillar (3), upper spigot | top plate 11, 39, 49 | 4.5 H7 (+0.012) on 4.5 f7, shoulder in the Ø 8.6 × 0.3 seat | screw WN-57 into the pillar's M2.6 | 11; 01a L-M; coloured section |
| pillar (3), lower spigot | pillar plate 11, 39, 49 | 4.50 H7 on 4.5 f7, seat Ø 8.6 × 0.3 | screw WN-56 (label uncertain) into the pillar's M2.6 | 11; 03a E-F; coloured section |
| pillar plate | movement ring | seat Ø 85 H9 on 85 h6, on the lip Ø 83 | three M2.6 screws in the ring, heads over the plate's rim; a pin Ø 1 across the joint at 6 o'clock | 07; 32-2 (notch); coloured section |
| dial 05 02 00-4 | the movement ring's lower face | (the recess Ø 104 × 0.7, by the code's reading) | screw WN-10 / pin in the Ø 1.1 hole at 6°, drilled at assembly | 07; coloured section |
| Stellstift 3, WN-202 | movement ring | radial Ø 1.6 at 12, 2.8 under the top | press (by its kind) | 07; coloured section |
| fusee bush 05 08 01-2 | top plate 10, its flange in the Ø 22 recess | 8.0 +0.015 | three WN-34 (M1.4 on r 5.2) from the inner face | 01b; 02 A-B |
| bush WN-301 | top plate 1 | 4.59 +0.012 | press | 02 |
| bushes WN-300 | top plate 35, 38 | 4.59 +0.012 | press | 02 |
| stop pin 05 08 01-5 | top plate 7 | 1.6 +0.009 | press, standing out of the inner face | 02 |
| upper balance cock | top plate, outer face | pins 6, 9, 50 (1.6025) | screw 8 (M2.6) | 01a table; 01b A-B |
| lower balance cock | top plate, inner face | pins 22, 37 (1.6025, counterbored from outside) | screw 36 from outside, its head in Ø 6 H7 × 1.8 | 01b C-D, G-H; 02 A-B |
| barrel bridge | top plate, outer face (across the cut) | pins 41, 47 | screws 42, 48 (M2.6) | 01a; 01b A-B |
| counter-click | top plate 4 and pillar plate 4 | Ø 0.9 drilled (its pivots) | its arbor between the plates | 01a, 03a |
| the counter-click's wire spring | top plate | 5, M1.7 | screw | 01a |
| detent block | top plate | 13 (drill 1.8) | its screw ("Gangfederkl. Schr.") | 01a |
| the escape wheel's upper setting | top plate 26 | seat Ø 5.2 H7 from the inner face, lip 4.59 | two M1.2 (P, Q) | 01b P-Q (erased on 02) |
| balance-holding work (tongs, bell crank, coil spring) | top plate, inner face, the N-O pocket | 51, 52 M2; 53 1.5 H7 | screws; pin | 01a, 01b N-O (not on 02) |
| bush 05 08 02-2 | pillar plate 2 | 3.50 +0.012 | press, from the inner face ("Futter an dieser Seite eindrücken") | 32-2 A-B |
| up-and-down stud | bush 05 08 02-2 | its bore | press (12.3 out of the dial face) | 32-2 A-B |
| change wheel stud | pillar plate 19 | 3.50 +0.012 | press (6.8 out of the dial face) | 32-2 A-B |
| bush WN-302 | pillar plate 1 | 4.59 +0.012 | press, 0.1 +0.02 below the inner face | 32-2 A-B |
| intermediate bridge 05 08 04 | pillar plate, dial face | pins 29, 44 (1.6025, counterbored from the inner face) | screws 28, 43 (M2.6; 43 is WN-52) | 03a; 03b A-B; 32-2 plan |
| the seconds wheel's jewel setting | the intermediate bridge (dial side), over 35 | — | — | 32-2 A-B (standing on the dial face) |
| the escape wheel's lower endstone cap | pillar plate 26, dial face | — | two M1.2 on the 37° line | 03b |
| the lever escape setting (Ankerrad) | pillar plate 30, dial face | seat Ø 5.2 H7, lip 4.59 H7 | two M1.2 (G, H) | 03b G-H; 32-2 C-D |
| the hand-setting cock and pinion | pillar plate 14-18 and the window | 1.45 pins, 2.8 screws, 3.50 | screws (option) | 03a, 03b, 32-2 |
| contact screws | pillar plate 56, 57 | M1.7 | thread (option) | 03a, 32-2 |

## Findings so far

| # | kind | sheet | finding | how sure |
|---|---|---|---|---|
| F1 | misread (transcription) | 01b | N-O is the balance-holding work's pocket from 23 to 51 in the inner face, 1.35 −0.05 deep, not a lip at the barrel cut's edge (M4). The code is right | sure |
| F2 | misread (transcription) | 01b | "2,65" is 22,65, the 1-10 distance (M5). The code is right | sure |
| F3 | misread (transcription) | 01a | revision a is "∅ 4,5 in 4,59" (P-Q's lip), not "6,15 in 4,59" (M2). The code is right | likely |
| F4 | misread (transcription) | 01a | L-M's seat is on the inner face, dashed in plan (M1). The code is right | sure |
| F5 | misread (transcription) | 03b | 38's Ø 24.5 is a through opening, not a recess (M18). The code is right | likely |
| F6 | misread (transcription) | 03a | the hand-setting window is 6.5 wide (03b), not 9.5; "9,5"/"0,5" is an unattached location figure; C-D's "2" is the bore's Ø 2 (M14, M15). The code is right | likely |
| F7 | misread (transcription) | 07 | the ring's "1,6" is the radial pin hole at 12; the dial hole is Ø 1.1 at 6° (M19). The code is right | likely |
| F8 | omission (transcription) | 32-2, 02 | the pillar plate's rim notch at 6 o'clock (M25) and the erased 26, 51-53 on 02 (M12) are not recorded | sure |
| F9 | model against sheet | 03b, 32-2 | pillar plate 30's seat Ø 5.2 and its screws are on the dial face (plan dashed, 32-2 C-D); the code's drawn versions open the 5.2 from the inner face | likely |
| F10 | version | 02 against 01 | 05 08 01's revision a (1946, "zeichnerisch geändert") erases 26, 51, 52, 53 and draws no N-O pocket; the code's drawn versions all keep 51-53, the pocket and 26. Reading: the holding work was dropped in 1946; keep 26, whose erasure is likely a slip (the escape wheel needs it). For the owner | likely |
| F11 | version | 02 | 05 08 01 (1946) draws 23's tongue curved, marked (a); the code's is straight, from 05 09 01 and Wempe 3955 | possible |
| F12 | inconsistent (sheet) | 01a/01b, 03a/03b | the tables ream 26 (top) 2.5 +0.009 and 30 (pillar) 2.50 ±0.009, the sections draw a Ø 5.2/4.59 H7 seat there. Reading: the table's figure is the jig-bored pilot. The code follows the sections (and Wempe 3955's plain 30 for that version) | likely |
| F13 | inconsistent (sheet) | 01b | top plate 26: P-Q has the 5.2 on the inner face, the plan draws both circles solid. A drafting slip; the code follows P-Q | possible |
| F14 | ambiguity | 11 | 19.6 ±0.01 or ±0.04 (the last digit); the code takes ±0.01 as sure | possible |
| F15 | inconsistent (sheet) | 11 | 19.6 + 2 × 2.8 = 25.2 against the overall 25.3 −0.2; the code notes it and draws the spigots 2.75 | sure (the figures); no action |
| F16 | unattached | 01b, 03a, 07 | "7°/7 r" at the top plate's 26; the "50°" datum at the tongue; 03a's "9,3 −0,1" and "9,5/0,5"; C-D's small "1,2"; the ring's left "20°" | sure (unattached) |
| F17 | ambiguity | 01a J-K | "0,7" as the recess's depth (the code, likely) or as a 0.7 × 45° chamfer | possible |
| F18 | to refute | 01b | the pocket's north dashed edge: I could not follow it past section C-D's drawing; the code traced both edges | possible |
| F19 | ambiguity | 07 | "45°": the code's inner cone (lip Ø 83 to Ø 93) against my outside chamfer; the section's lines favour the code (M21) | possible |
| F20 | ambiguity | 11 | the body Ø "8,14" or "8,1" −0.2; the code's 8.0 lies inside both | possible |
| F21 | ambiguity | coloured section | whether WN-56 names the pillar's lower screw or the ring's clamp screw (its leader ends between them) | possible |
| F22 | open | 01a | row 13's kalibr. cell not legible; the code drills 1.8 through for the detent block's screw | possible |
| F23 | ambiguity | 02, 03a | dates: 02's revision 2.11.46 or 8.11.46; 03a gepr. 24.4.41 or 29.4.41 (no effect on the model) | possible |
