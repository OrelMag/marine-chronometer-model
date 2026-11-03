# Batch 13: motion work and up-and-down work, hands, dial (reader)

Read blind on 3 November 2026. Frame: the measured parts' plan seen from +Z is the dial face seen from the front (x -> movement x, y -> -z, Z -> +y). Built values quote the measure files (`TOOLS/r_wpa/measure/KEY.json`) and `page/placements.json`. Scale-read figures on the assembly are good to about 0.1 mm (12.2 px/mm on the scan). The dial's printed numerals and tracks are outside this audit; the rings' centres are the UD and seconds holes.


## 05 02_1: Zeigerwerk, Auf u. Ab. gesamt (Zeichnung So 127 556 04 0402, 28.3.41)

**Title block.** Werkstoff blank; Massstab 5:1; Arbeitspause 10; gez. 28.3.41; Benennung "Zeigerwerk, Auf u. Ab. gesamt"; Laufstellen: Enger Laufsitz; no general tolerance legible. Captions along the bottom give centre distances: Zeigerstelltrieb 12,96 Wechselrad 12,6 Minuten 23 Auf u.Ab 18,4 Federhaus.

**Views.** One section at 5:1 (about 12.2 px/mm on the scan, so a figure scaled off it is good to about 0.1 mm) through the centre arbor (pipes and hands), the change wheel, the Zeigerstell stud at far left, the up-and-down arbor and a dial post ("Festsitz") with the dial and glass above. Hand-written notes mark the hands. Most heights are not dimensioned; labelled: 3, 0,2 Luft, 2,5, 0,6, 2, 1,8, 1,2, 3,5, 2,3, 2,4, 0,1 Luft, 0,3, 1,0, 12,7, 6,2, 7, 3,9, 28, 16, 1,3, 15,8/17,0 (partly illegible). Dial: Loch 6,0 (centre) and Loch 3,2 (up-and-down).

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-1-1 | UD axis from centre arbor: caption "23" (Minuten ... Auf u.Ab) | 23; likely | placements udHub 050204-2 origin (0,0,-23): 23.000 | 0 | match |
| 13-1-2 | Change wheel axis from centre arbor: caption 12,6 (Wechselrad ... Minuten) | 12.6; likely | placements changeWheel 050202-1 origin (-10.912, 6.3): hypot: 12.598 | -0.002 | match |
| 13-1-3 | UD axis to up-and-down pinion axis: caption 18,4 | 18.4; unsure (the caption sits between Auf u.Ab and Federhaus; the pair is not marked) | placements udPinion 050200-5 (-16.708,-15.292) to udHub (0,-23): hypot: 18.40 | 0 | match |
| 13-1-4 | Zeigerstelltrieb to Wechselrad: caption 12,96 | 12.96; likely | the hand-setting pinion is not a batch 13 part: - | - | can't tell |
| 13-1-5 | Dial underside above pillar-plate top: dimension 7 | 7; likely (scaled 6.6-7.0) | dial box y 10.35 minus plate top y 3.35 (the plate top taken from udHub / changePipe lowest y 3.35: inferred): 7.00 | 0 | match |
| 13-1-6 | Dial thickness (assembly 1,3; sheet 12 has 1,2 written over 1,3) | 1.3 / 1.2; likely | dial size[2]: 1.2 | -0.1 vs 1.3 | match |
| 13-1-7 | Dial centre hole "Loch 6,0" | 6.0; sure | dial cylinders[0].d 6.0 inside at (0,0): 6.0 | 0 | match |
| 13-1-8 | Dial up-and-down hole "Loch 3,2" | 3.2; sure | dial cylinders[1].d 3.2 at (0,23): 3.2 | 0 | match |
| 13-1-9 | Hour hand bore on the hour pipe (hand sits on the pipe) | pipe about 4.4; unsure | hourPipe section_y0 r 2.2425->2.2095 (OD 4.485->4.419); hourHand bore 4.4155->4.4598: fits | - | match |
| 13-1-10 | Gap dial top to hour-hand blade underside: dimension "2" (scaled 1.6) | 2 (scaled 1.64); unsure (the arrows sit between the dial top and the hour-hand blade underside) | dial ymax 11.57; hourHand box y0 11.05, blade underside at local z 2.3 -> y 13.35: 1.78 | -0.22 vs 2; +0.14 vs scaled | mismatch |
| 13-1-11 | Minute-hand boss bottom to hour-hand flange top (label "0,2" near the hands) | 0.2?; unsure (label may belong to another step) | minuteHand box y0 14.87, hourHand box ymax 14.15: 0.72 | +0.5 | can't tell |
| 13-1-12 | UD arbor stud: label 12,7 along the stud (length or a diameter?) | 12.7; unsure | studLong 050200-6 size[2] 12.3 (cylinders[0].d 1.5, z 0.3-12.0): 12.3 | -0.4 if a length | can't tell |
| 13-1-13 | Stud diameter at the UD arbor (scaled about 1.5) | 1.5 (scaled); unsure | studLong cylinders[0].d 1.5: 1.5 | 0 | match |
| 13-1-14 | Seconds axis 23 from the centre (assembly plan not shown; sheet 12 gives 23) | 23; likely | placements secondsHand 050201-1 and collet origin (0,0,23): 23.000 | 0 | match |
| 13-1-15 | Dial post screw "16" in the block | 1.6; unsure | dialScrew WN-10.d head 1.7, shank 0.982; dialPin 1.11/0.98: 1.7 / 0.98 | +0.1 | can't tell |


