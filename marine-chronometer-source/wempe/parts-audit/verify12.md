# Batch 12 verification: the barrel (05 07_1, 3, 4, 5, 6, 7, 8, 9, 10)

Verifier's file. Sheets re-read enlarged (crops in E:/mc-video/wpa-audit/crops/b12_*). Built values from `r_wpa/measure/*.json` and `page/placements.json`. "AR" = accepted, not re-read.

## Findings that change the picture

- **Later sheet.** For the arbor, 05 07_8 (28.1.43, assembly) is later than 05 07_9 (4.7.41, part). Re-read, 08 repeats the same sizes as 09: body 12 (13.3 dia), necks about 5 and 3 (scaled 4.9 and 2.84), chamfers 0.8 axial by about 2.07 radial (end face about 9.2), 40.2 long, ball 5, square 10. So 08 changes none of the body, chamfer, neck or pivot sizes. It adds the hook stand-out 0.5 -0.05, the hook at 15 deg, a dome on the ball ("Kugel poliert"; 09 draws a cone point) and a cross hole whose dashed lines run the full body height (through), where 09 and 01 show it blind, 6 deep, with a drill point.
- **Drum and lid (rev. 20.4.48) against the arbor sheets (1941/43).** The 1948 stack is: floor boss 3.1 above the outer floor (06), a 0.05 gap, the body, a 0.05 gap (04), the lid boss 3.3 below its face (07), and 18.1 overall. That leaves a body of 18.1 - 3.1 - 3.3 - 0.1 = 11.6, which is the built 11.58. The sheets 01, 08 and 09 draw 3.1 + 12 + 2.9 = 18. So 12-1-11, 12-1-13 and 12-8-3 are mismatches against the arbor's own sheets, but the built body agrees with the later drum and lid sheets. The sheets disagree with each other by 0.4. Record both.
- **Measure plan is the dial-side view, unmirrored.** From placements.json, the drum's steg and hook block (050700-1, 050701-3) fall in the dial-side plan (x right, -z up) as a pure rotation of -80 deg of the measure plan (steg -80.1, hook block -79.5). A mirror fails (119 deg against 38 deg). So +Z looks from the dial side, and for the ratchet and arbor frames (identity groups, local z = world y) the plan from +Z is the dial-side view with the hand preserved.

