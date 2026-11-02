# Batch E: fusee chain (42001 assembly, 42002 and 42003 hooks, 42004 pin, 42005 centre link)

Method: sheets read blind first (crops at 3-9x of the 300 dpi PNGs), then the built measurements (r_hparts_audit/*.json, *.png), then the transcriptions and tools/recipes/hamilton.py. Inches unless stated. "Built" values come from the JSON fits; the hook arcs in the JSON are short-arc fits (e.g. .7483 for .7500, .0586 for .0603) so I compared endpoints and the sagitta, not the fitted radius: they agree within 0.0002.

Overall: every printed number of the outlines is built. Two real gaps: the .003 x 45 degree step chamfer on both hooks, and the hole-edge breaks on the centre link. Two transcription errors on 42001 (what ".030 MAXIMUM" measures; how many joints are drawn) and one wrong clearance figure on 42004. The builder's assumption that 42003 is 42002 with the tail cut at point 19 holds.

## 42002-1-01 barrel-end hook (built: barrelHook)

Sheet: scale 20:1, material 1.00 carbon steel, REDRAWN, DO NOT HARDEN, memos 4-20-42, 11-2-42, 10-20-43. Datum row 1 = (2.0000, 2.0000) = pin hole centre. Table has rows 1-18 (read at 3x, every digit sure). Tail points to +x, the bay (hook mouth) hangs below the axis (-y).

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Pin hole dia .0250 +0/-5 (.0245-.0250), through the thin end, at origin | sure | dia .0250 at (0,0), z .0053-.0148 | MATCH | built at the top of the tolerance |
| 2 | Eye R .0400 round point 1, from 18 round the left to 2 (|1-2|=.0400, |1-18|=.0400) | sure | cylinder d .0800 at origin, z .0053-.0148 | MATCH | corner (not tangent) at 2 and at 18, as drawn |
| 3 | Upper edge R .7500, centre row 3 (2.0644, 1.2854), from 2 (2.0209,2.0341) to 4 (2.2764,2.0048); |3-2|=|3-4|=.7500 | sure | arc ends (.0209,.0341)->(.2764,.0048); fit r .7483 | MATCH | fit radius is short-arc noise; arc passes through the step at (.05,.0352) as the true arc does (.0353) |
| 4 | Tip R .0050, centre row 5 (2.2750,2.0000), 4 to 6 (2.2778,1.9958) | sure | arc r .0050 at (.275,0) | MATCH | |
| 5 | R .1000, centre row 7 (2.2222,2.0790), from 6 to 8 (2.2222,1.9790) (|7-6|=.1000) | sure | r .1008 at (.2221,.0798), ends (.2778,-.0042),(.2222,-.0210) | MATCH | |
| 6 | Line 8 to 9, y = 1.9790 (to x 2.1811) | sure | line (.1811,-.0210)->(.2222,-.0210) | MATCH | |
| 7 | R .0230, centre row 10 (2.1811,1.9560), 9 to 11 (2.1586,1.9610) | sure | r .0231 at (.1811,-.0441) | MATCH | |
| 8 | R .0603, centre row 12 (2.0998,1.9742), 11 to 13 (2.1482,1.9383); 12 lies on the line 10-11 extended (S-curve tangent), checked | sure | r .0586 at (.1013,-.0265), same endpoints | MATCH | the fit's centre is off by .0015 but the chord is only .025 long; sagitta differs by about .00004 |
| 9 | R .0750, centre row 14 (2.0879,1.9829), 13 to 15 (2.0685,1.9105); 12, 13, 14 collinear (internally tangent at 13) | sure | r .0749 at (.0880,-.0172), ends (.1482,-.0617),(.0685,-.0895) | MATCH | |
| 10 | Straight 15 to 16 (2.1098,1.9667) | likely (drawn straight; both ends on the table) | line (.1098,-.0333)->(.0685,-.0895) | MATCH | |
| 11 | R .0125, centre row 12, 16 to 17 (2.0974,1.9864) (|12-16|=.0125, |12-17|=.0124) | sure | r .0124 at (.0999,-.0258) | MATCH | |
| 12 | Straight 17 to 18 (2.0293,1.9727) | likely | line (.0974,-.0136)->(.05,-.0231) then the eye circle | MATCH | built splits the line at the step x .05; the line passes (.05,-.0231) on the sheet's own slope |
| 13 | Thick body .0200 +-5 | sure | z 0 to .0200 | MATCH | |
| 14 | Link end .0095 +0/-5, over the hole end | sure | z .0053 to .0148 (.0095 thick) | MATCH | |
| 15 | Thin end centred on the body's mid-plane? Section: thick spans 288-410 px at 6000 px/in, thin 316-374: .0051 above, .0059 below | likely centred (offset .0004 is inside the drawing's reading error and the +-.0005 tolerance) | centred (.00525 each side) | MATCH (likely) | answers the builder's open question: centred |
| 16 | Step at .050 +5/-0 from the pin hole centre (the dimension runs from the hole's centre line to the thick face) | sure | thick starts at x .0500 | MATCH | tolerance +.005 -0 not carried (builder wrote it into the sizes) |
| 17 | ".003 AT 45 deg" chamfer at the step. The zoomed section shows it on BOTH faces: thin face -> 45 deg over .003 (x .047 to .050) -> then a square wall of about .0023 up to the thick face (.00525 total rise per side). Plan shows it as the double line across the part, .003 apart | sure for the .003 and both faces; the vertical remainder is read, not dimensioned | no chamfer: section corner is square at x .05; plan shows one line | NOT BUILT | recipe flags it "not cut". Volume effect is tiny (about 0.0005 mm3 a side order) but it is on the sheet; the plan's double line is it |
| 18 | DO NOT HARDEN, 1.00 carbon steel | sure | same | MATCH | |
| 19 | Overall extent: tip .2750+.005 = .280 x, belly -.0921 y, top .0352 | derived | box x -.04..+.28, y -.0921..+.04 | MATCH | |

Hole-in-thin-end side view: hole dim .0250 +0/-5 spans between the two vertical lines (read .0238 at 6000 px/in: drawn width, within dimension-line reading). MATCH.

## 42003-1-01 fusee-end hook (built: fuseeHook)

Sheet: same frame. Table rows 1, 3, 12, 13, 19 only. Dotted tail with "REMOVE DOTTED PORTION"; "FOR ALL OTHER DIMENSIONS SEE PART #42002" (no thicknesses, hole or step number on this sheet, only the shapes). The side section is drawn the same as 42002's, unlabelled, with the same slanted step and the same centred thin end (here top gap 25 px, bottom 25 px: centred).

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Upper edge R .7500, centre row 3, cut at row 19 (2.1029, 2.0344); |3-19|=.7500 | sure | arc ends (.05,.0353)->(.1029,.0344), fit r .7341 (short arc) | MATCH | |
| 2 | R .0603 about row 12 from 19 round the right to 13 (|12-19|=.0603, |12-13|=.0603); 3, 19, 12 collinear: tangent to the .7500 arc at 19 | sure | arc r .0602 at (.0998,-.0258), 13 to 19 | MATCH | the same circle as 42002's .0603 S-curve arc and the .0125 throat (all row 12) |
| 3 | Belly R .0750 about 14 from 13 to the lower tip 15 | likely (by the note "see 42002", not redrawn with numbers; the drawn shape follows the same belly) | r .0749, 13 to 15 | MATCH | |
| 4 | Straight 15 to 16, R .0125 about 12, straight 17 to 18, eye R .0400 | likely (same note) | same lines/arc as 42002 | MATCH | |
| 5 | Hole .0250, thin .0095, thick .0200, step .050 | by the note only | same | MATCH (inferred, sheet gives the shape not the numbers) | |
| 6 | .003 x 45 chamfer at the step | shape drawn on the section, no dimension (by note: 42002's) | none | NOT BUILT | as 42002 |
| 7 | Dotted tail not part of it | sure | absent | MATCH | |

Builder's assumption "42003 is 42002's outline with the tail removed at point 19" HOLDS: the plan of 42003 shows the same eye, same straight edge 18-17, same throat, same belly and the .0603 arc carried on to 19. Only the upper edge ends at 19 and the .0603 arc wraps from the belly to 19 (the part of that arc 11-13 on 42002 is just a different stretch of the same circle). Built outline agrees: x max .1601 = .0998 + .0603.

## 42004-1-01 link pin (built: linkPin)

Sheet: scale 50:1, DRILL ROD, DO NOT HARDEN, memo 11-2-42, REDRAWN.

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Dia .0240 +-3 (.0237-.0243), end view circle with centre lines | sure | d .0240 | MATCH | |
| 2 | Length .045 +1/-0 (.045-.046) | sure | z 0 to .045 | MATCH | |
| 3 | Plain rectangle, no chamfer, no head, no flats | sure | plain cylinder | MATCH | |
| 4 | Drill rod, do not harden | sure | same | MATCH | |

## 42005-1-01 centre link (built: centreLink)

Sheet: scale 20:1, 1.00 carbon steel, DO NOT HARDEN, memo 11-2-42. Table rows 1-8; holes at rows 1 and 5.

| # | drawing reads | sure? | built | verdict | note |
|---|---|---|---|---|---|
| 1 | Holes dia .0250 +0/-5 at rows 1 (2.0000,2.0000) and 5 (2.0940,2.0000) | sure | d .0250 at (0,0) and (.094,0) | MATCH | |
| 2 | Pitch .0940 | sure | .094 | MATCH | |
| 3 | End arcs R .0425 "CONCENTRIC WITH HOLE" (|1-2|=|1-8|=|5-4|=|5-6|=.0425) | sure | d .0850 at both holes, arcs r .0425, ends (.0235,+-.0354), (.0705,+-.0354) | MATCH | |
| 4 | Waist arcs R .0425, centres row 3 (2.0470,2.0708) above and row 7 (2.0470,1.9292) below, from 2 to 4 and 8 to 6; concave | sure | r .0424 at (.047,+-.0707) | MATCH | waist half-width .0283; overall .179 x .085 |
| 5 | Thickness .0095 +0/-5 | sure | z 0 to .0095 | MATCH | |
| 6 | "CORNER HOLES BOTH SIDES" with an arrow at the left hole's edge in the section: break (chamfer) the hole edges on both faces, no size. 42001's section shows the outer plates' hole mouths countersunk/chamfered for the rivet; the centre link at the joint shows diagonal edges at the hole too | likely (meaning of "corner"; the size is nowhere) | plain sharp holes | NOT BUILT | recipe lists no flag for it; add one (size not given, estimate) |
| 7 | No other features | sure | none | MATCH | |

## 42001-2-01 fusee chain assembly (nothing built from it)

Read blind. Scale 10:1, material blank, REDRAWN, drawn K.R.A., checked B.L.H., memos 11-2-42, 6-3-43, 10-20-43.

Parts list: 42002 x1, 42003 x1, 42004 (link pin) x298, 42005 (centre link) x148, 42246 x298 (sure; every number read at 3x).

Counts reconcile: 297 spaces, 298 joints (298 pins). Odd spaces (1, 3, ..., 297 = 149) each take a PAIR of 42246 plates = 298; even spaces (2, ..., 296 = 148) each take ONE centre link 42005. So 42246 is a single plate (an "outer link" half), used in pairs. Every joint has three plates abreast ("on this edge ALL 3 LINKS AT EACH JOINT MUST BE COINCIDENT, AND SQUARE WITH FACE OF LINKS"): the pair of one space plus the single of the next. At joints 1 and 298 the single is the hook's thin end.

Length: "297 SPACES @ .0940 = 27.92 +-10" (27.918 nominal; +-.10 on the whole length, tolerance in last place). Pitch .0940 sure.

Other notes (verbatim, sure): "SLIGHT CONVEXITY ON OUTSIDE FACES OF LINKS DESIRABLE" (end section at right, outer faces drawn slightly bowed); "RIVET. FINISH FLUSH WITH FACES OF LINKS. #1 EMERY FINISH."; "LINKS MUST FLEX FREELY ABOUT PINS WITH MINIMUM CLEARANCE AT ALL JOINTS TO INSURE MAXIMUM LATERAL RIGIDITY."; "HARDEN AND DRAW AFTER ASSEMBLING."; ".030 MAXIMUM" (see below).

Plan: it draws four joints at each end (hook, pins 1-4; pins 295-298, hook), broken by a wavy cut in the middle. The outer-link outline in the plan is the same figure-eight as the centre link (end circles and concave waists, same pitch); no dimension, no coordinate table: 42246's outline is NOT given, only its visual likeness. Its thickness is not dimensioned either. In the side section the outer plates measure about .0095-.0100 and the whole stack about .029 (3 x .0095 = .0285). 42246's sheet is not in the set, so its hole and edge breaks are unknown.

Side section (first two joints hatched, the rest plain outlines with the break): outer plate / middle plate / outer plate. At the hooked ends the middle layer is the hook's thin end, between the pair; the hook's thick body begins beyond the pair's end circle (step .050 from the pin; plate end circle reaches .0425).

| # | drawing reads | sure? | built / checked | verdict |
|---|---|---|---|---|
| 1 | ".030 MAXIMUM": the extension lines drop from the TOP and BOTTOM of the plate stack (levels 115 and 203 px at 3000 px/in = .029), not from the hook shank (128-188 px = .020) | sure (extension lines at the stack's level, hook inside them) | the stack is 3 x .0095 = .0285, the hook body .0200 | the .030 limits the CHAIN's total thickness; the transcription's "thickness of the fusee-end hook's shank" is wrong |
| 2 | Hook body thickness in the side view: 60 px = .020 | sure | .0200 | MATCH |
| 3 | The hook's thin end is the middle layer of the end joint, centred in the stack: hook mid-plane = middle plate mid-plane | likely | thin end built centred | consistent |
| 4 | Pin drawn in the section as an unhatched box dia about .024; its ends sit about .005 inside the outer faces, outer plate hole mouths chamfered with chevron rivet hatching beside them; note says finish flush | unsure how to read the drawn recess (upset rivet shown schematically) | pin .045 long | pin .045 > stack .0285: the 0.0165 excess (.00825 each end) is the upset stock; the transcription's "likely" reading is consistent with the section |

## Disagreements with the transcription

1. 42001 item 2: ".030 MAXIMUM" is the plate stack's overall thickness (outer pair + middle plate = .0285 nominal), not the fusee hook's shank (the hook shank is .020). The recipe's note ("42001 gives .030 the most thick") reads either way, but the transcription says shank. I am sure: the extension lines start at the stack's top and bottom edges.
2. 42001 "What the sheet shows": it says only the first and last two joints are drawn. The plan draws four pins at each end (first four, last four), the section hatches the first two.
3. 42004 "diametral clearance .0003 to .0018": from hole .0245-.0250 and pin .0237-.0243 it is .0002 to .0013 (min .0245-.0243, max .0250-.0237). The transcription's figures do not follow from the printed tolerances either way.
4. 42002/42003 chamfer: the transcription and recipe call it ".003 chamfer, not cut" at "the step". Reading the section: it is on both faces and 45 deg over .003 only from the thin face, then a short square wall (about .0023) up to the thick face; the plan's double line (two lines .003 apart) is its two ends. The transcription is right that it is a chamfer; the recipe leaves it out.
5. 42002 transcription "which of points 14, 16, 17 each straight edge meets": settled by my read, 14 is a centre only; the two straights are 18-17 and 15-16 (sure now, both ends are on listed points and the arcs they join are tangent-checked by the numbers).
6. 42005 item 5 agrees ("break both faces' hole edges, size not given"); the recipe has no flag for it (the centre link's `flags=[]`).

## Builder estimates the sheet settles

- "The thin end centred on the body's middle: likely" (both hooks): the 42003 section is plainly centred (25 px each side); the 42002 section is centred within .0004 (top .0051, bottom .0059 at 6000 px/in, inside the thickness tolerance). Settled: centred, likely to sure.
- "The belly as 42002's: likely" (42003): the plan of 42003 draws the same belly and straights; only the table lacks rows 14-18 (the note says see 42002). Settled for the shape (likely to sure).
- "The step's .003 x 45 deg chamfer: not cut": it is on the sheet; it is a defined feature, no longer an estimate; build it (both faces, then the short square wall).
- 42004's "riveted flush with the links": the sheet's note (42001) says it; the stock .0165 longer than the stack is derived, consistent.

## Joints and fits (to assemble a chain run from the sheets alone)

Frame: inches; chain axis along the hooks' x. Joints at multiples of .0940 from the first pin. Stack (z): outer plate .0095 | middle plate .0095 | outer plate .0095 = .0285 (the .030 maximum leaves .0015 for convexity and tolerances; plates .0095 +0/-.0005, so stack .0270-.0285).

- Every pin hole is .0250 +0/-.0005 (hooks and centre link); pin .0240 +-.0003 gives .0002 to .0013 diametral clearance ("minimum clearance, flex freely").
- Pitch .0940: pin to pin. 42005 holes at 0 and .0940; the outer plate (42246) presumably the same, so the outer pair sits on pins k and k+1 for odd spaces, the centre link on pins k+1 and k+2 for even spaces.
- Joint 1: pair of 42246 (space 1) outside, hook thin end (.0095) as the middle layer. Joint 2: the same pair outside, centre link 42005 (space 2) in the middle. Joint 3: pair of space 3 outside, centre link of space 2 in the middle. And so on: 297 spaces, pins at 0, .0940, ..., 27.918 (+-.10 overall). Last joint 298: pair of space 297 + the fusee hook's thin end.
- Hook thin end fits between the pair: the gap between outer plates equals the middle plate's thickness (.0095 +0/-.0005), the hook's thin end is the same thickness: it replaces a centre link. The hook's thick body (.0200) starts .050 (+.005/-0) from the pin centre; the outer plate's end circle reaches .0425, leaving about .0075 of free length (and the .003 chamfer takes the first .003 of it).
- Z placement: with the hook built z 0 to .0200 (thin .0053 to .0148), the middle plate at z .0095-.0190 (if the outer plates occupy 0-.0095 and .0190-.0285), shift the hook by +.00425 so mid-planes coincide (hook thin .0095-.0190; thick .00425-.02425, inside the stack).
- Orientation, from the assembly plan (tested for handedness): left hook (42002, barrel end): turned 180 deg about the plate normal (sheet (x,y) -> (-x,-y)): tail points left, mouth opens upward; the chain runs +x from its pin hole. Right hook (42003, fusee end): the sheet's outline MIRRORED in y (i.e. the part turned over about the chain axis): body to the right, mouth opening upward, tip pointing up at its left; the chain runs -x from its pin hole. Both hooks' head circles (R .0400) sit inside the outer pair's end circle (R .0425): head circle centre = pin hole, so it is 0.0025 smaller than the plates.
- The pin goes through all three plates at every joint, riveted flush (stock .045, stack .0285; .00825 each end to upset into the chamfered/countersunk hole mouths, "corner holes both sides" on the centre link; the outer plates' holes are on 42246's sheet, not in the set).
- "On this edge all three links at a joint coincident and square with the face": one edge of the chain is a reference edge, the plates' faces flush there (the convexity of the outer faces is on the outside only).

## Fixes recommended, most important first

1. Cut the .003 x 45 deg step chamfer on both hooks, both faces (thin face to thick over x .047 to .050; then a short square wall to the thick face), and show it as the double line in the plan. It is dimensioned (42002) and drawn on 42003's section.
2. Add the hole-edge breaks to the centre link (42005 "CORNER HOLES BOTH SIDES", size not given; mark as estimated) and a flag in the recipe; note that the outer plates' (42246) hole mouths are drawn on 42001's section as countersunk for the rivet.
3. Correct the 42001 transcription: ".030 MAXIMUM" is the plate stack, and the plan draws four joints at each end, not two.
4. Correct the 42004 transcription's clearance (.0002 to .0013).
5. Record the hooks' orientation and z placement above (left: 180 deg turn; right: mirrored in y, i.e. turned over) wherever the chain is assembled; the 42246 outline is not on any sheet in the set (visual likeness to 42005 only), so a built chain should mark it as "assumed as the centre link".
6. Clean up the recipe notes: the "estimated: thin end centred" and "belly as 42002's" flags can be downgraded to "likely/sure from the sheet" (see above).
