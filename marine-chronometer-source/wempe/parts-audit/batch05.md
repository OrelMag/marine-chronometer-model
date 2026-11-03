# Batch 5 reading (centre wheel, maintaining detent, escape wheel, tooth form)

Reader: batch 5, 3 November 2026. Sheets read blind, then compared with `r_wpa/measure` and `r_wpa/page/placements.json`. Scan scale about 3.3 px/mm on paper (5:1 sheets about 16.5 px/mm).


## Sheet 1: 05 05_8 Minutenrad kompl. 05 05 03 (assembly: centre wheel, pinion arbor, cannon)

**Title block.** Drawing 050503, "Minutenrad kompl.", scale 5:1 (sketch M 1:1), Werkstoff blank, drawn 22.7.43, gepr. 7.9.45, Gerhard D. Wempe, Hamburg 11, Stubbenhuk 25; parts 05 05 03-1 (wheel), -2 (pinion arbor), -3 (cannon tube). No general tolerance printed (fallback used).

**Views.** One section of the assembled centre wheel: the cannon tube 05 05 03-3 on top (square 2.6 at the top, bore, Koerner groove, a wide pinion at its foot), the wheel 05 05 03-1 with its hub on the arbor collar, the arbor 05 05 03-2 below with its pinion and lower pivot.

**Step 2 (views against each other).** Section and part sheets agree on 19 +-0.05 and 17.2. Using the section scale (about 16.7 px/mm on the scan), 25.4 ends at the top face of the cannon pinion (19 + 4.0 + 2.4), which reads consistently. The arbor top is not drawn in the section; sheet 05_10 alone gives it.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-1-1 | 25.4 (lower arbor shoulder to the top face of the cannon pinion; end read by pixel scale) | 25.4 (likely) | placements 050503-3 box y0 4.065 and 050503-2 origin y -18.965; cannon.z_levels 2.4: cannon bottom 23.03 above the shoulder, pinion top 25.43 | +0.03 | match |
| 05-1-2 | 19 +-0.05 (lower arbor shoulder to rivet-lip top) | 19 +-0.05 (sure) | centreArbor.section_y0 [1.6,19.03]: 19.03 | +0.03 | match |
| 05-1-3 | 3 (lower pivot length below the shoulder) | 3 (likely) | centreArbor.cones z -3.0..0: 3.0 | 0 | match |
| 05-1-4 | 1.2 dia -0.02 (lower pivot) | 1.2 -0.02 (likely) | centreArbor.cones d 1.19 at z 0: 1.19 | -0.01 (inside 1.18..1.20) | match |
| 05-1-5 | 10.8 -0.1 (cannon: pinion foot to the shoulder under the square) | 10.8 -0.1 (sure) | cannon.z_levels 10.8: 10.8 | 0 | match |
| 05-1-6 | 6.3 (cannon foot to the Koerner groove, +-0.1 fallback) | 6.3 (likely) | cannon.cylinders z 5.9..6.7 (groove 0.8 wide), cones z 6.1..6.5: groove centre 6.3 | 0 | match |
| 05-1-7 | 14.3 (cannon overall length, foot to top) | 14.3 (sure) | cannon.box z max 14.1891 (14.0107 at the outer edge): 14.19 | -0.11 (fallback +-0.1) | mismatch |
| 05-1-8 | 2.6 square r6 (+0.019/+0.012) (cannon top, hand seat) | 2.612..2.619 (likely) | cannon.section_y0 r 1.3077 (2.6154 across flats); cylinders d 3.45 arc 34.4 deg (corners): 2.6154 | inside limits | match |
| 05-1-9 | 2.2 dia e8 (-0.014/-0.028) (arbor cone small end at the wheel) | 2.172..2.186 (likely) | centreArbor.cones d 2.179 at z 19.03: 2.179 | inside | match |
| 05-1-10 | Koerner groove "4 r" (notch both sides of the section at the groove) | notch both sides, radius figure illegible (unsure) | cannon.tori box z 5.9..6.7; section_y0 is straight at r 1.8 there: three cone dimples (cones d 1.26..1.55, 19.7 deg); no groove in the y=0 section | cannot compare | can't tell |
| 05-1-11 | 10 dia (wheel hub, section arrow) | 10 (sure; part sheet gives 10.6 -0.2) | centreWheel.cylinders[2] d 10.5: 10.5 | -0.1 vs 10.6 (inside 10.4..10.6) | match |
| 05-1-12 | pinion block under the wheel (4 long by scale) | about 4.5 (scaled, unsure) | centreArbor.teeth z 13.275..17.225: 3.95 | within scan | match |

