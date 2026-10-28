# Batch 5, refutation: fusee (body, arbor, click wheel), fusee wheel, cover plate, Vorreiber, dust plate, 05 06_20

Second drawing check, step 7 (PLAN-wempe-drawing-check-2.md), by the refuter, 28 October 2026.

**What was used.** The sheets in `References/wempe/drawings/05-06/` (1024 px scans) and `Wempe_Einheitschronometer.jpg`, cropped with PIL. The model is the read-only worktree `wempe-check2-audit` (main b134d60e). Nothing in it was edited.

**How the model was read.**
- My own Playwright scripts loaded `wempe/index.html?snap&qa&start=movement` on the GPU, one browser at a time.
- `export.py` writes the world-space solids of the parts by `userData.hn` into `mesh.json`.
- `q.py` with `q1.js`, `q2.js` and `q3.js` gave the geometry types in every version and raycasts from the Vorreiber.
- The analyses (`an2.py` to `an11.py`) use numpy and trimesh, with rays cast on the solids. The fusee's axis is at (−16.708, 15.292) in world x and z. The world's y rises toward the winding square.

Scratch: `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b5r\`.

Code comments in `fusee.js` were read for intent only. My verdicts below were written before `batch5-model.md` was opened. `batch5-read.md`, the transcriptions and the first pass's reports were not read.

## Verdicts

| claim | verdict | evidence | sure |
|---|---|---|---|
| **C1.** The winding square is "3,1 r6", not 3.17; the model is 0.05 too large | **confirmed** | See C1 below. | sure |
| **C2.** The dust plate's square hole is straight 3.134 with no 1:100 taper, 0.004-0.034 loose, and sits 4 mm off the journal's shoulder where the coloured section draws it on the square's root | **confirmed, with one figure corrected** | See C2 below. | sure (hole), likely (place) |
| **C3.** The Vorreiber's pin is two ends stopping short of the arbor; the arbor's 1.1 hole is empty; the Vorreiber is 0.01 clear on its taper; nothing holds it. The coloured section draws the pin standing out of the hub both sides | **confirmed** (the gap is 0.025, not 0.012) | See C3 below. | sure |
| **C4.** The pin 05 06 04-4 is Ø 0.500 in a 0.5045 hole where the sheet presses it (0.006-0.022) | **confirmed** | See C4 below. | sure |
| **C5.** bom.json calls the Vorreiber and the chain pin press fits though both clear on the solid; the up-and-down pinion has no relation | **confirmed** | See C5 below. | sure |
| **C6.** The Vorreiber's relief is 0.425 deep on the solid; the README says 0.06-0.31 | **confirmed** | See C6 below. | sure |
| **C8.** checks.py's EXPECTED ('band:Buffer','fusee:Lathe') is stale | **confirmed** | See C8 below. | sure |
| **C9.** Section A-B's lower half draws no flange slot away from A | **confirmed** (as a sheet reading, and the model differs there) | See C9 below. | likely |
| **C11.** The click wheel's screws WN-19 have no thread drawn | **confirmed** | See C11 below. | sure |
| **C13.** The groove radius 10,04 against the model's 10.07 | **refuted as a model error**; the discrepancy between the two sheets is real | See C13 below. | likely |
| **C14.** The stub's 1:70 taper isn't modelled | **confirmed, with one nuance**: it is drawn at 1:225, not left straight | See C14 below. | likely |
| **Tube.** The fusee wheel's tube "6,6 +0,1" is drawn about 6.3-6.4; the model keeps 6.5 g6 because the ratchet's 6.5 H7 bore couldn't take 6.6 | **the reason holds, more strongly than stated** | See "The tube" below. | sure |

### C1. The winding square

- **The figure** (`c15c.png`, turned and enlarged ×10):
  - After "3," there is one glyph and then the square sign, with "r6" under it and "+0,023 / +0,015" beside.
  - That glyph is the flagged "1" of this hand. The "1" in "+0,015" beside it is drawn identically, and r6 is +0.015, so it is a 1.
  - +0.023/+0.015 is exactly r6 for sizes over 3 to 6 mm.
- **The taper settles the nominal.** On 05 06_15 the flats run from the 4,39 shoulder at x 441 to x 570 at 7.0 px/mm, about 18.4 mm. "2,92" is dimensioned there.
  - From 3.12 (the middle of 3,1 r6), 1:100 over 18.4 gives 2.94. Over the 20.3 to the point it gives 2.92.
  - From 3.17 it would need 25 mm of square.
- **The 1941 assembly agrees.** 05 06_1 draws the dust plate 1 mm from the square's root ("1", `c01c.png`). A 3,1 H7 hole on a 1:100 square sits there only if the root is about 3.11-3.13.
- **The solid:** the corners at r 2.2415 at the root (y 627.725), so 3.170 across the flats. At the flats' end (y 645.373) it is 2.993.

### C2. The dust plate on the square

- **The solid:**
  - The hole's corners are at r 2.2162 at both of its levels (y 631.725 and 633.725), so it is 3.134 across the flats and straight.
  - The square part of the hole is only 2.0 long. From 633.725 to 634.725 the plate has its Ø 6.25 recess.
  - Against the square (3.130 to 3.110 over those 2 mm), it is 0.004-0.024 loose, not 0.034.
  - The plate's face toward the plates is at y 631.725, 4.0 from the square's root at 627.725.
- **The sheets:**
  - 05 06 00-1 draws the hole "3,1 □ H7 +0,012, Kegel 1:100" with an arrow (`c05a.png`).
  - The coloured section draws the plate's face on the root, the recess facing away from the plates (`colA.png`).
  - 05 06_1 draws it 1 mm off the root.

### C3. The Vorreiber's pin

- **Along the pin's axis** (`an5.py`, `an6.py`):
  - The two ends run from r 2.223 to 3.741. Each is 0.009 inside the hub's Ø 7.5, so neither stands out.
  - The arbor is absent from r −2.2 to +2.2 along that line: the Ø 1.1 cross hole is cut and empty.
  - The arbor's surface at the pin's height is r 2.198-2.200, so each end stops 0.025 short of the arbor's metal. It is 0.011 short of the Vorreiber's bore, which is r 2.212.
- **On the taper:** the Vorreiber's bore is 0.014 clear of the arbor on the radius, the same at every height of the seat.
- **Below the Vorreiber:** a ray down from its lower face meets the pillar plate (050802-1) 0.920 below (`q3.js`). The Vorreiber, the fusee wheel and the maintaining work above it can therefore drop 0.92 and turn freely on the arbor.
- **The sheets:**
  - The coloured section draws the pin through the hub, its rounded ends standing out of the hub on both sides (`colC.png`).
  - 05 06_15: "1,1 bohren + konisch reiben".
  - 05 06_1: "Vorreiberstift", its circle drawn Ø 1.2.

### C4. The pin 05 06 04-4

- **The solid:** the pin is 0.500 across (y 617.725 to 618.225). The code gives its hole a radius of 0.25225, so Ø 0.5045.
- **The sheets:**
  - 05 06 04 (03-2, item 5) dimensions the pin "0,5 ⌀ s6(?) +0,022 +0,015" (`c032a.png`).
  - 05 06 04-2's C-D gives the hole "0,5 ⌀ H7 +0,009".
  - Together that is 0.006-0.022 interference.

### C5. The fits in bom.json

- **The relations:** bom.json has `050600-2 round 050604-1 press` and `050600-6 in 050604-2 press`. `050200-5` has `rel: []`.
- **On the solid** (BOM.md as last built): the Vorreiber has a least gap of 0.0134, the chain pin 0.0059.
- **The same is true of two more lines:** the dust plate has a press with a gap of 0.0034, and 050604-4 a press with a gap of 0.0063.
- **Why they pass:** bom.py's `IN['press']` accepts gaps from −0.03 to +0.05, so these pass by design.

### C6. The Vorreiber's relief

- **The solid:** the relief's wall is at r 4.973 from y 603.26 to the face at 603.685, so 0.425 deep. The overall thickness is 2.76, with face a re-turned.
- **The sheet:** 05 06 00-2 gives "0,4 +0,05" as the relief's axial depth from face a (`c06a.png`). Face a is marked on the relieved face.
- **The README** (line 607) says the re-turn leaves the relief 0.06-0.31 deep. The solid keeps the as-made depth under the re-turned face, which is inconsistent.

### C8. checks.py's band entry

- No visible mesh of `fusee` is a `LatheGeometry` in any of the five versions (last, first, 3955, 6mx, 1943; `q2.js`). They are BufferGeometry, BoxGeometry and CylinderGeometry.
- fine-interference.js names a mesh by `geometry.type`, so 'fusee:Lathe' can match nothing.

### C9. Section A-B's lower half

- **The sheet** (pixel rows on 02-2):
  - The upper half, through A: two ribs at full radius, 600-608 and 616-623 px, with the 0.87 slot between them. That is 23 px, the "2 ±0,02".
  - The lower half, through B: one land at full radius, its outline continuous from x 597 to 611 (14 px, about 1.15 mm at 12.1 px/mm).
  - Then comes a step down to r ≈ 15.6 for about 0.9 mm, the first thin rib (r ≈ 16.8), and the next land (r ≈ 14.0).
- **The model** (radial first-hit profiles, `an9.py`):
  - At B: full radius only 0.55 from the face, then r 17.25 for 0.6 (the slot's floor, 0.55 deep), then 15.86, then the rib at 16.46, then 13.97.
  - At A: the rib, the slot down to r 14.90, the second rib, then the groove.
- **So:** the model runs the slot (floor r 17.25) round the circumference where the lower half draws a full-radius land. The deeper features match the sheet within a few tenths.

### C11. The click wheel's screws

- WN-19 is a turned shank of Ø 2.0 (r 1.0), 20 segments, with a box for the slot. It carries no `userData.thread` and has no threadGeo mesh.
- WN-20 and the clicks' screws have both.

### C13. The fourth groove radius

- **Both body sheets read 10,07.** On 02-1 and 02-2 (`g21.png`, `g22.png`, ×10), the last digit has the flagged stroke of the 7s in "9,47" and "14,75" on the same column. It is unlike the 4 of "11,24".
- **05 06_20 reads 10,04, clearly.** But it is the "Schneckenkurve von Stahlschnecke", a steel fusee's curve with its force, not the part's sheet.
- The model's 10.07 follows the part's own two issues, so it is not an error. Record the 0.03 difference.

### C14. The stub's taper

- **The solid:** the stub runs from r 0.8375 at y 593.525 to 0.830 at 590.15. That is 1.675 to 1.660 over 3.375, so 1:225.
- **The sheet:** 05 06_15 writes "1:70" inside the stub, as on every round portion. Over 3.375 that would change the diameter by 0.048.
- The up-and-down pinion's bore is a straight Ø 1.600.

### The tube

- **The ratchet's bore:** 05 06 02-1 (sheet 12) gives "6,5 ⌀ H7 +0,015". It was drawn 29.11.40, and revision a (11.3.48) changed only 37,25, 25,4, 0,3 and D, not the bore. So the 6.5 H7 bore is the 1940 ratchet's too, not only the 1948 one.
- **The fit:** 05 06_1's fit table carries 6,5 H7/g6.
- **The tube's figure** (`c07b.png`): written over a blot, read "6,6 +0,1". A tube of 6.6-6.7 can't enter a 6.500-6.515 bore.
- **Drawn size:** the tube's outer edges are at x 303.5 and 347 against the bore's 312 and 339, with the scale 6.89 px/mm by the 40.65. That gives 6.31, or 6.44 after correcting by the bore's drawn 3.92 for 4.0.
- **The solid:** the tube is Ø 6.490 and the ratchet's bore Ø 6.507.

## Extra checks: the figures most easily misread

| # | figure (sheet) | the trap | sheet reading | model | verdict |
|---|---|---|---|---|---|
| 1 | "3,1 □ r6" (15) | the flagged 1 read as 7 | 3.1 r6 (C1) | 3.17 | wrong (C1) |
| 2 | "28,3" (15) | from the square's root or from the journal's shoulder | the extension line is at the 4.5 shoulder (x 391), with the 8 inside it (`c15e.png`) | the point 28.300 from the shoulder (y 619.725 to 648.025) | match |
| 3 | "17,7 −0,05" (15) | to the shoulder of the Vorreiber's seat, or to the hole's centre | its left arrow is at x 271.7, the hole's circle 268.3, the shoulder 256.7: to the hole's centre | hole centre 2.0 from the dial shoulder (19.7 − 17.7) | match |
| 4 | "0,4 +0,05" (06) | the relief's width or its depth | an axial dimension, so the depth from face a | 0.425 | match the figure; inconsistent with the re-turn (C6) |
| 5 | "1,1 ±0,1" (06) | the hole's diameter or its place | from the hub's face to the cross hole's centre; the hole is "0,8 ⌀" | Ø 0.8, centre 1.1 from the hub face | match |
| 6 | "2,1 −0,2" (05) | the recess depth or the land | from the chamfered face to the recess floor, so the recess is 1.0 deep in the 3,1 −0,2 | 3.0 overall, recess 1.0 (y 633.725 to 634.725), Ø 6.25 | match |
| 7 | "6,6 +0,1" (07) | an overwritten figure on the tube | 6.6 written, drawn 6.3-6.4 | 6.490 | estimate justified (Tube) |
| 8 | "4 +0,1" (07) against 01's "4,45 H7/g6" | which issue governs the wheel's bore | 4.0 drawn (3.92); 01's fit 4.45 H7/g6 (0.004-0.024 clear) | Ø 4.548 on the seat's 4.43-4.47: 0.040-0.060 clear on the radius (0.08-0.12 on the diameter) | departs from both, recorded as an estimate. A 4.45 bore would wedge on the 1:70 seat, so 01 implies a straight seat in 1941. |
| 9 | "9,7(1)" and "10,07" (02-1, 02-2) | a lost digit; 7 against 4 | 9,71 (02-1; 02-2 faint), 10,07 | RFT 9.71 and 10.07 | match (C13) |
| 10 | "7 ⌀ H7" bore against the collar "7,04 −0,01" (02-2, 15) | a press read as a slide | press, 0.018-0.040 | bore Ø 7.006, collar Ø 7.04 (r 3.5154 faceted): 0.034 | match |
| 11 | "2 −0,1", "7,5 +0,05" (16) | thickness against bore | — | 1.95 (y 606.675 to 608.625); bore 7.525 (code) | match |
| 12 | "0,8 −0,1", "21,1 −0,1" (08) | thickness | — | 0.800 (618.475 to 619.275); Ø 21.05 | match |
| 13 | "5 +0,2" (07) | the tube's height from the underside or from the rim | from the underside | 5.000 (602.385 to 607.385) | match |
| 14 | "12,6 −0,1" (02-2) against the bracketed "(12,3)" (03-2) | which length is real | (12,3) is a reference after the re-turn | 12.35 (606.125 to 618.475) | 0.05 over the bracketed figure. Being a reference it isn't toleranced: note only. |

**The Vorreiber pin's diameter is unsettled across the sheets:**
- 0,8 in the hub (06, 1941);
- "1,1 bohren + konisch reiben" in the arbor (15, 1940);
- a circle drawn Ø 1.2 (12.2 px/mm, 15 px) and labelled 1,2 on 05 06_1.

A taper pin reamed through both at assembly fits all three only loosely: a 1:50 pin changes by 0.15 over the hub's 7.6. The model's 0.8 is the part sheet's. Record it as unresolved.

## Disagreements after reading batch5-model.md

- **C1 / M1, C4 / M4, C5 / M5, C8 / M8, C11 / M11, C14 / M14:** agreed. On C14 the model comparer has "possible"; I'd put it at likely, since the "1:70" is legible inside the stub.
- **C2 / M2:** agreed, with two refinements.
  - The looseness on the solid is 0.004-0.024. The hole's square part is 2.0 long; the last 1.0 is the Ø 6.25 recess, so M2's 0.034 at the key-side face isn't a square contact.
  - 05 06_1, the 1941 assembly, also dimensions the plate 1 mm off the root, a second source for the place besides the coloured section.
- **C3 / M3:** agreed on the verdict. The figure differs.
  - M3's "0.012 short of the arbor's seat" uses the Vorreiber's bore (r 2.212) as the seat. The arbor's own surface there is r 2.198-2.200, so each end stops 0.025 short of the arbor's metal (0.011 short of the bore).
  - Add that the stack can fall 0.92 to the pillar plate (raycast), so "held by nothing" is literal both axially and in turning.
- **C6 / M6:** agreed.
- **C9 / M9: partly disagree on how sure.**
  - M9 calls it possible on two grounds: the half isn't to scale (its ribs drawn 1.1 high for 0.6), and a slot only at A would leave the chain's first turn nowhere to run.
  - On the first: the land's continuous outline at full radius for 14 px is a line, not a scaled height. The lower half's deeper levels match the model's at B within a few tenths (land 15.6 against 15.86, rib tip 16.8 against 16.46, next land 14.0 against 13.97), so the half is close to scale there.
  - On the second: the lower half shows the chain's path at B already in the helix's first land, right after the full-radius block. The slot is only needed where the hook and the chain's first link lie, near A, which the Ø 13.5 cutter's arc provides.
  - I would put the sheet reading at likely. Keeping the model and recording it under Unresolved is reasonable, since the difference is a 0.55 × 0.6 groove the chain doesn't touch.
- **C13 / M13:** agreed that this is record only. I'd raise the reading of 10,07 on the bodies from possible to likely: both issues show it, with the 7's stroke matched to the column's other 7s.
  - Add that 05 06_20 is a steel fusee's curve ("von Stahlschnecke"), so its 10,04 isn't this part's figure.
- **Tube / M10:** agreed. One wording change: the ratchet's 6,5 H7 is on the ratchet's sheet as drawn 29.11.40 and unchanged by its 1948 revision. Say "the ratchet's 6,5 H7 (05 06 02-1, 1940, unchanged 1948)" rather than "the 1948 ratchet's".
- **Extra check 8 (the wheel's bore):** M's F6 "holds as recorded". I agree it is recorded. Note that the model's 0.08-0.12 diametral clearance is 4-5 times 01's H7/g6, and matches neither sheet figure: an estimate, not a reading.
- **Extra check 14 (12.35 against the bracketed 12,3):** M's table calls it a match via the re-turn. 12.35 is 0.05 over (12,3 −0,1), but bracketed figures are references, so no finding.