## 05 07_1 Federhaus kompl. (13.4.41)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-1-1 | match | 41.5 (likely) | 41.6 | match | yes | +0.1 inside 06's 41.5..41.6 |
| 12-1-2 | match | 38.5 (sure) | 38.5 | match | yes | AR |
| 12-1-3 | match | 39.2 (likely) | 39.2 rim | match | yes | AR |
| 12-1-4 | match | 1.5 (likely) | 1.55 | match | yes | AR |
| 12-1-5 | match | 13.3 (sure) | 13.3 | match | yes | re-read, 13.3 on 01, 08, 09 |
| 12-1-6 | mismatch | "15,8 +-0,1" in a rounded box (sure) | 15.63 | mismatch against 01, but superseded | agree, with a note | 01 is 1941 (floor 1.2, lid 1). 1948 06/07 give 18.1 - 1.25 - 1.3 = 15.55 (seat 1.2 deep: 15.65), so the built 15.63 follows the later sheets. Ledger should say "1941 sheet mismatch, later sheets match" |
| 12-1-7 | match | Zugfeder 15 (likely) | 15.0 | match | yes | AR |
| 12-1-8 | can't tell | no strip thickness on 01 (sure) | - | can't tell | yes | only the width 15 and the space 15.8 are given; no sheet in this batch gives the mainspring's thickness |
| 12-1-9 | match | floor 1.2 (likely) | 1.25 | match | yes | AR |
| 12-1-10 | match | lid 1 (likely) | 1.2 | match | yes | AR, inside 07's 1.3 -0.1 |
| 12-1-11 | mismatch | 12 incl. chamfers (sure) | 11.58 | mismatch | yes | but see the later-sheet finding above |
| 12-1-12 | match | 3.1 (likely) | 3.15 | match | yes | the 0.05 gap of 04 |
| 12-1-13 | mismatch | 2.9 (likely) | 3.35 | mismatch | yes | same cause as 12-1-11; the 1948 lid boss 3.3 + gap 0.05 gives 3.35 |
| 12-1-14 | match | 18 (likely) | 18.08 | match | yes | AR |
| 12-1-15 | match | plan: slot at 9 o'clock, M2.6 at 45 deg up-left (CW of the slot) in a view of the open end with the boss rings visible (likely) | 44.8 deg CW from the open end | match | yes | built from +Z (floor side) the hole is 205.4 deg against the slot's 160.6, CCW seen from the floor, so CW from the open end |
| 12-1-16 | match | 6 and 0.5 (likely) | chord 5.98 x 0.5 | match | yes | AR |
| 12-1-17 | can't tell | 2 / 2.5 / 0.5 / 0.4 (unsure) | - | can't tell | yes | see also 12-5-17 and 12-5-18 |
| 12-1-18 | mismatch | in the end view the hook line passes through the centre 15 deg off the vertical flat normal; the second line (30 deg) is a tangent, not the axis (likely) | hole along the square's diagonal, 45 deg | mismatch | yes | 15 or 30 deg, never 45 |
| 12-1-19 | can't tell | see below | | partly settled | partly | see below |
| 12-1-20 | can't tell | 12 from the axis to the screw 103 (unsure) | - | can't tell | yes | the screw is not in this batch |
| 12-1-21 | match | 5 deg (unsure) | 4.5 | match | yes | the 4.5 follows from 0.095 radial over 1.2; 0.5 deg is exactly the 30' limit |

**12-1-19 settled in part.** Re-read: the "5" under the ball end is the ball pivot's length (tip to shoulder, 4.7 mm scaled; 08's "5" is the same), not the ball beyond the plate. The ball projects about 1.4 mm beyond the Unterplatte's outer face (scaled): built 1.6 (050702-1 y max 4.95 against 050802-1 y 3.35), which matches within the scan. The plates read 3.3 each (built 050802-1 3.35, 050805-1 3.3), and the span between the inner plate faces is 22.3 (built 22.35). The "10" is the square projecting from the bridge's outer face (scaled 9.8; built 9.6 beyond y -25.65). The 2.5 beside the ratchet (104) is its thickness (built 2.65, gap 0.05 to the bridge). The 0.6 is lid face to bridge (built 0.62). The "0.1" I can't place. So the stack matches where it can be read (my verdict match, unsure), and the reader's "can't tell" was too cautious about the 5 and 10.

## 05 07_3 Sperrrad

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-2-1 | match | 16 (sure) | 16 | match | yes | |
| 12-2-2 | match | 14.1 -0.2 (sure) | 14.0 | match | yes | re-read |
| 12-2-3 | match | 11.1 -0.2 (sure) | 11.0 | match | yes | re-read |
| 12-2-4 | match | face line 10 deg from the radial through the tip; the 1.2 is the tangent offset (likely) | face line at 1.2 from the axis, 9.87 deg | match | yes | sin 10 x 7.05 = 1.22 |
| 12-2-5 | match | 12.5 circle (likely) | 12.49 | match | yes | AR |
| 12-2-6 | match | 2.65 -0.1 (sure) | 2.65 | match | yes | |
| 12-2-7 | mismatch | 2.7 H7 +0.009, Kegel 1:100 (likely) | 2.6975 at the large end, 2.671 small | mismatch | yes | 2.5 micron under the lower limit at the large end: a miss on the printed fit, of no consequence; the arbor's square is 2.700 +-0.002 |
| 12-2-8 | mismatch | the tip is on the vertical centreline through the square's centre; the square's flats are axis-aligned (sure) | tips at -9.87 + 22.5k deg; flat normals at 45 + 90m | mismatch | yes | no tip lies on a flat normal; the nearest is 9.87 deg away. Tooth pitch 22.5 x 4 = 90, so every tip has the same offset |
| 12-2-9 | can't tell | see below | | match (unsure) | **disagree** | see below |
| 12-2-10 | can't tell | 6.4 circle (unsure) | hub 6.23 | can't tell | yes | |

