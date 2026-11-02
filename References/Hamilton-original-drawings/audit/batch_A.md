# Batch A audit: 42073 fourth wheel, 42072 fourth pinion, 42015 fusee wheel, 42022 fusee arbor

Method: blind read of each sheet first (crops at 1:1 to 3x, plus pixel scans of the full-resolution sheets to check silhouettes), then the built-part JSON, then the transcriptions and `tools/recipes/hamilton.py` / `js/hdims.js`. Inches unless stated. "Sure" = read on the sheet and checked by a pixel scan or by arithmetic between views; "likely" = clear reading, one plausible alternative; "unsure" = could not settle.

Scales used for checks: 42073 and 42015 and 42072 are 5:1 (about 1500 px/in at 300 dpi), 42022 is 4:1 (1200 px/in).

---------------------------------------------------------------------------

## 1. 42073-2-01 Fourth wheel, complete with pinion (flat part: wheel at origin, Z from 0)

| # | drawing reads | sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | 75 teeth, module .2800 mm, same cutter as 42071 | sure | 75, m .28 | MATCH | tooth form not on the sheet (a freehand wavy sketch only): built is core.js cycloidal, estimated |
| 2 | OD .8566 +.0010/-.0020 | sure | .8564 | MATCH | -.0002, inside the -.0020 |
| 3 | rim inside dia .700 (dimension between the rim's inner arcs) | sure | arcs r .350 | MATCH | |
| 4 | hub dia .290 | sure | arcs r .145 | MATCH | |
| 5 | spoke width .037 at the rim end, .048 at the hub end (spoke tapers; the edges converge to the rim) | sure | window arc ends: rim ±.0185 (=.037), hub ±.0241 (=.048) | MATCH | |
| 6 | spoke angles 75 deg (up) and 72 deg (down), between spoke centre lines, from the horizontal spoke | sure | spokes at 0, 75, 146, 217, 288 deg | MATCH in angles | the other two spokes are not dimensioned: built 71 deg apart (estimate, the sheet does not settle it) |
| 7 | the horizontal reference spoke is on the LEFT of the centre (180 deg); upper spoke 75 deg round from it, lower 72 deg | sure | reference spoke at 0 deg (right), 75 up, 72 down | MISMATCH (mirror) | built is the sheet's plan mirrored left to right; as a wheel seen from the other face it is the same part, but the brief's frame (x right as drawn) says 180 deg. Fix: mirror x or put the reference spoke at 180 deg with 75 deg clockwise (up) and 72 deg counter-clockwise (down). Sure of the sheet; the effect is only orientation |
| 8 | thickness .035 +0/-.002 | sure | .035 (z 0 to .035) | MATCH | |
| 9 | bore through the hub = the pinion's collar, drawn as .100 (arrows at the top and bottom of the collar where it passes through the wheel) | sure | bore .100 through | MATCH | the 1 Nov re-read is right: .100 is a diameter |
| 10 | countersink on the wheel's bore at the face the collar is riveted over (side view: the bore opens in a chamfer at the left face; the collar's end stands about .005 proud and is flared into it) | likely | none | NOT BUILT | size not dimensioned; roughly .010-.015 wide, .005 deep from the crop (unsure). The riveting is the joint, so a maker would want it |
| 11 | runout not to exceed .001 | sure | note in recipe | MATCH | |
| 12 | RIVET PART NO. 42072 (pinion riveted through the hub), 24K gold plate wheel only, brass | sure | noted | MATCH | |
| 13 | the side view's pinion: leaf body drawn about .150 dia and .223 long, collar at about .242 from the top tip, stem about .060, lower stem to .435 from the lower tip | likely (measured on the scan, +-.005) | n/a | CAN'T TELL / note | these do not agree with 42072-1-01's .1290 x .185, collar at .280 from the tip: the 1941-43 view shows the older pinion; 42072 was redrawn 1957/63 and decides the pinion. Do not take the pinion's proportions from 42073's section |
| 14 | spoke edge corners at hub and rim: sharp, no fillets drawn | likely | sharp arcs + lines | MATCH | |
| 15 | 5 spokes, no other hole or feature | sure | none | MATCH, no EXTRA | |

