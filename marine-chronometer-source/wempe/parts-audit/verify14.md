# Batch 14 verification (motion work wheels)

Verifier, 3 Nov 2026. Sheets re-read on enlarged crops (E:/mc-video/wpa-audit/crops/v14_*). Measurements: r_wpa/measure/*.json, page/placements.json. Reader's items taken from batch14.items.tsv only.

General tolerances read: 05 02_7 and _9 "nicht eingetr. Toleranz +-0,1"; 05 02_10 "+-0,05"; 05 02_11 "+-0,03"; 05 02_6 and _8 none legible (fallback used). Scan scale: horizontal about 17.2-17.6 px/mm at 5:1, vertical about 16.7 (the scan is not uniform; this matters for scaled sizes).

## 05 02_6 (change wheel assembly)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-1-1 | match | 7 -0.1 (sure) | pipe box z 0..6.9 | match | yes | 6.9..7.0 |
| 14-1-2 | match | 3.05 -0.04 (sure) | cyl[4] 3.05 | match | yes | limits 3.01..3.05; at the top limit |
| 14-1-3 | match | 4.3 +0.1 (sure, arrows end on the pinion underside) | 6.9-2.6 = 4.3 | match | yes | lower limit 4.3..4.4 |
| 14-1-4 | match | 1 (sure) | z 0..1 | match | yes | accepted |
| 14-1-5 | match | 0.9 +0.2 (likely); drawn stub about 0.84 on scan | stub z 0..1.0 | match | yes | in 0.9..1.1 |
| 14-1-6 | match | foot about 3.05 (254 px wall to wall at 5x = 2.9-3.05; likely) | 3.05 | match | yes | |
| 14-1-7 | match | collar about 5.4 wide (470 px at 5x / 87), 0.5-0.6 high (likely) | 5.5, z 2.0..2.6 | match | yes | |
| 14-1-8 | match | wheel hole 4.2 (365/87; likely) | 4.2 | match | yes | |
| 14-1-9 | match | flare under the wheel, wheel countersunk at the underside (likely) | cone 4.2..4.66 | match | yes | form only, size unreadable |
| 14-1-10 | match | bore about 1.5 (likely) | 1.52 | match | yes | |
| 14-1-11 | match | pinion bore = pipe seat 3.05 (likely) | 3.05 | match | yes | |
| 14-1-12 | match | about 2.6 (likely) | 2.5 | match | yes | within scan |
| 14-1-13 | mismatch (7.2 vs 6.9) | pinion tips, no figure printed. Outer line in the plan 122 px (orig scan, rows 549-553, x 274.5..396.5). Scale A: wheel tips 21.05 = 370.5 px (150.5..521) gives 17.6 px/mm, so 6.93. Scale B: pipe 3.05 -0.04 = 52.5 px gives 17.3, so 7.05. Scale C: the vertical scale (7 -0.1 = 116 px, 16.7 px/mm) gives 7.3. Range 6.9..7.3 (unsure) | tips_d 6.8997 | can't tell (not a mismatch) | NO | The reader's 7.2 came from one scale (17.05) and the scan's own scale spread is wider than the 0.3 claimed. Two independent horizontal references (wheel tips, pipe) give 6.93 and 7.05, which bracket-touch 6.90 within +-0.15. The sheet prints no pinion size and no pinion count. Meshing check: change pinion centre 12.6 from the hour wheel (placements 050202-2 at (-10.912, 6.3) to the hour wheel at 0,0) = (18.9 + 6.3)/2 for m 0.35, 18 teeth, so the built pitch is right; the tips are the only unknown. Verdict: not refuted, not confirmed. |
| 14-1-14 | match | stack: wheel 1 above the foot, pinion from 2.6 up (likely) | placements 050202-1 y 4.35..5.35, -3 y 5.95..8.45, -2 y 3.35..10.25 | match | yes | 6.9 vs 7 within -0.1; pipe top 10.25 sits 0.1 under the dial (10.35) |
| 14-1-15 | not built (chamfer on pipe top) | 9x crop of the top: the pipe top is square at both outer corners; the leader of 05 02 02-2 ends there, plus an ink blot inside the right wall at the bore, not at a corner (likely) | square top corner | match (no chamfer drawn) | NO | Nothing on the sheet to build. The "chamfer" is the leader's arrowhead and a blot. Remove from the not-built list. |
| 14-1-16 | can't tell | "Laufsitz auf Anrichtstift": the leader ends on the pipe's bore wall at the foot (5x crop), so it is the pipe bore running on the setting-up pin (stud), not the wheel on the pipe. "aufschlagen zum Festsitz" belongs to the pinion on the 3.05 seat (sure from the leader). No size for the stud fit (sure) | bore 1.52 vs seat 3.05 | can't tell | partly | Agree can't tell, but the reader's "wheel running fit" is the wrong reading: the running fit is the pipe bore (built 1.52, stud not in this batch). |

## 05 02_7 (change wheel)

Title block: Messingblech 1.2 DIN 1751 Ms 58 federhart; 5:1 and 1:1; Rohmass 1.2 x 22.5 x 22.5; "nicht eingetr. Toleranz +-0,1"; 127-556.04-004 / 040202-1. (The reader's tsv carries none of this.)

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-2-1 | match | Z = 56 (sure) | 56 | match | yes | |
| 14-2-2 | match | 21.05 (+-0.02) hand over a struck 21.30 +-0.02 and a struck 21.5 (sure) | 21.0496 | match | yes | |
| 14-2-3 | can't tell | d = 20.16 (sure) | no field | match, by the tooth pair I computed at r 10.08 | disagree (stronger) | Outline lines crossed with the pitch circle (r 10.08) give tooth 0.555, gap 0.576: sums to pi*20.16/56 = 1.1310 |
| 14-2-4 | match | dg 19.03 (sure) | 19.0291 | match | yes | |
| 14-2-5 | match | t = 1.131 (sure) | 1.1310 | match | yes | |
| 14-2-6 | match | "Zahnstaerke 0,55 - 0,56" (sure) | tooth 0.555 at the pitch circle | match | yes | re-derived independently |
| 14-2-7 | can't tell | f = 0.52 (sure of the figure; meaning unsure) | gap flanks radial (0.83 deg from the x axis at r 9.51 and 10.08), bottoms flat arcs | can't tell | yes | See f/l note below |
| 14-2-8 | match | 4.2 +0/-0.1 (sure) | 4.2 | match | yes | at upper limit |
| 14-2-9 | match | fertig 1.0, blank 1.2 ref (sure) | 0..1 | match | yes | |
| 14-2-10 | extra | countersink not on this sheet; shown on assembly 05 02_6 (sure) | cone 4.2..4.66, 0.4 | extra (drawn on the assembly only) | yes | |

## 05 02_8 (hour wheel assembly)

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-3-1 | match | 8.2 -0.1 (sure) | 8.2 | match | yes | at the upper limit |
| 14-3-2 | mismatch | 5.2 -0.1 (sure). Crop at 4x: the 5.2 arrows run from the wheel underside (the foot line) to a horizontal extension line that starts on the collar's top shoulder (hatched collar top, right side), the same line the roughness mark sits on. Scaled: 5.07 on the scan against 8.13 for the 8.2, so the collar top is 5.2 from the foot (4.2 above the wheel top). Left and right sections agree. | cyl[1] z 1.0..3.585 | mismatch, drawn 5.1..5.2, built 3.585, delta -1.5..-1.6 | yes | Attachment is clear, not a dimension to nothing. |
| 14-3-3 | match | 1 -0.1 (sure) | 0..1 | match | yes | |
| 14-3-4 | match | 4.4 r6 +0.023/+0.015 read as 4.415..4.423 (sure on the figures, the 4.4 is hand-written); "Kegel 1:70" with its arrow on the tube wall | top 4.419; collar end 4.4849 | match at the top; likely | yes | The direction of the taper (wider toward the collar) is unsure on the scan |
| 14-3-5 | match | collar Ø about 8.1 (4x crop radius 273 px / 66 px per mm = 4.07) | 8.0 | match | yes | |
| 14-3-6 | match | bore about 3.54-3.6 (likely) | 3.62 | match | yes | cannon tube 3.6 runs in it (050503-3 cyl 3.6): clearance 0.02 |
| 14-3-7 | match | spigot radius 3.06 through the wheel, flush at the foot (likely) | 6.0, z 0.4..1.0 | match | yes | |
| 14-3-8 | match | "vernietet" at the foot side (likely) | cone 6.0..6.46 | match | yes | |
| 14-3-9 | match | plain top (likely) | square | match | yes | |

Stack check for 14-3-2 (placements.json, hns hourPipe 050203-2, hourWheel 050203-1, dial 050200-4, hourHand 050200-2, cannon 050503-3). Hour pipe foot and wheel underside y 6.615; wheel y 6.615..7.615; collar as built y 7.615..10.2 (top 3.585 above the foot); dial y 10.35..11.57 with a centre hole Ø6.0 (dial cyl[0]); hour hand y 11.05..14.15, hub Ø4.8; pipe top y 14.815. A collar at 5.2 would end at y 11.815 and is Ø8: it would run through the dial's 1.2 thickness (the dial's hole is Ø6) and past the dial top 11.57 and the hand's bottom 11.05. Built 3.585 leaves 0.15 under the dial. So the model's 3.585 is fitted to the dial position; the sheet says 5.2. Verdict stands. Whether the dial or the pipe is at fault cannot be settled here (dial hole Ø6 equals the wheel spigot Ø6 coincidentally; the dial's height is not on this batch's sheets). The cannon does not enter: its Ø3.6 tube runs inside the bore for z 2.4..5.9 and 6.7..10.8 of its own frame.

## 05 02_9 (hour wheel)

Title block: Messingblech 1.2 DIN 1751 Ms 58 federhart; Rohmass 1.2 x 21 x 21; tolerance +-0.1; blank 20.2 -0.1 "gedreht" (20.1 struck); tips 19.7 hand over a struck 20.0 +-0.02, "geschnitten"; 1.05 +-0.03 gedreht, fertig 1.0; Arbeitspause 13.

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-4-1 | match | z = 54 (sure) | 54 | match | yes | |
| 14-4-2 | match | 19.7 (sure) | 19.6987 | match | yes | |
| 14-4-3 | match | dg 17.89 (sure) | 17.889 | match | yes | |
| 14-4-4 | match | d 18.90, t 1.099 (sure) | pi*18.9/54 = 1.0995 | match | yes | |
| 14-4-5 | can't tell | f = 0.5 | built tooth at r 9.45: 0.5, gap 0.6 | match (f = tooth thickness at pitch, likely) | partly | See f/l note |
| 14-4-6 | match | 6 with a lower tolerance -0.1 (likely) | 6.0 | match | yes | at the upper limit |
| 14-4-7 | match | fertig 1.0 (sure) | 0..1 | match | yes | |
| 14-4-8 | match | 0.4 deep, 30 deg (likely) | cone 6.0..6.46 | match | yes | |
| 14-4-9 | match | symmetric | | match | yes | |

## 05 02_10 (up-and-down wheel assembly)

Title block: no Werkstoff, 5:1, "nicht eingetr. Toleranz +-0,05".

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-5-1 | match | 2.2 r6 +0.019/+0.012 (sure) | 2.2155 | match | yes | 2.212..2.219 |
| 14-5-2 | match | 1.4 (sure) | z 7.6..9.0 | match | yes | |
| 14-5-3 | match | 2.8 (sure; arrows wheel top to hub top) | 9.0-6.2 | match | yes | |
| 14-5-4 | match | 0.7 (likely) | 6.9..7.6 | match | yes | and the 0.7 collar is the remainder 2.8-1.4-0.7 = 0.7 |
| 14-5-5 | match | collar 0.76 scaled; = 0.7 by the remainder | 0.7 | match | yes | within +-0.05 as the remainder |
| 14-5-6 | match | 5.2 from wheel underside to the foot (sure) | z 0..5.2 | match | yes | |
| 14-5-7 | match | 1 -0.1 (sure) | 0..1 | match | yes | |
| 14-5-8 | match | tube 3.39 (116 px / 34.2 at 2x) | 3.4 | match | yes | |
| 14-5-9 | match | collar 7.7 (radius 132/34.2) | 7.7 | match | yes | reader's 7.5 was low; built agrees better than he said |
| 14-5-10 | match | 2.87 | 2.8 | match | yes | |
| 14-5-11 | match | about 1.5 | 1.52 | match | yes | |
| 14-5-12 | match | wheel hole through, flared underside (likely) | 5.2, cone 5.2..5.66 | match | yes | |
| 14-5-13 | match | five spokes (sure) | five at 72 | match | yes | |

## 05 02_11 (up-and-down wheel)

Title block: Messingblech 1.2 DIN 1751 Ms 58 federhart; 5:1; "nicht eingetr. Toleranz +-0,03".

| id | reader | my reading | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 14-6-1 | match | Z = 120 (sure) | 120 | match | yes | |
| 14-6-2 | match | D 34.33 (sure) | 34.3281 | match | yes | |
| 14-6-3 | match | d 33.454, t 0.878 (sure) | pi*d/Z 0.8758 | match | yes | sheet's own 0.002 slip |
| 14-6-4 | match | dg 32.57 (sure) | 32.5696 | match | yes | |
| 14-6-5 | can't tell | l = 0.40 | built tooth at r 16.73: 0.400, gap 0.476 | match (l = tooth thickness at pitch, likely) | partly | See f/l note |
| 14-6-6 | match | five at 72 (sure) | five | match | yes | |
| 14-6-7 | match | 1.7 -0.2 (8x crop, the sign is a minus) = 1.5..1.7 | 1.6 | match | yes | |
| 14-6-8 | match | 28.2 +0.2 (likely) | 28.3 | match | yes | |
| 14-6-9 | match | 10.5 -0.2 (8x crop, minus) = 10.3..10.5 | 10.4 | match | yes | |
| 14-6-10 | match | 5.2 H7 +0.012 (sure) | 5.2 | match | yes | lower limit; H7 for 5.2 is 0..+0.012 |
| 14-6-11 | can't tell | 35.3 -0.2 with its arrows on the outermost solid circle, outside the chain-dashed tooth circle: the turned blank diameter before the teeth are cut (the other wheels' blanks are 0.45-0.5 over the tips; this is 0.97 over: unsure) | tips 34.3281 | can't tell | yes | A blank size; the finished wheel has no such feature |
| 14-6-12 | match | Radstaerke 1.0 (sure) | 0..1 | match | yes | |
| 14-6-13 | extra | not drawn here (sure) | cone 5.2..5.66 | extra | yes | |

## The f and l entries (all three tooth tables)

Built tooth thickness at the pitch circle, from the exact outlines crossed with r = d/2: hour wheel 0.500 (f = 0.5), up-and-down wheel 0.400 (l = 0.40), change wheel 0.555 (f = 0.52, but the hand note on the same sheet says Zahnstaerke 0.55-0.56 which corrects it). f and l are therefore very probably the tooth thickness at the pitch circle (also f or l is about 0.455 of t on all three). Unsure, because no sheet says so, but both agree with the model exactly and the third has a hand correction pointing at the built value. So 14-4-5 and 14-6-5 are better recorded as likely match.

## Items the reader missed

| id | sheet | item | my reading | built | verdict |
|---|---|---|---|---|---|
| 14-2-v1 | 05 02_7 | material, blank | Messingblech 1.2 DIN 1751 Ms 58 federhart; Rohmass 1.2 x 22.5 x 22.5; blank 21.5 "gedreht" (tips later cut to 21.05) | not measurable (blank) | can't tell |
| 14-2-v2 | 05 02_7 | general tolerance | +-0,1 | used above | note |
| 14-4-v1 | 05 02_9 | blank 20.2 -0.1 gedreht, 1.05 +-0.03 gedreht | likely | blank; not built | can't tell |
| 14-4-v2 | 05 02_9 | material and general tolerance | Ms 58 federhart, +-0.1 | | note |
| 14-5-v1 | 05 02_10 | general tolerance +-0.05 and "Laufsitz auf Anrichtstift" at the wheel's bore region, "vernietet" at the foot | likely | bore 5.2, wheel on the hub | can't tell (no fit size) |
| 14-6-v1 | 05 02_11 | material (Ms 58 federhart 1.2) and general tolerance +-0.03 | sure | | note |
| 14-6-v2 | 05 02_11 | hub arc 10.5 -0.2 and window 28.2 +0.2 are measured across the centre | likely | built 10.4, 28.3 | match |
| 14-3-v1 | 05 02_8 | the hour pipe's two roughness marks on the top and the collar top, the lower on the foot | likely | not modelled (no field) | can't tell |

## Summary of disagreements

- 14-1-13 (pinion tips): reader's mismatch not upheld. Two horizontal references give 6.93 and 7.05 against 6.90 built; only the vertical scale gives 7.3. Can't tell; the sheet prints no figure.
- 14-1-15 (chamfer, not built): refuted. The pipe top is square; the mark is a leader and a blot.
- 14-1-16: the running fit is the pipe bore on the setting-up pin, not the wheel on the pipe.
- 14-2-3, 14-4-5, 14-6-5: can't tell is too weak. Tooth thickness at the pitch circle is 0.500 and 0.400 against f 0.5 and l 0.40, and 0.555 against the hand note's 0.55-0.56. Likely matches.
- 14-3-2 (collar 5.2 against 3.585): confirmed. The 5.2 runs from the wheel underside to the collar top. A drawn collar would run through the dial (hole Ø6, dial y 10.35..11.57) and up under the hour hand (y 11.05): the model's 3.585 is a clearance fit under the dial, not a drawing size.
- 14-5-9 (collar 7.7): scan says 7.7, not 7.5; still a match.
