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
| dial screws' heads | Z | as above | Ø 2.16, 2.19, 2.20 (±0.05) | (to compare: dial.js) | — | likely |
| ring screw at 342 | uZ (opening in the ring's cone, centre on the hole's axis, unprojected at y 8.6); A (head arc, y -2) | uZ camera; A camera | uZ brg 342.0 (LOO 341.7-342.0), r 44.4-46.3 by f; A brg 343.4 (LOO 341.5-347.6), r 44.6 | brg 342.2, r 44.5; known beforehand | match | sure on angle (uZ), likely on radius |
| ring screw at 102 | uZ, A | as above | uZ brg 101.8 (LOO 101.5-101.8); A 100.7 (97.7-102.3), r 45.2 | brg 102.2, r 44.5; known beforehand | match (0.4°) | likely |
| ring screw at 246 | uZ, A | as above | uZ brg 247.4 (LOO 247.0-247.5); A 247.7 (241.8-251.7), r 44.35 | brg 246.4, r 44.5; known beforehand | possible mismatch, +1.0° (0.8 mm along the rim) | doubtful: one firm photo (uZ, whose own points miss by up to 5.7 px), the A camera too loose to confirm; for the owner through Alpha |
