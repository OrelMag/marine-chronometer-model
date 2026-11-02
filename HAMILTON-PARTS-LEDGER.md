# Hamilton drawn parts: audit ledger

This ledger tracks the audit of the parts built from Hamilton Watch Co.'s factory drawings (the NAWCC's 26 sheets) against those sheets, and the subassemblies made from them. It started on 2 November 2026. The parts are `tools/recipes/hamilton.py`, built and checked by `tools/hamilton_parts.py` and shown on `marine-chronometer-source/hamilton-parts/` (on the site at `/hamilton/parts/`). They are not in the 3D model.

The sheets stay out of the repository: no scan, crop or picture of one is here. Only their numbers and words are, cited by drawing and item.

## How the audit was done

1. **Measured, not read from the code.** `tools/hamilton_measure.py` reads each built solid alone (planes, cylinders, cones, the outline's arcs and lines, the turned section, the teeth) into `tools/r_hparts_audit/KEY.json` and a plan-and-section picture, in inches. This lets the audit compare the drawing with the part as built, not with what the code says it built.
2. **Blind reading.** Each of the 26 sheets was rendered at 300 dpi outside the repository (`$MC_VIDEO/hd-audit/sheets/`) and read by an independent agent in five batches (A to E). Each agent read the sheet first, with no transcription and no code. It inventoried every view, dimension, table row, hole, note and title block, saying how sure each reading was.
3. **Comparison.** Each item was then compared with the measured solid (match, mismatch, not built, extra, can't tell). Only after that did the agent read the transcription and the recipe and list where they and the blind reading part.
4. **Checked again before acting.** The three largest claims were checked by eye on the rendered sheet before any change: the detent's window, the barrel's diameters and the fusee arbor's body. All three held.
5. **Fixed and re-measured.** Every fix was re-measured on the rebuilt solid (below), and `hamilton_parts.py` was run again: every part one valid solid, every hole on its axis, every tooth count, tip and root as drawn.

The batch reports, each with every item's table, are in `References/Hamilton-original-drawings/audit/` (`BRIEF.md` is the agents' brief).

## Summary by part

Verdict before → now. "Match" means every printed size within its tolerance (0.0002 in where none is printed).

| Sheet | Part | Before the audit | Fixed (f9bd606c) | Open |
|---|---|---|---|---|
| 42073-2-01 | Fourth wheel | mirrored (reference spoke on the right) | the reference spoke on the left as drawn | the bore's rivet countersink (drawn, not sized); the undrawn spokes (71° each, estimated); tooth form (estimated) |
| 42072-1-01 | Fourth pinion | a step in the upper stem; a step in the lower pivot; the lower cone stopping at .0445 | the stem a taper .0565→.0583; the lower cone to the pivot; the lower pivot a taper .0311→.0280 | the collar's top chamfer (.009 built, the sheet looks .017 × .011); the UNDERTURN; leaf form |
| 42015-2-01 | Fusee wheel | left recess .015 deep (should be .055); a ring standing out to the left face; a tooth on the hole's centre line | recess .055, mouth chamfered .015, the .470-.320 ring .005 deeper, no left boss; a gap on the hole's line | tooth form (estimated) |
| 42022-2-01 | Fusee arbor | .2295 right of the collar (should be .2500); a flat chamfered end (should be domed); the square's flats on the axes | .2500 from the collar to 1.250; the end domed R .0725 to 2.000; .005 × 45° at the shank corner; the square a diamond, the cross hole along a corner | the knurl (a note, not modelled) |
| 42009-2-01 | Sustaining ratchet wheel | teeth in the wrong hand; the countersinks on the wrong face | the sheet's hand; the countersinks on the back face | the bore's corners broken (no size); holes 11 and 12's purpose |
| 42010-1-01 | Winding pawl | match | — | — |
| 42007-2-01 | Winding pawl spring | match | — | the holes' own fits (the pin's and screw's sizes used) |
| 42013-1-01 | Winding ratchet | teeth in the wrong hand | the sheet's hand | which face meets the pawls (it decides the hand in the work) |
| 42016-2-01 | Sustaining spring | the .005 × 45° chamfer not cut | the outer edge of the back face chamfered | holes 1 and 9's size (no figure: .0495 estimated); the pins' lengths |
| 42096-2-01 | Sustaining pawl | no pivot hole | Ø .050 as measured on the drawing (not dimensioned) | the arbor 42097 and spring 42098 are not in the set |
| 42168-2-01 | Barrel | body and lip diameters swapped (body 1.710, lip 1.650 stepped down); a countersink in the outer face; the .055 hole radial at 210° | body 1.650, lip 1.710 at the open end; a 60° V-groove .025 deep on Ø .320; the bore's outer mouth .010 × 45°; the .055 hole parallel to the plan's vertical at x −.520, z .140 | the lip's length (.080 or .090: the sheet prints both) |
| 42169-2-01 | Barrel cap | flange .036 (should be .030); screw holes estimated plain .038 | flange .030; holes Ø .0360 countersunk 45° to .058; the V-groove and mouth chamfer as the barrel | — |
| 42170-2-01 | Barrel arbor | the slot on top; the square's flats on the axes | the slot at the bottom; the square a diamond | the start-spiral ramp and the body's .022 relief; the bearings' end chamfers (not sized); the slot's depth (not printed) |
| 1-WD-265 | Mainspring inner end | match | — | the shown length (illustrative) |
| 42026-1-01 | Set-up ratchet | teeth mirrored | the sheet's hand | the 65° doesn't agree with the other sizes (the ramp comes out 73° to the face) |
| 42027-1-01 | Set-up pawl | 42010's outline unmirrored; a countersink copied from 42010; material "not given" | mirrored as drawn; a plain bore; 1.00 carbon steel (its title block) | — |
| 42028-2-01 | Set-up pawl spring | hole 17 at the screw's .044; gold plate | both holes at the pin's .0498; nickel plate, #1 emery | — |
| 42050-1-01 | Helical spring | match | — | where it goes |
| 42087-2-51A, -1-52 | Detent blank (and the finished detent, reconstructed: below) | the window .036 high at .032-.068 | .072 high from .036 to .108 above the bottom edge | the step in the top notch (.079 printed, .075 on the scale) |
| 42002-1-01 | Hook, barrel end | the step's .003 × 45° not cut | cut on both faces | — |
| 42003-1-01 | Hook, fusee end | as 42002 | as 42002; the outline from 42002 confirmed | — |
| 42004-1-01 | Link pin | match | — | — |
| 42005-1-01 | Centre link | hole edges not broken | .002 × 45° both faces (size not given: estimated) | — |
| 42001-2-01 | Chain (assembly) | (no part) | the outer plate 42246 added as 42005's outline (assumed); a 9-space run | 42246's own sheet |
| 42093-2-01 | Detent assembly | (no part) | read for the detent's other parts | the finished 42087-3-01 and its parts are not in the set |

## Findings, item by item

**A** is the train and fusee, **B** the maintaining work, **C** the barrel group, **D** the set-up, detent and helical spring, **E** the chain. *Fixed* means fixed in f9bd606c (branch `claude/hamilton-parts-audit`), re-measured on the solid.

| # | Sheet | Finding | How sure | Status |
|---|---|---|---|---|
| A-1 | 42022 | Body right of the collar is .2500 ±.0002 all the way to the shoulder at 1.250 (pixel scan .2507 at four places); the knurl only on its first .080 | sure | fixed |
| A-2 | 42015 | The left .600 recess's floor is .055 deep (the .040 web from the disc's face at .095; pixel scan .057), not .015; .015 is its mouth's chamfer; the .470-.320 ring .005 deeper; nothing stands out to the left face | sure (.055) | fixed |
| A-3 | 42022 | The square's end is domed (R ≈ .0725); the .005 × 45° is at the shank's corner where the round for the square begins | sure (dome), likely (chamfer) | fixed |
| A-4 | 42072 | The lower pivot tapers .0311 → .0280 over its .360 (no step); the lower shoulder's cone runs to the pivot | likely | fixed |
| A-5 | 42072 | The upper stem's silhouette is parallel with no step: built as a taper .0565 → .0583 | likely | fixed |
| A-6 | 42072 | The collar's top chamfer is larger than built (≈ .017 radial × .011 axial, flat ≈ .066) | unsure | open |
| A-7 | 42022 | The cross hole runs along a corner of the square (the square drawn as a diamond) | likely | fixed |
| A-8 | 42073 | Built mirrored: the reference spoke is on the left | sure | fixed |
| A-9 | 42015 | A tooth gap on the centre line through the .053 hole | likely | fixed |
| A-10 | 42073 | The bore is countersunk on the riveted face (not sized) | likely | open: not cut |
| A-11 | 42073 | Its side view draws an older pinion (leaves about .150 long, the collar about .242 from the tip); 42072, redrawn, decides | sure | noted |
| B-1 | 42009, 42013 | The tooth hand is drawn: the steep wall on the counter-clockwise side of each tip, the ramp falling away clockwise. All three ratchets now share it | sure | fixed |
| B-2 | 42009 | The countersinks of holes 3, 4, 8, 9 are on the back face (hidden circles in the plan, the cone at the bottom of section A-A) | sure | fixed |
| B-3 | 42016 | The .005 × 45° is on the outer edge of the back face only | sure | fixed |
| B-4 | 42096 | Three concentric circles at the pivot (≈ .050, .071, .091): a pivot hole, a seat, the arbor's .090 collar; not dimensioned | measured ±.002 | fixed: Ø .050 drilled |
| B-5 | 42009 | Hole 5 is .060 (sure); the root land (.0036) follows from the printed 60° (a sharp root would need 62.4°) | sure | noted |
| B-6 | 42010, 42096 | Arc radii read .3516 and .6009 in the measurement are fit noise: the arcs pass through the table's exact points | sure | no change |
| C-1 | 42168 | The body is 1.650, the lip 1.710 at the open end, stepped up, carrying the tapped holes. The transcription (items 4, 5) and the build had them swapped | sure (checked by eye) | fixed |
| C-2 | 42168, 42169 | The outer face's feature is a 60° V-groove .025 deep centred on Ø .320; the .010 is a 45° chamfer at the bore's outer mouth | likely | fixed |
| C-3 | 42169 | The flange is .030 ±.001; the .0360 ±.0005 is the screw holes | sure | fixed |
| C-4 | 42169 | Screw holes Ø .0360 through, countersunk 45° to Ø .058 on the outer face | sure | fixed |
| C-5 | 42168 | The .055 hole's axis is parallel to the plan's vertical at x = −.520 (the .520 ±.010 locates it), z .140, through the wall at about 232°; the "notch" is the plan's section break and a CORNER note | likely | fixed |
| C-6 | 42170 | The body has a relief of about .022 along its underside except at the hook's .120 band (the start spiral); the slot at the bottom, about 20° off the vertical | unsure | slot moved to the bottom; the relief and ramp open |
| C-7 | 42170 | The square drawn as a diamond | sure | fixed |
| C-8 | 42170 | 45° chamfers at the bearings' outer ends (≈ .012-.019, not sized) | likely | open |
| C-9 | 42168 | The lip is .080 at the top of the section and .090 +0/−.005 at the bottom; it measures about .080 and .085 | unsure | open (.080 built) |
| D-1 | 42087-2-51A | The window is .072 high, its bottom .036 above the blank's bottom edge, its top .032 under the top: the .072 and .0360 dimension the window's height and the web below it. The transcription read them the other way round | sure (checked by eye) | fixed |
| D-2 | 42026 | The teeth mirrored against the build (the same hand as B-1) | sure | fixed |
| D-3 | 42027 | 42010's outline mirrored (the pawl points right); a plain .042 bore; 1.00 carbon steel | sure (hand, material), likely (bore) | fixed |
| D-4 | 42028 | Hole 17 the pin's .0498 like hole 1 ("complete with pins"); nickel plate, #1 emery | likely (hole), sure (plating) | fixed |
| D-5 | 42026 | The 65° does not reconcile with .670, .621, 40 teeth and the .030 offset | unsure | open |
| D-6 | 42087-2-51A | The notch's step: .079 printed, about .074 on the drawn scale | unsure | open (.079 built) |
| E-1 | 42002, 42003 | The step's .003 × 45° on both faces (x .047 to .050 from the pin hole) | sure | fixed |
| E-2 | 42005 | "CORNER HOLES BOTH SIDES": the holes' edges broken (no size) | sure | fixed: .002 estimated |
| E-3 | 42001 | The ".030 MAXIMUM" is the plate stack (3 × .0095 = .0285), not the hook | sure | noted |
| E-4 | 42001 | The plan draws four joints at each end, not two | sure | noted |
| E-5 | 42004 | The pin's clearance in the .0250 holes is .0002 to .0013 in by the printed tolerances | sure | noted |

