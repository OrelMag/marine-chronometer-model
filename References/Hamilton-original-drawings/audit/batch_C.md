# Batch C audit: 42168 barrel, 42169 cap, 42170 barrel arbor, 1-WD-265 mainspring end

Method: blind read of each sheet at 2-6x crops (scale of each view taken from its own printed dimensions), then the built JSON, then the transcription and recipe. Inches unless stated; 1 in = 25.4 mm. "Sure" = digits and attachment clear; "likely" = attachment read from the drawing, one reading fits best; "unsure" = two readings left.

Headline: the barrel's two outside diameters are reversed in the solid (and the transcription); the barrel's and cap's centre feature on the outer face is a V-groove, not a countersink; the cap's flange is .030 (not .036) and its holes are .036 with a 45 deg countersink to .058 (not .038 plain); the small .055 hole is at the wrong angle; the arbor body is not a plain .520 cylinder.

---------------------------------------------------------------------
## 1. 42168-2-01 Mainspring barrel (built key `barrel`)

Axis horizontal in the section. Floor (hatched, thick) at the LEFT with the centre boss on its inside; open end at the RIGHT with the larger-diameter lip carrying the tapped holes. Plan (right view) is seen from the open end.

| # | drawing reads | how sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Overall length .700 +-.002 | sure | .700 | MATCH | |
| 2 | **Body OD 1.650 +-.003** (left dimension; its extension lines touch the body's top and bottom edges, level with the floor end) | sure (the 1.650 line starts on the body edge; the lip stands proud of it at the right, 342 vs 368 px in the crop) | 1.710 for Z 0 to .620 | **MISMATCH** | built is the reverse of the sheet. Diff .060 dia = .030 radial = .762 mm over .620 length |
| 3 | **Lip OD 1.710 +-.003** at the open end (the plan's 1.710 line is at the outermost circle, the lip) | sure | 1.650 for Z .620 to .700 | **MISMATCH** | same reversal; the transcription (items 4, 5) has it reversed too. The lip is the thicker end of the wall: ring r .750 to .855 (.105) at the open end, .075 (.750 to .825) on the body. The tapped holes at r .7875 sit in the lip with .0675 outside them, so this is the only reading that gives them metal |
| 4 | Lip length .080 (upper dim, step to open end) and ".090 +0 -.005" (lower dim, same step) | sure for both printed; they disagree | .080 | CAN'T TELL | measured on the sheet: top lip 72 px = .080, bottom lip 77 px = .085 at 904 px/in. .090 +0/-.005 allows .085-.090. Unsettled by this sheet. Cap check: lip length does not enter the cap stack (cap sits on the end face); only matters for the outer step |
| 5 | Inside dia 1.500 +.002/-0 | sure | 1.500 from Z .060 | MATCH | |
| 6 | Floor .060 +-.001 | sure | .060 | MATCH | |
| 7 | Boss end .100 +.002/-0 from the outer face | sure | .100 | MATCH | |
| 8 | Boss OD .340 at the boss end, 45 deg cone down to the floor's inside face (the 45 deg leader continues the cone line; cone is .040 axial x .040 radial) | likely | cone d .340 (Z .100) to .420 (Z .060) at 45 deg | MATCH | consistent with the cap, same drawing arrangement |
| 9 | Bore .2300 +.0003/-0 | sure | .230 from Z .025 to .090 | MATCH (bore) | see 10, 11 for its two ends |
| 10 | **Outer face: V-groove 60 deg included (30 deg flanks), .025 deep, centred on dia .320.** Evidence: .320 is dimensioned between dash-dot extension lines through the two V tips (not between the cone's edges); the "60 deg" and "30 deg" labels measure the same V from both sides; ".025" has one arrow on the face and one on the V's apex line; V triangle drawn about .021-.025 deep and .019 wide at the face | likely (the dimensioning style is unambiguous; the exact half-width at the face is only read from a thin drawn triangle) | a plain countersink cone from the bore (d .230) out to d .320, Z 0 to .025 (60.9 deg to the axis) | **MISMATCH** (feature type) | the built cone removes a ring .045 radial; a V-groove 60 deg x .025 deep at pitch dia .320 removes only a narrow groove (about .029 wide at the face). Not the same shape |
| 11 | **.010: a 45 deg break of the bore's mouth on the OUTER face** (the face line continues across the bore and a second line sits .010 inside it: the chamfer's two edge-on circles; a small diagonal from face to bore wall at the bore's top and bottom) | likely | no chamfer at the outer mouth; a .010 x 45 deg cone at the boss-end mouth (d .23 to .25, Z .090 to .100) | **MISMATCH** (placed on the wrong end) | "CORNER" leader points at the boss-end bore edge (break corner, no size). The .010 dimension arrows sit at the outer face (distance face to the second line = .010 to .0115 measured) |
| 12 | .025 dimension (floor, lower part) | = V depth (item 10), not a floor step | not a floor step; cone depth .025 | see 10 | transcription "floor step .025, unresolved" is answered: it is the V's depth |
| 13 | 5 tapped holes .0340-130, close fit, on dia 1.575, equally spaced, one at 12 o'clock (plan), through the lip end face; drawn about .100 deep (thread shown over about .09) | sure (count, pitch, one at top); depth likely | 5 holes d .0257 at r .7875, Z .600-.700, angles 90+72k | MATCH | tap-drill .0257 = .034 - 1.0825/130 exactly. Depth .100 is read off the drawn thread; fine |
| 14 | Anchor rivet hole .080 dia (rivet 42042, finished flush with the surface), axis radial at the bottom (-Y in plan), at .365 from the floor's outer face | sure | d .080 at (0,-1,0), Z .365 | MATCH | the section shows the rivet's head on the INSIDE of the wall (wider block on the inner surface) and the hole flaring at the outside; a countersunk-outside/headed-inside rivet is drawn, i.e. the barrel hole may have a recess or flare. Not dimensioned: CAN'T TELL |
| 15 | **Small hole .055 +0/-.003 dia, centre .140 from the floor's outer face, AXIS PARALLEL TO Y (drawn as two vertical lines through the wall), located .520 +-.010 from the plan's vertical centre line** (the .520 extension line is a dash-dot centre line between the .055 lines, centre at .523) | likely (the lines are straight vertical in the plan; same style as the rivet, which is also drawn vertical at x = 0) | d .055 at Z .140, axis radial at 210 deg (up-left to down-left direction (-0.866,-0.5,0)) | **MISMATCH** (place and direction) | on the sheet the hole is at x = -.520 (left of the vertical centre line); a vertical hole at x = -.520 meets the OD (r .825-.855) at asin(.52/.855) = 37.5 deg to 39 deg from the rivet, i.e. at about 232 deg (7:45 o'clock). Built is at 210 deg: 22 deg off, about .33 in of arc. The bottom detail (outside view of the OD, rivet and small crosshair) agrees independently: its offsets (about .58 in of arc and .22 in in Z, at its own scale taken from the .225 difference of .365 and .140) give 39 deg |
| 16 | **.520 +-.010 locates the .055 hole (item 15), not the rivet** | likely | transcription and recipe flag it "unsure"; builder put the rivet at r .52 (transcription item 13) in the notes, built correctly at 0 | answers the open question | |
| 17 | "CORNER" leader in the plan (second one) | unsure | the builder read a rectangular notch in the bore wall at 8 o'clock and did not cut it | NOT BUILT (probably nothing to build) | in the crop the "notch" is the jagged break line ending the partial section plus the CORNER leader pointing at the corner where the .055 hole meets the OD: most likely a break-corner note for the hole's edge (no size). No wall notch is dimensioned and none shows in the section. The built part has no notch: consistent |
| 18 | Concentricity note: OD and ID concentric with the centre hole | sure | n/a | MATCH | |
| 19 | 24K gold plate; cast yellow brass | sure | same | MATCH | |

Derived checks: wall .075 (body), .105 (lip); inside height between inner faces .640 (floor inner .060 to open end .700); the rivet at Z .365 is exactly the mid-point of the boss-to-boss inside length (.100 to .630 in barrel coordinates, centre .365), see Joints.

### Disagreements with the transcription (42168.md)
- Items 4, 5 (OD 1.710 body, lip 1.650 stepped DOWN): wrong. Sheet: body 1.650, lip 1.710 stepped UP (sure). Recipe (`barrel`: `od`=1.710 for the body, `lipD`=1.650) copies it. The "lip for the cap" wording is also wrong: the cap's 1.500 spigot goes in the bore, the cap flange (1.650) sits on the end face inside the 1.710 lip's outline.
- Item 11 / verification note: ".320 is the diameter of the chamfer's edge, 60 deg cone": the sheet dimensions a V-groove's centre line, and the ".010 land at the bore's inside corner" is the outer mouth chamfer (see rows 10, 11). Likely, not sure.
- Item 14/15 (.055 hole in the floor at 8 o'clock; .140 "from the face"): the hole is in the WALL at Z .140 (the transcription's "in the floor" is wrong; the recipe drills it through the wall correctly) and its place is given by the .520 (row 15, 16), which the transcription lists as the rivet's radius (item 13: wrong, likely).
- Item 17 (wall notch): probably not a feature (row 17).
- Item 9: ok. Item 16 (.090 +0/-.005): right that it is the lip length at the lower edge; the sheet really shows both .080 and .090, unresolved.

### Builder estimates the sheet settles
- ".520 +-.010: what it locates" settled: the .055 hole's offset from the vertical centre line (likely).
- "The wall notch (drawn, no size)": not a feature (likely).
- "Lip .080 or .090": NOT settled; measured 72 px (.080) at the top and 77 px (.085) at the bottom in the same drawing; the .090 +0/-.005 dimension and the 3:1 redrawn figures disagree. Choose .085 (middle of .085-.090 and .080+): within tolerance of both only if .080 has about +-.005 (it has none printed).
- Tapped hole depth .100: supported by the drawn thread length (about .09-.10).

---------------------------------------------------------------------
## 2. 42169-2-01 Barrel cap (built key `barrelCap`)

Plate vertical, axis horizontal. Left face = the outer face (V-groove, countersunk holes); spigot and boss toward the right.

| # | drawing reads | how sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Flange OD 1.650 +-.003 | sure | 1.650 | MATCH | |
| 2 | Spigot dia 1.500 +0/-.001, concentric with the centre hole (leader) | sure | 1.500 (at the upper limit) | MATCH | |
| 3 | Plate .060 +-.001 | sure | .060 | MATCH | |
| 4 | **Flange thickness .030 +-.001** (dimension at the bottom of the section, outer face to the step; the same step at the top is .030 too on the scale: 45 px against the plate's .060 = 90 px) | sure | .036 (Z 0 to .036) | **MISMATCH** | .006 in = .152 mm too thick; spigot step is then only .024 long in the built part instead of .030 |
| 5 | **".0360 +-.0005" is the HOLE diameter** (a vertical dimension across the hole drawn in the flange at the top, between the hole's two edge lines; hole centre line dashed at r .7875) | sure that it is vertical-oriented and spans the drawn hole (arrows at the hole's two edges, not between faces) | taken as the flange thickness; holes built d .038 | **MISMATCH** | hole dia .0360 +-.0005, clearance .002 over the .0340 screw |
| 6 | **".058" = diameter of the 45 deg countersink at the outer face** (vertical dimension from the hole's top edge to its bottom edge at the face, 87 px = .058; the flare goes from .058 at the face to .036 over .011 depth, 45 deg label) | likely | no countersink | **NOT BUILT** | answers "what .058 spans": not the flange, the countersink's outer diameter. Depth at 45 deg = (.058 - .036)/2 = .011 |
| 7 | 5 holes equally spaced on dia 1.575; in the half plan the holes are at 180 deg (on the horizontal centre line, left), 108, 252 deg (and 36, 324 on the missing half) | sure | built at 90 + 72k deg | MATCH (pitch); phase differs | the cap's sheet puts a hole at 9 o'clock, the barrel's at 12 o'clock: the part is rotated into register on assembly (any multiple of 72 deg from a hole to a hole); no fault, just record that the two sheets are in different frames. The built cap pattern is the barrel's, not the sheet's, which is why they register in the builder's assembly |
| 8 | Boss end .100 +.001/-0 from the outer face; boss flat top dia .340; 45 deg cone down to the plate (inside face) | sure / likely | .100; cone d .340 to .420 over Z .060-.100 at 45 deg | MATCH | |
| 9 | Bore .2300 +.0003/-0 | sure | .230 | MATCH | |
| 10 | **V-groove at dia .320, 60 deg included, .025 deep** (as the barrel) | likely | countersink cone d .230 to .320, Z 0 to .025 | **MISMATCH** | as barrel row 10 |
| 11 | **.010 x 45 deg mouth chamfer on the outer face** | likely | chamfer at the boss end instead | **MISMATCH** | as barrel row 11 |
| 12 | "BREAK ALL CORNERS" | sure | recipe notes it; no radii | n/a | no size on the sheet |
| 13 | Rim: the outer edge of the flange on the outer face has a 45 deg edge ("45 deg" label at the flange's outer corner) | likely | none | NOT BUILT (minor) | size not given; it is the break the note asks for |
| 14 | Material rolled yellow brass, Scovill #187; 24K gold plate | sure | same | MATCH | |

### Disagreements with the transcription (42169.md)
- Item 5: ".0360 +-.0005 is the rim/flange thickness": wrong (it is the hole diameter). ".030 +-.001": right, but it is the flange thickness, not "the plate edge's outer height step". ".058": the countersink diameter, not a flange height. Recipe flags it "partly unsure" and built .036 flange: wrong.
- "Hole and counterbore sizes not given": they are given (.0360, .058, 45 deg).
- Item 8: V-groove and mouth chamfer as the barrel (likely).

### Builder estimates the sheet settles
- "Screw holes' size: not given (estimated .038, plain)": settled: .0360 +-.0005, countersunk 45 deg to .058 at the outer face.
- "The flange's .0360 and the .058: partly unsure": settled (row 4 to 6).
- "Each screw hole is drawn as two circles (countersink or counterbore)": countersink, 45 deg.

---------------------------------------------------------------------
## 3. 42170-2-01 Barrel arbor (built key `barrelArbor`)

Side view axis horizontal, square end at the LEFT. Z = distance from the square's end.

| # | drawing reads | how sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Overall 1.59 +-.01 (printed "1.59 +-1": last place .01) | sure | 1.590 box | MATCH | |
| 2 | Square end .410 long, domed at the tip | sure | square z .0194 to .410 plus dome | MATCH | dome radius not printed (estimated R .145 by the builder) |
| 3 | Square .110 +.004/-0 AF, corners turned to .145 +.005/-0 (.110 is the distance between the two extension lines through adjacent corners = a flat's side; the corners are cut by the .145 circle because the sharp diagonal .1556 exceeds it) | likely | r .055 flats (AF .110), circle .145 | MATCH | |
| 4 | **Square's orientation in the end view: a diamond (corners on the horizontal and vertical centre lines)** | sure | built flats parallel to X and Y (rotated 45 deg from the sheet) | MISMATCH (orientation only) | matters only in the assembled set (the key's socket, the hook's angle) |
| 5 | .005 x 45 deg chamfer at the shoulder (on the .1695 pivot's left edge) | likely | cone d .1595 to .1695, Z .410-.415 | MATCH | |
| 6 | Pivot .1695 +0/-.0003, from .410 to .540 (.130) | sure | .1695 Z .415-.540 | MATCH | |
| 7 | .2295 +0/-.0003 bearing, .540 to .690 left and 1.220 to 1.410 right (the .870 from .540 to 1.410; 1.000 from .410 to 1.410) | sure | .2295 Z .540-.690, 1.220-1.410 | MATCH | |
| 8 | **45 deg chamfers at the .2295 bearings' outer ends: left (at .540) about .012-.015 axial, right (at 1.410) about .019 axial, almost the whole step to the pivot; not dimensioned** | likely (drawn clearly; size read from the picture at 1300-1800 px/in) | square steps, no chamfers | **NOT BUILT** | small; sizes are estimates from the drawing, +-.004 |
| 9 | Bosses: .400 dia x .010 thick at each end of the body; .530 +0/-.002 over both | sure | .400 at Z .690-.700 and 1.210-1.220 | MATCH | |
| 10 | Spans: .720 +-.001 (boss outer face to the right shoulder, Z .690 to 1.410), .870 +-.002, 1.000 +-.003 | sure | consistent | MATCH | |
| 11 | Right pivot .1695, .180 long (1.410 to 1.590), domed, polished | sure | .1695 Z 1.410-1.5673 + dome to 1.590 | MATCH | |
| 12 | **Body diameter: not .520 all round.** Measured on the side view (scale from 1.59 in = 825 units): axis at 528.5; the body edge at the top is 133 above the axis (r .256-.260) and at the bottom 124 below (r .239-.243) along the whole .510 length except the .120 band at Z .205-.325 from the boss face where the bottom edge is at 134 (r .258-.262) | likely (pixel measurement, +-.004) | full cylinder dia .520 (r .260), .510 long | **MISMATCH** (likely) | the sheet's ".520 DIA." is the end-view extent (left to right and top). At the bottom of the section the body is cut back about .022 (the ".022" dimension). So the built body is up to .022 (.56 mm) too big in radius over a sector of the bottom (the "start spiral" ramp), see 13 |
| 13 | **START SPIRAL ramp (end view)**: .022 step from the .520 circle's bottom; a notch with a 45 deg face at about 8 o'clock (point near (-.19, -.15) from the centre, read +-.01); a 1.00 R arc from the bottom point extending .150 to the right of the vertical centre line; a channel .210 wide between two parallel lines tilted 20 deg from vertical (down-left), the dash-dot centre line .090 from the right boundary (so .120 from the left, the slot width); "START SPIRAL" leader to the circle at the 30 deg line (30 deg above the horizontal on the right) | unsure (geometry read from the drawing, not every endpoint) | not built | **NOT BUILT** | builder flagged it. What can be said: the .150 and 1.00 R and .022 are on the bottom (6 o'clock, +x), the 20 deg lines are 6 to 7 o'clock; .090 + .120 = .210 |
| 14 | Hook slot .120 +-.002, far edge .325 from the left boss's outer face (slot Z .205-.325 from it, centred on the .530 over-bosses: .265) | sure | slot from Z .895 to 1.015 (= .205 to .325 from .690) | MATCH (place and width) | centred on the body: a real check |
| 15 | **Slot depth / shape**: in the side view the .120 band is a rectangle whose lower edge is at r .26 and an inner line at about r .21 (26 units = .05 above that), i.e. the band is where the surface returns to the full circle; the oblique detail shows the strip's end lying on a ledge with a .010 clearance and a 45 deg face | unsure | a flat cut .070 deep from the +Y (top) side across the band | CAN'T TELL (orientation likely wrong) | the built slot is on +Y, the sheet's feature is at the bottom, 20 deg from vertical, in the same angular sector as the ramp. The depth .070 is not on the sheet; the rectangle in the side view suggests about .05 radial. Treat as one feature with the ramp |
| 16 | .1695 / .2295 tolerance: +0/-.0003 | sure | nominal at the upper limit | MATCH | |
| 17 | Material "STEEL - S.A.E. 10120", POLISH on the pivots and bearings | sure | same | MATCH | |
| 18 | Left end: dome with two lobes (the square's corner edge seen from the side) | likely | dome in section | MATCH | radius unmarked |

### Disagreements with the transcription (42170.md, with the 1 Nov correction)
- Item 9 / correction: ".520 spring collar, .510 long, a plain cylinder": the end view's .520 is a maximum; along the bottom the body is cut .022 deep and the side view silhouette shows it (row 12). Likely.
- "Slot depth about .070": a guess; the sheet suggests the band reaches the full circle at the bottom and has an inner line about .05 above it (unsure).
- "Square is .110 AF with .145 over corners": agrees with my reading.
- The first-pass profile was correctly replaced by the 1 Nov verification; I agree with that.
- "START SPIRAL numbers unsure": confirm unsure, with the geometry in row 13.

### Builder estimates the sheet settles
- Square AF .110 vs .145: settled (row 3).
- "Hook slot depth: not printed": still not printed; see row 15.
- "Domed ends: radius not given": still not given.
- "Start spiral ramp not built": remains.

---------------------------------------------------------------------
## 4. 1-WD-265 Mainspring inner end (built key `mainspringEnd`)

Flat, x from the tip, strip centred on y = 0. Sheet 2:1, dated 5-20-43, revised 6-7-43 (blue ink).

| # | drawing reads | how sure | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Strip width .590 +-.001 | sure | .590 | MATCH | |
| 2 | Tip full round R .250, tangent to taper lines | sure | arc r .250 centre (.25, 0) | MATCH | |
| 3 | Taper from .500 at the tip's round to .590 at 1.25 from the tip (witness line at 1.25) | sure | lines (.25,+-.25) to (1.25,+-.295) | MATCH | the lines meet the arc at (.25,+-.25), where the arc's tangent is horizontal, so there is a 2.6 deg kink (a true tangent line meets the arc a hair further round, below .002 in) |
| 4 | Slot width .200 +-.003 | sure | .200 | MATCH | |
| 5 | **Slot left edge at .200 (printed, circled in blue) revised to .180 (blue, "finished drawings revised by D.C.M. of 6-7-43")** | sure for both readings; which is in force: likely .180 | .180 | MATCH (revised) | pencil "5.10" next to .200 and "31.8" over "31.75" are later conversions, "6.35 R." for .250 R |
| 6 | Slot length .340 (from its left edge), square left end with a "BREAK CORNER" note, full round right end R .100 | sure | .18 to .52: left square, right arc r .1 centre (.42,0) | MATCH | break at the left corners not cut (no size) |
| 7 | Material blank; thickness not on the sheet (the manual's .0165 used) | sure | .0165 | MATCH | |
| 8 | Strip shown to a torn end at about x = 1.86 (not dimensioned; scale from 1.25 = 407 px: break at 605 px = 1.855) | likely | 2.000 | MINOR DIFFERENCE | only the shown length; irrelevant to the model |

### Disagreements with the transcription
- None of substance. I agree with the 1 Nov verification (square left end, round right end, .180 later change).

### Builder estimates the sheet settles
- "Slot end shapes", "taper" (derived from the outline): settled by the dimensions (.500 to .590 over 1.25). .200 versus .180: settled only as "revised by hand 6-7-43".

---------------------------------------------------------------------
## Joints and fits (for assembling barrel + cap + arbor + spring end)

Stacking (inside length): define barrel Z from the floor's outer face, cap Z_c from the cap's outer face.
- Cap seat: the cap's step face (flange .030, annulus r .750 to .825) sits on the barrel's open end face (Z .700); the spigot (Z_c .030 to .060, dia 1.500) goes into the barrel bore (1.500 +.002/-0 over 1.500 +0/-.001: clearance 0 to .003 on the diameter). Barrel Z = .730 - Z_c.
  - Cap outer face at barrel Z .730 (stands .030 proud of the barrel's end).
  - Cap inner face (spigot end, Z_c .060) at barrel Z .670.
  - Cap boss end (Z_c .100) at barrel Z .630.
- Barrel boss end at Z .100.
- **Inside length between the boss end faces = .630 - .100 = .530**, the arbor's .530 +0/-.002 over its bosses: the arbor fits with 0 to .002 endshake on paper (nominal 0.000; arbor length min .528). Stack tolerances: .700 +-.002, cap flange .030 +-.001, barrel boss .100 +.002/-0, cap boss .100 +.001/-0 give the inside length .530 with worst cases .524 to .533; the paper stack can bind by up to .006 or leave .005. Likely the arbor is fitted/lapped: the sheets do not say.
- Inside height between inner faces (floor .060 to the cap's spigot face .670) = .610 (+-.005 stacked). The spring strip .590 +-.001 leaves .020 nominal.
- The arbor's body (.510) and bosses (.530) centre at barrel Z .365 (= (.100 + .630)/2); **the rivet hole's axis is also at Z .365** and the arbor slot band is centred on the body (.205 to .325 of .530): all three line up; the spring end is hooked at mid height.
- Arbor in barrel/cap: arbor Z = barrel Z + .590. Left bearing .2295 (arbor Z .540 to .690) in the barrel's bore .2300 for the barrel's .100 (floor+boss) and standing .050 outside the floor's outer face; right bearing (arbor Z 1.220 to 1.410) in the cap's bore for .100 (barrel Z .630 to .730) and .090 beyond the cap's outer face to 1.410. Bearing clearance .2300 +.0003/-0 over .2295 +0/-.0003 = .0005 to .0011 on the diameter (.013 to .028 mm).
- Arbor .400 bosses bear on the barrel's and cap's .340 boss end faces (the 45 deg cones run out to .420 so the boss lies inside the arbor's .400 shoulder... the cone ends at the floor's inside face, at dia .420 against the arbor's .400: the arbor's boss does not reach it; fine).
- Pivots .1695 +0/-.0003 for the barrel bridge and pillar plate (not in this batch).
- Screws: .0340-130 close fit (tap drill .0257) through the cap's .0360 +-.0005 holes (countersunk 45 deg to .058 at the outer face) on dia 1.575 into the barrel's five tapped holes in the lip, about .100 deep. Cap hole pattern on its sheet starts at 9 o'clock; barrel's at 12 o'clock: rotate the cap by any multiple of 72 deg plus 18 deg to register (180 deg versus 90 deg, a 90 deg or equivalent 18 deg offset). Screw length: through .030 flange plus up to .100 thread: about .130; flush with the cap's outer face.
- Spring end: slot .200 wide, .340 long, left edge .180 (or .200) from the tip, strip .590 wide, .0165 thick; the arbor's hook band is .120 wide: slot-to-hook clearance .080 across the strip width, and .340 along the strip. The hook must pass through the strip's slot from the strip's inner face; its depth below the body circle: not printed.
- Rivet 42042 in the barrel wall at the bottom (-Y of the plan), Z .365, .080 dia, finished flush; its straight side vertical and facing as in the bottom detail: the anchor for the spring's outer end hole (not in this set).
- Small hole .055 at Z .140, vertical axis at x = -.520 in the plan: a retaining/locating hole near the floor, aligned in the stack with nothing in this batch.

---------------------------------------------------------------------
## Fixes recommended, most important first

1. **Barrel outside diameters**: body 1.650 (Z 0 to .620/.615), lip 1.710 (last .080 to .090) at the open end. Rebuild the profile: `od`=1.650, `lipD`=1.710, lip at the open end. Correct the transcription (items 4, 5) and the lip description.
2. **Outer-face centre feature, barrel and cap**: replace the .23-to-.32 countersink cone by the 60 deg V-groove .025 deep at dia .320, and put the .010 x 45 deg chamfer on the bore mouth at the OUTER face (drop the boss-end .010 chamfer, or keep a nominal break there as the "CORNER" note says). Likely, not sure: the dimensioning style (centre-line extension lines, same V on both sheets) supports it.
3. **Cap flange thickness**: .030 +-.001 (not .036); `flangeT` .030.
4. **Cap screw holes**: dia .0360 +-.0005 through the flange, countersunk 45 deg to dia .058 at the outer face. Remove the estimate flags on both.
5. **Barrel's .055 hole**: axis parallel to Y at x = -.520 (+-.010) in the plan, at Z .140, i.e. about 232 deg on the OD, instead of a radial hole at 210 deg. The .520 locates it. Drop the "notch" entry (it is the break line and the corner note).
6. **Arbor body**: not a full .520 cylinder; the bottom is relieved about .022 over the whole .510 except the .120 hook band, which returns to the full circle. Model the start-spiral ramp (notch with 45 deg face near (-.19, -.15), 1.00 R arc, .150 to the right, .022 step, channel .210 wide at 20 deg from vertical, centre line .090 from the right boundary) and the hook at the bottom (not the top). Needs a larger crop of the end view to read every endpoint: unsure.
7. **Arbor square orientation**: turn it 45 deg so a diagonal is on the vertical and horizontal centre lines as the end view shows.
8. Arbor: add the 45 deg chamfers on the .2295 bearings' outer ends (left about .012-.015, right about .019 axial; not dimensioned).
9. Mainspring end: nothing to fix; optional corner break on the slot's square end; the shown length is about 1.86, not 2.0.
10. Record in the barrel's notes that the lip length (.080 vs .090 +0/-.005) is not settled by the sheet.