## 05 02_2: Minutenzeiger 05 02 00-1 (gez. 18.9.42, gepr. 18.9.42, 27.4.43)

**Title block.** Werkstoff Goldin; Massstab 2:1 (1:1); Oberflaeche poliert; "nicht eingetragene Toleranz +-0,1" (general tolerance); Zeichnung Nr 05 02 00-1.

**Views.** Plan (2:1) with stations 13, 25, 36, 46 from the centre; side section A-B above with Kegel 1:70 on the square bore; a 1:1 outline at lower left. Views agree.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-2-1 | Length centre to tip (46) | 46; sure | box ymax 46.0: 46.0 | 0 | match |
| 13-2-2 | Tail behind the centre: none drawn (boss only) | none; sure | box ymin -3.0 (boss radius): -3.0 | 0 | match |
| 13-2-3 | Boss outer Ø6 | 6; sure | cylinders[0].d 6.0 outside z 0.8-1.6: 6.0 | 0 | match |
| 13-2-4 | Collar Ø4,2 below the flange | 4.2; sure | cylinders[1].d 4.2 z 0-0.8: 4.2 | 0 | match |
| 13-2-5 | Square bore 2,6 H7 +0,009 | 2.6 (+0.009); likely | section_y0 flats x 1.3165 at z0 -> 2.633; 1.3022 at z2 -> 2.604: 2.604 narrow end | +0.004 | match |
| 13-2-6 | Taper Kegel 1:70 on the bore | 1:70; likely | flat change 0.0286 over z 2.0: 1:70 | 0 | match |
| 13-2-7 | Overall height 2; flange 1,2 | 2 ; 1.2; likely | box z 2.0; flange z 0.8-2.0 (section_y0): 2.0 ; 1.2 | 0 | match |
| 13-2-8 | Blade width at the boss 1,2 | 1.2; likely | outlines_by_level[0.8] line x +-0.6 at y=3: 1.2 | 0 | match |
| 13-2-9 | Blade width at 13 | 2; sure | x +-1.0 at y=13: 2.0 | 0 | match |
| 13-2-10 | Blade width at 25 | 0.7; sure | x +-0.35 at y=25: 0.7 | 0 | match |
| 13-2-11 | Blade width at 36 | 1.7; sure | x +-0.85 at y=36: 1.7 | 0 | match |
| 13-2-12 | Blade width at 46 (tip) | 0.4; sure | x +-0.2 at y=46: 0.4 | 0 | match |
| 13-2-13 | Blade thickness 0,7 / 0,6 / 0,4 at 25 / 36 / 46 | 0.7 / 0.6 / 0.4; likely | underside z 0.8; top cones d42-74 z1.5->1.4, d74-92 z1.4->1.2: about 0.68 / 0.6 / 0.4: 0.68 / 0.6 / 0.4 | <=0.02 | match |


## 05 02_3: Stundenzeiger 05 02 00-2 (gez. 14.6.40, gepr. 19.12.40, 3.4.43)

**Title block.** Werkstoff Goldin; Massstab 2:1; Oberflaeche hochglanz poliert; nicht eingetr. Toleranz +-0,1; Zeichnung Nr 05 02 00-2.