## Corrections for `hdims.js` and the transcriptions (for `claude/hamilton-drawn-parts`)

`js/hdims.js` and the transcriptions here are byte copies from `claude/hamilton-drawn-parts` (469ad7f0). That branch builds these parts into the model, so it should take these corrections. Here the recipes apply them over HD, citing this ledger, and the copies are left as they are.

- **42022 (HD.fa):** the body right of the collar is `.2500` to 1.250, not `.2295` (A-1). The end is domed. `.005 at 45` is the shank corner (A-3). The square is a diamond, and the cross hole runs along its corner (A-7).
- **42015 (HD.fw):** `dep600` .055, not .015; .015 is the mouth's chamfer. `dep470` and `dep320` are .060 for the ring between .470 and .320, the central ring .055 (A-2). There is no boss on the left. A gap sits on the hole's line (A-9).
- **42072 (HD.p4):** the lower pivot is a taper, with no `tailStep`. The lower cone reaches the pivot, with no `lowStem` step. The upper stem has no step at `stAbove` (A-4, A-5).
- **42073 (HD.w4):** the horizontal spoke is on the left (A-8).
- **42168 (HD.ba):** `od` is the lip (1.710) and `lipD` the body (1.650): swap them (C-1). The `.520` locates the `.055` hole, and the hole lies parallel to the plan's vertical (C-5). The outer feature is a V-groove (C-2).
- **42169 (HD.cp):** `flangeT` .030. The `.0360` is the screw hole, countersunk to .058 (C-3, C-4).
- **42087 (HD.dt.window):** `h` .036 is the web under the window and `top` .072 its height (D-1).
- **42009, 42013, 42026:** the teeth's hand is drawn (B-1, D-2). 42009's countersinks are on the back (B-2).
- **42027, 42028:** 42027 is mirrored, with a plain bore (D-3). 42028's hole 17 is .0498 and it is nickel plated (D-4).
- **42001 transcription:** .030 is the stack (E-3), and four joints are drawn at each end (E-4). **42004:** clearance .0002 to .0013 (E-5).

