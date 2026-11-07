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
| dial screws' heads | Z | as above | Ø 2.16, 2.19, 2.20 (±0.05): the dark ring round each head onto the white dial | the head DL.ds r 0.85 (Ø 1.7) in its sink DL.sc.sr 0.9 (Ø 1.8), dims.js | possible mismatch, +0.4-0.5 | doubtful: the dark ring may be the sink's edge or its shadow, not the head; needs a second Kirov's Z (009, 2973) before any fix |
| ring screw at 342 | uZ (opening in the ring's cone, centre on the hole's axis, unprojected at y 8.6); A (head arc, y -2) | uZ camera; A camera | uZ brg 342.0 (LOO 341.7-342.0), r 44.4-46.3 by f; A brg 343.4 (LOO 341.5-347.6), r 44.6 | brg 342.2, r 44.5; known beforehand | match | sure on angle (uZ), likely on radius |
| ring screw at 102 | uZ, A | as above | uZ brg 101.8 (LOO 101.5-101.8); A 100.7 (97.7-102.3), r 45.2 | brg 102.2, r 44.5; known beforehand | match (0.4°) | likely |
| ring screw at 246 | uZ, A | as above | uZ brg 247.4 (LOO 247.0-247.5); A 247.7 (241.8-251.7), r 44.35 | brg 246.4, r 44.5; known beforehand | possible mismatch, +1.0° (0.8 mm along the rim) | doubtful: one firm photo (uZ, whose own points miss by up to 5.7 px), the A camera too loose to confirm; for the owner through Alpha |
| the gilt flange's outer edge (movement ring, 05 08 00-3) | Z | dial plane (the flange's top, 11.05, at the dial's depth: no correction) | r 53.04 ±0.1 (249 pts, 0.26 px rms) | RING.flD 105.90: r 52.95 | match | sure |
| the bowl's rim (its threaded rim, the silhouette in Z) | Z | dial-plane scale; the rim's top flush with the flange (case.js), so ±0.3 for its depth | r 55.38 ±0.3 (231 pts, 0.16 px rms): Ø 110.8 | crest r 55.276 (Ø 110.55; rim Ø 110.5); known beforehand | match | likely (one photograph of 247; Z is the bezel-off view) |
| the dial's white field, its edge | Z | dial plane | r 51.27 ±0.1 (1.8 px rms: a soft edge) | the disc DR 51.78 | can't tell: the white ends 0.5 inside the disc's edge (a bevel or the paint's margin) | — |
| the bezel and its thick glass | — | — | no photograph of Kirov 247 shows the bezel (Z is bezel-off); only later or other Kirovs (23239's box view, 14917's video, 422) | built from Kirov 422 | can't tell on 247 | — |
| the contact: arrangement | 10_ (247), 14_E-Kontakt1/2 (no serial: the model's comment calls it Kirov 2973; corroboration only) | — | two gilt plates on black fibre, two screws on fibre washers on each, a screw on a raised block by each, the upright knurled disc between them, the spiral under the cock, the threaded contact screw along the front | the same (Alpha's renders through m6_contact and m6_contact_front) | match | likely |
| the contact: block screws' heads against their spacing | 10_ (247), 14_E-K1, 14_E-K2 | ratios at one depth (no camera): a head's width over its block's own gap; and on 10_ against pillar 39 (Ø 8.0, standing behind the screws, so an upper bound) | head/gap 0.24-0.32 (10_: 0.32 block 57, 0.24 block 52; E-K1 0.28, 0.26; E-K2 0.43, 0.29); on 10_ the heads 55 px against the pillar's 193 px: Ø 2.3 or less | heads Ø 3.1 (train.js 6MX.cts, r 1.55); spacing 8.52 (57) and 7.89 (52) in plan: head/gap 0.36, 0.39 or more as projected | likely mismatch: the heads smaller (about Ø 2.2-2.3) and/or the screws farther apart in each block (block 52's about 9-10) | likely on the ratio (247 twice, the other contact the same way); which of size and spacing, doubtful: the scale leans on pillar 39's 6MX place (Beta's) and no camera here pins f. Through Alpha's own cameras, fitted on these screws, the model's within-block gaps fall 13 % (10_) and 33 % (E-K1) short of the photographs' |
| the contact: places of its parts in mm | 10_, 14_E-K1 | cameras fitted only on drawn parts (the top plate's inner-face rim and pillar 39's silhouette): 3.6-5.9 px rms, f not pinned (cost flat over 2500-5000) | not measurable better than about ±1 mm | — | can't tell | — |