**Views.** Plan with stations 9, 19,5, 22,5, 30, 35; section A-B above with Kegel 1:70, bore 4,4 H7 +0,012, tube 5 -0,2. Views agree.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-3-1 | Length centre to tip (35) | 35; sure | box ymax 35.0: 35.0 | 0 | match |
| 13-3-2 | Boss outer Ø8,2 (plan) | 8.2; sure | box x +-4.1; cones d 6.8, 7.325, 8.2 z 2.3-3.1: 8.2 | 0 | match |
| 13-3-3 | Inner ring Ø6,8 (plan) | 6.8; likely | cones[0].d 6.8: 6.8 | 0 | match |
| 13-3-4 | Tube outer Ø5 -0,2 below the flange | 5 -0.2 (4.8-5.0); likely | cylinders[1].d 4.8 outside z 0-2.3: 4.8 | 0 (at the lower limit) | match |
| 13-3-5 | Bore Ø4,4 H7 +0,012 | 4.4 (+0.012); likely (the plane on the taper where the Ø is taken is not marked) | cones[6].d 4.4155 -> 4.4598 over z 3.1: 4.4155 narrow end | +0.0035 over the limit; mean 4.4377 | match |
| 13-3-6 | Taper Kegel 1:70 | 1:70; likely | (4.4598-4.4155)/3.1 = 0.0143: 1:70 | 0 | match |
| 13-3-7 | Overall height 3,1 | 3.1; sure | box z 3.1: 3.1 | 0 | match |
| 13-3-8 | Flange thickness 0,8 | 0.8; likely | section_y0 flange z 2.3-3.1: 0.8 | 0 | match |
| 13-3-9 | Blade width 1,7 at the root | 1.7; unsure (where the dimension sits at the boss edge) | outline x +-0.87 at y 4.0 to +-0.92 at y 5.0: 1.74-1.84 | +0.04 to +0.14 | match |
| 13-3-10 | Blade width 2,4 at 9 | 2.4; sure | x +-1.2 at y 9.0: 2.4 | 0 | match |
| 13-3-11 | Blade width 0,8 at 19,5 | 0.8; sure | x +-0.4 at y 19.5: 0.8 | 0 | match |
| 13-3-12 | Drop Ø5,2 at 22,5 | 5.2; sure | x +-2.6 at y 22.5: 5.2 | 0 | match |
| 13-3-13 | Blade width 0,6 at 30 | 0.6; sure | x +-0.3 at y 30: 0.6 | 0 | match |
| 13-3-14 | Tip width 0,5 at 35 | 0.5; sure | x +-0.25 at y 35: 0.5 | 0 | match |
| 13-3-15 | Blade thickness (labels 0,5 root, 0,6 / 0,7 mid, 0,6, 0,3 tip) | 0.5 ... 0.3; unsure (stations of the labels not marked) | top faces z 2.8 (root), 2.9-3.0 (mid), sloping to 2.6 at the tip over underside 2.3: 0.5 / 0.6-0.7 / 0.3 | <=0.05 | match |


## 05 02_4: Auf- u. Abzeiger 05 02 00-3 (gez. 16.1.41, gepr. 17.1.41, 30.4.43)

**Title block.** Werkstoff Bandstahl 0,6 x 15; Massstab 2:1; haerten, Oberflaeche polieren, blau anlassen; nicht eingetr. Toleranz +-0,1; Zeichnung Nr 05 02 00-3.