## Visual check (2 November 2026)

`tools/hamilton_visual.py` draws each built part the way its sheet does, beside the sheet. Flat parts are drawn in plan with a cut through their thickness; turned parts as the section through the axis, lying along the page, with every edge seen across it. The pictures go to `$MC_VIDEO/hd-audit/visual/`, never into the repository. All 23 parts were compared by eye, and the 3D page re-rendered shaded. Three things were wrong and are now fixed:

| # | Sheet | What the eye found | Fix |
|---|---|---|---|
| V-1 | 42170 barrel arbor | The side view draws the .120 band standing *out* below the body's lower edge, not cut into it. The end view's START SPIRAL shows why. The body is a circle (Ø .498: the .520 is measured over the tip) whose bottom, on the centre line, steps out .022 to a tip. An arc of 1.00 R runs from the tip back onto the circle .150 from the centre line. This lobe, only over the .120 band, is the hook the mainspring's .200 slot goes over. The build had a slot cut .070 into the body instead (C-6's "relief" was this). | The body is milled to the circle and the hook. The end view's 45° notch and the .010 × 45° detail are not cut (unsure). |
| V-2 | 42072 fourth pinion | Each of the stem's three printed diameters has its own arrows at its own height: .0565 under the top cone, .0445 at the UNDERTURN, .0583 above the collar. Under the leaves there is a .0445 neck before the .060 shoulder. The drawing keeps one width throughout, and the build had a single taper (A-5). | Each diameter where its arrows stand. Where each begins is not dimensioned: .110 is estimated, and .250 is the line the drawn-parts branch read. The neck is .015 long (estimated). |
| V-3 | 42007 winding pawl spring | Holes 16 and 17 are "TAP FOR .0440-130 SCREW": the screws come up from the back through 42009's countersunk holes and thread into the spring. The build had them plain at .0440. | Tapped .0440-130, drawn at the tap drill (.0357); the thread is a note. |

