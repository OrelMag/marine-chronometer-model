# Batch 5, the model against the sheets: fusee (body, arbor, click wheel), fusee wheel, cover plate, Vorreiber, dust plate, the chain's pin, the up-and-down pinion on the arbor

Second drawing check (PLAN-wempe-drawing-check-2.md), steps 4, 5 and 6 and the extra checks, by the model comparer, 28 October 2026. The inventory, joints and drawn holes come from the blind reading (`batch5-read.md`, with its Step 3 corrections). Its F1-F16 are settled below.

## How it was measured

- **Model.** The read-only worktree `wempe-check2-audit` (main at b134d60e, 3.45.03). Nothing in it was edited.
- **Scratch.** All the files named below are in `C:\Users\USER\AppData\Local\Temp\claude\e--Marine-Chronometer\68700a8e-be00-4ada-9796-297f431020bf\scratchpad\dc2\b5m\` (written `b5m\` below).
- **Solids.**
  - `b5m\dump.py` (batch 4's) loads the page (`?snap&qa`, GPU) and freezes it as isolate.py does (n 2.5, running).
  - It writes every visible mesh of `fusee`, `coverPlate`, `vorreiber`, `dustPlate`, `fuseeWheel`, `udPinion`, `stopWork`, `maintaining`, `fuseeBush`, `dustBush` and `corkRing`, as last revised and as 3955 (`dump.json`).
  - The code has one version group among these parts: the square's length, `'last first 6mx 1943 -3955'` against `'3955'` (fusee.js lines 470-475). Every other piece is the same in all five versions, so the two dumps cover them.
- **Analysis.**
  - The vertices were measured directly, in the part's own group frame (`frame()`) and in the movement frame about the fusee's axis (`mframe()`, for joints between parts) (`inv.py`).
  - The turned profiles were read as (r, y) rings (`prof.py`), and sections were taken along a ray at the lathes' own angles (`sect.py`).
  - Face levels and their loops were taken, with circles fitted (`a_lv.py`, `a_hole.py`). The square was measured across its flats (`a_sq.py`), and the pins along their axes.
- **Overlays.**
  - `overlay.py` (batch 3's) renders a build book page at the sheet's px/mm and registers it by FFT over mirror, turn and scale. `runov.py` runs it in four turn windows.
  - The output is `b5m\ov\*.png`: sheet red, book blue, both black.
  - The scans' scales were measured on the sheets' own figures, not taken from their paper size:
    - 02-2: 12.0 px/mm (its 12,6).
    - 16: 17.5 px/mm (its 16,0, 14,5, 11,5 and 7,5).
    - 08: 17.2 px/mm (its 21,1).
    - 07: 6.8 px/mm (its 33,8).
  - The registration score favours small scales, so each scale was fixed to ±4 %.
- **Renders.** `isolate.py --model wempe` was run on:
  - fusee, fuseeWheel, vorreiber, coverPlate and dustPlate from four sides (`b5m\iso\r_iso_fusee_fuseeWheel_vorreiber_coverPlate_dustPlate.png`);
  - fusee and Vorreiber from underneath (`iso\under_fusee_vorreiber.png`);
  - the wheel and Vorreiber from both faces (`iso\wheel_vorreiber.png`);
  - the small end with the cover plate and stop work, close up (`iso\smallend.png`).
- **Tools.** These were run one at a time:
  - `holecheck.py --model wempe` (`b5m\holecheck.txt`): 1565 holes over 5 states, 0 failing. No entry is for these parts.
  - `audit.py --model wempe` (`b5m\audit.txt`): nothing new. The chain pin's flush ends at y −6.12 and −7.92 are among the expected coplanar faces.
  - `seatcheck.py` isn't on main at b134d60e, so there is no `SEAT_EXPECTED` to re-judge.
- **Book.** `book/wempe-build-book.pdf` (WBOOK) has:
  - the fusee: body 210-212, arbor 213-214, click wheel 215-218, screws 219, pin 221;
  - the cover plate 223-226, the Vorreiber 228-231, the dust plate 233-234, the fusee wheel 235-236, the up-and-down pinion 351.

  It is titled v3.41.00 and shows the version as last revised.

**Frame of reference.** The axial places below are the movement's y (dial side +y; the pillar plate's inner face y 0, the top plate's inner face −19.0).

| y | what is there |
|---|---|
| −0.025 | the arbor's dial-side shoulder |
| −19.725 | the arbor's shoulder at the fusee bush |
| −0.925 | the Vorreiber's hub face |
| −3.685 | the Vorreiber's face a |
| −2.385 | the fusee wheel's underside |
| −6.125 | the body's large face as re-turned (−5.925 as turned) |
| −8.625 | the large end's recess floor |
| −18.475 | the small end |
| −19.275 | the cover plate's outer face |

The fusee's axis is at (−16.708, −15.292).

**Which version carries which sheet.**

| part | every version |
|---|---|
| body, arbor, click wheel, screws, chain pin | 05 06 04-2 (02-2, 27.2.48), 05 06 04-1 (15), 05 06 04-3 (16, 1947), as assembled on 05 06 04 (03-2, 2.3.48). The 1941 body and fusee (02-1, 03-1, 01) are built in no version (README "As first drawn", line 438). |
| arbor's square | 28.3 to the point (15); 3955: 23.8 (photograph, README) |
| Vorreiber, cover plate, dust plate, fusee wheel | 06, 08, 05 (1941), 07 (1940): one form in all five |

F15 (the generations) therefore holds as recorded: no version mixes the 1941 and 1948 issues within the fusee.

---

## 05-06_02-2: the body 05 06 04-2 (5:1, revised 27.2.48), as re-turned on 05 06 04 (03-2, 2.3.48); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| outside (flange) | 35,6 −0,1 | Ø 35.600 | 0 | match (upper limit) | sure |
| length | 12,6 −0,1; 03-2: (12,3) bracketed | blank 12.55, re-turned 0.2 to 12.35 | — | match; the re-turn recorded (README Estimated, line 607) | sure |
| re-turned face to the step's end | 03-2: 13,7 −0,1 | 13.600 | lower limit | within | sure |
| face to the click wheel | 03-2: 0,5 +0,05 | 0.550 | upper limit | within | sure |
| face outside Ø 33 | 03-2: 33 Ø +0,1, 5° | flat inside r 16.50, falling 5° to the rim (0.114) | 0 | match | sure |
| recess mouth | (a) 29,8 Ø +0,2, (a) 45° | Ø 29.8 at the blank's face (Ø 29.4 at the re-turned face), 45° to Ø 26.3 | 0 | match | sure |
| recess | (a) 26,3 Ø +0,2 | Ø 26.300 | lower limit | within | sure |
| recess floor to small end | (a) 9,9 −0,1 | 9.850 (−8.625 to −18.475) | mid | match | sure |
| bore | 7 Ø H7 +0,012 | Ø 7.006 | mid | match | sure |
| small-end recess | 15 Ø, 1,6 +0,1 | Ø 15.000 × 1.600 | lower limit | match | sure |
| small end | 21 Ø −0,05 | Ø 21.000 | upper limit | match | sure |
| flange's ribs | 2 ±0,02 over both; 0,87 +0,01 slot; 0,37 second rib; first 0,8 | from the blank's face: 0.76, slot 0.87 (0.88 on the solid's rows), second rib 0.37 at the helix's turn 1 (0.34 at A, 0.28 at −30°, eaten by the first turn's land beyond); from the re-turned face 1.8 over both | 0 | match (the first turn's rise out of the slot is an estimate, README 608) | sure |
| slot floor | r 17,25 | r 17.250 | 0 | match | sure |
| cutter at A | 13,5 Ø, 2,9 deep | slot floor r 14.900 at A (17.8 − 2.9), arc of R 6.75 in the slot only; ribs whole at A | 0 | match (F3, the model's reading) | likely |
| groove floor radii | 9,30 … 17,25 ("Grund"), 10,07 or 10,04 | RFT at whole turns 17.25, 14.75, 13.32, 12.17, 11.24, 10.55, **10.07**, 9.71, 9.47, 9.30; at 200° the floors 15.658, 13.857, 12.625 … as the table interpolates | 0 | match; F10 (M13) | sure |
| groove | 1,2 ±0,01 pitch; rib 0,33; 0,6 high | land 0.87, rib 0.33, rib top +0.60, pitch 1.20 (section at 200°) | 0 | match | sure |
| "alle Maße: +0,6" | sign uncertain | ribs 0.6 over the floors | — | match (F9) | likely |
| groove's end N | 0,3 from the small end; C at 0,8 | uncut end r 10.5 for the last 0.3; N 0.067 turn past full wind | 0 | match (N's angle, README Unresolved) | sure |
| flange at B (180° from A) | the A-B section's lower half draws the large end as one block at the full radius for about 1.2 (79.8 px/mm on the zoom), then the first land; no slot | at 170°: the first rib 0.55 (from the re-turned face) at r 17.8, the slot's floor r 17.25 for 0.6, then the land r 15.86 | the slot | **possible (M9)** | possible |

### Its holes (H1-H6)

| hole | sheet | model | verdict | sure |
|---|---|---|---|---|
| H1 bore | 7 H7 | Ø 7.006, through | match | sure |
| H2 3 × M2 | r 5,75, 120°, 6 +0,5 deep from the recess floor; C-D draws them at 17°, 137°, 257° with A at 90° (seen from the small end) | Ø 2.04 (thread size and 0.02, flat), −8.625 to −14.875 (6.25), r 5.750, at A + 74°, 194°, 314° (mirrored: 16°, 136°, 256°) | match | sure (angles likely ±2°) |
| H3 M1,7 | "6 r", 1 from the A-B line on the side away from the slot, 6 deep | Ø 1.74, r 6.000, A + 9.6° (1.00 off the line), −16.875 to −10.875 | match | sure |
| H4 0,5 H7 | along the slot, 1,5 off the A-B line, on the slot's side (C-D's "15" and "1") | Ø 0.5045 on the pin's axis, 1.5 off the line on the slot's side, from the recess out through the end | match; its pin M4 | sure |
| H5 0,55 +0,01 | axial through both ribs (A-B top) | Ø 0.555, from the face to 2.05 under the blank's face, r 16.80 (1.0 under the ribs' tops) | match | sure |
| H6 circle at A | no size | drawn about Ø 0.7 (8-9 px at 12 px/mm), its centre 0.83 in from the rim against the "1": H5 seen along the axis; no second hole | F16 settled | likely |
| slot 2 H8 | 4 to 6 off the A-B line, 1,1 +0,05 and 1,5 +0,05 deep | 2.000 wide (lower limit), 1.500 deep, 1.100 beyond u 8.0 | match; the step's place an estimate (F8, README 610) | sure / estimate |

### Step 5, overlay

`ov\s022_secA.png` is book p. 210's A-A on the sheet's Schnitt A-B (mirrored, turned 90°, scale 1.02).

- The bore, both recesses, the 45° mouth, the flange's diameter, the small end and its Ø 21 lie on the sheet's lines. The re-turned face stands 0.2 inside the sheet's.
- The book's groove ribs fall between the sheet's. The book's A-A doesn't cut through A (its section line is the plan's horizontal), so the helix is at another phase there. This is not a geometry difference.
- The sheet's unpartnered lines are:
  - the in-plane M1,7 at the top (the book's plane misses it);
  - the dimensions.
- The book's unpartnered lines are the stop bar slot's pieces at the small end. They are in the book's plane and out of the sheet's.
- Book p. 210 prints its level figures (9.85 … 7.54) above the frame (M12).

---

## 05-06_15: the arbor 05 06 04-1 (2:1, 1940, checked 17.4.43); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| between shoulders | 19,7 +0,05 | 19.700 (−0.025 to −19.725) | lower limit | match | sure |
| cross hole | 17,7 −0,05 from the far shoulder; "1,1 bohren + konisch reiben" | Ø 1.1 straight, centred 17.700 from it (2.000 from the dial shoulder) | 0 | place match; the taper isn't drawn (README 613); joint M3 | sure |
| pivot | 2,8 ±0,02 to 2,7, 1:70, 6,5 +0,1 | Ø 2.800 → 2.708 over 6.500 | 0 | match | sure |
| stub | 1,6 +0,1/+0,05, "1:70" | Ø 1.675 → 1.660 over 3.375, then 0.25 to Ø 1.2 | — | size within; its taper 1:225, not 1:70 (M14) | likely |
| dial end | the 60,6 −0,2 overall leaves 6,1 for the stub and its centre | cut at y 10.1, 0.25 under the dial (3.625 past the pivot's end) | −2.5 | recorded (README 124: the dial-end centre cut off; the dial has no hole over the fusee) | likely |
| Vorreiber's seat | 4,5 ±0,02 to 4,38, 1:70 | Ø 4.500 → 4.380 over 8.700 | 0 | match | sure |
| collar | 7,04 −0,01, 7,9 | Ø 7.040 × 7.900 | upper limit | match | sure |
| step | 6,1 −0,05, 3,1 (+0,05) | Ø 6.100 × 3.100 | upper limit | match | sure |
| journal | 4,5 ±0,02 to 4,39, 1:70, 8 | Ø 4.500 → 4.390 over 8.000 | 0 | match | sure |
| square | "3,1 r6" +0,023/+0,015 (the small "r" over "6" read as a 7 by the transcription), 1:100, **2,92** at the point | **3.170** at the root → 2.993 where the flats end (17.65 on), point to −48.025 | +0.05 | **wrong (M1)** | sure |
| square to its end | 28,3 | 28.300 (yT to the point); 3955 23.8 | 0 | match; 3955 recorded | sure |
| overall | 60,6 −0,2 (both centres) | 58.125 | — | the dial-end centre cut off (above) | — |

**The square, M1.** "+0,023/+0,015" is exactly r6 for sizes over 3 to 6 mm (ISO 286). The sheet's other figure settles the nominal. With the root at 3.12, 1:100 over the 20.3 of the square gives **2.917** at its end, which is the sheet's "2,92". With the model's 3.17 it gives 2.967.

### Step 5

- The FFT registration of book p. 213 on the 2:1 elevation didn't hold at the scan's 7.1 px/mm. Its best fit sits at the scale bound.
- The arbor was compared by its figures above, every diameter and length to within 0.001 but the square and the stub's taper.
- Book p. 214 lists "Ø 6.08, Ø 7.02". Those are the 40-segment lathe's flats; the solid has 6.100 and 7.040. It gives no square size, no tapers and no cross hole (M12).

---

## 05-06_16: the click wheel 05 06 04-3 (5:1, 6.8.47); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | 35 | 35 | 0 | match | sure |
| tips | 16,0 −0,05 | Ø 15.990 | mid | match | sure |
| roots | 14,5 −0,2 | Ø 14.400 | mid | match | sure |
| face | 8° (from a root through the face) | each face 8.0° to the radius at its tip, the tip 0.89° ahead of its root (undercut) | 0 | match on the model's reading (F13) | likely |
| "12,5" | unattached | — | — | n/a (F13) | — |
| thickness | 2 −0,1 | 1.950 | mid | match | sure |
| bore | 7,5 +0,05 | Ø 7.525 | mid | match | sure |
| bore's chamfer | 0,3 +0,2 × 45°, on the face where the holes are narrow (the section's top) | 0.4 × 45° on the face against the recess floor (−8.625), which is where the holes are narrow | 0 | **match**; the code comment names the other face (M7) | sure |
| holes | 3 × Ø 2 +0,1, Kegel 1:8, narrow at the top face, on 11,5 ±0,05 at 120° | Ø 2.00 at the floor face → 2.25 at the free face (1:8 over 1.95), r 5.750, 120°; over the body's M2s to 0.001 | 0 | match (lower limit) | sure |
| on the body | 03-2 items 3, 4 | on the recess floor, the screws through it | — | match | sure |

### Step 5

- `ov\s16_sec.png` is book p. 215's A-A on the section (turned 180°, scale 1.00). The faces, bore, chamfer and tapered holes lie on the sheet's lines.
- `ov\s16_plan.png` (turned 270°, scale 0.98):
  - The bore and the holes' pitch circle coincide with the sheet's.
  - The holes stand about 10° round from the sheet's, against the teeth. The sheet doesn't tie the holes' angle to the teeth (it gives only their 0.2 runout), so this is no finding.

---

## 05-06_08: the cover plate 05 06 00-4 (5:1, 1941); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| diameter | 21,1 −0,1 | Ø 21.050 | mid | match | sure |
| thickness | 0,8 −0,1 | 0.800 | upper limit | match | sure |
| centre hole | 6,1 H8 +0,018 | Ø 6.109 | mid | match | sure |
| its land | 0,4 −0,1 from the face on the body | 0.400 | upper limit | match | sure |
| its sink | 60° | 60.0° from the axis (120° included), to Ø 7.49 at the outer face | 0 | match: the sheet's arc runs from the extension line parallel to the axis to the cone line, 62.7° on the crop (F12 settled) | sure |
| outer edge | 45° on the outer face | 0.65 × 45° | — | estimate, recorded (README 617) | sure |
| screw hole | 1,85 −0,1 at 6 ±0,05 | Ø 1.800 at r 6.000, over the body's M1,7 to 0.001 | mid / 0 | match | sure |
| its sink | 3,1 +0,1, 90°, on the outer face | Ø 3.150 at the outer face to Ø 1.80 0.7 down (88° included), a 0.1 land | mid | match | sure |

### Step 5

`ov\s08_plan.png` is book p. 224's view from below on the sheet's plan (scale 1.00).

- The outer circle, the centre hole and its sink's circle lie on the sheet's lines. The book's second outer circle is the 45° chamfer's edge, which the sheet's plan, seen from the body's side, doesn't show.
- The book draws the countersunk screw hole as two short arcs "( )", 180° round from the sheet's. The view is reversed, so the angle is a view convention. The broken hole is the book's (M12).
- p. 225 lists no screw hole.
- `ov\s08_sec.png`, the thin section, registers but adds nothing to the figures above.

---

## 05-06_06: the Vorreiber 05 06 00-2 (5:1, 1941); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| flange | 14 Ø d11 (−0,050/−0,160) | Ø 13.895 | mid | match | sure |
| hub | 7,6 −0,2 | Ø 7.500 | mid | match | sure |
| overall | 3,1 −0,2; "Fläche a nachdrehen" | 2.760 (face a re-turned) | −0.14 under the lower limit | recorded (README 607) | sure |
| flange | 1,2 −0,2 | 0.860 | −0.14 | recorded, the same re-turn | sure |
| bore | 4,4 H7 +0,012 at the flange, (4,36) at the hub, 1:70; "Loch Ø zur Welle passen" | Ø 4.444 → 4.412 (the seat + 0.01 on the radius) | 0.03-0.05 over the figures | fitted to the arbor, as the note says; 0.01 clear on the radius (M5) | likely |
| cross hole | 0,8, 1,1 ±0,1 from the hub face | Ø 0.800 at 1.100 | 0 | match | sure |
| relief in face a | 9,9 Ø +0,2, 0,4 +0,05 | Ø 9.950 × **0.425** below the re-turned face | mid | match the figures; README 607 says the re-turn leaves it 0.06-0.31 deep (M6) | likely |
| chamfer | 0,3 +0,1 on the flange's hub side | 0.35 × 45° there | mid | match | sure |
| place | on the seat, pin 2 from the dial shoulder | hub face at y −0.925, pin centre −2.025 | 0 | match | sure |

### The pin 05 06 00-5 (no sheet)

| feature | source | model | verdict | sure |
|---|---|---|---|---|
| diameter | the Vorreiber's 0,8 | Ø 0.800 in Ø 0.800 | match | sure |
| through the arbor | 01 ("Vorreiberstift", 91, to the cross hole), 15 ("1,1 bohren + konisch reiben") | **two separate ends**, from r 2.224 to 3.761. The arbor's seat is r 2.212 there, so each end stops 0.012 short of the arbor, and the arbor's Ø 1.1 hole (at −55°/125°, lined up with the pin's −51°/129°) is empty | **joint fails (M3)** | sure |
| length | the coloured section (`cs_bot.png`) draws it through the hub and standing out both sides, about 8.9 against the hub's 7.6 (scaled on the hub, 27 px/mm on the crop) | ends 0.01 inside the hub's Ø 7.5 | **possible (M3)** | possible (pictorial) |

### Step 5

`ov\s06_sec.png` is book p. 229's half section on the sheet's (turned 90°, scale 0.96).

- The hub, the bore and the flange's diameter lie on the sheet's lines.
- Face a and the flange stand 0.34 inside the sheet's face, the recorded re-turn.
- The sheet's unpartnered lines are the dimensions and the surface marks.
- Book p. 230 lists "bores Ø 9.95" (the relief). The 4.4 1:70 bore and the Ø 0.8 cross hole are not listed (M12).

---

## 05-06_05: the dust plate 05 06 00-1 (5:1, 1941); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| diameter | 7,6 −0,1 | Ø 7.550 | mid | match | sure |
| length | 3,1 −0,2 | 3.000 | mid | match | sure |
| recess | 6,2 Ø +0,1 | Ø 6.250 | mid | match | sure |
| to the recess floor | 2,1 −0,2 | 2.000 (recess 1.0 deep) | mid | match | sure |
| chamfer | 0,5 +0,2 × 45° on the face away from the recess | 0.5 on the face toward the plates | lower limit | match | sure |
| recess toward the key | coloured section | on the face away from the plates | — | match (F11) | sure |
| square hole | 3,1 □ H7 +0,012, Kegel 1:100 | **3.134 across the flats, straight** | +0.022 over H7; no taper | **wrong (M2)** | sure |
| place | the coloured section draws it on the square's root, against the journal's shoulder (`b5m\cs_dust_zoom.png`: the journal 1.0 proud of the fusee bush, then the plate, 3.2 thick, scaled on the journal's Ø 4.5) | **4.0 off the shoulder** (y −31.725 to −34.725; the root at −27.725), where the 3.17 square is 3.10-3.13 | 4.0 | **wrong (M2, with M1)** | likely |
| on the square | a 1:100 wedge | square 3.130 at its plates-side face, 3.100 at its key side: 0.004-0.034 loose, held by nothing | — | **joint fails (M2)** | sure |

### Step 5

- The book (p. 233) draws the plate in section with a straight square hole, turned about 30° in plan.
- The registration of the 5:1 section wasn't run. The sheet's section is 3 mm across at 17.5 px/mm, so the figures above decide.
- The four-side render (`iso\r_iso_fusee_…png`) shows the plate standing clear of the journal's shoulder, with about 4 mm of square showing under it.

---

## 05-06_07: the fusee wheel 05 06 00-3 (2:1, 1940); every version

### Step 4

| feature | sheet | model | diff | verdict | sure |
|---|---|---|---|---|---|
| teeth | Z 90, D 40,57 gewälzt, dg 37,84, M 0,4356 | 90; tips Ø 40.569, roots Ø 37.840 | 0 | match | sure |
| outside as turned | 40,65 −0,05, "gedreht 41,1" | the hobbed tips 40.57 | — | match (the blank's figure before hobbing) | sure |
| rim | 2,62 −0,04 | the lip Ø 32.3-33.8 at 2.620; rim and teeth 2.420 | — | match on the README's reading (the 2,62 to the lip alone) | likely |
| ledge | 0,2 +0,02 | 0.200 | lower limit | match | sure |
| Ø 33,8 −0,2 / 32,3 +0,05 | | 33.800 / 32.300 | 0 | match | sure |
| web | 1,22 −0,04 | 1.220 | upper limit | match | sure |
| hub | 16,6 −0,2, 45° | Ø 16.600, 45° flank 1.0 to the hub's face | upper limit | match | sure |
| hub's face under the lip | 0,4 −0,05 | 0.400 | upper limit | match | sure |
| tube outside | "6,6 +0,1" over a struck figure; drawn 43 px against the bore's 27 px (Ø 4.0), so Ø 6.3-6.4 (`b5m\g07h.png`) | **Ø 6.490** (6.5 g6) | −0.11 under 6.6 | estimate, recorded (README 822: kept for 01's 6,5 H7/g6 and the 1948 ratchet's 6,5 H7); F4 settled; wording M10 | sure |
| tube height | 5 +0,2 from the underside | 5.000 (to y −7.385) | lower limit | match | sure |
| bore | 4 +0,1 (drawn Ø 4.0) | **Ø 4.550** on the seat's 4.43-4.48: 0.035-0.06 clear on the radius | +0.45 | departs, recorded (README 822); F6 holds | sure |
| underside recess | 14 +0,1, 1,3 −0,1 | Ø 14.000 × 1.300 | lower / upper limit | match | sure |
| its mouth | 17 +0,2, 60° | Ø 17.100, the cone 60.0° from the axis (1.55 out over 0.895 up) | mid | match | likely (60° read from the axis, as on 08) |
| pin hole | 1,2 H8 +0,014 at r 14,2 −0,02 | Ø 1.207 at r 14.200, through the web | mid / upper limit | match | sure |
| "groove on the far face" (transcription) | the root circle, dashed | none | right | sure |

### Step 5

- The FFT registration of book p. 235's A-A on the 2:1 section failed: it locked onto the "Kante leicht brechen" note. The section was read instead at 6.8 px/mm (`b5m\g07.png`, `g07h.png`):
  - the hub stands 4.9 over the underside (33 px), as "5 +0,2" gives;
  - its outside is 6.3-6.4, its bore 4.0.
- `ov\s07_plan.png` registers the plan's rim and teeth. The pin hole is at 6 o'clock on the sheet; the book's view is reversed.
- Book p. 236 lists the underside recess as "countersunk to Ø 14.60", and prints a stray "−6.428571" in its fit column (M12).

---

## The chain's pin 05 06 00-6 (no sheet; its hole on 02-2)

| feature | source | model | verdict | sure |
|---|---|---|---|---|
| diameter | the hole's 0,55 +0,01 | Ø 0.550 in Ø 0.555 (0.0025 clear on the radius) | holds: captive, see J8 | sure |
| length | through both ribs | from the re-turned face to 0.05 short of the hole's floor (1.8) | match | sure |
| place | A, 1 under the rib tops | r 16.80, at A | match | sure |

## The up-and-down pinion 05 02 00-5 on the arbor's stub (no sheet; batch 7's part, its joint here)

| feature | source | model | verdict | sure |
|---|---|---|---|---|
| bore | 01: "1,6 Ø" in the sleeve 93 (r6 struck by revision a), "Festsitz"; 05 02_1: "1,6 Festsitz" | Ø 1.600 on the stub's 1.675-1.660 | holds: interference 0.030-0.0375 on the radius (EXPECTED), within the sheets' 0.025-0.05 | sure |
| place | 01: the dial 7 ±0,02 from the pillar plate's dial face; 05 02_1: 0,3 under the dial | y 7.05-10.05, its top 0.3 under the dial at 10.35 (3.35 + 7.0) | match | likely |
| relation | — | bom.json `050200-5` has no `rel` | minor (M5) | sure |

---

## Step 6, fit list

| # | piece | into/onto | hole or seat (sheet) | holding (sheet) | on the solid | verdict |
|---|---|---|---|---|---|---|
| J1 | body 05 06 04-2 | arbor's collar | 7 H7 on 7,04 −0,01 (02-2, 15) | press, face re-turned (03-2 note a) | Ø 7.006 on Ø 7.040: 0.034 interference over the collar's 7.9 | holds |
| J2 | click wheel | the recess floor | its Ø 2 1:8 holes over the M2s; bore 7,5 clear | 3 × WN-19 (03-2) | on the floor, holes over the M2s to 0.001; bore 0.24 clear of the arbor | holds |
| J3 | WN-19 | body | M2, 6 +0,5 deep | thread | head line to line in the 1:8 hole; shank Ø 2.0 in the plain Ø 2.04, 3.8 deep, **no thread drawn** | holds; fastener M11 |
| J4 | cover plate | arbor's step, body's small end | 6,1 H8 on 6,1 −0,05 (08, 15) | one screw WN-20 | Ø 6.109 on 6.100 (0.0045 on the radius), on the small end | holds |
| J5 | WN-20 | body | M1,7, 6 deep (02-2), coloured section | thread | head 0.025 down in its sink; M1.7 thread (KIT.threadGeo) 3.5 into the Ø 1.74 hole | holds |
| J6 | stop bar | slot 2 H8 | 02-2 C-D | slot and cover plate | batch 3 | — |
| J7 | pin 05 06 04-4 | body's 0,5 H7 | Ø 0,5 +0,022/+0,015 (03-2 item 5) | press: 0.006-0.022 interference | Ø 0.500 in Ø 0.5045: 0.0023 clear on the radius | **no (M4)** |
| J8 | chain pin 05 06 00-6 | both ribs | 0,55 +0,01 (02-2) | not given | Ø 0.550 in 0.555, its outer end flush with the face, 0.05 from the maintaining ratchet's plate; the hole blind 0.05 past its inner end: captive | holds (bom's `press` names a fit the solid hasn't: M5) |
| J9 | Vorreiber | arbor's 1:70 seat | 4,4 H7 1:70, "zur Welle passen" (06) | the pin | 0.01 clear on the radius, the pin not in the arbor: **nothing holds it** on the arbor, or the fusee wheel above it | **no (M3)** |
| J10 | Vorreiberstift 05 06 00-5 | Vorreiber and arbor | 0,8 (06), 1,1 taper-reamed (15) | pin | in the Vorreiber's holes line to line; **not in the arbor** | **no (M3)** |
| J11 | fusee wheel | the Vorreiber's flange; the arbor's seat | recess Ø 14 +0,1 × 1,3 −0,1 over the flange Ø 14 d11; bore (F6) | held axially by the flange, free to turn | recess floor on face a line to line (y −3.685); Ø 14.0 over Ø 13.895 (0.05 on the radius); bore 4.55 on 4.43-4.48 | holds (the bore recorded) |
| J12 | maintaining spring's pin 05 06 00-8 | wheel's 1,2 H8 at r 14,2 | 07 | pressed in the spring, running in the wheel (bom `run`) | Ø 1.2 in Ø 1.207, 1.18 down into the 1.22 web, centred on the hole (10.40, 9.67) | holds |
| J13 | dust plate | arbor's square | 3,1 H7 1:100 on 3,1 r6 1:100 (05, 15) | the taper's wedge | straight 3.134 on 3.10-3.13, loose, 4.0 from the shoulder | **no (M2, M1)** |
| J14 | arbor's pivot | pillar plate's hole 10 | 2,70 ±0,009 (05 08_3a) against the pivot's 2,8-2,7 | running | Ø 2.82 (reamed to the arbor), the pivot 2.800-2.752 in it | holds as recorded (README 820) |
| J15 | arbor's journal | fusee bush 05 08 01-2 | 4,1 +0,2 against 4,5-4,39 | running | Ø 4.52, the journal 4.500-4.400 in it; standing 0.975 proud of the bush, as the coloured section draws it | holds as recorded (README 820) |
| J16 | arbor's shoulders | plate and bush | 19,7 +0,05 | endshake | 19.700 between 19.750: 0.05 | holds |
| J17 | up-and-down pinion | arbor's stub | 1,6 on 1,6 +0,1/+0,05 | "Festsitz" (01, 05 02_1) | 0.030-0.0375 interference on the radius | holds |
| J18 | body's large face | maintaining ratchet's plate | 03-2's 0,5 to the click wheel, the stack | bears inside Ø 33 | 0.05 gap | holds |

---

## Extra checks

### (a) Slots, notches and grooves

| described | against the sheet's views | verdict |
|---|---|---|
| the groove, square-cut, rib 0.33 × 0.6, pitch 1.2 | A-B both halves, C-D's floors | built; holds |
| the flange's slot 0,87 | A-B top half (through A) | built all round, outside the cutter and the first turn's land. A-B's lower half doesn't draw it (M9) |
| the cutter at A, Ø 13,5, 2,9 deep | C-D (an arc in plan); A-B's top (the ribs whole) | built in the slot only; holds (F3) |
| the stop bar's slot 2 H8, 1,5 and 1,1 deep | C-D only, its two depths at its two ends | built; the step at u 8.0 is an estimate recorded (README 610, F8) |
| the Vorreiber's relief Ø 9,9 × 0,4 | section, end view | built; its depth against the README's record M6 |
| the dust plate's recess Ø 6,2 × 1,0 | section, end view | built, toward the key |
| the wheel's top recess Ø 32,3, the ledge, the underside recess Ø 14 | section, plan | built |
| the wheel's "groove on the far face" | it is the root circle | not built: right |
| the click wheel's tooth gaps | plan | built, undercut 8° |

### (b) Drawn holes (the reader's H1-H18)

| # | hole | present? | note |
|---|---|---|---|
| H1 | body bore 7 H7 | yes | Ø 7.006 |
| H2 | 3 × M2 6 +0,5 | yes | Ø 2.04 × 6.25 |
| H3 | M1,7 6 deep at r 6 | yes | |
| H4 | 0,5 H7 | yes | its pin M4 |
| H5 | 0,55 +0,01 axial | yes | |
| H6 | the circle at A | = H5 | F16 settled |
| H7 | arbor's cross hole 1,1 taper-reamed | yes, straight | taper recorded (README 613); empty: M3 |
| H8 | click wheel bore 7,5 +0,05 with chamfer | yes | |
| H9 | click wheel 3 × Ø 2 1:8 | yes | |
| H10 | wheel bore 4 +0,1 | 4.55 | recorded (F6) |
| H11 | wheel pin hole 1,2 H8 | yes | |
| H12 | wheel underside recess and mouth | yes | |
| H13 | cover plate's 6,1 H8 with land and sink | yes | |
| H14 | cover plate's 1,85 with 90° sink | yes | |
| H15 | Vorreiber's 4,4 H7 1:70 | yes | fitted to the seat (M5) |
| H16 | Vorreiber's 0,8 | yes | |
| H17 | dust plate's 3,1 □ H7 1:100 | straight 3.134 | M2 |
| H18 | pin 05 06 04-4 (in H4) | yes | Ø 0.500 (M4) |
| 1941 holes | 02-1, 03-1, 01 | not built | right: no version carries the 1941 fusee (README 438) |

### (c) Excuses

| entry | re-judged |
|---|---|
| checks.py EXPECTED ('fusee:Buffer','udPinion:Extrude'), the pinion pressed on the stub, 0.0375 | holds (J17) |
| ('chain:Extrude','fusee:Cylinder'), ('band:Extrude','fusee:Cylinder'): the round hooks on the pin | hold |
| ('band:Buffer','fusee:Lathe'): "the band in the fusee's groove … along the turned groove's walls (drawn as slopes over its 0.04 rows)" | **stale (M8)**. No fusee mesh is a LatheGeometry since the groove was swept with square walls (helixSolid, 27 October 2026); the key can match nothing, and its wording describes the old rows |
| ('band:Buffer','fusee:Buffer'): "where it runs through the small end's pieces …", 0.1/0.1 | **to re-run (M8)**: the whole body is now one Buffer, so this entry covers the whole groove under limits sized for the small end |
| ('stopWork:Buffer','stopWork:Cylinder') | batch 3 (its M-finding: doesn't hold) |
| HOLE_EXPECTED, audit LOOSE | none for these parts; holecheck passes all five versions; audit has nothing new |
| bom.json `dev` | none on these lines |
| bom.json `050604-2 round 050604-1 press` | holds (0.034) |
| bom.json `050600-2 round 050604-1 press` | passes on a 0.01 gap on the radius; not a press, and the Vorreiber is held by nothing (M3, M5) |
| bom.json `050600-5 in 050600-2 press` | holds; there is no relation for the arbor's hole, which it never enters (M3) |
| bom.json `050600-1 round 050604-1 press` | passes on a 0.004-0.034 gap; not a press (M2) |
| bom.json `050604-4 in 050604-2 press` | passes on a 0.0023 gap; not the sheet's press (M4) |
| bom.json `050600-6 in 050604-2 press` | 0.0025 gap; a slip fit, held captive (M5) |
| bom.json `WN-19 in 050604-2 tap` | passes without a thread (M11) |
| bom.json `050200-5` no `rel` | the press isn't in bom at all (M5) |
| README 124 "the square 3.17 r6" | **doesn't hold (M1)** |
| code: the dust plate "sits where the square is 3.1 across: 7 from its root" | falls with M1 and the coloured section (M2) |
| README 613: the Vorreiber's pin "drawn as its two ends … the Exploded view parts the two" | **doesn't hold as a joint (M3)**: an excuse of the tool, not of the sheets |
| README 607: the Vorreiber's relief "left 0.06-0.31 deep" | disagrees with the solid's 0.425 (M6) |
| README 820: the pivot and journal reamed to the arbor | holds |
| README 822: the wheel's bore 4.55 and tube 6.5 g6, "the tube's figure overwritten ('4,6' or '6,6')" | holds; the wording is M10 (the sheet reads 6,6 +0,1, drawn 6.3-6.4) |
| README 610: the slot's step at u 8.0 | holds as an estimate |
| README 438: the 1941 fusee not built as first drawn | holds (F15) |
| fusee.js: "turn 6, where the body's 10.07 is taken" | not in the README (M13) |

### (d) The blind reading's findings settled against the model

- **F1, F2, F5:** transcription misreadings. The model follows the right readings: the cover plate's land 0.4 on the body's face, the slot and 0,5 H7 at the small end, the "15" read as 1,5.
- **F3:** the model's cutter is in the slot only. The ribs are whole at A on the solid (r 17.8 both sides of the r 14.9 floor), as A-B's top draws them (likely).
- **F4:** settled. The sheet's hub is "6,6 +0,1", drawn 6.3-6.4. The model's 6.49 follows 01's 6,5 H7/g6 and the 1948 ratchet's 6,5 H7 bore, which a 6.6 tube couldn't enter. It stays as recorded, with the README's wording corrected (M10). Sure.
- **F6:** holds as recorded (README 822). The 4.55 bore is 0.035-0.06 clear of the seat.
- **F7:** the "1,2" on 01 stays unattached. The part sheets' 1.1 and 0.8 are built, but the joint fails on the solid (M3).
- **F8:** recorded estimate.
- **F9:** agreed. The sign doesn't change the 0.6.
- **F10:** the model takes 10.07, which differs from the curve's 10.04 by 0.03 at turn 6 (M13).
- **F11:** the recess toward the key matches the coloured section. The taper is missing (M2).
- **F12:** settled. 60° is taken from the axis, sure (the arc on the crop runs from the extension line parallel to the axis to the cone, 62.7°).
- **F13:** the model's undercut 8° at the tip. "12,5" stays unattached (possible).
- **F14:** no effect.
- **F15:** holds (above).
- **F16:** settled. The circle at A is H5 end-on (likely).

---

## Findings

Fourteen findings in all:

- **Wrong:** M1, M2.
- **Joint:** M3, M4.
- **Fit relations:** M5.
- **Text or record:** M6, M7, M10, M13.
- **Excuse:** M8.
- **Possible (sheet):** M9, M14.
- **Fastener:** M11.
- **Build book:** M12.

None changes the physics as the tools run it. M13 touches the fusee's curve by 0.03 mm at one turn, under 0.3 % of the radius there.

**M1. Wrong, 05-06_15 (every version), the winding square's size.**
- The sheet: "3,1 r6 +0,023/+0,015, Kegel 1:100", and "2,92" at the point.
  - The tolerances are r6's for 3-6 mm.
  - From 3.12, 1:100 over the square's 20.3 gives 2.917, the sheet's 2,92.
- The model: 3.170 at the root (README 124, "3.17 r6", the "r" read as a 7), 2.993 where the flats end, and a 38.7° cone to the point.
- How sure: sure.
- Correction: the square 3.119 (3.115-3.123) at the root, 1:100, the cone and both lengths kept. Then check the key's socket (05 01 02-3: 3,1 +0,05, batch 10), which now goes 1-2 mm further on, and re-place the dust plate (M2).
- Physics: no.

**M2. Wrong (hole and place), 05-06_05 and the coloured section (every version), the dust plate on the square.**
- The sheets: the hole 3,1 □ H7 +0,012, Kegel 1:100. The coloured section draws the plate on the square's root against the journal's shoulder, the journal 1.0 proud of the fusee bush.
- The model: a straight hole 3.134 across the flats, 0.022 over H7's top. It is placed 4.0 to 7.0 from the shoulder on the 3.17 square, 0.004-0.034 loose, and nothing holds it.
- How sure: sure for the hole, likely for the place.
- Correction: taper the hole 1:100, 3.106 at its plates-side face to 3.076 at its recessed face (H7's middle). On M1's square it then wedges with that face 1.3 from the shoulder (y −29.0). The coloured section's "on the shoulder" would need the hole at 3.119; both are within H7 against r6's band, so take the place between them. The dust bush's bore (Ø 7.8-8.0) clears the Ø 7.55 there. bom's relation stays `press`, now true.
- Physics: no.

**M3. Joint, 05-06_06, 05-06_15, 01 and the coloured section (every version), the Vorreiber's pin.**
- The sheets: one pin through the hub's Ø 0,8 and the arbor's cross hole ("1,1 bohren + konisch reiben", reamed at assembly with the Vorreiber, "Loch zur Welle passen"). The coloured section draws it through both and standing out of the hub on both sides.
- The model: two short ends in the hub, each stopping 0.012 short of the arbor's seat. The arbor's Ø 1.1 hole lies empty under them, lined up within 4°. The Vorreiber is 0.01 clear on its taper.
  - So on the solid nothing holds the Vorreiber, or through it the fusee wheel and maintaining work, on the arbor.
  - README 613 and bom.json give the Exploded view as the reason. That is the tool's need, not the part's.
- How sure: sure that the joint fails on the solid; possible for the pin's length.
- Correction:
  - One pin, Ø 0.8 (or a taper pin from 0.8, reamed through both, the taper estimated), through the hub and the arbor.
  - The arbor's hole drawn at the pin's size where it passes (the "konisch reiben").
  - The Vorreiber line to line on its taper.
  - The pin 0.6 proud of the hub each side (the coloured section, estimated).
  - The Exploded view and assembly.py moving the arbor, Vorreiber and pin together.
  - bom: `050600-5 in 050604-1 press`.
- Physics: no.

**M4. Joint (fit), 05-06_03-2 item 5 and 02-2 (every version), the stop bar's spring's pin 05 06 04-4.**
- The sheets: the pin Ø 0,5 +0,022/+0,015 in the body's 0,5 H7 (+0,009), so 0.006-0.022 interference.
- The model: Ø 0.500 in Ø 0.5045, 0.0023 clear on the radius. bom's `press` passes it.
- How sure: sure.
- Correction: the pin Ø 0.5185 (its band's middle) in the Ø 0.5045 hole, an interference of 0.007 on the radius; add a fine.py expected entry if the solids overlap.
- Physics: no.

**M5. Fit relations (bom.json and the solids), every version.**
- The cases:
  - The Vorreiber's `round 050604-1 press` is a 0.01 gap on the radius on a taper the sheet fits at assembly; it holds by its pin only (M3).
  - The chain pin's `in 050604-2 press` is a 0.0025 slip in the 0,55 +0,01 hole. It is captive between the hole's floor and the maintaining ratchet's plate, 0.05 off, and no sheet gives its fit.
  - The up-and-down pinion (050200-5) has no `rel` at all, though EXPECTED carries its press.
- How sure: sure.
- Correction:
  - The Vorreiber line to line (M3).
  - The chain pin's relation `in 050604-2 free` (or a pin of 0.56), with "captive" in its fn.
  - `050200-5`: `round 050604-1 press`.
  - With bom.py's press tolerance about to tighten to ≤ 0.02, these change from passing to failing.
- Physics: no.

**M6. Record, README Estimated (line 607) against the solid, the Vorreiber's relief.**
- The README: face a re-turned to 2.76 leaves the Ø 9.9 relief "0.06-0.31 deep, as it was made 3.1 or 2.9".
- The solid: 0.425 below the re-turned face (fusee.js line 527: `VFA+0.425`), the sheet's 0,4 +0,05 cut from the face as it is now.
- How sure: sure that they disagree; which is meant is likely the README's, since the sheet cuts the relief before the re-turn and the note re-turns face a at assembly.
- Correction: either cut the relief 0.16 deep (the middle of 0.06-0.31, from 3.0 made), or record that the relief is re-cut after the re-turn.
- Physics: no.

**M7. Text, fusee.js (the click wheel's bore chamfer).**
- The comment (lines 491-492) puts the chamfer "on the face its screw holes open 1:8 toward, the screws' heads' face, the free one: sure".
- The solid has it on the face against the recess floor, where the holes are narrow. That is what 05-06_16's section draws: the 45° at the top face, where the holes' Ø 2 is.
- How sure: sure.
- Correction: the comment only. The geometry is right.

**M8. Excuse, checks.py EXPECTED (the band in the groove).**
- The entries:
  - ('band:Buffer','fusee:Lathe') can match nothing since the body was swept with square walls (no fusee mesh is a LatheGeometry), and its text describes the old 0.04 rows.
  - ('band:Buffer','fusee:Buffer') now stands for the whole body under the small end's 0.1 mm³/0.1 limits.
- How sure: sure for the first, likely for the second.
- Correction: run fine.py with `conn=band`. Drop the Lathe entry, and re-word or re-size the Buffer one to what the 0.78 band in the 0.87 land actually gives (none, if the walls are square).
- Physics: no.

**M9. Possible (sheet), 02-2 Schnitt A-B's lower half, the flange's slot away from A.**
- The sheet: at B (180° from A) the large end is drawn as one block at the full radius for about 1.2, then the first land, with no slot. The A half draws both ribs and the 0,87 slot.
- The model: the slot (floor r 17.25, 0.55 under the ribs) runs all round outside the cutter's arc, except where the first turn's land cuts through it.
- How sure: possible. The half isn't to scale (its ribs are drawn 1.1 high for 0.6), and a slot only at A would leave the chain's first turn (level in the slot by the hook) nowhere to run.
- Proposal: record in README Unresolved; keep the model.
- Physics: no.

**M10. Text, README "Readings corrected" (line 822), the fusee wheel's tube.**
- The README calls the tube's figure "overwritten ('4,6' or '6,6')".
- The sheet: "6,6 +0,1", the 6 written over a 4. The section draws the hub 43 px against the bore's 27 px (Ø 4.0), so 6.3-6.4 (`b5m\g07h.png`, 6.8 px/mm by the 33,8).
- How sure: likely.
- Correction: record the sheet's 6,6 +0,1, and that the model's 6.5 g6 follows 01's fit and the 1948 ratchet's 6,5 H7 bore, which a 6.6 tube couldn't enter. The model is unchanged.
- Physics: no.

**M11. Fastener, the click wheel's screws WN-19 (every version).**
- The source: the body's M2 (02-2), 6 +0,5 deep.
- The model: a plain Ø 2.0 shank 3.8 into the plain Ø 2.04 hole. WN-20 and WN-21 carry ISO thread geometry (since 3.35.00); WN-19 has none.
- How sure: likely (the threads' pass may have left it on purpose; nothing says so).
- Correction: `KIT.threadGeo` on the shank (M2, 0.4 pitch) as on WN-20.
- Physics: no.

**M12. Build book (pp. 210-236).**
- The pages:
  - p. 210: the body's level figures are printed above the frame.
  - p. 211's text: "leaves it over a flat milled across the flange" is the transcription's misreading (F3). The model has a slitting cutter in the slot.
  - p. 214: the arbor's "Ø 6.08, Ø 7.02" are the lathe's facet flats (6.100, 7.040). No square size, tapers or cross hole are given.
  - pp. 224-225: the cover plate's screw hole is drawn as two arcs "( )" and isn't listed.
  - p. 230: the Vorreiber's "bores Ø 9.95" is its relief. Its 4.4 1:70 bore and Ø 0.8 cross hole are missing.
  - p. 236: the wheel's underside recess is listed as "countersunk to Ø 14.60", with a stray "−6.428571" in its fit column.
  - p. 216: the click wheel's 1:8 holes are listed as Ø 2.00 with a "sink Ø 2.25 × 0.19", the taper not named.
- How sure: sure.
- Correction: drawbook, as batches 3 and 4's (turned parts' diameters from their profile, not their facets; holes across a turned part probed along their own axes; text from the code's readings, not the transcription's).

**M13. Record, the fourth groove radius (F10), 02-1, 02-2, 05-06_20.**
- The sheets: 10,04 on the curve (clear); 10,07 or 10,04 on the bodies, its last digit not legible at 1024 px. On 02-2's crop it reads more like 7.
- The model: 10.07. The README doesn't say so; only fusee.js's comment does.
- How sure: possible.
- Correction: add to README Readings corrected or Estimated: 10.07 taken from the body, the curve 10.04, 0.03 at turn 6.
- Physics: no measurable effect: 0.3 % of the radius at one turn, interpolated over a quarter turn each side.

**M14. Possible, 05-06_15 (every version), the stub's taper.**
- The sheet: "1:70" written on the Ø 1,6 +0,1/+0,05 stub, like every round portion.
- The model: Ø 1.675 → 1.660 over 3.375 (1:225).
- How sure: possible (the "1:70" there is legible; the stub is in band either way).
- Correction: 1.700 → 1.652 over the 3.375 (1:70 within the band). The pinion's press then runs 0.026-0.05 on the radius, within the sheets' figures.
- Physics: no.
