# Batch B: sustaining wheel group (42009, 42010, 42007, 42013, 42016, 42096)

Method: blind read of each sheet (crops at 2-4x), then the built part's measurements (r_hparts_audit/KEY.json), then the transcription and recipe. Inches unless stated; 1 in = 25.4 mm. "Tolerances in units of the last place" (title block): .050 +0/-2 = +0/-.002, etc. I also rebuilt the outlines of 42010 and 42007 from the sheets' tables with shapely (independent of the recipe) to check arcs, tangencies, areas and joints. No sheet image is copied into the repository.

Frame convention found in the built parts: a flat part is viewed from +Z (the plan viewer), so the top face is Z max. 42010 and 42013 have their countersinks on Z max (toward the viewer), which matches their sheets. That fixes the convention used below: a feature "on the back" of a sheet's plan means Z 0.

## Verdict in short
- Everything numeric (coordinate tables, arc centres and radii, hole sizes and places, thicknesses, diameters, tooth counts, tip and root circles, tooth lean offsets) matches to 0.0002 in or better. The mismatches are about hand, face and omitted breaks:
  1. **42009 and 42013 tooth hand is mirrored against the sheets** (both drawn with the locking wall on the CCW side of each tooth when viewed as drawn; built with it on the CW side). The transcription and recipe say "not dimensioned"; the plan views dimension it by drawing it. The recipe's own `setupRatchet` uses hand=-1 and calls it "the sheet's hand", so the three ratchets are not consistent with each other.
  2. **42009's countersinks (holes 3, 4, 8, 9) are on the wrong face**: the sheet puts them on the back (the face away from the plan viewer: Section A-A shows the 45 deg cone at the bottom of the cut, and the plan draws the .090 circle dashed = hidden). Built on Z max (toward the viewer).
  3. **42016: the .005 x 45 deg chamfer on the bottom edge is not cut** (the recipe knows: "not cut").
  4. **42009: the corner break on the bore, both sides, is not cut** (amount not given on the sheet).
  5. 42096: the pivot (arbor 42097 staked in) is drawn as three concentric circles at point 1; not built (size not dimensioned; I measured them).

---
## 1. 42009-2-01 Sustaining ratchet wheel, complete with pawls -> sustainingWheel (brass, 24K gold plate wheel only)