Matching by eye, with nothing to change: the barrel and cap, the fusee arbor and wheel, the fourth wheel, the sustaining wheel and spring, the winding and sustaining pawls, the winding and set-up ratchets, the set-up pawl and spring, both hooks, the centre link, the link pin, the detent blank, the helical spring and the mainspring's end.

For `claude/hamilton-drawn-parts` (HD): the barrel arbor's `slot` is the hook band; the body is .498, and the .520 is over the hook (V-1). The pinion's `st` should place .0565, .0445 and .0583 as in V-2. HD.wps's screw holes are tapped (V-3).

## The finished detent, reconstructed (2 November 2026)

The finished drawing 42087-3-01 is not in the set. The page has carried the blank (42087-2-51A, -1-52) since 3.72.00. `detentFinished` reconstructs the finished part from that blank, so every length is still the blank's. The rest comes from three places:
- **The blank's orientation.** The detent stands on edge, its .131 width upright and its .041 thickness across in plan. 42093's isometric shows it, and so does the model, whose clamp screw is driven across the foot into the block (movement.js).
- **The spring.** The blank's window and its two webs, .0315 and .0275 high, are the two-strip detent spring: 3.63 mm long against the model's 3.69 mm.
- **What the blank can't give** comes from the 3D model's detent (shared/escapement.js, measured on KLUwI2UUCMQ 11:10-11:33 and Fig. 90, × 1.117): the plan thicknesses (blade 0.22 mm, arm 0.37 mm), the face they're thinned from, and the stone (Ø 0.61 mm). These are read from the model, not changed in it.