**12-2-9.** Two ways to fix the hand. (a) Built: from +Z (the dial-side view, shown above) each tooth's radial wall faces CCW, and the ramp rises CCW to the tip. The click nose is CCW of a tooth's wall and bears on it: the click blocks CCW turning of the ratchet in the dial-side view. (b) Sheet: the tip at the top has its face line on its left (CCW) and the 12.5 ramp arc running CW from it with falling radius, so the ramp rises CCW to the tip and the wall faces CCW. Same hand. The sheet's view side: the 2.7 H7 dimension sits at the top face of the section view, which in first-angle projection is the face seen in the plan, so the plan face is the large end of the 1:100 taper. Built large end is at z -25.7, the +Z face (the drum side, where the arbor's square is thick). So the sheet's plan is the same face as the measure plan. Verdict: hand match, unsure (the taper's large end is not stated outright; the arbor's square also puts the large end towards the body).

## 05 07_4 Federhaus mit Deckel

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-3-1 | match | 18.1 -0.15 (sure) | 18.08 | match | yes | |
| 12-3-2 | match | 0.05 +0.06 (likely) | 0.05 | match | yes | |
| 12-3-3 | match | 0.05 (likely) | 0.05 | match | yes | |
| 12-3-4 | match | 3.05 -0.1 (sure) | 3.05 | match | yes | |
| 12-3-5 | match | 7.85 +-0.05 (likely) | 7.8 | match | yes | |
| 12-3-6 | match | 2.05 -0.1 (unsure) | 2.0 | match | yes | AR |
| 12-3-7 | can't tell | 0.6 -0.1, its arrow near the lid face / arbor shoulder (unsure) | | can't tell | yes | |
| 12-3-8 | match | 5 deg (likely) | 4.5 | match | yes | |
| 12-3-9 | can't tell | note | | can't tell | yes | |

## 05 07_5 Federhausrohling (a deep-drawn blank)

12-4-1 to 12-4-5: re-read 43.6, 38.2, 20.5, 14 and 8 dia, 3 and 3.9, "gezogen", "ueberdreht". They describe a blank to be turned, not the finished part; the finished sizes lie inside the blank. The reader's "match" is a stretch: "not applicable" is the better label (the sheet gives blank sizes, not part sizes). Disagree on the label only; no finding.

