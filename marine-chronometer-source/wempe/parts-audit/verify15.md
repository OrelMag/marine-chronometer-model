# Verifier, batch 15: the case (05 01_1 to 05 01_5)

Sheets re-read on enlarged crops (kept outside the repository in E:/mc-video/wpa-audit/crops/). Measurement files: `r_wpa/measure/{bowl,closingPlate,bezel,gimbalRing}.json`, `r_wpa/page/{placements,Holzkasten,Holzkasten.D,050101-1}.json`.

## The first question: raw castings or blanks

Yes, both R- sheets are castings (sure).

- **05 01_2** (R-050100-1, Gehäusetopf): the title block reads "Werkstoff Ms-Sandguß (Kokillenguß)", and the sheet carries "Kokillenguß" and "Gewicht 350 gr". There is no finished-surface mark and no tolerance, and the sheet says nothing about machining allowance.
- **05 01_5** (R-050101-2, Glasrand): "Werkstoff Ms", with "Kokillenguß" on the sheet.
- **Reading.** "R-" is Rohteil: the casting that goes to the machine shop. The sizes are blank sizes. The finished parts are 05 01 00-1 and 05 01 01-1, and they are not drawn in this batch.
- **Evidence that the built part is a machined finish of the blank:**
  - 05 01_3 gives the closing plate as 68 -0.2 dia. The bowl's base recess therefore has to be at least 68. The blank's 64 cannot take it, so it is bored out (built 68.2).
  - 05 01_4 draws the finished bezel in section. It shows a conical bore, a top chamfer and a lip, which the blank's straight 92 bore and plain flat top do not.
- **Consequences.** A blank's sizes don't bind the finished part, so a difference between a blank size and a built size is not a mismatch. Sizes that only the blank has are marked "n/a (blank)".
- **Sizes that still hold for the finished part (agreements, checked against the built part):**
  - bowl: 118 flange, 53 flange underside, 108 step at 41.5, 106 body, 98 bore, 65 height, 72.5 base, 14.5 and 40.9° cone, R7 floor fillet;
  - bezel: the finished profile as shown on 05 01_4 (below).