| Check | Result |
|---|---|
| The spring's thickness in plan | 0.0782 mm (.0031 in). This is derived: the model's 0.0882 mm at its estimated 1.06 mm of strip height, held to the same stiffness (∝ h t³ / L) at the drawn 1.50 mm and .143 length. Both springs are beryllium copper (the blank's material; escapement.js's EB, 128 GPa), and the model's stiffness is KD = E h t³/12/L, so holding h t³/L holds the stiffness (checked 2 November 2026, R-3). `tripping.json` maps the ring over 0.0559-0.1173 mm at the model's height (70.5-212.5 Hz), which is 0.0495-0.1040 mm at the drawn heights and length: 0.078 is inside it. (The 0.072-0.110 quoted here before was an older map, at the model's height.) |
| The stone's place | The model's 11.30 mm from the point of flexure, measured from the window's start, lands at 1.0499 in from the foot end. That is inside the drawn step for the jewel block (1.0082-1.0732), +0.23 mm from its middle. |
| The clamp screw | The model has it 5.54 mm before the point of flexure; the blank's slot is 5.35 mm before the window. |

Not formed:
- the horn and the arm's end, which the model bends across in plan, beyond the bar. The end land and its .050 slot are left as the blank has them; what the slot is for is not known.
- the second locating pin and the notch on the foot that 42093 shows.
- the stone itself (bought), the trip spring 42088 and its bracket 42092.

For `claude/hamilton-drawn-parts`, the detent in the model: its spring's strips are drawn 0.50 + 0.45 high (estimated), against the blank's 0.80 + 0.70. At the drawn heights the same stiffness needs a strip of 0.078 mm, not 0.088.

## The whole detent, with placeholders (2 November 2026)

42093 (detent assembly) lists twelve parts and gives no sizes for any of them. Only the detent itself is drawn in this set, and it is built here reconstructed. The others are placeholders: the 3D model's own solids, read off the page by `tools/hamilton_detent_export.py` into `tools/recipes/hamilton_detent_model.json`. Their sizes are the model's, measured on KLUwI2UUCMQ 11:10-11:33 and Fig. 90 and scaled × 1.117. Each is sewn into a closed B-rep solid, so it has a STEP file too. They are:
- the support block 42086, with its button and pins
- the adjusting screw 20756
- the clamp screw (37024 in the parts list, 37204 on 42093) and its washer 42251
- the lock-adjusting screw and its clamp screw (both 42091)
- the trip spring 42088 and its bracket 42092
- the screws 1770 (one for the bracket, one for the trip spring)
- the wedge pin 42089
- the locking stone

They are placed on the drawn detent, which the model's detent doesn't match in size:
- **Along it:** from the point of flexure, the window's start.
- **In height:** by the clamp screw's axis on the slot's centre line. Both detents are centred on it.
- **Across it in plan:** by each side's face. The detent's own thickness is scaled from the model's 1.22 mm to the drawn 1.04 mm.

The assembly stands on edge, as in the movement. `hamilton_parts.py` reports every overlap in it rather than failing on them:

| Overlap | Why |
|---|---|
| The drawn detent with the support block (0.39 mm³) and the adjusting screw (0.14) | The drawn foot is 15.37 mm long and 3.33 high, against the model's 12.11 and 2.12. The model's block, steady pins and adjusting screw were measured to fit the shorter foot. The blank's foot hole (.070 from its end) is not where the model's pins are (t −9.29 and −1.69 mm). Settling it needs the block's drawing (42086) or 42087-3-01. |
| The drawn detent with the bracket (0.15) and the wedge pin (0.01) | The blade's plan thickness is the model's estimate; the drawn jewel block is .065 long against the model's 1.01 mm block. |
| The locking stone with its wedge pin (0.0002) | The wedge bears on the stone: since the second pass the stone stands where the model has it across the detent (R-4). |
| The trip spring with its bracket (0.0001) | A sliver where the model's two parts meet face to face. |

Until the second pass the list also had the model's parts among themselves (the screws through the block, the washer round the clamp screw's head, the bracket's screws) and the bracket wholly inside the block. The first were the model's unholed parts, the second an inside-out block; both are fixed (S-1, S-2).

## Second pass (2 November 2026): solids and the sheets again

Every part's solid checked by a script, not by eye: OCP's validity and its check before a boolean (self-intersections, edges too small), free edges, the faces' and edges' sizes, the page's mesh (welded: every edge in two triangles, its volume against the B-rep's), and the STEP file read back (one solid, its signed volume). Every sheet compared again beside its part (`hamilton_visual.py`), the section of each turned part station by station against the sheet's lengths. `hamilton_parts.py` now runs the solid checks itself, so these can't come back silently: the check before a boolean, the page's mesh closed, the STEP read back as one solid of the same signed volume (integrated to 1e-9: the default integration is 0.14 mm³ out on the barrel). Planted faults fail: the helical spring's turns touching again, and the barrel's mesh with a triangle taken out.