## 51 07_6 (title block 05 07 01-1) Federhaustrommel

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-5-1 | match | 41.6 -0.1 (sure) | 41.6 | match | yes | |
| 12-5-2 | mismatch | 39.2 s6 +0.059 / +0.043 (sure on the text) | 39.2 | mismatch | yes | the page draws nominal sizes; the fit is 0.043 above the built |
| 12-5-3 | match | 38.5 +0.1 (sure) | 38.5 | match | yes | |
| 12-5-4 | match | 18.1 -0.15 | 18.08 | match | yes | |
| 12-5-5 | match | 1.2 -0.1 | 1.20 | match | yes | AR |
| 12-5-6 | match | 5 deg | 4.5 | match | yes | 30' at the limit |
| 12-5-7 | match | 13.8 -0.05 | 13.78 | match | yes | AR |
| 12-5-8 | match | 3.1 -0.1 | 3.10 | match | yes | AR |
| 12-5-9 | match | 1.25 -0.1 | 1.25 | match | yes | |
| 12-5-10 | match | 8 / 12 | 8 / 12 | match | yes | |
| 12-5-11 | match | the 45 deg is printed on 04 at the floor boss; its 8/12 and heights 3.1 - 1.25 = 1.85 give 42.8 deg from the face (unsure) | 47.2 deg half angle = 42.8 from the face | match | yes | the dimensions win over the nominal angle; the printed 45 and the sizes disagree by 2 deg on the sheet itself |
| 12-5-12 | match | 4.5 +0.1 | 4.55 | match | yes | |
| 12-5-13 | match | 9.05 +-0.05 | 9.05 | match | yes | |
| 12-5-14 | match | plan: slot at 9, hole CW 45 deg up-left, open-end view (likely) | 44.8 CW | match | yes | as 12-1-15 |
| 12-5-15 | match | M2.6 core | 2.1129 | match | yes | AR |
| 12-5-16 | match | 2 +0.05 | 2.025 | match | yes | |
| 12-5-17 | match | 0.8 +0.05 (was 0.5) | 0.8 | match | yes | AR; the pocket in the floor is 2.025 tangential by 0.8 radial from r 18.33 |
| 12-5-18 | mismatch | 0.95 +0.15 (new; 18.3 +0.02 struck) (likely) | 19.25 - 18.33 = 0.92 | mismatch | yes | 0.03 under the lower limit 0.95; also the pocket's outer edge is 19.13, not the wall at 19.25, so the 0.8 and 0.95 can't both hold as built (0.12 lip). The sheet's two dimensions don't attach clearly |

## 05 07_7 Federhausdeckel

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-6-1 | mismatch | 39.2 r6 +0.050 / +0.034 (sure) | 39.2 | mismatch | yes | as 12-5-2 |
| 12-6-2 | match | 39.39 | 39.39 | match | yes | |
| 12-6-3 | match | Rondell 40 x 3.5 | 39.39 x 3.3 | match | yes | |
| 12-6-4 | match | 1.3 -0.1 | 1.2 | match | yes | at the limit |
| 12-6-5 | match | 3.3 -0.1 | 3.3 | match | yes | |
| 12-6-6 | match | 4.5 +0.1 | 4.55 | match | yes | |
| 12-6-7 | match | 8 -0.2 / 12 -0.2 | 8 / 12 | match | yes | |
| 12-6-8 | match | 45 deg | 43.6 half angle | match | yes | boss height 2.1 on a 2.0 radial: 46 deg from the face |
| 12-6-9 | match | 5 deg | 4.5 | match | yes | |
| 12-6-10 | match | narrow notch 2 +0.05 (sure) | 2.025 | match | yes | |
| 12-6-11 | mismatch | 18.3 +-0.02 (sure on 18.3; tolerance likely) | 18.328 | mismatch | yes | 0.008 over; marginal |
| 12-6-12 | match | wide notch 2.7 +0.1 | 2.75 | match | yes | |
| 12-6-13 | mismatch | wide notch depth "2 +0.2", arrows from the notch bottom to the plan's outer circle, which is the 39.39 flange (scaled 1.8; plan circle 405..945 px = 39.4) (likely) | bottom at r 17.649: 2.045 from r 19.695, 1.951 from r 19.6 | match | **disagree** | the plan is the 39.39 flange (the notch is cut in it), so the depth is taken from r 19.695: 2.045 is inside 2..2.2. The reader measured from r 19.6 (the face's r6 circle). Marginal either way |
| 12-6-14 | match | notches opposite | 180.2 | match | yes | the narrow notch (160.6 deg) is also over the drum's slot (160.6 deg), as 04 shows the narrow notch at the 9 o'clock slot |
| 12-6-15 | can't tell | note | | can't tell | yes | |