**Views.** Plan with the boss Ø4,4 and a thin blade, dimensions 9,5 and 11,7, widths 0,9 and 0,25; the blade is dark to the 9,5 station and a lighter thin line beyond it (the scan runs it on to a break); section above with 1,4, 0,5, 0,3 and 2,2 H7 +0,009. Finding: the plan is not to one scale along its length (the boss reads about 10 px/mm, the 9,5 about 13.6 px/mm), so no length beyond the dimensions can be scaled.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-4-1 | Boss Ø4,4 (plan) | 4.4; sure | cylinders[2].d 4.4 outside z 0.9-1.4: 4.4 | 0 | match |
| 13-4-2 | Bore Ø2,2 H7 +0,009 | 2.2 (+0.009); likely | cylinders[0].d 2.204 inside: 2.204 | +0.004 | match |
| 13-4-3 | Inner ring of the boss (about Ø3.2 scaled) | 3.2 (scaled, +-0.2); unsure | cylinders[1].d 3.0 outside z 0-0.9: 3.0 | -0.2 | match |
| 13-4-4 | Total height 1,4; boss 0,5 | 1.4 ; 0.5; likely | box z 1.4; ring z 0.9-1.4: 1.4 ; 0.5 | 0 | match |
| 13-4-5 | Blade width 0,9 at the boss | 0.9; sure | x +-0.448 at r 2.2: 0.9 | 0 | match |
| 13-4-6 | Blade length 9,5 from the centre (11,7 = 9,5 + 2,2 from the boss edge) | 9.5; likely | outline vertex at y=9.5 (x +-0.17), taper ends there: 9.5 | 0 | match |
| 13-4-7 | Overall length to the tip | not dimensioned (thin part runs on); unsure | box ymax 10.2 (tip x +-0.125 at 10.2): 10.2 | - | can't tell |
| 13-4-8 | Tip width 0,25 | 0.25; likely | x +-0.125 at y 9.6-10.2: 0.25 | 0 | match |
| 13-4-9 | Blade thickness 0,3 | 0.3; likely | blade z 0.9-1.2: 0.3 | 0 | match |


## 05 02_5: Sekundenzeiger 05 02 01-1 (gez. 14.6.40, gepr. 19.12.40, 27.4.43)

**Title block.** Werkstoff Bandstahl 30 x 0,6 DIN 1016; Massstab 2:1 (1:1, 10:1 for the section); gehaertet, laeppen, blau anlassen; nicht eingetr. Toleranz +-0,1; Zeichnung Nr 05 02 01-1.

**Views.** Plan with the tail (teardrop to the left), boss Ø3,2, dimensions 6,5, 10, 29,5, 1,2 +0,05; section above (2,5, 0,5, 0,3, 0,4, 0,1, 0,3) and Schnitt A-B at 10:1. No collet is drawn on this sheet.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-5-1 | Overall length 29,5 | 29.5; sure | size[1] 29.5; box y -10..19.5: 29.5 | 0 | match |
| 13-5-2 | Tail 10 (tip to centre) | 10; sure | box ymin -10.0: 10.0 | 0 | match |
| 13-5-3 | Teardrop end at 6,5 | 6.5; likely | outline line from (0.15,-6.5): 6.5 | 0 | match |
| 13-5-4 | Teardrop width 1,7 | 1.7; likely | x +-0.85 at y -7.35: 1.7 | 0 | match |
| 13-5-5 | Neck width 0,3 | 0.3; likely | x +-0.15 at y -6.5: 0.3 | 0 | match |
| 13-5-6 | Boss Ø3,2 | 3.2; sure | cylinders[1].d 3.2 outside z 0-0.4: 3.2 | 0 | match |
| 13-5-7 | Raised boss Ø2,5 | 2.5; sure | cylinders[2].d 2.5 z 0.4-0.6: 2.5 | 0 | match |
| 13-5-8 | Bore 1,2 +0,05 | 1.2 (+0.05); sure | cylinders[0].d 1.2 inside: 1.2 | 0 (at the lower limit) | match |
| 13-5-9 | Width 0,6 beside the boss | 0.6; likely | x +-0.3 at y 1.57: 0.6 | 0 | match |
| 13-5-10 | Tip width 0,2 | 0.2; sure | x +-0.1 at y 19.5: 0.2 | 0 | match |
| 13-5-11 | Thickness labels 0,5 / 0,3 / 0,4 / 0,1 / 0,3 along the section | 0.3-0.5; unsure (stations not marked) | z levels 0.3, 0.4, 0.5, 0.6; boss 0.4 + raised 0.2: - | - | can't tell |


## 05 02_12: Zifferblatt 05 02 00-4 (127-556 04-162, gez. 2.7.40, gepr. 10.8.40, 5.43)

**Title block.** Werkstoff Messingblech 1,3 (1,2 written above) DIN 1751 Ms 58; Massstab 2:1; Arbeitspause 54; plan gespannt, geaetzt 0,2 tief, schwarz ausgelegt, weiss lackiert; Rohmass 1,3 x 110 x 110; fertig 103,6 -0,1; H7 18 +0,009 (screw holes); Senkung 1,0 tief; Staerke 1,3 (1,2 written over). General tolerance not legible.

