# Batch 13 verification (motion work assembly, hands, collet, dial 05 02_12, sheet 05 02_13)

Method: each sheet re-read on enlarged crops (kept in E:/mc-video/wpa-audit/crops/, v13_*). Built values from r_wpa/measure/*.json and page/placements.json (parts found by hn: minuteHand 050200-1, hourHand 050200-2, udHand 050200-3, secondsHand 050201-1, dial 050200-4, hourPipe 050203-2, studLong 050200-6, udWheel 050204-1, udPinion 050200-5).
General tolerance as read: sheets 02, 03, 04, 05 all carry "nicht eingetr. Toleranz +-0,1". Sheet 01 prints none (fallback used). Scale of sheet 01 calibrated on the dial (1.3 thick = about 90 px at my 4x crop, plate top to dial underside 7).

## Sheet 05 02_1 (assembly)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-1-1 | match 23 | 23 under the centre line, UD arbor (likely) | udHub origin z -23 | match | yes | |
| 13-1-2 | match 12,6 | 12,6 (likely) | hypot 12.598 | match | yes | |
| 13-1-3 | match 18,4 | 18,4 between Auf u.Ab and Federhaus; the dimension's two ends are not marked (unsure) | 18.40 | can't tell | no | The caption sits between two arbor labels, so the pair is not fixed. A match on a number whose ends are not marked is not firm. |
| 13-1-4 | can't tell | 12,96 | pinion not in batch | can't tell | yes | |
| 13-1-5 | match 7 | 7 plate top to dial underside, scaled 6.9-7.1 (likely) | dial y0 10.35 minus plate top 3.35 = 7.00 | match | yes | the plate top is the udHub/changePipe lowest y 3.35, inferred |
| 13-1-6 | match 1,2 vs 1,3 | dial hatched about 1.3 (1.2 handwritten on 05 02_12) (likely) | size 1.2 (y 10.35-11.57) | match | yes | within +-0.1 of both |
| 13-1-7 | match 6,0 | "Loch 6,0" (sure) | 6.0 | match | yes | |
| 13-1-8 | match 3,2 | "Loch 3,2" (sure) | 3.2 | match | yes | |
| 13-1-9 | match hour bore on pipe | the pipe's taper is wider at the dial end. I checked the built pair: pipe OD 4.4849 (z 3.585) to 4.419 (z 8.2), narrow at the top; hand bore 4.4598 at the bottom (z 0, section r 2.2299) to 4.4155 at the top (r 2.2077). The tapers run the same way. At the hand's two ends the pipe is larger than the bore by about 0.013 mm (diametral) | | match (tapered press, 13 um over) | yes | The `cones` entry lists d as [4.4155, 4.4598] with z [0, 3.1], which hides the direction; the section settles it. |
| 13-1-10 | mismatch 2 vs 1.78 | label 2 with arrows from the dial top to the hour-hand blade underside (likely). Scaled on the sheet's own scale 1.9-2.0, so label and drawing agree | dial top y 11.57, hour blade underside 13.35 = 1.78 (-0.22) | mismatch | yes | -0.22 exceeds the fallback +-0.05 and also +-0.1. The scaled gap agrees with the label, so the drawing is not the cause. |
| 13-1-11 | can't tell 0,2 | The label near the minute-hand boss reads "0,2" with a "4" over it (0,4?); arrow pointing at the gap between the minute-hand boss underside and the hour-hand top. Scaled about 0.4-0.5 (unsure) | gap 14.865 - 14.15 = 0.715 | mismatch (likely, 0.2-0.3 too big) | no | Both the label (0,2 or 0,4) and the scaled gap are well under 0.715. The reader's "can't tell" understates it. |
| 13-1-12 | can't tell 12,7 | 12,7 written and underlined along the UD stud, no arrows: a length note. The stud drawn from its tip at the plate underside to its head scales 12.5 (+-0.3) (unsure) | studLong y 0-12.3 | can't tell (leans mismatch, -0.4) | yes | underline suggests not to scale |
| 13-1-13 | match 1.5 | stud scaled about 1.6-1.7 (unsure) | 1.5 | can't tell | no | accuracy of the scan (+-0.2 at this scale) does not support "match" |
| 13-1-14 | match 23 | no 23 on this sheet for the seconds; 23 comes from 05 02_12 (likely) | origin z +23 | match | yes | |
| 13-1-15 | can't tell 16 | "16" across the post's bore, arrows (unsure) | dialScrew shank 0.98, head 1.7 | can't tell | yes | |

Hour-hand bore and hand-bore limits are under sheet 05 02_3 below.

## Sheet 05 02_2, minute hand 05 02 00-1

Checked and re-read enlarged: bore, taper, flange and collar items.

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-2-1..4 | match | 46, no tail, Ø6, collar 4,2 (sure) | box and cylinders as stated | match | yes | |
| 13-2-5 | match 2,6 H7 +0,009 | square 2,6 H7 +0,009: limits 2.600-2.609 (printed tolerance) (likely) | flats 1.3022 at z 2 -> 2.604; 1.3165 at z 0 -> 2.633 | match at the narrow end | yes | the wide end is outside, but a 1:70 taper (0.029 over 2 mm) cannot sit inside 9 um; the gauge plane is at the narrow end |
| 13-2-6 | match 1:70 | Kegel 1:70 (likely) | 0.0286/2.0 = 1:70 | match | yes | |
| 13-2-7 | match 2 ; 1,2 | 2 total, 1,2 flange (likely) | z 2.0; flange z 0.8-2.0 | match | yes | |
| 13-2-8..12 | match | 12 (=1,2) at the boss, 2 at 13, 0,7 at 25, 1,7 at 36, 0,4 at 46 (the root width "12" is a 1,2; likely) | outlines as stated | accepted, not re-read (8) ; 9-12 sampled and agree | yes | |
| 13-2-13 | match | thickness 0,7 / 0,6 / 0,4 (likely) | about 0.68 / 0.6 / 0.4 | match | yes | |

## Sheet 05 02_3, hour hand 05 02 00-2

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-3-1..3 | match | 35, Ø8,2, Ø6,8 (sure/likely) | as stated | match | yes | |
| 13-3-4 | match 5 -0,2 | tube Ø5 -0,2 -> 4.8-5.0 (likely) | 4.8 outside z 0-2.3 | match (at the lower limit) | yes | |
| 13-3-5 | match 4,4 H7 +0,012 | Ø4,4 H7 +0,012 -> limits 4.400-4.412 (ISO H7 for 3-6 mm is +0.012: same as printed) (likely) | bore 4.4155 (top, narrow) to 4.4598 (bottom); section r 2.2077 / 2.2299 | mismatch (marginal) | no | The narrowest Ø on the whole taper, 4.4155, is above the upper limit 4.412 by 0.0035; the mean is 4.4377. For the minute hand the narrow end does land inside its H7. A 1:70 taper over 3.1 spans 0.044, so no plane can be inside 12 um unless the gauge plane is the narrow end, and that is above the limit here. Size of the miss is 3.5 um; the verdict is by the brief's rule (printed tolerance). |
| 13-3-6 | match | 1:70 (likely) | 0.0143 over 3.1 | match | yes | |
| 13-3-7, 8 | match | 3,1; flange 0,8 (sure/likely) | z 3.1; flange z 2.3-3.1 | match | yes | |
| 13-3-9..14 | match | blade widths, drop Ø5,2 | as stated | sampled 3-4 of 6, agree | yes | root width 1,7 unsure as the reader says |
| 13-3-15 | match | the blade's top meets the flange top, hatched about 0.5 thick at the root, bottom level with the flange's bottom (z 2.3) (unsure) | top 2.8 at the root over underside 2.3 | match | yes | I measured the section: blade bottom at about z 2.28, the reader's levels agree. |

Overall height 3,1 and tube length 2.3 were re-read.

## Sheet 05 02_4, up-and-down hand 05 02 00-3

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-4-1 | match | Ø4,4 plan (sure) | 4.4 outside z 0.9-1.4 | match | yes | |
| 13-4-2 | match 2,2 H7 +0,009 | 2,2 H7 +0,009 -> 2.200-2.209 (sure) | 2.204 | match | yes | |
| 13-4-3 | match | inner ring about 3,2 by scale (unsure) | 3.0 | can't tell | no | -0.2 is the scale accuracy; the sheet prints no size |
| 13-4-4 | match | 1,4 total; 0,5 boss (likely) | 1.4; ring z 0.9-1.4 | match | yes | |
| 13-4-5 | match | 0,9 blade at the boss (sure) | 0.9 | match | yes | |
| 13-4-6 | match 9,5 | 9,5 from the centre to the point where the dimension line ends; the dark blade changes to a thin grey line at that point (likely) | vertex at 9.5 | match | yes | |
| 13-4-7 | can't tell overall length | The plan shows the blade running on past the 9,5 extension line as a thin line to the "0,25" and "0,3" tip dimensions, much further: scaled on the 9,5 it is 14-15 mm, on the boss Ø4,4 it is 20 mm (the sheet is not consistent in scale; the 0,25 is underlined = not to scale). Not dimensioned (unsure) | box ymax 10.2 | can't tell (the sheet suggests longer than 10.2) | yes | The built tip is 10.2. Nothing on the sheet gives the length; the 11,7 and 9,5 stop at the end of the thick part. The up-and-down hand's true length would be the dial track's radius (not read in this batch). |
| 13-4-8, 9 | match | tip 0,25; thickness 0,3 (likely) | as stated | match | yes | |

## Sheet 05 02_5, seconds hand 05 02 01-1

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-5-1, 2 | match | 29,5; 10 (sure) | as stated | match | yes | |
| 13-5-3..5 | match | teardrop end 6,5 (the digit reads 0,5 or 6,5; with 10 and 3,5 it is 6,5); 1,7; neck 0,3 (likely) | as stated | match | yes | |
| 13-5-6, 7 | match | Ø3,2; raised boss "2,5" (sure) | 3.2; 2.5 | match | yes | |
| 13-5-8 | match 1,2 +0,05 | 1,2 +0,05 -> 1.200-1.250 (sure) | 1.2 | match (lower limit) | yes | |
| 13-5-9, 10 | match | 0,6 beside the boss; tip 0,2 | as stated | accepted, not re-read | yes | |
| 13-5-11 | can't tell | labels 0,5 / 0,3 / 0,4 / 0,3 / 0,5 along the section, stations unclear | | can't tell | yes | |

The collet (050201-2): the sheet has no drawing of it. Nothing to compare. Reader gave no item; agree.

## Sheet 05 02_12, dial 05 02 00-4 (title block also 127-556 04-162 / 05 04 01 11, struck)

Title block as read: Werkstoff Messingblech 1,3 with 1,2 handwritten over the 1,3; Din 1751 Ms58; 2:1; Arbeitspause 54; Rohmaß 1,3 x 110 x 110; "Eisenblech 1,3 gebondert" (an iron alternative, 1.3).

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-6-1 | match 103,6 -0,1 | "fertig 103,6 -0,1" (sure) | 103.55 | match | yes | |
| 13-6-2 | match 1,3 / 1,2 | Stärke 1,3 with 1,2 written over it, and the same in the title block (sure) | 1.2 | match | yes | In range of 1.3 too (+-0.1 not printed here, so fallback +-0.05: -0.1 fails against 1.3, so the written 1.2 is what decides). Both readings are on the sheet; the reader's conclusion stands. |
| 13-6-3 | match 6 | Ø6 at the centre (likely) | 6.0 | match | yes | |
| 13-6-4 | match 3,2 ; 23 | 3,2 (extension lines to the circle's sides at the "32"; they are not a slot) ; 23 +-0,03 (sure) | 3.2 at (0,23) | match | yes | |
| 13-6-5 | match 1,7 ; 23 | 1,7 across the circle, 23 +-0,03 (likely) | 1.7 at (0,-23) | match | yes | |
| 13-6-6..8 | match | screw holes 1,8 H7 +0,009 (1.800-1.809), Senkung 1,0 tief, three at 6 deg left of 12, 4 o'clock, 8 o'clock on the Ø101 circle; I found the larger ring at those three places (likely) | d 1.8 z 0.2-1.2; at r 50.5, 6.0 / 120 / 240 deg | match | yes | built d 1.800 is at the lower limit |
| 13-6-9 | match 1,1 | "1,1" across the inner ring of the 4 o'clock hole (unsure) | d 1.1 z 0-0.2 | match | yes | |
| 13-6-10 | match | small hole 6 deg right of 12, at the "6 deg" mark (likely) | (5.279, 50.223) | match | yes | |
| 13-6-11 | match | small hole left of 6: scaled 5.0-5.3 from the axis (likely) | (-5.016, -50.250): angle 5.70 deg | match | yes | no angle is printed there; the built angle differs from the 6 deg of the top pair by 0.3 deg (0.27 mm), within the scan |
| 13-6-12 | can't tell | "1" beside the 12 o'clock small hole with arrows, so Ø1 (likely); the other small hole not dimensioned | d 1.0 | match (Ø1,0, likely) | no (soft) | a "1" is printed with arrows at the upper pin hole; I read it as Ø1 |
| 13-6-13 | match | hand as the reader says (screws left of 12, pins right of 12 and left of 6) (likely) | plan x -> movement x, plan y -> -z: a proper rotation (no mirror) | match | yes | confirmed against placements: dialPin 050200-4's pin at x +5.28, z -50.22 |
| 13-6-14 | extra: no feet | The assembly shows a block ("Festsitz") on a post under the dial with a "16" screw; the dial has holes only (likely) | no feet on the dial | extra (posts separate) | yes | |

## Sheet 05 02_13 (this is another maker's dial)

Title block as read: no Wempe block. A. Lange & Söhne, Glashütte b/Dresden; "(B-) Chronometer-Zifferblatt", Zeichnung-Nr 1453/A, Werkstoff Eisen, 2:1, dated 9.6.44; handwritten: "Gültig für unsere Auftrag-Nr 14 767", numbering 5635-6250. The face is printed A. LANGE & SÖHNE. Agree with the reader that it is Lange's.

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 13-7-1..5 | mismatch x3, match x2 | sizes of another maker's dial (103; 1,5 thick; 3,2; 6,0; 2,2) (sure) | the Wempe dial's | not applicable (no part is built from this sheet) | no | A Wempe dial cannot "mismatch" a Lange sheet. These are a different dial, not a deviation. The page's Lange dial variant is traced from a photograph of Lange No. 5177 (CLAUDE.md), not from this drawing. |
| 13-7-6 | match 23 | "Mitte-Auf und Ab = 23 mm" is struck through; the replacement beside it is faint and illegible (about "22,5"?) (unsure) | | can't tell | no | the reader read it as 23,5 struck out and a surviving 23 |
| 13-7-7 | match 23 +-0,05 | "Mitte-Sekunde = 23 mm" struck through, the "(+-0,05)" kept; the new figure is faint ("2.." ) (unsure) | | can't tell | no | |
| 13-7-8 | not built | nothing of this sheet is a part in the measure files | | not built (no solid of its own) | yes | there is only the Wempe dial 050200-4 |

## Missed by the reader

| id | item | my reading | built | my verdict |
|---|---|---|---|---|
| 13-1-v1 | "0,1 Luft" under the dial | a part in the dial's underside, 0,1 clear (unsure which: the up-and-down wheel hub or the wheel) | udWheel top y 9.55 (0.8 under the dial 10.35); udPinion top 10.05 (0.3) | can't tell; if the wheel itself, mismatch by 0.7 |
| 13-1-v2 | "0,3" under the dial near the centre | 0,3 clear under the dial | udPinion top 10.05, 0.30 below the dial underside | match if it refers to the pinion (unsure) |
| 13-1-v3 | "0,2" at the UD hand over the dial (label "4 / 0,2" near the hand at the 3,2 hole) | gap between the hand and the dial top or the hand's thickness (unsure) | blade underside 11.85 vs dial top 11.57: 0.28 | can't tell |
| 13-1-v4 | "2,4" and "0,6" at the centre arbor, and "1" at the hour wheel | hour wheel thickness 1 (likely) | hourWheel y 6.615-7.615 = 1.0 | match |
| 13-1-v5 | "3" and "7" beside the post: block height 3 ; 7 = plate top to dial | 7 (likely) | dialPin y 6.65-11.45 | can't tell; not fixed to a face |
| 13-3-v1 | hour-hand cone direction against the pipe's (the reader said "fits") | see 13-1-9 | | match, 13 um over |
| 13-1-v6 | dial/hand clearance not in the reader's list: the minute-hand boss against the hour-hand top (see 13-1-11) | scaled 0.4-0.5 | 0.715 | mismatch (likely) |

## Summary of disagreements

1. 13-3-5 the hour hand's bore: narrowest Ø 4.4155 is 3.5 um over H7's 4.412. I call it a marginal mismatch.
2. 13-1-11 minute-hand boss to hour-hand top: the sheet shows 0,2 or 0,4 (scaled 0.4-0.5) and the model has 0.715. Likely mismatch, not "can't tell".
3. 13-7-1..5: these are Lange's drawing, no part is built from them; "mismatch" is the wrong class. Not applicable.
4. 13-7-6, 13-7-7: the 23s on 05 02_13 are struck out and unreadable; the reader's matches rest on a struck figure.
5. 13-1-3 and 13-1-13 (18,4 and the stud's Ø1,5): the scan does not carry enough to call match: can't tell.
6. 13-4-3 can't tell (the scaled 3,2 is within the scan accuracy of 3.0). 13-6-12: the "1" beside the upper pin hole reads Ø1, a match.
7. 13-4-7 the up-and-down hand's length: unresolved; the sheet's plan runs well past the 9,5 line (scaled 14-20 mm against 10.2 built), so a longer hand is possible. 13-1-12 the stud: 12,7 against 12.3, can't tell, leans -0.4.