- **Weight note (sheet's own inconsistency).** The bowl's weight is given as 350 gr, but the built bowl's volume (131 835 mm3 at brass 8.5 g/cm3) is about 1100 g. 350 g would fit aluminium. The blank's drawn volume is about the same as the built one, so the sheet's weight, its Ms and its sizes can't all hold. I can't tell which is wrong.

## 05 01_1: Gehäuse Kardan (assembly)

Sheet scale: Z:419 (the stamp reads "Z:419", not legible beyond that). About 2.48 px/mm on the 1024 px scan, from the 160 dimension and the ring.

| id | reader's verdict | my reading of the sheet (certainty) | the built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 15-1-1 | match | 160 dia dimension line runs between the wood inner faces in A-B (likely) | `WN-400.w` box x -80..80; Holzkasten x ±92.5 (walls 12.5) | match | yes | |
| 15-1-2 | match | note "Holzkasten 185x185x180 mm außen" (sure) | page `Holzkasten.json` size 185 x 105 x 185 | match | yes | |
| 15-1-3 | can't tell | 180 high (sure) | lower box 105 (y -92.45..12.55) plus `Holzkasten.D` 75 (y 0..75 on its origin, placed at y 12.55 on the box) = 180 | match | **no** | The lid is a separate part, but the two together give 180. The reader had both files and didn't add them. |
| 15-1-4 | match | ring outer 735 px at 2x / 4.96 = 148 (likely) | `gimbalRing` outside d 148.0 | match | yes | the reader's ~145 is within the scan's accuracy |
| 15-1-5 | match | ring height about 23-24 (likely) | `gimbalRing` size z 24.0 | match | yes | |
| 15-1-6 | match | bowl outer about 103-106 (likely) | bowl outside d 106.0 | match | yes | the scan gives 103 to 106 depending on the scale used |
| 15-1-7 | match | axis to bowl bottom 53.2 to 55.0 on the crop, depending on the scale (likely): 53.2 with the 160 scale, 55.0 with the bowl's 65 height (axis to rim 9.9, matching the built 10.0) | axis y 1.05; bowl bottom y -53.95; 55.0 | match | yes | marginal: the scale used decides it, but the bowl-height scale agrees with the built 55.0 |
| 15-1-8 | match; hand can't tell | 50° from the downward vertical to the bracket (sure); the bracket at the lower right | `lockBracket` hole at [40.2,-33.7], 50.0° | match | yes | **hand: match (likely).** In placements `WN-78.m25` sits at x +43.8, z +36.8, so the bracket is on the +x, +z side. The sheet's A-B is a plan from +y with x to the right (the right wood carries the ring bracket 5, at x +68..77) and z down. The bracket is at the lower right: the same as built. The reader's "can't tell" can be settled. |
| 15-1-9 | can't tell | "17" runs from the centre line of the transit lock's big circle (15) down to the baseline at the wood's inner face (likely): 17 mm | `050101.F.*` (the Feststeller) at x 65.1, z 62.9; wood inner face at z 80, so 80 - 62.9 = 17.1; sheet x position 64 from centre | match | **no** | The reader could not identify the part. The `050101.F.h/k/a` pieces are the transit lock. The lock's big circle on the sheet is about 20.5 across against the built `F.k` 19.6 wide (unsure, scaled). |
| 15-1-10 | match | list as read: 1 Gehäusetopf 05 01 00-1, 2 Gehäuseklaben -3, 3 Feststellkloben -4, 4 Kardanring -5, 5 Kardanringkloben -6, 6 Verschlußplatte -2, 7 WN-71, 8 Glasrand, 10 WN-400, 11 WN-80, 12 WN-79, 13 WN-78, 14 Verschlußfeder 05 01 00-7, 15 Feststeller (sure) | all present | match | yes | but see v1: list numbers 8 and 15 |
| 15-1-11 | match | pivot axes at mid height of the ring (likely) | ring pivot holes z 12.0 of 24; ring box y -10.95..13.05, mid 1.05 = axis y | match | yes | |
| 15-1-12 | can't tell | the ring's pivot holes aren't dimensioned (sure) | 4.134 d at (0,±69.5), 3.2 d at (-69.5,0) and (72.25,0) | can't tell | yes | the 4.134 vs 3.2 split and 72.25 vs -69.5 are not on this sheet |

Items the reader missed on 05 01_1 (v-items):

| id | item | my reading (certainty) | built | verdict |
|---|---|---|---|---|
| 15-1-v1 | The parts list's numbers: item 8 Glasrand is "05 01 05-1", item 15 Feststeller is "05 01 01" (sure) | the sheet 05 01_4 (bezel assembly) is itself 05 01 01, with its parts 05 01 01-1 and 05 01 01-2 | `050101-1` is the glass, `050101-2` the bezel, the transit lock `050101.F.*` | can't tell: the sheet's own numbering is inconsistent (05 01 05-1 is likely 05 01 01-x; the transit lock shares 05 01 01 with the bezel assembly). Not a model fault. |
| 15-1-v2 | Notes: "Lagerstellen a u. b leicht spielend" (bearings a and b easy-running) and "Kloben verstellen bis Gleichgewicht erreicht ist" (sure) | a functional fit with no size, and a procedure | | can't tell (no size to check) |
| 15-1-v3 | Transit lock circle, about 20.5 across, 17 from the wood face (unsure, scaled) | see 15-1-9 | `F.k` 19.6 wide | match within scan |

## 05 01_2: Gehäusetopf, R-05 01 00-1 (a casting)

All sizes are the blank's (see the first question). The tolerance is none printed, and no general tolerance appears, so the fallback is used.

| id | reader's verdict | my reading of the sheet (certainty) | the built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 15-2-1 | match | 118 dia (sure) | `cylinders[7]` d 118.0 | match | yes | holds for the finished part too |
| 15-2-2 | mismatch | 12 from the top at the right = flange z 53..65 (sure) | `cylinders[7]` z 53..60.3 | **n/a (blank)**; underside z 53 holds for the finished part | **no** | The finished flange is cut to 60.3 and a lip stands 60.8..64.5 to keep the 65 overall. 65 - 12 = 53 holds. |
| 15-2-3 | match | 108 dia, 23.5 from the top (z 41.5) (sure) | `cylinders[9]` d 108.0 z 41.5..53 | match | yes | |
| 15-2-4 | match | 106 dia (sure) | `cylinders[10]` d 106.0 | match | yes | |
| 15-2-5 | match | 98 dia bore (sure) | `cylinders[1]` d 98.0 | match | yes | |
| 15-2-6 | mismatch | 53 deep from the top, so floor z 12 (sure) | floor z 11.3, depth 53.7 | **n/a (blank)** | **no** | the floor is a casting size; the finished floor is thinner by 0.7 (the holes in it run z 5.5..11.3). The brief's blank rule applies. |
| 15-2-7 | match | 65 height (sure) | `box` z 0..65 | match | yes | |
| 15-2-8 | match | R about 7 (likely) | torus r 7.0 | match | yes | blank size, equal |
| 15-2-9 | mismatch | 64 dia, 5.5 deep (sure) | `cylinders[2]` d 68.2, depth 5.5 | **n/a (blank)**; depth 5.5 holds | **no** | The blank's 64 is bored out. 05 01_3's plate (68 -0.2) cannot go into 64, so the finished recess is at least 68; 68.2 is consistent with it. The 5.5 depth holds. |
| 15-2-10 | match | 72.5 dia base (sure) | cone d 72.5 | match | yes | |
| 15-2-11 | match | 40° (arc at the lower left, between the base line and the cone), 14.5 high (sure) | cone half angle 49.1 from the axis, which is 40.9° from the base | match | yes | 16.75 across, 14.5 high: atan = 40.9° |
| 15-2-12 | extra | not drawn (sure) | 106.06 recess z 60.3..65 | n/a (blank): the machined bore for the bezel's lip | yes | |
| 15-2-13 | extra | not drawn (sure) | 110.55 lip, cones | n/a (blank) | yes | |
| 15-2-14 | extra | not drawn here (sure) | pin and bolt holes in the floor | n/a (blank); the plate's 8, 2.46 and 1.2 holes are on 05 01_3 | yes | |
| 15-2-15 | can't tell | Gewicht 350 gr (sure) | volume 131 835 mm3, about 1100 g in brass | can't tell | yes | the sheet's weight doesn't fit its own size and material (see above) |

## 05 01_3: Verschlußplatte 05 01 00-2

Title block (sure): Ms, 1:1, "nicht eingetr. Toleranz ± 0,1", revision "a 2x Maße eingetragen" 14.4.48. Held to the printed tolerances and ±0.1.

| id | reader's verdict | my reading of the sheet (certainty) | the built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 15-3-1 | match | 68 -0.2 dia (sure) | 67.9 | match | yes | inside 67.8..68.0 |
| 15-3-2 | match | 28 -0.2 dia (sure) | 27.9 | match | yes | |
| 15-3-3 | match | 26 dia recess (sure) | 26.0 | match | yes | |
| 15-3-4 | match | 1.5 deep (sure) | 1.5 | match | yes | |
| 15-3-5 | match | 10 dia centre boss (sure) | 10.0 | match | yes | |
| 15-3-6 | match | 5.5 +0.1 (sure) | 5.55 | match | yes | |
| 15-3-7 | match | 7.5 +0.1 (sure) | 7.55 | match | yes | |
| 15-3-8 | match | 2 -0.05 -0.1 (likely) | 1.925 | match | yes | inside 1.9..1.95 |
| 15-3-9 | match | 2.3 (sure) | 2.3 | match | yes | |
| 15-3-10 | match | 5 (sure) | 5.0 | match | yes | |
| 15-3-11 | match | 8 +0.2 at 22.6 (sure) | d 8.1, at r 22.6 | match | yes | |
| 15-3-12 | match | M2.6 at 25 (sure) | minor d 2.11 at r 25.0 | match | yes | |
| 15-3-13 | **mismatch** | hole 1.2, at **12,4** from the centre (sure; enlarged crop: the figure is "12,4", the 4 is clear, with a comma). The extension line starts at the hole's centre; depth 3 +0.2 | `cylinders[5]` d 1.2 at r 12.35 (at [8.3382,-9.1103]), z 1.5..4.49, depth 2.99 | **match** | **no** | **The reader misread 12,4 as 12.6; the brief repeated it.** 12.35 vs 12.4 is 0.05, inside ±0.1. Depth 2.99 is 0.01 under the printed 3 +0.2 lower limit, within the mesh's rounding and the general ±0.1. Position along the ray (same as the M2.6, see 15-3-15) is as drawn. |
| 15-3-14 | match; hand can't tell | 90° between the 8 hole and the M2.6 hole (sure) | atan2 gives 90.0° | match | yes | hand: the sheet draws the plate seen from the boss side with the 8 hole at the bottom and the M2.6 and 1.2 at the left; as assembled (box frame y -48..-53) the plate's own frame is the bowl's, so the viewing side and hand stay can't tell |
| 15-3-15 | match | the 1.2 is on the M2.6's ray from the centre, both left of the centre on the horizontal line (sure) | both at -47.5° | match | yes | |
| 15-3-16 | can't tell | the boss's fillet is too small to read (unsure) | R1.3 at z 2.3..3.6 | can't tell | yes | |
| 15-3-17 | match | ±0.1 general (sure) | | match | yes | |

## 05 01_4: Glasrand kompl. 05 01 01

Title block (sure): 1:1, no material, parts 05 01 01-1 (glass) and 05 01 01-2 (bezel). No dimensions printed. The view is an oblique elevation with a half section, so only the right half section is a true vertical cut. Scale of the crop: about 4.67 px/mm, from the title block against 05 01_5 (125 across the bezel).

| id | reader's verdict | my reading of the sheet (certainty) | the built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 15-4-1 | can't tell | glass diameter not given; the oblique drawing runs to the bezel's outer edge on the left (unsure) | `050101-1` d 111.59 | can't tell | yes | the oblique view blurs the seat |
| 15-4-2 | can't tell | thickness: 2.4 on the left cut, about 3.7 on the right edge (unsure) | 3.5 thick, y 18.85..22.35; stands 2.4 above the bezel top (19.95) | can't tell, built is within the two readings | yes | the sheet does show the glass standing above the bezel's top shoulder, as built |
| 15-4-3 | can't tell (about 17.8 scaled) | right half section, top shoulder to underside: about 13.7 ±0.5 (unsure) | `bezel` size z 13.4 | match (unsure) | **no** | The reader's 16-18 is not what I read on the right section. 13.7 against 13.4 is inside the scan. The 16 is the blank's height. |
| 15-4-v1 | | The finished bezel on 05 01_4's right section: a conical inner wall rising outward at about 38-40° from the horizontal, over about 7 mm of height and about 9 mm radially (likely) | `cones[7]` d 92..110.6, z 5.08..12.3, half angle 52.2 (so 37.8° from the horizontal, 7.2 high, 9.3 radial) | match (likely) | | the finished bore is a cone, as built, not the blank's straight 92 |
| 15-4-v2 | | the same section's outer profile: a 45° chamfer at the top, a small raised band, then a slope down to the bottom (likely) | `cones[5,6]`, `cylinders[3..5]`, the bevel cones | match, qualitatively (unsure) | | no size to check |

## 05 01_5: Glasrand R-05 01 01-2 (a casting)

Blank sizes. The tolerance is none printed; "Ms", "Kokillenguß".

| id | reader's verdict | my reading of the sheet (certainty) | the built value I found | my verdict | agree? | why |
|---|---|---|---|---|---|---|
| 15-5-1 | mismatch | 125 dia (sure) | 121.2 | n/a (blank); allowance 1.9 per side | no | |
| 15-5-2 | mismatch | 116 dia at the foot of the bevel (sure) | 113.2 at z 0, 116.1 at z 6.07 | n/a (blank) | no | the 116.1 is reached at 6.07 on the built bevel |
| 15-5-3 | mismatch | 30° from the vertical (125 to 116 over about 8 mm: atan(5.2/8.1) = 32.7°, likely) | the finished profile is curved (cones 13.4°, 45.7°, 70.6°) | n/a (blank) | no | |
| 15-5-4 | mismatch | 92 dia, straight, 11.5 high (sure) | 92 at z 5 only, then a cone to 110.6 | n/a (blank); the finished cone is on 05 01_4 (15-4-v1) | no | |
| 15-5-5 | mismatch | 106 recess (sure) | 109.8 | n/a (blank) | no | the finished recess takes the bowl's 110.55 lip (and the lip's cone to 109.74); the blank leaves 4.5 mm for the boring |
| 15-5-6 | mismatch | 4.5 deep (sure) | 4.5 (cylinder), 5.0 with the cone | n/a (blank); 4.5 holds for the cylinder | no | the reader's own table has the 4.5 cylinder inside; only the cone adds 0.5 |
| 15-5-7 | mismatch | 16 high (sure) | 13.4 | n/a (blank); the finished height is about 13.7 on 05 01_4 | no | |
| 15-5-8 | extra | plain flat top (likely) | chamfers and lip to 13.4 | n/a (blank); the finished section on 05 01_4 shows the chamfer and a raised band | no | |
| 15-5-9 | extra | not drawn (sure) | 121.2 band z 7.5..9.8 | n/a (blank) | no | |