## 05 07_8 Federkern kompl. (28.1.43)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-7-1 | match | 40.2 (sure) | 40.2 | match | yes | |
| 12-7-2 | match | ball "5": tip to the shoulder (likely) | 4.98 | match | yes | |
| 12-7-3 | match | square "10" (likely) | 10.0 | match | yes | |
| 12-7-4 | mismatch | hook stands out 0.5 -0.05 (likely); scaled on 01 and 08: about 0.5 | 0.25 (hook box z max 6.9008 - 6.65) | mismatch | yes | the end view's 0.5 is the stand-out (an arrow from the body circle to the tab); 01's side section shows 0.5 too. Built is half |
| 12-7-5 | mismatch | the hook axis through the centre is 15 deg off the vertical flat normal (likely) | 45 deg | mismatch | yes | |
| 12-7-6 | can't tell | the end view is on the left of the side view: in first-angle projection that is the view from the right, the square end. Hook CCW of the vertical by about 15 deg (unsure) | | can't tell | yes | the hook's frame against the arbor's isn't fixed by the files (no sign for the arbor's local x); and the model is 45 deg anyway |
| 12-7-7 | mismatch | 01 and 09: blind, 6 deep, drill point; 08 (later): dashes run the full body height (likely) | through, 13.6 | mismatch against 01/09, match against 08 | agree, with a note | the sheets disagree: the later one draws a through hole. The built hook pin is 6.25 long (z 0.655..6.9), so a through hole leaves its lower part empty |
| 12-7-8 | match | 1:70 / 1:100 | 1:71 | match | yes | AR |

## 05 07_9 Federkern (4.7.41)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-8-1 | match | 44.2 raw | 40.2 | match | yes | |
| 12-8-2 | match | 13.3 | 13.3 | match | yes | |
| 12-8-3 | mismatch | 12 incl. chamfers (sure) | 11.58 | mismatch | yes | see the later-sheet finding |
| 12-8-4 | mismatch | chamfer end face 9 dia on 01 (the "9" with arrows across the end face), 08 scaled 9.2 (likely; the "9" on 09 itself is ambiguous) | 10.0 | mismatch | yes, certainty down to likely | the reader's "sure" rests on 09, where the arrows don't clearly span the end face; 01 and 08 confirm it |
| 12-8-5 | mismatch | 22.5 deg; 0.8 axial; scaled on 08: 0.78 axial x 2.07 radial (likely) | 45 deg, 1.65 x 1.65 | mismatch | yes | |
| 12-8-6 | mismatch | 2 dia x 6 deep, drill point (sure on 09 and 01) | through | mismatch | yes | but see 12-7-7: 08 draws it through |
| 12-8-7 | mismatch | 5, a tight tolerance near 0.02 (likely) | 4.48 | mismatch | yes | scaled 4.8-4.9 on all three sheets; 0.5 under |
| 12-8-8 | mismatch | 6.7 +-0.05 (sure) | 6.77 | mismatch | yes | 0.02 over |
| 12-8-9 | mismatch | 3 (likely), tolerance small | 2.88 | mismatch | yes | |
| 12-8-10 | match | ball pivot 5 finished | 4.98 | match | yes | |
| 12-8-11 | mismatch | 5 dia, 3.5 long (likely) | 4.48, 3.94 | mismatch | yes | |
| 12-8-12 | mismatch | 4 dia (likely); length scaled 2.9-3.0 (10x crop: 195 px at 67 px/mm) | 3.88, 2.92 | diameter mismatch (-0.12); length match | **partly disagree** | the reader's "-0.2 long" is not borne out: 2.92 against 2.9-3.0 scaled |
| 12-8-13 | match | 2.7 +-0.002 (sure) | 2.700 | match | yes | |
| 12-8-14 | match | 15 raw | 12.93 | match | yes | |
| 12-8-15 | match | | | match | yes | AR |
| 12-8-17 | match | 22.2 +0.1 (the boxed figure; the lower deviation is not legible) | 22.29 | match | yes | within 0.01 of the limit |
| 12-8-16 | can't tell | 10 deg on 01 near the neck (unsure) | | can't tell | yes | |