---------------------------------------------------------------------------

## 2. 42072-1-01 Fourth pinion (turned, Z 0 at the top pivot's tip)

Lengths first (all measured on the sheet by pixel, 1500 px/in, and agree to .003): .060 top pivot; .445 from the shoulder's start (.060) to the leaves' lower end (.505); .520 from the shoulder start to the lower stem's lower end (.580); .300 from the collar's top face (.280) to .580; .260 from the leaves' top face (.320) to .580; .360 lower pivot (.580 to .940); .940 overall. So collar .040 (.280-.320), leaves .185 (.320-.505), lower stem .075 (.505-.580). The built part has exactly these z levels, and I agree with the builder's 1 Nov correction that .260 is not the leaves' length.

| # | drawing reads | sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | top pivot .0311 +0/-.0002, .060 long, domed tip, polish | sure | d .0311, z 0-.060 | MATCH | tip dome: built is a flat end (no dome); the sheet draws a small rounded tip, size not given. NOT BUILT (minor) |
| 2 | top shoulder: flat step at .060 then a 60 deg cone out to the stem; 60 deg is the included angle | likely | flat .0445 at .060, cone to .0565 at .0704 (half angle 30) | MATCH | cone length on the sheet looks .010-.016; built .0104. Tolerable. The flat's diameter .0445 is read from the .0445 leader; the sheet's flat looks about .040-.044 wide |
| 3 | stem silhouette: parallel, .060 wide by pixel scan (+-.002) from the cone base to the collar, no step visible | sure for "parallel, no step"; the value .0565/.0583 is unsure | .0565 z .0704-.25, then .0583 z .25-.28 | CAN'T TELL / possible MISMATCH | the sheet draws no step at z .25. Two dimensions (.0565 +-.0003 near the top, .0583 +-.0003 at the base) on one parallel silhouette read as a slight taper .0565 at the shoulder to .0583 at the collar (.0018 over .21, invisible at 5:1). A built step at z .25 has no source; a taper from .0565 to .0583 between the cone base and the collar would be the drawn reading. Likely |
| 4 | .0445 +-.0005 leader at mid-stem: arrows on two thin solid lines inside the stem (about .036-.038 apart on the sheet, running from the cone base down about .087) | unsure | .0445 only as the cone's flat | CAN'T TELL | the inner lines may mean the underturn (a relief turned to .0445) or the cone's flat edges carried down; the sheet does not settle it. The "UNDERTURN" leader ends at the stem's foot, at the collar |
| 5 | collar .1000 +-.0003, .040 long (.280-.320) | sure | d .100 z .289-.32 plus chamfer | MATCH | |
| 6 | collar top chamfer: a trapezoid, diagonals from the collar's corner inward about .017 radially by .011 axially (so the top flat is about .066 dia); .0990 arrowed at the top of the collar | likely | 45 deg x .009: cone .082 to .100, z .280-.289 | MISMATCH (small) | the builder's note says "chamfered to a .0990 flat" but the solid has a .082 flat; the sheet suggests a flat near .066. The .0990's arrows sit on the collar's outer edge near its top (a diameter of the collar's top band, a hair under .1000) rather than on a flat inside a chamfer: likely. Sure that built .082 does not equal .0990; unsure of the true chamfer size |
| 7 | leaves: tip dia .1290 +.0005/-.0010, 10 leaves, m .28 | sure | tip .129, root .0814 | MATCH (tips) | leaf form not on the sheet. The sheet draws solid lines at .110 spacing through the leaf zone (the pitch circle, 10 x .28 mm = .1102: sure) and dashed lines .066 apart running through the collar and the leaves (hidden detail, size from the pixel scan; unsure what it is: it may be the root circle, which would make the root about .066 not .0814) |
| 8 | THIRD WHEEL marked on the leaves (a bracket and a dashed box at the leaves' lower part) | sure | note only | MATCH | meshing height is not dimensioned |
| 9 | lower stem: .060 +-.002 dia (arrows both sides), .075 long, 60 deg cone at its foot to the pivot | likely | d .060 z .505-.5666, cone to .0445 at .58, then pivot .0311 | MISMATCH (small) | the sheet's cone at the foot goes from .060 down to the .0311 pivot: the built cone ends at .0445 then a flat step to .0311 at .58. The .0445 on this stem is a second dimension (arrows on inner lines inside the .060 stem, like the top one) not the cone's end. Sure the cone meets the pivot; likely it ends at about .0311-.0445 |
| 10 | lower pivot: .0311 +0/-.0002 at the shoulder, tapering continuously to .0280 +0/-.0005 at the tip, .360 long, domed tip, polish | likely (taper read from the silhouette: the width falls steadily down the .36, not in a step) | .0311 z .58-.90, then .0280 z .90-.94 (a step at .9) | MISMATCH | built has a step where the sheet draws a taper. The builder marked the step position "unsure"; the sheet settles it as a taper over the whole .360. Fix: a cone from d .0311 at .58 to d .0280 at .94 (or at the tip); end rounded |
| 11 | overall .940, top pivot .060, shoulder start .060 | sure | .94 | MATCH | |
| 12 | material drill rod, polish at five places, scale 5:1, dates 7-31-57, 9-11-63, redrawn | sure | noted | MATCH | |

---------------------------------------------------------------------------

## 3. 42015-2-01 Fusee wheel (Z 0 at the left face = the stepped-recess face, up to the rim land's right face; .053 hole at +Y)

Right-face profile read and confirmed (pixel scans of the section): left face at 0; the rim land .100 thick between dia 1.400 and 1.460; the tooth ring outside dia 1.460 to 1.613 stands .005 lower (.095); the web inside the 1.400 recess is .045 thick (floor at .045); the central disc inside dia .740 stands .005 lower than the rim land (.095); the boss .2995 dia stands to .150; bore .2300 through.

| # | drawing reads | sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | 90 teeth, m .4400, OD 1.613 +.001/-.002 | sure | 90, tips 1.613 | MATCH | tooth form estimated |
| 2 | dia 1.460 +0/-.005: where the right face steps .005 down for the tooth ring | sure | z .095 for r .73-.757 | MATCH | |
| 3 | dia 1.400 +-.002: the recess wall, rim land .030 wide radially | sure | inside cyl 1.400 z .045-.100 | MATCH | |
| 4 | web .045 +0/-.002 (left face to the recess floor) | sure | floor at z .045 | MATCH | |
| 5 | dia .740 +0/-.005, disc face .005 below the rim land | sure | cyl .74 z .045-.095 | MATCH | |
| 6 | boss .2995 +0/-.0003, to .150 from the left face (right side) | sure | r .1498 to z .15 | MATCH | |
| 7 | bore .2300 +.0003/-0, corner broken both sides | sure | .23 through | MATCH | the broken corner (size not given) is not built: NOT BUILT, minor |
| 8 | .053 +-.001 hole at r .6100 above the centre, through the .045 web | sure | .053 at (0, .61), z 0-.045 | MATCH | |
| 9 | left face: pocket .600 +-.003; floor at about .057 from the left face (pixel scan: .058 on the 5:1 section; the .040 web dimension implies .095-.040 = .055); the pocket mouth has a chamfer about .015 wide that ends at x=.0145 | sure (floor depth), likely (chamfer) | .600 pocket only .015 deep (floor z .015) | MISMATCH (major) | built is .040 too shallow. The builder's own words ("web .040: the .600/.320 floor to the central disc's face") need a floor at .055; the .015 is the chamfer's depth mistaken for the pocket's. Fix: the .600 floor at z .055 |
| 10 | ring floor between dia .470 and dia .320 about .005-.008 deeper than the .600 floor (so about .060-.063; ".005" arrowed on this step) | sure for "a groove .005 deeper"; likely for exact size | .470 pocket floor at z .050, .320 floor at .055 (bridging) | MISMATCH | built has the three diameters as a stair .015/.050/.055; the sheet has the .600 floor at .055, the .470-.320 ring .005 deeper (.060), and the central ring (r .115 to .160) back at .055 |
| 11 | central ring on the left, bore to dia .320's inside, at the pocket-floor level (.055); nothing stands out toward the left face | likely | a ring r .115-.1498 standing out to z 0 (left face plane), .055 proud of the groove floor | EXTRA | no source shows a left-hand boss; the .2995 is only drawn on the right |
| 12 | the .320 is not dimensioned with a tolerance; ".470 +-.005", ".600 +-.003" | sure | .320 (no tol) | MATCH | |
| 13 | tooth phase against the hole: the plan's vertical centre line (through the .053 hole's centre) passes through a tooth gap (the root between two teeth) in the sketch | likely | tooth centre at 89.5 deg, gap at 91.5: at 12 o'clock there is a tooth | MISMATCH (phase, about 2 deg) | the builder noted "angle against the teeth not given": the sketch gives it, as a gap on the line. The sketch is freehand so the reading is likely, not sure |
| 14 | CORNER (lower rim): the corner at the rim land's inside edge at dia 1.400, right face | sure | sharp | NOT BUILT (size not given) | |
| 15 | material brass, 24K gold plate, scale 5:1 | sure | noted | MATCH | |

---------------------------------------------------------------------------

## 4. 42022-2-01 Fusee arbor (turned, Z 0 at the left end with 42018; square at the far end; 4:1)

Lengths: .375 left end to the body step; .260 +-.002 from the left bearing's start to the step (so the 42018 spigot is .115); .360 from the step to the collar's right face (.735); collar .045 (.690-.735); .310 from the cross hole's centre to the collar's right face (hole centre at .425); .060 plain, .080 knurl band (.795-.875); .875 from the step to the shoulder (1.250); .410 shank (to 1.660); .340 square (to 2.000). All agree with the built z levels.

| # | drawing reads | sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | spigot .0500 +-.0002, .115 long, 42018 (the wind indicator pinion) pressed on; its bore .0490 | likely | .050, z 0-.115 | MATCH | 42018's bore .0490 against the .0500 spigot: interference .001 (the .0490 has no printed tolerance) |
| 2 | left bearing .1695 +0/-.0003, .260 long (.115-.375), small chamfer at its left end | sure | .1695, z .115-.375 | MATCH | the left-end chamfer not built (size not given) |
| 3 | body left of the collar .2295 +0/-.0003, .375-.690 | sure | .2295 | MATCH | small chamfer at the step's left corner (about .01, not given) NOT BUILT |
| 4 | collar .316 +-.001 x .045 | sure | .316, .69-.735 | MATCH | |
| 5 | cross hole .036 +0/-.001, drill and taper broach for 42020, at .425 | sure | .036 at z .425, axis X | MATCH (place, size) | |
| 6 | cross hole axis: seen end-on in the side view, which also shows the square's corner edge down the middle, so the hole axis runs along a diagonal (corner direction) of the square; the end view's square has its corners on the axes | likely | hole axis X, square flats parallel to the axes (flat faces X) | MISMATCH (45 deg) | built hole is normal to a flat; the sheet's is along a corner. Fix: turn the square 45 deg (corners on X) or the hole 45 deg. The sheet doesn't give the hole's angle to anything else |
| 7 | body RIGHT of the collar: dia .2500 +-.0002 from the collar's right face (.735) all the way to the shoulder at 1.250; the knurl marks only on the .080 band | sure (pixel scan: width .2507 at four places between the band and the shoulder; .2286 left of the collar; the .2500 arrows stand mid-body, outside the band) | .2295 at .735-.795 and .875-1.25, .250 only over the band .795-.875 | MISMATCH (major) | .0205 dia too small over .060 + .375 of length. Fix: .2500 from .735 to 1.250. Consequence: nothing with a .230 bore (the winding ratchet 42013, the fusee wheel) can be to the right of the collar; both seat on the .2295 body between .375 and .690 |
| 8 | straight knurl about 100 teeth/inch on the .080 band | sure | note only | MATCH (not cut) | |
| 9 | chamfer at the .250 shoulder's outer corner (about .02 at 45 deg, drawn) at 1.250 | likely | none | NOT BUILT | size not given |
| 10 | shank .1695 +0/-.0003, 1.250-1.660 | sure | .1695 | MATCH | |
| 11 | ".005 AT 45 deg" is at the shank's right end, the corner of the .1695 shank where it meets the .145 round (the double line at 1.660 with the V run-out of the square's flats) | likely | a .005 x 45 chamfer cone at the far end z 1.995-2.000 | MISMATCH | built put it at the end. The detail view (".010", 45 deg) is the transition at 1.660 too. Fix: chamfer at 1.660, not at the end |
| 12 | end: a domed (rounded) end, radius about .0725 (same as the .145 round's radius), the tip at 2.000, dome starting .073 earlier; the square's flats cut through it | sure (the end view of the arc is clear; radius from the pixel scale +-.005) | flat end with a .005 chamfer | MISMATCH | NOT BUILT: the dome. Fix: a spherical end of radius .0725 on the round |
| 13 | round for the square .145 +.005/-0, 1.660-2.000; square .110 +.004/-0 across flats, corners left as the round | sure | .145 / square .110 | MATCH | square starts about .02 after 1.660 (the run-out V), built from 1.660 |
| 14 | overall 2.000 | sure | 2.0 | MATCH | |
| 15 | material drill rod, polish bearings and shank, 4:1 | sure | noted | MATCH | |

---------------------------------------------------------------------------

## Disagreements with the transcription / builder's interpretation (who is right, how sure)

1. 42022: "the body running on at .2295 after the knurl: likely" (hdims.js comment) and transcription item 17 ("body diameter large .2500 knurled", the knurl only .080 wide). The sheet is right: .2500 over the whole length from the collar to 1.250. Sure (pixel scan).
2. 42015: left-face pocket depths (.600 about .015, .470 .055, .320 .060). I read .600 floor at .055, a .005 deeper groove between .470 and .320, the central ring back at .055. Sure for the .600 depth (two measures: pixel scan .057, the .040 web arithmetic .055); the builder's own sentence contradicts the numbers. There is also no left boss (built EXTRA).
3. 42022 item 13/23: ".005 at 45 deg" read as an end chamfer; the sheet has it at the shank/round step; the end is domed. Likely for the step, sure for the dome.
4. 42072 item 10 (lower pivot step at .9, "unsure"): the sheet draws a taper. Likely.
5. 42072 item 7 (.0990 as a chamfer flat): see row 6; the built flat is .082, the sheet's chamfer is larger and the .0990's arrows are on the collar's side near the top. Likely.
6. 42072 items 4-6, 10 (which stem diameter where): the builder left it unsure and built a step at .25. The sheet's silhouette is parallel, so no step: the two stem numbers suggest a slight taper. Likely.
7. 42073 items 9/10 (angles), 7/8 (spoke widths): I agree; but the built wheel is mirrored (reference spoke on the right).
8. 42015 tooth phase: "its angle against the teeth not given" is not quite right; the sketch has a gap on the centre line through the hole. Likely.
9. 42073's side view shows a different (older) pinion body than 42072; not noted by the transcription.

## Builder estimates the sheets settle (or don't)

- Settled by the sheet: 42072 lower pivot taper (not a step); 42022 body diameter right of the collar; 42015 left pocket depth; 42022 where the .005 chamfer is; 42022 end dome; 42015 gap on the hole's centre line (likely).
- Not settled (still estimates): tooth forms on all three wheels and the pinion; the undrawn two spokes of the 42073 (71 deg each); 42072 stem diameter placement (taper or two sections), the .0445 inner lines and the underturn; the dashed .066 hidden lines in the pinion (root circle?); chamfer sizes; the countersink in the 42073 bore; which part the 42020 taper pin holds.

## Joints and fits (so the parts can be put together from the drawings alone)

- Fourth wheel on the pinion (42073 on 42072): the wheel's bore .100 on the collar .1000 +-.0003 (a press/riveting fit; the wheel's bore tolerance isn't printed). The wheel (.035 thick) lies on the leaves' top face (z .320 from the pinion's tip); the collar is .040 long (.280-.320), so it stands .005 proud on the wheel's far face, and is riveted over into a chamfer/countersink on the wheel's bore (not dimensioned). Wheel runout to the pinion .001. The pinion's leaves (.1290, 10) mesh with the third wheel (the sheet marks the leaves' lower part THIRD WHEEL); the wheel's 75 teeth mesh with the fifth (escape) pinion, not drawn. 42073 and 42071 share one cutter (module .28).
- Fusee wheel on the arbor (42015 on 42022): wheel bore .2300 +.0003/-0 on the arbor body .2295 +0/-.0003, a sliding fit, clearance .0005 to .0011; the wheel's boss (.150 long, .2995 dia) rides on the body between the step (.375) and the collar (.690), a span of .315. The sheet doesn't say where the wheel sits in that span or whether it is against the collar. The .036 cross hole at .425 (.050 right of the step, .310 from the collar's right face, axis along a corner of the square) takes taper pin 42020, which pins something on the .2295 body; the wheel boss is .150 and the winding ratchet 42013 (bore .230, from the builder's sheet) another .075, both fit within .315. The collar (.316 x .045) is a stop on the right. The .053 hole at r .610 in the wheel's web is the sustaining spring's pin (builder's reading, likely).
- 42018 (wind indicator pinion) pressed on the arbor's .0500 spigot (.115 long): bore .0490, interference about .001; the arbor's left bearing .1695 x .260 runs in the train bridge or plate (not on these sheets).
- Fusee arbor's right end: .1695 shank (.410) runs in a bearing; the square .110 across flats (.340 with the dome) takes the key; the winding stop is not on this sheet.
- Fusee wheel teeth (90, m .44) mesh with the centre pinion (14 leaves); the left pocket (.600 x .055 deep) and its stepped groove are the seat of a part not named on the sheet (the sustaining wheel is the obvious candidate: check against 42009).

## Recommended fixes (most important first)

1. 42022: body dia .2500 from z .735 to 1.250 (not .2295 over .735-.795 and .875-1.25). Re-seat the fits that assumed .2295 there.
2. 42015: .600 pocket floor at z .055 (not .015); groove .470-.320 at .060; central ring r .115-.160 at .055; remove the left boss ring r .1498 standing to z 0.
3. 42022: end domed R about .0725 (replace the flat end chamfer); put the .005 x 45 deg chamfer at the 1.660 corner of the .1695 shank.
4. 42072: lower pivot a continuous taper .0311 to .0280 over .360 (no step at .9); cone at the stem's foot down to the pivot, not to .0445; rounded pivot tips.
5. 42072: remove the step at z .25 (a taper .0565 to .0583 or a constant stem); fix the collar's chamfer (built .082 flat is neither .0990 nor the sheet's larger one) after a closer trace.
6. 42022: orient the square 45 deg to the cross hole (hole along a corner).
7. 42073: mirror the plan (the reference spoke at 180 deg); add the countersink to the bore.
8. 42015: put a tooth gap on the +Y axis with the hole (tooth phase), likely.
9. Chamfers not given (42022 steps, bore corner on 42015): note as estimates.