**Views.** Face view 2:1 with the printed face, three screw holes on a Ø101 circle, two small pin holes, UD ring at the top and seconds ring at the bottom (23 +-0,03 each way), Ø6 centre circle. Finding: the sheet shows holes at 6 deg left of 12 (countersunk), 6 deg right of 12 (small), 4 and 8 o'clock (countersunk) and 6 deg left of 6 (small); the "1,1" beside the 4 o'clock hole attaches to a line from the circle to the dial edge, so what it dimensions is unclear.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-6-1 | Outside diameter (fertig 103,6 -0,1) | 103.6 -0.1 (103.5-103.6); sure | cylinders[11].d 103.55 outside: 103.55 | -0.05 | match |
| 13-6-2 | Thickness (Staerke 1,3, 1,2 handwritten over it) | 1.3 / 1.2; sure | size[2] 1.2: 1.2 | 0 vs 1.2; -0.1 vs 1.3 | match |
| 13-6-3 | Centre hole Ø6 | 6.0; likely (printed 6 at the centre circle; assembly: Loch 6,0) | cylinders[0].d 6.0 at (0,0): 6.0 | 0 | match |
| 13-6-4 | Up-and-down hole Ø3,2, 23 +-0,03 above the centre | 3.2 ; 23; sure | cylinders[1].d 3.2 at (0,23): 3.2 ; 23.0 | 0 | match |
| 13-6-5 | Seconds hole Ø1,7, 23 +-0,03 below the centre | 1.7 ; 23; likely | cylinders[5].d 1.7 at (0,-23): 1.7 ; 23.0 | 0 | match |
| 13-6-6 | Screw hole Ø1,8 H7 +0,009, Senkung 1,0 deep, 6 deg left of 12 on the Ø101 circle | 1.8 ; 1.0 deep; likely | cylinders d1.8 z0.2-1.2 at (-5.279, 50.223): r 50.50, 6.0 deg: 1.8 ; 1.0 deep | 0 | match |
| 13-6-7 | Screw hole at 4 o'clock (120 deg from 12) | 1.8 H7, Senkung 1.0; likely | d1.8 at (43.734,-25.25): r 50.5, 120.0 deg: 1.8 | 0 | match |
| 13-6-8 | Screw hole at 8 o'clock | 1.8 H7, Senkung 1.0; likely | d1.8 at (-43.734,-25.25): 1.8 | 0 | match |
| 13-6-9 | Through hole inside the countersink (inner ring, "1,1") | 1.1; unsure | cylinders d1.1 z0-0.2 at each screw hole: 1.1 | 0 | match |
| 13-6-10 | Small pin hole 6 deg right of 12 (position) | x +5.3, y 50.2 (scaled +-0.3); likely | cylinders d1.0 at (5.279,50.223): (5.28,50.22) | 0 | match |
| 13-6-11 | Small pin hole 6 deg left of 6 (position) | x -5.3, y -50.2 (scaled +-0.3); likely | cylinders d1.0 at (-5.016,-50.250): (-5.02,-50.25) | 0.27 in x (within scan) | match |
| 13-6-12 | Small pin holes diameter | illegible (1,1 or 1?); unsure | cylinders d1.0: 1.0 | - | can't tell |
| 13-6-13 | Hand of the pattern (plan from +Z is the dial face, 12 up, 3 right) | screws left of 12; pins right of 12 and left of 6; likely | x -> movement x, y -> -z, Z -> +y; built holes on the same sides: same | 0 | match |
| 13-6-14 | Dial feet / posts (assembly: block on a post, "Festsitz") | none on the dial (separate posts); likely | dial has no feet; dialScrew / dialPin separate: - | - | extra |


## 05 02_13: (B-) Chronometerzifferblatt 1453/A (gez. 9.6.44, gepr. 7.VII.44)

**Title block.** Werkstoff Eisen; Massstab 2:1; Zeichnung Nr 1453/A; Benennung "(B-)Chronometer Zifferblatt"; the dial prints A. Lange & Soehne Glashuette b/Dresden; "Fortlaufende Nummerierung von 5635-6250"; "Gueltig fuer unsere Auftrag-No 14 767". Typed list: Aussen Ø 103 mm; Auf- und Ab-Loch Ø 3,2; Mittel-Loch Ø 6,0 (4,5 struck out); Sekunden-Loch Ø 2,2 (1,5 struck out); Materialstaerke 1,5; Entfernung Mitte-Auf und Ab 23 (23,5 written beside, struck); Mitte-Sekunde 23 (+-0,05).