## 05 07_10 Federhausring (7.4.41)

| id | reader | my reading (certainty) | built | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 12-9-1 | not built | brass tube 42 x 2, raw 42 x 2 x 20, ring 38 bore, 19 high (sure) | | not built | yes | the drum is one deep-drawn piece 41.6 / 38.5 / 18.1 with a floor; no built part is a loose ring. The sheet is the earlier three-part barrel (ring, with a 39.2 counterbore for the lid), superseded by 05 07 01-1 |
| 12-9-2 | not built | 39.2 counterbore (boxed, with a fit) (likely) | | not built | yes | the drum has a 39.2 seat but is not this part |
| 12-9-3 | not built | 7.5 step, 5 deg (likely) | | not built | yes | the drum's seat is 1.2 deep, not 7.5 |

## Items the reader missed

| id | sheet | item | sheet reading | built | verdict |
|---|---|---|---|---|---|
| 12-1-v1 | 05 07_1 | plates "3,3" each; span 22.3 | 3.3 / 3.3 / 22.3 (likely) | 050802-1 3.35, 050805-1 3.3, inner faces 22.35 | match (belongs to the plates' batch; noted here) |
| 12-1-v2 | 05 07_1 | hook pin in the section: "3" and "0.5" over the pin | the "3" is ambiguous (the pin is 2 on 08 and 09) | pin 2.0 | can't tell |
| 12-1-v3 | 05 07_1 | the "5" under the ball end is the ball's length, not its protrusion | 5 | 4.98 | match (settles part of 12-1-19) |
| 12-8-v1 | 05 07_9 / 08 | ball tip: a 60 deg point on 09, a polished dome ("Kugel poliert") on 08 | dome (later) | dome of 2.88 dia | match to 08 (unsure) |
| 12-8-v2 | 05 07_8, 09 | the necks' end chamfers (about 0.5) | small 45 deg chamfers (unsure) | none read on the necks in cylinders/cones | can't tell |
| 12-6-v1 | 05 07_7 | "Scharfe Kante leicht brechen" | | no break drawn | can't tell (as 12-6-15) |
| 12-2-v1 | 05 07_3 | material Messingblech 3, DIN 1751 Ms58 | | not geometry | can't tell |

## Summary of disagreements with the reader

1. **12-2-9** (the ratchet's hand): can be settled. The built tooth hand matches the sheet's (wall facing CCW, ramp rising CCW to the tip, the plan face being the large end of the taper). Match, unsure.
2. **12-6-13** (the wide notch's depth): match, if measured from the flange's 39.39 circle that the plan draws (2.045 within 2 +0.2). The reader's -0.05 is from r 19.6.
3. **12-8-12** (the 4 neck's length): match (2.92 against 2.9-3.0 scaled); the diameter 3.88 against 4 stays a mismatch.
4. **12-8-4** (chamfer end diameter): certainty "likely", not "sure"; 01 and 08 give it.
5. **12-7-7 / 12-8-6** (cross hole): the sheets conflict (01 and 09 blind 6 deep; the later 08 through). Built is through, so it matches the later sheet.
6. **12-1-6, 12-1-11, 12-1-13, 12-8-3**: the mismatches are against the 1941 and 1943 arbor sheets; the 1948 drum and lid sheets (04, 06, 07) give a body of about 11.6, which is what is built. The sheets disagree by 0.4. 12-1-6's spring space 15.63 follows the later sheets (15.55 to 15.65).
7. **12-1-19**: mostly readable (the "5" is the ball pivot's length, ball protrusion 1.4 against built 1.6, 10, 0.6 and 22.3 match), not "can't tell".
8. **12-4-x**: label the blank sheet "not applicable", not "match".
9. 05 07_10: no built part corresponds (agree); the sheet is the earlier ring barrel.
10. Mainspring thickness: no sheet in this batch gives it (only the width 15 and the space 15.8).