**Extras (built, not on the sheet).** Cannon bore taper 1.815 to 1.6438 and a countersink inside at 6.1..6.5 are drawn in the section but not dimensioned. Three cone dimples built with no angle given on the sheet.

**After the verdicts.** The cannon recipe (`wempe.py` cannon()) builds the Koerner marks as punched cone dimples at assembly (its setup says "punched at assembly"), which explains why the y=0 section has no circumferential groove. I did not read the recipe for the 14.3 length. Verdicts above unchanged.


## Sheet 2: 05 05_9 Minutenrad 05 05 03-1 (centre wheel, part)

**Title block.** Drawing 050503-1, "Minutenrad", scale 5:1 (sketch M 1:1), Werkstoff Messingblech 1,5 DIN 1751 Ms 58 federhart; drawn 25.8.40, gepr. 18.12.40, rev 27.4.43; general tolerance "nicht eingetr. Toleranz +-0,01" (sure). Cycloidal teeth: z 90, D 33.10, d 31.976, dg 30.86, t 1.116, l 0.52, M 0.355.

**Views.** Plan of the wheel: 5 spokes at 72 deg, rim, hub circle round the 5.4 bore, a few teeth drawn at the top, dashed pitch circles; "Radstaerke 1,3 -0,1".

**Step 2 (views against each other).** The 33.8 -0.2 overall is larger than the table D 33.10 (blank before the teeth are cut): a sheet-internal difference. Spokes are parallel-sided.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-2-1 | z (tooth count, table) | 90 (sure) | centreWheel.teeth[0].count: 90 | 0 | match |
| 05-2-2 | D tip diameter (table), +-0.01 | 33.10 (sure) | teeth.tips_d: 33.0987 | -0.0013 | match |
| 05-2-3 | dg root diameter (table) | 30.86 (sure) | teeth.roots_d: 30.8594 | -0.0006 | match |
| 05-2-4 | 33.8 -0.2 (overall diameter, extension lines to the outer circle) | 33.8 -0.2 (sure) | box size 33.089 x 33.098: 33.09 | -0.7 (blank diameter; the sheet's own D is 33.10) | can't tell |
| 05-2-5 | Radstaerke (wheel thickness) | 1.3 -0.1 (sure) | centreWheel.z_levels 0..1.25: 1.25 | -0.05 (inside 1.2..1.3) | match |
| 05-2-6 | 5.4 H7 (+0.012) bore | 5.4 +0.012 (sure) | centreWheel.cylinders[1] d 5.4: 5.4 | 0 (inside 5.4..5.412) | match |
| 05-2-7 | 10.6 -0.2 (hub diameter) | 10.6 -0.2 (sure) | centreWheel.cylinders[2] d 10.5 (arcs r 5.25): 10.5 | -0.1 (inside) | match |
| 05-2-8 | 28.1 +0.2 (rim inner diameter, diametral line; comma smeared) | 28.1 +0.2 (likely) | centreWheel.cylinders[0] d 28.2: 28.2 | +0.1 (inside 28.1..28.3) | match |
| 05-2-9 | 1.7 -0.2 (spoke width) | 1.7 -0.2 (sure) | outlines_by_level[0.0] spoke edges y=+-0.8: 1.6 | -0.1 (inside 1.5..1.7) | match |
| 05-2-10 | 72 deg (spoke pitch, 5 spokes) | 72 (sure) | 5 pairs of parallel spoke edges at 72 deg: 72 | 0 | match |
| 05-2-11 | spoke orientation against the tooth pattern | not dimensioned (illegible) | n/a: a spoke on +x | n/a | can't tell |

**Extras (built, not on the sheet).** 

**After the verdicts.** Not read: the centre wheel recipe was not needed; every dimension matched or is a blank/construction figure.


## Sheet 3: 05 05_10 Minutentrieb 05 05 03-2 (centre pinion and arbor)

**Title block.** Drawing 050503-2, "Minutentrieb", scale 5:1 (sketch M 1:1), Werkstoff Praez. Rundstahl 7,2 DIN 175; haerten, 295 deg anlassen; drawn 7.6.40, gepr. 18.12.40, rev 20.4.43; "nicht eingetr. Toleranz +-0,1". Pinion z 14, d 6.098, dg 4.24, t 1.368, M 0.4356 (D blank).

**Views.** Left: the blank (3.8 dia ends, 5.8 collar, 6.79 pinion); middle: tooth plan; right: the finished arbor, broken in the middle (not to scale): pinion, collar 5.4 n6, rivet cone C (1:30), 1.8 g6 on a 1:80 taper, 1.65 pivot, lower pivot with a 30 deg chamfer.

**Step 2 (views against each other).** The two views agree on the pinion tip 6.79 -0.02. The lower pivot reads 5.1 here and 3 on assembly 05 05_8 (22.7.43): the sheets differ. The built arbor follows 3.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-3-1 | z (pinion leaves) | 14 (sure) | centreArbor.teeth[0].count: 14 | 0 | match |
| 05-3-2 | 6.79 -0.02 (pinion tip diameter) | 6.77..6.79 (sure) | teeth.tips_d: 6.78 | inside | match |
| 05-3-3 | dg root diameter (table) | 4.24 (sure) | teeth.roots_d: 4.2347 | -0.005 (inside +-0.1) | match |
| 05-3-4 | 4 -0.1 (pinion length) | 3.9..4.0 (sure) | z_levels 13.275..17.225: 3.95 | inside | match |
| 05-3-5 | 17.2 +0.05 (shoulder to pinion top) | 17.2 +0.05 (sure) | z_levels 17.225: 17.225 | +0.025 | match |
| 05-3-6 | 5.4 n6 (collar, wheel seat; ISO n6 on 5.4: +0.016/+0.008) | 5.408..5.416 (likely) | cylinders[0] d 5.4 z 17.225..18.775: 5.4 | -0.008 (below the lower limit) | mismatch |
| 05-3-7 | 1.6 (collar height, +-0.1) | 1.6 +0.1 (unsure of the sign) | cylinders[0] z span 17.225..18.775: 1.55 | -0.05 (inside) | match |
| 05-3-8 | 19 +0.05, circled (shoulder to rivet-lip top) | 19 +0.05 (sure) | section_y0 [1.6,19.03]: 19.03 | +0.03 | match |
| 05-3-9 | 3.6 dia (rivet lip maximum diameter) | 3.6 (likely) | cones d 2.44..3.2 at z 17.785..19.03: 3.2 | -0.4 | mismatch |
| 05-3-10 | Kegel 1:30 (cone C, 19 to 23) | 1:30 (likely) | cones d 2.0457..2.179, half angle 1.0 deg over 4.0: 1:30 | 0 | match |
| 05-3-11 | 23 +0.05 (shoulder to top of cone C) | 23 +0.05 (sure) | z_levels 23.03: 23.03 | +0.03 | match |
| 05-3-12 | 1.8 dia g6 (-0.002/-0.008) at the base of the 1:80 taper | 1.792..1.798 (likely) | cones d 1.795 at z 23.03: 1.795 | inside | match |
| 05-3-13 | Kegel 1:80 (upper shaft) | 1:80 (likely; written rotated) | cones d 1.795 to 1.7191 over 6.07: 1:80 | 0 | match |
| 05-3-14 | 16.7 -0.2 (top of cone C, z 23, to the upper tip) | 16.7 -0.2 (sure) | box z max 37.33: 14.3 above z 23.03 | -2.4 | mismatch |
| 05-3-15 | 39.65 -0.1 (shoulder to the upper tip) | 39.65 -0.1 (sure) | box z max 37.33: 37.33 | -2.32 | mismatch |
| 05-3-16 | 1.65 dia (top pivot) | 1.65 (likely) | cones d 1.6176..1.7109: 1.62 | -0.03 (inside +-0.1) | match |
| 05-3-17 | 2.5 dia (arbor below the pinion) | 2.5 (sure) | cylinders[1] d 2.5 z 0.38..13.275: 2.5 | 0 | match |
| 05-3-18 | 5.1 -0.2 (lower pivot length, tip to the chamfer line) | 5.1 -0.2 (likely; assembly gives 3) | cones z -3.0..0: 3.0 | -2.1 | mismatch |
| 05-3-19 | 1.2 dia (lower pivot; sign illegible, assembly -0.02) | 1.2 (sign illegible) | cones d 1.19: 1.19 | -0.01 | match |
| 05-3-20 | 30 deg chamfer (arbor end at the pivot) | 30 (likely) | cones d 1.19..2.5, half angle 60 deg to the axis (30 deg to the face): 30 from the face | 0 | match |
| 05-3-21 | left blank view: 3.8 -0.2, 5.8 -0.2, 6.3, 1.5 +0.2, 20.5 +0.2, 44.4 -0.2 | rod blank dimensions (sure) | n/a (the part is the finished arbor): n/a | n/a | can't tell |

**Extras (built, not on the sheet).** Built arbor has a bevel cone 1.2391..1.7109 over z 29.1..29.76 and a rounded tip; the sheet draws a plain cone tip at the top. Not dimensioned.

**After the verdicts.** `centreArbor()` is `trainArbor('cw',...)`: the profile is the page's own train.js profile for the centre wheel arbor (`WT()["cw"]["prof"]`), not rebuilt from sheet 05_10. The upper-tip length (37.33 vs 39.65) and lower pivot (3 vs 5.1) are therefore the page's numbers; the 3 agrees with the assembly 05 05_8. I did not find a 5.4 n6 or a 3.6 lip in the recipe's own text (the sizes come from the profile). Verdicts above unchanged.


## Sheet 4: 05 05_11 Gegensperrkegel kompl. 05 05 05 (maintaining detent assembly)

**Title block.** Drawing 050505, scale 5:1, Werkstoff blank; drawn 2.4.41, gepr. 11.5.41, rev 20.4.43; no general tolerance printed (fallback). Parts 05 05 05-1 (detent), 05 05 05-2 (arbor). Note "vor dem aufschlagen 7.5" (before upsetting).

**Views.** Side view of the detent on its arbor (collars near each end, pivots beyond) and below it the plan of the detent: hub with the arbor, the tip curving to the right.

**Step 2 (views against each other).** Side view and plan are consistent. Only 6.3 +-0.1 and 7.5 are dimensioned. The wire stud and 050506-1 are not on this sheet.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-4-1 | 6.3 +-0.1 (arbor collar to the detent's far face) | 6.3 +-0.1 (sure) | dtArbor.section_y0 near collar at z -0.025; maintDetent.z_levels -6.225: near collar to the far face 6.2 | -0.1 (at the limit) | match |
| 05-4-2 | 7.5 vor dem aufschlagen (before upsetting) | 7.5 (likely) | n/a (state before riveting): n/a | n/a | can't tell |
| 05-4-3 | plan hand: hub left, tip right, lower edge concave, thin step near the tip | hub left, tip right (sure) | maintDetent.png: hub at +x (+2.5), tip at -x (-11.67), thin step on the tip side: mirrored in x relative to the sheet | n/a | mismatch |
| 05-4-4 | arbor body and pivots (not dimensioned; scaled) | body about 2.3..2.7, pivot about 0.9 (unsure) | dtArbor.cylinders d 2.2786, 2.2329, 0.88: 2.23..2.28 / 0.88 | within scan | match |

**Extras (built, not on the sheet).** wireStud (head 3.0, shank 1.66) and page line 050506-1 (wire, 0.86 mm3) are not on this sheet.

**After the verdicts.** `maintDetent()` in `wempe.py` says its outline is "mirrored and turned onto the fusee, as fusee.js's DTX": the mirror is deliberate in the model (the sheet read as seen from the other face when the detent sits on the fusee side). That is why the part frame is mirrored against the sheet. Whether the sheet really is drawn from the other face is not stated on it, so I leave the verdict as a hand mismatch for the verifier.


## Sheet 5: 05 05_12 Gegensperrkegel 05 05 05-1 (maintaining detent, part)

**Title block.** Drawing 050505-1, scale 5:1, Werkstoff Bandstahl 2,25x18 DIN 1016; haerten in Oel 310 deg hell-blau anlassen; um die Bohrung 400 deg anlassen; nach dem Stanzen flachdruecken; drawn 19.7.44; "nicht eingetr. Toleranz +-0,1" (sure).

**Views.** Plan: hub circle with bore at the left, concave lower edge R9, upper edge R18, tip at the right; a dashed line from the upper edge to the lower edge marks the thin zone; section A-B: thickness 2, thin zone 1 -0.03, bore 2.25 H7 tapered 1:70.

**Step 2 (views against each other).** Plan and section agree: the thin zone lies on the tip side and the notch is on the viewed face. The 12 r (+-0.1), 150 deg and 80 deg figures do not clearly attach to a feature.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-5-1 | 14.2 (overall length, hub left edge to the tip) | 14.2 (sure) | maintDetent.box x -11.6724..2.4994: 14.17 | -0.03 | match |
| 05-5-2 | 8.6 (hole axis to the end of the step line on the upper edge) | 8.6 (sure) | outlines level -5.225: arc end (-8.6319, 1.1936): 8.63 | +0.03 | match |
| 05-5-3 | 5 (hub diameter) | 5 (sure) | cylinders d 5.004: 5.004 | 0 | match |
| 05-5-4 | 9 r (concave lower edge) | R9 (sure) | cylinders d 17.9723, centre (-6.0325,-9.7806): 8.986 | -0.014 | match |
| 05-5-5 | 18 r (upper edge) | R18 (sure) | cylinders d 36.0, centre (-1.7154,-15.4245): 18.0 | 0 | match |
| 05-5-6 | 9.645 (hole axis to the R9 centre line, vertical) | 9.645 (sure) | R9 centre y -9.7806: 9.781 | +0.136 | mismatch |
| 05-5-7 | 6.273 (hole axis to the R9 centre, horizontal) | 6.273 (sure) | R9 centre x -6.0325: 6.033 | -0.24 | mismatch |
| 05-5-8 | 2.6 (tip end face height) | 2.6 (sure) | end line (-11.2773,-0.1743) to (-11.6724,-2.7847), len 2.6401: 2.64 | +0.04 | match |
| 05-5-9 | 80 deg (tip end face; line it is measured to unclear) | 80 (unsure) | end line leans 8.1 deg from vertical: 81.9 from the horizontal | +1.9 if horizontal | can't tell |
| 05-5-10 | 12 r +-0.1 | R12 (unsure what it attaches to) | no R12 in outlines_by_level: none | n/a | can't tell |
| 05-5-11 | 150 deg | 150 (unsure) | n/a: n/a | n/a | can't tell |
| 05-5-12 | thickness overall | 2 (sure) | z_levels -6.225..-4.225: 2.0 | 0 | match |
| 05-5-13 | 1 -0.03 (thin zone thickness) | 1 -0.03 (sure) | z_levels -5.225: 1.0 | 0 (inside 0.97..1) | match |
| 05-5-14 | bore 2.25 H7 +0.009, Kegel 1:70 | 2.25 +0.009; 1:70 (likely) | section_y0 r 1.125 at z -6.225, 1.1393 at -4.225: 2.25 / 2.2786 (1:70) | 0 (inside 2.25..2.259) | match |
| 05-5-15 | hand of the part (plan and notch side) | tip right, concave edge below, thin zone at the tip, notch on the viewed face (likely) | maintDetent.png and outlines_by_level: mirror image about the vertical axis (hub at +x) | n/a | mismatch |

**Extras (built, not on the sheet).** None beyond the sheet's features.

**After the verdicts.** The same recipe lists the tip's lower corner "on r 12 about the hole" and the step line from the back at "8,6", "150 deg". The built tip lower corner is (-11.6724,-2.7847), 12.000 from the hole, so the sheet's R12 +-0.1 is the tip corner distance and matches (my item 05-5-10, verdict left as can't tell above). The R9 centre in the recipe is `D["C9"]`, a fitted point; its 6.033/9.781 differ from the sheet's 6.273/9.645 as measured. The recipe also says it mirrors the sheet (see sheet 4).


## Sheet 6: 05 04_7.2 Gangrad 05 04 08 bis 10 / 05 04 05-1 (escape wheel assembly)

**Title block.** Drawing 050408 bis 10 (05 04 05-1), scale 5:1, drawn 19.7.43, gepr. 7.8.43, Arbeitspause Nr 54; hand note "Rad von uns aufgesetzt"; fit table H7 1.7 +0.009 / h6 1.7 -0.007; parts 05 04 08 (wheel), 05 04 09 (pinion arbor), 05 04 10 (collet). No general tolerance printed (fallback).

**Views.** Section of the assembled wheel: pinion arbor with its upper pivot (0.5 tip, 6 dia circle drawn at the top), pinion, collet riveted on the wheel, a recess (dashed) underneath the wheel, lower pivot with a 0.24 dia jewel hole.

**Step 2 (views against each other).** The label "1.8 dia H7/h6" and the fit table "1.7" differ (sheet-internal); I read the label as 1.8 and the table as 1.7. The scan is about 5 % small, so scaled sizes carry +-0.2.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-6-1 | 22.8 -0.2 (tip to tip) | 22.8 -0.2 (sure) | escapeArbor.box z -20.98..1.8: 22.78 | -0.02 | match |
| 05-6-2 | 19 (upper tip to the wheel top face) | 19 (sure) | arbor tip 1.8; wheel top y -17.2 (placements 050405-1 box): 19.0 | 0 | match |
| 05-6-3 | 5.3 (upper tip to the pinion top) | 5.3 (sure) | escapeArbor.z_levels -3.5: 5.3 | 0 | match |
| 05-6-4 | 4.7 (wheel top face to collet top) | 4.7 (likely) | escapeCollet.box z -12.5; wheel top -17.2: 4.7 | 0 | match |
| 05-6-5 | 2 (lower pivot length) | 2 (sure) | escapeArbor.section_y0 taper from -19.0186 to -20.98: 1.96 | -0.04 | match |
| 05-6-6 | 0.24 dia (lower pivot end, "Steinlager einpassen") | 0.24 (sure) | escapeArbor.cylinders d 0.24 z -20.98..-20.48: 0.24 | 0 | match |
| 05-6-7 | 1.8 dia H7/h6 (wheel bore on the collet spigot; table says 1.7, H7 +0.009, h6 -0.007) | 1.8 H7/h6 by the label (likely); table 1.7 | escapeWheel.cylinders[0] d 1.808; escapeCollet.cylinders d 1.797: 1.808 / 1.797 | H7 +0.008, h6 -0.003 (inside, on 1.8) | match |
| 05-6-8 | wheel thickness (scaled, no figure) | about 1.4 (scaled; unsure) | escapeWheel.z_levels 0..1.4: 1.4 | within scan | match |
| 05-6-9 | recess under the wheel (dashed, lower half) | dashed inner rectangle, about 0.7 deep (likely) | escapeWheel.section_y0: web z 0.7..1.4, rim lip r 5.85..5.93 down to z 0: 0.7 deep | within scan | match |
| 05-6-10 | collet flange and rivet (not dimensioned) | collet 05 04 10 with a flange on the wheel (sure) | escapeCollet.cylinders 2.8 / 1.7 / 1.797: flange 2.8 | n/a | can't tell |

**Extras (built, not on the sheet).** Built escape arbor has a 1.0 neck between -19.02 and -17.9 and a 1.07 d between -12.5 and -7.5; the sheet shows plain shaft sections. Not dimensioned here.

**After the verdicts.** Not read; the assembly's figures all match the measured stack.


## Sheet 7: 05 04_8 Gangtrieb Hz 05 04 05-2 (escape pinion and arbor)

**Title block.** Drawing Hz 05 04 05-2, "Gangtrieb", scale 5:1, Werkstoff Praez. Rundstahl 3,4 DIN 175; drawn 7.6.40, gepr. 18.12.40, rev 8.4.43; "nicht eingetr. Toleranz +-0,1"; pinion z 10, D 2.97 -0.01, d 2.633, dg 1.6, t 0.827, M 0.263.

**Views.** Plain arbor: upper pivot, pinion blank 3.13, lower rod, 60 deg point at the bottom; tooth plan.

**Step 2 (views against each other).** This sheet draws a single rod with the pinion 5 long and no collet seat (1940); assembly 05 04_7.2 (19.7.43) is later and gives a shorter arbor with a collet. The built part follows the assembly, so the differences below are sheet to sheet.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-7-1 | z (pinion leaves) | 10 (sure) | escapeArbor.teeth[0].count: 10 | 0 | match |
| 05-7-2 | D 2.97 -0.01 (tip diameter) | 2.96..2.97 (sure) | teeth.tips_d: 2.97 | 0 | match |
| 05-7-3 | dg 1.6 (root diameter) | 1.6 (sure) | teeth.roots_d: 1.5961 | -0.004 | match |
| 05-7-4 | 5 -0.2 (pinion length) | 4.8..5.0 (sure) | z_levels -7.5..-3.5: 4.0 | -1.0 | mismatch |
| 05-7-5 | 6.5 -0.2 (upper tip to the pinion top) | 6.3..6.5 (sure) | box top 1.8, pinion top -3.5: 5.3 | -1.2 | mismatch |
| 05-7-6 | 26.5 -0.2 (overall) | 26.3..26.5 (sure) | box z size 22.78: 22.78 | -3.7 | mismatch |
| 05-7-7 | 1.6 -0.2 (arbor above and below the pinion) | 1.4..1.6 (sure) | cylinders d 1.2 (z -3.5..-0.33 and -17.9..-12.5), 1.07 between: 1.2 | -0.2 (outside) | mismatch |
| 05-7-8 | 3.13 -0.01 (pinion blank diameter) | 3.13 (sure) | no 3.13 cylinder (tips 2.97): none | n/a | can't tell |
| 05-7-9 | 60 deg (lower point) | 60 (likely) | tapered lower pivot 1.0 to 0.24: pivot, not a 60 deg point | n/a | can't tell |

**Extras (built, not on the sheet).** Built lower end is a 1.0 neck and a 2 mm taper to 0.24 (from the assembly); this sheet shows a 60 deg point.

**After the verdicts.** `escapeArbor()` is `trainArbor('ew',...)` from train.js, with source line "05 04 05-2 (Hz 7.6.40; 05 04_7.2)" and the leaves figures from this sheet; the shaft and pinion lengths are the page's (following the later assembly), which explains the sheet-to-sheet mismatches. Verdicts above unchanged.


## Sheet 8: 05 04_23 Gangrad Zahnform 02 04 08 (escape wheel tooth form)

**Title block.** Drawing 02 04 08 a, "Gangrad. Zahnform", scale 25:1 (M 1:1), Werkstoff Messingblech 1,6 DIN 1751 Ms 63 federhart, Arbeitspause Nr 8; drawn 20.1.42, gepr. 22.1.42; stamped KOPIE. No general tolerance printed (fallback).

**Views.** One tooth pair, spoke and bore sector at 25:1: two hooked teeth, concave back with a step at its foot, straight face; spoke curves R 7.9; construction diameters.

**Step 2 (views against each other).** The plan agrees with itself. The number 02 04 08 differs from 05 04 08 on the assembly (older numbering). As drawn (wheel centre below) the tooth tips lean clockwise: the tip overhangs the face foot to the right. Scan scale: tip circle R 7 = 577 px, about 3.3 px/mm on paper at 25:1.

| # | item (what the size attaches to) | drawn (as read; certainty) | built (field: value) | delta | verdict |
|---|---|---|---|---|---|
| 05-8-1 | 14 dia +0.03 (tip circle) | 14 +0.03 (sure) | escapeWheel.teeth[0].tips_d: 14.0 | 0 (lower limit) | match |
| 05-8-2 | tooth count (15 from the 24 deg pitch; the sheet prints no count) | 15 (unsure; not printed) | teeth[0].count: 15 | 0 | match |
| 05-8-3 | 11.7 dia (root circle) | 11.7 (sure) | teeth[0].roots_d: 11.6994 | -0.001 | match |
| 05-8-4 | 12.1 dia (start of the back curve after the 0.2 step) | 12.1 (likely) | outlines level 1.4: back curve foot r 6.05 at 0.35 deg: 12.1 | 0 | match |
| 05-8-5 | 10.9 dia (rim inner circle) | 10.9 (sure) | section_y0 r 5.4492: 10.898 | -0.002 | match |
| 05-8-6 | 0.1834 (tip land width) | 0.1834 (sure) | outlines level 1.4: tip segment 13.85..15.35 deg at r 7.0, len 0.1833: 0.1833 | 0 | match |
| 05-8-7 | 1 1/2 deg (tip land angle) | 1.5 (sure) | tip from 13.85 to 15.35 deg: 1.5 | 0 | match |
| 05-8-8 | 25 deg (face against the tip radial) | 25 (likely) | face line root (9.98 deg, r 5.85) to tip (15.35 deg, r 7.0): 25.05 deg to the tip radial: 25.05 | +0.05 | match |
| 05-8-9 | tip lead beyond the face foot (5.6 deg by pixel scale) | about 5.6 (unsure) | tip 15.35 deg, face foot 9.98 deg: 5.37 | within scan | match |
| 05-8-10 | 7.9 (spoke edge radius) | R7.9 (likely; arrow touches the spoke edge) | outlines level 0.7: three circles R 7.9 fitted to the spoke edges, rms 0.0: 7.9 | 0 | match |
| 05-8-11 | 6.0606 dia (circle about the centre) | 6.0606 (unsure what it bounds) | spokes begin at r 1.53; no r 3.03 feature: none | n/a | can't tell |
| 05-8-12 | hand of the teeth (face and overhanging tip on the clockwise side as drawn) | face on the clockwise side, tip leaning clockwise (likely; the sheet names no face to view from) | escapeWheel.png from +Z: face on the counter-clockwise side, tip leaning counter-clockwise: mirror image of the drawing if both are seen from the same face | n/a | mismatch |
| 05-8-13 | 15 deg and 50 deg (angles about the tooth axis) | 15 and 50 (unsure what they span) | tooth pitch 24 deg; face 30.4 deg to the root radial: n/a | n/a | can't tell |
| 05-8-14 | 1 (small dimension at the face foot) | 1 (unsure) | root land 1.406 (r 5.85 over 13.77 deg): n/a | n/a | can't tell |
| 05-8-15 | 0.2 radial step at the back foot (drawn; figure not given) | step at the back foot (sure) | back from r 5.85 to r 6.05 at 0.35 deg: 0.2 | n/a | match |
| 05-8-16 | spoke count (only a sector drawn) | not shown (unsure) | three windows: 3 | n/a | can't tell |
| 05-8-17 | stock thickness (finished thickness not printed) | 1.6 stock (sure) | z_levels 1.4: 1.4 | -0.2 vs stock | can't tell |

**Extras (built, not on the sheet).** Built wheel has a recessed web (0.7 thick, upper half) and a hub boss r 0.9..1.93 at z 0.7..1.4; the tooth sheet does not show the recess (the assembly does).

**After the verdicts.** `escapeWheel()` builds the teeth from the page's `WT()["ewg"]` outline, which its text says is a fly cutter form: "the locking face straight, leaning 25 deg back from the radius; the tip flat 0.1834 (1.5 deg); the back hollow to dia 12.1, stepped 0.2; 1 wide at the root", and the three openings "each arc r 7.9 from a centre 9.43 out", 17.7 deg behind a tooth tip. It uses P(q)=(x,-z) "the page's plan to the part's frame (Y = -z)": the part frame is the page plan mirrored in one axis. That mirroring is the likely source of the hand difference above, and the 1-wide root and 15/50/6.06 figures are interpreted there as stated in its text. My hand verdict stays for the verifier.


## Summary

Counts: match 68, mismatch 15, can't tell 16.

**Mismatches / not built** (none not built):

- 05-1-7 (sheet 05 05_8): 14.3; drawn 14.3, built 14.19, delta -0.11 (fallback +-0.1)
- 05-3-6 (sheet 05 05_10): 5.4 n6; drawn 5.408..5.416, built 5.4, delta -0.008 (below the lower limit)
- 05-3-9 (sheet 05 05_10): 3.6 dia; drawn 3.6, built 3.2, delta -0.4
- 05-3-14 (sheet 05 05_10): 16.7 -0.2; drawn 16.7 -0.2, built 14.3 above z 23.03, delta -2.4
- 05-3-15 (sheet 05 05_10): 39.65 -0.1; drawn 39.65 -0.1, built 37.33, delta -2.32
- 05-3-18 (sheet 05 05_10): 5.1 -0.2; drawn 5.1 -0.2, built 3.0, delta -2.1
- 05-4-3 (sheet 05 05_11): plan hand: hub left, tip right, lower edge concave, thin step near the tip; drawn hub left, tip right, built mirrored in x relative to the sheet, delta n/a
- 05-5-6 (sheet 05 05_12): 9.645; drawn 9.645, built 9.781, delta +0.136
- 05-5-7 (sheet 05 05_12): 6.273; drawn 6.273, built 6.033, delta -0.24
- 05-5-15 (sheet 05 05_12): hand of the part; drawn tip right, concave edge below, thin zone at the tip, notch on the viewed face, built mirror image about the vertical axis (hub at +x), delta n/a
- 05-7-4 (sheet 05 04_8): 5 -0.2; drawn 4.8..5.0, built 4.0, delta -1.0
- 05-7-5 (sheet 05 04_8): 6.5 -0.2; drawn 6.3..6.5, built 5.3, delta -1.2
- 05-7-6 (sheet 05 04_8): 26.5 -0.2; drawn 26.3..26.5, built 22.78, delta -3.7
- 05-7-7 (sheet 05 04_8): 1.6 -0.2; drawn 1.4..1.6, built 1.2, delta -0.2 (outside)
- 05-8-12 (sheet 05 04_23): hand of the teeth; drawn face on the clockwise side, tip leaning clockwise, built mirror image of the drawing if both are seen from the same face, delta n/a

**Could not read / can't tell:**

- 05-1-10: Koerner groove "4 r"
- 05-2-4: 33.8 -0.2
- 05-2-11: spoke orientation against the tooth pattern
- 05-3-21: left blank view: 3.8 -0.2, 5.8 -0.2, 6.3, 1.5 +0.2, 20.5 +0.2, 44.4 -0.2
- 05-4-2: 7.5 vor dem aufschlagen
- 05-5-9: 80 deg
- 05-5-10: 12 r +-0.1
- 05-5-11: 150 deg
- 05-6-10: collet flange and rivet
- 05-7-8: 3.13 -0.01
- 05-7-9: 60 deg
- 05-8-11: 6.0606 dia
- 05-8-13: 15 deg and 50 deg
- 05-8-14: 1
- 05-8-16: spoke count
- 05-8-17: stock thickness