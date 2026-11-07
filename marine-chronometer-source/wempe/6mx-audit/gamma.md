# 6MX audit, Gamma: case, boxes, dial, the ring's screws, the contact

Session Gamma for Session Alpha, 7 November 2026. Blind re-measurement of the Soviet 6MX version against Kirov No. 247's photographs
(References/wempe/photos/dg-chrono-6mx/, dg-chrono-6mx-gallery/leben-des-6mx/). Scripts and outputs in `gamma/` (each script's docstring
gives its method). Known beforehand: Alpha's brief named the dial screws' angles (114/234/354), the ring screws' angles (342/102/246), the
bowl's rim Ø 110.5 and body r 52.4, the box 190 and the contact's part numbers; the k247_Z spec gave the dial screws' model places. Each
row says so where it applies, so a "match" there is read with that in mind.

Angles: "cw" is clockwise from 12 seen from the dial (the dial screws' convention in dial.js/frame.js: x = r sin a, z = -r cos a);
"brg" is frame.js's `brg(b)` convention for the ring's screws (x = -r sin b, z = -r cos b), counterclockwise seen from the dial.

## Calibrations

| photo | what scales it | result |
|---|---|---|
| 1_Kirow_247_Z.jpg (dial) | the up-and-down circle's and seconds track's printed circles fitted (144 and 89 points, rms 0.2 px), their centres the arbors at z -23, +23 (the sheets'); 12 o'clock along them (0.56° left of the image's vertical); the minute track's centre 0.51 px off their midpoint | 8.796 px/mm on the dial plane; the minute track's ellipse 0.9967 round (about 4.6° of tilt: ±0.3 % across it) |
| 3_Kirow_247_uZ.jpg (dial off) | pinhole camera on k247_uZ's 11 drawn movement points (screw heads refined on their rims) plus the pillar plate's rim (r 42.494 at y 3.35), 62 edge points at 3.0 px rms | residuals 0.5-5.7 px; f not determined (the cost falls toward f 1040 px, 128 mm, which is implausible), so readings are given at f 1040/2400/4500. Bearings move < 0.3° with f; radii by 1-1.5 mm |
| 2_Kirow_247_A.jpg (train side) | pinhole camera on 6 drawn screws (k247_A's points less the 6MX-only screw at 6 and the lower cock screw, whose rim fit failed), f fixed at Alpha's fitted 5379 px (629 mm) | residuals 1.7-7.1 px; leave-one-out moves bearings by ±3-5°: weak, corroboration only |

## Rows

| part | photo | scale and its source | reading ± | model value | verdict | how sure |
|---|---|---|---|---|---|---|
| dial screw by 12 (place) | Z | dial plane, 8.796 px/mm (arbors) | r 49.93 ±0.15, cw 353.8 ±0.3° (head rim, 68 pts, 0.29 px rms) | r 49.9 at 354 (frame.js, dial.js); known beforehand | match | sure (two photos: uZ's tapped hole at cw 354.1-354.3) |
| dial screw by 4 (place) | Z | as above | r 49.97 ±0.15, cw 113.6 ±0.3° | r 49.9 at 114; known beforehand | match | sure (uZ hole cw 113.6-113.9) |
| dial screw by 7 (place) | Z | as above | r 49.75 ±0.15, cw 234.0 ±0.3° | r 49.9 at 234; known beforehand | match | sure (uZ hole cw 234.5-234.6) |
| dial screws' heads and sinks | Z (247); 1_Kirow_2973_Z (Alpha's second test) | each dial's own arbors (247 8.796, 2973 8.310 px/mm); dhead.py's radial profiles (median over 72 rays, the slot's rays dropped) | two edges on every screw: the head's (the fall into the dark crevice) Ø 1.64, 1.73, 1.82 (247), 1.85, 1.88 (2973); the crevice's outer edge onto the dial Ø 2.21, 2.23, 2.23 (247), 2.36, 2.43 (2973). The slot runs across the head. 2973's screw by 7 is missing, its hole empty; its two others at r 50.17/49.71, cw 354.0/114.0 | head Ø 1.7 (DL.ds r 0.85), sink Ø 1.8 (DL.sc.sr 0.9), shared by every version | head: match. Sink: mismatch, about Ø 2.3 (2.2-2.4) on the 6MX's dials against 1.8 | head sure; sink likely (two chronometers; the dark ring's outer edge could be a chamfer at the sink's mouth rather than its bore). A fix would be 6MX-only: DL.ds and DL.sc are shared, so the 6MX needs its own sink value and the drawings' stay as they are |
| ring screw at 342 | uZ (opening in the ring's cone, centre on the hole's axis, unprojected at y 8.6); A (head arc, y -2) | uZ camera; A camera | uZ brg 342.0 (LOO 341.7-342.0), r 44.4-46.3 by f; A brg 343.4 (LOO 341.5-347.6), r 44.6 | brg 342.2, r 44.5; known beforehand | match | sure on angle (uZ), likely on radius |
| ring screw at 102 | uZ, A | as above | uZ brg 101.8 (LOO 101.5-101.8); A 100.7 (97.7-102.3), r 45.2 | brg 102.2, r 44.5; known beforehand | match (0.4°) | likely |
| ring screw at 246 | uZ, A (247); 2_Kirow_009_A, 2_Poljot_20027_A (Alpha's second test) | uZ camera; A camera; and on all three A views without a camera: the top plate's rim (r 42.494) fitted as an ellipse, bearings about its centre (ringgaps.py, ringgaps2.py) | 247: brg 247.4 (uZ, LOO 247.0-247.5), 247.4 (A, rim ellipse, image-up as 12); gap from the 102 screw 145.6 (uZ), 145.3 (A). Kirov 009: 246.0, gap 143.8 (both heads cleanly fitted, 0.25-0.28 px). Poljot 20027: 247.9, gap 146.2 (one head a short arc) | brg 246.4, gap 144.2; known beforehand | within the chronometers' scatter: 247 +1.0, 009 -0.4, 20027 +1.5; the model's 246.4 lies inside 246.0-247.9 | the readings split. **The owner's answer (7 November 2026): keep 246.4**; Kirov 247's 247.4 and the three chronometers' scatter (246.0-247.9) recorded here |
| the gilt flange's outer edge (movement ring, 05 08 00-3) | Z | dial plane (the flange's top, 11.05, at the dial's depth: no correction) | r 53.04 ±0.1 (249 pts, 0.26 px rms) | RING.flD 105.90: r 52.95 | match | sure |
| the bowl's rim (its threaded rim, the silhouette in Z) | Z | dial-plane scale; the rim's top flush with the flange (case.js), so ±0.3 for its depth | r 55.38 ±0.3 (231 pts, 0.16 px rms): Ø 110.8 | crest r 55.276 (Ø 110.55; rim Ø 110.5); known beforehand | match | likely (one photograph of 247; Z is the bezel-off view) |
| the dial's white field, its edge | Z | dial plane | r 51.27 ±0.1 (1.8 px rms: a soft edge) | the disc DR 51.78 | can't tell: the white ends 0.5 inside the disc's edge (a bevel or the paint's margin) | — |
| the bezel and its thick glass | — | — | no photograph of Kirov 247 shows the bezel (Z is bezel-off); only later or other Kirovs (23239's box view, 14917's video, 422) | built from Kirov 422 | can't tell on 247 | — |
| the contact: arrangement | 10_ (247), 14_E-Kontakt1/2 (no serial: the model's comment calls it Kirov 2973; corroboration only) | — | two gilt plates on black fibre, two screws on fibre washers on each, a screw on a raised block by each, the upright knurled disc between them, the spiral under the cock, the threaded contact screw along the front | the same (Alpha's renders through m6_contact and m6_contact_front) | match | likely |
| the contact: block screws' heads, their size | 10_ (247); 14_E-Kontakt1 (2973) | pillar 39's body, Ø 8.0 (Beta: the drawn pillars' size), its two silhouette edges in windows (193.0 px on 10_, 170.2 on E-K1); each head's silhouette in windows set on crops (cthead.py, r_cth_*.png); each scaled for its depth by Alpha's photocompare cameras (m6_contact, m6_contact_front: loose) | 247: Ø 3.32, 3.42, 3.90 raw, 3.52, 3.23, 3.70 with depth; 2973: 3.76, 3.43, 3.50 raw, 3.86, 2.89, 3.34 with depth. The pillar 0.5 nearer or farther from the centre moves each by 0.6-1.4 % | Ø 3.1 (train.js 6MX.cts, r 1.55) | match within the reading (Ø 3.2-3.7, the cameras' depth correction the loosest term); no fix | likely. **Withdrawn:** the first pass's "about Ø 2.2" (54-61 px) searched outward from each head's centre and caught its slot and reflections, not its silhouette (76-82 px) |
| the contact: block screws' spacing in each block | 10_, 14_E-K1/2 | ratios: a head's silhouette width over its block's own gap (the silhouettes as cthead.py reads them) | 10_: 80/174 = 0.46 (block 57), 82/237 = 0.35 (52); E-K1: 80/211 = 0.38, 74/209 = 0.35 | 3.1/8.52 = 0.36, 3.1/7.89 = 0.39 in plan (more as projected) | match within the reading | can't tell closer |
| the contact: places of its parts in mm | 10_, 14_E-K1 | cameras fitted only on drawn parts (the top plate's inner-face rim and pillar 39's silhouette): 3.6-5.9 px rms, f not pinned (cost flat over 2500-5000) | not measurable better than about ±1 mm | — | can't tell | — |
| the bowl's outside: its profile's radii | 13_Kirow_2973_E-Kontakt4 (side on, the whole profile); 12_ (247: its collar runs off the frame, so only the body and thread) | ratios of the silhouette's full widths at one depth (both edges per row), chained from the rim | 2973: collar 1003 px, thread band 978, body 926-948 (widening slightly down the photograph); body/collar 0.93, thread/collar 0.975, body/thread 0.956. 247: body 962-968, collar over 1017 (clipped) | 52.4/56.6 = 0.926, 55.25/56.6 = 0.976, 52.4/55.25 = 0.948 | match (within the perspective's ~1 %, ±0.5 mm on r) | likely |
| the case brackets' pivot holes, height under the rim's top | 12_, 13_2973 | — | the rim's near top edge can't be told from its far edge beside the bracket on these views | 3.0 under (DY6 7.0, Alpha confirms with Delta's weighing) | can't tell (no better than the model's own ±2) | — |
| the boxes and outer box | 13_, 14_ (247) | ratios; mm only through the TU's 190 | the fork's rows: gamma/box_rows.md (likely: middle tier 72.8 against 68; the badge 0.779 of the hasp's width against 0.728, and centred in its tier; the outer lid's front 0.466 of its width against 0.536; the catch drawn Ø 20 against its own comment's 26 and the photograph's about 29) | case.js | see box_rows.md | see box_rows.md |
| the ring screws' heads | 2_Kirow_247_A (two heads cleanly fitted on their visible arcs) | the A camera's scale at the top plate (8.866 px/mm at y -22), the heads about 20 mm deeper at about 630 mm: 3 % more | Ø 6.04, 6.14 at the plate's scale, so about Ø 6.2-6.3 | Ø 6.2 (frame.js, the 6MX's WN-56, head r 3.1) | match | likely (one photograph; uZ shows only their holes) |
| the locking bracket's two screws: spacing over head width | 12_ (247), 13_2973_E-Kontakt4 | ratio at one depth, no camera; the heads' faces 0.92 round (cos of the view's tilt) for the vertical spacing | 247: 63 px apart, heads 62 wide: 1.10 corrected; 2973: 67 and 62: 1.17 corrected; the two heads nearly touch on both | 7.4 apart (h -20.0, -27.4), heads Ø 4.8: 1.54 | mismatch: the screws closer together for their heads (or the heads larger), about 1.1-1.2 | likely on the ratio (two chronometers); which of spacing and head size can't be told without a scale at the bracket. Alpha (7 November 2026): recorded as can't tell, not fixed |
| the bowl's outside contact fittings (each spring's two screws 65 and its socket) | 12_ (247), 13_2973_E-Kontakt4 | their image x fitted as points round a cylinder seen from afar (sockets.py: the view's centre and scale free) | arrangement: on each side two slotted screws on dark washers and a socket; 2973's sockets carry knurled caps, 247's are open. Bearings read 179.0, 188.4, 200.6, 216.1, 225.5, 235.5 (247) and 178.7, 188.7, 200.8, 216.0, 225.1, 235.9 (2973), within 1 deg of the model's (leaving one out of the fit: within 2.5 deg) | 178.4, 189.3, 200.6; 215.7, 225.2, 235.9 (case.js) | match | likely |
| the bowl springs 66 inside (feet on insulating strips, three tines each) | 11_ (247) | - | two springs, each three tines rising from a curved foot held by two screws on a dark strip, leaning in | the same (case.js 6MX.cf) | match in arrangement; sizes not measured | likely (arrangement only) |
| the bowl's cone and foot | 13_2973_E-Kontakt4 rows 556-640 | ratios of width | the body's silhouette narrows from row about 560 (948 px) to 842 px at row 640, where the frame ends | a shallow cone from r 52.4 at h -46.7 to the foot r 36.7 at -55.3 | can't tell (the foot and the cone's end are out of frame) | - |
| the bowl's inside below the seat; the flat closing plate | none: no photograph of Kirov 247 or 2973 shows them (11_ shows the bore and the springs only) | - | - | estimated in the model | can't tell | - |
| the high brackets | 12_, 13_2973 | - | their shape (an upright with the pivot hole, an arm along the band with a slotted screw in a slot, its foot screw) matches; heights can't be told (above) | case.js | match in arrangement | likely (arrangement only) |
| the centre's gilt boss (a hand's boss; the hour pipe's collar is hidden under it) | Z | dial plane, about 2-5 mm above it, so 1-2 % smaller | outer edge Ø 8.3 at the dial's scale, Ø 8.15-8.25 allowing for its height; an inner step at Ø 2.2-2.4 | a hand part's rf 8.2/2 (dims.js: Ø 8.2); 2.2045 the next | match | likely |
| the dial's printing (the Kirov layout) | - | - | can't be tested on 247: dialface_kirov.js was traced from this same photograph (dialtrace.py), so agreeing with it proves nothing; 2973's dial (lower rank) is the only independent check, not done | - | not tested | - |
| the contact's other parts: disc 55, lever 60, staff 69, the cock, the spiral 59, the contact screw 54, the contact wheel 62 | 10_, 14_E-K1/2 | - | arrangement only (the upright knurled disc, the spiral under the cock, the lever down to the screw, the threaded screw in its holder along the front) | train.js | match in arrangement; nothing measured | - |
| the hands | see "The hands" below | | | | | |

## Box rows against a second photograph (Gamma, after the fork)

The fork's rows (gamma/box_rows.md) rest on Kirov 247 alone, and several on one frame of it (14_ for the tier, badge and hasps; 13_ for the
outer lid, its tab and the catch). By the owner's two-photograph rule each single-frame "likely" there is doubtful until a second box
agrees. Kirov 2973's box front (bilder-zum-6mx/14_Kirow_2973_Kasten.jpg, square-on like 247's 14_) was read for the three ratios that don't
need a scale (px off the gridded frame, ±5 px):

| part | 247 (14_) | 2973 | model | verdict | how sure |
|---|---|---|---|---|---|
| middle tier over the hasp's width | 1.392 | 548/458 = 1.20 | 68/53 = 1.28 | the two boxes differ (73 and 63 at a 53 hasp); the model's 68 lies between | doubtful: for the owner (247 outranks, but the second box disagrees) |
| the badge's width over the hasp's | 0.779 | 343/458 = 0.75 | 0.728 | 247 3 % over 2973, both over the model | doubtful (within the boxes' scatter) |
| the badge's centre down its tier | 0.511 | 0.50 | 0.553 (30.4 over the lower line of 68) | mismatch: both boxes centre it, the model has it about 1.4 low | likely (two boxes) |
| the outer lid's front, its tab, the catch (B12, B14, B16) | 13_ only | not checked | - | as box_rows.md, downgraded to doubtful | the catch's code (cylY(10,2,40): cylY takes a radius, core.js:586, so Ø 20) disagrees with its own comment (Ø 26) for sure, whatever the photographs say |

The fork's body-tier row (B1) was not blind (a grep had shown the model's 97); its other rows were.

## Alpha's rulings and the fixes made (7 November 2026)

- **Dial screws' sinks: fixed**, the 6MX only (dial.js, `MX6`): the drawings' Ø 1.8 sink 1.0 deep, opening in a 45° chamfer to Ø 2.3 at the face,
  0.25 deep (the form estimated, as the more conservative reading; the Wempe README's "Estimated"). The drawings' DL.sc and DL.ds are unchanged.
  The printed face's holes round the 6MX's screws follow at Ø 2.3.
- **The box's badge: fixed**, centred in the glazed lid's tier (case.js: 34 over the lower line, 30.4 until now).
- **The outer box's catch: fixed** to its comment's Ø 26 (cylY radius 13; Ø 20 until now). Kirov 247's single oblique frame reads about 29: doubtful, recorded.
- **Contact block screws' heads: no fix.** Re-measured on pillar 39's Ø 8.0 (Beta) with the heads' true silhouettes, they read Ø 3.2-3.7 on 247 and 2.9-3.9 on
  2973 against the model's 3.1: a match within the reading. The earlier "about Ø 2.2" was a measuring error (internal edges, not the silhouette): withdrawn.
- **Locking bracket:** can't tell; not fixed.
- **Ring screw at 246.4:** to the owner, recommended kept (inside three chronometers' scatter). **Box middle tier:** kept (inside the scatter).

Checks after the fixes: `solids.py --model wempe` (0 not solid, both states), `audit.py box --model wempe --rev 6mx` (nothing new), `holecheck.py --model wempe`
(1,633 holes over five versions, 0 failing), `photocompare.py k247_Z` (the dial screws' crops: the chamfer's ring the photograph's size, lighter than its dark
crevice: lighting and material on an estimated form), `isolate.py` of the box with the lid and of the outer box beside 13_ and 14_ (the badge centred between the hasps
as on 247; the catch Ø 26), `smoke.py --model wempe`.

## The hands (Alpha's request, 7 November 2026)

The model gives the 6MX the drawings' hands: dial.js builds one set (part 'hands', no per-version group), as the drawings draw them. Read on 1_Kirow_247_Z.jpg at its
arbors' scale (8.796 px/mm), each hand laid out straight about its arbor (handstrip.py) and read across its axis. The same readers ran on photocompare.py's render
of the model through k247_Z's camera, at the photograph's time, so their bias falls out of the comparison (handedge.py, handwidth.py, handfull.py; strips r_hands_pm.png,
r_hands_sm.png). The gilt hands are domed and shaded: a half-depth edge cuts them short (handwidth.py's first table: withdrawn). The full extent over the dial's colour
(Lab distance over 25) is the reading, ±0.2 mm, and up to 0.3 more where a shadow lies beside the hand. A hand stands 1-6 mm over the dial: 0.2-2 % large, not corrected,
and the same on photo and model. Corroborated by eye on Kirov 2973's and Kirov 009's dials (bilder-zum-6mx/1_Kirow_2973_Z.jpg, 1_Kirow_009_Z.jpg; r_hour3.png).

| part | photo | scale and its source | reading ± | model value (render, same reader) | verdict | how sure |
|---|---|---|---|---|---|---|
| minute hand, length | Z (247) | arbors | tip 47.0 ±0.2 from the centre (at the minute track's outer line) | 46.7-47 | match | likely |
| minute hand, widths | Z | as above | 1.98 at 12 mm, 0.62 at 24 (its waist), 1.62 at 35 (the second swell), 0.97 at 42 | 2.00, 0.78, 1.77, 0.78 | match (within 0.2) | likely |
| hour hand, length | Z | as above | tip 35.0 ±0.2 | 35.3 | match | likely |
| hour hand, the pear: place and width | Z (247), 2973; render | the strips' map | widest 4.8 (247, read across the zoomed strip; 4.9 on its profile at 22.5, its shadowed side dark) and 4.6 (2973) at about 22.5; from about 19.5-19.7 | 5.2 (HOUR.hw 2.6 at 22.5; 5.3 on the render); from about 20.1 | possible mismatch: 0.4-0.6 narrower on both chronometers | possible (two chronometers by eye across a domed, shaded pear, ±0.2-0.3: close to its error). Alpha: no fix |
| hour hand, the pear's inner end | Z (247), 1_Kirow_2973_Z; the model's render (pearprep.py's strips at 40 px/mm, r_pearbase.png) | the strips' own map (the arbors' scale) | rounded on 247 (it starts at about 19.5 from the centre); on 2973 it meets the stem at about 19.7, its rise a circle R 2.76 (centre 22.28, -0.37: rms 0.057 mm over 87 points, peararc.py); 247's radius loose (2.0-3.8: its shading) | rounded too: the table (HOUR.hw) rises from 19.93 on a curve that is within 0.1-0.3 of 2973's circle; it starts at about 20.1 | **match in form; the first reading (a flat cut) withdrawn**: it was a shading line across the render's pear, not its outline | likely |
| hour hand, the stem | Z | as above | about 1.1 at 12 mm by eye on the strip (printing and the hand's shadow lie beside it, so the reader can't take it) | about 1.5 at 12 mm (the reader: 1.50 at 14, 1.15 at 16) | possible: slimmer on 247 | doubtful; kept as drawn (Alpha) |
| the centre: the arbor's square | Z (247), 2973; render (r_square.png, each in the minute hand's frame) | the arbors' scale | a square showing silver through the gilt boss, its diagonal along the minute hand on both (turned 45° to the blade); its diagonal 3.2-3.4 (the corners turned) | the cannon tube's square (CN.sq 2.6155, its corners turned to Ø 3.45, a crowned top: dial.js 294-297), steel, its flats along the minute hand: the "silver dome" first noted was this crowned square, rendered | **mismatch in turn: 45°**, the size matches. **Fixed** (Alpha, 7 November 2026; branch claude/wempe-6mx-hands): the 6MX's tube and minute hand built in their own version groups, the square and the hand's hole turned 45° (dial.js `turnL`) | likely (two chronometers; the first reading "no square, a dome" withdrawn) |
| seconds hand | Z | the seconds arbor | two ends: a short one with an arrowhead (a dart) at about 7-9.3 from the centre, a long plain one out to the seconds track (about 16-18) | the same form: a dart at 7-9 and a long plain end | match in form; the widths within 0.4 (the photograph's blued steel shaded) | likely |
| up-and-down hand | Z | the up-and-down arbor | a plain tapering hand, its tip about 8 | about 8.75 | match (within the reading, ±0.5 where it crosses the printing) | likely |

Checks after the square's fix (7 November 2026): solids --model wempe (0 not solid, both states), invariants --model wempe (ok), fine --model wempe in the 6MX
state (68 states, 18 pairs, 0 new or grown; the hands over the dial 0.180), bom --model wempe in the 6MX state (278 lines, 310 relations, 20 jewels: ok),
wempe_inertia.py --rev 6mx (wempe_inertia_6mx.json up to date: the 45° turn moves no body's inertia beyond its tolerance, so wempe_6mx.js isn't rerun),
the Wempe type check, smoke --model wempe (242 steps, ok), photocompare k247_Z at the centre (the model's square's outline now on the photograph's).