**Views.** Face view 2:1 of an A. Lange & Soehne dial (numerals 1-12, 7/8 Teilung, up-and-down sector at 12, seconds ring at 6). It is not the same dial as 05 02_12: iron, not brass; Ø103 against 103.6; 1.5 against 1.3/1.2; seconds hole 2.2 against 1.7; other printing; it shows no screw or pin holes (the two tabs at the left edge are the copy's binder holes). The two share the centre hole, the up-and-down hole and the 23 mm distances. The built dial is the Wempe one, 05 02_12.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 13-7-1 | Outside Ø103 | 103; sure | cylinders[11].d 103.55 (05 02_12's dial): 103.55 | +0.55 | mismatch |
| 13-7-2 | Material thickness 1,5 | 1.5; sure | size[2] 1.2: 1.2 | -0.3 | mismatch |
| 13-7-3 | Up-and-down hole Ø3,2 | 3.2; sure | cylinders[1].d 3.2: 3.2 | 0 | match |
| 13-7-4 | Centre hole Ø6,0 (4,5 struck out) | 6.0; sure | cylinders[0].d 6.0: 6.0 | 0 | match |
| 13-7-5 | Seconds hole Ø2,2 (1,5 struck out) | 2.2; sure | cylinders[5].d 1.7: 1.7 | -0.5 | mismatch |
| 13-7-6 | Mitte-Auf und Ab 23 (23,5 struck out) | 23; likely | cylinder at (0,23): 23.0 | 0 | match |
| 13-7-7 | Mitte-Sekunde 23 +-0,05 | 23 +-0.05; sure | cylinder at (0,-23): 23.0 | 0 | match |
| 13-7-8 | This variant as a solid of its own (iron, 1.5, Ø103, 2.2) | a second dial; sure | only the Wempe dial 050200-4 is measured under key dial: - | - | not built |


## Extras

- 05 02_12: the dial has no feet of its own; the assembly shows it on posts (not in this batch).
- Collet 050201-2 (Ø1.5 x 4.0, Ø1.2 x 0.6 end) has no sheet in this batch: 05 02_5 draws only the hand, whose 1.2 bore and 0.6 thickness the collet's end fits. Extra, not judged.
- changePipe, changePinion, changeWheel, hourWheel, cannon, udWheel, udHub, udPinion and the studs have no part sheets here; they are judged only by the assembly's centre distances and its stack where it gives one.

## After the verdicts

The code was not opened: no mismatch needed explaining beyond the gap in 13-1-10 and the 05 02_13 variant, which the verifier can settle from the sheet.

## Summary

Counts: match 72, can't tell 7, mismatch 4, extra 1, not built 1 (total 85).

Mismatches:
- 13-1-10 (05 02_1): Gap dial top to hour-hand blade underside: dimension "2" (scaled 1.6): drawn 2 (scaled 1.64), built 1.78
- 13-7-1 (05 02_13): Outside Ø103: drawn 103, built 103.55
- 13-7-2 (05 02_13): Material thickness 1,5: drawn 1.5, built 1.2
- 13-7-5 (05 02_13): Seconds hole Ø2,2 (1,5 struck out): drawn 2.2, built 1.7

Not built:
- 13-7-8: This variant as a solid of its own (iron, 1.5, Ø103, 2.2)

Could not tell:
- 13-1-4: Zeigerstelltrieb to Wechselrad: caption 12,96
- 13-1-11: Minute-hand boss bottom to hour-hand flange top (label "0,2" near the hands)
- 13-1-12: UD arbor stud: label 12,7 along the stud (length or a diameter?)
- 13-1-15: Dial post screw "16" in the block
- 13-4-7: Overall length to the tip
- 13-5-11: Thickness labels 0,5 / 0,3 / 0,4 / 0,1 / 0,3 along the section
- 13-6-12: Small pin holes diameter

Also illegible: the 3,5 and 15,8/17,0 labels on the assembly, the handwritten notes, and the "1,1" beside the 4 o'clock screw hole.