| # | Part | Found | Fixed |
|---|---|---|---|
| S-1 | the detent's placeholders | The map onto the drawn detent, (t, n, h) → (x, y, z) = (t, h, n), is a reflection, so every mapped mesh came out inside out. Each sewn shell was then turned by its sign, but the block, fused from six, stayed inside out: its STEP read back at −140.7 mm³, and booleans against it returned their complement (the bracket "wholly inside the block" by 2.305 mm³, its whole volume; in the model's own frame they don't meet). The sewing also cut free edges, which split the block's hole walls and changed its volume; the block lost 18 mm³ in all. | Each triangle turned over; a part's meshes united as one manifold (manifold3d); each body sewn without cutting edges, outward, the block's two touching bodies fused. Every placeholder's B-rep now equals its mesh's volume, passes OCP's check, and its STEP reads back the same. |
| S-2 | the block 42086, the bracket 42092, the trip spring 42088, the clamp screw 37024 and its washer 42251 | The 3D model drives its screws across through unholed pieces (fine.py: det:Cylinder/det:Extrude), so the placeholders had no holes: the clamp screw through the block 1.52 mm³, the washer a solid disc inside the screw's head (0.96 of its 1.67 mm³). The block's pins fill its holes exactly, which left coincident walls (48 self-intersections). | Each screw's hole cut as its shank in the parts it passes into; the washer bored to the shank (+0.005 mm); the head seated on the washer (its first 0.28 mm the shank, the screw as long); the pins grown 0.001 across (a press fit). **For the 3D model (movement.js 1245):** the washer `42251.det` and the head of `37024` start together on the foot's face; the head should start on the washer's outer face. |
| S-3 | the trip spring 42088 | 58 faces of no area (sliver triangles in the model's mesh); its page mesh came from the face-by-face fallback, with holes. | Dropped in the union; the fallback is gone from `tess()`. |
| S-4 | the helical spring 42050 | The closed end turns were coiled at a pitch of exactly the wire's diameter, so they touched; the sweep cut itself and lost the turn at θ 360°, z .025 (the section showed half a coil there), 1 % of its volume. | Closed turns 0.01 mm apart (stated on the operation). |
| S-5 | the fusee and barrel arbors | Their page meshes weren't closed: one triangle of no area at each dome's pole. | `tess()` drops triangles of no area. |
| R-1 | 1-WD-265 mainspring end | The slot's square end has its corners broken 45° as drawn (BREAK CORNER points at one; about .025 on the sheet's scale against the .200 slot); the slot was cut with sharp corners. | Broken .025 × 45° (drawn, not dimensioned: estimated). |
| R-2 | 42013 winding ratchet | Checked the counterbores at 2,520 px/in: the .060 runs from the top face to the .077 land, the counterbore .024 deep, the land .015. | No change: the build matches. |
| R-3 | the finished detent | The spring's derivation: same material, KD's own form; the note's band was an older map (above). | The note restated. |
| R-4 | the finished detent's stone | The model's stone stands 0.151 mm off the detent's middle across (makeEsc's Jc, its flat's offset eJ); the seat was bored on the middle. | Bored where the model has it, 0.129 mm off the drawn detent's middle (its wall 0.088 mm); the stone placed with it. |