One check on the blank: the dashed lines on 05 01_5 are the 106 recess's roof (4.5 above the foot) and the bore's far wall; nothing else hidden.

## Summary of disagreements with the reader

1. **15-3-13 (the closing plate's 1.2 hole): the reader's mismatch is a misread.** The sheet says 12,4, not 12.6 (sure, enlarged). Built 12.35 is inside ±0.1: **match**. The brief's 12.6 came from the same misreading.
2. **The R- sheets are castings** (Ms-Sandguß/Kokillenguß; Rohteil). Every bowl mismatch (15-2-2, 15-2-6, 15-2-9) and every bezel mismatch (15-5-1 to 15-5-7) becomes "n/a (blank)", and the extras 15-2-12 to 15-2-14, 15-5-8, 15-5-9 too. Sizes that still hold: the bowl's 118, 53, 108, 106, 98, 65, 72.5, 14.5 and 40.9° and R7. The finished recess is at least 68, because the plate is 68 -0.2.
3. **15-4-3 (bezel height on 05 01_4):** the right half section reads about 13.7, not 17.8: match (unsure) with 13.4. The finished bezel's conical bore reads about 38-40° and 7 mm high, matching the built cone (37.8°, 7.2).
4. **Settled can't tells:** 15-1-3 (box height: 105 + 75 lid = 180, match), 15-1-9 (the 17 is the transit lock's centre to the wood's inner face: built 17.1, match), 15-1-8's hand (the bracket is on the +x, +z side as drawn: match).
5. **Missed:** the sheet's own part numbering clash (15-1-v1); the notes "Lagerstellen leicht spielend" and "Kloben verstellen" (15-1-v2); the weight 350 gr fits aluminium and not brass (15-2-15).

Gimbal axis height and the ring: the axis is y 1.05 in the box frame, the ring spans -10.95..13.05 around it, and the bowl bottom is 55.0 below: agrees with the sheet (the pivot is 9.9 below the rim and 53 to 55 above the foot, depending on the scale).
