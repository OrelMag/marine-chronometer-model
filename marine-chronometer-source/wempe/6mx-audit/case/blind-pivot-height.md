# Blind measurement: gimbal pivot hole and bracket heights below the bowl's rim top

Blind: no model code, README or provenance file read. Scripts here: `sil.py` (silhouette), `rimfit_blind3.py` (rim-top edge
ellipse), `gridcrop.py` (zoomed crops with pixel grid), `heights_blind.py` (the table). Crops/frames in `E:\mc-video\oq\6mx-case\`.
(`rimfit_blind.py`/`rimfit_blind2.py` were earlier fits, kept; blind3 is the one used.)

## Method
1. Photos 12_Kirow_247_E-Kontakt_3 (247) and 13_Kirow_2973_E-Kontakt4 (2973). The bowl is photographed from slightly BELOW the
   rim plane (the interior is hidden, the screw row arches up, the foot's lower edge smiles): near points appear higher.
2. The top silhouette of the ring (excluding the tabs and brackets) is the near rim-top edge; an axis-aligned ellipse fitted to it
   (rms 1.9 px 247, 3.0 px 2973) gives centre, a, b: b/a = 0.493 (247, e = 29.5 deg), 0.354 (2973, e = 20.7 deg).
   Scale s = a / 55.05 mm = 8.84 / 8.83 px/mm (taking the top edge at R 55.05; the 247 silhouette elsewhere is 4 % wider: +-2 % on s).
3. A point on a vertical face at radius r, bearing from x offset: z = ((y_edge(x) - y)/s - (d_f - d_e) sin e) / cos e, d = r cos(bearing).
   The correction (d_f - d_e) sin e is the parallax of a bracket standing off the rim; r_plate = 53 +- 2 (body R about 50.7 from the
   silhouette below the ring, plus a plate about 2-4 mm thick: the upright's side face width 2.4 mm / sin(bearing 39 deg) gives t about 3.8),
   hook block 8 +- 2 mm further out (from the width of its visible underside and right side, 7-9 mm).
4. Monte Carlo (heights_blind.py): e +-3 deg, s +-2 %, picks +-2.5 px, edge +-3 px, r +-2 mm.
5. Cross-check without the rim: hole to the scribed "+" mark on the body: 247 hole 34.8 above, ring top 35.1 above (hole -0.3);
   2973 hole 30.7 above, ring top 33.4 above (hole -2.7). Same ordering as the Monte Carlo.
6. The hole's own face: hole centre to the front-face top edge of the upright (same plane, no parallax): 247 5.2-5.5 mm,
   2973 5.3 mm (sure to +-0.5). So the question is really "how high does the upright's top stand over the rim top": 247 about +4.7..+6.6,
   2973 about +1.9..+3.8.
7. Hole shape: 247 ellipse 39 x 43 px (tilted), 2973 40 x 49 px; true diameter about 4.5-5.4 mm (not separable from the
   unknown axis direction; likely 4.5-5). Centre pixels: 247 (192.5, 128.5), 2973 (160, 96.5).

## Table 1: pivot hole centre, mm BELOW the rim's top face (negative = above)
| photo | reading | +- | sure? |
|---|---|---|---|
| 247, 12_Kirow_247_E-Kontakt_3 | about 0 (hand calc with plate at the ring's radius: 0.7 below; Monte Carlo with plate 2 mm inside the ring: 1.2 above; scribe cross-check 0.3 below) | 1.7 | likely |
| 2973, 13_Kirow_2973_E-Kontakt4 | about 2.5 below (3.4 hand; 1.5 MC; scribe 2.7) | 1.5 | likely |
| KirPol 24020, 14_ (seen from above 27 deg; a later Poljot-era bowl: its upright is taller and stops 3.7 below the rim) | 11.8 below | 1.0 | doubtful as to the 1950s: different bracket; only the method is sure |
| 247 photos 10, 11 | not the bracket (movement / inside of bowl) | | can't tell |
| video Uy8A88_j-cA 2:06 (Poljot 09777 in its ring) | the ring's pivot nuts sit at about the height of the bezel's knurled band / rim region (left nut level with the upper part of the ring band, right nut at the bezel band's middle); no metric reading possible (oblique, perspective, no scale on the ring) | | can't tell |

The two Kirovs disagree by about 2.5 mm; the same 2.5-3 mm shows on every bracket feature (hook top, strap), so it is a real
difference between the two bowls or a systematic of the two camera set-ups, not noise in the hole pick. Best single figure for the
1950s Kirovs: hole centre about 1 mm below the rim top (range 0 above to 3 below), +-2.

## Table 2: bracket features, mm below the rim top (negative below; +up). +- is the 1 sigma of the Monte Carlo (about 1.0-1.9)
| feature | 247 | 2973 | note |
|---|---|---|---|
| CASE upright: top edge | +6.6 | +3.8 | sure it stands over the rim in both (28 px / 15 px over the ring edge beside it) |
| CASE upright: hole centre | +1.2 | -1.5 | see table 1 |
| case upright width (front face) | 78 px = about 11 mm (bearing 37 deg) | 82 px = about 12 mm | likely, +-1.5 |
| case upright thickness (radial, side face) | about 3.8 | about 4 | likely |
| STRAP top | -14.0 | -15.2 | likely, +-1.4 |
| STRAP bottom (front face; a bevel below it) | -25.4 | -27.9 | likely |
| strap height | 11.4 | 12.7 | likely |
| strap screw centre | -19.1 | -20.7 | likely; head diameter about 10.5-11 |
| strap slot: length (x 298-452; 283-412 px) | about 18 mm | about 15 mm (right end at screw 412, left 283) | slot ends partly under the head; likely +-1.5 |
| strap slot: height (right end) | 40 px = about 5.2 mm | 40 px = about 4.8 mm | likely +-0.7 |
| LOCK plate bottom (front face) | -34.8 | -37.0 | likely, +-1.8 |
| LOCK plate top where it meets the block ("step") | -12.1 | -14.3 | likely |
| lock screw 1 centre | -19.0 | -21.4 | likely |
| lock screw 2 centre | -28.2 | -31.6 | likely; spacing 9.2 / 10 |
| lock vertical slot: top end | -14.6 | -16.7 | doubtful (hidden under screw 1; the dark seen above the head) |
| lock vertical slot: bottom end | -32.8 | -36.2 | doubtful (same) |
| lock vertical slot: width | about 7 (head about 8) | about 7 | doubtful +-1.5 |
| lock plate width | about 13.6 | about 14.2 | likely +-1 |
| block front face: bottom / top | -11.6 / -6.4 | -14.1 / -9.5 | likely |
| hook slot: bottom / top | -6.8 / -2.0 (4.8 high) | -9.3 / -4.3 (5 high) | likely |
| hook slot: depth | open at the left face, runs in about 10 mm (x 613-697 px), leaving about 4.5 mm column on the right | about 10 mm (x 590-668 px; column about 4.5) | likely +-1.5 |
| hook top | +2.4 | -0.5 | likely; 247's hook rises above the rim, 2973's about level |
| block standing out from the plate | about 8 mm (underside 38 px = 9.2 mm if flat, side face width 7.8) | about 7-9 | doubtful +-2 |

## Doubts
- Rim reference: the "top face" is the silhouette's near top edge; its radius (55.05) is my assumption for s. A 4 % larger s
  changes the heights by 4 % (up to 1.4 mm on the deepest items). The deepest items (plate bottom) also depend on e: 3 deg = about 1 mm.
- r_plate - r_ring is the main uncertainty for anything near the rim (+-2 mm gives +-1 mm).
- All readings are one view per bowl; the 12 and 6 o'clock brackets are assumed alike.