Also fixed: `hamilton_visual.py` and `hamilton_measure.py` failed on the parts added since the audit (the stone and the placeholders: no sheet, nothing on the XZ plane).

Matching, with nothing to change (each compared beside its sheet): the fusee arbor (.375, .310, .360, .875, .750, the cross hole .050 from the shoulder), the barrel arbor, the fourth pinion (.060, .445, .300, .260, .360, .940, the three stem diameters), the fourth wheel (spokes at 105°, 180°, 252° from its tables), the fusee wheel, the sustaining wheel (all twelve holes on the table), the winding and set-up ratchets, the barrel (the 1.575 the tapped holes' circle) and cap, the sustaining spring, the winding and set-up pawl springs, the winding, set-up and sustaining pawls (its .020 hole at point 2), both hooks, the links and the pin, the detent blank. The open items above (A-6, C-8, C-9, D-5, D-6) are still unsure on the sheets as rendered; none was settled.

## Subassemblies

Each subassembly is placed only by the sheets' numbers. `hamilton_parts.py` checks every pair of members for overlap: none may overlap unless the pair is a listed fit (press, tangent, or a spring's drawn preload). It reports each listed pair's contact or gap. All five pass.

| Subassembly | Members | Placed by | What the check shows |
|---|---|---|---|
| Fourth wheel and pinion (42073 complete) | 42072, 42073 | the wheel on the leaves' top face (.320 from the tip), its .100 bore on the collar .1000, the collar .005 proud | the rivet fit in contact |
| Barrel, cap and arbor | 42168, 42169, 42170 | the cap's step on the barrel's end, its spigot in the 1.500 bore, its holes turned to the barrel's (the cap's at 9 o'clock, the barrel's at 12); the arbor's bosses between the two boss faces | the boss faces .530 apart inside against .530 over the arbor's bosses: endshake 0 as drawn (the tolerances span −.006 to +.005); the bearings .0005 to .0011 in the bores; inside height .610 for the spring's .590 |
| Sustaining ratchet wheel complete with pawls (42009 complete) | 42009, 2 × 42010, 2 × 42007 | the pawls on holes 2 and 7 (the second the 180° image), swung 16° toward the ratchet; each spring's row 3 on the wheel's centre, its pin in hole 10 (6) and its screws over 9, 8 (4, 3) | each spring overlaps its own pawl by 0.114 mm³ as drawn free: the preload |
| Fusee arbor, wheel and maintaining work | 42022, 42015, 42016, 42009 complete, 42013 | see below | every listed fit in contact or clear; the spring's R .7000 edge in the R .700 recess a few µm over (tangent) |
| Fusee chain, a run of 9 spaces | 10 × 42004, 10 × 42246 (assumed), 4 × 42005, 42002, 42003 | as 42001: three plates at each joint, outer pairs on the odd spaces, centre links on the even, the hooks' thin ends the middle layer at the end joints (the barrel hook turned 180° about the axis, the fusee hook turned over), each pin centred on the .0285 stack | no overlaps; the pins clear their holes |