Blind inventory. Table rows (sure, 450 dpi): 1 (2.0000,2.0000) centre; 2 (2.2133,2.3848); 3 (2.3063,2.2800); 4 (2.4076,2.0780); 5 (2.6160,2.0000); 6 (2.4076,1.9220); 7 (1.7867,1.6152); 8 (1.6937,1.7200); 9 (1.5924,1.9220); 10 (1.5924,2.0780); 11 (2.0900,2.3300); 12 (1.9100,1.6700). Relative to the centre: radii 2/7 .4400; 3,4,6,8,9,10 .4150; 11/12 .3420; 5 .6160. Every hole has its 180 deg image except 5.

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | 120 teeth | sure | 120 | MATCH | |
| 2 | OD 1.500 +3/-0 | sure | 1.500 (tips) | MATCH | nominal at the lower limit; fine |
| 3 | root dia 1.458 (dimension between the inner solid arc's extremes) | sure | 1.458 | MATCH | tooth depth .021 |
| 4 | tooth included angle 60 deg (arc between the vertical centre line at the teeth and the sloping tooth line) | likely (angle between locking wall and ramp) | 59.9 deg between wall and ramp | MATCH | see root land below |
| 5 | .040 offset: a second line leaning from the teeth at the top to .040 right of the centre at the bore: each locking wall lies on a line .040 off the centre (tangent to a .040 circle), leaning 3.06 deg to the radius | likely | wall tip (.75,0) to root (.729,-.0011): lean .086 deg of arc, = .021 x tan 3.06 deg | MATCH | lean direction agrees: root is CW of tip |
| 6 | **tooth hand: at the top of the plan each tooth is a vertical wall on its LEFT (CCW side) with the ramp descending to the right (CW)** | sure (crop at 6x: wall rises to the tip, ramp falls away to the right to the next root, then the next wall) | wall on the CW side of each tip (tip (.75,0): wall to (.729,-.0011), ramp to (.7282,.0334) on the CCW side) | **MISMATCH (mirrored)** | see recommendation 1 |
| 7 | root: the drawing shows sharp V roots | likely (schematic) | root arc .0036 long (60 deg printed leaves it) | MATCH with note | a sharp root needs 62.4 deg, printed 60: the printed number was kept, so a .0036 in (.09 mm) land results. Sheet does not settle it. |
| 8 | bore .3000 +3/-0 on centre | sure | .300 | MATCH | |
| 9 | "CORNER BOTH SIDES" arrow at the bore's edge in Section A-A (amount not given) | sure | no chamfer | **NOT BUILT** | recipe lists it as a corner break "built"? JSON has no cone on the bore |
| 10 | thickness .050 +0/-2 | sure | .050 | MATCH | |
| 11 | holes 2, 7: .0400 press fit for 42011, at rows 2, 7 | sure | .040 at (.2133,.3848), (-.2133,-.3848) | MATCH | through |
| 12 | holes 11, 12: .080 +-2 dia | sure | .080 at (.09,.33), (-.09,-.33) | MATCH | through |
| 13 | holes 6, 10: .0503 +3/-0 | sure | .0503 at (.4076,-.078), (-.4076,.078) | MATCH | plain, through |
| 14 | holes 3, 4, 8, 9: bore .048 +0/-1, countersink dia .090, 45 deg | sure | .048 bore Z 0..0.029, cone .048 to .090 over Z .029..0.05 (depth .021) | MATCH in size; **face wrong** | the cone must be on the back face. In the plan holes 3, 4, 8, 9 show a dashed outer circle (hidden), 2 and 7 solid concentric circles (pawl's own countersink), 6 and 10 plain. Section A-A (cut through 9, the bore, 5, viewed toward +y, so the section's up is the plan viewer's face) has the cone at the bottom. |
| 15 | hole 5 .060 +-1, at r .616 on the horizontal axis | sure now: Section A-A's cut passes hole 5 (its x in the section = 1140 px/in x .616 from the bore line = the narrow hole; the .060 arrows span 70 px = .0614) | .060 at (.616,0) | MATCH | transcription says "likely": sure |
| 16 | Section B-B (10:1): rivet 42011 through pawl and wheel, head flush in the pawl's countersink on top, small head below the wheel; "pawls free to rotate, approx .002 endshake" | sure | stud holes only (rivet is another part) | n/a | |
| 17 | pawls 42010 shown at holes 2 and 7, at the plan face (solid lines) | sure | not in this part | n/a | see Joints |
| 18 | finish: X-fine circular line finish (arrow to the rim faces), 24K gold plate wheel only, brass | sure | stated in treatment | MATCH | |

Extra in solid: none. Teeth count each: 120 walls, 120 ramps, 120 root arcs (.0036).

## 2. 42010-1-01 Winding pawl -> windingPawl (1.00 carbon steel, harden and draw, #00 crocus, oxidize black)

Table (sure): 1 (2.0000,2.0000) pivot; 2 (1.9654,1.9639); 3 (1.8410,1.8338); 4 (1.7720,2.0000); 5 (1.8180,2.0900); 6 (1.9813,2.3996); 7 (1.9977,2.0499). My rebuild: lobe R .0500 about 1 from 7 clockwise to 2 (|1-2| = .0500, |1-7| = .0500); R .1800 about 3 from 2 to 4 (distances .1800, .1800), tangent to the lobe at 2 (1, 2, 3 collinear within .0005); straight tip face 4 to 5 (length .1011); R .3500 about 6 from 5 to 7 (distances .3500, .3501), tangent to the lobe at 7 (6, 7, 1 collinear). Closed polygon valid.

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | lobe .0500 R about 1 (row 7 to row 2, through the right) | sure | R .050 at (0,0), from (-.0023,.0499) to (-.0346,-.0361), len .1976 | MATCH | |
| 2 | .1800 R, centre row 3 | sure | R .1799 at (-.1589,-.1661) | MATCH | |
| 3 | tip line 4 to 5 | sure | (-.228,0) to (-.182,.09) | MATCH | |
| 4 | .3500 R, centre row 6 (-.0187,.3996) | sure | R .3516 at (-.0182,.4011) | MATCH within fit noise | ends (rows 5, 7) exact; sagitta differs .00006 in. The recipe builds this as a three-point arc through rows 5, 7 and the mid point on R .3500 about row 6, so the solid is right by construction; the .3516 is the fit of a tessellated arc |
| 5 | pivot hole .042 +0/-1 (narrow, through), 45 deg countersink to .080 on the face toward the plan viewer | sure (plan shows the .080 and .042 circles solid; section shows the cone at the top) | .042 Z 0..0.031, cone to .080 over Z .031..0.05 | MATCH | countersink on Z max = viewer face; consistent with the wheel's B-B (rivet head on the viewer side). Recipe flag "countersunk face not dimensioned (estimated)": the plan and section settle it |
| 6 | thickness .050 +0/-2 | sure | .050 | MATCH | |
| 7 | harden and draw; oxidize black all over; #00 crocus finish | sure | stated | MATCH | |

## 3. 42007-2-01 Winding pawl spring, complete with pin -> windingPawlSpring (beryllium copper, 24K gold plate)

Table (sure): 1 (2.0000,2.0000); 2 (2.0599,2.0151); 3 (2.4076,1.9220); 4 (2.2630,1.5923); 5 (2.2532,1.5903); 6 (2.2489,1.5813); 7 (2.1856,1.4453); 8 (2.0988,1.5677); 9 (2.5355,2.3743); 10 (2.5088,2.3605); 11 (2.4888,2.3382); 12 (2.3887,2.2264); 13 (2.3794,2.3761); 14 (2.0555,2.2102); 15 (2.1716,2.1152); 16 (2.0000,1.8440); 17 (2.1013,1.6420). Point 3 is the wheel's centre (3 minus row 1 = (+.4076,-.078), the wheel's hole 6 offset, and row 1 on the wheel is hole 10 at (-.4076,.078)). Arcs checked against the table (distance from centre): R .4700 about 3 (to 9 .470, to 8 .470); R .4550 about 3 (14 and 13 both .455; strip .015 +-1 wide); R .3600 about 3 (2 and 4 both .360); R .1500 about 15 (2 and 14); R .1500 about 12 (13 and 11); R .0300 about 10 (11 and 9); R .1500 about 7 (8 and 6); R .0100 about 5 (4 and 6). Holes 16 and 17 sit on the .4150 circle about 3 (both .415).

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | all arcs above | sure | .47, .4549, .3599, .15, .1503, .03, .1502, .01 about the same centres (datum row 1 at the origin) | MATCH | box -.0624..0.5388 consistent |
| 2 | area | derived | volume 56.75 mm3 = .0693 in2 at .050; my polygon .0742 minus holes (.0050) = .0692 | MATCH | confirms the outline's closing order |
| 3 | pin hole at row 1: press fit for .0498 pin 35794, pin flush with top (left view: pin projects to the back of the spring) | sure | .0498 at (0,0) | MATCH | hole size = pin size (sheet gives the pin, not the hole); wheel's hole 10 is .0503 +3/-0 |
| 4 | holes 16, 17: tap for .0440-130 screw (dashed thread circles) | sure | plain .044 at (0,-.156), (.1013,-.358) | MATCH (thread by convention) | |
| 5 | thickness .050 +0/-2 | sure | .050 | MATCH | |
| 6 | beryllium copper, 24K gold plate | sure | stated | MATCH | |

## 4. 42013-1-01 Winding ratchet -> windingRatchet (1.00 carbon steel)

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | 40 teeth | sure | 40 | MATCH | |
| 2 | OD .670 +-2; root dia .621 | sure | .670 / .621 | MATCH | tooth depth .0245 |
| 3 | 65 deg between locking wall and ramp | likely | 65 deg; slope .0542, wall .0246, no root arc | MATCH | at 65 deg the tooth closes exactly (pitch at the tip .0526 = .0245 x tan 65 deg = .0525), so no root land: a good sign the 65 is the wall-to-ramp angle |
| 4 | .030 offset, wall leans 5.1 deg to the radius | likely | wall (.335,0) to (.3105,-.0022) | MATCH | |
| 5 | **hand: same as 42009: wall on the LEFT (CCW side) of each tip at the top, ramp falling to the right** | sure (crop at 6x) | wall on the CW side | **MISMATCH (mirrored)** | |
| 6 | bore .230 +1/-0 | sure | .230 | MATCH | |
| 7 | two holes .440 apart on the horizontal axis through the centre | sure | at (+-.22,0) | MATCH | |
| 8 | holes: counterbore .146 +-2 with a straight wall, 45 deg cone to the .077 +-1 hole; .060 from the face to where the .077 starts; thickness .075 +0/-2 | sure (the section shows the straight wall, the cone, a short cylinder) | .146 Z .0495..0.075 (.0255 deep), cone to .077 over Z .015..0.0495 (45 deg), .077 Z 0..0.015 | MATCH | .0255 + .0345 = .060 |
| 9 | counterbore on the face toward the plan viewer (section's top) | sure | on Z max | MATCH | |
| 10 | harden and draw, oxidize black, #00 crocus | sure | stated | MATCH | |

## 5. 42016-2-01 Sustaining spring, complete with pins -> sustainingSpring (1.00 carbon steel, oxidize black)

Table (sure): 1 (2.0000,2.0000); 2 (2.0849,2.0299); 3 (2.4621,2.1629); 4 (2.1933,2.4591); 5 (2.6167,1.9926); 6 (2.8372,1.4024); 7 (2.7322,1.6835); 8 (2.5206,1.4709); 9 (2.4500,1.4000); 10 (2.3676,1.3433); 11 (2.6100,2.0000); 12 (2.1171,1.5029); 13 (2.1300,1.5920); 14 (2.1794,1.6672); 15 (2.3167,1.8762); 16 (2.0838,1.9672). Checked: .7000 R about 11 (12 and 10 both .700); .6300 R about 5 (4 and 6 both .630); .4000 R about 3 (2, 4); .0900 R about 1 (2, 16); .2500 R about 15 (14, 16); .0900 R about 13 (14, 12); .3000 R about 7 (6, 8); .1000 R about 9 (8, 10). Widths .080 (upper left), .070 (right), .058 (lower right) follow from the two circles (outer centre 11, inner centre 5, offset (.0067,-.0074)).

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | outer R .700 about row 11 | sure | R .7 at (.6099,0) | MATCH | |
| 2 | inner R .630 about row 5 | sure | R .63 at (.6167,-.0074) | MATCH | |
| 3 | R .400 about 3; R .090 about 1; R .250 about 15; R .090 lug about 13; R .300 about 7; R .100 about 9 | sure | .3998 (.4619,.163); .09 (0,0); .2502 (.3169,-.1237); .09 (.13,-.408); .3001 (.7323,-.3164); .1 (.45,-.6) | MATCH | |
| 4 | hole 1: pin 42017, .0500 dia press fit | sure that a pin goes here; the hole size is not printed (the .0500 reads as the pin's) | .0495 at (0,0) | MATCH (estimate) | recipe flags this |
| 5 | hole 9: pin 42017 | same | .0495 at (.45,-.6) | MATCH | |
| 6 | hole 13: .048 +-1 dia hole | sure | .048 at (.13,-.408) | MATCH | |
| 7 | thickness .050 +0/-2 | sure | .050 | MATCH | |
| 8 | "Section A-A, bottom edge only": .005 at 45 deg chamfer at the bottom-right corner of the cut (the outer edge of the ring, back face; the left/inner corner square) | sure of size, likely of which edge (the chamfer is drawn on the corner at the outer end of the cut, the face away from the plan viewer) | none (no cone, Z levels 0/.05 only) | **NOT BUILT** | |
| 9 | pins: "projects on opposite sides" | sure | pin holes only | n/a | left view: pin 1 projects to the back (away from the plan viewer) about .072 (measured 50 px at 698 px/in, +-.004, unsure) and is flush with the front face; bottom view: pin 9 projects toward the viewer about .047-.050 and is "flush with face" at the back |
| 10 | oxidize black all over, 1.00 carbon steel | sure | stated | MATCH | |

## 6. 42096-2-01 Sustaining pawl, complete with arbor and spring -> sustainingPawl (1.00 carbon steel, polish)

Table (sure): 1 (2.0000,2.0000); 2 (1.9542,2.1000); 3 (1.9159,1.9678); 4 (2.4764,2.1822); 5 (1.9524,2.4746); 6 (2.0000,2.4900); 7 (2.3885,2.3304); 8 (2.0686,2.0583). Checked: R .0900 about 1 (3 and 8 both .090); R .6000 about 4 (3 and 5 both .600); R .4200 about 7 (8 and 6 both .420); tip line 5 to 6 (.050 long). Hole 2 is the spring wire's: .020 dia taper broached for a drive fit (part 42098). Section: pawl .045 +-1 thick; .090 is the arbor's collar diameter (part 42097, staked into the pawl); "POLISH" arrow at the face; "POLISH CONTOUR".

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | R .600, R .420, R .090, tip line | sure | .6009 (.4773,.1821); .4199 (.3884,.3304); .09 (0,0); line (-.0476,.4746)-(0,.49) | MATCH | .6009 vs .6000, centre .0009 off: same fit noise as 42010; ends exact |
| 2 | hole 2 .020, taper broached | sure of .020 (a "dia" on the note) | .020 at (-.0458,.1) | MATCH | taper not modelled (note says size not given); fine |
| 3 | thickness .045 +-1 | sure | .045 | MATCH | |
| 4 | pivot at 1: three concentric circles = arbor 42097 staked through the collar | sure that it is drawn; diameters not dimensioned. I measured them on the plan: about .050, .071 and .091 (ring radii 60, 86, 110 px at 2422 px/in; +-.002) | no pivot hole | **NOT BUILT** (hole not dimensioned) | .091 agrees with the .090 collar of the section |
| 5 | polish contour, polish face | sure | stated | MATCH | |

---
## Disagreements with the transcription and recipe

1. **Tooth hand (42009, 42013): transcription and recipe say the hand is not dimensioned; the plan views draw it.** Both sheets show, at the top of the wheel, a steep wall on the CCW side of each tooth tip and the ramp falling away to the CW side. The recipe's `ratchet_face(..., hand=1)` builds the opposite; `setupRatchet` calls hand=-1 "the sheet's hand (D-2)". Sure of what is drawn (crops at 6x). Pairing check with the pawls as drawn on 42009: with the pawl pivot at the upper right of the ratchet and the tip pointing -x, the sheet's hand lets the ratchet turn CW (as seen on the plan) past the pawl and locks CCW; the pawl then carries the wall load in tension (pull), and with the built hand the lock direction reverses and the load is a compression. I cannot decide the real installation face from the sheets alone (which face of 42013 faces the pawls). It stays an inference, but the drawn hand is the only evidence, and the three ratchets should agree.
2. **42009 countersink face**: "not dimensioned (built on the outer face)" in the recipe. It is drawn: hidden (dashed) circles in the plan and the cone at the bottom of Section A-A, on the back.
3. **42009 hole 5**: transcription "likely"; I find it sure (section geometry).
4. 42009 item 10 "the .0440-130 screw holes of the pawl springs (inference from 42007)": confirmed by the numbers (below), no longer an inference.
5. 42010: "countersunk face not dimensioned (estimated)": the plan draws the .080 circle solid, the section shows the cone on top, consistent with the wheel's B-B; settled.
6. Winding ratchet recipe note "which way the teeth face: not dimensioned" and 42013 "item 4 and 5 settled, likely" agree with me on the angle and offset; only the hand claim differs.
7. 42016: recipe says holes 1 and 9 sizes "estimated" (.0495): the sheet gives no hole size, so it stays an estimate.

## Builder estimates the sheet settles
- Which face the 42009 countersinks are on: settled (back).
- Which face the 42010 countersink is on: settled (viewer face of the plan).
- Tooth hand: settled as drawn (see 1 above; installation side open).
- 42009 hole 5 .060: settled.
- 60 deg meaning (wall-to-ramp included angle): consistent; 65 deg on 42013 closes the tooth exactly, which supports it; 60 deg on 42009 does not (62.4 would), so 42009's printed number is a rounded or schematic value.
- Still open and not settled by these sheets: hole 11/12's purpose (they lie at r .342 on the pawl's swing and at the winding ratchet's tip radius .335; my overlay shows the pawl covering them for pawl rotations over about 15 deg; sheet calls them only ".080 dia"), screw lengths, pin lengths, and the pivot-hole diameter of 42096.

## Joints and fits (numbers to assemble from the sheets)

Wheel 42009, centre at the origin, frame as drawn. All pawl and spring positions are 180 deg images (about the origin), except hole 5.

**Winding pawls 42010 on studs 42011**
- Pawl A: pivot hole 1 of the pawl on wheel hole 2 (+.2133,+.3848), radius .4400, at 61.0 deg; pawl un-rotated (sheet orientation, tip pointing -x). Pawl B: on hole 7 (-.2133,-.3848), the pawl rotated 180 deg.
- Stud .0400 pressed in the wheel's hole (.0400, press fit), rivet head flush in the pawl's .080 countersink (on the plan face, Z max); pawl bore .042 +0/-.001 on a .0400 stud: free by .002-.003; endshake about .002 (section B-B note); pawl .050 on the wheel's face.
- Pawl A's tip point 4 sits at (-.0147,+.3848) (r .3851), the tip corner 5 at (+.0313,+.4748) (r .4758). Lever from pivot to point 4 is .228. Swinging the pawl CCW about its pivot, point 4 reaches the winding ratchet's tip circle (r .335) at 12.65 deg and its root circle (r .3105) at 19.05 deg. The ratchet 42013 is concentric with the wheel (its bore .230; hole 1 of the wheel .3000 is the ratchet's seat clearance, not the ratchet's).
- Drawn hand: with the sheet-hand ratchet (above), A's tip faces the wall on the CCW side.

**Pawl springs 42007 on the wheel**
- Spring 1: its row 1 (pin 35794, .0498, in the spring's hole 1) on the wheel's hole 10 (-.4076,+.078) (.0503 +3/-0, pin press fit, "flush with top" of the spring, i.e. the pin runs down into the wheel); screws .0440-130 through the wheel's holes 9 (-.4076,-.078) into the spring's tapped hole 16, and through hole 8 (-.3063,-.28) into the spring's hole 17 (screw heads in the back countersinks, spring tapped). The spring's centre (row 3) is the wheel's centre; no rotation needed (spring local = wheel coords shifted by (-.4076,+.078)).
- Spring 2: the 180 deg image: pin in hole 6 (+.4076,-.078), screws in holes 4 (+.4076,+.078) and 3 (+.3063,+.28).
- Spring 1's free end: tip centre (row 10) at wheel (+.1012,+.4385), .030 R; its end (row 9) at (+.1279,+.4523). It bears on pawl A's .3500 R upper edge: in the drawn (free) state the tip overlaps the un-rotated pawl by .0033 in2; the overlap is gone by about 15 deg of pawl swing. So the spring holds the pawl at its rest (pawl against the spring tip), pushing it toward the ratchet; as the pawl swings CCW (tip in toward the ratchet) the spring is loaded. Both springs sit on the same face as the pawls (the face where the pawl is, Z max of the wheel), the spring and pawl both .050.
- Free blade: strip .015 +-.001 wide (R .455 to R .470), R .470 outer.
- Wheel holes 6/10 (pin) and 3/4/8/9 (screw) are exactly the springs' pin and screw positions (measured: pin hole 10 = row 1, hole 9 = row 16, hole 8 = row 17 within .0001).

**Sustaining spring 42016 between the fusee wheel 42015 and 42009**
- The spring is an almost-complete ring (outer R .700 about row 11, inner R .630 about row 5) with the hooked tail at row 9/10 and the lug at row 13. The ring is concentric with the fusee/sustaining axis within .01: row 11 (2.6100,2.0000) or row 5 (2.6167,1.9926) is the axis.
- Pin 1 (hole 1): .6100 from row 11 (180 deg direction) / .6167 from row 5. Fusee wheel hole .053 at r .610 matches pin 1 about row 11 exactly (.6100).
- Pin 9: .6209 from row 11 / .6156 from row 5. The wheel's hole 5 (.060, at r .616) matches pin 9 about row 5 (.6156): the .060 hole is .010 oversize for the .0500 pin, so the .005 radial difference is absorbed.
- The two pins are 75.0 deg apart about the ring centre in the free spring (74.98 about row 5, 75.07 about row 11): pin 9 is 75 deg CCW from pin 1 as seen from the plan face of 42016.
- Pins project to opposite faces: pin 1 toward the back (away from the plan viewer) about .072, pin 9 toward the plan viewer about .05 (measured; unsure +-.004). So seen from the plan face, pin 9 (toward the viewer) goes into the part above (the wheel's hole 5 if the wheel is toward the viewer) and pin 1 into the part below (the fusee wheel's .053 hole). The assembly order cannot be derived beyond that; turned over, the 75 deg sense reverses (CW).
- Hole 13 (.048): .630 from rows 5 and 11, at 219-220 deg: its mate is not on these sheets (a stop pin or screw on the fusee wheel, if any; 42015 not in this batch).
- Pins 42017: .0500 dia; their hole in the spring .0495 (estimated).

**Sustaining pawl 42096**
- Pawl .045 +-.001 thick, staked on arbor 42097 through the collar .090 (with a .045 +-.001 dimension from the collar's face to the pawl's face in the section); spring wire 42098 into the pawl's .020 taper-broached hole at (-.0458,+.1000) from the pivot (.1100 from the pivot at 114.6 deg).
- Tip: corner 6 at (0,+.4900) from the pivot, 5 at (-.0476,+.4746); the contact is the tip line 5-6 (.050 long) on the sustaining wheel's teeth (root r .729, tip r .750, locking walls offset .040). The pivot's place against the wheel's centre is not on this sheet.

## Fixes recommended, most important first
1. Rebuild 42009 and 42013 teeth in the sheet's hand (wall on the CCW side of each tip as viewed from the plan face; i.e. `hand=-1` as `setupRatchet` uses), or write down the installation reason for the mirror (the ratchet turned over); at least make the three ratchets consistent.
2. Move 42009's holes 3, 4, 8, 9 countersinks to the back face (Z 0 in the viewer-at-+Z convention).
3. Cut 42016's .005 x 45 deg chamfer on the back-face outer edge; add the bore corner break (both faces) to 42009, amount an estimate (flag it).
4. 42096: add the pivot (.050/.071/.091 measured circles; collar .090) or record that the rings are the arbor and collar; update its note.
5. Update the flags and notes now settled (countersink faces, hole 5, 42010's countersink), and the claim "hand not dimensioned".
6. Optional: record that 60 deg on 42009 leaves a .0036 root land while 65 deg on 42013 closes the tooth exactly.
