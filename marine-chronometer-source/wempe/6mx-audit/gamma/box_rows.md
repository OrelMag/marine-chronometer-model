# 6MX audit, Gamma (box fork): the box and the outer box

Kirov No. 247's boxes, measured as ratios before the model was read. Scripts: `box14.py`, `box14b.py`, `box14c.py`, `box14d.py`
(14_Kirow_247_Kasten_2.jpg, the inner box's front square-on) and `box13.py`, `box13b.py`, `box13c.py`, `box13d.py`, `box13e.py`,
`box13f.py` (13_Kirow_247_Kasten_1.jpg, oblique). Each docstring gives its method. Outputs: the `box1*.json` files and the `r_13*`/`r_14*` images.

Scale: no feature in these frames has a known size. U is the inner box's number plate's outer Ø (14_: 200.68 px; its printed
face Ø 190.69). U is 0.1709 W (±1 %) of the inner box's front width, from 13_ rectified, where the plate is fitted round and its Ø is
read across. **Every mm figure is chained from the one figure 190** (the box's outside, "190x190x190": TU 1.2.7, 6MX-figures.md),
taken as the front's width W. Uncertainties are for the ratio; the 190 adds its own.

Known beforehand: Gamma's brief named "the box (190, three tiers, hasps, badge, number plate, strips, handles)". Early in the work a
grep showed one line of case.js's comment ("the body 97 (0.506, 0.514)", measured on Kirov 22823), so the body tier's reading below
was not blind.

## Readings (written before the model was read)

| # | part | photo | scale and its source | reading ± |
|---|---|---|---|---|
| B1 | inner box, body tier (lower parting groove to the bottom edge) | 13_ (front rectified on its four edge lines; a chosen so the plate comes out round, 0.4965-0.5135 within 1 %; the hasp's screws, with their 14_ spacing ratio, give 0.541 ±0.02 a px) | W | 0.505-0.541 W, so 0.52 ±0.02 W = 99 ±4 mm |
| B2 | inner box, middle tier (between the two parting grooves) | 14_ (the grooves' darkest rows, lines at sd 0.07-0.15 px; 450.26 px) | U, then 0.1709 W | 2.244 U = 0.383 W = 72.8 ±1 mm |
| B3 | inner box, top tier (above the upper parting) | none shows it (13_: behind the outer lid's tongue; 14_: cropped) | W | if the box is a 190 cube: 1 − B1 − B2 = 0.08-0.12 W = 15-22 mm (inferred, not seen) |
| B4 | the number plate (body) | 14_ (circle on its outer edge, 154 rays, rms 1.3 px; its face edge 130 rays, rms 0.36 px); 13_ (W) | U | outer Ø 0.1709 ±0.002 W = 32.5 ±0.4 mm; printed face Ø 30.8; 14_'s fitted ellipse is 0.98 round, so it is round within the frame's tilt |
| B5 | the number plate's place | 14_; 13_ | U; W | centre 1.231 U = 40.0 mm below the lower parting (14_), 0.2116 W = 40.2 mm (13_): agree; centred across (13_ 0.503 W; 14_ in line with the hasps' knobs ±1.5 %) |
| B6 | hasps (both alike), plate | 14_ (sides as lines from the red channel's step, sd ~2 px for the corners' rounding; tips from the mask, ±1 px) | U | width 1.612 U = 52.3 ±0.7 mm; tip to tip (the scalloped ends' points) 0.935 U = 30.4 ±0.4 mm, the parting groove 0.49 of the way down (tips 91-93 px above it, 95-96 below); 13_ rectified width 0.271 W = 51.5 (agrees) |
| B7 | hasps, screws | 14_ (head centroids by their rim circles, rms 0.4-0.8 px) | U | four, 1.272 U = 41.3 ±0.4 mm across, 0.4125 U = 13.4 ±0.3 mm up and down (straddling the groove); heads Ø 4.4-4.6 mm |
| B8 | hasps, knob | 14_ (circle, 170-179 rays, rms 1.2-1.8 px) | U | Ø 0.337 U = 10.9-11.1 mm, below the groove (its centre 36-42 px under it: 0.20 U = 6.5 mm) |
| B9 | diamond badge (Raute) | 14_ (saturation mask, the four edges as lines, rms 0.35-0.77 px, vertices their intersections) | U | 1.256 U × 0.786 U = 40.8 × 25.5 ±0.3 mm (sharp-cornered equivalent), its height 0.626 of its width; centred across; its centre 0.511 of the way down the middle tier; two pins at its side corners |
| B10 | corner strips (front, six seen) | 13_ rectified (red channel's steps, medians of 9 lines) | W (vertical by B1's a: ±4 %) | each 0.137-0.145 W = 26.0-27.5 mm along the front, 0.058-0.061 W = 11.0-11.6 mm high; pairs at 31.5-43.6 mm above the lower parting (the middle tier, centred in it), 24.3-35.8 mm below it (the body) and at the bottom (87.5 mm down to the bottom edge) |
| B11 | handles | 13_: a brass fitting on the inner box's left side, at about the body strips' height; its shape not readable from this angle | — | can't tell |
| B12 | outer lid, its front face | 13_ (rectified on its four edges, rms 0.35-1.1 px; a by its plate's roundness, 0.4585-0.4730 within 1 %) | Wo (the outer lid's width) | height 0.466 ±0.007 Wo |
| B13 | outer lid's number plate | 13_ | Wo | Ø 0.124 Wo, centre 0.129 Wo below the lid face's top edge (the face as photographed; the lid upturned), at 0.519 Wo across |
| B14 | outer lid's tongue (half-round) | 13_ (its edge's dark line along 141 rays, RANSAC circle, 84 points at rms 0.003 Wo) | Wo | a circular segment, r 0.242 ±0.002 Wo, its centre 0.068 Wo inside the face's edge, chord 0.465 Wo, standing 0.174 Wo past the edge; centred (0.508 Wo) |
| B15 | outer box front: cut-out | 13_ (the felt's dark span along rows at the box's top; the face's vertical foreshortening from the catch, 0.896) | Wo' (the outer box's front width at the catch's row, 537 px) | the felt's chord 0.40-0.41 Wo', the wood's edge about 0.45 Wo' (by eye on the zoom, ±0.02); depth about 0.13 Wo' to the felt; a circle fitted to the edge was poor (rms 6.9 px): can't tell its radius |
| B16 | outer box front: round catch | 13_ (saturation steps across its rows and columns) | Wo' | Ø 0.125 ±0.003 Wo' across; centred (0.53 ±0.02 Wo' by the ellipse; in line with the cut-out's middle) |
| B17 | outer box's width against the inner box's | 13_ (different planes, different depths) | — | inner front 416-424 px, outer box front 537 px, outer lid 547 px: about 0.78 ±0.04, so the outer box about 240-250 mm if the inner is 190 (can't tell closer without the camera) |
| B18 | the lid's plate against the body's | 13_ | — | the outer lid's plate (r 35.7 px) and the inner box's (r 36.0 px) look the same size at similar depths (likely one size of plate) |

Corroboration from the other 1950s Kirovs (2973, 22823, 23239, 1564) was not done in the hour; 247 alone stands for every row above.

## Against the model (case.js, "the 6MX's box" and "the 6MX's outer box", read after the readings above)

Scale-free ratios on one photograph count for more than the mm figures: they don't depend on the 190 or the plate's Ø.

| # | part | photo | scale and its source | reading ± | model value | verdict | how sure |
|---|---|---|---|---|---|---|---|
| B1 | body tier | 13_ | W = 190 | 99 ±4 (0.52 ±0.02 W) | 97 (P2 = YF + 97; Kirov 22823's 0.506-0.514); known beforehand | match | likely |
| B2 | middle (glazed) tier | 14_ + 13_ | its ratio to the hasp's width in 14_, 1.392 (scale-free), times 52.3-53 | 72-74 (72.8 ±1 by the plate chain; 73.8 by the model's own hasp, 53) | 68 (P1 − P2; from Kirov 22823, a later box: 0.354-0.360 of its height). The comment itself reads 247's as 72 | **mismatch, +4.8 (7 %)**; 247 outranks 22823 (Alpha's rule) | likely: the partings' grooves are clean lines (sd ≤ 0.15 px) and the hasp/tier ratio is free of any scale, but only 14_ shows both partings |
| B3 | top tier | none | inferred from a 190 cube | 15-22 (not seen) | 25 (estimated: 22823's) | can't tell | — (if B2 becomes 72.8 and the box stays 190, the top tier drops to about 20) |
| B4 | number plate (body), Ø | 14_, 13_ | ratio to the hasp: outer 0.620, face 0.589 (scale-free) | outer 32.5-32.9, printed face 30.8-31.2 | Ø 31 | match on the printed face; the outer dark ring (0.8-1 mm each side) is either the plate's turned edge or a shadow | likely (can't tell which edge the plate's is) |
| B5 | number plate, place | 14_, 13_ | U; W | 40.0 / 40.2 under the lower parting, centred | 40 under the lower line, centred | match | sure (two photos agree) |
| B6 | hasps, width | 14_, 13_ | U; W | 52.3 ±0.7 (14_ by the plate; 13_ 0.271 W = 51.5) | 53 (22823's 215/773) | match | sure |
| B6b | hasps, tip to tip | 14_ | U | 30.4 ±0.4 (each leaf to its peak 15.0-15.5) | 32.5 (each leaf 13.25 plus a 3.0 peak: 16.25) | possible mismatch, −2.1 (each leaf's peak about 1 lower) | doubtful: one photo, tips read off a threshold mask (±1 px = 0.16 mm), and the peak's height on 22823 was its own reading |
| B7 | hasps, screws | 14_ | U | 41.3 × 13.4 | 42 × 14 (±21, ±7 off the line) | match | likely |
| B8 | hasps, knob | 14_ | U | Ø 10.9-11.1, centre 6.5 under the line | Ø 11, 6.4 under | match | likely |
| B9 | diamond badge, size | 14_ | its width over the hasp's, 0.779 (scale-free, edges rms ≤ 0.8 px) | 40.8 × 25.5 (by the plate chain); 41.3 × 25.8 with the model's own hasp 53; height/width 0.626 | 38.6 × 24 (0.622): its width/hasp 0.728 | **mismatch, about +2.5 × +1.6 (6.5 %)**; the shape (0.626 against 0.622) matches | likely: scale-free on one sharp, square-on photo; no second photograph of 247's badge |
| B9b | diamond badge, place | 14_ | fraction of the middle tier | centre 0.511 of the way down from the upper parting (0.489 up from the lower) | 30.4 over the lower line of 68: 0.447 up (37.6 under the upper) | **mismatch** in place: 247's badge is centred in its tier, the model's 1.4 under it (with B2's 72.8, its centre 35.6 over the lower line, not 30.4) | likely (the same photo, the same clean lines) |
| B10 | corner strips, size | 13_ | W (vertical ±4 % by B1's a) | 26.0-27.5 × 11.0-11.6 | 27 × 12 | match | likely |
| B10b | corner strips, middle tier's | 13_ | W, from the lower parting | centred 37.5 over the lower parting (31.5-43.6), ±1.5 | centred 43 over it (37-49: "25 under the upper") | possible mismatch, about −5.5; centred in 247's tier (B2) as the badge is | doubtful: 13_ alone, its vertical scale through the rectification's a (0.505-0.541) |
| B10c | corner strips, body's | 13_ | as above | centred 30 under the lower parting (24.3-35.8) | centred 27 under (21-33) | possible mismatch, −3 | doubtful (as B10b) |
| B10d | corner strips, bottom | 13_ | as above | from 87.5 under the lower parting to the bottom | centred 6 over the bottom (0-12) | match | likely |
| B11 | handles | 13_ | — | a brass fitting on the left side, near the body strips' height; its form not readable | ring Ø 34 of 6 wire on a lug 12 under the lower line (estimated, 22823's) | can't tell | — |
| B12 | outer lid, front face height | 13_ | Wo | 0.466 ±0.007 Wo = 108.6 at the model's 233 | 125 (estimated: "the parting line at half" of 250; not measured) | **mismatch with an estimate**: 247's lid front is 0.466 of its width, the model's 0.536 | likely: the lid face rectified on four clean edges (rms 0.35-1.1 px), a by its plate's roundness, the tongue then a clean circle (rms 0.003 Wo) at that a |
| B13 | outer lid's plate | 13_ | Wo | Ø 0.124 Wo (28.9 at 233); centre 0.129 Wo (30) under the lid's top edge, 78.6 over its parting edge; centred | Ø 31 (0.133); centre 42 under the top, 83 over the parting edge | can't tell on the size (the 233 is ±7 %); the place follows B12 | doubtful |
| B14 | outer lid's tab (half-round) | 13_ | Wo | r 0.242 Wo, centre 0.068 Wo inside the edge, chord 0.465 Wo (108 at 233), 0.174 Wo past the edge (40.5) | drawn filling the notch: r 55.5, chord 101, 32.5 past the edge; the comment's own reading of the tab 105-111 × 41-44 (README Unresolved: it may lap over the body) | mismatch, as already recorded: 247's tab is larger than the notch | likely (agrees with the earlier reading) |
| B15 | outer box's notch (cut-out) | 13_ | Wo' | chord 0.40-0.45 Wo' (felt to wood), depth about 0.13 Wo' | chord 102, depth 33 (0.44, 0.14 at 233) | match | can't tell closely (the edge's circle was poor) |
| B16 | outer box's catch, Ø | 13_ | Wo', and its ratio to the notch's chord (0.28, scale-free) | Ø 0.125 ±0.003 Wo' = 29 at 233 | **code draws Ø 20** (`cylY(10,2,40)`), its comment says "the catch Ø 26" | **mismatch**: the code's Ø 20 is under the comment's 26 and 247's 29 | likely (the code/comment disagreement is sure; the photo's 29 rests on the 233) |
| B16b | outer box's catch, place | 13_ | Wo' | centre 0.21 Wo' (49) under the top edge, centred | 51 under the parting line, centred | match | likely |
| B17 | outer box's width | 13_ | the inner box's 190 | 0.78 ±0.04 inner/outer: 240-250 | 233 (inner/outer 0.815) | match within the reading | can't tell closer |

Corroboration from the other 1950s Kirovs was not done in the hour; each "likely" above rests on 247 alone. For B2, B9 and B9b,
Kirov 22823's front (the model's source) disagrees: it is later, and 247 outranks it. Another 1950s box seen square-on (2973's or 1564's)
would settle whether 22823's tiers differ from 247's or one reading is off.