The fusee group came together from the sizes alone, and each fit leaves a few thousandths to spare:
- The fusee wheel's left recess (.600 × .055) takes the arbor's collar (.316 × .045), and its central ring (Ø .320) bears on the collar's left face. The wheel's .2300 bore then sits on the .2295 body. *Inferred from the sizes.*
- The sustaining spring (.050 thick) lies in the wheel's right recess (.055 deep). Pin 1 is .6100 from the spring's row 11 and goes into the wheel's .053 hole at r .610. Pin 9 is .6156 from row 5 and goes into 42009's hole 5 (.060 at r .616).
- The sustaining wheel (.050) sits on the rim land, round the boss's .055 projection (its .3000 bore on the .2995 boss).
- The winding ratchet sits against the boss's end at the pawls' level. It is turned so the pawls' tips sit in its teeth, which leaves 0.005 mm clear.
- **Not on these sheets:** how the winding ratchet is held to the arbor. The taper pin 42020's hole at .425 lies beyond it, likely for a part not in the set.

## Still open

- **Tooth forms (all toothed parts):** the sheets give only z, the module and the tips. Settling them needs 42071's cutter, which is not in the set.
- **Unsure readings:** the barrel's lip length (C-9); 42026's 65° (D-5); the detent notch's step (D-6); 42072's collar chamfer (A-6); 42170's start spiral and body relief (C-6).
- **Parts not in the set:** 42246 (the outer plate, assumed as 42005), 42011 (studs), 35794 (pins), the .0440-130 screws, 42017 (the sustaining spring's pins), 42018, 42020, 42042 (the anchor rivet), 42097 and 42098, 42087-3-01 (the finished detent), and the fusee cone. Asked for in `REQUESTS.md` on the drawn-parts branch.
- **Which face of 42013 meets the pawls:** it decides whether the drawn hand locks. In the fusee group the pawls' tips sit in the teeth; whether they bear on the locking faces when the train pulls is not yet checked.
- **Where 42050 (the helical spring) goes.**
